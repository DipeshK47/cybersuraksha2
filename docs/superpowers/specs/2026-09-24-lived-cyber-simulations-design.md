# Lived Cyber Simulations Redesign

**Date:** 2026-09-24
**Status:** Approved direction

## Purpose

Replace the repeated three-choice CyberSuraksha lesson pattern with 18 polished, functional simulations where students operate recognisable digital interfaces, experience consequences, and practise a safe response.

The redesign must feel like playing or using a small application, not answering an MCQ placed below decorative artwork.

## Success Criteria

- Every lesson has a different primary interaction and a different visual setting.
- A child understands the first instruction in one short sentence.
- Objectives use no more than six simple words whenever possible.
- Students manipulate the simulated interface before any assessment decision.
- MCQs are used only when they are the natural interaction, never as the universal lesson structure.
- Choice order is not fixed and the correct answer is never systematically first.
- Browser, chat, game, payment, social-feed, and shopping simulations behave like small working applications.
- All personal, login, payment, and contact details are fictional and remain local to the lesson runtime.
- Every lesson works with touch, mouse, and keyboard at desktop and 390 px mobile widths.
- Controls remain at least 44 px and motion respects `prefers-reduced-motion`.
- Lesson completion, assessment recording, hints, mistake teaching, and saved progress continue to use the existing CyberSuraksha runtime.

## Design Direction

### Functional realism

Interfaces should be immediately familiar without copying proprietary logos or exact branded artwork. A browser uses tabs, an address bar, page content, permission prompts, and downloads. A social app uses a story rail, feed cards, comments, direct messages, and link transitions. A payment app uses a balance, recipient, amount, collect request, PIN screen, receipt, and cancel path.

Every visible control that appears actionable must work. Decorative controls must not look tappable. State changes must remain visible so students can understand cause and effect.

### Fictional identities

The recurring cast remains consistent:

- Tara for Classes 3–4.
- Kabir for Class 5.
- Meera for Classes 6–7.
- Byte as the guide in every band.

Simulated accounts use fictional values such as `kabir@student.demo`, `PixelRaja_47`, `MayaArtClub`, and `SurakshaPay`. Text fields reject or replace real-looking personal information and are never persisted as assessment data.

### Short copy

Each screen has:

- One objective of three to six words.
- One action instruction of eight words or fewer.
- Immediate visual feedback after an action.
- Optional help that demonstrates the next move instead of adding a paragraph.

Long safety explanations appear only after the student has acted, using two short lines at most.

## Architecture

The existing `CyberArcadeMission` and `CyberSimulationBoard` enforce one interaction pattern. They will be replaced as the default lesson renderer.

### Shared platform layer

`CyberExperienceFrame` owns only:

- Lesson title and progress.
- Recurring cast presentation.
- Score and optional sound.
- Help, restart, save, completion, and accessibility announcements.
- Runtime assessment and checkpoint integration.

It does not render universal answer buttons or universal stage names.

### Interaction primitives

Focused reusable primitives provide behaviour without forcing identical lessons:

- `BrowserShell`: tabs, address bar, back, page navigation, pop-ups, permission prompts, downloads, and safe close.
- `PhoneShell`: home screen, app switching, chat, contacts, payment, call, and trusted-adult handoff.
- `SocialShell`: feed, stories, comments, direct messages, sponsored posts, and external-link transition.
- `GameShell`: directional controls, player movement, collectibles, obstacles, overlays, and chat interruptions.
- `DragBoard`: keyboard-accessible move, sort, match, order, and drop interactions.
- `EvidenceTray`: collect, compare, remove, and connect clues.
- `SimulationInput`: fictional-data validation, local state, autofill option, and no persistence.

Each lesson composes only the primitives it needs and owns its own state machine.

### Lesson state machines

Lessons use two to five named scenes suited to their story rather than the repeated `Watch / Try / Challenge / Use It` rail. Examples include `Join Game → Chat Appears → Protect Yourself → Return to Game` and `See Post → Open DM → Visit Shop → Check Out → Exit Safely`.

