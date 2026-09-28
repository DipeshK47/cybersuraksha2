"use client";

/**
 * Sections 8.4 and 8.5 — trigonometric identities, proving them, and the
 * chapter summary.
 *
 * Same three-part shape as every other topic: Recap → Solved Examples →
 * Practice Questions.
 *
 * One difference from §8.1–§8.3: here the *algebra* is the figure. A proof has
 * nothing to draw, so each step is rendered as a centred column of working that
 * grows a line at a time. That keeps to the rule the rest of the chapter
 * follows — everything the student reads lives on the canvas, not in a
 * paragraph underneath it.
 *
 * Content is NCERT §8.4: Examples 9–12 (p.129–131) and Exercise 8.3 (p.131),
 * plus the book's own summary (p.132). The rationalised edition has no
 * complementary-angles section, so sin(90° − θ) = cos θ is deliberately absent.
 */

import {
  PracticeSet,
  type LessonHints,
} from "../../../../components/learning/LearningSupport";
import { type PanelProps } from "./scene-kit";
import {
  Explainer3D, HYP, INK, OPP, type Prim, SectionHeading, SolvedExamples,
  groundLine, rightTriangle3D,
} from "./iso3d";
import styles from "./chapter-lesson.module.css";

import {
  QIDENTITY,
  QPROVING,
  QSUMMARY,
} from "../../../../data/practice-bank";

/* ── the working column ───────────────────────────────────────────────────
   A proof is a stack of lines, each one following from the one above. Drawing
   it centred across the full canvas gives room for real algebra — the narrow
   maths box in the corner would wrap a line like
   "= (1 − sin A)(1 + sin A) / cos²A" into nonsense. */

const TOP = 1.9;
const STEP = 0.46;

/**
 * `lines` are drawn top to bottom. A line starting "!" is the one being
 * introduced on this step and is drawn in the accent colour; a line starting
 * "=" is ordinary working; "#" marks the finished result.
 */
function working(lines: string[]): Prim[] {
  return lines.map((raw, i) => {
    const flag = raw[0];
    const text = "!#".includes(flag) ? raw.slice(1) : raw;
    const fill = flag === "!" ? OPP : flag === "#" ? "#2e7d32" : INK;
    return {
      kind: "text",
      at: [0, 0, TOP - i * STEP],
      text,
      fill,
      size: flag === "#" ? 22 : 20,
    } satisfies Prim;
  });
}

/** A titled band above the working, for "LHS" / "given" style context. */
function banner(text: string, fill = HYP): Prim[] {
  return [{ kind: "text", at: [0, 0, TOP + 0.62], text, fill, size: 18 }];
}

/* ════════════════════ 8.4a — the three identities ════════════════════════ */

