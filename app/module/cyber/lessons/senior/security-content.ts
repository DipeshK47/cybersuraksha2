export const riskTerms = ["Asset", "Threat", "Vulnerability", "Control"];
export const riskCards = [
  { label: "Festival registration list", answer: "Asset", why: "The list is information the team values and needs to protect." },
  { label: "Someone downloads private registrations", answer: "Threat", why: "This is a harmful event that could happen." },
  { label: "The folder allows anyone with its link to view", answer: "Vulnerability", why: "The open sharing setting is a weakness the threat could use." },
  { label: "Limit the folder to named organisers", answer: "Control", why: "A safeguard changes who can access the asset." },
];
export const impactCards = [
  { label: "Contact details become public", answer: "Confidentiality", why: "Confidentiality concerns who can see information." },
  { label: "A supplier's payment amount is changed without permission", answer: "Integrity", why: "Integrity concerns information staying accurate and unaltered by unauthorised people." },
  { label: "The only registration laptop fails at the gate", answer: "Availability", why: "Availability concerns being able to use a service when needed." },
];
export const priorities = [
  { id: "folder", label: "Public registration folder", likelihood: 3, impact: 3, reason: "Personal details are already accessible through the public link." },
  { id: "laptop", label: "Single gate laptop, no backup", likelihood: 2, impact: 3, reason: "A device failure could stop entry and there is no tested fallback." },
  { id: "poster", label: "One editable poster copy", likelihood: 1, impact: 2, reason: "An unwanted edit is possible, but the approved original can be restored." },
];

export const identityControls = [
  { id: "unique", label: "A different long password stored in a password manager", good: true, why: "A leak from another service should not unlock this one." },
  { id: "mfa", label: "MFA or a supported passkey; keep recovery options available", good: true, why: "Add protection beyond a reusable password and plan for a lost device." },
  { id: "recovery", label: "Recovery codes stored privately away from the sign-in phone", good: true, why: "Recovery must still be available after the phone is lost." },
  { id: "share", label: "Put the password and recovery codes in the team group", good: false, why: "A shared group is not private credential storage. Use individual accounts and assigned roles." },
];
export const recoverySteps = [
  "Open the provider's known recovery page on a trusted device",
  "Use a privately stored recovery method to prove account ownership",
  "Review sessions and revoke the lost device's access",
  "Set up the replacement sign-in method and refresh recovery options",
];
export const authCards = [
  { label: "The service verifies Asha's passkey", answer: "Authentication", why: "Authentication checks who is signing in." },
  { label: "Asha may edit registration records but a guest may only view the programme", answer: "Authorisation", why: "Authorisation controls what an identified person can do." },
  { label: "A signed-in former supplier cannot open the private folder", answer: "Authorisation", why: "A successful sign-in does not grant access to every resource." },
];

export type Permission = "No access" | "View" | "Edit";
export const accessTasks = [
  { prompt: "Give each person only the access their task requires.", rows: [
    { label: "Asha · registration lead", need: "Update the registration sheet", answer: "Edit" as Permission },
    { label: "Supplier · equipment delivery", need: "Does not need student registration data", answer: "No access" as Permission },
    { label: "Teacher · oversight", need: "Read the current registration sheet", answer: "View" as Permission },
  ], test: "Supplier · equipment delivery", consequence: "A supplier can deliver equipment without seeing student registrations." },
  { prompt: "An external guest needs the programme until Friday, not the registration sheet.", rows: [
    { label: "Guest · programme.pdf", need: "Read the public programme", answer: "View" as Permission },
    { label: "Guest · registrations.csv", need: "No registration task", answer: "No access" as Permission },
    { label: "Anyone with link · registrations.csv", need: "Private data must not be publicly accessible", answer: "No access" as Permission },
  ], test: "Anyone with link · registrations.csv", consequence: "The guest's programme access expires Friday. The private sheet stays restricted." },
  { prompt: "Dev has left the team. Remove every route into the private folder.", rows: [
    { label: "Dev · direct share", need: "Former organiser", answer: "No access" as Permission },
    { label: "Dev · organiser group membership", need: "Inherited access must also end", answer: "No access" as Permission },
    { label: "Asha · current organiser", need: "Still manages registrations", answer: "Edit" as Permission },
  ], test: "Dev · organiser group membership", consequence: "Removing a direct share is insufficient while a group still grants access." },
];

export const browserTasks = [
  { address: "https://cyberpurschool.example.verify-event.example/login", expectedHost: "cyberpurschool.example.verify-event.example", hosts: ["cyberpurschool.example", "cyberpurschool.example.verify-event.example", "https"], prompt: "Read the address bar. Which is the actual hostname?", note: "The school's known hostname is cyberpurschool.example. Read the full hostname, not a familiar word inside it." },
  { address: "https://fest-support.example/account", expectedHost: "fest-support.example", hosts: ["Cyberpur School Support", "fest-support.example", "account"], prompt: "This page uses HTTPS. Identify the hostname and assess what the connection indicator proves.", note: "HTTPS protects the connection to this hostname. It does not prove the operator is your school." },
  { address: "https://cyberpurschool.example/events", expectedHost: "cyberpurschool.example", hosts: ["events", "cyberpurschool.example", "School Festival"], prompt: "You typed the school's known address yourself. Identify the hostname and check the permissions request.", note: "A programme page can display event times without access to your contacts. Approve only permissions needed for the task." },
];

