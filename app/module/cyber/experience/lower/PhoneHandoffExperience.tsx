"use client";

import { LockKeyhole, Play, ShieldCheck, Smartphone } from "lucide-react";
import { useState } from "react";
import type { CyberLessonComponentProps } from "../../lesson-types";
import { CyberExperienceFrame } from "../CyberExperienceFrame";
import { makeHints, makeMistake } from "../experience-content";
import type { ExperienceDefinition } from "../experience-types";
import { PhoneShell } from "../shells/PhoneShell";
import { useCyberExperience } from "../useCyberExperience";
import styles from "./lower-experiences.module.css";

const definition: ExperienceDefinition = {
  id: "phone-handoff",
  objective: "Stop and hand it back.",
  place: "A borrowed phone",
  guide: "Tara",
  scenes: ["Watch", "Unexpected screen", "Lock", "Handoff"],
  completionTitle: "The phone reached a trusted adult!",
  completionSummary: "You stopped when money and secret-code screens appeared.",
  familyMove: "Agree on one family handoff rule for unexpected phone screens.",
  hints: makeHints("Play the pretend video.", "An unexpected screen will appear.", "Do not type, pay, or install anything.", "Lock the phone and give it back."),
};

export function PhoneHandoffExperience({ runtime, ...props }: CyberLessonComponentProps & { assessmentIds: readonly [string, string, string] }) {
  const experience = useCyberExperience(runtime, definition, props.assessmentIds);
  const [screen, setScreen] = useState<"video" | "payment" | "locked">("video");
  const [dragging, setDragging] = useState(false);

  function play() { setScreen("payment"); experience.setScene(1); }
  function unsafeContinue() { experience.act({ id: "continue-payment", correct: false, assessmentIndex: 0, unsafe: true, mistake: makeMistake("This screen belongs to the adult", "A child using a borrowed phone should not continue a payment, OTP, install, or unknown link.", "Stop as soon as the activity changes." ) }); }
  function lock() { setScreen("locked"); experience.act({ id: "lock-phone", correct: true, assessmentIndex: 0, nextScene: 2 }); }
  function handoff() { if (screen !== "locked") return; experience.act({ id: "adult-handoff", correct: true, assessmentIndex: 1, nextScene: 3 }); setDragging(false); }
  function explain() { experience.act({ id: "explain-screen", correct: experience.has("adult-handoff"), assessmentIndex: 2, nextScene: 3 }); }

  return (
    <CyberExperienceFrame definition={definition} onHelp={experience.showHint} points={experience.points} runtime={runtime} scene={experience.scene} status={experience.has("explain-screen") ? "Adult informed. Phone safe." : screen === "payment" ? "Unexpected payment screen. Stop." : screen === "locked" ? "Move the phone to the adult." : "Play the fictional video."}>
      <section className={styles.handoffExperience} data-experience="phone-handoff" data-interaction="phone">
        <div draggable={screen === "locked"} onDragStart={() => setDragging(true)}>
          <PhoneShell onHome={() => undefined} screen={screen} status="Fictional phone" title={screen === "video" ? "Kids Video" : screen === "payment" ? "Payment request" : "Locked"}>
            {screen === "video" ? <div className={styles.videoScreen}><div>🐘</div><b>Elephant dance</b><button onClick={play} type="button"><Play aria-hidden="true" /> Play</button></div> : null}
            {screen === "payment" ? <div className={styles.paymentInterrupt}><span>₹</span><h2>Pay ₹499?</h2><p>Enter secret code to continue.</p><button onClick={unsafeContinue} type="button">Continue payment</button><button onClick={lock} type="button"><LockKeyhole aria-hidden="true" /> Lock phone</button></div> : null}
            {screen === "locked" ? <div className={styles.lockedScreen}><LockKeyhole aria-hidden="true" /><b>Phone locked</b><small>Drag or tap handoff.</small></div> : null}
          </PhoneShell>
        </div>
        <button className={`${styles.adultStation} ${dragging ? styles.adultReady : ""}`} disabled={screen !== "locked" || experience.has("adult-handoff")} onClick={handoff} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); handoff(); }} type="button"><span>🧑🏽</span><b>Trusted adult</b><small>Drop phone here</small></button>
        {experience.has("adult-handoff") && !experience.has("explain-screen") ? <button className={styles.bigAction} onClick={explain} type="button"><ShieldCheck aria-hidden="true" /> Say what appeared</button> : null}
        {experience.has("explain-screen") ? <button className={styles.finishAction} onClick={experience.finish} type="button"><Smartphone aria-hidden="true" /> Finish handoff</button> : null}
      </section>
    </CyberExperienceFrame>
  );
}
