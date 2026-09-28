# CyberSuraksha interactive lessons design

## Objective

Build 18 self-guided interactive lessons for three school bands and three curriculum buckets. Each band receives two Cybersecurity lessons, two Artificial Intelligence lessons, and two Cyber Fraud lessons. Computational Thinking remains unchanged.

The Grade 3 CT modules are the minimum quality reference. These lessons must add stronger scenario design, more visible cause and effect, better age adaptation, and richer interaction. No lesson may depend on a video or audio track.

## Scope

| Band | Classes | Cybersecurity | Artificial Intelligence | Cyber Fraud |
| --- | --- | --- | --- | --- |
| Lower | 3 and 4 | Can I Tell This?; Someone New in My Game | Smart Helper or Normal Tool?; Teach Moti to Sort | Free Coins! Tap Now!; The Grown-Up's Phone |
| Middle | 5 | Save My Game Account; Trouble in the Class Group | Can the Chatbot Be Wrong?; Why Does My Feed Repeat? | UPI: Paying or Receiving?; The Gaming Giveaway Trap |
| Upper | 6 and 7 | What Did This Photo Reveal?; The Almost-Real Login Page | Use AI Without Losing Your Thinking; Real, Edited or AI-Made? | My Friend Suddenly Needs Money; The Influencer Shop and Giveaway |

The six lower-band lessons appear in both Class 3 and Class 4. The six upper-band lessons appear in both Class 6 and Class 7. A lesson has one band-level module ID and shared content, while progress remains student-specific.

## Age and delivery rules

### Classes 3 and 4

- Start with shared-family-phone, YouTube, simple-game, camera, and voice-search situations.
- Use short sentences, large targets, direct feedback, and one decision at a time.
- Avoid unexplained terms such as phishing, algorithm, digital footprint, and credentials.
- Target 5 to 8 minutes of active work.

### Class 5

- Start with games, passwords, group chats, search, recommendations, and family payment situations.
- Introduce account, link, OTP, recommendation, and verification through use before naming them.
- Allow two-step decisions and simple branching consequences.
- Target 8 to 10 minutes of active work.

### Classes 6 and 7

- Start with class groups, shared media, social feeds, AI-assisted homework, online shops, and money requests.
- Use evidence comparison, source checking, cross-channel verification, and consequence mapping.
- Avoid adult-only workplace framing and fear-based crime scenarios.
- Target 10 to 15 minutes of active work.

## Product architecture

Use a hybrid architecture. Shared code handles only invisible platform behavior. Every lesson owns its student-facing composition, artwork, progression, and primary mechanic.

### Shared platform layer

The shared layer provides:

- module context and teacher preview handling;
- versioned local progress per student;
- activity events and server-side completion saving;
- keyboard and touch interaction contracts;
- progressive hints and explanation-first mistake feedback;
- screen reader announcements and focus restoration;
- reduced-motion handling;
- completion summaries and practical takeaways.

The shared layer must not impose a fixed sequence of introduction, exercise, quiz, and completion screens.

### Lesson composition layer

Each lesson exports a small controller and its own scene components. Reusable interaction primitives may be composed inside a lesson, but the primary mechanic, layout, visual metaphor, and outcome must be unique.

Permitted shared primitives include selectable cards, drag or tap sorting, evidence markers, message choices, progress meters, device frames, and result panels. A primitive cannot become the full lesson template.

### Routing and discovery

- Add Cybersecurity and Cyber Fraud as curriculum strands while preserving Computational Thinking, Artificial Intelligence, and English.
- Extend the playable module registry to support a lesson available to multiple grades.
- Use a dynamic CyberSuraksha lesson route keyed by a stable slug.
- Keep existing module routes unchanged.
- Show clear strand labels and counts on class pages and dashboards.

## Non-repetition requirements

Only infrastructure may repeat. The following student-facing elements may not be copied unchanged across lessons:

- opening scene structure;
- primary interaction mechanic;
- central visual metaphor;
- sequence of activity types;
- consequence animation;
- completion summary layout;
- mistake copy and hint examples.

No two lessons in the same band may share the same primary mechanic. Across all 18 lessons, a mechanic can reappear only as a secondary interaction and must use different content and visual treatment.

## Lesson designs

### Lower band

#### Can I Tell This?

- **Setting:** Pack a backpack before joining an online game club.
- **Primary mechanic:** Move information cards into `Okay to share`, `Ask a grown-up`, or `Keep private` pockets.
- **Visible consequence:** Unsafe cards make the backpack transparent to unknown game characters. Safe corrections close the pockets.
- **Transfer task:** Decide what a friendly avatar may know during a new scenario.

#### Someone New in My Game

- **Setting:** A new player joins Moti's building game.
- **Primary mechanic:** Branching chat in which requests become gradually more personal.
- **Visible consequence:** A safety shield changes based on leave, block, tell, reply, and secret-keeping decisions.
- **Transfer task:** Help another character respond to a different message without prompting.

#### Smart Helper or Normal Tool?

