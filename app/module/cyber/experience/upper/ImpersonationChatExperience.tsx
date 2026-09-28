"use client";

import { Ban, Camera, Contact, PhoneCall, ShieldAlert, Volume2 } from "lucide-react";
import { useState } from "react";
import type { CyberLessonComponentProps } from "../../lesson-types";
import { CyberExperienceFrame } from "../CyberExperienceFrame";
import { makeHints, makeMistake } from "../experience-content";
import type { ExperienceDefinition } from "../experience-types";
import { PhoneShell } from "../shells/PhoneShell";
import { useCyberExperience } from "../useCyberExperience";
import styles from "./upper-experiences.module.css";

const definition: ExperienceDefinition = {
  id: "impersonation-chat",
  objective: "Check before sending money.",
  place: "Fictional friend chat",
  guide: "Meera",
  scenes: ["Read request", "Inspect profile", "Call known number", "Block copy"],
  completionTitle: "Meera verified before acting!",
  completionSummary: "You used a known contact channel, confirmed the copy, saved evidence, and blocked it.",
  familyMove: "Choose a second contact channel for urgent money requests.",
  hints: makeHints("Read the urgent request.", "Inspect the account details.", "Do not verify inside the same chat.", "Call the saved number you already know."),
};

type Screen = "chat" | "profile" | "contacts" | "call";

export function ImpersonationChatExperience({ runtime, ...props }: CyberLessonComponentProps & { assessmentIds: readonly [string, string, string] }) {
  const experience = useCyberExperience(runtime, definition, props.assessmentIds);
  const [screen, setScreen] = useState<Screen>("chat");
  const [transcript, setTranscript] = useState(false);

  function inspectProfile() { setScreen("profile"); experience.act({ id: "inspect-profile", correct: true, assessmentIndex: 0, nextScene: 1 }); }
  function unsafeSend() { experience.act({ id: "send-money", correct: false, assessmentIndex: 0, unsafe: true, mistake: makeMistake("Urgency is not proof", "The copied profile asks Meera to act before checking.", "Pause and verify through a known second channel." ) }); }
  function openContacts() { setScreen("contacts"); experience.setScene(2); }
  function callKnown() { setScreen("call"); experience.act({ id: "call-known-number", correct: true, assessmentIndex: 1, nextScene: 2 }); }
  function saveEvidence() { experience.act({ id: "save-copy", correct: experience.has("call-known-number"), nextScene: 3 }); }
  function blockCopy() { experience.act({ id: "block-copy", correct: experience.has("save-copy"), assessmentIndex: 2, nextScene: 3 }); }

  return (
    <CyberExperienceFrame definition={definition} onHelp={experience.showHint} points={experience.points} runtime={runtime} scene={experience.scene} status={experience.has("block-copy") ? "Copied account blocked." : screen === "call" ? "Known contact confirmed the copy." : "Verify outside the urgent chat."}>
      <section className={styles.impersonationExperience} data-experience="impersonation-chat" data-interaction="social">
        <PhoneShell onBack={() => setScreen("chat")} onHome={() => setScreen("chat")} screen={screen} status="Fictional phone" title={screen === "chat" ? "Riya New" : screen === "profile" ? "Profile details" : screen === "contacts" ? "Saved contacts" : "Call connected"}>
          {screen === "chat" ? <div className={styles.friendChat}><div className={styles.friendMessage}><b>Riya New</b><p>{"Urgent! I am stuck. Send ₹2,000 now. Don't call."}</p></div><button className={styles.voiceNote} onClick={() => setTranscript(true)} type="button"><Volume2 aria-hidden="true" /> Voice note · 0:08</button>{transcript ? <p className={styles.transcript}>Transcript: “Please send quickly. My phone is broken.”</p> : null}<div><button onClick={inspectProfile} type="button"><Contact aria-hidden="true" /> View profile</button><button onClick={unsafeSend} type="button">₹ Send money</button></div></div> : null}
          {screen === "profile" ? <div className={styles.profileInspect}><span>👩🏽</span><h2>Riya New</h2><p>@riya_friend_2026</p><ul><li>Account created today</li><li>No shared school group</li><li>Different username</li></ul><button onClick={openContacts} type="button"><PhoneCall aria-hidden="true" /> Open saved contacts</button></div> : null}
          {screen === "contacts" ? <div className={styles.contacts}><h2>Saved contacts</h2><button onClick={callKnown} type="button"><span>R</span><div><b>Riya Sharma</b><small>Saved last year</small></div><PhoneCall aria-hidden="true" /></button></div> : null}
          {screen === "call" ? <div className={styles.callScreen}><span>👩🏽</span><h2>Riya Sharma</h2><b>“That message is not from me.”</b><p>Her original account still works.</p></div> : null}
        </PhoneShell>
        <aside className={styles.verificationPanel}><ShieldAlert aria-hidden="true" /><h2>Second-channel check</h2><ol><li className={experience.has("inspect-profile") ? styles.done : ""}>Inspect the new profile</li><li className={experience.has("call-known-number") ? styles.done : ""}>Call the saved number</li><li className={experience.has("save-copy") ? styles.done : ""}>Save evidence</li><li className={experience.has("block-copy") ? styles.done : ""}>Block the copied account</li></ol><button disabled={!experience.has("call-known-number") || experience.has("save-copy")} onClick={saveEvidence} type="button"><Camera aria-hidden="true" /> Save evidence</button><button disabled={!experience.has("save-copy") || experience.has("block-copy")} onClick={blockCopy} type="button"><Ban aria-hidden="true" /> Block copy</button></aside>
        {experience.has("block-copy") ? <button className={styles.finishAction} onClick={experience.finish} type="button">Finish verification</button> : null}
      </section>
    </CyberExperienceFrame>
  );
}
