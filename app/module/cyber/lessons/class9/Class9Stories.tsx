"use client";
import type {Class9Chapter} from '../../../../data/class9/types';
import type {StoryScript} from '../new/story/types';
import {createStructuredStory} from '../class8/Class8Stories';
import {Class9Characters} from './Class9Characters';
import {Class9Illustration} from './Class9Illustration';
import {class9Ui} from './ui';
import s from './class9.module.css';

export function createClass9Story(chapter:Class9Chapter,script:StoryScript) {
  return createStructuredStory(chapter,script,{Illustration:Class9Illustration,Character:Class9Characters,labTitle:class9Ui.lab.en,teamName:class9Ui.team.en,className:s.edition});
}
