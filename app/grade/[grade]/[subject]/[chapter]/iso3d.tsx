"use client";

import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import type { KeyboardEvent, ReactElement, ReactNode } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { ADJ, HYP, INK, OPP, YELLOW } from "./scene-kit";
import { FRONT, type Prim, TILTED, centroid, project } from "./iso3d-geom";
import {
  CHAPTER8_NARRATION,
  chapter8NarrationKey,
} from "./chapter8-narration.generated";
import styles from "./chapter-lesson.module.css";

const TEACHING_EASE = [0.22, 1, 0.36, 1] as const;
const GUIDED_PACES = [0.75, 1, 1.25] as const;

type RecallCheckpoint = {
  prompt: string;
  options: string[];
  correct: string;
  explanation: string;
};

export type ExplainerStep = {
  /** Stable identifier, also used as the filename when `audioBase` is supplied. */
  id?: string;
  caption: string;
  math?: string[];
  answer?: string;
  /** Vector primitives, or `img` for a pre-rendered Blender frame. */
  prims?: Prim[];
  img?: string;
  /** A complete URL for the spoken teaching track for this step. */
  narrationSrc?: string;
  /** Optional filename/path beneath `audioBase`; falls back to `id`. */
  narrationId?: string;
  /** Used for progress before media metadata is available, and as a fallback. */
  narrationDurationMs?: number;
  /** Optional teacher-authored recall interruption before calculation continues. */
  checkpoint?: RecallCheckpoint;
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

function typeWords(value: string, progress: number) {
  const words = value.match(/\S+\s*/g) ?? [];
  if (progress >= 1) return value;
  return words.slice(0, Math.ceil(clamp01(progress) * words.length)).join("").trimEnd();
}

function typeCharacters(value: string, progress: number) {
  if (progress >= 1) return value;
  return value.slice(0, Math.ceil(clamp01(progress) * value.length));
}

function teachingStage(caption: string, index: number) {
  const upper = caption.toUpperCase();
  if (/READ & TRANSLATE|QUESTION/.test(upper)) return "1 · Understand the question";
  if (/CHOOSE THE PATTERN|CHOOSE THE FORMULA|APPROACH|PLAN/.test(upper)) return "2 · Recall and choose a route";
  if (/SUBSTITUTE/.test(upper)) return "3 · Substitute carefully";
  if (/CALCULATE|ROUGH WORK|SIMPLIFY/.test(upper)) return "4 · Rough work, one line at a time";
  if (/SANITY CHECK|CHECK/.test(upper)) return "5 · Check whether it makes sense";
  if (/FINAL ANSWER|CONCLUDE/.test(upper)) return "6 · State the answer clearly";
  return `${index + 1} · Build the reasoning`;
}

function fallbackDurationFor(step: ExplainerStep | undefined, holdMs: number, guided: boolean) {
  if (!step) return holdMs;
  if (step.narrationDurationMs) return step.narrationDurationMs;
  if (!guided) return holdMs;
  const captionTime = step.caption.trim().split(/\s+/).length * 285;
  const roughWorkTime = (step.math ?? []).reduce((total, line) => total + line.length * 58, 0);
  return Math.max(10_000, captionTime + roughWorkTime + (step.answer ? 2_200 : 1_200));
}

function recallFromSteps(steps: ExplainerStep[]): RecallCheckpoint {
  const authored = steps.find((step) => step.checkpoint)?.checkpoint;
  if (authored) return authored;
  const source = steps.flatMap((step) => [step.caption, ...(step.math ?? [])]).join(" ");
  const candidates: Array<[RegExp, RecallCheckpoint]> = [
    // Exact table values win for numerical examples; identity prompts are the
    // fallback when the actual solving route is algebraic.
    [/tan\s*45°/i, {
      prompt: "Quick recall: what is tan 45°?",
      options: ["1", "1/√3", "√3"],
      correct: "1",
      explanation: "At 45°, opposite and adjacent are equal, so opposite ÷ adjacent = 1.",
    }],
    [/sin\s*30°|cos\s*60°/i, {
      prompt: "Which exact value belongs to sin 30° and cos 60°?",
      options: ["1/2", "√3/2", "1/√2"],
      correct: "1/2",
      explanation: "In the 30°–60° triangle, the shortest side is half the hypotenuse.",
    }],
    [/sin\s*60°|cos\s*30°/i, {
      prompt: "Which exact value belongs to sin 60° and cos 30°?",
      options: ["√3/2", "1/2", "1/√3"],
      correct: "√3/2",
      explanation: "The long leg in a 30°–60° triangle is √3 times the short leg, over hypotenuse 2.",
    }],
    [/sin².*cos²|1\s*[−-]\s*sin²|1\s*[−-]\s*cos²/i, {
      prompt: "Which identity connects sine and cosine before we calculate?",
      options: ["sin²A + cos²A = 1", "1 + tan²A = sec²A", "sin A = cos A"],
      correct: "sin²A + cos²A = 1",
      explanation: "This is Pythagoras divided by hypotenuse². It is the correct bridge whenever sine and cosine appear together.",
    }],
    [/1\s*\+\s*tan²|sec².*tan²/i, {
      prompt: "Complete the identity you remember from class: 1 + tan²A = ?",
      options: ["sec²A", "cosec²A", "cos²A"],
      correct: "sec²A",
      explanation: "Divide Pythagoras by the adjacent side squared: 1 + tan²A = sec²A.",
    }],
    [/1\s*\+\s*cot²|cosec².*cot²/i, {
      prompt: "Complete the identity: 1 + cot²A = ?",
      options: ["cosec²A", "sec²A", "sin²A"],
      correct: "cosec²A",
      explanation: "Divide Pythagoras by the opposite side squared: 1 + cot²A = cosec²A.",
    }],
    [/difference of squares|\(1\s*[−-]\s*cos.*\)\(1\s*\+\s*cos/i, {
      prompt: "Which algebra pattern should you recognise before expanding?",
      options: ["(a − b)(a + b) = a² − b²", "(a + b)² = a² + b²", "a/b = b/a"],
      correct: "(a − b)(a + b) = a² − b²",
      explanation: "Conjugate factors collapse to a difference of squares. Recognising the pattern saves several risky lines.",
    }],
    [/pythag|hypotenuse.*squared/i, {
      prompt: "What relationship should go into the rough-work notebook first?",
      options: ["opposite² + adjacent² = hypotenuse²", "opposite + adjacent = hypotenuse", "sin A + cos A = 1"],
      correct: "opposite² + adjacent² = hypotenuse²",
      explanation: "The side lengths come from Pythagoras. Write that relationship before inserting any numbers.",
    }],
    [/opposite.*adjacent|tan\s*A\s*=/i, {
      prompt: "Which ratio connects opposite and adjacent?",
      options: ["tan A = opposite/adjacent", "sin A = adjacent/hypotenuse", "cos A = opposite/hypotenuse"],
      correct: "tan A = opposite/adjacent",
      explanation: "TOA: tangent is opposite over adjacent.",
    }],
    [/opposite.*hypotenuse|sin\s*A\s*=/i, {
      prompt: "Which ratio connects opposite and hypotenuse?",
      options: ["sin A = opposite/hypotenuse", "tan A = opposite/adjacent", "cos A = opposite/adjacent"],
      correct: "sin A = opposite/hypotenuse",
      explanation: "SOH: sine is opposite over hypotenuse.",
    }],
    [/adjacent.*hypotenuse|cos\s*A\s*=/i, {
      prompt: "Which ratio connects adjacent and hypotenuse?",
      options: ["cos A = adjacent/hypotenuse", "sin A = adjacent/opposite", "tan A = hypotenuse/adjacent"],
      correct: "cos A = adjacent/hypotenuse",
      explanation: "CAH: cosine is adjacent over hypotenuse.",
    }],
  ];
  return candidates.find(([pattern]) => pattern.test(source))?.[1] ?? {
    prompt: "Before the arithmetic, what is the strongest first move?",
    options: ["Write the matching formula or exact table value", "Guess from the options", "Round everything immediately"],
    correct: "Write the matching formula or exact table value",
    explanation: "A clean solution begins with the relationship that connects what is given to what is asked. Numbers come after the plan.",
  };
}

function resolveNarration(step: ExplainerStep, audioBase?: string) {
  if (step.narrationSrc) {
    return { src: step.narrationSrc };
  }
  const part = step.narrationId ?? step.id;
  if (audioBase && part) {
    return { src: `${audioBase.replace(/\/$/, "")}/${part.replace(/^\//, "")}` };
  }
  return CHAPTER8_NARRATION[
    chapter8NarrationKey(step.caption, step.math, step.answer)
  ];
}

/* A small axonometric 3D engine for the lesson panels.
 *
 * Why hand-rolled rather than a library: the whole point of these figures is
 * that a shadow is a flat shape *lying on the ground* and a triangle *stands up*
 * out of it — neither reads in a face-on 2D drawing. That needs perspective and
 * correct occlusion, and nothing else here needs a 3D dependency.
 *
 * Occlusion is a painter's algorithm: every primitive is projected, given a
 * depth, and drawn far-to-near. That ordering is not optional — the same lesson
 * cost a full render in Manim, where a ground plane built from many separate
 * tiles painted straight over the objects standing on it.
 */

/* ── the renderer ───────────────────────────────────────────────────────── */

export function Scene3D({
  prims = [], img, yaw, width = 820, height = 400, scale = 46, cx, cy, caption,
  screenCaption, screenMath, screenAnswer, pitch = FRONT, motionKey = 0,
  motionDirection = "forward", teachingProgress = 0, guided = false,
}: {
  prims?: Prim[];
  /**
   * A pre-rendered figure to draw instead of the vector primitives.
   *
   * The primitives are flat fills with no lighting, so a tree came out as a
   * circle on a stick. These frames are path-traced in Blender, which is where
   * the solidity comes from. The captions and maths stay as overlays on top of
   * this same canvas so the wording can change without a re-render.
   */
  img?: string;
  yaw: number;
  width?: number;
  height?: number;
  scale?: number;
  cx?: number;
  cy?: number;
  caption?: string;
  /** Drawn in screen space, not world space — the line being explained. */
  screenCaption?: string;
  /** The formula / arithmetic for this step, shown on the canvas. */
  screenMath?: string[];
  /** A result to land, highlighted. */
  screenAnswer?: string;
  /** 0 = front elevation (the default, and how NCERT draws figures). */
  pitch?: number;
  /** Changing this value replays the teaching reveal without changing content. */
  motionKey?: string | number;
  motionDirection?: "forward" | "backward";
  /** 0–1 clock position used to stage working lines with the spoken teaching. */
  teachingProgress?: number;
  /** Slower word/character reveals used inside solved examples. */
  guided?: boolean;
}) {
  const ox = cx ?? width / 2;
  const oy = cy ?? height * 0.66;
  const drawn = prims
    .map((p, i) => {
      const at =
        p.kind === "poly" ? centroid(p.pts)
        : p.kind === "seg" ? centroid([p.a, p.b])
        : p.at;
      return { p, i, d: project(at, yaw, scale, ox, oy, pitch).d };
    })
    .sort((a, b) => b.d - a.d);   // far first — painter's algorithm
  const mathLines = screenMath ?? [];
  const guidedMathStart = 0.3;
  const guidedMathEnd = screenAnswer ? 0.9 : 0.96;
  const guidedLineWindow = mathLines.length
    ? (guidedMathEnd - guidedMathStart) / mathLines.length
    : 1;
  const shownMath = guided
    ? mathLines.map((line, lineIndex) => {
        const lineProgress = clamp01(
          (teachingProgress - guidedMathStart - lineIndex * guidedLineWindow) /
            guidedLineWindow,
        );
        return { line: typeCharacters(line, lineProgress), lineProgress };
      }).filter(({ lineProgress }) => lineProgress > 0)
    : mathLines.slice(
        0,
        mathLines.length
          ? Math.min(mathLines.length, Math.max(1, Math.floor(teachingProgress * mathLines.length) + 1))
          : 0,
      ).map((line) => ({ line, lineProgress: 1 }));
  const typedCaption = guided
    ? typeWords(screenCaption ?? "", clamp01(teachingProgress / 0.27))
    : screenCaption;
  const captionStillTyping = guided && typedCaption !== screenCaption;
  const showAnswer = Boolean(screenAnswer && teachingProgress >= (guided ? 0.94 : 0.82));
  // Sized from what is REVEALED, not from the step's full line count. Sizing it
  // from mathLines meant step 1 painted an empty notepad at its final height,
  // and at 366 of 820 units it covered nearly half the figure — Table 8.1 lost
  // its 45°/60°/90° columns behind it.
  const mathCardWidth = guided ? 300 : 252;
  const mathCardX = width - mathCardWidth - 16;
  const mathCardTop = guided ? 36 : 14;
  const mathCardHeight = guided
    ? Math.max(52, 30 + shownMath.length * 34)
    : 22 + shownMath.length * 30;

  return (
    <svg viewBox={`0 0 ${width} ${height}`}
         className={`${styles.topicSvg} ${motionDirection === "backward" ? styles.sceneBackward : styles.sceneForward}`}
         role="img"
         aria-label={caption ?? "Three-dimensional figure"}>
      <rect x="0" y="0" width={width} height={height} fill="#f3f1e7" />
      {img && (
        <motion.image key={`image-${motionKey}`} className={styles.sceneImage}
          href={img} x="0" y="0" width={width} height={height}
          preserveAspectRatio="xMidYMid meet"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: TEACHING_EASE }} />
      )}
      {drawn.map(({ p, i }) => {
        const delay = Math.min(i, 10) * 0.045;
        if (p.kind === "poly") {
          const d = p.pts.map((q) => {
            const s = project(q, yaw, scale, ox, oy, pitch);
            return `${s.x.toFixed(1)},${s.y.toFixed(1)}`;
          }).join(" ");
          return <motion.polygon key={`${motionKey}-poly-${i}`} className={styles.sceneShape}
                          initial={{ opacity: 0, scale: 0.88 }}
                          animate={{ opacity: p.op ?? 1, scale: 1 }}
                          transition={{ duration: 0.48, delay, ease: TEACHING_EASE }}
                          points={d} fill={p.fill}
                          stroke={p.stroke ?? "none"} strokeWidth={p.sw ?? 0}
                          strokeLinejoin="round" />;
        }
        if (p.kind === "seg") {
          const a = project(p.a, yaw, scale, ox, oy, pitch);
          const b = project(p.b, yaw, scale, ox, oy, pitch);
          return <motion.line key={`${motionKey}-line-${i}`}
                       className={styles.sceneStroke}
                       // Fade, NOT Motion's pathLength draw-on. pathLength normalisation
                       // leaves `stroke-dasharray: 1px 1px` on a <line>, and the stroke
                       // then renders at roughly 0.75 of its true length — so the figure
                       // settles PERMANENTLY broken: the triangle's sides stop short of
                       // its own filled corners and nothing meets.
                       initial={{ opacity: 0 }}
                       animate={{ opacity: p.op ?? 1 }}
                       transition={{ duration: p.dash ? 0.35 : 0.5, delay, ease: TEACHING_EASE }}
                       x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={p.stroke}
                       strokeWidth={p.sw} strokeDasharray={p.dash} strokeOpacity={p.op ?? 1}
                       strokeLinecap="round" />;
        }
        if (p.kind === "blob") {
          const a = project(p.at, yaw, scale, ox, oy, pitch);
          return <motion.circle key={`${motionKey}-blob-${i}`} className={styles.sceneShape}
                         initial={{ opacity: 0, scale: 0.3 }}
                         animate={{ opacity: 1, scale: 1 }}
                         transition={{ type: "spring", stiffness: 250, damping: 18, delay }}
                         cx={a.x} cy={a.y} r={p.r * scale} fill={p.fill}
                         stroke={p.stroke ?? "none"} strokeWidth={p.sw ?? 0} />;
        }
        const a = project(p.at, yaw, scale, ox, oy, pitch);
        return (
          <motion.text key={`${motionKey}-text-${i}`} className={styles.sceneWord}
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.36, delay: delay + 0.12, ease: TEACHING_EASE }}
                x={a.x} y={a.y + (p.dy ?? 0)} textAnchor="middle" fill={p.fill}
                fontSize={p.size ?? 17} fontWeight="800">{p.text}</motion.text>
        );
      })}

      {/* ── screen-space overlays: the maths belongs on the picture ── */}
      {shownMath.length > 0 && (
        <motion.g key={`math-${motionKey}`} className={styles.sceneMathCard}
                  initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.48, delay: 0.18, ease: TEACHING_EASE }}>
          <motion.rect x={mathCardX} y={mathCardTop} width={mathCardWidth}
                height={mathCardHeight}
                rx="12" fill="#fffdf5" stroke={INK} strokeWidth="3" />
          {guided ? (
            <>
              <text x={mathCardX + 14} y={mathCardTop - 10} fill={INK}
                    fontSize="12" fontWeight="900" letterSpacing="1.4">
                ROUGH WORK · ONE LINE AT A TIME
              </text>
              {Array.from({ length: shownMath.length }, (_, gridIndex) => (
                <line key={`grid-${gridIndex}`} x1={mathCardX + 10}
                      x2={mathCardX + mathCardWidth - 10}
                      y1={mathCardTop + 35 + gridIndex * 34}
                      y2={mathCardTop + 35 + gridIndex * 34}
                      stroke="#8fa8c9" strokeOpacity="0.24" strokeWidth="1" />
              ))}
            </>
          ) : null}
          <AnimatePresence initial={false}>
            {shownMath.map(({ line, lineProgress }, lineIndex) => (
              <motion.g key={`${motionKey}-working-${lineIndex}`}>
                {lineIndex === shownMath.length - 1 ? (
                  <motion.rect
                    layoutId={`math-focus-${motionKey}`}
                    x={mathCardX + 8}
                    y={mathCardTop + (guided ? 7 : 9) + lineIndex * (guided ? 34 : 30)}
                    width={mathCardWidth - 16} height={guided ? 31 : 27} rx="7"
                    fill="#ffe37a" fillOpacity="0.58"
                    transition={{ type: "spring", stiffness: 320, damping: 28 }}
                  />
                ) : null}
                <motion.text className={styles.sceneMathLine}
                      initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.34, ease: TEACHING_EASE }}
                      x={mathCardX + 16}
                      y={mathCardTop + (guided ? 30 : 30) + lineIndex * (guided ? 34 : 30)}
                      fill={HYP} fontSize={guided ? "18" : "19"} fontWeight="800">
                  {line}{guided && lineProgress < 1 ? "▍" : ""}
                </motion.text>
              </motion.g>
            ))}
          </AnimatePresence>
        </motion.g>
      )}
      {showAnswer && (
        <motion.g key={`answer-${motionKey}`} className={styles.sceneAnswer}
                  initial={{ opacity: 0, scale: 0.75 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.72 }}>
          <rect x={width - 268} y={height - 118} width="252" height="46" rx="12"
                fill="#7cb518" stroke={INK} strokeWidth="3" />
          <text x={width - 142} y={height - 87} textAnchor="middle" fill="#171e19"
                fontSize="20" fontWeight="800">{screenAnswer}</text>
        </motion.g>
      )}
      {typedCaption && (() => {
        // Wrap by words: a caption can be a whole exam question, and a single
        // <text> would simply run off both edges of the canvas.
        const words = typedCaption.split(" ");
        const lines: string[] = [];
        let cur = "";
        for (const w of words) {
          if ((cur + " " + w).trim().length > 84) { lines.push(cur.trim()); cur = w; }
          else cur = `${cur} ${w}`;
        }
        if (cur.trim()) lines.push(cur.trim());
        const shown = lines.slice(0, 3);
        const boxH = 20 + shown.length * 24;
        return (
          <motion.g key={`caption-${motionKey}`} className={styles.sceneCaption}
                    initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.42, delay: 0.1, ease: TEACHING_EASE }}>
            <rect x="0" y={height - boxH} width={width} height={boxH}
                  fill="#18201b" fillOpacity="0.9" />
            {shown.map((ln, k) => (
              <text key={`${ln}-${k}`} x={width / 2} y={height - boxH + 26 + k * 24}
                    textAnchor="middle" fill="#f8f5ea" fontSize="17"
                    fontWeight="700">
                {ln}{captionStillTyping && k === shown.length - 1 ? " ▍" : ""}
              </text>
            ))}
          </motion.g>
        );
      })()}
    </svg>
  );
}

