import type { LessonHints } from "../../components/learning/LearningSupport";

/**
 * Skill buckets for NCERT Santoor Class 3, Chapter 2 "Badal and Moti".
 * `ed`    — past-tense words that end in -ed ("Let us learn A")
 * `marks` — question mark vs full stop ("Let us write C")
 * `pairs` — word pairs joined by "and" ("Let us learn B")
 * `logic` — the final recall screen
 */
export type BmSkill = "ed" | "marks" | "pairs" | "logic";

export type BmMetrics = Record<BmSkill, { attempts: number; correct: number }>;

export function emptyMetrics(): BmMetrics {
  return {
    ed: { attempts: 0, correct: 0 },
    marks: { attempts: 0, correct: 0 },
    pairs: { attempts: 0, correct: 0 },
    logic: { attempts: 0, correct: 0 },
  };
}

export const bmHints: LessonHints[] = [
  {
    title: "Find the time word",
    prompt: "A word wears -ed when the action is already over.",
    steps: [
      {
        label: "Gentle nudge",
        title: "Look for Yesterday or Today",
        body: "Read the sentence again. Does it say yesterday, last night, or today?",
        audioSrc: "/audio/badal-and-moti/hint-0-0.mp3",
      },
      {
        label: "Worked example",
        title: "Yesterday, Moti waited",
        body: "Yesterday is finished. So the waiting already happened, and the word becomes wait + ed.",
        example: "wait + ed = waited",
        audioSrc: "/audio/badal-and-moti/hint-0-1.mp3",
      },
      {
        label: "Rule",
        title: "Already happened? Add -ed",
        body: "If the action is over, add -ed. If it is happening now, leave the word alone.",
        audioSrc: "/audio/badal-and-moti/hint-0-2.mp3",
      },
    ],
  },
  {
    title: "Is it asking or telling?",
    prompt: "Say the sentence out loud and listen to your voice.",
    steps: [
      {
        label: "Gentle nudge",
        title: "Does it want an answer?",
        body: "If the sentence needs someone to answer it, it is asking.",
        audioSrc: "/audio/badal-and-moti/hint-1-0.mp3",
      },
      {
        label: "Worked example",
        title: "Where is my bag",
        body: "This sentence wants an answer, so it is a question. It ends with a question mark.",
        example: "Where is my bag?",
        audioSrc: "/audio/badal-and-moti/hint-1-1.mp3",
      },
      {
        label: "Rule",
        title: "Ask → ? · Tell → .",
        body: "Asking sentences end with a question mark. Telling sentences end with a full stop.",
        audioSrc: "/audio/badal-and-moti/hint-1-2.mp3",
      },
    ],
  },
  {
    title: "Which words go together?",
    prompt: "Best-friend words are used together every day.",
    steps: [
      {
        label: "Gentle nudge",
        title: "Ask what it is used with",
        body: "Pick a word on the left. What do you always use it with?",
        audioSrc: "/audio/badal-and-moti/hint-2-0.mp3",
      },
      {
        label: "Worked example",
        title: "Salt and …",
        body: "Salt is nearly always with pepper on the table. So the pair is salt and pepper.",
        example: "salt and pepper",
        audioSrc: "/audio/badal-and-moti/hint-2-1.mp3",
      },
      {
        label: "Rule",
        title: "Join the pair with and",
        body: "Two best-friend words are joined by the little word and.",
        audioSrc: "/audio/badal-and-moti/hint-2-2.mp3",
      },
    ],
  },
  {
    title: "Use all three rules",
    prompt: "Every question here uses one idea from this chapter.",
    steps: [
      {
        label: "Gentle nudge",
        title: "Which rule is it?",
        body: "Is the question about -ed, about ? and ., or about word pairs?",
        audioSrc: "/audio/badal-and-moti/hint-3-0.mp3",
      },
      {
        label: "Worked example",
        title: "Yesterday, Badal thanked Moti",
        body: "Yesterday means it already happened, so thank became thanked. A telling sentence, so it ends with a full stop.",
        example: "thank + ed = thanked .",
        audioSrc: "/audio/badal-and-moti/hint-3-1.mp3",
      },
      {
        label: "Rule",
        title: "Three small rules",
        body: "Over → -ed. Asking → ?. Telling → . . Best friends → and.",
        audioSrc: "/audio/badal-and-moti/hint-3-2.mp3",
      },
    ],
  },
];
