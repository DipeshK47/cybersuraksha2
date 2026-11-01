# Ops admin panel — design

Date: 2026-11-01 · Status: approved in brainstorming, pending spec review

## Goal

A company-side ("platform") admin panel for running CyberSuraksha as a product
sold to schools: onboard schools, work the inbound leads, control what each
school has licensed, see usage and contract state, and keep a complete audit
trail. Today there is no role above `school_admin`; new schools can only be
created through the one-time `CYBERSURAKSHA_ADMIN_*` bootstrap, and the
`/register-school` submissions in `school_requests` are unreadable in the app.

## Out of scope (v1)

- Moving off Cloudflare to AWS. That is the next, separate project. The panel
  uses only Drizzle and the existing helpers, so it ports unchanged.
- Payments / invoicing. Contract fields are tracked, money is not.
- Email delivery. Invite and setup links are shown once with a copy button,
  exactly like teacher invites today. Wire email (SES) during the AWS move.
- Hard-deleting a school. Suspend only; a deletion flow (DPDP) comes later.
- Tiers among platform admins. All platform admins have equal rights.
- Auto-locking a school when its contract ends.

## Placement

Same app. UI under `/ops`, API under `/api/ops/*`. Authentication is fully
separate from teacher, student and guardian logins: its own table, its own
session table, its own cookie.

## Data model — migration `0005`

`schools` — add columns:

| column | type | notes |
|---|---|---|
| `status` | text `active\|suspended`, default `active` | suspended blocks every login in the school |
| `plan` | text, nullable | free text, e.g. "Pilot", "Annual 2026-27" |
| `seat_limit` | integer, nullable | max students; null = unlimited |
| `contract_ends_at` | text (ISO date), nullable | flagged only, never enforced |
| `contact_name` | text, nullable | |
| `contact_email` | text, nullable | |
| `notes` | text, nullable | |

`school_requests` (leads) — add columns:

| column | type | notes |
|---|---|---|
| `status` | text `new\|contacted\|converted\|rejected`, default `new` | |
| `school_id` | integer FK → `schools.id`, `on delete set null`, nullable | set on convert |
| `notes` | text, nullable | |

`platform_admins` — new table:

| column | type | notes |
|---|---|---|
| `id` | integer pk | |
| `name` | text | |
| `email` | text, unique | lower-cased |
| `password_hash` | text | PBKDF2 via `app/lib/password.ts`; empty until setup completes |
| `totp_secret` | text, nullable | base32; null until 2FA enrolment completes |
| `status` | text `pending\|active\|suspended`, default `pending` | |
| `setup_token_hash` | text, nullable | SHA-256 of a one-time setup token |
| `setup_expires_at` | integer, nullable | epoch ms, 7 days |
| `last_login_at` | text, nullable | |
| `created_at` | text | |

`platform_sessions` — new table, same shape as `sessions`
(`id`, `admin_id` FK cascade, `token_hash` unique, `expires_at`, `ip`,
`user_agent`, `created_at`) plus `mfa_passed_at` (text, nullable). A session
with null `mfa_passed_at` can only call the TOTP endpoints.

`audit_log` — add `actor_platform_admin_id` (FK → `platform_admins.id`,
`on delete set null`), `ip`, `user_agent`. `writeAudit` gains optional
`actorPlatformAdminId` and `request` (from which ip/user-agent are read);
existing callers are untouched.

## Authentication

- Cookie `cs_ops_session`: `HttpOnly`, `SameSite=Strict`, `Secure` on https,
  `Path=/`, 8 hour TTL. Only the token hash is stored.
- Login: email + password → session with `mfa_passed_at = null` → TOTP code
  → `mfa_passed_at` set. Rate limited with `enforceRateLimit` (login and TOTP:
  5 per minute per IP). Success and failure are both audited
  (`ops.login.success`, `ops.login.failure`, `ops.mfa.failure`).
- TOTP: RFC 6238, SHA-1, 6 digits, 30 s step, ±1 step window, via WebCrypto.
  Enrolment happens during setup: the setup page shows the secret as an
  `otpauth://` URI and plain base32 text; the admin must enter a valid code
  before `totp_secret` is saved and status becomes `active`.
- Bootstrap: when `platform_admins` is empty and `PLATFORM_ADMIN_EMAIL` is set,
  create a `pending` admin and log a one-time setup link to the worker log
  (password and 2FA are chosen on that page, never in env). Mirrors the
  existing `CYBERSURAKSHA_ADMIN_*` bootstrap in `db/academy.ts`.
