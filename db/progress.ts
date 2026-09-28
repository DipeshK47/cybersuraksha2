import { and, eq, sql } from "drizzle-orm";
import { getDb } from ".";
import { ensureMigrated } from "./migrate";
import { chapterProgress, questionAttempts, topicProgress } from "./schema";
import {
  CHAPTER8,
  MARKS_PER_QUESTION,
  TOPIC_COUNT,
  lookupQuestion,
} from "../app/data/practice-bank";

export type AttemptResult =
  | { status: "unknown-question" }
  | { status: "already-answered" }
  | {
      status: "recorded";
      isCorrect: boolean;
      marksAwarded: number;
      marksPossible: number;
    };

/**
 * Record one practice answer and roll it up.
 *
 * Grading happens HERE, from the shared question bank, against a studentId that
 * came from a verified session. The caller passes only the option that was
 * clicked.
 *
 * Practice is one shot, and that rule lives in the database rather than in the
 * UI: `question_attempts` has UNIQUE(student_id, question_id), so a replayed
 * request, a double-click, or two racing tabs cannot award marks twice. The
 * insert is `onConflictDoNothing`, so a repeat is a no-op that reports
 * "already-answered" instead of an error.
 */
export async function recordPracticeAttempt(input: {
  studentId: number;
  questionId: string;
  chosen: string;
  timeTakenMs?: number;
  hintsUsed?: number;
}): Promise<AttemptResult> {
  const entry = lookupQuestion(input.questionId);
  if (!entry) return { status: "unknown-question" };

  const isCorrect = input.chosen === entry.question.correct;
  const marksAwarded = isCorrect ? MARKS_PER_QUESTION : 0;
  const { subject, chapterSlug } = CHAPTER8;
  const { topicSlug, topicTotal } = entry;

  await ensureMigrated();
  const db = getDb();

  const inserted = await db
    .insert(questionAttempts)
    .values({
      studentId: input.studentId,
      questionId: input.questionId,
      subject,
      chapterSlug,
      topicSlug,
      chosen: input.chosen,
      isCorrect: isCorrect ? 1 : 0,
      marksAwarded,
      marksPossible: MARKS_PER_QUESTION,
      timeTakenMs: input.timeTakenMs ?? null,
      hintsUsed: input.hintsUsed ?? 0,
    })
    .onConflictDoNothing()
    .returning({ id: questionAttempts.id });

  // The unique index refused it: this question was already answered. Return
  // without touching the rollups, or a retry would inflate the totals.
  if (inserted.length === 0) return { status: "already-answered" };

  await db
    .insert(topicProgress)
    .values({
      studentId: input.studentId,
      subject,
      chapterSlug,
      topicSlug,
      questionsTotal: topicTotal,
      questionsAttempted: 1,
      questionsCorrect: isCorrect ? 1 : 0,
      marksAwarded,
      marksPossible: MARKS_PER_QUESTION,
      completedAt: topicTotal === 1 ? sql`CURRENT_TIMESTAMP` : null,
    })
    .onConflictDoUpdate({
      target: [
        topicProgress.studentId,
        topicProgress.subject,
        topicProgress.chapterSlug,
        topicProgress.topicSlug,
      ],
      set: {
        // Re-stated rather than incremented, so adding a question to a topic
        // corrects the denominator on the next answer instead of staying stale.
        questionsTotal: topicTotal,
        questionsAttempted: sql`${topicProgress.questionsAttempted} + 1`,
        questionsCorrect: sql`${topicProgress.questionsCorrect} + ${isCorrect ? 1 : 0}`,
        marksAwarded: sql`${topicProgress.marksAwarded} + ${marksAwarded}`,
        marksPossible: sql`${topicProgress.marksPossible} + ${MARKS_PER_QUESTION}`,
        lastActiveAt: sql`CURRENT_TIMESTAMP`,
        completedAt: sql`CASE
          WHEN ${topicProgress.completedAt} IS NOT NULL THEN ${topicProgress.completedAt}
          WHEN ${topicProgress.questionsAttempted} + 1 >= ${topicTotal} THEN CURRENT_TIMESTAMP
          ELSE NULL END`,
      },
    });

  await rollUpChapter(input.studentId);

  return {
    status: "recorded",
    isCorrect,
    marksAwarded,
    marksPossible: MARKS_PER_QUESTION,
  };
}

