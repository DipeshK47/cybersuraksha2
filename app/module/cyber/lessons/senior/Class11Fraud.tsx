"use client";

import { Check, FileText, PhoneOff } from 'lucide-react';
import { useState } from 'react';
import type { CyberLessonComponentProps } from '../../lesson-types';
import { PracticeShell, usePractice } from '../new/PracticeShell';
import { MatchTable, ControlChecklist } from './Class11Security';
import { ChoiceTask } from './Class11AI';
import { FraudArtifact } from './FraudStories';
import * as c from './fraud-content';
import { fraudArtwork } from './fraud-art';
import s from '../new/practice.module.css';
import v from './security.module.css';
import a from './ai.module.css';
import f from './fraud.module.css';

type CheckAnswer = (correct: boolean, feedback: string, unsafe?: boolean) => void;
type Draft = Record<string, string>;
type Props = { stage: number; check: CheckAnswer; draft: Draft; saveDraft: (key: string, value: string) => void };
function MapTask({ rows, check, success }: { rows: c.EvidenceRow[]; check: CheckAnswer; success: string }) {
  return <MatchTable rows={rows} options={[...new Set(rows.map(row => row.answer))]} check={check} success={success} />;
}
function Pressure({ stage, check }: Props) {
  if (stage === 0) return <div className={v.board}><FraudArtifact index={0} /><MapTask rows={c.pressureRows} check={check} success="Persuasion map: five-minute deadline → urgency; admissions director → authority; two places → scarcity; keep secret → secrecy; guaranteed stipend → reward. These signals call for independent verification, not a verdict from one phrase." /></div>;
  if (stage === 1) return <ChoiceTask choices={['Pay a small amount before checking', 'Pause, preserve the message and independently locate the college contact', 'Declare every deadline fraudulent']} answer={1} feedback="A pressure signal alone is not proof. Pause and verify the particular claim through a route not chosen by its sender." success="Verification action: preserve the message and check the specific offer through an independently located college contact. The claim remains unverified until supported; a deadline alone does not prove fraud." check={check} />;
  return <MapTask rows={c.pressureTransfer} check={check} success="Transfer: a deadline alone is not proof; a claimed representative needs independent college verification; secrecy before payment calls for a pause and trusted-adult support." />;
}
function Internship({ stage, check }: Props) {
  if (stage === 0) return <div className={v.board}><FraudArtifact index={1} /><MapTask rows={c.offerRows} check={check} success="Offer comparison: the name does not verify the recruiter; the ₹1,500 fee contradicts the no-fee pack; the premature ID demand stays unfulfilled. Reject these instructions and use the independently supplied official application route." /></div>;
  if (stage === 1) return <ControlChecklist controls={c.dueDiligence} check={check} success="Due diligence: independently locate the exact application route; compare role, fee, document stage and contact; involve a trusted adult for unresolved requests. Do not send a test ID scan." />;
  return <ChoiceTask choices={['Accept because the scholarship advert has a logo', 'Reject every scholarship permanently', 'Pause the unverified award and check the exact terms through an independently located scholarship contact']} answer={2} feedback="For this new scholarship claim there is no independent confirmation yet. Preserve uncertainty and verify the exact offer instead of accepting from appearance or rejecting an entire category." success="New-offer decision: pause while evidence is missing; independently verify the scholarship terms, sender and document stage. A professional appearance does not authorise payment or identity disclosure." check={check} />;
}
function PaymentInspector({ check }: { check: CheckAnswer }) {
  const [decision, setDecision] = useState<c.PaymentDecision>({ direction: '', payee: '', amount: '', action: '' });
  const fields = [
    { key: 'direction', label: 'Payment direction', options: [['incoming', 'Incoming to Asha'], ['outgoing', 'Outgoing from Asha']] },
    { key: 'payee', label: 'Beneficiary on screen', options: [['School Festival', 'School Festival'], ['Refund Desk', 'Refund Desk']] },
    { key: 'amount', label: 'Amount on screen', options: [['80', '₹80'], ['800', '₹800']] },
    { key: 'action', label: 'Action for this refund claim', options: [['approve', 'Approve to receive money'], ['cancel', 'Cancel and independently verify']] },
  ];
  return <div className={v.board}><FraudArtifact index={2} />{fields.map(field => <label className={v.matchRow} key={field.key}><span>{field.label}</span><select value={decision[field.key as keyof c.PaymentDecision]} onChange={event => setDecision(current => ({ ...current, [field.key]: event.target.value }))}><option value="">Choose…</option>{field.options.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>)}<button className={s.primary} disabled={Object.values(decision).some(value => !value)} type="button" onClick={() => { const result = c.inspectPayment(decision); check(result.correct, result.feedback, decision.action === 'approve'); }}><Check aria-hidden="true" />Check payment inspection</button><p className={s.micro}>Teaching artifact only. There is no scannable QR, PIN field or live payment connection.</p></div>;
}
function Payment({ stage, check }: Props) {
  if (stage === 0) return <PaymentInspector check={check} />;
  if (stage === 1) return <MapTask rows={c.paymentRecords} check={check} success="Direction record: own trusted-account credit differs from an outgoing PAY authorisation. A sender’s screenshot is not your account record. Keep PIN and OTP private; do not approve a debit to receive a refund." />;
  return <div className={v.board}><div className={v.callout}>New resale case: you agreed to pay verified seller Art Club ₹650. The final screen instead says PAY ₹650 TO Quick Help. No independent evidence explains the changed beneficiary.</div><ChoiceTask choices={['Approve because the amount matches', 'Stop and independently verify the changed beneficiary before any payment', 'Send your OTP so the seller can fix it']} answer={1} feedback="A matching amount does not resolve the changed beneficiary. Stop and use an independent contact to check the exact recipient and purpose." success="Beneficiary-change response: stop before approval; ₹650 matching is insufficient when Quick Help differs from verified Art Club. Independently check the recipient and purpose; never share OTP/PIN." check={check} /></div>;
}
function OfficialMessage({ stage, check }: Props) {
  if (stage === 0) return <div className={v.board}><FraudArtifact index={3} /><MapTask rows={c.senderRows} check={check} success="Sender inspection: School Bank Support is a display claim; help@schoolbank-alerts.example differs from the supplied schoolbank.example source; obtain the contact independently of this warning." /></div>;
  if (stage === 1) return <MapTask rows={c.claimChecks} check={check} success="Claim-to-check table: KYC → existing trusted bank route; courier fee → original booking route; search result → verify against the organisation’s genuine channel. The suspicious message cannot verify its own number." />;
  return <ChoiceTask choices={['Use the link because grammar and branding are perfect', 'Call the first advertised support number', 'Inspect the actual sender and verify the specific warning through an existing trusted route']} answer={2} feedback="Good writing, logos and search rank are insufficient evidence. Use the actual sender details and an independent organisation channel." success="Transfer: professional writing and branding do not establish authority. Inspect the actual sender, preserve the claim and check through the existing trusted organisation route before acting." check={check} />;
}
function CallRehearsal({ check }: { check: CheckAnswer }) {
  const [ended, setEnded] = useState(false);
  const [hint, setHint] = useState('');
  const [route, setRoute] = useState('');
  return <div className={v.board}><FraudArtifact index={4} />{!ended ? <><p>The caller says: “I sound like your cousin. Keep this secret and transfer now.” Choose the first response.</p><div className={v.actionBank}><button className={s.choice} type="button" onClick={() => { setHint('A small transfer is still a payment to an unverified request. End the call and check independently.'); check(false, 'A test payment does not verify identity; end the pressured call and use a previously known contact.', true); }}>Send a small test payment</button><button className={s.secondary} type="button" onClick={() => { setEnded(true); setHint('Call ended in the simulation. Now choose an independent verification route.'); }}><PhoneOff aria-hidden="true" />End the call calmly</button></div></> : <><label className={v.matchRow}><span>Verification after ending the call</span><select value={route} onChange={event => setRoute(event.target.value)}><option value="">Choose…</option><option value="new">Call the new number the caller supplied</option><option value="known">Use the saved relative contact and involve a trusted adult</option></select></label><button className={s.primary} disabled={!route} type="button" onClick={() => check(route === 'known', route === 'known' ? 'Call rehearsal: ended the pressured call calmly; use a previously saved relative contact and trusted-adult support. The caller’s new number is not an independent verifier.' : 'The same caller supplied that number, so it cannot independently verify the claim. Use the saved contact and trusted-adult support.', route !== 'known')}>Check call plan</button></>}{hint && <p className={v.callout} role="status">{hint}</p>}</div>;
}
function FamiliarVoice({ stage, check }: Props) {
  if (stage === 0) return <CallRehearsal check={check} />;
  if (stage === 1) return <MapTask rows={c.callRoutes} check={check} success="Two-channel plan: use the previously saved relative contact; involve a trusted adult who checks through a separate known person or route. If no one answers, the claim remains unverified and no transfer is authorised." />;
  return <ChoiceTask choices={['“I will end this call and verify independently with a trusted adult before any payment.”', '“Your official title is enough; I will keep this secret.”', '“Stay on the line while I share my OTP.”']} answer={0} feedback="Secrecy, intimidation and a claimed title do not establish authority. End the interaction calmly and verify through a previously known route with support." success="Calm script: I will end this call and verify independently with a trusted adult before any payment. Identity, circumstances and payment authority remain separate questions; no secrecy or OTP sharing." check={check} />;
}
function MockReport({ check }: { check: CheckAnswer }) {
  const [report, setReport] = useState<c.MockReport>({ time: '', amount: '', reference: '', event: '', redacted: false });
  const [preview, setPreview] = useState('');
  const fields = [
    { key: 'time', label: 'Incident time', options: ['14:21', c.incident.time] },
    { key: 'amount', label: 'Amount in rupees', options: ['80', c.incident.amount] },
    { key: 'reference', label: 'Transaction reference', options: ['DEMO-TXN-240', c.incident.reference] },
    { key: 'event', label: 'Supported event description', options: ['Guaranteed recovery after a processing fee', c.incident.event] },
  ];
  return <div className={v.board}><FraudArtifact index={5} />{fields.map(field => <label className={v.matchRow} key={field.key}><span>{field.label}</span><select value={String(report[field.key as keyof c.MockReport])} onChange={event => { setPreview(''); setReport(current => ({ ...current, [field.key]: event.target.value })); }}><option value="">Choose from supplied evidence…</option>{field.options.map(value => <option key={value}>{value}</option>)}</select></label>)}<label className={v.checkRow}><input type="checkbox" checked={report.redacted} onChange={event => { setPreview(''); setReport(current => ({ ...current, redacted: event.target.checked })); }} /><span>Retain the relevant receipt/message; redact unrelated personal details from this classroom copy; include no PIN or OTP</span></label><button className={s.primary} disabled={fields.some(field => !report[field.key as keyof c.MockReport])} type="button" onClick={() => { const result = c.validateMockReport(report); setPreview(result.correct ? result.feedback : ''); check(result.correct, result.feedback); }}><FileText aria-hidden="true" />Build mock report</button>{preview && <output className={v.callout} aria-live="polite">{preview}</output>}<p className={s.micro}>No report is submitted. In a real incident, preserve originals and use trusted official channels; classroom redaction must not destroy original evidence.</p></div>;
}
function AfterLoss({ stage, check }: Props) {
  if (stage === 0) return <div className={v.board}><ControlChecklist controls={c.responseControls} check={check} success="Response plan: immediately contact bank/payment provider through a trusted channel; promptly use 1930 or cybercrime.gov.in for Indian financial cyber fraud; involve a trusted adult and preserve available evidence without delaying contact. Do not pay recovery agents or blame the person targeted." /><p className={s.micro}>Official guidance: <a href="https://navimumbaipolice.gov.in/en/citizen/cyber-security" target="_blank" rel="noreferrer">bank contact, evidence and reporting</a> · <a href="https://cybercrime.gov.in/" target="_blank" rel="noreferrer">National Cyber Crime Reporting Portal</a>. These resources are for real incidents; this lesson makes no call or submission.</p></div>;
  if (stage === 1) return <MockReport check={check} />;
  return <ChoiceTask choices={['Pay the recovery agent because they guarantee success', 'Keep reporting promptly through trusted routes; preserve evidence and reject recovery guarantees or fees', 'Delete all messages because recovery is uncertain']} answer={1} feedback="Reporting supports response but does not guarantee recovery. A paid guarantee can be another fraud. Preserve evidence and continue through trusted official channels." success="Recovery-claim response: reject guaranteed-recovery fees, preserve originals and continue trusted bank/official reporting with adult support. No reimbursement or recovery outcome is promised." check={check} />;
}
function Portfolio({ draft, saveDraft }: Pick<Props, 'draft' | 'saveDraft'>) {
  return <fieldset className={f.portfolio}><legend>Annual evidence portfolio</legend><p>Reuse your four earlier records, or honestly label the supplied replacement examples. Source labels and notes are saved with this chapter for teacher review.</p>{c.portfolioItems.map(([key, label, slug, sample]) => <div key={key} className={f.portfolioRow}><a href={`/module/cyber/${slug}?grade=11`} target="_blank" rel="noreferrer">Open {label.toLowerCase()} chapter</a><p>Supplied replacement: {sample}</p><label className={v.matchRow}><span>{label} source</span><select value={draft[key] ?? ''} onChange={event => saveDraft(key, event.target.value)}><option value="">Label the source…</option><option value="earlier">My earlier work, to show my teacher</option><option value="supplied">Supplied classroom replacement</option></select></label></div>)}<label className={f.noteLabel}>Portfolio notes / reflection for teacher review<textarea maxLength={300} rows={4} value={draft.notes ?? ''} placeholder="Use only fictional case details. Explain evidence, an alternative and what still needs checking." onChange={event => saveDraft('notes', event.target.value)} /></label><small>Keep the reflection within 300 characters. Your teacher reviews its meaning and authorship; text length is not automatically scored.</small></fieldset>;
}
function FestivalRefund({ stage, check, draft, saveDraft }: Props) {
  if (stage === 0) return <div className={v.board}><FraudArtifact index={6} /><MapTask rows={c.capstoneRows} check={check} success="Integrated map: restrict evidence access; check uncited AI advice against the payment record; add unknown → pause/review logic; cancel outgoing authorisation and verify the refund independently. Each conclusion is tied to a different piece of evidence." /></div>;
  if (stage === 1) return <div className={v.board}><FraudArtifact index={6} resolved /><ChoiceTask choices={['A real refund due means this outgoing payment is safe', 'The contact confirms a refund is due, but this payee and outgoing instruction remain unverified', 'Ignore the new evidence and claim no refund exists']} answer={1} feedback="Update only what the independent contact establishes: a refund is due. The changed payee and outgoing authorisation still need separate checks." success="Revision: known school contact supports a refund being due. It does not support the unverified Refund Desk beneficiary or an outgoing payment. Keep the cancellation and independently confirm the correct refund process." check={check} /></div>;
  return <div className={v.board}><Portfolio draft={draft} saveDraft={saveDraft} /><MapTask rows={c.nextActions} check={(correct, feedback) => { const labelled = c.portfolioItems.every(([key]) => ['earlier', 'supplied'].includes(draft[key])); check(correct && labelled, labelled ? feedback : 'Label all four portfolio sources honestly before saving the next actions. You can use the supplied replacements.'); }} success="Next three actions: cancel outgoing approval and protect PIN/OTP; verify refund through known school contact; preserve restricted evidence and promptly contact bank/official reporting if a loss occurred. Portfolio source labels are recorded for teacher review." /></div>;
}
function Defence({ stage, check, draft, saveDraft }: Props) {
  if (stage === 0) return <div className={v.board}><FraudArtifact index={7} /><MapTask rows={c.defenceRows} check={check} success="Fresh-case analysis: private ₹950 correction is an unverified claim; the school pack does not establish it; familiar sound and AI confidence do not supply independent authority. Pause and use the previously known school contact." /></div>;
  if (stage === 1) return <ChoiceTask choices={['Reject the assistant’s test-payment advice; independently verify and explain why confidence is insufficient', 'Send ₹1 first because the assistant sounds confident', 'Share an OTP so the caller can prove their identity']} answer={0} feedback="A small payment still risks money and proves no authority; sharing an OTP increases exposure. Revise to independent verification and explain the contradictory or missing evidence." success="Safer revision: reject test-payment and OTP-sharing advice; pause and use the known school route. The assistant supplies no independent evidence, and a familiar voice does not resolve the claim. Keep the first attempt as learning evidence." check={check} />;
  const rows: c.EvidenceRow[] = [
    { label: 'Decision to defend', answer: 'Pause the transfer and verify independently', why: 'The claim remains unverified by the supplied independent evidence.' },
    { label: 'Alternative and why it fails', answer: 'Small test payment fails to verify identity or authority', why: 'A payment does not establish the recipient’s authority.' },
    { label: 'Remaining uncertainty', answer: 'Whether any genuine fee correction exists and who is authorised', why: 'Keep unresolved facts explicit until the known school route confirms them.' },
  ];
  return <div className={v.board}><Portfolio draft={draft} saveDraft={saveDraft} /><MapTask rows={rows} check={(correct, feedback) => { const labelled = c.portfolioItems.every(([key]) => ['earlier', 'supplied'].includes(draft[key])); check(correct && labelled, labelled ? feedback : 'Label all four portfolio sources before saving. Your teacher will review the actual earlier work or the labelled supplied examples.'); }} success="Defence outline: pause private transfer; verify through the known school route; reject test payments because they prove no authority; state that the existence and authorisation of a fee correction remain uncertain. Four portfolio sources and reflection are saved for teacher review, not automatically judged as an oral pass." /><div className={v.callout}><strong>Two-minute individual defence</strong><p>Explain your decision and evidence; compare one alternative; state uncertainty and the next check; describe one revision from feedback. Show your four labelled portfolio items. Your teacher reviews understanding, ownership and reflection separately.</p></div></div>;
}
const activities = {
  'how-a-scam-builds-pressure': Pressure, 'the-internship-that-pays-too-well': Internship,
  'before-you-approve-that-payment': Payment, 'when-the-message-looks-official': OfficialMessage,
  'a-familiar-voice-asks-for-money': FamiliarVoice, 'what-to-do-after-a-loss': AfterLoss,
  'integrated-case-the-festival-refund': FestivalRefund, 'defend-your-decision': Defence,
};
export function Class11Fraud(props: CyberLessonComponentProps) {
  const practice = usePractice(props);
  const slug = props.lesson.slug as keyof typeof activities;
  const chapter = c.fraudPractice[slug];
  const Activity = activities[slug];
  const artwork = fraudArtwork[slug];
  const evidenceKey = `evidence-${slug}`;
  const stored = props.runtime.state[evidenceKey];
  const evidence = stored && typeof stored === 'object' && !Array.isArray(stored) ? stored as Record<string, string> : {};
  const draftKey = `portfolio-${slug}`;
  const savedDraft = props.runtime.state[draftKey];
  const draft = savedDraft && typeof savedDraft === 'object' && !Array.isArray(savedDraft) ? savedDraft as Draft : {};
  function saveDraft(key: string, value: string) { props.runtime.updateState({ [draftKey]: { ...draft, [key]: value } }); }
  function check(correct: boolean, feedback: string, unsafe = false) {
    const portfolio = correct && practice.stage === 2 && ['integrated-case-the-festival-refund', 'defend-your-decision'].includes(slug) ? c.portfolioFeedback(draft) : '';
    const record = feedback + portfolio;
    if (correct) props.runtime.updateState({ [evidenceKey]: { ...evidence, [practice.stage]: record } });
    practice.submit(correct, record, unsafe);
  }
  const illustrated = practice.stage === 0 && ['how-a-scam-builds-pressure', 'a-familiar-voice-asks-for-money'].includes(slug);
  return <PracticeShell props={props} stage={practice.stage} eyebrow="Evidence and verification lab" brief={chapter.brief} prompt={chapter.prompts[Math.min(practice.stage, 2)]} feedback={practice.feedback} feedbackCorrect={practice.feedbackCorrect} ready={practice.ready} onContinue={practice.continuePractice} onFinish={practice.finish} art="lab"
    evidence={<div className={v.evidence}><h2>Your verification evidence record</h2><ol>{Object.values(evidence).map((item, index) => <li key={index}>{item}</li>)}</ol>{Object.keys(draft).length > 0 && <><h3>Portfolio for teacher review</h3><ul>{c.portfolioItems.map(([key, label]) => <li key={key}>{label}: {draft[key] === 'earlier' ? 'My earlier work, to show my teacher' : draft[key] === 'supplied' ? 'Supplied classroom replacement' : 'Not labelled'}</li>)}</ul><p className={f.savedNote}>{draft.notes || 'No written reflection added. Discuss the reflection with your teacher.'}</p></>}<p>Structured decisions are checked automatically. Your teacher reviews the actual portfolio, individual defence and reflection. All case records are fictional.</p></div>}>
    <div className={`${a.lab} ${illustrated ? v.illustratedActivity : v.senior}`}>
      {illustrated && <figure className={v.sceneIllustration}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={artwork.src} alt={artwork.alt} width={1400} height={788} decoding="async" loading="lazy" /><figcaption>{artwork.caption}</figcaption>
      </figure>}
      <div className={v.senior}><Activity key={practice.stage} stage={Math.min(practice.stage, 2)} check={check} draft={draft} saveDraft={saveDraft} /></div>
    </div>
  </PracticeShell>;
}
