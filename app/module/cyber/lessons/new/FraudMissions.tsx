"use client";

import { AlertTriangle, ArrowRight, Ban, Camera, Check, FileText, Headphones, KeyRound, LockKeyhole, MessageSquareText, Pause, PhoneCall, PhoneOff, Play, QrCode, Send, Shield, ShieldCheck, Smartphone, Trash2, UsersRound, X } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { CyberLessonComponentProps } from "../../lesson-types";
import { PracticeShell, usePractice } from "./PracticeShell";
import f from "./fraud-practice.module.css";

type Props = CyberLessonComponentProps;
type Practice = ReturnType<typeof usePractice>;

function Scene({ art, person, character, children }: { art: string; person: string; character: "rohan" | "tara" | "kabir"; children: ReactNode }) {
  const frame = character === "rohan" ? "/animations/password-story/thinking.png" : `/animations/characters/${character === "tara" ? "girl-expressions" : "emotional-avatar"}/thinking.png`;
  return <div className={f.scene} data-fraud-practice>
    <div className={f.storyArt}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={art} alt="" />
      <div className={f.companion}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={frame} alt="" /><span><strong>{person}</strong><small>Practise together · fictional screen</small></span>
      </div>
    </div>
    <div className={f.workspace}>{children}</div>
  </div>;
}
function Consequence({ p, safe, risk }: { p: Practice; safe: string; risk: string }) {
  if (!p.ready && (!p.feedback || p.feedbackCorrect)) return null;
  return <div className={f.consequence} data-safe={p.ready} role="status">{p.ready ? <ShieldCheck aria-hidden="true" /> : <AlertTriangle aria-hidden="true" />}<span>{p.ready ? safe : risk}</span></div>;
}
function Cue({ children }: { children: ReactNode }) { return <p className={f.cue}><Shield aria-hidden="true" />{children}</p>; }

