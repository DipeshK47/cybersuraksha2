import {class9Chapters} from './class9';

export const CLASS9_LESSON_SLUGS=class9Chapters.map(chapter=>chapter.slug);
export const class9Missions=class9Chapters.map(chapter=>({
  id:`cyber-${chapter.slug}`,slug:chapter.slug,title:chapter.title.en,
  band:'upper' as const,grades:[9],strand:chapter.strand,summary:chapter.summary.en,
  primaryMechanic:`${chapter.slug}-lab`,openingPattern:`${chapter.slug}-story`,completionPattern:`${chapter.slug}-notebook`,
  accent:'indigo' as const,durationMinutes:40,
  assessmentIds:[1,2,3].map(index=>`${chapter.slug}-challenge-${index}`),familyAction:chapter.familyAction.en,
}));
