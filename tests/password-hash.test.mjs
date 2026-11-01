import assert from 'node:assert/strict';
import test from 'node:test';
import {
  DEFAULT_ITERATIONS, MAX_ITERATIONS, MIN_ITERATIONS,
  configuredIterations, hashPassword, needsRehash, verifyPassword,
} from '../app/lib/password.ts';

const KEY = 'CYBERSURAKSHA_PBKDF2_ITERATIONS';
const iterationsOf = hash => Number(hash.split('$')[1]);
async function withSetting(value, fn) {
  const before = process.env[KEY];
  if (value === undefined) delete process.env[KEY]; else process.env[KEY] = value;
  try { return await fn(); } finally { if (before === undefined) delete process.env[KEY]; else process.env[KEY] = before; }
}

test('new hashes default to a work factor that fits the Workers Free 10 ms CPU limit', async () => {
  await withSetting(undefined, async () => {
    assert.equal(DEFAULT_ITERATIONS, 10_000);
    assert.equal(configuredIterations(), 10_000);
    const hash = await hashPassword('Correct#Horse9');
    assert.match(hash, /^pbkdf2\$10000\$[A-Za-z0-9+/=]+\$[A-Za-z0-9+/=]+$/);
  });
});

test('the work factor can be raised by a setting, and is clamped to what Cloudflare accepts', async () => {
  await withSetting('50000', () => assert.equal(configuredIterations(), 50_000));
  await withSetting('999999', () => assert.equal(configuredIterations(), MAX_ITERATIONS));
  await withSetting('10', () => assert.equal(configuredIterations(), MIN_ITERATIONS));
  for (const bad of ['abc', '', ' ', 'NaN']) await withSetting(bad, () => assert.equal(configuredIterations(), DEFAULT_ITERATIONS, `value ${JSON.stringify(bad)}`));
  await withSetting('100000', async () => assert.equal(iterationsOf(await hashPassword('x')), 100_000));
});

test('hashes verify, wrong passwords and malformed hashes do not', async () => {
  const hash = await hashPassword('Correct#Horse9');
  assert.equal(await verifyPassword('Correct#Horse9', hash), true);
  assert.equal(await verifyPassword('correct#horse9', hash), false);
  assert.equal(await verifyPassword('', hash), false);
  for (const bad of ['', 'plain', 'pbkdf2$10000$x', 'bcrypt$10$a$b', 'pbkdf2$0$AAAA$AAAA', 'pbkdf2$abc$AAAA$AAAA', 'pbkdf2$10000$!!$!!'])
    assert.equal(await verifyPassword('Correct#Horse9', bad), false, bad);
});

test('two hashes of one password differ (random salt)', async () => {
  const [a, b] = await Promise.all([hashPassword('same'), hashPassword('same')]);
  assert.notEqual(a, b);
});

test('hashes made with a stronger work factor (for example in an older database) still verify', async () => {
  const legacy = await hashPassword('Legacy#Pass1', 210_000);
  assert.equal(iterationsOf(legacy), 210_000);
  assert.equal(await verifyPassword('Legacy#Pass1', legacy), true);
});

test('needsRehash upgrades weaker hashes after the work factor is raised, and never downgrades stronger ones', async () => {
  const weak = await hashPassword('p', 10_000), strong = await hashPassword('p', 210_000);
  await withSetting(undefined, () => { assert.equal(needsRehash(weak), false); assert.equal(needsRehash(strong), false); });
  await withSetting('100000', () => { assert.equal(needsRehash(weak), true); assert.equal(needsRehash(strong), false); });
  assert.equal(needsRehash('not-a-hash'), false);
  assert.equal(needsRehash('pbkdf2$abc$x$y'), false);
});
