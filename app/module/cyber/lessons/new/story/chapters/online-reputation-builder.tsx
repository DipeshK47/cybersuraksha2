"use client";

import type { LucideIcon } from "lucide-react";
import { ArrowRight, Award, Camera, Check, CircleCheck, Clock, Droplets, EyeOff, FileText, Footprints, Globe, Link2, Lock, Mail, MessageCircle, MessageCircleHeart, Mic, PenLine, PhoneOff, Scale, Sparkles, Tags, Trash2, TriangleAlert, UserCheck, UserRound, Users, Video } from "lucide-react";
import { useState } from "react";
import { SceneSwap } from "../StoryPlayer";
import type { StoryChapter, StoryWorldProps } from "../types";
import script from "./online-reputation-builder.json";
import k from "../story-player.module.css";
import r from "./online-reputation-builder.module.css";

type Action = "keep" | "edit" | "delete" | "ask";
type PostData = { id: string; context: string; when: string; text: string; art?: "filter" | "sleep" | "team"; flag?: string };
type AuditPost = PostData & { tab: string; noun: string; right: Action; trap?: Action; done: LucideIcon; outcome: string; hints: Partial<Record<Action, string>> };

const actions: { id: Action; label: string; icon: LucideIcon }[] = [
  { id: "keep", label: "Keep", icon: Check },
  { id: "edit", label: "Edit", icon: PenLine },
  { id: "delete", label: "Delete", icon: Trash2 },
  { id: "ask", label: "Ask permission", icon: UserCheck },
];

const posts: AuditPost[] = [
  { id: "project", tab: "Project post", noun: "project post", context: "Public post", when: "2 weeks ago", art: "filter", right: "keep", trap: "delete", done: Check,
    text: "A month of testing, and my solar water filter works! Sand, gravel and charcoal turn muddy water clear. Thanks, Ms Rao, for the lab time.",
    outcome: "Kept. It’s honest, it’s his own work, and it’s kind to everyone in it.",
    hints: {
      delete: "Wait! This post shows real work and thanks a teacher. That’s the integrity the panel hopes to see. Deleting it hides his best evidence.",
      edit: "Nothing here is unkind or private. It’s honest and it’s Kabir’s own work, so it can stay as it is.",
      ask: "Only Kabir’s own project is in this post, and it thanks Ms Rao kindly. No one’s permission is needed.",
    } },
  { id: "comment", tab: "Old comment", noun: "comment about Tanvi", context: "Comment on Tanvi’s assembly song video", when: "1 year ago", flag: "Mocks a classmate", right: "delete", trap: "keep", done: MessageCircleHeart,
    text: "lol Tanvi sounds like a pressure cooker whistle",
    outcome: "Deleted. Kabir also messages Tanvi to say sorry.",
    hints: {
      keep: "Keeping it says the joke is still okay. Anyone can read it, including Tanvi and the panel. Mocking someone isn’t respect.",
      edit: "A softer joke is still a joke at Tanvi’s expense. Remove it, then think about saying sorry.",
      ask: "This isn’t about permission. The comment is unkind, so it shouldn’t stay up at all.",
    } },
  { id: "photo", tab: "Bus photo", noun: "photo of Ishaan", context: "Public post · School trip", when: "3 months ago", art: "sleep", flag: "No consent from Ishaan", right: "ask", done: EyeOff,
    text: "Ishaan asleep on the trip bus hahaha",
    outcome: "Hidden for now. Kabir asks for Ishaan’s consent before anyone sees it again.",
    hints: {
      keep: "It’s Ishaan’s face, not Kabir’s. A photo shared without asking can embarrass someone. Ishaan should get a say.",
      edit: "A new caption doesn’t fix it. Ishaan never agreed to share this photo. Ask him first.",
      delete: "Taking it down is safe, but it’s Ishaan’s photo, so he gets a say too. Hide it and ask him what he wants.",
    } },
];
const teamPost: PostData = { id: "team", context: "Public post · Science club", when: "Just now", art: "team", text: "Science club team photo, shared with everyone’s OK. Next build: a rain gauge!" };

const ideas = [
  { icon: Globe, title: "Audience", text: "Public means anyone, not just friends.", at: .2 },
  { icon: Camera, title: "Screenshots and copies", text: "A deleted post can survive as someone’s copy.", at: .32 },
  { icon: Lock, title: "Privacy settings", text: "They help, but they aren’t a hiding place.", at: .6 },
  { icon: Scale, title: "The fairness test", text: "Is each post fair to the people in it?", at: .76 },
];

function Thumb({ kind }: { kind: NonNullable<PostData["art"]> }) {
  return <span className={r.thumb} data-kind={kind} aria-hidden="true">
    {kind === "filter" ? <Droplets /> : kind === "team" ? <Users /> : <><UserRound /><i>z</i><i>z</i></>}
  </span>;
}

