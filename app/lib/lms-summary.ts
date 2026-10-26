export type LearningEvent = { id: string; type: string; payload: string; createdAt: number };
export type LearningAttempt = { id: string; studentId: number; moduleId: string; startedAt: number; lastActiveAt: number; completedAt: number | null; score: number | null; legacy: number };
import type { AssignmentQuestion, QuestionGrade, Submission } from "./assignment-assessment";
export type Assignment = { id: number; title: string; instructions: string; moduleIds: string; questions?: string; classId: number; dueAt: number; totalMarks: number; createdAt: number; publishedAt: number | null };

export function eventDetails(event: LearningEvent): Record<string, unknown> {
  try { const value = JSON.parse(event.payload); return value && typeof value === "object" && !Array.isArray(value) ? value : {}; } catch { return {}; }
}

/** Final grades use each exercise's first recorded answer; retries remain visible as learning activity. */
export function attemptSummary(events: LearningEvent[], questionIds?: string[]) {
  const answers = events.filter(e => e.type === "question_answered" || e.type === "story_answered");
  const first = new Map<string, boolean>();
  for (const e of answers) {
    const p = eventDetails(e);
    const key = `${e.type}:${String(p.id ?? e.id)}`;
    if (e.type === "question_answered" && (!questionIds || questionIds.includes(String(p.id))) && !first.has(key)) first.set(key, p.correct === true);
  }
  const correct = answers.filter(e => eventDetails(e).correct === true).length;
  const total = first.size;
  return { correct, wrong: answers.length - correct, hints: events.filter(e => e.type === "hint_used").length,
    mistakes: events.filter(e => e.type === "mistake").length,
    score: total && (!questionIds || total === questionIds.length) ? [...first.values()].filter(Boolean).length / total * 100 : null };
}

export function assignmentSummary(assignment: Assignment, attempts: LearningAttempt[], now = Date.now(), submission?: Submission | null) {
  const moduleIds: string[] = JSON.parse(assignment.moduleIds);
  const questions: AssignmentQuestion[] = JSON.parse(assignment.questions ?? "[]");
  const grades: QuestionGrade[] = JSON.parse(submission?.grades ?? "[]");
  const customPossible = questions.reduce((sum, q) => sum + q.marks, 0);
  const customGraded = !questions.length || !!submission && questions.every(q => grades.some(g => g.questionId === q.id && g.marks != null));
  const customMarks = customGraded ? grades.reduce((sum, g) => sum + (g.marks ?? 0), 0) : null;
  const latest = moduleIds.map(moduleId => attempts.filter(a => a.moduleId === moduleId && a.completedAt != null)
    .sort((a, b) => (b.completedAt! - a.completedAt!) || (b.startedAt - a.startedAt) || b.id.localeCompare(a.id))[0] ?? null);
  const completed = latest.filter((a): a is LearningAttempt => a !== null);
  const done = completed.length === moduleIds.length && (!questions.length || !!submission) && moduleIds.length + questions.length > 0;
  const completedAt = done ? Math.max(...completed.map(a => a.completedAt!), submission?.submittedAt ?? 0) : null;
  const alreadyCompleted = done && !questions.length && assignment.publishedAt != null && completed.every(a => a.completedAt! <= assignment.publishedAt!);
  const graded = done && customGraded && completed.every(a => a.score != null);
  const lessonScore = moduleIds.length ? completed.reduce((n, a) => n + (a.score ?? 0), 0) / moduleIds.length : 0;
  const marks = graded ? Math.round((lessonScore / 100 * (assignment.totalMarks - customPossible) + (customMarks ?? 0)) * 100) / 100 : null;
  const score = marks == null ? null : marks / assignment.totalMarks * 100;
  return { completed: completed.length, total: moduleIds.length, latest, completedAt, alreadyCompleted, score, marks,
    customQuestions: questions.length, customSubmitted: !!submission, customMarks, customPossible, awaitingGrading: done && !customGraded,
    status: done ? !customGraded ? "Awaiting grading" : alreadyCompleted ? "Already completed" : completedAt! > assignment.dueAt ? "Completed late" : "Completed" : now > assignment.dueAt ? "Overdue" : submission || attempts.some(a => moduleIds.includes(a.moduleId)) ? "In progress" : "Not started" };
}
