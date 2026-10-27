# Class 8 Future Lab: course design for review

Status: approved on 26 October 2026. Implemented and verified locally on 27 October 2026; see [delivery notes](class-8-delivery.md).

## Agreed scope

- Replace the current Class 8 shared eight-mission course with 32 original chapters: eight each in Computational Thinking, Artificial Intelligence, Cybersecurity and Cyber Fraud.
- Deliver English and conversational Hindi in Devanagari through the existing language switcher.
- Match the depth, lesson format and approximate length of Classes 11 and 12 while teaching concepts suitable for Class 8.
- Keep historical learning records and existing lesson IDs intact. Legacy content must not reappear as extra chapters in the new Class 8 library or new assignment picker.
- Approved narration: English narration plus complete English/Hindi text, matching most senior chapters.

## What the existing implementation actually delivers

Inspected at commit `f7de523`:

- All 32 Class 11 and all 32 Class 12 metadata records specify `durationMinutes: 40`.
- Every senior chapter has six story scenes. Class 11 narration spans 79.7–97.0 seconds, with a median of 91.2 seconds. Class 12 spans 86.5–102.7 seconds, with a median of 93.0 seconds.
- Caption lengths are 181–221 words for Class 11 and 184–224 for Class 12. The short narration is only one part of the 40-minute lesson.
- The story introduces a problem, teaches a principle, pauses for an explained decision, shows its consequence and introduces the practice work.
- `PracticeShell` supplies three required challenges, first-response recording, explanatory feedback, retries, progress persistence and completion.
- The senior subject components contain working exercises, including numeric models, permission tests, ordering, data repair, evidence classification and design reviews. They also retain a learner evidence record.
- Hindi is applied to text and accessible labels while identifiers, submitted values and scoring remain unchanged. Only one senior chapter currently supplies dedicated Hindi narration; the others retain English audio.

Primary code inspected: `app/data/class-11-missions.ts`, `app/data/class-12-missions.ts`, `app/module/cyber/lessons/senior/`, `app/module/cyber/lessons/new/PracticeShell.tsx`, `app/module/cyber/lessons/new/story/`, and `app/lib/i18n/`.

## Teaching direction

Class 8 Future Lab uses familiar problems from a school magazine, garden, robotics activity, library, gaming group, shared computer and family shopping conversation. Each subject has a progression that ends in a project where the learner combines earlier skills.

Three possible structures were considered:

1. **Future Lab, recommended:** separate but connected school/community cases. It permits varied mechanics and subjects while retaining a recognisable setting.
2. **One year-long school exhibition:** all 32 chapters contribute to one event. It gives strong continuity but makes many scenarios depend on the same context.
3. **Four independent subject journeys:** each subject has its own cast and project. It permits more varied worlds but adds orientation at each subject boundary.

The recommendation is the first structure. Reuse the existing delivery controls and learner-record integration, with original Class 8 cases, scripts, evidence, visuals and activities. The student should practise a capability that transfers beyond the exact story.

## Chapter standard

Each chapter will have:

1. Three named teaching topics and explicit learning outcomes.
2. A six-scene story of approximately 190–225 English words. Narration timing must come from the generated audio, never fabricated durations.
3. One story decision with explained alternatives and a visible result.
4. Three required practice challenges: guided application, independent application and a changed situation.
5. An evidence product such as a test trace, corrected dataset, access plan or incident-response record.
6. Feedback explaining the misconception and how to test a better answer. Wrong attempts remain visible in the existing learning record.
7. A short reflection and a safe take-home activity that never requests real passwords, private messages, personal datasets or real payments.
8. A teacher discussion prompt and evidence-based rubric. Automatic activity scores keep their existing practice-estimate status; free explanations are reviewed by a teacher.

The 40-minute lesson is a planning target, not a compulsory countdown: about 6 minutes for introduction and story, 21 for practical challenges, 8 for explanation/discussion and 5 for reflection. Learners can pause, replay and resume.

Difficulty rises within each subject. Early chapters supply examples and smaller choice sets; later chapters introduce conflicting evidence, additional constraints or changed requirements. Use familiar words before introducing a technical term. No prior programming language, paid AI account or real banking account is required.

