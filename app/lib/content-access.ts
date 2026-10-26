import { and, eq, inArray } from "drizzle-orm";
import { getDb } from "../../db";
import { classes, schools, schoolSettings } from "../../db/schema";
import { schoolGrades, schoolSubjects, type ContentAccess } from "./content-policy";
import { scopedClassIds } from "./auth";
import type { SessionTeacher } from "./session";
import type { StudentSession } from "./student-session";

export async function schoolContent(schoolId: number): Promise<ContentAccess> {
  const [school] = await getDb().select().from(schools).where(eq(schools.id, schoolId));
  const [settings] = await getDb().select().from(schoolSettings).where(eq(schoolSettings.schoolId, schoolId));
  return { schoolName: school?.name ?? "School", grades: school ? settings ? JSON.parse(settings.grades) : schoolGrades : [], subjects: school ? settings ? JSON.parse(settings.subjects) : schoolSubjects : [] };
}

export async function studentContent(student: StudentSession["student"]) {
  if (student.schoolId == null || student.classId == null) return { schoolName: "School", grades: [], subjects: [] };
  const access = await schoolContent(student.schoolId);
  const [classroom] = await getDb().select().from(classes).where(and(eq(classes.id, student.classId), eq(classes.schoolId, student.schoolId)));
  return { ...access, grades: classroom && access.grades.includes(classroom.grade) ? [classroom.grade] : [] };
}

export async function teacherContent(teacher: SessionTeacher) {
  const access = await schoolContent(teacher.schoolId);
  if (teacher.role === "school_admin") return access;
  const ids = await scopedClassIds(teacher);
  const rows = ids.length ? await getDb().select().from(classes).where(inArray(classes.id, ids)) : [];
  return { ...access, grades: access.grades.filter(grade => rows.some(row => row.grade === grade)) };
}
