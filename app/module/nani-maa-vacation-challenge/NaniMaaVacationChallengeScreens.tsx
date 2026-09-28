"use client";

import {
  Candy,
  Check,
  Footprints,
  Handshake,
  Minus,
  PartyPopper,
  Plus,
} from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { useEffect, useState } from "react";
import {
  type MistakeFeedback,
  PracticeSet,
  type PracticeQuestion,
} from "../../components/learning/LearningSupport";
import { ExampleWalkthrough } from "../../components/learning/TeachingAnimations";
import type { NmvMetrics, NmvSkill } from "./nani-maa-vacation-challenge-support";
import styles from "./nani-maa-vacation-challenge.module.css";

type NmvScreenProps = {
  completed: boolean;
  metrics: NmvMetrics;
  onAnswer: (skill: NmvSkill, correct: boolean) => void;
  onComplete: () => void;
  onMistake: (feedback: MistakeFeedback) => void;
  playTone: (correct: boolean) => void;
};

export function NmvStage({
  screen,
  ...props
}: NmvScreenProps & { screen: number }) {
  switch (screen) {
    case 0:
      return <SharingCluster {...props} />;
    case 1:
      return <FrogHopCluster {...props} />;
    case 2:
      return <PointsGameCluster {...props} />;
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
        <PartyPopper aria-hidden="true" />
      )}
      <span>{children}</span>
    </div>
  );
}

function CandyJar({ label, count }: { label: string; count: number }) {
  return (
    <div
      aria-label={`${label} jar with ${count} candies`}
      className={styles.candyJar}
      role="img"
    >
      <span className={styles.candyJarLabel}>{label}</span>
      <div aria-hidden="true" className={styles.candyJarBody}>
        {Array.from({ length: count }).map((_, index) => (
          <span
            className={styles.candyPiece}
            key={index}
            style={{ "--candy-index": index } as CSSProperties}
          >
            🍬
          </span>
        ))}
      </div>
      <strong aria-hidden="true">{count}</strong>
    </div>
  );
}

