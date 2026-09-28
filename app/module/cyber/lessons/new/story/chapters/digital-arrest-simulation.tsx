"use client";

import { Ban, CircleAlert, Globe, HeartHandshake, Lock, NotebookPen, PhoneCall, PhoneOff, Pizza, ShieldCheck, Timer, UserRound, Users, Video } from "lucide-react";
import { useState } from "react";
import { SceneSwap } from "../StoryPlayer";
import type { StoryChapter, StoryWorldProps } from "../types";
import script from "./digital-arrest-simulation.json";
import k from "../story-player.module.css";
import r from "./digital-arrest-simulation.module.css";

/** A pretend video call: an illustrated (not real) caller in a uniform, with the demands captioned on screen. */
function Call({ show, compact }: { show?: (at: number) => Record<string, boolean>; compact?: boolean }) {
  const s = show ?? (() => ({}));
  return <div className={r.call} data-compact={compact ?? false}>
    <div className={r.callTop}><Video aria-hidden="true" /><span>+91 00000 66120 · not saved</span><b><Timer aria-hidden="true" />59:12</b></div>
    <div className={r.office} aria-hidden="true"><span className={r.crest} /><span className={r.shelf} /></div>
    <div className={r.officer} aria-hidden="true"><span className={r.cap} /><span className={r.face} /><span className={r.uniform}><span className={r.star} /></span></div>
    <span className={r.badge}>CBI · Central Bureau of Investigaton</span>
    <div className={r.captions}>
      <p {...s(.3)}>“You are under <b>DIGITAL ARREST</b>.”</p>
      <p {...s(.48)}>“Stay on camera. Tell no one.”</p>
      <p {...s(.6)}>“Pay <b>₹50,000</b> within 1 hour to clear your name.”</p>
    </div>
    <span className={r.pretend}>Pretend call · example only</span>
  </div>;
}

const clues = [
  { id: "badge", label: "The badge: “Investigaton” is misspelled, and there’s no ID you can check", warning: true, why: "Badges and uniforms are easy to fake, and this one is even misspelled. A screen badge proves nothing." },
  { id: "secret", label: "“Stay on camera and tell no one”", warning: true, why: "Real officers never demand secrecy or keep you on camera. Secrecy stops you from asking family for help." },
  { id: "name", label: "He knows Mum’s full name", warning: false, why: "Knowing her name isn’t proof he’s real: names and addresses leak online. Focus on what he demands." },
  { id: "money", label: "“Pay ₹50,000 within the hour to clear your name”", warning: true, why: "No real agency takes money to clear a case. The deadline is there to rush you." },
];
const actions = [
  { label: "Pay ₹50,000 to clear her name", ok: false, why: "No real agency takes money to clear a case. Paying only leads to more demands. End the call instead." },
  { label: "Stay on camera until he says she can go", ok: false, why: "Digital arrest isn’t a real legal procedure. Nobody has to stay on a video call. End it." },
  { label: "End the call, tell family, and report it", ok: true, why: "Exactly. End it, tell family, and report at cybercrime.gov.in, or call 1930 quickly if any money was paid." },
];

const reportSteps = [
  { Icon: PhoneOff, text: "End the call and block the number", at: .08 },
  { Icon: Users, text: "Tell family: Mum calls Dad", at: .2 },
  { Icon: Globe, text: "Report at cybercrime.gov.in", at: .3 },
];

