"use client";

import { Anchor, BellRing, Bird, Check, Cloud, Copy, Drum, Feather, Flower2, Gamepad2, GraduationCap, House, KeyRound, Link2, LockKeyhole, Mail, NotebookPen, Play, RotateCcw, Rocket, Shell, ShieldAlert, ShieldCheck, Smartphone, Sparkles, Sprout, TreeDeciduous, Umbrella, UserRound } from "lucide-react";
import { useState } from "react";
import { SceneSwap } from "../StoryPlayer";
import type { StoryChapter, StoryWorldProps } from "../types";
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
const words = ["Anchor", "Cloud", "Drum", "Feather", "Lotus", "Rocket", "Shell", "Umbrella", "Banyan"];
const wordIcons = [Anchor, Cloud, Drum, Feather, Flower2, Rocket, Shell, Umbrella, TreeDeciduous];
const example = [["Anchor", "Cloud", "Drum"], ["Feather", "Lotus", "Rocket"], ["Shell", "Umbrella", "Banyan"]];
// Sharing two of three words is "almost the same" key: attackers try small changes too.
const close = (a: string[], b: string[]) => a.filter(word => b.includes(word)).length >= 2;

type Fall = "up" | "lean" | "down";
/** Three account dominoes. A link is a chain (same key) or a shield (own key); null hides it. */
function Dominoes({ fall, links, labels, light }: { fall: Fall[]; links: (boolean | null)[]; labels: string[]; light?: boolean }) {
  return <ol className={r.dominoes} data-light={light ?? false}>
    {accounts.map(({ kind, Icon }, i) => <li key={kind}>
      {i > 0 && <span className={r.link} data-chain={links[i - 1] ?? undefined} aria-hidden="true">{links[i - 1] === null ? null : links[i - 1] ? <Link2 /> : <ShieldCheck />}</span>}
      <div className={r.slot}><span className={r.domino} data-fall={fall[i]}><Icon aria-hidden="true" /><b>{kind}</b></span><small>{labels[i]}</small></div>
    </li>)}
  </ol>;
}

const garden = <>
  <span className={r.cloudSea} />
  <span className={r.sun} />
  <Bird className={r.bird} aria-hidden="true" />
  <Cloud className={r.cloud} data-i="1" aria-hidden="true" />
  <Cloud className={r.cloud} data-i="2" aria-hidden="true" />
  <span className={r.island} data-i="1"><TreeDeciduous aria-hidden="true" /><Flower2 aria-hidden="true" /></span>
  <span className={r.island} data-i="2"><House aria-hidden="true" /></span>
  <span className={r.island} data-i="3"><Sprout aria-hidden="true" /><TreeDeciduous aria-hidden="true" /></span>
</>;

