"use client";

import {
  AlertCircle,
  ArrowRight,
  BrainCircuit,
  Check,
  Lightbulb,
  Sparkles,
  X,
} from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { SpeakButton } from "./TeachingAnimations";
import styles from "./learning-support.module.css";

/**
 * What was actually clicked. The server re-grades from this, so `correct` above
 * is only ever used to drive the UI — it is never the basis for marks.
 */
export type PracticeAttempt = { questionId: string; chosen: string };

/**
 * Questions this student has already used up, keyed by question id.
 *
 * Practice is one shot, and the database enforces that — but without this the
 * UI would offer the question again after a reload, showing the student the
 * answer for free while their zero stood. A context rather than a prop because
 * PracticeSet sits inside eighteen separate topic panels; threading a prop
 * through all of them to reach it would be noise.
 *
 * Undefined means "no history to apply", which is what the Class 3 modules get.
 */
export type PracticeHistory = Record<string, { chosen: string }>;

export const PracticeHistoryContext = createContext<PracticeHistory | undefined>(
  undefined,
);

export type PracticeQuestion = {
  id: string;
  source: "handbook" | "practice";
  prompt: string;
  visual?: ReactNode;
  options: string[];
  correct: string;
  mistake: MistakeFeedback;
  solution?: {
    steps: string[];
    rule?: string;
  };
};

