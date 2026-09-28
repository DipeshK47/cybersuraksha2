"use client";
import type { CyberLessonComponentProps } from "../../lesson-types";
import { MediaEvidenceExperience } from "../../experience/upper/MediaEvidenceExperience";
export function RealEditedOrAiMade(props: CyberLessonComponentProps) {
  return <MediaEvidenceExperience {...props} assessmentIds={["real-edited-or-ai-made-check-1", "real-edited-or-ai-made-check-2", "real-edited-or-ai-made-transfer"]} />;
}