function World({ scene, playing, elapsed, solved, markSolved, hint, setHint, reduced }: StoryWorldProps) {
  const [found, setFound] = useState<string[]>([]);
  const [passing, setPassing] = useState(false);
  const done = solved || passing;
  const spotted = solved ? clues.filter(c => c.warning).map(c => c.id) : found;
  const ready = spotted.length === clues.filter(c => c.warning).length;
  // Reveal an item once narration reaches that fraction of the scene (everything shows while paused).
  const cue = (at: number) => !playing || elapsed > script.scenes[scene].duration * at;
  const show = (at: number) => ({ "data-on": cue(at), "aria-hidden": !cue(at) });

  function tap(clue: (typeof clues)[number]) {
    if (done || found.includes(clue.id)) return;
    setHint(clue.why);
    if (clue.warning) setFound(value => [...value, clue.id]);
  }
  function act(action: (typeof actions)[number]) {
    if (done || !ready) return;
    setHint(action.why);
    if (!action.ok) return;
    setPassing(true);
    window.setTimeout(markSolved, reduced ? 0 : 700);
  }

  return <SceneSwap scene={scene} reduced={reduced}>
    {(scene === 0 || scene === 5) && <div className={k.device}>
      <div className={k.deviceBar}><span><Pizza size={16} /> SUNDAY EVENING</span><span>{scene === 0 ? "Meera’s home · 7:10 pm" : "Meera’s home · 8:30 pm"}</span></div>
      <div className={`${k.deviceArt} ${r.desk}`}>
        {scene === 0 && <><div className={k.badge}><Pizza /> Mushroom and corn?</div><span className={r.incoming} {...show(.62)}><Video aria-hidden="true" />Video call · unknown number</span></>}
        {scene === 5 && <div className={k.success}><ShieldCheck /><strong>Scam stopped</strong><span>Call ended · number blocked · reported</span></div>}
      </div>
      <div className={k.deviceFoot}>{scene === 0 ? <><UserRound /><span>Mum at the desk, Meera beside her</span></> : <><span className={r.chip}><Users aria-hidden="true" />Family group warned</span><span className={r.chip}><Ban aria-hidden="true" />Number blocked</span><span className={r.chip}><Globe aria-hidden="true" />Reported online</span></>}</div>
    </div>}

    {scene === 1 && <Call show={show} />}

    {scene === 2 && <div className={k.panel}>
      <div className={r.note} {...show(.86)}><NotebookPen aria-hidden="true" /><p>Mum, this is a <b>SCAM</b>. Real police never do this. Let’s hang up. <span>— Meera</span></p></div>
      <h2>What real police never do</h2>
      {["Arrest anyone over a video call", "Demand secrecy or keep you on camera", "Ask for money to clear a case"].map((fact, i) => <div className={k.step} key={fact} data-active={cue([.3, .45, .55][i])}><span><Ban /></span>{fact}</div>)}
      <p className={r.fact} {...show(.14)}><Lock aria-hidden="true" />“Digital arrest” is not a real legal procedure.</p>
    </div>}

    {scene === 3 && <div className={`${k.panel} ${r.task}`}>
      <h2>Spot the signs, then act</h2>
      <div className={r.bench}>
        <Call compact />
        <div className={r.clues}><small>Tap the warning signs ({spotted.length} of 3)</small>{clues.map(clue => { const on = spotted.includes(clue.id); return <button key={clue.id} type="button" aria-pressed={on} disabled={done || on} onClick={() => tap(clue)}>{on ? <CircleAlert aria-hidden="true" /> : <span className={r.dot} />}{clue.label}</button>; })}</div>
      </div>
      {ready && <div className={r.actions}><small>What should the family do?</small>{actions.map(action => <button key={action.label} type="button" data-trap={!action.ok || undefined} disabled={done} onClick={() => act(action)}>{action.ok ? <PhoneOff aria-hidden="true" /> : <PhoneCall aria-hidden="true" />}{action.label}</button>)}</div>}
      <p className={k.hint} aria-live="polite">{hint || (done ? "Exactly. End it, tell family, and report at cybercrime.gov.in, or call 1930 quickly if any money was paid." : ready ? "All three warning signs found. What should the family do?" : "Tap each warning sign you can see or hear on the call.")}</p>
      <small>Pretend call. Illustrated caller, fictional number.</small>
    </div>}

    {scene === 4 && <div className={k.panel}>
      <h2>End it, tell family, report it</h2>
      {reportSteps.map(({ Icon, text, at }) => <div className={k.step} key={text} data-active={cue(at)}><span><Icon /></span>{text}</div>)}
      <div className={r.help} {...show(.42)}><strong>1930</strong><span>National Cyber Crime Helpline. Call straight away if any money was paid.</span></div>
      <p className={r.fault} {...show(.8)}><HeartHandshake aria-hidden="true" />Being targeted isn’t anyone’s fault. Scammers call thousands of people.</p>
    </div>}
  </SceneSwap>;
}

const chapter: StoryChapter = {
  script,
  title: "Meera and the fake police call",
  icon: ShieldCheck,
  character: { asset: "emotional-avatar", name: "Meera" },
  interactionScene: 3,
  beginLabel: "Practise with Meera",
  waitingText: "Story paused. Spot the warning signs, then choose what the family should do.",
  lockedHint: "Help Meera and Mum respond to the call first.",
  World,
};
export default chapter;
