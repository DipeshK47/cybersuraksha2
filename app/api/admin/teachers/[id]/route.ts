import { and, eq } from "drizzle-orm";
import { getDb } from "../../../../../db";
import { teachers } from "../../../../../db/schema";
import { requireRole } from "../../../../lib/auth";
import { writeAudit } from "../../../../lib/audit";
import { parseJson, teacherStatusSchema } from "../../../../lib/validation";

const NEXT_STATUS: Record<string, "active" | "suspended"> = {
  approve: "active",
  reactivate: "active",
  suspend: "suspended",
};

/**
 * Change a teacher's account status within the admin's own school:
 *   approve    pending  -> active
 *   suspend    *        -> suspended
 *   reactivate suspended-> active
 */
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const auth = await requireRole(request, "school_admin");
  if (auth instanceof Response) return auth;

  const { id } = await context.params;
  const teacherId = Number(id);
  if (!Number.isInteger(teacherId)) {
    return Response.json({ error: "Invalid teacher." }, { status: 400 });
  }
  if (teacherId === auth.id) {
    return Response.json(
      { error: "You cannot change your own account status." },
      { status: 400 },
    );
  }

  const parsed = await parseJson(request, teacherStatusSchema);
  if (parsed.error) return parsed.error;
  const action = parsed.data.action;
  const nextStatus = NEXT_STATUS[action];

  // Scope: only teachers in the admin's school can be modified.
  const [target] = await getDb()
    .select({ id: teachers.id, status: teachers.status })
    .from(teachers)
    .where(and(eq(teachers.id, teacherId), eq(teachers.schoolId, auth.schoolId)))
    .limit(1);
  if (!target) {
    return Response.json({ error: "Teacher not found." }, { status: 404 });
  }

  const [updated] = await getDb()
    .update(teachers)
    .set({ status: nextStatus })
    .where(and(eq(teachers.id, teacherId), eq(teachers.schoolId, auth.schoolId)))
    .returning({
      id: teachers.id,
      name: teachers.name,
      email: teachers.email,
      role: teachers.role,
      status: teachers.status,
    });

  await writeAudit({
    actorTeacherId: auth.id,
    action: `teacher.${action}`,
    targetType: "teacher",
    targetId: teacherId,
    metadata: { from: target.status, to: nextStatus },
  });

  return Response.json({ teacher: updated });
}
