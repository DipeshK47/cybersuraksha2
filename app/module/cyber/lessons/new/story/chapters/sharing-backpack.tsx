"use client";

import { ArrowRight, Backpack, Camera, Check, Eye, Globe, House, Lock, Palette, PawPrint, Pencil, Phone, School, ShieldCheck, Smile, UserRound, Users } from "lucide-react";
import { useState } from "react";
import { SceneSwap } from "../StoryPlayer";
import type { StoryChapter, StoryWorldProps } from "../types";
import script from "./sharing-backpack.json";
import k from "../story-player.module.css";
import r from "./sharing-backpack.module.css";

type Bag = "private" | "share";
// Mid-story sort. `no` is the why-hint for a wrong bag; Home address → Safe to Share is the tempting mistake.
const items: { name: string; icon: typeof House; bag: Bag; yes: string; no: string }[] = [
  { name: "Favourite colour", icon: Palette, bag: "share", yes: "Yes! A colour can’t show who you are or where you live.", no: "A favourite colour can’t show who you are or where you live. It’s safe to share!" },
  { name: "Home address", icon: House, bag: "private", yes: "Yes. An address shows where your home is.", no: "Careful! This page is public. An address shows people you don’t know where you live. Keep it private." },
  { name: "Tiger drawing", icon: Pencil, bag: "share", yes: "Yes! Sharing drawings is what the club is for.", no: "Sharing drawings is what the club is for! Just keep your name and address off them." },
  { name: "Selfie", icon: Camera, bag: "private", yes: "Yes. A photo of you needs a grown-up’s okay first.", no: "A selfie shows your face to everyone. Keep it private and ask a grown-up first." },
  { name: "Favourite animal", icon: PawPrint, bag: "share", yes: "Yes! Loving tigers is fun to share.", no: "A favourite animal can’t show who you are or where you live. It’s safe to share!" },
  { name: "Full name", icon: UserRound, bag: "private", yes: "Yes. A club nickname is enough.", no: "Your full name tells people you don’t know who you are. A club nickname is enough." },
];
const bags = [
  { id: "private", label: "Keep Private", sub: "Stays with family", icon: Lock },
  { id: "share", label: "Safe to Share", sub: "Fine for the club", icon: Smile },
] as const;
const profile = [
  { label: "Full name", value: "Rohan Mehra", icon: UserRound },
  { label: "Home address", value: "14 Lotus Lane, Cyberpur", icon: House },
  { label: "School", value: "Cyberpur Primary School", icon: School },
  { label: "Favourite colour", value: "Orange", icon: Palette },
  { label: "Profile photo", value: "Selfie ready to upload", icon: Camera },
];

