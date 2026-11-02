"use client";
import type {Class10Chapter} from '../../../../data/class10/types';
import type {StoryScript} from '../new/story/types';
import {createStructuredStory} from '../class8/Class8Stories';
import {Class10Illustration} from './Class10Illustration';
import {SceneExplanation} from './SceneExplanation';
import {class10Ui} from './ui';
import { class10Worlds } from '../../../../data/worlds/class10';
export function createClass10Story(chapter:Class10Chapter,script:StoryScript) {
 const story=createStructuredStory(chapter,script,{Illustration:Class10Illustration,character:{asset:"boy-emotions",name:"Vihaan"},Explanation:SceneExplanation,worlds:class10Worlds});
 return {...story,credits:class10Ui.credits.en};
}
