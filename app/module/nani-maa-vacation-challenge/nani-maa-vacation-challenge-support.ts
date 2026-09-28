import type { LessonHints } from "../../components/learning/LearningSupport";

export type NmvSkill = "share" | "track" | "strategy" | "logic";

export type NmvMetrics = Record<
  NmvSkill,
  { attempts: number; correct: number }
>;

export function emptyMetrics(): NmvMetrics {
  return {
    share: { attempts: 0, correct: 0 },
    track: { attempts: 0, correct: 0 },
    strategy: { attempts: 0, correct: 0 },
    logic: { attempts: 0, correct: 0 },
  };
}

export const nmvHints: LessonHints[] = [
  {
    title: "Count everything first",
    prompt: "Fair share means every jar ends up with the exact same amount.",
    steps: [
      {
        label: "Gentle nudge",
        title: "Count all three jars",
        body: "Add up the candies in all three jars to get one big total.",
      },
      {
        label: "Worked example",
        title: "Share a total into equal groups",
        body: "If 3 jars together had 12 candies, sharing them equally would give each jar the same small number.",
        example: "12 candies → 3 equal jars",
      },
      {
        label: "Rule",
        title: "Fair share = same amount for everyone",
        body: "Share the total evenly so every jar ends up matching.",
      },
    ],
  },
  {
    title: "Compare to the fair share",
    prompt: "Look at what one fair jar should hold, then compare each jar to it.",
    steps: [
      {
        label: "Gentle nudge",
        title: "Line each jar up against the target",
        body: "Is this jar's count above, below, or exactly at the fair share?",
      },
      {
        label: "Worked example",
        title: "Sort a different set of jars",
        body: "If the fair share were 4, a jar with 2 needs more, a jar with 4 is just right, and a jar with 6 has extra.",
        example: "2 → needs more · 4 → just right · 6 → has extra",
      },
      {
        label: "Rule",
        title: "Above, below, or exactly equal",
        body: "Every jar is either short of the fair share, sitting right on it, or over it.",
      },
    ],
  },
  {
    title: "Move exactly what's needed",
    prompt: "Only move candies from a jar with extra to a jar that needs more.",
    steps: [
      {
        label: "Gentle nudge",
        title: "Move one candy at a time",
        body: "Watch both jars change together as you move each candy.",
      },
      {
        label: "Worked example",
        title: "Stop when both match",
        body: "If a full jar has 3 extra and an empty-ish jar needs 3 more, moving candies one at a time gets both jars to the same number.",
        example: "extra jar shrinks · needy jar grows · they meet in the middle",
      },
      {
        label: "Rule",
        title: "Extra given away always equals extra needed",
        body: "The amount you move from the jar with extra always matches the amount the other jar was missing.",
      },
    ],
  },
  {
    title: "Find the fair share before you move anything",
    prompt: "Work out the target number first, then compare each jar to it.",
    steps: [
      {
        label: "Gentle nudge",
        title: "Add the three jars together",
        body: "The total tells you what three equal jars would add up to.",
      },
      {
        label: "Worked example",
        title: "Share, then compare",
        body: "For jars of 1, 5, and 9 (total 15, fair share 5): the jar with 9 has 4 extra, and the jar with 1 needs 4 more.",
        example: "1, 5, 9 → fair share 5 → move 4",
      },
      {
        label: "Rule",
        title: "Only jars with extra can give candies away",
        body: "A jar exactly at the fair share does not need to change at all.",
      },
    ],
  },
  {
    title: "Work out one hop first",
    prompt: "Find the frog's net move for a single hop before jumping ahead to many hops.",
    steps: [
      {
        label: "Gentle nudge",
        title: "Forward, then back",
        body: "Every hop has two parts: a forward jump, then a slip backward.",
      },
      {
        label: "Worked example",
        title: "Net move per hop",
        body: "If a frog jumps forward 3 and slips back 1, its net move for one whole hop is smaller than the forward jump alone.",
        example: "forward 3, back 1 → net 2 per hop",
      },
      {
        label: "Rule",
        title: "Multiply the net move by the number of hops",
        body: "Once you know the net move for one hop, multiply it by how many full hops happen.",
      },
    ],
  },
  {
    title: "Watch the peak, not just the landing",
    prompt: "A frog touches its farthest point BEFORE it slips back.",
    steps: [
      {
        label: "Gentle nudge",
        title: "Two positions per hop",
        body: "Each hop has a peak (the farthest forward point) and a rest (where it settles after slipping back).",
      },
      {
        label: "Worked example",
        title: "Track the peaks in order",
        body: "If a frog rests at 6 after a hop, its next peak is 6 plus the forward distance — reached before it slips back again.",
        example: "rest 6 → next peak 6 + forward distance",
      },
      {
        label: "Rule",
        title: "The frog can touch a number on the way up",
        body: "A target can be reached during a forward jump, even if the frog later slips back past it.",
      },
    ],
  },
  {
    title: "Check both rules before locking in",
    prompt: "Your rounds have to satisfy the sportsmanship rule AND the final-score rule together.",
    steps: [
      {
        label: "Gentle nudge",
        title: "Let your cousin win sometimes",
        body: "Being a good sport means your cousin should win at least one round.",
      },
      {
        label: "Worked example",
        title: "Try a combination and check the scores",
        body: "Winning most rounds while losing a couple still often leaves the winner ahead, since a win is worth more than a loss costs.",
        example: "more wins than losses → likely still ahead",
      },
      {
        label: "Rule",
        title: "A win helps you more than a loss hurts you",
        body: "Winning gains more points than losing takes away, so a few wins can outweigh one loss.",
      },
    ],
  },
  {
    title: "Reuse the rule, not the numbers",
    prompt: "Apply the same idea you practised earlier to this brand-new example.",
    steps: [
      {
        label: "Gentle nudge",
        title: "Name which mission this matches",
        body: "Is this question about fair sharing, hopping, or a points game?",
      },
      {
        label: "Worked example",
        title: "Swap in the new numbers",
        body: "The same steps you used before still work here — just with different starting numbers.",
        example: "same method, new numbers",
      },
      {
        label: "Rule",
        title: "A method that only works once is not really learned",
        body: "If you understand the idea, it should work on numbers you have never seen before.",
      },
    ],
  },
];
