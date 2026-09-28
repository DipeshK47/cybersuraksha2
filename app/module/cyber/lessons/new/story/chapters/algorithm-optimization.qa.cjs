// QA hooks for scripts/story-qa.cjs: how a learner races the sorts and justifies merge sort.
const picks = [['bubble', '8 names, already in order'], ['merge', '100 results, reversed'], ['merge', '2,000 results, mixed']];
module.exports = {
  async solve(page) {
    for (const [sort, list] of picks) {
      const button = page.getByRole('button', { name: `Predict ${sort} sort: ${list}`, exact: true });
      if (await button.count() && await button.isEnabled()) await button.click();
    }
    await page.getByRole('button', { name: /grows like n log n/ }).click();
  },
  async wrongAttempt(page) {
    await page.getByRole('button', { name: 'Predict merge sort: 8 names, already in order', exact: true }).click();
    return /Not this time/;
  },
};
