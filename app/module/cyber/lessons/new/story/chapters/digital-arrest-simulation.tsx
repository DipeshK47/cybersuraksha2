"use client";

import { ArrowRight, Ban, Building2, Cake, CalendarDays, Camera, Check, CircleAlert, EyeOff, Globe, IdCard, IndianRupee, Mic, Package, Phone, PhoneOff, RotateCcw, Scale, Shield, ShieldCheck, Shirt, Star, StickyNote, UserRound, Users, Video } from "lucide-react";
import { useState } from "react";
import { SceneSwap } from "../StoryPlayer";
import type { StoryChapter, StoryScript, StoryWorldProps } from "../types";
import script from "./digital-arrest-simulation.json";
import k from "../story-player.module.css";
import r from "./digital-arrest-simulation.module.css";

const story: StoryScript = script;
/** Seconds into scene `i` when its narration reaches word `word` (keeps reveals in sync after re-narration). */
const cue = (i: number, word: number) => { const sc = story.scenes[i]; return sc.duration * word / (sc.speech ?? sc.caption).split(" ").length; };

const caller = "+91 00000 45210";
const demands = [
  { icon: Package, text: "A parcel in your name had illegal items.", word: 14 },
  { icon: CircleAlert, text: "You are under DIGITAL ARREST.", word: 25 },
  { icon: EyeOff, text: "Stay on camera. Tell no one.", word: 32 },
  { icon: IndianRupee, text: "Pay ₹50,000 now to clear your name.", word: 38 },
];
const clues = [
  { id: "badge", icon: IdCard, title: "The “CBI” badge", detail: "Misspelt, blurry, and impossible to check on a call", sign: true, why: "" },
  { id: "uniform", icon: Shirt, title: "His uniform", detail: "Khaki shirt, cap and shoulder stars", sign: false, why: "A uniform is easy to buy or copy, so it proves nothing either way. Look at what he demands." },
  { id: "secret", icon: EyeOff, title: "“Stay on camera. Tell no one.”", detail: "He says not to hang up or tell family", sign: true, why: "" },
  { id: "office", icon: Building2, title: "His office background", detail: "Shelves of files and a round crest", sign: false, why: "Anyone can set up files and a crest behind them. A background proves nothing. Look at his demands." },
  { id: "pay", icon: IndianRupee, title: "“Pay ₹50,000 to clear your name”", detail: "He wants the money now, on this call", sign: true, why: "" },
];
const moves = [
  { id: "end", icon: PhoneOff, label: "End the call", short: "End the call" },
  { id: "pay", icon: IndianRupee, label: "Pay ₹50,000 to clear her name", trap: "Paying never clears a case. Real officers don’t collect money on a call, and money sent to a scammer is hard to get back." },
  { id: "tell", icon: Users, label: "Tell family", short: "Tell family" },
  { id: "stay", icon: Video, label: "Stay on the call, as he says", trap: "Digital arrest isn’t a real legal procedure. Nobody has to stay on camera. It’s safe to end the call." },
  { id: "report", icon: ShieldCheck, label: "Report it: 1930 / cybercrime.gov.in", short: "Report it" },
];

/** The pretend caller: office backdrop, uniformed figure, and a fake badge. All decorative except the caption tags. */
function CallFeed({ small }: { small?: boolean }) {
  return <div className={r.feed} data-small={small}>
    <div className={r.office} aria-hidden="true"><span className={r.shelf}><i /><i /><i /></span><span className={r.crest}><Star /></span></div>
    <div className={r.officer} aria-hidden="true"><span className={r.cap} /><span className={r.head} /><span className={r.body}><i /><i /></span></div>
    <div className={r.fakeBadge} role="img" aria-label="Fake badge reading C.B.I., Central Bureau of Investigaton, with a spelling mistake"><Shield /><strong>C.B.I.</strong><small>CENTRAL BUREAU OF INVESTIGATON</small><small>ID 000-000</small></div>
    <span className={r.live}><i />LIVE · 04:12</span>
    <span className={r.callerTag}>“CBI Officer” · {caller}</span>
    <span className={r.self}><UserRound aria-hidden="true" />Mum</span>
  </div>;
}

