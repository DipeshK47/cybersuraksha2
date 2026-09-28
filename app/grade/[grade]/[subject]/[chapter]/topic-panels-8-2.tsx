"use client";

import type { ReactNode } from "react";
import {
  type LessonHints,
  PracticeSet,
} from "../../../../components/learning/LearningSupport";
import { type PanelProps } from "./scene-kit";
import {
  Explainer3D, groundLine, rightTriangle3D, SectionHeading,
  SolvedExamples,
} from "./iso3d";
import styles from "./chapter-lesson.module.css";

import {
  NAMING_QUESTIONS,
  SWAP_QUESTIONS,
  RATIOS_QUESTIONS,
  SIZE_QUESTIONS,
  RECIP_QUESTIONS,
  NUMBERS_QUESTIONS,
  KMETHOD_QUESTIONS,
  LIMITS_QUESTIONS,
  RECAP_QUESTIONS,
} from "../../../../data/practice-bank";

/* §8.2 — Trigonometric Ratios, taught topic by topic.
   Worked examples are NCERT's own (Examples 1–5, book pp.118–120); practice
   questions badged "handbook" come from Exercise 8.1. Every figure is the
   shared TriangleScene so "opposite" is the same red everywhere a student
   meets it. */

/* ═══ 8.2a — Naming the three sides ═══════════════════════════════════════ */

const NAMING_HINTS: LessonHints = {
  title: "Naming the sides of a right triangle",
  prompt: "Which side is which — and why the right angle decides first.",
  steps: [
    {
      label: "Gentle nudge",
      title: "Find the right angle before anything else",
      body: "The hypotenuse is the side facing the right angle. Locate the little " +
            "square first, then look straight across from it — that side is the " +
            "hypotenuse, and it is always the longest.",
    },
    {
      label: "Worked example",
      title: "Naming from angle A in △ABC, right angle at B",
      body: "Two questions, in this order. Which side faces A without touching it? " +
            "That is the opposite side. Which of A's two arms is not the hypotenuse? " +
            "That is the adjacent side.",
      example: "hypotenuse AC · opposite to A is BC · adjacent to A is AB",
    },
    {
      label: "Rule",
      title: "The rule to carry",
      body: "The hypotenuse is fixed by the right angle. Opposite and adjacent are " +
            "fixed by the acute angle you name from. Angle A has two arms — AB and " +
            "AC — and the adjacent side is the arm that is not the hypotenuse.",
    },
  ],
};

