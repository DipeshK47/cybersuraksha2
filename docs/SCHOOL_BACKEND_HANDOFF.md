# School backend handoff

Status: implemented and tested locally. AWS database integration and production deployment are pending. This repository still runs on vinext/Cloudflare Workers with D1/SQLite; supplying an AWS URL alone will not switch the database engine.

## Configure each school

1. Provision its first school administrator with the existing server-side bootstrap environment variables in `.env.example`: `CYBERSURAKSHA_SCHOOL_NAME`, `CYBERSURAKSHA_ADMIN_NAME`, `CYBERSURAKSHA_ADMIN_EMAIL`, and `CYBERSURAKSHA_ADMIN_PASSWORD`. Restart the server and sign in at `/teacher-login`. Use a strong, unique password. Provisioning is idempotent by administrator email; school names are converted to unique login slugs. Use distinct school/campus names. Never enable the demo seed for a client database.
2. Open **Admin → School curriculum**. Select the school's exact grades and subjects. A school can enable Classes 3–11 while another enables Classes 6–12. These settings are administered by trusted school administrators; they are not a platform-controlled commercial licensing system.
3. Create class sections, such as 7A, under **Admin → Classes**. Only enabled grades can be created or receive new student accounts.
4. Invite teachers, share the one-time invite links, and assign their class sections. Ordinary teachers see the content and students for their assigned classes. School administrators manage their own school.
5. Add students in **Roster** and print their login slips. Student login lists actual provisioned schools. The account is identified by school, class name, and roll number, so the same roll number can exist at different schools.
6. Test with a real teacher and student from that school before handover. Confirm the correct school name, class content, assignment delivery, and reports.

There is no university course/semester structure in this delivery. The public school-registration form records an enquiry; it does not automatically approve or provision a school. Initial school provisioning remains an operator task using the bootstrap configuration.

## Content access and coverage

- Student grade comes from the class record, rather than trusting a query string or parsing the class label.
- The dashboard, grade/subject/chapter routes, playable module routes, activity API, module-run API, and subject-practice API enforce content access on the server.
- Student assignments also check current class, school, publication, and enabled curriculum. Disabling content immediately removes current access; stored learning records and teacher historical reports remain available.
- Classes 3–4 share the existing foundation missions used in Classes 6–7. Class 5 shares the intermediate missions used in Class 8. Existing Classes 6–12 retain their chapter identities. This is shared content, not a newly authored ten-grade syllabus.
- Each Class 3–10 cyber library currently has eight assignable mission chapters; Classes 11 and 12 have 32 each. The existing Class 3 English and Class 10 subject libraries are retained. Planned textbook chapters remain planned and must not be marketed as completed lessons.
- School administrators can see all enabled school grades; ordinary teachers need an assigned class for that grade. Students see their own enabled grade.

## Teacher and student workflow

**Teacher → Classroom** provides assignments, students, and a marks record. **Results** opens the new marks view; **Lesson activity** retains the earlier mission-activity dashboard. Roster report links open the comprehensive student learning record. Create a lesson assignment, a custom-question assignment, or a combination. Add a title, instructions, class section, deadline, total marks, and question section/skill tags.

Custom questions support multiple choice (four options in the editor) and written responses. Choice questions are graded on the server using the stored answer key. Written responses await teacher marks and feedback. Student APIs omit answer keys. The author or a school administrator can publish, edit a draft, and grade its submissions. Other teachers assigned to the same class can view its records.

Drafts can be edited. Published question sets are locked to preserve submitted work. Create a new assignment to change a published assessment. Publication snapshots the current class roster; students added later do not automatically receive an earlier assignment. There is no automated email delivery: notifications appear inside the student's assignment inbox.

Students open **Assignments**, complete the lessons and custom questions, and review final answers before submitting. Custom answers can be submitted once; concurrent/replayed requests cannot overwrite the submission. Late submissions are accepted and labelled. Written responses are not given a zero while awaiting grading. Students can reopen their answers and see saved marks and feedback.

Teacher marks/feedback changes are recorded in the audit log. Reports can be printed; assignment and class marks records can be downloaded as CSV. CSV text neutralizes spreadsheet formula injection. Marks records are live rather than frozen term report cards.

## Marks and learning gaps

