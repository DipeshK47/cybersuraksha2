"use client";

import { useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, Check, GripVertical, Minus, MousePointerClick, Plus, X } from "lucide-react";
import type { ChoiceTask, MatchTask, NumberTask, OrderTask, SelectTask } from "../../../../data/class8/types";
import { DragLayer, useDragDrop } from "./practice-dnd";
import { ui } from "./ui";
import s from "./boards.module.css";

type Language = "en" | "hi";
/** Classes 6-7 get the playful look; Classes 8-10 get the quieter evidence-board look. */
export type Band = "junior" | "senior";
/** true: this card is right. false: it is wrong. undefined: not checked yet. */
type Mark = boolean | undefined;
type Common = { language: Language; band: Band; disabled: boolean; status: (id: string) => Mark };

const TONES = 6;
const MarkIcon = ({ mark, language }: { mark: Mark; language: Language }) => mark === undefined ? null
  : <span className={s.mark} data-correct={mark} title={mark ? ui.correct[language] : ui.tryAgain[language]}>{mark ? <Check aria-hidden="true" /> : <X aria-hidden="true" />}<span className={s.srOnly}>{mark ? ui.correct[language] : ui.tryAgain[language]}</span></span>;
const Hint = ({ children }: { children: ReactNode }) => <p className={s.hint}><MousePointerClick aria-hidden="true" />{children}</p>;

/** Match the following: drag an answer onto its row (or tap the answer, then the row). */
export function MatchBoard({ task, values, onChange, language, band, disabled, status }: Common & { task: MatchTask; values: Record<string, string>; onChange: (values: Record<string, string>) => void }) {
  const [held, setHeld] = useState<string | null>(null);
  const label = (id: string) => task.options.find(option => option.id === id)?.label[language] ?? id;
  const toneOf = (id: string) => Math.max(0, task.options.findIndex(option => option.id === id)) % TONES;
  const assign = (optionId: string, rowId: string, from?: string) => {
    const next = { ...values };
    if (from?.startsWith("row:")) delete next[from.slice(4)];
    next[rowId] = optionId;
    onChange(next);
    setHeld(null);
  };
  const clear = (rowId: string) => { const next = { ...values }; delete next[rowId]; onChange(next); };
  const { begin, ghost, over, wasDragged } = useDragDrop((optionId, from, zone) => {
    if (disabled) return;
    if (zone.startsWith("row:")) assign(optionId, zone.slice(4), from);
    else if (zone === "bank" && from.startsWith("row:")) clear(from.slice(4));
  });
  const chip = (optionId: string, from: string, onTap: () => void, isHeld = false) => (
    <button type="button" className={s.chip} data-tone={toneOf(optionId)} data-held={isHeld} disabled={disabled}
      onPointerDown={event => begin(event, optionId, from, <span className={s.chip} data-tone={toneOf(optionId)}>{label(optionId)}</span>)}
      onClick={() => { if (!wasDragged()) onTap(); }}>
      <span className={s.grip} data-grip><GripVertical aria-hidden="true" /></span><span className={s.chipText}>{label(optionId)}</span>
    </button>
  );
  return <div className={s.board} data-band={band} data-kind="match">
    <Hint>{ui.matchHint[language]}</Hint>
    <div className={s.bank} data-drop-zone="bank" data-over={over === "bank"} aria-label={ui.answersBank[language]}>
      <b>{ui.answersBank[language]}</b>
      <div className={s.chips}>{task.options.map(option => <span key={option.id}>{chip(option.id, "bank", () => setHeld(current => current === option.id ? null : option.id), held === option.id)}</span>)}</div>
    </div>
    <div className={s.rows}>{task.rows.map(row => {
      const zone = `row:${row.id}`, assigned = values[row.id];
      return <div className={s.row} key={row.id} data-correct={status(row.id)}>
        <div className={s.rowLabel}>{row.label[language]}</div>
        <div className={s.slot} data-drop-zone={zone} data-over={over === zone} data-ready={held !== null && !disabled} data-filled={Boolean(assigned)}
          onClick={event => { if (held && !disabled && !(event.target as HTMLElement).closest("[data-remove]")) assign(held, row.id); }}>
          {assigned
            ? <>{chip(assigned, zone, () => { if (held) assign(held, row.id); })}<button type="button" className={s.iconButton} data-remove disabled={disabled} aria-label={`${ui.remove[language]}: ${row.label[language]}`} onClick={() => clear(row.id)}><X aria-hidden="true" /></button></>
            : <button type="button" className={s.slotButton} disabled={disabled || !held} onClick={() => held && assign(held, row.id)}>{held ? ui.tapToPlace[language] : ui.dropAnswer[language]}</button>}
        </div>
        <MarkIcon mark={status(row.id)} language={language} />
      </div>;
    })}</div>
    <DragLayer ghost={ghost} band={band} />
  </div>;
}

