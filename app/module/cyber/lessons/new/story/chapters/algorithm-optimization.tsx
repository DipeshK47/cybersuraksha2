"use client";

import { ArrowLeftRight, ArrowRight, CircleCheck, GitMerge, LoaderCircle, Medal, MessageCircle, Play, ThumbsUp, Timer, Trophy, Video } from "lucide-react";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { SceneSwap } from "../StoryPlayer";
import type { StoryChapter, StoryWorldProps } from "../types";
import script from "./algorithm-optimization.json";
import k from "../story-player.module.css";
import a from "./algorithm-optimization.module.css";

/* Real comparison counters, the same methods as the practice's sorting race. */
function bubbleCount(source: number[]) { const d = [...source]; let c = 0; for (let end = d.length - 1; end > 0; end--) { let swapped = false; for (let i = 0; i < end; i++) { c++; if (d[i] > d[i + 1]) { [d[i], d[i + 1]] = [d[i + 1], d[i]]; swapped = true; } } if (!swapped) break; } return c; }
function mergeCount(source: number[]) { let c = 0; const sort = (d: number[]): number[] => { if (d.length <= 1) return d; const m = d.length >> 1, l = sort(d.slice(0, m)), r = sort(d.slice(m)), out: number[] = []; let i = 0, j = 0; while (i < l.length && j < r.length) { c++; out.push(l[i] <= r[j] ? l[i++] : r[j++]); } return [...out, ...l.slice(i), ...r.slice(j)]; }; sort(source); return c; }
const range = (n: number) => Array.from({ length: n }, (_, i) => i + 1);
function mixed(n: number) { const d = range(n); let seed = 7; for (let i = n - 1; i > 0; i--) { seed = (seed * 1103515245 + 12345) % 2147483648; const j = Math.floor(seed / 2147483648 * (i + 1)); [d[i], d[j]] = [d[j], d[i]]; } return d; }

type Algo = "bubble" | "merge";
type Counts = Record<Algo, number>;
const lists = [
  { size: "8", desc: "in order", data: range(8), wrong: "Bubble sort isn’t always slower! On a tiny list that’s already in order, it checks once, finds nothing to swap, and stops early.", note: "Bubble sort made one pass, found nothing to swap and stopped early. Merge sort still split and merged everything." },
  { size: "100", desc: "reversed", data: range(100).reverse(), wrong: "Reversed order is bubble sort’s worst case: every pass has to swap, so its comparisons pile up pass after pass.", note: "Reversed order is bubble sort’s worst case. Merge sort barely noticed." },
  { size: "2,000", desc: "mixed", data: mixed(2000), wrong: "On a big mixed list, bubble sort’s work grows like n², while merge sort’s grows like n log n. Look at the counters!", note: "Merge sort needed about 100 times fewer comparisons on 2,000 mixed results." },
];
const finals = [
  { id: "bubble", text: "Bubble sort: it won the 8-item race", hint: "That race was tiny and already in order, so bubble sort stopped early. With 2,000 mixed results it needs about 2 million comparisons." },
  { id: "always", text: "Merge sort: it wins on every list", hint: "Check the 8-item race again: bubble sort won there. Choose because of the list sports day really has." },
  { id: "right", text: "Merge sort: far fewer comparisons on 2,000 mixed results", hint: "" },
];
const other = (x: Algo): Algo => x === "bubble" ? "merge" : "bubble";
const fmt = (n: number) => n.toLocaleString("en-US");
const bars = (data: number[]) => { const step = Math.ceil(data.length / 48); return data.filter((_, i) => i % step === 0); };

/* Scene 5 chart: n²/2 against n log₂ n for up to 2,000 runners (x 30→310, y 150→15 for 0→2,000,000). */
const X = (n: number) => 30 + n / 2000 * 280, Y = (v: number) => 150 - v / 2e6 * 135;
const curve = (f: (n: number) => number) => range(20).map(i => i * 100).map((n, i) => `${i ? "L" : "M"}${X(n).toFixed(1)} ${Y(f(n)).toFixed(1)}`).join(" ");
const nSquared = curve(n => n * n / 2), nLogN = curve(n => n * Math.log2(n));

/* True once narration has reached `phrase` in this scene (or whenever narration is paused). */
function reached(scene: number, phrase: string, playing: boolean, elapsed: number) {
  if (!playing) return true;
  const s = script.scenes[scene]; const text = s.speech ?? s.caption;
  return elapsed >= text.indexOf(phrase) / text.length * s.duration;
}

