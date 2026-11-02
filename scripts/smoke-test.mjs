#!/usr/bin/env node
// Post-deploy smoke test. Safe to run against production: it only reads, plus two logins.
//
//   node scripts/smoke-test.mjs https://your-site.example
//   SMOKE_ADMIN_EMAIL=... SMOKE_ADMIN_PASSWORD=... node scripts/smoke-test.mjs https://your-site.example
//
// Without the admin variables only the public checks run. Exits 1 if any check fails.
const base = (process.argv[2] || process.env.BASE_URL || '').replace(/\/$/, '');
if (!/^https?:\/\//.test(base)) { console.error('Usage: node scripts/smoke-test.mjs <https://site>'); process.exit(2); }
const https = base.startsWith('https://');
const { SMOKE_ADMIN_EMAIL: email, SMOKE_ADMIN_PASSWORD: password } = process.env;
const results = [];
const check = (name, ok, detail = '') => { results.push(ok); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  | ' + detail : ''}`); };
const get = (path, init = {}) => fetch(base + path, { redirect: 'manual', ...init });
const json = (path, body, headers = {}) => get(path, { method: 'POST', headers: { 'content-type': 'application/json', ...headers }, body: JSON.stringify(body) });

// 1. The site is up and sends its security headers.
const home = await get('/student-login');
check('login page loads', home.status === 200, `HTTP ${home.status}`);
const h = Object.fromEntries(home.headers);
// Cloudflare zone rules may rewrite X-Frame-Options to SAMEORIGIN; framing stays blocked by CSP frame-ancestors 'none'.
check('security headers present', h['x-content-type-options'] === 'nosniff' && ['DENY', 'SAMEORIGIN'].includes(h['x-frame-options']) && /frame-ancestors 'none'/.test(h['content-security-policy'] || '') && !!h['referrer-policy'] && !!h['permissions-policy']);
if (https) check('HSTS sent over https', !!h['strict-transport-security'], h['strict-transport-security'] || 'missing');

// 2. No demo accounts or demo data in production.
// SMOKE_DEMO=1 means the public demo teacher login is deliberately enabled
// (CYBERSURAKSHA_DEMO_TEACHER=1). The demo ADMIN must be rejected either way.
const demoOn = process.env.SMOKE_DEMO === '1';
const demoTeacherPassword = process.env.SMOKE_DEMO_PASSWORD || 'Teacher@123';
const demoAdmin = await json('/api/auth/teacher', { email: 'admin@dpsrkp.edu.in', password: 'Admin@123' });
check('demo admin login is rejected', demoAdmin.status === 401 || demoAdmin.status === 429, `HTTP ${demoAdmin.status}`);
const demoTeacher = await json('/api/auth/teacher', { email: 'teacher@dpsrkp.edu.in', password: demoTeacherPassword });
if (demoOn) {
  check('demo teacher can sign in (demo enabled)', demoTeacher.status === 200, `HTTP ${demoTeacher.status}`);
  const demoCookie = (demoTeacher.headers.getSetCookie?.().find(c => c.startsWith('cybersuraksha_session=')) || '').split(';')[0];
  if (demoCookie) {
    check('demo teacher cannot reach the admin console', (await get('/api/admin/teachers', { headers: { cookie: demoCookie } })).status === 403);
    const roster = JSON.stringify(await (await get('/api/academy', { headers: { cookie: demoCookie } })).json());
    check('demo teacher sees only demo students', /Aarav Mehta/.test(roster) && !/alice|admin/i.test(roster));
    await get('/api/auth/logout', { method: 'POST', headers: { cookie: demoCookie } });
  }
  const demoStudent = await json('/api/auth/student', { school: 'cybershiksha-demo', className: '7A', rollNo: '20', password: 'DPS20SAFE' });
  check('demo students cannot sign in', demoStudent.status === 401 || demoStudent.status === 429, `HTTP ${demoStudent.status}`);
} else {
  check('demo teacher login is rejected (demo disabled)', demoTeacher.status === 401 || demoTeacher.status === 429, `HTTP ${demoTeacher.status}`);
}
const schools = await (await get('/api/schools')).json();
check(demoOn ? 'only the demo school and your own school are listed' : 'no demo school is listed',
  demoOn ? (schools.schools || []).every(s => s.slug !== 'dps-rkp') : !(schools.schools || []).some(s => /demo|dps/.test(s.slug)), JSON.stringify((schools.schools || []).map(s => s.slug)));

// 2b. Forged-request guard: a plain-text body or a request from another site is refused.
const forged = await get('/api/auth/logout', { method: 'POST', headers: { 'content-type': 'text/plain' }, body: '{}' });
check('a text/plain API request is refused', forged.status === 415, `HTTP ${forged.status}`);
const foreign = await get('/api/auth/logout', { method: 'POST', headers: { origin: 'https://evil.example' } });
check('a request from another origin is refused', foreign.status === 403, `HTTP ${foreign.status}`);

// 3. Private files are not served.
for (const p of ['/.env', '/.git/config', '/wrangler.json', '/package.json', '/dist/server/index.js', '/db/schema.ts', '/__debug']) {
  const r = await get(p); const type = r.headers.get('content-type') || '';
  check(`${p} is not exposed`, !(r.status === 200 && !type.startsWith('text/html')), `HTTP ${r.status}`);
}

// 4. Protected endpoints refuse anonymous callers.
for (const p of ['/api/academy', '/api/analytics', '/api/admin/teachers', '/api/lms/assignments', '/api/students/1']) {
  const r = await get(p); check(`${p} needs sign-in`, r.status === 401, `HTTP ${r.status}`);
}
check('API responses are not cached', /no-store/.test((await get('/api/schools')).headers.get('cache-control') || ''));

// 5. Static narration audio is served (English and Hindi) with range support.
for (const p of ['/audio/cyber/class6-private-information/story.mp3', '/audio/cyber/class6-private-information/story-hi.mp3']) {
  const r = await get(p, { headers: { range: 'bytes=0-1023' } });
  check(`${p} streams`, r.status === 206 || r.status === 200, `HTTP ${r.status} ${r.headers.get('content-type')}`);
}

// 6. Signed-in checks (teacher/admin account).
if (email && password) {
  const t0 = performance.now();
  const login = await json('/api/auth/teacher', { email, password });
  const ms = Math.round(performance.now() - t0);
  check('admin can sign in', login.status === 200, `HTTP ${login.status}, ${ms} ms`);
  const setCookie = login.headers.getSetCookie?.().find(c => c.startsWith('cybersuraksha_session=')) || '';
  check('session cookie is HttpOnly + SameSite=Strict' + (https ? ' + Secure' : ''), /HttpOnly/.test(setCookie) && /SameSite=Strict/.test(setCookie) && (!https || /Secure/.test(setCookie)));
  const cookie = setCookie.split(';')[0];
  if (cookie) {
    check('signed-in API call works', (await get('/api/academy', { headers: { cookie } })).status === 200);
    const lesson = await get('/module/cyber/class6-private-information?grade=6', { headers: { cookie } });
    check('a lesson page loads for a teacher', lesson.status === 200, `HTTP ${lesson.status}`);
    await get('/api/auth/logout', { method: 'POST', headers: { cookie } });
    check('logout ends the session on the server', (await get('/api/academy', { headers: { cookie } })).status === 401);
  }
  const bad = await json('/api/auth/teacher', { email, password: password + '-wrong' });
  check('a wrong password is rejected', bad.status === 401 || bad.status === 429, `HTTP ${bad.status}`);
} else {
  console.log('SKIP  signed-in checks (set SMOKE_ADMIN_EMAIL and SMOKE_ADMIN_PASSWORD to run them)');
}

const failed = results.filter(ok => !ok).length;
console.log(`\n${results.length - failed}/${results.length} checks passed${failed ? `, ${failed} FAILED` : ''}`);
process.exit(failed ? 1 : 0);
