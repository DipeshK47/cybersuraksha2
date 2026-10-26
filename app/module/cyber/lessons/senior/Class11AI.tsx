"use client";

import { Check, Play, RotateCcw } from "lucide-react";
import { useState } from "react";
import type { CyberLessonComponentProps } from "../../lesson-types";
import { PracticeShell, usePractice } from "../new/PracticeShell";
import { MatchTable, ControlChecklist } from "./Class11Security";
import { selectedExactly } from "./security-content";
import * as c from "./ai-content";
import { aiArtwork } from "./ai-art";
import s from "../new/practice.module.css";
import v from "./security.module.css";
import a from "./ai.module.css";

type CheckAnswer = (correct: boolean, feedback: string, unsafe?: boolean) => void;
type Props = { stage: number; check: CheckAnswer };

export function ChoiceTask({ choices, answer, feedback, success, check }: { choices: string[]; answer: number; feedback: string; success: string; check: CheckAnswer }) {
  const [selected, setSelected] = useState<number | null>(null);
  return <div className={v.board}><div className={v.actionBank}>{choices.map((choice, index) => <button type="button" className={s.choice} aria-pressed={selected === index} key={choice} onClick={() => setSelected(index)}>{choice}</button>)}</div><button type="button" className={s.primary} disabled={selected === null} onClick={() => check(selected === answer, selected === answer ? success : feedback)}><Check aria-hidden="true" />Check decision</button></div>;
}

function Approach({ stage, check }: Props) {
  const [quantity, setQuantity] = useState("3");
  const [ran, setRan] = useState(false);
  const [total, setTotal] = useState("");
  const [reason, setReason] = useState("");
  if (stage === 0) return <MatchTable rows={c.approachTasks} options={["Explicit rule", "Learned prediction", "Generated response"]} check={check} success="Task selection: exact bill → rule; sample image → learned prediction; checked volunteer draft → generation. Choose from the task, not the tool's novelty." />;
  if (stage === 2) return <ChoiceTask choices={["Let the assistant invent the missing policy", "Ask the organising teacher through the known school route; mark the answer as unestablished", "Treat a confident answer as the official policy"]} answer={1} feedback="The source pack does not answer the question. A generated response cannot establish a missing official policy; use the responsible known source." success="Transfer decision: the policy is not established by the pack. Ask the responsible teacher through a known route and keep the uncertainty visible." check={check} />;
  return <div className={v.board}><p className={v.callout}>Ticket price: ₹20. No discount. Change the quantity and run the explicit rule. Then check the required case: 3 tickets.</p><label className={v.matchRow}><span>Try a quantity</span><select value={quantity} onChange={event => { setQuantity(event.target.value); setRan(false); }}>{[1, 3, 5].map(value => <option key={value}>{value}</option>)}</select></label><button type="button" className={s.secondary} onClick={() => setRan(true)}><Play aria-hidden="true" />Run bill rule</button>{ran && <output className={v.callout} aria-live="polite">{quantity} × ₹20 = ₹{Number(quantity) * 20}</output>}
    <label className={v.matchRow}><span>Total for exactly 3 tickets (₹)</span><input type="number" min={0} value={total} onChange={event => setTotal(event.target.value)} /></label>
    <label className={v.matchRow}><span>Why use this approach?</span><select value={reason} onChange={event => setReason(event.target.value)}><option value="">Choose a reason…</option><option value="rule">The fixed prices define exact arithmetic</option><option value="guess">A generated estimate is always more accurate</option></select></label>
    <button className={s.primary} type="button" disabled={!ran || !total || !reason} onClick={() => check(Number(total) === 60 && reason === "rule", Number(total) !== 60 ? "The required case is 3 × ₹20 = ₹60, even if you experimented with another quantity." : reason !== "rule" ? "Known fixed prices give an exact, traceable rule. A generated estimate is unnecessary." : "Rule test: 3 × ₹20 = ₹60. The arithmetic is exact and traceable; this task does not need an AI estimate.")}><Check aria-hidden="true" />Save approach evidence</button>
  </div>;
}

