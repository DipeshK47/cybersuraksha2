"use client";

import { ArrowRight, BadgeCheck, ChefHat, CircleHelp, Croissant, Database, GraduationCap, Hourglass, RefreshCw, ShieldCheck, Sparkles, Store, Undo2, UserCheck, UserX, Users, Wheat, X } from "lucide-react";
import { useState } from "react";
import { SceneSwap } from "../StoryPlayer";
import type { StoryChapter, StoryWorldProps } from "../types";
import script from "./garbage-in-garbage-out.json";
import k from "../story-player.module.css";
import g from "./garbage-in-garbage-out.module.css";

type Applicant = { name: string; school: string; years: number; bake: number };
const applicants: Applicant[] = [
  { name: "Kavya", school: "Riverside", years: 6, bake: 9 },
  { name: "Ishaan", school: "Hilltop", years: 3, bake: 7 },
  { name: "Aarav", school: "Hilltop", years: 1, bake: 6 },
  { name: "Zoya", school: "Lakeview", years: 2, bake: 5 },
];
const [kavya, ishaan, aarav, zoya] = applicants;
const oldList = [ishaan, aarav];
const fairList = [kavya, ishaan];

// Pretend training rows: school, years baking, test bake score, food safety course, hired?
type Row = [string, number, number, boolean, boolean];
const records: Row[] = [["Hilltop", 3, 8, true, true], ["Hilltop", 1, 4, false, false], ["Riverside", 5, 8, true, false], ["Hilltop", 4, 9, true, true], ["Lakeview", 3, 7, true, false], ["Hilltop", 2, 6, true, true]];
const taskRows = [0, 2, 3, 4].map(i => records[i]);

const columns = [
  { id: "school", label: "School", short: "School", Icon: GraduationCap, why: "" },
  { id: "years", label: "Years baking", short: "Years", Icon: Hourglass, why: "Years of baking is real experience for this job. Keep it so the app can compare bakers." },
  { id: "bake", label: "Test bake", short: "Test bake", Icon: Croissant, why: "The test bake score shows how well someone really bakes. The app needs it, so put it back." },
  { id: "safety", label: "Food safety", short: "Safety", Icon: ShieldCheck, why: "A food safety course matters in a bakery kitchen. Keep that column." },
];

function School({ name, mark }: { name: string; mark?: boolean }) {
  return <span className={g.school} data-school={name} data-mark={mark}>{name}</span>;
}
function Avatar({ name }: { name: string }) {
  return <span className={g.avatar} data-who={name} aria-hidden="true" />;
}
function Table({ rows, removed = [], mark, label }: { rows: Row[]; removed?: string[]; mark?: boolean; label: string }) {
  const out = (id: string) => removed.includes(id) || undefined;
  return <div className={g.tableWrap}><table className={g.table} aria-label={label}>
    <thead><tr>{columns.map(c => <th key={c.id} scope="col" data-out={out(c.id)} data-mark={c.id === "school" && mark}>{c.short}</th>)}<th scope="col" data-label>Hired?</th></tr></thead>
    <tbody>{rows.map((row, i) => <tr key={i}>
      <td data-out={out("school")} data-mark={mark}><School name={row[0]} mark={mark && row[0] === "Hilltop"} /></td>
      <td data-out={out("years")}>{row[1]}</td>
      <td data-out={out("bake")}>{row[2]}/10</td>
      <td data-out={out("safety")}>{row[3] ? "Yes" : "No"}</td>
      <td data-label data-hired={row[4]}>{row[4] ? "Yes" : "No"}</td>
    </tr>)}</tbody>
  </table></div>;
}

