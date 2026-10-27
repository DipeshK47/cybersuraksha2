# Class 8 Future Lab implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Independent content files can be authored concurrently under dispatching-parallel-agents; integration and shared edits remain sequential.

**Goal:** Deliver the approved 32-chapter Class 8 course with English narration, English/Hindi text, working activities and existing LMS integration.

**Architecture:** Author four isolated subject data modules using a shared typed bilingual content contract. A shared Class 8 renderer supplies six-scene stories, illustrations, varied practical tasks, feedback and evidence records through the existing story player and practice runtime. Compile authored text into local narration scripts and Hindi catalogue entries; retain existing authorization and historical records.

**Tech stack:** TypeScript, React, CSS modules, existing vinext/Workers/D1 runtime, Node 24, Python narration tooling in a disposable environment.

## Global constraints

- Exactly eight chapters per subject, 32 total, in the order approved in `docs/class-8-course-design.md`.
- Exactly six scenes, one explained story decision and three required practice tasks per chapter.
- Story captions target 190–225 English words; actual audio produces cue timing. Lesson metadata remains 40 minutes.
- Every learner-facing authored string includes reviewed conversational Hindi in Devanagari. English narration only.
- Preserve other grade libraries, existing lesson IDs, stored attempts and historical reports; current Class 8 uses new unique IDs.
- No live payments, personal datasets, passwords, malicious downloads or live AI services in activities.
- No changes to authentication or authorization semantics. No production deployment or dependency upgrades.
- Content tasks own disjoint files; only the controller edits shared registries and runtime. All agents work on the current feature branch and leave committing to the controller.

## File responsibilities and interfaces

- `app/data/class8/types.ts`: bilingual content and task discriminated unions.
- `app/data/class8/{ct,ai,security,fraud}.ts`: eight authored chapters per subject. Each exports a readonly tuple `class8CtChapters`, `class8AiChapters`, `class8SecurityChapters` or `class8FraudChapters` and contains all English/Hindi text.
- `app/data/class8/index.ts`: ordered chapter list and pure metadata conversion.
- `app/data/class-8-missions.ts`, `app/data/class-8-curriculum.ts`: exports compatible with existing grade registry contracts.
- `app/module/cyber/lessons/class8/{Class8Lesson,Class8Stories,TaskBoard,WorldIllustration}.tsx`: rendering and original illustrations with keyboard controls.
- `app/module/cyber/lessons/class8/{task-evaluation.ts,class8.module.css}`: deterministic activity checks and responsive styling.
- `scripts/build-class8-assets.mjs`: compile story JSON/wrappers and Hindi text from authored source; preserve measured timing on subsequent runs.
- `scripts/narrate-class8.py`: portable narration generation and actual per-scene timings, using the established voice/settings.
- `tests/class-8-*.test.mjs`, `tests/class-8-browser-qa.py`: content contracts, pure activity behavior, current-grade integration and browser workflows.
- `docs/class-8-delivery.md`: actual delivered features, verification and reproduction commands.

All content uses `L = { en: string; hi: string }`, with `l(en, hi)` as a pure helper. A `Class8Chapter` has `slug`, `title`, `strand`, `summary`, `topics` (three), `outcomes` (three), `familyAction`, `reflection`, `teacherPrompt`, `rubric` (three), `sceneTheme`, `scenes` (six), `decision` and `tasks` (three). Scenes carry `title`, `caption`, `dialogue`; all are `L`. Decision and choice options use stable IDs and explained feedback.

Task mechanics include choice, exact multi-selection, matching, ordering, numeric fields, binary lamp encoding, grid cell selection, robot path simulation, permission testing, dataset repair and a visible nearest-example model. Task-specific data lives in the content modules; validators never compare translated labels.

### Task 1: Content contract and behavioral foundation

- [x] Add tests that assert the new subject files contain eight chapter exports and that selected activity validators reject incomplete work; run them to confirm the new feature is absent.
- [x] Create `types.ts` with the exact contracts, plus pure task evaluators returning `{correct, feedback}`. Stable IDs are the inputs; feedback is bilingual.
- [x] Test numeric finite/boundary handling, exact selections, permutations, binary range, robot blocked/out-of-grid movement and model train/test separation.

