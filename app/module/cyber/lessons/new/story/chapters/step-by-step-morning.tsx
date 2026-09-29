"use client";

import { ArrowRight, Bot, BusFront, Check, CircleCheck, ListOrdered, Play, RotateCcw, TriangleAlert, Undo2, X } from "lucide-react";
import { useState, type CSSProperties, type ReactNode } from "react";
import { SceneSwap } from "../StoryPlayer";
import type { StoryChapter, StoryWorldProps } from "../types";
import script from "./step-by-step-morning.json";
import k from "../story-player.module.css";
import m from "./step-by-step-morning.module.css";

// Rohan's mixed-up list, exactly as he typed it. The bank shows it in this order, so tapping straight through repeats his mistake.
const program = ["Wake up", "Brush teeth", "Put on shoes", "Put on socks", "Zip the bag", "Put books in bag"];
const fixed = ["Wake up", "Brush teeth", "Put on socks", "Put on shoes", "Put books in bag", "Zip the bag"];
function StepArt({ step }: { step: string }) {
  const at = Math.max(0, fixed.indexOf(step));
  return <span className={m.stepArt} aria-hidden="true" style={{ backgroundImage: `url('/cyber-missions/refined/morning-step-${at}.webp')` }} />;
}

/** Runs the steps like Tikku would, stopping at the first step that can't work. Any order that respects the three real rules passes. */
function runSteps(steps: string[]) {
  const done = new Set<string>();
  for (const [at, step] of steps.entries()) {
    if (at === 0 && step !== "Wake up") return { at, why: "Rohan is still asleep! Wake up has to come first." };
    if (step === "Put on socks" && done.has("Put on shoes")) return { at, why: "Tikku can’t pull socks over shoes! Socks go on first, then shoes." };
    if (step === "Put books in bag" && done.has("Zip the bag")) return { at, why: "The bag is zipped shut, so the books can’t go in. Books first, then zip." };
    done.add(step);
  }
  return { at: -1, why: "" };
}

/** A toy helper with a live command label. */
function Tikku({ face, label }: { face: "ok" | "happy"; label: string }) {
  return <div className={m.tikku} data-face={face} aria-hidden="true"><span className={m.toyArt} /><span className={m.body}>{label}</span></div>;
}

function Routine({ children, label }: { children: ReactNode; label: string }) {
  return <div className={k.device}>
    <div className={k.deviceBar}><span><Bot size={16} /> TIKKU</span><span>Rohan’s room</span></div>
    <div className={m.routineRoom}><div className={m.routineHero}><Tikku face="ok" label={label} /></div><div className={m.routineBoard}>{children}</div></div>
  </div>;
}

