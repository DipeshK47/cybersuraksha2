"use client";

import { AlertTriangle, CreditCard, Headphones, LockKeyhole, PhoneOff, Play, QrCode, Shield, ShieldAlert, ShieldCheck, Smartphone, Trash2, UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { CyberLessonComponentProps } from "../../lesson-types";
import { PracticeShell, usePractice } from "./PracticeShell";
import s from "./practice.module.css";

type Props = CyberLessonComponentProps;
function PhoneCard({ caller, message, detail, children }: { caller: string; message: string; detail: string; children?: React.ReactNode }) {
  return <div className={s.callScreen}><div className={s.callTop}><span className={s.avatar}><Smartphone aria-hidden="true" /></span><span><strong>{caller}</strong><small>{detail} · fictional practice call</small></span></div><p className={s.message}>{message}</p>{children}</div>;
}

const naniTasks = [
  { prompt: "A caller wants Nani's one-time code. What do you do first?", caller: "Unknown caller", message: "I am helping Nani with her parcel. Read me the six-digit code from her phone right now.", options: [
    { label: "Shield the code and say no", correct: true, feedback: "Good. One-time codes are private even when a caller sounds helpful." },
    { label: "Read out the code", correct: false, feedback: "That would hand over a private code. Keep it hidden and try a safer move.", unsafe: true },
    { label: "Ask the caller to repeat the code", correct: false, feedback: "The caller should not receive or discuss the code. Protect it instead." },
  ] },
  { prompt: "The caller says the parcel will disappear in one minute. What next?", caller: "Unknown caller", message: "Hurry! If you hang up, Nani loses the parcel. Tell me the code now.", options: [
    { label: "End the call", correct: true, feedback: "You stopped the pressure. Urgency does not make a secret safe to share." },
    { label: "Give only the last two digits", correct: false, feedback: "Even part of a private code can help a stranger. End the call." , unsafe: true},
    { label: "Wait and keep listening", correct: false, feedback: "The caller is pressuring you. You can stop the call now." },
  ] },
  { prompt: "After hanging up, how do you help Nani?", caller: "Call ended", message: "The screen is quiet again. Nani wants to know what happened.", options: [
    { label: "Tell Nani and a trusted adult", correct: true, feedback: "Exactly. You kept the secret private and got help." },
    { label: "Delete the message and hide it", correct: false, feedback: "A trusted adult can help check what happened. Tell them." },
    { label: "Call the stranger back", correct: false, feedback: "The stranger is not a safe source of help. Talk to Nani and a trusted adult." },
  ] },
];
export function NanisSecretCode(props: Props) {
  const p = usePractice(props); const task = naniTasks[Math.min(p.stage, 2)];
  const safe = task.options[0]; const unsafe = task.options[1];
  return <PracticeShell props={props} stage={p.stage} eyebrow="Secret code shield" brief="A one-time code works like a key. Practise protecting it during a pretend call." prompt={task.prompt} feedback={p.feedback} feedbackCorrect={p.feedbackCorrect} onFinish={p.finish} ready={p.ready} onContinue={p.continuePractice} tone="safety" art="phone"><PhoneCard caller={p.ready && p.stage === 1 ? "Call ended" : task.caller} detail={p.stage === 2 || (p.ready && p.stage === 1) ? "Call ended" : "Incoming voice call"} message={p.ready && p.stage === 1 ? "The code stayed private. Tell Nani and a trusted adult what happened." : task.message}><div className={s.evidence}><span><LockKeyhole aria-hidden="true" /> Private code</span><span><AlertTriangle aria-hidden="true" /> Stranger&apos;s request</span></div><div className={s.controls}><button className={p.stage === 1 ? s.dangerButton : s.smallButton} onClick={() => p.submit(true, safe.feedback)} type="button">{p.stage === 0 ? <Shield aria-hidden="true" /> : p.stage === 1 ? <PhoneOff aria-hidden="true" /> : <ShieldCheck aria-hidden="true" />}{p.stage === 0 ? "Shield code" : p.stage === 1 ? "End call" : "Tell Nani and adult"}</button><button className={s.secondary} onClick={() => p.submit(false, unsafe.feedback, unsafe.unsafe)} type="button">{p.stage === 0 ? "Read code to caller" : p.stage === 1 ? "Give two digits" : "Hide what happened"}</button></div>{p.ready ? <p className={s.result}>{p.stage === 0 ? "Code protected" : p.stage === 1 ? "Call ended" : "Trusted adult informed"}</p> : null}</PhoneCard></PracticeShell>;
}

const popupTasks = [
  { prompt: "A prize window covers the tablet. Which control should you use?", title: "YOU WON A FREE TABLET!", detail: "Claim now. Enter a code to collect it.", options: [
    { label: "Close the window", correct: true, feedback: "The pop-up is gone. You did not open the prize link." },
    { label: "Claim the prize", correct: false, feedback: "A surprise prize can lead to a scam. Close it without claiming.", unsafe: true },
    { label: "Enter a code", correct: false, feedback: "Never put a private code into a surprise pop-up.", unsafe: true },
  ] },
  { prompt: "The window returns and asks to install a helper. What now?", title: "INSTALL PRIZE HELPER", detail: "Install this app before the timer ends.", options: [
    { label: "Close it and tell an adult", correct: true, feedback: "Good. You closed an unwanted install request and got help." },
    { label: "Install the helper", correct: false, feedback: "An unexpected pop-up is not a safe reason to install an app.", unsafe: true },
    { label: "Tap the countdown timer", correct: false, feedback: "Timers create pressure. Use the close control and tell an adult." },
  ] },
  { prompt: "A new game has another prize overlay. Show your safe habit.", title: "BONUS GIFT WAITING", detail: "Open the link to receive a reward.", options: [
    { label: "Close, return to the game, and report it", correct: true, feedback: "You transferred the same safe habit to a new screen." },
    { label: "Open the link just to look", correct: false, feedback: "Opening unknown prize links is unnecessary. Close and report the overlay.", unsafe: true },
    { label: "Share it with a friend", correct: false, feedback: "Do not spread a suspicious prize. Close it and report it." },
  ] },
];
function PopupExercise({ task, stage, ready, submit }: { task: (typeof popupTasks)[number]; stage: number; ready: boolean; submit: (correct: boolean, feedback: string, unsafe?: boolean) => void }) {
  const [cleared, setCleared] = useState(false);
  function clear() { if (stage === 0) submit(true, "You cleared the pop-up without opening its offer."); else setCleared(true); }
  return <div className={s.tablet}><div className={s.tabletBar}><span>Cyberpur Games</span><span>Safe practice screen</span></div>{ready || cleared ? <div className={s.restoredScreen}><ShieldCheck aria-hidden="true" /><strong>Game screen restored</strong><span>The surprise window is closed.</span>{cleared && !ready ? <button className={s.smallButton} onClick={() => submit(true, stage === 1 ? "You closed the install request and told a trusted adult." : "You cleared the new game's suspicious offer and reported it.")} type="button">{stage === 1 ? "Tell a trusted adult" : "Report the overlay"}</button> : null}</div> : <><div className={s.popupWindow} draggable onDragStart={(event) => event.dataTransfer.setData("text/plain", "surprise-pop-up")}><button aria-label="Close surprise pop-up" className={s.popupX} onClick={clear} type="button"><X aria-hidden="true" /></button><small>UNEXPECTED OFFER</small><strong>{task.title}</strong><p>{task.detail}</p><button className={s.fakeClaim} onClick={() => submit(false, task.options[1].feedback, true)} type="button">CLAIM NOW</button></div><button className={s.trashZone} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); if (event.dataTransfer.getData("text/plain") === "surprise-pop-up") clear(); }} onClick={clear} type="button"><Trash2 aria-hidden="true" /> Drag pop-up here or tap to clear</button></>}</div>;
}
export function SurprisePopUp(props: Props) {
  const p = usePractice(props); const task = popupTasks[Math.min(p.stage, 2)];
  return <PracticeShell props={props} stage={p.stage} eyebrow="Pop-up clean-up" brief="Practise clearing surprise prize windows without following their instructions." prompt={task.prompt} feedback={p.feedback} feedbackCorrect={p.feedbackCorrect} onFinish={p.finish} ready={p.ready} onContinue={p.continuePractice} tone="safety" art="phone"><PopupExercise key={p.stage} task={task} stage={p.stage} ready={p.ready} submit={p.submit} /></PracticeShell>;
}

