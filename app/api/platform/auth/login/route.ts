import { eq } from "drizzle-orm";
import { getDb } from "../../../../../db";
import { ensureMigrated } from "../../../../../db/migrate";
import { platformAdmins } from "../../../../../db/schema";
import { writeAudit } from "../../../../lib/audit";
import { hashPassword, needsRehash, verifyPassword } from "../../../../lib/password";
import { ensurePlatformBootstrap } from "../../../../lib/platform-admins";
import { createPlatformSession } from "../../../../lib/platform-session";
import { enforceRateLimit } from "../../../../lib/rate-limit";
import { parseJson, rejectCrossSiteJson, teacherLoginSchema } from "../../../../lib/validation";

/**
 * Platform login, step one of two. A correct password yields a session that can
 * only call the TOTP step. Unknown, pending, suspended and wrong-password
 * accounts all get the same reply so staff emails cannot be enumerated; every
 * failure is audited.
 */
export async function POST(request: Request) {
  const crossSite = rejectCrossSiteJson(request);
  if (crossSite) return crossSite;
  const limited = enforceRateLimit(request, "platform:login", 5, 60_000);
  if (limited) return limited;
  await ensurePlatformBootstrap(new URL(request.url).origin);

  const parsed = await parseJson(request, teacherLoginSchema);
  if (parsed.error) return parsed.error;
  const { email, password } = parsed.data;

  await ensureMigrated();
  const [admin] = await getDb().select().from(platformAdmins).where(eq(platformAdmins.email, email)).limit(1);
  if (!admin || admin.status !== "active" || !admin.totpSecret || !(await verifyPassword(password, admin.passwordHash))) {
    await writeAudit({
      actorPlatformAdminId: admin?.id ?? null,
      action: "platform.login.failure",
      targetType: "platform_admin",
      targetId: admin?.id ?? null,
      metadata: { email },
      request,
    });
    return Response.json({ error: "Email or password is incorrect." }, { status: 401 });
  }

  // After the work factor is raised, upgrade this account's hash on its next login.
  if (needsRehash(admin.passwordHash)) {
    await getDb().update(platformAdmins).set({ passwordHash: await hashPassword(password) }).where(eq(platformAdmins.id, admin.id));
  }
  return Response.json(
    { mfaRequired: true },
    { headers: { "Set-Cookie": await createPlatformSession(request, admin.id) } },
  );
}
