// Use a disposable demo server (CYBERSURAKSHA_EPHEMERAL_WORKERS=1).
// BASE_URL=http://localhost:3000 node scripts/class-12-ai-qa.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
let playwright;
try { playwright = require('playwright'); } catch { playwright = require('/Users/dipeshkumar/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'); }
const base = process.env.BASE_URL || 'http://localhost:3000';
const out = path.resolve('.story-qa/class-12-ai');
fs.mkdirSync(out, { recursive: true });
async function match(root, rows) { for (const row of rows) await root.getByRole('combobox', { name: row.label, exact: true }).selectOption(row.answer); await root.getByRole('button', { name: 'Check my map', exact: true }).click(); }
async function choose(root, task) { await root.getByRole('button', { name: task.choices[task.answer], exact: true }).click(); await root.getByRole('button', { name: 'Check decision', exact: true }).click(); }
async function checklist(root, controls) { for (const control of controls.filter(control => control.good)) await root.getByRole('checkbox', { name: control.label, exact: true }).check(); await root.getByRole('button', { name: 'Test protection', exact: true }).click(); }
async function solve(root, index, stage, c) {
  if (index === 0) {
    if (stage === 0) return match(root, c.briefRows);
    if (stage === 2) return choose(root, c.choices.baselineTransfer);
    assert.equal(await root.getByText('Plan committed before this reveal', { exact: true }).count(), 0);
    await root.getByRole('spinbutton', { name: 'Minimum staff-review recall (%)', exact: true }).fill('80');
    await root.getByRole('spinbutton', { name: 'Maximum flagged requests per 100', exact: true }).fill('10');
    await root.getByRole('combobox', { name: 'Comparator plan', exact: true }).selectOption('same');
    await root.getByRole('button', { name: 'Commit plan and reveal baseline', exact: true }).click();
    assert.equal(await root.getByText('Plan committed before this reveal', { exact: true }).count(), 1);
    assert.equal(await root.getByRole('spinbutton', { name: 'Minimum staff-review recall (%)', exact: true }).isDisabled(), true);
    await root.getByRole('combobox', { name: 'Interpret the baseline', exact: true }).selectOption('misses');
    return root.getByRole('button', { name: 'Save baseline comparison', exact: true }).click();
  }
  if (index === 1) {
    if (stage === 0) return match(root, c.splitRoles);
    if (stage === 2) return choose(root, c.choices.testContaminated);
    await root.getByRole('button', { name: 'Audit original split', exact: true }).click();
    assert.ok((await root.locator('output').innerText()).includes('Family overlaps: A, D'));
    await root.getByRole('button', { name: 'Freeze evaluation manifest', exact: true }).click();
    assert.equal(await root.getAttribute('data-ready'), 'false');
    for (const record of c.splitRecords) await root.getByRole('combobox', { name: `Partition ${record.id}`, exact: true }).selectOption(record.repaired);
    await root.getByRole('button', { name: 'Freeze evaluation manifest', exact: true }).click();
    assert.ok((await root.locator('output').innerText()).includes('Manifest frozen'));
    return;
  }
  if (index === 2) {
    if (stage === 0) {
      for (const [name, value] of [['Accuracy (%)', '95'], ['Precision (%)', '50'], ['Recall (%)', '20']]) await root.getByRole('spinbutton', { name, exact: true }).fill(value);
      return root.getByRole('button', { name: 'Check metric calculations', exact: true }).click();
    }
    if (stage === 2) return choose(root, c.choices.changedCosts);
    await root.getByRole('button', { name: 'Evaluate operating point', exact: true }).click();
    assert.ok((await root.locator('output').innerText()).includes('Does not meet'));
    await root.getByRole('button', { name: 'Save threshold decision', exact: true }).click();
    assert.equal(await root.getAttribute('data-ready'), 'false');
    await root.getByRole('combobox', { name: 'Operating point / comparator', exact: true }).selectOption('review');
    await root.getByRole('button', { name: 'Evaluate operating point', exact: true }).click();
    assert.ok((await root.locator('output').innerText()).includes('cost 11'));
    return root.getByRole('button', { name: 'Save threshold decision', exact: true }).click();
  }
  if (index === 3) {
    if (stage === 0) return match(root, c.networkRows);
    if (stage === 2) return choose(root, c.choices.visionLimit);
    for (const sample of c.visionSamples) {
      assert.equal(await root.getByRole('img', { name: `Illustrative ${sample.condition.toLowerCase()} ${sample.object.toLowerCase()} input`, exact: true }).count(), 1);
      await root.getByRole('combobox', { name: `Outcome for ${sample.id}`, exact: true }).selectOption(sample.answer);
    }
    return root.getByRole('button', { name: 'Save shift-test table', exact: true }).click();
  }
  if (index === 4) {
    if (stage === 0) return match(root, c.claimRows);
    if (stage === 2) return match(root, c.routingRows);
    for (const [name, value] of [['Supported hours sentence', 'P1'], ['Supported renewal sentence', 'P2'], ['Weekend evidence gap', 'unknown']]) await root.getByRole('combobox', { name, exact: true }).selectOption(value);
    return root.getByRole('button', { name: 'Save source-grounded answer', exact: true }).click();
  }
  if (index === 5) {
    if (stage === 0) return match(root, c.trustRows);
    if (stage === 1) return checklist(root, c.injectionControls);
    return choose(root, c.choices.newInjectionCase);
  }
  if (index === 6) {
    if (stage === 0) {
      await root.getByRole('spinbutton', { name: 'Group A recall (%)', exact: true }).fill('80');
      await root.getByRole('spinbutton', { name: 'Group B recall (%)', exact: true }).fill('40');
      return root.getByRole('button', { name: 'Check group recall', exact: true }).click();
    }
    if (stage === 1) return match(root, c.modelCardRows);
    return checklist(root, c.rightsControls);
  }
  if (stage === 0) return checklist(root, c.dossierControls);
  if (stage === 1) return choose(root, c.choices.currentRecommendation);
  await root.getByRole('combobox', { name: 'Fresh failure decision', exact: true }).selectOption('stop');
  await root.getByRole('combobox', { name: 'Preparation assistance disclosure', exact: true }).selectOption('lab');
  return root.getByRole('button', { name: 'Defend go / revise / stop decision', exact: true }).click();
}
async function wrong(root, index, c) {
  if (index === 2 || index === 6) {
    const names = index === 2 ? ['Accuracy (%)', 'Precision (%)', 'Recall (%)'] : ['Group A recall (%)', 'Group B recall (%)'];
    for (const name of names) await root.getByRole('spinbutton', { name, exact: true }).fill('0');
    await root.getByRole('button', { name: index === 2 ? 'Check metric calculations' : 'Check group recall', exact: true }).click();
  } else if (index === 7) {
    for (const control of c.dossierControls) await root.getByRole('checkbox', { name: control.label, exact: true }).check();
    await root.getByRole('button', { name: 'Test protection', exact: true }).click();
    await root.getByRole('checkbox', { name: c.dossierControls.at(-1).label, exact: true }).uncheck();
  } else {
    const rows = [c.briefRows, c.splitRoles, [], c.networkRows, c.claimRows, c.trustRows][index];
    for (const row of rows) await root.getByRole('combobox', { name: row.label, exact: true }).selectOption(rows[0].answer);
    await root.getByRole('button', { name: 'Check my map', exact: true }).click();
  }
  assert.equal(await root.getAttribute('data-ready'), 'false');
  assert.ok(await root.locator('[data-result="retry"]').count());
}
async function noOverflow(page, label) { assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, label); }

