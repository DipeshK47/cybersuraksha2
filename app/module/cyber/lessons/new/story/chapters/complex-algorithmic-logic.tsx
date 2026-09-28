"use client";

import type { LucideIcon } from "lucide-react";
import { ArrowRight, Check, ClipboardCheck, CodeXml, EyeOff, GraduationCap, Play, Printer, Repeat, RotateCcw, Scale, ShieldCheck, TriangleAlert, UserRoundCheck, X } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { SceneSwap } from "../StoryPlayer";
import type { StoryChapter, StoryWorldProps } from "../types";
import script from "./complex-algorithmic-logic.json";
import k from "../story-player.module.css";
import r from "./complex-algorithmic-logic.module.css";

const sections = [{ id: "7A", count: 30 }, { id: "7B", count: 30 }, { id: "7C", count: 28 }];
// "{}" marks the two lines Kabir has to fix: where the inner loop stops, and the marks check.
const source = ["FOR EACH section IN classSeven", "  count ← size of section", "  FOR s FROM 1 TO {}", "    IF marks[s] {} AND att[s] >= 75", '      result[s] ← "Pass"', "    ELSE", '      result[s] ← "Fail"'];
const LOOP = 2, COND = 3, BUGGY = { end: "count - 1", cond: "> 40" };

const ends = [{ code: "count - 1", say: "count minus 1" }, { code: "count", say: "count" }, { code: "count + 1", say: "count plus 1" }];
const conds = [
  { code: "> 40", say: "greater than 40" },
  { code: ">= 40", say: "greater than or equal to 40" },
  { code: "> 39", say: "greater than 39", trap: "> 39 only works because today’s marks are whole numbers. A mark like 39.5 would slip through. Use the boundary the rule states: 40." },
  { code: ">= 39", say: "greater than or equal to 39", trap: ">= 39 would pass a 39, one mark below the rule. Use the boundary the rule states: 40." },
];

type Case = { label: string; marks: number; att: number; want: string; last?: boolean };
const cases: Case[] = [
  { label: "Below 40", marks: 38, att: 88, want: "Fail" },
  { label: "Exactly 40", marks: 40, att: 82, want: "Pass" },
  { label: "Above 40", marks: 74, att: 95, want: "Pass" },
  { label: "Low attendance", marks: 74, att: 70, want: "Fail" },
  { label: "Last student", marks: 55, att: 90, want: "Pass", last: true },
];
/** What Kabir's program prints for one test case with the chosen loop end and marks check. */
function run(c: Case, end: string, cond: string) {
  if (end === "count + 1") return "Crashed";
  if (c.last && end === "count - 1") return "Missing";
  return (cond === ">= 40" ? c.marks >= 40 : c.marks > 40) && c.att >= 75 ? "Pass" : "Fail";
}
function why(end: string, cond: string) {
  if (end === "count + 1") return "Crashed: count + 1 asks for roll 31, but 7B has only 30 students. The loop must stop exactly at the last one.";
  return [cond === "> 40" && "Exactly 40 still fails, because 40 > 40 is false. The rule says 40 or more.", end === "count - 1" && "The last student is still missing: count - 1 stops one short."].filter(Boolean).join(" ");
}

const trial = [
  { roll: "7B-26", marks: 66, att: 91, result: "Pass" },
  { roll: "7B-27", marks: 38, att: 88, result: "Fail" },
  { roll: "7B-28", marks: 40, att: 82, result: "Fail", flag: true },
  { roll: "7B-29", marks: 72, att: 95, result: "Pass" },
];

const TOKENS = /(\b(?:FOR|EACH|IN|FROM|TO|IF|AND|ELSE)\b|"[^"]*"|\b\d+\b)/;
function Code({ text }: { text: string }) {
  return <>{text.split(TOKENS).map((part, i) => i % 2 ? <span key={i} data-t={part[0] === '"' ? "str" : /\d/.test(part[0]) ? "num" : "kw"}>{part}</span> : part)}</>;
}