/**
 * Recompute the chapter row from its topic rows.
 *
 * Deliberately a recompute and not another increment: it reads at most one row
 * per topic through `topic_progress_unique_idx`, and in exchange the chapter
 * totals can never drift out of step with the topics they summarise.
 */
async function rollUpChapter(studentId: number) {
  const db = getDb();
  const { subject, chapterSlug } = CHAPTER8;

  const [totals] = await db
    .select({
      topicsCompleted: sql<number>`SUM(CASE WHEN ${topicProgress.completedAt} IS NOT NULL THEN 1 ELSE 0 END)`,
      marksAwarded: sql<number>`SUM(${topicProgress.marksAwarded})`,
      marksPossible: sql<number>`SUM(${topicProgress.marksPossible})`,
    })
    .from(topicProgress)
    .where(
      and(
        eq(topicProgress.studentId, studentId),
        eq(topicProgress.subject, subject),
        eq(topicProgress.chapterSlug, chapterSlug),
      ),
    );

  const topicsCompleted = Number(totals?.topicsCompleted ?? 0);
  const marksAwarded = Number(totals?.marksAwarded ?? 0);
  const marksPossible = Number(totals?.marksPossible ?? 0);
  const finished = topicsCompleted >= TOPIC_COUNT;

  await db
    .insert(chapterProgress)
    .values({
      studentId,
      subject,
      chapterSlug,
      topicsTotal: TOPIC_COUNT,
      topicsCompleted,
      marksAwarded,
      marksPossible,
      completedAt: finished ? sql`CURRENT_TIMESTAMP` : null,
    })
    .onConflictDoUpdate({
      target: [
        chapterProgress.studentId,
        chapterProgress.subject,
        chapterProgress.chapterSlug,
      ],
      set: {
        topicsTotal: TOPIC_COUNT,
        topicsCompleted,
        marksAwarded,
        marksPossible,
        lastActiveAt: sql`CURRENT_TIMESTAMP`,
        // Sticky: finishing the chapter is a fact about the past, so a later
        // question count change must not silently un-complete it.
        completedAt: finished
          ? sql`COALESCE(${chapterProgress.completedAt}, CURRENT_TIMESTAMP)`
          : chapterProgress.completedAt,
      },
    });
}

/** Everything a student's own progress view needs, in two indexed reads. */
export async function getChapterProgress(studentId: number) {
  await ensureMigrated();
  const db = getDb();
  const { subject, chapterSlug } = CHAPTER8;

  const [chapter] = await db
    .select()
    .from(chapterProgress)
    .where(
      and(
        eq(chapterProgress.studentId, studentId),
        eq(chapterProgress.subject, subject),
        eq(chapterProgress.chapterSlug, chapterSlug),
      ),
    )
    .limit(1);

  const topics = await db
    .select()
    .from(topicProgress)
    .where(
      and(
        eq(topicProgress.studentId, studentId),
        eq(topicProgress.subject, subject),
        eq(topicProgress.chapterSlug, chapterSlug),
      ),
    );

  return { chapter: chapter ?? null, topics };
}

/** Which questions this student has already used up, so the UI can lock them. */
export async function getAnsweredQuestions(studentId: number) {
  await ensureMigrated();
  return getDb()
    .select({
      questionId: questionAttempts.questionId,
      chosen: questionAttempts.chosen,
      isCorrect: questionAttempts.isCorrect,
    })
    .from(questionAttempts)
    .where(
      and(
        eq(questionAttempts.studentId, studentId),
        eq(questionAttempts.chapterSlug, CHAPTER8.chapterSlug),
      ),
    );
}
