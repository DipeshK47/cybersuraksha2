# Class 10 Decision Lab: course and animation design

Status: approved by the user on 27 October 2026, including the complete course, cast, Indian English narration, explanatory animations and controls. Implementation is in progress.

Repository: `cybersuraksha2`. Working branch: `feat/class10-decision-lab`, starting at the delivered Class 8/9 commit `74034c0`, which is also on remote `main`.

## Scope and standard

Deliver 32 original Class 10 chapters: eight each in Cybersecurity, Artificial Intelligence, Computational Thinking and Cyber Fraud. Continue English/Hindi text, English narration using the approved Indian English voice `en-IN-NeerjaNeural` at `+0%`, and the existing 40-minute chapter format. Every chapter includes three topics/outcomes, six story scenes totalling 200–225 English caption words, an explained story decision, three practical activities, an evidence notebook, reflection, family action and teacher guidance/rubric.

Class 10 moves from testing a proposed answer to comparing alternatives, tracing consequences and defending a decision under stated constraints. Scenarios, dialogue, fictional records, numerical examples, questions and visual sequences will be newly authored. Familiar principles develop across grades; chapter text, task datasets and artwork are created for this edition.

The main improvement requested by the user is explanatory motion. Each of the 192 story scenes must show an authored progression related to its own concept or events. Moving records, changing permission paths, intermediate program state and a visible before/after comparison must explain something the caption describes. Each chapter also includes a learner-controlled exploration. Small character gestures support attention to the evidence.

The current Grade 10 configuration has four cyber subjects with two visible modules each, while the lesson catalogue allows 11 legacy entries. It also contains 14 NCERT Mathematics chapters and nine English chapters. Replace the cyber delivery with the new 32-chapter course and retain those textbook subjects, identities and routes. Preserve all other grades and historical attempts/assignment marks.

## Evidence from the current code

The Class 9 `Class9Illustration` receives only `theme`, `caption` and `resolved`. Its display chooses a toolkit, monitor or grid and changes some paths after success. It does not receive the active scene or narration clock. Its stylesheet supplies gentle character breathing, rather than an explanation of the current concept.

The shared `StoryPlayer` already passes `scene`, `playing`, `elapsed`, `solved` and `reduced` to a chapter's world. This is the right boundary for Class 10 explanations. Shared practical evaluators and evidence recording already represent real answers, model predictions, permission effects and weighted-route traces. New visualizations should use those results, rather than inventing a separate animation-only answer.

## Approach considered

1. **Recommended: authored vector explanations within the existing player.** Use the existing React/Motion stack and SVG, with chapter-specific frames and interactions. This supports readable Hindi labels, responsive diagrams, deterministic seeking, keyboard controls and reduced motion. It requires explicit storyboards and visual checks for all scenes.
2. **Short rendered videos or animated image clips.** These can carry detailed visual art, but introduce another media timeline, larger assets and separate versions for translated labels. They offer limited inspection of intermediate states.
3. **A separate game or physics engine.** This supports richer free-form worlds, but adds runtime weight and a second state system to maintain alongside assessment, audio and evidence.

Use the first approach. No new animation dependency, live AI service or browser Python interpreter is required.

## Cast, world and visual direction

The course is **Decision Lab**, led by **Aditi and Vihaan**. Neither name appears in the existing narrated chapter scripts checked for this design. Aditi enjoys data journalism and asks what a claim can establish. Vihaan enjoys coding and visual design, and sometimes trusts a smooth demonstration before checking its assumptions. Both revise their reasoning and take turns explaining.

They work on a teacher-supervised school science bulletin and a community learning exhibition. Recurring locations are a publication desk, a small weather-data station, an image/text studio, a resource map and an information counter. Supplied records are fictional. Learners do not collect real personal datasets, repair electrical equipment, operate accounts, make payments or investigate real people.

Create original SVG portraits and poses for this cast. Use a clean indigo, sky and warm-paper palette with amber for review and teal for supported results. Aditi carries a field notebook; Vihaan uses a small sketch tablet. Pointing, placing a card and tracing a route should correspond to the highlighted evidence. All meaningful information remains in labels, shapes and accessible text as well as colour.

## How explanations move

### Story mode

- Each scene has three or four authored explanatory frames plus transition paths. Its illustration changes with the scene. The six-scene sequences below specify the content; implementation supplies the exact bilingual labels and coordinates.
- Audio media time is authoritative during narration. A Class 10 opt-in animation clock produces smooth transforms, reconstructs the correct visual state after a seek and freezes when paused. It must not depend on an unsynchronised looping timer. The existing story gate remains authoritative.
- Frame timing uses the actual measured duration of that scene, with authored phase boundaries. Cards and arrows move to explain transitions; numbers and labels update from the same frame state. Animations must not state that an action succeeded before the scene or actual simulation supports it.
- Provide **Replay explanation**, **Pause explanation**, **Previous step**, **Next step** and **Reset** as appropriate. Replay pauses narration and runs a short, silent explanation of the current scene. Resuming narration returns the explanation to media time. A visible mode/step label makes this clear.
- Explanations stop at a meaningful final state. There are no endless decorative loops. Advancing a story scene does not require waiting for an animation.
- The story decision remains a real checked activity. A wrong answer stays at the decision, names the submitted choice, explains why it fails and permits revision. Optional exploration controls cannot bypass the gate or emit a graded answer.