/** Sort cards into your answer: drag them into the tray (or tap a card to move it). */
export function SortBoard({ task, selected, onChange, language, band, disabled, status }: Common & { task: SelectTask; selected: string[]; onChange: (ids: string[]) => void }) {
  const move = (id: string, into: boolean) => onChange(into ? (selected.includes(id) ? selected : [...selected, id]) : selected.filter(item => item !== id));
  const { begin, ghost, over, wasDragged } = useDragDrop((id, _from, zone) => { if (!disabled && (zone === "tray" || zone === "bank")) move(id, zone === "tray"); });
  const bank = task.items.filter(item => !selected.includes(item.id));
  const tray = selected.map(id => task.items.find(item => item.id === id)).filter((item): item is SelectTask["items"][number] => Boolean(item));
  const card = (item: SelectTask["items"][number], inTray: boolean) => {
    const index = task.items.findIndex(row => row.id === item.id) % TONES;
    const mark = inTray ? status(item.id) : status(`missing-${item.id}`) === false ? false : undefined;
    return <button type="button" className={s.card} key={item.id} data-tone={index} data-in-tray={inTray} data-correct={mark} data-missed={!inTray && mark === false} disabled={disabled}
      onPointerDown={event => begin(event, item.id, inTray ? "tray" : "bank", <span className={s.card} data-tone={index}><span>{item.label[language]}</span></span>)}
      onClick={() => { if (!wasDragged()) move(item.id, !inTray); }}>
      <span className={s.grip} data-grip><GripVertical aria-hidden="true" /></span>
      <span className={s.cardText}>{item.label[language]}</span>
      {!inTray && mark === false ? <span className={s.badge}>{ui.missed[language]}</span> : null}
      <span className={s.cardAction} aria-hidden="true">{inTray ? <X /> : <Plus />}</span>
    </button>;
  };
  return <div className={s.board} data-band={band} data-kind="select">
    <Hint>{ui.sortHint[language]}</Hint>
    <div className={s.twoPanes}>
      <section className={s.pane} data-drop-zone="bank" data-over={over === "bank"} aria-label={ui.cardsBank[language]}>
        <header><b>{ui.cardsBank[language]}</b><span>{bank.length}</span></header>
        <div className={s.cards}>{bank.length ? bank.map(item => card(item, false)) : <p className={s.empty}>{ui.bankEmpty[language]}</p>}</div>
      </section>
      <section className={s.pane} data-tray="true" data-drop-zone="tray" data-over={over === "tray"} aria-label={ui.yourAnswer[language]} data-answer-workspace>
        <header><b>{ui.yourAnswer[language]}</b><span>{tray.length} {ui.chosen[language]}</span></header>
        <div className={s.cards}>{tray.length ? tray.map(item => card(item, true)) : <p className={s.empty}>{ui.trayEmpty[language]}</p>}</div>
      </section>
    </div>
    <DragLayer ghost={ghost} band={band} />
  </div>;
}

