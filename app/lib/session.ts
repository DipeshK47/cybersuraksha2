import { eq, lt } from "drizzle-orm";
import { getDb } from "../../db";
import { ensureMigrated } from "../../db/migrate";
import { sessions, teachers } from "../../db/schema";
import { randomToken, sha256Hex } from "./tokens";

export { SESSION_COOKIE } from "./cookie-names";
import { SESSION_COOKIE } from "./cookie-names";
const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

export type SessionTeacher = {
  id: number;
  schoolId: number;
  name: string;
  email: string;
  role: "teacher" | "school_admin";
  status: "pending" | "active" | "suspended";
};

export type ActiveSession = {
  sessionId: string;
  teacher: SessionTeacher;
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

/** Build the Set-Cookie header for a freshly issued session. */
function buildSessionCookie(
  request: Request,
  token: string,
  maxAgeSeconds: number,
): string {
  const attributes = [
    `${SESSION_COOKIE}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    `Max-Age=${maxAgeSeconds}`,
  ];
  if (isSecureRequest(request)) attributes.push("Secure");
  return attributes.join("; ");
}

/** Create a new server-side session for a teacher and return its cookie. */
export async function createSession(
  request: Request,
  teacherId: number,
): Promise<string> {
  await ensureMigrated();
  const db = getDb();
  const token = randomToken();
  const tokenHash = await sha256Hex(token);
  const expiresAt = Date.now() + SESSION_TTL_MS;

  await db.insert(sessions).values({
    id: crypto.randomUUID(),
    teacherId,
    tokenHash,
    expiresAt,
    ip: request.headers.get("cf-connecting-ip"),
    userAgent: request.headers.get("user-agent"),
  });

  return buildSessionCookie(request, token, Math.floor(SESSION_TTL_MS / 1000));
}

/**
 * Resolve the caller's session. Returns null for missing/expired/invalid
 * tokens or non-active teachers. Expired rows are opportunistically pruned.
 */
export async function getSession(
  request: Request,
): Promise<ActiveSession | null> {
  return getSessionFromCookieHeader(request.headers.get("cookie"));
}

/**
 * Same as `getSession`, for callers that hold a raw Cookie header rather than
 * a Request — notably server components reading `next/headers`.
 */
export async function getSessionFromCookieHeader(
  cookieHeader: string | null,
): Promise<ActiveSession | null> {
  const token = readCookie(cookieHeader, SESSION_COOKIE);
  if (!token) return null;

  await ensureMigrated();
  const db = getDb();
  const tokenHash = await sha256Hex(token);

  const [row] = await db
    .select({
      sessionId: sessions.id,
      expiresAt: sessions.expiresAt,
      teacher: {
        id: teachers.id,
        schoolId: teachers.schoolId,
        name: teachers.name,
        email: teachers.email,
        role: teachers.role,
        status: teachers.status,
      },
    })
    .from(sessions)
    .innerJoin(teachers, eq(sessions.teacherId, teachers.id))
    .where(eq(sessions.tokenHash, tokenHash))
    .limit(1);

  if (!row) return null;
  if (row.expiresAt < Date.now()) {
    await db.delete(sessions).where(eq(sessions.id, row.sessionId));
    return null;
  }
  if (row.teacher.status !== "active") return null;

  return { sessionId: row.sessionId, teacher: row.teacher };
}

/** Destroy the caller's session and return a clearing cookie. */
export async function destroySession(request: Request): Promise<string> {
  const token = readCookie(request.headers.get("cookie"), SESSION_COOKIE);
  if (token) {
    await ensureMigrated();
    const db = getDb();
    const tokenHash = await sha256Hex(token);
    await db.delete(sessions).where(eq(sessions.tokenHash, tokenHash));
  }
  const attributes = [
    `${SESSION_COOKIE}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    "Max-Age=0",
  ];
  if (isSecureRequest(request)) attributes.push("Secure");
  return attributes.join("; ");
}

/** Housekeeping: delete all expired sessions. */
export async function purgeExpiredSessions(): Promise<void> {
  await ensureMigrated();
  await getDb().delete(sessions).where(lt(sessions.expiresAt, Date.now()));
}
