// QA hooks for scripts/story-qa.cjs: how a learner completes Kabir's mid-story task.
module.exports = {
  async solve(page) {
    for (const [second, tag] of [[1, 'Odd blinking'], [3, 'Lips don’t match audio'], [4, 'Shadow on the wrong side']]) {
      await page.getByRole('button', { name: new RegExp(`^Frame at ${second} second`) }).click();
      await page.getByRole('button', { name: tag, exact: true }).click();
    }
    await page.getByRole('button', { name: /Check the official channel/ }).click();
  },
  async wrongAttempt(page) {
    await page.getByRole('button', { name: 'Looks real, forward it', exact: true }).click();
    return /Looking real isn’t proof/;
  },
};
