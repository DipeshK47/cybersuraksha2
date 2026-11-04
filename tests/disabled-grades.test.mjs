import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { loadSource, root } from './class-9-helpers.mjs';

const read = file => readFileSync(join(root, file), 'utf8');
const policy = await loadSource(`export {schoolGrades,platformDisabledGrades,availableSchoolGrades,permitsModule} from './app/lib/content-policy';`);

test('Classes 3, 4 and 5 are switched off for every school, and nothing else is', () => {
  assert.deepEqual([...policy.platformDisabledGrades], [3, 4, 5]);
  assert.deepEqual(policy.availableSchoolGrades, [6, 7, 8, 9, 10, 11, 12]);
  // The content itself is kept: the product still knows about every class.
  assert.deepEqual(policy.schoolGrades, [3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
});

test('a switched-off class cannot reach a module even if a school setting still lists it', () => {
  // schoolContent() drops disabled classes, so the access a school gets never contains 3-5.
  const access = { schoolName: 'x', grades: policy.schoolGrades.filter(g => !policy.platformDisabledGrades.includes(g)), subjects: ['Cybersecurity'] };
  assert.equal(policy.permitsModule(access, { grades: [3], strand: 'Cybersecurity' }), false);
  assert.equal(policy.permitsModule(access, { grades: [3, 6], strand: 'Cybersecurity' }), true);
});

test('every school reads its classes through the filter, and principals cannot turn them back on', () => {
  const access = read('app/lib/content-access.ts');
  assert.match(access, /grades\.filter\(grade => !platformDisabledGrades\.includes\(grade\)\)/);
  const school = read('app/api/admin/school/route.ts');
  assert.match(school, /availableGrades: availableSchoolGrades/);
  assert.match(school, /refine\(value => availableSchoolGrades\.includes\(value\)\)/);
});