function Console({ label, slots, state, active }: { label: string; slots: [string, string]; state: [string?, string?]; active?: number }) {
  return <div className={r.console}>
    <div className={r.consoleBar}><span aria-hidden="true"><i /><i /><i /></span><CodeXml aria-hidden="true" /><b>{label}</b></div>
    <ol className={r.code}>{source.map((line, i) => {
      const [before, after = ""] = line.split("{}"); const slot = i === LOOP ? 0 : i === COND ? 1 : -1;
      return <li key={i} data-active={active === i}><Code text={before} />{slot >= 0 && <mark data-state={state[slot]}>{slots[slot]}</mark>}<Code text={after} /></li>;
    })}</ol>
  </div>;
}

function Portal({ label, foot, tone, children }: { label: string; foot: ReactNode; tone?: string; children: ReactNode }) {
  return <div className={k.device}>
    <div className={k.deviceBar}><span><GraduationCap size={16} /> REPORT CARDS</span><span>{label}</span></div>
    <div className={r.app} data-tone={tone}>{children}</div>
    <div className={k.deviceFoot}>{foot}</div>
  </div>;
}

function Head({ small, title, chip }: { small: string; title: string; chip: ReactNode }) {
  return <div className={r.appHead}><div><small>{small}</small><strong>{title}</strong></div>{chip}</div>;
}

function Edge({ on, labels, rule, cells }: { on: boolean; labels: boolean; rule: string; cells: [string, boolean][] }) {
  return <div className={r.edge} data-on={on}>
    <div className={r.edgeHead}><Scale aria-hidden="true" /><b>Boundary value</b><code>{rule}</code></div>
    <div className={r.ticks}>{cells.map(([value, pass], i) => <span key={value} data-pass={pass} data-edge={i === 1}>
      <strong>{value}</strong><em>{pass ? "Pass" : "Fail"}</em><small data-on={labels}>{["just below", "right on", "just above"][i]}</small>
    </span>)}</div>
  </div>;
}

function Note({ on, icon: Icon, title, code, result }: { on: boolean; icon: LucideIcon; title: string; code: string; result: string }) {
  return <div data-on={on}><Icon aria-hidden="true" /><b>{title}</b><code>{code}</code><em>{result}</em></div>;
}

