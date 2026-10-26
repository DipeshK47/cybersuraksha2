import type { CyberLessonMeta } from "./cyber-lessons";

export const CLASS11_CT_SLUGS = [
  "decompose-the-scholarship-desk",
  "model-only-what-matters",
  "make-the-rules-explicit",
  "trace-and-debug-a-decision",
  "search-and-sort-with-purpose",
  "reuse-a-reliable-step",
  "test-the-boundaries",
  "algorithm-review-board"
] as const;

export const class11CtMissions = [
  {
    "id": "cyber-class-11-decompose-the-scholarship-desk",
    "slug": "decompose-the-scholarship-desk",
    "title": "Decompose the scholarship desk",
    "band": "upper",
    "grades": [
      11
    ],
    "strand": "Computational Thinking",
    "summary": "Define inputs, outputs, constraints and subproblems; separate facts from assumptions.",
    "primaryMechanic": "scholarship-process-decomposition",
    "openingPattern": "decompose-the-scholarship-desk-story",
    "completionPattern": "decompose-the-scholarship-desk-test-record",
    "accent": "violet",
    "durationMinutes": 40,
    "assessmentIds": [
      "decompose-the-scholarship-desk-check-1",
      "decompose-the-scholarship-desk-check-2",
      "decompose-the-scholarship-desk-transfer"
    ],
    "familyAction": "Break a fictional enquiry into inputs, processing, review and communication. Explain one task that stays with a person."
  },
  {
    "id": "cyber-class-11-model-only-what-matters",
    "slug": "model-only-what-matters",
    "title": "Model only what matters",
    "band": "upper",
    "grades": [
      11
    ],
    "strand": "Computational Thinking",
    "summary": "Use abstraction; choose records, lists and key-value lookups for a task.",
    "primaryMechanic": "minimal-applicant-record-model",
    "openingPattern": "model-only-what-matters-story",
    "completionPattern": "model-only-what-matters-test-record",
    "accent": "violet",
    "durationMinutes": 40,
    "assessmentIds": [
      "model-only-what-matters-check-1",
      "model-only-what-matters-check-2",
      "model-only-what-matters-transfer"
    ],
    "familyAction": "Explain why stable IDs are safer than names as record keys. Use synthetic examples and collect only necessary fields."
  },
  {
    "id": "cyber-class-11-make-the-rules-explicit",
    "slug": "make-the-rules-explicit",
    "title": "Make the rules explicit",
    "band": "upper",
    "grades": [
      11
    ],
    "strand": "Computational Thinking",
    "summary": "Translate conditions into Boolean logic, decision tables and unambiguous pseudocode.",
    "primaryMechanic": "boolean-eligibility-workbench",
    "openingPattern": "make-the-rules-explicit-story",
    "completionPattern": "make-the-rules-explicit-test-record",
    "accent": "violet",
    "durationMinutes": 40,
    "assessmentIds": [
      "make-the-rules-explicit-check-1",
      "make-the-rules-explicit-check-2",
      "make-the-rules-explicit-transfer"
    ],
    "familyAction": "Describe an explicit if/then rule and test the exact threshold as well as missing information."
  },
  {
    "id": "cyber-class-11-trace-and-debug-a-decision",
    "slug": "trace-and-debug-a-decision",
    "title": "Trace and debug a decision",
    "band": "upper",
    "grades": [
      11
    ],
    "strand": "Computational Thinking",
    "summary": "Trace sequence, branches and loops; distinguish syntax-like errors from incorrect logic.",
    "primaryMechanic": "loop-and-boundary-trace-console",
    "openingPattern": "trace-and-debug-a-decision-story",
    "completionPattern": "trace-and-debug-a-decision-test-record",
    "accent": "violet",
    "durationMinutes": 40,
    "assessmentIds": [
      "trace-and-debug-a-decision-check-1",
      "trace-and-debug-a-decision-check-2",
      "trace-and-debug-a-decision-transfer"
    ],
    "familyAction": "Trace a short loop and explain why an array index equal to its length is outside the valid positions."
  },
  {
    "id": "cyber-class-11-search-and-sort-with-purpose",
    "slug": "search-and-sort-with-purpose",
    "title": "Search and sort with purpose",
    "band": "upper",
    "grades": [
      11
    ],
    "strand": "Computational Thinking",
    "summary": "Compare linear and binary search; state the sorted-data requirement for binary search.",
    "primaryMechanic": "measured-search-comparison",
    "openingPattern": "search-and-sort-with-purpose-story",
    "completionPattern": "search-and-sort-with-purpose-test-record",
    "accent": "violet",
    "durationMinutes": 40,
    "assessmentIds": [
      "search-and-sort-with-purpose-check-1",
      "search-and-sort-with-purpose-check-2",
      "search-and-sort-with-purpose-transfer"
    ],
    "familyAction": "Compare searching a small unsorted list with searching a prepared sorted list. Include sorting effort in the decision."
  },
  {
    "id": "cyber-class-11-reuse-a-reliable-step",
    "slug": "reuse-a-reliable-step",
    "title": "Reuse a reliable step",
    "band": "upper",
    "grades": [
      11
    ],
    "strand": "Computational Thinking",
    "summary": "Identify a function's inputs, output and preconditions; avoid duplicating inconsistent rules.",
    "primaryMechanic": "shared-function-contract-lab",
    "openingPattern": "reuse-a-reliable-step-story",
    "completionPattern": "reuse-a-reliable-step-test-record",
    "accent": "violet",
    "durationMinutes": 40,
    "assessmentIds": [
      "reuse-a-reliable-step-check-1",
      "reuse-a-reliable-step-check-2",
      "reuse-a-reliable-step-transfer"
    ],
    "familyAction": "Explain a reusable function through its inputs, result and handling of missing or invalid data."
  },
  {
    "id": "cyber-class-11-test-the-boundaries",
    "slug": "test-the-boundaries",
    "title": "Test the boundaries",
    "band": "upper",
    "grades": [
      11
    ],
    "strand": "Computational Thinking",
    "summary": "Design ordinary, boundary and invalid cases; explain why passing examples does not prove all cases.",
    "primaryMechanic": "six-case-regression-matrix",
    "openingPattern": "test-the-boundaries-story",
    "completionPattern": "test-the-boundaries-test-record",
    "accent": "violet",
    "durationMinutes": 40,
    "assessmentIds": [
      "test-the-boundaries-check-1",
      "test-the-boundaries-check-2",
      "test-the-boundaries-transfer"
    ],
    "familyAction": "Design an ordinary, boundary and invalid case, plus empty and duplicate-record cases, for a fictional workflow."
  },
  {
    "id": "cyber-class-11-algorithm-review-board",
    "slug": "algorithm-review-board",
    "title": "Algorithm review board",
    "band": "upper",
    "grades": [
      11
    ],
    "strand": "Computational Thinking",
    "summary": "Explain correctness, limitations and an alternative solution.",
    "primaryMechanic": "changed-requirement-review-board",
    "openingPattern": "algorithm-review-board-story",
    "completionPattern": "algorithm-review-board-test-record",
    "accent": "violet",
    "durationMinutes": 40,
    "assessmentIds": [
      "algorithm-review-board-check-1",
      "algorithm-review-board-check-2",
      "algorithm-review-board-transfer"
    ],
    "familyAction": "Defend an algorithm change with test evidence, a remaining limitation and a clear human review point."
  }
] satisfies CyberLessonMeta[];

