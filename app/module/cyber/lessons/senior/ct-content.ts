export type Applicant = { id: string; score: number | null; documents: boolean | null };
export type Outcome = "Eligible" | "Not eligible" | "Needs documents" | "Review missing data" | "Invalid record" | "Duplicate ID";
export const outcomeOptions: Outcome[] = ["Eligible", "Not eligible", "Needs documents", "Review missing data", "Invalid record", "Duplicate ID"];

// These are invented exercise rules; real scholarship decisions remain with the teacher.
export function evaluateApplicant(record: Applicant, threshold = 60, inclusive = true, join: "AND" | "OR" = "AND"): Outcome {
  if (!/^[A-Z]\d{2}$/.test(record.id.trim()) || !Number.isFinite(threshold) || threshold < 0 || threshold > 100) return "Invalid record";
  if (record.score === null || record.documents === null) return "Review missing data";
  if (!Number.isFinite(record.score) || record.score < 0 || record.score > 100) return "Invalid record";
  const scorePasses = inclusive ? record.score >= threshold : record.score > threshold;
  if (join === "AND" ? scorePasses && record.documents : scorePasses || record.documents) return "Eligible";
  return scorePasses ? "Needs documents" : "Not eligible";
}

export function evaluateBatch(records: Applicant[], threshold = 60, inclusive = true): { id: string; outcome: Outcome }[] {
  const counts = new Map<string, number>();
  for (const record of records) counts.set(record.id.trim(), (counts.get(record.id.trim()) ?? 0) + 1);
  return records.map(record => ({ id: record.id, outcome: counts.get(record.id.trim())! > 1 ? "Duplicate ID" : evaluateApplicant(record, threshold, inclusive) }));
}

export const applicants: Applicant[] = [
  { id: "A10", score: 72, documents: true },
  { id: "B20", score: 60, documents: true },
  { id: "C30", score: 59, documents: true },
  { id: "D40", score: 65, documents: false },
];
export const processSteps = ["Intake the synthetic enquiry record", "Check the stated exercise rules and missing-data routes", "Send the result to the responsible teacher for review", "Communicate the reviewed outcome"];
export const decompositionFacts = [
  { label: "The supplied record has score 60 and complete documents", answer: "Supplied fact", why: "These values are explicitly supplied by the exercise." },
  { label: "Every future enquiry will have complete documents", answer: "Assumption to challenge", why: "No supplied evidence guarantees that future documents will be complete." },
  { label: "Real award decisions remain with the responsible teacher", answer: "Scope constraint", why: "The exercise limits automation to checks and handoffs." },
];
export const scopeControls = [
  { id: "intake", label: "Collect only the synthetic fields needed for the enquiry", good: true, why: "The workflow needs a defined minimal input." },
  { id: "routes", label: "Make incomplete and invalid-data routes explicit", good: true, why: "Incomplete data is a subproblem, not an excuse to guess." },
  { id: "teacher", label: "Keep final award decisions with the responsible teacher", good: true, why: "The program implements a fictional check, not a real award decision." },
  { id: "award", label: "Automatically award real money from the exercise result", good: false, why: "Real awards and payments are outside this fictional enquiry task." },
];
export const modelControls = [
  { id: "id", label: "Stable applicant ID", good: true, why: "A unique stable identifier supports record lookup and duplicate checks." },
  { id: "score", label: "Practice score and its validation rule", good: true, why: "The stated exercise uses a score from 0 to 100." },
  { id: "documents", label: "Document status: complete, incomplete or unknown", good: true, why: "Unknown must stay distinct from a confirmed incomplete state." },
  { id: "address", label: "Home address and bank account details", good: false, why: "The fictional rule does not require these personal fields." },
];
export const structures = [
  { label: "Fields describing one applicant", answer: "Record", why: "One record groups the fields belonging to one applicant." },
  { label: "Several applicant records to process in sequence", answer: "List", why: "A list holds the records the workflow will visit." },
  { label: "Retrieve one unique record by stable applicant ID", answer: "Keyed lookup", why: "The ID is a key; duplicate IDs must be resolved before a unique lookup is trusted." },
];
export const modelValidation = [
  { label: "A10 appears twice with conflicting score values", answer: "Flag duplicate ID", why: "Preserve the conflict instead of silently overwriting one value." },
  { label: "A supplied score is 104 on a 0–100 scale", answer: "Reject invalid value", why: "The value is outside the defined range." },
  { label: "The score field is absent", answer: "Review missing data", why: "An absent score is not zero and must stay visible." },
  { label: "Documents are explicitly incomplete", answer: "Keep false distinct from unknown", why: "A confirmed false flag contains information; it is not a missing value." },
];
export const ruleSteps = ["Validate the ID, score range and document flag", "Return a review or invalid route for missing or invalid data", "If score is below 60, return Not eligible", "Otherwise return Eligible for complete documents, or Needs documents"];
export const errorKinds = [
  { label: "The written comparison uses => where this pseudocode requires >=", answer: "Syntax-like error", why: "The notation is not the comparison operator specified by this pseudocode." },
  { label: "The code runs but uses score > 60 for an at-least-60 rule", answer: "Logic error", why: "The notation can run but excludes the intended boundary value." },
  { label: "A failing boundary example is rerun after the correction", answer: "Test evidence", why: "The rerun checks the repair rather than merely changing the text." },
];

