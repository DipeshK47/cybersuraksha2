import type { Artifact } from "../../../../data/worlds/types.ts";

/**
 * What changed between two moments of a stage, in reading order.
 *
 * The stage uses this to (1) ring the parts that just changed so the learner sees cause and effect, and
 * (2) reveal those changes one after another while the narration plays, instead of all at once.
 * Keys are "<objectId>" (the whole object is new) or "<objectId>:<part>".
 */
const same = (a: unknown, b: unknown) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);

export function diffStage(prev: readonly Artifact[] | null, cur: readonly Artifact[]): string[] {
  const keys: string[] = [];
  for (const a of cur) {
    if (a.hide) continue;
    const p = prev?.find(item => item.id === a.id);
    if (!p || p.hide) { keys.push(a.id); continue; }
    const add = (part: string) => keys.push(`${a.id}:${part}`);
    if ((a.note && !same(a.note, p.note)) || (a.focus && !p.focus)) add("note");
    switch (a.k) {
      case "doc": {
        const q = p as typeof a;
        if (!same(a.title, q.title) || a.look !== q.look) add("head");
        for (const tok of a.toks) if (a.mark?.[tok.id] !== q.mark?.[tok.id]) add(tok.id);
        if (!same(a.stamp, q.stamp)) add("stamp");
        break;
      }
      case "chat": {
        const q = p as typeof a;
        const now = a.msgs.slice(0, a.upTo ?? a.msgs.length), before = q.msgs.slice(0, q.upTo ?? q.msgs.length);
        now.forEach((m, i) => { if (!same(m, before[i])) add(`m${i}`); });
        break;
      }
      case "screen": {
        const q = p as typeof a;
        const now = a.blocks.slice(0, a.upTo ?? a.blocks.length), before = q.blocks.slice(0, q.upTo ?? q.blocks.length);
        if (!same(a.url, q.url)) add("url");
        for (const b of now) { const old = before.find(x => x.id === b.id); if (!old || a.mark?.[b.id] !== q.mark?.[b.id] || !same(b, old)) add(b.id); }
        break;
      }
      case "sw": {
        const q = p as typeof a;
        for (const r of a.rows) if ((a.on?.[r.id] ?? r.on) !== (q.on?.[r.id] ?? r.on)) add(r.id);
        if (!same(a.meter, q.meter)) add("meter");
        break;
      }
      case "flow": {
        const q = p as typeof a;
        for (const n of a.nodes) if ((a.state?.[n.id] ?? "plain") !== (q.state?.[n.id] ?? "plain")) add(n.id);
        for (const l of a.links) { const key = `${l.from}>${l.to}`; if ((a.link?.[key] ?? "on") !== (q.link?.[key] ?? "on")) add(key); }
        if (a.cur !== q.cur) add("cur");
        break;
      }
      case "table": {
        const q = p as typeof a;
        const now = a.rows.slice(0, a.upTo ?? a.rows.length), before = q.rows.slice(0, q.upTo ?? q.rows.length);
        for (const r of now) {
          const old = before.find(x => x.id === r.id);
          const cells = r.c.map((_, i) => `${r.id}:${i}`);
          const diff = !old || a.mark?.[r.id] !== q.mark?.[r.id] || cells.some(c => a.cell?.[c] !== q.cell?.[c] || !same(a.txt?.[c], q.txt?.[c]));
          if (diff) add(r.id);
        }
        break;
      }
      case "chart": {
        const q = p as typeof a;
        for (const b of a.bars ?? []) { const old = q.bars?.find(x => x.id === b.id); if (!old || old.v !== b.v || old.tone !== b.tone) add(b.id); }
        (a.pts ?? []).forEach((pt, i) => { if (!same(pt, q.pts?.[i])) add(`p${i}`); });
        (a.parts ?? []).forEach((pt, i) => { if (!same(pt, q.parts?.[i])) add(`s${i}`); });
        (a.cells ?? []).forEach((n, i) => { if (n !== q.cells?.[i]) add(`x${i}`); });
        if (a.cut !== q.cut) add("cut");
        if (!same(a.ref, q.ref)) add("ref");
        if (!same(a.line, q.line)) add("line");
        break;
      }
      case "grid": {
        const q = p as typeof a;
        for (let i = 0; i < a.w * a.h; i++) {
          const here = [a.path?.includes(i), a.on?.includes(i), a.me === i, a.goal === i, a.walls?.includes(i), a.cells?.[i]];
          const was = [q.path?.includes(i), q.on?.includes(i), q.me === i, q.goal === i, q.walls?.includes(i), q.cells?.[i]];
          if (!same(here, was)) add(`c${i}`);
        }
        if (!same(a.win, q.win)) add("win");
        break;
      }
      case "crowd": {
        const q = p as typeof a;
        for (const r of a.rings) if (a.on.includes(r.id) !== q.on.includes(r.id)) add(r.id);
        break;
      }
      case "ledger": {
        const q = p as typeof a;
        const now = a.lines.slice(0, a.upTo ?? a.lines.length), before = q.lines.slice(0, q.upTo ?? q.lines.length);
        for (const l of now) { const old = before.find(x => x.id === l.id); if (!old || a.mark?.[l.id] !== q.mark?.[l.id]) add(l.id); }
        if (!same(a.total, q.total)) add("total");
        break;
      }
      case "time": {
        const q = p as typeof a;
        const now = a.ev.slice(0, a.upTo ?? a.ev.length), before = q.ev.slice(0, q.upTo ?? q.ev.length);
        for (const e of now) { const old = before.find(x => x.id === e.id); if (!old || a.mark?.[e.id] !== q.mark?.[e.id]) add(e.id); }
        break;
      }
      case "seq": {
        const q = p as typeof a;
        a.tiles.forEach((tile, i) => { if (!same(tile, q.tiles[i]) || a.mark?.[i] !== q.mark?.[i] || a.blank?.includes(i) !== q.blank?.includes(i)) add(`t${i}`); });
        if (!same(a.rule, q.rule)) add("rule");
        break;
      }
    }
  }
  return keys;
}

/** Split a long note into a short headline and the detail, so it can be scanned. */
export function splitNote(text: string): [string, string] {
  if (text.length <= 56) return [text, ""];
  const m = /^([\s\S]{16,96}?)(?:([.।?!])\s+|\s[—–]\s)([\s\S]+)$/.exec(text);
  if (!m) return [text, ""];
  return [m[1] + (m[2] ?? ""), m[3]];
}
