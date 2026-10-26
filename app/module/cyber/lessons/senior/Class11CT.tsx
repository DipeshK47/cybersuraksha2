"use client";

import { Check, Play, RotateCcw } from "lucide-react";
import { useState } from "react";
import type { CyberLessonComponentProps } from "../../lesson-types";
import { PracticeShell, usePractice } from "../new/PracticeShell";
import { MatchTable, ControlChecklist, SequenceBoard } from "./Class11Security";
import { ChoiceTask } from "./Class11AI";
import * as c from "./ct-content";
import { ctArtwork } from "./ct-art";
import s from "../new/practice.module.css";
import v from "./security.module.css";
import a from "./ai.module.css";
import t from "./ct.module.css";

type CheckAnswer = (correct: boolean, feedback: string, unsafe?: boolean) => void;
type Props = { stage: number; check: CheckAnswer };

function Decomposition({ stage, check }: Props) {
  if (stage === 0) return <SequenceBoard steps={c.processSteps} check={check} success="Decomposition map: intake → exercise-rule and missing-data checks → responsible teacher review → communication of the reviewed outcome. Each part has an input, output and handoff." />;
  if (stage === 1) return <MatchTable rows={c.decompositionFacts} options={["Supplied fact", "Assumption to challenge", "Scope constraint"]} check={check} success="Scope record: the supplied score and document flag are facts; complete future documents are an assumption; keeping real decisions with the teacher is a constraint." />;
  return <ControlChecklist controls={c.scopeControls} check={check} success="Workflow scope: minimal synthetic intake, explicit incomplete/invalid routes and teacher-reviewed outcomes. Real awards and payments remain outside this exercise." />;
}

function DataModel({ stage, check }: Props) {
  const [lookupId, setLookupId] = useState("");
  const [looked, setLooked] = useState(false);
  const lookup = new Map(c.applicants.map(record => [record.id, record]));
  const found = lookup.get(lookupId);
  if (stage === 0) return <div className={v.board}><div className={a.tableWrap}><table className={a.table}><caption>Minimal supplied synthetic table</caption><thead><tr><th>Stable ID</th><th>Score</th><th>Documents</th></tr></thead><tbody>{c.applicants.map(record => <tr key={record.id}><th>{record.id}</th><td>{record.score}</td><td>{record.documents ? "Complete" : "Incomplete"}</td></tr>)}</tbody></table></div><ControlChecklist controls={c.modelControls} check={check} success="Data dictionary: ID = uppercase letter plus two digits; score = supplied finite number 0–100 or missing; documents = complete, incomplete or unknown. Home and bank details are unnecessary." /></div>;
  if (stage === 1) return <div className={v.board}><p className={v.callout}>The supplied table has unique IDs. Use one as a key before matching the representations. Conflicting IDs must be reviewed before a unique lookup can be trusted.</p><label className={v.matchRow}><span>Applicant ID lookup</span><select value={lookupId} onChange={event => { setLookupId(event.target.value); setLooked(false); }}><option value="">Choose an ID…</option>{c.applicants.map(record => <option key={record.id}>{record.id}</option>)}</select></label><button className={s.secondary} disabled={!lookupId} type="button" onClick={() => setLooked(true)}><Play aria-hidden="true" />Run keyed lookup</button>{looked && found && <output className={v.callout} aria-live="polite">{found.id} → score {found.score}; documents {found.documents ? "complete" : "incomplete"}</output>}<MatchTable rows={c.structures} options={["Record", "List", "Keyed lookup"]} check={(correct, feedback) => check(correct && looked, looked ? feedback : "Run a lookup by a unique stable ID before saving the representation map.")} success="Representation map: one applicant → record; several records → list; unique stable ID → keyed lookup after duplicate checks. A key conflict must not silently overwrite data." /></div>;
  return <MatchTable rows={c.modelValidation} options={c.modelValidation.map(row => row.answer)} check={check} success="Validation record: duplicate IDs are flagged; score 104 is rejected; an absent score goes to review; an explicitly false document flag remains distinct from unknown." />;
}