const naniTasks = [
  { prompt: "A caller wants Nani's one-time code. What do you do first?", message: "I am helping Nani with her parcel. Read me the six-digit code from her phone right now." },
  { prompt: "The caller says the parcel will disappear in one minute. What next?", message: "Hurry! If you hang up, Nani loses the parcel. Tell me the code now." },
  { prompt: "After hanging up, how do you help Nani?", message: "The screen is quiet again. Nani wants to know what happened." },
];
function NaniExercise({ p }: { p: Practice }) {
  const [adultOpen, setAdultOpen] = useState(false);
  const task = naniTasks[Math.min(p.stage, 2)];
  return <Scene art={`/cyber-missions/refined/${p.stage === 2 ? "nani-mum-reassures" : "nani-phone-call"}.webp`} person="Rohan & Nani" character="rohan">
    <Cue>One-time codes are private keys. A kind voice cannot make them safe to share.</Cue>
    <div className={f.phone}>
      <header className={f.screenBar}><Smartphone aria-hidden="true" />Nani’s phone<span>Practice only</span></header>
      {p.stage < 2 ? <>
        <div className={f.codeCard} data-covered={p.ready || p.stage > 0}>
          <small><LockKeyhole aria-hidden="true" />Cyberpur Bank · one-time code</small>
          <strong>{p.ready || p.stage > 0 ? "••••••" : "482716"}</strong><span>Never share this code with anyone.</span>
          {p.stage === 0 && <button className={f.primary} onClick={() => p.submit(true, "Code covered. The caller cannot read it. Keep the code private.")} type="button"><Shield aria-hidden="true" />Cover the code</button>}
        </div>
        <div className={f.callMessage}><span className={f.callStatus}>{p.stage === 1 && p.ready ? "Call ended" : "Unknown caller · parcel helpdesk?"}</span><p>“{p.stage === 1 && p.ready ? "The line is quiet. No code was shared." : task.message}”</p></div>
        <p className={f.instruction}>{p.stage === 0 ? "Tap the shield on the bank message to cover its code." : "The code is covered. Use the red phone control to stop the pressure."}</p>
        <div className={f.actions}>
          {p.stage === 1 && <button className={f.hangup} onClick={() => p.submit(true, "Call ended. Urgency is not a reason to share a private code.")} type="button"><PhoneOff aria-hidden="true" />End call</button>}
          <button className={f.risk} onClick={() => p.submit(false, "Keep every digit private. Cover the code or end the call instead.", true)} type="button">{p.stage === 0 ? "Read the code aloud" : "Give two digits"}</button>
        </div>
      </> : <>
        <div className={f.callMessage}><span className={f.callStatus}>Call ended · code private</span><p>{task.message}</p></div>
        <p className={f.instruction}>Open the trusted family contact. Then tell them what the caller asked for.</p>
        <button className={f.contact} onClick={() => setAdultOpen(true)} type="button" aria-expanded={adultOpen}><UsersRound aria-hidden="true" /><span><strong>Nani and a trusted adult</strong><small>Known family · get help together</small></span><ArrowRight aria-hidden="true" /></button>
        {adultOpen && <div className={f.draft}><strong>Tell Mum together</strong><p>“Someone asked for Nani’s secret code. We kept it private and ended the call.”</p><button className={f.primary} onClick={() => p.submit(true, "Mum has the full story. She and Nani can check the bank app together.")} type="button"><Send aria-hidden="true" />Tell Nani and Mum</button></div>}
        <button className={f.risk} onClick={() => p.submit(false, "Calling the stranger back reopens the pressure. Tell Nani and a trusted adult.", true)} type="button">Call the stranger back</button>
      </>}
      <Consequence p={p} safe={p.stage === 0 ? "Code shielded. It stayed on Nani’s phone." : p.stage === 1 ? "Line disconnected. The caller cannot listen." : "Trusted adult informed. Nani has support."} risk="Unsafe preview: the stranger could use the code. Nothing was sent in this simulation; try the safe action." />
    </div>
  </Scene>;
}
export function NanisSecretCode(props: Props) {
  const p = usePractice(props);
  return <PracticeShell props={props} stage={p.stage} eyebrow="Secret code shield" brief="Protect the code, end the pressure, then get trusted help." prompt={naniTasks[Math.min(p.stage, 2)].prompt} feedback={p.feedback} feedbackCorrect={p.feedbackCorrect} onFinish={p.finish} ready={p.ready} onContinue={p.continuePractice} tone="safety" art="phone"><NaniExercise key={p.stage} p={p} /></PracticeShell>;
}

