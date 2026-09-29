"use client";

import { ArrowRight, Check, CircleHelp, Droplets, Play, RotateCcw, Sparkles, TramFront, Trash2, Undo2, X } from "lucide-react";
import { useMemo, useState, type CSSProperties } from "react";
import type { CyberLessonComponentProps } from "../../lesson-types";
import { PracticeShell, usePractice } from "./PracticeShell";
import s from "./practice.module.css";
import t from "./thinking-practice.module.css";

type Props = CyberLessonComponentProps;
type Submit = (correct: boolean, message: string) => void;
const artRoot = "/cyber-missions/refined/";
function Cue({ children }: { children: React.ReactNode }) { return <p className={t.cue}><CircleHelp aria-hidden="true" />{children}</p>; }
function Robot({ trouble = false }: { trouble?: boolean }) { return <img className={t.robotArt} src={`${artRoot}tiko-${trouble ? "low" : "happy"}.webp`} alt="Toy helper robot" />; }

type Tile = { shape: "circle" | "square" | "triangle" | "diamond"; color: "orange" | "blue" | "green" };
const tileName = (tile: Tile) => `${tile.color} ${tile.shape}`;
const match = (a: Tile | null, b: Tile) => a?.shape === b.shape && a.color === b.color;
function Shape({ tile }: { tile: Tile }) { return <span className={t.shape} data-shape={tile.shape} data-color={tile.color} aria-hidden="true" />; }
const patternTasks: { group: Tile[]; length: number; gaps: number[]; prompt: string }[] = [
  { group: [{ shape: "circle", color: "orange" }, { shape: "square", color: "blue" }], length: 6, gaps: [5], prompt: "Repair one gap in Rohan’s two-tile track." },
  { group: [{ shape: "triangle", color: "green" }, { shape: "triangle", color: "green" }, { shape: "diamond", color: "orange" }], length: 9, gaps: [5, 8], prompt: "Find the whole repeating group and repair two gaps." },
  { group: [{ shape: "circle", color: "orange" }, { shape: "square", color: "blue" }, { shape: "triangle", color: "green" }], length: 9, gaps: [4, 8], prompt: "Match colour AND shape to get the trolley to the fair." },
];
function PatternExercise({ task, submit }: { task: typeof patternTasks[number]; submit: Submit }) {
  const [placed, setPlaced] = useState<(Tile | null)[]>(task.gaps.map(() => null));
  const [active, setActive] = useState(0); const [travel, setTravel] = useState(0); const [ran, setRan] = useState(false);
  const tiles = Array.from({ length: task.length }, (_, i) => task.group[i % task.group.length]);
  const tray = [...task.group, { shape: "triangle", color: "blue" } as Tile, { shape: "square", color: "orange" } as Tile].filter((tile, i, all) => all.findIndex(x => match(x, tile)) === i);
  function place(tile: Tile) { setPlaced(value => value.map((item, i) => i === active ? tile : item)); setRan(false); setTravel(0); const next = placed.findIndex((item, i) => i !== active && !item); if (next >= 0) setActive(next); }
  function run() {
    const bad = task.gaps.findIndex((gap, i) => !match(placed[i], tiles[gap]));
    const distance = bad < 0 ? task.length : task.gaps[bad]; setTravel(distance); setRan(true);
    const got = bad < 0 ? null : placed[bad]; const want = bad < 0 ? null : tiles[task.gaps[bad]];
    submit(bad < 0, bad < 0 ? `The trolley crossed all ${task.length} tiles. The ${task.group.length}-tile group repeats all the way.` : `The trolley stopped at tile ${distance + 1}. You placed ${got ? tileName(got) : "no tile"}; this position needs ${want && tileName(want)}. ${got?.color === want?.color ? "The colour matches, but the shape does not." : "Read the repeating group from the first tile."}`);
  }
  return <div className={`${t.world} ${t.station}`}>
    <Cue>A pattern repeats a whole group. Tap a gap, place a tile, then roll the trolley to test your repair.</Cue>
    <div className={t.trackWindow}>
      <div className={t.trolleyLane}><TramFront aria-hidden="true" style={{ left: `${travel / task.length * 85}%` }} /><span>{ran ? `${travel} of ${task.length} tiles crossed` : "Trolley waiting"}</span></div>
      <div className={t.track} style={{ "--tiles": task.length } as CSSProperties} role="group" aria-label="Trolley track">
        {tiles.map((tile, i) => { const gap = task.gaps.indexOf(i); return gap < 0 ? <span className={t.trackTile} key={i} aria-label={`Tile ${i + 1}: ${tileName(tile)}`}><Shape tile={tile} /><small>{i + 1}</small></span> : <button className={t.trackTile} key={i} aria-label={`Gap ${gap + 1}${placed[gap] ? `: ${tileName(placed[gap]!)}` : ": empty"}`} aria-pressed={active === gap} data-bad={ran && travel === i} onClick={() => setActive(gap)} type="button">{placed[gap] ? <Shape tile={placed[gap]!} /> : "?"}<small>{i + 1}</small></button>; })}
      </div>
    </div>
    <div className={t.tray} aria-label="Repair tiles">{tray.map(tile => <button className={s.choice} type="button" key={tileName(tile)} onClick={() => place(tile)} aria-label={`Place ${tileName(tile)}`}><Shape tile={tile} />{tileName(tile)}</button>)}</div>
    <div className={t.controls}><button className={s.secondary} type="button" onClick={() => { setPlaced(task.gaps.map(() => null)); setTravel(0); setRan(false); setActive(0); }}><RotateCcw />Clear repairs</button><button className={s.primary} type="button" disabled={placed.some(x => !x)} onClick={run}><Play />Roll trolley</button></div>
  </div>;
}
export function PatternDetective(props: Props) {
  const p = usePractice(props); const task = patternTasks[Math.min(p.stage, 2)];
  return <PracticeShell props={props} stage={p.stage} eyebrow="Pattern lab" brief="Find the repeating group and test the repaired track." prompt={task.prompt} feedback={p.feedback} feedbackCorrect={p.feedbackCorrect} onFinish={p.finish} ready={p.ready} onContinue={p.continuePractice} art="station"><PatternExercise key={p.stage} task={task} submit={p.submit} /></PracticeShell>;
}

