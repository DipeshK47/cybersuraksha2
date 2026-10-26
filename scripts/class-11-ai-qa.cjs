// Use a disposable demo server (CYBERSURAKSHA_EPHEMERAL_WORKERS=1).
// BASE_URL=http://localhost:3000 node scripts/class-11-ai-qa.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
let playwright;
try { playwright = require('playwright'); } catch { playwright = require('/Users/dipeshkumar/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'); }
const base = process.env.BASE_URL || 'http://localhost:3000';
const out = path.resolve('.story-qa/class-11-ai');
fs.mkdirSync(out, { recursive: true });
async function match(root, rows) { for (const row of rows) await root.getByRole('combobox', { name: row.label, exact: true }).selectOption(row.answer); await root.getByRole('button', { name: 'Check my map', exact: true }).click(); }
async function choose(root, text) { await root.getByRole('button', { name: text, exact: true }).click(); await root.getByRole('button', { name: 'Check decision', exact: true }).click(); }
async function checklist(root, controls) { for (const control of controls.filter(control => control.good)) await root.getByRole('checkbox', { name: control.label, exact: true }).check(); await root.getByRole('button', { name: 'Test protection', exact: true }).click(); }
async function solve(root, index, stage, c) {
  if (index === 0) {
    if (stage === 0) return match(root, c.approachTasks);
    if (stage === 2) return choose(root, 'Ask the organising teacher through the known school route; mark the answer as unestablished');
    await root.getByRole('button', { name: 'Run bill rule', exact: true }).click();
    await root.getByRole('spinbutton', { name: 'Total for exactly 3 tickets (₹)', exact: true }).fill('60');
    await root.getByRole('combobox', { name: 'Why use this approach?', exact: true }).selectOption('rule');
    return root.getByRole('button', { name: 'Save approach evidence', exact: true }).click();
  }
  if (index === 1) {
    if (stage === 0) return match(root, c.briefFields);
    if (stage === 1) return match(root, c.reviewRoutes);
    await root.getByRole('combobox', { name: 'Evaluation pack', exact: true }).selectOption('fixed');
    await root.getByRole('spinbutton', { name: 'Minimum correct predictions', exact: true }).fill('9');
    await root.getByRole('combobox', { name: 'Unfamiliar sample', exact: true }).selectOption('review');
    return root.getByRole('button', { name: 'Save acceptance criterion', exact: true }).click();
  }
  if (index === 2) {
    if (stage === 0) { for (const row of c.repairRows) await root.getByRole('combobox', { name: `Repair ${row.id}`, exact: true }).selectOption(row.answer); return root.getByRole('button', { name: 'Record dataset repairs', exact: true }).click(); }
    if (stage === 1) return match(root, c.duplicateRows);
    return choose(root, 'State the bright-only limitation and collect separate varied examples with a fresh evaluation pack');
  }
  if (index === 3) {
    if (stage === 0) return match(root, c.learningMethods);
    if (stage === 2) return choose(root, 'Use new training examples separately and reserve a fresh held-out check before claiming an improvement');
    assert.equal(await root.getByRole('button', { name: 'Reveal held-out labels', exact: true }).isDisabled(), true);
    assert.equal(await root.locator('tbody tr').filter({ hasText: 'Hidden' }).count(), 3);
    const row = root.locator('tbody tr').filter({ hasText: 'T2' });
    assert.ok((await row.innerText()).includes('Paper'), 'paper-only training predicts Paper for T2');
    await root.getByRole('checkbox', { name: 'M1 · Metal Features (8, 7)', exact: true }).check();
    await root.getByRole('checkbox', { name: 'M2 · Metal Features (9, 8)', exact: true }).check();
    assert.ok((await row.innerText()).includes('Metal'), 'adding Metal examples changes the prediction');
    await root.getByRole('button', { name: 'Commit predictions', exact: true }).click();
    assert.equal(await root.getByRole('checkbox').first().isDisabled(), true);
    await root.getByRole('button', { name: 'Reveal held-out labels', exact: true }).click();
    assert.equal(await root.locator('tbody tr').filter({ hasText: 'Hidden' }).count(), 0);
    await root.getByRole('combobox', { name: 'Interpret the tied T3 result', exact: true }).selectOption('review');
    return root.getByRole('button', { name: 'Save learning record', exact: true }).click();
  }
  if (index === 4) {
    if (stage === 0) { await root.getByRole('spinbutton', { name: 'Correct model predictions (out of 8)', exact: true }).fill('6'); await root.getByRole('spinbutton', { name: 'Correct baseline predictions (out of 8)', exact: true }).fill('5'); return root.getByRole('button', { name: 'Check counts', exact: true }).click(); }
    if (stage === 1) { for (const id of ['E3', 'E8']) await root.getByRole('checkbox', { name: id, exact: true }).check(); return root.getByRole('button', { name: 'Record missed cases', exact: true }).click(); }
    return choose(root, 'The model got 6/8 correct versus baseline 5/8 on this pack; a larger representative evaluation is still needed');
  }
  if (index === 5) {
    if (stage === 0) { await root.getByRole('spinbutton', { name: 'Bright errors (out of 8)', exact: true }).fill('1'); await root.getByRole('spinbutton', { name: 'Dim errors (out of 8)', exact: true }).fill('5'); return root.getByRole('button', { name: 'Compare group errors', exact: true }).click(); }
    if (stage === 1) return choose(root, 'The background may be an irrelevant proxy; repeat controlled checks before claiming a cause');
    return choose(root, 'Collect varied bright and dim examples separately, keep a fresh evaluation pack and request review for unsupported conditions');
  }
  if (index === 6) {
    if (stage === 0) return match(root, c.assistantClaims);
    if (stage === 1) return checklist(root, c.instructionControls);
    for (const [name, value] of [['Meeting sentence', 'F1'], ['Glass sentence', 'F2'], ['Waste-reduction statistic', 'F3']]) await root.getByRole('combobox', { name, exact: true }).selectOption(value);
    return root.getByRole('button', { name: 'Save corrected response', exact: true }).click();
  }
  if (stage === 0) return checklist(root, c.dossierControls);
  if (stage === 1) return choose(root, 'Revise coverage and human review, preserve the results and independently evaluate again');
  await root.getByRole('combobox', { name: 'Changed-condition decision', exact: true }).selectOption('pause');
  await root.getByRole('combobox', { name: 'My assistance disclosure', exact: true }).selectOption('lab');
  return root.getByRole('button', { name: 'Defend evaluation decision', exact: true }).click();
}
async function wrong(root, index, c) {
  if ([0, 1, 3, 6].includes(index)) {
    const rows = [c.approachTasks, c.briefFields, null, c.learningMethods, null, null, c.assistantClaims][index];
    for (const row of rows) await root.getByRole('combobox', { name: row.label, exact: true }).selectOption(rows[0].answer);
    await root.getByRole('button', { name: 'Check my map', exact: true }).click();
  } else if (index === 2) {
    for (const row of c.repairRows) await root.getByRole('combobox', { name: `Repair ${row.id}`, exact: true }).selectOption('Paper');
    await root.getByRole('button', { name: 'Record dataset repairs', exact: true }).click();
  } else if ([4, 5].includes(index)) {
    for (const field of await root.getByRole('spinbutton').all()) await field.fill('0');
    await root.getByRole('button', { name: index === 4 ? 'Check counts' : 'Compare group errors', exact: true }).click();
  } else {
    for (const control of c.dossierControls) await root.getByRole('checkbox', { name: control.label, exact: true }).check();
    await root.getByRole('button', { name: 'Test protection', exact: true }).click();
    await root.getByRole('checkbox', { name: c.dossierControls.at(-1).label, exact: true }).uncheck();
  }
  assert.equal(await root.getAttribute('data-ready'), 'false');
  assert.ok(await root.locator('[data-result="retry"]').count());
}
async function noOverflow(page, label) { assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, label); }

