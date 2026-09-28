"use client";

import { ArrowRight, Check, CircleAlert, Droplets, FlaskConical, Hand, Repeat, SprayCan, Timer, Undo2, Workflow } from "lucide-react";
import type { CSSProperties, DragEvent, ReactElement } from "react";
import { useId, useRef, useState } from "react";
import { SceneSwap } from "../StoryPlayer";
import type { StoryChapter, StoryWorldProps } from "../types";
import script from "./flowchart-architect.json";
import k from "../story-player.module.css";
import f from "./flowchart-architect.module.css";

type Kind = "terminal" | "process" | "decision";
type BlockId = "decision" | "soap" | "wait" | "end";
type Path = "yes" | "no";
const shapeName: Record<Kind, string> = { terminal: "Oval", process: "Rectangle", decision: "Diamond" };
const blocks: Record<BlockId, { label: string; kind: Kind }> = {
  soap: { label: "Dispense soap", kind: "process" },
  decision: { label: "Hands under sensor?", kind: "decision" },
  wait: { label: "Wait a moment", kind: "process" },
  end: { label: "End", kind: "terminal" },
};
const bankOrder: BlockId[] = ["soap", "decision", "wait", "end"];
/** Slots in the order Tara fills them: right after Start, the Yes path, the No path, the end of the Yes path. */
const answer: BlockId[] = ["decision", "soap", "wait", "end"];
const prompts = ["What comes right after Start?", "Yes, hands are there. What happens now?", "No hands. The sink is empty. What now?", "Finish the Yes path."];
const why: Partial<Record<BlockId, string>>[] = [
  { soap: "That’s Tara’s old plan: soap before asking. The station can’t know if hands are there, so it sprays anyway. Ask the question first.", wait: "Waiting first still never asks about hands. This spot needs a question.", end: "Ending right after Start means the station never does anything at all." },
  { wait: "The answer was yes, so hands are waiting! They need soap now, not more waiting.", end: "If the Yes path ends here, the hands never get any soap." },
  { end: "If the No path ends, the station stops for good and misses the next person. Wait, then ask again." },
  {},
];

/** Board parts: s0–s3 are the four slots; the rest are Start and the arrows. */
type Part = "start" | "e0" | "s0" | "yes" | "s1" | "e1" | "s3" | "no" | "s2" | "loop";
const paths: Record<Path, Part[]> = { yes: ["start", "e0", "s0", "yes", "s1", "e1", "s3"], no: ["start", "e0", "s0", "no", "s2", "loop"] };
const slotBox = [{ x: 40, y: 70, w: 120, h: 60 }, { x: 46, y: 168, w: 108, h: 34 }, { x: 214, y: 83, w: 108, h: 34 }, { x: 60, y: 218, w: 80, h: 30 }];

/** Seconds into a scene when the narrator reaches caption word `word` (keeps reveals in step after re-narration). */
function cue(scene: number, word: number) {
  const { caption, duration } = script.scenes[scene];
  return duration * word / caption.split(/\s+/).length;
}

function Shape({ kind }: { kind: Kind }) {
  return <svg className={f.shape} data-kind={kind} viewBox="0 0 34 22" aria-hidden="true">
    {kind === "decision" ? <polygon points="17,1.5 32.5,11 17,20.5 1.5,11" /> : <rect x="1.5" y="3" width="31" height="16" rx={kind === "terminal" ? 8 : 2} />}
  </svg>;
}

