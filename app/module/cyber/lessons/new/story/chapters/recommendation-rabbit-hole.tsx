"use client";

import { ArrowRight, BadgeCheck, BrainCircuit, ChefHat, Coffee, EyeOff, FlaskConical, Music, Newspaper, Pause, Play, Repeat, Search, Timer, TriangleAlert, Trophy, Tv, UserPlus } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import { SceneSwap } from "../StoryPlayer";
import type { StoryChapter, StoryWorldProps } from "../types";
import script from "./recommendation-rabbit-hole.json";
import k from "../story-player.module.css";
import r from "./recommendation-rabbit-hole.module.css";

type Video = { title: string; channel: string; topic: string; Icon: LucideIcon; rumour?: boolean };
const mix: Video[] = [
  { title: "Make a lemon battery", channel: "How It Works", topic: "science", Icon: FlaskConical },
  { title: "Last-over thriller: all the sixes", channel: "Cricket Daily", topic: "cricket", Icon: Trophy },
  { title: "Five-minute poha", channel: "Home Kitchen", topic: "cooking", Icon: ChefHat },
  { title: "Tabla meets beatbox", channel: "Sound Lab", topic: "music", Icon: Music },
];
const rumours: Video[] = [
  { title: "FAIR CANCELLED?! Full story", channel: "Viral Now", topic: "rumour", Icon: TriangleAlert, rumour: true },
  { title: "SHOCKING truth about Cyberpur", channel: "Truth Bombs", topic: "rumour", Icon: TriangleAlert, rumour: true },
  { title: "You WON’T believe this…", channel: "Buzz Feed Plus", topic: "rumour", Icon: TriangleAlert, rumour: true },
  { title: "They don’t want you to know", channel: "Real Talk 24", topic: "rumour", Icon: TriangleAlert, rumour: true },
];
const official: Video = { title: "The fair is ON this weekend", channel: "Cyberpur News · official", topic: "news", Icon: Newspaper };
const searches = [mix[0], mix[1], mix[3], mix[2]];
const GOAL = 80;

function Tile({ video, small }: { video: Video; small?: boolean }) {
  const { title, channel, topic, Icon, rumour } = video;
  return <div className={r.tile} data-topic={topic} data-small={small ?? false}>
    <span className={r.thumb}><Icon aria-hidden="true" />{rumour && <b>!!</b>}<small><Play aria-hidden="true" /></small></span>
    <div><strong>{title}</strong><span>{channel}{topic === "news" && <BadgeCheck aria-hidden="true" />}</span></div>
  </div>;
}
function Meter({ value }: { value: number }) {
  const level = value >= 70 ? "good" : value >= 40 ? "mid" : "low";
  return <div className={r.meter} data-level={level} role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value} aria-label="Topic variety">
    <span>Topic variety</span><span className={r.track}><span style={{ transform: `scaleX(${value / 100})` }} /></span><b>{value}%</b>
  </div>;
}

