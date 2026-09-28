import { getScopedAcademyData } from "../../../db/academy";
import { requireTeacher, scopedStudentIds } from "../../lib/auth";

/** Roster + runs, scoped to the classes the signed-in teacher can access. */
export async function GET(request: Request) {
  const auth = await requireTeacher(request);
  if (auth instanceof Response) return auth;
  try {
    const studentIds = await scopedStudentIds(auth);
    return Response.json(await getScopedAcademyData(studentIds));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to load academy data";
    return Response.json({ error: message }, { status: 500 });
  }
}
