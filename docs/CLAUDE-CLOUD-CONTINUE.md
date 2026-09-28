# Continue the CyberSuraksha story-chapter build (prompt for a fresh Claude session)

You are picking up a job another Claude session was doing on my Mac. You have no memory of it, so everything you need is below and in this repo. Please read all of this before touching anything.

## 1. The project
CyberSuraksha is a Next-style app (built with vinext on Vite + Cloudflare) teaching cyber safety, AI, computational thinking and fraud safety to Indian school kids in the fictional town of Cyberpur. The curriculum has 3 bands: **Classes 3–4 (lower)**, **Class 5 (middle)** and **Classes 6–7 (upper)**. It also has 4 modules. The job covers the first two weeks of each module per band (W1–2, W9–10, W17–18, W25–26), which makes **24 chapters**.

Each chapter used to open with a short "tap two things" intro. I approved a new format: a **narrated six-scene story** with an animated character whose face changes with the story (Rive), captions, scene tabs, and a mid-story task the learner must solve before narration continues. Then the existing practice game follows. The approved template is **Password Vault Builder** (Class 3, Rohan's missing moon base). Every other chapter gets a *different story about its own topic* in the *exact same format*, and difficulty grows with the class.

## 2. Status right now
- **Done (do NOT redo or restyle them; I said "leave what's done"):** every slug listed in `docs/story-chapters-results.json`, which also stores each builder's QA summary, self-review, practice intro lines and notes. At the time of writing that is 19 chapters: all 7 Class 3–4 (Rohan), all 8 Class 5 (Tara), and 4 Class 6–7 (Kabir: online-reputation-builder, email-header-inspector, deepfake-detective, recommendation-rabbit-hole).
- **Remaining (unless a later commit added them; check with `git log` and `ls app/module/cyber/lessons/new/story/chapters/`):** `complex-algorithmic-logic`, `algorithm-optimization`, `digital-arrest-simulation`, `deepfake-voice-relative-scam` (all Class 6–7, hero Kabir). A chapter whose files exist but that isn't in the results file may be half-built: finish it, don't restart it.
- Then do the **wrap-up** (section 8).

## 3. Read these files first
1. `docs/story-chapters-brief.md`: the rules for every chapter (story arc, difficulty per class, file contract, UI kit classes, visuals policy, narration, QA, India-specific safety facts). **Follow it exactly.**
2. `docs/story-chapters-HANDOFF.md`: tools and commands.
3. The template: `app/module/cyber/lessons/new/story/chapters/password-vault-builder.{tsx,json,module.css,qa.cjs}`.
4. A finished Class 6–7 example with Kabir: `chapters/email-header-inspector.*` or `chapters/online-reputation-builder.*`.
5. Shared player (read-only): `app/module/cyber/lessons/new/story/StoryPlayer.tsx`, `StoryCharacter.tsx`, `characters.ts`, `types.ts`, `story-player.module.css`, `registry.tsx` (any `chapters/<slug>.tsx` registers itself via `import.meta.glob`).
6. `docs/story-chapters-workflow.js`: its `C` array has the full spec for every chapter. Its code and absolute paths are for my Mac, so don't run it.

## 4. Specs for the remaining chapters (hero: Kabir, asset `emotional-avatar`, moods happy/sad/thinking/surprise; Class 6–7 level)
These follow the story plan I approved (from Codex). For Class 6–7 the hero is Kabir, not Meera.
- **complex-algorithmic-logic** (M3 · W17). Objective: solve multi-variable logic problems using pseudocode (CBSE CT). Mechanic: draft pseudocode using nested loops and multi-condition arrays to process student grades. Story: Kabir helps with the school's report-card program. A classmate with exactly 40 marks and good attendance is rejected as "Fail" (an eligible score turned away), and the last student in every section is missing from the list. He traces the nested-loop pseudocode line by line to find the boundary error. Task: fix `IF marks > 40 AND attendance >= 75` → `>=`, and the inner loop `FOR s FROM 1 TO count - 1` → `TO count`, then run a test-case table (38, 40, 74 marks; 70% attendance) until all results are correct. Tempting mistake: `> 39` or `>= 39` gets a why-hint (use the boundary the rule states). Visuals: UI-built code console + test table. Practice: `ComplexAlgorithmicLogic` in `ThinkingMissions.tsx`.
- **algorithm-optimization** (M3 · W18). Objective: compare algorithmic efficiency and time complexity. Mechanic: test bubble sort vs merge sort on large datasets to evaluate execution speed. Story: Kabir built the sports-day leaderboard. With 2,000 runners it freezes just before prize time because it uses bubble sort. He tests two sorting methods on different lists (small and neat, reversed, large and mixed) and compares how much work each does (roughly n² against n log n comparisons). Task: run both on 8, 100 and 2,000 items, predict, read the comparison counts, and choose the right algorithm for 2,000 mixed results. Nuance: on a tiny already-sorted list, bubble sort with early exit can win. Tempting mistake: "bubble sort is always slower", or choosing bubble for 2,000, gets a why-hint. Visuals: UI-built leaderboard + race bars + counters. Practice: `AlgorithmOptimization` in `ThinkingMissions.tsx`.
- **digital-arrest-simulation** (M4 · W25). Objective: handle fraudulent "digital arrest" video calls claiming law-enforcement authority. Mechanic: receive a fake video call claiming to be law enforcement; remain calm, spot fake badges, refuse payment, notify 1930. Story: Kabir's mother gets a frightening video call from a man in uniform with a "CBI" badge. He says a parcel in her name had illegal items, that she is under "digital arrest", must stay on camera, tell no one, and pay to clear her name. Kabir notices the signs and helps his family respond calmly. Keep it reassuring, not traumatic. Task: spot the warning signs (odd or unverifiable badge, secrecy demand, payment demand), then choose: end the call, tell family, report to 1930 / cybercrime.gov.in. Tempting mistake: "Pay to clear your name" or "Stay on the call" gets a why-hint. Digital arrest is not a real legal procedure. Visuals: `public/cyber-missions/safe-call-desk.webp` for scenes 1/6, plus a UI-built video call. Practice: `DigitalArrestSimulation` in `FraudMissions.tsx`.
- **deepfake-voice-relative-scam** (M4 · W26). Objective: recognise cloned-voice scams requesting emergency financial help. Mechanic: receive a panicked voice message from a "relative"; use an agreed family passphrase to verify identity. Story: Kabir's family gets an urgent voice message that sounds exactly like his uncle: there has been an accident, his phone is broken, send ₹20,000 now and tell no one. Kabir remembers the family passphrase his parents set up after hearing about voice-cloning scams, and the family verifies before anyone pays. Task: reply asking for the family passphrase; the "uncle" dodges it; call the uncle's saved number, and he is fine. Tempting mistake: "It's his voice, send the money" gets a why-hint. Explain voice cloning from short clips, the passphrase, calling back, and reporting. Visuals: UI-built chat with a voice-note waveform + call screen. Practice: `DeepfakeVoiceRelativeScam` in `FraudMissions.tsx`.

## 5. Hard rules
- Never edit the template (`password-vault-builder.*`) or the shared player files. Check at the end: `git diff 1849dba -- app/module/cyber/lessons/new/story/chapters/password-vault-builder.* public/audio/cyber/password-vault-builder` must be empty.
- Don't change finished chapters, except to fix a real bug that the final QA finds.
- Each chapter touches only `chapters/<slug>.{json,tsx,module.css,qa.cjs}` and `public/audio/cyber/<slug>/story.mp3`.
- Visuals: UI-built, real-looking screens (calls, video calls, chats, emails, feeds, consoles) plus existing art in `public/cyber-missions/`. No external assets, CDNs or new npm dependencies. Fictional `.example` domains and `+91 00000 …` numbers only. No real brands.
- Narration must be the same voice as Rohan: Kokoro `am_fenrir`, speed 0.92, via `scripts/story-narration.py`. Add a `speech` field whenever symbols, acronyms or numbers need a spoken form (₹, OTP, CBI, 1930, SPF, n², ≥).
- Characters are final; I'm fine with them not looking Indian. Heroes: Rohan (`boy-emotions`) for Classes 3–4, Tara (`girl-expressions`) for Class 5, Kabir (`emotional-avatar`) for Classes 6–7.
- **I have a usage limit.** Work one chapter at a time, read big files once, prefer the QA contact sheets over single screenshots, and don't polish past the checklist.
- **Push after each finished chapter** (section 7).

## 6. Setup (Linux)
```bash
npm ci
cp .env.example .env.local
npm i --no-save playwright && npx playwright install --with-deps chromium
pip install kokoro-onnx soundfile numpy pillow
sudo apt-get install -y ffmpeg   # if ffmpeg/ffprobe are missing
mkdir -p ~/kokoro && cd ~/kokoro \
  && curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx \
  && curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin && cd -
export KOKORO_DIR=~/kokoro STORY_QA_CHANNEL= PYTHON=python3
npm run dev -- --port 3200 &     # keep running; QA uses http://localhost:3200
```
If a new chapter doesn't appear (the page shows the old intro and QA times out waiting for `[data-story-player]`), run `touch app/module/cyber/lessons/new/story/registry.tsx` so Vite re-reads the chapter list.

## 7. Per chapter
1. Read its practice component (§4) so the story leads into it.
2. Write `chapters/<slug>.json`: 6 scenes following the brief's arc. Class 6–7 captions are 45–62 words per scene, totalling ~110–135 s of narration.
3. Write `<slug>.tsx` (a `World` component plus `export default chapter`, with `interactionScene: 3`), `<slug>.module.css` and `<slug>.qa.cjs` (`solve(page)` and `wrongAttempt(page)` returning a RegExp).
4. Generate narration: `python3 scripts/story-narration.py <slug>`
5. Check:
   - `npx tsc --noEmit -p .`: errors under `db/`, `worker/` and `vite.config.ts` are pre-existing
   - `npx eslint app/module/cyber/lessons/new/story/chapters/<slug>.*`
   - `node scripts/story-qa.cjs <slug>` must end `ALL PASSED`
6. Look at `.story-qa/<slug>/sheet-desktop.png` and `sheet-mobile.png`, and compare with a finished Kabir chapter's sheets.
7. Self-review with the brief's 8-point checklist.
8. Commit: `git add` the chapter's files, commit "Add <slug> story chapter" ending with `Co-Authored-By: Claude <noreply@anthropic.com>`, then `git pull --rebase && git push`.

## 8. Wrap-up (after all 24 chapters pass)
1. **Practice intros:** in `app/module/cyber/lessons/new/StoryPrelude.tsx`, set `storyArcs["<slug>"]` to 4 lines (practice 1, 2, 3, final payoff) that continue that chapter's story with its hero. Finished chapters' lines are in `docs/story-chapters-results.json` (`practiceArc`); 19 are already applied. Write them for the chapters you build. Keep every `stories[...]` entry, because `tests/new-curriculum-missions.test.mjs` requires them.
2. **Credits:** in `public/cyber-missions/ASSET-CREDITS.md`, the character credits are already added. Add one line saying every chapter's `public/audio/cyber/<slug>/story.mp3` is Kokoro-82M `am_fenrir` narration (Apache-2.0 model, MIT runtime). Also fix the Rohan entry's old file name `rohan-story.mp3` to `story.mp3`.
3. **Known issue to check:** on phones, the site's floating "Ask Suraksha Guide" button sits over the bottom-right of the story panel, and in `training-day` it covers a task button. Find where it's rendered and make the smallest fix, e.g. keep it clear of `[data-story-player]` on screens ≤600px wide.
4. **Final checks:**
   - `npm run lint`
   - `npx tsc --noEmit -p .`
   - `node --test tests/new-curriculum-missions.test.mjs`
   - `npm run build`
   - `node scripts/story-qa.cjs <slug>` for all 24 slugs
   - the template diff check from §5
5. Commit, push, and send me a short summary: chapters built, anything that failed, and anything you weren't sure about.
