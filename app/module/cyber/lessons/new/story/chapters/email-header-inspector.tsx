"use client";

import { AtSign, BadgeCheck, Clock, CodeXml, Flag, Inbox, Mail, MailWarning, PhoneCall, Reply, Server, ShieldAlert, ShieldCheck, Trophy, UserRound, Users } from "lucide-react";
import { useState } from "react";
import { SceneSwap } from "../StoryPlayer";
import type { StoryChapter, StoryWorldProps } from "../types";
import script from "./email-header-inspector.json";
import k from "../story-player.module.css";
import r from "./email-header-inspector.module.css";

const REAL = "youngscientists.cyberpur.example";
const rows = [
  { field: "Date", value: "Mon, 12 Oct 2026 21:47:03 +0530", bad: false, why: "The date only says when it was sent. Nothing odd here." },
  { field: "From", value: "Scholarship Office <awards@youngscientists-cyberpur.example>", bad: true, why: "Lookalike domain: a hyphen instead of a dot. The real office is youngscientists.cyberpur.example." },
  { field: "To", value: "kabir.s@mail.cyberpur.example", bad: false, why: "That’s Kabir’s own address, so it’s normal." },
  { field: "Reply-To", value: "claims@fast-prize-desk.example", bad: true, why: "Replies would go to a completely different domain." },
  { field: "Subject", value: "Congratulations! Award confirmed", bad: false, why: "An exciting subject isn’t a header mismatch by itself. Compare the addresses and servers." },
  { field: "Received", value: "from mail.bulk-sender.example (203.0.113.45)", bad: true, why: "It came through an unrelated bulk-mail server, not the office’s." },
  { field: "Authentication-Results", value: "spf=fail  dkim=fail", bad: true, why: "Both checks failed: the domain didn’t vouch for this message." },
  { field: "MIME-Version", value: "1.0", bad: false, why: "MIME-Version is a standard technical line in almost every email." },
];
const clues = rows.filter(row => row.bad).length;
const glossary = [
  { name: "From", text: "The full address behind the display name", Icon: AtSign, at: .5 },
  { name: "Reply-To", text: "Where your answer would really go", Icon: Reply, at: .6 },
  { name: "Received", text: "The servers the message passed through", Icon: Server, at: .7 },
  { name: "SPF · DKIM", text: "Checks that the sending domain vouches for it", Icon: ShieldCheck, at: .82 },
];

const verifySteps = [
  { Icon: PhoneCall, text: "Call the number on the official website, not the email", at: .3 },
  { Icon: Users, text: "Tell his parents, and warn classmates", at: .6 },
  { Icon: Flag, text: "Report it as phishing in the mail app", at: .66 },
];

function Logo() { return <span className={r.logo} aria-hidden="true">YS</span>; }

