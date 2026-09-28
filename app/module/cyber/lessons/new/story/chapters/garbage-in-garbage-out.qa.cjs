// QA hooks for scripts/story-qa.cjs: how a learner completes Tara's mid-story task.
module.exports = {
  async solve(page) {
    const putBack = page.getByRole('button', { name: 'Put back Test bake column' });
    if (await putBack.count()) await putBack.click();
    await page.getByRole('button', { name: 'Remove School column' }).click();
    await page.getByRole('button', { name: 'Rerun the app' }).click();
    await page.getByRole('button', { name: /Show Aunt Meera/ }).click();
  },
  async wrongAttempt(page) {
    await page.getByRole('button', { name: 'Remove Test bake column' }).click();
    return /really bakes/;
  },
};
