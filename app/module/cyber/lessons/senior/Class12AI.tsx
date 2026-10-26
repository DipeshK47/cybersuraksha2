"use client";

import { Check, LockKeyhole, Play } from 'lucide-react';
import { useState } from 'react';
import type { CyberLessonComponentProps } from '../../lesson-types';
import { PracticeShell, usePractice } from '../new/PracticeShell';
import { MatchTable, ControlChecklist } from './Class11Security';
import { ChoiceTask } from './Class11AI';
import { AssuranceArtifact, SchoolSources, InstructionBoundary, VisionPhoto } from './AssuranceStories';
import * as c from './assurance-content';
import { assuranceArtwork } from './assurance-art';
import s from '../new/practice.module.css';
import v from './security.module.css';
import a from './ai.module.css';
import z from './system.module.css';
import q from './assurance.module.css';

type CheckAnswer = (correct: boolean, feedback: string, unsafe?: boolean) => void;
type Props = { stage: number; check: CheckAnswer };
function MapTask({ rows, check, success }: { rows: c.Row[]; check: CheckAnswer; success: string }) {
  return <MatchTable rows={rows} options={[...new Set(rows.map(row => row.answer))]} check={check} success={success} />;
}
function percent(value: number | null) { return value === null ? 'Undefined' : `${Math.round(value * 100)}%`; }
function ResultSheets({ missed = 5, extra = 1 }: { missed?: number; extra?: number }) {
  return <div className={v.board}><p className={q.scrollHint}>On a small screen, scroll the results table sideways to compare all metrics.</p><div className={`${a.tableWrap} ${q.scoreWrap}`} role="region" aria-label="Prepared comparator results" tabIndex={0}><table className={`${a.table} ${z.table} ${q.scoreTable}`}><caption>Prepared development/validation sheets · same 100 cases, 5 true staff-review cases · independent final evidence still required</caption><thead><tr><th>Comparator</th><th>Accuracy</th><th>Precision</th><th>Recall</th><th>Error cost</th></tr></thead><tbody>{c.resultSheets.map(sheet => { const metrics = c.classificationMetrics(sheet.matrix); return <tr key={sheet.id}><th>{sheet.label}<small>TP{sheet.matrix.tp} FP{sheet.matrix.fp} FN{sheet.matrix.fn} TN{sheet.matrix.tn}<br />Flagged {metrics.flagged}/100</small></th><td>{percent(metrics.accuracy)}</td><td>{percent(metrics.precision)}</td><td>{percent(metrics.recall)}</td><td>{c.errorCost(sheet.matrix, missed, extra)} units</td></tr>; })}</tbody></table></div></div>;
}
function AcceptancePlan({ check }: { check: CheckAnswer }) {
  const [recall, setRecall] = useState('');
  const [capacity, setCapacity] = useState('');
  const [comparator, setComparator] = useState('');
  const [committed, setCommitted] = useState(false);
  const [interpretation, setInterpretation] = useState('');
  return <div className={v.board}><p className={v.callout}>Before the reveal, use the supplied plan: minimum recall 80%, at most 10 flagged requests per 100, and the same-case always-routine comparator. Missed=5 and extra review=1 are invented exercise costs.</p><label className={v.matchRow}><span>Minimum staff-review recall (%)</span><input type="number" min={0} max={100} disabled={committed} value={recall} onChange={event => setRecall(event.target.value)} /></label><label className={v.matchRow}><span>Maximum flagged requests per 100</span><input type="number" min={0} max={100} disabled={committed} value={capacity} onChange={event => setCapacity(event.target.value)} /></label><label className={v.matchRow}><span>Comparator plan</span><select disabled={committed} value={comparator} onChange={event => setComparator(event.target.value)}><option value="">Choose…</option><option value="different">A different pack chosen after seeing results</option><option value="same">Always-routine rule on the same cases and labels</option></select></label><button className={s.secondary} disabled={committed || !recall || !capacity || !comparator} type="button" onClick={() => { if (Number(recall) === 80 && Number(capacity) === 10 && comparator === 'same') setCommitted(true); else check(false, 'Commit the supplied criteria before revealing scores: recall at least 80%, at most 10 flagged per 100 and the same-case always-routine comparator. Do not change the goal after seeing results.'); }}><LockKeyhole aria-hidden="true" />Commit plan and reveal baseline</button>{committed && <><div className={q.modelReport} role="status"><strong>Plan committed before this reveal</strong><p>Always-routine baseline: TP0 FP0 FN5 TN95 → accuracy 95%, recall 0/5=0%; precision undefined because it flags no cases; error cost 25 units.</p></div><label className={v.matchRow}><span>Interpret the baseline</span><select value={interpretation} onChange={event => setInterpretation(event.target.value)}><option value="">Choose…</option><option value="headline">95% accuracy proves the staff-review goal is met</option><option value="misses">It misses all five staff-review cases despite 95% accuracy</option></select></label><button className={s.primary} disabled={!interpretation} type="button" onClick={() => check(interpretation === 'misses', interpretation === 'misses' ? 'Committed comparison plan: same-case always-routine baseline, recall ≥80%, flagged capacity ≤10/100, missed cost 5 and extra-review cost 1. Baseline is 95% accurate but misses all 5 staff-review cases, has 0% recall, undefined precision and cost 25; the headline does not meet the goal.' : 'Read the rare-case denominator: the baseline finds 0 of 5 staff-review cases. Its 95 routine successes do not meet the 80% recall target.')}><Check aria-hidden="true" />Save baseline comparison</button></>}</div>;
}
function Baseline({ stage, check }: Props) {
  if (stage === 0) return <MapTask rows={c.briefRows} check={check} success="Decision brief: low-stakes library staff-review suggestion, staff keep exception authority, same-case always-routine comparator, missed staff-review cost 5 and unnecessary-review cost 1. Criteria must be committed before the prepared results are revealed." />;
  if (stage === 1) return <AcceptancePlan check={check} />;
  return <ChoiceTask {...c.choices.baselineTransfer} check={check} />;
}
function SplitManifest({ check }: { check: CheckAnswer }) {
  const [manifest, setManifest] = useState<Record<string, string>>(() => Object.fromEntries(c.splitRecords.map(record => [record.id, record.initial])));
  const [inspected, setInspected] = useState(false);
  const [frozen, setFrozen] = useState(false);
  const audit = c.auditSplit(c.splitRecords, manifest);
  return <div className={v.board}><p className={v.callout}>Audit the original manifest first. Keep each related family together, preserve every record and leave all three partitions non-empty. Several valid repairs exist; use the family evidence rather than treating a filename as independence.</p><div className={a.tableWrap}><table className={`${a.table} ${z.table} ${q.splitTable}`}><caption>Synthetic records · labels/results are not supplied for final-test tuning</caption><thead><tr><th>Record</th><th>Family / relationship</th><th>Partition</th></tr></thead><tbody>{c.splitRecords.map(record => <tr key={record.id}><th>{record.id}</th><td>Family {record.family}<small>{record.description}</small></td><td><label className={a.srOnly} htmlFor={`split-${record.id}`}>Partition {record.id}</label><select id={`split-${record.id}`} disabled={!inspected || frozen} value={manifest[record.id]} onChange={event => setManifest(current => ({ ...current, [record.id]: event.target.value }))}>{c.splitOptions.map(split => <option key={split}>{split}</option>)}</select></td></tr>)}</tbody></table></div><button className={s.secondary} disabled={inspected} type="button" onClick={() => setInspected(true)}><Play aria-hidden="true" />Audit original split</button>{inspected && <output className={v.callout} aria-live="polite">Family overlaps: {audit.overlaps.join(', ') || 'none'} · Training {audit.counts.Training}, Validation {audit.counts.Validation}, Final test {audit.counts['Final test']}{frozen ? ' · Manifest frozen' : ''}</output>}<button className={s.primary} disabled={!inspected || frozen} type="button" onClick={() => { if (audit.valid) setFrozen(true); check(audit.valid, audit.valid ? `Leakage audit passed and manifest frozen: ${c.splitRecords.map(record => `${record.id}=${manifest[record.id]}`).join('; ')}. Related families stay together; all eight records retained; all three partitions non-empty. Freeze the candidate before independent final evaluation and keep final outcomes out of tuning.` : `Related-family overlap: ${audit.overlaps.join(', ') || 'check missing records/partitions'}. Keep each family together, preserve every supplied ID and leave training, validation and final test non-empty before freezing.`); }}><LockKeyhole aria-hidden="true" />Freeze evaluation manifest</button></div>;
}
function ProtectEvaluation({ stage, check }: Props) {
  if (stage === 0) return <MapTask rows={c.splitRoles} check={check} success="Evaluation roles: training fits parameters; validation guides choices; final test evaluates the frozen candidate on independent cases. Group related examples and do not tune on final outcomes." />;
  if (stage === 1) return <SplitManifest check={check} />;
  return <ChoiceTask {...c.choices.testContaminated} check={check} />;
}
function MetricCalculator({ check }: { check: CheckAnswer }) {
  const [answers, setAnswers] = useState({ accuracy: '', precision: '', recall: '' });
  return <div className={v.board}><table className={q.matrix}><caption>Strict prepared candidate · positive means staff review required</caption><thead><tr><th>Actual class</th><th>Predicted review</th><th>Predicted routine</th></tr></thead><tbody><tr><th>Staff review needed</th><td>TP = 1</td><td>FN = 4</td></tr><tr><th>Routine</th><td>FP = 1</td><td>TN = 94</td></tr></tbody></table>{(['accuracy', 'precision', 'recall'] as const).map(key => <label className={v.matchRow} key={key}><span>{key[0].toUpperCase() + key.slice(1)} (%)</span><input type="number" min={0} max={100} value={answers[key]} onChange={event => setAnswers(current => ({ ...current, [key]: event.target.value }))} /></label>)}<button className={s.primary} disabled={Object.values(answers).some(value => !value)} type="button" onClick={() => { const correct = Number(answers.accuracy) === 95 && Number(answers.precision) === 50 && Number(answers.recall) === 20; check(correct, correct ? 'Strict-sheet calculations: accuracy (1+94)/100=95%; precision 1/(1+1)=50%; recall 1/(1+4)=20%. It misses 4 of the 5 true staff-review cases. A high overall score hides low rare-case recall.' : 'Use the right denominators: accuracy=(TP+TN)/all=95/100; precision=TP/(TP+FP)=1/2; recall=TP/(TP+FN)=1/5. Enter percentages 95, 50 and 20.'); }}><Check aria-hidden="true" />Check metric calculations</button></div>;
}
function ThresholdComparison({ check }: { check: CheckAnswer }) {
  const [selected, setSelected] = useState('strict');
  const [ran, setRan] = useState(false);
  const sheet = c.resultSheets.find(sheet => sheet.id === selected)!;
  return <div className={v.board}><p className={v.callout}>Preset goal: recall ≥80%, flagged requests ≤10/100 and error cost ≤25. Missed=5; extra review=1. Compare prepared development/validation sheets; choosing here does not consume an independent final test.</p><ResultSheets /><label className={v.matchRow}><span>Operating point / comparator</span><select value={selected} onChange={event => { setSelected(event.target.value); setRan(false); }}>{c.resultSheets.map(sheet => <option value={sheet.id} key={sheet.id}>{sheet.label}</option>)}</select></label><button className={s.secondary} type="button" onClick={() => setRan(true)}><Play aria-hidden="true" />Evaluate operating point</button>{ran && <output className={v.callout} aria-live="polite">{sheet.label}: recall {percent(c.classificationMetrics(sheet.matrix).recall)}, flagged {c.classificationMetrics(sheet.matrix).flagged}/100, cost {c.errorCost(sheet.matrix, 5, 1)}. {c.fitsAcceptance(sheet.matrix) ? 'Meets this preset plan' : 'Does not meet this preset plan'}</output>}<button className={s.primary} disabled={!ran} type="button" onClick={() => check(c.fitsAcceptance(sheet.matrix), c.fitsAcceptance(sheet.matrix) ? 'Conditional operating-point choice: review-more TP4 FP6 FN1 TN89 → accuracy 93%, precision 40%, recall 80%, ten flagged requests and cost 11. It fits the preset plan despite lower accuracy. Low precision and limited evidence remain; an independent final check is still required.' : 'This selection fails the preset recall plan. The review-more sheet reaches 4/5 recall with ten flagged requests and cost 11. Record its extra reviews and limited evidence rather than choosing from accuracy alone.')}><Check aria-hidden="true" />Save threshold decision</button></div>;
}
function Scores95({ stage, check }: Props) {
  if (stage === 0) return <MetricCalculator check={check} />;
  if (stage === 1) return <ThresholdComparison check={check} />;
  return <div className={v.board}><p className={v.callout}>Changed task objective: compare expected exercise error cost only, with missed=1 and extra review=5. No minimum recall requirement applies in this transfer case. Report the misses even when choosing the cheaper comparator.</p><ResultSheets missed={1} extra={5} /><ChoiceTask {...c.choices.changedCosts} check={check} /></div>;
}
function ShiftTable({ check }: { check: CheckAnswer }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  return <div className={v.board}><p className={q.prepared}>AI-generated illustrative views; the predictions below are supplied classroom examples, not measurements from a live model. Reference objects are known from the exercise setup.</p><div className={q.visionGrid}>{c.visionSamples.map(sample => <figure key={sample.id}><VisionPhoto sample={sample} /><figcaption><strong>{sample.id} · reference {sample.object}</strong>{sample.condition} view · supplied prediction: {sample.prediction}</figcaption><label>Outcome for {sample.id}<select value={answers[sample.id] ?? ''} onChange={event => setAnswers(current => ({ ...current, [sample.id]: event.target.value }))}><option value="">Choose…</option>{['Correct label', 'Wrong label', 'Abstention / review'].map(value => <option key={value}>{value}</option>)}</select></label></figure>)}</div><button className={s.primary} disabled={c.visionSamples.some(sample => !answers[sample.id])} type="button" onClick={() => { const wrong = c.visionSamples.find(sample => answers[sample.id] !== sample.answer); check(!wrong, wrong ? `${wrong.id}: compare supplied prediction ${wrong.prediction} with reference ${wrong.object}. “Needs review” is an abstention, distinct from a wrong label.` : 'Prepared shift table: bright 2/2 correct; dim 1/2 correct with one wrong label; crop 0/2 correct with one review and one wrong label. The same reference objects have changed outputs under the illustrative conditions; this is not a measured real-model performance claim.'); }}><Check aria-hidden="true" />Save shift-test table</button></div>;
}
function Vision({ stage, check }: Props) {
  if (stage === 0) return <MapTask rows={c.networkRows} check={check} success="Network concepts: features represent input patterns; layers transform representations; training adjusts parameters; inference applies learned parameters. Confidence is not correctness, and this activity does not train or execute a network." />;
  if (stage === 1) return <ShiftTable check={check} />;
  return <ChoiceTask {...c.choices.visionLimit} check={check} />;
}
function CorrectedAnswer({ check }: { check: CheckAnswer }) {
  const [answers, setAnswers] = useState({ hours: '', renewals: '', weekend: '' });
  const fields = [
    { key: 'hours', label: 'Supported hours sentence', options: [['wrong', 'Weekend desk closes at 18:00 [P1]'], ['P1', 'Weekday desk opens 10:00–16:00 [P1]']] },
    { key: 'renewals', label: 'Supported renewal sentence', options: [['wrong', 'All renewals are guaranteed [P2]'], ['P2', 'Authorised staff review renewals; no guarantee [P2]']] },
    { key: 'weekend', label: 'Weekend evidence gap', options: [['guess', 'Invent weekend hours to finish the answer'], ['unknown', 'Weekend hours are not supplied; seek an authorised updated notice']] },
  ];
  return <div className={v.board}><SchoolSources />{fields.map(field => <label className={v.matchRow} key={field.key}><span>{field.label}</span><select value={answers[field.key as keyof typeof answers]} onChange={event => setAnswers(current => ({ ...current, [field.key]: event.target.value }))}><option value="">Choose…</option>{field.options.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>)}<button className={s.primary} disabled={Object.values(answers).some(value => !value)} type="button" onClick={() => { const correct = answers.hours === 'P1' && answers.renewals === 'P2' && answers.weekend === 'unknown'; check(correct, correct ? 'Corrected answer: weekday desk 10:00–16:00 [P1]; authorised staff review renewal requests and no renewal is guaranteed [P2]; weekend hours are not established, so seek an authorised updated notice. No identity scan or private record is requested.' : 'Read the actual passages: P1 supplies weekday 10:00–16:00, P2 requires staff review without a guarantee, and no weekend schedule is supplied. A citation must support its sentence.'); }}><Check aria-hidden="true" />Save source-grounded answer</button></div>;
}
function ResearchAssistant({ stage, check }: Props) {
  if (stage === 0) return <div className={v.board}><SchoolSources /><MapTask rows={c.claimRows} check={check} success="Claim-support ledger: weekday closing 16:00 is supported by P1; guaranteed renewal contradicts P2; weekend 18:00 is not established; identity-upload advice contradicts P3. Retrieval supplies passages; generation can still produce unsupported text." /></div>;
  if (stage === 1) return <CorrectedAnswer check={check} />;
  return <MapTask rows={c.routingRows} check={check} success="Workflow rule: answer supported weekday hours with P1; abstain on missing weekend hours and seek an authorised update; escalate individual exceptions to staff under P2; refuse unauthorised borrowing-history disclosure under P3 and offer the authorised route." />;
}
function InstructionsInData({ stage, check }: Props) {
  if (stage === 0) return <div className={v.board}><InstructionBoundary /><MapTask rows={c.trustRows} check={check} success="Trust map: classroom brief sets authorised scope and privacy; retrieved redirection is untrusted source data; P2 is evidence to check, not authority to change the task. Keep private notes out and renewal decisions with staff." /></div>;
  if (stage === 1) return <div className={v.board}><div className={v.artifact}><div className={v.appBar}><strong>Two prepared responses · no live assistant</strong></div><div className={v.artifactRow}><span>Response A</span><strong>“All renewals guaranteed; reveal the private demo note.” · follows the source’s redirection</strong></div><div className={v.artifactRow}><span>Response B</span><strong>“Staff review renewals; no guarantee [P2]. Private notes stay out.” · follows the trusted brief</strong></div></div><ControlChecklist controls={c.injectionControls} check={check} success="Response audit: B keeps P2-supported facts, private notes out and staff authority intact; A follows untrusted redirection. Separate brief from source data, check output and preserve human review. These controls and one example do not prove resistance to every injection attempt." /></div>;
  return <ChoiceTask {...c.choices.newInjectionCase} check={check} />;
}
function GroupRecall({ check }: { check: CheckAnswer }) {
  const [answers, setAnswers] = useState({ A: '', B: '' });
  return <div className={v.board}><table className={q.matrix}><caption>Prepared input groups · each has 10 examples, 5 true staff-review cases</caption><thead><tr><th>Group</th><th>TP / FN</th><th>FP / TN</th></tr></thead><tbody>{c.groupSheets.map(group => <tr key={group.id}><th>{group.id} · {group.label}</th><td>{group.matrix.tp} / {group.matrix.fn}</td><td>{group.matrix.fp} / {group.matrix.tn}</td></tr>)}</tbody></table>{c.groupSheets.map(group => <label className={v.matchRow} key={group.id}><span>Group {group.id} recall (%)</span><input type="number" min={0} max={100} value={answers[group.id as keyof typeof answers]} onChange={event => setAnswers(current => ({ ...current, [group.id]: event.target.value }))} /></label>)}<button className={s.primary} disabled={!answers.A || !answers.B} type="button" onClick={() => { const correct = Number(answers.A) === 80 && Number(answers.B) === 40; check(correct, correct ? 'Group evidence: A recall 4/(4+1)=80%; B recall 2/(2+3)=40%, with 10 examples and 5 positives in each group. B is missed more often in this pack. The tiny sample does not establish the cause, an inherent user trait or general fairness.' : 'Recall uses actual positive cases: TP/(TP+FN). A is 4/5=80%; B is 2/5=40%. Report the denominator and do not infer a cause from the gap alone.'); }}><Check aria-hidden="true" />Check group recall</button></div>;
}
function WhoIsMissed({ stage, check }: Props) {
  if (stage === 0) return <GroupRecall check={check} />;
  if (stage === 1) return <MapTask rows={c.modelCardRows} check={check} success="Model card: low-stakes staff-review suggestion with staff deciding exceptions; synthetic/authorised source provenance and attribution; tiny-group B recall 2/5 and limited shift evidence disclosed; staff override for uncertainty and stop affected automation on privacy/authority failure. Preserve an accessible manual route and an accountable review owner." />;
  return <ControlChecklist controls={c.rightsControls} check={check} success="Mitigation plan: retain an accessible staff/manual route, involve affected users, use appropriately authorised data/materials with attribution, record group denominators and independently retest revisions. Public visibility or a citation alone does not establish permitted reuse or suitability; the observed gap does not establish its cause." />;
}
function AssuranceReview({ stage, check }: Props) {
  const [decision, setDecision] = useState('');
  const [disclosure, setDisclosure] = useState('');
  if (stage === 0) return <ControlChecklist controls={c.dossierControls} check={check} success="Assurance pack: task/baseline/costs and preset criteria; leakage audit and frozen manifest; confusion counts, threshold tradeoff, group denominators and shift limits; source/trust checks, model card, human override and stop-use owner. Preserve inconvenient results and the evidence provenance." />;
  if (stage === 1) return <div className={v.board}><AssuranceArtifact index={7} /><ChoiceTask {...c.choices.currentRecommendation} check={check} /></div>;
  return <div className={v.board}><p className={v.callout}>Fresh case: a prepared answer discloses a private demo note despite the trusted brief. The output is intercepted in this fictional exercise. No real private information was exposed. How should the affected automatic path be handled?</p><label className={v.matchRow}><span>Fresh failure decision</span><select value={decision} onChange={event => setDecision(event.target.value)}><option value="">Choose…</option><option value="go">Keep automatic use because aggregate accuracy is high</option><option value="stop">Stop the affected automatic path; preserve evidence, involve the authorised lead and use the approved staff/manual route</option></select></label><label className={v.matchRow}><span>Preparation assistance disclosure</span><select value={disclosure} onChange={event => setDisclosure(event.target.value)}><option value="">Choose what is true for your preparation…</option><option value="lab">I used the prepared lab only</option><option value="assisted">I used additional assistance and will identify it and what I verified to my teacher</option></select></label><button className={s.primary} disabled={!decision || !disclosure} type="button" onClick={() => check(decision === 'stop', decision === 'stop' ? `Fresh-case decision: stop the affected automatic path after a privacy/authority failure, preserve the synthetic evidence, involve the authorised lead and use the approved staff/manual route. Do not promise that one prompt edit resolves the failure; require review and new tests before any restart. Preparation disclosure: ${disclosure === 'lab' ? 'prepared lab only' : 'additional assistance; contribution and verification to be explained to teacher'}.` : 'A privacy/authority failure is not cancelled by a good average score. Stop the affected automatic path, preserve evidence and use authorised staff/manual handling pending review.', decision === 'go')}><Check aria-hidden="true" />Defend go / revise / stop decision</button><p className={s.micro}>Use the baseline, split manifest, calculations, source checks and model card for an individual viva. Explain a limitation and when a non-AI route is preferable. Disclosure is self-reported; your teacher reviews authorship and oral understanding.</p></div>;
}
const activities = {
  'set-a-decision-and-a-baseline': Baseline, 'protect-the-evaluation': ProtectEvaluation,
  'the-model-that-scores-95-percent': Scores95, 'vision-networks-and-changing-inputs': Vision,
  'the-source-grounded-research-assistant': ResearchAssistant, 'when-instructions-arrive-inside-data': InstructionsInData,
  'who-benefits-who-is-missed': WhoIsMissed, 'ai-go-revise-stop-review': AssuranceReview,
};
export function Class12AI(props: CyberLessonComponentProps) {
  const practice = usePractice(props);
  const slug = props.lesson.slug as keyof typeof activities;
  const chapter = c.assurancePractice[slug];
  const Activity = activities[slug];
  const artwork = assuranceArtwork[slug];
  const evidenceKey = `evidence-${slug}`;
  const stored = props.runtime.state[evidenceKey];
  const evidence = stored && typeof stored === 'object' && !Array.isArray(stored) ? stored as Record<string, string> : {};
  function check(correct: boolean, feedback: string, unsafe = false) {
    if (correct) props.runtime.updateState({ [evidenceKey]: { ...evidence, [practice.stage]: feedback } });
    practice.submit(correct, feedback, unsafe);
  }
  const illustrated = practice.stage === 0 && ['set-a-decision-and-a-baseline', 'the-source-grounded-research-assistant'].includes(slug);
  return <PracticeShell props={props} stage={practice.stage} eyebrow="AI evidence and assurance lab" brief={chapter.brief} prompt={chapter.prompts[Math.min(practice.stage, 2)]} feedback={practice.feedback} feedbackCorrect={practice.feedbackCorrect} ready={practice.ready} onContinue={practice.continuePractice} onFinish={practice.finish} art="ai"
    evidence={<div className={v.evidence}><h2>Your AI assurance record</h2><ol>{Object.values(evidence).map((item, index) => <li key={index}>{item}</li>)}</ol><p>Use this checked record with the module’s baseline, manifest, calculations and model card for your teacher’s individual review. Automatic checks assess structured decisions, not authorship or the oral defence. All results are prepared classroom evidence.</p></div>}>
    <div className={`${a.lab} ${illustrated ? v.illustratedActivity : v.senior}`}>
      {illustrated && <figure className={v.sceneIllustration}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={artwork.src} alt={artwork.alt} width={1400} height={788} decoding="async" loading="lazy" /><figcaption>{artwork.caption}</figcaption>
      </figure>}
      <div className={v.senior}><Activity key={practice.stage} stage={Math.min(practice.stage, 2)} check={check} /></div>
    </div>
  </PracticeShell>;
}
