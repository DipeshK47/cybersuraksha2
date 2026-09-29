"use client";

import type { LucideIcon } from "lucide-react";
import { ArrowRight, AudioLines, Ban, Cake, Check, Clapperboard, EyeOff, Flag, Hourglass, IndianRupee, KeyRound, MessageCircle, Mic, PhoneCall, PhoneForwarded, PhoneOff, Pin, Play, ShieldCheck, Sparkles, TriangleAlert, UserRound, Users, Video, Volume2 } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { SceneSwap } from "../StoryPlayer";
import type { StoryChapter, StoryWorldProps } from "../types";
import script from "./deepfake-voice-relative-scam.json";
import k from "../story-player.module.css";
import r from "./deepfake-voice-relative-scam.module.css";

// Fictional, reserved-looking numbers only.
const SCAM = "+91 00000 48213";
const UNCLE = "+91 00000 12345";
const bars = [6, 10, 15, 9, 19, 25, 13, 21, 28, 17, 11, 23, 30, 19, 12, 26, 21, 15, 9, 17, 25, 30, 22, 13, 18, 26, 15, 10, 20, 16, 11, 7];

function VoiceNote({ progress, live }: { progress: number; live: boolean }) {
  return <div className={r.voice} data-live={live} role="img" aria-label="Voice note, 18 seconds">
    <span className={r.play}>{live ? <AudioLines /> : <Play />}</span>
    <span className={r.wave}>{bars.map((h, i) => <i key={i} style={{ height: h, animationDelay: `${(i % 7) * -.13}s` }} data-on={i / bars.length < progress} />)}</span>
    <small>0:18</small>
  </div>;
}

type Row = { id: string; name: string; text: string; av: ReactNode; tone?: string; badge?: string };
const family: Row = { id: "family", name: "Family", text: "Uncle Vikram: posted a video", av: <Users /> };
const uncle: Row = { id: "uncle", name: "Uncle Vikram", text: "See you on Sunday!", av: "V", tone: "uncle" };
const papa: Row = { id: "papa", name: "Papa", text: "Home by 8", av: "P" };
const unknown: Row = { id: "unknown", name: SCAM, text: "Voice note", av: <UserRound />, tone: "warn", badge: "2" };
const rows: Record<number, [string, Row[]]> = {
  0: ["family", [family, uncle, papa, { id: "school", name: "Class 7 parents", text: "Sports day photos", av: "C" }]],
  1: ["unknown", [unknown, family, uncle, papa]],
  5: ["family", [{ ...family, text: "Mum: Dinner at 8!" }, { ...uncle, text: "I’m fine! That wasn’t me" }, { ...papa, text: "On my way" }, { ...unknown, text: "Blocked · reported", badge: undefined }]],
};

function ChatPhone({ scene, children, foot }: { scene: number; children: ReactNode; foot: ReactNode }) {
  const [active, list] = rows[scene];
  const open = list.find(row => row.id === active)!;
  return <div className={k.device}>
    <div className={k.deviceBar}><span><MessageCircle size={16} /> CHATS</span><span>Mum’s phone · pretend app</span></div>
    <div className={r.app}>
      <ul className={r.list} aria-label="Chats">{list.map(row => <li key={row.id} data-active={row.id === active}>
        <span className={r.av} data-tone={row.tone}>{row.av}</span>
        <span><strong>{row.name}</strong><small>{row.text}</small></span>
        {row.badge && <b aria-label={`${row.badge} unread`}>{row.badge}</b>}
      </li>)}</ul>
      <div className={r.thread}>
        <div className={r.head} data-tone={open.tone}><span className={r.av} data-tone={open.tone}>{open.av}</span><span><strong>{open.name}</strong><small>{scene === 1 ? "Not in your contacts" : "Mum, Papa, Kabir, Uncle Vikram"}</small></span></div>
        {children}
      </div>
    </div>
    <div className={k.deviceFoot}>{foot}</div>
  </div>;
}

