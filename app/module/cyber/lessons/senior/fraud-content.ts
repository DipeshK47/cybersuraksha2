export type EvidenceRow = { label: string; answer: string; why: string };
export const pressureRows: EvidenceRow[] = [
  { label: '“Pay in five minutes or lose the place”', answer: 'Urgency', why: 'The deadline pushes action before checking.' },
  { label: '“The admissions director selected you”', answer: 'Authority', why: 'A claimed position borrows institutional trust without verifying the sender.' },
  { label: '“Only two places remain”', answer: 'Scarcity', why: 'Limited availability pressures the decision.' },
  { label: '“Do not tell your teacher or family”', answer: 'Secrecy', why: 'Isolation blocks another person from checking the claim.' },
  { label: '“A guaranteed ₹40,000 stipend awaits”', answer: 'Reward', why: 'An attractive outcome can distract from verification.' },
];
export const pressureTransfer: EvidenceRow[] = [
  { label: 'A real school notice has a deadline', answer: 'Warning sign alone is not proof', why: 'Deadlines occur in legitimate notices too; inspect the claim and source.' },
  { label: 'A stranger claims to represent the college', answer: 'Use an independently located college contact', why: 'The sender cannot supply both the claim and its only verification.' },
  { label: 'A message demands secrecy before payment', answer: 'Pause and involve a trusted adult', why: 'Remove isolation before deciding about money or identity documents.' },
];
export const offerPack = [
  ['Offer · sender', 'Bright Path Internships <recruit@brightpath-offers.example>'],
  ['Offer · demand', 'Pay ₹1,500 today; upload a full ID scan to reserve the role'],
  ['Independent source pack', 'Bright Path Learning · brightpath.example · applications only through its listed portal'],
  ['Official process in this exercise', 'No processing fee; no identity-document upload at this stage'],
];
export const offerRows: EvidenceRow[] = [
  { label: 'Does the organisation name alone verify this recruiter?', answer: 'No; verify the exact sender and offer', why: 'A copied organisation name does not establish authorisation.' },
  { label: '₹1,500 processing demand versus no-fee source pack', answer: 'Contradicts the supplied official process', why: 'The offer’s demand conflicts with the independent pack.' },
  { label: 'Full ID scan requested before verification', answer: 'Keep documents private and pause', why: 'Unresolved authority and an unnecessary document request create exposure.' },
];
export const dueDiligence = [
  { id: 'route', label: 'Use the independently supplied official application route', good: true, why: 'Check the exact role through the organisation’s own route.' },
  { id: 'terms', label: 'Compare role, fee, document stage and contact details', good: true, why: 'The claim needs more than a matching name.' },
  { id: 'adult', label: 'Ask a trusted adult to review unresolved requests', good: true, why: 'A second person can help evaluate the evidence.' },
  { id: 'scan', label: 'Send a smaller ID scan as a test', good: false, why: 'A smaller disclosure is still a disclosure to an unverified recipient.' },
];
export const paymentRecords: EvidenceRow[] = [
  { label: 'Own trusted app · CREDIT ₹800 · festival refund', answer: 'Incoming record to verify in your own account', why: 'An account credit is different from authorising a debit; check the trusted account record.' },
  { label: 'Confirmation · PAY ₹800 TO Refund Desk', answer: 'Outgoing authorisation; cancel the claimed refund', why: 'Approving this screen sends money out; its label does not make it a refund.' },
  { label: 'Sender’s screenshot · “Payment successful”', answer: 'Not evidence of credit in your own account', why: 'A sender-controlled screenshot is not your bank’s transaction record.' },
];
export type PaymentDecision = { direction: string; payee: string; amount: string; action: string };
export function inspectPayment(decision: PaymentDecision) {
  if (decision.direction !== 'outgoing') return { correct: false, feedback: 'The mock screen says PAY FROM Asha TO Refund Desk: it authorises money leaving the account.' };
  if (decision.payee !== 'Refund Desk' || decision.amount !== '800') return { correct: false, feedback: 'Read all three fields: beneficiary Refund Desk, amount ₹800, outgoing direction. A matching amount alone does not verify the payee.' };
  if (decision.action !== 'cancel') return { correct: false, feedback: 'Cancel this outgoing authorisation and verify the refund independently. Do not share a PIN or OTP, or approve a debit to receive money.' };
  return { correct: true, feedback: 'Payment inspection: ₹800 would leave Asha’s account for unverified Refund Desk. Cancel the outgoing authorisation, keep PIN/OTP private and verify the refund through the known school route.' };
}
export const senderRows: EvidenceRow[] = [
  { label: 'Display name: “School Bank Support”', answer: 'A claimed identity, not verification', why: 'A display name can be chosen by the sender.' },
  { label: 'Actual sender: help@schoolbank-alerts.example', answer: 'Does not match the supplied schoolbank.example source', why: 'Read the actual address and compare it with the independently supplied organisation information.' },
  { label: 'Support number appears only inside this warning', answer: 'Obtain a contact independently', why: 'Do not use the suspicious message to choose its own verifier.' },
];
export const claimChecks: EvidenceRow[] = [
  { label: '“Your bank account needs KYC now”', answer: 'Check your existing trusted bank app or independently verified bank contact', why: 'The warning’s link and number are not independent evidence.' },
  { label: '“Your courier needs a redelivery fee”', answer: 'Check the order and courier through your original trusted booking route', why: 'Use your original record instead of the unsolicited link.' },
  { label: '“Top search result says this is support”', answer: 'Check the organisation’s genuine channel before using the number', why: 'Search rank and advertisements do not establish authority.' },
];
export const callRoutes: EvidenceRow[] = [
  { label: 'First independent check', answer: 'Previously saved relative contact', why: 'Use a route known before this demand arrived.' },
  { label: 'Second independent check', answer: 'Trusted adult checks through a separate known person or channel', why: 'Independence matters more than having two caller-supplied numbers.' },
  { label: 'Saved contact does not answer', answer: 'Claim remains unverified; do not transfer', why: 'No answer is not confirmation of the story or payment request.' },
];
export const responseControls = [
  { id: 'bank', label: 'Immediately contact bank/payment provider through a trusted channel', good: true, why: 'Prompt contact can help limit further harm; do not wait for a complete file.' },
  { id: 'report', label: 'Promptly report Indian financial cyber fraud via 1930 or cybercrime.gov.in', good: true, why: 'Use official reporting routes while seeking help, not a sender’s recovery link.' },
  { id: 'support', label: 'Involve a trusted adult and preserve available evidence without delaying contact', good: true, why: 'Support and evidence gathering can happen alongside urgent contact.' },
  { id: 'recovery', label: 'Pay a recovery agent before contacting the bank', good: false, why: 'A recovery fee or guarantee can be another fraud. Reporting does not guarantee recovery.' },
];
export const incident = { date: '18 August · fictional exercise', time: '14:12', amount: '800', reference: 'DEMO-TXN-204', event: 'Outgoing payment approved after an unverified refund message' };
export type MockReport = { time: string; amount: string; reference: string; event: string; redacted: boolean };
export function validateMockReport(report: MockReport) {
  if (report.time !== incident.time || report.amount !== incident.amount || report.reference !== incident.reference || report.event !== incident.event) return { correct: false, feedback: 'Use the supplied receipt: 14:12, ₹800, DEMO-TXN-204, outgoing payment after an unverified refund message. Do not invent missing details.' };
  if (!report.redacted) return { correct: false, feedback: 'Preserve relevant evidence and redact unrelated personal details in the classroom copy. Never include a PIN or OTP.' };
  return { correct: true, feedback: 'MOCK REPORT ONLY: 18 August, 14:12; ₹800; DEMO-TXN-204; outgoing payment after an unverified refund message. Relevant message and receipt retained; unrelated personal data redacted; no PIN/OTP included. No report was submitted.' };
}
export const capstoneRows: EvidenceRow[] = [
  { label: 'Security · receipt folder has public-link access', answer: 'Restrict evidence to named authorised people', why: 'Keep useful evidence without exposing unrelated personal data.' },
  { label: 'AI · assistant says “approve” without a source', answer: 'Check the advice against the supplied payment evidence', why: 'Confident text does not override the outgoing authorisation.' },
  { label: 'Logic · missing verification falls into “approve”', answer: 'Add an explicit unknown → pause/review route', why: 'Unknown is not the same as verified true.' },
  { label: 'Payment · PAY ₹800 TO Refund Desk', answer: 'Cancel outgoing authorisation and verify independently', why: 'A refund claim does not change the direction of payment.' },
];
export const nextActions: EvidenceRow[] = [
  { label: 'Next action 1', answer: 'Cancel the outgoing approval; keep PIN and OTP private', why: 'Stop the immediate unsafe action first.' },
  { label: 'Next action 2', answer: 'Check the refund through the previously known school contact', why: 'Confirm amount, recipient and process independently.' },
  { label: 'Next action 3', answer: 'Preserve restricted evidence; if a loss occurred, promptly contact bank and official reporting', why: 'Keep the record useful and private; urgent response must not wait for a perfect portfolio.' },
];
export const portfolioItems = [
  ['security', 'Security control', 'your-digital-risk-map', 'Public evidence link → named access and redaction'],
  ['ai', 'AI source/evaluation check', 'can-this-assistant-be-trusted', 'Uncited “approve” advice → compare with payment record'],
  ['logic', 'Algorithm trace or test', 'test-the-boundaries', 'Verification missing → pause/review; test the unknown case'],
  ['payment', 'Payment-verification record', 'before-you-approve-that-payment', 'PAY ₹800 TO Refund Desk → outgoing, cancel and verify'],
] as const;
export function portfolioFeedback(draft: Record<string, string>) {
  // Keep the complete reflection inside the existing 2,000-character activity payload limit.
  const reflection = (draft.notes ?? '').replace(/\p{Cc}/gu, ' ').slice(0, 300);
  return ` Portfolio sources: ${portfolioItems.map(([key, label]) => `${label}: ${draft[key] === 'earlier' ? 'my earlier work, to show my teacher' : 'supplied classroom replacement'}`).join('; ')}. Student reflection (teacher review): ${reflection || 'No written reflection added; discuss with teacher.'}`;
}
export const defenceRows: EvidenceRow[] = [
  { label: 'Message: “A private ₹950 transfer corrects your exam fee”', answer: 'Unverified claim', why: 'This is what the sender asserts, not what the supplied school evidence confirms.' },
  { label: 'Independent school notice contains no fee correction', answer: 'Correction not established by the supplied evidence', why: 'The pack does not confirm a correction; absence alone does not prove every possible future notice false.' },
  { label: 'Familiar voice and confident assistant support the transfer', answer: 'Insufficient independent verification', why: 'Sound and confidence do not establish the payment authority.' },
  { label: 'Safest next step while the claim is unresolved', answer: 'Pause payment and use the previously known school contact', why: 'Resolve the claim through an independent route before deciding.' },
];
export const fraudPractice = {
  'how-a-scam-builds-pressure': { brief: 'Inspect a fictional college offer. Urgency, authority, scarcity, secrecy and reward are warning signals. A signal calls for verification; it does not prove fraud by itself.', prompts: ['Map the five persuasion tactics.', 'Choose a response that follows the evidence.', 'Transfer the same method to a new notice.'] },
  'the-internship-that-pays-too-well': { brief: 'Compare the fictional offer with the independently supplied official-source pack. All .example addresses are reserved fictional names and cannot verify real organisations.', prompts: ['Inspect the exact sender, fee and document request.', 'Build a due-diligence checklist without disclosing identity documents.', 'Respond to a new scholarship offer with missing evidence.'] },
  'before-you-approve-that-payment': { brief: 'All screens and amounts are simulated. Inspect direction, beneficiary and amount. Receiving money does not require sharing an OTP or approving an outgoing payment with a UPI PIN.', prompts: ['Inspect the mock authorisation fields before deciding.', 'Classify the supplied payment records.', 'Respond when the payment beneficiary changes.'] },
  'when-the-message-looks-official': { brief: 'Compare display name, actual address and independent source. A logo, good grammar or search rank cannot verify a support channel.', prompts: ['Inspect the bank-warning artifact.', 'Map each claim to an independent check.', 'Handle an official-looking message without obvious spelling errors.'] },
  'a-familiar-voice-asks-for-money': { brief: 'A familiar voice or video is insufficient identity evidence. Rehearse ending a pressured call and verifying through previously known routes with a trusted adult.', prompts: ['Make two calm decisions in the simulated call.', 'Build a two-channel verification plan.', 'Respond to a new authority-and-secrecy demand.'] },
  'what-to-do-after-a-loss': { brief: 'For real Indian financial cyber fraud, immediately contact bank/payment provider using a trusted channel and promptly report via 1930 or cybercrime.gov.in, with trusted-adult support. Do not delay contact to collect a perfect file. This exercise never submits a report.', prompts: ['Choose prompt contacts and supportive actions.', 'Assemble a redacted MOCK report from the supplied receipt.', 'Challenge a promise of guaranteed recovery.'] },
  'integrated-case-the-festival-refund': { brief: 'Annual capstone, lesson 1 of 2. Combine a security control, checked AI advice, an explicit unknown route and payment-direction evidence. A real refund due does not authorise an unverified outgoing payment.', prompts: ['Connect the four modules to the evidence pack.', 'Update only the conclusion supported by new evidence.', 'Set the next three actions and label the portfolio sources.'] },
  'defend-your-decision': { brief: 'Annual capstone, lesson 2 of 2. Fresh classroom case: exam-fee correction, ₹950 private transfer, familiar voice and uncited assistant advice; independent notice does not confirm a correction. Prepare a two-minute individual defence for teacher review.', prompts: ['Separate claim, evidence and unresolved questions.', 'Challenge unsafe advice and revise the decision.', 'Prepare your evidence, alternative, uncertainty and reflection.'] },
};
export const fraudStoryTasks = [
  { title: 'Asha spots the pressure', concepts: ['Urgency, authority, scarcity, secrecy, reward', 'A warning sign is not proof by itself', 'Pause and verify through a separate trusted route'], question: 'The offer asks for a payment in five minutes. What is a supported next step?', choices: ['Pay now to avoid missing out', 'Pause and check through an independently located college contact', 'Publicly accuse the named organisation without checking'], answer: 1, why: 'A pressured claim needs independent verification; neither paying nor publicly accusing is supported by the message alone.' },
  { title: 'Kabir checks the internship', concepts: ['Verify the exact offer and recruiter', 'Compare fee and document stage with the source pack', 'Keep identity documents private while unresolved'], question: 'The independent pack says no fee or ID upload at this stage. What should Kabir do?', choices: ['Pay to reserve the role', 'Send half an ID scan first', 'Reject these instructions and check through the official application route'], answer: 2, why: 'The fee and document requests contradict the supplied independent process; do not disclose or pay to test them.' },
  { title: 'Asha pauses the payment', concepts: ['Read direction, beneficiary and amount', 'A refund promise does not change a debit', 'Keep PIN/OTP private and check your trusted account record'], question: 'The refund message opens PAY ₹800 TO Refund Desk. What should Asha do?', choices: ['Cancel and verify the refund independently', 'Approve the outgoing payment to receive the refund', 'Share her PIN with the sender'], answer: 0, why: 'This screen authorises an outgoing payment to an unverified payee. Cancel and independently verify the refund.' },
  { title: 'Kabir checks the sender', concepts: ['Display name differs from actual sender', 'A suspicious message cannot verify its own number', 'Use an existing trusted app or independently obtained contact'], question: 'Where should Kabir check an unsolicited bank-account warning?', choices: ['The number inside the warning', 'His existing trusted bank app or independently verified bank contact', 'Whichever link has the best logo'], answer: 1, why: 'Use a route independent of the message, not its own number or branding.' },
  { title: 'Asha ends the pressured call', concepts: ['Familiar sound is insufficient identity evidence', 'End the call and use a previously known contact', 'An unanswered check leaves the claim unverified'], question: 'A familiar voice asks for secret emergency money. What is the safe next action?', choices: ['Send a small test payment', 'Stay on the call and follow the new number', 'End the call and verify through a known contact with adult support'], answer: 2, why: 'The caller must not control the verification route. End the call and use a previously known independent contact.' },
  { title: 'Kabir builds a response plan', concepts: ['Immediate bank/provider contact through a trusted channel', 'Prompt official reporting and trusted-adult support', 'Preserve evidence without delaying urgent contact; recovery is not guaranteed'], question: 'After an actual suspected financial cyber-fraud loss, what comes first?', choices: ['Prompt bank contact, trusted-adult help and official reporting', 'Wait for every screenshot before contacting anyone', 'Pay a recovery fee to the sender'], answer: 0, why: 'Seek prompt bank/provider help and official reporting; evidence gathering must not delay urgent contact, and a recovery fee can cause further loss.' },
  { title: 'The festival refund investigation', concepts: ['Security access + checked AI advice + explicit unknown route', 'Inspect payment direction and beneficiary', 'A refund due does not validate this outgoing instruction'], question: 'A confident assistant recommends approving an outgoing refund payment. What should the team do?', choices: ['Approve because ₹800 matches the message', 'Cancel and verify through the known school route', 'Treat the assistant’s confidence as proof'], answer: 1, why: 'The outgoing screen contradicts the refund claim. AI confidence and a matching amount do not establish payment authority.' },
  { title: 'The individual decision defence', concepts: ['Separate claim, evidence and uncertainty', 'Use four portfolio items with honest source labels', 'Teacher reviews the individual two-minute defence and reflection'], question: 'The school pack does not confirm the private exam-fee transfer. What is supported?', choices: ['Send a small test transfer', 'Follow the confident assistant', 'Pause and verify through the previously known school contact'], answer: 2, why: 'The claim remains unresolved. A familiar voice or confident assistant is not independent payment authority.' },
];
