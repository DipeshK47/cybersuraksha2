// QA hooks for scripts/story-qa.cjs: how a learner answers Tara and Nani's two pretend calls.
module.exports = {
  async solve(page) {
    await page.getByRole('button', { name: /call the number on the card/ }).click();
    await page.getByRole('button', { name: /call the number on the electricity bill/ }).click();
    await page.getByRole('button', { name: /Check with official numbers/ }).click();
  },
  async wrongAttempt(page) {
    await page.getByRole('button', { name: 'Share the OTP to verify', exact: true }).click();
    return /private key code/;
  },
};
