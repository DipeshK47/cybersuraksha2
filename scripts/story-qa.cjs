// Browser QA for one narrated story chapter.
// Usage (dev server on :3200, run outside the sandbox):
//   /Users/dipeshkumar/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node scripts/story-qa.cjs <lesson-slug>
// Needs app/module/cyber/lessons/new/story/chapters/<slug>.qa.cjs exporting
//   solve(page)            complete the mid-story task the way a learner would
//   wrongAttempt(page)?    try a tempting wrong answer; return a RegExp for the hint it should show
// Screenshots land in .story-qa/<slug>/ ; the process exits non-zero on any FAIL.
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
let playwright;
try { playwright = require('playwright'); } catch { playwright = require('/Users/dipeshkumar/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'); }

const slug = process.argv[2];
if (!slug) { console.error('usage: story-qa.cjs <lesson-slug>'); process.exit(2); }
const root = path.resolve(__dirname, '..');
const chapterDir = path.join(root, 'app/module/cyber/lessons/new/story/chapters');
const script = JSON.parse(fs.readFileSync(path.join(chapterDir, `${slug}.json`), 'utf8'));
const qa = require(path.join(chapterDir, `${slug}.qa.cjs`));
const { scenes } = script;
// This copy runs its dev server on :3200 so it never collides with other checkouts on :3000.
const URL = `http://localhost:${process.env.STORY_QA_PORT || 3200}/module/cyber/${slug}?role=teacher`;
const OUT = path.join(root, '.story-qa', slug);
fs.mkdirSync(OUT, { recursive: true });
const errors = [];
let fails = 0;
const check = (ok, msg) => { console.log((ok ? 'PASS ' : 'FAIL ') + msg); if (!ok) fails++; };
const player = p => p.locator(`[data-story-player="${slug}"]`);
const attr = (p, name) => player(p).getAttribute(name);
const scene = p => attr(p, 'data-scene');
const mood = p => p.locator('[data-character-mood]').getAttribute('data-character-mood');
const audio = p => p.evaluate(() => { const a = document.querySelector('audio'); return { paused: a.paused, t: a.currentTime, d: a.duration, muted: a.muted }; });
const overflow = p => p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
const tab = (p, i) => p.getByRole('button', { name: new RegExp(`^Scene ${i + 1}:`) });

async function open(browser, viewport, { blockAudio, ...opts } = {}) {
  const ctx = await browser.newContext({ viewport, ...opts });
  const p = await ctx.newPage();
  p.on('pageerror', e => errors.push(`${viewport.width}: ${e.message}`));
  // Failed responses are reported with their URL below, so skip the URL-less console copy of them.
  p.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text()) && !(blockAudio && /ERR_FAILED|story\.mp3/.test(m.text()))) errors.push(`${viewport.width}: ${m.text()}`); });
  p.on('response', r => { if (r.status() >= 400) errors.push(`${viewport.width}: HTTP ${r.status()} ${r.url()}`); });
  if (blockAudio) await p.route('**/story.mp3', r => r.abort());
  await p.goto(URL);
  const reset = p.getByRole('button', { name: 'Start over', exact: true });
  if (await reset.count()) await reset.click();
  await player(p).waitFor({ timeout: 20000 });
  return p;
}

