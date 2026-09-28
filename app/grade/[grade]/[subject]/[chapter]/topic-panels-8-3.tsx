"use client";

/**
 * Section 8.3 — trigonometric ratios of 0°, 30°, 45°, 60° and 90°.
 *
 * Same shape as every other topic: Recap (the concept re-taught as a stepped
 * figure) → Solved Examples (one NCERT question at a time) → Practice Questions
 * (the book's, then extras).
 *
 * The figures are drawn front-on. §8.3 is plane geometry — an isosceles right
 * triangle and half an equilateral triangle — so a tilted camera would skew the
 * very right angles the derivation depends on. `Explainer3D` defaults to a front
 * elevation, which is also how NCERT prints these figures.
 *
 * Every value here is the book's: Table 8.1 (p.124), Examples 6–8 (p.125–126)
 * and Exercise 8.2 (p.127), answers cross-checked against the Answers section.
 */

import {
  PracticeSet,
  type LessonHints,
} from "../../../../components/learning/LearningSupport";
import { type PanelProps } from "./scene-kit";
import {
  ADJ, Explainer3D, HYP, INK, OPP, type Prim, SectionHeading, SolvedExamples,
  type V3, YELLOW, groundLine, rightTriangle3D,
} from "./iso3d";
import { TrigAngleLab, type TrigAngleLabStep } from "./TrigAngleLab";
import styles from "./chapter-lesson.module.css";

import {
  Q45,
  Q3060,
  Q0090,
  QTABLE,
} from "../../../../data/practice-bank";

/* ── flat drawing helpers ─────────────────────────────────────────────────
   In a front elevation world x is screen-horizontal and world z is screen-up,
   so a §8.3 figure only ever needs (x, z). These three wrappers keep the y=0
   out of the content below, which is otherwise unreadable. */

type P2 = readonly [number, number];
const v = ([x, z]: P2): V3 => [x, 0, z];

const seg = (a: P2, b: P2, stroke = INK, sw = 3.5, dash?: string): Prim =>
  ({ kind: "seg", a: v(a), b: v(b), stroke, sw, dash });

const poly = (pts: P2[], fill: string, op = 1, stroke?: string, sw?: number): Prim =>
  ({ kind: "poly", pts: pts.map(v), fill, op, stroke, sw });

const label = (at: P2, text: string, fill = INK, size = 18): Prim =>
  ({ kind: "text", at: v(at), text, fill, size });

/** A small square at a right angle, drawn in the plane of the figure. */
function rightAngle(corner: P2, along: P2, up: P2, size = 0.3): Prim[] {
  const ux = [along[0] - corner[0], along[1] - corner[1]];
  const uy = [up[0] - corner[0], up[1] - corner[1]];
  const nx = Math.hypot(ux[0], ux[1]), ny = Math.hypot(uy[0], uy[1]);
  const a: P2 = [corner[0] + (ux[0] / nx) * size, corner[1] + (ux[1] / nx) * size];
  const b: P2 = [corner[0] + (uy[0] / ny) * size, corner[1] + (uy[1] / ny) * size];
  const c: P2 = [a[0] + b[0] - corner[0], a[1] + b[1] - corner[1]];
  return [seg(a, c, INK, 2.5), seg(c, b, INK, 2.5)];
}

/**
 * Half an equilateral triangle — the whole of §8.3's 30°/60° derivation.
 *
 * B and C sit on the base, A at the apex, D the foot of the perpendicular from
 * A. Drawing the *whole* equilateral triangle and then the altitude is the
 * point: the 30-60-90 triangle is not a new object, it is this one cut in half,
 * which is why its sides come out as a, a√3 and 2a with no extra work.
 */
function equilateral({
  a = 1.5, showAltitude = false, half = false, marks = [],
}: {
  /** Half the base, so the full side is 2a — the book's labelling. */
  a?: number;
  showAltitude?: boolean;
  /** Shade only triangle ABD, the right triangle we actually use. */
  half?: boolean;
  marks?: ("60B" | "60C" | "30A" | "sides" | "halfsides")[];
} = {}): Prim[] {
  const h = a * Math.sqrt(3);
  const B: P2 = [-a, 0], C: P2 = [a, 0], A: P2 = [0, h], D: P2 = [0, 0];
  const out: Prim[] = [
    poly([A, B, C], YELLOW, half ? 0.12 : 0.22),
  ];
  if (half) out.push(poly([A, B, D], HYP, 0.2));
  out.push(
    seg(B, C, INK, 3.5),
    seg(B, A, INK, 3.5),
    seg(C, A, INK, 3.5),
  );
  if (showAltitude) {
    out.push(seg(A, D, OPP, 5), ...rightAngle(D, [0.34, 0], [0, 0.34]));
    out.push(label([0.16, -0.34], "D", INK, 19));
  }
  out.push(
    label([-a - 0.3, -0.3], "B", INK, 20),
    label([a + 0.3, -0.3], "C", INK, 20),
    label([0, h + 0.36], "A", INK, 20),
  );
  if (marks.includes("60B")) out.push(label([-a + 0.46, 0.26], "60°", ADJ, 17));
  if (marks.includes("60C")) out.push(label([a - 0.46, 0.26], "60°", ADJ, 17));
  if (marks.includes("30A")) out.push(label([-0.3, h - 0.5], "30°", OPP, 17));
  if (marks.includes("sides")) {
    out.push(
      label([-a / 2 - 0.5, h / 2], "2a", INK, 18),
      label([a / 2 + 0.5, h / 2], "2a", INK, 18),
      label([0, -0.42], "2a", INK, 18),
    );
  }
  if (marks.includes("halfsides")) {
    out.push(
      label([-a / 2, -0.42], "a", HYP, 18),
      label([a / 2, -0.42], "a", INK, 18),
      label([-a / 2 - 0.5, h / 2], "2a", HYP, 18),
      label([0.44, h / 2], "a√3", OPP, 18),
    );
  }
  return out;
}

/** The 45° figure: an isosceles right triangle with both legs equal. */
function isosceles({
  a = 2.2, sides = false, angles = false, lit,
}: { a?: number; sides?: boolean; angles?: boolean; lit?: "opp" | "adj" | "hyp" } = {}): Prim[] {
  const B: P2 = [0, 0], A: P2 = [a, 0], C: P2 = [0, a];
  const paint = (which: "opp" | "adj" | "hyp") =>
    lit === which ? (which === "hyp" ? HYP : which === "opp" ? OPP : ADJ) : INK;
  const wide = (which: "opp" | "adj" | "hyp") => (lit === which ? 7 : 3.5);
  const out: Prim[] = [
    poly([A, B, C], YELLOW, 0.22),
    seg(B, A, paint("adj"), wide("adj")),
    seg(B, C, paint("opp"), wide("opp")),
    seg(A, C, paint("hyp"), wide("hyp")),
    ...rightAngle(B, [0.32, 0], [0, 0.32]),
    label([a + 0.32, -0.28], "A", INK, 20),
    label([-0.34, -0.28], "B", INK, 20),
    label([-0.32, a + 0.28], "C", INK, 20),
  ];
  if (angles) {
    out.push(
      label([a - 0.62, 0.26], "45°", ADJ, 17),
      label([0.3, a - 0.58], "45°", ADJ, 17),
    );
  }
  if (sides) {
    out.push(
      label([a / 2, -0.42], "a", paint("adj"), 18),
      label([-0.5, a / 2], "a", paint("opp"), 18),
      label([a / 2 + 0.55, a / 2 + 0.3], "a√2", paint("hyp"), 18),
    );
  }
  return out;
}

