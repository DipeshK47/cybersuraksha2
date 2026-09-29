"use client";

import type { LucideIcon } from "lucide-react";
import { Angry, ArrowDown, ArrowLeft, ArrowRight, ArrowUp, BadgeCheck, Bell, Brush, Check, CircleHelp, Cpu, EyeOff, FerrisWheel, Flame, FlaskConical, Gauge, ListVideo, Megaphone, MessageSquare, MousePointerClick, Newspaper, Play, RefreshCw, Repeat, Search, Siren, TriangleAlert, Trophy, X } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { SceneSwap } from "../StoryPlayer";
import type { StoryChapter, StoryWorldProps } from "../types";
import script from "./recommendation-rabbit-hole.json";
import k from "../story-player.module.css";
import r from "./recommendation-rabbit-hole.module.css";

type Clip = { title: string; channel: string; icon: LucideIcon; tone: string; time: string };

const favourites: Clip[] = [
  { title: "5 cricket catches you can practise", channel: "Nets & Catches", icon: Trophy, tone: "sky", time: "4:12" },
  { title: "Baking-soda volcano in slow motion", channel: "Lab at Home", icon: FlaskConical, tone: "lime", time: "6:05" },
  { title: "Sketch a friendly dragon in 10 steps", channel: "Sketch Club", icon: Brush, tone: "violet", time: "8:40" },
];
const fairClip: Clip = { title: "The fair is CANCELLED?", channel: "Unknown account", icon: Megaphone, tone: "rumour", time: "0:38" };
// Scene 2: the feed narrows, one rumour at a time, each angrier than the last.
const spiral: Clip[] = [
  { title: "Fair CANCELLED! Proof inside", channel: "Viral Buzz", icon: Megaphone, tone: "rumour", time: "0:41" },
  { title: "3 MORE videos say it’s off", channel: "Shock Feed", icon: Repeat, tone: "rumour", time: "1:02" },
  { title: "Parents FURIOUS at organisers", channel: "Rage Reacts", icon: Angry, tone: "hot", time: "2:15" },
  { title: "Ride UNSAFE?! Watch before it’s gone", channel: "Fair Truth Exposed", icon: TriangleAlert, tone: "hot", time: "0:59" },
];
const spiralAt = [2.6, 4.2, 8.2, 9];
const spiralMeter = [58, 44, 31, 19, 12];

// Scene 4: the task feed. "Watching" a rumour pulls in the next one from this pool.
const pool: Clip[] = [
  { title: "Fair CANCELLED! Proof inside", channel: "Viral Buzz", icon: Megaphone, tone: "rumour", time: "0:41" },
  { title: "Parents FURIOUS at organisers", channel: "Rage Reacts", icon: Angry, tone: "hot", time: "2:15" },
  { title: "Ride UNSAFE?! Watch before it’s gone", channel: "Fair Truth Exposed", icon: TriangleAlert, tone: "hot", time: "0:59" },
  { title: "What they’re HIDING about the fair", channel: "Shock Feed", icon: Siren, tone: "hot", time: "3:30" },
  { title: "You won’t BELIEVE fair video #7", channel: "Viral Buzz", icon: Flame, tone: "rumour", time: "1:47" },
];
const topicChoices: Clip[] = [
  { title: "Cricket", channel: "Nets & Catches", icon: Trophy, tone: "sky", time: "" },
  { title: "Science", channel: "Lab at Home", icon: FlaskConical, tone: "lime", time: "" },
  { title: "Sketching", channel: "Sketch Club", icon: Brush, tone: "violet", time: "" },
];
const sources = [
  { name: "Cyberpur Fair · Official", detail: "fair.cyberpur.example · organisers’ updates", icon: BadgeCheck, tone: "official", reliable: true },
  { name: "Cyberpur Kids News", detail: "news.cyberpur.example · checks facts first", icon: Newspaper, tone: "news", reliable: true },
  { name: "FAIR TRUTH EXPOSED!!", detail: "New account · posts only fair rumours", icon: Flame, tone: "hot", reliable: false },
];
const GOAL = 75;
const TRAP_WATCH = "That tap is a signal: “more like this.” Another rumour joined the feed and the meter dropped. Try Not interested instead.";
const TRAP_FULL = "That’s another “more like this” signal, and the feed is already packed with rumours. Try Not interested instead.";
const TRAP_FOLLOW = "That channel only posts fair rumours, and a name with “truth” in it isn’t proof. Following it would narrow the feed even more. Pick a source that checks facts.";

