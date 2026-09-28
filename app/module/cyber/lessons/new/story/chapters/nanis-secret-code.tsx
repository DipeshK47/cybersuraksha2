"use client";

import { Check, Grid3x3, Hash, House, KeyRound, Landmark, LockKeyhole, MessageSquareText, MicOff, Package, PhoneIncoming, PhoneOff, ShieldBan, ShieldCheck, Smartphone, TriangleAlert, Trophy, UsersRound, Volume2 } from "lucide-react";
import { useState } from "react";
import { SceneSwap } from "../StoryPlayer";
import type { StoryChapter, StoryWorldProps } from "../types";
import script from "./nanis-secret-code.json";
import k from "../story-player.module.css";
import r from "./nanis-secret-code.module.css";

const code = "482716";

function Sms({ highlight }: { highlight?: boolean }) {
  return <span className={r.smsText}><b>{code}</b> is your one-time code. <mark data-on={highlight ?? false}>Do not share it with anyone.</mark></span>;
}

function Caller({ ended }: { ended: boolean }) {
  return <div className={r.caller}>
    <span className={r.callerAvatar} data-ended={ended}><Package aria-hidden="true" /></span>
    <div><strong>Parcel Helpdesk?</strong><span>{ended ? "Call ended · number blocked" : "+91 00000 12345 · Pretend call"}</span></div>
    <span className={r.timer} data-ended={ended}>{ended ? "Blocked" : "00:41"}</span>
  </div>;
}

