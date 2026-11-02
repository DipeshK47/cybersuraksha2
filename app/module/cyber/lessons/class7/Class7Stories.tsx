"use client";
import type { LessonChapter } from '../../../../data/lesson-content';
import type { StoryScript } from '../new/story/types';
import { createStructuredStory } from '../class8/Class8Stories';
import { class7Worlds } from '../../../../data/worlds/class7';

export function createClass7Story(chapter: LessonChapter, script: StoryScript) {
  return createStructuredStory(chapter, script, { character: { asset: "boy-emotions", name: "Neel" }, worlds: class7Worlds });
}
