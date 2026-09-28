// QA hooks for scripts/story-qa.cjs: how a learner packs Rohan's two bags.
const pack = async (page, item, bag) => {
  await page.getByRole('button', { name: item, exact: true }).click();
  await page.getByRole('button', { name: new RegExp(`^${bag} bag`) }).click();
};
module.exports = {
  async solve(page) {
    for (const item of ['Home address', 'Full name', 'Selfie']) await pack(page, item, 'Keep Private');
    for (const item of ['Favourite colour', 'Favourite animal', 'Tiger drawing']) await pack(page, item, 'Safe to Share');
    await page.getByRole('button', { name: /Zip up the bags/ }).click();
  },
  async wrongAttempt(page) {
    await pack(page, 'Home address', 'Safe to Share');
    return /This page is public/;
  },
};
