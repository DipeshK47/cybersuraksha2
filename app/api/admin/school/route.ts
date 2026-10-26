import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "../../../../db";
import { schools, schoolSettings } from "../../../../db/schema";
import { requireRole } from "../../../lib/auth";
import { schoolContent } from "../../../lib/content-access";
import { schoolGrades, schoolSubjects } from "../../../lib/content-policy";
import { writeAudit } from "../../../lib/audit";
import { parseJson } from "../../../lib/validation";

export async function GET(request: Request) {
  const auth = await requireRole(request, "school_admin");
  if (auth instanceof Response) return auth;
  return Response.json({ ...await schoolContent(auth.schoolId), availableGrades: schoolGrades, availableSubjects: schoolSubjects });
}

export async function PUT(request: Request) {
  const auth = await requireRole(request, "school_admin");
  if (auth instanceof Response) return auth;
  const parsed = await parseJson(request, z.object({
    schoolName: z.string().trim().min(2).max(160),
    grades: z.array(z.number().int().refine(value => schoolGrades.includes(value))).min(1).max(10),
    subjects: z.array(z.string().refine(value => schoolSubjects.includes(value))).min(1).max(6),
  }));
  if (parsed.error) return parsed.error;
  const grades = [...new Set(parsed.data.grades)].sort((a, b) => a - b);
  const subjects = [...new Set(parsed.data.subjects)];
  const values = { schoolId: auth.schoolId, grades: JSON.stringify(grades), subjects: JSON.stringify(subjects) };
  const db = getDb();
  await db.batch([
    db.update(schools).set({ name: parsed.data.schoolName }).where(eq(schools.id, auth.schoolId)),
    db.insert(schoolSettings).values(values).onConflictDoUpdate({ target: schoolSettings.schoolId, set: values }),
  ]);
  await writeAudit({ actorTeacherId: auth.id, action: "school.curriculum.update", targetType: "school", targetId: auth.schoolId, metadata: { grades, subjects } });
  return Response.json({ ok: true });
}
