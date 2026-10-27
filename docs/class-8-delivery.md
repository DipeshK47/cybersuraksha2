# Class 8 Future Lab delivery

Implemented on `feat/class8-future-lab`, based on `f7de523`. The approved scope is in [the course design](class-8-course-design.md); chapter outlines and teaching objectives are recorded there.

## Delivered course

- 32 original chapters: eight each in Cybersecurity, Artificial Intelligence, Computational Thinking and Cyber Fraud.
- Each chapter has three topics, three learning outcomes, six illustrated story scenes, an explained story decision, three required practical activities, a reflection, a family activity and teacher guidance/rubric.
- English and conversational Hindi text throughout the new content. All 17,402 pre-existing Hindi message values remain unchanged.
- English narration for all 32 chapters, supplied as local MP3s with measured scene cues. The stories contain 210–225 caption words each. Narration ranges from 88.380 to 100.881 seconds, with a median of 93.713 seconds and 50.05 minutes across the course. The 40-minute lesson metadata includes the practical work and discussion, following the senior lesson format.
- Nine activity types: choices, exact multiple selection, matching, ordering, numeric fields, binary signals, grid selection, robot routes and a visible classroom model. Matching also supplies dataset repair and permission simulations. Permission, route and model activities require testing the current plan before checking it.
- Actual learner work is retained: selected examples, numeric answers, ordered steps, permission consequences, model predictions and route traces. The notebook switches language without changing submitted values. Bounded evidence events reach teacher history, including incorrect attempts.
- Grade 8 libraries and the assignment picker use the 32 new chapter IDs. Other grades retain their existing courses. Stored legacy Class 8 attempts, events and assignment marks remain readable while the old lessons are denied for current Grade 8 delivery.

All activities use supplied fictional information and local simulations. They require no live AI service, payment, account secret or personal dataset. Reflections are available for teacher review and are not keyword-graded. Existing grading uses each exercise's first response; successful retries remain visible as learning activity.

Drafts and the notebook view resume in the same browser. Submitted activity, evidence and completion are saved through the existing LMS APIs. No database migration or authentication change is required.

## Run locally

From the repository directory, with the existing dependencies installed:

```sh
npx -y node@24 node_modules/vinext/dist/cli.js dev --port 3000
```

Open `http://localhost:3000` and use a Class 8 student or teacher account. The web application needs Node 22.13 or later; Python is only used for authoring narration and the optional browser QA script.

## Maintain the course

Edit the bilingual source in `app/data/class8/{security,ai,ct,fraud}.ts`. The shared contracts are in `types.ts`; rendering, evaluation and evidence helpers are in `app/module/cyber/lessons/class8/`.

Compile the story scripts, wrappers and Hindi messages after editing content:

```sh
npx -y node@24 scripts/build-class8-assets.mjs
```

This retains measured cues only when all six English captions are unchanged. `--locales-only` updates translation assets without writing story scripts. New/changed English captions require narration regeneration before delivery.

For narration authoring, install `kokoro-onnx`, `numpy`, `soundfile` and `imageio-ffmpeg` in a separate Python tool environment. Set `KOKORO_DIR` to a directory containing `kokoro-v1.0.onnx` and `voices-v1.0.bin`, then use that environment's Python:

```sh
KOKORO_DIR=/path/to/models python scripts/narrate-class8.py
# To regenerate only a changed chapter:
KOKORO_DIR=/path/to/models python scripts/narrate-class8.py class8-rescue-robot
```

The script skips unchanged audio, synthesizes `am_fenrir` at speed `0.92`, measures each scene, inserts 0.65-second gaps and normalizes MP3 output to -18 LUFS / -1.5 dBTP. Models are authoring tools and are not included in the application.

## Verification

Final verification was performed under Node 24 on 27 October 2026. Logs and screenshots are local, ignored artifacts in `.lms-qa/class8/`.

- Content, activity, evidence and Hindi tests: 20/20 passed. All 96 authored activities were solved through their actual evaluators; incomplete and invalid submissions were checked separately.
- School/backend tests: 20/20 passed, including a stored legacy Class 8 history/marks fixture, cross-school isolation and denial of current access through the old module APIs.
- TypeScript: passed. Full ESLint: zero errors, four existing image warnings in `ThinkingMissions.tsx`.
- Production build: passed.
- Full Node suite: 191 tests, 187 passed, four known baseline failures. The unchanged failures are the external Chapter 8 choreography source (`chapter8-panels`), older fraud QR/report wording (`new-curriculum-missions`), existing theme/motion expectations (`toy-workshop`) and an external cinematic source (`trig-angle-lab`).
- All 32 MP3s decoded successfully; browser audio metadata matched measured scripts.
- Independent content reviews and final integration review passed after correcting feedback, permission consequences, evidence retention and accessible route results.
- Authenticated browser verification: all 32 chapters and 96 tasks passed on desktop and 390px layouts. Every activity type was answered in Hindi. All 32 audio files matched their measured timings. The checks covered story gates, bilingual notebook reload, actual teacher evidence for all tasks, saved reflection, completion and assignment marks, grade restrictions and Hindi report reload. A wrong-first/correct-retry attempt retained its 66.67% first-response score and the earlier 100% attempt; the four-module assignment correctly changed from 100 to 91.67 marks. No browser JavaScript errors were recorded.

Reproduce automated checks:

```sh
npx -y node@24 --test tests/class-8-*.test.mjs tests/hindi-*.test.mjs
npx -y node@24 --test tests/school-backend.test.mjs tests/school-migration.test.mjs tests/assessment.test.mjs tests/lms-summary.test.mjs
npx -y node@24 node_modules/typescript/bin/tsc --noEmit
npx -y node@24 node_modules/eslint/bin/eslint.js . --ignore-pattern dist --ignore-pattern .next
npx -y node@24 node_modules/vinext/dist/cli.js build
npx -y node@24 --test tests/*.test.mjs
```

For full browser verification, use a disposable seeded local server and a Python environment with Playwright plus Chrome installed. The script creates QA learners and an assignment; its target is restricted to localhost:

```sh
STORY_NO_HMR=1 CYBERSURAKSHA_EPHEMERAL_WORKERS=1 npx -y node@24 node_modules/vinext/dist/cli.js dev --port 3218
# In another terminal:
BASE_URL=http://localhost:3218 python tests/class-8-browser-qa.py
```
