"use client";

import { BadgeCheck, Check, Eye, FerrisWheel, Flag, Forward, Frown, Lightbulb, MessagesSquare, Mic, Play, ScanFace, Sparkles, Sun, Users } from "lucide-react";
import { useState } from "react";
import { SceneSwap } from "../StoryPlayer";
import type { StoryChapter, StoryWorldProps } from "../types";
import script from "./deepfake-detective.json";
import k from "../story-player.module.css";
import r from "./deepfake-detective.module.css";

type View = { mouth?: "open" | "closed"; eyes?: "open" | "stare"; shadow?: "right" | "left"; wave?: boolean; loud?: boolean; focus?: string };
/** An illustrated (not real) organiser at a lectern, drawn with CSS. */
function Speaker({ view = {}, time = "0:08" }: { view?: View; time?: string }) {
  return <div className={r.video} data-focus={view.focus}>
    <span className={r.banner}>CYBERPUR FAIR</span>
    <span className={r.lamp} />
    <div className={r.person} data-shadow={view.shadow ?? "right"} data-wave={view.wave ?? false}>
      <span className={r.bun} /><span className={r.head}><span className={r.eyes} data-eyes={view.eyes ?? "open"}><i /><i /></span><span className={r.mouth} data-mouth={view.mouth ?? "open"} /></span>
      <span className={r.body}><span className={r.hand} /></span>
    </div>
    <span className={r.mic}><Mic aria-hidden="true" /></span>
    <span className={r.ring} />
    <div className={r.controls}><Play aria-hidden="true" /><span className={r.wave} data-loud={view.loud ?? false}>{[5, 9, 14, 8, 12, 6, 10, 15, 7, 11, 5, 9].map((h, i) => <i key={i} style={{ height: h }} />)}</span><small>{time} / 0:16</small></div>
  </div>;
}

const frames: { t: string; artefact: boolean; clue?: string; note: string; view: View; wrong: string; right: string }[] = [
  { t: "0:02", artefact: false, note: "The fair banner behind her is sharp and correctly spelled.", view: { focus: "banner" }, wrong: "A sharp, correctly spelled banner is ordinary. It isn’t a sign of editing.", right: "Normal: nothing strange about the banner." },
  { t: "0:05", artefact: true, clue: "Unnatural blinking", note: "Her eyes have stayed wide open for 12 seconds without one blink.", view: { eyes: "stare", focus: "eyes" }, wrong: "People blink every few seconds. Twelve seconds without a blink is a classic deepfake clue.", right: "Clue: unnatural blinking." },
  { t: "0:08", artefact: true, clue: "Lip-sync mismatch", note: "Her lips are closed, but the audio is saying “cancelled”.", view: { mouth: "closed", loud: true, focus: "mouth" }, wrong: "Closed lips can’t say “cancelled”. When mouth and sound don’t match, that’s a lip-sync clue.", right: "Clue: lips and audio don’t match." },
  { t: "0:11", artefact: true, clue: "Lighting mismatch", note: "The lamp is on her left, but the shadow on her face falls on the left too.", view: { shadow: "left", focus: "shadow" }, wrong: "Shadows fall away from a light, not towards it. This lighting doesn’t make sense.", right: "Clue: the shadow is on the lamp’s side." },
  { t: "0:14", artefact: false, note: "She waves with one hand as she speaks.", view: { wave: true, focus: "hand" }, wrong: "Waving while talking is ordinary. Look for things that break physics or don’t match the sound.", right: "Normal: people wave while they talk." },
];
const plans = [{ who: "Riya", text: "I’m bringing samosas!", at: .35 }, { who: "Dev", text: "Giant wheel first", at: .48 }, { who: "Anu", text: "Meera, can I test the lake water?", at: .75 }];
const replies = [{ who: "Riya", text: "No way", at: .5 }, { who: "Dev", text: "My whole weekend…", at: .6 }, { who: "Anu", text: "Sharing with my cousins", at: .7 }];
const verify = [
  { label: "Post “FAKE!” in the group right away", ok: false, why: "Clues aren’t proof. Confirm with an official source before telling everyone it’s fake." },
  { label: "Check the fair’s official page first", ok: true, why: "The official page says the fair is on. Now Meera can share that instead." },
  { label: "Forward it with “is this real?”", ok: false, why: "Forwarding still spreads it, even with a question. Check first, then share the official answer." },
];

