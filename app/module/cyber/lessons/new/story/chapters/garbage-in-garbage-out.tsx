"use client";

import { Award, CakeSlice, Check, CircleX, Clock, Cookie, Croissant, Laptop, ListFilter, Play, RotateCcw, Scale, School, ShieldCheck, Star, Store, Sunrise, Trash2, UserRound, Users } from "lucide-react";
import { useState } from "react";
import { SceneSwap } from "../StoryPlayer";
import type { StoryChapter, StoryWorldProps } from "../types";
import script from "./garbage-in-garbage-out.json";
import k from "../story-player.module.css";
import r from "./garbage-in-garbage-out.module.css";

const applicants = [
  { name: "Priya", school: "Riverside", years: 3, taste: 9, old: false, fair: true },
  { name: "Arjun", school: "Hilltop", years: 2, taste: 8, old: true, fair: true },
  { name: "Neha", school: "Hilltop", years: 1, taste: 6, old: true, fair: false },
  { name: "Kiran", school: "Hilltop", years: 4, taste: 8, old: true, fair: true },
];
const columns = [
  { id: "school", name: "School name", sample: "Hilltop · Riverside · Lakeview", Icon: School, why: "" },
  { id: "years", name: "Years of baking", sample: "0 to 6 years", Icon: Clock, why: "Years of baking shows real experience for this job. Keep it: removing it makes the tool worse, not fairer." },
  { id: "taste", name: "Tasting score", sample: "Judged out of 10", Icon: Star, why: "The tasting score measures how good the baking is. That’s exactly what this job needs, so keep it." },
  { id: "safety", name: "Food safety certificate", sample: "Yes or no", Icon: ShieldCheck, why: "Food safety matters in every kitchen. It’s about the job, so keep it." },
  { id: "early", name: "Can start at 6 am", sample: "Yes or no", Icon: Sunrise, why: "Bakeries start early, so this is part of the job. Keep it." },
];
const records = [["2015", "Hilltop", "1", "Hired"], ["2017", "Hilltop", "0", "Hired"], ["2019", "Hilltop", "2", "Hired"], ["2021", "Hilltop", "1", "Hired"], ["2023", "Hilltop", "0", "Hired"]];

function Applicant({ a, picked, show }: { a: (typeof applicants)[number]; picked: boolean; show?: Record<string, boolean> }) {
  return <div className={r.applicant} data-picked={picked} {...show}>
    <span className={r.initial}>{a.name[0]}</span>
    <div><strong>{a.name}</strong><small>{a.school} School · {a.years} {a.years === 1 ? "year" : "years"} baking · tasting {a.taste}/10</small></div>
    <b>{picked ? <><Check aria-hidden="true" />Shortlisted</> : <><CircleX aria-hidden="true" />Not a good match</>}</b>
  </div>;
}

function Shop({ scene }: { scene: number }) {
  return <>
    <span className={r.awning} aria-hidden="true" />
    <div className={r.shelf} data-i="1" aria-hidden="true"><Croissant /><CakeSlice /><Cookie /><Croissant /></div>
    <div className={r.shelf} data-i="2" aria-hidden="true"><Cookie /><CakeSlice /><Croissant /><CakeSlice /></div>
    {scene === 0 && <div className={r.sign}><small>Help wanted</small><strong>Baker’s helper</strong><span>Apply inside</span></div>}
  </>;
}

