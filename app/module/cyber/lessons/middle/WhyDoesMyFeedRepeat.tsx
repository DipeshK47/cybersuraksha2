"use client";
import type { CyberLessonComponentProps } from "../../lesson-types";
import { AdaptiveFeedExperience } from "../../experience/middle/AdaptiveFeedExperience";
export function WhyDoesMyFeedRepeat(props: CyberLessonComponentProps) {
  return <AdaptiveFeedExperience {...props} assessmentIds={["why-does-my-feed-repeat-check-1", "why-does-my-feed-repeat-check-2", "why-does-my-feed-repeat-transfer"]} />;
}
