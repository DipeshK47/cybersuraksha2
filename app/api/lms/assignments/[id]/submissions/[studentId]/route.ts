import { and, eq } from "drizzle-orm";
import { getDb } from "../../../../../../../db";
import { assignmentSubmissions } from "../../../../../../../db/schema";
import { teacherAssignment } from "../../../../../../lib/assignment-access";
import { getAccessibleStudent } from "../../../../../../lib/auth";
import { gradingSchema, type AssignmentQuestion } from "../../../../../../lib/assignment-assessment";
import { parseJson } from "../../../../../../lib/validation";
import { writeAudit } from "../../../../../../lib/audit";

export async function PATCH(request: Request, context: { params: Promise<{ id: string; studentId: string }> }) {
  const params = await context.params;
  const result = await teacherAssignment(request, Number(params.id), true);
  if (result instanceof Response) return result;
  const studentId = Number(params.studentId);
  const student = Number.isSafeInteger(studentId) ? await getAccessibleStudent(result.auth, studentId) : null;
  if (!student || student.classId !== result.assignment.classId) return Response.json({ error: "Student not found." }, { status: 404 });
  const parsed = await parseJson(request, gradingSchema);
  if (parsed.error) return parsed.error;
  const questions: AssignmentQuestion[] = JSON.parse(result.assignment.questions);
  const { grades, feedback } = parsed.data;
  if (grades.length !== questions.length || new Set(grades.map(g => g.questionId)).size !== questions.length || grades.some(g => { const q = questions.find(q => q.id === g.questionId); return !q || g.marks > q.marks; })) return Response.json({ error: "Provide one mark per question, within that question’s maximum." }, { status: 400 });
  const [submission] = await getDb().update(assignmentSubmissions).set({ grades: JSON.stringify(grades), feedback, gradedAt: Date.now(), gradedBy: result.auth.id }).where(and(eq(assignmentSubmissions.assignmentId, result.assignment.id), eq(assignmentSubmissions.studentId, studentId))).returning();
  if (!submission) return Response.json({ error: "This student has not submitted answers yet." }, { status: 404 });
  await writeAudit({ actorTeacherId: result.auth.id, action: "assignment.grade", targetType: "submission", targetId: submission.id, metadata: { grades, feedback } });
  return Response.json({ submission });
}