/** Put the steps in order: drag them into numbered slots and reorder by dragging (or use the arrow buttons). */
export function OrderBoard({ task, selected, onChange, language, band, disabled, status }: Common & { task: OrderTask; selected: string[]; onChange: (ids: string[]) => void }) {
  const slots = task.expected.length;
  const label = (id: string) => task.items.find(item => item.id === id)?.label[language] ?? id;
  const toneOf = (id: string) => Math.max(0, task.items.findIndex(item => item.id === id)) % TONES;
  const insert = (id: string, index: number) => {
    const next = selected.filter(item => item !== id);
    next.splice(Math.min(index, next.length), 0, id);
    if (next.length <= slots) onChange(next);
  };
  const swap = (index: number, by: -1 | 1) => { const next = [...selected]; [next[index], next[index + by]] = [next[index + by], next[index]]; onChange(next); };
  const { begin, ghost, over, wasDragged } = useDragDrop((id, _from, zone, index) => {
    if (disabled) return;
    if (zone.startsWith("slot:")) insert(id, index ?? Number(zone.slice(5)));
    else if (zone === "bank" && selected.includes(id)) onChange(selected.filter(item => item !== id));
  });
  const bank = task.items.filter(item => !selected.includes(item.id));
  const full = selected.length >= slots;
  const body = (id: string) => <><span className={s.grip} data-grip><GripVertical aria-hidden="true" /></span><span className={s.cardText}>{label(id)}</span></>;
  return <div className={s.board} data-band={band} data-kind="order">
    <Hint>{ui.orderHint[language]}</Hint>
    <div className={s.twoPanes}>
      <section className={s.pane} data-drop-zone="bank" data-over={over === "bank"} aria-label={ui.stepsBank[language]}>
        <header><b>{ui.stepsBank[language]}</b><span>{bank.length}</span></header>
        <div className={s.cards}>{bank.length ? bank.map(item => <button type="button" className={s.card} key={item.id} data-tone={toneOf(item.id)} disabled={disabled || full}
          onPointerDown={event => begin(event, item.id, "bank", <span className={s.card} data-tone={toneOf(item.id)}><span>{label(item.id)}</span></span>)}
          onClick={() => { if (!wasDragged() && !full) onChange([...selected, item.id]); }}>{body(item.id)}<span className={s.cardAction} aria-hidden="true"><Plus /></span></button>) : <p className={s.empty}>{ui.stepsEmpty[language]}</p>}</div>
      </section>
      <section className={s.pane} aria-label={ui.plan[language]}>
        <header><b>{ui.plan[language]}</b><span>{selected.length} / {slots}</span></header>
        <ol className={s.timeline}>{Array.from({ length: slots }, (_, index) => {
          const id = selected[index], zone = `slot:${index}`;
          return <li key={index} className={s.step} data-correct={id ? status(`step-${index + 1}`) : undefined} data-drop-zone={zone} data-drop-index={index} data-over={over === zone} data-filled={Boolean(id)}>
            <b className={s.stepNumber}>{index + 1}</b>
            {id
              ? <div className={s.card} data-tone={toneOf(id)} data-in-tray="true" onPointerDown={event => begin(event, id, zone, <span className={s.card} data-tone={toneOf(id)}><span>{label(id)}</span></span>)}>
                {body(id)}
                <span className={s.stepTools}>
                  <button type="button" className={s.iconButton} disabled={disabled || index === 0} aria-label={`${ui.moveUp[language]}: ${label(id)}`} onClick={() => swap(index, -1)}><ArrowUp aria-hidden="true" /></button>
                  <button type="button" className={s.iconButton} disabled={disabled || index === selected.length - 1} aria-label={`${ui.moveDown[language]}: ${label(id)}`} onClick={() => swap(index, 1)}><ArrowDown aria-hidden="true" /></button>
                  <button type="button" className={s.iconButton} data-remove disabled={disabled} aria-label={`${ui.remove[language]}: ${label(id)}`} onClick={() => onChange(selected.filter(item => item !== id))}><X aria-hidden="true" /></button>
                </span>
              </div>
              : <span className={s.stepEmpty}>{ui.step[language]} {index + 1}</span>}
            <MarkIcon mark={id ? status(`step-${index + 1}`) : undefined} language={language} />
          </li>;
        })}</ol>
      </section>
    </div>
    <DragLayer ghost={ghost} band={band} />
  </div>;
}

