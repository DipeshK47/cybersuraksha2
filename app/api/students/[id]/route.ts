import { and, asc, eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { runs, students } from "../../../../db/schema";
import { getAccessibleStudent, requireTeacher } from "../../../lib/auth";
import { writeAudit } from "../../../lib/audit";

/** A single student's report — only if the student is in the teacher's scope. */
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const auth = await requireTeacher(request);
  if (auth instanceof Response) return auth;

  const { id } = await context.params;
  const studentId = Number(id);
  if (!Number.isInteger(studentId)) {
    return Response.json({ error: "Invalid student." }, { status: 400 });
  }

  const student = await getAccessibleStudent(auth, studentId);
  if (!student) {
    return Response.json({ error: "Student not found" }, { status: 404 });
  }

  const studentRuns = await getDb()
    .select()
    .from(runs)
    .where(eq(runs.studentId, studentId))
    .orderBy(asc(runs.completedAt));

  const safeStudent = {
    id: student.id,
    schoolId: student.schoolId,
    classId: student.classId,
    className: student.className,
    rollNo: student.rollNo,
    name: student.name,
    createdAt: student.createdAt,
  };
  return Response.json({ student: safeStudent, runs: studentRuns });
}

/** Remove a student from the roster — scoped + audited. */
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const auth = await requireTeacher(request);
  if (auth instanceof Response) return auth;

  const { id } = await context.params;
  const studentId = Number(id);
  if (!Number.isInteger(studentId)) {
    return Response.json({ error: "Invalid student." }, { status: 400 });
  }

  const student = await getAccessibleStudent(auth, studentId);
  if (!student) {
    return Response.json({ error: "Student not found" }, { status: 404 });
  }

  await getDb()
    .delete(students)
    .where(and(eq(students.id, studentId)));
  await writeAudit({
    actorTeacherId: auth.id,
    action: "student.remove",
    targetType: "student",
    targetId: studentId,
    metadata: { name: student.name, className: student.className },
  });
  return Response.json({ ok: true });
}
