import { and, eq, isNull } from "drizzle-orm";
import { getDb } from "../../db";
import { assignments, classes, students } from "../../db/schema";
import { publishAssignment } from "../../db/lms";
import { assignmentChapters } from "../data/module-registry";
import { requireTeacher, scopedClassIds } from "./auth";
import { parseJson } from "./validation";
import { assignmentSchema } from "./assignment-assessment";
import { schoolContent } from "./content-access";
import { permitsModule } from "./content-policy";
import { teacherAssignment } from "./assignment-access";
import { writeAudit } from "./audit";

export async function saveAssignment(request: Request, id?: number) {
  const auth = await requireTeacher(request); if (auth instanceof Response) return auth;
  const parsed = await parseJson(request, assignmentSchema); if (parsed.error) return parsed.error;
  const body = parsed.data;
  const existing = id == null ? null : await teacherAssignment(request, id, true);
  if (existing instanceof Response) return existing;
  if (existing?.assignment.publishedAt != null) return Response.json({ error: "Published assignments are locked to preserve submitted work." }, { status: 409 });
  if (!(await scopedClassIds(auth)).includes(body.classId)) return Response.json({ error: "Class not found." }, { status: 404 });
  const db = getDb();
  const [classroom] = await db.select().from(classes).where(eq(classes.id, body.classId));
  const access = await schoolContent(auth.schoolId);
  if (!access.grades.includes(classroom.grade)) return Response.json({ error: "This grade is disabled in school curriculum settings." }, { status: 400 });
  const moduleIds = [...new Set(body.moduleIds)];
  if (moduleIds.some(id => !assignmentChapters.some(m => m.id === id && m.grades.includes(classroom.grade) && permitsModule(access, m))))
    return Response.json({ error: "Choose chapters available for this class." }, { status: 400 });
  if (body.dueAt <= Date.now()) return Response.json({ error: "The deadline must be in the future." }, { status: 400 });
  if (body.publish) {
    const roster = await db.select({ id: students.id }).from(students).where(eq(students.classId, body.classId)).limit(1);
    if (!roster.length) return Response.json({ error: "Add students before publishing." }, { status: 400 });
  }
  const now = Date.now();
  const values = { schoolId: auth.schoolId, teacherId: existing?.assignment.teacherId ?? auth.id, classId: body.classId, title: body.title,
    instructions: body.instructions, moduleIds: JSON.stringify(moduleIds), questions: JSON.stringify(body.questions), dueAt: body.dueAt, totalMarks: body.totalMarks,
    createdAt: existing?.assignment.createdAt ?? now, publishedAt: null };
  const [assignment] = existing ? await db.update(assignments).set(values).where(and(eq(assignments.id, id!), isNull(assignments.publishedAt))).returning() : await db.insert(assignments).values(values).returning();
  if (!assignment) return Response.json({ error: "This assignment was published while you edited it. Reload to view its current state." }, { status: 409 });
  if (body.publish && !await publishAssignment(assignment)) return Response.json({ error: "This assignment changed in another tab. Reload before publishing." }, { status: 409 });
  await writeAudit({ actorTeacherId: auth.id, action: body.publish ? "assignment.publish" : existing ? "assignment.update" : "assignment.create", targetType: "assignment", targetId: assignment.id });
  return Response.json({ assignment: { ...assignment, publishedAt: body.publish ? Date.now() : null } }, { status: existing ? 200 : 201 });
}
