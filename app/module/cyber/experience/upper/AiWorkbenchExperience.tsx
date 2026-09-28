"use client";

import { Bot, CheckCircle2, FileSearch, Lightbulb, PencilLine, Send } from "lucide-react";
import { useState } from "react";
import type { CyberLessonComponentProps } from "../../lesson-types";
import { CyberExperienceFrame } from "../CyberExperienceFrame";
import { makeHints, makeMistake } from "../experience-content";
import type { ExperienceDefinition } from "../experience-types";
import { EvidenceTray } from "../shells/EvidenceTray";
import { SimulationInput } from "../shells/SimulationInput";
import { useCyberExperience } from "../useCyberExperience";
import styles from "./upper-experiences.module.css";

const definition: ExperienceDefinition = {
  id: "ai-workbench",
  objective: "Keep your thinking in charge.",
  place: "School AI workbench",
  guide: "Meera",
  scenes: ["Think", "Ask", "Check", "Rewrite"],
  completionTitle: "Meera stayed in charge of the work!",
  completionSummary: "You started with your own idea, checked AI suggestions, and rewrote the answer.",
  familyMove: "Use the Think, Ask, Check, Rewrite sequence on one homework idea.",
  hints: makeHints("Write one idea first.", "Ask AI after thinking.", "Check claims with sources.", "Rewrite in your own words."),
};

const sources = [
  { id: "science", label: "Science text", icon: "📘", detail: "Water-cycle chapter" },
  { id: "weather", label: "Weather centre", icon: "🌦️", detail: "Cloud formation explainer" },
  { id: "meme", label: "Rain meme", icon: "😂", detail: "No scientific source" },
];

export function AiWorkbenchExperience({ runtime, ...props }: CyberLessonComponentProps & { assessmentIds: readonly [string, string, string] }) {
  const experience = useCyberExperience(runtime, definition, props.assessmentIds);
  const [idea, setIdea] = useState("");
  const [asked, setAsked] = useState(false);
  const [evidence, setEvidence] = useState<string[]>([]);
  const [finalText, setFinalText] = useState("");

  function saveIdea() { experience.act({ id: "own-idea", correct: idea.trim().length >= 8, assessmentIndex: 0, nextScene: 1, mistake: makeMistake("Start with one complete idea", "Your own first thought gives you something to compare with the AI response.", "Think before you ask." ) }); }
  function askAi() { setAsked(true); experience.setScene(2); }
  function toggleEvidence(id: string) { setEvidence((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]); }
  function check() { const correct = evidence.includes("science") && evidence.includes("weather") && !evidence.includes("meme"); experience.act({ id: "check-ai", correct, assessmentIndex: 1, nextScene: correct ? 3 : 2, mistake: makeMistake("One source cannot support the claim", "A meme can be memorable without being reliable evidence.", "Use two relevant, trustworthy sources." ) }); }
  function rewrite() { const copied = finalText.trim() === "Rain happens because clouds get too heavy."; experience.act({ id: "rewrite-answer", correct: finalText.trim().length >= 20 && !copied, assessmentIndex: 2, nextScene: 3, mistake: makeMistake("Rewrite, do not copy", "The AI sentence is incomplete and unsupported as written.", "Combine your idea with checked facts in your own words." ) }); }

  return (
    <CyberExperienceFrame definition={definition} onHelp={experience.showHint} points={experience.points} runtime={runtime} scene={experience.scene} status={experience.has("rewrite-answer") ? "Final answer checked and rewritten." : asked ? "Check the AI claim before using it." : "Begin with your own idea."}>
      <section className={styles.workbenchExperience} data-experience="ai-workbench" data-interaction="editor">
        <div className={styles.workbenchColumns}>
          <article><header><Lightbulb aria-hidden="true" /><div><b>1 · My thinking</b><small>Write before asking AI</small></div></header><textarea maxLength={180} onChange={(event) => setIdea(event.target.value)} placeholder="I think rain forms when…" value={idea} /><button disabled={experience.has("own-idea")} onClick={saveIdea} type="button"><PencilLine aria-hidden="true" /> Save my idea</button></article>
          <article><header><Bot aria-hidden="true" /><div><b>2 · AI suggestion</b><small>Fictional StudyBot</small></div></header>{asked ? <div className={styles.aiDraft}><p>Rain happens because clouds get too heavy.</p><em>⚠️ No sources attached</em></div> : <button disabled={!experience.has("own-idea")} onClick={askAi} type="button"><Send aria-hidden="true" /> Ask for a suggestion</button>}</article>
        </div>
        {asked ? <div className={styles.sourceCheck}><h2><FileSearch aria-hidden="true" /> 3 · Check the claim</h2><EvidenceTray evidence={sources} onToggle={toggleEvidence} selected={evidence} />{!experience.has("check-ai") ? <button className={styles.primaryAction} onClick={check} type="button"><CheckCircle2 aria-hidden="true" /> Verify sources</button> : null}</div> : null}
        {experience.has("check-ai") ? <div className={styles.rewritePanel}><h2>4 · Rewrite in your words</h2><SimulationInput fictionalValue="Rain forms when water vapour cools into droplets that later fall from clouds." label="Final fictional school answer" onChange={setFinalText} value={finalText} /><button onClick={rewrite} type="button"><PencilLine aria-hidden="true" /> Save final answer</button></div> : null}
        {experience.has("rewrite-answer") ? <button className={styles.finishAction} onClick={experience.finish} type="button">Finish AI workbench</button> : null}
      </section>
    </CyberExperienceFrame>
  );
}