- Adding a teammate: an active admin creates a `pending` admin → gets a
  one-time setup link (`/ops/setup?token=…`) to hand over. Suspending an
  admin deletes their platform sessions.
- `requirePlatformAdmin(request)` returns the admin or a 401 Response, in the
  same style as `requireTeacher`. Every `/api/ops/*` handler except login,
  TOTP and setup calls it first.

## Enforcement in the existing app

1. **Suspended school.** `getSessionFromCookieHeader` (`app/lib/session.ts`)
   and `getStudentSessionFromCookieHeader` (`app/lib/student-session.ts`) join
   `schools` and return null when `schools.status = 'suspended'`. This covers
   every existing route at once. The teacher and student login routes check
   the school status first and return 403 "Your school's access is paused.
   Contact CyberSuraksha." instead of creating a session.
2. **Licensing.** `PUT /api/admin/school` accepts only `schoolName`; grades
   and subjects in the body are rejected with 403. `SchoolCurriculum` in
   `/teach/admin` renders read-only with "Contact us to change your plan".
   Content gating already reads `school_settings`, so nothing else changes.
3. **Seat limit.** Student creation in `app/api/students/route.ts` (single and
   CSV) counts the school's students; if `count + new > seat_limit` it returns
   409 "Seat limit reached: X of Y seats used." and inserts nothing.
4. **Contract end.** Not enforced. Shown amber within 30 days, red once past.

## API — `/api/ops/*`

| route | methods | purpose |
|---|---|---|
| `auth/login` | POST | email + password → session cookie (MFA pending) |
| `auth/totp` | POST | verify code → session MFA passed |
| `auth/logout` | POST | delete session, clear cookie |
| `auth/setup` | GET, POST | GET validates token, returns the new TOTP secret; POST sets password + confirms code |
| `schools` | GET, POST | list with usage; create school (+ settings + optional lead id to mark converted) |
| `schools/[id]` | GET, PATCH | detail with usage and school admins; update contract fields, licensing, status |
| `schools/[id]/invite` | POST | mint a `school_admin` invite via `createInvite` (inviter null) and return the link once |
| `leads` | GET | list, filter by status |
| `leads/[id]` | PATCH | status, notes |
| `admins` | GET, POST | list; create pending admin → setup link once |
| `admins/[id]` | PATCH | suspend / reactivate |
| `audit` | GET | paginated (50), filter by school id, actor, action prefix |

All bodies validated with zod via `parseJson`. Every write is audited with
before/after values in `metadata`, under `ops.*` action names
(`ops.school.create`, `ops.school.update`, `ops.school.suspend`,
`ops.school.invite`, `ops.lead.update`, `ops.admin.create`,
`ops.admin.suspend`, …).

**Usage per school:** teachers, students, seats used / limit, students active
in the last 30 days (`learning_attempts.last_active_at`). Computed in one
grouped query per metric across all schools for the list, not per row.

**Create school:** name, slug (derived from name, editable, unique), plan, seat
limit, contract end, contact, grades, subjects. Writes `schools` and
`school_settings` in one `db.batch`.

## UI — `/ops`

Client pages in the style of `/teach/admin` (Tailwind, lucide icons,
`readJson`).

- `/ops/login` — email/password, then TOTP step.
- `/ops/setup` — set password, scan/enter TOTP secret, confirm code.
- `/ops` — Schools table: name, status, plan, seats used/limit, contract end
  (amber/red), active 30d. "New school" button.
- `/ops/schools/[id]` — contract form, grade/subject checkboxes, suspend /
  reactivate (confirm dialog naming the school), school admins + "Invite
  school admin" (link shown once, copy button), this school's audit trail.
- `/ops/leads` — inbox with status filter, notes, "Convert" → opens the
  create-school form prefilled from the lead.
- `/ops/team` — platform admins, add (setup link once), suspend.
- `/ops/audit` — the full log, filterable.

## Testing

`tests/ops-backend.test.mjs` on the Miniflare harness from
`tests/school-backend.test.mjs`, added to `test:backend`:

- every `/api/ops/*` route returns 401 without a session, and 401 with a
  session that has not passed TOTP; a teacher session is also 401;
- setup link → password + TOTP → login → TOTP → access;
- wrong TOTP is rejected and audited;
- create school → invite → accept invite → school admin can log in;
- suspend school → that teacher's and student's existing sessions stop
  working and fresh logins get 403; reactivate restores login;
- seat limit returns 409 and inserts nothing;
- school admin `PUT /api/admin/school` with grades/subjects returns 403;
- audit rows exist for each ops write.

TOTP gets one known-answer check against the RFC 6238 test vector.

Then a browser pass over every `/ops` page on the dev server.