function RuleBench({ check, boundaryOnly = false }: { check: CheckAnswer; boundaryOnly?: boolean }) {
  const [operator, setOperator] = useState(">");
  const [join, setJoin] = useState("OR");
  const [ran, setRan] = useState(false);
  const actual = c.applicants.map(record => c.evaluateApplicant(record, 60, operator === ">=", boundaryOnly ? "AND" : join as "AND" | "OR"));
  const expected = c.applicants.map(record => c.evaluateApplicant(record));
  return <div className={v.board}>
    <pre className={t.code}>validate record first{"\n"}score {operator} 60 {boundaryOnly ? "AND" : join} documents_complete{"\n"}else: Not eligible / Needs documents</pre>
    <label className={v.matchRow}><span>Score comparison</span><select value={operator} onChange={event => { setOperator(event.target.value); setRan(false); }}><option value=">">Greater than 60</option><option value=">=">At least 60</option></select></label>
    {!boundaryOnly && <label className={v.matchRow}><span>Combine score and documents</span><select value={join} onChange={event => { setJoin(event.target.value); setRan(false); }}><option>OR</option><option>AND</option></select></label>}
    <button className={s.secondary} type="button" onClick={() => setRan(true)}><Play aria-hidden="true" />Run supplied records</button>
    {ran && <div className={a.tableWrap}><table className={a.table}><caption>Expected outcomes follow the fictional at-least-60 AND complete-documents brief</caption><thead><tr><th>Case</th><th>Input</th><th>Expected</th><th>Actual</th></tr></thead><tbody>{c.applicants.map((record, index) => <tr key={record.id}><th>{record.id}</th><td>{record.score} · {record.documents ? "Complete" : "Incomplete"}</td><td>{expected[index]}</td><td>{actual[index]}<small>{actual[index] === expected[index] ? "Match" : "Mismatch"}</small></td></tr>)}</tbody></table></div>}
    <button className={s.primary} disabled={!ran} type="button" onClick={() => { const wrong = actual.findIndex((outcome, index) => outcome !== expected[index]); check(wrong === -1, wrong === -1 ? "Rule trace: A10 72/complete → Eligible; B20 60/complete → Eligible; C30 59/complete → Not eligible; D40 65/incomplete → Needs documents. Inclusive comparison and AND match the brief." : `${c.applicants[wrong].id}: expected ${expected[wrong]}, got ${actual[wrong]}. At least 60 includes 60; complete documents must not bypass the score, and a high score must not bypass missing documents.`); }}><Check aria-hidden="true" />Check rule trace</button>
  </div>;
}

function ExplicitRules({ stage, check }: Props) {
  if (stage === 0) return <MatchTable rows={c.applicants.map(record => ({ label: `${record.id} · score ${record.score} · ${record.documents ? "complete" : "incomplete"} documents`, answer: c.evaluateApplicant(record), why: "Apply score ≥ 60 AND complete documents after validation; a qualifying score without complete documents needs the document route." }))} options={c.outcomeOptions} check={check} success="Decision table: A10 and B20 Eligible; C30 Not eligible; D40 Needs documents. These are fictional exercise classifications, not real awards." />;
  if (stage === 1) return <RuleBench check={check} />;
  return <SequenceBoard steps={c.ruleSteps} check={check} success="Pseudocode: validate fields; handle missing/invalid input; reject scores below 60; otherwise distinguish complete documents from Needs documents. Validation and the missing-data paths remain explicit." />;
}

