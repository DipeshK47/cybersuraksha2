// QA hooks for scripts/story-qa.cjs: how a learner teaches Rohan's pet machine.
module.exports = {
  async solve(page) {
    const examples = [['Green apple', 'Fruit'], ['Grey rock', 'Rock'], ['Banana', 'Fruit'], ['Round red rock', 'Rock'], ['Grapes', 'Fruit'], ['Flat pebble', 'Rock']];
    for (const [name, tray] of examples) {
      await page.getByRole('button', { name, exact: true }).click();
      await page.getByRole('button', { name: new RegExp(`^${tray} tray`) }).click();
    }
    await page.getByRole('button', { name: /Test the machine/ }).click();
  },
  async wrongAttempt(page) {
    await page.getByRole('button', { name: 'Five more red apples', exact: true }).click();
    return /all the same/;
  },
};