- **Setting:** Explore familiar objects in Nani's home.
- **Primary mechanic:** Tap objects and test what they can sense, guess, remember, or calculate.
- **Visible consequence:** A comparison board reveals why a calculator, timer, voice helper, and face filter behave differently.
- **Transfer task:** Build one correct `smart helper` card from capability pieces.

#### Teach Moti to Sort

- **Setting:** Teach Moti to prepare toy boxes for a school fair.
- **Primary mechanic:** Supply labelled examples to a sorting conveyor, then run unseen test objects.
- **Visible consequence:** Confusing examples create funny sorting errors that the child repairs by changing the training examples.
- **Transfer task:** Choose a fair example set for a new category.

#### Free Coins! Tap Now!

- **Setting:** Pop-ups interrupt a simple game.
- **Primary mechanic:** Clear an escalating screen by choosing close, inspect, ask, or tap before a countdown distracts the player.
- **Visible consequence:** Unsafe taps multiply pop-ups; safe choices restore the game and protect the coin jar.
- **Transfer task:** Identify the safe exit on a visually different prize message.

#### The Grown-Up's Phone

- **Setting:** A child is watching a video on a family phone when unfamiliar screens appear.
- **Primary mechanic:** A handoff simulation where the learner must decide when to continue and when to return the phone.
- **Visible consequence:** Payment, OTP, install, and unknown-link screens visibly lock until a grown-up takes over.
- **Transfer task:** Order the three actions: stop, return, explain.

### Middle band

#### Save My Game Account

- **Setting:** Repair a game account after a weak password is guessed.
- **Primary mechanic:** Forge a passphrase from memorable word tiles, test predictable patterns, and secure recovery choices.
- **Visible consequence:** A simulated attacker tries likely guesses while the account gate becomes stronger or weaker.
- **Transfer task:** Reject a teammate's request to share the password without losing the friendship.

#### Trouble in the Class Group

- **Setting:** A class chat begins forwarding an embarrassing photograph.
- **Primary mechanic:** Live group-chat intervention with pause, evidence capture, report, delete, comfort, and forward actions.
- **Visible consequence:** A harm meter and support meter respond independently, showing that stopping a post and helping a person are separate actions.
- **Transfer task:** Choose an action plan for a second group-chat incident.

#### Can the Chatbot Be Wrong?

- **Setting:** A school fact-check desk receives answers from a chatbot.
- **Primary mechanic:** Compare claims with source cards, mark unsupported details, and rewrite the final answer.
- **Visible consequence:** A confidence stamp can remain high even when evidence coverage falls, exposing confident mistakes.
- **Transfer task:** Decide when to ask the chatbot, check another source, or ask a teacher.

#### Why Does My Feed Repeat?

- **Setting:** Control a simulated short-video feed.
- **Primary mechanic:** Watch, skip, like, and search while a recommendation model changes the next cards.
- **Visible consequence:** The feed narrows or broadens in real time, with no hidden score shown before the learner experiments.
- **Transfer task:** Use reset, intentional search, and selective watching to create a balanced feed.

#### UPI: Paying or Receiving?

- **Setting:** Help a family member at a shop and during a fake refund message.
- **Primary mechanic:** Operate a safe payment simulator that distinguishes merchant QR codes, collect requests, payment screens, and incoming money.
- **Visible consequence:** The balance preview and direction arrow show whether money will leave or arrive before confirmation.
- **Core rule:** A UPI PIN authorises a payment. It is not required to receive money.
- **Transfer task:** Stop a fake cashback flow that asks the learner to scan a QR code and enter a PIN.

#### The Gaming Giveaway Trap

- **Setting:** Investigate a free-skin tournament promoted through game chat.
- **Primary mechanic:** Examine a linked page using a clue lens for address, sender, urgency, login request, OTP request, and impossible reward.
- **Visible consequence:** Collected clues build a case board and unlock the correct response rather than awarding points for random taps.
- **Transfer task:** Compare a legitimate event notice with a copied scam page.

### Upper band

#### What Did This Photo Reveal?

- **Setting:** Review a photograph before posting it to a class group.
- **Primary mechanic:** Scan an image for school badge, house number, timetable, location clue, reflection, and people without consent.
- **Visible consequence:** Audience rings show who could combine separate clues and what they could infer.
- **Transfer task:** Crop, blur, delay, restrict, or cancel a second post and justify the choice.

#### The Almost-Real Login Page

- **Setting:** Compare a genuine school or game login with a copied version.
- **Primary mechanic:** Browser inspection using address segments, connection state, spelling, page behavior, and recovery route.
- **Visible consequence:** The learner can submit to a sandbox and then see exactly what information the fake page would capture.
- **Transfer task:** Recover safely by opening the known app or typed address instead of following the message link.

#### Use AI Without Losing Your Thinking

- **Setting:** Complete a school assignment with an AI study helper.
- **Primary mechanic:** Build prompts for explanation, quiz, critique, and planning, then choose which parts require personal work and source checks.
- **Visible consequence:** A thinking map shows which ideas came from the learner, the AI, and verified sources.
- **Transfer task:** Repair an assignment that contains copied text, an invented fact, and personal information.

