"use client";
import type { CyberLessonComponentProps } from "../../lesson-types";
import { GiveawayBrowserExperience } from "../../experience/middle/GiveawayBrowserExperience";
export function TheGamingGiveawayTrap(props: CyberLessonComponentProps) {
  return <GiveawayBrowserExperience {...props} assessmentIds={["the-gaming-giveaway-trap-check-1", "the-gaming-giveaway-trap-check-2", "the-gaming-giveaway-trap-transfer"]} />;
}
