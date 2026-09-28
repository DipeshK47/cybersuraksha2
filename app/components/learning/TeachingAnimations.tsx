"use client";

import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Pause,
  Play,
  RotateCcw,
  Volume2,
} from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import styles from "./learning-support.module.css";

type SpeakHandlers = {
  onEnd?: () => void;
  /** Prefer a consistent, mastered recording; Web Speech remains the fallback. */
  audioSrc?: string;
  /**
   * Neither recorded audio nor the browser engine could start. Callers can
   * fall back to their visual timer instead of waiting forever.
   */
  onUnavailable?: () => void;
};

function speakWithBrowser(
  text: string,
  handlers: Omit<SpeakHandlers, "audioSrc"> = {},
): (() => void) | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  const { onEnd, onUnavailable } = handlers;
  const synth = window.speechSynthesis;
  synth.cancel();
  const utterance = new SpeechSynthesisUtterance(
    text.replace(/[“”]/g, '"').replace(/\s—\s/g, ", "),
  );
  const voices = synth.getVoices();
  const voice =
    voices.find((v) => /Microsoft (Neerja|Sonia).*(Natural)|Ava.*Premium|Samantha.*Enhanced/i.test(v.name)) ??
    voices.find((v) => /Google (UK|US) English/i.test(v.name)) ??
    voices.find((v) => v.lang === "en-IN") ??
    voices.find((v) => /Samantha|Karen|Moira|Daniel/i.test(v.name)) ??
    voices.find((v) => /^en-(GB|AU|IE)/.test(v.lang)) ??
    voices.find((v) => v.lang.startsWith("en"));
  if (voice) utterance.voice = voice;
  utterance.lang = voice?.lang ?? "en-IN";
  // A natural conversational pace remains intelligible for Class 3 without
  // the drawn-out, high-pitched delivery of the former 0.88 / 1.08 settings.
  utterance.rate = 1.04;
  utterance.pitch = 1;
  let done = false;
  let startedSpeaking = false;
  const finish = () => {
    if (done) return;
    done = true;
    onEnd?.();
  };
  utterance.onstart = () => {
    startedSpeaking = true;
  };
  utterance.onend = finish;
  utterance.onerror = finish;
  synth.speak(utterance);
  // A working engine starts within a second or so; one that stays silent
  // would otherwise leave the caller waiting on an `end` that never comes.
  const watchdog = window.setTimeout(() => {
    if (done || startedSpeaking) return;
    done = true;
    synth.cancel();
    onUnavailable?.();
  }, 2500);
  return () => {
    done = true;
    window.clearTimeout(watchdog);
    synth.cancel();
  };
}

/**
 * Speak a line using mastered lesson audio when supplied, then fall back to
 * the best browser voice available. Returns a stop function; stopping never
 * fires `onEnd`.
 */
export function speakText(text: string, handlers: SpeakHandlers = {}): (() => void) | null {
  const { audioSrc, onEnd, onUnavailable } = handlers;
  if (!audioSrc || typeof Audio === "undefined") {
    return speakWithBrowser(text, { onEnd, onUnavailable });
  }

  const audio = new Audio(audioSrc);
  audio.preload = "auto";
  let stopped = false;
  let finished = false;
  let fallbackStarted = false;
  let fallbackStop: (() => void) | null = null;

  const finish = () => {
    if (stopped || finished) return;
    finished = true;
    window.clearTimeout(watchdog);
    onEnd?.();
  };
  const fallback = () => {
    if (stopped || finished || fallbackStarted) return;
    fallbackStarted = true;
    window.clearTimeout(watchdog);
    audio.pause();
    audio.removeAttribute("src");
    fallbackStop = speakWithBrowser(text, {
      onEnd: finish,
      onUnavailable,
    });
    if (!fallbackStop) onUnavailable?.();
  };

  audio.onended = finish;
  audio.onerror = fallback;
  audio.onplaying = () => window.clearTimeout(watchdog);
  const watchdog = window.setTimeout(fallback, 4000);
  void audio.play().catch(fallback);

  return () => {
    stopped = true;
    window.clearTimeout(watchdog);
    audio.pause();
    audio.currentTime = 0;
    fallbackStop?.();
  };
}

