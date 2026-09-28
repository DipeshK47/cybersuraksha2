"use client";

import { Check, KeyRound, LogOut, ShieldCheck, Smartphone, UserRoundCheck } from "lucide-react";
import { useState } from "react";
import type { CyberLessonComponentProps } from "../../lesson-types";
import { CyberExperienceFrame } from "../CyberExperienceFrame";
import { makeHints, makeMistake } from "../experience-content";
import type { ExperienceDefinition } from "../experience-types";
import { useCyberExperience } from "../useCyberExperience";
import styles from "./middle-experiences.module.css";

const definition: ExperienceDefinition = {
  id: "account-centre",
  objective: "Strengthen Kabir's account.",
  place: "Block Buddies account centre",
  guide: "Kabir",
  scenes: ["Passphrase", "Verification", "Devices", "Protected"],
  completionTitle: "Kabir's account shield is strong!",
  completionSummary: "You created a passphrase, enabled verification, and removed an unknown session.",
  familyMove: "Check one account together for verification and unknown sessions.",
  hints: makeHints("Open one protection.", "Build a long passphrase from unrelated words.", "Verification adds another check.", "Remove devices you do not recognise."),
};

const wordTiles = ["river", "mango", "rocket", "purple", "school", "kabir"];

export function AccountCentreExperience({ runtime, ...props }: CyberLessonComponentProps & { assessmentIds: readonly [string, string, string] }) {
  const experience = useCyberExperience(runtime, definition, props.assessmentIds);
  const [words, setWords] = useState<string[]>([]);
  const protections = ["save-passphrase", "enable-verification", "remove-session"].filter(experience.has).length;

  function toggleWord(word: string) {
    setWords((current) => current.includes(word) ? current.filter((item) => item !== word) : [...current, word].slice(0, 4));
  }

  function savePassphrase() {
    const safe = words.length >= 3 && !words.includes("school") && !words.includes("kabir");
    experience.act({ id: "save-passphrase", correct: safe, assessmentIndex: 0, nextScene: safe ? 1 : 0, mistake: makeMistake("Remove personal clues", "Names and school words are easier for someone who knows Kabir to guess.", "Use three or more unrelated words." ) });
  }

  function enableVerification() { experience.act({ id: "enable-verification", correct: true, assessmentIndex: 1, nextScene: 2 }); }
  function removeSession() { experience.act({ id: "remove-session", correct: true, assessmentIndex: 2, nextScene: 3 }); }

  return (
    <CyberExperienceFrame definition={definition} onHelp={experience.showHint} points={experience.points} runtime={runtime} scene={experience.scene} status={`${protections}/3 protections active.`}>
      <section className={styles.accountExperience} data-experience="account-centre" data-interaction="settings">
        <aside className={styles.accountNav}><div><span>🧑🏽</span><b>Kabir_Play</b><small>Fictional game account</small></div>{[[KeyRound, "Passphrase"], [ShieldCheck, "Verification"], [Smartphone, "Devices"]].map(([Icon, label]) => <span key={label as string}><Icon aria-hidden="true" />{label as string}</span>)}</aside>
        <div className={styles.settingsPanels}>
          <article className={experience.has("save-passphrase") ? styles.settingDone : ""}><header><KeyRound aria-hidden="true" /><div><h2>Passphrase</h2><p>Choose unrelated words.</p></div>{experience.has("save-passphrase") ? <Check aria-hidden="true" /> : null}</header><div className={styles.passphrasePreview}>{words.length ? words.join("-") : "Pick three words"}</div><div className={styles.wordTiles}>{wordTiles.map((word) => <button aria-pressed={words.includes(word)} disabled={experience.has("save-passphrase")} key={word} onClick={() => toggleWord(word)} type="button">{word}</button>)}</div>{!experience.has("save-passphrase") ? <button className={styles.primaryAction} onClick={savePassphrase} type="button">Save passphrase</button> : null}</article>
          <article className={experience.has("enable-verification") ? styles.settingDone : ""}><header><ShieldCheck aria-hidden="true" /><div><h2>Login verification</h2><p>Confirm new logins.</p></div></header><button aria-pressed={experience.has("enable-verification")} className={styles.toggle} disabled={!experience.has("save-passphrase") || experience.has("enable-verification")} onClick={enableVerification} type="button"><i />{experience.has("enable-verification") ? "On" : "Turn on"}</button></article>
          <article className={experience.has("remove-session") ? styles.settingDone : ""}><header><Smartphone aria-hidden="true" /><div><h2>Signed-in devices</h2><p>Review active sessions.</p></div></header><div className={styles.deviceSession}><UserRoundCheck aria-hidden="true" /><span><b>{"Kabir's tablet"}</b><small>Delhi · now</small></span><em>YOU</em></div><div className={styles.deviceSession}><Smartphone aria-hidden="true" /><span><b>Unknown phone</b><small>Unknown place · 8 min</small></span><button disabled={!experience.has("enable-verification") || experience.has("remove-session")} onClick={removeSession} type="button"><LogOut aria-hidden="true" /> Sign out</button></div></article>
        </div>
        {protections === 3 ? <button className={styles.finishAction} onClick={experience.finish} type="button"><ShieldCheck aria-hidden="true" /> Finish protection</button> : null}
      </section>
    </CyberExperienceFrame>
  );
}
