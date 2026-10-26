import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import test from 'node:test';
import { class11FraudMissions, CLASS11_FRAUD_SLUGS, class11Missions } from '../app/data/class-11-missions.ts';
import { class11Subjects } from '../app/data/class-11-curriculum.ts';
import { inspectPayment, validateMockReport, incident, fraudStoryTasks, portfolioItems, portfolioFeedback, fraudPractice } from '../app/module/cyber/lessons/senior/fraud-content.ts';

test('Class 11 publishes all 32 chapters, including eight fraud chapters in syllabus order', () => {
  assert.equal(class11Missions.length, 32);
  assert.equal(new Set(class11Missions.map(lesson => lesson.id)).size, 32);
  assert.equal(new Set(class11Missions.flatMap(lesson => lesson.assessmentIds)).size, 96);
  assert.deepEqual(class11FraudMissions.map(lesson => lesson.title), class11Subjects[3].modules.map(chapter => chapter.title));
  assert.deepEqual(class11FraudMissions.map(lesson => lesson.slug), [...CLASS11_FRAUD_SLUGS]);
  for (const lesson of class11FraudMissions) {
    assert.deepEqual(lesson.grades, [11]); assert.equal(lesson.strand, 'Cyber Fraud');
    assert.equal(lesson.durationMinutes, 40); assert.equal(lesson.assessmentIds.length, 3);
  }
});
test('payment inspection requires direction, beneficiary, amount and cancellation together', () => {
  const good = { direction: 'outgoing', payee: 'Refund Desk', amount: '800', action: 'cancel' };
  assert.equal(inspectPayment(good).correct, true);
  for (const patch of [{ direction: 'incoming' }, { payee: 'School Festival' }, { amount: '80' }, { amount: '800.0' }, { action: 'approve' }, { action: '' }]) assert.equal(inspectPayment({ ...good, ...patch }).correct, false);
  assert.match(inspectPayment({ ...good, action: 'approve' }).feedback, /Cancel/);
});
test('mock report rejects invented receipt details and an unredacted classroom copy', () => {
  const good = { time: incident.time, amount: incident.amount, reference: incident.reference, event: incident.event, redacted: true };
  assert.equal(validateMockReport(good).correct, true);
  assert.match(validateMockReport(good).feedback, /No report was submitted/);
  for (const patch of [{ time: '14:21' }, { amount: '80' }, { reference: 'DEMO-TXN-240' }, { event: 'Guaranteed recovery' }, { redacted: false }]) assert.equal(validateMockReport({ ...good, ...patch }).correct, false);
  assert.equal(validateMockReport({ ...good, reference: '' }).correct, false);
});
test('the annual portfolio includes security, AI, logic and payment evidence with playable chapter links', () => {
  assert.deepEqual(portfolioItems.map(item => item[0]), ['security', 'ai', 'logic', 'payment']);
  for (const item of portfolioItems) assert.ok(class11Missions.some(lesson => lesson.slug === item[2]));
});
test('all fraud stories retain decisions, timed narration and local illustrations', async () => {
  assert.equal(fraudStoryTasks.length, 8);
  const registry = await readFile(new URL('../app/module/cyber/lessons/lesson-registry.tsx', import.meta.url), 'utf8');
  for (const slug of CLASS11_FRAUD_SLUGS) {
    assert.ok(registry.includes(`"${slug}": Class11Fraud`));
    const script = JSON.parse(await readFile(new URL(`../app/module/cyber/lessons/new/story/chapters/${slug}.json`, import.meta.url), 'utf8'));
    assert.equal(script.scenes.length, 6); assert.equal(script.scenes[0].start, 0);
    for (const [index, scene] of script.scenes.entries()) {
      assert.ok(scene.caption && scene.dialogue && scene.title && scene.status);
      if (index) assert.ok(scene.start >= script.scenes[index - 1].start + script.scenes[index - 1].duration - .001);
    }
    assert.ok((await stat(new URL(`../public/audio/cyber/${slug}/story.mp3`, import.meta.url))).size > 1000);
  }
  for (const name of ['fraud-offer-desk', 'fraud-payment-pause']) assert.ok((await stat(new URL(`../public/cyber-missions/class-11/${name}.webp`, import.meta.url))).size > 1000);
});

test('portfolio reflections stay complete within the activity payload budget, including escaped text', () => {
  for (const notes of ['"'.repeat(300), '\\'.repeat(300), '\n'.repeat(300), '\u0001'.repeat(300), 'क'.repeat(300)]) {
    const draft = { security: 'earlier', ai: 'earlier', logic: 'earlier', payment: 'earlier', notes };
    for (const slug of ['integrated-case-the-festival-refund', 'defend-your-decision']) {
      const payload = { id: `${slug}-transfer`, correct: true, kind: 'recall', category: `${slug}-verification-lab`, checkpoint: 'Practice 3 of 3', question: fraudPractice[slug].prompts[2], feedback: 'x'.repeat(500) + portfolioFeedback(draft) };
      assert.ok(JSON.stringify(payload).length <= 2000, `${slug}: full escaped reflection fits`);
    }
  }
  assert.match(portfolioFeedback({ notes: 'A short reflection' }), /A short reflection$/);
});
