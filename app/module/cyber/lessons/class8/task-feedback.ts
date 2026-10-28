import { l, type Class8Task, type L, type TaskAnswer } from "../../../../data/class8/types.ts";
import { buildTaskEvidence } from "./task-evidence.ts";
import { evaluateTask, simulateRoute, testModel } from "./task-evaluation.ts";

export type TaskDiagnosis = {
  complete: boolean; correct: boolean; submitted: L; summary: L;
  issues: { id: string; label: L; reason: L }[];
  supported: { id: string; label: L; reason: L }[];
  next: L;
};
const literal = (value: unknown): L => l(String(value), String(value));
const combine = (a: L, b: L): L => l(`${a.en} ${b.en}`, `${a.hi} ${b.hi}`);

/** Explain the actual submitted work; evaluateTask remains the grading authority. */
export function diagnoseTask(task: Class8Task, answer: TaskAnswer): TaskDiagnosis {
  const selected = Array.isArray(answer) ? answer : [];
  const values = typeof answer === "object" && answer !== null && !Array.isArray(answer) ? answer : {};
  const filled = (id: string) => typeof values[id] === "string" && Boolean(values[id].trim());
  let complete: boolean;
  switch (task.kind) {
    case "choice": complete = typeof answer === "string" && Boolean(answer.trim()); break;
    case "number": complete = task.fields.every(row => filled(row.id)); break;
    case "match": complete = task.rows.every(row => filled(row.id)); break;
    case "order": complete = selected.length >= task.expected.length; break;
    case "binary": complete = typeof answer === "string" && answer.length === task.bits; break;
    case "route": complete = selected.length > 0 || task.start === task.goal; break;
    default: complete = selected.length > 0;
  }
  const result = evaluateTask(task, answer);
  const issues: TaskDiagnosis["issues"] = [], supported: TaskDiagnosis["supported"] = [];
  const add = (ok: boolean, id: string, label: L, reason: L) => (ok ? supported : issues).push({ id, label, reason });
  const cell = (value: number): L => l(`Row ${Math.floor(value / ("width" in task ? task.width : 1)) + 1}, column ${value % ("width" in task ? task.width : 1) + 1}`, `पंक्ति ${Math.floor(value / ("width" in task ? task.width : 1)) + 1}, कॉलम ${value % ("width" in task ? task.width : 1) + 1}`);
  switch (task.kind) {
    case "choice": {
      const option = task.options.find(row => row.id === answer);
      if (option) add(result.correct, option.id, option.label, option.feedback);
      break;
    }
    case "select":
      for (const id of selected) {
        const item = task.items.find(row => row.id === id);
        add(task.expected.includes(String(id)), String(id), item?.label ?? literal(id), item?.feedback ?? task.correction);
      }
      for (const id of task.expected.filter(id => !selected.includes(id as never))) {
        const item = task.items.find(row => row.id === id)!;
        add(false, `missing-${id}`, l(`Missing: ${item.label.en}`, `छूट गया: ${item.label.hi}`), item.feedback);
      }
      break;
    case "match":
      for (const row of task.rows) {
        const option = task.options.find(item => item.id === values[row.id]);
        const label = l(`${row.label.en}: ${option?.label.en ?? values[row.id] ?? "—"}`, `${row.label.hi}: ${option?.label.hi ?? values[row.id] ?? "—"}`);
        add(values[row.id] === row.answer, row.id, label, row.explanation);
      }
      break;
    case "order":
      task.expected.forEach((id, index) => {
        const expected = task.items.find(item => item.id === id)!;
        const actual = task.items.find(item => item.id === selected[index]);
        const predecessor = task.items.find(item => item.id === task.expected[index - 1]);
        const dependency = predecessor ? l(`Step ${index + 1} needs ${expected.label.en} after ${predecessor.label.en}.`, `कदम ${index + 1} में ${predecessor.label.hi} के बाद ${expected.label.hi} चाहिए।`) : l(`Start with ${expected.label.en}.`, `${expected.label.hi} से शुरू करें।`);
        add(selected[index] === id, `step-${index + 1}`, l(`Step ${index + 1}: ${actual?.label.en ?? "—"}`, `कदम ${index + 1}: ${actual?.label.hi ?? "—"}`), combine(dependency, task.stepReasons?.[index] ?? task.correction));
      });
      break;
    case "number":
      for (const row of task.fields) {
        const numeric = Number(values[row.id]);
        const ok = filled(row.id) && Number.isFinite(numeric) && Math.abs(numeric - row.answer) < 1e-8 && (row.min == null || numeric >= row.min) && (row.max == null || numeric <= row.max);
        add(ok, row.id, l(`${row.label.en}: ${values[row.id] ?? "—"}`, `${row.label.hi}: ${values[row.id] ?? "—"}`), row.explanation ?? combine(l(`Compare your value with ${row.answer}.`, `अपने जवाब को ${row.answer} से मिलाएँ।`), task.correction));
      }
      break;
    case "binary": {
      const total = parseInt(String(answer), 2);
      add(result.correct, "bits", l(`Signal: ${String(answer)}`, `सिग्नल: ${String(answer)}`), combine(l(`Your total is ${total}; the target is ${task.target}.`, `आपका कुल ${total} है; लक्ष्य ${task.target} है।`), task.correction));
      break;
    }
    case "grid":
      for (const value of selected) add(task.expected.includes(Number(value)) && !task.blocked?.includes(Number(value)) && typeof value === "number", String(value), cell(Number(value)), task.cellReasons?.[String(value)] ?? task.correction);
      for (const value of task.expected.filter(value => !selected.includes(value as never))) add(false, `missing-${value}`, combine(l("Missing:", "छूट गया:"), cell(value)), task.cellReasons?.[String(value)] ?? task.correction);
      break;
    case "route": {
      const moves = selected.map(String), route = simulateRoute(task, moves);
      if (!route.valid) add(false, "blocked", l(`Move ${route.failedAt}: ${moves[(route.failedAt ?? 1) - 1]}`, `कदम ${route.failedAt}: ${moves[(route.failedAt ?? 1) - 1]}`), l("This move reaches an edge or blocked cell. Remove it and test another path.", "यह कदम किनारे या बंद खाने पर जाता है। इसे हटाकर दूसरा रास्ता टेस्ट करें।"));
      add(route.position === task.goal, "goal", cell(route.position), l(`Finish at ${cell(task.goal).en}.`, `${cell(task.goal).hi} पर पहुँचें।`));
      for (const stop of task.stops ?? []) add(route.path.includes(stop), `stop-${stop}`, cell(stop), l("The route must visit this required stop.", "रास्ते में इस ज़रूरी पड़ाव से गुज़रना है।"));
      if (moves.length > task.maxSteps) add(false, "moves", l(`${moves.length} moves`, `${moves.length} कदम`), l(`The move budget is ${task.maxSteps}.`, `कदमों की सीमा ${task.maxSteps} है।`));
      if (task.maxCost != null) add(route.cost <= task.maxCost, "cost", l(`Route cost: ${route.cost}`, `रास्ते का खर्च: ${route.cost}`), l(`Your route costs ${route.cost}; the cost budget is ${task.maxCost}. Every entered cell costs again on a repeat visit.`, `आपके रास्ते का खर्च ${route.cost} है; सीमा ${task.maxCost} है। किसी खाने में दोबारा जाने पर उसका खर्च फिर जुड़ता है।`));
      break;
    }
    case "model":
      for (const row of testModel(task, selected.map(String))) {
        const expected = task.labels.find(label => label.id === row.expected)?.label ?? literal(row.expected);
        const predicted = task.labels.find(label => label.id === row.predicted)?.label;
        add(row.predicted === row.expected, row.id, l(`Test ${row.id} (${row.value})`, `टेस्ट ${row.id} (${row.value})`), row.predicted === null ? l(`The model abstains because the nearest selected examples conflict or no training evidence is available. Expected: ${expected.en}.`, `पास के चुने हुए उदाहरणों में अलग लेबल हैं या ट्रेनिंग की जानकारी नहीं है, इसलिए मॉडल जवाब नहीं देता। सही लेबल: ${expected.hi}।`) : l(`Predicted ${predicted?.en ?? row.predicted}; expected ${expected.en}. Compare the nearest training examples.`, `अनुमान ${predicted?.hi ?? row.predicted}; सही लेबल ${expected.hi}। सबसे पास के ट्रेनिंग उदाहरण मिलाएँ।`));
      }
      break;
  }
  if (complete && !result.correct && !issues.length) add(false, "answer", l("Submitted work", "दिया गया काम"), task.correction);
  const evidence = buildTaskEvidence(task, answer);
  const submitted = task.kind === "match" ? l(
    task.rows.map(row => `${row.label.en}: ${task.options.find(option => option.id === values[row.id])?.label.en ?? values[row.id] ?? "—"}`).join("; "),
    task.rows.map(row => `${row.label.hi}: ${task.options.find(option => option.id === values[row.id])?.label.hi ?? values[row.id] ?? "—"}`).join("; "),
  ) : l(evidence.map(line => `${line.label.en}: ${line.value.en}`).join("; ") || "No answer yet", evidence.map(line => `${line.label.hi}: ${line.value.hi}`).join("; ") || "अभी कोई जवाब नहीं");
  return {
    complete, correct: complete && result.correct, submitted, issues, supported,
    summary: !complete ? l("Complete your answer before checking.", "चेक करने से पहले अपना जवाब पूरा करें।") : result.correct ? task.success : l("Your submitted answer is incorrect.", "आपका दिया गया जवाब गलत है।"),
    next: !complete ? l("Complete every control: choose an answer, fill each field or finish your plan, then check again.", "जवाब चुनें, हर खाली जगह भरें या अपना प्लान पूरा करें, फिर चेक करें।") : result.correct ? l("Use this evidence in the next challenge.", "अगली चुनौती में इस जानकारी का इस्तेमाल करें।") : combine(task.hint, l("Revise the named issues and run any simulation again before checking.", "बताई गई गलतियाँ सुधारें और चेक करने से पहले सिम्युलेशन फिर चलाएँ।")),
  };
}
