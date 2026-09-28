"use client";
import type { CyberLessonComponentProps } from "../../lesson-types";
import { PrivacyBackpackExperience } from "../../experience/lower/PrivacyBackpackExperience";
export function CanITellThis(props: CyberLessonComponentProps) {
  return <PrivacyBackpackExperience {...props} assessmentIds={["can-i-tell-this-check-1", "can-i-tell-this-check-2", "can-i-tell-this-transfer"]} />;
}