function NumberStepper({
  label,
  value,
  onChange,
  max = 9,
  min = 0,
}: {
  label: string;
  value: number;
  onChange: (next: number) => void;
  max?: number;
  min?: number;
}) {
  return (
    <div className={styles.stepper}>
      <span>{label}</span>
      <div>
        <button
          aria-label={`Decrease ${label}`}
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
          type="button"
        >
          <Minus aria-hidden="true" />
        </button>
        <strong>{value}</strong>
        <button
          aria-label={`Increase ${label}`}
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
          type="button"
        >
          <Plus aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

function FrogTrack({
  position,
  hopping,
  maxRange,
  target,
}: {
  position: number;
  hopping: boolean;
  maxRange: number;
  target?: number;
}) {
  const ticks = Array.from({ length: maxRange + 1 }, (_, index) => index);
  return (
    <div
      aria-label={`Number line frog track, frog is at ${position}`}
      className={styles.frogTrack}
      role="img"
    >
      <div className={styles.frogTrackLine}>
        {ticks.map((tick) => (
          <span
            className={`${styles.frogTick} ${
              target === tick ? styles.frogTickTarget : ""
            }`}
            key={tick}
            style={{ left: `${(tick / maxRange) * 100}%` }}
          >
            {tick % 2 === 0 ? <small>{tick}</small> : null}
          </span>
        ))}
        <span
          aria-hidden="true"
          className={`${styles.frogToken} ${hopping ? styles.frogHopping : ""}`}
          style={{ left: `${(position / maxRange) * 100}%` }}
        >
          🐸
        </span>
      </div>
    </div>
  );
}

/* Cluster 1 · Fair sharing */

const sharingExampleJars: Array<{
  a: number;
  b: number;
  c: number;
  highlight?: "a" | "c";
}> = [
  { a: 2, b: 5, c: 8 },
  { a: 2, b: 5, c: 8 },
  { a: 2, b: 5, c: 8 },
  { a: 2, b: 5, c: 8, highlight: "a" },
  { a: 5, b: 5, c: 5 },
];

const sharingExampleSteps = [
  "Nani Maa has three jars: Jar A has 2 candies, Jar B has 5, and Jar C has 8.",
  "Add them all together: 2 + 5 + 8 = 15 candies in total.",
  "Share 15 candies equally into 3 jars: 15 ÷ 3 = 5. That's the fair share!",
  "Jar A has only 2, so it needs 3 more. Jar C has 8, so it has 3 extra.",
  "Move the extra 3 candies from Jar C into Jar A. Now every jar has exactly 5!",
];

function SharingExampleVisual({ frame }: { frame: (typeof sharingExampleJars)[number] }) {
  return (
    <div className={styles.jarRow}>
      <CandyJar count={frame.a} label="Jar A" />
      <CandyJar count={frame.b} label="Jar B" />
      <CandyJar count={frame.c} label="Jar C" />
    </div>
  );
}

const sortJars = [
  { id: "a", label: "Jar A", count: 2, correct: "Needs more" },
  { id: "b", label: "Jar B", count: 5, correct: "Just right" },
  { id: "c", label: "Jar C", count: 8, correct: "Has extra" },
] as const;

function SharingCluster({
  onAnswer,
  onComplete,
  onMistake,
  playTone,
}: NmvScreenProps) {
  const [sorted, setSorted] = useState<Record<string, string>>({});
  const [moved, setMoved] = useState(0);
  const [checked, setChecked] = useState(false);
  const [practiceDone, setPracticeDone] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const sortDone = Object.keys(sorted).length === sortJars.length;
  const aCount = 2 + moved;
  const cCount = 8 - moved;
  const moveDone = checked && aCount === 5 && cCount === 5;

  useEffect(() => {
    if (moveDone && practiceDone) onComplete();
  }, [moveDone, practiceDone, onComplete]);

  function chooseSort(jar: (typeof sortJars)[number], value: string) {
    if (sorted[jar.id]) return;
    const correct = value === jar.correct;
    onAnswer("share", correct);
    playTone(correct);
    if (!correct) {
      onMistake({
        eyebrow: "Sort the jars · smaller example",
        title: "Compare a 2-candy jar with 4",
        explanation:
          "If the fair share is 4 and a small jar contains 2 candies, the jar is below the target because it needs 2 more.",
        workedSteps: ["Fair share: 4", "Jar: 2", "2 is below 4", "Use the same comparison on this jar"],
        rule: "Every jar is either short of the fair share, sitting right on it, or over it.",
      });
      return;
    }
    setSorted((current) => ({ ...current, [jar.id]: value }));
  }

  function updateMoved(next: number) {
    setChecked(false);
    setMoved(next);
  }

  function checkMove() {
    setChecked(true);
    const correct = aCount === 5 && cCount === 5;
    onAnswer("share", correct);
    playTone(correct);
    if (correct) return;
    onMistake({
      eyebrow: "Move the candies · smaller example",
      title: "Balance jars with 1 and 7",
      explanation:
        "Two jars holding 1 and 7 candies contain 8 altogether, so their fair share is 4 each. Moving 3 from the full jar to the short jar makes 4 and 4.",
      workedSteps: ["1 + 7 = 8", "8 ÷ 2 = 4", "Move 3", "4 and 4"],
      rule: "The amount you take from the jar with extra always matches the amount the other jar needed.",
    });
  }

  const questions: PracticeQuestion[] = [
    {
      id: "share-handbook-money",
      source: "handbook",
      prompt:
        "During the vacation, A, B, and C save pocket money: A has 50 rupees, B has 100, and C has 150. How much money should B and C TOGETHER give to A so everyone ends up with the same amount?",
      options: ["15", "25", "50", "75"],
      correct: "50",
      mistake: {
        eyebrow: "Fair share · smaller example",
        title: "Share ₹30, ₹60 and ₹90",
        explanation:
          "The total is ₹180. Sharing it among 3 people gives ₹60 each, so the person with ₹90 gives away ₹30.",
        workedSteps: ["30 + 60 + 90 = 180", "180 ÷ 3 = 60 each", "90 − 60 = 30 to give"],
        rule: "Only people above the fair share need to give any away.",
      },
    },
    {
      id: "share-handbook-boxes",
      source: "handbook",
      prompt:
        "Three gift boxes have some candies: Box 1 has 2, Box 2 has 3, Box 3 has 2. If EACH box should have EXACTLY 3 candies, how many MORE candies do we need in total?",
      options: ["1", "2", "3", "4"],
      correct: "2",
      mistake: {
        eyebrow: "Top up boxes · smaller example",
        title: "Fill two boxes to 2",
        explanation:
          "If two boxes hold 1 and 2 candies and both should hold 2, the first needs 1 more while the second needs 0. The total top-up is 1.",
        workedSteps: ["Box A: 2 − 1 = 1", "Box B: 2 − 2 = 0", "1 + 0 = 1"],
        rule: "A box already at the target needs nothing extra.",
      },
    },
    {
      id: "share-fresh",
      source: "practice",
      prompt: "Jars have 3, 6, and 9 candies. What is the fair share if shared equally into 3 jars?",
      options: ["5", "6", "7", "9"],
      correct: "6",
      mistake: {
        eyebrow: "Fair share · smaller example",
        title: "Share jars with 2, 4 and 6",
        explanation: "These jars contain 12 candies altogether. Shared among 3 jars, that is 4 candies each.",
        workedSteps: ["2 + 4 + 6 = 12", "12 ÷ 3 = 4 each"],
        rule: "Fair share means every jar ends up with the exact same amount.",
      },
    },
  ];

  return (
    <div className={styles.screen}>
      <Heading eyebrow="Concept 1 · Fair sharing" title="Sharing Candies Fairly">
        Fair share means finding the total, then giving everyone the exact
        same amount. Anyone with extra can give it to someone who has less.
      </Heading>

      <ExampleWalkthrough
        onReveal={() => setRevealed(true)}
        renderStep={(index) => <SharingExampleVisual frame={sharingExampleJars[index]} />}
        revealed={revealed}
        steps={sharingExampleSteps}
        title="Sharing 15 candies fairly"
      />

      {revealed ? (
        <>
          <SectionLabel>Now you try it: sort the jars</SectionLabel>
          <p className={styles.prompt}>
            The fair share is 5 candies per jar. Sort each jar: does it need
            more, have extra, or is it just right?
          </p>

          <div className={styles.sortJars}>
            {sortJars.map((jar) => (
              <article className={styles.sortJarCard} key={jar.id}>
                <CandyJar count={jar.count} label={jar.label} />
                <div className={styles.choiceRow}>
                  {["Needs more", "Just right", "Has extra"].map((option) => (
                    <button
                      className={sorted[jar.id] === option ? styles.choiceCorrect : ""}
                      disabled={Boolean(sorted[jar.id])}
                      key={option}
                      onClick={() => chooseSort(jar, option)}
                      type="button"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </article>
            ))}
          </div>

          {sortDone ? (
            <>
              <SectionLabel>Now move the candies</SectionLabel>
              <p className={styles.prompt}>
                Jar B is already fair with 5 candies. Move candies from Jar C
                into Jar A until BOTH reach the fair share.
              </p>

              <div className={styles.jarRow}>
                <CandyJar count={aCount} label="Jar A" />
                <CandyJar count={5} label="Jar B" />
                <CandyJar count={cCount} label="Jar C" />
              </div>

              <NumberStepper
                label="Candies moved from C to A"
                max={3}
                onChange={updateMoved}
                value={moved}
              />

              <button
                className={styles.primaryAction}
                disabled={moveDone}
                onClick={checkMove}
                type="button"
              >
                <Candy aria-hidden="true" /> Check the jars
              </button>

              <Feedback kind={moveDone ? "success" : "info"}>
                {moveDone
                  ? "Both jars now have the fair share! Now finish the practice questions below."
                  : "Move candies, then check the jars."}
              </Feedback>
            </>
          ) : (
            <Feedback kind="info">Sort all three jars to unlock the next step.</Feedback>
          )}

          <PracticeSet
            onAllComplete={() => setPracticeDone(true)}
            onAnswer={onAnswer}
            onMistake={onMistake}
            playTone={playTone}
            questions={questions}
            skill="share"
          />
        </>
      ) : null}
    </div>
  );
}

/* Cluster 2 · Frog hop tracking */

const frogExampleSteps = [
  "A frog starts at 0 on a number line.",
  "It hops forward 4 steps...",
  "...then slips back 2 steps. It rests at 2.",
  "So ONE full hop moves the frog forward 4, then back 2 — a NET move of 2.",
  "After 5 hops like this, the frog will be at 5 × 2 = 10.",
];

const frogExamplePositions = [0, 4, 2, 2, 10];

function FrogHopCluster({
  onAnswer,
  onComplete,
  onMistake,
  playTone,
}: NmvScreenProps) {
  const [hopsCount, setHopsCount] = useState(0);
  const [position, setPosition] = useState(0);
  const [hopping, setHopping] = useState(false);
  const [answer, setAnswer] = useState<string>();
  const [practiceDone, setPracticeDone] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const maxHops = 5;
  const hopSolved = answer === "10";

  useEffect(() => {
    if (hopSolved && practiceDone) onComplete();
  }, [hopSolved, practiceDone, onComplete]);

  function hop() {
    if (hopsCount >= maxHops || hopping) return;
    setHopping(true);
    setPosition((current) => current + 4);
    window.setTimeout(() => {
      setPosition((current) => current - 2);
      setHopsCount((current) => current + 1);
      setHopping(false);
    }, 420);
  }

  function choose(value: string) {
    const correct = value === "10";
    setAnswer(value);
    onAnswer("track", correct);
    playTone(correct);
    if (correct) return;
    onMistake({
      eyebrow: "Frog hop · smaller example",
      title: "Try two smaller hops",
      explanation:
        "A frog that goes forward 3 and back 1 gains 2 spaces per full hop. After 2 full hops it gains 4 spaces.",
      workedSteps: ["3 − 1 = 2 per hop", "2 × 2 hops = 4"],
      rule: "Multiply the net move of one hop by how many hops happen.",
    });
  }

  const questions: PracticeQuestion[] = [
    {
      id: "frog-handbook",
      source: "handbook",
      prompt:
        "A frog stands at 0 on a number line. Each turn, it jumps forward 4 steps then slips back 2 steps. In how many jumps will the frog reach the number 18 for the FIRST time?",
      options: ["8", "9", "10", "11"],
      correct: "8",
      mistake: {
        eyebrow: "Watch the peak · smaller example",
        title: "Find when a mini frog first touches 7",
        explanation:
          "A frog jumps forward 3 and slips back 1. Its peaks are 3, 5 and 7, so it first touches 7 during hop 3 before slipping.",
        workedSteps: ["Hop 1 peak: 3", "Hop 2 peak: 5", "Hop 3 peak: 7"],
        rule: "A frog can touch a number on the way up, even if it later slips back past it.",
      },
    },
    {
      id: "frog-fresh",
      source: "practice",
      prompt: "The same frog (forward 4, back 2) starts at 0. During which hop does it FIRST touch 14?",
      options: ["5", "6", "7", "8"],
      correct: "6",
      mistake: {
        eyebrow: "Watch the peak · smaller example",
        title: "Track a forward-2, back-1 frog",
        explanation:
          "Starting at 0, this mini frog reaches peaks 2, 3 and 4. It first touches 4 on hop 3, before the third slip.",
        workedSteps: ["Hop 1 peak: 2", "Hop 2 peak: 3", "Hop 3 peak: 4"],
        rule: "The frog can touch a number on the way up, even if it later slips back past it.",
      },
    },
  ];

  return (
    <div className={styles.screen}>
      <Heading eyebrow="Concept 2 · Tracking change" title="Frog Hop Garden Game">
        When something changes by the same amount every turn, we can
        predict where it ends up by working out the NET change per turn.
      </Heading>

      <ExampleWalkthrough
        onReveal={() => setRevealed(true)}
        renderStep={(index) => (
          <FrogTrack hopping={false} maxRange={12} position={frogExamplePositions[index]} />
        )}
        revealed={revealed}
        steps={frogExampleSteps}
        title="One hop, forward then back"
      />

      {revealed ? (
        <>
          <SectionLabel>Now you try it: hop in the garden</SectionLabel>
          <p className={styles.prompt}>
            In Nani Maa&rsquo;s garden, a toy frog hops forward 4 steps, then slips
            back 2 steps, every single turn. Press Hop to watch it move!
          </p>

          <FrogTrack hopping={hopping} maxRange={16} position={position} />

          <div className={styles.hopControls}>
            <button
              className={styles.primaryAction}
              disabled={hopsCount >= maxHops || hopping}
              onClick={hop}
              type="button"
            >
              <Footprints aria-hidden="true" /> Hop!
            </button>
            <span className={styles.hopCount}>
              Hops so far: {hopsCount} / {maxHops}
            </span>
          </div>

          {hopsCount >= maxHops ? (
            <>
              <p className={styles.prompt}>After 5 full hops, where will the frog be?</p>
              <div className={styles.choiceRow}>
                {["8", "10", "12", "20"].map((option) => (
                  <button
                    className={
                      answer === option
                        ? option === "10"
                          ? styles.choiceCorrect
                          : styles.choiceWrong
                        : ""
                    }
                    disabled={answer === "10"}
                    key={option}
                    onClick={() => choose(option)}
                    type="button"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <p className={styles.prompt}>Keep hopping to see where the frog lands!</p>
          )}

          <Feedback kind={hopSolved ? "success" : "info"}>
            {hopSolved
              ? "Yes! A net move of 2 per hop, times 5 hops, lands on 10. Now finish the practice questions below."
              : "Hop all 5 times, then use the pattern you see to answer."}
          </Feedback>

          <PracticeSet
            onAllComplete={() => setPracticeDone(true)}
            onAnswer={onAnswer}
            onMistake={onMistake}
            playTone={playTone}
            questions={questions}
            skill="track"
          />
        </>
      ) : null}
    </div>
  );
}

/* Cluster 3 · Points game strategy */

const scoreExampleSteps = [
  "X, Y, and Z each start with 100 points. They play 5 rounds. The winner of each round takes 10 points from EACH other player.",
  "Z loses round 1: Z gives 10 points to the winner. Z now has 90.",
  "Z loses rounds 2 and 3 too, losing 10 more each time. Z now has 70.",
  "Z WINS round 4! Z takes 10 points from EACH of the other two players: +20. Z now has 90.",
  "Z loses round 5: Z gives away 10 more. Z's FINAL score is 80.",
];

const scoreExampleZ = [100, 90, 70, 90, 80];

function ScoreExampleVisual({ score }: { score: number }) {
  return (
    <div className={styles.scoreBoard}>
      <span>
        <small>Z&rsquo;s score</small>
        <strong>{score}</strong>
      </span>
    </div>
  );
}

const rounds = [1, 2, 3];

function PointsGameCluster({
  onAnswer,
  onComplete,
  onMistake,
  playTone,
}: NmvScreenProps) {
  const [winners, setWinners] = useState<Record<number, "you" | "cousin">>({});
  const [checked, setChecked] = useState(false);
  const [practiceDone, setPracticeDone] = useState(false);
  const [revealed, setRevealed] = useState(false);

  function pickWinner(round: number, winner: "you" | "cousin") {
    setChecked(false);
    setWinners((current) => ({ ...current, [round]: winner }));
  }

  const scores = rounds.reduce(
    (totals, round) => {
      const winner = winners[round];
      if (!winner) return totals;
      return winner === "you"
        ? { you: totals.you + 3, cousin: totals.cousin - 1 }
        : { you: totals.you - 1, cousin: totals.cousin + 3 };
    },
    { you: 10, cousin: 10 },
  );

  const allPicked = rounds.every((round) => winners[round]);
  const cousinWinCount = Object.values(winners).filter(
    (winner) => winner === "cousin",
  ).length;
  const gameSolved =
    checked && allPicked && cousinWinCount >= 1 && scores.you > scores.cousin;

  useEffect(() => {
    if (gameSolved && practiceDone) onComplete();
  }, [gameSolved, practiceDone, onComplete]);

  function check() {
    setChecked(true);
    const correct = allPicked && cousinWinCount >= 1 && scores.you > scores.cousin;
    onAnswer("strategy", correct);
    playTone(correct);
    if (correct) return;
    onMistake({
      eyebrow: "Points game · smaller example",
      title: "Score a three-round mini game",
      explanation:
        "Use +2 for a win and −1 for a loss. If you win twice and your cousin wins once, your change is +3 while your cousin's is 0. Both the kindness rule and the lead rule pass.",
      workedSteps: ["You: +2 +2 −1 = +3", "Cousin: −1 −1 +2 = 0", "Check both rules"],
      rule: "A win helps your score more than a loss hurts it — a few wins can make up for one loss.",
    });
  }

  const questions: PracticeQuestion[] = [
    {
      id: "points-handbook-max",
      source: "handbook",
      prompt:
        "A and B start with 10 points each. The winner of each round gets 3 points, and the loser loses 1 point. If they play 5 rounds, what is the MAXIMUM possible difference between their final scores?",
      options: ["20", "25", "15", "10"],
      correct: "20",
      mistake: {
        eyebrow: "Maximum gap · smaller example",
        title: "Use a two-round mini game",
        explanation:
          "Both players start at 5. With +2 for a win and −1 for a loss, one player winning both rounds ends at 9 while the other ends at 3, a gap of 6.",
        workedSteps: ["Winner: 5 + 2 + 2 = 9", "Loser: 5 − 1 − 1 = 3", "9 − 3 = 6"],
        rule: "The biggest possible gap happens when one side wins everything and the other loses everything.",
      },
    },
    {
      id: "points-fresh",
      source: "practice",
      prompt: "You win 3 rounds (+3 each) and lose 0. How much did your score change in total?",
      options: ["+3", "+6", "+9", "+12"],
      correct: "+9",
      mistake: {
        eyebrow: "Add the rounds · smaller example",
        title: "Score two +2 wins",
        explanation: "Two wins worth +2 each change a score by +4 altogether.",
        workedSteps: ["1 win = +2", "2 wins = 2 × 2", "Total change = +4"],
        rule: "Multiply the value of one round by how many times it happens.",
      },
    },
  ];

  return (
    <div className={styles.screen}>
      <Heading eyebrow="Concept 3 · Tracking a score" title="Nani Maa's Points Game">
        In a turn-based game, track a changing score round by round: add
        what&rsquo;s gained, subtract what&rsquo;s lost.
      </Heading>

      <ExampleWalkthrough
        onReveal={() => setRevealed(true)}
        readPauseMs={3400}
        renderStep={(index) => <ScoreExampleVisual score={scoreExampleZ[index]} />}
        revealed={revealed}
        steps={scoreExampleSteps}
        title="Tracking Z’s score, round by round"
      />

      {revealed ? (
        <>
          <SectionLabel>Now you try it: play fair, play smart</SectionLabel>
          <p className={styles.prompt}>
            You and your cousin each start with 10 points. The winner of a round
            gets +3, the loser loses 1. Choose who wins each round — let your
            cousin win at least once, but still finish with MORE points!
          </p>

          <div className={styles.roundRow}>
            {rounds.map((round) => (
              <article className={styles.roundCard} key={round}>
                <span>Round {round}</span>
                <div className={styles.choiceRow}>
                  {(["you", "cousin"] as const).map((option) => (
                    <button
                      className={winners[round] === option ? styles.choiceCorrect : ""}
                      key={option}
                      onClick={() => pickWinner(round, option)}
                      type="button"
                    >
                      {option === "you" ? "You win" : "Cousin wins"}
                    </button>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className={styles.scoreBoard}>
            <span>
              <small>You</small>
              <strong>{scores.you}</strong>
            </span>
            <Handshake aria-hidden="true" />
            <span>
              <small>Cousin</small>
              <strong>{scores.cousin}</strong>
            </span>
          </div>

          <button
            className={styles.primaryAction}
            disabled={!allPicked || gameSolved}
            onClick={check}
            type="button"
          >
            <PartyPopper aria-hidden="true" /> Lock in results
          </button>

          <Feedback kind={gameSolved ? "success" : "info"}>
            {gameSolved
              ? "Great game! You played fair and still came out ahead. Now finish the practice questions below."
              : "Pick a winner for every round, then lock in your results."}
          </Feedback>

          <PracticeSet
            onAllComplete={() => setPracticeDone(true)}
            onAnswer={onAnswer}
            onMistake={onMistake}
            playTone={playTone}
            questions={questions}
            skill="strategy"
          />
        </>
      ) : null}
    </div>
  );
}

/* Cluster 4 · Recall */

const recallQuestions: PracticeQuestion[] = [
  {
    id: "recall-share",
    source: "practice",
    prompt: "Jars have 1, 4, and 7 candies. What is the fair share if shared equally into 3 jars?",
    options: ["3", "4", "5", "6"],
    correct: "4",
    mistake: {
      eyebrow: "Vacation mastery · smaller example",
      title: "Share 2, 4 and 6",
      explanation: "The total is 12. Sharing 12 equally among 3 jars gives 4 in each.",
      workedSteps: ["2 + 4 + 6 = 12", "12 ÷ 3 = 4"],
      rule: "A rule you really understand should still work on brand-new numbers.",
    },
  },
  {
    id: "recall-track",
    source: "practice",
    prompt: "A frog hops forward 5 and slips back 3 every turn. What is its net move for ONE hop?",
    options: ["2", "3", "5", "8"],
    correct: "2",
    mistake: {
      eyebrow: "Vacation mastery · smaller example",
      title: "Try forward 4, back 1",
      explanation: "A full hop gains 3 because 4 forward minus 1 back equals 3.",
      workedSteps: ["Forward: +4", "Back: −1", "Net: +3"],
      rule: "Net move per hop = forward distance minus slip-back distance.",
    },
  },
  {
    id: "recall-strategy",
    source: "practice",
    prompt: "In the points game (+3 for a win, −1 for a loss), if you win 3 rounds and lose 0, how much did your score change?",
    options: ["+3", "+6", "+9", "+12"],
    correct: "+9",
    mistake: {
      eyebrow: "Vacation mastery · smaller example",
      title: "Score two +4 wins",
      explanation: "Two wins worth +4 each change the score by +8.",
      workedSteps: ["1 win = +4", "2 wins = 2 × 4", "Total change = +8"],
      rule: "Multiply the value of one round by how many times it happens.",
    },
  },
  {
    id: "recall-fairness",
    source: "practice",
    prompt: "If every jar already has the fair share, how many candies need to move between jars?",
    options: ["0", "1", "2", "3"],
    correct: "0",
    mistake: {
      eyebrow: "Vacation mastery · smaller example",
      title: "Check two equal plates",
      explanation: "Two plates already holding 3 biscuits each are balanced. Moving a biscuit would make them unequal.",
      workedSteps: ["Plate A: 3", "Plate B: 3", "Already equal"],
      rule: "Nothing needs to move once every jar already matches the fair share.",
    },
  },
];

function RecallCluster({
  metrics,
  onAnswer,
  onComplete,
  onMistake,
  playTone,
}: NmvScreenProps) {
  const [done, setDone] = useState(false);

  const scores = (Object.entries(metrics) as Array<
    [NmvSkill, { attempts: number; correct: number }]
  >).map(([skill, result]) => ({
    skill,
    score: result.attempts
      ? Math.round((result.correct / result.attempts) * 100)
      : 100,
  }));

  return (
    <div className={styles.screen}>
      <Heading eyebrow="Mission 4 · Show what you know" title="Show What You Know">
        Answer these on your own — no looking back! Then see how your
        vacation mission went.
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
          <PartyPopper aria-hidden="true" />
          <span>Mission complete</span>
          <h2>You can share fairly, track a hopping frog, and play a fair game!</h2>
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
          ? "Nani Maa's Vacation Challenge complete. Fair sharing makes every vacation better!"
          : "Answer every recall question to complete the mission."}
      </Feedback>
    </div>
  );
}