export const CLASS11_AI_SLUGS = [
  "is-ai-needed-here",
  "frame-a-useful-ai-problem",
  "repair-the-dataset",
  "how-a-model-learns",
  "measure-mistakes-not-confidence",
  "whose-examples-are-missing",
  "can-this-assistant-be-trusted",
  "ai-evaluation-review"
] as const;

export const class11AiMissions = [
  {
    "id": "cyber-class-11-is-ai-needed-here",
    "slug": "is-ai-needed-here",
    "title": "Is AI needed here?",
    "band": "upper",
    "grades": [
      11
    ],
    "strand": "Artificial Intelligence",
    "summary": "Distinguish a rule, a learned prediction and a generated response; select an appropriate approach.",
    "primaryMechanic": "approach-selection-bench",
    "openingPattern": "is-ai-needed-here-story",
    "completionPattern": "is-ai-needed-here-dossier",
    "accent": "sky",
    "durationMinutes": 40,
    "assessmentIds": [
      "is-ai-needed-here-check-1",
      "is-ai-needed-here-check-2",
      "is-ai-needed-here-transfer"
    ],
    "familyAction": "Find a low-stakes task that a clear rule can solve without AI. Explain your choice."
  },
  {
    "id": "cyber-class-11-frame-a-useful-ai-problem",
    "slug": "frame-a-useful-ai-problem",
    "title": "Frame a useful AI problem",
    "band": "upper",
    "grades": [
      11
    ],
    "strand": "Artificial Intelligence",
    "summary": "Define the user, intended decision, input, output and a measurable success criterion.",
    "primaryMechanic": "ai-problem-brief-builder",
    "openingPattern": "frame-a-useful-ai-problem-story",
    "completionPattern": "frame-a-useful-ai-problem-dossier",
    "accent": "sky",
    "durationMinutes": 40,
    "assessmentIds": [
      "frame-a-useful-ai-problem-check-1",
      "frame-a-useful-ai-problem-check-2",
      "frame-a-useful-ai-problem-transfer"
    ],
    "familyAction": "Describe a fictional helper in terms of user, input, output, success criterion and human fallback."
  },
  {
    "id": "cyber-class-11-repair-the-dataset",
    "slug": "repair-the-dataset",
    "title": "Repair the dataset",
    "band": "upper",
    "grades": [
      11
    ],
    "strand": "Artificial Intelligence",
    "summary": "Detect missing values, duplicate examples, ambiguous labels and unrepresentative samples.",
    "primaryMechanic": "synthetic-dataset-repair",
    "openingPattern": "repair-the-dataset-story",
    "completionPattern": "repair-the-dataset-dossier",
    "accent": "sky",
    "durationMinutes": 40,
    "assessmentIds": [
      "repair-the-dataset-check-1",
      "repair-the-dataset-check-2",
      "repair-the-dataset-transfer"
    ],
    "familyAction": "Explain why unknown data should be marked for review instead of filled with invented values."
  },
  {
    "id": "cyber-class-11-how-a-model-learns",
    "slug": "how-a-model-learns",
    "title": "How a model learns",
    "band": "upper",
    "grades": [
      11
    ],
    "strand": "Artificial Intelligence",
    "summary": "Differentiate supervised learning, clustering and regression at introductory level; separate training from testing.",
    "primaryMechanic": "nearest-example-learning-lab",
    "openingPattern": "how-a-model-learns-story",
    "completionPattern": "how-a-model-learns-dossier",
    "accent": "sky",
    "durationMinutes": 40,
    "assessmentIds": [
      "how-a-model-learns-check-1",
      "how-a-model-learns-check-2",
      "how-a-model-learns-transfer"
    ],
    "familyAction": "Explain why labels from a held-out test should not be used to improve a model before its evaluation."
  },
  {
    "id": "cyber-class-11-measure-mistakes-not-confidence",
    "slug": "measure-mistakes-not-confidence",
    "title": "Measure mistakes, not confidence",
    "band": "upper",
    "grades": [
      11
    ],
    "strand": "Artificial Intelligence",
    "summary": "Count correct and incorrect predictions; explain why a convenient sample can mislead.",
    "primaryMechanic": "held-out-baseline-scoreboard",
    "openingPattern": "measure-mistakes-not-confidence-story",
    "completionPattern": "measure-mistakes-not-confidence-dossier",
    "accent": "sky",
    "durationMinutes": 40,
    "assessmentIds": [
      "measure-mistakes-not-confidence-check-1",
      "measure-mistakes-not-confidence-check-2",
      "measure-mistakes-not-confidence-transfer"
    ],
    "familyAction": "Compare a model and a simple baseline on the same examples, then name one limit of that comparison."
  },
  {
    "id": "cyber-class-11-whose-examples-are-missing",
    "slug": "whose-examples-are-missing",
    "title": "Whose examples are missing?",
    "band": "upper",
    "grades": [
      11
    ],
    "strand": "Artificial Intelligence",
    "summary": "Explain representation, proxy features and unequal error patterns without treating correlation as cause.",
    "primaryMechanic": "lighting-group-error-audit",
    "openingPattern": "whose-examples-are-missing-story",
    "completionPattern": "whose-examples-are-missing-dossier",
    "accent": "sky",
    "durationMinutes": 40,
    "assessmentIds": [
      "whose-examples-are-missing-check-1",
      "whose-examples-are-missing-check-2",
      "whose-examples-are-missing-transfer"
    ],
    "familyAction": "Ask whose examples or conditions a small dataset might miss. Do not infer a cause from an error difference alone."
  },
  {
    "id": "cyber-class-11-can-this-assistant-be-trusted",
    "slug": "can-this-assistant-be-trusted",
    "title": "Can this assistant be trusted?",
    "band": "upper",
    "grades": [
      11
    ],
    "strand": "Artificial Intelligence",
    "summary": "Recognise fabricated claims, weak citations and sensitive-data risks; improve a task instruction.",
    "primaryMechanic": "source-grounded-claim-ledger",
    "openingPattern": "can-this-assistant-be-trusted-story",
    "completionPattern": "can-this-assistant-be-trusted-dossier",
    "accent": "sky",
    "durationMinutes": 40,
    "assessmentIds": [
      "can-this-assistant-be-trusted-check-1",
      "can-this-assistant-be-trusted-check-2",
      "can-this-assistant-be-trusted-transfer"
    ],
    "familyAction": "Check a supplied assistant claim against its actual source. Keep personal information out of classroom prompts."
  },
  {
    "id": "cyber-class-11-ai-evaluation-review",
    "slug": "ai-evaluation-review",
    "title": "AI evaluation review",
    "band": "upper",
    "grades": [
      11
    ],
    "strand": "Artificial Intelligence",
    "summary": "Explain when a small model should be used, constrained or rejected.",
    "primaryMechanic": "ai-evaluation-dossier",
    "openingPattern": "ai-evaluation-review-story",
    "completionPattern": "ai-evaluation-review-dossier",
    "accent": "sky",
    "durationMinutes": 40,
    "assessmentIds": [
      "ai-evaluation-review-check-1",
      "ai-evaluation-review-check-2",
      "ai-evaluation-review-transfer"
    ],
    "familyAction": "Explain when to use, revise or stop a low-stakes AI helper, and disclose any assistance used."
  }
] satisfies CyberLessonMeta[];

