"use client";

import { Blocks, Castle, Check, CircleSlash, Flag, Gift, Megaphone, Phone, PhoneOff, Plus, ShieldCheck, ShoppingBag, Sparkles, Tablet, Timer, TriangleAlert, Trash2, UserRound } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { SceneSwap } from "../StoryPlayer";
import type { StoryChapter, StoryWorldProps } from "../types";
import script from "./surprise-pop-up.json";
import k from "../story-player.module.css";
import r from "./surprise-pop-up.module.css";

const claimHint = "Wait! Rohan never entered a contest, so this prize isn’t real. CLAIM wants Mum’s number. Put it in the trash.";
const clues = [{ Icon: Gift, text: "A prize he never entered", at: .5 }, { Icon: Timer, text: "A timer that rushes him", at: .72 }, { Icon: Phone, text: "It wants Mum’s phone number", at: .86 }];
const fieldHint = "Stop! Never type a phone number into a pop-up. Drag it to the trash instead.";

/** A blocky game castle built from CSS. `built(at)` ghosts each piece until the narration reaches it. */
function CastleScene({ built = () => true, flag = false, dim = false, hotbar = false }: { built?: (at: number) => boolean; flag?: boolean; dim?: boolean; hotbar?: boolean }) {
  return <div className={r.land} aria-hidden="true">
    <span className={r.sun} /><span className={r.cloud} /><span className={r.cloud} data-b="" />
    <span className={r.hill} /><span className={r.hill} data-b="" /><span className={r.ground} />
    <span className={r.moat} /><span className={r.bridge} data-on={built(.44)} />
    <div className={r.castle}>
      <span className={r.wall} />
      {[0, 1, 2, 3].map(i => <span key={i} className={r.tower} data-t={i} data-on={built(.3 + i * .03)}><i /></span>)}
      <span className={r.gate} data-on={built(.52)} />
      {flag ? <span className={r.flag} /> : <span className={r.flagSlot}><Plus /></span>}
    </div>
    {hotbar && <div className={r.hotbar}><span><Blocks /></span><span><Castle /></span><span data-pick=""><Flag /></span></div>}
    {dim && <span className={r.dim} />}
  </div>;
}

/** The fake prize window. Interactive only in the task scene; elsewhere it is a picture. */
function PopUp({ left = 10, field = true, onClaim, onField }: { left?: number; field?: boolean; onClaim?: () => void; onField?: () => void }) {
  const live = Boolean(onClaim);
  const Tag = (live ? "button" : "span") as "button";
  return <>
    <div className={r.popTop}><Sparkles aria-hidden="true" /><span>SURPRISE PRIZE!</span><b aria-hidden="true"><Timer />0:{String(left).padStart(2, "0")}</b></div>
    <div className={r.popBody}>
      <span className={r.prize}><Tablet aria-hidden="true" /></span>
      <div><strong>You won a free tablet!</strong><span>Claim in 10 seconds!</span></div>
      <div className={r.claimRow}>
        <Tag className={r.field} data-on={field} data-trap={live || undefined} type={live ? "button" : undefined} onClick={onField}><Phone aria-hidden="true" />Mum’s phone number</Tag>
        <Tag className={r.claim} data-trap={live || undefined} type={live ? "button" : undefined} onClick={onClaim}>CLAIM</Tag>
      </div>
    </div>
  </>;
}

function TrashTask({ solved, markSolved, hint, setHint, reduced }: Pick<StoryWorldProps, "solved" | "markSolved" | "hint" | "setHint" | "reduced">) {
  const area = useRef<HTMLDivElement>(null);
  const bin = useRef<HTMLButtonElement>(null);
  const dragged = useRef(false);
  const [over, setOver] = useState(false);
  const [binned, setBinned] = useState(false);
  const done = solved || binned;

  function overBin(point: { x: number; y: number }) {
    const b = bin.current?.getBoundingClientRect();
    if (!b) return false;
    const x = point.x - window.scrollX, y = point.y - window.scrollY;
    return x > b.left - 16 && x < b.right + 16 && y > b.top - 16 && y < b.bottom + 16;
  }
  function trash() {
    if (done) return;
    setBinned(true); setOver(false); setHint("");
    // Let the pop-up shrink into the bin before the story moves on.
    window.setTimeout(markSolved, reduced ? 0 : 280);
  }
  function trap(message: string) {
    if (done || dragged.current) return;
    setHint(message);
  }

  return <div className={k.panel}>
    <h2>Help Rohan clear his castle</h2>
    <p>Drag the pop-up into the trash, or tap <b>Move to trash</b>.</p>
    <div className={r.game}>
      <div className={r.arena} ref={area}>
        <CastleScene dim={!done} />
        {done && <div className={`${k.badge} ${k.fitIn}`}><ShieldCheck /> Castle clear!</div>}
        <AnimatePresence>
          {!done && <motion.div key="popup" className={r.popup} data-flash={!reduced} role="group" aria-label="Surprise prize pop-up. Drag it to the trash."
            drag dragConstraints={area} dragElastic={.08} dragMomentum={false} dragSnapToOrigin={!over}
            whileDrag={reduced ? undefined : { scale: .97 }}
            onDragStart={() => { dragged.current = true; }}
            onDrag={(_, info) => setOver(overBin(info.point))}
            onDragEnd={(_, info) => { if (overBin(info.point)) trash(); else setOver(false); window.setTimeout(() => { dragged.current = false; }, 0); }}
            exit={reduced ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, scale: .15, transition: { duration: .26, ease: [.23, 1, .32, 1] } }}>
            <PopUp onClaim={() => trap(claimHint)} onField={() => trap(fieldHint)} />
          </motion.div>}
        </AnimatePresence>
      </div>
      <div className={r.dock}>
        <span className={r.slots} aria-hidden="true"><span><Blocks /></span><span><Castle /></span><span><Flag /></span></span>
        <button ref={bin} className={r.bin} data-over={over} data-full={done} onClick={trash} disabled={done} type="button">
          {done ? <Check aria-hidden="true" /> : <Trash2 aria-hidden="true" />}{done ? "In the trash" : "Move to trash"}
        </button>
      </div>
    </div>
    <p className={k.hint} aria-live="polite">{hint || (done ? "Gone! Mum’s number stayed private, and the castle is back." : "Tip: a prize you never entered is a trick.")}</p>
    <small>Pretend pop-up. Example only.</small>
  </div>;
}