export function PracticeSet<Skill extends string>({
  title,
  questions,
  skill,
  onAnswer,
  playTone,
  onAllComplete,
  sourceLabel = "From your handbook",
  readAloud = false,
  narration,
}: {
  title?: string;
  questions: PracticeQuestion[];
  skill: Skill;
  onAnswer: (skill: Skill, correct: boolean, attempt: PracticeAttempt) => void;
  /**
   * Accepted for source compatibility but no longer called. Practice is one
   * shot, so a wrong answer teaches INLINE and locks; it does not open a dialog
   * offering another guess. MistakeDialog is still used directly by the Class 3
   * modules, which are games rather than graded work.
   */
  onMistake?: (feedback: MistakeFeedback) => void;
  playTone: (correct: boolean) => void;
  onAllComplete: () => void;
  /** Badge for `source: "handbook"` questions — the Class 3 English lessons quote NCERT Santoor, not a handbook. */
  sourceLabel?: string;
  /** Show a "Read to me" button that speaks the question and its options. */
  readAloud?: boolean;
  /** Recorded read-alouds by question id; the browser voice is only the fallback. */
  narration?: Record<string, string>;
}) {
  const [session, setSession] = useState<Record<string, string>>({});
  const history = useContext(PracticeHistoryContext);

  // Answers from earlier visits merged with this visit's, derived at read time
  // rather than copied into state — there is nothing to keep in sync, and an
  // answer given now always wins over a late-arriving fetch.
  const answered: Record<string, string> = history
    ? { ...Object.fromEntries(Object.entries(history).map(([id, a]) => [id, a.chosen])), ...session }
    : session;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const completionAnnounced = useRef(false);
  const shouldFocusQuestion = useRef(false);
  const questionTitle = useRef<HTMLHeadingElement>(null);
  const completionTitle = useRef<HTMLHeadingElement>(null);

  const currentQuestion = questions[currentIndex];
  const currentAnswer = currentQuestion
    ? answered[currentQuestion.id]
    : undefined;
  // With one shot, `currentAnswer` records what was CHOSEN, not what was right.
  const wasCorrect = Boolean(
    currentQuestion && currentAnswer === currentQuestion.correct,
  );
  const completedCount = questions.filter((question) =>
    Boolean(answered[question.id]),
  ).length;
  const done = questions.length > 0 && completedCount === questions.length;

  function choose(question: PracticeQuestion, value: string) {
    if (answered[question.id]) return;
    const correct = value === question.correct;
    onAnswer(skill, correct, { questionId: question.id, chosen: value });
    playTone(correct);
    // ONE SHOT. The answer locks either way: a wrong choice scores 0 and the
    // teaching appears inline below, rather than opening a dialog and handing
    // back another guess. Marks are only meaningful if a question cannot be
    // retried until it is right.
    setSession((current) => ({ ...current, [question.id]: value }));
  }

  useEffect(() => {
    if (!done || completionAnnounced.current) return;
    completionAnnounced.current = true;
    onAllComplete();
  }, [done, onAllComplete]);

  useEffect(() => {
    if (!shouldFocusQuestion.current) return;
    shouldFocusQuestion.current = false;
    if (finished) completionTitle.current?.focus();
    else questionTitle.current?.focus();
  }, [currentIndex, finished]);

  function advance() {
    if (!currentAnswer) return;
    shouldFocusQuestion.current = true;
    if (currentIndex < questions.length - 1) {
      setRetryCount(0);
      setCurrentIndex((current) => current + 1);
      return;
    }
    setFinished(true);
  }

  if (!currentQuestion) {
    return (
      <section className={styles.practiceSet}>
        <p className={styles.practiceSetTitle}>{title ?? "Now you try"}</p>
        <p className={styles.practiceEmpty}>No practice questions yet.</p>
      </section>
    );
  }

  return (
    <section className={styles.practiceSet}>
      <div className={styles.practiceSetHead}>
        <div>
          <p className={styles.practiceSetTitle}>{title ?? "Now you try"}</p>
          <strong>{completedCount} of {questions.length} cleared</strong>
        </div>
        <span aria-hidden="true">{Math.round((completedCount / questions.length) * 100)}%</span>
      </div>

      <div
        aria-label={`${completedCount} of ${questions.length} practice questions complete`}
        className={styles.practiceProgress}
        role="progressbar"
        aria-valuemax={questions.length}
        aria-valuemin={0}
        aria-valuenow={completedCount}
      >
        {questions.map((question, index) => (
          <i
            className={
              answered[question.id]
                ? styles.practiceProgressDone
                : index === currentIndex && !finished
                  ? styles.practiceProgressCurrent
                  : ""
            }
            key={question.id}
          />
        ))}
      </div>

      {finished ? (
        <article
          aria-live="polite"
          className={styles.practiceComplete}
        >
          <div aria-hidden="true" className={styles.celebrationBurst}>
            <Sparkles />
          </div>
          <span>Practice complete</span>
          <h3 ref={completionTitle} tabIndex={-1}>Every checkpoint cleared.</h3>
          <p>You worked through all {questions.length} questions — including the retries that made the ideas stick.</p>
        </article>
      ) : (
        <article
          className={`${styles.practiceCard} ${
            retryCount === 0
              ? ""
              : retryCount % 2 === 0
                ? styles.practiceCardRetryEven
                : styles.practiceCardRetryOdd
          }`}
          key={currentQuestion.id}
        >
          <div className={styles.practiceCardHead}>
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <b
              className={
                currentQuestion.source === "handbook"
                  ? styles.handbookBadge
                  : styles.practiceBadge
              }
            >
              {currentQuestion.source === "handbook"
                ? sourceLabel
                : "Extra practice"}
            </b>
          </div>

          <div className={styles.practiceQuestionStage}>
            {currentQuestion.visual}
            <h3 ref={questionTitle} tabIndex={-1}>{currentQuestion.prompt}</h3>
            {readAloud ? (
              <SpeakButton
                audioSrc={narration?.[currentQuestion.id]}
                key={currentQuestion.id}
                text={`${currentQuestion.prompt} Your choices are: ${currentQuestion.options.join(", or ")}.`}
              />
            ) : null}
          </div>

          <div aria-label="Choose one answer" className={styles.choiceRow} role="group">
            {currentQuestion.options.map((option, optionIndex) => (
              <button
                className={
                  !currentAnswer
                    ? ""
                    : option === currentQuestion.correct
                      ? styles.choiceCorrect
                      : option === currentAnswer
                        ? styles.choiceWrong
                        : ""
                }
                disabled={Boolean(currentAnswer)}
                key={option}
                onClick={() => choose(currentQuestion, option)}
                style={{ "--choice": optionIndex } as CSSProperties}
                type="button"
              >
                <span aria-hidden="true">{String.fromCharCode(65 + optionIndex)}</span>
                {option}
                {currentAnswer && option === currentQuestion.correct
                  ? <Check aria-hidden="true" /> : null}
              </button>
            ))}
          </div>

          {currentAnswer && !wasCorrect ? (
            <div aria-live="polite" className={styles.retryNote}>
              <AlertCircle aria-hidden="true" />
              <span>
                <strong>
                  {currentQuestion.mistake?.title ?? "Not this one — 0 for this question."}
                </strong>
                {currentQuestion.mistake?.explanation}
              </span>
            </div>
          ) : null}

          {currentAnswer ? (
            <div aria-live="polite" className={styles.correctReveal}>
              <div className={wasCorrect ? styles.correctSignal : styles.answerSignalWrong}>
                <span aria-hidden="true"><Check /></span>
                <div>
                  <small>{wasCorrect ? "Correct answer" : "The answer was"}</small>{" "}
                  <strong>{currentQuestion.correct}</strong>
                </div>
                <div aria-hidden="true" className={styles.sparkTrail}>
                  <i />
                  <i />
                  <i />
                </div>
              </div>

              {currentQuestion.solution ? (
                <section className={styles.solutionPanel}>
                  <header>
                    <div>
                      <Sparkles aria-hidden="true" />
                      <span>
                        <small>Build the logic</small>
                        <strong>Why this works</strong>
                      </span>
                    </div>
                    {currentQuestion.solution.rule ? (
                      <b>{currentQuestion.solution.rule}</b>
                    ) : null}
                  </header>
                  {readAloud ? (
                    <SpeakButton
                      audioSrc={narration?.[`${currentQuestion.id}:solution`]}
                      text={`Why this works. ${currentQuestion.solution.steps.join(" ")}${
                        currentQuestion.solution.rule ? ` Remember: ${currentQuestion.solution.rule}` : ""
                      }`}
                    />
                  ) : null}
                  <ol>
                    {currentQuestion.solution.steps.map((step, index) => (
                      <li
                        key={`${currentQuestion.id}-solution-${index}`}
                        style={{ "--solution-step": index } as CSSProperties}
                      >
                        <span>{index + 1}</span>
                        <p>{step}</p>
                      </li>
                    ))}
                  </ol>
                </section>
              ) : null}

              <button className={styles.nextQuestionButton} onClick={advance} type="button">
                {currentIndex < questions.length - 1 ? "Next question" : "Finish practice"}
                <ArrowRight aria-hidden="true" />
              </button>
            </div>
          ) : null}
        </article>
      )}
    </section>
  );
}