(async () => {
  const c = await import('../app/module/cyber/lessons/senior/ai-content.ts');
  const { CLASS11_AI_SLUGS: slugs } = await import('../app/data/class-11-missions.ts');
  const errors = [];
  const browser = await playwright.chromium.launch({ channel: 'chrome', headless: true, args: ['--autoplay-policy=no-user-gesture-required'] });
  try {
    for (const [device, viewport] of [['desktop', { width: 1280, height: 1000 }], ['phone', { width: 390, height: 844 }]]) {
      const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
      const page = await context.newPage();
      page.on('pageerror', error => errors.push(`${device}: ${error.message}`));
      page.on('response', response => { if (response.status() >= 400) errors.push(`${device}: HTTP ${response.status()} ${response.url()}`); });
      await page.goto(`${base}/grade/11/artificial-intelligence`);
      assert.equal(await page.locator('a.moduleNameCardPlayable').count(), 8);
      await page.screenshot({ path: path.join(out, `${device}-library.png`), fullPage: true });
      for (const [index, slug] of slugs.entries()) {
        const script = JSON.parse(fs.readFileSync(path.resolve(`app/module/cyber/lessons/new/story/chapters/${slug}.json`), 'utf8'));
        const audioFile = path.resolve(`public/audio/cyber/${slug}/story.mp3`);
        const duration = Number(execFileSync('/opt/homebrew/bin/ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', audioFile]).toString());
        assert.ok(Math.abs(duration - script.duration) < .4, `${slug} narration matches timing`);
        await page.goto(`${base}/module/cyber/${slug}?grade=11`);
        const player = page.locator(`[data-story-player="${slug}"]`);
        await player.waitFor();
        await player.locator('img[src^="/cyber-missions/class-11/"]').evaluate(image => image.decode());
        await noOverflow(page, `${device} ${slug} story overflow`);
        await player.screenshot({ path: path.join(out, `${device}-${slug}-story.png`) });
        await page.getByRole('button', { name: 'Scene 4: Your decision', exact: true }).click();
        await page.locator('audio').evaluate(audio => audio.pause());
        const task = c.aiStoryTasks[index];
        await player.getByRole('button', { name: task.choices[(task.answer + 1) % 3], exact: true }).click();
        await player.getByRole('button', { name: 'Test my decision', exact: true }).click();
        assert.equal(await player.getAttribute('data-solved'), 'false');
        assert.ok((await player.getByRole('status').innerText()).length > 20);
        await player.getByRole('button', { name: task.choices[task.answer], exact: true }).click();
        await player.getByRole('button', { name: 'Test my decision', exact: true }).click();
        await page.locator(`[data-story-player="${slug}"][data-solved="true"]`).waitFor();
        await page.getByRole('button', { name: 'Scene 6: Enter the lab', exact: true }).click();
        await page.locator('audio').evaluate(audio => audio.pause());
        await page.getByRole('button', { name: 'Enter the AI lab', exact: true }).click();
        for (let stage = 0; stage < 3; stage++) {
          const root = page.locator(`[data-new-mission="${slug}"][data-stage="${stage}"]`);
          await root.waitFor();
          if (stage === 0) await wrong(root, index, c);
          await solve(root, index, stage, c);
          await page.locator(`[data-new-mission="${slug}"][data-ready="true"]`).waitFor();
          await noOverflow(page, `${device} ${slug} practice ${stage + 1} overflow`);
          if (stage === 1) await root.screenshot({ path: path.join(out, `${device}-${slug}-lab.png`) });
          await root.getByRole('button', { name: stage === 2 ? 'Review mission' : 'Next challenge', exact: true }).click();
          if (stage === 0) { await page.reload(); await page.locator(`[data-new-mission="${slug}"][data-stage="1"]`).waitFor(); }
        }
        await page.getByRole('heading', { name: 'Your AI evaluation record', exact: true }).waitFor();
        await page.getByRole('button', { name: 'Finish chapter', exact: true }).click();
        await page.locator(`[data-mission-complete="${slug}"]`).waitFor();
        await page.reload();
        await page.locator(`[data-mission-complete="${slug}"]`).waitFor();
        const saved = await page.evaluate(slug => JSON.parse(localStorage.getItem(`cybersuraksha-cyber-${slug}-v1-preview`)), slug);
        assert.equal(saved.completed, true);
        assert.equal(Object.keys(saved.state[`evidence-${slug}`]).length, 3);
        assert.equal(saved.answers[`${slug}-check-1`].correct, false);
        await noOverflow(page, `${device} ${slug} completion overflow`);
        console.log(`PASS ${device}: ${slug} story, wrong feedback, three labs, resume and completion`);
      }
      await context.close();
    }
    const admin = await browser.newContext();
    assert.ok((await admin.request.post(`${base}/api/auth/teacher`, { data: { email: 'teacher@dpsrkp.edu.in', password: 'Teacher@123' } })).ok());
    const className = `11A${Date.now().toString().slice(-6)}`;
    const created = await admin.request.post(`${base}/api/students`, { data: { className, students: [{ rollNo: '1', name: 'AI Module QA Learner' }] } });
    assert.equal(created.status(), 201);
    const learner = (await created.json()).students[0];
    const library = await (await admin.request.get(`${base}/api/lms/assignments`)).json();
    assert.equal(library.modules.filter(module => module.grades.includes(11)).length, 32);
    const classroom = library.classes.find(row => row.name === className);
    const lesson = library.modules.find(row => row.title === 'Is AI needed here?' && row.grades.includes(11));
    const assigned = await admin.request.post(`${base}/api/lms/assignments`, { data: { title: 'AI module QA assignment', classId: classroom.id, moduleIds: [lesson.id], dueAt: Date.now() + 86400000, totalMarks: 100, publish: true } });
    assert.equal(assigned.status(), 201);
    const assignment = (await assigned.json()).assignment;
    const student = await browser.newContext({ viewport: { width: 1280, height: 1000 }, reducedMotion: 'reduce' });
    assert.ok((await student.request.post(`${base}/api/auth/student`, { data: { school: 'dps-rkp', className, rollNo: '1', password: learner.accessCode } })).ok());
    const page = await student.newPage();
    await page.goto(`${base}/module/cyber/${slugs[0]}?grade=11`);
    await page.getByRole('button', { name: 'Skip to practice', exact: true }).click();
    for (let stage = 0; stage < 3; stage++) {
      const root = page.locator(`[data-new-mission="${slugs[0]}"][data-stage="${stage}"]`);
      await solve(root, 0, stage, c);
      await root.getByRole('button', { name: stage === 2 ? 'Review mission' : 'Next challenge', exact: true }).click();
    }
    await page.getByRole('button', { name: 'Finish chapter', exact: true }).click();
    await page.getByText('Lesson saved to student and teacher progress.', { exact: true }).waitFor();
    const history = await (await admin.request.get(`${base}/api/lms/students/${learner.id}`)).json();
    const attempt = history.attempts.find(row => row.moduleId === lesson.id && row.completedAt);
    assert.equal(attempt.score, 100);
    assert.equal(history.events.filter(row => row.type === 'question_answered' && row.attemptId === attempt.id).length, 3);
    const inbox = await (await student.request.get(`${base}/api/lms/inbox`)).json();
    assert.equal(inbox.assignments.find(row => row.id === assignment.id).progress.marks, 100);
    await page.goto(`${base}/dashboard`);
    assert.equal(await page.getByRole('link', { name: 'Continue with Your digital risk map', exact: true }).count(), 1, 'unfinished prerequisite chapters remain in the continuation order');
    await student.close(); await admin.close();
    console.log('PASS AI authenticated completion: server save, teacher history, assignment grading and 32-chapter library');
    const fallback = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    const quiet = await fallback.newPage();
    await quiet.route('**/is-ai-needed-here/story.mp3', route => route.abort());
    await quiet.goto(`${base}/module/cyber/is-ai-needed-here?grade=11`);
    await quiet.getByText('Audio couldn’t load. Read the captions and use Next scene.').waitFor();
    await quiet.getByRole('button', { name: 'Scene 4: Your decision', exact: true }).click();
    await quiet.getByRole('button', { name: c.aiStoryTasks[0].choices[1], exact: true }).click();
    await quiet.getByRole('button', { name: 'Test my decision', exact: true }).click();
    await quiet.locator('[data-solved="true"]').waitFor();
    await fallback.close();
    console.log('PASS AI narration failure: captions and interactive decision remain usable');
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
