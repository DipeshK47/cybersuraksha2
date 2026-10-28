# Class 9 Signal Studio delivery

Implemented on `feat/class9-signal-studio`, following the [approved course design](class-9-course-design.md). Class 8 has a separate checkpoint at `d268f01`; the Class 9 design and shared contract were committed at `a999adc`.

## Delivered course

- 32 original chapters: eight each in Cybersecurity, Artificial Intelligence, Computational Thinking and Cyber Fraud.
- Each chapter has three topics and learning outcomes, six illustrated story scenes, an explained story decision, three practical activities, a learner evidence notebook, reflection, family activity and teacher guidance with a three-point rubric.
- English and conversational Hindi text, with 2,367 authored Hindi catalogue entries. All 19,568 baseline Hindi message values are preserved.
- Original Reva and Nikhil characters, with expressions and distinct repair-desk, toolkit, noticeboard and data illustrations.
- English narration for all 32 chapters using the approved Indian English voice, `en-IN-NeerjaNeural` at `+0%`. Technical abbreviations can use separate pronunciation text without changing visible captions. Local MP3s have six measured scene cues and hashes tied to speech and voice settings.
- Stories follow the approved 200–225-word range. Audio lasts 103.356–119.748 seconds per chapter, with a median of 110.304 seconds and 58.67 minutes across the course. The existing 40-minute chapter duration includes practical work and discussion.

The course advances from identifying a choice to testing a plan and explaining its consequences. Learners revoke temporary permissions, distinguish a secure connection from evidence of trust, compare prediction errors and group denominators, trace Python-style values and record updates, test weighted routes, and assess refund, subscription and account-lending claims from supplied evidence.

Nine practical mechanics are used: choices, exact multiple selection, matching, ordering, numeric fields, binary signals, grid selection, robot routes and a visible classroom model. Matching also supplies permission and dataset simulations. Model tuning uses a visible validation batch and explains why an independent evaluation needs fresh unseen examples. Weighted routes charge each entered cell, including repeat visits; the initial cell is free. Multiple valid routes can pass.

Activities use fictional records and local simulations. Reflections are available for teacher review and are not keyword-graded.

## Checks and evidence

Class 8 and Class 9 now share explicit feedback in story decisions and practical checks. A complete wrong submission states that it is incorrect, shows the actual selected answer or work, explains wrong and missing parts, and offers a next step. Numeric answers, ordered steps and Class 9 image cells have specific authored reasons. Supported parts are available in an expandable section. English/Hindi feedback follows the language switcher and clears when the learner edits the answer.

Incomplete controls receive a completion prompt without a scored answer event. Permission, route and model activities require a test of the current configuration before checking. The existing first-response grading remains: a complete wrong first response stays wrong in the score after a successful retry, while the correction unlocks learning progress. Starting a new attempt preserves the previous attempt in history.

Checked work is retained in the learner notebook, including values, selected examples, permission consequences, route traces/costs and model predictions. Drafts and the notebook resume in the same browser. Submitted work and bounded bilingual evidence events reach the existing LMS and teacher history, including incorrect attempts. Notebook drafts are not a cross-device synchronization feature.

Current Grade 9 libraries and assignment pickers contain exactly the 32 new chapter IDs. Legacy IDs remain available to historical reports and other grades. Stored legacy Grade 9 marks and events remain readable while current Grade 9 access to the old modules is denied. No database migration or authentication change is needed.

## Run locally

From the repository directory, with the existing dependencies installed:

```sh
npx -y node@24 node_modules/vinext/dist/cli.js dev --port 3218
```

Open `http://localhost:3218/grade/9?role=teacher`. The local demo teacher is `teacher@dpsrkp.edu.in` with password `Teacher@123`. The application requires Node 22.13 or later. Python is only needed for narration authoring and optional browser QA.

## Maintain content and audio

Edit `app/data/class9/{security,ai,ct,fraud}.ts`. The shared contract is `app/data/lesson-content.ts`; shared checking and evidence are in `app/module/cyber/lessons/class8/`. Class 9 presentation is in `app/module/cyber/lessons/class9/`.

Compile scripts, wrappers and Hindi messages after content changes:

```sh
npx -y node@24 scripts/build-class9-assets.mjs
# Translation-only rebuild:
npx -y node@24 scripts/build-class9-assets.mjs --locales-only
```

