"use client";

import { ArrowRight } from "lucide-react";
import type { ChoiceTask } from "../../../../data/lesson-content";
import { useEvidenceLanguage } from "../class8/ui";
import w from "./worlds.module.css";

/** The lesson's decision, played inside the world: pick an option to watch what it does, then lock it in. */
export function DecisionDeck({ task, picked, onPick, onLock, locked }: { task: ChoiceTask; picked: string; onPick: (id: string) => void; onLock: () => void; locked: boolean }) {
  const lang = useEvidenceLanguage();
  const chosen = task.options.find(option => option.id === picked);
  const labels = lang === "hi"
    ? { lock: "यही चुनें", hint: "एक विकल्प चुनकर देखें कि स्टेज पर क्या होता है।", what: "ऐसा होगा: " }
    : { lock: "Lock in this choice", hint: "Pick an option to see what it does on the stage.", what: "What would happen: " };
  return <div className={w.deck} translate="no">
    <h3 className={w.deckPrompt} data-exercise-prompt>{task.prompt[lang]}</h3>
    <p className={w.deckContext}>{task.context[lang]}</p>
    <div className={w.choiceGrid} role="group" aria-label={task.prompt[lang]}>
      {task.options.map((option, index) => <button type="button" key={option.id} className={w.choiceCard} aria-pressed={picked === option.id} disabled={locked} onClick={() => onPick(option.id)}>
        <b aria-hidden="true">{String.fromCharCode(65 + index)}</b><span>{option.label[lang]}</span></button>)}
    </div>
    {chosen ? <p className={w.preview} role="status" aria-live="polite"><strong>{labels.what}</strong>{chosen.feedback[lang]}</p> : <p className={w.deckHint}>{labels.hint}</p>}
    <div className={w.deckActions}><button type="button" className={w.lockIn} disabled={!picked || locked} onClick={onLock}>{labels.lock}<ArrowRight size={16} aria-hidden="true" /></button></div>
  </div>;
}
