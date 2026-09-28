import { eq, inArray } from "drizzle-orm";
import { getDb } from "../../db";
import { classes, students, teacherClasses } from "../../db/schema";
import { getSession, type SessionTeacher } from "./session";

/**
 * Authorization helpers. Every teacher-facing data path is scoped through
 * these so a teacher can only ever read or mutate students in classes they are
 * assigned to. A `school_admin` implicitly owns every class in their school.
 */

export function unauthorized(): Response {
  return Response.json({ error: "Sign in to continue." }, { status: 401 });
}

export function forbidden(): Response {
  return Response.json(
    { error: "You do not have access to this resource." },
    { status: 403 },
  );
}

/**
 * Require an authenticated, active teacher. Returns the teacher on success or
 * a ready-to-return 401 Response. Usage:
 *   const auth = await requireTeacher(request);
 *   if (auth instanceof Response) return auth;
 *   // auth.id, auth.schoolId, auth.role ...
 */
export async function requireTeacher(
  request: Request,
): Promise<SessionTeacher | Response> {
  const session = await getSession(request);
  if (!session) return unauthorized();
  return session.teacher;
}

/** Require a teacher with a specific role (e.g. school_admin for onboarding). */
export async function requireRole(
  request: Request,
  role: SessionTeacher["role"],
): Promise<SessionTeacher | Response> {
  const auth = await requireTeacher(request);
  if (auth instanceof Response) return auth;
  if (auth.role !== role) return forbidden();
  return auth;
}

/** The set of class ids a teacher may access, scoped by school + assignment. */
export async function scopedClassIds(
  teacher: SessionTeacher,
): Promise<number[]> {
  const db = getDb();
  if (teacher.role === "school_admin") {
    const rows = await db
      .select({ id: classes.id })
      .from(classes)
      .where(eq(classes.schoolId, teacher.schoolId));
    return rows.map((row) => row.id);
  }
  const rows = await db
    .select({ id: teacherClasses.classId })
    .from(teacherClasses)
    .where(eq(teacherClasses.teacherId, teacher.id));
  return rows.map((row) => row.id);
}

/** True if the teacher may access the given class. */
export async function canAccessClass(
  teacher: SessionTeacher,
  classId: number,
): Promise<boolean> {
  const ids = await scopedClassIds(teacher);
  return ids.includes(classId);
}

/**
 * Load a student only if it belongs to a class the teacher can access.
 * Returns null when the student does not exist or is out of scope — callers
 * should treat both as "not found / forbidden".
 */
export async function getAccessibleStudent(
  teacher: SessionTeacher,
  studentId: number,
) {
  const db = getDb();
  const [student] = await db
    .select()
    .from(students)
    .where(eq(students.id, studentId))
    .limit(1);
  if (!student) return null;

  if (student.classId != null) {
    const allowed = await canAccessClass(teacher, student.classId);
    return allowed ? student : null;
  }
  // Unassigned students are visible only to a school_admin of the same school.
  if (teacher.role === "school_admin" && student.schoolId === teacher.schoolId) {
    return student;
  }
  return null;
}

/** All student ids the teacher may see (used to scope roster / analytics). */
export async function scopedStudentIds(
  teacher: SessionTeacher,
): Promise<number[]> {
  const classIds = await scopedClassIds(teacher);
  if (classIds.length === 0) return [];
  const rows = await getDb()
    .select({ id: students.id })
    .from(students)
    .where(inArray(students.classId, classIds));
  return rows.map((row) => row.id);
}
