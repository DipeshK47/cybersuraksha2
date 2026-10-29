# Class 7 Connection Lab

Class 7 contains four modules with eight original chapters each. It builds on Class 6 through combined privacy clues, temporary permissions, trainable models, binary representation, sorting/search and evidence-based fraud responses. Tara and Neel lead a fictional school makers-fair project with supportive adult guidance.

| Chapter | Cybersecurity | Artificial Intelligence | Computational Thinking | Cyber Fraud |
| --- | --- | --- | --- | --- |
| 1 | Your digital trail connects | Choose the right kind of helper | Model what matters | The giveaway entry fee |
| 2 | Stronger sign-in, safer recovery | Build a useful data table | Make and test a pattern | When the sender sounds familiar |
| 3 | Access for the job | Train a tiny sorter | Send a message with bits | A QR code does not tell the whole story |
| 4 | Check the whole web address | Read the mistake record | Two conditions, one decision | The helper who wants control |
| 5 | Before the download | A picture changes, the object stays | Loops that change a total | The shop with copied reviews |
| 6 | The unfamiliar account session | Why did it recommend that? | Keep a list in order | A subscription is more than one price |
| 7 | Copies and versions | Check a generated explanation | Search with a plan | Keep a useful incident record |
| 8 | Publish the club guide safely | A fair helper for everyone | The delivery rover challenge | The club trip refund message |

Each 40-minute chapter plan follows the existing senior-course format: three topics and outcomes, six story scenes, an explained decision, three required practical activities, an evidence notebook, reflection, family activity and teacher guidance with a three-point rubric. Captions contain 199–225 English words per chapter. Forty minutes includes classroom practice and discussion, rather than describing the audio length.

All 32 chapters include original related illustrations in the story, practical work and library preview. English narration is stored locally, with English/Hindi text and image descriptions through the existing language switcher. Hindi narration is not included. Exact rules, values, source records, cell descriptions and scored feedback remain accessible text, separate from the contextual illustrations. See [artwork specification](class-7-artwork.md).

The course uses all nine existing activity controls: single/multiple selection, matching, ordering, number entry, binary lamps, cell masks, routes and a small nearest-number model. Permission simulations require a test before submission; route and model exercises include changed cases. The model is explicitly a limited classroom example. Routes accept any solution satisfying the supplied constraints. Every scored alternative has explanatory feedback.

All accounts, messages, contacts, object data, payments and codes in these scenarios are fictional. Activities require no real passwords, account changes, purchases, QR scans, drinking-water tests or live AI accounts. Trusted support and factual reporting are emphasised without blame, unsupported accusations or recovery guarantees.

## Integration and maintenance

Authored bilingual content lives in `app/data/class7/`. The four subject libraries, playable catalogue and assignment picker expose exactly the 32 new `cyber-class7-*` identities. Legacy metadata remains readable for historical records. Class 6 and the existing Class 8–12 chapter content are preserved, including Class 10's additional textbook libraries.

The common story player, practical controls, feedback, evidence storage and LMS grading are reused. Small Class 7 artwork wrappers reuse the Class 6 image/layout styles and existing task-authoring helpers.

Rebuild after editing authored content:

```sh
node scripts/build-class7-assets.mjs
python scripts/narrate-class7.py --workers 4
node scripts/build-class7-assets.mjs
```

Use a supported Node runtime and the existing Python authoring dependencies (`edge-tts`, `imageio-ffmpeg`, `numpy`, `soundfile`). The narrator creates six measured scene cues per chapter and a hash of speech and settings. The compiler retains those cues only when the narration still matches. Hindi ownership manifests preserve prior translations.

The learner library is `/grade/7`; teachers can preview `/grade/7?role=teacher`. Course checks are `tests/class-7-curriculum.test.mjs` and `tests/class-7-artwork.test.mjs`. The combined browser runner is `tests/class-7-browser-qa.py`; run it on a disposable localhost server with `CYBERSURAKSHA_EPHEMERAL_WORKERS=1`, `NODE24` pointing to the supported Node executable and `BASE_URL` set to that server.

## Verification

The production build and TypeScript checks pass. ESLint reports no errors and seven image-element advisories; one is the new Class 7 local, pre-optimised responsive image. The full Node suite reports 294 passing tests and four pre-existing unrelated failures: the external Chapter 8 film source, older fraud QR/reporting wording, toy-workshop motion and the external trigonometry film source. Their failing source paths were not changed to hide failures.

The course checks pass for all 32 chapters and 96 practicals, including complete bilingual teaching, solvable tasks, blank-answer rejection, explained wrong answers, assignment/catalogue agreement and current narration hashes. All 32 MP3s decode successfully. Measured English narration ranges from 97.044 to 109.908 seconds per chapter, totalling 55.06 minutes. The compiler retains all current measured cues.

The final combined browser run passes on disposable local Workers storage. It verifies all 32 images in desktop/mobile stories, all mobile practical views, all library previews, Hindi image descriptions, keyboard focus, layout bounds and no page errors. The authenticated student flow completes every chapter and all 96 activities across all nine mechanics, verifies the English audio duration and Hindi story text, reloads bilingual notebooks, saves reflections and checks actual teacher evidence, first-response retry grading, assignment marks and grade restrictions. Teacher previews also verify 90 wrong submissions across English/Hindi, including all single-choice alternatives.

All 64 WebPs decode at the intended widths and preserved aspect ratio and match the artwork manifest hashes. The two artwork contact sheets and representative desktop/mobile screens were visually reviewed. All 232 saved prior-content file hashes and 27,726 prior Hindi messages remain unchanged.

Local verification outputs and screenshots are stored under `.lms-qa/class7/` (ignored by Git). The browser server used ephemeral data and was stopped after verification.

The delivery includes repository code and self-hosted images/audio. No production deployment was performed as part of this course delivery.