function World({ scene, playing, elapsed, solved, markSolved, hint, setHint, reduced }: StoryWorldProps) {
  const [end, setEnd] = useState(BUGGY.end);
  const [cond, setCond] = useState(BUGGY.cond);
  const [ran, setRan] = useState(false);
  // Reveal each part as the narrator reaches it (fraction of this scene's audio); everything shows when paused.
  const at = (fraction: number) => !playing || elapsed >= fraction * script.scenes[scene].duration;
  const results = cases.map(c => run(c, end, cond));
  const passed = ran && results.every((got, i) => got === cases[i].want);
  const slotState = (ok: boolean) => passed ? "fixed" : ran ? (ok ? "fixed" : "bug") : "edit";

  function pickEnd(code: string) { if (solved) return; setEnd(code); setRan(false); setHint(""); }
  function pickCond(option: (typeof conds)[number]) {
    if (solved) return;
    if (option.trap) { setHint(option.trap); return; }
    setCond(option.code); setRan(false); setHint("");
  }
  function runTests() { setRan(true); setHint(results.every((got, i) => got === cases[i].want) ? "" : why(end, cond)); }
  function reset() { setEnd(BUGGY.end); setCond(BUGGY.cond); setRan(false); setHint(""); }

  const traceLine = !playing ? undefined : !at(.28) ? -1 : !at(.39) ? 0 : !at(.67) ? LOOP : COND;

  return <SceneSwap scene={scene} reduced={reduced}>
    {scene === 0 && <Portal label="Cyberpur Public School" foot={<><CodeXml /><span>Program: <b>report-card v2</b></span><small>Pretend school data</small></>}>
      <Head small="Term 1 · Class 7" title="Report cards" chip={<span className={r.chip} data-tone="gold"><Printer aria-hidden="true" />Prints tomorrow</span>} />
      <div className={r.rule} data-on={at(.53)}><ClipboardCheck aria-hidden="true" /><div><small>Pass rule · from the exam office</small><p>Marks <b>40 or more</b> and attendance <b>75% or more</b></p></div></div>
      <div className={r.sections}>{sections.map(s => <div key={s.id}><strong>{s.id}</strong><span>{s.count} students</span><i aria-hidden="true" /></div>)}</div>
      <div className={r.helper}><UserRoundCheck aria-hidden="true" /><span>Helper: <b>Kabir</b> · Computer club</span></div>
    </Portal>}

    {scene === 1 && <Portal label="Trial run" tone="trouble" foot={<><TriangleAlert /><span>The trial found problems. Nothing has printed yet.</span><small>Pretend school data</small></>}>
      <Head small="Section 7B · results preview" title="Trial output" chip={<span className={r.chip}><EyeOff aria-hidden="true" />Names hidden</span>} />
      <div className={r.counts}>{sections.map(s => <span key={s.id} data-tone={at(.42) ? "warn" : undefined}><b>{s.id}</b>{s.count - 1} of {s.count} listed</span>)}</div>
      <table className={r.results}>
        <thead><tr><th scope="col">Roll</th><th scope="col">Marks</th><th scope="col">Attend.</th><th scope="col">Result</th></tr></thead>
        <tbody>
          {trial.map(row => { const flagged = Boolean(row.flag) && at(.31); return <tr key={row.roll} data-flag={flagged}><th scope="row">{row.roll}</th><td>{row.marks}</td><td>{row.att}%</td><td><span className={r.pill} data-tone={flagged ? "bad" : row.result === "Pass" ? "pass" : "fail"}>{row.result}</span>{flagged && <em className={r.should}>should pass</em>}</td></tr>; })}
          <tr className={r.missing} data-on={at(.42)}><th scope="row">7B-30</th><td colSpan={3}><TriangleAlert aria-hidden="true" />Not in the list</td></tr>
        </tbody>
      </table>
    </Portal>}

    {scene === 2 && <div className={k.panel}>
      <div className={r.teacher}><span className={r.avatar} aria-hidden="true">R</span><div><small>Mrs Rao · Computer teacher</small><p>“Don’t guess. Trace it, one line at a time.”</p></div></div>
      <Console label="report-card.pseudo · trace" slots={[BUGGY.end, BUGGY.cond]} state={[at(.55) ? "bug" : undefined, at(.81) ? "bug" : undefined]} active={traceLine} />
      <div className={r.trace}>
        <Note on={at(.55)} icon={Repeat} title="Inner loop, 7B" code="s = 1, 2 … 29  (count = 30)" result="Roll 30 is never checked" />
        <Note on={at(.81)} icon={Scale} title="Condition, roll 7B-28" code="40 > 40  →  false" result="Exactly 40 gets Fail" />
      </div>
    </div>}

    {scene === 3 && <div className={k.panel}>
      <h2>Debug the report-card program</h2>
      <Console label="report-card.pseudo" slots={[end, cond]} state={[slotState(end === "count"), slotState(cond === ">= 40")]} />
      <div className={r.fixes}>
        <div role="group" aria-labelledby="cal-loop"><span id="cal-loop">Line 3 · where the loop stops</span><div className={k.bank}>
          {ends.map(o => <button key={o.code} className={r.opt} aria-label={o.say} aria-pressed={end === o.code} disabled={solved} onClick={() => pickEnd(o.code)} type="button">{o.code}</button>)}
        </div></div>
        <div role="group" aria-labelledby="cal-cond"><span id="cal-cond">Line 4 · the marks check</span><div className={k.bank}>
          {conds.map(o => <button key={o.code} className={r.opt} aria-label={o.say} aria-pressed={cond === o.code} data-trap={Boolean(o.trap)} disabled={solved} onClick={() => pickCond(o)} type="button">{o.code}</button>)}
        </div></div>
      </div>
      <table className={r.tests} aria-label="Test cases">
        <thead><tr><th scope="col">Test case</th><th scope="col">Marks</th><th scope="col">Attend.</th><th scope="col">Expected</th><th scope="col">Got</th></tr></thead>
        <tbody>{cases.map((c, i) => { const got = ran ? results[i] : ""; const ok = got === c.want; return <tr key={c.label} data-ok={got ? ok : undefined}>
          <th scope="row">{c.label}</th><td>{c.marks}</td><td>{c.att}%</td><td>{c.want}</td>
          <td>{got ? <span className={`${r.pill} ${k.fitIn}`} data-tone={ok ? "pass" : "bad"}>{ok ? <Check aria-label="correct" /> : <X aria-label="wrong" />}{got}</span> : <span className={r.pending}>not run</span>}</td>
        </tr>; })}</tbody>
      </table>
      <p className={k.hint} aria-live="polite">{hint || (solved ? "Fixed and tested. Both boundaries now match the rule." : passed ? "All five tests pass. Send the fix to Mrs Rao." : "Choose a fix for each line, then run all five test cases.")}</p>
      <div className={k.actions}>
        <button onClick={reset} disabled={solved || (end === BUGGY.end && cond === BUGGY.cond && !ran)} type="button"><RotateCcw />Reset</button>
        {passed ? <button className={k.primary} onClick={markSolved} disabled={solved} type="button">{solved ? <>Fix sent<Check /></> : <>Send fix to Mrs Rao<ArrowRight /></>}</button>
          : <button className={k.primary} onClick={runTests} disabled={ran} type="button"><Play />Run test cases</button>}
      </div>
    </div>}

    {scene === 4 && <div className={k.panel}>
      <h2>Test below, on and above</h2>
      <Edge on={at(.15)} labels={at(.76)} rule="marks[s] >= 40" cells={[["39", false], ["40", true], ["41", true]]} />
      <Edge on={at(.15)} labels={at(.76)} rule="att[s] >= 75" cells={[["74%", false], ["75%", true], ["76%", true]]} />
      <div className={r.offByOne} data-on={at(.44)}>
        <div className={r.edgeHead}><Repeat aria-hidden="true" /><b>Off-by-one error</b><code>FOR s FROM 1 TO count</code></div>
        <div className={r.rolls} aria-label="Rolls 1 to 30 are checked. Roll 31 does not exist.">{["1", "2", "…", "29", "30", "31"].map(n => <span key={n} data-kind={n === "…" ? "gap" : n === "30" ? "edge" : n === "31" ? "out" : "in"}>{n}</span>)}</div>
        <div className={r.rollNotes}><span>count - 1 stops at 29</span><span>count + 1 asks for 31</span></div>
      </div>
      <small>Pretend data. A teacher still reviews real results.</small>
    </div>}

    {scene === 5 && <Portal label="Final run" tone="good" foot={<><ShieldCheck /><span>Checked by a program, then by a person.</span><small>Pretend school data</small></>}>
      <Head small="Term 1 · Class 7" title="Ready to print" chip={<span className={r.chip} data-tone="good"><Check aria-hidden="true" />5 of 5 tests pass</span>} />
      <div className={r.counts} data-on={at(.08)}>{sections.map(s => <span key={s.id} data-tone="good"><b>{s.id}</b>{s.count} of {s.count} listed</span>)}</div>
      <div className={r.fixedRow} data-on={at(.18)}><b>7B-28</b><span>40 marks · 82% attendance</span><span className={r.pill} data-tone="pass"><Check aria-hidden="true" />Pass</span></div>
      <div className={r.review} data-on={at(.33)}><span className={r.avatar} aria-hidden="true">R</span><div><strong>Mrs Rao reviewed every section</strong><span>88 report cards approved to print</span></div><Printer aria-hidden="true" /></div>
    </Portal>}
  </SceneSwap>;
}

const chapter: StoryChapter = {
  script,
  title: "Kabir’s report-card bug hunt",
  icon: GraduationCap,
  character: { asset: "emotional-avatar", name: "Kabir" },
  interactionScene: 3,
  beginLabel: "Practise with Kabir",
  waitingText: "Story paused. Fix both lines and pass every test to see what happens next.",
  lockedHint: "Help Kabir fix both boundaries and run the tests first.",
  World,
};
export default chapter;
