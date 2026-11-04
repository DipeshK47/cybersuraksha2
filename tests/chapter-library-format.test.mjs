import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const root = process.cwd();

test('every class shows the same plain chapter cards in the subject library', () => {
  const page = readFileSync(join(root, 'app/grade/[grade]/[subject]/page.tsx'), 'utf8');
  assert.doesNotMatch(page, /artwork/i);
  assert.doesNotMatch(page, /<img/);
});

test('Class 6 uses the same library label as the other classes', () => {
  const curriculum = readFileSync(join(root, 'app/data/class-6-curriculum.ts'), 'utf8');
  assert.match(curriculum, /CyberShiksha Interactive Curriculum · Class 6/);
  assert.doesNotMatch(curriculum, /Discovery Club ·/);
});
