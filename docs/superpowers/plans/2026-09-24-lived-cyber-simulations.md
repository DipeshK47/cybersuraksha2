# Lived Cyber Simulations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Replace the repeated three-choice CyberSuraksha arcade with 18 polished, functional, age-specific digital simulations.

**Architecture:** Preserve the existing dynamic `/module/cyber/:slug` route, grade filtering, runtime persistence, assessment IDs, and lesson registry. Replace `CyberArcadeMission` with a thin shared `CyberExperienceFrame`, reusable behavioural interface shells, and dedicated stateful experience components whose interactions match each lesson story.

**Tech Stack:** React client components, TypeScript, CSS Modules, inline SVG, lucide-react, existing `CyberLessonRuntime`, Node test runner, Vinext/Vite.

## Global Constraints

- Keep the existing 18 slugs, grade assignments, strands, and three assessment IDs per lesson.
- Add no routes and no runtime dependencies.
- Accept and display fictional data only; never persist typed credentials, PINs, OTPs, payment details, or messages.
- No external navigation, uploads, camera, microphone, contact, banking, or payment APIs.
- Objectives contain at most six words; active instructions contain at most eight words.
- No universal answer dock and no systematic first-position correct answer.
- Every visible actionable control must work with touch, mouse, and keyboard.
- Controls are at least 44 px and motion respects `prefers-reduced-motion`.
- Every experience must render without horizontal overflow at 390 px.
- Preserve mistake teaching, hints, checkpoints, assessments, save, restart, and completion.
- Do not commit implementation work unless the user explicitly asks.

---

### Task 1: Architecture quality gates

**Files:**
- Create: `tests/cyber-lived-simulations.test.mjs`
- Modify: `tests/cyber-arcade-redesign.test.mjs`
- Modify: `tests/cyber-lessons-quality.test.mjs`

**Interfaces:**
- Consumes: all files below `app/module/cyber/` and `app/data/cyber-lessons.json`.
- Produces: source-level regression gates for dedicated simulations, short copy, fictional data, interaction diversity, and removal of the universal choice dock.

- [x] Add a failing test that rejects `CyberArcadeMission` imports from all 18 lesson components and rejects a shared three-choice `actionDock` as the primary interaction.
- [x] Add a failing test requiring `BrowserShell`, `PhoneShell`, `SocialShell`, `GameShell`, `DragBoard`, `EvidenceTray`, and `SimulationInput`.
- [x] Add a failing test requiring 18 distinct `data-experience` markers and at least six interaction families: `game`, `drag-sort`, `browser`, `phone`, `social`, and `editor`.
- [x] Add a failing test that validates every objective contains at most six words.
- [x] Add a failing test that checks fictional credentials and forbids external links, real payment submission, camera, microphone, and persisted typed values.
- [x] Run `node --test tests/cyber-lived-simulations.test.mjs tests/cyber-lessons-quality.test.mjs` and confirm the failures are caused by the current universal architecture.

### Task 2: Shared production experience framework

**Files:**
- Create: `app/module/cyber/experience/experience-types.ts`
- Create: `app/module/cyber/experience/useCyberExperience.ts`
- Create: `app/module/cyber/experience/CyberExperienceFrame.tsx`
- Create: `app/module/cyber/experience/cyber-experience-frame.module.css`
- Create: `app/module/cyber/experience/shells/BrowserShell.tsx`
- Create: `app/module/cyber/experience/shells/PhoneShell.tsx`
- Create: `app/module/cyber/experience/shells/SocialShell.tsx`
- Create: `app/module/cyber/experience/shells/GameShell.tsx`
- Create: `app/module/cyber/experience/shells/DragBoard.tsx`
- Create: `app/module/cyber/experience/shells/EvidenceTray.tsx`
- Create: `app/module/cyber/experience/shells/SimulationInput.tsx`
- Create: `app/module/cyber/experience/shells/simulation-shells.module.css`
- Modify: `app/module/cyber/world/CyberCast.tsx`

**Interfaces:**
- `ExperienceDefinition`: `{ id, objective, place, guide, scenes, completionTitle, completionSummary, familyMove }`.
- `useCyberExperience(runtime, definition, assessmentIds)`: returns namespaced saved scene state, first-attempt assessment recording, hints, recovery, scene completion, and final completion methods.
- `CyberExperienceFrame`: renders platform chrome and arbitrary simulation children without imposing controls or stage labels.
- Shell components: controlled components that receive state and callbacks; none access the runtime directly.

