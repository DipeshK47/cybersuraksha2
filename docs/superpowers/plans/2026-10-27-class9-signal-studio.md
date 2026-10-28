# Class 9 Signal Studio implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Use dispatching-parallel-agents for the four independent author files; shared types, integration and Git writes remain controlled sequentially.

**Goal:** Deliver the approved 32-chapter bilingual Class 9 course, Indian English narration and explicit wrong-answer explanations in Class 8/9 story decisions and practice labs.

**Architecture:** Keep the existing story player, practice runtime and LMS access/reporting boundaries. Share a small typed chapter/task contract, validators, practical controls and evidence renderer; supply Class 9-specific authored data, original characters and illustrations. Add structured bilingual diagnosis around checked work, then compile local stories, translations and measured Indian English MP3s.

**Tech stack:** TypeScript, React, CSS modules, vinext/Workers/D1, Node 24, Python with edge-tts and ffmpeg for authoring tools only.

## Global constraints

- Exactly 32 new Class 9 chapters, eight each in Cybersecurity, Artificial Intelligence, Computational Thinking and Cyber Fraud, in the approved outline order.
- English and conversational Hindi text; six scenes with 200–225 English caption words, one explained story decision and three practical tasks per chapter. Existing lesson metadata remains 40 minutes.
- New central characters Reva and Nikhil, with original illustrated expressions and worlds. No Class 8 character displayed under a new name.
- Use `en-IN-NeerjaNeural`, rate `+0%`, for Class 9 English narration. Generate local files with real scene cues and hashes bound to speech text, voice and rate. Preserve Class 8 recordings.
- After a wrong check, name the actual answer, state that it is incorrect, explain each wrong/missing selection and offer a useful next step. Feedback must work in both lesson decisions and practice, in both languages. Invalidate stale feedback after editing.
- Incomplete UI work receives a completion prompt before scored submission. A complete wrong first submission remains scored wrong after correction. Preserve real submitted work in the notebook and bounded teacher activity events.
- Route entry costs apply on every entered cell, including repeat visits; the starting cell is free. Unspecified cell costs are one. Preserve unweighted Class 8 routes. Test the current route/model/permission configuration before checking it.
- Use supplied fictional data and local classroom simulations. No real payments, account secrets, personal datasets, electrical repair instructions or live AI services.
- Keep all existing grades, lesson identities, stored history, school isolation and server grading semantics valid. Current Class 9 registration must contain exactly 32 new playable IDs; retain legacy IDs for history and other grades.
- No production deployment, dependency upgrades, authentication changes or database migrations. Authoring dependencies stay in the disposable tool environment.
- Authors own disjoint files and never commit or modify shared contracts. The controller owns Git, integration and authoring media. Task reviews are read-only.

## File and interface map

- Shared source contract: `app/data/lesson-content.ts`. Compatibility aliases: `app/data/class8/types.ts`; new aliases: `app/data/class9/types.ts`.
- Four author files: `app/data/class9/{security,ai,ct,fraud}.ts`, exporting `class9SecurityChapters`, `class9AiChapters`, `class9CtChapters`, `class9FraudChapters` respectively.
- Ordered library: `app/data/class9/index.ts` exports `class9Chapters` and `getClass9Chapter(slug)`.
- Registrations: `app/data/class-9-missions.ts`, `app/data/class-9-curriculum.ts`, existing `cyber-lessons.ts`, `curriculum.ts`, `module-registry.ts`, lesson registry.
- Shared behavior: existing `class8/{task-evaluation,task-evidence,TaskBoard,Class8Stories,Class8Lesson,ui}.ts[x]`, new `class8/{task-feedback.ts,FeedbackPanel.tsx}`, optional story-player/type extension.
- Class 9 presentation: `app/module/cyber/lessons/class9/{Class9Lesson,Class9Stories,Class9Characters,Class9Illustration}.tsx`, `class9.module.css`.
- Assets: `scripts/build-class9-assets.mjs`, `scripts/narrate-class9.py`, generated `class9-*.json/tsx`, `public/audio/cyber/class9-*/story.mp3`, `public/locales/class9-hi.json` and merged Hindi catalogue.
- Verification: `tests/class-9-{curriculum,feedback,media}.test.mjs`, shared helpers, `tests/class-9-browser-qa.py`, existing Class 8 and backend tests, `docs/class-9-delivery.md`.

