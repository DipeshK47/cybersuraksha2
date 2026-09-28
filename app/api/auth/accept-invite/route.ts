import { acceptInvite } from "../../../lib/invites";
import { createSession } from "../../../lib/session";
import { enforceRateLimit } from "../../../lib/rate-limit";
import { acceptInviteSchema, parseJson } from "../../../lib/validation";

/**
 * Accept a teacher invite: set name + password, create an active account, and
 * sign the new teacher in immediately.
 */
export async function POST(request: Request) {
  const limited = enforceRateLimit(request, "auth:accept-invite", 10, 10_000);
  if (limited) return limited;

  const parsed = await parseJson(request, acceptInviteSchema);
  if (parsed.error) return parsed.error;

  const result = await acceptInvite(parsed.data);
  if (result.error || !result.teacherId) {
    return Response.json({ error: result.error }, { status: result.status ?? 400 });
  }

  const cookie = await createSession(request, result.teacherId);
  return Response.json({ ok: true }, { headers: { "Set-Cookie": cookie } });
}