function ProblemBrief({ stage, check }: Props) {
  const [pack, setPack] = useState("");
  const [target, setTarget] = useState("");
  const [fallback, setFallback] = useState("");
  if (stage === 0) return <MatchTable rows={c.briefFields} options={c.briefFields.map(field => field.answer)} check={check} success="Brief: festival volunteers submit practice images; the helper suggests a material label or review. Check fixed held-out results and retain human review for unfamiliar samples." />;
  if (stage === 1) return <MatchTable rows={c.reviewRoutes} options={["Request human review", "Outside the task", "Suggest and allow review"]} check={check} success="Human role: familiar samples receive reviewable suggestions; unfamiliar samples request review; identifying students is outside the defined task." />;
  return <div className={v.board}><p className={v.callout}>For this fictional pilot, define a criterion before testing: at least 9 correct out of 12 fixed held-out examples, with unfamiliar samples sent for human review. This is a classroom target, not a validated deployment standard.</p>
    <label className={v.matchRow}><span>Evaluation pack</span><select value={pack} onChange={event => setPack(event.target.value)}><option value="">Choose…</option><option value="easy">Only the easiest examples after results are known</option><option value="fixed">12 held-out examples fixed before testing</option></select></label>
    <label className={v.matchRow}><span>Minimum correct predictions</span><input type="number" min={0} max={12} value={target} onChange={event => setTarget(event.target.value)} /></label>
    <label className={v.matchRow}><span>Unfamiliar sample</span><select value={fallback} onChange={event => setFallback(event.target.value)}><option value="">Choose…</option><option value="force">Force an automatic label</option><option value="review">Send for human review</option></select></label>
    <button className={s.primary} disabled={!pack || !target || !fallback} type="button" onClick={() => check(pack === "fixed" && Number(target) === 9 && fallback === "review", pack === "fixed" && Number(target) === 9 && fallback === "review" ? "Acceptance criterion: at least 9/12 correct on a pre-fixed held-out pack; unfamiliar samples go to human review. The target is an exercise proposal and does not establish general reliability." : "Use the brief: a fixed unseen pack, at least 9/12 correct and human review for unfamiliar inputs.")}><Check aria-hidden="true" />Save acceptance criterion</button>
  </div>;
}

function DatasetRepair({ stage, check }: Props) {
  const [labels, setLabels] = useState<Record<string, string>>({});
  if (stage === 1) return <MatchTable rows={c.duplicateRows} options={["Keep separate sample", "Quarantine conflict", "Remove proven duplicate"]} check={check} success="Quality log: remove the proven repeated S1 record; retain the separate S8 sample; quarantine conflicting S9 evidence for investigation." />;
  if (stage === 2) return <ChoiceTask choices={["Declare the bright-only collection representative of all conditions", "Invent missing dim-condition examples", "State the bright-only limitation and collect separate varied examples with a fresh evaluation pack"]} answer={2} feedback="The collection does not establish dim-condition performance. Record that limitation and collect suitable new evidence instead of inventing rows or claiming broad coverage." success="Data card: tiny synthetic bright-only collection; label repairs are traceable, unknowns are quarantined and dim conditions remain unevaluated. Collect varied examples and a separate fresh test." check={check} />;
  return <div className={v.board}><div className={a.tableWrap}><table className={a.table}><caption>Supplied synthetic observations · select a justified label or quarantine</caption><thead><tr><th>Record</th><th>Observation / old label</th><th>Repaired label</th></tr></thead><tbody>{c.repairRows.map(row => <tr key={row.id}><th>{row.id}</th><td>{row.observation}<small>Old label: {row.original}</small></td><td><label className={a.srOnly} htmlFor={`repair-${row.id}`}>Repair {row.id}</label><select id={`repair-${row.id}`} value={labels[row.id] ?? ""} onChange={event => setLabels(current => ({ ...current, [row.id]: event.target.value }))}><option value="">Choose…</option>{["Paper", "Metal", "Plastic", "Quarantine"].map(label => <option key={label}>{label}</option>)}</select></td></tr>)}</tbody></table></div><button className={s.primary} disabled={c.repairRows.some(row => !labels[row.id])} type="button" onClick={() => { const wrong = c.repairRows.find(row => labels[row.id] !== row.answer); check(!wrong, wrong ? `${wrong.id}: ${wrong.why}` : "Repair log: S1 corrected to Paper from its supplied observation; S2 Metal and S4 Plastic retained; S3 quarantined because its material observation is missing. No unknown value was invented."); }}><Check aria-hidden="true" />Record dataset repairs</button></div>;
}

