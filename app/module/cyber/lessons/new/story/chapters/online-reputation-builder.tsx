"use client";

import { Award, Bus, Check, Clock, Droplets, Eye, Footprints, Globe, GraduationCap, Heart, Laugh, MessageSquare, Paperclip, Scale, Search, Shield, ShieldCheck, Smartphone, UserRound, Users } from "lucide-react";
import { useState } from "react";
import { SceneSwap } from "../StoryPlayer";
import type { StoryChapter, StoryWorldProps } from "../types";
import script from "./online-reputation-builder.json";
import k from "../story-player.module.css";
import r from "./online-reputation-builder.module.css";

type PostId = "project" | "comment" | "photo";
type Action = "keep" | "edit" | "delete" | "ask";
const actions: { id: Action; label: string; spoken: string }[] = [
  { id: "keep", label: "Keep", spoken: "Keep" },
  { id: "edit", label: "Edit", spoken: "Edit" },
  { id: "delete", label: "Delete & apologise", spoken: "Delete and apologise" },
  { id: "ask", label: "Hide & ask", spoken: "Hide and ask" },
];
const posts: { id: PostId; short: string; when: string; correct: Action; ok: string; why: Partial<Record<Action, string>> }[] = [
  { id: "project", short: "water-tester post", when: "3 days ago", correct: "keep", ok: "Keep: it’s accurate, respectful and shows real work. The panel should see this.",
    why: { edit: "Nothing here breaks the criteria. It’s accurate and respectful, so there’s nothing to edit. Keep it.", delete: "Deleting this hides Meera’s best evidence. It’s accurate, respectful and her own work. Keep it.", ask: "It’s Meera’s own work and nobody else is in it, so there’s no one to ask. Keep it." } },
  { id: "comment", short: "comment on Rahul’s drawing", when: "2 years ago", correct: "delete", ok: "Delete and apologise: removing it clears the page, and a direct apology repairs what it did to Rahul.",
    why: { keep: "The panel checks respect. Mocking a classmate fails that test, and Rahul can still see it. It has to go.", edit: "Editing still leaves the mockery in the history and in any screenshots. Delete it, and apologise to Rahul directly.", ask: "This isn’t about permission. The problem is disrespect. Delete it and apologise." } },
  { id: "photo", short: "photo of Aarav", when: "1 year ago", correct: "ask", ok: "Hide and ask: it’s Aarav’s face, so Aarav decides whether it stays public.",
    why: { keep: "Aarav never agreed to be posted, and forty people laughed at him. Consent comes first: hide it and ask him.", edit: "A new caption doesn’t fix the real problem: Aarav never agreed. Hide it and ask him.", delete: "Close! Taking it down is kind, but Aarav should decide. Hide it now and ask what he wants." } },
];

const facts = [{ label: "Searchable", Icon: Search, at: .34 }, { label: "Screenshots", Icon: Smartphone, at: .4 }, { label: "Lasts for years", Icon: Clock, at: .47 }];

/** One public post as the feed shows it; `compact` drops the picture for the audit list. */
function Post({ id, compact }: { id: PostId; compact?: boolean }) {
  if (id === "project") return <article className={r.post} data-compact={compact ?? false}>
    <header><span className={r.me}>M</span><div><strong>Meera S.</strong><small><Globe aria-hidden="true" />Public · 3 days ago</small></div></header>
    <p>Six weeks of testing: my water tester shows the lake got clearer after the clean-up drive!</p>
    {!compact && <div className={r.chart} aria-hidden="true"><Droplets />{[72, 64, 51, 40, 33, 28].map((h, i) => <span key={i} style={{ height: `${h}%` }} />)}<small>cloudiness ↓</small></div>}
    <footer><Heart aria-hidden="true" />56 likes · 9 comments</footer>
  </article>;
  if (id === "comment") return <article className={r.post} data-bad="true" data-compact={compact ?? false}>
    <header><span className={r.me}>M</span><div><strong>Meera S.</strong><small><Globe aria-hidden="true" />Public · 2 years ago</small></div></header>
    <p className={r.context}><MessageSquare aria-hidden="true" />Comment on Rahul’s drawing</p>
    <blockquote>“lol this looks like a potato”</blockquote>
    <footer><Laugh aria-hidden="true" />12 laughing reactions</footer>
  </article>;
  return <article className={r.post} data-bad="true" data-compact={compact ?? false}>
    <header><span className={r.me}>M</span><div><strong>Meera S.</strong><small><Globe aria-hidden="true" />Public · 1 year ago</small></div></header>
    <p>Look who fell asleep on the bus again</p>
    {compact ? <p className={r.context}><Bus aria-hidden="true" />Photo: Aarav, asleep</p> : <div className={r.photo} aria-hidden="true"><Bus /><span>zzz</span><small>Photo: Aarav, asleep</small></div>}
    <footer><Laugh aria-hidden="true" />40 laughing reactions</footer>
  </article>;
}

