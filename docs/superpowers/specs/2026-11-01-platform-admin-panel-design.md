# Platform admin panel — design

Date: 2026-11-01 · Status: approved in brainstorming (revised the same day)

## Goal

A company-side ("platform") admin panel for running CyberSuraksha as a product
sold to schools: onboard schools, work inbound leads, control exactly what
each school can use, enforce contracted limits, manage a school's users, see
usage and contract state, and keep a complete audit trail. Today there is no
role above `school_admin`; new schools can only be created through the
one-time `CYBERSURAKSHA_ADMIN_*` bootstrap, the `/register-school` leads in
`school_requests` are unreadable in the app, and a school admin can enable
every grade and subject for their own school.

## Placement

- Hosted on the same app and domain: **`https://cybershiksha.eevsec.com/admins`**.
- UI under `/admins`, API under `/api/platform/*` (distinct from the existing
  school-admin `/api/admin/*`).
- Nothing in the teacher or student UI links to it. It has its own login,
  table, sessions and cookie; a teacher session never grants access.
- `/admins` and `/api/platform` responses carry `X-Robots-Tag: noindex, nofollow`.

## Out of scope (v1)

- Moving off Cloudflare to AWS (next project; the panel only uses Drizzle and
  existing helpers, so it ports unchanged).
- Payments / invoicing. Contract fields are tracked, money is not.
- Email delivery. Invite and setup links are shown once with a copy button.
- Hard-deleting a school. Suspend only; a DPDP deletion flow comes later.
- Tiers among platform admins. All platform admins have equal rights.
- Auto-locking a school when its contract ends.
- QR codes for 2FA enrolment (the secret and an `otpauth://` link are shown;
  every authenticator app accepts manual entry).

## Data model — migration `0005_platform_admin`

`schools` — add: `status` (`active|suspended`, default `active`), `plan`,
`seat_limit`, `teacher_limit`, `class_limit` (integers, null = unlimited),
`contract_ends_at` (ISO date), `contact_name`, `contact_email`, `notes`.

`school_settings` — add: `hidden_modules` (JSON array of module ids, default
`[]`), `features` (JSON object, default `{}`; missing keys mean on).

`school_requests` (leads) — add: `status`
(`new|contacted|converted|rejected`, default `new`), `school_id` (FK →
schools, set null), `notes`.

`platform_admins` — new: `name`, `email` (unique), `password_hash` (default
`''` until setup), `totp_secret` (null until enrolment), `totp_last_step`
(default 0, replay guard), `status` (`pending|active|suspended`),
`setup_token_hash` (unique, nullable), `setup_expires_at`, `last_login_at`,
`created_at`.

`platform_sessions` — new: same shape as `sessions` with `admin_id`, plus
`mfa_passed_at` (null until the TOTP step passes).

`audit_log` — add: `actor_platform_admin_id` (FK, set null), `ip`,
`user_agent`.

## Authentication

- Cookie `cybersuraksha_platform_session`: `HttpOnly`, `SameSite=Strict`,
  `Secure` on https, `Path=/`, 8 h TTL; only the token hash is stored.
- Login = password step (creates a session with `mfa_passed_at` null) then a
  TOTP step (marks it). A session without MFA can only call the TOTP endpoint.
- TOTP: RFC 6238, SHA-1, 6 digits, 30 s, ±1 step. The accepted step is stored
  and any step ≤ it is refused, so a code cannot be replayed.
- Rate limits per IP: login 5/min, TOTP 5/min (also 5 per session per 5 min),
  setup 5/min. Login success, login failure and TOTP failure are all audited.
- Setup links (`/admins/setup?token=…`, 7 days, one-time) set name, password
  (min 12 chars) and enrol 2FA. Used for the first admin, new teammates, and
  resetting a teammate who lost their phone.
- Bootstrap: while no `active` platform admin exists and `PLATFORM_ADMIN_EMAIL`
  is set, a login attempt creates that admin as `pending` (if missing) and, if
  it has no live setup link, issues one and writes it to the worker log
  (`npx wrangler tail`). No password ever lives in env.

