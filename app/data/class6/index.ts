import { class6SecurityChapters } from './security';
import { class6AiChapters } from './ai';
import { class6CtChapters } from './ct';
import { class6FraudChapters } from './fraud';

export const class6Chapters = [...class6SecurityChapters, ...class6AiChapters, ...class6CtChapters, ...class6FraudChapters];
export const getClass6Chapter = (slug: string) => class6Chapters.find(chapter => chapter.slug === slug);
