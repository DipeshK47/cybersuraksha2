"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Bot, Flag, MousePointerClick, Star, Target, Undo2, X } from "lucide-react";
import type { BinaryTask, GridTask, ModelTask, RouteTask } from "../../../../data/class8/types";
import type { buildTaskEvidence } from "./task-evidence";
import { simulateRoute, testModel } from "./task-evaluation";
import type { Band } from "./boards";
import { ui } from "./ui";
import b from "./boards.module.css";
import legacy from "./class8.module.css";

type Language = "en" | "hi";
type Common = { language: Language; band: Band; disabled: boolean; status: (id: string) => boolean | undefined };
const Hint = ({ children }: { children: ReactNode }) => <p className={b.hint}><MousePointerClick aria-hidden="true" />{children}</p>;

/** Signal lamps: eight switches with place values, a live total and a meter that fills toward the target. */
export function BinaryBoard({ task, answer, onChange, language, band, disabled, status }: Common & { task: BinaryTask; answer: string; onChange: (bits: string) => void }) {
  const bits = answer.length === 8 ? answer : "00000000";
  const total = parseInt(bits, 2) || 0;
  return <div className={b.board} data-band={band} data-kind="binary">
    <Hint>{ui.binaryHint[language]}</Hint>
    <p className={b.target}>{ui.target[language]}: <strong>{task.target}</strong></p>
    <div className={b.bits} role="group" aria-label={ui.lamp[language]}>{Array.from({ length: 8 }, (_, index) => {
      const on = bits[index] === "1", place = 2 ** (7 - index);
      return <button type="button" className={b.bit} key={index} aria-label={String(place)} aria-pressed={on} disabled={disabled} data-on={on} onClick={() => onChange(bits.slice(0, index) + (on ? "0" : "1") + bits.slice(index + 1))}>
        <span className={b.lamp} aria-hidden="true" /><span className={b.place}>{place}</span><b>{on ? 1 : 0}</b>
      </button>;
    })}</div>
    <div className={b.meter} data-correct={status("bits")} data-over={total > task.target}><span style={{ width: `${Math.min(100, task.target ? (total / task.target) * 100 : 0)}%` }} /></div>
    <p className={b.readout}>{ui.total[language]}: <strong>{total}</strong> / {task.target}</p>
  </div>;
}

/** Paint grid: tap squares, or hold the mouse and drag across several. Missed squares show after checking. */
export function GridBoard({ task, cells, onChange, language, band, disabled, status }: Common & { task: GridTask; cells: number[]; onChange: (cells: number[]) => void }) {
  /** true while the mouse paints squares in, false while it erases them, null when not dragging. */
  const [painting, setPainting] = useState<boolean | null>(null);
  const skipClick = useRef(false);
  useEffect(() => {
    if (painting === null) return;
    const stop = () => setPainting(null);
    window.addEventListener("pointerup", stop);
    return () => window.removeEventListener("pointerup", stop);
  }, [painting]);
  const apply = (cell: number, paint: boolean) => {
    const has = cells.includes(cell);
    if (paint && !has) onChange([...cells, cell]);
    if (!paint && has) onChange(cells.filter(id => id !== cell));
  };
  return <div className={b.board} data-band={band} data-kind="grid">
    <Hint>{ui.gridHint[language]}</Hint>
    <figure className={b.gridFigure}>
      <figcaption>{task.caption[language]}</figcaption>
      <div className={b.paintGrid} style={{ gridTemplateColumns: `repeat(${task.width}, minmax(0, 1fr))` }}>{Array.from({ length: task.width * task.height }, (_, cell) => {
        const blocked = Boolean(task.blocked?.includes(cell)), on = cells.includes(cell);
        const mark = on ? status(String(cell)) : status(`missing-${cell}`) === false ? false : undefined;
        return <button type="button" className={b.paintCell} key={cell} disabled={disabled || blocked} aria-pressed={on} data-blocked={blocked} data-correct={mark} data-missed={!on && mark === false}
          aria-label={`${ui.row[language]} ${Math.floor(cell / task.width) + 1}, ${ui.column[language].toLowerCase()} ${cell % task.width + 1}`}
          onPointerDown={event => {
            if (event.pointerType !== "mouse" || event.button !== 0) return;
            const paint = !on;
            skipClick.current = true;
            setPainting(paint);
            apply(cell, paint);
          }}
          onPointerEnter={() => { if (painting !== null) apply(cell, painting); }}
          onClick={() => { if (skipClick.current) { skipClick.current = false; return; } apply(cell, !on); }}>{blocked ? <X aria-hidden="true" /> : null}</button>;
      })}</div>
    </figure>
  </div>;
}