### Practice mode

- A visual trace near the task depicts the current answer or last explicitly tested configuration. It labels which of those it shows.
- Permission links open or close from the actual permission evaluator. A route marker follows the actual visited cells and adds the actual entry costs. A model display uses its actual predictions and abstentions. Numeric and ordering tasks use authored, reproducible trace steps.
- Editing an answer clears stale correctness feedback and marks a prior simulation as out of date. The learner must test the edited permission, route or model configuration before checking it.
- Exploration remains separate from scoring: only **Check my evidence** submits a complete answer. Showing a worked explanation must not silently fill or submit the assessed controls.

### Motion accessibility and failure handling

- Honour `prefers-reduced-motion`. Its default is a step-by-step explanation with instant state changes and the same labels, values and controls. The learner can inspect every stage without motion.
- A persistent pause control is available during an explanation. Use keyboard-operable controls, visible focus and touch targets of at least 44 CSS pixels. Avoid flashing and communicate status with text as well as colour.
- Text-only descriptions identify the current step and explain the transition. Do not announce every animation frame through a live region; announce deliberate step changes and final results.
- Reserve diagram dimensions to prevent layout jumps. Test 390px portrait and phone landscape, plus desktop. Stop frame work on hidden tabs and unmount.
- If narration cannot load, captions and explanation controls remain usable. If a diagram lacks required authored data, render its labelled step list and record the defect in verification; do not replace it with a misleading success animation.

## Cybersecurity: eight chapters

### 1. The login is only the beginning

Topics: credentials versus sessions; device context; ending access through a verified route.

Practicals: classify supplied sign-in/session cards; order a lost-school-tablet response with teacher help; choose checks that address both sessions and recovery settings.

Six-scene motion: a sign-in creates a labelled session card; that card opens a second request without re-entering a password; an unexpected device appears on a separate lane; the learner compares responses; a verified session revocation closes only the stated lane; a checklist distinguishes remaining sessions and recovery checks.

Exploration: step through a fictional password change and session review; observe which actions the supplied service policy actually ends. Evidence: a response trace stating what is and is not established. Do not claim a password change universally ends sessions or that a session identifies its operator.

### 2. One file, several paths to access

Topics: direct permission; group membership; public-link access and effective access.

Practicals: configure and test a supplied sharing graph; count exposed fictional files after two changes; select the full set of changes needed to remove access through all stated paths.

Six-scene motion: a file connects to a named learner; a group adds another route; a public link introduces a third route; one removed edge leaves another path lit; the revised graph closes the unintended paths; a new request tests the remaining permitted route.

Exploration: toggle direct, group and link access and trace a request through the graph. Evidence: a tested access-path ledger. A blocked route does not imply that every other route is blocked.

### 3. The plugin becomes part of the project

Topics: software provenance; requested capability; update and removal decisions.

Practicals: match manifest permissions to concrete consequences; compare two supplied plugin versions and their capability changes; choose a bounded installation/review plan from a fictional approved-source record.

Six-scene motion: a visual-design plugin joins the bulletin workflow; its manifest expands to show requested capabilities; a new version adds an unrelated capability; the learner pauses the proposed update; a teacher compares source and requirements; a minimal approved configuration proceeds through the stated checks.

Exploration: reveal the effect of each permission on a fictional document. Evidence: a capability comparison. An attractive interface, familiar name or one scan result cannot establish that all behaviour is safe.

### 4. A valid input still needs permission

Topics: format checks; range checks; authorization for an action.

Practicals: classify supplied requests by validation and permission outcome; calculate accepted quantities from explicit limits; repair a decision table that treats valid formatting as permission to edit.

Six-scene motion: a request enters a format gate; a range gate rejects an excessive value; a well-formed request reaches the role gate; the learner separates these checks; an authorized request changes the fictional record; rejected requests leave the record unchanged.

Exploration: send supplied request cards through both gates and inspect the reason for rejection. Evidence: a request/result table. Keep all examples local and avoid live targets or exploit payloads.

### 5. Two harmless tables can reveal a person

Topics: linked information; small groups; privacy-aware public summaries.

Practicals: identify identifying combinations in invented tables; select a minimal public chart export; match each proposed change to the exposure it actually reduces.

Six-scene motion: two apparently anonymous tables appear separately; shared categories align; one tiny intersection singles out a fictional record; the learner chooses a revised publication; broader categories merge the small group; a second audience view checks what remains inferable.

Exploration: change the supplied grouping and inspect group counts. Evidence: an export review with stated limits. Removing names alone is not a guarantee of anonymity; no real pupil records are used.

