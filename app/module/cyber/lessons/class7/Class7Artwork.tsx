"use client";

import type { LessonChapter } from '../../../../data/lesson-content';
import type { StoryWorldProps } from '../new/story/types';
import type { StructuredPracticeVisualProps } from '../class8/Class8Lesson';
import { getClass7Artwork } from '../../../../data/class7/artwork';
import { useEvidenceLanguage } from '../class8/ui';
import styles from '../class6/chapter-artwork.module.css';

function ChapterArtwork({ chapter, caption }: { chapter: LessonChapter; caption: string }) {
  const artwork = getClass7Artwork(chapter.slug);
  const language = useEvidenceLanguage();
  return <figure className={styles.artwork} data-class7-artwork={chapter.slug}>
    <img src={artwork.src} srcSet={`${artwork.preview} 640w, ${artwork.src} 1400w`} sizes="(max-width: 600px) calc(100vw - 64px), (max-width: 1000px) 80vw, 880px" width={1400} height={788} alt={artwork.alt[language]} decoding="async" />
    <figcaption>{caption}</figcaption>
  </figure>;
}

export function Class7StoryArtwork({ chapter, scene }: StoryWorldProps & { chapter: LessonChapter }) {
  return <ChapterArtwork chapter={chapter} caption={chapter.scenes[scene].dialogue.en} />;
}

export function Class7PracticeArtwork({ chapter, stage }: StructuredPracticeVisualProps) {
  return <ChapterArtwork chapter={chapter} caption={chapter.outcomes[stage].en} />;
}
