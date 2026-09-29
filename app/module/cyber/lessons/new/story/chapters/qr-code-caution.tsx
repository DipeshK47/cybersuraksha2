"use client";

import { ArrowDownLeft, ArrowRight, ArrowUpRight, BadgeCheck, BatteryMedium, BookOpen, Check, CircleX, KeyRound, MessageCircle, Palette, QrCode, ScanLine, Share2, ShieldAlert, ShieldCheck, Signal, Store, UserRound, Wallet, Wifi } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { SceneSwap } from "../StoryPlayer";
import type { StoryChapter, StoryWorldProps } from "../types";
import script from "./qr-code-caution.json";
import k from "../story-player.module.css";
import r from "./qr-code-caution.module.css";

// Zero-width space lets narrow screens wrap the ID before "@".
const SHOP_ID = "taramum.books\u200B@cyberpur";
const BUYER_ID = "bookbuyer.77@cyberpur";

type Option = { id: string; label: string; Icon: typeof Check; trap?: boolean; why?: string };
const tasks: { q: string; answer: string; done: string; options: Option[] }[] = [
  { q: "Read the pretend screen. Which way would the money go?", answer: "out", done: "Yes! “Pay” means the money would leave Mum’s account. Now, what should Tara do?", options: [
    { id: "in", label: "From the buyer to Mum’s account", Icon: ArrowDownLeft, why: "Look at the big word at the top: “Pay”. Pay means money leaves Mum’s account and goes to the buyer." },
    { id: "out", label: "From Mum’s account to the buyer", Icon: ArrowUpRight },
  ] },
  { q: "The buyer says, “Enter PIN to receive.” What should Tara do?", answer: "cancel", done: "Cancelled. No PIN typed, no money moved. Now, how can Tara and Mum get paid?", options: [
    { id: "pin", label: "Enter PIN to receive", Icon: KeyRound, trap: true, why: "Stop! A UPI PIN only ever says yes to sending money. Typing it here would pay the buyer ₹500. Receiving never needs a PIN." },
    { id: "ask", label: "Ask the buyer to explain again", Icon: MessageCircle, why: "The buyer’s words don’t change what the screen does. It says “Pay”, so the safe move is to cancel." },
    { id: "cancel", label: "Cancel, with no PIN", Icon: CircleX },
  ] },
  { q: "How can the buyer pay Tara and Mum safely?", answer: "share", done: "Safe! The buyer scans the shop’s QR and types their own PIN. Tara types nothing.", options: [
    { id: "scan", label: "Scan a new QR from the buyer", Icon: ScanLine, why: "Scanning their QR opens a payment from Mum’s account again. Scanning a QR code is for paying, not for getting paid." },
    { id: "share", label: "Send the shop’s own QR code or UPI ID", Icon: Share2 },
    { id: "tell", label: "Tell the buyer Mum’s UPI PIN", Icon: KeyRound, why: "Never share a UPI PIN with anyone. The buyer uses their own PIN to pay you." },
  ] },
];
const doneSteps = ["“Pay” means money goes out", "Cancelled, with no PIN", "Shared the shop’s own QR"];
const readSteps = [["Pay ₹500 means money leaves your account", .3], ["A UPI PIN is your secret yes to send money", .5], ["Receiving money never needs a scan or a PIN", .7]] as const;
const receiveSteps = [[Share2, "Mum sends the shop’s own QR code or UPI ID", 0], [ScanLine, "The buyer scans it and types their own PIN", .32], [BadgeCheck, "“₹500 received” arrives. Tara and Mum type nothing.", .52]] as const;

/** Decorative and deliberately unscannable: scattered dots plus three corner squares. */
function FakeQr({ seed, label }: { seed: number; label: string }) {
  return <div className={r.qr} role="img" aria-label={label}>
    {Array.from({ length: 225 }, (_, i) => {
      const x = i % 15, y = Math.floor(i / 15);
      const corner = (y < 5 && (x < 5 || x > 9)) || (x < 5 && y > 9);
      return <i key={i} data-on={!corner && (x * 31 + y * 17 + x * y * seed) % 5 < 2} />;
    })}
    <b /><b /><b />
  </div>;
}

function Phone({ label, children }: { label: string; children: ReactNode }) {
  return <div className={r.phone} role="group" aria-label={label}>
    <div className={r.status} aria-hidden="true"><span>5:42</span><span><Signal /><Wifi /><BatteryMedium /></span></div>
    <div className={r.upi}>
      <div className={r.appBar}><QrCode aria-hidden="true" /><strong>Cyberpur Pay</strong><em>Pretend app</em></div>
      {children}
    </div>
  </div>;
}

