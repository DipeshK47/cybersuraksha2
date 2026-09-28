export const meta = {
  name: 'cybersuraksha-story-chapters-lean',
  description: 'Build 23 narrated story chapters in the approved Rohan format, max 2 agents at a time (1 caster + 1 self-reviewing builder per chapter)',
  phases: [
    { title: 'Cast', detail: 'find CC BY Rive characters for Class 5 / 6–7 heroes and Nani' },
    { title: 'Build', detail: 'one self-reviewing agent per chapter, two at a time' },
  ],
}

const ROOT = '/Users/dipeshkumar/Downloads/CyberSuraksha-claude/cybersuraksha'
const BRIEF = `${ROOT}/docs/story-chapters-brief.md`
const NODE = '/Users/dipeshkumar/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node'

const CAST_SCHEMA = {
  type: 'object',
  properties: {
    characters: { type: 'array', items: { type: 'object', properties: {
      role: { type: 'string', enum: ['middle-girl', 'upper-girl', 'upper-boy', 'nani'] },
      asset: { type: 'string', description: 'key added to characters.ts, or "" if none found' },
      moods: { type: 'array', items: { type: 'string' } },
      description: { type: 'string' }, source: { type: 'string' },
    }, required: ['role', 'asset', 'moods', 'description', 'source'] } },
    rohanStillPasses: { type: 'boolean' }, notes: { type: 'string' },
  },
  required: ['characters', 'rohanStillPasses', 'notes'],
}
const BUILD_SCHEMA = {
  type: 'object',
  properties: {
    slug: { type: 'string' },
    hero: { type: 'object', properties: { name: { type: 'string' }, asset: { type: 'string' } }, required: ['name', 'asset'] },
    qaPassed: { type: 'boolean' }, qaSummary: { type: 'string' }, narrationSeconds: { type: 'number' },
    selfReview: { type: 'string', description: 'one line per checklist item: ok / what you fixed / what remains' },
    practiceArc: { type: 'array', items: { type: 'string' }, minItems: 4, maxItems: 4 },
    credits: { type: 'string' }, sharedFileRequests: { type: 'string' }, notes: { type: 'string' },
  },
  required: ['slug', 'hero', 'qaPassed', 'qaSummary', 'narrationSeconds', 'selfReview', 'practiceArc', 'credits', 'sharedFileRequests', 'notes'],
}

const ROLE = {
  'lower-boy': { name: 'Rohan', pronoun: 'he/him', age: 'about 8' },
  nani: { name: 'Nani', pronoun: 'she/her', age: 'Rohan’s grandmother' },
  'middle-girl': { name: 'Tara', pronoun: 'she/her', age: 'about 10' },
  'upper-girl': { name: 'Ananya', pronoun: 'she/her', age: 'about 12' },
  'upper-boy': { name: 'Kabir', pronoun: 'he/him', age: 'about 12' },
}
const ROHAN = { asset: 'boy-emotions', moods: ['happy', 'sad', 'thinking', 'surprise'], description: 'the Rohan boy character (Boy with emotions, gty, CC BY)' }

