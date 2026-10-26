// Use a disposable demo server (CYBERSURAKSHA_EPHEMERAL_WORKERS=1).
// BASE_URL=http://localhost:3000 node scripts/class-12-fraud-qa.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
let playwright;
try { playwright = require('playwright'); } catch { playwright = require('/Users/dipeshkumar/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'); }
const base = process.env.BASE_URL || 'http://localhost:3000';
const out = path.resolve('.story-qa/class-12-fraud');
fs.mkdirSync(out, { recursive: true });
async function match(root, rows) { for (const row of rows) await root.getByRole('combobox', { name: row.label, exact: true }).selectOption(row.answer); await root.getByRole('button', { name: 'Check my map', exact: true }).click(); }
async function choose(root, task) { await root.getByRole('button', { name: task.choices[task.answer], exact: true }).click(); await root.getByRole('button', { name: 'Check decision', exact: true }).click(); }
async function checklist(root, controls) { for (const control of controls.filter(control => control.good)) await root.getByRole('checkbox', { name: control.label, exact: true }).check(); await root.getByRole('button', { name: 'Test protection', exact: true }).click(); }
async function sequence(root, steps) { for (const step of steps) await root.getByRole('button', { name: step, exact: true }).click(); await root.getByRole('button', { name: 'Run sequence', exact: true }).click(); }
async function dossier(root) {
  for (const label of ['System risk', 'AI evidence', 'Algorithm checks', 'Fraud response']) await root.getByRole('combobox', { name: `${label} source`, exact: true }).selectOption('supplied');
  const note = root.getByRole('textbox', { name: 'Dossier reflection for teacher review', exact: true });
  assert.equal(await note.getAttribute('maxlength'), '300');
  await note.fill('A real order does not verify the changed beneficiary. A flag does not prove intent. Preserve private evidence and independently check the exact request; add the missed case to the prevention tests.');
}
async function solve(root, index, stage, c) {
  if (index === 0) {
    if (stage === 0) return match(root, c.recruitmentRows);
    if (stage === 1) return checklist(root, c.exitControls);
    return choose(root, c.choices.unexpectedFunds);
  }
  if (index === 1) {
    if (stage === 0) {
      await root.getByRole('combobox', { name: 'Channel used by the offer', exact: true }).selectOption('cedar-growth.example');
      await root.getByRole('combobox', { name: 'Channel in the independent mock extract', exact: true }).selectOption('cedar-advice.example');
      await root.getByRole('combobox', { name: 'What the mock registry can establish', exact: true }).selectOption('limited');
      return root.getByRole('button', { name: 'Save investment-source inspection', exact: true }).click();
    }
    if (stage === 1) return match(root, c.investmentRows);
    return choose(root, c.choices.investmentPause);
  }
  if (index === 2) {
    if (stage === 0) return match(root, c.identityRows);
    if (stage === 1) return sequence(root, c.identitySteps);
    return choose(root, c.choices.identityPartial);
  }
  if (index === 3) {
    if (stage === 0) return checklist(root, c.helpControls);
    if (stage === 2) return choose(root, c.choices.supportiveHelp);
    for (const [name, value] of [['Incident time', c.caseIncident.time], ['Amount in rupees', c.caseIncident.amount], ['Case transaction reference', c.caseIncident.reference], ['Evidence-supported event description', c.caseIncident.event]]) await root.getByRole('combobox', { name, exact: true }).selectOption(value);
    await root.getByRole('button', { name: 'Build mock case file', exact: true }).click();
    assert.equal(await root.getAttribute('data-ready'), 'false');
    await root.getByRole('checkbox', { name: 'Redact unrelated details from the classroom copy and include no PIN or OTP', exact: true }).check();
    await root.getByRole('checkbox', { name: 'Retain relevant originals privately for authorised helpers; do not forward private or harmful material to groups', exact: true }).check();
    await root.getByRole('button', { name: 'Build mock case file', exact: true }).click();
    assert.ok((await root.locator('output').innerText()).includes('No report was submitted'));
    return;
  }
  if (index === 4) {
    if (stage === 0) return match(root, c.patternRows);
    if (stage === 2) return choose(root, c.choices.patternLimit);
    await root.getByRole('button', { name: 'Run transparent pattern rule', exact: true }).click();
    const output = root.getByRole('region', { name: 'Pattern review output', exact: true });
    assert.equal(await output.getAttribute('data-flag-count'), '0');
    await root.getByRole('combobox', { name: 'Review window in minutes', exact: true }).selectOption('5');
    await root.getByRole('button', { name: 'Run transparent pattern rule', exact: true }).click();
    assert.equal(await output.getAttribute('data-flag-count'), '2');
    await root.getByRole('spinbutton', { name: 'Flagged intermediaries under the five-minute rule', exact: true }).fill('2');
    await root.getByRole('spinbutton', { name: 'Flagged paths with supplied benign context', exact: true }).fill('1');
    await root.getByRole('combobox', { name: 'Meaning of a flag', exact: true }).selectOption('review');
    return root.getByRole('button', { name: 'Save cautious pattern analysis', exact: true }).click();
  }
  if (index === 5) {
    if (stage === 0) return match(root, c.preventionRows);
    if (stage === 2) return choose(root, c.choices.aidTransfer);
    assert.equal(await root.getByRole('combobox', { name: 'Verification route in the aid', exact: true }).isDisabled(), true);
    await root.getByRole('button', { name: 'Test aid on both cases', exact: true }).click();
    const results = root.getByRole('region', { name: 'Prevention aid test results', exact: true });
    assert.equal(await results.getByText('Fail', { exact: true }).count(), 4);
    for (const [name, value] of [['Verification route in the aid', 'independent'], ['Before an unverified payment', 'pause'], ['After a suspected financial cyber-fraud loss', 'prompt'], ['Private evidence handling', 'restricted']]) await root.getByRole('combobox', { name, exact: true }).selectOption(value);
    await root.getByRole('button', { name: 'Test aid on both cases', exact: true }).click();
    assert.equal(await results.getByText('Fail', { exact: true }).count(), 2, 'first draft failures remain visible');
    assert.equal(await results.getByText('Pass', { exact: true }).count(), 2, 'revised aid passes both cases');
    return root.getByRole('button', { name: 'Save tested prevention aid', exact: true }).click();
  }
  if (index === 6) {
    if (stage === 0) return match(root, c.capstoneRows);
    if (stage === 1) return choose(root, c.choices.caseRevision);
    await dossier(root); return match(root, c.ownerRows);
  }
  if (stage === 0) return sequence(root, c.briefingSteps);
  if (stage === 1) return match(root, c.hearingRows);
  await dossier(root);
  await root.getByRole('combobox', { name: 'Individual fresh-case decision', exact: true }).selectOption('verify');
  await root.getByRole('combobox', { name: 'Improvement plan', exact: true }).selectOption('test');
  await root.getByRole('combobox', { name: 'Preparation assistance disclosure', exact: true }).selectOption('lab');
  return root.getByRole('button', { name: 'Save evidence-hearing decision', exact: true }).click();
}
async function wrong(root, index, c) {
  if (index === 1) {
    await root.getByRole('combobox', { name: 'Channel used by the offer', exact: true }).selectOption('cedar-advice.example');
    await root.getByRole('combobox', { name: 'Channel in the independent mock extract', exact: true }).selectOption('cedar-growth.example');
    await root.getByRole('combobox', { name: 'What the mock registry can establish', exact: true }).selectOption('guarantee');
    await root.getByRole('button', { name: 'Save investment-source inspection', exact: true }).click();
  } else if (index === 3) {
    for (const control of c.helpControls) await root.getByRole('checkbox', { name: control.label, exact: true }).check();
    await root.getByRole('button', { name: 'Test protection', exact: true }).click();
    await root.getByRole('checkbox', { name: c.helpControls.at(-1).label, exact: true }).uncheck();
  } else if (index === 7) {
    await sequence(root, [...c.briefingSteps].reverse());
    for (let undo = 0; undo < 4; undo++) await root.getByRole('button', { name: 'Undo last action', exact: true }).click();
  } else {
    const rows = [c.recruitmentRows, [], c.identityRows, [], c.patternRows, c.preventionRows, c.capstoneRows][index];
    for (const row of rows) await root.getByRole('combobox', { name: row.label, exact: true }).selectOption(rows[0].answer);
    await root.getByRole('button', { name: 'Check my map', exact: true }).click();
  }
  assert.equal(await root.getAttribute('data-ready'), 'false'); assert.ok(await root.locator('[data-result="retry"]').count());
}
async function noOverflow(page, label) { assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, label); }

