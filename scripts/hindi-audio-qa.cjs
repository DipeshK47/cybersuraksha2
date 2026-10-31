// Run against the local demo server: node scripts/hindi-audio-qa.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
let playwright;
try { playwright = require('playwright'); } catch { playwright = require('/Users/dipeshkumar/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'); }
const script = require('../app/module/cyber/lessons/new/story/chapters/your-digital-risk-map.json');
const catalogue = require('../public/locales/hi.json');
const overrides = require('../app/lib/i18n/hi-overrides.json');
const t = text => overrides[text] || catalogue.messages[text] || text;
const base = process.env.BASE_URL || 'http://localhost:3000';
const target = `${base}/module/cyber/your-digital-risk-map?grade=11&role=teacher`;
const output = path.resolve('.story-qa/hindi-audio');
fs.mkdirSync(output, { recursive: true });
const errors = [];

async function ready(page, hindi) {
  await page.waitForFunction(hindi => {
    const audio = document.querySelector('[data-story-player] audio');
    return audio?.readyState >= 1 && audio.currentSrc.endsWith(hindi ? '/story-hi.mp3' : '/story.mp3');
  }, hindi);
}
async function scene(page, index) {
  await page.waitForFunction(index => document.querySelector('[data-story-player]')?.dataset.scene === String(index), index);
}
async function position(page, expected) {
  assert.ok(Math.abs(await page.locator('audio').evaluate(audio => audio.currentTime) - expected) < 0.8, `seek to ${expected}`);
}
async function checks(browser, width) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
  // Lesson pages need a session; the local demo school's teacher account is seeded in development.
  const login = await context.request.post(`${base}/api/auth/teacher`, { data: { email: process.env.QA_TEACHER_EMAIL || 'teacher@dpsrkp.edu.in', password: process.env.QA_TEACHER_PASSWORD || 'Teacher@123' } });
  assert.ok(login.ok(), `teacher login ${login.status()}`);
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(target, { waitUntil: 'networkidle' });
  await ready(page, false);
  const root = page.locator('[data-story-player]');
  await page.getByRole('button', { name: 'हिन्दी', exact: true }).click();
  await ready(page, true);
  assert.ok(Math.abs(await page.locator('audio').evaluate(audio => audio.duration) - script.hindiAudio.duration) < 0.1);
  assert.match(await root.locator('h1').innerText(), /[\u0900-\u097f]/);
  await root.getByRole('button', { name: t('Play story'), exact: true }).click();
  await page.waitForFunction(() => document.querySelector('audio').currentTime > 0.3 && !document.querySelector('audio').paused);
  for (let index = 1; index <= 3; index++) {
    await root.locator('nav button').nth(index).click();
    await scene(page, index);
    await position(page, script.hindiAudio.scenes[index].start);
  }
  // Later scenes remain locked until the learner solves the decision.
  await root.locator('nav button').nth(5).click();
  await scene(page, 3);
  await position(page, script.hindiAudio.scenes[3].start);
  await page.locator('audio').evaluate((audio, boundary) => { audio.currentTime = boundary - 0.2; }, script.hindiAudio.scenes[4].start);
  await page.waitForFunction(() => document.querySelector('[data-story-player]').dataset.waiting === 'true');
  assert.equal(await page.locator('audio').evaluate(audio => audio.paused), true);
  await scene(page, 3);
  await root.getByRole('button', { name: t('Anyone-with-link sharing'), exact: true }).click();
  await root.getByRole('button', { name: t('Test my decision'), exact: true }).click();
  await scene(page, 4);
  await page.waitForFunction(() => !document.querySelector('audio').paused);
  await position(page, script.hindiAudio.scenes[4].start);
  // Language changes retain the solved decision, scene and mute setting, and pause playback.
  await root.getByRole('button', { name: t('Turn sound off'), exact: true }).click();
  await page.getByRole('button', { name: 'English', exact: true }).click();
  await ready(page, false);
  await scene(page, 4);
  await position(page, script.scenes[4].start);
  assert.equal(await root.getAttribute('data-solved'), 'true');
  assert.deepEqual(await page.locator('audio').evaluate(audio => [audio.paused, audio.muted]), [true, true]);
  await root.getByRole('button', { name: 'Play story', exact: true }).click();
  await page.waitForFunction(() => !document.querySelector('audio').paused);
  await page.getByRole('button', { name: 'हिन्दी', exact: true }).click();
  await ready(page, true);
  await scene(page, 4);
  await position(page, script.hindiAudio.scenes[4].start);
  assert.equal(await root.getAttribute('data-solved'), 'true');
  assert.deepEqual(await page.locator('audio').evaluate(audio => [audio.paused, audio.muted]), [true, true]);
  await root.locator('nav button').nth(5).click();
  await scene(page, 5);
  await position(page, script.hindiAudio.scenes[5].start);
  await page.locator('audio').evaluate((audio, end) => { audio.currentTime = end - 0.2; }, script.hindiAudio.duration);
  await root.getByRole('button', { name: t('Replay story'), exact: true }).waitFor();
  await root.getByRole('button', { name: t('Replay story'), exact: true }).click();
  await scene(page, 0);
  await page.waitForFunction(() => !document.querySelector('audio').paused);
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
  await page.screenshot({ path: path.join(output, `${width}.png`), fullPage: true });
  await page.reload({ waitUntil: 'networkidle' });
  await ready(page, true);
  assert.equal(await page.locator('audio').evaluate(audio => audio.paused), true);
  // Unchanged chapters continue to use their existing narration in Hindi text mode.
  await page.goto(`${base}/module/cyber/identity-beyond-a-password?grade=11`, { waitUntil: 'networkidle' });
  await ready(page, false);
  assert.equal(await page.locator('html').getAttribute('lang'), 'hi');
  await context.close();
  console.log(`PASS ${width}px: six Hindi sections, navigation, decision gate/resume, language switching, mute, ending/replay, reload and other-chapter fallback`);
}

(async () => {
  assert.equal(script.hindiAudio.scenes.length, script.scenes.length);
  for (const [index, cue] of script.hindiAudio.scenes.entries()) {
    assert.ok(cue.duration > 0);
    const end = cue.start + cue.duration;
    assert.ok(end <= script.hindiAudio.duration);
    if (index) assert.ok(Math.abs(cue.start - script.hindiAudio.scenes[index - 1].start - script.hindiAudio.scenes[index - 1].duration - 0.65) < 0.001);
  }
  assert.ok(fs.statSync(path.join('public', script.hindiAudio.src)).size > 100000);
  const browser = await playwright.chromium.launch({ channel: 'chrome', headless: true });
  try {
    await checks(browser, 1280);
    await checks(browser, 390);
    const context = await browser.newContext();
    const login = await context.request.post(`${base}/api/auth/teacher`, { data: { email: process.env.QA_TEACHER_EMAIL || 'teacher@dpsrkp.edu.in', password: process.env.QA_TEACHER_PASSWORD || 'Teacher@123' } });
    assert.ok(login.ok(), `teacher login ${login.status()}`);
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/story-hi.mp3', route => route.abort());
    await page.goto(target, { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'हिन्दी', exact: true }).click();
    await page.getByText(t('Audio couldn’t load. Read the captions and use Next scene.'), { exact: true }).waitFor();
    await page.getByRole('button', { name: 'English', exact: true }).click();
    await ready(page, false);
    await page.getByRole('button', { name: 'Play story', exact: true }).click();
    await page.waitForFunction(() => !document.querySelector('audio').paused);
    console.log('PASS missing Hindi audio: captions stay usable and switching to English restores playback');
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
