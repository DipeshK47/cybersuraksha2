// QA hooks for scripts/story-qa.cjs: how a learner completes Tara's mid-story task.
module.exports = {
  async solve(page) {
    for (const name of ['Contacts', 'Location', 'Camera', 'Microphone']) await page.getByRole('switch', { name: new RegExp(`^${name}`) }).click();
    await page.getByRole('button', { name: 'Save my choices', exact: true }).click();
  },
  async wrongAttempt(page) {
    await page.getByRole('button', { name: 'Allow all', exact: true }).click();
    return /It only needs to shine/;
  },
};
