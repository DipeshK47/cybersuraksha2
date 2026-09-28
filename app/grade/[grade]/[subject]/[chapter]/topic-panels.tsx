"use client";

/**
 * Section 8.1 — interactive teaching, in the Class 3 concept-cluster shape:
 *   concept explanation → animated worked example → checked practice.
 *
 * Content is NCERT §8.1: the three situations (Fig 8.1 Qutub Minar, Fig 8.2 the
 * river, Fig 8.3 the balloon), the tri/gon/metron etymology, and the one skill
 * §8.1 actually teaches — spotting the right triangle nobody drew.
 *
 * Note on "solved examples": NCERT's numbered Examples 1–5 live in §8.2, not
 * §8.1. The worked walkthroughs here are the §8.1 figures, taught step by step.
 */

import type { ReactNode } from "react";
import {
  PracticeSet,
  type LessonHints,
} from "../../../../components/learning/LearningSupport";
import { ADJ, HYP, INK, OPP, type PanelProps, YELLOW } from "./scene-kit";
import {
  Explainer3D, ground, groundLine, type Prim, SectionHeading, SolvedExamples,
  post, tower3d, tree, type V3,
} from "./iso3d";
import { PANELS_8_2 } from "./topic-panels-8-2";
import { PANELS_8_3 } from "./topic-panels-8-3";
import { PANELS_8_4 } from "./topic-panels-8-4";
import styles from "./chapter-lesson.module.css";

import {
  WHY_QUESTIONS,
  HIDDEN_QUESTIONS,
} from "../../../../data/practice-bank";



/* ── scene geometry ───────────────────────────────────────────────────────
   The shadow figure is drawn to true scale (1 m = 26 px) so the tree really is
   six times the pole and the two shadow triangles really are similar. The
   picture has to carry the argument; if the angles don't match on screen, the
   figure contradicts the sentence it illustrates. */
const M = 26;                        // px per metre
const GY = 400;                      // ground line
const POLE_X = 150;
const TREE_X = 430;
const POLE_TOP = GY - 2 * M;         // 348
const TREE_TOP = GY - 12 * M;        // 88
const POLE_TIP = POLE_X + 1 * M;     // 176 — shadow tip
const TREE_TIP = TREE_X + 6 * M;     // 586 — shadow tip

/** Arc at a shadow tip, from the ground round to the sun ray (slope 2:1). */
function sunAngle(tipX: number, r: number) {
  return (
    `M ${tipX - r} ${GY} A ${r} ${r} 0 0 1 ` +
    `${(tipX - r * 0.4472).toFixed(1)} ${(GY - r * 0.8944).toFixed(1)}`
  );
}

/** Scalloped tree crown as one closed path, so only the silhouette is outlined. */
const CROWN = (() => {
  const cx = TREE_X, cy = TREE_TOP + 70, R = 66, bump = 27;
  const pt = (k: number) => {
    const t = ((-90 + k * 40) * Math.PI) / 180;
    return `${(cx + R * Math.cos(t)).toFixed(1)} ${(cy + R * Math.sin(t)).toFixed(1)}`;
  };
  let d = `M ${pt(0)}`;
  for (let k = 1; k <= 9; k += 1) d += ` A ${bump} ${bump} 0 0 1 ${pt(k % 9)}`;
  return `${d} Z`;
})();

/* ── Qutub Minar ──────────────────────────────────────────────────────────
   Five storeys that step in at every balcony, deep flutes, heavy corbelled
   balconies, red sandstone below and marble on top. The step-in and the
   projecting balconies are what stop it reading as a plain cone. */
const MIN_CX = 620, MIN_BASE = 420, MIN_TOP = 101;
const SAND = "#b5563a", MARBLE = "#e8e2d2";
/** Storey heights follow the real tower: 29 / 12 / 9 / 6.5 / 8 m of 72.5 m. */
const STOREYS = [
  { y0: MIN_BASE, y1: 280, w0: 30, w1: 22, fill: SAND },
  { y0: 278, y1: 220, w0: 20.5, w1: 18, fill: SAND },
  { y0: 218, y1: 175, w0: 16.5, w1: 14.5, fill: SAND },
  { y0: 173, y1: 142, w0: 13.5, w1: 12, fill: MARBLE },
  { y0: 140, y1: MIN_TOP, w0: 11, w1: 9.5, fill: MARBLE },
];

