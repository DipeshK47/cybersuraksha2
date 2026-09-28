"use client";

import { BatteryMedium, Camera, Check, CircleCheck, ClipboardList, Contact, Flame, Flashlight, FlashlightOff, Map as MapIcon, MapPin, Mic, Moon, Paintbrush, Settings, ShieldAlert, ShieldCheck, Signal, Sparkles, Star, Video, ZapOff } from "lucide-react";
import { useState } from "react";
import { SceneSwap } from "../StoryPlayer";
import type { StoryChapter, StoryWorldProps } from "../types";
import script from "./permission-control-panel.json";
import k from "../story-player.module.css";
import r from "./permission-control-panel.module.css";

const perms = [
  { id: "Contacts", Icon: Contact, what: "Other people’s names and numbers", why: "A torch doesn’t need anyone’s phone numbers." },
  { id: "Location", Icon: MapPin, what: "Where you are, even your home", why: "A torch shines the same wherever you are." },
  { id: "Camera", Icon: Camera, what: "Photos and videos", why: "A torch only switches on a light. It doesn’t take photos." },
  { id: "Microphone", Icon: Mic, what: "Voices and sounds nearby", why: "A torch doesn’t need to hear anything." },
];
// A hanging school model: colour, size (px) and string length (px) per planet. Saturn (index 5) gets rings.
const planets = [
  { name: "Mercury", color: "#b9aa9c", size: 9, len: 46 },
  { name: "Venus", color: "#e7b766", size: 13, len: 70 },
  { name: "Earth", color: "#3f8fd8", size: 14, len: 38 },
  { name: "Mars", color: "#d0603f", size: 11, len: 82 },
  { name: "Jupiter", color: "#d49a5f", size: 30, len: 50 },
  { name: "Saturn", color: "#e9cf8a", size: 22, len: 88 },
  { name: "Uranus", color: "#8fd3dd", size: 16, len: 44 },
  { name: "Neptune", color: "#4d6fd6", size: 16, len: 74 },
];
const apps = [
  { name: "Pocket Torch", job: "make light", Icon: Flashlight, needs: [], at: .02 },
  { name: "City Map", job: "show where you are", Icon: MapIcon, needs: [{ label: "Location · while using", Icon: MapPin }], at: .28 },
  { name: "Class Video", job: "video calls with your class", Icon: Video, needs: [{ label: "Camera", Icon: Camera }, { label: "Microphone", Icon: Mic }], at: .55 },
];

function Model({ painted }: { painted: boolean }) {
  return <div className={r.model} aria-hidden="true">
    <span className={r.sun} />
    <span className={r.rod} />
    <div className={r.row}>{planets.map((p, i) => <span className={r.hang} key={p.name}>
      <span className={r.string} style={{ height: p.len }} />
      <span className={r.planet} data-saturn={i === 5} data-painted={i !== 5 || painted} style={{ width: p.size, height: p.size, background: i !== 5 || painted ? p.color : undefined }} />
    </span>)}</div>
  </div>;
}

