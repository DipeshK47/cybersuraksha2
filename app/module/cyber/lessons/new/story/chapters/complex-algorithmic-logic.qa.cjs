// QA hooks for scripts/story-qa.cjs: how a learner completes Kabir's mid-story task.
module.exports = {
  async solve(page) {
    await page.getByRole('button', { name: 'count', exact: true }).click();
    await page.getByRole('button', { name: 'greater than or equal to 40', exact: true }).click();
    await page.getByRole('button', { name: /Run test cases/ }).click();
    await page.getByRole('button', { name: /Send fix to Mrs Rao/ }).click();
  },
  async wrongAttempt(page) {
    await page.getByRole('button', { name: 'greater than 39', exact: true }).click();
    return /boundary the rule states/;
  },
};
