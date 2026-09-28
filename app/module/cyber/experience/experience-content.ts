import type { LessonHints, MistakeFeedback } from "../../../components/learning/LearningSupport";

export function makeHints(
  prompt: string,
  look: string,
  notice: string,
  act: string,
): LessonHints {
  return {
    title: "Byte shows one move",
    prompt,
    steps: [
      { label: "Look", title: "Find the active clue", body: look },
      { label: "Notice", title: "Watch what changes", body: notice },
      { label: "Act", title: "Make the safe move", body: act },
    ],
  };
}

export function makeMistake(
  title: string,
  explanation: string,
  rule: string,
): MistakeFeedback {
  return {
    eyebrow: "Pause and protect",
    title,
    explanation,
    workedSteps: ["Stop", "Read the clue", "Choose the protective action"],
    rule,
  };
}
