# CyberSuraksha interactive lessons implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver 18 age-appropriate, non-repetitive interactive Cybersecurity, Artificial Intelligence, and Cyber Fraud lessons across Classes 3 to 7.

**Architecture:** Add a band-aware lesson catalog and dynamic route, then share only persistence, analytics, accessibility, feedback, and completion plumbing. Each lesson remains a dedicated React composition with a unique primary mechanic, visual metaphor, progression, and outcome.

**Tech stack:** Next.js 16, React 19, TypeScript 5.9, CSS Modules, Zod, lucide-react, existing activity and module-run APIs, Node test runner.

## Global constraints

- Do not change or rebuild existing Computational Thinking lessons.
- Do not require video, narration, a microphone, a camera, a real account, a real OTP, a real UPI PIN, or an external website.
- Keep all lesson scenarios fictional and safe. No student-entered personal information leaves the component.
- Use one band-level module ID for lessons shared by Classes 3 and 4 or Classes 6 and 7.
- Keep the 18 primary mechanics distinct within each band.
- Preserve teacher preview behavior and existing module-run reporting.
- Use explanation-first feedback, three progressive hints, at least three scored decisions, and one transfer task per lesson.
- Use 44 px minimum targets, keyboard operation, visible focus, live-region feedback, and reduced-motion handling.
- Do not commit changes unless the user explicitly asks for commits.

---

### Task 1: Curriculum strands and band-aware registry

**Files:**
- Create: `tests/cyber-curriculum.test.mjs`
- Modify: `app/data/curriculum.ts`
- Modify: `app/data/module-registry.ts`
- Modify: `app/grade/[grade]/page.tsx`
- Modify: `app/dashboard/page.tsx`

**Interfaces:**
- Produces: `CurriculumStrand` values `Cybersecurity` and `Cyber Fraud`.
- Produces: `PlayableModule.grades: readonly number[]` while keeping existing single-grade modules valid.
- Produces: `getPlayableModule(grade: number, title: string)` matching against `grades`.

- [x] **Step 1: Write the failing curriculum and registry test**

Create a Node test that reads the four source files and asserts:

```js
assert.match(curriculum, /\| "Cybersecurity"/);
assert.match(curriculum, /\| "Cyber Fraud"/);
assert.match(registry, /grades: readonly number\[\]/);
assert.match(registry, /module\.grades\.includes\(grade\)/);
assert.match(gradePage, /strandCounts/);
assert.match(dashboard, /Cybersecurity/);
assert.match(dashboard, /Cyber Fraud/);
```

- [x] **Step 2: Run the test and confirm the intended failure**

Run: `node --test tests/cyber-curriculum.test.mjs`

Expected: FAIL because the new strands and `grades` contract do not exist.

- [x] **Step 3: Add strand types and band-aware registry support**

Change `PlayableModule` to:

```ts
export type PlayableModule = {
  id: string;
  title: string;
  grades: readonly number[];
  strand: CurriculumStrand;
  href: string;
};
```

Convert existing `grade` fields to one-item `grades` arrays and make `getPlayableModule` use `module.grades.includes(grade)`.

- [x] **Step 4: Replace CT-versus-AI assumptions in class and dashboard UI**

Create a `strandCounts` map from `grade.modules`, render only non-zero strand counts, and assign distinct icons or modifiers to CT, AI, Cybersecurity, and Cyber Fraud. Update dashboard copy so it names all four curriculum areas without changing subject-only grades.

- [x] **Step 5: Run the focused test**

Run: `node --test tests/cyber-curriculum.test.mjs`

Expected: PASS.

- [x] **Step 6: Review the diff without committing**

Run: `git diff -- app/data/curriculum.ts app/data/module-registry.ts 'app/grade/[grade]/page.tsx' app/dashboard/page.tsx tests/cyber-curriculum.test.mjs`

Expected: only strand, registry, and display integration changes.

---

