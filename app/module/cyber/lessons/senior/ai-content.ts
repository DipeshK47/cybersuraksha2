export const approachTasks = [
  { label: "Calculate an exact ticket bill from fixed prices", answer: "Explicit rule", why: "The prices and arithmetic define the answer; a generated estimate is unnecessary." },
  { label: "Suggest a material category from a sample image", answer: "Learned prediction", why: "An image classifier can learn patterns from labelled examples, with errors and a review path." },
  { label: "Draft a friendly volunteer message for a person to check", answer: "Generated response", why: "Drafting creates new text; a person still checks the facts and final wording." },
];
export const briefFields = [
  { label: "User", answer: "Festival volunteers", why: "The brief names who will use the helper." },
  { label: "Input", answer: "Practice sample image", why: "The helper receives a supplied fictional sample image, not personal student records." },
  { label: "Output", answer: "Material label or review", why: "The system needs an explicit output and an uncertain-case path." },
  { label: "Success evidence", answer: "Fixed held-out results", why: "A test defined before inspecting results is more informative than a polished demonstration." },
  { label: "Human role", answer: "Review unfamiliar samples", why: "A person remains responsible for cases outside the experiment's coverage." },
];
export const reviewRoutes = [
  { label: "Familiar clean sample within the exercise scope", answer: "Suggest and allow review", why: "This is a low-stakes suggestion with a human able to check it." },
  { label: "Damaged sample unlike the training examples", answer: "Request human review", why: "An unfamiliar input should not be forced into a known category." },
  { label: "Request to identify a student from the sample photo", answer: "Outside the task", why: "The stated task concerns practice materials, not identifying people." },
];
export const repairRows = [
  { id: "S1", observation: "Supplied description: a paper sheet", original: "Metal", answer: "Paper", why: "The supplied observation supports Paper, not Metal." },
  { id: "S2", observation: "Supplied description: a metal can", original: "Metal", answer: "Metal", why: "This label already agrees with its supplied observation." },
  { id: "S3", observation: "Material observation is missing; original unavailable", original: "Paper", answer: "Quarantine", why: "The missing observation cannot justify a guessed label." },
  { id: "S4", observation: "Supplied description: a plastic bottle", original: "Plastic", answer: "Plastic", why: "The supplied observation supports Plastic." },
];
export const duplicateRows = [
  { label: "S1 repeated with the identical observation and source record", answer: "Remove proven duplicate", why: "This repeats the same record and would otherwise count one example twice." },
  { label: "S8: a separate paper sample with its own source record", answer: "Keep separate sample", why: "Two similar objects are not automatically duplicate records." },
  { label: "S9: the same ID has conflicting source observations", answer: "Quarantine conflict", why: "Conflicting observations need investigation; do not silently choose one." },
];
export const learningMethods = [
  { label: "Learn Paper/Metal labels from labelled examples", answer: "Supervised classification", why: "Classification learns a category prediction using supplied labels." },
  { label: "Group similar examples without supplied group labels", answer: "Clustering", why: "Clustering groups examples by similarity without provided group labels." },
  { label: "Predict a numerical queue length from past measurements", answer: "Regression", why: "Regression predicts a numerical value rather than a category." },
];
export type Example = { id: string; x: number; y: number; label: string };
// The features and labels are invented classroom coordinates, not a material detector.
export const trainingExamples: Example[] = [
  { id: "P1", x: 1, y: 2, label: "Paper" },
  { id: "P2", x: 2, y: 1, label: "Paper" },
  { id: "M1", x: 8, y: 7, label: "Metal" },
  { id: "M2", x: 9, y: 8, label: "Metal" },
];
export const heldOutExamples: Example[] = [
  { id: "T1", x: 3, y: 2, label: "Paper" },
  { id: "T2", x: 7, y: 8, label: "Metal" },
  { id: "T3", x: 4, y: 5, label: "Paper" },
];

export function nearestPrediction(training: Example[], sample: { x: number; y: number }): string | null {
  if (!training.length) return null;
  const distances = training.map(example => ({ label: example.label, distance: Math.abs(example.x - sample.x) + Math.abs(example.y - sample.y) }));
  const minimum = Math.min(...distances.map(example => example.distance));
  const labels = new Set(distances.filter(example => example.distance === minimum).map(example => example.label));
  return labels.size === 1 ? [...labels][0] : null;
}

