"use client";

import { ArrowRight, Check, Workflow } from 'lucide-react';
import { useState } from 'react';
import { SceneSwap } from '../new/story/StoryPlayer';
import type { StoryChapter, StoryScript, StoryWorldProps } from '../new/story/types';
import { CLASS12_CT_SLUGS } from '../../../../data/class-12-missions';
import * as c from './reliability-content';
import { reliabilityArtwork } from './reliability-art';
import k from '../new/story/story-player.module.css';
import v from './security.module.css';
import a from './ai.module.css';
import z from './system.module.css';

export function PipelineDiagram() {
  return <figure className={z.diagram}><figcaption>Offline alerts pipeline · explicit contracts at every handoff</figcaption><ol>{[['Input', 'Preserve original batch'], ['Validate', 'Schema, stable IDs and conflict checks'], ['Transform', 'Apply the stated review threshold'], ['Output', 'Ledger, quarantine and checkpoint log']].map(([label, detail], index) => <li key={label}><div><strong>{label}</strong><span>{detail}</span></div>{index < 3 && <ArrowRight aria-hidden="true" />}</li>)}</ol><p>Invalid or conflicting input is quarantined with a reason. An output fault stops with completed IDs and pending work preserved. This diagram sends no alerts.</p></figure>;
}
export function ReliabilityArtifact({ index }: { index: number }) {
  if (index === 3) return <PipelineDiagram />;
  const headings = ['Desk operation cards', 'Counted classroom operations', 'Stable-ID reconciliation', '', 'Checkpointed failure trace', 'Observed alert windows', 'Eight-case regression contract', 'Changed design brief'];
  const packs: (readonly (readonly string[])[])[] = [
    [['Ordered programme', 'List · position is not identity'], ['Registration record', 'Stable-key lookup after conflicts resolved'], ['Undo U1, U2, U3', 'Next removal U3 · stack'], ['Support T1, T2, T3', 'Next removal T1 · queue']],
    [8, 16, 32].map(n => { const count = c.operationCounts(n); return [`n = ${n}`, `${count.direct} indexed · ${count.binary} binary · ${count.linear} linear · ${count.pairs} unordered pairs`]; }),
    c.reconcileRegistrations(c.registrations, c.checkIns).map(row => [row.id, row.outcome]),
    [],
    [['First run', 'A01 committed; output fault before A02'], ['Pending', 'A02 and A03 retained'], ['After fault resolution', 'Retry preserved batch; skip identical committed A01'], ['Completed retry', 'A01, A02 and A03 each present once in the model ledger']],
    c.observationWindows.map(window => [`Window ${window.id} · ${window.hours}h`, `${window.flagged}/${window.observed} observed = ${Number(c.observedRate(window.flagged, window.observed)) * 100}% · ${window.missing} missing`]),
    c.regressionCases.map(test => [test.id, `${test.label} → ${test.expected}`]),
    [['New version', 'Review threshold ≥80; capacity supported'], ['Larger input', '128 record visits versus 8,128 unordered-pair comparisons'], ['Boundary cases', '79 → Record only; 80/81 → Review'], ['Human authority', 'Owner reviews identity conflicts and approves policy changes']],
  ];
  return <div className={v.artifact}><div className={v.appBar}><Workflow aria-hidden="true" /><strong>{headings[index]} · synthetic exercise</strong></div>{packs[index].map(([label, value]) => <div className={v.artifactRow} key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>;
}
function ReliabilityWorld({ index, script, scene, playing, elapsed, solved, markSolved, hint, setHint, reduced }: StoryWorldProps & { index: number; script: StoryScript }) {
  const [selected, setSelected] = useState<number | null>(null);
  const task = c.reliabilityStoryTasks[index];
  const artwork = reliabilityArtwork[CLASS12_CT_SLUGS[index]];
  return <SceneSwap scene={scene} reduced={reduced}><div className={v.storyBoard}>
    <div className={v.appBar}><Workflow aria-hidden="true" /><strong>Cyberpur · Class 12 reliable automation lab</strong></div>
    <h2 style={{ marginTop: 18 }}>{script.scenes[scene].title}</h2>
    {scene === 0 ? <figure className={v.sceneIllustration}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={artwork.src} alt={artwork.alt} width={1400} height={788} decoding="async" /><figcaption>{artwork.caption}</figcaption>
    </figure> : scene === 2 || scene === 5 ? <div className={v.storyFacts}>{task.concepts.map((concept, item) => <div className={v.storyFact} data-active={!playing || elapsed >= item * 3} key={concept}><Check aria-hidden="true" /><span>{concept}</span></div>)}</div> : <ReliabilityArtifact index={index} />}
    {scene === 3 && !solved && <div className={v.board}><p className={a.storyQuestion}><strong>{task.question}</strong></p><div className={v.actionBank}>{task.choices.map((choice, item) => <button className={k.primary} type="button" aria-pressed={selected === item} key={choice} onClick={() => { setSelected(item); setHint(''); }}>{choice}</button>)}</div><button className={k.primary} disabled={selected === null} type="button" onClick={() => selected === task.answer ? markSolved() : setHint(task.why, false)}>Test my decision</button></div>}
    {hint && <p className={k.hint} role="status">{hint}</p>}
    <small className={k.note}>Synthetic records and offline models only. No real registrations, notifications, messages or service changes.</small>
  </div></SceneSwap>;
}
export function makeReliabilityStory(slug: typeof CLASS12_CT_SLUGS[number], script: StoryScript): StoryChapter {
  const index = CLASS12_CT_SLUGS.indexOf(slug);
  return { script, title: c.reliabilityStoryTasks[index].title, icon: Workflow,
    character: index % 2 === 0 ? { asset: 'girl-expressions', name: 'Asha' } : { asset: 'emotional-avatar', name: 'Kabir' },
    interactionScene: 3, beginLabel: 'Enter the reliability lab',
    waitingText: 'Story paused. Trace the workflow and test your decision.', lockedHint: 'Complete the reliability decision first.',
    World: function World(props: StoryWorldProps) { return <ReliabilityWorld {...props} index={index} script={script} />; },
  };
}