export type MistakeFeedback = {
  /**
   * Wrong-answer feedback must teach through a different, smaller example.
   * Never put the current question's correct option or completed solution here.
   */
  eyebrow?: string;
  title?: string;
  explanation: string;
  workedSteps?: string[];
  rule?: string;
  /** Recorded read-aloud of the title, explanation and rule. */
  audioSrc?: string;
};

export type HintStep = {
  /** Recorded read-aloud of this hint step. */
  audioSrc?: string;
  label: string;
  title: string;
  body: string;
  example?: string;
};

export type LessonHints = {
  title: string;
  prompt: string;
  steps: [HintStep, HintStep, HintStep];
};

export function LearningHelpButton({
  onClick,
  open,
}: {
  onClick: () => void;
  open: boolean;
}) {
  return (
    <button
      aria-controls="lesson-hint-drawer"
      aria-expanded={open}
      className={styles.helpButton}
      onClick={onClick}
      type="button"
    >
      <Sparkles aria-hidden="true" />
      <span>
        <small>Need a nudge?</small>
        Help me
      </span>
    </button>
  );
}

export function MistakeDialog({
  feedback,
  onClose,
  onShowHint,
}: {
  feedback: MistakeFeedback | null;
  onClose: () => void;
  onShowHint: () => void;
}) {
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!feedback) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [feedback, onClose]);

  if (!feedback) return null;

  return (
    <div
      className={styles.dialogBackdrop}
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <section
        aria-describedby="mistake-explanation"
        aria-labelledby="mistake-title"
        aria-modal="true"
        className={styles.dialog}
        role="dialog"
      >
        <button
          aria-label="Close explanation"
          className={styles.closeButton}
          onClick={onClose}
          ref={closeButton}
          type="button"
        >
          <X aria-hidden="true" />
        </button>

        <div className={styles.dialogSignal}>
          <AlertCircle aria-hidden="true" />
        </div>
        <p>{feedback.eyebrow ?? "Learning moment"}</p>
        <h2 id="mistake-title">{feedback.title ?? "Let’s try that again"}</h2>
        <div className={styles.dialogExplanation} id="mistake-explanation">
          {feedback.explanation}
        </div>
        <SpeakButton
          audioSrc={feedback.audioSrc}
          text={`${feedback.title ?? "Let's try that again"}. ${feedback.explanation}${
            feedback.rule ? ` Remember: ${feedback.rule}` : ""
          }`}
        />

        {feedback.workedSteps?.length ? (
          <div
            aria-label={`Worked example: ${feedback.workedSteps.join(" then ")}`}
            className={styles.workedPath}
          >
            {feedback.workedSteps.map((step, index) => (
              <span key={`${step}-${index}`}>
                <strong
                  style={{ "--step": index } as CSSProperties}
                >
                  {step}
                </strong>
                {index < feedback.workedSteps!.length - 1 ? (
                  <ArrowRight aria-hidden="true" />
                ) : null}
              </span>
            ))}
          </div>
        ) : null}

        {feedback.rule ? (
          <div className={styles.ruleCard}>
            <BrainCircuit aria-hidden="true" />
            <span>
              <small>Remember the rule</small>
              {feedback.rule}
            </span>
          </div>
        ) : null}

        <div className={styles.dialogActions}>
          <button onClick={onClose} type="button">
            <Check aria-hidden="true" /> I’ll try again
          </button>
          <button
            onClick={() => {
              onClose();
              onShowHint();
            }}
            type="button"
          >
            <Lightbulb aria-hidden="true" /> Show me a hint
          </button>
        </div>
      </section>
    </div>
  );
}

