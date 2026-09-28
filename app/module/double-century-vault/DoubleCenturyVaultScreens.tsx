"use client";

import {
  Check,
  KeyRound,
  Lock,
  Minus,
  Plus,
  ShieldCheck,
  X,
} from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { useEffect, useState } from "react";
import {
  type MistakeFeedback,
  PracticeSet,
  type PracticeQuestion,
} from "../../components/learning/LearningSupport";
import { ExampleWalkthrough } from "../../components/learning/TeachingAnimations";
import {
  type DcvMetrics,
  type DcvSkill,
  type VaultDigits,
  valueOf,
} from "./double-century-vault-support";
import styles from "./double-century-vault.module.css";

type DcvScreenProps = {
  completed: boolean;
  metrics: DcvMetrics;
  onAnswer: (skill: DcvSkill, correct: boolean) => void;
  onComplete: () => void;
  onMistake: (feedback: MistakeFeedback) => void;
  playTone: (correct: boolean) => void;
};

export function DcvStage({
  screen,
  ...props
}: DcvScreenProps & { screen: number }) {
  switch (screen) {
    case 0:
      return <PlaceValueCluster {...props} />;
    case 1:
      return <RangeCluster {...props} />;
    case 2:
      return <OrderCluster {...props} />;
    case 3:
      return <LogicCluster {...props} />;
    default:
      return <RecallCluster {...props} />;
  }
}

function Heading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <header className={styles.heading}>
      <p>{eyebrow}</p>
      <h1>{title}</h1>
      <div>{children}</div>
    </header>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <p className={styles.sectionLabel}>{children}</p>;
}

function Feedback({
  kind = "info",
  children,
}: {
  kind?: "info" | "success";
  children: ReactNode;
}) {
  return (
    <div
      aria-live="polite"
      className={`${styles.feedback} ${
        kind === "success" ? styles.feedbackSuccess : ""
      }`}
    >
      {kind === "success" ? (
        <Check aria-hidden="true" />
      ) : (
        <ShieldCheck aria-hidden="true" />
      )}
      <span>{children}</span>
    </div>
  );
}

const beadColumns: Array<{ key: keyof VaultDigits; label: string }> = [
  { key: "hundreds", label: "Hundreds" },
  { key: "tens", label: "Tens" },
  { key: "ones", label: "Ones" },
];

function BeadFrame({
  digits,
  compact,
  showTotal = true,
}: {
  digits: VaultDigits;
  compact?: boolean;
  showTotal?: boolean;
}) {
  const total = valueOf(digits);
  return (
    <div
      aria-label={
        showTotal
          ? `Bead frame showing ${digits.hundreds} hundreds, ${digits.tens} tens, and ${digits.ones} ones, which is the number ${total}`
          : `Bead frame showing ${digits.hundreds} hundreds, ${digits.tens} tens, and ${digits.ones} ones. Work out what number that makes.`
      }
      className={`${styles.beadFrame} ${compact ? styles.beadFrameCompact : ""}`}
      role="img"
    >
      {beadColumns.map((column) => (
        <div className={styles.beadColumn} key={column.key}>
          <span>{column.label}</span>
          <div aria-hidden="true" className={styles.beadRow}>
            {Array.from({ length: 9 }).map((_, index) => (
              <i
                className={
                  index < digits[column.key] ? styles.beadFilled : styles.beadEmpty
                }
                key={index}
                style={{ "--bead-index": index } as CSSProperties}
              />
            ))}
          </div>
          <strong>{digits[column.key]}</strong>
        </div>
      ))}
      <div
        className={`${styles.beadTotal} ${showTotal ? "" : styles.beadTotalMystery}`}
      >
        <span>Vault reads</span>
        <strong>{showTotal ? total : "?"}</strong>
      </div>
    </div>
  );
}