function TraceDebug({ stage, check }: Props) {
  const [guard, setGuard] = useState("<=");
  const [ran, setRan] = useState(false);
  if (stage === 1) return <RuleBench boundaryOnly check={check} />;
  if (stage === 2) return <MatchTable rows={c.errorKinds} options={["Syntax-like error", "Logic error", "Test evidence"]} check={check} success="Debug record: => is invalid in this pseudocode notation; >60 is a logical boundary error for an at-least-60 brief; the corrected-case rerun is test evidence." />;
  const trace = c.loopTrace([59, 60, 72], guard === "<=");
  return <div className={v.board}><pre className={t.code}>scores = [59, 60, 72]{"\n"}i = 0{"\n"}while i {guard} length(scores):{"\n"}  inspect scores[i]{"\n"}  i = i + 1</pre>
    <label className={v.matchRow}><span>Loop guard</span><select value={guard} onChange={event => { setGuard(event.target.value); setRan(false); }}><option value="<=">i ≤ length</option><option value="<">i &lt; length</option></select></label>
    <button className={s.secondary} type="button" onClick={() => setRan(true)}><Play aria-hidden="true" />Run loop trace</button>
    {ran && <div className={a.tableWrap}><table className={a.table}><caption>List length 3 · valid indexes 0, 1, 2</caption><thead><tr><th>Index</th><th>Value</th><th>Observation</th></tr></thead><tbody>{trace.map(row => <tr key={row.index}><th>{row.index}</th><td>{row.error ? "No element" : row.value}</td><td>{row.error ? "Out-of-range read" : "Valid element"}</td></tr>)}</tbody></table></div>}
    <button className={s.primary} disabled={!ran} type="button" onClick={() => check(guard === "<", guard === "<" ? "Trace repaired: indexes 0, 1 and 2 visit all three scores; i < length stops before the out-of-range index 3. The failing extra row is removed on rerun." : "The i ≤ length guard also visits index 3, which is outside this three-item list. Use i < length and rerun the trace.")}><Check aria-hidden="true" />Save corrected trace</button>
  </div>;
}

function SearchBench({ binary, check }: { binary: boolean; check: CheckAnswer }) {
  const [sorted, setSorted] = useState(false);
  const [steps, setSteps] = useState(0);
  const [count, setCount] = useState("");
  const [attempted, setAttempted] = useState(false);
  const values = sorted ? [...c.searchValues].sort((left, right) => left - right) : c.searchValues;
  const trace = binary ? c.binaryTrace(values, 60) : c.linearTrace(values, 60);
  const canSearch = !binary || sorted;
  const complete = canSearch && steps === trace.indices.length;
  return <div className={v.board}><p className={v.callout}>Target numeric practice ID: 60. {binary ? "Binary search requires ascending order. These lookup comparison counts exclude sorting cost." : "Linear search checks the supplied shuffled order; no sorting preparation is needed."}</p>
    <div className={t.numberStrip} aria-label="Search data">{values.map((value, index) => <span key={value} data-checked={trace.indices.slice(0, steps).includes(index)}><small>Index {index}</small><b>{value}</b><em>{steps > 0 && trace.indices[steps - 1] === index ? "Current" : trace.indices.slice(0, steps).includes(index) ? "Checked" : "Unseen"}</em></span>)}</div>
    <div className={s.controls}>{binary && <button className={s.secondary} disabled={sorted} type="button" onClick={() => { setSorted(true); setSteps(0); setAttempted(false); }}><RotateCcw aria-hidden="true" />Sort IDs ascending</button>}<button className={s.secondary} disabled={complete} type="button" onClick={() => { setAttempted(true); if (canSearch) setSteps(current => Math.min(current + 1, trace.indices.length)); }}><Play aria-hidden="true" />Next {binary ? "binary" : "linear"} comparison</button></div>
    {attempted && !canSearch && <p className={v.callout} role="status">Search refused: the IDs are not sorted. Establish ascending order before discarding any half-range.</p>}
    <output className={v.callout} aria-live="polite">Comparisons shown: {steps}{complete ? ` · Found ID 60 at index ${trace.foundIndex}` : " · Continue the trace"}</output>
    <label className={v.matchRow}><span>Total lookup comparisons</span><input type="number" min={0} value={count} onChange={event => setCount(event.target.value)} /></label>
    <button className={s.primary} disabled={!complete || !count} type="button" onClick={() => check(Number(count) === trace.indices.length, Number(count) === trace.indices.length ? `${binary ? "Binary" : "Linear"} trace: ${trace.indices.length} comparisons to find 60 in the supplied ${binary ? "sorted" : "shuffled"} list. ${binary ? "Sorted order is required and sorting cost is excluded." : "This lookup did not require sorting first."}` : "Count each inspected value, including the matching value. The displayed comparison counter records this particular trace.")}><Check aria-hidden="true" />Save search comparison</button>
  </div>;
}

