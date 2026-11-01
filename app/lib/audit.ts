import { getDb } from "../../db";
import { auditLog } from "../../db/schema";

/**
 * Append an entry to the audit trail (best-effort). The actor is a teacher or a
 * platform admin; pass `request` to record where the action came from.
 */
export async function writeAudit(entry: {
  actorTeacherId?: number | null;
  actorPlatformAdminId?: number | null;
  action: string;
  targetType: string;
  targetId?: string | number | null;
  metadata?: Record<string, unknown>;
  request?: Request;
}): Promise<void> {
  try {
    await getDb()
      .insert(auditLog)
      .values({
        actorTeacherId: entry.actorTeacherId ?? null,
        actorPlatformAdminId: entry.actorPlatformAdminId ?? null,
        action: entry.action,
        targetType: entry.targetType,
        targetId: entry.targetId != null ? String(entry.targetId) : null,
        metadata: entry.metadata ? JSON.stringify(entry.metadata) : null,
        ip: entry.request?.headers.get("cf-connecting-ip") ?? null,
        userAgent: entry.request?.headers.get("user-agent") ?? null,
      });
  } catch {
    // Auditing must never break the primary operation.
  }
}
