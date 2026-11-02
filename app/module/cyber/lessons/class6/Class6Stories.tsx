"use client";
import type { LessonChapter } from '../../../../data/lesson-content';
import type { StoryScript } from '../new/story/types';
import { createStructuredStory } from '../class8/Class8Stories';
import { class6Worlds } from '../../../../data/worlds/class6';

export function createClass6Story(chapter: LessonChapter, script: StoryScript) {
  return createStructuredStory(chapter, script, { character: { asset: "boy-emotions", name: "Kabir" }, worlds: class6Worlds });
}