/* ── Table 8.1, built one row at a time ───────────────────────────────────
   The table is the deliverable of §8.3, so it is drawn as a figure rather than
   set as HTML underneath — a student watches it fill in, which is also how the
   pattern behind it becomes visible. */

const ANGLES = ["0°", "30°", "45°", "60°", "90°"];
const ROWS: [string, string[]][] = [
  ["sin A", ["0", "1/2", "1/√2", "√3/2", "1"]],
  ["cos A", ["1", "√3/2", "1/√2", "1/2", "0"]],
  ["tan A", ["0", "1/√3", "1", "√3", "n.d."]],
  ["cosec A", ["n.d.", "2", "√2", "2/√3", "1"]],
  ["sec A", ["1", "2/√3", "√2", "2", "n.d."]],
  ["cot A", ["n.d.", "√3", "1", "1/√3", "0"]],
];

const COL_X = [-3.5, -2.0, -0.7, 0.6, 1.9, 3.2];
const ROW_Z = [2.5, 1.9, 1.3, 0.7, 0.1, -0.5, -1.1];

/** Table 8.1 with the first `rows` value-rows filled in. */
function table81(rows: number, highlight?: number): Prim[] {
  const out: Prim[] = [];
  // header band
  out.push(poly(
    [[COL_X[0] - 0.6, ROW_Z[0] + 0.34], [COL_X[5] + 0.6, ROW_Z[0] + 0.34],
     [COL_X[5] + 0.6, ROW_Z[0] - 0.26], [COL_X[0] - 0.6, ROW_Z[0] - 0.26]],
    INK, 0.88,
  ));
  out.push(label([COL_X[0], ROW_Z[0]], "∠A", "#f8f5ea", 19));
  ANGLES.forEach((a, i) => out.push(label([COL_X[i + 1], ROW_Z[0]], a, "#f8f5ea", 19)));

  for (let r = 0; r < rows; r += 1) {
    const [name, vals] = ROWS[r];
    const z = ROW_Z[r + 1];
    if (highlight === r) {
      out.push(poly(
        [[COL_X[0] - 0.6, z + 0.3], [COL_X[5] + 0.6, z + 0.3],
         [COL_X[5] + 0.6, z - 0.26], [COL_X[0] - 0.6, z - 0.26]],
        YELLOW, 0.55,
      ));
    }
    out.push(label([COL_X[0], z], name, INK, 18));
    vals.forEach((val, i) =>
      out.push(label([COL_X[i + 1], z], val, val === "n.d." ? "#a2402a" : HYP, 18)));
  }
  return out;
}

/* ════════════════════════ 8.3a — the 45° triangle ════════════════════════ */

export function Topic45({ onAnswer, onMistake, playTone, onComplete }: PanelProps) {
  return (
    <div className={styles.topicPanel}>
      <SectionHeading kicker="Section 1 of 3" title="Recap" />

      <Explainer3D
        height={430}
        steps={[
          {
            caption:
              "Picture a square sandwich cut corner-to-corner: each half is this right triangle. Before we label anything, predict: will its two short sides match?",
            math: ["PREDICT", "equal halves ⇒ equal legs?"],
            prims: [...groundLine(5.2), ...isosceles({ a: 2.2 })],
          },
          {
            caption:
              "Reveal: yes. One corner is 90° and the diagonal splits the other two square corners equally. The angle sum confirms the remaining angle is also 45°.",
            math: ["180° − 90° − 45°", "= 45°"],
            prims: [...groundLine(5.2), ...isosceles({ a: 2.2, angles: true })],
          },
          {
            caption:
              "Two equal angles means two equal sides. The triangle is isosceles, so the legs match — call each of them a.",
            math: ["BC = AB", "call each one  a"],
            prims: [...groundLine(5.2), ...isosceles({ a: 2.2, angles: true, sides: true })],
          },
          {
            caption:
              "Pythagoras gives the hypotenuse. Both legs are a, so the two squares are the same.",
            math: ["AC² = a² + a²", "AC² = 2a²", "AC = a√2"],
            prims: [...groundLine(5.2),
                    ...isosceles({ a: 2.2, angles: true, sides: true, lit: "hyp" })],
          },
          {
            caption:
              "Now read sin 45° off the picture: opposite over hypotenuse. The a cancels — which is why the answer is a plain number for every 45° triangle ever drawn.",
            math: ["sin 45° = a / (a√2)", "sin 45° = 1/√2"],
            prims: [...groundLine(5.2),
                    ...isosceles({ a: 2.2, sides: true, lit: "opp" })],
          },
          {
            caption:
              "cos 45° is adjacent over hypotenuse — and the adjacent side is the same length as the opposite one, so it gives the same value.",
            math: ["cos 45° = a / (a√2)", "cos 45° = 1/√2"],
            prims: [...groundLine(5.2),
                    ...isosceles({ a: 2.2, sides: true, lit: "adj" })],
          },
          {
            caption:
              "Prediction checkpoint: if opposite and adjacent are equal, should their ratio be below 1, above 1, or exactly 1? tan 45° confirms exactly 1.",
            math: ["tan 45° = a / a", "tan 45° = 1"],
            prims: [...groundLine(5.2), ...isosceles({ a: 2.2, sides: true })],
          },
          {
            caption:
              "Flip each one to get the other three. Nothing new to derive — a reciprocal is just the fraction upside down.",
            math: ["cosec 45° = √2", "sec 45° = √2", "cot 45° = 1"],
            answer: "sin = cos = 1/√2 · tan = 1",
            prims: [...groundLine(5.2), ...isosceles({ a: 2.2, angles: true, sides: true })],
          },
        ]}
      />

      <SectionHeading kicker="Section 2 of 3" title="Solved Examples" />

      <SolvedExamples
        examples={[
          {
            ref: "NCERT Ex 8.2 · Q1(ii)",
            title: "2 tan²45° + cos²30° − sin²60°",
            body: (
              <Explainer3D
                guided
                height={400}
                steps={[
                  {
                    caption:
                      "READ & TRANSLATE — NCERT Exercise 8.2, Q1(ii) asks for one number. Read it as: double tan²45°, then add cos²30° and subtract sin²60°.",
                    math: ["2 tan²45°", "+ cos²30°", "− sin²60°"],
                    prims: table81(3),
                  },
                  {
                    caption:
                      "CHOOSE THE PATTERN — use Table 8.1 because every angle is standard. Scan first for equal values: an equal term added and subtracted will cancel.",
                    math: ["1. scan for repeats", "2. substitute", "3. simplify"],
                    prims: table81(3),
                  },
                  {
                    caption:
                      "SUBSTITUTE — tan 45° = 1, while cos 30° and sin 60° are both √3/2. Put those values into the original expression without changing its signs.",
                    math: ["2(1)² + (√3/2)² − (√3/2)²"],
                    prims: table81(3, 1),
                  },
                  {
                    caption:
                      "CALCULATE, LINE 1 — square the equal root fractions. Each becomes 3/4.",
                    math: ["cos²30° − sin²60°", "= 3/4 − 3/4", "= 0"],
                    prims: table81(3, 1),
                  },
                  {
                    caption: "CALCULATE, LINE 2 — the equal fractions cancel; square 1, then multiply by 2.",
                    math: ["= 2 × 1 + 0", "= 2 + 0", "= 2"],
                    prims: table81(3, 2),
                  },
                  {
                    caption:
                      "SANITY CHECK — cos 30° and sin 60° are the same positive value, so their squares must cancel. The answer must therefore be exactly 2 tan²45° = 2.",
                    math: ["+3/4 − 3/4 = 0 ✓", "2(1²) = 2 ✓"],
                    prims: table81(3, 2),
                  },
                  {
                    caption: "FINAL ANSWER — the expression equals 2.",
                    math: ["2 tan²45° + cos²30° − sin²60°", "= 2"],
                    answer: "= 2",
                    prims: table81(3, 2),
                  },
                ]}
              />
            ),
          },
          {
            ref: "NCERT Ex 8.2 · Q2(ii)",
            title: "(1 − tan²45°) / (1 + tan²45°)",
            body: (
              <Explainer3D
                guided
                height={400}
                steps={[
                  {
                    caption:
                      "READ & TRANSLATE — NCERT Exercise 8.2, Q2(ii) asks which option matches this fraction. The same tan²45° appears once with a minus on top and once with a plus below.",
                    math: ["(1 − tan²45°)", "⁄", "(1 + tan²45°)"],
                    prims: table81(3, 2),
                  },
                  {
                    caption:
                      "CHOOSE THE PATTERN — this is direct substitution because 45° is in Table 8.1. Evaluate numerator and denominator separately so the two signs cannot get mixed up.",
                    math: ["tan 45° = 1", "so tan²45° = 1"],
                    prims: table81(3, 2),
                  },
                  {
                    caption: "SUBSTITUTE — tan 45° = 1, so tan²45° = 1² = 1 in both places. Start with the numerator.",
                    math: ["top = 1 − 1", "top = 0"],
                    prims: table81(3, 2),
                  },
                  {
                    caption:
                      "CALCULATE, LINE 1 — use the plus sign in the denominator: 1 + 1 = 2. The denominator is not zero, so the fraction is defined.",
                    math: ["bottom = 1 + 1", "bottom = 2"],
                    prims: table81(3, 2),
                  },
                  {
                    caption: "CALCULATE, LINE 2 — place the finished numerator over the finished denominator, then divide.",
                    math: ["= 0 / 2", "= 0"],
                    prims: table81(3, 2),
                  },
                  {
                    caption:
                      "SANITY CHECK — a zero numerator over a non-zero denominator must equal zero. It cannot be undefined because the denominator is 2.",
                    math: ["0 ÷ 2 = 0 ✓", "denominator 2 ≠ 0 ✓"],
                    prims: table81(3, 2),
                  },
                  {
                    caption: "FINAL ANSWER — option (D), 0.",
                    math: ["(1 − tan²45°)/(1 + tan²45°) = 0"],
                    answer: "(D) 0",
                    prims: table81(3, 2),
                  },
                ]}
              />
            ),
          },
        ]}
      />

      <SectionHeading kicker="Section 3 of 3" title="Practice Questions" />

      <PracticeSet
        onAllComplete={onComplete}
        onAnswer={onAnswer}
        onMistake={onMistake}
        playTone={playTone}
        questions={Q45}
        skill="ratios45"
        title="Choose an answer for each"
      />
    </div>
  );
}

