import { and, asc, eq, inArray, isNull, sql } from "drizzle-orm";
import { getDb } from ".";
import { assignments, assignmentStudents, assignmentSubmissions, classes, learningAttempts, learningEvents, students } from "./schema";
import { cyberLessons } from "../app/data/cyber-lessons";
import { attemptSummary, assignmentSummary } from "../app/lib/lms-summary";
import { studentContent } from "../app/lib/content-access";
import { assignmentAvailable } from "../app/lib/assignment-access";
import { studentQuestions } from "../app/lib/assignment-assessment";

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
    .innerJoin(students, eq(students.id, assignmentStudents.studentId))
    .where(and(eq(assignmentStudents.studentId, studentId), eq(assignments.schoolId, students.schoolId), eq(assignments.classId, students.classId)));
  const [student] = await getDb().select().from(students).where(eq(students.id, studentId));
  const access = student ? await studentContent(student) : { schoolName: "School", grades: [], subjects: [] };
  const { attempts } = await learnerHistory(studentId);
  const submissions = await getDb().select().from(assignmentSubmissions).where(eq(assignmentSubmissions.studentId, studentId));
  return rows.filter(r => r.assignment.publishedAt != null && assignmentAvailable(r.assignment, access)).map(r => ({ ...r.assignment, questions: studentQuestions(r.assignment.questions), className: r.className, readAt: r.readAt, progress: assignmentSummary(r.assignment, attempts, Date.now(), submissions.find(s => s.assignmentId === r.assignment.id)) }));
}

export async function assignmentReport(assignment: typeof assignments.$inferSelect) {
  const rows = await getDb().select({ id: students.id, name: students.name, rollNo: students.rollNo, className: students.className })
    .from(assignmentStudents).innerJoin(students, eq(students.id, assignmentStudents.studentId)).where(and(eq(assignmentStudents.assignmentId, assignment.id), eq(students.schoolId, assignment.schoolId), eq(students.classId, assignment.classId)));
  const history = await getDb().select({ attempt: learningAttempts }).from(learningAttempts).innerJoin(assignmentStudents, eq(learningAttempts.studentId, assignmentStudents.studentId)).where(eq(assignmentStudents.assignmentId, assignment.id));
  const attempts = history.map(row => row.attempt);
  const submissions = await getDb().select().from(assignmentSubmissions).where(eq(assignmentSubmissions.assignmentId, assignment.id));
  return rows.map(student => ({ ...student, submission: submissions.find(s => s.studentId === student.id) ?? null, progress: assignmentSummary(assignment, attempts.filter(a => a.studentId === student.id), Date.now(), submissions.find(s => s.studentId === student.id)), attempts: attempts.filter(a => a.studentId === student.id && JSON.parse(assignment.moduleIds).includes(a.moduleId)).length }));
}

export async function publishAssignment(assignment: typeof assignments.$inferSelect) {
  if (assignment.publishedAt != null) return true;
  const db = getDb();
  const now = Date.now();
  // Reject publication if another tab changed the reviewed draft.
  const publish = db.update(assignments).set({ publishedAt: now }).where(and(eq(assignments.id, assignment.id), isNull(assignments.publishedAt),
    eq(assignments.classId, assignment.classId), eq(assignments.moduleIds, assignment.moduleIds), eq(assignments.questions, assignment.questions),
    eq(assignments.title, assignment.title), eq(assignments.instructions, assignment.instructions), eq(assignments.totalMarks, assignment.totalMarks), eq(assignments.dueAt, assignment.dueAt))).returning();
  const recipients = db.insert(assignmentStudents).select(db.select({ assignmentId: sql<number>`${assignments.id}`.as("assignmentId"), studentId: students.id, readAt: sql<number | null>`NULL`.as("readAt") })
    .from(assignments).innerJoin(students, and(eq(students.classId, assignments.classId), eq(students.schoolId, assignments.schoolId)))
    .where(and(eq(assignments.id, assignment.id), eq(assignments.publishedAt, now)))).onConflictDoNothing();
  const [published] = await db.batch([publish, recipients]);
  return published.length > 0;
}

/** One query per collection, rather than two history queries for every assignment. */
export async function assignmentCounts(rows: typeof assignments.$inferSelect[]) {
  if (!rows.length) return [];
  const db = getDb();
  const ids = rows.map(row => row.id);
  const recipients = await db.select().from(assignmentStudents).where(inArray(assignmentStudents.assignmentId, ids));
  const studentIds = [...new Set(recipients.map(row => row.studentId))];
  const attempts = studentIds.length ? await db.select().from(learningAttempts).where(inArray(learningAttempts.studentId, studentIds)) : [];
  const submissions = await db.select().from(assignmentSubmissions).where(inArray(assignmentSubmissions.assignmentId, ids));
  return rows.map(row => {
    const assigned = recipients.filter(r => r.assignmentId === row.id);
    const progress = assigned.map(r => assignmentSummary(row, attempts.filter(a => a.studentId === r.studentId), Date.now(), submissions.find(s => s.assignmentId === row.id && s.studentId === r.studentId)));
    return { ...row, students: assigned.length, completed: progress.filter(p => p.completedAt != null).length, awaitingGrading: progress.filter(p => p.awaitingGrading).length };
  });
}
