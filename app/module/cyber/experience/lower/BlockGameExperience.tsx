"use client";

import { Ban, Blocks, Camera, MessageCircleWarning, ShieldCheck } from "lucide-react";
import { useState } from "react";
import type { CyberLessonComponentProps } from "../../lesson-types";
import { CyberExperienceFrame } from "../CyberExperienceFrame";
import { makeHints, makeMistake } from "../experience-content";
import type { ExperienceDefinition } from "../experience-types";
import { GameShell, type GameDirection } from "../shells/GameShell";
import { useCyberExperience } from "../useCyberExperience";
import styles from "./lower-experiences.module.css";

const definition: ExperienceDefinition = {
  id: "block-game",
  objective: "Play without sharing secrets.",
  place: "Block Buddies",
  guide: "Tara",
  scenes: ["Collect blocks", "Build bridge", "Protect chat", "Play again"],
  completionTitle: "Tara protected her game!",
  completionSummary: "You kept the game fun without sharing private information.",
  familyMove: "Choose a trusted adult to tell about an uncomfortable game message.",
  hints: makeHints("Collect two blocks.", "Move through the world.", "A stranger interrupts after the bridge is built.", "Save, block, and tell before returning."),
};

export function BlockGameExperience({ runtime, ...props }: CyberLessonComponentProps & { assessmentIds: readonly [string, string, string] }) {
  const experience = useCyberExperience(runtime, definition, props.assessmentIds);
  const [player, setPlayer] = useState({ x: 10, y: 66 });
  const [blocks, setBlocks] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);

  function move(direction: GameDirection) {
    if (chatOpen) return;
    setPlayer((current) => ({ x: Math.min(90, Math.max(8, current.x + (direction === "right" ? 12 : direction === "left" ? -12 : 0))), y: direction === "up" ? 43 : 66 }));
    if (direction === "right" && blocks < 2) setBlocks((value) => value + 1);
  }

  function build() {
    if (blocks < 2) return;
    experience.act({ id: "build-bridge", correct: true, nextScene: 2 });
    setChatOpen(true);
  }

  function saveEvidence() { experience.act({ id: "save-chat", correct: true, assessmentIndex: 0 }); }
  function blockPlayer() { experience.act({ id: "block-player", correct: experience.has("save-chat"), assessmentIndex: 1, mistake: makeMistake("Save the message first", "A screenshot or saved report helps a trusted adult understand what happened.", "Save evidence before blocking when it is safe to do so.") }); }
  function tellAdult() { experience.act({ id: "tell-adult", correct: experience.has("block-player"), assessmentIndex: 2, nextScene: 3, mistake: makeMistake("Protect the game first", "Block the stranger so new questions cannot arrive while you get help.", "Save, block, then tell a trusted adult.") }); }
  function unsafeReply() { experience.act({ id: "share-school", correct: false, assessmentIndex: 0, unsafe: true, mistake: makeMistake("School details stay private", "A game player does not need a school name or photo to play.", "Never reply with details that identify or locate you.") }); }

  const overlay = chatOpen ? (
    <div className={styles.gameChat} role="dialog" aria-modal="true"><header><span>🧙</span><div><b>PixelRaja_47</b><small>New player</small></div></header><p>Which school do you go to? Send a photo!</p><button onClick={unsafeReply} type="button">Reply with school</button><div><button disabled={experience.has("save-chat")} onClick={saveEvidence} type="button"><Camera aria-hidden="true" /> Save</button><button disabled={!experience.has("save-chat") || experience.has("block-player")} onClick={blockPlayer} type="button"><Ban aria-hidden="true" /> Block</button><button disabled={!experience.has("block-player")} onClick={tellAdult} type="button"><ShieldCheck aria-hidden="true" /> Tell adult</button></div></div>
  ) : undefined;

  return (
    <CyberExperienceFrame definition={definition} onHelp={experience.showHint} points={experience.points + blocks * 3} runtime={runtime} scene={experience.scene} status={experience.has("tell-adult") ? "The stranger is blocked. Play is safe." : chatOpen ? "Use the chat safety tools." : `${blocks}/2 blocks collected.`}>
      <section className={styles.gameExperience} data-experience="block-game" data-interaction="game">
        <GameShell onMove={move} onTogglePause={() => undefined} overlay={overlay} paused={chatOpen} player={player} score={blocks} title="Block Buddies" world={<div className={styles.blockWorld}><span>🌳</span><span>🧱</span><span>🧱</span><div className={experience.has("build-bridge") ? styles.bridgeBuilt : ""}>{[0, 1, 2, 3].map((item) => <i key={item} />)}</div></div>} />
        {blocks >= 2 && !experience.has("build-bridge") ? <button className={styles.bigAction} onClick={build} type="button"><Blocks aria-hidden="true" /> Build the bridge</button> : null}
        {experience.has("tell-adult") ? <button className={styles.finishAction} onClick={experience.finish} type="button"><MessageCircleWarning aria-hidden="true" /> Return to game</button> : null}
      </section>
    </CyberExperienceFrame>
  );
}
