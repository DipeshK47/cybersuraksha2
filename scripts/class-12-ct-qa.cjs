// Use a disposable demo server (CYBERSURAKSHA_EPHEMERAL_WORKERS=1).
// BASE_URL=http://localhost:3000 node scripts/class-12-ct-qa.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
let playwright;
try { playwright = require('playwright'); } catch { playwright = require('/Users/dipeshkumar/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'); }
const base = process.env.BASE_URL || 'http://localhost:3000';
const out = path.resolve('.story-qa/class-12-ct');
fs.mkdirSync(out, { recursive: true });
async function match(root, rows) { for (const row of rows) await root.getByRole('combobox', { name: row.label, exact: true }).selectOption(row.answer); await root.getByRole('button', { name: 'Check my map', exact: true }).click(); }
async function choose(root, task) { await root.getByRole('button', { name: task.choices[task.answer], exact: true }).click(); await root.getByRole('button', { name: 'Check decision', exact: true }).click(); }
async function sequence(root, steps) { for (const step of steps) await root.getByRole('button', { name: step, exact: true }).click(); await root.getByRole('button', { name: 'Run sequence', exact: true }).click(); }
async function solve(root, index, stage, c) {
  if (index === 0) {
    if (stage === 0) return match(root, c.structureRows);
    if (stage === 2) return match(root, c.structureLimits);
    await root.getByRole('combobox', { name: 'Predict next undo ID', exact: true }).selectOption('U3');
    await root.getByRole('combobox', { name: 'Predict next support ID', exact: true }).selectOption('T1');
    await root.getByRole('button', { name: 'Run both removal operations', exact: true }).click();
    assert.ok((await root.locator('output').innerText()).includes('Undone: U3'));
    assert.ok((await root.locator('output').innerText()).includes('Served: T1'));
    return root.getByRole('button', { name: 'Save structure trace', exact: true }).click();
  }
  if (index === 1) {
    if (stage === 0) return match(root, c.growthRows);
    if (stage === 2) return match(root, c.countAssumptions);
    for (const size of ['8', '16', '32']) { await root.getByRole('combobox', { name: 'Input record count', exact: true }).selectOption(size); await root.getByRole('button', { name: 'Count supplied operations', exact: true }).click(); }
    assert.equal(await root.locator('tbody tr').count(), 3);
    for (const [name, value] of [['Binary probes for n=8', '4'], ['Binary probes for n=32', '6'], ['Unordered-pair comparisons for n=32', '496']]) await root.getByRole('spinbutton', { name, exact: true }).fill(value);
    return root.getByRole('button', { name: 'Save growth evidence', exact: true }).click();
  }
  if (index === 2) {
    if (stage === 0) return match(root, c.schemaRows);
    if (stage === 2) return choose(root, c.choices.reconcile);
    await root.getByRole('button', { name: 'Run stable-ID reconciliation', exact: true }).click();
    return match(root, c.reconcileRegistrations(c.registrations, c.checkIns).map(row => ({ label: `${row.id} · ${row.registrationCount} registration row(s), ${row.checkInCount} check-in row(s)`, answer: row.outcome })));
  }
  if (index === 3) {
    if (stage === 0) return sequence(root, c.pipelineSteps);
    if (stage === 1) return match(root, c.contractRows);
    await root.getByRole('button', { name: 'Run mixed alert batch', exact: true }).click();
    const record = root.getByRole('region', { name: 'Pipeline execution record', exact: true });
    assert.equal(await record.getAttribute('data-ledger-count'), '2'); assert.equal(await record.getAttribute('data-quarantine-count'), '2'); assert.equal(await record.getAttribute('data-pending-count'), '0');
    await root.getByRole('combobox', { name: 'Interpret invalid-record handling', exact: true }).selectOption('quarantine');
    return root.getByRole('button', { name: 'Save pipeline contract test', exact: true }).click();
  }
  if (index === 4) {
    if (stage === 0) return match(root, c.failureRows);
    if (stage === 2) return choose(root, c.choices.conflict);
    await root.getByRole('button', { name: 'Run with output fault', exact: true }).click();
    const record = root.getByRole('region', { name: 'Pipeline execution record', exact: true });
    assert.equal(await record.getAttribute('data-ledger-count'), '1'); assert.equal(await record.getAttribute('data-pending-count'), '2');
    await root.getByRole('combobox', { name: 'Recovery plan after the fault is resolved', exact: true }).selectOption('preserve');
    await root.getByRole('button', { name: 'Retry preserved batch', exact: true }).click();
    assert.equal(await record.getAttribute('data-ledger-count'), '3'); assert.equal(await record.getAttribute('data-pending-count'), '0');
    assert.ok((await record.innerText()).includes('Skipped repeats: A01'));
    return root.getByRole('button', { name: 'Save failure recovery', exact: true }).click();
  }
  if (index === 5) {
    if (stage === 0) {
      await root.getByRole('spinbutton', { name: 'Window A observed flag rate (%)', exact: true }).fill('20');
      await root.getByRole('spinbutton', { name: 'Window B observed flag rate (%)', exact: true }).fill('10');
      return root.getByRole('button', { name: 'Check observed rates', exact: true }).click();
    }
    if (stage === 2) return choose(root, c.choices.cause);
    await root.getByRole('button', { name: 'Build comparison table', exact: true }).click();
    await root.getByRole('button', { name: 'Save corrected comparison', exact: true }).click();
    assert.equal(await root.getAttribute('data-ready'), 'false');
    await root.getByRole('combobox', { name: 'Comparison measure', exact: true }).selectOption('rate');
    await root.getByRole('combobox', { name: 'Missing-reading treatment', exact: true }).selectOption('unknown');
    await root.getByRole('button', { name: 'Build comparison table', exact: true }).click();
    assert.equal(await root.getByText('30/300 = 10.0%', { exact: true }).count(), 1);
    return root.getByRole('button', { name: 'Save corrected comparison', exact: true }).click();
  }
  if (index === 6) {
    if (stage === 0) return match(root, c.regressionCases.map(test => ({ label: `${test.id} · ${test.label}`, answer: test.expected })));
    if (stage === 2) return choose(root, c.choices.freshTest);
    await root.getByRole('button', { name: 'Run eight-case regression pack', exact: true }).click();
    assert.equal(await root.getByText('Fail', { exact: true }).count(), 1);
    await root.getByRole('button', { name: 'Save regression record', exact: true }).click();
    assert.equal(await root.getAttribute('data-ready'), 'false');
    await root.getByRole('combobox', { name: 'Review comparison in the shared rule', exact: true }).selectOption('>=');
    await root.getByRole('button', { name: 'Run eight-case regression pack', exact: true }).click();
    assert.equal(await root.getByText('Pass', { exact: true }).count(), 8);
    return root.getByRole('button', { name: 'Save regression record', exact: true }).click();
  }
  if (stage === 0) return match(root, c.designRows);
  if (stage === 2) return choose(root, c.choices.finalDefence);
  await root.getByRole('button', { name: 'Run new-version boundary tests', exact: true }).click();
  await root.getByRole('button', { name: 'Save changed-design evidence', exact: true }).click();
  assert.equal(await root.getAttribute('data-ready'), 'false');
  await root.getByRole('combobox', { name: 'New-version review threshold', exact: true }).selectOption('80');
  await root.getByRole('button', { name: 'Run new-version boundary tests', exact: true }).click();
  return root.getByRole('button', { name: 'Save changed-design evidence', exact: true }).click();
}
async function wrong(root, index, c) {
  if (index === 3) {
    await sequence(root, [...c.pipelineSteps].reverse());
    for (let undo = 0; undo < 4; undo++) await root.getByRole('button', { name: 'Undo last action', exact: true }).click();
  } else if (index === 5) {
    await root.getByRole('spinbutton', { name: 'Window A observed flag rate (%)', exact: true }).fill('0');
    await root.getByRole('spinbutton', { name: 'Window B observed flag rate (%)', exact: true }).fill('0');
    await root.getByRole('button', { name: 'Check observed rates', exact: true }).click();
  } else {
    const rows = [c.structureRows, c.growthRows, c.schemaRows, [], c.failureRows, [], c.regressionCases.map(test => ({ label: `${test.id} · ${test.label}`, answer: test.expected })), c.designRows][index];
    for (const row of rows) await root.getByRole('combobox', { name: row.label, exact: true }).selectOption(rows[0].answer);
    await root.getByRole('button', { name: 'Check my map', exact: true }).click();
  }
  assert.equal(await root.getAttribute('data-ready'), 'false'); assert.ok(await root.locator('[data-result="retry"]').count());
}
async function noOverflow(page, label) { assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, label); }

