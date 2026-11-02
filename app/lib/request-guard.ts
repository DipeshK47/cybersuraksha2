/**
 * Forged-request (CSRF) guard for the API, applied once in the Worker entry.
 *
 * Login cookies are SameSite=Strict, which already stops pages on other sites.
 * This guard closes the remaining gap: a page on the SAME site (for example a
 * compromised sibling subdomain) that sends a "simple" request the browser does
 * not pre-check, such as a text/plain body or a bodyless POST. For every
 * state-changing API request it requires:
 *
 *   1. Sec-Fetch-Site, when the browser sends it, to be same-origin (or none).
 *   2. Origin, when present, to match this site's host.
 *   3. Any request that declares a content type, or carries a body, to be
 *      labelled application/json. A JSON content type
 *      forces the browser to run a CORS pre-check first, and the API grants none.
 *
 * Non-browser clients (tests, scripts) send none of the browser headers and are
 * unaffected by rules 1 and 2; they still have to label their bodies as JSON.
 */
const UNSAFE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const isJson = (value: string) => /^application\/json\s*(;|$)/i.test(value);

function refuse(status: number, error: string): Response {
  // The Worker's response hardening adds Cache-Control: no-store to every API response.
  return Response.json({ error }, { status });
}

export function guardUnsafeApiRequest(request: Request, url: URL): Response | null {
  if (!url.pathname.startsWith("/api/") || !UNSAFE_METHODS.has(request.method)) return null;

  const site = request.headers.get("sec-fetch-site");
  if (site && site !== "same-origin" && site !== "none") {
    return refuse(403, "Cross-site requests are not allowed.");
  }

  const origin = request.headers.get("origin");
  if (origin !== null) {
    let originHost: string | null = null;
    try { originHost = new URL(origin).host; } catch { /* "null" and malformed origins are refused below */ }
    if (originHost !== url.host) return refuse(403, "Cross-site requests are not allowed.");
  }

  // Judge by headers, not request.body: the Workers runtime hands even an empty
  // POST (a logout, a reset) a non-null empty body stream.
  const contentType = request.headers.get("content-type");
  const length = request.headers.get("content-length");
  const hasBody = (length !== null && length !== "0") || request.headers.has("transfer-encoding");
  if (contentType !== null ? !isJson(contentType) : hasBody) {
    return refuse(415, "Send JSON with Content-Type: application/json.");
  }
  return null;
}
