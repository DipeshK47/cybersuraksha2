import { learningReport } from "../../../../../db/learning-report";
import { getAccessibleStudent, requireTeacher } from "../../../../lib/auth";
export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireTeacher(request); if (auth instanceof Response) return auth;
  const id = Number((await context.params).id);
  if (!Number.isInteger(id)) return Response.json({ error: "Invalid student." }, { status: 400 });
  const student = await getAccessibleStudent(auth, id);
  if (!student) return Response.json({ error: "Student not found." }, { status: 404 });
  return Response.json(await learningReport(student));
}