type Row = [string, string, string];
const liveRows: Row[] = [["Ananya R.", "Hillside", "3:21"], ["Dev K.", "Cyberpur", "3:24"], ["Meher S.", "Riverbank", "3:26"], ["Zoya A.", "Lakeview", "3:31"]];
const newRow: Row = ["Ishaan P.", "Cyberpur", "3:29"];
const finalRows: Row[] = [["Riya M.", "Lakeview", "3:08"], ["Arjun T.", "Cyberpur", "3:10"], ["Sana Q.", "Hillside", "3:12"], ["Kavya N.", "Riverbank", "3:13"], ["Farhan J.", "Cyberpur", "3:15"]];

function Board({ rows, fresh, final }: { rows: Row[]; fresh?: number; final?: boolean }) {
  return <ol className={a.rows} aria-label="Leaderboard, fastest first">
    {rows.map(([name, school, time], i) => <li key={name} data-fresh={i === fresh} className={i === fresh ? k.fitIn : undefined}>
      <span className={a.rank} data-medal={final && i < 3 ? i + 1 : undefined}>{final && i < 3 ? <Medal aria-hidden="true" /> : null}{i + 1}</span>
      <strong>{name}{i === fresh && <em>New</em>}</strong><span>{school}</span><b>{time}</b>
    </li>)}
  </ol>;
}

function Toast({ from, text, icon = <MessageCircle aria-hidden="true" /> }: { from: string; text: string; icon?: ReactNode }) {
  return <div className={`${a.toast} ${k.fitIn}`}><span className={a.avatar}>CM</span><div><small>{from}</small><p>{text}</p></div>{icon}</div>;
}

