import type { Class8Task, TaskAnswer } from "../../../../data/class8/types";
import { simulateRoute, testModel, testPermissions } from "./task-evaluation";

type Tested<K extends string, A, R> = {
  readonly kind: K;
  readonly answer: A;
  readonly fingerprint: string;
  readonly result: R;
};
export type TaskSimulationSnapshot =
  | Tested<"route", readonly string[], Readonly<ReturnType<typeof simulateRoute>>>
  | Tested<"model", readonly string[], Readonly<ReturnType<typeof testModel>>>
  | Tested<"permissions", Readonly<Record<string, string>>, Readonly<ReturnType<typeof testPermissions>>>;

function freeze<T>(value: T): T {
  if (value !== null && typeof value === "object") {
    for (const child of Object.values(value)) freeze(child);
    Object.freeze(value);
  }
  return value;
}

/** Capture only a test actually run against this answer; never retain authored/input references. */
export function makeTaskSimulation(task: Class8Task, answer: TaskAnswer): TaskSimulationSnapshot | null {
  const copied = structuredClone(answer);
  const fingerprint = JSON.stringify(answer);
  if (Array.isArray(copied) && copied.every((id): id is string => typeof id === "string")) {
    if (task.kind === "route") return freeze({ kind: "route", answer: copied, fingerprint, result: structuredClone(simulateRoute(task, copied)) });
    if (task.kind === "model") return freeze({ kind: "model", answer: copied, fingerprint, result: structuredClone(testModel(task, copied)) });
  }
  if (task.kind === "match" && task.presentation === "permissions" && typeof copied === "object" && copied !== null && !Array.isArray(copied)) {
    return freeze({ kind: "permissions", answer: copied, fingerprint, result: structuredClone(testPermissions(task, copied)) });
  }
  return null;
}
