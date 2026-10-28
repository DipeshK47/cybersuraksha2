import { class9SecurityChapters } from './security';
import { class9AiChapters } from './ai';
import { class9CtChapters } from './ct';
import { class9FraudChapters } from './fraud';
import type { Class9Chapter } from './types';

export const class9Chapters: readonly Class9Chapter[] = [...class9SecurityChapters,...class9AiChapters,...class9CtChapters,...class9FraudChapters];
export const getClass9Chapter = (slug: string) => class9Chapters.find(chapter=>chapter.slug===slug);
