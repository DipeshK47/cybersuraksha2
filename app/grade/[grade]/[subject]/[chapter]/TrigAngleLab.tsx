"use client";

import {
  Line,
  Mafs,
  MovablePoint,
  Plot,
  Point,
  Polygon,
  Text as MafsText,
  type vec,
} from "mafs";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./trig-angle-lab.module.css";

const INK = "#18201b";
const OPPOSITE = "#c73e1d";
const ADJACENT = "#2e7d32";
const HYPOTENUSE = "#4747cc";
const YELLOW = "#f7d75a";

export type TrigAngleLabStep = {
  angle: number;
  narrationSrc: string;
  caption: string;
  math: string[];
  answer?: string;
  eyebrow: string;
  title: string;
  note: string;
};

const PRESETS = [0, 30, 45, 60, 90] as const;

const EMPTY_STEP: TrigAngleLabStep = {
  angle: 36,
  narrationSrc: "",
  caption: "",
  math: [],
  eyebrow: "Explore",
  title: "Move the angle",
  note: "Drag the point and watch the three ratios change.",
};

function clampAngle(value: number) {
  return Math.max(0, Math.min(90, value));
}

function formatValue(value: number) {
  if (Math.abs(value) < 0.0005) return "0.000";
  if (Math.abs(value - 1) < 0.0005) return "1.000";
  return value.toFixed(3);
}

function fallbackDuration(step: TrigAngleLabStep) {
  const words = `${step.caption} ${step.math.join(" ")} ${step.answer ?? ""}`
    .trim().split(/\s+/).length;
  return Math.max(8_000, words * 330);
}