/** Robot route: a grid with start, goal and stops, a control pad, and the planned moves as chips. */
export function RouteBoard({ task, selected, onChange, tested, lines, language, band, disabled }: Pick<Common, "language" | "band" | "disabled"> & {
  task: RouteTask; selected: string[]; onChange: (moves: string[]) => void; tested: boolean; lines: ReturnType<typeof buildTaskEvidence>;
}) {
  const result = simulateRoute(task, selected);
  const pad = { up: ArrowUp, left: ArrowLeft, down: ArrowDown, right: ArrowRight } as const;
  const full = selected.length >= task.maxSteps;
  return <div className={b.board} data-band={band} data-kind="route">
    <Hint>{ui.routeHint[language]}</Hint>
    <div className={b.routeLayout}>
      <div className={b.routeGrid} aria-hidden="true" style={{ gridTemplateColumns: `repeat(${task.width}, minmax(0, 1fr))` }}>{Array.from({ length: task.width * task.height }, (_, cell) => {
        const blocked = task.blocked.includes(cell), robot = result.position === cell, stop = task.stops?.includes(cell);
        return <div className={b.routeCell} key={cell} data-blocked={blocked} data-visited={result.path.includes(cell)} data-robot={robot}>
          <span className={b.routeIcon}>{blocked ? <X /> : robot ? <Bot /> : cell === task.goal ? <Target /> : stop ? <Star /> : cell === task.start ? <Flag /> : null}</span>
          <small>{cell === task.start ? ui.started[language] : cell === task.goal ? ui.goal[language] : stop ? ui.stop[language] : ""}</small>
          {task.cellCosts && !blocked && <small translate="no">{ui.cellEntryCost[language]}: {task.cellCosts[String(cell)] ?? 1}</small>}
        </div>;
      })}</div>
      <div className={b.routeControls}>
        <div className={b.dpad}>{(["up", "left", "down", "right"] as const).map(id => {
          const Icon = pad[id];
          return <button type="button" className={b.dpadButton} data-direction={id} key={id} disabled={disabled || full} onClick={() => onChange([...selected, id])}><Icon aria-hidden="true" />{ui[id][language]}</button>;
        })}</div>
        <p className={b.stepCount}><strong>{selected.length} / {task.maxSteps}</strong> {ui.stepsUsed[language]}</p>
        <ol className={b.moves} aria-label={ui.plan[language]}>{selected.map((move, index) => {
          const Icon = pad[move as keyof typeof pad];
          return <li key={index}>{Icon ? <Icon aria-hidden="true" /> : null}<span>{index + 1}. {ui[move as "up" | "right" | "down" | "left"]?.[language]}</span></li>;
        })}</ol>
        <button type="button" className={b.undo} disabled={disabled || !selected.length} onClick={() => onChange(selected.slice(0, -1))}><Undo2 aria-hidden="true" />{ui.undo[language]}</button>
      </div>
    </div>
    {(task.cellCosts || task.maxCost != null) && <p className={b.routeCost} translate="no">{ui.routeCost[language]}: {result.cost}{task.maxCost != null && <> / {ui.costBudget[language]}: {task.maxCost}</>}. {ui.startFree[language]}</p>}
    {tested && <p role="status" className={legacy.result}>{result.valid ? ui.routeOk[language] : ui.routeFail[language]}{lines.slice(2).map(line => <span key={line.label.en} translate="no"> {line.label[language]}: {line.value[language]}.</span>)}</p>}
  </div>;
}

/** Model training: choose the examples the model learns from (cards), then compare predictions in the table. */
export function ModelBoard({ task, selected, onChange, tested, language, band, disabled }: Pick<Common, "language" | "band" | "disabled"> & { task: ModelTask; selected: string[]; onChange: (ids: string[]) => void; tested: boolean }) {
  const toggle = (id: string) => onChange(selected.includes(id) ? selected.filter(item => item !== id) : [...selected, id]);
  const labelOf = (id: string | null) => task.labels.find(label => label.id === id)?.label[language];
  return <div className={b.board} data-band={band} data-kind="model">
    <Hint>{ui.modelHint[language]}</Hint>
    <p className={b.note}>{ui.modelNote[language]}</p>
    <section className={b.pane}>
      <header><b>{ui.training[language]}</b><span>{selected.length} / {task.examples.length}</span></header>
      <p className={b.note}>{task.feature[language]}</p>
      <div className={b.examples}>{task.examples.map((row, index) => <label className={b.example} key={row.id} data-tone={index % 6} data-on={selected.includes(row.id)}>
        <input type="checkbox" checked={selected.includes(row.id)} disabled={disabled} onChange={() => toggle(row.id)} />
        <span className={b.exampleId}>{row.id}</span><span className={b.exampleValue}>{row.value}</span><span className={b.exampleLabel}>{labelOf(row.label)}</span>
      </label>)}</div>
    </section>
    <section className={b.pane}>
      <header><b>{task.checkRole === "validation" ? ui.validation[language] : ui.testing[language]}</b></header>
      <div className={legacy.tableWrap}><table><thead><tr><th>{task.feature[language]}</th><th>{ui.expected[language]}</th>{tested && <th>{ui.predicted[language]}</th>}</tr></thead>
        <tbody>{testModel(task, selected).map(row => <tr key={row.id}><td>{row.id} · {row.value}</td><td>{labelOf(row.expected)}</td>{tested && <td>{labelOf(row.predicted) ?? ui.uncertain[language]}</td>}</tr>)}</tbody></table></div>
    </section>
  </div>;
}
