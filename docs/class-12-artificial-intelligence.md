# Class 12 · Module 2: Artificial Intelligence

Implements W9–W16 of the approved 24 October 2026 syllabus, in order. All eight AI chapters are playable and assignable alongside Cybersecurity and Computational Thinking, giving Class 12 32 finished chapters across all four completed modules.

| Chapter | Interactive evidence |
| --- | --- |
| Set a decision and a baseline | Measurable brief, acceptance plan committed before a baseline reveal, same-case comparison |
| Protect the evaluation | Train/validation/test roles, related-family leakage audit, repaired frozen manifest |
| The model that scores 95 percent | Confusion-table calculations, threshold/cost/capacity comparison, changed-cost transfer |
| Vision, networks and changing inputs | Feature/layer/training/inference concepts, six illustrated inputs and supplied predictions, bounded shift table |
| The source-grounded research assistant | Fixed source pack, claim-support ledger, corrected citations, answer/abstain/refuse/escalate routes |
| When instructions arrive inside data | Trust-boundary diagram, harmless embedded-instruction example, response audit and new test case |
| Who benefits, who is missed? | Group recall denominators, model card, accessible alternatives, source scope and human override |
| AI go / revise / stop review | Assurance pack, revise recommendation, fresh privacy-failure stop decision and assistance disclosure |

Each chapter reuses the established six-scene narrated story, decision pause, three checked practice stages, first-answer scoring, visible retries, local resume and authenticated student/teacher assignment tracking. Teacher discussion and the individual viva form part of each planned 40-minute classroom lesson; the screen has no forced timer. Coding, model training at scale, a paid API and a live assistant are not required.

## Evidence and model limits

All examples, source passages and result sheets are synthetic classroom material. The 100-case development/validation sheets contain five true staff-review cases and 95 routine cases. The always-routine baseline is 95% accurate with 0% recall and undefined precision. The strict operating point is TP1/FP1/FN4/TN94 (accuracy 95%, precision 50%, recall 20%). Review-more is TP4/FP6/FN1/TN89 (accuracy 93%, precision 40%, recall 80%). Under the invented missed=5/extra-review=1 costs, their error costs are 25, 21 and 11. The preset review capacity is ten flagged requests per hundred. These are illustrative operating points, not scores measured by this app.

Operating-point choice uses development/validation evidence, not an independent final test. The split activity preserves all records, keeps related families together and requires non-empty training, validation and final-test partitions. It accepts multiple valid repairs. Renaming a consumed final set does not make it unseen: after answer-informed revision, use fresh independent final evidence. The classroom manifest process does not itself train a model or establish production performance.

The vision contact sheet shows a notebook and box under bright, dim and cropped views. All predictions are explicitly prepared examples: no vision model is run or measured. Bright has 2/2 correct; dim 1/2; crop 0/2, with one review and one wrong label. Review/abstention is kept separate from a wrong label. Six illustrative inputs cannot support universal robustness claims.

The harmless retrieved instruction attempt is quoted data inside the lesson. It never becomes an instruction to the runtime or a live agent. No real secret, private student record, external tool call or exfiltration is used. The lesson checks supported facts, privacy and human decision authority separately; one passing case is not a complete prompt-injection defence.

Group A and B each have ten examples and five actual positives. Recalls 4/5 and 2/5 show a gap in this pack, without proving its cause, an inherent user trait or general fairness. The model card names limitations, an accessible manual/staff route, appropriate source/data scope, attribution, human override and a stop-use owner. Visibility and attribution are not substitutes for checking permitted use.

Structured decisions are checked automatically. Assistance disclosure is self-reported; the teacher reviews authorship, the actual assurance pack and the individual viva separately. A privacy/authority failure stops the affected automatic path pending authorised review; no actual deployment or external incident action happens in the simulation.

## Primary references checked 25 October 2026

- [Google ML Crash Course: accuracy, precision and recall](https://developers.google.com/machine-learning/crash-course/classification/accuracy-precision-recall): definitions, denominators and limitations of overall accuracy on imbalanced tasks.
- [Google ML Crash Course: dividing datasets](https://developers.google.com/machine-learning/crash-course/overfitting/dividing-datasets): development versus final evaluation, duplicate-free partitions and test wear-out.
- [OWASP LLM Prompt Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html): instruction/data separation, limited authority, output checking and human review. The classroom example is deliberately harmless and does not claim a complete defence.

## Checks and assets

`node --test tests/class-12-ai.test.mjs` covers the catalogue, metric denominators, undefined metrics, changed costs, capacity, split integrity and alternate repairs, group/shift counts and story/media registration. `node scripts/class-12-ai-qa.cjs` exercises all eight stories and 24 practice stages on desktop and phone, wrong feedback, resume/completion, plan-before-reveal, split repair, threshold comparison, prepared input views, narration fallback and authenticated classroom grading against a disposable demo server.

The three ImageGen assets and exact prompts are documented in `docs/class-12-ai-artwork.md`. No new runtime dependency or backend endpoint was added.