function DigitStepper({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (next: number) => void;
}) {
  return (
    <div className={styles.stepper}>
      <span>{label}</span>
      <div>
        <button
          aria-label={`Decrease ${label}`}
          disabled={value <= 0}
          onClick={() => onChange(Math.max(0, value - 1))}
          type="button"
        >
          <Minus aria-hidden="true" />
        </button>
        <strong>{value}</strong>
        <button
          aria-label={`Increase ${label}`}
          disabled={value >= 9}
          onClick={() => onChange(Math.min(9, value + 1))}
          type="button"
        >
          <Plus aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

/* Cluster 1 · Place value */

const placeValueExampleDigits: VaultDigits[] = [
  { hundreds: 0, tens: 0, ones: 0 },
  { hundreds: 2, tens: 0, ones: 0 },
  { hundreds: 2, tens: 4, ones: 0 },
  { hundreds: 2, tens: 4, ones: 3 },
  { hundreds: 2, tens: 4, ones: 3 },
];

const placeValueExampleSteps = [
  "Here is an empty vault frame. Let's fill in the beads, one house at a time.",
  "First, the Hundreds house gets 2 beads. Each hundred bead is worth 100.",
  "Next, the Tens house gets 4 beads. Each ten bead is worth 10.",
  "Then, the Ones house gets 3 beads. Each one bead is worth 1.",
  "Add the three houses together: 200 + 40 + 3 = 243. That's the number the vault shows!",
];

function PlaceValueCluster({
  onAnswer,
  onComplete,
  onMistake,
  playTone,
}: DcvScreenProps) {
  const target: VaultDigits = { hundreds: 3, tens: 5, ones: 8 };
  const targetValue = valueOf(target);
  const [digits, setDigits] = useState<VaultDigits>({
    hundreds: 0,
    tens: 0,
    ones: 0,
  });
  const [checked, setChecked] = useState(false);
  const dialSolved = checked && valueOf(digits) === targetValue;
  const [practiceDone, setPracticeDone] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (dialSolved && practiceDone) onComplete();
  }, [dialSolved, practiceDone, onComplete]);

  function updateDigit(key: keyof VaultDigits, next: number) {
    setChecked(false);
    setDigits((current) => ({ ...current, [key]: next }));
  }

  function check() {
    setChecked(true);
    const correct = valueOf(digits) === targetValue;
    onAnswer("placeValue", correct);
    playTone(correct);
    if (correct) return;
    onMistake({
      eyebrow: "Vault dial · smaller example",
      title: "Build 142 in three houses",
      explanation:
        "A three-digit number is not one large guess. Read one house at a time. In 142, the 1 belongs in Hundreds, 4 in Tens and 2 in Ones.",
      workedSteps: [
        "142 → 1 hundred",
        "142 → 4 tens",
        "142 → 2 ones",
        "Apply the same house check to the vault",
      ],
      rule: "A 3-digit target fixes exactly one correct digit for each house.",
    });
  }

  const questions: PracticeQuestion[] = [
    {
      id: "pv-read-1",
      source: "practice",
      visual: <BeadFrame digits={{ hundreds: 2, tens: 4, ones: 3 }} showTotal={false} />,
      prompt: "What number does this bead frame show?",
      options: ["234", "243", "423", "432"],
      correct: "243",
      mistake: {
        eyebrow: "Bead frame · smaller example",
        title: "Read a 132 frame first",
        explanation:
          "Imagine a frame with 1 bead in Hundreds, 3 in Tens and 2 in Ones. Reading the houses from left to right makes 132.",
        workedSteps: ["1 hundred", "3 tens", "2 ones", "132"],
        rule: "Always read a bead frame in the same order: hundreds, then tens, then ones.",
      },
    },
    {
      id: "pv-read-2",
      source: "practice",
      visual: <BeadFrame digits={{ hundreds: 1, tens: 5, ones: 6 }} showTotal={false} />,
      prompt: "What number does THIS bead frame show?",
      options: ["165", "516", "156", "561"],
      correct: "156",
      mistake: {
        eyebrow: "Bead frame · smaller example",
        title: "Read a 132 frame first",
        explanation:
          "Imagine a frame with 1 bead in Hundreds, 3 in Tens and 2 in Ones. The house order gives 132, not 123 or 312.",
        workedSteps: ["Hundreds: 1", "Tens: 3", "Ones: 2", "132"],
        rule: "Always read a bead frame in the same order: hundreds, then tens, then ones.",
      },
    },
    {
      id: "pv-topup",
      source: "handbook",
      visual: (
        <div className={styles.topUpPanel}>
          <BeadFrame compact digits={{ hundreds: 2, tens: 4, ones: 3 }} />
          <span className={styles.topUpArrow}>&rarr;</span>
          <BeadFrame compact digits={{ hundreds: 4, tens: 9, ones: 6 }} />
        </div>
      ),
      prompt:
        "At minimum, how many more beads are required to show number 496 on the given vault, if it currently shows 243?",
      options: ["487", "253", "10", "11"],
      correct: "10",
      mistake: {
        eyebrow: "Bead top-up · smaller example",
        title: "Top up 121 to 243",
        explanation:
          "For 121 → 243, add 1 bead in Hundreds, 2 in Tens and 2 in Ones. Add those house gaps to get 5 extra beads.",
        workedSteps: ["Hundreds gap: 1", "Tens gap: 2", "Ones gap: 2", "1 + 2 + 2 = 5"],
        rule: "Minimum extra beads = the gap in each house, added together.",
      },
    },
  ];

  return (
    <div className={styles.screen}>
      <Heading eyebrow="Concept 1 · Place value" title="What Makes a Number?">
        A 3-digit number is built from three houses: Hundreds, Tens, and
        Ones. Every bead is worth more or less depending on which house it
        sits in.
      </Heading>

      <ExampleWalkthrough
        onReveal={() => setRevealed(true)}
        renderStep={(index) => (
          <BeadFrame digits={placeValueExampleDigits[index]} showTotal={index === 4} />
        )}
        revealed={revealed}
        steps={placeValueExampleSteps}
        title="Building 243, bead by bead"
      />

      {revealed ? (
        <>
          <SectionLabel>Now you try it: turn the dial</SectionLabel>
          <p className={styles.prompt}>
            Tap the + and − buttons to set the hundreds, tens, and ones. Stop
            when the vault shows exactly {targetValue}.
          </p>

          <BeadFrame digits={digits} />

          <div className={styles.stepperRow}>
            <DigitStepper
              label="Hundreds"
              onChange={(next) => updateDigit("hundreds", next)}
              value={digits.hundreds}
            />
            <DigitStepper
              label="Tens"
              onChange={(next) => updateDigit("tens", next)}
              value={digits.tens}
            />
            <DigitStepper
              label="Ones"
              onChange={(next) => updateDigit("ones", next)}
              value={digits.ones}
            />
          </div>

          <button
            className={styles.primaryAction}
            disabled={dialSolved}
            onClick={check}
            type="button"
          >
            <Lock aria-hidden="true" /> Check the vault
          </button>

          <Feedback kind={dialSolved ? "success" : "info"}>
            {dialSolved
              ? `Vault unlocked at ${targetValue}. Now finish the practice questions below.`
              : "Adjust the dial, then check the vault."}
          </Feedback>

          <PracticeSet
            onAllComplete={() => setPracticeDone(true)}
            onAnswer={onAnswer}
            onMistake={onMistake}
            playTone={playTone}
            questions={questions}
            skill="placeValue"
          />
        </>
      ) : null}
    </div>
  );
}