const popupTasks = [
  { prompt: "A prize window covers the tablet. Which control should you use?", title: "YOU WON A FREE TABLET!", detail: "Enter Mum’s phone number to claim in 10 seconds." },
  { prompt: "The window returns and asks to install a helper. What now?", title: "INSTALL PRIZE HELPER", detail: "Install this app before the timer ends. It wants access to messages." },
  { prompt: "A new game has another prize overlay. Show your safe habit.", title: "BONUS GIFT WAITING", detail: "Open this prize link and enter a secret code to collect a reward." },
];
function PopupExercise({ p }: { p: Practice }) {
  const [cleared, setCleared] = useState(false);
  const [evidence, setEvidence] = useState(false);
  const task = popupTasks[Math.min(p.stage, 2)];
  function clear() { setCleared(true); if (p.stage === 0) p.submit(true, "You cleared the surprise offer without claiming or sharing Mum’s number."); }
  return <Scene art="/cyber-missions/refined/castle-game.webp" person="Rohan" character="rohan">
    <Cue>A prize you never entered is a trick. Close it before following its instructions.</Cue>
    <p className={f.instruction}>{p.stage === 0 ? "Drag the offer into the trash, tap Move to trash, or use the close button." : p.stage === 1 ? "Close the install request first. Then tell a trusted adult." : "Close the new offer, save a practice screenshot, then report the overlay."}</p>
    <div className={f.castleTablet}>
      <header className={f.screenBar}>Cyberpur Castles<span>Pretend game</span></header>
      <div className={f.castleArena} data-clear={cleared || p.ready}>
        {!cleared && !p.ready ? <div className={f.popup} draggable onDragStart={e => e.dataTransfer.setData("text/plain", "surprise-pop-up")}>
          <button className={f.close} aria-label="Close surprise pop-up" onClick={clear} type="button"><X aria-hidden="true" /></button>
          <strong>{task.title}</strong><p>{task.detail}</p><span className={f.timer}>Made-up countdown · 00:10</span>
          <button className={f.claim} onClick={() => p.submit(false, "The offer now wants access to private information. Close it without claiming or installing.", true)} type="button">{p.stage === 1 ? "Install helper" : "Claim prize"}</button>
        </div> : <div className={f.castleRestored}><ShieldCheck aria-hidden="true" /><strong>Castle screen restored</strong><span>No number, code or app access was shared.</span></div>}
      </div>
      <div className={f.dock}>
        {!cleared && !p.ready ? <button className={f.primary} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); if (e.dataTransfer.getData("text/plain") === "surprise-pop-up") clear(); }} onClick={clear} type="button"><Trash2 aria-hidden="true" />Move to trash</button> : <span><Check aria-hidden="true" />Surprise offer removed</span>}
        {cleared && p.stage === 1 && <button className={f.primary} onClick={() => p.submit(true, "The helper was not installed. You told a trusted adult about its message-access request.")} type="button"><UsersRound aria-hidden="true" />Tell a trusted adult</button>}
        {cleared && p.stage === 2 && <><button className={f.secondary} onClick={() => setEvidence(true)} type="button"><Camera aria-hidden="true" />{evidence ? "Screenshot saved" : "Save practice screenshot"}</button><button className={f.primary} disabled={!evidence} onClick={() => p.submit(true, "Your practice report includes the suspicious offer. You did not spread its link.")} type="button"><ShieldCheck aria-hidden="true" />Report the overlay</button></>}
      </div>
    </div>
    <Consequence p={p} safe="Game restored. Private information stayed private." risk="Unsafe preview: the offer would request private information or app access. No link opened and no app installed; close it and retry." />
  </Scene>;
}
export function SurprisePopUp(props: Props) {
  const p = usePractice(props);
  return <PracticeShell props={props} stage={p.stage} eyebrow="Pop-up clean-up" brief="Clear the offer, protect app access, and report a new suspicious overlay." prompt={popupTasks[Math.min(p.stage, 2)].prompt} feedback={p.feedback} feedbackCorrect={p.feedbackCorrect} onFinish={p.finish} ready={p.ready} onContinue={p.continuePractice} tone="safety" art="phone"><PopupExercise key={p.stage} p={p} /></PracticeShell>;
}