const otpTasks = [
  { prompt: "A 'bank officer' asks for an OTP. Identify the risky request.", caller: "Bank support?", message: "Your card is frozen. Read the OTP that just arrived to reactivate it.", cues: ["Claims to be bank staff", "Requests an OTP", "Creates urgency"], options: [
    { label: "The request for the OTP", correct: true, feedback: "Correct. A caller asking for an OTP is a warning sign regardless of their title." },
    { label: "The caller's polite greeting", correct: false, feedback: "Politeness is not the issue. Focus on the secret the caller requested." },
    { label: "The time of the call", correct: false, feedback: "The same request is risky at any hour. Inspect what they want." },
  ] },
  { prompt: "A 'utility worker' repeats the demand. Choose your response.", caller: "Electricity desk?", message: "Your power will be cut today. Send the OTP to stop the disconnection.", cues: ["Threatens a service cut", "Requests an OTP", "Unknown caller"], options: [
    { label: "Refuse and end the call", correct: true, feedback: "You kept the OTP private and stopped the pressure." },
    { label: "Send the OTP to save time", correct: false, feedback: "An OTP is not a service fee. Never share it with a caller.", unsafe: true },
    { label: "Ask for the caller's employee ID, then share it", correct: false, feedback: "An ID claim does not make it safe to share an OTP. Refuse and end the call.", unsafe: true },
  ] },
  { prompt: "Now verify whether a real account problem exists.", caller: "Call ended", message: "You want to check the issue without trusting the caller's number.", cues: ["Independent verification", "Known official channel"], options: [
    { label: "Use a number from the official app or bill with an adult", correct: true, feedback: "That is independent verification through a known channel." },
    { label: "Call back the number that rang you", correct: false, feedback: "That number came from the caller. Use a known official source." },
    { label: "Open a link the caller sent", correct: false, feedback: "A caller's link is still controlled by the caller. Use an official source." , unsafe: true},
  ] },
];
export function OtpGuardian(props: Props) {
  const p = usePractice(props); const task = otpTasks[Math.min(p.stage, 2)];
  return <PracticeShell props={props} stage={p.stage} eyebrow="Caller inspection" brief="Caller names can be faked. Judge the request, then verify through a channel you already trust." prompt={task.prompt} feedback={p.feedback} feedbackCorrect={p.feedbackCorrect} onFinish={p.finish} ready={p.ready} onContinue={p.continuePractice} tone="safety" art="phone">
    <PhoneCard caller={p.stage === 2 || (p.stage === 1 && p.ready) ? "Call ended" : task.caller} detail={p.stage === 2 ? "Ready to verify" : "Unknown number"} message={task.message}>
      <div className={s.evidence}>{task.cues.map((cue) => p.stage === 0 ? <button className={s.evidenceButton} key={cue} onClick={() => p.submit(cue === "Requests an OTP", cue === "Requests an OTP" ? "You found the secret the caller is trying to collect." : "A title or deadline can be faked. Look for the private item being requested.")} type="button"><ShieldAlert aria-hidden="true" />{cue}</button> : <span key={cue}><ShieldAlert aria-hidden="true" />{cue}</span>)}</div>
      {p.stage === 1 ? <div className={s.controls}><button className={s.dangerButton} onClick={() => p.submit(true, "You ended the call without sharing the OTP.")} type="button"><PhoneOff aria-hidden="true" /> End call</button><button className={s.secondary} onClick={() => p.submit(false, task.options[1].feedback, true)} type="button">Send OTP</button></div> : null}
      {p.stage === 2 ? <div className={s.controls}><button className={s.smallButton} onClick={() => p.submit(true, task.options[0].feedback)} type="button"><ShieldCheck aria-hidden="true" /> Open official contact</button><button className={s.secondary} onClick={() => p.submit(false, task.options[1].feedback)} type="button">Call back stranger</button></div> : null}
    </PhoneCard>
  </PracticeShell>;
}