function World({ scene, playing, elapsed, solved, markSolved, hint, setHint, reduced }: StoryWorldProps) {
  const [decided, setDecided] = useState<boolean[]>(frames.map(() => false));
  const [current, setCurrent] = useState(0);
  const [passing, setPassing] = useState(false);
  const done = solved || passing;
  const marks = solved ? frames.map(() => true) : decided;
  const tagged = marks.every(Boolean);
  // Reveal an item once narration reaches that fraction of the scene (everything shows while paused).
  const cue = (at: number) => !playing || elapsed > script.scenes[scene].duration * at;
  const show = (at: number) => ({ "data-on": cue(at), "aria-hidden": !cue(at) });

  function judge(artefact: boolean) {
    if (done || decided[current]) return;
    const frame = frames[current];
    if (artefact !== frame.artefact) { setHint(frame.wrong); return; }
    const next = decided.map((v, i) => v || i === current);
    setDecided(next); setHint(frame.right);
    const open = next.findIndex(v => !v);
    if (open >= 0) setCurrent(open);
  }
  function check(option: (typeof verify)[number]) {
    if (done || !tagged) return;
    setHint(option.why);
    if (!option.ok) return;
    setPassing(true);
    window.setTimeout(markSolved, reduced ? 0 : 700);
  }
  const frame = frames[current];

  return <SceneSwap scene={scene} reduced={reduced}>
    {(scene === 0 || scene === 5) && <div className={k.device}>
      <div className={k.deviceBar}><span><FerrisWheel size={16} /> CYBERPUR FAIR</span><span>{scene === 0 ? "Saturday & Sunday" : "Saturday night"}</span></div>
      <div className={`${k.deviceArt} ${r.fair}`}>
        {scene === 0 && <><div className={k.badge}><Sparkles /> Stall 14 · Meera’s water tester</div>
          <div className={r.chat}>{plans.map(({ who, text, at }) => <p key={who} {...show(at)}><b>{who}</b>{text}</p>)}</div></>}
        {scene === 5 && <div className={k.success}><FerrisWheel /><strong>The fair is on!</strong><span>Stall 14 is packed</span></div>}
      </div>
      <div className={k.deviceFoot}>{scene === 0 ? <><MessagesSquare /><span>Class 7B group · 38 new messages</span></> : <><BadgeCheck /><span>Meera’s habit: pause, look closer, check the source</span></>}</div>
    </div>}

    {scene === 1 && <div className={r.phoneChat}>
      <div className={r.chatHead}><Users aria-hidden="true" /><strong>Class 7B</strong><small>38 members</small></div>
      <div className={r.forwarded}><small><Forward aria-hidden="true" />Forwarded many times</small><Speaker /><p>“The fair is cancelled this weekend.”</p></div>
      <div className={r.reactions}>{replies.map(({ who, text, at }) => <p key={who} {...show(at)}><b>{who}</b><Frown aria-hidden="true" />{text}</p>)}</div>
      <span className={r.forwardBtn} {...show(.86)}><Forward aria-hidden="true" />Forward</span>
    </div>}

    {scene === 2 && <div className={k.panel}>
      <div className={r.term} {...show(.1)}><ScanFace aria-hidden="true" /><div><strong>Deepfake</strong><span>A fake video or voice of a real person, made with AI.</span></div></div>
      <h2>Clues to look for</h2>
      <div className={r.clues}>
        <span {...show(.42)}><Eye aria-hidden="true" />Blinking that looks wrong</span>
        <span {...show(.52)}><Mic aria-hidden="true" />Lips that don’t match the words</span>
        <span {...show(.62)}><Sun aria-hidden="true" />Light or shadows that don’t make sense</span>
      </div>
      <p className={r.nuance} {...show(.76)}><Lightbulb aria-hidden="true" /><span>A clue isn’t proof. Blurry or compressed video can glitch too. <b>So you check an official source.</b></span></p>
    </div>}

    {scene === 3 && <div className={`${k.panel} ${r.task}`}>
      <h2>Inspect the clip, frame by frame</h2>
      <div className={r.bench}>
        <Speaker view={frame.view} time={frame.t} />
        <div className={r.side}>
          <small>Frame {frame.t}</small>
          <p className={r.note}>{frame.note}</p>
          <div className={r.judge}>
            <button type="button" onClick={() => judge(true)} disabled={done || marks[current]}><Flag />Tag as artefact</button>
            <button type="button" onClick={() => judge(false)} disabled={done || marks[current]}><Check />Looks normal</button>
          </div>
        </div>
      </div>
      <div className={r.strip}>{frames.map((f, i) => <button key={f.t} type="button" aria-label={`Frame ${f.t}`} aria-pressed={current === i} data-done={marks[i]} data-clue={marks[i] && f.artefact} onClick={() => { setCurrent(i); setHint(""); }}>{f.t}{marks[i] && (f.artefact ? <Flag aria-hidden="true" /> : <Check aria-hidden="true" />)}</button>)}</div>
      {tagged && <div className={r.verify}><small>Before sharing, Meera should…</small>{verify.map(v => <button key={v.label} type="button" onClick={() => check(v)} disabled={done}>{v.label}</button>)}</div>}
      <p className={k.hint} aria-live="polite">{hint || (done ? "The official page says the fair is on. Now Meera can share that instead." : tagged ? "Three clues found. What should Meera do before sharing?" : `${marks.filter(Boolean).length} of 5 frames checked.`)}</p>
      <div className={k.actions}><button type="button" className={r.trap} data-trap="true" disabled={done} onClick={() => { if (!done) setHint("Realistic fakes exist, and this clip has clues. Never forward something just because it looks convincing."); }}><Forward />Looks real. Forward it</button></div>
      <small>Illustrated clip. No real person is shown.</small>
    </div>}

    {scene === 4 && <div className={k.panel}>
      <div className={r.official} {...show(.02)}><div className={r.officialHead}><FerrisWheel aria-hidden="true" /><strong>Cyberpur Fair</strong><BadgeCheck aria-hidden="true" /><small>Official page</small></div><p>The fair is <b>ON</b> this weekend. A fake video is going around. Please don’t forward it.</p></div>
      {["Shared the official post in the group", "Asked friends to stop forwarding", "Told her teacher", "Reported the video to the app"].map((step, i) => <div className={k.step} key={step} data-active={cue([.3, .4, .55, .66][i])}><span><Check /></span>{step}</div>)}
    </div>}
  </SceneSwap>;
}

const chapter: StoryChapter = {
  script,
  title: "Meera and the fake fair video",
  icon: ScanFace,
  character: { asset: "emotional-avatar", name: "Meera" },
  interactionScene: 3,
  beginLabel: "Practise with Meera",
  waitingText: "Story paused. Check every frame, then decide what to do before sharing.",
  lockedHint: "Help Meera inspect the clip first.",
  World,
};
export default chapter;
