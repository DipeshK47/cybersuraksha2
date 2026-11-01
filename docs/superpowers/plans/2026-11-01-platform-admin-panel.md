# Platform Admin Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A CyberSuraksha company panel at `/admins` to onboard schools, work leads, license and toggle content per school, enforce contract limits, manage school users, and audit everything.

**Architecture:** Same vinext/Cloudflare app. New `platform_admins` identity with its own hashed-token sessions and TOTP second factor. API under `/api/platform/*`, client pages under `/admins`. Per-school controls are enforced at the existing choke points: the two session resolvers, `permitsModule`, `teacherAssignment`/`studentAssignment`, and the student/class/invite creation paths.

**Tech Stack:** TypeScript, vinext (Next app router on Vite), Cloudflare Workers + D1, Drizzle ORM 0.45, zod 3, Web Crypto, lucide-react, node:test + Miniflare.

**Spec:** `docs/superpowers/specs/2026-11-01-platform-admin-panel-design.md`

## Global Constraints

- Node ≥ 22.13. In this machine's shell `node` is v20; prefix every node/npm command with `PATH="$HOME/.nvm/versions/node/v22.23.1/bin:$PATH"`.
- Miniflare tests bind a local port: run them outside the command sandbox.
- No new dependencies.
- UI path `/admins`; API path `/api/platform/*`; cookie `cybersuraksha_platform_session`; migration tag `0005_platform_admin`.
- Every platform write calls `writeAudit` with `actorPlatformAdminId`, an action starting `platform.`, and `request` (for IP and user agent). School-scoped actions use `targetType: "school"`, `targetId: <school id>`.
- Session-issuing POSTs call `rejectCrossSiteJson` first. All bodies go through `parseJson` + zod.
- User-facing refusals say "Contact CyberSuraksha" where the school must ask us for a change.
- Match the surrounding code: comment density, naming, existing helpers (`readJson`, `getJson`, `enforceRateLimit`, `hashPassword`, `randomToken`, `sha256Hex`).
- Commit after each task; every commit message ends with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

Shorthand used below: `N22='PATH="$HOME/.nvm/versions/node/v22.23.1/bin:$PATH"'` — i.e. "Run: `N22 node --test …`" means run `PATH="$HOME/.nvm/versions/node/v22.23.1/bin:$PATH" node --test …`.

## File map

| File | Responsibility |
|---|---|
| `app/lib/totp.ts` (new) | RFC 6238 codes, verification with replay guard, secrets, otpauth URI |
| `db/schema.ts`, `drizzle/0005_platform_admin.sql`, `db/migrate.ts` | new tables and columns |
| `app/lib/cookie-names.ts`, `app/lib/session.ts` | platform cookie name; export cookie helpers |
| `app/lib/platform-session.ts` (new) | platform sessions, MFA flag, `requirePlatformAdmin` |
| `app/lib/platform-admins.ts` (new) | setup links, first-admin bootstrap |
| `app/lib/audit.ts` | platform actor, IP, user agent |
| `app/lib/content-policy.ts`, `app/lib/content-access.ts`, `app/lib/content-page.ts` | hidden chapters, feature switches, `requireFeature`, `listsModule` |
| `app/lib/school-controls.ts` (new) | `schoolPaused`, `limitExceeded` |
| `app/lib/platform-schools.ts` (new) | usage queries, school/lead schemas, `findSchool` |
| `app/api/platform/**` (new) | platform API |
| `app/api/features/route.ts` (new) | caller's school features |
| `app/admins/**` (new) | panel UI |
| `worker/index.ts` | `/admins` redirect, noindex header |
| `tests/totp.test.mjs`, `tests/worker-harness.mjs`, `tests/platform-admin.test.mjs` (new) | tests |

---

### Task 1: TOTP

**Files:**
- Create: `app/lib/totp.ts`
- Test: `tests/totp.test.mjs`

**Interfaces:**
- Produces: `base32Encode(bytes: Uint8Array): string`, `base32Decode(text: string): Uint8Array`, `newTotpSecret(): string` (32 base32 chars), `totpCode(secret: string, timeMs: number, digits = 6): Promise<string>`, `verifyTotp(secret: string, code: string, timeMs: number, afterStep = 0): Promise<number | null>` (returns the matched 30 s step), `otpauthUri(secret: string, email: string): string`.

- [ ] **Step 1: Write the failing test** — create `tests/totp.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { base32Encode, newTotpSecret, totpCode, verifyTotp } from '../app/lib/totp.ts';

// RFC 6238 appendix B, SHA-1 key "12345678901234567890".
const secret = base32Encode(new TextEncoder().encode('12345678901234567890'));

test('matches the RFC 6238 SHA-1 test vectors', async () => {
  assert.equal(secret, 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ');
  assert.equal(await totpCode(secret, 59_000, 8), '94287082');
  assert.equal(await totpCode(secret, 1_111_111_109_000, 8), '07081804');
  assert.equal(await totpCode(secret, 1_234_567_890_000, 8), '89005924');
});

test('accepts one step of drift, refuses replays, stale and malformed codes', async () => {
  const now = 1_700_000_000_000;
  const code = await totpCode(secret, now);
  const step = await verifyTotp(secret, code, now + 30_000);
  assert.equal(step, Math.floor(now / 30_000));
  assert.equal(await verifyTotp(secret, code, now, step), null);
  assert.equal(await verifyTotp(secret, code, now + 90_000), null);
  assert.equal(await verifyTotp(secret, 'abc123', now), null);
});

test('new secrets are 160-bit base32', () => {
  assert.match(newTotpSecret(), /^[A-Z2-7]{32}$/);
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `N22 node --test tests/totp.test.mjs`
Expected: FAIL — `Cannot find module '…/app/lib/totp.ts'`.

- [ ] **Step 3: Implement** — create `app/lib/totp.ts`:

```ts
/**
 * RFC 6238 time-based one-time passwords (SHA-1, 6 digits, 30 s steps) on Web
 * Crypto, the second factor for platform admins. Works with Google
 * Authenticator, Authy, 1Password and every other standard app.
 */

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
const STEP_MS = 30_000;

