# Classroom

- Teachers: `/teach/lms` → Create assignment → choose Class 3–7, an assigned section, chapters, deadline, marks → Save draft or Publish.
- Students: the Assignments section at `/learn/assignments`, linked from dashboard navigation and its assignment/deadline panel. Each card shows deadlines, marks and completion, visible chapter links, and a direct Start / Continue / Review action.
- The picker uses the same 24 current story chapters as the class library: eight per class, two in each topic. Older prototypes are excluded from new assignments on both client and server. Existing assignments keep their original routes.
- Changing class clears selected chapters and the search. Sections remain scoped to teacher permissions. Teachers can browse all five class libraries; saving requires an assigned section and publishing requires enrolled students.
- Publishing snapshots the current class roster. Drafts never appear in student inboxes.
- All class-assigned teachers can view that class's assignments and student records. School admins see their own school; student writes use the verified session identity.
- Already completed chapters count, including work completed before publication.
- Grades use the latest **completed** attempt per chapter, weighted equally. A later incomplete attempt does not erase a completed grade. Late completion is labelled.
- A chapter's first practice answers determine its score. Corrections remain visible. Story feedback, mistakes, and story completion are recorded separately from assignment marks.
- Chapter percentages retain precision; awarded marks are rounded to two decimals after weighting. Missing required exercise results are ungraded.
- Reports include all preserved chapter attempts, question outcomes, topics, feedback, timestamps, hints, and existing server-graded subject practice answers.
- Earlier saved run summaries are imported by migration `0003_aspiring_hiroim`; detailed question history cannot be reconstructed for those old summaries.
- New events are retained in the device outbox until acknowledged, retried online, and idempotent on the server. Exercise outcomes originate in the interactive lesson; mathematics-bank answers are graded from the server's question bank.
- The database migration runs through the existing in-app migrator. No manual data reset is needed.

## Verification

Use Node 22.13 or newer. Run browser/API tests against a disposable local database:

```sh
CYBERSURAKSHA_EPHEMERAL_WORKERS=1 vinext dev --port 3201 --hostname 127.0.0.1
node --test tests/lms-summary.test.mjs
BASE_URL=http://127.0.0.1:3201 node --test tests/lms-e2e.mjs
LMS_QA_BASE=http://127.0.0.1:3201 node scripts/lms-browser-qa.cjs
```

The integration checks create test assignments/accounts; do not run them against a school's database. No external publishing is part of these commands.

## Class selector and student access verification — 29 September 2026

- Production build passed.
- Grade/score unit checks passed (5 tests). API integration passed: exact 24-chapter catalogue, eight chapters for each Class 3–7, two per topic, wrong-band and prototype rejection, publication, prior completion, latest scores, history and access scope.
- Browser flow passed: all five dropdown options, grade-specific chapter names, selection/search resets, publication, dashboard assignment section, visible inbox chapter links and deadlines, direct Start/Continue access, real exercise completion, read notifications, recorded grades, resume and teacher reports. Layouts checked at 390, 768 and 1440px where applicable, with no page errors.
- Previews use disposable QA assignments: [teacher picker](previews/classroom/teacher-assignment-picker.png), [student assignments](previews/classroom/student-assignments.png). Repeated assignment titles in the student image are test fixtures.
- A standalone TypeScript check still reports the existing missing Cloudflare worker/D1 declarations and Vite import-option errors. There were no errors in the changed files.