export function TopicNaming({ onAnswer, onMistake, playTone, onComplete }: PanelProps) {
  return (
    <div className={styles.topicPanel}>
      {/* ───────────────────────── RECAP ───────────────────────── */}
      <SectionHeading
        kicker="Section 1 of 3"
        title="Recap"
      />


      <Explainer3D
        height={430}
        steps={[
          {
            caption: "Here is triangle ABC, standing on the ground. The right angle is at B.",
            prims: [...groundLine(5.2), ...rightTriangle3D({ adj: 3.2, opp: 2.4 })],
          },
          {
            caption: "Find the right angle first. Look straight across from it — that side is the hypotenuse.",
            math: ["hypotenuse = AC", "the longest side"],
            prims: [...groundLine(5.2),
                    ...rightTriangle3D({ adj: 3.2, opp: 2.4, lit: ["hyp"] })],
          },
          {
            caption: "Now choose an acute angle to work from. Take angle A, at the bottom right.",
            math: ["naming from A"],
            prims: [...groundLine(5.2),
                    ...rightTriangle3D({ adj: 3.2, opp: 2.4, at: "A", lit: ["hyp"] })],
          },
          {
            caption: "Which side faces A without touching it? BC. That is the opposite side.",
            math: ["hypotenuse = AC", "opposite  = BC"],
            prims: [...groundLine(5.2),
                    ...rightTriangle3D({ adj: 3.2, opp: 2.4, at: "A", lit: ["hyp", "opp"] })],
          },
          {
            caption: "Angle A has two arms, AB and AC. AC is already the hypotenuse, so the adjacent side is AB.",
            math: ["hypotenuse = AC", "opposite  = BC", "adjacent  = AB"],
            prims: [...groundLine(5.2),
                    ...rightTriangle3D({ adj: 3.2, opp: 2.4, at: "A",
                                         lit: ["hyp", "opp", "adj"] })],
          },
          {
            caption: "All three named — and every one of them was decided by the right angle plus the angle you chose.",
            math: ["hypotenuse = AC", "opposite  = BC", "adjacent  = AB"],
            answer: "3 sides, 3 names",
            prims: [...groundLine(5.2),
                    ...rightTriangle3D({ adj: 3.2, opp: 2.4, at: "A",
                                         lit: ["hyp", "opp", "adj"] })],
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
            ref: "NCERT Ex 8.1 · Q1(i)",
            title: "Find sin A and cos A",
            body: (
              <>
        <Explainer3D
          guided
          height={430}
          steps={[
            {
              caption: "QUESTION — NCERT Exercise 8.1, Q1(i): In triangle ABC, right-angled at B, AB = 24 cm and BC = 7 cm. Find sin A and cos A.",
              math: ["given:", "AB = 24 cm", "BC = 7 cm", "find: sin A, cos A"],
              prims: [...groundLine(5.2),
                      ...rightTriangle3D({ adj: 3.4, opp: 1.0,
                                           sides: { ab: "24", bc: "7", ac: "?" } })],
            },
            {
              caption: "APPROACH — a right triangle's third side always comes from Pythagoras. Get it first, then sort the sides into roles, then read the ratios off.",
              math: ["1. third side", "2. name the roles", "3. read the ratios"],
              prims: [...groundLine(5.2),
                      ...rightTriangle3D({ adj: 3.4, opp: 1.0,
                                           sides: { ab: "24", bc: "7", ac: "?" } })],
            },
            {
              caption: "We are given two sides. Before anything else, find the third.",
              math: ["AB = 24", "BC = 7", "AC = ?"],
              prims: [...groundLine(5.2),
                      ...rightTriangle3D({ adj: 3.4, opp: 1.0,
                                           sides: { ab: "24", bc: "7", ac: "?" } })],
            },
            {
              caption: "Pythagoras on the two legs.",
              math: ["AC² = 24² + 7²", "AC² = 576 + 49", "AC² = 625"],
              prims: [...groundLine(5.2),
                      ...rightTriangle3D({ adj: 3.4, opp: 1.0, lit: ["hyp"],
                                           sides: { ab: "24", bc: "7", ac: "?" } })],
            },
            {
              caption: "So the hypotenuse is 25 cm. (7-24-25 is a triple worth memorising.)",
              math: ["AC = √625", "AC = 25 cm"],
              prims: [...groundLine(5.2),
                      ...rightTriangle3D({ adj: 3.4, opp: 1.0, lit: ["hyp"],
                                           sides: { ab: "24", bc: "7", ac: "25" } })],
            },
            {
              caption: "Now sort the three lengths into their roles for angle A.",
              math: ["opposite  BC = 7", "adjacent  AB = 24", "hypotenuse AC = 25"],
              prims: [...groundLine(5.2),
                      ...rightTriangle3D({ adj: 3.4, opp: 1.0, at: "A",
                                           lit: ["hyp", "opp", "adj"],
                                           sides: { ab: "24", bc: "7", ac: "25" } })],
            },
            {
              caption: "Sine is opposite over hypotenuse.",
              math: ["sin A = opp / hyp", "sin A = 7 / 25"],
              prims: [...groundLine(5.2),
                      ...rightTriangle3D({ adj: 3.4, opp: 1.0, at: "A", lit: ["opp", "hyp"],
                                           sides: { ab: "24", bc: "7", ac: "25" } })],
            },
            {
              caption: "Cosine is adjacent over hypotenuse. Both came out below 1, and the hypotenuse was the biggest number — the checks pass.",
              math: ["cos A = adj / hyp", "cos A = 24 / 25"],
              answer: "sin A = 7/25 · cos A = 24/25",
              prims: [...groundLine(5.2),
                      ...rightTriangle3D({ adj: 3.4, opp: 1.0, at: "A", lit: ["adj", "hyp"],
                                           sides: { ab: "24", bc: "7", ac: "25" } })],
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
        questions={NAMING_QUESTIONS}
        skill="naming"
        title="Choose an answer for each"
      />
    </div>
  );
}

/* ═══ 8.2b — Why the names swap with the angle ════════════════════════════ */

const SWAP_HINTS: LessonHints = {
  title: "When the angle changes, two names swap",
  prompt: "Same triangle, different angle — what moves and what does not.",
  steps: [
    {
      label: "Gentle nudge",
      title: "Ask 'opposite to which angle?'",
      body: "'Opposite' on its own is meaningless. It is always opposite to a " +
            "particular angle. Say the whole phrase out loud and the answer usually " +
            "appears by itself.",
    },
    {
      label: "Worked example",
      title: "The same side, two different jobs",
      body: "In △ABC right-angled at B, side BC is opposite angle A. Now look at " +
            "angle C instead: BC touches C, so it cannot be opposite C — it has " +
            "become the adjacent side. The side did not move. The question did.",
      example: "from A: opposite BC, adjacent AB — from C: opposite AB, adjacent BC",
    },
    {
      label: "Rule",
      title: "Two swap, one stays",
      body: "Switching between the two acute angles swaps opposite and adjacent " +
            "and leaves the hypotenuse alone. That is also why sin C = cos A in " +
            "any right triangle: the two angles read each other's sides.",
    },
  ],
};

export function TopicSwap({ onAnswer, onMistake, playTone, onComplete }: PanelProps) {
  return (
    <div className={styles.topicPanel}>
      {/* ───────────────────────── RECAP ───────────────────────── */}
      <SectionHeading
        kicker="Section 1 of 3"
        title="Recap"
      />


      <Explainer3D
        height={430}
        steps={[
          {
            caption: "The same triangle as before, named from angle A at the bottom right.",
            math: ["from A:", "opposite  BC", "adjacent  AB"],
            prims: [...groundLine(5.2),
                    ...rightTriangle3D({ adj: 3.2, opp: 2.4, at: "A",
                                         lit: ["hyp", "opp", "adj"] })],
          },
          {
            caption: "Now walk across to angle C, at the top. Nothing about the triangle changes — only where you stand.",
            math: ["moving to C ..."],
            prims: [...groundLine(5.2),
                    ...rightTriangle3D({ adj: 3.2, opp: 2.4, at: "A", lit: ["hyp"] })],
          },
          {
            caption: "BC touches C, so it cannot be opposite C any more. It has become the adjacent side.",
            math: ["from C:", "adjacent  BC"],
            prims: [...groundLine(5.2),
                    ...rightTriangle3D({ adj: 3.2, opp: 2.4, at: "C", lit: ["hyp", "adj"] })],
          },
          {
            caption: "And AB, which was adjacent to A, is the side that faces C without touching it — so AB is now opposite.",
            math: ["from C:", "opposite  AB", "adjacent  BC"],
            prims: [...groundLine(5.2),
                    ...rightTriangle3D({ adj: 3.2, opp: 2.4, at: "C",
                                         lit: ["hyp", "opp", "adj"] })],
          },
          {
            caption: "The hypotenuse never moved. The right angle at B is still where it was, so AC is still the hypotenuse.",
            math: ["hypotenuse = AC", "unchanged"],
            prims: [...groundLine(5.2),
                    ...rightTriangle3D({ adj: 3.2, opp: 2.4, at: "C",
                                         lit: ["hyp", "opp", "adj"] })],
          },
          {
            caption: "Two names swapped, one stayed. That is the whole rule — and it is why sin C works out equal to cos A.",
            math: ["sin C = AB / AC", "cos A = AB / AC", "so sin C = cos A"],
            answer: "2 swap · 1 stays",
            prims: [...groundLine(5.2),
                    ...rightTriangle3D({ adj: 3.2, opp: 2.4, at: "C",
                                         lit: ["hyp", "opp", "adj"] })],
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
            ref: "NCERT Ex 8.1 · Q1",
            title: "sin A, cos A and then sin C, cos C",
            body: (
              <>
        <Explainer3D
          guided
          height={430}
          steps={[
            {
              caption: "QUESTION — NCERT Exercise 8.1, Q1: In triangle ABC, right-angled at B, AB = 24 cm and BC = 7 cm. Find (i) sin A and cos A, (ii) sin C and cos C.",
              math: ["given:", "AB = 24, BC = 7", "find: A's pair", "and C's pair"],
              prims: [...groundLine(5.2),
                      ...rightTriangle3D({ adj: 3.4, opp: 1.0,
                                           sides: { ab: "24", bc: "7", ac: "?" } })],
            },
            {
              caption: "APPROACH — the two parts use the SAME triangle from two different corners. Find the third side once, then name the roles separately for A and for C.",
              math: ["1. third side", "2. roles from A", "3. roles from C"],
              prims: [...groundLine(5.2),
                      ...rightTriangle3D({ adj: 3.4, opp: 1.0,
                                           sides: { ab: "24", bc: "7", ac: "?" } })],
            },
            {
              caption: "Third side first, by Pythagoras.",
              math: ["AC² = 24² + 7² = 625", "AC = 25 cm"],
              prims: [...groundLine(5.2),
                      ...rightTriangle3D({ adj: 3.4, opp: 1.0, lit: ["hyp"],
                                           sides: { ab: "24", bc: "7", ac: "25" } })],
            },
            {
              caption: "Part (i), from angle A. Opposite is BC = 7, adjacent is AB = 24.",
              math: ["sin A = 7 / 25", "cos A = 24 / 25"],
              prims: [...groundLine(5.2),
                      ...rightTriangle3D({ adj: 3.4, opp: 1.0, at: "A",
                                           lit: ["hyp", "opp", "adj"],
                                           sides: { ab: "24", bc: "7", ac: "25" } })],
            },
            {
              caption: "Part (ii) moves to angle C. Do not carry the old names over — start again from the new corner.",
              math: ["from C ..."],
              prims: [...groundLine(5.2),
                      ...rightTriangle3D({ adj: 3.4, opp: 1.0, at: "C", lit: ["hyp"],
                                           sides: { ab: "24", bc: "7", ac: "25" } })],
            },
            {
              caption: "From C the roles swap: AB = 24 is now opposite, and CB = 7 is now adjacent.",
              math: ["opposite  AB = 24", "adjacent  BC = 7", "hypotenuse  25"],
              prims: [...groundLine(5.2),
                      ...rightTriangle3D({ adj: 3.4, opp: 1.0, at: "C",
                                           lit: ["hyp", "opp", "adj"],
                                           sides: { ab: "24", bc: "7", ac: "25" } })],
            },
            {
              caption: "So sin C = 24/25 and cos C = 7/25 — which are exactly cos A and sin A, crossed over.",
              math: ["sin C = 24 / 25", "cos C = 7 / 25", "sin C = cos A ✓"],
              answer: "sin C = 24/25 · cos C = 7/25",
              prims: [...groundLine(5.2),
                      ...rightTriangle3D({ adj: 3.4, opp: 1.0, at: "C",
                                           lit: ["hyp", "opp", "adj"],
                                           sides: { ab: "24", bc: "7", ac: "25" } })],
            },
          ]}
        />
              </>
            ),
          },
          {
            ref: "NCERT Ex 8.1 · Q2",
            title: "tan P − cot R",
            body: (
              <>
        <Explainer3D
          guided
          height={430}
          steps={[
            {
              caption: "QUESTION — NCERT Exercise 8.1, Q2: In triangle PQR, right-angled at Q, PQ = 12 cm and PR = 13 cm. Find tan P minus cot R.",
              math: ["given:", "PQ = 12, PR = 13", "find: tan P − cot R"],
              prims: [...groundLine(5.2),
                      ...rightTriangle3D({ adj: 3.2, opp: 1.35, labels: false,
                                           sides: { ab: "12", bc: "5", ac: "13" } })],
            },
            {
              caption: "APPROACH — build each ratio separately from its own corner, then subtract. Do not assume they differ just because the names look different.",
              math: ["1. third side", "2. tan P from P", "3. cot R from R", "4. subtract"],
              prims: [...groundLine(5.2),
                      ...rightTriangle3D({ adj: 3.2, opp: 1.35, labels: false,
                                           sides: { ab: "12", bc: "5", ac: "13" } })],
            },
            {
              caption: "Third side first — this time subtract, because we were given the hypotenuse.",
              math: ["QR² = 13² − 12²", "QR² = 169 − 144 = 25", "QR = 5 cm"],
              prims: [...groundLine(5.2),
                      ...rightTriangle3D({ adj: 3.2, opp: 1.35, labels: false, lit: ["hyp"],
                                           sides: { ab: "12", bc: "5", ac: "13" } })],
            },
            {
              caption: "tan P wants opposite over adjacent, read from corner P.",
              math: ["opposite P = QR = 5", "adjacent P = PQ = 12", "tan P = 5 / 12"],
              prims: [...groundLine(5.2),
                      ...rightTriangle3D({ adj: 3.2, opp: 1.35, at: "A", labels: false,
                                           lit: ["opp", "adj"],
                                           sides: { ab: "12", bc: "5", ac: "13" } })],
            },
            {
              caption: "Now cot R. Cotangent is adjacent over opposite — the other way up from tan.",
              math: ["cot = adj / opp"],
              prims: [...groundLine(5.2),
                      ...rightTriangle3D({ adj: 3.2, opp: 1.35, at: "C", labels: false,
                                           lit: ["opp", "adj"],
                                           sides: { ab: "12", bc: "5", ac: "13" } })],
            },
            {
              caption: "From corner R the sides have swapped: QR is now adjacent and PQ is now opposite.",
              math: ["adjacent R = QR = 5", "opposite R = PQ = 12", "cot R = 5 / 12"],
              prims: [...groundLine(5.2),
                      ...rightTriangle3D({ adj: 3.2, opp: 1.35, at: "C", labels: false,
                                           lit: ["opp", "adj"],
                                           sides: { ab: "12", bc: "5", ac: "13" } })],
            },
            {
              caption: "The same fraction, from a different corner and a different ratio. Two swaps and one flip cancel exactly.",
              math: ["tan P − cot R", "= 5/12 − 5/12"],
              answer: "tan P − cot R = 0",
              prims: [...groundLine(5.2),
                      ...rightTriangle3D({ adj: 3.2, opp: 1.35, labels: false,
                                           lit: ["opp", "adj"],
                                           sides: { ab: "12", bc: "5", ac: "13" } })],
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
        questions={SWAP_QUESTIONS}
        skill="swap"
        title="Choose an answer for each"
      />
    </div>
  );
}

/* ═══ 8.2c — The three ratios · SOH CAH TOA ═══════════════════════════════ */

const RATIOS_HINTS: LessonHints = {
  title: "The three ratios",
  prompt: "SOH · CAH · TOA, and what each letter is asking for.",
  steps: [
    {
      label: "Gentle nudge",
      title: "Write the fraction before you look for numbers",
      body: "Decide what the ratio wants first — sin wants opposite over hypotenuse " +
            "— and only then go and find those two sides. Doing it the other way " +
            "round is how sides end up in the wrong place.",
    },
    {
      label: "Worked example",
      title: "Reading the three ratios off a figure",
      body: "In △ABC right-angled at B, working from angle A: opposite is BC, " +
            "adjacent is AB, hypotenuse is AC. Now just fill the three templates in.",
      example: "sin A = BC/AC · cos A = AB/AC · tan A = BC/AB",
    },
    {
      label: "Rule",
      title: "SOH CAH TOA, plus one bonus",
      body: "Sin = Opp/Hyp, Cos = Adj/Hyp, Tan = Opp/Adj. And because the " +
            "hypotenuse cancels when you divide the first by the second, " +
            "tan A = sin A / cos A always.",
    },
  ],
};

export function TopicRatios({ onAnswer, onMistake, playTone, onComplete }: PanelProps) {
  return (
    <div className={styles.topicPanel}>
      <SectionHeading kicker="Section 1 of 3" title="Recap" />
      <Explainer3D
        height={430}
        steps={[
          {
            caption:
              "Every side already has a name. A ratio is just two of those names written as a fraction — and only three of them are worth naming.",
            math: ["opposite", "adjacent", "hypotenuse"],
            prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3.2,"opp":2.4,"at":"A","lit":["opp","adj","hyp"]})],
          },
          {
            caption:
              "SOH — sine takes the side OPPOSITE the angle and puts the HYPOTENUSE underneath.",
            math: ["sin A = opp / hyp", "= BC / AC"],
            prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3.2,"opp":2.4,"at":"A","lit":["opp","hyp"]})],
          },
          {
            caption:
              "CAH — cosine swaps the opposite side for the ADJACENT one. The hypotenuse stays underneath.",
            math: ["cos A = adj / hyp", "= AB / AC"],
            prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3.2,"opp":2.4,"at":"A","lit":["adj","hyp"]})],
          },
          {
            caption:
              "TOA — tangent leaves the hypotenuse out of it completely. Opposite over adjacent, nothing else.",
            math: ["tan A = opp / adj", "= BC / AB"],
            prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3.2,"opp":2.4,"at":"A","lit":["opp","adj"]})],
          },
          {
            caption:
              "Now watch what happens if you divide sine by cosine. Both of them carry the hypotenuse underneath.",
            math: ["sin A ÷ cos A", "= (BC/AC) ÷ (AB/AC)", "= (BC/AC) × (AC/AB)"],
            prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3.2,"opp":2.4,"at":"A","lit":["opp","adj","hyp"]})],
          },
          {
            caption:
              "The hypotenuse cancels top and bottom, and what survives is opposite over adjacent — which is exactly tan A. That is one fewer thing to memorise.",
            math: ["= BC / AB", "= tan A"],
            answer: "tan A = sin A / cos A",
            prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3.2,"opp":2.4,"at":"A","lit":["opp","adj"]})],
          },
          {
            caption:
              "One notation warning that costs marks every year: sin A is ONE symbol, not sin multiplied by A. And sin²A means (sin A)² — find the number first, then square it.",
            math: ["sin A ≠ sin × A", "sin²A = (sin A)²"],
            prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3.2,"opp":2.4,"at":"A","lit":["opp","hyp"]})],
          },
        ]}
      />

      <SectionHeading kicker="Section 2 of 3" title="Solved Examples" />
      <SolvedExamples
        examples={[
          {
            ref: "NCERT Ex 8.1 · Q1(i)",
            title: "Find sin A and cos A when AB = 24 cm, BC = 7 cm",
            body: (
              <Explainer3D
                guided
                height={400}
                steps={[
                  {
                    caption:
                      "READ & TRANSLATE — △ABC is right-angled at B, with AB = 24 cm and BC = 7 cm. The question wants two ratios of angle A, so both need a hypotenuse.",
                    math: ["right angle at B", "AB = 24, BC = 7", "find sin A, cos A"],
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3.2,"opp":1,"at":"A","sides":{"ab":"24","bc":"7","ac":"?"}})],
                  },
                  {
                    caption:
                      "CHOOSE THE PATTERN — SOH and CAH both need the hypotenuse AC, and AC is not given. So Pythagoras comes first, then the ratios.",
                    math: ["1. Pythagoras → AC", "2. sin A = opp/hyp", "3. cos A = adj/hyp"],
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3.2,"opp":1,"at":"A","lit":["hyp"],"sides":{"ab":"24","bc":"7","ac":"?"}})],
                  },
                  {
                    caption:
                      "SUBSTITUTE — the two legs are 24 and 7, and the hypotenuse faces the right angle at B.",
                    math: ["AC² = AB² + BC²", "AC² = 24² + 7²"],
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3.2,"opp":1,"at":"A","lit":["hyp"],"sides":{"ab":"24","bc":"7","ac":"?"}})],
                  },
                  {
                    caption:
                      "CALCULATE, LINE 1 — square each leg and add, then take the positive square root.",
                    math: ["= 576 + 49", "= 625", "AC = √625 = 25"],
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3.2,"opp":1,"at":"A","lit":["hyp"],"sides":{"ab":"24","bc":"7","ac":"25"}})],
                  },
                  {
                    caption:
                      "CALCULATE, LINE 2 — now read the ratios off angle A. Opposite A is BC = 7; adjacent to A is AB = 24.",
                    math: ["sin A = BC/AC = 7/25", "cos A = AB/AC = 24/25"],
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3.2,"opp":1,"at":"A","lit":["opp","hyp"],"sides":{"ab":"24","bc":"7","ac":"25"}})],
                  },
                  {
                    caption:
                      "SANITY CHECK — both answers must be below 1, because the hypotenuse is the longest side. They are. And 7² + 24² = 625 = 25² confirms the triangle closes.",
                    math: ["7/25 < 1 ✓", "24/25 < 1 ✓", "49 + 576 = 625 ✓"],
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3.2,"opp":1,"at":"A","lit":["opp","adj","hyp"],"sides":{"ab":"24","bc":"7","ac":"25"}})],
                  },
                  {
                    caption: "FINAL ANSWER — sin A = 7/25 and cos A = 24/25.",
                    math: ["sin A = 7/25", "cos A = 24/25"],
                    answer: "sin A = 7/25 · cos A = 24/25",
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3.2,"opp":1,"at":"A","lit":["opp","adj","hyp"],"sides":{"ab":"24","bc":"7","ac":"25"}})],
                  },
                ]}
              />
            ),
          },
          {
            ref: "Practice · all three ratios",
            title: "Hypotenuse 13 cm, adjacent 5 cm — find sin θ, cos θ, tan θ",
            body: (
              <Explainer3D
                guided
                height={400}
                steps={[
                  {
                    caption:
                      "READ & TRANSLATE — you are given the hypotenuse and the side adjacent to θ. All three ratios are wanted, so the missing opposite side has to be found first.",
                    math: ["hyp = 13", "adj = 5", "opp = ?"],
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":2.6,"opp":3.1,"at":"A","sides":{"ab":"5","bc":"?","ac":"13"}})],
                  },
                  {
                    caption:
                      "CHOOSE THE PATTERN — cos θ is available immediately from CAH, but sine and tangent both need the opposite side. Pythagoras supplies it.",
                    math: ["cos θ = adj/hyp now", "opp from Pythagoras", "then sin and tan"],
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":2.6,"opp":3.1,"at":"A","lit":["adj","hyp"],"sides":{"ab":"5","bc":"?","ac":"13"}})],
                  },
                  {
                    caption:
                      "SUBSTITUTE — rearrange Pythagoras to make the unknown leg the subject.",
                    math: ["opp² = hyp² − adj²", "opp² = 13² − 5²"],
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":2.6,"opp":3.1,"at":"A","lit":["hyp"],"sides":{"ab":"5","bc":"?","ac":"13"}})],
                  },
                  {
                    caption: "CALCULATE, LINE 1 — subtract, then take the positive root.",
                    math: ["= 169 − 25", "= 144", "opp = 12"],
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":2.6,"opp":3.1,"at":"A","lit":["opp"],"sides":{"ab":"5","bc":"12","ac":"13"}})],
                  },
                  {
                    caption:
                      "CALCULATE, LINE 2 — with all three sides known, read each ratio straight off SOH CAH TOA.",
                    math: ["sin θ = 12/13", "cos θ = 5/13", "tan θ = 12/5"],
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":2.6,"opp":3.1,"at":"A","lit":["opp","adj","hyp"],"sides":{"ab":"5","bc":"12","ac":"13"}})],
                  },
                  {
                    caption:
                      "SANITY CHECK — sine and cosine are both under 1, as they must be. Tangent is above 1, which is allowed because it never involves the hypotenuse. And 5-12-13 is a genuine Pythagorean triple.",
                    math: ["25 + 144 = 169 ✓", "sin, cos < 1 ✓", "tan may exceed 1 ✓"],
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":2.6,"opp":3.1,"at":"A","lit":["opp","adj","hyp"],"sides":{"ab":"5","bc":"12","ac":"13"}})],
                  },
                  {
                    caption: "FINAL ANSWER — sin θ = 12/13, cos θ = 5/13, tan θ = 12/5.",
                    math: ["sin θ = 12/13", "cos θ = 5/13", "tan θ = 12/5"],
                    answer: "12/13 · 5/13 · 12/5",
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":2.6,"opp":3.1,"at":"A","lit":["opp","adj","hyp"],"sides":{"ab":"5","bc":"12","ac":"13"}})],
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
        questions={RATIOS_QUESTIONS}
        skill="ratios"
        title="Now you build the ratios"
      />
    </div>
  );
}

/* ═══ 8.2d — Why size never changes a ratio ═══════════════════════════════ */

const SIZE_HINTS: LessonHints = {
  title: "Why size does not matter",
  prompt: "The similar-triangles argument that makes the whole chapter work.",
  steps: [
    {
      label: "Gentle nudge",
      title: "Two triangles, two matching angles",
      body: "The small triangle and the big one share angle A, and both contain a " +
            "right angle. Two matching angles is already enough — that is the AA " +
            "criterion from Chapter 6.",
    },
    {
      label: "Worked example",
      title: "What similarity buys you",
      body: "Similar triangles have proportional sides: AM/AB = AP/AC = MP/BC. " +
            "Rearrange any two of those and you get MP/AP = BC/AC — the small " +
            "triangle's sine of A equals the big one's.",
      example: "MP/AP = BC/AC = sin A",
    },
    {
      label: "Rule",
      title: "The rule to carry",
      body: "The trigonometric ratios of an angle do not depend on the size of the " +
            "triangle you measure them in. That is exactly why 'sin 30°' can be " +
            "written with no triangle mentioned at all.",
    },
  ],
};

export function TopicSize({ onAnswer, onMistake, playTone, onComplete }: PanelProps) {
  return (
    <div className={styles.topicPanel}>
      <SectionHeading kicker="Section 1 of 3" title="Recap" />
      <Explainer3D
        height={430}
        steps={[
          {
            caption:
              "Here is the question this whole chapter rests on: if you redraw the triangle bigger, does sin A change?",
            math: ["same angle A", "bigger triangle", "same sin A?"],
            prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3.2,"opp":2.4,"at":"A","lit":["opp","hyp"]})],
          },
          {
            caption:
              "Take a smaller right triangle sharing the very same angle A. Both contain a right angle, and both contain A.",
            math: ["shared angle A", "both right-angled"],
            prims: [...groundLine(5.2), ...rightTriangle3D({"adj":1.7,"opp":1.28,"at":"A","lit":["opp","hyp"],"labels":false})],
          },
          {
            caption:
              "Two matching angles is already enough — that is the AA criterion from Chapter 6. The triangles are SIMILAR.",
            math: ["angle A = angle A", "90° = 90°", "⇒ similar by AA"],
            prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3.2,"opp":2.4,"at":"A","lit":["opp","hyp"]})],
          },
          {
            caption:
              "Similar triangles have proportional sides. Every side of the big triangle is the same multiple k of the matching small one.",
            math: ["big = k × small", "for every side"],
            prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3.2,"opp":2.4,"at":"A","lit":["opp","adj","hyp"]})],
          },
          {
            caption:
              "So write sin A in the big triangle and substitute. The k appears above AND below the line.",
            math: ["sin A = (k × opp) / (k × hyp)"],
            prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3.2,"opp":2.4,"at":"A","lit":["opp","hyp"]})],
          },
          {
            caption:
              "The k cancels. The ratio is identical in both triangles — and the same argument works for all six ratios.",
            math: ["= opp / hyp", "size cancels out"],
            answer: "the ratio depends on A alone",
            prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3.2,"opp":2.4,"at":"A","lit":["opp","hyp"]})],
          },
          {
            caption:
              "That is why 'sin 30°' can be written with no triangle mentioned anywhere. The angle alone fixes the number.",
            math: ["sin 30° = 1/2", "no triangle needed"],
            prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3.2,"opp":2.4,"at":"A","lit":["opp","hyp"]})],
          },
        ]}
      />

      <SectionHeading kicker="Section 2 of 3" title="Solved Examples" />
      <SolvedExamples
        examples={[
          {
            ref: "NCERT §8.2 · the similarity argument",
            title: "Show that a 3-4-5 and a 6-8-10 triangle give the same sin A",
            body: (
              <Explainer3D
                guided
                height={400}
                steps={[
                  {
                    caption:
                      "READ & TRANSLATE — two right triangles, one exactly double the other. Show the sine of the shared angle is the same number in both.",
                    math: ["small: 3, 4, 5", "big: 6, 8, 10"],
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":2.8,"opp":2.1,"at":"A","sides":{"ab":"4","bc":"3","ac":"5"}})],
                  },
                  {
                    caption:
                      "CHOOSE THE PATTERN — compute sin A separately in each triangle and compare. No identity is needed; this is definition and cancellation.",
                    math: ["sin A = opp / hyp", "compute twice, compare"],
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":2.8,"opp":2.1,"at":"A","lit":["opp","hyp"],"sides":{"ab":"4","bc":"3","ac":"5"}})],
                  },
                  {
                    caption:
                      "SUBSTITUTE — in the small triangle the side opposite A is 3 and the hypotenuse is 5.",
                    math: ["sin A = 3 / 5"],
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":2.8,"opp":2.1,"at":"A","lit":["opp","hyp"],"sides":{"ab":"4","bc":"3","ac":"5"}})],
                  },
                  {
                    caption:
                      "CALCULATE, LINE 1 — in the big triangle every length has doubled, so opposite is 6 and hypotenuse is 10.",
                    math: ["sin A = 6 / 10"],
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":2.8,"opp":2.1,"at":"A","lit":["opp","hyp"],"sides":{"ab":"8","bc":"6","ac":"10"}})],
                  },
                  {
                    caption:
                      "CALCULATE, LINE 2 — cancel the common factor 2 from the second fraction.",
                    math: ["6/10 = (2×3)/(2×5)", "= 3/5"],
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":2.8,"opp":2.1,"at":"A","lit":["opp","hyp"],"sides":{"ab":"8","bc":"6","ac":"10"}})],
                  },
                  {
                    caption:
                      "SANITY CHECK — both triangles satisfy Pythagoras, and the two sines agree exactly. The doubling factor cancelled, as similarity predicted.",
                    math: ["9 + 16 = 25 ✓", "36 + 64 = 100 ✓", "3/5 = 6/10 ✓"],
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":2.8,"opp":2.1,"at":"A","lit":["opp","adj","hyp"],"sides":{"ab":"8","bc":"6","ac":"10"}})],
                  },
                  {
                    caption:
                      "FINAL ANSWER — sin A = 3/5 in both. Scaling a triangle never changes a trigonometric ratio.",
                    math: ["sin A = 3/5 either way"],
                    answer: "size cancels — sin A = 3/5",
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":2.8,"opp":2.1,"at":"A","lit":["opp","hyp"],"sides":{"ab":"8","bc":"6","ac":"10"}})],
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
        questions={SIZE_QUESTIONS}
        skill="size"
        title="Check the argument landed"
      />
    </div>
  );
}

/* ═══ 8.2e — cosec, sec, cot ══════════════════════════════════════════════ */

const RECIP_HINTS: LessonHints = {
  title: "The other three ratios",
  prompt: "Nothing new — just the first three turned upside down.",
  steps: [
    {
      label: "Gentle nudge",
      title: "Flip, do not recalculate",
      body: "cosec, sec and cot are not new measurements. Work out sin, cos or tan " +
            "first, then turn the fraction over. If sin A = 3/5 then cosec A = 5/3.",
    },
    {
      label: "Worked example",
      title: "The criss-cross pairing",
      body: "The names are deliberately confusing, so learn the pairs rather than " +
            "guessing: sin pairs with COsec, cos pairs with sec, tan pairs with cot. " +
            "Note the crossover — the 'co' moves to the other side.",
      example: "sin ↔ cosec · cos ↔ sec · tan ↔ cot",
    },
    {
      label: "Rule",
      title: "The rule to carry",
      body: "cosec A = hyp/opp, sec A = hyp/adj, cot A = adj/opp. Because the " +
            "hypotenuse is the longest side, cosec and sec are always at least 1 — " +
            "a useful check.",
    },
  ],
};

export function TopicRecip({ onAnswer, onMistake, playTone, onComplete }: PanelProps) {
  return (
    <div className={styles.topicPanel}>
      <SectionHeading kicker="Section 1 of 3" title="Recap" />
      <Explainer3D
        height={430}
        steps={[
          {
            caption:
              "You already have three ratios. The other three are not new geography — they are the same three fractions turned upside down.",
            math: ["sin, cos, tan", "flip each one"],
            prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3.2,"opp":2.4,"at":"A","lit":["opp","adj","hyp"]})],
          },
          {
            caption:
              "Turn sine over and you get COSECANT. Hypotenuse on top, opposite underneath.",
            math: ["sin A = opp/hyp", "cosec A = hyp/opp"],
            prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3.2,"opp":2.4,"at":"A","lit":["opp","hyp"]})],
          },
          {
            caption: "Turn cosine over and you get SECANT.",
            math: ["cos A = adj/hyp", "sec A = hyp/adj"],
            prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3.2,"opp":2.4,"at":"A","lit":["adj","hyp"]})],
          },
          {
            caption: "Turn tangent over and you get COTANGENT.",
            math: ["tan A = opp/adj", "cot A = adj/opp"],
            prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3.2,"opp":2.4,"at":"A","lit":["opp","adj"]})],
          },
          {
            caption:
              "Watch the pairings — they are deliberately confusing. Cosecant flips SINE, not cosine. Secant flips COSINE, not sine.",
            math: ["sin ↔ cosec", "cos ↔ sec", "tan ↔ cot"],
            prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3.2,"opp":2.4,"at":"A","lit":["opp","adj","hyp"]})],
          },
          {
            caption:
              "Because each pair is a reciprocal, multiplying a pair always gives exactly 1.",
            math: ["sin A × cosec A = 1", "cos A × sec A = 1", "tan A × cot A = 1"],
            answer: "each pair multiplies to 1",
            prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3.2,"opp":2.4,"at":"A","lit":["opp","adj","hyp"]})],
          },
        ]}
      />

      <SectionHeading kicker="Section 2 of 3" title="Solved Examples" />
      <SolvedExamples
        examples={[
          {
            ref: "Practice · reciprocal ratios",
            title: "If sin θ = 8/17, find cosec θ, cos θ and sec θ",
            body: (
              <Explainer3D
                guided
                height={400}
                steps={[
                  {
                    caption:
                      "READ & TRANSLATE — one ratio is given. Its reciprocal needs no work at all; the other two need the third side.",
                    math: ["sin θ = 8/17", "find cosec θ, cos θ, sec θ"],
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3,"opp":1.6,"at":"A","sides":{"ab":"?","bc":"8","ac":"17"}})],
                  },
                  {
                    caption:
                      "CHOOSE THE PATTERN — cosec θ is just sin θ flipped. For cos θ you need the adjacent side, so Pythagoras.",
                    math: ["cosec θ = 1 / sin θ", "adjacent via Pythagoras", "sec θ = 1 / cos θ"],
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3,"opp":1.6,"at":"A","lit":["opp","hyp"],"sides":{"ab":"?","bc":"8","ac":"17"}})],
                  },
                  {
                    caption:
                      "SUBSTITUTE — sin θ = 8/17 means opposite = 8k and hypotenuse = 17k. Flip it for the cosecant.",
                    math: ["cosec θ = 17/8", "adj² = 17² − 8²"],
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3,"opp":1.6,"at":"A","lit":["hyp"],"sides":{"ab":"?","bc":"8","ac":"17"}})],
                  },
                  {
                    caption: "CALCULATE, LINE 1 — find the adjacent side.",
                    math: ["= 289 − 64", "= 225", "adj = 15"],
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3,"opp":1.6,"at":"A","lit":["adj"],"sides":{"ab":"15","bc":"8","ac":"17"}})],
                  },
                  {
                    caption: "CALCULATE, LINE 2 — now cosine, and its reciprocal.",
                    math: ["cos θ = 15/17", "sec θ = 17/15"],
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3,"opp":1.6,"at":"A","lit":["adj","hyp"],"sides":{"ab":"15","bc":"8","ac":"17"}})],
                  },
                  {
                    caption:
                      "SANITY CHECK — multiply each reciprocal pair and you must get 1. Also 8-15-17 satisfies Pythagoras.",
                    math: ["(8/17)(17/8) = 1 ✓", "(15/17)(17/15) = 1 ✓", "64 + 225 = 289 ✓"],
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3,"opp":1.6,"at":"A","lit":["opp","adj","hyp"],"sides":{"ab":"15","bc":"8","ac":"17"}})],
                  },
                  {
                    caption:
                      "FINAL ANSWER — cosec θ = 17/8, cos θ = 15/17 and sec θ = 17/15.",
                    math: ["cosec θ = 17/8", "cos θ = 15/17", "sec θ = 17/15"],
                    answer: "17/8 · 15/17 · 17/15",
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3,"opp":1.6,"at":"A","lit":["opp","adj","hyp"],"sides":{"ab":"15","bc":"8","ac":"17"}})],
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
        questions={RECIP_QUESTIONS}
        skill="recip"
        title="Now you flip them"
      />
    </div>
  );
}

