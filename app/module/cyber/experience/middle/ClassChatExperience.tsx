"use client";

import { Ban, Camera, Forward, HandHeart, Pause, ShieldAlert } from "lucide-react";
import { useState } from "react";
import type { CyberLessonComponentProps } from "../../lesson-types";
import { CyberExperienceFrame } from "../CyberExperienceFrame";
import { makeHints, makeMistake } from "../experience-content";
import type { ExperienceDefinition } from "../experience-types";
import { PhoneShell } from "../shells/PhoneShell";
import { useCyberExperience } from "../useCyberExperience";
import styles from "./middle-experiences.module.css";

const definition: ExperienceDefinition = {
  id: "class-chat",
  objective: "Calm the class chat.",
  place: "Class 5A group",
  guide: "Kabir",
  scenes: ["Messages arrive", "Freeze", "Report", "Support"],
  completionTitle: "The class chat is safer!",
  completionSummary: "You stopped the spread, saved evidence, reported harm, and supported a classmate.",
  familyMove: "Practise one supportive message for someone targeted in a group chat.",
  hints: makeHints("Read the newest message.", "Freeze the chat first.", "Save evidence without forwarding it.", "Report harm and support the student."),
};

const messages = [
  ["Aarav", "Science worksheet page 4?", "10:12"],
  ["Maya", "Yes, question 3 onwards.", "10:13"],
  ["Rex_5A", "Look at this embarrassing photo of Maya 😂", "10:14"],
];

export function ClassChatExperience({ runtime, ...props }: CyberLessonComponentProps & { assessmentIds: readonly [string, string, string] }) {
  const experience = useCyberExperience(runtime, definition, props.assessmentIds);
  const [visibleMessages, setVisibleMessages] = useState(1);
  const [supportText, setSupportText] = useState("");

  function nextMessage() { setVisibleMessages((value) => Math.min(messages.length, value + 1)); if (visibleMessages >= 1) experience.setScene(1); }
  function freeze() { experience.act({ id: "freeze-chat", correct: visibleMessages === messages.length, assessmentIndex: 0, nextScene: 1 }); }
  function forward() { experience.act({ id: "forward-harm", correct: false, assessmentIndex: 1, unsafe: true, mistake: makeMistake("Forwarding spreads the harm", "Even forwarding to warn others creates another copy.", "Preserve evidence privately; do not forward the post." ) }); }
  function save() { experience.act({ id: "save-evidence", correct: experience.has("freeze-chat"), assessmentIndex: 1, nextScene: 2 }); }
  function report() { experience.act({ id: "report-harm", correct: experience.has("save-evidence"), nextScene: 3 }); }
  function support() { experience.act({ id: "support-maya", correct: supportText.trim().length >= 4 && experience.has("report-harm"), assessmentIndex: 2, nextScene: 3, mistake: makeMistake("Support without repeating the post", "A short private message can show Maya she is not alone.", "Be kind, do not blame, and suggest trusted help." ) }); }

  return (
    <CyberExperienceFrame definition={definition} onHelp={experience.showHint} points={experience.points} runtime={runtime} scene={experience.scene} status={experience.has("support-maya") ? "Maya supported. Harm reported." : experience.has("freeze-chat") ? "Chat frozen. Preserve evidence." : "Let the conversation arrive."}>
      <section className={styles.chatExperience} data-experience="class-chat" data-interaction="social">
        <PhoneShell onHome={() => undefined} screen="class-group" status="Fictional chat" title="Class 5A · 31 members">
          <div className={styles.chatMessages}>{messages.slice(0, visibleMessages).map(([name, text, time], index) => <article className={index === 2 ? styles.harmMessage : ""} key={time}><span>{name[0]}</span><div><b>{name}</b><p>{text}</p><small>{time}</small></div></article>)}{visibleMessages < messages.length ? <button className={styles.nextMessage} onClick={nextMessage} type="button">Show next message</button> : null}</div>
          {visibleMessages === messages.length ? <div className={styles.chatTools}><button disabled={experience.has("freeze-chat")} onClick={freeze} type="button"><Pause aria-hidden="true" /> Freeze</button><button onClick={forward} type="button"><Forward aria-hidden="true" /> Forward</button><button disabled={!experience.has("freeze-chat") || experience.has("save-evidence")} onClick={save} type="button"><Camera aria-hidden="true" /> Save</button><button disabled={!experience.has("save-evidence") || experience.has("report-harm")} onClick={report} type="button"><ShieldAlert aria-hidden="true" /> Report</button></div> : null}
        </PhoneShell>
        <aside className={styles.supportPanel}><HandHeart aria-hidden="true" /><h2>Support Maya privately</h2><p>Write a short fictional support message.</p><textarea maxLength={80} onChange={(event) => setSupportText(event.target.value)} placeholder="Example: I am here with you." value={supportText} /><button disabled={!experience.has("report-harm") || experience.has("support-maya")} onClick={support} type="button"><Ban aria-hidden="true" /> Send support</button></aside>
        {experience.has("support-maya") ? <button className={styles.finishAction} onClick={experience.finish} type="button">Close class chat</button> : null}
      </section>
    </CyberExperienceFrame>
  );
}
