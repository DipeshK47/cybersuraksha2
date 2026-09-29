"use client";

import { Check, Eye, Gamepad2, KeyRound, Mail, MapPin, Play, RotateCcw, ShieldCheck, Smartphone, UsersRound } from "lucide-react";
import { useState } from "react";
import type { CyberLessonComponentProps } from "../../lesson-types";
import { PracticeShell, usePractice } from "./PracticeShell";
import { friendPasswordPieces, passwordExamples } from "./password-examples";
import s from "./practice.module.css";
import v from "./security-practice.module.css";

type Props = CyberLessonComponentProps;
type Submit = (correct: boolean, feedback: string, unsafe?: boolean) => void;

const vaultTasks = [
  { prompt: "Rohan123 uses his name. Choose two word tiles to make a different password for his game.", pieces: [...passwordExamples[0], "Rohan123", "12345678"], good: passwordExamples[0] },
  { prompt: "A friend used Password123. Build a password without names or easy patterns.", pieces: [...friendPasswordPieces, "Password123", "MyName123"], good: friendPasswordPieces },
  { prompt: "Give Rohan’s school account its own password. Join two new pieces.", pieces: [...passwordExamples[1], "11111111", "Password123"], good: passwordExamples[1] },
];
function VaultPuzzle({ task, stage, ready, submit, gamePassword, saveGamePassword }: { task: (typeof vaultTasks)[number]; stage: number; ready: boolean; submit: Submit; gamePassword: string; saveGamePassword: (value: string) => void }) {
  const [pieces, setPieces] = useState<string[]>([]);
  const [tested, setTested] = useState(false);
  const password = pieces.join("");
  const good = pieces.length === 2 && pieces.every(piece => task.good.includes(piece)) && password.length === 16;
  const target = ["Rohan’s game", "Friend’s game", "School account"][stage];
  function choose(piece: string) { setPieces(current => [...current, piece]); setTested(false); }
  return <div className={v.workshop}>
    <div className={v.moonStage} data-result={tested ? good ? "safe" : "retry" : undefined}>
      <span className={v.safeArt} aria-hidden="true" />
      <div className={v.readout}>{stage === 2 ? <KeyRound aria-hidden="true" /> : <Gamepad2 aria-hidden="true" />}<strong>{ready ? `${target}: password ready` : tested ? "That password needs a repair" : `${target}: build a password`}</strong><p>{ready ? "Two words joined. Ready for this practice account." : tested ? "Names and counting patterns are still easy to guess." : "Two words can be easy to read: Mango and Rocket. Keep their numbers and symbols too."}</p></div>
    </div>
    <div className={v.keyWorkbench}>
      {stage === 2 && <p className={v.previousKey}>Rohan’s game example: <code>{gamePassword}</code>. School needs a different password.</p>}
      <ol className={v.wordSlots} aria-label="Two-piece practice password">{[0, 1].map(i => <li key={i} data-filled={Boolean(pieces[i])}><b>{i + 1}</b>{pieces[i] ?? "Choose a piece"}</li>)}</ol>
      <p className={v.note}>Numbers: 0–9. Symbols: ! ? # @.</p>
      <p className={v.passwordReadout}>One password: <code>{password || "—"}</code> <strong>{password.length} / 16 characters</strong></p>
      <div className={v.words}>{task.pieces.map(piece => <button type="button" key={piece} disabled={pieces.includes(piece) || pieces.length === 2} onClick={() => choose(piece)}><KeyRound aria-hidden="true" />{piece}</button>)}</div>
      <div className={s.controls}><button type="button" className={s.secondary} disabled={!pieces.length} onClick={() => { setPieces(current => current.slice(0, -1)); setTested(false); }}><RotateCcw aria-hidden="true" />Undo piece</button><button type="button" className={s.primary} disabled={pieces.length !== 2} onClick={() => { setTested(true); if (good && stage === 0) saveGamePassword(password); submit(good, good ? stage === 0 ? "Mango and Rocket make a password you can read. It avoids his name and 123. Give school a different password too." : "You chose words instead of a name or easy counting pattern. This password is different from Rohan’s game password." : "This uses a name or easy counting pattern. Undo that tile and choose a word tile instead."); }}><Play aria-hidden="true" />Test password</button></div>
      <p className={v.note}>Practice only. Ask a trusted adult to help make and safely save a different password for each real account. Never use these classroom examples.</p>
    </div>
  </div>;
}
export function PasswordVaultBuilder(props: Props) {
  const p = usePractice(props);
  const [gamePassword, saveGamePassword] = useState(passwordExamples[0].join(""));
  return <PracticeShell props={props} stage={p.stage} eyebrow="Moonbase password workshop" brief="Use a long, hard-to-guess password. Give every account a different one." prompt={vaultTasks[Math.min(p.stage, 2)].prompt} feedback={p.feedback} feedbackCorrect={p.feedbackCorrect} ready={p.ready} onContinue={p.continuePractice} onFinish={p.finish} art="fair-vault"><VaultPuzzle key={p.stage} task={vaultTasks[Math.min(p.stage, 2)]} stage={p.stage} ready={p.ready} submit={p.submit} gamePassword={gamePassword} saveGamePassword={saveGamePassword} /></PracticeShell>;
}