export function loopTrace(values: number[], includesLength: boolean) {
  return Array.from({ length: values.length + (includesLength ? 1 : 0) }, (_, index) => ({ index, value: index < values.length ? values[index] : null, error: index >= values.length }));
}
export const searchValues = [40, 10, 70, 20, 60, 30, 50];
export function linearTrace(values: number[], target: number) {
  const indices: number[] = [];
  for (let index = 0; index < values.length; index++) {
    indices.push(index);
    if (values[index] === target) return { indices, foundIndex: index };
  }
  return { indices, foundIndex: -1 };
}
export function binaryTrace(values: number[], target: number) {
  if (values.some((value, index) => index > 0 && value < values[index - 1])) return { sorted: false, indices: [] as number[], foundIndex: -1 };
  const indices: number[] = [];
  let low = 0;
  let high = values.length - 1;
  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    indices.push(middle);
    if (values[middle] === target) return { sorted: true, indices, foundIndex: middle };
    if (values[middle] < target) low = middle + 1;
    else high = middle - 1;
  }
  return { sorted: true, indices, foundIndex: -1 };
}
export const searchChoices = [
  { label: "One enquiry in a tiny unsorted list; no existing index", answer: "Linear search can avoid sorting", why: "Sorting preparation may outweigh the benefit for one small lookup." },
  { label: "Many lookups in an already sorted ID list", answer: "Binary search fits the precondition", why: "Sorted order already exists and repeated lookups can benefit from narrowing the range." },
  { label: "Compare 5 linear checks with 2 binary checks", answer: "State that sorting cost is excluded", why: "Lookup counts alone do not include preparing the sorted list." },
];
export const functionContract = [
  { label: "Input", answer: "One synthetic applicant record", why: "The shared function receives the defined record fields." },
  { label: "Output", answer: "An explicit check or review outcome", why: "Every path needs an outcome the caller can handle." },
  { label: "Validation", answer: "ID format, score range, missing fields", why: "Reusing code must retain validation and missing-data handling." },
  { label: "Caller responsibility", answer: "Use the same check and keep teacher review", why: "The interface should not maintain a conflicting copy of the rule or turn a check into a real award." },
];

