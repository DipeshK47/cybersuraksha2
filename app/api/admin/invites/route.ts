import { desc, eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { invites } from "../../../../db/schema";
import { requireRole } from "../../../lib/auth";
import { writeAudit } from "../../../lib/audit";
import { createInvite } from "../../../lib/invites";
import { inviteSchema, parseJson } from "../../../lib/validation";

/** List invites issued for the admin's school (no token material exposed). */
export async function GET(request: Request) {
  const auth = await requireRole(request, "school_admin");
  if (auth instanceof Response) return auth;

  const rows = await getDb()
    .select({
      id: invites.id,
      email: invites.email,
      role: invites.role,
      acceptedAt: invites.acceptedAt,
      expiresAt: invites.expiresAt,
      createdAt: invites.createdAt,
    })
    .from(invites)
    .where(eq(invites.schoolId, auth.schoolId))
    .orderBy(desc(invites.id));

  return Response.json({ invites: rows });
}

/** Issue a new invite. Returns the one-time accept link. */
export async function POST(request: Request) {
  const auth = await requireRole(request, "school_admin");
  if (auth instanceof Response) return auth;

  const parsed = await parseJson(request, inviteSchema);
  if (parsed.error) return parsed.error;

  const result = await createInvite({
    schoolId: auth.schoolId,
    email: parsed.data.email,
    role: parsed.data.role ?? "teacher",
    invitedByTeacherId: auth.id,
  });
  if (result.error || !result.invite) {
    return Response.json({ error: result.error }, { status: result.status ?? 400 });
  }

  await writeAudit({
    actorTeacherId: auth.id,
    action: "teacher.invite",
    targetType: "invite",
    targetId: result.invite.id,
    metadata: { email: result.invite.email, role: result.invite.role },
  });

  const origin = new URL(request.url).origin;
  return Response.json(
    {
      invite: {
        id: result.invite.id,
        email: result.invite.email,
        role: result.invite.role,
        expiresAt: result.invite.expiresAt,
        // One-time link — surface to the admin now; it is not recoverable later.
        acceptUrl: `${origin}/accept-invite?token=${result.invite.token}`,
        token: result.invite.token,
      },
    },
    { status: 201 },
  );
}
