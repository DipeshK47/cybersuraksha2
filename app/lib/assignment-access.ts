import { and, eq, inArray, isNotNull } from "drizzle-orm";
import { getDb } from "../../db";
import { assignments, assignmentStudents } from "../../db/schema";
import { requireTeacher, scopedClassIds } from "./auth";
import { requireStudent } from "./student-session";
import { schoolContent, studentContent } from "./content-access";
import { permitsModule, type ContentAccess } from "./content-policy";
import { getPlayableModuleById } from "../data/module-registry";

export async function teacherAssignment(request: Request, id: number, write = false) {
  const auth = await requireTeacher(request);
  if (auth instanceof Response) return auth;
  const ids = await scopedClassIds(auth);
  if (!Number.isSafeInteger(id) || id <= 0 || !ids.length) return Response.json({ error: "Assignment not found." }, { status: 404 });
  const [assignment] = await getDb().select().from(assignments).where(and(eq(assignments.id, id), inArray(assignments.classId, ids), eq(assignments.schoolId, auth.schoolId)));
  if (!assignment) return Response.json({ error: "Assignment not found." }, { status: 404 });
  if (write && assignment.teacherId !== auth.id && auth.role !== "school_admin") return Response.json({ error: "Only the assignment author or school administrator can change it." }, { status: 403 });
  return { auth, assignment };
}

export function assignmentAvailable(assignment: { moduleIds: string }, access: ContentAccess) {
  return access.grades.length > 0 && (JSON.parse(assignment.moduleIds) as string[]).every(id => {
    const playable = getPlayableModuleById(id);
    return playable && permitsModule(access, playable);
  });
}

export async function studentAssignment(request: Request, id: number) {
  const session = await requireStudent(request);
  if (session instanceof Response) return session;
  const student = session.student;
  if (!Number.isSafeInteger(id) || !student.classId || !student.schoolId) return Response.json({ error: "Assignment not found." }, { status: 404 });
  const [row] = await getDb().select({ assignment: assignments }).from(assignments)
    .innerJoin(assignmentStudents, eq(assignmentStudents.assignmentId, assignments.id))
    .where(and(eq(assignments.id, id), eq(assignmentStudents.studentId, student.id), eq(assignments.schoolId, student.schoolId), eq(assignments.classId, student.classId), isNotNull(assignments.publishedAt)));
  if (!row) return Response.json({ error: "Assignment not found." }, { status: 404 });
  if (!assignmentAvailable(row.assignment, await studentContent(student))) return Response.json({ error: "This assignment’s curriculum is disabled. Contact your teacher." }, { status: 403 });
  return { session, assignment: row.assignment };
}

export async function schoolAssignmentAvailable(assignment: typeof assignments.$inferSelect) {
  const access = await schoolContent(assignment.schoolId);
  return assignmentAvailable(assignment, access);
}
