"use client";

import { Bot, Play, RefreshCcw, TestTube2 } from "lucide-react";
import { useState } from "react";
import type { CyberLessonComponentProps } from "../../lesson-types";
import { CyberExperienceFrame } from "../CyberExperienceFrame";
import { makeHints, makeMistake } from "../experience-content";
import type { ExperienceDefinition } from "../experience-types";
import { DragBoard, type DragCard } from "../shells/DragBoard";
import { useCyberExperience } from "../useCyberExperience";
import styles from "./lower-experiences.module.css";

const definition: ExperienceDefinition = {
  id: "training-conveyor",
  objective: "Teach Byte with examples.",
  place: "AI training factory",
  guide: "Tara",
  scenes: ["Label examples", "Train Byte", "Test", "Repair"],
  completionTitle: "Byte learned a clearer rule!",
  completionSummary: "You trained, tested, and repaired an AI using clear examples.",
  familyMove: "Sort household objects with one clear rule, then test a new object.",
  hints: makeHints("Label each example.", "Look at the shape, not its name.", "Byte learns from the examples you provide.", "Use both round and not-round examples."),
};

const cards: DragCard[] = [
  { id: "ball", label: "Ball", icon: "⚽", destination: "round" },
  { id: "book", label: "Book", icon: "📘", destination: "not-round" },
  { id: "plate", label: "Plate", icon: "🍽️", destination: "round" },
  { id: "block", label: "Block", icon: "🧱", destination: "not-round" },
];

export function TrainingConveyorExperience({ runtime, ...props }: CyberLessonComponentProps & { assessmentIds: readonly [string, string, string] }) {
  const experience = useCyberExperience(runtime, definition, props.assessmentIds);
  const [trained, setTrained] = useState(false);
  const [tested, setTested] = useState(false);
  const placements = Object.fromEntries(cards.flatMap((card) => {
    const action = experience.actions.find((item) => item.startsWith(`label-${card.id}-`));
    return action ? [[card.id, action.endsWith("not-round") ? "not-round" : "round"]] : [];
  }));
  const labelled = Object.keys(placements).length;

  function label(cardId: string, destination: string) {
    const card = cards.find((item) => item.id === cardId);
    if (!card) return;
    experience.act({ id: `label-${cardId}-${destination}`, correct: card.destination === destination, assessmentIndex: labelled === 0 ? 0 : undefined, mistake: makeMistake("Check the outline", "A ball and plate have round outlines. A book and block have corners.", "Label using the visible feature, not the object name.") });
  }

  function train() { setTrained(true); experience.act({ id: "train-byte", correct: labelled === cards.length, nextScene: 2 }); }
  function test() { setTested(true); experience.act({ id: "test-wheel", correct: trained, assessmentIndex: 1, nextScene: 3 }); }
  function repair() { experience.act({ id: "repair-examples", correct: tested, assessmentIndex: 2, nextScene: 3 }); }

  return (
    <CyberExperienceFrame definition={definition} onHelp={experience.showHint} points={experience.points} runtime={runtime} scene={experience.scene} status={experience.has("repair-examples") ? "Training set repaired." : tested ? "Byte needs one clearer example." : trained ? "Test Byte with a new object." : `${cards.length - labelled} examples need labels.`}>
      <section className={styles.trainingExperience} data-experience="training-conveyor" data-interaction="drag-sort">
        <div className={styles.trainingMachine}><Bot aria-hidden="true" /><div><i className={trained ? styles.machineActive : ""} /><b>{trained ? "TRAINED" : "WAITING"}</b></div><span>{tested ? "🛞" : "📦"}</span></div>
        {!trained ? <DragBoard cards={cards} destinations={[{ id: "round", label: "Round", icon: "⭕" }, { id: "not-round", label: "Not round", icon: "🔷" }]} onMove={label} placements={placements} /> : null}
        {labelled === cards.length && !trained ? <button className={styles.bigAction} onClick={train} type="button"><Play aria-hidden="true" /> Train Byte</button> : null}
        {trained && !tested ? <div className={styles.testBay}><span>🛞</span><h2>New object: wheel</h2><button onClick={test} type="button"><TestTube2 aria-hidden="true" /> Run test</button></div> : null}
        {tested && !experience.has("repair-examples") ? <div className={styles.repairBay}><span>⚠️</span><h2>Byte called it “not round.”</h2><p>Add another clear round example.</p><button onClick={repair} type="button"><RefreshCcw aria-hidden="true" /> Add coin example 🪙</button></div> : null}
        {experience.has("repair-examples") ? <button className={styles.finishAction} onClick={experience.finish} type="button"><Bot aria-hidden="true" /> Finish training</button> : null}
      </section>
    </CyberExperienceFrame>
  );
}
