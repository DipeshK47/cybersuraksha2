# Class 10 Decision Lab implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Use dispatching-parallel-agents only for disjoint author/engine files with the contracts below fixed in advance. The controller owns Git, integration, generated media and final verification.

**Goal:** Deliver the approved 32-chapter Class 10 course with bilingual text, Indian English narration, meaningful animated explanations and verified practical/evidence workflows.

**Architecture:** Keep the shared assessment, LMS and story-player boundaries. Add optional media controls, explanation/practice slots and tested-snapshot reporting, plus prerequisite ordering. Class 10 owns its data-driven visual plans, original cast and explanation engine; media and registrations follow the proven Class 9 pipeline.

**Tech Stack:** TypeScript/React, existing Motion/CSS/SVG, vinext/Workers/D1, Node24; existing separate Python tool environment with edge-tts/ffmpeg for media.

## Global constraints

- Exactly32 original chapters,8each Cybersecurity/Artificial Intelligence/Computational Thinking/Cyber Fraud. English/Hindi text; six scenes with200–225total English caption words perchapter; one story decision and three practicals each;40-minute metadata.
- New original Aditi/Vihaan cast and Decision Lab world; approved en-IN-NeerjaNeural +0% narration. Real measured cues/hashes/local32MP3s; baseline media/Hindi values preserved.
- All192scenes have at least3 authored concept frames showing meaningful scene-specific change. Each chapter has a supplied-variant exploration. Replay/pause/step/reset, audio-authoritative following, reduced-motion/no-audio/manual access and mobile labels are required.
- Wrong checks state actual submitted work, incorrectness, specific reasons and next step in both languages. Incomplete controls unscored; current permission/route/model simulation required. Keep first-response grading, notebook/evidence/reflection/teacher reports.
- A valid prerequisite schedule passes even when it differs from a reference order. Exact-order tasks retain current behaviour. Weighted-route entry costs repeat; start free; valid alternatives pass.
- New current Grade10 playable/assignment/delivery IDs exactly32 cyber-class10-*; legacy history/marks preserved. Keep14Math and9English textbook chapters and allothergrades/school boundaries.
- Local fictional data only. No new production dependencies, live AI/code execution, payments, personal datasets, migrations or authentication changes. No automatic Class10 push/deploy.
- Work in the chosen existing repository folder on feat/class10-decision-lab, per persistent user preference. Existing dependencies/baseline are known; no dependency reinstall. Known full suite baseline208=204pass/4documented preexisting failures.
- Implementers edit only their assigned files, never Git/index/branch state. Controller records scope snapshots and commits reviewed work. Reports and briefs live in ignored .superpowers/sdd/.

## Contracts fixed before parallel work

Controller creates app/data/class10/types.ts and visual-types.ts as pure types, and tests/class-10-author-audit.mjs for focused data checks. Class10Chapter extends LessonChapter with:
```ts
visual: {
  layout: "flow"|"records"|"trace"|"grid"|"compare"|"timeline";
  nodes: {id:string;label:L;value?:L;x:number;y:number;shape?:"card"|"circle"|"box"}[];
  edges: {id:string;from:string;to:string;label?:L}[];
  scenes: [VisualScene,VisualScene,VisualScene,VisualScene,VisualScene,VisualScene];
  exploration: {title:L;prompt:L;variants:{id:string;label:L;scene:number;step:number}[]};
}
type VisualScene = {steps:[VisualStep,VisualStep,VisualStep] | [VisualStep,VisualStep,VisualStep,VisualStep]};
type VisualStep = {
  label:L; description:L;
  active:string[]; warning?:string[]; complete?:string[]; hidden?:string[];
  moves?:{id:string;x:number;y:number}[];
  values?:Record<string,L>;
  activeEdges?:string[];
};
```
Coordinates are percentages0–100; keep node centres within12–88x and15–85y. Use3–9 readable nodes and stable IDs. Every scene begins independently from its authored nodes; each step overrides that base, not the previous scene. Three steps have boundaries0,.45,.85; four use0,.3,.6,.85. Values/visibility/status apply to the current step; positions interpolate from the previous step/base. Each scene must have a real position change AND a supported semantic change, not a renamed generic success tick. Reuse node identities through a chapter; write distinct step descriptions/data in allsixscenes. Exploration has2–4 variants referencing authored scene/step states and does not advance the story gate.

