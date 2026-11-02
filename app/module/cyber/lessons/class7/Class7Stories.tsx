"use client";
import type { LessonChapter } from '../../../../data/lesson-content';
import type { StoryScript } from '../new/story/types';
import { createStructuredStory } from '../class8/Class8Stories';
import { class7Ui } from './ui';
import { Class7StoryArtwork } from './Class7Artwork';
import { class7Worlds } from '../../../../data/worlds/class7';

export function createClass7Story(chapter: LessonChapter, script: StoryScript) {
  return createStructuredStory(chapter, script, { labTitle: class7Ui.lab.en, teamName: class7Ui.team.en, Explanation: Class7StoryArtwork, worlds: class7Worlds });
}
