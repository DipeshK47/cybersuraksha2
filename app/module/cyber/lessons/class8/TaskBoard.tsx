"use client";

import { useEffect, useRef, useState } from "react";
import { Check, FlaskConical, Plus } from "lucide-react";
import type { Class8Task, L, TaskAnswer } from "../../../../data/class8/types";
import { buildTaskEvidence } from "./task-evidence";
import { testPermissions } from "./task-evaluation";
import { makeTaskSimulation, type TaskSimulationSnapshot } from "./task-simulation";
import type { TaskDiagnosis } from "./task-feedback";
import { ChoiceBoard, MatchBoard, NumberBoard, OrderBoard, SortBoard, type Band } from "./boards";
import { BinaryBoard, GridBoard, ModelBoard, RouteBoard } from "./boards-extra";
import { ui, useEvidenceLanguage } from "./ui";
import s from "./class8.module.css";
import b from "./boards.module.css";

export function initialAnswer(task: Class8Task): TaskAnswer {
  if (task.kind === "binary") return "00000000";
  if (task.kind === "model") return [...task.initialTraining];
  if (["select", "order", "grid", "route"].includes(task.kind)) return [];
  return task.kind === "choice" ? "" : {};
}

export function TaskBoard({ task, answer, onChange: changeAnswer, onCheck, disabled = false, onSimulationChange, diagnosis = null, band = "senior", scene }: {
  task: Class8Task; answer: TaskAnswer; onChange: (answer: TaskAnswer) => void; onCheck: () => void; disabled?: boolean; onSimulationChange?: (snapshot: TaskSimulationSnapshot | null) => void;
  /** After "Check my answer", each card shows its own result from this. */
  diagnosis?: TaskDiagnosis | null;
  /** Classes 6-7 get the playful look; Classes 8-10 the quieter one. */
  band?: Band;
  /** Classes 6-7: the chapter picture shown beside the situation on some challenges. */
  scene?: { src: string; preview: string; alt: L };
}) {
  const evidenceLanguage = useEvidenceLanguage();
  const marks = new Map<string, boolean>();
  for (const item of diagnosis?.supported ?? []) marks.set(item.id, true);
  for (const item of diagnosis?.issues ?? []) marks.set(item.id, false);
  const status = (id: string) => diagnosis?.complete ? marks.get(id) : undefined;
  const board = { language: evidenceLanguage, band, disabled, status };
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
    {scene
      ? <div className={b.sceneRow} data-band={band}>
        <figure className={b.sceneFigure}>
          {/* eslint-disable-next-line @next/next/no-img-element -- Static chapter artwork is already sized for the page. */}
          <img src={scene.preview} srcSet={`${scene.preview} 640w, ${scene.src} 1400w`} sizes="(max-width: 860px) 100vw, 40vw" width={1400} height={788} alt={scene.alt[evidenceLanguage]} loading="lazy" decoding="async" /></figure>
        <div className={s.case}><span>{ui.source[evidenceLanguage]}</span><p>{task.context[evidenceLanguage]}</p></div>
      </div>
      : <div className={s.case}><span>{ui.source[evidenceLanguage]}</span><p>{task.context[evidenceLanguage]}</p></div>}
    {task.kind === "choice" && <ChoiceBoard {...board} task={task} answer={typeof answer === "string" ? answer : ""} onChange={onChange} />}
    {task.kind === "select" && task.presentation !== "redact" && <SortBoard {...board} task={task} selected={selected} onChange={onChange} />}
    {task.kind === "select" && task.presentation === "redact" && <>
      <div className={s.tileBank} aria-label={evidenceLanguage === "hi" ? "जवाब बनाने के लिए कार्ड चुनें" : "Choose cards to build your answer"}>
        {task.items.map(item => <label className={s.selection} key={item.id} data-selected={selected.includes(item.id)}>
          <input type="checkbox" disabled={disabled} checked={selected.includes(item.id)} onChange={() => toggle(item.id)} />
          <span>{item.label[evidenceLanguage]}</span><span className={s.tileMark} aria-hidden="true">{selected.includes(item.id) ? <Check /> : <Plus />}</span>
        </label>)}
      </div>
      <figure className={task.presentation === "redact" ? s.redaction : s.answerTray} data-answer-workspace>
        <figcaption>{evidenceLanguage === "hi" ? task.presentation === "redact" ? "आपका बदला हुआ ड्राफ़्ट" : "आपने ये कार्ड चुने" : task.presentation === "redact" ? "Your edited draft" : "Your chosen cards"}</figcaption>
        {task.presentation === "redact"
          ? task.items.map(item => <span key={item.id} className={s.draftLine} data-covered={selected.includes(item.id)}>{selected.includes(item.id) ? <><span className={s.coveredText} aria-hidden="true">{item.label[evidenceLanguage]}</span><small>{ui.hidden[evidenceLanguage]}</small></> : item.label[evidenceLanguage]}</span>)
          : selected.length ? <ul>{selected.map(id => <li key={id}>{task.items.find(item => item.id === id)?.label[evidenceLanguage]}</li>)}</ul> : <p>{evidenceLanguage === "hi" ? "कार्ड चुनकर यहाँ रखें। हटाने के लिए उसी कार्ड को फिर चुनें।" : "Choose a card to place it here. Choose it again to take it back."}</p>}
      </figure>
    </>}
    {task.kind === "match" && <MatchBoard {...board} task={task} values={values as Record<string, string>} onChange={onChange} />}
    {task.kind === "order" && <OrderBoard {...board} task={task} selected={selected} onChange={onChange} />}
    {task.kind === "number" && <NumberBoard {...board} task={task} values={values as Record<string, string>} onChange={onChange} />}
    {task.kind === "binary" && <BinaryBoard {...board} task={task} answer={typeof answer === "string" ? answer : ""} onChange={onChange} />}
    {task.kind === "grid" && <GridBoard {...board} task={task} cells={Array.isArray(answer) ? answer as number[] : []} onChange={onChange} />}
    {task.kind === "route" && <RouteBoard {...board} task={task} selected={selected} onChange={onChange} tested={tested} lines={buildTaskEvidence(task, answer)} />}
    {task.kind === "model" && <ModelBoard {...board} task={task} selected={selected} onChange={onChange} tested={tested} />}
    {needsTest && <button type="button" className={s.secondary} disabled={disabled} onClick={runTest}><FlaskConical aria-hidden="true" />{ui.test[evidenceLanguage]}</button>}
    {tested && task.kind === "match" && task.presentation === "permissions" && <div className={s.result} role="status"><h3>{ui.preview[evidenceLanguage]}</h3>{testPermissions(task, values).map(test => <p key={test.label.en}><strong>{test.label[evidenceLanguage]}</strong><br />{test.result[evidenceLanguage]}</p>)}</div>}
    <div className={s.actions}>{checkButton}</div>
  </div>;
}
