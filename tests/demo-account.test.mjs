import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { DEMO_TEACHER_PASSWORD_HASH, UNUSABLE_STUDENT_HASH } from '../app/lib/demo-account.ts';
import { verifyPassword } from '../app/lib/password.ts';

const academy = await readFile(new URL('../db/academy.ts', import.meta.url), 'utf8');

test('the precomputed demo teacher hash is the public demo password and nothing else', async () => {
  assert.equal(await verifyPassword('Teacher@123', DEMO_TEACHER_PASSWORD_HASH), true);
  for (const wrong of ['teacher@123', 'Admin@123', '', 'Teacher@1234'])
    assert.equal(await verifyPassword(wrong, DEMO_TEACHER_PASSWORD_HASH), false, wrong);
});

test('no demo student can be signed in as: the shared hash matches none of the known demo codes', async () => {
  for (const code of ['DPS20SAFE', 'DPS21SAFE', 'DPS22SAFE', 'DPS31SAFE', 'Teacher@123', 'Admin@123', 'password'])
    assert.equal(await verifyPassword(code, UNUSABLE_STUDENT_HASH), false, code);
});

test('hashes are cheap to verify and fit the Workers Free plan (10,000 iterations)', () => {
  for (const hash of [DEMO_TEACHER_PASSWORD_HASH, UNUSABLE_STUDENT_HASH]) assert.match(hash, /^pbkdf2\$10000\$/);
});

test('the production demo seed never creates the demo admin and never gives students a usable code', () => {
  assert.match(academy, /safe \? \[DEMO_TEACHER\] : \[DEMO_ADMIN, DEMO_TEACHER\]/, 'safe mode seeds the teacher only');
  assert.match(academy, /safe \? UNUSABLE_STUDENT_HASH : await hashPassword\(student\.accessCode\)/);
  assert.match(academy, /const demoSchool = safe \? SAFE_DEMO_SCHOOL : DEMO_SCHOOL/, 'a separate school, not the dev demo school');
});

test('the demo login is an explicit opt-in and the old demo switch still never runs in production', () => {
  assert.match(academy, /process\.env\.CYBERSURAKSHA_DEMO_TEACHER === "1"/);
  assert.match(academy, /if \(process\.env\.CYBERSURAKSHA_DEMO_SEED === "1"\) return true;\s+return process\.env\.NODE_ENV !== "production";/);
  // A configured real admin must still win over the full demo (which contains the demo admin).
  assert.match(academy, /seedDemoAcademy\(true\)/, 'the opt-in demo is the safe one');
  assert.match(academy, /if \(realAdmin\) await seedRealAdmin\(realAdmin\);\s+else if \(demoSeedAllowed\(\)\) return seedDemoAcademy\(false\);/);
});

test('the settings are documented for operators', async () => {
  const doc = await readFile(new URL('../DEPLOYMENT.md', import.meta.url), 'utf8');
  for (const name of ['CYBERSURAKSHA_DEMO_TEACHER', 'CYBERSURAKSHA_DEMO_TEACHER_PASSWORD']) assert.ok(doc.includes(name), name);
});
