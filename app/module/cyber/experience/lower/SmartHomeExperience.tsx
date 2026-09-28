"use client";

import { Bot, Check, Play, RotateCw } from "lucide-react";
import { useState } from "react";
import type { CyberLessonComponentProps } from "../../lesson-types";
import { CyberExperienceFrame } from "../CyberExperienceFrame";
import { makeHints, makeMistake } from "../experience-content";
import type { ExperienceDefinition } from "../experience-types";
import { useCyberExperience } from "../useCyberExperience";
import styles from "./lower-experiences.module.css";

const definition: ExperienceDefinition = {
  id: "smart-home",
  objective: "Test each home helper.",
  place: "Byte's home lab",
  guide: "Tara",
  scenes: ["Operate", "Observe", "Sort"],
  completionTitle: "Home helper lab complete!",
  completionSummary: "You tested what follows a rule and what makes a data-based guess.",
  familyMove: "Operate one normal tool and one smart helper, then compare them.",
  hints: makeHints("Try one control.", "Press a device button.", "A fixed tool repeats the same rule.", "Watch before you label the helper."),
};

const devices = [
  { id: "lamp", icon: "💡", name: "Lamp timer", kind: "rule", result: "Turns on at 7:00" },
  { id: "speaker", icon: "🔊", name: "Music helper", kind: "guess", result: "Suggests a song" },
  { id: "alarm", icon: "⏰", name: "Alarm", kind: "rule", result: "Rings after 5 minutes" },
  { id: "stories", icon: "📺", name: "Story picker", kind: "guess", result: "Picks what you may like" },
] as const;

export function SmartHomeExperience({ runtime, ...props }: CyberLessonComponentProps & { assessmentIds: readonly [string, string, string] }) {
  const experience = useCyberExperience(runtime, definition, props.assessmentIds);
  const [running, setRunning] = useState<string | null>(null);
  const completed = devices.filter((device) => experience.has(`classify-${device.id}`)).length;

  function classify(device: (typeof devices)[number], kind: "rule" | "guess") {
    experience.act({
      id: `classify-${device.id}`,
      correct: device.kind === kind,
      assessmentIndex: completed === 0 ? 0 : completed === 2 ? 1 : completed === 3 ? 2 : undefined,
      nextScene: completed >= 3 ? 2 : 1,
      mistake: makeMistake("Operate it once more", "A rule repeats the same instruction. A smart guess changes using examples or past activity.", "Observe the result before naming the helper."),
    });
  }

  return (
    <CyberExperienceFrame definition={definition} onHelp={experience.showHint} points={experience.points} runtime={runtime} scene={experience.scene} status={completed === devices.length ? "Every helper tested." : "Operate, observe, then label."}>
      <section className={styles.homeExperience} data-experience="smart-home" data-interaction="lab">
        <div className={styles.homeGrid}>
          {devices.map((device, index) => {
            const tested = experience.has(`classify-${device.id}`);
            const choices = index % 2 ? (["guess", "rule"] as const) : (["rule", "guess"] as const);
            return (
              <article className={tested ? styles.deviceDone : ""} key={device.id}>
                <span aria-hidden="true">{device.icon}</span><h2>{device.name}</h2>
                <button onClick={() => setRunning(device.id)} type="button">{running === device.id ? <RotateCw aria-hidden="true" /> : <Play aria-hidden="true" />}{running === device.id ? "Run again" : "Operate"}</button>
                <div className={styles.deviceResult} aria-live="polite">{running === device.id ? device.result : "Press operate"}</div>
                {running === device.id && !tested ? <div className={styles.deviceLabels}>{choices.map((choice) => <button key={choice} onClick={() => classify(device, choice)} type="button">{choice === "rule" ? "⚙️ Fixed rule" : "✨ Smart guess"}</button>)}</div> : null}
                {tested ? <b className={styles.checked}><Check aria-hidden="true" /> Tested</b> : null}
              </article>
            );
          })}
        </div>
        {completed === devices.length ? <button className={styles.finishAction} onClick={experience.finish} type="button"><Bot aria-hidden="true" /> Close the lab</button> : null}
      </section>
    </CyberExperienceFrame>
  );
}
