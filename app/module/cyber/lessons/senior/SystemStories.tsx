"use client";

import { ArrowRight, Check, Network } from 'lucide-react';
import { useState } from 'react';
import { SceneSwap } from '../new/story/StoryPlayer';
import type { StoryChapter, StoryScript, StoryWorldProps } from '../new/story/types';
import { CLASS12_SECURITY_SLUGS } from '../../../../data/class-12-missions';
import * as c from './system-content';
import { systemArtwork } from './system-art';
import k from '../new/story/story-player.module.css';
import v from './security.module.css';
import a from './ai.module.css';
import z from './system.module.css';

export function PortalDiagram() {
  return <figure className={z.diagram}><figcaption>Fictional college-fest portal · trust changes at each arrow</figcaption><ol>{[['Browser', 'Untrusted client input; display responses'], ['Application server', 'Trusted session + action permission + validation'], ['Database', 'Constrained service access; private records']].map(([label, detail], index) => <li key={label}><div><strong>{label}</strong><span>{detail}</span></div>{index < 2 && <ArrowRight aria-hidden="true" />}</li>)}</ol><p>DNS locates the hostname; HTTPS protects the connection. External payment status crosses a separate server/provider verification boundary.</p></figure>;
}
export function SystemArtifact({ index, resolved = false }: { index: number; resolved?: boolean }) {
  if (index === 1) return <PortalDiagram />;
  const headings = ['System risk register', '', 'Offline request test pack', 'Supplier dependency brief', 'Supplied event ledger', 'Data-exposure inject', 'Recovery exercise evidence', 'Changed assurance scenario'];
  const packs: (readonly (readonly string[])[])[] = [
    [['Private contacts', 'Public export · supplied risk score 9 · registration lead'], ['Gate availability', 'Single device · score 6 · operations lead'], ['Programme poster', 'Editable copy · score 2 · communications lead'], ['Remaining risk', 'Each owner reviews controls and unresolved dependencies']],
    [],
    c.portalCases.map(test => [test.label, resolved ? test.expected : 'Draft controls disabled; compare Expected with Actual']),
    [['Budget', '6 invented units'], ['Supplier task', 'Publish programme; no registration export'], ['Required controls', 'Programme-only expiry; managed secrets/updates; independent recovery'], ['Cost', '2 units per required control']],
    c.logEvents.map(event => [event.id + ' · raw ' + c.clockLabel(event.rawMinute), event.observation + (event.fastBy ? ' · clock two minutes fast' : '')]),
    [['Confirmed', 'Public registration-export link in supplied settings'], ['Unresolved', 'Full download scope and receiving party'], ['Responsible roles', 'Incident lead · operator · recorder · communications lead'], ['Response', resolved ? 'Restriction verified; evidence preserved; scope under review' : 'Authorised containment and factual communication needed']],
    [['Incident / restore', '14:10 / 14:22'], ['Exercise targets', 'Downtime ≤30 min; data loss ≤10 min'], ['14:08 copy', 'Missing R40; guest can read private records'], ['14:00 copy', 'R10–R40 and correct access model'], ['Checks', 'Exact IDs/statuses; access; recovery time; recovery point']],
    [['New evidence', 'Initial login alert was authorised maintenance'], ['Independent evidence', 'Public export setting remains confirmed'], ['Decision', resolved ? 'Revise login hypothesis; contain and review separate exposure' : 'Update only the conclusion supported by new evidence'], ['Owner / limit', 'Service lead reviews scope; operations lead owns residual outage risk']],
  ];
  return <div className={v.artifact}><div className={v.appBar}><Network aria-hidden="true" /><strong>{headings[index]} · simulation</strong></div>{packs[index].map(([label, value]) => <div className={v.artifactRow} key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>;
}
function SystemWorld({ index, script, scene, playing, elapsed, solved, markSolved, hint, setHint, reduced }: StoryWorldProps & { index: number; script: StoryScript }) {
  const [selected, setSelected] = useState<number | null>(null);
  const task = c.systemStoryTasks[index];
  const artwork = systemArtwork[CLASS12_SECURITY_SLUGS[index]];
  return <SceneSwap scene={scene} reduced={reduced}><div className={v.storyBoard}>
    <div className={v.appBar}><Network aria-hidden="true" /><strong>Cyberpur · Class 12 portal design room</strong></div>
    <h2 style={{ marginTop: 18 }}>{script.scenes[scene].title}</h2>
    {scene === 0 ? <figure className={v.sceneIllustration}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={artwork.src} alt={artwork.alt} width={1400} height={788} decoding="async" /><figcaption>{artwork.caption}</figcaption>
    </figure> : scene === 2 || scene === 5 ? <div className={v.storyFacts}>{task.concepts.map((concept, item) => <div className={v.storyFact} data-active={!playing || elapsed >= item * 3} key={concept}><Check aria-hidden="true" /><span>{concept}</span></div>)}</div> : <SystemArtifact index={index} resolved={scene >= 4} />}
    {scene === 3 && !solved && <div className={v.board}><p className={a.storyQuestion}><strong>{task.question}</strong></p><div className={v.actionBank}>{task.choices.map((choice, item) => <button className={k.primary} type="button" aria-pressed={selected === item} key={choice} onClick={() => { setSelected(item); setHint(''); }}>{choice}</button>)}</div><button className={k.primary} disabled={selected === null} type="button" onClick={() => selected === task.answer ? markSolved() : setHint(task.why, false)}>Test my decision</button></div>}
    {hint && <p className={k.hint} role="status">{hint}</p>}
    <small className={k.note}>Synthetic records and offline models. No live scanning, exploitation, external messages or service changes.</small>
  </div></SceneSwap>;
}
export function makeSystemStory(slug: typeof CLASS12_SECURITY_SLUGS[number], script: StoryScript): StoryChapter {
  const index = CLASS12_SECURITY_SLUGS.indexOf(slug);
  return { script, title: c.systemStoryTasks[index].title, icon: Network,
    character: index % 2 === 0 ? { asset: 'girl-expressions', name: 'Asha' } : { asset: 'emotional-avatar', name: 'Kabir' },
    interactionScene: 3, beginLabel: 'Enter the system lab',
    waitingText: 'Story paused. Inspect the system evidence and test your decision.', lockedHint: 'Complete the system decision first.',
    World: function World(props: StoryWorldProps) { return <SystemWorld {...props} index={index} script={script} />; },
  };
}
