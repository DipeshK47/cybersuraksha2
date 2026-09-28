import type { LessonHints, MistakeFeedback } from "../../../components/learning/LearningSupport";

export type CyberGuide = "Tara" | "Kabir" | "Meera";

export type ExperienceDefinition = {
  id: string;
  objective: string;
  place: string;
  guide: CyberGuide;
  scenes: readonly string[];
  completionTitle: string;
  completionSummary: string;
  familyMove: string;
  hints: LessonHints;
};

export type ExperienceSavedState = {
  scene: number;
  completedActions: string[];
  points: number;
};

export type ExperienceAction = {
  id: string;
  correct: boolean;
  assessmentIndex?: 0 | 1 | 2;
  unsafe?: boolean;
  nextScene?: number;
  checkpoint?: string;
  mistake?: MistakeFeedback;
};