export function base32Encode(bytes: Uint8Array): string {
  let bits = 0;
  let value = 0;
  let out = "";
  for (const byte of bytes) {
    value = ((value << 8) | byte) & 0xffff;
    bits += 8;
    while (bits >= 5) {
      out += ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) out += ALPHABET[(value << (5 - bits)) & 31];
  return out;
}

export function base32Decode(text: string): Uint8Array {
  const out: number[] = [];
  let bits = 0;
  let value = 0;
  for (const char of text.toUpperCase().replace(/[\s=]/g, "")) {
    const index = ALPHABET.indexOf(char);
    if (index < 0) throw new Error("Invalid base32 secret.");
    value = ((value << 5) | index) & 0xffff;
    bits += 5;
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return new Uint8Array(out);
}

/** A fresh 160-bit secret, the size RFC 4226 recommends for SHA-1. */
export function newTotpSecret(): string {
  return base32Encode(crypto.getRandomValues(new Uint8Array(20)));
}

export async function totpCode(secret: string, timeMs: number, digits = 6): Promise<string> {
  const counter = new ArrayBuffer(8);
  new DataView(counter).setBigUint64(0, BigInt(Math.floor(timeMs / STEP_MS)));
  const key = await crypto.subtle.importKey(
    "raw",
    base32Decode(secret) as BufferSource,
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"],
  );
  const mac = new Uint8Array(await crypto.subtle.sign("HMAC", key, counter));
  const offset = mac[mac.length - 1] & 15;
  const binary =
    ((mac[offset] & 127) << 24) | (mac[offset + 1] << 16) | (mac[offset + 2] << 8) | mac[offset + 3];
  return String(binary % 10 ** digits).padStart(digits, "0");
}

/**
 * Check a 6-digit code against the current step and one step either side (for
 * clock drift). Steps at or before `afterStep` — the last code this admin used —
 * are refused, so an observed code cannot be replayed. Returns the matched step
 * to store as the new `afterStep`, or null.
 */
export async function verifyTotp(
  secret: string,
  code: string,
  timeMs: number,
  afterStep = 0,
): Promise<number | null> {
  if (!/^\d{6}$/.test(code)) return null;
  const now = Math.floor(timeMs / STEP_MS);
  for (const step of [now - 1, now, now + 1]) {
    if (step <= afterStep) continue;
    if ((await totpCode(secret, step * STEP_MS)) === code) return step;
  }
  return null;
}

export function otpauthUri(secret: string, email: string): string {
  const issuer = "CyberSuraksha Admin";
  const label = encodeURIComponent(`${issuer}:${email}`);
  return `otpauth://totp/${label}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`;
}
```

- [ ] **Step 4: Run the test**

Run: `N22 node --test tests/totp.test.mjs`
Expected: PASS, 3 tests.

- [ ] **Step 5: Commit**

```bash
git add app/lib/totp.ts tests/totp.test.mjs
git commit -m "Add RFC 6238 TOTP for platform admin 2FA

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Schema and migration

**Files:**
- Modify: `db/schema.ts` (`schools`, `auditLog`, `schoolRequests`, `schoolSettings`; new `platformAdmins`, `platformSessions`)
- Create: `drizzle/0005_platform_admin.sql`, `drizzle/meta/0005_snapshot.json` (generated)
- Modify: `drizzle/meta/_journal.json` (generated), `db/migrate.ts`

**Interfaces:**
- Produces (Drizzle): `schools.{status, plan, seatLimit, teacherLimit, classLimit, contractEndsAt, contactName, contactEmail, notes}`; `schoolSettings.{hiddenModules, features}` (JSON text); `schoolRequests.{status, schoolId, notes}`; `auditLog.{actorPlatformAdminId, ip, userAgent}`; tables `platformAdmins` (`id, name, email, passwordHash, totpSecret, totpLastStep, status, setupTokenHash, setupExpiresAt, lastLoginAt, createdAt`) and `platformSessions` (`id, adminId, tokenHash, expiresAt, mfaPassedAt, ip, userAgent, createdAt`).

- [ ] **Step 1: Extend `schools`** — in `db/schema.ts`, replace

```ts
    slug: text("slug").notNull(),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [uniqueIndex("schools_slug_idx").on(table.slug)],
```

with

```ts
    slug: text("slug").notNull(),
    /** Set from the platform panel; suspended blocks every login in the school. */
    status: text("status", { enum: ["active", "suspended"] }).notNull().default("active"),
    /** Contract details and limits (null limit = unlimited), set from the platform panel. */
    plan: text("plan"),
    seatLimit: integer("seat_limit"),
    teacherLimit: integer("teacher_limit"),
    classLimit: integer("class_limit"),
    contractEndsAt: text("contract_ends_at"),
    contactName: text("contact_name"),
    contactEmail: text("contact_email"),
    notes: text("notes"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [uniqueIndex("schools_slug_idx").on(table.slug)],
```

- [ ] **Step 2: Extend `auditLog`** — replace

```ts
    actorTeacherId: integer("actor_teacher_id").references(() => teachers.id, {
      onDelete: "set null",
    }),
```

with

```ts
    actorTeacherId: integer("actor_teacher_id").references(() => teachers.id, {
      onDelete: "set null",
    }),
    actorPlatformAdminId: integer("actor_platform_admin_id").references(() => platformAdmins.id, {
      onDelete: "set null",
    }),
    ip: text("ip"),
    userAgent: text("user_agent"),
```

and change the comment above `export const auditLog` from `/** Audit trail for teacher-initiated account actions. */` to `/** Audit trail for teacher and platform-admin actions. */`.

- [ ] **Step 3: Extend `schoolRequests` and add the platform tables** — replace

```ts
  studentCount: integer("student_count"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
```

with

```ts
  studentCount: integer("student_count"),
  status: text("status", { enum: ["new", "contacted", "converted", "rejected"] }).notNull().default("new"),
  /** The school this lead became, once converted. */
  schoolId: integer("school_id").references(() => schools.id, { onDelete: "set null" }),
  notes: text("notes"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

/**
 * CyberSuraksha staff who run the platform from /admins. A separate identity
 * from teachers: no school, no class scope, its own sessions. An admin is
 * `pending` until they open their one-time setup link, choose a password and
 * enrol a TOTP authenticator.
 */
export const platformAdmins = sqliteTable(
  "platform_admins",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull().default(""),
    totpSecret: text("totp_secret"),
    /** Last accepted TOTP time step; any code at or before it is refused (replay guard). */
    totpLastStep: integer("totp_last_step").notNull().default(0),
    status: text("status", { enum: ["pending", "active", "suspended"] }).notNull().default("pending"),
    setupTokenHash: text("setup_token_hash"),
    setupExpiresAt: integer("setup_expires_at"),
    lastLoginAt: text("last_login_at"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("platform_admins_email_idx").on(table.email),
    uniqueIndex("platform_admins_setup_token_idx").on(table.setupTokenHash),
  ],
);

/**
 * Platform-admin sessions; same hashed-token model as teacher `sessions`. A
 * session starts with `mfaPassedAt` null after the password step and can only
 * reach the TOTP endpoint until that step sets it.
 */
export const platformSessions = sqliteTable(
  "platform_sessions",
  {
    id: text("id").primaryKey(),
    adminId: integer("admin_id")
      .notNull()
      .references(() => platformAdmins.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull(),
    expiresAt: integer("expires_at").notNull(),
    mfaPassedAt: text("mfa_passed_at"),
    ip: text("ip"),
    userAgent: text("user_agent"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("platform_sessions_token_hash_idx").on(table.tokenHash),
    index("platform_sessions_admin_idx").on(table.adminId),
  ],
);
```

- [ ] **Step 4: Extend `schoolSettings`** — replace

```ts
  grades: text("grades").notNull(),
  subjects: text("subjects").notNull(),
});
```

with

```ts
  grades: text("grades").notNull(),
  subjects: text("subjects").notNull(),
  /** JSON array of module ids hidden for this school. */
  hiddenModules: text("hidden_modules").notNull().default("[]"),
  /** JSON object of feature switches; a missing key means on. */
  features: text("features").notNull().default("{}"),
});
```

- [ ] **Step 5: Generate the migration**

Run: `N22 npx drizzle-kit generate --name platform_admin`
Expected: creates `drizzle/0005_platform_admin.sql`, `drizzle/meta/0005_snapshot.json`, and appends to `_journal.json`.

- [ ] **Step 6: Check the SQL is append-only.** The in-app migrator runs statements inside a D1 batch and cannot run table rebuilds or `PRAGMA`. Open `drizzle/0005_platform_admin.sql`. It must contain only `CREATE TABLE`, `CREATE [UNIQUE] INDEX` and `ALTER TABLE … ADD` statements, separated by `--> statement-breakpoint`. If drizzle-kit emitted any `__new_` table, `INSERT INTO "__new_…`, `DROP TABLE` or `PRAGMA` line, replace the whole file body with this equivalent (keep the generated snapshot and journal):

```sql
CREATE TABLE `platform_admins` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password_hash` text DEFAULT '' NOT NULL,
	`totp_secret` text,
	`totp_last_step` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`setup_token_hash` text,
	`setup_expires_at` integer,
	`last_login_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `platform_admins_email_idx` ON `platform_admins` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `platform_admins_setup_token_idx` ON `platform_admins` (`setup_token_hash`);--> statement-breakpoint
CREATE TABLE `platform_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`admin_id` integer NOT NULL,
	`token_hash` text NOT NULL,
	`expires_at` integer NOT NULL,
	`mfa_passed_at` text,
	`ip` text,
	`user_agent` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`admin_id`) REFERENCES `platform_admins`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `platform_sessions_token_hash_idx` ON `platform_sessions` (`token_hash`);--> statement-breakpoint
CREATE INDEX `platform_sessions_admin_idx` ON `platform_sessions` (`admin_id`);--> statement-breakpoint
ALTER TABLE `audit_log` ADD `actor_platform_admin_id` integer REFERENCES platform_admins(id) ON DELETE set null;--> statement-breakpoint
ALTER TABLE `audit_log` ADD `ip` text;--> statement-breakpoint
ALTER TABLE `audit_log` ADD `user_agent` text;--> statement-breakpoint
ALTER TABLE `school_requests` ADD `status` text DEFAULT 'new' NOT NULL;--> statement-breakpoint
ALTER TABLE `school_requests` ADD `school_id` integer REFERENCES schools(id) ON DELETE set null;--> statement-breakpoint
ALTER TABLE `school_requests` ADD `notes` text;--> statement-breakpoint
ALTER TABLE `school_settings` ADD `hidden_modules` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `school_settings` ADD `features` text DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE `schools` ADD `status` text DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE `schools` ADD `plan` text;--> statement-breakpoint
ALTER TABLE `schools` ADD `seat_limit` integer;--> statement-breakpoint
ALTER TABLE `schools` ADD `teacher_limit` integer;--> statement-breakpoint
ALTER TABLE `schools` ADD `class_limit` integer;--> statement-breakpoint
ALTER TABLE `schools` ADD `contract_ends_at` text;--> statement-breakpoint
ALTER TABLE `schools` ADD `contact_name` text;--> statement-breakpoint
ALTER TABLE `schools` ADD `contact_email` text;--> statement-breakpoint
ALTER TABLE `schools` ADD `notes` text;
```

- [ ] **Step 7: Register it** — in `db/migrate.ts`, after `import schoolLms from "../drizzle/0004_icy_toro.sql?raw";` add

```ts
import platformAdmin from "../drizzle/0005_platform_admin.sql?raw";
```

and after `{ tag: "0004_icy_toro", sql: schoolLms },` add

```ts
  // platform admin panel: staff identities, school controls, lead pipeline
  { tag: "0005_platform_admin", sql: platformAdmin },
```

- [ ] **Step 8: Typecheck and run the backend suite** (it applies every migration to a fresh D1)

Run: `N22 npm run typecheck && N22 npm run test:backend` (outside the sandbox)
Expected: both pass. If `tests/school-migration.test.mjs` asserts a fixed migration count or list, update that assertion to include `0005_platform_admin`.

- [ ] **Step 9: Commit**

```bash
git add db/schema.ts db/migrate.ts drizzle/0005_platform_admin.sql drizzle/meta tests/school-migration.test.mjs
git commit -m "Add platform admin tables and per-school control columns

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Platform authentication

**Files:**
- Modify: `app/lib/cookie-names.ts`, `app/lib/session.ts`, `app/lib/audit.ts`, `worker/index.ts`
- Create: `app/lib/platform-session.ts`, `app/lib/platform-admins.ts`
- Create: `app/api/platform/auth/{login,totp,logout,me,setup}/route.ts`
- Create: `tests/worker-harness.mjs`, `tests/platform-admin.test.mjs`

**Interfaces:**
- Consumes: Task 1 (`newTotpSecret`, `otpauthUri`, `verifyTotp`), Task 2 tables.
- Produces:
  - `PLATFORM_SESSION_COOKIE = "cybersuraksha_platform_session"`
  - `session.ts`: `export function isSecureRequest(request: Request): boolean`, `export function readCookie(header: string | null, name: string): string | null`
  - `writeAudit({ actorTeacherId?, actorPlatformAdminId?, action, targetType, targetId?, metadata?, request? })`
  - `platform-session.ts`: `type PlatformAdmin = { id: number; name: string; email: string }`; `createPlatformSession(request, adminId): Promise<string>` (Set-Cookie value); `getPlatformSession(request): Promise<PlatformSession | null>`; `markMfaPassed(sessionId)`; `destroyPlatformSession(request): Promise<string>`; `requirePlatformAdmin(request): Promise<PlatformAdmin | Response>` (401 unless password and TOTP both passed).
  - `platform-admins.ts`: `issueSetupLink(origin: string, adminId: number): Promise<string>` (returns `${origin}/admins/setup?token=…`), `findSetupAdmin(token: string)`, `ensurePlatformBootstrap(origin: string)`.
  - Test helpers in `tests/platform-admin.test.mjs`: `request`, `json`, `cookieOf`, `teacherLogin`, `studentLogin`, `db`, `demoAdmin`, `platform` (signed-in platform cookie), arrays `routes`, `dynamic`, `PROTECTED`, and the marker comment where later tasks insert subtests.

- [ ] **Step 1: Write the test harness** — create `tests/worker-harness.mjs`:

```js
import { build } from 'esbuild';
import { Miniflare } from 'miniflare';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));

/**
 * Bundle real route handlers into one Worker and boot it on Miniflare with a
 * fresh in-memory D1, so tests exercise real handlers, migrations and D1
 * transactions. `routes` is [path, dir under app/api]; `dynamic` is
 * [regex source, dir, param names].
 */
export async function startWorker({ routes, dynamic = [], bindings = {} }) {
  const all = [...routes, ...dynamic];
  const imports = all.map(([, dir], i) => `import * as route${i} from './app/api/${dir}/route.ts';`).join('\n');
  const entry = `${imports}
const exact = new Map([${routes.map(([path], i) => `[${JSON.stringify(path)}, route${i}]`).join(',')}]);
const dynamic = [${dynamic.map(([pattern, , keys], i) => `[new RegExp(${JSON.stringify(pattern)}), route${routes.length + i}, ${JSON.stringify(keys)}]`).join(',')}];
export default { async fetch(request) {
  const path = new URL(request.url).pathname;
  let handler = exact.get(path); let params = {};
  for (const [pattern, route, keys] of dynamic) {
    const match = path.match(pattern);
    if (match) { handler = route; params = Object.fromEntries(keys.map((key, n) => [key, match[n + 1]])); }
  }
  return handler?.[request.method] ? handler[request.method](request, { params: Promise.resolve(params) }) : new Response('Not found', { status: 404 });
}};`;
  const bundle = await build({
    stdin: { contents: entry, resolveDir: root }, bundle: true, write: false, format: 'esm', platform: 'neutral',
    conditions: ['workerd', 'worker'], external: ['cloudflare:workers', 'node:*'],
    define: { 'process.env.NODE_ENV': '"development"' },
    plugins: [{ name: 'sql', setup(builder) {
      builder.onResolve({ filter: /\.sql\?raw$/ }, args => ({ path: fileURLToPath(new URL(args.path.replace('?raw', ''), `file://${args.resolveDir}/`)), namespace: 'sql' }));
      builder.onLoad({ filter: /.*/, namespace: 'sql' }, async args => ({ contents: await readFile(args.path, 'utf8'), loader: 'text' }));
    } }],
  });
  const mf = new Miniflare({
    modules: true, script: bundle.outputFiles[0].text, compatibilityDate: '2026-05-15',
    compatibilityFlags: ['nodejs_compat'], d1Databases: ['DB'], bindings,
  });
  const request = (path, cookie, method = 'GET', body) => mf.dispatchFetch('http://school.test' + path, {
    method,
    headers: { ...(cookie ? { cookie } : {}), ...(body ? { 'content-type': 'application/json' } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  return { mf, request };
}
```

- [ ] **Step 2: Write the failing test** — create `tests/platform-admin.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { startWorker } from './worker-harness.mjs';
import { hashPassword } from '../app/lib/password.ts';
import { totpCode } from '../app/lib/totp.ts';

const routes = [
  ['/api/auth/teacher', 'auth/teacher'],
  ['/api/platform/auth/login', 'platform/auth/login'], ['/api/platform/auth/totp', 'platform/auth/totp'],
  ['/api/platform/auth/logout', 'platform/auth/logout'], ['/api/platform/auth/me', 'platform/auth/me'],
  ['/api/platform/auth/setup', 'platform/auth/setup'],
  // ── later tasks append routes here ──
];
const dynamic = [
  // ── later tasks append dynamic routes here ──
];
/** [method, path] for every platform route that must refuse anonymous callers and school staff. */
const PROTECTED = [
  ['GET', '/api/platform/auth/me'],
  // ── later tasks append protected routes here ──
];

const sha = value => createHash('sha256').update(value).digest('hex');
const cookieOf = response => response.headers.getSetCookie()[0].split(';')[0];

test('platform admin panel', async t => {
  const { mf, request } = await startWorker({ routes, dynamic, bindings: { PLATFORM_ADMIN_EMAIL: 'boot@cs.test' } });
  const json = async (path, cookie, method = 'GET', body, status = 200) => {
    const response = await request(path, cookie, method, body);
    const payload = await response.json();
    assert.equal(response.status, status, `${method} ${path}: ${JSON.stringify(payload)}`);
    return payload;
  };
  const login = async (path, body) => {
    const response = await request(path, null, 'POST', body);
    return { status: response.status, cookie: response.status === 200 ? cookieOf(response) : null, body: await response.json() };
  };
  const teacherLogin = (email, password) => login('/api/auth/teacher', { email, password });
  const studentLogin = (school, className, rollNo, password) => login('/api/auth/student', { school, className, rollNo, password });
  try {
    // The first teacher login runs migrations and seeds the demo school (id 1).
    const demoAdmin = (await teacherLogin('teacher@dpsrkp.edu.in', 'Teacher@123')).cookie;
    assert.ok(demoAdmin);
    const db = await mf.getD1Database('DB');
    let platform, secret, enrolledAt;

    await t.test('bootstrap creates the env admin as pending with a setup link', async () => {
      assert.equal((await request('/api/platform/auth/login', null, 'POST', { email: 'boot@cs.test', password: 'anything-at-all' })).status, 401);
      const row = await db.prepare("SELECT status, setup_token_hash FROM platform_admins WHERE email='boot@cs.test'").first();
      assert.equal(row.status, 'pending');
      assert.ok(row.setup_token_hash);
    });

    await t.test('a setup link enrols a password and 2FA exactly once', async () => {
      await db.prepare("INSERT INTO platform_admins (name,email,setup_token_hash,setup_expires_at) VALUES ('Founder','founder@cs.test',?,?)")
        .bind(sha('setup-token-founder'), Date.now() + 60_000).run();
      const setup = await json('/api/platform/auth/setup?token=setup-token-founder');
      assert.equal(setup.email, 'founder@cs.test');
      assert.match(setup.otpauthUri, /^otpauth:\/\/totp\//);
      secret = setup.secret;
      enrolledAt = Date.now();
      const body = { token: 'setup-token-founder', name: 'Founder', password: 'correct horse battery', secret };
      assert.equal((await request('/api/platform/auth/setup', null, 'POST', { ...body, password: 'short', code: await totpCode(secret, enrolledAt) })).status, 400);
      assert.equal((await request('/api/platform/auth/setup', null, 'POST', { ...body, code: '000000' })).status, 400);
      await json('/api/platform/auth/setup', null, 'POST', { ...body, code: await totpCode(secret, enrolledAt) });
      assert.equal((await request('/api/platform/auth/setup?token=setup-token-founder')).status, 400);
    });

    await t.test('login needs the password and a fresh TOTP code; codes cannot be replayed', async () => {
      const first = await login('/api/platform/auth/login', { email: 'founder@cs.test', password: 'correct horse battery' });
      assert.equal(first.status, 200);
      assert.equal(first.body.mfaRequired, true);
      platform = first.cookie;
      assert.equal((await request('/api/platform/auth/me', platform)).status, 401);
      assert.equal((await request('/api/platform/auth/totp', platform, 'POST', { code: '000000' })).status, 401);
      // The enrolment used the current step, so sign in with the next one.
      const code = await totpCode(secret, enrolledAt + 30_000);
      await json('/api/platform/auth/totp', platform, 'POST', { code });
      assert.equal((await json('/api/platform/auth/me', platform)).admin.email, 'founder@cs.test');
      const second = await login('/api/platform/auth/login', { email: 'founder@cs.test', password: 'correct horse battery' });
      assert.equal((await request('/api/platform/auth/totp', second.cookie, 'POST', { code })).status, 401);
      assert.equal((await request('/api/platform/auth/login', null, 'POST', { email: 'founder@cs.test', password: 'wrong password here' })).status, 401);
    });

    await t.test('platform routes refuse anonymous callers and school staff', async () => {
      for (const [method, path] of PROTECTED) {
        const body = method === 'GET' ? undefined : {};
        assert.equal((await request(path, null, method, body)).status, 401, `${method} ${path}`);
        assert.equal((await request(path, demoAdmin, method, body)).status, 401, `${method} ${path} as teacher`);
      }
    });

    // ── later tasks add subtests above this line ──

    await t.test('logout ends the platform session', async () => {
      await json('/api/platform/auth/logout', platform, 'POST', {});
      assert.equal((await request('/api/platform/auth/me', platform)).status, 401);
    });
  } finally {
    await mf.dispose();
  }
});
```

Rate-limit budget used by this file (per minute, shared "unknown" IP): platform login 4 of 5, TOTP 3 of 5, setup 3 of 5. Later tasks must not add platform login, TOTP or setup POSTs.

- [ ] **Step 3: Run it to verify it fails**

Run: `N22 node --test tests/platform-admin.test.mjs` (outside the sandbox)
Expected: FAIL — esbuild cannot resolve `./app/api/platform/auth/login/route.ts`.

- [ ] **Step 4: Cookie name** — append to `app/lib/cookie-names.ts`:

```ts
export const PLATFORM_SESSION_COOKIE = "cybersuraksha_platform_session";
```

- [ ] **Step 5: Export the cookie helpers** — in `app/lib/session.ts` change `function isSecureRequest(request: Request): boolean {` to `export function isSecureRequest(request: Request): boolean {` and `function readCookie(header: string | null, name: string): string | null {` to `export function readCookie(header: string | null, name: string): string | null {`.

- [ ] **Step 6: Audit actor, IP and user agent** — replace the body of `app/lib/audit.ts` with:

```ts
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
```

- [ ] **Step 7: Platform sessions** — create `app/lib/platform-session.ts`:

```ts
import { eq } from "drizzle-orm";
import { getDb } from "../../db";
import { ensureMigrated } from "../../db/migrate";
import { platformAdmins, platformSessions } from "../../db/schema";
import { PLATFORM_SESSION_COOKIE } from "./cookie-names";
import { isSecureRequest, readCookie } from "./session";
import { randomToken, sha256Hex } from "./tokens";

/**
 * Sessions for CyberSuraksha staff in /admins. Same opaque hashed-token model
 * as teacher sessions, plus a second factor: the password step creates the
 * session with `mfaPassedAt` null, and only the TOTP step makes it usable. A
 * separate cookie keeps staff and school logins apart.
 */

const PLATFORM_SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

export type PlatformAdmin = { id: number; name: string; email: string };

export type PlatformSession = {
  sessionId: string;
  mfaPassed: boolean;
  admin: PlatformAdmin & { totpSecret: string | null; totpLastStep: number };
};

function buildCookie(request: Request, value: string, maxAgeSeconds: number): string {
  const attributes = [
    `${PLATFORM_SESSION_COOKIE}=${value}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    `Max-Age=${maxAgeSeconds}`,
  ];
  if (isSecureRequest(request)) attributes.push("Secure");
  return attributes.join("; ");
}

/** Create a session after the password step and return its Set-Cookie value. */
export async function createPlatformSession(request: Request, adminId: number): Promise<string> {
  await ensureMigrated();
  const token = randomToken();
  await getDb().insert(platformSessions).values({
    id: crypto.randomUUID(),
    adminId,
    tokenHash: await sha256Hex(token),
    expiresAt: Date.now() + PLATFORM_SESSION_TTL_MS,
    ip: request.headers.get("cf-connecting-ip"),
    userAgent: request.headers.get("user-agent"),
  });
  return buildCookie(request, encodeURIComponent(token), Math.floor(PLATFORM_SESSION_TTL_MS / 1000));
}

/**
 * The caller's live session for an active admin, including one still waiting
 * for its TOTP step. Expired rows are pruned on sight.
 */
export async function getPlatformSession(request: Request): Promise<PlatformSession | null> {
  const token = readCookie(request.headers.get("cookie"), PLATFORM_SESSION_COOKIE);
  if (!token) return null;
  await ensureMigrated();
  const db = getDb();
  const [row] = await db
    .select({
      sessionId: platformSessions.id,
      expiresAt: platformSessions.expiresAt,
      mfaPassedAt: platformSessions.mfaPassedAt,
      status: platformAdmins.status,
      admin: {
        id: platformAdmins.id,
        name: platformAdmins.name,
        email: platformAdmins.email,
        totpSecret: platformAdmins.totpSecret,
        totpLastStep: platformAdmins.totpLastStep,
      },
    })
    .from(platformSessions)
    .innerJoin(platformAdmins, eq(platformSessions.adminId, platformAdmins.id))
    .where(eq(platformSessions.tokenHash, await sha256Hex(token)))
    .limit(1);
  if (!row) return null;
  if (row.expiresAt < Date.now()) {
    await db.delete(platformSessions).where(eq(platformSessions.id, row.sessionId));
    return null;
  }
  if (row.status !== "active") return null;
  return { sessionId: row.sessionId, mfaPassed: row.mfaPassedAt != null, admin: row.admin };
}

export async function markMfaPassed(sessionId: string): Promise<void> {
  await getDb()
    .update(platformSessions)
    .set({ mfaPassedAt: new Date().toISOString() })
    .where(eq(platformSessions.id, sessionId));
}

/** Delete the caller's session and return a Set-Cookie value that clears it. */
export async function destroyPlatformSession(request: Request): Promise<string> {
  const token = readCookie(request.headers.get("cookie"), PLATFORM_SESSION_COOKIE);
  if (token) {
    await ensureMigrated();
    await getDb().delete(platformSessions).where(eq(platformSessions.tokenHash, await sha256Hex(token)));
  }
  return buildCookie(request, "", 0);
}

/**
 * Require a fully signed-in platform admin (password and TOTP). Returns the
 * admin or a ready-to-return 401, like `requireTeacher`.
 */
export async function requirePlatformAdmin(request: Request): Promise<PlatformAdmin | Response> {
  const session = await getPlatformSession(request);
  if (!session?.mfaPassed) return Response.json({ error: "Sign in to continue." }, { status: 401 });
  const { id, name, email } = session.admin;
  return { id, name, email };
}
```

- [ ] **Step 8: Setup links and bootstrap** — create `app/lib/platform-admins.ts`:

```ts
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
```

- [ ] **Step 9: Login route** — create `app/api/platform/auth/login/route.ts`:

```ts
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
```

- [ ] **Step 10: TOTP route** — create `app/api/platform/auth/totp/route.ts`:

```ts
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
```

- [ ] **Step 11: Logout and me** — create `app/api/platform/auth/logout/route.ts`:

```ts
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
```

and `app/api/platform/auth/me/route.ts`:

```ts
import { requirePlatformAdmin } from "../../../../lib/platform-session";

export async function GET(request: Request) {
  const admin = await requirePlatformAdmin(request);
  if (admin instanceof Response) return admin;
  return Response.json({ admin });
}
```

- [ ] **Step 12: Setup route** — create `app/api/platform/auth/setup/route.ts`:

```ts
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "../../../../../db";
import { platformAdmins, platformSessions } from "../../../../../db/schema";
import { writeAudit } from "../../../../lib/audit";
import { hashPassword } from "../../../../lib/password";
import { findSetupAdmin } from "../../../../lib/platform-admins";
import { enforceRateLimit } from "../../../../lib/rate-limit";
import { newTotpSecret, otpauthUri, verifyTotp } from "../../../../lib/totp";
import { parseJson, rejectCrossSiteJson } from "../../../../lib/validation";

const invalidLink = () =>
  Response.json({ error: "This setup link is invalid, used or expired. Ask a teammate for a new one." }, { status: 400 });

const setupSchema = z.object({
  token: z.string().min(10).max(200),
  name: z.string().trim().min(2).max(120),
  password: z.string().min(12, "Use at least 12 characters.").max(200),
  secret: z.string().regex(/^[A-Z2-7]{32}$/),
  code: z.string().trim().max(10),
});

/**
 * Validate a setup link and propose a fresh TOTP secret. The secret is only
 * stored once POST proves the admin's app produces matching codes.
 */
export async function GET(request: Request) {
  const admin = await findSetupAdmin(new URL(request.url).searchParams.get("token") ?? "");
  if (!admin) return invalidLink();
  const secret = newTotpSecret();
  return Response.json({ name: admin.name, email: admin.email, secret, otpauthUri: otpauthUri(secret, admin.email) });
}

/** Set name and password, enrol 2FA, and burn the link. */
export async function POST(request: Request) {
  const crossSite = rejectCrossSiteJson(request);
  if (crossSite) return crossSite;
  const limited = enforceRateLimit(request, "platform:setup", 5, 60_000);
  if (limited) return limited;
  const parsed = await parseJson(request, setupSchema);
  if (parsed.error) return parsed.error;
  const { token, name, password, secret, code } = parsed.data;

  const admin = await findSetupAdmin(token);
  if (!admin) return invalidLink();
  const step = await verifyTotp(secret, code, Date.now());
  if (step == null) {
    return Response.json({ error: "That code does not match. Add the key to your authenticator app and enter the current code." }, { status: 400 });
  }

  const db = getDb();
  // Conditional on the same token hash, so a link cannot be used twice in a race.
  const [done] = await db
    .update(platformAdmins)
    .set({
      name,
      passwordHash: await hashPassword(password),
      totpSecret: secret,
      totpLastStep: step,
      status: "active",
      setupTokenHash: null,
      setupExpiresAt: null,
    })
    .where(and(eq(platformAdmins.id, admin.id), eq(platformAdmins.setupTokenHash, admin.setupTokenHash!)))
    .returning({ id: platformAdmins.id });
  if (!done) return invalidLink();
  // A reset must sign out every session created with the old factors.
  await db.delete(platformSessions).where(eq(platformSessions.adminId, admin.id));
  await writeAudit({ actorPlatformAdminId: admin.id, action: "platform.admin.setup", targetType: "platform_admin", targetId: admin.id, request });
  return Response.json({ ok: true });
}
```

- [ ] **Step 13: Worker gate and noindex** — in `worker/index.ts`:

Replace `import { SESSION_COOKIE } from "../app/lib/cookie-names";` with `import { PLATFORM_SESSION_COOKIE, SESSION_COOKIE } from "../app/lib/cookie-names";`.

Replace

```ts
function hasTeacherSession(request: Request): boolean {
  const pattern = new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=[^;\\s]+`);
  return pattern.test(request.headers.get("cookie") ?? "");
}
```

with

```ts
function hasCookie(request: Request, name: string): boolean {
  const pattern = new RegExp(`(?:^|;\\s*)${name}=[^;\\s]+`);
  return pattern.test(request.headers.get("cookie") ?? "");
}
```

In `harden`, after `headers.set("X-Content-Type-Options", "nosniff");` add

```ts
  // The company panel and its API are never meant to be found by search engines.
  if (url.pathname.startsWith("/admins") || url.pathname.startsWith("/api/platform")) {
    headers.set("X-Robots-Tag", "noindex, nofollow");
  }
```

Replace

```ts
      if (!hasTeacherSession(request)) {
        return Response.redirect(new URL("/teacher-login", url).toString(), 302);
      }
    }
```

with

```ts
      if (!hasCookie(request, SESSION_COOKIE)) {
        return Response.redirect(new URL("/teacher-login", url).toString(), 302);
      }
    }

    // Same UX guard for the company panel; its APIs verify the session and 2FA.
    if (url.pathname === "/admins" || url.pathname.startsWith("/admins/")) {
      const open = url.pathname === "/admins/login" || url.pathname === "/admins/setup";
      if (!open && !hasCookie(request, PLATFORM_SESSION_COOKIE)) {
        return Response.redirect(new URL("/admins/login", url).toString(), 302);
      }
    }
```

- [ ] **Step 14: Run the test**

Run: `N22 node --test tests/platform-admin.test.mjs` (outside the sandbox)
Expected: PASS, 5 subtests. If only the bootstrap subtest fails because `process.env.PLATFORM_ADMIN_EMAIL` is undefined inside the worker, add `'nodejs_compat_populate_process_env'` to `compatibilityFlags` in `tests/worker-harness.mjs` and re-run.

- [ ] **Step 15: Typecheck and lint**

Run: `N22 npm run typecheck && N22 npm run lint`
Expected: no errors.

- [ ] **Step 16: Commit**

```bash
git add app/lib/cookie-names.ts app/lib/session.ts app/lib/audit.ts app/lib/platform-session.ts app/lib/platform-admins.ts app/api/platform worker/index.ts tests/worker-harness.mjs tests/platform-admin.test.mjs
git commit -m "Add platform admin sign-in with setup links and TOTP 2FA

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Hidden chapters and feature switches

**Files:**
- Modify: `app/lib/content-policy.ts`, `app/lib/content-access.ts`, `app/lib/content-page.ts`
- Modify (gates): `app/lib/assignment-access.ts`, `app/lib/save-assignment.ts`, `app/api/lms/assignments/route.ts`, `app/api/lms/inbox/route.ts`, `app/api/lms/marks/route.ts`, `app/api/live/route.ts`, `app/api/chat/route.ts`
- Create: `app/api/features/route.ts`
- Modify (UI): `app/components/LanguageToggle.tsx`, `app/grade/[grade]/page.tsx`, `app/grade/[grade]/[subject]/page.tsx`, `app/dashboard/page.tsx`
- Test: `tests/platform-admin.test.mjs`

**Interfaces:**
- Consumes: Task 2 `schoolSettings.hiddenModules`, `schoolSettings.features`.
- Produces:
  - `content-policy.ts`: `schoolFeatures = ["chat", "live", "lms", "hindi"] as const`, `type SchoolFeature`, `type SchoolFeatures = Record<SchoolFeature, boolean>`, `allFeaturesOn`, `allFeaturesOff`, `ContentAccess` now `{ schoolName; grades; subjects; hiddenModules: string[]; features: SchoolFeatures }`, `permitsModule(access, module: { id; grades; strand })` also refuses hidden ids.
  - `content-access.ts`: `requireFeature(schoolId: number | null, feature: SchoolFeature): Promise<Response | null>` (403 when off).
  - `content-page.ts`: `listsModule(access: ContentAccess, grade: number, module: { title: string; strand: string }): boolean`.
  - `GET /api/features` → `{ features: SchoolFeatures }` (all on when signed out).

- [ ] **Step 1: Write the failing test** — in `tests/platform-admin.test.mjs`, add to `routes` above `// ── later tasks append routes here ──`:

```js
  ['/api/auth/student', 'auth/student'], ['/api/activity', 'activity'], ['/api/chat', 'chat'], ['/api/live', 'live'],
  ['/api/features', 'features'], ['/api/lms/assignments', 'lms/assignments'], ['/api/lms/inbox', 'lms/inbox'], ['/api/lms/marks', 'lms/marks'],
```

and add above `// ── later tasks add subtests above this line ──`:

```js
    await t.test('hidden chapters and feature switches apply on the next request', async () => {
      const student = (await studentLogin('dps-rkp', '7A', '20', 'DPS20SAFE')).cookie;
      const chapter = (await json('/api/lms/assignments', demoAdmin)).modules.find(m => m.grades.includes(7));
      const startChapter = () => request('/api/activity', student, 'POST', { moduleId: chapter.id, type: 'module_started', payload: {} });
      const setControls = (hidden, features) => db.prepare(
        "INSERT INTO school_settings (school_id,grades,subjects,hidden_modules,features) VALUES (1,?,?,?,?) ON CONFLICT(school_id) DO UPDATE SET hidden_modules=excluded.hidden_modules, features=excluded.features",
      ).bind('[3,4,5,6,7,8,9,10,11,12]', JSON.stringify(['Computational Thinking', 'Artificial Intelligence', 'Cybersecurity', 'Cyber Fraud']), JSON.stringify(hidden), JSON.stringify(features)).run();

      assert.equal((await startChapter()).status, 200);
      await setControls([chapter.id], { chat: false, hindi: false });
      assert.ok(!(await json('/api/lms/assignments', demoAdmin)).modules.some(m => m.id === chapter.id));
      assert.equal((await startChapter()).status, 403);
      assert.equal((await request('/api/chat', demoAdmin, 'POST', { message: 'Show deadlines' })).status, 403);
      assert.equal((await request('/api/chat', student, 'POST', { message: 'What is phishing?' })).status, 403);
      assert.deepEqual((await json('/api/features', student)).features, { chat: false, live: true, lms: true, hindi: false });
      assert.equal((await json('/api/features')).features.hindi, true);

      await setControls([], { lms: false, live: false });
      assert.equal((await request('/api/lms/assignments', demoAdmin)).status, 403);
      assert.equal((await request('/api/lms/marks', demoAdmin)).status, 403);
      assert.equal((await request('/api/lms/inbox', student)).status, 403);
      assert.equal((await request('/api/live', demoAdmin)).status, 403);

      await setControls([], {});
      assert.equal((await request('/api/lms/assignments', demoAdmin)).status, 200);
      assert.equal((await startChapter()).status, 200);
    });
```

- [ ] **Step 2: Run it to verify it fails**

Run: `N22 node --test tests/platform-admin.test.mjs` (outside the sandbox)
Expected: FAIL — esbuild cannot resolve `./app/api/features/route.ts`.

- [ ] **Step 3: Content policy** — in `app/lib/content-policy.ts` replace

```ts
export type ContentAccess = { schoolName: string; grades: number[]; subjects: string[] };

export function permitsModule(access: ContentAccess, module: { grades: readonly number[]; strand: string }) {
  return module.grades.some(grade => access.grades.includes(grade)) && access.subjects.includes(module.strand);
}
```

with

```ts
/** Per-school switches set from the platform panel. A key missing from storage means on. */
export const schoolFeatures = ["chat", "live", "lms", "hindi"] as const;
export type SchoolFeature = (typeof schoolFeatures)[number];
export type SchoolFeatures = Record<SchoolFeature, boolean>;
export const allFeaturesOn: SchoolFeatures = { chat: true, live: true, lms: true, hindi: true };
export const allFeaturesOff: SchoolFeatures = { chat: false, live: false, lms: false, hindi: false };

export type ContentAccess = {
  schoolName: string;
  grades: number[];
  subjects: string[];
  /** Module ids the platform has hidden for this school. */
  hiddenModules: string[];
  features: SchoolFeatures;
};

export function permitsModule(access: ContentAccess, module: { id: string; grades: readonly number[]; strand: string }) {
  return module.grades.some(grade => access.grades.includes(grade))
    && access.subjects.includes(module.strand)
    && !access.hiddenModules.includes(module.id);
}
```

- [ ] **Step 4: Content access** — in `app/lib/content-access.ts` replace the import of `content-policy` with

```ts
import { allFeaturesOff, allFeaturesOn, schoolGrades, schoolSubjects, type ContentAccess, type SchoolFeature } from "./content-policy";
```

replace `schoolContent` with

```ts
export async function schoolContent(schoolId: number): Promise<ContentAccess> {
  const [school] = await getDb().select().from(schools).where(eq(schools.id, schoolId));
  const [settings] = await getDb().select().from(schoolSettings).where(eq(schoolSettings.schoolId, schoolId));
  if (!school) return { schoolName: "School", grades: [], subjects: [], hiddenModules: [], features: allFeaturesOff };
  return {
    schoolName: school.name,
    grades: settings ? JSON.parse(settings.grades) : schoolGrades,
    subjects: settings ? JSON.parse(settings.subjects) : schoolSubjects,
    hiddenModules: settings ? JSON.parse(settings.hiddenModules) : [],
    features: { ...allFeaturesOn, ...(settings ? JSON.parse(settings.features) : {}) },
  };
}

const featureNames: Record<SchoolFeature, string> = {
  chat: "Shiksha Guide",
  live: "The live class feed",
  lms: "Assignments",
  hindi: "Hindi mode",
};

/** A ready 403 when the platform has switched `feature` off for the school, else null. */
export async function requireFeature(schoolId: number | null, feature: SchoolFeature): Promise<Response | null> {
  if (schoolId != null && (await schoolContent(schoolId)).features[feature]) return null;
  return Response.json(
    { error: `${featureNames[feature]} is not enabled for your school. Contact CyberSuraksha to turn it on.` },
    { status: 403 },
  );
}
```

and in `studentContent` replace `return { schoolName: "School", grades: [], subjects: [] };` with `return { schoolName: "School", grades: [], subjects: [], hiddenModules: [], features: allFeaturesOff };`.

- [ ] **Step 5: Find any other `ContentAccess` literals**

Run: `N22 npm run typecheck`
Expected: errors only where an object is built as `ContentAccess` without the two new fields. Add `hiddenModules: [], features: allFeaturesOff` (importing `allFeaturesOff` from `content-policy`) to each, then re-run until clean.

- [ ] **Step 6: Listing filter** — in `app/lib/content-page.ts` replace

```ts
import { permitsModule, permitsSubject } from "./content-policy";
import { getPlayableModuleById } from "../data/module-registry";
```

with

```ts
import { permitsModule, permitsSubject, type ContentAccess } from "./content-policy";
import { getPlayableModule, getPlayableModuleById } from "../data/module-registry";

/** Listing filter for chapter cards: the strand is licensed and the chapter is not hidden for the school. */
export function listsModule(access: ContentAccess, grade: number, module: { title: string; strand: string }) {
  const playable = getPlayableModule(grade, module.title);
  return access.subjects.includes(module.strand) && !(playable && access.hiddenModules.includes(playable.id));
}
```

- [ ] **Step 7: Use it in the three listings**

`app/grade/[grade]/page.tsx`: change `import { requireGradePage } from "../../lib/content-page";` to `import { listsModule, requireGradePage } from "../../lib/content-page";` and replace `modules: sourceGrade.modules.filter(m => context.access.subjects.includes(m.strand)),` with `modules: sourceGrade.modules.filter(m => listsModule(context.access, sourceGrade.grade, m)),`.

`app/dashboard/page.tsx`: add `import { listsModule } from "../lib/content-page";` after the `content-access` import, and replace `modules: entry.modules.filter(module => access.subjects.includes(module.strand)),` with `modules: entry.modules.filter(module => listsModule(access, entry.grade, module)),`.

`app/grade/[grade]/[subject]/page.tsx`: change `import { requireGradePage } from "../../../lib/content-page";` to `import { listsModule, requireGradePage } from "../../../lib/content-page";`, replace `  await requireGradePage(gradeNumber, subject);` with `  const { access } = await requireGradePage(gradeNumber, subject);`, and replace `{subject.modules?.map((module, index) => {` with `{subject.modules?.filter(module => listsModule(access, grade.grade, module)).map((module, index) => {`.

- [ ] **Step 8: Gate assignments (`lms`)**

`app/lib/assignment-access.ts`: change `import { schoolContent, studentContent } from "./content-access";` to `import { requireFeature, schoolContent, studentContent } from "./content-access";`. In `teacherAssignment` replace

```ts
  const auth = await requireTeacher(request);
  if (auth instanceof Response) return auth;
  if (!Number.isSafeInteger(id) || id <= 0) return Response.json({ error: "Assignment not found." }, { status: 404 });
```

with

```ts
  const auth = await requireTeacher(request);
  if (auth instanceof Response) return auth;
  const off = await requireFeature(auth.schoolId, "lms");
  if (off) return off;
  if (!Number.isSafeInteger(id) || id <= 0) return Response.json({ error: "Assignment not found." }, { status: 404 });
```

In `studentAssignment` replace

```ts
  const session = await requireStudent(request);
  if (session instanceof Response) return session;
  const student = session.student;
```

with

```ts
  const session = await requireStudent(request);
  if (session instanceof Response) return session;
  const off = await requireFeature(session.student.schoolId, "lms");
  if (off) return off;
  const student = session.student;
```

`app/lib/save-assignment.ts`: add `requireFeature` to its import from `./content-access` (add `import { requireFeature } from "./content-access";` if it has none) and replace `const auth = await requireTeacher(request); if (auth instanceof Response) return auth;` with `const auth = await requireTeacher(request); if (auth instanceof Response) return auth; const off = await requireFeature(auth.schoolId, "lms"); if (off) return off;`.

`app/api/lms/assignments/route.ts`: change `import { teacherContent } from "../../../lib/content-access";` to `import { requireFeature, teacherContent } from "../../../lib/content-access";` and replace `const auth = await requireTeacher(request); if (auth instanceof Response) return auth;` with `const auth = await requireTeacher(request); if (auth instanceof Response) return auth; const off = await requireFeature(auth.schoolId, "lms"); if (off) return off;`.

`app/api/lms/inbox/route.ts`: add `import { requireFeature } from "../../../lib/content-access";` (merge into an existing `content-access` import if there is one) and replace every occurrence (GET and PATCH) of `const session = await requireStudent(request); if (session instanceof Response) return session;` with `const session = await requireStudent(request); if (session instanceof Response) return session; const off = await requireFeature(session.student.schoolId, "lms"); if (off) return off;`.

`app/api/lms/marks/route.ts`: add `import { requireFeature } from "../../../lib/content-access";` and replace

```ts
  const auth = await requireTeacher(request);
  if (auth instanceof Response) return auth;
```

with

```ts
  const auth = await requireTeacher(request);
  if (auth instanceof Response) return auth;
  const off = await requireFeature(auth.schoolId, "lms");
  if (off) return off;
```

- [ ] **Step 9: Gate the live feed and chat**

`app/api/live/route.ts`: add `import { requireFeature } from "../../lib/content-access";` and replace

```ts
export async function GET(request: Request) {
  const auth = await requireTeacher(request);
  if (auth instanceof Response) return auth;
```

with

```ts
export async function GET(request: Request) {
  const auth = await requireTeacher(request);
  if (auth instanceof Response) return auth;
  const off = await requireFeature(auth.schoolId, "live");
  if (off) return off;
```

`app/api/chat/route.ts`: add `import { requireFeature } from "../../lib/content-access";` and replace

```ts
  if (!teacherSession && !studentSession) {
    return Response.json({ error: "Sign in to use Shiksha Guide." }, { status: 401 });
  }
```

with

```ts
  if (!teacherSession && !studentSession) {
    return Response.json({ error: "Sign in to use Shiksha Guide." }, { status: 401 });
  }
  // Checked before the quota and the provider call: a switched-off school costs nothing.
  const chatOff = await requireFeature(teacherSession ? teacherSession.teacher.schoolId : studentSession!.student.schoolId, "chat");
  if (chatOff) return chatOff;
```

- [ ] **Step 10: Features endpoint** — create `app/api/features/route.ts`:

```ts
import { schoolContent } from "../../lib/content-access";
import { allFeaturesOff, allFeaturesOn } from "../../lib/content-policy";
import { getSession } from "../../lib/session";
import { getStudentSession } from "../../lib/student-session";

/**
 * The signed-in user's school feature switches, for client UI such as the
 * language toggle. Signed-out pages (login, landing) keep every feature visible.
 */
export async function GET(request: Request) {
  const teacher = await getSession(request);
  const student = teacher ? null : await getStudentSession(request);
  if (!teacher && !student) return Response.json({ features: allFeaturesOn });
  const schoolId = teacher ? teacher.teacher.schoolId : student!.student.schoolId;
  return Response.json({ features: schoolId == null ? allFeaturesOff : (await schoolContent(schoolId)).features });
}
```

- [ ] **Step 11: Hide the language toggle when Hindi is off** — in `app/components/LanguageToggle.tsx`:

Change `import { readJson } from '../lib/read-json';` to `import { getJson, readJson } from '../lib/read-json';`.

Add `const [hindiAllowed, setHindiAllowed] = useState(true);` after `const [error, setError] = useState('');`.

Directly after the existing `useEffect(() => { const saved = readStoredMode(); … }, []);` block add:

```tsx
  useEffect(() => {
    let live = true;
    // The platform can switch Hindi off per school. This hides the control; the
    // catalogue itself is a public static file, so it is not a security boundary.
    void getJson<{ features?: { hindi?: boolean }; error?: string }>('/api/features').then(payload => {
      if (!live || payload.features?.hindi !== false) return;
      setHindiAllowed(false);
      void choose('en');
    });
    return () => { live = false; };
  }, []);
```

Replace `  const status = <span className={styles.status}` with

```tsx
  if (!hindiAllowed) return null;
  const status = <span className={styles.status}
```

(only the start of that line changes; keep the rest of the line as is).

- [ ] **Step 12: Run the tests**

Run: `N22 node --test tests/platform-admin.test.mjs && N22 npm run test:backend` (outside the sandbox)
Expected: PASS (platform: 6 subtests; backend suite unchanged).

- [ ] **Step 13: Typecheck and lint**

Run: `N22 npm run typecheck && N22 npm run lint`
Expected: no errors.

- [ ] **Step 14: Commit**

```bash
git add app/lib app/api app/components/LanguageToggle.tsx app/grade app/dashboard/page.tsx tests/platform-admin.test.mjs
git commit -m "Let the platform hide chapters and switch features per school

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Suspension, limits and licensing lockdown

**Files:**
- Create: `app/lib/school-controls.ts`
- Modify: `app/lib/session.ts`, `app/lib/student-session.ts`, `app/api/auth/teacher/route.ts`, `app/api/auth/student/route.ts`
- Modify: `app/api/students/route.ts`, `app/api/admin/classes/route.ts`, `app/lib/invites.ts`
- Modify: `app/api/admin/school/route.ts`, `app/components/lms/SchoolCurriculum.tsx`
- Test: `tests/platform-admin.test.mjs`, `tests/school-backend.test.mjs`

**Interfaces:**
- Consumes: Task 2 `schools.{status, seatLimit, teacherLimit, classLimit}`.
- Produces: `schoolPaused(): Response` (403); `limitExceeded(schoolId: number, kind: "students" | "teachers" | "classes", adding: number): Promise<string | null>`; `createInvite` now accepts `invitedByTeacherId: number | null`.

- [ ] **Step 1: Write the failing tests** — in `tests/platform-admin.test.mjs`, add to `routes`:

```js
  ['/api/admin/school', 'admin/school'], ['/api/admin/classes', 'admin/classes'], ['/api/admin/invites', 'admin/invites'],
  ['/api/students', 'students'],
```

and add above the subtest marker:

```js
    await t.test('suspending a school signs out its sessions and blocks new logins until reactivated', async () => {
      const student = (await studentLogin('dps-rkp', '7A', '20', 'DPS20SAFE')).cookie;
      await db.prepare("UPDATE schools SET status='suspended' WHERE id=1").run();
      assert.equal((await request('/api/lms/assignments', demoAdmin)).status, 401);
      assert.equal((await request('/api/lms/inbox', student)).status, 401);
      const teacherRetry = await teacherLogin('teacher@dpsrkp.edu.in', 'Teacher@123');
      assert.equal(teacherRetry.status, 403);
      assert.match(teacherRetry.body.error, /paused/);
      assert.equal((await studentLogin('dps-rkp', '7A', '20', 'DPS20SAFE')).status, 403);
      await db.prepare("UPDATE schools SET status='active' WHERE id=1").run();
      assert.equal((await request('/api/lms/assignments', demoAdmin)).status, 200);
    });

    await t.test('student, class and teacher limits are enforced', async () => {
      await db.prepare("INSERT INTO schools (id,name,slug,seat_limit,teacher_limit,class_limit) VALUES (50,'Limit School','limit-school',2,2,1)").run();
      await db.prepare("INSERT INTO teachers (school_id,name,email,password_hash,role,status) VALUES (50,'Limit Admin','admin@limit.test',?,'school_admin','active')")
        .bind(await hashPassword('LimitAdmin@123')).run();
      const limitAdmin = (await teacherLogin('admin@limit.test', 'LimitAdmin@123')).cookie;

      await json('/api/admin/classes', limitAdmin, 'POST', { grade: 7, section: 'A' }, 201);
      const secondClass = await request('/api/admin/classes', limitAdmin, 'POST', { grade: 7, section: 'B' });
      assert.equal(secondClass.status, 409);
      assert.match((await secondClass.json()).error, /1 of 1 classes/);
      // Adding students to a class that does not exist yet creates it, so that counts too.
      assert.equal((await request('/api/students', limitAdmin, 'POST', { className: '8C', students: [{ rollNo: '9', name: 'New Class' }] })).status, 409);

      const tooMany = await request('/api/students', limitAdmin, 'POST', { className: '7A', students: [{ rollNo: '1', name: 'A' }, { rollNo: '2', name: 'B' }, { rollNo: '3', name: 'C' }] });
      assert.equal(tooMany.status, 409);
      assert.match((await tooMany.json()).error, /0 of 2 student seats/);
      await json('/api/students', limitAdmin, 'POST', { className: '7A', students: [{ rollNo: '1', name: 'Asha' }, { rollNo: '2', name: 'Bilal' }] }, 201);

      // One admin plus one pending invite fills two teacher accounts.
      await json('/api/admin/invites', limitAdmin, 'POST', { email: 't1@limit.test' }, 201);
      const thirdTeacher = await request('/api/admin/invites', limitAdmin, 'POST', { email: 't2@limit.test' });
      assert.equal(thirdTeacher.status, 409);
      assert.match((await thirdTeacher.json()).error, /2 of 2 teacher accounts/);
    });

    await t.test('school admins can rename their school but not change licensing', async () => {
      assert.equal((await request('/api/admin/school', demoAdmin, 'PUT', { schoolName: 'DPS', grades: [3], subjects: ['Cybersecurity'] })).status, 403);
      await json('/api/admin/school', demoAdmin, 'PUT', { schoolName: 'Delhi Public School, R.K. Puram' });
    });
```

- [ ] **Step 2: Update the existing curriculum test** — in `tests/school-backend.test.mjs` replace

```js
  const settings=await json('/api/admin/school',admin);
  await json('/api/admin/school',admin,'PUT',{schoolName:settings.schoolName,grades:[6],subjects:['Cybersecurity']});
```

with

```js
  const settings=await json('/api/admin/school',admin);
  // Licensing is set by the platform now; a school admin's attempt is refused.
  assert.equal((await request('/api/admin/school',admin,'PUT',{schoolName:settings.schoolName,grades:[6],subjects:['Cybersecurity']})).status,403);
  const license=(grades,subjects)=>db.prepare("INSERT INTO school_settings (school_id,grades,subjects) VALUES (1,?,?) ON CONFLICT(school_id) DO UPDATE SET grades=excluded.grades, subjects=excluded.subjects").bind(JSON.stringify(grades),JSON.stringify(subjects)).run();
  await license([6],['Cybersecurity']);
```

and replace

```js
  await json('/api/admin/school',admin,'PUT',{schoolName:settings.schoolName,grades:settings.grades,subjects:settings.subjects});
```

with

```js
  await license(settings.grades,settings.subjects);
```

- [ ] **Step 3: Run them to verify they fail**

Run: `N22 node --test tests/platform-admin.test.mjs tests/school-backend.test.mjs` (outside the sandbox)
Expected: FAIL — suspension returns 200 instead of 401; limits return 201 instead of 409; the licensing PUT returns 200 instead of 403.

- [ ] **Step 4: School controls** — create `app/lib/school-controls.ts`:

```ts
import { and, count, eq, gt, isNull, ne } from "drizzle-orm";
import { getDb } from "../../db";
import { classes, invites, schools, students, teachers } from "../../db/schema";

/** The reply for any login into a school the platform has suspended. */
export function schoolPaused(): Response {
  return Response.json({ error: "Your school's access is paused. Contact CyberSuraksha." }, { status: 403 });
}

const nouns = { students: "student seats", teachers: "teacher accounts", classes: "classes" } as const;

/**
 * Contracted limits per school, set from the platform panel (null = unlimited).
 * Returns the message to show when adding `adding` more would exceed the limit,
 * or null when it fits. Pending, unexpired invites count towards the teacher
 * limit so a school cannot over-invite and then have everyone accept.
 */
export async function limitExceeded(
  schoolId: number,
  kind: keyof typeof nouns,
  adding: number,
): Promise<string | null> {
  const db = getDb();
  const [school] = await db
    .select({ students: schools.seatLimit, teachers: schools.teacherLimit, classes: schools.classLimit })
    .from(schools)
    .where(eq(schools.id, schoolId))
    .limit(1);
  const limit = school?.[kind];
  if (limit == null) return null;

  let used: number;
  if (kind === "students") {
    [{ used }] = await db.select({ used: count() }).from(students).where(eq(students.schoolId, schoolId));
  } else if (kind === "classes") {
    [{ used }] = await db.select({ used: count() }).from(classes).where(eq(classes.schoolId, schoolId));
  } else {
    const [{ active }] = await db
      .select({ active: count() })
      .from(teachers)
      .where(and(eq(teachers.schoolId, schoolId), ne(teachers.status, "suspended")));
    const [{ pending }] = await db
      .select({ pending: count() })
      .from(invites)
      .where(and(eq(invites.schoolId, schoolId), isNull(invites.acceptedAt), gt(invites.expiresAt, Date.now())));
    used = active + pending;
  }
  if (used + adding <= limit) return null;
  return `Limit reached: ${used} of ${limit} ${nouns[kind]} used. Contact CyberSuraksha to raise it.`;
}
```

- [ ] **Step 5: Suspension in the session resolvers**

`app/lib/session.ts`: change `import { sessions, teachers } from "../../db/schema";` to `import { schools, sessions, teachers } from "../../db/schema";`. In `getSessionFromCookieHeader` replace `      expiresAt: sessions.expiresAt,` with

```ts
      expiresAt: sessions.expiresAt,
      schoolStatus: schools.status,
```

replace

```ts
    .from(sessions)
    .innerJoin(teachers, eq(sessions.teacherId, teachers.id))
```

with

```ts
    .from(sessions)
    .innerJoin(teachers, eq(sessions.teacherId, teachers.id))
    .innerJoin(schools, eq(teachers.schoolId, schools.id))
```

and replace `  if (row.teacher.status !== "active") return null;` with

```ts
  if (row.teacher.status !== "active") return null;
  // A suspended school's staff are signed out on their very next request.
  if (row.schoolStatus !== "active") return null;
```

`app/lib/student-session.ts`: change `import { studentSessions, students } from "../../db/schema";` to `import { schools, studentSessions, students } from "../../db/schema";`. In `getStudentSessionFromCookieHeader` replace `      expiresAt: studentSessions.expiresAt,` with

```ts
      expiresAt: studentSessions.expiresAt,
      schoolStatus: schools.status,
```

replace

```ts
    .from(studentSessions)
    .innerJoin(students, eq(studentSessions.studentId, students.id))
```

with

```ts
    .from(studentSessions)
    .innerJoin(students, eq(studentSessions.studentId, students.id))
    .leftJoin(schools, eq(students.schoolId, schools.id))
```

and replace `  return { sessionId: row.sessionId, student: row.student };` (in that function) with

```ts
  // A suspended school's students are signed out on their very next request.
  if (row.schoolStatus === "suspended") return null;
  return { sessionId: row.sessionId, student: row.student };
```

- [ ] **Step 6: Suspension at login**

`app/api/auth/teacher/route.ts`: change `import { teachers } from "../../../../db/schema";` to `import { schools, teachers } from "../../../../db/schema";`, add `import { schoolPaused } from "../../../lib/school-controls";`, and replace

```ts
  if (teacher.status !== "active") {
    return Response.json({ error: "This account is not active." }, { status: 403 });
  }
```

with

```ts
  if (teacher.status !== "active") {
    return Response.json({ error: "This account is not active." }, { status: 403 });
  }
  const [school] = await getDb().select({ status: schools.status }).from(schools).where(eq(schools.id, teacher.schoolId)).limit(1);
  if (school?.status !== "active") return schoolPaused();
```

`app/api/auth/student/route.ts`: add `import { schoolPaused } from "../../../lib/school-controls";`, replace `    .select({ id: schools.id })` with `    .select({ id: schools.id, status: schools.status })`, and replace `  if (!ok) return invalid;` with

```ts
  if (!ok) return invalid;
  if (schoolRow.status !== "active") return schoolPaused();
```

- [ ] **Step 7: Limits**

`app/api/students/route.ts`: add `import { limitExceeded } from "../../lib/school-controls";`. Replace

```ts
  if (!className || rows.length === 0) {
    return Response.json(
      { error: "Class name and at least one student are required." },
      { status: 400 },
    );
  }
```

with

```ts
  if (!className || rows.length === 0) {
    return Response.json(
      { error: "Class name and at least one student are required." },
      { status: 400 },
    );
  }

  // Checked before any class is created, so a refused request writes nothing.
  const overSeats = await limitExceeded(auth.schoolId, "students", rows.length);
  if (overSeats) return Response.json({ error: overSeats }, { status: 409 });
```

and replace `    const section = className.replace(/^\d+/, "");` with

```ts
    const overClasses = await limitExceeded(auth.schoolId, "classes", 1);
    if (overClasses) return Response.json({ error: overClasses }, { status: 409 });
    const section = className.replace(/^\d+/, "");
```

`app/api/admin/classes/route.ts`: add `import { limitExceeded } from "../../../lib/school-controls";` and replace

```ts
  const [created] = await getDb()
    .insert(classes)
```

with

```ts
  const overClasses = await limitExceeded(auth.schoolId, "classes", 1);
  if (overClasses) return Response.json({ error: overClasses }, { status: 409 });

  const [created] = await getDb()
    .insert(classes)
```

`app/lib/invites.ts`: add `import { limitExceeded } from "./school-controls";`. In `createInvite` params change `  invitedByTeacherId: number;` to `  invitedByTeacherId: number | null;` and replace

```ts
  if (existing) {
    return { error: "A teacher with that email already exists.", status: 409 };
  }
```

with

```ts
  if (existing) {
    return { error: "A teacher with that email already exists.", status: 409 };
  }
  const overTeachers = await limitExceeded(params.schoolId, "teachers", 1);
  if (overTeachers) return { error: overTeachers, status: 409 };
```

In `acceptInvite` replace

```ts
  if (invite.expiresAt < Date.now()) {
    return { error: "This invite link has expired.", status: 400 };
  }
```

with

```ts
  if (invite.expiresAt < Date.now()) {
    return { error: "This invite link has expired.", status: 400 };
  }
  // This invite already counts as pending, so accepting adds nothing new; this
  // only refuses when the platform lowered the limit after it was sent.
  const overTeachers = await limitExceeded(invite.schoolId, "teachers", 0);
  if (overTeachers) return { error: overTeachers, status: 409 };
```

Also update the comment line `A school_admin issues an invite bound to an email + role.` in the file header to `A school_admin (or the platform panel) issues an invite bound to an email + role.`

- [ ] **Step 8: Licensing lockdown** — replace `app/api/admin/school/route.ts` with:

```ts
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "../../../../db";
import { schools } from "../../../../db/schema";
import { requireRole } from "../../../lib/auth";
import { schoolContent } from "../../../lib/content-access";
import { schoolGrades, schoolSubjects } from "../../../lib/content-policy";
import { writeAudit } from "../../../lib/audit";
import { parseJson } from "../../../lib/validation";

export async function GET(request: Request) {
  const auth = await requireRole(request, "school_admin");
  if (auth instanceof Response) return auth;
  return Response.json({ ...await schoolContent(auth.schoolId), availableGrades: schoolGrades, availableSubjects: schoolSubjects });
}

/**
 * A school admin may rename their school. Grades and subjects come from the
 * school's CyberSuraksha plan and are set only from the platform panel.
 */
export async function PUT(request: Request) {
  const auth = await requireRole(request, "school_admin");
  if (auth instanceof Response) return auth;
  const parsed = await parseJson(request, z.object({
    schoolName: z.string().trim().min(2).max(160),
    grades: z.unknown().optional(),
    subjects: z.unknown().optional(),
  }));
  if (parsed.error) return parsed.error;
  if (parsed.data.grades !== undefined || parsed.data.subjects !== undefined) {
    return Response.json({ error: "Grades and subjects come from your CyberSuraksha plan. Contact CyberSuraksha to change them." }, { status: 403 });
  }
  await getDb().update(schools).set({ name: parsed.data.schoolName }).where(eq(schools.id, auth.schoolId));
  await writeAudit({ actorTeacherId: auth.id, action: "school.rename", targetType: "school", targetId: auth.schoolId, metadata: { schoolName: parsed.data.schoolName }, request });
  return Response.json({ ok: true });
}
```

- [ ] **Step 9: Read-only plan card** — replace `app/components/lms/SchoolCurriculum.tsx` with:

```tsx
"use client";
import { useEffect, useState, type FormEvent } from "react";
import { getJson, readJson } from "../../lib/read-json";
import type { ContentAccess } from "../../lib/content-policy";
import s from "./lms.module.css";

/**
 * The school's licensed grades and subjects, read-only because they come from
 * the CyberSuraksha plan, plus the one setting a school admin owns: its name.
 */
export function SchoolCurriculum() {
  const [data, setData] = useState<ContentAccess | null>(null);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => { let live = true; void getJson<ContentAccess & { error?: string }>("/api/admin/school").then(p => { if (!live) return; if (p.error) setStatus(p.error); else { setData(p); setName(p.schoolName); } }); return () => { live = false; }; }, []);
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setStatus("");
    try {
      const response = await fetch("/api/admin/school", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ schoolName: name }) });
      const payload = await readJson<{ error?: string }>(response);
      setStatus(response.ok ? "School name saved." : payload.error ?? "Could not save the school name.");
    } catch { setStatus("Could not connect. Your changes have not been saved."); } finally { setBusy(false); }
  }
  return <section className="teacherPanel"><h2>School plan</h2><p>Your grades and subjects come from your CyberSuraksha plan. Contact CyberSuraksha to add grades or subjects.</p>{status && <p role="status">{status}</p>}{!data ? <p>Loading school settings…</p> : <>
    <p className={s.muted}>Grades: {data.grades.length ? data.grades.map(grade => `Class ${grade}`).join(", ") : "none"}</p>
    <p className={s.muted}>Subjects: {data.subjects.length ? data.subjects.join(", ") : "none"}</p>
    <form method="post" onSubmit={save} className={s.form}>
      <label className={s.field}>School name<input className={s.input} value={name} onChange={e => setName(e.target.value)} minLength={2} maxLength={160} required /></label>
      <button type="submit" className="teacherPrimary" disabled={busy}>{busy ? "Saving…" : "Save school name"}</button>
    </form>
  </>}</section>;
}
```

- [ ] **Step 10: Run the tests**

Run: `N22 node --test tests/platform-admin.test.mjs && N22 npm run test:backend` (outside the sandbox)
Expected: PASS (platform: 9 subtests; backend suite green with the updated curriculum test).

- [ ] **Step 11: Typecheck and lint**

Run: `N22 npm run typecheck && N22 npm run lint`
Expected: no errors.

- [ ] **Step 12: Commit**

```bash
git add app/lib app/api app/components/lms/SchoolCurriculum.tsx tests/platform-admin.test.mjs tests/school-backend.test.mjs
git commit -m "Enforce school suspension, contract limits and platform-only licensing

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Platform schools and leads API

**Files:**
- Create: `app/lib/platform-schools.ts`
- Create: `app/api/platform/schools/route.ts`, `app/api/platform/schools/[id]/route.ts`, `app/api/platform/schools/[id]/invite/route.ts`, `app/api/platform/schools/[id]/teachers/[teacherId]/route.ts`, `app/api/platform/schools/[id]/logout-all/route.ts`
- Create: `app/api/platform/leads/route.ts`, `app/api/platform/leads/[id]/route.ts`
- Test: `tests/platform-admin.test.mjs`

**Interfaces:**
- Consumes: `requirePlatformAdmin` (Task 3), `schoolContent`, `allFeaturesOn` (Task 4), `createInvite` with null inviter (Task 5), `writeAudit` (Task 3).
- Produces:
  - `platform-schools.ts`: `type SchoolUsage = { teachers; students; classes; active30d }`, `emptyUsage`, `usageBySchool(): Promise<Map<number, SchoolUsage>>`, `createSchoolSchema`, `updateSchoolSchema`, `leadStatuses`, `findSchool(rawId: string)`, `schoolNotFound(): Response`.
  - `GET /api/platform/schools` → `{ schools: (School & { usage })[] }`; `POST` → 201 `{ school }`.
  - `GET /api/platform/schools/[id]` → `{ school, licensing: { grades, subjects, hiddenModules, features }, usage, teachers, invites, catalog: { id, title, grades, strand }[], availableGrades, availableSubjects }`; `PATCH` → `{ ok: true }`.
  - `POST …/invite` `{ email }` → 201 `{ invite: { id, email, expiresAt, acceptUrl } }`.
  - `PATCH …/teachers/[teacherId]` `{ status: "active" | "suspended" }` → `{ ok: true }`.
  - `POST …/logout-all` → `{ ok: true }`.
  - `GET /api/platform/leads?status=` → `{ leads }`; `PATCH /api/platform/leads/[id]` `{ status?, notes? }` → `{ ok: true }`.

- [ ] **Step 1: Write the failing tests** — in `tests/platform-admin.test.mjs`, add to `routes`:

```js
  ['/api/auth/accept-invite', 'auth/accept-invite'], ['/api/platform/schools', 'platform/schools'], ['/api/platform/leads', 'platform/leads'],
```

to `dynamic` above its marker:

```js
  ['^/api/platform/schools/(\\d+)$', 'platform/schools/[id]', ['id']],
  ['^/api/platform/schools/(\\d+)/invite$', 'platform/schools/[id]/invite', ['id']],
  ['^/api/platform/schools/(\\d+)/teachers/(\\d+)$', 'platform/schools/[id]/teachers/[teacherId]', ['id', 'teacherId']],
  ['^/api/platform/schools/(\\d+)/logout-all$', 'platform/schools/[id]/logout-all', ['id']],
  ['^/api/platform/leads/(\\d+)$', 'platform/leads/[id]', ['id']],
```

to `PROTECTED` above its marker:

```js
  ['GET', '/api/platform/schools'], ['POST', '/api/platform/schools'],
  ['GET', '/api/platform/schools/1'], ['PATCH', '/api/platform/schools/1'],
  ['POST', '/api/platform/schools/1/invite'], ['PATCH', '/api/platform/schools/1/teachers/1'],
  ['POST', '/api/platform/schools/1/logout-all'],
  ['GET', '/api/platform/leads'], ['PATCH', '/api/platform/leads/1'],
```

and above the subtest marker:

```js
    const allSubjects = ['Computational Thinking', 'Artificial Intelligence', 'Cybersecurity', 'Cyber Fraud'];
    let greenId, gvAdmin, gvStudent;

    await t.test('a lead becomes a licensed school whose first admin onboards by invite', async () => {
      await db.prepare("INSERT INTO school_requests (school_name,contact_name,contact_email,student_count) VALUES ('Green Valley School','Mr Rao','rao@gv.test',40)").run();
      const lead = (await json('/api/platform/leads?status=new', platform)).leads.find(row => row.schoolName === 'Green Valley School');
      await json(`/api/platform/leads/${lead.id}`, platform, 'PATCH', { status: 'contacted', notes: 'Demo booked' });

      const { school } = await json('/api/platform/schools', platform, 'POST', {
        name: 'Green Valley School', slug: 'green-valley', plan: 'Pilot', seatLimit: 40, contractEndsAt: '2027-03-31',
        contactName: 'Mr Rao', contactEmail: 'rao@gv.test', grades: [7], subjects: allSubjects, leadId: lead.id,
      }, 201);
      greenId = school.id;
      assert.equal(school.status, 'active');
      assert.equal((await request('/api/platform/schools', platform, 'POST', { name: 'Copy', slug: 'green-valley', grades: [7], subjects: allSubjects })).status, 409);
      const converted = (await json('/api/platform/leads?status=converted', platform)).leads.find(row => row.id === lead.id);
      assert.equal(converted.schoolId, greenId);
      assert.equal(converted.notes, 'Demo booked');

      const { invite } = await json(`/api/platform/schools/${greenId}/invite`, platform, 'POST', { email: 'principal@gv.test' }, 201);
      const accepted = await request('/api/auth/accept-invite', null, 'POST', { token: new URL(invite.acceptUrl).searchParams.get('token'), name: 'GV Principal', password: 'Principal@123' });
      assert.equal(accepted.status, 200);
      gvAdmin = cookieOf(accepted);

      const detail = await json(`/api/platform/schools/${greenId}`, platform);
      assert.deepEqual(detail.licensing.grades, [7]);
      assert.equal(detail.teachers[0].role, 'school_admin');
      assert.equal(detail.usage.teachers, 1);
      assert.ok(detail.catalog.length > 0);
      assert.equal((await json('/api/platform/schools', platform)).schools.find(row => row.id === greenId).usage.teachers, 1);
    });

    await t.test('platform edits to chapters, features, limits and status reach the school at once', async () => {
      await json('/api/admin/classes', gvAdmin, 'POST', { grade: 7, section: 'A' }, 201);
      const issued = await json('/api/students', gvAdmin, 'POST', { className: '7A', students: [{ rollNo: '1', name: 'Asha' }] }, 201);
      gvStudent = (await studentLogin('green-valley', '7A', '1', issued.students[0].accessCode)).cookie;
      const { modules } = await json('/api/lms/assignments', gvAdmin);

      await json(`/api/platform/schools/${greenId}`, platform, 'PATCH', {
        hiddenModules: [modules[0].id], features: { chat: false, live: true, lms: true, hindi: true }, seatLimit: 1,
      });
      assert.ok(!(await json('/api/lms/assignments', gvAdmin)).modules.some(m => m.id === modules[0].id));
      assert.equal((await request('/api/chat', gvAdmin, 'POST', { message: 'Show deadlines' })).status, 403);
      assert.equal((await request('/api/students', gvAdmin, 'POST', { className: '7A', students: [{ rollNo: '2', name: 'Bilal' }] })).status, 409);

      await json(`/api/platform/schools/${greenId}`, platform, 'PATCH', { status: 'suspended' });
      assert.equal((await request('/api/lms/assignments', gvAdmin)).status, 401);
      assert.equal((await request('/api/lms/inbox', gvStudent)).status, 401);
      assert.equal((await request('/api/lms/assignments', demoAdmin)).status, 200);
      await json(`/api/platform/schools/${greenId}`, platform, 'PATCH', { status: 'active' });
      assert.equal((await request('/api/lms/assignments', gvAdmin)).status, 200);
      assert.equal((await request(`/api/platform/schools/${greenId}`, platform, 'PATCH', {})).status, 400);
    });

    await t.test('platform can suspend one school user and sign a whole school out', async () => {
      const principal = (await json(`/api/platform/schools/${greenId}`, platform)).teachers.find(row => row.email === 'principal@gv.test');
      assert.equal((await request(`/api/platform/schools/1/teachers/${principal.id}`, platform, 'PATCH', { status: 'suspended' })).status, 404);
      await json(`/api/platform/schools/${greenId}/teachers/${principal.id}`, platform, 'PATCH', { status: 'suspended' });
      assert.equal((await request('/api/lms/assignments', gvAdmin)).status, 401);
      await json(`/api/platform/schools/${greenId}/teachers/${principal.id}`, platform, 'PATCH', { status: 'active' });
      gvAdmin = (await teacherLogin('principal@gv.test', 'Principal@123')).cookie;

      await json(`/api/platform/schools/${greenId}/logout-all`, platform, 'POST', {});
      assert.equal((await request('/api/lms/assignments', gvAdmin)).status, 401);
      assert.equal((await request('/api/lms/inbox', gvStudent)).status, 401);
      assert.equal((await request('/api/lms/assignments', demoAdmin)).status, 200);
    });
```

- [ ] **Step 2: Run it to verify it fails**

Run: `N22 node --test tests/platform-admin.test.mjs` (outside the sandbox)
Expected: FAIL — esbuild cannot resolve `./app/api/platform/schools/route.ts`.

- [ ] **Step 3: Shared school helpers** — create `app/lib/platform-schools.ts`:

```ts
import { count, countDistinct, eq, gt, ne } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "../../db";
import { classes, learningAttempts, schools, students, teachers } from "../../db/schema";
import { schoolGrades, schoolSubjects } from "./content-policy";

export type SchoolUsage = { teachers: number; students: number; classes: number; active30d: number };
export const emptyUsage: SchoolUsage = { teachers: 0, students: 0, classes: 0, active30d: 0 };

/**
 * Usage for every school in four grouped queries rather than four per school,
 * so the schools table costs the same however many schools there are.
 * Teachers exclude suspended accounts; "active" means a learning attempt in
 * the last 30 days.
 */
export async function usageBySchool(): Promise<Map<number, SchoolUsage>> {
  const db = getDb();
  const since = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const [teacherRows, studentRows, classRows, activeRows] = await Promise.all([
    db.select({ schoolId: teachers.schoolId, n: count() }).from(teachers).where(ne(teachers.status, "suspended")).groupBy(teachers.schoolId),
    db.select({ schoolId: students.schoolId, n: count() }).from(students).groupBy(students.schoolId),
    db.select({ schoolId: classes.schoolId, n: count() }).from(classes).groupBy(classes.schoolId),
    db.select({ schoolId: students.schoolId, n: countDistinct(students.id) })
      .from(learningAttempts)
      .innerJoin(students, eq(students.id, learningAttempts.studentId))
      .where(gt(learningAttempts.lastActiveAt, since))
      .groupBy(students.schoolId),
  ]);
  const usage = new Map<number, SchoolUsage>();
  const of = (schoolId: number | null) => {
    if (schoolId == null) return null;
    if (!usage.has(schoolId)) usage.set(schoolId, { ...emptyUsage });
    return usage.get(schoolId)!;
  };
  for (const row of teacherRows) { const entry = of(row.schoolId); if (entry) entry.teachers = row.n; }
  for (const row of studentRows) { const entry = of(row.schoolId); if (entry) entry.students = row.n; }
  for (const row of classRows) { const entry = of(row.schoolId); if (entry) entry.classes = row.n; }
  for (const row of activeRows) { const entry = of(row.schoolId); if (entry) entry.active30d = row.n; }
  return usage;
}

const limit = z.number().int().min(0).max(1_000_000).nullable().optional();
const text = (max: number) => z.string().trim().max(max).nullable().optional();

/** Contract and limit fields; all optional so PATCH sends only what changed. Null clears a value. */
const contractFields = {
  plan: text(80),
  seatLimit: limit,
  teacherLimit: limit,
  classLimit: limit,
  contractEndsAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD.").nullable().optional(),
  contactName: text(120),
  contactEmail: z.string().trim().toLowerCase().email().nullable().optional(),
  notes: text(4000),
};

const grades = z.array(z.number().int().refine(grade => schoolGrades.includes(grade), "Unknown grade.")).min(1).max(10);
const subjects = z.array(z.string().refine(subject => schoolSubjects.includes(subject), "Unknown subject.")).min(1).max(6);
const hiddenModules = z.array(z.string().min(1).max(120)).max(2000);
const features = z.object({ chat: z.boolean(), live: z.boolean(), lms: z.boolean(), hindi: z.boolean() });
const name = z.string().trim().min(2).max(160);

export const createSchoolSchema = z.object({
  name,
  slug: z.string().trim().toLowerCase().max(60).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens."),
  ...contractFields,
  grades,
  subjects,
  hiddenModules: hiddenModules.optional(),
  features: features.optional(),
  leadId: z.number().int().positive().optional(),
});

export const updateSchoolSchema = z.object({
  name: name.optional(),
  status: z.enum(["active", "suspended"]).optional(),
  ...contractFields,
  grades: grades.optional(),
  subjects: subjects.optional(),
  hiddenModules: hiddenModules.optional(),
  features: features.optional(),
});

export const leadStatuses = ["new", "contacted", "converted", "rejected"] as const;

/** The school for a route's `[id]` param, or null when it is malformed or unknown. */
export async function findSchool(rawId: string) {
  const id = Number(rawId);
  if (!Number.isSafeInteger(id) || id <= 0) return null;
  const [school] = await getDb().select().from(schools).where(eq(schools.id, id)).limit(1);
  return school ?? null;
}

export function schoolNotFound(): Response {
  return Response.json({ error: "School not found." }, { status: 404 });
}
```

- [ ] **Step 4: Schools list and create** — create `app/api/platform/schools/route.ts`:

```ts
import { asc, eq, sql } from "drizzle-orm";
import { getDb } from "../../../../db";
import { schoolRequests, schools, schoolSettings } from "../../../../db/schema";
import { writeAudit } from "../../../lib/audit";
import { allFeaturesOn } from "../../../lib/content-policy";
import { requirePlatformAdmin } from "../../../lib/platform-session";
import { createSchoolSchema, emptyUsage, usageBySchool } from "../../../lib/platform-schools";
import { parseJson } from "../../../lib/validation";

/** Every school with its usage, for the panel's schools table. */
export async function GET(request: Request) {
  const admin = await requirePlatformAdmin(request);
  if (admin instanceof Response) return admin;
  const [rows, usage] = await Promise.all([
    getDb().select().from(schools).orderBy(asc(schools.name)),
    usageBySchool(),
  ]);
  return Response.json({ schools: rows.map(school => ({ ...school, usage: usage.get(school.id) ?? emptyUsage })) });
}

/** Create a school with its licensing, optionally converting the lead it came from. */
export async function POST(request: Request) {
  const admin = await requirePlatformAdmin(request);
  if (admin instanceof Response) return admin;
  const parsed = await parseJson(request, createSchoolSchema);
  if (parsed.error) return parsed.error;
  const { grades, subjects, hiddenModules = [], features = allFeaturesOn, leadId, ...fields } = parsed.data;

  const db = getDb();
  const taken = () => Response.json({ error: "That slug is already used by another school." }, { status: 409 });
  const [existing] = await db.select({ id: schools.id }).from(schools).where(eq(schools.slug, fields.slug)).limit(1);
  if (existing) return taken();

  // The settings and lead rows find the new school by its unique slug, so every
  // write lands in one batch (one transaction): no school without licensing.
  const newSchoolId = sql<number>`(select ${schools.id} from ${schools} where ${schools.slug} = ${fields.slug})`;
  const insertSchool = db.insert(schools).values(fields);
  const insertSettings = db.insert(schoolSettings).values({
    schoolId: newSchoolId,
    grades: JSON.stringify([...new Set(grades)].sort((a, b) => a - b)),
    subjects: JSON.stringify([...new Set(subjects)]),
    hiddenModules: JSON.stringify(hiddenModules),
    features: JSON.stringify(features),
  });
  try {
    if (leadId) {
      await db.batch([
        insertSchool,
        insertSettings,
        db.update(schoolRequests).set({ status: "converted", schoolId: newSchoolId }).where(eq(schoolRequests.id, leadId)),
      ]);
    } else {
      await db.batch([insertSchool, insertSettings]);
    }
  } catch {
    // The unique slug index is the only expected failure (a concurrent create).
    return taken();
  }

  const [school] = await db.select().from(schools).where(eq(schools.slug, fields.slug)).limit(1);
  await writeAudit({ actorPlatformAdminId: admin.id, action: "platform.school.create", targetType: "school", targetId: school.id, metadata: { ...parsed.data }, request });
  return Response.json({ school }, { status: 201 });
}
```

- [ ] **Step 5: School detail and update** — create `app/api/platform/schools/[id]/route.ts`:

```ts
import { and, asc, desc, eq, gt, isNull } from "drizzle-orm";
import type { BatchItem } from "drizzle-orm/batch";
import { getDb } from "../../../../../db";
import { invites, schools, schoolSettings, teachers } from "../../../../../db/schema";
import { playableModules } from "../../../../data/module-registry";
import { writeAudit } from "../../../../lib/audit";
import { schoolContent } from "../../../../lib/content-access";
import { schoolGrades, schoolSubjects } from "../../../../lib/content-policy";
import { requirePlatformAdmin } from "../../../../lib/platform-session";
import { emptyUsage, findSchool, schoolNotFound, updateSchoolSchema, usageBySchool } from "../../../../lib/platform-schools";
import { parseJson } from "../../../../lib/validation";

type Context = { params: Promise<{ id: string }> };

/** Everything the school page shows: contract, licensing, usage, people and the chapter catalog. */
export async function GET(request: Request, context: Context) {
  const admin = await requirePlatformAdmin(request);
  if (admin instanceof Response) return admin;
  const school = await findSchool((await context.params).id);
  if (!school) return schoolNotFound();

  const db = getDb();
  const [licensing, usage, staff, pendingInvites] = await Promise.all([
    schoolContent(school.id),
    usageBySchool(),
    db.select({ id: teachers.id, name: teachers.name, email: teachers.email, role: teachers.role, status: teachers.status, createdAt: teachers.createdAt })
      .from(teachers).where(eq(teachers.schoolId, school.id)).orderBy(asc(teachers.name)),
    db.select({ id: invites.id, email: invites.email, role: invites.role, expiresAt: invites.expiresAt })
      .from(invites)
      .where(and(eq(invites.schoolId, school.id), isNull(invites.acceptedAt), gt(invites.expiresAt, Date.now())))
      .orderBy(desc(invites.id)),
  ]);
  return Response.json({
    school,
    licensing: { grades: licensing.grades, subjects: licensing.subjects, hiddenModules: licensing.hiddenModules, features: licensing.features },
    usage: usage.get(school.id) ?? emptyUsage,
    teachers: staff,
    invites: pendingInvites,
    catalog: playableModules.map(({ id, title, grades, strand }) => ({ id, title, grades, strand })),
    availableGrades: schoolGrades,
    availableSubjects: schoolSubjects,
  });
}

/**
 * Update any mix of contract fields, limits, status and licensing in one
 * transaction. Licensing fields not sent keep their values. A suspension takes
 * effect on each user's next request (see the session resolvers).
 */
export async function PATCH(request: Request, context: Context) {
  const admin = await requirePlatformAdmin(request);
  if (admin instanceof Response) return admin;
  const school = await findSchool((await context.params).id);
  if (!school) return schoolNotFound();
  const parsed = await parseJson(request, updateSchoolSchema);
  if (parsed.error) return parsed.error;
  const { grades, subjects, hiddenModules, features, ...fields } = parsed.data;

  const db = getDb();
  const before = await schoolContent(school.id);
  const writes: BatchItem<"sqlite">[] = [];
  if (Object.values(fields).some(value => value !== undefined)) {
    writes.push(db.update(schools).set(fields).where(eq(schools.id, school.id)));
  }
  if (grades || subjects || hiddenModules || features) {
    const next = {
      schoolId: school.id,
      grades: JSON.stringify(grades ? [...new Set(grades)].sort((a, b) => a - b) : before.grades),
      subjects: JSON.stringify(subjects ? [...new Set(subjects)] : before.subjects),
      hiddenModules: JSON.stringify(hiddenModules ?? before.hiddenModules),
      features: JSON.stringify(features ?? before.features),
    };
    writes.push(db.insert(schoolSettings).values(next).onConflictDoUpdate({ target: schoolSettings.schoolId, set: next }));
  }
  const [first, ...rest] = writes;
  if (!first) return Response.json({ error: "Nothing to change." }, { status: 400 });
  await db.batch([first, ...rest]);

  const statusChanged = fields.status !== undefined && fields.status !== school.status;
  const action = !statusChanged ? "platform.school.update" : fields.status === "suspended" ? "platform.school.suspend" : "platform.school.reactivate";
  await writeAudit({
    actorPlatformAdminId: admin.id,
    action,
    targetType: "school",
    targetId: school.id,
    metadata: { before: { ...school, licensing: before }, changes: parsed.data },
    request,
  });
  return Response.json({ ok: true });
}
```

- [ ] **Step 6: Invite, teacher status and sign-everyone-out** — create `app/api/platform/schools/[id]/invite/route.ts`:

```ts
import { writeAudit } from "../../../../../lib/audit";
import { createInvite } from "../../../../../lib/invites";
import { requirePlatformAdmin } from "../../../../../lib/platform-session";
import { findSchool, schoolNotFound } from "../../../../../lib/platform-schools";
import { inviteSchema, parseJson } from "../../../../../lib/validation";

/** Issue a school_admin invite for a school; the accept link is returned once. */
export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const admin = await requirePlatformAdmin(request);
  if (admin instanceof Response) return admin;
  const school = await findSchool((await context.params).id);
  if (!school) return schoolNotFound();
  const parsed = await parseJson(request, inviteSchema);
  if (parsed.error) return parsed.error;

  const result = await createInvite({ schoolId: school.id, email: parsed.data.email, role: "school_admin", invitedByTeacherId: null });
  if (result.error || !result.invite) {
    return Response.json({ error: result.error }, { status: result.status ?? 400 });
  }
  await writeAudit({
    actorPlatformAdminId: admin.id,
    action: "platform.school.invite",
    targetType: "school",
    targetId: school.id,
    metadata: { inviteId: result.invite.id, email: result.invite.email },
    request,
  });
  return Response.json({
    invite: {
      id: result.invite.id,
      email: result.invite.email,
      expiresAt: result.invite.expiresAt,
      // One-time link — surface it now; it is not recoverable later.
      acceptUrl: `${new URL(request.url).origin}/accept-invite?token=${result.invite.token}`,
    },
  }, { status: 201 });
}
```

create `app/api/platform/schools/[id]/teachers/[teacherId]/route.ts`:

```ts
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "../../../../../../../db";
import { sessions, teachers } from "../../../../../../../db/schema";
import { writeAudit } from "../../../../../../lib/audit";
import { requirePlatformAdmin } from "../../../../../../lib/platform-session";
import { findSchool, schoolNotFound } from "../../../../../../lib/platform-schools";
import { parseJson } from "../../../../../../lib/validation";

type Context = { params: Promise<{ id: string; teacherId: string }> };

/** Suspend (and sign out) or reactivate one teacher of a school. */
export async function PATCH(request: Request, context: Context) {
  const admin = await requirePlatformAdmin(request);
  if (admin instanceof Response) return admin;
  const params = await context.params;
  const school = await findSchool(params.id);
  if (!school) return schoolNotFound();
  const parsed = await parseJson(request, z.object({ status: z.enum(["active", "suspended"]) }));
  if (parsed.error) return parsed.error;

  const db = getDb();
  const teacherId = Number(params.teacherId);
  const [teacher] = Number.isSafeInteger(teacherId)
    ? await db.select().from(teachers).where(and(eq(teachers.id, teacherId), eq(teachers.schoolId, school.id))).limit(1)
    : [];
  if (!teacher) return Response.json({ error: "Teacher not found in this school." }, { status: 404 });

  const { status } = parsed.data;
  if (status === "suspended") {
    await db.batch([
      db.update(teachers).set({ status }).where(eq(teachers.id, teacher.id)),
      db.delete(sessions).where(eq(sessions.teacherId, teacher.id)),
    ]);
  } else {
    await db.update(teachers).set({ status }).where(eq(teachers.id, teacher.id));
  }
  await writeAudit({
    actorPlatformAdminId: admin.id,
    action: status === "suspended" ? "platform.teacher.suspend" : "platform.teacher.reactivate",
    targetType: "school",
    targetId: school.id,
    metadata: { teacherId: teacher.id, email: teacher.email, before: teacher.status },
    request,
  });
  return Response.json({ ok: true });
}
```

create `app/api/platform/schools/[id]/logout-all/route.ts`:

```ts
import { eq, inArray } from "drizzle-orm";
import { getDb } from "../../../../../../db";
import { sessions, studentSessions, students, teachers } from "../../../../../../db/schema";
import { writeAudit } from "../../../../../lib/audit";
import { requirePlatformAdmin } from "../../../../../lib/platform-session";
import { findSchool, schoolNotFound } from "../../../../../lib/platform-schools";

/** Delete every teacher and student session in a school (for example after a leaked password). */
export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const admin = await requirePlatformAdmin(request);
  if (admin instanceof Response) return admin;
  const school = await findSchool((await context.params).id);
  if (!school) return schoolNotFound();

  const db = getDb();
  await db.batch([
    db.delete(sessions).where(inArray(sessions.teacherId, db.select({ id: teachers.id }).from(teachers).where(eq(teachers.schoolId, school.id)))),
    db.delete(studentSessions).where(inArray(studentSessions.studentId, db.select({ id: students.id }).from(students).where(eq(students.schoolId, school.id)))),
  ]);
  await writeAudit({ actorPlatformAdminId: admin.id, action: "platform.school.logout_all", targetType: "school", targetId: school.id, request });
  return Response.json({ ok: true });
}
```

- [ ] **Step 7: Leads** — create `app/api/platform/leads/route.ts`:

```ts
import { desc, eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { schoolRequests } from "../../../../db/schema";
import { requirePlatformAdmin } from "../../../lib/platform-session";
import { leadStatuses } from "../../../lib/platform-schools";

/** The /register-school submissions, newest first, optionally filtered by status. */
export async function GET(request: Request) {
  const admin = await requirePlatformAdmin(request);
  if (admin instanceof Response) return admin;
  const wanted = new URL(request.url).searchParams.get("status");
  const status = leadStatuses.find(value => value === wanted);
  const leads = await getDb()
    .select()
    .from(schoolRequests)
    .where(status ? eq(schoolRequests.status, status) : undefined)
    .orderBy(desc(schoolRequests.id))
    .limit(500); // ponytail: no pagination; add a cursor like /audit if leads pass a few hundred.
  return Response.json({ leads });
}
```

create `app/api/platform/leads/[id]/route.ts`:

```ts
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "../../../../../db";
import { schoolRequests } from "../../../../../db/schema";
import { writeAudit } from "../../../../lib/audit";
import { requirePlatformAdmin } from "../../../../lib/platform-session";
import { leadStatuses } from "../../../../lib/platform-schools";
import { parseJson } from "../../../../lib/validation";

const leadUpdate = z
  .object({ status: z.enum(leadStatuses).optional(), notes: z.string().max(4000).nullable().optional() })
  .refine(value => value.status !== undefined || value.notes !== undefined, "Nothing to change.");

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const admin = await requirePlatformAdmin(request);
  if (admin instanceof Response) return admin;
  const id = Number((await context.params).id);
  const db = getDb();
  const [lead] = Number.isSafeInteger(id) ? await db.select().from(schoolRequests).where(eq(schoolRequests.id, id)).limit(1) : [];
  if (!lead) return Response.json({ error: "Lead not found." }, { status: 404 });
  const parsed = await parseJson(request, leadUpdate);
  if (parsed.error) return parsed.error;

  await db.update(schoolRequests).set(parsed.data).where(eq(schoolRequests.id, lead.id));
  await writeAudit({
    actorPlatformAdminId: admin.id,
    action: "platform.lead.update",
    targetType: "lead",
    targetId: lead.id,
    metadata: { before: { status: lead.status, notes: lead.notes }, changes: parsed.data },
    request,
  });
  return Response.json({ ok: true });
}
```

- [ ] **Step 8: Run the tests**

Run: `N22 node --test tests/platform-admin.test.mjs` (outside the sandbox)
Expected: PASS, 12 subtests.

- [ ] **Step 9: Typecheck and lint**

Run: `N22 npm run typecheck && N22 npm run lint`
Expected: no errors.

- [ ] **Step 10: Commit**

```bash
git add app/lib/platform-schools.ts app/api/platform tests/platform-admin.test.mjs
git commit -m "Add platform APIs for schools, school users and leads

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Team and audit API

**Files:**
- Create: `app/api/platform/admins/route.ts`, `app/api/platform/admins/[id]/route.ts`, `app/api/platform/audit/route.ts`
- Test: `tests/platform-admin.test.mjs`

**Interfaces:**
- Consumes: `issueSetupLink` (Task 3), `requirePlatformAdmin`, `writeAudit`.
- Produces:
  - `GET /api/platform/admins` → `{ admins: { id, name, email, status, mfaEnrolled, lastLoginAt, createdAt }[] }`; `POST { name, email }` → 201 `{ admin, setupUrl }`.
  - `PATCH /api/platform/admins/[id] { action: "suspend" | "reactivate" | "reset" }` → `{ ok: true, setupUrl? }`.
  - `GET /api/platform/audit?schoolId=&action=&before=` → `{ entries: AuditEntry[], nextBefore: number | null }` where `AuditEntry = { id, action, targetType, targetId, metadata, ip, userAgent, createdAt, teacherName, teacherEmail, platformAdminName }`.

- [ ] **Step 1: Write the failing tests** — in `tests/platform-admin.test.mjs`, add to `routes`:

```js
  ['/api/platform/admins', 'platform/admins'], ['/api/platform/audit', 'platform/audit'],
```

to `dynamic`:

```js
  ['^/api/platform/admins/(\\d+)$', 'platform/admins/[id]', ['id']],
```

to `PROTECTED`:

```js
  ['GET', '/api/platform/admins'], ['POST', '/api/platform/admins'], ['PATCH', '/api/platform/admins/1'], ['GET', '/api/platform/audit'],
```

and above the subtest marker:

```js
    await t.test('team: teammates join by setup link and nobody can suspend themselves', async () => {
      const created = await json('/api/platform/admins', platform, 'POST', { name: 'Sales Lead', email: 'sales@cs.test' }, 201);
      assert.match(created.setupUrl, /\/admins\/setup\?token=/);
      assert.equal((await request('/api/platform/admins', platform, 'POST', { name: 'Again', email: 'sales@cs.test' })).status, 409);
      const { admins } = await json('/api/platform/admins', platform);
      const me = admins.find(row => row.email === 'founder@cs.test');
      assert.equal(me.mfaEnrolled, true);
      assert.ok(!('totpSecret' in me) && !('passwordHash' in me));
      assert.equal((await request(`/api/platform/admins/${me.id}`, platform, 'PATCH', { action: 'suspend' })).status, 400);
      const reset = await json(`/api/platform/admins/${created.admin.id}`, platform, 'PATCH', { action: 'reset' });
      const token = new URL(reset.setupUrl).searchParams.get('token');
      assert.equal((await request(`/api/platform/auth/setup?token=${token}`)).status, 200);
      await json(`/api/platform/admins/${created.admin.id}`, platform, 'PATCH', { action: 'suspend' });
      assert.equal((await request(`/api/platform/auth/setup?token=${token}`)).status, 400);
    });

    await t.test('the audit log records platform and school actions with actor and origin', async () => {
      const { entries } = await json(`/api/platform/audit?schoolId=${greenId}`, platform);
      const actions = new Set(entries.map(entry => entry.action));
      for (const action of ['platform.school.create', 'platform.school.invite', 'platform.school.update', 'platform.school.suspend',
        'platform.school.reactivate', 'platform.teacher.suspend', 'platform.teacher.reactivate', 'platform.school.logout_all', 'class.create']) {
        assert.ok(actions.has(action), action);
      }
      const logins = (await json('/api/platform/audit?action=platform.login', platform)).entries;
      assert.ok(logins.some(entry => entry.action === 'platform.login.failure'));
      assert.ok(logins.some(entry => entry.action === 'platform.login.success' && entry.platformAdminName === 'Founder'));
      assert.ok((await json('/api/platform/audit?action=platform.mfa', platform)).entries.length >= 1);
      const page = await json('/api/platform/audit', platform);
      assert.ok(page.entries.length > 0);
      assert.ok(page.entries.every((entry, i) => i === 0 || entry.id < page.entries[i - 1].id));
    });
```

- [ ] **Step 2: Run it to verify it fails**

Run: `N22 node --test tests/platform-admin.test.mjs` (outside the sandbox)
Expected: FAIL — esbuild cannot resolve `./app/api/platform/admins/route.ts`.

- [ ] **Step 3: Team routes** — create `app/api/platform/admins/route.ts`:

```ts
import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "../../../../db";
import { platformAdmins } from "../../../../db/schema";
import { writeAudit } from "../../../lib/audit";
import { issueSetupLink } from "../../../lib/platform-admins";
import { requirePlatformAdmin } from "../../../lib/platform-session";
import { parseJson } from "../../../lib/validation";

/** The CyberSuraksha team. Secrets and hashes never leave the server. */
export async function GET(request: Request) {
  const admin = await requirePlatformAdmin(request);
  if (admin instanceof Response) return admin;
  const rows = await getDb()
    .select({
      id: platformAdmins.id,
      name: platformAdmins.name,
      email: platformAdmins.email,
      status: platformAdmins.status,
      totpSecret: platformAdmins.totpSecret,
      lastLoginAt: platformAdmins.lastLoginAt,
      createdAt: platformAdmins.createdAt,
    })
    .from(platformAdmins)
    .orderBy(asc(platformAdmins.name));
  return Response.json({ admins: rows.map(({ totpSecret, ...row }) => ({ ...row, mfaEnrolled: totpSecret != null })) });
}

/** Add a teammate as pending; they finish on the one-time setup link returned here. */
export async function POST(request: Request) {
  const admin = await requirePlatformAdmin(request);
  if (admin instanceof Response) return admin;
  const parsed = await parseJson(request, z.object({
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().toLowerCase().email(),
  }));
  if (parsed.error) return parsed.error;

  const db = getDb();
  const [existing] = await db.select({ id: platformAdmins.id }).from(platformAdmins).where(eq(platformAdmins.email, parsed.data.email)).limit(1);
  if (existing) return Response.json({ error: "That email already has a platform account." }, { status: 409 });
  const [created] = await db.insert(platformAdmins).values(parsed.data).returning({ id: platformAdmins.id });
  const setupUrl = await issueSetupLink(new URL(request.url).origin, created.id);
  await writeAudit({ actorPlatformAdminId: admin.id, action: "platform.admin.create", targetType: "platform_admin", targetId: created.id, metadata: parsed.data, request });
  return Response.json({ admin: { id: created.id, ...parsed.data, status: "pending" }, setupUrl }, { status: 201 });
}
```

create `app/api/platform/admins/[id]/route.ts`:

```ts
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "../../../../../db";
import { platformAdmins, platformSessions } from "../../../../../db/schema";
import { writeAudit } from "../../../../lib/audit";
import { issueSetupLink } from "../../../../lib/platform-admins";
import { requirePlatformAdmin } from "../../../../lib/platform-session";
import { parseJson } from "../../../../lib/validation";

/**
 * Suspend (signing them out), reactivate, or reset a teammate. A reset issues
 * a new setup link; their current password and authenticator keep working
 * until they use it, and using it signs out their old sessions.
 */
export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const admin = await requirePlatformAdmin(request);
  if (admin instanceof Response) return admin;
  const id = Number((await context.params).id);
  const db = getDb();
  const [target] = Number.isSafeInteger(id) ? await db.select().from(platformAdmins).where(eq(platformAdmins.id, id)).limit(1) : [];
  if (!target) return Response.json({ error: "Admin not found." }, { status: 404 });
  const parsed = await parseJson(request, z.object({ action: z.enum(["suspend", "reactivate", "reset"]) }));
  if (parsed.error) return parsed.error;
  const { action } = parsed.data;

  let setupUrl: string | undefined;
  if (action === "suspend") {
    if (target.id === admin.id) return Response.json({ error: "You cannot suspend yourself." }, { status: 400 });
    await db.batch([
      db.update(platformAdmins).set({ status: "suspended" }).where(eq(platformAdmins.id, target.id)),
      db.delete(platformSessions).where(eq(platformSessions.adminId, target.id)),
    ]);
  } else if (action === "reactivate") {
    await db.update(platformAdmins).set({ status: target.totpSecret ? "active" : "pending" }).where(eq(platformAdmins.id, target.id));
  } else {
    if (target.status === "suspended") return Response.json({ error: "Reactivate this admin before resetting their login." }, { status: 400 });
    setupUrl = await issueSetupLink(new URL(request.url).origin, target.id);
  }
  await writeAudit({ actorPlatformAdminId: admin.id, action: `platform.admin.${action}`, targetType: "platform_admin", targetId: target.id, metadata: { email: target.email }, request });
  return Response.json({ ok: true, setupUrl });
}
```

- [ ] **Step 4: Audit route** — create `app/api/platform/audit/route.ts`:

```ts
import { and, desc, eq, inArray, like, lt, or, type SQL } from "drizzle-orm";
import { getDb } from "../../../../db";
import { auditLog, platformAdmins, teachers } from "../../../../db/schema";
import { requirePlatformAdmin } from "../../../lib/platform-session";

