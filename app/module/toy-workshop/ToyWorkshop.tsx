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
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { HandbookChatbot } from "../../components/HandbookChatbot";
import {
  HintDrawer,
  LearningHelpButton,
  MistakeDialog,
  type MistakeFeedback,
} from "../../components/learning/LearningSupport";
import {
  ToyStage,
  type ToyMetrics,
  type ToySkill,
} from "./ToyScreens";
import { toyHints } from "./toy-support";
import { useActivityEmitter } from "../../lib/activity-client";
import styles from "./toy-workshop.module.css";

const MODULE_ID = "grade-3-toy-workshop";

const screens = [
  { short: "Views", title: "Turn the viewpoint" },
  { short: "Top", title: "Run the roof scanner" },
  { short: "Hidden", title: "See through the drawing" },
  { short: "Sort", title: "Edge-sorting factory" },
  { short: "Inspect", title: "Transparent crate" },
  { short: "Pattern", title: "Pattern conveyor" },
  { short: "Match", title: "Match the shadows" },
  { short: "Edges", title: "Edge colour circuit" },
  { short: "Build", title: "Block assembly bay" },
  { short: "Remember", title: "Tournament transfer" },
] as const;

const emptyMetrics = (): ToyMetrics => ({
  visual: { attempts: 0, correct: 0 },
  counting: { attempts: 0, correct: 0 },
  pattern: { attempts: 0, correct: 0 },
  logic: { attempts: 0, correct: 0 },
});

function score(
  metrics: ToyMetrics,
  skills: ToySkill[],
) {
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

export function ToyWorkshop({
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
  const [metrics, setMetrics] = useState<ToyMetrics>(emptyMetrics);
  const [soundOn, setSoundOn] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [mistake, setMistake] = useState<MistakeFeedback | null>(null);
  const [hintOpen, setHintOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [saveAttempt, setSaveAttempt] = useState(0);
  const startedAt = useRef<number | null>(null);
  const savedCompletion = useRef(false);

  const storageKey = `cybersuraksha-toy-workshop-v1-${studentId ?? "preview"}`;
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
            metrics?: ToyMetrics;
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

  useLayoutEffect(() => {
    if (!loaded) return;
    const resetScroll = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      document.scrollingElement?.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
    };
    resetScroll();
    const frame = window.requestAnimationFrame(resetScroll);
    const timer = window.setTimeout(resetScroll, 120);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [loaded, screen]);

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
    const drill = score(metrics, ["visual", "counting", "pattern"]);
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
    (skill: ToySkill, correct: boolean) => {
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
  }

  function next() {
    if (!completed.has(screen) || screen === screens.length - 1) return;
    setMistake(null);
    setHintOpen(false);
    setScreen((value) => value + 1);
    tone(570, 0.09);
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
      <a className={styles.skipLink} href="#toy-lesson-content">
        Skip to lesson
      </a>

      <header className={styles.topbar}>
        <div className={styles.missionIdentity}>
          <Link
            aria-label="Exit Toy Workshop"
            className={styles.iconButton}
            href={exitHref}
          >
            <X aria-hidden="true" />
          </Link>
          <div>
            <span>Class 3 • Computational Thinking</span>
            <strong>Mission: Toy Workshop</strong>
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

      <div className={styles.lessonShell}>
        <aside className={styles.lessonRail} aria-label="Toy Workshop lesson map">
          <div>
            <span>Workshop route</span>
            <strong>Look, count, sort, build, explain.</strong>
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
            <strong>Workshop rule</strong>
            <p>Explain the clue before the next station unlocks.</p>
          </div>
        </aside>

        <section className={styles.lessonMain} id="toy-lesson-content">
          <div className={styles.lessonSupportBar}>
            <div>
              <span>Stuck at this station?</span>
              <strong>Open three progressive hints without losing the lesson.</strong>
            </div>
            <LearningHelpButton onClick={toggleHelp} open={hintOpen} />
          </div>

          <ToyStage
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
                  <Check aria-hidden="true" /> Workshop station complete
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
                Next station <ChevronRight aria-hidden="true" />
              </button>
            ) : (
              <Link
                aria-disabled={!completed.has(screen)}
                className={`${styles.nextButton} ${
                  !completed.has(screen) ? styles.nextLinkDisabled : ""
                }`}
                href={completed.has(screen) ? exitHref : "#toy-lesson-content"}
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
                      ? "Saving Toy Workshop to your local CyberSuraksha profile…"
                      : saveStatus === "saved"
                        ? "Toy Workshop saved to the student and teacher progress views."
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
          hints={toyHints[screen]}
          key={`toy-hints-${screen}`}
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
