// QA hooks for scripts/story-qa.cjs: how a learner completes Kabir's raw-header task.
module.exports = {
  async solve(page) {
    for (const field of ['Received', 'Authentication-Results', 'From', 'Reply-To']) await page.getByRole('button', { name: new RegExp(`^${field}:`) }).click();
    await page.getByRole('button', { name: /Check my flags/ }).click();
  },
  async wrongAttempt(page) {
    await page.getByRole('button', { name: /name says Scholarship Office/ }).click();
    return /display name is a label/;
  },
};
