// QA hooks for scripts/story-qa.cjs: how a learner spots the fake-police warning signs and responds.
module.exports = {
  async solve(page) {
    for (const sign of [/^The badge/, /^“Stay on camera/, /^“Pay ₹50,000/]) {
      const button = page.getByRole('button', { name: sign });
      if (await button.isEnabled()) await button.click();
    }
    await page.getByRole('button', { name: 'End the call, tell family, and report it' }).click();
  },
  async wrongAttempt(page) {
    await page.getByRole('button', { name: /^He knows Mum/ }).click();
    return /isn.t proof he.s real/;
  },
};