function World({ scene, playing, elapsed, solved, markSolved, hint, setHint, reduced }: StoryWorldProps) {
  const [hidden, setHidden] = useState<string[]>([]);
  const [found, setFound] = useState<string[]>([]);
  const [followed, setFollowed] = useState(false);
  const [watched, setWatched] = useState(0);
  const [passing, setPassing] = useState(false);
  const done = solved || passing;
  const score = solved ? 92 : Math.max(5, Math.min(100, 20 + hidden.length * 12 + found.length * 8 + (followed ? 12 : 0) - Math.min(watched, 3) * 8));
  // Reveal an item once narration reaches that fraction of the scene (everything shows while paused).
  const cue = (at: number) => !playing || elapsed > script.scenes[scene].duration * at;
  const show = (at: number) => ({ "data-on": cue(at), "aria-hidden": !cue(at) });

  function after(next: { hidden?: string[]; found?: string[]; followed?: boolean }, message: string) {
    const h = next.hidden ?? hidden, f = next.found ?? found, fo = next.followed ?? followed;
    const value = 20 + h.length * 12 + f.length * 8 + (fo ? 12 : 0) - Math.min(watched, 3) * 8;
    if (value >= GOAL) { setHint("Topic variety is back above 80%. The feed now reflects what Meera really enjoys."); setPassing(true); window.setTimeout(markSolved, reduced ? 0 : 700); return; }
    setHint(message);
  }
  function watch(video: Video) {
    if (done) return;
    setWatched(value => value + 1);
    setHint(`Watching “${video.title}” is one more signal that this keeps Meera watching, so the algorithm sends even more. Variety drops.`);
  }
  function notInterested(video: Video) {
    if (done || hidden.includes(video.title)) return;
    const next = [...hidden, video.title]; setHidden(next);
    after({ hidden: next }, "Not interested tells the algorithm to show less like this. Variety goes up.");
  }
  function search(video: Video) {
    if (done || found.includes(video.topic)) return;
    const next = [...found, video.topic]; setFound(next);
    after({ found: next }, `Searching for ${video.topic} adds a new signal: Meera wants variety.`);
  }
  function follow() {
    if (done || followed) return;
    setFollowed(true);
    after({ followed: true }, "Following a reliable source brings checked news into the feed.");
  }

  const feed: Video[] = solved ? [official, ...mix] : [...(followed ? [official] : []), ...searches.filter(v => found.includes(v.topic)), ...rumours.filter(v => !hidden.includes(v.title))];

  return <SceneSwap scene={scene} reduced={reduced}>
    {(scene === 0 || scene === 1 || scene === 4 || scene === 5) && <div className={k.device}>
      <div className={k.deviceBar}><span><Tv size={16} /> VIDSTREAM</span><span>Meera’s feed · pretend app</span></div>
      <div className={`${k.deviceArt} ${r.feed}`} data-bad={scene === 1}>
        <div className={r.grid}>
          {(scene === 1 ? rumours : scene === 0 ? mix : [official, ...mix.slice(0, 3)]).map((video, i) => <div key={video.title} {...show(scene === 1 ? .3 + i * .1 : .04 + i * .06)} className={r.reveal}><Tile video={video} /></div>)}
        </div>
        <Meter value={scene === 1 ? (cue(.62) ? 18 : 46) : scene === 0 ? 86 : 90} />
        {scene === 1 && <span className={r.autoplay} {...show(.8)}><Timer aria-hidden="true" />Autoplay: next in 3…</span>}
        {scene === 5 && <div className={r.upload}><FlaskConical aria-hidden="true" /><div><strong>Meera’s upload: “My lake water tester”</strong><span>Viewer challenge · 212 views</span></div></div>}
      </div>
      <div className={k.deviceFoot}>{scene === 0 ? <><Timer /><span>20 minutes, then bed</span></>
        : scene === 1 ? <><TriangleAlert /><span>More of the same, and angrier each time</span></>
          : <><span className={r.chip}><Pause aria-hidden="true" />Autoplay off</span><span className={r.chip}><Coffee aria-hidden="true" />Break reminder · 20 min</span><span className={r.chip}><BadgeCheck aria-hidden="true" />Following reliable news</span></>}</div>
    </div>}

    {scene === 2 && <div className={k.panel}>
      <h2>How the feed learned</h2>
      <div className={r.flow}>
        <div className={r.col} {...show(.1)}><small>Meera’s signals</small><span><Repeat aria-hidden="true" />Replayed 6 times</span><span><Pause aria-hidden="true" />Paused 14 times</span><span><Play aria-hidden="true" />Watched to the end</span></div>
        <ArrowRight className={r.arrow} aria-hidden="true" />
        <div className={r.col} data-kind="algo" {...show(.36)}><small>The algorithm predicts</small><span><BrainCircuit aria-hidden="true" />“This keeps her watching”</span></div>
        <ArrowRight className={r.arrow} aria-hidden="true" />
        <div className={r.col} data-kind="feed" {...show(.62)}><small>So the feed shows</small><span><TriangleAlert aria-hidden="true" />More rumours, angrier each time</span></div>
      </div>
      <div className={r.terms}>
        <div {...show(.5)}><strong>Engagement</strong><span>How much a video keeps people watching, clicking and replaying.</span></div>
        <div {...show(.86)}><strong>Filter bubble</strong><span>When a feed shows less and less variety, only more of the same.</span></div>
      </div>
    </div>}

    {scene === 3 && <div className={`${k.panel} ${r.task}`}>
      <h2>Steer Meera’s feed</h2>
      <Meter value={score} />
      <div className={r.list}>{feed.map(video => <div className={r.row} key={video.title}>
        <Tile video={video} small />
        {video.rumour && <div className={r.rowActions}>
          <button type="button" data-trap="true" aria-label={`Watch: ${video.title}`} onClick={() => watch(video)} disabled={done}><Play />Watch</button>
          <button type="button" aria-label={`Not interested: ${video.title}`} onClick={() => notInterested(video)} disabled={done}><EyeOff />Not interested</button>
        </div>}
      </div>)}</div>
      <div className={r.tools}>
        <div className={r.searches}><small><Search aria-hidden="true" />Search for</small>{searches.map(v => <button key={v.topic} type="button" aria-pressed={solved || found.includes(v.topic)} disabled={done || found.includes(v.topic)} onClick={() => search(v)}><v.Icon aria-hidden="true" />{v.topic}</button>)}</div>
        <button type="button" className={r.follow} aria-pressed={solved || followed} disabled={done || followed} onClick={follow}><UserPlus />{followed || solved ? "Following Cyberpur News" : "Follow Cyberpur News · official"}</button>
      </div>
      <p className={k.hint} aria-live="polite">{hint || (done ? "Topic variety is back above 80%. The feed now reflects what Meera really enjoys." : `Goal: topic variety of ${GOAL}% or more.`)}</p>
      <small>Pretend app and channels. The meter is a simple model, not a real app’s formula.</small>
    </div>}
  </SceneSwap>;
}

const chapter: StoryChapter = {
  script,
  title: "Meera’s runaway feed",
  icon: Tv,
  character: { asset: "emotional-avatar", name: "Meera" },
  interactionScene: 3,
  beginLabel: "Practise with Meera",
  waitingText: "Story paused. Raise the topic variety meter to 80% to continue.",
  lockedHint: "Help Meera steer her feed back to variety first.",
  World,
};
export default chapter;