function LearningLab({ stage, check }: Props) {
  const [selected, setSelected] = useState<string[]>(["P1", "P2"]);
  const [committed, setCommitted] = useState<string[] | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [decision, setDecision] = useState("");
  if (stage === 0) return <MatchTable rows={c.learningMethods} options={["Clustering", "Regression", "Supervised classification"]} check={check} success="Method map: labelled categories → supervised classification; unlabelled similarity groups → clustering; a numerical queue-length prediction → regression." />;
  if (stage === 2) return <ChoiceTask choices={["Add revealed test answers to training and report that same test as independent", "Use new training examples separately and reserve a fresh held-out check before claiming an improvement", "Remove every test the model misses"]} answer={1} feedback="Changing training with the old test answers compromises that evaluation. Collect new training evidence separately and use a fresh independent check for the revised model." success="Transfer plan: revise training separately, preserve earlier results and use a fresh held-out check. Do not relabel an answer-informed evaluation as independent." check={check} />;
  const training = c.trainingExamples.filter(example => selected.includes(example.id));
  const predictions = c.heldOutExamples.map(example => c.nearestPrediction(training, example) ?? "Needs review");
  return <div className={v.board}><p className={v.callout}>Invented feature coordinates, not real material measurements. Start with paper-only training, observe predictions, then add both Metal examples. Distance = |x₁−x₂| + |y₁−y₂|. Equal-nearest labels that disagree request review.</p>
    <div className={a.sampleGrid}>{c.trainingExamples.map(example => <label className={v.checkRow} key={example.id}><input type="checkbox" disabled={committed !== null} checked={selected.includes(example.id)} onChange={() => setSelected(current => current.includes(example.id) ? current.filter(id => id !== example.id) : [...current, example.id])} /><span><strong>{example.id} · {example.label}</strong><small>Features ({example.x}, {example.y})</small></span></label>)}</div>
    <div className={a.tableWrap}><table className={a.table}><caption>Held-out examples · labels stay hidden until predictions are committed</caption><thead><tr><th>Case</th><th>Features</th><th>Prediction</th><th>Held-out label</th></tr></thead><tbody>{c.heldOutExamples.map((example, index) => <tr key={example.id}><th>{example.id}</th><td>({example.x}, {example.y})</td><td>{committed?.[index] ?? predictions[index]}</td><td>{revealed ? example.label : "Hidden"}</td></tr>)}</tbody></table></div>
    <div className={s.controls}><button className={s.secondary} disabled={selected.length !== 4 || committed !== null} type="button" onClick={() => setCommitted([...predictions])}><Play aria-hidden="true" />Commit predictions</button><button className={s.secondary} disabled={committed === null || revealed} type="button" onClick={() => setRevealed(true)}>Reveal held-out labels</button><button className={s.secondary} type="button" onClick={() => { setCommitted(null); setRevealed(false); setDecision(""); }}><RotateCcw aria-hidden="true" />Reset experiment</button></div>
    {revealed && <><label className={v.matchRow}><span>Interpret the tied T3 result</span><select value={decision} onChange={event => setDecision(event.target.value)}><option value="">Choose…</option><option value="force">A tie proves a real material label</option><option value="review">The toy method cannot decide; ask a person</option></select></label><button className={s.primary} disabled={!decision} type="button" onClick={() => check(decision === "review", decision === "review" ? "Learning record: adding Metal training examples changes T2 to Metal. Predictions were committed before labels appeared. T3 has equally near disagreeing labels and requests human review; this tiny demo does not establish material-detector reliability." : "A tie is a limit of this toy method, not proof of a material. Refer it for review and keep test labels out of training.")}><Check aria-hidden="true" />Save learning record</button></>}
  </div>;
}

function EvaluationTable() {
  return <div className={a.tableWrap}><table className={a.table}><caption>Same held-out pack for both approaches · training majority baseline: always Recycle</caption><thead><tr><th>Case</th><th>Actual</th><th>Model</th><th>Baseline</th></tr></thead><tbody>{c.evaluationRows.map(row => <tr key={row.id}><th>{row.id}</th><td>{row.actual}</td><td>{row.predicted}</td><td>Recycle</td></tr>)}</tbody></table></div>;
}