/* ═══════════════════ 8.3b — 30° and 60° from an equilateral ══════════════ */

export function Topic3060({ onAnswer, onMistake, playTone, onComplete }: PanelProps) {
  return (
    <div className={styles.topicPanel}>
      <SectionHeading kicker="Section 1 of 3" title="Recap" />

      <Explainer3D
        height={430}
        scale={54}
        steps={[
          {
            caption:
              "Imagine an equilateral pizza slice folded exactly down its middle. Before the fold lands, predict: will the base split into equal pieces? Call every full side 2a.",
            math: ["PREDICT", "fold line ⇒ equal halves?", "all sides = 2a"],
            prims: equilateral({ a: 1.5, marks: ["60B", "60C", "sides"] }),
          },
          {
            caption:
              "Drop the fold line from A straight down to the base. It lands at 90°, turning one equilateral shape into two matching right triangles.",
            math: ["AD ⊥ BC"],
            prims: equilateral({ a: 1.5, showAltitude: true, marks: ["60B", "60C"] }),
          },
          {
            caption:
              "Reveal: the two folded halves match, so D is the exact midpoint. BD and DC are each half of 2a, which is a.",
            math: ["BD = DC = a", "the halves match"],
            prims: equilateral({ a: 1.5, showAltitude: true, half: true, marks: ["60B"] }),
          },
          {
            caption:
              "It also splits the 60° angle at A into two equal parts, so the angle at the top of our half-triangle is 30°.",
            math: ["∠BAD = 30°", "∠ABD = 60°"],
            prims: equilateral({ a: 1.5, showAltitude: true, half: true, marks: ["60B", "30A"] }),
          },
          {
            caption:
              "Pythagoras on the half-triangle gives the height. That is every length we need.",
            math: ["AD² = (2a)² − a²", "AD² = 3a²", "AD = a√3"],
            prims: equilateral({ a: 1.5, showAltitude: true, half: true,
                                 marks: ["60B", "30A", "halfsides"] }),
          },
          {
            caption:
              "Prediction checkpoint: stand at 30° and point to opposite, adjacent and hypotenuse before reading. The short a faces you, tall a√3 sits beside you, and 2a is across the right angle.",
            math: ["sin 30° = a/2a = 1/2", "cos 30° = a√3/2a = √3/2",
                   "tan 30° = a/(a√3) = 1/√3"],
            prims: equilateral({ a: 1.5, showAltitude: true, half: true,
                                 marks: ["30A", "halfsides"] }),
          },
          {
            caption:
              "Now stand at the 60° corner instead. Nothing about the triangle changed — only which side counts as opposite and which as adjacent, so the two values simply swap.",
            math: ["sin 60° = a√3/2a = √3/2", "cos 60° = a/2a = 1/2",
                   "tan 60° = a√3/a = √3"],
            answer: "30° and 60° swap sin and cos",
            prims: equilateral({ a: 1.5, showAltitude: true, half: true,
                                 marks: ["60B", "halfsides"] }),
          },
        ]}
      />

      <SectionHeading kicker="Section 2 of 3" title="Solved Examples" />

      <SolvedExamples
        examples={[
          {
            ref: "NCERT Ex 8.2 · Q1(i)",
            title: "sin 60° cos 30° + sin 30° cos 60°",
            body: (
              <Explainer3D
                guided
                height={400}
                steps={[
                  {
                    caption:
                      "READ & TRANSLATE — NCERT Exercise 8.2, Q1(i) asks for one number. It contains two products: sin 60° times cos 30°, plus sin 30° times cos 60°.",
                    math: ["sin 60° cos 30°", "+ sin 30° cos 60°"],
                    prims: table81(2),
                  },
                  {
                    caption:
                      "CHOOSE THE PATTERN — all four are standard-angle values, so use Table 8.1. Keep the two products in separate lanes and add only after both are finished.",
                    math: ["1. substitute", "2. multiply each pair", "3. add"],
                    prims: table81(2),
                  },
                  {
                    caption: "SUBSTITUTE — copy each value into its exact place, keeping the multiplication signs and the central plus sign.",
                    math: ["sin 60° = √3/2", "cos 30° = √3/2",
                           "sin 30° = 1/2", "cos 60° = 1/2"],
                    prims: table81(2, 0),
                  },
                  {
                    caption:
                      "CALCULATE, LINE 1 — first product: multiply numerator by numerator and denominator by denominator. √3 × √3 = 3.",
                    math: ["(√3/2)(√3/2)", "= 3/4"],
                    prims: table81(2, 0),
                  },
                  {
                    caption: "CALCULATE, LINE 2 — second product: 1 × 1 on top and 2 × 2 below gives 1/4.",
                    math: ["(1/2)(1/2)", "= 1/4"],
                    prims: table81(2, 1),
                  },
                  {
                    caption:
                      "CALCULATE, LINE 3 — the denominators already match, so add the numerators: 3 + 1 = 4.",
                    math: ["3/4 + 1/4", "= 4/4"],
                    prims: table81(2),
                  },
                  {
                    caption:
                      "SANITY CHECK — both products are positive and each is below 1; 3/4 + 1/4 fills one whole. The result 1 is plausible and exact.",
                    math: ["0 < 3/4 < 1", "0 < 1/4 < 1", "sum = 1 ✓"],
                    prims: table81(2),
                  },
                  {
                    caption: "FINAL ANSWER — sin 60° cos 30° + sin 30° cos 60° = 1.",
                    math: ["4/4 = 1"],
                    answer: "= 1",
                    prims: table81(2),
                  },
                ]}
              />
            ),
          },
          {
            ref: "NCERT Ex 8.2 · Q2(i)",
            title: "2 tan 30° / (1 + tan²30°)",
            body: (
              <Explainer3D
                guided
                height={400}
                steps={[
                  {
                    caption:
                      "READ & TRANSLATE — NCERT Exercise 8.2, Q2(i) asks which option has the same value as this fraction. The numerator is 2 tan 30°; the whole bracket 1 + tan²30° is the denominator.",
                    math: ["2 tan 30°", "⁄", "(1 + tan²30°)"],
                    prims: table81(3, 2),
                  },
                  {
                    caption:
                      "CHOOSE THE PATTERN — use direct substitution because tan 30° is a table value. Reduce the expression to a number first, then match that number to an option.",
                    math: ["tan 30° = 1/√3"],
                    prims: table81(3, 2),
                  },
                  {
                    caption: "SUBSTITUTE, NUMERATOR — replace tan 30° with 1/√3, then multiply by 2.",
                    math: ["2 × 1/√3", "= 2/√3"],
                    prims: table81(3, 2),
                  },
                  {
                    caption: "SUBSTITUTE, DENOMINATOR — square 1/√3 first to get 1/3, then add 1 using denominator 3.",
                    math: ["1 + 1/3", "= 4/3"],
                    prims: table81(3, 2),
                  },
                  {
                    caption: "CALCULATE, ONE LINE AT A TIME — dividing by 4/3 means multiplying by 3/4; then cancel common factors.",
                    math: ["(2/√3) × (3/4)", "= 6/(4√3)", "= 3/(2√3)"],
                    prims: table81(3, 2),
                  },
                  {
                    caption:
                      "CALCULATE, FINAL LINE — rationalise 3/(2√3) by multiplying top and bottom by √3. The value becomes √3/2.",
                    math: ["3√3/(2 × 3)", "= √3/2"],
                    prims: table81(3, 0),
                  },
                  {
                    caption:
                      "SANITY CHECK — the original numerator is about 1.15 and denominator about 1.33, so the answer should be below 1. √3/2 ≈ 0.87 fits.",
                    math: ["1.15/1.33 ≈ 0.87", "√3/2 ≈ 0.87 ✓"],
                    prims: table81(3, 0),
                  },
                  {
                    caption: "FINAL ANSWER — √3/2 is sin 60°, so choose option (A).",
                    math: ["√3/2 = sin 60°"],
                    answer: "(A) sin 60°",
                    prims: table81(3, 0),
                  },
                ]}
              />
            ),
          },
          {
            ref: "NCERT Ex 8.2 · Q2(iv)",
            title: "2 tan 30° / (1 − tan²30°)",
            body: (
              <Explainer3D
                guided
                height={400}
                steps={[
                  {
                    caption:
                      "READ & TRANSLATE — NCERT Exercise 8.2, Q2(iv) asks which option matches the fraction. It looks like Q2(i), but the denominator contains 1 minus tan²30°.",
                    math: ["2 tan 30°", "⁄", "(1 − tan²30°)"],
                    prims: table81(3, 2),
                  },
                  {
                    caption:
                      "CHOOSE THE PATTERN — again substitute tan 30° = 1/√3, but box the minus sign. A smaller denominator should make this answer larger than Q2(i).",
                    math: ["same top", "minus on the bottom"],
                    prims: table81(3, 2),
                  },
                  {
                    caption: "SUBSTITUTE, NUMERATOR — replace tan 30° with 1/√3. The top is unchanged from Q2(i).",
                    math: ["2 × 1/√3", "= 2/√3"],
                    prims: table81(3, 2),
                  },
                  {
                    caption:
                      "SUBSTITUTE, DENOMINATOR — square first, then subtract: 1 − 1/3 = 3/3 − 1/3 = 2/3.",
                    math: ["1 − 1/3", "= 2/3"],
                    prims: table81(3, 2),
                  },
                  {
                    caption: "CALCULATE, ONE LINE AT A TIME — divide by 2/3 by multiplying by 3/2, cancel the 2s, then simplify the root.",
                    math: ["(2/√3) × (3/2)", "= 3/√3", "= √3"],
                    prims: table81(3, 2),
                  },
                  {
                    caption:
                      "SANITY CHECK — the denominator 2/3 is smaller than 1, so dividing 2/√3 by it must increase the value. √3 ≈ 1.73 is larger than 2/√3 ≈ 1.15.",
                    math: ["2/3 < 1", "1.73 > 1.15 ✓"],
                    prims: table81(3, 2),
                  },
                  {
                    caption: "FINAL ANSWER — √3 sits under 60° in the tangent row, so choose option (C), tan 60°.",
                    math: ["√3 = tan 60°"],
                    answer: "(C) tan 60°",
                    prims: table81(3, 2),
                  },
                ]}
              />
            ),
          },
        ]}
      />

      <SectionHeading kicker="Section 3 of 3" title="Practice Questions" />

      <PracticeSet
        onAllComplete={onComplete}
        onAnswer={onAnswer}
        onMistake={onMistake}
        playTone={playTone}
        questions={Q3060}
        skill="ratios3060"
        title="Choose an answer for each"
      />
    </div>
  );
}

