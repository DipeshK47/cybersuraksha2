"use client";

import { BellOff, Download, Flag, ShieldAlert, XCircle } from "lucide-react";
import { useState } from "react";
import type { CyberLessonComponentProps } from "../../lesson-types";
import { CyberExperienceFrame } from "../CyberExperienceFrame";
import { makeHints, makeMistake } from "../experience-content";
import type { ExperienceDefinition } from "../experience-types";
import { BrowserShell, type BrowserTab } from "../shells/BrowserShell";
import { useCyberExperience } from "../useCyberExperience";
import styles from "./middle-experiences.module.css";

const definition: ExperienceDefinition = {
  id: "giveaway-browser",
  objective: "Escape the fake giveaway.",
  place: "Browser safety challenge",
  guide: "Kabir",
  scenes: ["Open link", "Inspect", "Stop pressure", "Exit"],
  completionTitle: "The giveaway trap is closed!",
  completionSummary: "You inspected the address, stopped pop-ups and downloads, reported the page, and exited safely.",
  familyMove: "Inspect the address bar before opening a pretend prize page.",
  hints: makeHints("Inspect the browser first.", "Read the full address.", "Deny notifications and stop downloads.", "Report the page and return to the game tab."),
};

const tabs: BrowserTab[] = [
  { id: "game", title: "Block Buddies", address: "play.blockbuddies.demo" },
  { id: "prize", title: "FREE GEMS", address: "blockbuddies.gems-now.fake" },
];

export function GiveawayBrowserExperience({ runtime, ...props }: CyberLessonComponentProps & { assessmentIds: readonly [string, string, string] }) {
  const experience = useCyberExperience(runtime, definition, props.assessmentIds);
  const [activeTab, setActiveTab] = useState("prize");
  const [popup, setPopup] = useState<"none" | "notify" | "download">("notify");
  const [inspected, setInspected] = useState(false);

  function selectTab(tab: BrowserTab) { setActiveTab(tab.id); if (tab.id === "game" && experience.has("report-page")) experience.act({ id: "safe-exit", correct: true, assessmentIndex: 2, nextScene: 3 }); }
  function inspect() { setInspected(true); experience.act({ id: "inspect-address", correct: true, assessmentIndex: 0, nextScene: 1 }); }
  function unsafeClaim() { setPopup("download"); experience.act({ id: "claim-gems", correct: false, assessmentIndex: 1, unsafe: true, mistake: makeMistake("The claim started a download", "Countdowns and fake comments create pressure so you act before checking.", "Do not install files from prize links." ) }); }
  function denyPopup() { setPopup("none"); experience.act({ id: popup === "download" ? "stop-download" : "deny-notifications", correct: true, assessmentIndex: 1, nextScene: 2 }); }
  function report() { experience.act({ id: "report-page", correct: inspected && popup === "none", nextScene: 3 }); }

  const prizePopup = popup === "notify" ? <div className={styles.browserDialog}><BellOff aria-hidden="true" /><h2>Allow prize alerts?</h2><button onClick={denyPopup} type="button">Block alerts</button></div> : popup === "download" ? <div className={styles.browserDialog}><Download aria-hidden="true" /><h2>coin_booster.apk</h2><p>Download starting…</p><button onClick={denyPopup} type="button"><XCircle aria-hidden="true" /> Stop download</button></div> : undefined;

  return (
    <CyberExperienceFrame definition={definition} onHelp={experience.showHint} points={experience.points} runtime={runtime} scene={experience.scene} status={experience.has("safe-exit") ? "Back in the safe game tab." : inspected ? "Suspicious address found." : "Start with the address bar."}>
      <section className={styles.giveawayExperience} data-experience="giveaway-browser" data-interaction="browser">
        <BrowserShell activeTab={activeTab} address={tabs.find((tab) => tab.id === activeTab)?.address ?? ""} onBack={() => selectTab(tabs[0])} onClosePopup={denyPopup} onNavigate={inspect} onReload={() => undefined} onSelectTab={selectTab} popup={activeTab === "prize" ? prizePopup : undefined} secure={activeTab === "game"} tabs={tabs}>
          {activeTab === "prize" ? <div className={styles.giveawayPage}><span>🎮</span><h2>WIN 50,000 GEMS</h2><b>00:09</b><p>1,284 players claimed this minute!</p><div><i>“It worked!” — ProGamer123</i><i>“Fast!” — WinnerKid</i></div><button onClick={unsafeClaim} type="button">CLAIM FREE GEMS</button>{inspected ? <em><ShieldAlert aria-hidden="true" /> This is not the real game domain.</em> : null}</div> : <div className={styles.safeGamePage}><span>🧱</span><h2>Block Buddies</h2><p>Official fictional game tab</p></div>}
        </BrowserShell>
        <div className={styles.browserActions}><button disabled={!inspected || popup !== "none" || experience.has("report-page")} onClick={report} type="button"><Flag aria-hidden="true" /> Report page</button><button disabled={!experience.has("report-page")} onClick={() => selectTab(tabs[0])} type="button">Return to game tab</button></div>
        {experience.has("safe-exit") ? <button className={styles.finishAction} onClick={experience.finish} type="button">Finish browser rescue</button> : null}
      </section>
    </CyberExperienceFrame>
  );
}