Run: `npx -y node@24 --test tests/class-8-engine.test.mjs`.

### Task 2: Computational Thinking authoring

Own `app/data/class8/ct.ts` only. Implement the eight CT outlines in the approved design with original bilingual text, six 190–225-word stories and three working tasks per chapter. Use numeric, binary, grid, route and loop exercises as appropriate. Include specific feedback, teacher outcomes, reflection and rubric. Self-check word counts, answer keys and mathematical correctness. Report in `.superpowers/sdd/class8-ct-report.md`.

### Task 3: AI authoring

Own `app/data/class8/ai.ts` only. Implement the eight AI outlines with the same bilingual/story/task contract. Include a deterministic visible training/testing exercise, data repair, feature/background comparisons, source checking and group-denominator reasoning. Label all models/data as classroom simulations. Report in `.superpowers/sdd/class8-ai-report.md`.

### Task 4: Cybersecurity authoring

Own `app/data/class8/security.ts` only. Implement the eight security outlines with the same contract. Include privacy redaction, permission testing, source/hostname checking, shared sessions and verified backup simulation. Match the approved bilingual worked example's factual distinctions. Report in `.superpowers/sdd/class8-security-report.md`.

### Task 5: Cyber Fraud authoring

Own `app/data/class8/fraud.ts` only. Implement the eight fraud outlines with the same contract. Cover requests hidden behind offers, independent verification, code purpose, payment direction, unknown support, seller claims, identity evidence and supportive response. Use fictional examples, adult help and no promises of recovery. Report in `.superpowers/sdd/class8-fraud-report.md`.

### Task 6: Shared delivery and integration

- [x] Implement accessible React controls for every task kind, using validators from Task 1. Keep draft answers in lesson runtime state. Display test results before approval for simulations; reset tested state after changes.
- [x] Reuse `StoryPlayer` for six scenes and a locked decision. Provide original illustrated worlds, with state/consequence changes and reduced-motion support.
- [x] Record the three practice assessment IDs through existing runtime methods, keep retry evidence and save lesson completion through the existing APIs.
- [x] Add Class 8 metadata/subjects, current library mapping and assignment registry. Preserve old IDs for historical records; current Class 8 must not gain old or other-grade modules through a query string.
- [x] Add tests for 32/8 coverage, unique IDs, shared-grade preservation and registered component/story lookup.

Run: `npx -y node@24 --test tests/class-8-curriculum.test.mjs tests/class-8-engine.test.mjs` and `npx -y node@24 node_modules/typescript/bin/tsc --noEmit`.

### Task 7: Local media and language delivery

- [x] Compile all six-scene scripts and story wrappers from the authored content, producing offline files with no runtime service dependency.
- [x] Materialize English/Hindi mappings into the existing Hindi catalogue while preserving existing reviewed entries. Every new caption, label and feedback variant must be covered.
- [x] Prepare Kokoro narration tooling/model and ffmpeg in disposable local tooling. Generate English audio with `am_fenrir`, speed `0.92`, gap `0.65 s`, loudness `-18 LUFS` and peak `-1.5 dBTP`.
- [x] Measure scene cue starts/durations from real synthesis, verify all local MP3s decode and script timing matches. Never invent timing to pass tests.

### Task 8: Review and complete workflow verification

- [x] Review each subject against its brief and quality contract; correct factual errors, weak changed-situation tasks, missing Hindi and invalid answer keys.
- [x] Run content tests, activity validators, localization checks and the backend suite (now 20 checks, including legacy Class 8 history) under Node 24.
- [x] Run desktop/390px browser checks: every chapter route, story decision, each task type, wrong/correct feedback, language change without state loss and resume.
- [x] Complete representative authenticated chapters and confirm assignment delivery, stored activity and teacher reports.
- [x] Run typecheck, lint and production build. Compare the full suite with the four known baseline failures.
- [x] Obtain an independent final code/content review and address important findings. Document actual commands/results and remaining limitations in `docs/class-8-delivery.md`.

## Durable progress

Track completed work, verification evidence and outstanding review findings in `.superpowers/sdd/progress.md`. The original base is `f7de523`; never reset unrelated changes or regenerate unrelated content/media.