/* ═══════════════════════ 8.3c — the edge cases 0° and 90° ════════════════ */

export function Topic0090({ onAnswer, onMistake, playTone, onComplete }: PanelProps) {
  return (
    <div className={styles.topicPanel}>
      <SectionHeading kicker="Section 1 of 3" title="Recap" />

      <TrigAngleLab steps={[
  {
    angle: 36,
    narrationSrc: "/audio/chapter8/8-3-053.mp3",
    caption:
      "Think of a playground ramp with an angle slider at A. Before moving it, predict: when the ramp closes toward the ground, which side disappears first?",
    math: ["PREDICT", "angle → 0°", "opposite or adjacent?"],
    eyebrow: "Make a prediction",
    title: "Which side disappears first?",
    note: "Follow the colored projections, not the picture's overall size.",
  },
  {
    angle: 16,
    narrationSrc: "/audio/chapter8/8-3-054.mp3",
    caption:
      "Drag the imaginary slider toward 0°. C moves down like the end of a closing door, so the opposite side is the one shrinking.",
    math: ["∠A shrinking", "BC getting shorter"],
    eyebrow: "Watch the red side",
    title: "The opposite side collapses",
    note: "The blue hypotenuse stays one unit while the red height gets shorter.",
  },
  {
    angle: 2,
    narrationSrc: "/audio/chapter8/8-3-055.mp3",
    caption:
      "Keep going. The opposite side has almost vanished, and the hypotenuse has flattened down onto the base — the two are nearly the same length now.",
    math: ["BC → 0", "AC → AB"],
    eyebrow: "Approach the limit",
    title: "Red goes to 0; green goes to 1",
    note: "At the endpoint, the ray and its horizontal shadow lie on top of each other.",
  },
  {
    angle: 0,
    narrationSrc: "/audio/chapter8/8-3-056.mp3",
    caption:
      "That fixes both values at 0°. sin has a vanishing top, so it goes to 0; cos has two nearly equal lengths, so it goes to 1.",
    math: ["sin 0° = 0", "cos 0° = 1"],
    eyebrow: "Read the projections",
    title: "sin 0° = 0 and cos 0° = 1",
    note: "Sine reads the red height; cosine reads the green width.",
  },
  {
    angle: 0,
    narrationSrc: "/audio/chapter8/8-3-057.mp3",
    caption:
      "The rest follow by dividing. Two of them put a zero on the bottom, and dividing by zero has no meaning — so they are simply not defined.",
    math: ["tan 0° = 0/1 = 0", "sec 0° = 1/1 = 1", "cot 0°, cosec 0° → ÷ 0"],
    eyebrow: "Denominator check",
    title: "Zero underneath means stop",
    note: "A zero numerator can make 0. A zero denominator makes the ratio undefined.",
  },
  {
    angle: 72,
    narrationSrc: "/audio/chapter8/8-3-058.mp3",
    caption:
      "Now open the ramp toward a vertical wall. Predict the mirror case: as the angle nears 90°, which side must collapse? This time it is the adjacent side.",
    math: ["PREDICT → REVEAL", "∠A growing", "AB getting shorter"],
    eyebrow: "Mirror experiment",
    title: "Now open the ray toward 90°",
    note: "The green horizontal projection shrinks while the red height rises.",
  },
  {
    angle: 89,
    narrationSrc: "/audio/chapter8/8-3-059.mp3",
    caption:
      "At the limit the adjacent side is gone and the hypotenuse lies along the opposite side — exactly the mirror of the 0° case.",
    math: ["AB → 0", "AC → BC"],
    eyebrow: "Approach the other limit",
    title: "Green goes to 0; red goes to 1",
    note: "The unit ray is almost vertical, so its horizontal shadow nearly vanishes.",
  },
  {
    angle: 90,
    narrationSrc: "/audio/chapter8/8-3-060.mp3",
    caption:
      "So at 90° the two values have swapped, and this time it is tan and sec that break.",
    math: ["sin 90° = 1", "cos 90° = 0", "cot 90° = 0, cosec 90° = 1"],
    answer: "0° and 90° are mirrors",
    eyebrow: "Lock in the mirror",
    title: "sin and cos swap endpoint values",
    note: "Because cos 90° is zero, tan 90° and sec 90° are not defined.",
  },
      ] satisfies readonly TrigAngleLabStep[]} />

      <SectionHeading kicker="Section 2 of 3" title="Solved Examples" />

      <SolvedExamples
        examples={[
          {
            ref: "NCERT Ex 8.2 · Q2(iii)",
            title: "When is sin 2A = 2 sin A?",
            body: (
              <Explainer3D
                guided
                height={400}
                steps={[
                  {
                    caption:
                      "READ & TRANSLATE — NCERT Exercise 8.2, Q2(iii) asks which listed angle makes the left side sin(2A) equal the right side 2 × sin A. Doubling the angle is not the same as doubling the sine.",
                    math: ["sin 2A = 2 sin A", "which A?"],
                    prims: table81(1),
                  },
                  {
                    caption:
                      "CHOOSE THE PATTERN — there is no valid rule sin 2A = 2 sin A, so use option testing. Substitute an angle into both sides and compare the two numbers.",
                    math: ["test each option", "compare both sides"],
                    prims: table81(1),
                  },
                  {
                    caption:
                      "SUBSTITUTE A = 30° — first double the angle inside sine, then separately multiply the sine value on the right.",
                    math: ["LHS = √3/2 ≈ 0.87", "RHS = 2(1/2) = 1", "not equal"],
                    prims: table81(1, 0),
                  },
                  {
                    caption: "CALCULATE THE NEXT OPTION — for A = 45°, 2A = 90°. Evaluate each side one line at a time.",
                    math: ["LHS = sin 90° = 1", "RHS = 2(1/√2) ≈ 1.41", "not equal"],
                    prims: table81(1, 0),
                  },
                  {
                    caption:
                      "SUBSTITUTE A = 0° — doubling zero still gives zero, and multiplying sin 0° by 2 still gives zero.",
                    math: ["LHS = sin 0° = 0", "RHS = 2(0) = 0", "equal ✓"],
                    prims: table81(1, 0),
                  },
                  {
                    caption:
                      "SANITY CHECK — option 60° cannot work because its right side is 2 sin 60° = √3, which is greater than 1, while every sine value stays between −1 and 1.",
                    math: ["RHS at 60° = √3 > 1", "but |sin 120°| ≤ 1 ✓"],
                    prims: table81(1),
                  },
                  {
                    caption:
                      "FINAL ANSWER — option (A), A = 0°. The equation works there because both sides equal zero; sin 2A is not generally 2 sin A.",
                    math: ["0 = 0 ✓", "sin 2A ≠ 2 sin A in general"],
                    answer: "(A) A = 0°",
                    prims: table81(1),
                  },
                ]}
              />
            ),
          },
          {
            ref: "NCERT Ex 8.2 · Q4(v)",
            title: "Is cot A undefined at A = 0°?",
            body: (
              <Explainer3D
                guided
                height={400}
                steps={[
                  {
                    caption:
                      "READ & TRANSLATE — NCERT Exercise 8.2, Q4(v) asks whether the claim 'cot A is not defined at A = 0°' is true or false, and it requires a reason.",
                    math: ["claim: cot 0°", "is not defined"],
                    prims: table81(6),
                  },
                  {
                    caption:
                      "CHOOSE THE FORMULA — use cot A = cos A/sin A because both sine and cosine at 0° are known. A fraction is defined only when its denominator is non-zero.",
                    math: ["cot A = cos A / sin A"],
                    prims: table81(6, 5),
                  },
                  {
                    caption: "SUBSTITUTE — Table 8.1 gives cos 0° = 1 and sin 0° = 0. Place them into numerator and denominator in that order.",
                    math: ["cos 0° = 1", "sin 0° = 0"],
                    prims: table81(6, 1),
                  },
                  {
                    caption:
                      "CALCULATE — cot 0° becomes 1/0. Division asks 'what number times 0 gives 1?' No number can, so the value is undefined.",
                    math: ["cot 0° = 1 / 0", "no such number"],
                    prims: table81(6, 5),
                  },
                  {
                    caption:
                      "SANITY CHECK — compare tan 0° = sin 0°/cos 0° = 0/1 = 0. Zero on top is safe; zero underneath is what breaks cot.",
                    math: ["tan 0° = 0/1 = 0", "cot 0° = 1/0 = n.d. ✓"],
                    prims: table81(6, 5),
                  },
                  {
                    caption: "FINAL ANSWER — the statement is True: cot 0° is not defined.",
                    math: ["cot 0° = 1/0", "not defined"],
                    answer: "True · undefined",
                    prims: table81(6, 5),
                  },
                ]}
              />
            ),
          },
        ]}
      />

      <SectionHeading kicker="Section 3 of 3" title="Practice Questions" />

      <PracticeSet
        onAllComplete={onComplete}
        onAnswer={onAnswer}
        onMistake={onMistake}
        playTone={playTone}
        questions={Q0090}
        skill="ratios0090"
        title="Choose an answer for each"
      />
    </div>
  );
}

