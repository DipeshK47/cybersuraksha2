import { env } from "cloudflare:workers";
import baseline from "../drizzle/0000_baseline.sql?raw";
import studentSessions from "../drizzle/0001_student_sessions.sql?raw";
import assessment from "../drizzle/0002_keen_zaladane.sql?raw";
import lms from "../drizzle/0003_aspiring_hiroim.sql?raw";

/**
 * In-app D1 migrator.
 *
 * Cloudflare Workers cannot read migration files from disk at runtime, so the
 * generated SQL is bundled as a string and applied here. Applied migrations
 * are tracked in `_migrations`; each migration runs once, atomically, inside a
 * D1 batch (transaction). DDL is made idempotent so concurrent cold-start
 * isolates cannot collide on first boot.
 *
 * To add a migration: generate it with `drizzle-kit generate`, import the new
 * `.sql?raw` file, and append `{ tag, sql }` to MIGRATIONS in order.
 */
const MIGRATIONS: Array<{ tag: string; sql: string }> = [
  { tag: "0000_baseline", sql: baseline },
  { tag: "0001_student_sessions", sql: studentSessions },
  // assessment, progress rollups, report cards and guardians
  { tag: "0002_keen_zaladane", sql: assessment },
  { tag: "0003_aspiring_hiroim", sql: lms },
];

let migrationPromise: Promise<void> | null = null;

/** Idempotent, memoized per isolate. Safe to call on every request. */
export function ensureMigrated(): Promise<void> {
  migrationPromise ??= runMigrations().catch((error) => {
    // Reset so a transient failure can be retried on the next request.
    migrationPromise = null;
    throw error;
  });
  return migrationPromise;
}

function makeIdempotent(statement: string): string {
  return statement
    .replace(/^CREATE TABLE /i, "CREATE TABLE IF NOT EXISTS ")
    .replace(/^CREATE UNIQUE INDEX /i, "CREATE UNIQUE INDEX IF NOT EXISTS ")
    .replace(/^CREATE INDEX /i, "CREATE INDEX IF NOT EXISTS ");
}

async function runMigrations(): Promise<void> {
  const db = env.DB;
  if (!db) throw new Error("D1 binding `DB` is unavailable for migration.");

  await db
    .prepare(
      "CREATE TABLE IF NOT EXISTS _migrations (tag TEXT PRIMARY KEY, applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)",
    )
    .run();

  const appliedRows = await db.prepare("SELECT tag FROM _migrations").all();
  const applied = new Set(
    ((appliedRows.results ?? []) as Array<{ tag: string }>).map(
      (row) => row.tag,
    ),
  );

  for (const migration of MIGRATIONS) {
    if (applied.has(migration.tag)) continue;
    const statements = migration.sql
      .split("--> statement-breakpoint")
      .map((part) => part.trim())
      .filter(Boolean)
      .map(makeIdempotent);

    const batch = statements.map((statement) => db.prepare(statement));
    batch.push(
      db
        .prepare("INSERT OR IGNORE INTO _migrations (tag) VALUES (?)")
        .bind(migration.tag),
    );
    await db.batch(batch);
  }
}
