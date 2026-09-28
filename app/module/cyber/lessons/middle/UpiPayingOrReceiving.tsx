"use client";
import type { CyberLessonComponentProps } from "../../lesson-types";
import { UpiFlowExperience } from "../../experience/middle/UpiFlowExperience";
export function UpiPayingOrReceiving(props: CyberLessonComponentProps) {
  return <UpiFlowExperience {...props} assessmentIds={["upi-paying-or-receiving-check-1", "upi-paying-or-receiving-check-2", "upi-paying-or-receiving-transfer"]} />;
}