/* Cluster 2 · Comparing and filtering by range */

function RuleCheckVisual({
  value,
  greaterCheck,
  lessCheck,
  verdict,
}: {
  value: number | null;
  greaterCheck: boolean | null;
  lessCheck: boolean | null;
  verdict: "pass" | "fail" | null;
}) {
  return (
    <div className={styles.ruleTest}>
      <div className={styles.ruleTestRule}>Bigger than 250 AND smaller than 400</div>
      {value === null ? (
        <p className={styles.ruleTestWaiting}>Pick a number to test…</p>
      ) : (
        <>
          <div className={styles.ruleTestNumber}>{value}</div>
          <div className={styles.ruleTestChecks}>
            <span
              className={
                greaterCheck === null
                  ? ""
                  : greaterCheck
                    ? styles.checkPass
                    : styles.checkFail
              }
            >
              {greaterCheck === null ? null : greaterCheck ? (
                <Check aria-hidden="true" />
              ) : (
                <X aria-hidden="true" />
              )}
              Bigger than 250
            </span>
            <span
              className={
                lessCheck === null ? "" : lessCheck ? styles.checkPass : styles.checkFail
              }
            >
              {lessCheck === null ? null : lessCheck ? (
                <Check aria-hidden="true" />
              ) : (
                <X aria-hidden="true" />
              )}
              Smaller than 400
            </span>
          </div>
          {verdict ? (
            <strong
              className={verdict === "pass" ? styles.verdictPass : styles.verdictFail}
            >
              {verdict === "pass" ? "Passes the gate!" : "Does not pass"}
            </strong>
          ) : null}
        </>
      )}
    </div>
  );
}

const rangeExampleSteps = [
  "Let's test some numbers against a rule: bigger than 250 AND smaller than 400.",
  "Try 301. Is it bigger than 250? Yes!",
  "Is 301 also smaller than 400? Yes! So 301 passes the whole rule.",
  "Now try 250 itself. Is 250 bigger than 250? No — it's exactly equal, not bigger.",
  "So 250 does NOT pass, even though it looks close. A number must pass BOTH parts of the rule.",
];

const rangeExampleFrames: Array<{
  value: number | null;
  greaterCheck: boolean | null;
  lessCheck: boolean | null;
  verdict: "pass" | "fail" | null;
}> = [
  { value: null, greaterCheck: null, lessCheck: null, verdict: null },
  { value: 301, greaterCheck: true, lessCheck: null, verdict: null },
  { value: 301, greaterCheck: true, lessCheck: true, verdict: "pass" },
  { value: 250, greaterCheck: false, lessCheck: null, verdict: null },
  { value: 250, greaterCheck: false, lessCheck: null, verdict: "fail" },
];