### Task 2: Typed catalog for all 18 lessons

**Files:**
- Create: `app/data/cyber-lessons.json`
- Create: `app/data/cyber-lessons.ts`
- Create: `tests/cyber-lesson-catalog.test.mjs`
- Modify: `app/data/curriculum.ts`
- Modify: `app/data/module-registry.ts`

**Interfaces:**
- Produces: `CyberLessonBand = "lower" | "middle" | "upper"`.
- Produces: `CyberLessonMeta` with `id`, `slug`, `title`, `band`, `grades`, `strand`, `summary`, `primaryMechanic`, `openingPattern`, `completionPattern`, `accent`, `durationMinutes`, `assessmentIds`, and `familyAction`.
- Produces: literal `CYBER_LESSON_SLUGS` and its union type `CyberLessonSlug`.
- Produces: `cyberLessons`, `getCyberLesson(slug)`, and `getCyberLessonsForGrade(grade)`.

- [x] **Step 1: Write the failing catalog test**

Parse `app/data/cyber-lessons.json` and assert:

```js
assert.equal(lessons.length, 18);
assert.equal(new Set(lessons.map((lesson) => lesson.id)).size, 18);
assert.equal(new Set(lessons.map((lesson) => lesson.slug)).size, 18);

for (const band of ["lower", "middle", "upper"]) {
  for (const strand of ["Cybersecurity", "Artificial Intelligence", "Cyber Fraud"]) {
    assert.equal(
      lessons.filter((lesson) => lesson.band === band && lesson.strand === strand).length,
      2,
    );
  }
}

for (const lesson of lessons) {
  assert.equal(lesson.assessmentIds.length, 3);
  assert.ok(lesson.familyAction.length >= 20);
}
```

Also assert that primary mechanics, opening patterns, and completion patterns are unique across the catalog, and that lower lessons use grades `[3, 4]`, middle lessons `[5]`, and upper lessons `[6, 7]`.

- [x] **Step 2: Run the catalog test and confirm failure**

Run: `node --test tests/cyber-lesson-catalog.test.mjs`

Expected: FAIL because the catalog does not exist.

- [x] **Step 3: Add the complete JSON catalog**

Add the 18 approved titles and these stable slugs:

```text
can-i-tell-this
someone-new-in-my-game
smart-helper-or-normal-tool
teach-moti-to-sort
free-coins-tap-now
the-grown-ups-phone
save-my-game-account
trouble-in-the-class-group
can-the-chatbot-be-wrong
why-does-my-feed-repeat
upi-paying-or-receiving
the-gaming-giveaway-trap
what-did-this-photo-reveal
the-almost-real-login-page
use-ai-without-losing-your-thinking
real-edited-or-ai-made
my-friend-suddenly-needs-money
the-influencer-shop-and-giveaway
```

Use IDs in the form `cyber-lower-security-can-i-tell-this` and equivalent stable band/strand names. Give every lesson exactly three assessment IDs prefixed by its slug.

- [x] **Step 4: Add Zod validation and catalog helpers**

Define `CYBER_LESSON_SLUGS` as an `as const` tuple using the 18 stable slugs above, derive `CyberLessonSlug` from that tuple, and parse the JSON once at module load. Fail fast when the tuple and JSON differ, or on duplicate IDs, duplicate slugs, repeated mechanics or patterns, incorrect grade arrays, missing assessment IDs, or unsupported strands. Export typed lookup helpers without importing `curriculum.ts`, which avoids a cycle.

- [x] **Step 5: Add catalog lessons to curriculum and playable modules**

Append `getCyberLessonsForGrade(grade)` results to Classes 3 through 7. Map catalog entries into `playableModules` with href `/module/cyber/${lesson.slug}`.

- [x] **Step 6: Run catalog and curriculum tests**

Run: `node --test tests/cyber-lesson-catalog.test.mjs tests/cyber-curriculum.test.mjs`

Expected: PASS.