function SearchSort({ stage, check }: Props) {
  if (stage === 0) return <SearchBench binary={false} check={check} />;
  if (stage === 1) return <SearchBench binary check={check} />;
  return <MatchTable rows={c.searchChoices} options={c.searchChoices.map(row => row.answer)} check={check} success="Method choice: one tiny unsorted enquiry can use linear search; many lookups in an already sorted list fit binary search; comparing 5 with 2 checks must explicitly exclude sorting preparation." />;
}

function ReusableStep({ stage, check }: Props) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [ran, setRan] = useState(false);
  const [missing, setMissing] = useState(false);
  const [score, setScore] = useState("72");
  const [expected, setExpected] = useState("");
  if (stage === 0) return <MatchTable rows={c.functionContract} options={c.functionContract.map(row => row.answer)} check={check} success="Function contract: accept one synthetic record; return an explicit check or review outcome; validate ID, range and missing fields; every caller uses the same check and preserves teacher review." />;
  if (stage === 1) {
    const calls = c.applicants.slice(1);
    return <div className={v.board}><pre className={t.code}>checkApplicant(record){"\n"}  one shared validated rule: score ≥ 60 AND documents</pre>
      {calls.map(record => <label className={v.matchRow} key={record.id}><span>{record.id} · {record.score} · {record.documents ? "complete" : "incomplete"}</span><select aria-label={`Predict ${record.id}`} value={answers[record.id] ?? ""} onChange={event => setAnswers(current => ({ ...current, [record.id]: event.target.value }))}><option value="">Predict result…</option>{c.outcomeOptions.map(outcome => <option key={outcome}>{outcome}</option>)}</select></label>)}
      <button className={s.secondary} disabled={calls.some(record => !answers[record.id])} type="button" onClick={() => setRan(true)}><Play aria-hidden="true" />Run the shared function</button>
      {ran && <ul className={v.records} aria-label="Actual function results">{calls.map(record => <li key={record.id}>{record.id} → {c.evaluateApplicant(record)}</li>)}</ul>}
      <button className={s.primary} disabled={!ran} type="button" onClick={() => { const wrong = calls.find(record => answers[record.id] !== c.evaluateApplicant(record)); check(!wrong, wrong ? `${wrong.id}: the same function returns ${c.evaluateApplicant(wrong)}. Do not replace its rule in one caller.` : "Shared calls: B20 → Eligible, C30 → Not eligible, D40 → Needs documents. All three callers use the same validated function rather than copied, drifting conditions."); }}><Check aria-hidden="true" />Check call predictions</button>
    </div>;
  }
  const record: c.Applicant = { id: "A10", score: missing || score.trim() === "" ? null : Number(score), documents: true };
  return <div className={v.board}><p className={v.callout}>New case: the score field is absent, while documents are complete. Mark the field missing, predict the result and run the same function.</p><label className={v.checkRow}><input type="checkbox" checked={missing} onChange={event => { setMissing(event.target.checked); setRan(false); }} /><span>Score field is missing</span></label><label className={v.matchRow}><span>Supplied score when present</span><input type="number" disabled={missing} value={score} onChange={event => { setScore(event.target.value); setRan(false); }} /></label><label className={v.matchRow}><span>Predicted missing-score result</span><select value={expected} onChange={event => setExpected(event.target.value)}><option value="">Choose…</option>{c.outcomeOptions.map(outcome => <option key={outcome}>{outcome}</option>)}</select></label><button className={s.secondary} type="button" onClick={() => setRan(true)}><Play aria-hidden="true" />Run missing-field call</button>{ran && <output className={v.callout} aria-live="polite">Shared function → {c.evaluateApplicant(record)}</output>}<button className={s.primary} disabled={!ran || !expected} type="button" onClick={() => check(missing && expected === "Review missing data", missing && expected === "Review missing data" ? "Missing-field test: score absent with complete documents → Review missing data. Missing is not silently converted to zero or confused with an explicitly false document flag." : "Use the requested missing-field case. The absent score needs Review missing data; neither complete documents nor a default zero can substitute for it.")}><Check aria-hidden="true" />Save function boundary</button></div>;
}