const corridorNumbers = [198, 250, 267, 301, 356, 400, 412, 244, 389, 405] as const;
const gatePass = new Set([267, 301, 356, 389]);

function RangeCluster({
  onAnswer,
  onComplete,
  onMistake,
  playTone,
}: DcvScreenProps) {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [checked, setChecked] = useState(false);
  const [practiceDone, setPracticeDone] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const correctSet =
    selected.size === gatePass.size &&
    [...selected].every((value) => gatePass.has(value));
  const gateSolved = checked && correctSet;

  useEffect(() => {
    if (gateSolved && practiceDone) onComplete();
  }, [gateSolved, practiceDone, onComplete]);

  function toggle(value: number) {
    if (gateSolved) return;
    setChecked(false);
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  }

  function check() {
    setChecked(true);
    onAnswer("range", correctSet);
    playTone(correctSet);
    if (correctSet) return;
    onMistake({
      eyebrow: "Corridor gatekeeper · smaller example",
      title: "Test a tiny 10-to-20 gate",
      explanation:
        "At a gate that accepts numbers bigger than 10 and smaller than 20, 9 fails the first check, 22 fails the second and 15 passes both.",
      workedSteps: ["9: too small", "22: too large", "15: passes both", "Retest every corridor number"],
      rule: "A number only passes a range gate when every part of the rule is true. The boundary numbers themselves do not pass.",
    });
  }

  const questions: PracticeQuestion[] = [
    {
      id: "range-handbook",
      source: "handbook",
      prompt:
        "Sam cancels all numbers less than 432 and all numbers greater than 567 in this list: 451, 430, 568, 411, 392, 517, 533, 578, 420, 525, 566, 616, 571, 436. How many numbers remain?",
      options: ["5", "6", "7", "8"],
      correct: "6",
      mistake: {
        eyebrow: "Cancel and count · smaller example",
        title: "Filter a three-number list",
        explanation:
          "Keep numbers bigger than 10 and smaller than 20 from 8, 14, 23. Cross out 8 and 23; only 14 remains.",
        workedSteps: ["8 fails", "14 passes both checks", "23 fails", "1 number remains"],
        rule: "A number only survives if it passes every part of the rule at once.",
      },
    },
    {
      id: "range-fresh",
      source: "practice",
      prompt: "Which ONE of these numbers is bigger than 250 AND smaller than 400?",
      options: ["220", "405", "356", "500"],
      correct: "356",
      mistake: {
        eyebrow: "Test each option · smaller example",
        title: "Try a 30-to-50 gate",
        explanation:
          "For options 25, 42 and 55, test both conditions: bigger than 30 and smaller than 50. Only 42 passes both.",
        workedSteps: ["25 fails the lower bound", "42 passes both", "55 fails the upper bound"],
        rule: "A number fails a range rule if it breaks even one part of it.",
      },
    },
  ];

  return (
    <div className={styles.screen}>
      <Heading eyebrow="Concept 2 · Comparing numbers" title="Bigger Than, Smaller Than">
        We can test a number with two rules at once: bigger than one number,
        AND smaller than another. A number only passes if BOTH are true.
      </Heading>

      <ExampleWalkthrough
        onReveal={() => setRevealed(true)}
        renderStep={(index) => <RuleCheckVisual {...rangeExampleFrames[index]} />}
        revealed={revealed}
        steps={rangeExampleSteps}
        title="Testing numbers against a rule"
      />

      {revealed ? (
        <>
          <SectionLabel>Now you try it: guard the gate</SectionLabel>
          <p className={styles.prompt}>
            Only numbers that are BIGGER than 250 AND SMALLER than 400 may walk
            through the gate. Tap every number that is allowed through.
          </p>

          <div aria-label="Number corridor" className={styles.corridor} role="group">
            {corridorNumbers.map((value) => {
              const isSelected = selected.has(value);
              return (
                <button
                  aria-pressed={isSelected}
                  className={`${styles.corridorTile} ${
                    isSelected ? styles.corridorTileSelected : ""
                  } ${
                    checked && gatePass.has(value)
                      ? styles.corridorTileCorrect
                      : checked && isSelected
                        ? styles.corridorTileWrong
                        : ""
                  }`}
                  disabled={gateSolved}
                  key={value}
                  onClick={() => toggle(value)}
                  type="button"
                >
                  {value}
                </button>
              );
            })}
          </div>

          <button
            className={styles.primaryAction}
            disabled={!selected.size || gateSolved}
            onClick={check}
            type="button"
          >
            <ShieldCheck aria-hidden="true" /> Check the gate
          </button>

          <Feedback kind={gateSolved ? "success" : "info"}>
            {gateSolved
              ? "Gate open! Now finish the practice questions below."
              : "Select the numbers that satisfy both boundaries, then check."}
          </Feedback>

          <PracticeSet
            onAllComplete={() => setPracticeDone(true)}
            onAnswer={onAnswer}
            onMistake={onMistake}
            playTone={playTone}
            questions={questions}
            skill="range"
          />
        </>
      ) : null}
    </div>
  );
}

