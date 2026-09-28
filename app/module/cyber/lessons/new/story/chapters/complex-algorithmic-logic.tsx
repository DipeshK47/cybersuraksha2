"use client";

import { Bug, Check, CircleX, ClipboardCheck, FileText, Layers, Play, Printer, Ruler, Stamp, UserRound, X } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { SceneSwap } from "../StoryPlayer";
import type { StoryChapter, StoryWorldProps } from "../types";
import script from "./complex-algorithmic-logic.json";
import k from "../story-player.module.css";
import r from "./complex-algorithmic-logic.module.css";

const comparisons = [
  { code: "> 40", say: "greater than 40", test: (m: number) => m > 40 },
  { code: ">= 40", say: "greater than or equal to 40", test: (m: number) => m >= 40 },
  { code: "> 39", say: "greater than 39", test: (m: number) => m > 39 },
  { code: ">= 39", say: "greater than or equal to 39", test: (m: number) => m >= 39 },
];
const ends = [{ code: "count - 1", say: "count minus 1" }, { code: "count", say: "count" }, { code: "count + 1", say: "count plus 1" }];
const tests = [
  { name: "Asha", marks: 38, att: 80, expected: "Fail" },
  { name: "Kiran", marks: 39, att: 90, expected: "Fail" },
  { name: "Rahul", marks: 40, att: 82, expected: "Pass" },
  { name: "Neel", marks: 74, att: 90, expected: "Pass" },
  { name: "Meher", marks: 74, att: 70, expected: "Fail" },
  { name: "Yusuf · last in 7A", marks: 65, att: 88, expected: "Pass", last: true },
];

/** The report-card pseudocode, with the two lines Kabir can change. */
function Code({ cmp, end, mark }: { cmp: string; end: string; mark?: boolean }) {
  const lines: [string, ReactNode][] = [
    ["1", <>FOR each section IN [7A, 7B, 7C]</>],
    ["2", <>  FOR s FROM 1 TO <b data-bug={mark && end !== "count"}>{end}</b></>],
    ["3", <>    student ← section[s]</>],
    ["4", <>    IF student.marks <b data-bug={mark && cmp !== ">= 40"}>{cmp}</b> AND student.attendance &gt;= 75</>],
    ["5", <>      PRINT student.name, &quot;Pass&quot;</>],
    ["6", <>    ELSE PRINT student.name, &quot;Fail&quot;</>],
    ["7", <>  END FOR</>],
    ["8", <>END FOR</>],
  ];
  return <pre className={r.code}>{lines.map(([n, text]) => <span key={n}><i>{n}</i>{text}{"\n"}</span>)}</pre>;
}