function World({ scene, playing, elapsed, solved, markSolved, hint, setHint, reduced }: StoryWorldProps) {
  const [removed, setRemoved] = useState(false);
  const [rerun, setRerun] = useState(false);
  const [passing, setPassing] = useState(false);
  const done = solved || passing;
  const fair = solved || (rerun && removed);
  const cut = solved || removed;
  // Reveal an item once narration reaches that fraction of the scene (everything shows while paused).
  const cue = (at: number) => !playing || elapsed > script.scenes[scene].duration * at;
  const show = (at: number) => ({ "data-on": cue(at), "aria-hidden": !cue(at) });

  function remove(id: string) {
    if (done) return;
    setRerun(false);
    if (id === "school") { setRemoved(true); setHint("School name removed. A school’s name says nothing about how well someone bakes."); return; }
    setHint(columns.find(c => c.id === id)!.why);
  }
  function run() {
    if (done) return;
    setRerun(true);
    if (!removed) { setHint("Still only Hilltop applicants. The tool is using something that isn’t about baking. Find that column."); return; }
    setHint("Rerun done: the shortlist now follows skills, and Priya is in!");
    setPassing(true);
    window.setTimeout(markSolved, reduced ? 0 : 700);
  }

  return <SceneSwap scene={scene} reduced={reduced}>
    {(scene === 0 || scene === 5) && <div className={k.device}>
      <div className={k.deviceBar}><span><Store size={16} /> MEENA’S BAKERY</span><span>{scene === 0 ? "Hiring: baker’s helper" : "New team member"}</span></div>
      <div className={`${k.deviceArt} ${r.shop}`}>
        <Shop scene={scene} />
        {scene === 0 && <div className={r.counter}>
          <span className={r.pill} {...show(.58)}><Users aria-hidden="true" />30 applications</span>
          <span className={r.pill} data-tool="true" {...show(.8)}><Laptop aria-hidden="true" />New shortlist tool</span>
        </div>}
        {scene === 5 && <div className={k.success}><Award /><strong>Welcome to the team, Priya!</strong><span>Hired after a trial day · mango cake</span></div>}
      </div>
      <div className={k.deviceFoot}>{scene === 0
        ? <><CakeSlice /><span>Saturday rush: 120 cupcakes to ice</span><small>Tara’s job: icing</small></>
        : <><span className={r.chip}><Check aria-hidden="true" />Shortlist by skills</span><span className={r.chip}><UserRound aria-hidden="true" />Final choice: Aunt Meena</span></>}</div>
    </div>}

    {scene === 1 && <div className={k.device}>
      <div className={k.deviceBar}><span><ListFilter size={16} /> SHORTLIST HELPER</span><span>Baker’s helper · 30 applied</span></div>
      <div className={`${k.deviceArt} ${r.list}`}>
        <small className={r.heading}>Top 3 picks</small>
        {applicants.filter(a => a.old).map((a, i) => <Applicant a={a} picked key={a.name} show={show(.04 + i * .06)} />)}
        <small className={r.heading} {...show(.33)}>Not shortlisted</small>
        <div className={r.priya} {...show(.33)}>
          <Applicant a={applicants[0]} picked={false} />
          <div className={r.skills}><span {...show(.45)}><Award aria-hidden="true" />Cake contest winner</span><span {...show(.58)}><Clock aria-hidden="true" />3 years baking</span><span {...show(.66)}><Star aria-hidden="true" />Tasting 9/10</span></div>
        </div>
      </div>
      <div className={k.deviceFoot}><CircleX /><span>The top baker was marked “not a good match”.</span><small>Pretend tool and applicants</small></div>
    </div>}

    {scene === 2 && <div className={k.panel}>
      <div className={r.aunt}><span className={r.avatar}><CakeSlice aria-hidden="true" /></span><div><small>Aunt Meena</small><p>“Let’s see what it learned from.”</p></div></div>
      <h2>Ten years of hiring records</h2>
      <table className={r.table} {...show(.22)}>
        <thead><tr><th>Year</th><th>School</th><th>Years baking</th><th>Result</th></tr></thead>
        <tbody>{records.map(([year, school, years, result]) => <tr key={year}><td>{year}</td><td data-hot={cue(.45)}>{school}</td><td>{years}</td><td>{result}</td></tr>)}</tbody>
      </table>
      <p className={r.more} {...show(.3)}>+ 15 more records · 19 of 20 hires from Hilltop</p>
      <div className={r.why} {...show(.56)}><School aria-hidden="true" /><span>Why? Job posters only went up at Hilltop School.</span></div>
      <div className={r.pattern} {...show(.74)}><CircleX aria-hidden="true" /><span>What the tool learned: <b>Hilltop = good baker</b></span></div>
    </div>}

    {scene === 3 && <div className={`${k.panel} ${r.task}`}>
      <h2>Clean the training data</h2>
      <p>Remove the column that isn’t about baking, then rerun.</p>
      <div className={r.columns}>{columns.map(({ id, name, sample, Icon }) => { const gone = id === "school" && cut; return <div className={r.column} key={id} data-gone={gone}>
        <Icon aria-hidden="true" /><div><strong>{name}</strong><small>{sample}</small></div>
        <button type="button" aria-label={`Remove ${name}`} aria-pressed={gone} disabled={done || gone} onClick={() => remove(id)}>{gone ? <><Check aria-hidden="true" />Removed</> : <><Trash2 aria-hidden="true" />Remove</>}</button>
      </div>; })}</div>
      <div className={r.preview}>
        <small>Shortlist preview</small>
        {applicants.map(a => { const picked = fair ? a.fair : a.old; return <span className={r.mini} key={a.name} data-picked={picked}>{picked ? <Check aria-hidden="true" /> : <CircleX aria-hidden="true" />}{a.name}<em>{a.school}</em></span>; })}
      </div>
      <p className={k.hint} aria-live="polite">{hint || (done ? "Rerun done: the shortlist now follows skills, and Priya is in!" : "Only real baking skills should decide the shortlist.")}</p>
      <div className={k.actions}>
        <button type="button" onClick={() => { setRemoved(false); setRerun(false); setHint(""); }} disabled={done || !removed}><RotateCcw />Undo</button>
        <button className={k.primary} type="button" onClick={run} disabled={done}><Play />Rerun the shortlist</button>
      </div>
      <small>Pretend tool, applicants and records.</small>
    </div>}

    {scene === 4 && <div className={k.panel}>
      <h2>Fair tools need fair data</h2>
      <div className={r.shortlisted} {...show(.02)}><Applicant a={applicants[0]} picked /></div>
      <div className={r.bias} {...show(.36)}><Scale aria-hidden="true" /><div><strong>Bias</strong><span>When a tool copies unfair choices from the past.</span></div></div>
      {["Every input is about the job", "Test with many kinds of people", "A person makes the final choice"].map((step, i) => <div className={k.step} key={step} data-active={cue([.58, .72, .86][i])}><span><Check /></span>{step}</div>)}
    </div>}
  </SceneSwap>;
}

const chapter: StoryChapter = {
  script,
  title: "Tara and the unfair shortlist",
  icon: CakeSlice,
  character: { asset: "girl-expressions", name: "Tara" },
  interactionScene: 3,
  beginLabel: "Practise with Tara",
  waitingText: "Story paused. Remove the column that isn’t about baking, then rerun.",
  lockedHint: "Help Tara clean the training data first.",
  World,
};
export default chapter;