Shared media adapter:
```ts
type StoryMediaClock = { readElapsed:()=>number; duration:number; pause:()=>void; resume:()=>void };
```
StoryWorldProps gains optional media. Factory option Explanation receives StoryWorldProps plus chapter:LessonChapter. StructuredLesson option PracticeVisual receives chapter,task,stage,answer,ready,simulation. TaskBoard optional onSimulationChange reports TaskSimulationSnapshot|null, where the discriminated union has kind route/model/permissions, a deep copied answer, fingerprint JSON.stringify(answer), and the actual matching evaluator result. Snapshot invalidates on edits/task/run boundary. Export these props/types from named shared modules for the Class10 engine.

OrderTask gains optional prerequisites:{before:string;after:string;reason:L}[]; the reference expected array remains an example permutation. Evaluate by exact membership/uniqueness and every edge, not position. Diagnose actual violated edges and missing/duplicate/unknown IDs with bilingual reasons. Do not change legacy exact-order semantics.

## Task 1: Shared media, visualization boundaries and dependency ordering

**Owner/files:** one implementer: app/data/lesson-content.ts; app/module/cyber/lessons/new/story/{types.ts,StoryPlayer.tsx}; class8/{Class8Stories.tsx,Class8Lesson.tsx,TaskBoard.tsx,task-evaluation.ts,task-feedback.ts}; new class8/task-simulation.ts and tests/class-10-shared.test.mjs. Root does not edit those files while assigned.

**Interfaces:** implement the contracts above. Export StructuredPracticeVisualProps from Class8Lesson and TaskSimulationSnapshot from task-simulation. The optional Explanation replaces only the story illustration, preserving the checked decision and feedback.

- [x] Write tests first using loadSource from tests/class-9-helpers.mjs. Concrete dependency fixture: items A=source,B=caption,C=preview,D=publish; expected[A,B,C,D]; edges A->C,B->C,C->D. Assert [B,A,C,D] correct, [C,A,B,D] wrong, [A,B,C,C] wrong, [A,B,C] incomplete; diagnosis names violatededge/missing/duplicate. Assert an identical task without prerequisites rejects [B,A,C,D].
- [x] Run Node24 focused test; record intended RED. Implement evaluator/diagnosis, then run GREEN including tests/class-8-{engine,evidence}.test.mjs and class-9-feedback.
- [x] Implement pure makeTaskSimulation(task,answer) returning null or cloned immutable tested snapshot from actual simulateRoute/testModel/testPermissions. Fingerprint consistency and clone independence tests must compare results against the actual functions, then mutate the original input to prove snapshot isolation.
- [x] Extend TaskBoard with a stable current snapshot, clearing the exported value on input/configuration changes and keyed remounts. Report via effect without a render loop; do not alter existing test/check labels or grading. Add practice visual slot and shared factory explanation slot.
- [x] Supply media clock/control adapter from StoryPlayer. readElapsed clamps actual currentTime-scene.start within measured duration and respects the gate; fallback to stored elapsed on unavailable audio. Capture exact time on pause. Memoize adapter per scene/narration so visual controls are not reset on each audio timeupdate. Preserve default worlds and existing audio fallback.
- [x] Run scoped tests and TypeScript. Self-review, write class10-shared-report.md with RED/GREEN commands/results and exact file list. No commits.

## Task 2: Class10 explanation engine, controls and original presentation

**Owner/files:** fresh engine implementer. New app/module/cyber/lessons/class10/{motion-state.ts,SceneExplanation.tsx,ConceptDiagram.tsx,PracticeTrace.tsx,Class10Characters.tsx,Class10Illustration.tsx,Class10Stories.tsx,Class10Lesson.tsx,ui.ts,class10.module.css}; tests/class-10-motion.test.mjs. No shared-file edits; coordinate interface gaps with controller.

