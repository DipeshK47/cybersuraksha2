import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "../../../../../db";
import { platformAdmins, platformSessions } from "../../../../../db/schema";
import { writeAudit } from "../../../../lib/audit";
import { hashPassword } from "../../../../lib/password";
import { findSetupAdmin } from "../../../../lib/platform-admins";
import { enforceRateLimit } from "../../../../lib/rate-limit";
import { newTotpSecret, otpauthUri, verifyTotp } from "../../../../lib/totp";
import { parseJson, rejectCrossSiteJson } from "../../../../lib/validation";

const invalidLink = () =>
  Response.json({ error: "This setup link is invalid, used or expired. Ask a teammate for a new one." }, { status: 400 });

const setupSchema = z.object({
  token: z.string().min(10).max(200),
  name: z.string().trim().min(2).max(120),
  password: z.string().min(12, "Use at least 12 characters.").max(200),
  secret: z.string().regex(/^[A-Z2-7]{32}$/),
  code: z.string().trim().max(10),
});

/**
 * Validate a setup link and propose a fresh TOTP secret. The secret is only
 * stored once POST proves the admin's app produces matching codes.
 */
export async function GET(request: Request) {
  const admin = await findSetupAdmin(new URL(request.url).searchParams.get("token") ?? "");
  if (!admin) return invalidLink();
  const secret = newTotpSecret();
  return Response.json({ name: admin.name, email: admin.email, secret, otpauthUri: otpauthUri(secret, admin.email) });
}

/** Set name and password, enrol 2FA, and burn the link. */
export async function POST(request: Request) {
  const crossSite = rejectCrossSiteJson(request);
  if (crossSite) return crossSite;
  const limited = enforceRateLimit(request, "platform:setup", 5, 60_000);
  if (limited) return limited;
  const parsed = await parseJson(request, setupSchema);
  if (parsed.error) return parsed.error;
  const { token, name, password, secret, code } = parsed.data;

  const admin = await findSetupAdmin(token);
  if (!admin) return invalidLink();
  const step = await verifyTotp(secret, code, Date.now());
  if (step == null) {
    return Response.json({ error: "That code does not match. Add the key to your authenticator app and enter the current code." }, { status: 400 });
  }

  const db = getDb();
  // Conditional on the same token hash, so a link cannot be used twice in a race.
  const [done] = await db
    .update(platformAdmins)
    .set({
      name,
      passwordHash: await hashPassword(password),
      totpSecret: secret,
      totpLastStep: step,
      status: "active",
      setupTokenHash: null,
      setupExpiresAt: null,
    })
    .where(and(eq(platformAdmins.id, admin.id), eq(platformAdmins.setupTokenHash, admin.setupTokenHash!)))
    .returning({ id: platformAdmins.id });
  if (!done) return invalidLink();
  // A reset must sign out every session created with the old factors.
  await db.delete(platformSessions).where(eq(platformSessions.adminId, admin.id));
  await writeAudit({ actorPlatformAdminId: admin.id, action: "platform.admin.setup", targetType: "platform_admin", targetId: admin.id, request });
  return Response.json({ ok: true });
}