const C = [
  { slug: 'sharing-backpack', title: 'The Sharing Backpack', classes: '3–4', band: 'lower', week: 'M1 · W2', role: 'lower-boy', practice: 'SharingBackpack in SecurityMissions.tsx',
    objective: 'Differentiate between public and private personal information.', mechanic: "Sort items (home address, favorite color, selfie, full name) into 'Keep Private' or 'Safe to Share' bags.",
    story: 'Rohan joins an online drawing club for kids. Its public profile page asks for lots of details and he almost fills in his home address, full name, school and a selfie. A comment from someone he doesn’t know shows how many people can see the page. He checks with Mum.',
    task: 'Tap or drag item cards (home address, favourite colour, selfie, full name, favourite animal…) into a “Keep Private” or a “Safe to Share” bag. Home address → Safe to Share is the tempting mistake and gets a why-hint. The selfie belongs in Keep Private (ask a grown-up first).',
    art: 'UI-built club profile form, public page preview, two illustrated bags.' },
  { slug: 'robot-or-not', title: 'Robot or Not?', classes: '3–4', band: 'lower', week: 'M2 · W9', role: 'lower-boy', practice: 'RobotOrNot in AiMissions.tsx',
    objective: 'Distinguish between living entities and programmed machines.', mechanic: "Tap objects (puppy, smart speaker, classroom clock, dancing robot) to sort them into 'Alive' or 'Machine'.",
    story: 'Rohan’s new dancing robot says “I’m hungry!” at bedtime. He worries it is sad and lonely and tries to feed it biscuits. With Nani and the neighbour’s puppy he discovers the difference: the puppy eats, grows and needs care; the robot follows a program people wrote.',
    task: 'Sort the puppy, smart speaker, classroom clock and dancing robot (plus a plant) into “Alive” or “Machine”. Tempting mistake: robot → Alive (“it talks and dances!”) gets a why-hint.',
    art: 'UI-built robot toy speech screen, sorting bins.' },
  { slug: 'teach-pet-machine', title: 'Teach the Pet Machine', classes: '3–4', band: 'lower', week: 'M2 · W10', role: 'lower-boy', practice: 'TeachPetMachine in AiMissions.tsx',
    objective: 'Understand how machines learn from sorting examples.', mechanic: 'Feed apples and rocks into a virtual machine to train it to recognize fruit.',
    story: 'Nani’s fruit stall gets a toy sorting machine. It has seen only one red apple, so it drops a round red rock into the fruit basket and a green apple into the rock pile. Rohan realises it needs more, and more varied, examples.',
    task: 'Feed labelled examples (several different fruits → Fruit, several rocks → Rock), then press Test: it now sorts correctly. Tempting mistake: teaching with only round red things / a single example gets a why-hint.',
    art: 'UI-built machine with conveyor, trays and a learning meter.' },
  { slug: 'pattern-detective', title: 'Pattern Detective', classes: '3–4', band: 'lower', week: 'M3 · W17', role: 'lower-boy', practice: 'PatternDetective in ThinkingMissions.tsx',
    objective: 'Recognize repeating visual patterns (CBSE CT).', mechanic: "Complete color and shape sequences on a train track to help Nani's trolley cross Cyberpur.",
    story: 'Rohan and Nani ride the Cyberpur trolley to the fair. It stops: some track tiles are missing, and it can only roll on tiles that keep the track’s repeating pattern. Rohan becomes the pattern detective.',
    task: 'Fill the missing tiles of a colour + shape sequence (find the repeating group, then continue it). Tempting mistake: right colour, wrong shape gets a why-hint.',
    art: 'pattern-station.webp for scenes 1/2/6; UI-built track tiles.' },
  { slug: 'step-by-step-morning', title: 'Step-by-Step Morning', classes: '3–4', band: 'lower', week: 'M3 · W18', role: 'lower-boy', practice: 'StepByStepMorning in ThinkingMissions.tsx',
    objective: 'Order sequential steps to accomplish a routine task.', mechanic: 'Drag out-of-order steps (brush teeth, wake up, put on shoes) into the correct chronological sequence.',
    story: 'Rohan programs his toy helper robot with his morning steps but mixes the order: shoes before socks, bag zipped before books go in. The robot follows every step exactly and Rohan is late for the bus. Computers do steps in exactly the order you give.',
    task: 'Drag (or tap-to-move) morning step cards into the right order. Tempting mistake: shoes before socks gets a why-hint.',
    art: 'morning-room.webp for scenes 1/2/6; UI-built robot routine board.' },
  { slug: 'nanis-secret-code', title: "Nani's Secret Code", classes: '3–4', band: 'lower', week: 'M4 · W25', role: 'nani', practice: 'NanisSecretCode in FraudMissions.tsx',
    objective: 'Recognize secret numbers (OTPs/PINs) and keep them private.', mechanic: 'An animated caller asks Nani for her secret code; tap the shield to block the call and tell an adult.',
    story: 'Rohan is visiting Nani. A friendly-sounding caller says her parcel is waiting and asks for “the code that just came on your phone”. Nani almost reads it out. Rohan remembers: secret codes stay secret. They end the call and tell Mum.',
    task: 'On the pretend call: tap the big shield to end/block the call, then “Tell Mum”. Tempting mistake: “Read the code” gets a why-hint.',
    art: 'safe-call-desk.webp for scenes 1/6; UI-built incoming call + SMS.' },
  { slug: 'surprise-pop-up', title: 'The Surprise Pop-Up', classes: '3–4', band: 'lower', week: 'M4 · W26', role: 'lower-boy', practice: 'SurprisePopUp in FraudMissions.tsx',
    objective: 'Identify deceptive online ads and pop-up windows.', mechanic: "A flashing window claims 'You Won a Free Tablet!'; drag it straight into the trash icon.",
    story: 'Rohan is building a castle in his game when a flashing window appears: “You won a free tablet! Claim in 10 seconds!” The CLAIM button asks for Mum’s phone number. Dad explains that surprise prizes you never entered are tricks.',
    task: 'Drag the pop-up into the trash icon (tap alternative “Move to trash”). Tempting mistake: CLAIM gets a why-hint. Flashing ≤ 3/s and off under reduced motion.',
    art: 'UI-built game screen + pop-up + trash.' },
  { slug: 'password-vault', title: 'The Password Vault', classes: '5', band: 'middle', week: 'M1 · W1', role: 'middle-girl', practice: 'PasswordVault in SecurityMissions.tsx',
    objective: 'Evaluate password strength and avoid reusing passcodes across accounts.', mechanic: 'Configure unique passwords for different accounts; reusing one triggers a simulated domino account breach.',
    story: 'Tara uses one password for her game and her school portal (and her email). The game website gets hacked — a data breach, not her fault. Attackers try the leaked password on other sites (this is called credential stuffing) and her other accounts fall like dominoes; she sees the consequences. With her mother she recovers them. The Class 3 chapter already taught long passphrases; go deeper: breaches happen even when you did nothing wrong, reuse multiplies the damage, and how people manage many passwords (a password manager, or a paper list kept safe at home by a parent) plus two-step verification.',
    task: 'Give each account (game, school portal, email) its own passphrase from word tiles, then “Replay the breach”: only the game account is affected and the dominoes stay standing. Tempting mistake: reusing one passphrase triggers the domino fall and a why-hint.',
    art: 'UI-built account cards, breach alert, domino animation.' },
  { slug: 'permission-control-panel', title: 'Permission Control Panel', classes: '5', band: 'middle', week: 'M1 · W2', role: 'middle-girl', practice: 'PermissionControlPanel in SecurityMissions.tsx',
    objective: 'Evaluate app permission requests (camera, contacts, location).', mechanic: 'Toggle permissions for a new flashlight app that requests access to contacts and location.',
    story: 'A power cut hits during homework and Tara installs a flashlight app. It wants access to her contacts (and location, camera, microphone) before it will turn on. “Allow all” is right there. Tara tests why a flashlight would want her contacts, and her cousin helps her ask: what does this app actually need to do its job?',
    task: 'Permission sheet toggles: turn off everything the flashlight doesn’t need (it needs none of them). Tempting mistake: “Allow all” gets a why-hint. Scene 5 may show a map app legitimately needs location.',
    art: 'UI-built phone with install + permission sheet.' },
  { slug: 'training-day', title: 'Training Day', classes: '5', band: 'middle', week: 'M2 · W9', role: 'middle-girl', practice: 'TrainingDay in AiMissions.tsx',
    objective: 'Understand how dataset quality directly impacts AI accuracy.', mechanic: 'Label photos of dogs; deliberately miss labeling certain breeds to observe classification errors.',
    story: 'Tara’s coding club builds a “lost pet finder” camera for the neighbourhood. When Kittu, the friendly Indian street dog everyone on her lane feeds, goes missing, the camera walks right past him and says “not a dog”. Its training photos were almost all golden retrievers. Tara repairs the dataset so the finder can recognise dogs like Kittu.',
    task: 'Label a mixed photo set, including the missing breeds (indie dogs like Kittu, pugs), as Dog; retrain and test: the finder now spots Kittu. Tempting mistake: labelling only golden retrievers leaves the finder still missing Kittu, with a why-hint.',
    art: 'dog-golden.jpg, dog-indie.jpg, dog-pug.jpg in a UI-built dataset grid / camera view.' },
  { slug: 'garbage-in-garbage-out', title: 'Garbage In, Garbage Out', classes: '5', band: 'middle', week: 'M2 · W10', role: 'middle-girl', practice: 'GarbageInGarbageOut in AiMissions.tsx',
    objective: 'Demonstrate how flawed training data produces inaccurate outputs.', mechanic: 'Feed biased data to an AI hiring tool and observe how it rejects qualified applicants.',
    story: 'Tara’s aunt runs a bakery and tries a helper tool that shortlists job applicants. It learned from old records where the bakery mostly hired people from one school, so its shortlist quietly prefers that school and leaves out a skilled baker from another. Tara finds the unfair school preference hiding in the data.',
    task: 'Inspect training rows, remove the unfair signal (school name) while keeping relevant skill columns, rerun: the skilled baker is accepted. Tempting mistake: removing a real skill column gets a why-hint.',
    art: 'UI-built data table, applicant cards, result screen.' },
  { slug: 'flowchart-architect', title: 'Flowchart Architect', classes: '5', band: 'middle', week: 'M3 · W17', role: 'middle-girl', practice: 'FlowchartArchitect in ThinkingMissions.tsx',
    objective: 'Translate procedural solutions into standard flowchart notation (CBSE CT).', mechanic: 'Connect logic blocks (Start, Process, Decision, End) to chart an automatic hand-washing station.',
    story: 'Tara’s science-fair hand-wash station sprays soap even when nobody is there — an empty sink gets a squirt every few seconds, just before the judges arrive. Its plan never asks a question; she needs a decision.',
    task: 'Place blocks: Start → Decision “Hands under sensor?” → Yes: Process “Dispense soap” → … → End; No: wait/loop back. Test both paths. Standard shapes (oval, rectangle, diamond). Tempting mistake: “Dispense soap” before the decision gets a why-hint.',
    art: 'engineering-lab.webp for scenes 1/2/6; UI-built flowchart board.' },
  { slug: 'loop-inspector', title: 'The Loop Inspector', classes: '5', band: 'middle', week: 'M3 · W18', role: 'middle-girl', practice: 'LoopInspector in ThinkingMissions.tsx',
    objective: 'Identify efficient repetitive structures in algorithms.', mechanic: "Replace long strings of repetitive movement commands with simple 'Repeat 5 Times' loop blocks.",
    story: 'Tara’s class robot cleaner runs a long program of the same moves copied again and again. She shortens it with a loop — then catches a counting error: with the wrong repeat count the robot stops short (or bumps the bin). A loop says it once, with the right count.',
    task: 'Replace the repeated commands with one “Repeat 5 Times” block (right count), run: the robot cleans the row. Tempting mistake: wrong count (4 or 6) gets a why-hint.',
    art: 'engineering-lab.webp for scenes 1/2/6; UI-built command strip + grid.' },
  { slug: 'otp-guardian', title: 'The OTP Guardian', classes: '5', band: 'middle', week: 'M4 · W25', role: 'middle-girl', practice: 'OtpGuardian in FraudMissions.tsx',
    objective: 'Recognize that One-Time Passwords function like key codes and must remain private.', mechanic: 'Refuse requests for OTPs from callers claiming to represent bank employees or utility workers.',
    story: 'Tara is at Nani’s house after school. Nani’s phone rings: a “bank officer” says her card will be blocked today unless she reads out the OTP that just arrived. Minutes later an “electricity office” caller says the power will be cut tonight — and also wants a code. Tara spots the pattern: urgency, an official-sounding title, and a request for the OTP. She helps Nani handle the callers safely.',
    task: 'For each pretend call, choose the safe response with Nani: refuse, hang up, and call the official number printed on the card or electricity bill. Tempting mistake: “Share the OTP to verify” gets a why-hint.',
    art: 'safe-call-desk.webp for scenes 1/6; UI-built call screens + SMS with OTP.' },
  { slug: 'qr-code-caution', title: 'QR Code Caution', classes: '5', band: 'middle', week: 'M4 · W26', role: 'middle-girl', practice: 'QrCodeCaution in FraudMissions.tsx',
    objective: 'Understand that scanning QR codes is used for paying money, not receiving it.', mechanic: 'A buyer offers to send money via QR code; reject the request to enter a UPI PIN to receive funds.',
    story: 'Tara and her mother sell old storybooks online. A buyer sends a QR code: “Scan to receive ₹500.” After scanning, Tara spots that the screen actually says “Pay ₹500” and asks for the UPI PIN, while the buyer keeps saying it is only “verification”.',
    task: 'Read the pretend UPI screen, cancel without a PIN, then pick the safe way to receive (share your own QR/UPI ID). Tempting mistake: “Enter PIN to receive” gets a why-hint.',
    art: 'bookshop-payment.webp for scenes 1/6; UI-built chat + UPI screen.' },
  { slug: 'online-reputation-builder', title: 'Online Reputation Builder', classes: '6–7', band: 'upper', week: 'M1 · W1', role: 'upper-boy', practice: 'OnlineReputationBuilder in SecurityMissions.tsx',
    objective: 'Analyze how public digital activity impacts future opportunities.', mechanic: 'Review a simulated social media feed to determine if posts align with admission requirements for a scholarship program.',
    story: 'Kabir applies for the Cyberpur Young Scientists scholarship. The rules say the panel looks at applicants’ public profiles for respect and integrity. He reviews what the panel could see: a proud science-project post, an old mocking comment about a classmate, and a friend’s photo he posted without asking. He audits it before the deadline.',
    task: 'Review each post against the scholarship criteria and choose keep / edit / delete / ask permission (the project post stays; the mocking comment goes, ideally with an apology; the photo needs the friend’s consent). Tempting mistakes: deleting the project post or keeping the mocking comment get why-hints. Mention audience, screenshots and permanence, and privacy settings.',
    art: 'UI-built feed + scholarship criteria card.' },
  { slug: 'email-header-inspector', title: 'Email Header Inspector', classes: '6–7', band: 'upper', week: 'M1 · W2', role: 'upper-boy', practice: 'EmailHeaderInspector in SecurityMissions.tsx',
    objective: 'Analyze email headers to identify spoofed senders and phishing attempts.', mechanic: 'Inspect raw email headers to match display names against actual originating server domains.',
    story: 'Kabir gets a convincing “Scholarship Office” email: “Congratulations! You have won an award. Submit your Aadhaar number and a ₹500 processing fee within 24 hours.” The logo and display name look right. He investigates by opening “Show original” to read the raw headers.',
    task: 'In the raw header view, flag the mismatches (From on a lookalike .example domain, Reply-To on another domain, Received from an unrelated server, SPF/DKIM fail) and leave ordinary fields unflagged. Tempting mistake: “display name says Scholarship Office, so it’s real” gets a why-hint. Then verify via the official site/phone and report.',
    art: 'UI-built email client with raw-header panel; .example domains only.' },
  { slug: 'deepfake-detective', title: 'Deepfake Detective', classes: '6–7', band: 'upper', week: 'M2 · W9', role: 'upper-boy', practice: 'DeepfakeDetective in AiMissions.tsx',
    objective: 'Analyze visual and auditory indicators of AI-generated media.', mechanic: 'Inspect suspicious video clips for deepfake artifacts like unnatural blinking, audio desync, and lighting anomalies.',
    story: 'A video clip spreads through Kabir’s class group: the Cyberpur fair organiser announcing “the fair is cancelled this weekend”. Friends are forwarding it and everyone is upset. Kabir looks closer and verifies it before sharing.',
    task: 'Scrub through the clip’s frames and tag the artefacts (unnatural blinking, lip-sync that doesn’t match the audio, lighting/shadow mismatch) without tagging a normal feature, then check the fair’s official channel before sharing. Tempting mistake: “looks real, forward it” (or tagging the normal feature) gets a why-hint. Artefacts are clues, not proof.',
    art: 'UI-built chat + illustrated video player with frame strip (no real faces).' },
  { slug: 'recommendation-rabbit-hole', title: 'Recommendation Rabbit-Hole', classes: '6–7', band: 'upper', week: 'M2 · W10', role: 'upper-boy', practice: 'RecommendationRabbitHole in AiMissions.tsx',
    objective: 'Analyze how engagement algorithms can amplify extreme content.', mechanic: 'Track how clicking sensational content shifts a user feed from neutral topics to extreme filter bubbles.',
    story: 'After the fake fair clip, Kabir’s feed keeps showing the rumour: more “fair cancelled” videos, then scarier and angrier ones. He feels anxious and explores why. The feed learns from every click, replay and pause and serves more of whatever grabs attention — a filter bubble.',
    task: 'Feed simulator with a topic-diversity meter: rebalance by choosing varied topics, “Not interested”, following reliable sources until the meter recovers. Tempting mistake: tapping more sensational videos drops the meter with a why-hint.',
    art: 'UI-built video feed + diversity meter.' },
  { slug: 'complex-algorithmic-logic', title: 'Complex Algorithmic Logic', classes: '6–7', band: 'upper', week: 'M3 · W17', role: 'upper-boy', practice: 'ComplexAlgorithmicLogic in ThinkingMissions.tsx',
    objective: 'Solve multi-variable logic problems using pseudocode (CBSE CT).', mechanic: 'Draft pseudocode using nested loops and multi-condition arrays to process student grades.',
    story: 'Kabir helps with the school’s report-card program. A classmate with exactly 40 marks and good attendance is rejected as “Fail” — an eligible score turned away — and the last student in every section is missing from the list. He traces the nested-loop pseudocode line by line to find the boundary error.',
    task: 'Fix both bugs: `IF marks > 40 AND attendance >= 75` → `>=`; inner loop `FOR s FROM 1 TO count - 1` → `TO count`; run a test-case table (38, 40, 74 marks; 70% attendance) — all correct. Tempting mistake: `> 39` / `>= 39` gets a why-hint (use the boundary the rule states).',
    art: 'UI-built code console + test table.' },
  { slug: 'algorithm-optimization', title: 'Algorithm Optimization', classes: '6–7', band: 'upper', week: 'M3 · W18', role: 'upper-boy', practice: 'AlgorithmOptimization in ThinkingMissions.tsx',
    objective: 'Compare algorithmic efficiency and time complexity.', mechanic: 'Test bubble sort versus merge sort algorithms on large datasets to evaluate execution speed.',
    story: 'Kabir built the sports-day leaderboard. With 2,000 runners it freezes just before prize time because it uses bubble sort. He tests two sorting methods — bubble sort and merge sort — on different lists (small and neat, reversed, large and mixed) and compares how much work each does (roughly n² against n log n comparisons).',
    task: 'Run both sorts on 8, 100 and 2,000 items, predict, read comparison counts, choose the right one for 2,000 mixed results. Nuance: on a tiny already-sorted list bubble sort with early exit can win. Tempting mistake: “bubble is always slower” / picking bubble for 2,000 gets a why-hint.',
    art: 'UI-built leaderboard + race bars + counters.' },
  { slug: 'digital-arrest-simulation', title: 'The Digital Arrest Simulation', classes: '6–7', band: 'upper', week: 'M4 · W25', role: 'upper-boy', practice: 'DigitalArrestSimulation in FraudMissions.tsx',
    objective: "Handle fraudulent 'digital arrest' video calls claiming law enforcement authority.", mechanic: 'Receive a fake video call claiming to be law enforcement; remain calm, spot fake badges, refuse payment, and notify 1930.',
    story: 'Kabir’s mother gets a frightening video call from a man in uniform with a “CBI” badge. He says a parcel in her name had illegal items, that she is under “digital arrest”, must stay on camera, tell no one, and pay to clear her name. Kabir notices the signs and helps his family respond calmly. Keep it reassuring, not traumatic.',
    task: 'Spot the warning signs (unverifiable/odd badge, secrecy demand, payment demand), then choose: end the call, tell family, report to 1930 / cybercrime.gov.in. Tempting mistake: “Pay to clear your name” / “Stay on the call” gets a why-hint. Digital arrest is not a real legal procedure.',
    art: 'safe-call-desk.webp for scenes 1/6; UI-built video call.' },
  { slug: 'deepfake-voice-relative-scam', title: 'Deepfake Voice Relative Scam', classes: '6–7', band: 'upper', week: 'M4 · W26', role: 'upper-boy', practice: 'DeepfakeVoiceRelativeScam in FraudMissions.tsx',
    objective: 'Recognize cloned voice scams requesting emergency financial help.', mechanic: "Receive a panicked voice message from a 'relative'; use an agreed family passphrase to verify identity.",
    story: 'Kabir’s family gets an urgent voice message that sounds exactly like his uncle: there has been an accident, his phone is broken, send ₹20,000 now and tell no one. Kabir remembers the family passphrase his parents set up after hearing about voice-cloning scams, and the family verifies before anyone pays.',
    task: 'Reply asking for the family passphrase; the “uncle” dodges it; Kabir calls the uncle’s saved number instead, and the uncle is fine. Tempting mistake: “It’s his voice, send the money” gets a why-hint. Explain voice cloning from short clips, passphrase, call-back, reporting.',
    art: 'UI-built chat with voice-note waveform + call screen.' },
]

