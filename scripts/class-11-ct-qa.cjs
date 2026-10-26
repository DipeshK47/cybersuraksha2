// Use a disposable demo server (CYBERSURAKSHA_EPHEMERAL_WORKERS=1).
// BASE_URL=http://localhost:3000 node scripts/class-11-ct-qa.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
let playwright;
try { playwright = require('playwright'); } catch { playwright = require('/Users/dipeshkumar/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'); }
const base = process.env.BASE_URL || 'http://localhost:3000';
const out = path.resolve('.story-qa/class-11-ct');
fs.mkdirSync(out, { recursive: true });
async function match(root, rows) { for (const row of rows) await root.getByRole('combobox', { name: row.label, exact: true }).selectOption(row.answer); await root.getByRole('button', { name: 'Check my map', exact: true }).click(); }
async function choose(root, text) { await root.getByRole('button', { name: text, exact: true }).click(); await root.getByRole('button', { name: 'Check decision', exact: true }).click(); }
async function checklist(root, controls) { for (const control of controls.filter(control => control.good)) await root.getByRole('checkbox', { name: control.label, exact: true }).check(); await root.getByRole('button', { name: 'Test protection', exact: true }).click(); }
async function sequence(root, steps) { for (const step of steps) await root.getByRole('button', { name: step, exact: true }).click(); await root.getByRole('button', { name: 'Run sequence', exact: true }).click(); }
async function ruleBench(root, boundaryOnly = false) {
  await root.getByRole('button', { name: 'Run supplied records', exact: true }).click();
  assert.ok(await root.getByText('Mismatch', { exact: true }).count(), 'the initial faulty rule has a visible failing case');
  await root.getByRole('combobox', { name: 'Score comparison', exact: true }).selectOption('>=');
  if (!boundaryOnly) await root.getByRole('combobox', { name: 'Combine score and documents', exact: true }).selectOption('AND');
  await root.getByRole('button', { name: 'Run supplied records', exact: true }).click();
  assert.equal(await root.getByText('Mismatch', { exact: true }).count(), 0);
  await root.getByRole('button', { name: 'Check rule trace', exact: true }).click();
}
async function searchBench(root, binary) {
  const next = root.getByRole('button', { name: `Next ${binary ? 'binary' : 'linear'} comparison`, exact: true });
  if (binary) {
    await next.click();
    assert.ok((await root.getByRole('status').filter({ hasText: 'Search refused' }).innerText()).includes('not sorted'));
    await root.getByRole('button', { name: 'Sort IDs ascending', exact: true }).click();
  }
  for (let count = 0; count < 8 && !(await next.isDisabled()); count++) await next.click();
  assert.equal(await next.isDisabled(), true);
  await root.getByRole('spinbutton', { name: 'Total lookup comparisons', exact: true }).fill(binary ? '2' : '5');
  await root.getByRole('button', { name: 'Save search comparison', exact: true }).click();
}
async function solve(root, index, stage, c) {
  if (index === 0) {
    if (stage === 0) return sequence(root, c.processSteps);
    if (stage === 1) return match(root, c.decompositionFacts);
    return checklist(root, c.scopeControls);
  }
  if (index === 1) {
    if (stage === 0) return checklist(root, c.modelControls);
    if (stage === 1) {
      await root.getByRole('combobox', { name: 'Applicant ID lookup', exact: true }).selectOption('B20');
      await root.getByRole('button', { name: 'Run keyed lookup', exact: true }).click();
      assert.ok((await root.getByRole('status').innerText()).includes('score 60'));
      return match(root, c.structures);
    }
    return match(root, c.modelValidation);
  }
  if (index === 2) {
    if (stage === 0) return match(root, c.applicants.map(record => ({ label: `${record.id} · score ${record.score} · ${record.documents ? 'complete' : 'incomplete'} documents`, answer: c.evaluateApplicant(record) })));
    if (stage === 1) return ruleBench(root);
    return sequence(root, c.ruleSteps);
  }
  if (index === 3) {
    if (stage === 1) return ruleBench(root, true);
    if (stage === 2) return match(root, c.errorKinds);
    await root.getByRole('combobox', { name: 'Loop guard', exact: true }).selectOption('<');
    await root.getByRole('button', { name: 'Run loop trace', exact: true }).click();
    assert.equal(await root.locator('tbody tr').count(), 3);
    assert.equal(await root.getByText('Out-of-range read', { exact: true }).count(), 0);
    return root.getByRole('button', { name: 'Save corrected trace', exact: true }).click();
  }
  if (index === 4) {
    if (stage === 2) return match(root, c.searchChoices);
    return searchBench(root, stage === 1);
  }
  if (index === 5) {
    if (stage === 0) return match(root, c.functionContract);
    if (stage === 1) {
      for (const record of c.applicants.slice(1)) await root.getByRole('combobox', { name: `Predict ${record.id}`, exact: true }).selectOption(c.evaluateApplicant(record));
      await root.getByRole('button', { name: 'Run the shared function', exact: true }).click();
      return root.getByRole('button', { name: 'Check call predictions', exact: true }).click();
    }
    await root.getByRole('checkbox', { name: 'Score field is missing', exact: true }).check();
    await root.getByRole('combobox', { name: 'Predicted missing-score result', exact: true }).selectOption('Review missing data');
    await root.getByRole('button', { name: 'Run missing-field call', exact: true }).click();
    assert.ok((await root.getByRole('status').innerText()).includes('Review missing data'));
    return root.getByRole('button', { name: 'Save function boundary', exact: true }).click();
  }
  if (index === 6) {
    if (stage === 0) return match(root, c.testCases.map(test => ({ label: `${test.id} · ${test.description}`, answer: test.expected })));
    if (stage === 1) {
      await root.getByRole('button', { name: 'Run six-case test pack', exact: true }).click();
      assert.equal(await root.getByText('Fail', { exact: true }).count(), 1);
      await root.getByRole('combobox', { name: 'Score operator in the shared function', exact: true }).selectOption('>=');
      await root.getByRole('button', { name: 'Run six-case test pack', exact: true }).click();
      assert.equal(await root.getByText('Pass', { exact: true }).count(), 6);
      return root.getByRole('button', { name: 'Save test record', exact: true }).click();
    }
    await root.getByRole('checkbox', { name: 'Passing these examples does not prove correctness for every possible input', exact: true }).check();
    return match(root, c.freshCases);
  }
  if (stage === 0) {
    await root.getByRole('combobox', { name: 'Shared score threshold', exact: true }).selectOption('70');
    await root.getByRole('button', { name: 'Run revised test pack', exact: true }).click();
    assert.equal(await root.getByText('Pass', { exact: true }).count(), 6);
    return root.getByRole('button', { name: 'Save test record', exact: true }).click();
  }
  if (stage === 1) return choose(root, 'Use one shared validated check, retest affected and unchanged behaviour, and keep teacher review');
  return choose(root, 'Preserve both records, flag the duplicate, seek authorised review and add this conflict to the tests');
}
async function wrong(root, index, c) {
  if (index === 0) {
    await sequence(root, [...c.processSteps].reverse());
    for (let count = 0; count < 4; count++) await root.getByRole('button', { name: 'Undo last action', exact: true }).click();
  } else if (index === 1) {
    for (const control of c.modelControls) await root.getByRole('checkbox', { name: control.label, exact: true }).check();
    await root.getByRole('button', { name: 'Test protection', exact: true }).click();
    await root.getByRole('checkbox', { name: c.modelControls.at(-1).label, exact: true }).uncheck();
  } else if ([2, 5, 6].includes(index)) {
    const rows = index === 2 ? c.applicants.map(record => ({ label: `${record.id} · score ${record.score} · ${record.documents ? 'complete' : 'incomplete'} documents`, answer: 'Eligible' })) : index === 5 ? c.functionContract : c.testCases.map(test => ({ label: `${test.id} · ${test.description}`, answer: test.expected }));
    for (const row of rows) await root.getByRole('combobox', { name: row.label, exact: true }).selectOption(rows[0].answer);
    await root.getByRole('button', { name: 'Check my map', exact: true }).click();
  } else if (index === 3) {
    await root.getByRole('button', { name: 'Run loop trace', exact: true }).click();
    assert.equal(await root.locator('tbody tr').count(), 4);
    assert.equal(await root.getByText('Out-of-range read', { exact: true }).count(), 1);
    await root.getByRole('button', { name: 'Save corrected trace', exact: true }).click();
  } else if (index === 4) {
    for (let count = 0; count < 5; count++) await root.getByRole('button', { name: 'Next linear comparison', exact: true }).click();
    await root.getByRole('spinbutton', { name: 'Total lookup comparisons', exact: true }).fill('1');
    await root.getByRole('button', { name: 'Save search comparison', exact: true }).click();
  } else {
    await root.getByRole('button', { name: 'Run revised test pack', exact: true }).click();
    assert.equal(await root.getByText('Fail', { exact: true }).count(), 2);
    await root.getByRole('button', { name: 'Save test record', exact: true }).click();
  }
  assert.equal(await root.getAttribute('data-ready'), 'false');
  assert.ok(await root.locator('[data-result="retry"]').count());
}
async function noOverflow(page, label) { assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, label); }