const PAGE = 50;

/**
 * The audit trail, newest first, 50 per page (`before` = the last id seen).
 * `schoolId` returns the platform's actions on that school plus everything its
 * own staff did; `action` is a prefix such as `platform.login`.
 */
export async function GET(request: Request) {
  const admin = await requirePlatformAdmin(request);
  if (admin instanceof Response) return admin;
  const params = new URL(request.url).searchParams;
  const schoolId = Number(params.get("schoolId"));
  const before = Number(params.get("before"));
  const action = params.get("action")?.trim().replace(/[%_]/g, "");

  const db = getDb();
  const conditions: SQL[] = [];
  if (Number.isSafeInteger(schoolId) && schoolId > 0) {
    conditions.push(or(
      and(eq(auditLog.targetType, "school"), eq(auditLog.targetId, String(schoolId))),
      inArray(auditLog.actorTeacherId, db.select({ id: teachers.id }).from(teachers).where(eq(teachers.schoolId, schoolId))),
    )!);
  }
  if (action) conditions.push(like(auditLog.action, `${action}%`));
  if (Number.isSafeInteger(before) && before > 0) conditions.push(lt(auditLog.id, before));

  const entries = await db
    .select({
      id: auditLog.id,
      action: auditLog.action,
      targetType: auditLog.targetType,
      targetId: auditLog.targetId,
      metadata: auditLog.metadata,
      ip: auditLog.ip,
      userAgent: auditLog.userAgent,
      createdAt: auditLog.createdAt,
      teacherName: teachers.name,
      teacherEmail: teachers.email,
      platformAdminName: platformAdmins.name,
    })
    .from(auditLog)
    .leftJoin(teachers, eq(teachers.id, auditLog.actorTeacherId))
    .leftJoin(platformAdmins, eq(platformAdmins.id, auditLog.actorPlatformAdminId))
    .where(and(...conditions))
    .orderBy(desc(auditLog.id))
    .limit(PAGE);
  return Response.json({ entries, nextBefore: entries.length === PAGE ? entries[entries.length - 1].id : null });
}
```

- [ ] **Step 5: Run the tests**

Run: `N22 node --test tests/platform-admin.test.mjs` (outside the sandbox)
Expected: PASS, 14 subtests.

- [ ] **Step 6: Typecheck and lint**

Run: `N22 npm run typecheck && N22 npm run lint`
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add app/api/platform tests/platform-admin.test.mjs
git commit -m "Add platform team management and the audit log API

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Panel shell, sign-in and setup pages

**Files:**
- Create: `app/admins/admins-api.ts`, `app/admins/admins.module.css`, `app/admins/AdminsHeader.tsx`, `app/admins/OneTimeLink.tsx`, `app/admins/AuditTable.tsx`, `app/admins/ContractFields.tsx`
- Create: `app/admins/login/page.tsx`, `app/admins/setup/page.tsx`

**Interfaces:**
- Consumes: Task 3 auth API; Task 7 `AuditEntry` shape.
- Produces: `platformFetch<T>(url, method = "GET", body?): Promise<{ ok: boolean; payload: T }>` (401 outside `/api/platform/auth/` sends the browser to `/admins/login`); `blank(value)`, `numberOrNull(value)`, `daysUntil(date, now)`; components `AdminsHeader({ active: "schools" | "leads" | "team" | "audit" })`, `OneTimeLink({ url })`, `AuditTable({ entries })` + `type AuditEntry`, `ContractFields({ defaults })`, `readContractFields(form)`, `ContractBadge({ endsAt, days })`.

UI tasks have no unit tests; they are verified by typecheck, lint, `npm run build` and the browser pass in Task 11.

- [ ] **Step 1: Client helpers** — create `app/admins/admins-api.ts`:

```ts
import { readJson } from "../lib/read-json";

