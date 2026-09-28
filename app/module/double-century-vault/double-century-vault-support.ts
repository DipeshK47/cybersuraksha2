import type { LessonHints } from "../../components/learning/LearningSupport";

export type DcvSkill = "placeValue" | "range" | "order" | "logic";

export type DcvMetrics = Record<
  DcvSkill,
  { attempts: number; correct: number }
>;

export function emptyMetrics(): DcvMetrics {
  return {
    placeValue: { attempts: 0, correct: 0 },
    range: { attempts: 0, correct: 0 },
    order: { attempts: 0, correct: 0 },
    logic: { attempts: 0, correct: 0 },
  };
}

export type VaultDigits = { hundreds: number; tens: number; ones: number };

export function valueOf({ hundreds, tens, ones }: VaultDigits) {
  return hundreds * 100 + tens * 10 + ones;
}

export const dcvHints: LessonHints[] = [
  {
    title: "Read the bead frame house by house",
    prompt: "Each house of the vault frame stands for a different place value.",
    steps: [
      {
        label: "Gentle nudge",
        title: "Name the three houses",
        body: "From left to right the frame reads hundreds, tens, then ones.",
      },
      {
        label: "Worked example",
        title: "Count beads in each house",
        body: "1 bead in hundreds, 5 beads in tens, 6 beads in ones builds one number, the same way your vault frame does.",
        example: "1 hundred + 5 tens + 6 ones → 156",
      },
      {
        label: "Rule",
        title: "Where a digit sits decides its value",
        body: "The same digit means something different depending on which house it sits in.",
      },
    ],
  },
  {
    title: "Turn houses into a total",
    prompt: "Each house is worth more than just its bead count. Work out each house's value, then add them up.",
    steps: [
      {
        label: "Gentle nudge",
        title: "Do not just count the beads",
        body: "2 hundred beads are not worth 2. Each hundred bead is worth 100.",
      },
      {
        label: "Worked example",
        title: "Build the total in three steps",
        body: "2 hundreds is worth 200. 4 tens is worth 40. 3 ones is worth 3.",
        example: "200 + 40 + 3 → 243",
      },
      {
        label: "Rule",
        title: "100 for hundreds, 10 for tens, 1 for ones",
        body: "This rule works for every 3-digit number, not only the examples shown here.",
      },
    ],
  },
  {
    title: "Match each stepper to the target digit",
    prompt: "Compare the dial reading to the target number one column at a time.",
    steps: [
      {
        label: "Gentle nudge",
        title: "Start with hundreds",
        body: "Look at the target's first digit and set the hundreds stepper to match it.",
      },
      {
        label: "Worked example",
        title: "Work left to right",
        body: "For a target like 471, set hundreds to 4, then tens to 7, then ones to 1 — the same idea works on your own target.",
        example: "4 → 7 → 1",
      },
      {
        label: "Rule",
        title: "Every digit has a home",
        body: "A 3-digit target always fixes exactly one hundreds digit, one tens digit, and one ones digit.",
      },
    ],
  },
  {
    title: "Find the gap in every column separately",
    prompt: "Do not subtract the whole numbers at once. Compare column by column.",
    steps: [
      {
        label: "Gentle nudge",
        title: "Line up the two readings",
        body: "Your current reading and your target each have a hundreds, tens, and ones digit. Look at them side by side.",
      },
      {
        label: "Worked example",
        title: "Subtract inside each column",
        body: "If a vault showed 241 and needed to reach 463: Hundreds 4 − 2 = 2 more. Tens 6 − 4 = 2 more. Ones 3 − 1 = 2 more.",
        example: "2 + 2 + 2 = 6 more beads",
      },
      {
        label: "Rule",
        title: "Minimum beads = sum of the column gaps",
        body: "Adding the exact gap in each column always gives the fewest beads needed.",
      },
    ],
  },
  {
    title: "Check both boundaries before you tap",
    prompt: "A number can fail the gate by being too small or too large.",
    steps: [
      {
        label: "Gentle nudge",
        title: "Read the whole rule first",
        body: "The gate needs a number greater than 250 AND less than 400. Both parts must be true.",
      },
      {
        label: "Worked example",
        title: "Test one number",
        body: "Try 325 on this rule: it is greater than 250, and it is also less than 400, so it would pass.",
        example: "250 < 325 < 400 → pass",
      },
      {
        label: "Rule",
        title: "Greater than does not include the boundary",
        body: "250 itself does not pass a “greater than 250” rule, and 400 itself does not pass a “less than 400” rule.",
      },
    ],
  },
  {
    title: "Compare the first different digit",
    prompt: "Two 3-digit numbers can be ordered by comparing hundreds, then tens, then ones.",
    steps: [
      {
        label: "Gentle nudge",
        title: "Compare hundreds first",
        body: "Whichever number has the smaller hundreds digit is smaller overall.",
      },
      {
        label: "Worked example",
        title: "Break the tie with the next column",
        body: "134 and 256 differ in hundreds (1 vs 2), so 134 is smaller straight away — no need to check tens or ones.",
        example: "1 < 2 → 134 < 256",
      },
      {
        label: "Rule",
        title: "Stop at the first column that differs",
        body: "Once one column shows a clear difference, the later columns cannot change the order.",
      },
    ],
  },
  {
    title: "Lock the hundreds digit first",
    prompt: "A double-century code always starts by fixing the hundreds column.",
    steps: [
      {
        label: "Gentle nudge",
        title: "Stay inside 200–299",
        body: "Set the hundreds stepper to 2 before touching tens or ones.",
      },
      {
        label: "Worked example",
        title: "Test the rival comparison",
        body: "Imagine a rival code of 274. If your tens digit is 8 or more, your code already beats it no matter what ones digit you pick.",
        example: "28_ > 274 for any ones digit",
      },
      {
        label: "Rule",
        title: "Beating a target needs the earliest bigger digit",
        body: "If tens ties at 5, the ones digit must be large enough on its own to win.",
      },
    ],
  },
  {
    title: "Retrieve the rule without looking back",
    prompt: "Answer using the ideas you already practised, not by rereading earlier screens.",
    steps: [
      {
        label: "Gentle nudge",
        title: "Separate digit from value",
        body: "A digit's value depends on where it sits, such as hundreds, tens, or ones.",
      },
      {
        label: "Worked example",
        title: "Apply the same comparison rule",
        body: "For 342 and 289, the hundreds digits 3 and 2 already decide which is bigger — no need to look further.",
        example: "compare hundreds → tens → ones",
      },
      {
        label: "Rule",
        title: "A remembered rule should work on a brand-new example",
        body: "If a rule only works for one memorised number, it has not really been learned yet.",
      },
    ],
  },
];