function World({ scene, playing, elapsed, solved, markSolved, hint, setHint, reduced }: StoryWorldProps) {
  const [blocked, setBlocked] = useState(false);
  const ended = blocked || solved;
  // Reveal an item once narration reaches that fraction of the scene (everything shows while paused).
  const cue = (at: number) => !playing || elapsed > script.scenes[scene].duration * at;
  const on = (at: number) => ({ "data-on": cue(at), "aria-hidden": !cue(at) });

  function readCode() {
    if (ended) return;
    setHint("Wait! That code is a key to Nani’s bank account. Real helpers never ask for it. Tap the shield instead.");
  }
  function block() {
    if (ended) return;
    setBlocked(true); setHint("");
  }
  function tellMum() {
    if (solved) return;
    if (!ended) { setHint("End the call first, so the caller can’t listen. Tap the big shield."); return; }
    setHint(""); markSolved();
  }

  return <SceneSwap scene={scene} reduced={reduced}>
    {(scene === 0 || scene === 5) && <div className={k.device}>
      <div className={k.deviceBar}><span><House size={16} /> NANI’S HOUSE</span><span>{scene === 0 ? "Sunday evening" : "All safe"}</span></div>
      <div className={`${k.deviceArt} ${r.desk}`}>
        <div className={k.badge}><Trophy /> Carrom: Nani {scene === 0 ? 3 : 4} · Rohan 1</div>
        {scene === 0 && <>
          <div className={r.notif} {...on(.46)}>
            <span className={r.appIcon}><MessageSquareText aria-hidden="true" /></span>
            <div><small>Cyberpur Bank · now</small><Sms /></div>
          </div>
          <div className={r.ring} data-reduced={reduced} {...on(.8)}><PhoneIncoming aria-hidden="true" /><div><strong>Incoming call</strong><span>+91 00000 12345</span></div></div>
        </>}
        {scene === 5 && <div className={k.success}><ShieldCheck /><strong>Code kept secret!</strong><span>Call blocked · Mum told · bank app checked</span></div>}
      </div>
      <div className={k.deviceFoot}>{scene === 0
        ? <><Smartphone /><span>Nani’s phone is buzzing.</span><small>Pretend story · example code</small></>
        : <><Landmark /><span>Nani checked her bank app with Mum.</span><small>Everything is safe</small></>}</div>
    </div>}

    {scene === 1 && <div className={k.device}>
      <div className={k.deviceBar}><span><Smartphone size={16} /> NANI’S PHONE</span><span>Pretend call</span></div>
      <div className={r.callBody}>
        <div className={r.smsBanner}><MessageSquareText aria-hidden="true" /><span><small>Cyberpur Bank · 1 min ago</small><Sms /></span></div>
        <Caller ended={false} />
        <div className={r.bubbles}>
          <p className={r.them} {...on(.03)}>“Hello, Nani! Your parcel is waiting. Just read me the code.”</p>
          <p className={r.nani} {...on(.58)}><span className={r.avatar}>N</span>“Oh! Let me find my glasses…”</p>
        </div>
        <div className={r.callKeys} aria-hidden="true"><span><MicOff /></span><span><Grid3x3 /></span><span><Volume2 /></span><span data-end="true"><PhoneOff /></span></div>
      </div>
      <div className={k.deviceFoot}><TriangleAlert /><span>The caller wants Nani’s secret code.</span><small>Example only</small></div>
    </div>}

    {scene === 2 && <div className={k.panel}>
      <div className={r.quote}><span>Rohan’s teacher</span><p>“Secret codes stay secret.”</p></div>
      <h2>Why Rohan says “Wait!”</h2>
      <div className={k.step} data-active={cue(.15)}><span><KeyRound /></span>A code on a phone works like a key.</div>
      <div className={k.step} data-active={cue(.45)}><span><ShieldBan /></span>Real parcel companies, banks and offices never ask for it.</div>
      <div className={r.smsCard} data-on={cue(.76)}>
        <small><MessageSquareText aria-hidden="true" /> Cyberpur Bank · Message</small>
        <Sms highlight={cue(.76)} />
      </div>
      <small>Example message. The code is pretend.</small>
    </div>}

    {scene === 3 && <div className={k.panel}>
      <h2>Keep Nani’s code secret</h2>
      <p>Tap the big shield to end the call. Then tell Mum.</p>
      <div className={r.miniCall} data-ended={ended}>
        <Caller ended={ended} />
        {!ended && <p className={r.them}>“Quick, Nani! Read me the six numbers!”</p>}
        {ended && !solved && <p className={`${r.quiet} ${k.fitIn}`}><ShieldCheck aria-hidden="true" />The line is quiet. The code stayed on Nani’s phone.</p>}
        {solved && <p className={`${r.mum} ${k.fitIn}`}><span className={r.avatar} data-mum="true">M</span>“Thank you for telling me! Let’s check Nani’s bank app together.”</p>}
      </div>
      <div className={r.controls}>
        <button className={r.readCode} data-trap="true" onClick={readCode} disabled={ended} type="button"><MessageSquareText aria-hidden="true" />Read the code</button>
        <button className={r.shield} onClick={block} disabled={ended} aria-pressed={ended} type="button">
          <span className={r.shieldDisc} data-live={!ended && !reduced}>{ended ? <Check aria-hidden="true" /> : <ShieldBan aria-hidden="true" />}</span>
          <span>{ended ? "Call blocked" : "Block call"}</span>
        </button>
        <button className={r.tellMum} data-ready={ended && !solved} onClick={tellMum} disabled={solved} type="button"><UsersRound aria-hidden="true" />{solved ? "Mum knows" : "Tell Mum"}</button>
      </div>
      <p className={k.hint} aria-live="polite">{hint || (solved ? "Done! The code stayed secret, and Mum knows what happened." : ended ? "Call blocked! Now tell Mum what happened." : "The caller sounds kind. But he wants Nani’s secret code.")}</p>
      <small>Pretend call for practice. The code and number are examples.</small>
    </div>}

    {scene === 4 && <div className={k.panel}>
      <div className={r.quote}><span>Mum</span><p>“You both did the right thing.”</p></div>
      <h2>Secret numbers stay private</h2>
      <div className={r.secret} {...on(.12)}><Hash aria-hidden="true" /><div><strong>OTP · one-time password</strong><span>The code that comes in a message.</span></div><LockKeyhole aria-hidden="true" /></div>
      <div className={r.secret} {...on(.32)}><KeyRound aria-hidden="true" /><div><strong>PIN · secret number</strong><span>For bank cards and payments.</span></div><LockKeyhole aria-hidden="true" /></div>
      <div className={r.rule} {...on(.64)}><PhoneOff aria-hidden="true" /><div><strong>Call feels wrong? Hang up.</strong><span>Tell a grown-up. They can call the number printed on the card.</span></div></div>
      <small>For grown-ups: no real bank, courier or office asks for an OTP or PIN. If money is ever lost, call 1930 quickly or report at cybercrime.gov.in.</small>
    </div>}
  </SceneSwap>;
}

const chapter: StoryChapter = {
  script,
  title: "Nani’s secret code",
  icon: ShieldCheck,
  character: { asset: "boy-emotions", name: "Rohan" },
  interactionScene: 3,
  beginLabel: "Practise with Rohan",
  waitingText: "Story paused. Block the call and tell Mum to see what happens next.",
  lockedHint: "Help Rohan block the call and tell Mum first.",
  World,
};
export default chapter;