export function HintDrawer({
  hints,
  onClose,
}: {
  hints: LessonHints;
  onClose: () => void;
}) {
  const [level, setLevel] = useState(0);
  const current = hints.steps[level];
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    closeButton.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus();
    };
  }, [onClose]);

  return (
    <aside
      aria-labelledby="hint-drawer-title"
      className={styles.hintDrawer}
      id="lesson-hint-drawer"
    >
      <header>
        <div>
          <Sparkles aria-hidden="true" />
          <span>
            <small>Hint {level + 1} of {hints.steps.length}</small>
            <strong id="hint-drawer-title">{hints.title}</strong>
          </span>
        </div>
        <button
          aria-label="Close hints"
          className={styles.closeButton}
          onClick={onClose}
          ref={closeButton}
          type="button"
        >
          <X aria-hidden="true" />
        </button>
      </header>

      <p className={styles.hintPrompt}>{hints.prompt}</p>

      <div className={styles.hintProgress} aria-hidden="true">
        {hints.steps.map((step, index) => (
          <i
            className={index <= level ? styles.hintProgressActive : ""}
            key={step.label}
          />
        ))}
      </div>

      <article className={styles.hintCard} key={current.label}>
        <span>{current.label}</span>
        <h3>{current.title}</h3>
        <p>{current.body}</p>
        {current.example ? <strong>{current.example}</strong> : null}
        <SpeakButton
          audioSrc={current.audioSrc}
          text={`${current.title}. ${current.body}${current.example ? ` For example: ${current.example}.` : ""}`}
        />
      </article>

      <div className={styles.hintActions}>
        {level < hints.steps.length - 1 ? (
          <button onClick={() => setLevel((value) => value + 1)} type="button">
            Show another hint <ArrowRight aria-hidden="true" />
          </button>
        ) : (
          <button onClick={onClose} type="button">
            <Check aria-hidden="true" /> I’m ready to try
          </button>
        )}
        {level > 0 ? (
          <button onClick={() => setLevel((value) => value - 1)} type="button">
            Previous hint
          </button>
        ) : null}
      </div>
    </aside>
  );
}
