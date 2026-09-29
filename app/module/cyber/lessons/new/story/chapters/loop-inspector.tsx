"use client";

import { ArrowRight, BookOpen, Bot, Brush, CalendarDays, Check, CircleHelp, ClipboardList, Copy, Grid3x3, PartyPopper, Pencil, Play, Repeat, RotateCcw, ScanSearch, Sparkles, Trash2, TriangleAlert } from "lucide-react";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { SceneSwap } from "../StoryPlayer";
import type { StoryChapter, StoryWorldProps } from "../types";
import script from "./loop-inspector.json";
import k from "../story-player.module.css";
import r from "./loop-inspector.module.css";

const TILES = 5;
type Cmd = "MOVE RIGHT" | "SWEEP";
const bodies: { id: string; label: string; cmds: Cmd[] }[] = [
  { id: "move", label: "Move right", cmds: ["MOVE RIGHT"] },
  { id: "sweep", label: "Sweep", cmds: ["SWEEP"] },
  { id: "both", label: "Move right, then sweep", cmds: ["MOVE RIGHT", "SWEEP"] },
];
const counts = [4, 5, 6];

/** Where Dusty is (0 start, 1–5 tiles, 6 the bin) and which tiles are swept. */
type Track = { pos: number; clean: boolean[]; bump: boolean };
type Frame = Track & { round: number; line: number };
const start: Track = { pos: 0, clean: Array(TILES).fill(false), bump: false };
const cleanRow: Track = { pos: TILES, clean: Array(TILES).fill(true), bump: false };
const bumped: Track = { pos: TILES + 1, clean: Array(TILES).fill(true), bump: true };

/** Runs REPEAT count TIMES { cmds } one command at a time and returns every step for the track to replay. */
function simulate(cmds: Cmd[], count: number): Frame[] {
  const frames: Frame[] = []; let t: Track = start;
  for (let round = 1; round <= count && !t.bump; round++) cmds.forEach((cmd, line) => {
    if (t.bump) return;
    if (cmd === "MOVE RIGHT") t = t.pos === TILES ? { ...t, pos: TILES + 1, bump: true } : { ...t, pos: t.pos + 1 };
    else { const at = t.pos; t = { ...t, clean: t.clean.map((c, i) => c || i === at - 1) }; }
    frames.push({ ...t, round, line });
  });
  return frames;
}

function why(bodyId: string, count: number, end: Track) {
  if (bodyId === "sweep") return `Dusty swept the start spot ${count} times and never moved. The loop needs both steps: move right, then sweep.`;
  if (bodyId === "move") return `Dusty rolled over the dust without sweeping${end.bump ? ", then bumped the bin" : ""}. The loop needs both steps: move right, then sweep.`;
  if (end.bump) return "Bump! Six was the old list’s count. The sixth repeat moves Dusty past tile 5 into the bin. One repeat for each tile.";
  if (end.clean.includes(false)) return `Dusty stopped on tile ${end.pos}, so tile 5 is still dusty. Each repeat cleans one tile. Count every tile.`;
  return "";
}

function Row({ track, sweeping, label }: { track: Track; sweeping?: number; label?: string }) {
  const where = track.bump ? "bumped into the bin" : track.pos === 0 ? "at the start" : `on tile ${track.pos}`;
  return <div className={r.track} role="img" aria-label={label ?? `Dusty is ${where}. ${track.clean.filter(Boolean).length} of ${TILES} tiles clean.`}>
    <span className={r.cell} data-kind="start"><small>Start</small></span>
    {track.clean.map((clean, i) => <span key={i} className={r.cell} data-kind="tile" data-dusty={!clean}><small>{i + 1}</small>{clean && <Sparkles className={k.fitIn} aria-hidden="true" />}</span>)}
    <span className={r.cell} data-kind="bin" data-hit={track.bump}><Trash2 aria-hidden="true" /></span>
    <span className={r.robot} data-bump={track.bump} style={{ "--pos": track.pos } as CSSProperties}><span key={sweeping} className={sweeping ? r.sweep : undefined}><Bot aria-hidden="true" /></span></span>
  </div>;
}

