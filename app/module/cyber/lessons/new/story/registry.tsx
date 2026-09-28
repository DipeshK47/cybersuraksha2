"use client";

import { useEffect, useState } from "react";
import { StoryPlayer } from "./StoryPlayer";
import type { StoryChapter } from "./types";
import s from "./story-player.module.css";

// Every chapters/<lesson-slug>.tsx registers itself; each loads on its own so one chapter can't break another.
const loaders = import.meta.glob<{ default: StoryChapter }>("./chapters/*.tsx");
const bySlug: Record<string, () => Promise<{ default: StoryChapter }>> = Object.fromEntries(
  Object.entries(loaders).map(([path, load]) => [path.slice("./chapters/".length, -".tsx".length), load]),
);

export const hasStoryChapter = (slug: string) => slug in bySlug;

export function StoryChapterPlayer({ slug, onBegin }: { slug: string; onBegin: () => void }) {
  const [chapter, setChapter] = useState<StoryChapter | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let live = true;
    bySlug[slug]().then(module => { if (live) setChapter(module.default); }, () => { if (live) setFailed(true); });
    return () => { live = false; };
  }, [slug]);
  // A story that fails to load should never block the practice behind it.
  useEffect(() => { if (failed) onBegin(); }, [failed, onBegin]);
  if (!chapter) return <section className={s.intro} data-story-loading={slug} aria-busy="true" style={{ minHeight: 640 }} />;
  return <StoryPlayer slug={slug} chapter={chapter} onBegin={onBegin} />;
}
