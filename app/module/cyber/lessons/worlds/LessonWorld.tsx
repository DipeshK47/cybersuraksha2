"use client";

import { AlertTriangle, Check, X } from "lucide-react";
import { Fragment, createElement, useMemo, type CSSProperties, type ReactNode } from "react";
import type { Artifact, Chart, Chat, Crowd, Doc, Flow, Grid, Ledger, Screen, Seq, Switches, Table, Time, Tone, World } from "../../../../data/worlds/types.ts";
import { useEvidenceLanguage } from "../class8/ui";
import { ICONS } from "./icons";
import { pick, resolveStage } from "./resolve";
import w from "./worlds.module.css";

type Lang = "en" | "hi";
const toneClass = (tone?: string) => (tone ? ` ${w[`t_${tone}`] ?? ""}` : "");

function Ico({ name, size = 16 }: { name?: string; size?: number }) {
  if (!name || !(name in ICONS)) return null;
  return createElement(ICONS[name], { size, "aria-hidden": true });
}

/* ---------- Doc: poster, form, profile, notice, receipt ---------- */
function DocArt({ a, lang }: { a: Doc; lang: Lang }) {
  return <div className={`${w.doc} ${w[`doc_${a.look ?? "card"}`] ?? ""}`}>
    <div className={w.docHead}>
      {a.pic && <span className={w.docPic}><Ico name={a.pic} size={26} /></span>}
      <div><strong>{pick(a.title, lang)}</strong>{a.sub && <small>{pick(a.sub, lang)}</small>}</div>
    </div>
    <ul className={w.toks}>
      {a.toks.map(tok => {
        const mark = a.mark?.[tok.id];
        return <li key={tok.id} data-mark={mark ?? "none"} className={w.tok}>
          <span className={w.tokIcon}><Ico name={tok.icon} size={15} /></span>
          <span className={w.tokText}>{pick(tok.t, lang)}</span>
          <span className={w.tokBadge} aria-hidden="true">{mark === "risk" ? <AlertTriangle size={14} /> : mark === "ok" ? <Check size={14} /> : mark === "hide" ? <X size={14} /> : null}</span>
        </li>;
      })}
    </ul>
    {a.stamp && <span className={w.stamp}>{pick(a.stamp, lang)}</span>}
  </div>;
}

/* ---------- Chat ---------- */
function ChatArt({ a, lang }: { a: Chat; lang: Lang }) {
  const shown = a.msgs.slice(0, a.upTo ?? a.msgs.length);
  return <div className={`${w.chat} ${w[`chat_${a.look ?? "phone"}`] ?? ""}`}>
    <div className={w.chatHead}><span className={w.avatar}>{pick(a.who, lang).replace(/^[^\p{L}\p{N}]+/u, "").slice(0, 1)}</span><strong>{pick(a.who, lang)}</strong>{a.look === "call" && <Ico name="call" />}</div>
    <div className={w.chatBody}>
      {shown.map((m, i) => <div key={`${i}-${m.t[0]}`} className={`${w.bubble} ${w[`from_${m.from}`]}${toneClass(m.flag)}`} data-flag={m.flag ?? "none"}>
        {m.sender && <b>{m.sender}</b>}{pick(m.t, lang)}
        {m.flag && m.flag !== "muted" && <i className={w.flagDot} aria-hidden="true">{m.flag === "ok" ? <Check size={12} /> : <AlertTriangle size={12} />}</i>}
      </div>)}
      {a.typing && <div className={`${w.bubble} ${w.from_them} ${w.typing}`}><span /><span /><span /></div>}
    </div>
  </div>;
}