type Bag = "Share in class" | "Keep private" | "Ask an adult";
const bags: Bag[] = ["Share in class", "Keep private", "Ask an adult"];
const bagTasks = [
  { prompt: "Class introduction: tap a detail, then choose where it belongs.", items: [{ name: "Favourite colour", detail: "I like teal", bag: "Share in class" as Bag, why: "A colour preference does not tell people where to find you." }, { name: "Home address", detail: "A pretend home address", bag: "Keep private" as Bag, why: "An address reveals where someone lives." }, { name: "Selfie for a public page", detail: "Everyone online could see it", bag: "Ask an adult" as Bag, why: "Ask a trusted adult before posting a photo of yourself." }] },
  { prompt: "A new game asks for details. Sort its requests before making a profile.", items: [{ name: "Favourite book", detail: "A story I enjoy", bag: "Share in class" as Bag, why: "A book preference is fine for a class conversation." }, { name: "Phone number", detail: "A pretend contact number", bag: "Keep private" as Bag, why: "A phone number lets people contact someone directly." }, { name: "Photo of a classmate", detail: "They have not said yes", bag: "Ask an adult" as Bag, why: "Check the person's permission and the audience before sharing their photo." }] },
  { prompt: "Review a class project update. Check location and permission too.", items: [{ name: "Favourite game", detail: "A game I enjoy", bag: "Share in class" as Bag, why: "A game preference can be shared in a class activity." }, { name: "Live location", detail: "Where I am right now", bag: "Keep private" as Bag, why: "Live location shows where someone can find you now." }, { name: "Team photo", detail: "Check with everyone pictured", bag: "Ask an adult" as Bag, why: "Ask everyone pictured and a trusted adult about where the photo will be posted." }] },
];
function BackpackSort({ task, submit }: { task: (typeof bagTasks)[number]; submit: Submit }) {
  const [active, setActive] = useState("");
  const [placed, setPlaced] = useState<Record<string, Bag>>({});
  const [checked, setChecked] = useState(false);
  function place(bag: Bag, name = active) { if (!task.items.some(item => item.name === name)) return; setPlaced(current => ({ ...current, [name]: bag })); setActive(""); setChecked(false); }
  return <div className={v.privacyStage}>
    <div className={v.clubHeading}><span className={v.tigerArt} aria-hidden="true" /><div><h3>Rohan’s sharing desk</h3><p>Class conversation · fictional details</p></div></div>
    <div className={v.detailCards}>{task.items.map((item, i) => <button type="button" draggable key={item.name} aria-pressed={active === item.name} data-error={checked && placed[item.name] !== item.bag} onDragStart={event => { event.dataTransfer.setData("text/plain", item.name); setActive(item.name); }} onClick={() => { setActive(item.name); setChecked(false); }}><span className={v.detailIcon}>{i === 0 ? <Gamepad2 aria-hidden="true" /> : i === 1 ? <MapPin aria-hidden="true" /> : <UsersRound aria-hidden="true" />}</span><strong>{item.name}</strong><small>{item.detail}</small><b>{placed[item.name] ?? "Tap, then choose below"}</b></button>)}</div>
    <div className={v.bags}>{bags.map(bag => <button type="button" key={bag} aria-label={`Choose ${bag}`} data-bag={bag} onClick={() => place(bag)} onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); place(bag, event.dataTransfer.getData("text/plain")); }}><span className={v.sharingArt} aria-hidden="true" /><strong>{bag}</strong><span className={v.bagContents}>{task.items.filter(item => placed[item.name] === bag).map(item => <small key={item.name}>{item.name}</small>)}</span></button>)}</div>
    <p className={v.note} aria-live="polite">{active ? `${active} picked. Tap the choice where it belongs.` : "Tap a detail again to change its choice."}</p>
    <button type="button" className={s.primary} disabled={task.items.some(item => !placed[item.name])} onClick={() => { setChecked(true); const wrong = task.items.find(item => placed[item.name] !== item.bag); submit(!wrong, wrong ? `${wrong.name}: ${wrong.why} Tap its detail and choose again.` : "Sorted safely. Preferences can be shared in class; identifying details stay private; photos need permission and adult help."); }}><Check aria-hidden="true" />Check choices</button>
  </div>;
}
export function SharingBackpack(props: Props) {
  const p = usePractice(props); const task = bagTasks[Math.min(p.stage, 2)];
  return <PracticeShell props={props} stage={p.stage} eyebrow="Rohan’s sharing desk" brief="Think about who can see a detail. Keep identifying information private, and ask before sharing a photo." prompt={task.prompt} feedback={p.feedback} feedbackCorrect={p.feedbackCorrect} ready={p.ready} onContinue={p.continuePractice} onFinish={p.finish} art="vault"><BackpackSort key={p.stage} task={task} submit={p.submit} /></PracticeShell>;
}

