// QA hooks for scripts/story-qa.cjs: how a learner completes Tara's three-key task.
const cards = [[/^Sky Garden/, ['Anchor', 'Cloud', 'Drum']], [/^School portal/, ['Feather', 'Lotus', 'Rocket']], [/^Email/, ['Shell', 'Umbrella', 'Banyan']]];
module.exports = {
  async solve(page) {
    for (const [card, words] of cards) {
      await page.getByRole('button', { name: card }).click();
      const clear = page.getByRole('button', { name: 'Clear card' });
      if (await clear.isEnabled()) await clear.click();
      for (const word of words) await page.getByRole('button', { name: word, exact: true }).click();
    }
    await page.getByRole('button', { name: 'Replay the breach' }).click();
  },
  async wrongAttempt(page) {
    for (const word of cards[0][1]) await page.getByRole('button', { name: word, exact: true }).click();
    await page.getByRole('button', { name: /Copy game/ }).click();
    await page.getByRole('button', { name: 'Replay the breach' }).click();
    return /same words as the game/;
  },
};
