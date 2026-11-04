import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { loadSource, root } from './class-9-helpers.mjs';

const read = file => readFileSync(join(root, file), 'utf8');
const { ui } = await loadSource(`export {ui} from './app/module/cyber/lessons/class8/ui';`);

test('the five main task kinds are played on interactive boards', () => {
  const board = read('app/module/cyber/lessons/class8/TaskBoard.tsx');
  for (const name of ['MatchBoard', 'SortBoard', 'OrderBoard', 'ChoiceBoard', 'NumberBoard']) {
    assert.match(board, new RegExp(`<${name} \\{\\.\\.\\.board\\}`), name);
  }
  // The classes 6-7 playful look and classes 8-10 calm look come from the lesson's grade.
  assert.match(read('app/module/cyber/lessons/class8/Class8Lesson.tsx'), /band=\{props\.grade <= 7 \? "junior" : "senior"\}/);
});

test('every board string has English and Hindi, and the button says "Check my answer"', () => {
  for (const key of ['matchHint', 'answersBank', 'dropAnswer', 'tapToPlace', 'sortHint', 'cardsBank', 'yourAnswer', 'orderHint', 'stepsBank', 'moveUp', 'moveDown', 'remove', 'choiceHint', 'numberHint', 'decrease', 'increase', 'correct', 'tryAgain', 'missed']) {
    assert.ok(ui[key].en.trim(), `${key} English`);
    assert.match(ui[key].hi, /[ऀ-ॿ]/u, `${key} Hindi`);
  }
  assert.equal(ui.check.en, 'Check my answer');
});

test('the drag engine works by touch and scrolls the page near the screen edge', () => {
  const dnd = read('app/module/cyber/lessons/class8/practice-dnd.tsx');
  assert.match(dnd, /pointerType === "touch"/);
  assert.match(dnd, /data-grip/);
  assert.match(dnd, /scrollBy/);
});
