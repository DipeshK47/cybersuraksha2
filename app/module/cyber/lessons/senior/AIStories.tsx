"use client";

import { Bot, Check, ClipboardCheck, Database, FlaskConical, Search, Sparkles } from "lucide-react";
import { useState } from "react";
import { SceneSwap } from "../new/story/StoryPlayer";
import type { StoryChapter, StoryScript, StoryWorldProps } from "../new/story/types";
import { CLASS11_AI_SLUGS } from "../../../../data/class-11-missions";
import * as c from "./ai-content";
import { aiArtwork } from "./ai-art";
import k from "../new/story/story-player.module.css";
import v from "./security.module.css";
import a from "./ai.module.css";

function AiArtifact({ index, scene }: { index: number; scene: number }) {
  const resolved = scene >= 4;
  let heading: string;
  let rows: [string, string][];
  if (index === 0) { heading = "Festival task desk"; rows = [["Ticket total", resolved ? "Explicit price × quantity rule" : "Exact prices and quantity available"], ["Sample picture", "Prediction from labelled examples"], ["Volunteer message", "Draft checked against sources"]]; }
  else if (index === 1) { heading = "Experiment brief"; rows = [["User", "Festival volunteers"], ["Input → output", "Practice image → material suggestion or review"], ["Success", "Fixed held-out pack, target defined first"], ["Unfamiliar case", resolved ? "Human review" : "Needs an explicit route"]]; }
  else if (index === 2) { heading = "Synthetic data audit"; rows = c.repairRows.map(row => [row.id, resolved ? `${row.answer}: ${row.observation}` : `${row.original}: ${row.observation}`]); }
  else if (index === 3) { heading = "Tiny nearest-example classifier"; rows = [["Training at first", "P1, P2: Paper only"], ["Missing coverage", resolved ? "M1, M2 Metal examples added" : "No Metal examples selected"], ["Held-out labels", resolved ? "Revealed after predictions committed" : "Kept out of training"], ["Equal-nearest disagreement", "Request human review"]]; }
  else if (index === 4) { heading = "Same held-out evaluation pack"; rows = [["Model correct", "6 / 8"], ["Always-Recycle baseline", "5 / 8"], ["Model missed cases", "E3 and E8"], ["Claim boundary", "This small pack only"]]; }
  else if (index === 5) { heading = "Errors by supplied condition"; rows = [["Bright", "7 / 8 correct · 1 error"], ["Dim", "3 / 8 correct · 5 errors"], ["Interpretation", "Uneven errors need investigation"], ["Next step", resolved ? "Varied evidence and human fallback" : "Check coverage and alternatives"]]; }
  else if (index === 6) { heading = "Fictional source desk"; rows = [["F1 · volunteer memo", "Friday · 15:30 · Room B"], ["F2 · practice note", "Glass collection is adult-led"], ["F3 · trial log", "No percentage reduction measured"], ["90% claim", resolved ? "Removed: unsupported" : "Assistant supplied no supporting measurement"]]; }
  else { heading = "AI evaluation hearing"; rows = [["Baseline comparison", "Model 6/8 · baseline 5/8"], ["Known limitation", "Dim group: 5/8 errors"], ["Human route", resolved ? "Manual review retained" : "Missing from current proposal"], ["Changed setting", "Evening conditions not evaluated"]]; }
  return <div className={v.artifact}><div className={v.appBar}><FlaskConical aria-hidden="true" /><strong>{heading}</strong></div>{rows.map(([label, value]) => <div className={v.artifactRow} key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>;
}

function AiWorld({ index, script, scene, playing, elapsed, solved, markSolved, hint, setHint, reduced }: StoryWorldProps & { index: number; script: StoryScript }) {
  const [selected, setSelected] = useState<number | null>(null);
  const data = c.aiStoryTasks[index];
  const slug = CLASS11_AI_SLUGS[index];
  const artwork = aiArtwork[slug];
  const icons = [Bot, ClipboardCheck, Database, FlaskConical, ClipboardCheck, Search, Search, Sparkles];
  const Icon = icons[index];
  return <SceneSwap scene={scene} reduced={reduced}><div className={v.storyBoard}>
    <div className={v.appBar}><Icon aria-hidden="true" /><strong>Cyberpur · Class 11 AI experiment</strong></div>
    <h2 style={{ marginTop: 18 }}>{script.scenes[scene].title}</h2>
    {scene === 0 ? <figure className={v.sceneIllustration}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={artwork.src} alt={artwork.alt} width={1400} height={788} decoding="async" /><figcaption>{artwork.caption}</figcaption>
    </figure> : scene === 2 || scene === 5 ? <div className={v.storyFacts}>{data.concepts.map((concept, item) => <div className={v.storyFact} data-active={!playing || elapsed >= item * 3} key={concept}><Check aria-hidden="true" /><span>{concept}</span></div>)}</div> : <AiArtifact index={index} scene={scene} />}
    {scene === 3 && !solved && <div className={v.board}><p className={a.storyQuestion}><strong>{data.question}</strong></p><div className={v.actionBank}>{data.choices.map((choice, item) => <button className={k.primary} type="button" aria-pressed={selected === item} key={choice} onClick={() => { setSelected(item); setHint(""); }}>{choice}</button>)}</div><button className={k.primary} disabled={selected === null} type="button" onClick={() => selected === data.answer ? markSolved() : setHint(data.why, false)}>Test my decision</button></div>}
    {hint && <p className={k.hint} role="status">{hint}</p>}
    <small className={k.note}>Fictional examples and prepared outputs. No private records or external AI account required.</small>
  </div></SceneSwap>;
}

export function makeAiStory(slug: typeof CLASS11_AI_SLUGS[number], script: StoryScript): StoryChapter {
  const index = CLASS11_AI_SLUGS.indexOf(slug);
  const data = c.aiStoryTasks[index];
  return {
    script, title: data.title, icon: FlaskConical,
    character: index % 2 === 0 ? { asset: "girl-expressions", name: "Asha" } : { asset: "emotional-avatar", name: "Kabir" },
    interactionScene: 3, beginLabel: "Enter the AI lab",
    waitingText: "Story paused. Check the evidence and test your decision.", lockedHint: "Complete the experiment decision first.",
    World: function World(props: StoryWorldProps) { return <AiWorld {...props} index={index} script={script} />; },
  };
}
