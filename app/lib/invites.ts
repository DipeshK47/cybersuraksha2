import { and, eq, isNull } from "drizzle-orm";
import { getDb } from "../../db";
import { ensureMigrated } from "../../db/migrate";
import { invites, teachers } from "../../db/schema";
import { hashPassword } from "./password";
import { randomToken, sha256Hex } from "./tokens";

/**
 * Teacher onboarding via one-time invites.
 *
 * A school_admin issues an invite bound to an email + role. Only the SHA-256
 * hash of the token is stored; the raw token is returned once so it can be
 * emailed / handed over as an accept link. Accepting the invite creates an
 * `active` teacher — so an accepted invite *is* the approval.
 */

const INVITE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export type CreatedInvite = {
  id: number;
  email: string;
  role: "teacher" | "school_admin";
  token: string; // one-time; not stored in plaintext
  expiresAt: number;
};

export async function createInvite(params: {
  schoolId: number;
  email: string;
  role: "teacher" | "school_admin";
  invitedByTeacherId: number;
}): Promise<{ invite?: CreatedInvite; error?: string; status?: number }> {
  await ensureMigrated();
  const db = getDb();
  const email = params.email.trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { error: "Enter a valid email address.", status: 400 };
  }

  const [existing] = await db
    .select({ id: teachers.id })
    .from(teachers)
    .where(eq(teachers.email, email))
    .limit(1);
  if (existing) {
    return { error: "A teacher with that email already exists.", status: 409 };
  }

  const token = randomToken();
  const tokenHash = await sha256Hex(token);
  const expiresAt = Date.now() + INVITE_TTL_MS;

  const [row] = await db
    .insert(invites)
    .values({
      schoolId: params.schoolId,
      email,
      role: params.role,
      tokenHash,
      invitedByTeacherId: params.invitedByTeacherId,
      expiresAt,
    })
    .returning({ id: invites.id });

  return {
    invite: { id: row.id, email, role: params.role, token, expiresAt },
  };
}

export async function acceptInvite(params: {
  token: string;
  name: string;
  password: string;
}): Promise<{ teacherId?: number; error?: string; status?: number }> {
  await ensureMigrated();
  const db = getDb();

  const name = params.name.trim();
  if (name.length < 2) return { error: "Enter your full name.", status: 400 };
  if (params.password.length < 8) {
    return { error: "Password must be at least 8 characters.", status: 400 };
  }

  const tokenHash = await sha256Hex(params.token);
  const [invite] = await db
    .select()
    .from(invites)
    .where(and(eq(invites.tokenHash, tokenHash), isNull(invites.acceptedAt)))
    .limit(1);
  if (!invite) {
    return { error: "This invite link is invalid or already used.", status: 400 };
  }
  if (invite.expiresAt < Date.now()) {
    return { error: "This invite link has expired.", status: 400 };
  }

  // Guard against a race where the email was registered after the invite.
  const [existing] = await db
    .select({ id: teachers.id })
    .from(teachers)
    .where(eq(teachers.email, invite.email))
    .limit(1);
  if (existing) {
    return { error: "An account for this email already exists.", status: 409 };
  }

  const [teacher] = await db
    .insert(teachers)
    .values({
      schoolId: invite.schoolId,
      name,
      email: invite.email,
      passwordHash: await hashPassword(params.password),
      role: invite.role,
      status: "active",
      emailVerifiedAt: new Date().toISOString(),
    })
    .returning({ id: teachers.id });

  await db
    .update(invites)
    .set({ acceptedAt: new Date().toISOString() })
    .where(eq(invites.id, invite.id));

  return { teacherId: teacher.id };
}
