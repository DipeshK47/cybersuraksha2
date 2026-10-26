import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import test from 'node:test';
import { class12Missions, class12AiMissions, CLASS12_AI_SLUGS } from '../app/data/class-12-missions.ts';
import { class12Subjects } from '../app/data/class-12-curriculum.ts';
import { classificationMetrics, errorCost, resultSheets, fitsAcceptance, auditSplit, splitRecords, shiftSummary, assuranceStoryTasks, groupSheets } from '../app/module/cyber/lessons/senior/assurance-content.ts';

test('Class 12 publishes all eight AI syllabus chapters and 32 unique completed chapters overall', () => {
  assert.equal(class12Missions.length, 32);
  assert.equal(new Set(class12Missions.map(lesson => lesson.id)).size, 32);
  assert.equal(new Set(class12Missions.flatMap(lesson => lesson.assessmentIds)).size, 96);
  assert.deepEqual(class12AiMissions.map(lesson => lesson.title), class12Subjects[1].modules.map(chapter => chapter.title));
  assert.deepEqual(class12AiMissions.map(lesson => lesson.slug), [...CLASS12_AI_SLUGS]);
  for (const lesson of class12AiMissions) { assert.deepEqual(lesson.grades, [12]); assert.equal(lesson.strand, 'Artificial Intelligence'); assert.equal(lesson.durationMinutes, 40); }
});
test('confusion metrics use the correct denominator and keep undefined separate from zero', () => {
  assert.deepEqual(classificationMetrics(resultSheets[1].matrix), { total: 100, accuracy: .95, precision: .5, recall: .2, flagged: 2 });
  assert.deepEqual(classificationMetrics(resultSheets[2].matrix), { total: 100, accuracy: .93, precision: .4, recall: .8, flagged: 10 });
  assert.deepEqual(classificationMetrics(resultSheets[0].matrix), { total: 100, accuracy: .95, precision: null, recall: 0, flagged: 0 });
  assert.deepEqual(classificationMetrics({ tp: 0, fp: 0, fn: 0, tn: 0 }), { total: 0, accuracy: null, precision: null, recall: null, flagged: 0 });
  for (const tp of [-1, .5, NaN, Infinity]) assert.throws(() => classificationMetrics({ tp, fp: 0, fn: 0, tn: 0 }));
  assert.throws(() => classificationMetrics({ tp: Number.MAX_SAFE_INTEGER, fp: 1, fn: 0, tn: 0 }));
});
test('cost changes can reverse the preferred comparator without hiding its misses', () => {
  assert.deepEqual(resultSheets.map(sheet => errorCost(sheet.matrix, 5, 1)), [25, 21, 11]);
  assert.deepEqual(resultSheets.map(sheet => errorCost(sheet.matrix, 1, 5)), [5, 9, 31]);
  assert.deepEqual(resultSheets.map(sheet => fitsAcceptance(sheet.matrix)), [false, false, true]);
  assert.equal(fitsAcceptance({ tp: 4, fp: 7, fn: 1, tn: 88 }), false, 'review capacity is enforced even when recall is sufficient');
  for (const cost of [-1, NaN, Infinity]) assert.throws(() => errorCost(resultSheets[1].matrix, cost, 1));
});
test('leakage audit detects related families and accepts different valid non-empty repairs', () => {
  const initial = Object.fromEntries(splitRecords.map(record => [record.id, record.initial]));
  const repaired = Object.fromEntries(splitRecords.map(record => [record.id, record.repaired]));
  const before = structuredClone(splitRecords);
  assert.deepEqual(auditSplit(splitRecords, initial).overlaps, ['A', 'D']);
  assert.equal(auditSplit(splitRecords, initial).valid, false);
  assert.deepEqual(auditSplit(splitRecords, repaired), { valid: true, overlaps: [], counts: { Training: 4, Validation: 2, 'Final test': 2 } });
  assert.equal(auditSplit(splitRecords, { ...repaired, S1: 'Final test', S2: 'Final test', S5: 'Training', S8: 'Training' }).valid, true);
  assert.equal(auditSplit(splitRecords, Object.fromEntries(splitRecords.map(record => [record.id, 'Training']))).valid, false);
  const missing = { ...repaired }; delete missing.S2;
  for (const manifest of [missing, { ...repaired, EXTRA: 'Training' }, { ...repaired, S2: 'invented' }]) assert.equal(auditSplit(splitRecords, manifest).valid, false);
  assert.equal(auditSplit([...splitRecords, splitRecords[0]], repaired).valid, false);
  assert.deepEqual(splitRecords, before);
});
test('shift summaries count wrong labels and abstentions separately and keep group denominators visible', () => {
  assert.deepEqual(shiftSummary('Bright'), { total: 2, correct: 2, review: 0, wrong: 0 });
  assert.deepEqual(shiftSummary('Dim'), { total: 2, correct: 1, review: 0, wrong: 1 });
  assert.deepEqual(shiftSummary('Crop'), { total: 2, correct: 0, review: 1, wrong: 1 });
  assert.deepEqual(shiftSummary('unknown'), { total: 0, correct: 0, review: 0, wrong: 0 });
  assert.deepEqual(groupSheets.map(group => classificationMetrics(group.matrix).recall), [.8, .4]);
  assert.ok(groupSheets.every(group => group.matrix.tp + group.matrix.fn === 5));
});
test('eight AI stories retain the timed six-scene contract and project-local media', async () => {
  assert.equal(assuranceStoryTasks.length, 8);
  const registry = await readFile(new URL('../app/module/cyber/lessons/lesson-registry.tsx', import.meta.url), 'utf8');
  for (const slug of CLASS12_AI_SLUGS) {
    assert.ok(registry.includes(`"${slug}": Class12AI`));
    const script = JSON.parse(await readFile(new URL(`../app/module/cyber/lessons/new/story/chapters/${slug}.json`, import.meta.url), 'utf8'));
    assert.equal(script.scenes.length, 6); assert.equal(script.scenes[0].start, 0);
    for (const [index, scene] of script.scenes.entries()) { assert.ok(scene.caption && scene.dialogue && scene.title); if (index) assert.ok(scene.start >= script.scenes[index - 1].start + script.scenes[index - 1].duration - .001); }
    assert.ok((await stat(new URL(`../public/audio/cyber/${slug}/story.mp3`, import.meta.url))).size > 1000);
  }
  for (const name of ['ai-evaluation-workshop', 'ai-evidence-workbench', 'ai-vision-contact-sheet']) assert.ok((await stat(new URL(`../public/cyber-missions/class-12/${name}.webp`, import.meta.url))).size > 1000);
});
