"use client";

import type { TaskDiagnosis } from "./task-feedback";
import { ui, useEvidenceLanguage } from "./ui";
import s from "./class8.module.css";

export function FeedbackPanel({ diagnosis }: { diagnosis?: TaskDiagnosis | null }) {
  const language = useEvidenceLanguage();
  if (!diagnosis) return null;
  const answerLabel = `${ui.answer[language]}: `;
  const submitted = diagnosis.submitted[language];
  return <section className={s.result} role="status" aria-live="polite" translate="no" data-task-feedback data-complete={diagnosis.complete} data-result={diagnosis.complete ? diagnosis.correct ? "correct" : "retry" : "incomplete"}>
    <h3>{diagnosis.summary[language]}</h3>
    <p><strong>{answerLabel}</strong>{submitted.startsWith(answerLabel) ? submitted.slice(answerLabel.length) : submitted}</p>
    {diagnosis.issues.length > 0 && <ul>{diagnosis.issues.map((issue, index) => <li key={`${issue.id}-${index}`}><strong>{issue.label[language]}: </strong>{issue.reason[language]}</li>)}</ul>}
    {diagnosis.supported.length > 0 && <details><summary>{ui.supported[language]}</summary><ul>{diagnosis.supported.map((item, index) => <li key={`${item.id}-${index}`}><strong>{item.label[language]}: </strong>{item.reason[language]}</li>)}</ul></details>}
    <p>{diagnosis.next[language]}</p>
  </section>;
}