function World({ scene, playing, elapsed, solved, markSolved, hint, setHint, reduced }: StoryWorldProps) {
  const [removed, setRemoved] = useState<string[]>([]);
  const [ran, setRan] = useState(false);
  // Reveal items in step with the narration: `frac` is how far through this scene's audio.
  const at = (frac: number) => !playing || elapsed > script.scenes[scene].duration * frac;
  const skillOut = columns.find(c => c.id !== "school" && removed.includes(c.id));
  const fixed = removed.includes("school") && !skillOut;
  const fair = ran && fixed;

  function toggle(id: string) {
    if (solved) return;
    const out = !removed.includes(id);
    setRemoved(value => out ? [...value, id] : value.filter(item => item !== id));
    setRan(false);
    setHint(out ? columns.find(c => c.id === id)!.why : "");
  }
  function rerun() {
    if (solved) return;
    if (skillOut) { setHint(`The app can’t judge baking without ${skillOut.label}. Put it back, then rerun.`, false); return; }
    if (!fixed) { setHint("Still only Hilltop names! One column tells the app nothing about baking. Remove that one.", false); setRan(false); return; }
    setHint(""); setRan(true);
  }
  const status = solved ? "Fixed! The app now judges baking skills, not school names."
    : fair ? "Kavya is on the shortlist! Show Aunt Meera the new result."
      : fixed ? "School is out. Now rerun the app and check the shortlist."
        : "Remove one column. Keep every skill column.";
  const list = fair || solved ? fairList : oldList;

  return <SceneSwap scene={scene} reduced={reduced}>
    {(scene === 0 || scene === 1) && <div className={k.device}>
      <div className={k.deviceBar}><span><ChefHat size={16} /> HIRING HELPER</span><span>Pretend app · Example only</span></div>
      <div className={`${k.deviceArt} ${g.app}`}>
        <div className={g.shop}><Store aria-hidden="true" /><div><strong>Meera’s Bakery</strong><span>Cyberpur · Job: Baker</span></div><span className={g.pill}>{scene === 0 ? <><Users aria-hidden="true" />4 applied</> : <><Sparkles aria-hidden="true" />Shortlist ready</>}</span></div>
        {scene === 0 && <>
          <div className={g.cards}>{applicants.map((a, i) => <div className={g.card} key={a.name} data-show={at(.4 + i * .06)}>
            <Avatar name={a.name} /><div><strong>{a.name}</strong><School name={a.school} /></div>
            <div className={g.meter}><span>Test bake</span><i><b style={{ width: `${a.bake * 10}%` }} /></i><em>{a.bake}/10</em></div>
          </div>)}</div>
          <div className={g.thinking} data-show={at(.7)}><Sparkles aria-hidden="true" />AI helper is choosing 2 bakers to interview…</div>
        </>}
        {scene === 1 && <div className={g.result}>
          <span className={g.listLabel}>Shortlisted</span>
          {oldList.map(a => <div className={g.row} key={a.name} data-kind="in"><Avatar name={a.name} /><strong>{a.name}</strong><School name={a.school} mark={at(.1)} /><em>{a.bake}/10</em><UserCheck aria-label="shortlisted" /></div>)}
          <span className={g.listLabel}>Left out</span>
          {[kavya, zoya].map(a => <div className={g.row} key={a.name} data-kind="out" data-ring={a === kavya && at(.22)}><Avatar name={a.name} /><strong>{a.name}</strong><School name={a.school} /><em>{a.bake}/10</em>{a === kavya && <span className={g.top} data-show={at(.28)}>Top score</span>}<UserX aria-label="not shortlisted" /></div>)}
        </div>}
      </div>
      <div className={k.deviceFoot}>{scene === 0 ? <><Wheat /><span>Test bake day: all four loaves scored.</span><small>Pretend names and scores</small></> : <><CircleHelp /><span>The best test loaf… left out?</span><small>Both picks: Hilltop School</small></>}</div>
    </div>}

    {scene === 2 && <div className={`${k.panel} ${g.bakeryStage} ${g.ledger}`}>
      <div className={g.aunt}><Avatar name="Meera" /><div><span>Aunt Meera</span><p>“Back then, we mostly put job notices up at Hilltop School.”</p></div></div>
      <div className={g.workbook}>
      <div className={g.tableHead}><Database aria-hidden="true" /><strong>Training data: old hiring records</strong><small>6 of 48 rows</small></div>
      <Table rows={records} mark={at(.3)} label="Old hiring records, pretend data" />
      <div className={g.pattern} data-show={at(.5)}><Sparkles aria-hidden="true" /><span>Pattern the app learned:</span><b>Hilltop School = hire</b><small data-show={at(.68)}>Biased data</small></div>
      <div className={g.gigo} data-show={at(.8)}><span>Flawed examples in</span><ArrowRight aria-hidden="true" /><span>Unfair answers out</span></div>
      </div>
    </div>}

    {scene === 3 && <div className={`${k.panel} ${g.bakeryStage} ${g.task}`}>
      <div className={g.taskBakery}><Avatar name="Meera" /><div>
      <h2>Fix the training data</h2>
      <p>Which column has nothing to do with baking? Tap it to remove it.</p>
      </div></div>
      <div className={g.workbook}>
      <div className={`${k.bank} ${g.columns}`}>{columns.map(({ id, label, Icon }) => { const out = removed.includes(id); return <button key={id} data-out={out} aria-label={`${out ? "Put back" : "Remove"} ${label} column`} disabled={solved} onClick={() => toggle(id)} type="button"><Icon aria-hidden="true" />{label}{out ? <Undo2 aria-hidden="true" /> : <X aria-hidden="true" />}</button>; })}</div>
      <Table rows={taskRows} removed={removed} label="Training data rows, pretend data" />
      <div className={g.run} data-fair={fair || solved}>
        <RefreshCw aria-hidden="true" /><span>{fair || solved ? "New shortlist" : "Current shortlist"}</span>
        {list.map(a => <b key={a.name}><Avatar name={a.name} />{a.name} {a.bake}/10</b>)}
        {!(fair || solved) && <em>Kavya left out</em>}
      </div>
      <p className={k.hint} aria-live="polite">{hint || status}</p>
      <div className={k.actions}>
        {fair || solved
          ? <button className={k.primary} disabled={solved} onClick={markSolved} type="button">{solved ? <>Shown to Aunt Meera <BadgeCheck /></> : <>Show Aunt Meera <ArrowRight /></>}</button>
          : <button className={k.primary} onClick={rerun} type="button"><RefreshCw />Rerun the app</button>}
      </div>
      <small>Pretend data. The app is a made-up example.</small>
      </div>
    </div>}

    {scene === 4 && <div className={`${k.panel} ${g.bakeryStage} ${g.lesson}`}>
      <div className={g.compare}>
        <div data-kind="old"><span>Old data</span><div className={g.comparePeople}><Avatar name="Ishaan" /><Avatar name="Aarav" /></div><strong>Ishaan · Aarav</strong><small>Hilltop only</small></div>
        <ArrowRight aria-hidden="true" />
        <div data-kind="new"><span>Fixed data</span><div className={g.comparePeople}><Avatar name="Kavya" /><Avatar name="Ishaan" /></div><strong>Kavya · Ishaan</strong><small>Top test bakes</small></div>
      </div>
      <div className={g.lessonBody}><Avatar name="Meera" /><div className={g.workbook}>
      <h2>Garbage in, garbage out</h2>
      {[[Database, "AI learns from examples"], [Store, "Check where the data came from"], [UserCheck, "Look at every result"], [BadgeCheck, "A person makes the final choice"]].map(([Icon, text], i) => { const I = Icon as typeof Database; return <div className={k.step} key={text as string} data-active={at(.42 + i * .13)}><span><I /></span>{text as string}</div>; })}
      <small>The app only helps. Aunt Meera still meets every baker.</small>
      </div></div>
    </div>}

    {scene === 5 && <div className={k.device}>
      <div className={k.deviceBar}><span><ChefHat size={16} /> MEERA’S BAKERY</span><span>Team board · Monday</span></div>
      <div className={`${k.deviceArt} ${g.app} ${g.ending}`}>
        <div className={g.shelf}><b data-show={at(.2)}>Sold out by lunch!</b></div>
        <div className={g.chat} data-show={at(.3)}><Avatar name="Kavya" /><p><strong>Kavya</strong>Thank you for the chance! Fresh bread again tomorrow.</p></div>
        <div className={g.welcome}><BadgeCheck aria-hidden="true" /><div><strong>Welcome to the team, Kavya!</strong><span>Chosen for her baking skills</span></div></div>
      </div>
      <div className={k.deviceFoot}><Sparkles /><span>An AI is only as good as its data.</span><small>Pretend story</small></div>
    </div>}
  </SceneSwap>;
}

const chapter: StoryChapter = {
  script,
  title: "Tara and the unfair shortlist",
  icon: ChefHat,
  character: { asset: "girl-expressions", name: "Tara" },
  interactionScene: 3,
  beginLabel: "Practise with Tara",
  waitingText: "Story paused. Fix the training data to see what happens next.",
  lockedHint: "Help Tara fix the training data first.",
  World,
};
export default chapter;
