"use client";
import type { CyberLessonComponentProps } from "../../lesson-types";
import { BlockGameExperience } from "../../experience/lower/BlockGameExperience";
export function SomeoneNewInMyGame(props: CyberLessonComponentProps) {
  return <BlockGameExperience {...props} assessmentIds={["someone-new-in-my-game-check-1", "someone-new-in-my-game-check-2", "someone-new-in-my-game-transfer"]} />;
}