/* ---------- Screen ---------- */
function qrCells(seed: string) {
  let h = 2166136261;
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return Array.from({ length: 49 }, (_, i) => { h = Math.imul(h ^ (h >>> 13), 1274126177) + i; const x = i % 7, y = Math.floor(i / 7); return (x < 2 && y < 2) || (x > 4 && y < 2) || (x < 2 && y > 4) || (h & 4) > 0; });
}
function ScreenArt({ a, lang }: { a: Screen; lang: Lang }) {
  const blocks = a.blocks.slice(0, a.upTo ?? a.blocks.length);
  return <div className={`${w.screen} ${w[`screen_${a.look ?? "phone"}`] ?? ""}`}>
    {a.look !== "phone" && <div className={w.chrome}><i /><i /><i /></div>}
    {a.url && <div className={w.urlbar} data-lock={a.lock ?? "none"}><span className={w.lock}>{a.lock === "bad" ? <AlertTriangle size={13} /> : <Ico name="lock" size={13} />}</span>
      <span className={w.urlText}>{a.url.map((p, i) => <span key={i} className={`${w.urlPart}${toneClass(p.mark)}`} data-mark={p.mark ?? "none"}>{p.t}</span>)}</span></div>}
    <div className={w.blocks}>
      {blocks.map(b => {
        const mark = a.mark?.[b.id];
        const common = { "data-mark": mark ?? "none", "data-type": b.type } as const;
        if (b.type === "qr") return <div key={b.id} {...common} className={`${w.block} ${w.qrBlock}`}><div className={w.qr}>{qrCells(b.id + b.t[0]).map((on, i) => <u key={i} data-on={on} />)}</div><span>{pick(b.t, lang)}</span></div>;
        if (b.type === "price") return <div key={b.id} {...common} className={`${w.block} ${w.priceBlock}`}><small>{pick(b.t, lang)}</small><strong>{pick(b.sub, lang)}</strong></div>;
        if (b.type === "btn") return <div key={b.id} {...common} className={`${w.block} ${w.btnBlock}`}><span><Ico name={b.icon} size={15} />{pick(b.t, lang)}</span></div>;
        if (b.type === "field") return <div key={b.id} {...common} className={`${w.block} ${w.fieldBlock}`}><small>{pick(b.t, lang)}</small><span>{pick(b.sub, lang) || "…"}</span></div>;
        if (b.type === "popup") return <div key={b.id} {...common} className={`${w.block} ${w.popupBlock}`}><X size={14} className={w.popupX} aria-hidden="true" /><strong><Ico name={b.icon ?? "alert"} size={17} />{pick(b.t, lang)}</strong>{b.sub && <p>{pick(b.sub, lang)}</p>}</div>;
        if (b.type === "banner") return <div key={b.id} {...common} className={`${w.block} ${w.bannerBlock}`}><Ico name={b.icon} size={16} /><span>{pick(b.t, lang)}{b.sub && <em>{pick(b.sub, lang)}</em>}</span></div>;
        if (b.type === "app") return <div key={b.id} {...common} className={`${w.block} ${w.appBlock}`}><span className={w.appTile}><Ico name={b.icon} size={22} /></span><span>{pick(b.t, lang)}</span></div>;
        if (b.type === "row") return <div key={b.id} {...common} className={`${w.block} ${w.rowBlock}`}><Ico name={b.icon} size={16} /><span><strong>{pick(b.t, lang)}</strong>{b.sub && <small>{pick(b.sub, lang)}</small>}</span></div>;
        if (b.type === "bar") return <div key={b.id} {...common} className={`${w.block} ${w.barBlock}`}><small>{pick(b.t, lang)}</small><i><b style={{ width: `${Number.parseInt(String(b.sub?.[0] ?? "50"), 10) || 50}%` }} /></i></div>;
        return <div key={b.id} {...common} className={`${w.block} ${w.textBlock}`}>{pick(b.t, lang)}</div>;
      })}
    </div>
  </div>;
}

/* ---------- Switches ---------- */
function SwitchArt({ a, lang }: { a: Switches; lang: Lang }) {
  return <div className={w.switches}>
    {a.rows.map(r => {
      const on = a.on?.[r.id] ?? r.on;
      return <div key={r.id} className={w.swRow} data-on={on}><span className={w.swIcon}><Ico name={r.icon} size={17} /></span>
        <span className={w.swText}><strong>{pick(r.t, lang)}</strong>{r.sub && <small>{pick(r.sub, lang)}</small>}</span>
        <span className={w.toggle} aria-hidden="true"><i /></span></div>;
    })}
    {a.meter && <div className={`${w.meter}${toneClass(a.meter.tone)}`}><div className={w.meterTop}><span>{pick(a.meter.t, lang)}</span></div>
      <div className={w.track}><b style={{ width: `${Math.max(2, Math.min(100, a.meter.v))}%` }} /></div>
      {(a.meter.lo || a.meter.hi) && <div className={w.meterEnds}><small>{pick(a.meter.lo, lang)}</small><small>{pick(a.meter.hi, lang)}</small></div>}</div>}
  </div>;
}