## Computational Thinking: eight chapters

### 1. Break the mission into pieces

- Topics: inputs and goals; decomposition; constraints and dependencies.
- Case: prepare a classroom discovery trail using a map, limited materials and an access requirement.
- Practice: separate goals from supplied facts; connect tasks in a dependency board; revise the plan when a room becomes unavailable.
- Evidence: a task map with a testable success condition and one justified dependency.

### 2. The pattern has a reason

- Topics: growing patterns; squares, cubes and repeated multiplication; checking a proposed rule.
- Case: build modular displays with tile and cube patterns for a science corner.
- Practice: construct the next shape; connect a count to its construction rule; reject a rule that fits early examples but fails a supplied later case.
- Evidence: a pattern rule supported by a construction and a counterexample check.

### 3. Messages made of ones and zeros

- Topics: place value; binary representation; encoding versus secrecy.
- Case: send status messages through eight simulated signal lamps.
- Practice: set lamps to encode a number; decode a different message; find and correct a transmission mismatch using a supplied reference.
- Evidence: an encode/decode trace. The lesson explicitly explains that binary encoding alone is not encryption.

### 4. Design a fair play space

- Topics: grids and coordinates; area and shape constraints; spatial transformations.
- Case: arrange activity zones so all teams can reach a play space without blocking a marked route.
- Practice: place shapes within a grid; rotate or reflect a design while preserving its required properties; adapt to a changed boundary.
- Evidence: a checked layout and the constraints it satisfies. Keep all tasks solvable by keyboard and buttons.

### 5. Make the rules run

- Topics: sequence and branching; AND/OR conditions; boundary cases.
- Case: route fictional library returns to the correct shelf or review tray.
- Practice: build a flowchart; run record cards through its branches; repair a rule when an exact-boundary or missing-value case fails.
- Evidence: a trace showing input, selected branch and expected output.

### 6. Repeat without repeating mistakes

- Topics: counted repetition; changing state; stopping and empty cases.
- Case: program a simulated garden helper to water marked planter rows.
- Practice: replace repeated instructions with a loop; step through changes; repair a misplaced update or wrong stopping condition.
- Evidence: a trace for a normal row, one planter and no planters. No real device control.

### 7. Share more, waste less

- Topics: proportional reasoning; unit rates; whole-item allocation and leftovers.
- Case: distribute reusable project supplies between groups using a stated allocation rule.
- Practice: scale a recipe/material pack; compare plans against a fixed budget; handle indivisible leftovers with an explicit agreed rule.
- Evidence: a distribution ledger that checks totals and explains a rounding choice. Distinguish the given allocation rule from a universal claim of fairness.

### 8. The rescue robot challenge

- Topics: combining algorithms; test cases; debugging and revision.
- Case: guide an on-screen robot through a model flood-relief supply grid.
- Practice: construct a route under constraints; test normal and blocked routes; revise after a new obstacle without breaking earlier successful cases.
- Evidence: a small test report with expected/observed outcomes and a justified revision. This is a simulation, not real emergency-response advice.

## Artificial Intelligence: eight chapters

### 1. Smart, automatic, or both?

- Topics: fixed instructions; learned patterns; limits of inference from appearance.
- Case: compare a timer, a sensor-controlled lamp and a prepared image-classifier demonstration.
- Practice: inspect how outputs are produced; match evidence to a mechanism; request missing evidence instead of guessing that a device uses AI.
- Evidence: a mechanism comparison with one honest uncertainty.

### 2. Start with a useful question

- Topics: defining a problem; the AI project cycle; success and human oversight.
- Case: decide whether a school garden needs a simple watering schedule or a more complex prediction tool.
- Practice: choose a measurable goal; arrange project steps; compare the proposed tool with a simple non-AI approach.
- Evidence: a project brief defining a goal, test and responsible person.

### 3. Build a dataset you can trust

- Topics: features and labels; missing and duplicate records; useful and unnecessary data.
- Case: prepare synthetic observations of recyclable classroom materials.
- Practice: organise records; quarantine missing or conflicting entries; choose only features relevant to the task.
- Evidence: a cleaned fictional dataset and repair log. Never infer an unknown label simply to complete a row.

