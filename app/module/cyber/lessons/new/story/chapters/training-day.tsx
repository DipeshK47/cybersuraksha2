"use client";
/* eslint-disable @next/next/no-img-element -- small local photos in a Vite page; next/image does not apply here. */

import { ArrowRight, BellOff, Check, CircleAlert, Heart, PawPrint, Plus, RotateCcw, ScanSearch, Users, X } from "lucide-react";
import { useRef, useState } from "react";
import { SceneSwap } from "../StoryPlayer";
import type { StoryChapter, StoryWorldProps } from "../types";
import script from "./training-day.json";
import k from "../story-player.module.css";
import r from "./training-day.module.css";

const img = { golden: "/cyber-missions/dog-golden.jpg", indie: "/cyber-missions/dog-indie.jpg", pug: "/cyber-missions/dog-pug.jpg", cat: "/cyber-missions/cat-training.jpg", crow: "/cyber-missions/crow-training.jpg", squirrel: "/cyber-missions/squirrel-training.jpg" };
type Label = "dog" | "not";
type Photo = { id: string; name: string; dog: boolean; src: string };
const photos: Photo[] = [
  { id: "golden", name: "Golden retriever", dog: true, src: img.golden },
  { id: "cat", name: "Cat", dog: false, src: img.cat },
  { id: "indie", name: "Indie dog", dog: true, src: img.indie },
  { id: "crow", name: "Crow", dog: false, src: img.crow },
  { id: "pug", name: "Pugs", dog: true, src: img.pug },
  { id: "squirrel", name: "Squirrel", dog: false, src: img.squirrel },
];
// Three test dogs from the lane: each passes only if its kind was labelled Dog in the tray.
const tests = [{ id: "golden", pet: "Bruno", src: img.golden }, { id: "indie", pet: "Kittu", src: img.indie }, { id: "pug", pet: "Chikoo", src: img.pug }];
const dataset = Array.from({ length: 50 }, (_, i) => i === 11 || i === 29 || i === 43 ? "other" : "golden");

