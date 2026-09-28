"use client";

import { AudioLines, Ban, BrainCircuit, Check, Globe, KeyRound, Lock, MessageCircle, Phone, PhoneCall, Pin, Play, ShieldCheck, TrainFront, Users, Video } from "lucide-react";
import { useState } from "react";
import { SceneSwap } from "../StoryPlayer";
import type { StoryChapter, StoryWorldProps } from "../types";
import script from "./deepfake-voice-relative-scam.json";
import k from "../story-player.module.css";
import r from "./deepfake-voice-relative-scam.module.css";

const lines = ["“I’ve had an accident…”", "“My phone is broken, this is a friend’s.”", "“Send ₹20,000 right now for the hospital.”", "“Don’t tell anyone.”"];
const steps = [
  {
    ask: "Reply to the voice note",
    options: [
      { label: "Send ₹20,000 now. It’s definitely his voice", ok: false, trap: true, why: "A voice can be cloned from a few seconds of video. Sounding like Chacha isn’t proof. Verify first." },
      { label: "Ask: “What’s our family passphrase?”", ok: true, why: "Good: only the real Chacha knows it. Let’s see how the sender answers." },
      { label: "Ask: “Which hospital are you in?”", ok: false, why: "A scammer can invent a hospital name in seconds. Ask for something only the real Chacha knows: the passphrase." },
    ],
  },
  {
    ask: "The sender dodged the passphrase. Now what?",
    options: [
      { label: "Maybe he forgot. Send half, just in case", ok: false, trap: true, why: "The real Chacha would know it, and panic is no reason to skip it. Dodging the passphrase is a red flag." },
      { label: "Call back the number the voice note came from", ok: false, why: "That number belongs to whoever sent the note. Call the number you saved for Chacha yourself." },
      { label: "Call Chacha on his saved number", ok: true, why: "Chacha answers: he’s fine, having breakfast at his hotel!" },
    ],
  },
];

function Wave({ n = 28 }: { n?: number }) {
  return <span className={r.wave} aria-hidden="true">{Array.from({ length: n }, (_, i) => <i key={i} style={{ height: 4 + ((i * 7) % 13) }} />)}</span>;
}

