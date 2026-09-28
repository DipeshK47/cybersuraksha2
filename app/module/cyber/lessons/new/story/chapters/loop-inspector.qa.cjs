// QA hooks for scripts/story-qa.cjs: how a learner completes Tara's mid-story task.
module.exports = {
  async solve(page) {
    await page.getByRole('button', { name: 'Move right, then sweep', exact: true }).click();
    await page.getByRole('button', { name: 'Repeat 5 times', exact: true }).click();
    await page.getByRole('button', { name: 'Run loop' }).click();
    await page.locator('[data-solved="true"]').waitFor({ timeout: 8000 });
  },
  async wrongAttempt(page) {
    await page.getByRole('button', { name: 'Move right, then sweep', exact: true }).click();
    await page.getByRole('button', { name: 'Repeat 6 times', exact: true }).click();
    await page.getByRole('button', { name: 'Run loop' }).click();
    await page.getByText(/past tile 5 into the bin/).waitFor({ timeout: 8000 });
    return /past tile 5 into the bin/;
  },
};
