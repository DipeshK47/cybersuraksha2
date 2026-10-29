import { class7SecurityChapters } from './security';
import { class7AiChapters } from './ai';
import { class7CtChapters } from './ct';
import { class7FraudChapters } from './fraud';

export const class7Chapters = [...class7SecurityChapters, ...class7AiChapters, ...class7CtChapters, ...class7FraudChapters];
export const getClass7Chapter = (slug: string) => class7Chapters.find(chapter => chapter.slug === slug);