/** The flowchart board: Start → decision → Yes: soap → End; No: wait → loop back. Empty slots show a dashed "?". */
function Board({ filled, current, lit = [], runKey = 0 }: { filled: BlockId[]; current?: number; lit?: Part[]; runKey?: number }) {
  const id = `fa${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const marker = (on: boolean) => `url(#${id}${on ? "l" : ""})`;
  const shapes: Record<Part, (cls: string, on?: boolean) => ReactElement> = {
    start: c => <rect className={c} x={55} y={4} width={90} height={30} rx={15} />,
    e0: (c, on) => <line className={c} x1={100} y1={34} x2={100} y2={56} markerEnd={marker(Boolean(on))} />,
    s0: c => <polygon className={c} points="20,100 100,58 180,100 100,142" />,
    yes: (c, on) => <line className={c} x1={100} y1={142} x2={100} y2={165} markerEnd={marker(Boolean(on))} />,
    s1: c => <rect className={c} x={46} y={168} width={108} height={34} rx={3} />,
    e1: (c, on) => <line className={c} x1={100} y1={202} x2={100} y2={215} markerEnd={marker(Boolean(on))} />,
    s3: c => <rect className={c} x={60} y={218} width={80} height={30} rx={15} />,
    no: (c, on) => <line className={c} x1={180} y1={100} x2={211} y2={100} markerEnd={marker(Boolean(on))} />,
    s2: c => <rect className={c} x={214} y={83} width={108} height={34} rx={3} />,
    loop: (c, on) => <path className={c} d="M268 83V44H106" markerEnd={marker(Boolean(on))} />,
  };
  const text: Partial<Record<Part, [number, number, string[]]>> = { start: [100, 19, ["Start"]], s0: [100, 100, ["Hands under", "sensor?"]], s1: [100, 185, ["Dispense soap"]], s2: [268, 100, ["Wait a moment"]], s3: [100, 233, ["End"]] };
  const kindOf: Record<Part, string> = { start: "terminal", s0: "decision", s1: "process", s2: "process", s3: "terminal", e0: "edge", yes: "edge", e1: "edge", no: "edge", loop: "edge" };
  const edgeSlots: Partial<Record<Part, number[]>> = { e0: [0], yes: [0, 1], e1: [1, 3], no: [0, 2], loop: [2] };
  const slotOf = (p: Part) => p[0] === "s" && p !== "start" ? Number(p[1]) : -1;
  const parts: Part[] = ["e0", "yes", "e1", "no", "loop", "start", "s0", "s1", "s2", "s3"];
  return <svg className={f.chart} viewBox="0 0 334 252" aria-hidden="true">
    <defs>{[false, true].map(on => <marker key={String(on)} id={`${id}${on ? "l" : ""}`} viewBox="0 0 10 10" refX="8" refY="5" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="11" orient="auto"><path d="M0 0L10 5L0 10z" className={on ? f.headLit : f.head} /></marker>)}</defs>
    <g>
      {parts.map(p => {
        const slot = slotOf(p);
        const empty = slot >= 0 && !filled[slot];
        const i = lit.indexOf(p);
        if (empty) { const b = slotBox[slot]; return <g key={p} className={f.slot} data-current={current === slot}><rect x={b.x} y={b.y} width={b.w} height={b.h} rx={8} /><text x={b.x + b.w / 2} y={b.y + b.h / 2}>?</text></g>; }
        const label = text[p];
        return <g key={p} className={slot >= 0 ? f.placed : undefined} data-kind={kindOf[p]} data-dim={edgeSlots[p]?.some(n => !filled[n])}>
          {shapes[p](f.base)}
          {i >= 0 && <g key={runKey} className={f.glow} style={{ "--d": `${i * 0.18}s` } as CSSProperties}>{shapes[p](f.base, true)}</g>}
          {label && label[2].map((line, n) => <text key={line} x={label[0]} y={label[1] + (n - (label[2].length - 1) / 2) * 16}>{line}</text>)}
        </g>;
      })}
      {filled[0] && <><text className={f.branch} x={117} y={154}>Yes</text><text className={f.branch} x={195} y={87}>No</text></>}
      {filled[2] && <text className={f.loopText} x={187} y={37}>ask again</text>}
    </g>
  </svg>;
}

function World({ scene, playing, elapsed, solved, markSolved, hint, setHint, reduced }: StoryWorldProps) {
  const [placed, setPlaced] = useState<BlockId[]>([]);
  const [tested, setTested] = useState<Path[]>([]);
  const [run, setRun] = useState<Path | null>(null);
  const [runKey, setRunKey] = useState(0);
  const controls = useRef<HTMLDivElement>(null);
  const shown = solved ? answer : placed;
  const passed: Path[] = solved ? ["yes", "no"] : tested;
  const complete = shown.length === 4;
  const ready = complete && passed.length === 2;
  // A used block becomes disabled; keep keyboard focus in the task instead of dropping it on <body>.
  const keepFocus = () => requestAnimationFrame(() => { if (document.activeElement === document.body) controls.current?.querySelector<HTMLButtonElement>("button:not(:disabled)")?.focus(); });

  function place(id: BlockId) {
    if (solved || placed.includes(id) || placed.length === 4) return;
    const slot = placed.length;
    if (id !== answer[slot]) { setHint(why[slot][id] ?? "Not here. Does this spot need a question, an action or an ending?"); return; }
    setPlaced(value => [...value, id]); setHint(""); keepFocus();
  }
  function drop(event: DragEvent) {
    event.preventDefault();
    const id = event.dataTransfer.getData("text/plain");
    if (id in blocks) place(id as BlockId);
  }
  function test(path: Path) {
    if (solved || !complete) return;
    setRun(path); setRunKey(value => value + 1);
    setTested(value => value.includes(path) ? value : [...value, path]);
    setHint(path === "yes" ? "Test: hands under the sensor. Yes → one squirt of soap → End." : "Test: empty sink. No → wait a moment → ask again. No soap wasted.");
  }
  function undo() { setPlaced(value => value.slice(0, -1)); setTested([]); setRun(null); setHint(""); }

  const planAt = [17, 18, 20, 21, 23].map(word => cue(2, word));
  const paths5: [number, Part[]][] = [[6, ["s0"]], [21, ["s0", "yes", "s1", "e1", "s3"]], [29, ["s0", "no", "s2", "loop"]], [37, ["start", "e0", "s0"]]];
  const lit5 = playing ? paths5.filter(([word]) => elapsed >= cue(4, word)).at(-1)?.[1] ?? [] : [];
  const squirts = playing ? Math.min(19, 5 + Math.floor(elapsed / 1.6)) : 9;
  const idle = solved ? "Flowchart saved. Tara’s station asks first, then acts." : ready ? "Both paths work. Soap only flows when hands are there!" : complete ? "Now test both paths. A good engineer checks yes and no." : "Tap a block, or drag it onto the board.";

  return <SceneSwap scene={scene} reduced={reduced}>
    {(scene === 0 || scene === 1 || scene === 5) && <div className={k.device} data-dim={scene === 1}>
      <div className={k.deviceBar}><span><FlaskConical size={16} /> SCIENCE FAIR</span><span>Table 12 · Tara’s project</span></div>
      <div className={`${k.deviceArt} ${f.lab}`}>
        {scene === 0 && <><div className={k.badge}><Check /> Station ready!</div><div className={f.chip}><Timer aria-hidden="true" />Judges in 10 min</div></>}
        {scene === 1 && <div className={k.alert}>
          <SprayCan key={reduced ? 0 : squirts} className={f.squirt} />
          <strong>Squirt! Squirt!</strong><span>Soap sprays into an empty sink.</span>
          <div className={f.stats}><span>Squirts: <b>{squirts}</b></span><span>Hands seen: <b>0</b></span></div>
        </div>}
        {scene === 5 && <>
          <div className={f.judge}><span aria-hidden="true">M</span><div><strong>Judge Meera</strong><em>“May we see your flowchart?”</em></div></div>
          <div className={k.success}><Hand /><strong>One squirt. Just right!</strong><span>Hands seen: 1 · Squirts: 1 · Soap saved</span></div>
        </>}
      </div>
      <div className={k.deviceFoot}>
        {scene === 0 ? <><Workflow /><span>Her plan:</span><b>Start → Soap → Wait → Repeat</b><small>Built all week</small></>
          : scene === 1 ? <><CircleAlert /><span>Soap tank</span><span className={f.tank} role="img" aria-label={`Soap tank ${Math.max(10, 64 - squirts * 3)} percent full`}><i style={{ transform: `scaleX(${Math.max(10, 64 - squirts * 3) / 100})` }} /></span><span>{Math.max(10, 64 - squirts * 3)}%</span><small>Judges almost here</small></>
            : <><Workflow /><span>New plan:</span><b>Ask first → then act</b><small>Both paths tested</small></>}
      </div>
    </div>}

    {scene === 2 && <div className={k.panel}>
      <div className={f.teacher}><span aria-hidden="true">D</span><div><small>Mr. Das · Science teacher</small><p>“Bugs happen to every engineer. Let’s read your plan.”</p></div></div>
      <h2>Read the plan, one step at a time.</h2>
      <div className={f.plan}>
        {([["terminal", "Start"], ["process", "Dispense soap"], ["process", "Wait 3 seconds"], [null, "Repeat forever"]] as const).map(([kind, label], i) =>
          <div className={`${k.step} ${f.planStep}`} key={label} data-active={!playing || elapsed > planAt[i]}><span>{kind ? <Shape kind={kind} /> : <Repeat aria-hidden="true" />}</span>{label}</div>)}
        <div className={f.missing} data-show={!playing || elapsed > planAt[4]}><Shape kind="decision" /><span>Hands under sensor?</span><em>Missing!</em></div>
      </div>
    </div>}

    {scene === 3 && <div className={`${k.panel} ${f.task}`}>
      <h2>Help Tara build her flowchart</h2>
      <div className={f.split}>
        <div className={f.board} onDragOver={event => event.preventDefault()} onDrop={drop} role="img" aria-label={`Flowchart board. Start, then ${shown[0] ? "the question Hands under sensor?" : "an empty slot"}. Yes path: ${shown[1] ? "Dispense soap" : "empty"}, then ${shown[3] ? "End" : "empty"}. No path: ${shown[2] ? "Wait a moment, then back to the question" : "empty"}.`}>
          <div className={f.boardBar}><Workflow aria-hidden="true" /><span>Hand-wash station · plan 2</span><small>{shown.length}/4 blocks</small></div>
          <Board filled={shown} current={complete ? undefined : shown.length} lit={run && !solved ? paths[run] : []} runKey={runKey} />
        </div>
        <div className={f.controls} ref={controls}>
          {!complete ? <>
            <p className={f.prompt}><span>Block {shown.length + 1} of 4</span>{prompts[shown.length]}</p>
            <div className={`${k.bank} ${f.bank}`}>{bankOrder.map(id => {
              const block = blocks[id]; const used = shown.includes(id);
              return <button key={id} draggable={!used && !solved} onDragStart={event => event.dataTransfer.setData("text/plain", id)} onClick={() => place(id)} disabled={solved || used} aria-pressed={used} aria-label={`${block.label} (${shapeName[block.kind]})`} type="button"><Shape kind={block.kind} /><span>{block.label}<small>{shapeName[block.kind]}</small></span></button>;
            })}</div>
          </> : <>
            <p className={f.prompt}><span>Test time</span>Run both paths before saving.</p>
            <div className={f.tests}>
              {(["yes", "no"] as const).map(path => <button key={path} onClick={() => test(path)} disabled={solved} aria-pressed={passed.includes(path)} type="button">
                {path === "yes" ? <Hand aria-hidden="true" /> : <Droplets aria-hidden="true" />}<span>{path === "yes" ? "Test: hands under sensor" : "Test: empty sink"}</span>
                {passed.includes(path) && <em><Check aria-hidden="true" />{path === "yes" ? "1 squirt" : "0 squirts"}</em>}
              </button>)}
            </div>
          </>}
          <p className={k.hint} aria-live="polite">{hint || idle}</p>
          <div className={k.actions}>
            <button onClick={undo} disabled={!placed.length || solved} type="button"><Undo2 />Undo</button>
            <button className={k.primary} disabled={!ready} onClick={markSolved} type="button">{solved ? <>Flowchart saved <Check /></> : <>Save flowchart <ArrowRight /></>}</button>
          </div>
        </div>
      </div>
    </div>}

    {scene === 4 && <div className={`${k.panel} ${f.task}`}>
      <h2>One diamond. Two paths.</h2>
      <div className={f.split}>
        <div className={f.board} role="img" aria-label="Tara's flowchart. Start, then the decision Hands under sensor? Yes: Dispense soap, then End. No: Wait a moment, then loop back to the question.">
          <div className={f.boardBar}><Workflow aria-hidden="true" /><span>Hand-wash station · plan 2</span><small><Check aria-hidden="true" />tested</small></div>
          <Board filled={answer} lit={lit5} />
        </div>
        <div className={f.legend}>
          {([["decision", "Decision", "Asks a yes-or-no question. Two paths come out.", 6], ["process", "Process", "Does one action, like Dispense soap.", 21], ["terminal", "Start / End", "Where the plan begins and finishes.", 26]] as const).map(([kind, name, note, word]) =>
            <div className={`${k.step} ${f.legendRow}`} key={name} data-active={!playing || elapsed >= cue(4, word)}><span><Shape kind={kind} /></span><div><strong>{name}</strong><small>{note}</small></div></div>)}
          <div className={`${k.step} ${f.legendRow}`} data-active={!playing || elapsed >= cue(4, 29)}><span><Repeat aria-hidden="true" /></span><div><strong>Loop back</strong><small>No hands? Wait, then ask again.</small></div></div>
        </div>
      </div>
    </div>}
  </SceneSwap>;
}

const chapter: StoryChapter = {
  script,
  title: "Tara’s runaway soap station",
  icon: Workflow,
  character: { asset: "girl-expressions", name: "Tara" },
  interactionScene: 3,
  beginLabel: "Practise with Tara",
  waitingText: "Story paused. Build and test the flowchart to see what happens next.",
  lockedHint: "Help Tara build and test her flowchart first.",
  World,
};
export default chapter;