// Retained as a vector fallback for environments that cannot load the rendered asset.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function MinarScene({ step }: { step: number }) {
  const eye = { x: 175, y: 341 };
  const foot = { x: MIN_CX, y: eye.y };
  const top = { x: MIN_CX, y: MIN_TOP - 21 };  // the cupola, not the shaft

  return (
    <svg viewBox="0 0 820 480" className={styles.topicSvg} role="img"
         aria-label="A student on the ground looking up at the Qutub Minar, with the right triangle appearing between them">
      <rect x="0" y="0" width="820" height="480" fill="#f3f1e7" />
      <rect x="0" y={MIN_BASE} width="820" height="60" fill="#dcd8c6" />
      <line x1="0" y1={MIN_BASE} x2="820" y2={MIN_BASE} stroke={INK} strokeWidth="4" />

      {/* ── the Minar ── */}
      {STOREYS.map((st) => (
        <g key={st.y0}>
          <polygon
            points={`${MIN_CX - st.w0},${st.y0} ${MIN_CX + st.w0},${st.y0} ${MIN_CX + st.w1},${st.y1} ${MIN_CX - st.w1},${st.y1}`}
            fill={st.fill} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
          {[-0.72, -0.43, -0.14, 0.14, 0.43, 0.72].map((f) => (
            <line key={f} x1={MIN_CX + f * st.w0} y1={st.y0 - 3}
                  x2={MIN_CX + f * st.w1} y2={st.y1 + 3}
                  stroke={INK} strokeOpacity="0.3" strokeWidth="1.8" />
          ))}
          {/* corbel brackets carrying the balcony above this storey */}
          {[-0.8, -0.35, 0.35, 0.8].map((f) => (
            <path key={`c${f}`}
              d={`M ${MIN_CX + f * st.w1} ${st.y1 + 1} l ${f < 0 ? -9 : 9} -9 l 0 9 Z`}
              fill="#c98a5c" stroke={INK} strokeWidth="1.6" />
          ))}
          <rect x={MIN_CX - st.w1 - 17} y={st.y1 - 13} width={2 * st.w1 + 34} height="14"
                rx="2" fill="#d9a066" stroke={INK} strokeWidth="3" />
          <line x1={MIN_CX - st.w1 - 15} y1={st.y1 - 4} x2={MIN_CX + st.w1 + 15} y2={st.y1 - 4}
                stroke={INK} strokeOpacity="0.35" strokeWidth="2" />
        </g>
      ))}
      {/* cupola */}
      <rect x={MIN_CX - 13} y={MIN_TOP - 24} width="26" height="10" rx="2"
            fill={MARBLE} stroke={INK} strokeWidth="2.5" />
      <path d={`M ${MIN_CX - 11} ${MIN_TOP - 24} q 11 -16 22 0 Z`}
            fill={MARBLE} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <line x1={MIN_CX} y1={MIN_TOP - 36} x2={MIN_CX} y2={MIN_TOP - 44}
            stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <circle cx={MIN_CX} cy={MIN_TOP - 47} r="3.5" fill={INK} />

      {/* ── the student, arm up towards the top ── */}
      <g>
        <line x1="163" y1="392" x2="161" y2={MIN_BASE} stroke="#2f3b4a" strokeWidth="8" strokeLinecap="round" />
        <line x1="179" y1="392" x2="183" y2={MIN_BASE} stroke="#2f3b4a" strokeWidth="8" strokeLinecap="round" />
        <path d="M158 358 h26 l5 36 h-36 Z" fill="#2f7fbf" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
        <line x1="160" y1="363" x2="147" y2="386" stroke="#2f7fbf" strokeWidth="8" strokeLinecap="round" />
        <line x1="182" y1="363" x2="206" y2="335" stroke="#2f7fbf" strokeWidth="8" strokeLinecap="round" />
        <circle cx="171" cy="344" r="14" fill="#e8b98a" stroke={INK} strokeWidth="2.5" />
        <path d="M157 341 q3 -16 14 -16 q11 0 14 16 q-6 -7 -14 -7 q-8 0 -14 7 Z"
              fill="#2a2118" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
      </g>

      {step >= 2 && (
        <line x1={MIN_CX} y1={eye.y} x2={MIN_CX} y2={MIN_BASE}
              stroke={OPP} strokeWidth="3" strokeDasharray="6 6" strokeOpacity="0.55" />
      )}
      {step >= 5 && (
        <polygon points={`${eye.x},${eye.y} ${foot.x},${foot.y} ${top.x},${top.y}`}
                 fill={YELLOW} fillOpacity="0.32" />
      )}
      {step >= 1 && (
        <line x1={eye.x} y1={eye.y} x2={top.x} y2={top.y}
              stroke={HYP} strokeWidth="4.5" strokeDasharray="9 6" strokeLinecap="round" />
      )}
      {/* white underlay so the height reads over the red sandstone */}
      {step >= 2 && (
        <>
          <line x1={top.x} y1={top.y} x2={foot.x} y2={foot.y} stroke="#fffdf5" strokeWidth="13" strokeLinecap="round" />
          <line x1={top.x} y1={top.y} x2={foot.x} y2={foot.y} stroke={OPP} strokeWidth="7" strokeLinecap="round" />
        </>
      )}
      {step >= 3 && (
        <line x1={eye.x} y1={eye.y} x2={foot.x} y2={foot.y} stroke={ADJ} strokeWidth="6" strokeLinecap="round" />
      )}
      {step >= 4 && (
        <polyline points={`${MIN_CX - 28},${eye.y} ${MIN_CX - 28},${eye.y - 28} ${MIN_CX},${eye.y - 28}`}
                  fill="none" stroke={INK} strokeWidth="3.5" />
      )}

      {step >= 1 && (
        <text x="300" y="302" fill={HYP} fontSize="19" fontWeight="800">line of sight</text>
      )}
      {step >= 2 && (
        <text x={MIN_CX + 46} y="212" fill={OPP} fontSize="21" fontWeight="800">h = ?</text>
      )}
      {step >= 3 && (
        <text x="330" y={eye.y + 30} fill={ADJ} fontSize="19" fontWeight="800">distance</text>
      )}
      {step >= 5 && (
        <g transform="translate(40, 58)">
          <rect x="0" y="0" width="455" height="80" rx="12"
                fill="#fffdf5" stroke={INK} strokeWidth="3" />
          <text x="20" y="34" fill={INK} fontSize="19" fontWeight="800">A right triangle nobody drew.</text>
          <text x="20" y="61" fill={INK} fontSize="15" fontWeight="700">Two sides you can measure, one you cannot.</text>
        </g>
      )}
    </svg>
  );
}