/** A "Read to me" button: speaks `text`, press again to stop. */
export function SpeakButton({
  text,
  label = "Read to me",
  audioSrc,
}: {
  text: string;
  label?: string;
  audioSrc?: string;
}) {
  const [speaking, setSpeaking] = useState(false);
  const stop = useRef<(() => void) | null>(null);

  useEffect(() => () => stop.current?.(), []);

  return (
    <button
      aria-pressed={speaking}
      className={styles.speakButton}
      onClick={() => {
        if (speaking) {
          stop.current?.();
          stop.current = null;
          setSpeaking(false);
          return;
        }
        stop.current = speakText(text, {
          audioSrc,
          onEnd: () => setSpeaking(false),
          onUnavailable: () => setSpeaking(false),
        });
        setSpeaking(Boolean(stop.current));
      }}
      type="button"
    >
      <Volume2 aria-hidden="true" />
      {speaking ? "Stop" : label}
    </button>
  );
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

// A caption that types itself out one letter at a time. It resets by being
// remounted (via a `key` in the parent), so it never sets state in an effect.
function TypewriterCaption({
  text,
  speedMs,
}: {
  text: string;
  speedMs: number;
}) {
  const [charCount, setCharCount] = useState(() =>
    prefersReducedMotion() ? text.length : 0,
  );

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const timer = window.setInterval(() => {
      setCharCount((current) => {
        if (current >= text.length) {
          window.clearInterval(timer);
          return current;
        }
        return current + 1;
      });
    }, speedMs);
    return () => window.clearInterval(timer);
  }, [text, speedMs]);

  const done = charCount >= text.length;
  return (
    <span className={styles.exampleCaptionText}>
      {text.slice(0, charCount)}
      {!done ? <i aria-hidden="true" className={styles.exampleCaret} /> : null}
    </span>
  );
}