function heroFor(role, cast) {
  if (role === 'lower-boy') return { ...ROLE[role], ...ROHAN, look: ROHAN.description }
  const found = r => (cast?.characters || []).find(c => c.role === r && c.asset)
  const chains = { nani: ['nani'], 'middle-girl': ['middle-girl', 'upper-girl'], 'upper-girl': ['upper-girl', 'middle-girl'], 'upper-boy': ['upper-boy'] }
  for (const r of chains[role]) { const c = found(r); if (c) return { ...ROLE[role], asset: c.asset, moods: c.moods, look: c.description } }
  if (role === 'nani') return { ...ROLE['lower-boy'], ...ROHAN, look: ROHAN.description, naniInUi: true }
  const boy = { 'middle-girl': 'Aarav', 'upper-girl': 'Kabir', 'upper-boy': 'Kabir' }[role]
  return { name: boy, pronoun: 'he/him', age: ROLE[role].age, ...ROHAN, look: ROHAN.description, fallback: true }
}

// Chapters whose builder was cut off mid-way by the usage limit: continue their files instead of rebuilding.
const RESUME = new Set(['surprise-pop-up', 'password-vault'])

function buildPrompt(c, hero) {
  return `You build ONE CyberSuraksha story chapter. Another agent builds a different chapter at the same time. Working copy: ${ROOT} (cd there). Dev server http://localhost:3200 (running; never start/stop it).
Read ${BRIEF} first and follow it exactly, including §10 (use the usage budget efficiently). The approved template is "password-vault-builder" (Class 3, Rohan): study it, but NEVER edit it or any shared file.

CHAPTER \`${c.slug}\` — "${c.title}" · Class ${c.classes} (${c.band} band) · ${c.week}
Curriculum objective: ${c.objective}
Curriculum mechanic: ${c.mechanic}
Approved story: ${c.story}
Mid-story task (scene 4, interactionScene 3): ${c.task}
Hero: ${hero.name} (${hero.pronoun}, ${hero.age}); character asset "${hero.asset}" — ${hero.look}. Use only these moods: ${hero.moods.join(', ')}.${hero.fallback ? ' No matching character exists, so the hero is a boy on the Rohan asset; use this name and these pronouns throughout.' : ''}${hero.naniInUi ? ' No grandmother character exists: Rohan is the character on the left and Nani appears in the UI (call screen, avatar).' : ''} Other people appear in the UI (call screens, avatars, chat bubbles).
Visuals: ${c.art}
Practice that follows the story: ${c.practice} (app/module/cyber/lessons/new/), intro lines at storyArcs["${c.slug}"] in StoryPrelude.tsx.

Steps: study the template and your practice component → write ${c.slug}.json (6 scenes, the brief's word/length rules for Class ${c.classes}, accurate per §8, \`speech\` for symbols/acronyms/₹/numbers) → write ${c.slug}.tsx, .module.css, .qa.cjs (rich UI-built scenes at Rohan's polish, narration-synced reveals, an accessible task with a tempting wrong choice + why-hint, markSolved once, finished state on revisit) → narrate → tsc, lint, QA (slot helper; QA with sandbox disabled: python3 scripts/with-slot.py qa 2 -- ${NODE} scripts/story-qa.cjs ${c.slug}) until ALL PASSED → read the two contact sheets.

Before reporting, SELF-REVIEW as a strict reviewer would and fix what fails (then re-run QA once):
1. Curriculum: the story + task genuinely teach the objective via the mechanic.
2. Story: a person, feelings, stakes and a resolution; not a quiz with a mascot; leads into the practice.
3. Level: caption words per scene and total narration within §3 for Class ${c.classes}; vocabulary and nuance fit the class.
4. Accuracy: §8 facts; nothing misleading, frightening or victim-blaming.
5. Narration: every symbol/acronym/number has a spoken form; caption and speech match.
6. Task: the tempting wrong answer gets a why-hint; it can't be solved by random tapping; keyboard/tap accessible; works on mobile.
7. Visuals: as polished as Rohan's; nothing clipped, overlapping, cramped or empty on desktop or mobile; believable fictional UI; .example domains / fictional numbers; reduced motion respected.
8. Contract: only your chapter's files changed; kit reused; no external assets or new deps.
Report honestly in the schema: qaPassed = last QA run; selfReview = one line per item; practiceArc = 4 lines continuing your story into the existing practice steps.${RESUME.has(c.slug) ? `\n\nNOTE: a previous agent building this chapter was cut off by a usage limit after writing chapters/${c.slug}.{json,tsx,module.css,qa.cjs} and the narration. Don't start over: read those files, run QA, then finish, fix and polish them. Regenerate the narration only if you change captions.` : ''}`
}

