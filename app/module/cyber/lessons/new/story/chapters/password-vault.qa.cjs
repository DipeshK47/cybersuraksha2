// QA hooks for scripts/story-qa.cjs: how a learner completes Tara's mid-story task.
async function fill(page, card, words) {
  await page.getByRole('button', { name: card }).click();
  const clear = page.getByRole('button', { name: /Clear card/ });
  if (await clear.isEnabled()) await clear.click();
  for (const word of words) await page.getByRole('button', { name: word, exact: true }).click();
}
module.exports = {
  async solve(page) {
    await fill(page, /^Sky Garden/, ['Mango!', 'Rocket482?']);
    await fill(page, /^School portal/, ['Tiger#', 'Pencil739!']);
    await fill(page, /^Email/, ['Apple@', 'Basket625!']);
    await page.getByRole('button', { name: /Replay the breach/ }).click();
  },
  async wrongAttempt(page) {
    for (const card of [/^Sky Garden/, /^School portal/, /^Email/]) await fill(page, card, ['Mango!', 'Tiger#']);
    await page.getByRole('button', { name: /Replay the breach/ }).click();
    if (!await page.getByText(/Choose one short word tile/).count()) throw new Error('Two short tiles must not count as a complete password');
    await fill(page, /^Sky Garden/, ['Mango!', 'Rocket482?']);
    await page.getByRole('button', { name: /Reuse game/ }).click();
    await page.getByRole('button', { name: /Replay the breach/ }).click();
    return /leaked password opened/;
  },
};