**Consumes:** Class10Chapter visual types; StoryMediaClock; Explanation and PracticeVisual slots; TaskSimulationSnapshot; shared evaluator outputs. **Produces:** createClass10Story(chapter,script), Class10Lesson(props), named engine components and pure functions resolveVisualFrame(visual,scene,progress), manualFrame(visual,scene,step), visualSignature(frame).

- [x] RED: use a3node flow fixture with3steps, changing moves and counts. Test distinct start/middle/end positions/semantic signatures, deterministic seek backward, clamped scene/progress, full current-step overrides, unchanged source data,3/4step boundaries. Implement pure frame resolver before renderer.
- [x] Make responsive labelled diagrams from authored nodes/edges. Interpolate positions smoothly; show active paths, values and status from frame. Keep full bilingual labels/values readable in an adjacent HTML legend; SVG short IDs/numbers must not become illegible mobile text. Never infer correctness beyond the authored stage or an actual evaluated result.
- [x] Implement follow/replay/step modes. Follow uses actual media readElapsed, never a free-running story timer. Replay pauses narration; local replay has pause/resume/reset. Previous/Next step pause narration and select an exact frame. Narration resume exits local mode. Scene/attempt changes reset local controls. Cancel RAF on pause/hidden/unmount; return to authoritative media on visibility restoration. Reduced motion defaults to manual step, with complete accessible descriptions; audio errors retain controls.
- [x] Each chapter's exploration renders2–4 authored variant buttons and their referenced diagram state without changing story scene/gate or grading. Visible mode/step labels and persistent pause controls;44px targets/keyboard/focus.
- [x] PracticeTrace uses current draft for ordinary selections and actual reported snapshot for tested mechanics. Route trace follows actual path/cost; permission results and model predictions/abstentions come directly from snapshot. Label draft/outdated/tested states. Replay/single-step are present; never use expected answers as a draft success.
- [x] Create original Aditi/Vihaan SVGs with pointing/card placement/story moods, and wrappers using the shared slots. Preserve existing Class8/9 defaults. Do not change registries or media.
- [x] Run pure motion tests, TypeScript if registered data available; record dependencies if blocked. Write class10-motion-report.md with test evidence and browser control selectors. Controller performs real audio/browser verification after integration. No commits.

## Task 3: Eight original Cybersecurity chapters

Create app/data/class10/security.ts, export class10SecurityChapters. Report .superpowers/sdd/class10-security-report.md.

**Owner/files:** this task edits only its one subject file. Use app/data/class10/types.ts and visual-types.ts. Read the actual Class9 subject for teaching depth and the assigned approved outline below for exact topic/order. Do not copy its wording, data, story or illustrations. No shared, compiler, registration, media or Git edits.

**Source requirements:** export exactly8 Class10Chapter entries with stable class10-* slugs. Each has all LessonChapter bilingual fields,3topics/outcomes/rubric, six scenes with200–225total English caption words perchapter, decisionChoice and3tasks. Stories feature Aditi/Vihaan in the Decision Lab setting. Use conversational Hindi and identical digit literals in both languages; technicalcode labels may remain literal. Each wrong/missing selection/row, numericfield, gridcell and orderedstep needs a concrete reason in both languages. Dependency tasks explain edge reasons and accept alternatives. Give each route >=2valid solutions within stated budgets. Permission simulations must make their allowed/denied wording truthful.

**Visual requirements:** author chapter visual nodes/edges and six distinct3–4step scene plans, matching current story facts. Every scene changes meaningful positions and values/status/edges, not only heading colour. All referenced IDs exist; all numeric displayed facts reconcile with text.2–4chapter-specific exploration variants reference validscene/step. Reuse the stable chapter diagram where appropriate; no generic autogenerated six-step narrative. Node centres within12–88x,15–85y.

