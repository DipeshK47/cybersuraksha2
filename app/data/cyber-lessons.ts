import { z } from "zod";
import rawLessons from "./cyber-lessons.json";
import { newMissions } from "./new-missions";

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
] as const;

export type CyberLessonSlug = (typeof CYBER_LESSON_SLUGS)[number];
export type CyberLessonBand = "lower" | "middle" | "upper";

const cyberLessonSchema = z.object({
  id: z.string().min(1).max(80),
  slug: z.enum(CYBER_LESSON_SLUGS),
  title: z.string().min(1),
  band: z.enum(["lower", "middle", "upper"]),
  grades: z.array(z.number().int().min(3).max(7)).min(1),
  strand: z.enum(["Cybersecurity", "Artificial Intelligence", "Computational Thinking", "Cyber Fraud"]),
  summary: z.string().min(30),
  primaryMechanic: z.string().min(3),
  openingPattern: z.string().min(3),
  completionPattern: z.string().min(3),
  accent: z.enum(["mint", "sky", "yellow", "coral", "lime", "indigo", "violet"]),
  durationMinutes: z.number().int().min(5).max(15),
  assessmentIds: z.array(z.string().min(3)).length(3),
  familyAction: z.string().min(20),
});

export type CyberLessonMeta = z.infer<typeof cyberLessonSchema>;

const expectedGrades: Record<CyberLessonSlug, number[]> = {
  "can-i-tell-this": [3],
  "someone-new-in-my-game": [4],
  "smart-helper-or-normal-tool": [3],
  "teach-moti-to-sort": [4],
  "free-coins-tap-now": [3],
  "the-grown-ups-phone": [4],
  "save-my-game-account": [5],
  "trouble-in-the-class-group": [5],
  "can-the-chatbot-be-wrong": [5],
  "why-does-my-feed-repeat": [5],
  "upi-paying-or-receiving": [5],
  "the-gaming-giveaway-trap": [5],
  "what-did-this-photo-reveal": [6],
  "the-almost-real-login-page": [7],
  "use-ai-without-losing-your-thinking": [6],
  "real-edited-or-ai-made": [7],
  "my-friend-suddenly-needs-money": [6],
  "the-influencer-shop-and-giveaway": [7],
  "pattern-detective": [3, 4],
  "step-by-step-morning": [3, 4],
  "flowchart-architect": [5],
  "loop-inspector": [5],
  "complex-algorithmic-logic": [6, 7],
  "algorithm-optimization": [6, 7],
  "nanis-secret-code": [3, 4],
  "surprise-pop-up": [3, 4],
  "otp-guardian": [5],
  "qr-code-caution": [5],
  "digital-arrest-simulation": [6, 7],
  "deepfake-voice-relative-scam": [6, 7],
  "password-vault-builder": [3, 4],
  "sharing-backpack": [3, 4],
  "password-vault": [5],
  "permission-control-panel": [5],
  "online-reputation-builder": [6, 7],
  "email-header-inspector": [6, 7],
  "robot-or-not": [3, 4],
  "teach-pet-machine": [3, 4],
  "training-day": [5],
  "garbage-in-garbage-out": [5],
  "deepfake-detective": [6, 7],
  "recommendation-rabbit-hole": [6, 7],
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
