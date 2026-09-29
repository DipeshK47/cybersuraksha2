import { and, asc, eq, isNull, sql } from "drizzle-orm";
import { getDb } from ".";
import { assignments, assignmentStudents, classes, learningAttempts, learningEvents, students } from "./schema";
import { cyberLessons } from "../app/data/cyber-lessons";
import { attemptSummary, assignmentSummary } from "../app/lib/lms-summary";

export async function recordLearningEvent(input: { studentId: number; moduleId: string; type: string; payload?: unknown; attemptKey: string; eventId: string }) {
  const db = getDb();
  const id = `${input.studentId}:${input.moduleId}:${input.attemptKey}`;
  const now = Date.now();
  const payload = JSON.stringify(input.payload ?? {});
  // Idempotent, transactional ingestion: retrying a batch cannot create extra attempts or answers.
  const [, inserted] = await db.batch([
    db.insert(learningAttempts).values({ id, studentId: input.studentId, moduleId: input.moduleId, startedAt: now, lastActiveAt: now }).onConflictDoNothing(),
    db.insert(learningEvents).values({ id: `${input.studentId}:${input.eventId}`, attemptId: id, type: input.type, payload, createdAt: now }).onConflictDoNothing().returning(),
    db.update(learningAttempts).set({ lastActiveAt: now }).where(and(eq(learningAttempts.id, id), eq(learningAttempts.moduleId, input.moduleId))),
  ]);
  if (input.type === "module_completed") {
    const events = await db.select().from(learningEvents).where(eq(learningEvents.attemptId, id)).orderBy(asc(learningEvents.createdAt));
    const summary = attemptSummary(events, cyberLessons.find(lesson => lesson.id === input.moduleId)?.assessmentIds);
    await db.update(learningAttempts).set({ completedAt: now, score: summary.score }).where(and(eq(learningAttempts.id, id), isNull(learningAttempts.completedAt)));
  }
  return inserted.length > 0;
}

export async function learnerHistory(studentId: number) {
  const attempts = await getDb().select().from(learningAttempts).where(eq(learningAttempts.studentId, studentId)).orderBy(asc(learningAttempts.startedAt));
  const rows = await getDb().select({ event: learningEvents }).from(learningEvents).innerJoin(learningAttempts, eq(learningEvents.attemptId, learningAttempts.id)).where(eq(learningAttempts.studentId, studentId)).orderBy(asc(learningEvents.createdAt));
  const events = rows.map(row => row.event);
  return { attempts, events };
}

export async function studentAssignments(studentId: number) {
  const rows = await getDb().select({ assignment: assignments, readAt: assignmentStudents.readAt, className: classes.name })
    .from(assignmentStudents).innerJoin(assignments, eq(assignmentStudents.assignmentId, assignments.id)).innerJoin(classes, eq(assignments.classId, classes.id))
    .where(eq(assignmentStudents.studentId, studentId));
  const { attempts } = await learnerHistory(studentId);
  return rows.filter(r => r.assignment.publishedAt != null).map(r => ({ ...r.assignment, className: r.className, readAt: r.readAt, progress: assignmentSummary(r.assignment, attempts) }));
}

export async function assignmentReport(assignment: typeof assignments.$inferSelect) {
  const rows = await getDb().select({ id: students.id, name: students.name, rollNo: students.rollNo, className: students.className })
    .from(assignmentStudents).innerJoin(students, eq(students.id, assignmentStudents.studentId)).where(eq(assignmentStudents.assignmentId, assignment.id));
  const history = await getDb().select({ attempt: learningAttempts }).from(learningAttempts).innerJoin(assignmentStudents, eq(learningAttempts.studentId, assignmentStudents.studentId)).where(eq(assignmentStudents.assignmentId, assignment.id));
  const attempts = history.map(row => row.attempt);
  return rows.map(student => ({ ...student, progress: assignmentSummary(assignment, attempts.filter(a => a.studentId === student.id)), attempts: attempts.filter(a => a.studentId === student.id && JSON.parse(assignment.moduleIds).includes(a.moduleId)).length }));
}

export async function publishAssignment(assignment: typeof assignments.$inferSelect) {
  if (assignment.publishedAt != null) return;
  const db = getDb();
  const publish = db.update(assignments).set({ publishedAt: Date.now() }).where(and(eq(assignments.id, assignment.id), isNull(assignments.publishedAt)));
  const recipients = db.insert(assignmentStudents).select(db.select({ assignmentId: sql<number>`${assignment.id}`.as("assignmentId"), studentId: students.id, readAt: sql<number | null>`NULL`.as("readAt") }).from(students).where(eq(students.classId, assignment.classId))).onConflictDoNothing();
  await db.batch([publish, recipients]);
}