- [x] Use tests/class-10-author-audit.mjs before source exists to record RED, then write the eight fully authored chapters.
- [x] Audit actual exports with Node24: eight perstrand; wordcounts200–225; bilingual/numeric parity; all32decision/practice solutions pass actual evaluateTask; wrongAnswers diagnosis names actualwork and reasons; visualIDs valid and all6scene semantic/movement changes; bounds and valid explorations.
- [x] Manually reconcile every calculation, simulation result, narrative success, Hindi meaning and motion step. Address any mismatch, then rerun focused audit.
- [x] Write report with counts, wordcounts, mechanics, allsolution results, any current cross-task dependency and exact file scope. Self-review. Do not commit.

### Approved chapter outline for this task

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

## Task 4: Eight original Artificial Intelligence chapters

Create app/data/class10/ai.ts, export class10AiChapters. Report .superpowers/sdd/class10-ai-report.md.

**Owner/files:** this task edits only its one subject file. Use app/data/class10/types.ts and visual-types.ts. Read the actual Class9 subject for teaching depth and the assigned approved outline below for exact topic/order. Do not copy its wording, data, story or illustrations. No shared, compiler, registration, media or Git edits.

**Source requirements:** export exactly8 Class10Chapter entries with stable class10-* slugs. Each has all LessonChapter bilingual fields,3topics/outcomes/rubric, six scenes with200–225total English caption words perchapter, decisionChoice and3tasks. Stories feature Aditi/Vihaan in the Decision Lab setting. Use conversational Hindi and identical digit literals in both languages; technicalcode labels may remain literal. Each wrong/missing selection/row, numericfield, gridcell and orderedstep needs a concrete reason in both languages. Dependency tasks explain edge reasons and accept alternatives. Give each route >=2valid solutions within stated budgets. Permission simulations must make their allowed/denied wording truthful.

**Visual requirements:** author chapter visual nodes/edges and six distinct3–4step scene plans, matching current story facts. Every scene changes meaningful positions and values/status/edges, not only heading colour. All referenced IDs exist; all numeric displayed facts reconcile with text.2–4chapter-specific exploration variants reference validscene/step. Reuse the stable chapter diagram where appropriate; no generic autogenerated six-step narrative. Node centres within12–88x,15–85y.

- [x] Use tests/class-10-author-audit.mjs before source exists to record RED, then write the eight fully authored chapters.
- [x] Audit actual exports with Node24: eight perstrand; wordcounts200–225; bilingual/numeric parity; all32decision/practice solutions pass actual evaluateTask; wrongAnswers diagnosis names actualwork and reasons; visualIDs valid and all6scene semantic/movement changes; bounds and valid explorations.
- [x] Manually reconcile every calculation, simulation result, narrative success, Hindi meaning and motion step. Address any mismatch, then rerun focused audit.
- [x] Write report with counts, wordcounts, mechanics, allsolution results, any current cross-task dependency and exact file scope. Self-review. Do not commit.

### Approved chapter outline for this task

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

## Task 5: Eight original Computational Thinking chapters

Create app/data/class10/ct.ts, export class10CtChapters. Report .superpowers/sdd/class10-ct-report.md.

**Owner/files:** this task edits only its one subject file. Use app/data/class10/types.ts and visual-types.ts. Read the actual Class9 subject for teaching depth and the assigned approved outline below for exact topic/order. Do not copy its wording, data, story or illustrations. No shared, compiler, registration, media or Git edits.

**Source requirements:** export exactly8 Class10Chapter entries with stable class10-* slugs. Each has all LessonChapter bilingual fields,3topics/outcomes/rubric, six scenes with200–225total English caption words perchapter, decisionChoice and3tasks. Stories feature Aditi/Vihaan in the Decision Lab setting. Use conversational Hindi and identical digit literals in both languages; technicalcode labels may remain literal. Each wrong/missing selection/row, numericfield, gridcell and orderedstep needs a concrete reason in both languages. Dependency tasks explain edge reasons and accept alternatives. Give each route >=2valid solutions within stated budgets. Permission simulations must make their allowed/denied wording truthful.

