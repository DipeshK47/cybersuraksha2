"use client";
import type { CyberLessonComponentProps } from '../../lesson-types';
import { getClass7Chapter } from '../../../../data/class7';
import { StructuredLesson } from '../class8/Class8Lesson';
import { class7Ui } from './ui';
import styles from '../class6/class6.module.css';
import { Class7PracticeArtwork } from './Class7Artwork';

export function Class7Lesson(props: CyberLessonComponentProps) {
  return <div className={styles.edition} data-class7-lesson={props.lesson.slug}><StructuredLesson {...props} chapter={getClass7Chapter(props.lesson.slug)!} labTitle={class7Ui.practiceLab.en} PracticeVisual={Class7PracticeArtwork} /></div>;
}
