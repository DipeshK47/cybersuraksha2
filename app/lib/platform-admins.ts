import { eq } from "drizzle-orm";
import { getDb } from "../../db";
import { ensureMigrated } from "../../db/migrate";
import { platformAdmins } from "../../db/schema";
import { randomToken, sha256Hex } from "./tokens";

/**
 * Platform-admin onboarding. Nobody types a password into env or onto a
 * colleague's screen: each admin gets a one-time setup link (7 days) where
 * they choose a password and enrol 2FA. The same link resets a teammate who
 * lost their authenticator.
 */

const SETUP_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export async function issueSetupLink(origin: string, adminId: number): Promise<string> {
  const token = randomToken();
  await getDb()
    .update(platformAdmins)
    .set({ setupTokenHash: await sha256Hex(token), setupExpiresAt: Date.now() + SETUP_TTL_MS })
    .where(eq(platformAdmins.id, adminId));
  return `${origin}/admins/setup?token=${token}`;
}

/** The admin a live setup link belongs to, or null for an unknown, used or expired link. */
export async function findSetupAdmin(token: string) {
  if (!token) return null;
  await ensureMigrated();
  const [admin] = await getDb()
    .select()
    .from(platformAdmins)
    .where(eq(platformAdmins.setupTokenHash, await sha256Hex(token)))
    .limit(1);
  if (!admin || admin.status === "suspended" || (admin.setupExpiresAt ?? 0) < Date.now()) return null;
  return admin;
}

let bootstrapped = false;

/**
 * First-admin bootstrap. Until an active platform admin exists, the account
 * named by PLATFORM_ADMIN_EMAIL is created as pending and given a setup link,
 * written to the worker log (`npx wrangler tail`). A live link is never
 * replaced, so repeated login attempts cannot invalidate the one in hand.
 */
export async function ensurePlatformBootstrap(origin: string): Promise<void> {
  if (bootstrapped) return;
  const email = process.env.PLATFORM_ADMIN_EMAIL?.trim().toLowerCase();
  if (!email) return;
  await ensureMigrated();
  const db = getDb();
  const [active] = await db
    .select({ id: platformAdmins.id })
    .from(platformAdmins)
    .where(eq(platformAdmins.status, "active"))
    .limit(1);
  if (active) {
    bootstrapped = true;
    return;
  }
  let [admin] = await db.select().from(platformAdmins).where(eq(platformAdmins.email, email)).limit(1);
  if (!admin) {
    try {
      [admin] = await db
        .insert(platformAdmins)
        .values({ name: process.env.PLATFORM_ADMIN_NAME?.trim() || "Platform admin", email })
        .returning();
    } catch {
      return; // Another isolate created it first; that one logs the link.
    }
  }
  if (admin.status !== "pending") return;
  if (admin.setupTokenHash && (admin.setupExpiresAt ?? 0) > Date.now()) return;
  console.warn(
    `[admins] Finish setting up the first platform admin (${email}) within 7 days: ${await issueSetupLink(origin, admin.id)}`,
  );
}