### 6. Restore a version you can verify

Topics: synchronized copies; independent recovery points; restore testing.

Practicals: select a recovery point from an explicit version timeline; order a restore-and-compare rehearsal; calculate missing changes and identify the checks required before resuming work.

Six-scene motion: a bulletin changes through labelled versions; an unwanted edit propagates to a synchronized copy; an independent older copy remains; the learner compares recovery points; a restore enters a separate test area; verified records are compared with a stated manifest before the team resumes.

Exploration: step backward through the timeline and compare which records each version contains. Evidence: a restore record including lost work and verification. A copy's presence does not demonstrate successful recovery.

### 7. The clock on the borrowed tablet

Topics: timestamp offsets; observation versus interpretation; cautious incident timelines.

Practicals: convert supplied device times using a stated minute offset; order the normalized observations; distinguish supported conclusions from claims about an unknown person or intent.

Six-scene motion: two device clocks display different times; an event seems to occur in the wrong order; a documented clock offset aligns the cards; the learner separates observations from guesses; the team builds a labelled timeline; uncertain actor and cause fields remain visibly unresolved.

Exploration: toggle local and normalized time with the offset always displayed. Evidence: a reproducible timeline. Use integer minutes within a stated day; avoid hidden timezone or daylight-saving assumptions.

### 8. Rehearse the public bulletin release

Topics: release criteria; privacy and access; recovery and human approval.

Practicals: audit a supplied release pack; configure and test public-versus-editor access; decide go/revise using explicit privacy, recovery and source criteria.

Six-scene motion: separate document, chart and access cards enter a release board; tests reveal two different failures; a recovery point is checked; the learner chooses the next action; revised items pass the specific checks; publication opens only after the stated teacher approval.

Exploration: inspect each criterion and see the dependency that blocks release. Evidence: a release decision with unresolved items named. Keep successful visual checks separate from overall approval.

## Artificial Intelligence: eight chapters

### 1. Compare the idea with a simple baseline

Topics: purpose and target; simple rules versus learned models; comparable evidence.

Practicals: match proposed questions to data, vision or language tasks; calculate the errors of an explicit rule on a fixed fictional pack; select a fair comparison plan with the same cases and target.

Six-scene motion: a bulletin problem becomes a stated output; a simple rule classifies supplied cards; a model produces a different result; the learner identifies what must stay comparable; paired errors are counted on the same pack; the purpose and resource limits appear beside both results.

Exploration: compare a rule and supplied model predictions card by card. Evidence: a baseline comparison. Prediction quality on the pack is distinct from whether the proposed application is useful or appropriate.

### 2. The answer hiding inside an input

Topics: information available at prediction time; duplicate groups; separation of development and evaluation.

Practicals: select usable features from a timestamped data card; assign near-duplicate groups to consistent dataset partitions; order splitting, training, tuning, freezing and fresh evaluation.

Six-scene motion: records enter a model through feature columns; a post-outcome field reveals a shortcut; duplicate image cards cross an attempted split; the learner repairs the design; whole groups stay together and the shortcut disappears; a separate unopened evaluation pack remains reserved.

Exploration: reveal when each field becomes available and group related records. Evidence: a corrected split/feature plan. Visible tuning results are validation evidence; repeated inspection must not be presented as an untouched final test.

### 3. Four boxes explain the mistakes

Topics: a defined positive label; confusion-matrix counts; accuracy, precision, recall and F1.

Practicals: classify supplied prediction/checked-label pairs into four boxes; calculate exact percentages from a fixed nonzero-denominator matrix; compare two settings against a stated review capacity and missed-case limit.

Six-scene motion: twenty fictional reading cards enter a prediction lane; the total-correct counter initially conceals the error types; cards move into the four labelled boxes; the learner compares capacity and missed cases; numerator and denominator groups highlight for each metric; a precise pack-specific conclusion is recorded.

Exploration: step through a card's predicted and checked labels, then highlight the sets counted by each rate. Evidence: a confusion matrix and constrained comparison. Define positive explicitly; an undefined rate is shown as undefined, never silently as zero.

### 4. Move the threshold, change the workload

Topics: decision thresholds; false alarms and misses; human review capacity.

Practicals: count outcomes for supplied thresholds on a fixed validation pack; choose a setting only when it meets all stated constraints; select further checks needed before a bounded pilot.

Six-scene motion: scored fictional cards line up on an axis; a threshold divides the outputs; moving it changes both mistakes and workload; the learner inspects the trade-off; counters update from the same cards; a remaining capacity conflict sends the plan back for revision.

Exploration: inspect three discrete threshold positions with keyboard buttons or a labelled slider. Evidence: outcomes and workload for each position. These are supplied scores, not calibrated probabilities or a guarantee about future cases.

### 5. One unusual reading changes the headline

Topics: mean and median; range and unusual values; verifying before excluding data.