(async () => {
  // Static checks: script shape, cue times, audio file, fallback frames.
  check(scenes.length === 6, `script has 6 scenes (has ${scenes.length})`);
  check(scenes.every((sc, i) => i === 0 ? sc.start === 0 : sc.start > scenes[i - 1].start + scenes[i - 1].duration - 0.01), 'cue times increase and do not overlap');
  check(scenes.every(sc => sc.caption && sc.dialogue && sc.status && sc.label && sc.title), 'every scene has caption, dialogue, status, label and title');
  const mp3 = path.join(root, 'public/audio/cyber', slug, 'story.mp3');
  check(fs.existsSync(mp3), 'narration file exists');
  let mp3Duration = 0;
  try { mp3Duration = Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp3]).toString()); } catch { /* reported below */ }
  check(Math.abs(mp3Duration - script.duration) < 0.4, `audio length ${mp3Duration.toFixed(2)}s matches script ${script.duration}s`);

  // STORY_QA_CHANNEL= (empty) uses Playwright's bundled Chromium, e.g. on machines without Google Chrome.
  const channel = process.env.STORY_QA_CHANNEL ?? 'chrome';
  const b = await playwright.chromium.launch({ headless: true, ...(channel ? { channel } : {}), args: ['--autoplay-policy=no-user-gesture-required'] });
  let gate = 3;

  // 1. Every scene on desktop and phone, no overflow, character loads, moods follow the script.
  for (const [name, viewport] of [['desktop', { width: 1280, height: 1000 }], ['mobile', { width: 390, height: 844 }]]) {
    const p = await open(b, viewport);
    gate = Number(await attr(p, 'data-gate'));
    await p.waitForTimeout(1500);
    for (let i = 0; i < 6; i++) {
      if (i === gate + 1) { await qa.solve(p); await p.waitForTimeout(400); await p.evaluate(() => document.querySelector('audio').pause()); }
      else { await tab(p, i).click(); await p.waitForTimeout(250); await p.evaluate(() => document.querySelector('audio').pause()); }
      await p.waitForTimeout(700);
      check(await scene(p) === String(i), `${name} scene ${i + 1} shows`);
      check(!(await overflow(p)), `${name} scene ${i + 1} has no horizontal overflow`);
      if (i !== gate) check(await mood(p) === scenes[i].mood, `${name} scene ${i + 1} mood is ${scenes[i].mood} (got ${await mood(p)})`);
      await player(p).screenshot({ path: path.join(OUT, `${name}-scene${i + 1}.png`) });
    }
    check(await p.locator('[data-rive-loaded="true"]').count() === 1, `${name} Rive character loaded`);
    const finalButton = player(p).locator('footer button').nth(1);
    await finalButton.click();
    await p.locator(`[data-new-mission="${slug}"]`).waitFor({ timeout: 10000 }).then(() => check(true, `${name} final button opens practice`), () => check(false, `${name} final button opens practice`));
    await p.context().close();
  }

  // 2. Narration drives the story, pauses at the task, resumes after it is solved.
  {
    const p = await open(b, { width: 1280, height: 1000 });
    await p.getByRole('button', { name: 'Play story' }).click();
    await p.waitForTimeout(1200);
    check(await attr(p, 'data-playing') === 'true', 'narration plays from the Play button');
    for (let i = 0; i < 6; i++) {
      if (i > gate) break;
      await p.evaluate(t => { document.querySelector('audio').currentTime = t; }, scenes[i].start + 0.3);
      await p.waitForTimeout(600);
      check(await scene(p) === String(i), `audio at ${(scenes[i].start + 0.3).toFixed(1)}s shows scene ${i + 1}`);
      if (scenes[i].flash) {
        check(await mood(p) === scenes[i].flash.mood, `scene ${i + 1} opens with a ${scenes[i].flash.mood} flash`);
        await p.waitForTimeout(scenes[i].flash.seconds * 1000 + 300);
        check(await mood(p) === scenes[i].mood, `scene ${i + 1} settles to ${scenes[i].mood}`);
      }
    }
    await p.evaluate(t => { document.querySelector('audio').currentTime = t; }, scenes[gate + 1].start - 1);
    await p.waitForTimeout(2500);
    check(await scene(p) === String(gate), `story holds on scene ${gate + 1} until the task is done`);
    check(await attr(p, 'data-waiting') === 'true', 'waiting state shown');
    check(await p.getByRole('button', { name: 'Play story' }).isDisabled(), 'Play is disabled while waiting');
    check(await player(p).locator('footer button').nth(1).isDisabled(), 'Next scene is disabled until the task is done');
    await tab(p, gate + 1).click();
    await p.waitForTimeout(400);
    check(await scene(p) === String(gate), 'scene tabs cannot skip past the task');
    await player(p).screenshot({ path: path.join(OUT, 'desktop-waiting.png') });
    if (qa.wrongAttempt) {
      const expected = await qa.wrongAttempt(p);
      await p.waitForTimeout(300);
      check(await player(p).getByText(expected).count() > 0, `wrong answer gets a helpful hint (${expected})`);
      check(await attr(p, 'data-solved') === 'false', 'wrong answer does not solve the task');
      await player(p).screenshot({ path: path.join(OUT, 'desktop-wrong.png') });
    }
    await qa.solve(p);
    await p.waitForTimeout(1200);
    check(await attr(p, 'data-solved') === 'true', 'solving the task marks it solved');
    check(await scene(p) === String(gate + 1) && await attr(p, 'data-playing') === 'true', 'narration resumes into the next scene');
    await p.evaluate(() => { const a = document.querySelector('audio'); a.currentTime = a.duration - 1; });
    await p.waitForTimeout(2500);
    check(await p.getByRole('button', { name: 'Replay story' }).count() === 1 && await scene(p) === '5', 'story ends on scene 6 with Replay');
    await p.getByRole('button', { name: 'Turn sound off' }).click();
    check((await audio(p)).muted, 'mute button mutes narration');
    await p.context().close();
  }

  // 3. Scene buttons narrate too, and a quick pause never disables audio.
  {
    const p = await open(b, { width: 1280, height: 1000 });
    await p.waitForTimeout(1000);
    await p.getByRole('button', { name: 'Next scene' }).click();
    await p.waitForTimeout(2000);
    const a = await audio(p);
    check(await scene(p) === '1' && !a.paused && a.t > scenes[1].start, `Next scene plays that scene's narration (audio at ${a.t.toFixed(1)}s)`);
    await tab(p, 2).click();
    await p.waitForTimeout(1500);
    const c = await audio(p);
    check(await scene(p) === '2' && !c.paused && c.t >= scenes[2].start && c.t < scenes[2].start + 2.5, `scene tabs play from that scene (audio at ${c.t.toFixed(1)}s)`);
    await p.getByRole('button', { name: 'Pause story' }).click();
    check((await audio(p)).paused, 'Pause story pauses narration');
    await p.evaluate(() => { const [next] = [...document.querySelectorAll('button')].filter(x => x.textContent.includes('Next scene')); next.click(); document.querySelector('audio').pause(); });
    await p.waitForTimeout(500);
    check(await p.getByText('Audio couldn’t load').count() === 0, 'a quick pause does not disable narration');
    await p.context().close();
  }

  // 4. Sound can't load: captions and Next scene still carry the story.
  {
    const p = await open(b, { width: 390, height: 844 }, { blockAudio: true });
    await p.waitForTimeout(1500);
    check(await p.getByText('Audio couldn’t load').count() === 1, 'audio failure message shown');
    await p.getByRole('button', { name: 'Next scene' }).click();
    check(await scene(p) === '1', 'Next scene works without audio');
    await p.context().close();
  }

  // 5. Reduced motion: static frames only, and every mood the story uses has a frame.
  {
    const p = await open(b, { width: 1280, height: 1000 }, { reducedMotion: 'reduce' });
    await p.waitForTimeout(800);
    check(await p.locator('[data-character-mood] canvas').count() === 0 && await p.locator('[data-character-mood] img:not([hidden])').count() === 1, 'reduced motion uses a static frame');
    const src = await p.locator('[data-character-mood] img').getAttribute('src');
    const dir = src.slice(0, src.lastIndexOf('/'));
    const moods = new Set(scenes.flatMap(sc => [sc.mood, sc.flash?.mood].filter(Boolean)).concat(['happy']));
    for (const m of moods) check(fs.existsSync(path.join(root, 'public', dir, `${m}.png`)), `fallback frame exists for mood "${m}"`);
    await p.context().close();
  }

  await b.close();
  // Two contact sheets (cheaper to review than 14 separate screenshots).
  try {
    execFileSync(process.env.PYTHON || (fs.existsSync('/Users/dipeshkumar/miniforge3/bin/python') ? '/Users/dipeshkumar/miniforge3/bin/python' : 'python3'), ['-c', `
import sys, os
from PIL import Image
out = sys.argv[1]
def sheet(names, cols, width, dest):
    ims = [Image.open(os.path.join(out, n)).convert('RGB') for n in names if os.path.exists(os.path.join(out, n))]
    ims = [im.resize((width, int(im.height * width / im.width))) for im in ims]
    rows = [ims[i:i + cols] for i in range(0, len(ims), cols)]
    H = sum(max(im.height for im in r) for r in rows) + 10 * (len(rows) + 1)
    S = Image.new('RGB', (cols * width + 10 * (cols + 1), H), (230, 230, 225))
    y = 10
    for r in rows:
        for c, im in enumerate(r): S.paste(im, (10 + c * (width + 10), y))
        y += max(im.height for im in r) + 10
    S.save(os.path.join(out, dest))
sheet([f'desktop-scene{i}.png' for i in range(1, 7)] + ['desktop-waiting.png', 'desktop-wrong.png'], 2, 760, 'sheet-desktop.png')
sheet([f'mobile-scene{i}.png' for i in range(1, 7)], 6, 300, 'sheet-mobile.png')
`, OUT]);
    console.log('contact sheets: sheet-desktop.png (scenes 1–6, waiting, wrong) and sheet-mobile.png');
  } catch (e) { console.log('contact sheets skipped:', e.message); }
  const unique = [...new Set(errors)];
  check(unique.length === 0, `no console/page errors${unique.length ? ':\n  ' + unique.join('\n  ') : ''}`);
  console.log(`\n${fails ? 'FAILED' : 'ALL PASSED'} · screenshots in .story-qa/${slug}/`);
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error('CRASH', e.stack || e.message); process.exit(1); });
