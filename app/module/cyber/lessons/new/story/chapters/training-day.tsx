"use client";

import { Bell, Bird, Camera, Cat, Check, CircleX, Database, Heart, PawPrint, RefreshCw, RotateCcw, ScanSearch, Sun, Tag, UserCheck, UserRound } from "lucide-react";
import { useState } from "react";
import { SceneSwap } from "../StoryPlayer";
import type { StoryChapter, StoryWorldProps } from "../types";
import script from "./training-day.json";
import k from "../story-player.module.css";
import r from "./training-day.module.css";

type Kind = "golden" | "indie" | "pug" | "cat" | "bird";
/** One photo crop. `v` picks a framing so three source photos can stand in for a varied set. */
function Pic({ kind, v = 0 }: { kind: Kind; v?: number }) {
  return <span className={r.pic} data-kind={kind} data-v={v} aria-hidden="true">{kind === "cat" ? <Cat /> : kind === "bird" ? <Bird /> : null}</span>;
}

const photos: { id: string; kind: Kind; v: number; alt: string; dog: boolean; old?: boolean }[] = [
  { id: "g1", kind: "golden", v: 0, alt: "golden retriever", dog: true, old: true },
  { id: "i1", kind: "indie", v: 1, alt: "brown indie dog, close-up", dog: true },
  { id: "c1", kind: "cat", v: 0, alt: "grey cat", dog: false },
  { id: "p1", kind: "pug", v: 1, alt: "black pug", dog: true },
  { id: "i2", kind: "indie", v: 2, alt: "brown indie dog, walking", dog: true },
  { id: "g2", kind: "golden", v: 2, alt: "golden retriever, side view", dog: true, old: true },
  { id: "b1", kind: "bird", v: 0, alt: "myna bird", dog: false },
  { id: "p2", kind: "pug", v: 3, alt: "fawn pug", dog: true },
];
const oldLabels = photos.filter(p => p.old).map(p => p.id);
const tests: { name: string; kind: Kind; v: number }[] = [{ name: "Kittu", kind: "indie", v: 1 }, { name: "A pug", kind: "pug", v: 3 }];
const covered = (labels: string[], kind: Kind) => photos.filter(p => p.kind === kind).every(p => labels.includes(p.id));
const oldBars = [{ name: "Golden retrievers", count: 48 }, { name: "Indie dogs", count: 0 }, { name: "Pugs", count: 0 }, { name: "Other dogs", count: 2 }];
const traits = [{ label: "Many breeds", Icon: PawPrint, at: .22 }, { label: "Sizes and colours", Icon: Tag, at: .3 }, { label: "Different light", Icon: Sun, at: .38 }, { label: "Different angles", Icon: Camera, at: .44 }];
const newBars = [{ name: "Golden retrievers", count: 48 }, { name: "Indie dogs", count: 46 }, { name: "Pugs", count: 40 }, { name: "Other dogs", count: 44 }];

function Bars({ bars, show }: { bars: typeof oldBars; show: (at: number) => Record<string, boolean> }) {
  return <div className={r.bars}>{bars.map(({ name, count }, i) => <div className={r.bar} key={name} data-zero={count === 0} {...show(i * .05)}>
    <span>{name}</span><span className={r.track}><span style={{ transform: `scaleX(${count / 50})` }} /></span><b>{count}</b>
  </div>)}</div>;
}

