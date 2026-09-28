// QA hooks for scripts/story-qa.cjs: how a learner stops the pretend call in Nani's chapter.
module.exports = {
  async solve(page) {
    await page.getByRole('button', { name: 'Block call', exact: true }).click();
    await page.getByRole('button', { name: 'Tell Mum', exact: true }).click();
  },
  async wrongAttempt(page) {
    await page.getByRole('button', { name: 'Read the code', exact: true }).click();
    return /key to Nani/;
  },
};