/* Cluster 3 · Ordering numbers */

function CompareVisual({ highlight, winner }: { highlight: boolean; winner: boolean }) {
  return (
    <div className={styles.compareVisual}>
      <div className={highlight ? styles.compareActive : ""}>
        <span>198</span>
        <small className={highlight ? styles.compareDigitActive : ""}>1</small>
      </div>
      <div className={winner ? styles.compareWinner : highlight ? styles.compareActive : ""}>
        <span>267</span>
        <small className={highlight ? styles.compareDigitActive : ""}>2</small>
      </div>
      {winner ? <strong>267 is bigger!</strong> : null}
    </div>
  );
}

const orderExampleSteps = [
  "Let's compare 198 and 267. Which one is bigger?",
  "Look at the Hundreds house first: 198 has 1 hundred, 267 has 2 hundreds.",
  "2 is bigger than 1, so 267 is already bigger — we don't even need to check tens or ones!",
  "If the hundreds digits ever match, compare the tens next. If those match too, compare the ones.",
];

const tumblerNumbers = [356, 198, 401, 267] as const;
const tumblerOrder = [198, 267, 356, 401];

function OrderCluster({
  onAnswer,
  onComplete,
  onMistake,
  playTone,
}: DcvScreenProps) {
  const [picked, setPicked] = useState<number[]>([]);
  const [practiceDone, setPracticeDone] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const tumblerSolved = picked.length === tumblerOrder.length;

  useEffect(() => {
    if (tumblerSolved && practiceDone) onComplete();
  }, [tumblerSolved, practiceDone, onComplete]);

  function pick(value: number) {
    if (tumblerSolved || picked.includes(value)) return;
    const expected = tumblerOrder[picked.length];
    const correct = value === expected;
    onAnswer("order", correct);
    playTone(correct);
    if (!correct) {
      onMistake({
        eyebrow: "Tumbler order · smaller example",
        title: "Order 142, 135 and 208",
        explanation:
          "Compare Hundreds first: both 142 and 135 beat 208. Their Hundreds tie, so compare Tens; 3 tens is smaller than 4 tens.",
        workedSteps: ["135 before 142", "142 before 208", "135, 142, 208"],
        rule: "Always pick the smallest remaining number next when building ascending order.",
      });
      return;
    }
    setPicked((current) => [...current, value]);
  }

  const questions: PracticeQuestion[] = [
    {
      id: "order-smallest",
      source: "practice",
      prompt: "Which of these is the SMALLEST number: 356, 198, or 401?",
      options: ["356", "198", "401"],
      correct: "198",
      mistake: {
        eyebrow: "Compare hundreds · smaller example",
        title: "Find the smallest of 142, 208 and 135",
        explanation:
          "142 and 135 both have 1 hundred, so 208 cannot be smallest. Compare their tens next: 3 tens is smaller than 4 tens, so 135 is smallest.",
        workedSteps: ["Hundreds: 1, 2, 1", "Compare tied tens: 4 and 3", "135 is smallest"],
        rule: "The number with the smallest hundreds digit is the smallest number overall.",
      },
    },
    {
      id: "order-sequence",
      source: "handbook",
      prompt:
        "In a number pattern, three numbers in a row always follow each other exactly: one number, then the next, then the next. What two numbers are missing here: ___, 455, ___ ?",
      options: ["454 and 456", "453 and 456", "456 and 457", "454 and 455"],
      correct: "454 and 456",
      mistake: {
        eyebrow: "Before and after · smaller example",
        title: "Complete __, 80, __",
        explanation:
          "Consecutive numbers differ by exactly one. One less than 80 is 79 and one more is 81.",
        workedSteps: ["79", "80", "81"],
        rule: "Consecutive numbers go up by exactly 1 each time, with no gaps.",
      },
    },
    {
      id: "order-bigger",
      source: "practice",
      prompt: "Which is BIGGER: 342 or 289?",
      options: ["342", "289", "They are equal"],
      correct: "342",
      mistake: {
        eyebrow: "Compare hundreds · smaller example",
        title: "Compare 124 and 92",
        explanation:
          "124 has 1 hundred while 92 has no hundreds. That first different place already decides which number is bigger.",
        workedSteps: ["124 → 1 hundred", "92 → 0 hundreds", "124 is bigger"],
        rule: "The number with the bigger hundreds digit is the bigger number.",
      },
    },
  ];

  return (
    <div className={styles.screen}>
      <Heading eyebrow="Concept 3 · Ordering numbers" title="Which One Comes First?">
        To put numbers in order, compare them house by house: hundreds
        first, then tens, then ones — and stop as soon as you find a
        difference.
      </Heading>

      <ExampleWalkthrough
        onReveal={() => setRevealed(true)}
        renderStep={(index) => (
          <CompareVisual highlight={index >= 1} winner={index >= 2} />
        )}
        revealed={revealed}
        steps={orderExampleSteps}
        title="Comparing 198 and 267"
      />

      {revealed ? (
        <>
          <SectionLabel>Now you try it: align the tumblers</SectionLabel>
          <p className={styles.prompt}>
            Tap the four vault numbers from smallest to biggest to line up the
            tumblers.
          </p>

          <div className={styles.tumblerRow}>
            {tumblerNumbers.map((value) => {
              const position = picked.indexOf(value);
              return (
                <button
                  className={`${styles.tumblerTile} ${
                    position >= 0 ? styles.tumblerTilePicked : ""
                  }`}
                  disabled={position >= 0}
                  key={value}
                  onClick={() => pick(value)}
                  type="button"
                >
                  {value}
                  {position >= 0 ? <small>#{position + 1}</small> : null}
                </button>
              );
            })}
          </div>

          <Feedback kind={tumblerSolved ? "success" : "info"}>
            {tumblerSolved
              ? `Tumblers aligned: ${tumblerOrder.join(" → ")}. Now finish the practice questions below.`
              : `Picked so far: ${picked.length ? picked.join(", ") : "none yet"}.`}
          </Feedback>

          <PracticeSet
            onAllComplete={() => setPracticeDone(true)}
            onAnswer={onAnswer}
            onMistake={onMistake}
            playTone={playTone}
            questions={questions}
            skill="order"
          />
        </>
      ) : null}
    </div>
  );
}

/* Cluster 4 · Logic and your own code */

const passcodeSteps = [
  "Here's a puzzle: a 4-digit passcode uses only ODD digits, and no digit repeats. Let's crack it clue by clue.",
  "Clue 1: 3 is the SMALLEST digit used, and it's also the LAST digit. So the code looks like: _ _ _ 3",
  "Since 3 is the smallest digit used, we can't use 1 anywhere (1 is smaller than 3). Our digits to choose from are now 3, 5, 7, 9.",
  "Clue 2: the LARGEST and SMALLEST digits have exactly ONE digit between them. Since 3 is in the last spot, the largest digit must be two spots away — the hundreds place.",
  "The largest digit available is 9, so 9 goes in the hundreds place: _ 9 _ 3",
  "The hundreds digit (2nd from the left) is 9!",
];

const passcodeSlots: Array<[string, string, string, string]> = [
  ["_", "_", "_", "_"],
  ["_", "_", "_", "3"],
  ["_", "_", "_", "3"],
  ["_", "_", "_", "3"],
  ["_", "9", "_", "3"],
  ["_", "9", "_", "3"],
];

function PasscodeVisual({ index }: { index: number }) {
  const slots = passcodeSlots[index];
  return (
    <div className={styles.passcodeVisual}>
      {slots.map((slot, slotIndex) => (
        <i
          className={
            index === 3 && slotIndex === 1
              ? styles.passcodeSlotTarget
              : slotIndex === 1 && index >= 4
                ? styles.passcodeSlotFilled
                : slotIndex === 3 && index >= 1
                  ? styles.passcodeSlotFilled
                  : ""
          }
          key={slotIndex}
        >
          {slot}
        </i>
      ))}
      {index === 5 ? <strong>Hundreds digit = 9</strong> : null}
    </div>
  );
}

function VaultCodeWidget({
  onAnswer,
  onMistake,
  playTone,
  onSolved,
}: {
  onAnswer: (skill: DcvSkill, correct: boolean) => void;
  onMistake: (feedback: MistakeFeedback) => void;
  playTone: (correct: boolean) => void;
  onSolved: () => void;
}) {
  const rival = 256;
  const [digits, setDigits] = useState<VaultDigits>({
    hundreds: 0,
    tens: 0,
    ones: 0,
  });
  const [locked, setLocked] = useState(false);
  const value = valueOf(digits);
  const isDoubleCentury = value >= 200 && value <= 299;
  const beatsRival = value > rival;
  const solved = locked && isDoubleCentury && beatsRival;

  useEffect(() => {
    if (solved) onSolved();
  }, [solved, onSolved]);

  function updateDigit(key: keyof VaultDigits, next: number) {
    setLocked(false);
    setDigits((current) => ({ ...current, [key]: next }));
  }

  function lock() {
    setLocked(true);
    const correct = isDoubleCentury && beatsRival;
    onAnswer("logic", correct);
    playTone(correct);
    if (correct) return;
    onMistake({
      eyebrow: "Vault code · smaller example",
      title: "Pass two gates at once",
      explanation:
        "Suppose a mini code must be between 40 and 60 and also bigger than 52. Code 48 passes the first rule but fails the second; code 55 passes both.",
      workedSteps: [
        "48 is between 40 and 60",
        "48 is not bigger than 52",
        "55 passes both checks",
        "Test the current code twice",
      ],
      rule: "Your code has to pass both rules at the same time: start with 2 hundreds, and beat the rival.",
    });
  }

  return (
    <>
      <SectionLabel>Now you try it: build your own code</SectionLabel>
      <p className={styles.prompt}>
        Pick your own hundreds, tens, and ones digits. Your code must start
        with 2 hundreds, and it must be bigger than the rival code {rival}.
      </p>

      <BeadFrame digits={digits} />

      <div className={styles.stepperRow}>
        <DigitStepper
          label="Hundreds"
          onChange={(next) => updateDigit("hundreds", next)}
          value={digits.hundreds}
        />
        <DigitStepper
          label="Tens"
          onChange={(next) => updateDigit("tens", next)}
          value={digits.tens}
        />
        <DigitStepper
          label="Ones"
          onChange={(next) => updateDigit("ones", next)}
          value={digits.ones}
        />
      </div>

      <div className={styles.codeChecks}>
        <span className={isDoubleCentury ? styles.checkPass : styles.checkFail}>
          {isDoubleCentury ? <Check aria-hidden="true" /> : <X aria-hidden="true" />}
          Starts with 2 hundreds (200–299)
        </span>
        <span className={beatsRival ? styles.checkPass : styles.checkFail}>
          {beatsRival ? <Check aria-hidden="true" /> : <X aria-hidden="true" />}
          Bigger than {rival}
        </span>
      </div>

      <button className={styles.primaryAction} disabled={solved} onClick={lock} type="button">
        <KeyRound aria-hidden="true" /> Lock in my code
      </button>

      <Feedback kind={solved ? "success" : "info"}>
        {solved
          ? `Code ${value} is locked in! Now finish the practice questions below.`
          : "Change the digits until both checks turn green, then lock in your code."}
      </Feedback>
    </>
  );
}

function LogicCluster({
  onAnswer,
  onComplete,
  onMistake,
  playTone,
}: DcvScreenProps) {
  const [codeSolved, setCodeSolved] = useState(false);
  const [practiceDone, setPracticeDone] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (codeSolved && practiceDone) onComplete();
  }, [codeSolved, practiceDone, onComplete]);

  const questions: PracticeQuestion[] = [
    {
      id: "logic-coins",
      source: "handbook",
      prompt:
        "Altogether, 25 coins are arranged in stacks so that each stack has one more coin than the previous stack. The last stack has 7 coins. How many stacks are there?",
      options: ["4", "5", "6", "7"],
      correct: "5",
      mistake: {
        eyebrow: "Coin stacks · smaller example",
        title: "Build a 9-coin staircase",
        explanation:
          "Three growing stacks with 2, 3 and 4 coins use 9 coins altogether. The stack sizes change by exactly one.",
        workedSteps: ["2 coins", "3 coins", "4 coins", "2 + 3 + 4 = 9"],
        rule: "Consecutive stacks grow by exactly 1 coin each time.",
      },
    },
    {
      id: "logic-century-check",
      source: "practice",
      prompt: "Which of these is a double-century number (200–299)?",
      options: ["199", "305", "256", "300"],
      correct: "256",
      mistake: {
        eyebrow: "Century check · smaller example",
        title: "Compare 214 and 314",
        explanation:
          "214 has 2 in the Hundreds house, so it lies from 200 to 299. 314 has 3 hundreds, so it does not.",
        workedSteps: ["214 → 2 hundreds", "314 → 3 hundreds", "Only 214 is double-century"],
        rule: "Double-century numbers are exactly the numbers from 200 to 299.",
      },
    },
  ];

  return (
    <div className={styles.screen}>
      <Heading eyebrow="Concept 4 · Solving with clues" title="Crack the Code">
        Some puzzles need more than one rule at once. Use clues one at a
        time, ruling things out until only one answer is left.
      </Heading>

      <ExampleWalkthrough
        onReveal={() => setRevealed(true)}
        readPauseMs={3800}
        renderStep={(index) => <PasscodeVisual index={index} />}
        revealed={revealed}
        steps={passcodeSteps}
        title="A real handbook logic puzzle"
      />

      {revealed ? (
        <>
          <VaultCodeWidget
            onAnswer={onAnswer}
            onMistake={onMistake}
            onSolved={() => setCodeSolved(true)}
            playTone={playTone}
          />

          <PracticeSet
            onAllComplete={() => setPracticeDone(true)}
            onAnswer={onAnswer}
            onMistake={onMistake}
            playTone={playTone}
            questions={questions}
            skill="logic"
          />
        </>
      ) : null}
    </div>
  );
}

