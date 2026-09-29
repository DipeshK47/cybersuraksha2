"use client";

import { BellRing, Check, Copy, Gamepad2, GraduationCap, KeyRound, Link2, LockKeyhole, Mail, NotebookPen, Play, RotateCcw, ShieldAlert, ShieldCheck, Smartphone, Sparkles, Sprout, UserRound } from "lucide-react";
import { useState } from "react";
import { SceneSwap } from "../StoryPlayer";
import type { StoryChapter, StoryWorldProps } from "../types";
import { passwordExamples } from "../../password-examples";
import script from "./password-vault.json";
import k from "../story-player.module.css";
import r from "./password-vault.module.css";

const accounts = [
  { kind: "Game", name: "Sky Garden", site: "play.skygarden.example", Icon: Gamepad2 },
  { kind: "School", name: "School portal", site: "portal.cyberpurschool.example", Icon: GraduationCap },
  { kind: "Email", name: "Email", site: "mail.cyberpur.example", Icon: Mail },
];
const alerts = [
  { app: "Sky Garden", title: "Security notice", body: "Our website was hacked and passwords were stolen. Please change yours.", Icon: Gamepad2, at: .03 },
  { app: "School portal", title: "New sign-in", body: "Someone signed in from an unknown device.", Icon: GraduationCap, at: .68 },
  { app: "Email", title: "Password changed", body: "You were signed out. Your password was changed.", Icon: Mail, at: .84 },
];
const pieces = passwordExamples.flat();
const example = passwordExamples.map(pair => [...pair]);
const samePassword = (a: string[], b: string[]) => a.join("") === b.join("");

type Fall = "up" | "lean" | "down";
function VaultArt({ item, className = "" }: { item: number; className?: string }) {
  return <span className={`${r.vaultArt} ${className}`} data-item={item} aria-hidden="true" />;
}
/** Three account dominoes. A link is a chain (same key) or a shield (own key); null hides it. */
function Dominoes({ fall, links, labels, light }: { fall: Fall[]; links: (boolean | null)[]; labels: string[]; light?: boolean }) {
  return <ol className={r.dominoes} data-light={light ?? false}>
    {accounts.map(({ kind, Icon }, i) => <li key={kind}>
      {i > 0 && <span className={r.link} data-chain={links[i - 1] ?? undefined} aria-hidden="true">{links[i - 1] === null ? null : links[i - 1] ? <Link2 /> : <ShieldCheck />}</span>}
      <div className={r.slot}><span className={r.domino} data-fall={fall[i]}><VaultArt item={i} /><b><Icon aria-hidden="true" />{kind}</b></span><small>{labels[i]}</small></div>
    </li>)}
  </ol>;
}

const garden = <span className={r.gardenArt} aria-hidden="true" />;

