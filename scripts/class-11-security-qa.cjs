// Use a disposable demo server (CYBERSURAKSHA_EPHEMERAL_WORKERS=1).
// BASE_URL=http://localhost:3000 node scripts/class-11-security-qa.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
let playwright;
try { playwright = require('playwright'); } catch { playwright = require('/Users/dipeshkumar/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'); }
const base = process.env.BASE_URL || 'http://localhost:3000';
const out = path.resolve('.story-qa/class-11-security');
fs.mkdirSync(out, { recursive: true });
const slugs = ['your-digital-risk-map', 'identity-beyond-a-password', 'who-should-have-access', 'what-a-browser-can-tell-you', 'data-has-a-lifecycle', 'devices-updates-and-backups', 'the-suspicious-login', 'security-design-review'];
const storyAnswers = [1, 2, 1, 1, 1, 2, 1, 2];

async function match(root, rows) {
  for (const row of rows) await root.getByRole('combobox', { name: row.label, exact: true }).selectOption(row.answer);
  await root.getByRole('button', { name: 'Check my map', exact: true }).click();
}
async function sequence(root, steps) {
  for (const step of steps) await root.getByRole('button', { name: step, exact: true }).click();
  await root.getByRole('button', { name: 'Run sequence', exact: true }).click();
}
async function checkbox(root, labels) {
  for (const label of labels) await root.getByRole('checkbox', { name: label, exact: true }).check();
}
async function solvePractice(root, index, stage, c) {
  switch (index) {
    case 0:
      if (stage < 2) return match(root, stage === 0 ? c.riskCards : c.impactCards);
      await root.getByRole('button', { name: 'Move One editable poster copy down', exact: true }).click();
      await root.getByRole('button', { name: 'Move One editable poster copy down', exact: true }).click();
      for (const risk of c.priorities) await root.getByRole('listitem').filter({ hasText: risk.label }).getByRole('combobox').selectOption(risk.id);
      return root.getByRole('button', { name: 'Save risk register', exact: true }).click();
    case 1:
      if (stage === 0) { await checkbox(root, c.identityControls.filter(control => control.good).map(control => control.label)); return root.getByRole('button', { name: 'Test protection', exact: true }).click(); }
      if (stage === 1) return sequence(root, c.recoverySteps);
      return match(root, c.authCards);
    case 2:
      for (const row of c.accessTasks[stage].rows) await root.getByRole('combobox', { name: row.label, exact: true }).selectOption(row.answer);
      if (stage === 1) await root.getByRole('combobox', { name: 'Guest programme link expires', exact: true }).selectOption('Friday after the event');
      await root.getByRole('button', { name: `Test as ${c.accessTasks[stage].test}`, exact: true }).click();
      return root.getByRole('button', { name: 'Save tested permissions', exact: true }).click();
    case 3:
      await root.getByRole('combobox', { name: 'Actual hostname', exact: true }).selectOption(c.browserTasks[stage].expectedHost);
      await root.getByRole('button', { name: ['Use the school address from the supplied school diary', 'HTTPS protects the connection; verify the operator separately', 'Decline contacts; the programme does not need them'][stage], exact: true }).click();
      return root.getByRole('button', { name: 'Record browser evidence', exact: true }).click();
    case 4: return match(root, c.lifecycleTasks[stage].rows);
    case 5:
      if (stage === 0) { await checkbox(root, c.deviceControls.filter(control => control.good).map(control => control.label)); return root.getByRole('button', { name: 'Test protection', exact: true }).click(); }
      if (stage === 1) {
        await root.getByRole('button', { name: c.backupVersions[1].label, exact: true }).click();
        await root.getByRole('button', { name: 'Restore to a new practice folder', exact: true }).click();
        return root.getByRole('button', { name: 'Verify restoration', exact: true }).click();
      }
      await checkbox(root, ['Compare all 43 expected IDs and statuses', 'Test that the gate account can read the restored copy', 'Keep the original and record the restoration result']);
      return root.getByRole('button', { name: 'Approve recovery checks', exact: true }).click();
    case 6:
      if (stage === 0) return sequence(root, c.loginEvents.map(event => `${event.time} · ${event.text}`));
      if (stage === 1) return match(root, c.loginClaims);
      return sequence(root, c.responseSteps);
    case 7:
      if (stage === 0) {
        for (const control of c.reviewControls.slice(0, 3)) await root.getByRole('checkbox', { name: `${control.label} ${control.cost} tokens`, exact: true }).check();
        await root.getByRole('button', { name: 'Run design test', exact: true }).click();
        return root.getByRole('button', { name: 'Save design', exact: true }).click();
      }
      await root.getByRole('button', { name: stage === 1 ? 'An authorised organiser could still share data; use clear handling rules and an escalation route' : 'Revoke the lost device\'s sessions, restrict exposure, verify the backup and inform the responsible teacher', exact: true }).click();
      return root.getByRole('button', { name: 'Defend decision', exact: true }).click();
  }
}
async function wrongPractice(root, index, c) {
  switch (index) {
    case 0:
      for (const row of c.riskCards) await root.getByRole('combobox', { name: row.label, exact: true }).selectOption('Threat');
      await root.getByRole('button', { name: 'Check my map', exact: true }).click(); break;
    case 1: case 5: {
      const controls = index === 1 ? c.identityControls : c.deviceControls;
      await checkbox(root, controls.map(control => control.label));
      await root.getByRole('button', { name: 'Test protection', exact: true }).click();
      await root.getByRole('checkbox', { name: controls.find(control => !control.good).label, exact: true }).uncheck(); break;
    }
    case 2:
      for (const row of c.accessTasks[0].rows) await root.getByRole('combobox', { name: row.label, exact: true }).selectOption('Edit');
      await root.getByRole('button', { name: `Test as ${c.accessTasks[0].test}`, exact: true }).click();
      await root.getByRole('button', { name: 'Save tested permissions', exact: true }).click(); break;
    case 3:
      await root.getByRole('combobox', { name: 'Actual hostname', exact: true }).selectOption('cyberpurschool.example');
      await root.getByRole('button', { name: 'Sign in because the school name appears in the link', exact: true }).click();
      await root.getByRole('button', { name: 'Record browser evidence', exact: true }).click(); break;
    case 4:
      for (const row of c.lifecycleTasks[0].rows) await root.getByRole('combobox', { name: row.label, exact: true }).selectOption('Collect');
      await root.getByRole('button', { name: 'Check my map', exact: true }).click(); break;
    case 6:
      await sequence(root, c.loginEvents.map(event => `${event.time} · ${event.text}`).reverse());
      for (let i = 0; i < 4; i++) await root.getByRole('button', { name: 'Undo last action', exact: true }).click(); break;
    case 7:
      for (const control of c.reviewControls) await root.getByRole('checkbox', { name: `${control.label} ${control.cost} tokens`, exact: true }).check();
      await root.getByRole('button', { name: 'Run design test', exact: true }).click();
      await root.getByRole('button', { name: 'Save design', exact: true }).click();
      await root.getByRole('checkbox', { name: 'Redesign the festival poster 2 tokens', exact: true }).uncheck(); break;
  }
  assert.equal(await root.getAttribute('data-ready'), 'false', 'incorrect work must not unlock progression');
  assert.ok(await root.locator('[data-result="retry"]').count(), 'incorrect work explains a retry');
}
async function noOverflow(page, label) {
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, label);
}

