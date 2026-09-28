"use client";

import { Bot, CheckCircle2, FileCheck2, PencilLine, Send } from "lucide-react";
import { useState } from "react";
import type { CyberLessonComponentProps } from "../../lesson-types";
import { CyberExperienceFrame } from "../CyberExperienceFrame";
import { makeHints, makeMistake } from "../experience-content";
import type { ExperienceDefinition } from "../experience-types";
import { EvidenceTray } from "../shells/EvidenceTray";
import { SimulationInput } from "../shells/SimulationInput";
import { useCyberExperience } from "../useCyberExperience";
import styles from "./middle-experiences.module.css";

const definition: ExperienceDefinition = {
  id: "chatbot-check",
  objective: "Check the chatbot's answer.",
  place: "Source Check desk",
  guide: "Kabir",
  scenes: ["Ask", "Mark claim", "Check sources", "Correct"],
  completionTitle: "The chatbot answer is now supported!",
  completionSummary: "You checked a claim against useful sources and corrected an unsupported answer.",
  familyMove: "Check one surprising AI answer against a trusted source together.",
  hints: makeHints("Ask the demo question.", "Tap the surprising claim.", "Choose sources that directly answer it.", "Rewrite only after checking evidence."),
};

const evidence = [
  { id: "museum", label: "Museum page", icon: "🏛️", detail: "Lists the national animal" },
  { id: "blog", label: "Random blog", icon: "📝", detail: "No author or sources" },
  { id: "textbook", label: "School text", icon: "📘", detail: "Wildlife chapter" },
];

export function ChatbotCheckExperience({ runtime, ...props }: CyberLessonComponentProps & { assessmentIds: readonly [string, string, string] }) {
  const experience = useCyberExperience(runtime, definition, props.assessmentIds);
  const [asked, setAsked] = useState(false);
  const [claimMarked, setClaimMarked] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [correction, setCorrection] = useState("");

  function ask() { setAsked(true); experience.setScene(1); }
  function markClaim() { setClaimMarked(true); experience.act({ id: "mark-claim", correct: true, assessmentIndex: 0, nextScene: 2 }); }
  function toggleEvidence(id: string) { setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]); }
  function checkSources() { const correct = selected.includes("museum") && selected.includes("textbook") && !selected.includes("blog"); experience.act({ id: "attach-sources", correct, assessmentIndex: 1, nextScene: correct ? 3 : 2, mistake: makeMistake("One source is weak", "A source without an author or supporting evidence cannot verify the claim.", "Use sources that clearly answer the exact question." ) }); }
  function saveCorrection() { const correct = /tiger/i.test(correction); experience.act({ id: "correct-answer", correct, assessmentIndex: 2, nextScene: 3, mistake: makeMistake("Use the checked fact", "Both trusted sources identify the Bengal tiger.", "Rewrite the claim using corroborated evidence." ) }); }

  return (
    <CyberExperienceFrame definition={definition} onHelp={experience.showHint} points={experience.points} runtime={runtime} scene={experience.scene} status={experience.has("correct-answer") ? "Answer checked and corrected." : selected.length ? `${selected.length} sources pinned.` : "Ask, mark, check, correct."}>
      <section className={styles.chatbotExperience} data-experience="chatbot-check" data-interaction="evidence">
        <div className={styles.chatbotWindow}><header><Bot aria-hidden="true" /><div><b>StudyBot Demo</b><small>Answers may be wrong</small></div></header><div className={styles.botConversation}><p className={styles.userBubble}>{"What is India's national animal?"}</p>{asked ? <button className={`${styles.botBubble} ${claimMarked ? styles.claimMarked : ""}`} onClick={markClaim} type="button">{"India's national animal is the lion."} <small>Tap the claim</small></button> : <button className={styles.askButton} onClick={ask} type="button"><Send aria-hidden="true" /> Ask chatbot</button>}</div></div>
        <div className={styles.sourceDesk}><h2><FileCheck2 aria-hidden="true" /> Pin useful sources</h2><EvidenceTray evidence={evidence} onToggle={toggleEvidence} selected={selected} />{claimMarked && !experience.has("attach-sources") ? <button className={styles.primaryAction} onClick={checkSources} type="button"><CheckCircle2 aria-hidden="true" /> Check sources</button> : null}{experience.has("attach-sources") && !experience.has("correct-answer") ? <div className={styles.correctionBox}><SimulationInput fictionalValue="The Bengal tiger is India's national animal." label="Correct the fictional answer" onChange={setCorrection} value={correction} /><button onClick={saveCorrection} type="button"><PencilLine aria-hidden="true" /> Save correction</button></div> : null}</div>
        {experience.has("correct-answer") ? <button className={styles.finishAction} onClick={experience.finish} type="button">Finish source check</button> : null}
      </section>
    </CyberExperienceFrame>
  );
}