function TestRunner({ revision = false, check }: { revision?: boolean; check: CheckAnswer }) {
  const [inclusive, setInclusive] = useState(false);
  const [threshold, setThreshold] = useState("60");
  const [ran, setRan] = useState(false);
  const cases = revision ? c.revisionCases : c.testCases;
  const results = c.runTestCases(cases, revision ? Number(threshold) : 60, revision || inclusive);
  const allPassed = results.every(result => result.passed);
  return <div className={v.board}><p className={v.callout}>{revision ? "Revised fictional requirement: score ≥ 70 AND complete documents. The expected outcomes below follow that new brief; empty, missing and duplicate safeguards still apply." : "This six-case pack follows score ≥ 60 AND complete documents. Run the > 60 draft, inspect its failing case, then repair the operator and rerun the same tests."}</p>
    {revision ? <label className={v.matchRow}><span>Shared score threshold</span><select value={threshold} onChange={event => { setThreshold(event.target.value); setRan(false); }}><option>60</option><option>70</option></select></label> : <label className={v.matchRow}><span>Score operator in the shared function</span><select value={inclusive ? ">=" : ">"} onChange={event => { setInclusive(event.target.value === ">="); setRan(false); }}><option value=">">Greater than 60</option><option value=">=">At least 60</option></select></label>}
    <button className={s.secondary} type="button" onClick={() => setRan(true)}><Play aria-hidden="true" />Run {revision ? "revised" : "six-case"} test pack</button>
    {ran && <div className={a.tableWrap}><table className={`${a.table} ${t.testTable}`}><caption>Expected outcomes are supplied by the exercise brief; Actual comes from the running function</caption><thead><tr><th>Case</th><th>Expected</th><th>Actual</th><th>Result</th></tr></thead><tbody>{results.map(result => <tr key={result.id}><th>{result.id}<small>{cases.find(test => test.id === result.id)?.description}</small></th><td>{result.expected}</td><td>{result.actual}</td><td>{result.passed ? "Pass" : "Fail"}</td></tr>)}</tbody></table></div>}
    <button className={s.primary} disabled={!ran} type="button" onClick={() => check(allPassed, allPassed ? revision ? "Revision evidence: shared threshold updated to ≥70; score 60 is now Not eligible, exactly 70 is Eligible, 69 is Not eligible; empty, duplicate and missing-data protections still pass. Expected changes follow the new brief." : "Regression evidence: all six specified tests pass after the inclusive boundary repair. Ordinary, exact-threshold, below-threshold, empty, duplicate and missing-score cases remain covered." : `Failed cases: ${results.filter(result => !result.passed).map(result => result.id).join(", ")}. ${revision ? "Apply the new ≥70 brief without dropping the existing validation routes." : "The exact-threshold test exposes >60; change it to ≥60 and rerun."}`)}><Check aria-hidden="true" />Save test record</button>
  </div>;
}

function Boundaries({ stage, check }: Props) {
  const [limited, setLimited] = useState(false);
  if (stage === 0) return <MatchTable rows={c.testCases.map(test => ({ label: `${test.id} · ${test.description}`, answer: test.expected, why: "Apply the stated rule and retain the empty, duplicate and missing-data routes. Write the expected result before running the implementation." }))} options={[...c.outcomeOptions, "Empty list handled", "Duplicate IDs flagged"]} check={check} success="Six-case matrix: ordinary 72 → Eligible; exact 60 → Eligible; 59 → Not eligible; empty list handled; duplicate IDs flagged; missing score → Review missing data. Expected outcomes were stated before execution." />;
  if (stage === 1) return <TestRunner check={check} />;
  return <div className={v.board}><label className={v.checkRow}><input type="checkbox" checked={limited} onChange={event => setLimited(event.target.checked)} /><span>Passing these examples does not prove correctness for every possible input</span></label><MatchTable rows={c.freshCases} options={c.outcomeOptions} check={(correct, feedback) => check(correct && limited, !limited ? "State the limit of the evidence too: a finite set of passing examples is not proof for every possible input." : feedback)} success="Fresh-case record: 75/incomplete → Needs documents; −1 → Invalid record; supplied 0 → Not eligible rather than missing. Passing these cases still does not prove every possible input." /></div>;
}

