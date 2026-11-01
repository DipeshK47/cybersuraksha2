import { eq } from "drizzle-orm";
import { getDb } from "../../db";
import { ensureMigrated } from "../../db/migrate";
import { platformAdmins, platformSessions } from "../../db/schema";
import { PLATFORM_SESSION_COOKIE } from "./cookie-names";
import { isSecureRequest, readCookie } from "./session";
import { randomToken, sha256Hex } from "./tokens";

/**
 * Sessions for CyberSuraksha staff in /admins. Same opaque hashed-token model
 * as teacher sessions, plus a second factor: the password step creates the
 * session with `mfaPassedAt` null, and only the TOTP step makes it usable. A
 * separate cookie keeps staff and school logins apart.
 */

const PLATFORM_SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

export type PlatformAdmin = { id: number; name: string; email: string };

export type PlatformSession = {
  sessionId: string;
  mfaPassed: boolean;
  admin: PlatformAdmin & { totpSecret: string | null; totpLastStep: number };
};

function buildCookie(request: Request, value: string, maxAgeSeconds: number): string {
  const attributes = [
    `${PLATFORM_SESSION_COOKIE}=${value}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    `Max-Age=${maxAgeSeconds}`,
  ];
  if (isSecureRequest(request)) attributes.push("Secure");
  return attributes.join("; ");
}

/** Create a session after the password step and return its Set-Cookie value. */
export async function createPlatformSession(request: Request, adminId: number): Promise<string> {
  await ensureMigrated();
  const token = randomToken();
  await getDb().insert(platformSessions).values({
    id: crypto.randomUUID(),
    adminId,
    tokenHash: await sha256Hex(token),
    expiresAt: Date.now() + PLATFORM_SESSION_TTL_MS,
    ip: request.headers.get("cf-connecting-ip"),
    userAgent: request.headers.get("user-agent"),
  });
  return buildCookie(request, encodeURIComponent(token), Math.floor(PLATFORM_SESSION_TTL_MS / 1000));
}

/**
 * The caller's live session for an active admin, including one still waiting
 * for its TOTP step. Expired rows are pruned on sight.
 */
export async function getPlatformSession(request: Request): Promise<PlatformSession | null> {
  const token = readCookie(request.headers.get("cookie"), PLATFORM_SESSION_COOKIE);
  if (!token) return null;
  await ensureMigrated();
  const db = getDb();
  const [row] = await db
    .select({
      sessionId: platformSessions.id,
      expiresAt: platformSessions.expiresAt,
      mfaPassedAt: platformSessions.mfaPassedAt,
      status: platformAdmins.status,
      admin: {
        id: platformAdmins.id,
        name: platformAdmins.name,
        email: platformAdmins.email,
        totpSecret: platformAdmins.totpSecret,
        totpLastStep: platformAdmins.totpLastStep,
      },
    })
    .from(platformSessions)
    .innerJoin(platformAdmins, eq(platformSessions.adminId, platformAdmins.id))
    .where(eq(platformSessions.tokenHash, await sha256Hex(token)))
    .limit(1);
  if (!row) return null;
  if (row.expiresAt < Date.now()) {
    await db.delete(platformSessions).where(eq(platformSessions.id, row.sessionId));
    return null;
  }
  if (row.status !== "active") return null;
  return { sessionId: row.sessionId, mfaPassed: row.mfaPassedAt != null, admin: row.admin };
}

export async function markMfaPassed(sessionId: string): Promise<void> {
  await getDb()
    .update(platformSessions)
    .set({ mfaPassedAt: new Date().toISOString() })
    .where(eq(platformSessions.id, sessionId));
}

/** Delete the caller's session and return a Set-Cookie value that clears it. */
export async function destroyPlatformSession(request: Request): Promise<string> {
  const token = readCookie(request.headers.get("cookie"), PLATFORM_SESSION_COOKIE);
  if (token) {
    await ensureMigrated();
    await getDb().delete(platformSessions).where(eq(platformSessions.tokenHash, await sha256Hex(token)));
  }
  return buildCookie(request, "", 0);
}

/**
 * Require a fully signed-in platform admin (password and TOTP). Returns the
 * admin or a ready-to-return 401, like `requireTeacher`.
 */
export async function requirePlatformAdmin(request: Request): Promise<PlatformAdmin | Response> {
  const session = await getPlatformSession(request);
  if (!session?.mfaPassed) return Response.json({ error: "Sign in to continue." }, { status: 401 });
  const { id, name, email } = session.admin;
  return { id, name, email };
}
