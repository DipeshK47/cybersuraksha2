import { class7Chapters } from './class7';

export const CLASS7_LESSON_SLUGS = class7Chapters.map(chapter => chapter.slug);
export const class7Missions = class7Chapters.map(chapter => ({
  id: `cyber-${chapter.slug}`, slug: chapter.slug, title: chapter.title.en,
  band: 'middle' as const, grades: [7], strand: chapter.strand, summary: chapter.summary.en,
  primaryMechanic: `${chapter.slug}-lab`, openingPattern: `${chapter.slug}-story`, completionPattern: `${chapter.slug}-notebook`,
  accent: 'mint' as const, durationMinutes: 40,
  assessmentIds: [1, 2, 3].map(index => `${chapter.slug}-challenge-${index}`), familyAction: chapter.familyAction.en,
}));
