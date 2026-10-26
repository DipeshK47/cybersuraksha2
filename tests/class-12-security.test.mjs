import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import test from 'node:test';
import { class12SecurityMissions as class12Missions, CLASS12_SECURITY_SLUGS } from '../app/data/class-12-missions.ts';
import { class12Subjects } from '../app/data/class-12-curriculum.ts';
import { portalResult, portalCases, dependencyBudget, correctedTimeline, logEvents, snapshots, verifyRecovery, expectedRecords, systemStoryTasks } from '../app/module/cyber/lessons/senior/system-content.ts';

test('Class 12 lists the full syllabus and retains its eight completed Cybersecurity chapters', () => {
  assert.equal(class12Subjects.length, 4);
  assert.ok(class12Subjects.every(subject => subject.modules.length === 8));
  assert.equal(class12Missions.length, 8);
  assert.deepEqual(class12Missions.map(lesson => lesson.title), class12Subjects[0].modules.map(chapter => chapter.title));
  assert.deepEqual(class12Missions.map(lesson => lesson.slug), [...CLASS12_SECURITY_SLUGS]);
  assert.equal(new Set(class12Missions.flatMap(lesson => lesson.assessmentIds)).size, 24);
  for (const lesson of class12Missions) { assert.deepEqual(lesson.grades, [12]); assert.equal(lesson.strand, 'Cybersecurity'); assert.equal(lesson.durationMinutes, 40); }
});
test('server-model corrections preserve the valid path and reject distinct misuse cases', () => {
  const fixed = { authorisation: true, validation: true, safeData: true };
  const broken = { authorisation: false, validation: false, safeData: false };
  assert.deepEqual(portalCases.map(test => portalResult(test.request, fixed)), portalCases.map(test => test.expected));
  assert.equal(portalCases.filter(test => portalResult(test.request, broken) !== test.expected).length, 3);
  const own = { session: 'Asha', id: 'R10', amount: 100 };
  assert.equal(portalResult({ ...own, session: null }, broken), 'Sign in required');
  assert.equal(portalResult({ ...own, id: 'R20' }, fixed), 'Deny other-owner record');
  for (const amount of [-1, 5001, 1.5, NaN, Infinity]) assert.equal(portalResult({ ...own, amount }, fixed), 'Reject amount');
  for (const amount of [0, 5000]) assert.equal(portalResult({ ...own, amount }, fixed), 'Allow request');
  assert.equal(portalResult({ ...own, id: 'unknown' }, fixed), 'No matching record; input remains data');
});
test('the supplier budget counts unique known controls and rejects incomplete or unsafe allocations', () => {
  assert.deepEqual(dependencyBudget(['scope', 'secrets', 'recovery']), { cost: 6, complete: true });
  assert.deepEqual(dependencyBudget(['scope', 'scope', 'secrets', 'recovery']), { cost: 6, complete: true });
  for (const selected of [[], ['scope', 'secrets'], ['scope', 'secrets', 'recovery', 'badge'], ['scope', 'secrets', 'recovery', 'unknown']]) assert.equal(dependencyBudget(selected).complete, false);
});
test('timeline applies only the supplied fast-clock correction and preserves raw evidence', () => {
  const before = structuredClone(logEvents);
  const fixed = correctedTimeline(logEvents, 2);
  assert.deepEqual(fixed.map(event => [event.id, event.minute]), [['E1', 840], ['E2', 841], ['E3', 842], ['E4', 842]]);
  assert.equal(correctedTimeline(logEvents, 0).at(-1).id, 'E2');
  assert.equal(fixed.find(event => event.id === 'E2').rawMinute, 843);
  assert.deepEqual(logEvents, before);
  assert.deepEqual(correctedTimeline([], 2), []);
  for (const correction of [-1, NaN, Infinity]) assert.throws(() => correctedTimeline(logEvents, correction));
});
test('recovery tests exact identity/status, permissions and both objective boundaries', () => {
  const good = snapshots[1];
  assert.deepEqual(verifyRecovery(good), { complete: true, access: true, time: true, point: true });
  assert.deepEqual(verifyRecovery(snapshots[0]), { complete: false, access: false, time: true, point: true });
  assert.equal(verifyRecovery({ ...good, rows: [...good.rows.slice(0, 3), good.rows[0]] }).complete, false, 'same count with a duplicate cannot pass');
  assert.equal(verifyRecovery({ ...good, rows: good.rows.map(row => ({ ...row, status: 'Wrong' })) }).complete, false);
  assert.equal(verifyRecovery({ ...good, rows: [...good.rows, { id: 'EXTRA', status: 'Confirmed' }] }).complete, false);
  assert.equal(verifyRecovery({ ...good, leadCanEdit: false }).access, false);
  assert.equal(verifyRecovery({ ...good, minute: 839 }).point, false);
  assert.equal(verifyRecovery({ ...good, minute: 851 }).point, false);
  assert.equal(verifyRecovery(good, 880).time, true);
  assert.equal(verifyRecovery(good, 881).time, false);
  assert.equal(verifyRecovery(good, 849).time, false);
  assert.equal(expectedRecords.length, 4);
});
test('all Class 12 story decisions and local media are registered with six-scene narration', async () => {
  assert.equal(systemStoryTasks.length, 8);
  const registry = await readFile(new URL('../app/module/cyber/lessons/lesson-registry.tsx', import.meta.url), 'utf8');
  for (const slug of CLASS12_SECURITY_SLUGS) {
    assert.ok(registry.includes(`"${slug}": Class12Security`));
    const script = JSON.parse(await readFile(new URL(`../app/module/cyber/lessons/new/story/chapters/${slug}.json`, import.meta.url), 'utf8'));
    assert.equal(script.scenes.length, 6); assert.equal(script.scenes[0].start, 0);
    for (const [index, scene] of script.scenes.entries()) { assert.ok(scene.caption && scene.dialogue && scene.title); if (index) assert.ok(scene.start >= script.scenes[index - 1].start + script.scenes[index - 1].duration - .001); }
    assert.ok((await stat(new URL(`../public/audio/cyber/${slug}/story.mp3`, import.meta.url))).size > 1000);
  }
  for (const name of ['portal-design-room', 'incident-recovery-room']) assert.ok((await stat(new URL(`../public/cyber-missions/class-12/${name}.webp`, import.meta.url))).size > 1000);
});
