import { desc, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "../../../../db";
import { assignments, classes, students } from "../../../../db/schema";
import { assignmentReport, publishAssignment } from "../../../../db/lms";
import { assignmentChapters } from "../../../data/module-registry";
import { requireTeacher, scopedClassIds } from "../../../lib/auth";
import { parseJson } from "../../../lib/validation";

const assignmentSchema = z.object({
  title: z.string().trim().min(1).max(160), instructions: z.string().trim().max(4000).default(""),
  classId: z.number().int().positive(), moduleIds: z.array(z.string()).min(1).max(20),
  dueAt: z.number().int().positive(), totalMarks: z.number().positive().max(10000), publish: z.boolean().default(false),
});

export async function GET(request: Request) {
  const auth = await requireTeacher(request); if (auth instanceof Response) return auth;
  const ids = await scopedClassIds(auth);
  const db = getDb();
  const availableClasses = ids.length ? await db.select().from(classes).where(inArray(classes.id, ids)) : [];
  const rows = ids.length ? await db.select().from(assignments).where(inArray(assignments.classId, ids)).orderBy(desc(assignments.createdAt)) : [];
  const result = [];
  for (const row of rows) {
    const report = await assignmentReport(row);
    result.push({ ...row, students: report.length, completed: report.filter(s => s.progress.completedAt != null).length });
  }
  const roster = ids.length ? await db.select({ id: students.id, name: students.name, rollNo: students.rollNo, className: students.className, classId: students.classId }).from(students).where(inArray(students.classId, ids)) : [];
  return Response.json({ assignments: result, classes: availableClasses, modules: assignmentChapters, students: roster, serverNow: Date.now() });
}

export async function POST(request: Request) {
  const auth = await requireTeacher(request); if (auth instanceof Response) return auth;
  const parsed = await parseJson(request, assignmentSchema); if (parsed.error) return parsed.error;
  const body = parsed.data;
  if (!(await scopedClassIds(auth)).includes(body.classId)) return Response.json({ error: "Class not found." }, { status: 404 });
  const db = getDb();
  const [classroom] = await db.select().from(classes).where(eq(classes.id, body.classId));
  const moduleIds = [...new Set(body.moduleIds)];
  if (moduleIds.some(id => !assignmentChapters.some(m => m.id === id && m.grades.includes(classroom.grade))))
    return Response.json({ error: "Choose chapters available for this class." }, { status: 400 });
  if (body.dueAt <= Date.now()) return Response.json({ error: "The deadline must be in the future." }, { status: 400 });
  const now = Date.now();
  const [assignment] = await db.insert(assignments).values({ schoolId: auth.schoolId, teacherId: auth.id, classId: body.classId, title: body.title,
    instructions: body.instructions, moduleIds: JSON.stringify(moduleIds), dueAt: body.dueAt, totalMarks: body.totalMarks,
    createdAt: now, publishedAt: null }).returning();
  if (body.publish) await publishAssignment(assignment);
  return Response.json({ assignment: { ...assignment, publishedAt: body.publish ? Date.now() : null } }, { status: 201 });
}
