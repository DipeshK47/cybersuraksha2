// QA hooks for scripts/story-qa.cjs: how a learner completes Tara's mid-story flowchart task.
module.exports = {
  async solve(page) {
    for (const block of ['Hands under sensor?', 'Dispense soap', 'Wait a moment', 'End']) await page.getByRole('button', { name: new RegExp(`^${block.replace('?', '\\?')} \\(`) }).click();
    await page.getByRole('button', { name: 'Test: hands under sensor' }).click();
    await page.getByRole('button', { name: 'Test: empty sink' }).click();
    await page.getByRole('button', { name: /Save flowchart/ }).click();
  },
  async wrongAttempt(page) {
    await page.getByRole('button', { name: /^Dispense soap \(/ }).click();
    return /old plan: soap before asking/;
  },
};
