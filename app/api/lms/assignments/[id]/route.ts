import { saveAssignment } from "../../../../lib/save-assignment";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "../../../../../db";
import { classes, students } from "../../../../../db/schema";
import { assignmentReport, publishAssignment } from "../../../../../db/lms";
import { teacherAssignment, schoolAssignmentAvailable } from "../../../../lib/assignment-access";
import { schoolContent } from "../../../../lib/content-access";
import { parseJson } from "../../../../lib/validation";
import { writeAudit } from "../../../../lib/audit";

type Context = { params: Promise<{ id: string }> };
export async function GET(request: Request, context: Context) {
  const result = await teacherAssignment(request, Number((await context.params).id));
  if (result instanceof Response) return result;
  const { assignment, auth } = result;
  return Response.json({ assignment, canEdit: auth.role === "school_admin" || auth.id === assignment.teacherId, students: await assignmentReport(assignment) });
}
export async function PATCH(request: Request, context: Context) {
  const result = await teacherAssignment(request, Number((await context.params).id), true);
  if (result instanceof Response) return result;
  const { assignment, auth } = result;
  const parsed = await parseJson(request, z.object({ publish: z.literal(true) }));
  if (parsed.error) return parsed.error;
  if (assignment.publishedAt != null) return Response.json({ assignment });
  const [classroom] = await getDb().select().from(classes).where(eq(classes.id, assignment.classId));
  if (!(await schoolContent(auth.schoolId)).grades.includes(classroom.grade) || !await schoolAssignmentAvailable(assignment)) return Response.json({ error: "Enable the assignment’s curriculum before publishing." }, { status: 400 });
  if (assignment.dueAt <= Date.now()) return Response.json({ error: "This draft's deadline has passed. Create an assignment with a future deadline." }, { status: 400 });
  const roster = await getDb().select({ id: students.id }).from(students).where(and(eq(students.classId, assignment.classId), eq(students.schoolId, auth.schoolId))).limit(1);
  if (!roster.length) return Response.json({ error: "Add students to this class before publishing." }, { status: 400 });
  if (!await publishAssignment(assignment)) return Response.json({ error: "This assignment changed in another tab. Reload before publishing." }, { status: 409 });
  await writeAudit({ actorTeacherId: auth.id, action: "assignment.publish", targetType: "assignment", targetId: assignment.id });
  return Response.json({ ok: true });
}

export async function PUT(request: Request, context: Context) {
  return saveAssignment(request, Number((await context.params).id));
}
