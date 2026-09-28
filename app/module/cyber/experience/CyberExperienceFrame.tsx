"use client";

import { Gem, HelpCircle, RotateCcw, Sparkles, Volume2, VolumeX } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { useState } from "react";
import { LearningHelpButton } from "../../../components/learning/LearningSupport";
import type { CyberLessonRuntime } from "../lesson-types";
import { CyberCharacter, CyberSquad } from "../world/CyberCast";
import type { ExperienceDefinition } from "./experience-types";
import styles from "./cyber-experience-frame.module.css";

export function CyberExperienceFrame({
  definition,
  runtime,
  scene,
  points,
  status,
  children,
  onHelp,
}: {
  definition: ExperienceDefinition;
  runtime: CyberLessonRuntime;
  scene: number;
  points: number;
  status: string;
  children: ReactNode;
  onHelp: () => void;
}) {
  const [soundOn, setSoundOn] = useState(true);

  if (runtime.completed) {
    return (
      <section className={styles.completion} data-experience-complete={definition.id}>
        <Sparkles aria-hidden="true" className={styles.sparkles} />
        <div className={styles.completionCast}>
          <CyberCharacter active expression="happy" name={definition.guide} />
          <CyberCharacter active expression="happy" name="Byte" />
        </div>
        <p>MISSION COMPLETE</p>
        <h1>{runtime.completion?.title ?? definition.completionTitle}</h1>
        <div className={styles.completionScore}><Gem aria-hidden="true" /><b>{points}</b><span>shield points</span></div>
        <div className={styles.familyMove}><span aria-hidden="true">🏠</span><b>Try together</b><p>{definition.familyMove}</p></div>
      </section>
    );
  }

  return (
    <section className={styles.experience} data-experience-frame={definition.id}>
      <header className={styles.header}>
        <CyberSquad guide={definition.guide} />
        <div className={styles.title}>
          <span>{definition.place}</span>
          <h1>{definition.objective}</h1>
        </div>
        <div className={styles.tools}>
          <div aria-label={`${points} shield points`} className={styles.points}><Gem aria-hidden="true" /><b>{points}</b></div>
          <button aria-label={soundOn ? "Turn sounds off" : "Turn sounds on"} aria-pressed={soundOn} onClick={() => setSoundOn((value) => !value)} type="button">
            {soundOn ? <Volume2 aria-hidden="true" /> : <VolumeX aria-hidden="true" />}
          </button>
          <LearningHelpButton onClick={onHelp} open={Boolean(runtime.hints)} />
        </div>
      </header>

      <div className={styles.progress}>
        <div aria-label={`Scene ${scene + 1} of ${definition.scenes.length}`} aria-valuemax={definition.scenes.length} aria-valuemin={1} aria-valuenow={scene + 1} role="progressbar" style={{ "--progress-count": definition.scenes.length } as CSSProperties}>
          {definition.scenes.map((name, index) => <i className={index <= scene ? styles.progressDone : ""} key={name} />)}
        </div>
        <strong>{definition.scenes[scene]}</strong>
      </div>

      <main className={styles.stage}>{children}</main>

      <footer className={styles.status} aria-live="polite">
        <HelpCircle aria-hidden="true" />
        <strong>{status}</strong>
        <button onClick={runtime.resetLesson} type="button"><RotateCcw aria-hidden="true" /> Start over</button>
      </footer>
    </section>
  );
}