// Pool of at most 2 concurrent agents: the caster + one builder, then two builders.
const queue = [...C]
const results = []
let cast = null
const castPromise = agent(`Find and install animated Rive characters for CyberSuraksha story chapters. Be efficient (the account has a spend limit): no long exploration, no extra skills.
Working copy: ${ROOT} (dev server http://localhost:3200 running; don't start/stop it). See how the existing character works: app/module/cyber/lessons/new/story/characters.ts, StoryCharacter.tsx, public/animations/password-story/ (rohan.riv + happy/sad/thinking/surprise.png, 260×250), and the Rohan credits entry in public/cyber-missions/ASSET-CREDITS.md. Codex's Rive helper scripts: /Users/dipeshkumar/Documents/Codex/2026-09-27/do-u/work/qa/ (inspect-rive.cjs, rive-emotions.cjs). Playwright: /Users/dipeshkumar/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright (channel 'chrome'); Rive runtime: node_modules/@rive-app/canvas.
Roles: middle-girl "Meera" (girl ~10, Class 5 hero); upper-girl "Ananya" (girl ~12); upper-boy "Kabir" (boy ~12); nani (Rohan's grandmother, optional).
Requirements: Rive Marketplace/community files under a license allowing commercial use with credit (CC BY — verify on the file page); friendly flat/cartoon style that matches the Rohan "Boy with emotions" character; ideally South Asian representation; readable in a ~295px square; expressions for at least happy, sad, thinking (or neutral/pondering) and surprise, via a state-machine number input or named animations.
Finding files: the community listing API https://api-cached.rive.app/api/community-posts?limit=500 (paginate with &before=<last created or id>) returns posts with titles/ids; runtime files download from https://public.rive.app/community/runtime-files/<id>.riv (<id> like 5918-11535-boy-with-emotions). Filter titles for words like girl, woman, kid, child, teen, grandma, granny, old lady, avatar, character, emotion, face, expression.
For each chosen character: save public/animations/characters/<asset-id>/<asset-id>.riv; inspect artboards/state machines/inputs/animations in headless Chrome; render every mood and LOOK at the renders to verify each mapping (Codex once mapped "happy" to a contempt face); export <mood>.png fallbacks (260×250) into the same folder; add an entry to \`characters\` in characters.ts, keeping the boy-emotions entry byte-for-byte. If expressions are animation-based, extend CharacterSpec/StoryCharacter minimally and backward-compatibly, keeping files valid at every save because another agent is importing them now. Append credits to public/cyber-missions/ASSET-CREDITS.md in the Rohan entry's style, and make a labelled contact sheet at .story-qa/cast/cast-sheet.png.
Prove nothing broke: python3 scripts/with-slot.py qa 2 -- ${NODE} scripts/story-qa.cjs password-vault-builder (sandbox disabled) must end ALL PASSED, and python3 scripts/with-slot.py tsc 1 -- npx tsc --noEmit -p . must show no errors under story/.
If a role has no suitable free character after a reasonable search, return asset "" for it. Moods = exactly the keys in your emotions map.`, { label: 'cast:rive-characters', phase: 'Cast', schema: CAST_SCHEMA }).then(r => { cast = r; return r })

async function runChapter(c) {
  const castResult = c.role === 'lower-boy' ? null : await castPromise
  const hero = heroFor(c.role, castResult)
  const build = await agent(buildPrompt(c, hero), { label: `build:${c.slug}`, phase: 'Build', schema: BUILD_SCHEMA })
  results.push({ slug: c.slug, hero: { name: hero.name, asset: hero.asset, fallback: !!hero.fallback }, build })
  log(`${results.length}/${C.length} done · ${c.slug}: ${build ? (build.qaPassed ? 'QA passed' : 'QA NOT passed') : 'agent failed'}`)
}
async function drain() { while (queue.length) await runChapter(queue.shift()) }

phase('Build')
await parallel([
  () => castPromise.then(() => drain(), () => drain()),
  () => drain(),
])
return { cast, chapters: results, missing: C.map(c => c.slug).filter(s => !results.find(r => r.slug === s && r.build)) }
