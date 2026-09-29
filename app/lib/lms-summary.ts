export type LearningEvent = { id: string; type: string; payload: string; createdAt: number };
export type LearningAttempt = { id: string; studentId: number; moduleId: string; startedAt: number; lastActiveAt: number; completedAt: number | null; score: number | null; legacy: number };
export type Assignment = { id: number; title: string; instructions: string; moduleIds: string; classId: number; dueAt: number; totalMarks: number; createdAt: number; publishedAt: number | null };

export function eventDetails(event: LearningEvent): Record<string, unknown> {
  try { return JSON.parse(event.payload); } catch { return {}; }
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

export function assignmentSummary(assignment: Assignment, attempts: LearningAttempt[], now = Date.now()) {
  const moduleIds: string[] = JSON.parse(assignment.moduleIds);
  const latest = moduleIds.map(moduleId => attempts.filter(a => a.moduleId === moduleId && a.completedAt != null)
    .sort((a, b) => (b.completedAt! - a.completedAt!) || (b.startedAt - a.startedAt) || b.id.localeCompare(a.id))[0] ?? null);
  const completed = latest.filter((a): a is LearningAttempt => a !== null);
  const done = completed.length === moduleIds.length;
  const completedAt = done ? Math.max(...completed.map(a => a.completedAt!)) : null;
  const alreadyCompleted = done && assignment.publishedAt != null && completed.every(a => a.completedAt! <= assignment.publishedAt!);
  const graded = done && completed.every(a => a.score != null);
  const score = graded ? completed.reduce((n, a) => n + a.score!, 0) / moduleIds.length : null;
  const marks = score == null ? null : Math.round(score / 100 * assignment.totalMarks * 100) / 100;
  return { completed: completed.length, total: moduleIds.length, latest, completedAt, alreadyCompleted, score, marks,
    status: done ? alreadyCompleted ? "Already completed" : completedAt! > assignment.dueAt ? "Completed late" : "Completed" : now > assignment.dueAt ? "Overdue" : attempts.some(a => moduleIds.includes(a.moduleId)) ? "In progress" : "Not started" };
}
