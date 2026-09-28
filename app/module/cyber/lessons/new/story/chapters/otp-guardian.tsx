"use client";

import { AlertTriangle, ArrowRight, BadgeCheck, BatteryMedium, BookOpen, Check, Coffee, CreditCard, Grid3x3, House, IdCard, KeyRound, Landmark, LockKeyhole, MessageSquareText, MicOff, PhoneCall, PhoneIncoming, PhoneOff, Receipt, ShieldCheck, Signal, Smartphone, Timer, UserRound, Volume2, Wifi, Zap } from "lucide-react";
import { useState } from "react";
import { SceneSwap } from "../StoryPlayer";
import type { StoryChapter, StoryWorldProps } from "../types";
import script from "./otp-guardian.json";
import k from "../story-player.module.css";
import r from "./otp-guardian.module.css";

type Choice = "share" | "id" | "card" | "bill";
const calls = [
  { who: "“Bank officer”", Icon: Landmark, number: "+91 00000 31427", line: "Your card will be blocked today. Share the OTP to verify.", answer: "card", done: "Bank call ended. Nani will check using the number on her card. Now the second call." },
  { who: "“Electricity office”", Icon: Zap, number: "+91 00000 58210", line: "Your power will be cut tonight. Tell me the code now.", answer: "bill", done: "" },
] as const;
const choices: { id: Choice; label: string; Icon: typeof Zap }[] = [
  { id: "share", label: "Share the OTP to verify", Icon: MessageSquareText },
  { id: "id", label: "Ask for a staff ID, then share the OTP", Icon: IdCard },
  { id: "card", label: "Refuse, hang up, and call the number on the card", Icon: CreditCard },
  { id: "bill", label: "Refuse, hang up, and call the number on the electricity bill", Icon: Receipt },
];
const whyNot: Record<Choice, string> = {
  share: "Stop! The OTP is a private key code. It could approve a payment from Nani’s card. No real bank or office ever asks for it.",
  id: "Anyone can make up a name or a staff ID. The OTP stays private, whoever asks.",
  card: "Good refusal! But the bank can’t check the power supply. Use the number printed on the electricity bill.",
  bill: "Good refusal! But the electricity office can’t check a bank card. Use the number printed on Nani’s card.",
};
const bankLines = [["I’m a bank officer.", 0], ["Your card will be blocked today!", .15], ["Read me the OTP. Quickly!", .28]] as const;
const clues = [[Timer, "A rush: “today!” and “tonight!”", .56], [BadgeCheck, "An official-sounding title", .64], [KeyRound, "A request for the code", .73]] as const;
const keySteps = [[LockKeyhole, "It unlocks one thing, like a payment", .29], [KeyRound, "Whoever has it can use it", .5], [ShieldCheck, "No real bank or office asks for it", .62]] as const;

