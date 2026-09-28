"use client";
import type { CyberLessonComponentProps } from "../../lesson-types";
import { AiWorkbenchExperience } from "../../experience/upper/AiWorkbenchExperience";
export function UseAiWithoutLosingYourThinking(props: CyberLessonComponentProps) {
  return <AiWorkbenchExperience {...props} assessmentIds={["use-ai-without-losing-your-thinking-check-1", "use-ai-without-losing-your-thinking-check-2", "use-ai-without-losing-your-thinking-transfer"]} />;
}