const accountPieces = [
  [...passwordExamples[0], "Tara123!", "12345678"],
  [...passwordExamples[1], ...passwordExamples[0]],
  [...passwordExamples[2], ...passwordExamples[0]],
];
function AccountKeys({ stage, submit, gamePassword, saveGamePassword, schoolPassword, saveSchoolPassword }: { stage: number; submit: Submit; gamePassword: string; saveGamePassword: (value: string) => void; schoolPassword: string; saveSchoolPassword: (value: string) => void }) {
  const [pieces, setPieces] = useState<string[]>([]);
  const [tested, setTested] = useState(false);
  const titles = ["Sky Garden", "School portal", "Email"];
  const password = pieces.join("");
  const complete = pieces.length === 2;
  const longEnough = password.length === 16;
  const predictable = pieces.some(piece => ["Tara123!", "12345678"].includes(piece));
  const reusedGame = password === gamePassword;
  const reusedSchool = stage === 2 && password === schoolPassword;
  const valid = complete && longEnough && !predictable && (stage === 0 || !reusedGame) && !reusedSchool;
  function test() {
    setTested(true);
    if (valid && stage === 0) saveGamePassword(password);
    if (valid && stage === 1) saveSchoolPassword(password);
    const feedback = valid
      ? stage === 0 ? "Two readable words, with numbers and symbols, instead of a name or counting pattern. Next, give school a different password. These examples are for practice only."
        : stage === 1 ? "School has its own password. The exact leaked game password will not open this account."
          : "The leaked game password opened the game only. School and email use different passwords, so they stayed closed in this replay."
      : predictable ? "Adding a symbol to your name or using a counting pattern is still easy to guess. Choose a word tile instead."
        : !longEnough ? "Choose one short word tile and one longer word tile to complete this practice password."
          : reusedGame ? "This is exactly the same full password as the game account. A stolen game password could open this account too."
            : "Email has the same password as school. Make it different so one future leak cannot open both.";
    submit(valid, feedback);
  }
  return <div className={v.gardenStage}>
    {stage === 2 && <div className={v.accountDoors}>{titles.map((title, i) => <div key={title} className={v.doorStation} data-fallen={tested && (i === 0 || (i === 2 && reusedGame))}>
        <span className={v.doorArt} data-door={i} aria-hidden="true" /><strong>{title}</strong><span>{tested ? i === 0 ? "Game password leaked" : i === 2 && reusedGame ? "Same password: opened" : "Different password: closed" : i === 0 ? "Leak starts here" : i === 1 ? "Different password" : "Waiting for your password"}</span>
      </div>)}</div>}
    <div className={v.keyBuilder} data-final={stage === 2}>{stage !== 2 && <div className={v.doorStation}><span className={v.doorArt} data-door={stage} aria-hidden="true" /><strong>{titles[stage]}</strong><span>{tested ? valid ? "Own password ready" : "Password needs a repair" : "Build one practice password"}</span></div>}
    <div className={v.keyWorkbench}>
      {stage > 0 && <p className={v.previousKey}>Game’s public example: <code>{gamePassword}</code>{stage === 2 && <> · School’s public example: <code>{schoolPassword}</code></>}</p>}
      <ol className={v.wordSlots} aria-label="Two-piece practice password">{[0, 1].map(i => <li key={i} data-filled={Boolean(pieces[i])}>{pieces[i] ?? "Choose a piece"}</li>)}</ol>
      <p className={v.note}>Numbers: 0–9. Symbols: ! ? # @.</p>
      <p className={v.passwordReadout}>One password: <code>{password || "—"}</code> <strong>{password.length} / 16 characters</strong></p>
      <div className={v.words}>{accountPieces[stage].map(piece => <button type="button" key={piece} disabled={pieces.includes(piece) || complete} onClick={() => { setPieces(current => [...current, piece]); setTested(false); }}><KeyRound aria-hidden="true" />{piece}</button>)}</div>
      {stage > 0 && <div className={s.controls}><button type="button" className={s.secondary} onClick={() => { setPieces(passwordExamples.flat().filter(piece => gamePassword.includes(piece)).sort((a, b) => gamePassword.indexOf(a) - gamePassword.indexOf(b))); setTested(false); }}>Reuse game password</button>{stage === 2 && <button type="button" className={s.secondary} onClick={() => { setPieces(passwordExamples.flat().filter(piece => schoolPassword.includes(piece)).sort((a, b) => schoolPassword.indexOf(a) - schoolPassword.indexOf(b))); setTested(false); }}>Reuse school password</button>}</div>}
      <div className={s.controls}><button type="button" className={s.secondary} disabled={!pieces.length} onClick={() => { setPieces(current => current.slice(0, -1)); setTested(false); }}>Undo piece</button><button type="button" className={s.primary} disabled={!complete} onClick={test}><Play aria-hidden="true" />{stage === 2 ? "Run leak" : "Test account"}</button></div>
    </div></div><p className={v.note}>Practice only. Real passwords need to be long, hard to guess and different for every account. Ask an adult to help make and save them. Adding a symbol to your name is not enough.</p>
  </div>;
}
export function PasswordVault(props: Props) {
  const p = usePractice(props);
  const [gamePassword, saveGamePassword] = useState(passwordExamples[0].join(""));
  const [schoolPassword, saveSchoolPassword] = useState(passwordExamples[1].join(""));
  const prompts = ["Replace Tara123! with two readable word tiles. Their numbers and symbols stay attached.", "Give school its own password. Build it, then test whether the leaked game password could open it.", "Make a different email password. Replay the game breach to see which accounts open."];
  return <PracticeShell props={props} stage={p.stage} eyebrow="Tara’s account workshop" brief="Use a different password for every account. Here, practise with familiar words, numbers and symbols." prompt={prompts[Math.min(p.stage, 2)]} feedback={p.feedback} feedbackCorrect={p.feedbackCorrect} ready={p.ready} onContinue={p.continuePractice} onFinish={p.finish} art="vault"><AccountKeys key={p.stage} stage={p.stage} submit={p.submit} gamePassword={gamePassword} saveGamePassword={saveGamePassword} schoolPassword={schoolPassword} saveSchoolPassword={saveSchoolPassword} /></PracticeShell>;
}