(async () => {
  const c = await import('../app/module/cyber/lessons/senior/ct-content.ts');
  const { CLASS11_CT_SLUGS: slugs } = await import('../app/data/class-11-missions.ts');
  const errors = [];
  const browser = await playwright.chromium.launch({ channel: 'chrome', headless: true, args: ['--autoplay-policy=no-user-gesture-required'] });
  try {
    for (const [device, viewport] of [['desktop', { width: 1280, height: 1000 }], ['phone', { width: 390, height: 844 }]]) {
      const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
      const page = await context.newPage();
      page.on('pageerror', error => errors.push(`${device}: ${error.message}`));
      page.on('response', response => { if (response.status() >= 400) errors.push(`${device}: HTTP ${response.status()} ${response.url()}`); });
      await page.goto(`${base}/grade/11/computational-thinking-lab`);
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
        const task = c.ctStoryTasks[index];
        await player.getByRole('button', { name: task.choices[(task.answer + 1) % 3], exact: true }).click();
        await player.getByRole('button', { name: 'Test my decision', exact: true }).click();
        assert.equal(await player.getAttribute('data-solved'), 'false');
        assert.ok((await player.getByRole('status').innerText()).length > 20);
        await player.getByRole('button', { name: task.choices[task.answer], exact: true }).click();
        await player.getByRole('button', { name: 'Test my decision', exact: true }).click();
        await page.locator(`[data-story-player="${slug}"][data-solved="true"]`).waitFor();
        await page.getByRole('button', { name: 'Scene 6: Enter the lab', exact: true }).click();
        await page.locator('audio').evaluate(audio => audio.pause());
        await page.getByRole('button', { name: 'Enter the logic lab', exact: true }).click();
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
        await page.getByRole('heading', { name: 'Your algorithm evidence record', exact: true }).waitFor();
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
    const className = `11T${Date.now().toString().slice(-6)}`;
    const created = await admin.request.post(`${base}/api/students`, { data: { className, students: [{ rollNo: '1', name: 'CT Module QA Learner' }] } });
    assert.equal(created.status(), 201);
    const learner = (await created.json()).students[0];
    const library = await (await admin.request.get(`${base}/api/lms/assignments`)).json();
    assert.equal(library.modules.filter(module => module.grades.includes(11)).length, 32);
    const classroom = library.classes.find(row => row.name === className);
    const lesson = library.modules.find(row => row.title === 'Decompose the scholarship desk' && row.grades.includes(11));
    const assigned = await admin.request.post(`${base}/api/lms/assignments`, { data: { title: 'CT module QA assignment', classId: classroom.id, moduleIds: [lesson.id], dueAt: Date.now() + 86400000, totalMarks: 100, publish: true } });
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
    console.log('PASS CT authenticated completion: server save, teacher history, assignment grading and 32-chapter library');
    const fallback = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    const quiet = await fallback.newPage();
    await quiet.route('**/decompose-the-scholarship-desk/story.mp3', route => route.abort());
    await quiet.goto(`${base}/module/cyber/decompose-the-scholarship-desk?grade=11`);
    await quiet.getByText('Audio couldn’t load. Read the captions and use Next scene.').waitFor();
    await quiet.getByRole('button', { name: 'Scene 4: Your decision', exact: true }).click();
    await quiet.getByRole('button', { name: c.ctStoryTasks[0].choices[1], exact: true }).click();
    await quiet.getByRole('button', { name: 'Test my decision', exact: true }).click();
    await quiet.locator('[data-solved="true"]').waitFor();
    await fallback.close();
    console.log('PASS CT narration failure: captions and interactive decision remain usable');
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
