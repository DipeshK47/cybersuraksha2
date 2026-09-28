"use client";

import { ArrowRight, Check, CircleHelp, Eye, Image as ImageIcon, Music, PartyPopper, Repeat, RotateCcw, Route, TramFront, TriangleAlert, Users } from "lucide-react";
import { useState } from "react";
import { SceneSwap } from "../StoryPlayer";
import type { StoryChapter, StoryWorldProps } from "../types";
import script from "./pattern-detective.json";
import k from "../story-player.module.css";
import r from "./pattern-detective.module.css";

type Colour = "orange" | "blue" | "green";
type Form = "circle" | "square" | "triangle";
type Tile = { c: Colour; s: Form };

const fills: Record<Colour, string> = { orange: "#ec8526", blue: "#2c6cbb", green: "#3a9554" };
const group: Tile[] = [{ c: "orange", s: "circle" }, { c: "blue", s: "square" }, { c: "green", s: "triangle" }];
const full = Array.from({ length: 9 }, (_, i) => group[i % 3]);
const gaps = [4, 8];
const withGaps = full.map((tile, i) => gaps.includes(i) ? null : tile);
// Two traps share a colour with an answer but not its shape: the chapter's tempting mistake.
const tray: Tile[] = [{ c: "blue", s: "triangle" }, { c: "green", s: "triangle" }, { c: "orange", s: "square" }, { c: "blue", s: "square" }, { c: "green", s: "circle" }, { c: "orange", s: "circle" }];
const name = (t: Tile) => `${t.c[0].toUpperCase()}${t.c.slice(1)} ${t.s}`;
const same = (a: Tile | null, b: Tile) => a?.c === b.c && a?.s === b.s;
const isTrap = (t: Tile) => gaps.some(g => full[g].c === t.c && full[g].s !== t.s);

// Seconds into each scene's narration when a piece lights up (from the generated cue times).
const TRACK_REVEAL = 9.6;
const GROUP_AT = [4.6, 7.4, 8.2];
const FIND_AT = [0, 9.4, 11.4];
const TRICK_AT = [9, 10.3, 11.5, 12.8];

function Shape({ t }: { t: Tile }) {
  const fill = fills[t.c];
  return <svg viewBox="0 0 24 24" aria-hidden="true">
    {t.s === "circle" ? <circle cx="12" cy="12" r="8.5" fill={fill} /> : t.s === "square" ? <rect x="4" y="4" width="16" height="16" rx="2.5" fill={fill} /> : <path d="M12 3.5 20.8 19.5H3.2Z" fill={fill} />}
  </svg>;
}

function Track({ tiles, show = 9, fixed = false }: { tiles: (Tile | null)[]; show?: number; fixed?: boolean }) {
  return <div className={r.track} role="img" aria-label={`Track: ${tiles.map(t => t ? name(t).toLowerCase() : "missing tile").join(", ")}`}>
    {tiles.map((t, i) => t
      ? <span key={i} data-on={i < show} data-fixed={fixed && gaps.includes(i)}><Shape t={t} /></span>
      : <span key={i} className={r.gap}>?</span>)}
  </div>;
}

