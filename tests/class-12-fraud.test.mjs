import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import test from 'node:test';
import { class12Missions, class12FraudMissions, CLASS12_FRAUD_SLUGS } from '../app/data/class-12-missions.ts';
import { class11Missions } from '../app/data/class-11-missions.ts';
import { class12Subjects } from '../app/data/class-12-curriculum.ts';
import { caseIncident, validateCaseFile, transfers, tracePassThrough, draftAid, testAid, dossierSources, dossierLabelled, dossierFeedback, caseworkPractice, caseworkStoryTasks } from '../app/module/cyber/lessons/senior/casework-content.ts';

test('all 32 Class 12 chapters are complete, including eight Fraud chapters in syllabus order', () => {
  assert.equal(class12Missions.length, 32);
  assert.equal(new Set(class12Missions.map(lesson => lesson.id)).size, 32);
  assert.equal(new Set(class12Missions.flatMap(lesson => lesson.assessmentIds)).size, 96);
  assert.deepEqual(class12FraudMissions.map(lesson => lesson.title), class12Subjects[3].modules.map(chapter => chapter.title));
  assert.deepEqual(class12FraudMissions.map(lesson => lesson.slug), [...CLASS12_FRAUD_SLUGS]);
  for (const lesson of class12FraudMissions) { assert.deepEqual(lesson.grades, [12]); assert.equal(lesson.strand, 'Cyber Fraud'); assert.equal(lesson.durationMinutes, 40); }
  assert.equal(new Set([...class11Missions, ...class12Missions].map(lesson => lesson.id)).size, 64);
});
test('the mock case file requires accurate supplied facts, redaction and restricted original evidence', () => {
  const good = { ...caseIncident, redacted: true, restricted: true };
  assert.equal(validateCaseFile(good).correct, true); assert.match(validateCaseFile(good).feedback, /No report was submitted/);
  for (const patch of [{ time: '15:17' }, { amount: '2300' }, { reference: 'DEMO-CF-013' }, { event: 'Attribution proven' }, { redacted: false }, { restricted: false }]) assert.equal(validateCaseFile({ ...good, ...patch }).correct, false);
});
test('transparent pass-through flags include benign context without assigning guilt or changing records', () => {
  const before = structuredClone(transfers);
  assert.deepEqual(tracePassThrough(transfers), [
    { account: 'V', incoming: 'T02', outgoing: 'T03', elapsed: 3 },
    { account: 'C', incoming: 'T04', outgoing: 'T05', elapsed: 4 },
  ]);
  assert.deepEqual(tracePassThrough([...transfers].reverse()), tracePassThrough(transfers));
  assert.deepEqual(tracePassThrough(transfers, 3).map(flag => flag.account), ['V']);
  assert.deepEqual(tracePassThrough(transfers, 0), []); assert.deepEqual(tracePassThrough([]), []);
  assert.deepEqual(transfers, before);
});
test('pattern rule enforces its time/amount boundary and rejects malformed evidence', () => {
  const input = [{ id: 'A', minute: 10, from: 'X', to: 'M', amount: 100 }, { id: 'B', minute: 15, from: 'M', to: 'Y', amount: 90 }];
  assert.equal(tracePassThrough(input).length, 1);
  for (const patch of [{ minute: 16 }, { minute: 9 }, { amount: 89 }, { amount: 101 }]) assert.equal(tracePassThrough([input[0], { ...input[1], ...patch }]).length, 0);
  for (const window of [-1, 1.5, Infinity, 61]) assert.throws(() => tracePassThrough(input, window));
  for (const patch of [{ minute: NaN }, { minute: 1440 }, { amount: 0 }, { amount: .5 }, { amount: Infinity }, { to: 'M' }]) assert.throws(() => tracePassThrough([input[0], { ...input[1], ...patch }]));
  assert.throws(() => tracePassThrough([input[0], input[0]]));
});
test('aid tests expose the weak draft and independently retain both expected safe outcomes', () => {
  const original = structuredClone(draftAid);
  assert.deepEqual(testAid(draftAid).map(result => result.passed), [false, false]);
  const revised = { contact: 'independent', payment: 'pause', help: 'prompt', evidence: 'restricted' };
  assert.deepEqual(testAid(revised).map(result => result.passed), [true, true]);
  for (const patch of [{ contact: 'appearance' }, { payment: 'approve' }]) assert.deepEqual(testAid({ ...revised, ...patch }).map(result => result.passed), [false, true]);
  for (const patch of [{ help: 'wait' }, { evidence: 'public' }]) assert.deepEqual(testAid({ ...revised, ...patch }).map(result => result.passed), [true, false]);
  assert.deepEqual(draftAid, original);
});
test('dossier sources point to completed Class 12 chapters and require honest explicit labels', () => {
  for (const [, , slug] of dossierSources) assert.ok(class12Missions.some(lesson => lesson.slug === slug && lesson.grades.includes(12)));
  const labels = Object.fromEntries(dossierSources.map(([key]) => [key, 'supplied']));
  assert.equal(dossierLabelled(labels), true); assert.equal(dossierLabelled({ ...labels, security: 'earlier' }), true);
  assert.equal(dossierLabelled({ ...labels, ai: '' }), false); assert.equal(dossierLabelled({ ...labels, logic: 'verified by AI' }), false);
});
test('source labels and the full short reflection fit the existing activity payload limit', () => {
  for (const notes of ['"'.repeat(300), '\\'.repeat(300), '\n'.repeat(300), '\u0001'.repeat(300), 'क'.repeat(300)]) {
    const draft = { security: 'earlier', ai: 'earlier', logic: 'earlier', fraud: 'earlier', notes };
    for (const slug of ['integrated-case-the-college-fest-incident', 'the-evidence-hearing']) {
      const payload = { id: `${slug}-transfer`, correct: true, kind: 'recall', category: `${slug}-casework-lab`, checkpoint: 'Practice 3 of 3', question: caseworkPractice[slug].prompts[2], feedback: 'x'.repeat(650) + dossierFeedback(draft) };
      assert.ok(JSON.stringify(payload).length <= 2000, `${slug}: full reflection fits`);
    }
  }
  assert.match(dossierFeedback({ notes: 'My evidence reflection' }), /My evidence reflection$/);
});
test('eight Fraud chapters retain six timed story scenes and project-local narration/art', async () => {
  assert.equal(caseworkStoryTasks.length, 8);
  const registry = await readFile(new URL('../app/module/cyber/lessons/lesson-registry.tsx', import.meta.url), 'utf8');
  for (const slug of CLASS12_FRAUD_SLUGS) {
    assert.ok(registry.includes(`"${slug}": Class12Fraud`));
    const script = JSON.parse(await readFile(new URL(`../app/module/cyber/lessons/new/story/chapters/${slug}.json`, import.meta.url), 'utf8'));
    assert.equal(script.scenes.length, 6); assert.equal(script.scenes[0].start, 0);
    for (const [index, scene] of script.scenes.entries()) { assert.ok(scene.caption && scene.dialogue && scene.title); if (index) assert.ok(scene.start >= script.scenes[index - 1].start + script.scenes[index - 1].duration - .001); }
    assert.ok((await stat(new URL(`../public/audio/cyber/${slug}/story.mp3`, import.meta.url))).size > 1000);
  }
  for (const name of ['fraud-casework-desk', 'fraud-evidence-hearing']) assert.ok((await stat(new URL(`../public/cyber-missions/class-12/${name}.webp`, import.meta.url))).size > 1000);
});
