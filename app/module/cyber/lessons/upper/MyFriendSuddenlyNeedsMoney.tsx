"use client";
import type { CyberLessonComponentProps } from "../../lesson-types";
import { ImpersonationChatExperience } from "../../experience/upper/ImpersonationChatExperience";
export function MyFriendSuddenlyNeedsMoney(props: CyberLessonComponentProps) {
  return <ImpersonationChatExperience {...props} assessmentIds={["my-friend-suddenly-needs-money-check-1", "my-friend-suddenly-needs-money-check-2", "my-friend-suddenly-needs-money-transfer"]} />;
}
