"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Check, FlaskConical, RotateCcw } from "lucide-react";
import type { Class8Task, TaskAnswer } from "../../../../data/class8/types";
import { buildTaskEvidence } from "./task-evidence";
import { simulateRoute, testModel, testPermissions } from "./task-evaluation";
import { makeTaskSimulation, type TaskSimulationSnapshot } from "./task-simulation";
import { ui, useEvidenceLanguage } from "./ui";
import s from "./class8.module.css";

export function initialAnswer(task: Class8Task): TaskAnswer {
  if (task.kind === "binary") return "00000000";
  if (task.kind === "model") return [...task.initialTraining];
  if (["select", "order", "grid", "route"].includes(task.kind)) return [];
  return task.kind === "choice" ? "" : {};
}

export function TaskBoard({ task, answer, onChange: changeAnswer, onCheck, disabled = false, onSimulationChange }: {
  task: Class8Task; answer: TaskAnswer; onChange: (answer: TaskAnswer) => void; onCheck: () => void; disabled?: boolean; onSimulationChange?: (snapshot: TaskSimulationSnapshot | null) => void;
}) {
  const evidenceLanguage = useEvidenceLanguage();
  const [testRun, setTestRun] = useState<{ configuration: string; snapshot: TaskSimulationSnapshot } | null>(null);
  const configuration = JSON.stringify(task);
  const simulationListener = useRef(onSimulationChange);
  useEffect(() => { simulationListener.current = onSimulationChange; });
  const selected = Array.isArray(answer) ? answer as string[] : [];
  const values = typeof answer === "object" && !Array.isArray(answer) ? answer : {};
  const serialized = JSON.stringify(answer);
  const snapshot = testRun?.configuration === configuration && testRun.snapshot.fingerprint === serialized ? testRun.snapshot : null;
  const tested = snapshot !== null;
  // Once an input/configuration changes, returning to an old answer still requires a new test.
  if (testRun && (testRun.configuration !== configuration || testRun.snapshot.fingerprint !== serialized)) setTestRun(null);
  useEffect(() => { simulationListener.current?.(snapshot); }, [snapshot]);
  useEffect(() => () => { simulationListener.current?.(null); }, []);
  function onChange(value: TaskAnswer) { setTestRun(null); changeAnswer(value); }
  function runTest() {
    const snapshot = makeTaskSimulation(task, answer);
    setTestRun(snapshot ? { configuration, snapshot } : null);
  }
  const needsTest = task.kind === "route" || task.kind === "model" || (task.kind === "match" && task.presentation === "permissions");
  const toggle = (id: string) => onChange(selected.includes(id) ? selected.filter(item => item !== id) : [...selected, id]);
  const checkButton = <button className={s.primary} type="button" disabled={disabled || (needsTest && !tested)} onClick={onCheck}><Check aria-hidden="true" />{ui.check[evidenceLanguage]}</button>;

  return <div className={s.task} data-task-kind={task.kind} translate="no">
    <div className={s.case}><span>{ui.source[evidenceLanguage]}</span><p>{task.context[evidenceLanguage]}</p></div>
    {task.kind === "choice" && <div className={s.choices}>{task.options.map(option => <button type="button" className={s.choice} aria-pressed={answer === option.id} disabled={disabled} key={option.id} onClick={() => onChange(option.id)}>{option.label[evidenceLanguage]}</button>)}</div>}
    {task.kind === "select" && <div className={task.presentation === "redact" ? s.redaction : s.choices}>{task.items.map(item => <label className={s.selection} key={item.id}><input type="checkbox" disabled={disabled} checked={selected.includes(item.id)} onChange={() => toggle(item.id)} /><span>{item.label[evidenceLanguage]}{task.presentation === "redact" && <small>{selected.includes(item.id) ? ui.hidden[evidenceLanguage] : ui.visible[evidenceLanguage]}</small>}</span></label>)}</div>}
    {task.kind === "match" && <div className={s.matches} data-presentation={task.presentation}>{task.rows.map(row => <label className={s.match} key={row.id}><span>{row.label[evidenceLanguage]}</span><select value={values[row.id] ?? ""} disabled={disabled} onChange={event => onChange({ ...values, [row.id]: event.target.value })}><option value="">{ui.choose[evidenceLanguage]}</option>{task.options.map(option => <option value={option.id} key={option.id}>{option.label[evidenceLanguage]}</option>)}</select></label>)}</div>}
    {task.kind === "order" && <div className={s.sequence}><ol aria-label={ui.plan[evidenceLanguage]}>{task.expected.map((_, index) => <li key={index}><b>{index + 1}</b><span>{task.items.find(item => item.id === selected[index])?.label[evidenceLanguage] ?? "…"}</span></li>)}</ol><div className={s.choices}>{[...task.items].reverse().map(item => <button type="button" className={s.choice} key={item.id} disabled={disabled || selected.includes(item.id)} onClick={() => onChange([...selected, item.id])}>{item.label[evidenceLanguage]}</button>)}</div><button className={s.secondary} type="button" disabled={disabled || !selected.length} onClick={() => onChange(selected.slice(0, -1))}><RotateCcw aria-hidden="true" />{ui.undo[evidenceLanguage]}</button></div>}
    {task.kind === "number" && <div className={s.matches}>{task.fields.map(field => <label className={s.match} key={field.id}><span>{field.label[evidenceLanguage]}</span><input type="number" inputMode="decimal" step="any" value={values[field.id] ?? ""} min={field.min} max={field.max} disabled={disabled} onChange={event => onChange({ ...values, [field.id]: event.target.value })} /></label>)}</div>}
    {task.kind === "binary" && <div className={s.signal}><p>{ui.target[evidenceLanguage]}: <strong>{task.target}</strong></p><div className={s.lamps} role="group" aria-label={ui.lamp[evidenceLanguage]}>{Array.from({ length: 8 }, (_, index) => {
      const bits = typeof answer === "string" && answer.length === 8 ? answer : "00000000";
      const on = bits[index] === "1";
      return <button type="button" key={index} aria-label={String(2 ** (7 - index))} aria-pressed={on} disabled={disabled} data-on={on} onClick={() => onChange(bits.slice(0, index) + (on ? "0" : "1") + bits.slice(index + 1))}><span aria-hidden="true" />{2 ** (7 - index)}<b>{on ? 1 : 0}</b></button>;
    })}</div><p className={s.readout}>{ui.total[evidenceLanguage]}: {parseInt(typeof answer === "string" ? answer : "0", 2) || 0}</p></div>}
    {task.kind === "grid" && <figure className={s.gridBoard}><figcaption>{task.caption[evidenceLanguage]}</figcaption><div className={s.grid} style={{ gridTemplateColumns: `repeat(${task.width}, minmax(0, 1fr))` }}>{Array.from({ length: task.width * task.height }, (_, cell) => {
      const cells = Array.isArray(answer) ? answer as number[] : [];
      const blocked = Boolean(task.blocked?.includes(cell));
      return <button type="button" key={cell} aria-label={`${ui.row[evidenceLanguage]} ${Math.floor(cell / task.width) + 1}, ${ui.column[evidenceLanguage].toLowerCase()} ${cell % task.width + 1}`} aria-pressed={cells.includes(cell)} data-blocked={blocked} disabled={disabled || blocked} onClick={() => onChange(cells.includes(cell) ? cells.filter(id => id !== cell) : [...cells, cell])}>{blocked ? "×" : cells.includes(cell) ? "●" : "·"}</button>;
    })}</div></figure>}
    {task.kind === "route" && (() => {
      const result = simulateRoute(task, selected);
      return <div className={s.robot}><div className={s.grid} aria-hidden="true" style={{ gridTemplateColumns: `repeat(${task.width}, minmax(0, 1fr))` }}>{Array.from({ length: task.width * task.height }, (_, cell) => <div className={s.robotCell} data-blocked={task.blocked.includes(cell)} data-visited={result.path.includes(cell)} key={cell}><span>{task.blocked.includes(cell) ? "×" : result.position === cell ? "◆" : cell === task.goal ? "◎" : task.stops?.includes(cell) ? "★" : "·"}</span><small>{cell === task.start ? ui.started[evidenceLanguage] : cell === task.goal ? ui.goal[evidenceLanguage] : task.stops?.includes(cell) ? ui.stop[evidenceLanguage] : ""}</small>{task.cellCosts && !task.blocked.includes(cell) && <small translate="no">{ui.cellEntryCost[evidenceLanguage]}: {task.cellCosts[String(cell)] ?? 1}</small>}</div>)}</div>{(task.cellCosts || task.maxCost != null) && <p translate="no">{ui.routeCost[evidenceLanguage]}: {result.cost}{task.maxCost != null && <> / {ui.costBudget[evidenceLanguage]}: {task.maxCost}</>}. {ui.startFree[evidenceLanguage]}</p>}<div className={s.directions}>{([["up", ArrowUp], ["left", ArrowLeft], ["down", ArrowDown], ["right", ArrowRight]] as const).map(([id, Icon]) => <button type="button" className={s.secondary} key={id} disabled={disabled || selected.length >= task.maxSteps} onClick={() => onChange([...selected, id])}><Icon aria-hidden="true" />{ui[id][evidenceLanguage]}</button>)}</div><ol className={s.moveList} aria-label={ui.plan[evidenceLanguage]}>{selected.map((move, index) => <li key={index}>{index + 1}. {ui[move as "up" | "right" | "down" | "left"]?.[evidenceLanguage]}</li>)}</ol><p>{selected.length} / {task.maxSteps}</p><button type="button" className={s.secondary} disabled={disabled || !selected.length} onClick={() => onChange(selected.slice(0, -1))}>{ui.undo[evidenceLanguage]}</button>{tested && <p role="status" className={s.result}>{result.valid ? ui.routeOk[evidenceLanguage] : ui.routeFail[evidenceLanguage]}{buildTaskEvidence(task, answer).slice(2).map(line => <span key={line.label.en} translate="no"> {line.label[evidenceLanguage]}: {line.value[evidenceLanguage]}.</span>)}</p>}</div>;
    })()}
    {task.kind === "model" && <div className={s.model}><p>{ui.modelNote[evidenceLanguage]}</p><h3>{ui.training[evidenceLanguage]}</h3><p>{task.feature[evidenceLanguage]}</p><div className={s.choices}>{task.examples.map(row => <label className={s.selection} key={row.id}><input type="checkbox" checked={selected.includes(row.id)} disabled={disabled} onChange={() => toggle(row.id)} /><span>{row.id} · {row.value} · {task.labels.find(label => label.id === row.label)?.label[evidenceLanguage]}</span></label>)}</div><h3>{task.checkRole === "validation" ? ui.validation[evidenceLanguage] : ui.testing[evidenceLanguage]}</h3><div className={s.tableWrap}><table><thead><tr><th>{task.feature[evidenceLanguage]}</th><th>{ui.expected[evidenceLanguage]}</th>{tested && <th>{ui.predicted[evidenceLanguage]}</th>}</tr></thead><tbody>{testModel(task, selected).map(row => <tr key={row.id}><td>{row.id} · {row.value}</td><td>{task.labels.find(label => label.id === row.expected)?.label[evidenceLanguage]}</td>{tested && <td>{task.labels.find(label => label.id === row.predicted)?.label[evidenceLanguage] ?? ui.uncertain[evidenceLanguage]}</td>}</tr>)}</tbody></table></div></div>}
    {needsTest && <button type="button" className={s.secondary} disabled={disabled} onClick={runTest}><FlaskConical aria-hidden="true" />{ui.test[evidenceLanguage]}</button>}
    {tested && task.kind === "match" && task.presentation === "permissions" && <div className={s.result} role="status"><h3>{ui.preview[evidenceLanguage]}</h3>{testPermissions(task, values).map(test => <p key={test.label.en}><strong>{test.label[evidenceLanguage]}</strong><br />{test.result[evidenceLanguage]}</p>)}</div>}
    <div className={s.actions}>{checkButton}</div>
  </div>;
}
