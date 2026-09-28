// QA hooks for scripts/story-qa.cjs: how a learner completes Kabir's mid-story task.
async function spotSigns(page) {
  const check = page.getByRole('button', { name: /Check my signs/ });
  if (!(await check.count())) return;
  for (const name of [/CBI.*badge/, /Stay on camera/, /Pay ₹50,000 to clear your name/]) await page.getByRole('button', { name }).click();
  await check.click();
}
module.exports = {
  async solve(page) {
    await spotSigns(page);
    for (const name of [/^End the call/, /^Tell family/, /^Report it/]) await page.getByRole('button', { name }).click();
    await page.getByRole('button', { name: /Hang up and report/ }).click();
  },
  async wrongAttempt(page) {
    await spotSigns(page);
    await page.getByRole('button', { name: /Pay ₹50,000 to clear her name/ }).click();
    return /Paying never clears a case/;
  },
};