function World({ scene, playing, elapsed, solved, markSolved, hint, setHint, reduced }: StoryWorldProps) {
  const [active, setActive] = useState(0);
  const [guess, setGuess] = useState<(Algo | null)[]>([null, null, null]);
  const [runs, setRuns] = useState<(Counts | null)[]>([null, null, null]);
  const [picked, setPicked] = useState("");
  const solvedRuns = useMemo(() => solved ? lists.map(l => ({ bubble: bubbleCount(l.data), merge: mergeCount(l.data) })) : null, [solved]);
  const results = solvedRuns ?? runs;
  const raced = results.filter(Boolean).length;
  const at = (phrase: string) => reached(scene, phrase, playing, elapsed);

  function choose(i: number) { setActive(i); if (!solved) setHint(""); }
  function predict(algo: Algo) { if (solved || runs[active]) return; setGuess(g => g.map((v, i) => i === active ? algo : v)); setHint(""); }
  function run() {
    const g = guess[active]; if (solved || !g || runs[active]) return;
    const counts = { bubble: bubbleCount(lists[active].data), merge: mergeCount(lists[active].data) };
    setRuns(r => r.map((v, i) => i === active ? counts : v));
    setHint(counts[g] < counts[other(g)] ? "" : lists[active].wrong);
  }
  function decide(id: string) {
    if (solved || raced < 3) return;
    setPicked(id);
    if (id === "right") { setHint(""); markSolved(); } else setHint(finals.find(f => f.id === id)?.hint ?? "");
  }

  const current = results[active];
  const max = current ? Math.max(current.bubble, current.merge) : 1;
  const shown = current ? [...lists[active].data].sort((x, y) => x - y) : lists[active].data;
  const g = guess[active];
  const note = solved ? "Merge sort it is: about 100 times fewer comparisons than bubble sort on 2,000 mixed results."
    : current ? `${g && current[g] < current[other(g)] ? "Good prediction! " : ""}${lists[active].note}`
    : g ? "Now run the race and read both counters." : "Predict first: which sort will make fewer comparisons on this list?";

  return <SceneSwap scene={scene} reduced={reduced}>
    {(scene === 0 || scene === 1 || scene === 5) && <div className={k.device} data-dim={scene === 1}>
      <div className={k.deviceBar}><span><Trophy size={16} /> SPORTS DAY</span><span>results.cyberpurschool.example</span></div>
      <div className={`${k.deviceArt} ${a.board}`}>
        <div className={a.boardHead}>
          <span className={a.liveDot} data-off={scene === 1} />
          <strong>{scene === 5 ? "Final results" : "Live results"} · 800 m</strong>
          {scene === 0 && at("He tested") && <span className={`${a.pill} ${k.fitIn}`}>30 runners · sorted instantly</span>}
          {scene === 5 && <span className={a.pill} data-good="true"><CircleCheck aria-hidden="true" /> Winners ready</span>}
        </div>
        {scene === 0 && <Board rows={at("Each time") ? [...liveRows.slice(0, 3), newRow, liveRows[3]] : liveRows} fresh={at("Each time") ? 3 : undefined} />}
        {scene === 1 && <Board rows={[...liveRows.slice(0, 3), newRow, liveRows[3]]} />}
        {scene === 5 && <><Board rows={finalRows} final />{at("Coach Mehra") && <Toast from="Coach Mehra" text="Winners are up on the big screen. Great work, Kabir!" icon={<ThumbsUp aria-hidden="true" />} />}</>}
        {scene === 1 && <div className={a.frozen}>
          <div className={a.toasts}>
            {at("Coach Mehra") && <Toast from="Coach Mehra" text="Is the list ready? The principal is on stage." />}
          </div>
          <div className={a.stuck}><LoaderCircle aria-hidden="true" data-spin={!reduced} /><strong>Not responding</strong><span>Sorting 2,000 results… again</span></div>
        </div>}
      </div>
      <div className={k.deviceFoot}>{scene === 0 ? <><ArrowLeftRight /><span>Sort: <b>bubble sort</b></span>{at("Today") ? <small className={k.fitIn}>Today: 2,000 runners · 12 schools</small> : <small>Tested with 30 runners</small>}</>
        : scene === 1 ? <><Timer /><span>1,962 of 2,000 times in · re-sorting after each one</span></>
        : <><GitMerge /><span>Sort: <b>merge sort</b></span><small>About 20,000 comparisons a re-sort, not 2 million</small></>}</div>
    </div>}

    {scene === 2 && <div className={k.panel}>
      <div className={a.call}><span className={a.avatar} data-teacher="true">MI</span><div><strong>Ms Iyer</strong><span>Computer teacher</span></div><span className={a.onCall}><Video aria-hidden="true" /> Pretend call</span></div>
      <h2>Reading the code together</h2>
      <div className={a.algos}>
        <section>
          <h3><ArrowLeftRight aria-hidden="true" /> Bubble sort</h3>
          <div className={a.chips} aria-hidden="true"><span>5</span><span data-pair="true">8</span><span data-pair="true">3</span><span>9</span><span>1</span></div>
          <code>if a[i] &gt; a[i+1]: swap</code>
          <p>Compare neighbours, swap, repeat, pass after pass.</p>
          <b className={a.cost} data-show={at("For two thousand")}>2,000 runners ≈ 2,000,000 comparisons, every re-sort</b>
        </section>
        <section data-show={at("Merge sort")}>
          <h3><GitMerge aria-hidden="true" /> Merge sort</h3>
          <div className={a.tree} aria-hidden="true"><div><span>7 3 9 1</span></div><div><span>7 3</span><span>9 1</span></div><div><span>3 7</span><span>1 9</span></div><div><span data-done="true">1 3 7 9</span></div></div>
          <code>merge(sort(left), sort(right))</code>
          <p>Split into halves, sort each half, merge in order.</p>
          <b className={a.cost} data-show={at("Its work")} data-good="true">Work grows like n log n</b>
        </section>
      </div>
    </div>}

    {scene === 3 && <div className={`${k.panel} ${a.lab}`}>
      <h2>Race the sorts</h2>
      <div className={a.tabs} role="group" aria-label="Test lists">
        {lists.map((l, i) => <button key={l.size} type="button" aria-pressed={active === i} aria-label={`${l.size} results, ${l.desc}${results[i] ? ", raced" : ""}`} onClick={() => choose(i)}>
          <strong>{l.size}</strong><span>{l.desc}</span>{results[i] && <CircleCheck aria-hidden="true" />}
        </button>)}
      </div>
      <div className={a.setup}>
        <div className={a.strip} role="img" aria-label={`${current ? "Sorted" : "Unsorted"} preview of ${lists[active].size} results`}>{bars(shown).map((v, i) => <span key={i} style={{ height: `${Math.max(8, v / lists[active].data.length * 100)}%` }} />)}</div>
        <div className={a.predict} role="group" aria-label="Which sort will make fewer comparisons?">
          <span>Fewer comparisons?</span>
          {(["bubble", "merge"] as const).map(al => <button key={al} type="button" aria-pressed={(solved ? (active === 0 ? "bubble" : "merge") : guess[active]) === al} aria-label={`Predict ${al} sort`} onClick={() => predict(al)} disabled={solved || Boolean(runs[active])}>{al === "bubble" ? "Bubble" : "Merge"}</button>)}
          <button type="button" className={k.primary} onClick={run} disabled={solved || !guess[active] || Boolean(runs[active])}><Play aria-hidden="true" />Run race</button>
        </div>
      </div>
      <div className={a.lanes} data-reduced={reduced}>
        {(["bubble", "merge"] as const).map(al => <div key={`${active}-${al}`} className={a.lane} data-win={current ? current[al] < current[other(al)] : undefined}>
          <span>{al === "bubble" ? <ArrowLeftRight aria-hidden="true" /> : <GitMerge aria-hidden="true" />}{al === "bubble" ? "Bubble" : "Merge"}</span>
          <span className={a.track}><i style={{ transform: `scaleX(${current ? Math.max(.02, current[al] / max) : 0})` }} /></span>
          <b aria-label={`${al} sort comparisons`}>{current ? fmt(current[al]) : "—"}</b>
        </div>)}
      </div>
      <p className={k.hint} aria-live="polite">{hint || note}</p>
      <div className={a.final} role="group" aria-label="Choose the sort for sports day">
        <span>Sports day has 2,000 mixed results. Choose a sort and a reason{raced < 3 ? ` (race all three lists first: ${raced} of 3)` : ""}.</span>
        {finals.map(f => <button key={f.id} type="button" data-trap={f.id === "bubble" ? "true" : undefined} aria-pressed={solved ? f.id === "right" : picked === f.id} onClick={() => decide(f.id)} disabled={solved || raced < 3}>
          {f.id === "bubble" ? <ArrowLeftRight aria-hidden="true" /> : <GitMerge aria-hidden="true" />}{f.text}{(solved && f.id === "right") && <ArrowRight aria-hidden="true" />}
        </button>)}
      </div>
      <small>Example lists. The counters show real comparisons from these runs.</small>
    </div>}

    {scene === 4 && <div className={k.panel}>
      <h2>Double the runners. Watch the work.</h2>
      <svg className={a.chart} viewBox="0 0 320 172" role="img" aria-label="Comparisons as runners grow: bubble sort rises steeply like n squared, merge sort stays low like n log n">
        <path d="M30 15V150H310" className={a.axis} />
        {[1000, 2000].map(n => <text key={n} x={X(n)} y="164" textAnchor="middle">{fmt(n)}</text>)}
        <text x="24" y={Y(2e6) + 3} textAnchor="end">2M</text><text x="24" y={Y(1e6) + 3} textAnchor="end">1M</text>
        <text x="310" y="171" textAnchor="end" className={a.axisName}>runners →</text>
        <g data-show={at("Bubble sort's")}>
          <path d={nSquared} className={a.bubbleLine} />
          <line x1={X(1000)} y1={Y(5e5)} x2={X(1000)} y2="150" className={a.guide} /><line x1={X(2000)} y1={Y(2e6)} x2={X(2000)} y2="150" className={a.guide} />
          <circle cx={X(1000)} cy={Y(5e5)} r="3.5" className={a.bubbleDot} /><circle cx={X(2000)} cy={Y(2e6)} r="3.5" className={a.bubbleDot} />
          <text x={X(2000) - 8} y={Y(2e6) + 4} textAnchor="end" className={a.bubbleText}>bubble · n²</text>
          <text x={X(1500) - 22} y={Y(1.1e6)} textAnchor="middle" className={a.times}>×4</text>
        </g>
        <g data-show={at("Merge sort grows")}>
          <path d={nLogN} className={a.mergeLine} />
          <text x={X(2000)} y="143" textAnchor="end" className={a.mergeText}>merge · n log n</text>
        </g>
      </svg>
      <div className={a.facts}>
        <div data-show={at("Bubble sort's")}><ArrowLeftRight aria-hidden="true" /><span>2× runners</span><b>≈ 4× work</b></div>
        <div data-show={at("Merge sort grows")} data-good="true"><GitMerge aria-hidden="true" /><span>2× runners</span><b>≈ 2.2× work</b></div>
        <div data-show={at("On a tiny")} data-wide="true"><Timer aria-hidden="true" /><span>Tiny, tidy list? Bubble’s early stop can win:</span><b>7 vs 12</b></div>
      </div>
    </div>}
  </SceneSwap>;
}

const chapter: StoryChapter = {
  script,
  title: "Kabir’s frozen leaderboard",
  icon: Trophy,
  character: { asset: "emotional-avatar", name: "Kabir" },
  interactionScene: 3,
  beginLabel: "Practise with Kabir",
  waitingText: "Story paused. Race the sorts and choose one to see what happens next.",
  lockedHint: "Help Kabir race the sorts and choose one first.",
  World,
};
export default chapter;
