// QA hooks for scripts/story-qa.cjs: how a learner inspects the clip and verifies before sharing.
const answers = [['0:02', 'Looks normal'], ['0:05', 'Tag as artefact'], ['0:08', 'Tag as artefact'], ['0:11', 'Tag as artefact'], ['0:14', 'Looks normal']];
module.exports = {
  async solve(page) {
    for (const [time, choice] of answers) {
      await page.getByRole('button', { name: `Frame ${time}`, exact: true }).click();
      const button = page.getByRole('button', { name: choice, exact: true });
      if (await button.isEnabled()) await button.click();
    }
    await page.getByRole('button', { name: /^Check the fair/ }).click();
  },
  async wrongAttempt(page) {
    await page.getByRole('button', { name: 'Looks real. Forward it', exact: true }).click();
    return /Realistic fakes exist/;
  },
};
