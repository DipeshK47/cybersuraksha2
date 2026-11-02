import assert from 'node:assert/strict';
import test from 'node:test';
import { loadSource } from './class-8-helpers.mjs';

// Every Class 6-10 lesson gets its own live stage (app/data/worlds). These checks keep each stage
// consistent with its lesson: real option ids, real object ids, six scenes, both languages.
const m = await loadSource(`
  import { class6Chapters } from './app/data/class6/index.ts';
  import { class7Chapters } from './app/data/class7/index.ts';
  import { class8Chapters } from './app/data/class8/index.ts';
  import { class9Chapters } from './app/data/class9/index.ts';
  import { class10Chapters } from './app/data/class10/index.ts';
  import { class6Worlds } from './app/data/worlds/class6.ts';
  import { class7Worlds } from './app/data/worlds/class7.ts';
  import { class8Worlds } from './app/data/worlds/class8.ts';
  import { class9Worlds } from './app/data/worlds/class9.ts';
  import { class10Worlds } from './app/data/worlds/class10.ts';
  import { resolveStage } from './app/module/cyber/lessons/worlds/resolve.ts';
  export const chapters = [...class6Chapters, ...class7Chapters, ...class8Chapters, ...class9Chapters, ...class10Chapters];
  export const worlds = { ...class6Worlds, ...class7Worlds, ...class8Worlds, ...class9Worlds, ...class10Worlds };
  import { ICONS } from './app/module/cyber/lessons/worlds/icons.ts';
  export { resolveStage, ICONS };
`);
const KINDS = ['doc', 'chat', 'screen', 'sw', 'flow', 'table', 'chart', 'grid', 'crowd', 'ledger', 'time', 'seq'];
const isT = value => Array.isArray(value) && value.length === 2 && value.every(part => typeof part === 'string');
const SKIP = new Set(['on', 'foot', 'id', 'k', 'from', 'to', 'mark', 'state', 'link', 'cur', 'at', 'slug', 'scene', 'layout', 'look', 'icon', 'pic', 'noteTone', 'tone', 'dir', 'flag', 'sender']);
const strings = (value, path, out) => {
  if (isT(value)) { out.push([path, value]); return; }
  if (Array.isArray(value)) value.forEach((v, i) => strings(v, `${path}[${i}]`, out));
  else if (value && typeof value === 'object') for (const [k, v] of Object.entries(value)) { if (SKIP.has(k)) continue; if ((k === 'c' || k === 'tiles' || k === 'row2') && Array.isArray(v)) v.forEach((cell, i) => strings(cell, `${path}.${k}[${i}]`, out)); else strings(v, `${path}.${k}`, out); }
};

test('every lesson with a stage matches its chapter', () => {
  const bySlug = new Map(m.chapters.map(chapter => [chapter.slug, chapter]));
  for (const [slug, world] of Object.entries(m.worlds)) {
    const chapter = bySlug.get(slug);
    assert.ok(chapter, `${slug}: no such lesson`);
    assert.equal(world.slug, slug);
    assert.equal(world.sc.length, 6, `${slug}: six scenes`);
    const ids = world.art.map(a => a.id);
    assert.equal(new Set(ids).size, ids.length, `${slug}: object ids are unique`);
    for (const a of world.art) assert.ok(KINDS.includes(a.k), `${slug}: kind ${a.k}`);
    const optionIds = chapter.decision.options.map(o => o.id);
    assert.deepEqual(Object.keys(world.out).sort(), [...optionIds].sort(), `${slug}: one outcome per decision option`);
    for (const [where, patches] of [...world.sc.map((p, i) => [`scene ${i}`, p]), ...Object.entries(world.out).map(([k, p]) => [`outcome ${k}`, p])]) {
      for (const id of Object.keys(patches)) assert.ok(ids.includes(id), `${slug} ${where}: unknown object ${id}`);
    }
  }
});