Assessment events are attached to meaningful actions such as closing a pop-up, inspecting a URL, cancelling a collect request, switching to a known contact, or removing location data.

## Lesson Blueprints

### Class 3

#### Can I Tell This?

- Objective: **Pack only safe details.**
- Experience: Tara packs cards into `Share` and `Keep Private` sections of an animated backpack.
- Interaction: Drag or keyboard-move a favourite fruit, home address, school photo, nickname, phone number, and hobby.
- Consequence: Private cards visibly lock inside a zipped pocket; unsafe sharing makes Byte stop the outgoing message and demonstrate why.
- Assessment: Sorting accuracy, repairing one mistake, and applying the rule to a new card.

#### Smart Helper or Normal Tool?

- Objective: **Test each home helper.**
- Experience: Operate a lamp, alarm, speaker, and recommendation screen in a small home lab.
- Interaction: Toggle controls, change inputs, and observe whether the device follows a fixed rule or makes a data-based guess.
- Consequence: A transparent `rule` or `guess` panel animates behind each result.
- Assessment: Classify by observed behaviour, not by appearance.

#### Free Coins! Tap Now!

- Objective: **Keep Tara’s game safe.**
- Experience: A playable side-view coin runner with left, right, and jump controls.
- Interaction: Collect coins and avoid obstacles until prize pop-ups cover the play area. The student must pause, close the correct layer, and report the fake reward before continuing.
- Consequence: Tapping the fake claim button opens additional overlays and slows the runner without navigating externally.
- Assessment: Close, report, and resume the game safely.

### Class 4

#### Someone New in My Game

- Objective: **Play without sharing secrets.**
- Experience: A recognisable block-building platform game with movement, building, collectibles, and live chat.
- Interaction: Move Tara, collect blocks, build a bridge, and respond when `PixelRaja_47` asks for school, photo, and phone details.
- Consequence: Safe in-world actions include mute, block, save evidence, and tell a trusted adult. The game resumes after protection is complete.
- Assessment: Perform the safe sequence inside the game UI.

#### Teach Moti to Sort

- Objective: **Teach Byte with examples.**
- Experience: A working training conveyor with two labelled bins and a test lane.
- Interaction: Drag examples into groups, run training, test unseen objects, find a bad result, and repair the training set.
- Consequence: Byte’s confidence and mistakes change based on the examples supplied.
- Assessment: Balanced examples, successful test, and correction of one training problem.

#### The Grown-Up’s Phone

- Objective: **Stop and hand it back.**
- Experience: A functional borrowed-phone simulation starting with a video player.
- Interaction: Watch briefly, then encounter a payment request, OTP prompt, install screen, or unknown link. Lock the screen and drag the phone to the trusted-adult handoff area.
- Consequence: Interacting with the risky prompt creates another realistic warning screen; handing it back clears it safely.
- Assessment: Recognise the interruption and complete the handoff sequence.

### Class 5

#### Save My Game Account

- Objective: **Strengthen Kabir’s account.**
- Experience: A game account centre with profile, password, sessions, recovery, and verification settings.
- Interaction: Build a passphrase from word tiles, remove reused personal clues, enable verification, and sign out an unknown device.
- Consequence: A shield meter responds independently to each protection.
- Assessment: Complete three account protections and recover from one weak setup.

#### Trouble in the Class Group

- Objective: **Calm the class chat.**
- Experience: A live class-group chat with incoming messages, reactions, replies, and moderator tools.
- Interaction: Freeze the chat, preserve evidence, report a harmful message, support the targeted student, and avoid forwarding.
- Consequence: Message spread, student mood, and group safety indicators respond to each action.
- Assessment: Complete the support-and-report sequence in the correct order.

#### Can the Chatbot Be Wrong?

