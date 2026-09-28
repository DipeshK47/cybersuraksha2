// QA hooks for scripts/story-qa.cjs: how a learner completes Rohan's mid-story task.
module.exports = {
  async solve(page) {
    for (const word of ['Lantern', 'River', 'Cactus', 'Moon', 'Pebble']) await page.getByRole('button', { name: word, exact: true }).click();
    await page.getByRole('button', { name: /Save Rohan/ }).click();
  },
  async wrongAttempt(page) {
    await page.getByRole('button', { name: 'Rohan123', exact: true }).click();
    return /old shortcut/;
  },
};
