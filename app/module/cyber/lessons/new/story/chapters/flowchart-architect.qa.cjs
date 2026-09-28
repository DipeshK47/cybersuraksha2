// QA hooks for scripts/story-qa.cjs: how a learner rebuilds and tests Tara's flowchart.
module.exports = {
  async solve(page) {
    for (const block of ['Hands under sensor?', 'Give soap', 'End']) await page.getByRole('button', { name: block, exact: true }).click();
    await page.getByRole('button', { name: 'Test: hands at the sink' }).click();
    await page.getByRole('button', { name: 'Test: empty sink' }).click();
  },
  async wrongAttempt(page) {
    await page.getByRole('button', { name: 'Give soap', exact: true }).click();
    return /Ask first: are hands there/;
  },
};