The compiler preserves measured cues only when speech and voice settings match. `--subject security|ai|ct|fraud` supports incremental authoring. Changing narration text or settings requires new audio before delivery.

Use a separate Python tool environment with `edge-tts`, `numpy`, `soundfile` and `imageio-ffmpeg` installed:

```sh
python scripts/narrate-class9.py
# Regenerate one changed chapter:
python scripts/narrate-class9.py class9-ai-prediction-errors
```

Narration generation requires network access to the speech service; playback uses the bundled local files. The script measures decoded scene samples, inserts 0.65-second gaps, normalizes to -18 LUFS / -1.5 dBTP and writes 48 kHz mono 128 kbps MP3s. It skips only unchanged completed assets; `--force` regenerates them. Voice settings live in `scripts/class9-voice.json`.

## Verification

Verification used Node 24 on 27–28 October 2026. Logs, review reports and screenshots are ignored local artifacts under `.lms-qa/class9/` and `.superpowers/sdd/`.

- Course, feedback, assets, measured media and Hindi checks: 27/27 passed. All 96 practical solutions and 32 story decisions pass their actual evaluators; all nine mechanics and alternative weighted routes are exercised.
- School/backend checks: 21/21 passed, including stored legacy Grade 9 history/marks, current access restrictions and school isolation.
- TypeScript passed. Full ESLint has zero errors and four existing image warnings in `ThinkingMissions.tsx`. Production build passed.
- Full Node suite: 208 tests, 204 passed, four unchanged baseline failures. These concern external Chapter 8 choreography source (`chapter8-panels`), older fraud QR/report wording (`new-curriculum-missions`), existing theme/motion expectations (`toy-workshop`) and external cinematic source (`trig-angle-lab`).
- All 32 MP3s decoded successfully. Tests match source speech, voice settings, hashes, MP3 encoding and measured cues.
- All four subject reviews and the final independent integration review passed. The final audit confirmed unchanged baseline Hindi values and no oversized activity payloads across 570 sampled evidence events (maximum serialized payload: 1,111 characters).
- Authenticated Class 9 browser verification passed all 32 chapters and 96 tasks on desktop and 390px layouts, all six Hindi captions per chapter, and all 64 wrong story alternatives in both languages. Teacher preview checked 66 wrong practice submissions covering every single-choice alternative and representative wrong cases for all nine mechanics in English/Hindi. Checks assert the actual submitted work, explicit incorrectness, specific reasons and next step; edited answers clear feedback and require a new simulation where appropriate.
- Browser checks confirmed bilingual notebook reload, reflection, actual teacher evidence for all 96 tasks, completion and assignment marks, old/other-grade restrictions and Hindi mobile report reload. A new wrong-first/correct-retry attempt retained its 66.67% score and the previous 100% attempt; assignment marks changed correctly from 100 to 91.67. No JavaScript errors or horizontal overflow were recorded.
- The full Class 8 browser regression also passed all 32 chapters/96 tasks, bilingual mechanics, teacher evidence, report/retry marks and access restrictions after the shared changes.
- Desktop and Hindi mobile screenshots were inspected, including original character artwork, wrong story feedback, wrong permission-practice feedback and the progress report. A repeated display label was removed; saved evidence remains unchanged.

Reproduce checks:

```sh
npx -y node@24 --test tests/class-9-*.test.mjs tests/hindi-*.test.mjs
npx -y node@24 --test tests/school-backend.test.mjs tests/school-migration.test.mjs tests/assessment.test.mjs tests/lms-summary.test.mjs
npx -y node@24 node_modules/typescript/bin/tsc --noEmit
npx -y node@24 node_modules/eslint/bin/eslint.js . --ignore-pattern dist --ignore-pattern .next
npx -y node@24 node_modules/vinext/dist/cli.js build
npx -y node@24 --test tests/*.test.mjs
```

The full browser scripts create QA learners and assignments. Run them only on a disposable seeded localhost server with Playwright and Chrome in a Python environment:

```sh
STORY_NO_HMR=1 CYBERSURAKSHA_EPHEMERAL_WORKERS=1 npx -y node@24 node_modules/vinext/dist/cli.js dev --port 3218
# In another terminal:
BASE_URL=http://localhost:3218 python tests/class-9-browser-qa.py
BASE_URL=http://localhost:3218 python tests/class-8-browser-qa.py
```

Implementation is local to the feature branch. No merge, push or deployment is included.