Contract: `LessonChapter` retains the full Class 8 shape and eight existing theme keys; the Class 9 illustration interprets those themes in its own world. `scenes[].speech?: string` optionally separates narration from visible captions. All authored text uses `L={en,hi}` and `l(en,hi)`. Stable answer IDs are never translated.

Optional task explanations: `NumberTask.fields[].explanation?: L`; `OrderTask.stepReasons?: L[]` (one per expected slot). Class 9 authors supply these fields. `RouteTask.cellCosts?: Record<string,number>` maps cell indexes to positive integer entry costs; `maxCost?:number` bounds total cost. Existing `maxSteps` still bounds moves.

## Task 1: Shared contract, diagnosis and reliable checks

**Owner:** one implementation agent; root supplies the initial common-contract compatibility refactor. **Files:** the shared behavior files above, `tests/class-9-feedback.test.mjs`; no author data or Class 9 presentation edits.

**Interfaces:** preserve `evaluateTask(task,answer)->{correct,feedback:L}`. Extend `simulateRoute` to return `cost:number`. Export `diagnoseTask(task,answer)` with `{complete:boolean,correct:boolean,submitted:L,summary:L,issues:{id:string,label:L,reason:L}[],supported:{id:string,label:L,reason:L}[],next:L}`. Export the existing lesson body as `StructuredLesson` with optional `chapter:LessonChapter` and `Illustration` component; retain `Class8Lesson` as the default Class 8 wrapper. Root will pass Class 9 data and illustration into it.

- [x] Write behavioral tests before implementation. Example: `const d=diagnoseTask(selectTask,['bad']); assert.equal(d.complete,true); assert.equal(d.correct,false); assert.ok(d.issues.some(x=>x.id==='bad')); assert.ok(d.issues.some(x=>x.id==='missing-good'));`. Check submitted labels and both languages; zero/blank distinction; all bad/missing selections; bad matches; order dependency; weighted repeated-cell costs; over-budget route; model abstention.
- [x] Run `npx -y node@24 --test tests/class-9-feedback.test.mjs` and retain expected RED evidence in the report.
- [x] Implement diagnosis with the actual task values and authored reasons; preserve validators as the grading authority. Completeness prompts prevent submission events. Show a direct bilingual feedback panel using the document-language subscription and `translate="no"` for composites.
- [x] Integrate the panel into Class 8 story and shared practice. Clear diagnosis/feedback on edits. Track actual checked evidence through existing bounded activity events; retain first-response scoring. Ensure the story hint area does not duplicate the new panel. Keep simulation fingerprint gating.
- [x] Display weighted route costs and include actual cost/budget in evidence and diagnostics. Legacy missing `cellCosts/maxCost` keeps its prior movement behavior.
- [x] Run focused feedback/engine/evidence tests, Node 24 typecheck and targeted lint. Report RED/GREEN, files, concerns to `.superpowers/sdd/class9-feedback-report.md`; leave commits to root.

## Task 2: Cybersecurity authoring

**Files:** own only `app/data/class9/security.ts`. **Interface:** export `class9SecurityChapters` as eight `Class9Chapter` objects via `satisfies readonly Class9Chapter[]`; import `l` and types from `./types`.

- [x] Implement the eight approved Cybersecurity outlines from `docs/class-9-course-design.md`, with unique `class9-` slugs, full bilingual topics/outcomes/reflection/teacher/rubric and original six-scene stories. Each chapter must total 200–225 English caption words and use Reva/Nikhil naturally.
- [x] Supply three genuinely practical tasks per chapter; include permission simulations with concrete allowed/denied resource effects. Every option and row explanation must teach the relevant reason, including each missing required multi-select item. Use `stepReasons` on ordering tasks.
- [x] Self-check all keys, word counts, Hindi completeness and solutions via the actual validator/solver. Report source review and test commands in `.superpowers/sdd/class9-security-report.md` without editing shared files or committing.

