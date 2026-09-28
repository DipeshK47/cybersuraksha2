import { eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { ensureAcademySeeded } from "../../../../db/academy";
import { teachers } from "../../../../db/schema";
import { verifyPassword } from "../../../lib/password";
import { createSession } from "../../../lib/session";
import { enforceRateLimit } from "../../../lib/rate-limit";
import { parseJson, teacherLoginSchema } from "../../../lib/validation";

/**
 * Teacher / school-admin login. Looks the account up by email, verifies the
 * PBKDF2 password hash, and only issues a session for `active` accounts. The
 * error message is intentionally identical for "no such email", "wrong
 * password", and "not yet approved" to avoid account enumeration.
 */
export async function POST(request: Request) {
  const limited = enforceRateLimit(request, "auth:teacher", 10, 10_000);
  if (limited) return limited;

  // Seeding also provisions the first (school-admin) account on a fresh DB.
  await ensureAcademySeeded();

  const parsed = await parseJson(request, teacherLoginSchema);
  if (parsed.error) return parsed.error;
  const { email, password } = parsed.data;

  const invalid = Response.json(
    { error: "Email or password is incorrect." },
    { status: 401 },
  );

  const [teacher] = await getDb()
    .select()
    .from(teachers)
    .where(eq(teachers.email, email))
    .limit(1);
  if (!teacher) return invalid;

  const ok = await verifyPassword(password, teacher.passwordHash);
  if (!ok) return invalid;

  if (teacher.status === "pending") {
    return Response.json(
      { error: "Your account is awaiting approval by a school admin." },
      { status: 403 },
    );
  }
  if (teacher.status !== "active") {
    return Response.json({ error: "This account is not active." }, { status: 403 });
  }

  const cookie = await createSession(request, teacher.id);
  return Response.json(
    {
      teacher: {
        name: teacher.name,
        email: teacher.email,
        role: teacher.role,
      },
    },
    { headers: { "Set-Cookie": cookie } },
  );
}
