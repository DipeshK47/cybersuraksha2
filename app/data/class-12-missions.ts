import type { CyberLessonMeta } from "./cyber-lessons";

export const CLASS12_SECURITY_SLUGS = [
  "from-personal-safety-to-system-risk",
  "design-the-college-fest-portal",
  "secure-by-design",
  "protect-the-whole-dependency-chain",
  "when-logs-disagree",
  "the-breach-tabletop",
  "recover-and-learn",
  "security-assurance-review"
] as const;

export const CLASS12_AI_SLUGS = [
  "set-a-decision-and-a-baseline",
  "protect-the-evaluation",
  "the-model-that-scores-95-percent",
  "vision-networks-and-changing-inputs",
  "the-source-grounded-research-assistant",
  "when-instructions-arrive-inside-data",
  "who-benefits-who-is-missed",
  "ai-go-revise-stop-review"
] as const;

export const class12AiMissions = [
  {
    "id": "cyber-class-12-set-a-decision-and-a-baseline",
    "slug": "set-a-decision-and-a-baseline",
    "title": "Set a decision and a baseline",
    "band": "upper",
    "grades": [
      12
    ],
    "strand": "Artificial Intelligence",
    "summary": "Define a measurable AI task, intended users, error costs and a non-AI comparator.",
    "primaryMechanic": "set-a-decision-and-a-baseline-evaluation-lab",
    "openingPattern": "set-a-decision-and-a-baseline-story",
    "completionPattern": "set-a-decision-and-a-baseline-assurance-pack",
    "accent": "sky",
    "durationMinutes": 40,
    "assessmentIds": [
      "set-a-decision-and-a-baseline-check-1",
      "set-a-decision-and-a-baseline-check-2",
      "set-a-decision-and-a-baseline-transfer"
    ],
    "familyAction": "Define a low-stakes decision, a non-AI comparator and error costs before looking at prepared results."
  },
  {
    "id": "cyber-class-12-protect-the-evaluation",
    "slug": "protect-the-evaluation",
    "title": "Protect the evaluation",
    "band": "upper",
    "grades": [
      12
    ],
    "strand": "Artificial Intelligence",
    "summary": "Explain leakage, overfitting and train/validation/test roles; keep final test cases unseen.",
    "primaryMechanic": "protect-the-evaluation-evaluation-lab",
    "openingPattern": "protect-the-evaluation-story",
    "completionPattern": "protect-the-evaluation-assurance-pack",
    "accent": "sky",
    "durationMinutes": 40,
    "assessmentIds": [
      "protect-the-evaluation-check-1",
      "protect-the-evaluation-check-2",
      "protect-the-evaluation-transfer"
    ],
    "familyAction": "Explain why duplicates and related examples must stay together across training, validation and final testing."
  },
  {
    "id": "cyber-class-12-the-model-that-scores-95-percent",
    "slug": "the-model-that-scores-95-percent",
    "title": "The model that scores 95 percent",
    "band": "upper",
    "grades": [
      12
    ],
    "strand": "Artificial Intelligence",
    "summary": "Compute precision and recall from a small confusion table; explain why accuracy can hide missed rare cases.",
    "primaryMechanic": "the-model-that-scores-95-percent-evaluation-lab",
    "openingPattern": "the-model-that-scores-95-percent-story",
    "completionPattern": "the-model-that-scores-95-percent-assurance-pack",
    "accent": "sky",
    "durationMinutes": 40,
    "assessmentIds": [
      "the-model-that-scores-95-percent-check-1",
      "the-model-that-scores-95-percent-check-2",
      "the-model-that-scores-95-percent-transfer"
    ],
    "familyAction": "Compare accuracy, precision, recall and error costs on the same supplied pack. High accuracy can hide missed rare cases."
  },
  {
    "id": "cyber-class-12-vision-networks-and-changing-inputs",
    "slug": "vision-networks-and-changing-inputs",
    "title": "Vision, networks and changing inputs",
    "band": "upper",
    "grades": [
      12
    ],
    "strand": "Artificial Intelligence",
    "summary": "Explain features, layers, training and inference at concept level; observe sensitivity to input changes.",
    "primaryMechanic": "vision-networks-and-changing-inputs-evaluation-lab",
    "openingPattern": "vision-networks-and-changing-inputs-story",
    "completionPattern": "vision-networks-and-changing-inputs-assurance-pack",
    "accent": "sky",
    "durationMinutes": 40,
    "assessmentIds": [
      "vision-networks-and-changing-inputs-check-1",
      "vision-networks-and-changing-inputs-check-2",
      "vision-networks-and-changing-inputs-transfer"
    ],
    "familyAction": "Compare prepared image predictions under lighting and crop changes. State the sample limit and retain human review."
  },
  {
    "id": "cyber-class-12-the-source-grounded-research-assistant",
    "slug": "the-source-grounded-research-assistant",
    "title": "The source-grounded research assistant",
    "band": "upper",
    "grades": [
      12
    ],
    "strand": "Artificial Intelligence",
    "summary": "Explain generation versus retrieval; check whether cited evidence actually supports the answer.",
    "primaryMechanic": "the-source-grounded-research-assistant-evaluation-lab",
    "openingPattern": "the-source-grounded-research-assistant-story",
    "completionPattern": "the-source-grounded-research-assistant-assurance-pack",
    "accent": "sky",
    "durationMinutes": 40,
    "assessmentIds": [
      "the-source-grounded-research-assistant-check-1",
      "the-source-grounded-research-assistant-check-2",
      "the-source-grounded-research-assistant-transfer"
    ],
    "familyAction": "Check whether each cited passage actually supports a supplied answer. Abstain or ask staff when evidence is missing."
  },
  {
    "id": "cyber-class-12-when-instructions-arrive-inside-data",
    "slug": "when-instructions-arrive-inside-data",
    "title": "When instructions arrive inside data",
    "band": "upper",
    "grades": [
      12
    ],
    "strand": "Artificial Intelligence",
    "summary": "Recognise untrusted instructions in retrieved material; protect confidential information and human authority.",
    "primaryMechanic": "when-instructions-arrive-inside-data-evaluation-lab",
    "openingPattern": "when-instructions-arrive-inside-data-story",
    "completionPattern": "when-instructions-arrive-inside-data-assurance-pack",
    "accent": "sky",
    "durationMinutes": 40,
    "assessmentIds": [
      "when-instructions-arrive-inside-data-check-1",
      "when-instructions-arrive-inside-data-check-2",
      "when-instructions-arrive-inside-data-transfer"
    ],
    "familyAction": "Treat instructions inside retrieved documents as untrusted data. Keep private information and decisions within authorised boundaries."
  },
  {
    "id": "cyber-class-12-who-benefits-who-is-missed",
    "slug": "who-benefits-who-is-missed",
    "title": "Who benefits, who is missed?",
    "band": "upper",
    "grades": [
      12
    ],
    "strand": "Artificial Intelligence",
    "summary": "Evaluate group-level errors, accessibility, data rights, attribution and proportionality.",
    "primaryMechanic": "who-benefits-who-is-missed-evaluation-lab",
    "openingPattern": "who-benefits-who-is-missed-story",
    "completionPattern": "who-benefits-who-is-missed-assurance-pack",
    "accent": "sky",
    "durationMinutes": 40,
    "assessmentIds": [
      "who-benefits-who-is-missed-check-1",
      "who-benefits-who-is-missed-check-2",
      "who-benefits-who-is-missed-transfer"
    ],
    "familyAction": "Review group-level errors, accessible alternatives, permitted source use and a clear human override or stop-use condition."
  },
  {
    "id": "cyber-class-12-ai-go-revise-stop-review",
    "slug": "ai-go-revise-stop-review",
    "title": "AI go / revise / stop review",
    "band": "upper",
    "grades": [
      12
    ],
    "strand": "Artificial Intelligence",
    "summary": "Make a deployment recommendation from evidence and disclose uncertainty.",
    "primaryMechanic": "ai-go-revise-stop-review-evaluation-lab",
    "openingPattern": "ai-go-revise-stop-review-story",
    "completionPattern": "ai-go-revise-stop-review-assurance-pack",
    "accent": "sky",
    "durationMinutes": 40,
    "assessmentIds": [
      "ai-go-revise-stop-review-check-1",
      "ai-go-revise-stop-review-check-2",
      "ai-go-revise-stop-review-transfer"
    ],
    "familyAction": "Defend a go, revise or stop recommendation using the evidence pack, baseline and remaining uncertainty."
  }
] satisfies CyberLessonMeta[];