function World({ scene, playing, elapsed, solved, markSolved, hint, setHint, reduced }: StoryWorldProps) {
  const [passwords, setPasswords] = useState<string[][]>([[], [], []]);
  const [active, setActive] = useState(0);
  const [fell, setFell] = useState<number[] | null>(null);
  const [passing, setPassing] = useState(false);
  const done = solved || passing;
  const shown = solved && passwords.some(p => p.length < 2) ? example : passwords;
  // Reveal an item once narration reaches that fraction of the scene (everything shows while paused).
  const cue = (at: number) => !playing || elapsed > script.scenes[scene].duration * at;
  const on = (at: number) => ({ "data-on": cue(at), "aria-hidden": !cue(at) });

  function edit(next: string[][]) { setPasswords(next); setFell(null); setHint(""); }
  function addPiece(word: string) {
    const current = passwords[active];
    if (done || current.length === 2 || current.includes(word)) return;
    const next = passwords.map((p, i) => i === active ? [...p, word] : p);
    edit(next);
    if (next[active].length === 2) { const empty = next.findIndex(p => p.length < 2); if (empty >= 0) setActive(empty); }
  }
  function copyAll() { if (!done && passwords[0].length === 2) edit(passwords.map(() => [...passwords[0]])); }
  function replay() {
    if (done || passwords.some(p => p.length < 2)) return;
    if (passwords.some(p => p.join("").length !== 16)) { setHint("Choose one short word tile, such as Mango!, and one longer tile, such as Rocket482?, for each account.", false); return; }
    const result = passwords.map(p => samePassword(p, passwords[0]) ? 1 : 0);
    setFell(result);
    const names = (list: typeof accounts) => list.map(a => a.name).join(" and ");
    const hit = accounts.filter((_, i) => i > 0 && result[i] === 1);
    if (hit.length) {
      setHint(`${names(hit)} ${hit.length > 1 ? "reuse" : "reuses"} the game's full password, so the leaked password opened ${hit.length > 1 ? "them" : "it"} too. Give each account a different password.`, false);
      return;
    }
    if (samePassword(passwords[1], passwords[2])) { setHint("School and Email still use the same full password. The game leak did not open them, but another leak could reach both. Give those accounts different passwords.", false); return; }
    setHint("Only the game fell in this replay. School and Email have different passwords, so this stolen game password did not open them.");
    setPassing(true);
    window.setTimeout(markSolved, reduced ? 0 : 700);
  }

  const ready = shown.filter(p => p.length === 2).length;
  const result = solved ? [1, 0, 0] : fell;
  const taskFall: Fall[] = result ? ["down", result[1] ? "down" : "up", result[2] ? "down" : "up"] : ["up", "up", "up"];
  const label = (n: number) => n ? "Opened too" : "Not opened";

  return <SceneSwap scene={scene} reduced={reduced}>
    {(scene === 0 || scene === 5) && <div className={k.device}>
      <div className={k.deviceBar}><span><Sprout size={16} /> SKY GARDEN</span><span>{scene === 0 ? "Tara’s islands" : "Signed in safely"}</span></div>
      <div className={`${k.deviceArt} ${r.garden}`} data-resolved={scene === 5}>
        {garden}
        {scene === 0 && <div className={k.badge}><Sparkles /> Level 19 · almost 20!</div>}
        {scene === 5 && <div className={k.success}><ShieldCheck /><strong>Welcome back, Tara!</strong><span>Level 20 · different password on each account · two-step on</span></div>}
      </div>
      <div className={k.deviceFoot}>{scene === 0
        ? <><KeyRound /><span>One password</span><b>••••••••</b>{accounts.map(({ kind, Icon }, i) => <span className={r.chip} key={kind} {...on([.05, .4, .55][i])}><Icon aria-hidden="true" />{kind}</span>)}<small className={r.same} {...on(.84)}>Same key on all three</small></>
        : accounts.map(({ kind }) => <span className={r.chip} data-safe="true" key={kind}><Check aria-hidden="true" />{kind} · own key</span>)}</div>
    </div>}

    {scene === 1 && <div className={k.device}>
      <div className={k.deviceBar}><span><BellRing size={16} /> ALERTS</span><span>Tara’s tablet</span></div>
      <div className={`${k.deviceArt} ${r.alerts}`}>
        {garden}
        <div className={r.notes}>{alerts.map(({ app, title, body, Icon, at }, i) => <div className={r.note} data-bad={i > 0} key={app} {...on(at)}>
          <span className={r.appIcon}><Icon aria-hidden="true" /></span><div><small>{app} · now</small><strong>{title}</strong><span>{body}</span></div>
        </div>)}</div>
        <Dominoes fall={[cue(.68) ? "down" : cue(.45) ? "lean" : "up", cue(.7) ? "down" : "up", cue(.86) ? "down" : "up"]} links={[true, true]} labels={[cue(.45) ? "Leaked" : "Standing", cue(.7) ? "Taken over" : "Standing", cue(.86) ? "Taken over" : "Standing"]} />
      </div>
      <div className={k.deviceFoot}><ShieldAlert /><span>A data breach at the game website. Not Tara’s fault.</span></div>
    </div>}

    {scene === 2 && <div className={`${k.panel} ${r.gardenScene} ${r.explain}`}>
      {garden}
      <div className={r.mum}><span className={r.avatar}><UserRound aria-hidden="true" /></span><div><small>Mum</small><p>“This isn’t your fault. Let’s fix it together.”</p></div></div>
      <div className={r.sceneHeading}><h2>Credential stuffing: one key, many doors</h2></div>
      <div className={r.attackDoors} aria-hidden="true">
        <span className={r.leakedKey}><KeyRound /></span>
        {accounts.map(({ kind }, i) => <span className={r.attackDoor} key={kind}><VaultArt item={i} /><LockKeyhole /></span>)}
      </div>
      <div className={r.console}>
        <div className={r.consoleHead}><ShieldAlert aria-hidden="true" />Attacker’s script · password leaked from play.skygarden.example</div>
        {accounts.slice(1).map(({ site, Icon }, i) => <div className={r.try} key={site} {...on(.16 + i * .1)}><Icon aria-hidden="true" /><code>{site}</code><span>Same password · opened</span></div>)}
      </div>
      <div className={r.recoverySteps}>{["Official recovery steps on each site", "A new, different password for every account", "Sign out of other devices"].map((step, i) => <div className={k.step} key={step} data-active={cue([.62, .78, .9][i])}><span><Check /></span>{step}</div>)}</div>
    </div>}

    {scene === 3 && <div className={`${k.panel} ${r.gardenScene} ${r.task}`}>
      {garden}
      <div className={r.sceneHeading}><h2>Give each account its own password</h2><p>Choose an account, then join two word tiles. Use a different pair for each account.</p></div>
      <div className={r.passwordExample}><span>Public example · never use for a real login</span><code>{passwordExamples[0].join("")}</code><small>Mango + Rocket + numbers and symbols · no spaces</small></div>
      <div className={r.cards}>{accounts.map(({ name, Icon }, i) => <button className={r.card} key={name} type="button" aria-pressed={!done && active === i} disabled={done} onClick={() => setActive(i)}>
        <span className={r.cardHead}><Icon aria-hidden="true" />{name}</span>
        <VaultArt item={i} className={r.cardDoor} />
        <span className={r.cardSlots}>{[0, 1].map(j => <span key={j} data-filled={Boolean(shown[i][j])}>{shown[i][j] ?? "…"}</span>)}</span>
        <code className={r.cardPassword}>{shown[i].join("") || "—"}</code>
        <small className={r.length}>{shown[i].length ? `${shown[i].join("").length} / 16 characters` : "Choose two pieces"}</small>
      </button>)}</div>
      <div className={`${k.bank} ${r.wordTray}`}>{pieces.map(word => { const used = passwords[active].includes(word); return <button key={word} type="button" onClick={() => addPiece(word)} disabled={done || used || passwords[active].length === 2} aria-pressed={used}><KeyRound aria-hidden="true" />{word}</button>; })}</div>
      <div className={r.result}>
        <Dominoes light fall={taskFall} links={[null, null]} labels={result ? ["Leaked", label(result[1]), label(result[2])] : ["Ready", "Ready", "Ready"]} />
        <p className={k.hint} aria-live="polite">{hint || (solved ? "Breach replayed: the stolen game password opened only the game." : ready === 3 ? "All three have a practice password. Replay the breach to test reuse." : `${ready} of 3 accounts have a practice password.`)}</p>
      </div>
      <div className={`${k.actions} ${r.taskActions}`}>
        <button type="button" onClick={() => edit(passwords.map((p, i) => i === active ? [] : p))} disabled={done || !passwords[active].length}><RotateCcw />Clear card</button>
        <button className={r.trap} data-trap="true" type="button" onClick={copyAll} disabled={done || passwords[0].length < 2}><Copy />Reuse game’s full password</button>
        <button className={k.primary} type="button" onClick={replay} disabled={done || ready < 3}><Play />Replay the breach</button>
      </div>
      <small>These tiles are for practice only. Make real passwords privately with a trusted adult. A password manager can make and safely save them.</small>
    </div>}

    {scene === 4 && <div className={`${k.panel} ${r.gardenScene} ${r.storage}`}>
      {garden}
      <div className={r.sceneHeading}><h2>Different passwords, one safe place</h2><p>A password manager can make and save a long, random password for each account.</p></div>
      <div className={r.keys}>{accounts.map(({ name, Icon }, i) => <div className={r.keyRow} key={name}><VaultArt item={i} /><Icon aria-hidden="true" /><strong>{name}</strong><span>{shown[i].join("")}</span><KeyRound aria-hidden="true" /></div>)}</div>
      <div className={r.helpers}>
        <div className={r.helper} {...on(.3)}><VaultArt item={3} /><strong><LockKeyhole aria-hidden="true" />Password manager</strong><span>With an adult, let it make and remember a different random password for every account.</span></div>
        <div className={r.helper} {...on(.55)}><VaultArt item={4} /><strong><NotebookPen aria-hidden="true" />Family backup</strong><span>If there is no manager, a parent can keep a written record secure at home.</span></div>
      </div>
      <div className={r.twoStep} {...on(.74)}><VaultArt item={5} /><div><strong><Smartphone aria-hidden="true" />Two-step verification</strong><span>A second check at sign-in, like a code on Mum’s phone. Never share that code.</span></div><Check aria-hidden="true" /></div>
      <small>Public teaching examples only. Make real passwords privately; never copy one from this lesson.</small>
    </div>}
  </SceneSwap>;
}

const chapter: StoryChapter = {
  script,
  title: "Tara’s toppling accounts",
  icon: KeyRound,
  character: { asset: "girl-expressions", name: "Tara" },
  interactionScene: 3,
  beginLabel: "Practise with Tara",
  waitingText: "Story paused. Give each account a different word-tile password, then replay the breach.",
  lockedHint: "Help Tara give every account a different practice password first.",
  World,
};
export default chapter;
