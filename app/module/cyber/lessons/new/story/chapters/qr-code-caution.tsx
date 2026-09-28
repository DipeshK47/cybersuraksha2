"use client";

import { ArrowDownLeft, ArrowUpRight, BookOpen, Check, CircleAlert, Flag, Globe, IndianRupee, Lock, MessageCircle, QrCode, ScanLine, ShieldCheck, Telescope, UserRound, X } from "lucide-react";
import { useState } from "react";
import { SceneSwap } from "../StoryPlayer";
import type { StoryChapter, StoryWorldProps } from "../types";
import script from "./qr-code-caution.json";
import k from "../story-player.module.css";
import r from "./qr-code-caution.module.css";

/** A decorative, non-scannable QR-style pattern (fixed pseudo-random cells + three corner squares). */
function Qr() {
  const n = 21;
  const finder = (x: number, y: number) => (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9);
  const cells: [number, number][] = [];
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (!finder(x, y) && (x * 7 + y * 11 + x * y) % 5 < 2) cells.push([x, y]);
  const corner = (x: number, y: number) => <g key={`${x}-${y}`}><rect x={x} y={y} width="7" height="7" /><rect x={x + 1} y={y + 1} width="5" height="5" fill="#fff" /><rect x={x + 2} y={y + 2} width="3" height="3" /></g>;
  return <svg className={r.qr} viewBox="-1 -1 23 23" aria-hidden="true"><rect x="-1" y="-1" width="23" height="23" fill="#fff" />{cells.map(([x, y]) => <rect key={`${x}.${y}`} x={x} y={y} width="1" height="1" />)}{corner(0, 0)}{corner(n - 7, 0)}{corner(0, n - 7)}</svg>;
}

function PayScreen({ cancelled }: { cancelled?: boolean }) {
  return <div className={r.pay} data-cancelled={cancelled ?? false}>
    <div className={r.payTop}><Lock aria-hidden="true" /><span>UPI · pretend app</span></div>
    <strong className={r.direction}>{cancelled ? "Payment cancelled" : "Pay"}</strong>
    <span className={r.amount}>{cancelled ? "₹0 sent" : "₹500"}</span>
    <small>to Raj Books · rajbooks@upi.example</small>
    {!cancelled && <div className={r.pin}><span>Enter UPI PIN</span><div>{[0, 1, 2, 3].map(i => <i key={i} />)}</div></div>}
  </div>;
}

const receiveOptions = [
  { label: "Scan the buyer’s new QR code instead", ok: false, why: "Scanning someone’s QR opens a payment to them. To receive, the buyer should scan your QR, not the other way round." },
  { label: "Send Mum’s own QR code for the buyer to scan", ok: true, why: "Right! The buyer scans Mum’s QR and pays. Mum doesn’t enter any PIN to receive." },
  { label: "Enter the PIN just once, then change it", ok: false, why: "Even one PIN entry sends the money. A PIN is never needed to receive." },
];

