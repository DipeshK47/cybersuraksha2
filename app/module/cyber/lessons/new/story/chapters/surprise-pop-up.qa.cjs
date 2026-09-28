// QA hooks for scripts/story-qa.cjs: how a learner clears Rohan's surprise pop-up.
module.exports = {
  async solve(page) {
    await page.getByRole('button', { name: /Move to trash/ }).click();
  },
  async wrongAttempt(page) {
    await page.getByRole('button', { name: 'CLAIM', exact: true }).click();
    return /never entered a contest/;
  },
};
