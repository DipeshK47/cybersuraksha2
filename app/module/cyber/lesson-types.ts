import type { CyberLessonMeta } from "../../data/cyber-lessons";
import type {
  LessonHints,
  MistakeFeedback,
} from "../../components/learning/LearningSupport";

export type CyberLessonRole = "student" | "teacher";
export type LessonScoreKind = "drill" | "recall";
export type LessonSaveStatus = "idle" | "saving" | "saved" | "error";

export type LessonDecision = {
  id: string;
  correct: boolean;
  kind: LessonScoreKind;
  category: string;
  unsafe?: boolean;
};

export type RecordedDecision = LessonDecision & {
  answeredAt: number;
};

export type LessonCompletion = {
  title: string;
  summary: string;
};

export type CyberLessonRuntime = {
  loaded: boolean;
  checkpoint: string;
  state: Record<string, unknown>;
  answers: Record<string, RecordedDecision>;
  completed: boolean;
  completion: LessonCompletion | null;
  saveStatus: LessonSaveStatus;
  mistake: MistakeFeedback | null;
  hints: LessonHints | null;
  setCheckpoint: (checkpoint: string) => void;
  updateState: (patch: Record<string, unknown>) => void;
  recordDecision: (decision: LessonDecision) => boolean;
  recordMistake: (
    feedback: MistakeFeedback,
    options?: { activity?: string; hints?: LessonHints },
  ) => void;
  recordHint: (hints: LessonHints, activity?: string) => void;
  closeMistake: () => void;
  closeHints: () => void;
  showHintFromMistake: () => void;
  completeLesson: (completion: LessonCompletion) => void;
  resetLesson: () => void;
  retrySave: () => void;
};

export type CyberLessonComponentProps = {
  lesson: CyberLessonMeta;
  grade: number;
  role: CyberLessonRole;
  runtime: CyberLessonRuntime;
};
