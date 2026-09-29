"use client";

import { ArrowRight, Check, CircleHelp, Gamepad2, KeyRound, LockKeyhole, Moon, RotateCcw, School, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { SceneSwap } from "../StoryPlayer";
import type { StoryChapter, StoryWorldProps } from "../types";
import { passwordExamples } from "../../password-examples";
import script from "./password-vault-builder.json";
import k from "../story-player.module.css";
import r from "./password-vault-builder.module.css";

const pieces = passwordExamples[0];

function World({ scene, playing, elapsed, solved, markSolved, hint, setHint, reduced }: StoryWorldProps) {
  const [selected, setSelected] = useState<string[]>([]);
  function addPiece(word: string) {
    if (solved || selected.includes(word) || selected.length === 2) return;
    if (!pieces.includes(word) && word !== "Rohan123") return;
    if (word === "Rohan123") { setHint("That is the old shortcut: his name + 123. Choose words that are not his name instead.", false); return; }
    setSelected(value => [...value, word]); setHint("");
  }
  return <SceneSwap scene={scene} reduced={reduced}>
    {(scene === 0 || scene === 1 || scene === 5) && <div className={k.device} data-dim={scene === 1}>
      <div className={k.deviceBar}><span><Moon size={16} /> MOONBASE</span><span>Rohan’s world</span></div>
      <div className={`${k.deviceArt} ${r.moonbase}`}>
        {scene === 0 && <div className={k.badge}><Check /> Moon base built!</div>}
        {scene === 1 && <div className={k.alert}><LockKeyhole /><strong>Can’t sign in</strong><span>Your password was changed.</span></div>}
        {scene === 5 && <div className={k.success}><ShieldCheck /><strong>Welcome back, Rohan!</strong><span>Account recovered · new secret saved</span></div>}
      </div>
      <div className={k.deviceFoot}>{scene === 0 ? <><KeyRound /><span>Password: <b>Rohan123</b></span><small>A familiar name + numbers</small></> : scene === 1 ? <><CircleHelp /><span>Someone guessed his password.</span></> : <><Gamepad2 /><span>Ready for the next adventure.</span></>}</div>
    </div>}
    {scene === 2 && <div className={k.panel}>
      <div className={r.mum}><span>Mum</span><p>“We’ll work through this together.”</p></div>
      <h2>Get help. Take back control.</h2>
      {["Use the game’s official recovery steps", "Choose a new password", "Sign out other sessions"].map((step, i) => <div className={k.step} key={step} data-active={!playing || elapsed > i * 3}><span><Check /></span>{step}</div>)}
    </div>}
    {scene === 3 && <div className={k.panel}>
      <h2>Build a password that is harder to guess</h2><p>Join two word tiles. Mango is a fruit. Rocket is a space machine. Their numbers and symbols stay attached.</p>
      <div className={r.wordSlots} aria-label={`${selected.length} of 2 password pieces added`} onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); addPiece(event.dataTransfer.getData("text/plain")); }}>
        {pieces.map((_, i) => <span key={i} data-filled={Boolean(selected[i])}>{selected[i] ?? <KeyRound aria-hidden="true" />}</span>)}
      </div>
      <div className={k.bank}>{pieces.map(word => { return <button key={word} draggable={!selected.includes(word) && !solved} onDragStart={event => event.dataTransfer.setData("text/plain", word)} onClick={() => addPiece(word)} disabled={solved || selected.includes(word)} aria-pressed={selected.includes(word)} type="button"><KeyRound aria-hidden="true" />{word}</button>; })}<button data-trap="true" onClick={() => addPiece("Rohan123")} disabled={solved} type="button"><KeyRound aria-hidden="true" />Rohan123</button></div>
      <p>482 is a number. ! and ? are symbols you can type.</p>
      <div className={r.passwordReadout} aria-live="polite"><span>One practice password</span><code>{selected.join("") || "—"}</code><strong>{selected.join("").length} characters</strong></div>
      <p className={k.hint} aria-live="polite">{hint || (selected.length === 2 ? "Two familiar words, with numbers and symbols. No name or birthday." : "Try Mango! and Rocket482? to see them join. No spaces needed.")}</p>
      <div className={k.actions}><button onClick={() => setSelected(value => value.slice(0, -1))} disabled={!selected.length || solved} type="button"><RotateCcw />Undo</button><button className={k.primary} disabled={selected.length !== 2} onClick={markSolved} type="button">Save Rohan’s practice password <ArrowRight /></button></div>
      <small>For practice only. Ask a trusted adult to help make and safely save a different password for each real account.</small>
    </div>}
    {scene === 4 && <div className={k.panel}>
      <h2>Two accounts. Two different passwords.</h2>
      <div className={r.account}><Gamepad2 /><div><strong>Game account · public example</strong><code>{(selected.length === 2 ? selected : pieces).join("")}</code></div><KeyRound /></div>
      <div className={r.account}><School /><div><strong>School account · different public example</strong><code>{passwordExamples[1].join("")}</code></div><KeyRound /></div>
      <div className={r.extraCheck}><ShieldCheck /><div><strong>Two-step verification</strong><span>An extra sign-in check, set up with a trusted adult.</span></div><Check /></div>
      <small>These are teaching examples, never real passwords.</small>
    </div>}
  </SceneSwap>;
}

const chapter: StoryChapter = {
  script,
  title: "Rohan’s missing moon base",
  icon: Gamepad2,
  character: { asset: "boy-emotions", name: "Rohan" },
  interactionScene: 3,
  beginLabel: "Practise with Rohan",
  waitingText: "Story paused. Join two word tiles to help Rohan make his practice password.",
  lockedHint: "Help Rohan join his two word tiles first.",
  World,
};
export default chapter;
