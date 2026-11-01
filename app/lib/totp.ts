/**
 * RFC 6238 time-based one-time passwords (SHA-1, 6 digits, 30 s steps) on Web
 * Crypto, the second factor for platform admins. Works with Google
 * Authenticator, Authy, 1Password and every other standard app.
 */

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
const STEP_MS = 30_000;

export function base32Encode(bytes: Uint8Array): string {
  let bits = 0;
  let value = 0;
  let out = "";
  for (const byte of bytes) {
    value = ((value << 8) | byte) & 0xffff;
    bits += 8;
    while (bits >= 5) {
      out += ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) out += ALPHABET[(value << (5 - bits)) & 31];
  return out;
}

export function base32Decode(text: string): Uint8Array {
  const out: number[] = [];
  let bits = 0;
  let value = 0;
  for (const char of text.toUpperCase().replace(/[\s=]/g, "")) {
    const index = ALPHABET.indexOf(char);
    if (index < 0) throw new Error("Invalid base32 secret.");
    value = ((value << 5) | index) & 0xffff;
    bits += 5;
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return new Uint8Array(out);
}

/** A fresh 160-bit secret, the size RFC 4226 recommends for SHA-1. */
export function newTotpSecret(): string {
  return base32Encode(crypto.getRandomValues(new Uint8Array(20)));
}

export async function totpCode(secret: string, timeMs: number, digits = 6): Promise<string> {
  const counter = new ArrayBuffer(8);
  new DataView(counter).setBigUint64(0, BigInt(Math.floor(timeMs / STEP_MS)));
  const key = await crypto.subtle.importKey(
    "raw",
    base32Decode(secret) as BufferSource,
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"],
  );
  const mac = new Uint8Array(await crypto.subtle.sign("HMAC", key, counter));
  const offset = mac[mac.length - 1] & 15;
  const binary =
    ((mac[offset] & 127) << 24) | (mac[offset + 1] << 16) | (mac[offset + 2] << 8) | mac[offset + 3];
  return String(binary % 10 ** digits).padStart(digits, "0");
}

/**
 * Check a 6-digit code against the current step and one step either side (for
 * clock drift). Steps at or before `afterStep` — the last code this admin used —
 * are refused, so an observed code cannot be replayed. Returns the matched step
 * to store as the new `afterStep`, or null.
 */
export async function verifyTotp(
  secret: string,
  code: string,
  timeMs: number,
  afterStep = 0,
): Promise<number | null> {
  if (!/^\d{6}$/.test(code)) return null;
  const now = Math.floor(timeMs / STEP_MS);
  for (const step of [now - 1, now, now + 1]) {
    if (step <= afterStep) continue;
    if ((await totpCode(secret, step * STEP_MS)) === code) return step;
  }
  return null;
}

export function otpauthUri(secret: string, email: string): string {
  const issuer = "CyberSuraksha Admin";
  const label = encodeURIComponent(`${issuer}:${email}`);
  return `otpauth://totp/${label}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`;
}
