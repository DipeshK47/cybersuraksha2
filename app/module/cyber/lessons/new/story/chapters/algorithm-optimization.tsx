"use client";

import { ArrowLeftRight, Check, Clock, GitMerge, Loader, Medal, Timer, TrendingUp, Trophy, UserRound, Users } from "lucide-react";
import { useState } from "react";
import { SceneSwap } from "../StoryPlayer";
import type { StoryChapter, StoryWorldProps } from "../types";
import script from "./algorithm-optimization.json";
import k from "../story-player.module.css";
import r from "./algorithm-optimization.module.css";

type Sort = "bubble" | "merge";
const lists: { label: string; bubble: number; merge: number; winner: Sort; wrong: string; right: string }[] = [
  { label: "8 names, already in order", bubble: 7, merge: 12, winner: "bubble", wrong: "Not this time! On a tiny list that’s already in order, bubble sort with an early exit makes one pass (7 comparisons) and stops. Merge sort still splits and merges (12).", right: "Bubble sort wins here: one pass, no swaps, done. It isn’t always slower." },
  { label: "100 results, reversed", bubble: 4950, merge: 316, winner: "merge", wrong: "Reversed is bubble sort’s worst case: every pair is out of order, so it needs 4,950 comparisons. Merge sort needs about 316.", right: "Merge sort: about 316 comparisons against bubble sort’s 4,950." },
  { label: "2,000 results, mixed", bubble: 1999000, merge: 19400, winner: "merge", wrong: "With 2,000 mixed results, bubble sort needs about 2 million comparisons, and merge sort about 19,400. That gap is the sports-day freeze.", right: "Merge sort: about 19,400 comparisons against about 2 million." },
];
const reasons = [
  { label: "Merge sort is always faster", ok: false, why: "Not always: on the tiny sorted list, bubble sort won. Justify the choice by how the work grows with n." },
  { label: "Its work grows like n log n, so it scales to 2,000 runners", ok: true, why: "Exactly. For big, mixed lists, n log n grows far more slowly than n squared." },
  { label: "It has fewer lines of code", ok: false, why: "Merge sort is actually longer to write. The real reason is how its work grows with n." },
];
const fmt = (n: number) => n >= 1000000 ? `≈ ${(n / 1000000).toFixed(1)} million` : n.toLocaleString("en-IN");
const board = [["Ananya R.", "8:42"], ["Dev P.", "8:55"], ["Meher K.", "9:03"], ["Rahul S.", "9:10"], ["Grandpa Iyer", "9:31"]];

function Board({ live, frozen }: { live: boolean; frozen?: boolean }) {
  return <div className={r.board} data-frozen={frozen ?? false}>
    <div className={r.boardHead}><span>#</span><span>Runner</span><span>Time</span></div>
    {board.map(([name, time], i) => <div className={r.boardRow} key={name}><span>{i + 1}</span><span>{live ? name : "—"}</span><span>{live ? time : "--:--"}</span></div>)}
  </div>;
}