function World({ scene, playing, elapsed, solved, markSolved, hint, setHint, reduced }: StoryWorldProps) {
  const [placed, setPlaced] = useState<(Tile | null)[]>([null, null]);
  const [wrongGap, setWrongGap] = useState(-1);
  const at = (seconds: number) => !playing || elapsed > seconds;
  const filled = solved ? gaps.map(g => full[g]) : placed;
  const full2 = !placed.includes(null);

  function place(t: Tile) {
    if (solved) return;
    const slot = placed.indexOf(null);
    if (slot < 0) { setHint("Both gaps are full. Tap a gap to empty it, or roll the trolley."); return; }
    setPlaced(value => value.map((x, i) => i === slot ? t : x)); setWrongGap(-1); setHint("");
  }
  function clear(slot: number) {
    if (solved) return;
    setPlaced(value => value.map((x, i) => i === slot ? null : x)); setHint("");
  }
  function roll() {
    if (solved || !full2) return;
    const miss = gaps.findIndex((g, i) => !same(placed[i], full[g]));
    if (miss < 0) { setHint(""); markSolved(); return; }
    const tile = placed[miss] as Tile, want = full[gaps[miss]];
    setHint(`Gap ${miss + 1}: ${tile.c === want.c
      ? "right colour, wrong shape! In this pattern, each colour always comes with the same shape. Check the shape too."
      : tile.s === want.s ? "right shape, wrong colour! The colours repeat in the same order as the shapes."
      : "that tile breaks the group. Start at the first tile and say the group as you go."}`);
    setWrongGap(gaps[miss]); setPlaced([null, null]);
  }

  return <SceneSwap scene={scene} reduced={reduced}>
    {(scene === 0 || scene === 1 || scene === 5) && <div className={k.device} data-dim={scene === 1}>
      <div className={k.deviceBar}><span><TramFront size={16} /> CYBERPUR TROLLEY</span><span>{scene === 0 ? "Line 3 · to the fair" : scene === 1 ? "Stopped" : "Fair Station"}</span></div>
      <div className={`${k.deviceArt} ${r.station}`}>
        {scene === 0 && <div className={k.badge}><Route /> Next stop: Fair Station</div>}
        {scene === 1 && <div className={`${k.alert} ${r.aboveTrack}`}><TriangleAlert /><strong>Trolley stopped</strong><span>Two track tiles are missing.</span></div>}
        {scene === 5 && <div className={`${k.success} ${r.aboveTrack}`}><PartyPopper /><strong>Fair Station!</strong><span>Track complete · right on time</span></div>}
        <div className={r.trackScreen} data-state={scene === 1 ? "gaps" : scene === 5 ? "done" : "ahead"}>
          <span>{scene === 1 ? <><CircleHelp /> Track ahead · 2 gaps</> : scene === 5 ? <><Check /> Track complete</> : <><Route /> Track ahead</>}</span>
          <Track tiles={scene === 1 ? withGaps : full} show={scene === 0 && playing ? Math.floor((elapsed - TRACK_REVEAL) / .3) + 1 : 9} fixed={scene === 5} />
        </div>
      </div>
      <div className={k.deviceFoot}>{scene === 0
        ? <><Users /><span>Riding with Nani</span><small>Pretend trolley · Cyberpur</small></>
        : scene === 1 ? <><CircleHelp /><span>Stay in your seat. The trolley screen will help.</span></>
        : <><Check /><span>Rohan found the group.</span><small>Pattern: circle · square · triangle</small></>}</div>
    </div>}

    {scene === 2 && <div className={k.panel}>
      <div className={r.nani}><span aria-hidden="true">N</span><div><small>Nani</small><p>“Read the tiles from the start.”</p></div></div>
      <h2>Find the group that repeats.</h2>
      <Track tiles={withGaps} />
      <div className={r.groups} aria-hidden="true">{["Group 1", "Same again", "Same again…"].map((label, i) => <span key={label} data-on={at(GROUP_AT[i])}>{label}</span>)}</div>
      {["Read the tiles from the start", "Find the group that repeats", "Say it out loud as you go"].map((step, i) => <div className={k.step} key={step} data-active={at(FIND_AT[i])}><span><Check /></span>{step}</div>)}
    </div>}

    {scene === 3 && <div className={k.panel}>
      <div className={r.screenTag}><TramFront aria-hidden="true" /> Trolley screen · Track fixer</div>
      <h2>Fix the trolley track</h2><p>Tap a tile to fill the next gap. Tap a gap to empty it.</p>
      <div className={`${r.track} ${r.taskTrack}`} role="group" aria-label="Trolley track with two gaps">
        {full.map((t, i) => {
          const slot = gaps.indexOf(i);
          if (slot < 0) return <span key={i} role="img" aria-label={name(t)}><Shape t={t} /></span>;
          const tile = filled[slot];
          return <button key={i} type="button" className={tile ? undefined : r.gap} data-placed={Boolean(tile)} data-wrong={wrongGap === i} disabled={solved || !tile} onClick={() => clear(slot)} aria-label={tile ? `Gap ${slot + 1}: ${name(tile)}. Tap to remove.` : `Gap ${slot + 1}: empty`}>{tile ? <Shape t={tile} /> : "?"}</button>;
        })}
      </div>
      <div className={`${k.bank} ${r.tray}`} role="group" aria-label="Tiles to choose from">
        {tray.map(t => <button key={name(t)} type="button" onClick={() => place(t)} disabled={solved} data-trap={isTrap(t)}><Shape t={t} />{name(t)}</button>)}
      </div>
      <p className={k.hint} aria-live="polite">{hint || (solved ? "Track fixed! Blue square, green triangle: the group repeats." : full2 ? "Both gaps filled. Roll the trolley to test the track!" : "Start at the first tile. Say the group as you go.")}</p>
      <div className={k.actions}>
        <button type="button" onClick={() => { setPlaced([null, null]); setWrongGap(-1); setHint(""); }} disabled={solved || placed.every(x => !x)}><RotateCcw />Start over</button>
        <button type="button" className={k.primary} disabled={solved || !full2} onClick={roll}>{solved ? "Trolley rolling" : "Roll the trolley"} <ArrowRight /></button>
      </div>
      <small>Pretend track screen. Colour and shape both count.</small>
    </div>}

    {scene === 4 && <div className={k.panel}>
      <h2>A pattern detective’s trick</h2>
      <p><b>Pattern:</b> a group that repeats, again and again.</p>
      {[{ Icon: Eye, text: "Look from the start" }, { Icon: Repeat, text: "Find the group that repeats" }, { Icon: ArrowRight, text: "Continue it to predict what comes next" }].map(({ Icon, text }, i) => <div className={k.step} key={text} data-active={at(TRICK_AT[i])}><span><Icon /></span>{text}</div>)}
      <div className={r.everywhere} data-on={at(TRICK_AT[3])}>
        <small>Computers find patterns too</small>
        <div><Music aria-hidden="true" /><span><strong>Songs</strong>clap · clap · stomp</span></div>
        <div><ImageIcon aria-hidden="true" /><span><strong>Pictures</strong>stripes, tiles, dots</span></div>
      </div>
    </div>}
  </SceneSwap>;
}

const chapter: StoryChapter = {
  script,
  title: "Rohan and the missing tiles",
  icon: TramFront,
  character: { asset: "boy-emotions", name: "Rohan" },
  interactionScene: 3,
  beginLabel: "Practise with Rohan",
  waitingText: "Story paused. Fix the track to see what happens next.",
  lockedHint: "Help Rohan fix the missing tiles first.",
  World,
};
export default chapter;
