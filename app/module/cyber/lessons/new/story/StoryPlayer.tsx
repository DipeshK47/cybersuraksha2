"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import type { ReactNode } from "react";
import { useRef, useState } from "react";
import { characters } from "./characters";
import { StoryCharacter } from "./StoryCharacter";
import type { StoryChapter } from "./types";
import s from "./story-player.module.css";

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

export function StoryPlayer({ slug, chapter, onBegin }: { slug: string; chapter: StoryChapter; onBegin: () => void }) {
  const { script: { scenes, duration }, interactionScene: gate, World } = chapter;
  const audio = useRef<HTMLAudioElement>(null);
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [audioUnavailable, setAudioUnavailable] = useState(false);
  const [finished, setFinished] = useState(false);
  const [solved, setSolved] = useState(false);
  const [hint, setHint] = useState("");
  const [waiting, setWaiting] = useState(false);
  const reduced = Boolean(useReducedMotion());
  const scene = Math.max(0, scenes.findLastIndex(item => time >= item.start));
  const current = scenes[scene];
  const elapsed = time - current.start;
  const flash = current.flash && playing && elapsed < current.flash.seconds ? current.flash.mood : undefined;
  const mood = scene === gate && solved ? chapter.solvedMood ?? "happy" : flash ?? current.mood;
  const credit = characters[chapter.character.asset].credit;

  async function start() {
    try { await audio.current?.play(); }
    // A quick Pause aborts the pending play(); that is not a broken audio file.
    catch (error) { if ((error as Error).name !== "AbortError") { setAudioUnavailable(true); setPlaying(false); } }
  }
  async function play() {
    if (!audio.current || audioUnavailable || waiting) return;
    if (finished) { audio.current.currentTime = 0; setTime(0); setFinished(false); }
    await start();
  }
  // Scene buttons narrate that scene too; otherwise "Next scene" flips through the story in silence.
  async function jump(index: number) {
    if (index > gate && !solved) { index = gate; setHint(chapter.lockedHint); }
    setTime(scenes[index].start); setFinished(false); setWaiting(false);
    if (!audio.current || audioUnavailable) return;
    audio.current.currentTime = scenes[index].start;
    await start();
  }
  function trackAudio() {
    if (!audio.current) return;
    let next = audio.current.currentTime;
    if (!solved && next >= scenes[gate + 1].start) {
      next = scenes[gate + 1].start - .05;
      audio.current.pause(); audio.current.currentTime = next;
      setWaiting(true);
    }
    setTime(next);
  }
  async function markSolved() {
    if (solved) return;
    const resume = playing || waiting;
    setSolved(true); setWaiting(false); setHint("");
    if (audio.current) audio.current.currentTime = scenes[gate + 1].start;
    setTime(scenes[gate + 1].start);
    if (resume && !audioUnavailable) await start();
  }
  const advance = () => scene === scenes.length - 1 ? onBegin() : void jump(scene + 1);
  const Icon = chapter.icon;

  return <section className={s.intro} data-story-player={slug} data-scene={scene} data-gate={gate} data-playing={playing} data-waiting={waiting} data-solved={solved}>
    <audio ref={audio} src={`/audio/cyber/${slug}/story.mp3`} preload="metadata" muted={muted}
      onTimeUpdate={trackAudio} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
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
    <div className={s.stage} data-chapter={current.id} data-tone={current.tone}>
      <div className={s.actor}>
        <div className={s.speech} key={scene}>{current.dialogue}</div>
        <StoryCharacter asset={chapter.character.asset} name={chapter.character.name} mood={mood} playing={playing} />
        <div className={s.name}><span>{chapter.character.name}</span><span>{current.status}</span></div>
      </div>
      <div className={s.storyWorld}>
        <World scene={scene} playing={playing} elapsed={Math.max(0, elapsed)} solved={solved} markSolved={() => void markSolved()} hint={hint} setHint={setHint} reduced={reduced} />
      </div>
    </div>
    <div className={s.storyText}>
      <div><span className={s.sceneLabel}>Scene {scene + 1} of {scenes.length}</span><h1>{current.title}</h1></div>
      <p aria-live="polite">{current.caption}</p>
    </div>
    <div className={s.timeline} aria-hidden="true"><span style={{ transform: `scaleX(${Math.min(1, time / duration)})` }} /></div>
    <footer className={s.footer}>
      <div className={s.navigation}><button aria-label="Previous scene" disabled={scene === 0} onClick={() => void jump(scene - 1)} type="button"><ArrowLeft /></button><button className={s.primary} onClick={advance} disabled={scene === gate && !solved} type="button">{scene === scenes.length - 1 ? chapter.beginLabel : "Next scene"}<ArrowRight /></button><button className={s.skip} onClick={onBegin} type="button">Skip to practice</button></div>
      <p>{audioUnavailable ? "Audio couldn’t load. Read the captions and use Next scene." : waiting ? chapter.waitingText : "AI male narration · Captions always on"}</p>
    </footer>
    <details className={s.credits}><summary>Animation credits</summary><p>“{credit.title}” by <a href={credit.url} target="_blank" rel="noreferrer">{credit.author}, Rive Marketplace</a>, used under <a href={credit.licenseUrl} target="_blank" rel="noreferrer">{credit.license}</a>. Original animation; expressions controlled by this story. Static fallback frames exported from the same work.</p>{chapter.credits}</details>
  </section>;
}
