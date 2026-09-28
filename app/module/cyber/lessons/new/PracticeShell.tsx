"use client";

import { ArrowRight, Check, Lightbulb, RotateCcw, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import type { CyberLessonComponentProps } from "../../lesson-types";
import { hasStoryChapter, StoryChapterPlayer } from "./story/registry";
import { StoryPrelude, stories, storyArcs } from "./StoryPrelude";
import styles from "./practice.module.css";

export type PracticeProps = CyberLessonComponentProps;

export function usePractice({ lesson, runtime }: PracticeProps) {
  const stateKey = `practice-${lesson.slug}`;
  const saved = runtime.state[stateKey];
  const stage = typeof saved === "number" && saved >= 0 && saved <= 3 ? saved : 0;
  const [feedback, setFeedback] = useState("");
  const [feedbackCorrect, setFeedbackCorrect] = useState(false);
  const [ready, setReady] = useState(false);

  function submit(correct: boolean, message: string, unsafe = false) {
    if (ready) return;
    const id = lesson.assessmentIds[stage];
    if (!id) return;
    runtime.recordDecision({
      id,
      correct,
      kind: stage === 2 ? "recall" : "drill",
      category: lesson.primaryMechanic,
      unsafe,
    });
    setFeedback(message);
    setFeedbackCorrect(correct);
    if (correct) {
      setReady(true);
    }
  }

  function continuePractice() {
    const next = stage + 1;
    runtime.updateState({ [stateKey]: next });
    runtime.setCheckpoint(next === 3 ? "Review" : `Practice ${next + 1} of 3`);
    setReady(false);
    setFeedback("");
    setFeedbackCorrect(false);
  }

  function finish() {
    runtime.completeLesson({
      title: `${lesson.title} complete`,
      summary: `You solved three practice challenges in ${lesson.title}.`,
    });
  }

  return { stage, feedback, feedbackCorrect, ready, submit, continuePractice, finish };
}

export function PracticeShell({
  props,
  stage,
  eyebrow,
  brief,
  prompt,
  feedback,
  feedbackCorrect,
  ready,
  children,
  onFinish,
  onContinue,
  tone = "logic",
  art = false,
}: {
  props: PracticeProps;
  stage: number;
  eyebrow: string;
  brief: string;
  prompt: string;
  feedback: string;
  feedbackCorrect: boolean;
  ready: boolean;
  children: ReactNode;
  onFinish: () => void;
  onContinue: () => void;
  tone?: "logic" | "safety";
  art?: "station" | "phone" | "morning" | "lab" | "market" | "vault" | "fair-vault" | "ai" | "media" | false;
}) {
  const { lesson, runtime } = props;
  const arc = storyArcs[lesson.slug];
  if (runtime.completed) {
    return (
      <section className={styles.complete} data-mission-complete={lesson.slug}>
        <span className={styles.completeMark}><Check aria-hidden="true" /></span>
        <p className={styles.eyebrow}>Mission complete</p>
        <h1>{lesson.title}</h1>
        <p>{arc?.[3] ?? "You practised three different challenges. The best way to remember this skill is to use it again."}</p>
        <div className={styles.family}><Lightbulb aria-hidden="true" /><span><strong>Try together</strong>{lesson.familyAction}</span></div>
        <button className={styles.secondary} onClick={runtime.resetLesson} type="button"><RotateCcw aria-hidden="true" /> Practise again</button>
      </section>
    );
  }

  if (stage >= 3) {
    return (
      <section className={styles.complete} data-mission-ready={lesson.slug}>
        <span className={styles.completeMark}><Sparkles aria-hidden="true" /></span>
        <p className={styles.eyebrow}>Three challenges solved</p>
        <h1>{arc ? "The story has a new ending." : "Nice work. You built the skill."}</h1>
        <p>{arc?.[3] ?? (feedback || brief)}</p>
        <button className={styles.primary} onClick={onFinish} type="button">Finish chapter <ArrowRight aria-hidden="true" /></button>
      </section>
    );
  }

  const storyKey = `story-${lesson.slug}`;
  if (stage === 0 && stories[lesson.slug] && runtime.state[storyKey] !== true) {
    const beginStory = () => {
      runtime.updateState({ [storyKey]: true });
      runtime.setCheckpoint("Practice 1 of 3");
      requestAnimationFrame(() => document.getElementById("cyber-lesson-content")?.scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }));
    };
    if (hasStoryChapter(lesson.slug)) {
      return <StoryChapterPlayer slug={lesson.slug} onBegin={beginStory} />;
    }
    return <StoryPrelude lesson={lesson} art={art} onBegin={beginStory} />;
  }

  return (
    <section className={styles.shell} data-tone={tone} data-new-mission={lesson.slug}>
      <div className={styles.hero} data-art={art || undefined}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>{eyebrow} · Practice {stage + 1} of 3</p>
          <h1>{lesson.title}</h1>
          <p>{arc?.[stage] ?? brief}</p>
        </div>
        <div className={styles.progress} aria-label={`${stage} of 3 challenges solved`}>
          {[0, 1, 2].map((index) => <span className={index < stage ? styles.done : index === stage ? styles.active : ""} key={index}>{index < stage ? <Check aria-hidden="true" /> : index + 1}</span>)}
        </div>
      </div>
      <div className={styles.workbench}>
        <div className={styles.questionHead}>
          <span>YOUR MOVE</span>
          <h2>{prompt}</h2>
        </div>
        <fieldset className={styles.activity} disabled={ready}>{children}</fieldset>
        <div className={styles.feedbackRow}><p aria-live="polite" className={feedback ? styles.feedback : styles.feedbackEmpty} data-result={feedback ? feedbackCorrect ? "correct" : "retry" : undefined}>{feedback}</p>{ready ? <button className={styles.primary} onClick={onContinue} type="button">{stage === 2 ? "Review mission" : "Next challenge"}<ArrowRight aria-hidden="true" /></button> : null}</div>
      </div>
    </section>
  );
}
