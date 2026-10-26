import { z } from "zod";
import rawLessons from "./cyber-lessons.json";
import { newMissions } from "./new-missions";
import { class12Missions, CLASS12_LESSON_SLUGS } from "./class-12-missions";
import { class11Missions, CLASS11_LESSON_SLUGS } from "./class-11-missions";

export const CYBER_LESSON_SLUGS = [
  "can-i-tell-this",
  "someone-new-in-my-game",
  "smart-helper-or-normal-tool",
  "teach-moti-to-sort",
  "free-coins-tap-now",
  "the-grown-ups-phone",
  "save-my-game-account",
  "trouble-in-the-class-group",
  "can-the-chatbot-be-wrong",
  "why-does-my-feed-repeat",
  "upi-paying-or-receiving",
  "the-gaming-giveaway-trap",
  "what-did-this-photo-reveal",
  "the-almost-real-login-page",
  "use-ai-without-losing-your-thinking",
  "real-edited-or-ai-made",
  "my-friend-suddenly-needs-money",
  "the-influencer-shop-and-giveaway",
  "pattern-detective",
  "step-by-step-morning",
  "flowchart-architect",
  "loop-inspector",
  "complex-algorithmic-logic",
  "algorithm-optimization",
  "nanis-secret-code",
  "surprise-pop-up",
  "otp-guardian",
  "qr-code-caution",
  "digital-arrest-simulation",
  "deepfake-voice-relative-scam",
  "password-vault-builder",
  "sharing-backpack",
  "password-vault",
  "permission-control-panel",
  "online-reputation-builder",
  "email-header-inspector",
  "robot-or-not",
  "teach-pet-machine",
  "training-day",
  "garbage-in-garbage-out",
  "deepfake-detective",
  "recommendation-rabbit-hole",
  ...CLASS11_LESSON_SLUGS,
  ...CLASS12_LESSON_SLUGS,
] as const;

export type CyberLessonSlug = (typeof CYBER_LESSON_SLUGS)[number];
export type CyberLessonBand = "lower" | "middle" | "upper";

const cyberLessonSchema = z.object({
  id: z.string().min(1).max(80),
  slug: z.enum(CYBER_LESSON_SLUGS),
  title: z.string().min(1),
  band: z.enum(["lower", "middle", "upper"]),
  grades: z.array(z.number().int().min(6).max(12)).min(1),
  strand: z.enum(["Cybersecurity", "Artificial Intelligence", "Computational Thinking", "Cyber Fraud"]),
  summary: z.string().min(30),
  primaryMechanic: z.string().min(3),
  openingPattern: z.string().min(3),
  completionPattern: z.string().min(3),
  accent: z.enum(["mint", "sky", "yellow", "coral", "lime", "indigo", "violet"]),
  durationMinutes: z.number().int().min(5).max(40),
  assessmentIds: z.array(z.string().min(3)).length(3),
  familyAction: z.string().min(20),
});

export type CyberLessonMeta = z.infer<typeof cyberLessonSchema>;

