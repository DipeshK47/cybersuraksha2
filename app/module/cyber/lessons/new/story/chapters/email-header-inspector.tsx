"use client";

import { ArrowLeft, ArrowRight, Award, BadgeCheck, Building2, Check, Clock, Code, FlaskConical, Flag, Forward, Globe, GraduationCap, IdCard, IndianRupee, Library, Mail, MailSearch, Menu, MousePointer2, Phone, Puzzle, Reply, Search, ShieldAlert, ShieldCheck, Sun, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { SceneSwap } from "../StoryPlayer";
import type { StoryChapter, StoryWorldProps } from "../types";
import script from "./email-header-inspector.json";
import k from "../story-player.module.css";
import e from "./email-header-inspector.module.css";

// The raw header Kabir inspects. `bad` = a real mismatch (label shown once solved); `why` = hint if an ordinary line is flagged.
const headers = [
  { field: "Received", value: "from mail.fastprize-bulk.example [203.0.113.45]", bad: "Unrelated server", clue: "Which server did the message really come from? Is it the school’s?" },
  { field: "Authentication-Results", value: "spf=fail; dkim=fail", bad: "Checks failed", clue: "Read the SPF and DKIM results. Did they pass?" },
  { field: "From", value: "\"Scholarship Office\" <awards@cyberpur-school-awards.example>", bad: "Lookalike domain", clue: "Read the address inside the angle brackets, not just the name." },
  { field: "Reply-To", value: "claims@quick-scholar-help.example", bad: "Replies go elsewhere", clue: "Where would a reply actually go?" },
  { field: "To", value: "kabir@students.cyberpurschool.example", why: "That’s Kabir’s own school address, so it’s ordinary." },
  { field: "Subject", value: "Congratulations! You have won an award", why: "The subject is only words the sender typed. It doesn’t show where the email came from." },
  { field: "Date", value: "Mon, 28 Sep 2026 09:41 +0530", why: "The date and time are ordinary. They don’t say who sent it." },
];
const badCount = headers.filter(line => line.bad).length;

function Mailbox({ right = "Kabir’s inbox", children, foot }: { right?: string; children: ReactNode; foot: ReactNode }) {
  return <div className={k.device}>
    <div className={k.deviceBar}><span><Mail size={15} /> MAIL</span><span>{right}</span></div>
    <div className={e.client}>{children}</div>
    <div className={k.deviceFoot}>{foot}</div>
  </div>;
}

// Same crest on the fake and the real email: a copied logo proves nothing.
const Crest = () => <span className={e.crest} aria-hidden="true"><GraduationCap /></span>;

function World({ scene, playing, elapsed, solved, markSolved, hint, setHint, reduced }: StoryWorldProps) {
  const [flags, setFlags] = useState<string[]>([]);
  const on = (seconds: number) => !playing || elapsed >= seconds;
  function toggle(field: string) {
    if (solved) return;
    setFlags(value => value.includes(field) ? value.filter(item => item !== field) : [...value, field]); setHint("");
  }
  function check() {
    if (solved) return;
    if (flags.length === headers.length) { setHint("Flagging every line isn’t inspecting. Flag only the lines that don’t fit the school, then check.", false); return; }
    const ordinary = headers.find(line => !line.bad && flags.includes(line.field));
    if (ordinary) { setHint(`${ordinary.field}: ${ordinary.why} Unflag it and look again.`, false); return; }
    const missing = headers.filter(line => line.bad && !flags.includes(line.field));
    if (missing.length) { setHint(`${badCount - missing.length} of ${badCount} found. ${missing[0].clue}`, false); return; }
    markSolved();
  }
  const shown = solved ? headers.filter(line => line.bad).map(line => line.field) : flags;

  return <SceneSwap scene={scene} reduced={reduced}>
    {scene === 0 && <Mailbox foot={<><Sun /><span>Science fair entry: <b>Solar water heater</b></span><small>Waiting for results</small></>}>
      <div className={e.appBar}><Menu aria-hidden="true" /><strong>Inbox</strong><span className={e.search}><Search aria-hidden="true" />Search mail</span><span className={e.me} aria-hidden="true">K</span></div>
      <ul className={e.list}>
        {on(10) && <li className={`${e.row} ${k.fitIn}`} data-new="true"><Crest /><div><strong>Scholarship Office</strong><b>Congratulations! You have won an award</b><span>Dear student, you have been selected for…</span></div><time>9:41</time></li>}
        <li className={e.row}><span className={e.avatar} data-tone="teal" aria-hidden="true"><FlaskConical /></span><div><strong>Class 7B Science</strong><b>Fair photos are up!</b><span>Great work on the projects, everyone. See the…</span></div><time>Yesterday</time></li>
        <li className={e.row}><span className={e.avatar} data-tone="plum" aria-hidden="true"><Library /></span><div><strong>Library Desk</strong><b>Your book is due on Friday</b><span>“Simple Machines for Young Makers” is due…</span></div><time>Mon</time></li>
        <li className={e.row}><span className={e.avatar} data-tone="gold" aria-hidden="true"><Puzzle /></span><div><strong>Maths Club</strong><b>Puzzle of the week: magic squares</b><span>Bring your answers to Thursday’s meeting…</span></div><time>Sun</time></li>
      </ul>
    </Mailbox>}

    {scene === 1 && <Mailbox right="Pretend email · example only" foot={<><TriangleAlert /><span>Don’t click, reply or pay yet.</span><small>Pressure is a warning sign</small></>}>
      <div className={e.msg}>
        <div className={e.msgTop}><ArrowLeft aria-hidden="true" /><span>Inbox</span></div>
        <h3 className={e.subject}>Congratulations! You have won an award</h3>
        <div className={e.sender}><Crest /><div><strong>Scholarship Office</strong><span>to me · 9:41</span></div></div>
        <div className={e.letter}>
          <p>Dear student,</p>
          <p>Congratulations! You have won an award. Submit your <mark data-on={on(4)}>Aadhaar number</mark> and a <mark data-on={on(5)}>₹500 processing fee</mark> <mark data-on={on(7.5)}>within 24 hours</mark>.</p>
          <div className={e.cta}><span className={e.fakeButton}>Claim award now</span><span className={e.timer}><Clock aria-hidden="true" />23:59:12 left</span></div>
        </div>
        <div className={e.flags}>
          <span className={e.flag} data-on={on(4)}><IdCard aria-hidden="true" />Asks for Aadhaar</span>
          <span className={e.flag} data-on={on(11)}><IndianRupee aria-hidden="true" />Money first</span>
          <span className={e.flag} data-on={on(13.5)}><Clock aria-hidden="true" />24-hour rush</span>
          <span className={e.flag} data-kind="neutral" data-on={on(14.5)}><BadgeCheck aria-hidden="true" />Logo and name look right</span>
        </div>
      </div>
    </Mailbox>}

    {scene === 2 && <div className={k.panel}>
      <div className={e.meera}><span aria-hidden="true">M</span><div><small>Meera Aunty</small><p>“Don’t click anything. Let’s look underneath.”</p></div></div>
      <div className={e.layers}>
        <div className={e.layer} data-on={on(7.5)}><small>What you see</small><strong><Crest />Scholarship Office</strong><span>The <b>display name</b>. Anyone can type any name here.</span></div>
        <div className={e.layer} data-deep="true" data-on={on(11)}><small>What’s underneath</small><strong><Code aria-hidden="true" />Email headers</strong><span>Which servers it passed through, plus <b>SPF</b> and <b>DKIM</b> checks.</span></div>
      </div>
      <div className={e.menu} data-on={on(16.5)}><span><Reply aria-hidden="true" />Reply</span><span><Forward aria-hidden="true" />Forward</span><span data-pick="true"><Code aria-hidden="true" />Show original<MousePointer2 aria-hidden="true" /></span></div>
      <small>SPF asks: was this server allowed to send for that domain? DKIM checks the email’s digital signature.</small>
    </div>}

    {scene === 3 && <div className={k.device}>
      <div className={k.deviceBar}><span><MailSearch size={15} /> SHOW ORIGINAL</span><span>Raw header · example only</span></div>
      <div className={e.raw}>
        <div className={e.domain}><ShieldCheck aria-hidden="true" /><span>School’s real domain</span><code>cyberpurschool.example</code></div>
        {solved && <div className={e.verdict}><ShieldAlert aria-hidden="true" /><span><strong>Phishing:</strong> {badCount} of {badCount} mismatches flagged</span></div>}
        <div className={e.lines} role="group" aria-label="Raw header lines. Tap a line to flag it.">
          {headers.map(line => <button key={line.field} className={e.line} type="button" aria-pressed={shown.includes(line.field)} disabled={solved} onClick={() => toggle(line.field)}>
            <span className={e.code}><b>{line.field}:</b> {line.value}</span>
            <span className={e.flagMark} aria-hidden="true"><Flag /></span>
            {solved && <em data-bad={Boolean(line.bad)}>{line.bad ?? "Ordinary"}</em>}
          </button>)}
        </div>
      </div>
      <div className={e.taskFoot}>
        <p className={`${k.hint} ${e.tip}`} aria-live="polite">{solved ? "Four clues point the same way. Now check with the school directly." : hint || (flags.length ? `${flags.length} line${flags.length === 1 ? "" : "s"} flagged. Check when you’re sure.` : "Tap every line that doesn’t match the school. Tap again to unflag.")}</p>
        {!solved && <div className={k.actions}>
          <button className={e.trap} data-trap="true" disabled={solved} onClick={() => setHint("A display name is a label anyone can type. Check the address in the angle brackets: it isn’t cyberpurschool.example.", false)} type="button"><BadgeCheck />It’s real: the name says Scholarship Office</button>
          <button className={k.primary} disabled={solved || !flags.length} onClick={check} type="button">Check my flags <ArrowRight /></button>
        </div>}
      </div>
    </div>}

    {scene === 4 && <div className={k.panel}>
      <div className={e.evidence}>{headers.filter(line => line.bad).map(line => <span key={line.field}><Flag aria-hidden="true" />{line.bad}</span>)}</div>
      <h2>Verify it yourself. Then report.</h2>
      <div className={e.call} data-on={on(10.5)}>
        <span className={e.callAvatar} aria-hidden="true"><Building2 /></span>
        <div><strong>Cyberpur School Office</strong><span>+91 00000 12345 · from the school diary</span></div>
        <em>Pretend call</em>
        <p>“We never charge a fee for awards. There’s no such scholarship.”</p>
      </div>
      {([[Globe, "Typed cyberpurschool.example himself", 7.5], [Phone, "Called the number in the school diary", 10.5], [Flag, "Reported the email as phishing", 15.5]] as const).map(([Icon, text, at]) => <div className={k.step} key={text} data-active={on(at)}><span><Icon /></span>{text}</div>)}
      <small>If money is ever lost to a scam, an adult should call 1930 quickly or report at cybercrime.gov.in.</small>
    </div>}

    {scene === 5 && <Mailbox foot={<><Award /><span>Certificate for Innovation</span><small>Checked: sender, reply route, SPF, DKIM</small></>}>
      <div className={e.msg}>
        <h3 className={e.subject}>Science fair results: well done, Kabir!</h3>
        <div className={e.sender}><Crest /><div><strong>Cyberpur School Office</strong><span>office@cyberpurschool.example</span></div></div>
        <div className={e.passes}><span><Check aria-hidden="true" />Domain matches</span><span><Check aria-hidden="true" />SPF pass</span><span><Check aria-hidden="true" />DKIM pass</span></div>
        <div className={e.letter} data-real="true"><p>Your solar water heater has won a <strong>certificate for Innovation</strong>. Please collect it at Monday’s assembly.</p><p>There is no fee and nothing to submit.</p></div>
        <div className={e.reported}><ShieldAlert aria-hidden="true" /><span>“Scholarship Office” email</span><em>Reported as phishing</em></div>
      </div>
    </Mailbox>}
  </SceneSwap>;
}

const chapter: StoryChapter = {
  script,
  title: "Kabir’s surprise scholarship",
  icon: MailSearch,
  character: { asset: "emotional-avatar", name: "Kabir" },
  interactionScene: 3,
  beginLabel: "Practise with Kabir",
  waitingText: "Story paused. Flag the header mismatches to see what happens next.",
  lockedHint: "Help Kabir inspect the raw headers first.",
  solvedMood: "happy",
  World,
};
export default chapter;