export const CLASS12_CT_SLUGS = [
  "choose-the-right-data-model",
  "how-work-grows-with-input-size",
  "the-duplicate-registration-problem",
  "build-a-reliable-alerts-pipeline",
  "make-failure-visible",
  "do-not-confuse-a-pattern-with-a-cause",
  "retest-after-a-change",
  "automation-design-review"
] as const;

export const class12CtMissions = [
  {
    "id": "cyber-class-12-choose-the-right-data-model",
    "slug": "choose-the-right-data-model",
    "title": "Choose the right data model",
    "band": "upper",
    "grades": [
      12
    ],
    "strand": "Computational Thinking",
    "summary": "Distinguish an ordered list, keyed lookup, stack and queue by the operation needed.",
    "primaryMechanic": "choose-the-right-data-model-reliability-lab",
    "openingPattern": "choose-the-right-data-model-story",
    "completionPattern": "choose-the-right-data-model-regression-record",
    "accent": "violet",
    "durationMinutes": 40,
    "assessmentIds": [
      "choose-the-right-data-model-check-1",
      "choose-the-right-data-model-check-2",
      "choose-the-right-data-model-transfer"
    ],
    "familyAction": "Match an ordered list, keyed lookup, stack and queue to a specific operation; explain one limitation."
  },
  {
    "id": "cyber-class-12-how-work-grows-with-input-size",
    "slug": "how-work-grows-with-input-size",
    "title": "How work grows with input size",
    "band": "upper",
    "grades": [
      12
    ],
    "strand": "Computational Thinking",
    "summary": "Distinguish constant, logarithmic, linear and quadratic growth through counted operations.",
    "primaryMechanic": "how-work-grows-with-input-size-reliability-lab",
    "openingPattern": "how-work-grows-with-input-size-story",
    "completionPattern": "how-work-grows-with-input-size-regression-record",
    "accent": "violet",
    "durationMinutes": 40,
    "assessmentIds": [
      "how-work-grows-with-input-size-check-1",
      "how-work-grows-with-input-size-check-2",
      "how-work-grows-with-input-size-transfer"
    ],
    "familyAction": "Compare counted operations for 8, 16 and 32 synthetic records. State ordering, preparation and counting assumptions."
  },
  {
    "id": "cyber-class-12-the-duplicate-registration-problem",
    "slug": "the-duplicate-registration-problem",
    "title": "The duplicate registration problem",
    "band": "upper",
    "grades": [
      12
    ],
    "strand": "Computational Thinking",
    "summary": "Use stable IDs, relational keys and joins; explain why names alone are unreliable matches.",
    "primaryMechanic": "the-duplicate-registration-problem-reliability-lab",
    "openingPattern": "the-duplicate-registration-problem-story",
    "completionPattern": "the-duplicate-registration-problem-regression-record",
    "accent": "violet",
    "durationMinutes": 40,
    "assessmentIds": [
      "the-duplicate-registration-problem-check-1",
      "the-duplicate-registration-problem-check-2",
      "the-duplicate-registration-problem-transfer"
    ],
    "familyAction": "Reconcile fictional tables by stable ID. Preserve duplicate, conflicting and unmatched records for authorised review."
  },
  {
    "id": "cyber-class-12-build-a-reliable-alerts-pipeline",
    "slug": "build-a-reliable-alerts-pipeline",
    "title": "Build a reliable alerts pipeline",
    "band": "upper",
    "grades": [
      12
    ],
    "strand": "Computational Thinking",
    "summary": "Decompose input, validation, transformation and output; define contracts between steps.",
    "primaryMechanic": "build-a-reliable-alerts-pipeline-reliability-lab",
    "openingPattern": "build-a-reliable-alerts-pipeline-story",
    "completionPattern": "build-a-reliable-alerts-pipeline-regression-record",
    "accent": "violet",
    "durationMinutes": 40,
    "assessmentIds": [
      "build-a-reliable-alerts-pipeline-check-1",
      "build-a-reliable-alerts-pipeline-check-2",
      "build-a-reliable-alerts-pipeline-transfer"
    ],
    "familyAction": "Explain the input, validation, transformation and output contracts of a synthetic alerts pipeline."
  },
  {
    "id": "cyber-class-12-make-failure-visible",
    "slug": "make-failure-visible",
    "title": "Make failure visible",
    "band": "upper",
    "grades": [
      12
    ],
    "strand": "Computational Thinking",
    "summary": "Handle empty input, malformed records, repeated runs and partial failure without silent data loss.",
    "primaryMechanic": "make-failure-visible-reliability-lab",
    "openingPattern": "make-failure-visible-story",
    "completionPattern": "make-failure-visible-regression-record",
    "accent": "violet",
    "durationMinutes": 40,
    "assessmentIds": [
      "make-failure-visible-check-1",
      "make-failure-visible-check-2",
      "make-failure-visible-transfer"
    ],
    "familyAction": "Rehearse quarantine, checkpointed stop and retry without silently dropping records or duplicating output."
  },
  {
    "id": "cyber-class-12-do-not-confuse-a-pattern-with-a-cause",
    "slug": "do-not-confuse-a-pattern-with-a-cause",
    "title": "Do not confuse a pattern with a cause",
    "band": "upper",
    "grades": [
      12
    ],
    "strand": "Computational Thinking",
    "summary": "Check denominators, time windows, missingness and alternative explanations in data summaries.",
    "primaryMechanic": "do-not-confuse-a-pattern-with-a-cause-reliability-lab",
    "openingPattern": "do-not-confuse-a-pattern-with-a-cause-story",
    "completionPattern": "do-not-confuse-a-pattern-with-a-cause-regression-record",
    "accent": "violet",
    "durationMinutes": 40,
    "assessmentIds": [
      "do-not-confuse-a-pattern-with-a-cause-check-1",
      "do-not-confuse-a-pattern-with-a-cause-check-2",
      "do-not-confuse-a-pattern-with-a-cause-transfer"
    ],
    "familyAction": "Compare rates with their denominators and time windows. Keep missing observations unknown and avoid unsupported causal claims."
  },
  {
    "id": "cyber-class-12-retest-after-a-change",
    "slug": "retest-after-a-change",
    "title": "Retest after a change",
    "band": "upper",
    "grades": [
      12
    ],
    "strand": "Computational Thinking",
    "summary": "Use acceptance criteria and regression tests; explain what evidence supports correctness.",
    "primaryMechanic": "retest-after-a-change-reliability-lab",
    "openingPattern": "retest-after-a-change-story",
    "completionPattern": "retest-after-a-change-regression-record",
    "accent": "violet",
    "durationMinutes": 40,
    "assessmentIds": [
      "retest-after-a-change-check-1",
      "retest-after-a-change-check-2",
      "retest-after-a-change-transfer"
    ],
    "familyAction": "Write expected outcomes, add a new category, and run at least eight old and new tests after the change."
  },
  {
    "id": "cyber-class-12-automation-design-review",
    "slug": "automation-design-review",
    "title": "Automation design review",
    "band": "upper",
    "grades": [
      12
    ],
    "strand": "Computational Thinking",
    "summary": "Compare two designs on correctness, efficiency, maintainability and human oversight.",
    "primaryMechanic": "automation-design-review-reliability-lab",
    "openingPattern": "automation-design-review-story",
    "completionPattern": "automation-design-review-regression-record",
    "accent": "violet",
    "durationMinutes": 40,
    "assessmentIds": [
      "automation-design-review-check-1",
      "automation-design-review-check-2",
      "automation-design-review-transfer"
    ],
    "familyAction": "Defend correctness, efficiency, maintainability and human authority using a larger input and a changed rule."
  }
] satisfies CyberLessonMeta[];

