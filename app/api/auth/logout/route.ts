import { destroySession } from "../../../lib/session";
import { destroyStudentSession } from "../../../lib/student-session";

/** Destroy whichever session (teacher or student) the caller holds. */
export async function POST(request: Request) {
  const teacherClear = await destroySession(request);
  const studentClear = await destroyStudentSession(request);
  const headers = new Headers();
  headers.append("Set-Cookie", teacherClear);
  headers.append("Set-Cookie", studentClear);
  return Response.json({ ok: true }, { headers });
}