function World({ scene, playing, elapsed, solved, markSolved, hint, setHint, reduced }: StoryWorldProps) {
  const [labels, setLabels] = useState<string[]>(oldLabels);
  const [tested, setTested] = useState<boolean[] | null>(null);
  const [passing, setPassing] = useState(false);
  const done = solved || passing;
  const shownLabels = solved ? photos.filter(p => p.dog).map(p => p.id) : labels;
  const results = solved ? [true, true] : tested;
  const untouched = labels.length === oldLabels.length && labels.every(id => oldLabels.includes(id));
  // Reveal an item once narration reaches that fraction of the scene (everything shows while paused).
  const cue = (at: number) => !playing || elapsed > script.scenes[scene].duration * at;
  const show = (at: number) => ({ "data-on": cue(at), "aria-hidden": !cue(at) });

  function toggle(id: string) {
    if (done) return;
    setLabels(value => value.includes(id) ? value.filter(x => x !== id) : [...value, id]);
    setTested(null); setHint("");
  }
  function retrain() {
    if (done) return;
    const wrong = photos.find(p => !p.dog && labels.includes(p.id));
    if (wrong) { setTested(null); setHint(`The ${wrong.alt} isn’t a dog. A wrong label teaches the finder a wrong lesson. Tap it again to remove the label.`); return; }
    const result = tests.map(t => covered(labels, t.kind));
    setTested(result);
    if (!result[0] && untouched) { setHint("Retrained on golden retrievers only, so the finder still misses Kittu. Label the indie dogs and pugs too."); return; }
    const left = photos.filter(p => p.dog && !labels.includes(p.id)).length;
    if (left) { setHint(`Closer! ${left} dog ${left > 1 ? "photos are" : "photo is"} still unlabelled, so the finder still misses ${result[0] ? "pugs" : "dogs like Kittu"}. Every kind of dog needs examples.`); return; }
    setHint("Retrained on varied dogs. The finder now spots Kittu and the pug!");
    setPassing(true);
    window.setTimeout(markSolved, reduced ? 0 : 700);
  }

  return <SceneSwap scene={scene} reduced={reduced}>
    {(scene === 0 || scene === 1 || scene === 5) && <div className={k.device}>
      <div className={k.deviceBar}><span><ScanSearch size={16} /> PET FINDER</span><span>Lane corner camera · live</span></div>
      <div className={`${k.deviceArt} ${r.feed}`}>
        <div className={r.cam} data-scene={scene}>
          <Pic kind={scene === 0 ? "golden" : "indie"} v={scene === 0 ? 0 : 4} />
          <span className={r.rec}><span />REC · 07:42</span>
          <span className={r.box} data-miss={scene === 1} {...show(scene === 1 ? .4 : .3)} />
          <span className={r.tag} data-miss={scene === 1} {...show(scene === 1 ? .62 : .35)}>{scene === 1 ? <><CircleX aria-hidden="true" />Not a dog</> : <><Check aria-hidden="true" />{scene === 0 ? "Dog · 97%" : "Dog · 94%"}</>}</span>
        </div>
        <div className={r.log}>
          {scene === 0 && <>
            <div className={r.event} {...show(.08)}><Camera aria-hidden="true" /><span>Camera on · watching the lane</span></div>
            <div className={r.event} {...show(.38)}><PawPrint aria-hidden="true" /><span>Dog seen · alert ready</span></div>
            <div className={r.friend} {...show(.64)}><Pic kind="indie" v={1} /><div><strong>Kittu</strong><span>Everyone’s friend · biscuits at 7:30</span></div><Heart aria-hidden="true" /></div>
          </>}
          {scene === 1 && <>
            <div className={r.poster} {...show(.08)}><Pic kind="indie" v={1} /><div><strong>Missing: Kittu</strong><span>Brown indie dog · very friendly</span></div></div>
            <div className={r.event} data-bad="true" {...show(.62)}><ScanSearch aria-hidden="true" /><span>07:42 · animal seen · <b>not a dog</b></span></div>
            <div className={r.event} data-bad="true" {...show(.74)}><Bell aria-hidden="true" /><span>No alert sent</span></div>
          </>}
          {scene === 5 && <>
            <div className={r.event} {...show(.04)}><Bell aria-hidden="true" /><span>Alert · brown dog near the park</span></div>
            <div className={r.event} {...show(.2)}><UserCheck aria-hidden="true" /><span>Checked by a club member</span></div>
            <div className={r.found} {...show(.33)}><Heart aria-hidden="true" /><strong>Kittu is home!</strong><span>Tired, hungry and safe</span></div>
          </>}
        </div>
      </div>
      <div className={k.deviceFoot}>{scene === 0 ? <><Database /><span>Trained on 50 example photos</span><small>Coding club project</small></>
        : scene === 1 ? <><CircleX /><span>The finder didn’t recognise Kittu.</span></>
          : <><Check /><span>Retrained on varied dogs · a person checks every alert</span></>}</div>
    </div>}

    {scene === 2 && <div className={k.panel}>
      <div className={r.teacher}><span className={r.avatar}><UserRound aria-hidden="true" /></span><div><small>Ms Fernandes · club teacher</small><p>“A model learns from its examples.”</p></div></div>
      <h2>The finder’s training data</h2>
      <div className={r.thumbs}>{[0, 1, 2, 3, 4, 0, 2, 1, 3].map((v, i) => <Pic kind="golden" v={v} key={i} />)}<span className={r.more}>+41</span></div>
      <Bars bars={oldBars} show={at => show(.5 + at)} />
      <div className={r.rule} {...show(.86)}><CircleX aria-hidden="true" /><span>What it learned: <b>dog = golden and fluffy</b></span></div>
    </div>}

    {scene === 3 && <div className={`${k.panel} ${r.task}`}>
      <h2>Label the new training photos</h2>
      <p>Tap each photo that shows a dog. Tap again to remove a label.</p>
      <div className={r.grid}>{photos.map((p, i) => { const on = shownLabels.includes(p.id); return <button className={r.photo} key={p.id} type="button" aria-pressed={on} aria-label={`Photo ${i + 1}: ${p.alt}`} disabled={done} onClick={() => toggle(p.id)}>
        <Pic kind={p.kind} v={p.v} /><span className={r.label} data-on={on}>{on ? <><Tag aria-hidden="true" />Dog</> : "No label"}</span>
      </button>; })}</div>
      <div className={r.tests}>
        {tests.map((t, i) => <div className={r.test} key={t.name} data-result={results ? results[i] : undefined}>
          <Pic kind={t.kind} v={t.v} /><div><small>Test {i + 1}</small><strong>{t.name}</strong><span>{results ? results[i] ? "Dog ✓" : "Not a dog ✗" : "Not tested yet"}</span></div>
        </div>)}
      </div>
      <p className={k.hint} aria-live="polite">{hint || (done ? "Retrained on varied dogs. The finder now spots Kittu and the pug!" : `${shownLabels.length} photos labelled Dog.`)}</p>
      <div className={k.actions}>
        <button type="button" onClick={() => { setLabels(oldLabels); setTested(null); setHint(""); }} disabled={done || untouched}><RotateCcw />Start again</button>
        <button className={k.primary} type="button" onClick={retrain} disabled={done}><RefreshCw />Retrain and test</button>
      </div>
      <small>Example dataset. Real models learn from thousands of photos.</small>
    </div>}

    {scene === 4 && <div className={k.panel}>
      <h2>Good data is varied</h2>
      <Bars bars={newBars} show={at => show(.16 + at)} />
      <div className={r.chips}>{traits.map(({ label, Icon, at }) => <span className={r.chip} key={label} {...show(at)}><Icon aria-hidden="true" />{label}</span>)}</div>
      <div className={r.fair} {...show(.55)}><CircleX aria-hidden="true" /><span>Leave a group out, and the model can unfairly fail that group.</span></div>
      <div className={r.human} {...show(.8)}><UserCheck aria-hidden="true" /><div><strong>A person checks every alert</strong><span>Models still make mistakes, so humans stay in charge.</span></div><Check aria-hidden="true" /></div>
    </div>}
  </SceneSwap>;
}

const chapter: StoryChapter = {
  script,
  title: "Tara and the Pet Finder",
  icon: PawPrint,
  character: { asset: "girl-expressions", name: "Tara" },
  interactionScene: 3,
  beginLabel: "Practise with Tara",
  waitingText: "Story paused. Label every dog, then retrain and test the finder.",
  lockedHint: "Help Tara fix the training data first.",
  World,
  credits: <p>Dog photos, cropped in the story: “<a href="https://commons.wikimedia.org/wiki/File:GoldenRetriever.jpg" target="_blank" rel="noreferrer">GoldenRetriever.jpg</a>” by Ltshears (public domain), “<a href="https://commons.wikimedia.org/wiki/File:An_Indian_Pariah_Dog.jpg" target="_blank" rel="noreferrer">An Indian Pariah Dog</a>” by Amogh Tripathi (CC0 1.0) and “<a href="https://commons.wikimedia.org/wiki/File:Pugs.JPG" target="_blank" rel="noreferrer">Pugs.JPG</a>” by Pugman (public domain), Wikimedia Commons.</p>,
};
export default chapter;
