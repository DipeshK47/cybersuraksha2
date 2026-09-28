// QA hooks for scripts/story-qa.cjs: how a learner gives Sweepy one loop with the right count.
async function runWith(page, n) {
  const replace = page.getByRole('button', { name: 'Replace with one loop' });
  if (await replace.count() && await replace.isEnabled()) await replace.click();
  await page.getByRole('button', { name: `Repeat ${n} times` }).click();
  await page.getByRole('button', { name: 'Run Sweepy' }).click();
  await page.waitForTimeout(2200); // Sweepy drives desk by desk before the result shows
}
module.exports = {
  async solve(page) { await runWith(page, 5); },
  async wrongAttempt(page) {
    await runWith(page, 4);
    return /stops one desk short/;
  },
};