/* ═══════════════════════════ 8.3d — Table 8.1 ════════════════════════════ */

export function TopicTable({ onAnswer, onMistake, playTone, onComplete }: PanelProps) {
  return (
    <div className={styles.topicPanel}>
      <SectionHeading kicker="Section 1 of 3" title="Recap" />

      <Explainer3D
        height={440}
        scale={62}
        steps={[
          {
            caption:
              "Treat Table 8.1 like a pattern machine, not a wall of thirty facts. Before we switch it on, predict which row should climb as a ramp opens from 0° to 90°.",
            math: ["PREDICT", "sin climbs or falls?", "cos climbs or falls?"],
            prims: table81(0),
          },
          {
            caption:
              "Reveal: sine is the height gauge on our ramp, so it climbs from 0 to 1 as the angle opens. The first row fills in from left to right.",
            math: ["from the triangles", "we just built"],
            prims: table81(1, 0),
          },
          {
            caption:
              "Feed the pattern machine 0, 1, 2, 3, 4. Divide each by 4 and take the square root; out comes the entire sine row.",
            math: ["√(0/4)  √(1/4)  √(2/4)", "√(3/4)  √(4/4)",
                   "= the sine row"],
            prims: table81(1, 0),
          },
          {
            caption:
              "Prediction checkpoint: what happens if the machine runs backwards? The cosine row appears. You do not memorise it separately — reverse sine.",
            math: ["cos = sin reversed"],
            prims: table81(2, 1),
          },
          {
            caption:
              "Tangent is sine divided by cosine, entry by entry. At 90° that means dividing by zero, which is why it is not defined there.",
            math: ["tan = sin / cos", "at 90°: 1/0", "not defined"],
            prims: table81(3, 2),
          },
          {
            caption:
              "The last three rows are just the first three flipped upside down. Wherever a value was 0, its flip is undefined.",
            math: ["cosec = 1/sin", "sec = 1/cos", "cot = 1/tan"],
            prims: table81(6),
          },
          {
            caption:
              "Read across and the pattern is the real takeaway: sine climbs from 0 to 1 while cosine falls from 1 to 0. They cross at 45°, the one angle where they are equal.",
            math: ["sin ↑  0 → 1", "cos ↓  1 → 0", "equal at 45°"],
            answer: "one pattern, whole table",
            prims: table81(6, 0),
          },
        ]}
      />

      <SectionHeading kicker="Section 2 of 3" title="Solved Examples" />

      <SolvedExamples
        examples={[
          {
            ref: "NCERT Example 6",
            title: "Find BC and AC from one side and one angle",
            body: (
              <Explainer3D
                guided
                height={410}
                steps={[
                  {
                    caption:
                      "READ & TRANSLATE — NCERT Example 6 gives a right triangle with AB = 5 cm and angle C = 30°. Mark 5 on the side opposite C, then mark BC and AC as the two unknowns.",
                    math: ["AB = 5 cm", "∠C = 30°", "find BC, AC"],
                    prims: [...groundLine(5.2),
                            ...rightTriangle3D({ adj: 3.4, opp: 1.6, at: "C",
                                                 sides: { ab: "5", bc: "?", ac: "?" } })],
                  },
                  {
                    caption:
                      "CHOOSE THE FORMULA — for each unknown, pair it with the known side AB. Opposite plus adjacent chooses tangent for BC; opposite plus hypotenuse chooses sine for AC.",
                    math: ["1. name the sides", "2. pick the ratio", "3. solve"],
                    prims: [...groundLine(5.2),
                            ...rightTriangle3D({ adj: 3.4, opp: 1.6, at: "C",
                                                 sides: { ab: "5", bc: "?", ac: "?" } })],
                  },
                  {
                    caption:
                      "TRANSLATE THE DIAGRAM — stand at C: AB faces you, so opposite = 5; BC touches C without crossing the right angle, so adjacent = BC.",
                    math: ["opposite = AB = 5", "adjacent = BC = ?"],
                    prims: [...groundLine(5.2),
                            ...rightTriangle3D({ adj: 3.4, opp: 1.6, at: "C", lit: ["opp", "adj"],
                                                 sides: { ab: "5", bc: "?", ac: "?" } })],
                  },
                  {
                    caption:
                      "SUBSTITUTE FOR BC — write tan C = opposite/adjacent, then replace C with 30°, opposite with 5 and tan 30° with 1/√3.",
                    math: ["tan 30° = AB / BC", "1/√3 = 5 / BC"],
                    prims: [...groundLine(5.2),
                            ...rightTriangle3D({ adj: 3.4, opp: 1.6, at: "C", lit: ["opp", "adj"],
                                                 sides: { ab: "5", bc: "?", ac: "?" } })],
                  },
                  {
                    caption: "CALCULATE BC, ONE LINE AT A TIME — cross-multiply, then isolate BC.",
                    math: ["BC/√3 = 5", "BC = 5√3 cm"],
                    prims: [...groundLine(5.2),
                            ...rightTriangle3D({ adj: 3.4, opp: 1.6, at: "C", lit: ["adj"],
                                                 sides: { ab: "5", bc: "5√3", ac: "?" } })],
                  },
                  {
                    caption:
                      "SUBSTITUTE AND CALCULATE AC — opposite and hypotenuse choose sine. Replace sin 30° with 1/2, cross-multiply, then divide by 1.",
                    math: ["sin 30° = AB / AC", "1/2 = 5 / AC", "AC = 10 cm"],
                    prims: [...groundLine(5.2),
                            ...rightTriangle3D({ adj: 3.4, opp: 1.6, at: "C", lit: ["opp", "hyp"],
                                                 sides: { ab: "5", bc: "5√3", ac: "?" } })],
                  },
                  {
                    caption:
                      "SANITY CHECK — Pythagoras must reproduce the hypotenuse. 5² + (5√3)² = 25 + 75 = 100, and √100 = 10.",
                    math: ["√(25 + 75)", "= √100 = 10 ✓"],
                    prims: [...groundLine(5.2),
                            ...rightTriangle3D({ adj: 3.4, opp: 1.6, at: "C",
                                                 lit: ["opp", "adj", "hyp"],
                                                 sides: { ab: "5", bc: "5√3", ac: "10" } })],
                  },
                  {
                    caption: "FINAL ANSWER — BC = 5√3 cm and AC = 10 cm.",
                    math: ["BC = 5√3 cm", "AC = 10 cm"],
                    answer: "BC = 5√3 cm · AC = 10 cm",
                    prims: [...groundLine(5.2),
                            ...rightTriangle3D({ adj: 3.4, opp: 1.6, at: "C",
                                                 lit: ["opp", "adj", "hyp"],
                                                 sides: { ab: "5", bc: "5√3", ac: "10" } })],
                  },
                ]}
              />
            ),
          },
          {
            ref: "NCERT Example 7",
            title: "Find both angles from two sides",
            body: (
              <Explainer3D
                guided
                height={410}
                steps={[
                  {
                    caption:
                      "READ & TRANSLATE — NCERT Example 7 gives PQ = 3 cm and hypotenuse PR = 6 cm, then asks for both acute angles. We need a side ratio first, then an angle.",
                    math: ["PQ = 3 cm", "PR = 6 cm", "find both angles"],
                    prims: [...groundLine(5.2),
                            ...rightTriangle3D({ adj: 3.0, opp: 1.7,
                                                 sides: { ab: "?", bc: "3", ac: "6" } })],
                  },
                  {
                    caption:
                      "CHOOSE THE FORMULA — relative to angle R, the known sides are opposite PQ and hypotenuse PR, so sine is the only ratio using exactly those two sides.",
                    math: ["sides → ratio", "ratio → angle"],
                    prims: [...groundLine(5.2),
                            ...rightTriangle3D({ adj: 3.0, opp: 1.7,
                                                 sides: { ab: "?", bc: "3", ac: "6" } })],
                  },
                  {
                    caption:
                      "SUBSTITUTE — place the two given lengths into sin R = opposite/hypotenuse.",
                    math: ["sin R = PQ / PR", "sin R = 3 / 6"],
                    prims: [...groundLine(5.2),
                            ...rightTriangle3D({ adj: 3.0, opp: 1.7, lit: ["opp", "hyp"],
                                                 sides: { ab: "?", bc: "3", ac: "6" } })],
                  },
                  {
                    caption:
                      "CALCULATE, LINE 1 — simplify 3/6 to 1/2, then read Table 8.1 backwards: sine equals 1/2 at 30°.",
                    math: ["sin R = 1/2", "∠R = 30°"],
                    prims: table81(1, 0),
                  },
                  {
                    caption:
                      "CALCULATE, LINE 2 — the two acute angles in a right triangle add to 90°, so subtract R from 90° to get P.",
                    math: ["∠P = 90° − 30°", "∠P = 60°"],
                    prims: [...groundLine(5.2),
                            ...rightTriangle3D({ adj: 3.0, opp: 1.7, lit: ["opp", "hyp"],
                                                 sides: { ab: "?", bc: "3", ac: "6" } })],
                  },
                  {
                    caption:
                      "SANITY CHECK — the side opposite 30° should be half the hypotenuse. PQ = 3 is exactly half of PR = 6, and 30° + 60° + 90° = 180°.",
                    math: ["3 = 6/2 ✓", "30° + 60° + 90° = 180° ✓"],
                    prims: [...groundLine(5.2),
                            ...rightTriangle3D({ adj: 3.0, opp: 1.7, lit: ["opp", "hyp"],
                                                 sides: { ab: "?", bc: "3", ac: "6" } })],
                  },
                  {
                    caption: "FINAL ANSWER — angle PRQ = 30° and angle QPR = 60°.",
                    math: ["∠PRQ = 30°", "∠QPR = 60°"],
                    answer: "∠PRQ = 30° · ∠QPR = 60°",
                    prims: [...groundLine(5.2),
                            ...rightTriangle3D({ adj: 3.0, opp: 1.7, lit: ["opp", "hyp"],
                                                 sides: { ab: "?", bc: "3", ac: "6" } })],
                  },
                ]}
              />
            ),
          },
          {
            ref: "NCERT Example 8",
            title: "Two ratios, two unknown angles",
            body: (
              <Explainer3D
                guided
                height={400}
                steps={[
                  {
                    caption:
                      "READ & TRANSLATE — NCERT Example 8 gives two ratio statements and asks for two angles. The range and A > B tell us both angle expressions are valid standard angles.",
                    math: ["sin(A−B) = 1/2", "cos(A+B) = 1/2"],
                    prims: table81(2),
                  },
                  {
                    caption:
                      "CHOOSE THE PATTERN — read Table 8.1 backwards to turn each ratio value into an angle. Then solve the resulting simultaneous equations by adding and substituting.",
                    math: ["ratio → angle", "then solve the pair"],
                    prims: table81(2),
                  },
                  {
                    caption:
                      "SUBSTITUTE FROM THE SINE ROW — sin of an allowed angle is 1/2 at 30°, so replace the first ratio statement with A − B = 30°.",
                    math: ["A − B = 30°", "…(1)"],
                    prims: table81(2, 0),
                  },
                  {
                    caption: "SUBSTITUTE FROM THE COSINE ROW — cos of an allowed angle is 1/2 at 60°, so A + B = 60°.",
                    math: ["A + B = 60°", "…(2)"],
                    prims: table81(2, 1),
                  },
                  {
                    caption: "CALCULATE, LINE 1 — add the equations vertically. −B and +B cancel, leaving 2A = 90°; divide both sides by 2.",
                    math: ["2A = 90°", "A = 45°"],
                    prims: table81(2),
                  },
                  {
                    caption: "CALCULATE, LINE 2 — substitute A = 45° into A + B = 60°, then subtract 45°.",
                    math: ["45° + B = 60°", "B = 15°"],
                    prims: table81(2),
                  },
                  {
                    caption:
                      "SANITY CHECK — put both answers back: A − B = 30° gives sin 30° = 1/2, and A + B = 60° gives cos 60° = 1/2.",
                    math: ["45° − 15° = 30° ✓", "45° + 15° = 60° ✓"],
                    prims: table81(2),
                  },
                  {
                    caption: "FINAL ANSWER — A = 45° and B = 15°.",
                    narrationSrc: "/audio/chapter8/8-3-103.mp3",
                    math: ["A = 45°", "B = 15°"],
                    answer: "A = 45° · B = 15°",
                    prims: table81(2),
                  },
                ]}
              />
            ),
          },
          {
            ref: "NCERT Ex 8.2 · Q3",
            title: "The same trick with tangents",
            body: (
              <Explainer3D
                guided
                height={400}
                steps={[
                  {
                    caption:
                      "READ & TRANSLATE — NCERT Exercise 8.2, Q3 gives two tangent values and asks for A and B. The conditions select the standard acute angles in Table 8.1.",
                    math: ["tan(A+B) = √3", "tan(A−B) = 1/√3"],
                    prims: table81(3),
                  },
                  {
                    caption:
                      "CHOOSE THE PATTERN — read the tangent row backwards, then use simultaneous equations: add to isolate A and subtract to isolate B.",
                    math: ["same method", "different row"],
                    prims: table81(3, 2),
                  },
                  {
                    caption: "SUBSTITUTE FROM TABLE 8.1 — tan 60° = √3 and tan 30° = 1/√3, so replace each ratio statement with its angle equation.",
                    math: ["A + B = 60°  …(1)", "A − B = 30°  …(2)"],
                    prims: table81(3, 2),
                  },
                  {
                    caption: "CALCULATE A — add equations (1) and (2). The B terms cancel; divide 2A = 90° by 2.",
                    math: ["2A = 90°", "A = 45°"],
                    prims: table81(3, 2),
                  },
                  {
                    caption:
                      "CALCULATE B — subtract equation (2) from equation (1). The A terms cancel; divide 2B = 30° by 2.",
                    math: ["2B = 30°", "B = 15°"],
                    prims: table81(3, 2),
                  },
                  {
                    caption:
                      "SANITY CHECK — 45° + 15° = 60° gives tan = √3, and 45° − 15° = 30° gives tan = 1/√3. Both original statements return.",
                    math: ["tan 60° = √3 ✓", "tan 30° = 1/√3 ✓"],
                    prims: table81(3, 2),
                  },
                  {
                    caption: "FINAL ANSWER — A = 45° and B = 15°.",
                    narrationSrc: "/audio/chapter8/8-3-110.mp3",
                    math: ["A = 45°", "B = 15°"],
                    answer: "A = 45° · B = 15°",
                    prims: table81(3, 2),
                  },
                ]}
              />
            ),
          },
        ]}
      />

      <SectionHeading kicker="Section 3 of 3" title="Practice Questions" />

      <PracticeSet
        onAllComplete={onComplete}
        onAnswer={onAnswer}
        onMistake={onMistake}
        playTone={playTone}
        questions={QTABLE}
        skill="table81"
        title="Choose an answer for each"
      />
    </div>
  );
}

