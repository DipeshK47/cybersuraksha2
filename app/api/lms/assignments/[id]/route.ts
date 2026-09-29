import { and, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "../../../../../db";
import { assignments } from "../../../../../db/schema";
import { assignmentReport, publishAssignment } from "../../../../../db/lms";
import { requireTeacher, scopedClassIds } from "../../../../lib/auth";
import { parseJson } from "../../../../lib/validation";

type Context = { params: Promise<{ id: string }> };
async function accessible(request: Request, context: Context) {
  const auth = await requireTeacher(request); if (auth instanceof Response) return auth;
  const id = Number((await context.params).id);
  const ids = await scopedClassIds(auth);
  if (!Number.isInteger(id) || !ids.length) return Response.json({ error: "Assignment not found." }, { status: 404 });
  const [assignment] = await getDb().select().from(assignments).where(and(eq(assignments.id, id), inArray(assignments.classId, ids), eq(assignments.schoolId, auth.schoolId)));
  return assignment ?? Response.json({ error: "Assignment not found." }, { status: 404 });
}
export async function GET(request: Request, context: Context) {
  const assignment = await accessible(request, context); if (assignment instanceof Response) return assignment;
  return Response.json({ assignment, students: await assignmentReport(assignment) });
}
export async function PATCH(request: Request, context: Context) {
  const assignment = await accessible(request, context); if (assignment instanceof Response) return assignment;
  const parsed = await parseJson(request, z.object({ publish: z.literal(true) })); if (parsed.error) return parsed.error;
  if (assignment.publishedAt != null) return Response.json({ assignment });
  if (assignment.dueAt <= Date.now()) return Response.json({ error: "This draft's deadline has passed. Create an assignment with a future deadline." }, { status: 400 });
  await publishAssignment(assignment);
  return Response.json({ ok: true });
}