type Permission = "Camera" | "Contacts" | "Location" | "Microphone";
const permissions: Permission[] = ["Camera", "Contacts", "Location", "Microphone"];
const permissionTasks: { prompt: string; app: string; needed: Permission[]; reason: string }[] = [
  { prompt: "Test a basic torch. Remove access that has nothing to do with making light.", app: "Pocket Torch", needed: [], reason: "This simulated torch can shine without any of these four permissions." },
  { prompt: "The map must show Tara’s current position. Give it only the access for that job.", app: "City Map", needed: ["Location"], reason: "Current-position navigation uses Location. Camera, Contacts and Microphone are unnecessary here." },
  { prompt: "Tara’s class call needs video and sound. Test the minimum access for both.", app: "Class Video", needed: ["Camera", "Microphone"], reason: "Video needs Camera and sound needs Microphone. This practice call does not need Contacts or Location." },
];
function PermissionBoard({ stage, task, submit }: { stage: number; task: (typeof permissionTasks)[number]; submit: Submit }) {
  const [on, setOn] = useState<Permission[]>([...permissions]);
  const [tested, setTested] = useState(false);
  const missing = task.needed.filter(permission => !on.includes(permission));
  const extra = on.filter(permission => !task.needed.includes(permission));
  const good = !missing.length && !extra.length;
  return <div className={v.permissionDesk}>
    <div className={v.appPhone}><div className={v.phoneBar}><Smartphone aria-hidden="true" />Tara’s practice phone</div><h3>{task.app}</h3>
      <div className={v.appPreview} data-app={stage} data-working={tested && !missing.length}><span>{tested ? missing.length ? `Not ready: ${missing.join(" + ")} off` : stage === 0 ? "Torch shines" : stage === 1 ? "Current position found" : "Video and sound ready" : "Set access, then test the app"}</span></div>
      <div className={v.permissionRows}>{permissions.map(permission => <button type="button" aria-pressed={on.includes(permission)} key={permission} onClick={() => { setTested(false); setOn(current => current.includes(permission) ? current.filter(item => item !== permission) : [...current, permission]); }}><strong>{permission}</strong><span data-on={on.includes(permission)}>{on.includes(permission) ? "On" : "Off"}</span></button>)}</div>
    </div>
    <div className={v.monitor}><h3>What access did you grant?</h3><ul>{permissions.map(permission => <li key={permission}><span>{permission}</span><b>{on.includes(permission) ? "Granted" : "Blocked"}</b></li>)}</ul>
      <p>{tested ? task.reason : "Test two things: can the app do its job, and have you blocked unrelated access?"}</p>
      {tested && <p className={v.testResult} data-pass={good}>{missing.length ? `Needed access missing: ${missing.join(", ")}.` : extra.length ? `The app works, but it still has unnecessary access: ${extra.join(", ")}.` : "App works with only the access it needs."}</p>}
      <button type="button" className={s.primary} onClick={() => { setTested(true); submit(good, good ? `Minimum access set. ${task.reason}` : missing.length ? `Turn on ${missing.join(" and ")} so the app can do this job. Then remove any unrelated permissions.` : `Switch off ${extra.join(", ")}. ${task.reason}`); }}><Play aria-hidden="true" />Test app access</button>
      <p className={v.note}>A pretend phone: these switches never change your real device permissions.</p>
    </div>
  </div>;
}
export function PermissionControlPanel(props: Props) {
  const p = usePractice(props); const task = permissionTasks[Math.min(p.stage, 2)];
  return <PracticeShell props={props} stage={p.stage} eyebrow="Tara’s permission desk" brief="Access should match the feature you want to use. An app can work while still asking for too much." prompt={task.prompt} feedback={p.feedback} feedbackCorrect={p.feedbackCorrect} ready={p.ready} onContinue={p.continuePractice} onFinish={p.finish} art="vault"><PermissionBoard key={p.stage} stage={p.stage} task={task} submit={p.submit} /></PracticeShell>;
}

