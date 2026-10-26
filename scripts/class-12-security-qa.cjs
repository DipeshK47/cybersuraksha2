// Use a disposable demo server (CYBERSURAKSHA_EPHEMERAL_WORKERS=1).
// BASE_URL=http://localhost:3000 node scripts/class-12-security-qa.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
let playwright;
try { playwright = require('playwright'); } catch { playwright = require('/Users/dipeshkumar/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'); }
const base = process.env.BASE_URL || 'http://localhost:3000';
const out = path.resolve('.story-qa/class-12-security');
fs.mkdirSync(out, { recursive: true });
async function match(root, rows) { for (const row of rows) await root.getByRole('combobox', { name: row.label, exact: true }).selectOption(row.answer); await root.getByRole('button', { name: 'Check my map', exact: true }).click(); }
async function choose(root, text) { await root.getByRole('button', { name: text, exact: true }).click(); await root.getByRole('button', { name: 'Check decision', exact: true }).click(); }
async function sequence(root, steps) { for (const step of steps) await root.getByRole('button', { name: step, exact: true }).click(); await root.getByRole('button', { name: 'Run sequence', exact: true }).click(); }
async function solve(root, index, stage, c) {
  if (index === 0) return match(root, [c.entryRows, c.systemRows, c.riskRows][stage]);
  if (index === 1) {
    if (stage < 2) return match(root, [c.componentRows, c.boundaryRows][stage]);
    return choose(root, 'State that the diagram assumes a trusted server identity source and documented provider verification; HTTPS protects only the connection');
  }
  if (index === 2) {
    if (stage === 0) return match(root, c.designRows);
    if (stage === 2) return match(root, c.boundaryCases);
    await root.getByRole('button', { name: 'Run portal test pack', exact: true }).click();
    assert.equal(await root.getByText('Fail', { exact: true }).count(), 3);
    await root.getByRole('button', { name: 'Save design correction', exact: true }).click();
    assert.equal(await root.getAttribute('data-ready'), 'false');
    for (const name of ['Enforce per-record server authorisation', 'Validate whole-rupee amount 0–5000 on the server', 'Keep lookup values as data through structured access']) await root.getByRole('checkbox', { name, exact: true }).check();
    await root.getByRole('button', { name: 'Run portal test pack', exact: true }).click();
    assert.equal(await root.getByText('Fail', { exact: true }).count(), 0);
    return root.getByRole('button', { name: 'Save design correction', exact: true }).click();
  }
  if (index === 3) {
    if (stage === 0) {
      for (const control of c.dependencyControls.filter(control => control.good)) await root.getByRole('checkbox', { name: control.label, exact: true }).check();
      assert.ok((await root.getByRole('status').filter({ hasText: 'Budget used:' }).innerText()).includes('6 / 6'));
      return root.getByRole('button', { name: 'Check dependency budget', exact: true }).click();
    }
    if (stage === 1) return match(root, c.supplierRows);
    return choose(root, 'Use the independently retained recovery route, involve the named owner and test restoration before reopening');
  }
  if (index === 4) {
    if (stage === 0) return match(root, c.ledgerRows);
    if (stage === 2) return choose(root, 'Possible session misuse or path-specific denial remains an alternative; obtain request/response and access evidence without accusing a person');
    await root.getByRole('button', { name: 'Build corrected timeline', exact: true }).click();
    await root.getByRole('button', { name: 'Save evidence timeline', exact: true }).click();
    assert.equal(await root.getAttribute('data-ready'), 'false');
    await root.getByRole('combobox', { name: 'Subtract from E2’s fast clock', exact: true }).selectOption('2');
    await root.getByRole('button', { name: 'Build corrected timeline', exact: true }).click();
    const events = root.getByRole('list', { name: 'Corrected event timeline', exact: true }).getByRole('listitem');
    assert.ok((await events.nth(1).innerText()).startsWith('E2 · corrected 14:01 · raw 14:03'));
    return root.getByRole('button', { name: 'Save evidence timeline', exact: true }).click();
  }
  if (index === 5) {
    if (stage === 0) return match(root, c.roleRows);
    if (stage === 1) return sequence(root, c.incidentSteps);
    return choose(root, '“A registration-export link was exposed and is now restricted. Scope is under review; use the approved contact for help. We will update you as facts are confirmed.”');
  }
  if (index === 6) {
    if (stage === 0) return match(root, c.objectiveRows);
    if (stage === 2) return choose(root, 'Keep an independently available recovery method, schedule a restoration/access test and assign an owner to review the result');
    await root.getByRole('button', { name: 'Restore model and verify', exact: true }).click();
    assert.equal(await root.getByText('Fail', { exact: true }).count(), 2);
    await root.getByRole('button', { name: 'Save recovery test', exact: true }).click();
    assert.equal(await root.getAttribute('data-ready'), 'false');
    await root.getByRole('combobox', { name: 'Snapshot to restore in the offline model', exact: true }).selectOption('clean-1400');
    await root.getByRole('button', { name: 'Restore model and verify', exact: true }).click();
    assert.equal(await root.getByText('Fail', { exact: true }).count(), 0);
    assert.equal(await root.locator('tbody tr').count(), 4);
    return root.getByRole('button', { name: 'Save recovery test', exact: true }).click();
  }
  if (stage === 0) return match(root, c.assuranceRows);
  if (stage === 1) return choose(root, 'Revise the login hypothesis, retain containment for the independently confirmed export and continue authorised scope review');
  return choose(root, 'Keep programme-only access with expiry; decline unnecessary contacts, retain tested independent recovery and name the owner of remaining outage risk');
}
async function wrong(root, index, c) {
  if (index === 3) {
    for (const control of c.dependencyControls) await root.getByRole('checkbox', { name: control.label, exact: true }).check();
    await root.getByRole('button', { name: 'Check dependency budget', exact: true }).click();
    await root.getByRole('checkbox', { name: c.dependencyControls.at(-1).label, exact: true }).uncheck();
  } else {
    const rows = [c.entryRows, c.componentRows, c.designRows, [], c.ledgerRows, c.roleRows, c.objectiveRows, c.assuranceRows][index];
    for (const row of rows) await root.getByRole('combobox', { name: row.label, exact: true }).selectOption(rows[0].answer);
    await root.getByRole('button', { name: 'Check my map', exact: true }).click();
  }
  assert.equal(await root.getAttribute('data-ready'), 'false');
  assert.ok(await root.locator('[data-result="retry"]').count());
}
async function noOverflow(page, label) { assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, label); }

