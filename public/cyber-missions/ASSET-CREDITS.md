# Dog training photos

These photos are used in the fictional Training Day dataset exercise.

- `dog-golden.jpg`: [GoldenRetriever.jpg](https://commons.wikimedia.org/wiki/File:GoldenRetriever.jpg), Ltshears, public domain dedication.
- `dog-indie.jpg`: [An Indian Pariah Dog.jpg](https://commons.wikimedia.org/wiki/File:An_Indian_Pariah_Dog.jpg), Amogh Tripathi, CC0 1.0.
- `dog-pug.jpg`: [Pugs.JPG](https://commons.wikimedia.org/wiki/File:Pugs.JPG), Pugman, public domain dedication.

The files were resized by Wikimedia's thumbnail service where available; no content was otherwise modified.

# Password Vault Builder explainer

- `fairground-vault.jpg`: original background generated for this chapter with OpenAI image generation; the animated safe and labels are live interface elements.
- `../audio/cyber/password-vault-builder/explainer.mp3`: AI-generated English narration, synthesized offline with [Piper](https://github.com/OHF-Voice/piper1-gpl) using the [en_US-kristin-medium voice](https://huggingface.co/rhasspy/piper-voices/blob/main/en/en_US/kristin/medium/MODEL_CARD). Its model card identifies the source recordings as public-domain LibriVox material. The exact spoken text is in `PasswordVaultPrelude.tsx`.

## Password Vault Builder — Rohan story, September 28, 2026

- `public/animations/password-story/rohan.riv`: **Boy with emotions** by **gty**, https://rive.app/community/files/5918-11535-boy-with-emotions/ . Marketplace license: CC BY, https://creativecommons.org/licenses/by/4.0/ . Original vector animation; story controls the Emotions and Wind inputs. `happy.png`, `sad.png`, `thinking.png`, `surprise.png` are fallback frame exports from this asset. Visible attribution is included in the chapter's Animation credits disclosure.
- Rive runtime: `@rive-app/canvas` 2.42.1, MIT. Its matching `rive.wasm` is self-hosted in `public/animations/password-story/`; no CDN needed at playback.
- `moonbase-story.webp`: original AI-generated illustration, built-in image generation tool. Prompt: a lovingly constructed toy-like lunar outpost with cream domes, teal windows, orange airlock, rover, greenhouse, and Earth in the starry sky; no characters or text. Exported to WebP for the fictional game screen.
- `rohan-story.mp3`: AI male narration generated locally using Kokoro-82M / `am_fenrir`, speed 0.92, with kokoro-onnx. Model license Apache-2.0; runtime MIT. https://huggingface.co/hexgrad/Kokoro-82M and https://github.com/thewh1teagle/kokoro-onnx . Script and cue times: `app/module/cyber/lessons/new/password-vault-story.json`. Normalized to -18 LUFS, true peak target -1.5 dB. Replaces Piper in this chapter.
- Workflow references: freshtechbro/claudedesignskills `rive-interactive` and `lottie-animations` (MIT); b1rdmania/claude-lottie-skill consulted for discovery only, no code copied; installed `animate` for state changes, pause, and reduced motion. LottieFiles public queries returned HTTP 403; the shipped character comes from Rive Marketplace.

## Story cast characters, September 28, 2026
- `public/animations/characters/girl-expressions/girl-expressions.riv`: **Facial Expression Demo** by **JcToon**, https://rive.app/community/files/669-1300-facial-expression-demo/ . Marketplace license: CC BY, https://creativecommons.org/licenses/by/4.0/ . Original vector animation, unmodified; story sets its Happy, Smile, Sad, Surprise and Neutral blend inputs ("thinking" = Smile 40 + Sad 30). `happy.png`, `sad.png`, `thinking.png`, `surprise.png` are fallback frame exports from this asset. Chapters using it show this attribution in their Animation credits disclosure.
- `public/animations/characters/emotional-avatar/emotional-avatar.riv`: **Emotional Avatar** by **malchemist**, https://rive.app/community/files/25739-48068-emotional-avatar/ . Marketplace license: CC BY, https://creativecommons.org/licenses/by/4.0/ . Original vector animation, unmodified; story plays its `happy`, `sad`, `suspicious` (thinking) and `surprised` timelines over State Machine 1. `happy.png`, `sad.png`, `thinking.png`, `surprise.png` are fallback frame exports from this asset. Chapters using it show this attribution in their Animation credits disclosure.

## Narrated story chapters (24), September 28, 2026

- `../audio/cyber/<lesson-slug>/story.mp3` for all 24 story chapters (sharing-backpack, robot-or-not, teach-pet-machine, pattern-detective, step-by-step-morning, nanis-secret-code, surprise-pop-up, password-vault-builder, password-vault, permission-control-panel, training-day, garbage-in-garbage-out, flowchart-architect, loop-inspector, otp-guardian, qr-code-caution, online-reputation-builder, email-header-inspector, deepfake-detective, recommendation-rabbit-hole, complex-algorithmic-logic, algorithm-optimization, digital-arrest-simulation, deepfake-voice-relative-scam): AI male narration generated locally with Kokoro-82M / `am_fenrir`, speed 0.92, via kokoro-onnx (`scripts/story-narration.py`), normalised to -18 LUFS. Model license Apache-2.0; runtime MIT. https://huggingface.co/hexgrad/Kokoro-82M and https://github.com/thewh1teagle/kokoro-onnx . Scripts written for this project.
- Heroes: Rohan (Classes 3–4, “Boy with emotions”), Tara (Class 5, “Facial Expression Demo”) and Kabir (Classes 6–7, “Emotional Avatar”); see the Rive credits above. Each chapter’s player also shows its character credit.
- Scene backgrounds reused from this folder: `morning-room.webp`, `pattern-station.webp`, `bookshop-payment.webp`, `engineering-lab.webp`, `safe-call-desk.webp` (project illustrations added with the first CyberSuraksha commit; their original source is not recorded here and should be confirmed before public release) and `fairground-vault.jpg` (credited above).
- Dog photos `dog-golden.jpg`, `dog-indie.jpg`, `dog-pug.jpg` (credited at the top of this file) are cropped in the Training Day story, whose credits panel names each author and license.
- Every other scene visual (phones, call and video-call screens, chats, feeds, email clients and raw headers, UPI screens, code consoles, flowcharts, robots, and the illustrated callers in the deepfake and fake-police stories) is drawn with CSS/SVG and `lucide-react` icons (ISC license). Illustrated people are drawings, not real faces. All names, phone numbers (+91 00000 …) and `.example` domains are fictional.