const otpPrompts = ["A 'bank officer' asks for an OTP. Identify the risky request.", "A 'utility worker' repeats the demand. Choose your response.", "Now verify whether a real account problem exists."];
function OtpExercise({ p }: { p: Practice }) {
  const [inspected, setInspected] = useState(false);
  const [refused, setRefused] = useState(false);
  const [bill, setBill] = useState(false);
  return <Scene art="/cyber-missions/safe-call-desk.webp" person="Tara & Nani" character="tara">
    <Cue>Read what the OTP approves. Verify through an official contact you already have.</Cue>
    <div className={f.phone}>
      <header className={f.screenBar}><Smartphone aria-hidden="true" />Tara’s call inspector<span>Simulation</span></header>
      <div className={f.callMessage}><span className={f.callStatus}>{p.stage === 2 || p.ready && p.stage === 1 ? "Call ended" : p.stage === 0 ? "“Bank officer” · unknown number" : "“Electricity office” · unknown number"}</span><p>{p.stage === 0 ? "“Your card is frozen. Read the OTP to reactivate it.”" : p.stage === 1 ? "“Your power will be cut tonight. Send the OTP now.”" : "The caller’s number and link are still untrusted. Use the bill Nani already has."}</p></div>
      {p.stage === 0 ? <>
        <p className={f.instruction}>Open the bank message and compare what the code does with the caller’s claim.</p>
        <button className={f.contact} onClick={() => setInspected(true)} type="button" aria-expanded={inspected}><MessageSquareText aria-hidden="true" /><span><strong>Inspect bank message</strong><small>Cyberpur Bank · received before the call</small></span><ArrowRight aria-hidden="true" /></button>
        {inspected && <div className={f.codeCard}><small>Example bank message</small><p>OTP <b>482913</b> approves a payment of <b>₹4,999</b>. Do not share it.</p><button className={f.primary} onClick={() => p.submit(true, "The caller claimed card repair, but the OTP message approves a payment. You found the mismatch.")} type="button">Flag payment-versus-repair mismatch</button></div>}
        <button className={f.risk} onClick={() => p.submit(false, "A polite greeting proves nothing. Inspect the message to see what the requested code approves.")} type="button">Flag the polite greeting instead</button>
      </> : p.stage === 1 ? <>
        <p className={f.instruction}>Refuse the code request. Then disconnect the call.</p>
        <button className={f.secondary} onClick={() => setRefused(true)} type="button"><LockKeyhole aria-hidden="true" />Refuse OTP request</button>
        {refused && <p className={f.sentReply}>You: “I do not share one-time codes.”</p>}
        <div className={f.actions}><button className={f.hangup} disabled={!refused} onClick={() => p.submit(true, "You refused, ended the call, and kept the OTP private.")} type="button"><PhoneOff aria-hidden="true" />End call</button><button className={f.risk} onClick={() => p.submit(false, "Sharing an OTP could approve a payment. A staff ID or service threat does not make it safe.", true)} type="button">Send OTP</button></div>
      </> : <>
        <p className={f.instruction}>Open the electricity bill. Check its saved contact, then use that route with an adult.</p>
        <button className={f.contact} onClick={() => setBill(true)} type="button" aria-expanded={bill}><FileText aria-hidden="true" /><span><strong>Open electricity bill</strong><small>Nani’s existing paper bill</small></span><ArrowRight aria-hidden="true" /></button>
        {bill && <div className={f.document}><strong>Cyberpur Electricity · example bill</strong><span>Contact printed on bill</span><b>+91 00000 22233</b><button className={f.primary} onClick={() => p.submit(true, "You used the number on the existing bill with an adult. The practice office confirms there is no cut scheduled.")} type="button"><PhoneCall aria-hidden="true" />Verify through number on bill</button></div>}
        <button className={f.risk} onClick={() => p.submit(false, "Calling the number that contacted you only returns to the unverified caller. Use the existing bill.")} type="button">Call back stranger</button>
      </>}
      <Consequence p={p} safe={p.stage === 0 ? "Mismatch marked. The OTP would approve a payment." : p.stage === 1 ? "Call ended. No code was shared." : "Known route checked. The practice power account is fine."} risk="Unverified route or claim. The OTP stays private while you inspect and retry." />
    </div>
  </Scene>;
}
export function OtpGuardian(props: Props) {
  const p = usePractice(props);
  return <PracticeShell props={props} stage={p.stage} eyebrow="Caller inspection" brief="Compare the message, stop the demand, and independently verify the service." prompt={otpPrompts[Math.min(p.stage, 2)]} feedback={p.feedback} feedbackCorrect={p.feedbackCorrect} onFinish={p.finish} ready={p.ready} onContinue={p.continuePractice} tone="safety" art="phone"><OtpExercise key={p.stage} p={p} /></PracticeShell>;
}

