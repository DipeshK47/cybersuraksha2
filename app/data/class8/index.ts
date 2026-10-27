import { class8CtChapters } from "./ct";
import { class8AiChapters } from "./ai";
import { class8SecurityChapters } from "./security";
import { class8FraudChapters } from "./fraud";
import type { Class8Chapter } from "./types";

export const class8Chapters: readonly Class8Chapter[] = [...class8SecurityChapters, ...class8AiChapters, ...class8CtChapters, ...class8FraudChapters];
export const getClass8Chapter = (slug: string) => class8Chapters.find(chapter => chapter.slug === slug);
