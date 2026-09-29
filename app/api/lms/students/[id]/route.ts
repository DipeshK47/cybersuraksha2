import { eq } from "drizzle-orm";
import { getDb } from "../../../../../db";
import { questionAttempts, topicProgress } from "../../../../../db/schema";
import { learnerHistory, studentAssignments } from "../../../../../db/lms";
import { getAccessibleStudent, requireTeacher } from "../../../../lib/auth";
export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireTeacher(request); if (auth instanceof Response) return auth;
  const id = Number((await context.params).id);
  if (!Number.isInteger(id)) return Response.json({ error: "Invalid student." }, { status: 400 });
  const student = await getAccessibleStudent(auth, id);
  if (!student) return Response.json({ error: "Student not found." }, { status: 404 });
  const history = await learnerHistory(id);
  const practice = await getDb().select().from(questionAttempts).where(eq(questionAttempts.studentId, id));
  const topics = await getDb().select().from(topicProgress).where(eq(topicProgress.studentId, id));
  return Response.json({ student: { id: student.id, name: student.name, rollNo: student.rollNo, className: student.className }, ...history, practice, topics, assignments: await studentAssignments(id) });
}