const qrPrompts = ["A buyer says 'scan my QR to receive money'. What should you notice?", "The payment screen says 'Pay ₹500'. What action is safe?", "Show your friend how to receive money safely by QR."];
function QrExercise({ p }: { p: Practice }) {
  const [preview, setPreview] = useState(false);
  const [ownQr, setOwnQr] = useState(false);
  return <Scene art="/cyber-missions/bookshop-payment.webp" person="Tara & Mum" character="tara">
    <Cue>A UPI PIN approves sending money. Receiving money does not require your PIN.</Cue>
    <div className={f.paymentDesk}>
      <div className={f.phone}>
        <header className={f.screenBar}><QrCode aria-hidden="true" />Cyberpur Pay<span>Pretend app</span></header>
        {p.stage < 2 ? <>
          <strong className={f.amount}>{p.stage === 1 && p.ready ? "Cancelled" : "Pay ₹500"}</strong>
          <div className={f.payee}><small>From</small><strong>Mum’s account ••42</strong><ArrowRight aria-hidden="true" /><small>To</small><strong>Book buyer · buyer.77@cyberpur</strong></div>
          <div className={f.pin}><KeyRound aria-hidden="true" />Enter UPI PIN<span>••••••</span></div>
          {p.stage === 0 ? <><p className={f.instruction}>Run the payment preview. Watch which account loses ₹500, then flag its direction.</p><button className={f.secondary} onClick={() => setPreview(true)} type="button">Preview Pay ₹500</button>{preview && <div className={f.moneyFlow}><span>Mum’s account<b>− ₹500</b></span><ArrowRight aria-hidden="true" /><span>Buyer’s account<b>+ ₹500</b></span><button className={f.primary} onClick={() => p.submit(true, "The screen’s Pay instruction moves ₹500 from Mum to the buyer. The message’s receive claim does not match.")} type="button">Flag as outgoing payment</button></div>}<button className={f.risk} onClick={() => p.submit(false, "The screen says Pay: money would leave Mum’s account. Preview its direction before deciding.")} type="button">Treat as ₹500 received</button></> : <><p className={f.instruction}>Cancel the debit request without entering a PIN.</p><div className={f.actions}><button className={f.primary} onClick={() => p.submit(true, "Payment cancelled. No PIN typed and no money moved.")} type="button"><X aria-hidden="true" />Cancel payment</button><button className={f.risk} onClick={() => p.submit(false, "Entering a PIN here would approve ₹500 leaving the account. Cancel the request.", true)} type="button">Enter practice PIN to pay</button></div></>}
        </> : <>
          <strong className={f.amount}>Receive</strong>
          <p className={f.instruction}>Attach the shop’s own QR to the reply. The buyer will do the paying.</p>
          <button className={f.contact} onClick={() => setOwnQr(true)} type="button" aria-pressed={ownQr}><QrCode aria-hidden="true" /><span><strong>Use shop’s own QR</strong><small>Tara & Mum’s Book Corner</small></span><ArrowRight aria-hidden="true" /></button>
          {ownQr && <div className={f.receiveQr}><QrCode role="img" aria-label="Illustrative shop QR, not scannable" /><strong>Book Corner</strong><span>taramum.books@cyberpur</span><small>No PIN required to receive</small><button className={f.primary} onClick={() => p.submit(true, "The shop’s own QR was attached to the practice reply. The buyer uses their own PIN to pay; Tara types none.")} type="button"><Send aria-hidden="true" />Share my receive QR</button></div>}
          <button className={f.risk} onClick={() => p.submit(false, "A buyer’s QR can open another payment request. Share the shop’s own receive QR instead.", true)} type="button">Scan buyer QR and enter PIN</button>
        </>}
        <small className={f.simulation}>Illustrative IDs and QR only · no real payment or sharing</small>
      </div>
      <div className={f.buyerChat}><strong>Book buyer · shop chat</strong><p>{p.stage === 0 ? "“Scan my QR and enter your PIN. I’ll send ₹500.”" : p.stage === 1 ? "“It’s only verification. Tap Pay to receive the money.”" : "“How can I pay for the adventure books?”"}</p><Consequence p={p} safe={p.stage === 0 ? "Outgoing debit identified. Mum’s money is still safe." : p.stage === 1 ? "Cancelled. No PIN and no debit." : "Own QR attached. The buyer pays; Tara types no PIN."} risk="Unsafe payment direction. This preview moved no real money; inspect the screen and retry." /></div>
    </div>
  </Scene>;
}
export function QrCodeCaution(props: Props) {
  const p = usePractice(props);
  return <PracticeShell props={props} stage={p.stage} eyebrow="Payment direction lab" brief="Preview the direction, cancel the debit, and prepare an owned receive QR." prompt={qrPrompts[Math.min(p.stage, 2)]} feedback={p.feedback} feedbackCorrect={p.feedbackCorrect} onFinish={p.finish} ready={p.ready} onContinue={p.continuePractice} tone="safety" art="market"><QrExercise key={p.stage} p={p} /></PracticeShell>;
}

