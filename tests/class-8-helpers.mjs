import { build } from "esbuild";
import { fileURLToPath } from "node:url";

export const root = fileURLToPath(new URL("../", import.meta.url));
export async function loadSource(contents) {
  const result = await build({ stdin: { contents, resolveDir: root, loader: "ts" }, bundle: true, platform: "node", format: "esm", write: false, logLevel: "silent" });
  return import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString("base64")}`);
}

export function routeSolution(task) {
  const queue = [{ cell: task.start, moves: [], seen: (task.stops ?? []).includes(task.start) ? [task.start] : [] }];
  const visited = new Set();
  while (queue.length) {
    const item = queue.shift();
    if (item.cell === task.goal && (task.stops ?? []).every(cell => item.seen.includes(cell))) return item.moves;
    if (item.moves.length >= task.maxSteps) continue;
    for (const [move, dx, dy] of [["up", 0, -1], ["right", 1, 0], ["down", 0, 1], ["left", -1, 0]]) {
      const x = item.cell % task.width + dx, y = Math.floor(item.cell / task.width) + dy;
      const cell = y * task.width + x;
      if (x < 0 || x >= task.width || y < 0 || y >= task.height || task.blocked.includes(cell)) continue;
      const seen = [...new Set([...item.seen, ...((task.stops ?? []).includes(cell) ? [cell] : [])])].sort((a,b) => a-b);
      const key = `${cell}:${seen.join(",")}`;
      if (visited.has(key)) continue;
      visited.add(key); queue.push({ cell, seen, moves: [...item.moves, move] });
    }
  }
  throw new Error(`No valid route: ${task.prompt.en}`);
}

export function solveTask(task, evaluateTask) {
  if (task.kind === "choice") return task.correct;
  if (task.kind === "select" || task.kind === "order" || task.kind === "grid") return task.expected;
  if (task.kind === "match") return Object.fromEntries(task.rows.map(row => [row.id, row.answer]));
  if (task.kind === "number") return Object.fromEntries(task.fields.map(row => [row.id, String(row.answer)]));
  if (task.kind === "binary") return task.target.toString(2).padStart(8,"0");
  if (task.kind === "route") return routeSolution(task);
  if (task.kind === "model") {
    for (let mask = 1; mask < 2 ** task.examples.length; mask++) {
      const ids = task.examples.filter((_, index) => mask & (1 << index)).map(row => row.id);
      if (evaluateTask(task, ids).correct) return ids;
    }
    throw new Error(`No valid training selection: ${task.prompt.en}`);
  }
  throw new Error(`Unknown task: ${task.kind}`);
}