function World({ scene, playing, elapsed, solved, markSolved, hint, setHint, reduced }: StoryWorldProps) {
  const [phrases, setPhrases] = useState<string[][]>([[], [], []]);
  const [active, setActive] = useState(0);
  const [fell, setFell] = useState<boolean[] | null>(null);
  const [passing, setPassing] = useState(false);
  const done = solved || passing;
  const shown = solved && phrases.some(p => p.length < 3) ? example : phrases;
  // Reveal an item once narration reaches that fraction of the scene (everything shows while paused).
  const cue = (at: number) => !playing || elapsed > script.scenes[scene].duration * at;
  const on = (at: number) => ({ "data-on": cue(at), "aria-hidden": !cue(at) });

  function edit(next: string[][]) { setPhrases(next); setFell(null); setHint(""); }
  function addWord(word: string) {
    const current = phrases[active];
    if (done || current.length === 3 || current.includes(word)) return;
    const next = phrases.map((p, i) => i === active ? [...p, word] : p);
    edit(next);
    if (next[active].length === 3) { const empty = next.findIndex(p => p.length < 3); if (empty >= 0) setActive(empty); }
  }
  function copyAll() { if (!done && phrases[0].length === 3) edit(phrases.map(() => [...phrases[0]])); }
  function replay() {
    if (done || phrases.some(p => p.length < 3)) return;
    const result = phrases.map((p, i) => i === 0 || close(p, phrases[0]));
    setFell(result);
    const hit = accounts.filter((_, i) => i > 0 && result[i]);
    if (hit.length) {
      const exact = hit.every(a => { const p = phrases[accounts.indexOf(a)]; return p.every(w => phrases[0].includes(w)); });
      setHint(`${hit.map(a => a.name).join(" and ")} ${hit.length > 1 ? "use" : "uses"} ${exact ? "the same" : "almost the same"} words as the game, so the leaked passphrase opened ${hit.length > 1 ? "them" : "it"} too.${exact ? "" : " Attackers try small changes."} Give each account its own words.`);
      return;
    }
    if (close(phrases[1], phrases[2])) { setHint("The game leak stopped at the game. But School portal and Email share a passphrase, so one leak could topple both. Make them different."); return; }
    setHint("Only the game fell. The other dominoes stood, because each account has its own passphrase.");
    setPassing(true);
    window.setTimeout(markSolved, reduced ? 0 : 700);
  }

  const ready = shown.filter(p => p.length === 3).length;
  const result = solved ? [true, false, false] : fell;
  const taskFall: Fall[] = result ? [result[1] ? "down" : "lean", result[1] ? "down" : "up", result[2] ? "down" : "up"] : ["up", "up", "up"];

  return <SceneSwap scene={scene} reduced={reduced}>
    {(scene === 0 || scene === 5) && <div className={k.device}>
      <div className={k.deviceBar}><span><Sprout size={16} /> SKY GARDEN</span><span>{scene === 0 ? "Tara’s islands" : "Signed in safely"}</span></div>
      <div className={`${k.deviceArt} ${r.garden}`} data-resolved={scene === 5}>
        {garden}
        {scene === 0 && <div className={k.badge}><Sparkles /> Level 19 · almost 20!</div>}
        {scene === 5 && <div className={k.success}><ShieldCheck /><strong>Welcome back, Tara!</strong><span>Level 20 · own passphrase · two-step on</span></div>}
      </div>
      <div className={k.deviceFoot}>{scene === 0
        ? <><KeyRound /><span>One password</span><b>••••••••</b>{accounts.map(({ kind, Icon }, i) => <span className={r.chip} key={kind} {...on([.05, .4, .55][i])}><Icon aria-hidden="true" />{kind}</span>)}<small className={r.same} {...on(.84)}>Same key on all three</small></>
        : accounts.map(({ kind }) => <span className={r.chip} data-safe="true" key={kind}><Check aria-hidden="true" />{kind} · own key</span>)}</div>
    </div>}

    {scene === 1 && <div className={k.device}>
      <div className={k.deviceBar}><span><BellRing size={16} /> ALERTS</span><span>Tara’s tablet</span></div>
      <div className={`${k.deviceArt} ${r.alerts}`}>
        <div className={r.notes}>{alerts.map(({ app, title, body, Icon, at }, i) => <div className={r.note} data-bad={i > 0} key={app} {...on(at)}>
          <span className={r.appIcon}><Icon aria-hidden="true" /></span><div><small>{app} · now</small><strong>{title}</strong><span>{body}</span></div>
        </div>)}</div>
        <Dominoes fall={[cue(.68) ? "down" : cue(.45) ? "lean" : "up", cue(.7) ? "down" : "up", cue(.86) ? "down" : "up"]} links={[true, true]} labels={[cue(.45) ? "Leaked" : "Standing", cue(.7) ? "Taken over" : "Standing", cue(.86) ? "Taken over" : "Standing"]} />
      </div>
      <div className={k.deviceFoot}><ShieldAlert /><span>A data breach at the game website. Not Tara’s fault.</span></div>
    </div>}

    {scene === 2 && <div className={k.panel}>
      <div className={r.mum}><span className={r.avatar}><UserRound aria-hidden="true" /></span><div><small>Mum</small><p>“This isn’t your fault. Let’s fix it together.”</p></div></div>
      <h2>Credential stuffing: one key, many doors</h2>
      <div className={r.console}>
        <div className={r.consoleHead}><ShieldAlert aria-hidden="true" />Attacker’s script · password leaked from play.skygarden.example</div>
        {accounts.slice(1).map(({ site, Icon }, i) => <div className={r.try} key={site} {...on(.16 + i * .1)}><Icon aria-hidden="true" /><code>{site}</code><span>Same password · opened</span></div>)}
      </div>
      {["Official recovery steps on each site", "A new, different password for every account", "Sign out of other devices"].map((step, i) => <div className={k.step} key={step} data-active={cue([.62, .78, .9][i])}><span><Check /></span>{step}</div>)}
    </div>}

    {scene === 3 && <div className={`${k.panel} ${r.task}`}>
      <h2>Give each account its own passphrase</h2>
      <p>Pick an account, then tap three words for it.</p>
      <div className={r.cards}>{accounts.map(({ name, Icon }, i) => <button className={r.card} key={name} type="button" aria-pressed={!done && active === i} disabled={done} onClick={() => setActive(i)}>
        <span className={r.cardHead}><Icon aria-hidden="true" />{name}</span>
        <span className={r.cardSlots}>{[0, 1, 2].map(j => <span key={j} data-filled={Boolean(shown[i][j])}>{shown[i][j] ?? "…"}</span>)}</span>
      </button>)}</div>
      <div className={k.bank}>{words.map((word, i) => { const Icon = wordIcons[i]; const used = phrases[active].includes(word); return <button key={word} type="button" onClick={() => addWord(word)} disabled={done || used || phrases[active].length === 3} aria-pressed={used}><Icon aria-hidden="true" />{word}</button>; })}</div>
      <div className={r.result}>
        <Dominoes light fall={taskFall} links={result ? [result[1], result[2]] : [null, null]} labels={result ? ["Leaked", result[1] ? "Opened too" : "Still safe", result[2] ? "Opened too" : "Still safe"] : ["Ready", "Ready", "Ready"]} />
        <p className={k.hint} aria-live="polite">{hint || (solved ? "Breach replayed: only the game account was affected." : ready === 3 ? "All three are ready. Replay the breach to test them." : `${ready} of 3 accounts have a passphrase.`)}</p>
      </div>
      <div className={`${k.actions} ${r.taskActions}`}>
        <button type="button" onClick={() => edit(phrases.map((p, i) => i === active ? [] : p))} disabled={done || !phrases[active].length}><RotateCcw />Clear card</button>
        <button className={r.trap} data-trap="true" type="button" onClick={copyAll} disabled={done || phrases[0].length < 3}><Copy />Copy game’s words to all</button>
        <button className={k.primary} type="button" onClick={replay} disabled={done || ready < 3}><Play />Replay the breach</button>
      </div>
      <small>Practice words only. Never use these as real passwords.</small>
    </div>}

    {scene === 4 && <div className={k.panel}>
      <h2>Many keys, one safe place</h2>
      <div className={r.keys}>{accounts.map(({ name, Icon }, i) => <div className={r.keyRow} key={name}><Icon aria-hidden="true" /><strong>{name}</strong><span>{shown[i].join(" · ")}</span><KeyRound aria-hidden="true" /></div>)}</div>
      <div className={r.helpers}>
        <div className={r.helper} {...on(.3)}><LockKeyhole aria-hidden="true" /><strong>Password manager</strong><span>An app that locks every password behind one strong main password.</span></div>
        <div className={r.helper} {...on(.55)}><NotebookPen aria-hidden="true" /><strong>Paper list</strong><span>Kept safe at home by a parent, never in a school bag.</span></div>
      </div>
      <div className={r.twoStep} {...on(.74)}><Smartphone aria-hidden="true" /><div><strong>Two-step verification</strong><span>A second check at sign-in, like a code on Mum’s phone. Never share that code.</span></div><Check aria-hidden="true" /></div>
      <small>Teaching examples only. Never use these words as real passwords.</small>
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
  waitingText: "Story paused. Give each account its own passphrase, then replay the breach.",
  lockedHint: "Help Tara give each account its own passphrase first.",
  World,
};
export default chapter;
