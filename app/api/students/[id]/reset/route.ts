import { eq } from "drizzle-orm";
import { getDb } from "../../../../../db";
import { studentSessions, students } from "../../../../../db/schema";
import { getAccessibleStudent, requireTeacher } from "../../../../lib/auth";
import { writeAudit } from "../../../../lib/audit";
import { hashPassword } from "../../../../lib/password";
import { newAccessCode } from "../../../../lib/tokens";

/**
 * Reset a student's password. Returns the new plaintext access code exactly
 * once (for the printed slip); only its hash is stored. Every existing session
 * for the learner is revoked in the same batch, so whoever held the old
 * credentials is signed out too.
 */
export async function POST(
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

  const accessCode = newAccessCode(student.rollNo);
  const db = getDb();
  await db.batch([
    db.update(students).set({ passwordHash: await hashPassword(accessCode) }).where(eq(students.id, studentId)),
    db.delete(studentSessions).where(eq(studentSessions.studentId, studentId)),
  ]);

  await writeAudit({
    actorTeacherId: auth.id,
    action: "student.reset_password",
    targetType: "student",
    targetId: studentId,
  });

  return Response.json({
    student: {
      id: student.id,
      className: student.className,
      rollNo: student.rollNo,
      name: student.name,
      accessCode, // one-time plaintext for the login slip
    },
  });
}
