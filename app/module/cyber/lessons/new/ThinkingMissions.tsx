"use client";

import { ArrowDown, ArrowRight, Bot, Play, RotateCcw } from "lucide-react";
import { useState } from "react";
import type { CyberLessonComponentProps } from "../../lesson-types";
import { PracticeShell, usePractice } from "./PracticeShell";
import s from "./practice.module.css";

type Props = CyberLessonComponentProps;
type ShapeName = "circle" | "square" | "triangle" | "diamond";
const shapes: ShapeName[] = ["circle", "square", "triangle", "diamond"];
const shapeColors: Record<ShapeName, string> = { circle: "#ee9f54", square: "#268b91", triangle: "#7a77c9", diamond: "#dd786e" };
function Shape({ name }: { name: ShapeName }) { return <span aria-label={name} className={s.shape} data-shape={name} role="img" style={{ "--shape-color": shapeColors[name] } as React.CSSProperties} />; }

const patterns: { track: ShapeName[]; answer: ShapeName; prompt: string }[] = [
  { track: ["circle", "square", "circle", "square", "circle"], answer: "square", prompt: "What comes next on the trolley track?" },
  { track: ["triangle", "triangle", "diamond", "triangle", "triangle"], answer: "diamond", prompt: "Look for the group that repeats. Which tile is missing?" },
  { track: ["circle", "square", "diamond", "circle", "square"], answer: "diamond", prompt: "One last repair: finish this three-tile pattern." },
];
export function PatternDetective(props: Props) {
  const practice = usePractice(props);
  const task = patterns[Math.min(practice.stage, 2)];
  return <PracticeShell props={props} stage={practice.stage} eyebrow="Pattern lab" brief="A pattern is a group that repeats. Repair each gap to move the trolley forward." prompt={task.prompt} feedback={practice.feedback} feedbackCorrect={practice.feedbackCorrect} onFinish={practice.finish} ready={practice.ready} onContinue={practice.continuePractice} art="station">
    <div className={s.track} aria-label={`Track: ${task.track.join(', ')}, missing tile`}>
      {task.track.map((shape, i) => <span className={s.trackTile} key={`${i}-${shape}`}><Shape name={shape} /></span>)}
      <span className={`${s.trackTile} ${practice.ready ? "" : s.missing}`} data-repaired={practice.ready} aria-label={practice.ready ? `Repaired tile: ${task.answer}` : "Missing tile"}>{practice.ready ? <Shape name={task.answer} /> : "?"}</span>
    </div>
    <p className={s.micro}>Choose the tile that makes the pattern repeat.</p>
    <div className={s.palette}>{shapes.map((shape) => <button className={s.tileButton} key={shape} onClick={() => practice.submit(shape === task.answer, shape === task.answer ? "Track repaired. You found the repeating group." : "Try grouping the tiles from the start, then match the next position.")} type="button" aria-label={`Choose ${shape}`}><Shape name={shape} /></button>)}</div>
  </PracticeShell>;
}

