# Class 11 · Computational Thinking

Module 3 implements W17–W24 of the 24 October 2026 syllabus. All eight chapters are playable and assignable alongside Cybersecurity, AI and Cyber Fraud, giving Class 11 32 available chapters.

The six-scene narrated stories, gated story decision, three practice stages, feedback, first-answer scoring, retries, local resume and Classroom reporting use the same components and progress runtime as the earlier modules. Two original scholarship-desk illustrations accompany the story introductions and selected activities.

## Delivery and evidence

The proposed 40 minutes per lesson includes teacher facilitation: 0–8 story and concept, 8–30 lab and revision, 30–37 individual transfer and explanation, 37–40 reflection. Browser completion alone is not a claim of 40 minutes of learning. Pilot pacing with the intended class.

| Chapter | Interactive work | Evidence / teacher follow-up |
| --- | --- | --- |
| Decompose the scholarship desk | Build the process order; separate facts, assumptions and constraints; select scope boundaries. | Intake → checking → teacher review → communication. Ask what each step receives and produces. Real awards and payments are outside the workflow. |
| Model only what matters | Choose minimal fields, inspect supplied records, run an ID-keyed lookup and apply validation routes. | Record/list/keyed lookup distinctions; ID, score and document-status dictionary; preserve conflicts and missing values rather than overwriting them. |
| Make the rules explicit | Complete a decision table, alter the actual score comparator and Boolean join, then order pseudocode. | Fictional ≥60 AND complete-documents rule, including the exact boundary, low score, incomplete and missing-data routes. |
| Trace and debug a decision | Run an off-by-one loop trace, fix its guard, repair the boundary comparator and distinguish error types. | Preserve the failing row and successful rerun. Indexes for a three-item list are 0, 1, 2. Syntax-like notation mistakes differ from valid-looking incorrect logic. |
| Search and sort with purpose | Step through linear search, sort practice IDs, step through binary search and choose methods for fresh situations. | Target 60 needs 5 checks in the supplied shuffled linear trace and 2 checks in the sorted binary trace. Sorting preparation is excluded from these counts. Neither result proves one method always wins. |
| Reuse a reliable step | Specify a function contract, predict and run three shared calls, then remove a score field. | One validated function; missing is not zero; false document status is not unknown. Callers preserve human review. |
| Test the boundaries | State six expected outcomes, run and repair a regression pack, and handle new invalid/incomplete cases. | Ordinary, exact boundary, below boundary, empty list, duplicate IDs and missing score. Passing a finite pack is not proof for all inputs. |
| Algorithm review board | Update the shared threshold to ≥70, rerun the changed pack, compare designs and respond to conflicting records. | Separate legitimate expectation changes from regressions. Preserve missing/duplicate safeguards, name an alternative and defend a human handoff. |

## Exact exercise semantics

These are invented classroom criteria, not financial guidance or actual scholarship rules. A synthetic ID is one uppercase letter and two digits; surrounding whitespace is trimmed for validation and duplicate detection. A supplied score must be a finite number from 0 to 100. A null score or unknown document flag requests missing-data review. An explicitly incomplete flag is false, not missing. With valid complete input, the score threshold is applied before the incomplete-document path. Real awards stay with the responsible teacher.

Duplicate IDs are preserved and flagged across the supplied batch. The keyed lookup demonstration uses an explicitly unique supplied table; conflicts must be resolved before trusting a unique lookup. The rule workbench intentionally offers faulty `>` and `OR` choices to demonstrate their consequences; these are classroom simulations, not operational decisions.

The trace helper shows a failed extra iteration explicitly. Binary search refuses an unsorted list. The six-case runner compares actual outputs with stated expectations and does not discard additional outputs to manufacture a pass. The revised threshold pack changes the score-60 expectation, includes the new score-70 boundary and reruns empty, duplicate and missing-data protections.

## Assessment and access

The first two practice stages are drill checks and the third is transfer. Existing scoring retains each first answer; later corrections remain visible as learning activity. Successful explanations are shown in a local evidence record, with feedback in the existing activity history. This is not a new cross-device portfolio system. Teacher review assesses an original spoken or written defence; selecting structured answers cannot establish authorship or independent reasoning.

All inputs are fictional; no student financial data or real account access is required. Controls support keyboard and touch, text remains available with reduced motion, and captions work when narration is unavailable. Coding is optional: learners can explain the same logic through the visible tables, traces and pseudocode.

## Local verification

Use Node 22.13 or newer. `node --test tests/class-11-ct.test.mjs` covers catalogue integration, validation, Boolean boundaries, duplicate preservation, empty loops, search preconditions and regression packs. The browser QA script exercises all stories and practice stages on desktop and phone, including wrong answers, retries, resume, completion and authenticated assignment marks. Account and assignment checks require a disposable demo server.

Narration uses the existing Kokoro `am_fenrir` voice and real cue timing through `scripts/story-narration.py`. Built-in ImageGen created the two inspected illustrations in `public/cyber-missions/class-11/ct-scholarship-desk.webp` and `ct-logic-workbench.webp`; prompts are recorded in `docs/class-11-ct-artwork.md`.