export const evaluationRows = [
  { id: "E1", actual: "Recycle", predicted: "Recycle" },
  { id: "E2", actual: "Recycle", predicted: "Recycle" },
  { id: "E3", actual: "Recycle", predicted: "Residual" },
  { id: "E4", actual: "Recycle", predicted: "Recycle" },
  { id: "E5", actual: "Recycle", predicted: "Recycle" },
  { id: "E6", actual: "Residual", predicted: "Residual" },
  { id: "E7", actual: "Residual", predicted: "Residual" },
  { id: "E8", actual: "Residual", predicted: "Recycle" },
];
export function comparison(rows: { actual: string; predicted: string }[], baseline: string) {
  return { total: rows.length, modelCorrect: rows.filter(row => row.actual === row.predicted).length, baselineCorrect: rows.filter(row => row.actual === baseline).length };
}
export const groupResults = [{ name: "Bright", total: 8, correct: 7 }, { name: "Dim", total: 8, correct: 3 }];

export const sourcePack = [
  { id: "F1", title: "Fictional volunteer memo", text: "Festival volunteers meet Friday at 15:30 in Room B. The organising teacher confirms changes." },
  { id: "F2", title: "Fictional practice safety note", text: "Glass collection is adult-led. Student volunteers do not handle glass in this exercise." },
  { id: "F3", title: "Fictional trial log", text: "Clean paper and plastic practice samples were separated. No percentage reduction in total waste was measured." },
];
export const assistantClaims = [
  { label: "Volunteers meet Friday at 15:30 in Room B [F1]", answer: "Supported", why: "F1 explicitly states the meeting information." },
  { label: "Student volunteers should sort glass themselves [F2]", answer: "Contradicted", why: "F2 specifies adult-led collection and excludes student glass handling in this exercise." },
  { label: "The trial reduced total festival waste by 90% [F3]", answer: "Not established", why: "F3 contains no such measurement. A source label does not establish the claim." },
];
export const instructionControls = [
  { id: "sources", label: "Use only the supplied source pack and cite relevant passages", good: true, why: "The answer must be traceable to the supplied evidence." },
  { id: "abstain", label: "Say when the source pack does not establish an answer", good: true, why: "Missing evidence should remain visible instead of being replaced with a guess." },
  { id: "privacy", label: "Use fictional details and keep personal records out of the prompt", good: true, why: "The classroom task does not require actual student information." },
  { id: "invent", label: "Invent a persuasive statistic if the sources are incomplete", good: false, why: "An invented statistic is not evidence, even if the prose sounds convincing." },
];
export const dossierControls = [
  { id: "purpose", label: "Intended user, input, output and human review point", good: true, why: "Evaluation needs a defined purpose and human authority." },
  { id: "data", label: "Data-quality log and missing-condition limitations", good: true, why: "A decision must acknowledge data quality and coverage." },
  { id: "results", label: "Baseline and model results on the same held-out pack", good: true, why: "The comparison must use the same examples and denominator." },
  { id: "groups", label: "Group-level errors, mitigation and stop-use condition", good: true, why: "The overall score does not explain uneven errors or changed conditions." },
  { id: "confidence", label: "Replace the results with the assistant's confident recommendation", good: false, why: "A recommendation cannot replace the evidence that should support it." },
];

export const aiPractice = {
  "is-ai-needed-here": { brief: "Choose rules, learned predictions or generated drafts from the task. Exact arithmetic and verified lookups can be sufficient. Generated language still needs evidence.", prompts: ["Choose an approach for three festival tasks.", "Run the stated ticket-bill rule and explain why it fits.", "A policy question is absent from the source pack. Choose the next action."] },
  "frame-a-useful-ai-problem": { brief: "Define user, input, output, measurable success and human review before collecting data. This is a low-stakes experiment using fictional samples.", prompts: ["Build a testable brief for the sample-sorting helper.", "Decide where the helper must defer to a person.", "Turn a vague promise into an acceptance criterion."] },
  "repair-the-dataset": { brief: "Use supplied observations to justify corrections. Keep unknowns visible, distinguish duplicates from similar samples and record limitations.", prompts: ["Repair the labels without inventing missing observations.", "Decide what to do with duplicate and conflicting records.", "Write a defensible data-card decision for a bright-only collection."] },
  "how-a-model-learns": { brief: "Training examples shape predictions; held-out examples evaluate them. This tiny nearest-example classifier uses invented numerical features and is not a real material detector.", prompts: ["Match learning tasks to their methods.", "Change the training selection, then commit held-out predictions before revealing labels.", "Protect an independent test when a new example arrives."] },
  "measure-mistakes-not-confidence": { brief: "Compare the model and baseline on the same held-out examples. Count mistakes and keep any performance claim within the evidence.", prompts: ["Count correct model and majority-baseline predictions on this pack.", "Identify the exact model mistakes.", "Choose the performance claim supported by a small fixed test."] },
  "whose-examples-are-missing": { brief: "Inspect coverage and group-level errors. A proxy is a stand-in feature; an error difference alone does not prove a cause. Plan representative evaluation and human review.", prompts: ["Calculate errors in bright and dim conditions.", "Inspect a controlled background change for a possible proxy.", "Choose a collection and fallback plan for missing conditions."] },
  "can-this-assistant-be-trusted": { brief: "Check the actual source passage, not citation-shaped text. Distinguish supported, contradicted and unestablished claims. The source pack is fictional.", prompts: ["Audit the assistant's claims against the fixed source pack.", "Improve the task instruction without adding personal records.", "Build a corrected response with matching source references."] },
  "ai-evaluation-review": { brief: "Decide use, revise or stop from a task brief, data limits, baseline, held-out results, group errors and human oversight. Disclose assistance; teacher review assesses your independent explanation.", prompts: ["Assemble the evaluation dossier from evidence.", "Recommend what to do with this limited prototype.", "The festival moves to an untested evening setting. Defend a revised decision."] },
};

