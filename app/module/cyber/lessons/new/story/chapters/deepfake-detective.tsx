"use client";

import type { LucideIcon } from "lucide-react";
import { ArrowRight, AudioLines, BadgeCheck, Check, Eye, Film, Forward, Lock, Pin, Play, ScanEye, ScanFace, Search, ShieldCheck, SunMedium, Ticket, Trash2, Users, Vibrate, Volume2 } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { SceneSwap } from "../StoryPlayer";
import type { StoryChapter, StoryWorldProps } from "../types";
import script from "./deepfake-detective.json";
import k from "../story-player.module.css";
import d from "./deepfake-detective.module.css";

type Clue = "blink" | "lips" | "light";
type Frame = { line: ReactNode; oddBlink?: boolean; shutMouth?: boolean; shake?: boolean; wrongShadow?: boolean };

// The pretend clip: six illustrated frames. Three hide AI artefacts, one (0:02) has a normal camera shake.
const frames: Frame[] = [
  { line: "Hello, Cyberpur families." },
  { line: "I have some news…", oddBlink: true },
  { line: "…about this weekend.", shake: true },
  { line: <>The fair is <b>CANCELLED</b>.</>, shutMouth: true },
  { line: "Please stay at home.", wrongShadow: true },
  { line: "Share this with everyone!" },
];
const clueAt: Partial<Record<number, Clue>> = { 1: "blink", 3: "lips", 4: "light" };
const tags: { id: Clue | "shake"; label: string; icon: LucideIcon; found: string; missing: string }[] = [
  { id: "blink", label: "Odd blinking", icon: Eye, found: "only one eye closes", missing: "both eyes look normal" },
  { id: "lips", label: "Lips don’t match audio", icon: AudioLines, found: "the mouth stays shut on “cancelled”", missing: "the mouth moves with the words" },
  { id: "light", label: "Shadow on the wrong side", icon: SunMedium, found: "the face is dark on the lantern side", missing: "the shadow falls away from the lantern, as it should" },
  { id: "shake", label: "Shaky camera", icon: Vibrate, found: "", missing: "" },
];
const time = (i: number) => `0:0${i}`;

/** Six fictional illustrated frames. The learner still inspects each original clue. */
function ClipFrame({ f, ring }: { f: number; ring?: boolean }) {
  const fr = frames[f];
  return <svg className={d.frameArt} viewBox="0 0 160 90" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
    <g transform={fr.shake ? "translate(80 45) rotate(-4) scale(1.1) translate(-80 -45)" : undefined}>
      <image href="/cyber-missions/fairground-vault.jpg" width="160" height="90" preserveAspectRatio="xMidYMid slice" />
      <rect width="160" height="90" fill="#0f1d33" opacity=".35" />
      <image href={`/cyber-missions/refined/fair-frame-${fr.shake ? 0 : f}.webp`} x="35" width="90" height="90" />
      {ring && fr.oddBlink && <ellipse className={d.ring} cx="80" cy="38" rx="18" ry="7" />}
      {ring && fr.shutMouth && <ellipse className={d.ring} cx="81" cy="55" rx="11" ry="5" />}
      {ring && fr.wrongShadow && <><ellipse className={d.ring} cx="69" cy="45" rx="12" ry="22" /><ellipse className={d.ring} cx="40" cy="42" rx="6" ry="14" /></>}
    </g>
  </svg>;
}

function Chat({ children, foot }: { children: ReactNode; foot: ReactNode }) {
  return <div className={k.device}>
    <div className={k.deviceBar}><span><Users size={16} /> CLASS 7B · FRIENDS</span><span>Pretend chat · 32 members</span></div>
    <div className={d.chat}>{children}</div>
    <div className={k.deviceFoot}>{foot}</div>
  </div>;
}

function Msg({ who, me, show = true, children }: { who?: string; me?: boolean; show?: boolean; children: ReactNode }) {
  return <div className={d.msg} data-me={Boolean(me)} data-show={show}>{who && <b>{who}</b>}{children}</div>;
}