const morningArtSteps = ["Wake up", "Brush teeth", "Put on socks", "Put on shoes", "Put books in bag", "Zip the bag"];
const routines = [
  { prompt: "Program Tikku’s first three morning steps.", items: ["Put on shoes", "Wake up", "Brush teeth"], rules: { "Brush teeth": ["Wake up"], "Put on shoes": ["Wake up", "Brush teeth"] } as Record<string, string[]> },
  { prompt: "Pack a bag without closing it too soon.", items: ["Zip the bag", "Put books in bag", "Check the timetable", "Open the bag"], rules: { "Open the bag": ["Check the timetable"], "Put books in bag": ["Open the bag"], "Zip the bag": ["Put books in bag"] } as Record<string, string[]> },
  { prompt: "Build all six steps. Socks before shoes; books before zip.", items: ["Put on shoes", "Zip the bag", "Wake up", "Put books in bag", "Put on socks", "Brush teeth"], rules: { "Brush teeth": ["Wake up"], "Put on socks": ["Wake up"], "Put on shoes": ["Put on socks"], "Put books in bag": ["Wake up"], "Zip the bag": ["Put books in bag"] } as Record<string, string[]> },
];
function StepPicture({ step }: { step: string }) { const index = morningArtSteps.indexOf(step); return index >= 0 ? <img src={`${artRoot}morning-step-${index}.webp`} alt="" className={t.stepPicture} /> : <ArrowRight aria-hidden="true" />; }
function executeRoutine(steps: string[], rules: Record<string, string[]>) {
  const done: string[] = []; const frames: { step: string; ok: boolean; message: string }[] = [];
  for (const step of steps) { const missing = (rules[step] || []).filter(x => !done.includes(x)); const ok = missing.length === 0; frames.push({ step, ok, message: ok ? `${step}: completed.` : `${step} cannot happen yet. First: ${missing.join(" and ")}.` }); if (!ok) break; done.push(step); }
  return frames;
}
function SequenceExercise({ task, submit }: { task: typeof routines[number]; submit: Submit }) {
  const [selected, setSelected] = useState<string[]>([]); const [cursor, setCursor] = useState(0);
  const frames = executeRoutine(selected, task.rules); const frame = frames[cursor - 1]; const complete = selected.length === task.items.length;
  function edit(next: string[]) { setSelected(next); setCursor(0); }
  function execute(all: boolean) {
    const next = all ? frames.length : Math.min(cursor + 1, frames.length); setCursor(next);
    const last = frames[next - 1];
    if (!last.ok || next === task.items.length) submit(last.ok && frames.length === task.items.length, last.ok ? `Tikku completed ${task.items.length} steps in your order. Every required earlier step was ready.` : `Stopped at step ${next}: ${last.message} Steps after it were not run.`);
  }
  return <div className={`${t.world} ${t.morning}`}>
    <Cue>A sequence runs in your order. Tap steps to build it; run the whole routine or execute one step at a time.</Cue>
    <div className={t.split}><div className={t.sheet}><h3>Tikku’s program</h3><ol className={t.sequence}>{task.items.map((_, i) => <li key={i} data-status={i < cursor ? frames[i]?.ok ? "ok" : "bad" : undefined}><b>{i + 1}</b>{selected[i] && <StepPicture step={selected[i]} />}<span>{selected[i] || "Tap an available step"}</span>{i < cursor && (frames[i]?.ok ? <Check /> : frames[i] ? <X /> : null)}</li>)}</ol><div className={t.controls}><button className={s.secondary} disabled={!selected.length} onClick={() => edit(selected.slice(0, -1))} type="button"><Undo2 />Undo last step</button><button className={s.secondary} onClick={() => edit([])} type="button"><RotateCcw />Clear routine</button></div></div><div className={t.actor}><Robot trouble={frame?.ok === false} /><p className={t.actorStatus} aria-live="polite">{frame?.message || "Tikku waits for your instructions."}</p></div></div>
    <div className={t.tray}>{task.items.map(item => <button className={s.choice} disabled={selected.includes(item)} key={item} onClick={() => edit([...selected, item])} type="button" aria-label={`Add ${item}`}><StepPicture step={item} />{item}</button>)}</div>
    <div className={t.controls}><button className={s.secondary} type="button" disabled={!complete || cursor >= frames.length || frame?.ok === false} onClick={() => execute(false)}>Execute next step</button><button className={s.primary} type="button" disabled={!complete} onClick={() => execute(true)}><Play />Run routine</button></div>
  </div>;
}
export function StepByStepMorning(props: Props) {
  const p = usePractice(props); const task = routines[Math.min(p.stage, 2)];
  return <PracticeShell props={props} stage={p.stage} eyebrow="Sequence studio" brief="Put each prerequisite before the action that needs it." prompt={task.prompt} feedback={p.feedback} feedbackCorrect={p.feedbackCorrect} onFinish={p.finish} ready={p.ready} onContinue={p.continuePractice} art="morning"><SequenceExercise key={p.stage} task={task} submit={p.submit} /></PracticeShell>;
}