- [x] Implement namespaced state so each lesson saves only serialisable progress and never typed fictional credentials.
- [x] Implement first-attempt assessment recording with recoverable mistakes and no duplicate assessment events.
- [x] Implement the compact frame with score, scene progress, optional sound, help, restart, cast, live announcements, and completion summary.
- [x] Implement realistic controlled browser, phone, social, and game shells with only functional controls.
- [x] Implement keyboard-accessible drag/sort, evidence collection, and fictional-input primitives.
- [x] Add responsive, focus-visible, reduced-motion, and 44 px target styling.
- [x] Run the Task 1 tests and lint the new framework.

### Task 3: Classes 3–4 functional experiences

**Files:**
- Create: `app/module/cyber/experience/lower/PrivacyBackpackExperience.tsx`
- Create: `app/module/cyber/experience/lower/SmartHomeExperience.tsx`
- Create: `app/module/cyber/experience/lower/CoinRunnerExperience.tsx`
- Create: `app/module/cyber/experience/lower/BlockGameExperience.tsx`
- Create: `app/module/cyber/experience/lower/TrainingConveyorExperience.tsx`
- Create: `app/module/cyber/experience/lower/PhoneHandoffExperience.tsx`
- Create: `app/module/cyber/experience/lower/lower-experiences.module.css`
- Modify: all six files under `app/module/cyber/lessons/lower/`

**Interfaces:**
- Each component accepts `CyberLessonComponentProps` and owns its story state through `useCyberExperience`.
- Each component exports one named experience and one unique `data-experience` marker.

- [x] Build backpack drag/sort with `Share` and `Keep Private` destinations and keyboard move controls.
- [x] Build the home helper lab with operating controls and observable rule-versus-guess panels.
- [x] Build the controllable coin runner with collision-safe movement, collectibles, layered prize pop-ups, reporting, and resume.
- [x] Build the block-world game with movement, block collection, bridge building, live chat interruption, evidence, block, and return to play.
- [x] Build the AI training conveyor with labelling, training, test result, and repair loop.
- [x] Build the borrowed-phone experience with video, risky interruption, screen lock, and trusted-adult handoff.
- [x] Replace the six lower lesson wrappers with their dedicated experience imports.
- [x] Verify short copy, touch controls, keyboard controls, mobile layout, hints, mistakes, and saved completion.

### Task 4: Class 5 functional experiences

**Files:**
- Create: `app/module/cyber/experience/middle/AccountCentreExperience.tsx`
- Create: `app/module/cyber/experience/middle/ClassChatExperience.tsx`
- Create: `app/module/cyber/experience/middle/ChatbotCheckExperience.tsx`
- Create: `app/module/cyber/experience/middle/AdaptiveFeedExperience.tsx`
- Create: `app/module/cyber/experience/middle/UpiFlowExperience.tsx`
- Create: `app/module/cyber/experience/middle/GiveawayBrowserExperience.tsx`
- Create: `app/module/cyber/experience/middle/middle-experiences.module.css`
- Modify: all six files under `app/module/cyber/lessons/middle/`

**Interfaces:**
- Account, chat, feed, UPI, and giveaway simulations compose the shared shells but keep separate reducers and assessment actions.

- [x] Build the game account centre with passphrase tiles, verification toggle, recovery check, and unknown-session sign-out.
- [x] Build the live class chat with incoming messages, freeze, evidence capture, report, support, and no-forward flow.
- [x] Build chatbot claim highlighting, source-card inspection, evidence attachment, and answer correction.
- [x] Build a scrollable feed whose next items respond to watch, like, skip, hide, and deliberate search actions.
- [x] Build `SurakshaPay` with fictional balance, recipient, amount, collect request, supplied fictional PIN, money animation, receipt, and cancellation.
- [x] Build the giveaway browser with address inspection, layered pop-ups, notification denial, download stop, page report, and safe exit.
- [x] Replace the six middle lesson wrappers with their dedicated experience imports.
- [x] Verify no real payment or credential values are accepted or persisted.

