# CyberSuraksha visual assets

## Chapter visual refinement, September 28, 2026

Original artwork generated with the built-in OpenAI image generation tool, exported to self-hosted WebP in `refined/`. Prompt set: `docs/chapter-visual-prompts.json`.

- `tiko-happy.webp`, `tiko-low.webp`: matching charged and low-battery toy sprites, used by Rohan's robot stories. Each retains transparent alpha.
- `castle-game.webp`: four-tower castle world; the flag, pop-up and game controls remain live interface elements.
- `sky-garden.webp`: Tara's floating garden game. Account and recovery controls remain live.
- `tiger-drawing.webp`: Rohan's textured crayon tiger drawing.
- `share-in-class.webp`, `keep-private.webp`, `ask-an-adult.webp`: original transparent character illustrations generated with the built-in OpenAI image generation tool for Rohan's sharing practice. The same fictional child talks with a classmate, puts a home card in a locked box, and consults an adult about a photo. The latter two were edited from the first illustration to keep the character and visual style consistent. Self-hosted 480px WebP exports; no third-party artwork.
- `fruit-atlas.webp`: fruit, stone and toy-machine sprites for the existing labelled sorting examples; transparent alpha.
- `pet-market.webp`, `pet-machine-happy.webp`, `pet-machine-confused.webp`, `pet-fruit-basket.webp`, `pet-rock-crate.webp`: original generated artwork for the Class 3 pet-machine stall. Transparent character and container layers; live conveyor, examples, labels and mistake markers stay in the interface. Prompts are included in `docs/chapter-visual-prompts.json`.
- `morning-step-0.webp` through `morning-step-5.webp`, `morning-bus.webp`: illustrated morning-routine props used consistently in Tikku’s list, task and order comparison. Original built-in image generation; prompts and crop notes in `docs/morning-visual-prompts.json`.
- `nani-carrom.webp`, `nani-phone-call.webp`, `nani-mum-reassures.webp`, `nani-code-key.webp`: original generated fictional family scenes and secret-code props. No real people; prompts in `docs/nani-visual-prompts.json`.
- `vault-*.webp`: original generated account-door, safe, notebook and verification-phone props. The account falls, labels and passphrase selections remain live. Prompts and crop notes in `docs/vault-visual-prompts.json`.
- `bakery-interior.webp`, `bakery-portrait-atlas.webp`: original generated bakery scene and five fictional adult bakers, with no real applicants. Existing school names, scores and training rows are teaching examples. Prompts in `docs/bakery-visual-prompts.json`.
- `objects-atlas.webp`: plant, smart speaker, clock and biscuit props; transparent alpha.
- `cricket.webp`, `volcano.webp`, `dragon-sketch.webp`: fictional video-feed thumbnails split from one generated contact sheet.
- `fair-frame-0.webp` through `fair-frame-5.webp`: a fictional organiser in six illustration frames. The blinking, closed-mouth and reversed-lighting clues are deliberate. These are not authentic footage or a real person.
- `pretend-caller.webp`: a fictional actor in a generic costume and office, for the existing scam simulation. The fake badge and warning demands remain live interface elements.
- `solar-filter.webp`: Kabir's fictional school project.
- `bus-photo.webp`, `science-club.webp`: fictional illustrated schoolchildren, used in the existing consent exercise; no real student photos.
- `report-card-workshop.webp`, `sports-day-sort.webp`, `torch-permissions.webp`, `scholarship-inbox.webp`, `recommendation-feed.webp`: original generated practice backdrops for the report-card debugger, race sorting, torch permissions, scholarship email, and video recommendations. The prompts specified a wide school-story scene, contextual subject on the right, a dark title area on the left, and no readable text or logos. Exported as WebP; all scores, permissions, messages, and choices remain live interface content. Generation briefs: `docs/site-visual-review-prompts.json`.
- `city-map-permission.webp`: original generated map-app preview for the location-permission challenge, showing a fictional route and current-location dot without real map data or labels.
- `class-video-permission.webp`: original generated class video-call preview for the camera-and-microphone challenge. The fictional classmates and teacher are generated; the permission switches remain live UI.

The approved moon-base chapter, story scripts and narration are unchanged by this visual pass. Existing animal photos below remain credited separately.

## Animal training photos

These photos are used in the fictional Training Day dataset exercise.