---

### Task 3: Shared runtime, progress, feedback, and completion saving

**Files:**
- Create: `app/module/cyber/lesson-types.ts`
- Create: `app/module/cyber/useCyberLessonRun.ts`
- Create: `app/module/cyber/CyberLessonFrame.tsx`
- Create: `app/module/cyber/cyber-lesson-frame.module.css`
- Create: `tests/cyber-lesson-runtime.test.mjs`

**Interfaces:**
- Consumes: `CyberLessonMeta` and the existing `useActivityEmitter` hook.
- Produces: `CyberLessonRole`, `LessonScoreKind`, `LessonDecision`, `LessonSaveStatus`, and `CyberLessonComponentProps`.
- Produces: `useCyberLessonRun({ lesson, role, studentId })`.
- Produces: `CyberLessonFrame` that supplies platform chrome without controlling lesson scene order.

- [x] **Step 1: Write the failing runtime contract test**

Assert that the runtime source contains:

```js
for (const event of [
  "module_started",
  "question_answered",
  "hint_used",
  "mistake",
  "privacy_leak",
  "module_completed",
]) {
  assert.ok(runtime.includes(event));
}
assert.match(runtime, /localStorage/);
assert.match(runtime, /\/api\/module-runs/);
assert.match(runtime, /role === "teacher"/);
assert.match(runtime, /saveAttempt/);
```

Assert that `CyberLessonFrame` contains a skip link, progress label, exit link, reset control, live save status, and no hard-coded scene list.

- [x] **Step 2: Run the runtime test and confirm failure**

Run: `node --test tests/cyber-lesson-runtime.test.mjs`

Expected: FAIL because runtime files do not exist.

- [x] **Step 3: Define lesson runtime types**

Use this component contract:

```ts
export type CyberLessonComponentProps = {
  lesson: CyberLessonMeta;
  runtime: CyberLessonRuntime;
};

export type LessonDecision = {
  id: string;
  correct: boolean;
  kind: "drill" | "recall";
  category: string;
  unsafe?: boolean;
};
```

The runtime exposes `checkpoint`, `setCheckpoint`, `state`, `updateState`, `recordDecision`, `recordMistake`, `recordHint`, `completeLesson`, `resetLesson`, `saveStatus`, and `retrySave`.

- [x] **Step 4: Implement versioned local progress**

Use storage key `cybersuraksha-cyber-${lesson.slug}-v1-${studentId ?? "preview"}`. Persist only serializable lesson state, checkpoint, answered assessment IDs, scores, completion, and elapsed start time. Validate restored shapes and discard corrupt data.

- [x] **Step 5: Implement analytics and server save**

Emit one `question_answered` event per assessment ID, one `privacy_leak` event per distinct unsafe decision, and module completion once. Post the existing module-run shape with derived drill, recall, leaks, rank, path, and duration. Suppress all network activity in teacher preview or unsigned preview.

- [x] **Step 6: Implement neutral platform chrome**

The frame provides title, strand, class band, exit, restart, optional progress text, lesson content slot, and save retry. It must not render a repeated rail, quiz block, completion card, or fixed next button.

- [x] **Step 7: Add accessible feedback behavior**

Reuse `MistakeDialog`, `HintDrawer`, and `LearningHelpButton`. Restore focus after dialogs, announce checkpoint changes, and avoid mandatory sound. Add reduced-motion styles and exact-property transitions.

- [x] **Step 8: Run the runtime test**

Run: `node --test tests/cyber-lesson-runtime.test.mjs`

Expected: PASS.

---

### Task 4: Dynamic route and lesson component registry

**Files:**
- Create: `app/module/cyber/[slug]/page.tsx`
- Create: `app/module/cyber/CyberLessonPage.tsx`
- Create: `app/module/cyber/lessons/lesson-registry.tsx`
- Create: `tests/cyber-lesson-route.test.mjs`