### 4. Teach the sorter, then test it

- Topics: learning from examples; training versus testing; mistakes and improvement.
- Case: operate a clearly labelled toy classifier for reusable material cards.
- Practice: supply labelled examples; predict unseen cards with a visible rule; improve coverage and retest with a fresh set.
- Evidence: test counts and a reasoned improvement. Explain what the toy model demonstrates and what it cannot establish about real AI.

### 5. When a picture confuses a machine

- Topics: computer vision; useful versus misleading features; changes in lighting, background and viewpoint.
- Case: sort illustrated garden objects using a prepared feature-based model.
- Practice: reveal relevant features; test a background shortcut; compare the same object across changed conditions.
- Evidence: a failure analysis and an improved test pack. Use drawings and synthetic images, with no face collection.

### 6. When a chatbot sounds certain

- Topics: language-based generation; checking claims and sources; privacy and honest attribution.
- Case: review a fictional assistant's explanation for the class science magazine.
- Practice: separate claims from supporting sources; correct an unsupported statement; prepare a safe, specific request without personal details.
- Evidence: a claim-check record and a revised answer. The simulated assistant never makes a live provider call.

### 7. Who did the data leave out?

- Topics: representation; errors across groups; fairness and participation.
- Case: a prepared recycling classifier works poorly on materials from one classroom's project kit.
- Practice: inspect missing examples; compare error counts using the correct group totals; design a better collection and review plan.
- Evidence: a coverage checklist and qualified conclusion. Small classroom samples do not prove universal fairness.

### 8. The helpful AI design fair

- Topics: combining the project cycle; evaluating benefit and risk; human review and redesign.
- Case: choose a useful low-stakes tool for a school club and defend the choice.
- Practice: select an AI or non-AI approach; test it against agreed criteria; revise or stop the proposal when new evidence changes the decision.
- Evidence: a project card with purpose, data, comparison, limitations and an accountable reviewer.

## Cybersecurity: eight chapters

### 1. What does your digital trail reveal?

- Topics: direct and indirect personal information; audience and consent; reducing unnecessary disclosure.
- Case: a photo for the class magazine reveals a noticeboard, names and a meeting location.
- Practice: inspect and redact a simulated image; choose an appropriate audience; handle a new roster screenshot with a different purpose.
- Evidence: a safe publishing plan with a reason for every field kept or removed.

### 2. Keep control of your account

- Topics: unique passphrases; additional sign-in protection; recovery and trusted help.
- Case: protect a fictional school-club account after a reused password is exposed elsewhere.
- Practice: compare fictional protection plans; simulate a second sign-in check; prepare recovery without revealing or collecting real secrets.
- Evidence: an account-protection card that distinguishes sign-in and recovery.

### 3. Give an app just enough access

- Topics: permissions; purpose and least privilege; changing or revoking access.
- Case: a fictional homework scanner requests contacts, camera, photos and location.
- Practice: grant only task-relevant permissions; observe a simulated consequence; revise the plan when the task ends.
- Evidence: a permission-purpose ledger. A permission request alone does not prove malware.

### 4. Check the link before the click

- Topics: hostnames; misleading page appearance; connection security versus trustworthy ownership.
- Case: two lookalike notices offer the same school-project template.
- Practice: identify the actual hostname; choose a known independent route; explain why a padlock or school logo is insufficient evidence.
- Evidence: a verification record. All URLs use fictional non-operational examples.

### 5. A download is a decision

- Topics: source and purpose; trusted updates; risky installers and misleading prompts.
- Case: a project animation pack asks the learner to disable protections and install an unrelated extension.
- Practice: inspect a supplied download card; choose a safer source or alternative; handle a trusted update through its known application route.
- Evidence: a download decision with evidence and a safer next action. Nothing malicious is downloaded or executed.

### 6. Leave a shared device safely

