// QA hooks for scripts/story-qa.cjs: how a learner completes Tara's permission switches.
module.exports = {
  async solve(page) {
    for (const id of ['Contacts', 'Location', 'Camera', 'Microphone']) {
      const toggle = page.getByRole('switch', { name: new RegExp(`^${id}`) });
      if (await toggle.getAttribute('aria-checked') === 'true') await toggle.click();
    }
    await page.getByRole('button', { name: /Continue with my choices/ }).click();
  },
  async wrongAttempt(page) {
    await page.getByRole('button', { name: 'Allow all', exact: true }).click();
    return /only to make light/;
  },
};