Practicals: order a small reading list; calculate its mean, median and range; choose a defensible summary and a source-check step when a reading is unusual.

Six-scene motion: readings form a dot plot; one distant point stretches the scale; mean and median markers separate; the learner checks the actual values; the same list appears with and without the questioned reading; the note retains the reason and uncertainty rather than quietly deleting data.

Exploration: compare both supplied scenarios with the changed value labelled. Evidence: calculations and a qualified headline. An outlier may be a genuine observation or a recording problem; unusual does not mean false.

### 6. Follow the moving image window

Topics: pixel values; local image operations; limits of a simple feature rule.

Practicals: encode a supplied grayscale value in eight-bit binary; calculate the outputs of an explicitly defined small window operation; identify cells satisfying a stated feature rule in the resulting grid.

Six-scene motion: an image separates into its pixel grid; the selected value becomes binary lamps; a small window crosses neighbouring cells; the learner predicts an intermediate result; outputs assemble into a new feature grid; a changed input shows why the toy rule is not full visual understanding.

Exploration: move the window one position at a time, with the arithmetic and boundary convention visible. Evidence: binary value, window calculations and selected feature cells. A handcrafted operation must not be described as a trained neural network.

### 7. Count the words, then check what disappeared

Topics: explicit tokenization; word-frequency vectors; lost order and meaning.

Practicals: match tokens to their counts under a stated normalization rule; calculate two short frequency vectors; choose what can and cannot be inferred when differently ordered sentences have the same counts.

Six-scene motion: short supplied sentences break into tokens; repeated words stack into counters; vectors align by a fixed vocabulary; the learner compares two matching count displays; reversing who acts on whom changes the sentence while counts stay fixed; human context restores the distinction the representation lost.

Exploration: swap two supplied sentence orders and inspect unchanged counts. Evidence: tokenization rule, vectors and a supported limitation. Include English and Hindi examples with explicitly authored tokens; never depend on undocumented language normalization.

### 8. Write a model card with a stop rule

Topics: intended use and limits; development evidence; monitoring and human fallback.

Practicals: train and run a visible toy classifier on supplied validation examples; calculate its required human-review workload from the actual outputs; assemble a bounded pilot/model card and choose a stop condition from a changed-input case.

Six-scene motion: a prototype connects to a narrow stated task; its training and validation cards remain visibly separate; a review queue grows from actual outputs; the learner compares the capacity and use limits; a changed-input case triggers the stated stop rule; the result is handed to a responsible human with unresolved evidence named.

Exploration: compare a normal supplied batch with a changed batch. Evidence: actual predictions, workload and a model card. A final independent evaluation uses fresh cases after tuning; a visible classroom exercise is not a deployment safety certificate.

## Computational Thinking: eight chapters

### 1. Describe the system with states

Topics: states and events; permitted transitions; terminal versus reversible actions.

Practicals: match publication events to allowed state changes; trace a supplied event sequence; identify an invalid transition and the correct recovery route under the stated rules.

Six-scene motion: a draft token appears on a state graph; a check moves it to reviewed; a failed approval returns it to revision; the learner predicts the next permitted event; a correct transition reaches approved; a publish event reaches the final state while unsupported shortcuts remain blocked.

Exploration: apply supplied events and see whether state changes. Evidence: an event/state trace. Invalid events leave the state unchanged and explain the missing precondition.

### 2. Trace the inside of a loop

Topics: nested iteration; intermediate values; counting a specified operation.

Practicals: calculate variable values in a short Python-style nested loop; identify visited grid positions; order a labelled trace including the inner-loop reset.

Six-scene motion: an outer-loop marker selects a row; an inner marker visits each column; a counter changes on the specified line; the learner predicts the next state; the inner marker resets for the next row; a final trace distinguishes visits from other operations.

Exploration: single-step the trace with a code line, variables and visited cell highlighted together. Evidence: intermediate values and the stated counting convention. Traces use supplied operations, not an unrestricted code editor.

### 3. A dictionary remembers the key

Topics: key/value lookup; updates versus new entries; missing-key handling.

Practicals: match supplied keys to lookup results; calculate values after a sequence of updates; choose correct behaviour for a missing key under an explicit default rule.

Six-scene motion: fictional exhibit codes attach to values; a lookup follows the exact key; an update replaces one value without creating a second entry; the learner handles a missing code; an explicitly permitted insertion creates a new entry; totals are recalculated from the final dictionary.

Exploration: replay lookup, update and insertion cards with the dictionary visible. Evidence: before/after mappings. State case-sensitivity and duplicate-key rules; never infer them from display order.

### 4. Sort one pass and keep the ties

Topics: adjacent comparisons; an explicit swap rule; stable ordering of equal keys.

Practicals: arrange the result of a fully specified sorting pass; count only the stated key comparisons; select tests that expose a tie-order or boundary error.

Six-scene motion: priority cards enter a row; a comparison window moves across adjacent pairs; a pair swaps only under the supplied rule; the learner predicts the next comparison; equally ranked cards retain their relative order; a final pass summary records the comparisons and swaps separately.