/**
 * A stepped 3D explainer: it plays the topic through from start to finish, with
 * the caption and the arithmetic drawn on the canvas rather than sitting in a
 * paragraph underneath. Auto-plays, and can be stepped or scrubbed by hand.
 */
export function Explainer3D({
  steps, height = 420, scale = 48, holdMs = 5200, autoplay = false, tilted = false,
  audioBase, guided = false,
}: {
  steps: ExplainerStep[];
  height?: number;
  scale?: number;
  holdMs?: number;
  /** Off by default: a page of figures all playing at once is unreadable. */
  autoplay?: boolean;
  /** Opt in to the axonometric view; the default is a front elevation. */
  tilted?: boolean;
  /** Optional root for steps that provide an `id` or `narrationId`. */
  audioBase?: string;
  /** Turns on the question-first, recall-gated, slow worked-example mode. */
  guided?: boolean;
}) {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(autoplay);
  const [completed, setCompleted] = useState(false);
  const [muted, setMuted] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [durationMs, setDurationMs] = useState(() =>
    fallbackDurationFor(steps[0], holdMs, guided),
  );
  const [audioError, setAudioError] = useState(false);
  const [motionRun, setMotionRun] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [yaw, setYaw] = useState(0);
  const [pace, setPace] = useState(guided ? 0.75 : 1);
  const [checkpointPassed, setCheckpointPassed] = useState(false);
  const [recallOpen, setRecallOpen] = useState(false);
  const [recallPick, setRecallPick] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recallHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const elapsedRef = useRef(0);
  const drag = useRef<{ x: number; yaw: number } | null>(null);
  const playerId = useId();

  const narration = useMemo(
    () => steps.map((item) => resolveNarration(item, audioBase)),
    [audioBase, steps],
  );
  const safeI = Math.min(i, Math.max(0, steps.length - 1));
  const step = steps[safeI];
  const currentNarration = narration[safeI];
  const currentSrc = audioError ? undefined : currentNarration?.src;
  const fallbackDuration = fallbackDurationFor(step, holdMs, guided);
  const atLastStep = safeI >= steps.length - 1;
  const progress = Math.max(0, Math.min(1, durationMs > 0 ? elapsedMs / durationMs : 0));
  const hasNarration = narration.some(Boolean);
  const recall = useMemo(() => recallFromSteps(steps), [steps]);
  const checkpointAt = useMemo(() => {
    if (!guided || steps.length < 2) return -1;
    const planned = steps.findIndex((item) =>
      /CHOOSE THE PATTERN|CHOOSE THE FORMULA|APPROACH|PLAN/i.test(item.caption),
    );
    return planned >= 0 ? planned : Math.min(1, steps.length - 1);
  }, [guided, steps]);
  const gateCheckpoint = guided && safeI === checkpointAt && !checkpointPassed;
  const stageLabel = guided ? teachingStage(step?.caption ?? "", safeI) : null;
  const recallCorrect = recallPick === recall.correct;

  const finishBeat = useCallback(() => {
    elapsedRef.current = durationMs;
    setElapsedMs(durationMs);
    if (gateCheckpoint) {
      setPlaying(false);
      setRecallPick(null);
      setRecallOpen(true);
      return;
    }
    if (atLastStep) {
      setCompleted(true);
      setPlaying(false);
      return;
    }
    const nextStep = steps[Math.min(steps.length - 1, safeI + 1)];
    elapsedRef.current = 0;
    setElapsedMs(0);
    setDurationMs(fallbackDurationFor(nextStep, holdMs, guided));
    setAudioError(false);
    setDirection(1);
    setI((value) => Math.min(steps.length - 1, value + 1));
  }, [atLastStep, durationMs, gateCheckpoint, guided, holdMs, safeI, steps]);

  // Every navigation tears down the previous voice track and puts the new
  // teaching beat at time zero. This also makes tab-driven unmounts harmless.
  useEffect(() => {
    const audio = audioRef.current;
    audio?.pause();
    if (audio) {
      audio.currentTime = 0;
      audio.load();
    }
  }, [i, currentNarration?.src]);

  // The native audio element is the master clock. Browser autoplay policy may
  // pause an `autoplay` explainer until the learner presses Play.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentNarration?.src || audioError) return;
    audio.muted = muted;
    audio.playbackRate = pace;
    if (playing) {
      void audio.play().catch(() => setPlaying(false));
    } else {
      audio.pause();
    }
  }, [audioError, currentNarration?.src, i, motionRun, muted, pace, playing]);

  // Silent or temporarily unavailable narration keeps the same transport and
  // progress behaviour, using the configured hold as its clock.
  useEffect(() => {
    if (!playing || currentSrc || !step) return;
    const startedAt = performance.now() - elapsedRef.current / pace;
    let frame = 0;
    const tick = (now: number) => {
      const next = Math.min(fallbackDuration, (now - startedAt) * pace);
      elapsedRef.current = next;
      setElapsedMs(next);
      if (next >= fallbackDuration) finishBeat();
      else frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [currentSrc, fallbackDuration, finishBeat, i, motionRun, pace, playing, step]);

  // Warm only the next clip: enough for seamless teaching without downloading
  // an entire chapter of speech when the student opens one example.
  useEffect(() => {
    const nextSrc = narration[safeI + 1]?.src;
    if (!nextSrc) return;
    const nextAudio = new Audio();
    nextAudio.preload = "auto";
    nextAudio.src = nextSrc;
    nextAudio.load();
    return () => {
      nextAudio.pause();
      nextAudio.removeAttribute("src");
      nextAudio.load();
    };
  }, [narration, safeI]);

  useEffect(() => () => {
    audioRef.current?.pause();
  }, []);

  useEffect(() => {
    if (recallOpen) recallHeadingRef.current?.focus();
  }, [recallOpen]);

  if (!step) return null;

  const stopAudio = () => {
    const audio = audioRef.current;
    audio?.pause();
    if (audio) audio.currentTime = 0;
  };
  const moveTo = (
    next: number,
    nextDirection: 1 | -1,
    options: { bypassGate?: boolean; play?: boolean; preserveCheckpoint?: boolean } = {},
  ) => {
    const bounded = Math.max(0, Math.min(steps.length - 1, next));
    if (
      guided && !options.bypassGate && nextDirection === 1 &&
      safeI === checkpointAt && bounded > safeI && !checkpointPassed
    ) {
      audioRef.current?.pause();
      setPlaying(false);
      setRecallPick(null);
      setRecallOpen(true);
      return;
    }
    stopAudio();
    elapsedRef.current = 0;
    setElapsedMs(0);
    setDurationMs(fallbackDurationFor(steps[bounded], holdMs, guided));
    setAudioError(false);
    setCompleted(false);
    setPlaying(Boolean(options.play));
    setRecallOpen(false);
    setRecallPick(null);
    if (guided && !options.preserveCheckpoint && bounded <= checkpointAt) {
      setCheckpointPassed(false);
    }
    setDirection(nextDirection);
    setI(bounded);
  };
  const replayStep = () => {
    stopAudio();
    elapsedRef.current = 0;
    setElapsedMs(0);
    setCompleted(false);
    setDurationMs(fallbackDuration);
    setAudioError(false);
    setRecallOpen(false);
    setRecallPick(null);
    if (guided && safeI === checkpointAt) setCheckpointPassed(false);
    setMotionRun((value) => value + 1);
    setPlaying(true);
  };
  const togglePlay = () => {
    if (recallOpen) return;
    if (completed) {
      stopAudio();
      elapsedRef.current = 0;
      setElapsedMs(0);
      setCompleted(false);
      setDurationMs(fallbackDurationFor(steps[0], holdMs, guided));
      setAudioError(false);
      setCheckpointPassed(false);
      setRecallOpen(false);
      setRecallPick(null);
      setDirection(1);
      setI(0);
      setMotionRun((value) => value + 1);
      setPlaying(true);
      return;
    }
    setPlaying((value) => !value);
  };
  const continueAfterRecall = () => {
    if (recallPick !== recall.correct) return;
    setCheckpointPassed(true);
    setRecallOpen(false);
    setRecallPick(null);
    if (atLastStep) {
      setCompleted(true);
      setPlaying(false);
      return;
    }
    moveTo(safeI + 1, 1, { bypassGate: true, play: true, preserveCheckpoint: true });
  };
  const seek = (fraction: number) => {
    const bounded = Math.max(0, Math.min(1, fraction));
    const nextMs = bounded * durationMs;
    elapsedRef.current = nextMs;
    setElapsedMs(nextMs);
    setCompleted(false);
    const audio = audioRef.current;
    if (audio && Number.isFinite(audio.duration)) audio.currentTime = bounded * audio.duration;
  };
  const onKeys = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === "ArrowLeft" && safeI > 0) {
      event.preventDefault();
      moveTo(safeI - 1, -1);
    } else if (event.key === "ArrowRight" && !atLastStep) {
      event.preventDefault();
      moveTo(safeI + 1, 1);
    } else if (event.key === " ") {
      event.preventDefault();
      togglePlay();
    }
  };
  const formatTime = (milliseconds: number) => {
    const seconds = Math.max(0, Math.round(milliseconds / 1000));
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
  };

  const onDown = (e: React.PointerEvent) => {
    drag.current = { x: e.clientX, yaw };
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (drag.current) setYaw(drag.current.yaw + (e.clientX - drag.current.x) * 0.006);
  };
  const onUp = () => { drag.current = null; };

  return (
    <MotionConfig reducedMotion="user" transition={{ ease: TEACHING_EASE }}>
      <div className={styles.turntable} onKeyDown={onKeys} tabIndex={0}
           aria-label="Step-by-step animated explanation">
        <div className={`${styles.explainerStage} ${tilted ? styles.turntableStage : ""}`}
             onPointerDown={tilted ? onDown : undefined}
             onPointerMove={tilted ? onMove : undefined}
             onPointerUp={tilted ? onUp : undefined}
             onPointerCancel={tilted ? onUp : undefined}>
          {stageLabel ? (
            <p className={styles.teachingStage} aria-live="polite">
              <span>Teacher&apos;s route</span>
              <strong>{stageLabel}</strong>
            </p>
          ) : null}
          <AnimatePresence initial={false} mode="popLayout" custom={direction}>
            <motion.div
              key={`${safeI}-${motionRun}`}
              className={styles.sceneBeat}
              custom={direction}
              initial={{ opacity: 0, x: direction * 46, scale: 0.985 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: direction * -34, scale: 0.99 }}
              transition={{ duration: 0.46, ease: TEACHING_EASE }}
            >
              <Scene3D
                prims={step.prims} img={step.img}
                yaw={tilted ? yaw : 0} height={height} scale={scale}
                pitch={tilted ? TILTED : FRONT}
                screenCaption={step.caption} screenMath={step.math} screenAnswer={step.answer}
                caption={step.caption} motionKey={`${safeI}-${motionRun}`}
                motionDirection={direction === 1 ? "forward" : "backward"}
                teachingProgress={progress}
                guided={guided}
              />
            </motion.div>
          </AnimatePresence>

          <AnimatePresence>
            {recallOpen ? (
              <motion.section
                className={styles.recallCheckpoint}
                role="region"
                aria-labelledby={`${playerId}-recall-title`}
                initial={{ opacity: 0, y: 22, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.99 }}
                transition={{ duration: 0.3, ease: TEACHING_EASE }}
              >
                <span className={styles.recallKicker}>Pause · recall · choose</span>
                <h3 id={`${playerId}-recall-title`} ref={recallHeadingRef} tabIndex={-1}>
                  {recall.prompt}
                </h3>
                <div className={styles.recallOptions} role="group" aria-label="Choose one answer">
                  {recall.options.map((option) => (
                    <button
                      type="button"
                      key={option}
                      aria-pressed={recallPick === option}
                      disabled={recallPick !== null}
                      onClick={() => setRecallPick(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {recallPick ? (
                  <div
                    className={`${styles.recallFeedback} ${recallCorrect ? styles.recallCorrect : styles.recallWrong}`}
                    aria-live="polite"
                  >
                    <strong>{recallCorrect ? "Yes — that is the route." : "Not yet — rebuild the memory."}</strong>
                    <p>{recall.explanation}</p>
                    {recallCorrect ? (
                      <button type="button" className={styles.recallContinue} onClick={continueAfterRecall}>
                        Continue the calculation <span aria-hidden="true">→</span>
                      </button>
                    ) : (
                      <button type="button" onClick={() => setRecallPick(null)}>
                        Try again
                      </button>
                    )}
                  </div>
                ) : (
                  <p className={styles.recallHint}>Pick from memory first. The solution stays paused until you choose the route.</p>
                )}
              </motion.section>
            ) : null}
          </AnimatePresence>
        </div>

        {currentNarration?.src ? (
          <audio
            ref={audioRef}
            src={currentNarration.src}
            preload="auto"
            muted={muted}
            onLoadedMetadata={(event) => {
              const mediaDuration = event.currentTarget.duration * 1000;
              if (Number.isFinite(mediaDuration) && mediaDuration > 0) setDurationMs(mediaDuration);
            }}
            onTimeUpdate={(event) => {
              const nextMs = event.currentTarget.currentTime * 1000;
              elapsedRef.current = nextMs;
              setElapsedMs(nextMs);
            }}
            onEnded={finishBeat}
            onError={() => setAudioError(true)}
          />
        ) : null}

        <div className={styles.turntableBar}>
          <div className={styles.transportButtons}>
            <button type="button" onClick={() => moveTo(safeI - 1, -1)}
                    disabled={safeI === 0} aria-label="Previous teaching step">‹</button>
            <button type="button" className={styles.playButton} onClick={togglePlay}
                    disabled={recallOpen}
                    aria-label={completed ? "Restart explanation" : playing ? "Pause explanation" : "Play explanation"}>
              <span aria-hidden="true">{completed ? "↺" : playing ? "Ⅱ" : "▶"}</span>
              {completed ? "Start again" : playing ? "Pause" : "Play"}
            </button>
            <button type="button" onClick={() => moveTo(safeI + 1, 1)}
                    disabled={atLastStep || recallOpen} aria-label="Next teaching step">›</button>
            <button type="button" onClick={replayStep} aria-label="Replay this teaching step"
                    title="Replay this step">↺ <span className={styles.buttonText}>Replay step</span></button>
            {hasNarration ? (
              <button type="button" onClick={() => setMuted((value) => !value)}
                      aria-pressed={muted} aria-label={muted ? "Turn narration on" : "Mute narration"}
                      title={muted ? "Turn narration on" : "Mute narration"}>
                <span aria-hidden="true">{muted ? "🔇" : "🔊"}</span>
                <span className={styles.buttonText}>{muted ? "Voice off" : "Voice on"}</span>
              </button>
            ) : null}
            {guided ? (
              <div className={styles.paceControl} role="group" aria-label="Teaching pace">
                <span>Pace</span>
                {GUIDED_PACES.map((rate) => (
                  <button
                    type="button"
                    key={rate}
                    aria-label={`${rate} times teaching pace`}
                    aria-pressed={pace === rate}
                    className={pace === rate ? styles.paceActive : undefined}
                    onClick={() => setPace(rate)}
                  >
                    {rate}×
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className={styles.stepProgress}>
            <label htmlFor={`${playerId}-progress`}>
              <span className={styles.srOnly}>Teaching-step progress</span>
              <input id={`${playerId}-progress`} type="range" min="0" max="1000"
                     value={Math.round(progress * 1000)}
                     onChange={(event) => seek(Number(event.target.value) / 1000)} />
            </label>
            <span className={styles.timecode}>{formatTime(elapsedMs)} / {formatTime(durationMs)}</span>
          </div>

          <div className={styles.stepStatus} aria-live="polite">
            <div className={styles.stepDots} aria-hidden="true">
              {steps.map((item, k) => (
                <i key={`${item.id ?? item.caption}-${k}`}
                   className={k < safeI ? styles.stepDone : k === safeI ? styles.stepOn : undefined} />
              ))}
            </div>
            <span>step {safeI + 1} of {steps.length}{tilted ? " · drag the figure to turn" : ""}</span>
          </div>

          {currentNarration && audioError ? (
            <p className={styles.voiceDisclosure}>
              <span aria-hidden="true">✦</span>
              Audio unavailable — using visual timing
            </p>
          ) : null}
        </div>
      </div>
    </MotionConfig>
  );
}

/**
 * A set of solved examples, one shown at a time.
 *
 * They used to be stacked in a single column, so there was no way to tell which
 * example you were on or to jump to a particular one. Each now has a tab
 * carrying its NCERT reference, and only the chosen one renders.
 */
export function SolvedExamples({
  examples,
}: {
  examples: { ref: string; title: string; body: ReactNode }[];
}) {
  const [pick, setPick] = useState(0);
  const [hintOpen, setHintOpen] = useState(false);
  const chosen = examples[Math.min(pick, examples.length - 1)];
  const tabsId = useId();
  type GuidedBodyProps = { steps?: ExplainerStep[]; guided?: boolean };
  const bodyElement = isValidElement<GuidedBodyProps>(chosen.body)
    ? chosen.body as ReactElement<GuidedBodyProps>
    : null;
  const teachingSteps = bodyElement?.props.steps ?? [];
  const removeBeatLabel = (value: string) =>
    value.replace(
      /^(READ & TRANSLATE|QUESTION|CHOOSE THE PATTERN|CHOOSE THE FORMULA|APPROACH|PLAN)\s*[—:-]\s*/i,
      "",
    );
  const questionTranslation = teachingSteps[0]
    ? removeBeatLabel(teachingSteps[0].caption)
    : `Work out ${chosen.title}. First identify what is given and what the question asks you to find.`;
  const thinkingHint = teachingSteps[1]
    ? removeBeatLabel(teachingSteps[1].caption)
    : "Before using any numbers, write the formula or exact value that connects the given information to the unknown.";
  const guidedBody = bodyElement && teachingSteps.length
    ? cloneElement(bodyElement, { guided: true })
    : chosen.body;
  const chooseExample = (next: number) => {
    setHintOpen(false);
    setPick((next + examples.length) % examples.length);
  };
  return (
    <div className={styles.examples}>
      <div className={styles.exampleTabs} role="tablist" aria-label="Solved examples">
        {examples.map((ex, k) => (
          <button
            aria-controls={`${tabsId}-panel-${k}`}
            aria-selected={k === pick}
            className={k === pick ? styles.exampleTabOn : undefined}
            id={`${tabsId}-tab-${k}`}
            key={ex.ref}
            onClick={() => chooseExample(k)}
            onKeyDown={(event) => {
              if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
              event.preventDefault();
              const offset = event.key === "ArrowRight" ? 1 : -1;
              chooseExample(k + offset);
            }}
            role="tab"
            tabIndex={k === pick ? 0 : -1}
            type="button"
          >
            <b>{ex.ref}</b>
            <span>{ex.title}</span>
          </button>
        ))}
      </div>
      <div className={styles.exampleBody} role="tabpanel"
           id={`${tabsId}-panel-${pick}`} aria-labelledby={`${tabsId}-tab-${pick}`}
           key={chosen.ref}>
        <p className={styles.exampleNow}>
          Example {pick + 1} of {examples.length} — {chosen.ref}
        </p>
        <section className={styles.questionFirst} aria-labelledby={`${tabsId}-question-${pick}`}>
          <div className={styles.questionFirstTopline}>
            <span>Question first</span>
            <small>Read → translate → plan → calculate → check</small>
          </div>
          <h3 id={`${tabsId}-question-${pick}`}>{chosen.ref}</h3>
          <p className={styles.questionExpression}>{chosen.title}</p>
          <p className={styles.questionTranslation}>{questionTranslation}</p>
          <button
            type="button"
            className={styles.thinkingHintButton}
            aria-expanded={hintOpen}
            aria-controls={`${tabsId}-hint-${pick}`}
            onClick={() => setHintOpen((value) => !value)}
          >
            <span aria-hidden="true">{hintOpen ? "−" : "+"}</span>
            {hintOpen ? "Hide the thinking hint" : "Need a thinking hint before you begin?"}
          </button>
          <AnimatePresence initial={false}>
            {hintOpen ? (
              <motion.p
                className={styles.thinkingHint}
                id={`${tabsId}-hint-${pick}`}
                initial={{ opacity: 0, height: 0, y: -6 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -6 }}
              >
                <strong>Think, don&apos;t calculate yet:</strong> {thinkingHint}
              </motion.p>
            ) : null}
          </AnimatePresence>
        </section>
        {guidedBody}
      </div>
    </div>
  );
}

/** The three big section headings each topic is built from. */
export function SectionHeading({ kicker, title, blurb }: {
  kicker: string; title: string; blurb?: string;
}) {
  return (
    <div className={styles.sectionHeading}>
      <span>{kicker}</span>
      <h3>{title}</h3>
      {blurb ? <p>{blurb}</p> : null}
    </div>
  );
}

export { ADJ, HYP, INK, OPP, YELLOW };
// One import site for panels: geometry travels out through the renderer.
export {
  ground, groundLine, post, shadowQuad, standingTriangle, tree,
  rightTriangle3D, tower3d,
} from "./iso3d-geom";
export type { Prim, V3 } from "./iso3d-geom";
