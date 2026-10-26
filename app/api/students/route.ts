import { and, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { ensureAcademySeeded } from "../../../db/academy";
import { classes, students } from "../../../db/schema";
import { canAccessClass, requireTeacher } from "../../lib/auth";
import { writeAudit } from "../../lib/audit";
import { hashPassword } from "../../lib/password";
import { createStudentsSchema, parseJson } from "../../lib/validation";
import { schoolContent } from "../../lib/content-access";

function makeAccessCode(rollNo: string) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  const suffix = Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
  return `${rollNo.slice(0, 4)}${suffix}`;
}

/**
 * Create student accounts in one of the teacher's classes.
 *
 * Authorization: an existing class must be one the teacher can access. A new
 * class may be created only by a school_admin (who owns every class in the
 * school). Generated access codes are returned once (for the printed slips)
 * and stored only as hashes.
 */
export async function POST(request: Request) {
  const auth = await requireTeacher(request);
  if (auth instanceof Response) return auth;

  await ensureAcademySeeded();
  const db = getDb();

  const parsed = await parseJson(request, createStudentsSchema);
  if (parsed.error) return parsed.error;

  const className = parsed.data.className.trim().toUpperCase();
  const access = await schoolContent(auth.schoolId);
  const rows = parsed.data.students
    .map((student) => ({
      rollNo: student.rollNo?.trim() ?? "",
      name: student.name?.trim() ?? "",
    }))
    .filter((student) => student.rollNo && student.name);

  if (!className || rows.length === 0) {
    return Response.json(
      { error: "Class name and at least one student are required." },
      { status: 400 },
    );
  }

  // Resolve the class within the teacher's own school.
  let [klass] = await db
    .select({ id: classes.id, grade: classes.grade })
    .from(classes)
    .where(and(eq(classes.schoolId, auth.schoolId), eq(classes.name, className)))
    .limit(1);

  if (!klass) {
    if (auth.role !== "school_admin") {
      return Response.json(
        { error: "That class does not exist. Ask a school admin to create it." },
        { status: 403 },
      );
    }
    const grade = Number.parseInt(className, 10);
    if (!Number.isInteger(grade) || !access.grades.includes(grade)) {
      return Response.json(
        { error: "Class name must start with an enabled grade, e.g. 7B." },
        { status: 400 },
      );
    }
    const section = className.replace(/^\d+/, "");
    [klass] = await db
      .insert(classes)
      .values({ schoolId: auth.schoolId, grade, section, name: className })
      .returning({ id: classes.id, grade: classes.grade });
  } else if (!(await canAccessClass(auth, klass.id))) {
    return Response.json(
      { error: "You are not assigned to that class." },
      { status: 403 },
    );
  }

  if (!access.grades.includes(klass.grade)) return Response.json({ error: "This grade is disabled in school curriculum settings." }, { status: 400 });
  if (new Set(rows.map(row => row.rollNo)).size !== rows.length) return Response.json({ error: "Each student must have a different roll number." }, { status: 400 });

  // Generate + hash a code per student; keep the plaintext only in memory.
  const codeByRoll = new Map<string, string>();
  const insertRows = await Promise.all(
    rows.map(async (student) => {
      const accessCode = makeAccessCode(student.rollNo);
      codeByRoll.set(student.rollNo, accessCode);
      return {
        schoolId: auth.schoolId,
        classId: klass!.id,
        className,
        rollNo: student.rollNo,
        name: student.name,
        passwordHash: await hashPassword(accessCode),
      };
    }),
  );

  const created = await db
    .insert(students)
    .values(insertRows)
    .onConflictDoNothing()
    .returning({
      id: students.id,
      className: students.className,
      rollNo: students.rollNo,
      name: students.name,
    });

  const issued = created.map((student) => ({
    ...student,
    accessCode: codeByRoll.get(student.rollNo) ?? "",
  }));

  await writeAudit({
    actorTeacherId: auth.id,
    action: "student.create",
    targetType: "class",
    targetId: klass.id,
    metadata: { className, count: issued.length },
  });

  return Response.json({ students: issued }, { status: 201 });
}
