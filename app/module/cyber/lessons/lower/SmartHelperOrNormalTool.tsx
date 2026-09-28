"use client";
import type { CyberLessonComponentProps } from "../../lesson-types";
import { SmartHomeExperience } from "../../experience/lower/SmartHomeExperience";
export function SmartHelperOrNormalTool(props: CyberLessonComponentProps) {
  return <SmartHomeExperience {...props} assessmentIds={["smart-helper-or-normal-tool-check-1", "smart-helper-or-normal-tool-check-2", "smart-helper-or-normal-tool-transfer"]} />;
}
