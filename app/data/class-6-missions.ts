import { class6Chapters } from './class6';

export const CLASS6_LESSON_SLUGS = class6Chapters.map(chapter => chapter.slug);
export const class6Missions = class6Chapters.map(chapter => ({
  id: `cyber-${chapter.slug}`, slug: chapter.slug, title: chapter.title.en,
  band: 'middle' as const, grades: [6], strand: chapter.strand, summary: chapter.summary.en,
  primaryMechanic: `${chapter.slug}-lab`, openingPattern: `${chapter.slug}-story`, completionPattern: `${chapter.slug}-notebook`,
  accent: 'mint' as const, durationMinutes: 40,
  assessmentIds: [1, 2, 3].map(index => `${chapter.slug}-challenge-${index}`), familyAction: chapter.familyAction.en,
}));
