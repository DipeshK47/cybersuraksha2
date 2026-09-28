import { eq } from "drizzle-orm";
import { getDb } from "../../../../../db";
import { students } from "../../../../../db/schema";
import { getAccessibleStudent, requireTeacher } from "../../../../lib/auth";
import { writeAudit } from "../../../../lib/audit";
import { hashPassword } from "../../../../lib/password";

function newAccessCode(rollNo: string) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(7));
  const suffix = Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
  return `DPS${rollNo}${suffix}`.slice(0, 12);
}

/**
 * Reset a student's password. Returns the new plaintext access code exactly
 * once (for the printed slip); only its hash is stored.
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
  await getDb()
    .update(students)
    .set({ passwordHash: await hashPassword(accessCode) })
    .where(eq(students.id, studentId));

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
