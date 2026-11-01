import { and, asc, eq, inArray, isNotNull } from "drizzle-orm";
import { getDb, inChunks } from "../../../../db";
import { assignments, assignmentStudents, assignmentSubmissions, learningAttempts, students } from "../../../../db/schema";
import { requireTeacher, scopedClassIdsQuery } from "../../../lib/auth";
import { assignmentSummary } from "../../../lib/lms-summary";

export async function GET(request: Request) {
  const auth = await requireTeacher(request);
  if (auth instanceof Response) return auth;
  const db = getDb();
  const entries = await db.select({ assignment: assignments, student: { id: students.id, name: students.name, className: students.className, classId: students.classId, rollNo: students.rollNo } }).from(assignments)
    .innerJoin(assignmentStudents, eq(assignments.id, assignmentStudents.assignmentId)).innerJoin(students, eq(students.id, assignmentStudents.studentId))
    .where(and(inArray(assignments.classId, scopedClassIdsQuery(auth)), eq(assignments.schoolId, auth.schoolId), eq(students.schoolId, auth.schoolId), eq(students.classId, assignments.classId), isNotNull(assignments.publishedAt)))
    .orderBy(asc(students.className), asc(students.rollNo), asc(assignments.createdAt));
  const studentIds = [...new Set(entries.map(row => row.student.id))];
  const assignmentIds = [...new Set(entries.map(row => row.assignment.id))];
  const [attempts, submissions] = await Promise.all([
    inChunks(studentIds, chunk => db.select().from(learningAttempts).where(inArray(learningAttempts.studentId, chunk))),
    inChunks(assignmentIds, chunk => db.select().from(assignmentSubmissions).where(inArray(assignmentSubmissions.assignmentId, chunk))),
  ]);
  return Response.json({ rows: entries.map(row => ({ student: row.student, assignmentId: row.assignment.id, title: row.assignment.title, dueAt: row.assignment.dueAt, totalMarks: row.assignment.totalMarks,
    progress: assignmentSummary(row.assignment, attempts.filter(a => a.studentId === row.student.id), Date.now(), submissions.find(s => s.studentId === row.student.id && s.assignmentId === row.assignment.id)) })) });
}
