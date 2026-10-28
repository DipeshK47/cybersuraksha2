/** Authored source text. Stable IDs and answers are never translated. */
export type L = { en: string; hi: string };
export const l = (en: string, hi: string): L => ({ en, hi });
export type LessonStrand = "Computational Thinking" | "Artificial Intelligence" | "Cybersecurity" | "Cyber Fraud";
export type Option = { id: string; label: L; feedback: L };
export type TaskBase = { prompt: L; context: L; success: L; correction: L; hint: L };
export type ChoiceTask = TaskBase & { kind: "choice"; options: Option[]; correct: string };
export type SelectTask = TaskBase & { kind: "select"; items: Option[]; expected: string[]; presentation?: "cards" | "redact" };
export type MatchTask = TaskBase & {
  kind: "match";
  rows: { id: string; label: L; answer: string; explanation: L }[];
  options: { id: string; label: L }[];
  presentation?: "match" | "permissions" | "dataset";
  simulation?: { label: L; checks: { rowId: string; allowedAnswers: string[] }[]; allowed: L; denied: L }[];
};
export type OrderTask = TaskBase & { kind: "order"; items: { id: string; label: L }[]; expected: string[]; stepReasons?: L[] };
export type NumberTask = TaskBase & { kind: "number"; fields: { id: string; label: L; answer: number; min?: number; max?: number; explanation?: L }[] };
export type BinaryTask = TaskBase & { kind: "binary"; target: number; bits: 8 };
export type GridTask = TaskBase & { kind: "grid"; width: number; height: number; expected: number[]; blocked?: number[]; caption: L; cellReasons?: Record<string,L> };
export type RouteTask = TaskBase & { kind: "route"; width: number; height: number; start: number; goal: number; blocked: number[]; stops?: number[]; maxSteps: number; cellCosts?: Record<string, number>; maxCost?: number };
export type ModelTask = TaskBase & {
  kind: "model";
  checkRole?: "validation" | "test";
  feature: L;
  labels: { id: string; label: L }[];
  examples: { id: string; value: number; label: string }[];
  tests: { id: string; value: number; expected: string }[];
  initialTraining: string[];
  minimumCorrect: number;
};
export type LessonTask = ChoiceTask | SelectTask | MatchTask | OrderTask | NumberTask | BinaryTask | GridTask | RouteTask | ModelTask;
export type LessonChapter = {
  slug: string;
  title: L;
  strand: LessonStrand;
  summary: L;
  topics: [L, L, L];
  outcomes: [L, L, L];
  familyAction: L;
  reflection: L;
  teacherPrompt: L;
  rubric: [L, L, L];
  sceneTheme: "workshop" | "garden" | "signals" | "robot" | "magazine" | "device" | "evidence" | "market";
  scenes: { title: L; caption: L; dialogue: L; speech?: string }[];
  decision: ChoiceTask;
  tasks: [LessonTask, LessonTask, LessonTask];
};

export type TaskAnswer = string | string[] | number[] | Record<string, string>;
