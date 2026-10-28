import type { Class8Task, L, MatchTask, ModelTask, RouteTask, TaskAnswer } from "../../../../data/class8/types";
export { diagnoseTask } from "./task-feedback.ts";

const exactSet = (actual: readonly unknown[], expected: readonly unknown[]) => actual.length === expected.length && new Set(actual).size === actual.length && expected.every(id => actual.includes(id));
const strings = (answer: TaskAnswer): answer is string[] => Array.isArray(answer) && answer.every(id => typeof id === "string");
const fields = (answer: TaskAnswer): answer is Record<string, string> => typeof answer === "object" && answer !== null && !Array.isArray(answer);

/** A transparent toy nearest-example model. Conflicting equally close examples abstain. */
export function predictLabel(examples: readonly { value: number; label: string }[], value: number): string | null {
  if (!Number.isFinite(value) || !examples.length) return null;
  const distance = Math.min(...examples.map(row => Math.abs(row.value - value)));
  if (!Number.isFinite(distance)) return null;
  const labels = new Set(examples.filter(row => Math.abs(row.value - value) === distance).map(row => row.label));
  return labels.size === 1 ? [...labels][0] : null;
}

export function testModel(task: ModelTask, selected: readonly string[]) {
  const training = task.examples.filter(row => selected.includes(row.id));
  return task.tests.map(row => ({ ...row, predicted: predictLabel(training, row.value) }));
}

export function testPermissions(task: MatchTask, answers: Record<string, string>) {
  return (task.simulation ?? []).map(test => {
    const allowed = test.checks.every(check => check.allowedAnswers.includes(answers[check.rowId]));
    return { label: test.label, allowed, result: allowed ? test.allowed : test.denied };
  });
}

export function simulateRoute(task: RouteTask, moves: readonly string[]) {
  const path = [task.start];
  let position = task.start;
  let cost = 0;
  for (const move of moves) {
    const x = position % task.width, y = Math.floor(position / task.width);
    const [dx, dy] = move === "up" ? [0, -1] : move === "right" ? [1, 0] : move === "down" ? [0, 1] : move === "left" ? [-1, 0] : [NaN, NaN];
    const nx = x + dx, ny = y + dy;
    const next = ny * task.width + nx;
    if (!Number.isFinite(next) || nx < 0 || nx >= task.width || ny < 0 || ny >= task.height || task.blocked.includes(next)) return { valid: false, position, path, cost, failedAt: path.length };
    position = next;
    cost += task.cellCosts?.[String(next)] ?? 1;
    path.push(position);
  }
  return { valid: true, position, path, cost, failedAt: null };
}

export function evaluateTask(task: Class8Task, answer: TaskAnswer): { correct: boolean; feedback: L } {
  let correct = false;
  let failure = task.correction;
  switch (task.kind) {
    case "choice": {
      const option = task.options.find(row => row.id === answer);
      correct = Boolean(option && answer === task.correct);
      failure = option?.feedback ?? failure;
      break;
    }
    case "select": {
      correct = strings(answer) && exactSet(answer, task.expected);
      if (strings(answer)) failure = task.items.find(row => answer.includes(row.id) !== task.expected.includes(row.id))?.feedback ?? failure;
      break;
    }
    case "match": {
      correct = fields(answer) && task.rows.every(row => answer[row.id] === row.answer) && Object.keys(answer).length === task.rows.length;
      if (fields(answer)) failure = task.rows.find(row => answer[row.id] !== row.answer)?.explanation ?? failure;
      break;
    }
    case "order": correct = strings(answer) && answer.length === task.expected.length && task.expected.every((id, index) => answer[index] === id); break;
    case "number": correct = fields(answer) && task.fields.every(row => {
      const value = answer[row.id];
      if (typeof value !== "string" || !value.trim()) return false;
      const numeric = Number(value);
      return Number.isFinite(numeric) && Math.abs(numeric - row.answer) < 1e-8 && (row.min == null || numeric >= row.min) && (row.max == null || numeric <= row.max);
    }); break;
    case "binary": correct = typeof answer === "string" && /^[01]{8}$/.test(answer) && parseInt(answer, 2) === task.target; break;
    case "grid": correct = Array.isArray(answer) && answer.every(cell => typeof cell === "number" && Number.isInteger(cell) && cell >= 0 && cell < task.width * task.height && !task.blocked?.includes(cell)) && exactSet(answer, task.expected); break;
    case "route": {
      if (strings(answer) && answer.length <= task.maxSteps) {
        const result = simulateRoute(task, answer);
        correct = result.valid && result.position === task.goal && (task.stops ?? []).every(stop => result.path.includes(stop)) && (task.maxCost == null || result.cost <= task.maxCost);
      }
      break;
    }
    case "model": {
      if (strings(answer) && new Set(answer).size === answer.length && answer.length > 0 && answer.every(id => task.examples.some(row => row.id === id))) {
        const tested = testModel(task, answer);
        correct = tested.filter(row => row.predicted === row.expected).length >= task.minimumCorrect;
      }
      break;
    }
  }
  return { correct, feedback: correct ? task.success : failure };
}
