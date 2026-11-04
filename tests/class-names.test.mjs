import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { loadSource, root } from './class-9-helpers.mjs';

const { curriculum } = await loadSource(`export {curriculum} from './app/data/curriculum';`);
const overrides = JSON.parse(readFileSync(join(root, 'app/lib/i18n/hi-overrides.json'), 'utf8'));

const NAMES = {
  3: 'Cyber Explorers', 4: 'Cyber Trackers', 5: 'Cyber Rangers', 6: 'Cyber Sleuths',
  7: 'Cyber Analysts', 8: 'Cyber Builders', 9: 'Cyber Guardians', 10: 'Cyber Commanders',
};

test('Classes 3 to 10 carry the approved class names, each with a Hindi name', () => {
  for (const [grade, name] of Object.entries(NAMES)) {
    assert.equal(curriculum.find(entry => entry.grade === Number(grade)).title, name, `Class ${grade}`);
    assert.match(overrides[name] ?? '', /[ऀ-ॿ]/u, `Hindi for ${name}`);
  }
});

test('no chapter scene still shows an old class name, and each shows its own class name', () => {
  const directory = join(root, 'app/module/cyber/lessons/new/story/chapters');
  const old = /Discovery Club|Connection Lab|Future Lab|Signal Studio|Decision Lab/;
  let checked = 0;
  for (const file of readdirSync(directory).filter(name => /^class(6|7|8|9|10)-.*\.json$/.test(name))) {
    const grade = Number(file.match(/^class(\d+)-/)[1]);
    for (const scene of JSON.parse(readFileSync(join(directory, file), 'utf8')).scenes) {
      assert.doesNotMatch(scene.status, old, file);
      assert.equal(scene.status, `Class ${grade} ${NAMES[grade]}`, file);
      checked++;
    }
  }
  assert.equal(checked, 160 * 6);
});

test('lesson pages label Classes 6 to 10 with the same names, in both languages', () => {
  for (const grade of [6, 7, 8, 9, 10]) {
    const label = `Class ${grade} ${NAMES[grade]}`;
    assert.match(overrides[label] ?? '', /[ऀ-ॿ]/u, `Hindi for ${label}`);
    const ui = readFileSync(join(root, `app/module/cyber/lessons/class${grade}/ui.ts`), 'utf8');
    assert.ok(ui.includes(label), `class${grade}/ui.ts`);
  }
});
