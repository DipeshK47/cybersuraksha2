import { writeAudit } from "../../../../lib/audit";
import { destroyPlatformSession, getPlatformSession } from "../../../../lib/platform-session";

export async function POST(request: Request) {
  const session = await getPlatformSession(request);
  const cookie = await destroyPlatformSession(request);
  if (session) {
    await writeAudit({ actorPlatformAdminId: session.admin.id, action: "platform.logout", targetType: "platform_admin", targetId: session.admin.id, request });
  }
  return Response.json({ ok: true }, { headers: { "Set-Cookie": cookie } });
}
