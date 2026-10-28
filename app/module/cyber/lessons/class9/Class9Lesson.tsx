"use client";
import type {CyberLessonComponentProps} from '../../lesson-types';
import {getClass9Chapter} from '../../../../data/class9';
import {StructuredLesson} from '../class8/Class8Lesson';
import {Class9Illustration} from './Class9Illustration';
import {class9Ui} from './ui';
import s from './class9.module.css';

export function Class9Lesson(props:CyberLessonComponentProps) {
  return <div className={s.edition} data-class9-lesson={props.lesson.slug}><StructuredLesson {...props} chapter={getClass9Chapter(props.lesson.slug)!} Illustration={Class9Illustration} labTitle={class9Ui.lab.en}/></div>;
}
