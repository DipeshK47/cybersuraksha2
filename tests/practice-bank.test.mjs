/**
 * The question bank is now the ANSWER KEY the server grades against, so a
 * malformed question is no longer a cosmetic bug — it is a question nobody can
 * ever score, or one where the recorded mark disagrees with what the student
 * saw.
 *
 * These checks evaluate the bank for real rather than pattern-matching the
 * source, so they see the actual objects the grader will see.
 */
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const BANK = new URL("../app/data/practice-bank.ts", import.meta.url);
const source = await readFile(BANK, "utf8");

// The bank is plain data, so stripping the type annotations leaves valid JS.
// Everything from the first array to the lookup section is the data itself.
const data = source
  .slice(source.indexOf("export const WHY_QUESTIONS"), source.indexOf("/* ── lookup"))
  .replaceAll(": PracticeQuestion[]", "");

const bank = await import(
  "data:text/javascript;base64," + Buffer.from(data, "utf8").toString("base64")
);
const arrays = Object.entries(bank);
const questions = arrays.flatMap(([, list]) => list);

test("the bank is server-importable: no client directive, no JSX", () => {
  // A "use client" directive would turn every export into a client reference
  // proxy, and the grading route would read `undefined` for the answer key.
  // A line that IS the directive, not prose that mentions it.
  assert.ok(!/^\s*["']use client["'];?\s*$/m.test(source),
    "the bank must not be a client module");
  assert.ok(!/^\s*visual:/m.test(source), "a JSX visual cannot live in a server module");
  assert.match(source, /^import type \{/m, "the type import must be erasable");
});

test("every question is answerable", () => {
  assert.equal(questions.length, 95, "expected the full Chapter 8 bank");

  for (const q of questions) {
    assert.ok(q.id, `a question has no id: ${JSON.stringify(q).slice(0, 80)}`);
    assert.ok(Array.isArray(q.options) && q.options.length >= 2,
      `${q.id}: needs at least two options`);
    // The one that actually matters. If `correct` is not among the options the
    // student can click, the question is unscoreable and every attempt records
    // a zero the student did not earn.
    assert.ok(q.options.includes(q.correct),
      `${q.id}: correct answer ${JSON.stringify(q.correct)} is not one of its options`);
    assert.equal(new Set(q.options).size, q.options.length,
      `${q.id}: duplicate options make the "correct" choice ambiguous`);
    assert.ok(q.mistake?.explanation, `${q.id}: a wrong answer must still teach`);
  }
});

test("question ids are globally unique", () => {
  // question_attempts is keyed UNIQUE(student_id, question_id), so two topics
  // sharing an id would silently lock a student out of the second question.
  const ids = questions.map((q) => q.id);
  const seen = new Set();
  const clashes = ids.filter((id) => (seen.has(id) ? true : (seen.add(id), false)));
  assert.deepEqual(clashes, [], `duplicate question ids: ${clashes}`);
});

test("every array is mapped to a topic the grader can roll up", () => {
  const lookup = source.slice(source.indexOf("const TOPIC_QUESTIONS"));
  for (const [name, list] of arrays) {
    assert.match(lookup, new RegExp(`: ${name},`),
      `${name} is not in TOPIC_QUESTIONS, so its ${list.length} questions grade to nothing`);
  }
  assert.equal(arrays.length, 18, "expected all 18 Chapter 8 topics");
});