/**
 * Fetch for the /admins pages: JSON in and out, network failures surfaced as
 * `error`, and a 401 (signed out, 2FA pending or session expired) sends the
 * browser back to the login page.
 */
export async function platformFetch<T extends { error?: string }>(
  url: string,
  method = "GET",
  body?: unknown,
): Promise<{ ok: boolean; payload: T }> {
  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers: body === undefined ? undefined : { "content-type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    return { ok: false, payload: { error: "Could not reach the server. Check your connection." } as T };
  }
  if (response.status === 401 && !url.startsWith("/api/platform/auth/")) window.location.assign("/admins/login");
  return { ok: response.ok, payload: await readJson<T>(response) };
}

/** A trimmed form value, or null when blank — the API stores blanks as null. */
export function blank(value: FormDataEntryValue | null): string | null {
  const text = String(value ?? "").trim();
  return text || null;
}

export function numberOrNull(value: FormDataEntryValue | null): number | null {
  const text = String(value ?? "").trim();
  return text ? Number(text) : null;
}

/** Whole days from `now` until an ISO date (negative once past), or null without a date. */
export function daysUntil(date: string | null, now: number): number | null {
  return date ? Math.ceil((Date.parse(date) - now) / 86_400_000) : null;
}
```

- [ ] **Step 2: Styles** — create `app/admins/admins.module.css`:

```css
.badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  background: #e7f6ec;
  color: #135c2e;
}

