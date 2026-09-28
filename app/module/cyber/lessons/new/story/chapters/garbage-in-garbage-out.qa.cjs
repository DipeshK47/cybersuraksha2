// QA hooks for scripts/story-qa.cjs: how a learner removes the unfair column from the bakery tool's data.
module.exports = {
  async solve(page) {
    const school = page.getByRole('button', { name: 'Remove School name' });
    if (await school.isEnabled()) await school.click();
    await page.getByRole('button', { name: 'Rerun the shortlist' }).click();
  },
  async wrongAttempt(page) {
    await page.getByRole('button', { name: 'Remove Years of baking' }).click();
    return /real experience/;
  },
};
