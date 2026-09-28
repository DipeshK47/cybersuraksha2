"use client";
import type { CyberLessonComponentProps } from "../../lesson-types";
import { CoinRunnerExperience } from "../../experience/lower/CoinRunnerExperience";
export function FreeCoinsTapNow(props: CyberLessonComponentProps) {
  return <CoinRunnerExperience {...props} assessmentIds={["free-coins-tap-now-check-1", "free-coins-tap-now-check-2", "free-coins-tap-now-transfer"]} />;
}
