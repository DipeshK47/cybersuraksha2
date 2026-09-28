"use client";
import type { CyberLessonComponentProps } from "../../lesson-types";
import { InfluencerShopExperience } from "../../experience/upper/InfluencerShopExperience";
export function TheInfluencerShopAndGiveaway(props: CyberLessonComponentProps) {
  return <InfluencerShopExperience {...props} assessmentIds={["the-influencer-shop-and-giveaway-check-1", "the-influencer-shop-and-giveaway-check-2", "the-influencer-shop-and-giveaway-transfer"]} />;
}
