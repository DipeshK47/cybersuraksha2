"use client";

import { Flag, ShieldAlert, X } from "lucide-react";
import { useState } from "react";
import type { CyberLessonComponentProps } from "../../lesson-types";
import { CyberExperienceFrame } from "../CyberExperienceFrame";
import { makeHints, makeMistake } from "../experience-content";
import type { ExperienceDefinition } from "../experience-types";
import { GameShell, type GameDirection } from "../shells/GameShell";
import { useCyberExperience } from "../useCyberExperience";
import styles from "./lower-experiences.module.css";

const definition: ExperienceDefinition = {
  id: "coin-runner",
  objective: "Keep Tara's game safe.",
  place: "Coin Dash",
  guide: "Tara",
  scenes: ["Run", "Pop-up attack", "Report", "Resume"],
  completionTitle: "Coin Dash is safe again!",
  completionSummary: "You closed and reported a fake reward before returning to play.",
  familyMove: "Practise closing a pretend prize popup without pressing claim.",
  hints: makeHints("Collect three coins.", "Use the game arrows.", "A fake prize interrupts the game.", "Pause, close, report, then resume."),
};

export function CoinRunnerExperience({ runtime, ...props }: CyberLessonComponentProps & { assessmentIds: readonly [string, string, string] }) {
  const experience = useCyberExperience(runtime, definition, props.assessmentIds);
  const [player, setPlayer] = useState({ x: 12, y: 65 });
  const [coins, setCoins] = useState(0);
  const [popup, setPopup] = useState<0 | 1 | 2>(0);
  const [paused, setPaused] = useState(false);

  function move(direction: GameDirection) {
    if (popup || paused) return;
    setPlayer((current) => ({
      x: Math.min(90, Math.max(8, current.x + (direction === "right" ? 10 : direction === "left" ? -10 : 0))),
      y: direction === "up" ? 42 : direction === "down" ? 70 : current.y,
    }));
    if (direction === "right" && coins < 3) {
      const nextCoins = coins + 1;
      setCoins(nextCoins);
      if (nextCoins === 3) { setPopup(1); setPaused(true); experience.setScene(1); }
    }
  }

  function unsafeClaim() {
    setPopup(2);
    experience.act({ id: "claim-prize", correct: false, assessmentIndex: 0, unsafe: true, mistake: makeMistake("The prize opened another trap", "Real game rewards do not need a strange link, password, or download.", "Close unexpected prize layers instead of claiming them.") });
  }

  function closePopup() {
    setPopup(0);
    experience.act({ id: "close-popup", correct: true, assessmentIndex: 0, nextScene: 2 });
  }

  function report() {
    experience.act({ id: "report-popup", correct: true, assessmentIndex: 1, nextScene: 3 });
  }

  function resume() {
    setPaused(false);
    experience.act({ id: "resume-safe-game", correct: true, assessmentIndex: 2, nextScene: 3 });
  }

  const overlay = popup ? (
    <div className={styles.gamePopup} role="dialog" aria-modal="true">
      <b>{popup === 1 ? "YOU WON 9,999 COINS!" : "ONE LAST STEP!"}</b><span aria-hidden="true">🎁</span>
      <p>{popup === 1 ? "Tap now before time ends." : "Install Coin Booster."}</p>
      <button onClick={unsafeClaim} type="button">CLAIM NOW</button>
      <button aria-label="Close fake prize" onClick={closePopup} type="button"><X aria-hidden="true" /> Close</button>
    </div>
  ) : undefined;

  return (
    <CyberExperienceFrame definition={definition} onHelp={experience.showHint} points={experience.points + coins * 2} runtime={runtime} scene={experience.scene} status={experience.has("resume-safe-game") ? "Game restored safely." : popup ? "The game is covered. Protect it." : `${coins}/3 coins collected.`}>
      <section className={styles.gameExperience} data-experience="coin-runner" data-interaction="game">
        <GameShell onMove={move} onTogglePause={() => setPaused((value) => !value)} overlay={overlay} paused={paused} player={player} score={coins} title="Coin Dash" world={<><div className={styles.coinRoad}>{[24, 48, 72].map((left, index) => <span className={index < coins ? styles.coinTaken : ""} key={left} style={{ left: `${left}%` }}>🪙</span>)}</div><div className={styles.gameObstacles}><i /><i /><i /></div></>} />
        {!popup && experience.has("close-popup") && !experience.has("report-popup") ? <button className={styles.reportAction} onClick={report} type="button"><ShieldAlert aria-hidden="true" /> Report fake reward</button> : null}
        {experience.has("report-popup") && !experience.has("resume-safe-game") ? <button className={styles.bigAction} onClick={resume} type="button"><Flag aria-hidden="true" /> Resume game</button> : null}
        {experience.has("resume-safe-game") ? <button className={styles.finishAction} onClick={experience.finish} type="button">Finish Coin Dash</button> : null}
      </section>
    </CyberExperienceFrame>
  );
}
