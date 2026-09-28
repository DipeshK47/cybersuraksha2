// QA hooks for scripts/story-qa.cjs: how a learner completes Kabir's sorting race.
// solve() also runs after wrongAttempt(), so it only races the lists that have not been raced yet.
const races = [[/^8 results/, 'Predict bubble sort'], [/^100 results/, 'Predict merge sort'], [/^2,000 results/, 'Predict merge sort']];
async function raceAll(page, guessFor) {
  for (const [list, guess] of races) {
    await page.getByRole('button', { name: list }).click();
    const predict = page.getByRole('button', { name: guessFor(guess) });
    if (await predict.isEnabled()) { await predict.click(); await page.getByRole('button', { name: /Run race/ }).click(); }
  }
}
module.exports = {
  async solve(page) {
    await raceAll(page, guess => guess);
    await page.getByRole('button', { name: /far fewer comparisons/ }).click();
  },
  async wrongAttempt(page) {
    await raceAll(page, () => 'Predict merge sort'); // "bubble is always slower"
    await page.getByRole('button', { name: /won the 8-item race/ }).click();
    return /about 2 million comparisons/;
  },
};
