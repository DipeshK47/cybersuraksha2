"use client";
import type {CyberLessonComponentProps} from '../../lesson-types';
import {getClass10Chapter} from '../../../../data/class10';
import {StructuredLesson} from '../class8/Class8Lesson';
import {PracticeTrace} from './PracticeTrace';
import {Class10Illustration} from './Class10Illustration';
import {class10Ui} from './ui';
import s from './class10.module.css';
export function Class10Lesson(props:CyberLessonComponentProps) {
 return <div className={s.edition} data-class10-lesson={props.lesson.slug}><StructuredLesson {...props} chapter={getClass10Chapter(props.lesson.slug)!} Illustration={Class10Illustration} PracticeVisual={PracticeTrace} labTitle={class10Ui.lab.en}/></div>;
}