function World({ scene, playing, elapsed, solved, markSolved, hint, setHint, reduced }: StoryWorldProps) {
  const [labels, setLabels] = useState<Record<string, Label>>({});
  const [tested, setTested] = useState<Record<string, boolean> | null>(null);
  const sent = useRef(false);
  // Reveal a detail once narration reaches that fraction of the scene; everything shows while paused.
  const cue = (frac: number) => !playing || elapsed > script.scenes[scene].duration * frac;
  const results = solved ? { golden: true, indie: true, pug: true } : tested;
  const allPass = Boolean(results && tests.every(t => results[t.id]));

  function label(id: string, value: Label) { if (solved) return; setLabels(current => ({ ...current, [id]: value })); setTested(null); }
  function retrain() {
    if (solved || sent.current) return;
    setTested(Object.fromEntries(tests.map(t => [t.id, labels[t.id] === "dog"])));
    const falseDog = photos.find(p => !p.dog && labels[p.id] === "dog");
    const falseNot = photos.find(p => p.dog && labels[p.id] === "not");
    const missing = photos.filter(p => p.dog && labels[p.id] !== "dog");
    if (falseDog) return setHint(`A ${falseDog.name.toLowerCase()} labelled Dog teaches the finder the wrong idea of a dog. Wrong labels teach wrong answers.`, false);
    if (falseNot) return setHint(`${falseNot.name} labelled Not dog tells the finder they aren’t dogs. That’s a wrong label. Every dog needs the Dog label.`, false);
    if (missing.length === 2 && labels.golden === "dog") return setHint("Kittu is still “not a dog”. You labelled only golden retrievers, so the finder still thinks dogs look golden and fluffy. Label the indie dog and the pugs too.", false);
    if (missing.length) return setHint(`Still missing: ${missing.map(p => p.name.toLowerCase()).join(" and ")}. A kind of dog left out of the training data gets missed in the test.`, false);
    if (photos.some(p => !labels[p.id])) return setHint("All dogs pass! Now label the cat, crow and squirrel as Not dog, so the finder also learns what isn’t a dog.", false);
    sent.current = true; setHint("");
    // Let the learner see the green test before the story moves on.
    window.setTimeout(markSolved, 1100);
  }
  function addGoldens() { if (!solved) setHint("More of the same won’t help. The finder already knows golden retrievers. It needs different dogs, like indies and pugs.", false); }
  function clear() { setLabels({}); setTested(null); setHint(""); }

  return <SceneSwap scene={scene} reduced={reduced}>
    {(scene === 0 || scene === 1 || scene === 5) && <div className={k.device}>
      <div className={k.deviceBar}><span><ScanSearch size={16} /> PET FINDER</span><span>Lane 4 · Cyberpur · Club project</span></div>
      <div className={r.screen}>
        <div className={`${k.deviceArt} ${r.feed} ${scene === 0 ? r.golden : r.indie}`} role="img" aria-label={scene === 0 ? "Camera view: Bruno, a golden retriever" : "Camera view: Kittu, a slim brown indie dog"}>
          <span className={r.cam}><i />{scene === 0 ? "CAM 1 · GATE" : scene === 1 ? "CAM 1 · GATE · 6:40 PM" : "CAM 3 · TEA STALL"}</span>
          {scene === 0 && cue(.47) && <span className={r.box}><b>Dog · 97%</b></span>}
          {scene === 1 && cue(.48) && <span className={r.box} data-miss="true"><b>Not a dog</b></span>}
          {scene === 5 && cue(.08) && <span className={r.box}><b>Dog · 91%</b></span>}
          {scene === 5 && cue(.55) && <div className={`${k.success} ${r.found}`}><Heart /><strong>Kittu is home!</strong><span>Spotted by the retrained finder</span></div>}
        </div>
        {scene === 0 ? <div className={r.side}>
          <strong><PawPrint /> Lane pets</strong>
          <div className={r.pet}><img src={img.golden} alt="" /><div><b>Bruno</b><span>Golden retriever</span></div>{cue(.47) && <Check className={k.fitIn} aria-label="Spotted" />}</div>
          <div className={r.pet} data-fav={cue(.72)}><img src={img.indie} alt="" /><div><b>Kittu</b><span>Lane dog · fed by all</span></div><Heart aria-hidden="true" /></div>
          <div className={r.pet}><img src={img.pug} alt="" /><div><b>Chikoo</b><span>Pug · House 12</span></div></div>
        </div> : <div className={r.side}>
          <strong><Users /> Lane 4 neighbours</strong>
          {scene === 1 ? <>
            <p className={r.msg}><b>Meena Aunty</b>Kittu didn’t come for his dinner. Has anyone seen him?</p>
            {cue(.3) && <p className={`${r.msg} ${k.fitIn}`} data-me="true"><b>Tara</b>Checking the pet finder now…</p>}
            {cue(.62) && <p className={`${r.sys} ${k.fitIn}`}><BellOff />Finder: no dogs seen tonight</p>}
          </> : <>
            <p className={r.sys} data-ok="true"><ScanSearch />Finder: dog seen at the tea stall</p>
            {cue(.2) && <p className={`${r.msg} ${k.fitIn}`} data-me="true"><b>Tara</b>It’s Kittu! Dad and I are going now.</p>}
            {cue(.5) && <p className={`${r.msg} ${k.fitIn}`}><b>Meena Aunty</b>Bringing his dinner!</p>}
          </>}
        </div>}
      </div>
      <div className={k.deviceFoot}>{scene === 0 ? <><Check /><span>Bruno spotted at the gate</span><small>Learned from 50 photos</small></> : scene === 1 ? <><CircleAlert /><span>No alert was sent.</span><small>Kittu walked right past the camera.</small></> : <><Check /><span>Retrained on many kinds of dogs</span><small>People still check every alert.</small></>}</div>
    </div>}

    {scene === 2 && <div className={k.panel}>
      <div className={r.teacher}><span className={r.avatar} aria-hidden="true">MD</span><div><span>Mr Das · Coding club</span><p>“Let’s look at what it learned from.”</p></div></div>
      <h2>Training data: 50 photos</h2>
      <div className={r.dataset} data-show={cue(.28)} role="img" aria-label="47 golden retrievers, 3 other dogs, no indie dogs">{dataset.map((kind, i) => <span key={i} data-kind={kind} />)}</div>
      <div className={r.legend} data-show={cue(.4)}><span><i />47 golden retrievers</span><span><i data-kind="other" />3 other dogs</span><span><i data-kind="none" />0 indie dogs</span></div>
      <div className={r.match}>
        <div data-show={cue(.6)}><img src={img.golden} alt="" /><div><strong>What it learned</strong><small>Dog = big, golden, fluffy</small></div></div>
        <ArrowRight aria-hidden="true" data-show={cue(.8)} />
        <div data-show={cue(.8)} data-miss="true"><img src={img.indie} alt="" /><div><strong>Kittu</strong><small>Slim, brown, short coat: no match</small></div></div>
      </div>
    </div>}

    {scene === 3 && <div className={k.panel}>
      <h2>Fix the training data</h2>
      <div className={r.tray} role="group" aria-label="Training photos">
        {photos.map(p => <div className={r.card} key={p.id} data-label={(solved ? (p.dog ? "dog" : "not") : labels[p.id]) ?? "none"}>
          <div className={r.thumb} data-kind={p.id}><img src={p.src} alt={p.name} /></div>
          <strong>{p.name}</strong>
          <div className={r.toggle} role="group" aria-label={`Label for ${p.name}`}>
            {(["dog", "not"] as const).map(value => { const on = solved ? (value === "dog") === p.dog : labels[p.id] === value; return <button key={value} aria-label={`Mark ${p.name} as ${value === "dog" ? "Dog" : "Not dog"}`} aria-pressed={on} disabled={solved} onClick={() => label(p.id, value)} type="button">{value === "dog" ? <Check aria-hidden="true" /> : <X aria-hidden="true" />}{value === "dog" ? "Dog" : "Not dog"}</button>; })}
          </div>
        </div>)}
      </div>
      <div className={`${k.bank} ${r.trap}`}><button data-trap="true" disabled={solved} onClick={addGoldens} type="button"><Plus aria-hidden="true" />Add 20 more golden retrievers</button></div>
      <div className={r.results} aria-live="polite">
        <span>Test</span>
        {tests.map(t => <div className={r.result} key={t.id} data-pass={results ? results[t.id] : undefined}><img src={t.src} alt="" /><div><b>{t.pet}</b><small>{!results ? "Not tested" : results[t.id] ? "Dog ✓" : "Not a dog ✗"}</small></div></div>)}
      </div>
      <p className={k.hint} aria-live="polite">{hint || (allPass ? "Kittu spotted! The finder learned from every kind of dog." : "Label all six photos, then retrain and test.")}</p>
      <div className={k.actions}><button onClick={clear} disabled={solved || !Object.keys(labels).length} type="button"><RotateCcw />Clear</button><button className={k.primary} disabled={solved || !Object.keys(labels).length} onClick={retrain} type="button">Retrain and test <ArrowRight /></button></div>
      <small>Example photos only. A real finder needs many more photos, checked by people.</small>
    </div>}

    {scene === 4 && <div className={k.panel}>
      <h2>Better data, better answers</h2>
      <div className={r.compare}>
        {[{ key: "before", title: "Before", mix: [["golden", 94], ["other", 6]], pass: [true, false, false] }, { key: "after", title: "After", mix: [["golden", 25], ["indie", 25], ["pug", 20], ["not", 30]], pass: [true, true, true] }].map(side => <div className={r.col} data-side={side.key} key={side.key}>
          <span>{side.title}</span>
          <div className={r.mix} aria-hidden="true">{side.mix.map(([kind, w]) => <i key={kind} data-kind={kind} style={{ width: `${w}%` }} />)}</div>
          <small>{side.key === "before" ? "Almost all golden retrievers" : "Many kinds of dogs + not-dogs"}</small>
          <div className={r.checks}>{tests.map((t, i) => <span key={t.id} data-pass={side.pass[i]}><img src={t.src} alt="" />{t.pet}{side.pass[i] ? <Check aria-label="found" /> : <X aria-label="missed" />}</span>)}</div>
        </div>)}
      </div>
      {["Varied: many kinds of dogs", "Labelled correctly: Dog and Not dog", "Tested by people, again and again"].map((step, i) => <div className={k.step} key={step} data-active={cue(.52 + i * .13)}><span><Check /></span>{step}</div>)}
    </div>}
  </SceneSwap>;
}