/* ---------- Flow ---------- */
function FlowArt({ a, lang }: { a: Flow; lang: Lang }) {
  const at = (id: string) => a.nodes.find(n => n.id === id);
  const cur = a.cur ? at(a.cur) : undefined;
  // Nodes sit inside an inner box so a label never hangs outside the object.
  const px = (x: number) => 16 + x * 0.68, py = (y: number) => 12 + y * 0.76;
  return <div className={`${w.flow} ${w[`flow_${a.look ?? "graph"}`] ?? ""}`}>
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      {a.links.map(l => { const f = at(l.from), t = at(l.to); if (!f || !t) return null; const key = `${l.from}>${l.to}`; return <line key={key} x1={px(f.x)} y1={py(f.y)} x2={px(t.x)} y2={py(t.y)} data-link={a.link?.[key] ?? "on"} vectorEffect="non-scaling-stroke" />; })}
    </svg>
    {a.links.map(l => { const f = at(l.from), t = at(l.to); return l.t && f && t ? <span key={`${l.from}>${l.to}t`} className={w.linkLabel} style={{ left: `${(px(f.x) + px(t.x)) / 2}%`, top: `${(py(f.y) + py(t.y)) / 2}%` }}>{pick(l.t, lang)}</span> : null; })}
    {a.nodes.map(n => <div key={n.id} className={w.node} data-state={a.state?.[n.id] ?? "plain"} style={{ left: `${px(n.x)}%`, top: `${py(n.y)}%` }}>
      <span className={w.nodeIcon}><Ico name={n.icon} size={17} /></span><b>{pick(n.t, lang)}</b>{n.sub && <small>{n.sub}</small>}</div>)}
    {cur && <span className={w.cursor} style={{ left: `${px(cur.x)}%`, top: `${py(cur.y)}%` }} aria-hidden="true" />}
  </div>;
}

/* ---------- Table ---------- */
function TableArt({ a, lang }: { a: Table; lang: Lang }) {
  const rows = a.rows.slice(0, a.upTo ?? a.rows.length);
  return <div className={w.tableWrap}><table className={w.table}>
    <thead><tr>{a.cols.map((c, i) => <th key={i}>{pick(c, lang)}</th>)}</tr></thead>
    <tbody>{rows.map(r => <tr key={r.id} data-mark={a.mark?.[r.id] ?? "none"}>{r.c.map((cell, i) => <td key={i} data-cell={a.cell?.[`${r.id}:${i}`] ?? "none"}>{pick(a.txt?.[`${r.id}:${i}`] ?? cell, lang)}</td>)}</tr>)}</tbody>
  </table>{a.foot && <p className={w.tableFoot}>{pick(a.foot, lang)}</p>}</div>;
}

/* ---------- Chart ---------- */
function ChartArt({ a, lang }: { a: Chart; lang: Lang }) {
  const max = a.max ?? Math.max(1, ...(a.bars ?? []).map(b => b.v));
  if (a.look === "bars") return <div className={w.bars}>
    {a.ref && <span className={w.refLine} style={{ bottom: `${(a.ref.v / max) * 100}%` }}><em>{pick(a.ref.t, lang)}</em></span>}
    {(a.bars ?? []).map(b => <div key={b.id} className={`${w.barCol}${toneClass(b.tone)}`}><b style={{ height: `${Math.max(2, (b.v / max) * 100)}%` }}><i>{b.v}</i></b><small>{pick(b.t, lang)}</small></div>)}
  </div>;
  if (a.look === "scatter") return <div className={w.scatter}><svg viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden="true">
    {a.cut != null && <><rect x="0" y="0" width={a.cut} height="60" className={w.zoneA} /><rect x={a.cut} y="0" width={100 - a.cut} height="60" className={w.zoneB} /><line x1={a.cut} y1="0" x2={a.cut} y2="60" className={w.cutLine} vectorEffect="non-scaling-stroke" /></>}
  </svg>
    {(a.pts ?? []).map((p, i) => <i key={i} className={w.dot} data-c={p.c ?? "a"} style={{ left: `${p.x}%`, top: `${100 - p.y}%` }}>{p.c === "q" ? "?" : p.t ?? ""}</i>)}
    {a.zones && a.cut != null && <><small className={w.zoneL} style={{ left: ".6rem" }}>{pick(a.zones[0], lang)}</small><small className={w.zoneR} style={{ left: `calc(${a.cut}% + .6rem)` }}>{pick(a.zones[1], lang)}</small></>}
    {a.axes && <><small className={w.axisX}>{pick(a.axes[0], lang)} →</small><small className={w.axisY}>{pick(a.axes[1], lang)} →</small></>}</div>;
  if (a.look === "line") {
    const v = a.line ?? [], hi = Math.max(max, ...v), step = 100 / Math.max(1, v.length - 1);
    const y = (n: number) => 52 - (n / hi) * 46;
    return <div className={w.lineChart}><svg viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden="true">
      {a.ref && <line x1="0" x2="100" y1={y(a.ref.v)} y2={y(a.ref.v)} className={w.refSvg} vectorEffect="non-scaling-stroke" />}
      <polyline points={v.map((n, i) => `${i * step},${y(n)}`).join(" ")} vectorEffect="non-scaling-stroke" /></svg>
      {v.map((n, i) => <i key={i} className={w.lpoint} data-hl={a.hl?.includes(i) ?? false} style={{ left: `${i * step}%`, top: `${(y(n) / 60) * 100}%` }} />)}
      {a.ref && <em className={w.lineRef} style={{ top: `${(y(a.ref.v) / 60) * 100}%` }}>{pick(a.ref.t, lang)}</em>}</div>;
  }
  if (a.look === "matrix") {
    const c = a.cells ?? [0, 0, 0, 0];
    return <div className={w.matrix}>{a.axes && <small className={w.mAxisTop}>{pick(a.axes[0], lang)}</small>}{a.axes && <small className={w.mAxisSide}>{pick(a.axes[1], lang)}</small>}
      <div className={w.mGrid}>{[["ok", c[0]], ["risk", c[1]], ["warn", c[2]], ["ok", c[3]]].map(([tone, n], i) => <b key={i} className={toneClass(String(tone))}>{n}</b>)}</div></div>;
  }
  const parts = a.parts ?? [], total = parts.reduce((s, p) => s + p.v, 0) || 1;
  return <div className={w.split}>{parts.map((p, i) => <div key={i} className={`${w.splitPart}${toneClass(p.tone)}`} style={{ flexGrow: p.v / total }}><b>{p.v}</b><small>{pick(p.t, lang)}</small></div>)}</div>;
}

