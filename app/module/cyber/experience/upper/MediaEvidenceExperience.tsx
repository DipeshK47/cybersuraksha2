"use client";

import { CircleHelp, FileSearch, Gauge, Images, SearchCheck } from "lucide-react";
import { useState } from "react";
import type { CyberLessonComponentProps } from "../../lesson-types";
import { CyberExperienceFrame } from "../CyberExperienceFrame";
import { makeHints, makeMistake } from "../experience-content";
import type { ExperienceDefinition } from "../experience-types";
import { EvidenceTray } from "../shells/EvidenceTray";
import { useCyberExperience } from "../useCyberExperience";
import styles from "./upper-experiences.module.css";

const definition: ExperienceDefinition = {
  id: "media-evidence",
  objective: "Build an evidence-based verdict.",
  place: "Media evidence lab",
  guide: "Meera",
  scenes: ["Inspect", "Compare", "Pin evidence", "Set confidence"],
  completionTitle: "The verdict matches the evidence!",
  completionSummary: "You compared sources, rejected weak visual guesses, and allowed uncertainty.",
  familyMove: "Check the source of one surprising image before forwarding it.",
  hints: makeHints("Inspect the media closely.", "Visual oddities are clues, not proof.", "Compare the original source and reporting.", "Choose confidence that matches the evidence."),
};

const evidenceItems = [
  { id: "source", label: "Original source", icon: "🔗", detail: "Posted as an art experiment" },
  { id: "report", label: "News report", icon: "📰", detail: "Confirms the edit" },
  { id: "fingers", label: "Odd fingers", icon: "🖐️", detail: "A visual clue only" },
  { id: "caption", label: "Dramatic caption", icon: "💥", detail: "No supporting details" },
];

export function MediaEvidenceExperience({ runtime, ...props }: CyberLessonComponentProps & { assessmentIds: readonly [string, string, string] }) {
  const experience = useCyberExperience(runtime, definition, props.assessmentIds);
  const [zoom, setZoom] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [confidence, setConfidence] = useState(50);
  const [verdict, setVerdict] = useState<"edited" | "uncertain" | "ai">("uncertain");

  function toggle(id: string) { setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]); }
  function compare() { experience.act({ id: "compare-sources", correct: zoom > 1, assessmentIndex: 0, nextScene: 1 }); }
  function pin() { const correct = selected.includes("source") && selected.includes("report"); experience.act({ id: "pin-evidence", correct, assessmentIndex: 1, nextScene: correct ? 2 : 1, mistake: makeMistake("A visual clue is not enough", "Odd details can come from editing, compression, perspective, or generation.", "Use source evidence and corroboration." ) }); }
  function submit() { const correct = verdict === "edited" && confidence >= 55 && confidence <= 85; experience.act({ id: "submit-verdict", correct, assessmentIndex: 2, nextScene: 3, mistake: makeMistake("Match confidence to evidence", "The sources confirm an edit, but they do not prove which tool created every part.", "Choose edited with moderate confidence, not absolute certainty." ) }); }

  return (
    <CyberExperienceFrame definition={definition} onHelp={experience.showHint} points={experience.points} runtime={runtime} scene={experience.scene} status={experience.has("submit-verdict") ? "Verdict calibrated to the evidence." : `${selected.length} evidence cards pinned.`}>
      <section className={styles.mediaExperience} data-experience="media-evidence" data-interaction="evidence">
        <div className={styles.mediaDesk}><div className={styles.mediaCanvas} style={{ "--media-zoom": zoom } as React.CSSProperties}><div><span>🖐️</span><Images aria-hidden="true" /><b>Festival crowd image</b></div></div><label><FileSearch aria-hidden="true" /> Zoom evidence<input aria-label="Media zoom" max="2" min="1" onChange={(event) => setZoom(Number(event.target.value))} step=".25" type="range" value={zoom} /></label><button disabled={experience.has("compare-sources")} onClick={compare} type="button"><SearchCheck aria-hidden="true" /> Compare source copies</button></div>
        <div className={styles.evidenceWall}><h2>Pin strong evidence</h2><EvidenceTray evidence={evidenceItems} onToggle={toggle} selected={selected} />{experience.has("compare-sources") && !experience.has("pin-evidence") ? <button className={styles.primaryAction} onClick={pin} type="button">Lock evidence set</button> : null}</div>
        {experience.has("pin-evidence") ? <div className={styles.verdictPanel}><Gauge aria-hidden="true" /><h2>Set the verdict</h2><div className={styles.verdictButtons}><button aria-pressed={verdict === "edited"} onClick={() => setVerdict("edited")} type="button">Edited</button><button aria-pressed={verdict === "uncertain"} onClick={() => setVerdict("uncertain")} type="button"><CircleHelp aria-hidden="true" /> Uncertain</button><button aria-pressed={verdict === "ai"} onClick={() => setVerdict("ai")} type="button">AI-made</button></div><label>Confidence: {confidence}%<input max="100" min="0" onChange={(event) => setConfidence(Number(event.target.value))} type="range" value={confidence} /></label><button onClick={submit} type="button">Submit evidence verdict</button></div> : null}
        {experience.has("submit-verdict") ? <button className={styles.finishAction} onClick={experience.finish} type="button">Finish investigation</button> : null}
      </section>
    </CyberExperienceFrame>
  );
}
