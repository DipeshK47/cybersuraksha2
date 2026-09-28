// QA hooks for scripts/story-qa.cjs: how a learner completes Rohan's robot sorting task.
const sorts = [['Puppy', 'Alive'], ['Smart speaker', 'Machine'], ['Classroom clock', 'Machine'], ['Dancing robot', 'Machine'], ['Plant', 'Alive']];
module.exports = {
  async solve(page) {
    for (const [thing, bin] of sorts) {
      await page.getByRole('button', { name: thing, exact: true }).click();
      await page.getByRole('button', { name: new RegExp(`^${bin}`) }).click();
    }
    await page.getByRole('button', { name: /Show Nani/ }).click();
  },
  async wrongAttempt(page) {
    await page.getByRole('button', { name: 'Dancing robot', exact: true }).click();
    await page.getByRole('button', { name: /^Alive/ }).click();
    return /people wrote its program/;
  },
};