export const CLASS11_SECURITY_SLUGS = [
  "your-digital-risk-map",
  "identity-beyond-a-password",
  "who-should-have-access",
  "what-a-browser-can-tell-you",
  "data-has-a-lifecycle",
  "devices-updates-and-backups",
  "the-suspicious-login",
  "security-design-review"
] as const;

export const CLASS11_FRAUD_SLUGS = [
  "how-a-scam-builds-pressure",
  "the-internship-that-pays-too-well",
  "before-you-approve-that-payment",
  "when-the-message-looks-official",
  "a-familiar-voice-asks-for-money",
  "what-to-do-after-a-loss",
  "integrated-case-the-festival-refund",
  "defend-your-decision"
] as const;

export const class11FraudMissions = [
  {
    "id": "cyber-class-11-how-a-scam-builds-pressure",
    "slug": "how-a-scam-builds-pressure",
    "title": "How a scam builds pressure",
    "band": "upper",
    "grades": [
      11
    ],
    "strand": "Cyber Fraud",
    "summary": "Identify urgency, authority, scarcity, secrecy and reward; separate a warning sign from proof.",
    "primaryMechanic": "how-a-scam-builds-pressure-verification-lab",
    "openingPattern": "how-a-scam-builds-pressure-story",
    "completionPattern": "how-a-scam-builds-pressure-evidence-defence",
    "accent": "coral",
    "durationMinutes": 40,
    "assessmentIds": [
      "how-a-scam-builds-pressure-check-1",
      "how-a-scam-builds-pressure-check-2",
      "how-a-scam-builds-pressure-transfer"
    ],
    "familyAction": "Discuss urgency, authority and secrecy in a fictional message. Agree on an independent verification route before acting."
  },
  {
    "id": "cyber-class-11-the-internship-that-pays-too-well",
    "slug": "the-internship-that-pays-too-well",
    "title": "The internship that pays too well",
    "band": "upper",
    "grades": [
      11
    ],
    "strand": "Cyber Fraud",
    "summary": "Verify organisations and contacts; recognise upfront-payment and identity-document traps.",
    "primaryMechanic": "the-internship-that-pays-too-well-verification-lab",
    "openingPattern": "the-internship-that-pays-too-well-story",
    "completionPattern": "the-internship-that-pays-too-well-evidence-defence",
    "accent": "coral",
    "durationMinutes": 40,
    "assessmentIds": [
      "the-internship-that-pays-too-well-check-1",
      "the-internship-that-pays-too-well-check-2",
      "the-internship-that-pays-too-well-transfer"
    ],
    "familyAction": "Verify a fictional offer through an independently located organisation contact. Keep identity documents private while uncertainty remains."
  },
  {
    "id": "cyber-class-11-before-you-approve-that-payment",
    "slug": "before-you-approve-that-payment",
    "title": "Before you approve that payment",
    "band": "upper",
    "grades": [
      11
    ],
    "strand": "Cyber Fraud",
    "summary": "Read payee, amount and payment direction; distinguish receiving money from authorising an outgoing payment.",
    "primaryMechanic": "before-you-approve-that-payment-verification-lab",
    "openingPattern": "before-you-approve-that-payment-story",
    "completionPattern": "before-you-approve-that-payment-evidence-defence",
    "accent": "coral",
    "durationMinutes": 40,
    "assessmentIds": [
      "before-you-approve-that-payment-check-1",
      "before-you-approve-that-payment-check-2",
      "before-you-approve-that-payment-transfer"
    ],
    "familyAction": "Explain who pays whom on a synthetic payment screen. Never share a PIN or OTP or approve an outgoing payment to receive money."
  },
  {
    "id": "cyber-class-11-when-the-message-looks-official",
    "slug": "when-the-message-looks-official",
    "title": "When the message looks official",
    "band": "upper",
    "grades": [
      11
    ],
    "strand": "Cyber Fraud",
    "summary": "Distinguish a display name from the actual sender; verify support numbers and links independently.",
    "primaryMechanic": "when-the-message-looks-official-verification-lab",
    "openingPattern": "when-the-message-looks-official-story",
    "completionPattern": "when-the-message-looks-official-evidence-defence",
    "accent": "coral",
    "durationMinutes": 40,
    "assessmentIds": [
      "when-the-message-looks-official-check-1",
      "when-the-message-looks-official-check-2",
      "when-the-message-looks-official-transfer"
    ],
    "familyAction": "Compare a displayed sender name with the actual address, then choose a support channel independently of the message."
  },
  {
    "id": "cyber-class-11-a-familiar-voice-asks-for-money",
    "slug": "a-familiar-voice-asks-for-money",
    "title": "A familiar voice asks for money",
    "band": "upper",
    "grades": [
      11
    ],
    "strand": "Cyber Fraud",
    "summary": "Explain why a voice or video can be insufficient evidence; resist secrecy and intimidation.",
    "primaryMechanic": "a-familiar-voice-asks-for-money-verification-lab",
    "openingPattern": "a-familiar-voice-asks-for-money-story",
    "completionPattern": "a-familiar-voice-asks-for-money-evidence-defence",
    "accent": "coral",
    "durationMinutes": 40,
    "assessmentIds": [
      "a-familiar-voice-asks-for-money-check-1",
      "a-familiar-voice-asks-for-money-check-2",
      "a-familiar-voice-asks-for-money-transfer"
    ],
    "familyAction": "Practise calmly ending a money-demand call and checking through a previously known contact with a trusted adult."
  },
  {
    "id": "cyber-class-11-what-to-do-after-a-loss",
    "slug": "what-to-do-after-a-loss",
    "title": "What to do after a loss",
    "band": "upper",
    "grades": [
      11
    ],
    "strand": "Cyber Fraud",
    "summary": "Contact the bank/payment provider immediately; use 1930 and cybercrime.gov.in for financial cyber fraud, with trusted-adult support.",
    "primaryMechanic": "what-to-do-after-a-loss-verification-lab",
    "openingPattern": "what-to-do-after-a-loss-story",
    "completionPattern": "what-to-do-after-a-loss-evidence-defence",
    "accent": "coral",
    "durationMinutes": 40,
    "assessmentIds": [
      "what-to-do-after-a-loss-check-1",
      "what-to-do-after-a-loss-check-2",
      "what-to-do-after-a-loss-transfer"
    ],
    "familyAction": "Rehearse immediate bank contact and Indian cyber-fraud reporting with a trusted adult. Never submit the fictional classroom report."
  },
  {
    "id": "cyber-class-11-integrated-case-the-festival-refund",
    "slug": "integrated-case-the-festival-refund",
    "title": "Integrated case: the festival refund",
    "band": "upper",
    "grades": [
      11
    ],
    "strand": "Cyber Fraud",
    "summary": "Combine access control, AI-output checking, decision logic and payment verification.",
    "primaryMechanic": "integrated-case-the-festival-refund-verification-lab",
    "openingPattern": "integrated-case-the-festival-refund-story",
    "completionPattern": "integrated-case-the-festival-refund-evidence-defence",
    "accent": "coral",
    "durationMinutes": 40,
    "assessmentIds": [
      "integrated-case-the-festival-refund-check-1",
      "integrated-case-the-festival-refund-check-2",
      "integrated-case-the-festival-refund-transfer"
    ],
    "familyAction": "Explain the festival-refund decision using evidence from security, AI, logic and payment checks; identify what remains uncertain."
  },
  {
    "id": "cyber-class-11-defend-your-decision",
    "slug": "defend-your-decision",
    "title": "Defend your decision",
    "band": "upper",
    "grades": [
      11
    ],
    "strand": "Cyber Fraud",
    "summary": "Transfer the protocol to an unseen case and explain what remains uncertain.",
    "primaryMechanic": "defend-your-decision-verification-lab",
    "openingPattern": "defend-your-decision-story",
    "completionPattern": "defend-your-decision-evidence-defence",
    "accent": "coral",
    "durationMinutes": 40,
    "assessmentIds": [
      "defend-your-decision-check-1",
      "defend-your-decision-check-2",
      "defend-your-decision-transfer"
    ],
    "familyAction": "Give a two-minute individual explanation of a new fictional case, including evidence, an alternative, uncertainty and a safer revision."
  }
] satisfies CyberLessonMeta[];

