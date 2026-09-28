import { and, eq, inArray } from "drizzle-orm";
import { getDb } from "../../../../../../db";
import { classes, teacherClasses, teachers } from "../../../../../../db/schema";
import { requireRole } from "../../../../../lib/auth";
import { writeAudit } from "../../../../../lib/audit";
import { parseJson, teacherClassesSchema } from "../../../../../lib/validation";

async function loadTeacherInSchool(teacherId: number, schoolId: number) {
  const [teacher] = await getDb()
    .select({ id: teachers.id, role: teachers.role })
    .from(teachers)
    .where(and(eq(teachers.id, teacherId), eq(teachers.schoolId, schoolId)))
    .limit(1);
  return teacher ?? null;
}

/** Current class assignments for a teacher. */
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const auth = await requireRole(request, "school_admin");
  if (auth instanceof Response) return auth;

  const teacherId = Number((await context.params).id);
  if (!Number.isInteger(teacherId)) {
    return Response.json({ error: "Invalid teacher." }, { status: 400 });
  }
  if (!(await loadTeacherInSchool(teacherId, auth.schoolId))) {
    return Response.json({ error: "Teacher not found." }, { status: 404 });
  }

  const rows = await getDb()
    .select({ id: classes.id, name: classes.name })
    .from(teacherClasses)
    .innerJoin(classes, eq(teacherClasses.classId, classes.id))
    .where(eq(teacherClasses.teacherId, teacherId));

  return Response.json({ classes: rows });
}

/**
 * Replace a teacher's class assignments with the provided set. All class ids
 * must belong to the admin's school. This is the tenancy control: a teacher
 * can only ever see students in the classes assigned here.
 */
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const auth = await requireRole(request, "school_admin");
  if (auth instanceof Response) return auth;

  const teacherId = Number((await context.params).id);
  if (!Number.isInteger(teacherId)) {
    return Response.json({ error: "Invalid teacher." }, { status: 400 });
  }
  const teacher = await loadTeacherInSchool(teacherId, auth.schoolId);
  if (!teacher) {
    return Response.json({ error: "Teacher not found." }, { status: 404 });
  }

  const parsed = await parseJson(request, teacherClassesSchema);
  if (parsed.error) return parsed.error;
  const requestedIds = Array.from(new Set(parsed.data.classIds));

  // Every requested class must belong to this school — no cross-tenant grants.
  let validIds: number[] = [];
  if (requestedIds.length > 0) {
    const owned = await getDb()
      .select({ id: classes.id })
      .from(classes)
      .where(
        and(
          eq(classes.schoolId, auth.schoolId),
          inArray(classes.id, requestedIds),
        ),
      );
    validIds = owned.map((row) => row.id);
    if (validIds.length !== requestedIds.length) {
      return Response.json(
        { error: "One or more classes are not in your school." },
        { status: 400 },
      );
    }
  }

  const db = getDb();
  await db.delete(teacherClasses).where(eq(teacherClasses.teacherId, teacherId));
  if (validIds.length > 0) {
    await db
      .insert(teacherClasses)
      .values(validIds.map((classId) => ({ teacherId, classId })))
      .onConflictDoNothing();
  }

  await writeAudit({
    actorTeacherId: auth.id,
    action: "teacher.set_classes",
    targetType: "teacher",
    targetId: teacherId,
    metadata: { classIds: validIds },
  });

  return Response.json({ classIds: validIds });
}
