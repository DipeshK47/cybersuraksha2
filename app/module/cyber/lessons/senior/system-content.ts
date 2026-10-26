export type Row = { label: string; answer: string; why: string };
export const entryRows: Row[] = [
  { label: 'A session verifies Asha’s identity', answer: 'Authentication', why: 'This checks who is signed in, not every action they may take.' },
  { label: 'The server checks whether Asha may read record R20', answer: 'Authorisation', why: 'Permission is checked for the requested action and resource.' },
  { label: 'A public export reveals registration contacts', answer: 'Confidentiality impact', why: 'The harm concerns who can see private data.' },
];
export const systemRows: Row[] = [
  { label: 'Private registration database', answer: 'Asset', why: 'The team needs to protect this information.' },
  { label: 'Student, organiser and external supplier', answer: 'Actors with different permitted tasks', why: 'Different tasks require different access, even after sign-in.' },
  { label: 'Browser sends a request into the application server', answer: 'Trust boundary', why: 'Client-provided claims must be checked by the trusted server.' },
  { label: 'Named registration lead reviews access weekly', answer: 'Risk owner and review point', why: 'A control needs an accountable person and a review condition.' },
];
export const riskRows: Row[] = [
  { label: 'Public export · supplied likelihood 3 × impact 3 = 9', answer: 'First: registration lead restricts export access', why: 'For these supplied estimates, the exposed contacts are the highest priority.' },
  { label: 'Single gate device · supplied likelihood 2 × impact 3 = 6', answer: 'Second: operations lead tests the gate fallback', why: 'A failed device could stop entry; the fallback needs a test and an owner.' },
  { label: 'Editable public poster · supplied likelihood 1 × impact 2 = 2', answer: 'Third: communications lead keeps an approved original', why: 'The supplied lower score supports later attention, not ignoring the risk.' },
];
export const componentRows: Row[] = [
  { label: 'Browser / client', answer: 'Collect input and display responses; do not trust it to assign roles', why: 'A client can change requests; the server owns enforcement.' },
  { label: 'Application server', answer: 'Check session, action permission and input before data access', why: 'The service must enforce the decision beyond the browser.' },
  { label: 'Database', answer: 'Store records behind constrained service access', why: 'Public browsers should not carry database credentials.' },
  { label: 'DNS and HTTPS', answer: 'Locate the hostname and protect transport, without granting record access', why: 'Neither substitutes for application authorisation or verifies the operator’s legitimacy.' },
];
export const boundaryRows: Row[] = [
  { label: 'Trusted session identity and record permission', answer: 'Application server before private data access', why: 'A hidden client button or a client-provided role can be bypassed.' },
  { label: 'Least-privilege database account and structured data access', answer: 'Server-to-database boundary', why: 'Constrain the service account and keep supplied values separate from query instructions.' },
  { label: 'Authenticity, reference and expected amount of payment status', answer: 'Payment-provider integration boundary on the server', why: 'A browser message saying paid is insufficient; use the provider’s documented trusted verification path.' },
];
export const designRows: Row[] = [
  { label: 'Negative amount is accepted', answer: 'Server input validation', why: 'The amount must satisfy the stated range and whole-number rule.' },
  { label: 'A signed-in participant can read a different owner’s record', answer: 'Per-record server authorisation', why: 'A well-formed record ID does not grant permission.' },
  { label: 'User text is inserted into query instructions', answer: 'Structured / parameterised data access', why: 'Keep supplied values as data rather than executable query instructions; this lesson executes no SQL.' },
];
export type PortalControls = { authorisation: boolean; validation: boolean; safeData: boolean };
export type PortalRequest = { id: string; session: string | null; amount: number };
export const portalRecords = [{ id: 'R10', owner: 'Asha' }, { id: 'R20', owner: 'Kabir' }];
// Offline decision model only: it executes no query and makes no network request.
export function portalResult(request: PortalRequest, controls: PortalControls) {
  if (!request.session) return 'Sign in required';
  if (controls.validation && (!Number.isInteger(request.amount) || request.amount < 0 || request.amount > 5000)) return 'Reject amount';
  const record = portalRecords.find(record => record.id === request.id);
  if (!record) return controls.safeData ? 'No matching record; input remains data' : 'Unsafe query construction';
  if (controls.authorisation && record.owner !== request.session) return 'Deny other-owner record';
  return 'Allow request';
}
export const portalCases = [
  { label: 'Own record · Asha / R10 / ₹100', request: { session: 'Asha', id: 'R10', amount: 100 }, expected: 'Allow request' },
  { label: 'Different owner · Asha / R20 / ₹100', request: { session: 'Asha', id: 'R20', amount: 100 }, expected: 'Deny other-owner record' },
  { label: 'Negative amount · Asha / R10 / −₹1', request: { session: 'Asha', id: 'R10', amount: -1 }, expected: 'Reject amount' },
  { label: 'Unexpected identifier text · Asha / no matching record', request: { session: 'Asha', id: 'unexpected identifier text', amount: 100 }, expected: 'No matching record; input remains data' },
];
export const boundaryCases: Row[] = [
  { label: 'Asha / own R10 / amount exactly ₹0', answer: 'Allow within the fictional amount rule', why: 'The stated exercise range is inclusive 0–5000 whole rupees; a zero amount is supplied, not missing.' },
  { label: 'Asha / own R10 / amount exactly ₹5,000', answer: 'Allow within the fictional amount rule', why: 'The upper boundary is inclusive in this exercise.' },
  { label: 'Asha / own R10 / amount ₹5,001', answer: 'Reject amount', why: 'This is just above the allowed range.' },
  { label: 'No trusted session / R10 / amount ₹100', answer: 'Require sign-in before private record access', why: 'An amount within range cannot replace a verified session.' },
];
export const dependencyControls = [
  { id: 'scope', label: 'Supplier gets programme-only access with expiry · 2 units', cost: 2, good: true, why: 'Publishing a programme does not require a registration export.' },
  { id: 'secrets', label: 'Privately managed integration secrets with rotation and trusted updates · 2 units', cost: 2, good: true, why: 'Client code and group chats must not distribute integration secrets.' },
  { id: 'recovery', label: 'Independent recovery route and restoration test · 2 units', cost: 2, good: true, why: 'A failed supplier should not hold the only recovery route.' },
  { id: 'badge', label: 'Decorative security badge while sharing one organiser password · 3 units', cost: 3, good: false, why: 'A badge does not satisfy the three supplied requirements or remove shared-account risk.' },
];
export function dependencyBudget(selected: string[]) {
  const unique = [...new Set(selected)];
  const known = unique.every(id => dependencyControls.some(control => control.id === id));
  const cost = dependencyControls.filter(control => unique.includes(control.id)).reduce((total, control) => total + control.cost, 0);
  return { cost, complete: known && cost <= 6 && dependencyControls.every(control => unique.includes(control.id) === control.good) };
}
export const supplierRows: Row[] = [
  { label: 'Supplier · task: publish the programme', answer: 'Programme editing only; no registration export', why: 'Grant only the access required for the specific task.' },
  { label: 'Supplier work ends Friday', answer: 'Named service owner expires access and verifies revocation', why: 'The agreement needs an owner and a tested exit.' },
  { label: 'Supplier requests onward sharing of contacts', answer: 'Do not grant; contacts are outside the task', why: 'The supplier does not need personal contacts to publish a programme.' },
];
export type LogEvent = { id: string; rawMinute: number; fastBy: number; observation: string };
export const logEvents: LogEvent[] = [
  { id: 'E1', rawMinute: 840, fastBy: 0, observation: 'Identity service: session S7 authenticated as Asha' },
  { id: 'E2', rawMinute: 843, fastBy: 2, observation: 'Sharing service: public export link enabled in S7 context' },
  { id: 'E3', rawMinute: 842, fastBy: 0, observation: 'Gateway: /export request returned 200; bytes not recorded' },
  { id: 'E4', rawMinute: 842, fastBy: 0, observation: 'App: /admin request denied 403; a different request path' },
];
export function correctedTimeline(events: LogEvent[], correction: number) {
  if (!Number.isFinite(correction) || correction < 0) throw new Error('Use a finite non-negative supplied correction');
  return events.map(event => ({ ...event, minute: event.rawMinute - (event.fastBy ? correction : 0) })).sort((left, right) => left.minute - right.minute || left.id.localeCompare(right.id));
}
export function clockLabel(minute: number) { return `${String(Math.floor(minute / 60)).padStart(2, '0')}:${String(minute % 60).padStart(2, '0')}`; }
export const ledgerRows: Row[] = [
  { label: 'Gateway recorded status 200 for /export', answer: 'Observed log fact', why: 'That response status is explicitly supplied.' },
  { label: 'The entire file reached an unauthorised person', answer: 'Hypothesis requiring more evidence', why: 'Response bytes and receipt are not recorded.' },
  { label: 'The account holder personally caused the exposure', answer: 'Attribution not established', why: 'A session context is not proof of the person operating it.' },
  { label: 'Response size and receiving party', answer: 'Missing evidence', why: 'Do not invent evidence that is absent from the pack.' },
];
export const roleRows: Row[] = [
  { label: 'Coordinate, authorise and escalate', answer: 'Incident lead', why: 'One accountable lead coordinates decisions and escalation.' },
  { label: 'Restrict link/session through approved controls', answer: 'Authorised service operator', why: 'Only an authorised operator changes the service.' },
  { label: 'Retain raw logs and record action times', answer: 'Evidence recorder', why: 'Preserve original records and document interventions.' },
  { label: 'Send approved factual stakeholder updates', answer: 'Communications lead', why: 'Explain established facts and uncertainty without accusation.' },
];
export const incidentSteps = ['Notify the authorised incident lead and preserve available supplied records', 'Have the authorised operator restrict exposure and verify the restriction', 'Confirm known scope and send an approved factual stakeholder update', 'Record times, reasons and owners; hand over for recovery and review'];
export const objectiveRows: Row[] = [
  { label: 'Restore service within 30 minutes of the incident', answer: 'Recovery time objective', why: 'This sets the exercise target for service downtime, not a legal deadline.' },
  { label: 'Lose at most 10 minutes of data relative to the incident', answer: 'Recovery point objective', why: 'This sets the exercise target for how far back the restored data may be.' },
  { label: 'Copy completes without any access or data tests', answer: 'Insufficient recovery evidence', why: 'A successful copy does not establish completeness or correct access.' },
];
export type Snapshot = { id: string; minute: number; rows: { id: string; status: string }[]; guestCanRead: boolean; leadCanEdit: boolean };
export const expectedRecords = [{ id: 'R10', status: 'Confirmed' }, { id: 'R20', status: 'Pending' }, { id: 'R30', status: 'Confirmed' }, { id: 'R40', status: 'Confirmed' }];
export const snapshots: Snapshot[] = [
  { id: 'recent-unsafe', minute: 848, rows: expectedRecords.slice(0, 3), guestCanRead: true, leadCanEdit: true },
  { id: 'clean-1400', minute: 840, rows: expectedRecords.map(record => ({ ...record })), guestCanRead: false, leadCanEdit: true },
];
export function verifyRecovery(snapshot: Snapshot, restoredAt = 862) {
  const incidentAt = 850;
  const complete = snapshot.rows.length === expectedRecords.length && new Set(snapshot.rows.map(row => row.id)).size === expectedRecords.length && expectedRecords.every(expected => snapshot.rows.some(row => row.id === expected.id && row.status === expected.status));
  return { complete, access: !snapshot.guestCanRead && snapshot.leadCanEdit, time: restoredAt >= incidentAt && restoredAt - incidentAt <= 30, point: snapshot.minute <= incidentAt && incidentAt - snapshot.minute <= 10 };
}
export const assuranceRows: Row[] = [
  { label: 'Privacy versus supplier convenience', answer: 'Keep programme-only access; service owner reviews expiry', why: 'Publishing a programme does not justify disclosing private contacts.' },
  { label: 'Availability versus limited budget', answer: 'Fund the tested fallback; operations lead owns remaining outage risk', why: 'A fallback supports continuity but cannot eliminate supplier failures.' },
  { label: 'Usability versus shared-account shortcuts', answer: 'Use named roles and supported recovery; lead reviews access', why: 'A shared password hides accountability rather than solving access needs.' },
];
export const systemPractice = {
  'from-personal-safety-to-system-risk': { brief: 'Fictional portal: participants see their own registration, organisers manage entries, suppliers publish the programme. Map actors and trust boundaries; use the supplied risk estimates and name an owner.', prompts: ['Complete the Class 11 entry check.', 'Map assets, actors, boundaries and ownership.', 'Prioritise the three supplied risks with a responsible owner.'] },
  'design-the-college-fest-portal': { brief: 'A browser, server, database and external provider have different jobs. DNS locates a hostname and HTTPS protects transport; neither grants record permission. This is a conceptual architecture, not a real deployment.', prompts: ['Assign each component its job.', 'Place the three controls at the boundary that owns them.', 'Defend the architecture’s assumptions and limits.'] },
  'secure-by-design': { brief: 'Offline model only: no query, scanning, exploitation or live request is performed. Exercise amount rule: whole rupees from 0 to 5,000 inclusive. Server identity, authorisation, validation and structured data access remain distinct.', prompts: ['Match each misuse case to its missing control.', 'Run the faulty model, enable the corrections and retest the same pack.', 'Test exact boundaries and an absent session.'] },
  'protect-the-whole-dependency-chain': { brief: 'The fictional supplier only publishes the programme. Budget: six exercise units. Meet the supplied requirements for limited access, managed secrets/trusted updates and independent recovery. Costs are invented, not vendor prices.', prompts: ['Allocate the six-unit budget to the required safeguards.', 'Write the minimum-access and expiry agreement.', 'Handle an outage when the supplier also holds a recovery route.'] },
  'when-logs-disagree': { brief: 'Synthetic evidence only. E2’s clock is known to run two minutes fast; other clocks are aligned. Gateway status 200 has unknown response bytes; a 403 belongs to a different path. Preserve raw times and avoid personal attribution.', prompts: ['Classify observed facts, hypotheses and missing evidence.', 'Apply the supplied clock correction and inspect the ordered timeline.', 'State an alternative explanation and the evidence still needed.'] },
  'the-breach-tabletop': { brief: 'Supplied inject: public export link confirmed; complete download scope unknown. Rehearse authorised roles and preserve evidence alongside urgent containment. The simulation sends no messages and changes no service.', prompts: ['Allocate the four incident roles.', 'Build the authorised action log in order.', 'Choose a factual stakeholder message without accusation or guarantees.'] },
  'recover-and-learn': { brief: 'Incident 14:10; exercise targets: restore within 30 minutes and lose at most 10 minutes of data. Restore a harmless in-page dataset, test exact IDs/statuses and permissions, then record a limited recovery conclusion.', prompts: ['Interpret the recovery objectives and evidence requirement.', 'Choose a clean snapshot, restore the model and run four checks.', 'Choose an improvement that addresses the recovery dependency.'] },
  'security-assurance-review': { brief: 'Defend the portal architecture and playbook with risk ownership, cost, privacy and usability. New evidence explains the initial login alert as maintenance; the public export remains independently confirmed.', prompts: ['Connect each tradeoff to a control and risk owner.', 'Revise the misleading-alert hypothesis without ignoring separate exposure evidence.', 'Defend a fresh supplier request and one residual risk in an individual viva.'] },
};
export const systemStoryTasks = [
  { title: 'Asha maps the system risk', concepts: ['Assets + actors + trust boundaries', 'Authentication is not per-record permission', 'Prioritise with supplied estimates; name an owner and remaining risk'], question: 'A supplier signs in but has no registration task. What access should the server allow?', choices: ['All records because sign-in succeeded', 'A shared organiser password', 'Only the supplier’s authorised programme task'], answer: 2, why: 'A verified identity does not grant every permission. Limit access to the supplier’s actual authorised purpose.' },
  { title: 'Kabir places the portal controls', concepts: ['Browser claims are untrusted input', 'Enforce session and record permission on the server', 'DNS and HTTPS do not grant database access'], question: 'Where should permission to read a private registration be enforced?', choices: ['On the server using trusted session and record data', 'Only by hiding a browser button', 'In a shared password sent to everyone'], answer: 0, why: 'The server owns enforcement; a client-controlled role or hidden button cannot be the final access check.' },
  { title: 'Asha repairs the design', concepts: ['Validate the input range', 'Authorise the actor’s action on this record', 'Keep query values as data; retest the failing pack'], question: 'A valid-looking ID belongs to another participant. Which control is required?', choices: ['Only amount formatting', 'Per-record server authorisation', 'An HTTPS icon alone'], answer: 1, why: 'Valid input and transport protection cannot authorise access to another participant’s record.' },
  { title: 'Kabir assesses the dependencies', concepts: ['Programme task → programme-only access', 'Private managed secrets and trusted updates', 'Independent recovery with a named owner and exit'], question: 'What access fits a supplier publishing the programme?', choices: ['The complete registration contact export', 'A shared organiser account forever', 'Programme publishing only, with expiry and revocation review'], answer: 2, why: 'The task does not need private registrations. Limit scope and duration and assign an owner to revoke and verify access.' },
  { title: 'Asha challenges the logs', concepts: ['Preserve raw records and apply only the known clock correction', 'Separate observed fact, hypothesis and unknown', 'A session label and status code do not establish full disclosure or attribution'], question: 'A 200 response has unknown bytes. What is established?', choices: ['The successful response was logged; full receipt and attribution remain unproved', 'The account holder definitely stole every record', 'The event must be harmless'], answer: 0, why: 'The log supplies a response status, not proof of complete receipt or the person behind the session. Investigate proportionately without inventing evidence.' },
  { title: 'Kabir runs the breach tabletop', concepts: ['Incident lead + operator + recorder + communications lead', 'Preserve evidence alongside authorised containment', 'Communicate known facts and scope under review'], question: 'Which initial response fits the supplied exposure?', choices: ['Erase logs to tidy up', 'Notify the authorised lead, preserve records and restrict exposure through the operator', 'Accuse the account holder publicly'], answer: 1, why: 'Use authorised coordinated containment and evidence preservation, without destroying records or making unsupported accusations.' },
  { title: 'Asha verifies recovery', concepts: ['Supplied time objective: 30 minutes', 'Supplied data-loss objective: at most 10 minutes', 'Test exact data and access before reopening'], question: 'A copy succeeds, but data completeness and access are untested. Can recovery be declared?', choices: ['Yes, the copy finished', 'Yes, if the snapshot is the newest', 'No; test completeness, access and the stated recovery objectives'], answer: 2, why: 'Copy completion alone does not establish service behaviour, clean permissions or the exercise recovery targets.' },
  { title: 'The security assurance board', concepts: ['Balance privacy, usability and cost', 'Revise only the conclusion the new evidence changes', 'Name residual risk, owner and review point; teacher reviews the viva'], question: 'Maintenance explains a login alert, but a public export is independently confirmed. What changes?', choices: ['Correct the login hypothesis while containing and reviewing the separate exposure', 'Dismiss all evidence as false', 'Accuse the account holder anyway'], answer: 0, why: 'One benign alert does not invalidate independent evidence of exposure. Update each conclusion according to its own supporting evidence.' },
];
