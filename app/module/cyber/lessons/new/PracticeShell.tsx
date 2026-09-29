"use client";

import { ArrowRight, Check, Lightbulb, RotateCcw, Sparkles } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { useState } from "react";
import type { CyberLessonComponentProps } from "../../lesson-types";
import { hasStoryChapter, StoryChapterPlayer } from "./story/registry";
import { StoryPrelude, stories, storyArcs } from "./StoryPrelude";
import styles from "./practice.module.css";

// Practice keeps the chapter's illustrated world after the story ends.
const sceneArt: Record<string, string> = {
  "pattern-detective": "pattern-station.webp",
  "step-by-step-morning": "morning-room.webp",
  "flowchart-architect": "engineering-lab.webp",
  "loop-inspector": "engineering-lab.webp",
  "complex-algorithmic-logic": "refined/report-card-workshop.webp",
  "algorithm-optimization": "refined/sports-day-sort.webp",
  "nanis-secret-code": "refined/nani-carrom.webp",
  "surprise-pop-up": "refined/castle-game.webp",
  "otp-guardian": "refined/nani-phone-call.webp",
  "qr-code-caution": "bookshop-payment.webp",
  "digital-arrest-simulation": "refined/pretend-caller.webp",
  "deepfake-voice-relative-scam": "refined/nani-carrom.webp",
  "password-vault-builder": "moonbase-story.webp",
  "sharing-backpack": "refined/tiger-drawing.webp",
  "password-vault": "refined/sky-garden.webp",
  "permission-control-panel": "refined/torch-permissions.webp",
  "online-reputation-builder": "refined/solar-filter.webp",
  "email-header-inspector": "refined/scholarship-inbox.webp",
  "robot-or-not": "morning-room.webp",
  "teach-pet-machine": "refined/pet-market.webp",
  "training-day": "dog-indie.jpg",
  "garbage-in-garbage-out": "refined/bakery-interior.webp",
  "deepfake-detective": "fairground-vault.jpg",
  "recommendation-rabbit-hole": "refined/recommendation-feed.webp",
};
const permissionSceneArt = ["refined/torch-permissions.webp", "refined/city-map-permission.webp", "refined/class-video-permission.webp"];

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
    const question = document.querySelector(`[data-new-mission="${lesson.slug}"] [data-exercise-prompt]`)?.textContent ?? undefined;
    const recorded = runtime.recordDecision({
      id,
      correct,
      kind: stage === 2 ? "recall" : "drill",
      category: lesson.primaryMechanic,
      unsafe,
      feedback: message,
      question,
    });
    if (!recorded) runtime.trackActivity("question_answered", { id, correct, kind: stage === 2 ? "recall" : "drill", category: lesson.primaryMechanic, feedback: message, question, retry: true });
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
  const scene = lesson.slug === "permission-control-panel" ? permissionSceneArt[Math.min(stage, 2)] : sceneArt[lesson.slug] ?? "engineering-lab.webp";
  const sceneStyle = { "--practice-scene": `url("/cyber-missions/${scene}")` } as CSSProperties;
  if (runtime.completed) {
    return (
      <section className={styles.complete} style={sceneStyle} data-mission-complete={lesson.slug}>
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
      <section className={styles.complete} style={sceneStyle} data-mission-ready={lesson.slug}>
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
      return <StoryChapterPlayer slug={lesson.slug} onBegin={beginStory} onActivity={runtime.trackActivity} />;
    }
    return <StoryPrelude lesson={lesson} art={art} onBegin={beginStory} />;
  }

  return (
    <section className={styles.shell} style={sceneStyle} data-tone={tone} data-band={lesson.band} data-stage={stage} data-ready={ready} data-new-mission={lesson.slug}>
      <div className={styles.hero} data-art={art || undefined}>
        <div className={styles.heroCopy}>
          <h1>{lesson.title}</h1>
          <p className={styles.practiceMeta}>Class {props.grade} · {eyebrow} · Challenge {stage + 1} of 3</p>
          <p>{arc?.[stage] ?? brief}</p>
        </div>
        <div className={styles.progress} aria-label={`${stage} of 3 challenges solved`}>
          {[0, 1, 2].map((index) => <span className={index < stage ? styles.done : index === stage ? styles.active : ""} key={index}>{index < stage ? <Check aria-hidden="true" /> : index + 1}</span>)}
        </div>
      </div>
      <div className={styles.workbench}>
        <div className={styles.concept}><Lightbulb aria-hidden="true" /><p>{brief}</p></div>
        <div className={styles.questionHead}>
          <h2 id={`practice-prompt-${lesson.slug}-${stage}`} data-exercise-prompt>{prompt}</h2>
        </div>
        <fieldset className={styles.activity} aria-labelledby={`practice-prompt-${lesson.slug}-${stage}`} disabled={ready}>{children}</fieldset>
        <div className={styles.feedbackRow}>
          <p role="status" aria-live="polite" className={feedback ? styles.feedback : styles.feedbackEmpty} data-result={feedback ? feedbackCorrect ? "correct" : "retry" : undefined}>{feedback && (feedbackCorrect ? <Check aria-hidden="true" /> : <RotateCcw aria-hidden="true" />)}{feedback}</p>
          {ready ? <button className={styles.primary} onClick={onContinue} type="button">{stage === 2 ? "Review mission" : "Next challenge"}<ArrowRight aria-hidden="true" /></button> : null}
        </div>
      </div>
    </section>
  );
}
