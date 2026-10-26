import { desc, inArray } from "drizzle-orm";
import { getDb } from "../../../../db";
import { assignments, classes, students } from "../../../../db/schema";
import { assignmentCounts } from "../../../../db/lms";
import { assignmentChapters } from "../../../data/module-registry";
import { requireTeacher, scopedClassIds } from "../../../lib/auth";
import { teacherContent } from "../../../lib/content-access";
import { permitsModule } from "../../../lib/content-policy";
import { saveAssignment } from "../../../lib/save-assignment";

export async function GET(request: Request) {
  const auth = await requireTeacher(request); if (auth instanceof Response) return auth;
  const ids = await scopedClassIds(auth);
  const db = getDb();
  const availableClasses = ids.length ? await db.select().from(classes).where(inArray(classes.id, ids)) : [];
  const rows = ids.length ? await db.select().from(assignments).where(inArray(assignments.classId, ids)).orderBy(desc(assignments.createdAt)) : [];
  const result = await assignmentCounts(rows);
  const roster = ids.length ? await db.select({ id: students.id, name: students.name, rollNo: students.rollNo, className: students.className, classId: students.classId }).from(students).where(inArray(students.classId, ids)) : [];
  const access = await teacherContent(auth);
  return Response.json({ assignments: result, classes: availableClasses.filter(c => access.grades.includes(c.grade)), modules: assignmentChapters.filter(m => permitsModule(access, m)), students: roster, schoolName: access.schoolName, teacherId: auth.id, role: auth.role, serverNow: Date.now() });
}

export async function POST(request: Request) {
  return saveAssignment(request);
}
