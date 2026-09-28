// QA hooks for scripts/story-qa.cjs: how a learner fixes and tests Meera's report-card pseudocode.
module.exports = {
  async solve(page) {
    await page.getByRole('button', { name: 'Comparison: greater than or equal to 40', exact: true }).click();
    await page.getByRole('button', { name: 'Loop end: count', exact: true }).click();
    await page.getByRole('button', { name: 'Run the tests' }).click();
  },
  async wrongAttempt(page) {
    await page.getByRole('button', { name: 'Comparison: greater than 39', exact: true }).click();
    return /hides the rule/;
  },
};