test('stages reference only tokens, nodes and rows that exist', () => {
  for (const [slug, world] of Object.entries(m.worlds)) {
    const steps = [...world.sc.map((_, i) => [`scene ${i}`, i, null]), ...Object.keys(world.out).map(k => [`outcome ${k}`, 3, k])];
    for (const [where, scene, preview] of steps) {
      for (const a of m.resolveStage(world, scene, preview)) {
        const here = `${slug} ${where} ${a.id}`;
        const has = (list, key) => assert.ok(list.some(x => x.id === key), `${here}: unknown id ${key}`);
        if (a.k === 'doc') Object.keys(a.mark ?? {}).forEach(k => has(a.toks, k));
        if (a.k === 'screen') Object.keys(a.mark ?? {}).forEach(k => has(a.blocks, k));
        if (a.k === 'sw') Object.keys(a.on ?? {}).forEach(k => has(a.rows, k));
        if (a.k === 'ledger') Object.keys(a.mark ?? {}).forEach(k => has(a.lines, k));
        if (a.k === 'time') Object.keys(a.mark ?? {}).forEach(k => has(a.ev, k));
        if (a.k === 'table') {
          Object.keys(a.mark ?? {}).forEach(k => has(a.rows, k));
          for (const key of [...Object.keys(a.cell ?? {}), ...Object.keys(a.txt ?? {})]) { const [row, col] = key.split(':'); has(a.rows, row); assert.ok(Number(col) < a.cols.length, `${here}: column ${col}`); }
        }
        if (a.k === 'flow') {
          Object.keys(a.state ?? {}).forEach(k => has(a.nodes, k));
          if (a.cur) has(a.nodes, a.cur);
          for (const key of Object.keys(a.link ?? {})) { const [from, to] = key.split('>'); has(a.nodes, from); has(a.nodes, to); }
          for (const link of a.links) { has(a.nodes, link.from); has(a.nodes, link.to); }
          for (const n of a.nodes) assert.ok(n.x >= 0 && n.x <= 100 && n.y >= 0 && n.y <= 100, `${here}: node position`);
        }
        if (a.k === 'crowd') a.on.forEach(k => has(a.rings, k));
        if (a.k === 'grid') for (const i of [...(a.walls ?? []), ...(a.path ?? []), ...(a.on ?? []), ...Object.keys(a.cells ?? {}).map(Number), a.me, a.goal].filter(x => x != null)) assert.ok(i >= 0 && i < a.w * a.h, `${here}: cell ${i} outside the grid`);
        if (a.k === 'seq') for (const i of a.blank ?? []) assert.ok(i < a.tiles.length, `${here}: blank ${i}`);
      }
    }
  }
});

test('every English and Hindi pair is written, and Hindi is real Devanagari', () => {
  for (const [slug, world] of Object.entries(m.worlds)) {
    const found = [];
    strings(world, slug, found);
    for (const [path, [en, hi]] of found) {
      assert.ok(en.trim() && hi.trim(), `${path}: empty text`);
      if (/[A-Za-z]{3}/.test(en) && !(en === hi && (!/\s/.test(en) || /[=+<>≤≥×÷]/.test(en)))) assert.ok(/[ऀ-ॿ]/u.test(hi), `${path}: Hindi missing for "${en}"`);
    }
  }
});

test('lesson stages have distinct compositions', () => {
  const seen = new Map();
  for (const [slug, world] of Object.entries(m.worlds)) {
    const key = JSON.stringify(world.art.map(a => [a.k, a.title?.[0], a.id]));
    assert.ok(!seen.has(key), `${slug} repeats the stage of ${seen.get(key)}`);
    seen.set(key, slug);
    assert.ok(world.label[0].length > 8, `${slug}: stage label`);
  }
});

test('every icon a stage uses exists', () => {
  const icons = new Set(Object.keys(m.ICONS));
  const missing = new Set();
  const walk = (value, path, slug) => {
    if (Array.isArray(value)) return value.forEach((v, i) => walk(v, `${path}[${i}]`, slug));
    if (value && typeof value === 'object') for (const [k, v] of Object.entries(value)) {
      if (['mark', 'state', 'link', 'cell', 'txt', 'on'].includes(k)) continue;
      if ((k === 'icon' || k === 'pic') && typeof v === 'string') { if (!icons.has(v)) missing.add(v); }
      else walk(v, `${path}.${k}`, slug);
    }
  };
  for (const [slug, world] of Object.entries(m.worlds)) walk(world, slug, slug);
  assert.deepEqual([...missing].sort(), [], 'icon names used by stages but missing from icons.ts');
});
