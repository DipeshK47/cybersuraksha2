// QA hooks for scripts/story-qa.cjs: how a learner stops the fake "receive" payment and gets paid safely.
module.exports = {
  async solve(page) {
    const cancel = page.getByRole('button', { name: 'Cancel the payment' });
    if (await cancel.isEnabled()) await cancel.click();
    await page.getByRole('button', { name: /^Send Mum.s own QR code/ }).click();
    await page.waitForTimeout(600); // the story moves on after a short pause
  },
  async wrongAttempt(page) {
    await page.getByRole('button', { name: /^Enter the PIN, it/ }).click();
    return /A PIN never receives money/;
  },
};