/* ── hint drawers ─────────────────────────────────────────────────────────
   Three rungs each: a nudge that points at what to look at, a *different*
   smaller worked example, then the transferable rule. The middle rung never
   solves the question on screen. */

export const HINTS_45: LessonHints = {
  title: "Ratios of 45°",
  prompt: "Stuck on where the 45° values come from?",
  steps: [
    {
      label: "Gentle nudge",
      title: "Count the angles first",
      body: "A right angle uses 90° of the 180° available. If one of the two " +
            "left over is 45°, there is only one possible size for the other.",
      example: "180° − 90° − 45° leaves exactly 45°.",
    },
    {
      label: "Worked example",
      title: "A smaller version of the same idea",
      body: "Take a right triangle with legs 7 and 7. Pythagoras gives a " +
            "hypotenuse of √98 = 7√2. Then the opposite over the hypotenuse is " +
            "7/(7√2), and the 7 cancels.",
      example: "7 / (7√2) = 1/√2 — the same answer a 3-and-3 triangle gives.",
    },
    {
      label: "Rule",
      title: "The transferable idea",
      body: "Equal angles force equal sides. Once both legs are the same letter, " +
            "that letter always cancels — which is why 45° has fixed values no " +
            "matter how big the triangle is.",
    },
  ],
};