.warning {
  background: #fff4d6;
  color: #7a5200;
}

.danger {
  background: #fde8e8;
  color: #9b1c1c;
}

.row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.chapters {
  display: grid;
  gap: 6px;
  max-height: 420px;
  overflow: auto;
  padding: 8px 0;
}

.secret {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 1.1rem;
  letter-spacing: 0.06em;
  word-break: break-all;
}

.metadata {
  max-width: 480px;
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 0.8rem;
}
```

- [ ] **Step 3: Header** — create `app/admins/AdminsHeader.tsx`:

```tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandLogo } from "../components/BrandLogo";
import { platformFetch } from "./admins-api";

const links = [
  ["schools", "/admins", "Schools"],
  ["leads", "/admins/leads", "Leads"],
  ["team", "/admins/team", "Team"],
  ["audit", "/admins/audit", "Audit log"],
] as const;

export function AdminsHeader({ active }: { active: (typeof links)[number][0] }) {
  const router = useRouter();
  async function logout() {
    await platformFetch("/api/platform/auth/logout", "POST", {});
    router.replace("/admins/login");
  }
  return (
    <header className="teacherHeader">
      <Link className="teacherWordmark" href="/admins">
        <BrandLogo />
        <small>· Company admin</small>
      </Link>
      <nav aria-label="Company admin navigation">
        {links.map(([key, href, label]) => (
          <Link className={active === key ? "active" : ""} href={href} key={key}>{label}</Link>
        ))}
        <button className="teacherSecondary" onClick={() => void logout()} type="button">Log out</button>
      </nav>
    </header>
  );
}
```

- [ ] **Step 4: Shared pieces** — create `app/admins/OneTimeLink.tsx`:

```tsx
"use client";

