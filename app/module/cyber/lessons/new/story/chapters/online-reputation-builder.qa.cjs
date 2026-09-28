// QA hooks for scripts/story-qa.cjs: how a learner completes Kabir's profile audit.
module.exports = {
  async solve(page) {
    for (const name of ['Keep: project post', 'Delete: comment about Tanvi', 'Ask permission: photo of Ishaan']) await page.getByRole('button', { name, exact: true }).click();
    await page.getByRole('button', { name: /Finish the audit/ }).click();
  },
  async wrongAttempt(page) {
    await page.getByRole('button', { name: 'Delete: project post', exact: true }).click();
    return /best evidence/;
  },
};