export const lifecycleTasks = [
  { prompt: "Build a minimal festival sign-up form for programme updates.", purpose: "Send programme updates to students through their school email.", rows: [
    { label: "School email", answer: "Collect", why: "This is the contact channel required by the stated purpose." },
    { label: "Home address", answer: "Do not collect", why: "Programme updates do not require a home address." },
    { label: "Government ID scan", answer: "Do not collect", why: "The stated purpose does not justify collecting an identity document." },
    { label: "Bank details", answer: "Do not collect", why: "No payment is part of this registration." },
  ], options: ["Collect", "Do not collect"] },
  { prompt: "Choose the audience for the records the team already holds.", purpose: "The catering lead needs dietary requirements; the public needs only the programme.", rows: [
    { label: "Dietary requirements linked to participant ID", answer: "Catering lead only", why: "Only the role serving this purpose should see these details." },
    { label: "Registration contact list", answer: "Named registration team", why: "The registration team needs the list, but suppliers and the public do not." },
    { label: "Approved festival programme", answer: "Public", why: "The approved programme is intended for a public audience." },
  ], options: ["Public", "Named registration team", "Catering lead only"] },
  { prompt: "The festival is over. Apply this fictional school's stated retention plan.", purpose: "For this exercise: remove contact exports after follow-up ends; retain the anonymous attendance total; hold records relevant to an active complaint for authorised review.", rows: [
    { label: "Contact export · follow-up finished", answer: "Delete securely", why: "Its stated purpose has ended and the exercise policy calls for removal." },
    { label: "Anonymous attendance total", answer: "Keep anonymous summary", why: "The total supports planning without retaining identifiable records." },
    { label: "Records relevant to an active complaint", answer: "Restrict and review", why: "Restrict relevant evidence and follow the authorised review process instead of deleting it blindly." },
  ], options: ["Delete securely", "Keep anonymous summary", "Restrict and review"] },
];

export const deviceControls = [
  { id: "updates", label: "Install updates from the device's trusted update service", good: true, why: "Trusted updates can repair known weaknesses." },
  { id: "lock", label: "Turn on screen lock and use individual accounts", good: true, why: "An unattended shared device should not expose an active account." },
  { id: "backup", label: "Keep a separate, versioned backup and test restoration", good: true, why: "A backup needs to survive the same failure and produce a usable restored copy." },
  { id: "download", label: "Install the security patch attached to an unknown message", good: false, why: "A message attachment is not a trusted software update source." },
];
export const backupVersions = [
  { id: "same", label: "11:00 · duplicate on the failed laptop", safe: false, why: "A copy on the failed device is not available after that device fails." },
  { id: "clean", label: "10:00 · separate backup · 42 valid registrations", safe: true, why: "This separate copy predates the 10:30 corruption and contains the expected 42 records." },
  { id: "bad", label: "11:00 · synced copy · 0 registrations", safe: false, why: "Sync copied the corruption too. Newest is not always recoverable." },
];
export const restoredRecords = ["REG-041 · Mira · confirmed", "REG-042 · Aman · confirmed", "REG-043 · Jo · confirmed"];

export const loginEvents = [
  { id: "a", time: "09:00", text: "Asha signs in on the school laptop; MFA succeeds." },
  { id: "b", time: "09:12", text: "A sign-in from an unfamiliar device succeeds; its city label differs." },
  { id: "c", time: "09:14", text: "The unfamiliar session downloads registrations.csv." },
  { id: "d", time: "09:20", text: "Asha says she does not recognise the unfamiliar session." },
];
export const loginClaims = [
  { label: "A new device downloaded the registration file at 09:14", answer: "Observed in supplied records", why: "The supplied download event records that action." },
  { label: "The city label proves which student did it", answer: "Unsupported conclusion", why: "Location labels can be approximate and do not identify a person." },
  { label: "The account may have been accessed without permission", answer: "Hypothesis to verify", why: "The unfamiliar session and owner's response support investigation, not certainty about an attacker." },
];
export const responseSteps = [
  "Preserve the supplied alert and event details; verify with Asha through a known channel",
  "With the account owner, revoke the unrecognised session through the known service",
  "Review sign-in and recovery settings and secure the account",
  "Escalate the possible data exposure to the responsible teacher",
];

export const reviewControls = [
  { id: "access", label: "Named access and prompt removal of former members", cost: 2, covers: "Public link exposure", why: "This directly restricts the exposed registration folder." },
  { id: "backup", label: "Separate backup with a restoration test", cost: 2, covers: "Gate laptop failure", why: "A tested separate copy provides a fallback after device failure." },
  { id: "identity", label: "Individual accounts, MFA and private recovery", cost: 2, covers: "Stolen password", why: "This reduces the risk of password-only account takeover." },
  { id: "poster", label: "Redesign the festival poster", cost: 2, covers: "Poster readability", why: "This does not address the three stated security priorities." },
];
export function selectedExactly(actual: string[], expected: string[]) {
  return actual.length === expected.length && new Set(actual).size === actual.length && expected.every(id => actual.includes(id));
}
export function firstMismatch(rows: { label: string; answer: string; why?: string }[], answers: Record<string, string>) {
  return rows.find(row => answers[row.label] !== row.answer);
}
export function inOrder(actual: string[], expected: string[]) {
  return actual.length === expected.length && actual.every((value, index) => value === expected[index]);
}
export function reviewCoverage(selected: string[], budget: number) {
  const chosen = reviewControls.filter(control => selected.includes(control.id));
  const cost = chosen.reduce((sum, control) => sum + control.cost, 0);
  return { cost, valid: cost <= budget && ["access", "backup", "identity"].every(id => selected.includes(id)) };
}
