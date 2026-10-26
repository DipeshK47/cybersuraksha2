import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";
import { class11CtMissions, CLASS11_CT_SLUGS, class11Missions } from "../app/data/class-11-missions.ts";
import { class11Subjects } from "../app/data/class-11-curriculum.ts";
import { evaluateApplicant, evaluateBatch, applicants, loopTrace, searchValues, linearTrace, binaryTrace, runTestCases, testCases, revisionCases, ctStoryTasks } from "../app/module/cyber/lessons/senior/ct-content.ts";

test("Class 11 CT publishes all eight syllabus chapters with 32 completed chapters overall", () => {
  assert.equal(class11CtMissions.length, 8);
  assert.equal(class11Missions.length, 32);
  assert.equal(new Set(class11Missions.map(lesson => lesson.id)).size, 32);
  assert.equal(new Set(class11Missions.flatMap(lesson => lesson.assessmentIds)).size, 96);
  assert.deepEqual(class11CtMissions.map(lesson => lesson.title), class11Subjects[2].modules.map(chapter => chapter.title));
  assert.deepEqual(class11CtMissions.map(lesson => lesson.slug), [...CLASS11_CT_SLUGS]);
  for (const lesson of class11CtMissions) {
    assert.deepEqual(lesson.grades, [11]);
    assert.equal(lesson.strand, "Computational Thinking");
    assert.equal(lesson.durationMinutes, 40);
    assert.equal(lesson.assessmentIds.length, 3);
  }
});

test("shared applicant check keeps inclusive boundaries, missing data and false flags distinct", () => {
  const record = { id: "A10", score: 60, documents: true };
  assert.equal(evaluateApplicant(record), "Eligible");
  assert.equal(evaluateApplicant(record, 60, false), "Not eligible");
  assert.equal(evaluateApplicant({ ...record, score: 59 }), "Not eligible");
  assert.equal(evaluateApplicant({ ...record, score: 59 }, 60, true, "OR"), "Eligible", "the selectable faulty OR branch demonstrates a different rule");
  assert.equal(evaluateApplicant({ ...record, documents: false }), "Needs documents");
  assert.equal(evaluateApplicant({ ...record, documents: null }), "Review missing data");
  assert.equal(evaluateApplicant({ ...record, score: null }), "Review missing data");
  assert.equal(evaluateApplicant({ ...record, score: 0 }), "Not eligible");
  for (const score of [-1, 104, NaN, Infinity]) assert.equal(evaluateApplicant({ ...record, score }), "Invalid record");
  assert.equal(evaluateApplicant({ ...record, id: "" }), "Invalid record");
  assert.equal(evaluateApplicant({ ...record, id: "a10" }), "Invalid record");
  assert.equal(evaluateApplicant(record, NaN), "Invalid record");
  assert.equal(evaluateApplicant({ ...record, score: 70 }, 70), "Eligible");
});

test("batch checks preserve conflicts and do not silently overwrite duplicates", () => {
  assert.deepEqual(evaluateBatch([]), []);
  const conflicting = [{ id: "A10", score: 72, documents: true }, { id: " A10 ", score: 58, documents: true }];
  const before = structuredClone(conflicting);
  assert.deepEqual(evaluateBatch(conflicting).map(row => row.outcome), ["Duplicate ID", "Duplicate ID"]);
  assert.deepEqual(conflicting, before);
  assert.deepEqual(evaluateBatch(applicants).map(row => row.outcome), ["Eligible", "Eligible", "Not eligible", "Needs documents"]);
});

test("loop traces expose an off-by-one access, including an empty list", () => {
  assert.deepEqual(loopTrace([59, 60, 72], false).map(row => row.index), [0, 1, 2]);
  assert.deepEqual(loopTrace([59, 60, 72], true).at(-1), { index: 3, value: null, error: true });
  assert.deepEqual(loopTrace([], false), []);
  assert.deepEqual(loopTrace([], true), [{ index: 0, value: null, error: true }]);
});

test("searches count actual comparisons and binary search rejects unsorted input", () => {
  assert.deepEqual(linearTrace(searchValues, 60), { indices: [0, 1, 2, 3, 4], foundIndex: 4 });
  assert.deepEqual(binaryTrace(searchValues, 60), { sorted: false, indices: [], foundIndex: -1 });
  const sorted = [...searchValues].sort((left, right) => left - right);
  assert.deepEqual(binaryTrace(sorted, 60), { sorted: true, indices: [3, 5], foundIndex: 5 });
  for (const target of sorted) assert.equal(sorted[binaryTrace(sorted, target).foundIndex], target);
  assert.equal(binaryTrace(sorted, 99).foundIndex, -1);
  assert.equal(linearTrace(searchValues, 99).indices.length, searchValues.length);
  assert.deepEqual(binaryTrace([], 60), { sorted: true, indices: [], foundIndex: -1 });
});

test("regression packs catch boundary and changed-requirement errors without hiding extra outputs", () => {
  assert.deepEqual(runTestCases(testCases, 60, false).filter(row => !row.passed).map(row => row.id), ["T2"]);
  assert.ok(runTestCases(testCases).every(row => row.passed));
  assert.deepEqual(runTestCases(revisionCases, 60).filter(row => !row.passed).map(row => row.id), ["R1", "R3"]);
  assert.ok(runTestCases(revisionCases, 70).every(row => row.passed));
  const extra = [{ id: "X", description: "two different outputs", records: [{ id: "A10", score: 72, documents: true }, { id: "B20", score: 59, documents: true }], expected: "Eligible" }];
  assert.equal(runTestCases(extra)[0].passed, false);
});

test("all CT chapters retain the six-scene story contract and local artwork", async () => {
  assert.equal(ctStoryTasks.length, 8);
  const registry = await readFile(new URL("../app/module/cyber/lessons/lesson-registry.tsx", import.meta.url), "utf8");
  for (const slug of CLASS11_CT_SLUGS) {
    assert.ok(registry.includes(`"${slug}": Class11CT`));
    const script = JSON.parse(await readFile(new URL(`../app/module/cyber/lessons/new/story/chapters/${slug}.json`, import.meta.url), "utf8"));
    assert.equal(script.scenes.length, 6);
    assert.equal(script.scenes[0].start, 0);
    for (const [index, scene] of script.scenes.entries()) {
      assert.ok(scene.caption && scene.title && scene.dialogue && scene.status && scene.mood);
      if (index) assert.ok(scene.start >= script.scenes[index - 1].start + script.scenes[index - 1].duration);
    }
  }
  for (const name of ["ct-scholarship-desk", "ct-logic-workbench"]) assert.ok((await stat(new URL(`../public/cyber-missions/class-11/${name}.webp`, import.meta.url))).size > 1000);
});
