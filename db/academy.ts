import { asc, eq, inArray, sql } from "drizzle-orm";
import { getDb } from ".";
import { ensureMigrated } from "./migrate";
import { classes, runs, schools, students, teachers } from "./schema";
import { hashPassword } from "../app/lib/password";

/**
 * Database bootstrap for an empty database. Two mutually exclusive paths:
 *
 *   Demo    — one school, its classes, a well-known school-admin, and sample
 *             students/runs so the dashboards are explorable. Development only.
 *   Real    — a single school_admin provisioned from environment variables,
 *             for an actual deployment. No demo password ever exists.
 *
 * The demo path is OFF in a production build unless CYBERSURAKSHA_DEMO_SEED=1 is
 * set deliberately, so `Teacher@123` cannot be created against real data.
 */

const DEMO_SCHOOL = {
  name: "Delhi Public School, R.K. Puram",
  slug: "dps-rkp",
};

// Well-known development account. Never created in production — see demoSeedAllowed().
const DEMO_ADMIN = {
  name: "Ananya Sharma",
  email: "teacher@dpsrkp.edu.in",
  password: "Teacher@123",
  role: "school_admin" as const,
};

function demoSeedAllowed(): boolean {
  if (process.env.CYBERSURAKSHA_DEMO_SEED === "1") return true;
  return process.env.NODE_ENV !== "production";
}

/** Production bootstrap credentials, when fully configured. */
function realAdminFromEnv() {
  const email = process.env.CYBERSURAKSHA_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.CYBERSURAKSHA_ADMIN_PASSWORD;
  if (!email || !password) return null;
  return {
    email,
    password,
    name: process.env.CYBERSURAKSHA_ADMIN_NAME?.trim() || "School Admin",
    schoolName: process.env.CYBERSURAKSHA_SCHOOL_NAME?.trim() || "CyberSuraksha School",
  };
}

function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) || "school"
  );
}

const seedStudents = [
  { className: "7A", rollNo: "20", name: "Aarav Mehta", accessCode: "DPS20SAFE" },
  { className: "7A", rollNo: "21", name: "Diya Sharma", accessCode: "DPS21SAFE" },
  { className: "7A", rollNo: "22", name: "Kabir Singh", accessCode: "DPS22SAFE" },
  { className: "7A", rollNo: "23", name: "Navya Gupta", accessCode: "DPS23SAFE" },
  { className: "7A", rollNo: "24", name: "Riya Joshi", accessCode: "DPS24SAFE" },
  { className: "8B", rollNo: "31", name: "Ananya Iyer", accessCode: "DPS31SAFE" },
  { className: "8B", rollNo: "32", name: "Vivaan Verma", accessCode: "DPS32SAFE" },
  { className: "8B", rollNo: "33", name: "Meher Reddy", accessCode: "DPS33SAFE" },
  { className: "8B", rollNo: "34", name: "Ishaan Gupta", accessCode: "DPS34SAFE" },
];

const seedRuns = [
  { rollNo: "20", moduleId: "a1", rank: "GHOST", leaks: 0, drill: 90, recall: 83, path: "careful", durationSeconds: 594 },
  { rollNo: "21", moduleId: "a1", rank: "GUARDED", leaks: 1, drill: 80, recall: 100, path: "careful", durationSeconds: 548 },
  { rollNo: "22", moduleId: "a1", rank: "GHOST", leaks: 0, drill: 100, recall: 100, path: "careful", durationSeconds: 650 },
  { rollNo: "23", moduleId: "a1", rank: "LEAKY", leaks: 3, drill: 40, recall: 50, path: "overshare", durationSeconds: 274 },
  { rollNo: "24", moduleId: "a1", rank: "GHOST", leaks: 1, drill: 90, recall: 83, path: "careful", durationSeconds: 663 },
  { rollNo: "31", moduleId: "a1", rank: "GUARDED", leaks: 1, drill: 80, recall: 84, path: "careful", durationSeconds: 505 },
  { rollNo: "32", moduleId: "a1", rank: "GHOST", leaks: 0, drill: 90, recall: 92, path: "careful", durationSeconds: 615 },
  { rollNo: "33", moduleId: "a1", rank: "GUARDED", leaks: 2, drill: 70, recall: 75, path: "careful", durationSeconds: 480 },
];

