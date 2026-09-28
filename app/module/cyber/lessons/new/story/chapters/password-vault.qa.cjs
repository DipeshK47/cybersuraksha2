// QA hooks for scripts/story-qa.cjs: how a learner completes Tara's mid-story task.
async function fill(page, card, words) {
  await page.getByRole('button', { name: card }).click();
  const clear = page.getByRole('button', { name: /Clear card/ });
  if (await clear.isEnabled()) await clear.click();
  for (const word of words) await page.getByRole('button', { name: word, exact: true }).click();
}
module.exports = {
  async solve(page) {
    await fill(page, /^Sky Garden/, ['Anchor', 'Cloud', 'Drum']);
    await fill(page, /^School portal/, ['Feather', 'Lotus', 'Rocket']);
    await fill(page, /^Email/, ['Shell', 'Umbrella', 'Banyan']);
    await page.getByRole('button', { name: /Replay the breach/ }).click();
  },
  async wrongAttempt(page) {
    for (const word of ['Anchor', 'Cloud', 'Drum']) await page.getByRole('button', { name: word, exact: true }).click();
    await page.getByRole('button', { name: /Copy game/ }).click();
    await page.getByRole('button', { name: /Replay the breach/ }).click();
    return /leaked passphrase opened/;
  },
};