/* Cluster 5 · Recall */

const recallQuestions: PracticeQuestion[] = [
  {
    id: "recall-placevalue",
    source: "practice",
    prompt: "In the number 358, how much is the 5 really worth?",
    options: ["5", "50", "500", "35"],
    correct: "50",
    mistake: {
      eyebrow: "Vault mastery · smaller example",
      title: "Find the value of 6 in 267",
      explanation: "The 6 sits in the Tens house, so it represents 6 tens, which is 60.",
      workedSteps: ["267", "6 is in Tens", "6 tens = 60"],
      rule: "A digit's value depends on which house it sits in.",
    },
  },
  {
    id: "recall-range",
    source: "practice",
    prompt: "Which number is bigger than 300 AND smaller than 350?",
    options: ["298", "320", "360", "300"],
    correct: "320",
    mistake: {
      eyebrow: "Vault mastery · smaller example",
      title: "Test 24 against 20 and 30",
      explanation: "24 is bigger than 20 and smaller than 30, so it passes both boundaries.",
      workedSteps: ["24 > 20", "24 < 30", "Both true"],
      rule: "A number only passes when every part of a range rule is true.",
    },
  },
  {
    id: "recall-order",
    source: "practice",
    prompt: "Which is the SMALLEST: 512, 398, or 476?",
    options: ["512", "398", "476"],
    correct: "398",
    mistake: {
      eyebrow: "Vault mastery · smaller example",
      title: "Compare 412, 287 and 350",
      explanation: "Their Hundreds digits are 4, 2 and 3. The smallest is 2, so 287 is smallest.",
      workedSteps: ["Hundreds: 4, 2, 3", "2 is smallest", "287 is smallest"],
      rule: "The number with the smallest hundreds digit is the smallest overall.",
    },
  },
  {
    id: "recall-logic",
    source: "practice",
    prompt: "Which of these is a double-century number?",
    options: ["150", "250", "350", "450"],
    correct: "250",
    mistake: {
      eyebrow: "Vault mastery · smaller example",
      title: "Sort 225 and 325",
      explanation: "225 has 2 hundreds and belongs from 200 to 299. 325 has 3 hundreds and does not.",
      workedSteps: ["225 → 2 hundreds", "325 → 3 hundreds"],
      rule: "Double-century numbers run from 200 to 299.",
    },
  },
];