import { Copy, ShieldCheck } from "lucide-react";

/** A link that the server returns once (invite or setup link), with a copy button. */
export function OneTimeLink({ url }: { url: string }) {
  return (
    <div className="inviteLink" aria-live="polite">
      <p><ShieldCheck aria-hidden="true" /> This link is shown once and cannot be recovered later.</p>
      <code>{url}</code>
      <button className="teacherSecondary" onClick={() => void navigator.clipboard?.writeText(url)} type="button">
        <Copy aria-hidden="true" /> Copy link
      </button>
    </div>
  );
}
```

create `app/admins/AuditTable.tsx`:

```tsx
import styles from "./admins.module.css";

export type AuditEntry = {
  id: number;
  action: string;
  targetType: string;
  targetId: string | null;
  metadata: string | null;
  ip: string | null;
  userAgent: string | null;
  createdAt: string;
  teacherName: string | null;
  teacherEmail: string | null;
  platformAdminName: string | null;
};

function details(metadata: string | null): string {
  if (!metadata) return "—";
  try { return JSON.stringify(JSON.parse(metadata), null, 2); } catch { return metadata; }
}

export function AuditTable({ entries }: { entries: AuditEntry[] }) {
  if (!entries.length) return <p className="teacherEmpty">No activity yet.</p>;
  return (
    <div className="tableScroller">
      <table className="teacherTable">
        <thead>
          <tr><th>When (UTC)</th><th>Who</th><th>Action</th><th>Target</th><th>IP</th></tr>
        </thead>
        <tbody>
          {entries.map(entry => (
            <tr key={entry.id}>
              <td>{entry.createdAt}</td>
              <td>{entry.platformAdminName ? `${entry.platformAdminName} (CyberSuraksha)` : entry.teacherName ? `${entry.teacherName} <${entry.teacherEmail}>` : "—"}</td>
              <td>
                <details>
                  <summary>{entry.action}</summary>
                  <pre className={styles.metadata}>{details(entry.metadata)}</pre>
                </details>
              </td>
              <td>{entry.targetType}{entry.targetId ? ` #${entry.targetId}` : ""}</td>
              <td title={entry.userAgent ?? undefined}>{entry.ip ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

create `app/admins/ContractFields.tsx`:

```tsx
import { blank, numberOrNull } from "./admins-api";
import styles from "./admins.module.css";

type ContractKey = "plan" | "seatLimit" | "teacherLimit" | "classLimit" | "contractEndsAt" | "contactName" | "contactEmail" | "notes";
type Defaults = Partial<Record<ContractKey, string | number | null>>;

/** Contract and limit inputs shared by the new-school form and a school's page. A blank limit means unlimited. */
export function ContractFields({ defaults = {} }: { defaults?: Defaults }) {
  const value = (key: ContractKey) => defaults[key] ?? undefined;
  return (
    <>
      <label htmlFor="contract-plan">Plan</label>
      <input defaultValue={value("plan")} id="contract-plan" maxLength={80} name="plan" placeholder="e.g. Annual 2026-27" />
      <label htmlFor="contract-seats">Student seats</label>
      <input defaultValue={value("seatLimit")} id="contract-seats" min={0} name="seatLimit" placeholder="Unlimited" type="number" />
      <label htmlFor="contract-teachers">Teacher accounts</label>
      <input defaultValue={value("teacherLimit")} id="contract-teachers" min={0} name="teacherLimit" placeholder="Unlimited" type="number" />
      <label htmlFor="contract-classes">Classes</label>
      <input defaultValue={value("classLimit")} id="contract-classes" min={0} name="classLimit" placeholder="Unlimited" type="number" />
      <label htmlFor="contract-ends">Contract ends</label>
      <input defaultValue={value("contractEndsAt")} id="contract-ends" name="contractEndsAt" type="date" />
      <label htmlFor="contract-contact">Contact name</label>
      <input defaultValue={value("contactName")} id="contract-contact" maxLength={120} name="contactName" />
      <label htmlFor="contract-email">Contact email</label>
      <input defaultValue={value("contactEmail")} id="contract-email" name="contactEmail" type="email" />
      <label htmlFor="contract-notes">Notes</label>
      <textarea defaultValue={value("notes") ?? undefined} id="contract-notes" maxLength={4000} name="notes" />
    </>
  );
}

/** Read the fields above from a submitted form, blanks as null. */
export function readContractFields(form: FormData) {
  return {
    plan: blank(form.get("plan")),
    seatLimit: numberOrNull(form.get("seatLimit")),
    teacherLimit: numberOrNull(form.get("teacherLimit")),
    classLimit: numberOrNull(form.get("classLimit")),
    contractEndsAt: blank(form.get("contractEndsAt")),
    contactName: blank(form.get("contactName")),
    contactEmail: blank(form.get("contactEmail")),
    notes: blank(form.get("notes")),
  };
}

/** Contract end flag: amber within 30 days, red once past. `days` is computed when the data loads. */
export function ContractBadge({ endsAt, days }: { endsAt: string | null; days: number | null }) {
  if (!endsAt || days == null) return <>—</>;
  if (days < 0) return <span className={`${styles.badge} ${styles.danger}`}>Ended {endsAt}</span>;
  if (days <= 30) return <span className={`${styles.badge} ${styles.warning}`}>Ends in {days} days</span>;
  return <>{endsAt}</>;
}
```

- [ ] **Step 5: Sign-in page** — create `app/admins/login/page.tsx`:

```tsx
"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { platformFetch } from "../admins-api";

/** Two-step sign-in: password, then the 6-digit code from the admin's authenticator app. */
export default function AdminLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"password" | "code">("password");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    const { ok, payload } = step === "password"
      ? await platformFetch<{ error?: string }>("/api/platform/auth/login", "POST", { email: form.get("email"), password: form.get("password") })
      : await platformFetch<{ error?: string }>("/api/platform/auth/totp", "POST", { code: form.get("code") });
    setBusy(false);
    if (!ok) {
      setError(payload.error ?? "Sign-in failed. Try again.");
      return;
    }
    if (step === "password") setStep("code");
    else router.replace("/admins");
  }

  return (
    <main className="teacherPage">
      <div className="teacherShell">
        <section aria-labelledby="admins-login-title" className="teacherPanel">
          <h1 id="admins-login-title">CyberSuraksha company admin</h1>
          <form method="post" onSubmit={submit}>
            {step === "password" ? (
              <>
                <label htmlFor="admins-email">Email</label>
                <input autoComplete="username" id="admins-email" name="email" required type="email" />
                <label htmlFor="admins-password">Password</label>
                <input autoComplete="current-password" id="admins-password" name="password" required type="password" />
              </>
            ) : (
              <>
                <label htmlFor="admins-code">6-digit code from your authenticator app</label>
                <input autoComplete="one-time-code" autoFocus id="admins-code" inputMode="numeric" maxLength={6} name="code" pattern="\d{6}" required />
              </>
            )}
            {error ? <p className="teacherStatus" role="alert">{error}</p> : null}
            <button className="teacherPrimary" disabled={busy} type="submit">
              {busy ? "Checking…" : step === "password" ? "Continue" : "Sign in"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
```

- [ ] **Step 6: Setup page** — create `app/admins/setup/page.tsx`:

```tsx
"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { platformFetch } from "../admins-api";
import styles from "../admins.module.css";

type Setup = { name: string; email: string; secret: string; otpauthUri: string; error?: string };

const tokenFromUrl = () => new URLSearchParams(window.location.search).get("token") ?? "";

/** One-time setup link: choose a password and enrol an authenticator app. */
export default function AdminSetupPage() {
  const router = useRouter();
  const [setup, setSetup] = useState<Setup | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void platformFetch<Setup>(`/api/platform/auth/setup?token=${encodeURIComponent(tokenFromUrl())}`).then(({ ok, payload }) => {
      if (ok) setSetup(payload);
      else setError(payload.error ?? "This setup link does not work.");
    });
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!setup) return;
    const form = new FormData(event.currentTarget);
    if (form.get("password") !== form.get("confirm")) {
      setError("The two passwords do not match.");
      return;
    }
    setBusy(true);
    setError("");
    const { ok, payload } = await platformFetch<{ error?: string }>("/api/platform/auth/setup", "POST", {
      token: tokenFromUrl(),
      name: form.get("name"),
      password: form.get("password"),
      secret: setup.secret,
      code: form.get("code"),
    });
    setBusy(false);
    if (!ok) {
      setError(payload.error ?? "Setup failed. Try again.");
      return;
    }
    router.replace("/admins/login");
  }

  return (
    <main className="teacherPage">
      <div className="teacherShell">
        <section aria-labelledby="admins-setup-title" className="teacherPanel">
          <h1 id="admins-setup-title">Set up your company admin account</h1>
          {!setup ? (
            <p className="teacherStatus" role="status">{error || "Checking your setup link…"}</p>
          ) : (
            <form method="post" onSubmit={submit}>
              <p>Signing in as <strong>{setup.email}</strong>.</p>
              <label htmlFor="setup-name">Your name</label>
              <input defaultValue={setup.name} id="setup-name" maxLength={120} minLength={2} name="name" required />
              <label htmlFor="setup-password">Password (at least 12 characters)</label>
              <input autoComplete="new-password" id="setup-password" minLength={12} name="password" required type="password" />
              <label htmlFor="setup-confirm">Confirm password</label>
              <input autoComplete="new-password" id="setup-confirm" minLength={12} name="confirm" required type="password" />
              <p>
                Add this key to Google Authenticator, Authy or 1Password (choose “enter a setup key”, time-based).
                On the phone that has the app you can <a href={setup.otpauthUri}>open it directly</a>.
              </p>
              <p className={styles.secret}>{setup.secret.match(/.{1,4}/g)?.join(" ")}</p>
              <label htmlFor="setup-code">6-digit code the app now shows</label>
              <input autoComplete="one-time-code" id="setup-code" inputMode="numeric" maxLength={6} name="code" pattern="\d{6}" required />
              {error ? <p className="teacherStatus" role="alert">{error}</p> : null}
              <button className="teacherPrimary" disabled={busy} type="submit">{busy ? "Saving…" : "Finish setup"}</button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
```

- [ ] **Step 7: Typecheck and lint**

Run: `N22 npm run typecheck && N22 npm run lint`
Expected: no errors.

- [ ] **Step 8: Commit**

```bash
git add app/admins
git commit -m "Add the company admin panel shell, sign-in and setup pages

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9: Schools pages

**Files:**
- Create: `app/admins/page.tsx`, `app/admins/schools/[id]/page.tsx`

**Interfaces:**
- Consumes: Task 6 school API, Task 7 audit API, Task 8 components and helpers.

- [ ] **Step 1: Schools list and new-school form** — create `app/admins/page.tsx`:

```tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { schoolGrades, schoolSubjects } from "../lib/content-policy";
import { AdminsHeader } from "./AdminsHeader";
import { ContractBadge, ContractFields, readContractFields } from "./ContractFields";
import { daysUntil, platformFetch } from "./admins-api";
import styles from "./admins.module.css";

type School = {
  id: number;
  name: string;
  slug: string;
  status: "active" | "suspended";
  plan: string | null;
  seatLimit: number | null;
  teacherLimit: number | null;
  contractEndsAt: string | null;
  usage: { teachers: number; students: number; classes: number; active30d: number };
};
type Row = School & { contractDays: number | null };

const slugify = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
const ofLimit = (used: number, limit: number | null) => (limit == null ? String(used) : `${used} / ${limit}`);

/** Every school on the platform with usage and contract flags, plus onboarding. */
export default function SchoolsPage() {
  const router = useRouter();
  const [schools, setSchools] = useState<Row[] | null>(null);
  const [status, setStatus] = useState("");
  const [prefill, setPrefill] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    const { ok, payload } = await platformFetch<{ schools?: School[]; error?: string }>("/api/platform/schools");
    if (!ok || !payload.schools) {
      setStatus(payload.error ?? "Could not load schools.");
      return;
    }
    const now = Date.now();
    setSchools(payload.schools.map(school => ({ ...school, contractDays: daysUntil(school.contractEndsAt, now) })));
  }, []);

  useEffect(() => {
    // The callback owns its own state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
    // "Convert" on the leads page links here with the lead's details.
    const params = new URLSearchParams(window.location.search);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (params.get("leadId")) setPrefill(Object.fromEntries(params));
  }, [load]);

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setStatus("");
    const { ok, payload } = await platformFetch<{ school?: { id: number }; error?: string }>("/api/platform/schools", "POST", {
      name: String(form.get("name") ?? "").trim(),
      slug: String(form.get("slug") ?? "").trim(),
      ...readContractFields(form),
      grades: form.getAll("grades").map(Number),
      subjects: form.getAll("subjects").map(String),
      ...(prefill.leadId ? { leadId: Number(prefill.leadId) } : {}),
    });
    if (!ok || !payload.school) {
      setStatus(payload.error ?? "Could not create the school.");
      return;
    }
    router.push(`/admins/schools/${payload.school.id}`);
  }

  return (
    <main className="teacherPage">
      <AdminsHeader active="schools" />
      <div className="teacherShell">
        <section className="teacherIntro">
          <h1>Schools</h1>
          <p>Every school on CyberSuraksha. Open a school to change its plan, limits, licensing, chapters, features and users.</p>
        </section>
        {status ? <p className="teacherStatus" role="status">{status}</p> : null}

        <section className="teacherPanel">
          <div className="panelHeading">
            <div>
              <p className="teacherKicker">Customers</p>
              <h2>All schools</h2>
            </div>
            <span className="studentCount">{schools?.length ?? 0} schools</span>
          </div>
          {!schools ? (
            <p className="teacherEmpty">Loading schools…</p>
          ) : !schools.length ? (
            <p className="teacherEmpty">No schools yet. Create the first one below.</p>
          ) : (
            <div className="tableScroller">
              <table className="teacherTable">
                <thead>
                  <tr><th>School</th><th>Status</th><th>Plan</th><th>Students</th><th>Teachers</th><th>Active (30 days)</th><th>Contract ends</th></tr>
                </thead>
                <tbody>
                  {schools.map(school => (
                    <tr key={school.id}>
                      <td><Link href={`/admins/schools/${school.id}`}>{school.name}</Link><br /><small>{school.slug}</small></td>
                      <td><span className={`${styles.badge} ${school.status === "suspended" ? styles.danger : ""}`}>{school.status}</span></td>
                      <td>{school.plan ?? "—"}</td>
                      <td>{ofLimit(school.usage.students, school.seatLimit)}</td>
                      <td>{ofLimit(school.usage.teachers, school.teacherLimit)}</td>
                      <td>{school.usage.active30d}</td>
                      <td><ContractBadge days={school.contractDays} endsAt={school.contractEndsAt} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="teacherPanel" id="new-school">
          <h2>{prefill.leadId ? `Convert lead: ${prefill.name}` : "New school"}</h2>
          <form key={prefill.leadId ?? "new"} method="post" onSubmit={create}>
            <label htmlFor="school-name">School name</label>
            <input
              defaultValue={prefill.name}
              id="school-name"
              maxLength={160}
              minLength={2}
              name="name"
              onBlur={event => {
                const slug = event.currentTarget.form?.elements.namedItem("slug") as HTMLInputElement | null;
                if (slug && !slug.value) slug.value = slugify(event.currentTarget.value);
              }}
              required
            />
            <label htmlFor="school-slug">Login slug (students choose this school by it)</label>
            <input defaultValue={prefill.name ? slugify(prefill.name) : undefined} id="school-slug" maxLength={60} name="slug" pattern="[a-z0-9]+(-[a-z0-9]+)*" required />
            <ContractFields defaults={{ seatLimit: prefill.seatLimit, contactName: prefill.contactName, contactEmail: prefill.contactEmail }} />
            <fieldset className="assignGrid">
              <legend>Grades</legend>
              {schoolGrades.map(grade => <label key={grade}><input name="grades" type="checkbox" value={grade} />Class {grade}</label>)}
            </fieldset>
            <fieldset className="assignGrid">
              <legend>Subjects</legend>
              {schoolSubjects.map(subject => <label key={subject}><input defaultChecked name="subjects" type="checkbox" value={subject} />{subject}</label>)}
            </fieldset>
            <button className="teacherPrimary" type="submit">Create school</button>
          </form>
        </section>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: School page** — create `app/admins/schools/[id]/page.tsx`:

```tsx
"use client";

import { useParams } from "next/navigation";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { AdminsHeader } from "../../AdminsHeader";
import { AuditTable, type AuditEntry } from "../../AuditTable";
import { ContractBadge, ContractFields, readContractFields } from "../../ContractFields";
import { OneTimeLink } from "../../OneTimeLink";
import { daysUntil, platformFetch } from "../../admins-api";
import styles from "../../admins.module.css";

const FEATURES = [
  ["chat", "Shiksha Guide (AI chat)"],
  ["live", "Live class feed"],
  ["lms", "Assignments and marks"],
  ["hindi", "Hindi language mode"],
] as const;
type Feature = (typeof FEATURES)[number][0];

type Licensing = { grades: number[]; subjects: string[]; hiddenModules: string[]; features: Record<Feature, boolean> };
type Detail = {
  school: {
    id: number; name: string; slug: string; status: "active" | "suspended"; plan: string | null;
    seatLimit: number | null; teacherLimit: number | null; classLimit: number | null; contractEndsAt: string | null;
    contactName: string | null; contactEmail: string | null; notes: string | null;
  };
  licensing: Licensing;
  usage: { teachers: number; students: number; classes: number; active30d: number };
  teachers: { id: number; name: string; email: string; role: "teacher" | "school_admin"; status: "pending" | "active" | "suspended" }[];
  invites: { id: number; email: string; expiresAt: number }[];
  catalog: { id: string; title: string; grades: number[]; strand: string }[];
  availableGrades: number[];
  availableSubjects: string[];
};

const toggled = <T,>(list: T[], value: T, on: boolean) => (on ? [...list, value] : list.filter(item => item !== value));
const ofLimit = (used: number, limit: number | null) => (limit == null ? `${used}` : `${used} / ${limit}`);

/** One school: contract, limits, licensing, features, chapters, users and its audit trail. */
export default function SchoolPage() {
  const { id } = useParams<{ id: string }>();
  const [detail, setDetail] = useState<Detail | null>(null);
  const [draft, setDraft] = useState<Licensing | null>(null);
  const [contractDays, setContractDays] = useState<number | null>(null);
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [status, setStatus] = useState("");
  const [inviteLink, setInviteLink] = useState("");

  const load = useCallback(async () => {
    const [school, trail] = await Promise.all([
      platformFetch<Detail & { error?: string }>(`/api/platform/schools/${id}`),
      platformFetch<{ entries?: AuditEntry[]; error?: string }>(`/api/platform/audit?schoolId=${id}`),
    ]);
    if (!school.ok) {
      setStatus(school.payload.error ?? "Could not load this school.");
      return;
    }
    setDetail(school.payload);
    setDraft(school.payload.licensing);
    setContractDays(daysUntil(school.payload.school.contractEndsAt, Date.now()));
    setAudit(trail.payload.entries ?? []);
  }, [id]);

  useEffect(() => {
    // The callback owns its own state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const chapters = useMemo(() => {
    if (!detail || !draft) return [];
    return detail.catalog.filter(chapter =>
      chapter.grades.some(grade => draft.grades.includes(grade)) && draft.subjects.includes(chapter.strand));
  }, [detail, draft]);

  if (!detail || !draft) {
    return (
      <main className="teacherPage">
        <AdminsHeader active="schools" />
        <div className="teacherShell"><p className="teacherEmpty">{status || "Loading school…"}</p></div>
      </main>
    );
  }
  const { school, usage } = detail;

  async function patch(body: Record<string, unknown>, done: string) {
    setStatus("");
    const { ok, payload } = await platformFetch<{ error?: string }>(`/api/platform/schools/${id}`, "PATCH", body);
    setStatus(ok ? done : payload.error ?? "Could not save.");
    if (ok) await load();
  }

  async function saveContract(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await patch({ name: String(form.get("name") ?? "").trim(), ...readContractFields(form) }, "Contract details saved.");
  }

  async function toggleSchool() {
    const next = school.status === "active" ? "suspended" : "active";
    if (next === "suspended" && !window.confirm(`Suspend ${school.name}? Every teacher and student there is signed out at once and cannot log in until you reactivate it.`)) return;
    await patch({ status: next }, next === "suspended" ? "School suspended." : "School reactivated.");
  }

  async function setTeacherStatus(teacherId: number, next: "active" | "suspended") {
    const { ok, payload } = await platformFetch<{ error?: string }>(`/api/platform/schools/${id}/teachers/${teacherId}`, "PATCH", { status: next });
    setStatus(ok ? (next === "suspended" ? "Teacher suspended and signed out." : "Teacher reactivated.") : payload.error ?? "Could not update that teacher.");
    if (ok) await load();
  }

  async function invite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setInviteLink("");
    const { ok, payload } = await platformFetch<{ invite?: { acceptUrl: string }; error?: string }>(
      `/api/platform/schools/${id}/invite`, "POST", { email: new FormData(formElement).get("email") });
    if (!ok || !payload.invite) {
      setStatus(payload.error ?? "Could not create the invite.");
      return;
    }
    setInviteLink(payload.invite.acceptUrl);
    setStatus("Invite ready. Send this link to the school admin.");
    formElement.reset();
    await load();
  }

  async function signEveryoneOut() {
    if (!window.confirm(`Sign out every teacher and student at ${school.name}?`)) return;
    const { ok, payload } = await platformFetch<{ error?: string }>(`/api/platform/schools/${id}/logout-all`, "POST", {});
    setStatus(ok ? "Everyone at this school has been signed out." : payload.error ?? "Could not sign everyone out.");
    if (ok) await load();
  }

  return (
    <main className="teacherPage">
      <AdminsHeader active="schools" />
      <div className="teacherShell">
        <section className="teacherIntro">
          <h1>{school.name}</h1>
          <div className={styles.row}>
            <span className={`${styles.badge} ${school.status === "suspended" ? styles.danger : ""}`}>{school.status}</span>
            <span>Login slug <code>{school.slug}</code></span>
            <span>
              Students {ofLimit(usage.students, school.seatLimit)} · Teachers {ofLimit(usage.teachers, school.teacherLimit)} ·
              Classes {ofLimit(usage.classes, school.classLimit)} · {usage.active30d} active in 30 days
            </span>
            <ContractBadge days={contractDays} endsAt={school.contractEndsAt} />
            <button className={school.status === "active" ? "danger" : "teacherPrimary"} onClick={() => void toggleSchool()} type="button">
              {school.status === "active" ? "Suspend school" : "Reactivate school"}
            </button>
          </div>
        </section>
        {status ? <p className="teacherStatus" role="status">{status}</p> : null}

        <section className="teacherPanel">
          <h2>Contract and limits</h2>
          <form key={JSON.stringify(school)} method="post" onSubmit={saveContract}>
            <label htmlFor="school-name">School name</label>
            <input defaultValue={school.name} id="school-name" maxLength={160} minLength={2} name="name" required />
            <ContractFields defaults={school} />
            <button className="teacherPrimary" type="submit">Save contract</button>
          </form>
        </section>

        <section className="teacherPanel">
          <h2>Licensing and features</h2>
          <fieldset className="assignGrid">
            <legend>Grades</legend>
            {detail.availableGrades.map(grade => (
              <label key={grade}>
                <input checked={draft.grades.includes(grade)} onChange={event => setDraft({ ...draft, grades: toggled(draft.grades, grade, event.target.checked) })} type="checkbox" />
                Class {grade}
              </label>
            ))}
          </fieldset>
          <fieldset className="assignGrid">
            <legend>Subjects</legend>
            {detail.availableSubjects.map(subject => (
              <label key={subject}>
                <input checked={draft.subjects.includes(subject)} onChange={event => setDraft({ ...draft, subjects: toggled(draft.subjects, subject, event.target.checked) })} type="checkbox" />
                {subject}
              </label>
            ))}
          </fieldset>
          <fieldset className="assignGrid">
            <legend>Features</legend>
            {FEATURES.map(([key, label]) => (
              <label key={key}>
                <input checked={draft.features[key]} onChange={event => setDraft({ ...draft, features: { ...draft.features, [key]: event.target.checked } })} type="checkbox" />
                {label}
              </label>
            ))}
          </fieldset>
          <button
            className="teacherPrimary"
            disabled={!draft.grades.length || !draft.subjects.length}
            onClick={() => void patch({ grades: draft.grades, subjects: draft.subjects, features: draft.features }, "Licensing saved. It applies on each user's next request.")}
            type="button"
          >
            Save licensing and features
          </button>
        </section>

        <section className="teacherPanel">
          <h2>Chapters</h2>
          <p>Untick a chapter to hide it from this school&apos;s students and teachers. Learning records are kept.</p>
          <div className={styles.chapters}>
            {chapters.map(chapter => (
              <label key={chapter.id}>
                <input
                  checked={!draft.hiddenModules.includes(chapter.id)}
                  onChange={event => setDraft({ ...draft, hiddenModules: toggled(draft.hiddenModules, chapter.id, !event.target.checked) })}
                  type="checkbox"
                />
                Class {chapter.grades.join("/")} · {chapter.strand} · {chapter.title}
              </label>
            ))}
          </div>
          <button className="teacherPrimary" onClick={() => void patch({ hiddenModules: draft.hiddenModules }, "Chapter visibility saved.")} type="button">
            Save chapters ({draft.hiddenModules.length} hidden)
          </button>
        </section>

        <section className="teacherPanel">
          <div className="panelHeading">
            <div>
              <p className="teacherKicker">People</p>
              <h2>School users</h2>
            </div>
            <button className="danger" onClick={() => void signEveryoneOut()} type="button">Sign everyone out</button>
          </div>
          {detail.teachers.length ? (
            <div className="tableScroller">
              <table className="teacherTable">
                <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th aria-label="Actions" /></tr></thead>
                <tbody>
                  {detail.teachers.map(teacher => (
                    <tr key={teacher.id}>
                      <td>{teacher.name}</td>
                      <td>{teacher.email}</td>
                      <td>{teacher.role === "school_admin" ? "School admin" : "Teacher"}</td>
                      <td>{teacher.status}</td>
                      <td>
                        <div className="tableActions">
                          {teacher.status === "suspended" ? (
                            <button onClick={() => void setTeacherStatus(teacher.id, "active")} type="button">reactivate</button>
                          ) : (
                            <button className="danger" onClick={() => void setTeacherStatus(teacher.id, "suspended")} type="button">suspend</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="teacherEmpty">No teachers yet. Invite the school admin below.</p>
          )}
          {detail.invites.length ? <p>Pending invites: {detail.invites.map(pending => pending.email).join(", ")}</p> : null}
          <form method="post" onSubmit={invite}>
            <label htmlFor="invite-email">Invite a school admin</label>
            <input id="invite-email" name="email" required type="email" />
            <button className="teacherPrimary" type="submit">Create invite link</button>
          </form>
          {inviteLink ? <OneTimeLink url={inviteLink} /> : null}
        </section>

        <section className="teacherPanel">
          <h2>Activity</h2>
          <AuditTable entries={audit} />
        </section>
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Typecheck and lint**

Run: `N22 npm run typecheck && N22 npm run lint`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add app/admins
git commit -m "Add the schools list and per-school control page to the admin panel

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 10: Leads, team and audit pages

**Files:**
- Create: `app/admins/leads/page.tsx`, `app/admins/team/page.tsx`, `app/admins/audit/page.tsx`

**Interfaces:**
- Consumes: Task 6 leads API, Task 7 admins and audit APIs, Task 8 components.

- [ ] **Step 1: Leads page** — create `app/admins/leads/page.tsx`:

```tsx
"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AdminsHeader } from "../AdminsHeader";
import { platformFetch } from "../admins-api";

const STATUSES = ["new", "contacted", "converted", "rejected"] as const;
type Lead = {
  id: number;
  schoolName: string;
  contactName: string;
  contactEmail: string;
  studentCount: number | null;
  status: (typeof STATUSES)[number];
  schoolId: number | null;
  notes: string | null;
  createdAt: string;
};

const convertHref = (lead: Lead) => `/admins?${new URLSearchParams({
  leadId: String(lead.id),
  name: lead.schoolName,
  contactName: lead.contactName,
  contactEmail: lead.contactEmail,
  ...(lead.studentCount ? { seatLimit: String(lead.studentCount) } : {}),
})}#new-school`;

/** The /register-school form submissions, worked as a simple pipeline. */
export default function LeadsPage() {
  const [filter, setFilter] = useState("");
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [status, setStatus] = useState("");

  const load = useCallback(async () => {
    const { ok, payload } = await platformFetch<{ leads?: Lead[]; error?: string }>(`/api/platform/leads${filter ? `?status=${filter}` : ""}`);
    if (ok && payload.leads) setLeads(payload.leads);
    else setStatus(payload.error ?? "Could not load leads.");
  }, [filter]);

  useEffect(() => {
    // The callback owns its own state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  async function update(lead: Lead, body: { status?: Lead["status"]; notes?: string | null }) {
    const { ok, payload } = await platformFetch<{ error?: string }>(`/api/platform/leads/${lead.id}`, "PATCH", body);
    setStatus(ok ? `${lead.schoolName} updated.` : payload.error ?? "Could not update that lead.");
    if (ok) await load();
  }

  return (
    <main className="teacherPage">
      <AdminsHeader active="leads" />
      <div className="teacherShell">
        <section className="teacherIntro">
          <h1>Leads</h1>
          <p>Schools that filled in the registration form. Convert one to create the school with its details filled in.</p>
        </section>
        {status ? <p className="teacherStatus" role="status">{status}</p> : null}
        <section className="teacherPanel">
          <label htmlFor="lead-filter">Show</label>
          <select id="lead-filter" onChange={event => setFilter(event.target.value)} value={filter}>
            <option value="">All leads</option>
            {STATUSES.map(value => <option key={value} value={value}>{value}</option>)}
          </select>
          {!leads ? (
            <p className="teacherEmpty">Loading leads…</p>
          ) : !leads.length ? (
            <p className="teacherEmpty">No leads here.</p>
          ) : (
            <div className="tableScroller">
              <table className="teacherTable">
                <thead><tr><th>Received (UTC)</th><th>School</th><th>Contact</th><th>Students</th><th>Status</th><th>Notes</th><th aria-label="Actions" /></tr></thead>
                <tbody>
                  {leads.map(lead => (
                    <tr key={lead.id}>
                      <td>{lead.createdAt}</td>
                      <td>{lead.schoolName}</td>
                      <td>{lead.contactName}<br /><a href={`mailto:${lead.contactEmail}`}>{lead.contactEmail}</a></td>
                      <td>{lead.studentCount ?? "—"}</td>
                      <td>
                        <select aria-label={`Status of ${lead.schoolName}`} onChange={event => void update(lead, { status: event.target.value as Lead["status"] })} value={lead.status}>
                          {STATUSES.map(value => <option key={value} value={value}>{value}</option>)}
                        </select>
                      </td>
                      <td>
                        <textarea
                          aria-label={`Notes on ${lead.schoolName}`}
                          defaultValue={lead.notes ?? ""}
                          maxLength={4000}
                          onBlur={event => {
                            const notes = event.target.value.trim() || null;
                            if (notes !== lead.notes) void update(lead, { notes });
                          }}
                        />
                      </td>
                      <td>
                        {lead.schoolId ? (
                          <Link href={`/admins/schools/${lead.schoolId}`}>Open school</Link>
                        ) : (
                          <Link className="teacherPrimary" href={convertHref(lead)}>Convert</Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Team page** — create `app/admins/team/page.tsx`:

```tsx
"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { AdminsHeader } from "../AdminsHeader";
import { OneTimeLink } from "../OneTimeLink";
import { platformFetch } from "../admins-api";

type Admin = {
  id: number;
  name: string;
  email: string;
  status: "pending" | "active" | "suspended";
  mfaEnrolled: boolean;
  lastLoginAt: string | null;
};
type Action = "suspend" | "reactivate" | "reset";

const actionsFor = (admin: Admin): Action[] => (admin.status === "suspended" ? ["reactivate"] : ["reset", "suspend"]);
const actionLabels: Record<Action, string> = { suspend: "Suspend", reactivate: "Reactivate", reset: "New setup link" };

/** The CyberSuraksha team that can use this panel. */
export default function TeamPage() {
  const [admins, setAdmins] = useState<Admin[] | null>(null);
  const [status, setStatus] = useState("");
  const [link, setLink] = useState("");

  const load = useCallback(async () => {
    const { ok, payload } = await platformFetch<{ admins?: Admin[]; error?: string }>("/api/platform/admins");
    if (ok && payload.admins) setAdmins(payload.admins);
    else setStatus(payload.error ?? "Could not load the team.");
  }, []);

  useEffect(() => {
    // The callback owns its own state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  async function add(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setLink("");
    const { ok, payload } = await platformFetch<{ setupUrl?: string; error?: string }>("/api/platform/admins", "POST", { name: form.get("name"), email: form.get("email") });
    if (!ok || !payload.setupUrl) {
      setStatus(payload.error ?? "Could not add that teammate.");
      return;
    }
    setLink(payload.setupUrl);
    setStatus(`Send this setup link to ${String(form.get("email"))}. It works once, for 7 days.`);
    formElement.reset();
    await load();
  }

  async function act(admin: Admin, action: Action) {
    if (action === "suspend" && !window.confirm(`Suspend ${admin.name}? They are signed out at once.`)) return;
    setLink("");
    const { ok, payload } = await platformFetch<{ setupUrl?: string; error?: string }>(`/api/platform/admins/${admin.id}`, "PATCH", { action });
    if (!ok) {
      setStatus(payload.error ?? "Could not update that teammate.");
      return;
    }
    if (payload.setupUrl) {
      setLink(payload.setupUrl);
      setStatus(`New setup link for ${admin.name}. Their current login keeps working until they use it.`);
    } else {
      setStatus(`${admin.name} ${action === "suspend" ? "suspended" : "reactivated"}.`);
    }
    await load();
  }

  return (
    <main className="teacherPage">
      <AdminsHeader active="team" />
      <div className="teacherShell">
        <section className="teacherIntro">
          <h1>Team</h1>
          <p>Everyone here can manage every school. Each person sets their own password and authenticator from a one-time link.</p>
        </section>
        {status ? <p className="teacherStatus" role="status">{status}</p> : null}
        {link ? <OneTimeLink url={link} /> : null}

        <section className="teacherPanel">
          <h2>Add a teammate</h2>
          <form method="post" onSubmit={add}>
            <label htmlFor="team-name">Name</label>
            <input id="team-name" maxLength={120} minLength={2} name="name" required />
            <label htmlFor="team-email">Work email</label>
            <input id="team-email" name="email" required type="email" />
            <button className="teacherPrimary" type="submit">Create setup link</button>
          </form>
        </section>

        <section className="teacherPanel">
          <h2>Admins</h2>
          {!admins ? (
            <p className="teacherEmpty">Loading the team…</p>
          ) : (
            <div className="tableScroller">
              <table className="teacherTable">
                <thead><tr><th>Name</th><th>Email</th><th>Status</th><th>2FA</th><th>Last sign-in (UTC)</th><th aria-label="Actions" /></tr></thead>
                <tbody>
                  {admins.map(admin => (
                    <tr key={admin.id}>
                      <td>{admin.name}</td>
                      <td>{admin.email}</td>
                      <td>{admin.status}</td>
                      <td>{admin.mfaEnrolled ? "Enrolled" : "Not yet"}</td>
                      <td>{admin.lastLoginAt ?? "Never"}</td>
                      <td>
                        <div className="tableActions">
                          {actionsFor(admin).map(action => (
                            <button className={action === "suspend" ? "danger" : ""} key={action} onClick={() => void act(admin, action)} type="button">
                              {actionLabels[action]}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Audit page** — create `app/admins/audit/page.tsx`:

```tsx
"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { AdminsHeader } from "../AdminsHeader";
import { AuditTable, type AuditEntry } from "../AuditTable";
import { platformFetch } from "../admins-api";

type Filters = { action: string; schoolId: string };

/** Everything platform admins and school staff did, newest first. */
export default function AuditPage() {
  const [filters, setFilters] = useState<Filters>({ action: "", schoolId: "" });
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [next, setNext] = useState<number | null>(null);
  const [schools, setSchools] = useState<{ id: number; name: string }[]>([]);
  const [status, setStatus] = useState("");

  const fetchPage = useCallback(async (before: number | null) => {
    const params = new URLSearchParams();
    if (filters.action) params.set("action", filters.action);
    if (filters.schoolId) params.set("schoolId", filters.schoolId);
    if (before) params.set("before", String(before));
    const { ok, payload } = await platformFetch<{ entries?: AuditEntry[]; nextBefore?: number | null; error?: string }>(`/api/platform/audit?${params}`);
    if (!ok || !payload.entries) {
      setStatus(payload.error ?? "Could not load the audit log.");
      return;
    }
    const page = payload.entries;
    setEntries(current => (before ? [...current, ...page] : page));
    setNext(payload.nextBefore ?? null);
  }, [filters]);

  useEffect(() => {
    // The callback owns its own state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchPage(null);
  }, [fetchPage]);

  useEffect(() => {
    void platformFetch<{ schools?: { id: number; name: string }[]; error?: string }>("/api/platform/schools")
      .then(({ payload }) => setSchools(payload.schools ?? []));
  }, []);

  function applyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setFilters({ action: String(form.get("action") ?? "").trim(), schoolId: String(form.get("schoolId") ?? "") });
  }

  return (
    <main className="teacherPage">
      <AdminsHeader active="audit" />
      <div className="teacherShell">
        <section className="teacherIntro">
          <h1>Audit log</h1>
          <p>Every sign-in, failed sign-in and change made from this panel, plus every school&apos;s own admin actions.</p>
        </section>
        {status ? <p className="teacherStatus" role="status">{status}</p> : null}
        <section className="teacherPanel">
          <form method="get" onSubmit={applyFilters}>
            <label htmlFor="audit-action">Action starts with</label>
            <input id="audit-action" name="action" placeholder="e.g. platform.login" />
            <label htmlFor="audit-school">School</label>
            <select defaultValue="" id="audit-school" name="schoolId">
              <option value="">All schools</option>
              {schools.map(school => <option key={school.id} value={school.id}>{school.name}</option>)}
            </select>
            <button className="teacherPrimary" type="submit">Filter</button>
          </form>
          <AuditTable entries={entries} />
          {next ? <button className="teacherSecondary" onClick={() => void fetchPage(next)} type="button">Load older entries</button> : null}
        </section>
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Typecheck and lint**

Run: `N22 npm run typecheck && N22 npm run lint`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add app/admins
git commit -m "Add leads, team and audit pages to the admin panel

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 11: Docs, scripts and end-to-end verification

**Files:**
- Modify: `package.json` (`test:backend`), `DEPLOYMENT.md`

- [ ] **Step 1: Add the new tests to the backend suite** — in `package.json` replace

```json
    "test:backend": "node --test tests/school-backend.test.mjs tests/school-migration.test.mjs tests/assessment.test.mjs tests/lms-summary.test.mjs",
```

with

```json
    "test:backend": "node --test tests/school-backend.test.mjs tests/school-migration.test.mjs tests/assessment.test.mjs tests/lms-summary.test.mjs tests/totp.test.mjs tests/platform-admin.test.mjs",
```

- [ ] **Step 2: Document the panel** — in `DEPLOYMENT.md`, add this section after the go-live steps (before the environment variable table):

```md
## Company admin panel (`/admins`)

`https://cybershiksha.eevsec.com/admins` is for CyberSuraksha staff only. It has its own
accounts (not teacher logins), requires an authenticator-app code at every sign-in, and is
excluded from search engines. Nothing in the school UI links to it.

First admin:

1. `npx wrangler secret put PLATFORM_ADMIN_EMAIL` with your work email (optionally
   `PLATFORM_ADMIN_NAME`). No password goes into a secret.
2. Deploy, run `npx wrangler tail`, open `/admins/login` and submit the form once with your
   email and any password. The tail prints a one-time setup link.
3. Open the link within 7 days: choose a password (12+ characters) and add the shown key to
   Google Authenticator, Authy or 1Password.
4. Add teammates from **Team**; each gets their own setup link. **New setup link** resets a
   teammate who lost their phone (their old sessions end when they use it).

What the panel controls per school: licensed grades and subjects (school admins can no longer
change these), hidden chapters, feature switches (Shiksha Guide, live feed, assignments,
Hindi), student/teacher/class limits, contract dates and contacts, suspension (signs everyone
out at once), individual teacher suspension, "sign everyone out", and school-admin invites.
Every action is in **Audit log** with who, when, IP and before/after values.
```

and add this row to the environment variable table:

```md
| `PLATFORM_ADMIN_EMAIL` / `PLATFORM_ADMIN_NAME` | Bootstraps the first company admin for `/admins` (setup link written to the worker log). | Required for the admin panel |
```

- [ ] **Step 3: Full checks**

Run: `N22 npm run typecheck && N22 npm run lint && N22 npm run test:backend && N22 npm run build` (tests outside the sandbox)
Expected: all pass; the build lists the `/admins` routes.

- [ ] **Step 4: Browser pass.** `.dev.vars` is not git-ignored in this repo: add a `.dev.vars` line to `.gitignore` first (and confirm `git check-ignore .dev.vars` now prints it), then add `PLATFORM_ADMIN_EMAIL=dev-admin@cybersuraksha.test` to `.dev.vars`. Start the dev server with the preview tool (create a `dev` entry running `npm run dev` in `.claude/launch.json` if none exists). Then:
  1. Open `/admins` → redirected to `/admins/login`. Response headers include `X-Robots-Tag: noindex, nofollow`.
  2. Submit the login form once; find the setup link in the server logs (search `[admins]`).
  3. Open the link, set a password, and get a code for the shown secret with
     `N22 node --input-type=module -e "import {totpCode} from './app/lib/totp.ts'; console.log(await totpCode('<SECRET>', Date.now()))"`. Finish setup.
  4. Sign in (password, then a code for the next 30-second window).
  5. Schools: the demo school is listed with usage. Create a school with a contract date 10 days out → amber badge.
  6. School page: hide a chapter, switch Hindi off, set a seat limit, suspend then reactivate; each shows a status message and appears under Activity.
  7. Submit `/register-school`, then Leads: change status, add a note, Convert → the new-school form is prefilled; create it → the lead shows "Open school".
  8. Team: add a teammate → one-time link shown; suspend them.
  9. Audit log: filter `platform.login` and by school; "Load older entries" appears only with more than 50 rows.
  10. As the demo school admin (`teacher@dpsrkp.edu.in`), `/teach/admin` shows the read-only "School plan" card.
  11. Check the console for errors and resize to 375 px wide: no horizontal page scroll.

- [ ] **Step 5: Commit**

```bash
git add package.json DEPLOYMENT.md .gitignore
git commit -m "Document the company admin panel and run its tests in the backend suite

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```
