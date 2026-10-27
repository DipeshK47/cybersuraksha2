import { l, type Class8Task, type TaskAnswer, type L } from "../../../../data/class8/types";
import { simulateRoute, testModel, testPermissions } from "./task-evaluation";
import { ui } from "./ui";

type EvidenceLine = { label: L; value: L };
const literal = (value: unknown) => l(String(value), String(value));
const identified = (id: string, label?: L): L => label ? l(`${id}: ${label.en}`, `${id}: ${label.hi}`) : literal(id);
const join = (values: L[]): L => l(values.map(x => x.en).join("; ") || "—", values.map(x => x.hi).join("; ") || "—");
export function buildTaskEvidence(task: Class8Task, answer: TaskAnswer): EvidenceLine[] {
  const lines: EvidenceLine[] = [];
  const add = (label: L, value: L) => lines.push({ label, value });
  const selected = Array.isArray(answer) ? answer : [];
  const values = typeof answer === "object" && !Array.isArray(answer) ? answer : {};
  const position = (cell: number) => l(`${cell}: ${ui.row.en} ${Math.floor(cell / ('width' in task ? task.width : 1)) + 1}, ${ui.column.en} ${cell % ('width' in task ? task.width : 1) + 1}`, `${cell}: ${ui.row.hi} ${Math.floor(cell / ('width' in task ? task.width : 1)) + 1}, ${ui.column.hi} ${cell % ('width' in task ? task.width : 1) + 1}`);
  switch (task.kind) {
    case "choice": add(ui.answer, identified(String(answer), task.options.find(x => x.id === answer)?.label)); break;
    case "select": case "order": add(ui.answer, join(selected.map(id => identified(String(id), task.items.find(x => x.id === id)?.label)))); break;
    case "number": for (const field of task.fields) add(identified(field.id, field.label), literal(values[field.id] ?? "—")); break;
    case "match":
      for (const row of task.rows) add(identified(row.id, row.label), identified(values[row.id] ?? "—", task.options.find(x => x.id === values[row.id])?.label));
      if (task.presentation === "permissions") for (const test of testPermissions(task, values)) add(test.label, test.result);
      break;
    case "binary": add(ui.signalEvidence, literal(answer)); add(ui.total, literal(parseInt(String(answer), 2))); break;
    case "grid": add(ui.selectedCells, join(selected.map(cell => position(Number(cell))))); break;
    case "route": {
      const moves = selected.map(String), result = simulateRoute(task, moves);
      add(ui.plan, join(moves.map((move, i) => identified(`${i + 1}. ${move}`, ui[move as "up" | "right" | "down" | "left"]))));
      add(ui.trace, join(result.path.map(position))); add(ui.finalPosition, position(result.position));
      add(ui.collectedStops, join((task.stops ?? []).filter(cell => result.path.includes(cell)).map(position)));
      add(ui.failedMove, literal(result.failedAt ?? "—")); break;
    }
    case "model": {
      add(ui.training, join(selected.map(id => {
        const row = task.examples.find(x => x.id === id);
        return row ? join([literal(`${row.id}: ${row.value}`), identified(row.label, task.labels.find(x => x.id === row.label)?.label)]) : literal(id);
      })));
      for (const test of testModel(task, selected.map(String))) add(l(`${ui.predicted.en}: ${test.id} (${test.value})`, `${ui.predicted.hi}: ${test.id} (${test.value})`), join([identified(test.predicted ?? "—", task.labels.find(x => x.id === test.predicted)?.label ?? ui.uncertain), l(`${ui.expected.en}: ${identified(test.expected, task.labels.find(x => x.id === test.expected)?.label).en}`, `${ui.expected.hi}: ${identified(test.expected, task.labels.find(x => x.id === test.expected)?.label).hi}`)]));
      break;
    }
  }
  return lines;
}
/** Lossless chunks. JSON-escaped size is bounded too, leaving room for activity metadata. */
export function evidenceFeedbackChunks(lines: readonly string[], maxChars = 900): string[] {
  if (!Number.isInteger(maxChars) || maxChars < 6) throw new RangeError("maxChars must be at least 6");
  const chunks: string[] = [];
  let chunk = "";
  for (const char of lines.join("\n")) {
    if (chunk && (chunk.length + char.length > maxChars || JSON.stringify(chunk + char).length > maxChars)) { chunks.push(chunk); chunk = ""; }
    chunk += char;
  }
  if (chunk) chunks.push(chunk);
  return chunks;
}
