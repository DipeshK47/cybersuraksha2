"use client";
import type { LessonChapter } from '../../../../data/lesson-content';
import type { StoryScript } from '../new/story/types';
import { createStructuredStory } from '../class8/Class8Stories';
import { class6Ui } from './ui';
import { Class6StoryArtwork } from './Class6Artwork';

export function createClass6Story(chapter: LessonChapter, script: StoryScript) {
  return createStructuredStory(chapter, script, { labTitle: class6Ui.lab.en, teamName: class6Ui.team.en, Explanation: Class6StoryArtwork });
}
