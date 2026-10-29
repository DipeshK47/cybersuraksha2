"use client";
import type { CyberLessonComponentProps } from '../../lesson-types';
import { getClass6Chapter } from '../../../../data/class6';
import { StructuredLesson } from '../class8/Class8Lesson';
import { class6Ui } from './ui';
import styles from './class6.module.css';
import { Class6PracticeArtwork } from './Class6Artwork';

export function Class6Lesson(props: CyberLessonComponentProps) {
  return <div className={styles.edition} data-class6-lesson={props.lesson.slug}><StructuredLesson {...props} chapter={getClass6Chapter(props.lesson.slug)!} labTitle={class6Ui.practiceLab.en} PracticeVisual={Class6PracticeArtwork} /></div>;
}