export function TopicIdentity({ onAnswer, onMistake, playTone, onComplete }: PanelProps) {
  return (
    <div className={styles.topicPanel}>
      <SectionHeading kicker="Section 1 of 3" title="Recap" />

      <Explainer3D
        height={430}
        steps={[
          {
            caption:
              "Think of an identity as a balance that stays level no matter where the angle slider moves. Predict: will sin A = 1/2 stay balanced for every angle, or only one?",
            math: ["PREDICT", "one angle or every angle?"],
            prims: [...groundLine(5.2),
                    ...rightTriangle3D({ adj: 3.2, opp: 2.2, at: "A" })],
          },
          {
            caption:
              "Reveal: sin A = 1/2 works only at particular angles. Our always-balanced machine starts instead from Pythagoras on a right triangle; the rest is division.",
            math: ["AB² + BC² = AC²"],
            prims: [...groundLine(5.2),
                    ...rightTriangle3D({ adj: 3.2, opp: 2.2, at: "A",
                                         lit: ["opp", "adj", "hyp"] })],
          },
          {
            caption:
              "Prediction checkpoint: divide every tray of the balance by AC². Which familiar ratios will AB/AC and BC/AC become?",
            math: ["÷ AC²", "AB/AC = cos A", "BC/AC = sin A"],
            prims: [...groundLine(5.2),
                    ...rightTriangle3D({ adj: 3.2, opp: 2.2, at: "A", lit: ["hyp"] })],
          },
          {
            caption:
              "That is the first identity, and the one you will use most often. It holds for every angle from 0° to 90°.",
            math: ["cos²A + sin²A = 1"],
            answer: "sin²A + cos²A = 1",
            prims: [...groundLine(5.2),
                    ...rightTriangle3D({ adj: 3.2, opp: 2.2, at: "A", lit: ["hyp"] })],
          },
          {
            caption:
              "Run the same balance through a different setting: divide every term by adjacent². Predict the pair whose denominator is adjacent — tan and sec.",
            math: ["÷ AB²", "BC/AB = tan A", "AC/AB = sec A"],
            prims: [...groundLine(5.2),
                    ...rightTriangle3D({ adj: 3.2, opp: 2.2, at: "A", lit: ["adj"] })],
          },
          {
            caption:
              "The second identity. It stops just short of 90°, because tan and sec do not exist there.",
            math: ["1 + tan²A = sec²A", "0° ≤ A < 90°"],
            answer: "1 + tan²A = sec²A",
            prims: [...groundLine(5.2),
                    ...rightTriangle3D({ adj: 3.2, opp: 2.2, at: "A", lit: ["adj"] })],
          },
          {
            caption:
              "One machine setting remains: divide every term by opposite². Before the labels appear, predict which ratios put opposite underneath.",
            math: ["÷ BC²", "AB/BC = cot A", "AC/BC = cosec A"],
            prims: [...groundLine(5.2),
                    ...rightTriangle3D({ adj: 3.2, opp: 2.2, at: "A", lit: ["opp"] })],
          },
          {
            caption:
              "The third identity, undefined at 0° for the same reason. Three identities, one theorem, three divisions — that is the whole of §8.4.",
            math: ["cot²A + 1 = cosec²A", "0° < A ≤ 90°"],
            answer: "one Pythagoras → three identities",
            prims: [...groundLine(5.2),
                    ...rightTriangle3D({ adj: 3.2, opp: 2.2, at: "A", lit: ["opp"] })],
          },
          {
            caption:
              "Learn the rearranged forms too — these are the shapes you will actually reach for mid-proof.",
            math: ["sin² = 1 − cos²", "tan² = sec² − 1", "cot² = cosec² − 1"],
            prims: [...groundLine(5.2),
                    ...rightTriangle3D({ adj: 3.2, opp: 2.2, at: "A" })],
          },
        ]}
      />

      <SectionHeading kicker="Section 2 of 3" title="Solved Examples" />

      <SolvedExamples
        examples={[
          {
            ref: "NCERT Example 9",
            title: "Express cos A, tan A and sec A using sin A",
            body: (
              <Explainer3D
                guided
                height={410}
                steps={[
                  {
                    caption:
                      "READ & TRANSLATE — NCERT Example 9 gives sin A as the only allowed building block. Rewrite cos A, tan A and sec A without any other trig ratio in the final forms.",
                    prims: [...banner("given: sin A"),
                            ...working(["!write every other ratio", "!using sin A alone"])],
                  },
                  {
                    caption:
                      "CHOOSE THE FORMULAS — identity 1 contains both sin and cos, so use it to isolate cos. Then use tan = sin/cos and sec = 1/cos because both depend on that cosine.",
                    prims: [...banner("plan"),
                            ...working(["= 1. cos A from identity 1",
                                        "= 2. tan A = sin A / cos A",
                                        "= 3. sec A = 1 / cos A"])],
                  },
                  {
                    caption:
                      "SUBSTITUTE THE IDENTITY — start with sin²A + cos²A = 1 and subtract sin²A from both sides, one line at a time.",
                    prims: [...banner("identity 1"),
                            ...working(["= sin²A + cos²A = 1",
                                        "!cos²A = 1 − sin²A"])],
                  },
                  {
                    caption:
                      "CALCULATE cos A — take the square root of the whole right side. A is acute, so cos A is positive and we keep the positive root.",
                    prims: [...banner("identity 1"),
                            ...working(["= sin²A + cos²A = 1",
                                        "= cos²A = 1 − sin²A",
                                        "#cos A = √(1 − sin²A)"])],
                  },
                  {
                    caption:
                      "SUBSTITUTE AND CALCULATE tan A — put the new expression for cos A into tan A = sin A/cos A.",
                    prims: [...banner("build tan A"),
                            ...working(["= tan A = sin A / cos A",
                                        "#tan A = sin A / √(1 − sin²A)"])],
                  },
                  {
                    caption:
                      "SUBSTITUTE AND CALCULATE sec A — put the same cosine expression into sec A = 1/cos A.",
                    prims: [...banner("build sec A"),
                            ...working(["= sec A = 1 / cos A",
                                        "#sec A = 1 / √(1 − sin²A)"])],
                  },
                  {
                    caption:
                      "SANITY CHECK — try A = 30°, where sin A = 1/2. The formulas return cos A = √3/2, tan A = 1/√3 and sec A = 2/√3, matching Table 8.1.",
                    prims: [...banner("check at A = 30°"),
                            ...working(["= √(1 − 1/4) = √3/2 ✓",
                                        "= (1/2)/(√3/2) = 1/√3 ✓",
                                        "= 1/(√3/2) = 2/√3 ✓"])],
                  },
                  {
                    caption: "FINAL ANSWER — all three ratios are now written only in terms of sin A.",
                    prims: [...banner("final forms"),
                            ...working(["#cos A = √(1 − sin²A)",
                                        "#tan A = sin A / √(1 − sin²A)",
                                        "#sec A = 1 / √(1 − sin²A)"])],
                    answer: "all three in terms of sin A",
                  },
                ]}
              />
            ),
          },
          {
            ref: "NCERT Ex 8.3 · Q3(i)",
            title: "9 sec²A − 9 tan²A",
            body: (
              <Explainer3D
                guided
                height={400}
                steps={[
                  {
                    caption:
                      "READ & TRANSLATE — NCERT Exercise 8.3, Q3(i) asks for one constant value. Both terms have factor 9, and the remaining squared ratios are sec and tan.",
                    prims: [...banner("evaluate"),
                            ...working(["!9 sec²A − 9 tan²A"])],
                  },
                  {
                    caption:
                      "CHOOSE THE PATTERN — factor instead of substituting an angle because sec²A − tan²A is identity 2 rearranged and is constant for every allowed A.",
                    prims: [...banner("plan"),
                            ...working(["= factor first,", "= then read the identity"])],
                  },
                  {
                    caption: "SUBSTITUTE THE COMMON FACTOR — write 9 outside one bracket, leaving sec²A − tan²A inside.",
                    prims: [...banner("factor"),
                            ...working(["= 9 sec²A − 9 tan²A",
                                        "!= 9(sec²A − tan²A)"])],
                  },
                  {
                    caption:
                      "CALCULATE, LINE 1 — rearrange 1 + tan²A = sec²A by subtracting tan²A, then replace the bracket with 1.",
                    prims: [...banner("identity 2"),
                            ...working(["= 1 + tan²A = sec²A",
                                        "!so sec²A − tan²A = 1"])],
                  },
                  {
                    caption:
                      "CALCULATE, LINE 2 — multiply the outside factor by the identity value.",
                    prims: [...banner("finish"),
                            ...working(["= 9 × 1", "#= 9"])],
                  },
                  {
                    caption:
                      "SANITY CHECK — use A = 45°: sec²45° = 2 and tan²45° = 1, so 9(2) − 9(1) = 18 − 9 = 9.",
                    prims: [...banner("check at A = 45°"),
                            ...working(["= 9(2) − 9(1)", "= 18 − 9", "#= 9 ✓"])],
                  },
                  {
                    caption: "FINAL ANSWER — option (B), 9.",
                    prims: [...banner("final answer"), ...working(["#9"])],
                    answer: "(B) 9",
                  },
                ]}
              />
            ),
          },
          {
            ref: "NCERT Ex 8.3 · Q3(iv)",
            title: "(1 + tan²A)/(1 + cot²A)",
            body: (
              <Explainer3D
                guided
                height={400}
                steps={[
                  {
                    caption:
                      "READ & TRANSLATE — NCERT Exercise 8.3, Q3(iv) asks which option equals a fraction whose numerator is 1 + tan²A and denominator is 1 + cot²A.",
                    prims: [...banner("evaluate"),
                            ...working(["!(1 + tan²A) ⁄ (1 + cot²A)"])],
                  },
                  {
                    caption:
                      "CHOOSE THE PATTERN — both complete brackets match identities: 1 + tan²A = sec²A and 1 + cot²A = cosec²A. Replacing whole patterns avoids long algebra.",
                    prims: [...banner("plan"),
                            ...working(["= 1. swap in the identities",
                                        "= 2. write as sin and cos",
                                        "= 3. simplify"])],
                  },
                  {
                    caption: "SUBSTITUTE THE IDENTITIES — replace the numerator and denominator as complete units.",
                    prims: [...banner("identities 2 and 3"),
                            ...working(["= 1 + tan²A = sec²A",
                                        "= 1 + cot²A = cosec²A",
                                        "!= sec²A ⁄ cosec²A"])],
                  },
                  {
                    caption: "SUBSTITUTE RECIPROCALS — sec²A = 1/cos²A and cosec²A = 1/sin²A.",
                    prims: [...banner("to sin and cos"),
                            ...working(["= sec²A = 1/cos²A",
                                        "= cosec²A = 1/sin²A",
                                        "!= (1/cos²A) ÷ (1/sin²A)"])],
                  },
                  {
                    caption:
                      "CALCULATE, ONE LINE AT A TIME — flip the divisor, cancel the 1s, and recognise sin²A/cos²A as tan²A.",
                    prims: [...banner("finish"),
                            ...working(["= sin²A ⁄ cos²A", "#= tan²A"])],
                  },
                  {
                    caption:
                      "SANITY CHECK — at A = 45°, tan²A = cot²A = 1. The original fraction is (1 + 1)/(1 + 1) = 1, matching tan²45°.",
                    prims: [...banner("check at A = 45°"),
                            ...working(["= (1 + 1)/(1 + 1)", "= 2/2 = 1", "= tan²45° ✓"])],
                  },
                  {
                    caption: "FINAL ANSWER — option (D), tan²A.",
                    prims: [...banner("final answer"), ...working(["#tan²A"])],
                    answer: "(D) tan²A",
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
        questions={QIDENTITY}
        skill="identity"
        title="Choose an answer for each"
      />
    </div>
  );
}

/* ═══════════════════ 8.4b — proving an identity ══════════════════════════ */

export function TopicProving({ onAnswer, onMistake, playTone, onComplete }: PanelProps) {
  return (
    <div className={styles.topicPanel}>
      <SectionHeading kicker="Section 1 of 3" title="Recap" />

      <Explainer3D
        height={430}
        steps={[
          {
            caption:
              "Put on a proof-detective hat: the left and right sides are two suspects claiming to be the same expression. Predict the fair test — change one suspect step-by-step, or secretly move evidence across the equals sign?",
            prims: [...banner("the rule"),
                    ...working(["!transform ONE side",
                                "!until it becomes the other",
                                "= never move terms across ="])],
          },
          {
            caption:
              "Reveal: transform one side only. Start with the messier suspect because it carries more clues to simplify; never move evidence across the equals sign.",
            prims: [...banner("step 1 — pick a side"),
                    ...working(["= usually the LHS",
                                "!more terms = more to cancel"])],
          },
          {
            caption:
              "Translation clue: if tan, cot, sec and cosec are all talking at once, convert them into the common language of sin and cos.",
            prims: [...banner("step 2 — one language"),
                    ...working(["= tan = sin/cos", "= cot = cos/sin",
                                "= sec = 1/cos", "= cosec = 1/sin"])],
          },
          {
            caption:
              "Prediction checkpoint: a common factor is hiding in both numerator and denominator. Expanding scatters the clue; factoring makes the matching pieces visible so they can cancel.",
            prims: [...banner("step 3 — factor first"),
                    ...working(["= look for a² − b²",
                                "= look for a³ − b³",
                                "!look for a shared factor"])],
          },
          {
            caption:
              "Rule four: combine fractions over a common denominator. The numerator that appears is very often 1, or sin² + cos².",
            prims: [...banner("step 4 — combine"),
                    ...working(["= add over one denominator",
                                "!watch for sin² + cos² = 1"])],
          },
          {
            caption:
              "Use the conjugate key: pair (1 + sin A) with (1 − sin A). Predict the product before revealing it — the middle terms vanish and identity 1 appears.",
            prims: [...banner("step 5 — conjugate"),
                    ...working(["= × (1 − sin A)/(1 − sin A)",
                                "= gives 1 − sin²A",
                                "#= cos²A"])],
          },
          {
            caption:
              "Rule six, for when a proof stalls: force an identity to appear. sec − tan and sec + tan multiply to 1, and so do cosec − cot and cosec + cot.",
            prims: [...banner("step 6 — force it"),
                    ...working(["= (sec − tan)(sec + tan) = 1",
                                "= (cosec − cot)(cosec + cot) = 1",
                                "!they are reciprocals"])],
            answer: "six moves cover every proof in the exercise",
          },
        ]}
      />

      <SectionHeading kicker="Section 2 of 3" title="Solved Examples" />

      <SolvedExamples
        examples={[
          {
            ref: "NCERT Example 10",
            title: "Prove sec A (1 − sin A)(sec A + tan A) = 1",
            body: (
              <Explainer3D
                guided
                height={420}
                steps={[
                  {
                    caption:
                      "READ & TRANSLATE — NCERT Example 10 asks us to prove a complicated left side equals the constant 1 for every allowed A. This is a proof, so we transform the LHS only.",
                    prims: [...banner("prove"),
                            ...working(["!sec A (1 − sin A)(sec A + tan A) = 1"])],
                  },
                  {
                    caption:
                      "CHOOSE THE FORMULAS — use sec A = 1/cos A and tan A = sin A/cos A because one common denominator will expose conjugates (1 − sin A)(1 + sin A).",
                    prims: [...banner("plan"),
                            ...working(["= work on the LHS only",
                                        "= convert to sin and cos",
                                        "= then look for a² − b²"])],
                  },
                  {
                    caption: "SUBSTITUTE — replace every sec and tan on the LHS with its sine-cosine form, without touching the RHS.",
                    prims: [...banner("LHS"),
                            ...working(["= sec A (1 − sin A)(sec A + tan A)",
                                        "!= (1/cos A)(1 − sin A)(1/cos A + sin A/cos A)"])],
                  },
                  {
                    caption:
                      "CALCULATE, LINE 1 — combine the last bracket over cos A, then multiply the two cosine denominators to get cos²A.",
                    prims: [...banner("LHS"),
                            ...working(["= (1/cos A)(1 − sin A) × (1 + sin A)/cos A",
                                        "!= (1 − sin A)(1 + sin A) / cos²A"])],
                  },
                  {
                    caption:
                      "CALCULATE, LINE 2 — multiply the conjugates. (1 − sin A)(1 + sin A) is 1 − sin²A because the middle terms cancel.",
                    prims: [...banner("LHS"),
                            ...working(["= (1 − sin A)(1 + sin A) / cos²A",
                                        "!= (1 − sin²A) / cos²A"])],
                  },
                  {
                    caption:
                      "CALCULATE, LINE 3 — substitute 1 − sin²A = cos²A, then cancel cos²A/cos²A.",
                    prims: [...banner("LHS"),
                            ...working(["= (1 − sin²A) / cos²A",
                                        "= cos²A / cos²A",
                                        "#= 1 = RHS"])],
                  },
                  {
                    caption:
                      "SANITY CHECK — at A = 30°, sec A = 2/√3, sin A = 1/2 and tan A = 1/√3. The original LHS becomes (2/√3)(1/2)(√3) = 1.",
                    prims: [...banner("check at A = 30°"),
                            ...working(["= (2/√3)(1/2)(2/√3 + 1/√3)",
                                        "= (2/√3)(1/2)(√3)", "#= 1 ✓"])],
                  },
                  {
                    caption: "FINAL ANSWER — the LHS simplifies to 1, exactly the RHS; hence the identity is proved.",
                    narrationSrc: "/audio/chapter8/8-4-046.mp3",
                    prims: [...banner("final statement"), ...working(["#LHS = 1 = RHS"])],
                    answer: "proved",
                  },
                ]}
              />
            ),
          },
          {
            ref: "NCERT Example 11",
            title: "Prove (cot A − cos A)/(cot A + cos A) = (cosec A − 1)/(cosec A + 1)",
            body: (
              <Explainer3D
                guided
                height={420}
                steps={[
                  {
                    caption:
                      "READ & TRANSLATE — NCERT Example 11 asks us to turn the cot-and-cos fraction on the LHS into the cosec fraction on the RHS, without moving terms across the equals sign.",
                    prims: [...banner("prove"),
                            ...working(["!(cot A − cos A) ⁄ (cot A + cos A)",
                                        "!= (cosec A − 1) ⁄ (cosec A + 1)"])],
                  },
                  {
                    caption:
                      "CHOOSE THE FORMULA — use cot A = cos A/sin A. That makes cos A a common factor in both numerator and denominator, so factoring will create a cancellation.",
                    prims: [...banner("plan"),
                            ...working(["= convert to sin and cos",
                                        "!then factor, do not expand"])],
                  },
                  {
                    caption: "SUBSTITUTE — replace each cot A with cos A/sin A on the LHS; keep numerator and denominator on separate lines.",
                    prims: [...banner("LHS"),
                            ...working(["!= (cos A/sin A − cos A)",
                                        "!   ⁄ (cos A/sin A + cos A)"])],
                  },
                  {
                    caption:
                      "CALCULATE, LINE 1 — factor cos A from the numerator and separately from the denominator.",
                    prims: [...banner("LHS"),
                            ...working(["= cos A(1/sin A − 1)",
                                        "=    ⁄ cos A(1/sin A + 1)"])],
                  },
                  {
                    caption:
                      "CALCULATE, LINE 2 — cancel the same non-zero factor cos A from top and bottom.",
                    prims: [...banner("LHS"),
                            ...working(["!= (1/sin A − 1) ⁄ (1/sin A + 1)"])],
                  },
                  {
                    caption:
                      "CALCULATE, LINE 3 — substitute 1/sin A = cosec A. The transformed LHS now matches the RHS symbol for symbol.",
                    prims: [...banner("LHS"),
                            ...working(["= (1/sin A − 1) ⁄ (1/sin A + 1)",
                                        "#= (cosec A − 1) ⁄ (cosec A + 1)"])],
                  },
                  {
                    caption:
                      "SANITY CHECK — at A = 45°, cot A = 1, cos A = 1/√2 and cosec A = √2. Both sides become (√2 − 1)/(√2 + 1).",
                    prims: [...banner("check at A = 45°"),
                            ...working(["= (1 − 1/√2)/(1 + 1/√2)",
                                        "= (√2 − 1)/(√2 + 1) ✓"])],
                  },
                  {
                    caption: "FINAL ANSWER — the LHS becomes the RHS exactly; hence the identity is proved.",
                    prims: [...banner("final statement"),
                            ...working(["#LHS = (cosec A − 1)/(cosec A + 1) = RHS"])],
                    answer: "proved",
                  },
                ]}
              />
            ),
          },
          {
            ref: "NCERT Ex 8.3 · Q4(i)",
            title: "Prove (cosec θ − cot θ)² = (1 − cos θ)/(1 + cos θ)",
            body: (
              <Explainer3D
                guided
                height={420}
                steps={[
                  {
                    caption:
                      "READ & TRANSLATE — NCERT Exercise 8.3, Q4(i) asks us to transform the squared cosec-cot expression on the LHS into the cosine fraction on the RHS.",
                    prims: [...banner("prove"),
                            ...working(["!(cosec θ − cot θ)²",
                                        "!= (1 − cos θ) ⁄ (1 + cos θ)"])],
                  },
                  {
                    caption:
                      "CHOOSE THE FORMULAS — start with the messier LHS, use cosec θ = 1/sin θ and cot θ = cos θ/sin θ, then use sin²θ = 1 − cos²θ so a factor can cancel.",
                    prims: [...banner("plan"),
                            ...working(["= start from the LHS",
                                        "= convert, square,",
                                        "= then factor the bottom"])],
                  },
                  {
                    caption:
                      "SUBSTITUTE — replace both ratios, combine their common denominator inside the bracket, and then square numerator and denominator.",
                    prims: [...banner("LHS"),
                            ...working(["= (1/sin θ − cos θ/sin θ)²",
                                        "!= (1 − cos θ)² ⁄ sin²θ"])],
                  },
                  {
                    caption:
                      "CALCULATE, LINE 1 — substitute sin²θ = 1 − cos²θ, then factor the difference of squares into (1 − cos θ)(1 + cos θ).",
                    prims: [...banner("LHS"),
                            ...working(["= (1 − cos θ)² ⁄ (1 − cos²θ)",
                                        "!= (1 − cos θ)² ⁄ [(1 − cos θ)(1 + cos θ)]"])],
                  },
                  {
                    caption:
                      "CALCULATE, LINE 2 — cancel one common factor (1 − cos θ). The remaining fraction matches the RHS.",
                    prims: [...banner("LHS"),
                            ...working(["#= (1 − cos θ) ⁄ (1 + cos θ)"])],
                  },
                  {
                    caption:
                      "SANITY CHECK — at θ = 60°, the LHS is (2/√3 − 1/√3)² = 1/3. The RHS is (1 − 1/2)/(1 + 1/2) = 1/3 too.",
                    prims: [...banner("check at θ = 60°"),
                            ...working(["= (1/√3)² = 1/3", "= (1/2)/(3/2) = 1/3 ✓"])],
                  },
                  {
                    caption: "FINAL ANSWER — the LHS simplifies exactly to the RHS; hence the identity is proved.",
                    prims: [...banner("final statement"),
                            ...working(["#LHS = (1 − cos θ)/(1 + cos θ) = RHS"])],
                    answer: "proved",
                  },
                ]}
              />
            ),
          },
          {
            ref: "NCERT Ex 8.3 · Q4(ii)",
            title: "Prove cos A/(1 + sin A) + (1 + sin A)/cos A = 2 sec A",
            body: (
              <Explainer3D
                guided
                height={420}
                steps={[
                  {
                    caption:
                      "READ & TRANSLATE — NCERT Exercise 8.3, Q4(ii) asks us to combine two fractions on the LHS until they become 2 sec A on the RHS.",
                    prims: [...banner("prove"),
                            ...working(["!cos A ⁄ (1 + sin A)",
                                        "!+ (1 + sin A) ⁄ cos A = 2 sec A"])],
                  },
                  {
                    caption:
                      "CHOOSE THE PATTERN — use the common denominator cos A(1 + sin A) because the LHS is a sum of fractions. Expanding only the numerator will expose sin²A + cos²A.",
                    prims: [...banner("plan"),
                            ...working(["= common denominator",
                                        "= cos A (1 + sin A)"])],
                  },
                  {
                    caption: "SUBSTITUTE THE COMMON DENOMINATOR — cross-multiply each numerator, keep one shared denominator, then expand (1 + sin A)² one line at a time.",
                    prims: [...banner("LHS"),
                            ...working(["= [cos²A + (1 + sin A)²]",
                                        "=    ⁄ [cos A (1 + sin A)]",
                                        "!top = cos²A + 1 + 2 sin A + sin²A"])],
                  },
                  {
                    caption:
                      "CALCULATE, LINE 1 — group cos²A + sin²A and substitute identity 1. Then factor 2 from 2 + 2 sin A.",
                    prims: [...banner("LHS"),
                            ...working(["= top = 1 + 1 + 2 sin A",
                                        "!top = 2(1 + sin A)"])],
                  },
                  {
                    caption:
                      "CALCULATE, LINE 2 — cancel (1 + sin A), then use 1/cos A = sec A.",
                    prims: [...banner("LHS"),
                            ...working(["= 2(1 + sin A) ⁄ [cos A (1 + sin A)]",
                                        "= 2 ⁄ cos A",
                                        "#= 2 sec A = RHS"])],
                  },
                  {
                    caption:
                      "SANITY CHECK — at A = 30°, the LHS is √3/3 + √3 = 4√3/3, while 2 sec 30° = 4/√3 = 4√3/3.",
                    prims: [...banner("check at A = 30°"),
                            ...working(["= √3/3 + √3 = 4√3/3", "= 2(2/√3) = 4√3/3 ✓"])],
                  },
                  {
                    caption: "FINAL ANSWER — the LHS becomes 2 sec A, exactly the RHS; hence the identity is proved.",
                    prims: [...banner("final statement"), ...working(["#LHS = 2 sec A = RHS"])],
                    answer: "proved",
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
        questions={QPROVING}
        skill="proving"
        title="Choose an answer for each"
      />
    </div>
  );
}

/* ══════════════════════ 8.5 — chapter summary ════════════════════════════ */

export function TopicSummary({ onAnswer, onMistake, playTone, onComplete }: PanelProps) {
  return (
    <div className={styles.topicPanel}>
      <SectionHeading kicker="Section 1 of 3" title="Recap" />

      <Explainer3D
        height={430}
        steps={[
          {
            caption:
              "Final-level map: imagine walking around a right-triangle theme park. Your viewing corner decides the side names. Predict which name never changes as you swap corners.",
            math: ["sin = opp/hyp", "cos = adj/hyp", "tan = opp/adj"],
            prims: [...groundLine(5.2),
                    ...rightTriangle3D({ adj: 3.2, opp: 2.2, at: "A",
                                         lit: ["opp", "adj", "hyp"] })],
          },
          {
            caption:
              "Reveal: the hypotenuse never changes because it always faces the right angle. The other three ratios are simply the first three cards flipped upside down.",
            math: ["cosec = 1/sin", "sec = 1/cos", "cot = 1/tan"],
            prims: [...groundLine(5.2),
                    ...rightTriangle3D({ adj: 3.2, opp: 2.2, at: "A", lit: ["hyp"] })],
          },
          {
            caption:
              "One clue unlocks the whole escape room: a ratio fixes the triangle's shape. Predict the next move after drawing two sides — Pythagoras reveals the third, then all six ratios follow.",
            prims: [...banner("one ⇒ six"),
                    ...working(["= draw the triangle from the ratio",
                                "= Pythagoras for the third side",
                                "!then read all six off"])],
          },
          {
            caption:
              "At the Table 8.1 checkpoint, use the pattern machine instead of brute memory: build sine, reverse it for cosine, then divide for tangent.",
            prims: [...banner("Table 8.1"),
                    ...working(["= sin:  0, 1/2, 1/√2, √3/2, 1",
                                "= cos:  the same row reversed",
                                "!tan = sin ÷ cos"])],
          },
          {
            caption:
              "There are firm limits on what these values can be. sin and cos are capped at 1; sec and cosec never drop below it.",
            prims: [...banner("the limits"),
                    ...working(["= sin A ≤ 1 and cos A ≤ 1",
                                "= sec A ≥ 1 and cosec A ≥ 1",
                                "!tan has no ceiling"])],
          },
          {
            caption:
              "And three identities, all of them Pythagoras divided by a different side.",
            prims: [...banner("the identities"),
                    ...working(["= sin²A + cos²A = 1",
                                "= 1 + tan²A = sec²A",
                                "= 1 + cot²A = cosec²A"])],
          },
          {
            caption:
              "Final proof-detective checkpoint: when algebra stalls, predict which conjugate pair multiplies to 1. These factored forms are the hidden shortcut to the exit.",
            prims: [...banner("factored gold"),
                    ...working(["= (sec − tan)(sec + tan) = 1",
                                "= (cosec − cot)(cosec + cot) = 1",
                                "#that is the whole chapter"])],
            answer: "chapter 8 complete",
          },
        ]}
      />

      <SectionHeading kicker="Section 2 of 3" title="Solved Examples" />

      <SolvedExamples
        examples={[
          {
            ref: "Mixed revision · 1",
            title: "Evaluate sin 30° cos 60° + cos 30° sin 60°",
            body: (
              <Explainer3D
                guided
                height={400}
                steps={[
                  {
                    caption:
                      "READ & TRANSLATE — evaluate one expression made of two products: sin 30° times cos 60°, plus cos 30° times sin 60°.",
                    prims: [...banner("evaluate"),
                            ...working(["!sin 30° cos 60° + cos 30° sin 60°"])],
                  },
                  {
                    caption:
                      "CHOOSE THE PATTERN — all angles are in Table 8.1, so use direct substitution. Keep the two products separate until each multiplication is complete.",
                    prims: [...banner("plan"),
                            ...working(["= 1. substitute", "= 2. multiply each pair",
                                        "= 3. add"])],
                  },
                  {
                    caption: "SUBSTITUTE AND CALCULATE, LINE 1 — sin 30° and cos 60° are both 1/2, so their product is 1/4.",
                    prims: [...banner("first product"),
                            ...working(["= sin 30° = 1/2, cos 60° = 1/2",
                                        "!= 1/4"])],
                  },
                  {
                    caption: "SUBSTITUTE AND CALCULATE, LINE 2 — cos 30° and sin 60° are both √3/2; multiply roots and denominators to get 3/4.",
                    prims: [...banner("second product"),
                            ...working(["= cos 30° = √3/2, sin 60° = √3/2",
                                        "!= 3/4"])],
                  },
                  {
                    caption: "CALCULATE, LINE 3 — add fractions with the same denominator: 1 + 3 over 4 equals 4/4, then 1.",
                    prims: [...banner("finish"),
                            ...working(["= 1/4 + 3/4", "#= 1"])],
                  },
                  {
                    caption:
                      "SANITY CHECK — both products are positive and below 1; 1/4 plus 3/4 makes exactly one whole, so the result is plausible.",
                    prims: [...banner("check"),
                            ...working(["= 0 < 1/4 < 1", "= 0 < 3/4 < 1", "#sum = 1 ✓"])],
                  },
                  {
                    caption: "FINAL ANSWER — the expression equals 1.",
                    prims: [...banner("final answer"), ...working(["#= 1"])],
                    answer: "= 1",
                  },
                ]}
              />
            ),
          },
          {
            ref: "Mixed revision · 2",
            title: "If 5 tan A = 12, find sin A + cos A",
            body: (
              <Explainer3D
                guided
                height={410}
                steps={[
                  {
                    caption:
                      "READ & TRANSLATE — 5 tan A = 12 gives one ratio for an acute angle. We need sin A + cos A, so first turn the tangent into a right triangle with known legs.",
                    math: ["5 tan A = 12", "find sin A + cos A"],
                    prims: [...groundLine(5.2),
                            ...rightTriangle3D({ adj: 2.4, opp: 2.9, at: "A",
                                                 sides: { ab: "5", bc: "12", ac: "?" } })],
                  },
                  {
                    caption:
                      "CHOOSE THE FORMULAS — use tan A = opposite/adjacent to choose the legs, Pythagoras for the hypotenuse, then sine and cosine because both use that hypotenuse.",
                    math: ["1. ratio → sides", "2. Pythagoras", "3. read off"],
                    prims: [...groundLine(5.2),
                            ...rightTriangle3D({ adj: 2.4, opp: 2.9, at: "A",
                                                 sides: { ab: "5", bc: "12", ac: "?" } })],
                  },
                  {
                    caption:
                      "SUBSTITUTE THE RATIO — divide 5 tan A = 12 by 5 to get tan A = 12/5. Model opposite = 12k and adjacent = 5k; take k = 1 for the simplest similar triangle.",
                    math: ["tan A = 12/5", "opposite = 12k", "adjacent = 5k", "choose k = 1"],
                    prims: [...groundLine(5.2),
                            ...rightTriangle3D({ adj: 2.4, opp: 2.9, at: "A",
                                                 lit: ["opp", "adj"],
                                                 sides: { ab: "5", bc: "12", ac: "?" } })],
                  },
                  {
                    caption: "CALCULATE, LINE 1 — use Pythagoras on legs 12 and 5: square, add, then take the positive square root.",
                    math: ["AC² = 144 + 25", "AC² = 169", "AC = 13"],
                    prims: [...groundLine(5.2),
                            ...rightTriangle3D({ adj: 2.4, opp: 2.9, at: "A", lit: ["hyp"],
                                                 sides: { ab: "5", bc: "12", ac: "13" } })],
                  },
                  {
                    caption:
                      "SUBSTITUTE, LINE 2 — read sine as opposite/hypotenuse and cosine as adjacent/hypotenuse from the completed 5-12-13 triangle.",
                    math: ["sin A = 12/13", "cos A = 5/13"],
                    prims: [...groundLine(5.2),
                            ...rightTriangle3D({ adj: 2.4, opp: 2.9, at: "A",
                                                 lit: ["opp", "adj", "hyp"],
                                                 sides: { ab: "5", bc: "12", ac: "13" } })],
                  },
                  {
                    caption: "CALCULATE, LINE 3 — the denominators match, so add the numerators 12 + 5.",
                    math: ["12/13 + 5/13", "= 17/13"],
                    prims: [...groundLine(5.2),
                            ...rightTriangle3D({ adj: 2.4, opp: 2.9, at: "A",
                                                 lit: ["opp", "adj", "hyp"],
                                                 sides: { ab: "5", bc: "12", ac: "13" } })],
                  },
                  {
                    caption:
                      "SANITY CHECK — sin A = 12/13 and cos A = 5/13 are each below 1, while their squares add to 144/169 + 25/169 = 1. The triangle and ratios are consistent.",
                    math: ["(12/13)² + (5/13)²", "= 169/169 = 1 ✓"],
                    prims: [...groundLine(5.2),
                            ...rightTriangle3D({ adj: 2.4, opp: 2.9, at: "A",
                                                 lit: ["opp", "adj", "hyp"],
                                                 sides: { ab: "5", bc: "12", ac: "13" } })],
                  },
                  {
                    caption: "FINAL ANSWER — sin A + cos A = 17/13.",
                    math: ["sin A + cos A = 17/13"],
                    answer: "sin A + cos A = 17/13",
                    prims: [...groundLine(5.2),
                            ...rightTriangle3D({ adj: 2.4, opp: 2.9, at: "A",
                                                 lit: ["opp", "adj", "hyp"],
                                                 sides: { ab: "5", bc: "12", ac: "13" } })],
                  },
                ]}
              />
            ),
          },
          {
            ref: "Mixed revision · 3",
            title: "Prove (1 − sin²θ) sec²θ = 1",
            body: (
              <Explainer3D
                guided
                height={400}
                steps={[
                  {
                    caption:
                      "READ & TRANSLATE — prove that the product (1 − sin²θ) sec²θ on the LHS equals the constant 1 for every allowed θ.",
                    prims: [...banner("prove"),
                            ...working(["!(1 − sin²θ) sec²θ = 1"])],
                  },
                  {
                    caption:
                      "CHOOSE THE FORMULAS — identity 1 gives 1 − sin²θ = cos²θ, and sec²θ = 1/cos²θ. Those two factors will cancel.",
                    prims: [...banner("plan"),
                            ...working(["= replace the bracket",
                                        "= then use sec = 1/cos"])],
                  },
                  {
                    caption: "SUBSTITUTE — replace the complete bracket 1 − sin²θ with cos²θ; leave sec²θ beside it.",
                    prims: [...banner("LHS"),
                            ...working(["= 1 − sin²θ = cos²θ",
                                        "!= cos²θ × sec²θ"])],
                  },
                  {
                    caption:
                      "CALCULATE — substitute sec²θ = 1/cos²θ, multiply, then cancel cos²θ from numerator and denominator.",
                    prims: [...banner("LHS"),
                            ...working(["= cos²θ × (1/cos²θ)",
                                        "#= 1 = RHS"])],
                  },
                  {
                    caption:
                      "SANITY CHECK — at θ = 60°, 1 − sin²60° = 1/4 and sec²60° = 4. Their product is 1/4 × 4 = 1.",
                    prims: [...banner("check at θ = 60°"),
                            ...working(["= (1 − 3/4) × 4", "= (1/4) × 4", "#= 1 ✓"])],
                  },
                  {
                    caption: "FINAL ANSWER — the LHS simplifies to 1, exactly the RHS; hence the identity is proved.",
                    narrationSrc: "/audio/chapter8/8-4-096.mp3",
                    prims: [...banner("final statement"), ...working(["#LHS = 1 = RHS"])],
                    answer: "proved",
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
        questions={QSUMMARY}
        skill="summary"
        title="Choose an answer for each"
      />
    </div>
  );
}

/* ── hint drawers ─────────────────────────────────────────────────────────
   Three rungs each. The middle rung always teaches through a *different*
   example than the one on screen. */

export const HINTS_IDENTITY: LessonHints = {
  title: "The three identities",
  prompt: "Not sure where these three formulas come from?",
  steps: [
    {
      label: "Gentle nudge",
      title: "There is only one fact here",
      body: "All three identities are Pythagoras. The only thing that changes is " +
            "which side you divide the whole equation by.",
      example: "AB² + BC² = AC², divided by AC², AB², then BC².",
    },
    {
      label: "Worked example",
      title: "A smaller version of the same idea",
      body: "Try it with real numbers. In a 3-4-5 triangle, divide 9 + 16 = 25 by " +
            "25 to get 9/25 + 16/25 = 1 — which is exactly cos² + sin² = 1 for " +
            "that triangle.",
      example: "(3/5)² + (4/5)² = 0.36 + 0.64 = 1.",
    },
    {
      label: "Rule",
      title: "The transferable idea",
      body: "Learn the rearranged forms as well as the originals. Mid-proof you " +
            "will want sin² = 1 − cos² far more often than the version with " +
            "everything on one side.",
    },
  ],
};

export const HINTS_PROVING: LessonHints = {
  title: "Proving an identity",
  prompt: "Stuck partway through a proof?",
  steps: [
    {
      label: "Gentle nudge",
      title: "Work one side only",
      body: "You are not solving for anything, so nothing may cross the equals " +
            "sign. Pick the messier side and keep rewriting it until it turns " +
            "into the other one.",
      example: "Moving a term across would assume the very thing you must prove.",
    },
    {
      label: "Worked example",
      title: "A smaller version of the same idea",
      body: "Prove tan θ · cos θ = sin θ. Convert the left side: (sin θ/cos θ) × " +
            "cos θ. The cos θ cancels and you are left with sin θ, which is the " +
            "right side. One side, three steps, done.",
      example: "Convert to sin and cos, then cancel — that is most proofs.",
    },
    {
      label: "Rule",
      title: "The transferable idea",
      body: "Factor before you expand, and combine fractions over one " +
            "denominator. If a proof stalls, force sec² − tan² = 1 or " +
            "cosec² − cot² = 1 to appear.",
    },
  ],
};

export const HINTS_SUMMARY: LessonHints = {
  title: "Chapter summary",
  prompt: "Want the whole chapter on one page?",
  steps: [
    {
      label: "Gentle nudge",
      title: "It is three ideas, not thirty",
      body: "Names for the sides, exact values for five angles, and three " +
            "identities. Everything else in the chapter is built from those.",
      example: "SOH-CAH-TOA · Table 8.1 · sin² + cos² = 1.",
    },
    {
      label: "Worked example",
      title: "A smaller version of the same idea",
      body: "One ratio really does give all six. From tan A = 3/4, draw legs 3 " +
            "and 4, get the hypotenuse 5 from Pythagoras, and every ratio can " +
            "then be read straight off the triangle.",
      example: "sin A = 3/5, cos A = 4/5, sec A = 5/4, and so on.",
    },
    {
      label: "Rule",
      title: "The transferable idea",
      body: "Before answering, sanity-check against the limits: sin and cos can " +
            "never exceed 1, sec and cosec never drop below it, and tan has no " +
            "ceiling at all.",
    },
  ],
};

export const PANELS_8_4 = {
  identity: { hints: HINTS_IDENTITY, Panel: TopicIdentity },
  proving: { hints: HINTS_PROVING, Panel: TopicProving },
  summary: { hints: HINTS_SUMMARY, Panel: TopicSummary },
};
