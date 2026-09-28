"use client";

import { Check, PartyPopper, Sparkles } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { useEffect, useState } from "react";
import {
  type MistakeFeedback,
  PracticeSet,
  type PracticeQuestion,
} from "../../components/learning/LearningSupport";
import {
  ExampleWalkthrough,
  SpeakButton,
} from "../../components/learning/TeachingAnimations";
import type { BmMetrics, BmSkill } from "./badal-and-moti-support";
import narration from "./badal-moti-narration.json";
import { SceneBubble, StoryScene } from "./StoryScene";
import styles from "./badal-and-moti.module.css";

/**
 * NCERT Santoor (Class 3 English), Chapter 2 "Badal and Moti".
 *
 * The chapter's grammar is small and concrete, so each screen is one idea:
 *   0. "Let us learn A"  — words that end in -ed have already happened
 *   1. "Let us write C"  — a question ends with ?, a telling sentence with .
 *   2. "Let us learn B"  — word pairs joined by "and" (paper and pencil …)
 *   3. recall            — every rule once more, plus the story order
 *
 * Every screen follows the Class 3 module standard: concept copy, a paced
 * narrated ExampleWalkthrough played out in the StoryScene, one hands-on
 * activity, then a PracticeSet.
 */

type BmScreenProps = {
  completed: boolean;
  metrics: BmMetrics;
  onAnswer: (skill: BmSkill, correct: boolean) => void;
  onComplete: () => void;
  onMistake: (feedback: MistakeFeedback) => void;
  playTone: (correct: boolean) => void;
  /** Narrate the walkthroughs aloud (follows the module's sound toggle). */
  voice: boolean;
};

const BOOK = "From your Santoor book";

/** Recorded narration for one line of the lesson, by clip id (see badal-moti-narration.json). */
const clip = (id: string) => (narration.clips as Record<string, { src: string }>)[id]?.src;
/** Exercise question id → its recorded read-aloud, for PracticeSet. */
const questionAudio = Object.fromEntries(
  Object.entries(narration.clips as Record<string, { src: string }>)
    .filter(([id]) => id.startsWith("q-") || id.startsWith("sol-"))
    .map(([id, entry]) =>
      id.startsWith("q-") ? [id.slice(2), entry.src] : [`${id.slice(4)}:solution`, entry.src],
    ),
);

export function BmStage({
  screen,
  ...props
}: BmScreenProps & { screen: number }) {
  switch (screen) {
    case 0:
      return <EdCluster {...props} />;
    case 1:
      return <MarksCluster {...props} />;
    case 2:
      return <PairsCluster {...props} />;
    default:
      return <RecallCluster {...props} />;
  }
}

function Heading({
  eyebrow,
  title,
  say,
  audioSrc,
  children,
}: {
  eyebrow: string;
  title: string;
  /** Plain-text version of the copy for the narrator. */
  say: string;
  audioSrc?: string;
  children: ReactNode;
}) {
  return (
    <header className={styles.heading}>
      <p>{eyebrow}</p>
      <h1>{title}</h1>
      <div>
        {children}
        <SpeakButton audioSrc={audioSrc} text={`${title}. ${say}`} />
      </div>
    </header>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <p className={styles.sectionLabel}>{children}</p>;
}

function Prompt({ audioSrc, children }: { audioSrc?: string; children: string }) {
  return (
    <p className={styles.prompt}>
      {children}
      <SpeakButton audioSrc={audioSrc} text={children} />
    </p>
  );
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
        <Sparkles aria-hidden="true" />
      )}
      <span>{children}</span>
    </div>
  );
}

function Letters({ word, ed = false }: { word: string; ed?: boolean }) {
  return (
    <>
      {word.split("").map((letter, index) => (
        <span
          className={`${styles.letterTile} ${ed ? styles.letterTileEd : ""}`}
          key={`${letter}-${index}`}
          style={{ "--i": index } as CSSProperties}
        >
          {letter}
        </span>
      ))}
    </>
  );
}

function EdWord({ word }: { word: string }) {
  // Highlight the -ed so the eye lands on the two letters that carry the meaning.
  return (
    <>
      {word.slice(0, -2)}
      <b>{word.slice(-2)}</b>
    </>
  );
}

/* ───────────────────────── Screen 0 · -ed words ───────────────────────── */

const edExampleSteps = narration.examples.ed.map((step) => step.text);
const edExampleAudio = narration.examples.ed.map((step) => step.src);

const storyEdWords = ["lived", "loved", "played", "gathered", "thanked"];

function EdExampleVisual({ step }: { step: number }) {
  if (step === 0) {
    return (
      <StoryScene
        badal={{ x: 400, action: "wave" }}
        label="A sunny garden. Badal waves as Moti runs in to him. The word play appears."
        moti={{ x: 280, action: "runIn" }}
      >
        <div className={styles.banner}>
          <Letters word="play" />
        </div>
      </StoryScene>
    );
  }
  if (step === 1) {
    return (
      <StoryScene
        badal={{ x: 400, action: "idle" }}
        label="The sun sets and the moon rises over the garden. Moti sits by Badal. The word play with a question mark."
        moti={{ x: 300, action: "sit" }}
        sky="toNight"
      >
        <div className={styles.banner}>
          <Letters word="play" />
          <span className={styles.wordPlus}>+ ?</span>
        </div>
      </StoryScene>
    );
  }
  if (step === 2) {
    return (
      <StoryScene
        badal={{ x: 400, action: "idle" }}
        label="Night. The letters e and d fly in and land after the word play."
        moti={{ x: 300, action: "tilt" }}
        sky="night"
      >
        <div className={styles.banner}>
          <Letters word="play" />
          {["e", "d"].map((letter, index) => (
            <span
              className={`${styles.letterTile} ${styles.letterTileFly}`}
              key={letter}
              style={{ "--i": index } as CSSProperties}
            >
              {letter}
            </span>
          ))}
        </div>
      </StoryScene>
    );
  }
  if (step === 3) {
    return (
      <StoryScene
        badal={{ x: 400, action: "wave" }}
        label="Night. Moti jumps for joy. The word played glows, with e-d highlighted."
        moti={{ x: 300, action: "jump" }}
        sky="night"
      >
        <div className={styles.banner}>
          <span className={`${styles.wordTile} ${styles.wordTileJoined} ${styles.wordTileGlow}`}>
            <EdWord word="played" />
          </span>
        </div>
      </StoryScene>
    );
  }
  return (
    <StoryScene
      badal={{ x: 380, action: "walkAcross" }}
      label="The sun rises again. Badal and Moti walk across the garden together under the story's five -ed words."
      moti={{ x: 280, action: "runAcross" }}
      sky="toDay"
    >
      <div className={styles.banner}>
        <div className={styles.storyWords}>
          {storyEdWords.map((word, index) => (
            <span key={word} style={{ "--i": index } as CSSProperties}>
              <EdWord word={word} />
            </span>
          ))}
        </div>
      </div>
    </StoryScene>
  );
}