## Task 3: AI authoring

**Files:** own only `app/data/class9/ai.ts`. **Interface:** export `class9AiChapters`, same contract and imports as Task 2.

- [x] Implement the eight approved AI outlines, 200–225 words across six scenes each, complete original bilingual text, Reva/Nikhil and three tasks. Include data/provenance repair, mean/median/probability, actual nearest-example prediction results, pixels/binary, language ambiguity, group error rates and bounded prototype review.
- [x] Give complete supplied datasets, precise positive-class/denominator definitions, safe limits and genuine train/test separation. Require authored numeric field explanations and slot reasons for ordering. Avoid unsupported accuracy/fairness claims.
- [x] Solve every task with the actual evaluator and inspect model alternatives/ties, calculations and Hindi feedback. Report in `.superpowers/sdd/class9-ai-report.md`; no shared edits or commits.

## Task 4: CT authoring

**Files:** own only `app/data/class9/ct.ts`. **Interface:** export `class9CtChapters`, same contract/imports.

- [x] Implement the eight approved CT outlines with full bilingual text, Reva/Nikhil, six 200–225-word stories and three tasks. Cover specification, variables/types, boolean boundaries, stable records/lists, reusable functions, bounded search, weighted routes and integrated dispatch debugging.
- [x] Show complete Python-style trace inputs without requiring executable code. Supply `fields[].explanation` and `stepReasons`. Author at least two accepted routes for each open route case; state coordinates, costs and starting-cell convention explicitly.
- [x] Self-check every numeric result and trace, all route reachability/budgets, wrong explanations and Hindi. Report in `.superpowers/sdd/class9-ct-report.md`; no shared edits/commits.

## Task 5: Fraud authoring

**Files:** own only `app/data/class9/fraud.ts`. **Interface:** export `class9FraudChapters`, same contract/imports.

- [x] Implement all eight approved fraud outlines with new bilingual scenarios, Reva/Nikhil, six 200–225-word stories and three tasks per chapter. Include claim/source audit, escalation chains, fictional merchant-payment direction, account lending, recurring charges and helpful factual case notes.
- [x] Distinguish unknown facts from proof of fraud, payment promises from actual transaction direction, and cancellation requests from confirmation. Use supportive language and trusted adult/provider help, without promises of recovery. Author every wrong/missing-item reason and ordering/numeric explanation.
- [x] Verify all solutions, amounts/dates, feedback and Hindi from actual exports. Report in `.superpowers/sdd/class9-fraud-report.md`; no shared edits/commits.

## Task 6: Independent subject reviews

**Owner:** fresh read-only reviewers; root prepares exact task briefs, reports and scoped source diffs.

- [x] For each completed author task, review both spec compliance and quality, citing exact lines. Check age progression, originality, all feedback reasons, calculations/model/route logic, Hindi, story lengths and the three working tasks.
- [x] Return important/critical findings to an implementer, run the affected checks and re-review. Resolve cross-task verification items at integration. Record each clean review in the progress ledger.
- [x] Commit only reviewed content and shared behavior through root, keeping each task scope reviewable.

## Task 7: Class 9 presentation and current registration

**Owner:** root. **Files:** Class 9 presentation, library and registrations listed above; related tests.

- [x] Start `tests/class-9-curriculum.test.mjs` with real export assertions, initially RED: `assert.equal(class9Chapters.length,32); assert.equal(getCyberLessonsForGrade(9).length,32);` plus eight per subject, unique assessment IDs, full bilingual shapes and all authored tasks solvable.
- [x] Create ordered Class 9 exports, metadata IDs `cyber-${slug}`, three assessment IDs `${slug}-challenge-1..3`, 40-minute duration, dedicated four subjects. Map all new slugs to the shared lesson wrapper with Class 9 data and illustration.
- [x] Add original Reva/Nikhil SVG character expressions through an optional story character component, preserving existing character defaults. Build distinct original SVG desk/data/notice/tool worlds and responsive CSS. Create six-scene Class 9 stories with the shared diagnosis panel and current story gate.
- [x] Remove grade9 from legacy playable mappings and make `getCyberLessonsForGrade(9)` new-prefix-only. Preserve old lesson objects/IDs and every other grade. Verify the actual page/access/completion paths, not only metadata counts.
- [x] Run real data solution/feedback tests, registry checks and typecheck. Check authors' IDs/explanations against integration, then generate all story assets.