- Custom-question marks are reserved from the assignment total. The remainder is divided equally across selected lessons. For question-only assignments, the total must equal the question marks.
- Lesson assignments retain the existing rule: the latest completed attempt counts, including work completed before publication. Within that attempt, the first answer to each required exercise determines its practice score. Retry activity remains visible.
- Existing interactive lessons report browser activity results. Their scores and topic insights are explicitly labelled **practice estimates**. They are not tamper-resistant examination marks. Use custom server-graded or teacher-graded questions for authoritative assessments. Converting every game's interaction into a server-validated assessment protocol is separate remaining work if those scores must become formal grades.
- Incomplete work or written responses awaiting grading have no final assignment mark. A recorded zero remains zero.
- **Student learning record** and **My progress** show correct/full-mark responses, wrong or partial answers, topic marks, activity history, and suggested follow-up. The headline response counts include graded custom questions as well as lesson and subject practice. Lesson topic insights use the first response in the newest attempt, preventing retries from hiding a weak section. Custom-question insights use stored grades.
- The reporting heuristic is: fewer than three graded responses → limited evidence; below 60% → needs attention; 60–79% → developing; 80% or more → secure. This is a teaching aid, not a clinical or standardized ability assessment.

## Data and migration

`drizzle/0004_icy_toro.sql` adds school settings, assignment questions, and assignment submissions, and changes student roll uniqueness to `(school_id, class_name, roll_no)`. It preserves existing students, runs, assignments, and grades. Existing assignments receive an empty custom-question set.

The local in-app migrator applies this migration through a D1 transaction. Normal development keeps its database under `.wrangler/`; tests must use disposable state. Back up a client database before applying any production migration.

Schools, teacher/class assignments, student sessions, assignment recipients, and submissions form the access boundary. No new package was added. Runtime declarations in `worker-configuration.d.ts` were generated with the installed Wrangler version; after a binding/runtime change, rebuild and regenerate them with `npx wrangler types worker-configuration.d.ts --config dist/server/wrangler.json --include-env=false`.

## Verification

Use Node.js 22.13 or newer (Node 24 was used for this work):

```sh
npm run typecheck
npm run lint
npm run test:backend
node --test tests/school-migration.test.mjs
npm run build
```

The backend suite executes the real API handlers and SQL migrations in an isolated Miniflare/D1 Worker. It creates two schools with identical class/roll combinations and checks access isolation, draft editing/publication, hidden answer keys, one-time submissions, grading bounds, feedback, marks, progress, and immediate curriculum restrictions.

For live integration and browser checks, start a disposable server:

```sh
STORY_NO_HMR=1 CYBERSURAKSHA_EPHEMERAL_WORKERS=1 npm run dev -- --port 3202
```

In another terminal:

```sh
BASE_URL=http://localhost:3202 node --test tests/authz-e2e.mjs tests/lms-e2e.mjs
BASE_URL=http://localhost:3202 python3 tests/school-portal-e2e.py
```

The browser check requires Python Playwright and local Google Chrome. It exercises draft creation/editing, publication, student answers, teacher grading, feedback, CSV download, mobile layout, and direct-route restrictions. It creates demo assessment data; run it only against a disposable development server. QA screenshots go to ignored `.lms-qa/`.

The full suite produced 177 passes and four existing content/media failures: two checks require external Chapter 8 video-generation source files that are absent here; one expects older fraud-practice wording; one expects dark-theme CSS that is absent from the current stylesheet. The focused backend suite passes 19 checks, and live auth/Classroom integration passes 18 checks. The end-to-end Chrome check passes the complete workflow and mobile assertions. Record those failures separately; passing the focused backend checks is not proof that every legacy content/media check passes.

## AWS — final pending step

Before implementing the connection, confirm the actual database engine/version (for example PostgreSQL or MySQL), whether it is RDS or a database on EC2, the application runtime/hosting target, region, network/TLS requirements, and how credentials will be supplied securely. Do not put passwords in source control or client-side variables.

Then complete the following against a staging instance:

1. Replace the D1-specific driver, SQLite schema/migrations, and dialect-dependent query/transaction behavior for the chosen engine. Main integration points are `db/index.ts`, `db/schema.ts`, `db/migrate.ts`, `db/lms.ts`, and `db/progress.ts`. Keep school/class authorization unchanged.
2. Apply versioned migrations as a controlled deployment step, import only approved school/roster data, and verify row counts and existing marks. Validate backups and restoration on that engine.
3. Re-run isolation, concurrent submission/publication, grading, and browser tests against the actual AWS database/runtime. Check expected school/student load and query limits; the current marks reports load the selected records in memory and need load testing for the client's roster size.
4. Configure HTTPS, secret storage, deployment logging, monitored errors, backups, and trusted proxy headers. The current authentication limiter is per process/isolate; coordinate rate limits if multiple application instances are used.
5. Provision real school accounts, verify client acceptance, and deploy only after the AWS-specific checks pass. Until then, this is a locally verified implementation, not an AWS production deployment.
