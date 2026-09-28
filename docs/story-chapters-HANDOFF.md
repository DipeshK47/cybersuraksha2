# Story chapters — handoff (for continuing on another machine / Claude cloud)

**Goal:** turn the 24 new CyberSuraksha chapters (W1–2, W9–10, W17–18, W25–26 × Classes 3–4 / 5 / 6–7) into narrated six-scene story chapters in the exact format of the approved template **Password Vault Builder** (Rohan's missing moon base). Do **not** edit the template chapter.

## Where things are
- Rules every chapter follows: `docs/story-chapters-brief.md` (read first).
- All 23 remaining chapter specs (curriculum objective, mechanic, approved story, mid-story task, hero, visuals): the `C` array in `docs/story-chapters-workflow.js`. That file is the multi-agent workflow that builds them; its absolute paths are for the original Mac.
- Shared story player: `app/module/cyber/lessons/new/story/` (`StoryPlayer.tsx`, `StoryCharacter.tsx`, `characters.ts`, `types.ts`, `story-player.module.css`, `registry.tsx`).
- Template chapter: `app/module/cyber/lessons/new/story/chapters/password-vault-builder.{tsx,json,module.css,qa.cjs}`.
- Chapters register themselves: any `chapters/<lesson-slug>.tsx` is picked up automatically.
- **Status (Sept 28, 2026):** all 24 chapters are built and pass browser QA; the integration steps below are done (storyArcs, credits, lint/tsc/tests/build).
- **Done so far:** every `chapters/<slug>.tsx` that exists. Check `ls app/module/cyber/lessons/new/story/chapters/`. A chapter is finished when its browser QA ends `ALL PASSED`.

## Heroes
Class 3–4: Rohan (`boy-emotions`; Nani appears in the UI). Class 5: Tara (`girl-expressions`). Class 6–7: Kabir (`emotional-avatar`). Stories follow Codex's story plan for Classes 5 and 6–7. New characters live in `public/animations/characters/<id>/` and are registered in `characters.ts`.

## Tools on a new machine
```bash
npm ci
npx playwright install chromium          # QA browser
pip install kokoro-onnx soundfile numpy  # narration
# Kokoro model files (same voice as Rohan: am_fenrir, speed 0.92):
#   kokoro-v1.0.onnx + voices-v1.0.bin from https://github.com/thewh1teagle/kokoro-onnx/releases
export KOKORO_DIR=/path/to/those/files
```
Also needs `ffmpeg` and `ffprobe` on PATH.

## Commands
```bash
STORY_NO_HMR=1 npm run dev -- --port 3200                    # dev server used by QA (HMR off for parallel QA)
python3 scripts/story-narration.py <slug>                    # narration mp3 + cue times into <slug>.json
STORY_QA_CHANNEL= node scripts/story-qa.cjs <slug>           # browser QA; empty channel = bundled Chromium
python3 scripts/with-slot.py <name> <slots> -- <command>     # queue heavy commands when running agents in parallel
```

## When all chapters exist
1. Replace each chapter's `storyArcs["<slug>"]` lines in `app/module/cyber/lessons/new/StoryPrelude.tsx` so the practice intro continues that story with its hero (keep the `stories[...]` entries: `tests/new-curriculum-missions.test.mjs` requires them).
2. Add any extra credits to `public/cyber-missions/ASSET-CREDITS.md`.
3. Run `npm run lint`, `npx tsc --noEmit -p .` (errors under `db/`, `worker/` and `vite.config.ts` are pre-existing), `node --test tests/new-curriculum-missions.test.mjs`, `npm run build`, and story QA for all 24 slugs.