const chapter: StoryChapter = {
  script,
  title: "Tara’s lost pet finder",
  icon: PawPrint,
  character: { asset: "girl-expressions", name: "Tara" },
  interactionScene: 3,
  beginLabel: "Practise with Tara",
  waitingText: "Story paused. Fix the training data to see what happens next.",
  lockedHint: "Help Tara fix the training data first.",
  World,
  credits: <p>Animal photos from Wikimedia Commons: “<a href="https://commons.wikimedia.org/wiki/File:GoldenRetriever.jpg" target="_blank" rel="noreferrer">GoldenRetriever.jpg</a>” by Ltshears (public domain), “<a href="https://commons.wikimedia.org/wiki/File:An_Indian_Pariah_Dog.jpg" target="_blank" rel="noreferrer">An Indian Pariah Dog</a>” by Amogh Tripathi (CC0 1.0), “<a href="https://commons.wikimedia.org/wiki/File:Pugs.JPG" target="_blank" rel="noreferrer">Pugs.JPG</a>” by Pugman (public domain), “<a href="https://commons.wikimedia.org/wiki/File:Closeup_photo_of_a_cat.jpg" target="_blank" rel="noreferrer">Closeup photo of a cat</a>” by RobotBlanket (CC0 1.0), “<a href="https://commons.wikimedia.org/wiki/File:Indian_Crow.jpg" target="_blank" rel="noreferrer">Indian Crow</a>” by Priyanka Bansal (public domain), and “<a href="https://commons.wikimedia.org/wiki/File:Squirrel_closeup.JPG" target="_blank" rel="noreferrer">Squirrel closeup</a>” by Njose (CC0 1.0).</p>,
};
export default chapter;
