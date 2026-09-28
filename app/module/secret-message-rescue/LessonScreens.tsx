"use client";

import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Check,
  CheckCircle2,
  CircleHelp,
  Eye,
  KeyRound,
  Lightbulb,
  LockKeyhole,
  MessageSquareText,
  Minus,
  Plus,
  ScanLine,
  ShieldCheck,
  Sparkles,
  UnlockKeyhole,
  WandSparkles,
} from "lucide-react";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import type { MistakeFeedback } from "../../components/learning/LearningSupport";
import {
  AnimatedLetterPath,
  CipherPipelineAnimation,
  ShiftRuleAnimation,
} from "../../components/learning/TeachingAnimations";
import { CipherWheel } from "./CipherWheel";
import {
  decode,
  encode,
  shiftedLetter,
  SkillCategory,
  SkillMetrics,
} from "./lesson-helpers";
import styles from "./secret-message-rescue.module.css";

export type LessonScreenProps = {
  completed: boolean;
  metrics: SkillMetrics;
  onAnswer: (category: SkillCategory, correct: boolean) => void;
  onComplete: () => void;
  onMistake: (feedback: MistakeFeedback) => void;
  playTone: (correct: boolean) => void;
};

export function LessonStage({
  screen,
  ...props
}: LessonScreenProps & { screen: number }) {
  switch (screen) {
    case 0:
      return <PrivacyScreen {...props} />;
    case 1:
      return <ConceptScreen {...props} />;
    case 2:
      return <ShiftRuleScreen {...props} />;
    case 3:
      return <BuildWheelScreen {...props} />;
    case 4:
      return <EncodeScreen {...props} />;
    case 5:
      return <DecodeScreen {...props} />;
    case 6:
      return <MissingKeyScreen {...props} />;
    case 7:
      return <CreateMessageScreen {...props} />;
    default:
      return <SecurityScreen {...props} />;
  }
}

function LessonHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <header className={styles.lessonHeading}>
      <p>{eyebrow}</p>
      <h1>{title}</h1>
      <div>{children}</div>
    </header>
  );
}