function World({ scene, playing, elapsed, solved, markSolved, hint, setHint, reduced }: StoryWorldProps) {
  const [placed, setPlaced] = useState<string[]>([]);
  const [stopAt, setStopAt] = useState<number | null>(null);
  const board = solved && placed.length !== 6 ? fixed : placed;
  const shown = (seconds: number) => !playing || elapsed > seconds;

  function change(next: string[]) { setPlaced(next); setStopAt(null); setHint(""); }
  function addStep(step: string) {
    if (solved || !program.includes(step) || placed.includes(step) || placed.length === 6) return;
    change([...placed, step]);
  }
  function run() {
    if (solved || placed.length !== 6) return;
    const result = runSteps(placed);
    if (result.at < 0) { setStopAt(null); markSolved(); return; }
    setStopAt(result.at); setHint(`Step ${result.at + 1}: ${result.why}`, false);
  }
  const slotState = (i: number) => solved ? "ok" : stopAt === null ? undefined : i < stopAt ? "ok" : i === stopAt ? "bad" : undefined;

  return <SceneSwap scene={scene} reduced={reduced}>
    {(scene === 0 || scene === 1 || scene === 5) && <div className={k.device} data-dim={scene === 1}>
      <div className={k.deviceBar}><span><Bot size={16} /> TIKKU</span><span>Rohan’s room</span></div>
      <div className={`${k.deviceArt} ${m.room}`} data-resolved={scene === 5}>
        {scene === 0 && <><div className={k.badge}><Check /> Steps saved for tomorrow</div><Tikku face="ok" label="6 steps" /></>}
        {scene === 1 && <div className={k.alert}><span className={m.busArt} aria-hidden="true" /><strong>Missed the bus!</strong><span>Tikku did every step, in the order it was given.</span></div>}
        {scene === 5 && <><div className={k.success}><CircleCheck /><strong>Ready on time!</strong><span>All 6 steps, in an order that works</span></div><Tikku face="happy" label="Done!" /></>}
      </div>
      <div className={k.deviceFoot}>{scene === 0 ? <><ListOrdered /><span>Tikku’s program: <b>6 steps</b></span><small>Pretend robot · example routine</small></> : scene === 1 ? <><TriangleAlert /><span className={m.mixups}><b>Shoes → socks</b><b>Zip → books</b></span></> : <><BusFront /><span>Rohan caught the school bus.</span><small>Socks → shoes · Books → zip</small></>}</div>
    </div>}

    {scene === 2 && <Routine label="6 steps">
      <div className={m.papa}><span>Papa</span><p>“Tikku did just what the list said.”</p></div>
      <h2>Tikku’s step list</h2>
      <ol className={m.list}>{program.map((step, i) => <li className={k.step} key={step} data-active={shown(2 + i * .9)}><b>{i + 1}</b><StepArt step={step} /><span className={m.stepLabel}>{step}</span>{(i === 2 || i === 4) && <em data-show={shown(8)}><TriangleAlert />{i === 2 ? "Before socks?" : "Before books?"}</em>}</li>)}</ol>
    </Routine>}

    {scene === 3 && <Routine label={solved ? "Done!" : `${board.length} of 6`}>
      <div className={m.taskLead}><div><h2>Fix Tikku’s morning steps</h2><p>Drag steps onto the board, or tap them in order.</p></div></div>
      <div className={m.board} onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); addStep(event.dataTransfer.getData("text/plain")); }}>
        <div className={m.boardBar}><span><Bot aria-hidden="true" /> TIKKU · STEP BOARD</span><span>{board.length} of 6</span></div>
        <ol aria-label={`${board.length} of 6 steps on Tikku’s board`}>{Array.from({ length: 6 }, (_, i) => { const state = slotState(i); return <li key={i} data-filled={Boolean(board[i])} data-state={state} style={{ "--i": i } as CSSProperties}><b>{i + 1}</b>{board[i] && <StepArt step={board[i]} />}<span>{board[i] ?? "Empty"}</span>{state === "ok" && <Check aria-hidden="true" />}{state === "bad" && <X aria-hidden="true" />}</li>; })}</ol>
      </div>
      <div className={`${k.bank} ${m.choices}`}>{program.map(step => { const used = board.includes(step); return <button key={step} draggable={!used && !solved} onDragStart={event => event.dataTransfer.setData("text/plain", step)} onClick={() => addStep(step)} disabled={solved || used} aria-pressed={used} type="button"><StepArt step={step} /><span>{step}</span></button>; })}</div>
      <p className={k.hint} aria-live="polite">{solved ? "Tikku’s steps work! Socks, then shoes. Books, then zip." : hint || (placed.length === 6 ? "All six steps are on the board. Press Run to test them." : "Think: what has to happen before each step?")}</p>
      <div className={`${k.actions} ${m.runRow}`}>
        <button onClick={() => change(placed.slice(0, -1))} disabled={!placed.length || solved} type="button"><Undo2 />Undo</button>
        <button onClick={() => change([])} disabled={!placed.length || solved} type="button"><RotateCcw />Clear board</button>
        <button className={k.primary} disabled={placed.length !== 6 || solved} onClick={run} type="button"><Play />Run Tikku</button>
      </div>
      <small>Pretend robot. Your own morning can have a different order.</small>
    </Routine>}

    {scene === 4 && <Routine label="Ready on time">
      <h2>Same steps. Different order.</h2>
      <div className={m.term}><ListOrdered /><div><strong>Sequence</strong><span>A list of steps in order. A computer follows it exactly, one step at a time.</span></div></div>
      <div className={m.compare}>
        <div data-show={shown(8)}><h3>Rohan’s first list</h3><div className={m.pair}><span><StepArt step="Put on shoes" />Shoes</span><ArrowRight aria-hidden="true" /><span><StepArt step="Put on socks" />Socks</span><X aria-hidden="true" /></div><div className={m.pair}><span><StepArt step="Zip the bag" />Zip</span><ArrowRight aria-hidden="true" /><span><StepArt step="Put books in bag" />Books</span><X aria-hidden="true" /></div><small>Stuck, then late</small></div>
        <div data-show={shown(10)} data-good="true"><h3>The fixed list</h3><div className={m.pair}><span><StepArt step="Put on socks" />Socks</span><ArrowRight aria-hidden="true" /><span><StepArt step="Put on shoes" />Shoes</span><Check aria-hidden="true" /></div><div className={m.pair}><span><StepArt step="Put books in bag" />Books</span><ArrowRight aria-hidden="true" /><span><StepArt step="Zip the bag" />Zip</span><Check aria-hidden="true" /></div><small>Ready on time</small></div>
      </div>
      <small>Check your steps before you press Run.</small>
    </Routine>}
  </SceneSwap>;
}

const chapter: StoryChapter = {
  script,
  title: "Rohan’s mixed-up morning",
  icon: Bot,
  character: { asset: "boy-emotions", name: "Rohan" },
  interactionScene: 3,
  beginLabel: "Practise with Rohan",
  waitingText: "Story paused. Fix Tikku’s steps to see what happens next.",
  lockedHint: "Help Rohan put Tikku’s steps in order first.",
  World,
};
export default chapter;