## Task 8: Indian English media and Hindi compilation

**Owner:** root. **Files:** Class 9 generation scripts and generated media/catalogue.

- [x] Build a dedicated asset compiler from the proven Class 8 approach: all32 wrappers/scripts, captions/dialogues and manual Hindi mappings. Preserve every baseline Hindi message value. Recognise the new bilingual source contract in extraction; exclude technical hashes/voice metadata.
- [x] Write a Python narrator using `edge_tts.Communicate(scene.speech or scene.caption,'en-IN-NeerjaNeural',rate='+0%')`. Decode each synthesized scene to PCM, measure sample frames, join with 0.65-second gaps, normalise -18LUFS/-1.5dBTP and encode 48kHz mono128kbps. Hash the exact speech text, voice and rate; skip only matching completed assets.
- [x] Generate all32 MP3s; validate every file decodes, each script has six monotone measured cues and all hashes match. Include acronym/name pronunciation expansions in speech only where necessary. Recheck word counts and complete Hindi source coverage after author fixes.

## Task 9: Full workflow verification and delivery

**Owner:** root, with independent final reviewer on the most capable available model. **Files:** browser QA, backend legacy fixture, delivery notes, design/plan/ledger status.

- [x] Adapt authenticated Class 8 browser QA for a fresh Class9 learner. Complete32chapters/96tasks on desktop/390px; test all wrong story options and all single-choice practice options, and representative wrong cases of every other mechanic. Check actual feedback label/reason and edited-answer invalidation in both languages, blank guards, keyboard operation and simulation gates.
- [x] Check all actual submitted answers in notebooks/teacher history, language switch/reload, reflections, audio metadata, saved completion and assignment marks. Confirm complete wrong-first/correct-retry scoring and latest-attempt reports.
- [x] Add a real stored legacy Class9 history/assignment fixture with preserved marks and denied old-module current APIs. Verify school isolation and other-grade denial. Run Class8 regression browser workflow against the changed shared behavior.
- [x] Run Node24 content/Hindi/backend tests, typecheck, lint, productionbuild and fullNode suite once integration settles. Known baseline:191tests187pass4existing failures before this feature; compare failure identities, not only counts.
- [x] Obtain whole-change independent review, fix important findings, rerun affected checks and re-review. Inspect desktop/mobile/Hindi screenshots and audio diagnostics. Update `docs/class-9-delivery.md`, approved design/plan and `.superpowers/sdd/class9-progress.md` with actual results.
- [x] Finish locally on the feature branch with a reviewable diff and concise launch/handoff instructions. No merge, push or deployment is part of this task.

## Execution notes

The user has already approved implementation; execute continuously without a further execution-choice or permission question. Continue in the chosen repository folder to preserve the active local preview. The preceding Class 8 work has its own checkpoint commit; Class 9 changes belong to `feat/class9-signal-studio`. Record task status, commits, running sessions and exact unresolved findings in `.superpowers/sdd/class9-progress.md` after each review.

## Completed verification

Delivered all 32 chapters, bilingual text, original Reva/Nikhil artwork and measured Indian English narration. All four subject reviews, shared feedback review and the final independent source review passed. Feature/Hindi checks:27/27; backend:21/21; TypeScript and production build passed; lint has zero errors and four baseline image warnings. Full suite:208 tests,204 passing, the same four baseline failures documented in docs/class-9-delivery.md.

Both complete authenticated browser workflows passed: Class9 and Class8 each32chapters/96tasks, actual teacher evidence, notebook reload, reflection, retry/assignment marks and grade restrictions. Class9 additionally covered all64wrongstory alternatives in both languages and66wrongpractice submissions across all nine mechanics. Desktop/Hindi mobile screenshots inspected; no JavaScript errors or horizontal overflow. Full details and reproduction commands are in docs/class-9-delivery.md. Work remains local to feat/class9-signal-studio.
