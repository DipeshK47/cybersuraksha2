"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HandbookChatbot } from "../../components/HandbookChatbot";
import {
  HintDrawer,
  LearningHelpButton,
  MistakeDialog,
  type MistakeFeedback,
} from "../../components/learning/LearningSupport";
import { NmvStage } from "./NaniMaaVacationChallengeScreens";
import {
  emptyMetrics,
  nmvHints,
  type NmvMetrics,
  type NmvSkill,
} from "./nani-maa-vacation-challenge-support";
import { useActivityEmitter } from "../../lib/activity-client";
import styles from "./nani-maa-vacation-challenge.module.css";

const MODULE_ID = "grade-3-nani-maa-vacation-challenge";

const screens = [
  { short: "Sharing", title: "Sharing Candies Fairly" },
  { short: "Frog Hop", title: "Frog Hop Garden Game" },
  { short: "Points", title: "Nani Maa's Points Game" },
  { short: "Recall", title: "Show What You Know" },
] as const;

function score(metrics: NmvMetrics, skills: NmvSkill[]) {
  const totals = skills.reduce(
    (result, skill) => ({
      attempts: result.attempts + metrics[skill].attempts,
      correct: result.correct + metrics[skill].correct,
    }),
    { attempts: 0, correct: 0 },
  );
  return totals.attempts
    ? Math.round((totals.correct / totals.attempts) * 100)
    : 100;
}

type SaveStatus = "idle" | "saving" | "saved" | "error";