**Visual requirements:** author chapter visual nodes/edges and six distinct3–4step scene plans, matching current story facts. Every scene changes meaningful positions and values/status/edges, not only heading colour. All referenced IDs exist; all numeric displayed facts reconcile with text.2–4chapter-specific exploration variants reference validscene/step. Reuse the stable chapter diagram where appropriate; no generic autogenerated six-step narrative. Node centres within12–88x,15–85y.

- [x] Use tests/class-10-author-audit.mjs before source exists to record RED, then write the eight fully authored chapters.
- [x] Audit actual exports with Node24: eight perstrand; wordcounts200–225; bilingual/numeric parity; all32decision/practice solutions pass actual evaluateTask; wrongAnswers diagnosis names actualwork and reasons; visualIDs valid and all6scene semantic/movement changes; bounds and valid explorations.
- [x] Manually reconcile every calculation, simulation result, narrative success, Hindi meaning and motion step. Address any mismatch, then rerun focused audit.
- [x] Write report with counts, wordcounts, mechanics, allsolution results, any current cross-task dependency and exact file scope. Self-review. Do not commit.

### Approved chapter outline for this task

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

## Task 6: Eight original Cyber Fraud chapters

Create app/data/class10/fraud.ts, export class10FraudChapters. Report .superpowers/sdd/class10-fraud-report.md.

**Owner/files:** this task edits only its one subject file. Use app/data/class10/types.ts and visual-types.ts. Read the actual Class9 subject for teaching depth and the assigned approved outline below for exact topic/order. Do not copy its wording, data, story or illustrations. No shared, compiler, registration, media or Git edits.

**Source requirements:** export exactly8 Class10Chapter entries with stable class10-* slugs. Each has all LessonChapter bilingual fields,3topics/outcomes/rubric, six scenes with200–225total English caption words perchapter, decisionChoice and3tasks. Stories feature Aditi/Vihaan in the Decision Lab setting. Use conversational Hindi and identical digit literals in both languages; technicalcode labels may remain literal. Each wrong/missing selection/row, numericfield, gridcell and orderedstep needs a concrete reason in both languages. Dependency tasks explain edge reasons and accept alternatives. Give each route >=2valid solutions within stated budgets. Permission simulations must make their allowed/denied wording truthful.

**Visual requirements:** author chapter visual nodes/edges and six distinct3–4step scene plans, matching current story facts. Every scene changes meaningful positions and values/status/edges, not only heading colour. All referenced IDs exist; all numeric displayed facts reconcile with text.2–4chapter-specific exploration variants reference validscene/step. Reuse the stable chapter diagram where appropriate; no generic autogenerated six-step narrative. Node centres within12–88x,15–85y.

- [x] Use tests/class-10-author-audit.mjs before source exists to record RED, then write the eight fully authored chapters.
- [x] Audit actual exports with Node24: eight perstrand; wordcounts200–225; bilingual/numeric parity; all32decision/practice solutions pass actual evaluateTask; wrongAnswers diagnosis names actualwork and reasons; visualIDs valid and all6scene semantic/movement changes; bounds and valid explorations.
- [x] Manually reconcile every calculation, simulation result, narrative success, Hindi meaning and motion step. Address any mismatch, then rerun focused audit.
- [x] Write report with counts, wordcounts, mechanics, allsolution results, any current cross-task dependency and exact file scope. Self-review. Do not commit.

### Approved chapter outline for this task

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

## Task 7: Registration, source audit, Hindi and narration

**Owner:** controller, shared integration sequentially after reviewed contracts; media/data builds can proceed per completed subject. **Files:** new app/data/class10/index.ts,class-10-missions.ts,class-10-curriculum.ts; app/data/{curriculum,cyber-lessons,module-registry}.ts; lesson-registry.tsx; scripts/{build-class10-assets.mjs,class10-voice.json,narrate-class10.py}; extract-language-catalogue.cjs; generatedClass10stories/audio/Hindi; tests/class-10-{curriculum,media}.test.mjs and grade-delivery regressions.