**Interfaces:**
- Consumes: `getCyberLesson(slug)` and `CyberLessonComponentProps`.
- Produces: `getCyberLessonComponent(slug)` with one component for every catalog slug.
- Produces: route props `role`, `studentId`, `className`, and `grade`.

- [x] **Step 1: Write the failing route test**

Assert that the server route resolves the slug, calls `notFound()` for an unknown lesson, parses teacher or student context, and passes the catalog lesson into `CyberLessonPage`. Parse catalog slugs and assert each appears in `lesson-registry.tsx`.

- [x] **Step 2: Run the route test and confirm failure**

Run: `node --test tests/cyber-lesson-route.test.mjs`

Expected: FAIL because the route and registry do not exist.

- [x] **Step 3: Implement the route and client boundary**

The server page validates that the optional `grade` query belongs to `lesson.grades`; otherwise use the first lesson grade. `CyberLessonPage` starts the runtime and renders the lesson component inside `CyberLessonFrame`.

- [x] **Step 4: Create an explicit component registry**

Use an exhaustive `Record<CyberLessonSlug, ComponentType<CyberLessonComponentProps>>`. Do not use a generic fallback lesson. A missing component must be a TypeScript error.

- [x] **Step 5: Run the route test**

Run: `node --test tests/cyber-lesson-route.test.mjs`

Expected: PASS after the lesson components in Tasks 5 through 7 populate the registry. Until then, keep this task marked incomplete.

---

### Task 5: Six lower-band lessons

**Files:**
- Create: `app/module/cyber/lessons/lower/CanITellThis.tsx`
- Create: `app/module/cyber/lessons/lower/SomeoneNewInMyGame.tsx`
- Create: `app/module/cyber/lessons/lower/SmartHelperOrNormalTool.tsx`
- Create: `app/module/cyber/lessons/lower/TeachMotiToSort.tsx`
- Create: `app/module/cyber/lessons/lower/FreeCoinsTapNow.tsx`
- Create: `app/module/cyber/lessons/lower/TheGrownUpsPhone.tsx`
- Create: `app/module/cyber/lessons/lower/lower-lessons.module.css`
- Create: `tests/cyber-lessons-lower.test.mjs`
- Modify: `app/module/cyber/lessons/lesson-registry.tsx`

**Interfaces:**
- Consumes: `CyberLessonComponentProps`, existing hint and mistake types, and runtime decision methods.
- Produces: six exported lesson components and six registry entries.

- [x] **Step 1: Write the failing lower-band source and content test**

Assert all six files exist and export the expected component. Assert the primary mechanic markers `backpack`, `branching-chat`, `home-lab`, `training-conveyor`, `popup-escape`, and `phone-handoff` occur once each. Assert every file references its three catalog assessment IDs, at least three hints, a transfer decision, an accessible live region, and `completeLesson`.

- [x] **Step 2: Run the lower-band test and confirm failure**

Run: `node --test tests/cyber-lessons-lower.test.mjs`

Expected: FAIL because lower lesson files do not exist.

- [x] **Step 3: Build `CanITellThis` and `SomeoneNewInMyGame`**

Implement the three-pocket information backpack and branching game chat. Use tap-to-select plus destination buttons instead of pointer-only drag. Show backpack transparency and shield changes through CSS state classes. Include new-context transfer scenarios before completion.

- [x] **Step 4: Build `SmartHelperOrNormalTool` and `TeachMotiToSort`**

Implement the home object capability lab and training conveyor. Let children run the model against unseen examples, observe a wrong sort caused by bad examples, then repair the examples. Do not describe AI as thinking or feeling.

- [x] **Step 5: Build `FreeCoinsTapNow` and `TheGrownUpsPhone`**

Implement multiplying pop-up consequences without trapping focus, and a borrowed-phone handoff simulation covering payment, OTP, install, and unknown-link screens. Never display a realistic PIN entry or request real input.