/* ═══ Topic 1 — Why trigonometry exists ═══════════════════════════════════ */

export const WHY_HINTS: LessonHints = {
  title: "Why trigonometry exists",
  prompt: "Stuck on what this subject is actually for?",
  steps: [
    {
      label: "Gentle nudge",
      title: "Look at what you are given",
      body: "In every one of these situations somebody knows a distance they can " +
            "walk or measure, and wants a distance they cannot reach.",
      example: "You can pace out the ground to the tower. You cannot pace out its height.",
    },
    {
      label: "Worked example",
      title: "A smaller version of the same problem",
      body: "A 2 m pole casts a 1 m shadow. A tree next to it casts a 6 m shadow. " +
            "Same sun, so the same angle — and the tree must be 12 m tall. You " +
            "measured a shadow and learned a height.",
      example: "2 / 1 = 12 / 6 — the ratio did the work, not a tape measure.",
    },
    {
      label: "Rule",
      title: "The transferable idea",
      body: "Trigonometry turns an angle plus one measurable length into every " +
            "other length in the triangle. Reachable measurements buy unreachable ones.",
    },
  ],
};

/** NCERT Fig 8.2 — the balcony, the river and the line of sight, front-on.
 *  The earlier version drew only a bare post, so the caption promised a scene
 *  that was never on screen. */
function riverScene(step: number): Prim[] {
  const EYE: V3 = [-3.3, 0, 2.0], FOOT: V3 = [-3.3, 0, 0], POT: V3 = [2.9, 0, 0];
  return [
    // water between the two banks
    { kind: "poly", pts: [[-2.4, 0.2, 0], [2.4, 0.2, 0], [2.4, 0.2, -0.55],
                          [-2.4, 0.2, -0.55]] as V3[], fill: "#7fb2d9", op: 0.75 },
    ...groundLine(6.4),
    // her house, with a balcony she is sitting on
    { kind: "poly", pts: [[-5.0, 0.4, 0], [-3.0, 0.4, 0], [-3.0, 0.4, 2.3],
                          [-5.0, 0.4, 2.3]] as V3[],
      fill: "#cfd6cd", stroke: INK, sw: 2.5 },
    { kind: "seg", a: [-3.7, 0, 1.85], b: [-2.75, 0, 1.85], stroke: INK, sw: 5 },
    { kind: "blob", at: [-3.3, 0, 2.16], r: 0.16, fill: "#e8b98a", stroke: INK, sw: 2 },
    { kind: "poly", pts: [[-3.48, 0, 1.86], [-3.12, 0, 1.86], [-3.16, 0, 2.02],
                          [-3.44, 0, 2.02]] as V3[],
      fill: "#2f7fbf", stroke: INK, sw: 2 },
    // the flower pot on the far bank
    { kind: "poly", pts: [[2.72, 0, 0], [3.08, 0, 0], [3.02, 0, 0.26],
                          [2.78, 0, 0.26]] as V3[],
      fill: "#c96f3f", stroke: INK, sw: 2 },
    { kind: "blob", at: [2.9, 0, 0.36], r: 0.13, fill: "#3f8f42", stroke: INK, sw: 2 },
    ...(step >= 1
      ? [{ kind: "seg" as const, a: FOOT, b: EYE, stroke: OPP, sw: 6 },
         { kind: "text" as const, at: [-3.95, 0, 1.0] as V3, text: "her height",
           fill: OPP, size: 16 },
         { kind: "seg" as const, a: [FOOT[0], 0, 0.012] as V3, b: POT,
           stroke: ADJ, sw: 6 },
         { kind: "text" as const, at: [-0.2, 0, -0.36] as V3, text: "width = ?",
           fill: ADJ, size: 17 }]
      : []),
    ...(step >= 2
      ? [{ kind: "seg" as const, a: EYE, b: POT, stroke: HYP, sw: 4, dash: "9 6" },
         { kind: "text" as const, at: [-0.4, 0, 1.35] as V3, text: "line of sight",
           fill: HYP, size: 16 }]
      : []),
    ...(step >= 3
      ? [{ kind: "poly" as const, pts: [FOOT, POT, EYE] as V3[],
           fill: YELLOW, op: 0.3 }]
      : []),
  ];
}

