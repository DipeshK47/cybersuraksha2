"use client";
import type { CyberLessonComponentProps } from "../../lesson-types";
import { AccountCentreExperience } from "../../experience/middle/AccountCentreExperience";
export function SaveMyGameAccount(props: CyberLessonComponentProps) {
  return <AccountCentreExperience {...props} assessmentIds={["save-my-game-account-check-1", "save-my-game-account-check-2", "save-my-game-account-transfer"]} />;
}
