// Uses the existing chapter solvers; does not create accounts or save student data.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
let pw;
try { pw = require('playwright'); } catch { pw = require('/Users/dipeshkumar/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'); }
const root = path.resolve(__dirname, '..');
const dir = path.join(root, 'app/module/cyber/lessons/new/story/chapters');
const out = process.env.VISUAL_QA_OUTPUT || path.join(root, '.story-qa', 'refinement');
const base = process.env.BASE_URL || 'http://localhost:3200';
const slugs = process.argv.slice(2).length ? process.argv.slice(2) : fs.readdirSync(dir).filter(f => f.endsWith('.json') && f !== 'password-vault-builder.json').map(f => f.slice(0, -5));
fs.mkdirSync(out, { recursive: true });

(async () => {
  const browser = await pw.chromium.launch({ headless: true, channel: 'chrome', args: ['--autoplay-policy=no-user-gesture-required'] });
  const failures = [];
  try {
    for (const slug of slugs) for (const width of [1280, 390]) {
      const ctx = await browser.newContext({ viewport: { width, height: 1000 } });
      const page = await ctx.newPage();
      page.on('pageerror', e => failures.push(`${slug}: ${e.message}`));
      page.on('response', r => { if (r.status() >= 400) failures.push(`${slug}: HTTP ${r.status()} ${r.url()}`); });
      try {
        await page.goto(`${base}/module/cyber/${slug}?role=teacher`);
        const player = page.locator(`[data-story-player="${slug}"]`);
        await player.waitFor({ timeout: 20000 });
        await page.waitForLoadState('networkidle');
        const qa = require(path.join(dir, `${slug}.qa.cjs`));
        for (let scene = 0; scene < 6; scene++) {
          if (scene === 4) {
            await qa.solve(page);
            await page.waitForFunction(slug => document.querySelector(`[data-story-player="${slug}"]`)?.getAttribute('data-scene') === '4', slug);
          }
          else await page.getByRole('button', { name: new RegExp(`^Scene ${scene + 1}:`) }).click();
          await page.evaluate(() => document.querySelector('audio').pause());
          await page.waitForTimeout(400);
          assert.equal(await player.getAttribute('data-scene'), String(scene));
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `${slug}: ${width}px overflow`);
          await page.waitForFunction(slug => [...document.querySelectorAll(`[data-story-player="${slug}"] img`)].every(img => img.complete && img.naturalWidth > 0), slug, { timeout: 10000 });
          await player.screenshot({ path: path.join(out, `${slug}-${width}-scene${scene + 1}.png`) });
        }
        const runningLoops = await player.evaluate(el => [...el.querySelectorAll('*')].filter(x => ['', '::before', '::after'].some(pseudo => { const s = getComputedStyle(x, pseudo); return s.animationName !== 'none' && s.animationIterationCount.includes('infinite') && s.animationPlayState !== 'paused'; })).length);
        if (slug !== 'password-vault-builder') assert.equal(runningLoops, 0, `${slug}: animation keeps running while paused`);
        const staticContext = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
        const staticPage = await staticContext.newPage();
        await staticPage.goto(`${base}/module/cyber/${slug}?role=teacher`);
        const staticPlayer = staticPage.locator(`[data-story-player="${slug}"]`);
        await staticPlayer.waitFor();
        await page.waitForTimeout(500);
        try {
          assert.equal(await staticPlayer.locator('[data-character-mood] canvas').count(), 0, `${slug}: reduced motion character`);
          assert.equal(await staticPlayer.evaluate(el => [...el.querySelectorAll('*')].some(x => ['', '::before', '::after'].some(pseudo => getComputedStyle(x, pseudo).animationName !== 'none'))), false, `${slug}: reduced motion CSS`);
        } finally { await staticContext.close(); }
        console.log(`PASS ${slug} ${width}px: six scenes, task, images, pause, reduced motion`);
      } catch (e) { console.error(`FAIL ${slug} ${width}px: ${e.message}`); failures.push(`${slug} ${width}px: ${e.message}`); }
      finally { await ctx.close(); }
    }
  } finally { await browser.close(); }
  assert.deepEqual(failures, []);
  console.log(`ALL PASSED: ${slugs.length} chapters, ${slugs.length * 12} rendered scenes`);
})().catch(e => { console.error(e); process.exitCode = 1; });