function PayScreen({ spot, keypad }: { spot?: boolean; keypad?: boolean }) {
  return <>
    <div className={r.direction} data-spot={spot}><ArrowUpRight aria-hidden="true" />Pay</div>
    <strong className={r.amount}>₹500</strong>
    <div className={r.party}><span className={r.avatar}>BB</span><span><small>To</small><b>Book buyer</b><small>{BUYER_ID}</small></span></div>
    <div className={r.from}><Wallet aria-hidden="true" /><span>From <b>Mum’s account ••42</b></span></div>
    <div className={r.pin}><KeyRound aria-hidden="true" /><span>Enter UPI PIN</span><span className={r.dots}>{Array.from({ length: 6 }, (_, i) => <i key={i} />)}</span></div>
    {keypad && <div className={r.keypad} aria-hidden="true">{["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", ""].map((key, i) => <span key={i}>{key}</span>)}</div>}
  </>;
}

function World({ scene, playing, elapsed, solved, markSolved, hint, setHint, reduced }: StoryWorldProps) {
  const [step, setStep] = useState(0);
  const [wrong, setWrong] = useState("");
  const at = solved ? 3 : step;
  const task = tasks[Math.min(at, 2)];
  // Reveal a beat once narration reaches that fraction of the scene; everything shows when paused.
  const show = (from: number) => !playing || elapsed >= script.scenes[scene].duration * from;
  function choose(option: Option) {
    if (solved || at > 2) return;
    if (option.id === task.answer) { setStep(at + 1); setWrong(""); setHint(""); return; }
    // The tempting PIN would really pay, so it sends the learner back to re-read the screen.
    if (option.trap) { setStep(0); setWrong(""); setHint(`${option.why} Read the screen again.`, false); return; }
    setWrong(option.id); setHint(option.why ?? "", false);
  }
  return <SceneSwap scene={scene} reduced={reduced}>
    {(scene === 0 || scene === 5) && <div className={k.device}>
      <div className={k.deviceBar}><span><BookOpen size={16} /> BOOK CORNER</span><span>Tara &amp; Mum’s online shop</span></div>
      <div className={`${k.deviceArt} ${r.shop}`}>
        {scene === 0 && <div className={k.badge}><BookOpen /> Adventure set · 6 books · ₹500</div>}
        {scene === 0 && show(.5) && <div className={`${r.notice} ${k.fitIn}`}><span className={r.avatar}>BB</span><div><small>Shop chat · just now</small><strong>Book buyer</strong><span>I’ll buy the adventure set!</span></div></div>}
        {scene === 5 && <div className={k.badge}><ShieldCheck /> Tricky buyer blocked</div>}
        {scene === 5 && show(.33) && <div className={k.success}><BadgeCheck /><strong>₹500 received!</strong><span>A real buyer scanned the shop’s QR · Tara typed no PIN</span></div>}
      </div>
      <div className={k.deviceFoot}>{scene === 0
        ? <><Palette /><span>Saving for: <b>new paints</b></span><small>Pretend shop · example only</small></>
        : <><ShieldCheck /><span>Chat reported at <b>cybercrime.gov.in</b></span><small>If money is ever lost, an adult calls 1930 quickly.</small></>}</div>
    </div>}

    {scene === 1 && <div className={r.split}>
      <div className={r.chat} role="group" aria-label="Pretend shop chat with a buyer">
        <div className={r.chatHead}><span className={r.avatar}>BB</span><div><strong>Book buyer</strong><small>Shop chat · pretend buyer</small></div></div>
        <div className={r.thread}>
          <div className={r.them}>I’ll pay for the adventure set now!</div>
          {show(.04) && <div className={`${r.them} ${r.qrMsg} ${k.fitIn}`}><FakeQr seed={3} label="The buyer’s pretend QR code, not scannable" /><span><b>Scan to receive ₹500</b><small>QR code · 5:41 pm</small></span></div>}
          {show(.6) && <div className={`${r.them} ${r.push} ${k.fitIn}`}>It’s only verification. Enter your PIN. Hurry!</div>}
        </div>
        <div className={r.clash} data-on={show(.85)}><ShieldAlert aria-hidden="true" /><span>The chat says <b>receive</b>. The screen says <b>Pay</b>.</span></div>
      </div>
      <Phone label="Pretend payment screen">
        {show(.3) ? <PayScreen keypad /> : <div className={r.scanner}><div className={r.viewfinder}><FakeQr seed={3} label="Scanning the buyer’s pretend QR code" /></div><span><ScanLine aria-hidden="true" /> Scanning QR…</span></div>}
      </Phone>
    </div>}

    {scene === 2 && <div className={k.panel}>
      <div className={r.mum}><span>Mum</span><div>“Good stop. Let’s read it together.”</div></div>
      <h2>Pay means money goes out.</h2>
      <div className={r.flow} role="img" aria-label="Pay ₹500 moves money from Mum’s account to the buyer">
        <span><Wallet aria-hidden="true" />Mum’s account</span><em>Pay ₹500<ArrowRight aria-hidden="true" /></em><span><UserRound aria-hidden="true" />Buyer</span>
      </div>
      {readSteps.map(([text, from]) => <div className={k.step} key={text} data-active={show(from)}><span><Check /></span>{text}</div>)}
      <div className={r.term} data-on={show(.86)}><QrCode aria-hidden="true" /><span>This trick is called a <b>QR code scam</b>.</span></div>
    </div>}

    {scene === 3 && <div className={r.taskGrid}>
      <Phone label={at === 0 || at === 1 ? "Pretend payment screen: Pay ₹500 to Book buyer, asking for a UPI PIN" : at === 2 ? "Pretend payment screen: payment cancelled" : "Pretend receive screen: the shop’s own QR code"}>
        {at < 2 ? <PayScreen spot={at === 1} />
          : at === 2 ? <div className={`${r.result} ${k.fitIn}`}><CircleX aria-hidden="true" /><strong>Payment cancelled</strong><span>No PIN typed.<br />No money moved.</span></div>
            : <div className={`${r.receiveScreen} ${k.fitIn}`}><div className={r.direction} data-kind="in"><ArrowDownLeft aria-hidden="true" />Receive</div><FakeQr seed={7} label="The shop’s own pretend QR code, not scannable" /><strong>Tara &amp; Mum’s Book Corner</strong><small>{SHOP_ID}</small><em>{solved ? <><Check aria-hidden="true" /> Sent to the buyer</> : "Share this to get paid"}</em></div>}
      </Phone>
      <div className={k.panel}>
        <h2>Help Tara read the screen</h2>
        <ol className={r.stepper} aria-label={`Step ${Math.min(at + 1, 3)} of 3`}>
          {["Read", "Decide", "Receive"].map((label, i) => <li key={label} data-state={i < at ? "done" : i === at ? "now" : "next"}><span>{i < at ? <Check aria-label="done" /> : i + 1}</span>{label}</li>)}
        </ol>
        {at < 3 ? <div key={at} className={reduced ? undefined : k.fitIn}>
          <div className={r.question} id="qr-task-question">{task.q}</div>
          <div className={`${k.bank} ${r.choices}`} role="group" aria-labelledby="qr-task-question">
            {task.options.map(option => <button key={option.id} type="button" data-trap={option.trap || undefined} data-wrong={wrong === option.id || undefined} onClick={() => choose(option)}><option.Icon aria-hidden="true" />{option.label}</button>)}
          </div>
        </div> : <ul className={r.summary}>{doneSteps.map(text => <li key={text}><Check aria-hidden="true" />{text}</li>)}</ul>}
        <p className={k.hint} aria-live="polite">{hint || (solved ? "Done! The shop’s QR is on its way. The buyer does the paying." : at > 0 ? tasks[at - 1].done : "Look at the pretend screen before you choose.")}</p>
        <div className={k.actions}><button className={k.primary} disabled={at !== 3 || solved} onClick={markSolved} type="button">{solved ? <><Check /> Shop QR sent</> : <>Send the shop’s QR to the buyer <ArrowRight /></>}</button></div>
        <small>Pretend screen and IDs. Never type a real PIN in a lesson.</small>
      </div>
    </div>}

    {scene === 4 && <div className={k.panel}>
      <h2>To receive, share yours.</h2>
      <div className={r.receive}>
        <div className={r.shopQr}><span><Store aria-hidden="true" /> Book Corner</span><FakeQr seed={7} label="The shop’s own pretend QR code, not scannable" /><b>Scan to pay us</b><small>{SHOP_ID}</small></div>
        <div>{receiveSteps.map(([Icon, text, from]) => <div className={k.step} key={text} data-active={show(from)}><span><Icon /></span>{text}</div>)}</div>
      </div>
      <div className={r.term} data-on={show(.74)}><QrCode aria-hidden="true" /><span>Scanning a QR code is for <b>paying</b>, not for getting paid.</span></div>
      <small>Example only: pretend shop, QR code and UPI ID.</small>
    </div>}
  </SceneSwap>;
}

const chapter: StoryChapter = {
  script,
  title: "Tara’s book sale mix-up",
  icon: QrCode,
  character: { asset: "girl-expressions", name: "Tara" },
  interactionScene: 3,
  beginLabel: "Practise with Tara",
  waitingText: "Story paused. Help Tara with the payment screen to see what happens next.",
  lockedHint: "Help Tara read the payment screen first.",
  World,
};
export default chapter;