function World({ scene, playing, elapsed, solved, markSolved, hint, setHint, reduced }: StoryWorldProps) {
  const [cmp, setCmp] = useState("> 40");
  const [end, setEnd] = useState("count - 1");
  const [ran, setRan] = useState(false);
  const [passing, setPassing] = useState(false);
  const done = solved || passing;
  const c = solved ? ">= 40" : cmp;
  const e = solved ? "count" : end;
  // Reveal an item once narration reaches that fraction of the scene (everything shows while paused).
  const cue = (at: number) => !playing || elapsed > script.scenes[scene].duration * at;
  const show = (at: number) => ({ "data-on": cue(at), "aria-hidden": !cue(at) });

  const outcome = (t: (typeof tests)[number]) => {
    if (t.last && e === "count - 1") return "missing";
    const rule = comparisons.find(x => x.code === c)!;
    return rule.test(t.marks) && t.att >= 75 ? "Pass" : "Fail";
  };
  function pickCmp(code: string) {
    if (done) return;
    if (code === "> 39") { setHint("Greater than 39 gives the same answers for whole numbers today, but it hides the rule. If marks were ever 39.5, it would pass. Write the rule as it is stated: 40 or more."); return; }
    setCmp(code); setRan(false); setHint("");
  }
  function run() {
    if (done) return;
    setRan(true);
    if (end === "count + 1") { setHint("Line 2 now tries to read a student after the last one, who doesn’t exist. The program crashes. The loop should end at count."); return; }
    const bad = tests.find(t => outcome(t) !== t.expected);
    if (!bad) { setHint("All six tests pass, including the boundary (40) and the last student."); setPassing(true); window.setTimeout(markSolved, reduced ? 0 : 700); return; }
    if (bad.name === "Kiran") setHint("Kiran has 39 and gets Pass. The rule says 40 or more, so 39 must fail.");
    else if (bad.name === "Rahul") setHint("Rahul has exactly 40 but gets Fail: 40 > 40 is false. The rule says 40 or more.");
    else setHint("Yusuf is still missing. The inner loop stops one student early, in every section.");
  }

  return <SceneSwap scene={scene} reduced={reduced}>
    {(scene === 0 || scene === 5) && <div className={k.device}>
      <div className={k.deviceBar}><span><FileText size={16} /> REPORT CARDS</span><span>{scene === 0 ? "Computer lab · final check" : "Results day"}</span></div>
      <div className={`${k.deviceArt} ${r.lab}`}>
        {scene === 0 ? <div className={r.split}>
          <Code cmp="> 40" end="count - 1" />
          <div className={r.queue} {...show(.4)}><small>Print queue</small>{[["7A", 29], ["7B", 30], ["7C", 28]].map(([s, n]) => <span key={s}><Printer aria-hidden="true" />Class {s} · {n} cards</span>)}<b>Ready to print tomorrow</b></div>
        </div> : <div className={r.card}>
          <div className={r.cardHead}><strong>Cyberpur School · Report card</strong><small>Class 7B</small></div>
          <div className={r.cardBody}><span>Rahul</span><span>Marks: 40</span><span>Attendance: 82%</span></div>
          <span className={r.stamp}><Stamp aria-hidden="true" />PASS</span>
          <p className={r.printed}><Check aria-hidden="true" />Yusuf’s and Zoya’s cards printed too</p>
        </div>}
      </div>
      <div className={k.deviceFoot}>{scene === 0 ? <><UserRound /><span>Rule: pass with 40 or more marks and at least 75% attendance</span></> : <><ClipboardCheck /><span>New lab checklist: test the edges before you trust the output</span></>}</div>
    </div>}

    {scene === 1 && <div className={k.device}>
      <div className={k.deviceBar}><span><Printer size={16} /> OUTPUT PREVIEW</span><span>Class 7A · 29 of 30 students</span></div>
      <div className={`${k.deviceArt} ${r.output}`}>
        <table className={r.table}><thead><tr><th>Student</th><th>Marks</th><th>Attendance</th><th>Result</th></tr></thead>
          <tbody>
            <tr><td>Asha</td><td>38</td><td>80%</td><td>Fail</td></tr>
            <tr data-bad={cue(.12)}><td>Rahul</td><td>40</td><td>82%</td><td>Fail</td></tr>
            <tr><td>Neel</td><td>74</td><td>90%</td><td>Pass</td></tr>
            <tr><td colSpan={4} className={r.gap}>… 26 more …</td></tr>
            <tr data-missing="true" {...show(.5)}><td colSpan={4}><span><CircleX aria-hidden="true" />Yusuf (student 30) is missing</span></td></tr>
          </tbody></table>
        <p className={r.also} {...show(.72)}><Bug aria-hidden="true" />7B is one short too: Zoya is missing.</p>
      </div>
      <div className={k.deviceFoot}><Bug /><span>Two bugs, and the cards print tomorrow.</span></div>
    </div>}

    {scene === 2 && <div className={k.panel}>
      <h2>Kabir’s trace table</h2>
      <table className={r.trace} {...show(.08)}><thead><tr><th>Line</th><th>Values</th><th>Check</th><th>Result</th></tr></thead>
        <tbody>
          <tr {...show(.3)}><td>4</td><td>Rahul · marks 40</td><td><code>40 &gt; 40</code> → false</td><td data-bad="true">Fail ✗</td></tr>
          <tr {...show(.66)}><td>2</td><td>s = 29 · count = 30</td><td><code>TO count - 1</code> → loop ends</td><td data-bad="true">Yusuf skipped ✗</td></tr>
        </tbody></table>
      <div className={r.terms}>
        <div {...show(.52)}><Ruler aria-hidden="true" /><strong>Boundary error</strong><span>A mistake right at the edge of a rule or a list, often off by one.</span></div>
        <div {...show(.82)}><Layers aria-hidden="true" /><strong>Nested loops</strong><span>The outer loop visits each section; the inner loop visits each student in it.</span></div>
      </div>
    </div>}

    {scene === 3 && <div className={`${k.panel} ${r.task}`}>
      <h2>Fix the pseudocode, then test</h2>
      <Code cmp={c} end={e} mark />
      <div className={r.pickers}>
        <div><small>Line 4 · comparison</small><div className={r.options}>{comparisons.map(o => <button key={o.code} type="button" aria-label={`Comparison: ${o.say}`} aria-pressed={c === o.code} data-trap={o.code === "> 39" || undefined} disabled={done} onClick={() => pickCmp(o.code)}>{o.code}</button>)}</div></div>
        <div><small>Line 2 · loop ends at</small><div className={r.options}>{ends.map(o => <button key={o.code} type="button" aria-label={`Loop end: ${o.say}`} aria-pressed={e === o.code} disabled={done} onClick={() => { if (!done) { setEnd(o.code); setRan(false); setHint(""); } }}>{o.code}</button>)}</div></div>
      </div>
      <table className={r.tests}><thead><tr><th>Test</th><th>Marks</th><th>Att.</th><th>Expected</th><th>Got</th></tr></thead>
        <tbody>{tests.map(t => { const got = ran || solved ? (e === "count + 1" ? "crash" : outcome(t)) : "–"; const ok = got === t.expected; return <tr key={t.name} data-ok={ran || solved ? ok : undefined}><td>{t.name}</td><td>{t.marks}</td><td>{t.att}%</td><td>{t.expected}</td><td>{got}{(ran || solved) && (ok ? <Check aria-hidden="true" /> : <X aria-hidden="true" />)}</td></tr>; })}</tbody></table>
      <p className={k.hint} aria-live="polite">{hint || (done ? "All six tests pass, including the boundary (40) and the last student." : "Change the two highlighted parts, then run the tests.")}</p>
      <div className={k.actions}><button className={k.primary} type="button" onClick={run} disabled={done}><Play />Run the tests</button></div>
    </div>}

    {scene === 4 && <div className={k.panel}>
      <h2>Test the boundaries</h2>
      <div className={r.line} {...show(.2)}>{[[39, "Fail"], [40, "Pass"], [41, "Pass"]].map(([m, res]) => <span key={m} data-pass={res === "Pass"}><b>{m}</b>{res}</span>)}</div>
      <div className={r.edges} {...show(.52)}><span><Check aria-hidden="true" />First student</span><span><Check aria-hidden="true" />Last student</span></div>
      <p className={r.multiply} {...show(.74)}><Layers aria-hidden="true" /><span>1 inner-loop bug × 3 sections = <b>3 missing students</b></span></p>
    </div>}
  </SceneSwap>;
}

const chapter: StoryChapter = {
  script,
  title: "Kabir’s report-card bug hunt",
  icon: Bug,
  character: { asset: "emotional-avatar", name: "Kabir" },
  interactionScene: 3,
  beginLabel: "Practise with Kabir",
  waitingText: "Story paused. Fix both bugs and make every test pass.",
  lockedHint: "Help Kabir fix the pseudocode first.",
  World,
};
export default chapter;
