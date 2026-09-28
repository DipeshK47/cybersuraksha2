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
import { LessonStage } from "./LessonScreens";
import {
  emptyMetrics,
  SkillCategory,
  SkillMetrics,
} from "./lesson-helpers";
import { lessonHints } from "./lesson-support";
import { useActivityEmitter } from "../../lib/activity-client";
import styles from "./secret-message-rescue.module.css";

const MODULE_ID = "grade-3-secret-message-rescue";

const screens = [
  { short: "Protect", title: "Why hide a message?" },
  { short: "Words", title: "Meet the code team" },
  { short: "Pattern", title: "Discover the shift rule" },
  { short: "Build", title: "Build the cipher wheel" },
  { short: "Encode", title: "Encode together" },
  { short: "Decode", title: "Decode the rescue message" },
  { short: "Transfer", title: "Find the missing key" },
  { short: "Create", title: "Make your own secret" },
  { short: "Remember", title: "Security and memory check" },
] as const;

const storageKey = "cybersuraksha-secret-message-rescue-v2";

type SaveStatus = "idle" | "saving" | "saved" | "error";

function scoreMetrics(
  metrics: SkillMetrics,
  categories: SkillCategory[],
) {
  const totals = categories.reduce(
    (result, category) => ({
      attempts: result.attempts + metrics[category].attempts,
      correct: result.correct + metrics[category].correct,
    }),
    { attempts: 0, correct: 0 },
  );
  return totals.attempts
    ? Math.round((totals.correct / totals.attempts) * 100)
    : 100;
}

