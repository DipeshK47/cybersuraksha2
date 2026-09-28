/**
 * Read a fetch Response as JSON without ever throwing.
 *
 * Every auth form used to call `await response.json()` unguarded. That is fine
 * while the API behaves, but a dev-server restart, a proxy error or a route that
 * has not compiled yet all reply with HTML — and the resulting parse error
 * surfaced as an unhandled promise rejection ("The string did not match the
 * expected pattern") while leaving the form's submitting flag stuck on, so the
 * button never recovered.
 *
 * Returning a plain `{ error }` instead lets the caller show a normal message.
 */
export async function readJson<T extends { error?: string }>(
  response: Response,
): Promise<T> {
  let text: string;
  try {
    text = await response.text();
  } catch {
    return { error: "The connection dropped. Please try again." } as T;
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    return {
      error: response.ok
        ? "The server sent an unexpected reply. Please try again."
        : `Something went wrong (${response.status}). Please try again.`,
    } as T;
  }
}

/**
 * GET JSON and read the reply. Like `postJson`, a dead server surfaces as an
 * `error` field rather than a rejected promise — callers that flip a `loading`
 * flag after the await would otherwise never reach it and hang on the spinner.
 */
export async function getJson<T extends { error?: string }>(
  url: string,
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url);
  } catch {
    return { error: "Could not reach the server. Is it still running?" } as T;
  }
  return readJson<T>(response);
}

/** POST JSON and read the reply, surfacing network failures as `error` too. */
export async function postJson<T extends { error?: string }>(
  url: string,
  body: unknown,
): Promise<{ ok: boolean; payload: T }> {
  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    return {
      ok: false,
      payload: { error: "Could not reach the server. Is it still running?" } as T,
    };
  }
  return { ok: response.ok, payload: await readJson<T>(response) };
}
