import { sql } from "drizzle-orm";
import {
  index,
  integer,
  real,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

/**
 * Schools are the top-level tenant boundary. Every teacher, class, and student
 * belongs to exactly one school. Cross-school data access is never allowed.
 */
export const schools = sqliteTable(
  "schools",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [uniqueIndex("schools_slug_idx").on(table.slug)],
);

/**
 * Teacher / school-admin identities. Passwords are stored only as PBKDF2
 * hashes (see db/../app/lib/password.ts). `status` gates login:
 *   pending   -> created but not yet approved / invite not accepted
 *   active    -> may log in and access assigned classes
 *   suspended -> blocked
 */
export const teachers = sqliteTable(
  "teachers",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    schoolId: integer("school_id")
      .notNull()
      .references(() => schools.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    role: text("role", { enum: ["teacher", "school_admin"] })
      .notNull()
      .default("teacher"),
    status: text("status", { enum: ["pending", "active", "suspended"] })
      .notNull()
      .default("pending"),
    emailVerifiedAt: text("email_verified_at"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [uniqueIndex("teachers_email_idx").on(table.email)],
);

/**
 * Opaque server-side sessions. The cookie holds a random token; only the
 * SHA-256 hash of that token is stored here, so a database leak cannot be
 * replayed as a valid cookie. Expiry is an epoch-millisecond integer.
 */
export const sessions = sqliteTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    teacherId: integer("teacher_id")
      .notNull()
      .references(() => teachers.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull(),
    expiresAt: integer("expires_at").notNull(),
    ip: text("ip"),
    userAgent: text("user_agent"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("sessions_token_hash_idx").on(table.tokenHash),
    index("sessions_teacher_idx").on(table.teacherId),
  ],
);

/**
 * Opaque server-side sessions for students, mirroring `sessions` for teachers.
 * A separate table keeps the FK/scoping simple: student runs and activity are
 * bound to the session's studentId, never a client-supplied id.
 */
export const studentSessions = sqliteTable(
  "student_sessions",
  {
    id: text("id").primaryKey(),
    studentId: integer("student_id")
      .notNull()
      .references(() => students.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull(),
    expiresAt: integer("expires_at").notNull(),
    ip: text("ip"),
    userAgent: text("user_agent"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("student_sessions_token_hash_idx").on(table.tokenHash),
    index("student_sessions_student_idx").on(table.studentId),
  ],
);

/**
 * A real class entity (e.g. grade 7, section A -> "7A"). Authorization is
 * scoped through this table rather than the loose class_name string.
 */
export const classes = sqliteTable(
  "classes",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    schoolId: integer("school_id")
      .notNull()
      .references(() => schools.id, { onDelete: "cascade" }),
    grade: integer("grade").notNull(),
    section: text("section").notNull().default(""),
    name: text("name").notNull(),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [uniqueIndex("classes_school_name_idx").on(table.schoolId, table.name)],
);

/**
 * The authorization spine: which teacher may access which class. Every
 * teacher-facing query filters students/runs by the classes joined here.
 */
export const teacherClasses = sqliteTable(
  "teacher_classes",
  {
    teacherId: integer("teacher_id")
      .notNull()
      .references(() => teachers.id, { onDelete: "cascade" }),
    classId: integer("class_id")
      .notNull()
      .references(() => classes.id, { onDelete: "cascade" }),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("teacher_classes_pair_idx").on(table.teacherId, table.classId),
    index("teacher_classes_class_idx").on(table.classId),
  ],
);

/**
 * Pending teacher invitations. A school_admin issues an invite bound to an
 * email + school + role; the teacher accepts via a one-time hashed token to
 * set their password. This is the approved-onboarding path.
 */
export const invites = sqliteTable(
  "invites",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    schoolId: integer("school_id")
      .notNull()
      .references(() => schools.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    role: text("role", { enum: ["teacher", "school_admin"] })
      .notNull()
      .default("teacher"),
    tokenHash: text("token_hash").notNull(),
    invitedByTeacherId: integer("invited_by_teacher_id").references(
      () => teachers.id,
      { onDelete: "set null" },
    ),
    expiresAt: integer("expires_at").notNull(),
    acceptedAt: text("accepted_at"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("invites_token_hash_idx").on(table.tokenHash),
    index("invites_email_idx").on(table.email),
  ],
);

export const students = sqliteTable(
  "students",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    schoolId: integer("school_id").references(() => schools.id, {
      onDelete: "cascade",
    }),
    classId: integer("class_id").references(() => classes.id, {
      onDelete: "set null",
    }),
    className: text("class_name").notNull(),
    rollNo: text("roll_no").notNull(),
    name: text("name").notNull(),
    // PBKDF2 hash of the student's access code. The plaintext code is shown to
    // the teacher only once (on the printed slip) and never stored.
    passwordHash: text("password_hash").notNull(),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("students_class_roll_idx").on(table.className, table.rollNo),
    index("students_class_id_idx").on(table.classId),
  ],
);

export const runs = sqliteTable(
  "runs",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    studentId: integer("student_id")
      .notNull()
      .references(() => students.id, { onDelete: "cascade" }),
    moduleId: text("module_id").notNull(),
    moduleTitle: text("module_title").notNull(),
    rank: text("rank").notNull(),
    leaks: integer("leaks").notNull().default(0),
    drill: integer("drill").notNull().default(0),
    recall: integer("recall").notNull().default(0),
    path: text("path").notNull().default("careful"),
    durationSeconds: integer("duration_seconds").notNull().default(0),
    startedAt: text("started_at"),
    status: text("status", { enum: ["in_progress", "completed"] })
      .notNull()
      .default("completed"),
    completedAt: text("completed_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("runs_student_module_idx").on(table.studentId, table.moduleId),
    index("runs_student_idx").on(table.studentId),
  ],
);

/**
 * Fine-grained activity stream. Every meaningful in-module event is appended
 * here in real time; server-side analytics (drill/recall/hint-dependency/
 * mistake patterns) are derived from these rows rather than trusting a
 * client-reported score.
 */
export const activityEvents = sqliteTable(
  "activity_events",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    studentId: integer("student_id")
      .notNull()
      .references(() => students.id, { onDelete: "cascade" }),
    runId: integer("run_id").references(() => runs.id, { onDelete: "cascade" }),
    moduleId: text("module_id").notNull(),
    type: text("type").notNull(),
    payload: text("payload"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("activity_student_idx").on(table.studentId),
    index("activity_run_idx").on(table.runId),
  ],
);

/** Audit trail for teacher-initiated account actions. */
export const auditLog = sqliteTable(
  "audit_log",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    actorTeacherId: integer("actor_teacher_id").references(() => teachers.id, {
      onDelete: "set null",
    }),
    action: text("action").notNull(),
    targetType: text("target_type").notNull(),
    targetId: text("target_id"),
    metadata: text("metadata"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [index("audit_actor_idx").on(table.actorTeacherId)],
);

export const schoolRequests = sqliteTable("school_requests", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  schoolName: text("school_name").notNull(),
  contactName: text("contact_name").notNull(),
  contactEmail: text("contact_email").notNull(),
  studentCount: integer("student_count"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});


/* ══════════════════════════════════════════════════════════════════════════
   ASSESSMENT
   Marks are computed from the practice questions in the app: one shot per
   question, full marks for a correct answer and zero for a wrong one.

   The question BANK deliberately stays in code (the topic-panel files), where
   it is version controlled and reviewed. Only stable question ids are recorded
   here, together with the marks that were available at the time — so an old
   attempt still reports correctly if a question is later reworded or retired.
   ══════════════════════════════════════════════════════════════════════════ */

/**
 * The atomic fact. Everything a teacher, parent or report sees is derived from
 * these rows, never from a client-reported score.
 *
 * UNIQUE(student, question) is the one-shot rule expressed in the database, so
 * a replayed or racing request cannot award marks twice.
 */
export const questionAttempts = sqliteTable(
  "question_attempts",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    studentId: integer("student_id")
      .notNull()
      .references(() => students.id, { onDelete: "cascade" }),
    questionId: text("question_id").notNull(),
    subject: text("subject").notNull(),
    chapterSlug: text("chapter_slug").notNull(),
    topicSlug: text("topic_slug").notNull(),
    chosen: text("chosen").notNull(),
    isCorrect: integer("is_correct").notNull(),
    marksAwarded: real("marks_awarded").notNull().default(0),
    marksPossible: real("marks_possible").notNull().default(1),
    /** Milliseconds from question shown to answer submitted. */
    timeTakenMs: integer("time_taken_ms"),
    hintsUsed: integer("hints_used").notNull().default(0),
    answeredAt: text("answered_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("attempt_student_question_idx").on(table.studentId, table.questionId),
    index("attempt_student_topic_idx").on(table.studentId, table.chapterSlug, table.topicSlug),
    // class-wide "which question does everyone fail" analytics
    index("attempt_question_idx").on(table.questionId),
    index("attempt_answered_at_idx").on(table.answeredAt),
  ],
);

/**
 * Per-topic rollup, maintained as attempts land.
 *
 * Reports read THIS, never the raw attempts: a report card for 1000 students
 * must not fan out into a million-row scan, and D1 processes one query at a
 * time so a slow report would block every other request.
 */
export const topicProgress = sqliteTable(
  "topic_progress",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    studentId: integer("student_id")
      .notNull()
      .references(() => students.id, { onDelete: "cascade" }),
    subject: text("subject").notNull(),
    chapterSlug: text("chapter_slug").notNull(),
    topicSlug: text("topic_slug").notNull(),
    questionsTotal: integer("questions_total").notNull().default(0),
    questionsAttempted: integer("questions_attempted").notNull().default(0),
    questionsCorrect: integer("questions_correct").notNull().default(0),
    marksAwarded: real("marks_awarded").notNull().default(0),
    marksPossible: real("marks_possible").notNull().default(0),
    /** Lesson engagement, so "did not watch" is distinguishable from "failed". */
    videoSecondsWatched: integer("video_seconds_watched").notNull().default(0),
    recapCompleted: integer("recap_completed").notNull().default(0),
    examplesViewed: integer("examples_viewed").notNull().default(0),
    firstSeenAt: text("first_seen_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    lastActiveAt: text("last_active_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    completedAt: text("completed_at"),
  },
  (table) => [
    uniqueIndex("topic_progress_unique_idx")
      .on(table.studentId, table.subject, table.chapterSlug, table.topicSlug),
    index("topic_progress_student_idx").on(table.studentId),
    index("topic_progress_chapter_idx").on(table.chapterSlug, table.topicSlug),
  ],
);

/** Chapter rollup. Same shape one level up, so a chapter report is one row. */
export const chapterProgress = sqliteTable(
  "chapter_progress",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    studentId: integer("student_id")
      .notNull()
      .references(() => students.id, { onDelete: "cascade" }),
    subject: text("subject").notNull(),
    chapterSlug: text("chapter_slug").notNull(),
    topicsTotal: integer("topics_total").notNull().default(0),
    topicsCompleted: integer("topics_completed").notNull().default(0),
    marksAwarded: real("marks_awarded").notNull().default(0),
    marksPossible: real("marks_possible").notNull().default(0),
    lastActiveAt: text("last_active_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    completedAt: text("completed_at"),
  },
  (table) => [
    uniqueIndex("chapter_progress_unique_idx")
      .on(table.studentId, table.subject, table.chapterSlug),
    index("chapter_progress_student_idx").on(table.studentId),
  ],
);

/**
 * A published report card, stored as a FROZEN snapshot.
 *
 * The payload is the rendered figures at issue time, not a live query. A report
 * handed to a parent must never silently change because the student answered
 * another question, or because a question was later reworded.
 */
export const reportCards = sqliteTable(
  "report_cards",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    studentId: integer("student_id")
      .notNull()
      .references(() => students.id, { onDelete: "cascade" }),
    /** Free-form so a school can use "Term 1", "Mid-year", "2026-27 Final". */
    term: text("term").notNull(),
    payload: text("payload").notNull(),
    marksAwarded: real("marks_awarded").notNull().default(0),
    marksPossible: real("marks_possible").notNull().default(0),
    issuedByTeacherId: integer("issued_by_teacher_id").references(() => teachers.id, {
      onDelete: "set null",
    }),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    /** Null until a teacher publishes it; guardians only ever see published rows. */
    publishedAt: text("published_at"),
  },
  (table) => [
    uniqueIndex("report_student_term_idx").on(table.studentId, table.term),
    index("report_student_idx").on(table.studentId),
  ],
);

/* ══════════════════════════════════════════════════════════════════════════
   GUARDIANS
   A parent is a separate identity from a teacher, with no class-wide access:
   they may read published reports and progress for their OWN children only.
   ══════════════════════════════════════════════════════════════════════════ */

export const guardians = sqliteTable(
  "guardians",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    schoolId: integer("school_id")
      .notNull()
      .references(() => schools.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    status: text("status", { enum: ["pending", "active", "suspended"] })
      .notNull()
      .default("pending"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [uniqueIndex("guardians_email_idx").on(table.email)],
);

/**
 * The authorization spine for parents, mirroring teacher_classes. Every
 * guardian-facing query joins through here; a guardian with no row for a
 * student can never read that student, which is the rule that stops one parent
 * seeing another family's child.
 */
export const guardianStudents = sqliteTable(
  "guardian_students",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    guardianId: integer("guardian_id")
      .notNull()
      .references(() => guardians.id, { onDelete: "cascade" }),
    studentId: integer("student_id")
      .notNull()
      .references(() => students.id, { onDelete: "cascade" }),
    relationship: text("relationship"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("guardian_student_idx").on(table.guardianId, table.studentId),
    index("guardian_students_student_idx").on(table.studentId),
  ],
);

/** Opaque guardian sessions; same hashed-token design as teachers and students. */
export const guardianSessions = sqliteTable(
  "guardian_sessions",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    guardianId: integer("guardian_id")
      .notNull()
      .references(() => guardians.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull(),
    expiresAt: integer("expires_at").notNull(),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("guardian_sessions_token_idx").on(table.tokenHash),
    index("guardian_sessions_guardian_idx").on(table.guardianId),
  ],
);