export function TopicWhy({ onAnswer, onMistake, playTone, onComplete }: PanelProps) {
  /* Front elevation, drawn to true scale: 1 m = 0.34 units, so the 12 m tree
     really is six times the 2 m stick and the two shadow triangles really are
     similar. Shadows run along the ground line; the sun is up and to the left. */
  const U = 0.34;
  const SX = -3.6, TX = 0.9;              // stick and tree, ground positions
  const carPark = (show: {
    tree?: boolean; shadows?: boolean; rays?: boolean; tris?: boolean;
  }): Prim[] => {
    const stickH = 2 * U, treeH = 12 * U;
    const stickTip: V3 = [SX, 0, stickH], stickLand: V3 = [SX + 1 * U, 0, 0];
    const treeTip: V3 = [TX, 0, treeH], treeLand: V3 = [TX + 6 * U, 0, 0];
    return [
      ...groundLine(6.4),
      // the sun, up-left, with its rays arriving parallel
      { kind: "blob", at: [-5.3, 0.4, 3.5], r: 0.34, fill: YELLOW, stroke: INK, sw: 2.5 },
      ...(show.rays
        ? ([[-4.5, 2.9], [-3.2, 3.3], [-1.6, 3.6]] as const).map(([x, z]) => ({
            kind: "seg" as const, a: [x, 0.3, z] as V3,
            b: [x + 0.55, 0.3, z - 1.1] as V3, stroke: "#e0a800", sw: 4,
          }))
        : []),
      ...post(SX, 0, stickH, 0.1, "#c96f3f", "#a9552c"),
      ...(show.shadows
        ? [{ kind: "seg" as const, a: [SX, 0, 0.012] as V3, b: stickLand,
             stroke: ADJ, sw: 7 },
           { kind: "seg" as const, a: stickTip, b: stickLand, stroke: "#e0a800", sw: 3.5 },
           { kind: "text" as const, at: [SX - 0.42, 0, stickH * 0.55] as V3,
             text: "2 m", fill: OPP, size: 18 },
           { kind: "text" as const, at: [SX + 0.5 * U, 0, -0.34] as V3,
             text: "1 m", fill: ADJ, size: 16 }]
        : []),
      ...(show.tree ? tree(TX, 0, treeH) : []),
      ...(show.tree && show.shadows
        ? [{ kind: "seg" as const, a: [TX, 0, 0.012] as V3, b: treeLand,
             stroke: ADJ, sw: 7 },
           { kind: "seg" as const, a: treeTip, b: treeLand, stroke: "#e0a800", sw: 3.5 },
           { kind: "text" as const, at: [TX + 3 * U, 0, -0.34] as V3,
             text: "6 m", fill: ADJ, size: 16 },
           { kind: "text" as const, at: [TX - 0.62, 0, treeH * 0.5] as V3,
             text: show.tris ? "12 m" : "h = ?", fill: OPP, size: 18 }]
        : []),
      ...(show.tris
        ? [{ kind: "poly" as const, pts: [[SX, 0, 0], stickLand, stickTip] as V3[],
             fill: YELLOW, op: 0.55, stroke: HYP, sw: 2.5 },
           { kind: "poly" as const, pts: [[TX, 0, 0], treeLand, treeTip] as V3[],
             fill: YELLOW, op: 0.3, stroke: HYP, sw: 2.5 }]
        : []),
    ];
  };

  return (
    <div className={styles.topicPanel}>
      {/* ───────────────────────── RECAP ───────────────────────── */}
      <SectionHeading
        kicker="Section 1 of 3"
        title="Recap"
      />


      <Explainer3D
        height={430}
        scale={50}
        steps={[
          {
            caption: "A sunny car park. Put a stick in the ground — 2 metres tall.",
            math: ["stick = 2 m"],
            prims: carPark({}),
          },
          {
            caption: "It casts a shadow. The shadow lies flat on the ground, right where your feet are, so you can measure it: 1 metre.",
            math: ["stick  = 2 m", "shadow = 1 m"],
            prims: carPark({ shadows: true }),
          },
          {
            caption: "Beside it stands a tree. Enormous. You are certainly not climbing it — but it has a shadow too, and that you CAN measure: 6 metres.",
            math: ["tree shadow = 6 m", "tree height = ?"],
            prims: carPark({ tree: true, shadows: true }),
          },
          {
            caption: "The sun is 150 million km away, so its rays arrive parallel. They hit the stick and the tree at exactly the same angle.",
            math: ["same sun", "same angle"],
            prims: carPark({ tree: true, shadows: true }),
          },
          {
            caption: "Same angle, same right angle at the ground — so the two triangles are the same shape. Different sizes, identical shape.",
            math: ["△ small ~ △ big", "same shape"],
            prims: carPark({ tree: true, shadows: true, tris: true }),
          },
          {
            caption: "Same shape forces the same ratio. Work it out on the stick, where you know both numbers.",
            math: ["height ÷ shadow", "= 2 ÷ 1", "= 2"],
            prims: carPark({ tree: true, shadows: true, tris: true }),
          },
          {
            caption: "So the tree must obey it too. Its shadow is 6 m, so its height ÷ 6 = 2.",
            math: ["h ÷ 6 = 2", "h = 2 × 6"],
            prims: carPark({ tree: true, shadows: true, tris: true }),
          },
          {
            caption: "Twelve metres. You measured something lying on the ground and learned a height you could never reach — that is the whole of trigonometry, in one car park.",
            math: ["h = 12 m"],
            answer: "the tree is 12 m",
            prims: carPark({ tree: true, shadows: true, tris: true }),
          },
        ]}
      />

      {/* ──────────────────── SOLVED EXAMPLES ──────────────────── */}
      <SectionHeading
        kicker="Section 2 of 3"
        title="Solved Examples"
      />

      <SolvedExamples
        examples={[
          {
            ref: "NCERT Fig. 8.2",
            title: "The river — can she find its width?",
            body: (
              <>
        <Explainer3D
          guided
          height={420}
          scale={50}
          steps={[
            {
              caption: "QUESTION — NCERT Fig. 8.2: A girl sits on a balcony above a river, looking down at a flower pot on the far bank. If she knows how high she is sitting, can she find the width of the river?",
              math: ["known: her height", "find: river width"],
              prims: riverScene(0),
            },
            {
              caption: "APPROACH — find the right triangle hiding in the scene, then check which side is unknown and whether the two things you can measure sit in the same triangle.",
              math: ["1. find the triangle", "2. name the sides", "3. check what's known"],
              prims: riverScene(0),
            },
            {
              caption: "She is sitting on a balcony above the water, looking down at a flower pot on the far bank.",
              math: ["her height = known", "river width = ?"],
              prims: riverScene(0),
            },
            {
              caption: "Find the right triangle. Her height above the water is vertical; the river's width is horizontal; they meet at 90°.",
              math: ["vertical  = her height", "horizontal = the width"],
              prims: riverScene(1),
            },
            {
              caption: "Her line of sight, down to the flower pot, joins the top of the vertical side to the far end of the horizontal one.",
              math: ["third side =", "the line of sight"],
              prims: riverScene(2),
            },
            {
              caption: "Now check the pattern: she knows one length and can measure one angle. The unknown is the side she cannot walk along.",
              math: ["known: height", "known: angle", "unknown: width"],
              prims: riverScene(3),
            },
            {
              caption: "So yes. And notice this is the tower problem lying on its side — there the vertical was unknown, here it is the horizontal.",
              math: ["1 length + 1 angle", "⇒ the third side"],
              answer: "yes — the width follows",
              prims: riverScene(3),
            },
          ]}
        />
              </>
            ),
          },
        ]}
      />

      {/* ─────────────────── PRACTICE QUESTIONS ────────────────── */}
      <SectionHeading
        kicker="Section 3 of 3"
        title="Practice Questions"
      />

      <PracticeSet
        onAllComplete={onComplete}
        onAnswer={onAnswer}
        onMistake={onMistake}
        playTone={playTone}
        questions={WHY_QUESTIONS}
        skill="why"
        title="Choose an answer for each"
      />
    </div>
  );
}

