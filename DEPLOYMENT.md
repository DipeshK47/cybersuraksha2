# Deployment & Production Operations

CyberSuraksha runs on **Cloudflare Workers** with a **D1 (SQLite)** database. The
app is a Next.js 16 / React 19 build produced by `vinext`. This document covers
taking it from local development to a hardened production deployment.

## Go-live runbook (Cloudflare Workers + D1)

Verified locally on the real Workers runtime: `npx wrangler deploy --dry-run` succeeds (bundle 3,012 KiB compressed, 1,399 asset files, no file over 25 MiB) and `scripts/smoke-test.mjs` passes 25/25. Start on the Free plan; see *Free plan or Paid?* below.

Credentials: either run `npx wrangler login` on your machine, or export `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` (wrangler reads both automatically). Never commit a token.

1. **Create the database** (once): `npx wrangler d1 create cybersuraksha` and note the `database_id` it prints.
2. **Build with that id**:
   ```bash
   CYBERSURAKSHA_D1_DATABASE_ID=<database_id> CYBERSURAKSHA_D1_DATABASE_NAME=cybersuraksha npm run build
   ```
3. **Deploy**: `npx wrangler deploy`. The first deploy creates the Worker `cybersuraksha` at `https://cybersuraksha.<your-subdomain>.workers.dev`.
4. **Set the first admin** as secrets (secrets survive redeploys; plain variables do not). Choose a strong, unique password: there is no in-app password change yet.
   ```bash
   npx wrangler secret put CYBERSURAKSHA_SCHOOL_NAME
   npx wrangler secret put CYBERSURAKSHA_ADMIN_NAME
   npx wrangler secret put CYBERSURAKSHA_ADMIN_EMAIL
   npx wrangler secret put CYBERSURAKSHA_ADMIN_PASSWORD
   ```
   To show the product to prospective schools, also add the public demo login (see *About the public demo login* below): `npx wrangler secret put CYBERSURAKSHA_DEMO_TEACHER` with the value `1`.
   Do **not** set `CYBERSURAKSHA_DEMO_SEED`: it is the development demo, and it creates a demo *admin* with a public password. Leave `GROQ_API_KEY` unset for now (the chatbot then answers from the local handbook and costs nothing).
5. **Smoke test** (this creates the database tables and the admin on first request):
   ```bash
   SMOKE_ADMIN_EMAIL=<admin email> SMOKE_ADMIN_PASSWORD='<admin password>' node scripts/smoke-test.mjs https://cybersuraksha.<your-subdomain>.workers.dev
   ```
   All checks must pass (add `SMOKE_DEMO=1` when the demo login is enabled, so the test expects it to work). Then open a lesson in a browser and confirm the narration plays.
6. **Remove the bootstrap password**: `npx wrangler secret delete CYBERSURAKSHA_ADMIN_PASSWORD`. It is only needed once.
7. **Custom domain**: Cloudflare dashboard, Workers & Pages, `cybersuraksha`, Settings, Domains & Routes, Add, Custom domain. The domain must be on Cloudflare. Re-run the smoke test against it (it also checks HSTS and the Secure cookie flag).
8. **Rate limit logins**: dashboard, Security, WAF, Rate limiting rules: match URI path starts with `/api/auth/`, about 10 requests per minute per IP, block for 10 minutes. The in-app limiter is only per instance.
9. **Check the real CPU cost**: dashboard, Workers & Pages, `cybersuraksha`, Metrics. Log in a few times and open lessons; look for CPU-limit errors (code 1102).
10. **Before every later deploy**: `npx wrangler d1 export cybersuraksha --remote --output backup-$(date +%F).sql`. D1 also keeps point-in-time recovery (Time Travel). To undo a bad deploy: `npx wrangler rollback`.

**About the public demo login.** `CYBERSURAKSHA_DEMO_TEACHER=1` creates a deliberately public account so people can try the product. What it can and cannot do:
- It is a plain teacher in its own "CyberShiksha Demo School", assigned to two demo classes. School and class scoping (verified by the security audit) keep it away from real schools' data. It has no admin console and cannot invite anyone.
- The sample students have no usable login, so only the teacher side can be demonstrated.
- Anyone who knows the password can use every teacher feature in the demo school, including creating assignments and adding students. Never put real children's data in it, and expect a little clutter. To reset it, delete the demo school's rows (or the whole demo school) in D1 and the next request re-creates the sample data.
- The demo teacher also unlocks all lesson content to anyone who has the password, so treat the credentials as public.
- To change the password after it exists: delete the `teacher@dpsrkp.edu.in` row from `teachers` (`npx wrangler d1 execute cybersuraksha --remote --command "DELETE FROM teachers WHERE email='teacher@dpsrkp.edu.in'"`), set `CYBERSURAKSHA_DEMO_TEACHER_PASSWORD`, and make one request.
- To turn the demo off: delete the secret `CYBERSURAKSHA_DEMO_TEACHER` and, if you want the account gone, delete that row. Existing accounts are not removed automatically.