function World({ scene, playing, elapsed, solved, markSolved, hint, setHint, reduced }: StoryWorldProps) {
  const [picked, setPicked] = useState<string[]>([]);
  const [signsDone, setSignsDone] = useState(false);
  const [plan, setPlan] = useState<string[]>([]);
  const show = (i: number, word: number) => !playing || elapsed >= cue(i, word);
  const step2 = signsDone || solved;
  const planned = solved ? ["end", "tell", "report"] : plan;

  function toggleClue(id: string) {
    if (step2) return;
    setHint("");
    if (picked.includes(id)) setPicked(v => v.filter(x => x !== id));
    else if (picked.length < 3) setPicked(v => [...v, id]);
    else setHint("You’ve picked three. Tap one again to swap it out.");
  }
  function checkSigns() {
    const wrong = clues.find(c => picked.includes(c.id) && !c.sign);
    if (wrong) { setHint(wrong.why); return; }
    setSignsDone(true); setHint("");
  }
  function choose(id: string) {
    if (solved || plan.includes(id)) return;
    const move = moves.find(m => m.id === id);
    if (!move) return;
    if (move.trap) { setHint(move.trap); return; }
    setPlan(v => [...v, id]); setHint("");
  }

  return <SceneSwap scene={scene} reduced={reduced}>
    {(scene === 0 || scene === 5) && <div className={k.device}>
      <div className={k.deviceBar}><span><CalendarDays size={16} /> HOME · SUNDAY</span><span>Kabir’s family</span></div>
      <div className={`${k.deviceArt} ${r.desk}`}>
        {scene === 0 && <>
          <div className={k.badge}><Cake /> Dadi turns 70 on Saturday</div>
          <div className={r.incoming} data-show={show(0, 29)} aria-hidden={!show(0, 29)}>
            <span className={r.ring}><Video /></span>
            <div><strong>Incoming video call</strong><small>{caller} · Unknown number</small></div>
            <span className={r.decline}><PhoneOff /></span><span className={r.accept}><Video /></span>
          </div>
        </>}
        {scene === 5 && <>
          <div className={k.badge}><Cake /> Happy 70th, Dadi!</div>
          <div className={k.success}><ShieldCheck /><strong>Call ended. Family safe.</strong><span>No money sent · Reported at cybercrime.gov.in</span></div>
        </>}
      </div>
      <div className={k.deviceFoot}>{scene === 0
        ? <><Cake /><span>Sunday plan: <b>chocolate cake</b></span><small>Pretend call · example only</small></>
        : <><ShieldCheck /><span>Surprise party: happy secret. “Tell no one”: warning sign.</span></>}</div>
    </div>}

    {scene === 1 && <div className={k.device}>
      <div className={k.deviceBar}><span><Video size={16} /> VIDEO CALL</span><span>Pretend call · example only</span></div>
      <div className={r.call}>
        <CallFeed />
        <ul className={r.chat} aria-label="What the caller says">
          {demands.map(({ icon: Icon, text, word }) => <li key={text} data-show={show(1, word)} aria-hidden={!show(1, word)}><Icon aria-hidden="true" />{text}</li>)}
        </ul>
      </div>
      <div className={r.controls} aria-hidden="true"><span><Mic /></span><span><Video /></span><span className={r.hang}><PhoneOff /></span></div>
    </div>}

    {scene === 2 && <div className={k.panel}>
      <div className={r.notes}>
        <div className={r.sticky} data-show={show(2, 8)}><span><StickyNote aria-hidden="true" /> Kabir’s note</span><p>This looks like a scam. Don’t pay.</p></div>
        <div className={r.papa} data-show={show(2, 24)}><span>Papa, calm and steady</span><p>“We’ll handle this together.”</p></div>
      </div>
      <h2>Real police and CBI officers never…</h2>
      {[["arrest anyone on a video call", 39], ["demand that you keep it secret", 52], ["ask for money to close a case", 57]].map(([text, word]) => <div className={k.step} key={text} data-active={show(2, Number(word))}><span><Ban /></span>{text}</div>)}
    </div>}

    {scene === 3 && <div className={k.panel}>
      <span className={r.eyebrow}>{step2 ? "Step 2 of 2 · Act" : "Step 1 of 2 · Investigate"}</span>
      {!step2 ? <>
        <h2>Spot three warning signs</h2>
        <p>Tap the three strongest signs from the call, then check.</p>
        <div className={r.clues} role="group" aria-label="Details from the call">
          {clues.map(({ id, icon: Icon, title, detail }) => <button key={id} type="button" aria-pressed={picked.includes(id)} onClick={() => toggleClue(id)}>
            <span className={r.clueIcon}><Icon aria-hidden="true" /></span><span><strong>{title}</strong><small>{detail}</small></span><span className={r.tick}><Check aria-hidden="true" /></span>
          </button>)}
        </div>
        <p className={k.hint} aria-live="polite">{hint || `${picked.length} of 3 picked. Ask: what does he want, and could you check who he is?`}</p>
        <div className={k.actions}><button className={k.primary} disabled={picked.length !== 3} onClick={checkSigns} type="button">Check my signs <ArrowRight /></button></div>
      </> : <>
        <div className={r.found}>{["Fake badge", "Secrecy demand", "Payment demand"].map(text => <span key={text}><Check aria-hidden="true" />{text}</span>)}</div>
        <h2>What should the family do?</h2>
        <p>Choose the three safe moves.</p>
        <ol className={r.plan} aria-label={`${planned.length} of 3 moves chosen`}>
          {[0, 1, 2].map(i => { const move = moves.find(m => m.id === planned[i]); return <li key={i} data-filled={Boolean(move)}><span>{i + 1}</span>{move?.short ?? "…"}</li>; })}
        </ol>
        <div className={k.bank}>{moves.map(({ id, icon: Icon, label, trap }) => <button key={id} type="button" data-trap={trap ? "true" : undefined} aria-pressed={trap ? undefined : planned.includes(id)} disabled={solved || planned.includes(id)} onClick={() => choose(id)}><Icon aria-hidden="true" />{label}</button>)}</div>
        <p className={k.hint} aria-live="polite">{hint || (solved ? "Done! Mum ends the call. Nobody paid, and nobody stayed silent." : planned.length === 3 ? "That’s the plan: end the call, tell family, report it." : "Some choices feel quicker. Pick the ones that keep Mum safe.")}</p>
        <div className={k.actions}><button onClick={() => setPlan(v => v.slice(0, -1))} disabled={!plan.length || solved} type="button"><RotateCcw />Undo</button><button className={k.primary} disabled={planned.length !== 3 || solved} onClick={markSolved} type="button">{solved ? <>Plan made <Check /></> : <>Hang up and report <ArrowRight /></>}</button></div>
      </>}
      <small>Pretend call. Never share real details in a lesson.</small>
    </div>}

    {scene === 4 && <div className={k.panel}>
      <div className={r.fact}><Scale aria-hidden="true" /><div><strong>Digital arrest is not a real legal procedure.</strong><span>Police and CBI never arrest anyone on a video call, never demand secrecy, and never ask for money to close a case.</span></div></div>
      <div className={r.levers} data-show={show(4, 14)}><span>The scam’s tools:</span><b>Fear</b><b>Secrecy</b><b>A deadline</b></div>
      <h2>What the family did</h2>
      {[{ icon: PhoneOff, text: "Mum ended the call", word: 0 }, { icon: Camera, text: "Saved a screenshot of the number and time", word: 29 }, { icon: Globe, text: "Reported it at cybercrime.gov.in", word: 35 }, { icon: Phone, text: "Money ever sent? Call 1930 straight away", word: 47 }].map(({ icon: Icon, text, word }) => <div className={k.step} key={text} data-active={show(4, word)}><span><Icon /></span>{text}</div>)}
      <small>1930 is India’s National Cyber Crime Helpline.</small>
    </div>}
  </SceneSwap>;
}

const chapter: StoryChapter = {
  script: story,
  title: "Kabir and the fake officer",
  icon: ShieldCheck,
  character: { asset: "emotional-avatar", name: "Kabir" },
  interactionScene: 3,
  beginLabel: "Practise with Kabir",
  waitingText: "Story paused. Spot the signs and make the family’s plan to continue.",
  lockedHint: "Help Kabir check the call and choose the safe moves first.",
  World,
};
export default chapter;