/** Public-safe student shape — never includes the password hash. */
export type SafeStudent = {
  id: number;
  schoolId: number | null;
  classId: number | null;
  className: string;
  rollNo: string;
  name: string;
};

const safeStudentColumns = {
  id: students.id,
  schoolId: students.schoolId,
  classId: students.classId,
  className: students.className,
  rollNo: students.rollNo,
  name: students.name,
} as const;

let seedPromise: Promise<void> | null = null;

export function ensureAcademySeeded(): Promise<void> {
  seedPromise ??= seedAcademy().catch((error) => {
    seedPromise = null;
    throw error;
  });
  return seedPromise;
}

async function seedAcademy(): Promise<void> {
  await ensureMigrated();

  const realAdmin = realAdminFromEnv();
  if (realAdmin) return seedRealAdmin(realAdmin);
  if (!demoSeedAllowed()) return;
  await seedDemoAcademy();
}

/**
 * Provision the first school_admin for a real deployment. Idempotent: does
 * nothing once that account exists.
 */
async function seedRealAdmin(admin: {
  email: string;
  password: string;
  name: string;
  schoolName: string;
}): Promise<void> {
  const db = getDb();
  const [existing] = await db
    .select({ id: teachers.id })
    .from(teachers)
    .where(eq(teachers.email, admin.email))
    .limit(1);
  if (existing) return;

  const slug = slugify(admin.schoolName);
  let [school] = await db
    .select()
    .from(schools)
    .where(eq(schools.slug, slug))
    .limit(1);
  if (!school) {
    [school] = await db
      .insert(schools)
      .values({ name: admin.schoolName, slug })
      .returning();
  }

  await db.insert(teachers).values({
    schoolId: school.id,
    name: admin.name,
    email: admin.email,
    passwordHash: await hashPassword(admin.password),
    role: "school_admin",
    status: "active",
    emailVerifiedAt: new Date().toISOString(),
  });
}

async function seedDemoAcademy(): Promise<void> {
  const db = getDb();

  // 1. School
  let [school] = await db
    .select()
    .from(schools)
    .where(eq(schools.slug, DEMO_SCHOOL.slug))
    .limit(1);
  if (!school) {
    [school] = await db.insert(schools).values(DEMO_SCHOOL).returning();
  }

  // 2. School-admin (first approved teacher account)
  const [existingAdmin] = await db
    .select({ id: teachers.id })
    .from(teachers)
    .where(eq(teachers.email, DEMO_ADMIN.email))
    .limit(1);
  if (!existingAdmin) {
    await db.insert(teachers).values({
      schoolId: school.id,
      name: DEMO_ADMIN.name,
      email: DEMO_ADMIN.email,
      passwordHash: await hashPassword(DEMO_ADMIN.password),
      role: DEMO_ADMIN.role,
      status: "active",
      emailVerifiedAt: new Date().toISOString(),
    });
  }

  // 3. Classes referenced by the demo students
  const classNames = Array.from(new Set(seedStudents.map((s) => s.className)));
  const classByName = new Map<string, number>();
  for (const className of classNames) {
    let [row] = await db
      .select({ id: classes.id })
      .from(classes)
      .where(eq(classes.name, className))
      .limit(1);
    if (!row) {
      const grade = Number.parseInt(className, 10);
      const section = className.replace(/^\d+/, "");
      [row] = await db
        .insert(classes)
        .values({ schoolId: school.id, grade, section, name: className })
        .returning({ id: classes.id });
    }
    classByName.set(className, row.id);
  }

  // 4. Students (password hashed; plaintext demo code never persisted)
  const [studentCountRow] = await db
    .select({ count: sql<number>`count(*)` })
    .from(students);
  if (Number(studentCountRow?.count ?? 0) === 0) {
    const rows = await Promise.all(
      seedStudents.map(async (student) => ({
        schoolId: school.id,
        classId: classByName.get(student.className) ?? null,
        className: student.className,
        rollNo: student.rollNo,
        name: student.name,
        passwordHash: await hashPassword(student.accessCode),
      })),
    );
    await db.insert(students).values(rows).onConflictDoNothing();
  }

  // 5. Demo runs
  const [runCountRow] = await db
    .select({ count: sql<number>`count(*)` })
    .from(runs);
  if (Number(runCountRow?.count ?? 0) === 0) {
    const studentRows = await db
      .select({ id: students.id, rollNo: students.rollNo })
      .from(students)
      .orderBy(asc(students.id));
    const byRoll = new Map(studentRows.map((s) => [s.rollNo, s]));
    const values = seedRuns.flatMap((run) => {
      const student = byRoll.get(run.rollNo);
      if (!student) return [];
      return [
        {
          studentId: student.id,
          moduleId: run.moduleId,
          moduleTitle: "Who’s Really Behind the Screen?",
          rank: run.rank,
          leaks: run.leaks,
          drill: run.drill,
          recall: run.recall,
          path: run.path,
          durationSeconds: run.durationSeconds,
          completedAt: "2026-07-20 10:30:00",
        },
      ];
    });
    if (values.length) {
      await db.insert(runs).values(values).onConflictDoNothing();
    }
  }
}