/** Scenario choice: big option cards with a letter badge; after checking, each card shows its own result. */
export function ChoiceBoard({ task, answer, onChange, language, band, disabled, status }: Common & { task: ChoiceTask; answer: string; onChange: (id: string) => void }) {
  return <div className={s.board} data-band={band} data-kind="choice">
    <Hint>{ui.choiceHint[language]}</Hint>
    <div className={s.options} role="group">{task.options.map((option, index) => <button type="button" className={s.option} key={option.id} data-tone={index % TONES} aria-pressed={answer === option.id} data-correct={answer === option.id ? status(option.id) : undefined} disabled={disabled} onClick={() => onChange(option.id)}>
      <b className={s.letter} aria-hidden="true">{String.fromCharCode(65 + index)}</b>
      <span>{option.label[language]}</span>
      {answer === option.id ? <MarkIcon mark={status(option.id)} language={language} /> : null}
    </button>)}</div>
  </div>;
}

function decimals(value: number) { return String(value).split(".")[1]?.length ?? 0; }

/** Numbers: a stepper and (when the range is small) a slider, with the typed field kept for exact entry. */
export function NumberBoard({ task, values, onChange, language, band, disabled, status }: Common & { task: NumberTask; values: Record<string, string>; onChange: (values: Record<string, string>) => void }) {
  return <div className={s.board} data-band={band} data-kind="number">
    <Hint>{ui.numberHint[language]}</Hint>
    <div className={s.fields}>{task.fields.map(field => {
      const raw = values[field.id] ?? "", current = raw === "" ? NaN : Number(raw);
      const places = Math.max(decimals(field.answer), field.min == null ? 0 : decimals(field.min));
      const step = 10 ** -places;
      const set = (value: number) => {
        const clamped = Math.min(field.max ?? Infinity, Math.max(field.min ?? -Infinity, value));
        onChange({ ...values, [field.id]: String(Number(clamped.toFixed(places))) });
      };
      const bump = (by: 1 | -1) => set((Number.isFinite(current) ? current : field.min ?? 0) + by * step);
      const slider = field.min != null && field.max != null && field.max - field.min <= 500;
      return <div className={s.field} key={field.id} data-correct={status(field.id)}>
        <label className={s.fieldLabel} htmlFor={`number-${field.id}`}>{field.label[language]}</label>
        <div className={s.stepper}>
          <button type="button" className={s.stepButton} disabled={disabled} aria-label={`${ui.decrease[language]}: ${field.label[language]}`} onClick={() => bump(-1)}><Minus aria-hidden="true" /></button>
          <input id={`number-${field.id}`} type="number" inputMode="decimal" step="any" value={raw} min={field.min} max={field.max} disabled={disabled} onChange={event => onChange({ ...values, [field.id]: event.target.value })} />
          <button type="button" className={s.stepButton} disabled={disabled} aria-label={`${ui.increase[language]}: ${field.label[language]}`} onClick={() => bump(1)}><Plus aria-hidden="true" /></button>
          <MarkIcon mark={status(field.id)} language={language} />
        </div>
        {slider && <input className={s.slider} type="range" min={field.min} max={field.max} step={step} value={Number.isFinite(current) ? Math.min(field.max!, Math.max(field.min!, current)) : field.min} disabled={disabled} aria-label={field.label[language]} onChange={event => set(Number(event.target.value))} />}
      </div>;
    })}</div>
  </div>;
}
