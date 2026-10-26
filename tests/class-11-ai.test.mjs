import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";
import { class11AiMissions, CLASS11_AI_SLUGS } from "../app/data/class-11-missions.ts";
import { class11Missions } from "../app/data/class-11-missions.ts";
import { class11Subjects } from "../app/data/class-11-curriculum.ts";
import { trainingExamples, heldOutExamples, nearestPrediction, comparison, evaluationRows, repairRows, aiStoryTasks } from "../app/module/cyber/lessons/senior/ai-content.ts";

test("Class 11 AI publishes all eight syllabus chapters alongside Cybersecurity", () => {
  assert.equal(class11AiMissions.length, 8);
  assert.equal(class11Missions.length, 32);
  assert.equal(new Set(class11Missions.map(lesson => lesson.id)).size, 32);
  assert.equal(new Set(class11Missions.flatMap(lesson => lesson.assessmentIds)).size, 96);
  assert.deepEqual(class11AiMissions.map(lesson => lesson.title), class11Subjects[1].modules.map(chapter => chapter.title));
  assert.deepEqual(class11AiMissions.map(lesson => lesson.slug), [...CLASS11_AI_SLUGS]);
  for (const lesson of class11AiMissions) {
    assert.equal(lesson.strand, "Artificial Intelligence");
    assert.deepEqual(lesson.grades, [11]);
    assert.equal(lesson.durationMinutes, 40);
    assert.equal(lesson.assessmentIds.length, 3);
  }
});

test("nearest-example learner changes with training coverage and abstains on disagreement", () => {
  assert.equal(nearestPrediction([], { x: 3, y: 2 }), null);
  assert.equal(nearestPrediction(trainingExamples.slice(0, 2), heldOutExamples[1]), "Paper");
  assert.equal(nearestPrediction(trainingExamples, heldOutExamples[1]), "Metal");
  assert.equal(nearestPrediction(trainingExamples, heldOutExamples[0]), "Paper");
  assert.equal(nearestPrediction(trainingExamples, heldOutExamples[2]), null);
  assert.deepEqual(trainingExamples.map(example => example.id), ["P1", "P2", "M1", "M2"]);
  assert.ok(!trainingExamples.some(example => heldOutExamples.some(test => test.id === example.id)));
  assert.equal(nearestPrediction([{ id: "a", x: 0, y: 0, label: "Paper" }, { id: "b", x: 2, y: 0, label: "Paper" }], { x: 1, y: 0 }), "Paper", "same-label ties do not require abstention");
});

test("model and baseline counts use the same denominator, including empty input", () => {
  assert.deepEqual(comparison(evaluationRows, "Recycle"), { total: 8, modelCorrect: 6, baselineCorrect: 5 });
  assert.deepEqual(evaluationRows.filter(row => row.actual !== row.predicted).map(row => row.id), ["E3", "E8"]);
  assert.deepEqual(comparison([], "Recycle"), { total: 0, modelCorrect: 0, baselineCorrect: 0 });
  assert.deepEqual(comparison([{ actual: "Residual", predicted: "Recycle" }], "Recycle"), { total: 1, modelCorrect: 0, baselineCorrect: 0 });
});

test("missing observations remain quarantined and each story has an explained decision", () => {
  assert.equal(repairRows.find(row => row.id === "S3").answer, "Quarantine");
  assert.equal(aiStoryTasks.length, 8);
  for (const task of aiStoryTasks) {
    assert.equal(task.choices.length, 3);
    assert.ok(task.answer >= 0 && task.answer < task.choices.length);
    assert.ok(task.why.length > 30);
  }
});

test("all AI chapters have the house story contract and project-local artwork", async () => {
  const registry = await readFile(new URL("../app/module/cyber/lessons/lesson-registry.tsx", import.meta.url), "utf8");
  for (const slug of CLASS11_AI_SLUGS) {
    assert.ok(registry.includes(`"${slug}": Class11AI`));
    const story = JSON.parse(await readFile(new URL(`../app/module/cyber/lessons/new/story/chapters/${slug}.json`, import.meta.url), "utf8"));
    assert.equal(story.scenes.length, 6);
    assert.equal(story.scenes[0].start, 0);
    for (const [index, scene] of story.scenes.entries()) {
      assert.ok(scene.caption && scene.title && scene.dialogue && scene.status && scene.mood);
      if (index) assert.ok(scene.start >= story.scenes[index - 1].start + story.scenes[index - 1].duration);
    }
  }
  for (const name of ["ai-sorting-lab", "ai-source-desk"]) assert.ok((await stat(new URL(`../public/cyber-missions/class-11/${name}.webp`, import.meta.url))).size > 1000);
});