### Task 5: Classes 6–7 functional experiences

**Files:**
- Create: `app/module/cyber/experience/upper/PhotoPrivacyExperience.tsx`
- Create: `app/module/cyber/experience/upper/AiWorkbenchExperience.tsx`
- Create: `app/module/cyber/experience/upper/ImpersonationChatExperience.tsx`
- Create: `app/module/cyber/experience/upper/FakeLoginBrowserExperience.tsx`
- Create: `app/module/cyber/experience/upper/MediaEvidenceExperience.tsx`
- Create: `app/module/cyber/experience/upper/InfluencerShopExperience.tsx`
- Create: `app/module/cyber/experience/upper/upper-experiences.module.css`
- Modify: all six files under `app/module/cyber/lessons/upper/`

**Interfaces:**
- Editors and investigation desks expose direct-manipulation state and record assessments only at meaningful evidence or recovery actions.

- [x] Build photo zoom, clue inspection, crop, blur, location removal, audience preview, and exposure meter.
- [x] Build the school AI workbench with personal notes, fictional AI response, source checking, inline editing, and unsupported-copy highlighting.
- [x] Build urgent social chat, profile inspection, voice-note transcript, known-contact calling, response comparison, evidence, and block flow.
- [x] Build the Chrome-inspired fake-login journey with fictional input, suspicious address reveal, connection panel, pop-up, known-tab return, and password recovery.
- [x] Build the media desk with zoom, comparison, metadata, source matching, evidence pinning, uncertainty, and confidence control.
- [x] Build the `CircleUp` feed-to-DM-to-shop journey with comments, link transition, catalogue, cart, checkout pressure, merchant inspection, exit, and reporting.
- [x] Replace the six upper lesson wrappers with their dedicated experience imports.
- [x] Verify uncertainty is preserved and no visual clue alone is treated as proof of AI generation.

### Task 6: Remove dead repeated-choice architecture

**Files:**
- Delete: `app/module/cyber/world/CyberArcadeMission.tsx`
- Delete: `app/module/cyber/world/CyberSimulationBoard.tsx`
- Delete: `app/module/cyber/world/mission-blueprints.ts`
- Delete: `app/module/cyber/world/cyber-arcade.module.css`
- Delete or replace if unused: `app/module/cyber/lessons/lower/lower-lessons.module.css`
- Delete or replace if unused: `app/module/cyber/lessons/middle/middle-lessons.module.css`
- Delete or replace if unused: `app/module/cyber/lessons/upper/upper-lessons.module.css`
- Modify: cyber lesson tests that referenced the old files.

**Interfaces:**
- Produces: one active experience architecture with no dead universal-choice implementation.

- [x] Confirm no imports reference the old arcade files.
- [x] Remove the old components and unused band styles.
- [x] Update source tests to validate dedicated functional simulations instead of static scenes.
- [x] Run all cyber tests and `git diff --check`.

### Task 7: Production verification

**Files:**
- Modify: `docs/superpowers/plans/2026-09-24-lived-cyber-simulations.md`

**Interfaces:**
- Produces: a completed checklist and verified production candidate.

- [x] Run `node --test tests/cyber-*.test.mjs`.
- [x] Run `node --test tests/*.test.mjs`.
- [x] Run `npm run lint`.
- [x] Run the Node 22.13.0 production build.
- [x] Inspect all 18 lessons at desktop and true 390 px widths.
- [x] Exercise at least one successful and one recovery path in every lesson.
- [x] Verify grade and subject route filtering for Classes 3–7.
- [x] Verify no local development or debug ports remain open after review.
- [x] Mark every completed plan item with verification evidence.

## Verification Evidence

- 90 repository tests pass with `node --test tests/*.test.mjs`.
- ESLint passes with `npm run lint`.
- The Node 22.13.0 Vinext production build completes successfully.
- Browser automation verified all 18 routes at 1280 px and true 390 px without horizontal overflow.
- Browser automation exercised one recovery and one successful action in every lesson.
- Desktop and mobile contact sheets were visually inspected for all 18 initial states.
- Grade filtering tests pass for Classes 3–7, and the existing dynamic route remains the only cyber lesson route.
- `git diff --check` passes and no old arcade implementation imports remain under `app/`.
