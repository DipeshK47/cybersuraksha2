"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import type { ReactNode } from "react";
import { useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { StoryCharacter } from "./StoryCharacter";
import type { StoryChapter, StoryMediaClock } from "./types";
import s from "./story-player.module.css";

function subscribeLanguage(changed: () => void) {
  const observer = new MutationObserver(changed);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  return () => observer.disconnect();
}
const currentLanguage = () => document.documentElement.lang;
const serverLanguage = () => "en";

// Native media seeks can truncate an authored boundary by one microsecond
// (for example 65.526 becomes 65.525999). Keep that seek in its scene.
const MEDIA_TIME_PRECISION = .000001;

const sceneElapsed = (start: number, duration: number, time: number, limit: number) => Math.max(0, Math.min(duration, Math.min(time, limit) - start));

/** Keep the visualization clock scene-local even before React receives an audio timeupdate. */
export function createStoryMediaClock(options: {
  start: number; duration: number; readTime: () => number; readLimit: () => number;
  pause: () => void; resume: () => void;
}): StoryMediaClock {
  return {
    duration: options.duration,
    readElapsed: () => sceneElapsed(options.start, options.duration, options.readTime(), options.readLimit()),
    pause: options.pause,
    resume: options.resume,
  };
}

/** Scene-to-scene transition every chapter world uses, so all stories move the same way. */
export function SceneSwap({ scene, reduced, children }: { scene: number; reduced: boolean; children: ReactNode }) {
  return <AnimatePresence mode="wait" initial={false}>
    <motion.div key={scene} className={s.sceneContent}
      initial={reduced ? false : { opacity: 0, transform: "translateY(12px)" }} animate={{ opacity: 1, transform: "translateY(0px)" }}
      exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .2 }}>
      {children}
    </motion.div>
  </AnimatePresence>;
}

