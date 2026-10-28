# Class 10 Decision Lab

Implementation follows the [approved design](superpowers/specs/2026-10-27-class10-decision-lab-design.md) and [implementation plan](superpowers/plans/2026-10-27-class10-decision-lab.md). Development is on `feat/class10-decision-lab`; this delivery does not push or deploy the branch.

## Course

The course contains 32 original chapters: eight each in Cybersecurity, Artificial Intelligence, Computational Thinking and Cyber Fraud. Each chapter includes three topics and outcomes, six English/Hindi story scenes, an explained decision, three practical activities, an evidence notebook, reflection, family activity, teacher guidance and a three-point rubric. English story captions total 200–225 words per chapter. Aditi and Vihaan guide the Class 10 Decision Lab.

Topics include access paths, session traces, linked-table privacy, restoration and release checks; baselines, confusion matrices, thresholds, moving windows, text vectors and model limits; dictionary keys, nested loops, stable sorting, state transitions, invariants, weighted routes and prerequisite schedules; and independent verification of notices, voices, apps, payment records, changing baskets and help offers. All records and simulations are fictional classroom examples.

The nine practical mechanics are choices, multiple selection, matching, ordering, numeric fields, binary signals, grid selection, routes and a visible classroom model. Dependency ordering accepts every complete schedule satisfying the stated edges. Weighted routes charge each entered cell, including repeats; the initial cell is free. Alternatives are checked by the actual task evaluator.

The 192 scenes use authored diagrams whose nodes, connections, values and statuses change with the explanation. They follow the narration clock and support separate silent replay, pause/resume, previous/next steps, reset and chapter-specific exploration. Route explanations show the complete grid, each entered cell, current position and cumulative cost. Reduced-motion and unavailable-audio modes retain manual steps. Exploration does not submit an answer or award marks.

Practice feedback shows the submitted choice or work, explains incorrect and missing parts, and suggests a next step. Route, model and permission diagrams use immutable snapshots from the learner's actual test. Editing the task invalidates its tested result; returning to a previous answer requires another test. Saved evidence, attempts, reflection and teacher reports retain their existing school and grade boundaries.

The current Grade 10 catalogue and assignments use the 32 new cyber chapters. Existing historical records remain readable, and the 14 Mathematics and nine English chapters remain available. Other grades retain their courses.

## Narration and translation maintenance

All 32 chapters have local English narration using `en-IN-NeerjaNeural` at `+0%`. Speech expands technical abbreviations without changing visible captions. The MP3s have measured scene cues and hashes tied to the narration and voice settings. There is no Hindi narration in this delivery.

Decoded narration lasts 104.028–130.188 seconds per chapter, with a median of 111.408 seconds and 60.0364 minutes across the course. The existing 40-minute chapter duration includes practical work and discussion.

Class 9 and Class 10 share the compiler and narrator engines. After an authored text change, run these commands from the repository using a compatible Node runtime and a Python environment containing the existing narration dependencies:

```sh
node scripts/build-class10-assets.mjs
python scripts/narrate-class10.py
node scripts/build-class10-assets.mjs
```

The final compile retains matching measured cues. Hindi comes from authored bilingual values and an ownership manifest; pre-existing and manually edited translations are preserved. At the integration audit, all 21,883 Hindi values from baseline `74034c0` were unchanged, and Class 9 generated stories/audio had no diff against that baseline.

## Verification record

The final source passes 94 course/language checks, TypeScript, the production build and ESLint with only four pre-existing image warnings. Backend checks pass 22 tests. Focused playback, fallback, evaluator and evidence regressions cover ready-state snapshot retention, ordinary submitted status, cached media-clock snapshots and native seek rounding. All 32 MP3s decoded successfully and matched their measured cues and source hashes. Independent subject, animation-engine, compiler/registration and whole-branch reviews approved the source after corrections.

Authenticated learner flows passed for Classes 8, 9 and 10 on the reviewed source. The Class 10 run completed all 32 chapters and 96 practicals, checked all nine mechanics, 64 wrong story alternatives in English/Hindi and 76 wrong practice preview submissions, and verified saved evidence, teacher history, retries, assignment marks and retained textbook subjects. The final Class 8/9 runs also completed all 32 chapters and 96 practicals per grade.

The complete animation-browser run passes all 192 scenes, actual seek/pause/replay/reset controls, every chapter's exploration, tested route/model/permission traces, alternative prerequisite schedules, desktop/mobile layouts, reduced-motion stepping and unavailable audio. Screenshots and a visible-diagram recording were inspected. A separate native-seek regression passes 31 fresh browser contexts, including an immediate pause during the real media transition. The tiny scene-boundary tolerance prevents native microsecond rounding from clearing a newly selected exploration while preserving genuine backward seeks.

The final full Node suite reports 282 passing tests and four existing unrelated failures: Chapter 8 film external source, older fraud QR/reporting wording, toy-workshop motion and the trigonometry film external source. Those tests have not been changed to hide the failures.

The reusable native-seek regression is `tests/class-10-exploration-race-qa.py`; the full scene check is `tests/class-10-animation-qa.py`. Both use separate headless browser contexts. Recording requires Playwright's FFmpeg binary, installed in its local cache with `python -m playwright install ffmpeg`. Browser results are local verification, not a claim of published deployment.

Browser verification uses the project's local preview with byte-range audio responses. A separate local built-Worker experiment did not support MP3 seeking and was not counted as a browser pass. That experiment used isolated temporary data and omitted one existing oversized English video from its temporary asset copy; the repository's original video and assets were unchanged. It does not establish production hosting or large-video playback readiness.

## Local preview

Open `/grade/10?role=teacher` on the running local preview. The existing demo teacher is `teacher@dpsrkp.edu.in` with password `Teacher@123`. Use the project's existing start procedure when reopening the preview; no new dependencies or separate application environment were introduced for this course.