const qrTasks = [
  { prompt: "A buyer says 'scan my QR to receive money'. What should you notice?", message: "Scan this QR and enter your UPI PIN. I will send you ₹500.", amount: "Pay ₹500", direction: "Payment request", options: [
    { label: "Scanning and entering my PIN would authorize a payment", correct: true, feedback: "Exactly. Entering a UPI PIN after a scan authorizes money to leave, not arrive." },
    { label: "The PIN is needed to receive ₹500", correct: false, feedback: "A UPI PIN is for authorizing payment. Do not enter it to receive money.", unsafe: true },
    { label: "A QR code always means free money", correct: false, feedback: "QR codes can lead to payment requests. Read the direction before acting." },
  ] },
  { prompt: "The payment screen says 'Pay ₹500'. What action is safe?", message: "Buyer: It is a verification step. Tap Pay to receive the money.", amount: "Pay ₹500", direction: "Debit from your account", options: [
    { label: "Cancel the payment screen", correct: true, feedback: "You read the screen and prevented a debit." },
    { label: "Enter the UPI PIN", correct: false, feedback: "That would authorize the payment shown on screen. Cancel instead.", unsafe: true },
    { label: "Trust the buyer's explanation", correct: false, feedback: "The payment screen shows what will happen. Cancel the debit." },
  ] },
  { prompt: "Show your friend how to receive money safely by QR.", message: "You are explaining the rule to a friend.", amount: "Receive safely", direction: "No PIN to receive", options: [
    { label: "I can share my own QR to receive, but I never scan and enter a PIN to receive", correct: true, feedback: "That is the precise rule. Your own QR can be shared to receive money; a PIN authorizes payment." },
    { label: "No QR code can ever receive money", correct: false, feedback: "Your own QR can be shared for someone else to pay you. The risky step is scanning theirs and entering your PIN." },
    { label: "A PIN is always required to receive", correct: false, feedback: "Receiving money does not require entering your UPI PIN." , unsafe: true},
  ] },
];
export function QrCodeCaution(props: Props) {
  const p = usePractice(props); const task = qrTasks[Math.min(p.stage, 2)];
  return <PracticeShell props={props} stage={p.stage} eyebrow="Payment direction lab" brief="Inspect a pretend payment screen. Read where the money would move before choosing." prompt={task.prompt} feedback={p.feedback} feedbackCorrect={p.feedbackCorrect} onFinish={p.finish} ready={p.ready} onContinue={p.continuePractice} tone="safety" art="market"><div className={s.paymentGrid}><div className={s.paymentPhone}><div className={s.paymentHeader}><QrCode aria-hidden="true" /><span>Practice UPI screen</span></div><div className={s.qrVisual} aria-label="Illustrative QR pattern, not scannable"><QrCode aria-hidden="true" /></div><strong>{p.ready ? p.stage === 0 ? "Money would leave" : p.stage === 1 ? "Payment canceled" : "Receive QR shared" : task.amount}</strong><p>{task.direction}</p>{p.ready ? <ShieldCheck aria-label="Safe action completed" /> : <><button className={s.paymentButton} onClick={() => p.submit(false, "Scanning their QR and entering your PIN would authorize a payment. No PIN is needed to receive money.", true)} type="button">{p.stage === 2 ? "Scan buyer QR and enter PIN" : "Enter UPI PIN to pay"}</button><button className={s.smallButton} onClick={() => p.submit(true, task.options[0].feedback)} type="button">{p.stage === 0 ? "Inspect payment direction" : p.stage === 1 ? "Cancel payment" : "Share my receive QR"}</button></>}<small>Simulation only · no real payment</small></div><div className={s.panel}><h3>Buyer message</h3><p className={s.message}>{task.message}</p>{p.feedback ? <p className={s.warning}><CreditCard aria-hidden="true" /> A UPI PIN approves a payment. It is not needed to receive one.</p> : <p className={s.micro}>Read what the practice payment screen asks you to do.</p>}</div></div></PracticeShell>;
}