const arrestPrompts = ["Inspect the call. Which details are strong warning signs?", "The caller threatens to keep you online. What do you do?", "How should you report this safely in India?"];
function ArrestExercise({ p }: { p: Practice }) {
  const [marked, setMarked] = useState<string[]>([]);
  const [ended, setEnded] = useState(false);
  const [evidence, setEvidence] = useState(false);
  const [official, setOfficial] = useState(false);
  function mark(id: string) { setMarked(current => current.includes(id) ? current.filter(v => v !== id) : [...current, id]); }
  return <Scene art={p.stage === 2 ? "/cyber-missions/safe-call-desk.webp" : "/cyber-missions/refined/pretend-caller.webp"} person="Kabir & family" character="kabir">
    <Cue>Demands for secrecy and money are warning signs. A uniform or background proves no identity.</Cue>
    <div className={f.videoConsole}>
      <header className={f.screenBar}><Shield aria-hidden="true" />Family call desk<span>{ended || p.stage === 2 ? "Disconnected" : "Identity unverified"}</span></header>
      {p.stage === 0 ? <>
        <p className={f.instruction}>Mark both demands in the transcript. Then check the evidence.</p>
        <div className={f.transcript}><p>Unknown caller: “You are under digital arrest.”</p><button aria-pressed={marked.includes("secret")} onClick={() => mark("secret")} type="button">Mark secrecy demand: “Stay on camera. Tell no one.”</button><button aria-pressed={marked.includes("money")} onClick={() => mark("money")} type="button">Mark payment demand: “Pay ₹50,000 now.”</button></div>
        <div className={f.actions}><button className={f.primary} disabled={marked.length !== 2} onClick={() => p.submit(true, "Both pressure demands are marked. Digital arrest is not a real legal procedure; appearance does not verify the caller.")} type="button"><Check aria-hidden="true" />Check selected evidence</button><button className={f.risk} onClick={() => p.submit(false, "A uniform can be copied. It cannot prove identity. Inspect the secrecy and payment demands instead.")} type="button">Treat the uniform as proof</button></div>
      </> : p.stage === 1 ? <>
        <div className={f.callMessage}><span className={f.callStatus}>{ended ? "Call disconnected · no payment" : "Unknown caller · threats continuing"}</span><p>{ended ? "The caller cannot hear you. Kabir can tell family what happened." : "“If you leave, we will arrest your family. Transfer the fee now.”"}</p></div>
        <p className={f.instruction}>Disconnect the call first, then tell a trusted adult about the threat.</p>
        <div className={f.actions}><button className={f.hangup} disabled={ended} onClick={() => setEnded(true)} type="button"><PhoneOff aria-hidden="true" />End call</button><button className={f.primary} disabled={!ended} onClick={() => p.submit(true, "Call ended and trusted family informed. Nobody paid or stayed silent.")} type="button"><UsersRound aria-hidden="true" />Tell a trusted adult</button><button className={f.risk} onClick={() => p.submit(false, "Paying under threat does not clear a case. End the call and get trusted support.", true)} type="button">Transfer the fee</button></div>
      </> : <>
        <p className={f.instruction}>Save the fictional call details. Open the official route independently, then submit the practice report.</p>
        <div className={f.document}><strong>Call evidence · simulation</strong><span>Unknown number: +91 00000 45210</span><span>Demand: ₹50,000 and secrecy · no money sent</span><button className={f.secondary} onClick={() => setEvidence(true)} type="button"><Camera aria-hidden="true" />{evidence ? "Call evidence saved" : "Save call evidence"}</button></div>
        <button className={f.contact} onClick={() => setOfficial(true)} type="button" aria-expanded={official}><ShieldCheck aria-hidden="true" /><span><strong>Open official reporting route</strong><small>Chosen independently with an adult</small></span><ArrowRight aria-hidden="true" /></button>
        {official && <div className={f.draft}><strong>cybercrime.gov.in · practice intake</strong><p>Evidence: {evidence ? "Call details attached" : "Save the call details first"}</p><button className={f.primary} disabled={!evidence} onClick={() => p.submit(true, "Practice report prepared through the official route with an adult. If money was lost, call 1930 quickly.")} type="button"><Send aria-hidden="true" />Submit practice report</button><small>No website was opened and no real report was sent. If money was lost, an adult should call 1930 quickly.</small></div>}
        <button className={f.risk} onClick={() => p.submit(false, "The caller controls their link. Open the official reporting route independently with an adult.", true)} type="button">Open caller’s report link</button>
      </>}
      <Consequence p={p} safe={p.stage === 0 ? "Pressure evidence recorded. The caller remains unverified." : p.stage === 1 ? "Call ended. Family knows. No payment." : "Evidence attached to a practice report through the official route."} risk="Unsafe route or demand. No real call, payment or report occurred; the safe controls remain available." />
    </div>
  </Scene>;
}
export function DigitalArrestSimulation(props: Props) {
  const p = usePractice(props);
  return <PracticeShell props={props} stage={p.stage} eyebrow="Pressure call simulator" brief="Collect evidence, stop intimidation, and prepare a report using an independently chosen official route." prompt={arrestPrompts[Math.min(p.stage, 2)]} feedback={p.feedback} feedbackCorrect={p.feedbackCorrect} onFinish={p.finish} ready={p.ready} onContinue={p.continuePractice} tone="safety" art="phone"><ArrestExercise key={p.stage} p={p} /></PracticeShell>;
}