function Thumb({ clip, children }: { clip: Clip; children?: ReactNode }) {
  const src = clip.tone === "sky" ? "cricket" : clip.tone === "lime" ? "volcano" : clip.tone === "violet" ? "dragon-sketch" : null;
  const art = src ? `/cyber-missions/refined/${src}.webp` : "/cyber-missions/fairground-vault.jpg";
  return <span className={r.thumb} data-tone={clip.tone}>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={art} alt="" width={560} height={940} />
    {clip.time && <i>{clip.time}</i>}{children}
  </span>;
}

function Card({ clip, children }: { clip: Clip; children?: ReactNode }) {
  return <div className={r.card}><Thumb clip={clip}>{children}</Thumb><strong>{clip.title}</strong><small>{clip.channel}</small></div>;
}

function AppBar() {
  return <div className={k.deviceBar}><span><Play size={15} /> CYBERPUR CLIPS</span><span>Pretend app · Kabir</span></div>;
}

function Tabs() {
  return <div className={r.tabs} aria-hidden="true"><b>For you</b><span>Following</span><span>Explore</span><Search /><Bell /></div>;
}

function Meter({ value }: { value: number }) {
  const zone = value >= GOAL ? "balanced" : value >= 40 ? "narrowing" : "bubble";
  return <div className={r.meter} data-zone={zone}>
    <div><Gauge aria-hidden="true" /><span>Topic diversity</span><strong>{value}%</strong><b>{zone === "balanced" ? "Balanced" : zone === "narrowing" ? "Narrowing" : "Filter bubble"}</b></div>
    <div className={r.bar} role="meter" aria-label="Topic diversity" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}><i style={{ transform: `scaleX(${value / 100})` }} /><span style={{ left: `${GOAL}%` }} /></div>
  </div>;
}

