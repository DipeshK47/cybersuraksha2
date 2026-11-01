import { and, eq, lt } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "../../../../../db";
import { platformAdmins } from "../../../../../db/schema";
import { writeAudit } from "../../../../lib/audit";
import { getPlatformSession, markMfaPassed } from "../../../../lib/platform-session";
import { enforceKeyedRateLimit, enforceRateLimit } from "../../../../lib/rate-limit";
import { verifyTotp } from "../../../../lib/totp";
import { parseJson, rejectCrossSiteJson } from "../../../../lib/validation";

/** Platform login, step two: the authenticator code that unlocks the session. */
export async function POST(request: Request) {
  const crossSite = rejectCrossSiteJson(request);
  if (crossSite) return crossSite;
  const limited = enforceRateLimit(request, "platform:totp", 5, 60_000);
  if (limited) return limited;

  const session = await getPlatformSession(request);
  if (!session) return Response.json({ error: "Sign in to continue." }, { status: 401 });
  const perSession = enforceKeyedRateLimit(`platform:totp:${session.sessionId}`, 5, 5 * 60_000);
  if (perSession) return perSession;

  const parsed = await parseJson(request, z.object({ code: z.string().trim().max(10) }));
  if (parsed.error) return parsed.error;

  const { admin } = session;
  const step = admin.totpSecret
    ? await verifyTotp(admin.totpSecret, parsed.data.code, Date.now(), admin.totpLastStep)
    : null;
  // The conditional update makes each code single-use even if two requests race.
  const [claimed] =
    step == null
      ? []
      : await getDb()
          .update(platformAdmins)
          .set({ totpLastStep: step, lastLoginAt: new Date().toISOString() })
          .where(and(eq(platformAdmins.id, admin.id), lt(platformAdmins.totpLastStep, step)))
          .returning({ id: platformAdmins.id });
  if (!claimed) {
    await writeAudit({ actorPlatformAdminId: admin.id, action: "platform.mfa.failure", targetType: "platform_admin", targetId: admin.id, request });
    return Response.json({ error: "That code is not valid. Check your authenticator app and try again." }, { status: 401 });
  }

  await markMfaPassed(session.sessionId);
  await writeAudit({ actorPlatformAdminId: admin.id, action: "platform.login.success", targetType: "platform_admin", targetId: admin.id, request });
  return Response.json({ admin: { id: admin.id, name: admin.name, email: admin.email } });
}
