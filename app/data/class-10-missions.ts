import {class10Chapters} from './class10';

export const CLASS10_LESSON_SLUGS=class10Chapters.map(chapter=>chapter.slug);
export const class10Missions=class10Chapters.map(chapter=>({
  id:`cyber-${chapter.slug}`,slug:chapter.slug,title:chapter.title.en,
  band:'upper' as const,grades:[10],strand:chapter.strand,summary:chapter.summary.en,
  primaryMechanic:`${chapter.slug}-lab`,openingPattern:`${chapter.slug}-story`,completionPattern:`${chapter.slug}-notebook`,
  accent:'indigo' as const,durationMinutes:40,
  assessmentIds:[1,2,3].map(index=>`${chapter.slug}-challenge-${index}`),familyAction:chapter.familyAction.en,
}));