function World({ scene, playing, elapsed, solved, markSolved, hint, setHint, reduced }: StoryWorldProps) {
  const [decided, setDecided] = useState<Partial<Record<PostId, Action>>>({});
  const done = solved || posts.every(p => decided[p.id]);
  const chosen = (id: PostId) => solved ? posts.find(p => p.id === id)!.correct : decided[id];
  // Reveal an item once narration reaches that fraction of the scene (everything shows while paused).
  const cue = (at: number) => !playing || elapsed > script.scenes[scene].duration * at;
  const show = (at: number) => ({ "data-on": cue(at), "aria-hidden": !cue(at) });

  function choose(post: (typeof posts)[number], action: Action) {
    if (done || decided[post.id]) return;
    if (action !== post.correct) { setHint(post.why[action] ?? "Check this post against respect, integrity and consent."); return; }
    const next = { ...decided, [post.id]: action };
    setDecided(next); setHint(post.ok);
    if (posts.every(p => next[p.id])) window.setTimeout(markSolved, reduced ? 0 : 900);
  }

  return <SceneSwap scene={scene} reduced={reduced}>
    {(scene === 0 || scene === 5) && <div className={k.device}>
      <div className={k.deviceBar}><span><GraduationCap size={16} /> CYBERPUR YOUNG SCIENTISTS</span><span>{scene === 0 ? "Application · due Friday" : "Application status"}</span></div>
      <div className={`${k.deviceArt} ${r.form}`}>
        {scene === 0 ? <>
          <div className={r.fields}>
            <div className={r.field}><small>Applicant</small><span>Meera S. · Class 7</span></div>
            <div className={r.field}><small>Project</small><span>Lake water clarity tester</span></div>
            <div className={r.field} {...show(.3)}><small>Evidence</small><span><Paperclip aria-hidden="true" />test-results.pdf · 3 photos</span></div>
            <div className={r.progress}><span style={{ transform: "scaleX(.9)" }} /><small>90% complete</small></div>
          </div>
          <p className={r.notice} {...show(.66)}><Eye aria-hidden="true" /><span>The panel may review applicants’ <b>public profiles</b> for respect and integrity.</span></p>
        </> : <div className={r.status}>
          <span className={r.stamp}><Award aria-hidden="true" />Shortlisted</span>
          <strong>Interview on Monday</strong>
          <span>“Tell us about your water tester.”</span>
        </div>}
      </div>
      <div className={k.deviceFoot}>{scene === 0
        ? <><Droplets /><span>Meera’s project: a clearer lake after the clean-up drive</span></>
        : <><span className={r.chip}><Check aria-hidden="true" />Apology sent</span><span className={r.chip}><Shield aria-hidden="true" />Photo private · Aarav’s choice</span><span className={r.chip}><ShieldCheck aria-hidden="true" />Profile audited</span></>}</div>
    </div>}

    {scene === 1 && <div className={k.device}>
      <div className={k.deviceBar}><span><Eye size={16} /> PROFILE · PUBLIC VIEW</span><span>What anyone can see</span></div>
      <div className={`${k.deviceArt} ${r.feed}`}>
        <div {...show(.12)} className={r.reveal}><Post id="project" /></div>
        <div {...show(.36)} className={r.reveal}><Post id="comment" /></div>
        <div {...show(.62)} className={r.reveal}><Post id="photo" /></div>
      </div>
      <div className={k.deviceFoot}><Globe /><span>Public posts are searchable, can be screenshotted, and stay up until removed.</span></div>
    </div>}

    {scene === 2 && <div className={k.panel}>
      <div className={r.sister}><span className={r.avatar}><UserRound aria-hidden="true" /></span><div><small>Arjun · Meera’s brother</small><p>“Read it the way the panel would.”</p></div></div>
      <div className={r.term} {...show(.14)}><Footprints aria-hidden="true" /><div><strong>Digital footprint</strong><span>Everything you share publicly, and what others share about you.</span></div></div>
      <div className={r.facts}>{facts.map(({ label, Icon, at }) => <span key={label} {...show(at)}><Icon aria-hidden="true" />{label}</span>)}</div>
      <h2>The panel’s test</h2>
      <div className={r.criteria}>
        <span {...show(.62)}><Scale aria-hidden="true" />Respect</span>
        <span {...show(.66)}><ShieldCheck aria-hidden="true" />Integrity</span>
        <span {...show(.8)} data-extra="true"><Users aria-hidden="true" />Consent: did everyone agree?</span>
      </div>
    </div>}

    {scene === 3 && <div className={`${k.panel} ${r.task}`}>
      <h2>Audit Meera’s public posts</h2>
      <p>Choose an action for each post, based on respect, integrity and consent.</p>
      <div className={r.audit}>{posts.map(post => { const pick = chosen(post.id); return <div className={r.auditRow} key={post.id} data-done={Boolean(pick)}>
        <Post id={post.id} compact />
        <div className={r.actions} role="group" aria-label={`Action for the ${post.short}`}>{actions.map(a => <button key={a.id} type="button" aria-label={`${a.spoken}: ${post.short}`} aria-pressed={pick === a.id} data-trap={(post.id === "project" && a.id === "delete") || (post.id === "comment" && a.id === "keep") || undefined} disabled={done || Boolean(pick)} onClick={() => choose(post, a.id)}>{pick === a.id && <Check aria-hidden="true" />}{a.label}</button>)}</div>
      </div>; })}</div>
      <p className={k.hint} aria-live="polite">{hint || (done ? "Audit complete: every choice matches the evidence." : `${posts.filter(p => chosen(p.id)).length} of 3 posts audited.`)}</p>
      <small>Fictional profile and posts.</small>
    </div>}

    {scene === 4 && <div className={k.panel}>
      <h2>Before you post</h2>
      <div className={r.settings} {...show(.06)}>
        <div><strong>Who can see new posts?</strong><small>Privacy settings</small></div>
        <span className={r.segment}><span>Public</span><span data-on="true"><Users aria-hidden="true" />Friends only</span></span>
      </div>
      <p className={r.warn} {...show(.3)}><Smartphone aria-hidden="true" />Settings shrink the audience. They can’t stop screenshots.</p>
      {["Who could see this?", "Could it hurt someone?", "Did everyone in it agree?"].map((step, i) => <div className={k.step} key={step} data-active={cue([.5, .58, .66][i])}><span><Check /></span>{step}</div>)}
      <p className={r.good} {...show(.8)}><Award aria-hidden="true" />A good footprint isn’t empty. It shows your best work.</p>
    </div>}
  </SceneSwap>;
}

const chapter: StoryChapter = {
  script,
  title: "Meera’s scholarship profile",
  icon: GraduationCap,
  character: { asset: "emotional-avatar", name: "Meera" },
  interactionScene: 3,
  beginLabel: "Practise with Meera",
  waitingText: "Story paused. Audit all three posts to continue.",
  lockedHint: "Help Meera audit her public posts first.",
  World,
};
export default chapter;