function World({ scene, playing, elapsed, solved, markSolved, hint, setHint, reduced }: StoryWorldProps) {
  const [on, setOn] = useState([true, true, true, true]);
  const [lit, setLit] = useState(false);
  const done = solved || lit;
  const switches = solved ? [false, false, false, false] : on;
  // Reveal an item once narration reaches that fraction of the scene (everything shows while paused).
  const cue = (at: number) => !playing || elapsed > script.scenes[scene].duration * at;
  const show = (at: number) => ({ "data-on": cue(at), "aria-hidden": !cue(at) });

  function toggle(i: number) {
    if (done) return;
    setOn(value => value.map((v, j) => j === i ? !v : v));
    setHint(on[i] ? `${perms[i].id} off. ${perms[i].why}` : `${perms[i].id} is on again. Does a torch really need it?`);
  }
  function allowAll() {
    if (done) return;
    setOn([true, true, true, true]);
    setHint("Allow all would hand a torch your contacts, location, camera and microphone. Its job is only to make light, so it needs none of them.");
  }
  function submit() {
    if (done) return;
    const still = perms.find((_, i) => on[i]);
    if (still) { setHint(`${still.id} is still on. ${still.why} Switch it off first.`); return; }
    setLit(true);
    setHint("The torch works with zero permissions. Its job never needed them.");
    window.setTimeout(markSolved, reduced ? 0 : 700);
  }

  const count = switches.filter(Boolean).length;
  return <SceneSwap scene={scene} reduced={reduced}>
    {(scene === 0 || scene === 5) && <div className={k.device}>
      <div className={k.deviceBar}><span><ClipboardList size={16} /> PROJECT PLANNER</span><span>{scene === 0 ? "Due tomorrow · 9:00 am" : "Ready on time"}</span></div>
      <div className={`${k.deviceArt} ${r.desk}`} data-lit={scene === 5}>
        <Model painted={scene === 5} />
        {scene === 0 && <><div className={k.badge}><Paintbrush /> 7 of 8 planets painted</div><span className={r.todo} {...show(.3)}>Saturn · not painted yet</span></>}
        {scene === 5 && <><span className={r.beam} aria-hidden="true" /><div className={k.success}><CircleCheck /><strong>Project ready!</strong><span>Saturn painted by torchlight</span></div></>}
      </div>
      <div className={k.deviceFoot}>{scene === 0
        ? <><span className={r.chip} data-done="true"><Check aria-hidden="true" />Label planets</span><span className={r.chip} data-done="true"><Check aria-hidden="true" />Paint 7 planets</span><span className={r.chip}><Paintbrush aria-hidden="true" />Paint Saturn’s rings</span><small>8:00 pm</small></>
        : <><span className={r.chip} data-done="true"><Flashlight aria-hidden="true" />Pocket Torch · 0 permissions</span><span className={r.chip} data-done="true"><ShieldCheck aria-hidden="true" />Contacts private</span><span className={r.chip} data-done="true"><ShieldCheck aria-hidden="true" />Location private</span></>}</div>
    </div>}

    {scene === 1 && <div className={r.room}>
      <div className={r.roomTop}><ZapOff aria-hidden="true" /><strong>Power cut</strong><span>Whole street dark · 8:04 pm</span></div>
      <div className={r.roomBody}>
        <div className={r.window} aria-hidden="true"><Moon /><Star data-i="1" /><Star data-i="2" /><Star data-i="3" /></div>
        <div className={r.phone}>
          <div className={r.status}><span>8:05</span><span><Signal aria-hidden="true" /><BatteryMedium aria-hidden="true" /></span></div>
          <div className={r.store} {...show(.25)}><span className={r.appIcon}><Flashlight aria-hidden="true" /></span><div><strong>Pocket Torch</strong><small>Tools · Free · pretend app</small></div><b>Installed</b></div>
          <div className={r.sheet} {...show(.45)}>
            <span className={r.sheetIcon}><FlashlightOff aria-hidden="true" /></span>
            <strong>Allow Pocket Torch to access:</strong>
            <ul>{perms.map(({ id, Icon }, i) => <li key={id} {...show(.5 + i * .05)}><Icon aria-hidden="true" />{id}</li>)}</ul>
            <div className={r.sheetButtons}><span className={r.allowAll} {...show(.72)}>Allow all</span><span>Choose</span></div>
            <small>The light stays off until you choose.</small>
          </div>
        </div>
        <p className={r.thought} {...show(.86)}>A torch needs… my contacts?</p>
      </div>
    </div>}

    {scene === 2 && <div className={k.panel}>
      <div className={r.cousin}><span className={r.avatar}><Flame aria-hidden="true" /></span><div><small>Cousin Ishaan</small><p>“Ask what the app needs for its job.”</p></div></div>
      <h2>Each permission is a key</h2>
      <div className={r.keys}>{perms.map(({ id, Icon, what }, i) => <div className={r.keyRow} key={id} {...show([.48, .6, .66, .7][i])}>
        <span className={r.keyIcon}><Icon aria-hidden="true" /></span><div><strong>{id}</strong><span>{what}</span></div><em {...show(.8)}>Not for a torch</em>
      </div>)}</div>
      <div className={r.job} {...show(.85)}><Flashlight aria-hidden="true" /><span>A torch’s job: <b>make light</b>. It needs none of these keys.</span></div>
    </div>}

    {scene === 3 && <div className={`${k.panel} ${r.task}`}>
      <h2>Set Pocket Torch’s permissions</h2>
      <p>Switch off anything a torch doesn’t need, then continue.</p>
      <div className={r.setup}>
        <div className={r.setupHead}><span className={r.torch} data-lit={done}>{done ? <Flashlight aria-hidden="true" /> : <FlashlightOff aria-hidden="true" />}</span><div><strong>Pocket Torch · setup</strong><small>Its job: make light</small></div><span className={r.count} data-zero={count === 0}>{done ? "Torch on" : `${count} of 4 on`}</span></div>
        {perms.map(({ id, Icon, what }, i) => <button className={r.switchRow} key={id} type="button" role="switch" aria-checked={switches[i]} aria-label={`${id} access`} disabled={done} onClick={() => toggle(i)}>
          <Icon aria-hidden="true" /><span><strong>{id}</strong><small>{what}</small></span><span className={r.toggle} aria-hidden="true" />
        </button>)}
      </div>
      <p className={k.hint} aria-live="polite">{hint || (done ? "The torch works with zero permissions. Its job never needed them." : "Tip: tap a switch to turn that permission off.")}</p>
      <div className={k.actions}>
        <button className={r.trap} data-trap="true" type="button" onClick={allowAll} disabled={done}><ShieldAlert />Allow all</button>
        <button className={k.primary} type="button" onClick={submit} disabled={done}><Check />Continue with my choices</button>
      </div>
      <small>Pretend app. Example only.</small>
    </div>}

    {scene === 4 && <div className={k.panel}>
      <h2>The right access for each job</h2>
      <div className={r.apps}>{apps.map(({ name, job, Icon, needs, at }) => <div className={r.appRow} key={name} {...show(at)}>
        <span className={r.appBadge}><Icon aria-hidden="true" /></span><div><strong>{name}</strong><small>Job: {job}</small></div>
        <span className={r.needs}>{needs.length ? needs.map(({ label, Icon: NeedIcon }) => <b key={label}><NeedIcon aria-hidden="true" />{label}</b>) : <b data-none="true"><Sparkles aria-hidden="true" />No permissions</b>}</span>
      </div>)}</div>
      <div className={r.settings} {...show(.74)}><Settings aria-hidden="true" /><div><strong>Settings › Apps › Permissions</strong><span>Check and change them any time, with a grown-up. If an app won’t work without access it doesn’t need, pick a different app.</span></div></div>
      <small>Pretend apps. Menus look different on each phone.</small>
    </div>}
  </SceneSwap>;
}

const chapter: StoryChapter = {
  script,
  title: "Tara’s torch in the power cut",
  icon: Flashlight,
  character: { asset: "girl-expressions", name: "Tara" },
  interactionScene: 3,
  beginLabel: "Practise with Tara",
  waitingText: "Story paused. Switch off what the torch doesn’t need, then continue.",
  lockedHint: "Help Tara set the torch app’s permissions first.",
  World,
};
export default chapter;
