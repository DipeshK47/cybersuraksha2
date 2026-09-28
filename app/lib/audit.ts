import { getDb } from "../../db";
import { auditLog } from "../../db/schema";

/** Append an entry to the teacher-action audit trail (best-effort). */
export async function writeAudit(entry: {
  actorTeacherId: number | null;
  action: string;
  targetType: string;
  targetId?: string | number | null;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  try {
    await getDb()
      .insert(auditLog)
      .values({
        actorTeacherId: entry.actorTeacherId,
        action: entry.action,
        targetType: entry.targetType,
        targetId: entry.targetId != null ? String(entry.targetId) : null,
        metadata: entry.metadata ? JSON.stringify(entry.metadata) : null,
      });
  } catch {
    // Auditing must never break the primary operation.
  }
}
