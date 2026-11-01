import { build } from 'esbuild';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));

/**
 * Bundle real route handlers into one Worker and boot it on Miniflare with a
 * fresh in-memory D1, so tests exercise real handlers, migrations and D1
 * transactions. `routes` is [path, dir under app/api]; `dynamic` is
 * [regex source, dir, param names].
 */
export async function startWorker({ routes, dynamic = [], bindings = {} }) {
  const all = [...routes, ...dynamic];
  const imports = all.map(([, dir], i) => `import * as route${i} from './app/api/${dir}/route.ts';`).join('\n');
  const entry = `${imports}
const exact = new Map([${routes.map(([path], i) => `[${JSON.stringify(path)}, route${i}]`).join(',')}]);
const dynamic = [${dynamic.map(([pattern, , keys], i) => `[new RegExp(${JSON.stringify(pattern)}), route${routes.length + i}, ${JSON.stringify(keys)}]`).join(',')}];
export default { async fetch(request) {
  const path = new URL(request.url).pathname;
  let handler = exact.get(path); let params = {};
  for (const [pattern, route, keys] of dynamic) {
    const match = path.match(pattern);
    if (match) { handler = route; params = Object.fromEntries(keys.map((key, n) => [key, match[n + 1]])); }
  }
  return handler?.[request.method] ? handler[request.method](request, { params: Promise.resolve(params) }) : new Response('Not found', { status: 404 });
}};`;
  const bundle = await build({
    stdin: { contents: entry, resolveDir: root }, bundle: true, write: false, format: 'esm', platform: 'neutral',
    conditions: ['workerd', 'worker'], external: ['cloudflare:workers', 'node:*'],
    define: { 'process.env.NODE_ENV': '"development"' },
    plugins: [{ name: 'sql', setup(builder) {
      builder.onResolve({ filter: /\.sql\?raw$/ }, args => ({ path: fileURLToPath(new URL(args.path.replace('?raw', ''), `file://${args.resolveDir}/`)), namespace: 'sql' }));
      builder.onLoad({ filter: /.*/, namespace: 'sql' }, async args => ({ contents: await readFile(args.path, 'utf8'), loader: 'text' }));
    } }],
  });
  // Miniflare 5 (shipped by current wrangler) takes a new options shape; convert the classic one.
  const mf = new Miniflare(convertV4MiniflareOptions({
    modules: true, script: bundle.outputFiles[0].text, compatibilityDate: '2026-05-15',
    compatibilityFlags: ['nodejs_compat'], d1Databases: ['DB'], bindings,
  }));
  const request = (path, cookie, method = 'GET', body) => mf.dispatchFetch('http://school.test' + path, {
    method,
    headers: { ...(cookie ? { cookie } : {}), ...(body ? { 'content-type': 'application/json' } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  return { mf, request };
}
