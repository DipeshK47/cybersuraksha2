import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import test from 'node:test';
import { class12Missions, class12CtMissions, CLASS12_CT_SLUGS } from '../app/data/class-12-missions.ts';
import { class12Subjects } from '../app/data/class-12-curriculum.ts';
import { removalTrace, operationCounts, reconcileRegistrations, registrations, checkIns, parseAlert, runAlertPipeline, mixedAlerts, retryAlerts, runRegression, observedRate, reliabilityStoryTasks } from '../app/module/cyber/lessons/senior/reliability-content.ts';

test('Class 12 CT publishes all eight syllabus chapters and 32 unique completed chapters overall', () => {
  assert.equal(class12Missions.length, 32);
  assert.equal(new Set(class12Missions.map(lesson => lesson.id)).size, 32);
  assert.equal(new Set(class12Missions.flatMap(lesson => lesson.assessmentIds)).size, 96);
  assert.deepEqual(class12CtMissions.map(lesson => lesson.title), class12Subjects[2].modules.map(chapter => chapter.title));
  assert.deepEqual(class12CtMissions.map(lesson => lesson.slug), [...CLASS12_CT_SLUGS]);
  for (const lesson of class12CtMissions) { assert.deepEqual(lesson.grades, [12]); assert.equal(lesson.strand, 'Computational Thinking'); assert.equal(lesson.durationMinutes, 40); }
});
test('stack and queue traces remove opposite ends without changing the original arrays', () => {
  const stack = ['U1', 'U2', 'U3'], queue = ['T1', 'T2', 'T3'];
  assert.deepEqual(removalTrace(stack, queue), { undone: 'U3', served: 'T1', stack: ['U1', 'U2'], queue: ['T2', 'T3'] });
  assert.deepEqual(stack, ['U1', 'U2', 'U3']); assert.deepEqual(queue, ['T1', 'T2', 'T3']);
  assert.deepEqual(removalTrace([], []), { undone: null, served: null, stack: [], queue: [] });
});
test('operation counts are produced by the specified probes and unordered-pair loop', () => {
  assert.deepEqual([8, 16, 32].map(operationCounts), [
    { n: 8, direct: 1, binary: 4, linear: 8, pairs: 28 },
    { n: 16, direct: 1, binary: 5, linear: 16, pairs: 120 },
    { n: 32, direct: 1, binary: 6, linear: 32, pairs: 496 },
  ]);
  assert.equal(operationCounts(128).pairs, 8128);
  assert.deepEqual(operationCounts(0), { n: 0, direct: 0, binary: 0, linear: 0, pairs: 0 });
  for (const n of [-1, .5, NaN, Infinity, 1025]) assert.throws(() => operationCounts(n));
});
test('stable-ID reconciliation retains conflicting, repeated, unmatched and unknown cases', () => {
  const original = structuredClone({ registrations, checkIns });
  assert.deepEqual(reconcileRegistrations(registrations, checkIns).map(row => [row.id, row.outcome]), [
    ['R01', 'Repeated check-in · review'], ['R02', 'Registration ID conflict · review'],
    ['R03', 'No check-in record · attendance unknown'], ['R04', 'Matched registration and check-in'], ['R05', 'Unmatched check-in · review'],
  ]);
  assert.deepEqual(reconcileRegistrations([], []), []);
  assert.equal(reconcileRegistrations([registrations[0], registrations[0]], [checkIns[0]])[0].outcome, 'Registration ID conflict · review');
  assert.deepEqual({ registrations, checkIns }, original);
});
test('alert validation rejects missing/coerced/invalid data and keeps zero as a supplied score', () => {
  for (const value of [0, .5, 70, 100]) assert.equal(parseAlert({ id: 'A01', category: 'latency', value }).alert.value, value);
  for (const value of [null, undefined, '', '70', false, NaN, Infinity, -1, 101]) assert.equal(parseAlert({ id: 'A01', category: 'latency', value }).alert, null);
  for (const record of [null, [], 'row', {}, { id: '__proto__', category: 'latency', value: 70 }, { id: ' A01 ', category: 'latency', value: 70 }]) assert.equal(parseAlert(record).alert, null);
  const capacity = { id: 'A07', category: 'capacity', value: 75 };
  assert.equal(parseAlert(capacity).alert, null); assert.deepEqual(parseAlert(capacity, true).alert, capacity);
});
test('pipeline preserves originals, quarantines invalid/conflicting inputs and never silently overwrites an event', () => {
  const before = structuredClone(mixedAlerts);
  const result = runAlertPipeline(mixedAlerts);
  assert.deepEqual(Object.values(result.ledger).map(row => [row.id, row.route]), [['A01', 'Review'], ['A02', 'Record only']]);
  assert.equal(result.quarantine.length, 2); assert.deepEqual(mixedAlerts, before);
  const base = { id: 'A01', category: 'latency', value: 70 };
  const identical = runAlertPipeline([base, { ...base }]);
  assert.equal(Object.keys(identical.ledger).length, 1); assert.deepEqual(identical.skipped, ['A01']);
  for (const changed of [{ ...base, value: 5 }, { ...base, value: 999 }, { ...base, category: 'unsupported' }]) {
    const conflict = runAlertPipeline([base, changed]);
    assert.equal(Object.keys(conflict.ledger).length, 0); assert.equal(conflict.quarantine.length, 2);
  }
  const prior = runAlertPipeline([base]).ledger; const saved = structuredClone(prior);
  const conflict = runAlertPipeline([{ ...base, value: 5 }], prior);
  assert.equal(conflict.quarantine.length, 1); assert.deepEqual(conflict.ledger, saved); assert.deepEqual(prior, saved);
});
test('checkpointed retry retains pending work and skips only confirmed identical committed events', () => {
  const first = runAlertPipeline(retryAlerts, {}, { failOnId: 'A02' });
  assert.equal(first.stopped, true); assert.deepEqual(Object.keys(first.ledger), ['A01']); assert.deepEqual(first.pending, ['A02', 'A03']);
  const stillFailed = runAlertPipeline(retryAlerts, first.ledger, { failOnId: 'A02' });
  assert.equal(stillFailed.stopped, true); assert.deepEqual(stillFailed.pending, ['A02', 'A03']);
  const reordered = runAlertPipeline([retryAlerts[1], retryAlerts[0]], first.ledger, { failOnId: 'A02' });
  assert.deepEqual(reordered.pending, ['A02']); assert.deepEqual(reordered.skipped, ['A01']);
  const resumed = runAlertPipeline(retryAlerts, first.ledger);
  assert.deepEqual(Object.keys(resumed.ledger), ['A01', 'A02', 'A03']); assert.deepEqual(resumed.skipped, ['A01']); assert.equal(resumed.stopped, false); assert.deepEqual(resumed.pending, []);
  const repeated = runAlertPipeline(retryAlerts, resumed.ledger);
  assert.deepEqual(repeated.ledger, resumed.ledger); assert.deepEqual(repeated.skipped, ['A01', 'A02', 'A03']);
  const empty = runAlertPipeline([], resumed.ledger); assert.deepEqual(empty.ledger, resumed.ledger); assert.equal(empty.stopped, false);
  assert.deepEqual(Object.keys(first.ledger), ['A01'], 'later runs do not mutate the checkpoint');
});
test('eight-case regression pack catches an old boundary regression and loss of the new category', () => {
  assert.equal(runRegression().length, 8); assert.ok(runRegression().every(row => row.passed));
  assert.deepEqual(runRegression(false).filter(row => !row.passed).map(row => row.id), ['T2']);
  assert.deepEqual(runRegression(true, false).filter(row => !row.passed).map(row => row.id), ['T7']);
  assert.deepEqual(runRegression(false, false).filter(row => !row.passed).map(row => row.id), ['T2', 'T7']);
  const inputs = [79, 80, 81].map(value => ({ id: `A${value}`, category: 'capacity', value }));
  const previous = runAlertPipeline(inputs, {}, { allowCapacity: true });
  const revised = runAlertPipeline(inputs, {}, { allowCapacity: true, threshold: 80 });
  assert.deepEqual(Object.values(revised.ledger).map(row => row.route), ['Record only', 'Review', 'Review']);
  assert.equal(previous.ledger.A79.route, 'Review', 'separate version output preserves previous results');
  for (const threshold of [-1, 101, NaN, Infinity]) assert.throws(() => runAlertPipeline([], {}, { threshold }));
});
test('observed rates use explicit valid denominators without inventing missing outcomes', () => {
  assert.equal(observedRate(20, 100), .2); assert.equal(observedRate(30, 300), .1);
  assert.equal(observedRate(0, 0), null); assert.equal(observedRate(0, 10), 0);
  for (const [flagged, observed] of [[1, 0], [11, 10], [-1, 10], [1, NaN], [1.5, 10]]) assert.throws(() => observedRate(flagged, observed));
});
test('all eight CT stories have six timed scenes and local narration/artwork', async () => {
  assert.equal(reliabilityStoryTasks.length, 8);
  const registry = await readFile(new URL('../app/module/cyber/lessons/lesson-registry.tsx', import.meta.url), 'utf8');
  for (const slug of CLASS12_CT_SLUGS) {
    assert.ok(registry.includes(`"${slug}": Class12CT`));
    const script = JSON.parse(await readFile(new URL(`../app/module/cyber/lessons/new/story/chapters/${slug}.json`, import.meta.url), 'utf8'));
    assert.equal(script.scenes.length, 6); assert.equal(script.scenes[0].start, 0);
    for (const [index, scene] of script.scenes.entries()) { assert.ok(scene.caption && scene.dialogue && scene.title); if (index) assert.ok(scene.start >= script.scenes[index - 1].start + script.scenes[index - 1].duration - .001); }
    assert.ok((await stat(new URL(`../public/audio/cyber/${slug}/story.mp3`, import.meta.url))).size > 1000);
  }
  for (const name of ['ct-registration-workbench', 'ct-alerts-pipeline']) assert.ok((await stat(new URL(`../public/cyber-missions/class-12/${name}.webp`, import.meta.url))).size > 1000);
});