/* ═══ 8.2f — Real numbers on a 3-4-5 triangle ═════════════════════════════ */

const NUMBERS_HINTS: LessonHints = {
  title: "Putting real numbers in",
  prompt: "The same three templates, now with lengths instead of letters.",
  steps: [
    {
      label: "Gentle nudge",
      title: "Name the sides before you divide",
      body: "Write down which number is opposite, which is adjacent and which is " +
            "the hypotenuse for the angle in the question. Only then fill in the " +
            "fraction. Most slips happen because a number went into the wrong slot.",
    },
    {
      label: "Worked example",
      title: "A 3-4-5 triangle, read from angle A",
      body: "Opposite A is 3, adjacent to A is 4, hypotenuse is 5. Now the three " +
            "templates fill themselves in, and the other three are just those " +
            "turned over.",
      example: "sin A = 3/5 · cos A = 4/5 · tan A = 3/4",
    },
    {
      label: "Rule",
      title: "Two checks before you move on",
      body: "The hypotenuse must be the largest number, and sine and cosine must " +
            "each come out less than 1. If either check fails, a side is in the " +
            "wrong place or the fraction is upside down.",
    },
  ],
};

export function TopicNumbers({ onAnswer, onMistake, playTone, onComplete }: PanelProps) {
  return (
    <div className={styles.topicPanel}>
      <SectionHeading kicker="Section 1 of 3" title="Recap" />
      <Explainer3D
        height={430}
        steps={[
          {
            caption:
              "Enough letters. Put real numbers on a triangle and every ratio becomes a fraction you can actually write down.",
            math: ["BC = 3", "AB = 4", "AC = 5"],
            prims: [...groundLine(5.2), ...rightTriangle3D({"adj":2.9,"opp":2.2,"at":"A","sides":{"ab":"4","bc":"3","ac":"5"}})],
          },
          {
            caption:
              "First check it really is right-angled: 3² + 4² must equal 5². It does, so the little square at B is honest.",
            math: ["9 + 16 = 25", "5² = 25 ✓"],
            prims: [...groundLine(5.2), ...rightTriangle3D({"adj":2.9,"opp":2.2,"at":"A","lit":["opp","adj"],"sides":{"ab":"4","bc":"3","ac":"5"}})],
          },
          {
            caption:
              "Work from angle A. Opposite A is BC = 3, adjacent to A is AB = 4, and the hypotenuse is AC = 5.",
            math: ["opp = 3", "adj = 4", "hyp = 5"],
            prims: [...groundLine(5.2), ...rightTriangle3D({"adj":2.9,"opp":2.2,"at":"A","lit":["opp","adj","hyp"],"sides":{"ab":"4","bc":"3","ac":"5"}})],
          },
          {
            caption: "Now the three main ratios are pure arithmetic.",
            math: ["sin A = 3/5", "cos A = 4/5", "tan A = 3/4"],
            prims: [...groundLine(5.2), ...rightTriangle3D({"adj":2.9,"opp":2.2,"at":"A","lit":["opp","hyp"],"sides":{"ab":"4","bc":"3","ac":"5"}})],
          },
          {
            caption: "Flip each one for the other three. No new measuring needed.",
            math: ["cosec A = 5/3", "sec A = 5/4", "cot A = 4/3"],
            prims: [...groundLine(5.2), ...rightTriangle3D({"adj":2.9,"opp":2.2,"at":"A","lit":["opp","adj","hyp"],"sides":{"ab":"4","bc":"3","ac":"5"}})],
          },
          {
            caption:
              "Now move to angle C and watch the swap. What was opposite is now adjacent — so sine and cosine trade values.",
            math: ["sin C = 4/5", "cos C = 3/5", "tan C = 4/3"],
            answer: "sin C = cos A, cos C = sin A",
            prims: [...groundLine(5.2), ...rightTriangle3D({"adj":2.9,"opp":2.2,"at":"C","lit":["opp","adj","hyp"],"sides":{"ab":"4","bc":"3","ac":"5"}})],
          },
        ]}
      />

      <SectionHeading kicker="Section 2 of 3" title="Solved Examples" />
      <SolvedExamples
        examples={[
          {
            ref: "Practice · all six on 3-4-5",
            title: "Write all six ratios of angle A on the 3-4-5 triangle",
            body: (
              <Explainer3D
                guided
                height={400}
                steps={[
                  {
                    caption:
                      "READ & TRANSLATE — all three sides are already known, so nothing has to be found. This is pure naming plus division.",
                    math: ["BC = 3, AB = 4, AC = 5", "find all six for A"],
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":2.9,"opp":2.2,"at":"A","sides":{"ab":"4","bc":"3","ac":"5"}})],
                  },
                  {
                    caption:
                      "CHOOSE THE PATTERN — SOH CAH TOA gives the first three, and flipping each gives the rest. Name the sides from angle A before writing anything.",
                    math: ["opp = BC = 3", "adj = AB = 4", "hyp = AC = 5"],
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":2.9,"opp":2.2,"at":"A","lit":["opp","adj","hyp"],"sides":{"ab":"4","bc":"3","ac":"5"}})],
                  },
                  {
                    caption: "SUBSTITUTE — put those three numbers into the three templates.",
                    math: ["sin A = 3/5", "cos A = 4/5", "tan A = 3/4"],
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":2.9,"opp":2.2,"at":"A","lit":["opp","hyp"],"sides":{"ab":"4","bc":"3","ac":"5"}})],
                  },
                  {
                    caption: "CALCULATE, LINE 1 — invert each fraction for the reciprocal three.",
                    math: ["cosec A = 5/3", "sec A = 5/4", "cot A = 4/3"],
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":2.9,"opp":2.2,"at":"A","lit":["opp","adj"],"sides":{"ab":"4","bc":"3","ac":"5"}})],
                  },
                  {
                    caption:
                      "CALCULATE, LINE 2 — a useful cross-check: tan A should equal sin A ÷ cos A.",
                    math: ["(3/5) ÷ (4/5)", "= (3/5) × (5/4)", "= 3/4 ✓"],
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":2.9,"opp":2.2,"at":"A","lit":["opp","adj"],"sides":{"ab":"4","bc":"3","ac":"5"}})],
                  },
                  {
                    caption:
                      "SANITY CHECK — sine and cosine are both under 1 because 5 is the longest side. The reciprocals are all above 1, exactly as they must be.",
                    math: ["3/5, 4/5 < 1 ✓", "5/3, 5/4 > 1 ✓"],
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":2.9,"opp":2.2,"at":"A","lit":["opp","adj","hyp"],"sides":{"ab":"4","bc":"3","ac":"5"}})],
                  },
                  {
                    caption: "FINAL ANSWER — all six ratios of angle A.",
                    math: ["sin 3/5 · cos 4/5 · tan 3/4", "cosec 5/3 · sec 5/4 · cot 4/3"],
                    answer: "3/5 · 4/5 · 3/4 · 5/3 · 5/4 · 4/3",
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":2.9,"opp":2.2,"at":"A","lit":["opp","adj","hyp"],"sides":{"ab":"4","bc":"3","ac":"5"}})],
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
        questions={NUMBERS_QUESTIONS}
        skill="numbers"
        title="Now you read them off"
      />
    </div>
  );
}

/* ═══ 8.2g — Know one ratio, find all six (the k-method) ══════════════════ */

const KMETHOD_HINTS: LessonHints = {
  title: "One ratio known ⇒ all six known",
  prompt: "The k-method: the recipe that turns any single ratio into the whole set.",
  steps: [
    {
      label: "Gentle nudge",
      title: "A ratio fixes a proportion, not two lengths",
      body: "sin A = 1/3 does not mean the opposite side is 1. It means opposite " +
            "and hypotenuse are in the ratio 1 : 3. Write them as k and 3k, and " +
            "keep the k — it will cancel later.",
    },
    {
      label: "Worked example",
      title: "NCERT Example 1 — given tan A = 4/3",
      body: "tan fixes opposite : adjacent, so put BC = 4k and AB = 3k. Pythagoras " +
            "gives AC² = 9k² + 16k² = 25k², so AC = 5k. Now read any ratio you like " +
            "off the triangle and the k cancels every time.",
      example: "sin A = 4k/5k = 4/5 · cos A = 3k/5k = 3/5",
    },
    {
      label: "Rule",
      title: "The four-step recipe",
      body: "1. Decide which side-pair the given ratio fixes. 2. Write them as " +
            "(number)·k. 3. Pythagoras for the third side. 4. Read off everything " +
            "else — k always cancels, which §8.2's similarity argument guarantees.",
    },
  ],
};

export function TopicKMethod({ onAnswer, onMistake, playTone, onComplete }: PanelProps) {
  return (
    <div className={styles.topicPanel}>
      <SectionHeading kicker="Section 1 of 3" title="Recap" />
      <Explainer3D
        height={430}
        steps={[
          {
            caption:
              "Exam questions rarely hand you a triangle. They hand you one ratio and expect all the others. Here is the method that always works.",
            math: ["given: one ratio", "wanted: the rest"],
            prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3,"opp":2.2,"at":"A","sides":{"ab":"?","bc":"?","ac":"?"}})],
          },
          {
            caption:
              "Say tan A = 3/4. That does NOT mean the sides are 3 and 4 — it means they are in the RATIO 3 to 4.",
            math: ["tan A = 3/4", "not lengths — a ratio"],
            prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3,"opp":2.2,"at":"A","lit":["opp","adj"],"sides":{"ab":"4k","bc":"3k","ac":"?"}})],
          },
          {
            caption:
              "So introduce a common factor k. Opposite = 3k, adjacent = 4k. Every triangle with this angle fits that description.",
            math: ["opp = 3k", "adj = 4k"],
            prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3,"opp":2.2,"at":"A","lit":["opp","adj"],"sides":{"ab":"4k","bc":"3k","ac":"?"}})],
          },
          {
            caption: "Pythagoras finds the hypotenuse, still carrying the k.",
            math: ["hyp² = (3k)² + (4k)²", "= 9k² + 16k² = 25k²", "hyp = 5k"],
            prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3,"opp":2.2,"at":"A","lit":["hyp"],"sides":{"ab":"4k","bc":"3k","ac":"5k"}})],
          },
          {
            caption:
              "Now every ratio has k on the top and k on the bottom — so it cancels every single time.",
            math: ["sin A = 3k/5k = 3/5", "cos A = 4k/5k = 4/5"],
            answer: "the k always cancels",
            prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3,"opp":2.2,"at":"A","lit":["opp","adj","hyp"],"sides":{"ab":"4k","bc":"3k","ac":"5k"}})],
          },
          {
            caption:
              "That is the whole trick: one ratio fixes the triangle up to scale, and scale never survives a ratio.",
            math: ["1 ratio ⇒ all 6"],
            prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3,"opp":2.2,"at":"A","lit":["opp","adj","hyp"],"sides":{"ab":"4k","bc":"3k","ac":"5k"}})],
          },
        ]}
      />

      <SectionHeading kicker="Section 2 of 3" title="Solved Examples" />
      <SolvedExamples
        examples={[
          {
            ref: "NCERT Ex 8.1 · Q3",
            title: "If sin A = 3/4, find cos A and tan A",
            body: (
              <Explainer3D
                guided
                height={400}
                steps={[
                  {
                    caption:
                      "READ & TRANSLATE — sine is opposite over hypotenuse, so 3 and 4 describe those two sides in ratio. The adjacent side is missing.",
                    math: ["sin A = 3/4", "find cos A, tan A"],
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":2.4,"opp":2.6,"at":"A","sides":{"ab":"?","bc":"3k","ac":"4k"}})],
                  },
                  {
                    caption:
                      "CHOOSE THE PATTERN — set opposite = 3k and hypotenuse = 4k, then use Pythagoras for the adjacent side.",
                    math: ["opp = 3k, hyp = 4k", "adj² = hyp² − opp²"],
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":2.4,"opp":2.6,"at":"A","lit":["opp","hyp"],"sides":{"ab":"?","bc":"3k","ac":"4k"}})],
                  },
                  {
                    caption: "SUBSTITUTE — put the two k-expressions into Pythagoras.",
                    math: ["adj² = (4k)² − (3k)²"],
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":2.4,"opp":2.6,"at":"A","lit":["hyp"],"sides":{"ab":"?","bc":"3k","ac":"4k"}})],
                  },
                  {
                    caption: "CALCULATE, LINE 1 — expand and simplify, then take the root.",
                    math: ["= 16k² − 9k²", "= 7k²", "adj = √7 k"],
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":2.4,"opp":2.6,"at":"A","lit":["adj"],"sides":{"ab":"√7k","bc":"3k","ac":"4k"}})],
                  },
                  {
                    caption: "CALCULATE, LINE 2 — read off cosine and tangent; the k cancels in both.",
                    math: ["cos A = √7k / 4k = √7/4", "tan A = 3k / √7k = 3/√7"],
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":2.4,"opp":2.6,"at":"A","lit":["opp","adj","hyp"],"sides":{"ab":"√7k","bc":"3k","ac":"4k"}})],
                  },
                  {
                    caption:
                      "SANITY CHECK — cos A must be below 1, and √7 ≈ 2.65 so √7/4 ≈ 0.66. Also check sin²A + cos²A = 9/16 + 7/16 = 1.",
                    math: ["√7/4 ≈ 0.66 < 1 ✓", "9/16 + 7/16 = 1 ✓"],
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":2.4,"opp":2.6,"at":"A","lit":["opp","adj","hyp"],"sides":{"ab":"√7k","bc":"3k","ac":"4k"}})],
                  },
                  {
                    caption: "FINAL ANSWER — cos A = √7/4 and tan A = 3/√7.",
                    math: ["cos A = √7/4", "tan A = 3/√7"],
                    answer: "cos A = √7/4 · tan A = 3/√7",
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":2.4,"opp":2.6,"at":"A","lit":["opp","adj","hyp"],"sides":{"ab":"√7k","bc":"3k","ac":"4k"}})],
                  },
                ]}
              />
            ),
          },
          {
            ref: "NCERT · Example 5",
            title: "△OPQ right-angled at P, OP = 7 cm, OQ − PQ = 1 cm — find sin Q",
            body: (
              <Explainer3D
                guided
                height={400}
                steps={[
                  {
                    caption:
                      "READ & TRANSLATE — you are given one side and the DIFFERENCE of the other two. That difference is the equation in disguise.",
                    math: ["OP = 7", "OQ − PQ = 1", "find sin Q"],
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3.1,"opp":1.4,"at":"C","sides":{"ab":"x","bc":"7","ac":"x+1"}})],
                  },
                  {
                    caption:
                      "CHOOSE THE PATTERN — name the unknown. Let PQ = x, so OQ = x + 1, then let Pythagoras produce an equation in x.",
                    math: ["PQ = x", "OQ = x + 1", "OQ² = OP² + PQ²"],
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3.1,"opp":1.4,"at":"C","lit":["hyp"],"sides":{"ab":"x","bc":"7","ac":"x+1"}})],
                  },
                  {
                    caption: "SUBSTITUTE — the right angle is at P, so OQ is the hypotenuse.",
                    math: ["(x + 1)² = 7² + x²"],
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3.1,"opp":1.4,"at":"C","lit":["hyp"],"sides":{"ab":"x","bc":"7","ac":"x+1"}})],
                  },
                  {
                    caption:
                      "CALCULATE, LINE 1 — expand the bracket. The x² terms appear on both sides and cancel, which is what makes this solvable.",
                    math: ["x² + 2x + 1 = 49 + x²", "2x + 1 = 49", "2x = 48"],
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3.1,"opp":1.4,"at":"C","lit":["hyp"],"sides":{"ab":"x","bc":"7","ac":"x+1"}})],
                  },
                  {
                    caption: "CALCULATE, LINE 2 — solve for x, then get both remaining sides.",
                    math: ["x = 24", "PQ = 24", "OQ = 25"],
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3.1,"opp":1.4,"at":"C","lit":["opp","adj","hyp"],"sides":{"ab":"24","bc":"7","ac":"25"}})],
                  },
                  {
                    caption:
                      "CALCULATE, LINE 3 — sin Q is opposite over hypotenuse. Opposite angle Q is OP = 7.",
                    math: ["sin Q = OP / OQ", "= 7 / 25"],
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3.1,"opp":1.4,"at":"C","lit":["opp","hyp"],"sides":{"ab":"24","bc":"7","ac":"25"}})],
                  },
                  {
                    caption:
                      "SANITY CHECK — 7² + 24² = 49 + 576 = 625 = 25², and 25 − 24 = 1 as the question stated. Both conditions hold.",
                    math: ["49 + 576 = 625 ✓", "25 − 24 = 1 ✓"],
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3.1,"opp":1.4,"at":"C","lit":["opp","adj","hyp"],"sides":{"ab":"24","bc":"7","ac":"25"}})],
                  },
                  {
                    caption: "FINAL ANSWER — sin Q = 7/25.",
                    math: ["sin Q = 7/25"],
                    answer: "sin Q = 7/25",
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3.1,"opp":1.4,"at":"C","lit":["opp","hyp"],"sides":{"ab":"24","bc":"7","ac":"25"}})],
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
        questions={KMETHOD_QUESTIONS}
        skill="kmethod"
        title="Now you run the recipe"
      />
    </div>
  );
}

