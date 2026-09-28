"use client";

import { EyeOff, Heart, Search, SkipForward, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import type { CyberLessonComponentProps } from "../../lesson-types";
import { CyberExperienceFrame } from "../CyberExperienceFrame";
import { makeHints } from "../experience-content";
import type { ExperienceDefinition } from "../experience-types";
import { SocialShell } from "../shells/SocialShell";
import { useCyberExperience } from "../useCyberExperience";
import styles from "./middle-experiences.module.css";

const definition: ExperienceDefinition = {
  id: "adaptive-feed",
  objective: "Change Kabir's feed.",
  place: "Loop feed lab",
  guide: "Kabir",
  scenes: ["Watch", "React", "Tune", "Compare"],
  completionTitle: "Kabir changed the feed!",
  completionSummary: "You used skips, hides, and a deliberate search to change recommendations.",
  familyMove: "Compare why two recommended videos may appear on a family device.",
  hints: makeHints("Use the feed controls.", "Likes and watch time strengthen a topic.", "Skip and hide reduce similar items.", "Search deliberately for something different."),
};

const topics = [
  { id: "football", icon: "⚽", title: "Best goals", colour: "#7bc96f" },
  { id: "football-2", icon: "🥅", title: "Goalkeeper saves", colour: "#77bce7" },
  { id: "art", icon: "🎨", title: "Watercolour trick", colour: "#ef9dba" },
  { id: "science", icon: "🔬", title: "Kitchen experiment", colour: "#b6a1e5" },
];

export function AdaptiveFeedExperience({ runtime, ...props }: CyberLessonComponentProps & { assessmentIds: readonly [string, string, string] }) {
  const experience = useCyberExperience(runtime, definition, props.assessmentIds);
  const [index, setIndex] = useState(0);
  const [active, setActive] = useState<"feed" | "search" | "messages" | "profile">("feed");
  const [signals, setSignals] = useState<string[]>([]);
  const [searched, setSearched] = useState(false);
  const feed = useMemo(() => searched ? [topics[2], topics[3], topics[0]] : topics, [searched]);
  const card = feed[index % feed.length];

  function signal(kind: "like" | "skip" | "hide") {
    setSignals((current) => [...current, kind]);
    setIndex((value) => value + 1);
    experience.act({ id: `${kind}-${signals.length}`, correct: true, assessmentIndex: signals.length === 0 ? 0 : signals.length === 2 ? 1 : undefined, nextScene: Math.min(2, signals.length + 1) });
  }

  function searchTopic() { setSearched(true); setActive("feed"); experience.act({ id: "search-new-topic", correct: signals.includes("hide") || signals.includes("skip"), assessmentIndex: 2, nextScene: 3 }); }

  const feedView = <article className={styles.feedCard} style={{ "--feed-colour": card.colour } as React.CSSProperties}><div><span>{card.icon}</span><b>{card.title}</b><small>Recommended because you watched football</small></div><nav><button onClick={() => signal("like")} type="button"><Heart aria-hidden="true" /> Like</button><button onClick={() => signal("skip")} type="button"><SkipForward aria-hidden="true" /> Skip</button><button onClick={() => signal("hide")} type="button"><EyeOff aria-hidden="true" /> Hide</button></nav></article>;

  return (
    <CyberExperienceFrame definition={definition} onHelp={experience.showHint} points={experience.points} runtime={runtime} scene={experience.scene} status={experience.has("search-new-topic") ? "The next recommendations changed." : `${signals.length} feed signals sent.`}>
      <section className={styles.feedExperience} data-experience="adaptive-feed" data-interaction="social">
        <SocialShell active={active} appName="Loop" feed={feedView} onOpen={setActive}>{active === "search" ? <div className={styles.searchPanel}><Search aria-hidden="true" /><h2>Search another interest</h2><button onClick={searchTopic} type="button">🎨 Watercolour</button><button onClick={searchTopic} type="button">🔬 Easy science</button></div> : <div className={styles.emptySocial}><span>Demo view</span></div>}</SocialShell>
        <aside className={styles.signalPanel}><SlidersHorizontal aria-hidden="true" /><h2>What the feed learned</h2><div>{signals.map((signal, signalIndex) => <span key={`${signal}-${signalIndex}`}>{signal === "like" ? "❤️ More like this" : signal === "hide" ? "🙈 Less like this" : "⏭️ Not watched"}</span>)}</div>{!searched ? <button onClick={() => setActive("search")} type="button"><Search aria-hidden="true" /> Search differently</button> : <b>New interests added</b>}</aside>
        {experience.has("search-new-topic") ? <button className={styles.finishAction} onClick={experience.finish} type="button">Finish feed tune</button> : null}
      </section>
    </CyberExperienceFrame>
  );
}
