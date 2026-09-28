"use client";

import { ArrowRight, Bot, Check, CircleHelp, Code, PartyPopper, Play, Repeat, Sparkles, Trash2, UserRound } from "lucide-react";
import { useState } from "react";
import { SceneSwap } from "../StoryPlayer";
import type { StoryChapter, StoryWorldProps } from "../types";
import script from "./loop-inspector.json";
import k from "../story-player.module.css";
import r from "./loop-inspector.module.css";

const DESKS = 5;
const HOP = 300;
const longList = Array.from({ length: DESKS * 2 }, (_, i) => i % 2 ? "sweep" : "move forward");
const counts = [3, 4, 5, 6];

/** The front row: a dock, five desks and the bin. `pos` is the robot's cell (0 dock … 6 bin). */
function Row({ pos, clean, bump, hop }: { pos: number; clean: number; bump?: boolean; hop: number }) {
  return <div className={r.row} role="img" aria-label={`Sweepy is ${pos === 0 ? "at the start" : pos > DESKS ? "at the bin" : `at desk ${pos}`}; ${clean} of ${DESKS} desks clean.`}>
    <span className={r.dock}>Start</span>
    {Array.from({ length: DESKS }, (_, i) => <span className={r.desk} key={i} data-clean={i < clean} style={{ transitionDelay: `${(i + 1) * hop}ms` }}>
      <span className={r.dust} style={{ transitionDelay: `${(i + 1) * hop}ms` }} /><Sparkles className={r.shine} style={{ transitionDelay: `${(i + 1) * hop}ms` }} aria-hidden="true" /><small>{i + 1}</small>
    </span>)}
    <span className={r.bin} data-bump={bump ?? false}><Trash2 aria-hidden="true" /></span>
    <span className={r.robot} style={{ transform: `translateX(${pos * 100}%)`, transitionDuration: `${pos * hop}ms` }}><Bot aria-hidden="true" /></span>
  </div>;
}
function Loop({ count }: { count: number | null }) {
  return <div className={r.loop}>
    <div className={r.loopHead}><Repeat aria-hidden="true" />repeat <b>{count ?? "?"}</b> times</div>
    <div className={r.loopBody}><code>move forward</code><code>sweep</code></div>
  </div>;
}
function Listing({ lines, missing }: { lines: string[]; missing?: boolean }) {
  return <ol className={r.listing}>{lines.map((line, i) => <li key={i}><span>{i + 1}</span><code>{line}</code></li>)}{missing && <li data-missing="true"><span>?</span><code>…</code></li>}</ol>;
}

