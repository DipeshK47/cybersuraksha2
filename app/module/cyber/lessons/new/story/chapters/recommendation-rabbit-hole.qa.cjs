// QA hooks for scripts/story-qa.cjs: how a learner steers Meera's feed back to variety.
async function clickIfEnabled(button) { if (await button.count() && await button.isEnabled()) { await button.click(); return true; } return false; }
module.exports = {
  async solve(page) {
    while (await clickIfEnabled(page.getByRole('button', { name: /^Not interested:/ }).first())) { /* one rumour at a time */ }
    await clickIfEnabled(page.getByRole('button', { name: /^Follow Cyberpur News/ }));
    for (const topic of ['science', 'cricket', 'music', 'cooking']) await clickIfEnabled(page.getByRole('button', { name: topic, exact: true }));
    await page.waitForTimeout(600); // the story moves on after a short pause
  },
  async wrongAttempt(page) {
    await page.getByRole('button', { name: /^Watch: FAIR CANCELLED/ }).click();
    return /so the algorithm sends even more/;
  },
};
