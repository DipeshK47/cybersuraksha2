// QA hooks for scripts/story-qa.cjs: how a learner helps Nani answer both pretend calls.
module.exports = {
  async solve(page) {
    await page.getByRole('button', { name: /^Call 1/ }).click();
    const first = page.getByRole('button', { name: 'Hang up, then call the number on the back of the card' });
    if (await first.isEnabled()) await first.click();
    await page.getByRole('button', { name: /^Call 2/ }).click();
    await page.getByRole('button', { name: 'Hang up, then call the number on the electricity bill' }).click();
    await page.waitForTimeout(300);
  },
  async wrongAttempt(page) {
    await page.getByRole('button', { name: 'Read the OTP so he can verify' }).click();
    return /No real bank asks for it/;
  },
};
