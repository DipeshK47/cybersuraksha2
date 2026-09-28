"use client";
import type { CyberLessonComponentProps } from "../../lesson-types";
import { PhoneHandoffExperience } from "../../experience/lower/PhoneHandoffExperience";
export function TheGrownUpsPhone(props: CyberLessonComponentProps) {
  return <PhoneHandoffExperience {...props} assessmentIds={["the-grown-ups-phone-check-1", "the-grown-ups-phone-check-2", "the-grown-ups-phone-transfer"]} />;
}