function RecallCluster({
  metrics,
  onAnswer,
  onComplete,
  onMistake,
  playTone,
}: DcvScreenProps) {
  const [done, setDone] = useState(false);

  const scores = (Object.entries(metrics) as Array<
    [DcvSkill, { attempts: number; correct: number }]
  >).map(([skill, result]) => ({
    skill,
    score: result.attempts
      ? Math.round((result.correct / result.attempts) * 100)
      : 100,
  }));

  return (
    <div className={styles.screen}>
      <Heading eyebrow="Mission 5 · Show what you know" title="Show What You Know">
        Answer these on your own — no looking back! Then see how your Vault
        mission went.
      </Heading>

      <PracticeSet
        onAllComplete={() => {
          setDone(true);
          onComplete();
        }}
        onAnswer={onAnswer}
        onMistake={onMistake}
        playTone={playTone}
        questions={recallQuestions}
        skill="logic"
      />

      {done ? (
        <section className={styles.summary}>
          <Check aria-hidden="true" />
          <span>Mission complete</span>
          <h2>You can read, build, filter, order, and lock vault numbers!</h2>
          <div>
            {scores.map((item) => (
              <i key={item.skill}>
                <small>{item.skill}</small>
                <strong>
                  {item.score >= 75 ? "Mastered" : "Keep practising"}
                </strong>
                <b>
                  <span style={{ width: `${Math.max(18, item.score)}%` }} />
                </b>
              </i>
            ))}
          </div>
        </section>
      ) : null}

      <Feedback kind={done ? "success" : "info"}>
        {done
          ? "Double Century Vault complete. The place-value rule is ready for a new puzzle."
          : "Answer every recall question to complete the mission."}
      </Feedback>
    </div>
  );
}