function World({ scene, playing, elapsed, solved, markSolved, hint, setHint, reduced }: StoryWorldProps) {
  // Reveal an item once narration reaches that fraction of the scene (everything shows while paused).
  const cue = (at: number) => !playing || elapsed > script.scenes[scene].duration * at;
  const on = (at: number) => ({ "data-on": cue(at), "aria-hidden": !cue(at) });
  // The fake countdown starts again at 10 after it runs out: it was never a real deadline.
  const left = playing ? 10 - (Math.floor(elapsed) % 10) : 10;

  return <SceneSwap scene={scene} reduced={reduced}>
    {(scene === 0 || scene === 1 || scene === 5) && <div className={k.device}>
      <div className={k.deviceBar}><span><Castle size={16} /> CASTLE CRAFT</span><span>{scene === 1 ? "Pretend pop-up" : "Rohan’s world"}</span></div>
      <div className={`${k.deviceArt} ${r.sky}`}>
        <CastleScene built={scene === 0 ? cue : undefined} flag={scene === 5} dim={scene === 1} hotbar={scene === 0} />
        {scene === 0 && <div className={k.badge}><Castle /> 4 towers · 1 bridge · 1 gate</div>}
        {scene === 1 && <div className={r.overlay}><div className={r.popup} data-flash={!reduced}><PopUp left={left} field={cue(.5)} /></div></div>}
        {scene === 5 && <div className={k.success}><ShieldCheck /><strong>Castle finished!</strong><span>Pop-up in the trash · Mum’s number stayed private</span></div>}
      </div>
      <div className={k.deviceFoot}>{scene === 0
        ? <><Flag /><span>One piece left: <b>the flag</b></span><small>Pretend game · example only</small></>
        : scene === 1 ? <><TriangleAlert /><span>A flashing window covers the castle.</span><small>Rohan hasn’t tapped anything</small></>
          : <><UserRound /><span>Dad: “Proud of you for asking!”</span><small>Ready for the next build</small></>}</div>
    </div>}

    {scene === 2 && <div className={k.panel}>
      <div className={r.talk}>
        <p data-who="dad" {...on(.2)}><b>Dad</b>Did you enter a contest?</p>
        <p data-who="rohan" {...on(.3)}><b>R</b>No.</p>
        <p data-who="dad" {...on(.38)}><b>Dad</b>Then it’s not a real prize.</p>
      </div>
      <h2>Three clues it’s a trick</h2>
      {clues.map(({ Icon, text, at }) => <div className={k.step} key={text} data-active={cue(at)}><span><Icon /></span>{text}</div>)}
    </div>}

    {scene === 3 && <TrashTask solved={solved} markSolved={markSolved} hint={hint} setHint={setHint} reduced={reduced} />}

    {scene === 4 && <div className={k.panel}>
      <h2>Ad or trick?</h2>
      <div className={r.compare}>
        <div className={r.mini} data-kind="ad" {...on(.2)}>
          <header><Megaphone aria-hidden="true" />AD</header>
          <div><span><ShoppingBag aria-hidden="true" /></span><p><strong>New castle skins!</strong><em>Shop now</em></p></div>
          <footer>An ad wants you to buy things.</footer>
        </div>
        <div className={r.mini} data-kind="trick" {...on(.34)}>
          <header><Sparkles aria-hidden="true" />SURPRISE PRIZE!</header>
          <div><span><Tablet aria-hidden="true" /></span><p><strong>You won a free tablet!</strong><em>CLAIM</em></p></div>
          <footer>A trick says you won a prize you never entered.</footer>
        </div>
      </div>
      <div className={r.rule}>
        <span>Dad’s rule for every pop-up</span>
        <div className={k.step} data-active={cue(.46)}><span><CircleSlash /></span>A prize you never entered is a trick</div>
        <div className={k.step} data-active={cue(.72)}><span><PhoneOff /></span>Never type a phone number or code</div>
        <div className={k.step} data-active={cue(.86)}><span><UserRound /></span>Close it and tell a grown-up</div>
      </div>
    </div>}
  </SceneSwap>;
}

const chapter: StoryChapter = {
  script,
  title: "Rohan’s surprise pop-up",
  icon: Castle,
  character: { asset: "boy-emotions", name: "Rohan" },
  interactionScene: 3,
  beginLabel: "Practise with Rohan",
  waitingText: "Story paused. Put the pop-up in the trash to see what happens next.",
  lockedHint: "Help Rohan put the pop-up in the trash first.",
  World,
};
export default chapter;
