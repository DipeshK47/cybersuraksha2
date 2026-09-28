// QA hooks for scripts/story-qa.cjs: how a learner audits Kabir's three public posts.
module.exports = {
  async solve(page) {
    for (const name of [/^Keep: water-tester post/, /^Delete and apologise: comment on Rahul/, /^Hide and ask: photo of Aarav/]) {
      const button = page.getByRole('button', { name });
      if (await button.isEnabled()) await button.click();
    }
    await page.waitForTimeout(600); // the story moves on after a short pause
  },
  async wrongAttempt(page) {
    await page.getByRole('button', { name: /^Delete and apologise: water-tester post/ }).click();
    return /hides Kabir.s best evidence/;
  },
};
