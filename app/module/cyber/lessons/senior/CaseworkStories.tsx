"use client";

import { ArrowRight, Check, FolderSearch } from 'lucide-react';
import { useState } from 'react';
import { SceneSwap } from '../new/story/StoryPlayer';
import type { StoryChapter, StoryScript, StoryWorldProps } from '../new/story/types';
import { CLASS12_FRAUD_SLUGS } from '../../../../data/class-12-missions';
import * as c from './casework-content';
import { caseworkArtwork } from './casework-art';
import k from '../new/story/story-player.module.css';
import v from './security.module.css';
import a from './ai.module.css';
import w from './casework.module.css';

export function TransferRoutes() {
  return <figure className={w.routes}><figcaption>Two observed synthetic paths · arrows show transfers, never intent</figcaption>{[
    { id: 'V', nodes: ['X', 'V', 'Y'], note: 'T02: ₹4,900 at 09:02 → T03: ₹4,800 at 09:05 · source/purpose unresolved' },
    { id: 'C', nodes: ['Pool', 'C', 'Supplier'], note: 'T04: ₹4,000 at 10:00 → T05: ₹4,000 at 10:04 · independent receipt RP1 explains a group purchase' },
  ].map(path => <div key={path.id}><ol className={w.route}>{path.nodes.map((node, index) => <li key={node}><span>{node}</span>{index < 2 && <ArrowRight aria-hidden="true" />}</li>)}</ol><p>{path.note}</p></div>)}<small>No real accounts, account numbers or allegations. Missing context must remain visible.</small></figure>;
}
export function CaseworkArtifact({ index, revised = false }: { index: number; revised?: boolean }) {
  if (index === 4) return <TransferRoutes />;
  const headings = ['Recruitment chain', 'Mock investment source pack', 'Independent identity protocol', 'Mock account-misuse receipt', '', 'Prevention-aid test brief', 'College-fest incident evidence', 'Fresh evidence-hearing case'];
  const packs: (readonly (readonly string[])[])[] = [
    [['C1 · reward', '₹100 task payment in the supplied practice record'], ['C2 · escalation', 'Deposit ₹2,000 to unlock more tasks'], ['C3 · account use', 'Rent personal account to receive someone else’s funds'], ['C4 · onward request', 'Forward ₹4,800 and keep commission; source/purpose unresolved']],
    c.investmentPack,
    [['Claimant', 'Familiar voice/profile/title; secrecy and new verification number'], ['Known office route', 'Previously saved school careers-office contact'], ['Separate contact pack', 'Independently supplied organisation channel'], ['Partial result', revised ? 'Role exists; claimant and private request remain unverified' : 'Exact identity and request still need independent evidence']],
    [['Time / amount', `${c.caseIncident.time} · ₹${c.caseIncident.amount}`], ['Reference', c.caseIncident.reference], ['Observed event', c.caseIncident.event], ['Evidence handling', 'Restricted originals; redacted classroom copy; no PIN/OTP'], ['Status', 'MOCK ONLY · never submitted']],
    [],
    [['Draft', 'Trust familiar display name; approve first; wait for perfect file; forward screenshots'], ['P1 · before payment', 'Pause and use a previously known independent route'], ['P2 · after suspected loss', 'Prompt trusted bank/adult/official help; restricted evidence'], ['Required record', 'Test before and after revision; peer/teacher reviews usability']],
    [['Security', 'Public export setting confirmed; full download scope unknown'], ['AI advice', 'Voice-authenticity/payment advice has no reliable cited evidence'], ['CT record', 'Same event ID carries ₹2,300 and ₹3,200 versions'], ['Fraud request', '₹3,200 to an unverified new beneficiary'], ['Independent update', revised ? 'Known school contact confirms original vendor order for ₹2,300 only' : 'Original order not yet independently checked']],
    [['Supported context', 'RP1 explains C’s group purchase'], ['Unsupported allegation', 'A pass-through flag proves intent'], ['Separate request', 'Another caller asks for a PIN'], ['Decision boundary', 'Receipt does not verify caller or authorise secret disclosure']],
  ];
  return <div className={v.artifact}><div className={v.appBar}><FolderSearch aria-hidden="true" /><strong>{headings[index]} · fictional case</strong></div>{packs[index].map(([label, value]) => <div className={v.artifactRow} key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>;
}
function CaseworkWorld({ index, script, scene, playing, elapsed, solved, markSolved, hint, setHint, reduced }: StoryWorldProps & { index: number; script: StoryScript }) {
  const [selected, setSelected] = useState<number | null>(null);
  const task = c.caseworkStoryTasks[index];
  const artwork = caseworkArtwork[CLASS12_FRAUD_SLUGS[index]];
  return <SceneSwap scene={scene} reduced={reduced}><div className={v.storyBoard}>
    <div className={v.appBar}><FolderSearch aria-hidden="true" /><strong>Cyberpur · Class 12 private casework desk</strong></div>
    <h2 style={{ marginTop: 18 }}>{script.scenes[scene].title}</h2>
    {scene === 0 ? <figure className={v.sceneIllustration}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={artwork.src} alt={artwork.alt} width={1400} height={788} decoding="async" /><figcaption>{artwork.caption}</figcaption>
    </figure> : scene === 2 || scene === 5 ? <div className={v.storyFacts}>{task.concepts.map((concept, item) => <div className={v.storyFact} data-active={!playing || elapsed >= item * 3} key={concept}><Check aria-hidden="true" /><span>{concept}</span></div>)}</div> : <CaseworkArtifact index={index} revised={scene >= 4} />}
    {scene === 3 && !solved && <div className={v.board}><p className={a.storyQuestion}><strong>{task.question}</strong></p><div className={v.actionBank}>{task.choices.map((choice, item) => <button className={k.primary} type="button" aria-pressed={selected === item} key={choice} onClick={() => { setSelected(item); setHint(''); }}>{choice}</button>)}</div><button className={k.primary} disabled={selected === null} type="button" onClick={() => selected === task.answer ? markSolved() : setHint(task.why, false)}>Test my decision</button></div>}
    {hint && <p className={k.hint} role="status">{hint}</p>}
    <small className={k.note}>Fictional records only. No real transfer, identity upload, external contact, report submission or allegation.</small>
  </div></SceneSwap>;
}
export function makeCaseworkStory(slug: typeof CLASS12_FRAUD_SLUGS[number], script: StoryScript): StoryChapter {
  const index = CLASS12_FRAUD_SLUGS.indexOf(slug);
  return { script, title: c.caseworkStoryTasks[index].title, icon: FolderSearch,
    character: index % 2 === 0 ? { asset: 'girl-expressions', name: 'Asha' } : { asset: 'emotional-avatar', name: 'Kabir' },
    interactionScene: 3, beginLabel: 'Enter the casework lab',
    waitingText: 'Story paused. Inspect the evidence and test your response.', lockedHint: 'Complete the casework decision first.',
    World: function World(props: StoryWorldProps) { return <CaseworkWorld {...props} index={index} script={script} />; },
  };
}
