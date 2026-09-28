"use client";

import { Check, LockKeyhole, PartyPopper } from "lucide-react";
import type { CyberLessonComponentProps } from "../../lesson-types";
import { CyberExperienceFrame } from "../CyberExperienceFrame";
import { makeHints, makeMistake } from "../experience-content";
import type { ExperienceDefinition } from "../experience-types";
import { DragBoard, type DragCard } from "../shells/DragBoard";
import { useCyberExperience } from "../useCyberExperience";
import styles from "./lower-experiences.module.css";

const definition: ExperienceDefinition = {
  id: "privacy-backpack",
  objective: "Pack only safe details.",
  place: "Tara's privacy backpack",
  guide: "Tara",
  scenes: ["Pack", "Zip", "Share safely"],
  completionTitle: "Tara's privacy backpack is ready!",
  completionSummary: "You kept private details locked and shared only safe interests.",
  familyMove: "Sort three pretend details into safe to share and keep private.",
  hints: makeHints("Move one card.", "Read the card.", "Private details identify or locate someone.", "Put identifying details behind the lock."),
};

const cards: DragCard[] = [
  { id: "fruit", label: "Favourite fruit", icon: "🥭", destination: "share" },
  { id: "address", label: "Home address", icon: "🏠", destination: "private" },
  { id: "hobby", label: "Drawing", icon: "🎨", destination: "share" },
  { id: "phone", label: "Phone number", icon: "☎️", destination: "private" },
  { id: "game", label: "Game nickname", icon: "🎮", destination: "share" },
  { id: "school", label: "School photo", icon: "🏫", destination: "private" },
];

export function PrivacyBackpackExperience({ runtime, ...props }: CyberLessonComponentProps & { assessmentIds: readonly [string, string, string] }) {
  const experience = useCyberExperience(runtime, definition, props.assessmentIds);
  const placements = Object.fromEntries(
    cards.flatMap((card) => {
      const action = experience.actions.find((item) => item.startsWith(`pack-${card.id}-`));
      return action ? [[card.id, action.endsWith("private") ? "private" : "share"]] : [];
    }),
  );
  const packed = Object.keys(placements).length;

  function move(cardId: string, destination: string) {
    const card = cards.find((item) => item.id === cardId);
    if (!card) return;
    const correct = card.destination === destination;
    experience.act({
      id: `pack-${card.id}-${destination}`,
      correct,
      assessmentIndex: packed === 0 ? 0 : packed === 3 ? 1 : undefined,
      unsafe: !correct && destination === "share",
      nextScene: correct && packed >= cards.length - 1 ? 1 : 0,
      mistake: makeMistake("That card can reveal too much", "An address, phone number, or school photo can help someone find a child.", "Keep identifying details private."),
    });
  }

  function zip() {
    experience.act({ id: "zip-private-pocket", correct: packed === cards.length, assessmentIndex: 2, nextScene: 2 });
  }

  return (
    <CyberExperienceFrame definition={definition} onHelp={experience.showHint} points={experience.points} runtime={runtime} scene={experience.scene} status={packed < cards.length ? `${cards.length - packed} cards left to pack.` : experience.has("zip-private-pocket") ? "Private pocket locked." : "Zip the private pocket."}>
      <section className={styles.backpackExperience} data-experience="privacy-backpack" data-interaction="drag-sort">
        <div className={styles.backpackHeader}><div><span aria-hidden="true">🎒</span><b>{packed}/{cards.length}</b></div><p>Tap a card, then tap its pocket.</p></div>
        <DragBoard cards={cards} destinations={[{ id: "share", label: "Safe to share", icon: "💬" }, { id: "private", label: "Keep private", icon: "🔒" }]} onMove={move} placements={placements} />
        {packed === cards.length ? (
          <button className={styles.bigAction} disabled={experience.has("zip-private-pocket")} onClick={zip} type="button">
            {experience.has("zip-private-pocket") ? <Check aria-hidden="true" /> : <LockKeyhole aria-hidden="true" />}
            {experience.has("zip-private-pocket") ? "Pocket locked" : "Zip private pocket"}
          </button>
        ) : null}
        {experience.has("zip-private-pocket") ? <button className={styles.finishAction} onClick={experience.finish} type="button"><PartyPopper aria-hidden="true" /> Finish packing</button> : null}
      </section>
    </CyberExperienceFrame>
  );
}