function Measure({ stage, check }: Props) {
  const [model, setModel] = useState("");
  const [baseline, setBaseline] = useState("");
  const [mistakes, setMistakes] = useState<string[]>([]);
  if (stage === 2) return <ChoiceTask choices={["The model got 6/8 correct versus baseline 5/8 on this pack; a larger representative evaluation is still needed", "The model is universally 75% accurate", "Testing only easy examples guarantees reliability"]} answer={0} feedback="Keep the count, comparator and sample limitation in the claim. A convenient or tiny sample cannot establish universal performance." success="Results claim: model 6/8, baseline 5/8 on the same held-out pack. One extra correct case is limited evidence; inspect error types and evaluate more representative cases." check={check} />;
  const result = c.comparison(c.evaluationRows, "Recycle");
  return <div className={v.board}><EvaluationTable />{stage === 0 ? <><label className={v.matchRow}><span>Correct model predictions (out of 8)</span><input type="number" min={0} max={8} value={model} onChange={event => setModel(event.target.value)} /></label><label className={v.matchRow}><span>Correct baseline predictions (out of 8)</span><input type="number" min={0} max={8} value={baseline} onChange={event => setBaseline(event.target.value)} /></label><button className={s.primary} disabled={!model || !baseline} type="button" onClick={() => check(Number(model) === result.modelCorrect && Number(baseline) === result.baselineCorrect, Number(model) === result.modelCorrect && Number(baseline) === result.baselineCorrect ? "Results table: model 6/8 correct (2 mistakes); always-Recycle baseline 5/8 correct (3 mistakes). Both faced the same held-out cases." : "Count where each prediction equals Actual. Model misses E3 and E8; the baseline misses all three Residual examples.")}><Check aria-hidden="true" />Check counts</button></> : <><p className={v.callout}>Mark every model mistake. Do not flag cases where the model matches Actual.</p><div className={a.sampleGrid}>{c.evaluationRows.map(row => <label className={v.checkRow} key={row.id}><input type="checkbox" checked={mistakes.includes(row.id)} onChange={() => setMistakes(current => current.includes(row.id) ? current.filter(id => id !== row.id) : [...current, row.id])} /><span>{row.id}</span></label>)}</div><button className={s.primary} disabled={!mistakes.length} type="button" onClick={() => check(selectedExactly(mistakes, ["E3", "E8"]), selectedExactly(mistakes, ["E3", "E8"]) ? "Error ledger: E3 Recycle → Residual, E8 Residual → Recycle. The two directions have different practical consequences; the overall score hides that detail." : "Compare Actual with Model in each row. E3 and E8 disagree; the other six match.")}><Check aria-hidden="true" />Record missed cases</button></>}</div>;
}

function Representation({ stage, check }: Props) {
  const [bright, setBright] = useState("");
  const [dim, setDim] = useState("");
  if (stage === 1) return <div className={v.board}><div className={a.comparison}><div><strong>Same supplied object</strong><p>Plain background → Paper</p></div><div><strong>Only background changed</strong><p>Blue corner mark → Metal</p></div></div><ChoiceTask choices={["The result proves the material itself changed", "The background may be an irrelevant proxy; repeat controlled checks before claiming a cause", "A corner mark is a valid material label"]} answer={1} feedback="The object was held constant while background changed. Investigate possible background reliance with controlled repetitions; one pair does not prove a general causal account." success="Proxy investigation: the same object received a different prediction after a background change. This suggests possible background reliance, requiring controlled repeat checks rather than a universal causal claim." check={check} /></div>;
  if (stage === 2) return <ChoiceTask choices={["Collect varied bright and dim examples separately, keep a fresh evaluation pack and request review for unsupported conditions", "Delete the dim failures from the results", "Invent dim labels and force every prediction"]} answer={0} feedback="Preserve the original results, improve relevant coverage with supported labels, evaluate independently and keep human review for cases outside coverage." success="Mitigation: collect supported varied examples across conditions, evaluate with a fresh held-out pack, compare group errors and retain a human fallback. The current comparison does not prove the sole cause of the gap." check={check} />;
  return <div className={v.board}><div className={a.comparison}>{c.groupResults.map(group => <div key={group.name}><strong>{group.name} conditions</strong><p>{group.correct} correct / {group.total} examples</p><div className={a.resultTrack} aria-hidden="true"><span style={{ transform: `scaleX(${group.correct / group.total})` }} /></div></div>)}</div><label className={v.matchRow}><span>Bright errors (out of 8)</span><input type="number" min={0} max={8} value={bright} onChange={event => setBright(event.target.value)} /></label><label className={v.matchRow}><span>Dim errors (out of 8)</span><input type="number" min={0} max={8} value={dim} onChange={event => setDim(event.target.value)} /></label><button className={s.primary} disabled={!bright || !dim} type="button" onClick={() => check(Number(bright) === 1 && Number(dim) === 5, Number(bright) === 1 && Number(dim) === 5 ? "Group comparison: Bright 1/8 errors, Dim 5/8 errors. The supplied dim group has more errors; investigate coverage and alternative explanations without asserting a sole cause." : "Errors = total − correct: Bright 8−7 = 1; Dim 8−3 = 5. Keep the same denominator in both comparisons.")}><Check aria-hidden="true" />Compare group errors</button></div>;
}