const voiceTasks = [
  { prompt: "A voice sounds like your uncle and asks for money. What is the safest first move?", message: "It's me. I had an accident. Please send money now. Don't call anyone else." },
  { prompt: "The caller says their phone is broken. What else can verify them?", message: "Don't call my old number. Just trust my voice and pay quickly." },
  { prompt: "You cannot reach your uncle. What should you do now?", message: "I still need that money now. Please don't tell anyone." },
];
function VoiceExercise({ p }: { p: Practice }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [opened, setOpened] = useState(false);
  const [contacts, setContacts] = useState(false);
  const [held, setHeld] = useState(false);
  const task = voiceTasks[Math.min(p.stage, 2)];
  useEffect(() => { const note = audio.current; return () => { note?.pause(); }; }, []);
  function toggleNote() {
    setOpened(true);
    if (!audio.current) return;
    if (playing) audio.current.pause();
    else { audio.current.currentTime = 0; void audio.current.play().catch(() => { setUnavailable(true); setPlaying(false); }); }
  }
  return <Scene art="/cyber-missions/safe-call-desk.webp" person="Kabir & Mum" character="kabir">
    <Cue>A copied voice can sound perfect. Verify through saved contacts; keep private family checks offline.</Cue>
    <div className={f.chatApp}>
      <header className={f.screenBar}><Headphones aria-hidden="true" />Unknown number · “Relative”<span>Not saved</span></header>
      <audio ref={audio} src={`/audio/cyber/deepfake-voice-relative-scam/practice-${p.stage + 1}.mp3`} preload="metadata" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} onError={() => { setUnavailable(true); setPlaying(false); }} />
      <div className={f.voiceNote}><button className={f.playNote} disabled={unavailable} onClick={toggleNote} type="button">{playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}{unavailable ? "Audio unavailable" : playing ? "Stop note" : "Play practice note"}</button><div className={f.waveform} data-playing={playing} aria-hidden="true">{[18,30,46,26,54,36,20,43,58,31,48,23,37,52,27,41,21,34,49,25,38,19,44,31].map((height, i) => <i key={i} style={{ height }} />)}</div></div>
      <button className={f.secondary} onClick={() => setOpened(true)} type="button"><FileText aria-hidden="true" />Read voice-note transcript</button>
      {opened && <div className={f.callMessage}><span className={f.callStatus}>Synthetic practice note · transcript</span><p>“{task.message}”</p></div>}
      <p className={f.instruction}>{!opened ? "Play the note or read its transcript to inspect the request. Audio is optional." : p.stage === 0 ? "Open the saved contact book and call the uncle’s existing number." : p.stage === 1 ? "Open a known family channel and use the agreed private check verbally. Do not type a real secret." : "Put the payment on hold. Then seek another known family contact and a trusted adult."}</p>
      {p.stage < 2 ? <>
        <button className={f.contact} disabled={!opened} onClick={() => setContacts(true)} type="button" aria-expanded={contacts}><UsersRound aria-hidden="true" /><span><strong>{p.stage === 0 ? "Open saved contacts" : "Open known family channel"}</strong><small>Already stored before this message arrived</small></span><ArrowRight aria-hidden="true" /></button>
        {contacts && <div className={f.document}><strong>{p.stage === 0 ? "Uncle Vikram · saved contact" : "Family check · known channel"}</strong><span>{p.stage === 0 ? "+91 00000 12345 · example number" : "Agree and ask a private check aloud. Never send the secret in chat."}</span><button className={f.primary} onClick={() => { audio.current?.pause(); p.submit(true, p.stage === 0 ? "The uncle answers on his saved number and says he is safe. The unknown voice note did not prove identity." : "You used the agreed private check through a known channel. Public facts or voice similarity are not enough; keep payment on hold until the check succeeds."); }} type="button">{p.stage === 0 ? <PhoneCall aria-hidden="true" /> : <KeyRound aria-hidden="true" />}{p.stage === 0 ? "Call uncle’s saved number" : "Use private family check"}</button></div>}
      </> : <>
        <button className={f.secondary} disabled={!opened} onClick={() => setHeld(true)} type="button"><Ban aria-hidden="true" />{held ? "Payment on hold" : "Put payment on hold"}</button>
        {held && <p className={f.sentReply}>₹20,000 held · identity still unverified</p>}
        <button className={f.primary} disabled={!opened || !held} onClick={() => { audio.current?.pause(); p.submit(true, "You involved a trusted adult and another known family contact. Payment stays on hold until identity is independently verified."); }} type="button"><UsersRound aria-hidden="true" />Ask another known family contact</button>
      </>}
      <button className={f.risk} disabled={!opened} onClick={() => p.submit(false, "An urgent or familiar-sounding voice cannot prove identity. Keep money on hold and use known contacts.", true)} type="button">{p.stage === 0 ? "Send money now" : p.stage === 1 ? "Send a test payment" : "Pay without checking"}</button>
      <Consequence p={p} safe={p.stage === 0 ? "Saved contact reached. Uncle is safe. No money sent." : p.stage === 1 ? "Private check started through a known channel. Payment stays on hold." : "Known family help requested. Payment stays on hold; identity still needs checking."} risk="Unsafe preview: money would go to an unverified sender. No transfer happened; use the known verification route." />
      <small className={f.simulation}>{unavailable ? "Audio could not load. The transcript provides the same practice request." : "Synthetic note, fictional numbers and simulated contacts only."}</small>
    </div>
  </Scene>;
}
export function DeepfakeVoiceRelativeScam(props: Props) {
  const p = usePractice(props);
  return <PracticeShell props={props} stage={p.stage} eyebrow="Voice verification lab" brief="Inspect a real practice voice note, verify independently, and keep unverified payments on hold." prompt={voiceTasks[Math.min(p.stage, 2)].prompt} feedback={p.feedback} feedbackCorrect={p.feedbackCorrect} onFinish={p.finish} ready={p.ready} onContinue={p.continuePractice} tone="safety" art="phone"><VoiceExercise key={p.stage} p={p} /></PracticeShell>;
}