- `dog-golden.jpg`: [GoldenRetriever.jpg](https://commons.wikimedia.org/wiki/File:GoldenRetriever.jpg), Ltshears, public domain dedication.
- `dog-indie.jpg`: [An Indian Pariah Dog.jpg](https://commons.wikimedia.org/wiki/File:An_Indian_Pariah_Dog.jpg), Amogh Tripathi, CC0 1.0.
- `dog-pug.jpg`: [Pugs.JPG](https://commons.wikimedia.org/wiki/File:Pugs.JPG), Pugman, public domain dedication.
- `cat-training.jpg`: [Closeup photo of a cat.jpg](https://commons.wikimedia.org/wiki/File:Closeup_photo_of_a_cat.jpg), RobotBlanket, CC0 1.0.
- `crow-training.jpg`: [Indian Crow.jpg](https://commons.wikimedia.org/wiki/File:Indian_Crow.jpg), Priyanka Bansal, public domain dedication.
- `squirrel-training.jpg`: [Squirrel closeup.JPG](https://commons.wikimedia.org/wiki/File:Squirrel_closeup.JPG), Njose, CC0 1.0.

The files were resized by Wikimedia's thumbnail service where available; no content was otherwise modified.

# Password Vault Builder explainer

- `fairground-vault.jpg`: original background generated for this chapter with OpenAI image generation; the animated safe and labels are live interface elements.

## Password Vault Builder — Rohan story, September 28, 2026

- `public/animations/password-story/rohan.riv`: **Boy with emotions** by **gty**, https://rive.app/community/files/5918-11535-boy-with-emotions/ . Marketplace license: CC BY, https://creativecommons.org/licenses/by/4.0/ . Original vector animation; story controls the Emotions and Wind inputs. `happy.png`, `sad.png`, `thinking.png`, `surprise.png` are fallback frame exports from this asset. Visible attribution is included in the chapter's Animation credits disclosure.
- Rive runtime: `@rive-app/canvas` 2.42.1, MIT. Its matching `rive.wasm` is self-hosted in `public/animations/password-story/`; no CDN needed at playback.
- `moonbase-story.webp`: original AI-generated illustration, built-in image generation tool. Prompt: a lovingly constructed toy-like lunar outpost with cream domes, teal windows, orange airlock, rover, greenhouse, and Earth in the starry sky; no characters or text. Exported to WebP for the fictional game screen.
- `../audio/cyber/password-vault-builder/story.mp3`: AI male narration generated locally using Kokoro-82M / `am_fenrir`, speed 0.92, with kokoro-onnx. Model license Apache-2.0; runtime MIT. https://huggingface.co/hexgrad/Kokoro-82M and https://github.com/thewh1teagle/kokoro-onnx . Script and cue times: `app/module/cyber/lessons/new/story/chapters/password-vault-builder.json`. Normalized to -18 LUFS, true peak target -1.5 dB. Replaces Piper in this chapter.
- Workflow references: freshtechbro/claudedesignskills `rive-interactive` and `lottie-animations` (MIT); b1rdmania/claude-lottie-skill consulted for discovery only, no code copied; installed `animate` for state changes, pause, and reduced motion. LottieFiles public queries returned HTTP 403; the shipped character comes from Rive Marketplace.

## Story cast characters, September 28, 2026
- `public/animations/characters/girl-expressions/girl-expressions.riv`: **Facial Expression Demo** by **JcToon**, https://rive.app/community/files/669-1300-facial-expression-demo/ . Marketplace license: CC BY, https://creativecommons.org/licenses/by/4.0/ . Original vector animation, unmodified; story sets its Happy, Smile, Sad, Surprise and Neutral blend inputs ("thinking" = Smile 40 + Sad 30). `happy.png`, `sad.png`, `thinking.png`, `surprise.png` are fallback frame exports from this asset. Chapters using it show this attribution in their Animation credits disclosure.
- `public/animations/characters/emotional-avatar/emotional-avatar.riv`: **Emotional Avatar** by **malchemist**, https://rive.app/community/files/25739-48068-emotional-avatar/ . Marketplace license: CC BY, https://creativecommons.org/licenses/by/4.0/ . Original vector animation, unmodified; story plays its `happy`, `sad`, `suspicious` (thinking) and `surprised` timelines over State Machine 1. `happy.png`, `sad.png`, `thinking.png`, `surprise.png` are fallback frame exports from this asset. Chapters using it show this attribution in their Animation credits disclosure.

## Story chapter narration, September 28, 2026

- `public/audio/cyber/<lesson-slug>/story.mp3` for all 24 story chapters: AI male narration generated locally with Kokoro-82M / `am_fenrir` at speed 0.92 via kokoro-onnx (`scripts/story-narration.py`), the same voice as the Rohan chapter. Model license Apache-2.0; runtime MIT. The spoken text and cue times for each chapter are in `app/module/cyber/lessons/new/story/chapters/<lesson-slug>.json`.
- Story visuals are built in the interface (React, CSS, inline SVG and lucide-react icons, ISC license) plus the illustrations and photos credited above.

## Password examples revision, 29 September 2026

Both Password Vault narration tracks were regenerated from their chapter JSON with the existing Kokoro-82M `am_fenrir` voice at speed 0.92 using `scripts/story-narration.py`. Updated narration matches the readable familiar-word teaching examples and the two-tile interactions. The approved illustrations and character assets are unchanged. See `docs/password-vault-rework.md`.
