"use client";

import { Check, Code2, GitBranch, ListChecks, Search } from "lucide-react";
import { useState } from "react";
import { SceneSwap } from "../new/story/StoryPlayer";
import type { StoryChapter, StoryScript, StoryWorldProps } from "../new/story/types";
import { CLASS11_CT_SLUGS } from "../../../../data/class-11-missions";
import * as c from "./ct-content";
import { ctArtwork } from "./ct-art";
import k from "../new/story/story-player.module.css";
import v from "./security.module.css";
import a from "./ai.module.css";

function CtArtifact({ index, scene }: { index: number; scene: number }) {
  const resolved = scene >= 4;
  let heading: string;
  let rows: [string, string][];
  if (index === 0) { heading = "Enquiry decomposition"; rows = [["1 · Intake", "Synthetic ID, score and document status"], ["2 · Check", "Stated rules and missing-data paths"], ["3 · Review", "Responsible teacher"], ["4 · Communicate", "Reviewed outcome"]]; }
  else if (index === 1) { heading = "Minimal data dictionary"; rows = [["ID", "Uppercase letter + two digits · unique"], ["Score", "Finite 0–100 or explicitly missing"], ["Documents", "Complete / incomplete / unknown"], ["Duplicate ID", resolved ? "Preserved and flagged" : "Conflict needs a defined route"]]; }
  else if (index === 2) { heading = "Fictional rule desk"; rows = [["Threshold", resolved ? "score ≥ 60" : "Compare >60 with ≥60"], ["Join", resolved ? "AND complete documents" : "OR would change the rule"], ["Exact 60 / complete", "Eligible under the exercise brief"], ["High score / incomplete", "Needs documents"]]; }
  else if (index === 3) { heading = "Loop trace · length 3"; rows = c.loopTrace([59, 60, 72], !resolved).map(row => [`Index ${row.index}`, row.error ? "Out-of-range read" : `Value ${row.value}`]); }
  else if (index === 4) { heading = "Measured lookup for ID 60"; rows = [["Shuffled list", c.searchValues.join(", ")], ["Linear lookup", "5 comparisons"], ["Sorted binary lookup", "2 comparisons"], ["Important limit", "Sorting preparation cost excluded"]]; }
  else if (index === 5) { heading = "One shared validated function"; rows = [["B20 · 60 / complete", "Eligible"], ["C30 · 59 / complete", "Not eligible"], ["D40 · 65 / incomplete", "Needs documents"], ["Score absent", "Review missing data"]]; }
  else if (index === 6) { heading = "Six-case test matrix"; rows = c.testCases.map(test => [test.id, `${test.description} → ${test.expected}`]); }
  else { heading = "Revised ≥70 exercise brief"; rows = [["Score 60 / complete", "Not eligible under the new rule"], ["Exactly 70 / complete", "Eligible"], ["Missing or duplicate data", "Review protections retained"], ["Real award decision", "Still with the responsible teacher"]]; }
  return <div className={v.artifact}><div className={v.appBar}><Code2 aria-hidden="true" /><strong>{heading}</strong></div>{rows.map(([label, value]) => <div className={v.artifactRow} key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>;
}

function CtWorld({ index, script, scene, playing, elapsed, solved, markSolved, hint, setHint, reduced }: StoryWorldProps & { index: number; script: StoryScript }) {
  const [selected, setSelected] = useState<number | null>(null);
  const data = c.ctStoryTasks[index];
  const artwork = ctArtwork[CLASS11_CT_SLUGS[index]];
  const Icon = index === 4 ? Search : index === 6 || index === 7 ? ListChecks : GitBranch;
  return <SceneSwap scene={scene} reduced={reduced}><div className={v.storyBoard}>
    <div className={v.appBar}><Icon aria-hidden="true" /><strong>Cyberpur · Class 11 workflow desk</strong></div>
    <h2 style={{ marginTop: 18 }}>{script.scenes[scene].title}</h2>
    {scene === 0 ? <figure className={v.sceneIllustration}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={artwork.src} alt={artwork.alt} width={1400} height={788} decoding="async" /><figcaption>{artwork.caption}</figcaption>
    </figure> : scene === 2 || scene === 5 ? <div className={v.storyFacts}>{data.concepts.map((concept, item) => <div className={v.storyFact} data-active={!playing || elapsed >= item * 3} key={concept}><Check aria-hidden="true" /><span>{concept}</span></div>)}</div> : <CtArtifact index={index} scene={scene} />}
    {scene === 3 && !solved && <div className={v.board}><p className={a.storyQuestion}><strong>{data.question}</strong></p><div className={v.actionBank}>{data.choices.map((choice, item) => <button className={k.primary} type="button" aria-pressed={selected === item} key={choice} onClick={() => { setSelected(item); setHint(""); }}>{choice}</button>)}</div><button className={k.primary} disabled={selected === null} type="button" onClick={() => selected === data.answer ? markSolved() : setHint(data.why, false)}>Test my decision</button></div>}
    {hint && <p className={k.hint} role="status">{hint}</p>}
    <small className={k.note}>Fictional records and criteria. The simulation makes no real awards or payments.</small>
  </div></SceneSwap>;
}

export function makeCtStory(slug: typeof CLASS11_CT_SLUGS[number], script: StoryScript): StoryChapter {
  const index = CLASS11_CT_SLUGS.indexOf(slug);
  const data = c.ctStoryTasks[index];
  return { script, title: data.title, icon: GitBranch,
    character: index % 2 === 0 || index === 7 ? { asset: "girl-expressions", name: "Asha" } : { asset: "emotional-avatar", name: "Kabir" },
    interactionScene: 3, beginLabel: "Enter the logic lab",
    waitingText: "Story paused. Trace the reasoning and test your decision.", lockedHint: "Complete the workflow decision first.",
    World: function World(props: StoryWorldProps) { return <CtWorld {...props} index={index} script={script} />; },
  };
}