function World({ scene, playing, elapsed, solved, markSolved, hint, setHint, reduced }: StoryWorldProps) {
  const [feed, setFeed] = useState([0, 1, 2]);
  const [hidden, setHidden] = useState(0);
  const [topics, setTopics] = useState<string[]>([]);
  const [follows, setFollows] = useState<string[]>([]);
  const on = (t: number) => !playing || elapsed >= t;

  const good = topics.length + follows.length;
  const total = good + feed.length;
  // Share of non-rumour clips, plus how many topics are in the mix, minus a pull for every rumour on screen.
  const meter = Math.max(5, Math.min(100, Math.round((total ? good / total : 1) * 60 + Math.min(4, good + (feed.length ? 1 : 0)) * 10 + 15 - feed.length * 5)));
  const checks = [
    { label: "2+ new topics", done: topics.length >= 2 },
    { label: "Not interested on a rumour", done: hidden >= 1 },
    { label: "A reliable source", done: follows.length >= 1 },
  ];
  const ready = checks.every(item => item.done) && meter >= GOAL;

  function moreRumours(message: string) {
    if (solved) return;
    const next = pool.findIndex((_, i) => !feed.includes(i));
    const room = feed.length < 4 && next >= 0;
    if (room) setFeed([...feed, next]);
    setHint(room ? message : TRAP_FULL);
  }
  function notInterested(index: number) {
    if (solved) return;
    setFeed(value => value.filter(i => i !== index)); setHidden(value => value + 1);
    setHint("Not interested sends the opposite signal: fewer videos like this one.");
  }
  function toggleTopic(topic: string) {
    if (solved) return;
    const adding = !topics.includes(topic);
    setTopics(value => adding ? [...value, topic] : value.filter(item => item !== topic));
    setHint(adding ? `${topic} gives the feed a wider signal: Kabir likes more than one thing.` : "");
  }
  function follow(name: string, reliable: boolean) {
    if (solved) return;
    if (!reliable) { moreRumours(TRAP_FOLLOW); return; }
    const adding = !follows.includes(name);
    setFollows(value => adding ? [...value, name] : value.filter(item => item !== name));
    setHint(adding ? `${name.split(" · ")[0]} adds checked updates about the fair, not rumours.` : "");
  }

  const idle = ready ? "Meter in the green. Refresh the feed to see the new mix." : `Meter at ${meter}%. Mix new topics, hide rumours and follow a source that checks facts.`;

  return <SceneSwap scene={scene} reduced={reduced}>
    {scene === 0 && <div className={k.device}>
      <AppBar /><Tabs />
      <div className={r.feed}>
        {favourites.map(clip => <Card clip={clip} key={clip.title} />)}
        <Card clip={fairClip}>
          <em className={r.signal} data-on={on(11)}><Repeat aria-hidden="true" />Watched 2×</em>
          <em className={r.signal} data-on={on(13.5)}><MessageSquare aria-hidden="true" />Paused on comments</em>
        </Card>
      </div>
      <div className={k.deviceFoot}><Meter value={on(11) ? 81 : 88} /></div>
    </div>}

    {scene === 1 && <div className={k.device}>
      <AppBar /><Tabs />
      <div className={r.feed} data-trouble="true">
        {spiral.map((clip, i) => on(spiralAt[i]) ? <Card clip={clip} key={clip.title} /> : <div className={r.skeleton} key={clip.title} aria-hidden="true"><span /><i /><i /></div>)}
      </div>
      <div className={k.deviceFoot}><Meter value={spiralMeter[spiralAt.filter(on).length]} /></div>
    </div>}

    {scene === 2 && <div className={k.panel}>
      <div className={r.papa}><span>Papa</span><p>“The app isn’t reading your mind. It’s reading your clicks.”</p></div>
      <h2>How the feed learned</h2>
      <div className={r.loop}>
        <div className={r.node} data-active={on(8.5)}><MousePointerClick aria-hidden="true" /><strong>1 · Kabir’s signals</strong><span>Tap, replay twice, pause on comments</span></div>
        <ArrowRight className={r.arrow} aria-hidden="true" />
        <div className={r.node} data-active={on(11)}><Cpu aria-hidden="true" /><strong>2 · The algorithm guesses</strong><span>“He wants more fair rumours.”</span></div>
        <ArrowUp className={r.arrow} aria-hidden="true" />
        <span className={r.hub} data-active={on(15.8)}><RefreshCw aria-hidden="true" /></span>
        <ArrowDown className={r.arrow} aria-hidden="true" />
        <div className={r.node} data-active={on(18)}><EyeOff aria-hidden="true" /><strong>4 · Other topics fade</strong><span>Cricket, science and sketching slip away</span></div>
        <ArrowLeft className={r.arrow} aria-hidden="true" />
        <div className={r.node} data-active={on(13.5)} data-hot="true"><ListVideo aria-hidden="true" /><strong>3 · The feed serves more</strong><span>Angrier, scarier clips hold attention</span></div>
      </div>
      <div className={r.bubble} data-active={on(18)}><CircleHelp aria-hidden="true" /><span><b>Filter bubble:</b> the loop keeps showing more of the same.</span></div>
    </div>}

    {scene === 3 && <div className={`${k.panel} ${r.task}`}>
      <h2>Rebalance Kabir’s feed</h2>
      <Meter value={solved ? 100 : meter} />
      <ul className={r.checks} aria-label="Goals">{checks.map(item => <li key={item.label} data-done={solved || item.done}>{solved || item.done ? <Check aria-hidden="true" /> : <span aria-hidden="true" />}{item.label}</li>)}</ul>
      <div className={r.taskGrid}>
        <div className={r.phone}>
          <div className={r.phoneBar}><Play aria-hidden="true" /><b>For you</b><span>{solved ? "Refreshed" : `${feed.length} rumour${feed.length === 1 ? "" : "s"}`}</span></div>
          {solved ? <ul className={r.rows}>{[...topicChoices, { title: "Fair is ON: gates open 5 pm", channel: "Cyberpur Fair · Official", icon: FerrisWheel, tone: "official", time: "" }].map(clip => <li key={clip.title} className={r.row}><Thumb clip={clip} /><span><strong>{clip.title}</strong><small>{clip.channel}</small></span></li>)}</ul>
            : <ul className={r.rows} aria-label="Kabir’s feed">
              {[...topics, ...follows].length > 0 && <li className={r.added}>{[...topics, ...follows].map(name => <span key={name}><Check aria-hidden="true" />{name.split(" · ")[0]}</span>)}</li>}
              {feed.map(i => <li key={i} className={r.row} data-rumour="true">
                <button className={r.watch} onClick={() => moreRumours(TRAP_WATCH)} data-trap="true" type="button"><Thumb clip={pool[i]} /><span><strong>{pool[i].title}</strong><small>{pool[i].channel} · tap to watch</small></span></button>
                <button className={r.nope} onClick={() => notInterested(i)} aria-label={`Not interested: ${pool[i].title}`} type="button"><EyeOff aria-hidden="true" /><span>Not interested</span></button>
              </li>)}
              {!feed.length && <li className={r.clear}><Check aria-hidden="true" />No rumours left in view</li>}
            </ul>}
        </div>
        <div className={r.controls}>
          <h3>Explore topics</h3>
          <div className={r.chips}>{topicChoices.map(clip => { const Icon = clip.icon; const picked = solved || topics.includes(clip.title); return <button key={clip.title} data-tone={clip.tone} aria-pressed={picked} disabled={solved} onClick={() => toggleTopic(clip.title)} type="button"><Icon aria-hidden="true" />{clip.title}</button>; })}</div>
          <h3>Follow a source</h3>
          <div className={r.sources}>{sources.map(source => { const Icon = source.icon; const followed = follows.includes(source.name); return <div key={source.name} className={r.source}>
            <span className={r.sourceIcon} data-tone={source.tone}><Icon aria-hidden="true" /></span>
            <span><strong>{source.name}</strong><small>{source.detail}</small></span>
            <button aria-pressed={followed} aria-label={`${followed ? "Following" : "Follow"} ${source.name}`} data-trap={!source.reliable || undefined} disabled={solved} onClick={() => follow(source.name, source.reliable)} type="button">{followed ? <><Check aria-hidden="true" />Following</> : "Follow"}</button>
          </div>; })}</div>
        </div>
      </div>
      <p className={k.hint} aria-live="polite">{solved ? "Feed refreshed: cricket, science, sketching and checked fair news." : hint || idle}</p>
      <div className={k.actions}><button className={k.primary} disabled={!ready || solved} onClick={markSolved} type="button"><RefreshCw />{solved ? "Feed refreshed" : "Refresh Kabir’s feed"}</button></div>
      <small>Pretend app and simplified meter. Real feeds use many more signals.</small>
    </div>}

    {scene === 4 && <div className={k.panel}>
      <h2>What the feed counts</h2>
      <div className={r.compare}>
        <div>
          <h3><Gauge aria-hidden="true" />Measures attention</h3>
          {["Watch time", "Replays", "Comments", "Shares"].map((item, i) => <div className={k.step} key={item} data-active={on(3.6 + i * .6)}><span><Check /></span>{item}</div>)}
        </div>
        <div data-side="miss">
          <h3><CircleHelp aria-hidden="true" />Mostly doesn’t check</h3>
          {["Is it true?", "Is it kind?", "How do you feel after?"].map((item, i) => <div className={k.step} key={item} data-active={on(14.5 + i)}><span><X /></span>{item}</div>)}
        </div>
      </div>
      <div className={r.takeaway} data-active={on(8)}><Flame aria-hidden="true" /><span>Shock and anger grab attention, so they can travel faster than calm facts.</span></div>
      <small>Simplified model. Every app ranks videos differently.</small>
    </div>}

    {scene === 5 && <div className={k.device}>
      <AppBar />
      <div className={`${k.deviceArt} ${r.fair}`}>
        <div className={k.badge}><BadgeCheck /> Cyberpur Fair · Official</div>
        <div className={k.success}><FerrisWheel /><strong>The fair is on!</strong><span>Gates open Saturday at 5 pm · See you there</span></div>
      </div>
      <div className={k.deviceFoot}>
        <Meter value={92} />
        <div className={r.mix}>{[...topicChoices, { title: "Fair news", channel: "", icon: BadgeCheck, tone: "official", time: "" }].map(clip => { const Icon = clip.icon; return <span key={clip.title} data-tone={clip.tone}><Icon aria-hidden="true" />{clip.title}</span>; })}</div>
      </div>
    </div>}
  </SceneSwap>;
}

const chapter: StoryChapter = {
  script,
  title: "Kabir’s rabbit-hole feed",
  icon: ListVideo,
  character: { asset: "emotional-avatar", name: "Kabir" },
  interactionScene: 3,
  beginLabel: "Practise with Kabir",
  waitingText: "Story paused. Get the meter into the green to see what happens next.",
  lockedHint: "Help Kabir rebalance his feed first.",
  World,
};
export default chapter;
