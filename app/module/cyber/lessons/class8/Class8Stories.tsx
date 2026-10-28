"use client";

import { useState, type ComponentType } from "react";
import { FlaskConical, ShieldCheck, BrainCircuit, Search } from "lucide-react";
import type { Class8Chapter, TaskAnswer } from "../../../../data/class8/types";
import type { StoryChapter, StoryScript, StoryWorldProps } from "../new/story/types";
import { TaskBoard, initialAnswer } from "./TaskBoard";
import { WorldIllustration } from "./WorldIllustration";
import { recordTaskEvidence } from "./task-evidence";
import type { TaskDiagnosis } from "./task-feedback";
import { FeedbackPanel } from "./FeedbackPanel";
import { ui } from "./ui";
import s from "./class8.module.css";

export function createClass8Story(chapter: Class8Chapter, script: StoryScript): StoryChapter {
  return createStructuredStory(chapter, script);
}

export function createStructuredStory(chapter: Class8Chapter, script: StoryScript, options: {
  Illustration?: ComponentType<{theme:Class8Chapter["sceneTheme"];caption:string;resolved?:boolean}>;
  Character?: StoryChapter["Character"];
  labTitle?: string;
  teamName?: string;
  className?: string;
} = {}): StoryChapter {
  const Illustration = options.Illustration ?? WorldIllustration;
  function Class8World(props: StoryWorldProps) {
    const [answer, setAnswer] = useState<TaskAnswer>(initialAnswer(chapter.decision));
    const [diagnosis, setDiagnosis] = useState<TaskDiagnosis | null>(null);
    const current = chapter.scenes[props.scene];
    function check() {
      const result = recordTaskEvidence(chapter.decision, answer, (type, payload) => props.onActivity?.(type, payload), chapter.title.en);
      setDiagnosis(result);
      if (!result.complete) return;
      props.onActivity?.("story_answered", { id: `${chapter.slug}-story`, correct: result.correct, category: chapter.title.en.slice(0, 150), question: chapter.decision.prompt.en.slice(0, 300), feedback: result.summary.en });
      if (result.correct) props.markSolved();
    }
    return <div className={`${s.lesson} ${options.className ?? ""}`}><section className={s.world} data-class8-world={chapter.slug}>
      <header><FlaskConical size={19} aria-hidden="true" />{options.labTitle ?? ui.lab.en}</header>
      <h2>{current.title.en}</h2>
      <Illustration theme={chapter.sceneTheme} caption={current.dialogue.en} resolved={props.solved} />
      {props.scene === 3 && !props.solved && <><h3 data-exercise-prompt>{chapter.decision.prompt.en}</h3><TaskBoard task={chapter.decision} answer={answer} onChange={value => { setAnswer(value); setDiagnosis(null); props.setHint(""); }} onCheck={check} /></>}
      {props.scene >= 3 && <FeedbackPanel diagnosis={diagnosis} />}
      {props.solved && props.scene >= 4 && <p className={s.result}>{chapter.decision.success.en}</p>}
      {props.scene === 5 && <div className={s.topics}>{chapter.topics.map((topic, index) => <div key={topic.en}><b>{index + 1}</b>{topic.en}</div>)}</div>}
    </section></div>;
  }
  const icon = chapter.strand === "Cybersecurity" ? ShieldCheck : chapter.strand === "Artificial Intelligence" ? BrainCircuit : chapter.strand === "Cyber Fraud" ? Search : FlaskConical;
  return {
    script, title: chapter.title.en, icon, character: { asset: "girl-expressions", name: options.teamName ?? "Meera & Kabir" }, Character: options.Character,
    interactionScene: 3, beginLabel: ui.begin.en, waitingText: ui.storyWait.en, lockedHint: ui.storyLocked.en, managedFeedback: true,
    World: Class8World,
  };
}