export const CLASS12_FRAUD_SLUGS = [
  "the-easy-money-recruitment-chain",
  "check-the-investment-story",
  "identity-and-authority-can-be-manufactured",
  "help-after-harm",
  "trace-a-pattern-without-accusing",
  "design-prevention-that-can-be-tested",
  "integrated-case-the-college-fest-incident",
  "the-evidence-hearing"
] as const;

export const class12FraudMissions = [
  {
    "id": "cyber-class-12-the-easy-money-recruitment-chain",
    "slug": "the-easy-money-recruitment-chain",
    "title": "The easy-money recruitment chain",
    "band": "upper",
    "grades": [
      12
    ],
    "strand": "Cyber Fraud",
    "summary": "Recognise staged task payments, account renting and money-mule recruitment; explain why passing money onward can create serious risk.",
    "primaryMechanic": "the-easy-money-recruitment-chain-casework-lab",
    "openingPattern": "the-easy-money-recruitment-chain-story",
    "completionPattern": "the-easy-money-recruitment-chain-evidence-dossier",
    "accent": "coral",
    "durationMinutes": 40,
    "assessmentIds": [
      "the-easy-money-recruitment-chain-check-1",
      "the-easy-money-recruitment-chain-check-2",
      "the-easy-money-recruitment-chain-transfer"
    ],
    "familyAction": "Map a fictional staged-task and account-use request. Practise declining, preserving evidence and seeking trusted adult/bank help."
  },
  {
    "id": "cyber-class-12-check-the-investment-story",
    "slug": "check-the-investment-story",
    "title": "Check the investment story",
    "band": "upper",
    "grades": [
      12
    ],
    "strand": "Cyber Fraud",
    "summary": "Evaluate guaranteed-return claims, fake endorsements, unverified apps and requests for extra release fees.",
    "primaryMechanic": "check-the-investment-story-casework-lab",
    "openingPattern": "check-the-investment-story-story",
    "completionPattern": "check-the-investment-story-evidence-dossier",
    "accent": "coral",
    "durationMinutes": 40,
    "assessmentIds": [
      "check-the-investment-story-check-1",
      "check-the-investment-story-check-2",
      "check-the-investment-story-transfer"
    ],
    "familyAction": "Compare an investment claim with an independently supplied source. Verification is not a guarantee of safety or returns."
  },
  {
    "id": "cyber-class-12-identity-and-authority-can-be-manufactured",
    "slug": "identity-and-authority-can-be-manufactured",
    "title": "Identity and authority can be manufactured",
    "band": "upper",
    "grades": [
      12
    ],
    "strand": "Cyber Fraud",
    "summary": "Recognise cloned profiles, deepfake endorsements and intimidating authority claims; verify outside the suspicious channel.",
    "primaryMechanic": "identity-and-authority-can-be-manufactured-casework-lab",
    "openingPattern": "identity-and-authority-can-be-manufactured-story",
    "completionPattern": "identity-and-authority-can-be-manufactured-evidence-dossier",
    "accent": "coral",
    "durationMinutes": 40,
    "assessmentIds": [
      "identity-and-authority-can-be-manufactured-check-1",
      "identity-and-authority-can-be-manufactured-check-2",
      "identity-and-authority-can-be-manufactured-transfer"
    ],
    "familyAction": "Verify a claimed identity through previously known independent channels; familiar voices, profiles and endorsements are insufficient."
  },
  {
    "id": "cyber-class-12-help-after-harm",
    "slug": "help-after-harm",
    "title": "Help after harm",
    "band": "upper",
    "grades": [
      12
    ],
    "strand": "Cyber Fraud",
    "summary": "Preserve relevant evidence, avoid forwarding harmful content and support a victim without blame.",
    "primaryMechanic": "help-after-harm-casework-lab",
    "openingPattern": "help-after-harm-story",
    "completionPattern": "help-after-harm-evidence-dossier",
    "accent": "coral",
    "durationMinutes": 40,
    "assessmentIds": [
      "help-after-harm-check-1",
      "help-after-harm-check-2",
      "help-after-harm-transfer"
    ],
    "familyAction": "Practise supportive help, restricted evidence preservation and prompt bank/official reporting for a real financial cyber-fraud incident."
  },
  {
    "id": "cyber-class-12-trace-a-pattern-without-accusing",
    "slug": "trace-a-pattern-without-accusing",
    "title": "Trace a pattern without accusing",
    "band": "upper",
    "grades": [
      12
    ],
    "strand": "Cyber Fraud",
    "summary": "Analyse a small fictional transaction network; distinguish an anomaly from proof of wrongdoing.",
    "primaryMechanic": "trace-a-pattern-without-accusing-casework-lab",
    "openingPattern": "trace-a-pattern-without-accusing-story",
    "completionPattern": "trace-a-pattern-without-accusing-evidence-dossier",
    "accent": "coral",
    "durationMinutes": 40,
    "assessmentIds": [
      "trace-a-pattern-without-accusing-check-1",
      "trace-a-pattern-without-accusing-check-2",
      "trace-a-pattern-without-accusing-transfer"
    ],
    "familyAction": "Trace a synthetic payment pattern and test an innocent explanation. A flag is never an allegation or proof of intent."
  },
  {
    "id": "cyber-class-12-design-prevention-that-can-be-tested",
    "slug": "design-prevention-that-can-be-tested",
    "title": "Design prevention that can be tested",
    "band": "upper",
    "grades": [
      12
    ],
    "strand": "Cyber Fraud",
    "summary": "Match a control to a failure mode; evaluate whether another learner can use it under pressure.",
    "primaryMechanic": "design-prevention-that-can-be-tested-casework-lab",
    "openingPattern": "design-prevention-that-can-be-tested-story",
    "completionPattern": "design-prevention-that-can-be-tested-evidence-dossier",
    "accent": "coral",
    "durationMinutes": 40,
    "assessmentIds": [
      "design-prevention-that-can-be-tested-check-1",
      "design-prevention-that-can-be-tested-check-2",
      "design-prevention-that-can-be-tested-transfer"
    ],
    "familyAction": "Test a practical verification aid against two fictional cases and keep a before/after revision log."
  },
  {
    "id": "cyber-class-12-integrated-case-the-college-fest-incident",
    "slug": "integrated-case-the-college-fest-incident",
    "title": "Integrated case: the college-fest incident",
    "band": "upper",
    "grades": [
      12
    ],
    "strand": "Cyber Fraud",
    "summary": "Combine system risk, AI evaluation, algorithmic checks and fraud response in one changing case.",
    "primaryMechanic": "integrated-case-the-college-fest-incident-casework-lab",
    "openingPattern": "integrated-case-the-college-fest-incident-story",
    "completionPattern": "integrated-case-the-college-fest-incident-evidence-dossier",
    "accent": "coral",
    "durationMinutes": 40,
    "assessmentIds": [
      "integrated-case-the-college-fest-incident-check-1",
      "integrated-case-the-college-fest-incident-check-2",
      "integrated-case-the-college-fest-incident-transfer"
    ],
    "familyAction": "Combine four module records, name responsible roles and revise only conclusions supported by new evidence."
  },
  {
    "id": "cyber-class-12-the-evidence-hearing",
    "slug": "the-evidence-hearing",
    "title": "The evidence hearing",
    "band": "upper",
    "grades": [
      12
    ],
    "strand": "Cyber Fraud",
    "summary": "Defend the response, acknowledge uncertainty and transfer learning to a fresh case.",
    "primaryMechanic": "the-evidence-hearing-casework-lab",
    "openingPattern": "the-evidence-hearing-story",
    "completionPattern": "the-evidence-hearing-evidence-dossier",
    "accent": "coral",
    "durationMinutes": 40,
    "assessmentIds": [
      "the-evidence-hearing-check-1",
      "the-evidence-hearing-check-2",
      "the-evidence-hearing-transfer"
    ],
    "familyAction": "Give a concise evidence-led briefing and an individual decision, reflection and improvement plan without blaming a victim."
  }
] satisfies CyberLessonMeta[];