Exploration: advance one comparison at a time and reveal the comparison result before the next step. Evidence: the traced pass, tie identities and separate counts.

### 5. Two methods, one fair comparison

Topics: work as input grows; a defined operation; assumptions and practical limits.

Practicals: calculate operation counts from two explicit algorithms; choose a method under a stated budget and preconditions; match observations to claims they can actually support.

Six-scene motion: the same input enters two method lanes; counted operations accumulate in separate counters; the input size doubles; the learner predicts the new counts; two scale curves grow from the exact supplied rules; a decision includes both the count and the assumptions.

Exploration: compare a few discrete input sizes without changing the counting convention. Evidence: a reproducible comparison. Timing on one device is not proof of a general complexity claim.

### 6. Test the rule that must always hold

Topics: invariants; boundary cases; duplicate processing and rejected requests.

Practicals: calculate remaining and allocated fictional resources after supplied events; select counterexamples to a faulty rule; match edge cases to accept/reject results and the invariant checked.

Six-scene motion: a fixed resource total splits into allocated and remaining; valid events move units between counters; an over-capacity event tries to break the rule; the learner inspects a duplicate event; the revised process rejects it without a second change; the invariant remains visible through the replay.

Exploration: feed supplied valid, duplicate and excessive requests into a local simulation. Evidence: event results and the invariant after each event. Rejected requests must not change the resource total.

### 7. Work can be ready in more than one order

Topics: prerequisites; valid schedules; blocked work and parallel readiness.

Practicals: identify prerequisites in a supplied dependency graph; build any complete valid schedule; choose a justified repair when a task becomes unavailable.

Six-scene motion: tasks form a dependency graph; completed prerequisites light up more than one ready task; two valid schedules branch; the learner chooses a next step; their actual order progresses through the graph; a blocked dependency identifies exactly which later task must wait.

Exploration: select ready tasks and compare two valid schedules. Evidence: the actual order and dependency checks. A valid alternative must not be rejected because it differs from an authored reference order.

This chapter needs a narrow extension to the existing ordering mechanic: optional prerequisite constraints. Exact-order tasks retain current evaluation. Dependency tasks require each item exactly once and every prerequisite before its dependent item. Diagnosis names violated edges, duplicates and missing items. Test at least two distinct valid schedules and malformed/invalid schedules. No external scheduler is needed.

### 8. Reroute without breaking the rules

Topics: multiple required stops; resource budgets; retesting after a closure.

Practicals: calculate costs of supplied alternatives; build and test a route with two required stops and a stated cost/step budget; select regression checks after a closure or changed cell cost.

Six-scene motion: a resource map shows its start, goal and required stops; two routes accumulate different entry costs; a closure invalidates a formerly valid route; the learner proposes a revision; a marker follows the actual tested route and adds every entered cell; the final checklist checks all stops, the goal and both budgets.

Exploration: replay valid and failed routes, highlighting the first failed move. Evidence: actual path, repeated visits, stops and total cost. The initial cell is free; repeat entries cost again; multiple valid solutions pass.

## Cyber Fraud: eight chapters

### 1. The exam-centre update chain

Topics: claim provenance; edited forwards; independent confirmation and limited conclusions.

Practicals: classify supplied notice claims as confirmed, contradicted or unresolved; trace a verification route using the supplied school source record; choose a cautious response to a partial confirmation.

Six-scene motion: a fictional exam notice moves through forwarded copies; one copy gains an extra link and changed venue; the versions align beside the original source card; the learner chooses a verification route; a trusted school reply confirms only stated facts; unresolved claims retain their question marks.

Exploration: compare versions and reveal exactly which fields changed. Evidence: claim/source/status ledger. Use invented notices and no real board dates or login requests.

### 2. A familiar voice asks for secrecy

Topics: voice as a claim; pressure and isolation; independent communication routes.

Practicals: select independent verification steps; match pieces of supplied evidence to their limited meaning; arrange a supportive response to an urgent request without sending money or secrets.

Six-scene motion: a voice waveform accompanies a familiar claimed identity; a secrecy instruction closes other communication lanes; an independent known contact route appears; the learner chooses the response; a separate callback opens the verification lane; the team distinguishes a verified fact from an unproven voice explanation.

Exploration: compare caller-supplied and previously known contact routes. Evidence: an identity-check plan. Do not grade visual/audio artifact spotting as proof that a voice is genuine or synthetic.

### 3. The audition starts with an app

Topics: creator/competition offers; capability requests; verification before installation.

Practicals: match requested capabilities to concrete exposure; select evidence needed to check a fictional audition offer; choose a teacher-supported response after an unnecessary capability has been granted in the supplied case.

Six-scene motion: an appealing fictional audition card arrives; an installer requests unrelated capabilities; each capability opens a labelled exposure window; the learner pauses the process; the organiser is checked through a separately supplied known route; the recovery checklist addresses the specific granted capability.

