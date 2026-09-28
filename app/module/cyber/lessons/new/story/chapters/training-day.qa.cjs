// QA hooks for scripts/story-qa.cjs: how a learner fixes Tara's Pet Finder dataset.
module.exports = {
  async solve(page) {
    for (const photo of await page.getByRole('button', { name: /^Photo \d+: / }).all()) {
      const name = await photo.getAttribute('aria-label');
      const isDog = /golden|indie|pug/.test(name);
      if ((await photo.getAttribute('aria-pressed') === 'true') !== isDog) await photo.click();
    }
    await page.getByRole('button', { name: 'Retrain and test' }).click();
  },
  async wrongAttempt(page) {
    await page.getByRole('button', { name: 'Retrain and test' }).click();
    return /still misses Kittu/;
  },
};