export const CLASS11_LESSON_SLUGS = [...CLASS11_SECURITY_SLUGS, ...CLASS11_AI_SLUGS, ...CLASS11_CT_SLUGS, ...CLASS11_FRAUD_SLUGS] as const;

export const class11SecurityMissions = [
  {
    "id": "cyber-class-11-your-digital-risk-map",
    "slug": "your-digital-risk-map",
    "title": "Your digital risk map",
    "band": "upper",
    "grades": [
      11
    ],
    "strand": "Cybersecurity",
    "summary": "Identify assets, threats, vulnerabilities and impact; distinguish confidentiality, integrity and availability.",
    "primaryMechanic": "risk-chain-mapper",
    "openingPattern": "your-digital-risk-map-story",
    "completionPattern": "your-digital-risk-map-evidence",
    "accent": "mint",
    "durationMinutes": 40,
    "assessmentIds": [
      "your-digital-risk-map-check-1",
      "your-digital-risk-map-check-2",
      "your-digital-risk-map-transfer"
    ],
    "familyAction": "Map one fictional account, its main risk and a safeguard. Discuss why your priority could change."
  },
  {
    "id": "cyber-class-11-identity-beyond-a-password",
    "slug": "identity-beyond-a-password",
    "title": "Identity beyond a password",
    "band": "upper",
    "grades": [
      11
    ],
    "strand": "Cybersecurity",
    "summary": "Distinguish authentication from authorisation; explain unique passwords, password managers, MFA and recovery.",
    "primaryMechanic": "identity-recovery-console",
    "openingPattern": "identity-beyond-a-password-story",
    "completionPattern": "identity-beyond-a-password-evidence",
    "accent": "mint",
    "durationMinutes": 40,
    "assessmentIds": [
      "identity-beyond-a-password-check-1",
      "identity-beyond-a-password-check-2",
      "identity-beyond-a-password-transfer"
    ],
    "familyAction": "Review how a fictional account would be recovered after a lost phone. Keep all real credentials private."
  },
  {
    "id": "cyber-class-11-who-should-have-access",
    "slug": "who-should-have-access",
    "title": "Who should have access?",
    "band": "upper",
    "grades": [
      11
    ],
    "strand": "Cybersecurity",
    "summary": "Apply least privilege, role-based sharing, link expiry and consent.",
    "primaryMechanic": "fest-access-matrix",
    "openingPattern": "who-should-have-access-story",
    "completionPattern": "who-should-have-access-evidence",
    "accent": "mint",
    "durationMinutes": 40,
    "assessmentIds": [
      "who-should-have-access-check-1",
      "who-should-have-access-check-2",
      "who-should-have-access-transfer"
    ],
    "familyAction": "Explain why a former team member should lose access through both direct shares and group membership."
  },
  {
    "id": "cyber-class-11-what-a-browser-can-tell-you",
    "slug": "what-a-browser-can-tell-you",
    "title": "What a browser can tell you",
    "band": "upper",
    "grades": [
      11
    ],
    "strand": "Cybersecurity",
    "summary": "Read a domain, URL and connection indicator; explain that HTTPS alone does not establish legitimacy.",
    "primaryMechanic": "browser-evidence-desk",
    "openingPattern": "what-a-browser-can-tell-you-story",
    "completionPattern": "what-a-browser-can-tell-you-evidence",
    "accent": "mint",
    "durationMinutes": 40,
    "assessmentIds": [
      "what-a-browser-can-tell-you-check-1",
      "what-a-browser-can-tell-you-check-2",
      "what-a-browser-can-tell-you-transfer"
    ],
    "familyAction": "Compare the actual hostname with a known official address. A connection indicator alone cannot establish legitimacy."
  },
  {
    "id": "cyber-class-11-data-has-a-lifecycle",
    "slug": "data-has-a-lifecycle",
    "title": "Data has a lifecycle",
    "band": "upper",
    "grades": [
      11
    ],
    "strand": "Cybersecurity",
    "summary": "Choose what to collect, where to store it, who may see it and when to delete it.",
    "primaryMechanic": "data-lifecycle-editor",
    "openingPattern": "data-has-a-lifecycle-story",
    "completionPattern": "data-has-a-lifecycle-evidence",
    "accent": "mint",
    "durationMinutes": 40,
    "assessmentIds": [
      "data-has-a-lifecycle-check-1",
      "data-has-a-lifecycle-check-2",
      "data-has-a-lifecycle-transfer"
    ],
    "familyAction": "Ask what information a form really needs and how long it should be kept. Use fictional examples."
  },
  {
    "id": "cyber-class-11-devices-updates-and-backups",
    "slug": "devices-updates-and-backups",
    "title": "Devices, updates and backups",
    "band": "upper",
    "grades": [
      11
    ],
    "strand": "Cybersecurity",
    "summary": "Relate updates, trusted software sources, locks and recoverable backups to specific risks.",
    "primaryMechanic": "device-restoration-bench",
    "openingPattern": "devices-updates-and-backups-story",
    "completionPattern": "devices-updates-and-backups-evidence",
    "accent": "mint",
    "durationMinutes": 40,
    "assessmentIds": [
      "devices-updates-and-backups-check-1",
      "devices-updates-and-backups-check-2",
      "devices-updates-and-backups-transfer"
    ],
    "familyAction": "Explain how a backup can fail and why a restoration test matters. Never delete originals for practice."
  },
  {
    "id": "cyber-class-11-the-suspicious-login",
    "slug": "the-suspicious-login",
    "title": "The suspicious login",
    "band": "upper",
    "grades": [
      11
    ],
    "strand": "Cybersecurity",
    "summary": "Distinguish an indicator from proof; sequence safe initial actions and escalation.",
    "primaryMechanic": "login-timeline-investigator",
    "openingPattern": "the-suspicious-login-story",
    "completionPattern": "the-suspicious-login-evidence",
    "accent": "mint",
    "durationMinutes": 40,
    "assessmentIds": [
      "the-suspicious-login-check-1",
      "the-suspicious-login-check-2",
      "the-suspicious-login-transfer"
    ],
    "familyAction": "Explain which login details are observations and which are hypotheses. Ask an account owner before taking real action."
  },
  {
    "id": "cyber-class-11-security-design-review",
    "slug": "security-design-review",
    "title": "Security design review",
    "band": "upper",
    "grades": [
      11
    ],
    "strand": "Cybersecurity",
    "summary": "Justify controls under cost and usability constraints; identify residual risk.",
    "primaryMechanic": "security-budget-review",
    "openingPattern": "security-design-review-story",
    "completionPattern": "security-design-review-evidence",
    "accent": "mint",
    "durationMinutes": 40,
    "assessmentIds": [
      "security-design-review-check-1",
      "security-design-review-check-2",
      "security-design-review-transfer"
    ],
    "familyAction": "Explain one control your team chose, its cost and a risk it still cannot remove."
  }
] satisfies CyberLessonMeta[];

export const class11Missions = [...class11SecurityMissions, ...class11AiMissions, ...class11CtMissions, ...class11FraudMissions];
