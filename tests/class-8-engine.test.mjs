import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const implementation = fileURLToPath(new URL("../app/module/cyber/lessons/class8/task-evaluation.ts", import.meta.url));

test("Class 8 practical tasks have a deterministic evaluation implementation", () => {
  assert.ok(existsSync(implementation), "Class 8 task evaluator has not been implemented");
});

test("task checks reject omissions, extra choices, blank numbers and blocked movement", async () => {
  if (!existsSync(implementation)) return;
  const { evaluateTask, simulateRoute, predictLabel, testPermissions } = await import(implementation);
  const { l } = await import("../app/data/class8/types.ts");
  const base = { prompt: l("Test", "टेस्ट"), context: l("Test pack", "टेस्ट पैक"), success: l("Correct", "सही"), correction: l("Check again", "फिर चेक करें"), hint: l("Use the evidence", "जानकारी देखें") };
  const select = { ...base, kind: "select", items: ["a", "b", "c"].map(id => ({ id, label: l(id, id), feedback: base.correction })), expected: ["a", "b"] };
  assert.equal(evaluateTask(select, ["a"]).correct, false);
  assert.equal(evaluateTask(select, ["a", "b", "c"]).correct, false);
  assert.equal(evaluateTask(select, ["a", "a", "b"]).correct, false);
  assert.equal(evaluateTask(select, ["b", "a"]).correct, true);
  const number = { ...base, kind: "number", fields: [{ id: "n", label: l("Total", "कुल"), answer: 0 }] };
  for (const n of ["", " ", "Infinity", "NaN"]) assert.equal(evaluateTask(number, { n }).correct, false);
  assert.equal(evaluateTask(number, { n: "0" }).correct, true);
  const route = { ...base, kind: "route", width: 3, height: 3, start: 0, goal: 8, blocked: [1], stops: [6], maxSteps: 4 };
  assert.equal(evaluateTask(route, ["right", "down", "down", "right"]).correct, false);
  assert.equal(simulateRoute(route, ["left"]).valid, false);
  assert.equal(evaluateTask(route, ["down", "down", "right", "right"]).correct, true);
  assert.equal(predictLabel([{ value: 0, label: "a" }, { value: 2, label: "b" }], 1), null);
  assert.equal(predictLabel([{ value: 0, label: "a" }, { value: 3, label: "b" }], 1), "a");
  assert.equal(predictLabel([], 1), null);
  const permission = { ...base, kind: "match", rows: [{ id: "reader", label: l("Reader", "रीडर"), answer: "read", explanation: base.correction }], options: [{id:"read",label:l("Read", "पढ़ें")}], simulation: [{ label: l("Try editing", "एडिट करके देखें"), checks: [{rowId:"reader",allowedAnswers:["edit"]}], allowed: l("Editing allowed", "एडिट कर सकते हैं"), denied: l("Editing blocked", "एडिट नहीं कर सकते")} ] };
  assert.equal(testPermissions(permission, {reader:"read"})[0].allowed, false);
  assert.equal(testPermissions(permission, {reader:"edit"})[0].allowed, true);
  assert.equal(testPermissions(permission, {})[0].allowed, false);
});
