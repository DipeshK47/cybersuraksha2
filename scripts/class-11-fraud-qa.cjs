// Use a disposable demo server (CYBERSURAKSHA_EPHEMERAL_WORKERS=1).
// BASE_URL=http://localhost:3000 node scripts/class-11-fraud-qa.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
let playwright;
try { playwright = require('playwright'); } catch { playwright = require('/Users/dipeshkumar/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'); }
const base = process.env.BASE_URL || 'http://localhost:3000';
const out = path.resolve('.story-qa/class-11-fraud');
fs.mkdirSync(out, { recursive: true });
async function match(root, rows) { for (const row of rows) await root.getByRole('combobox', { name: row.label, exact: true }).selectOption(row.answer); await root.getByRole('button', { name: 'Check my map', exact: true }).click(); }
async function choose(root, text) { await root.getByRole('button', { name: text, exact: true }).click(); await root.getByRole('button', { name: 'Check decision', exact: true }).click(); }
async function checklist(root, controls) { for (const control of controls.filter(control => control.good)) await root.getByRole('checkbox', { name: control.label, exact: true }).check(); await root.getByRole('button', { name: 'Test protection', exact: true }).click(); }
async function portfolio(root) { for (const label of ['Security control', 'AI source/evaluation check', 'Algorithm trace or test', 'Payment-verification record']) await root.getByRole('combobox', { name: `${label} source`, exact: true }).selectOption('supplied'); assert.equal(await root.getByRole('textbox', { name: 'Portfolio notes / reflection for teacher review', exact: true }).getAttribute('maxlength'), '300'); await root.getByRole('textbox', { name: 'Portfolio notes / reflection for teacher review', exact: true }).fill('The outgoing screen contradicts the refund promise. A small test payment proves no authority. Verify through the known school route; the exact authorised process remains unknown.'); }
async function solve(root, index, stage, c) {
  if (index === 0) {
    if (stage === 0) return match(root, c.pressureRows);
    if (stage === 1) return choose(root, 'Pause, preserve the message and independently locate the college contact');
    return match(root, c.pressureTransfer);
  }
  if (index === 1) {
    if (stage === 0) return match(root, c.offerRows);
    if (stage === 1) return checklist(root, c.dueDiligence);
    return choose(root, 'Pause the unverified award and check the exact terms through an independently located scholarship contact');
  }
  if (index === 2) {
    if (stage === 0) {
      for (const [label, value] of [['Payment direction', 'outgoing'], ['Beneficiary on screen', 'Refund Desk'], ['Amount on screen', '800'], ['Action for this refund claim', 'cancel']]) await root.getByRole('combobox', { name: label, exact: true }).selectOption(value);
      return root.getByRole('button', { name: 'Check payment inspection', exact: true }).click();
    }
    if (stage === 1) return match(root, c.paymentRecords);
    return choose(root, 'Stop and independently verify the changed beneficiary before any payment');
  }
  if (index === 3) {
    if (stage === 0) return match(root, c.senderRows);
    if (stage === 1) return match(root, c.claimChecks);
    return choose(root, 'Inspect the actual sender and verify the specific warning through an existing trusted route');
  }
  if (index === 4) {
    if (stage === 0) {
      await root.getByRole('button', { name: 'End the call calmly', exact: true }).click();
      await root.getByRole('combobox', { name: 'Verification after ending the call', exact: true }).selectOption('known');
      return root.getByRole('button', { name: 'Check call plan', exact: true }).click();
    }
    if (stage === 1) return match(root, c.callRoutes);
    return choose(root, '“I will end this call and verify independently with a trusted adult before any payment.”');
  }
  if (index === 5) {
    if (stage === 0) return checklist(root, c.responseControls);
    if (stage === 1) {
      for (const [label, value] of [['Incident time', c.incident.time], ['Amount in rupees', c.incident.amount], ['Transaction reference', c.incident.reference], ['Supported event description', c.incident.event]]) await root.getByRole('combobox', { name: label, exact: true }).selectOption(value);
      await root.getByRole('button', { name: 'Build mock report', exact: true }).click();
      assert.equal(await root.getAttribute('data-ready'), 'false', 'unredacted mock copy is rejected');
      await root.getByRole('checkbox', { name: 'Retain the relevant receipt/message; redact unrelated personal details from this classroom copy; include no PIN or OTP', exact: true }).check();
      await root.getByRole('button', { name: 'Build mock report', exact: true }).click();
      assert.ok((await root.getByRole('status').filter({ hasText: 'MOCK REPORT ONLY' }).first().innerText()).includes('No report was submitted'));
      return;
    }
    return choose(root, 'Keep reporting promptly through trusted routes; preserve evidence and reject recovery guarantees or fees');
  }
  if (index === 6) {
    if (stage === 0) return match(root, c.capstoneRows);
    if (stage === 1) return choose(root, 'The contact confirms a refund is due, but this payee and outgoing instruction remain unverified');
    await portfolio(root);
    return match(root, c.nextActions);
  }
  if (stage === 0) return match(root, c.defenceRows);
  if (stage === 1) return choose(root, 'Reject the assistant’s test-payment advice; independently verify and explain why confidence is insufficient');
  await portfolio(root);
  return match(root, [
    { label: 'Decision to defend', answer: 'Pause the transfer and verify independently' },
    { label: 'Alternative and why it fails', answer: 'Small test payment fails to verify identity or authority' },
    { label: 'Remaining uncertainty', answer: 'Whether any genuine fee correction exists and who is authorised' },
  ]);
}
async function wrong(root, index, c) {
  if (index === 2) {
    for (const [label, value] of [['Payment direction', 'incoming'], ['Beneficiary on screen', 'Refund Desk'], ['Amount on screen', '800'], ['Action for this refund claim', 'approve']]) await root.getByRole('combobox', { name: label, exact: true }).selectOption(value);
    await root.getByRole('button', { name: 'Check payment inspection', exact: true }).click();
  } else if (index === 4) {
    await root.getByRole('button', { name: 'Send a small test payment', exact: true }).click();
  } else if (index === 5) {
    for (const control of c.responseControls) await root.getByRole('checkbox', { name: control.label, exact: true }).check();
    await root.getByRole('button', { name: 'Test protection', exact: true }).click();
    await root.getByRole('checkbox', { name: c.responseControls.at(-1).label, exact: true }).uncheck();
  } else {
    const rows = [c.pressureRows, c.offerRows, [], c.senderRows, [], [], c.capstoneRows, c.defenceRows][index];
    for (const row of rows) await root.getByRole('combobox', { name: row.label, exact: true }).selectOption(rows[0].answer);
    await root.getByRole('button', { name: 'Check my map', exact: true }).click();
  }
  assert.equal(await root.getAttribute('data-ready'), 'false');
  assert.ok(await root.locator('[data-result="retry"]').count());
}
async function noOverflow(page, label) { assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, label); }