(async () => {
  const c = await import('../app/module/cyber/lessons/senior/assurance-content.ts');
  const { CLASS12_AI_SLUGS: slugs } = await import('../app/data/class-12-missions.ts');
  const errors = [];
  const browser = await playwright.chromium.launch({ channel: 'chrome', headless: true, args: ['--autoplay-policy=no-user-gesture-required'] });
  try {
    for (const [device, viewport] of [['desktop', { width: 1280, height: 1000 }], ['phone', { width: 390, height: 844 }]]) {
      const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
      const page = await context.newPage();
      page.on('pageerror', error => errors.push(`${device}: ${error.message}`));
      page.on('response', response => { if (response.status() >= 400) errors.push(`${device}: HTTP ${response.status()} ${response.url()}`); });
      await page.goto(`${base}/grade/12/artificial-intelligence`);
      assert.equal(await page.locator('a.moduleNameCardPlayable').count(), 8);
      await page.screenshot({ path: path.join(out, `${device}-library.png`), fullPage: true });
      await page.goto(`${base}/grade/12/cyber-fraud`);
      assert.equal(await page.locator('a.moduleNameCardPlayable').count(), 8);
      assert.equal(await page.locator('.moduleCardStatus').filter({ hasText: 'Planned chapter' }).count(), 0);
      for (const [index, slug] of slugs.entries()) {
        const script = JSON.parse(fs.readFileSync(path.resolve(`app/module/cyber/lessons/new/story/chapters/${slug}.json`), 'utf8'));
        const audioFile = path.resolve(`public/audio/cyber/${slug}/story.mp3`);
        const duration = Number(execFileSync('/opt/homebrew/bin/ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', audioFile]).toString());
        assert.ok(Math.abs(duration - script.duration) < .4, `${slug} narration matches timing`);
        await page.goto(`${base}/module/cyber/${slug}?grade=12`);
        const player = page.locator(`[data-story-player="${slug}"]`);
        await player.waitFor();
        await player.locator('img[src^="/cyber-missions/class-12/"]').evaluate(image => image.decode());
        await noOverflow(page, `${device} ${slug} story overflow`);
        await player.screenshot({ path: path.join(out, `${device}-${slug}-story.png`) });
        await page.getByRole('button', { name: 'Scene 4: Your decision', exact: true }).click();
        await page.locator('audio').evaluate(audio => audio.pause());
        const task = c.assuranceStoryTasks[index];
        await player.getByRole('button', { name: task.choices[(task.answer + 1) % 3], exact: true }).click();
        await player.getByRole('button', { name: 'Test my decision', exact: true }).click();
        assert.equal(await player.getAttribute('data-solved'), 'false');
        assert.ok((await player.getByRole('status').innerText()).length > 20);
        await player.getByRole('button', { name: task.choices[task.answer], exact: true }).click();
        await player.getByRole('button', { name: 'Test my decision', exact: true }).click();
        await page.locator(`[data-story-player="${slug}"][data-solved="true"]`).waitFor();
        await page.getByRole('button', { name: 'Scene 6: Enter the lab', exact: true }).click();
        await page.locator('audio').evaluate(audio => audio.pause());
        await page.getByRole('button', { name: 'Enter the AI assurance lab', exact: true }).click();
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
        await page.getByRole('heading', { name: 'Your AI assurance record', exact: true }).waitFor();
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
    const className = `12T${Date.now().toString().slice(-6)}`;
    const created = await admin.request.post(`${base}/api/students`, { data: { className, students: [{ rollNo: '1', name: 'Class 12 AI QA Learner' }] } });
    assert.equal(created.status(), 201);
    const learner = (await created.json()).students[0];
    const library = await (await admin.request.get(`${base}/api/lms/assignments`)).json();
    assert.equal(library.modules.filter(module => module.grades.includes(12)).length, 32);
    const classroom = library.classes.find(row => row.name === className);
    const lesson = library.modules.find(row => row.title === 'Set a decision and a baseline' && row.grades.includes(12));
    const assigned = await admin.request.post(`${base}/api/lms/assignments`, { data: { title: 'Class 12 AI QA assignment', classId: classroom.id, moduleIds: [lesson.id], dueAt: Date.now() + 86400000, totalMarks: 100, publish: true } });
    assert.equal(assigned.status(), 201);
    const assignment = (await assigned.json()).assignment;
    const student = await browser.newContext({ viewport: { width: 1280, height: 1000 }, reducedMotion: 'reduce' });
    assert.ok((await student.request.post(`${base}/api/auth/student`, { data: { school: 'dps-rkp', className, rollNo: '1', password: learner.accessCode } })).ok());
    const page = await student.newPage();
    await page.goto(`${base}/module/cyber/${slugs[0]}?grade=12`);
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
    assert.equal(await page.getByRole('link', { name: 'Continue with From personal safety to system risk', exact: true }).count(), 1, 'unfinished prerequisite chapters remain in the continuation order');
    await student.close(); await admin.close();
    console.log('PASS Class 12 AI authenticated completion: server save, teacher history, assignment grading and 32-chapter Class 12 library');
    const fallback = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    const quiet = await fallback.newPage();
    await quiet.route('**/set-a-decision-and-a-baseline/story.mp3', route => route.abort());
    await quiet.goto(`${base}/module/cyber/set-a-decision-and-a-baseline?grade=12`);
    await quiet.getByText('Audio couldn’t load. Read the captions and use Next scene.').waitFor();
    await quiet.getByRole('button', { name: 'Scene 4: Your decision', exact: true }).click();
    await quiet.getByRole('button', { name: c.assuranceStoryTasks[0].choices[c.assuranceStoryTasks[0].answer], exact: true }).click();
    await quiet.getByRole('button', { name: 'Test my decision', exact: true }).click();
    await quiet.locator('[data-solved="true"]').waitFor();
    await fallback.close();
    console.log('PASS Class 12 AI narration failure: captions and interactive decision remain usable');
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