Exploration: reveal what each permission would expose in the fictional device. Evidence: offer/capability review. No download links, installation or real profile information are used.

### 4. A payment screenshot is not the receipt

Topics: claimed payment; provider status; pending, completed and reversed transactions.

Practicals: match supplied transaction records to supported statements; calculate confirmed net credits from explicit statuses; choose a provider verification step before acting on an unconfirmed screenshot.

Six-scene motion: an impressive payment image arrives; a separate fictional provider ledger shows a different status; references are compared; the learner decides what is confirmed; pending and reversed rows move to their correct categories; the supported total is calculated from the stated completed entries.

Exploration: inspect image claim, reference and provider record side by side. Evidence: a reconciliation table. Do not promise a settlement time or infer final payment from a screenshot alone.

### 5. The basket changes while you decide

Topics: item price and final cost; preselected extras; consent and documentation.

Practicals: calculate totals from explicit fictional fees and quantities; identify changes requiring a deliberate decision; choose a useful response when the final checkout differs from the advertised offer.

Six-scene motion: an attractive item price appears; quantity and mandatory charges join the total; a preselected extra adds a separate cost; the learner inspects the choice; removing the extra updates the breakdown; a final comparison records the actual displayed terms.

Exploration: toggle the supplied optional extra and compare the final totals. Evidence: a price/consent record. State all values in the task; avoid claims about current tax rules or automatic legal conclusions.

### 6. The trading game's cash-out wall

Topics: simulated balances; staged social proof; withdrawal demands and independent evidence.

Practicals: calculate what a displayed balance does and does not establish; match claims to the evidence that would support them; select a response to a new payment demanded before a claimed withdrawal.

Six-scene motion: a fictional leaderboard balance rises; copied testimonials crowd the screen; a withdrawal button introduces a further-payment demand; the learner examines the evidence gap; the displayed balance separates from independently confirmed funds; the case moves to a trusted adult without another payment.

Exploration: trace the difference between a screen number and a confirmed transaction record. Evidence: a claim/evidence gap note. This is fraud-literacy education, with no live investment product, trading practice or recovery promise.

### 7. An official-looking call demands isolation

Topics: impersonated authority; threats and secrecy; safe independent help.

Practicals: separate the caller's claims from independently supported facts; build a response that leaves the coercive call and involves a trusted adult; select minimal relevant evidence for verified reporting channels.

Six-scene motion: an official-looking call overlays a fictional agency claim; a threat creates an urgency timer; isolation arrows try to close the support network; the learner chooses independent help; the timer disappears as the teacher opens a known route; relevant evidence is preserved without obeying the caller's instructions.

Exploration: inspect the claimed authority, requested action and independent channel separately. Evidence: a calm response plan. Follow the I4C digital-arrest advisory; never simulate graphic threats or require children to stay on a coercive call.

### 8. Help should not require another payment

Topics: recovery scams; prompt reporting; privacy and a useful factual handover.

Practicals: choose official/provider help from supplied route cards; assemble a minimal private handover from the fictional record; order the dependent response actions while allowing explicitly independent actions in either valid order.

Six-scene motion: an exposed fictional account creates two separate help needs; a recovery seller demands another fee; a known provider and trusted adult open independent help lanes; the learner selects the handover; relevant facts travel through the verified channel while private extras stay hidden; an acknowledgement is recorded without showing a guaranteed recovery.

Exploration: compare the required information for different help routes and remove unnecessary public details. Evidence: a private response/handover plan. Where Indian financial-fraud reporting is taught, verify current official 1930/portal guidance before delivery and explain that reporting does not guarantee recovery.

## Complete sample: Four boxes explain the mistakes

This sample has 211 English caption words across six scenes and establishes the bilingual tone and motion standard. The twenty reading cards are fictional; the activity does not assess real water safety. Positive means **needs human review**. The main supplied pack has TP=6, FP=2, FN=2, TN=10; accuracy=80%, precision=75%, recall=75% and F1=75%. A comparison setting has TP=8, FP=4, FN=0, TN=8: it catches every positive but requires 12 reviews. The stated purpose requires zero misses and at most ten reviews, so neither setting meets both conditions.

### Scene 1: What does a flag mean?

English: Aditi and Vihaan are preparing a classroom demonstration that flags fictional water readings for human review. The teacher supplies twenty labelled cards. A flag means inspect the reading, not announce that the water is unsafe.

Hindi: अदिति और विहान क्लास में एक डेमो तैयार कर रहे हैं। इसमें पानी की काल्पनिक रीडिंग को इंसानी जाँच के लिए फ़्लैग किया जाता है। टीचर बीस लेबल वाले कार्ड देती हैं। फ़्लैग का मतलब रीडिंग जाँचना है, पानी को असुरक्षित घोषित करना नहीं।

Animation: twenty numbered cards enter the tray; the positive-label legend opens; one card travels to the human-review desk. Step text names what the flag means.

