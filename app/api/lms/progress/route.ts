import { learningReport } from "../../../../db/learning-report";
import { requireStudent } from "../../../lib/student-session";

export async function GET(request: Request) {
  const session = await requireStudent(request);
  if (session instanceof Response) return session;
  return Response.json(await learningReport(session.student));
}
