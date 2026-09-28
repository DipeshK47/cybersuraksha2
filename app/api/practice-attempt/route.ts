import { getAnsweredQuestions, recordPracticeAttempt } from "../../../db/progress";
import { getStudentSession, requireStudent } from "../../lib/student-session";
import { parseJson, practiceAttemptSchema } from "../../lib/validation";

/**
 * Record one practice answer for the SIGNED-IN student.
 *
 * The studentId comes from the verified session and never from the body, so a
 * student cannot post marks for a classmate. The body carries only the option
 * that was clicked — the server grades it against the question bank, because a
 * client-reported verdict is worth nothing.
 *
 * Practice is one shot. A second answer to the same question is refused by
 * `question_attempts`' unique index and reported as 409, so the marks already
 * recorded stand.
 */
export async function POST(request: Request) {
  const session = await requireStudent(request);
  if (session instanceof Response) return session;

  const parsed = await parseJson(request, practiceAttemptSchema);
  if (parsed.error) return parsed.error;

  const result = await recordPracticeAttempt({
    studentId: session.student.id,
    ...parsed.data,
  });

  if (result.status === "unknown-question") {
    return Response.json({ error: "Unknown question." }, { status: 404 });
  }
  if (result.status === "already-answered") {
    return Response.json(
      { error: "This question has already been answered.", alreadyAnswered: true },
      { status: 409 },
    );
  }
  return Response.json(result);
}

/**
 * The questions this student has already used up, so a reload keeps them locked.
 *
 * A signed-out visitor gets `signedIn: false` and an empty history rather than a
 * 401. Nothing is disclosed — they have no history — and it lets the lesson tell
 * the difference between "no marks are being recorded" and "no marks yet", so it
 * can stop firing answer posts that could only ever fail.
 */
export async function GET(request: Request) {
  const session = await getStudentSession(request);
  if (!session) return Response.json({ signedIn: false, answered: {} });

  const attempts = await getAnsweredQuestions(session.student.id);
  return Response.json({
    signedIn: true,
    answered: Object.fromEntries(
      attempts.map((a) => [a.questionId, { chosen: a.chosen, correct: a.isCorrect === 1 }]),
    ),
  });
}