export function NaniMaaVacationChallenge({
  role,
  studentId,
  className,
}: {
  role: "student" | "teacher";
  studentId?: string;
  className?: string;
}) {
  const [screen, setScreen] = useState(0);
  const [runKey, setRunKey] = useState(0);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [metrics, setMetrics] = useState<NmvMetrics>(emptyMetrics);
  const [soundOn, setSoundOn] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [mistake, setMistake] = useState<MistakeFeedback | null>(null);
  const [hintOpen, setHintOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [saveAttempt, setSaveAttempt] = useState(0);
  const lessonTop = useRef<HTMLDivElement>(null);
  const startedAt = useRef<number | null>(null);
  const savedCompletion = useRef(false);

  const storageKey = `cybersuraksha-nani-maa-vacation-challenge-v1-${studentId ?? "preview"}`;
  const { emit } = useActivityEmitter(MODULE_ID, role === "student" && !!studentId, studentId);
  const contextQuery = useMemo(() => {
    const query = new URLSearchParams({ role });
    if (studentId) query.set("studentId", studentId);
    if (className) query.set("className", className);
    return `?${query.toString()}`;
  }, [className, role, studentId]);
  const exitHref = `/grade/3${contextQuery}`;

  useEffect(() => {
    if (startedAt.current === null) {
      startedAt.current = Date.now();
      emit("module_started");
    }
    const timer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(storageKey);
        if (saved) {
          const data = JSON.parse(saved) as {
            screen?: number;
            completed?: number[];
            metrics?: NmvMetrics;
          };
          setScreen(
            Math.min(Math.max(data.screen ?? 0, 0), screens.length - 1),
          );
          setCompleted(new Set(data.completed ?? []));
          if (data.metrics) setMetrics(data.metrics);
        }
      } catch {
        window.localStorage.removeItem(storageKey);
      }
      setLoaded(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [emit, storageKey]);

  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        screen,
        completed: Array.from(completed),
        metrics,
      }),
    );
  }, [completed, loaded, metrics, screen, storageKey]);

  useEffect(() => {
    if (
      !completed.has(screens.length - 1) ||
      role !== "student" ||
      !studentId ||
      savedCompletion.current
    ) {
      return;
    }

    savedCompletion.current = true;
    setSaveStatus("saving");
    const drill = score(metrics, ["share", "track", "strategy"]);
    const recall = score(metrics, ["logic"]);
    const average = Math.round((drill + recall) / 2);
    const mistakes = Object.values(metrics).reduce(
      (total, result) =>
        total + Math.max(result.attempts - result.correct, 0),
      0,
    );

    emit("module_completed", {
      drill,
      recall,
      leaks: mistakes,
      durationSeconds: startedAt.current
        ? Math.round((Date.now() - startedAt.current) / 1_000)
        : 0,
    });

    void fetch("/api/module-runs", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        studentId: Number(studentId),
        moduleId: MODULE_ID,
        rank: average >= 90 ? "GHOST" : average >= 75 ? "GUARDED" : "EXPLORER",
        leaks: mistakes,
        drill,
        recall,
        path: mistakes ? "supported" : "independent",
        durationSeconds: startedAt.current
          ? Math.round((Date.now() - startedAt.current) / 1_000)
          : 0,
      }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Progress could not be saved.");
        setSaveStatus("saved");
      })
      .catch(() => {
        savedCompletion.current = false;
        setSaveStatus("error");
      });
  }, [completed, emit, metrics, role, saveAttempt, studentId]);

  const maximumUnlocked = useMemo(() => {
    let unlocked = 0;
    while (completed.has(unlocked) && unlocked < screens.length - 1) {
      unlocked += 1;
    }
    return unlocked;
  }, [completed]);

  const tone = useCallback(
    (frequency: number, duration = 0.08) => {
      if (!soundOn) return;
      const AudioContextClass =
        window.AudioContext ??
        (
          window as typeof window & {
            webkitAudioContext?: typeof AudioContext;
          }
        ).webkitAudioContext;
      if (!AudioContextClass) return;
      const context = new AudioContextClass();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.05, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        context.currentTime + duration,
      );
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + duration);
    },
    [soundOn],
  );

  const playAnswerTone = useCallback(
    (correct: boolean) => {
      tone(correct ? 720 : 210, correct ? 0.11 : 0.08);
      if (correct) window.setTimeout(() => tone(930, 0.12), 90);
    },
    [tone],
  );

  const recordAnswer = useCallback(
    (skill: NmvSkill, correct: boolean) => {
      emit("question_answered", {
        correct,
        kind: skill === "logic" ? "recall" : "drill",
        category: skill,
        screen,
      });
      setMetrics((current) => ({
        ...current,
        [skill]: {
          attempts: current[skill].attempts + 1,
          correct: current[skill].correct + (correct ? 1 : 0),
        },
      }));
    },
    [emit, screen],
  );

  const completeCurrent = useCallback(() => {
    setCompleted((current) => {
      if (current.has(screen)) return current;
      const next = new Set(current);
      next.add(screen);
      return next;
    });
  }, [screen]);

  const closeMistake = useCallback(() => setMistake(null), []);
  const closeHints = useCallback(() => setHintOpen(false), []);
  const showHints = useCallback(() => {
    emit("hint_used", { screen, from: "mistake" });
    setMistake(null);
    setHintOpen(true);
  }, [emit, screen]);
  const handleMistake = useCallback(
    (feedback: MistakeFeedback) => {
      emit("mistake", { screen });
      setMistake(feedback);
    },
    [emit, screen],
  );
  const toggleHelp = useCallback(() => {
    setHintOpen((value) => {
      if (!value) emit("hint_used", { screen, from: "help" });
      return !value;
    });
  }, [emit, screen]);

  function goTo(nextScreen: number) {
    if (nextScreen < 0 || nextScreen > maximumUnlocked) return;
    setMistake(null);
    setHintOpen(false);
    setScreen(nextScreen);
    window.setTimeout(
      () => lessonTop.current?.scrollIntoView({ behavior: "smooth" }),
      30,
    );
  }

  function next() {
    if (!completed.has(screen) || screen === screens.length - 1) return;
    setMistake(null);
    setHintOpen(false);
    setScreen((value) => value + 1);
    tone(570, 0.09);
    window.setTimeout(
      () => lessonTop.current?.scrollIntoView({ behavior: "smooth" }),
      30,
    );
  }

  function reset() {
    emit("module_started", { restarted: true });
    setRunKey((value) => value + 1);
    setScreen(0);
    setCompleted(new Set());
    setMetrics(emptyMetrics());
    setSaveStatus("idle");
    setSaveAttempt(0);
    savedCompletion.current = false;
    startedAt.current = Date.now();
    setMistake(null);
    setHintOpen(false);
    window.localStorage.removeItem(storageKey);
    tone(420, 0.08);
  }

  return (
    <main className={styles.page}>
      <a className={styles.skipLink} href="#nmv-lesson-content">
        Skip to lesson
      </a>

      <header className={styles.topbar}>
        <div className={styles.missionIdentity}>
          <Link
            aria-label="Exit Nani Maa's Vacation Challenge"
            className={styles.iconButton}
            href={exitHref}
          >
            <X aria-hidden="true" />
          </Link>
          <div>
            <span>Class 3 • Computational Thinking</span>
            <strong>Mission: Nani Maa&rsquo;s Vacation Challenge</strong>
          </div>
        </div>

        <div className={styles.topActions}>
          <div className={styles.topProgress}>
            <span>
              Lesson {screen + 1} of {screens.length}
            </span>
            <i>
              <b style={{ width: `${((screen + 1) / screens.length) * 100}%` }} />
            </i>
          </div>
          <button
            aria-label={soundOn ? "Turn sound off" : "Turn sound on"}
            aria-pressed={soundOn}
            className={styles.iconButton}
            onClick={() => setSoundOn((value) => !value)}
            type="button"
          >
            {soundOn ? (
              <Volume2 aria-hidden="true" />
            ) : (
              <VolumeX aria-hidden="true" />
            )}
          </button>
          <button className={styles.resetButton} onClick={reset} type="button">
            <RotateCcw aria-hidden="true" /> Start over
          </button>
          <HandbookChatbot placement="inline" />
        </div>
      </header>

      <div className={styles.lessonShell} ref={lessonTop}>
        <aside
          aria-label="Nani Maa's Vacation Challenge lesson map"
          className={styles.lessonRail}
        >
          <div>
            <span>Vacation route</span>
            <strong>Share, hop, and play fair!</strong>
          </div>
          <nav>
            {screens.map((item, index) => {
              const isComplete = completed.has(index);
              const isAvailable = index <= maximumUnlocked;
              return (
                <button
                  aria-current={screen === index ? "step" : undefined}
                  className={`${screen === index ? styles.railActive : ""} ${
                    isComplete ? styles.railComplete : ""
                  }`}
                  disabled={!isAvailable}
                  key={item.title}
                  onClick={() => goTo(index)}
                  type="button"
                >
                  <i>{isComplete ? <Check aria-hidden="true" /> : index + 1}</i>
                  <span>
                    <small>{item.short}</small>
                    <strong>{item.title}</strong>
                  </span>
                </button>
              );
            })}
          </nav>
          <div className={styles.railNote}>
            <strong>Vacation rule</strong>
            <p>Finish the current mission before the next one unlocks.</p>
          </div>
        </aside>

        <section className={styles.lessonMain} id="nmv-lesson-content">
          <div className={styles.lessonSupportBar}>
            <div>
              <span>Stuck on this mission?</span>
              <strong>Open three progressive hints without losing the lesson.</strong>
            </div>
            <LearningHelpButton
              onClick={toggleHelp}
              open={hintOpen}
            />
          </div>

          <NmvStage
            completed={completed.has(screen)}
            key={`${runKey}-${screen}`}
            metrics={metrics}
            onAnswer={recordAnswer}
            onComplete={completeCurrent}
            onMistake={handleMistake}
            playTone={playAnswerTone}
            screen={screen}
          />

          <footer className={styles.lessonNavigation}>
            <button
              disabled={screen === 0}
              onClick={() => goTo(screen - 1)}
              type="button"
            >
              <ArrowLeft aria-hidden="true" /> Back
            </button>

            <div aria-live="polite">
              {completed.has(screen) ? (
                <>
                  <Check aria-hidden="true" /> Mission complete
                </>
              ) : (
                "Complete the learning action to continue"
              )}
            </div>

            {screen < screens.length - 1 ? (
              <button
                className={styles.nextButton}
                disabled={!completed.has(screen)}
                onClick={next}
                type="button"
              >
                Next mission <ChevronRight aria-hidden="true" />
              </button>
            ) : (
              <Link
                aria-disabled={!completed.has(screen)}
                className={`${styles.nextButton} ${
                  !completed.has(screen) ? styles.nextLinkDisabled : ""
                }`}
                href={completed.has(screen) ? exitHref : "#nmv-lesson-content"}
              >
                Return to Class 3 <ArrowRight aria-hidden="true" />
              </Link>
            )}
          </footer>

          {screen === screens.length - 1 && completed.has(screen) ? (
            <div aria-live="polite" className={styles.saveStatus}>
              <span>
                {role === "teacher"
                  ? "Teacher preview complete. Student progress is unchanged."
                  : !studentId
                    ? "Preview complete. Sign in as a student to save this result."
                    : saveStatus === "saving"
                      ? "Saving Nani Maa's Vacation Challenge to your local CyberSuraksha profile…"
                      : saveStatus === "saved"
                        ? "Progress saved to the student and teacher progress views."
                        : saveStatus === "error"
                          ? "The mission is complete on this device, but progress has not synced yet."
                          : "Mission complete."}
              </span>
              {saveStatus === "error" ? (
                <button
                  onClick={() => {
                    savedCompletion.current = false;
                    setSaveStatus("idle");
                    setSaveAttempt((value) => value + 1);
                  }}
                  type="button"
                >
                  Try saving again
                </button>
              ) : null}
            </div>
          ) : null}
        </section>
      </div>

      {hintOpen ? (
        <HintDrawer
          hints={nmvHints[screen]}
          key={`nmv-hints-${screen}`}
          onClose={closeHints}
        />
      ) : null}
      <MistakeDialog
        feedback={mistake}
        onClose={closeMistake}
        onShowHint={showHints}
      />
    </main>
  );
}