function World({ scene, playing, elapsed, solved, markSolved, hint, setHint, reduced }: StoryWorldProps) {
  const [handled, setHandled] = useState(0);
  const done = solved ? 2 : handled;
  // Reveal a beat once narration reaches that fraction of the scene; everything shows when paused.
  const show = (at: number) => !playing || elapsed >= script.scenes[scene].duration * at;
  function choose(id: Choice) {
    if (solved || handled > 1) return;
    if (id === calls[handled].answer) { setHandled(handled + 1); setHint(""); return; }
    setHint(whyNot[id]);
  }
  const call = calls[Math.min(done, 1)];
  return <SceneSwap scene={scene} reduced={reduced}>
    {(scene === 0 || scene === 5) && <div className={k.device}>
      <div className={k.deviceBar}><span><House size={16} /> NANI’S HOUSE</span><span>{scene === 0 ? "After school" : "Evening, all calm"}</span></div>
      <div className={`${k.deviceArt} ${r.desk}`}>
        {scene === 0 && <div className={k.badge}><Coffee /> Homework and ginger tea</div>}
        {scene === 0 && show(.46) && <div className={`${r.notice} ${k.fitIn}`}>
          <span><MessageSquareText /> Messages · now</span>
          <strong>Cyberpur Bank</strong>
          <span>OTP <b>482913</b> to approve a payment of ₹4,999. Do not share it with anyone.</span>
        </div>}
        {scene === 5 && <div className={k.success}><ShieldCheck /><strong>Card safe. Power on.</strong><span>Checked on the numbers printed on the card and the bill</span></div>}
      </div>
      <div className={k.deviceFoot}>{scene === 5
        ? <><CreditCard /><span>Card: fine</span><Zap /><span>Power: fine</span><small>The OTP was never shared</small></>
        : show(.72) ? <><PhoneIncoming className={r.ring} /><span>Incoming call <b>+91 00000 31427</b></span><small>Unknown number · pretend call</small></>
          : <><BookOpen /><span>Tara’s maths homework</span><small>Nani’s desk</small></>}</div>
    </div>}

    {scene === 1 && <div className={r.callScene}>
      <div className={r.phone} role="img" aria-label="Pretend call screen: an unknown number says it is a bank officer and asks for the OTP">
        <div className={r.status}><span>4:32</span><span><Signal /><Wifi /><BatteryMedium /></span></div>
        <div className={r.caller}><span className={r.avatar}><UserRound /></span><strong>“Bank officer”</strong><small>+91 00000 31427 · Unknown</small><em>Pretend call · 00:24</em></div>
        <div className={r.lines}>{bankLines.map(([line, at]) => show(at) && <span className={k.fitIn} key={line}>{line}</span>)}</div>
        <div className={r.controls}><span><MicOff /></span><span><Grid3x3 /></span><span><Volume2 /></span><span data-end="true"><PhoneOff /></span></div>
      </div>
      <div className={r.sms}>
        <div className={r.smsHead}><Smartphone /><div><strong>Cyberpur Bank</strong><small>Text message · 4:31 pm</small></div></div>
        <div className={r.bubble}>OTP <b>482913</b> to approve a payment of ₹4,999 on your card. <mark>Do not share this code with anyone.</mark></div>
        <div className={r.clash} data-on={show(.55)}><AlertTriangle /><span>The caller says the code will <b>stop a block</b>. The message says it <b>approves a payment</b>.</span></div>
        <small className={k.note}>Example only: pretend bank, number and code.</small>
      </div>
    </div>}

    {scene === 2 && <div className={k.panel}>
      <h2>Two callers. The same trick.</h2>
      <div className={r.pair}>
        <div className={r.mini} data-state="hold"><span><Landmark /> Call 1 · on hold</span><strong>“Bank officer”</strong><em>“Card blocked today! Read me the OTP.”</em></div>
        <div className={`${r.mini} ${k.fitIn}`} data-state="live"><span><Zap /> Call 2 · on the line</span><strong>“Electricity office”</strong><em>“Power cut tonight! Tell me the code.”</em></div>
      </div>
      {clues.map(([Icon, text, at]) => <div className={k.step} key={text} data-active={show(at)}><span><Icon /></span>{text}</div>)}
      <div className={r.term} data-on={show(.82)}><KeyRound /><span><b>OTP</b> = one-time password, a private key code</span></div>
    </div>}

    {scene === 3 && <div className={k.panel}>
      <h2>Answer each pretend call</h2>
      <ol className={r.queue} aria-label="Pretend calls">
        {calls.map(({ who, Icon }, i) => <li key={who} data-state={i < done ? "done" : i === done ? "live" : "hold"}>
          <Icon aria-hidden="true" /><span><b>{who}</b><small>{i < done ? "Ended · OTP kept" : i === done ? "On the line" : "On hold"}</small></span>{i < done && <Check aria-label="Handled safely" />}
        </li>)}
      </ol>
      {done < 2 ? <div className={r.live} key={done}>
        <span className={r.avatar}><call.Icon aria-hidden="true" /></span>
        <div><strong>{call.who}</strong><small>{call.number} · Unknown number</small><span>“{call.line}”</span></div>
      </div> : <div className={`${r.live} ${r.ended}`}>
        <span className={r.avatar}><ShieldCheck aria-hidden="true" /></span>
        <div><strong>Both calls ended</strong><small>Nani will call the numbers she already has:</small><span>Card <b>+91 00000 11122</b> · Bill <b>+91 00000 22233</b></span></div>
      </div>}
      <div className={r.choices} role="group" aria-label={`Nani’s answer to call ${Math.min(done + 1, 2)}`}>
        {choices.map(({ id, label, Icon }) => <button key={id} data-trap={id === "share" || undefined} aria-pressed={solved || handled > 1 ? calls.some(c => c.answer === id) : undefined} disabled={done > 1} onClick={() => choose(id)} type="button"><Icon aria-hidden="true" />{label}</button>)}
      </div>
      <p className={k.hint} aria-live="polite">{hint || (done === 0 ? "Read what the caller wants. Then choose Nani’s answer." : done === 1 ? calls[0].done : "Both calls ended, and the OTP stayed private.")}</p>
      <div className={k.actions}><button className={k.primary} disabled={done < 2 || solved} onClick={markSolved} type="button">Check with official numbers <ArrowRight /></button></div>
      <small>Pretend calls. All numbers are examples.</small>
    </div>}

    {scene === 4 && <div className={k.panel}>
      <div className={r.hungUp}><PhoneOff /> Both calls ended · code kept private</div>
      <h2>An OTP is a key code</h2>
      <div className={r.keyFlow} data-on={show(.15)}><span className={r.code}>482913</span><ArrowRight aria-hidden="true" /><span className={r.lock}><LockKeyhole /> Approves ₹4,999</span></div>
      {keySteps.map(([Icon, text, at]) => <div className={k.step} key={text} data-active={show(at)}><span><Icon /></span>{text}</div>)}
      <div className={r.help} data-on={show(.8)}><PhoneCall /><div><strong>Money lost? Act fast, with an adult.</strong><span>Call the helpline <b>1930</b> and report at <b>cybercrime.gov.in</b></span></div></div>
    </div>}
  </SceneSwap>;
}

const chapter: StoryChapter = {
  script,
  title: "Tara and the urgent calls",
  icon: Smartphone,
  character: { asset: "girl-expressions", name: "Tara" },
  interactionScene: 3,
  beginLabel: "Practise with Tara",
  waitingText: "Story paused. Answer both calls to see what happens next.",
  lockedHint: "Help Tara and Nani answer both calls first.",
  World,
};
export default chapter;
