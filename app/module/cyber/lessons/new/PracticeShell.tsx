"use client";

import { ArrowRight, Check, Lightbulb, RotateCcw, Sparkles } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { useState } from "react";
import { originalText } from "../../../../lib/i18n/localize-dom";
import type { CyberLessonComponentProps } from "../../lesson-types";
import { hasStoryChapter, StoryChapterPlayer } from "./story/registry";
import { StoryPrelude, stories, storyArcs } from "./StoryPrelude";
import styles from "./practice.module.css";

// Practice keeps the chapter's illustrated world after the story ends.
const sceneArt: Record<string, string> = {
  "the-easy-money-recruitment-chain": "class-12/fraud-casework-desk.webp",
  "check-the-investment-story": "class-12/fraud-casework-desk.webp",
  "identity-and-authority-can-be-manufactured": "class-12/fraud-casework-desk.webp",
  "help-after-harm": "class-12/fraud-casework-desk.webp",
  "trace-a-pattern-without-accusing": "class-12/fraud-casework-desk.webp",
  "design-prevention-that-can-be-tested": "class-12/fraud-evidence-hearing.webp",
  "integrated-case-the-college-fest-incident": "class-12/fraud-evidence-hearing.webp",
  "the-evidence-hearing": "class-12/fraud-evidence-hearing.webp",

  "choose-the-right-data-model": "class-12/ct-registration-workbench.webp",
  "how-work-grows-with-input-size": "class-12/ct-registration-workbench.webp",
  "the-duplicate-registration-problem": "class-12/ct-registration-workbench.webp",
  "build-a-reliable-alerts-pipeline": "class-12/ct-alerts-pipeline.webp",
  "make-failure-visible": "class-12/ct-alerts-pipeline.webp",
  "do-not-confuse-a-pattern-with-a-cause": "class-12/ct-alerts-pipeline.webp",
  "retest-after-a-change": "class-12/ct-alerts-pipeline.webp",
  "automation-design-review": "class-12/ct-alerts-pipeline.webp",

  "set-a-decision-and-a-baseline": "class-12/ai-evaluation-workshop.webp",
  "protect-the-evaluation": "class-12/ai-evaluation-workshop.webp",
  "the-model-that-scores-95-percent": "class-12/ai-evaluation-workshop.webp",
  "vision-networks-and-changing-inputs": "class-12/ai-evaluation-workshop.webp",
  "the-source-grounded-research-assistant": "class-12/ai-evidence-workbench.webp",
  "when-instructions-arrive-inside-data": "class-12/ai-evidence-workbench.webp",
  "who-benefits-who-is-missed": "class-12/ai-evidence-workbench.webp",
  "ai-go-revise-stop-review": "class-12/ai-evidence-workbench.webp",

  "from-personal-safety-to-system-risk": "class-12/portal-design-room.webp",
  "design-the-college-fest-portal": "class-12/portal-design-room.webp",
  "secure-by-design": "class-12/portal-design-room.webp",
  "protect-the-whole-dependency-chain": "class-12/portal-design-room.webp",
  "when-logs-disagree": "class-12/incident-recovery-room.webp",
  "the-breach-tabletop": "class-12/incident-recovery-room.webp",
  "recover-and-learn": "class-12/incident-recovery-room.webp",
  "security-assurance-review": "class-12/portal-design-room.webp",

  "how-a-scam-builds-pressure": "class-11/fraud-offer-desk.webp",
  "the-internship-that-pays-too-well": "class-11/fraud-offer-desk.webp",
  "before-you-approve-that-payment": "class-11/fraud-payment-pause.webp",
  "when-the-message-looks-official": "class-11/fraud-offer-desk.webp",
  "a-familiar-voice-asks-for-money": "class-11/fraud-payment-pause.webp",
  "what-to-do-after-a-loss": "class-11/fraud-payment-pause.webp",
  "integrated-case-the-festival-refund": "class-11/fraud-payment-pause.webp",
  "defend-your-decision": "class-11/fraud-payment-pause.webp",

  "decompose-the-scholarship-desk": "class-11/ct-scholarship-desk.webp",
  "model-only-what-matters": "class-11/ct-scholarship-desk.webp",
  "make-the-rules-explicit": "class-11/ct-logic-workbench.webp",
  "trace-and-debug-a-decision": "class-11/ct-logic-workbench.webp",
  "search-and-sort-with-purpose": "class-11/ct-logic-workbench.webp",
  "reuse-a-reliable-step": "class-11/ct-scholarship-desk.webp",
  "test-the-boundaries": "class-11/ct-logic-workbench.webp",
  "algorithm-review-board": "class-11/ct-scholarship-desk.webp",

  "is-ai-needed-here": "class-11/festival-planning.webp",
  "frame-a-useful-ai-problem": "class-11/festival-planning.webp",
  "repair-the-dataset": "class-11/ai-sorting-lab.webp",
  "how-a-model-learns": "class-11/ai-sorting-lab.webp",
  "measure-mistakes-not-confidence": "class-11/ai-sorting-lab.webp",
  "whose-examples-are-missing": "class-11/ai-sorting-lab.webp",
  "can-this-assistant-be-trusted": "class-11/ai-source-desk.webp",
  "ai-evaluation-review": "class-11/ai-source-desk.webp",

  "your-digital-risk-map": "class-11/festival-planning.webp",
  "identity-beyond-a-password": "class-11/account-access.webp",
  "who-should-have-access": "class-11/account-access.webp",
  "what-a-browser-can-tell-you": "class-11/account-access.webp",
  "data-has-a-lifecycle": "class-11/festival-planning.webp",
  "devices-updates-and-backups": "class-11/gate-recovery.webp",
  "the-suspicious-login": "class-11/account-access.webp",
  "security-design-review": "class-11/festival-planning.webp",

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
    const question = originalText(document.querySelector(`[data-new-mission="${lesson.slug}"] [data-exercise-prompt]`));
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

  function clearFeedback() {
    setFeedback("");
    setFeedbackCorrect(false);
  }

  function finish() {
    runtime.completeLesson({
      title: `${lesson.title} complete`,
      summary: `You solved three practice challenges in ${lesson.title}.`,
    });
  }

  return { stage, feedback, feedbackCorrect, ready, submit, clearFeedback, continuePractice, finish };
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
  evidence,
  feedbackContent,
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
  evidence?: ReactNode;
  feedbackContent?: ReactNode;
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
        {evidence}
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
        {evidence}
        <button className={styles.primary} onClick={onFinish} type="button">Finish chapter <ArrowRight aria-hidden="true" /></button>
      </section>
    );
  }

  const storyKey = `story-${lesson.slug}`;
  if (stage === 0 && (stories[lesson.slug] || hasStoryChapter(lesson.slug)) && runtime.state[storyKey] !== true) {
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
          {feedbackContent ?? <p role="status" aria-live="polite" className={feedback ? styles.feedback : styles.feedbackEmpty} data-result={feedback ? feedbackCorrect ? "correct" : "retry" : undefined}>{feedback && (feedbackCorrect ? <Check aria-hidden="true" /> : <RotateCcw aria-hidden="true" />)}{feedback}</p>}
          {ready ? <button className={styles.primary} onClick={onContinue} type="button">{stage === 2 ? "Review mission" : "Next challenge"}<ArrowRight aria-hidden="true" /></button> : null}
        </div>
      </div>
    </section>
  );
}