type Choice = { id: string; label: string; icon: LucideIcon; ok?: boolean; trap?: boolean; why?: string };
const replies: Choice[] = [
  { id: "pass", label: "What’s our family passphrase?", icon: KeyRound, ok: true },
  { id: "pay", label: "It’s his voice, send the money", icon: IndianRupee, trap: true, why: "It really does sound like him, but a voice can be copied from a short video. Check who it is first." },
  { id: "birthday", label: "What’s your birthday?", icon: Cake, why: "Birthdays are often easy to find online. Ask for something only your family knows." },
];
const moves: Choice[] = [
  { id: "pay", label: "It’s his voice, send the money", icon: IndianRupee, trap: true, why: "He dodged the passphrase. A copied voice can sound perfect, so the voice alone can’t prove who’s asking." },
  { id: "unknown", label: "Call back the unknown number", icon: PhoneForwarded, why: "That only reaches whoever sent the note. Use the number already saved in Mum’s phone." },
  { id: "saved", label: "Call Uncle Vikram’s saved number", icon: PhoneCall, ok: true },
];
const prompts = ["Pick Mum’s reply. What could only the real Uncle Vikram answer?", "The voice dodged the passphrase. Pick Mum’s next move.", "The real Uncle Vikram answered on his saved number."];

function World({ scene, playing, elapsed, solved, markSolved, hint, setHint, reduced }: StoryWorldProps) {
  const [step, setStep] = useState(0);
  const view = solved ? 2 : step;
  const at = (fraction: number) => !playing || elapsed >= fraction * (script.scenes[scene].duration || 18);
  function choose(choice: Choice) {
    if (solved || step > 1) return;
    if (!choice.ok) { setHint(choice.why ?? "", false); return; }
    setHint(""); setStep(value => value + 1);
  }
  const voiceProgress = playing ? Math.min(1, elapsed / ((script.scenes[1].duration || 20) * .72)) : 1;

  return <SceneSwap scene={scene} reduced={reduced}>
    {scene === 0 && <ChatPhone scene={0} foot={<><KeyRound /><span>Family passphrase: <b>agreed</b></span><small>Said out loud, never posted</small></>}>
      <div className={r.pin} data-on={at(.55)}><Pin /><span><strong>Pinned:</strong> We have a family passphrase. Say it out loud, never type it here.</span></div>
      <ol className={r.msgs}>
        <li><small>Papa</small>Who’s winning at carrom? 😄</li>
        <li data-from="out">Kabir is! I want a rematch 🎯</li>
        <li data-on={at(.24)}><small>Uncle Vikram</small>
          <div className={r.video}><span className={r.thumb}><Clapperboard /><em>0:15</em></span><span><strong>Vikram’s Kitchen: one-minute dal</strong><span>Public video · 15 seconds</span></span></div>
        </li>
      </ol>
    </ChatPhone>}

    {scene === 1 && <ChatPhone scene={1} foot={<><Mic /><span>New voice note from an unknown number</span><small>Pretend number · example only</small></>}>
      <ol className={r.msgs}>
        <li data-from="sys" data-tone="warn"><TriangleAlert />This number isn’t saved in your contacts</li>
        <li><VoiceNote progress={voiceProgress} live={playing && !reduced} /></li>
        <li data-on={at(.3)} className={r.transcript}><small>Auto-transcript</small><em>“Didi, it’s me, Vikram… there’s been an accident. My phone broke. I’m on a friend’s phone.”</em></li>
        <li data-on={at(.52)}>Send <b>₹20,000</b> to this number now. Don’t tell anyone. Please hurry 🙏</li>
      </ol>
    </ChatPhone>}

    {scene === 2 && <div className={k.panel}>
      <h2>How a voice gets copied</h2>
      <div className={r.pipeline}>
        <div data-on={at(.14)}><Video /><strong>Public video</strong><span>a few seconds</span></div>
        <ArrowRight aria-hidden="true" />
        <div data-on={at(.24)}><Sparkles /><strong>AI voice copy</strong><span>learns the sound</span></div>
        <ArrowRight aria-hidden="true" />
        <div data-on={at(.34)}><Mic /><strong>Fake voice note</strong><span>says anything</span></div>
      </div>
      <div className={r.label}>Clues in this message</div>
      <div className={r.clues}>
        {([[UserRound, "An unknown number, not his saved one", .45], [Hourglass, "A rush: “send it now”", .51], [EyeOff, "Secrecy: “don’t tell anyone”", .56]] as const).map(([Icon, text, f]) => <div className={k.step} key={text} data-active={at(f)}><span><Icon /></span>{text}</div>)}
      </div>
      <div className={r.verdict} data-on={at(.64)}>One clue alone doesn’t prove a scam. Together, they mean: stop and check.</div>
      <div className={r.passCard} data-on={at(.86)}><KeyRound /><div><strong>The family passphrase</strong><span>A copied voice can’t know it</span></div><span className={r.dots} aria-label="hidden">••••••</span></div>
    </div>}

    {scene === 3 && <div className={`${k.panel} ${r.task}`}>
      <h2>Who’s really asking?</h2>
      <ol className={r.progress} aria-label="Task steps">{["Reply", "Next move", "Call"].map((label, i) => <li key={label} data-state={i < view ? "done" : i === view ? "now" : "todo"} aria-current={i === view ? "step" : undefined}><span>{i < view ? <Check /> : i + 1}</span>{label}</li>)}</ol>
      {view < 2 ? <>
        <ol className={r.mini} aria-label={`Chat with ${SCAM}`}>
          <li><VoiceNote progress={1} live={false} /></li>
          <li>Send <b>₹20,000</b> now. Don’t tell anyone 🙏</li>
          {view >= 1 && <li data-from="out" className={k.fitIn}>What’s our family passphrase?</li>}
          {view >= 1 && <li className={k.fitIn}>No time for games, Didi! Just send it, please!<em className={r.dodge}><TriangleAlert />Dodged the passphrase</em></li>}
        </ol>
        <div className={`${k.bank} ${r.choices}`}>{(view === 0 ? replies : moves).map(choice => <button key={choice.id} data-trap={choice.trap ? "true" : undefined} onClick={() => choose(choice)} type="button"><choice.icon aria-hidden="true" />{choice.label}</button>)}</div>
      </> : <>
        <div className={r.call} data-ended={solved}>
          <span className={r.callAvatar}>V</span>
          <div className={r.callWho}><strong>Uncle Vikram</strong><span>Saved contact · {UNCLE}</span><b><PhoneCall />{solved ? "Call ended · 01:12" : "Connected · 00:06"}</b></div>
          <div className={r.callLine}>“Kabir? I’m fine! I’m at work, and my phone’s right here. What accident?”</div>
          <div className={r.keys} aria-hidden="true"><span><Mic /></span><span><Volume2 /></span><span><PhoneOff /></span></div>
        </div>
      </>}
      <p className={k.hint} aria-live="polite">{hint || (solved ? "Checked. Uncle Vikram is safe, and no money was sent." : prompts[view])}</p>
      {view === 2 && <div className={k.actions}><button className={k.primary} disabled={solved} onClick={markSolved} type="button">{solved ? <><Check />Checked. No money sent</> : <>He’s safe. Don’t pay <ArrowRight /></>}</button></div>}
      <small>Pretend chat and numbers. Example only.</small>
    </div>}

    {scene === 4 && <div className={k.panel}>
      <div className={r.callDone}><span className={r.callAvatar}>V</span><div><strong>Uncle Vikram · saved contact</strong><span>“I’m fine! My phone was never broken.”</span></div><b><ShieldCheck />Safe</b></div>
      <h2>How the family beat a cloned voice</h2>
      <div className={r.clues}>
        {([[KeyRound, "Asked for the passphrase, then called his saved number", 0], [Ban, "Blocked the number and reported it at cybercrime.gov.in", .38], [Flag, "If money is ever sent, call 1930 straight away", .6], [EyeOff, "The passphrase stays offline: said aloud, never typed", .76]] as const).map(([Icon, text, f]) => <div className={k.step} key={text} data-active={at(f)}><span><Icon /></span>{text}</div>)}
      </div>
      <small>1930 is India’s National Cyber Crime Helpline. Reports can also be made at cybercrime.gov.in.</small>
    </div>}

    {scene === 5 && <ChatPhone scene={5} foot={<><ShieldCheck /><span>No money sent. Everyone’s safe.</span><small>Example chat · pretend numbers</small></>}>
      <ol className={r.msgs}>
        <li data-from="sys"><ShieldCheck />Unknown number blocked and reported</li>
        <li><small>Uncle Vikram</small>That voice note wasn’t me! I’m fine 🙏</li>
        <li data-on={at(.1)}><small>Uncle Vikram</small>Proud of you for checking, Kabir. Carrom rematch tonight?</li>
        <li data-from="out" data-on={at(.16)}>Dinner at 8. Bring samosas! 🥟</li>
      </ol>
    </ChatPhone>}
  </SceneSwap>;
}

const chapter: StoryChapter = {
  script,
  title: "Kabir and the copied voice",
  icon: AudioLines,
  character: { asset: "emotional-avatar", name: "Kabir" },
  interactionScene: 3,
  beginLabel: "Practise with Kabir",
  waitingText: "Story paused. Help Kabir and Mum check who’s really asking.",
  lockedHint: "Help Kabir and Mum check the voice note first.",
  World,
};
export default chapter;
