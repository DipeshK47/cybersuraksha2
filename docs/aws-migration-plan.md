# CyberSuraksha: moving from Cloudflare to AWS

Status: plan, nothing implemented yet. Written 2026-11-01 against branch `feat/ops-admin-panel`.

## TL;DR

| Today (Cloudflare) | On AWS |
|---|---|
| Worker running the vinext (Vite-based Next.js) app | Docker container (Node 22) on one EC2 instance |
| D1 database (`DB` binding, SQLite) | SQLite file on the instance's EBS volume via `@libsql/client`, streamed to S3 by Litestream |
| Static files + 704 MB of narration audio deployed with the Worker | **S3 bucket**, served through **CloudFront** |
| Cloudflare edge / TLS | CloudFront (TLS via ACM) in front of both S3 and the app |
| Secrets in Worker env | SSM Parameter Store → container env vars |
| Backups: manual `wrangler d1 export` | Litestream (continuous) + nightly EBS snapshot |

Course content (audio, mission art, animations, Hindi locale files, JS/CSS bundles) lives in S3 and gets served to students by CloudFront. The app server **does not** ship or serve those files. Paths stay exactly the same (`/audio/...`, `/cyber-missions/...`), so the frontend needs **zero URL changes**.

Postgres on RDS is the upgrade path if we ever need more than one app server. See [Appendix A](#appendix-a-rds-postgres-instead-of-sqlite).

---

## 1. What we store today

### 1a. Database tables (D1 / SQLite, defined in `db/schema.ts`)

| Table | What's in it | Sensitive? | Grows with |
|---|---|---|---|
| `schools` | Tenant root: name, slug | No | Schools |
| `school_settings` | Per-school enabled grades + subjects (JSON text) | No | Schools |
| `school_requests` | "Register your school" form: school name, contact name/email, student count | **PII** (contact info) | Sign-ups |
| `teachers` | Teacher + school-admin accounts: name, email, PBKDF2 password hash, role, status | **PII + credentials** | Staff |
| `sessions` | Teacher login sessions: SHA-256 of token, expiry, IP, user agent | **Yes** (IP, UA) | Logins (expire) |
| `invites` | Pending teacher invites: email, role, hashed one-time token, expiry | **PII** | Invites |
| `classes` | Grade + section, e.g. "7A" | No | Classes |
| `teacher_classes` | Which teacher may see which class (the authorization spine) | No | Assignments of staff |
| `students` | Name, roll no, class, PBKDF2 hash of access code | **PII (minors) + credentials** | Students |
| `student_sessions` | Student login sessions: token hash, expiry, IP, UA | **Yes** | Logins |
| `guardians` | Parent accounts: name, email, password hash, status | **PII + credentials** | Parents |
| `guardian_students` | Which parent may see which child | **Yes** | Parents |
| `guardian_sessions` | Parent login sessions: token hash, expiry | Yes | Logins |
| `runs` | Legacy one-row-per-module summary: rank, leaks, drill, recall, duration | Student data | Students × modules |
| `activity_events` | Fine-grained in-module event stream (JSON payload), feeds the teacher live feed | Student data | **Fastest-growing table** |
| `learning_attempts` | One row per learning session per module: start/last-active/complete, score | Student data | Students × sessions |
| `learning_events` | Events inside an attempt (JSON payload), idempotent by id | Student data | **Fast-growing** |
| `question_attempts` | One-shot answer per student per question: chosen, correct, marks, time, hints | Student data | Students × questions |
| `topic_progress` | Per-topic rollup (so reports never scan raw attempts) | Student data | Students × topics |
| `chapter_progress` | Per-chapter rollup | Student data | Students × chapters |
| `report_cards` | Frozen report snapshot per student per term (JSON payload) | Student data | Students × terms |
| `assignments` | Teacher-made assignments: class, module ids, questions (JSON), due date, marks, published flag | No | Assignments |
| `assignment_students` | Who received an assignment, read receipts | Student data | Assignments × class size |
| `assignment_submissions` | Answers, grades, feedback (JSON) | Student data | Submissions |
| `audit_log` | Teacher-initiated account actions | Yes | Admin actions |
| `_migrations` | Applied migration tags (managed by `db/migrate.ts`) | No | Migrations |

Conventions worth knowing before touching data:
- Timestamps are mixed: older tables use `TEXT` defaulting to `CURRENT_TIMESTAMP`, LMS tables (`learning_*`, `assignment*`) use epoch-ms `INTEGER`.
- Booleans are `INTEGER` 0/1 (`is_correct`, `recap_completed`, `legacy`).
- JSON lives in `TEXT` columns (`payload`, `questions`, `answers`, `grades`, `module_ids`, `grades`/`subjects` in settings).
- Question **bank** is deliberately *not* in the database. It lives in code (`app/data/*`) so it's version-controlled and reviewed; the DB only records stable question ids + marks at the time.

### 1b. What is NOT in the database

| Thing | Where it lives today | Size | Where it goes on AWS |
|---|---|---|---|
| Narration audio (`public/audio/cyber/**`, 468 mp3, 248 lessons, English + Hindi) | Shipped as static assets | **704 MB** | **S3**, served via CloudFront |
| Mission artwork (`public/cyber-missions/**`, webp/jpg/png) | Static assets | 21 MB | S3 |
| Hindi UI/lesson strings (`public/locales/*.json`) | Static assets, fetched at runtime | 9.8 MB | S3 |
| Rive animations (`public/animations/**`) | Static assets | 2 MB | S3 |
| Fonts, brand, favicon, OG image, handbook | Static assets | < 1 MB | S3 |
| Built JS/CSS bundles (`dist/client/assets`, content-hashed) | Static assets | ~8 MB | S3 (immutable cache) |
| Curriculum, lesson text, question bank (`app/data/*`, `app/module/*`) | **Compiled into the JS bundle** | ~10 MB source | Ships inside the bundle in S3 (see §6) |
| Handbook chatbot index (`app/data/handbook-chat-index.json`) | Imported server-side | — | Stays in the server bundle |
| Learning-event queue, language preference | Student's browser `localStorage` | — | Unchanged |
| Rate-limit counters (`app/lib/rate-limit.ts`) | In-memory per process | — | Unchanged; with a single server it's actually global now |

---

## 2. Target architecture

```
                 students / teachers / parents
                              │
                     cybersuraksha domain (Route 53)
                              │
                ┌──────── CloudFront (ACM cert) ────────┐
                │                                       │
  /audio/*  /cyber-missions/*  /animations/*      everything else
  /locales/*  /fonts/*  /brand/*  /assets/*       (pages, /api/*, SSE)
  /handbook/*  favicon.svg  og.png                      │
                │                                       │
         S3 bucket (private, OAC)              EC2 t4g.small/medium
         = contents of dist/client             Docker: Node 22 app server
                                               EBS gp3: /data/prod.db
                                                        │
                                               Litestream ──► S3 (db backups)
```

Why one CloudFront distribution with path rules (and not a separate `media.` domain):
- Every asset URL in the code is root-relative (`/audio/cyber/${slug}/story.mp3`, CSS `url(/cyber-missions/...)`). Same origin means **no code changes**, and the CSP in `worker/index.ts` (`default-src 'self'`) keeps working.
- Students get the audio from the nearest CloudFront edge, never from the EC2 box.

---

## 3. Code changes

All Cloudflare coupling is in these places. Nothing else in the 34 files that call `getDb()` needs to change.

### 3.1 `db/index.ts`: swap the D1 driver for libsql
```ts
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

const client = createClient({ url: process.env.DATABASE_URL ?? "file:/data/prod.db" });
export const rawClient = client; // used by db/migrate.ts
export function getDb() {
  return drizzle(client, { schema });
}
```
- `db.batch([...])` is supported by drizzle's libsql driver, so `db/lms.ts` and `app/api/admin/school/route.ts` keep working.
- `inChunks()` (the 100-parameter workaround) can stay. SQLite's own limit is 32,766, but it costs nothing to keep.
- Turn on WAL + busy timeout once at startup: `PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000; PRAGMA foreign_keys=ON;`. **D1 enforces foreign keys by default; plain SQLite does not.** Without `foreign_keys=ON`, all the `onDelete: "cascade"` rules silently stop working.

### 3.2 `db/migrate.ts`: port the D1 calls
Keep the same design (bundled `?raw` SQL, `_migrations` table, idempotent DDL). The changes are mechanical:
- `env.DB.prepare(sql).run()` → `client.execute(sql)`
- `.all()` → `client.execute(...)`, then `rows` instead of `results`
- `db.batch(statements)` → `client.batch(statements, "write")`

Keep `_migrations` and **not** drizzle-kit's `__drizzle_migrations`. The data we import from D1 already has `_migrations` filled in. Switching migrators would re-run the baseline against a populated DB.

### 3.3 `worker/index.ts`: move the request wrapper
The Worker entry does three things:
1. **Security headers + CSP** (`harden()`) → move into a `middleware.ts` or Nitro server middleware. Keep the header values byte-for-byte.
2. **`/teach` redirect when there's no session cookie** → same middleware.
3. **Image optimisation via Cloudflare `env.IMAGES`** → only 2 files use `next/image`. Mark those `unoptimized` (the art is already webp).

### 3.4 `vite.config.ts`: replace the Cloudflare plugin
- Remove `@cloudflare/vite-plugin` and the `.openai/hosting.json` binding config.
- Add the Nitro Vite plugin with the `node-server` preset (vinext's documented route for non-Cloudflare targets).
- Output: `dist/client` (static, goes to S3) and a Node server bundle (goes into Docker).
- **Unverified:** nobody has built this app on Node yet. Do this step first in a spike branch, before touching data.

### 3.5 Secrets / env
Code already reads `process.env.*`. Put these in SSM Parameter Store (SecureString) and inject them into the container:

`GROQ_API_KEY`, `GROQ_MODEL`, `GROQ_WEB_MODEL`, `CYBERSURAKSHA_ADMIN_EMAIL`, `CYBERSURAKSHA_ADMIN_PASSWORD`, `CYBERSURAKSHA_ADMIN_NAME`, `CYBERSURAKSHA_SCHOOL_NAME`, `DATABASE_URL`, `NODE_ENV=production`.

`CYBERSURAKSHA_DEMO_SEED` must be **unset** in prod (otherwise demo data gets seeded into an empty DB).

### 3.6 Tests
- `tests/school-backend.test.mjs` boots the app in **Miniflare**. It needs a Node harness (start the server against a temp `file:` DB) or it stops being meaningful.
- `tests/school-migration.test.mjs` already uses `node:sqlite`. No change.
- `scripts/smoke-test.mjs <url>` works against any URL. Use it for the cutover.

---

## 4. AWS setup

### 4.1 S3 (static + course content)
- Bucket `cybersuraksha-static-prod`, **Block Public Access ON**, read only by CloudFront via Origin Access Control.
- Second bucket (or prefix) `cybersuraksha-db-backups` for Litestream, with versioning + a lifecycle rule (e.g. keep 30 days).
- Upload on every deploy, with cache headers set per type:
  ```bash
  # hashed bundles: cache forever
  aws s3 sync dist/client/assets s3://cybersuraksha-static-prod/assets \
    --cache-control "public,max-age=31536000,immutable"
  # course content: not content-hashed, so a shorter cache + invalidation
  aws s3 sync dist/client s3://cybersuraksha-static-prod \
    --exclude "assets/*" --exclude "_headers" \
    --cache-control "public,max-age=86400"
  aws cloudfront create-invalidation --distribution-id $DIST \
    --paths "/audio/*" "/cyber-missions/*" "/locales/*" "/animations/*"
  ```
- `dist/client/_headers` is a Cloudflare-only file. Don't upload it; the `--cache-control` flags above replace it.
- mp3 must go up as `audio/mpeg` (the CLI infers it). Range requests work out of the box, so seeking in long narration works.

### 4.2 CloudFront
- Origins: the S3 bucket (OAC) and the EC2 app (custom origin, HTTPS or HTTP from a private SG).
- Behaviours, in order:
  | Path | Origin | Cache policy |
  |---|---|---|
  | `/assets/*` | S3 | CachingOptimized |
  | `/audio/*`, `/cyber-missions/*`, `/animations/*`, `/locales/*`, `/fonts/*`, `/brand/*`, `/handbook/*` | S3 | CachingOptimized |
  | `/favicon.svg`, `/og.png` | S3 | CachingOptimized |
  | `/api/live` | App | **CachingDisabled**, origin read timeout 60s+ (SSE) |
  | `/api/*` | App | CachingDisabled, forward all cookies/headers/query |
  | `*` (default) | App | CachingDisabled, forward cookies |
- Rate-limit IP: `clientKey()` in `app/lib/rate-limit.ts` reads `cf-connecting-ip` (gone on AWS), then falls back to the *first* `X-Forwarded-For` entry. CloudFront appends to whatever the client sent, so that first entry is attacker-controlled and the login rate limit becomes bypassable. **Code change:** forward `CloudFront-Viewer-Address` via an origin request policy and read that (or take the *last* XFF entry).
- ACM certificate in `us-east-1` for the domain; Route 53 alias → distribution.
- The SSE feed (`app/api/live`) keeps a connection open and polls the DB every 2s. CloudFront's origin read timeout must exceed the gap between writes, or the endpoint has to send a `: ping` comment every ~20s. Adding the heartbeat is the robust fix.

### 4.3 EC2 app server
- Region close to users: `ap-south-1` (Mumbai).
- `t4g.small` to start (2 vCPU / 2 GB, ARM), Amazon Linux 2023, Docker.
- EBS gp3 20 GB mounted at `/data` (holds `prod.db` + WAL). Enable daily **EBS snapshots** via Data Lifecycle Manager.
- Security group: inbound 80/443 only from the CloudFront managed prefix list; SSH via SSM Session Manager (no port 22).
- IAM instance role: read SSM params, write to the Litestream backup bucket.
- Run with `docker compose`: `app` + `litestream` sidecar sharing `/data`.
  ```yaml
  # litestream.yml
  dbs:
    - path: /data/prod.db
      replicas:
        - url: s3://cybersuraksha-db-backups/prod
          retention: 720h
  ```
- **Never** put the SQLite file on EFS/NFS. Network-filesystem locking corrupts SQLite.

---

## 5. Data migration runbook (cutover day)

Target: < 30 min of read-only time, outside school hours.

1. **T-1 week:** stand up the AWS stack on a temporary hostname (`aws.<domain>`). Import a *copy* of prod (steps 3–5) and click through teacher, student and parent flows. Run `npm run smoke` against it.
2. **T-0:** announce the maintenance window. Put the Cloudflare app in read-only mode (or just stop the Worker routes).
3. Export D1:
   ```bash
   npx wrangler d1 export cybersuraksha --remote --output d1-final-$(date +%F).sql
   ```
4. Build the SQLite file:
   ```bash
   sqlite3 prod.db < d1-final-YYYY-MM-DD.sql
   sqlite3 prod.db "PRAGMA foreign_keys=ON; PRAGMA foreign_key_check; PRAGMA integrity_check;"
   ```
   `foreign_key_check` must return nothing. If it returns rows, D1 had orphans; fix them before going live.
5. Verify row counts match D1 for every table (script: `SELECT name FROM sqlite_master WHERE type='table'`, then `COUNT(*)` on both sides). Check that `_migrations` lists `0000`–`0004`.
6. Copy `prod.db` to `/data` on EC2, start `docker compose up -d`, and confirm Litestream has pushed its first snapshot to S3.
7. Upload `dist/client` to S3 (§4.1) and invalidate CloudFront.
8. `node scripts/smoke-test.mjs https://aws.<domain>`. Log in as a real teacher and student.
9. Point Route 53 / DNS at CloudFront. Keep the TTL at 60s for the day.
10. **Rollback:** the D1 database is untouched. Point DNS back at Cloudflare. Writes made on AWS after the cutover would need replaying, which is why step 8 happens before DNS.
11. Keep the D1 database + the export for 30 days, then delete.

Students' unsynced learning events sit in their browser's `localStorage` and get flushed to whichever server the domain points at. `recordLearningEvent` is idempotent, so a retry that lands on AWS after cutover is safe, and nothing extra is needed in the export.

---

## 6. "All course content served from AWS": what that means here

- **Media and files** (audio, art, animations, locale JSON, fonts): in S3, served by CloudFront. The Docker image should *exclude* `public/` entirely so the app server physically can't serve them. Add `public` to `.dockerignore` once the build no longer needs it at runtime.
- **Lesson text, curriculum and question bank** are TypeScript in `app/data/*` compiled into the JS bundle. The bundle itself is uploaded to S3, so students load it from CloudFront too. It is *not* in the database, by design: the question bank is reviewed in code, and the DB keeps question ids + the marks available at the time.
- **Open decision for the team:** if we want to edit curriculum without a deploy (CMS-style), it becomes database rows or JSON in S3. That's a separate project. It changes how questions are versioned, and how `question_attempts` / `report_cards` stay correct when content changes. Not part of this migration.

---

## 7. Costs (rough, ap-south-1, pilot scale)

| Item | ~Monthly |
|---|---|
| EC2 t4g.small on-demand | ~$12 |
| EBS 20 GB gp3 + snapshots | ~$3 |
| S3 (~750 MB static + backups) | < $1 |
| CloudFront: depends on audio plays. 1 TB out ≈ $110 from India edges; first 1 TB/month is free tier | $0–$110 |
| Route 53 zone | $0.50 |
| SSM Parameter Store (standard) | $0 |

Audio egress is the number to watch. 704 MB of narration × many students adds up. Watch the CloudFront usage report the first month.

---

## 8. Checklist

- [ ] Spike: vinext + Nitro `node-server` build runs locally against a `file:` SQLite DB
- [ ] `db/index.ts` → libsql, with `PRAGMA foreign_keys=ON`, WAL, busy_timeout
- [ ] `db/migrate.ts` ported to the libsql client API
- [ ] `worker/index.ts` headers, CSP and `/teach` redirect moved into middleware
- [ ] `next/image` (2 files) set to `unoptimized`
- [ ] `app/lib/rate-limit.ts` reads the client IP from `CloudFront-Viewer-Address`, not `cf-connecting-ip` / first XFF entry
- [ ] `/api/live` sends an SSE heartbeat
- [ ] `tests/school-backend.test.mjs` moved off Miniflare
- [ ] Dockerfile + `docker-compose.yml` (app + litestream), `.dockerignore` excludes `public/`
- [ ] S3 buckets (static, backups), CloudFront with OAC + path behaviours, ACM cert
- [ ] EC2 + EBS + DLM snapshots + IAM role + SG locked to CloudFront
- [ ] SSM parameters created; `CYBERSURAKSHA_DEMO_SEED` unset
- [ ] Dry-run import from a D1 export, row counts + `foreign_key_check` clean
- [ ] Cutover runbook (§5) executed; smoke test green; DNS switched
- [ ] `DEPLOYMENT.md` rewritten for AWS; Cloudflare runbook archived
- [ ] Test a Litestream restore into a scratch box **before** we need it

---

## Appendix A: RDS Postgres instead of SQLite

Pick this when we need **more than one app server** (autoscaling, zero-downtime deploys) or want AWS to handle failover. Runs on ECS Fargate or App Runner behind the same CloudFront setup; S3 for content is identical.

Extra work on top of everything above:
1. `db/schema.ts`: `sqliteTable` → `pgTable`, `integer(...).primaryKey({ autoIncrement: true })` → `serial`/`integer().generatedAlwaysAsIdentity()`, `real` → `doublePrecision`, 0/1 integers → `boolean`, JSON text → `jsonb`, `TEXT` timestamps → `timestamptz` (and the epoch-ms integer columns → `bigint`).
2. Throw away `drizzle/*.sql` and regenerate a single Postgres baseline; replace the custom migrator with `drizzle-orm/node-postgres/migrator` (run once at deploy, not per request).
3. `db.batch([...])` (3 call sites) → `db.transaction(async tx => ...)`.
4. Raw `sql` fragments (4) and `CURRENT_TIMESTAMP` defaults: check them against Postgres semantics.
5. Data: export D1 to SQLite as in §5, then load with `pgloader` (`sqlite → postgres`), casting the text timestamps and 0/1 booleans.
6. Rate limiter becomes per-instance again; move it to CloudFront/WAF rate rules or a small table.
7. RDS `db.t4g.micro` Multi-AZ ≈ $30/month extra; automated backups + PITR included.

Estimate: SQLite path ≈ 3–5 days including the spike; Postgres path ≈ 2–3 weeks.