// Retained as a vector fallback for environments that cannot load the rendered asset.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ShadowScene({ step }: { step: number }): ReactNode {
  const rayEnd = (x: number, yTop: number, tip: number) =>
    ({ x1: x, y1: yTop, x2: tip, y2: GY });

  return (
    <svg viewBox="0 0 820 470" className={styles.topicSvg} role="img"
         aria-label="A two-metre pole and a twelve-metre tree in the same sunlight, drawn to scale, with their similar shadow triangles">
      <defs>
        <marker id="sunTip" viewBox="0 0 10 10" refX="8" refY="5"
                markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 Z" fill="#e0a800" />
        </marker>
      </defs>
      <rect x="0" y="0" width="820" height="470" fill="#f3f1e7" />

      {/* ── the sun, and light arriving in parallel ── */}
      <g>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
          const t = (a * Math.PI) / 180;
          return (
            <line key={a}
              x1={86 + 36 * Math.cos(t)} y1={66 + 36 * Math.sin(t)}
              x2={86 + 48 * Math.cos(t)} y2={66 + 48 * Math.sin(t)}
              stroke="#e0a800" strokeWidth="4" strokeLinecap="round" />
          );
        })}
        <circle cx="86" cy="66" r="30" fill={YELLOW} stroke={INK} strokeWidth="3" />
      </g>
      {step >= 2 &&
        [[128, 86], [172, 70], [216, 54]].map(([x, y]) => (
          <line key={x} x1={x} y1={y} x2={x + 40} y2={y + 80}
                stroke="#e0a800" strokeWidth="4" strokeLinecap="round"
                markerEnd="url(#sunTip)" />
        ))}

      {/* ── ground ── */}
      <rect x="0" y={GY} width="820" height="70" fill="#dcd8c6" />
      <line x1="0" y1={GY} x2="820" y2={GY} stroke={INK} strokeWidth="4" />

      {/* ── the tree, drawn at its true 12 m ── */}
      <path d={`M ${TREE_X - 11} ${GY} C ${TREE_X - 9} 330, ${TREE_X - 7} 280, ${TREE_X - 6} 215
                L ${TREE_X + 6} 215 C ${TREE_X + 7} 280, ${TREE_X + 9} 330, ${TREE_X + 11} ${GY} Z`}
            fill="#7a4a24" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d={`M ${TREE_X - 5} 262 Q ${TREE_X - 26} 250, ${TREE_X - 40} 228`}
            fill="none" stroke="#7a4a24" strokeWidth="7" strokeLinecap="round" />
      <path d={`M ${TREE_X + 5} 250 Q ${TREE_X + 26} 240, ${TREE_X + 40} 222`}
            fill="none" stroke="#7a4a24" strokeWidth="6" strokeLinecap="round" />
      <path d={CROWN} fill="#3f8f42" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
      <ellipse cx={TREE_X - 26} cy={TREE_TOP + 98} rx="30" ry="22" fill="#2e7d32" fillOpacity="0.55" />
      <ellipse cx={TREE_X + 24} cy={TREE_TOP + 48} rx="26" ry="19" fill="#67b05c" fillOpacity="0.6" />

      {/* ── the pole, drawn at its true 2 m ── */}
      <rect x={POLE_X - 4} y={POLE_TOP} width="9" height={2 * M} rx="2"
            fill="#c96f3f" stroke={INK} strokeWidth="2.5" />

      {/* ── step 0: the pole's shadow and its ray ── */}
      <line {...rayEnd(POLE_X, POLE_TOP, POLE_TIP)} stroke="#e0a800" strokeWidth="4" strokeLinecap="round" />
      <line x1={POLE_X} y1={GY} x2={POLE_TIP} y2={GY} stroke={ADJ} strokeWidth="7" strokeLinecap="round" />
      <text x={POLE_X - 16} y={POLE_TOP - 12} fill={OPP} fontSize="20" fontWeight="800">2 m</text>
      <text x={POLE_X + 2} y={GY + 30} fill={ADJ} fontSize="18" fontWeight="800">1 m</text>

      {/* ── step 1: the tree's shadow, its ray, and the unknown height ── */}
      {step >= 1 && (
        <>
          <line {...rayEnd(TREE_X, TREE_TOP, TREE_TIP)} stroke="#e0a800" strokeWidth="4" strokeLinecap="round" />
          <line x1={TREE_X} y1={GY} x2={TREE_TIP} y2={GY} stroke={ADJ} strokeWidth="7" strokeLinecap="round" />
          <text x={TREE_X + 52} y={GY + 30} fill={ADJ} fontSize="18" fontWeight="800">6 m</text>
          <g stroke={OPP} strokeWidth="2.5">
            <line x1="292" y1={TREE_TOP} x2="292" y2={GY} strokeDasharray="7 6" />
            <line x1="278" y1={TREE_TOP} x2="306" y2={TREE_TOP} />
            <line x1="278" y1={GY} x2="306" y2={GY} />
          </g>
          <line x1="306" y1={TREE_TOP} x2={TREE_X - 60} y2={TREE_TOP}
                stroke={OPP} strokeWidth="1.5" strokeDasharray="4 5" strokeOpacity="0.6" />
        </>
      )}

      {/* ── step 2: same sun, same angle ── */}
      {step >= 2 && (
        <>
          <path d={sunAngle(POLE_TIP, 20)} fill="none" stroke={HYP} strokeWidth="3" />
          <path d={sunAngle(TREE_TIP, 44)} fill="none" stroke={HYP} strokeWidth="3" />
          <text x={POLE_TIP - 34} y={GY - 26} fill={HYP} fontSize="17" fontWeight="800">θ</text>
          <text x={TREE_TIP - 40} y={GY - 14} fill={HYP} fontSize="17" fontWeight="800">θ</text>
        </>
      )}

      {step >= 2 && (
        <g transform="translate(46, 176)">
          <polygon points="0,0 0,156 78,156" fill={YELLOW} fillOpacity="0.5"
                   stroke={HYP} strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M 56 156 A 22 22 0 0 1 68.2 136.3" fill="none" stroke={HYP} strokeWidth="2.5" />
          <text x="42" y="150" fill={HYP} fontSize="15" fontWeight="800">θ</text>
          <text x="-38" y="84" fill={OPP} fontSize="17" fontWeight="800">2 m</text>
          <text x="26" y="176" fill={ADJ} fontSize="17" fontWeight="800">1 m</text>
          <text x="-24" y="-14" fill={INK} fontSize="14" fontWeight="700">the small triangle, ×3</text>
          <text x="-24" y="200" fill={INK} fontSize="14" fontWeight="700">2 ÷ 1 = 2</text>
        </g>
      )}

      {/* ── step 3: same shape, so the same ratio ── */}
      {step >= 3 && (
        <>
          <polygon points={`${POLE_X},${GY} ${POLE_TIP},${GY} ${POLE_X},${POLE_TOP}`}
                   fill={YELLOW} fillOpacity="0.45" stroke={HYP} strokeWidth="2" />
          <polygon points={`${TREE_X},${GY} ${TREE_TIP},${GY} ${TREE_X},${TREE_TOP}`}
                   fill={YELLOW} fillOpacity="0.28" stroke={HYP} strokeWidth="2" />
          <g transform="translate(528, 92)">
            <rect x="0" y="0" width="280" height="62" rx="10"
                  fill="#fffdf5" stroke={INK} strokeWidth="3" />
            <text x="16" y="26" fill={INK} fontSize="16" fontWeight="800">same shape ⇒ same ratio</text>
            <text x="16" y="50" fill={HYP} fontSize="19" fontWeight="800">height ÷ shadow = 2</text>
          </g>
        </>
      )}

      {/* ── step 4: the answer ── */}
      {step >= 4 && (
        <g transform="translate(528, 168)">
          <rect x="0" y="0" width="280" height="62" rx="10"
                fill={ADJ} stroke={INK} strokeWidth="3" />
          <text x="16" y="26" fill="#eaf4ea" fontSize="16" fontWeight="800">h ÷ 6 = 2, so h = 2 × 6</text>
          <text x="16" y="51" fill="#ffffff" fontSize="20" fontWeight="800">the tree is 12 m tall</text>
        </g>
      )}
      {step >= 1 && (
        <text x="310" y="254" fill={OPP} fontSize="20" fontWeight="800">
          {step >= 4 ? "h = 12 m" : "h = ?"}
        </text>
      )}
    </svg>
  );
}