### Scene 2: A neat headline

English: Their first chart shows sixteen correct predictions. Vihaan calls that eighty percent accuracy and wants to publish. Aditi asks where the four mistakes went. The same total can hide different kinds of error.

Hindi: पहले चार्ट में सोलह अनुमान सही हैं। विहान इसे अस्सी प्रतिशत एक्युरेसी बताता है और छापना चाहता है। अदिति पूछती है कि चार गलतियाँ कहाँ गईं। एक जैसा कुल स्कोर अलग तरह की गलतियाँ छिपा सकता है।

Animation: sixteen cards join the correct counter; four remain in an unclassified tray; the headline pauses until those cards are explained.

### Scene 3: Give each mistake a box

English: They sort the cards into four boxes. Six review readings were flagged, two ordinary readings were flagged, two review readings were missed, and ten ordinary readings were left alone. Every card belongs in exactly one box.

Hindi: वे कार्डों को चार खानों में रखते हैं। जाँच वाली छह रीडिंग फ़्लैग हुईं। दो सामान्य रीडिंग भी फ़्लैग हो गईं। जाँच वाली दो रीडिंग छूट गईं और दस सामान्य रीडिंग फ़्लैग नहीं हुईं। हर कार्ड ठीक एक खाने में जाता है।

Animation: predicted/checked labels light up in turn and route each card into TP, FP, FN or TN, with both full Hindi/English explanations available. Counts always sum to twenty.

### Scene 4: Two requirements together

English: Two settings now compete. One catches every review reading but asks the teacher to inspect twelve cards. The other asks for eight inspections and misses two review readings. Their stated capacity is ten inspections. Which setting meets both requirements?

Hindi: अब दो सेटिंग सामने हैं। पहली जाँच वाली हर रीडिंग पकड़ती है, लेकिन टीचर को बारह कार्ड देखने पड़ेंगे। दूसरी में आठ कार्ड देखने हैं, पर जाँच वाली दो रीडिंग छूटती हैं। तय क्षमता दस कार्ड की है। कौन-सी सेटिंग दोनों शर्तें पूरी करती है?

Animation: two review queues grow beside a capacity line at ten. Missed-case counters stay visible. The animation stops before the learner's decision.

Decision options:

- Choose the twelve-review setting because it catches every positive. Wrong: it exceeds the stated capacity of ten; detecting all positives satisfies only one requirement.
- Choose the eight-review setting because it fits the capacity. Wrong: it misses two positives; meeting the workload limit satisfies only one requirement.
- Record that neither meets both conditions and revise with the teacher. Correct: the conclusion uses both the zero-miss condition and the ten-review limit.

### Scene 5: Keep the conflict visible

English: Neither setting meets both requirements. The class records the conflict and revises the plan with the teacher. Changing a threshold trades one error pattern for another; a polished percentage cannot remove that trade-off.

Hindi: कोई भी सेटिंग दोनों शर्तें पूरी नहीं करती। क्लास इस टकराव को दर्ज करती है और टीचर के साथ प्लान बदलती है। थ्रेशोल्ड बदलने से गलतियों का ढंग बदलता है। एक अच्छा दिखता प्रतिशत इस समझौते को मिटा नहीं देता।

Animation: each setting receives a specific failed-criterion marker; the team moves the plan to revision. No general failure or success stamp conceals the reason.

### Scene 6: Build evidence you can explain

English: In the lab, move supplied cards, calculate the rates, and compare another fixed setting. Keep the positive label and denominators visible. These classroom results describe this pack; a new dataset still needs its own evaluation.

Hindi: लैब में दिए कार्ड रखें, दरें निकालें और एक दूसरी तय सेटिंग से तुलना करें। पॉज़िटिव लेबल और हर दर के लिए गिने गए कुल मामलों को साफ़ रखें। ये नतीजे इसी कार्ड-पैक के हैं। नए डेटा की अलग जाँच करनी होगी।

Animation: numerator and denominator groups highlight in the four-box display, then become entries in the evidence notebook. A separate closed pack represents future evaluation.

Practicals: classify four representative records; enter the four exact percentages for the main matrix; compare a fresh fixed pack under explicit review/miss limits. Every wrong percentage explains which counts belong in that denominator. A zero denominator in exploration displays “undefined” with a reason.

## Architecture and authoring boundaries