function SourcePack() {
  return <div className={a.sources} aria-label="Fictional source pack">{c.sourcePack.map(source => <article key={source.id}><strong>{source.id} · {source.title}</strong><p>{source.text}</p></article>)}</div>;
}

function AssistantAudit({ stage, check }: Props) {
  const [meeting, setMeeting] = useState("");
  const [glass, setGlass] = useState("");
  const [statistic, setStatistic] = useState("");
  if (stage === 0) return <div className={v.board}><SourcePack /><MatchTable rows={c.assistantClaims} options={["Not established", "Supported", "Contradicted"]} check={check} success="Claim ledger: meeting time is supported by F1; student glass sorting contradicts F2; the 90% waste-reduction claim is not established by F3." /></div>;
  if (stage === 1) return <ControlChecklist controls={c.instructionControls} check={check} success="Revised instruction: answer only from the supplied pack, cite relevant passages, state when evidence is absent and use fictional details without personal records." />;
  return <div className={v.board}><SourcePack /><label className={v.matchRow}><span>Meeting sentence</span><select value={meeting} onChange={event => setMeeting(event.target.value)}><option value="">Choose…</option><option value="F1">Meet Friday, 15:30, Room B [F1]</option><option value="guess">Meet at an invented time [F1]</option></select></label><label className={v.matchRow}><span>Glass sentence</span><select value={glass} onChange={event => setGlass(event.target.value)}><option value="">Choose…</option><option value="unsafe">Students sort glass themselves [F2]</option><option value="F2">Glass collection is adult-led [F2]</option></select></label><label className={v.matchRow}><span>Waste-reduction statistic</span><select value={statistic} onChange={event => setStatistic(event.target.value)}><option value="">Choose…</option><option value="invent">Keep the invented 90% claim</option><option value="F3">No percentage reduction was measured [F3]</option></select></label><button className={s.primary} disabled={!meeting || !glass || !statistic} type="button" onClick={() => check(meeting === "F1" && glass === "F2" && statistic === "F3", meeting === "F1" && glass === "F2" && statistic === "F3" ? "Corrected response: volunteers meet Friday at 15:30 in Room B [F1]. Glass collection is adult-led in this exercise [F2]. No percentage reduction in waste was measured [F3]." : "A citation must match the passage: F1 supplies the meeting, F2 requires adult-led glass collection, and F3 contains no percentage reduction.")}><Check aria-hidden="true" />Save corrected response</button></div>;
}