**Free plan or Paid?** Try Free first. Move to Workers Paid (about $5/month) if any request fails with a CPU-limit error (1102), if a deploy is refused as too large (the bundle is only about 60 KiB under 3 MiB), or before students log in. Students also require the work listed under *Planned security work* below.

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
- **Manual Cloudflare deploy:** build with `CYBERSURAKSHA_D1_DATABASE_ID` set to the real
  `database_id` (see the go-live runbook above), or supply a `wrangler.jsonc`
  (template below) and deploy with `wrangler deploy`.

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
| `CYBERSURAKSHA_PBKDF2_ITERATIONS` | Password-hashing work factor, 1,000-100,000. Defaults to **10,000** so a login fits the Workers Free plan's 10 ms CPU limit. Raise it (for example 100,000) on the Workers Paid plan; existing hashes upgrade on each user's next login. | Optional |
| `CYBERSURAKSHA_DEMO_TEACHER` | Set to `1` to add a **public demo login**: a separate "CyberShiksha Demo School" with a plain teacher (`teacher@dpsrkp.edu.in`, password `Teacher@123`), two demo classes and sample students nobody can sign in as. It never creates a demo admin. | Optional (for showcasing) |
| `CYBERSURAKSHA_DEMO_TEACHER_PASSWORD` | Different password for the demo teacher. Only read when the demo teacher is first created. | Optional |
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

## 5a. Automatic deploys from GitHub (Cloudflare Workers Builds)

Every push to `main` can build and deploy the Worker by itself. This is a Cloudflare dashboard setting; nothing in the
repo triggers it. The build needs to know which Worker and database it is for, so set these as **build variables**:

| Build variable | Value for CyberShiksha |
| --- | --- |
| `CYBERSURAKSHA_WORKER_NAME` | `cybershiksha` (without it the build targets the package name, a different Worker) |
| `CYBERSURAKSHA_D1_DATABASE_ID` | `39ae6e9b-e624-45e0-9d60-f04e0fb814bb` |
| `CYBERSURAKSHA_D1_DATABASE_NAME` | `cybershiksha` |
| `NODE_VERSION` | `22` (the app needs Node 22.13 or newer) |

Dashboard: Workers & Pages → `cybershiksha` → Settings → Builds → Connect → GitHub, then:

- Repository `DipeshK47/cybersuraksha2`, production branch `main`, root directory `/`.
- Build command: `npm ci && npm run build`
- Deploy command: `npx wrangler deploy`
- Turn **off** builds for non-production branches, so working branches such as `remade` do not create preview versions.

Runtime secrets (admin login, demo switch) live on the Worker and are not touched by a deploy. The custom domain stays attached.
The first request after each deploy sets up any new database tables, so there is no migration step.
Roll back from Workers & Pages → `cybershiksha` → Deployments.

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

- PBKDF2-hashed passwords (teachers + students) at a deliberately low work factor
  for the Workers Free plan (see *Password hashing* below); plaintext access codes
  shown once and never stored.
- Opaque, hashed, HttpOnly server sessions for teachers and students.
- Per-teacher tenancy: every student/run/analytics query is scoped to the
  teacher's assigned classes; `school_admin` scoped to their school.
- Invite-based teacher onboarding with one-time hashed tokens; approve/suspend.
- Activity metrics derived server-side from real events (client scores cannot be
  spoofed); all student writes bound to the verified session.
- Zod validation on all mutating endpoints; audit log for account actions;
  security headers + CSP + HSTS.

## 7a. Password hashing on Workers (read before students log in)

Passwords use PBKDF2-HMAC-SHA256 via Web Crypto (`app/lib/password.ts`). The work factor is a trade-off with Cloudflare's limits:

| Iterations | Time here | Fits Free plan (10 ms CPU)? |
|---|---|---|
| 10,000 (**current default**) | ~6 ms | Yes |
| 100,000 (highest Cloudflare is reported to accept) | ~51 ms | No: needs the Paid plan |
| 210,000 (previous value) | ~112 ms | No, and above the reported 100,000 cap |
| 600,000 (OWASP recommendation) | ~317 ms | No |

**10,000 is weak.** It is acceptable only for the current teachers-only pilot, with strong teacher and admin passwords, because a stolen copy of the database could be attacked about 60 times faster than at OWASP's strength. Student access codes are only ~30 bits of randomness, so at this work factor **student accounts must not go live until hashing is strengthened** (below).

Measure the real cost after the first deploy: read the CPU time of a login request in the Cloudflare dashboard. If logins fail with a CPU-limit error (1102) on the Free plan, either move to the Workers Paid plan (about $5/month) or implement the planned design below.

## 7b. Planned security work

**Before students log in**
1. Move to the **Workers Paid plan** and set `CYBERSURAKSHA_PBKDF2_ITERATIONS=100000`. Hashes upgrade on each account's next login. (Or implement client-side stretching, below, which removes the limit.)
2. Fix the audit findings that only matter once student accounts exist: teacher-reset access codes are partly or fully predictable for long roll numbers (`app/api/students/[id]/reset/route.ts`); a student's old session survives a password reset; students can self-report scores (`/api/module-runs`); add per-account lockout.
3. Load-test the marks reports with the largest expected roster.

**Planned design: client-side password stretching (not built yet)**
The browser derives a key from the password with a high work factor (for example 600,000 iterations, 0.3 to 2 s on a phone) and sends only the derived key. The server stores a fast hash of that key (under 1 ms of CPU). Effects:
- No heavy hashing on the Worker, so no Free-plan CPU problem and no 100,000-iteration cap.
- A stolen database still costs an attacker the full 600,000 iterations per guess.
- Closes the login timing leak (use a deterministic fake salt for unknown accounts).
Work involved: a salt-lookup step before login; client-side derivation in the teacher and student login forms; changes to `app/lib/password.ts` and both login routes; migration for existing hashes (re-derive at next login); tests. Roughly a day with testing.

**Other options considered:** Cloudflare Access (Zero Trust SSO, no passwords for teachers; student codes still need hashing) and simply paying for the Paid plan.

## 8. Real-time feed scaling

The teacher live feed (`/api/live`) is Server-Sent Events backed by short DB
polling — appropriate for typical class sizes. For very high fan-out, replace
that single endpoint with a Durable-Object-per-class fanning out over
WebSockets; the client event contract is unchanged.
