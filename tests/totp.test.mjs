import test from 'node:test';
import assert from 'node:assert/strict';
import { base32Encode, newTotpSecret, totpCode, verifyTotp } from '../app/lib/totp.ts';

// RFC 6238 appendix B, SHA-1 key "12345678901234567890".
const secret = base32Encode(new TextEncoder().encode('12345678901234567890'));

test('matches the RFC 6238 SHA-1 test vectors', async () => {
  assert.equal(secret, 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ');
  assert.equal(await totpCode(secret, 59_000, 8), '94287082');
  assert.equal(await totpCode(secret, 1_111_111_109_000, 8), '07081804');
  assert.equal(await totpCode(secret, 1_234_567_890_000, 8), '89005924');
});

test('accepts one step of drift, refuses replays, stale and malformed codes', async () => {
  const now = 1_700_000_000_000;
  const code = await totpCode(secret, now);
  const step = await verifyTotp(secret, code, now + 30_000);
  assert.equal(step, Math.floor(now / 30_000));
  assert.equal(await verifyTotp(secret, code, now, step), null);
  assert.equal(await verifyTotp(secret, code, now + 90_000), null);
  assert.equal(await verifyTotp(secret, 'abc123', now), null);
});

test('new secrets are 160-bit base32', () => {
  assert.match(newTotpSecret(), /^[A-Z2-7]{32}$/);
});
