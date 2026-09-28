import { eq, lt } from "drizzle-orm";
import { getDb } from "../../db";
import { ensureMigrated } from "../../db/migrate";
import { studentSessions, students } from "../../db/schema";
import { randomToken, sha256Hex } from "./tokens";

/**
 * Server-side sessions for students. Same opaque-hashed-token model as teacher
 * sessions; a distinct cookie name keeps the two audiences separate. All
 * student writes (runs, activity) derive the student id from this session, so
 * a student can never act as another student.
 */

export { STUDENT_SESSION_COOKIE } from "./cookie-names";
import { STUDENT_SESSION_COOKIE } from "./cookie-names";
const STUDENT_SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

export type StudentSession = {
  sessionId: string;
  student: {
    id: number;
    name: string;
    rollNo: string;
    className: string;
    classId: number | null;
    schoolId: number | null;
  };
};

function isSecureRequest(request: Request): boolean {
  const url = new URL(request.url);
  if (url.protocol === "https:") return true;
  return (request.headers.get("x-forwarded-proto") ?? "").includes("https");
}

function readCookie(header: string | null, name: string): string | null {
  for (const part of (header ?? "").split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return null;
}

export async function createStudentSession(
  request: Request,
  studentId: number,
): Promise<string> {
  await ensureMigrated();
  const db = getDb();
  const token = randomToken();
  const tokenHash = await sha256Hex(token);
  const expiresAt = Date.now() + STUDENT_SESSION_TTL_MS;

  await db.insert(studentSessions).values({
    id: crypto.randomUUID(),
    studentId,
    tokenHash,
    expiresAt,
    ip: request.headers.get("cf-connecting-ip"),
    userAgent: request.headers.get("user-agent"),
  });

  const attributes = [
    `${STUDENT_SESSION_COOKIE}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    `Max-Age=${Math.floor(STUDENT_SESSION_TTL_MS / 1000)}`,
  ];
  if (isSecureRequest(request)) attributes.push("Secure");
  return attributes.join("; ");
}

export async function getStudentSession(
  request: Request,
): Promise<StudentSession | null> {
  return getStudentSessionFromCookieHeader(request.headers.get("cookie"));
}

/**
 * Same as `getStudentSession`, for callers that hold a raw Cookie header
 * rather than a Request — notably server components reading `next/headers`.
 */
export async function getStudentSessionFromCookieHeader(
  cookieHeader: string | null,
): Promise<StudentSession | null> {
  const token = readCookie(cookieHeader, STUDENT_SESSION_COOKIE);
  if (!token) return null;

  await ensureMigrated();
  const db = getDb();
  const tokenHash = await sha256Hex(token);

  const [row] = await db
    .select({
      sessionId: studentSessions.id,
      expiresAt: studentSessions.expiresAt,
      student: {
        id: students.id,
        name: students.name,
        rollNo: students.rollNo,
        className: students.className,
        classId: students.classId,
        schoolId: students.schoolId,
      },
    })
    .from(studentSessions)
    .innerJoin(students, eq(studentSessions.studentId, students.id))
    .where(eq(studentSessions.tokenHash, tokenHash))
    .limit(1);

  if (!row) return null;
  if (row.expiresAt < Date.now()) {
    await db.delete(studentSessions).where(eq(studentSessions.id, row.sessionId));
    return null;
  }
  return { sessionId: row.sessionId, student: row.student };
}

export async function destroyStudentSession(request: Request): Promise<string> {
  const token = readCookie(
    request.headers.get("cookie"),
    STUDENT_SESSION_COOKIE,
  );
  if (token) {
    await ensureMigrated();
    const tokenHash = await sha256Hex(token);
    await getDb()
      .delete(studentSessions)
      .where(eq(studentSessions.tokenHash, tokenHash));
  }
  const attributes = [
    `${STUDENT_SESSION_COOKIE}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    "Max-Age=0",
  ];
  if (isSecureRequest(request)) attributes.push("Secure");
  return attributes.join("; ");
}

/**
 * Require an authenticated student. Returns the session or a 401 Response.
 */
export async function requireStudent(
  request: Request,
): Promise<StudentSession | Response> {
  const session = await getStudentSession(request);
  if (!session) {
    return Response.json({ error: "Sign in as a student to continue." }, { status: 401 });
  }
  return session;
}

export async function purgeExpiredStudentSessions(): Promise<void> {
  await ensureMigrated();
  await getDb()
    .delete(studentSessions)
    .where(lt(studentSessions.expiresAt, Date.now()));
}