(async () => {
  const c = await import('../app/module/cyber/lessons/senior/security-content.ts');
  const errors = [];
  const browser = await playwright.chromium.launch({ headless: true, channel: 'chrome', args: ['--autoplay-policy=no-user-gesture-required'] });
  try {
    for (const [device, viewport] of [['desktop', { width: 1280, height: 1000 }], ['phone', { width: 390, height: 844 }]]) {
      const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
      const page = await context.newPage();
      page.on('pageerror', error => errors.push(`${device}: ${error.message}`));
      page.on('response', response => { if (response.status() >= 400) errors.push(`${device}: ${response.status()} ${response.url()}`); });
      await page.goto(`${base}/grade/11/cybersecurity`);
      assert.equal(await page.locator('a.moduleNameCardPlayable').count(), 8);
      await noOverflow(page, `${device} chapter library overflow`);
      await page.screenshot({ path: path.join(out, `${device}-library.png`), fullPage: true });
      await page.goto(`${base}/grade/11/cyber-fraud`);
      assert.equal(await page.locator('a.moduleNameCardPlayable').count(), 8);
      assert.equal(await page.locator('.moduleCardStatus').filter({ hasText: 'Planned chapter' }).count(), 0);
      for (const [index, slug] of slugs.entries()) {
        const script = JSON.parse(fs.readFileSync(path.resolve(`app/module/cyber/lessons/new/story/chapters/${slug}.json`), 'utf8'));
        const mp3 = path.resolve(`public/audio/cyber/${slug}/story.mp3`);
        assert.ok(fs.existsSync(mp3), `narration exists for ${slug}`);
        const duration = Number(execFileSync('/opt/homebrew/bin/ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp3]).toString());
        assert.ok(Math.abs(duration - script.duration) < .4, `${slug} audio matches cue times`);
        await page.goto(`${base}/module/cyber/${slug}?grade=11`);
        const player = page.locator(`[data-story-player="${slug}"]`);
        await player.waitFor();
        const sceneImage = player.locator('img[src^="/cyber-missions/class-11/"]');
        await sceneImage.evaluate(image => image.decode());
        assert.ok(await sceneImage.evaluate(image => image.naturalWidth >= 1000), `${slug}: scene illustration loads`);
        await noOverflow(page, `${device} ${slug} opening overflow`);
        await player.screenshot({ path: path.join(out, `${device}-${slug}-story.png`) });
        await page.getByRole('button', { name: 'Scene 4: Your decision', exact: true }).click();
        await page.locator('audio').evaluate(audio => audio.pause());
        await player.locator('[class*="actionBank"] button').nth((storyAnswers[index] + 1) % 3).click();
        await player.getByRole('button', { name: 'Test my decision', exact: true }).click();
        assert.equal(await player.getAttribute('data-solved'), 'false');
        assert.ok((await player.getByRole('status').innerText()).length > 20);
        await player.locator('[class*="actionBank"] button').nth(storyAnswers[index]).click();
        await player.getByRole('button', { name: 'Test my decision', exact: true }).click();
        await page.locator(`[data-story-player="${slug}"][data-solved="true"]`).waitFor();
        await page.locator('audio').evaluate(audio => audio.pause());
        await noOverflow(page, `${device} ${slug} story task overflow`);
        await page.getByRole('button', { name: 'Scene 6: Enter the lab', exact: true }).click();
        await page.locator('audio').evaluate(audio => audio.pause());
        await page.getByRole('button', { name: 'Enter the security lab', exact: true }).click();
        for (let stage = 0; stage < 3; stage++) {
          const root = page.locator(`[data-new-mission="${slug}"][data-stage="${stage}"]`);
          await root.waitFor();
          if ((stage === 0 && [0, 1].includes(index)) || (stage === 1 && index === 5)) {
            const practiceImage = root.locator('img[src^="/cyber-missions/class-11/"]');
            await practiceImage.scrollIntoViewIfNeeded();
            await practiceImage.evaluate(image => image.decode());
            assert.ok(await practiceImage.evaluate(image => image.naturalWidth >= 1000), `${slug}: practice illustration loads`);
            await root.screenshot({ path: path.join(out, `${device}-${slug}-illustrated-practice.png`) });
          }
          if (stage === 0) await wrongPractice(root, index, c);
          await solvePractice(root, index, stage, c);
          await page.locator(`[data-new-mission="${slug}"][data-ready="true"]`).waitFor();
          await noOverflow(page, `${device} ${slug} practice ${stage + 1} overflow`);
          if (stage === 2) await root.screenshot({ path: path.join(out, `${device}-${slug}-practice.png`) });
          await root.getByRole('button', { name: stage === 2 ? 'Review mission' : 'Next challenge', exact: true }).click();
          if (stage === 0) {
            await page.reload();
            await page.locator(`[data-new-mission="${slug}"][data-stage="1"]`).waitFor();
          }
        }
        await page.locator(`[data-mission-ready="${slug}"]`).waitFor();
        assert.equal(await page.getByRole('heading', { name: 'Your evidence record', exact: true }).count(), 1);
        await page.getByRole('button', { name: 'Finish chapter', exact: true }).click();
        await page.locator(`[data-mission-complete="${slug}"]`).waitFor();
        await page.reload();
        await page.locator(`[data-mission-complete="${slug}"]`).waitFor();
        const saved = await page.evaluate(slug => JSON.parse(localStorage.getItem(`cybersuraksha-cyber-${slug}-v1-preview`)), slug);
        assert.equal(saved.completed, true);
        assert.equal(Object.keys(saved.state[`evidence-${slug}`]).length, 3);
        assert.equal(Object.keys(saved.answers).length, 3);
        assert.equal(saved.answers[`${slug}-check-1`].correct, false, 'first attempt remains recorded after correction');
        await noOverflow(page, `${device} ${slug} completion overflow`);
        console.log(`PASS ${device}: ${slug} story, wrong feedback, 3 practices, resume and completion`);
      }
      await context.close();
    }
    const admin = await browser.newContext();
    assert.ok((await admin.request.post(`${base}/api/auth/teacher`, { data: { email: 'teacher@dpsrkp.edu.in', password: 'Teacher@123' } })).ok());
    const className = `11C${Date.now().toString().slice(-6)}`;
    const created = await admin.request.post(`${base}/api/students`, { data: { className, students: [{ rollNo: '1', name: 'Class 11 QA Learner' }] } });
    assert.equal(created.status(), 201);
    const learner = (await created.json()).students[0];
    const library = await (await admin.request.get(`${base}/api/lms/assignments`)).json();
    const classroom = library.classes.find(row => row.name === className);
    const lesson = library.modules.find(row => row.title === 'Your digital risk map' && row.grades.includes(11));
    const assigned = await admin.request.post(`${base}/api/lms/assignments`, { data: { title: 'Class 11 QA assignment', classId: classroom.id, moduleIds: [lesson.id], dueAt: Date.now() + 86400000, totalMarks: 100, publish: true } });
    assert.equal(assigned.status(), 201);
    const assignment = (await assigned.json()).assignment;
    const signedIn = await browser.newContext({ viewport: { width: 1280, height: 1000 }, reducedMotion: 'reduce' });
    assert.ok((await signedIn.request.post(`${base}/api/auth/student`, { data: { school: 'dps-rkp', className, rollNo: '1', password: learner.accessCode } })).ok());
    const studentPage = await signedIn.newPage();
    await studentPage.goto(`${base}/module/cyber/your-digital-risk-map?grade=11`);
    await studentPage.getByRole('button', { name: 'Skip to practice', exact: true }).click();
    for (let stage = 0; stage < 3; stage++) {
      const root = studentPage.locator(`[data-new-mission="your-digital-risk-map"][data-stage="${stage}"]`);
      await solvePractice(root, 0, stage, c);
      await root.getByRole('button', { name: stage === 2 ? 'Review mission' : 'Next challenge', exact: true }).click();
    }
    await studentPage.getByRole('button', { name: 'Finish chapter', exact: true }).click();
    await studentPage.getByText('Lesson saved to student and teacher progress.', { exact: true }).waitFor();
    const history = await (await admin.request.get(`${base}/api/lms/students/${learner.id}`)).json();
    const attempt = history.attempts.find(row => row.moduleId === lesson.id && row.completedAt);
    assert.equal(attempt.score, 100);
    assert.equal(history.events.filter(row => row.type === 'question_answered' && row.attemptId === attempt.id).length, 3);
    const inbox = await (await signedIn.request.get(`${base}/api/lms/inbox`)).json();
    assert.equal(inbox.assignments.find(row => row.id === assignment.id).progress.marks, 100);
    await studentPage.goto(`${base}/dashboard`);
    assert.equal(await studentPage.getByRole('link', { name: 'Continue with Identity beyond a password', exact: true }).count(), 1);
    await studentPage.screenshot({ path: path.join(out, 'signed-in-class11-dashboard.png'), fullPage: true });
    await signedIn.close();
    await admin.close();
    console.log('PASS Class 11 authenticated completion: server save, teacher history, assignment marks and next chapter');
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.route('**/your-digital-risk-map/story.mp3', route => route.abort());
    await page.goto(`${base}/module/cyber/your-digital-risk-map?grade=11`);
    await page.getByText('Audio couldn’t load. Read the captions and use Next scene.').waitFor();
    await page.getByRole('button', { name: 'Scene 4: Your decision', exact: true }).click();
    await page.getByRole('button', { name: 'Anyone-with-link sharing', exact: true }).click();
    await page.getByRole('button', { name: 'Test my decision', exact: true }).click();
    await page.locator('[data-solved="true"]').waitFor();
    console.log('PASS narration failure: captions and story decision still work');
    assert.deepEqual(errors, [], 'browser errors and failing HTTP responses');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