- [x] RED curriculum test realexports:32chapters/4strands; Grade10cyberlibraries/playable/assignment32newIDs; existing14Math/9English retained; all96assessmentIDsunique; othergradesunchanged. Create library and metadata; wire Class10wrappers and grade10current-prefix filtering while keeping historical lessonobjects.
- [x] Compile sources/assets/Hindi from authored L pairs; reuse collectMessages/canReuseNarration/digest/expandSpeech from existing class9-assets-lib instead of duplicate logic. Dedicated voice settings sameapprovedvoice/rate/format; wrappers call getClass10Chapter/createClass10Story.
- [x] Extend extractor for Class10 aliases/new slots/newcomposites while excluding technical motion-discriminants and coordinates from natural-language catalogues. Merge owned Hindi entries without overwriting baseline values; retain ownership on incremental subject builds.
- [x] Reuse narrator engine through explicit CLI grade/settings arguments or a small compatible shared module. Preserve existing Class9 command behaviour/hashes. No copied second full narrator implementation. Generate every Class10MP3 with actual PCM measuredcues and sourcehash. Verify decode, sourcecaptions andvoice/rate.
- [x] Update intentional grade10counts in prior course tests. Run actualsource allsolutions/alternatives/diagnosis and fullHindi coverage; root records checkresults. Do not alter unrelated failing baseline tests.

## Task 8: Authenticated animation/course QA and delivery

**Owner:** controller plus a fresh QA implementer if useful; final independent reviews. **Files:** tests/class-10-browser-qa.py, shared course_browser_qa.py opt-in grade10; tests/school-backend.test.mjs; docs/class-10-delivery.md and plan/spec/ledger.

- [x] Add Grade10 stored-legacy fixture preserving historical75% and15/20marks while currentold-module APIs denied, and school/othergrade restrictions. Verify retainedMath/Englishpages/access and all32assignmentIDs.
- [x] Extend real authenticated courseflow to Grade10 preservingGrade8/9cases. Complete32chapters/96tasks, allwrongstory/choiceoptions and representativeothermechanics ENHI, blankguards, tested-gates/editclears, keyboard, actualteacher-notebookevidence/reload/reflection, initial100marks thenwrongfirst66.6667/previous100/assignment91.67, restrictions/mobileHindi.
- [x] Add motionQA at every scene: read semantic signature and visible nodepositions at distinct realmediatimes; assert expected actualchange. Pauseandwaitfreezes; seekback reconstructs; replay/reset/manualsteps work; chapterchangesdon'tleak. Everychapterexploration changes its supplied state withoutgradednetworkevents. Check unavailableaudio, reducedmotionmanual, desktop/390px/landscape.
- [x] Compare testedroute/model/permissiondiagram data against actual evaluatoroutput. Exercise >=2validprerequisiteschedules andinvaliddependencyorder withspecificfeedback.
- [x] Run Node24 feature/Hindi/backend/typecheck/lint/build and fullsuite whenintegrationsettles, compare fourbaselinefailureidentities. Run Class8/9authenticatedregressions aftersharedchanges. Decode32audiofiles. Inspect ordinary/reducedmotion screenshots/shortrecordings.
- [x] Obtain independent subject/task reviews aftereachscope and wholebranch review on mostcapableavailablemodel; fiximportantfindings throughfreshfixagent/affectedchecks/re-review. Write actualresults/limitations/launch/media-maintenance in docs/class-10-delivery.md.
- [x] Finish reviewed localcommits, clean diffcheck and ledger. No additional approval needed for the approved implementation; noClass10push/deployunlessuserrequests.

## Execution and self-review

The user approved the entire design and animations via the async question. Execute continuously in this session. Independent authors share only fixed contracts and edit disjoint files; controller integrates and serializes Git. Task reports and review packages are files, not large chat payloads. Resolve flagged cross-task verification items at integration before completion.