/* ═══ Topic 2 — The hidden right triangle ═════════════════════════════════ */

export const HIDDEN_HINTS: LessonHints = {
  title: "Finding the hidden right triangle",
  prompt: "Not sure where the triangle is?",
  steps: [
    {
      label: "Gentle nudge",
      title: "Look for the upright and the flat",
      body: "Something in the picture is vertical (a tower, a wall, your height) " +
            "and something is horizontal (the ground, the water). Those two meet " +
            "at 90°.",
    },
    {
      label: "Worked example",
      title: "A different picture, same method",
      body: "A ladder leans on a wall. The wall is vertical, the ground is " +
            "horizontal, they meet at a right angle, and the ladder closes the " +
            "shape — so the ladder is the hypotenuse.",
      example: "Vertical + horizontal + the sloping line that joins them = right triangle.",
    },
    {
      label: "Rule",
      title: "The transferable idea",
      body: "The line of sight, the ladder, the rope — whatever slopes — is always " +
            "the hypotenuse, because it is opposite the right angle where the " +
            "vertical meets the horizontal.",
    },
  ],
};

export function TopicHidden({ onAnswer, onMistake, playTone, onComplete }: PanelProps) {
  /** The Minar scene: tower, a viewer, and the triangle appearing between them. */
  /* Front elevation. The viewer stands on the left, the Minar on the right,
     and the triangle closes between the eye, the tower's foot and its top. */
  const EYE: V3 = [-3.6, 0, 1.05];
  const MX = 2.3, MTOP = 3.6;
  const minarScene = (step: number): Prim[] => [
    ...groundLine(6.4),
    ...tower3d(MX, 0, MTOP),
    // the student, drawn front-on
    { kind: "seg", a: [-3.68, 0, 0], b: [-3.68, 0, 0.42], stroke: "#2f3b4a", sw: 6 },
    { kind: "seg", a: [-3.52, 0, 0], b: [-3.52, 0, 0.42], stroke: "#2f3b4a", sw: 6 },
    { kind: "poly", pts: [[-3.78, 0, 0.42], [-3.42, 0, 0.42], [-3.46, 0, 0.92],
                          [-3.74, 0, 0.92]] as V3[],
      fill: "#2f7fbf", stroke: INK, sw: 2 },
    { kind: "blob", at: [-3.6, 0, 1.08], r: 0.17, fill: "#e8b98a", stroke: INK, sw: 2 },
    ...(step >= 2
      ? [{ kind: "seg" as const, a: [MX, 0, 0] as V3, b: [MX, 0, MTOP] as V3,
           stroke: OPP, sw: 7 },
         { kind: "text" as const, at: [MX + 0.78, 0, MTOP * 0.5] as V3,
           text: "h = ?", fill: OPP, size: 19 }]
      : []),
    ...(step >= 3
      ? [{ kind: "seg" as const, a: [EYE[0], 0, 0.012] as V3, b: [MX, 0, 0.012] as V3,
           stroke: ADJ, sw: 7 },
         { kind: "text" as const, at: [-0.7, 0, -0.36] as V3, text: "distance",
           fill: ADJ, size: 17 }]
      : []),
    ...(step >= 1
      ? [{ kind: "seg" as const, a: EYE, b: [MX, 0, MTOP] as V3,
           stroke: HYP, sw: 4, dash: "9 6" },
         { kind: "text" as const, at: [-1.2, 0, 2.5] as V3, text: "line of sight",
           fill: HYP, size: 17 }]
      : []),
    ...(step >= 4
      ? [{ kind: "poly" as const,
           pts: [EYE, [MX, 0, EYE[2]], [MX, 0, MTOP]] as V3[],
           fill: YELLOW, op: 0.3 }]
      : []),
  ];

  return (
    <div className={styles.topicPanel}>
      {/* ───────────────────────── RECAP ───────────────────────── */}
      <SectionHeading
        kicker="Section 1 of 3"
        title="Recap"
      />


      <Explainer3D
        height={430}
        scale={52}
        steps={[
          {
            caption: "A student stands on the ground looking up at the top of the Qutub Minar. Right now this is a photograph, not a maths problem.",
            prims: minarScene(0),
          },
          {
            caption: "Question one — what is vertical? The Minar. It rises straight up out of the ground, and it is the height we want.",
            math: ["vertical =", "the height, h"],
            prims: minarScene(2),
          },
          {
            caption: "Question two — what is horizontal? The ground from the student's feet to the base of the tower. Flat, walkable, measurable.",
            math: ["horizontal =", "the ground distance"],
            prims: minarScene(3),
          },
          {
            caption: "Where those two meet, at the foot of the tower, is exactly 90°. Nobody built that corner — it is what happens when something vertical stands on something flat.",
            math: ["vertical ⊥ horizontal", "= 90°, free"],
            prims: minarScene(3),
          },
          {
            caption: "Question three — what joins them? The line of sight, straight from the student's eye to the top.",
            math: ["third side =", "the line of sight"],
            prims: minarScene(1),
          },
          {
            caption: "And there it is: a right triangle nobody drew, hiding in a holiday photograph.",
            math: ["a right triangle"],
            prims: minarScene(4),
          },
          {
            caption: "Look at what you have. Two sides you can get at — the ground distance and the angle you look up through — and one you cannot: the height.",
            math: ["can measure: distance", "can measure: angle", "cannot reach: h"],
            answer: "2 you can · 1 you can't",
            prims: minarScene(4),
          },
        ]}
      />

      {/* ──────────────────── SOLVED EXAMPLES ──────────────────── */}
      <SectionHeading
        kicker="Section 2 of 3"
        title="Solved Examples"
      />

      <SolvedExamples
        examples={[
          {
            ref: "NCERT Fig. 8.2",
            title: "The river — find the triangle",
            body: (
              <>
        <Explainer3D
          guided
          height={420}
          scale={50}
          steps={[
            {
              caption: "QUESTION — NCERT Fig. 8.2: A girl on a balcony looks down at a flower pot on the far bank of a river. Find the hidden right triangle.",
              math: ["find: the triangle"],
              prims: riverScene(0),
            },
            {
              caption: "APPROACH — run the same three questions as before: what is vertical, what is horizontal, and what joins them.",
              math: ["1. vertical?", "2. horizontal?", "3. what joins?"],
              prims: riverScene(0),
            },
            {
              caption: "A different scene entirely — no tower, and she is looking down rather than up.",
              prims: riverScene(0),
            },
            {
              caption: "Run the same three questions anyway. Vertical: her height above the water. Horizontal: the width of the river.",
              math: ["vertical  = her height", "horizontal = the width"],
              prims: riverScene(1),
            },
            {
              caption: "Joining them: her line of sight, down to the flower pot. They meet at 90°, exactly as before.",
              math: ["third side =", "the line of sight"],
              prims: riverScene(2),
            },
            {
              caption: "Same triangle, rotated and given a new story. But notice what swapped — in the Minar the vertical was unknown; here it is the horizontal.",
              math: ["Minar: h unknown", "river: width unknown"],
              answer: "same triangle, rotated",
              prims: riverScene(3),
            },
          ]}
        />
              </>
            ),
          },
          {
            ref: "Worked situation",
            title: "Three traps: leaning tower, slope, eye height",
            body: (
              <>
        <Explainer3D
          guided
          height={400}
          scale={52}
          steps={[
            {
              caption: "QUESTION — when does the three-question method FAIL? Three traps the exam will try on you.",
              math: ["trap 1: not vertical", "trap 2: not horizontal", "trap 3: eye height"],
              prims: [...ground(9, 7)],
            },
            {
              caption: "Trap one — a leaning tower. If the thing is not vertical, that corner is not 90°, and none of this applies.",
              math: ["not vertical", "⇒ no right angle"],
              prims: [...ground(9, 7),
                      { kind: "seg", a: [-1.0, 0, 0], b: [-0.2, 0, 2.4],
                        stroke: "#b5563a", sw: 12 }],
            },
            {
              caption: "Trap two — sloping ground. Stand on a hill and the ground is not horizontal, so your right angle has quietly vanished.",
              math: ["not horizontal", "⇒ no right angle"],
              prims: [...ground(9, 7),
                      { kind: "seg", a: [-2.2, 0, -0.4], b: [1.8, 0, 0.9],
                        stroke: "#8a7f5c", sw: 10 }],
            },
            {
              caption: "Trap three, and this one catches almost everybody — your eye is not on the floor. The line of sight starts about a metre and a half up.",
              math: ["eye ≈ 1.5 m up"],
              prims: [...ground(9, 7),
                      ...post(-1.4, -0.6, 0.95, 0.18, "#2f7fbf", "#245f8e")],
            },
            {
              caption: "So the triangle you actually drew gives the height ABOVE EYE LEVEL. You have to add yourself back on at the end.",
              math: ["h from triangle", "+ your eye height", "= the real height"],
              answer: "add yourself back on",
              prims: [...ground(9, 7),
                      ...post(-1.4, -0.6, 0.95, 0.18, "#2f7fbf", "#245f8e"),
                      { kind: "seg", a: [-1.4, -0.6, 0], b: [-1.4, -0.6, 0.95],
                        stroke: OPP, sw: 5, dash: "6 5" }],
            },
          ]}
        />
              </>
            ),
          },
        ]}
      />

      {/* ─────────────────── PRACTICE QUESTIONS ────────────────── */}
      <SectionHeading
        kicker="Section 3 of 3"
        title="Practice Questions"
      />

      <PracticeSet
        onAllComplete={onComplete}
        onAnswer={onAnswer}
        onMistake={onMistake}
        playTone={playTone}
        questions={HIDDEN_QUESTIONS}
        skill="hidden"
        title="Choose an answer for each"
      />
    </div>
  );
}

export const TOPIC_PANELS: Record<
  string,
  { hints: LessonHints; Panel: (p: PanelProps) => ReactNode }
> = {
  ...PANELS_8_2,
  ...PANELS_8_3,
  ...PANELS_8_4,
  why: { hints: WHY_HINTS, Panel: TopicWhy },
  hidden: { hints: HIDDEN_HINTS, Panel: TopicHidden },
};