function World({ scene, playing, elapsed, solved, markSolved, hint, setHint, reduced }: StoryWorldProps) {
  const [looped, setLooped] = useState(false);
  const [count, setCount] = useState<number | null>(null);
  const [robot, setRobot] = useState({ pos: 0, clean: 0, bump: false, hop: 0 });
  const [running, setRunning] = useState(false);
  const [passing, setPassing] = useState(false);
  const done = solved || passing;
  const view = solved ? { pos: DESKS, clean: DESKS, bump: false, hop: 0 } : robot;
  // Reveal an item once narration reaches that fraction of the scene (everything shows while paused).
  const cue = (at: number) => !playing || elapsed > script.scenes[scene].duration * at;
  const show = (at: number) => ({ "data-on": cue(at), "aria-hidden": !cue(at) });

  function run() {
    if (done || running || !looped || count === null) return;
    const n = count;
    const target = Math.min(n, DESKS + 1);
    setHint(""); setRunning(true); setRobot({ pos: 0, clean: 0, bump: false, hop: 0 });
    window.setTimeout(() => setRobot({ pos: target, clean: Math.min(n, DESKS), bump: false, hop: reduced ? 0 : HOP }), 40);
    window.setTimeout(() => {
      setRunning(false);
      if (n > DESKS) { setRobot(value => ({ ...value, bump: true })); setHint(`${n} repeats is one too many: after the last desk, Sweepy bumps into the bin! One repeat for each desk.`); return; }
      if (n < DESKS) { setHint(`With ${n} repeats, Sweepy stops ${DESKS - n === 1 ? "one desk" : `${DESKS - n} desks`} short. Count the desks: one repeat for each.`); return; }
      setHint("Five repeats for five desks. Every desk is clean!");
      setPassing(true);
      window.setTimeout(markSolved, reduced ? 0 : 500);
    }, reduced ? 60 : target * HOP + 160);
  }

  return <SceneSwap scene={scene} reduced={reduced}>
    {(scene === 0 || scene === 5) && <div className={k.device}>
      <div className={k.deviceBar}><span><Bot size={16} /> SWEEPY</span><span>Class 5B robot cleaner</span></div>
      <div className={`${k.deviceArt} ${r.lab}`}>
        {scene === 0 && <><div className={k.badge}><Bot /> Robot duty: Tara</div><div className={r.mini} {...show(.62)}><Code aria-hidden="true" /><span>Tara’s program</span><b>move forward · sweep · …</b></div></>}
        {scene === 5 && <div className={k.success}><PartyPopper /><strong>Every desk is sparkling!</strong><span>repeat 8 times · still just 3 lines</span></div>}
      </div>
      <div className={k.deviceFoot}>{scene === 0 ? <><Sparkles /><span>After lunch: sweep under the front-row desks</span></> : <><Check /><span>Row of 8 desks: Tara changed one number</span><small>No copying needed</small></>}</div>
    </div>}

    {scene === 1 && <div className={k.device}>
      <div className={k.deviceBar}><span><Code size={16} /> SWEEPY · PROGRAM</span><span>9 lines · 5 desks</span></div>
      <div className={`${k.deviceArt} ${r.floor}`}>
        <div className={r.problem}>
          <div className={r.console} {...show(.12)}><small>Tara’s long list</small><Listing lines={longList.slice(0, 9)} missing /></div>
          <div className={r.side}>
            <p className={r.bad} {...show(.55)}><CircleHelp aria-hidden="true" />Sweepy stopped early</p>
            <p className={r.bad} {...show(.66)}><Sparkles aria-hidden="true" />Desk 5 is still dusty</p>
            <p className={r.bad} {...show(.82)}><Code aria-hidden="true" />A line is missing… where?</p>
          </div>
        </div>
        <Row pos={4} clean={4} hop={0} />
      </div>
      <div className={k.deviceFoot}><CircleHelp /><span>Long lists of copied lines are easy to get wrong.</span></div>
    </div>}

    {scene === 2 && <div className={k.panel}>
      <div className={r.teacher}><span className={r.avatar}><UserRound aria-hidden="true" /></span><div><small>Mr Iyer · science teacher</small><p>“Every desk needs the same two steps.”</p></div></div>
      <h2>Spot the repeating steps</h2>
      <div className={r.pattern}>
        <div className={r.pairs}>{Array.from({ length: DESKS }, (_, i) => <span key={i} {...show(.12 + i * .06)}><b>Desk {i + 1}</b>move forward · sweep</span>)}</div>
        <ArrowRight className={r.arrow} aria-hidden="true" />
        <div {...show(.5)} className={r.reveal}><Loop count={5} /></div>
      </div>
      <div className={r.term} {...show(.7)}><Repeat aria-hidden="true" /><div><strong>Loop</strong><span>A block that repeats steps a set number of times.</span></div></div>
      <p className={r.rule} {...show(.88)}><Check aria-hidden="true" />The count must match the desks: one repeat for each.</p>
    </div>}

    {scene === 3 && <div className={`${k.panel} ${r.task}`}>
      <h2>Give Sweepy one loop</h2>
      <p>Replace the long list with a loop, set the count, then run it.</p>
      <div className={r.bench}>
        <div className={r.code}>
          <small>{looped || solved ? "Sweepy’s program · 3 lines" : "Sweepy’s program · 10 lines"}</small>
          {looped || solved ? <Loop count={solved ? DESKS : count} /> : <Listing lines={longList} />}
        </div>
        <div className={r.controls}>
          <button className={r.replace} type="button" onClick={() => { setLooped(true); setHint("Ten lines are now three. How many times should the loop repeat?"); }} disabled={done || looped}><Repeat />{looped || solved ? "Loop in place" : "Replace with one loop"}</button>
          <small>Repeat how many times?</small>
          <div className={r.counts}>{counts.map(n => <button key={n} type="button" aria-label={`Repeat ${n} times`} aria-pressed={(solved ? DESKS : count) === n} disabled={done || running || !looped} onClick={() => { setCount(n); setHint(""); }}>{n}</button>)}</div>
        </div>
      </div>
      <Row pos={view.pos} clean={view.clean} bump={view.bump} hop={view.hop} />
      <p className={k.hint} aria-live="polite">{hint || (done ? "Five repeats for five desks. Every desk is clean!" : !looped ? "Ten lines, but only two different steps." : count === null ? "Pick a repeat count." : `Ready: repeat ${count} times.`)}</p>
      <div className={k.actions}><button className={k.primary} type="button" onClick={run} disabled={done || running || !looped || count === null}><Play />Run Sweepy</button></div>
    </div>}

    {scene === 4 && <div className={k.panel}>
      <h2>Ten lines became three</h2>
      <div className={r.compare}>
        <div className={r.before}><small>Without a loop · 10 lines</small><Listing lines={longList} /></div>
        <div className={r.after} {...show(.18)}><small>With a loop · 3 lines</small><Loop count={5} /><span className={r.change} {...show(.6)}>Longer row? <b>5</b><ArrowRight aria-hidden="true" /><b>8</b> Change one number.</span></div>
      </div>
      <p className={r.rule} {...show(.84)}><Check aria-hidden="true" />Shorter, easier to check, and the count always matches the job.</p>
    </div>}
  </SceneSwap>;
}

const chapter: StoryChapter = {
  script,
  title: "Tara and the robot cleaner",
  icon: Bot,
  character: { asset: "girl-expressions", name: "Tara" },
  interactionScene: 3,
  beginLabel: "Practise with Tara",
  waitingText: "Story paused. Give Sweepy one loop with the right count, then run it.",
  lockedHint: "Help Tara fix Sweepy’s program first.",
  World,
};
export default chapter;