(async () => {
  const c = await import('../app/module/cyber/lessons/senior/casework-content.ts');
  const { CLASS12_FRAUD_SLUGS: slugs } = await import('../app/data/class-12-missions.ts');
  const errors = [];
  const browser = await playwright.chromium.launch({ channel: 'chrome', headless: true, args: ['--autoplay-policy=no-user-gesture-required'] });
  try {
    for (const [device, viewport] of [['desktop', { width: 1280, height: 1000 }], ['phone', { width: 390, height: 844 }]]) {
      const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
      const page = await context.newPage();
      page.on('pageerror', error => errors.push(`${device}: ${error.message}`));
      page.on('response', response => { if (response.status() >= 400) errors.push(`${device}: HTTP ${response.status()} ${response.url()}`); });
      await page.goto(`${base}/grade/12/cyber-fraud`);
      assert.equal(await page.locator('a.moduleNameCardPlayable').count(), 8);
      await page.screenshot({ path: path.join(out, `${device}-library.png`), fullPage: true });
      for (const subject of ['cybersecurity', 'artificial-intelligence', 'computational-thinking-lab']) {
        await page.goto(`${base}/grade/12/${subject}`);
        assert.equal(await page.locator('a.moduleNameCardPlayable').count(), 8);
        assert.equal(await page.locator('.moduleCardStatus').filter({ hasText: 'Planned chapter' }).count(), 0);
      }
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
        const task = c.caseworkStoryTasks[index];
        await player.getByRole('button', { name: task.choices[(task.answer + 1) % 3], exact: true }).click();
        await player.getByRole('button', { name: 'Test my decision', exact: true }).click();
        assert.equal(await player.getAttribute('data-solved'), 'false');
        assert.ok((await player.getByRole('status').innerText()).length > 20);
        await player.getByRole('button', { name: task.choices[task.answer], exact: true }).click();
        await player.getByRole('button', { name: 'Test my decision', exact: true }).click();
        await page.locator(`[data-story-player="${slug}"][data-solved="true"]`).waitFor();
        await page.getByRole('button', { name: 'Scene 6: Enter the lab', exact: true }).click();
        await page.locator('audio').evaluate(audio => audio.pause());
        await page.getByRole('button', { name: 'Enter the casework lab', exact: true }).click();
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
        await page.getByRole('heading', { name: 'Your prevention and response case file', exact: true }).waitFor();
        await page.getByRole('button', { name: 'Finish chapter', exact: true }).click();
        await page.locator(`[data-mission-complete="${slug}"]`).waitFor();
        await page.reload();
        await page.locator(`[data-mission-complete="${slug}"]`).waitFor();
        const saved = await page.evaluate(slug => JSON.parse(localStorage.getItem(`cybersuraksha-cyber-${slug}-v1-preview`)), slug);
        assert.equal(saved.completed, true);
        assert.equal(Object.keys(saved.state[`evidence-${slug}`]).length, 3);
        assert.equal(saved.answers[`${slug}-check-1`].correct, false);
        if (index >= 6) { assert.equal(Object.keys(saved.state[`dossier-${slug}`]).length, 5); assert.ok(saved.state[`dossier-${slug}`].notes.includes('A real order')); }
        await noOverflow(page, `${device} ${slug} completion overflow`);
        console.log(`PASS ${device}: ${slug} story, wrong feedback, three labs, resume and completion`);
      }
      await context.close();
    }
    const admin = await browser.newContext();
    assert.ok((await admin.request.post(`${base}/api/auth/teacher`, { data: { email: 'teacher@dpsrkp.edu.in', password: 'Teacher@123' } })).ok());
    const className = `12T${Date.now().toString().slice(-6)}`;
    const created = await admin.request.post(`${base}/api/students`, { data: { className, students: [{ rollNo: '1', name: 'Class 12 Fraud QA Learner' }] } });
    assert.equal(created.status(), 201);
    const learner = (await created.json()).students[0];
    const library = await (await admin.request.get(`${base}/api/lms/assignments`)).json();
    assert.equal(library.modules.filter(module => module.grades.includes(12)).length, 32);
    const classroom = library.classes.find(row => row.name === className);
    const lesson = library.modules.find(row => row.title === 'The easy-money recruitment chain' && row.grades.includes(12));
    const hearing = library.modules.find(row => row.title === 'The evidence hearing' && row.grades.includes(12));
    const assigned = await admin.request.post(`${base}/api/lms/assignments`, { data: { title: 'Class 12 Fraud QA assignment', classId: classroom.id, moduleIds: [lesson.id, hearing.id], dueAt: Date.now() + 86400000, totalMarks: 100, publish: true } });
    assert.equal(assigned.status(), 201);
    const assignment = (await assigned.json()).assignment;
    const student = await browser.newContext({ viewport: { width: 1280, height: 1000 }, reducedMotion: 'reduce' });
    assert.ok((await student.request.post(`${base}/api/auth/student`, { data: { school: 'dps-rkp', className, rollNo: '1', password: learner.accessCode } })).ok());
    const page = await student.newPage();
    for (const index of [0, 7]) {
      await page.goto(`${base}/module/cyber/${slugs[index]}?grade=12`);
      await page.getByRole('button', { name: 'Skip to practice', exact: true }).click();
      for (let stage = 0; stage < 3; stage++) {
        const root = page.locator(`[data-new-mission="${slugs[index]}"][data-stage="${stage}"]`);
        await solve(root, index, stage, c);
        await root.getByRole('button', { name: stage === 2 ? 'Review mission' : 'Next challenge', exact: true }).click();
      }
      await page.getByRole('button', { name: 'Finish chapter', exact: true }).click();
      await page.getByText('Lesson saved to student and teacher progress.', { exact: true }).waitFor();
    }
    const history = await (await admin.request.get(`${base}/api/lms/students/${learner.id}`)).json();
    const attempt = history.attempts.find(row => row.moduleId === lesson.id && row.completedAt);
    assert.equal(attempt.score, 100);
    assert.equal(history.events.filter(row => row.type === 'question_answered' && row.attemptId === attempt.id).length, 3);
    const finalAttempt = history.attempts.find(row => row.moduleId === hearing.id && row.completedAt);
    assert.equal(finalAttempt.score, 100);
    const dossierEvent = history.events.find(row => row.attemptId === finalAttempt.id && row.type === 'question_answered' && JSON.parse(row.payload).id === 'the-evidence-hearing-transfer');
    assert.ok(JSON.parse(dossierEvent.payload).feedback.includes('Reflection (teacher review): A real order'));
    const teacherPage = await admin.newPage();
    await teacherPage.goto(`${base}/teach/lms/students/${learner.id}`);
    const details = teacherPage.locator('details').filter({ hasText: 'The evidence hearing' });
    await details.locator('summary').click();
    assert.ok((await details.innerText()).includes('supplied case pack'));
    assert.ok((await details.innerText()).includes('Reflection (teacher review): A real order'));

    const inbox = await (await student.request.get(`${base}/api/lms/inbox`)).json();
    assert.equal(inbox.assignments.find(row => row.id === assignment.id).progress.marks, 100);
    await page.goto(`${base}/dashboard`);
    assert.equal(await page.getByRole('link', { name: 'Continue with From personal safety to system risk', exact: true }).count(), 1, 'unfinished prerequisite chapters remain in the continuation order');
    await student.close(); await admin.close();
    console.log('PASS Class 12 Fraud authenticated completion: server save, teacher history, assignment grading and 32-chapter Class 12 library');
    const fallback = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    const quiet = await fallback.newPage();
    await quiet.route('**/the-easy-money-recruitment-chain/story.mp3', route => route.abort());
    await quiet.goto(`${base}/module/cyber/the-easy-money-recruitment-chain?grade=12`);
    await quiet.getByText('Audio couldn’t load. Read the captions and use Next scene.').waitFor();
    await quiet.getByRole('button', { name: 'Scene 4: Your decision', exact: true }).click();
    await quiet.getByRole('button', { name: c.caseworkStoryTasks[0].choices[c.caseworkStoryTasks[0].answer], exact: true }).click();
    await quiet.getByRole('button', { name: 'Test my decision', exact: true }).click();
    await quiet.locator('[data-solved="true"]').waitFor();
    await fallback.close();
    console.log('PASS Class 12 Fraud narration failure: captions and interactive decision remain usable');
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
