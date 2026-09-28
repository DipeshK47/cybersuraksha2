// QA hooks for scripts/story-qa.cjs: how a learner fixes Tikku's morning steps.
const tap = async (page, steps) => { for (const step of steps) await page.getByRole('button', { name: step, exact: true }).click(); };
module.exports = {
  async solve(page) {
    const reset = page.getByRole('button', { name: 'Start over' });
    if (await reset.isEnabled()) await reset.click();
    await tap(page, ['Wake up', 'Brush teeth', 'Put on socks', 'Put on shoes', 'Put books in bag', 'Zip the bag']);
    await page.getByRole('button', { name: 'Run Tikku' }).click();
  },
  async wrongAttempt(page) {
    // The tempting path: tap the bank straight through, which repeats Rohan's shoes-before-socks list.
    await tap(page, ['Wake up', 'Brush teeth', 'Put on shoes', 'Put on socks', 'Zip the bag', 'Put books in bag']);
    await page.getByRole('button', { name: 'Run Tikku' }).click();
    return /socks over shoes/;
  },
};
