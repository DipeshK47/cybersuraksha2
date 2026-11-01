import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { startWorker } from './worker-harness.mjs';
import { hashPassword } from '../app/lib/password.ts';
import { totpCode } from '../app/lib/totp.ts';

const routes = [
  ['/api/auth/teacher', 'auth/teacher'],
  ['/api/platform/auth/login', 'platform/auth/login'], ['/api/platform/auth/totp', 'platform/auth/totp'],
  ['/api/platform/auth/logout', 'platform/auth/logout'], ['/api/platform/auth/me', 'platform/auth/me'],
  ['/api/platform/auth/setup', 'platform/auth/setup'],
  // ── later tasks append routes here ──
];
const dynamic = [
  // ── later tasks append dynamic routes here ──
];
/** [method, path] for every platform route that must refuse anonymous callers and school staff. */
const PROTECTED = [
  ['GET', '/api/platform/auth/me'],
  // ── later tasks append protected routes here ──
];

const sha = value => createHash('sha256').update(value).digest('hex');
const cookieOf = response => response.headers.getSetCookie()[0].split(';')[0];

test('platform admin panel', async t => {
  const { mf, request } = await startWorker({ routes, dynamic, bindings: { PLATFORM_ADMIN_EMAIL: 'boot@cs.test' } });
  const json = async (path, cookie, method = 'GET', body, status = 200) => {
    const response = await request(path, cookie, method, body);
    const payload = await response.json();
    assert.equal(response.status, status, `${method} ${path}: ${JSON.stringify(payload)}`);
    return payload;
  };
  const login = async (path, body) => {
    const response = await request(path, null, 'POST', body);
    return { status: response.status, cookie: response.status === 200 ? cookieOf(response) : null, body: await response.json() };
  };
  const teacherLogin = (email, password) => login('/api/auth/teacher', { email, password });
  const studentLogin = (school, className, rollNo, password) => login('/api/auth/student', { school, className, rollNo, password });
  try {
    // The first teacher login runs migrations and seeds the demo school (id 1).
    const demoAdmin = (await teacherLogin('teacher@dpsrkp.edu.in', 'Teacher@123')).cookie;
    assert.ok(demoAdmin);
    const db = await mf.getD1Database('DB');
    let platform, secret, enrolledAt;

    await t.test('bootstrap creates the env admin as pending with a setup link', async () => {
      assert.equal((await request('/api/platform/auth/login', null, 'POST', { email: 'boot@cs.test', password: 'anything-at-all' })).status, 401);
      const row = await db.prepare("SELECT status, setup_token_hash FROM platform_admins WHERE email='boot@cs.test'").first();
      assert.equal(row.status, 'pending');
      assert.ok(row.setup_token_hash);
    });

    await t.test('a setup link enrols a password and 2FA exactly once', async () => {
      await db.prepare("INSERT INTO platform_admins (name,email,setup_token_hash,setup_expires_at) VALUES ('Founder','founder@cs.test',?,?)")
        .bind(sha('setup-token-founder'), Date.now() + 60_000).run();
      const setup = await json('/api/platform/auth/setup?token=setup-token-founder');
      assert.equal(setup.email, 'founder@cs.test');
      assert.match(setup.otpauthUri, /^otpauth:\/\/totp\//);
      secret = setup.secret;
      enrolledAt = Date.now();
      const body = { token: 'setup-token-founder', name: 'Founder', password: 'correct horse battery', secret };
      assert.equal((await request('/api/platform/auth/setup', null, 'POST', { ...body, password: 'short', code: await totpCode(secret, enrolledAt) })).status, 400);
      assert.equal((await request('/api/platform/auth/setup', null, 'POST', { ...body, code: '000000' })).status, 400);
      await json('/api/platform/auth/setup', null, 'POST', { ...body, code: await totpCode(secret, enrolledAt) });
      assert.equal((await request('/api/platform/auth/setup?token=setup-token-founder')).status, 400);
    });

    await t.test('login needs the password and a fresh TOTP code; codes cannot be replayed', async () => {
      const first = await login('/api/platform/auth/login', { email: 'founder@cs.test', password: 'correct horse battery' });
      assert.equal(first.status, 200);
      assert.equal(first.body.mfaRequired, true);
      platform = first.cookie;
      assert.equal((await request('/api/platform/auth/me', platform)).status, 401);
      assert.equal((await request('/api/platform/auth/totp', platform, 'POST', { code: '000000' })).status, 401);
      // The enrolment used the current step, so sign in with the next one.
      const code = await totpCode(secret, enrolledAt + 30_000);
      await json('/api/platform/auth/totp', platform, 'POST', { code });
      assert.equal((await json('/api/platform/auth/me', platform)).admin.email, 'founder@cs.test');
      const second = await login('/api/platform/auth/login', { email: 'founder@cs.test', password: 'correct horse battery' });
      assert.equal((await request('/api/platform/auth/totp', second.cookie, 'POST', { code })).status, 401);
      assert.equal((await request('/api/platform/auth/login', null, 'POST', { email: 'founder@cs.test', password: 'wrong password here' })).status, 401);
    });

    await t.test('platform routes refuse anonymous callers and school staff', async () => {
      for (const [method, path] of PROTECTED) {
        const body = method === 'GET' ? undefined : {};
        assert.equal((await request(path, null, method, body)).status, 401, `${method} ${path}`);
        assert.equal((await request(path, demoAdmin, method, body)).status, 401, `${method} ${path} as teacher`);
      }
    });

    // ── later tasks add subtests above this line ──

    await t.test('logout ends the platform session', async () => {
      await json('/api/platform/auth/logout', platform, 'POST', {});
      assert.equal((await request('/api/platform/auth/me', platform)).status, 401);
    });
  } finally {
    await mf.dispose();
  }
});