function World({ scene, playing, elapsed, solved, markSolved, hint, setHint, reduced }: StoryWorldProps) {
  const [shown, setShown] = useState<boolean[]>(lists.map(() => false));
  const [passing, setPassing] = useState(false);
  const done = solved || passing;
  const revealed = solved ? lists.map(() => true) : shown;
  // Reveal an item once narration reaches that fraction of the scene (everything shows while paused).
  const cue = (at: number) => !playing || elapsed > script.scenes[scene].duration * at;
  const show = (at: number) => ({ "data-on": cue(at), "aria-hidden": !cue(at) });

  function predict(i: number, sort: Sort) {
    if (done || shown[i]) return;
    const list = lists[i];
    if (sort !== list.winner) { setHint(list.wrong); return; }
    setShown(value => value.map((v, j) => v || j === i)); setHint(list.right);
  }
  function justify(reason: (typeof reasons)[number]) {
    if (done || !revealed.every(Boolean)) return;
    setHint(reason.why);
    if (!reason.ok) return;
    setPassing(true);
    window.setTimeout(markSolved, reduced ? 0 : 700);
  }

  return <SceneSwap scene={scene} reduced={reduced}>
    {(scene === 0 || scene === 1 || scene === 5) && <div className={k.device}>
      <div className={k.deviceBar}><span><Trophy size={16} /> SPORTS DAY · FUN RUN</span><span>{scene === 0 ? "Registered: 2,000" : "Finished: 2,000"}</span></div>
      <div className={`${k.deviceArt} ${r.screen}`}>
        <Board live={scene === 5} frozen={scene === 1} />
        {scene === 0 && <><div className={k.badge}><Check /> Tested with 30 names</div><span className={r.wait} {...show(.8)}><Users aria-hidden="true" />Waiting for the first runners</span></>}
        {scene === 1 && <>
          <div className={r.spinner} {...show(.2)}><Loader aria-hidden="true" /><strong>Sorting…</strong><span>{cue(.35) ? "2 min 04 s" : "0 min 41 s"}</span></div>
          <div className={r.swaps} {...show(.7)}>{[5, 3, 8, 2, 7].map((v, i) => <span key={i} data-pair={i === 1 || i === 2}>{v}</span>)}<small><ArrowLeftRight aria-hidden="true" />compare neighbours, swap, repeat</small></div>
        </>}
        {scene === 5 && <div className={r.done}><Medal aria-hidden="true" /><span>Sorted 2,000 in 0.4 s · merge sort</span></div>}
      </div>
      <div className={k.deviceFoot}>{scene === 0 ? <><Timer /><span>Prize ceremony at 12:30</span></> : scene === 1 ? <><Clock /><span>Prize ceremony: waiting…</span><small>Bubble sort on 2,000 names</small></> : <><Medal /><span>Medals handed out on time</span></>}</div>
    </div>}

    {scene === 2 && <div className={k.panel}>
      <div className={r.teacher}><span className={r.avatar}><UserRound aria-hidden="true" /></span><div><small>Mrs D’Souza · computer teacher</small><p>“Let’s count comparisons, not seconds.”</p></div></div>
      <div className={r.algos}>
        <div className={r.algo} {...show(.14)}><strong><ArrowLeftRight aria-hidden="true" />Bubble sort</strong><span className={r.pairs}>{[5, 3, 8, 2].map((v, i) => <i key={i}>{v}</i>)}</span><b>grows like n²</b><small>double n → 4× the work</small></div>
        <div className={r.algo} {...show(.48)}><strong><GitMerge aria-hidden="true" />Merge sort</strong><span className={r.tree}><i>5 3 8 2</i><i>5 3</i><i>8 2</i><i>2 3 5 8</i></span><b>grows like n log n</b><small>split in halves, merge sorted halves</small></div>
      </div>
      <div className={r.term} {...show(.86)}><TrendingUp aria-hidden="true" /><div><strong>Time complexity</strong><span>How the work grows as the input grows.</span></div></div>
    </div>}

    {scene === 3 && <div className={`${k.panel} ${r.task}`}>
      <h2>Race the sorts</h2>
      <p>For each list, predict which sort does fewer comparisons.</p>
      <div className={r.races}>{lists.map((list, i) => { const max = Math.max(list.bubble, list.merge); return <div className={r.race} key={list.label} data-done={revealed[i]}>
        <div className={r.raceHead}><strong>{list.label}</strong>{!revealed[i] && <span className={r.predict}>
          <button type="button" aria-label={`Predict bubble sort: ${list.label}`} data-trap={i === 0 ? undefined : "true"} disabled={done} onClick={() => predict(i, "bubble")}>Bubble</button>
          <button type="button" aria-label={`Predict merge sort: ${list.label}`} data-trap={i === 0 ? "true" : undefined} disabled={done} onClick={() => predict(i, "merge")}>Merge</button>
        </span>}</div>
        {revealed[i] && <div className={r.bars}>{(["bubble", "merge"] as const).map(sort => <div className={r.bar} key={sort} data-win={list.winner === sort}>
          <span>{sort === "bubble" ? "Bubble" : "Merge"}</span><span className={r.track}><span style={{ transform: `scaleX(${Math.max(.01, list[sort] / max)})` }} /></span><b>{fmt(list[sort])}</b>
        </div>)}</div>}
      </div>; })}</div>
      {revealed.every(Boolean) && <div className={r.justify}><small>Why merge sort for sports day?</small>{reasons.map(reason => <button key={reason.label} type="button" disabled={done} onClick={() => justify(reason)}>{reason.label}</button>)}</div>}
      <p className={k.hint} aria-live="polite">{hint || (done ? "Exactly. For big, mixed lists, n log n grows far more slowly than n squared." : `${revealed.filter(Boolean).length} of 3 races run.`)}</p>
      <small>Comparison counts: bubble sort with early exit; merge sort counts are typical values.</small>
    </div>}

    {scene === 4 && <div className={k.panel}>
      <h2>Fit the algorithm to the data</h2>
      <div className={r.summary}>{lists.map((list, i) => <div key={list.label} {...show([.06, .5, .62][i])}><strong>{list.label}</strong><span data-win={list.winner}>{list.winner === "bubble" ? "Bubble wins" : "Merge wins"}</span><small>{fmt(list.bubble)} vs {fmt(list.merge)}</small></div>)}</div>
      <p className={r.scale} {...show(.86)}><TrendingUp aria-hidden="true" />Big lists need algorithms that scale. Big-O describes growth, not exact seconds, so test with real data too.</p>
    </div>}
  </SceneSwap>;
}

const chapter: StoryChapter = {
  script,
  title: "Meera’s frozen leaderboard",
  icon: Trophy,
  character: { asset: "emotional-avatar", name: "Meera" },
  interactionScene: 3,
  beginLabel: "Practise with Meera",
  waitingText: "Story paused. Race the sorts on all three lists, then justify the choice.",
  lockedHint: "Help Meera race the two sorts first.",
  World,
};
export default chapter;