export function StoryPlayer({ slug, chapter, onBegin, onActivity }: { slug: string; chapter: StoryChapter; onBegin: () => void; onActivity?: (type: string, payload?: unknown) => void }) {
  const { interactionScene: gate, World } = chapter;
  const language = useSyncExternalStore(subscribeLanguage, currentLanguage, serverLanguage);
  const narration = language === "hi" ? chapter.hindiAudio : undefined;
  const [activeNarration, setActiveNarration] = useState(narration);
  const scenes = chapter.script.scenes.map((scene, index) => ({ ...scene, ...narration?.scenes[index] }));
  const duration = narration?.duration ?? chapter.script.duration;
  const source = narration?.src ?? `/audio/cyber/${slug}/story.mp3`;
  const audio = useRef<HTMLAudioElement>(null);
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [audioUnavailable, setAudioUnavailable] = useState(false);
  const [finished, setFinished] = useState(false);
  const [solved, setSolved] = useState(false);
  const solvedRef = useRef(false);
  const [hint, setHint] = useState("");
  const [waiting, setWaiting] = useState(false);
  // Restart only this section in the new voice; keep the learner's decision and world state.
  if (activeNarration !== narration) {
    const previousScenes = activeNarration?.scenes ?? chapter.script.scenes;
    const index = Math.max(0, previousScenes.findLastIndex(item => time >= item.start - MEDIA_TIME_PRECISION));
    setActiveNarration(narration); setTime(scenes[index].start);
    setPlaying(false); setFinished(false); setWaiting(false); setAudioUnavailable(false);
  }
  const reduced = Boolean(useReducedMotion());
  const scene = Math.max(0, scenes.findLastIndex(item => time >= item.start - MEDIA_TIME_PRECISION));
  const current = scenes[scene];
  const elapsed = time - current.start;
  const flash = current.flash && playing && elapsed < current.flash.seconds ? current.flash.mood : undefined;
  const mood = scene === gate && solved ? chapter.solvedMood ?? "happy" : flash ?? current.mood;

  async function start() {
    const element = audio.current;
    try { await element?.play(); }
    // A quick Pause aborts the pending play(); that is not a broken audio file.
    catch (error) { if (element === audio.current && (error as Error).name !== "AbortError") { setAudioUnavailable(true); setPlaying(false); } }
  }
  async function play() {
    if (!audio.current || audioUnavailable || waiting) return;
    if (finished) { audio.current.currentTime = 0; setTime(0); setFinished(false); }
    await start();
  }
  // Scene buttons narrate that scene too; otherwise "Next scene" flips through the story in silence.
  async function jump(index: number) {
    if (index > gate && !solved) { index = gate; setHint(chapter.lockedHint); }
    onActivity?.("story_viewed", { scene: scenes[index].id, category: scenes[index].title });
    setTime(scenes[index].start); setFinished(false); setWaiting(false);
    if (!audio.current || audioUnavailable) return;
    audio.current.currentTime = scenes[index].start;
    await start();
  }
  function trackAudio() {
    if (!audio.current || audioUnavailable || audio.current.readyState === 0) return;
    let next = audio.current.currentTime;
    if (!solvedRef.current && next >= scenes[gate + 1].start) {
      next = scenes[gate + 1].start - .05;
      audio.current.pause(); audio.current.currentTime = next;
      setWaiting(true);
    }
    setTime(next);
  }
  async function markSolved() {
    if (solvedRef.current) return;
    if (!chapter.managedFeedback) onActivity?.("story_answered", { id: `${slug}-story`, correct: true, category: scenes[gate].title, feedback: "Story exercise solved." });
    const resume = playing || waiting;
    solvedRef.current = true;
    setSolved(true); setWaiting(false); setHint("");
    if (audio.current) audio.current.currentTime = scenes[gate + 1].start;
    setTime(scenes[gate + 1].start);
    if (resume && !audioUnavailable) await start();
  }
  // Read changing playback state through a ref so timeupdate does not replace the adapter.
  const mediaState = useRef({ time, audioUnavailable, play, trackAudio });
  useLayoutEffect(() => { mediaState.current = { time, audioUnavailable, play, trackAudio }; });
  const gateStart = scenes[gate + 1].start;
  // Timing includes scene/voice identity even when two narrations share durations.
  const sceneStart = Number(current.start), sceneDuration = Number(current.duration);
  const mediaTiming = useMemo(() => ({ source, scene, start: sceneStart, duration: sceneDuration, gateStart }), [source, scene, sceneStart, sceneDuration, gateStart]);
  const media = useMemo<StoryMediaClock>(() => ({
    duration: mediaTiming.duration,
    readElapsed: () => {
      const element = audio.current;
      const actualTime = element && element.readyState > 0 && !mediaState.current.audioUnavailable && Number.isFinite(element.currentTime) ? element.currentTime : mediaState.current.time;
      return sceneElapsed(mediaTiming.start, mediaTiming.duration, actualTime, solvedRef.current ? Infinity : mediaTiming.gateStart - .05);
    },
    pause: () => { mediaState.current.trackAudio(); audio.current?.pause(); setPlaying(false); },
    resume: () => { void mediaState.current.play(); },
  }), [mediaTiming]);
  const advance = () => scene === scenes.length - 1 ? onBegin() : void jump(scene + 1);
  const Icon = chapter.icon;

  return <section className={`${s.intro} ${slug === "password-vault-builder" ? "" : s.polishedMotion}`} data-story-player={slug} data-scene={scene} data-gate={gate} data-playing={playing} data-waiting={waiting} data-solved={solved}>
    <audio key={source} ref={audio} src={source} preload="metadata" muted={muted}
      onLoadedMetadata={() => { if (audio.current) audio.current.currentTime = time; }}
      onTimeUpdate={trackAudio} onPlay={() => setPlaying(true)} onPause={() => { trackAudio(); setPlaying(false); }}
      onEnded={() => { setPlaying(false); setFinished(true); setTime(duration); }}
      onError={() => { setAudioUnavailable(true); setPlaying(false); }} />
    <header className={s.header}>
      <div><Icon aria-hidden="true" /><strong>{chapter.title}</strong></div>
      <div className={s.transport}>
        <button disabled={audioUnavailable || waiting} onClick={() => playing ? audio.current?.pause() : void play()} type="button">
          {playing ? <Pause /> : finished ? <RotateCcw /> : <Play />}
          <span>{playing ? "Pause story" : finished ? "Replay story" : "Play story"}</span>
        </button>
        <button aria-label={muted ? "Turn sound on" : "Turn sound off"} aria-pressed={muted} onClick={() => setMuted(value => !value)} type="button">{muted ? <VolumeX /> : <Volume2 />}</button>
      </div>
    </header>
    <nav className={s.chapters} aria-label="Story scenes">
      {scenes.map((item, index) => <button key={item.id} aria-current={scene === index ? "step" : undefined} aria-label={`Scene ${index + 1}: ${item.label}`} onClick={() => void jump(index)} type="button"><span>{index + 1}</span><span>{item.label}</span></button>)}
    </nav>
    <div className={s.stage} data-story-stage data-chapter={current.id} data-tone={current.tone}>
      <div className={s.actor} data-story-actor>
        <div className={s.speech} key={scene}>{current.dialogue}</div>
        {chapter.Character ? <chapter.Character mood={mood} playing={playing} reduced={reduced} /> : <StoryCharacter asset={chapter.character.asset} name={chapter.character.name} mood={mood} playing={playing} />}
        <div className={s.name}><span>{chapter.character.name}</span><span>{current.status}</span></div>
      </div>
      <div className={s.storyWorld}>
        <World scene={scene} playing={playing} elapsed={Math.max(0, elapsed)} solved={solved} markSolved={() => void markSolved()} hint={hint} setHint={(message, correct) => { setHint(message); if (message) onActivity?.(correct === undefined ? "story_feedback" : "story_answered", { id: `${slug}-story`, correct, category: scenes[gate].title, feedback: message }); }} onActivity={onActivity} reduced={reduced} media={media} />
      </div>
    </div>
    <div className={s.storyText}>
      <div><span className={s.sceneLabel}>Scene {scene + 1} of {scenes.length}</span><h1>{current.title}</h1></div>
      <p aria-live="polite">{current.caption}</p>
    </div>
    <div className={s.timeline} aria-hidden="true"><span style={{ transform: `scaleX(${Math.min(1, time / duration)})` }} /></div>
    <footer className={s.footer}>
      <div className={s.navigation}><button aria-label="Previous scene" disabled={scene === 0} onClick={() => void jump(scene - 1)} type="button"><ArrowLeft /></button><button className={s.primary} onClick={advance} disabled={scene === gate && !solved} type="button">{scene === scenes.length - 1 ? chapter.beginLabel : "Next scene"}<ArrowRight /></button><button className={s.skip} onClick={onBegin} type="button">Skip to practice</button></div>
      {audioUnavailable ? <p>Audio couldn’t load. Read the captions and use Next scene.</p> : waiting ? <p>{chapter.waitingText}</p> : null}
    </footer>
  </section>;
}
