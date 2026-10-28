"use client";
import type {Class10Chapter} from '../../../../data/class10/types';
import type {StoryScript} from '../new/story/types';
import {createStructuredStory} from '../class8/Class8Stories';
import {Class10Characters} from './Class10Characters';
import {Class10Illustration} from './Class10Illustration';
import {SceneExplanation} from './SceneExplanation';
import {class10Ui} from './ui';
import s from './class10.module.css';
export function createClass10Story(chapter:Class10Chapter,script:StoryScript) {
 const story=createStructuredStory(chapter,script,{Illustration:Class10Illustration,Character:Class10Characters,Explanation:SceneExplanation,labTitle:class10Ui.lab.en,teamName:class10Ui.team.en,className:s.edition});
 return {...story,credits:class10Ui.credits.en};
}