const routines = [
  { prompt: "Build a sensible school morning.", items: ["Put on shoes", "Wake up", "Brush teeth"], correct: ["Wake up", "Brush teeth", "Put on shoes"] },
  { prompt: "Pack for school in the right order.", items: ["Close the bag", "Check the timetable", "Put books in the bag"], correct: ["Check the timetable", "Put books in the bag", "Close the bag"] },
  { prompt: "Get ready to eat safely.", items: ["Eat lunch", "Dry your hands", "Wash your hands"], correct: ["Wash your hands", "Dry your hands", "Eat lunch"] },
];
function SequenceExercise({ task, onSubmit }: { task: (typeof routines)[number]; onSubmit: (correct: boolean) => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  return <div className={s.builder}>
    <div className={s.panel}><h3>Your routine · tap steps in order</h3><div className={s.stepSlots}>{[0, 1, 2].map((i) => <div className={s.slot} key={i}><b>{i + 1}</b>{selected[i] ?? "Choose a step"}</div>)}</div><div className={s.controls}><button className={s.secondary} onClick={() => setSelected((value) => value.slice(0, -1))} type="button" disabled={!selected.length}>Undo last step</button><button className={s.primary} onClick={() => onSubmit(selected.join("|") === task.correct.join("|"))} type="button" disabled={selected.length !== 3}><Play aria-hidden="true" /> Run routine</button></div></div>
    <div className={s.panel}><h3>Available steps</h3><div className={s.stepChoices}>{task.items.map((item) => <button className={s.choice} disabled={selected.includes(item)} key={item} onClick={() => setSelected((value) => [...value, item])} type="button"><ArrowRight aria-hidden="true" />{item}</button>)}</div><p className={s.micro}>A computer follows the order you give it, even when that order is inconvenient.</p></div>
  </div>;
}
export function StepByStepMorning(props: Props) {
  const practice = usePractice(props); const task = routines[Math.min(practice.stage, 2)];
  return <PracticeShell props={props} stage={practice.stage} eyebrow="Sequence studio" brief="Tap steps to make a program, then run it to see whether the order makes sense." prompt={task.prompt} feedback={practice.feedback} feedbackCorrect={practice.feedbackCorrect} onFinish={practice.finish} ready={practice.ready} onContinue={practice.continuePractice} art="morning">
    <SequenceExercise key={practice.stage} task={task} onSubmit={(correct) => practice.submit(correct, correct ? "That routine runs in a useful order." : "The order caused a problem. Undo steps and rebuild the routine from the beginning.")} />
  </PracticeShell>;
}

const flows = [
  { prompt: "Choose the shape for the first instruction.", before: ["Start"], blank: "Turn on the sensor", after: ["Hands detected?", "End"], answer: "Process" },
  { prompt: "Which block should check whether hands are under the tap?", before: ["Start", "Turn on the sensor"], blank: "Hands detected?", after: ["Dispense soap", "End"], answer: "Decision" },
  { prompt: "Finish the hand-washing station's flow.", before: ["Start", "Hands detected?", "Dispense soap"], blank: "Stop after rinsing", after: [], answer: "End" },
];
function flowKind(label: string) { if (label === "Start") return "start"; if (label === "End" || label.startsWith("Stop")) return "end"; if (label.endsWith("?")) return "decision"; return "process"; }
function FlowExercise({ task, stage, submit }: { task: (typeof flows)[number]; stage: number; submit: (correct: boolean) => void }) {
  const [selected, setSelected] = useState("");
  const [tested, setTested] = useState<string[]>([]);
  const [lastTest, setLastTest] = useState("");
  function runBranch(branch: "yes" | "no") {
    setTested((current) => current.includes(branch) ? current : [...current, branch]);
    setLastTest(branch === "yes" ? "Hands detected → dispense soap, rinse, then stop." : "No hands → wait; do not dispense soap.");
  }
  return <div className={s.builder}>
    <div className={s.panel}>
      <h3>Hand-washing station</h3>
      <div className={s.flow}>{[...task.before, task.blank, ...task.after].map((label, index) => <div className={s.flow} key={`${index}-${label}`}>{index ? <span className={s.flowArrow} aria-hidden="true" /> : null}<span className={`${s.flowNode} ${label === task.blank && !selected ? s.flowMissing : ""}`} data-kind={label === task.blank ? selected.toLowerCase() || undefined : flowKind(label)}>{label === task.blank ? selected ? `${selected}: ${label}` : `? ${label}` : label}</span></div>)}</div>
      {stage >= 1 ? <div className={s.flowBranch}><span>YES → Dispense soap</span><span>NO → Wait for hands</span></div> : null}
    </div>
    <div className={s.panel}>
      <h3>Build and test</h3>
      <div className={s.stepChoices}>{["Start", "Process", "Decision", "End"].map((kind) => <button aria-pressed={selected === kind} className={s.choice} key={kind} onClick={() => setSelected(kind)} type="button"><span className={s.flowNode} data-kind={kind.toLowerCase()}>{kind}</span></button>)}</div>
      {stage >= 1 ? <><p className={s.micro}>Run both sensor paths before checking the chart.</p><div className={s.controls}><button className={s.smallButton} onClick={() => runBranch("yes")} type="button">Test: hands detected</button><button className={s.smallButton} onClick={() => runBranch("no")} type="button">Test: no hands</button></div><p aria-live="polite" className={s.micro}>{lastTest || "No path tested yet."} {tested.length}/2 paths tested.</p></> : null}
      <div className={s.controls}><button className={s.primary} disabled={!selected || (stage >= 1 && tested.length < 2)} onClick={() => submit(selected === task.answer)} type="button"><Play aria-hidden="true" /> Check chart</button></div>
    </div>
  </div>;
}
export function FlowchartArchitect(props: Props) {
  const practice = usePractice(props); const task = flows[Math.min(practice.stage, 2)];
  return <PracticeShell props={props} stage={practice.stage} eyebrow="Flowchart workshop" brief="A flowchart shows what happens next. A diamond asks a question; a rectangle performs an action." prompt={task.prompt} feedback={practice.feedback} feedbackCorrect={practice.feedbackCorrect} onFinish={practice.finish} ready={practice.ready} onContinue={practice.continuePractice} art="lab">
    <FlowExercise key={practice.stage} task={task} stage={practice.stage} submit={(correct) => practice.submit(correct, correct ? practice.stage === 0 ? "The sensor action belongs in a process block." : "The chart handles the station correctly. Both paths have a purpose." : "That block does not match the action. Check whether it asks, acts, starts, or ends.")} />
  </PracticeShell>;
}

const loops = [
  { prompt: "The cleaner moves right four times. Replace the long list with one loop.", count: 4, command: "MOVE RIGHT" },
  { prompt: "The robot washes six desks. How many repetitions does it need?", count: 6, command: "CLEAN DESK" },
  { prompt: "The robot checks three doors. Compress its last program.", count: 3, command: "CHECK DOOR" },
];
function LoopExercise({ task, submit }: { task: (typeof loops)[number]; submit: (correct: boolean) => void }) {
  const [count, setCount] = useState<number | null>(null); const [ran, setRan] = useState(false);
  return <div className={s.builder}><div className={s.panel}><h3>Original program</h3><div className={s.commandStrip}>{Array.from({ length: task.count }, (_, i) => <span className={s.command} key={i}>{task.command}</span>)}</div><p className={s.micro}>{task.count} lines for one repeated action.</p><div className={s.robotGrid} aria-label="Robot work area">{Array.from({ length: 15 }, (_, i) => <span className={s.robotCell} data-active={ran && i < (count ?? 0)} key={i}>{i === 0 ? <Bot aria-hidden="true" /> : null}</span>)}</div></div><div className={s.panel}><h3>Build a shorter program</h3><div className={s.codeBoard}>REPEAT {count ?? "?"} TIMES<br />&nbsp;&nbsp;{task.command}</div><p className={s.micro}>Tap a repeat count, then run the program.</p><div className={s.palette}>{[2, 3, 4, 5, 6, 7].map((value) => <button aria-pressed={count === value} className={s.tileButton} key={value} onClick={() => { setCount(value); setRan(false); }} type="button">{value}</button>)}</div><div className={s.controls}><button className={s.primary} disabled={count === null} onClick={() => { setRan(true); submit(count === task.count); }} type="button"><Play aria-hidden="true" /> Run loop</button></div><p className={s.micro}>{ran ? `The robot performed ${count} actions. The original performed ${task.count}.` : "The short program must do exactly the same work."}</p></div></div>;
}
export function LoopInspector(props: Props) {
  const practice = usePractice(props); const task = loops[Math.min(practice.stage, 2)];
  return <PracticeShell props={props} stage={practice.stage} eyebrow="Robot code lab" brief="A loop repeats a command without writing the same line again and again." prompt={task.prompt} feedback={practice.feedback} feedbackCorrect={practice.feedbackCorrect} onFinish={practice.finish} ready={practice.ready} onContinue={practice.continuePractice} art="lab">
    <LoopExercise key={practice.stage} task={task} submit={(correct) => practice.submit(correct, correct ? "Same result, shorter program. Your loop is efficient." : "The robot stopped in the wrong place. Match the original number of actions.")} />
  </PracticeShell>;
}

const logicTasks = [
  { prompt: "Choose the condition that marks a score of 40 or more as a pass.", input: "scores = [38, 40, 74]", line: "IF ____:", options: ["score >= 40", "score > 40", "score == 40"], answer: "score >= 40", output: "38: retry · 40: pass · 74: pass" },
  { prompt: "Choose nested loops that check every score in every class.", input: "classes = [[52, 71], [29, 40]]", line: "____\n    IF score >= 40:", options: ["FOR EACH class IN classes:\n  FOR EACH score IN class:", "FOR EACH score IN classes:", "PRINT classes"], answer: "FOR EACH class IN classes:\n  FOR EACH score IN class:", output: "52: pass · 71: pass · 29: retry · 40: pass" },
  { prompt: "Add the second condition: award distinction only for scores of 75 or more.", input: "scores = [74, 75, 91]", line: "FOR EACH score IN scores:\n  IF score >= 40:\n    ____", options: ["IF score >= 75: PRINT distinction", "IF score > 75: PRINT distinction", "PRINT distinction"], answer: "IF score >= 75: PRINT distinction", output: "74: pass · 75: distinction · 91: distinction" },
];
function LogicExercise({ task, submit }: { task: (typeof logicTasks)[number]; submit: (correct: boolean) => void }) {
  const [selected, setSelected] = useState(""); const [ran, setRan] = useState(false);
  return <div className={s.builder}><div className={s.panel}><h3>Grade processor</h3><div className={s.codeBoard}><span className={s.codeLine}>{task.input}</span>{task.line.split("\n").map((line, i) => <span className={line.includes("____") ? s.codeBlank : s.codeLine} key={i}>{line.replace("____", selected || "____")}</span>)}</div><div className={s.controls}><button className={s.primary} disabled={!selected} onClick={() => { setRan(true); submit(selected === task.answer); }} type="button"><Play aria-hidden="true" /> Run test cases</button></div>{ran ? <p className={s.result}>{selected === task.answer ? task.output : "One or more boundary cases failed. Check the line and run again."}</p> : null}</div><div className={s.panel}><h3>Choose a code line</h3><div className={s.stepChoices}>{task.options.map((option) => <button aria-pressed={selected === option} className={s.choice} key={option} onClick={() => { setSelected(option); setRan(false); }} type="button"><span className={s.command}>{option}</span></button>)}</div><p className={s.micro}>Watch the boundary numbers closely. One changed sign can change a student&apos;s result.</p></div></div>;
}
export function ComplexAlgorithmicLogic(props: Props) {
  const practice = usePractice(props); const task = logicTasks[Math.min(practice.stage, 2)];
  return <PracticeShell props={props} stage={practice.stage} eyebrow="Algorithm debugger" brief="Run each line against sample scores. Inspect the boundary cases before you decide the logic is correct." prompt={task.prompt} feedback={practice.feedback} feedbackCorrect={practice.feedbackCorrect} onFinish={practice.finish} ready={practice.ready} onContinue={practice.continuePractice} art="lab">
    <LogicExercise key={practice.stage} task={task} submit={(correct) => practice.submit(correct, correct ? "All test cases passed. The condition handles the boundary correctly." : "The test failed. Look for the score exactly on the boundary and revise the line.")} />
  </PracticeShell>;
}

function bubbleComparisons(source: number[]) { const data = [...source]; let comparisons = 0; for (let end = data.length - 1; end > 0; end--) { let swapped = false; for (let i = 0; i < end; i++) { comparisons++; if (data[i] > data[i + 1]) { [data[i], data[i + 1]] = [data[i + 1], data[i]]; swapped = true; } } if (!swapped) break; } return comparisons; }
function mergeComparisons(source: number[]): number { let comparisons = 0; function sort(data: number[]): number[] { if (data.length <= 1) return data; const middle = Math.floor(data.length / 2); const left = sort(data.slice(0, middle)); const right = sort(data.slice(middle)); const out: number[] = []; let a = 0, b = 0; while (a < left.length && b < right.length) { comparisons++; out.push(left[a] <= right[b] ? left[a++] : right[b++]); } return [...out, ...left.slice(a), ...right.slice(b)]; } sort(source); return comparisons; }
const sortTasks = [
  { prompt: "Run both algorithms on a list that is already sorted.", data: [1, 2, 3, 4], hint: "Small, sorted list" },
  { prompt: "Run both algorithms on a reversed list.", data: [8, 7, 6, 5, 4, 3, 2, 1], hint: "Eight items, reversed" },
  { prompt: "Try a larger mixed list. Which method uses fewer comparisons?", data: [12, 4, 9, 2, 11, 6, 1, 8, 3, 10, 5, 7], hint: "Twelve mixed items" },
];
function SortingRaceExercise({ task, submit }: { task: (typeof sortTasks)[number]; submit: (correct: boolean) => void }) {
  const [ran, setRan] = useState(false); const bubble = bubbleComparisons(task.data); const merge = mergeComparisons(task.data); const winner = bubble < merge ? "bubble" : merge < bubble ? "merge" : "tie";
  const displayData = ran ? [...task.data].sort((a, b) => a - b) : task.data;
  return <div className={s.builder}><div className={s.panel}><h3>{task.hint}</h3><div className={s.bars} aria-label={`${ran ? "Sorted" : "Unsorted"} numbers: ${displayData.join(', ')}`}>{displayData.map((value, i) => <span className={s.bar} key={`${i}-${value}`} style={{ height: `${value * 8}%` }} title={String(value)} />)}</div><div className={s.controls}><button className={s.primary} onClick={() => setRan(true)} type="button"><Play aria-hidden="true" /> Run both sorts</button><button className={s.secondary} onClick={() => setRan(false)} type="button"><RotateCcw aria-hidden="true" /> Reset</button></div></div><div className={s.panel}><h3>Comparison counter</h3><div className={s.metricRow}><div className={s.metric}><strong>{ran ? bubble : "—"}</strong><span>Bubble sort</span></div><div className={s.metric}><strong>{ran ? merge : "—"}</strong><span>Merge sort</span></div></div><p className={s.micro}>Compare the work, not just the final order. {ran && task.data.length >= 12 ? "As lists grow, bubble sort often needs roughly n² comparisons while merge sort grows roughly n log n." : ""}</p><div className={s.choiceGrid}>{["bubble", "merge", "tie"].map((choice) => <button className={s.choice} disabled={!ran} key={choice} onClick={() => submit(choice === winner)} type="button"><ArrowDown aria-hidden="true" />{choice === "tie" ? "Same number of comparisons" : `${choice[0].toUpperCase()}${choice.slice(1)} sort used fewer`}</button>)}</div></div></div>;
}
export function AlgorithmOptimization(props: Props) {
  const practice = usePractice(props); const task = sortTasks[Math.min(practice.stage, 2)];
  return <PracticeShell props={props} stage={practice.stage} eyebrow="Sorting race" brief="Both algorithms sort correctly. Run them and compare how many number comparisons each uses." prompt={task.prompt} feedback={practice.feedback} feedbackCorrect={practice.feedbackCorrect} onFinish={practice.finish} ready={practice.ready} onContinue={practice.continuePractice} art="lab">
    <SortingRaceExercise key={practice.stage} task={task} submit={(correct) => practice.submit(correct, correct ? "You used the measured evidence. Larger lists can make the difference much clearer." : "Look again at both counters. The smaller number used less work on this list.")} />
  </PracticeShell>;
}