(async () => {
  const c = await import('../app/module/cyber/lessons/senior/fraud-content.ts');
  const { CLASS11_FRAUD_SLUGS: slugs } = await import('../app/data/class-11-missions.ts');
  const errors = [];
  const browser = await playwright.chromium.launch({ channel: 'chrome', headless: true, args: ['--autoplay-policy=no-user-gesture-required'] });
  try {
    for (const [device, viewport] of [['desktop', { width: 1280, height: 1000 }], ['phone', { width: 390, height: 844 }]]) {
      const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
      const page = await context.newPage();
      page.on('pageerror', error => errors.push(`${device}: ${error.message}`));
      page.on('response', response => { if (response.status() >= 400) errors.push(`${device}: HTTP ${response.status()} ${response.url()}`); });
      await page.goto(`${base}/grade/11/cyber-fraud`);
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
        const task = c.fraudStoryTasks[index];
        await player.getByRole('button', { name: task.choices[(task.answer + 1) % 3], exact: true }).click();
        await player.getByRole('button', { name: 'Test my decision', exact: true }).click();
        assert.equal(await player.getAttribute('data-solved'), 'false');
        assert.ok((await player.getByRole('status').innerText()).length > 20);
        await player.getByRole('button', { name: task.choices[task.answer], exact: true }).click();
        await player.getByRole('button', { name: 'Test my decision', exact: true }).click();
        await page.locator(`[data-story-player="${slug}"][data-solved="true"]`).waitFor();
        await page.getByRole('button', { name: 'Scene 6: Enter the lab', exact: true }).click();
        await page.locator('audio').evaluate(audio => audio.pause());
        await page.getByRole('button', { name: 'Enter the verification lab', exact: true }).click();
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
        await page.getByRole('heading', { name: 'Your verification evidence record', exact: true }).waitFor();
        await page.getByRole('button', { name: 'Finish chapter', exact: true }).click();
        await page.locator(`[data-mission-complete="${slug}"]`).waitFor();
        await page.reload();
        await page.locator(`[data-mission-complete="${slug}"]`).waitFor();
        const saved = await page.evaluate(slug => JSON.parse(localStorage.getItem(`cybersuraksha-cyber-${slug}-v1-preview`)), slug);
        assert.equal(saved.completed, true);
        assert.equal(Object.keys(saved.state[`evidence-${slug}`]).length, 3);
        assert.equal(saved.answers[`${slug}-check-1`].correct, false);
        if (index >= 6) { assert.equal(Object.keys(saved.state[`portfolio-${slug}`]).length, 5); assert.ok(saved.state[`portfolio-${slug}`].notes.includes('outgoing')); }
        await noOverflow(page, `${device} ${slug} completion overflow`);
        console.log(`PASS ${device}: ${slug} story, wrong feedback, three labs, resume and completion`);
      }
      await context.close();
    }
    const admin = await browser.newContext();
    assert.ok((await admin.request.post(`${base}/api/auth/teacher`, { data: { email: 'teacher@dpsrkp.edu.in', password: 'Teacher@123' } })).ok());
    const className = `11T${Date.now().toString().slice(-6)}`;
    const created = await admin.request.post(`${base}/api/students`, { data: { className, students: [{ rollNo: '1', name: 'Fraud Module QA Learner' }] } });
    assert.equal(created.status(), 201);
    const learner = (await created.json()).students[0];
    const library = await (await admin.request.get(`${base}/api/lms/assignments`)).json();
    assert.equal(library.modules.filter(module => module.grades.includes(11)).length, 32);
    const classroom = library.classes.find(row => row.name === className);
    const lesson = library.modules.find(row => row.title === 'How a scam builds pressure' && row.grades.includes(11));
    const defence = library.modules.find(row => row.title === 'Defend your decision' && row.grades.includes(11));
    const assigned = await admin.request.post(`${base}/api/lms/assignments`, { data: { title: 'Fraud module QA assignment', classId: classroom.id, moduleIds: [lesson.id, defence.id], dueAt: Date.now() + 86400000, totalMarks: 100, publish: true } });
    assert.equal(assigned.status(), 201);
    const assignment = (await assigned.json()).assignment;
    const student = await browser.newContext({ viewport: { width: 1280, height: 1000 }, reducedMotion: 'reduce' });
    assert.ok((await student.request.post(`${base}/api/auth/student`, { data: { school: 'dps-rkp', className, rollNo: '1', password: learner.accessCode } })).ok());
    const page = await student.newPage();
    for (const index of [0, 7]) {
      await page.goto(`${base}/module/cyber/${slugs[index]}?grade=11`);
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
    const defenceAttempt = history.attempts.find(row => row.moduleId === defence.id && row.completedAt);
    assert.equal(defenceAttempt.score, 100);
    const portfolioEvent = history.events.find(row => row.attemptId === defenceAttempt.id && row.type === 'question_answered' && JSON.parse(row.payload).id === 'defend-your-decision-transfer');
    assert.ok(JSON.parse(portfolioEvent.payload).feedback.includes('Student reflection (teacher review): The outgoing screen'));
    const teacherPage = await admin.newPage();
    await teacherPage.goto(`${base}/teach/lms/students/${learner.id}`);
    const details = teacherPage.locator('details').filter({ hasText: 'Defend your decision' });
    await details.locator('summary').click();
    assert.ok((await details.innerText()).includes('supplied classroom replacement'));
    assert.ok((await details.innerText()).includes('Student reflection (teacher review): The outgoing screen'));

    const inbox = await (await student.request.get(`${base}/api/lms/inbox`)).json();
    assert.equal(inbox.assignments.find(row => row.id === assignment.id).progress.marks, 100);
    await page.goto(`${base}/dashboard`);
    assert.equal(await page.getByRole('link', { name: 'Continue with Your digital risk map', exact: true }).count(), 1, 'unfinished prerequisite chapters remain in the continuation order');
    await student.close(); await admin.close();
    console.log('PASS Fraud authenticated completion: server save, teacher history, assignment grading and 32-chapter library');
    const fallback = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    const quiet = await fallback.newPage();
    await quiet.route('**/how-a-scam-builds-pressure/story.mp3', route => route.abort());
    await quiet.goto(`${base}/module/cyber/how-a-scam-builds-pressure?grade=11`);
    await quiet.getByText('Audio couldn’t load. Read the captions and use Next scene.').waitFor();
    await quiet.getByRole('button', { name: 'Scene 4: Your decision', exact: true }).click();
    await quiet.getByRole('button', { name: c.fraudStoryTasks[0].choices[1], exact: true }).click();
    await quiet.getByRole('button', { name: 'Test my decision', exact: true }).click();
    await quiet.locator('[data-solved="true"]').waitFor();
    await fallback.close();
    console.log('PASS Fraud narration failure: captions and interactive decision remain usable');
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