(async () => {
  const c = await import('../app/module/cyber/lessons/senior/system-content.ts');
  const { CLASS12_SECURITY_SLUGS: slugs } = await import('../app/data/class-12-missions.ts');
  const errors = [];
  const browser = await playwright.chromium.launch({ channel: 'chrome', headless: true, args: ['--autoplay-policy=no-user-gesture-required'] });
  try {
    for (const [device, viewport] of [['desktop', { width: 1280, height: 1000 }], ['phone', { width: 390, height: 844 }]]) {
      const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
      const page = await context.newPage();
      page.on('pageerror', error => errors.push(`${device}: ${error.message}`));
      page.on('response', response => { if (response.status() >= 400) errors.push(`${device}: HTTP ${response.status()} ${response.url()}`); });
      await page.goto(`${base}/grade/12/cybersecurity`);
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
        const task = c.systemStoryTasks[index];
        await player.getByRole('button', { name: task.choices[(task.answer + 1) % 3], exact: true }).click();
        await player.getByRole('button', { name: 'Test my decision', exact: true }).click();
        assert.equal(await player.getAttribute('data-solved'), 'false');
        assert.ok((await player.getByRole('status').innerText()).length > 20);
        await player.getByRole('button', { name: task.choices[task.answer], exact: true }).click();
        await player.getByRole('button', { name: 'Test my decision', exact: true }).click();
        await page.locator(`[data-story-player="${slug}"][data-solved="true"]`).waitFor();
        await page.getByRole('button', { name: 'Scene 6: Enter the lab', exact: true }).click();
        await page.locator('audio').evaluate(audio => audio.pause());
        await page.getByRole('button', { name: 'Enter the system lab', exact: true }).click();
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
        await page.getByRole('heading', { name: 'Your system assurance record', exact: true }).waitFor();
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
    const created = await admin.request.post(`${base}/api/students`, { data: { className, students: [{ rollNo: '1', name: 'Class 12 Security QA Learner' }] } });
    assert.equal(created.status(), 201);
    const learner = (await created.json()).students[0];
    const library = await (await admin.request.get(`${base}/api/lms/assignments`)).json();
    assert.equal(library.modules.filter(module => module.grades.includes(12)).length, 32);
    const classroom = library.classes.find(row => row.name === className);
    const lesson = library.modules.find(row => row.title === 'From personal safety to system risk' && row.grades.includes(12));
    const assigned = await admin.request.post(`${base}/api/lms/assignments`, { data: { title: 'Class 12 security QA assignment', classId: classroom.id, moduleIds: [lesson.id], dueAt: Date.now() + 86400000, totalMarks: 100, publish: true } });
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
    assert.equal(await page.getByRole('link', { name: 'Continue with Design the college-fest portal', exact: true }).count(), 1, 'unfinished prerequisite chapters remain in the continuation order');
    await student.close(); await admin.close();
    console.log('PASS Class 12 authenticated completion: server save, teacher history, assignment grading and 32-chapter Class 12 library');
    const fallback = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    const quiet = await fallback.newPage();
    await quiet.route('**/from-personal-safety-to-system-risk/story.mp3', route => route.abort());
    await quiet.goto(`${base}/module/cyber/from-personal-safety-to-system-risk?grade=12`);
    await quiet.getByText('Audio couldn’t load. Read the captions and use Next scene.').waitFor();
    await quiet.getByRole('button', { name: 'Scene 4: Your decision', exact: true }).click();
    await quiet.getByRole('button', { name: c.systemStoryTasks[0].choices[c.systemStoryTasks[0].answer], exact: true }).click();
    await quiet.getByRole('button', { name: 'Test my decision', exact: true }).click();
    await quiet.locator('[data-solved="true"]').waitFor();
    await fallback.close();
    console.log('PASS Class 12 narration failure: captions and interactive decision remain usable');
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