function World({ scene, playing, elapsed, solved, markSolved, hint, setHint, reduced }: StoryWorldProps) {
  const [step, setStep] = useState(0);
  const [passing, setPassing] = useState(false);
  const done = solved || passing;
  const at = solved ? 2 : step;
  // Reveal an item once narration reaches that fraction of the scene (everything shows while paused).
  const cue = (at: number) => !playing || elapsed > script.scenes[scene].duration * at;
  const show = (at: number) => ({ "data-on": cue(at), "aria-hidden": !cue(at) });

  function choose(option: (typeof steps)[number]["options"][number]) {
    if (done) return;
    setHint(option.why);
    if (!option.ok) return;
    if (step === 0) { setStep(1); return; }
    setStep(2); setPassing(true);
    window.setTimeout(markSolved, reduced ? 0 : 900);
  }

  return <SceneSwap scene={scene} reduced={reduced}>
    {(scene === 0 || scene === 5) && <div className={k.device}>
      <div className={k.deviceBar}><span><Users size={16} /> FAMILY GROUP</span><span>12 members · pretend app</span></div>
      <div className={`${k.deviceArt} ${r.chat}`}>
        {scene === 0 ? <>
          <div className={r.pinned} {...show(.55)}><Pin aria-hidden="true" /><span><b>Family passphrase</b> ● ● ● ● ● · ask in person, never type it here</span></div>
          <div className={r.msg}><small>Sameer Chacha</small><div className={r.video}><TrainFront aria-hidden="true" /><Play aria-hidden="true" /><span>Street food at the old market! · 0:42</span></div></div>
          <div className={r.msg} {...show(.28)}><small>Sameer Chacha</small><div className={r.video}><Video aria-hidden="true" /><Play aria-hidden="true" /><span>Night train, window seat · 1:05</span></div></div>
          <div className={r.msg} data-me="true" {...show(.4)}><small>Mum</small><p>Looks yummy! Bring us some sweets!</p></div>
          <div className={r.msg} {...show(.46)}><small>Dad</small><p>Safe travels, Sameer. Call when you reach the hotel.</p></div>
        </> : <>
          <div className={r.callTile}><Video aria-hidden="true" /><div><strong>Chacha · video call</strong><span>“I’m fine! Nobody’s sending anyone money.”</span></div></div>
          <div className={r.msg} data-me="true"><small>Kabir</small><p>Nani, here’s how we check: passphrase, then call back on the saved number.</p></div>
          <div className={r.setting}><Lock aria-hidden="true" /><span>Chacha’s travel videos: <b>friends only</b></span></div>
        </>}
      </div>
      <div className={k.deviceFoot}>{scene === 0 ? <><KeyRound /><span>A secret passphrase, known only to the family</span></> : <><span className={r.chip}><ShieldCheck aria-hidden="true" />No money sent</span><span className={r.chip}><Ban aria-hidden="true" />Number blocked</span><span className={r.chip}><Globe aria-hidden="true" />Reported online</span></>}</div>
    </div>}

    {scene === 1 && <div className={r.dark}>
      <div className={r.head}><MessageCircle aria-hidden="true" /><strong>+91 00000 90417</strong><small>not saved</small></div>
      <div className={r.note}><Play aria-hidden="true" /><Wave /><small>0:24</small></div>
      <div className={r.lines}>{lines.map((line, i) => <p key={line} {...show(.14 + i * .14)}>{line}</p>)}</div>
      <div className={r.payPeek} {...show(.8)}><span>Payment app</span><strong>Pay ₹20,000?</strong></div>
      <span className={r.pretend}>Pretend voice note · example only</span>
    </div>}

    {scene === 2 && <div className={k.panel}>
      <div className={r.term} {...show(.3)}><AudioLines aria-hidden="true" /><div><strong>Voice cloning</strong><span>AI copying someone’s voice from a few seconds of recordings.</span></div></div>
      <div className={r.clone} {...show(.18)}><span><Video aria-hidden="true" />Chacha’s public videos</span><i>→</i><span><BrainCircuit aria-hidden="true" />AI copies the voice</span><i>→</i><span><AudioLines aria-hidden="true" />A fake voice note</span></div>
      <h2>The real clues</h2>
      <div className={r.clues}>{["New number", "Panic", "Secrecy", "Money, now"].map((clue, i) => <span key={clue} {...show(.66 + i * .05)}>{clue}</span>)}</div>
      <p className={r.plan} {...show(.9)}><KeyRound aria-hidden="true" />The family plan: ask for the passphrase, then call back on a saved number.</p>
    </div>}

    {scene === 3 && <div className={`${k.panel} ${r.task}`}>
      <h2>Verify before anyone pays</h2>
      <div className={r.thread}>
        <div className={r.theirs}><Play aria-hidden="true" /><Wave n={18} /><small>“Send ₹20,000 now. Don’t tell anyone.”</small></div>
        {at >= 1 && <div className={r.mine}>What’s our family passphrase?</div>}
        {at >= 1 && <div className={r.theirs}><span>No time for games!! Just send the money, please!</span></div>}
        {at >= 2 && <div className={r.calling}><PhoneCall aria-hidden="true" /><div><strong>Sameer Chacha · saved contact</strong><span>“I’m fine! I’m having breakfast at my hotel.”</span></div><Check aria-hidden="true" /></div>}
      </div>
      {at < 2 && <div className={r.options}><small>{steps[at].ask}</small>{steps[at].options.map(option => <button key={option.label} type="button" data-trap={option.trap || undefined} disabled={done} onClick={() => choose(option)}>{option.ok && at === 1 ? <Phone aria-hidden="true" /> : null}{option.label}</button>)}</div>}
      <p className={k.hint} aria-live="polite">{hint || (done ? "Chacha answers: he’s fine, having breakfast at his hotel!" : at === 0 ? "Step 1 of 2: how should Dad reply?" : "Step 2 of 2: the passphrase check failed.")}</p>
      <small>Pretend messages. Fictional numbers. Never type your real family passphrase in a chat.</small>
    </div>}

    {scene === 4 && <div className={k.panel}>
      <h2>A familiar voice isn’t proof</h2>
      <div className={r.calling} {...show(.02)}><PhoneCall aria-hidden="true" /><div><strong>Sameer Chacha · saved contact</strong><span>Safe, and a little shaken</span></div><Check aria-hidden="true" /></div>
      {["Block the number", "Report at cybercrime.gov.in", "If money was paid, call 1930 at once"].map((text, i) => <div className={k.step} key={text} data-active={cue([.3, .38, .5][i])}><span><Check /></span>{text}</div>)}
      <p className={r.plan} {...show(.78)}><KeyRound aria-hidden="true" />Ask for the passphrase, and call back on a number you saved yourself.</p>
    </div>}
  </SceneSwap>;
}

const chapter: StoryChapter = {
  script,
  title: "Kabir and the cloned voice",
  icon: AudioLines,
  character: { asset: "emotional-avatar", name: "Kabir" },
  interactionScene: 3,
  beginLabel: "Practise with Kabir",
  waitingText: "Story paused. Verify the voice note before anyone pays.",
  lockedHint: "Help Kabir and Dad verify the voice note first.",
  World,
};
export default chapter;