export type TestCase = { id: string; description: string; records: Applicant[]; expected: string };
export const testCases: TestCase[] = [
  { id: "T1", description: "Ordinary: A10, score 72, complete", records: [{ id: "A10", score: 72, documents: true }], expected: "Eligible" },
  { id: "T2", description: "Boundary: B20, score exactly 60, complete", records: [{ id: "B20", score: 60, documents: true }], expected: "Eligible" },
  { id: "T3", description: "Just below: C30, score 59, complete", records: [{ id: "C30", score: 59, documents: true }], expected: "Not eligible" },
  { id: "T4", description: "Empty applicant list", records: [], expected: "Empty list handled" },
  { id: "T5", description: "Duplicate A10 records with conflicting scores", records: [{ id: "A10", score: 72, documents: true }, { id: "A10", score: 58, documents: true }], expected: "Duplicate IDs flagged" },
  { id: "T6", description: "Missing score: E50, documents complete", records: [{ id: "E50", score: null, documents: true }], expected: "Review missing data" },
];
export const revisionCases: TestCase[] = [
  { id: "R1", description: "Old threshold: B20, score 60, complete", records: [{ id: "B20", score: 60, documents: true }], expected: "Not eligible" },
  { id: "R2", description: "New boundary: G70, score exactly 70, complete", records: [{ id: "G70", score: 70, documents: true }], expected: "Eligible" },
  { id: "R3", description: "Below new threshold: F60, score 69, complete", records: [{ id: "F60", score: 69, documents: true }], expected: "Not eligible" },
  { ...testCases[3], id: "R4" },
  { ...testCases[4], id: "R5" },
  { ...testCases[5], id: "R6" },
];
export function runTestCases(cases: TestCase[], threshold = 60, inclusive = true) {
  return cases.map(test => {
    const results = evaluateBatch(test.records, threshold, inclusive);
    const actual = !results.length ? "Empty list handled" : results.length > 1 && results.every(result => result.outcome === "Duplicate ID") ? "Duplicate IDs flagged" : results.map(result => result.outcome).join(" / ");
    return { id: test.id, actual, expected: test.expected, passed: actual === test.expected };
  });
}
export const freshCases = [
  { label: "Score 75, documents explicitly incomplete", answer: "Needs documents", why: "A high score does not replace required documents." },
  { label: "Score −1, documents complete", answer: "Invalid record", why: "A negative score lies outside the specified 0–100 range." },
  { label: "Score 0, documents complete", answer: "Not eligible", why: "Zero is a valid supplied score below the threshold, not missing data." },
];

export const ctPractice = {
  "decompose-the-scholarship-desk": { brief: "Break the fictional enquiry into inputs, checks, teacher review and communication. Separate facts, assumptions and constraints. The exercise never awards real scholarships.", prompts: ["Build the enquiry process from four connected steps.", "Separate supplied facts from assumptions and scope constraints.", "Define what belongs inside the workflow and what stays with a person."] },
  "model-only-what-matters": { brief: "Use a minimal synthetic record: stable ID, score and document status. A record, list and keyed lookup serve different jobs. Preserve duplicates and missing values for review.", prompts: ["Choose only the fields needed for this fictional model.", "Match each data representation to its job.", "Apply the data dictionary to conflicting, invalid and missing inputs."] },
  "make-the-rules-explicit": { brief: "Exercise rule: score ≥ 60 AND complete documents, after input validation. Missing data and incomplete documents need explicit paths. These are invented criteria, not real award rules.", prompts: ["Complete the decision table before writing pseudocode.", "Build and run the Boolean rule against boundary and document cases.", "Order the pseudocode so validation and missing-data handling are preserved."] },
  "trace-and-debug-a-decision": { brief: "Trace indexes, values and results. Zero-based indexes stop before length. Valid-looking code can still express the wrong rule; retain a failing case and rerun after repair.", prompts: ["Run the loop, inspect the extra iteration and repair its guard.", "Repair the exact-threshold comparison and rerun the evidence.", "Distinguish syntax-like mistakes, logical mistakes and test evidence."] },
  "search-and-sort-with-purpose": { brief: "Linear search can inspect unsorted data. Binary search needs sorted order. Count comparisons for this pack and remember that sorting preparation also costs work.", prompts: ["Step through linear search for numeric practice ID 60.", "Sort the cards, then measure binary search on the sorted version.", "Choose methods for a new enquiry situation and explain preparation cost."] },
  "reuse-a-reliable-step": { brief: "Define a reusable function by its input, output and validation. One shared check keeps callers consistent; a missing value must not silently become zero or false.", prompts: ["Specify the contract for the shared applicant check.", "Trace three calls through the same function.", "Remove a score field and inspect the defined review route."] },
  "test-the-boundaries": { brief: "Specify expected outcomes before testing ordinary, boundary, empty, duplicate and missing-data cases. Passing a finite matrix is evidence, not proof for every possible input.", prompts: ["Build the minimum six-case test matrix.", "Run the matrix, repair its hidden boundary bug and rerun.", "Handle new incomplete and invalid cases, and state the limit of the test evidence."] },
  "algorithm-review-board": { brief: "Defend correctness, limitations and alternatives. A new at-least-70 requirement changes some expected outcomes while input, duplicate and human-review protections still matter.", prompts: ["Update the shared threshold and run the revised six-case pack.", "Compare two designs on consistency, validation and maintainability.", "Defend a response to a fresh pair of conflicting records."] },
};

