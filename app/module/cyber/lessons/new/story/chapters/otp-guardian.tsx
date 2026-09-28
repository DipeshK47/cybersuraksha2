"use client";

import { BatteryMedium, BookOpen, Check, CircleAlert, Clock, Globe, HeartHandshake, KeyRound, Landmark, MessageSquare, PhoneCall, PhoneOff, ShieldCheck, Signal, Zap } from "lucide-react";
import { useState } from "react";
import { SceneSwap } from "../StoryPlayer";
import type { StoryChapter, StoryWorldProps } from "../types";
import script from "./otp-guardian.json";
import k from "../story-player.module.css";
import r from "./otp-guardian.module.css";

const calls = [
  {
    caller: "Bank officer", number: "+91 00000 48213", Icon: Landmark, line: "Your card will be blocked today. Read me the OTP to verify it’s you.",
    options: [
      { label: "Read the OTP so he can verify", ok: false, trap: true, why: "The OTP approves a payment or sign-in. Reading it out would let the caller use Nani’s account. No real bank asks for it." },
      { label: "Ask for his number and call him back", ok: false, why: "That number leads straight back to the caller. Use a number you find yourself, like the one printed on the card." },
      { label: "Hang up, then call the number on the back of the card", ok: true, why: "Safe! The number printed on the card really reaches the bank." },
    ],
  },
  {
    caller: "Electricity office", number: "+91 00000 70561", Icon: Zap, line: "Your power will be cut tonight. Share the code we sent to stop it.",
    options: [
      { label: "Share the code so the lights stay on", ok: false, trap: true, why: "An electricity office never needs an OTP. The rush is there to stop Nani from thinking. Keep the code private." },
      { label: "Hang up, then call the number on the electricity bill", ok: true, why: "Safe! The bill shows the real office’s number, so Nani can check for herself." },
      { label: "Stay on the line and argue with him", ok: false, why: "There’s no need to argue with a scammer. Just end the call and check the bill yourself." },
    ],
  },
];
const flags = [{ label: "Official-sounding title", at: .62 }, { label: "A rush: today, tonight", at: .7 }, { label: "Asks for the OTP", at: .78 }];

function Sms() {
  return <div className={r.sms}><MessageSquare aria-hidden="true" /><div><small>Messages · now</small><span><b>482196</b> is your OTP for a payment of ₹24,999 at shopcart.example. Do not share it with anyone, even bank staff.</span></div></div>;
}