function Feedback({
  children,
  kind = "info",
}: {
  children: ReactNode;
  kind?: "info" | "success" | "error";
}) {
  return (
    <div
      aria-live="polite"
      className={`${styles.feedback} ${styles[`feedback${capitalize(kind)}`]}`}
    >
      {kind === "success" ? (
        <CheckCircle2 aria-hidden="true" />
      ) : kind === "error" ? (
        <CircleHelp aria-hidden="true" />
      ) : (
        <Lightbulb aria-hidden="true" />
      )}
      <span>{children}</span>
    </div>
  );
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

const privacyItems = [
  {
    id: "atm",
    label: "ATM PIN",
    correct: "private",
    why: "An ATM PIN can unlock money. Only the account holder should know it.",
  },
  {
    id: "colour",
    label: "Favourite colour",
    correct: "share",
    why: "A favourite colour is usually harmless personal information.",
  },
  {
    id: "upi",
    label: "UPI PIN",
    correct: "private",
    why: "A UPI PIN approves payments. It must never be shared.",
  },
  {
    id: "lunch",
    label: "Lunch choice",
    correct: "share",
    why: "Telling a friend what you ate does not unlock an account.",
  },
  {
    id: "card",
    label: "Bank card details",
    correct: "private",
    why: "Card numbers and security codes can be misused to spend money.",
  },
] as const;

function PrivacyScreen({
  onAnswer,
  onComplete,
  onMistake,
  playTone,
}: LessonScreenProps) {
  const [solved, setSolved] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState(
    "Sort each item. The explanation matters more than speed.",
  );
  const [kind, setKind] = useState<"info" | "success" | "error">("info");

  function choose(item: (typeof privacyItems)[number], choice: string) {
    if (solved.has(item.id)) return;
    const correct = item.correct === choice;
    onAnswer("knowledge", correct);
    playTone(correct);

    if (!correct) {
      setKind("error");
      const explanation =
        "Decide by thinking about possible harm, not by guessing whether the words sound personal. Try the smaller example in the popup, then apply the same test to this item.";
      setMessage(explanation);
      onMistake({
        eyebrow: "Privacy check · smaller example",
        title: "Try two different facts",
        explanation,
        workedSteps: [
          "Favourite animal → cannot unlock anything",
          "Locker PIN → can open something",
          "Classify the current item using the same harm test",
        ],
        rule:
          "Keep information private when another person could use it to enter an account, impersonate you, or cause financial harm.",
      });
      return;
    }

    const next = new Set(solved);
    next.add(item.id);
    setSolved(next);
    setKind("success");
    setMessage(item.why);
    if (next.size === privacyItems.length) onComplete();
  }

  return (
    <div className={styles.screen}>
      <LessonHeading
        eyebrow="Lesson 1 · Connect to real life"
        title="Why hide a message?"
      >
        Some information is ordinary. Other information can unlock money or an
        account. Before learning codes, decide what truly needs protection.
      </LessonHeading>

      <section className={styles.sortLab} aria-label="Privacy sorting activity">
        <div className={styles.sortColumn}>
          <span className={styles.labLabel}>
            <LockKeyhole aria-hidden="true" /> Keep private
          </span>
          <p>Information that could cause harm if another person gets it.</p>
        </div>
        <div className={styles.sortColumn}>
          <span className={styles.labLabel}>
            <MessageSquareText aria-hidden="true" /> Okay to share
          </span>
          <p>Everyday information that does not unlock something important.</p>
        </div>
      </section>

      <div className={styles.privacyGrid}>
        {privacyItems.map((item) => (
          <article
            className={`${styles.privacyCard} ${
              solved.has(item.id) ? styles.cardSolved : ""
            }`}
            key={item.id}
          >
            <strong>{item.label}</strong>
            {solved.has(item.id) ? (
              <span className={styles.solvedLabel}>
                <Check aria-hidden="true" /> Sorted
              </span>
            ) : (
              <div>
                <button
                  onClick={() => choose(item, "private")}
                  type="button"
                >
                  Keep private
                </button>
                <button onClick={() => choose(item, "share")} type="button">
                  Okay to share
                </button>
              </div>
            )}
          </article>
        ))}
      </div>

      <Feedback kind={kind}>{message}</Feedback>

      {solved.size === privacyItems.length ? (
        <ConceptReveal
          icon={<ShieldCheck aria-hidden="true" />}
          title="New idea unlocked: Encryption"
        >
          Encryption changes a readable message so its meaning is hidden from
          everyone except the intended receiver.
        </ConceptReveal>
      ) : null}
    </div>
  );
}

const concepts = [
  {
    id: "plain",
    title: "Plain message",
    sample: "HELLO",
    detail: "The original message. You can read it normally.",
  },
  {
    id: "cipher",
    title: "Cipher",
    sample: "A rule",
    detail: "A repeatable rule that changes each letter.",
  },
  {
    id: "key",
    title: "Key",
    sample: "+3",
    detail: "The number that tells us how far every letter moves.",
  },
  {
    id: "coded",
    title: "Encrypted message",
    sample: "KHOOR",
    detail: "The changed message. It looks unreadable without the key.",
  },
  {
    id: "encrypt",
    title: "Encrypt",
    sample: "Forward",
    detail: "Use the cipher and key to hide the plain message.",
  },
  {
    id: "decrypt",
    title: "Decrypt",
    sample: "Reverse",
    detail: "Reverse the rule to recover the original message.",
  },
] as const;

function ConceptScreen({
  onAnswer,
  onComplete,
  onMistake,
  playTone,
}: LessonScreenProps) {
  const [active, setActive] = useState<(typeof concepts)[number]>(concepts[0]);
  const [viewed, setViewed] = useState<Set<string>>(new Set(["plain"]));
  const [matched, setMatched] = useState(false);
  const [message, setMessage] = useState(
    "Tap every part of the code pipeline. Then answer the check.",
  );

  function viewConcept(concept: (typeof concepts)[number]) {
    setActive(concept);
    const next = new Set(viewed);
    next.add(concept.id);
    setViewed(next);
    if (matched && next.size === concepts.length) onComplete();
  }

  function match(answer: string) {
    const correct = answer === "key";
    onAnswer("knowledge", correct);
    playTone(correct);
    if (!correct) {
      const explanation =
        "One part describes the action and another part supplies the amount. Use the movement-game example, then match those two jobs to the code pipeline.";
      setMessage(explanation);
      onMistake({
        eyebrow: "Code team check · smaller example",
        title: "Try a movement game",
        explanation,
        workedSteps: [
          "Instruction card says jump forward",
          "Number card shows 2",
          "The action and amount work together",
        ],
        rule:
          "A cipher describes what to do. A key supplies the value the cipher needs.",
      });
      return;
    }
    setMatched(true);
    setMessage(
      "Exactly. The key is 3, so every letter moves three places. Tap any unseen terms to finish.",
    );
    if (viewed.size === concepts.length) onComplete();
  }

  return (
    <div className={styles.screen}>
      <LessonHeading
        eyebrow="Lesson 2 · Build the vocabulary"
        title="Meet the code team"
      >
        A secret code is not magic. It has named parts and a rule we can follow
        again and again.
      </LessonHeading>

      <CipherPipelineAnimation />

      <div className={styles.pipeline} aria-label="Encryption pipeline">
        <button
          className={active.id === "plain" ? styles.pipelineActive : ""}
          onClick={() => viewConcept(concepts[0])}
          type="button"
        >
          <small>Plain message</small>
          <strong>HELLO</strong>
        </button>
        <ArrowRight aria-hidden="true" />
        <button
          className={active.id === "cipher" ? styles.pipelineActive : ""}
          onClick={() => viewConcept(concepts[1])}
          type="button"
        >
          <small>Cipher</small>
          <strong>Shift rule</strong>
        </button>
        <span className={styles.pipelinePlus}>+</span>
        <button
          className={active.id === "key" ? styles.pipelineActive : ""}
          onClick={() => viewConcept(concepts[2])}
          type="button"
        >
          <small>Key</small>
          <strong>3</strong>
        </button>
        <ArrowRight aria-hidden="true" />
        <button
          className={active.id === "coded" ? styles.pipelineActive : ""}
          onClick={() => viewConcept(concepts[3])}
          type="button"
        >
          <small>Encrypted</small>
          <strong>KHOOR</strong>
        </button>
      </div>

      <div className={styles.conceptGrid}>
        {concepts.map((concept) => (
          <button
            className={`${styles.conceptTab} ${
              active.id === concept.id ? styles.conceptTabActive : ""
            }`}
            key={concept.id}
            onClick={() => viewConcept(concept)}
            type="button"
          >
            <span>{viewed.has(concept.id) ? "Viewed" : "Tap to learn"}</span>
            <strong>{concept.title}</strong>
          </button>
        ))}
        <article className={styles.conceptExplanation}>
          <span>{active.sample}</span>
          <h2>{active.title}</h2>
          <p>{active.detail}</p>
        </article>
      </div>

      <section className={styles.checkCard}>
        <div>
          <span>Quick check</span>
          <h2>Which part tells us how many places to move?</h2>
        </div>
        <div className={styles.choiceRow}>
          {["plain message", "cipher", "key"].map((answer) => (
            <button
              className={matched && answer === "key" ? styles.choiceCorrect : ""}
              key={answer}
              onClick={() => match(answer)}
              type="button"
            >
              {answer}
            </button>
          ))}
        </div>
      </section>

      <Feedback kind={matched ? "success" : "info"}>{message}</Feedback>
    </div>
  );
}

function ShiftRuleScreen({
  onAnswer,
  onComplete,
  onMistake,
  playTone,
}: LessonScreenProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const [compared, setCompared] = useState(false);
  const allCorrect = answers.c === "D" && answers.z === "A";

  function answer(question: "c" | "z", value: string) {
    const correct = (question === "c" && value === "D") ||
      (question === "z" && value === "A");
    onAnswer("procedure", correct);
    playTone(correct);
    if (!correct) {
      setAttempts((current) => ({
        ...current,
        [question]: (current[question] ?? 0) + 1,
      }));
      const wrapAround = question === "z";
      onMistake({
        eyebrow: "Pattern check · smaller example",
        title: wrapAround
          ? "Try wrapping from Y"
          : "Try one move from H",
        explanation: wrapAround
          ? "On a circular alphabet, two moves from Y go to Z and then A. The alphabet does not stop at its last letter."
          : "For a shift of 1, H is the starting point, or move zero. The first new landing is I.",
        workedSteps: wrapAround ? ["Y", "move 1: Z", "move 2: A"] : ["H", "move 1: I"],
        rule:
          "The key counts moves, not letters you look at. The starting letter is move zero.",
      });
      return;
    }
    setAnswers((current) => ({ ...current, [question]: value }));
  }

  function compare() {
    setCompared(true);
    onComplete();
    playTone(true);
  }

  return (
    <div className={styles.screen}>
      <LessonHeading
        eyebrow="Lesson 3 · Pattern recognition"
        title="Discover the shift rule"
      >
        A Caesar Cipher moves every letter by the same amount. Watch one
        pattern, predict the missing letters, and notice what happens after Z.
      </LessonHeading>

      <ShiftRuleAnimation />

      <section className={styles.alphabetLab}>
        <div className={styles.alphabetLabel}>
          <span>Plain alphabet</span>
          <span>A</span><span>B</span><span>C</span><span>D</span>
          <span>…</span><span>X</span><span>Y</span><span>Z</span>
        </div>
        <div className={`${styles.alphabetLabel} ${styles.codedAlphabet}`}>
          <span>Shift 1</span>
          <span>B</span><span>C</span><span>?</span><span>E</span>
          <span>…</span><span>Y</span><span>Z</span><span>?</span>
        </div>
      </section>

      <div className={styles.predictionGrid}>
        <PredictionCard
          answer={answers.c}
          hint={
            (attempts.c ?? 0) >= 2
              ? "Start at C and move one place forward."
              : "Use the same movement as A→B and B→C."
          }
          label="If the key is 1, C becomes…"
          onChoose={(value) => answer("c", value)}
          options={["B", "D", "E"]}
        />
        <PredictionCard
          answer={answers.z}
          hint={
            (attempts.z ?? 0) >= 2
              ? "There is no letter after Z, so loop to the beginning."
              : "The alphabet is a circle, not a dead end."
          }
          label="If the key is 1, Z becomes…"
          onChoose={(value) => answer("z", value)}
          options={["Y", "A", "B"]}
        />
      </div>

      {allCorrect ? (
        <ConceptReveal
          icon={<RotateArrow />}
          title="Wrap-around"
        >
          With shift 1, Z wraps around to A. The alphabet behaves like a loop.
          Every letter still moves exactly one place.
        </ConceptReveal>
      ) : null}

      {allCorrect && !compared ? (
        <button className={styles.primaryAction} onClick={compare} type="button">
          Compare with shift 2 <ArrowRight aria-hidden="true" />
        </button>
      ) : null}

      {compared ? (
        <section className={styles.ruleReveal}>
          <span>Shift 1: A → B</span>
          <span>Shift 2: A → C</span>
          <strong>Universal rule</strong>
          <p>
            Every letter moves the same number of places. The key tells us that
            number.
          </p>
        </section>
      ) : null}
    </div>
  );
}

function RotateArrow() {
  return <WandSparkles aria-hidden="true" />;
}

function PredictionCard({
  label,
  options,
  answer,
  hint,
  onChoose,
}: {
  label: string;
  options: string[];
  answer?: string;
  hint: string;
  onChoose: (value: string) => void;
}) {
  return (
    <article className={styles.predictionCard}>
      <span>Predict before reveal</span>
      <h2>{label}</h2>
      <div className={styles.letterChoices}>
        {options.map((option) => (
          <button
            className={answer === option ? styles.choiceCorrect : ""}
            disabled={Boolean(answer)}
            key={option}
            onClick={() => onChoose(option)}
            type="button"
          >
            {option}
          </button>
        ))}
      </div>
      <p>{answer ? `Correct. The answer is ${answer}.` : hint}</p>
    </article>
  );
}

const wheelMappings = [
  { from: "A", to: "D", options: ["B", "C", "D"] },
  { from: "B", to: "E", options: ["D", "E", "F"] },
  { from: "C", to: "F", options: ["E", "F", "G"] },
] as const;

function BuildWheelScreen({
  onAnswer,
  onComplete,
  onMistake,
  playTone,
}: LessonScreenProps) {
  const [shift, setShift] = useState(0);
  const [solved, setSolved] = useState<Set<string>>(new Set());
  const [mistakes, setMistakes] = useState(0);
  const calibrated = shift === 3;

  function changeShift(amount: number) {
    setShift((current) => Math.max(0, Math.min(5, current + amount)));
  }

  function map(from: string, answer: string, expected: string) {
    const correct = answer === expected;
    onAnswer("procedure", correct);
    playTone(correct);
    if (!correct) {
      setMistakes((current) => current + 1);
      onMistake({
        eyebrow: "Wheel mapping · smaller example",
        title: "Try three clicks from M",
        explanation:
          "Keep the starting letter at move zero. On a key-3 wheel, make three separate landings and read only the final one.",
        workedSteps: ["M", "move 1: N", "move 2: O", "move 3: P"],
        rule:
          "Read from the plain outer letter to the coded inner letter after setting the wheel to the correct key.",
      });
      return;
    }
    const next = new Set(solved);
    next.add(from);
    setSolved(next);
    if (calibrated && next.size === wheelMappings.length) onComplete();
  }

  return (
    <div className={styles.screen}>
      <LessonHeading
        eyebrow="Lesson 4 · Make the model"
        title="Build the cipher wheel"
      >
        Align the alphabets, choose key 3, and prove that you can read the
        mapping before the decoder unlocks.
      </LessonHeading>

      <div className={styles.wheelLesson}>
        <div className={styles.wheelWrap}>
          <CipherWheel shift={shift} />
        </div>
        <section className={styles.calibrationPanel}>
          <span className={styles.labLabel}>Step 1 · Set the key</span>
          <h2>Turn the wheel to shift 3</h2>
          <p>
            The key is not a password. Here, it is the number of places every
            letter moves.
          </p>
          <div className={styles.shiftStepper}>
            <button
              aria-label="Decrease shift"
              onClick={() => changeShift(-1)}
              type="button"
            >
              <Minus aria-hidden="true" />
            </button>
            <output>Key {shift}</output>
            <button
              aria-label="Increase shift"
              onClick={() => changeShift(1)}
              type="button"
            >
              <Plus aria-hidden="true" />
            </button>
          </div>
          <Feedback kind={calibrated ? "success" : "info"}>
            {calibrated
              ? "Aligned. A on the plain ring now matches D on the coded ring."
              : "Start with A aligned to A at key 0. Turn three clicks."}
          </Feedback>
        </section>
      </div>

      <section
        className={`${styles.mappingLab} ${
          !calibrated ? styles.sectionLocked : ""
        }`}
      >
        <div>
          <span className={styles.labLabel}>Step 2 · Complete the mapping</span>
          <h2>With key 3, where does each plain letter land?</h2>
        </div>
        <div className={styles.mappingGrid}>
          {wheelMappings.map((mapping) => (
            <article key={mapping.from}>
              <strong>{mapping.from}</strong>
              <ArrowRight aria-hidden="true" />
              <div>
                {mapping.options.map((option) => (
                  <button
                    className={
                      solved.has(mapping.from) && option === mapping.to
                        ? styles.choiceCorrect
                        : ""
                    }
                    disabled={!calibrated || solved.has(mapping.from)}
                    key={option}
                    onClick={() => map(mapping.from, option, mapping.to)}
                    type="button"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>
        {mistakes >= 2 ? (
          <p className={styles.scaffold}>
            Show me: count three moves from the plain letter. A → B → C → D.
          </p>
        ) : null}
      </section>

      {solved.size === wheelMappings.length ? (
        <ConceptReveal
          icon={<UnlockKeyhole aria-hidden="true" />}
          title="Cipher wheel unlocked"
        >
          You did not guess a word. You built a reusable mapping: A→D, B→E,
          C→F, and the same +3 rule continues around the alphabet.
        </ConceptReveal>
      ) : null}
    </div>
  );
}

const encodeSteps = [
  {
    plain: "C",
    coded: "F",
    path: "C → D → E → F",
    options: ["E", "F", "G"],
  },
  {
    plain: "A",
    coded: "D",
    path: "A → B → C → D",
    options: ["C", "D", "E"],
  },
  {
    plain: "T",
    coded: "W",
    path: "T → U → V → W",
    options: ["V", "W", "X"],
  },
] as const;

function EncodeScreen(props: LessonScreenProps) {
  return (
    <GuidedWordScreen
      category="procedure"
      direction="forward"
      intro="Encoding means moving forward by the key. We will encode CAT with key 3, one letter at a time."
      steps={encodeSteps}
      title="Encode together"
      {...props}
    />
  );
}

const decodeSteps = [
  {
    plain: "K",
    coded: "H",
    path: "K → J → I → H",
    options: ["G", "H", "I"],
  },
  {
    plain: "H",
    coded: "E",
    path: "H → G → F → E",
    options: ["D", "E", "F"],
  },
  {
    plain: "O",
    coded: "L",
    path: "O → N → M → L",
    options: ["K", "L", "M"],
  },
  {
    plain: "O",
    coded: "L",
    path: "O → N → M → L",
    options: ["K", "L", "M"],
  },
  {
    plain: "R",
    coded: "O",
    path: "R → Q → P → O",
    options: ["N", "O", "P"],
  },
] as const;

function DecodeScreen(props: LessonScreenProps) {
  return (
    <GuidedWordScreen
      category="procedure"
      direction="backward"
      intro="Decoding reverses the rule. KHOOR was made with key 3, so move each coded letter backward three places."
      steps={decodeSteps}
      title="Decode the rescue message"
      {...props}
    />
  );
}

function GuidedWordScreen({
  title,
  intro,
  direction,
  steps,
  category,
  onAnswer,
  onComplete,
  onMistake,
  playTone,
}: LessonScreenProps & {
  title: string;
  intro: string;
  direction: "forward" | "backward";
  steps: ReadonlyArray<{
    plain: string;
    coded: string;
    path: string;
    options: readonly string[];
  }>;
  category: SkillCategory;
}) {
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<string[]>([]);
  const [solvedCurrent, setSolvedCurrent] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const step = steps[Math.min(index, steps.length - 1)];
  const source = step.plain;
  const target = step.coded;
  const sourceWord = steps.map((item) => item.plain).join("");
  const finalWord = steps.map((item) => item.coded).join("");

  function choose(answer: string) {
    const correct = answer === target;
    onAnswer(category, correct);
    playTone(correct);
    if (!correct) {
      setMistakes((current) => current + 1);
      onMistake({
        eyebrow:
          direction === "forward"
            ? "Encoding check · smaller example"
            : "Decoding check · smaller example",
        title:
          direction === "forward"
            ? "Try hiding M with key 3"
            : "Try recovering M from P",
        explanation:
          direction === "forward"
            ? "Encoding moves forward. In the small example, count N, O, P after M, so M becomes P."
            : "Decoding reverses the movement. In the small example, count O, N, M backward from P, so P returns to M.",
        workedSteps:
          direction === "forward"
            ? ["M", "N", "O", "P"]
            : ["P", "O", "N", "M"],
        rule:
          direction === "forward"
            ? "Encoding moves every plain letter forward by the key."
            : "Decoding moves every coded letter backward by the same key.",
      });
      return;
    }
    setSolvedCurrent(true);
    setResults((current) => [...current, answer]);
  }

  function advance() {
    if (index === steps.length - 1) {
      onComplete();
      return;
    }
    setIndex((current) => current + 1);
    setSolvedCurrent(false);
    setMistakes(0);
  }

  return (
    <div className={styles.screen}>
      <LessonHeading
        eyebrow={`Lesson ${direction === "forward" ? "5" : "6"} · ${
          direction === "forward" ? "Follow the algorithm" : "Reverse the rule"
        }`}
        title={title}
      >
        {intro}
      </LessonHeading>

      <div className={styles.guidedGrid}>
        <section className={styles.algorithmPanel}>
          <span className={styles.labLabel}>The four-step algorithm</span>
          <ol>
            <li className={styles.algorithmActive}>
              <strong>1</strong> Find the {direction === "forward" ? "plain" : "coded"} letter
            </li>
            <li>
              <strong>2</strong> Move {direction} 3 places
            </li>
            <li>
              <strong>3</strong> Choose the matching letter
            </li>
            <li>
              <strong>4</strong> Write it, then repeat
            </li>
          </ol>
          <div className={styles.wordRail}>
            <span>{direction === "forward" ? "Plain" : "Coded"}</span>
            {sourceWord.split("").map((letter, letterIndex) => (
              <i
                className={
                  letterIndex === index
                    ? styles.letterCurrent
                    : letterIndex < index
                      ? styles.letterDone
                      : ""
                }
                key={`${letter}-${letterIndex}`}
              >
                {letter}
              </i>
            ))}
          </div>
        </section>

        <section className={styles.stepLab}>
          <span className={styles.labLabel}>
            Letter {index + 1} of {steps.length}
          </span>
          <h2>
            {source} moves {direction} three places. What does it become?
          </h2>
          {solvedCurrent ? (
            <AnimatedLetterPath
              label={`${source} moves ${direction} three places`}
              path={step.path}
            />
          ) : (
            <div className={styles.letterPath}>
              {`${source} → ? → ? → ?`}
            </div>
          )}
          <div className={styles.largeChoices}>
            {step.options.map((option) => (
              <button
                className={
                  solvedCurrent && option === target ? styles.choiceCorrect : ""
                }
                disabled={solvedCurrent}
                key={option}
                onClick={() => choose(option)}
                type="button"
              >
                {option}
              </button>
            ))}
          </div>
          {solvedCurrent ? (
            <Feedback kind="success">
              {step.path}. The movement is always {direction} by the key, which
              is 3.
            </Feedback>
          ) : (
            <Feedback kind={mistakes > 0 ? "error" : "info"}>
              {mistakes >= 2
                ? `Show me: say each letter while moving ${direction}: ${step.path}.`
                : `Predict first. Then count exactly three letters ${direction}.`}
            </Feedback>
          )}
          {solvedCurrent ? (
            <button className={styles.primaryAction} onClick={advance} type="button">
              {index === steps.length - 1
                ? `Reveal ${finalWord}`
                : "Explain next letter"}
              <ArrowRight aria-hidden="true" />
            </button>
          ) : null}
        </section>
      </div>

      <section className={styles.resultStrip}>
        <div>
          <span>{direction === "forward" ? "Plain message" : "Coded message"}</span>
          <strong>{sourceWord}</strong>
        </div>
        <ArrowRight aria-hidden="true" />
        <div>
          <span>{direction === "forward" ? "Encrypted result" : "Plain result"}</span>
          <strong>
            {results.join("")}
            {"?".repeat(steps.length - results.length)}
          </strong>
        </div>
      </section>

      {results.length === steps.length ? (
        <ConceptReveal
          icon={<BrainCircuit aria-hidden="true" />}
          title={`${sourceWord} becomes ${finalWord}`}
        >
          You used one rule for every letter. That repeated, ordered process is
          an algorithm.
        </ConceptReveal>
      ) : null}
    </div>
  );
}

const countPath = ["U", "V", "W", "X", "Y", "Z", "A", "B", "C", "D", "E"];

function MissingKeyScreen({
  onAnswer,
  onComplete,
  onMistake,
  playTone,
}: LessonScreenProps) {
  const [count, setCount] = useState(0);
  const [verifications, setVerifications] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState(
    "Start at plain T. Count each forward move until you reach coded E.",
  );

  function countLetter(letter: string) {
    const expected = countPath[count];
    const correct = letter === expected;
    onAnswer("transfer", correct);
    playTone(correct);
    if (!correct) {
      const previous = count === 0 ? "T" : countPath[count - 1];
      setMessage(`After ${previous}, move to the very next letter.`);
      onMistake({
        eyebrow: "Key finder · smaller example",
        title: "Measure a short shift first",
        explanation:
          "To measure the shift from C to F, touch each new letter once. D is move 1, E is move 2 and F is move 3. Use that same one-at-a-time count on the intercepted pair.",
        workedSteps: ["C", "1: D", "2: E", "3: F"],
        rule:
          "To measure a key, count every forward move from the plain letter to its coded partner.",
      });
      return;
    }
    setCount((current) => current + 1);
    setMessage(
      letter === "E"
        ? "You reached E in 11 moves. The missing key is 11."
        : `${count + 1} move${count === 0 ? "" : "s"}. Keep counting forward.`,
    );
  }

  function verify(id: string, answer: string, expected: string) {
    const correct = answer === expected;
    onAnswer("transfer", correct);
    playTone(correct);
    if (!correct) {
      setMessage("Use the same +11 rule. A new pair must agree with the key.");
      onMistake({
        eyebrow: "Pattern verification · smaller example",
        title: "Test a key-2 code twice",
        explanation:
          "If C moves to E with key 2, a second pair must use the same movement: P moves through Q to R. A pair that uses a different distance cannot belong to that code.",
        workedSteps: ["C +2 → E", "P +2 → R", "Same distance both times"],
        rule:
          "A valid Caesar key uses the same shift for every letter in the message.",
      });
      return;
    }
    const next = new Set(verifications);
    next.add(id);
    setVerifications(next);
    if (count === 11 && next.size === 2) onComplete();
  }

  return (
    <div className={styles.screen}>
      <LessonHeading
        eyebrow="Lesson 7 · Transfer to a new key"
        title="Find the missing key"
      >
        This intercepted message does not use key 3. Infer its key by comparing
        one original letter with its coded partner.
      </LessonHeading>

      <section className={styles.intercept}>
        <span>Encrypted message</span>
        <strong>ESTD XPDDLRP TD STOOPY</strong>
        <p>
          Intelligence clue: the original message begins with <b>THIS</b>.
          Therefore plain <b>T</b> became coded <b>E</b>.
        </p>
      </section>

      <div className={styles.countLab}>
        <section>
          <span className={styles.labLabel}>Count-around calculator</span>
          <h2>How many forward moves take T to E?</h2>
          <div className={styles.countPath}>
            <i className={styles.pathStart}>T</i>
            {countPath.map((letter, index) => (
              <button
                className={index < count ? styles.pathCounted : ""}
                disabled={index < count}
                key={`${letter}-${index}`}
                onClick={() => countLetter(letter)}
                type="button"
              >
                {letter}
              </button>
            ))}
          </div>
          <output>{count} moves counted</output>
          <Feedback kind={count === 11 ? "success" : "info"}>{message}</Feedback>
        </section>

        <section className={styles.keyResult}>
          <KeyRound aria-hidden="true" />
          <span>Calculated key</span>
          <strong>{count === 11 ? "11" : "?"}</strong>
          <p>T → E wraps around the end of the alphabet.</p>
        </section>
      </div>

      {count === 11 ? (
        <section className={styles.verifyLab}>
          <div>
            <span className={styles.labLabel}>Verify the pattern</span>
            <h2>A real key must work for other letters too.</h2>
          </div>
          <MappingCheck
            done={verifications.has("h")}
            from="H"
            onChoose={(answer) => verify("h", answer, "S")}
            options={["R", "S", "T"]}
            target="S"
          />
          <MappingCheck
            done={verifications.has("i")}
            from="I"
            onChoose={(answer) => verify("i", answer, "T")}
            options={["S", "T", "U"]}
            target="T"
          />
        </section>
      ) : null}

      {verifications.size === 2 ? (
        <ConceptReveal
          icon={<Eye aria-hidden="true" />}
          title="Transfer solved"
        >
          T→E, H→S, and I→T all use +11. Reversing key 11 reveals:
          <strong> THIS MESSAGE IS HIDDEN.</strong>
        </ConceptReveal>
      ) : null}
    </div>
  );
}

function MappingCheck({
  from,
  options,
  done,
  onChoose,
  target,
}: {
  from: string;
  options: string[];
  done: boolean;
  onChoose: (answer: string) => void;
  target: string;
}) {
  return (
    <article className={styles.mappingCheck}>
      <strong>{from}</strong>
      <ArrowRight aria-hidden="true" />
      {(done ? [target] : options).map((option) => (
        <button
          className={done ? styles.choiceCorrect : ""}
          disabled={done}
          key={option}
          onClick={() => onChoose(option)}
          type="button"
        >
          {option}
        </button>
      ))}
    </article>
  );
}

function CreateMessageScreen({
  onAnswer,
  onComplete,
  onMistake,
  playTone,
}: LessonScreenProps) {
  const [word, setWord] = useState("AGENT");
  const [keyValue, setKeyValue] = useState(3);
  const [prediction, setPrediction] = useState("");
  const [result, setResult] = useState("");
  const [rounds, setRounds] = useState<Set<number>>(new Set());
  const [mistakes, setMistakes] = useState(0);
  const expected = shiftedLetter(word[0] || "A", keyValue);

  function selectKey(value: number) {
    setKeyValue(value);
    setPrediction("");
    setResult("");
    setMistakes(0);
  }

  function checkPrediction() {
    const correct = prediction.toUpperCase() === expected;
    onAnswer("transfer", correct);
    playTone(correct);
    if (!correct) {
      setMistakes((current) => current + 1);
      onMistake({
        eyebrow: "Creator prediction · smaller example",
        title: "Try the first letter of SUN",
        explanation:
          "With key 2, the first letter S moves through T and lands on U. Predict just one letter this way before asking the algorithm to repeat.",
        workedSteps: ["S", "move 1: T", "move 2: U"],
        rule:
          "Predicting one letter proves that you understand the key before the computer repeats the algorithm.",
      });
      return;
    }
    setResult(encode(word, keyValue));
    const next = new Set(rounds);
    next.add(keyValue);
    setRounds(next);
    if (next.size >= 2) onComplete();
  }

  return (
    <div className={styles.screen}>
      <LessonHeading
        eyebrow="Lesson 8 · Generalise the algorithm"
        title="Make your own secret"
      >
        Choose a message and key, predict the first mapping, then let the
        algorithm repeat for the whole word. Try two keys to compare the result.
      </LessonHeading>

      <div className={styles.creatorGrid}>
        <section className={styles.creatorForm}>
          <label>
            <span>1 · Choose a short word</span>
            <input
              maxLength={8}
              onChange={(event) => {
                const clean = event.target.value.toUpperCase().replace(/[^A-Z]/g, "");
                setWord(clean);
                setPrediction("");
                setResult("");
              }}
              value={word}
            />
          </label>

          <fieldset>
            <legend>2 · Select a key</legend>
            <div className={styles.keyChoices}>
              {[1, 3, 5, 10, 13, 20].map((value) => (
                <button
                  className={keyValue === value ? styles.keyActive : ""}
                  key={value}
                  onClick={() => selectKey(value)}
                  type="button"
                >
                  {value}
                  {rounds.has(value) ? <Check aria-label="Tried" /> : null}
                </button>
              ))}
            </div>
          </fieldset>

          <label>
            <span>
              3 · Predict: {word[0] || "A"} + {keyValue} becomes…
            </span>
            <div className={styles.predictionInput}>
              <input
                aria-label="Predicted first coded letter"
                maxLength={1}
                onChange={(event) =>
                  setPrediction(
                    event.target.value.toUpperCase().replace(/[^A-Z]/g, ""),
                  )
                }
                value={prediction}
              />
              <button
                disabled={!word || !prediction}
                onClick={checkPrediction}
                type="button"
              >
                Check prediction
              </button>
            </div>
          </label>

          <Feedback kind={result ? "success" : mistakes ? "error" : "info"}>
            {result
              ? `${word[0]} → ${expected}. The same +${keyValue} rule encoded every remaining letter.`
              : mistakes >= 2
                ? `Show me: start at ${word[0] || "A"} and count ${keyValue} places forward.`
                : "Predicting one letter proves you understand the key before the computer repeats the rule."}
          </Feedback>
        </section>

        <section className={styles.creatorOutput}>
          <span className={styles.labLabel}>Creator console</span>
          <div>
            <small>Plain message</small>
            <strong>{word || "TYPE A WORD"}</strong>
          </div>
          <ArrowRight aria-hidden="true" />
          <div>
            <small>Encrypted with key {keyValue}</small>
            <strong>{result || "•••••"}</strong>
          </div>
          <ol>
            <li><Check aria-hidden="true" /> Choose a message</li>
            <li><Check aria-hidden="true" /> Decide the key</li>
            <li className={result ? styles.algorithmDone : ""}>
              <Check aria-hidden="true" /> Shift each letter equally
            </li>
            <li className={result ? styles.algorithmDone : ""}>
              <Check aria-hidden="true" /> Write the coded message
            </li>
          </ol>
        </section>
      </div>

      {rounds.size === 1 ? (
        <ConceptReveal
          icon={<Sparkles aria-hidden="true" />}
          title="One more experiment"
        >
          Choose a different key and predict again. The word changes, but the
          algorithm stays the same.
        </ConceptReveal>
      ) : null}

      {rounds.size >= 2 ? (
        <ConceptReveal
          icon={<BrainCircuit aria-hidden="true" />}
          title="Generalisation unlocked"
        >
          You changed the message and key, yet the same algorithm still worked.
          A useful rule can be applied to many inputs.
        </ConceptReveal>
      ) : null}
    </div>
  );
}

const retrievalQuestions = [
  {
    id: "key",
    prompt: "What does the key tell us?",
    options: [
      "How many places each letter moves",
      "How long the message is",
      "Who wrote the message",
    ],
    correct: "How many places each letter moves",
    why: "The key is the fixed shift number used for every letter.",
  },
  {
    id: "decode",
    prompt: "To decode a +3 message, which way do we move?",
    options: ["Forward 3", "Backward 3", "Do not move"],
    correct: "Backward 3",
    why: "Decoding reverses the movement used for encoding.",
  },
  {
    id: "unique",
    prompt: "With one fixed key, can two plain letters become the same coded letter?",
    options: ["Yes", "No"],
    correct: "No",
    why: "Every alphabet letter keeps one unique matching partner on the wheel.",
  },
  {
    id: "count",
    prompt: "How many meaningful Caesar shift keys are there?",
    options: ["25", "26", "52"],
    correct: "25",
    why: "Shift 26 returns every letter to itself, so it hides nothing.",
  },
] as const;

function SecurityScreen({
  metrics,
  onAnswer,
  onComplete,
  onMistake,
  playTone,
}: LessonScreenProps) {
  const [keyAnswer, setKeyAnswer] = useState<number | null>(null);
  const [scan, setScan] = useState(false);
  const [quiz, setQuiz] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState(
    "First decide whether shift 26 creates a new coded alphabet.",
  );
  const missionComplete = keyAnswer === 25 && scan && quiz.size === 4;

  function answerKey(value: number) {
    const correct = value === 25;
    onAnswer("security", correct);
    playTone(correct);
    if (!correct) {
      const explanation =
        "Use a miniature circular alphabet to see which full-turn shift changes nothing, then transfer that idea to the real alphabet.";
      setMessage(explanation);
      onMistake({
        eyebrow: "Security evaluation · smaller example",
        title: "Try a four-symbol alphabet",
        explanation,
        workedSteps: [
          "Symbols: A, B, C, D",
          "Shift 1, 2 or 3 changes A",
          "Shift 4 makes a full turn back to A",
        ],
        rule:
          "On any circular alphabet, one complete turn changes nothing. Count only the smaller shifts that create a different mapping.",
      });
      return;
    }
    setKeyAnswer(25);
    setMessage(
      "Correct. Only shifts 1 to 25 change the message. Shift 26 is the same as shift 0.",
    );
  }

  function runScan() {
    setScan(true);
    playTone(true);
    setMessage(
      "A computer can try all 25 meaningful keys quickly. Caesar Cipher is a learning puzzle, not banking protection.",
    );
  }

  function answerQuestion(
    question: (typeof retrievalQuestions)[number],
    answer: string,
  ) {
    if (quiz.has(question.id)) return;
    const correct = answer === question.correct;
    onAnswer("security", correct);
    playTone(correct);
    if (!correct) {
      setMessage("Use the smaller example in the learning popup, then retry.");
      const examples = {
        key: {
          title: "Try an instruction card and number card",
          explanation:
            "A card saying “walk forward” supplies the action. A separate card showing 4 supplies the amount. Match those roles to the parts of a cipher.",
          workedSteps: ["Action card: walk", "Amount card: 4", "Combine them"],
          rule: "Separate what action happens from the value that controls it.",
        },
        decode: {
          title: "Undo a two-step move",
          explanation:
            "A token was hidden by moving two spaces to the right. To recover its old space, move the token two spaces in the opposite direction.",
          workedSteps: ["Hide: right 2", "Undo: opposite direction 2"],
          rule: "Decoding reverses the direction used during encoding.",
        },
        unique: {
          title: "Try rotating numbered seats",
          explanation:
            "Four students move one seat clockwise. Each student still lands on a different seat because everyone follows the same rotation.",
          workedSteps: ["One student per seat", "Rotate everyone equally", "One student per new seat"],
          rule: "A fixed circular shift keeps one unique partner for every starting position.",
        },
        count: {
          title: "Count useful turns on a tiny wheel",
          explanation:
            "A wheel has four positions. Turns of 1, 2 and 3 change the position, while turn 4 returns to the start.",
          workedSteps: ["4 positions", "3 smaller turns change it", "A full turn changes nothing"],
          rule: "Useful shifts are the ones smaller than one complete turn.",
        },
      }[question.id];
      onMistake({
        eyebrow: "Memory checkpoint · smaller example",
        title: examples.title,
        explanation: examples.explanation,
        workedSteps: examples.workedSteps,
        rule: examples.rule,
      });
      return;
    }
    const next = new Set(quiz);
    next.add(question.id);
    setQuiz(next);
    setMessage(question.why);
    if (keyAnswer === 25 && scan && next.size === 4) onComplete();
  }

  const candidateKeys = useMemo(
    () =>
      Array.from({ length: 25 }, (_, index) => ({
        key: index + 1,
        result: decode("KHOOR", index + 1),
      })),
    [],
  );

  return (
    <div className={styles.screen}>
      <LessonHeading
        eyebrow="Lesson 9 · Evaluate and remember"
        title="Security lab"
      >
        A method can work and still be too weak for real security. Test the
        number of keys, then retrieve the important ideas without hints.
      </LessonHeading>

      <section className={styles.securityQuestion}>
        <div>
          <span className={styles.labLabel}>The 26th mystery</span>
          <h2>Are there 25 or 26 meaningful Caesar shifts?</h2>
          <p>
            Imagine shifting A by 26 places. You travel around the entire
            alphabet and land on A again.
          </p>
        </div>
        <div className={styles.securityChoices}>
          {[25, 26].map((value) => (
            <button
              className={keyAnswer === value ? styles.choiceCorrect : ""}
              key={value}
              onClick={() => answerKey(value)}
              type="button"
            >
              <strong>{value}</strong>
              <span>meaningful shifts</span>
            </button>
          ))}
        </div>
      </section>

      <Feedback kind={keyAnswer === 25 ? "success" : "info"}>
        {message}
      </Feedback>

      {keyAnswer === 25 ? (
        <section className={styles.scanLab}>
          <div>
            <span className={styles.labLabel}>Brute-force demonstration</span>
            <h2>What if we try every possible key?</h2>
            <p>
              The coded word is KHOOR. A computer does not need to guess once;
              it can test all 25 choices.
            </p>
          </div>
          <button className={styles.primaryAction} onClick={runScan} type="button">
            <ScanLine aria-hidden="true" /> Run all 25 keys
          </button>
          {scan ? (
            <div className={styles.scanResults}>
              {candidateKeys.map((candidate) => (
                <span
                  className={`${styles.scanCandidate} ${
                    candidate.key === 3 ? styles.scanMatch : ""
                  }`}
                  key={candidate.key}
                  style={{ animationDelay: `${candidate.key * 45}ms` }}
                >
                  <small>Key {candidate.key}</small>
                  <strong>{candidate.result}</strong>
                  {candidate.key === 3 ? <Check aria-label="Readable word" /> : null}
                </span>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {scan ? (
        <>
          <ConceptReveal
            icon={<ShieldCheck aria-hidden="true" />}
            title="Puzzle security is not real security"
          >
            Caesar Cipher is useful for learning patterns. ATM PINs, UPI
            payments, and bank-card data need modern encryption with far more
            possible keys and much stronger mathematical methods.
          </ConceptReveal>

          <section className={styles.retrievalLab}>
            <div>
              <span className={styles.labLabel}>Memory checkpoint</span>
              <h2>Answer without looking back</h2>
            </div>
            {retrievalQuestions.map((question, index) => (
              <article key={question.id}>
                <span>{index + 1}</span>
                <div>
                  <h3>{question.prompt}</h3>
                  <div className={styles.quizChoices}>
                    {question.options.map((option) => (
                      <button
                        className={
                          quiz.has(question.id) &&
                          option === question.correct
                            ? styles.choiceCorrect
                            : ""
                        }
                        disabled={quiz.has(question.id)}
                        key={option}
                        onClick={() => answerQuestion(question, option)}
                        type="button"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  {quiz.has(question.id) ? <p>{question.why}</p> : null}
                </div>
              </article>
            ))}
          </section>
        </>
      ) : null}

      {missionComplete ? (
        <MissionSummary metrics={metrics} />
      ) : null}
    </div>
  );
}

function MissionSummary({ metrics }: { metrics: SkillMetrics }) {
  const categories: Array<[SkillCategory, string]> = [
    ["knowledge", "Concept knowledge"],
    ["procedure", "Encoding procedure"],
    ["transfer", "Transfer to new examples"],
    ["security", "Security reasoning"],
  ];

  return (
    <section className={styles.missionSummary}>
      <div className={styles.summarySeal}>
        <ShieldCheck aria-hidden="true" />
      </div>
      <span>Mission complete</span>
      <h2>You can explain the cipher, not just operate it.</h2>
      <div className={styles.masteryGrid}>
        {categories.map(([category, label]) => {
          const result = metrics[category];
          const score = result.attempts
            ? Math.round((result.correct / result.attempts) * 100)
            : 100;
          return (
            <div key={category}>
              <span>{label}</span>
              <strong>{score >= 75 ? "Mastered" : "Keep practising"}</strong>
              <i>
                <b style={{ width: `${Math.max(20, score)}%` }} />
              </i>
            </div>
          );
        })}
      </div>
      <div className={styles.memoryCard}>
        <BookOpen aria-hidden="true" />
        <div>
          <span>Memory card</span>
          <strong>
            Choose a key → shift every letter equally → reverse the shift to
            decode.
          </strong>
        </div>
      </div>
    </section>
  );
}

function ConceptReveal({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className={styles.conceptReveal}>
      <div>{icon}</div>
      <span>
        <strong>{title}</strong>
        <p>{children}</p>
      </span>
    </section>
  );
}
