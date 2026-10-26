export type Row = { label: string; answer: string; why: string };
export const structureRows: Row[] = [
  { label: 'Preserve a programme’s item order and read a known position', answer: 'Ordered list', why: 'A list preserves sequence; a position is different from an identity key.' },
  { label: 'Retrieve a uniquely identified registration by stable ID', answer: 'Keyed lookup', why: 'Resolve duplicate IDs before trusting a unique lookup.' },
  { label: 'Undo the most recently added edit first', answer: 'Stack · last in, first out', why: 'Undo follows the most recent action before earlier ones.' },
  { label: 'Serve the earliest waiting support ticket first', answer: 'Queue · first in, first out', why: 'A queue expresses first-come ordering, not a priority policy.' },
];
export function removalTrace(stack: string[], queue: string[]) {
  const nextStack = [...stack]; const nextQueue = [...queue];
  return { undone: nextStack.pop() ?? null, served: nextQueue.shift() ?? null, stack: nextStack, queue: nextQueue };
}
export const structureLimits: Row[] = [
  { label: 'Two records have the same stable ID', answer: 'Flag the conflict before unique-key lookup', why: 'A convenient map must not silently overwrite unresolved records.' },
  { label: 'A new urgent-priority policy is proposed', answer: 'Seek authorised policy review; FIFO alone cannot decide priority', why: 'A data structure implements a rule but does not authorise a change.' },
  { label: 'One item changes position in a list', answer: 'Its stable identity should not depend on the old position', why: 'A position may change as other items are inserted or removed.' },
];
export const growthRows: Row[] = [
  { label: 'One known-position indexed read, after data preparation', answer: 'Constant · O(1) counted access', why: 'The counted access does not grow with n under this model.' },
  { label: 'Binary search on an already sorted list', answer: 'Logarithmic · O(log n) record probes', why: 'Each step reduces the remaining ordered interval.' },
  { label: 'Last-item linear search in an n-item list', answer: 'Linear · O(n) record probes', why: 'This trace visits every record once.' },
  { label: 'Compare every unordered pair of n distinct records', answer: 'Quadratic · O(n²) pair comparisons', why: 'The exact n(n−1)/2 comparisons grow quadratically.' },
];
export function operationCounts(n: number) {
  if (!Number.isInteger(n) || n < 0 || n > 1024) throw new Error('Use a classroom size from 0 to 1024');
  let binary = 0; let low = 0; const high = n - 1;
  while (low <= high) { binary++; const middle = Math.floor((low + high) / 2); if (middle === n - 1) break; low = middle + 1; }
  let pairs = 0;
  for (let left = 0; left < n; left++) for (let right = left + 1; right < n; right++) pairs++;
  return { n, direct: n ? 1 : 0, binary, linear: n, pairs };
}
export const countAssumptions: Row[] = [
  { label: 'The list is shuffled before binary search', answer: 'Establish and verify sorted order; include preparation when comparing total work', why: 'Binary search cannot discard a half-range without an ordering guarantee.' },
  { label: 'The direct-read count is one', answer: 'Known position and prepared indexed representation are assumed', why: 'One indexed read is not one search for an unknown identity.' },
  { label: 'A hash-based lookup is called constant time', answer: 'State expected-average assumptions and include index construction/storage', why: 'Hash behaviour and preparation matter; it is not a universal worst-case promise.' },
  { label: 'One algorithm has fewer counted probes', answer: 'Do not claim elapsed-time superiority without measuring the relevant system', why: 'I/O, implementation and other work are excluded from this simple count.' },
];
export type Registration = { id: string; name: string; status: string };
export type CheckIn = { registrationId: string; status: string };
export const registrations: Registration[] = [
  { id: 'R01', name: 'Sam', status: 'Confirmed' },
  { id: 'R02', name: 'Riya', status: 'Pending' },
  { id: 'R02', name: 'Riya', status: 'Confirmed' },
  { id: 'R03', name: 'Riya', status: 'Confirmed' },
  { id: 'R04', name: 'Neel', status: 'Confirmed' },
];
export const checkIns: CheckIn[] = [
  { registrationId: 'R01', status: 'Present' }, { registrationId: 'R02', status: 'Present' },
  { registrationId: 'R05', status: 'Present' }, { registrationId: 'R01', status: 'Present' },
  { registrationId: 'R04', status: 'Present' },
];
export const schemaRows: Row[] = [
  { label: 'Intended unique, non-missing registration identifier', answer: 'Registration ID · primary-key constraint', why: 'The dirty R02 rows violate intended uniqueness and must be reviewed first.' },
  { label: 'Check-in reference to an existing registration', answer: 'Registration ID reference · foreign-key relationship', why: 'R05 currently has no registration match; preserve it as unresolved.' },
  { label: 'Same name Riya on R02 and R03', answer: 'Name is not a reliable unique join key', why: 'Different people may share a name; preserve their stable IDs.' },
];
export function reconcileRegistrations(regs: Registration[], checks: CheckIn[]) {
  const byRegistration = new Map<string, Registration[]>(); const byCheck = new Map<string, CheckIn[]>();
  for (const record of regs) { const group = byRegistration.get(record.id) ?? []; group.push(record); byRegistration.set(record.id, group); }
  for (const record of checks) { const group = byCheck.get(record.registrationId) ?? []; group.push(record); byCheck.set(record.registrationId, group); }
  const ids = [...new Set([...byRegistration.keys(), ...byCheck.keys()])].sort();
  return ids.map(id => {
    const registration = byRegistration.get(id) ?? []; const check = byCheck.get(id) ?? [];
    const outcome = !registration.length ? 'Unmatched check-in · review' : registration.length > 1 ? 'Registration ID conflict · review' : check.length > 1 ? 'Repeated check-in · review' : !check.length ? 'No check-in record · attendance unknown' : 'Matched registration and check-in';
    return { id, registrationCount: registration.length, checkInCount: check.length, outcome };
  });
}
export type Alert = { id: string; category: string; value: number };
export type Ledger = Record<string, Alert & { route: 'Review' | 'Record only' }>;
export type PipelineOptions = { inclusive?: boolean; allowCapacity?: boolean; threshold?: number; failOnId?: string };
export function parseAlert(input: unknown, allowCapacity = false): { alert: Alert | null; reason: string } {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { alert: null, reason: 'Record must be an object' };
  const row = input as Record<string, unknown>;
  if (typeof row.id !== 'string' || !/^A\d{2}$/.test(row.id)) return { alert: null, reason: 'Stable ID must be A followed by two digits' };
  if (typeof row.category !== 'string' || !['latency', 'outage', ...(allowCapacity ? ['capacity'] : [])].includes(row.category)) return { alert: null, reason: 'Unknown or unsupported category' };
  if (typeof row.value !== 'number' || !Number.isFinite(row.value) || row.value < 0 || row.value > 100) return { alert: null, reason: 'Priority score must be a supplied finite number from 0 to 100' };
  return { alert: { id: row.id, category: row.category, value: row.value }, reason: '' };
}
function sameAlert(left: Alert, right: Alert) { return left.id === right.id && left.category === right.category && left.value === right.value; }
// In-page model only: a ledger commit never sends a message or changes an external system.
export function runAlertPipeline(input: unknown[], existing: Ledger = {}, options: PipelineOptions = {}) {
  const threshold = options.threshold ?? 70;
  if (!Number.isFinite(threshold) || threshold < 0 || threshold > 100) throw new Error('Threshold must be finite and within 0–100');
  const ledger: Ledger = Object.fromEntries(Object.entries(existing).map(([id, record]) => [id, { ...record }]));
  const quarantine: { index: number; reason: string; original: unknown }[] = [];
  const skipped: string[] = []; const pending: string[] = []; const events: string[] = [];
  const groups = new Map<string, { alert: Alert; index: number }[]>();
  const invalidIds = new Set<string>();
  for (const [index, raw] of input.entries()) {
    const parsed = parseAlert(raw, options.allowCapacity);
    if (!parsed.alert) {
      if (raw && typeof raw === 'object' && 'id' in raw && typeof raw.id === 'string' && /^A\d{2}$/.test(raw.id)) invalidIds.add(raw.id);
      quarantine.push({ index, reason: parsed.reason, original: raw }); events.push(`Quarantine input ${index + 1}: ${parsed.reason}`); continue; }
    const group = groups.get(parsed.alert.id) ?? []; group.push({ alert: parsed.alert, index }); groups.set(parsed.alert.id, group);
  }
  let stopped = false;
  for (const [id, group] of groups) {
    const alert = group[0].alert;
    if (invalidIds.has(id) || group.some(item => !sameAlert(item.alert, alert)) || (ledger[id] && !sameAlert(ledger[id], alert))) {
      for (const item of group) quarantine.push({ index: item.index, reason: 'Conflicting reuse of stable ID; preserve and review', original: input[item.index] });
      events.push(`Quarantine conflicting ID ${id}; prior output preserved`); continue;
    }
    if (ledger[id]) { skipped.push(...group.map(() => id)); events.push(`Skip already committed identical event ${id}`); continue; }
    if (stopped) { pending.push(id); continue; }
    if (options.failOnId === id) { stopped = true; pending.push(id); events.push(`Output fault before ${id}; stop with committed ledger intact`); continue; }
    const route = (options.inclusive === false ? alert.value > threshold : alert.value >= threshold) ? 'Review' : 'Record only';
    ledger[id] = { ...alert, route }; events.push(`Commit ${id} → ${route}`);
    for (let copy = 1; copy < group.length; copy++) skipped.push(id);
  }
  if (!input.length) events.push('Empty input: no output changed');
  return { ledger, quarantine, skipped, pending, stopped, events };
}
export const mixedAlerts: unknown[] = [
  { id: 'A01', category: 'latency', value: 70 }, { id: 'A02', category: 'outage', value: 40 },
  { id: 'A03', category: 'latency', value: 101 }, { id: 'A04', category: 'mystery', value: 80 },
];
export const retryAlerts: Alert[] = [
  { id: 'A01', category: 'latency', value: 70 }, { id: 'A02', category: 'outage', value: 30 }, { id: 'A03', category: 'latency', value: 90 },
];
export const pipelineSteps = ['Preserve the original synthetic input batch', 'Validate schema and stable IDs; quarantine invalid or conflicting records', 'Transform valid records using the explicit review rule', 'Commit a retry-safe output ledger and record all outcomes'];
export const contractRows: Row[] = [
  { label: 'Input contract', answer: 'Original records preserved; stable ID, category and supplied score', why: 'The pipeline must retain the source and distinguish supplied from invented data.' },
  { label: 'Validation contract', answer: 'A plus two digits; supported category; finite score 0–100; conflicts held', why: 'Missing, invalid and conflicting data need visible routes.' },
  { label: 'Transformation contract', answer: 'Score ≥70 → Review; lower valid score → Record only', why: 'This is the invented exercise rule, not a real incident-priority policy.' },
  { label: 'Output contract', answer: 'Ledger keyed by event ID, quarantine reasons and pending/checkpoint log', why: 'A run must expose success, unresolved input and unfinished output.' },
];
export const failureRows: Row[] = [
  { label: 'Input is an empty list', answer: 'Explicit no-change result', why: 'An empty batch is handled without inventing output or treating it as a crash.' },
  { label: 'Score is missing, text or outside the allowed range', answer: 'Quarantine with reason; preserve original', why: 'Do not coerce missing values to zero or silently drop them.' },
  { label: 'Same ID and identical content arrives after commit', answer: 'Skip the already committed event and log the repeat', why: 'Retry should not duplicate an already recorded identical output.' },
  { label: 'Output becomes unavailable halfway through', answer: 'Stop with checkpoint; retry pending work after the fault is resolved', why: 'Preserve both completed output and pending input.' },
];
export const observationWindows = [
  { id: 'A', hours: 1, observed: 100, flagged: 20, missing: 0 },
  { id: 'B', hours: 3, observed: 300, flagged: 30, missing: 15 },
];
export function observedRate(flagged: number, observed: number) {
  if (![flagged, observed].every(value => Number.isSafeInteger(value) && value >= 0) || flagged > observed) throw new Error('Counts must be valid and flagged cannot exceed observed');
  return observed ? flagged / observed : null;
}
export const regressionCases = [
  { id: 'T1', label: 'Old routine latency score 40', expected: 'Record only' },
  { id: 'T2', label: 'Old exact threshold 70', expected: 'Review' },
  { id: 'T3', label: 'Malformed score text', expected: 'Quarantine' },
  { id: 'T4', label: 'Empty input', expected: 'Empty handled' },
  { id: 'T5', label: 'Identical event repeated after commit', expected: 'Repeat skipped' },
  { id: 'T6', label: 'Partial output fault on A02', expected: 'Stopped with checkpoint' },
  { id: 'T7', label: 'New capacity category score 75', expected: 'Review' },
  { id: 'T8', label: 'Conflicting same-ID batch', expected: 'Conflict quarantined' },
];
export function runRegression(inclusive = true, allowCapacity = true) {
  const options = { inclusive, allowCapacity };
  const run = (input: unknown[], existing: Ledger = {}, extra: PipelineOptions = {}) => runAlertPipeline(input, existing, { ...options, ...extra });
  const t1 = run([{ id: 'A01', category: 'latency', value: 40 }]);
  const t2 = run([{ id: 'A02', category: 'latency', value: 70 }]);
  const t3 = run([{ id: 'A03', category: 'outage', value: '70' }]);
  const t4 = run([]);
  const first = run([retryAlerts[0]]);
  const t5 = run([retryAlerts[0]], first.ledger);
  const t6 = run(retryAlerts, {}, { failOnId: 'A02' });
  const t7 = run([{ id: 'A07', category: 'capacity', value: 75 }]);
  const t8 = run([{ id: 'A08', category: 'latency', value: 70 }, { id: 'A08', category: 'latency', value: 20 }]);
  const actual = [t1.ledger.A01?.route ?? 'No output', t2.ledger.A02?.route ?? 'No output', t3.quarantine.length === 1 ? 'Quarantine' : 'Unexpected output', !Object.keys(t4.ledger).length && !t4.stopped ? 'Empty handled' : 'Unexpected output', t5.skipped.length === 1 && Object.keys(t5.ledger).length === 1 ? 'Repeat skipped' : 'Unexpected repeat', t6.stopped && Object.keys(t6.ledger).join() === 'A01' && t6.pending.join() === 'A02,A03' ? 'Stopped with checkpoint' : 'Incomplete failure handling', t7.ledger.A07?.route ?? (t7.quarantine.length ? 'Quarantine' : 'No output'), t8.quarantine.length === 2 && !Object.keys(t8.ledger).length ? 'Conflict quarantined' : 'Conflict hidden'];
  return regressionCases.map((test, index) => ({ ...test, actual: actual[index], passed: actual[index] === test.expected }));
}
export const designRows: Row[] = [
  { label: 'Correctness', answer: 'Shared validated contracts with invalid, conflict and retry paths', why: 'An efficient design must still preserve required behaviour and evidence.' },
  { label: 'Efficiency', answer: 'Measure stated operations; include preparation, storage and implementation assumptions', why: 'Counts of probes or pairs are not complete elapsed-time measurements.' },
  { label: 'Maintainability', answer: 'One shared rule, versioned results and old plus new regression tests', why: 'Conflicting copies of a rule make future changes harder to verify.' },
  { label: 'Human authority', answer: 'Authorised owner reviews identity conflicts and approves policy changes', why: 'Automation does not decide which person is correct or authorise a new policy.' },
];
export const choices = {
  reconcile: { choices: ['Merge every Riya row because names match', 'Preserve stable IDs and original rows; hold conflicts/unmatched references for authorised review and retest the repaired relationship', 'Keep the last conflicting value and delete the earlier evidence'], answer: 1, feedback: 'Names are not unique identity keys. Preserve conflicting and unmatched evidence; a missing check-in is unknown, not proof of absence.', success: 'Reconciliation decision: keep R02 and R03 distinct; preserve original rows and the unresolved R01/R02/R05 cases, seek authorised corrections and retest key uniqueness/reference coverage. R03 attendance remains unknown without check-in evidence.' },
  conflict: { choices: ['Overwrite committed A01 score 70 with the new score 5', 'Delete the source batch so the conflict disappears', 'Quarantine the changed A01 payload, preserve prior output and both source versions, and seek authorised review'], answer: 2, feedback: 'Retry safety applies to identical content. Different content under an existing ID is a conflict, not permission to overwrite history.', success: 'Conflict handling: changed content under A01 is quarantined for authorised review; prior output and both source versions remain. Do not silently overwrite a committed event or treat a changed payload as an identical retry.' },
  cause: { choices: ['The new rule definitely caused the count increase', 'B has a lower observed rate in this pack, but different windows/workloads and missingness leave alternative explanations; seek comparable evidence before a causal claim', 'Treat the 15 missing readings as known normal readings'], answer: 1, feedback: 'Observed rates are 20/100 and 30/300; windows differ and 15 readings are missing in B. Those observations do not isolate a cause.', success: 'Cautious interpretation: A observed flag rate 20%, B 10%; windows are 1h and 3h, with 15 missing readings in B. Workload mix, window length and missingness are alternatives to investigate; no controlled evidence establishes a causal effect of the rule.' },
  freshTest: { choices: ['A valid new capacity score exactly 70 → Review; missing score → quarantine; preserve both as regression cases', 'Change expected exact-70 output to Record only to match the bug', 'Remove all invalid-input cases after adding capacity'], answer: 0, feedback: 'The inclusive ≥70 contract applies to the new supported category too. Missing is not zero; retain old and new cases instead of editing expectations to hide a regression.', success: 'Fresh regression evidence: supported capacity at exactly 70 requests Review; an absent score is quarantined, never invented as zero. Add both cases while retaining the original eight-case pack; finite passing examples do not prove all possible inputs.' },
  finalDefence: { choices: ['Choose the larger conflicting score automatically and notify outsiders', 'Quarantine the conflicting identity/content, preserve source and old/new-version results, and have the authorised owner resolve it before action', 'Skip validation at larger scale to save work'], answer: 1, feedback: 'Scale does not remove identity, validation or human-authority requirements. Preserve conflicts and versioned evidence; do not decide a person’s identity or send real notifications automatically.', success: 'Unseen defence: quarantine the conflicting identity/content, preserve originals and old/new-version records, and seek authorised owner review before action. Defend the shared contract, counted-operation assumptions, checkpointed retry and eight-case regression evidence; human policy and identity decisions stay with a person.' },
};
export const reliabilityPractice = {
  'choose-the-right-data-model': { brief: 'Fictional registration desk: stable-ID lookup, ordered programme, undo history and first-come support. Choose a structure by its operation. The demo traces abstract removal order, not a performance benchmark.', prompts: ['Match the four operations to their data structures.', 'Predict and run one stack removal and one queue removal.', 'State stable-identity and human-policy limits.'] },
  'how-work-grows-with-input-size': { brief: 'Count one indexed access, one record probe or one unordered-pair comparison as specified. Binary search uses an already sorted list and searches for the last item; preparation and wall-clock costs are excluded.', prompts: ['Identify constant, logarithmic, linear and quadratic growth.', 'Run counts for 8, 16 and 32 records and record the observed values.', 'State the assumptions behind the efficiency claim.'] },
  'the-duplicate-registration-problem': { brief: 'Synthetic dirty tables: one expected check-in per registration. Stable IDs link tables; names are not unique. Preserve repeated/conflicting rows and unmatched references; no check-in record means attendance unknown.', prompts: ['Specify primary-key and foreign-key relationships.', 'Run stable-ID reconciliation and classify every result.', 'Choose an evidence-preserving correction and human handoff.'] },
  'build-a-reliable-alerts-pipeline': { brief: 'Offline synthetic alerts: ID A plus two digits, category latency/outage, finite priority score 0–100. Exercise rule: score ≥70 → human Review, otherwise Record only. Keep originals, quarantine and a retry-safe ledger; no messages are sent.', prompts: ['Arrange the four pipeline stages.', 'Define the contracts between input, validation, transformation and output.', 'Run mixed valid/invalid inputs and preserve the unresolved records.'] },
  'make-failure-visible': { brief: 'Rehearse empty input, malformed records, identical repeats and partial output failure. Stop with a checkpoint on output failure and retry only after its cause is resolved. Conflicting event content requires review.', prompts: ['Map each fault to a visible safe response.', 'Run a prepared partial failure, then retry the preserved batch.', 'Handle changed content arriving under an already committed ID.'] },
  'do-not-confuse-a-pattern-with-a-cause': { brief: 'Window A: 1h, 100 observed, 20 flagged, 0 missing. Window B: 3h, 300 observed, 30 flagged, 15 missing. Compare observed rates with denominators/time windows; missing readings are not known negatives.', prompts: ['Calculate flag rates using observed-reading denominators.', 'Replace a misleading raw-count summary with a labelled comparison.', 'Interpret the difference without an unsupported causal claim.'] },
  'retest-after-a-change': { brief: 'New requirement: support capacity alerts while retaining latency/outage, validation, quarantine and retry handling. Review still means score ≥70. The draft introduces a deliberate >70 regression; preserve old expectations and run eight old/new cases.', prompts: ['Write expected outcomes for the minimum eight-case pack.', 'Run the draft, repair the regression and rerun all eight cases.', 'Transfer the inclusive rule to a fresh capacity/missing-score pair.'] },
  'automation-design-review': { brief: 'Changed brief: 128 input records and threshold ≥80 in a new version. Compare a shared validated pipeline with copied rules/all-pairs checks. Test on a preserved copy with a separate new-version ledger; keep prior results.', prompts: ['Compare correctness, efficiency, maintainability and human oversight.', 'Count the larger-input work and test 79, 80 and 81 under the new rule.', 'Defend a fresh conflicting-record case in an individual viva.'] },
};
export const reliabilityStoryTasks = [
  { title: 'Asha chooses the data model', concepts: ['Ordered list and stable-key lookup serve different operations', 'Stack: latest first; queue: earliest waiting first', 'Duplicate identity and priority-policy changes need human review'], question: 'Which model fits first-come support?', choices: ['Newest ticket jumps ahead automatically', 'Match identity by name alone', 'Queue: serve the earliest waiting ticket first'], answer: 2, why: 'A queue implements first-in, first-out ordering. A priority exception is a separate authorised policy decision.' },
  { title: 'Kabir counts the work', concepts: ['Known-position read 1; last-item linear search n', 'Sorted binary probes: 4, 5, 6 for n=8,16,32', 'All-pairs comparisons: 28,120,496; preparation and timing excluded'], question: 'Which assumption is required before binary search can discard half the list?', choices: ['Establish sorted order and include preparation in a total-work comparison', 'Numbers are always already sorted', 'A low probe count proves a faster real service'], answer: 0, why: 'Binary search relies on ordering. The supplied probe count excludes preparation and cannot establish real elapsed-time superiority.' },
  { title: 'Asha reconciles the registrations', concepts: ['Stable IDs link records; names need not be unique', 'Preserve conflicts, repeats and unmatched references', 'No check-in row means unknown attendance'], question: 'How should two Riya records and conflicting ID values be handled?', choices: ['Merge all names and keep the latest value', 'Reconcile by stable ID and preserve unresolved cases for authorised review', 'Assume anyone missing a check-in was absent'], answer: 1, why: 'Names are not unique identifiers, last-write wins hides evidence and missing check-in evidence does not prove absence.' },
  { title: 'Kabir builds the alerts pipeline', concepts: ['Preserve input → validate/quarantine → transform → ledger/log', 'Score ≥70 is the invented review boundary', 'Keep invalid/conflicting input visible; no external output'], question: 'What should happen to an invalid score?', choices: ['Change it silently to zero', 'Delete the source row', 'Quarantine with a reason while preserving the original'], answer: 2, why: 'A missing or invalid score must not be invented or hidden. Quarantine preserves evidence and makes the failure visible.' },
  { title: 'Asha makes the failure visible', concepts: ['Preserve committed IDs and pending input', 'Stop on output failure; retry after resolution', 'Skip identical committed events; quarantine changed payloads'], question: 'After A01 commits and A02 fails, what is the safe retry plan?', choices: ['Retry the preserved batch after fault resolution, skipping already committed identical A01', 'Erase the ledger and pretend nothing committed', 'Mark the entire batch complete'], answer: 0, why: 'Preserve the checkpoint and pending records. An identical committed event is skipped on retry; unresolved output is not lost or called complete.' },
  { title: 'Kabir checks the denominator', concepts: ['A: 20/100 observed readings; B: 30/300', 'Windows 1h/3h; B has 15 missing readings', 'A rate difference alone does not establish a cause'], question: 'What causal conclusion follows from these two windows?', choices: ['The new rule definitely caused deterioration', 'None yet; different workloads, windows and missingness leave alternatives', 'Missing readings are all normal'], answer: 1, why: 'The observed rates differ, but the comparison does not isolate a cause. Keep the windows, denominators and unknown readings visible.' },
  { title: 'Asha retests the change', concepts: ['Add capacity without dropping old contracts', 'Exact 70 reveals >70 versus ≥70', 'Retain and rerun at least eight old/new cases'], question: 'The exact-70 regression test fails. What should change?', choices: ['The expected answer, to match the bug', 'Delete the failing case', 'Repair the inclusive comparison and rerun all eight tests'], answer: 2, why: 'The requirement still says at least 70. Keep the expected boundary result and repair the implementation, then rerun old and new tests.' },
  { title: 'The automation review board', concepts: ['New version: 128 inputs and threshold ≥80', 'Preserve old results and evaluate on a separate ledger', 'Shared contracts + measured work + human authority'], question: 'Which design defence fits the changed brief?', choices: ['Share validation/transformation, measure work and retain human ownership of conflicts and policy', 'Copy different rules into every screen', 'Choose solely from visual animation'], answer: 0, why: 'Correctness, measurable efficiency, maintainability and human authority remain requirements as input and policy change.' },
];