function World({ scene, playing, elapsed, solved, markSolved, hint, setHint, reduced }: StoryWorldProps) {
  const [answered, setAnswered] = useState([false, false]);
  const [current, setCurrent] = useState(0);
  const done = solved || answered.every(Boolean);
  const safe = solved ? [true, true] : answered;
  // Reveal an item once narration reaches that fraction of the scene (everything shows while paused).
  const cue = (at: number) => !playing || elapsed > script.scenes[scene].duration * at;
  const show = (at: number) => ({ "data-on": cue(at), "aria-hidden": !cue(at) });

  function choose(option: (typeof calls)[number]["options"][number]) {
    if (done || answered[current]) return;
    setHint(option.why);
    if (!option.ok) return;
    const next = answered.map((value, i) => i === current || value);
    setAnswered(next);
    if (next.every(Boolean)) { window.setTimeout(markSolved, reduced ? 0 : 900); return; }
    setCurrent(next.findIndex(value => !value));
  }

  const call = calls[current];
  return <SceneSwap scene={scene} reduced={reduced}>
    {(scene === 0 || scene === 5) && <div className={k.device}>
      <div className={k.deviceBar}><span><BookOpen size={16} /> NANI’S HOUSE</span><span>{scene === 0 ? "Thursday · 5:30 pm" : "Thursday · 7:15 pm"}</span></div>
      <div className={`${k.deviceArt} ${r.desk}`}>
        {scene === 0 && <><div className={k.badge}><Check /> Hindi homework done</div><span className={r.ring} {...show(.85)}><PhoneCall aria-hidden="true" />Ring ring…</span></>}
        {scene === 5 && <div className={k.success}><ShieldCheck /><strong>Card fine. Code safe!</strong><span>Nani checked with the number on her card</span></div>}
      </div>
      <div className={k.deviceFoot}>{scene === 0
        ? <><Clock /><span>Nani’s phone is on the desk, next to her glasses.</span></>
        : <><span className={r.chip}><KeyRound aria-hidden="true" />OTP never shared</span><span className={r.chip}><HeartHandshake aria-hidden="true" />Mum knows</span><span className={r.chip}><Zap aria-hidden="true" />Bill already paid</span></>}</div>
    </div>}

    {scene === 1 && <div className={r.stage}>
      <div className={r.phone}>
        <div className={r.status}><span>5:42</span><span><Signal aria-hidden="true" /><BatteryMedium aria-hidden="true" /></span></div>
        <div {...show(.5)} className={r.reveal}><Sms /></div>
        <div className={r.callerBlock}><span className={r.avatar}><Landmark aria-hidden="true" /></span><strong>“Bank officer”</strong><small>+91 00000 48213 · not saved</small><span className={r.timer}>On call · 00:42</span></div>
        <div className={r.endCall}><PhoneOff aria-hidden="true" /></div>
      </div>
      <div className={r.bubbles}>
        <p className={r.them} {...show(.05)}><b>Caller</b>“Your card will be blocked today. Read me the OTP.”</p>
        <p className={r.nani} {...show(.74)}><b>Nani</b>“Four, eight…”</p>
        <p className={r.pretend}>Pretend call · example only</p>
      </div>
    </div>}

    {scene === 2 && <div className={k.panel}>
      <h2>Two calls, one pattern</h2>
      <div className={r.calls}>{calls.map(({ caller, Icon, line }, i) => <div className={r.callCard} key={caller} {...show(i ? .18 : .02)}><span className={r.avatar}><Icon aria-hidden="true" /></span><div><strong>“{caller}”</strong><span>{line}</span></div></div>)}</div>
      <div className={r.flags}>{flags.map(({ label, at }) => <div key={label} {...show(at)}><CircleAlert aria-hidden="true" /><span>{label}</span><b>Call 1 ✓</b><b>Call 2 ✓</b></div>)}</div>
      <div className={r.term} {...show(.84)}><KeyRound aria-hidden="true" /><div><strong>OTP: one-time password</strong><span>A short code that approves one payment or sign-in. Whoever has it can use it.</span></div></div>
    </div>}

    {scene === 3 && <div className={`${k.panel} ${r.task}`}>
      <h2>Answer each pretend call safely</h2>
      <div className={r.tabs}>{calls.map(({ caller }, i) => <button key={caller} type="button" aria-pressed={current === i} onClick={() => { setCurrent(i); setHint(""); }}>{safe[i] ? <Check aria-hidden="true" /> : <PhoneCall aria-hidden="true" />}Call {i + 1} · {caller}</button>)}</div>
      <div className={r.live} data-safe={safe[current]}>
        <div className={r.liveHead}><span className={r.avatar}><call.Icon aria-hidden="true" /></span><div><strong>“{call.caller}”</strong><small>{call.number} · not saved</small></div><span className={r.badge}>{safe[current] ? "Call ended" : "On call"}</span></div>
        <p className={r.line}>“{call.line}”</p>
        <Sms />
        {safe[current] && <p className={r.ended}><ShieldCheck aria-hidden="true" />Safe choice. The code stayed private.</p>}
      </div>
      <div className={r.options}>{call.options.map(option => <button key={option.label} type="button" data-trap={option.trap || undefined} disabled={done || safe[current]} onClick={() => choose(option)}>{option.label}</button>)}</div>
      <p className={k.hint} aria-live="polite">{hint || (done ? "Both calls handled safely. The OTP stayed private." : `Call ${current + 1} of 2: what should Nani do?`)}</p>
      <small>Pretend calls. Fictional numbers.</small>
    </div>}

    {scene === 4 && <div className={k.panel}>
      <h2>The OTP rule</h2>
      <p className={r.never} {...show(.02)}><KeyRound aria-hidden="true" />No real bank, electricity office or courier asks for your OTP or PIN.</p>
      {["Hang up. You don’t need to argue.", "Call the number on the card, bill or official app yourself.", "Tell a family member what happened."].map((step, i) => <div className={k.step} key={step} data-active={cue([.34, .44, .6][i])}><span><Check /></span>{step}</div>)}
      <div className={r.help} {...show(.72)}>
        <div><strong>1930</strong><span>National Cyber Crime Helpline. Call quickly if money was lost.</span></div>
        <div><Globe aria-hidden="true" /><span><b>cybercrime.gov.in</b> Report online.</span></div>
      </div>
    </div>}
  </SceneSwap>;
}

const chapter: StoryChapter = {
  script,
  title: "Tara and Nani’s tricky calls",
  icon: KeyRound,
  character: { asset: "girl-expressions", name: "Tara" },
  interactionScene: 3,
  beginLabel: "Practise with Tara",
  waitingText: "Story paused. Help Nani answer both pretend calls safely.",
  lockedHint: "Help Tara and Nani answer both calls first.",
  World,
};
export default chapter;