const arrestTasks = [
  { prompt: "Inspect the call. Which detail is a strong warning sign?", caller: "'Cyber Police' video call", message: "You are under digital arrest. Stay on this call, do not tell anyone, and pay a security fee immediately.", cues: ["Demands secrecy", "Claims digital arrest", "Requests money"], options: [
    { label: "Demand for secrecy and immediate payment", correct: true, feedback: "Yes. Intimidation, isolation, and payment demands are major warning signs." },
    { label: "The caller's video background", correct: false, feedback: "A background can be copied. Focus on the pressure and payment demand." },
    { label: "The caller's formal tone", correct: false, feedback: "A formal tone proves nothing. Inspect the action they demand." },
  ] },
  { prompt: "The caller threatens to keep you online. What do you do?", caller: "'Cyber Police' video call", message: "If you leave, we will arrest your family. Transfer the fee before the countdown ends.", cues: ["Threat", "Countdown", "Money request"], options: [
    { label: "End the call and tell a trusted adult", correct: true, feedback: "You broke the pressure and brought in real support." },
    { label: "Pay to make the threat stop", correct: false, feedback: "A payment under threat can cause financial loss. End the call and get help.", unsafe: true },
    { label: "Keep the call secret", correct: false, feedback: "The secrecy demand helps the scammer. Tell a trusted adult." },
  ] },
  { prompt: "How should you report this safely in India?", caller: "Call ended", message: "You and a trusted adult are safe. You want to report the suspicious call.", cues: ["Trusted adult", "Official report channel"], options: [
    { label: "Report at cybercrime.gov.in; call 1930 quickly if money was lost", correct: true, feedback: "Good. These are official Indian reporting channels for cybercrime and financial fraud." },
    { label: "Use the link sent by the caller", correct: false, feedback: "A caller's link can lead back to the scammer. Use the official portal yourself." },
    { label: "Ignore it and tell no one", correct: false, feedback: "Reporting with a trusted adult can help stop the scam." },
  ] },
];
export function DigitalArrestSimulation(props: Props) {
  const p = usePractice(props); const task = arrestTasks[Math.min(p.stage, 2)];
  return <PracticeShell props={props} stage={p.stage} eyebrow="Pressure call simulator" brief="This is a fictional intimidation call. Practise spotting pressure, ending the call, and reporting safely." prompt={task.prompt} feedback={p.feedback} feedbackCorrect={p.feedbackCorrect} onFinish={p.finish} ready={p.ready} onContinue={p.continuePractice} tone="safety" art="phone"><div className={s.videoCall}><div className={s.videoVisual}><ShieldAlert aria-hidden="true" /><span>{p.stage === 2 || (p.stage === 1 && p.ready) ? "CALL ENDED" : "FICTIONAL CALL"}</span><small>{p.stage === 2 || (p.stage === 1 && p.ready) ? "Ready to get support" : "Unknown caller · identity unverified"}</small>{p.stage === 1 ? <button className={s.dangerButton} onClick={() => p.submit(true, "Call ended. Now tell a trusted adult about the threat.")} type="button"><PhoneOff aria-hidden="true" /> End call</button> : null}</div><div className={s.videoContent}><div className={s.callTop}><span className={s.avatar}><UserRound aria-hidden="true" /></span><span><strong>{task.caller}</strong><small>Simulation · no real call</small></span></div><p className={s.message}>{task.message}</p>{p.stage === 0 ? <div className={s.evidence}>{task.cues.map((cue) => <button className={s.evidenceButton} key={cue} onClick={() => p.submit(cue !== "Claims digital arrest", cue !== "Claims digital arrest" ? "You spotted a pressure tactic in the call." : "The phrase is suspicious. Look at the secrecy and money demands too.")} type="button"><AlertTriangle aria-hidden="true" />{cue}</button>)}</div> : <div className={s.evidence}>{task.cues.map((cue) => <span key={cue}><AlertTriangle aria-hidden="true" />{cue}</span>)}</div>}{p.stage === 1 ? <button className={s.secondary} onClick={() => p.submit(false, task.options[1].feedback, true)} type="button">Transfer the fee</button> : null}{p.stage === 2 ? <div className={s.controls}><button className={s.smallButton} onClick={() => p.submit(true, task.options[0].feedback)} type="button"><ShieldCheck aria-hidden="true" /> Open cybercrime.gov.in with an adult</button><button className={s.secondary} onClick={() => p.submit(false, task.options[1].feedback, true)} type="button">Open caller&apos;s link</button><p className={s.micro}>If money was lost, call the official helpline 1930 quickly.</p></div> : null}</div></div></PracticeShell>;
}