- Objective: **Check the chatbot’s answer.**
- Experience: Ask a fictional chatbot a school question, inspect its answer, and open three source cards.
- Interaction: Highlight claims, attach supporting sources, reject unrelated sources, and correct the final answer.
- Consequence: The answer changes from `unchecked` to `supported`, `uncertain`, or `incorrect` based on evidence.
- Assessment: Verify rather than accept the chatbot response.

#### Why Does My Feed Repeat?

- Objective: **Change Kabir’s feed.**
- Experience: A working short-video feed that adapts to likes, watch time, skips, hides, and searches.
- Interaction: Scroll, watch, like, skip, hide, and deliberately search for a different interest.
- Consequence: The next cards change visibly and an optional side panel shows why each item appeared.
- Assessment: Break a repetitive feed using at least two controls.

#### UPI: Paying or Receiving?

- Objective: **Send money the safe way.**
- Experience: A fictional `SurakshaPay` app with balance, contacts, scan, pay, collect request, PIN keypad, cancel, and receipt screens.
- Interaction: Pay a fictional shop, receive a legitimate refund, reject a collect request disguised as a refund, and use a fictional PIN supplied by the simulation only when sending money.
- Consequence: Money direction animates between accounts and the balance changes. The lesson explicitly demonstrates that receiving money does not require a UPI PIN.
- Assessment: Complete one payment, one receipt, and one safe cancellation.

#### The Gaming Giveaway Trap

- Objective: **Escape the fake giveaway.**
- Experience: A giveaway link opens in a browser with countdowns, fake comments, notification prompts, redirects, and download overlays.
- Interaction: Inspect the tab and address bar, dismiss layered pop-ups, deny notifications, stop the download, and report the page.
- Consequence: Unsafe taps create believable additional pressure without leaving the simulation.
- Assessment: Find clues and exit through browser controls.

### Class 6

#### What Did This Photo Reveal?

- Objective: **Make the photo safe.**
- Experience: A photo editor and share-preview screen using fictional gallery images.
- Interaction: Zoom, inspect background clues, remove location, crop a school badge, blur a face, and preview the audience.
- Consequence: A privacy exposure meter updates as information is removed.
- Assessment: Produce a safe share version and explain one removed clue through a short match interaction.

#### Use AI Without Losing Your Thinking

- Objective: **Keep your thinking in charge.**
- Experience: A split-screen school workbench with notes, AI chat, source tray, and final answer editor.
- Interaction: Draft personal ideas, ask AI for suggestions, compare with sources, edit errors, and write a final response in the student’s own words.
- Consequence: Copying directly leaves unsupported sections highlighted; checking and editing clears them.
- Assessment: Complete the `Think → Ask → Check → Rewrite` workflow through actual editing.

#### My Friend Suddenly Needs Money

- Objective: **Check before sending money.**
- Experience: A social chat containing an urgent message and a fictional voice-note transcript.
- Interaction: Inspect the profile, open contacts, call the saved number through a second channel, compare the response, block the impersonator, and preserve evidence.
- Consequence: The contact confirms the original account was copied; the transfer screen remains locked until verification.
- Assessment: Verify identity through the known channel and stop the scam.

### Class 7

#### The Almost-Real Login Page

- Objective: **Find the fake login.**
- Experience: A Chrome-inspired browser with tabs, address bar, password manager prompt, page content, certificate panel, pop-ups, and back navigation.
- Interaction: Enter provided fictional credentials, reveal the suspicious domain, inspect the connection panel, close an urgent pop-up, return to the known school tab, and change the fictional password after the simulated exposure.
- Consequence: Submitting to the fake page creates a visible simulated account alert and recovery path.
- Assessment: Detect, exit, and recover inside the browser.

#### Real, Edited or AI-Made?

