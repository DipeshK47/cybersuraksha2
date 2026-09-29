import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "../../../../db";
import { assignmentStudents } from "../../../../db/schema";
import { studentAssignments } from "../../../../db/lms";
import { requireStudent } from "../../../lib/student-session";
import { parseJson } from "../../../lib/validation";
export async function GET(request: Request) {
  const session = await requireStudent(request); if (session instanceof Response) return session;
  return Response.json({ assignments: await studentAssignments(session.student.id) });
}
export async function PATCH(request: Request) {
  const session = await requireStudent(request); if (session instanceof Response) return session;
  const parsed = await parseJson(request, z.object({ assignmentId: z.number().int().positive() })); if (parsed.error) return parsed.error;
  const result = await getDb().update(assignmentStudents).set({ readAt: Date.now() }).where(and(eq(assignmentStudents.assignmentId, parsed.data.assignmentId), eq(assignmentStudents.studentId, session.student.id))).returning();
  return result.length ? Response.json({ ok: true }) : Response.json({ error: "Assignment not found." }, { status: 404 });
}