function World({ scene, playing, elapsed, solved, markSolved, hint, setHint, reduced }: StoryWorldProps) {
  const [frame, setFrame] = useState(0);
  const [found, setFound] = useState<number[]>([]);
  // Reveal a piece once the narration reaches that fraction of the scene; everything shows when paused.
  const at = (fraction: number) => !playing || elapsed >= script.scenes[scene].duration * fraction;

  function tag(spec: (typeof tags)[number]) {
    if (solved) return;
    const t = time(frame);
    if (spec.id === "shake") { setHint("A shaky camera happens in lots of real phone videos, so it isn’t an AI artefact. Look at the eyes, lips and light instead.", false); return; }
    if (found.includes(frame)) { setHint(`${t} is already tagged. Scrub to another frame.`); return; }
    if (clueAt[frame] !== spec.id) { setHint(clueAt[frame] ? `Look again: something else is off at ${t}.` : `At ${t}, ${spec.missing}. Check the other frames.`, false); return; }
    const next = [...found, frame];
    setFound(next);
    setHint(next.length === 3 ? "" : `Clue at ${t}: ${spec.found}. ${3 - next.length} more to find.`);
  }

  return <SceneSwap scene={scene} reduced={reduced}>
    {scene === 0 && <Chat foot={<><Ticket /><span>Saturday · meet at the gate, 5 pm</span><small>3 days to go</small></>}>
      <Msg who="Ananya">
        <div className={d.poster}><span className={k.badge}><Ticket /> 3 days to go</span><strong>CYBERPUR FAIR · SAT & SUN</strong></div>
        Who’s coming? Giant wheel is back!
      </Msg>
      <Msg who="Dev" show={at(.35)}>Ring toss champion this year. Watch me.</Msg>
      <Msg me show={at(.62)}>Gate at 5 on Saturday? I’ve saved up!</Msg>
      <Msg who="Meera" show={at(.75)}>Deal. Can’t wait!!</Msg>
      <div className={d.system} data-show={at(.88)}><Film /> +91 00000 48213 sent a video</div>
    </Chat>}

    {scene === 1 && <Chat foot={<><span className={d.forward} data-on={at(.55)}><Forward /> Forward to 5 chats?</span><small>{at(.66) ? "Kabir hasn’t sent it" : "Kabir’s thumb hovers…"}</small></>}>
      <Msg who="+91 00000 48213">
        <span className={d.fwd}><Forward /> Forwarded many times</span>
        <div className={d.video}><ClipFrame f={3} /><span className={d.play}><Play /></span><span className={d.duration}>0:06</span></div>
        URGENT!! Fair CANCELLED this weekend. Share with everyone!!
      </Msg>
      <Msg who="Dev" show={at(.22)}>Nooo. I saved up for weeks.</Msg>
      <Msg who="Meera" show={at(.3)}>Forwarding to my cousins’ group.</Msg>
      <div className={d.notice} data-show={at(.72)}><ScanEye /><span>Kabir notices:</span><em>Unknown number</em><em>No official link</em></div>
    </Chat>}

    {scene === 2 && <div className={k.panel}>
      <div className={d.quote}><span>Papa</span><p>“Before we believe it, let’s check it.”</p></div>
      <h2>Could it be a deepfake?</h2>
      <div className={d.define} data-show={at(.22)}><ScanFace /><span><b>Deepfake:</b> a video or audio made or changed with AI, so a real person seems to say or do things they never did.</span></div>
      {["Pause. Don’t forward it yet.", "Look closely: eyes, lips and light.", "Check the fair’s official channel."].map((step, i) => <div className={k.step} key={step} data-active={at([0, .76, .88][i])}><span><Check /></span>{step}</div>)}
    </div>}

    {scene === 3 && <div className={`${k.panel} ${d.task}`}>
      <h2>Inspect the clip, frame by frame</h2>
      <p>Pick a frame, look closely, then tag what’s wrong in it.</p>
      <div className={d.taskGrid}>
        <div>
          <div className={d.player}>
            <ClipFrame f={frame} ring={found.includes(frame)} />
            <span className={d.clipLabel}><Film /> Pretend clip</span>
            <span className={d.clipTime}>{time(frame)} / 0:05</span>
            <span className={d.subtitle}><Volume2 />{frames[frame].line}</span>
          </div>
          <div className={d.track} aria-hidden="true"><i style={{ transform: `translateX(${frame * 100}%)` }} /></div>
          <div className={d.strip} role="group" aria-label="Clip frames">
            {frames.map((_, i) => <button key={i} type="button" aria-pressed={frame === i} aria-label={`Frame at ${i} second${i === 1 ? "" : "s"}${found.includes(i) ? ", clue tagged" : ""}`} onClick={() => setFrame(i)}>
              <ClipFrame f={i} /><span>{time(i)}</span>{found.includes(i) && <Check className={d.tagDot} aria-hidden="true" />}
            </button>)}
          </div>
          <ul className={d.log} aria-label="Clues found">
            {[0, 1, 2].map(i => { const f = found[i]; const spec = f === undefined ? undefined : tags.find(item => item.id === clueAt[f]); return <li key={i} data-found={Boolean(spec)} className={spec ? k.fitIn : undefined}>{spec ? <><Check aria-hidden="true" /><b>{time(f)}</b>{spec.label}</> : <><Search aria-hidden="true" />Clue {i + 1}: not found yet</>}</li>; })}
          </ul>
        </div>
        <div className={d.tools}>
          <h3>Tag this frame ({time(frame)})</h3>
          <div className={k.bank}>{tags.map(item => <button key={item.id} type="button" onClick={() => tag(item)} disabled={solved} aria-pressed={found.some(f => clueAt[f] === item.id)}><item.icon aria-hidden="true" />{item.label}</button>)}</div>
          <p className={k.hint} aria-live="polite">{hint || (solved ? "Done: three clues tagged and the official channel checked." : found.length === 3 ? "Three clues found. Clues aren’t proof, though. Check the official channel." : "Clues are glitches AI editing can leave. Not every odd thing is one.")}</p>
          <div className={k.actions}>
            <button className={d.trap} type="button" disabled={solved} onClick={() => setHint("Looking real isn’t proof. Good fakes can look real, and forwarding spreads a rumour in minutes. Tag the clues, then check the official channel.", false)}><Forward />Looks real, forward it</button>
            {solved ? <span className={d.checked}><BadgeCheck /> Official channel checked</span> : <button className={k.primary} type="button" disabled={found.length !== 3} onClick={markSolved}>Check the official channel <ArrowRight /></button>}
          </div>
        </div>
      </div>
      <small>Pretend clip drawn for this lesson. No real person or footage.</small>
    </div>}

    {scene === 4 && <div className={k.panel}>
      <h2>What the official channel says</h2>
      <div className={d.site}>
        <div className={d.siteBar}><Lock aria-hidden="true" /><span>fair.cyberpur.example/notices</span><em><BadgeCheck aria-hidden="true" /> Official</em></div>
        <div className={d.siteBody}><small>Cyberpur Fair Committee · Notice</small><strong>The fair is ON this weekend</strong><span>Saturday and Sunday, 4 pm to 10 pm. A fake video of our organiser is going around. Please don’t forward it.</span></div>
      </div>
      <div className={d.compare}>
        <div data-show={at(.35)}><h3><Search aria-hidden="true" /> Clues</h3><ul><li>Odd blinking</li><li>Lips out of sync</li><li>Shadows that don’t fit</li></ul><small>Real videos can glitch. Good fakes can look clean.</small></div>
        <div data-show={at(.84)}><h3><ShieldCheck aria-hidden="true" /> Confirm</h3><ul><li>The official page</li><li>Trusted news</li><li>The school or organiser</li></ul><small>Check a source outside the clip.</small></div>
      </div>
      <small>Pretend website. Addresses ending in .example can never be real.</small>
    </div>}

    {scene === 5 && <Chat foot={<><BadgeCheck /><span>Clip reported and removed</span><small>The fair is on this weekend</small></>}>
      <div className={d.pinned}><Pin /> Pinned: official notice · the fair is ON</div>
      <Msg me>
        Checked the fair’s official page. The fair is ON! That clip is fake, please don’t forward it.
        <span className={d.link}><ShieldCheck /><span><b>fair.cyberpur.example/notices</b>Official notice · Fair is on this weekend</span></span>
      </Msg>
      <div className={d.system} data-show={at(.3)}><Trash2 /> Ms. Rao (class teacher) removed the clip</div>
      <Msg who="Meera" show={at(.45)}>Oops, deleting my forwards. Thanks, Kabir!</Msg>
      <Msg who="Dev" show={at(.55)}>Gate at 5. Giant wheel first!</Msg>
    </Chat>}
  </SceneSwap>;
}

const chapter: StoryChapter = {
  script,
  title: "Kabir and the cancelled fair",
  icon: ScanFace,
  character: { asset: "emotional-avatar", name: "Kabir" },
  interactionScene: 3,
  beginLabel: "Practise with Kabir",
  waitingText: "Story paused. Tag the clues and check the official channel to see what happens next.",
  lockedHint: "Help Kabir inspect the clip first.",
  World,
  credits: <p>Fair backdrop: original CyberSuraksha illustration. The clip, organiser and chat are drawn in code; no real person or footage is used.</p>,
};
export default chapter;
