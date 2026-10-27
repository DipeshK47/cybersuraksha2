import { class8Chapters } from "./class8";

export const CLASS8_LESSON_SLUGS = class8Chapters.map(chapter => chapter.slug);
export const class8Missions = class8Chapters.map(chapter => ({
  id: `cyber-${chapter.slug}`,
  slug: chapter.slug,
  title: chapter.title.en,
  band: "middle" as const,
  grades: [8],
  strand: chapter.strand,
  summary: chapter.summary.en,
  primaryMechanic: `${chapter.slug}-lab`,
  openingPattern: `${chapter.slug}-story`,
  completionPattern: `${chapter.slug}-notebook`,
  accent: "mint" as const,
  durationMinutes: 40,
  assessmentIds: [1, 2, 3].map(index => `${chapter.slug}-challenge-${index}`),
  familyAction: chapter.familyAction.en,
}));
