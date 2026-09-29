import type { PlayableModule } from "../../data/module-registry";
import type { Assignment, LearningAttempt, LearningEvent } from "../../lib/lms-summary";
import type { assignmentSummary } from "../../lib/lms-summary";
export type Progress = ReturnType<typeof assignmentSummary>;
export type ClassRow = { id: number; name: string; grade: number };
export type StudentRow = { id: number; name: string; rollNo: string; className: string; classId?: number | null };
export type AssignmentRow = Assignment & { students?: number; completed?: number; className?: string; readAt?: number | null; progress?: Progress };
export type Workspace = { serverNow: number; assignments: AssignmentRow[]; classes: ClassRow[]; modules: PlayableModule[]; students: StudentRow[]; error?: string };
export type Report = { student: StudentRow; attempts: LearningAttempt[]; events: (LearningEvent & { attemptId: string })[]; assignments: AssignmentRow[]; practice: { questionId: string; topicSlug: string; chapterSlug: string; chosen: string; isCorrect: number; answeredAt: string }[]; error?: string };
