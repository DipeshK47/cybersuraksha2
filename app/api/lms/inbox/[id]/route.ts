import { and, eq } from "drizzle-orm";
import { getDb } from "../../../../../db";
import { assignmentSubmissions } from "../../../../../db/schema";
import { studentAssignment } from "../../../../lib/assignment-access";
import { autoGrade, studentQuestions, submissionSchema, type AssignmentQuestion } from "../../../../lib/assignment-assessment";
import { parseJson } from "../../../../lib/validation";

type Context = { params: Promise<{ id: string }> };
export async function GET(request: Request, context: Context) {
  const result = await studentAssignment(request, Number((await context.params).id));
  if (result instanceof Response) return result;
  const { assignment, session } = result;
  const [submission] = await getDb().select().from(assignmentSubmissions).where(and(eq(assignmentSubmissions.assignmentId, assignment.id), eq(assignmentSubmissions.studentId, session.student.id)));
  return Response.json({ assignment: { ...assignment, questions: studentQuestions(assignment.questions) }, submission: submission ?? null });
}

export async function POST(request: Request, context: Context) {
  const result = await studentAssignment(request, Number((await context.params).id));
  if (result instanceof Response) return result;
  const { assignment, session } = result;
  const parsed = await parseJson(request, submissionSchema);
  if (parsed.error) return parsed.error;
  const questions: AssignmentQuestion[] = JSON.parse(assignment.questions);
  const answers = parsed.data.answers;
  if (!questions.length || Object.keys(answers).length !== questions.length || questions.some(q => !answers[q.id] || (q.type === "choice" && !q.options.includes(answers[q.id])))) return Response.json({ error: "Answer every question using its available options." }, { status: 400 });
  const now = Date.now();
  const grades = autoGrade(questions, answers);
  const [submission] = await getDb().insert(assignmentSubmissions).values({ assignmentId: assignment.id, studentId: session.student.id, answers: JSON.stringify(answers), grades: JSON.stringify(grades), submittedAt: now, gradedAt: grades.every(g => g.marks != null) ? now : null }).onConflictDoNothing().returning();
  if (!submission) return Response.json({ error: "Your answers have already been submitted." }, { status: 409 });
  return Response.json({ submission }, { status: 201 });
}