- Keep the common chapter/task contract and current assessment/evidence APIs. Give Class 10 its own authored data, presentation, original cast and six-scene visual metadata. Only Class 10 requires that metadata.
- Add an optional scene-explanation boundary to the common story factory, supplied by Class 10. Pass the actual world clock/state. Existing editions retain their current renderer defaults.
- The player supplies an opt-in media-clock/control adapter with scene elapsed time, measured scene duration, playing state and narration pause/resume actions. The Class 10 world owns silent-replay and manual-step state. Resuming narration exits those modes and reconstructs the display from media time.
- Add an optional practice-visualization boundary to the structured lesson. It receives the current task, draft answer, tested snapshot and actual simulation/evaluation output. Display whether the trace is a draft or a tested result.
- `TaskBoard` remains the owner of the current-test fingerprint. An optional read-only callback exposes its tested answer, fingerprint and actual result to the visualization host. Editing invalidates the tested display; a stage, chapter or attempt change clears it. Exploration does not call assessment readiness or story-completion actions.
- Share pure frame selection and trace-building functions. Keep the clock/control state in a small presentation layer, and keep grading in the task evaluator. Animation actions cannot fabricate scored activity.
- Extend ordering only with an explicit prerequisite mode, preserving exact-order behaviour for existing tasks. Validate authored dependency graphs; accept any complete valid schedule. Give dependency diagnosis its own reasons rather than comparing every slot to a reference order.
- Compile new scripts, wrappers, owned Hindi messages and measured local narration with hashes tied to speech/settings. Preserve all baseline Hindi values and Class 8/9 media. New visible labels must be authored in both languages; technical identifiers remain literal.
- Current Grade 10 delivery, playable access and assignment selection use exactly 32 new `cyber-class10-*` IDs. Keep legacy objects for stored history and any other allowed grades. Retain the Grade 10 Mathematics/English subjects and their route/access behaviour.
- Keep a dedicated Class 10 source branch in the chosen working folder. This design approval does not itself publish or push Class 10 work.

## Verification required before completion

1. **Actual content:** load the exports, not filenames. Assert 32 unique chapters, eight per subject; full bilingual fields; six scenes; 200–225 caption words; three tasks; valid references/numbers and per-option/per-step/per-field reasons. Check substantive progression against the authored Class 8/9 content and senior benchmarks.
2. **Exercises:** solve all 96 practicals and 32 decisions through the actual evaluators; exercise every wrong story/single-choice alternative and representative complete wrong cases for every other mechanic. Verify incomplete guards, current-test gating, alternative valid schedules/routes and first-response grading. Authored dependency graphs must have at least two accepted schedules where multiple orders are possible.
3. **Animations:** require six authored visual plans per chapter and at least one learner exploration per chapter. For all 192 scenes, compare semantic state and visible diagram state at distinct media times. Verify that meaningful objects/counts/paths change as prescribed; a CSS animation declaration alone is insufficient. Check pause/freeze, replay, reset, scene changes, seeking, tab visibility and no state leakage between chapters.
4. **Meaning:** assert every displayed model prediction, route path/cost and permission effect matches the real evaluator. Check each authored trace against its supplied algorithm/data. Confirm no success is shown for an unverified or failed action.
5. **Accessibility:** exercise keyboard operation, labelled controls, reduced-motion stepping, unavailable-audio fallback, 390px portrait/landscape and desktop, with no clipping or horizontal overflow. Verify text explains the same concept when motion is off.
6. **Persistence and reporting:** complete all 32 chapters as an authenticated Grade 10 learner; reload bilingual notebooks/reflections; verify actual teacher evidence and assignment marks. Confirm wrong-first/correct-retry history and prior attempts. Verify legacy Grade 10 stored marks, current old-module denial, cross-grade/school boundaries and retained Math/English delivery.
7. **Media and languages:** generate and decode all 32 Indian English MP3s; verify measured six-scene cues, speech/settings hashes, source/caption correspondence and Hindi coverage. Inspect pronunciation-sensitive names and acronyms before full generation.
8. **Regression and delivery:** run relevant content/language/backend tests, TypeScript, lint and production build. Compare the four known baseline Node failures by identity. Run Class 8/9 regressions for shared changes. Inspect ordinary-motion and reduced-motion recordings/screenshots; obtain independent subject and whole-change reviews; document actual results and maintenance commands.

## Sources informing this design

- [CBSE Artificial Intelligence 417, Class X, 2026–27](https://cbseacademic.nic.in/web_material/Curriculum27/Sec/417-AI-X.pdf): informs the level of model evaluation, statistical data, computer vision, text processing and Python-style reasoning. The new chapter stories and cases are original CyberShiksha material.
- [W3C: Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide): informs persistent motion controls.
- [NPCI Fraud Awareness](https://www.npci.org.in/fraud-awareness): informs payment/claim verification. Check current provider-specific facts before authoring a claim about an actual payment mechanism.
- [I4C digital-arrest advisory, 6 March 2025](https://cybercrime.gov.in/pdf/Advisories/ADVISORYTAU-ADV-003DigitalArrest06.03.2025.pdf) and [National Cyber Crime Reporting Portal advisories](https://cybercrime.gov.in/Webform/Advisory.aspx): inform the authority-impersonation case and verified reporting guidance.

## Approval boundary

The user has requested the full Class 10 course and explanatory animation. This proposal makes the specific new curriculum, cast, motion controls and prerequisite-scheduling extension reviewable. Approval of this design authorizes the implementation plan and all 32 chapters under these checks.
