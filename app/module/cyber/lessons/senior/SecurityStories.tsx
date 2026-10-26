"use client";

import { Check, Clock, FileText, FolderLock, Globe, HardDrive, KeyRound, Map, ShieldCheck, TriangleAlert, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { SceneSwap } from "../new/story/StoryPlayer";
import type { StoryChapter, StoryScript, StoryWorldProps } from "../new/story/types";
import k from "../new/story/story-player.module.css";
import v from "./security.module.css";
import { loginEvents, reviewControls } from "./security-content";
import { securityArtwork } from "./security-art";

type StoryData = { title: string; icon: LucideIcon; panels: { heading: string; facts: string[] }[]; task: string; choices: { label: string; why: string; correct?: boolean }[] };
const stories: Record<string, StoryData> = {
  "your-digital-risk-map": {
    title: "Asha's festival risk desk", icon: Map,
    panels: [
      { heading: "One festival. Three things to protect.", facts: ["Registration list · private contact details", "Payment sheet · accurate supplier amounts", "Gate laptop · available when visitors arrive"] },
      { heading: "The link escaped the team", facts: ["Registrations.csv: anyone with the link can view", "A supplier forwards the link to a public group", "Student contact details could be copied"] },
      { heading: "Describe the chain", facts: ["Asset: the registration list", "Threat: an unauthorised person downloads it", "Vulnerability: public-link sharing", "Control: named access for organisers"] },
      { heading: "What is the weakness?", facts: ["The registration list contains information worth protecting.", "A harmful download is a possible event.", "Find the setting that makes that event easier."] },
      { heading: "Now the team can act", facts: ["Restrict the link to named organisers", "Check what was exposed with the teacher", "Record what is known and what remains uncertain"] },
      { heading: "Protect more than secrecy", facts: ["Confidentiality: who can see contacts?", "Integrity: who can change amounts?", "Availability: will the gate system work?", "Next: build and prioritise your risk register"] },
    ], task: "Choose the vulnerability in the registration-list case.", choices: [
      { label: "The registration list", why: "The list is the asset. Which setting makes unwanted access possible?" },
      { label: "Anyone-with-link sharing", correct: true, why: "The open sharing setting is the vulnerability." },
      { label: "An unauthorised download", why: "That is a threat event. Identify the weakness it could use." },
    ],
  },
  "identity-beyond-a-password": {
    title: "Kabir's missing sign-in phone", icon: KeyRound,
    panels: [
      { heading: "The festival account needs its organiser", facts: ["Kabir uses an individual account", "A password manager stores a unique password", "His phone provides the second sign-in factor"] },
      { heading: "The phone is missing", facts: ["Kabir still knows the official service address", "A recovery code exists", "But where was that code stored?"] },
      { heading: "Plan for losing the sign-in device", facts: ["Password: long and unique", "MFA or a supported passkey: stronger sign-in", "Recovery: private and available independently of the lost phone"] },
      { heading: "Choose a usable recovery route", facts: ["The old phone is unavailable", "The team group includes suppliers", "An offline recovery code is stored privately"] },
      { heading: "Recover, then review", facts: ["Use the known provider's recovery process", "Review and revoke the lost device's sessions", "Register the replacement method and refresh recovery options"] },
      { heading: "Identity is only the first question", facts: ["Authentication: is this Kabir?", "Authorisation: what may Kabir access?", "Next: test protection, recovery and access decisions"] },
    ], task: "Where should a recovery code be available if the sign-in phone is lost?", choices: [
      { label: "Only in a screenshot on that phone", why: "That copy is unavailable with the phone. Recovery must survive the loss." },
      { label: "In the festival's public group", why: "A recovery code can grant account access. Keep it private." },
      { label: "In private storage independent of that phone", correct: true, why: "Recovery stays private and survives the lost device." },
    ],
  },
  "who-should-have-access": {
    title: "Asha's open festival folder", icon: FolderLock,
    panels: [
      { heading: "Fest Team Drive", facts: ["Asha updates registrations", "The teacher reads progress", "The supplier delivers equipment"] },
      { heading: "Everyone was made an editor", facts: ["Supplier: can read contact details", "Guest: can change the registration file", "Former organiser Dev: still in the organiser group"] },
      { heading: "Grant access for the task", facts: ["Registration lead: edit", "Oversight teacher: view", "Equipment supplier: no registration access", "Guest programme link: expire after the event"] },
      { heading: "One share removed. Is access gone?", facts: ["Dev's direct share: removed", "Dev's organiser-group membership: active", "The organiser group can still open the folder"] },
      { heading: "Test every access route", facts: ["Remove former members from relevant groups", "Review direct shares and public links", "Test as the affected role before calling the change complete"] },
      { heading: "A smaller permission set still works", facts: ["Organisers can do their work", "Suppliers receive only delivery information", "Next: configure and test three access cases"] },
    ], task: "Dev has left. The direct share is removed but the organiser group still grants access. What should change?", choices: [
      { label: "Nothing: the direct share was removed", why: "Group membership can still grant access. Check inherited permissions." },
      { label: "Remove Dev from the relevant group and test again", correct: true, why: "Both direct and inherited access routes need review." },
      { label: "Make the whole folder public", why: "Public sharing would expose it to more people." },
    ],
  },
  "what-a-browser-can-tell-you": {
    title: "Kabir inspects the address bar", icon: Globe,
    panels: [
      { heading: "A programme link arrives", facts: ["Display title: Cyberpur School Festival", "A familiar crest appears", "The page asks Kabir to sign in"] },
      { heading: "Read beyond the familiar words", facts: ["https://cyberpurschool.example.verify-event.example/login", "Known school host: cyberpurschool.example", "A familiar word can appear inside a different hostname"] },
      { heading: "A connection is not an endorsement", facts: ["HTTPS protects the connection to the shown hostname", "The site operator can still be untrustworthy", "Verify through an independently known school route"] },
      { heading: "Which address did the browser open?", facts: ["Hostname comes after https:// and before the next slash", "Do not use the page heading as the address", "Compare the complete hostname"] },
      { heading: "Kabir takes an independent route", facts: ["He uses the address from the school diary", "He checks with the school rather than replying to the sender", "He does not enter credentials into the supplied page"] },
      { heading: "Check permissions too", facts: ["A programme page does not need the contact list", "Connection clues have limits", "Next: inspect three fictional browser cases"] },
    ], task: "Which hostname is actually in the supplied address bar?", choices: [
      { label: "cyberpurschool.example", why: "That is only the familiar beginning. Read through to the next slash." },
      { label: "cyberpurschool.example.verify-event.example", correct: true, why: "That full hostname differs from the known school host." },
      { label: "Cyberpur School Festival", why: "That is a page title, which its author can choose." },
    ],
  },
  "data-has-a-lifecycle": {
    title: "Asha trims the registration form", icon: FileText,
    panels: [
      { heading: "A form for programme updates", facts: ["Purpose: send updates through school email", "Requested: school email, home address, ID scan, bank details", "Every extra field creates another record to protect"] },
      { heading: "More data is not automatically better", facts: ["Home address is unrelated to email updates", "ID scans are unnecessary for the stated purpose", "Bank details are unnecessary when no payment is involved"] },
      { heading: "Follow data through its lifecycle", facts: ["Collect only what the purpose requires", "Store it with restricted access", "Set a justified retention plan", "Delete or anonymise when the purpose ends, subject to authorised holds"] },
      { heading: "Keep only a necessary field", facts: ["The team only sends programme updates", "The contact channel is school email", "No delivery, identity check or payment is part of this form"] },
      { heading: "The smaller form still works", facts: ["School email: collected for updates", "Home address, ID and bank fields: removed", "Registration team access: restricted"] },
      { heading: "The festival ends. Data needs a decision.", facts: ["Completed follow-up: apply the stated deletion plan", "Planning: prefer anonymous totals", "Active complaint: restrict relevant records for authorised review", "Next: build, restrict and retire a fictional dataset"] },
    ], task: "Which field does this programme-update form need?", choices: [
      { label: "Government ID scan", why: "The stated purpose does not require an identity document." },
      { label: "School email", correct: true, why: "School email is the contact channel needed for these updates." },
      { label: "Bank account details", why: "No payment is part of this form." },
    ],
  },
  "devices-updates-and-backups": {
    title: "The gate laptop stops working", icon: HardDrive,
    panels: [
      { heading: "Visitors arrive at the festival", facts: ["The gate needs a readable registration list", "The team shares one laptop", "The expected list has 42 registrations"] },
      { heading: "At 10:30, the working file becomes empty", facts: ["A duplicate on the same laptop may share its failure", "Sync has copied the empty file", "A separate 10:00 version still has 42 records"] },
      { heading: "A backup must be recoverable", facts: ["Separate copy: survives a device failure", "Versions: can recover before corruption", "Restoration test: checks contents and access", "Preserve the original while practising"] },
      { heading: "Choose a recovery point", facts: ["Corruption began at 10:30", "Newest synced copy: 0 records", "Separate 10:00 version: 42 records"] },
      { heading: "Restore to a new folder", facts: ["The separate 10:00 version opens", "42 expected registrations are checked", "The gate account's access is tested", "The original is preserved"] },
      { heading: "Protect the device before the next event", facts: ["Use trusted updates and individual accounts", "Lock unattended sessions", "Next: repair settings and test two recovery cases"] },
    ], task: "Which copy should the team test first after the 10:30 corruption?", choices: [
      { label: "The newest synced empty file", why: "Sync copied the corruption. Newest is not necessarily usable." },
      { label: "A duplicate on the unavailable laptop", why: "A copy on the failed device cannot provide an independent fallback." },
      { label: "The separate 10:00 version with 42 records", correct: true, why: "It predates the corruption and can be restored independently." },
    ],
  },
  "the-suspicious-login": {
    title: "Kabir reconstructs an account alert", icon: Clock,
    panels: [
      { heading: "A sign-in notification arrives", facts: ["09:00 · recognised school laptop", "09:12 · unfamiliar session", "A different city label appears"] },
      { heading: "The unfamiliar session downloads a file", facts: ["09:14 · registrations.csv downloaded", "09:20 · Asha does not recognise the session", "The team needs to act without accusing someone"] },
      { heading: "Keep three kinds of statement separate", facts: ["Observation: what the supplied record says", "Hypothesis: a possible explanation to verify", "Unsupported claim: a conclusion the evidence cannot establish"] },
      { heading: "What does the city label prove?", facts: ["Location labels may be approximate", "An unfamiliar session merits checking", "No supplied record identifies a particular student"] },
      { heading: "Preserve, verify and contain", facts: ["Keep the relevant alert and event details", "Verify through a known channel with Asha", "Review and revoke unrecognised sessions", "Escalate possible data exposure to the teacher"] },
      { heading: "A timeline is stronger than a guess", facts: ["Separate observed facts from explanations", "Record missing evidence and uncertainty", "Next: reconstruct, classify and respond to a fresh case"] },
    ], task: "A city label differs. Which conclusion is supported?", choices: [
      { label: "It proves a particular student stole the file", why: "The records do not identify an attacker. Do not turn a location label into an accusation." },
      { label: "It is an indicator to verify with other evidence", correct: true, why: "Treat it as an indicator, then check the session and account owner's response." },
      { label: "Delete the logs before anyone sees them", why: "Deleting relevant records would destroy evidence needed for a responsible response." },
    ],
  },
  "security-design-review": {
    title: "The festival team's security hearing", icon: ShieldCheck,
    panels: [
      { heading: "The team presents its plan", facts: ["Risk: exposed registration folder", "Risk: gate laptop failure", "Risk: stolen password", "Budget: 6 tokens"] },
      { heading: "Every choice has a cost", facts: ["Named access: 2 tokens", "Tested separate backup: 2 tokens", "Protected individual accounts: 2 tokens", "Poster redesign: 2 tokens"] },
      { heading: "Match controls to failure modes", facts: ["Named access → reduces public exposure", "Tested backup → supports recovery", "MFA and recovery → protect sign-in", "No control removes every risk"] },
      { heading: "Does the backup protect confidentiality?", facts: ["A backup can recover lost information", "It does not remove a public sharing link", "The exposed folder needs an access-control change"] },
      { heading: "New evidence arrives", facts: ["A laptop is lost with an active session", "MFA does not automatically end that session", "Revoke access, assess exposure and verify the backup with the teacher"] },
      { heading: "Defend the design, including its limits", facts: ["Explain each control and its cost", "Name one remaining risk", "Revise the design when evidence changes", "Next: complete the module's design review"] },
    ], task: "Which control directly reduces a public registration-folder exposure?", choices: [
      { label: "A tested backup alone", why: "A backup supports recovery but does not restrict the public link." },
      { label: "A more colourful poster", why: "Poster design does not control who can open registrations." },
      { label: "Named access and review of sharing links", correct: true, why: "This directly changes who can reach the exposed data." },
    ],
  },
};

function StoryArtifact({ slug, scene }: { slug: string; scene: number }) {
  const resolved = scene >= 4;
  if (slug === "what-a-browser-can-tell-you") return <div className={v.browser}>
    <div className={v.address}><Globe aria-hidden="true" /><code>{resolved ? "https://cyberpurschool.example/events" : "https://cyberpurschool.example.verify-event.example/login"}</code></div>
    <div className={v.webpage}><span>{resolved ? "Address from school diary" : "Supplied link · unverified"}</span><h3>Cyberpur School Festival</h3><p>{resolved ? "Programme · Friday · School hall" : "Sign in to confirm your place"}</p></div>
  </div>;
  if (slug === "who-should-have-access") return <div className={v.artifact}>
    <div className={v.appBar}><FolderLock aria-hidden="true" /><strong>Fest Team Drive</strong></div>
    {[["Asha", "Edit registrations"], ["Teacher", resolved ? "View progress" : "Edit everything"], ["Supplier", resolved ? "Delivery note only" : "Edit registrations"], ["Dev · departed", resolved ? "Access removed and tested" : "Organiser group: active"]].map(([person, permission]) => <div className={v.artifactRow} key={person}><span>{person}</span><strong>{permission}</strong></div>)}
  </div>;
  if (slug === "data-has-a-lifecycle") return <div className={v.artifact}>
    <div className={v.appBar}><FileText aria-hidden="true" /><strong>Programme updates · draft form</strong></div>
    {["School email", "Home address", "Government ID scan", "Bank details"].map((field, index) => <div className={v.artifactRow} data-removed={resolved && index > 0} key={field}><span>{field}</span><strong>{resolved && index > 0 ? "Removed: unnecessary" : index === 0 ? "student@school.example" : "Requested in draft"}</strong></div>)}
  </div>;
  if (slug === "devices-updates-and-backups") return <div className={v.artifact}>
    <div className={v.appBar}><HardDrive aria-hidden="true" /><strong>Registration recovery desk</strong></div>
    {[["Working laptop", scene > 0 ? "0 records · corrupted" : "42 registrations"], ["Newest synced copy", scene > 0 ? "0 records · same corruption" : "Synced"], ["Separate 10:00 version", resolved ? "Restored · 42 records verified" : "42 records · available"]].map(([copy, status]) => <div className={v.artifactRow} key={copy}><span>{copy}</span><strong>{status}</strong></div>)}
  </div>;
  if (slug === "the-suspicious-login") return <div className={v.artifact}>
    <div className={v.appBar}><Clock aria-hidden="true" /><strong>Supplied account events</strong></div>
    {loginEvents.slice(0, scene === 0 ? 2 : 4).map(event => <div className={v.artifactRow} key={event.id}><time>{event.time}</time><span>{event.text}</span></div>)}
  </div>;
  if (slug === "identity-beyond-a-password") return <div className={v.artifact}>
    <div className={v.appBar}><KeyRound aria-hidden="true" /><strong>Kabir · festival account</strong></div>
    {[["Password manager", "Unique password · private"], ["Sign-in phone", scene === 0 ? "Available" : resolved ? "Old sessions revoked" : "Missing"], ["Independent recovery", resolved ? "Used privately · refreshed" : "Private code available"]].map(([control, status]) => <div className={v.artifactRow} key={control}><span>{control}</span><strong>{status}</strong></div>)}
  </div>;
  if (slug === "security-design-review") return <div className={v.artifact}>
    <div className={v.appBar}><ShieldCheck aria-hidden="true" /><strong>Security budget · 6 tokens</strong></div>
    {reviewControls.map(control => <div className={v.artifactRow} key={control.id}><span>{control.label}</span><strong>{scene > 1 && control.id !== "poster" ? "Selected · 2" : "Cost: 2"}</strong></div>)}
  </div>;
  return <div className={v.artifact}>
    <div className={v.appBar}><Map aria-hidden="true" /><strong>Registration list · risk map</strong></div>
    <div className={v.riskChain}><span>Registration list<small>Asset</small></span><b aria-hidden="true">→</b><span>Unauthorised download<small>Threat</small></span></div>
    <div className={v.artifactRow}><span>Sharing setting</span><strong>{resolved ? "Named organisers only" : "Anyone with link"}</strong></div>
    <div className={v.artifactRow}><span>Exposure review</span><strong>{resolved ? "Teacher informed · uncertainty recorded" : "Not yet reviewed"}</strong></div>
  </div>;
}

function SecurityWorld({ slug, data, scene, playing, elapsed, solved, markSolved, hint, setHint, reduced }: StoryWorldProps & { slug: string; data: StoryData }) {
  const [choice, setChoice] = useState("");
  const panel = data.panels[scene];
  const Icon = data.icon;
  const artwork = securityArtwork[slug];
  const illustrated = scene === 0 || (scene === 4 && slug === "devices-updates-and-backups");
  return <SceneSwap scene={scene} reduced={reduced}><div className={v.storyBoard}>
    <div className={v.appBar}><Icon aria-hidden="true" /><strong>Cyberpur · Class 11 festival team</strong></div>
    <h2 style={{ marginTop: 18 }}>{panel.heading}</h2>
    {illustrated ? <figure className={v.sceneIllustration}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={artwork.src} alt={artwork.alt} width={1400} height={788} decoding="async" />
      <figcaption>{artwork.caption}</figcaption>
    </figure> : <>
      <StoryArtifact slug={slug} scene={scene} />
      <div className={v.storyFacts}>{panel.facts.map((fact, index) => <div className={v.storyFact} data-active={!playing || elapsed >= index * 3} key={fact}>{scene === 1 ? <TriangleAlert aria-hidden="true" /> : <Check aria-hidden="true" />}<span>{fact}</span></div>)}</div>
    </>}
    {scene === 3 && !solved && <div className={v.board}><p><strong>{data.task}</strong></p><div className={v.actionBank}>{data.choices.map(item => <button className={k.primary} type="button" aria-pressed={choice === item.label} key={item.label} onClick={() => { setChoice(item.label); setHint(""); }}>{item.label}</button>)}</div><button type="button" className={k.primary} disabled={!choice} onClick={() => { const answer = data.choices.find(item => item.label === choice)!; if (answer.correct) markSolved(); else setHint(answer.why, false); }}>Test my decision</button></div>}
    {hint && <p className={k.hint} role="status">{hint}</p>}
    <small className={k.note}>Fictional records and accounts. No personal credentials are needed.</small>
  </div></SceneSwap>;
}

export function makeSecurityStory(slug: string, script: StoryScript): StoryChapter {
  const data = stories[slug];
  return {
    title: data.title, icon: data.icon, script,
    character: slug === "your-digital-risk-map" || slug === "who-should-have-access" || slug === "data-has-a-lifecycle" ? { asset: "girl-expressions", name: "Asha" } : { asset: "emotional-avatar", name: "Kabir" },
    interactionScene: 3, beginLabel: "Enter the security lab",
    waitingText: "Story paused. Test your decision to continue.", lockedHint: "Complete the festival team's decision first.",
    World: function World(props: StoryWorldProps) { return <SecurityWorld {...props} data={data} slug={slug} />; },
  };
}
