# Class 11 · Artificial Intelligence

Module 2 implements W9–W16 of the syllabus prepared on 24 October 2026: Is AI needed here?; Frame a useful AI problem; Repair the dataset; How a model learns; Measure mistakes, not confidence; Whose examples are missing?; Can this assistant be trusted?; AI evaluation review.

The module uses the same six-scene narrated story player, mid-story decision, three practice stages, feedback, retries, first-answer scoring, local resume and Classroom activity reporting as Cybersecurity. All eight chapters are assignable to Class 11. Computational Thinking and Cyber Fraud are also playable, completing all 32 Class 11 chapters.

## Classroom delivery

Each proposed 40-minute lesson includes 0–8 minutes of story and concept discussion, 8–30 minutes of lab work and revision, 30–37 minutes of independent transfer and explanation, and 37–40 minutes of reflection. The estimate includes teacher facilitation, pair discussion and oral or written reasoning; it is not a forced browser timer. Pilot pacing with the intended learners.

| Chapter | Main interactive work | Evidence and teacher follow-up |
| --- | --- | --- |
| Is AI needed here? | Task-to-approach mapping; exact bill-rule experiment; missing-policy transfer case. | Explain why a rule or a verified lookup may be sufficient. A generated statement does not create official policy. |
| Frame a useful AI problem | Structured brief; human-review routing; measurable acceptance criterion. | Defend the user, input, output, fixed test and review path. The 9/12 target is an exercise proposal, not a deployment standard. |
| Repair the dataset | Edit labels from supplied observations; distinguish duplicate, separate and conflicting records; record coverage limits. | S1 becomes Paper, S2 stays Metal, S3 is quarantined, S4 stays Plastic. A repeated S1 is removed; separate S8 is retained; conflicting S9 requires review. Do not invent unknown values. |
| How a model learns | Compare learning tasks; change selected labelled examples; commit predictions before revealing held-out labels; handle a fresh evaluation question. | The local nearest-example demo uses invented coordinates and Manhattan distance. Paper-only training mislabels the metal-like test case. Adding Metal examples changes the prediction. Equally close disagreeing labels produce a review request. This is not a real material-recognition system. |
| Measure mistakes, not confidence | Count model and baseline results; mark error cases; limit the claim. | Model 6/8, always-Recycle training-majority baseline 5/8 on the same pack. Model errors are E3 and E8. The denominator and sample limitation belong in the conclusion. |
| Whose examples are missing? | Compute group errors; inspect a controlled background change; choose collection and fallback actions. | Bright 1/8 errors; Dim 5/8 errors. Investigate representation and possible background proxies without claiming a sole cause. Preserve the original results. |
| Can this assistant be trusted? | Read a fixed source pack; audit claims; improve instructions; assemble a corrected attributed response. | F1 supports the meeting; F2 contradicts student glass handling; F3 does not establish the invented 90% reduction. The practice policy is fictional, not real-world operational advice. |
| AI evaluation review | Assemble evidence; recommend revision under known limitations; handle an untested evening setting; disclose assistance. | Keep manual review for unsupported conditions. Preserve the original evaluation and use fresh independent evidence after revision. Ask each learner to defend the decision on unfamiliar evidence. |

## Progress and assessment

The first two practice stages are drill checks; the third is transfer. The existing scoring policy keeps the first answer and records retries. Structured decisions have deterministic checks. The successful explanations form a local evidence record; feedback also flows through the existing learner activity history. This is not a new cross-device portfolio system, and the automatic checks do not assess the quality of an original written or oral defence.

Ask learners to explain uncertainty, alternatives and the effect of changing one assumption. Assistance disclosure is self-reported; a selected disclosure option does not verify authorship. Retain an individual teacher-reviewed explanation alongside group work.

## Boundaries and accessibility

No paid AI account, network inference, real student records or personal disclosures are required. The toy classifier runs locally on fixed synthetic examples. Its test labels are hidden in the interface until predictions are committed; this is an educational interaction, not a secure proctored exam. The entire test dataset is part of the shipped client code.

Native controls support keyboard and touch. Tables can scroll inside their container on narrow screens. Source material, labels and captions are available as text. Scene motion follows the existing reduced-motion behaviour, and narration failure retains caption navigation.

## Verification

`node --test tests/class-11-ai.test.mjs tests/class-11-security.test.mjs` checks content, integration contracts, evaluator edge cases and the existing module. `scripts/class-11-ai-qa.cjs` exercises every story and practice stage on desktop and phone, including wrong feedback, resume, completion, authenticated assignment grading and caption fallback. Use a disposable demo server for account and assignment checks.

Narration is generated by `scripts/story-narration.py` with the existing `am_fenrir` voice and real cue timing. The two new images were generated with built-in ImageGen, inspected and optimised into `public/cyber-missions/class-11/ai-sorting-lab.webp` and `ai-source-desk.webp`; `festival-planning.webp` is reused from Module 1.
