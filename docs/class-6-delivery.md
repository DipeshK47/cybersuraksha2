# Class 6 Discovery Club

The workspace was fast-forwarded from GitHub `origin/main` to `54ed3f6` before this work. That update includes the teammate’s Class 8, 9 and 10 courses. Class 6 now contains four modules with eight original chapters each. Class 7 has since been expanded in the same format; see [Class 7 delivery](class-7-delivery.md).

## Course

| Chapter | Cybersecurity | Artificial Intelligence | Computational Thinking | Cyber Fraud |
| --- | --- | --- | --- | --- |
| 1 | What belongs in a public post? | Automatic does not always mean AI | Break a big task into pieces | The reward with a hidden demand |
| 2 | Keep your account keys private | Examples need useful labels | Explain the pattern rule | When a message says hurry and hide |
| 3 | Leave a shared device safely | A pattern is a clue, not a promise | Instructions a helper can follow | A code is not a prize ticket |
| 4 | Does this app need that? | Try examples it has not practised | If this, then that | A familiar name can be copied |
| 5 | Take the known route | Whose examples are missing? | Repeat with a clear count | A picture is not seller evidence |
| 6 | A safer game and group | A fluent answer still needs checking | Plan a route on a grid | The pop-up that offers to fix everything |
| 7 | A copy you can recover | Ask clearly, share carefully | Find the first wrong step | Ask for help without blame |
| 8 | The discovery club safety check | Should the club use this helper? | Build and test the discovery trail | The discovery club message case |

Each 40-minute chapter plan follows the senior course format: three topics and outcomes, six narrated story scenes, an explained decision, three required practical activities, an evidence notebook, reflection, family activity and teacher guide with a three-point rubric. Story captions contain 193–225 English words. The chapter duration includes practice and discussion; it is not the narration duration.

The content uses fictional school, club, object, account and message examples suitable for Class 6. No real passwords, one-time codes, payments, private datasets or live AI accounts are required. The practicals use six existing controls: choices, multiple selection, matching, ordering, number entry and tested grid routes. The route evaluator accepts any route satisfying the stated goal, obstacles, required stops and move limit.

The existing shared story player, practical controls, feedback, evidence persistence and LMS grading are reused. Every chapter now has original topic-specific artwork in its story, practical work and library card, with English/Hindi descriptions and smaller responsive previews. The Class 6 story layout displays the complete chapter illustration instead of the previous generic drawing and unrelated portrait. See [artwork details](class-6-artwork.md). English narration and English/Hindi text follow the existing language switcher. Hindi audio is not included.

## Integration and maintenance

Authored bilingual content is in `app/data/class6/`. The library, module catalogue and assignment picker use exactly the 32 new `cyber-class6-*` identities. Historical lesson identities and metadata remain readable. Classes 3–5 and 8–12 retain their existing authored courses; the Class 10 textbook libraries remain available.

Compile and narrate after editing captions:

```sh
node scripts/build-class6-assets.mjs
python scripts/narrate-class6.py --workers 4
node scripts/build-class6-assets.mjs
```

Use a compatible Node runtime and an authoring Python environment with the existing narration dependencies. The shared compiler retains measured cues only when speech and voice settings still match. The Hindi ownership manifest preserves existing or manually edited translations. All 25,816 pre-existing Hindi messages were verified unchanged when adding this course.

The learner library is `/grade/6`; teachers can preview `/grade/6?role=teacher`. Course and artwork checks are in `tests/class-6-curriculum.test.mjs` and `tests/class-6-artwork.test.mjs`. The combined browser runner is `tests/class-6-browser-qa.py`; it checks both artwork layouts and the authenticated learner/LMS flow. Use a disposable localhost server with `CYBERSURAKSHA_EPHEMERAL_WORKERS=1` for isolated local data.

## Verification

TypeScript and the final production build pass. ESLint reports no errors; its image-element advice includes the two new local, pre-optimised responsive-image uses as well as the four existing image warnings. The focused course/language/artwork checks pass, including all 32 story decisions, all 96 practical solutions, rejection and explanation of wrong submissions, catalogue/assignment agreement, Hindi coverage and preservation of the other grades. All 32 MP3s decode and match their current narration hashes; measured narration lasts 92.436–111.108 seconds per chapter, totalling 54.29 minutes.

The full Node suite reports 288 passing tests and four existing unrelated failures: the external Chapter 8 film source, older fraud QR/reporting wording, toy-workshop motion and the external trigonometry film source. Those tests and their failing source paths were not changed to hide failures.

The authenticated browser run completes all 32 chapters and 96 practicals, checks all six mechanics in English/Hindi, all story alternatives and 64 wrong practical preview submissions. It verifies bilingual notebook reload, actual teacher evidence, saved reflection, first-response retry scoring, assignment marks and grade access restrictions. Desktop library/story and mobile practice screenshots were inspected. A Class 6-only style fixes the reused practice header’s pale text; the browser check confirms the readable computed colours. Browser data used ephemeral local Workers storage.

With the final artwork installed, the combined delivery runner passes again. Its artwork pass checks every chapter’s story on both desktop and mobile, every chapter’s mobile practical view, all 32 library previews, Hindi image descriptions, keyboard focus, layout bounds and absence of page errors. All 64 WebP files decode at their intended sizes and match the saved manifest. The image review corrected unapproved permission switches and a counting-trace mismatch. The design detector reports no findings.

The delivery includes repository code and self-hosted images/audio. No production deployment was performed as part of this course delivery.
