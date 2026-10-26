"use client";

import { Check, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { SceneSwap } from '../new/story/StoryPlayer';
import type { StoryChapter, StoryScript, StoryWorldProps } from '../new/story/types';
import { CLASS11_FRAUD_SLUGS } from '../../../../data/class-11-missions';
import * as c from './fraud-content';
import { fraudArtwork } from './fraud-art';
import k from '../new/story/story-player.module.css';
import v from './security.module.css';
import a from './ai.module.css';

export function FraudArtifact({ index, resolved = false }: { index: number; resolved?: boolean }) {
  const headings = ['College-place offer', 'Internship source comparison', 'Mock payment authorisation', 'Bank-warning inspection', 'Simulated incoming call', 'Fictional incident receipt', 'Festival-refund evidence pack', 'Fresh exam-fee case'];
  const packs: (readonly (readonly string[])[])[] = [
    [['Deadline', 'Five minutes'], ['Claimed authority', 'Admissions director'], ['Availability / reward', 'Two places · guaranteed stipend'], ['Instruction', 'Keep secret and pay now'], ['Evidence status', resolved ? 'Pause; independent college check required' : 'Unverified sender and claim']],
    c.offerPack,
    [['Message claims', 'Receive ₹800 festival refund'], ['Authorisation says', 'PAY ₹800'], ['From → To', 'Asha → Refund Desk'], ['Result', resolved ? 'Cancelled; independent refund check needed' : 'Outgoing approval, not incoming credit']],
    [['Display name', 'School Bank Support'], ['Actual sender', 'help@schoolbank-alerts.example'], ['Independent pack', 'schoolbank.example · use existing trusted app'], ['Message number', 'Supplied only by this warning'], ['Check', resolved ? 'Use independently obtained bank route' : 'Unverified account-lock claim']],
    [['Sound', 'Familiar relative’s voice'], ['Demand', 'Secret emergency transfer'], ['Proposed verifier', 'New number supplied by the same caller'], ['Status', resolved ? 'Call ended; known contact and adult support' : 'Identity and circumstances unverified']],
    [['Date / time', `${c.incident.date} · ${c.incident.time}`], ['Amount / reference', `₹${c.incident.amount} · ${c.incident.reference}`], ['Event', c.incident.event], ['Action', 'Immediate bank contact and prompt official reporting for a real loss'], ['Classroom copy', 'Mock only · unrelated personal details redacted']],
    [['Security', 'Public receipt-folder link'], ['AI advice', '“Approve the refund” · no cited source'], ['Logic draft', 'Unknown verification → approve'], ['Payment', 'PAY ₹800 TO Refund Desk'], ['New evidence', resolved ? 'Known school contact confirms refund due; payee still unverified' : 'Refund not yet independently confirmed']],
    [['Claim', 'Exam-fee correction requires private ₹950 transfer'], ['Persuasion', 'Familiar voice; keep it secret'], ['Assistant', 'Confident but uncited approval advice'], ['Independent notice', 'No correction confirmed by the supplied pack'], ['Decision', resolved ? 'Pause and verify through known school contact' : 'Unresolved; do not treat confidence as authority']],
  ];
  return <div className={v.artifact}><div className={v.appBar}><ShieldCheck aria-hidden="true" /><strong>{headings[index]} · simulation</strong></div>{packs[index].map(([label, value]) => <div className={v.artifactRow} key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>;
}
function FraudWorld({ index, script, scene, playing, elapsed, solved, markSolved, hint, setHint, reduced }: StoryWorldProps & { index: number; script: StoryScript }) {
  const [selected, setSelected] = useState<number | null>(null);
  const task = c.fraudStoryTasks[index];
  const artwork = fraudArtwork[CLASS11_FRAUD_SLUGS[index]];
  return <SceneSwap scene={scene} reduced={reduced}><div className={v.storyBoard}>
    <div className={v.appBar}><ShieldCheck aria-hidden="true" /><strong>Cyberpur · Class 11 verification desk</strong></div>
    <h2 style={{ marginTop: 18 }}>{script.scenes[scene].title}</h2>
    {scene === 0 ? <figure className={v.sceneIllustration}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={artwork.src} alt={artwork.alt} width={1400} height={788} decoding="async" /><figcaption>{artwork.caption}</figcaption>
    </figure> : scene === 2 || scene === 5 ? <div className={v.storyFacts}>{task.concepts.map((concept, item) => <div className={v.storyFact} data-active={!playing || elapsed >= item * 3} key={concept}><Check aria-hidden="true" /><span>{concept}</span></div>)}</div> : <FraudArtifact index={index} resolved={scene >= 4} />}
    {scene === 3 && !solved && <div className={v.board}><p className={a.storyQuestion}><strong>{task.question}</strong></p><div className={v.actionBank}>{task.choices.map((choice, item) => <button className={k.primary} type="button" aria-pressed={selected === item} key={choice} onClick={() => { setSelected(item); setHint(''); }}>{choice}</button>)}</div><button className={k.primary} disabled={selected === null} type="button" onClick={() => selected === task.answer ? markSolved() : setHint(task.why, false)}>Test my decision</button></div>}
    {hint && <p className={k.hint} role="status">{hint}</p>}
    <small className={k.note}>Fictional cases only. No real payments, calls, document uploads or reports.</small>
  </div></SceneSwap>;
}
export function makeFraudStory(slug: typeof CLASS11_FRAUD_SLUGS[number], script: StoryScript): StoryChapter {
  const index = CLASS11_FRAUD_SLUGS.indexOf(slug);
  return { script, title: c.fraudStoryTasks[index].title, icon: ShieldCheck,
    character: index % 2 === 0 ? { asset: 'girl-expressions', name: 'Asha' } : { asset: 'emotional-avatar', name: 'Kabir' },
    interactionScene: 3, beginLabel: 'Enter the verification lab',
    waitingText: 'Story paused. Inspect the evidence and test your decision.', lockedHint: 'Complete the verification decision first.',
    World: function World(props: StoryWorldProps) { return <FraudWorld {...props} index={index} script={script} />; },
  };
}
