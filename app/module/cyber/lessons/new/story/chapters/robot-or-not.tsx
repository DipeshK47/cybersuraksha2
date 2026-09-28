"use client";

import { ArrowRight, BatteryFull, BatteryLow, Bot, Check, Clock3, Cookie, Heart, Moon, Music, PawPrint, PlugZap, ScrollText, Sparkles, Speaker, Sprout, UsersRound, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { SceneSwap } from "../StoryPlayer";
import type { StoryChapter, StoryWorldProps } from "../types";
import script from "./robot-or-not.json";
import k from "../story-player.module.css";
import r from "./robot-or-not.module.css";

type Bin = "Alive" | "Machine";
const things: { name: string; bin: Bin; icon: LucideIcon; why: string }[] = [
  { name: "Puppy", bin: "Alive", icon: PawPrint, why: "Moti eats, grows and needs care. Nobody wrote a program for him." },
  { name: "Smart speaker", bin: "Machine", icon: Speaker, why: "The speaker talks, but it only says what its program tells it. It can’t grow." },
  { name: "Classroom clock", bin: "Machine", icon: Clock3, why: "The clock’s hands move because of a battery and parts people built. It never grows." },
  { name: "Dancing robot", bin: "Machine", icon: Bot, why: "Tiko talks and dances, but only because people wrote its program. It can’t eat or grow." },
  { name: "Plant", bin: "Alive", icon: Sprout, why: "The plant grows and needs water and sunlight. That means it’s alive." },
];
const bins: { bin: Bin; icon: LucideIcon; note: string }[] = [
  { bin: "Alive", icon: Sprout, note: "Grows and needs care" },
  { bin: "Machine", icon: Bot, note: "Follows a program" },
];
const rules = [["music plays", "DANCE"], ["battery is low", "SAY “I’m hungry!”"], ["battery is full", "SAY “Let’s dance!”"]];
const aliveFacts = ["Grows bigger", "Needs food, water or sunlight", "Needs care"];
const machineFacts = ["Follows a program", "Programmed by people", "Needs charging, not food"];

/** Rohan's toy robot, built from CSS. `low` = sleepy amber face; `dance` = sways (static when reduced). */
function Tiko({ low, dance, line }: { low?: boolean; dance?: boolean; line: string }) {
  const Battery = low ? BatteryLow : BatteryFull;
  return <>
    <div className={r.toy} data-low={Boolean(low)} data-dance={Boolean(dance)} aria-hidden="true">
      {dance && <><Music className={r.note} /><Music className={r.note} /></>}
      <div className={r.bot}>
        <span className={r.antenna} />
        <span className={r.head}><span className={r.face}><i /><i /><b /></span></span>
        <span className={r.arm} /><span className={r.arm} />
        <span className={r.body}><span><Battery /></span></span>
        <span className={r.feet} />
      </div>
    </div>
    <div className={r.say} data-low={Boolean(low)}><small>Tiko says</small><strong>{line}</strong><span aria-hidden="true">{[0, 1, 2, 3, 4].map(i => <i key={i} />)}</span></div>
  </>;
}

function World({ scene, playing, elapsed, solved, markSolved, hint, setHint, reduced }: StoryWorldProps) {
  const [active, setActive] = useState("");
  const [placed, setPlaced] = useState<Record<string, Bin>>({});
  // Once solved, show the finished bins even if local state was lost.
  const done = solved ? Object.fromEntries(things.map(t => [t.name, t.bin])) as Record<string, Bin> : placed;
  const left = things.filter(t => !done[t.name]);
  const at = (seconds: number) => !playing || elapsed > seconds;

  function sort(name: string, bin: Bin) {
    const thing = things.find(t => t.name === name);
    if (solved || !thing || done[name]) return;
    setActive("");
    if (thing.bin !== bin) { setHint(`${thing.why} Try the other bin.`); return; }
    setPlaced(value => ({ ...value, [name]: bin })); setHint("");
  }
  function tapBin(bin: Bin) {
    if (active) sort(active, bin); else setHint("First tap a thing, then tap its bin.");
  }

  return <SceneSwap scene={scene} reduced={reduced}>
    {(scene === 0 || scene === 1 || scene === 5) && <div className={k.device} data-dim={scene === 1}>
      <div className={k.deviceBar}><span><Bot size={16} /> TIKO DANCE BOT</span><span>{scene === 1 ? "Rohan’s room · bedtime" : "Rohan’s room"}</span></div>
      <div className={`${k.deviceArt} ${r.room}`} data-reduced={reduced}>
        {scene === 0 && <div className={k.badge}><Sparkles /> New robot: Tiko</div>}
        {scene === 1 && <div className={k.badge}><Moon /> Bedtime</div>}
        {scene === 5 && <div className={k.badge}><BatteryFull /> Fully charged!</div>}
        <Tiko low={scene === 1} dance={scene !== 1} line={scene === 1 ? "I’m hungry!" : "Let’s dance!"} />
        {scene === 1 && <div className={r.snack} aria-hidden="true"><Cookie /><Cookie /><i /><i /><i /><i /></div>}
        {scene === 5 && <div className={r.moti}><span className={r.pic} role="img" aria-label="Moti, the neighbour’s puppy" /><span><PawPrint aria-hidden="true" />Woof!</span></div>}
      </div>
      <div className={k.deviceFoot}>{scene === 0 ? <><Music /><span>Dance mode: <b>ON</b></span><small>Pretend toy</small></> : scene === 1 ? <><BatteryLow /><span>Battery: <b>LOW</b></span><small>Same words, again and again</small></> : <><Heart /><span>Rohan, Tiko and Moti</span><small>Charged, not fed</small></>}</div>
    </div>}

    {scene === 2 && <div className={k.panel}>
      <div className={r.nani}><span>Nani</span><p>“What a kind heart you have.”</p></div>
      <div className={r.card} data-show={at(4)}>
        <div className={r.cardHead}><ScrollText aria-hidden="true" /><div><strong>Tiko’s instruction card</strong><span>Its program</span></div></div>
        {rules.map(([when, then], i) => <div className={r.rule} key={when} data-key={i === 1 && at(6.5)}><code>WHEN</code><span>{when}</span><ArrowRight aria-hidden="true" /><code>{then}</code></div>)}
        <div className={r.stamp} data-show={at(9.5)}><UsersRound aria-hidden="true" />People wrote these rules.</div>
      </div>
      <div className={k.step} data-active={at(11.5)}><span><PlugZap /></span>Charge Tiko tonight. No biscuits needed.</div>
    </div>}

    {scene === 3 && <div className={k.panel}>
      <h2>Alive or machine?</h2>
      <p>Tap a thing, then tap its bin. You can drag it too.</p>
      <div className={r.tray} role="group" aria-label="Things to sort">
        {left.map(t => <button key={t.name} type="button" aria-pressed={active === t.name} disabled={solved} draggable={!solved} onDragStart={event => event.dataTransfer.setData("text/plain", t.name)} onClick={() => { setActive(active === t.name ? "" : t.name); setHint(""); }}><t.icon aria-hidden="true" />{t.name}</button>)}
        {!left.length && <span className={r.trayDone}><Check aria-hidden="true" />All five sorted!</span>}
      </div>
      <div className={r.bins}>
        {bins.map(({ bin, icon: Icon, note }) => <button key={bin} type="button" className={r.bin} data-bin={bin} data-ready={Boolean(active)} disabled={solved} onClick={() => tapBin(bin)} onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); sort(event.dataTransfer.getData("text/plain"), bin); }}>
          <span className={r.binHead}><Icon aria-hidden="true" /><strong>{bin}</strong><small>{note}</small></span>
          <span className={r.binItems}>{things.some(t => done[t.name] === bin) ? things.filter(t => done[t.name] === bin).map(t => <span key={t.name} className={k.fitIn}><t.icon aria-hidden="true" />{t.name}</span>) : <em>Tap here to sort</em>}</span>
        </button>)}
      </div>
      <p className={k.hint} aria-live="polite">{hint || (solved ? "Sorted! Living things grow. Machines follow a program." : left.length ? "Ask: does it grow and need care? Or follow a program?" : "All sorted! Show Nani your bins.")}</p>
      <div className={k.actions}><button className={k.primary} disabled={solved || left.length > 0} onClick={markSolved} type="button">{solved ? <><Check />Nani saw your bins</> : <>Show Nani <ArrowRight /></>}</button></div>
      <small>Pretend objects. Moti is the neighbour’s puppy.</small>
    </div>}

    {scene === 4 && <div className={k.panel}>
      <h2>Alive or machine? Look closer.</h2>
      <div className={r.compare}>
        <section data-kind="alive">
          <header><span className={r.pic} aria-hidden="true" /><div><strong>Alive</strong><span>Moti · the plant</span></div><Sprout aria-hidden="true" /></header>
          {aliveFacts.map((fact, i) => <div className={k.step} key={fact} data-active={at(1.5 + i * 2.5)}><span><Check /></span>{fact}</div>)}
        </section>
        <section data-kind="machine">
          <header><span className={r.miniBot}><Bot aria-hidden="true" /></span><div><strong>Machine</strong><span>Tiko · clock · speaker</span></div><PlugZap aria-hidden="true" /></header>
          {machineFacts.map((fact, i) => <div className={k.step} key={fact} data-active={at(8.5 + i * 1.8)}><span><Check /></span>{fact}</div>)}
        </section>
      </div>
      <div className={r.quote} data-show={at(13)}>Tiko can <b>say</b> “I’m hungry!” It can’t <b>feel</b> hungry.</div>
    </div>}
  </SceneSwap>;
}

const chapter: StoryChapter = {
  script,
  title: "Rohan’s hungry robot",
  icon: Bot,
  character: { asset: "boy-emotions", name: "Rohan" },
  interactionScene: 3,
  beginLabel: "Sort with Rohan",
  waitingText: "Story paused. Sort all five things to see what happens next.",
  lockedHint: "Help Rohan sort all five things first.",
  World,
  credits: <p>Moti’s photo: “<a href="https://commons.wikimedia.org/wiki/File:An_Indian_Pariah_Dog.jpg" target="_blank" rel="noreferrer">An Indian Pariah Dog</a>” by Amogh Tripathi, Wikimedia Commons, CC0 1.0.</p>,
};
export default chapter;
