"use client";

import { AlertTriangle, CheckCircle2, KeyRound, ShieldAlert } from "lucide-react";
import { useState } from "react";
import type { CyberLessonComponentProps } from "../../lesson-types";
import { CyberExperienceFrame } from "../CyberExperienceFrame";
import { makeHints, makeMistake } from "../experience-content";
import type { ExperienceDefinition } from "../experience-types";
import { BrowserShell, type BrowserTab } from "../shells/BrowserShell";
import { SimulationInput } from "../shells/SimulationInput";
import { useCyberExperience } from "../useCyberExperience";
import styles from "./upper-experiences.module.css";

const definition: ExperienceDefinition = {
  id: "fake-login-browser",
  objective: "Find the fake login.",
  place: "Chrome-style browser lab",
  guide: "Meera",
  scenes: ["Enter demo details", "See exposure", "Inspect address", "Recover"],
  completionTitle: "Meera recovered the demo account!",
  completionSummary: "You experienced the fake login, inspected its address, returned to the known tab, and changed the fictional password.",
  familyMove: "Compare a familiar login address with one look-alike address.",
  hints: makeHints("Use only the demo details.", "Submit to see the simulated risk.", "Read the address from right to left.", "Return to the known tab and recover."),
};

const tabs: BrowserTab[] = [
  { id: "school", title: "DPS Demo Portal", address: "portal.dps-demo.school" },
  { id: "login", title: "Session expired", address: "dps-school.login-check.fake" },
];

export function FakeLoginBrowserExperience({ runtime, ...props }: CyberLessonComponentProps & { assessmentIds: readonly [string, string, string] }) {
  const experience = useCyberExperience(runtime, definition, props.assessmentIds);
  const [activeTab, setActiveTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [inspected, setInspected] = useState(false);
  const [recovered, setRecovered] = useState(false);

  function submitDemo() {
    const demoOnly = email === "meera@student.demo" && password === "Demo-Rain-27!";
    if (!demoOnly) return;
    setSubmitted(true);
    experience.act({ id: "submit-demo-login", correct: false, assessmentIndex: 0, unsafe: true, nextScene: 1, mistake: makeMistake("The fake page captured the demo details", "The page copied a familiar design but its real domain ends in login-check.fake.", "Inspect the address before entering any login." ) });
  }

  function inspectAddress() { setInspected(true); experience.act({ id: "inspect-domain", correct: submitted, assessmentIndex: 1, nextScene: 2 }); }
  function selectTab(tab: BrowserTab) { setActiveTab(tab.id); if (tab.id === "school" && inspected) experience.setScene(3); }
  function recover() { setRecovered(true); setEmail(""); setPassword(""); experience.act({ id: "recover-account", correct: activeTab === "school" && inspected, assessmentIndex: 2, nextScene: 3 }); }

  const popup = submitted && activeTab === "login" ? <div className={styles.loginAlert}><AlertTriangle aria-hidden="true" /><h2>Demo account alert</h2><p>The fictional password was sent to this fake page.</p><button onClick={inspectAddress} type="button"><ShieldAlert aria-hidden="true" /> Inspect address</button></div> : undefined;

  return (
    <CyberExperienceFrame definition={definition} onHelp={experience.showHint} points={experience.points} runtime={runtime} scene={experience.scene} status={recovered ? "Fictional account recovered." : inspected ? "Fake domain identified. Return to the known tab." : submitted ? "Demo exposure simulated." : "Fill only the supplied demo details."}>
      <section className={styles.loginExperience} data-experience="fake-login-browser" data-interaction="browser">
        <BrowserShell activeTab={activeTab} address={tabs.find((tab) => tab.id === activeTab)?.address ?? ""} onBack={() => selectTab(tabs[0])} onClosePopup={inspectAddress} onNavigate={inspectAddress} onReload={() => undefined} onSelectTab={selectTab} popup={popup} secure={activeTab === "school"} tabs={tabs}>
          {activeTab === "login" ? <div className={styles.fakeLoginPage}><div className={styles.schoolLogo}>DPS<br /><small>DEMO</small></div><h2>Session expired</h2><p>Sign in again to continue.</p><SimulationInput fictionalValue="meera@student.demo" label="Fictional student email" onChange={setEmail} value={email} /><SimulationInput fictionalValue="Demo-Rain-27!" label="Fictional password" onChange={setPassword} type="password" value={password} /><button disabled={submitted || email !== "meera@student.demo" || password !== "Demo-Rain-27!"} onClick={submitDemo} type="button"><KeyRound aria-hidden="true" /> Sign in to demo</button>{inspected ? <div className={styles.domainBreakdown}><b>dps-school</b><span>.login-check</span><strong>.fake</strong></div> : null}</div> : <div className={styles.realPortal}><CheckCircle2 aria-hidden="true" /><h2>Known school portal</h2><p>Address ends in <b>dps-demo.school</b></p><button disabled={!inspected || recovered} onClick={recover} type="button"><KeyRound aria-hidden="true" /> Change fictional password</button></div>}
        </BrowserShell>
        {recovered ? <button className={styles.finishAction} onClick={experience.finish} type="button">Finish browser recovery</button> : null}
      </section>
    </CyberExperienceFrame>
  );
}