/** Unscoped academy data — server-internal use only (e.g. Suraksha Guide). */
export async function getAcademyData(): Promise<{
  students: SafeStudent[];
  runs: (typeof runs.$inferSelect)[];
}> {
  await ensureAcademySeeded();
  const db = getDb();
  const [studentRows, runRows] = await Promise.all([
    db
      .select(safeStudentColumns)
      .from(students)
      .orderBy(asc(students.className), asc(students.rollNo)),
    db.select().from(runs).orderBy(asc(runs.studentId), asc(runs.completedAt)),
  ]);
  return { students: studentRows, runs: runRows };
}

/** Roster + runs limited to a specific set of student ids (teacher scope). */
export async function getScopedAcademyData(studentIds: number[]): Promise<{
  students: SafeStudent[];
  runs: (typeof runs.$inferSelect)[];
}> {
  await ensureAcademySeeded();
  if (studentIds.length === 0) return { students: [], runs: [] };
  const db = getDb();
  const [studentRows, runRows] = await Promise.all([
    db
      .select(safeStudentColumns)
      .from(students)
      .where(inArray(students.id, studentIds))
      .orderBy(asc(students.className), asc(students.rollNo)),
    db
      .select()
      .from(runs)
      .where(inArray(runs.studentId, studentIds))
      .orderBy(asc(runs.studentId), asc(runs.completedAt)),
  ]);
  return { students: studentRows, runs: runRows };
}

export async function getStudentWithRuns(id: number) {
  await ensureAcademySeeded();
  const db = getDb();
  const [student] = await db
    .select(safeStudentColumns)
    .from(students)
    .where(eq(students.id, id))
    .limit(1);
  if (!student) return null;
  const studentRuns = await db
    .select()
    .from(runs)
    .where(eq(runs.studentId, id))
    .orderBy(asc(runs.completedAt));
  return { student, runs: studentRuns };
}

export async function saveModuleRun(input: {
  studentId: number;
  moduleId: string;
  moduleTitle: string;
  rank: string;
  leaks: number;
  drill: number;
  recall: number;
  path: string;
  durationSeconds: number;
}) {
  await ensureAcademySeeded();
  const db = getDb();
  const [student] = await db
    .select({ id: students.id })
    .from(students)
    .where(eq(students.id, input.studentId))
    .limit(1);
  if (!student) return null;

  const [run] = await db
    .insert(runs)
    .values(input)
    .onConflictDoUpdate({
      target: [runs.studentId, runs.moduleId],
      set: {
        moduleTitle: input.moduleTitle,
        rank: input.rank,
        leaks: input.leaks,
        drill: input.drill,
        recall: input.recall,
        path: input.path,
        durationSeconds: input.durationSeconds,
        completedAt: sql`CURRENT_TIMESTAMP`,
      },
    })
    .returning();
  return run;
}