/** Rohan's tiger drawing is also his club avatar. */
function Tiger({ label }: { label?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img className={r.tigerArt} src="/cyber-missions/refined/tiger-drawing.webp" width={750} height={750} alt={label ?? ""} />;
}

/** Rohan's public club page: the risky preview (scene 2) or the saved, safer page (scene 6). */
function ClubPage({ safe, comment, flagged }: { safe: boolean; comment: boolean; flagged: boolean }) {
  return <div className={k.device}>
    <div className={k.deviceBar}>{safe ? <><span><Palette size={16} /> DRAWING CLUB</span><span>Saved with Mum</span></> : <><span><Eye size={16} /> PREVIEW</span><span>Not saved yet</span></>}</div>
    <div className={r.screen}>
      <div className={r.public} data-safe={safe}>{safe ? <ShieldCheck /> : <Globe />}{safe ? "Profile saved · private details kept private" : "Public page · anyone online can see it"}</div>
      <div className={r.info}>
        <div className={r.head}>
          <span className={r.avatar} data-kind={safe ? "tiger" : "selfie"}>{safe ? <Tiger /> : <UserRound />}</span>
          <div><strong>{safe ? "TigerPencil" : "Rohan Mehra"}</strong><span>{safe ? "Club nickname" : "Selfie · full name"}</span></div>
        </div>
        {(safe ? [
          { icon: Palette, text: <>Favourite colour <i className={r.swatch} /> Orange</> },
          { icon: PawPrint, text: "Favourite animal: Tiger" },
          { icon: Lock, text: "Name, address, school and selfie stay private" },
        ] : [
          { icon: House, text: "14 Lotus Lane, Cyberpur" },
          { icon: School, text: "Cyberpur Primary School" },
        ]).map(({ icon: Icon, text }, i) => <div className={r.row} key={i}><Icon aria-hidden="true" /><span>{text}</span>{!safe && <em data-on={flagged}><Eye aria-hidden="true" />Everyone</em>}</div>)}
      </div>
      <div className={r.post}>
        <figure className={r.art}><Tiger label="Rohan’s crayon tiger drawing" /><figcaption><Eye aria-hidden="true" />318 views</figcaption></figure>
        {comment && <div className={`${r.comment} ${k.fitIn}`}>
          <span aria-hidden="true">DS</span>
          <div><strong>DoodleStar <small>Someone Rohan doesn’t know</small></strong><p>Cool tiger! Hello from far away.</p></div>
        </div>}
      </div>
    </div>
    <div className={k.deviceFoot}>{safe ? <><Palette /><span>Kids everywhere can enjoy his tiger.</span></> : <><Globe /><span>Everyone online would see these details.</span></>}<small>Example only · pretend details</small></div>
  </div>;
}

function World({ scene, playing, elapsed, solved, markSolved, hint, setHint, reduced }: StoryWorldProps) {
  const [placed, setPlaced] = useState<Record<string, Bag>>({});
  const [active, setActive] = useState("");
  const done = items.every(item => placed[item.name]);
  // Reveal a piece once narration reaches `part` of scene `i`; everything shows when paused.
  const at = (i: number, part: number) => !playing || elapsed > script.scenes[i].duration * part;
  function pack(name: string, bag: Bag) {
    const item = items.find(x => x.name === name);
    if (solved || !item || placed[name]) return;
    setActive("");
    if (item.bag !== bag) { setHint(item.no, false); return; }
    const next = { ...placed, [name]: bag };
    setPlaced(next);
    setHint(items.every(x => next[x.name]) ? "" : item.yes);
  }
  return <SceneSwap scene={scene} reduced={reduced}>
    {scene === 0 && <div className={k.device}>
      <div className={k.deviceBar}><span><Palette size={16} /> DRAWING CLUB</span><span>Cyberpur Kids Club</span></div>
      <div className={r.screen}>
        <figure className={`${r.art} ${r.gallery}`}><Tiger label="Rohan’s crayon tiger drawing" /><figcaption><Check aria-hidden="true" />Posted to the gallery</figcaption></figure>
        <div className={r.form}>
          <strong>Make your profile</strong>
          {profile.map(({ label, value, icon: Icon }, i) => { const filled = at(0, .55 + i * .09); return <div className={r.field} data-filled={filled} key={label}><Icon aria-hidden="true" /><span>{label}</span><b>{filled ? value : ""}</b></div>; })}
        </div>
      </div>
      <div className={k.deviceFoot}><Pencil /><span>Rohan is filling in every box…</span><small>Example only · pretend details</small></div>
    </div>}
    {scene === 1 && <ClubPage safe={false} comment={at(1, .12)} flagged={at(1, .62)} />}
    {scene === 2 && <div className={k.panel}>
      <div className={r.mum}><span>Mum</span><p>“You did the right thing by stopping.”</p></div>
      <h2>Who can see a public page?</h2>
      {([["Friends from class", Users], ["Kids in the drawing club", Palette], ["People we don’t know", Globe]] as const).map(([text, Icon], i) => <div className={k.step} key={text} data-active={at(2, .58 + i * .13)}><span><Icon /></span>{text}</div>)}
      <small>Rohan hasn’t saved anything yet. Stopping to ask was the right move.</small>
    </div>}
    {scene === 3 && <div className={k.panel}>
      <h2>Pack Rohan’s sharing backpack</h2><p>Tap a card, then tap a bag. You can drag cards too.</p>
      <div className={r.cards}>{items.map(({ name, icon: Icon }) => <button key={name} type="button" className={r.card} aria-pressed={active === name} data-placed={Boolean(placed[name])} disabled={solved || Boolean(placed[name])} draggable={!solved && !placed[name]} onDragStart={event => event.dataTransfer.setData("text/plain", name)} onClick={() => { setActive(value => value === name ? "" : name); setHint(""); }}><Icon aria-hidden="true" />{name}{placed[name] && <Check className={r.tick} aria-hidden="true" />}</button>)}</div>
      <div className={r.bags}>{bags.map(({ id, label, sub, icon: Icon }) => { const packed = items.filter(x => placed[x.name] === id); return <button key={id} type="button" className={r.bag} data-bag={id} data-ready={Boolean(active)} aria-label={`${label} bag, ${packed.length} packed`} disabled={solved} onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); pack(event.dataTransfer.getData("text/plain"), id); }} onClick={() => active ? pack(active, id) : setHint("Tap a card first, then tap a bag.")}>
        <span className={r.handle} aria-hidden="true" /><Icon aria-hidden="true" /><strong>{label}</strong><small>{sub}</small>
        <span className={r.pocket}>{packed.map(x => <span key={x.name} className={k.fitIn}>{x.name}</span>)}</span>
      </button>; })}</div>
      <p className={k.hint} aria-live="polite">{hint || (done ? "All packed! Likes to share, private details kept safe." : active ? `Which bag does “${active}” go in?` : "Six cards, two bags. Where does each one belong?")}</p>
      <div className={k.actions}><button className={k.primary} disabled={!done || solved} onClick={markSolved} type="button">{solved ? <><Check />Backpack packed</> : <><Backpack />Zip up the bags <ArrowRight /></>}</button></div>
    </div>}
    {scene === 4 && <div className={k.panel}>
      <h2>Share your likes. Keep your details.</h2>
      <div className={r.lists}>
        <div data-bag="private"><strong><Lock aria-hidden="true" />Keep private</strong>{([["Full name", UserRound], ["Home address", House], ["School name", School], ["Phone number", Phone]] as const).map(([text, Icon], i) => <div className={r.li} key={text} data-active={at(4, .28 + i * .06)}><Icon aria-hidden="true" />{text}</div>)}</div>
        <div data-bag="share"><strong><Smile aria-hidden="true" />Safe to share</strong>{([["Favourite colour", Palette], ["Favourite animal", PawPrint], ["Your drawings", Pencil]] as const).map(([text, Icon], i) => <div className={r.li} key={text} data-active={at(4, .74 + i * .06)}><Icon aria-hidden="true" />{text}</div>)}</div>
      </div>
      <div className={r.ask} data-active={at(4, .5)}><Camera aria-hidden="true" /><div><strong>Photos of you</strong><span>Ask a grown-up before sharing any photo.</span></div><Users aria-hidden="true" /></div>
      <small>Tip: a club nickname can stand in for your full name.</small>
    </div>}
    {scene === 5 && <ClubPage safe comment flagged={false} />}
  </SceneSwap>;
}

const chapter: StoryChapter = {
  script,
  title: "Rohan’s sharing backpack",
  icon: Backpack,
  character: { asset: "boy-emotions", name: "Rohan" },
  interactionScene: 3,
  beginLabel: "Practise with Rohan",
  waitingText: "Story paused. Sort all six cards to see what happens next.",
  lockedHint: "Help Rohan pack both bags first.",
  World,
};
export default chapter;