export function ExampleWalkthrough({
  title,
  steps,
  renderStep,
  typingSpeedMs = 48,
  readPauseMs = 3000,
  onFinish,
  onReveal,
  revealLabel = "I’m ready — let’s practice!",
  revealed = false,
  voice = false,
  narrationSrcs,
}: {
  title: string;
  steps: string[];
  renderStep: (stepIndex: number) => ReactNode;
  typingSpeedMs?: number;
  readPauseMs?: number;
  onFinish?: () => void;
  onReveal?: () => void;
  revealLabel?: string;
  revealed?: boolean;
  /**
   * Narrate each caption aloud and pace the steps to the voice instead of the
   * typing timer. Eight-year-olds listen far better than they read.
   */
  voice?: boolean;
  /** One mastered recording per step, in the same order as `steps`. */
  narrationSrcs?: readonly string[];
}) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  // `started` stays false until the student presses Play (or steps manually),
  // so nothing types out on its own — the example waits for them.
  const [started, setStarted] = useState(false);
  const [replayNonce, setReplayNonce] = useState(0);

  const caption = steps[index] ?? "";
  const narrationSrc = narrationSrcs?.[index];
  // Time spent on a step = time to type it out + a comfortable reading pause.
  // This scales with sentence length so longer captions get more time.
  const stepTotalMs = caption.length * typingSpeedMs + readPauseMs;
  const reachedEnd = started && index >= steps.length - 1;
  const stepKey = `${index}-${replayNonce}`;
  // Which step the narrator has already read, so a pause/unpause or an
  // unrelated re-render never re-reads or interrupts the same sentence.
  const spokenKey = useRef("");
  // Set once the speech engine proves silent, so later steps use the timer.
  const voiceBroken = useRef(false);
  const onFinishRef = useRef(onFinish);
  useEffect(() => {
    onFinishRef.current = onFinish;
  });

  // Autoplay: with a voice, a step lasts as long as its narration; without
  // one, as long as typing it out plus a reading pause.
  useEffect(() => {
    if (!started) return;
    const advance = () => {
      if (index >= steps.length - 1) {
        setPlaying(false);
        onFinishRef.current?.();
        return;
      }
      setIndex((current) => current + 1);
    };
    let timer: number | undefined;
    let stop: (() => void) | null = null;
    if (voice && !voiceBroken.current && spokenKey.current !== stepKey) {
      stop = speakText(caption, {
        audioSrc: narrationSrc,
        onEnd: () => {
          if (playing) timer = window.setTimeout(advance, 650);
        },
        onUnavailable: () => {
          voiceBroken.current = true;
          if (playing) timer = window.setTimeout(advance, stepTotalMs);
        },
      });
      if (stop) spokenKey.current = stepKey;
    }
    if (playing && !stop) timer = window.setTimeout(advance, stepTotalMs);
    // Browser speech can stall silently; never let a playing step hang.
    const safety =
      playing && stop ? window.setTimeout(advance, stepTotalMs * 2.5) : undefined;
    return () => {
      stop?.();
      window.clearTimeout(timer);
      window.clearTimeout(safety);
    };
  }, [caption, index, narrationSrc, playing, started, stepKey, stepTotalMs, steps.length, voice]);

  function play() {
    setIndex(0);
    setStarted(true);
    setReplayNonce((value) => value + 1);
    setPlaying(true);
  }

  function pause() {
    setPlaying(false);
  }

  function goNext() {
    setPlaying(false);
    setStarted(true);
    setReplayNonce((value) => value + 1);
    setIndex((current) => Math.min(current + 1, steps.length - 1));
  }

  function goPrevious() {
    setPlaying(false);
    setStarted(true);
    setReplayNonce((value) => value + 1);
    setIndex((current) => Math.max(current - 1, 0));
  }

  return (
    <section aria-label={`Worked example: ${title}`} className={styles.exampleCard}>
      <header>
        <div>
          <span>Watch an example</span>
          <strong>{title}</strong>
        </div>
        <div className={styles.exampleControls}>
          <button
            aria-label="Previous step"
            onClick={goPrevious}
            disabled={!started || index === 0}
            type="button"
          >
            <ArrowLeft aria-hidden="true" />
          </button>
          {playing ? (
            <button onClick={pause} type="button">
              <Pause aria-hidden="true" /> Pause
            </button>
          ) : (
            <button
              className={started ? "" : styles.examplePlayCta}
              onClick={play}
              type="button"
            >
              {started ? (
                <RotateCcw aria-hidden="true" />
              ) : (
                <Play aria-hidden="true" />
              )}
              {started ? " Replay" : " Play"}
            </button>
          )}
          <button
            aria-label="Next step"
            disabled={!started || index === steps.length - 1}
            onClick={goNext}
            type="button"
          >
            Next <ArrowRight aria-hidden="true" />
          </button>
        </div>
      </header>

      <div className={styles.exampleStage} key={`${index}-${replayNonce}`}>
        {renderStep(index)}
      </div>

      {started ? (
        <p aria-live="polite" className={styles.exampleCaption}>
          <span className={styles.exampleStepLabel}>
            Step {index + 1} of {steps.length}
          </span>
          <TypewriterCaption
            key={`${index}-${replayNonce}`}
            speedMs={typingSpeedMs}
            text={caption}
          />
        </p>
      ) : (
        <button className={styles.exampleStartHint} onClick={play} type="button">
          <ArrowUp aria-hidden="true" className={styles.exampleStartArrow} />
          <span>
            Tap <b>Play</b> up top to {voice ? "watch and listen" : "watch how it works"}!
          </span>
        </button>
      )}

      <div aria-hidden="true" className={styles.exampleProgress}>
        {steps.map((_, stepIndex) => {
          const isDone =
            started && (stepIndex < index || (stepIndex === index && !playing));
          const isLoading = started && stepIndex === index && playing;
          return (
            <i
              className={isDone ? styles.exampleProgressDone : ""}
              key={stepIndex}
            >
              {isLoading ? (
                <b style={{ animationDuration: `${stepTotalMs}ms` }} />
              ) : null}
            </i>
          );
        })}
      </div>

      {reachedEnd && !revealed ? (
        <div className={styles.exampleReveal}>
          <p>Nice watching! Ready to try it yourself?</p>
          <button
            className={styles.exampleRevealButton}
            onClick={() => onReveal?.()}
            type="button"
          >
            {revealLabel} <ArrowRight aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </section>
  );
}

const plainWord = "HELLO".split("");
const codedWord = "KHOOR".split("");

function delay(index: number) {
  return { "--step": index } as CSSProperties;
}

export function CipherPipelineAnimation() {
  const [run, setRun] = useState(0);
  const [paused, setPaused] = useState(false);

  return (
    <section
      aria-label="Animation showing HELLO becoming KHOOR by moving every letter forward three places"
      className={styles.animationCard}
    >
      <header>
        <div>
          <span>Watch the idea</span>
          <strong>One key moves every letter</strong>
        </div>
        <AnimationControls
          onPause={() => setPaused((value) => !value)}
          onReplay={() => {
            setPaused(false);
            setRun((value) => value + 1);
          }}
          paused={paused}
        />
      </header>

      <div
        className={`${styles.pipelineAnimation} ${
          paused ? styles.animationPaused : ""
        }`}
        key={run}
      >
        <div>
          <small>Plain</small>
          <span>
            {plainWord.map((letter, index) => (
              <b key={`${letter}-${index}`} style={delay(index)}>
                {letter}
              </b>
            ))}
          </span>
        </div>
        <div className={styles.keyPulse}>
          <small>Key</small>
          <strong>+3</strong>
          <ArrowRight aria-hidden="true" />
        </div>
        <div>
          <small>Encrypted</small>
          <span>
            {codedWord.map((letter, index) => (
              <b key={`${letter}-${index}`} style={delay(index)}>
                {letter}
              </b>
            ))}
          </span>
        </div>
      </div>
      <p>
        Each letter changes, but the movement stays the same: three places
        forward.
      </p>
    </section>
  );
}

export function ShiftRuleAnimation() {
  const [run, setRun] = useState(0);
  const [paused, setPaused] = useState(false);

  return (
    <section
      aria-label="Animation showing C moving to D and Z wrapping around to A with a shift of one"
      className={styles.animationCard}
    >
      <header>
        <div>
          <span>Moving alphabet</span>
          <strong>Shift 1 means one step forward</strong>
        </div>
        <AnimationControls
          onPause={() => setPaused((value) => !value)}
          onReplay={() => {
            setPaused(false);
            setRun((value) => value + 1);
          }}
          paused={paused}
        />
      </header>

      <div
        className={`${styles.shiftAnimation} ${
          paused ? styles.animationPaused : ""
        }`}
        key={run}
      >
        <div>
          <small>Normal move</small>
          <span><b>C</b><ArrowRight aria-hidden="true" /><b>D</b></span>
        </div>
        <div>
          <small>Wrap-around move</small>
          <span><b>Z</b><ArrowRight aria-hidden="true" /><b>A</b></span>
        </div>
      </div>
      <p>
        The alphabet is a loop. After Z, counting continues again from A.
      </p>
    </section>
  );
}

export function AnimatedLetterPath({
  path,
  label,
}: {
  path: string;
  label: string;
}) {
  const steps = path.split(" → ");

  return (
    <div aria-label={`${label}: ${steps.join(" then ")}`} className={styles.animatedPath}>
      {steps.map((step, index) => (
        <span key={`${step}-${index}`} style={delay(index)}>
          <b>{step}</b>
          {index < steps.length - 1 ? <ArrowRight aria-hidden="true" /> : null}
        </span>
      ))}
    </div>
  );
}

function AnimationControls({
  paused,
  onPause,
  onReplay,
}: {
  paused: boolean;
  onPause: () => void;
  onReplay: () => void;
}) {
  return (
    <div className={styles.animationControls}>
      <button
        aria-label={paused ? "Play animation" : "Pause animation"}
        onClick={onPause}
        type="button"
      >
        {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
      </button>
      <button aria-label="Replay animation" onClick={onReplay} type="button">
        <RotateCcw aria-hidden="true" />
      </button>
    </div>
  );
}
