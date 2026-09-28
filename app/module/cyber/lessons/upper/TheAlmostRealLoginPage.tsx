"use client";
import type { CyberLessonComponentProps } from "../../lesson-types";
import { FakeLoginBrowserExperience } from "../../experience/upper/FakeLoginBrowserExperience";
export function TheAlmostRealLoginPage(props: CyberLessonComponentProps) {
  return <FakeLoginBrowserExperience {...props} assessmentIds={["the-almost-real-login-page-check-1", "the-almost-real-login-page-check-2", "the-almost-real-login-page-transfer"]} />;
}
