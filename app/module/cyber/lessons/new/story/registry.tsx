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
  const [loaded, setLoaded] = useState<{ slug: string; chapter: StoryChapter } | null>(null);
  const [failed, setFailed] = useState<string | null>(null);
  useEffect(() => {
    let live = true;
    bySlug[slug]().then(module => { if (live) setLoaded({ slug, chapter: module.default }); }, () => { if (live) setFailed(slug); });
    return () => { live = false; };
  }, [slug]);
  if (failed === slug) return <section className={s.intro} data-story-error={slug} aria-live="polite"><div className={s.panel}>
    <h1>Story couldn’t load</h1><p>Check the connection and try the story again.</p>
    <div className={s.actions}><button className={s.primary} onClick={() => window.location.reload()} type="button">Try story again</button><button onClick={onBegin} type="button">Go to practice</button></div>
  </div></section>;
  if (loaded?.slug !== slug) return <section className={s.intro} data-story-loading={slug} aria-busy="true" style={{ minHeight: 640 }} />;
  return <StoryPlayer slug={slug} chapter={loaded.chapter} onBegin={onBegin} />;
}
