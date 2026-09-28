"use client";

import { ArrowDownLeft, ArrowUpRight, CheckCircle2, ShieldX, WalletCards, XCircle } from "lucide-react";
import { useState } from "react";
import type { CyberLessonComponentProps } from "../../lesson-types";
import { CyberExperienceFrame } from "../CyberExperienceFrame";
import { makeHints, makeMistake } from "../experience-content";
import type { ExperienceDefinition } from "../experience-types";
import { PhoneShell } from "../shells/PhoneShell";
import { useCyberExperience } from "../useCyberExperience";
import styles from "./middle-experiences.module.css";

const definition: ExperienceDefinition = {
  id: "upi-flow",
  objective: "Send money the safe way.",
  place: "SurakshaPay practice app",
  guide: "Kabir",
  scenes: ["Pay shop", "Use demo PIN", "Reject collect", "Receive refund"],
  completionTitle: "Kabir followed the money direction!",
  completionSummary: "You used a PIN only to send money and rejected a collect request disguised as a refund.",
  familyMove: "Explain why receiving money never needs a UPI PIN.",
  hints: makeHints("Pay the demo shop.", "The arrow shows money direction.", "A collect request takes money from Kabir.", "Receiving money never needs a UPI PIN."),
};

type Screen = "home" | "pay" | "pin" | "receipt" | "collect" | "refund";

export function UpiFlowExperience({ runtime, ...props }: CyberLessonComponentProps & { assessmentIds: readonly [string, string, string] }) {
  const experience = useCyberExperience(runtime, definition, props.assessmentIds);
  const [screen, setScreen] = useState<Screen>("home");
  const [pin, setPin] = useState("");
  const [balance, setBalance] = useState(1000);

  function pay() { setScreen("pin"); experience.setScene(1); }
  function pressDigit(digit: string) { if (pin.length < 4) setPin((value) => value + digit); }
  function confirmPin() { const correct = pin === "2468"; experience.act({ id: "pay-shop", correct, assessmentIndex: 0, nextScene: correct ? 2 : 1, mistake: makeMistake("Use the supplied demo PIN", "This fictional keypad is only for a payment Kabir chose to send.", "A PIN authorises money leaving the account." ) }); if (correct) { setBalance(880); setScreen("receipt"); } else setPin(""); }
  function openCollect() { setScreen("collect"); }
  function approveCollect() { experience.act({ id: "approve-collect", correct: false, assessmentIndex: 1, unsafe: true, mistake: makeMistake("This request takes money", "The arrow points from Kabir to the stranger. It is a collect request, not a refund.", "Reject collect requests you did not create." ) }); }
  function rejectCollect() { experience.act({ id: "reject-collect", correct: true, assessmentIndex: 1, nextScene: 3 }); setScreen("refund"); }
  function receiveRefund() { setBalance(1000); experience.act({ id: "receive-refund", correct: true, assessmentIndex: 2, nextScene: 3 }); }

  return (
    <CyberExperienceFrame definition={definition} onHelp={experience.showHint} points={experience.points} runtime={runtime} scene={experience.scene} status={experience.has("receive-refund") ? "Refund received without a PIN." : screen === "collect" ? "Check the money arrow." : `Demo balance ₹${balance}.`}>
      <section className={styles.upiExperience} data-experience="upi-flow" data-interaction="phone">
        <PhoneShell onBack={() => setScreen("home")} onHome={() => setScreen("home")} screen={screen} status="Fictional payments" title="SurakshaPay">
          {screen === "home" ? <div className={styles.payHome}><div><WalletCards aria-hidden="true" /><span><small>Demo balance</small><b>₹{balance}</b></span></div><button onClick={() => setScreen("pay")} type="button"><ArrowUpRight aria-hidden="true" /> Pay shop</button>{experience.has("pay-shop") ? <button onClick={openCollect} type="button"><ArrowDownLeft aria-hidden="true" /> Open refund message</button> : null}</div> : null}
          {screen === "pay" ? <div className={styles.payee}><span>🏪</span><h2>School Canteen Demo</h2><b>₹120</b><p>Money goes from Kabir → Shop</p><button onClick={pay} type="button">Continue to pay</button></div> : null}
          {screen === "pin" ? <div className={styles.pinScreen}><small>Fictional PIN shown for practice</small><b>2468</b><div className={styles.pinDots}>{[0, 1, 2, 3].map((index) => <i className={index < pin.length ? styles.pinFilled : ""} key={index} />)}</div><div className={styles.keypad}>{["1", "2", "3", "4", "5", "6", "7", "8", "9", "⌫", "0", "✓"].map((key) => <button key={key} onClick={() => key === "✓" ? confirmPin() : key === "⌫" ? setPin((value) => value.slice(0, -1)) : pressDigit(key)} type="button">{key}</button>)}</div></div> : null}
          {screen === "receipt" ? <div className={styles.receipt}><CheckCircle2 aria-hidden="true" /><h2>₹120 sent</h2><p>Kabir → School Canteen Demo</p><button onClick={openCollect} type="button">Open refund message</button></div> : null}
          {screen === "collect" ? <div className={styles.collectRequest}><ShieldX aria-hidden="true" /><small>Collect request</small><h2>“Refund ₹120”</h2><div><b>Kabir</b><ArrowUpRight aria-hidden="true" /><b>QuickRefund_88</b></div><p>Approving sends your money.</p><button onClick={approveCollect} type="button">Approve “refund”</button><button onClick={rejectCollect} type="button"><XCircle aria-hidden="true" /> Reject request</button></div> : null}
          {screen === "refund" ? <div className={styles.refundScreen}><ArrowDownLeft aria-hidden="true" /><h2>Real refund ready</h2><div><b>Shop</b><ArrowUpRight aria-hidden="true" /><b>Kabir</b></div><p>No PIN is needed to receive money.</p><button disabled={experience.has("receive-refund")} onClick={receiveRefund} type="button">Receive ₹120</button></div> : null}
        </PhoneShell>
        <aside className={styles.moneyDirection}><h2>Money direction</h2><div className={screen === "collect" || screen === "refund" ? styles.arrowReverse : ""}><span>Kabir</span><i>₹ ➜</i><span>{screen === "collect" ? "Stranger" : "Shop"}</span></div><p>{screen === "collect" ? "Collect request: money leaves Kabir." : screen === "refund" ? "Refund: money reaches Kabir." : "Payment: money leaves Kabir."}</p></aside>
        {experience.has("receive-refund") ? <button className={styles.finishAction} onClick={experience.finish} type="button">Finish SurakshaPay</button> : null}
      </section>
    </CyberExperienceFrame>
  );
}
