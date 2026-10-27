"use client";

import { useState } from "react";
import { FlaskConical, ShieldCheck, BrainCircuit, Search } from "lucide-react";
import type { Class8Chapter, TaskAnswer } from "../../../../data/class8/types";
import type { StoryChapter, StoryScript, StoryWorldProps } from "../new/story/types";
import { TaskBoard, initialAnswer } from "./TaskBoard";
import { WorldIllustration } from "./WorldIllustration";
import { evaluateTask } from "./task-evaluation";
import { ui } from "./ui";
import s from "./class8.module.css";

export function createClass8Story(chapter: Class8Chapter, script: StoryScript): StoryChapter {
  function Class8World(props: StoryWorldProps) {
    const [answer, setAnswer] = useState<TaskAnswer>(initialAnswer(chapter.decision));
    const current = chapter.scenes[props.scene];
    function check() {
      const result = evaluateTask(chapter.decision, answer);
      if (result.correct) props.markSolved();
      else props.setHint(result.feedback.en, false);
    }
    return <div className={s.lesson}><section className={s.world} data-class8-world={chapter.slug}>
      <header><FlaskConical size={19} aria-hidden="true" />{ui.lab.en}</header>
      <h2>{current.title.en}</h2>
      <WorldIllustration theme={chapter.sceneTheme} caption={current.dialogue.en} resolved={props.solved} />
      {props.scene === 3 && !props.solved && <><h3 data-exercise-prompt>{chapter.decision.prompt.en}</h3><TaskBoard task={chapter.decision} answer={answer} onChange={setAnswer} onCheck={check} /></>}
      {props.solved && props.scene >= 4 && <p className={s.result}>{chapter.decision.success.en}</p>}
      {props.scene === 5 && <div className={s.topics}>{chapter.topics.map((topic, index) => <div key={topic.en}><b>{index + 1}</b>{topic.en}</div>)}</div>}
    </section></div>;
  }
  const icon = chapter.strand === "Cybersecurity" ? ShieldCheck : chapter.strand === "Artificial Intelligence" ? BrainCircuit : chapter.strand === "Cyber Fraud" ? Search : FlaskConical;
  return {
    script, title: chapter.title.en, icon, character: { asset: "girl-expressions", name: "Meera & Kabir" },
    interactionScene: 3, beginLabel: ui.begin.en, waitingText: ui.storyWait.en, lockedHint: ui.storyLocked.en,
    World: Class8World,
  };
}