export const aiStoryTasks = [
  { title: "Asha chooses the right tool", concepts: ["Rule: explicit steps for an exact task", "Prediction: patterns learned from examples", "Generation: a draft that needs checking"], question: "Three tickets cost ₹20 each, with no discount. Which approach fits the exact total?", choices: ["A generated guess", "The stated multiplication rule", "A model trained on other events"], answer: 1, why: "The known prices and quantity define an exact arithmetic rule. A generated guess or trained estimate adds no value here." },
  { title: "Kabir writes the experiment brief", concepts: ["Define the user, input and output", "Specify success before looking at results", "Keep a human review route for unfamiliar cases"], question: "An unfamiliar sample is outside the training coverage. What should the prototype do?", choices: ["Force a confident material label", "Identify the student who brought it", "Flag it for human review"], answer: 2, why: "The low-stakes prototype needs a review path for unfamiliar samples; identity recognition is outside its purpose." },
  { title: "Asha finds the hidden data faults", concepts: ["Correct only what observations support", "A repeated record is different from a similar sample", "Quarantine missing evidence instead of inventing values"], question: "A material observation is missing and the original sample is unavailable. What should happen?", choices: ["Quarantine it for review", "Guess the most common material", "Copy the label from a nearby row"], answer: 0, why: "No supplied observation supports a label. Keep the uncertainty visible and seek evidence before training on it." },
  { title: "Kabir trains a tiny predictor", concepts: ["Classification predicts categories", "Training labels shape the predictor", "Held-out labels remain outside training"], question: "Should the team copy revealed test labels into training before reporting that same test score?", choices: ["Yes: any higher score is progress", "No: preserve an independent held-out check", "Yes: the interface still calls it a test"], answer: 1, why: "Using the test answers to improve the predictor compromises the independence of that evaluation." },
  { title: "Asha checks the scoreboard", concepts: ["Use the same examples for both approaches", "Count correct and incorrect predictions", "A small sample supports a limited claim"], question: "The model gets 6/8 and the baseline 5/8 on the same pack. Which claim follows?", choices: ["The model is universally 75% accurate", "The baseline can never be useful", "The model got one more correct on this small pack"], answer: 2, why: "These counts describe the supplied test only; they do not establish performance on every future input." },
  { title: "Kabir notices the missing conditions", concepts: ["Bright: 7/8 correct; dim: 3/8 correct", "Coverage and proxies deserve investigation", "A difference does not establish its sole cause"], question: "What does the bright/dim comparison establish?", choices: ["The model missed more of the supplied dim examples", "Lighting alone caused every mistake", "Every dim image will fail"], answer: 0, why: "The group counts show more errors in these dim examples; a small comparison does not prove a universal rule or sole cause." },
  { title: "Asha verifies the assistant's sources", concepts: ["Read the actual source passage", "A source label can accompany a false claim", "Remove unsupported claims and attribute corrections"], question: "No source measures waste reduction. What should happen to an invented 90% claim?", choices: ["Keep it because it sounds plausible", "Remove it and state the evidence is absent", "Add a citation label without checking"], answer: 1, why: "A plausible statistic is still unsupported. State what was not measured instead of inventing a result." },
  { title: "The team defends its AI decision", concepts: ["A dossier links purpose, data and results", "Overall improvement can hide uneven errors", "Changed conditions need fresh evidence"], question: "Dim-condition performance is weak and no human fallback exists. What should happen before wider use?", choices: ["Deploy automatically because the average improved", "Hide the dim-condition results", "Revise the data and review plan, then test again"], answer: 2, why: "Address the known failure and human review gap before wider use; preserve the original evidence and evaluate changes independently." },
];