export function SecretMessageRescue({
  role,
  studentId,
  className,
}: {
  role: "student" | "teacher";
  studentId?: string;
  className?: string;
}) {
  const [screen, setScreen] = useState(0);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [soundOn, setSoundOn] = useState(true);
  const [metrics, setMetrics] = useState<SkillMetrics>(emptyMetrics);
  const [loaded, setLoaded] = useState(false);
  const [mistake, setMistake] = useState<MistakeFeedback | null>(null);
  const [hintOpen, setHintOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [saveAttempt, setSaveAttempt] = useState(0);
  const lessonTop = useRef<HTMLDivElement>(null);
  const startedAt = useRef<number | null>(null);
  const savedCompletion = useRef(false);
  const studentStorageKey = `${storageKey}-${studentId ?? "preview"}`;
  const emit = useActivityEmitter(MODULE_ID, role === "student" && !!studentId);
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
        const saved = window.localStorage.getItem(studentStorageKey);
        if (saved) {
          const data = JSON.parse(saved) as {
            screen?: number;
            completed?: number[];
            metrics?: SkillMetrics;
          };
          setScreen(
            Math.min(Math.max(data.screen ?? 0, 0), screens.length - 1),
          );
          setCompleted(new Set(data.completed ?? []));
          if (data.metrics) setMetrics(data.metrics);
        }
      } catch {
        window.localStorage.removeItem(studentStorageKey);
      }
      setLoaded(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [emit, studentStorageKey]);

  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem(
      studentStorageKey,
      JSON.stringify({
        screen,
        completed: Array.from(completed),
        metrics,
      }),
    );
  }, [completed, loaded, metrics, screen, studentStorageKey]);

  useEffect(() => {
    const missionComplete = completed.has(screens.length - 1);
    if (
      !missionComplete ||
      role !== "student" ||
      !studentId ||
      savedCompletion.current
    ) {
      return;
    }

    savedCompletion.current = true;
    setSaveStatus("saving");
    const drill = scoreMetrics(metrics, [
      "knowledge",
      "procedure",
      "transfer",
    ]);
    const recall = scoreMetrics(metrics, ["security"]);
    const average = Math.round((drill + recall) / 2);
    const incorrect = Object.values(metrics).reduce(
      (total, category) =>
        total + Math.max(category.attempts - category.correct, 0),
      0,
    );

    emit("module_completed", {
      drill,
      recall,
      leaks: incorrect,
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
        leaks: incorrect,
        drill,
        recall,
        path: incorrect > 0 ? "supported" : "independent",
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

  function tone(frequency: number, duration = 0.08) {
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
    gain.gain.setValueAtTime(0.055, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      context.currentTime + duration,
    );
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + duration);
  }

  function playAnswerTone(correct: boolean) {
    tone(correct ? 720 : 210, correct ? 0.11 : 0.08);
    if (correct) window.setTimeout(() => tone(930, 0.12), 90);
  }

  function recordAnswer(category: SkillCategory, correct: boolean) {
    emit("question_answered", {
      correct,
      kind: category === "security" ? "recall" : "drill",
      category,
      screen,
    });
    setMetrics((current) => ({
      ...current,
      [category]: {
        attempts: current[category].attempts + 1,
        correct: current[category].correct + (correct ? 1 : 0),
      },
    }));
  }

  function completeCurrent() {
    setCompleted((current) => {
      const next = new Set(current);
      next.add(screen);
      return next;
    });
  }

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

  function resetSupport() {
    setMistake(null);
    setHintOpen(false);
  }

  function goTo(nextScreen: number) {
    if (nextScreen < 0 || nextScreen > maximumUnlocked) return;
    resetSupport();
    setScreen(nextScreen);
    window.setTimeout(
      () => lessonTop.current?.scrollIntoView({ behavior: "smooth" }),
      30,
    );
  }

  function next() {
    if (!completed.has(screen) || screen === screens.length - 1) return;
    const nextScreen = screen + 1;
    resetSupport();
    setScreen(nextScreen);
    tone(570, 0.09);
    window.setTimeout(
      () => lessonTop.current?.scrollIntoView({ behavior: "smooth" }),
      30,
    );
  }

  function reset() {
    setScreen(0);
    setCompleted(new Set());
    setMetrics(emptyMetrics());
    setSaveStatus("idle");
    setSaveAttempt(0);
    savedCompletion.current = false;
    startedAt.current = Date.now();
    resetSupport();
    window.localStorage.removeItem(studentStorageKey);
    tone(420, 0.08);
  }

  return (
    <main className={styles.page}>
      <a className={styles.skipLink} href="#lesson-content">
        Skip to lesson
      </a>

      <header className={styles.topbar}>
        <div className={styles.missionIdentity}>
          <Link
            aria-label="Exit mission"
            className={styles.iconButton}
            href={exitHref}
          >
            <X aria-hidden="true" />
          </Link>
          <div>
            <span>Class 3 • Computational Thinking</span>
            <strong>Mission: Secret Message Rescue</strong>
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
            onClick={() => setSoundOn((current) => !current)}
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
        <aside className={styles.lessonRail} aria-label="Lesson map">
          <div>
            <span>Learning journey</span>
            <strong>Understand, use, transfer, remember.</strong>
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
            <strong>Why pages stay locked</strong>
            <p>
              Complete the learning action, not just the animation, to continue.
            </p>
          </div>
        </aside>

        <section className={styles.lessonMain} id="lesson-content">
          <div className={styles.lessonSupportBar}>
            <div>
              <span>Learning support</span>
              <strong>Hints explain the next step without giving up on you.</strong>
            </div>
            <LearningHelpButton onClick={toggleHelp} open={hintOpen} />
          </div>

          <LessonStage
            completed={completed.has(screen)}
            key={screen}
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
                  <Check aria-hidden="true" /> Learning check complete
                </>
              ) : (
                "Complete this page’s learning action to continue"
              )}
            </div>

            {screen < screens.length - 1 ? (
              <button
                className={styles.nextButton}
                disabled={!completed.has(screen)}
                onClick={next}
                type="button"
              >
                Next lesson <ChevronRight aria-hidden="true" />
              </button>
            ) : (
              <Link
                aria-disabled={!completed.has(screen)}
                className={`${styles.nextButton} ${
                  !completed.has(screen) ? styles.nextLinkDisabled : ""
                }`}
                href={completed.has(screen) ? exitHref : "#lesson-content"}
              >
                Return to Class 3 <ArrowRight aria-hidden="true" />
              </Link>
            )}
          </footer>
          {screen === screens.length - 1 && completed.has(screen) ? (
            <div aria-live="polite" className={styles.saveStatus}>
              <span>
                {role === "teacher"
                  ? "Teacher preview complete. Student progress is not changed."
                  : saveStatus === "saving"
                    ? "Saving this mission to your CyberSuraksha profile…"
                    : saveStatus === "saved"
                      ? "Mission saved. Your dashboard and teacher report are updated."
                      : saveStatus === "error"
                        ? "The mission is complete on this device, but progress has not synced yet."
                        : "Mission complete."}
              </span>
              {saveStatus === "error" ? (
                <button
                  onClick={() => {
                    savedCompletion.current = false;
                    setSaveStatus("idle");
                    setSaveAttempt((attempt) => attempt + 1);
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
          hints={lessonHints[screen]}
          key={`hints-${screen}`}
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
