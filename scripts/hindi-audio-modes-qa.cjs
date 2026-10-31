// Run against a local dev/demo server: BASE_URL=http://localhost:3000 node scripts/hindi-audio-modes-qa.cjs
// Checks the three language modes (English, हिन्दी, English + हिन्दी ऑडियो) against real story pages.
const assert = require('node:assert/strict');
const playwright = require('playwright');
const manifest = require('../app/module/cyber/lessons/new/story/hindi-audio.generated.json');
const base = process.env.BASE_URL || 'http://localhost:3000';
const lesson = 'class6-private-information';
const hindi = manifest[lesson];
const errors = [];

const url = (slug, grade) => `${base}/module/cyber/${slug}?grade=${grade}&role=teacher`;
const hasDevanagari = text => /[ऀ-ॿ]/.test(text);

async function audioSrc(page) {
  await page.waitForFunction(() => document.querySelector('[data-story-player] audio')?.readyState >= 1);
  return page.locator('[data-story-player] audio').evaluate(audio => new URL(audio.currentSrc).pathname);
}
async function expectSrc(page, expected, message) {
  await page.waitForFunction(expected => {
    const audio = document.querySelector('[data-story-player] audio');
    return audio?.readyState >= 1 && new URL(audio.currentSrc).pathname === expected;
  }, expected, { timeout: 30000 }).catch(() => {});
  assert.equal(await audioSrc(page), expected, message);
}
const pick = (page, name) => page.getByRole('button', { name, exact: typeof name === 'string' });
const split = page => page.getByRole('button', { name: /^English \+ हिन्दी ऑडियो/ });
const heading = page => page.locator('[data-story-player] h1').innerText();
const stored = (page, key) => page.evaluate(key => localStorage.getItem(key), key);
const htmlLang = page => page.locator('html').getAttribute('lang');