export const ctStoryTasks = [
  { title: "Asha breaks down the enquiry desk", concepts: ["Intake → check → teacher review → communication", "Separate supplied facts from assumptions", "The real award decision stays with the teacher"], question: "Does an exercise eligibility check authorise the program to award a real scholarship?", choices: ["Yes, if the score is high", "No; keep the responsible teacher's decision", "Yes, if the screen looks official"], answer: 1, why: "The program supports a fictional enquiry check. A computed result does not authorise a real award or payment." },
  { title: "Kabir models the applicant records", concepts: ["Record: fields for one applicant", "List: records to process", "Stable keyed lookup: flag duplicates before trusting a unique result"], question: "Two supplied records have the same ID and conflicting values. What should the model do?", choices: ["Overwrite the first row silently", "Choose whichever name looks familiar", "Preserve and flag the duplicate for review"], answer: 2, why: "A key conflict must remain visible. Silently overwriting data would hide an unresolved disagreement." },
  { title: "Asha makes the conditions explicit", concepts: ["Validate data before the exercise check", "At least 60 means score ≥ 60", "Score AND documents must satisfy the rule"], question: "A valid record scores exactly 60 and has complete documents. What does the at-least-60 exercise rule return?", choices: ["Eligible", "Not eligible because it is not above 60", "A real scholarship payment"], answer: 0, why: "Exactly 60 meets the inclusive threshold and documents are complete. Eligible is an exercise classification, not a real award." },
  { title: "Kabir follows the failing trace", concepts: ["Three items have indexes 0, 1 and 2", "The guard i < length avoids the extra read", "Rerun a failing example after repair"], question: "Which guard fits a zero-based loop over a three-item list?", choices: ["i <= length", "i < length", "i can always read index 3"], answer: 1, why: "The final valid index is length−1. Allowing i to equal length creates an out-of-range access." },
  { title: "Asha measures two searches", concepts: ["Linear search works on the shuffled list", "Binary search requires sorted order", "Lookup comparisons exclude sorting preparation"], question: "The IDs are shuffled. What is a valid next step?", choices: ["Discard half the unsorted list", "Assume it is sorted because the IDs are numbers", "Use linear search, or establish sorted order before binary search"], answer: 2, why: "Binary search relies on ordering. Use a method whose precondition holds, or prepare and verify the sorted order first." },
  { title: "Kabir reuses one reliable check", concepts: ["Define input, output and validation", "Share the check instead of copying inconsistent rules", "Missing, zero and false are different states"], question: "The score field is absent but documents are complete. What should the shared check return?", choices: ["Review missing data", "Treat the missing score as zero", "Eligible because documents are complete"], answer: 0, why: "An absent score is not a number. Preserve the missing-data route instead of inventing a score or bypassing the condition." },
  { title: "Asha challenges the boundaries", concepts: ["Write expected results before running tests", "Include boundary, empty, duplicate and missing cases", "Finite tests support confidence without proving all inputs"], question: "Which score best reveals the difference between > 60 and ≥ 60?", choices: ["72", "Exactly 60", "95"], answer: 1, why: "The two comparisons disagree exactly at 60; another comfortable high score would not reveal this boundary bug." },
  { title: "The algorithm review board", concepts: ["Revised exercise threshold: score ≥ 70", "Retest validation, missing and duplicate protections", "Preserve evidence and keep human authority"], question: "Under the revised rule, a valid record scores exactly 70 with complete documents. What should it return?", choices: ["Not eligible because the old threshold was 60", "A real award without review", "Eligible under the revised exercise rule"], answer: 2, why: "The new inclusive boundary includes 70. This changes an exercise check, not responsibility for real award decisions." },
];