function Post({ post, flagged = false }: { post: PostData; flagged?: boolean }) {
  return <article className={r.post} data-flagged={flagged}>
    <span className={r.avatar} aria-hidden="true">K</span>
    <div className={r.postMain}>
      <div className={r.postMeta}><strong>Kabir</strong><span>{post.context} · {post.when}</span></div>
      <div className={r.postText}>{post.text}</div>
      {flagged && post.flag && <span className={r.flag}><TriangleAlert aria-hidden="true" />{post.flag}</span>}
    </div>
    {post.art && <Thumb kind={post.art} />}
  </article>;
}

function FilterArt() {
  return <div className={r.filterArt} aria-hidden="true">
    <span className={r.sun} />
    <span className={r.solar} />
    <span className={r.jar} />
    <Droplets className={r.drip} />
    <span className={r.glass} />
  </div>;
}

function World({ scene, playing, elapsed, solved, markSolved, hint, setHint, reduced }: StoryWorldProps) {
  const [choices, setChoices] = useState<Record<string, Action>>({});
  const [active, setActive] = useState(0);
  const [wrong, setWrong] = useState("");
  // Reveal an item once narration reaches that share of the scene; everything shows while paused.
  const cue = (share: number) => !playing || elapsed > script.scenes[scene].duration * share;
  const isDone = (post: AuditPost) => choices[post.id] === post.right;
  const done = posts.filter(isDone).length;
  const current = posts[active];

  function choose(action: Action) {
    if (solved || isDone(current)) return;
    if (action !== current.right) { setWrong(`${current.id}:${action}`); setHint(current.hints[action] ?? ""); return; }
    setChoices(value => ({ ...value, [current.id]: action })); setWrong(""); setHint("");
    const next = posts.findIndex(post => post !== current && !isDone(post));
    if (next >= 0) setActive(next);
  }

  return <SceneSwap scene={scene} reduced={reduced}>
    {scene === 0 && <div className={k.device}>
      <div className={k.deviceBar}><span><Award size={16} /> CYBERPUR SCHOLARSHIPS</span><span>Pretend portal</span></div>
      <div className={r.portal}>
        <div className={r.projectCard}>
          <FilterArt />
          <div><small>Young Scientists Scholarship</small><strong>Solar water filter</strong><span>Kabir · Class 7 · Cyberpur Middle School</span></div>
        </div>
        <div className={r.checklist}>
          <strong>Application</strong>
          <div className={r.item} data-done={cue(.5)}><FileText aria-hidden="true" /><span>Project report</span><i><Check /></i></div>
          <div className={r.item} data-done={cue(.6)}><Mail aria-hidden="true" /><span>Teacher’s letter</span><i><Check /></i></div>
          <div className={`${r.item} ${r.reveal}`} data-todo="true" data-show={cue(.7)}><Link2 aria-hidden="true" /><span>Public profile link</span><em>To do</em></div>
          <div className={r.progress} aria-label={`${[cue(.5), cue(.6)].filter(Boolean).length} of 3 steps done`}><span style={{ transform: `scaleX(${[cue(.5), cue(.6)].filter(Boolean).length / 3})` }} /></div>
        </div>
      </div>
      <div className={k.deviceFoot}><Clock aria-hidden="true" /><span>Deadline: <b>Friday, 5 PM</b></span><small>Example only</small></div>
    </div>}

    {scene === 1 && <div className={k.device}>
      <div className={k.deviceBar}><span><Globe size={16} /> VIEW AS PUBLIC</span><span>@kabir.builds</span></div>
      <div className={r.feedBody}>
        <div className={`${r.rule} ${r.reveal}`} data-show={cue(.04)}><Award aria-hidden="true" /><div><strong>Rule 4 · Public profiles</strong><span>The panel may view applicants’ public profiles for respect and integrity.</span></div></div>
        {posts.map((post, i) => <div key={post.id} className={r.reveal} data-show={cue([.38, .48, .71][i])}><Post post={post} flagged={Boolean(post.flag) && cue([1, .6, .86][i])} /></div>)}
      </div>
    </div>}

    {scene === 2 && <div className={k.panel}>
      <div className={r.call}>
        <div className={r.callMain}><span className={r.callAvatar} aria-hidden="true">ZA</span><div><strong>Aunt Zoya</strong><span><i />Video call · 04:12</span></div></div>
        <span className={r.selfView} aria-hidden="true"><UserRound /><small>Kabir</small></span>
        <div className={r.callControls} aria-hidden="true"><span><Mic /></span><span><Video /></span><span data-end="true"><PhoneOff /></span></div>
      </div>
      <div className={r.zoyaSays}>“One old post doesn’t define you. Let’s look at it together.”</div>
      {ideas.map(idea => <div className={`${k.step} ${r.idea}`} key={idea.title} data-active={cue(idea.at)}><span><idea.icon /></span><div><strong>{idea.title}</strong><small>{idea.text}</small></div></div>)}
    </div>}

    {scene === 3 && <div className={`${k.panel} ${r.audit}`}>
      <div className={r.auditHead}><h2>Audit Kabir’s public profile</h2><span className={r.count}>{done} of 3 checked</span></div>
      <div className={r.criteria}><Award aria-hidden="true" /><span>The panel looks for</span><b>Respect</b><b>Integrity</b><b>Own work</b></div>
      {done < 3 ? <>
        <div className={r.postTabs} role="group" aria-label="Posts to review">
          {posts.map((post, i) => <button key={post.id} type="button" aria-current={i === active ? "true" : undefined} data-done={isDone(post)} onClick={() => { setActive(i); setWrong(""); setHint(""); }}><span>{isDone(post) ? <Check aria-label="checked" /> : i + 1}</span>{post.tab}</button>)}
        </div>
        <Post post={current} flagged={Boolean(current.flag)} />
        {isDone(current)
          ? <div className={r.outcome}><current.done aria-hidden="true" />{current.outcome}</div>
          : <div className={r.verdicts} role="group" aria-label={`What should Kabir do with the ${current.noun}?`}>
            {actions.map(({ id, label, icon: Icon }) => <button key={id} type="button" aria-label={`${label}: ${current.noun}`} data-trap={current.trap === id || undefined} data-wrong={wrong === `${current.id}:${id}`} onClick={() => choose(id)}><Icon aria-hidden="true" /><span>{label}</span></button>)}
          </div>}
      </> : <ul className={r.summary}>
        {posts.map(post => <li key={post.id}><post.done aria-hidden="true" /><div><strong>{post.tab}</strong><span>{post.outcome}</span></div></li>)}
      </ul>}
      <p className={k.hint} aria-live="polite">{hint || (solved ? "Audit complete. Kabir’s profile is ready for the panel." : done === 3 ? "All three posts checked. Each choice matches the rules." : "Pick an action for this post. Each choice tells you why.")}</p>
      <div className={k.actions}><button className={k.primary} disabled={done < 3 || solved} onClick={markSolved} type="button">{solved ? <><Check />Audit complete</> : <>Finish the audit <ArrowRight /></>}</button></div>
      <small>Pretend posts and people. Never share real personal details in a lesson.</small>
    </div>}

    {scene === 4 && <div className={k.panel}>
      <div className={r.term}><Footprints aria-hidden="true" /><div><strong>Digital footprint</strong><span>Every post, comment and photo others can find. Together, they shape your online reputation.</span></div></div>
      <div className={r.messages}>
        <div className={`${r.thread} ${r.reveal}`} data-show={cue(.25)}>
          <span className={r.threadHead}><MessageCircle aria-hidden="true" />Kabir and Tanvi</span>
          <div className={r.bubble} data-me="true">Tanvi, I’m sorry about my comment on your song. It was mean, and singing at assembly took guts.</div>
          <div className={r.bubble}><b aria-hidden="true">T</b>Thanks for saying that. It means a lot.</div>
        </div>
        <div className={`${r.thread} ${r.reveal}`} data-show={cue(.55)}>
          <span className={r.threadHead}><MessageCircle aria-hidden="true" />Kabir and Ishaan</span>
          <div className={r.bubble}><b aria-hidden="true">I</b>Not the bus one, please! The team photo is fine.</div>
        </div>
      </div>
      <div className={`${r.settings} ${r.reveal}`} data-show={cue(.74)}>
        <strong><Lock aria-hidden="true" />Privacy settings</strong>
        <div><Tags aria-hidden="true" /><span>Review tags before they appear</span><i>On</i></div>
        <div><Users aria-hidden="true" /><span>Everyday posts</span><i>Friends only</i></div>
        <div><Globe aria-hidden="true" /><span>Project post</span><i>Public</i></div>
      </div>
    </div>}

    {scene === 5 && <div className={k.device}>
      <div className={k.deviceBar}><span><Award size={16} /> CYBERPUR SCHOLARSHIPS</span><span>Pretend portal</span></div>
      <div className={r.feedBody}>
        <div className={r.submitted}><CircleCheck aria-hidden="true" /><div><strong>Application submitted</strong><span>Thursday · a day before the deadline</span></div></div>
        <div className={r.previewLabel}><Globe aria-hidden="true" />Public profile preview</div>
        <div className={r.reveal} data-show={cue(.12)}><Post post={posts[0]} /></div>
        <div className={r.reveal} data-show={cue(.2)}><Post post={teamPost} /></div>
      </div>
      <div className={`${k.deviceFoot} ${r.pauseFoot}`}><Sparkles aria-hidden="true" /><span>Pause before posting:</span>{["Who’s the audience?", "Who’s in it?", "How will it read later?"].map((text, i) => <span key={text} className={`${r.pauseChip} ${r.reveal}`} data-show={cue([.6, .72, .78][i])}>{text}</span>)}</div>
    </div>}
  </SceneSwap>;
}

const chapter: StoryChapter = {
  script,
  title: "Kabir’s public profile",
  icon: Award,
  character: { asset: "emotional-avatar", name: "Kabir" },
  interactionScene: 3,
  beginLabel: "Practise with Kabir",
  waitingText: "Story paused. Audit Kabir’s posts to see what happens next.",
  lockedHint: "Help Kabir audit his public posts first.",
  World,
};
export default chapter;