function formatTime(milliseconds: number) {
  const seconds = Math.max(0, Math.round(milliseconds / 1000));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

export function TrigAngleLab({ steps }: { steps: readonly TrigAngleLabStep[] }) {
  const [angle, setAngle] = useState(steps[0]?.angle ?? 36);
  const [tourIndex, setTourIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [durationMs, setDurationMs] = useState(() => fallbackDuration(steps[0] ?? EMPTY_STEP));
  const reducedMotion = useReducedMotion();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const angleRef = useRef(angle);
  const elapsedRef = useRef(elapsedMs);

  const radians = (angle * Math.PI) / 180;
  const sine = Math.sin(radians);
  const cosine = Math.cos(radians);
  const tangent = Math.abs(cosine) < 0.0005 ? null : sine / cosine;
  const movingPoint = useMemo<vec.Vector2>(() => [cosine, sine], [cosine, sine]);
  const foot = useMemo<vec.Vector2>(() => [cosine, 0], [cosine]);
  const current = steps[tourIndex] ?? steps[0] ?? EMPTY_STEP;
  const progress = Math.max(0, Math.min(1, durationMs > 0 ? elapsedMs / durationMs : 0));
  const visibleMathCount = current.math.length
    ? Math.min(current.math.length, Math.max(1, Math.floor(progress * current.math.length) + 1))
    : 0;
  const showAnswer = Boolean(current.answer && progress >= 0.84);

  useEffect(() => {
    angleRef.current = angle;
  }, [angle]);

  useEffect(() => {
    elapsedRef.current = elapsedMs;
  }, [elapsedMs]);

  useEffect(() => () => {
    if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
    audioRef.current?.pause();
  }, []);

  const animateTo = useCallback((target: number) => {
    const bounded = clampAngle(target);
    if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
    if (reducedMotion) {
      setAngle(bounded);
      return;
    }
    const from = angleRef.current;
    const started = performance.now();
    const duration = Math.min(1100, 520 + Math.abs(bounded - from) * 8);
    const tick = (now: number) => {
      const progress = Math.min(1, (now - started) / duration);
      const eased = 1 - Math.pow(1 - progress, 4);
      setAngle(from + (bounded - from) * eased);
      if (progress < 1) animationRef.current = requestAnimationFrame(tick);
      else animationRef.current = null;
    };
    animationRef.current = requestAnimationFrame(tick);
  }, [reducedMotion]);

  const pauseTour = useCallback(() => {
    audioRef.current?.pause();
    setPlaying(false);
  }, []);

  const selectStep = useCallback((next: number, keepPlaying = false) => {
    if (!steps.length) return;
    const bounded = Math.max(0, Math.min(steps.length - 1, next));
    const nextStep = steps[bounded];
    const audio = audioRef.current;
    audio?.pause();
    if (audio) audio.currentTime = 0;
    elapsedRef.current = 0;
    setElapsedMs(0);
    setDurationMs(fallbackDuration(nextStep));
    setAudioError(false);
    setTourIndex(bounded);
    animateTo(nextStep.angle);
    setPlaying(keepPlaying);
  }, [animateTo, steps]);

  const finishTourBeat = useCallback(() => {
    elapsedRef.current = durationMs;
    setElapsedMs(durationMs);
    if (tourIndex < steps.length - 1) selectStep(tourIndex + 1, true);
    else setPlaying(false);
  }, [durationMs, selectStep, steps.length, tourIndex]);

  // A source change resets the native element; playback remains controlled by
  // `playing`, so pause/resume never accidentally rewinds the teaching beat.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !current.narrationSrc) return;
    audio.pause();
    audio.currentTime = 0;
    audio.load();
  }, [current.narrationSrc]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || audioError) return;
    audio.muted = muted;
    if (playing) void audio.play().catch(() => setAudioError(true));
    else audio.pause();
  }, [audioError, current.narrationSrc, muted, playing]);

  // If a clip is unavailable, the same progress clock keeps the caption,
  // calculations and automatic angle tour working instead of freezing.
  useEffect(() => {
    if (!playing || (!audioError && current.narrationSrc)) return;
    const startedAt = performance.now() - elapsedRef.current;
    let frame = 0;
    const tick = (now: number) => {
      const next = Math.min(durationMs, now - startedAt);
      elapsedRef.current = next;
      setElapsedMs(next);
      if (next >= durationMs) finishTourBeat();
      else frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [audioError, current.narrationSrc, durationMs, finishTourBeat, playing]);

  useEffect(() => {
    const nextSrc = steps[tourIndex + 1]?.narrationSrc;
    if (!nextSrc) return;
    const preload = new Audio(nextSrc);
    preload.preload = "auto";
    return () => {
      preload.pause();
      preload.removeAttribute("src");
    };
  }, [steps, tourIndex]);

  const toggleTour = () => {
    const audio = audioRef.current;
    if (playing) {
      pauseTour();
      return;
    }
    if (tourIndex === steps.length - 1 && progress >= 0.995) {
      selectStep(0, true);
      return;
    }
    setAudioError(false);
    animateTo(current.angle);
    setPlaying(true);
    if (audio && !audioError) void audio.play().catch(() => setAudioError(true));
  };

  const seekTour = (nextProgress: number) => {
    const bounded = Math.max(0, Math.min(1, nextProgress));
    const nextMs = bounded * durationMs;
    elapsedRef.current = nextMs;
    setElapsedMs(nextMs);
    const audio = audioRef.current;
    if (audio && Number.isFinite(audio.duration)) audio.currentTime = bounded * audio.duration;
  };

  const moveFromPoint = (point: vec.Vector2) => {
    pauseTour();
    const next = clampAngle((Math.atan2(Math.max(0, point[1]), Math.max(0, point[0])) * 180) / Math.PI);
    setAngle(next);
  };

  const constrainToQuadrant = (point: vec.Vector2): vec.Vector2 => {
    const next = clampAngle((Math.atan2(Math.max(0, point[1]), Math.max(0, point[0])) * 180) / Math.PI);
    const nextRadians = (next * Math.PI) / 180;
    return [Math.cos(nextRadians), Math.sin(nextRadians)];
  };

  return (
    <section className={styles.lab} data-angle-lab aria-labelledby="angle-lab-title">
      <div className={styles.labHeader}>
        <div>
          <span className={styles.kicker}>Interactive unit-ray lab</span>
          <h4 id="angle-lab-title">Move the angle. Watch the sides answer.</h4>
          <p>Drag the yellow point, use the slider, or run the narrated tour.</p>
        </div>
        <div className={styles.tourControls} aria-label="Narrated tour controls">
          <button type="button" className={styles.primaryControl} onClick={toggleTour}>
            {playing ? <Pause aria-hidden="true" size={17} /> : <Play aria-hidden="true" size={17} />}
            {playing ? "Pause tour" : "Listen & watch"}
          </button>
          <button
            type="button"
            onClick={() => selectStep(tourIndex - 1)}
            disabled={tourIndex === 0}
            aria-label="Previous teaching moment"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => selectStep(tourIndex + 1)}
            disabled={tourIndex === steps.length - 1}
            aria-label="Next teaching moment"
          >
            ›
          </button>
          <button
            type="button"
            onClick={() => setMuted((value) => !value)}
            aria-pressed={muted}
            aria-label={muted ? "Turn teacher voice on" : "Mute teacher voice"}
          >
            {muted ? <VolumeX aria-hidden="true" size={18} /> : <Volume2 aria-hidden="true" size={18} />}
          </button>
        </div>
      </div>

      <div className={styles.stageGrid}>
        <div className={styles.geometryStage} aria-label="Draggable unit triangle">
          <Mafs
            height={430}
            pan={false}
            zoom={false}
            preserveAspectRatio="contain"
            viewBox={{ x: [-0.22, 1.25], y: [-0.22, 1.18], padding: 0.06 }}
          >
            <Plot.Parametric
              domain={[0, Math.PI / 2]}
              xy={(t) => [Math.cos(t), Math.sin(t)]}
              color="#cfc7b2"
              weight={3}
              style="dashed"
            />
            <Polygon
              points={[[0, 0], foot, movingPoint]}
              color={YELLOW}
              weight={0}
              fillOpacity={0.18}
              strokeOpacity={0}
            />
            <Line.Segment point1={[0, 0]} point2={foot} color={ADJACENT} weight={7} />
            <Line.Segment point1={foot} point2={movingPoint} color={OPPOSITE} weight={7} />
            <Line.Segment point1={[0, 0]} point2={movingPoint} color={HYPOTENUSE} weight={7} />
            <Plot.Parametric
              domain={[0, Math.max(radians, 0.015)]}
              xy={(t) => [0.2 * Math.cos(t), 0.2 * Math.sin(t)]}
              color={YELLOW}
              weight={5}
            />
            <Point x={0} y={0} color={INK} />
            <Point x={foot[0]} y={foot[1]} color={INK} />
            <MafsText x={0} y={0} attach="sw" color={INK}>A</MafsText>
            <MafsText x={foot[0]} y={foot[1]} attach="se" color={INK}>B</MafsText>
            <MafsText x={movingPoint[0]} y={movingPoint[1]} attach="ne" color={INK}>C</MafsText>
            <MafsText x={0.23 * Math.cos(radians / 2)} y={0.23 * Math.sin(radians / 2)} color={INK} size={15}>
              {`${Math.round(angle)}°`}
            </MafsText>
            <MovablePoint
              point={movingPoint}
              onMove={moveFromPoint}
              constrain={constrainToQuadrant}
              color={YELLOW}
            />
          </Mafs>

          <div className={styles.legend} aria-hidden="true">
            <span><i className={styles.oppositeDot} />opposite</span>
            <span><i className={styles.adjacentDot} />adjacent</span>
            <span><i className={styles.hypotenuseDot} />hypotenuse = 1</span>
          </div>
        </div>

        <aside className={styles.reasoningRail}>
          <div className={styles.angleReadout}>
            <span>Angle A</span>
            <strong>{Math.round(angle)}°</strong>
          </div>

          <output className={styles.ratioReadout} aria-live="polite">
            <div className={styles.sinRow}>
              <span>sin A</span>
              <b>{formatValue(sine)}</b>
              <small>opposite ÷ 1</small>
            </div>
            <div className={styles.cosRow}>
              <span>cos A</span>
              <b>{formatValue(cosine)}</b>
              <small>adjacent ÷ 1</small>
            </div>
            <div className={tangent === null ? styles.tanWarning : styles.tanRow}>
              <span>tan A</span>
              <b>{tangent === null ? "not defined" : formatValue(tangent)}</b>
              <small>{tangent === null ? "denominator = 0" : "opposite ÷ adjacent"}</small>
            </div>
          </output>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${tourIndex}-${current.title}`}
              className={styles.teacherBeat}
              aria-live="polite"
              initial={reducedMotion ? false : { opacity: 0, y: 12, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: -8, scale: 0.99 }}
              transition={{ duration: reducedMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <span>{current.eyebrow} · {tourIndex + 1}/{steps.length}</span>
              <strong>{current.title}</strong>
              <p className={styles.teacherCaption}>{current.caption}</p>
              <p className={styles.teacherNote}>{current.note}</p>
              {current.math.length > 0 && (
                <ol className={styles.teachingMath} aria-label="Calculation revealed line by line">
                  <AnimatePresence initial={false}>
                    {current.math.slice(0, visibleMathCount).map((line, index) => (
                      <motion.li
                        key={`${tourIndex}-${index}-${line}`}
                        className={index === visibleMathCount - 1 ? styles.currentMathLine : undefined}
                        initial={reducedMotion ? false : { opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: reducedMotion ? 0 : 0.24 }}
                      >
                        <span>{index + 1}</span>
                        <b>{line}</b>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ol>
              )}
              <AnimatePresence>
                {showAnswer && (
                  <motion.div
                    className={styles.answerReveal}
                    initial={reducedMotion ? false : { opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {current.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>

          <div className={styles.narrationProgress}>
            <div>
              <span>Guided explanation</span>
              <time>{formatTime(elapsedMs)} / {formatTime(durationMs)}</time>
            </div>
            <input
              type="range"
              min="0"
              max="1000"
              step="1"
              value={Math.round(progress * 1000)}
              onChange={(event) => seekTour(Number(event.target.value) / 1000)}
              aria-label="Guided explanation progress"
            />
          </div>
        </aside>
      </div>

      <div className={styles.labFooter}>
        <label htmlFor="trig-angle-control">
          <span>Angle</span>
          <input
            id="trig-angle-control"
            type="range"
            min="0"
            max="90"
            step="1"
            value={Math.round(angle)}
            onChange={(event) => {
              pauseTour();
              setAngle(Number(event.target.value));
            }}
          />
          <output>{Math.round(angle)}°</output>
        </label>
        <div className={styles.presets} aria-label="Standard-angle shortcuts">
          {PRESETS.map((preset) => (
            <button
              type="button"
              key={preset}
              aria-pressed={Math.round(angle) === preset}
              onClick={() => {
                pauseTour();
                animateTo(preset);
              }}
            >
              {preset}°
            </button>
          ))}
        </div>
        <div className={styles.stepDots} aria-label="Teaching moments">
          {steps.map((step, index) => (
            <button
              type="button"
              key={step.narrationSrc}
              className={index === tourIndex ? styles.activeStep : undefined}
              aria-label={`Teaching moment ${index + 1}: ${step.title}`}
              aria-current={index === tourIndex ? "step" : undefined}
              onClick={() => selectStep(index)}
            />
          ))}
        </div>
      </div>

      <audio
        ref={audioRef}
        src={current.narrationSrc}
        muted={muted}
        preload="auto"
        onLoadedMetadata={(event) => {
          const nextDuration = event.currentTarget.duration * 1000;
          if (Number.isFinite(nextDuration) && nextDuration > 0) {
            setDurationMs(nextDuration);
          }
        }}
        onTimeUpdate={(event) => {
          const nextElapsed = event.currentTarget.currentTime * 1000;
          elapsedRef.current = nextElapsed;
          setElapsedMs(nextElapsed);
        }}
        onError={() => {
          setAudioError(true);
        }}
        onEnded={finishTourBeat}
      />
      {audioError ? (
        <p className={styles.voiceNote}>
          <span aria-hidden="true">✦</span>
          Audio unavailable — the interactive lab remains usable
        </p>
      ) : null}
    </section>
  );
}