export const HINTS_3060: LessonHints = {
  title: "Ratios of 30° and 60°",
  prompt: "Not sure where the √3 comes from?",
  steps: [
    {
      label: "Gentle nudge",
      title: "It is half of a shape you know",
      body: "A 30-60-90 triangle is not a new object. It is an equilateral " +
            "triangle cut straight down the middle, which is why its sides come " +
            "out so tidily.",
      example: "Cutting a 2a-sided equilateral triangle leaves a base of a.",
    },
    {
      label: "Worked example",
      title: "A smaller version of the same idea",
      body: "Take an equilateral triangle of side 10. Half the base is 5, the " +
            "full side is still 10, and Pythagoras gives the height as " +
            "√(100 − 25) = √75 = 5√3.",
      example: "Sides 5, 5√3 and 10 — the same 1 : √3 : 2 shape every time.",
    },
    {
      label: "Rule",
      title: "The transferable idea",
      body: "Every 30-60-90 triangle has sides in the ratio 1 : √3 : 2. Stand at " +
            "the 30° corner or the 60° corner and the same three lengths simply " +
            "swap which is opposite and which is adjacent.",
    },
  ],
};

export const HINTS_0090: LessonHints = {
  title: "Ratios of 0° and 90°",
  prompt: "Unsure why some of these are 'not defined'?",
  steps: [
    {
      label: "Gentle nudge",
      title: "Watch which side is disappearing",
      body: "These two angles are limits, not triangles you can draw. Shrink the " +
            "angle and the opposite side vanishes; open it and the adjacent side " +
            "vanishes instead.",
      example: "As the angle closes, the hypotenuse flattens onto the base.",
    },
    {
      label: "Worked example",
      title: "A smaller version of the same idea",
      body: "Watch a fraction with a shrinking bottom: 1/0.1 = 10, 1/0.01 = 100, " +
            "1/0.001 = 1000. It grows without ever settling anywhere, so there is " +
            "no number to call the answer.",
      example: "A zero on the bottom means undefined; a zero on top just means 0.",
    },
    {
      label: "Rule",
      title: "The transferable idea",
      body: "Check the denominator before you answer. cot and cosec break at 0°, " +
            "tan and sec break at 90° — always because sin or cos underneath has " +
            "gone to zero.",
    },
  ],
};