async function main() {
  const browser = await playwright.chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
  const login = await context.request.post(`${base}/api/auth/teacher`, { data: { email: 'teacher@dpsrkp.edu.in', password: 'Teacher@123' } });
  assert.ok(login.ok(), `teacher login ${login.status()}`);
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));

  // 1. Default: English text, English audio.
  await page.goto(url(lesson, 6), { waitUntil: 'networkidle' });
  await expectSrc(page, `/audio/cyber/${lesson}/story.mp3`, 'English by default');
  assert.equal(await htmlLang(page), 'en');
  const englishTitle = await heading(page);
  assert.ok(!hasDevanagari(englishTitle), englishTitle);
  console.log('PASS default is English text with English audio');

  // 2. English text + Hindi audio.
  await split(page).click();
  await expectSrc(page, hindi.src, 'Hindi audio with English text');
  assert.equal(await htmlLang(page), 'en', 'text stays English');
  assert.equal(await page.locator('html').getAttribute('data-audio-language'), 'hi');
  assert.equal(await heading(page), englishTitle, 'caption heading stays English');
  assert.equal(await split(page).getAttribute('aria-pressed'), 'true');
  assert.equal(await pick(page, 'English').getAttribute('aria-pressed'), 'false');
  assert.ok(Math.abs(await page.locator('audio').evaluate(audio => audio.duration) - hindi.duration) < 0.15, 'Hindi track length');
  assert.equal(await stored(page, 'cybersuraksha-language'), 'en');
  assert.equal(await stored(page, 'cybersuraksha-audio-language'), 'hi');
  console.log('PASS English text + हिन्दी ऑडियो swaps the track and leaves the text alone');

  // 3. Scene buttons seek to the Hindi cues, not the English ones.
  const root = page.locator('[data-story-player]');
  await root.getByRole('button', { name: 'Play story', exact: true }).click();
  await page.waitForFunction(() => document.querySelector('audio').currentTime > 0.3 && !document.querySelector('audio').paused);
  for (const index of [1, 2, 3]) {
    await root.locator('nav button').nth(index).click();
    await page.waitForFunction(index => document.querySelector('[data-story-player]').dataset.scene === String(index), index);
    const at = await page.locator('audio').evaluate(audio => audio.currentTime);
    assert.ok(Math.abs(at - hindi.scenes[index].start) < 0.8, `scene ${index + 1}: ${at} vs ${hindi.scenes[index].start}`);
  }
  console.log('PASS scene buttons seek to the Hindi cues');

  // 4. The choice survives a reload.
  await page.goto(url(lesson, 6), { waitUntil: 'networkidle' });
  await expectSrc(page, hindi.src, 'mode restored after reload');
  assert.equal(await htmlLang(page), 'en');
  assert.equal(await split(page).getAttribute('aria-pressed'), 'true');
  console.log('PASS the mode is remembered after reload');

  // 5. हिन्दी: text and audio both Hindi.
  await pick(page, 'हिन्दी').click();
  await page.waitForFunction(() => document.documentElement.lang === 'hi');
  await expectSrc(page, hindi.src, 'Hindi audio with Hindi text');
  await page.waitForFunction(() => /[ऀ-ॿ]/.test(document.querySelector('[data-story-player] h1').textContent));
  assert.equal(await stored(page, 'cybersuraksha-audio-language'), null, 'Hindi mode clears the split setting');
  console.log('PASS हिन्दी changes text and audio together');

  // 6. Back to English: both revert.
  await pick(page, 'English').click();
  await page.waitForFunction(() => document.documentElement.lang === 'en');
  await expectSrc(page, `/audio/cyber/${lesson}/story.mp3`, 'English audio again');
  assert.ok(!hasDevanagari(await heading(page)));
  assert.equal(await page.locator('html').getAttribute('data-audio-language'), 'en');
  console.log('PASS English changes text and audio back');

  // 7. A lesson with no Hindi recording keeps its English audio in the split mode.
  const missing = 'class9-private-information';
  assert.ok(!(missing in manifest));
  await split(page).click();
  await page.goto(url('class9-ai-language-context', 9), { waitUntil: 'networkidle' });
  assert.ok(!('class9-ai-language-context' in manifest));
  await expectSrc(page, '/audio/cyber/class9-ai-language-context/story.mp3', 'English fallback where Hindi audio is missing');
  console.log('PASS lessons without Hindi audio keep English audio');

  // 8. A chapter that carries its own hindiAudio still works in the split mode.
  await page.goto(url('your-digital-risk-map', 11), { waitUntil: 'networkidle' });
  await expectSrc(page, '/audio/cyber/your-digital-risk-map/story-hi.mp3', 'Class 11 Hindi recording in split mode');
  console.log('PASS the existing Class 11 Hindi recording follows the same mode');

  // 8b. A Class 12 chapter recorded with all six scenes (no English fallback scene).
  const senior = 'ai-go-revise-stop-review';
  assert.equal(manifest[senior].scenes.length, 6);
  await page.goto(url(senior, 12), { waitUntil: 'networkidle' });
  await expectSrc(page, manifest[senior].src, 'Class 12 chapter plays its Hindi track in split mode');
  assert.equal(await htmlLang(page), 'en');
  console.log('PASS a Class 12 chapter follows the same mode');

  // 9. Phone layout: the three-way control fits without sideways scrolling.
  const phone = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await phone.addCookies(await context.cookies());
  const small = await phone.newPage();
  small.on('pageerror', error => errors.push(error.message));
  await small.goto(url(lesson, 6), { waitUntil: 'networkidle' });
  await split(small).click();
  await expectSrc(small, hindi.src, 'phone: Hindi audio');
  const box = await split(small).boundingBox();
  assert.ok(box.x >= 0 && box.x + box.width <= 390, `split button inside viewport: ${JSON.stringify(box)}`);
  assert.ok(await small.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), 'no horizontal scroll at 390px');
  console.log('PASS phone layout');

  assert.deepEqual(errors, []);
  await browser.close();
  console.log('PASS no browser exceptions');
}
main().catch(error => { console.error(error); process.exit(1); });
