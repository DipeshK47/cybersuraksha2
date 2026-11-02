"use client";
import type {Class9Chapter} from '../../../../data/class9/types';
import type {StoryScript} from '../new/story/types';
import {createStructuredStory} from '../class8/Class8Stories';
import {Class9Illustration} from './Class9Illustration';
import { class9Worlds } from '../../../../data/worlds/class9';

export function createClass9Story(chapter:Class9Chapter,script:StoryScript) {
  return createStructuredStory(chapter,script,{Illustration:Class9Illustration,character:{asset:"boy-emotions",name:"Nikhil"},worlds:class9Worlds});
}
