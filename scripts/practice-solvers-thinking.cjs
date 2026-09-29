// Exclusive thinking-practice solvers. The CLI also checks the actual pure execution functions.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const click = (page, name) => page.getByRole('button', { name, exact: true }).click();
const select = (page, name, value) => page.getByRole('combobox', { name, exact: true }).selectOption(value);
const routes = {
  'pattern-detective': {
    async solveStage(page, stage) {
      const tiles = [['blue square'], ['orange diamond', 'orange diamond'], ['blue square', 'green triangle']][stage];
      for (let i = 0; i < tiles.length; i++) { await page.getByRole('button', { name: new RegExp(`^Gap ${i + 1}:`) }).click(); await click(page, `Place ${tiles[i]}`); }
      await click(page, 'Roll trolley');
    },
    async wrongStage(page) { await click(page, 'Place blue triangle'); await click(page, 'Roll trolley'); },
  },
  'step-by-step-morning': {
    async solveStage(page, stage) {
      await click(page, 'Clear routine');
      const orders = [['Wake up', 'Brush teeth', 'Put on shoes'], ['Check the timetable', 'Open the bag', 'Put books in bag', 'Zip the bag'], ['Wake up', 'Brush teeth', 'Put on socks', 'Put on shoes', 'Put books in bag', 'Zip the bag']];
      for (const step of orders[stage]) await click(page, `Add ${step}`);
      await click(page, 'Run routine');
    },
    async wrongStage(page) { for (const step of ['Put on shoes', 'Wake up', 'Brush teeth']) await click(page, `Add ${step}`); await click(page, 'Run routine'); },
  },
  'flowchart-architect': {
    async solveStage(page, stage) {
      await select(page, stage === 0 ? 'Pump block shape' : 'Sensor question shape', stage === 0 ? 'Process' : 'Decision');
      if (stage > 0) { await select(page, 'YES branch action', 'soap'); await select(page, 'NO branch action', 'wait'); }
      await click(page, 'Run sensor test 1'); await click(page, 'Run sensor test 2'); await click(page, 'Save tested chart');
    },
    async wrongStage(page) { await select(page, 'Pump block shape', 'End'); await click(page, 'Run sensor test 1'); await click(page, 'Run sensor test 2'); await click(page, 'Save tested chart'); },
  },
  'loop-inspector': {
    async solveStage(page, stage) { await click(page, stage === 0 ? 'Move right' : 'Move right, then sweep'); await select(page, 'Repeat count', String([4, 5, 8][stage])); await click(page, 'Run loop'); },
    async wrongStage(page) { await click(page, 'Move right'); await select(page, 'Repeat count', '5'); await click(page, 'Run loop'); },
  },
  'complex-algorithmic-logic': {
    async solveStage(page, stage) {
      if (stage === 1) await select(page, 'Loop structure', 'nested');
      else await select(page, 'Marks condition', '>=');
      if (stage === 2) { await select(page, 'Loop end', 'count'); await select(page, 'Attendance condition', '>='); }
      await click(page, 'Run test cases');
    },
    async wrongStage(page) { await click(page, 'Run test cases'); },
  },
  'algorithm-optimization': {
    async solveStage(page, stage) { await select(page, 'Sort prediction', stage === 0 ? 'bubble' : 'merge'); await click(page, 'Run both sorts'); await click(page, `Conclude ${stage === 0 ? 'bubble' : 'merge'}`); },
    async wrongStage(page) { await select(page, 'Sort prediction', 'merge'); await click(page, 'Run both sorts'); await click(page, 'Conclude merge'); },
  },
};
module.exports = routes;

if (require.main === module) {
  const ts = require('typescript');
  const sourcePath = path.resolve(__dirname, '../app/module/cyber/lessons/new/ThinkingMissions.tsx');
  const source = fs.readFileSync(sourcePath, 'utf8') + '\nexports.checks = { bubbleTrace, mergeTrace, executeRoutine, executeLoop, gradeExecution, runFlow };';
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 } }).outputText;
  const mod = { exports: {} };
  vm.runInNewContext(js, { module: mod, exports: mod.exports, require: () => ({}), console }, { filename: sourcePath });
  const { bubbleTrace, mergeTrace, executeRoutine, executeLoop, gradeExecution, runFlow } = mod.exports.checks;
  const ordinary = value => JSON.parse(JSON.stringify(value));
  const datasets = [[1, 2, 3, 4], [8, 7, 6, 5, 4, 3, 2, 1], [12, 4, 9, 2, 11, 6, 1, 8, 3, 10, 5, 7], [], [3], [2, 1, 2, 0]];
  const counters = [];
  for (const data of datasets) {
    const input = [...data]; const bubble = bubbleTrace(data).at(-1); const merge = mergeTrace(data).at(-1); const expected = [...data].sort((a, b) => a - b);
    assert.deepEqual(ordinary(bubble.data), expected); assert.deepEqual(ordinary(merge.data), expected); assert.deepEqual(data, input);
    counters.push([bubble.comparisons, merge.comparisons]);
  }
  assert.deepEqual(counters[0], [3, 4]); assert.deepEqual(counters[1], [28, 12]); assert.ok(counters[2][0] > counters[2][1]);
  const loop = executeLoop(5, ['MOVE RIGHT', 'SWEEP'], 5); assert.equal(loop.length, 10); assert.equal(loop.at(-1).pos, 5); assert.ok(loop.at(-1).clean.every(Boolean));
  assert.equal(executeLoop(5, ['MOVE RIGHT', 'SWEEP'], 6).at(-1).bump, true);
  assert.equal(executeLoop(5, ['SWEEP', 'MOVE RIGHT'], 5).at(-1).clean[4], false);
  const badRoutine = executeRoutine(['Zip', 'Books'], { Zip: ['Books'] }); assert.equal(badRoutine.length, 1); assert.equal(badRoutine[0].ok, false);
  const goodRoutine = executeRoutine(['Books', 'Zip'], { Zip: ['Books'] }); assert.ok(goodRoutine.every(frame => frame.ok));
  for (const marks of [39.5, 40, 41]) assert.equal(gradeExecution({ roll: 'test', marks, attendance: 75 }, 2, '>=', '>=', 'count').got, marks >= 40 ? 'Pass' : 'Fail');
  for (const attendance of [74, 75, 76]) assert.equal(gradeExecution({ roll: 'test', marks: 40, attendance }, 2, '>=', '>=', 'count').got, attendance >= 75 ? 'Pass' : 'Fail');
  assert.equal(gradeExecution({ roll: 'last', marks: 55, attendance: 90, last: true }, 2, '>=', '>=', 'minus').got, 'Missing');
  assert.equal(gradeExecution({ roll: '7B-1', marks: 55, attendance: 90 }, 1, '>=', '>=', 'flat').got, 'Type error');
  const arrival = runFlow([false, false, true], 'Decision', 'soap', 'wait', 2); assert.equal(arrival.soap, 1); assert.equal(arrival.trace.filter(line => line === 'Wait and ask again').length, 2);
  const empty = runFlow([false, false, false], 'Decision', 'soap', 'wait', 2); assert.equal(empty.soap, 0); assert.equal(empty.stopped, false);
  assert.equal(runFlow([false], 'Process', 'soap', 'soap', 0).soap, 1); assert.equal(runFlow([true], 'End', 'soap', 'wait', 0).valid, false);
  console.log(`PASS thinking execution checks: routine prerequisites, loop commands/collision, grade boundaries/coverage, sensor branches/waits, sort outputs and measured counts ${JSON.stringify(counters.slice(0, 3))}`);
}
