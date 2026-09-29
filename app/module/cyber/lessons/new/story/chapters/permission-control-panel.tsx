"use client";

import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, BatteryMedium, BookUser, Camera, Check, ChevronRight, CircleHelp, Cloud, CloudRain, Droplet, Flashlight, FlashlightOff, Lamp, LightbulbOff, Map as MapIcon, MapPin, Mic, Pencil, Settings, Signal, Sun, UsersRound, Video, Waves, WifiOff, ZapOff } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { SceneSwap } from "../StoryPlayer";
import type { StoryChapter, StoryWorldProps } from "../types";
import script from "./permission-control-panel.json";
import k from "../story-player.module.css";
import c from "./permission-control-panel.module.css";

const perms = [
  { id: "contacts", name: "Contacts", icon: BookUser, what: "Names and numbers of people you know", why: "a torch never needs the names and numbers of your friends and family." },
  { id: "location", name: "Location", icon: MapPin, what: "Where this phone is", why: "light works the same wherever you are." },
  { id: "camera", name: "Camera", icon: Camera, what: "Take photos and record video", why: "the light sits next to the camera, but shining it doesn’t need camera access." },
  { id: "microphone", name: "Microphone", icon: Mic, what: "Record sounds and voices", why: "a torch has nothing to listen to." },
];
const cycle = [
  { icon: Sun, label: "Evaporation", kind: "sun" },
  { icon: Cloud, label: "Condensation", kind: "cloud" },
  { icon: CloudRain, label: "Precipitation", kind: "rain" },
  { icon: Waves, label: "Collection", kind: "sea" },
];
const apps = [
  { icon: Flashlight, name: "Bright Beam", job: "Shine a light", needs: [] as string[], tone: "torch" },
  { icon: MapIcon, name: "City Map", job: "Show where you are", needs: ["Location"], note: "only while using the app", tone: "map" },
  { icon: Video, name: "Class Video", job: "Video calls with your class", needs: ["Camera", "Microphone"], tone: "video" },
];
const list = (names: string[]) => names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names.at(-1)}` : names[0];

function Phone({ children, label }: { children: ReactNode; label: string }) {
  return <div className={c.phone} role="group" aria-label={label}>
    <div className={c.status}><span>7:42</span><span aria-hidden="true"><Signal /><WifiOff /><BatteryMedium /></span></div>
    <div className={c.screen}>{children}</div>
  </div>;
}

function AppIcon({ small }: { small?: boolean }) {
  return <span className={c.appIcon} data-small={small} aria-hidden="true"><Flashlight /></span>;
}

function Poster({ labels, done, nudge }: { labels: boolean; done: boolean; nudge?: boolean }) {
  const node = (i: number) => { const { icon: Icon, label, kind } = cycle[i]; return <div className={c.node} data-kind={kind}><span><Icon aria-hidden="true" /></span>{labels ? <b className={k.fitIn}>{label}</b> : <i aria-hidden="true" />}</div>; };
  return <figure className={c.poster} data-glow={done} aria-label={`Tara’s water cycle poster${done ? ", finished" : ", one arrow still to draw"}`}>
    {done ? <span className={c.stamp}><Check aria-hidden="true" />Done!</span> : <span className={c.sticky}>Due tomorrow!</span>}
    <figcaption>The Water Cycle<small>by Tara · Class 5</small></figcaption>
    <div className={c.cycle}>
      {node(0)}<ArrowRight className={c.arrow} aria-hidden="true" />{node(1)}
      {done ? <ArrowUp className={`${c.arrow} ${k.fitIn}`} aria-hidden="true" /> : <span className={c.missing} data-nudge={nudge}><Pencil aria-hidden="true" />1 arrow left</span>}
      <Droplet className={c.drop} aria-hidden="true" />
      <ArrowDown className={c.arrow} aria-hidden="true" />
      {node(3)}<ArrowLeft className={c.arrow} aria-hidden="true" />{node(2)}
    </div>
  </figure>;
}

/** The torch app's permission request. Static in scene 2; in scene 3 (the task) rows are switches. */
function Sheet({ allowed, toggle, allowAll, save, nudge }: { allowed: string[]; toggle?: (id: string) => void; allowAll?: () => void; save?: () => void; nudge?: boolean }) {
  const live = Boolean(toggle);
  return <div className={c.sheet}>
    <div className={c.sheetHead}><AppIcon small /><div><strong>Bright Beam wants access</strong><span>To turn on the light, allow:</span></div></div>
    {perms.map(({ id, name, icon: Icon, what }) => {
      const on = allowed.includes(id);
      const body = <><span className={c.permIcon}><Icon aria-hidden="true" /></span><span className={c.permText}><strong>{name}</strong><small>{what}</small></span><span className={c.permState}>{on ? "On" : "Off"}<i className={c.switch} data-on={on} aria-hidden="true" /></span></>;
      return live
        ? <button key={id} className={c.perm} role="switch" aria-checked={on} onClick={() => toggle?.(id)} type="button">{body}</button>
        : <div key={id} className={c.perm}>{body}</div>;
    })}
    {live
      ? <><button className={c.allowAll} data-trap="true" onClick={allowAll} type="button">Allow all</button><button className={c.choices} onClick={save} type="button">Save my choices</button></>
      : <><span className={c.allowAll} data-nudge={nudge}>Allow all</span><span className={c.choices}>Choose permissions</span></>}
  </div>;
}

function World({ scene, playing, elapsed, solved, markSolved, hint, setHint, reduced }: StoryWorldProps) {
  const [allowed, setAllowed] = useState(perms.map(p => p.id));
  // Reveal an item once the narration reaches that fraction of the scene; everything shows while paused.
  const at = (fraction: number) => !playing || elapsed >= script.scenes[scene].duration * fraction;

  function toggle(id: string) {
    if (solved) return;
    const perm = perms.find(p => p.id === id)!;
    const on = allowed.includes(id);
    const next = on ? allowed.filter(x => x !== id) : [...allowed, id];
    setAllowed(next);
    setHint(on ? `${perm.name} off: ${perm.why}${next.length ? "" : " All four are off. Save your choices!"}` : `${perm.name} is back on. Does a torch really need it?`);
  }
  function allowAll() {
    if (solved) return;
    setAllowed(perms.map(p => p.id));
    setHint("Allow all would give a torch your contacts, location, camera and microphone. It only needs to shine, so switch off what it doesn’t need.", false);
  }
  function save() {
    if (solved) return;
    const left = perms.filter(p => allowed.includes(p.id));
    if (left.length) { setHint(`${list(left.map(p => p.name))} ${left.length > 1 ? "are" : "is"} still on. Remember: ${left[0].why}`, false); return; }
    markSolved();
  }

  return <SceneSwap scene={scene} reduced={reduced}>
    {scene === 0 && <div className={c.stack}>
      <Poster labels={at(.47)} done={false} nudge={at(.68)} />
      <div className={c.tray}>
        <span><Lamp aria-hidden="true" />Desk lamp on</span>
        <span data-show={at(.47)}><UsersRound aria-hidden="true" />Labels by Meera</span>
        <span data-show={at(.68)}><Pencil aria-hidden="true" />1 arrow to draw</span>
      </div>
    </div>}

    {scene === 1 && <div className={c.duo}>
      <Phone label="Tara’s homework phone (pretend)">
        {at(.47)
          ? <><div className={c.splash}><FlashlightOff aria-hidden="true" /><strong>Bright Beam</strong><span>Light is off</span></div><Sheet allowed={perms.map(p => p.id)} nudge={at(.8)} /></>
          : <div className={c.store}>
            <span className={c.storeTop}>App shop · Pretend</span>
            <div className={c.listing}><AppIcon /><div><strong>Bright Beam</strong><span>Torch &amp; flashlight</span><span>Free · Example app</span></div></div>
            <div className={c.install} data-done={at(.3)}><span>{at(.3) ? "Open" : "Installing…"}</span><i /></div>
            <p>A bright light for dark rooms.</p>
          </div>}
      </Phone>
      <div className={c.outage}>
        <span className={c.outageIcon}><ZapOff aria-hidden="true" /></span>
        <strong>Power cut</strong>
        <span>7:40 PM · The whole flat is dark</span>
        <ul>
          <li><LightbulbOff aria-hidden="true" />Desk lamp: off</li>
          <li><WifiOff aria-hidden="true" />Home wifi: off</li>
          <li><Pencil aria-hidden="true" />Poster: 1 arrow left</li>
          <li data-show={at(.6)}><Flashlight aria-hidden="true" />Torch app wants 4 permissions</li>
        </ul>
      </div>
    </div>}

    {scene === 2 && <div className={`${k.panel} ${c.reveal}`}>
      <div className={c.meera}><span aria-hidden="true">M</span><p><b>Meera</b>“What does a torch need to do its job?”</p></div>
      <h2>Each request is a permission</h2>
      {perms.map(({ id, name, icon: Icon, what }, i) => <div key={id} className={`${k.step} ${c.need}`} data-active={at([.39, .61, .71, .74][i])}>
        <span><Icon aria-hidden="true" /></span>
        <div><strong>{name}</strong><small>{what}</small></div>
        <em>Torch needs it? <b>No</b></em>
      </div>)}
      <div className={c.verdict} data-show={at(.89)}><Flashlight aria-hidden="true" />A torch needs: <b>just light</b></div>
    </div>}

    {scene === 3 && <div className={c.duo}>
      <Phone label="Bright Beam permission request (pretend)">
        {solved
          ? <div className={c.torchOn}><span className={c.beam}><Flashlight aria-hidden="true" /></span><strong>Torch on</strong><span>0 of 4 permissions allowed</span>
            <ul>{perms.map(({ id, name, icon: Icon }) => <li key={id}><Icon aria-hidden="true" />{name}<b>Off</b></li>)}</ul></div>
          : <><div className={c.splash}><FlashlightOff aria-hidden="true" /><strong>Bright Beam</strong><span>Light is off</span></div><Sheet allowed={allowed} toggle={toggle} allowAll={allowAll} save={save} /></>}
      </Phone>
      <div className={`${k.panel} ${c.taskCard}`}>
        <div className={c.meera}><span aria-hidden="true">M</span><p><b>Meera</b>“Ask: does a torch need this to shine?”</p></div>
        <h2>{solved ? "The torch works!" : "Help Tara set the torch’s access"}</h2>
        <div className={c.count} aria-label={`${allowed.length} of 4 permissions allowed`}>
          <span>Allowed</span>{perms.map(p => <i key={p.id} data-on={allowed.includes(p.id)} />)}<b>{allowed.length} of 4</b>
        </div>
        <p className={k.hint} aria-live="polite">{solved ? "Nothing allowed, and the light still shines. A torch only needs light." : hint || "Tap each switch on the phone. Each one tells you why."}</p>
        <small>Pretend app and phone. Example only.</small>
      </div>
    </div>}

    {scene === 4 && <div className={`${k.panel} ${c.reveal}`}>
      <h2>Match the access to the job</h2>
      {apps.map(({ icon: Icon, name, job, needs, note, tone }, i) => <div key={name} className={c.app} data-show={at([0, .33, .53][i])}>
        <span className={c.appTile} data-tone={tone}><Icon aria-hidden="true" /></span>
        <div><strong>{name}</strong><span>Job: {job}</span></div>
        <div className={c.needs}>{needs.length ? needs.map(n => <span key={n}>{n === "Location" ? <MapPin aria-hidden="true" /> : n === "Camera" ? <Camera aria-hidden="true" /> : <Mic aria-hidden="true" />}{n}{note && <small>{note}</small>}</span>) : <span data-none="true"><Check aria-hidden="true" />Nothing extra</span>}</div>
      </div>)}
      <div className={c.ask} data-show={at(.69)}><CircleHelp aria-hidden="true" /><div><strong>Ask: what’s this app’s job?</strong><span data-show={at(.84)}>Unsure? Check with a grown-up first.</span></div></div>
    </div>}

    {scene === 5 && <div className={c.stack}>
      <Poster labels done />
      <div className={c.settings} data-show={at(.26)}>
        <div><Settings aria-hidden="true" /><span>Settings <ChevronRight aria-hidden="true" /> Apps <ChevronRight aria-hidden="true" /> Bright Beam</span></div>
        <ul aria-label="Bright Beam permissions">{perms.map(({ id, name, icon: Icon }) => <li key={id}><Icon aria-hidden="true" />{name}<b>Off</b></li>)}</ul>
      </div>
    </div>}
  </SceneSwap>;
}

const chapter: StoryChapter = {
  script,
  title: "Tara’s power-cut torch",
  icon: Flashlight,
  character: { asset: "girl-expressions", name: "Tara" },
  interactionScene: 3,
  beginLabel: "Practise with Tara",
  waitingText: "Story paused. Set the torch’s permissions to see what happens next.",
  lockedHint: "Help Tara set the torch’s permissions first.",
  World,
};
export default chapter;
