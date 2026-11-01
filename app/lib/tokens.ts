/** Cryptographic helpers shared by session and invite handling. */

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** A 256-bit URL-safe random secret, suitable for session / invite tokens. */
export function randomToken(): string {
  return toBase64Url(crypto.getRandomValues(new Uint8Array(32)));
}

/**
 * A printable student access code: up to four characters of the roll number
 * (so the slip is easy to match) followed by eight random characters. The
 * random part is never truncated, so long roll numbers stay unguessable.
 */
export function newAccessCode(rollNo: string): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // 32 symbols: byte % 32 is unbiased
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  const suffix = Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
  return `${rollNo.slice(0, 4)}${suffix}`;
}

/**
 * SHA-256 hex digest. Only the hash of a token is ever persisted, so leaking
 * the database does not leak usable credentials.
 */
export async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}