function EvaluationReview({ stage, check }: Props) {
  const [decision, setDecision] = useState("");
  const [disclosure, setDisclosure] = useState("");
  if (stage === 0) return <ControlChecklist controls={c.dossierControls} check={check} success="Evaluation dossier: intended use and human role; quality log and coverage limits; model 6/8 versus baseline 5/8 on the same pack; Bright 1/8 errors versus Dim 5/8; mitigation and stop-use criteria." />;
  if (stage === 1) return <div className={v.board}><p className={v.callout}>Evidence: model 6/8, baseline 5/8 on one tiny test; Bright errors 1/8, Dim errors 5/8; no human fallback in the current proposal. This is insufficient evidence for wider automatic use.</p><ChoiceTask choices={["Use automatically everywhere because 6 is greater than 5", "Revise coverage and human review, preserve the results and independently evaluate again", "Hide dim-condition errors in the overall average"]} answer={1} feedback="A small average improvement does not resolve the known coverage and human-review gaps. Revise and independently evaluate before wider use." success="Recommendation: revise before wider use. Improve coverage, add human review, preserve original results and evaluate changes on a fresh independent pack; retain a manual baseline meanwhile." check={check} /></div>;
  return <div className={v.board}><p className={v.callout}>Unseen case: the festival moves to an evening courtyard. This condition was not evaluated. State a next action and disclose how you prepared your recommendation.</p><label className={v.matchRow}><span>Changed-condition decision</span><select value={decision} onChange={event => setDecision(event.target.value)}><option value="">Choose…</option><option value="go">Reuse the earlier score as proof for evening use</option><option value="pause">Pause automatic use; use manual review and gather separate evening evidence</option></select></label><label className={v.matchRow}><span>My assistance disclosure</span><select value={disclosure} onChange={event => setDisclosure(event.target.value)}><option value="">Choose what is true for your work…</option><option value="lab">I used this prepared lab and no additional AI tool</option><option value="assisted">I used additional AI assistance; I will identify it and explain what I verified to my teacher</option></select></label><button className={s.primary} disabled={!decision || !disclosure} type="button" onClick={() => check(decision === "pause", decision === "pause" ? `Transfer decision: pause automatic use in the untested evening setting, retain manual review, collect separate supported evidence and use a fresh evaluation. Assistance disclosure: ${disclosure === "lab" ? "prepared lab only" : "additional AI assistance; details and verification to be explained to teacher"}.` : "The earlier test does not establish evening performance. Keep a manual route, collect relevant evidence and evaluate the changed conditions before relying on automatic output.")}><Check aria-hidden="true" />Defend evaluation decision</button><p className={s.micro}>Disclosure is self-reported. Your teacher reviews your independent explanation; selecting an option does not verify authorship.</p></div>;
}

const activities = {
  "is-ai-needed-here": Approach,
  "frame-a-useful-ai-problem": ProblemBrief,
  "repair-the-dataset": DatasetRepair,
  "how-a-model-learns": LearningLab,
  "measure-mistakes-not-confidence": Measure,
  "whose-examples-are-missing": Representation,
  "can-this-assistant-be-trusted": AssistantAudit,
  "ai-evaluation-review": EvaluationReview,
};

export function Class11AI(props: CyberLessonComponentProps) {
  const practice = usePractice(props);
  const slug = props.lesson.slug as keyof typeof activities;
  const chapter = c.aiPractice[slug];
  const Activity = activities[slug];
  const artwork = aiArtwork[slug];
  const evidenceKey = `evidence-${slug}`;
  const stored = props.runtime.state[evidenceKey];
  const evidence = stored && typeof stored === "object" && !Array.isArray(stored) ? stored as Record<string, string> : {};
  const illustrated = practice.stage === 0 && ["is-ai-needed-here", "frame-a-useful-ai-problem", "repair-the-dataset"].includes(slug);
  function check(correct: boolean, feedback: string, unsafe = false) {
    if (correct) props.runtime.updateState({ [evidenceKey]: { ...evidence, [practice.stage]: feedback } });
    practice.submit(correct, feedback, unsafe);
  }
  return <PracticeShell props={props} stage={practice.stage} eyebrow="Festival AI evaluation lab" brief={chapter.brief} prompt={chapter.prompts[Math.min(practice.stage, 2)]} feedback={practice.feedback} feedbackCorrect={practice.feedbackCorrect} ready={practice.ready} onContinue={practice.continuePractice} onFinish={practice.finish} art="ai"
    evidence={<div className={v.evidence}><h2>Your AI evaluation record</h2><ol>{Object.values(evidence).map((item, index) => <li key={index}>{item}</li>)}</ol><p>Use this evidence for your teacher’s individual review. The automatic checks assess structured decisions, not the quality of an oral defence.</p></div>}>
    <div className={`${a.lab} ${illustrated ? v.illustratedActivity : v.senior}`}>
      {illustrated && <figure className={v.sceneIllustration}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={artwork.src} alt={artwork.alt} width={1400} height={788} decoding="async" loading="lazy" /><figcaption>{artwork.caption}</figcaption>
      </figure>}
      <div className={v.senior}><Activity key={practice.stage} stage={Math.min(practice.stage, 2)} check={check} /></div>
    </div>
  </PracticeShell>;
}