- [x] **Step 6: Add distinct lower-band layouts and motion**

Give each lesson a different scene silhouette and accent pair. Use motion only for feedback, state indication, and the rare completion moment. Gate hover motion and add reduced-motion overrides.

- [x] **Step 7: Run lower, route, catalog, and runtime tests**

Run: `node --test tests/cyber-lessons-lower.test.mjs tests/cyber-lesson-route.test.mjs tests/cyber-lesson-catalog.test.mjs tests/cyber-lesson-runtime.test.mjs`

Expected: lower tests PASS; route remains incomplete until all 18 registry entries exist.

---

### Task 6: Six middle-band lessons

**Files:**
- Create: `app/module/cyber/lessons/middle/SaveMyGameAccount.tsx`
- Create: `app/module/cyber/lessons/middle/TroubleInTheClassGroup.tsx`
- Create: `app/module/cyber/lessons/middle/CanTheChatbotBeWrong.tsx`
- Create: `app/module/cyber/lessons/middle/WhyDoesMyFeedRepeat.tsx`
- Create: `app/module/cyber/lessons/middle/UpiPayingOrReceiving.tsx`
- Create: `app/module/cyber/lessons/middle/TheGamingGiveawayTrap.tsx`
- Create: `app/module/cyber/lessons/middle/middle-lessons.module.css`
- Create: `tests/cyber-lessons-middle.test.mjs`
- Modify: `app/module/cyber/lessons/lesson-registry.tsx`

**Interfaces:**
- Produces: six middle-band lesson components and registry entries.
- Records: exactly three catalog assessment decisions plus unscored exploration decisions per lesson.

- [x] **Step 1: Write the failing middle-band test**

Assert six exports, the unique markers `passphrase-forge`, `group-chat-intervention`, `fact-check-desk`, `feed-sandbox`, `upi-direction-simulator`, and `giveaway-clue-lens`, three assessment IDs per lesson, transfer tasks, hint sets, and completion calls.

- [x] **Step 2: Run the middle-band test and confirm failure**

Run: `node --test tests/cyber-lessons-middle.test.mjs`

Expected: FAIL because middle lesson files do not exist.

- [x] **Step 3: Build the two Cybersecurity lessons**

Create a passphrase forge with a simulated guess meter and recovery choices. Create a group-chat incident where harm and support are separate meters, with screenshot, report, comfort, delete, forward, and pause actions.

- [x] **Step 4: Build the two AI lessons**

Create a fact-check desk where high chatbot confidence can coexist with missing evidence. Create a feed sandbox whose recommendation mix changes from watch, skip, like, and intentional search actions.

- [x] **Step 5: Build the UPI lesson**

Model shop payment, money receipt, collect request, and fake refund flows. Always show the direction of money before confirmation. Teach that a UPI PIN authorises payment and is not needed to receive money. Use fictional balances, names, QR art, and transactions.

- [x] **Step 6: Build the gaming giveaway investigation**

Provide an internal page and message replica with inspectable sender, address, urgency, reward, login, and OTP clues. Require evidence collection before the final response unlocks.

- [x] **Step 7: Add distinct middle-band layouts and motion**

Avoid reusing the lower-band silhouettes. Keep feed transitions interruptible, avoid countdown pressure in assessed questions, and use reduced-motion fallbacks.

- [x] **Step 8: Run middle, catalog, registry, and runtime tests**

Run: `node --test tests/cyber-lessons-middle.test.mjs tests/cyber-lesson-catalog.test.mjs tests/cyber-curriculum.test.mjs tests/cyber-lesson-runtime.test.mjs`

Expected: PASS.

---

### Task 7: Six upper-band lessons