export const HINTS_TABLE: LessonHints = {
  title: "Table 8.1",
  prompt: "Trying to memorise all thirty values?",
  steps: [
    {
      label: "Gentle nudge",
      title: "You only need one row",
      body: "Do not learn six rows. Learn the sine row, and build the other five " +
            "from it by reversing, dividing and flipping.",
      example: "cos is the sine row backwards; tan is sin ÷ cos.",
    },
    {
      label: "Worked example",
      title: "A smaller version of the same idea",
      body: "Build the sine row from scratch: write 0, 1, 2, 3, 4 under the five " +
            "angles, divide each by 4, then square-root. You get 0, 1/2, 1/√2, " +
            "√3/2, 1 — with nothing memorised.",
      example: "√(2/4) = 1/√2, which is the 45° entry.",
    },
    {
      label: "Rule",
      title: "The transferable idea",
      body: "The table also runs backwards. Given a value, scan the right row and " +
            "read the angle above it — that is how questions asking you to find " +
            "an angle are solved.",
    },
  ],
};

export const PANELS_8_3 = {
  ratios45: { hints: HINTS_45, Panel: Topic45 },
  ratios3060: { hints: HINTS_3060, Panel: Topic3060 },
  ratios0090: { hints: HINTS_0090, Panel: Topic0090 },
  table81: { hints: HINTS_TABLE, Panel: TopicTable },
};
