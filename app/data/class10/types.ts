import type { LessonChapter } from '../lesson-content';
import type { ChapterVisual } from './visual-types';

export { l } from '../lesson-content.ts';
export type { L, LessonStrand, LessonTask, TaskAnswer } from '../lesson-content';
export type { ChapterVisual, VisualNode, VisualEdge, VisualStep, VisualScene } from './visual-types';
export type Class10Chapter = LessonChapter & { visual: ChapterVisual };