// "Let us learn A" asks for walk, play, talk, ask, touch + ed. One sentence is
// about TODAY so the student has to decide, not just stamp -ed on everything.
const machineItems = [
  { id: "walk", before: "Yesterday, Badal", after: "to school.", base: "walk", correct: "walked" },
  { id: "play", before: "Today, Badal and Moti", after: "in the garden.", base: "play", correct: "play" },
  { id: "talk", before: "Last night, Maa", after: "to Badal about the puppy.", base: "talk", correct: "talked" },
  { id: "ask", before: "Yesterday, Badal", after: "Maa a question.", base: "ask", correct: "asked" },
  { id: "touch", before: "Yesterday, Badal gently", after: "the wet puppy.", base: "touch", correct: "touched" },
] as const;

function EdCluster({ onAnswer, onComplete, onMistake, playTone, voice }: BmScreenProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [practiceDone, setPracticeDone] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const machineDone = machineItems.every((item) => answers[item.id] === item.correct);

  useEffect(() => {
    if (machineDone && practiceDone) onComplete();
  }, [machineDone, practiceDone, onComplete]);

  function choose(item: (typeof machineItems)[number], value: string) {
    if (answers[item.id] === item.correct) return;
    const correct = value === item.correct;
    onAnswer("ed", correct);
    playTone(correct);
    setAnswers((current) => ({ ...current, [item.id]: value }));
    if (correct) return;
    onMistake(
      item.correct === item.base
        ? {
            eyebrow: "Yesterday words · smaller example",
            title: "Is it happening now?",
            explanation:
              "Try a smaller one: “Today, Moti JUMP for joy.” Today means it is happening right now, not finished — so no -ed. We say jump.",
            workedSteps: ["Time word: Today", "Happening now", "No -ed needed", "jump stays jump"],
            rule: "-ed is only for actions that are already over.",
        audioSrc: clip("m-is-it-happening-now"),
          }
        : {
            eyebrow: "Yesterday words · smaller example",
            title: "Look for the time word first",
            explanation:
              "Try a smaller one: “Yesterday, Moti WAIT at the gate.” Yesterday is over, so the waiting already happened — we say waited.",
            workedSteps: ["Time word: Yesterday", "Already happened?", "Yes → add ed", "wait + ed = waited"],
            rule: "If the action already happened, the word wears its -ed.",
        audioSrc: clip("m-look-for-the-time-word-first"),
          },
    );
  }

  const questions: PracticeQuestion[] = [
    {
      id: "ed-book-walk",
      visual: <div className={styles.practiceStage}><StoryScene badal={{ x: 380, action: "walkAcross" }} label="The sun sets as Badal walks across the courtyard: yesterday he walked." moti={{ x: 250, action: "runAcross" }} sky="toNight"><div className={styles.banner}><Letters word="walk" /><span className={styles.wordPlus}>+ ed = ?</span></div></StoryScene></div>,
      source: "handbook",
      prompt: "Add ed and write: walk + ed = ?",
      options: ["walked", "walking", "walks", "walkes"],
      correct: "walked",
      mistake: {
        eyebrow: "Adding -ed · smaller example",
        title: "Just add the two letters",
        explanation:
          "Take a smaller word: jump. Put e and d on the end and nothing else changes: jump + ed = jumped.",
        workedSteps: ["jump", "+ e", "+ d", "jumped"],
        rule: "Add e-d to the end of the word. Do not change the rest.",
        audioSrc: clip("m-just-add-the-two-letters"),
      },
      solution: {
        steps: ["Start with walk.", "Add e and d to the end.", "walk + ed = walked."],
        rule: "Add -ed to show the action already happened.",
      },
    },
    {
      id: "ed-fresh-already",
      visual: <div className={styles.practiceStage}><StoryScene badal={{ x: 400, action: "idle" }} label="Night over the courtyard. Which word is already over?" moti={{ x: 300, action: "jump" }} sky="night" /></div>,
      source: "practice",
      prompt: "Which word tells us the action ALREADY happened?",
      options: ["jump", "jumped", "jumps", "jumping"],
      correct: "jumped",
      mistake: {
        eyebrow: "Yesterday words · smaller example",
        title: "Look at the last two letters",
        explanation:
          "Compare cook and cooked. Only cooked ends in -ed, so only cooked is already over — like the food Maa cooked yesterday.",
        workedSteps: ["cook → happening", "cooked → already happened", "Look for e-d at the end"],
        rule: "The word ending in -ed is the one that already happened.",
        audioSrc: clip("m-look-at-the-last-two-letters"),
      },
      solution: {
        steps: ["Look at the end of each word.", "Only one word ends in -ed.", "jumped is the yesterday word."],
        rule: "-ed at the end means already happened.",
      },
    },
    {
      id: "ed-fresh-follow",
      visual: <div className={styles.practiceStage}><StoryScene badal={{ x: 440, action: "wave" }} label="Moti runs across the dark courtyard, following Badal's scent." moti={{ x: 200, action: "runAcross" }} sky="night" /></div>,
      source: "practice",
      prompt: "Yesterday, Moti ___ Badal's scent and found him. Which word fits?",
      options: ["follow", "followed", "follows"],
      correct: "followed",
      mistake: {
        eyebrow: "Yesterday words · smaller example",
        title: "Yesterday is over",
        explanation:
          "Try: “Yesterday, Moti BARK at the pit.” Yesterday is finished, so the barking already happened: barked.",
        workedSteps: ["Time word: Yesterday", "Already over", "bark + ed = barked"],
        rule: "Yesterday, last night, last week → the word needs -ed.",
        audioSrc: clip("m-yesterday-is-over"),
      },
      solution: {
        steps: ["The sentence says Yesterday.", "So the action is already over.", "follow + ed = followed."],
        rule: "Already happened → add -ed.",
      },
    },
  ];

  return (
    <div className={styles.screen}>
      <Heading
        audioSrc={narration.headings.ed.src}
        eyebrow="Lesson 1 · Let us learn"
        say={narration.headings.ed.say}
        title="Yesterday words"
      >
        Some words tell us about things that already happened. They wear two
        little letters at the end: <b>-ed</b>. Lived, loved, played, gathered,
        thanked — all of these are over and done.
      </Heading>

      <ExampleWalkthrough
        narrationSrcs={edExampleAudio}
        onReveal={() => setRevealed(true)}
        renderStep={(index) => <EdExampleVisual step={index} />}
        revealed={revealed}
        steps={edExampleSteps}
        title="How play becomes played"
        voice={voice}
      />

      {revealed ? (
        <>
          <SectionLabel>Now you try it: the -ed stamp machine</SectionLabel>
          <Prompt audioSrc={clip("prompt-ed")}>
            Read each sentence. Is the action already over, or happening now? Pick the word that fits. When -ed is needed, watch the machine stamp it on!
          </Prompt>

          <div className={styles.machine}>
            {machineItems.map((item) => {
              const answer = answers[item.id];
              const done = answer === item.correct;
              return (
                <article className={styles.machineCard} data-done={done} key={item.id}>
                  <p>
                    {item.before} <b>{done ? item.correct : "____"}</b> {item.after}
                    <SpeakButton
                      audioSrc={clip(`machine-${item.id}`)}
                      label="Read"
                      text={`${item.before} blank ${item.after} Is it ${item.base}, or ${item.base}ed?`}
                    />
                  </p>
                  <div className={styles.choiceRow}>
                    {[item.base, `${item.base}ed`].map((option) => (
                      <button
                        className={
                          answer === option
                            ? option === item.correct
                              ? styles.choiceCorrect
                              : styles.choiceWrong
                            : ""
                        }
                        disabled={done}
                        key={option}
                        onClick={() => choose(item, option)}
                        type="button"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  {done ? (
                    <div aria-live="polite" className={styles.stampLine}>
                      {item.correct === item.base ? (
                        <>
                          <span aria-hidden="true">☀️</span> Happening now — no -ed needed.
                        </>
                      ) : (
                        <>
                          <span className={styles.wordTileMini}>{item.base}</span>+
                          <span className={`${styles.wordTileMini} ${styles.wordTileEd}`}>ed</span>=
                          <span className={`${styles.wordTileMini} ${styles.wordTileJoined}`}>
                            <EdWord word={item.correct} />
                          </span>
                        </>
                      )}
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>

          <Feedback kind={machineDone ? "success" : "info"}>
            {machineDone
              ? "All five stamped! Now finish the exercise questions below."
              : "Fix every sentence to open the exercise questions."}
          </Feedback>

          {machineDone ? (
            <PracticeSet
              onAllComplete={() => setPracticeDone(true)}
              onAnswer={onAnswer}
              onMistake={onMistake}
              playTone={playTone}
              questions={questions}
              narration={questionAudio}
              readAloud
              skill="ed"
              sourceLabel={BOOK}
              title="Exercise questions"
            />
          ) : null}
        </>
      ) : null}
    </div>
  );
}

/* ───────────────────── Screen 1 · question mark vs full stop ───────────────────── */

const marksExampleSteps = narration.examples.marks.map((step) => step.text);
const marksExampleAudio = narration.examples.marks.map((step) => step.src);

const askWords = ["What", "Where", "Who", "Whose", "Can", "May"];
const badalAsks = "Can this puppy stay with us, Maa";
const maaTells = "Yes beta, but only if you promise to take care of the puppy";

function MarksExampleVisual({ step }: { step: number }) {
  if (step === 0) {
    return (
      <StoryScene
        badal={{ x: 360, action: "walkIn" }}
        label="Rain pours from grey clouds. Moti shivers by the road as Badal walks in to find him."
        moti={{ x: 470, action: "shiver" }}
        rain="pour"
      />
    );
  }
  if (step === 1 || step === 2) {
    return (
      <StoryScene
        badal={{ x: 300, action: "idle" }}
        label={`The rain clears. At the house door Maa listens as Badal asks, ${badalAsks}${step === 2 ? "?" : ""}`}
        maa={{ x: 111, action: "idle" }}
        moti={{ x: 400, action: step === 2 ? "jump" : "sit" }}
        rain={step === 1 ? "clearing" : "none"}
      >
        <SceneBubble left="40%" mark={step === 2 ? "?" : undefined} top="4%" who="Badal asks">
          {badalAsks}
        </SceneBubble>
      </StoryScene>
    );
  }
  if (step === 3 || step === 4) {
    return (
      <StoryScene
        badal={{ x: 330, action: "idle" }}
        label={`Maa waves and tells Badal, ${maaTells}${step === 4 ? "." : ""}`}
        maa={{ x: 111, action: "wave" }}
        moti={{ x: 430, action: "sit" }}
      >
        <SceneBubble left="52%" mark="?" top="4%" who="Badal asked">
          {badalAsks}
        </SceneBubble>
        <SceneBubble left="3%" mark={step === 4 ? "." : undefined} top="4%" who="Maa tells">
          {maaTells}
        </SceneBubble>
      </StoryScene>
    );
  }
  return (
    <StoryScene
      badal={{ x: 400, action: "wave" }}
      label="A sunny garden. Badal waves and Moti jumps under the asking words: What, Where, Who, Whose, Can, May."
      moti={{ x: 300, action: "jump" }}
    >
      <div className={styles.bannerStack}>
        <div className={styles.storyWords}>
          {askWords.map((word, index) => (
            <span key={word} style={{ "--i": index } as CSSProperties}>
              {word}…?
            </span>
          ))}
        </div>
        <div>
          <span className={`${styles.wordTile} ${styles.wordTileEd}`}>asking → ?</span>
          <span className={`${styles.wordTile} ${styles.wordTileJoined}`}>telling → .</span>
        </div>
      </div>
    </StoryScene>
  );
}

// "Let us write C" — the six sentences exactly as printed in Santoor.
const postItems = [
  { id: "sun", text: "The sun rises in the east", correct: "." },
  { id: "name", text: "What is your name", correct: "?" },
  { id: "mango", text: "I like to eat mangoes", correct: "." },
  { id: "borrow", text: "May I borrow your English textbook", correct: "?" },
  { id: "friends", text: "Brinda and Namrata are good friends", correct: "." },
  { id: "shoes", text: "Whose shoes are these", correct: "?" },
] as const;

function MarksCluster({ onAnswer, onComplete, onMistake, playTone, voice }: BmScreenProps) {
  const [marks, setMarks] = useState<Record<string, string>>({});
  const [practiceDone, setPracticeDone] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const postDone = postItems.every((item) => marks[item.id] === item.correct);

  useEffect(() => {
    if (postDone && practiceDone) onComplete();
  }, [postDone, practiceDone, onComplete]);

  function choose(item: (typeof postItems)[number], value: "?" | ".") {
    if (marks[item.id] === item.correct) return;
    const correct = value === item.correct;
    onAnswer("marks", correct);
    playTone(correct);
    setMarks((current) => ({ ...current, [item.id]: value }));
    if (correct) return;
    onMistake(
      item.correct === "?"
        ? {
            eyebrow: "End marks · smaller example",
            title: "This one wants an answer",
            explanation:
              "Try a smaller sentence: “Where is Moti” — it is asking, it needs someone to answer. So it ends with a question mark: Where is Moti?",
            workedSteps: ["Does it want an answer?", "Yes → it is asking", "Asking → ?"],
            rule: "An asking sentence ends with a question mark.",
        audioSrc: clip("m-this-one-wants-an-answer"),
          }
        : {
            eyebrow: "End marks · smaller example",
            title: "This one is only telling",
            explanation:
              "Try a smaller sentence: “Moti is a puppy” — nobody is asking anything, it just tells us. So it ends with a full stop: Moti is a puppy.",
            workedSteps: ["Does it want an answer?", "No → it is telling", "Telling → ."],
            rule: "A telling sentence ends with a full stop.",
        audioSrc: clip("m-this-one-is-only-telling"),
          },
    );
  }

  const questions: PracticeQuestion[] = [
    {
      id: "marks-fresh-question",
      visual: <div className={styles.practiceStage}><StoryScene badal={{ x: 330 }} label="Badal asks with a question mark; Maa tells with a full stop." maa={{ x: 111, action: "wave" }} moti={{ x: 430, action: "sit" }}><SceneBubble left="52%" mark="?" top="4%" who="Badal asks">Can I…</SceneBubble><SceneBubble left="3%" mark="." top="4%" who="Maa tells">Yes, beta</SceneBubble></StoryScene></div>,
      source: "practice",
      prompt: "Which of these is a QUESTION?",
      options: ["Moti is a brown puppy", "Where does Moti sleep", "Badal loves Moti", "The pit was deep"],
      correct: "Where does Moti sleep",
      mistake: {
        eyebrow: "Asking or telling · smaller example",
        title: "Listen for the asking word",
        explanation:
          "Compare “The rope is long” with “How long is the rope”. Only the second one wants an answer, and it starts with an asking word: How.",
        workedSteps: ["The rope is long → tells", "How long is the rope → asks", "Asking words: What, Where, How…"],
        rule: "A question wants an answer and often starts with an asking word.",
        audioSrc: clip("m-listen-for-the-asking-word"),
      },
      solution: {
        steps: ["Read each sentence.", "Only one wants an answer.", "Where does Moti sleep? starts with Where — it asks."],
        rule: "Asking sentences are questions.",
      },
    },
    {
      id: "marks-fresh-who",
      visual: <div className={styles.practiceStage}><StoryScene badal={{ x: 330 }} label="The rain clears after Badal is pulled out of the pit." maa={{ x: 111, action: "wave" }} moti={{ x: 430, action: "jump" }} rain="clearing"><SceneBubble left="40%" top="4%" who="Badal">Who pulled me out</SceneBubble></StoryScene></div>,
      source: "practice",
      prompt: "Pick the end mark: Who pulled Badal out of the pit ___",
      options: ["?", "."],
      correct: "?",
      mistake: {
        eyebrow: "End marks · smaller example",
        title: "Who is an asking word",
        explanation:
          "Try: “Who is barking” — it wants a name as an answer, so it is asking: Who is barking?",
        workedSteps: ["Starts with Who", "Wants an answer", "Asking → ?"],
        rule: "Sentences that begin with Who, What, Where or Whose are questions.",
        audioSrc: clip("m-who-is-an-asking-word"),
      },
      solution: {
        steps: ["The sentence starts with Who.", "It wants an answer: the neighbours!", "So it ends with ?"],
        rule: "Asking → question mark.",
      },
    },
    {
      id: "marks-book-mangoes",
      visual: <div className={styles.practiceStage}><StoryScene badal={{ x: 480, action: "wave" }} label="Badal under the mango tree." moti={{ x: 360, action: "sit" }}><SceneBubble left="6%" top="4%" who="Badal">I like to eat mangoes</SceneBubble></StoryScene></div>,
      source: "handbook",
      prompt: "Add a ? or a . — I like to eat mangoes ___",
      options: [".", "?"],
      correct: ".",
      mistake: {
        eyebrow: "End marks · smaller example",
        title: "Nobody is asking here",
        explanation:
          "Try: “Moti likes bones” — it simply tells us something Moti likes. No answer is needed, so it ends with a full stop.",
        workedSteps: ["Does it want an answer?", "No", "Telling → ."],
        rule: "A sentence that tells ends with a full stop.",
        audioSrc: clip("m-nobody-is-asking-here"),
      },
      solution: {
        steps: ["The sentence tells what I like.", "It does not want an answer.", "So it ends with a full stop."],
        rule: "Telling → full stop.",
      },
    },
  ];

  return (
    <div className={styles.screen}>
      <Heading
        audioSrc={narration.headings.marks.src}
        eyebrow="Lesson 2 · Let us write"
        say={narration.headings.marks.say}
        title="Asking or telling?"
      >
        Every sentence ends with a little mark. When Badal <b>asks</b> Maa
        something, the sentence ends with a question mark <b>?</b>. When Maa
        <b> tells</b> him something, it ends with a full stop <b>.</b>
      </Heading>

      <ExampleWalkthrough
        narrationSrcs={marksExampleAudio}
        onReveal={() => setRevealed(true)}
        renderStep={(index) => <MarksExampleVisual step={index} />}
        revealed={revealed}
        steps={marksExampleSteps}
        title="Badal asks, Maa tells"
        voice={voice}
      />

      {revealed ? (
        <>
          <SectionLabel>Now you try it: the punctuation postbox</SectionLabel>
          <Prompt audioSrc={clip("prompt-marks")}>
            These six sentences are from your book. Say each one out loud. Is it asking or telling? Post the right mark on the end.
          </Prompt>

          <div className={styles.postbox}>
            {postItems.map((item) => {
              const answer = marks[item.id];
              const done = answer === item.correct;
              return (
                <article className={styles.postRow} data-done={done} key={item.id}>
                  <p>
                    {item.text}
                    {done ? (
                      <b
                        className={`${styles.bubbleMark} ${
                          item.correct === "." ? styles.bubbleMarkStop : ""
                        }`}
                      >
                        {item.correct}
                      </b>
                    ) : (
                      <span aria-hidden="true"> ___</span>
                    )}
                    <SpeakButton audioSrc={clip(`post-${item.id}`)} label="Read" text={item.text} />
                  </p>
                  <div aria-label={`End mark for: ${item.text}`} className={styles.markButtons} role="group">
                    {(["?", "."] as const).map((option) => (
                      <button
                        aria-label={option === "?" ? "Question mark" : "Full stop"}
                        className={
                          answer === option
                            ? option === item.correct
                              ? styles.choiceCorrect
                              : styles.choiceWrong
                            : ""
                        }
                        disabled={done}
                        key={option}
                        onClick={() => choose(item, option)}
                        type="button"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>

          <Feedback kind={postDone ? "success" : "info"}>
            {postDone
              ? "Every sentence has its mark! Now finish the exercise questions below."
              : "Post a mark on all six sentences to open the exercise questions."}
          </Feedback>

          {postDone ? (
            <PracticeSet
              onAllComplete={() => setPracticeDone(true)}
              onAnswer={onAnswer}
              onMistake={onMistake}
              playTone={playTone}
              questions={questions}
              narration={questionAudio}
              readAloud
              skill="marks"
              sourceLabel={BOOK}
              title="Exercise questions"
            />
          ) : null}
        </>
      ) : null}
    </div>
  );
}

/* ───────────────────────── Screen 2 · word pairs ───────────────────────── */

const pairsExampleSteps = narration.examples.pairs.map((step) => step.text);
const pairsExampleAudio = narration.examples.pairs.map((step) => step.src);

function PairTiles({ left, right, and = true }: { left: string; right?: string; and?: boolean }) {
  return (
    <div>
      <span className={styles.wordTile} style={{ "--i": 0 } as CSSProperties}>{left}</span>
      {and && right ? <span className={styles.pairLink}>and</span> : null}
      {right ? (
        <span className={`${styles.wordTile} ${styles.wordTileJoined}`} style={{ "--i": 6 } as CSSProperties}>
          {right}
        </span>
      ) : (
        <span className={styles.wordPlus}>+ ?</span>
      )}
    </div>
  );
}

function PairsExampleVisual({ step }: { step: number }) {
  if (step === 0) {
    return (
      <StoryScene
        badal={{ x: 400, action: "walkIn" }}
        label="Badal walks in and Moti runs in beside him. Above them: Badal and Moti."
        moti={{ x: 280, action: "runIn" }}
      >
        <div className={styles.bannerStack}>
          <PairTiles left="Badal" right="Moti" />
        </div>
      </StoryScene>
    );
  }
  if (step === 1) {
    return (
      <StoryScene
        badal={{ x: 400, action: "idle" }}
        label="Moti tilts his head at the word bat, which sits next to a question mark."
        moti={{ x: 280, action: "tilt" }}
      >
        <div className={styles.bannerStack}>
          <PairTiles left="bat" />
        </div>
      </StoryScene>
    );
  }
  if (step === 2) {
    return (
      <StoryScene
        badal={{ x: 400, action: "wave" }}
        ball={{ x: 340, roll: true }}
        label="A ball rolls in across the garden. Moti jumps. Above: bat and ball."
        moti={{ x: 260, action: "jump" }}
      >
        <div className={styles.bannerStack}>
          <PairTiles left="bat" right="ball" />
        </div>
      </StoryScene>
    );
  }
  if (step === 3) {
    return (
      <StoryScene
        badal={{ x: 400, action: "wave" }}
        label="Two more pairs appear: lock and key, idli and sambar."
        moti={{ x: 290, action: "sit" }}
      >
        <div className={styles.bannerStack}>
          <PairTiles left="lock" right="key" />
          <PairTiles left="idli" right="sambar" />
        </div>
      </StoryScene>
    );
  }
  return (
    <StoryScene
      badal={{ x: 400, action: "idle" }}
      label="Moti jumps under three unfinished pairs: paper and, chair and, needle and."
      moti={{ x: 290, action: "jump" }}
    >
      <div className={styles.banner}>
        <div className={styles.storyWords}>
          {["paper", "chair", "needle"].map((word, index) => (
            <span key={word} style={{ "--i": index } as CSSProperties}>
              {word} and …?
            </span>
          ))}
        </div>
      </div>
    </StoryScene>
  );
}

// "Let us learn B": the six pairs, right column in the book's own order.
const pairLeft = ["paper", "chair", "bat", "needle", "lock", "idli"] as const;
const pairRight = ["ball", "thread", "key", "pencil", "sambar", "table"] as const;
const pairOf: Record<(typeof pairLeft)[number], (typeof pairRight)[number]> = {
  paper: "pencil",
  chair: "table",
  bat: "ball",
  needle: "thread",
  lock: "key",
  idli: "sambar",
};
// "Colour each pair with the same colour", as the book asks.
const pairColours = ["#ffd166", "#a5e8a0", "#bfd7ff", "#ffb5c9", "#ffd8a8", "#d9c8ff"];

function PairsCluster({ onAnswer, onComplete, onMistake, playTone, voice }: BmScreenProps) {
  const [picked, setPicked] = useState<(typeof pairLeft)[number] | null>(null);
  const [matched, setMatched] = useState<Partial<Record<(typeof pairLeft)[number], number>>>({});
  const [practiceDone, setPracticeDone] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const boardDone = pairLeft.every((word) => matched[word] !== undefined);

  useEffect(() => {
    if (boardDone && practiceDone) onComplete();
  }, [boardDone, practiceDone, onComplete]);

  function chooseRight(word: (typeof pairRight)[number]) {
    if (!picked) return;
    const correct = pairOf[picked] === word;
    onAnswer("pairs", correct);
    playTone(correct);
    if (correct) {
      const left = picked;
      setMatched((current) => ({ ...current, [left]: Object.keys(current).length }));
      setPicked(null);
      return;
    }
    setPicked(null);
    onMistake({
      eyebrow: "Word pairs · smaller example",
      title: "Ask what it is used with",
      explanation:
        "Try a smaller pair: salt and … pepper! Salt and pepper sit together on every table. Ask yourself what your left word is always used with.",
      workedSteps: ["Pick the left word", "What is it used with every day?", "That is its best friend"],
      rule: "Best-friend words are the ones we use together.",
        audioSrc: clip("m-ask-what-it-is-used-with"),
    });
  }

  const matchedRight = new Set(
    (Object.keys(matched) as Array<(typeof pairLeft)[number]>).map((left) => pairOf[left]),
  );

  const questions: PracticeQuestion[] = [
    {
      id: "pairs-book-needle",
      visual: <div className={styles.practiceStage}><StoryScene badal={{ x: 420 }} label="Maa holds up a needle. What goes with it?" maa={{ x: 111, action: "wave" }} moti={{ x: 300, action: "tilt" }}><div className={styles.bannerStack}><PairTiles left="needle" /></div></StoryScene></div>,
      source: "handbook",
      prompt: "Match the pair: needle and ___",
      options: ["thread", "table", "ball", "key"],
      correct: "thread",
      mistake: {
        eyebrow: "Word pairs · smaller example",
        title: "What does it work with?",
        explanation:
          "Think of a smaller pair: brush and … paint! A brush needs paint to work. Ask what a needle needs to sew.",
        workedSteps: ["A needle sews", "What goes through the needle?", "That is its pair"],
        rule: "A pair is two things that work together.",
        audioSrc: clip("m-what-does-it-work-with"),
      },
      solution: {
        steps: ["A needle is used for sewing.", "Thread goes through the needle.", "needle and thread."],
        rule: "Best-friend words work together.",
      },
    },
    {
      id: "pairs-fresh-which",
      visual: <div className={styles.practiceStage}><StoryScene badal={{ x: 400, action: "wave" }} label="Badal and Moti wait for the right pair." moti={{ x: 280, action: "jump" }}><div className={styles.bannerStack}><PairTiles left="?" right="?" /></div></StoryScene></div>,
      source: "practice",
      prompt: "Which pair goes together?",
      options: ["chair and sambar", "bat and ball", "lock and pencil"],
      correct: "bat and ball",
      mistake: {
        eyebrow: "Word pairs · smaller example",
        title: "Picture the two things together",
        explanation:
          "Picture “shoes and socks”. You can see them together. Now picture “shoes and sambar” — that does not fit! Only real pairs make a picture.",
        workedSteps: ["Picture the two words", "Do they belong together?", "Yes → a pair"],
        rule: "A real pair is easy to picture together.",
        audioSrc: clip("m-picture-the-two-things-together"),
      },
      solution: {
        steps: ["Picture each pair.", "A bat and a ball are used together in a game.", "bat and ball."],
        rule: "Pairs are things used together.",
      },
    },
    {
      id: "pairs-fresh-badal",
      visual: <div className={styles.practiceStage}><StoryScene badal={{ x: 400, action: "wave" }} label="Badal waves. Who is his best friend?"><div className={styles.bannerStack}><PairTiles left="Badal" /></div></StoryScene></div>,
      source: "practice",
      prompt: "Complete the best-friend pair from the story: Badal and ___",
      options: ["Moti", "the pit", "the rope"],
      correct: "Moti",
      mistake: {
        eyebrow: "Word pairs · smaller example",
        title: "Who is always together?",
        explanation:
          "In the story, one friend followed Badal wherever he went, ate with him and played with him. That friend is his pair.",
        workedSteps: ["Who ate with Badal?", "Who played with Badal?", "Who followed him everywhere?"],
        rule: "Best friends make the best pairs.",
        audioSrc: clip("m-who-is-always-together"),
      },
      solution: {
        steps: ["Badal's best friend is his puppy.", "They ate, played and went everywhere together.", "Badal and Moti."],
        rule: "and joins two friends.",
      },
    },
  ];

  return (
    <div className={styles.screen}>
      <Heading
        audioSrc={narration.headings.pairs.src}
        eyebrow="Lesson 3 · Let us learn"
        say={narration.headings.pairs.say}
        title="Best-friend words"
      >
        Badal and Moti go everywhere together. Some words are best friends
        too — like <b>paper and pencil</b>. We join them with the little word
        <b> and</b>.
      </Heading>

      <ExampleWalkthrough
        narrationSrcs={pairsExampleAudio}
        onReveal={() => setRevealed(true)}
        renderStep={(index) => <PairsExampleVisual step={index} />}
        revealed={revealed}
        steps={pairsExampleSteps}
        title="Words that go together"
        voice={voice}
      />

      {revealed ? (
        <>
          <SectionLabel>Now you try it: match the pairs</SectionLabel>
          <Prompt audioSrc={clip("prompt-pairs")}>
            Tap a word on the left, then tap its best friend on the right. A matched pair gets its own colour, just like in your book.
          </Prompt>

          <div aria-label="Word pair matching board" className={styles.pairBoard}>
            <div className={styles.pairColumn}>
              {pairLeft.map((word) => {
                const colour = matched[word];
                return (
                  <button
                    aria-pressed={picked === word}
                    className={`${styles.pairWord} ${picked === word ? styles.pairWordPicked : ""} ${
                      colour !== undefined ? styles.pairWordMatched : ""
                    }`}
                    disabled={colour !== undefined}
                    key={word}
                    onClick={() => setPicked(word)}
                    style={colour !== undefined ? ({ "--pair-colour": pairColours[colour] } as CSSProperties) : undefined}
                    type="button"
                  >
                    {word}
                  </button>
                );
              })}
            </div>
            <span aria-hidden="true">and</span>
            <div className={styles.pairColumn}>
              {pairRight.map((word) => {
                const left = pairLeft.find((candidate) => pairOf[candidate] === word)!;
                const colour = matched[left];
                return (
                  <button
                    className={`${styles.pairWord} ${colour !== undefined ? styles.pairWordMatched : ""}`}
                    disabled={!picked || matchedRight.has(word)}
                    key={word}
                    onClick={() => chooseRight(word)}
                    style={colour !== undefined ? ({ "--pair-colour": pairColours[colour] } as CSSProperties) : undefined}
                    type="button"
                  >
                    {word}
                  </button>
                );
              })}
            </div>
          </div>

          <Feedback kind={boardDone ? "success" : "info"}>
            {boardDone
              ? "All six pairs found and coloured! Now finish the exercise questions below."
              : picked
                ? `You picked “${picked}”. Now tap its best friend on the right.`
                : "Tap a word on the left to start."}
          </Feedback>

          {boardDone ? (
            <PracticeSet
              onAllComplete={() => setPracticeDone(true)}
              onAnswer={onAnswer}
              onMistake={onMistake}
              playTone={playTone}
              questions={questions}
              narration={questionAudio}
              readAloud
              skill="pairs"
              sourceLabel={BOOK}
              title="Exercise questions"
            />
          ) : null}
        </>
      ) : null}
    </div>
  );
}

/* ───────────────────────── Screen 3 · recall ───────────────────────── */

const recallQuestions: PracticeQuestion[] = [
  {
    id: "recall-ed-lived",
    visual: <div className={styles.practiceStage}><StoryScene badal={{ x: 400 }} label="Night in the courtyard where Badal lived with Maa." moti={{ x: 300, action: "sit" }} sky="night" /></div>,
    source: "practice",
    prompt: "Which word tells about something that already happened?",
    options: ["live", "lived", "living"],
    correct: "lived",
    mistake: {
      eyebrow: "Chapter recall · smaller example",
      title: "Look for the -ed",
      explanation: "Compare hop and hopped. Only hopped ends in -ed, so only hopped is already over.",
      workedSteps: ["hop → now", "hopped → already happened"],
      rule: "-ed at the end means it already happened.",
        audioSrc: clip("m-look-for-the-ed"),
    },
  },
  {
    id: "recall-ed-pulled",
    visual: <div className={styles.practiceStage}><StoryScene badal={{ x: 330 }} label="The rain clears after the neighbours pulled Badal out." maa={{ x: 111, action: "wave" }} moti={{ x: 430, action: "jump" }} rain="clearing" /></div>,
    source: "practice",
    prompt: "Yesterday, the neighbours ___ Badal out of the pit.",
    options: ["pull", "pulled", "pulls"],
    correct: "pulled",
    mistake: {
      eyebrow: "Chapter recall · smaller example",
      title: "Yesterday is over",
      explanation: "Try: “Yesterday, Moti WAIT at the gate.” Yesterday is finished, so it is waited.",
      workedSteps: ["Time word: Yesterday", "Already over", "Add -ed"],
      rule: "Already happened → add -ed.",
        audioSrc: clip("m-yesterday-is-over-2"),
    },
  },
  {
    id: "recall-marks-whose",
    visual: <div className={styles.practiceStage}><StoryScene badal={{ x: 400 }} label="Badal wonders whose puppy this is." moti={{ x: 280, action: "tilt" }}><SceneBubble left="45%" top="4%" who="Badal">Whose puppy is this</SceneBubble></StoryScene></div>,
    source: "practice",
    prompt: "Pick the end mark: Whose puppy is this ___",
    options: ["?", "."],
    correct: "?",
    mistake: {
      eyebrow: "Chapter recall · smaller example",
      title: "Whose is an asking word",
      explanation: "Try: “Whose bag is that” — it wants a name as an answer, so it is asking: Whose bag is that?",
      workedSteps: ["Starts with Whose", "Wants an answer", "Asking → ?"],
      rule: "Asking sentences end with a question mark.",
        audioSrc: clip("m-whose-is-an-asking-word"),
    },
  },
  {
    id: "recall-marks-gate",
    visual: <div className={styles.practiceStage}><StoryScene badal={{ x: 420, action: "walkIn" }} label="Moti waits at the gate as Badal comes home." moti={{ x: 200, action: "sit" }} /></div>,
    source: "practice",
    prompt: "Pick the end mark: Moti waited at the gate ___",
    options: [".", "?"],
    correct: ".",
    mistake: {
      eyebrow: "Chapter recall · smaller example",
      title: "This one only tells",
      explanation: "Try: “The rope was strong” — nobody is asking, it just tells. So it ends with a full stop.",
      workedSteps: ["Does it want an answer?", "No", "Telling → ."],
      rule: "Telling sentences end with a full stop.",
        audioSrc: clip("m-this-one-only-tells"),
    },
  },
  {
    id: "recall-pairs-idli",
    visual: <div className={styles.practiceStage}><StoryScene badal={{ x: 420 }} label="Maa brings idli. What goes with it?" maa={{ x: 111, action: "wave" }} moti={{ x: 300, action: "sit" }}><div className={styles.bannerStack}><PairTiles left="idli" /></div></StoryScene></div>,
    source: "practice",
    prompt: "Which pair is right?",
    options: ["idli and sambar", "idli and key", "idli and thread"],
    correct: "idli and sambar",
    mistake: {
      eyebrow: "Chapter recall · smaller example",
      title: "Think of your plate",
      explanation: "Picture “bread and butter” — you eat them together. Ask what you eat idli with.",
      workedSteps: ["What is idli eaten with?", "That is its pair"],
      rule: "Pairs are things used together.",
        audioSrc: clip("m-think-of-your-plate"),
    },
  },
  {
    id: "recall-story-first",
    visual: <div className={styles.practiceStage}><StoryScene badal={{ x: 400 }} label="The courtyard where the story begins." moti={{ x: 290, action: "sit" }} /></div>,
    source: "handbook",
    prompt: "What happened FIRST in the story?",
    options: [
      "Badal fell into a deep pit",
      "Badal came across a puppy by the side of the road",
      "Moti went near the pit and barked",
    ],
    correct: "Badal came across a puppy by the side of the road",
    mistake: {
      eyebrow: "Story order · smaller example",
      title: "Start at the very beginning",
      explanation:
        "Think of a smaller story: first you find a seed, then you plant it, then it grows. Badal had to MEET Moti before Moti could help him.",
      workedSteps: ["Meet the puppy", "Become friends", "The rainy day", "Moti finds Badal"],
      rule: "Ask: what had to happen before anything else could?",
        audioSrc: clip("m-start-at-the-very-beginning"),
    },
  },
];

const skillLabels: Record<BmSkill, string> = {
  ed: "-ed words",
  marks: "? and .",
  pairs: "word pairs",
  logic: "recall",
};

function RecallCluster({ metrics, onAnswer, onComplete, onMistake, playTone }: BmScreenProps) {
  const [done, setDone] = useState(false);

  const scores = (Object.entries(metrics) as Array<[BmSkill, { attempts: number; correct: number }]>).map(
    ([skill, result]) => ({
      skill,
      score: result.attempts ? Math.round((result.correct / result.attempts) * 100) : 100,
    }),
  );

  return (
    <div className={styles.screen}>
      <Heading
        audioSrc={narration.headings.recall.src}
        eyebrow="Lesson 4 · Show what you know"
        say={narration.headings.recall.say}
        title="Show what you know"
      >
        Answer these on your own — no looking back! Yesterday words, end
        marks, best-friend words, and the story of Badal and Moti.
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
        narration={questionAudio}
        readAloud
        skill="logic"
        sourceLabel={BOOK}
        title="Exercise questions"
      />

      {done ? (
        <section className={styles.summary}>
          <PartyPopper aria-hidden="true" />
          <span>Chapter complete</span>
          <h2>You can spot -ed words, end every sentence properly, and match word pairs!</h2>
          <div>
            {scores.map((item) => (
              <i key={item.skill}>
                <small>{skillLabels[item.skill]}</small>
                <strong>{item.score >= 75 ? "Mastered" : "Keep practising"}</strong>
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
          ? "Badal and Moti complete. Moti followed Badal everywhere — and now these rules will follow you!"
          : "Answer every question to complete the chapter."}
      </Feedback>
    </div>
  );
}
