"use client";

import { ArrowDown, ArrowRight, Check, Clock, Droplets, FlaskConical, Hand, Lightbulb, RotateCcw, ScanLine, Trophy, UserRound, Users } from "lucide-react";
import { useState } from "react";
import { SceneSwap } from "../StoryPlayer";
import type { StoryChapter, StoryWorldProps } from "../types";
import script from "./flowchart-architect.json";
import k from "../story-player.module.css";
import r from "./flowchart-architect.module.css";

type BlockId = "ask" | "soap" | "wait" | "end";
type Shape = "oval" | "rect" | "diamond";
const blocks: { id: BlockId; label: string; shape: Shape }[] = [
  { id: "soap", label: "Give soap", shape: "rect" },
  { id: "ask", label: "Hands under sensor?", shape: "diamond" },
  { id: "wait", label: "Wait 3 seconds", shape: "rect" },
  { id: "end", label: "End", shape: "oval" },
];
const answer: BlockId[] = ["ask", "soap", "end"];
const byId = (id: BlockId) => blocks.find(b => b.id === id)!;
// Why a block doesn't belong in a slot (slot 0 = first box, 1 = Yes path, 2 = last box).
const why: Record<number, Partial<Record<BlockId, string>>> = {
  0: { soap: "Soap before the question is the old mistake: an empty sink still gets soap. Ask first: are hands there?", wait: "A timer is what the old plan used, so it still sprays every few seconds. The station needs a question first.", end: "The station can’t finish before it has checked for hands." },
  1: { wait: "Hands are already there on the Yes path. Give them soap instead of making them wait.", end: "If hands are there, they need soap before the station finishes." },
  2: { wait: "The soap is given, so this wash is done. Finish the chart with the End oval." },
};
type Path = "yes" | "no" | "both" | null;

function Node({ shape, label, lit, empty }: { shape: Shape | "slot"; label: string; lit?: boolean; empty?: boolean }) {
  return <span className={r.node} data-shape={shape} data-lit={lit ?? false} data-empty={empty ?? false}><span>{label}</span></span>;
}
function Down({ lit, label }: { lit?: boolean; label?: string }) {
  return <span className={r.down} data-lit={lit ?? false}><ArrowDown aria-hidden="true" />{label && <em>{label}</em>}</span>;
}
/** The station's new flowchart: Start → [decision] → Yes: [action] → [end]; No loops back to the question. */
function Chart({ filled, path }: { filled: (BlockId | null)[]; path: Path }) {
  const yes = path === "yes" || path === "both";
  const no = path === "no" || path === "both";
  const slot = (i: number, lit: boolean) => { const id = filled[i]; return id ? <Node shape={byId(id).shape} label={byId(id).label} lit={lit} /> : <Node shape="slot" label={`Box ${i + 1}`} empty />; };
  return <div className={r.chart} role="img" aria-label={`Flowchart: Start, then ${filled.map((id, i) => id ? byId(id).label : `empty box ${i + 1}`).join(", then ")}.`}>
    <Node shape="oval" label="Start" lit={path !== null} />
    <Down lit={path !== null} />
    {slot(0, path !== null)}
    <Down lit={yes} label="Yes" />
    {slot(1, yes)}
    <Down lit={yes} />
    {slot(2, yes)}
    <span className={r.noPath} data-lit={no} data-ready={filled[0] === "ask"}><em>No</em><span>Wait 1 second, ask again</span><RotateCcw aria-hidden="true" /></span>
  </div>;
}