function ReviewBoard({ stage, check }: Props) {
  if (stage === 0) return <TestRunner revision check={check} />;
  if (stage === 1) return <ChoiceTask choices={["Copy the threshold into every screen and skip validation to save time", "Use one shared validated check, retest affected and unchanged behaviour, and keep teacher review", "Choose the algorithm with the prettiest output even when its trace is wrong"]} answer={1} feedback="Compare correctness, validation and maintainability. A shared check reduces drift, but still needs tests and an explicit human decision point." success="Design defence: one shared validated check avoids conflicting copies; retest affected outcomes and unchanged protections. A different design needs evidence for correctness and its extra maintenance effort. Real decisions stay with the teacher." check={check} />;
  return <div className={v.board}><div className={a.tableWrap}><table className={a.table}><caption>Unseen case · conflicting records</caption><thead><tr><th>ID</th><th>Score</th><th>Documents</th></tr></thead><tbody><tr><th>B20</th><td>72</td><td>Complete</td></tr><tr><th>B20</th><td>45</td><td>Complete</td></tr></tbody></table></div><ChoiceTask choices={["Pick 72 because it gives the desired outcome and delete the other record", "Award a real scholarship from the higher score", "Preserve both records, flag the duplicate, seek authorised review and add this conflict to the tests"]} answer={2} feedback="The duplicate identity conflict is unresolved. A high score cannot justify overwriting evidence, choosing a convenient row or making a real award." success="Unseen defence: preserve the conflicting B20 records, flag the duplicate and refer it for authorised review. Add the conflict to regression evidence; a correct threshold alone cannot resolve identity ambiguity." check={check} /><p className={s.micro}>Explain the decision and one alternative to your teacher. Structured checks do not automatically assess an individual oral defence.</p></div>;
}

const activities = {
  "decompose-the-scholarship-desk": Decomposition,
  "model-only-what-matters": DataModel,
  "make-the-rules-explicit": ExplicitRules,
  "trace-and-debug-a-decision": TraceDebug,
  "search-and-sort-with-purpose": SearchSort,
  "reuse-a-reliable-step": ReusableStep,
  "test-the-boundaries": Boundaries,
  "algorithm-review-board": ReviewBoard,
};

export function Class11CT(props: CyberLessonComponentProps) {
  const practice = usePractice(props);
  const slug = props.lesson.slug as keyof typeof activities;
  const chapter = c.ctPractice[slug];
  const Activity = activities[slug];
  const artwork = ctArtwork[slug];
  const evidenceKey = `evidence-${slug}`;
  const stored = props.runtime.state[evidenceKey];
  const evidence = stored && typeof stored === "object" && !Array.isArray(stored) ? stored as Record<string, string> : {};
  const illustrated = practice.stage === 0 && ["decompose-the-scholarship-desk", "model-only-what-matters"].includes(slug);
  function check(correct: boolean, feedback: string, unsafe = false) {
    if (correct) props.runtime.updateState({ [evidenceKey]: { ...evidence, [practice.stage]: feedback } });
    practice.submit(correct, feedback, unsafe);
  }
  return <PracticeShell props={props} stage={practice.stage} eyebrow="Scholarship workflow logic lab" brief={chapter.brief} prompt={chapter.prompts[Math.min(practice.stage, 2)]} feedback={practice.feedback} feedbackCorrect={practice.feedbackCorrect} ready={practice.ready} onContinue={practice.continuePractice} onFinish={practice.finish} art="lab"
    evidence={<div className={v.evidence}><h2>Your algorithm evidence record</h2><ol>{Object.values(evidence).map((item, index) => <li key={index}>{item}</li>)}</ol><p>Use the trace, expected outcomes and revisions to explain your reasoning. Your teacher reviews the individual defence separately.</p></div>}>
    <div className={`${a.lab} ${illustrated ? v.illustratedActivity : v.senior}`}>
      {illustrated && <figure className={v.sceneIllustration}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={artwork.src} alt={artwork.alt} width={1400} height={788} decoding="async" loading="lazy" /><figcaption>{artwork.caption}</figcaption>
      </figure>}
      <div className={v.senior}><Activity key={practice.stage} stage={Math.min(practice.stage, 2)} check={check} /></div>
    </div>
  </PracticeShell>;
}
