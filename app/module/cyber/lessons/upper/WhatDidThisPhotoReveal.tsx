"use client";
import type { CyberLessonComponentProps } from "../../lesson-types";
import { PhotoPrivacyExperience } from "../../experience/upper/PhotoPrivacyExperience";
export function WhatDidThisPhotoReveal(props: CyberLessonComponentProps) {
  return <PhotoPrivacyExperience {...props} assessmentIds={["what-did-this-photo-reveal-check-1", "what-did-this-photo-reveal-check-2", "what-did-this-photo-reveal-transfer"]} />;
}