- Objective: **Build an evidence-based verdict.**
- Experience: A media investigation desk with zoom, crop comparison, source lookup, metadata, reverse-match cards, and confidence control.
- Interaction: Pin evidence, discard weak clues, compare sources, and set a confidence level rather than making an absolute visual guess.
- Consequence: The verdict cannot be submitted without source evidence and allows `uncertain` as a valid outcome.
- Assessment: Use corroboration and calibrated confidence.

#### The Influencer Shop and Giveaway

- Objective: **Investigate before you buy.**
- Experience: A fictional Instagram-style app with stories, influencer feed, comments, direct messages, sponsored giveaway, external link, shop catalogue, cart, checkout, and report flow.
- Interaction: Scroll the feed, open comments, receive a DM link, visit the shop, add an item, inspect return/contact/domain details, encounter a payment-pressure popup, leave checkout, and report the post.
- Consequence: The protected budget changes only inside the simulation. Unsafe checkout steps expose progressively stronger clues before any fictional payment can complete.
- Assessment: Trace the scam journey and exit before payment.

## Visual System

### Polish standard

- Device shells use consistent geometry, shadows, safe-area spacing, and responsive behaviour.
- Game scenes use layered backgrounds, clear collision areas, responsive controls, and purposeful character animation.
- Browser and social interfaces use realistic density without tiny unreadable text.
- Pop-ups animate from their origin and remain dismissible by keyboard and touch.
- Hover effects appear only on hover-capable devices.
- Focus states are prominent and never depend only on colour.
- Empty, loading, success, warning, and recovery states are designed rather than falling back to plain text.
- No control changes position unexpectedly after a student starts interacting.

### Familiar but fictional

- The browser may resemble common Chromium layouts but uses project-owned icons and branding.
- The social app may resemble familiar photo-sharing layouts but uses the fictional name `CircleUp` and original assets.
- The game uses a simple block-world visual language without copying a named commercial game.
- Payment and shopping experiences use fictional providers and merchants.

## Feedback and Scoring

- Correct direct actions advance the simulation immediately.
- Unsafe actions produce a contained simulated consequence, then offer a recovery action.
- Feedback names what changed on screen instead of saying only `correct` or `wrong`.
- Students may recover and complete the lesson after a mistake.
- Assessment records the first meaningful attempt while the interface continues teaching.
- Completion summaries show actions performed, not only a numerical score.

## Safety and Privacy

- No external navigation, network requests, uploads, microphone, camera, contacts, or real payment APIs.
- No real password, OTP, PIN, card, bank, phone, email, school, or home information is requested.
- Any typed value is held only in component state and cleared on restart or exit.
- Login and payment fields include clear fictional-data labels and autofill buttons.
- Simulated unsafe actions never teach operational scam techniques or reveal real credentials.

## Testing Strategy

### Source and contract tests

- Assert the universal three-choice action dock is not used as the default lesson mechanism.
- Assert all 18 lessons register distinct primary interactions.
- Assert objectives meet the short-copy limit.
- Assert optional choices do not keep the correct answer first.
- Assert login, payment, and chat data is fictional and not persisted.

### Behaviour tests

- Test each lesson’s meaningful state transitions and recovery path.
- Test assessment events occur at the correct action.
- Test unsafe actions cannot navigate externally or submit real information.
- Test keyboard alternatives for drag, match, game movement, and simulated device controls.

### Visual and accessibility verification

- Inspect every lesson at 390 px and desktop widths.
- Verify no horizontal overflow, clipped pop-ups, hidden controls, or unreachable content.
- Verify focus order, labels, live feedback, colour contrast, target size, and reduced motion.
- Verify the Class 3–7 subject routes still expose only their assigned lessons.

## Delivery Sequence

1. Replace the universal choice architecture with the shared functional shells and runtime adapter.
2. Build and verify Classes 3–4 simulations.
3. Build and verify Class 5 simulations.
4. Build and verify Classes 6–7 simulations.
5. Run full automated, responsive, interaction, accessibility, and production-build checks.

The delivery is complete only when all 18 lessons are functional simulations, not when their visual mockups are present.
