import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const root = process.cwd();
const player = readFileSync(join(root, 'app/module/cyber/lessons/new/story/StoryPlayer.tsx'), 'utf8');

const between = (from, to) => {
  const start = player.indexOf(from);
  const end = player.indexOf(to, start);
  assert.ok(start >= 0 && end > start, `${from} … ${to}`);
  return player.slice(start, end);
};

test('the decision gate holds the story without seeking backwards', () => {
  // A seek is what snaps unseekable audio back to 0 (scene 1), so the gate must only pause.
  const gate = between('function trackAudio()', 'async function markSolved()');
  assert.match(gate, /\.pause\(\)/);
  assert.doesNotMatch(gate, /currentTime\s*=/);
});

test('every scene seek goes through the seekable check', () => {
  const seek = between('async function seek(', 'async function jump(');
  assert.match(seek, /canSeek\(/);
  assert.match(seek, /playDownloadedCopy\(/);
  const jump = between('async function jump(', 'function trackAudio()');
  assert.match(jump, /await seek\(/);
  assert.doesNotMatch(jump, /currentTime\s*=/);
});

test('narration that cannot seek is replayed from a downloaded copy the CSP allows', () => {
  assert.match(player, /URL\.createObjectURL/);
  const worker = readFileSync(join(root, 'worker/index.ts'), 'utf8');
  assert.match(worker, /"media-src 'self' blob:"/);
});
