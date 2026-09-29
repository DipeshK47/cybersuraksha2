// Public, accessible controls only; stages are zero based. Wrong attempts never advance.
const press = (page, name) => page.getByRole('button', { name, exact: true }).click();
const ensurePressed = async (page, name, wanted) => {
  const button = page.getByRole('button', { name, exact: true });
  if ((await button.getAttribute('aria-pressed') === 'true') !== wanted) await button.click();
};
module.exports = {
  'robot-or-not': {
    async solveStage(page, stage) {
      const groups = [[['Puppy', 'Alive'], ['Smart speaker', 'Machine'], ['Dancing robot', 'Machine']], [['Plant', 'Alive'], ['Classroom clock', 'Machine'], ['Puppy', 'Alive']], [['Dancing robot', 'Machine'], ['Plant', 'Alive'], ['Smart speaker', 'Machine']]];
      for (const [name, kind] of groups[stage]) { await press(page, `Inspect ${name}`); await press(page, `Sort into ${kind} station`); }
      await press(page, 'Check sorting stations');
    },
    async wrongStage(page) {
      const hasPuppy = await page.getByRole('button', { name: 'Inspect Puppy', exact: true }).count();
      await press(page, hasPuppy ? 'Inspect Puppy' : 'Inspect Dancing robot');
      await press(page, hasPuppy ? 'Sort into Machine station' : 'Sort into Alive station');
      await press(page, 'Check sorting stations');
    },
  },
  'teach-pet-machine': {
    async solveStage(page, stage) {
      const groups = [[['Red apple', 'Fruit'], ['Grey rock', 'Rock']], [['Green apple', 'Fruit'], ['Round red rock', 'Rock']], [['Banana', 'Fruit'], ['Grapes', 'Fruit'], ['Flat pebble', 'Rock']]];
      for (const [name, label] of groups[stage]) { await press(page, `Select ${name} example`); await press(page, `Label selected example ${label}`); }
      await press(page, 'Train and test');
    },
    async wrongStage(page) {
      const names = await page.getByRole('button', { name: /^Select .+ example$/ }).allTextContents();
      const fruits = ['Red apple', 'Green apple', 'Banana', 'Grapes'];
      for (let i = 0; i < names.length; i++) {
        const name = names[i].trim().replace(/(?:No label yet|Fruit|Rock)$/, '').trim();
        const correct = fruits.includes(name) ? 'Fruit' : 'Rock';
        await press(page, `Select ${name} example`); await press(page, `Label selected example ${i === 0 ? correct === 'Fruit' ? 'Rock' : 'Fruit' : correct}`);
      }
      await press(page, 'Train and test');
    },
  },
  'training-day': {
    async solveStage(page, stage) {
      const groups = [[['Golden retriever', 'Dog'], ['Indie dog', 'Dog'], ['Cat', 'Not dog']], [['Pugs', 'Dog'], ['Golden retriever', 'Dog'], ['Crow', 'Not dog']], [['Indie dog', 'Dog'], ['Pugs', 'Dog'], ['Squirrel', 'Not dog']]];
      for (const [name, label] of groups[stage]) await press(page, `Label ${name} ${label}`);
      await press(page, 'Run photo label check');
    },
    async wrongStage(page) {
      const first = page.getByRole('button', { name: /^Label .+ Not dog$/ }).first(); await first.click(); await press(page, 'Run photo label check');
    },
  },
  'garbage-in-garbage-out': {
    async solveStage(page, stage) {
      await ensurePressed(page, 'Use school name in decision', false);
      await ensurePressed(page, 'Use test bake in decision', true);
      const choices = stage === 2 ? ['Kavya', 'Aarav'] : ['Kavya', 'Ishaan'];
      for (const name of ['Kavya', 'Ishaan', 'Aarav', 'Zoya']) {
        const button = page.getByRole('button', { name: `Select ${name} for interview`, exact: true });
        if (await button.count()) await ensurePressed(page, `Select ${name} for interview`, choices.includes(name));
      }
      await press(page, 'Run hiring comparison');
    },
    async wrongStage(page) { await ensurePressed(page, 'Use school name in decision', true); await press(page, 'Run hiring comparison'); },
  },
  'deepfake-detective': {
    async solveStage(page, stage) {
      const frames = [1, 3, 4]; const clues = ['Odd blinking', 'Lips do not match the words', 'Shadow conflicts with the lantern'];
      await press(page, `Inspect frame at ${frames[stage]} second${frames[stage] === 1 ? "" : "s"}`); await press(page, clues[stage]);
      await press(page, 'Fair committee’s official notice'); await press(page, 'Open selected source'); await press(page, 'Hold clip and verify');
    },
    async wrongStage(page) { await press(page, 'Forward cancellation clip'); },
  },
  'recommendation-rabbit-hole': {
    async solveStage(page, stage) {
      if (stage === 0) { await press(page, 'Watch fair rumour'); await press(page, 'Watch fair rumour'); await press(page, 'Clicks asked for similar posts'); await press(page, 'Check experiment explanation'); }
      else {
        await ensurePressed(page, 'Follow Cricket topic', true); await ensurePressed(page, 'Follow Science topic', true); await ensurePressed(page, 'Follow Cyberpur Fair official source', true);
        if (stage === 2) await page.getByRole('button', { name: /^Not interested in / }).first().click();
        await press(page, 'Refresh and check feed');
      }
    },
    async wrongStage(page) {
      if (await page.getByRole('button', { name: 'Check experiment explanation', exact: true }).count()) { await press(page, 'Watch fair rumour'); await press(page, 'Watch fair rumour'); await press(page, 'Repeated rumours became verified'); await press(page, 'Check experiment explanation'); }
      else await press(page, 'Follow FAIR TRUTH EXPOSED');
    },
  },
};