/* ---------- Grid ---------- */
function GridArt({ a }: { a: Grid; lang: Lang }) {
  const total = a.w * a.h;
  const style = { "--cols": a.w, "--rows": a.h } as CSSProperties;
  return <div className={w.gridWrap}>
    <div className={`${w.grid} ${w[`grid_${a.look ?? "map"}`] ?? ""}`} style={style}>
      {Array.from({ length: total }, (_, i) => {
        const cell = a.cells?.[i];
        const pathIndex = a.path?.indexOf(i) ?? -1;
        return <div key={i} className={`${w.cell}${toneClass(cell?.tone)}`} data-wall={a.walls?.includes(i) ?? false} data-path={pathIndex >= 0} data-on={a.on?.includes(i) ?? false} data-goal={a.goal === i} data-me={a.me === i}>
          {cell?.icon ? <Ico name={cell.icon} size={16} /> : cell?.t}
          {a.goal === i && <Ico name="flag" size={16} />}{a.me === i && <span className={w.me} />}
        </div>;
      })}
      {a.win && <span className={w.window} style={{ left: `${(a.win.x / a.w) * 100}%`, top: `${(a.win.y / a.h) * 100}%`, width: `${(a.win.w / a.w) * 100}%`, height: `${(a.win.h / a.h) * 100}%` }} />}
    </div>
    {a.foot && <div className={w.gridFoot} style={{ "--cols": a.w } as CSSProperties}>{a.foot.map((f, i) => <small key={i}>{f}</small>)}</div>}
  </div>;
}

/* ---------- Crowd ---------- */
function CrowdArt({ a, lang }: { a: Crowd; lang: Lang }) {
  const count = a.rings.length;
  return <div className={w.crowd}>
    <div className={w.rings} aria-hidden="true">
      {[...a.rings].reverse().map((r, ri) => { const level = count - ri; return <div key={r.id} className={`${w.ring}${toneClass(a.tone)}`} data-on={a.on.includes(r.id)} style={{ "--size": `${(level / count) * 100}%` } as CSSProperties} />; })}
      <span className={w.you}><Ico name="user" size={20} /></span>
    </div>
    <ul className={w.ringList}>{a.rings.map(r => <li key={r.id} className={toneClass(a.tone).trim()} data-on={a.on.includes(r.id)}><Ico name={r.icon ?? "users"} size={15} /><span>{pick(r.t, lang)}</span><b>{r.n}</b></li>)}</ul>
  </div>;
}

/* ---------- Ledger ---------- */
function LedgerArt({ a, lang }: { a: Ledger; lang: Lang }) {
  const lines = a.lines.slice(0, a.upTo ?? a.lines.length);
  return <div className={w.ledger}>
    {lines.map(l => <div key={l.id} className={w.lLine} data-dir={l.dir} data-mark={a.mark?.[l.id] ?? "none"}>
      <span className={w.lIcon}><Ico name={l.icon ?? (l.dir === "in" ? "in" : l.dir === "out" ? "out" : "hourglass")} size={16} /></span>
      <span className={w.lText}><strong>{pick(l.t, lang)}</strong>{l.sub && <small>{pick(l.sub, lang)}</small>}</span><b>{l.amt}</b></div>)}
    {a.total && <div className={w.lTotal}><span>{pick(a.total.t, lang)}</span><b>{pick(a.total.v, lang)}</b></div>}
  </div>;
}

