// QA hooks for scripts/story-qa.cjs: how a learner completes Kabir's mid-story task.
module.exports = {
  async solve(page) {
    await page.getByRole('button', { name: /family passphrase\?/ }).click();
    await page.getByRole('button', { name: /Call Uncle Vikram.s saved number/ }).click();
    await page.getByRole('button', { name: /Don.t pay/ }).click();
  },
  async wrongAttempt(page) {
    await page.getByRole('button', { name: /his voice, send the money/ }).click();
    return /can be copied from a short video/;
  },
};