function World({ scene, playing, elapsed, solved, markSolved, hint, setHint, reduced }: StoryWorldProps) {
  const [flags, setFlags] = useState<string[]>([]);
  const [passing, setPassing] = useState(false);
  const done = solved || passing;
  const flagged = solved ? rows.filter(row => row.bad).map(row => row.field) : flags;
  // Reveal an item once narration reaches that fraction of the scene (everything shows while paused).
  const cue = (at: number) => !playing || elapsed > script.scenes[scene].duration * at;
  const show = (at: number) => ({ "data-on": cue(at), "aria-hidden": !cue(at) });

  function toggle(row: (typeof rows)[number]) {
    if (done) return;
    if (!row.bad) { setHint(row.why); return; }
    const on = flags.includes(row.field);
    setFlags(value => on ? value.filter(f => f !== row.field) : [...value, row.field]);
    setHint(on ? `${row.field} unflagged.` : `${row.field} flagged: ${row.why}`);
  }
  function submit() {
    if (done) return;
    if (flags.length < clues) { setHint(`You’ve flagged ${flags.length} of the clues. Compare every address, server and check with the real office.`); return; }
    setHint("Four independent clues all point the same way. That’s strong evidence of a spoofed email.");
    setPassing(true);
    window.setTimeout(markSolved, reduced ? 0 : 700);
  }

  const inbox = (fresh: "fake" | "real") => <div className={`${k.deviceArt} ${r.inbox}`}>
    {fresh === "fake"
      ? <div className={r.mail} data-new="true" {...show(.7)}><Logo /><div><strong>Scholarship Office</strong><span>Congratulations! Award confirmed</span></div><small>now</small></div>
      : <div className={r.mail} data-new="true"><Logo /><div><strong>Young Scientists Office</strong><span>Your scholarship result</span><em>awards@{REAL}</em></div><small>now</small></div>}
    <div className={r.mail} data-real="true"><Logo /><div><strong>Young Scientists Office</strong><span>Thank you for your interview</span><em>awards@{REAL}</em></div><small>Tue</small></div>
    <div className={r.mail} data-real="true"><Logo /><div><strong>Young Scientists Office</strong><span>Interview: Monday, 10 am</span><em>awards@{REAL}</em></div><small>Fri</small></div>
  </div>;

  return <SceneSwap scene={scene} reduced={reduced}>
    {(scene === 0 || scene === 5) && <div className={k.device}>
      <div className={k.deviceBar}><span><Inbox size={16} /> CYBERPUR MAIL</span><span>Kabir’s inbox · pretend app</span></div>
      <div className={r.withBadge}>
        {inbox(scene === 0 ? "fake" : "real")}
        {scene === 5 && <div className={r.won}><Trophy aria-hidden="true" /><strong>You’ve won the scholarship!</strong><span>No fee. Headers checked: every field matches.</span></div>}
      </div>
      <div className={k.deviceFoot}>{scene === 0 ? <><Mail /><span>Real office emails come from</span><b>{REAL}</b></> : <><Flag /><span>The fake reached 20 applicants. Kabir’s report helped warn them.</span></>}</div>
    </div>}

    {scene === 1 && <div className={k.device}>
      <div className={k.deviceBar}><span><Mail size={16} /> CYBERPUR MAIL</span><span>Pretend email</span></div>
      <div className={`${k.deviceArt} ${r.open}`}>
        <div className={r.openHead}><Logo /><div><strong>Scholarship Office</strong><small>to me · Show details ▾</small></div><span className={r.timer} {...show(.3)}><Clock aria-hidden="true" />23:59:12 left</span></div>
        <h3 className={r.subject}>Congratulations! You have won an award.</h3>
        <p {...show(.1)} className={r.body}>To release your award, submit these within <b>24 hours</b>, or it goes to someone else:</p>
        <div className={r.formRow} {...show(.2)}><span>Aadhaar number</span><i>____ ____ ____</i></div>
        <div className={r.payRow} {...show(.3)}><span className={r.fakePay}>Pay ₹500 processing fee</span></div>
        <p className={r.doubt} {...show(.8)}><MailWarning aria-hidden="true" />The real office never mentioned fees.</p>
      </div>
      <div className={k.deviceFoot}><UserRound /><span>Display name: “Scholarship Office”. Address hidden.</span></div>
    </div>}

    {scene === 2 && <div className={k.panel}>
      <div className={r.sister}><span className={r.avatar}><UserRound aria-hidden="true" /></span><div><small>Meera · Kabir’s sister</small><p>“Don’t trust the name. Read the headers.”</p></div></div>
      <div className={r.nameDemo} {...show(.12)}><span className={r.label}>Scholarship Office</span><span className={r.addr}>&lt;awards@youngscientists-cyberpur.example&gt;</span><small>display name · anyone can type it</small><small>address · where it really came from</small></div>
      <div className={r.glossary}>{glossary.map(({ name, text, Icon, at }) => <div key={name} {...show(at)}><Icon aria-hidden="true" /><strong>{name}</strong><span>{text}</span></div>)}</div>
    </div>}

    {scene === 3 && <div className={`${k.panel} ${r.task}`}>
      <h2>Show original: flag the mismatches</h2>
      <div className={r.bench}>
        <div className={r.raw} role="group" aria-label="Raw email headers">{rows.map(row => { const on = flagged.includes(row.field); return <button key={row.field} type="button" className={r.row} aria-pressed={on} aria-label={`Flag ${row.field}`} disabled={done} onClick={() => toggle(row)}>
          <code><b>{row.field}:</b> {row.value}</code>{on && <span className={r.flag}><Flag aria-hidden="true" /></span>}
        </button>; })}</div>
        <div className={r.reference}>
          <small>The real office</small>
          <span><AtSign aria-hidden="true" />awards@{REAL}</span>
          <span><Server aria-hidden="true" />mail.{REAL}</span>
          <span><BadgeCheck aria-hidden="true" />spf=pass · dkim=pass</span>
          <b className={r.count}>{flagged.length} of {clues} clues flagged</b>
        </div>
      </div>
      <p className={k.hint} aria-live="polite">{hint || (done ? "Four independent clues all point the same way. That’s strong evidence of a spoofed email." : "Tap a header line to flag it. Tap again to unflag.")}</p>
      <div className={k.actions}>
        <button type="button" className={r.trap} data-trap="true" onClick={() => { if (!done) setHint("A display name is just a label anyone can type. Check the address and servers behind it."); }} disabled={done}><UserRound />The name says Scholarship Office, so it’s real</button>
        <button className={k.primary} type="button" onClick={submit} disabled={done}><CodeXml />Submit findings</button>
      </div>
      <small>Fictional headers. Every domain ends in .example.</small>
    </div>}

    {scene === 4 && <div className={k.panel}>
      <h2>Verify, then report</h2>
      <div className={r.evidence} {...show(.02)}>{["Lookalike domain", "Reply-To elsewhere", "Unrelated server", "SPF and DKIM fail"].map(c => <span key={c}><ShieldAlert aria-hidden="true" />{c}</span>)}</div>
      {verifySteps.map(({ Icon, text, at }) => <div className={k.step} key={text} data-active={cue(at)}><span><Icon /></span>{text}</div>)}
      <p className={r.never} {...show(.86)}><ShieldAlert aria-hidden="true" />Never send an Aadhaar number or pay a fee through an email link.</p>
      <small>Even an SPF pass isn’t proof on its own: scammers can set up their own lookalike domains. Check several clues and verify.</small>
    </div>}
  </SceneSwap>;
}

const chapter: StoryChapter = {
  script,
  title: "Kabir and the award email",
  icon: MailWarning,
  character: { asset: "emotional-avatar", name: "Kabir" },
  interactionScene: 3,
  beginLabel: "Practise with Kabir",
  waitingText: "Story paused. Flag every header clue, then submit your findings.",
  lockedHint: "Help Kabir inspect the email headers first.",
  World,
};
export default chapter;