/* ═══ 8.2h — How big can these ratios get? ════════════════════════════════ */

const LIMITS_HINTS: LessonHints = {
  title: "How big can a ratio be?",
  prompt: "One fact about the hypotenuse settles every question in this topic.",
  steps: [
    {
      label: "Gentle nudge",
      title: "The hypotenuse is the longest side",
      body: "Sine and cosine both have the hypotenuse underneath and a shorter side " +
            "on top. A smaller number divided by a bigger one is always less than 1.",
    },
    {
      label: "Worked example",
      title: "Testing a claim",
      body: "Is sin θ = 5/4 possible? Sine is opposite over hypotenuse, so 5/4 would " +
            "need the opposite side to be longer than the hypotenuse. In a right " +
            "triangle that cannot happen — so the claim is impossible.",
      example: "sin θ ≤ 1 and cos θ ≤ 1 · cosec θ ≥ 1 and sec θ ≥ 1",
    },
    {
      label: "Rule",
      title: "The rule to carry",
      body: "sin and cos never exceed 1. Their reciprocals cosec and sec are never " +
            "below 1. tan and cot have no limit at all — opposite ÷ adjacent " +
            "compares two legs, and either can be the longer one.",
    },
  ],
};

export function TopicLimits({ onAnswer, onMistake, playTone, onComplete }: PanelProps) {
  return (
    <div className={styles.topicPanel}>
      <SectionHeading kicker="Section 1 of 3" title="Recap" />
      <Explainer3D
        height={430}
        steps={[
          {
            caption:
              "Some answers are impossible before you check any arithmetic. Knowing which saves you in the exam.",
            math: ["which values are legal?"],
            prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3.2,"opp":2.4,"at":"A","lit":["opp","adj","hyp"]})],
          },
          {
            caption:
              "Start from the one fact that never changes: the hypotenuse faces the right angle and is the LONGEST side.",
            math: ["hyp > opp", "hyp > adj"],
            prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3.2,"opp":2.4,"at":"A","lit":["hyp"]})],
          },
          {
            caption:
              "Sine puts the opposite side over the hypotenuse — a smaller number over a bigger one. So sine can never reach 1.",
            math: ["sin A = opp / hyp", "0 < sin A < 1"],
            prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3.2,"opp":2.4,"at":"A","lit":["opp","hyp"]})],
          },
          {
            caption: "Cosine does the same with the adjacent side, so it is capped too.",
            math: ["cos A = adj / hyp", "0 < cos A < 1"],
            prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3.2,"opp":2.4,"at":"A","lit":["adj","hyp"]})],
          },
          {
            caption:
              "But tangent never touches the hypotenuse. It compares the two legs, and either one may be longer — so tangent has NO upper limit.",
            math: ["tan A = opp / adj", "tan A > 0, unbounded"],
            prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3.2,"opp":2.4,"at":"A","lit":["opp","adj"]})],
          },
          {
            caption:
              "Flip the capped ones and the inequality flips with them: cosec and sec are always at least 1.",
            math: ["cosec A ≥ 1", "sec A ≥ 1"],
            answer: "sin, cos ≤ 1 · cosec, sec ≥ 1 · tan free",
            prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3.2,"opp":2.4,"at":"A","lit":["opp","adj","hyp"]})],
          },
        ]}
      />

      <SectionHeading kicker="Section 2 of 3" title="Solved Examples" />
      <SolvedExamples
        examples={[
          {
            ref: "NCERT Ex 8.1 · Q11(i)",
            title: "True or false: the value of tan A is always less than 1",
            body: (
              <Explainer3D
                guided
                height={400}
                steps={[
                  {
                    caption:
                      "READ & TRANSLATE — the claim is that tan A can never reach 1. One counter-example is enough to destroy it.",
                    math: ["claim: tan A < 1 always"],
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3.2,"opp":2.4,"at":"A","lit":["opp","adj"]})],
                  },
                  {
                    caption:
                      "CHOOSE THE PATTERN — tan A = opposite/adjacent. Neither of those is the hypotenuse, so nothing forces one to be smaller.",
                    math: ["tan A = opp / adj", "no cap in the definition"],
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3.2,"opp":2.4,"at":"A","lit":["opp","adj"]})],
                  },
                  {
                    caption:
                      "SUBSTITUTE — take a 60° angle, where the opposite side is the longer leg.",
                    math: ["tan 60° = √3 / 1"],
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":1.9,"opp":3.3,"at":"A","lit":["opp","adj"],"sides":{"ab":"1","bc":"√3","ac":"2"}})],
                  },
                  {
                    caption: "CALCULATE — evaluate the root.",
                    math: ["√3 ≈ 1.732", "tan 60° ≈ 1.73 > 1"],
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":1.9,"opp":3.3,"at":"A","lit":["opp","adj"],"sides":{"ab":"1","bc":"√3","ac":"2"}})],
                  },
                  {
                    caption:
                      "SANITY CHECK — is this triangle legal? 1² + (√3)² = 1 + 3 = 4 = 2². Yes, and the hypotenuse 2 is still the longest side, so nothing is broken.",
                    math: ["1 + 3 = 4 = 2² ✓", "hyp 2 is longest ✓"],
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":1.9,"opp":3.3,"at":"A","lit":["opp","adj","hyp"],"sides":{"ab":"1","bc":"√3","ac":"2"}})],
                  },
                  {
                    caption:
                      "FINAL ANSWER — false. tan 60° = √3 ≈ 1.73, which is greater than 1. Only sine and cosine are capped.",
                    math: ["tan 60° = √3 > 1"],
                    answer: "FALSE — tan is unbounded",
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":1.9,"opp":3.3,"at":"A","lit":["opp","adj"],"sides":{"ab":"1","bc":"√3","ac":"2"}})],
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
        questions={LIMITS_QUESTIONS}
        skill="limits"
        title="Now you judge the claims"
      />
    </div>
  );
}