- Topics: locked screens; sessions versus browser tabs; saved credentials and shared files.
- Case: a student finishes work on a shared library computer before another class arrives.
- Practice: find remaining exposure; execute a safe end-of-session sequence; test the result as the next fictional user.
- Evidence: a shared-device handover checklist. Explain that closing a tab may not sign out.

### 7. The backup that really comes back

- Topics: copies and versions; synchronisation versus backup; restoration and verification.
- Case: a group's comic project is accidentally replaced with an empty file.
- Practice: compare supplied recovery options; restore a fictional copy; verify its content and explain what a successful restore proves.
- Evidence: a recovery record with checks. All files are simulated.

### 8. The class magazine safety review

- Topics: combining privacy and access decisions; checking a publication; responding to an accidental disclosure.
- Case: prepare a school magazine issue for a stated audience with a limited set of safeguards.
- Practice: repair a publication pack; test permissions as different readers; revise the response after learning that an earlier copy was shared.
- Evidence: a tested publishing plan and a teacher-escalation note. Removing access cannot guarantee that existing copies disappear.

## Cyber Fraud: eight chapters

### 1. The prize with a hidden price

- Topics: tempting offers; pressure and secrecy; independent verification.
- Case: an in-game reward asks for a school login and a small unlocking fee.
- Practice: identify the request hidden behind the reward; choose a known verification route; respond to a changed offer that uses a different pressure tactic.
- Evidence: an offer-check card explaining the unsafe requested action.

### 2. The urgent message from a friend

- Topics: account impersonation; urgency; checking through another known channel.
- Case: a familiar profile urgently requests a project file or voucher.
- Practice: distinguish identity claims from evidence; build an independent checking plan; decide what to do when the friend denies sending it.
- Evidence: a verification and reporting plan without accusing an identified person.

### 3. Keep the code to yourself

- Topics: OTP versus account password versus payment PIN; purpose of a code; safe sign-in and recovery routes.
- Case: a pretend support caller asks a child to read out a login code.
- Practice: match codes to their stated purpose; reject sharing with a caller; continue a legitimate self-initiated sign-in on its verified page.
- Evidence: a code-handling decision. Teach why entering a code on a verified page you intentionally opened differs from sending it to another person.

### 4. Read what the payment actually does

- Topics: paying versus receiving; QR requests and screen instructions; adult involvement.
- Case: a fictional buyer asks a family member to scan a code and enter a UPI PIN to receive a refund.
- Practice: trace the displayed direction of money; cancel a misleading request; explain a safe next step to the responsible adult.
- Evidence: a payment-direction explanation. No real QR codes, accounts, PIN collection or transactions.

### 5. When help asks for screen control

- Topics: fake technical support; screen sharing and remote access; contacting known support.
- Case: a pop-up claims a class tablet is infected and offers help through an unknown caller.
- Practice: identify what the caller would gain; refuse access and exit safely; find an independent support route with a teacher or guardian.
- Evidence: a safe support sequence. Never teach a child to investigate an unknown operator.

### 6. Can you trust the seller?

- Topics: advertisements versus evidence; reviews and imitation pages; checking the transaction terms.
- Case: compare two fictional offers for a school-project kit.
- Practice: inspect seller and return information; spot unsupported review claims; explain why unusually low prices or review counts alone do not prove legitimacy or fraud.
- Evidence: a reasoned comparison and a question for the supervising adult.

### 7. A familiar face is not proof

- Topics: edited and generated media; limits of visual detection; verifying a consequential request.
- Case: a convincing voice message appears to come from a known club organiser.
- Practice: separate media appearance from proof of identity; verify through a known channel; update the response when the real organiser confirms a different message.
- Evidence: a verification plan. Avoid unreliable rules such as assuming every deepfake has visible glitches.

### 8. The calm response room

- Topics: responding without blame; preserving relevant evidence; trusted reporting and account protection.
- Case: a fictional learner has already shared a code and is worried about punishment.
- Practice: prioritise getting help and limiting further harm; build a concise factual incident note; choose appropriate official/help routes with the responsible adult.
- Evidence: an incident timeline, safe next actions and supportive language. Do not promise money recovery or blame the child.

## Worked example: What does your digital trail reveal?

This is a specimen of the writing standard. Final scene timing, art and decision controls will be produced during implementation.