function World({ scene, playing, elapsed, solved, markSolved, hint, setHint, reduced }: StoryWorldProps) {
  const [bodyId, setBodyId] = useState("");
  const [count, setCount] = useState(0);
  const [frame, setFrame] = useState<{ f: Frame; n: number } | null>(null);
  const [running, setRunning] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const body = bodies.find(item => item.id === (solved ? "both" : bodyId));
  const shownCount = solved ? TILES : count;
  const track: Track = solved ? cleanRow : frame?.f ?? start;
  const at = (s: number) => !playing || elapsed > s;
  const pairs = playing ? Math.min(6, Math.max(2, 2 + Math.floor((elapsed - 7) / 1.8))) : 6;

  function pick(nextBody: string, nextCount: number) {
    if (solved || running) return;
    setBodyId(nextBody); setCount(nextCount); setFrame(null); setHint("");
  }
  function run() {
    if (solved || running || !body || !count) return;
    const frames = simulate(body.cmds, count);
    const end = frames[frames.length - 1];
    const finish = () => {
      const message = why(body.id, count, end);
      if (message) { setRunning(false); setHint(message, false); }
      else timer.current = window.setTimeout(() => { setRunning(false); markSolved(); }, 700);
    };
    setRunning(true); setHint("");
    if (reduced) { setFrame({ f: end, n: frames.length }); finish(); return; }
    let n = 0;
    const tick = () => { setFrame({ f: frames[n], n: n + 1 }); n++; timer.current = window.setTimeout(n < frames.length ? tick : finish, 260); };
    tick();
  }
  const sweeping = frame && body?.cmds[frame.f.line] === "SWEEP" && running ? frame.n : undefined;
  const status = solved ? "Row clean! Dusty stopped right before the bin." : running ? `Running round ${frame?.f.round ?? 1} of ${count}…` : "Choose what goes inside the loop, then how many times.";

  return <SceneSwap scene={scene} reduced={reduced}>
    {(scene === 0 || scene === 1 || scene === 5) && <div className={k.device} data-dim={scene === 1}>
      <div className={k.deviceBar}><span><Bot size={16} /> ROBOT LAB</span><span>Cyberpur School · Class 5</span></div>
      <div className={`${k.deviceArt} ${r.lab}`}>
        {scene === 0 && <>
          <div className={k.badge}><CalendarDays /> Open Day: Friday</div>
          <div className={r.codeWin}>
            <strong><ClipboardList aria-hidden="true" /> dusty-clean</strong>
            {Array.from({ length: pairs }, (_, i) => <span key={i} className={k.fitIn}><b>{i * 2 + 1}–{i * 2 + 2}</b>MOVE RIGHT, SWEEP</span>)}
          </div>
        </>}
        {scene === 1 && <div className={k.alert}><TriangleAlert /><strong>Bump!</strong><span>Dusty rolled one tile too far.</span><Row track={bumped} label="Every tile is clean, but Dusty rolled past tile 5 and bumped the bin." /></div>}
        {scene === 5 && <>
          <div className={k.success}><Sparkles /><strong>Row sparkling!</strong><span>Open Day demo · every tile clean · no bumps</span></div>
          <div className={r.pocket}><span>Fits on one card</span><code>REPEAT 5 TIMES</code><code>  MOVE RIGHT</code><code>  SWEEP</code></div>
        </>}
      </div>
      <div className={k.deviceFoot}>{scene === 0 ? <><ClipboardList /><span>Program: <b>{pairs * 2} lines</b></span><small>The same two lines, copied again and again</small></> : scene === 1 ? <><CircleHelp /><span>12 lines to check. Which pair is extra?</span></> : <><PartyPopper /><span>The parents clap. Tara beams!</span><small>Pretend robot · example program</small></>}</div>
    </div>}

    {scene === 2 && <div className={k.panel}>
      <div className={r.teacher}><span className={r.avatar} aria-hidden="true">MR</span><span><strong>Mr Rao</strong> · Lab teacher</span><p>“Copy slips happen to every coder. Let’s count.”</p></div>
      <h2>Find the repeat. Count it once.</h2>
      <div className={k.step} data-active={at(6)}><span><Copy /></span>Count the copies: <b>6 pairs</b></div>
      <div className={k.step} data-active={at(7.8)}><span><Grid3x3 /></span>Count the tiles: only <b>5</b></div>
      <div className={k.step} data-active={at(10.5)}><span><Repeat /></span>Write the steps once, inside a loop</div>
      <div className={r.shrink} data-active={at(15)}><ClipboardList /><div><strong>Old list</strong><span>12 lines</span></div><ArrowRight /><Repeat /><div><strong>Loop</strong><span>3 lines</span></div></div>
    </div>}

    {scene === 3 && <div className={`${k.panel} ${r.task}`}>
      <h2>Build Tara’s loop</h2>
      <div className={r.builder}>
        <div className={r.oldList} role="img" aria-label="Old list: six pairs of move right, sweep. The sixth pair is extra.">
          <strong>Old list · 12 lines</strong>
          {Array.from({ length: 6 }, (_, i) => <span key={i} data-extra={i === 5}><b>{i + 1}</b><ArrowRight aria-hidden="true" /><Brush aria-hidden="true" />{i === 5 && <em>extra</em>}</span>)}
        </div>
        <div className={r.loop}>
          <div className={r.loopHead}><Repeat aria-hidden="true" />REPEAT <b>{shownCount || "?"}</b> TIMES</div>
          <div className={r.loopBody}>{body ? body.cmds.map((cmd, i) => <code key={cmd} data-now={running && frame?.f.line === i}>{cmd}</code>) : <span>Steps go here</span>}</div>
          {running && frame && <span className={r.round}>Round {frame.f.round} of {count}</span>}
        </div>
      </div>
      <div className={r.pickRow} role="group" aria-label="Steps inside the loop"><span>Inside</span>{bodies.map(item => <button key={item.id} aria-pressed={body?.id === item.id} disabled={solved || running} onClick={() => pick(item.id, count)} type="button">{item.id !== "sweep" && <ArrowRight aria-hidden="true" />}{item.id !== "move" && <Brush aria-hidden="true" />}{item.label}</button>)}</div>
      <div className={r.pickRow} role="group" aria-label="How many times"><span>Times</span>{counts.map(n => <button key={n} className={r.count} aria-label={`Repeat ${n} times`} aria-pressed={shownCount === n} disabled={solved || running} onClick={() => pick(bodyId, n)} type="button">{n}</button>)}</div>
      <Row track={track} sweeping={sweeping} />
      <p className={k.hint} aria-live="polite">{hint || status}</p>
      <div className={k.actions}>
        <button onClick={() => pick("", 0)} disabled={solved || running || (!bodyId && !count)} type="button"><RotateCcw />Reset</button>
        <button className={k.primary} onClick={run} disabled={solved || running || !body || !count} type="button">{solved ? <><Check />Row cleaned</> : <><Play />Run loop</>}</button>
      </div>
      <small>Pretend robot and example program.</small>
    </div>}

    {scene === 4 && <div className={k.panel}>
      <h2>Say it once. Count it right.</h2>
      <div className={r.card}><span>Dusty’s new program · 3 lines</span><code>REPEAT 5 TIMES</code><code>  MOVE RIGHT</code><code>  SWEEP</code></div>
      <div className={k.step} data-active={at(8.3)}><span><BookOpen /></span><div className={r.why}><strong>Easier to read</strong><small>3 lines instead of a long list</small></div></div>
      <div className={k.step} data-active={at(9.4)}><span><ScanSearch /></span><div className={r.why}><strong>Easier to check</strong><small>One count to look at: 5 tiles, 5 repeats</small></div></div>
      <div className={k.step} data-active={at(11)}><span><Pencil /></span><div className={r.why}><strong>Easier to change</strong><small>Row grows to 8 tiles? Change 5 to 8.</small></div></div>
      <small>Pretend robot and example program.</small>
    </div>}
  </SceneSwap>;
}

const chapter: StoryChapter = {
  script,
  title: "Tara’s robot cleaner",
  icon: Bot,
  character: { asset: "girl-expressions", name: "Tara" },
  interactionScene: 3,
  beginLabel: "Practise with Tara",
  waitingText: "Story paused. Build Tara’s loop to see what happens next.",
  lockedHint: "Help Tara build her loop first.",
  World,
};
export default chapter;