function World({ scene, playing, elapsed, solved, markSolved, hint, setHint, reduced }: StoryWorldProps) {
  const [filled, setFilled] = useState<BlockId[]>([]);
  const [tested, setTested] = useState({ yes: false, no: false });
  const [path, setPath] = useState<Path>(null);
  const done = solved || (tested.yes && tested.no);
  const chart: (BlockId | null)[] = solved ? answer : [0, 1, 2].map(i => filled[i] ?? null);
  const complete = solved || filled.length === 3;
  // Reveal an item once narration reaches that fraction of the scene (everything shows while paused).
  const cue = (at: number) => !playing || elapsed > script.scenes[scene].duration * at;
  const show = (at: number) => ({ "data-on": cue(at), "aria-hidden": !cue(at) });
  const squirts = playing ? 1 + Math.floor(elapsed / 2.5) : 7;

  function place(id: BlockId) {
    if (done || complete || filled.includes(id)) return;
    const slot = filled.length;
    if (answer[slot] !== id) { setHint(why[slot][id] ?? "That block doesn’t fit here yet."); return; }
    setFilled(value => [...value, id]); setHint(slot === 2 ? "The chart is complete. Now test both paths." : "");
  }
  function test(which: "yes" | "no") {
    if (done || !complete) return;
    const next = { ...tested, [which]: true };
    setTested(next); setPath(which);
    if (next.yes && next.no) { setPath("both"); setHint("Both paths tested. The station asks first, then acts."); window.setTimeout(markSolved, reduced ? 0 : 700); return; }
    setHint(which === "yes" ? "Hands there → Yes → Give soap → End. Soap only for hands! Now test the empty sink." : "Empty sink → No → wait, ask again. No soap wasted! Now test with hands.");
  }

  return <SceneSwap scene={scene} reduced={reduced}>
    {(scene === 0 || scene === 1 || scene === 5) && <div className={k.device} data-dim={scene === 1}>
      <div className={k.deviceBar}><span><FlaskConical size={16} /> SCIENCE FAIR</span><span>Stand 12 · Tara’s hand-wash station</span></div>
      <div className={`${k.deviceArt} ${r.lab}`}>
        {scene === 0 && <><div className={k.badge}><Clock /> Judges at 10:00 am</div><span className={r.sensor} {...show(.4)}><ScanLine aria-hidden="true" />Sensor ready</span></>}
        {scene === 1 && <div className={r.meter}>
          <div><Droplets aria-hidden="true" /><strong>{squirts}</strong><span>soap squirts</span></div>
          <div><Hand aria-hidden="true" /><strong>0</strong><span>hands seen</span></div>
          <p className={r.judges} {...show(.72)}><Users aria-hidden="true" />Judges walking over</p>
        </div>}
        {scene === 5 && <div className={k.success}><Trophy /><strong>Dry sink. Happy judges!</strong><span>Soap only when hands are there</span></div>}
      </div>
      <div className={k.deviceFoot}>{scene === 0 ? <><Hand /><span>Hands under the sensor → soap, no touching</span></>
        : scene === 1 ? <><Droplets /><span>Plan: give soap, wait 3 seconds, repeat</span><small>No question anywhere</small></>
          : <><Check /><span>New plan: ask first, then act</span><small>Tested: both paths</small></>}</div>
    </div>}

    {scene === 2 && <div className={k.panel}>
      <div className={r.teacher}><span className={r.avatar}><UserRound aria-hidden="true" /></span><div><small>Mr Iyer · science teacher</small><p>“Let’s draw what it actually does.”</p></div></div>
      <h2>The old plan</h2>
      <div className={r.oldPlan} {...show(.2)}>
        <Node shape="oval" label="Start" /><ArrowRight aria-hidden="true" /><Node shape="rect" label="Give soap" /><ArrowRight aria-hidden="true" /><Node shape="rect" label="Wait 3 s" />
        <span className={r.repeat} {...show(.32)}><RotateCcw aria-hidden="true" />repeat forever</span>
      </div>
      <p className={r.warning} {...show(.42)}><Lightbulb aria-hidden="true" />No question anywhere, so even an empty sink gets soap.</p>
      <div className={r.legend}>{([["oval", "Start / End", .76], ["rect", "Action", .84], ["diamond", "Decision", .91]] as const).map(([shape, label, at]) => <div key={shape} {...show(at)}><span className={r.mini} data-shape={shape} />{label}</div>)}</div>
    </div>}

    {scene === 3 && <div className={`${k.panel} ${r.task}`}>
      <h2>Rebuild the station’s flowchart</h2>
      <p>Tap blocks to fill the boxes from the top, then test both paths.</p>
      <div className={r.bench}>
        <Chart filled={chart} path={solved ? "both" : path} />
        <div className={r.side}>
          <small>Blocks</small>
          <div className={r.blocks}>{blocks.map(({ id, label, shape }) => { const used = chart.includes(id); return <button key={id} type="button" data-trap={id === "wait" || undefined} aria-pressed={used} disabled={done || used || complete} onClick={() => place(id)}><span className={r.mini} data-shape={shape} aria-hidden="true" />{label}</button>; })}</div>
          <small>Tests</small>
          <div className={r.tests}>
            <button type="button" aria-pressed={solved || tested.yes} disabled={done || !complete} onClick={() => test("yes")}><Hand aria-hidden="true" />Test: hands at the sink{(solved || tested.yes) && <Check className={r.tick} aria-hidden="true" />}</button>
            <button type="button" aria-pressed={solved || tested.no} disabled={done || !complete} onClick={() => test("no")}><Droplets aria-hidden="true" />Test: empty sink{(solved || tested.no) && <Check className={r.tick} aria-hidden="true" />}</button>
          </div>
        </div>
      </div>
      <p className={k.hint} aria-live="polite">{hint || (done ? "Both paths tested. The station asks first, then acts." : complete ? "The chart is complete. Now test both paths." : `Box ${filled.length + 1}: which block comes next?`)}</p>
      <div className={k.actions}><button type="button" onClick={() => { setFilled(value => value.slice(0, -1)); setTested({ yes: false, no: false }); setPath(null); setHint(""); }} disabled={done || !filled.length}><RotateCcw />Undo last block</button></div>
    </div>}

    {scene === 4 && <div className={`${k.panel} ${r.review}`}>
      <h2>A decision has two paths</h2>
      <div className={r.bench}>
        <Chart filled={answer} path="both" />
        <div className={r.side}>
          <div className={r.result} {...show(.06)}><Hand aria-hidden="true" /><div><strong>Hands at the sink</strong><span>Yes → Give soap → End</span></div><Check aria-hidden="true" /></div>
          <div className={r.result} {...show(.24)}><Droplets aria-hidden="true" /><div><strong>Empty sink</strong><span>No → wait, ask again</span></div><Check aria-hidden="true" /></div>
          <div className={r.tip} {...show(.7)}><Lightbulb aria-hidden="true" /><span>Draw it, test every path, <b>then</b> build it.</span></div>
        </div>
      </div>
    </div>}
  </SceneSwap>;
}

const chapter: StoryChapter = {
  script,
  title: "Tara’s soap-spraying station",
  icon: FlaskConical,
  character: { asset: "girl-expressions", name: "Tara" },
  interactionScene: 3,
  beginLabel: "Practise with Tara",
  waitingText: "Story paused. Build the flowchart and test both paths to continue.",
  lockedHint: "Help Tara rebuild and test her flowchart first.",
  World,
};
export default chapter;