### Scene 1: The magazine team

English: Meera and Kabir photograph seedlings for their school garden magazine. The picture also shows full names on a noticeboard and where the club meets after school. Public readers need the garden story, but not those details.

Hindi: मीरा और कबीर अपने स्कूल के बगीचे की मैगज़ीन के लिए पौधों की फ़ोटो लेते हैं। फ़ोटो में नोटिसबोर्ड पर लिखे पूरे नाम और स्कूल के बाद क्लब कहाँ मिलता है, यह जानकारी भी दिख रही है। पब्लिक रीडर को बगीचे की कहानी जाननी है, लेकिन इन जानकारियों की ज़रूरत नहीं है।

### Scene 2: Who can see it?

English: The draft is shared with the class; the finished magazine will have a public link. Kabir assumes the same photo permission covers both. Meera notices the audience has changed. The pictured children have not agreed to public sharing.

Hindi: ड्राफ़्ट वाला फ़ोल्डर क्लास के साथ शेयर किया गया है। तैयार मैगज़ीन का लिंक पब्लिक होगा। कबीर को लगता है कि क्लास में फ़ोटो शेयर करने की अनुमति दोनों जगह काम आएगी। मीरा ध्यान देती है: देखने वाले बदल गए हैं, और फ़ोटो में दिख रहे बच्चों ने पब्लिक शेयरिंग के लिए हाँ नहीं कही है।

### Scene 3: Keep the purpose in view

English: The story needs seedlings and care instructions, not names or a meeting location. Prepare a different picture, remove identifying details and check permission with the people pictured and the responsible teacher before publishing.

Hindi: लेख में पौधे और उनकी देखभाल के निर्देश दिखाने हैं। पूरे नाम या मिलने की जगह दिखाने की ज़रूरत नहीं है। टीम दूसरी तस्वीर तैयार कर सकती है, पहचान बताने वाली जानकारी हटा सकती है और पब्लिश करने से पहले फ़ोटो में दिख रहे लोगों और ज़िम्मेदार टीचर से अनुमति चेक कर सकती है।

### Scene 4: Your publishing decision

English: Choose the team's next step: publish the original, assume the class folder makes it safe, or prepare a suitable version and check permission. Test the plan by inspecting what a public reader can see.

Hindi: टीम का अगला कदम तय करने में मदद करें। क्या ओरिजिनल फ़ोटो पब्लिश कर दें, मान लें कि क्लास के फ़ोल्डर में होने से वह सुरक्षित है, या सही संस्करण तैयार करके अनुमति चेक करें? एक प्लान चुनें, फिर देखें कि पब्लिक रीडर को क्या-क्या दिखाई देगा।

### Scene 5: A better version

English: The new image explains the garden without showing children or the noticeboard. The teacher checks its public preview. This reduces unnecessary sharing. Editing a new version cannot remove copies of an old one already shared.

Hindi: नई तस्वीर में नोटिसबोर्ड या बच्चे दिखाए बिना बगीचे की बात समझ आ रही है। टीचर पब्लिक प्रीव्यू चेक करते हैं। इससे गैरज़रूरी जानकारी शेयर होने का खतरा कम होता है। लेकिन टीम यह दावा नहीं करती कि नई तस्वीर एडिट करने से पहले शेयर की गई पुरानी तस्वीर की कॉपियाँ भी हट गई हैं।

### Scene 6: Try a different case

English: Now inspect a sports-club screenshot. It includes contact details the teacher needs but the magazine does not. In the lab, prepare a safe image, test two sharing audiences and explain what should stay private.

Hindi: अब एक अलग स्क्रीनशॉट देखें: स्पोर्ट्स क्लब की लिस्ट में कॉन्टैक्ट की जानकारी है। यह टीचर के काम आती है, लेकिन मैगज़ीन में इसकी ज़रूरत नहीं है। लैब में सुरक्षित तस्वीर तैयार करें, दो अलग ऑडियंस के लिए शेयरिंग टेस्ट करें और बताएँ कि इस नए मामले में कौन-सी जानकारी प्राइवेट रहनी चाहिए।

