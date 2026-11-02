import assert from 'node:assert/strict';
import test from 'node:test';
import { guardUnsafeApiRequest } from '../app/lib/request-guard.ts';

const SITE = 'https://app.example.com';
// Build the request the way the Worker receives it: a body brings a content-length,
// and a bodyless POST arrives with content-length 0 and no content type.
const call = (method, path, { headers = {}, body } = {}) => {
  const url = new URL(path, SITE);
  const all = new Headers(headers);
  if (body !== undefined && !all.has('content-length')) all.set('content-length', String(new TextEncoder().encode(body).length));
  if (body === undefined && method !== 'GET' && method !== 'HEAD') all.set('content-length', '0');
  return guardUnsafeApiRequest(new Request(url, { method, headers: all, body }), url);
};
const json = { 'content-type': 'application/json' };
const status = r => (r ? r.status : 'allowed');

test('safe methods and non-API paths are never touched', () => {
  assert.equal(call('GET', '/api/academy'), null);
  assert.equal(call('HEAD', '/api/academy'), null);
  assert.equal(call('POST', '/student-login', { headers: { 'content-type': 'text/plain' }, body: 'x' }), null);
});

test('the attack from the audit: a text/plain body is refused with 415', () => {
  assert.equal(status(call('POST', '/api/admin/classes', { headers: { 'content-type': 'text/plain' }, body: '{"grade":9,"section":"F"}' })), 415);
  assert.equal(status(call('POST', '/api/admin/classes', { headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: 'a=b' })), 415);
  assert.equal(status(call('PUT', '/api/admin/school', { headers: { 'content-type': 'multipart/form-data; boundary=x' }, body: 'x' })), 415);
  assert.equal(status(call('PATCH', '/api/admin/teachers/2', { headers: { 'content-length': '21' }, body: '{"action":"suspend"}' })), 415, 'a body with no content type at all');
  assert.equal(status(call('POST', '/api/students/3/reset', { headers: { 'content-type': 'text/plain' } })), 415, 'a bodyless request that claims to be text/plain');
  assert.equal(status(new URL('/api/x', SITE) && guardUnsafeApiRequest(new Request(new URL('/api/x', SITE), { method: 'POST', headers: { 'transfer-encoding': 'chunked' } }), new URL('/api/x', SITE))), 415, 'a chunked body with no content type');
});

test('JSON bodies are allowed, with or without a charset', () => {
  assert.equal(call('POST', '/api/students', { headers: json, body: '{}' }), null);
  assert.equal(call('POST', '/api/students', { headers: { 'content-type': 'application/json; charset=utf-8' }, body: '{}' }), null);
  assert.equal(call('POST', '/api/students', { headers: { 'content-type': 'Application/JSON' }, body: '{}' }), null);
  assert.equal(status(call('POST', '/api/students', { headers: { 'content-type': 'application/jsonp' }, body: '{}' })), 415);
});

test('bodyless actions (logout, reset, delete) are allowed from our own pages', () => {
  assert.equal(call('POST', '/api/auth/logout'), null);
  assert.equal(call('POST', '/api/auth/logout', { headers: { 'content-length': '0', 'sec-fetch-site': 'same-origin' } }), null, 'content-length 0 is not a body');
  assert.equal(call('POST', '/api/students/3/reset', { headers: { 'sec-fetch-site': 'same-origin', origin: SITE } }), null);
  assert.equal(call('DELETE', '/api/students/3', { headers: { 'sec-fetch-site': 'same-origin' } }), null);
});

test('browsers saying the request came from another site or a sibling subdomain are refused', () => {
  for (const site of ['cross-site', 'same-site']) {
    assert.equal(status(call('POST', '/api/auth/logout', { headers: { 'sec-fetch-site': site } })), 403, site);
    assert.equal(status(call('POST', '/api/students/3/reset', { headers: { 'sec-fetch-site': site } })), 403, `${site} bodyless`);
    assert.equal(status(call('POST', '/api/students', { headers: { ...json, 'sec-fetch-site': site }, body: '{}' })), 403, `${site} JSON`);
  }
  assert.equal(call('POST', '/api/students', { headers: { ...json, 'sec-fetch-site': 'none' }, body: '{}' }), null, 'typed address / bookmark');
});

test('a foreign, sibling, null or malformed Origin is refused; our own is accepted', () => {
  for (const origin of ['https://evil.example', 'https://sibling.example.com', 'null', 'not a url', 'http://app.example.com.evil.net'])
    assert.equal(status(call('POST', '/api/students', { headers: { ...json, origin }, body: '{}' })), 403, origin);
  assert.equal(call('POST', '/api/students', { headers: { ...json, origin: SITE }, body: '{}' }), null);
  assert.equal(call('POST', '/api/students', { headers: { ...json, origin: 'http://app.example.com' }, body: '{}' }), null, 'scheme may differ behind a proxy');
});

test('refusals are JSON and do not leak details', async () => {
  const r = call('POST', '/api/admin/classes', { headers: { 'content-type': 'text/plain' }, body: 'x' });
  assert.match(r.headers.get('content-type'), /application\/json/);
  assert.deepEqual(Object.keys(await r.json()), ['error']);
});

test('the Worker entry runs the guard before any route handler', async () => {
  const { readFile } = await import('node:fs/promises');
  const entry = await readFile(new URL('../worker/index.ts', import.meta.url), 'utf8');
  assert.match(entry, /guardUnsafeApiRequest\(request, url\)/);
  assert.ok(entry.indexOf('guardUnsafeApiRequest(request, url)') < entry.indexOf('handler.fetch(request, env, ctx)'));
});