export const CLASS12_LESSON_SLUGS = [...CLASS12_SECURITY_SLUGS, ...CLASS12_AI_SLUGS, ...CLASS12_CT_SLUGS, ...CLASS12_FRAUD_SLUGS] as const;

export const class12SecurityMissions = [
  {
    "id": "cyber-class-12-from-personal-safety-to-system-risk",
    "slug": "from-personal-safety-to-system-risk",
    "title": "From personal safety to system risk",
    "band": "upper",
    "grades": [
      12
    ],
    "strand": "Cybersecurity",
    "summary": "Apply Class XI concepts to a multi-user service; explain risk ownership and priorities.",
    "primaryMechanic": "from-personal-safety-to-system-risk-system-lab",
    "openingPattern": "from-personal-safety-to-system-risk-story",
    "completionPattern": "from-personal-safety-to-system-risk-assurance-record",
    "accent": "mint",
    "durationMinutes": 40,
    "assessmentIds": [
      "from-personal-safety-to-system-risk-check-1",
      "from-personal-safety-to-system-risk-check-2",
      "from-personal-safety-to-system-risk-transfer"
    ],
    "familyAction": "Sketch a fictional service and mark who owns each risk. Use only synthetic accounts and records."
  },
  {
    "id": "cyber-class-12-design-the-college-fest-portal",
    "slug": "design-the-college-fest-portal",
    "title": "Design the college-fest portal",
    "band": "upper",
    "grades": [
      12
    ],
    "strand": "Cybersecurity",
    "summary": "Explain client/server roles, databases, DNS and HTTPS at concept level; identify points where trust changes.",
    "primaryMechanic": "design-the-college-fest-portal-system-lab",
    "openingPattern": "design-the-college-fest-portal-story",
    "completionPattern": "design-the-college-fest-portal-assurance-record",
    "accent": "mint",
    "durationMinutes": 40,
    "assessmentIds": [
      "design-the-college-fest-portal-check-1",
      "design-the-college-fest-portal-check-2",
      "design-the-college-fest-portal-transfer"
    ],
    "familyAction": "Explain where a browser, server and data store change trust. A browser-side check alone is insufficient."
  },
  {
    "id": "cyber-class-12-secure-by-design",
    "slug": "secure-by-design",
    "title": "Secure by design",
    "band": "upper",
    "grades": [
      12
    ],
    "strand": "Cybersecurity",
    "summary": "Distinguish input validation, authorisation and safe data access; connect each to a misuse case.",
    "primaryMechanic": "secure-by-design-system-lab",
    "openingPattern": "secure-by-design-story",
    "completionPattern": "secure-by-design-assurance-record",
    "accent": "mint",
    "durationMinutes": 40,
    "assessmentIds": [
      "secure-by-design-check-1",
      "secure-by-design-check-2",
      "secure-by-design-transfer"
    ],
    "familyAction": "Compare validation, authorisation and safe data access using the offline toy request pack, not a real service."
  },
  {
    "id": "cyber-class-12-protect-the-whole-dependency-chain",
    "slug": "protect-the-whole-dependency-chain",
    "title": "Protect the whole dependency chain",
    "band": "upper",
    "grades": [
      12
    ],
    "strand": "Cybersecurity",
    "summary": "Assess third-party access, software updates, shared secrets and recovery dependencies.",
    "primaryMechanic": "protect-the-whole-dependency-chain-system-lab",
    "openingPattern": "protect-the-whole-dependency-chain-story",
    "completionPattern": "protect-the-whole-dependency-chain-assurance-record",
    "accent": "mint",
    "durationMinutes": 40,
    "assessmentIds": [
      "protect-the-whole-dependency-chain-check-1",
      "protect-the-whole-dependency-chain-check-2",
      "protect-the-whole-dependency-chain-transfer"
    ],
    "familyAction": "Discuss a supplier’s minimum access, secret rotation and independent recovery route within an explicit budget."
  },
  {
    "id": "cyber-class-12-when-logs-disagree",
    "slug": "when-logs-disagree",
    "title": "When logs disagree",
    "band": "upper",
    "grades": [
      12
    ],
    "strand": "Cybersecurity",
    "summary": "Correlate supplied events; distinguish a hypothesis, indicator and established fact.",
    "primaryMechanic": "when-logs-disagree-system-lab",
    "openingPattern": "when-logs-disagree-story",
    "completionPattern": "when-logs-disagree-assurance-record",
    "accent": "mint",
    "durationMinutes": 40,
    "assessmentIds": [
      "when-logs-disagree-check-1",
      "when-logs-disagree-check-2",
      "when-logs-disagree-transfer"
    ],
    "familyAction": "Separate an observed event, a hypothesis and missing evidence. A log entry alone does not establish who acted."
  },
  {
    "id": "cyber-class-12-the-breach-tabletop",
    "slug": "the-breach-tabletop",
    "title": "The breach tabletop",
    "band": "upper",
    "grades": [
      12
    ],
    "strand": "Cybersecurity",
    "summary": "Allocate roles and sequence containment, communication and escalation.",
    "primaryMechanic": "the-breach-tabletop-system-lab",
    "openingPattern": "the-breach-tabletop-story",
    "completionPattern": "the-breach-tabletop-assurance-record",
    "accent": "mint",
    "durationMinutes": 40,
    "assessmentIds": [
      "the-breach-tabletop-check-1",
      "the-breach-tabletop-check-2",
      "the-breach-tabletop-transfer"
    ],
    "familyAction": "Rehearse an authorised incident response with roles, preserved evidence and factual communication; do not accuse a person."
  },
  {
    "id": "cyber-class-12-recover-and-learn",
    "slug": "recover-and-learn",
    "title": "Recover and learn",
    "band": "upper",
    "grades": [
      12
    ],
    "strand": "Cybersecurity",
    "summary": "Define a recovery objective, choose a clean restoration point and verify service behaviour.",
    "primaryMechanic": "recover-and-learn-system-lab",
    "openingPattern": "recover-and-learn-story",
    "completionPattern": "recover-and-learn-assurance-record",
    "accent": "mint",
    "durationMinutes": 40,
    "assessmentIds": [
      "recover-and-learn-check-1",
      "recover-and-learn-check-2",
      "recover-and-learn-transfer"
    ],
    "familyAction": "Explain a clean restoration point, the exercise recovery objectives and access/completeness checks before reopening."
  },
  {
    "id": "cyber-class-12-security-assurance-review",
    "slug": "security-assurance-review",
    "title": "Security assurance review",
    "band": "upper",
    "grades": [
      12
    ],
    "strand": "Cybersecurity",
    "summary": "Balance security, privacy, cost and usability; explain residual risk and ownership.",
    "primaryMechanic": "security-assurance-review-system-lab",
    "openingPattern": "security-assurance-review-story",
    "completionPattern": "security-assurance-review-assurance-record",
    "accent": "mint",
    "durationMinutes": 40,
    "assessmentIds": [
      "security-assurance-review-check-1",
      "security-assurance-review-check-2",
      "security-assurance-review-transfer"
    ],
    "familyAction": "Defend a proportionate control, remaining risk and responsible owner against a changed fictional scenario."
  }
] satisfies CyberLessonMeta[];

export const class12Missions = [...class12SecurityMissions, ...class12AiMissions, ...class12CtMissions, ...class12FraudMissions];