const profilePosts = [
  { text: "Built a library book exchange with classmates.", revise: false },
  { text: "Posted a classmate’s photo without asking.", revise: true },
  { text: "Mocked a teammate after a disagreement.", revise: true },
];
const rewritePieces = ["Our team struggled.", "Next time I’ll listen and plan better.", "Maya is useless.", "It was all their fault."];
function FeedEditor({ stage, submit }: { stage: number; submit: Submit }) {
  const [marked, setMarked] = useState<number[]>([]);
  const [clauses, setClauses] = useState<string[]>([]);
  const [location, setLocation] = useState(true);
  const [tags, setTags] = useState(true);
  const [audience, setAudience] = useState("Public");
  const [tested, setTested] = useState(false);
  const good = stage === 0 ? marked.length === 2 && marked.includes(1) && marked.includes(2) : stage === 1 ? clauses.length === 2 && clauses.every(clause => rewritePieces.slice(0, 2).includes(clause)) : !location && !tags && audience === "Class group";
  return <div className={v.profileDesk}>
    <div className={v.profilePreview}><div className={v.profilePhoto} aria-hidden="true" /><div className={v.profileBar}><Eye aria-hidden="true" />{stage === 2 ? `${audience} preview` : "Public profile preview"}</div>
      {stage === 0 ? profilePosts.map((post, i) => <button type="button" aria-pressed={marked.includes(i)} key={post.text} className={v.post} onClick={() => { setTested(false); setMarked(current => current.includes(i) ? current.filter(value => value !== i) : [...current, i]); }}><span>{post.text}</span><b>{marked.includes(i) ? "Marked for repair" : "Inspect this post"}</b></button>) : <div className={v.post}><p>{stage === 1 ? clauses.join(" ") || "Your revised post will appear here." : "Our team built a solar viewer for the science fair."}</p>{stage === 2 && <><span data-visible={location}>{location ? "Live route: visible" : "Live route: removed"}</span><span data-visible={tags}>{tags ? "Friends’ home tags: visible" : "Friends’ home tags: removed"}</span></>}</div>}
      {tested && <div className={v.testResult} data-pass={good}>{good ? stage === 0 ? "Repair list ready" : "Preview is ready to share" : "Preview still needs attention"}</div>}
    </div>
    <div className={v.monitor}><h3>{stage === 0 ? "Mark the posts that need repair" : stage === 1 ? "Build a respectful rewrite" : "Prepare a safer project update"}</h3>
      {stage === 0 ? <p>Keep the constructive project update. Find the posts that ignore consent or put someone down.</p> : stage === 1 ? <><p>Tap two sentence pieces. Keep the lesson learned; leave out blame.</p><div className={v.words}>{rewritePieces.map(clause => <button type="button" key={clause} disabled={clauses.includes(clause) || clauses.length === 2} onClick={() => { setClauses(current => [...current, clause]); setTested(false); }}>{clause}</button>)}</div><button type="button" className={s.secondary} disabled={!clauses.length} onClick={() => { setClauses(current => current.slice(0, -1)); setTested(false); }}>Undo sentence</button></> : <><p>Remove location and unapproved tags. A smaller audience helps, but it does not replace consent.</p><div className={v.permissionRows}><button type="button" aria-pressed={location} onClick={() => { setLocation(value => !value); setTested(false); }}>Show live route<span data-on={location}>{location ? "On" : "Off"}</span></button><button type="button" aria-pressed={tags} onClick={() => { setTags(value => !value); setTested(false); }}>Tag friends at home<span data-on={tags}>{tags ? "On" : "Off"}</span></button></div><label className={v.audience}>Audience<select value={audience} onChange={event => { setAudience(event.target.value); setTested(false); }}><option>Public</option><option>Class group</option></select></label></>}
      <button type="button" className={s.primary} disabled={stage === 0 ? !marked.length : stage === 1 ? clauses.length !== 2 : false} onClick={() => { setTested(true); submit(good, good ? stage === 0 ? "You kept the constructive post and marked the photo without permission and the unkind comment for repair." : stage === 1 ? "This rewrite owns the problem and explains a useful next step without blaming a classmate." : "Your class-group update keeps the project while removing live location and unapproved tags. Check consent before sharing real photos." : stage === 0 ? "The book-exchange update can stay. Mark both the unapproved photo and the unkind comment." : stage === 1 ? "That rewrite still blames or insults someone. Undo those pieces and describe what you learned." : location || tags ? "The preview still shows live location or friends’ home tags. Switch both off before sharing." : "This class project is still set to Public. Choose Class group, then check consent before sharing."); }}><Check aria-hidden="true" />{stage === 0 ? "Review profile" : "Publish preview"}</button>
      <p className={v.note}>This fictional preview is never posted online.</p>
    </div>
  </div>;
}
export function OnlineReputationBuilder(props: Props) {
  const p = usePractice(props); const prompts = ["Audit this public profile. Mark both posts that need repair.", "Rewrite a project post using two respectful sentence pieces.", "Choose an audience and remove sensitive details from a project update."];
  return <PracticeShell props={props} stage={p.stage} eyebrow="Kabir’s profile studio" brief="A post may be seen later and out of context. Keep useful work, respect others and check privacy before sharing." prompt={prompts[Math.min(p.stage, 2)]} feedback={p.feedback} feedbackCorrect={p.feedbackCorrect} ready={p.ready} onContinue={p.continuePractice} onFinish={p.finish} art="media"><FeedEditor key={p.stage} stage={p.stage} submit={p.submit} /></PracticeShell>;
}