#### Real, Edited or AI-Made?

- **Setting:** Investigate a viral school-event image, video frame, and voice clip.
- **Primary mechanic:** Assemble an evidence board using source, date, context, visual inconsistencies, audio inconsistencies, and corroboration.
- **Visible consequence:** The verdict remains uncertain until enough independent evidence is collected. Visual oddities alone cannot finish the case.
- **Transfer task:** Write the safest action: share, label uncertainty, verify, or report.

#### My Friend Suddenly Needs Money

- **Setting:** A friend's account sends an urgent payment or verification-code request.
- **Primary mechanic:** Role-play across chat, phone, and an in-person contact list to verify through a second channel.
- **Visible consequence:** The timeline reveals how urgency suppresses verification and how one separate check breaks the scam.
- **Transfer task:** Handle a voice note that sounds familiar but changes the payment destination.

#### The Influencer Shop and Giveaway

- **Setting:** Assess a social-media shop selling limited merchandise with a giveaway.
- **Primary mechanic:** Spend a limited investigation budget on seller history, return policy, copied images, payment method, comments, and domain age clues supplied inside the lesson.
- **Visible consequence:** The purchase-risk estimate changes only when evidence is gathered, not when the learner guesses.
- **Transfer task:** Choose buy, verify further, use a protected marketplace, or leave, then explain the decision.

## Feedback and assessment

Every lesson must include:

- immediate visible consequences for meaningful actions;
- an explanation for every incorrect safety decision;
- progressive hints that move from a nudge to a worked example;
- at least three scored comprehension decisions;
- at least one new-context transfer task;
- a completion summary describing what the learner did, not only a percentage;
- one practical family or classroom action.

Question events use `drill` for supported practice and `recall` for transfer decisions. Unsafe disclosure or payment actions emit `privacy_leak` only when the action represents a real vulnerability, not for every ordinary mistake.

## Progress and failure handling

- Save the current scene, completed activities, answers, hint use, and lesson-specific state in versioned local storage.
- Ignore corrupt or incompatible saved state and restart safely.
- Save completion through the existing module-run endpoint for signed-in students.
- A network save failure must not erase local completion. Offer an explicit retry.
- Teacher preview must never write student activity or completion data.
- Refreshing the page restores the last safe checkpoint, not an unfinished animation state.

## Visual and motion direction

- Use the current CyberSuraksha color tokens and bold outlined card language.
- Give each lesson a distinct setting, scene silhouette, accent pair, and icon family.
- Prefer CSS and inline SVG for diagrams and interactive objects. Do not require downloaded media.
- Animate feedback, state changes, and rare completion moments only.
- Use transform and opacity for motion, keep routine interactions under 300 ms, and provide reduced-motion alternatives.
- Maintain 44 px minimum touch targets, visible focus, logical tab order, and text alternatives for visual evidence.

## Testing strategy

### Definition and registry tests

- Assert exactly 18 unique lesson definitions.
- Assert exactly two lessons per band and bucket.
- Assert lower and upper lessons resolve for both grades in their bands.
- Assert every lesson has a stable module ID, slug, learning goal, transfer task, and three scored checks.
- Assert every lesson declares a unique primary mechanic within its band.

### Interaction tests

- Test each primary mechanic's correct, incorrect, hint, reset, and completion paths.
- Test that unsafe actions emit the intended event once.
- Test progress restoration and corrupt-state recovery.
- Test completion saving, retry, and teacher-preview suppression.

### Quality checks

- Run static tests, lint, and TypeScript or production build when the configured Node version permits it.
- Check keyboard-only operation, screen-reader labels, reduced motion, and narrow mobile layouts.
- Review lesson copy for band vocabulary and sentence length.
- Compare lesson structures to catch repeated opening, activity order, or completion treatment.

## Delivery checklist

- [x] Confirm the 18 age-appropriate lesson topics.
- [x] Define the no-repetition rule and unique primary mechanics.
- [x] Define shared infrastructure boundaries.
- [x] Write the implementation plan with file-level tasks and test gates.
- [x] Add curriculum strands and band-aware registry support.
- [x] Build shared progress, analytics, accessibility, and completion utilities.
- [x] Build and verify the six lower-band lessons.
- [x] Build and verify the six middle-band lessons.
- [x] Build and verify the six upper-band lessons.
- [x] Run cross-lesson repetition and content-quality review.
- [x] Run the full automated and manual verification set.

## Acceptance criteria

The work is accepted when all 18 lessons are discoverable in the correct class libraries, complete without video or audio, save progress, report completion, provide explanation-first feedback, work by keyboard and touch, adapt to reduced motion, and satisfy the non-repetition tests and review.

Existing CT and subject lessons must continue to work without route or progress regressions.

## Non-goals

- Rebuilding existing Computational Thinking modules.
- Adding live external web searches inside student lessons.
- Asking children to use a real UPI account, OTP, PIN, social account, or payment.
- Adding generative AI calls to lesson completion paths.
- Building parent, school-admin, or certification products beyond the existing reporting system.
