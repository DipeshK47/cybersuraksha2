// QA hooks for scripts/story-qa.cjs: how a learner completes Rohan's track-fixing task.
module.exports = {
  async solve(page) {
    for (const tile of ['Blue square', 'Green triangle']) await page.getByRole('button', { name: tile, exact: true }).click();
    await page.getByRole('button', { name: /Roll the trolley/ }).click();
  },
  async wrongAttempt(page) {
    for (const tile of ['Blue triangle', 'Green triangle']) await page.getByRole('button', { name: tile, exact: true }).click();
    await page.getByRole('button', { name: /Roll the trolley/ }).click();
    return /right colour, wrong shape/;
  },
};
