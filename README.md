# CyberSuraksha

CyberSuraksha is a local learning academy for Computational Thinking and
Artificial Intelligence for Classes 3 to 10. The current playable Class 3
modules include:

- Secret Message Rescue
- Toy Workshop
- Double Century Vault
- Nani Maa's Vacation Challenge

The modules combine concept explanations, animations, handbook questions,
extra practice, progressive hints, mistake-teaching popups, local progress
tracking, teacher reports, and the Groq-enabled Suraksha Guide.

## 1. Requirements

Install these before starting:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) 22.13 or newer
- npm, which is included with Node.js

Check the installed versions:

```bash
git --version
node --version
npm --version
```

The `node --version` result must be `v22.13.0` or newer.

## 2. Clone the repository

```bash
git clone https://github.com/DipeshK47/CyberSuraksha.git
cd CyberSuraksha/cybersuraksha
```

If the repository is already cloned, update it before starting work:

```bash
cd CyberSuraksha
git pull origin main
cd cybersuraksha
```

Run all project commands from the `cybersuraksha` directory.

## 3. Install dependencies

Use `npm ci` for a clean, reproducible installation:

```bash
npm ci
```

Use `npm install` instead only when intentionally adding or updating a
dependency.

## 4. Configure Suraksha Guide

Copy the safe environment template:

```bash
cp .env.example .env.local
```

The app works without an API key. In that mode, Suraksha Guide searches the
committed local student-handbook index.

To enable Groq answers, add a valid server-side key to `.env.local`:

```dotenv
GROQ_API_KEY=your_groq_key_here
GROQ_MODEL=llama-3.3-70b-versatile
GROQ_WEB_MODEL=groq/compound-mini
```

Important:

- Never put the Groq key in frontend code.
- Never commit `.env.local`.
- Never send a real key in chat, screenshots, issues, or pull requests.

## 5. Start the local development server

```bash
npm run dev
```

Open the `Local` URL printed in the terminal. It is normally:

```text
http://localhost:3000
```

If port 3000 is occupied, Vite will use the next available port, such as:

```text
http://localhost:3001
```

Keep the terminal running while using the academy. Press `Control+C` in that
terminal to stop the server.

## 6. Demo logins

### Teacher

- Page: `/teacher-login`
- Email: `teacher@dpsrkp.edu.in`
- Password: `Teacher@123`

### Student

- Page: `/student-login`
- School: Delhi Public School, R.K. Puram
- Class: `7A`
- Roll number: `20`
- Password: `DPS20SAFE`

These are local demo credentials. They are not production accounts, and they
are **only seeded in development** — see "Demo data vs real data" below.

### School admin console

The demo teacher account is a `school_admin`. Sign in and open **Admin** in the
teacher navigation (`/teach/admin`) to invite teachers, approve or suspend
accounts, create classes, and choose which classes each teacher can see. An
invite produces a one-time `/accept-invite?token=…` link, shown once.

### Demo data vs real data

`db/academy.ts` seeds an empty database one of two ways:

- **Demo** (default in development) — the school, classes, demo admin, and
  sample students above. Skipped in a production build unless
  `CYBERSURAKSHA_DEMO_SEED=1` is set deliberately.
- **Real** — set `CYBERSURAKSHA_ADMIN_EMAIL` and `CYBERSURAKSHA_ADMIN_PASSWORD` (plus
  optional `CYBERSURAKSHA_ADMIN_NAME` / `CYBERSURAKSHA_SCHOOL_NAME`) and that single
  school admin is provisioned instead. No demo password is ever created. Build
  the rest of the roster through the admin console.

## 7. Local database

The project uses a local Cloudflare Miniflare emulator with a
SQLite-compatible D1 binding.

- No Cloudflare login is required for local development.
- Local database state is stored under `.wrangler/`.
- Demo students and sample runs are seeded automatically on first use.
- `.wrangler/` is ignored by Git, so each teammate has an independent local
  database.

If the local data becomes inconsistent, stop the development server, remove
the `.wrangler` directory, and start the server again. The demo data will be
seeded again.

## 8. Validation commands

Run these before committing changes:

```bash
npm run lint
node --test tests/*.test.mjs
npm run build
```

The standard package test runs the production build and core rendered-page
test:

```bash
npm test
```

### Browser interaction tests

Start the development server in one terminal. In a second terminal, run:

```bash
BASE_URL=http://localhost:3000 node tests/mistake-feedback-e2e.mjs
TOY_AUDIT_URL=http://localhost:3000 node tests/toy-workshop-e2e.mjs
```

Replace `3000` with the actual local port when necessary.

The browser tests require a locally installed Chromium-compatible browser.
The Toy Workshop test currently uses Google Chrome on macOS.

## 9. Handbook search index

The generated student-safe handbook search index is already committed at:

```text
app/data/handbook-chat-index.json
```

A fresh clone does not need the raw handbook PDFs to run Suraksha Guide.

Only rebuild the index when the handbook corpus has been re-extracted locally:

```bash
npm run handbooks:index
```

That command expects the local extracted corpus and chapter index under
`../output/handbook-analysis/`. Those source files are intentionally not
committed to the public repository.

## 10. Important project locations

```text
app/module/                         Interactive learning modules
app/components/learning/            Shared teaching, hint, and popup components
app/components/HandbookChatbot.tsx  Suraksha Guide interface
app/api/chat/route.ts               Teacher data and Groq chat API
app/data/module-registry.ts         Playable module registration
app/data/handbook-chat-index.json   Local handbook search data
db/                                 D1 schema, queries, and demo seed data
public/handbook/                    Handbook-derived local visual assets
tests/                              Static, integration, browser, and visual tests
```

Register each completed interactive module in
`app/data/module-registry.ts`. This makes it available through academy
navigation and progress tracking.

## 11. Team workflow

Before starting:

```bash
git checkout main
git pull origin main
git checkout -b feature/short-description
```

After making and testing changes:

```bash
git status
git add .
git commit -m "Describe the completed change"
git push -u origin feature/short-description
```

Then open a pull request into `master`.

Do not commit:

- `.env.local` or any API keys
- `node_modules/`
- `.wrangler/`
- `.vinext/` or `dist/`
- `.playwright-cli/`
- temporary PDF extraction files
- generated screenshots and audit output

## 12. Common problems

### The app reports an unsupported Node version

Install or switch to Node.js 22.13 or newer, then run `npm ci` again.

### Port 3000 is already in use

Use the different local URL printed by Vite. Do not assume the port is always
3000.

### Suraksha Guide says Groq is not configured

Confirm `.env.local` exists, `GROQ_API_KEY` has a valid key, and the development
server was restarted after editing the environment file. The local handbook
fallback still works without Groq.

### Login or report data looks different on another computer

Each teammate has a separate local D1 database. The app seeds the same demo
students, but locally completed module runs are not shared through Git.

### Changes do not appear

Stop the development server, run `npm ci`, and start `npm run dev` again.
Also confirm that the browser is using the port printed in the terminal.

## Project rule

Keep implementation, previews, builds, and tests local. Do not deploy or
host the application unless Dipesh explicitly changes this instruction.