**Files:**
- Create: `app/module/cyber/lessons/upper/WhatDidThisPhotoReveal.tsx`
- Create: `app/module/cyber/lessons/upper/TheAlmostRealLoginPage.tsx`
- Create: `app/module/cyber/lessons/upper/UseAiWithoutLosingYourThinking.tsx`
- Create: `app/module/cyber/lessons/upper/RealEditedOrAiMade.tsx`
- Create: `app/module/cyber/lessons/upper/MyFriendSuddenlyNeedsMoney.tsx`
- Create: `app/module/cyber/lessons/upper/TheInfluencerShopAndGiveaway.tsx`
- Create: `app/module/cyber/lessons/upper/upper-lessons.module.css`
- Create: `tests/cyber-lessons-upper.test.mjs`
- Modify: `app/module/cyber/lessons/lesson-registry.tsx`

**Interfaces:**
- Produces: six upper-band lesson components and registry entries.
- Uses: evidence-based uncertainty rather than claiming a single clue proves fraud or synthetic media.

- [x] **Step 1: Write the failing upper-band test**

Assert six exports, markers `photo-evidence-scanner`, `browser-inspector`, `ai-thinking-map`, `media-evidence-board`, `second-channel-roleplay`, and `shop-investigation-budget`, assessment IDs, transfer tasks, hints, and completion calls.

- [x] **Step 2: Run the upper-band test and confirm failure**

Run: `node --test tests/cyber-lessons-upper.test.mjs`

Expected: FAIL because upper lesson files do not exist.

- [x] **Step 3: Build the two Cybersecurity investigations**

Create an image evidence scanner with audience inference rings and a browser inspector that exposes sandboxed capture consequences. Include safe recovery through a known app or typed address.

- [x] **Step 4: Build the two AI investigations**

Create an assignment thinking map separating learner work, AI suggestions, and verified sources. Create a media evidence board where source and corroboration matter more than visual oddities and uncertainty remains a valid verdict.

- [x] **Step 5: Build the two Cyber Fraud investigations**

Create a cross-channel impersonation role-play and a limited-budget social-shop investigation. Introduce a fictional voice-note clue without playing generated audio; represent it as a transcript and provenance card so audio is optional.

- [x] **Step 6: Add distinct upper-band layouts and motion**

Use denser but readable evidence layouts, explicit uncertainty states, and non-game-like completion summaries. Preserve mobile stacking and keyboard order.

- [x] **Step 7: Complete the exhaustive registry**

Add all six upper entries, confirm all 18 catalog slugs map to a dedicated component, and remove any temporary registry scaffolding.

- [x] **Step 8: Run upper and route tests**

Run: `node --test tests/cyber-lessons-upper.test.mjs tests/cyber-lesson-route.test.mjs`

Expected: PASS.

---

### Task 8: Cross-lesson quality and non-repetition gate

**Files:**
- Create: `tests/cyber-lessons-quality.test.mjs`
- Modify: lesson files only when the quality test finds a real defect.

**Interfaces:**
- Consumes: all catalog and lesson source files.
- Produces: an automated quality gate for required content and structural variation.

- [x] **Step 1: Write the quality test**

Assert:

```js
assert.equal(new Set(lessons.map((lesson) => lesson.primaryMechanic)).size, 18);
assert.equal(new Set(lessons.map((lesson) => lesson.openingPattern)).size, 18);
assert.equal(new Set(lessons.map((lesson) => lesson.completionPattern)).size, 18);
```

For every lesson source, assert three assessment IDs, a transfer marker, at least one `aria-live` or equivalent status region, keyboard-operable buttons, a hint set, explanation-first mistake content, and no `<video>`, mandatory `<audio>`, external URL navigation, PIN input, OTP input, or collection of personal data.

- [x] **Step 2: Run the quality test and inspect every failure**

Run: `node --test tests/cyber-lessons-quality.test.mjs`

Expected: FAIL for any missing variation metadata or content gate.

- [x] **Step 3: Fix repetition and content gaps**

Change lesson composition, copy, or visual treatment rather than weakening the test. Keep common infrastructure excluded from repetition checks.

No repetition or content gaps were reported by the first complete quality-gate run.