### Three practical challenges

1. **Inspection and redaction:** select exposed details on an illustrated noticeboard. The public preview updates as the learner hides or replaces details. Validation checks relevant information and whether the article remains useful.
2. **Audience test:** configure a draft for named collaborators and a separate approved public version. Test both as a classmate and as a public reader. A named role alone is insufficient unless the test demonstrates the right access.
3. **Changed situation:** prepare a sports-club table for a stated magazine purpose. Retain required summary information, remove contact details and select an explanation of the audience/purpose decision.

The evidence record stores the decisions and checks, without storing real photos or contact information. A learner-written explanation can be saved as reflection, but completion must not pretend that a simple keyword match grades the quality of that explanation.

## Implementation boundaries

- Add dedicated Class 8 metadata, subject curricula, stories and activity content. Use unique grade-prefixed IDs/slugs to prevent collisions with shared lower/middle missions and senior chapters.
- Keep Class 5, Class 6, Class 7, Class 9, Class 10, Class 11 and Class 12 delivery unchanged.
- Retain legacy lesson definitions and routes for other grades that still use them. Existing Class 8 attempts and assignment records remain readable in historical reports, while current Class 8 content access and new assignments use the replacement course. An old URL or assignment must not bypass current content permissions. Verify this boundary with stored-history fixtures.
- Reuse authentication, content policy, activity ingestion, module-run saving, assignment and reporting behavior.
- Extend scene and practice artwork using original code-native illustrations and simulations appropriate to each case. Buttons, ordering controls and keyboard alternatives must accompany any spatial interaction.
- Audio is a production deliverable. The current narration script depends on machine-specific Kokoro model files and ffmpeg, which are absent from this checkout's environment. Prepare the required tools/model in a disposable tool environment, produce the audio, measure cues, and verify playable local assets. Do not claim full delivery from placeholder audio or guessed timings.
- Translate story captions, speech bubbles, headings, controls, feedback, evidence text, teacher guidance and accessible labels. Review complete sentences rather than relying on literal terminology substitutions. Code symbols, supplied fictional IDs, URLs and scoring values retain their identities.

## Completion checks

- Exactly 32 new Class 8 chapters, eight per subject, in the agreed order; exactly three required assessment IDs per chapter.
- Six complete story scenes per chapter, a functioning decision gate, real local audio and measured cue timing.
- Every chapter's three tasks can be completed with correct answers; wrong, incomplete and extra unsafe answers receive useful feedback and cannot pass accidentally.
- Changed-situation tasks require applying the concept, rather than repeating the first answer with renamed people.
- Mathematical helpers are tested with normal, boundary and empty cases where relevant. Toy AI examples are deterministic and explicitly described as simulations.
- English/Hindi coverage includes dynamic feedback and accessible labels. Language changes preserve answers, progress and evidence. Numbers, placeholders and original option values are preserved.
- Desktop and phone walkthroughs cover the full course registry and exercise each mechanic. Representative chapters are completed through authenticated student sessions and appear correctly in teacher activity, assignments and marks reports.
- Typecheck, lint, targeted content/runtime tests, backend isolation checks and build pass. Record the four known unrelated full-suite failures separately rather than claiming a completely green suite.

## Reference basis

These sources guide age suitability and factual checks. This original course is not presented as an official CBSE textbook or a certified full replacement for the CBSE timetable.

- CBSE CT & AI resource portal: https://cbseacademic.nic.in/ct-ai.html
- CBSE Class 8 student handbook (2026–27): https://cbseacademic.nic.in/web_material/CurriculumMain27/CTAI_Pri8SH_2026-27.pdf
- CERT-In awareness booklets and Cyber Smart Classroom resources: https://www.cert-in.org.in/AwarenessBooklets.jsp
- CIET-NCERT cyber-safety resources: https://www.ciet.ncert.gov.in/cyber-safety-security
- NPCI fraud awareness: https://www.npci.org.in/fraud-awareness

Check the relevant primary guidance again during authoring for any current reporting routes or payment-specific safety statements. Do not embed unverified phone numbers, legal promises or recovery guarantees.
