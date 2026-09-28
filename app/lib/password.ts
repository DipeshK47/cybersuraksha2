/**
 * Password hashing for the Cloudflare Workers runtime.
 *
 * Native bcrypt/scrypt binaries do not run on Workers, so we use PBKDF2-HMAC-
 * SHA-256 via Web Crypto (`crypto.subtle`), which is available everywhere the
 * app runs. Each password gets a fresh 16-byte random salt; the stored value
 * is self-describing so the work factor can be raised over time without
 * invalidating existing hashes.
 *
 * Encoded format:  pbkdf2$<iterations>$<saltB64>$<hashB64>
 */

const ALGORITHM = "PBKDF2";
const HASH = "SHA-256";
const DEFAULT_ITERATIONS = 210_000; // OWASP 2023 guidance for PBKDF2-SHA256
const KEY_LENGTH_BITS = 256;
const SALT_BYTES = 16;

function toBase64(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function fromBase64(value: string): Uint8Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function deriveBits(
  password: string,
  salt: Uint8Array,
  iterations: number,
): Promise<Uint8Array> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: ALGORITHM },
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: ALGORITHM, salt: salt as BufferSource, iterations, hash: HASH },
    keyMaterial,
    KEY_LENGTH_BITS,
  );
  return new Uint8Array(bits);
}

/** Hash a plaintext password into a self-describing, storable string. */
export async function hashPassword(
  password: string,
  iterations = DEFAULT_ITERATIONS,
): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const hash = await deriveBits(password, salt, iterations);
  return `pbkdf2$${iterations}$${toBase64(salt)}$${toBase64(hash)}`;
}

/**
 * Verify a plaintext password against a stored hash using a constant-time
 * comparison so timing cannot reveal how many bytes matched.
 */
export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const parts = stored.split("$");
  if (parts.length !== 4 || parts[0] !== "pbkdf2") return false;
  const iterations = Number.parseInt(parts[1], 10);
  if (!Number.isInteger(iterations) || iterations <= 0) return false;
  let expected: Uint8Array;
  let salt: Uint8Array;
  try {
    salt = fromBase64(parts[2]);
    expected = fromBase64(parts[3]);
  } catch {
    return false;
  }
  const actual = await deriveBits(password, salt, iterations);
  return timingSafeEqual(actual, expected);
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a[i] ^ b[i];
  return diff === 0;
}
