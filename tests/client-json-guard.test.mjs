import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";

const appRoot = new URL("../app/", import.meta.url);

/**
 * Client components must read fetch replies through `readJson`/`getJson`/`postJson`.
 *
 * A raw `await response.json()` throws when the reply is not JSON — a dev-server
 * restart, a proxy error or a route that has not compiled yet all return HTML.
 * In a component that flips a `loading` flag *after* the await, the throw skips
 * `setLoading(false)` and the page hangs on its spinner forever, which is exactly
 * how the teacher dashboard and both student reports used to fail.
 *
 * Server routes under app/api/ are exempt: they parse `request.json()` inside
 * `validation.ts`, which already guards it.
 */
async function clientSources(dir = appRoot, found = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const child = new URL(
      entry.name + (entry.isDirectory() ? "/" : ""),
      dir,
    );
    if (entry.isDirectory()) {
      if (entry.name === "api") continue;
      await clientSources(child, found);
    } else if (/\.tsx?$/.test(entry.name)) {
      found.push([
        child.href.slice(appRoot.href.length),
        await readFile(child, "utf8"),
      ]);
    }
  }
  return found;
}

// The two files allowed to call `.json()` directly, because each one *is* the
// guard: read-json wraps replies coming in, validation wraps request bodies.
const GUARDS = new Set(["lib/read-json.ts", "lib/validation.ts"]);

test("no client component parses a fetch reply with a raw .json()", async () => {
  const offenders = [];
  for (const [path, source] of await clientSources()) {
    if (GUARDS.has(path)) continue;
    for (const line of source.split("\n")) {
      // Any bare `.json()` — `response.json()`, `teacherRes.json()`, and the
      // `.then((r) => r.json())` shape alike. Nothing else in app/ calls it.
      if (/\.json\(\)/.test(line)) offenders.push(`${path}: ${line.trim()}`);
    }
  }
  assert.deepEqual(
    offenders,
    [],
    `Use readJson/getJson/postJson from app/lib/read-json.ts instead:\n${offenders.join("\n")}`,
  );
});

test("read-json exports a guard for each direction and never throws", async () => {
  const source = await readFile(new URL("lib/read-json.ts", appRoot), "utf8");
  for (const name of ["readJson", "getJson", "postJson"]) {
    assert.match(source, new RegExp(`export async function ${name}\\b`));
  }
  // Both network-facing helpers must wrap fetch, or a dead server still rejects.
  assert.equal(source.match(/try \{\n\s+response = await fetch\(/g)?.length, 2);
});