(async () => {
  const c = await import('../app/module/cyber/lessons/senior/reliability-content.ts');
  const { CLASS12_CT_SLUGS: slugs } = await import('../app/data/class-12-missions.ts');
  const errors = [];
  const browser = await playwright.chromium.launch({ channel: 'chrome', headless: true, args: ['--autoplay-policy=no-user-gesture-required'] });
  try {
    for (const [device, viewport] of [['desktop', { width: 1280, height: 1000 }], ['phone', { width: 390, height: 844 }]]) {
      const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
      const page = await context.newPage();
      page.on('pageerror', error => errors.push(`${device}: ${error.message}`));
      page.on('response', response => { if (response.status() >= 400) errors.push(`${device}: HTTP ${response.status()} ${response.url()}`); });
      await page.goto(`${base}/grade/12/computational-thinking-lab`);
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
        const task = c.reliabilityStoryTasks[index];
        await player.getByRole('button', { name: task.choices[(task.answer + 1) % 3], exact: true }).click();
        await player.getByRole('button', { name: 'Test my decision', exact: true }).click();
        assert.equal(await player.getAttribute('data-solved'), 'false');
        assert.ok((await player.getByRole('status').innerText()).length > 20);
        await player.getByRole('button', { name: task.choices[task.answer], exact: true }).click();
        await player.getByRole('button', { name: 'Test my decision', exact: true }).click();
        await page.locator(`[data-story-player="${slug}"][data-solved="true"]`).waitFor();
        await page.getByRole('button', { name: 'Scene 6: Enter the lab', exact: true }).click();
        await page.locator('audio').evaluate(audio => audio.pause());
        await page.getByRole('button', { name: 'Enter the reliability lab', exact: true }).click();
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
        await page.getByRole('heading', { name: 'Your automation evidence record', exact: true }).waitFor();
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
    const created = await admin.request.post(`${base}/api/students`, { data: { className, students: [{ rollNo: '1', name: 'Class 12 CT QA Learner' }] } });
    assert.equal(created.status(), 201);
    const learner = (await created.json()).students[0];
    const library = await (await admin.request.get(`${base}/api/lms/assignments`)).json();
    assert.equal(library.modules.filter(module => module.grades.includes(12)).length, 32);
    const classroom = library.classes.find(row => row.name === className);
    const lesson = library.modules.find(row => row.title === 'Choose the right data model' && row.grades.includes(12));
    const assigned = await admin.request.post(`${base}/api/lms/assignments`, { data: { title: 'Class 12 CT QA assignment', classId: classroom.id, moduleIds: [lesson.id], dueAt: Date.now() + 86400000, totalMarks: 100, publish: true } });
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
    console.log('PASS Class 12 CT authenticated completion: server save, teacher history, assignment grading and 32-chapter Class 12 library');
    const fallback = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    const quiet = await fallback.newPage();
    await quiet.route('**/choose-the-right-data-model/story.mp3', route => route.abort());
    await quiet.goto(`${base}/module/cyber/choose-the-right-data-model?grade=12`);
    await quiet.getByText('Audio couldn’t load. Read the captions and use Next scene.').waitFor();
    await quiet.getByRole('button', { name: 'Scene 4: Your decision', exact: true }).click();
    await quiet.getByRole('button', { name: c.reliabilityStoryTasks[0].choices[c.reliabilityStoryTasks[0].answer], exact: true }).click();
    await quiet.getByRole('button', { name: 'Test my decision', exact: true }).click();
    await quiet.locator('[data-solved="true"]').waitFor();
    await fallback.close();
    console.log('PASS Class 12 CT narration failure: captions and interactive decision remain usable');
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
