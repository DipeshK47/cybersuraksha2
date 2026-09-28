# Deployment & Production Operations

CyberSuraksha runs on **Cloudflare Workers** with a **D1 (SQLite)** database. The
app is a Next.js 16 / React 19 build produced by `vinext`. This document covers
taking it from local development to a hardened production deployment.

## 1. Prerequisites

- Node.js **22.13+** (`node --version`)
- A Cloudflare account with Workers + D1 enabled
- `wrangler` (bundled as a dev dependency): `npx wrangler login`

## 2. Create the production D1 database

```bash
npx wrangler d1 create cybersuraksha
```

Wrangler prints a `database_id`. The binding **name** must stay `DB` (see
`.openai/hosting.json` → `"d1": "DB"`). Provide the real `database_id` to the
deployment:

- **Managed hosting (OpenAI/Codex control plane):** the platform injects the D1
  binding values at deploy time — no manual ID needed. This is the default path
  (`db/index.ts` reads `env.DB`).
- **Manual Cloudflare deploy:** replace the placeholder
  `SITE_CREATOR_PLACEHOLDER_DATABASE_ID` in `vite.config.ts` with the real
  `database_id`, or supply a `wrangler.jsonc` (template below) and deploy with
  `wrangler deploy`.

### `wrangler.jsonc` template (manual path)

```jsonc
{
  "name": "cybersuraksha",
  "main": "./worker/index.ts",
  "compatibility_date": "2025-01-01",
  "compatibility_flags": ["nodejs_compat"],
  "d1_databases": [
    { "binding": "DB", "database_name": "cybersuraksha", "database_id": "<REAL_ID>" }
  ]
}
```

## 3. Database migrations — automatic

There is **no manual migration step**. The app ships an in-app migrator
(`db/migrate.ts`) that applies the bundled SQL (`drizzle/*.sql`) on first
request and tracks applied versions in a `_migrations` table. It is idempotent
and safe across concurrent cold starts.

To add a schema change later:

```bash
# 1. edit db/schema.ts, then generate SQL:
npx drizzle-kit generate --name <change>
# 2. import the new drizzle/000X_<change>.sql?raw in db/migrate.ts
#    and append { tag, sql } to the MIGRATIONS array (in order)
```

Seeding only ever touches an **empty** database (`db/academy.ts`), and the demo
school / demo admin / sample students are created **only in development**. A
production build takes the environment-provisioned admin path instead (§4), so
`teacher@dpsrkp.edu.in` / `Teacher@123` cannot exist against real data. Build
the roster from there through the admin console and roster flows.

## 4. Secrets & environment

Never commit secrets. Set them per environment.

| Variable | Purpose | Required |
|----------|---------|----------|
| `GROQ_API_KEY` | Enables Suraksha Guide LLM answers (server-only). Without it, the local handbook fallback is used. | Optional |
| `GROQ_MODEL` / `GROQ_WEB_MODEL` | Model overrides for Suraksha Guide | Optional |
| `CYBERSURAKSHA_ADMIN_EMAIL` / `CYBERSURAKSHA_ADMIN_PASSWORD` | Provisions the first `school_admin` on an empty production database. | Recommended |
| `CYBERSURAKSHA_ADMIN_NAME` / `CYBERSURAKSHA_SCHOOL_NAME` | Display name and school for that account. | Optional |
| `CYBERSURAKSHA_DEMO_SEED` | Set to `1` to force demo seeding in a production build. Leave unset. | Never in production |

```bash
# Production (Cloudflare):
npx wrangler secret put GROQ_API_KEY

# Local dev: put non-secret defaults in .env.local (git-ignored)
cp .env.example .env.local
```

Sessions use opaque, DB-stored, hashed tokens — **no session-signing secret is
required**. Cookies are `HttpOnly; SameSite=Strict` and gain `Secure`
automatically over HTTPS.

## 5. Build & deploy

```bash
npm run lint
npm run build            # vinext build
# Managed hosting: deploy via the platform.
# Manual Cloudflare:
npx wrangler deploy
```

## 6. First-run hardening checklist (production)

- [ ] **Provision the first admin via `CYBERSURAKSHA_ADMIN_EMAIL` /
      `CYBERSURAKSHA_ADMIN_PASSWORD`** and confirm `teacher@dpsrkp.edu.in` cannot log
      in. The demo account is not created in a production build; verify
      `CYBERSURAKSHA_DEMO_SEED` is unset.
- [ ] Serve strictly over **HTTPS** (HSTS is emitted automatically).
- [ ] Enable **Cloudflare rate-limiting rules (WAF)** on `/api/auth/*` — the
      in-app limiter (`app/lib/rate-limit.ts`) is a per-isolate backstop, not
      cross-isolate enforcement.
- [ ] Review the **Content-Security-Policy** in `worker/index.ts`. It currently
      allows `'unsafe-inline'`/`'unsafe-eval'` for the framework runtime;
      tighten with nonces after auditing the build output.
- [ ] Set up **D1 backups** / point-in-time export (`wrangler d1 export`).
- [ ] Confirm `_migrations` shows all expected tags after first deploy.

## 7. Security posture (implemented)

- PBKDF2-hashed passwords (teachers + students); plaintext access codes shown
  once and never stored.
- Opaque, hashed, HttpOnly server sessions for teachers and students.
- Per-teacher tenancy: every student/run/analytics query is scoped to the
  teacher's assigned classes; `school_admin` scoped to their school.
- Invite-based teacher onboarding with one-time hashed tokens; approve/suspend.
- Activity metrics derived server-side from real events (client scores cannot be
  spoofed); all student writes bound to the verified session.
- Zod validation on all mutating endpoints; audit log for account actions;
  security headers + CSP + HSTS.

## 8. Real-time feed scaling

The teacher live feed (`/api/live`) is Server-Sent Events backed by short DB
polling — appropriate for typical class sizes. For very high fan-out, replace
that single endpoint with a Durable-Object-per-class fanning out over
WebSockets; the client event contract is unchanged.