- [x] **Step 4: Run all lesson-focused tests**

Run: `node --test tests/cyber-*.test.mjs`

Expected: PASS with 0 failures.

---

### Task 9: Full verification and delivery checklist

**Files:**
- Modify: `docs/superpowers/specs/2026-09-23-cybersuraksha-interactive-lessons-design.md`
- Modify: `docs/superpowers/plans/2026-09-23-cybersuraksha-interactive-lessons.md`

**Interfaces:**
- Produces: checked delivery status and recorded verification evidence.

- [x] **Step 1: Run all Node tests**

Run: `node --test tests/*.test.mjs`

Expected: all tests PASS.

- [x] **Step 2: Run lint**

Run: `npm run lint`

Expected: exit code 0 with no errors.

- [x] **Step 3: Run the production build with the required Node version**

Run: `npm run build`

Expected: exit code 0 on Node `>=22.13.0`. If the local runtime remains older, record the exact version error and do not claim build success.

- [x] **Step 4: Inspect representative routes at each band**

Check one Cybersecurity, one AI, and one Cyber Fraud lesson at mobile and desktop widths for Classes 3, 5, and 7. Verify keyboard order, focus restoration, reduced motion, progress restoration, completion saving, retry, and teacher-preview suppression.

- [x] **Step 5: Audit requirements against the approved spec**

Confirm all 18 routes are discoverable in the intended grades, each primary mechanic is unique, every lesson has three scored checks and a transfer task, and no lesson depends on video or audio.

- [x] **Step 6: Check the delivery boxes with evidence**

Update both documentation files only for tasks proven by fresh command output or route inspection. Leave blocked items unchecked and record the blocker.

- [x] **Step 7: Review final repository status without committing**

Run: `git status --short` and `git diff --stat`.

Expected: only the planned lesson, catalog, integration, test, style, and documentation files are changed. Existing untracked curriculum documents remain untouched.

## Verification evidence — 2026-09-23

- `node --test tests/*.test.mjs`: 78 tests passed, 0 failed.
- `npm run lint`: completed with 0 errors.
- `npx -y node@22.13.0 node_modules/vinext/dist/cli.js build`: production build completed and registered `/module/cyber/:slug`.
- Class library HTTP checks: Classes 3, 4, 5, 6, and 7 each rendered six distinct cyber lesson links.
- Representative route checks: lower Cybersecurity, middle Cyber Fraud/UPI, and upper AI routes returned HTTP 200 and rendered at desktop, 500 px narrow, and exact 390 px emulated widths.
- Exact 390 px layout metrics: `innerWidth`, `clientWidth`, and document `scrollWidth` all remained 390 px for each representative lesson. The upper evidence rail regression was corrected and rechecked.
- Browser behavior checks: hint focus returned to the invoking button; reduced-motion transitions collapsed to near-zero duration; local progress survived reload; teacher completion generated zero `/api/module-runs` requests; failed student save exposed retry and the retry issued a second request.
- `git status --short` and `git diff --stat`: only planned source, lesson, test, style, and documentation changes are present; the three supplied curriculum documents and existing sibling untracked files remain untouched.

---

### Task 10: Grade-specific subject libraries

- [x] Split lower- and upper-band lessons so Classes 3, 4, 6, and 7 only receive their own three lessons.
- [x] Move the new AI, Cybersecurity, and Cyber Fraud lessons from the mixed module grid into subject banners.
- [x] Extend subject pages to render interactive lesson cards while preserving English and Class 10 chapter libraries.
- [x] Run focused tests, the complete test suite, lint, and a Node 22 production build.
- [x] Inspect the Class 3–7 subject banners and representative lesson links in the running app.

Verification: 80 Node tests passed, lint completed without errors, the Node 22.13.0 production build completed, and all 15 Cybersecurity/AI/Cyber Fraud subject pages for Classes 3–7 returned only the lessons assigned to that class.
