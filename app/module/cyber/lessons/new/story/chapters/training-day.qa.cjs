// QA hooks for scripts/story-qa.cjs: how a learner completes Tara's mid-story task.
module.exports = {
  async solve(page) {
    for (const [name, label] of [['Golden retriever', 'Dog'], ['Indie dog', 'Dog'], ['Pugs', 'Dog'], ['Cat', 'Not dog'], ['Crow', 'Not dog'], ['Squirrel', 'Not dog']]) await page.getByRole('button', { name: `Mark ${name} as ${label}`, exact: true }).click();
    await page.getByRole('button', { name: /Retrain and test/ }).click();
    await page.locator('[data-solved="true"]').waitFor({ timeout: 5000 });
  },
  async wrongAttempt(page) {
    await page.getByRole('button', { name: 'Mark Golden retriever as Dog', exact: true }).click();
    await page.getByRole('button', { name: /Retrain and test/ }).click();
    return /only golden retrievers/;
  },
};