const emailTasks = [
  { prompt: "Inspect the sender, then verify the award using the saved school directory.", subject: "Confirm your award today", display: "Scholarship Office", from: "awards@school-prizes.example", reply: "claims@school-prizes.example", evidence: "From", why: "The sender uses school-prizes.example, not school.example." },
  { prompt: "Find where a reply would go. Verify through the directory before responding.", subject: "Your interview invitation", display: "School Awards", from: "awards@school.example", reply: "forms@instant-awards.example", evidence: "Reply-To", why: "Replies go to instant-awards.example even though From looks like the school domain." },
  { prompt: "Investigate a fee demand. Mark the sender mismatch and payment request before verifying.", subject: "Pay the award release fee", display: "Awards Team", from: "cashier@claim-now.example", reply: "cashier@claim-now.example", evidence: "From", why: "The sender domain is unrelated to the school, and the message asks for an award-release fee." },
];
function HeaderInspector({ stage, task, submit }: { stage: number; task: (typeof emailTasks)[number]; submit: Submit }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [verified, setVerified] = useState(false);
  const [tested, setTested] = useState(false);
  const evidenceReady = selected.includes(task.evidence) && (stage < 2 || selected.includes("Fee demand"));
  function mark(field: string) { setSelected(current => current.includes(field) ? current.filter(item => item !== field) : [...current, field]); setVerified(false); setTested(false); }
  return <div className={v.inboxDesk}>
    <div className={v.emailCard}><div className={v.phoneBar}><Mail aria-hidden="true" />Fictional school inbox</div><h3>{task.subject}</h3><p>From: <strong>{task.display}</strong></p><p>{stage === 2 ? "Pay ₹500 to release your scholarship award." : "Reply today with your details to confirm your award."}</p>
      <button type="button" className={s.secondary} onClick={() => setOpen(value => !value)}><Eye aria-hidden="true" />{open ? "Hide" : "Reveal"} technical header</button>
      {open && <div className={v.headerRows}>{["Display name", "From", "Reply-To"].map(field => <button type="button" aria-pressed={selected.includes(field)} key={field} onClick={() => mark(field)}><small>{field}</small><code>{field === "Display name" ? task.display : field === "From" ? task.from : task.reply}</code>{selected.includes(field) && <Check aria-hidden="true" />}</button>)}</div>}
      {stage === 2 && <button type="button" className={s.secondary} aria-pressed={selected.includes("Fee demand")} onClick={() => mark("Fee demand")}>Mark fee demand</button>}
      <button type="button" className={s.secondary} onClick={() => { setTested(true); submit(false, "Replying would send your details to the message's chosen route. Inspect the full header, then use the saved school directory.", true); }}>Reply with details</button>
    </div>
    <div className={v.monitor}><h3>Evidence notebook</h3><p>Saved school directory: <strong>school.example</strong></p><p>The display name is a label, not authentication. A matching From address alone does not prove an email is genuine.</p><ul className={v.evidenceList}>{selected.length ? selected.map(field => <li key={field}><Check aria-hidden="true" />{field} marked</li>) : <li>Reveal the header and mark the mismatch.</li>}</ul>
      <button type="button" className={s.secondary} onClick={() => { if (!evidenceReady) { setTested(true); submit(false, stage === 2 ? "Mark the sender mismatch and the fee request first. Both matter in this message." : "The display name is not the route. Mark the full address field with the mismatch first."); return; } setVerified(true); }}>Check saved school directory</button>
      {verified && <p className={v.directoryResult}>Directory check: the school has not confirmed this message. Use the known office contact; keep the email unverified.</p>}
      {tested && !verified && <p className={v.note}>The message stays in the unverified queue.</p>}
      <button type="button" className={s.primary} disabled={!verified} onClick={() => submit(true, `${task.why} You used an independent route and held the suspicious message without replying or paying.`)}><ShieldCheck aria-hidden="true" />Quarantine message</button>
    </div>
  </div>;
}
export function EmailHeaderInspector(props: Props) {
  const p = usePractice(props); const task = emailTasks[Math.min(p.stage, 2)];
  return <PracticeShell props={props} stage={p.stage} eyebrow="Kabir’s inbox desk" brief="Inspect the full addresses and requests, then verify through a known route independent of the message." prompt={task.prompt} feedback={p.feedback} feedbackCorrect={p.feedbackCorrect} ready={p.ready} onContinue={p.continuePractice} onFinish={p.finish} art="media"><HeaderInspector key={p.stage} stage={p.stage} task={task} submit={p.submit} /></PracticeShell>;
}
