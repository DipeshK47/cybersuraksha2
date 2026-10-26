"use client";

import { ArrowDown, ArrowUp, Check, FileText, FolderLock, Globe, HardDrive, Play, RotateCcw, ShieldCheck, Users } from "lucide-react";
import { useState, type ComponentType } from "react";
import type { CyberLessonComponentProps } from "../../lesson-types";
import { PracticeShell, usePractice } from "../new/PracticeShell";
import * as content from "./security-content";
import { securityArtwork } from "./security-art";
import s from "../new/practice.module.css";
import v from "./security.module.css";

type CheckAnswer = (correct: boolean, feedback: string, unsafe?: boolean) => void;
type ActivityProps = { stage: number; check: CheckAnswer };

export function MatchTable({ rows, options, check, success }: {
  rows: { label: string; answer: string; why?: string }[];
  options: readonly string[]; check: CheckAnswer; success: string;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  return <div className={v.board}>
    {rows.map(row => <label className={v.matchRow} key={row.label}>
      <span>{row.label}</span>
      <select aria-label={row.label} value={answers[row.label] ?? ""} onChange={event => setAnswers(current => ({ ...current, [row.label]: event.target.value }))}>
        <option value="">Choose…</option>{options.map(option => <option key={option}>{option}</option>)}
      </select>
    </label>)}
    <button className={s.primary} disabled={rows.some(row => !answers[row.label])} onClick={() => {
      const wrong = content.firstMismatch(rows, answers);
      check(!wrong, wrong ? `${wrong.label}: ${wrong.why ?? "Recheck the stated purpose and try again."}` : success);
    }} type="button"><Check aria-hidden="true" />Check my map</button>
  </div>;
}

export function ControlChecklist({ controls, check, success }: {
  controls: { id: string; label: string; good: boolean; why: string }[]; check: CheckAnswer; success: string;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  return <div className={v.board}>
    {controls.map(control => <label className={v.checkRow} key={control.id}>
      <input type="checkbox" checked={selected.includes(control.id)} onChange={() => setSelected(current => current.includes(control.id) ? current.filter(id => id !== control.id) : [...current, control.id])} />
      <span>{control.label}</span>
    </label>)}
    <button className={s.primary} disabled={!selected.length} onClick={() => {
      const wrong = controls.find(control => selected.includes(control.id) !== control.good);
      check(!wrong, wrong ? `${wrong.label}: ${wrong.why}` : success, Boolean(wrong && !wrong.good));
    }} type="button"><ShieldCheck aria-hidden="true" />Test protection</button>
  </div>;
}

export function SequenceBoard({ steps, check, success }: { steps: string[]; check: CheckAnswer; success: string }) {
  const [order, setOrder] = useState<string[]>([]);
  const pool = [steps[2], steps[0], steps[3], steps[1]];
  return <div className={v.board}>
    <ol className={v.sequence} aria-label="Your action sequence">{steps.map((_, index) => <li key={index}><b>{index + 1}</b>{order[index] ?? "Choose the next action below"}</li>)}</ol>
    <div className={v.actionBank}>{pool.map(step => <button type="button" className={s.choice} key={step} disabled={order.includes(step)} onClick={() => setOrder(current => [...current, step])}>{step}</button>)}</div>
    <div className={s.controls}>
      <button type="button" className={s.secondary} disabled={!order.length} onClick={() => setOrder(current => current.slice(0, -1))}><RotateCcw aria-hidden="true" />Undo last action</button>
      <button type="button" className={s.primary} disabled={order.length !== steps.length} onClick={() => check(content.inOrder(order, steps), content.inOrder(order, steps) ? success : `Recheck step ${order.findIndex((step, index) => step !== steps[index]) + 1}. ${steps[0]} must come first; then follow the stated response sequence.`)}><Play aria-hidden="true" />Run sequence</button>
    </div>
  </div>;
}

function RiskMap({ stage, check }: ActivityProps) {
  const [order, setOrder] = useState(["poster", "folder", "laptop"]);
  const [reasons, setReasons] = useState<Record<string, string>>({});
  if (stage === 0) return <MatchTable rows={content.riskCards} options={content.riskTerms} check={check} success="Risk chain: registration list → unauthorised download → public link weakness → named-access control." />;
  if (stage === 1) return <MatchTable rows={content.impactCards} options={["Availability", "Confidentiality", "Integrity"]} check={check} success="Impact map: public contacts threaten confidentiality; changed payments threaten integrity; laptop failure threatens availability." />;
  function move(index: number, direction: number) {
    setOrder(current => { const next = [...current]; [next[index], next[index + direction]] = [next[index + direction], next[index]]; return next; });
  }
  return <div className={v.board}>
    <p className={v.callout}>For this exercise, priority score = likelihood × impact, each rated 1–3. Put the highest score first and attach the matching evidence. These supplied ratings are estimates.</p>
    <ol className={v.rankList}>{order.map((id, index) => {
      const risk = content.priorities.find(item => item.id === id)!;
      return <li key={id}><div><strong>{risk.label}</strong><span>Likelihood {risk.likelihood} · Impact {risk.impact} · Score {risk.likelihood * risk.impact}</span>
        <label>Supporting evidence<select value={reasons[id] ?? ""} onChange={event => setReasons(current => ({ ...current, [id]: event.target.value }))}><option value="">Choose evidence…</option>{content.priorities.map(item => <option key={item.id} value={item.id}>{item.reason}</option>)}</select></label>
        {reasons[id] && <p className={s.micro}>{content.priorities.find(item => item.id === reasons[id])?.reason}</p>}
      </div><div className={v.move}><button type="button" aria-label={`Move ${risk.label} up`} disabled={index === 0} onClick={() => move(index, -1)}><ArrowUp /></button><button type="button" aria-label={`Move ${risk.label} down`} disabled={index === order.length - 1} onClick={() => move(index, 1)}><ArrowDown /></button></div></li>;
    })}</ol>
    <button type="button" className={s.primary} disabled={order.some(id => !reasons[id])} onClick={() => {
      const ranked = content.inOrder(order, ["folder", "laptop", "poster"]);
      const justified = order.every(id => reasons[id] === id);
      check(ranked && justified, !ranked ? "Use the supplied scores: 9 before 6 before 2. Move risks with the arrow buttons." : !justified ? "Each priority needs evidence about that risk. A poster copy does not explain exposure of contact details." : "Risk register: 1. public folder (9), 2. gate laptop (6), 3. editable poster (2). Each priority has matching evidence; revise the order if likelihood or impact changes.");
    }}><FileText aria-hidden="true" />Save risk register</button>
  </div>;
}

function Identity({ stage, check }: ActivityProps) {
  if (stage === 0) return <ControlChecklist controls={content.identityControls} check={check} success="Account plan: unique password, an additional sign-in protection and private recovery independent of the sign-in phone." />;
  if (stage === 1) return <SequenceBoard steps={content.recoverySteps} check={check} success="Recovery test: known provider page → private ownership check → revoke lost-device sessions → restore sign-in and recovery options." />;
  return <MatchTable rows={content.authCards} options={["Authorisation", "Authentication"]} check={check} success="Authentication establishes identity. Authorisation grants only the actions and resources that identity needs." />;
}

function Permissions({ stage, check }: ActivityProps) {
  const task = content.accessTasks[stage];
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [tested, setTested] = useState(false);
  const [expiry, setExpiry] = useState("");
  const simulated = answers[task.test];
  return <div className={v.board}>
    <div className={v.appBar}><FolderLock aria-hidden="true" /><strong>Fest Team Drive</strong><span>Private registration folder</span></div>
    {task.rows.map(row => <label className={v.matchRow} key={row.label}><span><strong>{row.label}</strong><small>{row.need}</small></span><select aria-label={row.label} value={answers[row.label] ?? ""} onChange={event => { setAnswers(current => ({ ...current, [row.label]: event.target.value })); setTested(false); }}><option value="">Choose access…</option>{["No access", "View", "Edit"].map(option => <option key={option}>{option}</option>)}</select></label>)}
    {stage === 1 && <label className={v.matchRow}><span>Guest programme link expires</span><select value={expiry} onChange={event => { setExpiry(event.target.value); setTested(false); }}><option value="">Choose expiry…</option><option>Never</option><option>Friday after the event</option></select></label>}
    <button className={s.secondary} disabled={task.rows.some(row => !answers[row.label]) || (stage === 1 && !expiry)} type="button" onClick={() => setTested(true)}><Users aria-hidden="true" />Test as {task.test}</button>
    {tested && <div className={v.callout} role="status"><strong>{simulated === "No access" ? "Access denied" : simulated === "Edit" ? "Can open and change the file" : "Can open and read the file"}</strong><p>{task.consequence}</p></div>}
    <button className={s.primary} disabled={!tested} type="button" onClick={() => {
      const wrong = task.rows.find(row => answers[row.label] !== row.answer);
      const expires = stage !== 1 || expiry === "Friday after the event";
      check(!wrong && expires, wrong ? `${wrong.label}: ${wrong.need}. Choose the minimum permission for that task.` : !expires ? "The guest's stated need ends Friday. Do not leave the programme share open forever." : `Access test passed. ${task.rows.map(row => `${row.label}: ${row.answer}`).join("; ")}.${stage === 1 ? " Guest link expires Friday." : ""}`, Boolean(wrong && answers[wrong.label] !== "No access"));
    }}><Check aria-hidden="true" />Save tested permissions</button>
  </div>;
}

function BrowserDesk({ stage, check }: ActivityProps) {
  const task = content.browserTasks[stage];
  const [hostname, setHostname] = useState("");
  const [decision, setDecision] = useState("");
  const choices = stage === 0 ? ["Use the school address from the supplied school diary", "Sign in because the school name appears in the link"] : stage === 1 ? ["HTTPS proves this is the school", "HTTPS protects the connection; verify the operator separately"] : ["Allow contacts so the programme will load", "Decline contacts; the programme does not need them"];
  const expected = choices[stage === 0 ? 0 : 1];
  return <div className={v.board}>
    <div className={v.browser}><div className={v.address}><Globe aria-hidden="true" /><code>{task.address}</code></div><div className={v.webpage}><span>Fictional school festival</span><h3>{stage === 2 ? "View the programme" : "Confirm your event account"}</h3><p>{stage === 2 ? "This page asks for access to all your contacts." : "A school crest and familiar heading appear on the page."}</p><strong>Known school hostname: cyberpurschool.example</strong></div></div>
    <label className={v.matchRow}><span>Actual hostname</span><select value={hostname} onChange={event => setHostname(event.target.value)}><option value="">Inspect the address…</option>{task.hosts.map(host => <option key={host}>{host}</option>)}</select></label>
    <div className={v.actionBank}>{choices.map(choice => <button className={s.choice} type="button" aria-pressed={decision === choice} key={choice} onClick={() => setDecision(choice)}>{choice}</button>)}</div>
    <button className={s.primary} type="button" disabled={!hostname || !decision} onClick={() => check(hostname === task.expectedHost && decision === expected, hostname !== task.expectedHost ? "The hostname is the full address between https:// and the next slash. A word in the page title or path is not the hostname." : decision !== expected ? task.note : `Browser evidence: ${task.expectedHost}. ${task.note}`, decision !== expected)}><Check aria-hidden="true" />Record browser evidence</button>
  </div>;
}

function Lifecycle({ stage, check }: ActivityProps) {
  const task = content.lifecycleTasks[stage];
  return <div className={v.board}><div className={v.appBar}><FileText aria-hidden="true" /><strong>Festival data desk</strong></div><p className={v.callout}>{task.purpose}</p><MatchTable rows={task.rows} options={task.options} check={check} success={`Data decision: ${task.rows.map(row => `${row.label} → ${row.answer}`).join("; ")}. Decisions follow the stated purpose and exercise policy.`} /></div>;
}

function Devices({ stage, check }: ActivityProps) {
  const [version, setVersion] = useState("");
  const [restored, setRestored] = useState(false);
  const [checks, setChecks] = useState<string[]>([]);
  if (stage === 0) return <ControlChecklist controls={content.deviceControls} check={check} success="Device plan: trusted updates, individual locked accounts, a separate versioned backup and a restoration test." />;
  if (stage === 1) return <div className={v.board}>
    <div className={v.appBar}><HardDrive aria-hidden="true" /><strong>Restore a fictional duplicate</strong></div>
    <p className={v.callout}>At 10:30 the working file became empty. The expected count before corruption was 42 registrations. Choose a separate recoverable copy; keep the original evidence.</p>
    <div className={v.actionBank}>{content.backupVersions.map(copy => <button type="button" className={s.choice} key={copy.id} aria-pressed={version === copy.id} onClick={() => { setVersion(copy.id); setRestored(false); }}>{copy.label}</button>)}</div>
    <button className={s.secondary} disabled={!version} type="button" onClick={() => setRestored(true)}><RotateCcw aria-hidden="true" />Restore to a new practice folder</button>
    {restored && <div className={v.callout} role="status">{version === "clean" ? "Restored copy: 42 readable records. Original remains untouched." : version === "same" ? "Restore failed: the copy was on the unavailable laptop." : "Restored copy: 0 records. The corruption was synced."}</div>}
    <button className={s.primary} disabled={!restored} type="button" onClick={() => { const copy = content.backupVersions.find(item => item.id === version)!; check(copy.safe, copy.safe ? `Recovery record: restored the separate 10:00 version to a new folder, confirmed 42 readable records and preserved the original.` : copy.why); }}><Check aria-hidden="true" />Verify restoration</button>
  </div>;
  const options = ["Compare all 43 expected IDs and statuses", "Test that the gate account can read the restored copy", "Declare success because the file icon exists", "Keep the original and record the restoration result"];
  const expected = [options[0], options[1], options[3]];
  return <div className={v.board}>
    <p className={v.callout}>New case: the gate export should have 43 registrations. The restored file opens, and its last rows are shown below. Decide what to check before declaring recovery.</p>
    <ul className={v.records}>{content.restoredRecords.map(record => <li key={record}><FileText aria-hidden="true" />{record}</li>)}</ul>
    {options.map(option => <label className={v.checkRow} key={option}><input type="checkbox" checked={checks.includes(option)} onChange={() => setChecks(current => current.includes(option) ? current.filter(item => item !== option) : [...current, option])} /><span>{option}</span></label>)}
    <button type="button" className={s.primary} disabled={!checks.length} onClick={() => check(content.selectedExactly(checks, expected), content.selectedExactly(checks, expected) ? "Unseen recovery plan: verify all 43 IDs and statuses, test the gate account's access, preserve the original and record the result. A file opening alone is insufficient." : "Check completeness and actual user access, and preserve the original. A file icon alone does not prove a successful recovery.")}><Check aria-hidden="true" />Approve recovery checks</button>
  </div>;
}

function LoginInvestigation({ stage, check }: ActivityProps) {
  if (stage === 0) return <SequenceBoard steps={content.loginEvents.map(event => `${event.time} · ${event.text}`)} check={check} success="Timeline: recognised sign-in 09:00 → unfamiliar session 09:12 → download 09:14 → owner does not recognise it 09:20. This supports escalation, not an accusation." />;
  if (stage === 1) return <MatchTable rows={content.loginClaims} options={["Hypothesis to verify", "Unsupported conclusion", "Observed in supplied records"]} check={check} success="Evidence ledger: download is observed, unauthorised access is a hypothesis, and a city label does not identify an attacker." />;
  return <div className={v.board}><p className={v.callout}>New case: a login alert and an unknown download arrive while the account owner is in class. The teacher is available. Follow the exercise’s initial-response sequence without contacting suspected users or deleting records.</p><SequenceBoard steps={content.responseSteps} check={check} success="Response decision: preserve and verify the alert, revoke the unknown session with the owner, review account protection, and escalate the possible exposure to the responsible teacher. Urgent containment and escalation can overlap in a real incident." /></div>;
}

function SecurityReview({ stage, check }: ActivityProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [tested, setTested] = useState(false);
  const [decision, setDecision] = useState("");
  if (stage === 0) {
    const coverage = content.reviewCoverage(selected, 6);
    return <div className={v.board}><p className={v.callout}>Budget: 6 tokens. Priorities: public registration exposure, gate laptop failure and password theft. Each control costs 2. Choose safeguards, then test the design.</p>
      {content.reviewControls.map(control => <label className={v.checkRow} key={control.id}><input type="checkbox" checked={selected.includes(control.id)} onChange={() => { setSelected(current => current.includes(control.id) ? current.filter(id => id !== control.id) : [...current, control.id]); setTested(false); }} /><span><strong>{control.label}</strong><small>{control.cost} tokens</small></span></label>)}
      <p className={v.cost}>Selected: {coverage.cost} / 6 tokens</p>
      <button className={s.secondary} disabled={!selected.length} type="button" onClick={() => setTested(true)}><Play aria-hidden="true" />Run design test</button>
      {tested && <ul className={v.records} role="status">{content.reviewControls.slice(0, 3).map(control => <li key={control.id}>{selected.includes(control.id) ? <Check aria-hidden="true" /> : <RotateCcw aria-hidden="true" />}{control.covers}: {selected.includes(control.id) ? "safeguard present" : "unaddressed"}</li>)}</ul>}
      <button className={s.primary} disabled={!tested} type="button" onClick={() => check(coverage.valid, coverage.cost > 6 ? "The design exceeds the 6-token budget. Keep controls that address the stated risks." : !coverage.valid ? "A stated risk remains unaddressed. A poster redesign cannot replace access control, account protection or a recoverable backup." : "Design: named access (2), tested separate backup (2), protected individual accounts (2). All three priorities have a control within the 6-token budget.")}><Check aria-hidden="true" />Save design</button>
    </div>;
  }
  const choices = stage === 1 ? [
    "MFA guarantees nobody can ever expose data",
    "An authorised organiser could still share data; use clear handling rules and an escalation route",
    "A backup makes access controls unnecessary",
  ] : [
    "Keep using the lost laptop's active session because MFA was enabled",
    "Revoke the lost device's sessions, restrict exposure, verify the backup and inform the responsible teacher",
    "Delete every event log so private details cannot spread",
  ];
  return <div className={v.board}><div className={v.appBar}><ShieldCheck aria-hidden="true" /><strong>{stage === 1 ? "Residual risk hearing" : "New evidence: laptop lost"}</strong></div>
    <p className={v.callout}>{stage === 1 ? "The team has all three safeguards. Explain which risk still remains and what the team should do about it." : "The gate laptop is lost while an organiser's session is still active. Your separate backup exists. The initial design needs an incident-response revision."}</p>
    <div className={v.actionBank}>{choices.map(choice => <button type="button" className={s.choice} aria-pressed={decision === choice} key={choice} onClick={() => setDecision(choice)}>{choice}</button>)}</div>
    <button className={s.primary} disabled={!decision} type="button" onClick={() => check(decision === choices[1], decision === choices[1] ? stage === 1 ? "Residual risk: authorised people can still misuse or accidentally share data. Handling rules, oversight and an escalation route reduce this risk without claiming to eliminate it." : "Design revision: revoke lost-device sessions, assess data exposure with the teacher and test the separate backup. MFA does not automatically end an existing session." : stage === 1 ? "Controls reduce specific risks; none removes every risk. Consider what an already authorised organiser could still do." : "MFA does not necessarily close an existing session. Preserve relevant records, revoke access with the owner and use the tested backup.", decision !== choices[1])}><Check aria-hidden="true" />Defend decision</button>
  </div>;
}

const chapters: Record<string, { Activity: ComponentType<ActivityProps>; brief: string; prompts: string[] }> = {
  "your-digital-risk-map": { Activity: RiskMap, brief: "An asset has value. A threat could harm it. A vulnerability is a weakness. A control reduces risk. Explain confidentiality, integrity and availability separately.", prompts: ["Build the festival team's first risk chain.", "Match each incident to its main security impact.", "Prioritise three risks and justify each one with evidence."] },
  "identity-beyond-a-password": { Activity: Identity, brief: "Protect sign-in and recovery together. Authentication checks identity; authorisation limits what that identity can do. Never enter real passwords or recovery codes here.", prompts: ["Protect Asha's fictional festival account.", "The sign-in phone is lost. Rehearse recovery without the phone.", "A new supplier can sign in. Does that mean they may edit every file?"] },
  "who-should-have-access": { Activity: Permissions, brief: "Least privilege means granting only the access a task needs, for only as long as it is needed. Test direct shares, groups and public links.", prompts: content.accessTasks.map(task => task.prompt) },
  "what-a-browser-can-tell-you": { Activity: BrowserDesk, brief: "Read the full hostname and check the task. HTTPS protects a connection but does not prove that a site is legitimate. Every address in this exercise is fictional.", prompts: content.browserTasks.map(task => task.prompt) },
  "data-has-a-lifecycle": { Activity: Lifecycle, brief: "Follow the purpose from collection through storage, access and deletion. Collect less and restrict access. Apply the supplied exercise policy; retention periods depend on context.", prompts: content.lifecycleTasks.map(task => task.prompt) },
  "devices-updates-and-backups": { Activity: Devices, brief: "Trusted updates, locks and recoverable backups address different risks. A synced copy may repeat damage. Restore a duplicate and verify its contents and access.", prompts: ["Repair the shared laptop's protection plan.", "The registration file was corrupted. Recover a usable copy.", "A different gate export should have 43 records. What proves recovery?"] },
  "the-suspicious-login": { Activity: LoginInvestigation, brief: "Separate recorded observations from hypotheses and accusations. Preserve relevant evidence, verify independently and involve the account owner and responsible teacher.", prompts: ["Reconstruct the supplied account timeline.", "Label each claim by what the evidence supports.", "Handle a fresh unknown-session case using the stated initial-response sequence."] },
  "security-design-review": { Activity: SecurityReview, brief: "A security design must address its stated risks within real constraints. Test the controls, explain remaining risk and revise when new evidence appears.", prompts: ["Defend a festival security design within a 6-token budget.", "Explain a remaining risk and a proportionate response.", "Revise the plan after a gate laptop is lost."] },
};

export function Class11Security(props: CyberLessonComponentProps) {
  const practice = usePractice(props);
  const chapter = chapters[props.lesson.slug];
  const { Activity } = chapter;
  const artwork = securityArtwork[props.lesson.slug];
  const illustrated = (practice.stage === 0 && ["your-digital-risk-map", "identity-beyond-a-password"].includes(props.lesson.slug))
    || (practice.stage === 1 && props.lesson.slug === "devices-updates-and-backups");
  const evidenceKey = `evidence-${props.lesson.slug}`;
  const stored = props.runtime.state[evidenceKey];
  const evidence: Record<string, string> = stored && typeof stored === "object" && !Array.isArray(stored) ? stored as Record<string, string> : {};
  function check(correct: boolean, feedback: string, unsafe = false) {
    if (correct) props.runtime.updateState({ [evidenceKey]: { ...evidence, [practice.stage]: feedback } });
    practice.submit(correct, feedback, unsafe);
  }
  return <PracticeShell props={props} stage={practice.stage} eyebrow="Festival team security lab" brief={chapter.brief} prompt={chapter.prompts[Math.min(practice.stage, 2)]} feedback={practice.feedback} feedbackCorrect={practice.feedbackCorrect} ready={practice.ready} onContinue={practice.continuePractice} onFinish={practice.finish} art="lab"
    evidence={<div className={v.evidence}><h2>Your evidence record</h2><ol>{Object.values(evidence).map((item, index) => <li key={index}>{item}</li>)}</ol><p>Use this record to explain your decisions to your teacher. Your explanation is reviewed separately from the automatic checks.</p></div>}>
    <div className={illustrated ? v.illustratedActivity : v.senior}>
      {illustrated && <figure className={v.sceneIllustration}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={artwork.src} alt={artwork.alt} width={1400} height={788} decoding="async" loading="lazy" />
        <figcaption>{artwork.caption}</figcaption>
      </figure>}
      <div className={v.senior}><Activity key={practice.stage} stage={Math.min(practice.stage, 2)} check={check} /></div>
    </div>
  </PracticeShell>;
}
