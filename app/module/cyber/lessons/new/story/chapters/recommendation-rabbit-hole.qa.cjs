// QA hooks for scripts/story-qa.cjs: how a learner completes Kabir's mid-story task.
// solve() also runs after wrongAttempt(), so it hides every rumour that is in the feed by then.
module.exports = {
  async solve(page) {
    for (const name of ['Cricket', 'Science']) {
      const chip = page.getByRole('button', { name, exact: true });
      if (await chip.getAttribute('aria-pressed') !== 'true') await chip.click();
    }
    const hide = page.getByRole('button', { name: /^Not interested:/ });
    for (let i = 0; i < 6 && await hide.count(); i++) await hide.first().click();
    await page.getByRole('button', { name: 'Follow Cyberpur Fair · Official', exact: true }).click();
    await page.getByRole('button', { name: /Refresh Kabir/ }).click();
  },
  async wrongAttempt(page) {
    await page.getByRole('button', { name: /tap to watch/ }).first().click();
    return /Try Not interested instead/;
  },
};
