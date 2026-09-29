"use client";

import { ArrowRight, Bot, Check, CircleAlert, Mountain, RotateCcw, ScanLine, ShoppingBasket, Store, UserRound, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { SceneSwap } from "../StoryPlayer";
import type { StoryChapter, StoryWorldProps } from "../types";
import script from "./teach-pet-machine.json";
import k from "../story-player.module.css";
import c from "./teach-pet-machine.module.css";

type Kind = "Fruit" | "Rock";
type Mark = "right" | "wrong";
const examples: { id: string; name: string; kind: Kind; why: string }[] = [
  { id: "green-apple", name: "Green apple", kind: "Fruit", why: "A green apple is still an apple. It’s a fruit, even if it isn’t red!" },
  { id: "grey-rock", name: "Grey rock", kind: "Rock", why: "A grey rock can’t be eaten. It belongs on the Rock tray." },
  { id: "banana", name: "Banana", kind: "Fruit", why: "A banana is a fruit, even though it isn’t red or round." },
  { id: "red-rock", name: "Round red rock", kind: "Rock", why: "It’s red and round, but it’s a rock! This is the one that fooled the machine." },
  { id: "grapes", name: "Grapes", kind: "Fruit", why: "Grapes are fruit, even small purple ones." },
  { id: "pebble", name: "Flat pebble", kind: "Rock", why: "A flat pebble is a little rock, not a fruit." },
];
const trapWhy = "Five more red apples are all the same. The machine would still think red and round means fruit. Pick different examples.";
const sprites = ["red-apple", "green-apple", "banana", "grapes", "grey-rock", "red-rock", "pebble"];
// Seconds into each scene's narration when a detail appears (cue words noted beside each).
const cue = {
  meet: [9, 12.4], // "He shows it one shiny red apple", "The machine beeps"
  problem: [4, 7, 10.2], // "Beep! … fruit basket", "a green apple lands", "Meera Aunty"
  why: [2.8, 5.2, 13.6], // "Just one red apple", "red and round means fruit", "It needs more examples"
  learned: [2.3, 4.8, 11.4], // "The red rock goes", "The green apple goes", "a person checks too"
};

function Thing({ id }: { id: string }) {
  const at = Math.max(0, sprites.indexOf(id));
  return <span className={c.thing} aria-hidden="true" style={{ backgroundPosition: `${at % 4 * 100 / 3}% ${at < 4 ? 0 : 100}%` }} />;
}

function Tokens({ items, marks = {} }: { items: string[]; marks?: Record<string, Mark> }) {
  return <>{items.map(id => <span className={`${c.token} ${k.fitIn}`} key={id} data-mark={marks[id]}><Thing id={id} />{marks[id] === "wrong" ? <X className={c.markIcon} /> : marks[id] === "right" ? <Check className={c.markIcon} /> : null}</span>)}</>;
}

function Machine({ face, screen, belt = [], beltNote = "", fruit = [], rocks = [], marks, learned, children }: { face: string; screen: string; belt?: string[]; beltNote?: string; fruit?: string[]; rocks?: string[]; marks?: Record<string, Mark>; learned: number; children?: ReactNode }) {
  return <div className={`${k.deviceArt} ${c.stall}`}>
    <div className={c.head}>
      <div className={c.face} data-face={face} aria-hidden="true"><span className={c.robotArt} /></div>
      <div className={c.screen} aria-live="polite"><small>Pet machine says</small><strong>{screen}</strong></div>
      <div className={c.meter} role="meter" aria-label="Examples learned" aria-valuemin={0} aria-valuemax={7} aria-valuenow={learned}>
        <small>Learned</small><span><b style={{ transform: `scaleX(${learned / 7})` }} /></span><small>{learned === 1 ? "1 example" : `${learned} examples`}</small>
      </div>
    </div>
    {children ?? <><div className={c.belt} data-scanning={belt.length > 0}>{belt.length ? <Tokens items={belt} /> : <em>{beltNote}</em>}<ScanLine aria-hidden="true" /></div>
    <div className={c.bins}>
      <div className={c.bin} data-bin="fruit"><span><ShoppingBasket aria-hidden="true" />Fruit basket</span><div>{fruit.length ? <Tokens items={fruit} marks={marks} /> : <em>Empty</em>}</div></div>
      <div className={c.bin} data-bin="rock"><span><Mountain aria-hidden="true" />Rock pile</span><div>{rocks.length ? <Tokens items={rocks} marks={marks} /> : <em>Empty</em>}</div></div>
    </div></>}
  </div>;
}

function Person({ name, line, note }: { name: string; line: string; note: string }) {
  return <div className={c.chat}><span className={c.avatar} data-person={name[0]} aria-hidden="true">{name[0]}</span><p><strong>{name}</strong>{line}</p>{note && <small>{note}</small>}</div>;
}

function World({ scene, playing, elapsed, solved, markSolved, hint, setHint, reduced }: StoryWorldProps) {
  const [placed, setPlaced] = useState<string[]>([]);
  const [selected, setSelected] = useState("");
  const show = (t: number) => !playing || elapsed >= t;
  const find = (id: string) => examples.find(item => item.id === id);
  const onTray = (kind: Kind) => placed.filter(id => find(id)?.kind === kind);

  function pick(id: string) {
    if (solved) return;
    if (id === "red-apples") { setSelected(""); setHint(trapWhy, false); return; }
    setSelected(value => value === id ? "" : id); setHint("");
  }
  function place(tray: Kind, id = selected) {
    const item = find(id);
    if (solved || placed.includes(id)) return;
    if (id === "red-apples") { setHint(trapWhy, false); return; }
    if (!item) { setHint("Tap an example first, then tap its tray."); return; }
    if (item.kind !== tray) { setSelected(id); setHint(item.why, false); return; }
    setPlaced(value => [...value, id]); setSelected(""); setHint("");
  }
  function test() {
    if (solved) return;
    if (!placed.length) setHint("It has still only seen one red apple. Feed it some different examples first.");
    else if (!placed.includes("red-rock")) setHint("It still thinks red and round means fruit. Show it the round red rock on the Rock tray.");
    else if (placed.length < examples.length) setHint("Almost! Add the other examples too, so it sees more kinds of fruit and rock.");
    else markSolved();
  }
  const picked = find(selected);
  const status = solved ? "Tested! Round red rock → Rock. Green apple → Fruit. It sorts correctly now."
    : picked ? `${picked.name} picked. Now tap its tray.`
      : placed.length === examples.length ? "All six examples added. Press Test!" : "Different fruits and different rocks teach it best.";

  const s = { a: show(cue.problem[0]), b: show(cue.problem[1]), m: show(cue.problem[2]) };
  const meetApple = show(cue.meet[0]), meetLearned = show(cue.meet[1]);

  return <SceneSwap scene={scene} reduced={reduced}>
    {(scene === 0 || scene === 1 || scene === 5) && <div className={k.device}>
      <div className={k.deviceBar}><span><Bot size={16} /> PET MACHINE</span><span>Nani’s fruit stall</span></div>
      {scene === 0 && <Machine face={meetLearned ? "happy" : "ok"} learned={meetLearned ? 1 : 0}
        screen={meetLearned ? "Red apple = Fruit. Learned!" : meetApple ? "Scanning…" : "Show me an example!"}
        belt={meetApple && !meetLearned ? ["red-apple"] : []} beltNote={meetLearned ? "Ready to sort!" : "Waiting for an example"}
        fruit={meetLearned ? ["red-apple"] : []} rocks={[]} />}
      {scene === 1 && <Machine face={s.a ? "confused" : "ok"} learned={1}
        screen={s.b ? "Not red? Then ROCK!" : s.a ? "Red and round? FRUIT!" : "Red… round…"}
        belt={!s.a ? ["red-rock"] : !s.b ? ["green-apple"] : []} beltNote="Two things sorted wrong"
        fruit={s.a ? ["red-apple", "red-rock"] : ["red-apple"]} rocks={s.b ? ["green-apple"] : []} marks={{ "red-rock": "wrong", "green-apple": "wrong" }} />}
      {scene === 5 && <Machine face="happy" learned={7} screen="Everything sorted right!" belt={[]} beltNote="Nani checked every basket"
        fruit={["red-apple", "green-apple", "banana", "grapes"]} rocks={["grey-rock", "red-rock", "pebble"]} />}
      <div className={k.deviceFoot}>
        {scene === 0 ? <><Store /><span>Sunday at Nani’s stall, Cyberpur market</span><small>Toy machine · pretend</small></>
          : scene === 1 ? (s.m ? <Person name="Meera Aunty" line="Nani, is this… a rock?" note="Pretend customer" /> : <><CircleAlert /><span>The machine made a mistake.</span></>)
            : <Person name="Meera Aunty" line="Only fruit in my bag today. Thank you!" note="Pretend customer" />}
      </div>
    </div>}

    {scene === 2 && <div className={k.device}>
      <div className={k.deviceBar}><span><Bot size={16} /> PET MACHINE</span><span>Nani’s fruit stall</span></div>
      <Machine face="confused" learned={1} screen="It needs more examples, and different ones."><div className={c.workspace}>
      <div className={c.nani}><Person name="Nani" line="“What did it learn from, beta?”" note="" /></div>
      <h2>Inside the machine’s memory</h2>
      <div className={c.memory} aria-label="Machine memory: 1 of 6 slots filled">
        {Array.from({ length: 6 }, (_, i) => <span key={i} data-filled={i === 0}>{i === 0 ? <><Thing id="red-apple" /><small>Fruit</small></> : "?"}</span>)}
      </div>
      {["It saw just one example: a red apple.", "Its guess: red + round = fruit.", "It needs more examples, and different ones."].map((step, i) =>
        <div className={k.step} key={step} data-active={show(cue.why[i])}><span>{i === 1 ? <CircleAlert /> : <Check />}</span>{step}</div>)}
    </div></Machine></div>}

    {scene === 3 && <div className={k.device}>
      <div className={k.deviceBar}><span><Bot size={16} /> PET MACHINE</span><span>Nani’s fruit stall</span></div>
      <Machine face={solved ? "happy" : "ok"} learned={placed.length + 1} screen={solved ? "Everything sorted right!" : picked ? `${picked.name} picked. Now tap its tray.` : "Show me different examples!"}><div className={`${c.workspace} ${c.task}`}>
      <h2>Teach the pet machine</h2>
      <p>Tap an example, then tap its tray. When you’re done, press Test.</p>
      <div className={`${k.bank} ${c.examples}`} role="group" aria-label="Examples">
        {examples.map(item => <button key={item.id} type="button" draggable={!solved && !placed.includes(item.id)}
          onDragStart={event => { event.dataTransfer.setData("text/plain", item.id); setSelected(item.id); }}
          onClick={() => pick(item.id)} disabled={solved || placed.includes(item.id)} aria-pressed={selected === item.id} data-placed={placed.includes(item.id)}>
          <Thing id={item.id} />{item.name}</button>)}
        <button type="button" data-trap="true" onClick={() => pick("red-apples")} disabled={solved} aria-pressed={false}><Thing id="red-apple" />Five more red apples</button>
      </div>
      <div className={c.trays}>
        {(["Fruit", "Rock"] as Kind[]).map(kind => { const items = onTray(kind); const Icon = kind === "Fruit" ? ShoppingBasket : Mountain; return <button key={kind} type="button" className={`${c.bin} ${c.tray}`} data-bin={kind === "Fruit" ? "fruit" : "rock"} data-tray={kind}
          aria-label={`${kind} tray, ${items.length} ${items.length === 1 ? "example" : "examples"}`} aria-disabled={solved}
          onClick={() => place(kind)} onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); place(kind, event.dataTransfer.getData("text/plain")); }}>
          <span><Icon aria-hidden="true" />{kind} tray</span><div>{items.length ? <Tokens items={items} /> : <em>Empty</em>}</div></button>; })}
      </div>
      <div className={c.learnMeter} role="meter" aria-label="Learning meter" aria-valuemin={0} aria-valuemax={examples.length} aria-valuenow={placed.length}>
        <span>Learning meter</span><i><b style={{ transform: `scaleX(${placed.length / examples.length})` }} /></i><small>{placed.length} of {examples.length}</small>
      </div>
      <p className={k.hint} aria-live="polite">{hint || status}</p>
      <div className={k.actions}>
        <button onClick={() => { setPlaced(value => value.slice(0, -1)); setHint(""); }} disabled={!placed.length || solved} type="button"><RotateCcw />Undo</button>
        <button className={k.primary} onClick={test} disabled={solved} type="button">{solved ? <><Check />Tested</> : <>Test the machine <ArrowRight /></>}</button>
      </div>
      <small>Toy machine and pretend examples. Real machines learn from many more.</small>
    </div></Machine></div>}

    {scene === 4 && <div className={k.device}>
      <div className={k.deviceBar}><span><Bot size={16} /> PET MACHINE</span><span>Nani’s fruit stall</span></div>
      <Machine face="happy" learned={7} screen="Everything sorted right!"><div className={c.workspace}>
      <h2>Test time: sorted right!</h2>
      <div className={c.bins}>{([["green-apple", "Green apple", "Fruit"], ["red-rock", "Round red rock", "Rock"]] as const).map(([id, name, kind]) =>
        <div className={`${c.bin} ${c.result}`} data-bin={kind === "Fruit" ? "fruit" : "rock"} key={id} data-active={show(cue.learned[id === "red-rock" ? 0 : 1])}><span>{kind === "Fruit" ? <ShoppingBasket /> : <Mountain />}{name}</span><div><Tokens items={[id]} marks={{ [id]: "right" }} /><strong>Sorted to: {kind}</strong></div></div>)}</div>
      <div className={c.learnMeter} role="meter" aria-label="Examples learned" aria-valuemin={0} aria-valuemax={7} aria-valuenow={7}>
        <span>Learned from</span><i><b style={{ transform: "scaleX(1)" }} /></i><small>4 fruits · 3 rocks</small>
      </div>
      <div className={c.check} data-active={show(cue.learned[2])}><UserRound /><div><strong>A person checks too</strong><span>Machines can still make mistakes. Nani checks every basket.</span></div><Check /></div>
      <small>A toy example. Real machines learn from many, many more examples.</small>
    </div></Machine></div>}
  </SceneSwap>;
}

const chapter: StoryChapter = {
  script,
  title: "Teach the pet machine",
  icon: Bot,
  character: { asset: "boy-emotions", name: "Rohan" },
  interactionScene: 3,
  beginLabel: "Practise with Rohan",
  waitingText: "Story paused. Teach the machine, then press Test.",
  lockedHint: "Help Rohan teach the machine first.",
  World,
};
export default chapter;