/* ---------- Time ---------- */
function TimeArt({ a, lang }: { a: Time; lang: Lang }) {
  const events = a.ev.slice(0, a.upTo ?? a.ev.length);
  return <ol className={w.time}>
    {events.map((e, i) => <Fragment key={e.id}><li data-mark={a.mark?.[e.id] ?? "none"}><time>{e.at}</time><span className={w.tDot}><Ico name={e.icon} size={13} /></span><span className={w.tText}><strong>{pick(e.t, lang)}</strong>{e.sub && <small>{pick(e.sub, lang)}</small>}</span></li>
      {a.now === i + 1 && <li className={w.nowLine} aria-hidden="true"><span>NOW</span></li>}</Fragment>)}
  </ol>;
}

/* ---------- Seq ---------- */
function SeqArt({ a, lang }: { a: Seq; lang: Lang }) {
  const row = (tiles: (string | readonly [string, string])[], blank: number[] | undefined, mark: Seq["mark"]) => <div className={w.seqRow}>{tiles.map((t, i) => <span key={i} className={`${w.seqTile}${toneClass(mark?.[i])}`} data-hl={mark?.[i] === "hl"} data-blank={blank?.includes(i) ?? false}>{blank?.includes(i) ? "?" : pick(t as string, lang)}</span>)}</div>;
  return <div className={w.seq}>{row(a.tiles, a.blank, a.mark)}{a.row2 && row(a.row2, undefined, undefined)}{a.rule && <p className={w.seqRule}>{pick(a.rule, lang)}</p>}</div>;
}

function Artifact({ a, lang }: { a: Artifact; lang: Lang }) {
  let body: ReactNode;
  switch (a.k) {
    case "doc": body = <DocArt a={a} lang={lang} />; break;
    case "chat": body = <ChatArt a={a} lang={lang} />; break;
    case "screen": body = <ScreenArt a={a} lang={lang} />; break;
    case "sw": body = <SwitchArt a={a} lang={lang} />; break;
    case "flow": body = <FlowArt a={a} lang={lang} />; break;
    case "table": body = <TableArt a={a} lang={lang} />; break;
    case "chart": body = <ChartArt a={a} lang={lang} />; break;
    case "grid": body = <GridArt a={a} lang={lang} />; break;
    case "crowd": body = <CrowdArt a={a} lang={lang} />; break;
    case "ledger": body = <LedgerArt a={a} lang={lang} />; break;
    case "time": body = <TimeArt a={a} lang={lang} />; break;
    case "seq": body = <SeqArt a={a} lang={lang} />; break;
  }
  const own = a.k === "doc" || a.k === "chat" || a.k === "screen";
  return <figure className={w.art} data-k={a.k} data-focus={a.focus ?? false}>
    {a.title && !own && <figcaption><Ico name={a.icon} size={15} />{pick(a.title, lang)}</figcaption>}
    {body}
    {a.note && <p className={`${w.note}${toneClass(a.noteTone)}`}>{pick(a.note, lang)}</p>}
  </figure>;
}

export type StageProps = { world: World; scene: number; preview?: string | null; strand: string; solved: boolean };

/** The lesson's live scene. */
export function LessonStage({ world, scene, preview, strand, solved }: StageProps) {
  const lang = useEvidenceLanguage();
  const art = useMemo(() => resolveStage(world, scene, preview), [world, scene, preview]);
  const visible = art.filter(a => !a.hide);
  const slots = (["a", "b", "c"] as const).map(slot => visible.filter(a => (a.at ?? "a") === slot));
  return <div className={w.stage} data-world={world.slug} data-scene={world.scene} data-layout={world.layout ?? "one"} data-count={slots.filter(items => items.length > 0).length} data-strand={strand} data-solved={solved} data-step={scene} translate="no" role="group" aria-label={pick(world.label, lang)}>
    <span className={w.stageLabel}>{pick(world.label, lang)}</span>
    <div className={w.backdrop} aria-hidden="true"><i /><i /><i /></div>
    <div className={w.slots}>{slots.map((items, i) => items.length > 0 && <div key={i} className={w.slot} data-slot={"abc"[i]}>{items.map(a => <Artifact key={a.id} a={a} lang={lang} />)}</div>)}</div>
  </div>;
}
export type { Tone };
