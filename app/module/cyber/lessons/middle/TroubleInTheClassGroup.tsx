"use client";
import type { CyberLessonComponentProps } from "../../lesson-types";
import { ClassChatExperience } from "../../experience/middle/ClassChatExperience";
export function TroubleInTheClassGroup(props: CyberLessonComponentProps) {
  return <ClassChatExperience {...props} assessmentIds={["trouble-in-the-class-group-check-1", "trouble-in-the-class-group-check-2", "trouble-in-the-class-group-transfer"]} />;
}
