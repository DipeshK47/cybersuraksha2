"use client";
import type { CyberLessonComponentProps } from "../../lesson-types";
import { TrainingConveyorExperience } from "../../experience/lower/TrainingConveyorExperience";
export function TeachMotiToSort(props: CyberLessonComponentProps) {
  return <TrainingConveyorExperience {...props} assessmentIds={["teach-moti-to-sort-check-1", "teach-moti-to-sort-check-2", "teach-moti-to-sort-transfer"]} />;
}