const voiceTasks = [
  { prompt: "A voice sounds like your uncle and asks for money. What is the safest first move?", message: "It's me. I had an accident. Please send money now. Don't call anyone else.", options: [
    { label: "Pause and call the uncle's saved number", correct: true, feedback: "Good. A familiar-sounding voice can be copied. Verify through a known number." },
    { label: "Send money because the voice is familiar", correct: false, feedback: "A familiar voice alone does not prove who sent the message.", unsafe: true },
    { label: "Reply to the unknown number", correct: false, feedback: "The unknown number is part of the request. Use a known contact route." },
  ] },
  { prompt: "The caller says their phone is broken. What else can verify them?", message: "Don't call my old number. Just trust my voice and pay quickly.", options: [
    { label: "Ask a private family verification question through a known channel", correct: true, feedback: "A private family check helps when the request arrives through an untrusted number." },
    { label: "Ask what city they live in", correct: false, feedback: "Public facts may be easy to find. Use a private agreed check." },
    { label: "Send a small amount as a test", correct: false, feedback: "A test payment still sends money to an unverified person.", unsafe: true },
  ] },
  { prompt: "You cannot reach your uncle. What should you do now?", message: "The urgent voice note is still waiting, but you have not independently confirmed it.", options: [
    { label: "Ask a trusted adult and another known family contact before any payment", correct: true, feedback: "You kept the request on hold until identity could be checked independently." },
    { label: "Pay because waiting feels rude", correct: false, feedback: "An urgent request can wait for verification. Protect your family's money." , unsafe: true},
    { label: "Trust the voice note's display name", correct: false, feedback: "Names and voices can be imitated. Verify using known contacts." },
  ] },
];
function VoiceCard({ message, onOpen, children }: { message: string; onOpen: () => void; children: React.ReactNode }) {
  const [playing, setPlaying] = useState(false);
  useEffect(() => () => window.speechSynthesis?.cancel(), []);
  function toggleNote() {
    if (playing) {
      window.speechSynthesis?.cancel();
      setPlaying(false);
      return;
    }
    setPlaying(true);
    onOpen();
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = 0.93;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  }
  return <div className={s.voiceCard}><div className={s.callTop}><span className={s.avatar}><Headphones aria-hidden="true" /></span><span><strong>Unknown number · &ldquo;Relative&rdquo;</strong><small>Synthetic practice note · transcript available</small></span></div><div className={s.waveform} data-playing={playing} aria-label="Decorative waveform of a fictional voice note">{[18,30,46,26,54,36,20,43,58,31,48,23,37,52,27,41,21,34,49,25,38,19,44,31].map((height, i) => <i key={i} style={{ height }} />)}</div><button className={s.secondary} onClick={toggleNote} type="button"><Play aria-hidden="true" />{playing ? "Stop note" : "Play practice note"}</button><p className={s.message}>{message}</p><p className={s.micro}>A voice alone does not prove identity.</p>{children}</div>;
}
export function DeepfakeVoiceRelativeScam(props: Props) {
  const p = usePractice(props); const task = voiceTasks[Math.min(p.stage, 2)];
  const [openedStages, setOpenedStages] = useState<Record<number, boolean>>({});
  const opened = Boolean(openedStages[p.stage]);
  return <PracticeShell props={props} stage={p.stage} eyebrow="Voice verification lab" brief="A copied voice can sound convincing. Practise independent verification before acting on an urgent request." prompt={task.prompt} feedback={p.feedback} feedbackCorrect={p.feedbackCorrect} onFinish={p.finish} ready={p.ready} onContinue={p.continuePractice} tone="safety" art="phone"><VoiceCard key={p.stage} message={task.message} onOpen={() => setOpenedStages((current) => ({ ...current, [p.stage]: true }))}><p className={s.micro}>{opened ? "Choose a verification route before any payment." : "Play the practice note first."}</p><div className={s.controls}><button className={s.smallButton} disabled={!opened} onClick={() => p.submit(true, task.options[0].feedback)} type="button"><ShieldCheck aria-hidden="true" />{p.stage === 0 ? "Call uncle's saved number" : p.stage === 1 ? "Use private family check" : "Ask another known family contact"}</button><button className={s.secondary} disabled={!opened} onClick={() => p.submit(false, task.options[1].feedback, true)} type="button">{p.stage === 0 ? "Send money now" : p.stage === 1 ? "Send a test payment" : "Pay without checking"}</button></div></VoiceCard></PracticeShell>;
}
