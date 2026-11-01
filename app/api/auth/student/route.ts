import { destroySession } from "../../../lib/session";
import { and, eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { ensureAcademySeeded } from "../../../../db/academy";
import { schools, students } from "../../../../db/schema";
import { hashPassword, needsRehash, verifyPassword } from "../../../lib/password";
import { createStudentSession } from "../../../lib/student-session";
import { enforceKeyedRateLimit, enforceRateLimit } from "../../../lib/rate-limit";
import { parseJson, rejectCrossSiteJson, studentLoginSchema } from "../../../lib/validation";

/**
 * Student login. Looks the student up by school + class + roll number, then
 * verifies the access code against the stored PBKDF2 hash. A generic error
 * avoids revealing whether the roll number exists.
 *
 * All three parts matter: roll numbers repeat across classes (the uniqueness
 * key is class + roll), so matching on the roll alone would authenticate the
 * wrong learner and lock out every duplicate roll number after the first.
 */
export async function POST(request: Request) {
  const crossSite = rejectCrossSiteJson(request);
  if (crossSite) return crossSite;
  // A whole classroom usually shares one public IP, so the per-IP burst is
  // sized for a class of ~40 signing in together (with typos); guessing one
  // account is limited separately below.
  const limited = enforceRateLimit(request, "auth:student", 60, 60_000);
  if (limited) return limited;

  await ensureAcademySeeded();

  const parsed = await parseJson(request, studentLoginSchema);
  if (parsed.error) return parsed.error;
  const { school, className, rollNo, password } = parsed.data;
  const accountLimited = enforceKeyedRateLimit(`auth:student-account:${school}:${className}:${rollNo}`, 8, 5 * 60_000);
  if (accountLimited) return accountLimited;

  const invalid = Response.json(
    { error: "Class, roll number, or password is incorrect." },
    { status: 401 },
  );

  const db = getDb();
  const [schoolRow] = await db
    .select({ id: schools.id })
    .from(schools)
    .where(eq(schools.slug, school))
    .limit(1);
  if (!schoolRow) return invalid;

  const [student] = await db
    .select()
    .from(students)
    .where(
      and(
        eq(students.schoolId, schoolRow.id),
        eq(students.className, className),
        eq(students.rollNo, rollNo),
      ),
    )
    .limit(1);
  if (!student) return invalid;

  const ok = await verifyPassword(password, student.passwordHash);
  if (!ok) return invalid;

  // After the work factor is raised, upgrade this account's hash on its next login.
  if (needsRehash(student.passwordHash)) {
    await db.update(students).set({ passwordHash: await hashPassword(password) }).where(eq(students.id, student.id));
  }

  const cookie = await createStudentSession(request, student.id);
  const headers = new Headers();
  headers.append("Set-Cookie", cookie);
  headers.append("Set-Cookie", await destroySession(request));
  return Response.json(
    {
      student: {
        id: student.id,
        name: student.name,
        rollNo: student.rollNo,
        className: student.className,
      },
    },
    { headers },
  );
}
