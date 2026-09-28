// QA hooks for scripts/story-qa.cjs: how a learner completes Tara's mid-story task.
// solve() also runs after wrongAttempt(), so it skips any step that is already answered.
module.exports = {
  async solve(page) {
    for (const name of ['From Mum’s account to the buyer', 'Cancel, with no PIN', 'Send the shop’s own QR code or UPI ID']) {
      const button = page.getByRole('button', { name, exact: true });
      if (await button.count()) await button.click();
    }
    await page.getByRole('button', { name: /Send the shop’s QR to the buyer/ }).click();
  },
  async wrongAttempt(page) {
    await page.getByRole('button', { name: 'From Mum’s account to the buyer', exact: true }).click();
    await page.getByRole('button', { name: 'Enter PIN to receive', exact: true }).click();
    return /only ever says yes to sending money/;
  },
};