type BranchAction = "soap" | "wait" | "end";
const branchNames: Record<BranchAction, string> = { soap: "Dispense soap", wait: "Wait and ask again", end: "Stop station" };
const flowTasks = [
  { prompt: "Give the pump action its shape, then test hands and an empty sink.", samples: [[true], [false]] },
  { prompt: "Connect both answers to the right actions. Test both branches.", samples: [[true], [false]] },
  { prompt: "Make the station wait through two empty readings, then serve the next person.", samples: [[false, false, true], [false, false, false]] },
];
function runFlow(samples: boolean[], shape: string, yes: BranchAction, no: BranchAction, stage: number) {
  const trace: string[] = ["Start"]; let soap = 0; let stopped = false;
  if (shape !== (stage === 0 ? "Process" : "Decision")) return { soap, stopped: true, valid: false, trace: [...trace, stage === 0 ? `${shape || "Missing block"} cannot execute the pump action. Use a process rectangle.` : `${shape || "Missing block"} has no yes/no branches. The sensor question needs a decision diamond.`] };
  for (const hands of samples) {
    trace.push(`Sensor: ${hands ? "hands detected → YES" : "empty sink → NO"}`);
    const action = hands ? yes : no; trace.push(branchNames[action]);
    if (action === "soap") { soap++; trace.push("End this wash"); stopped = true; break; }
    if (action === "end") { stopped = true; break; }
  }
  return { soap, stopped, valid: true, trace };
}
function FlowExercise({ stage, submit }: { stage: number; submit: Submit }) {
  const [shape, setShape] = useState(""); const [yes, setYes] = useState<BranchAction>(stage === 0 ? "soap" : "end"); const [no, setNo] = useState<BranchAction>(stage === 0 ? "wait" : "soap"); const [tests, setTests] = useState<Record<number, ReturnType<typeof runFlow>>>({}); const [last, setLast] = useState<number | null>(null);
  const task = flowTasks[stage];
  function change(changeState: () => void) { changeState(); setTests({}); setLast(null); }
  function test(index: number) { const result = runFlow(task.samples[index], shape, yes, no, stage); setTests(current => ({ ...current, [index]: result })); setLast(index); }
  const passed = (index: number) => { const result = tests[index]; const hands = task.samples[index].some(Boolean); return result?.valid && result.soap === (hands ? 1 : 0) && (hands ? result.stopped : !result.stopped); };
  function save() { const bad = [0, 1].find(index => !passed(index)); submit(bad === undefined, bad === undefined ? "Both inputs worked: one squirt for hands, none for an empty sink. The empty path waits and asks again." : `Test ${bad + 1} failed: ${tests[bad].trace.join(" → ")}. Expected ${task.samples[bad].some(Boolean) ? "one squirt for the arriving hands" : "no soap and a station still waiting"}. Edit the branch and rerun both tests.`); }
  const result = last === null ? null : tests[last];
  return <div className={`${t.world} ${t.lab}`}><Cue>An action uses a rectangle. A question uses a diamond with YES and NO routes. Configure the blocks, run each sensor input, then save.</Cue><div className={t.split}><div className={t.sheet}><h3>Station plan</h3><label className={t.field}>{stage === 0 ? "Pump block shape" : "Sensor question shape"}<select aria-label={stage === 0 ? "Pump block shape" : "Sensor question shape"} value={shape} onChange={event => change(() => setShape(event.target.value))}><option value="">Choose a block shape</option>{["Process", "Decision", "End"].map(kind => <option key={kind}>{kind}</option>)}</select></label><div className={t.flowChart}><span className={t.oval}>Start</span><ArrowRight /><span className={t.flowNode} data-kind={stage === 0 ? "decision" : shape.toLowerCase()}>Hands detected?</span><div className={t.branches}>{(["YES", "NO"] as const).map((branch, i) => <div key={branch}><b>{branch}</b><span className={stage === 0 && i === 0 ? t.flowNode : undefined} data-kind={stage === 0 && i === 0 ? shape.toLowerCase() : undefined}>{branchNames[i === 0 ? yes : no]}</span>{stage > 0 && <select aria-label={`${branch} branch action`} value={i === 0 ? yes : no} onChange={event => change(() => (i === 0 ? setYes : setNo)(event.target.value as BranchAction))}>{Object.entries(branchNames).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>}</div>)}</div></div></div><div className={t.sensorScene}><img src="/cyber-missions/engineering-lab.webp" alt="Tara’s illustrated hand-washing laboratory" /><div className={t.sensorResult}><Droplets /><strong>{result ? `${result.soap} soap squirts` : "Sensor waiting"}</strong><span>{result ? result.stopped ? "Station ended" : "Waiting for next reading" : "Run a test to see the chosen program."}</span></div></div></div><div className={t.controls}>{task.samples.map((samples, i) => <button className={s.secondary} type="button" key={i} onClick={() => test(i)} disabled={!shape} aria-label={`Run sensor test ${i + 1}`}><Play />Test {i + 1}: {samples.map(x => x ? "hands" : "empty").join(" → ")}{tests[i] && (passed(i) ? <Check /> : <X />)}</button>)}</div>{result && <ol className={t.trace} aria-live="polite">{result.trace.map((line, i) => <li key={i}>{line}</li>)}</ol>}<button className={s.primary} disabled={!tests[0] || !tests[1]} onClick={save} type="button">Save tested chart</button></div>;
}
export function FlowchartArchitect(props: Props) {
  const p = usePractice(props); const stage = Math.min(p.stage, 2);
  return <PracticeShell props={props} stage={p.stage} eyebrow="Flowchart workshop" brief="Build a plan that asks before it acts. Test every route." prompt={flowTasks[stage].prompt} feedback={p.feedback} feedbackCorrect={p.feedbackCorrect} onFinish={p.finish} ready={p.ready} onContinue={p.continuePractice} art="lab"><FlowExercise key={p.stage} stage={stage} submit={p.submit} /></PracticeShell>;
}

type RobotFrame = { pos: number; clean: boolean[]; command: string; round: number; bump: boolean };
const loopTasks = [{ tiles: 4, sweep: false, prompt: "Move across four tiles with one loop." }, { tiles: 5, sweep: true, prompt: "Move AND sweep each of five dusty tiles." }, { tiles: 8, sweep: true, prompt: "The row grew to eight tiles. Update the loop without bumping the bin." }];
const loopBodies = [{ id: "move", label: "Move right", commands: ["MOVE RIGHT"] }, { id: "sweep", label: "Sweep", commands: ["SWEEP"] }, { id: "both", label: "Move right, then sweep", commands: ["MOVE RIGHT", "SWEEP"] }, { id: "backwards", label: "Sweep, then move right", commands: ["SWEEP", "MOVE RIGHT"] }];
function executeLoop(tiles: number, commands: string[], count: number) {
  const frames: RobotFrame[] = []; let pos = 0; const clean = Array(tiles).fill(false) as boolean[];
  for (let round = 1; round <= count; round++) for (const command of commands) {
    if (command === "MOVE RIGHT") pos++;
    if (command === "SWEEP" && pos > 0 && pos <= tiles) clean[pos - 1] = true;
    const bump = pos > tiles; frames.push({ pos, clean: [...clean], command, round, bump }); if (bump) return frames;
  }
  return frames;
}
function LoopExercise({ task, submit }: { task: typeof loopTasks[number]; submit: Submit }) {
  const [body, setBody] = useState(""); const [count, setCount] = useState(0); const [cursor, setCursor] = useState(0);
  const chosen = loopBodies.find(x => x.id === body); const frames = executeLoop(task.tiles, chosen?.commands || [], count); const frame = frames[cursor - 1];
  const pos = frame?.pos || 0; const clean = frame?.clean || Array(task.tiles).fill(false); const complete = cursor > 0 && cursor === frames.length;
  function run(all: boolean) { const next = all ? frames.length : Math.min(cursor + 1, frames.length); setCursor(next); if (next < frames.length) return; const end = frames.at(-1)!; const correct = end.pos === task.tiles && !end.bump && (!task.sweep || end.clean.every(Boolean)); const missed = end.clean.flatMap((x, i) => x ? [] : [i + 1]); submit(correct, correct ? `Dusty executed ${frames.length} commands in ${count} rounds, reached tile ${task.tiles}${task.sweep ? " and swept every tile" : ""}, then stopped before the bin.` : end.bump ? `Bump on round ${end.round}: ${end.command} moved Dusty into the bin at position ${end.pos}. There are only ${task.tiles} work tiles.` : end.pos !== task.tiles ? `Dusty stopped at position ${end.pos}, not tile ${task.tiles}. Your body moved ${chosen?.commands.filter(x => x === "MOVE RIGHT").length} time per round.` : `Dusty reached the end, but tiles ${missed.join(", ")} are still dusty. Move onto a tile before sweeping it.`); }
  return <div className={`${t.world} ${t.lab}`}><Cue>A loop repeats its body in order. Choose the body and count; step through commands or run the whole loop.</Cue><div className={t.split}><div className={t.sheet}><h3>Loop program</h3><div className={s.codeBoard}>REPEAT {count || "?"} TIMES{chosen?.commands.map(command => <span className={s.codeLine} key={command} data-active={frame?.command === command}>  {command}</span>)}</div><div className={t.tray}>{loopBodies.filter(x => task.sweep || x.id === "move" || x.id === "sweep").map(item => <button className={s.choice} key={item.id} aria-pressed={body === item.id} onClick={() => { setBody(item.id); setCursor(0); }} type="button">{item.label}</button>)}</div><label className={t.field}>Repeat count<select aria-label="Repeat count" value={count} onChange={event => { setCount(Number(event.target.value)); setCursor(0); }}><option value={0}>Choose a count</option>{Array.from({ length: 9 }, (_, i) => i + 1).map(n => <option key={n} value={n}>{n}</option>)}</select></label></div><div className={t.sheet}><h3>Dusty’s work row</h3><div className={t.robotRow} style={{ "--cells": task.tiles + 2 } as CSSProperties} role="img" aria-label={`Dusty at position ${pos}; ${clean.filter(Boolean).length} of ${task.tiles} tiles clean${frame?.bump ? "; bumped bin" : ""}`}><span>Start</span>{clean.map((value, i) => <span key={i} data-clean={value}><small>{i + 1}</small>{task.sweep && (value ? <Sparkles /> : <span className={t.dust}>dust</span>)}</span>)}<span><Trash2 /></span><img src={`${artRoot}tiko-${frame?.bump ? "low" : "happy"}.webp`} alt="" className={t.rowRobot} style={{ left: `${pos / (task.tiles + 2) * 100}%` }} /></div><p className={t.execution} aria-live="polite">{frame ? `Round ${frame.round}: ${frame.command}. ${cursor} commands executed${complete ? ". Run complete." : "."}` : `Start position 0. Work tiles 1–${task.tiles}; bin at ${task.tiles + 1}.`}</p><ol className={t.trace}>{frames.slice(0, cursor).map((entry, i) => <li key={i}>Round {entry.round} · {entry.command} → position {entry.pos}{entry.bump ? " · BUMP" : entry.command === "SWEEP" ? ` · ${entry.clean.filter(Boolean).length} clean` : ""}</li>)}</ol></div></div><div className={t.controls}><button className={s.secondary} disabled={!chosen || !count || complete} onClick={() => run(false)} type="button">Execute next command</button><button className={s.primary} disabled={!chosen || !count} onClick={() => run(true)} type="button"><Play />Run loop</button><button className={s.secondary} onClick={() => setCursor(0)} type="button"><RotateCcw />Rewind robot</button></div></div>;
}
export function LoopInspector(props: Props) {
  const p = usePractice(props); const task = loopTasks[Math.min(p.stage, 2)];
  return <PracticeShell props={props} stage={p.stage} eyebrow="Robot code lab" brief="Repeat the right steps the right number of times. Read what Dusty actually did." prompt={task.prompt} feedback={p.feedback} feedbackCorrect={p.feedbackCorrect} onFinish={p.finish} ready={p.ready} onContinue={p.continuePractice} art="lab"><LoopExercise key={p.stage} task={task} submit={p.submit} /></PracticeShell>;
}

type GradeCase = { roll: string; marks: number; attendance: number; last?: boolean };
const gradeTasks: { prompt: string; cases: GradeCase[] }[] = [
  { prompt: "Include exactly 40 marks. Trace below, on and above the boundary.", cases: [{ roll: "Below", marks: 39.5, attendance: 90 }, { roll: "On", marks: 40, attendance: 90 }, { roll: "Above", marks: 41, attendance: 90 }] },
  { prompt: "Use nested loops to check every student in both sections.", cases: [{ roll: "7A-1", marks: 52, attendance: 90 }, { roll: "7A-2", marks: 71, attendance: 80, last: true }, { roll: "7B-1", marks: 29, attendance: 90 }, { roll: "7B-2", marks: 40, attendance: 75, last: true }] },
  { prompt: "Repair the loop end AND both pass boundaries, then inspect all tests.", cases: [{ roll: "Marks below", marks: 39.5, attendance: 80 }, { roll: "Marks on", marks: 40, attendance: 80 }, { roll: "Attendance below", marks: 60, attendance: 74 }, { roll: "Attendance on", marks: 60, attendance: 75 }, { roll: "Attendance above", marks: 60, attendance: 76 }, { roll: "Last student", marks: 55, attendance: 90, last: true }] },
];
const compare = (value: number, operator: string, edge: number) => operator === ">=" ? value >= edge : operator === ">" ? value > edge : value === edge;
function gradeExecution(row: GradeCase, stage: number, marks: string, attendance: string, loop: string) {
  if (stage === 1 && loop === "flat") return { got: "Type error", trace: "Outer list contains class arrays, not score numbers. An inner loop must visit each score." };
  if (stage === 1 && loop === "first") return row.roll.startsWith("7B") ? { got: "Missing", trace: "Only section 7A was visited; 7B was never entered." } : { got: row.marks >= 40 ? "Pass" : "Fail", trace: `7A → ${row.roll} → ${row.marks} >= 40` };
  if (stage === 2 && loop === "minus" && row.last) return { got: "Missing", trace: "The inner loop stopped at count - 1, so this student was never checked." };
  const passMarks = compare(row.marks, stage === 1 ? ">=" : marks, 40); const passAttendance = stage < 2 || compare(row.attendance, attendance, 75);
  return { got: passMarks && passAttendance ? "Pass" : "Fail", trace: `${row.roll} → marks ${row.marks} ${stage === 1 ? ">=" : marks} 40 is ${passMarks}${stage === 2 ? `; attendance ${row.attendance} ${attendance} 75 is ${passAttendance}; AND is ${passMarks && passAttendance}` : ""}` };
}
function LogicExercise({ stage, submit }: { stage: number; submit: Submit }) {
  const task = gradeTasks[stage]; const [marks, setMarks] = useState(">"); const [attendance, setAttendance] = useState(">"); const [loop, setLoop] = useState(stage === 1 ? "flat" : "minus"); const [cursor, setCursor] = useState(0);
  const results = task.cases.map(row => gradeExecution(row, stage, marks, attendance, loop)); const wants = task.cases.map(row => row.marks >= 40 && (stage < 2 || row.attendance >= 75) ? "Pass" : "Fail");
  function change(set: (value: string) => void, value: string) { set(value); setCursor(0); }
  function run(all: boolean) { const next = all ? task.cases.length : Math.min(cursor + 1, task.cases.length); setCursor(next); if (next < task.cases.length) return; const bad = results.findIndex((result, i) => result.got !== wants[i]); const crashed = stage === 2 && loop === "plus"; submit(bad < 0 && !crashed, crashed ? "The listed students were processed, then count + 1 requested a student that does not exist and crashed. Stop at count, not count + 1." : bad < 0 ? `All ${results.length} cases match the written rule. Every student was visited, including the last.` : `${task.cases[bad].roll}: expected ${wants[bad]}, got ${results[bad].got}. ${results[bad].trace} Edit the chosen line and rerun.`); }
  return <div className={`${t.world} ${t.lab}`}><Cue>Trace the chosen code, not the answer you hoped for. Edit the program, then run every student and boundary test.</Cue><div className={t.sheet}><p className={t.rule}>Written rule: marks ≥ 40{stage === 2 ? " AND attendance ≥ 75%. Visit every student exactly once." : "."}</p><div className={t.fields}>{stage !== 1 && <label className={t.field}>Marks condition<select aria-label="Marks condition" value={marks} onChange={event => change(setMarks, event.target.value)}>{[">", ">=", "=="].map(operator => <option key={operator} value={operator}>marks {operator} 40</option>)}</select></label>}{stage === 1 && <label className={t.field}>Loop structure<select aria-label="Loop structure" value={loop} onChange={event => change(setLoop, event.target.value)}><option value="flat">FOR EACH score IN classes</option><option value="first">FOR EACH score IN first class only</option><option value="nested">FOR EACH class, THEN EACH score in class</option></select></label>}{stage === 2 && <><label className={t.field}>Loop end<select aria-label="Loop end" value={loop} onChange={event => change(setLoop, event.target.value)}><option value="minus">count - 1</option><option value="count">count</option><option value="plus">count + 1</option></select></label><label className={t.field}>Attendance condition<select aria-label="Attendance condition" value={attendance} onChange={event => change(setAttendance, event.target.value)}>{[">", ">=", "=="].map(operator => <option key={operator} value={operator}>attendance {operator} 75</option>)}</select></label></>}</div><pre className={t.program}>{stage === 1 ? loop === "nested" ? "FOR EACH class IN classes:\n  FOR EACH score IN class:\n    IF score >= 40: Pass ELSE Fail" : loop === "first" ? "FOR EACH score IN classes[0]:\n  IF score >= 40: Pass ELSE Fail" : "FOR EACH score IN classes:\n  IF score >= 40: Pass ELSE Fail" : `${stage === 2 ? `FOR EACH section:\n  FOR student FROM 1 TO ${loop === "minus" ? "count - 1" : loop === "plus" ? "count + 1" : "count"}:\n    ` : "FOR EACH score:\n  "}IF marks ${marks} 40${stage === 2 ? ` AND attendance ${attendance} 75` : ""}: Pass ELSE Fail`}</pre><div className={t.tableScroll}><table className={t.testTable}><caption>Teaching data · actual output from your program</caption><thead><tr><th scope="col">Test</th><th scope="col">Marks</th>{stage === 2 && <th scope="col">Attend.</th>}<th scope="col">Expected</th><th scope="col">Actual</th></tr></thead><tbody>{task.cases.map((row, i) => <tr key={row.roll} data-status={cursor > i ? results[i].got === wants[i] ? "ok" : "bad" : undefined}><th scope="row">{row.roll}</th><td>{row.marks}</td>{stage === 2 && <td>{row.attendance}%</td>}<td>{wants[i]}</td><td>{cursor > i ? results[i].got : "Not run"}</td></tr>)}</tbody></table></div><p className={t.execution} aria-live="polite">{cursor ? `${results[cursor - 1].trace}${stage === 2 && loop === "plus" && cursor === task.cases.length ? " → next student: count + 1 does not exist → CRASHED after the listed students." : ""}` : "No students traced yet."}</p><div className={t.controls}><button className={s.secondary} disabled={cursor === task.cases.length} onClick={() => run(false)} type="button">Trace next student</button><button className={s.primary} onClick={() => run(true)} type="button"><Play />Run test cases</button></div></div></div>;
}
export function ComplexAlgorithmicLogic(props: Props) {
  const p = usePractice(props); const stage = Math.min(p.stage, 2);
  return <PracticeShell props={props} stage={p.stage} eyebrow="Algorithm debugger" brief="Check coverage and boundaries against real test outputs." prompt={gradeTasks[stage].prompt} feedback={p.feedback} feedbackCorrect={p.feedbackCorrect} onFinish={p.finish} ready={p.ready} onContinue={p.continuePractice} art="lab"><LogicExercise key={p.stage} stage={stage} submit={p.submit} /></PracticeShell>;
}

type SortFrame = { data: number[]; comparisons: number; pair: number[]; note: string };
function bubbleTrace(source: number[]) {
  const data = [...source]; const frames: SortFrame[] = [{ data: [...data], comparisons: 0, pair: [], note: "Compare adjacent numbers; swap only if the left is larger." }]; let comparisons = 0;
  for (let end = data.length - 1; end > 0; end--) { let swapped = false; for (let i = 0; i < end; i++) { comparisons++; const a = data[i], b = data[i + 1]; const swap = a > b; if (swap) { [data[i], data[i + 1]] = [b, a]; swapped = true; } frames.push({ data: [...data], comparisons, pair: [i, i + 1], note: `${a} > ${b} is ${swap}: ${swap ? "swap neighbours" : "keep their order"}.` }); } if (!swapped) break; }
  frames.push({ data: [...data], comparisons, pair: [], note: "Sorted. A pass with no swaps stops bubble sort early." }); return frames;
}
function mergeTrace(source: number[]) {
  const working = [...source]; const frames: SortFrame[] = [{ data: [...source], comparisons: 0, pair: [], note: "Split into halves. Merge sorted halves by comparing their front numbers." }]; let comparisons = 0;
  function sort(data: number[], offset: number): number[] { if (data.length <= 1) return [...data]; const middle = Math.floor(data.length / 2); const left = sort(data.slice(0, middle), offset), right = sort(data.slice(middle), offset + middle); const out: number[] = []; let a = 0, b = 0; while (a < left.length && b < right.length) { const x = left[a], y = right[b]; comparisons++; const chooseLeft = x <= y; out.push(chooseLeft ? left[a++] : right[b++]); frames.push({ data: [...working], comparisons, pair: [], note: `Merge [${left.join(", ")}] with [${right.join(", ")}]: ${x} <= ${y} is ${chooseLeft}; take ${out.at(-1)}. Output so far: [${out.join(", ")}].` }); } out.push(...left.slice(a), ...right.slice(b)); out.forEach((value, i) => { working[offset + i] = value; }); return out; }
  const data = sort(source, 0); frames.push({ data, comparisons, pair: [], note: "Sorted. Leftover items were copied without number comparisons." }); return frames;
}
const sortTasks = [
  { prompt: "Inspect an already sorted list. Does bubble sort’s early stop help?", data: [1, 2, 3, 4], hint: "Four sorted results" },
  { prompt: "Compare both sorts on eight reversed results.", data: [8, 7, 6, 5, 4, 3, 2, 1], hint: "Eight reversed results" },
  { prompt: "Compare twelve mixed results. Choose from the measured evidence.", data: [12, 4, 9, 2, 11, 6, 1, 8, 3, 10, 5, 7], hint: "Twelve mixed results" },
];
function SortingExercise({ task, submit }: { task: typeof sortTasks[number]; submit: Submit }) {
  const traces = useMemo(() => [bubbleTrace(task.data), mergeTrace(task.data)], [task.data]); const [cursors, setCursors] = useState([0, 0]); const [prediction, setPrediction] = useState("");
  const finished = traces.every((frames, i) => cursors[i] === frames.length - 1); const totals = traces.map(frames => frames.at(-1)!.comparisons); const winner = totals[0] < totals[1] ? "bubble" : totals[1] < totals[0] ? "merge" : "tie";
  function run(all: boolean) { setCursors(current => traces.map((frames, i) => all ? frames.length - 1 : Math.min(current[i] + 1, frames.length - 1))); }
  return <div className={`${t.world} ${t.sports}`}><Cue>Both sorts must produce the same order. Predict, step through comparisons, then compare the counters. These are comparison counts, not seconds.</Cue><div className={t.sheet}><h3>{task.hint}</h3><div className={t.prediction}><label className={t.field}>Prediction: fewer comparisons<select aria-label="Sort prediction" value={prediction} onChange={event => setPrediction(event.target.value)}><option value="">Make a prediction</option><option value="bubble">Bubble sort</option><option value="merge">Merge sort</option><option value="tie">Same count</option></select></label><div className={t.controls}><button className={s.secondary} disabled={!prediction || finished} onClick={() => run(false)} type="button">Step both algorithms</button><button className={s.primary} disabled={!prediction} onClick={() => run(true)} type="button"><Play />Run both sorts</button><button className={s.secondary} onClick={() => setCursors([0, 0])} type="button"><RotateCcw />Reset traces</button></div></div></div><div className={t.sortLanes}>{traces.map((frames, i) => { const frame = frames[cursors[i]]; const max = Math.max(...task.data); return <section className={t.sheet} key={i}><h3>{i === 0 ? "Bubble sort" : "Merge sort"}<span className={t.counter} aria-label={`${i === 0 ? "Bubble" : "Merge"} comparisons`}>{frame.comparisons} comparisons</span></h3><div className={t.bars} role="img" aria-label={`${i === 0 ? "Bubble" : "Merge"} working list: ${frame.data.join(", ")}`}>{frame.data.map((value, j) => <span key={j} data-pair={frame.pair.includes(j)} style={{ height: `${value / max * 100}%` }}><b>{value}</b></span>)}</div><p className={t.execution} aria-live="polite">{frame.note}</p></section>; })}</div><div className={t.sheet}><p>{finished ? `Final counts: Bubble ${totals[0]}, Merge ${totals[1]}. ${prediction === winner ? "Your prediction matched this run." : "Your prediction differed; use the observed counters now."}` : "Complete both traces before drawing a conclusion."}</p><div className={t.tray}>{["bubble", "merge", "tie"].map(choice => <button className={s.choice} key={choice} disabled={!finished} onClick={() => submit(choice === winner, choice === winner ? `The counters support your conclusion: ${totals[0]} vs ${totals[1]} comparisons on this ${task.data.length}-item list. A different input can change the winner.` : `You chose ${choice}, but the completed counters are Bubble ${totals[0]} and Merge ${totals[1]}. Compare the smaller count; both outputs are sorted.`)} type="button" aria-label={`Conclude ${choice}`}>{choice === "tie" ? "Same comparisons" : `${choice === "bubble" ? "Bubble" : "Merge"} used fewer`}</button>)}</div><small>Measured for these implementations and this list. Larger mixed lists usually favour merge sort; this exercise does not measure wall-clock speed.</small></div></div>;
}
export function AlgorithmOptimization(props: Props) {
  const p = usePractice(props); const task = sortTasks[Math.min(p.stage, 2)];
  return <PracticeShell props={props} stage={p.stage} eyebrow="Sorting laboratory" brief="Inspect the actual operations before choosing an algorithm." prompt={task.prompt} feedback={p.feedback} feedbackCorrect={p.feedbackCorrect} onFinish={p.finish} ready={p.ready} onContinue={p.continuePractice} art="lab"><SortingExercise key={p.stage} task={task} submit={p.submit} /></PracticeShell>;
}
