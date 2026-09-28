# CyberSuraksha Arcade Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 18 lightweight scenario-card lessons with visual, multi-stage, playable missions using a consistent Cyber Squad cast.

**Architecture:** Add a shared mission world containing character artwork, stage navigation, scoring, sound feedback, and visual instruction primitives. Keep each lesson component as the owner of a distinct simulation, but compose the same cast and mission chrome so the product feels coherent without making the games repetitive.

**Tech Stack:** React client components, TypeScript, CSS Modules, inline SVG, existing CyberSuraksha runtime and learning-support components, Node test runner.

## Global Constraints

- All 18 approved lesson slugs and grade assignments remain unchanged.
- No new runtime dependency.
- No required video or audio; optional tones use Web Audio only after interaction.
- No typed personal, payment, PIN, or OTP data.
- Every stage is keyboard and touch operable with controls at least 44 px.
- Respect `prefers-reduced-motion`.
- Do not use the English modules as the implementation reference.

---

### Task 1: Quality gates for the arcade redesign

**Files:**
- Modify: `tests/cyber-lessons-quality.test.mjs`
- Modify: `tests/cyber-lessons-lower.test.mjs`
- Modify: `tests/cyber-lessons-middle.test.mjs`
- Modify: `tests/cyber-lessons-upper.test.mjs`

**Interfaces:**
- Consumes: existing 18 lesson components and three band CSS modules.
- Produces: failing checks for recurring cast, four-stage progression, visual instructions, sound controls, score feedback, and 18 distinct simulation markers.

- [x] Write source-level tests requiring Tara, Kabir, Meera, Byte, four mission stages, visual-first instructions, stage locks, sound controls, and one unique `data-simulation` value per lesson.
- [x] Run `node --test tests/cyber-lessons-*.test.mjs` and confirm failures describe missing arcade behavior.

### Task 2: Shared Cyber Squad world

**Files:**
- Create: `app/module/cyber/world/CyberCast.tsx`
- Create: `app/module/cyber/world/CyberArcadeMission.tsx`
- Create: `app/module/cyber/world/CyberSimulationBoard.tsx`
- Create: `app/module/cyber/world/mission-blueprints.ts`
- Create: `app/module/cyber/world/cyber-arcade.module.css`
- Modify: `app/module/cyber/lesson-types.ts`
- Modify: `app/module/cyber/CyberLessonFrame.tsx`
- Modify: `app/module/cyber/cyber-lesson-frame.module.css`

**Interfaces:**
- Consumes: `CyberLessonRuntime`, lesson metadata, role and grade context.
- Produces: `CyberCharacter`, `CyberMission`, `MissionStage`, `VisualPrompt`, score/sound/progress controls, and reusable animated feedback.

- [x] Build consistent SVG characters with expression and pose variants.
- [x] Build four-stage mission navigation with locks, score crystals, optional interaction tones, compact speech bubbles, and completion celebrations.
- [x] Upgrade the global frame to the visual density and progress clarity of Toy Workshop while preserving save/retry behavior.
- [x] Run focused quality tests and fix accessibility failures.

### Task 3: Classes 3–4 playable missions

**Files:**
- Modify: all six files under `app/module/cyber/lessons/lower/`
- Modify: `app/module/cyber/lessons/lower/lower-lessons.module.css`

**Interfaces:**
- Consumes: shared mission world and existing runtime assessment IDs.
- Produces: backpack sorter, building-game interruption, home tool lab, Byte training conveyor, pop-up coin arcade, and trusted-adult phone handoff.

- [x] Rebuild each lesson as four short visual stages with one distinct simulation.
- [x] Keep visible instruction copy to one short sentence per action.
- [x] Preserve three assessment IDs, transfer stage, hints, explanation-first mistakes, and completion saving.
- [x] Run lower-band and quality tests.

### Task 4: Class 5 playable missions

**Files:**
- Modify: all six files under `app/module/cyber/lessons/middle/`
- Modify: `app/module/cyber/lessons/middle/middle-lessons.module.css`

**Interfaces:**
- Consumes: shared mission world and existing runtime assessment IDs.
- Produces: account shield forge, class-group moderation, chatbot source race, feed tuner, UPI flow simulator, and giveaway clue sweep.

- [x] Rebuild each lesson as four short visual stages with one distinct simulation.
- [x] Make the UPI lesson animate money direction and teach that receiving money never needs a UPI PIN.
- [x] Preserve three assessment IDs, transfer stage, hints, explanation-first mistakes, and completion saving.
- [x] Run middle-band and quality tests.

### Task 5: Classes 6–7 playable investigations

**Files:**
- Modify: all six files under `app/module/cyber/lessons/upper/`
- Modify: `app/module/cyber/lessons/upper/upper-lessons.module.css`

**Interfaces:**
- Consumes: shared mission world and existing runtime assessment IDs.
- Produces: photo scanner, browser inspector, AI workflow builder, media evidence board, second-channel verifier, and protected-budget shop investigation.

- [x] Rebuild each lesson as four-stage visual investigations with manipulable tools and evidence.
- [x] Preserve uncertainty in synthetic-media decisions and safe second-channel verification.
- [x] Preserve three assessment IDs, transfer stage, hints, explanation-first mistakes, and completion saving.
- [x] Run upper-band and quality tests.

### Task 6: Full verification and live review

**Files:**
- Modify: `docs/superpowers/plans/2026-09-23-cyber-arcade-redesign.md`

**Interfaces:**
- Produces: completed checklist and verification evidence.

- [x] Run `node --test tests/*.test.mjs` (85 passing).
- [x] Run `npm run lint` (clean).
- [x] Run the Node 22.13.0 production build (successful).
- [x] Inspect representative lessons across buckets and bands at desktop and true 390 px widths.
- [x] Verify Class 3–7 subject routes still expose only their assigned lessons.
- [x] Keep the development server running for review at `http://localhost:3010`.
