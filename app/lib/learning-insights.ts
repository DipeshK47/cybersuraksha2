import type { LearningAttempt, LearningEvent } from "./lms-summary";
import type { AssignmentQuestion, QuestionGrade } from "./assignment-assessment";

export type TopicInsight = { topic: string; source: string; attempted: number; wrong: number; marks: number; possible: number; accuracy: number; status: string; recommendation: string };

/** Use the latest attempt and first answer so retries cannot hide a weak section. */
export function learningInsights(input: {
  attempts: LearningAttempt[]; events: (LearningEvent & { attemptId: string })[];
  practice: { chapterSlug: string; topicSlug: string; isCorrect: number }[];
  custom: { questions: AssignmentQuestion[]; grades: QuestionGrade[] }[];
}) {
  const topics = new Map<string, Omit<TopicInsight, "accuracy" | "status" | "recommendation">>();
  function add(topic: string, source: string, marks: number, possible: number) {
    const key = `${source}:${topic}`;
    const row = topics.get(key) ?? { topic, source, attempted: 0, wrong: 0, marks: 0, possible: 0 };
    row.attempted++; row.wrong += marks < possible ? 1 : 0; row.marks += marks; row.possible += possible;
    topics.set(key, row);
  }
  const latest = new Map<string, LearningAttempt>();
  for (const attempt of input.attempts) {
    const previous = latest.get(attempt.moduleId);
    if (!previous || attempt.startedAt > previous.startedAt || (attempt.startedAt === previous.startedAt && attempt.id > previous.id)) latest.set(attempt.moduleId, attempt);
  }
  const seen = new Set<string>();
  for (const event of [...input.events].sort((a, b) => a.createdAt - b.createdAt)) {
    if (event.type !== "question_answered") continue;
    const attempt = input.attempts.find(a => a.id === event.attemptId);
    if (!attempt || latest.get(attempt.moduleId)?.id !== attempt.id) continue;
    let p: Record<string, unknown>;
    try { p = JSON.parse(event.payload); } catch { continue; }
    if (!p || typeof p !== "object" || typeof p.id !== "string" || typeof p.correct !== "boolean") continue;
    const key = `${event.attemptId}:${p.id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    add(`${attempt.moduleId} · ${String(p.category ?? "Practice")}`, "Lesson practice", p.correct ? 1 : 0, 1);
  }
  for (const p of input.practice) add(`${p.chapterSlug} · ${p.topicSlug}`, "Subject practice", p.isCorrect === 1 ? 1 : 0, 1);
  for (const submission of input.custom) for (const q of submission.questions) {
    const grade = submission.grades.find(g => g.questionId === q.id);
    if (grade?.marks != null) add(q.topic, "Assignment", grade.marks, q.marks);
  }
  return [...topics.values()].map(row => {
    const accuracy = Math.round(row.marks / row.possible * 100);
    const status = row.attempted < 3 ? "Limited evidence" : accuracy < 60 ? "Needs attention" : accuracy < 80 ? "Developing" : "Secure";
    const recommendation = row.attempted < 3 ? "Complete more questions before drawing a conclusion." : accuracy < 60 ? "Revisit this section, work through an example, then practise again." : accuracy < 80 ? "Review the mistakes and try another practice activity." : "Continue to the next topic and revisit this one later.";
    return { ...row, accuracy, status, recommendation };
  }).sort((a, b) => a.accuracy - b.accuracy || b.attempted - a.attempted);
}