/* ═══ 8.2i — Three things to keep ═════════════════════════════════════════ */

const RECAP_HINTS: LessonHints = {
  title: "Everything §8.2 asks you to carry",
  prompt: "Three ideas, and the checks that catch most mistakes.",
  steps: [
    {
      label: "Gentle nudge",
      title: "Always say the whole phrase",
      body: "Not 'the opposite side' but 'the side opposite angle A'. Naming the " +
            "angle out loud prevents most of the errors in this section, because " +
            "the names only mean anything relative to an angle.",
    },
    {
      label: "Worked example",
      title: "NCERT Example 3 — the pattern to copy",
      body: "Third side by Pythagoras, then sort the three lengths into opposite, " +
            "adjacent and hypotenuse for the angle named, then build whatever the " +
            "question asks for. Same order every time.",
      example: "AC = √(29² − 21²) = 20, so sin θ = 20/29 and cos θ = 21/29",
    },
    {
      label: "Rule",
      title: "The three keepers",
      body: "1. The names depend on which angle you name from — only the hypotenuse " +
            "is fixed. 2. The ratios depend on the angle alone, never the size. " +
            "3. One ratio plus Pythagoras gives all six.",
    },
  ],
};

export function TopicRecap({ onAnswer, onMistake, playTone, onComplete }: PanelProps) {
  return (
    <div className={styles.topicPanel}>
      <SectionHeading kicker="Section 1 of 3" title="Recap" />
      <Explainer3D
        height={430}
        steps={[
          {
            caption:
              "Section 8.2 is finished. Strip it down and only three ideas actually need to survive into the exam.",
            math: ["three keepers"],
            prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3.2,"opp":2.4,"at":"A","lit":["opp","adj","hyp"]})],
          },
          {
            caption:
              "KEEPER ONE — the right angle names the hypotenuse. You choose the acute angle, and that choice names opposite and adjacent.",
            math: ["right angle ⇒ hypotenuse", "your angle ⇒ opp, adj"],
            prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3.2,"opp":2.4,"at":"A","lit":["hyp"]})],
          },
          {
            caption:
              "KEEPER TWO — six ratios, but really three plus their flips. SOH CAH TOA, then turn each one over.",
            math: ["sin ↔ cosec", "cos ↔ sec", "tan ↔ cot"],
            prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3.2,"opp":2.4,"at":"A","lit":["opp","adj","hyp"]})],
          },
          {
            caption:
              "KEEPER THREE — the value depends on the ANGLE alone. Scale the triangle and every common factor cancels.",
            math: ["k cancels", "ratio = f(angle)"],
            prims: [...groundLine(5.2), ...rightTriangle3D({"adj":1.7,"opp":1.28,"at":"A","lit":["opp","hyp"],"labels":false})],
          },
          {
            caption:
              "Two consequences worth remembering: swapping to the other acute angle swaps sine and cosine, and one known ratio unlocks all six.",
            math: ["sin A = cos C", "1 ratio ⇒ all 6"],
            answer: "name · flip · scale-free",
            prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3.2,"opp":2.4,"at":"C","lit":["opp","adj","hyp"]})],
          },
        ]}
      />

      <SectionHeading kicker="Section 2 of 3" title="Solved Examples" />
      <SolvedExamples
        examples={[
          {
            ref: "NCERT Ex 8.1 · Q2",
            title: "△PQR right-angled at Q, PQ = 12 cm, PR = 13 cm — find tan P − cot R",
            body: (
              <Explainer3D
                guided
                height={400}
                steps={[
                  {
                    caption:
                      "READ & TRANSLATE — two sides are given and the third is missing. The expression mixes an angle-P ratio with an angle-R ratio, so both must be named carefully.",
                    math: ["PQ = 12, PR = 13", "find tan P − cot R"],
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3.1,"opp":1.3,"at":"A","sides":{"ab":"12","bc":"?","ac":"13"}})],
                  },
                  {
                    caption:
                      "CHOOSE THE PATTERN — the right angle is at Q, so PR is the hypotenuse. Pythagoras gives QR, then name each ratio from its own angle.",
                    math: ["QR² = PR² − PQ²", "then tan P, then cot R"],
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3.1,"opp":1.3,"at":"A","lit":["hyp"],"sides":{"ab":"12","bc":"?","ac":"13"}})],
                  },
                  {
                    caption: "SUBSTITUTE — insert the two known lengths.",
                    math: ["QR² = 13² − 12²"],
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3.1,"opp":1.3,"at":"A","lit":["hyp"],"sides":{"ab":"12","bc":"?","ac":"13"}})],
                  },
                  {
                    caption: "CALCULATE, LINE 1 — find the third side.",
                    math: ["= 169 − 144", "= 25", "QR = 5"],
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3.1,"opp":1.3,"at":"A","lit":["opp"],"sides":{"ab":"12","bc":"5","ac":"13"}})],
                  },
                  {
                    caption:
                      "CALCULATE, LINE 2 — for angle P the opposite side is QR and the adjacent is PQ.",
                    math: ["tan P = QR / PQ", "= 5 / 12"],
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3.1,"opp":1.3,"at":"A","lit":["opp","adj"],"sides":{"ab":"12","bc":"5","ac":"13"}})],
                  },
                  {
                    caption:
                      "CALCULATE, LINE 3 — now switch to angle R. Cotangent is adjacent over opposite, and for R the adjacent side is QR while the opposite is PQ.",
                    math: ["cot R = QR / PQ", "= 5 / 12"],
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3.1,"opp":1.3,"at":"C","lit":["opp","adj"],"sides":{"ab":"12","bc":"5","ac":"13"}})],
                  },
                  {
                    caption:
                      "SANITY CHECK — the two expressions turned out identical, which is not luck: tan of one acute angle always equals cot of the other. Also 25 + 144 = 169 ✓.",
                    math: ["tan P = cot R always", "5² + 12² = 13² ✓"],
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3.1,"opp":1.3,"at":"C","lit":["opp","adj","hyp"],"sides":{"ab":"12","bc":"5","ac":"13"}})],
                  },
                  {
                    caption: "FINAL ANSWER — tan P − cot R = 5/12 − 5/12 = 0.",
                    math: ["5/12 − 5/12", "= 0"],
                    answer: "tan P − cot R = 0",
                    prims: [...groundLine(5.2), ...rightTriangle3D({"adj":3.1,"opp":1.3,"at":"C","lit":["opp","adj","hyp"],"sides":{"ab":"12","bc":"5","ac":"13"}})],
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
        questions={RECAP_QUESTIONS}
        skill="recap"
        title="Mixed practice — everything from §8.2"
      />
    </div>
  );
}

/* ── registry for the whole of §8.2 ──────────────────────────────────────── */

export const PANELS_8_2: Record<
  string,
  { hints: LessonHints; Panel: (p: PanelProps) => ReactNode }
> = {
  naming: { hints: NAMING_HINTS, Panel: TopicNaming },
  swap: { hints: SWAP_HINTS, Panel: TopicSwap },
  ratios: { hints: RATIOS_HINTS, Panel: TopicRatios },
  size: { hints: SIZE_HINTS, Panel: TopicSize },
  recip: { hints: RECIP_HINTS, Panel: TopicRecip },
  numbers: { hints: NUMBERS_HINTS, Panel: TopicNumbers },
  kmethod: { hints: KMETHOD_HINTS, Panel: TopicKMethod },
  limits: { hints: LIMITS_HINTS, Panel: TopicLimits },
  recap: { hints: RECAP_HINTS, Panel: TopicRecap },
};