function World({ scene, playing, elapsed, solved, markSolved, hint, setHint, reduced }: StoryWorldProps) {
  const [cancelled, setCancelled] = useState(false);
  const [passing, setPassing] = useState(false);
  const done = solved || passing;
  const stopped = solved || cancelled;
  // Reveal an item once narration reaches that fraction of the scene (everything shows while paused).
  const cue = (at: number) => !playing || elapsed > script.scenes[scene].duration * at;
  const show = (at: number) => ({ "data-on": cue(at), "aria-hidden": !cue(at) });

  function enterPin() {
    if (done || stopped) return;
    setHint("Look at the top: Pay ₹500. Entering the UPI PIN would send ₹500 to the buyer. A PIN never receives money.");
  }
  function cancel() {
    if (done || stopped) return;
    setCancelled(true);
    setHint("Payment stopped, and no PIN was entered. Now, how should Tara get paid?");
  }
  function receive(option: (typeof receiveOptions)[number]) {
    if (done || !stopped) return;
    setHint(option.why);
    if (!option.ok) return;
    setPassing(true);
    window.setTimeout(markSolved, reduced ? 0 : 900);
  }

  return <SceneSwap scene={scene} reduced={reduced}>
    {(scene === 0 || scene === 5) && <div className={k.device}>
      <div className={k.deviceBar}><span><BookOpen size={16} /> CYBERPUR SWAP</span><span>Tara’s listing · pretend site</span></div>
      <div className={`${k.deviceArt} ${r.shop}`}>
        {scene === 0 && <><div className={k.badge}><BookOpen /> 12 storybooks · ₹500</div>
          <p className={r.chat} {...show(.5)}><b>Raj Books</b>I’ll take them all! I’ll pay right now by QR code.</p></>}
        {scene === 5 && <div className={k.success}><ArrowDownLeft /><strong>Received ₹500</strong><span>A real buyer scanned Mum’s QR · no PIN needed</span></div>}
      </div>
      <div className={k.deviceFoot}><Telescope /><span>Telescope fund</span><span className={r.fund}><span style={{ transform: `scaleX(${scene === 0 ? .4 : .57})` }} /></span><b>{scene === 0 ? "₹1,200" : "₹1,700"} / ₹3,000</b>{scene === 5 && <small><Flag aria-hidden="true" /> Fake buyer reported</small>}</div>
    </div>}

    {scene === 1 && <div className={r.split}>
      <div className={r.thread}>
        <div className={r.threadHead}><MessageCircle aria-hidden="true" /><strong>Raj Books</strong><small>buyer · joined today</small></div>
        <div className={r.msg}>Scan this to <b>RECEIVE ₹500</b></div>
        <div className={r.msg} data-qr="true"><Qr /></div>
        <div className={r.msg} {...show(.66)}>Hurry! Enter PIN, it’s only verification!!</div>
      </div>
      <div className={r.phoneWrap} {...show(.3)}>
        <PayScreen />
        <span className={r.callout} {...show(.48)}><CircleAlert aria-hidden="true" /><span>It says <b>Pay</b>, not receive</span></span>
      </div>
    </div>}

    {scene === 2 && <div className={k.panel}>
      <div className={r.mum}><span className={r.avatar}><UserRound aria-hidden="true" /></span><div><small>Mum</small><p>“Who scans whose code decides where money goes.”</p></div></div>
      <h2>Two directions</h2>
      <div className={r.directions}>
        <div className={r.dir} data-kind="pay" {...show(.3)}><ArrowUpRight aria-hidden="true" /><strong>Pay or send</strong><span><ScanLine aria-hidden="true" />You scan their QR</span><span><Lock aria-hidden="true" />You enter your UPI PIN</span><b>Money leaves you</b></div>
        <div className={r.dir} data-kind="receive" {...show(.55)}><ArrowDownLeft aria-hidden="true" /><strong>Receive</strong><span><QrCode aria-hidden="true" />You share your QR or UPI ID</span><span><X aria-hidden="true" />No PIN, no scan by you</span><b>Money comes to you</b></div>
      </div>
      <p className={r.rule} {...show(.3)}><Lock aria-hidden="true" />A UPI PIN is only ever used to pay.</p>
    </div>}

    {scene === 3 && <div className={`${k.panel} ${r.task}`}>
      <h2>Stop the payment, then get paid safely</h2>
      <div className={r.taskGrid}>
        <div className={r.phoneWrap}>
          <PayScreen cancelled={stopped} />
          <div className={r.payActions}>
            <button type="button" data-trap="true" onClick={enterPin} disabled={done || stopped}><Lock />Enter the PIN, it’s just verification</button>
            <button type="button" className={r.cancel} onClick={cancel} disabled={done || stopped}><X />Cancel the payment</button>
          </div>
        </div>
        <div className={r.receive} data-ready={stopped}>
          <small>Step 2 · How should Tara get paid?</small>
          {receiveOptions.map(option => <button key={option.label} type="button" onClick={() => receive(option)} disabled={done || !stopped}>{option.label}</button>)}
        </div>
      </div>
      <p className={k.hint} aria-live="polite">{hint || (done ? "Right! The buyer scans Mum’s QR and pays. Mum doesn’t enter any PIN to receive." : stopped ? "Now choose how Tara should get paid." : "Step 1: read the screen. What does it really do?")}</p>
      <small>Pretend app, buyer and UPI ID.</small>
    </div>}

    {scene === 4 && <div className={k.panel}>
      <h2>The UPI rules</h2>
      <p className={r.saved} {...show(.02)}><ShieldCheck aria-hidden="true" />Payment cancelled · ₹0 sent</p>
      {["Read the screen: Pay means money goes out.", "Never enter your PIN to receive.", "Rushed by a buyer? Stop and ask an adult."].map((step, i) => <div className={k.step} key={step} data-active={cue([.24, .44, .6][i])}><span><Check /></span>{step}</div>)}
      <div className={r.help} {...show(.76)}>
        <div><strong>1930</strong><span>Call quickly if money was lost.</span></div>
        <div><Globe aria-hidden="true" /><span><b>cybercrime.gov.in</b> Report online.</span></div>
      </div>
    </div>}
  </SceneSwap>;
}

const chapter: StoryChapter = {
  script,
  title: "Tara’s storybook sale",
  icon: IndianRupee,
  character: { asset: "girl-expressions", name: "Tara" },
  interactionScene: 3,
  beginLabel: "Practise with Tara",
  waitingText: "Story paused. Stop the payment without a PIN, then choose how Tara gets paid.",
  lockedHint: "Help Tara stop the payment and get paid safely first.",
  World,
};
export default chapter;
