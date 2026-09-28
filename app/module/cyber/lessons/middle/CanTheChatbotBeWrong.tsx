"use client";
import type { CyberLessonComponentProps } from "../../lesson-types";
import { ChatbotCheckExperience } from "../../experience/middle/ChatbotCheckExperience";
export function CanTheChatbotBeWrong(props: CyberLessonComponentProps) {
  return <ChatbotCheckExperience {...props} assessmentIds={["can-the-chatbot-be-wrong-check-1", "can-the-chatbot-be-wrong-check-2", "can-the-chatbot-be-wrong-transfer"]} />;
}
