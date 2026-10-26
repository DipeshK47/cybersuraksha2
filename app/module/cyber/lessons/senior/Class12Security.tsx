"use client";

import { Check, Play } from 'lucide-react';
import { useState } from 'react';
import type { CyberLessonComponentProps } from '../../lesson-types';
import { PracticeShell, usePractice } from '../new/PracticeShell';
import { MatchTable, SequenceBoard } from './Class11Security';
import { ChoiceTask } from './Class11AI';
import { PortalDiagram, SystemArtifact } from './SystemStories';
import * as c from './system-content';
import { systemArtwork } from './system-art';
import s from '../new/practice.module.css';
import v from './security.module.css';
import a from './ai.module.css';
import z from './system.module.css';

type CheckAnswer = (correct: boolean, feedback: string, unsafe?: boolean) => void;
type Props = { stage: number; check: CheckAnswer };
function MapTask({ rows, check, success }: { rows: c.Row[]; check: CheckAnswer; success: string }) {
  return <MatchTable rows={rows} options={[...new Set(rows.map(row => row.answer))]} check={check} success={success} />;
}
function SystemRisk({ stage, check }: Props) {
  if (stage === 0) return <MapTask rows={c.entryRows} check={check} success="Entry check: session identity is authentication; permission for this action on this record is authorisation; exposed contacts create a confidentiality impact. Sign-in alone cannot authorise every record." />;
  if (stage === 1) return <div className={v.board}><PortalDiagram /><MapTask rows={c.systemRows} check={check} success="System map: registration database is an asset; students, organisers and supplier are actors with different tasks; browser → server crosses a trust boundary; registration lead plus weekly access review supplies ownership and a review point." /></div>;
  return <MapTask rows={c.riskRows} check={check} success="Exercise risk register: public export 9 → registration lead first; single gate device 6 → operations lead tests fallback second; editable poster 2 → communications lead retains approved original third. Scores use supplied estimates, not precise real-world measurements; each owner reviews remaining risk." />;
}
function Architecture({ stage, check }: Props) {
  if (stage === 0) return <div className={v.board}><PortalDiagram /><MapTask rows={c.componentRows} check={check} success="Architecture roles: browser gathers/displays untrusted input; server enforces identity, permission and validation; database stays behind constrained service access; DNS locates a hostname and HTTPS protects transport without granting application permission." /></div>;
  if (stage === 1) return <div className={v.board}><PortalDiagram /><MapTask rows={c.boundaryRows} check={check} success="Control locations: trusted session and per-record permission before private data access on the server; constrained service account and structured access at the database boundary; authentic expected payment status at the server/provider boundary using the provider’s documented verification route." /></div>;
  return <ChoiceTask choices={['Assume HTTPS proves the operator is legitimate and every browser payment status is genuine', 'State that the diagram assumes a trusted server identity source and documented provider verification; HTTPS protects only the connection', 'Store database and provider secrets in the browser to reduce friction']} answer={1} feedback="A transport-protected connection does not establish operator legitimacy, a trusted role or payment proof. Keep server identity and provider verification assumptions explicit; no secret belongs in public client code." success="Architecture defence: assumed trusted session source and documented provider verification must be implemented and tested. HTTPS protects the connection to the hostname; it does not certify the operator, authorise a record or prove a payment. This conceptual diagram is not assurance of a real service." check={check} />;
}
function PortalRepair({ check }: { check: CheckAnswer }) {
  const [controls, setControls] = useState<c.PortalControls>({ authorisation: false, validation: false, safeData: false });
  const [ran, setRan] = useState(false);
  const [baselineSeen, setBaselineSeen] = useState(false);
  const results = c.portalCases.map(test => ({ ...test, actual: c.portalResult(test.request, controls) }));
  const fields: [keyof c.PortalControls, string][] = [['authorisation', 'Enforce per-record server authorisation'], ['validation', 'Validate whole-rupee amount 0–5000 on the server'], ['safeData', 'Keep lookup values as data through structured access']];
  return <div className={v.board}><p className={v.callout}>Run the initial draft before changing its controls. The model compares fixed requests and never executes SQL or sends a network request. “Unsafe query construction” describes the draft design, not an executed attack.</p>{fields.map(([key, label]) => <label className={v.checkRow} key={key}><input type="checkbox" disabled={!baselineSeen} checked={controls[key]} onChange={event => { setControls(current => ({ ...current, [key]: event.target.checked })); setRan(false); }} /><span>{label}</span></label>)}<button className={s.secondary} type="button" onClick={() => { setRan(true); if (!Object.values(controls).some(Boolean)) setBaselineSeen(true); }}><Play aria-hidden="true" />Run portal test pack</button>{ran && <div className={a.tableWrap}><table className={`${a.table} ${z.table}`}><caption>Fixed synthetic requests · Expected versus Actual</caption><thead><tr><th>Case</th><th>Expected</th><th>Actual</th></tr></thead><tbody>{results.map(result => <tr key={result.label}><th>{result.label}</th><td>{result.expected}</td><td>{result.actual}<small>{result.expected === result.actual ? 'Pass' : 'Fail'}</small></td></tr>)}</tbody></table></div>}<button className={s.primary} disabled={!ran || !baselineSeen} type="button" onClick={() => { const correct = results.every(result => result.actual === result.expected); check(correct, correct ? 'Before/after test record: the draft exposed the other-owner request, negative amount and unsafe query construction. Repaired server authorisation, amount validation and structured data access now match all four expected outcomes while preserving the valid own-record path. The toy pack is limited evidence, not production assurance.' : 'The unchanged pack still has failing cases. Keep identity checks and add the missing per-record authorisation, amount validation and structured data access; then rerun.', !correct); }}><Check aria-hidden="true" />Save design correction</button></div>;
}
function SecureDesign({ stage, check }: Props) {
  if (stage === 0) return <MapTask rows={c.designRows} check={check} success="Misuse map: negative amount → server validation; another owner’s record → per-record authorisation; query-text mixing → structured/parameterised data access. These controls address different failures and do not replace one another." />;
  if (stage === 1) return <PortalRepair check={check} />;
  return <MapTask rows={c.boundaryCases} check={check} success="Boundary evidence under the fictional rule: own-record ₹0 and ₹5,000 are within range; ₹5,001 is rejected; no trusted session requires sign-in. Range validity does not replace identity or record permission. Real systems may use different amount rules." />;
}
function DependencyBudget({ check }: { check: CheckAnswer }) {
  const [selected, setSelected] = useState<string[]>([]);
  const budget = c.dependencyBudget(selected);
  return <div className={v.board}><div className={z.summary}><output aria-live="polite">Budget used: {budget.cost} / 6 units</output><p>Meet all three supplied requirements. Costs and priorities are invented for this case.</p></div>{c.dependencyControls.map(control => <label className={v.checkRow} key={control.id}><input type="checkbox" checked={selected.includes(control.id)} onChange={() => setSelected(current => current.includes(control.id) ? current.filter(id => id !== control.id) : [...current, control.id])} /><span>{control.label}</span></label>)}<button className={s.primary} disabled={!selected.length} type="button" onClick={() => check(budget.complete, budget.complete ? 'Dependency budget: 6/6 exercise units funds programme-only expiry, privately managed integration secrets/trusted updates and independently tested recovery. A decorative badge and shared password do not meet the stated needs. Supplier failure remains a risk owned by the service lead.' : `Selected cost ${budget.cost}/6. Fund all three required two-unit safeguards, remove the badge/shared-password shortcut and stay within the exercise budget.`, selected.includes('badge'))}><Check aria-hidden="true" />Check dependency budget</button></div>;
}
function Dependencies({ stage, check }: Props) {
  if (stage === 0) return <DependencyBudget check={check} />;
  if (stage === 1) return <MapTask rows={c.supplierRows} check={check} success="Minimum-access agreement: supplier can edit only the programme; named service owner expires and verifies access after Friday; registration contacts and onward sharing remain outside the task. Keep purpose, scope, duration and exit explicit." />;
  return <ChoiceTask choices={['Wait indefinitely because only the failed supplier has the recovery route', 'Publish all integration secrets so anyone can recover the service', 'Use the independently retained recovery route, involve the named owner and test restoration before reopening']} answer={2} feedback="The recovery route must work when this supplier is unavailable. Keep secrets private, involve the accountable owner and verify restored service and access before reopening." success="Outage response: use an independent recovery route with the named owner, preserve private secrets and test restoration before reopening. Document remaining supplier-outage risk and the next review rather than promising uninterrupted availability." check={check} />;
}
function LogTimeline({ check }: { check: CheckAnswer }) {
  const [correction, setCorrection] = useState('0');
  const [ran, setRan] = useState(false);
  const timeline = c.correctedTimeline(c.logEvents, Number(correction));
  return <div className={v.board}><SystemArtifact index={4} /><label className={v.matchRow}><span>Subtract from E2’s fast clock</span><select value={correction} onChange={event => { setCorrection(event.target.value); setRan(false); }}><option value="0">0 minutes</option><option value="2">2 minutes, as supplied</option><option value="5">5 minutes, unsupported guess</option></select></label><button className={s.secondary} type="button" onClick={() => setRan(true)}><Play aria-hidden="true" />Build corrected timeline</button>{ran && <ol className={z.timeline} aria-label="Corrected event timeline">{timeline.map(event => <li key={event.id}><b>{event.id} · corrected {c.clockLabel(event.minute)} · raw {c.clockLabel(event.rawMinute)}</b><span>{event.observation}</span></li>)}</ol>}<button className={s.primary} disabled={!ran} type="button" onClick={() => check(correction === '2', correction === '2' ? 'Evidence timeline: E1 14:00 identity context; E2 corrected 14:01 sharing change (raw 14:03, known +2-minute clock); E3 and E4 14:02 on different paths. Raw records retained. Unknown bytes and session attribution remain unresolved; equal timestamps do not establish a causal order.' : 'Only E2 has a supplied two-minute fast clock. Subtract two from its raw 14:03 time, keep raw values and do not invent corrections for other events.')}><Check aria-hidden="true" />Save evidence timeline</button></div>;
}
function Logs({ stage, check }: Props) {
  if (stage === 0) return <div className={v.board}><SystemArtifact index={4} /><MapTask rows={c.ledgerRows} check={check} success="Evidence ledger: logged gateway status is observed; full-file receipt is a hypothesis; the account holder’s personal involvement is not established; response size and receiver are missing. Maintain uncertainty while authorised staff verify and contain risk." /></div>;
  if (stage === 1) return <LogTimeline check={check} />;
  return <ChoiceTask choices={['The named account holder certainly stole every record', 'Possible session misuse or path-specific denial remains an alternative; obtain request/response and access evidence without accusing a person', 'A 403 on another path proves no exposure occurred anywhere']} answer={1} feedback="The 403 concerns a different path, response bytes are unknown and a session does not establish its human operator. Retain alternatives and seek authorised evidence without accusation." success="Alternative explanation: a session may have been misused, and the 403 may reflect a different protected path. Correlate authorised request, response-size and access evidence; do not equate a session label with personal attribution or dismiss exposure from an unrelated denial." check={check} />;
}
function Tabletop({ stage, check }: Props) {
  if (stage === 0) return <MapTask rows={c.roleRows} check={check} success="Role allocation: incident lead coordinates/authorises/escalates; authorised operator restricts and verifies exposure; recorder retains raw records and action times; communications lead sends approved factual updates. Students only rehearse these roles." />;
  if (stage === 1) return <div className={v.board}><SystemArtifact index={5} /><SequenceBoard steps={c.incidentSteps} check={check} success="Action log: notify authorised lead and preserve available evidence; operator restricts exposure and verifies the restriction; confirm known scope and send an approved factual update; record times, reasons and owners before recovery handoff. Preserve records alongside urgent containment, not as a reason to delay it." /></div>;
  return <ChoiceTask choices={['“A registration-export link was exposed and is now restricted. Scope is under review; use the approved contact for help. We will update you as facts are confirmed.”', '“Asha stole every record. Share her name publicly.”', '“Nothing was received and no further action is needed; we have not checked.”']} answer={0} feedback="Communicate the confirmed exposure and restriction, scope under review and approved help route. Do not attribute blame or guarantee no disclosure without evidence." success="Approved tabletop message: a registration-export link was exposed and is now restricted; scope is under review; use the approved help contact; further factual updates will follow. No person is accused and no unsupported no-disclosure guarantee is made. The exercise sends no message." check={check} />;
}
function RecoveryBench({ check }: { check: CheckAnswer }) {
  const [snapshotId, setSnapshotId] = useState('recent-unsafe');
  const [restored, setRestored] = useState(false);
  const snapshot = c.snapshots.find(snapshot => snapshot.id === snapshotId)!;
  const checks = c.verifyRecovery(snapshot);
  const labels = { complete: 'Exact expected IDs and statuses', access: 'Organiser edit allowed; guest read denied', time: 'Restore at 14:22: downtime 12 minutes ≤30', point: `Snapshot ${c.clockLabel(snapshot.minute)}: data-loss window ≤10 minutes` };
  return <div className={v.board}><SystemArtifact index={6} /><label className={v.matchRow}><span>Snapshot to restore in the offline model</span><select value={snapshotId} onChange={event => { setSnapshotId(event.target.value); setRestored(false); }}><option value="recent-unsafe">14:08 · most recent, incomplete, unsafe guest access</option><option value="clean-1400">14:00 · four expected records, approved permissions</option></select></label><button className={s.secondary} type="button" onClick={() => setRestored(true)}><Play aria-hidden="true" />Restore model and verify</button>{restored && <><div className={a.tableWrap}><table className={`${a.table} ${z.table}`}><caption>Restored synthetic data · expected R10 Confirmed, R20 Pending, R30 and R40 Confirmed</caption><thead><tr><th>Record</th><th>Status</th></tr></thead><tbody>{snapshot.rows.map(row => <tr key={row.id}><th>{row.id}</th><td>{row.status}</td></tr>)}</tbody></table></div><ul className={z.testResults}>{Object.entries(checks).map(([key, passed]) => <li key={key} data-pass={passed}><span>{labels[key as keyof typeof labels]}</span><strong>{passed ? 'Pass' : 'Fail'}</strong></li>)}</ul></>}<button className={s.primary} disabled={!restored} type="button" onClick={() => { const correct = Object.values(checks).every(Boolean); check(correct, correct ? 'Recovery record: clean 14:00 snapshot restores exact R10–R40 IDs/statuses; organiser edit works and guest read is denied. Restored at 14:22: 12-minute downtime and 10-minute data-loss window meet the supplied 30/10-minute objectives. Only these model checks are established; retain evidence and review residual risk.' : 'The recent copy fails completeness and guest-access checks. A newer timestamp and passing timing targets do not make it clean. Select the verified 14:00 point, restore again and rerun all four checks.'); }}><Check aria-hidden="true" />Save recovery test</button></div>;
}
function Recovery({ stage, check }: Props) {
  if (stage === 0) return <MapTask rows={c.objectiveRows} check={check} success="Recovery objectives: time objective limits exercise downtime to 30 minutes; point objective limits data-loss window to 10 minutes. Copy completion alone is insufficient; test exact data and intended access before reopening. These are supplied planning targets, not universal deadlines." />;
  if (stage === 1) return <RecoveryBench check={check} />;
  return <ChoiceTask choices={['Keep the only recovery key with the supplier that just failed', 'Keep an independently available recovery method, schedule a restoration/access test and assign an owner to review the result', 'Skip access tests next time because the copy command worked']} answer={1} feedback="Recovery depends on accessible private recovery methods and repeated data/access tests with a responsible owner. Copy success or supplier dependence leaves the same weakness in place." success="Improvement: retain an independent private recovery route; schedule a harmless restoration test covering exact data and permissions; assign the operations lead a review date and follow up failures. A successful small exercise cannot guarantee every real incident outcome." check={check} />;
}
function Assurance({ stage, check }: Props) {
  if (stage === 0) return <MapTask rows={c.assuranceRows} check={check} success="Tradeoff record: programme-only supplier access protects privacy with an expiry owner; tested gate fallback supports availability within budget with an operations owner; named roles and supported recovery retain usability and accountability. Residual supplier failure and scope uncertainty remain explicit." />;
  if (stage === 1) return <div className={v.board}><SystemArtifact index={7} resolved /><ChoiceTask choices={['All evidence is false because the login alert was maintenance', 'Accuse the account holder despite the correction', 'Revise the login hypothesis, retain containment for the independently confirmed export and continue authorised scope review']} answer={2} feedback="Separate evidence supports separate conclusions. Maintenance explains the login alert; it does not remove the confirmed public export. Correct the hypothesis without ignoring the exposure or accusing a person." success="Assurance revision: initial login alert explained by authorised maintenance; public export remains independently confirmed. Retain the justified access restriction, preserve records and have the incident lead review scope. No unsupported attribution is made." check={check} /></div>;
  return <div className={v.board}><div className={v.callout}>Fresh request: a new supplier wants all participant contacts to publish the programme faster. A limited budget remains, and the supplier promises it never fails.</div><ChoiceTask choices={['Keep programme-only access with expiry; decline unnecessary contacts, retain tested independent recovery and name the owner of remaining outage risk', 'Grant the full export because the supplier promises reliability', 'Use one shared organiser account to avoid assigning roles']} answer={0} feedback="The programme task still does not require contacts. A promise does not remove outage risk. Defend minimal scoped access, expiry, independent tested recovery and accountable ownership against the convenience claim." success="Individual defence outline: decline unnecessary contact export; retain programme-only access with expiry and a named owner; preserve tested independent recovery within budget. Residual supplier failure remains with the operations/service owner for review. Compare the convenience alternative and explain its privacy/accountability cost using the architecture, timeline and recovery evidence." check={check} /><p className={s.micro}>Show your risk register, control locations, timeline, action log and recovery tests. Explain one alternative and remaining uncertainty. Your teacher reviews the individual viva; structured answers do not establish oral understanding or authorship.</p></div>;
}
const activities = {
  'from-personal-safety-to-system-risk': SystemRisk, 'design-the-college-fest-portal': Architecture,
  'secure-by-design': SecureDesign, 'protect-the-whole-dependency-chain': Dependencies,
  'when-logs-disagree': Logs, 'the-breach-tabletop': Tabletop,
  'recover-and-learn': Recovery, 'security-assurance-review': Assurance,
};
export function Class12Security(props: CyberLessonComponentProps) {
  const practice = usePractice(props);
  const slug = props.lesson.slug as keyof typeof activities;
  const chapter = c.systemPractice[slug];
  const Activity = activities[slug];
  const artwork = systemArtwork[slug];
  const evidenceKey = `evidence-${slug}`;
  const stored = props.runtime.state[evidenceKey];
  const evidence = stored && typeof stored === 'object' && !Array.isArray(stored) ? stored as Record<string, string> : {};
  function check(correct: boolean, feedback: string, unsafe = false) {
    if (correct) props.runtime.updateState({ [evidenceKey]: { ...evidence, [practice.stage]: feedback } });
    practice.submit(correct, feedback, unsafe);
  }
  const illustrated = practice.stage === 0 && ['from-personal-safety-to-system-risk', 'the-breach-tabletop'].includes(slug);
  return <PracticeShell props={props} stage={practice.stage} eyebrow="Portal design and incident lab" brief={chapter.brief} prompt={chapter.prompts[Math.min(practice.stage, 2)]} feedback={practice.feedback} feedbackCorrect={practice.feedbackCorrect} ready={practice.ready} onContinue={practice.continuePractice} onFinish={practice.finish} art="lab"
    evidence={<div className={v.evidence}><h2>Your system assurance record</h2><ol>{Object.values(evidence).map((item, index) => <li key={index}>{item}</li>)}</ol><p>Use this checked evidence alongside the earlier portal, timeline and recovery chapter records for your individual explanation. Your teacher reviews the viva separately. All tests use fictional offline models.</p></div>}>
    <div className={`${a.lab} ${illustrated ? v.illustratedActivity : v.senior}`}>
      {illustrated && <figure className={v.sceneIllustration}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={artwork.src} alt={artwork.alt} width={1400} height={788} decoding="async" loading="lazy" /><figcaption>{artwork.caption}</figcaption>
      </figure>}
      <div className={v.senior}><Activity key={practice.stage} stage={Math.min(practice.stage, 2)} check={check} /></div>
    </div>
  </PracticeShell>;
}
