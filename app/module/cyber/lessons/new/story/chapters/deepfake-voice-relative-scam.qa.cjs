// QA hooks for scripts/story-qa.cjs: how a learner verifies the cloned voice note before anyone pays.
module.exports = {
  async solve(page) {
    const ask = page.getByRole('button', { name: /^Ask: .What.s our family passphrase/ });
    if (await ask.count() && await ask.isEnabled()) await ask.click();
    await page.getByRole('button', { name: 'Call Chacha on his saved number' }).click();
    await page.waitForTimeout(400); // the story moves on after a short pause
  },
  async wrongAttempt(page) {
    await page.getByRole('button', { name: /^Send ₹20,000 now/ }).click();
    return /can be cloned/;
  },
};