## Per-school controls

1. **Licensing**: grades (3–12) and subjects. Only the platform can change
   them; `PUT /api/admin/school` now accepts only `schoolName` and answers 403
   if grades or subjects are sent. The school-admin curriculum card becomes
   read-only.
2. **Hidden chapters**: any playable module can be hidden per school. Enforced
   in `permitsModule` (the one check every content route uses) and in the
   grade, subject and dashboard listings. Records are kept.
3. **Feature toggles** (default on): `chat` (Shiksha Guide, Groq-billed),
   `live` (live class feed), `lms` (assignments: create, publish, grade,
   student inbox and submissions, marks), `hindi` (language toggle). Server
   enforced with a 403 for chat, live and lms; `hindi` hides the toggle (the
   catalogue is a public static file, so this is a product control, not a
   security boundary).
4. **Limits**: students (`seat_limit`), teachers (`teacher_limit`, counting
   non-suspended teachers plus pending unexpired invites), classes
   (`class_limit`). Exceeding one returns 409 "Limit reached: X of Y … used".
5. **Suspend school**: every teacher and student session in it stops working
   immediately (checked in the shared session resolvers) and new logins get
   403 "Your school's access is paused. Contact CyberSuraksha."
6. **School users**: list a school's teachers, suspend/reactivate one (their
   sessions are deleted), sign everyone in the school out, issue a new
   school-admin invite.
7. **Contract end**: shown amber within 30 days, red once past. Not enforced.

## API — `/api/platform/*`

| route | methods | purpose |
|---|---|---|
| `auth/login` | POST | password step |
| `auth/totp` | POST | second factor |
| `auth/logout` | POST | end session |
| `auth/me` | GET | current admin |
| `auth/setup` | GET, POST | validate link + new secret; set password and confirm 2FA |
| `schools` | GET, POST | list with usage; create (optionally converting a lead) |
| `schools/[id]` | GET, PATCH | detail (licensing, usage, teachers, invites, chapter catalog); update contract, limits, status, licensing, hidden chapters, features |
| `schools/[id]/invite` | POST | `school_admin` invite link, shown once |
| `schools/[id]/teachers/[teacherId]` | PATCH | suspend / reactivate a teacher |
| `schools/[id]/logout-all` | POST | delete every session in the school |
| `leads`, `leads/[id]` | GET, PATCH | inbox; status and notes |
| `admins`, `admins/[id]` | GET, POST, PATCH | team; add (setup link); suspend, reactivate, reset |
| `audit` | GET | 50 per page, filter by school, action prefix, cursor |

Plus `GET /api/features` for the signed-in teacher or student (used by the
language toggle).

Every write is zod-validated and audited (`platform.*` actions) with
before/after values, actor, IP and user agent. School-scoped actions use
`targetType: "school"` so the school's trail shows them next to its own
admins' actions.

## UI — `/admins`

`/admins/login`, `/admins/setup`, `/admins` (schools table with flags + new
school form, prefillable from a lead), `/admins/schools/[id]` (contract and
limits, licensing, features, hidden chapters, status, users, invite, sign
everyone out, audit trail), `/admins/leads`, `/admins/team`, `/admins/audit`.
Client pages in the existing teacher-console styling. The worker redirects
`/admins/*` page loads without the platform cookie to `/admins/login`.

## Testing

`tests/totp.test.mjs` (RFC 6238 vectors, drift window, replay) and
`tests/platform-admin.test.mjs` on the Miniflare harness: bootstrap, setup,
two-factor login and replay refusal, every route 401 for anonymous and
teacher callers, lead → school → invite → school admin, all three limits,
licensing lockdown, hidden chapter and feature toggles, suspension, user
controls, team, and audit rows. The existing school-backend curriculum test is
updated to set licensing in the database. Then a browser pass over `/admins`.