const expectedGrades: Record<CyberLessonSlug, number[]> = {
  "the-easy-money-recruitment-chain": [12],
  "check-the-investment-story": [12],
  "identity-and-authority-can-be-manufactured": [12],
  "help-after-harm": [12],
  "trace-a-pattern-without-accusing": [12],
  "design-prevention-that-can-be-tested": [12],
  "integrated-case-the-college-fest-incident": [12],
  "the-evidence-hearing": [12],

  "choose-the-right-data-model": [12],
  "how-work-grows-with-input-size": [12],
  "the-duplicate-registration-problem": [12],
  "build-a-reliable-alerts-pipeline": [12],
  "make-failure-visible": [12],
  "do-not-confuse-a-pattern-with-a-cause": [12],
  "retest-after-a-change": [12],
  "automation-design-review": [12],

  "set-a-decision-and-a-baseline": [12],
  "protect-the-evaluation": [12],
  "the-model-that-scores-95-percent": [12],
  "vision-networks-and-changing-inputs": [12],
  "the-source-grounded-research-assistant": [12],
  "when-instructions-arrive-inside-data": [12],
  "who-benefits-who-is-missed": [12],
  "ai-go-revise-stop-review": [12],

  "from-personal-safety-to-system-risk": [12],
  "design-the-college-fest-portal": [12],
  "secure-by-design": [12],
  "protect-the-whole-dependency-chain": [12],
  "when-logs-disagree": [12],
  "the-breach-tabletop": [12],
  "recover-and-learn": [12],
  "security-assurance-review": [12],

  "how-a-scam-builds-pressure": [11],
  "the-internship-that-pays-too-well": [11],
  "before-you-approve-that-payment": [11],
  "when-the-message-looks-official": [11],
  "a-familiar-voice-asks-for-money": [11],
  "what-to-do-after-a-loss": [11],
  "integrated-case-the-festival-refund": [11],
  "defend-your-decision": [11],

  "decompose-the-scholarship-desk": [11],
  "model-only-what-matters": [11],
  "make-the-rules-explicit": [11],
  "trace-and-debug-a-decision": [11],
  "search-and-sort-with-purpose": [11],
  "reuse-a-reliable-step": [11],
  "test-the-boundaries": [11],
  "algorithm-review-board": [11],

  "is-ai-needed-here": [11],
  "frame-a-useful-ai-problem": [11],
  "repair-the-dataset": [11],
  "how-a-model-learns": [11],
  "measure-mistakes-not-confidence": [11],
  "whose-examples-are-missing": [11],
  "can-this-assistant-be-trusted": [11],
  "ai-evaluation-review": [11],

  "your-digital-risk-map": [11],
  "identity-beyond-a-password": [11],
  "who-should-have-access": [11],
  "what-a-browser-can-tell-you": [11],
  "data-has-a-lifecycle": [11],
  "devices-updates-and-backups": [11],
  "the-suspicious-login": [11],
  "security-design-review": [11],

  "can-i-tell-this": [6],
  "someone-new-in-my-game": [7],
  "smart-helper-or-normal-tool": [6],
  "teach-moti-to-sort": [7],
  "free-coins-tap-now": [6],
  "the-grown-ups-phone": [7],
  "save-my-game-account": [8],
  "trouble-in-the-class-group": [8],
  "can-the-chatbot-be-wrong": [8],
  "why-does-my-feed-repeat": [8],
  "upi-paying-or-receiving": [8],
  "the-gaming-giveaway-trap": [8],
  "what-did-this-photo-reveal": [9],
  "the-almost-real-login-page": [10],
  "use-ai-without-losing-your-thinking": [9],
  "real-edited-or-ai-made": [10],
  "my-friend-suddenly-needs-money": [9],
  "the-influencer-shop-and-giveaway": [10],
  "pattern-detective": [6, 7],
  "step-by-step-morning": [6, 7],
  "flowchart-architect": [8],
  "loop-inspector": [8],
  "complex-algorithmic-logic": [9, 10],
  "algorithm-optimization": [9, 10],
  "nanis-secret-code": [6, 7],
  "surprise-pop-up": [6, 7],
  "otp-guardian": [8],
  "qr-code-caution": [8],
  "digital-arrest-simulation": [9, 10],
  "deepfake-voice-relative-scam": [9, 10],
  "password-vault-builder": [6, 7],
  "sharing-backpack": [6, 7],
  "password-vault": [8],
  "permission-control-panel": [8],
  "online-reputation-builder": [9, 10],
  "email-header-inspector": [9, 10],
  "robot-or-not": [6, 7],
  "teach-pet-machine": [6, 7],
  "training-day": [8],
  "garbage-in-garbage-out": [8],
  "deepfake-detective": [9, 10],
  "recommendation-rabbit-hole": [9, 10],
};

function assertUnique(
  lessons: CyberLessonMeta[],
  select: (lesson: CyberLessonMeta) => string,
  label: string,
) {
  const values = lessons.map(select);
  if (new Set(values).size !== values.length) {
    throw new Error(`Cyber lesson catalog contains a duplicate ${label}.`);
  }
}

const parsedLessons = [
  ...z.array(cyberLessonSchema).length(18).parse(rawLessons),
  ...z.array(cyberLessonSchema).parse(newMissions),
  ...z.array(cyberLessonSchema).parse(class11Missions),
  ...z.array(cyberLessonSchema).parse(class12Missions),
];

assertUnique(parsedLessons, (lesson) => lesson.id, "id");
assertUnique(parsedLessons, (lesson) => lesson.slug, "slug");
assertUnique(parsedLessons, (lesson) => lesson.primaryMechanic, "primary mechanic");
assertUnique(parsedLessons, (lesson) => lesson.openingPattern, "opening pattern");
assertUnique(parsedLessons, (lesson) => lesson.completionPattern, "completion pattern");

for (const lesson of parsedLessons) {
  if (lesson.grades.join(",") !== expectedGrades[lesson.slug].join(",")) {
    throw new Error(`Cyber lesson ${lesson.slug} has the wrong class assignment.`);
  }
  if (!lesson.assessmentIds.every((id) => id.startsWith(`${lesson.slug}-`))) {
    throw new Error(`Cyber lesson ${lesson.slug} has an invalid assessment id.`);
  }
}

const catalogSlugs = parsedLessons.map((lesson) => lesson.slug);
if (catalogSlugs.join("|") !== CYBER_LESSON_SLUGS.join("|")) {
  throw new Error("Cyber lesson slug tuple and JSON catalog are out of sync.");
}

export const cyberLessons: CyberLessonMeta[] = parsedLessons;

export function getCyberLesson(slug: string) {
  return cyberLessons.find((lesson) => lesson.slug === slug);
}

export function getCyberLessonsForGrade(grade: number) {
  return cyberLessons.filter((lesson) => lesson.grades.includes(grade));
}
