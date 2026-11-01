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
 *
 * Work factor. The Workers Free plan allows 10 ms of CPU per request, and one
 * PBKDF2 pass costs about 0.55 ms per 1,000 iterations, so the default is
 * deliberately low (10,000, roughly 6 ms). That is far below OWASP's 600,000 for
 * PBKDF2-HMAC-SHA256: it is a launch trade-off for a teachers-only pilot on the
 * Free plan, NOT a long-term setting. Cloudflare's runtime has also been reported
 * to reject more than 100,000 iterations, so the value is capped there.
 *
 * To strengthen hashing (Workers Paid plan, before students log in) set the
 * CYBERSURAKSHA_PBKDF2_ITERATIONS variable (1,000-100,000). Existing hashes keep
 * working and are upgraded to the new work factor the next time their owner logs
 * in (`needsRehash`). The planned stronger design (the browser does the heavy
 * hashing) is described in DEPLOYMENT.md under "Planned security work".
 */

const ALGORITHM = "PBKDF2";
const HASH = "SHA-256";
/** Fits the Workers Free plan's 10 ms CPU limit; see the note above. */
export const DEFAULT_ITERATIONS = 10_000;
export const MIN_ITERATIONS = 1_000;
/** Highest PBKDF2 work factor Cloudflare's runtime is reported to accept. */
export const MAX_ITERATIONS = 100_000;
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

/**
 * The work factor used for new hashes: CYBERSURAKSHA_PBKDF2_ITERATIONS when it
 * is a valid number, clamped to [MIN_ITERATIONS, MAX_ITERATIONS], else the default.
 */
export function configuredIterations(): number {
  const raw = typeof process !== "undefined" ? process.env?.CYBERSURAKSHA_PBKDF2_ITERATIONS : undefined;
  const parsed = raw ? Number.parseInt(raw, 10) : Number.NaN;
  if (!Number.isFinite(parsed)) return DEFAULT_ITERATIONS;
  return Math.min(MAX_ITERATIONS, Math.max(MIN_ITERATIONS, parsed));
}

/**
 * True when a stored hash uses fewer iterations than the configured work factor,
 * so it should be re-hashed after a successful login. Stronger hashes are never
 * downgraded.
 */
export function needsRehash(stored: string): boolean {
  const parts = stored.split("$");
  if (parts.length !== 4 || parts[0] !== "pbkdf2") return false;
  const iterations = Number.parseInt(parts[1], 10);
  return Number.isInteger(iterations) && iterations < configuredIterations();
}

/** Hash a plaintext password into a self-describing, storable string. */
export async function hashPassword(
  password: string,
  iterations = configuredIterations(),
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
