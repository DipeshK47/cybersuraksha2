// QA hooks for scripts/story-qa.cjs: how a learner flags the spoofed email's header clues.
module.exports = {
  async solve(page) {
    for (const field of ['From', 'Reply-To', 'Received', 'Authentication-Results']) {
      const row = page.getByRole('button', { name: `Flag ${field}`, exact: true });
      if (await row.getAttribute('aria-pressed') !== 'true') await row.click();
    }
    await page.getByRole('button', { name: 'Submit findings' }).click();
  },
  async wrongAttempt(page) {
    await page.getByRole('button', { name: /^The name says Scholarship Office/ }).click();
    return /just a label anyone can type/;
  },
};
