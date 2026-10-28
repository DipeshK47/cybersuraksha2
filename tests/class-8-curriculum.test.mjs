import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { loadSource, root, solveTask } from "./class-8-helpers.mjs";

test("Class 8 library replaces shared missions with 32 original assignable chapters", async () => {
  const { getGradeCurriculum, assignmentChapters } = await loadSource('export { getGradeCurriculum } from "./app/data/curriculum"; export { assignmentChapters } from "./app/data/module-registry";');
  const school = getGradeCurriculum(8);
  assert.equal(school.subjects.length, 4);
  assert.deepEqual(school.subjects.map(subject => subject.modules.length), [8, 8, 8, 8]);
  const chapters = assignmentChapters.filter(row => row.grades.includes(8));
  assert.equal(chapters.length, 32);
  assert.ok(chapters.every(row => row.id.startsWith("cyber-class8-")));
  for (const [grade, count] of [[5,8], [6,8], [7,8], [9,32], [10,8], [11,32], [12,32]]) assert.equal(assignmentChapters.filter(row => row.grades.includes(grade)).length, count, `Grade ${grade} changed`);
});

test("every Class 8 chapter has original bilingual teaching and three solvable tasks", async () => {
  const { class8Chapters, evaluateTask } = await loadSource('export { class8Chapters } from "./app/data/class8"; export { evaluateTask } from "./app/module/cyber/lessons/class8/task-evaluation";');
  assert.equal(class8Chapters.length, 32);
  assert.equal(new Set(class8Chapters.map(row => row.slug)).size, 32);
  const kinds = new Set();
  function bilingual(value, location) {
    if (value && typeof value === "object") {
      if (typeof value.en === "string") {
        assert.ok(value.en.trim().length, location);
        const literal = /^(https?:\/\/\S+|(?:[a-z0-9-]+\.)+example|templates|n(?: [×+] n){1,2}|pages [<≤≥] 200|[RDLU](?: [RDLU])*)$/.test(value.en);
        if (literal) assert.equal(value.hi, value.en, location);
        else assert.match(value.hi, /[\u0900-\u097f]/, location);
      } else for (const [key, child] of Object.entries(value)) bilingual(child, `${location}.${key}`);
    }
  }
  for (const chapter of class8Chapters) {
    bilingual(chapter, chapter.slug);
    assert.equal(chapter.scenes.length, 6, chapter.slug);
    const words = chapter.scenes.reduce((sum, scene) => sum + scene.caption.en.split(/\s+/).length, 0);
    assert.ok(words >= 190 && words <= 225, `${chapter.slug}: ${words} words`);
    assert.equal(chapter.topics.length, 3); assert.equal(chapter.outcomes.length, 3); assert.equal(chapter.rubric.length, 3);
    assert.equal(chapter.tasks.length, 3, chapter.slug);
    for (const task of [chapter.decision, ...chapter.tasks]) {
      kinds.add(task.kind);
      assert.equal(evaluateTask(task, solveTask(task, evaluateTask)).correct, true, `${chapter.slug}: ${task.prompt.en}`);
      assert.equal(evaluateTask(task, "").correct, false, `${chapter.slug}: blank answer passed`);
      if (task.kind === "match") assert.equal(new Set(task.rows.map(row => row.id)).size, task.rows.length);
      if (task.kind === "match" && task.presentation === "permissions") assert.ok(task.simulation?.length, `${chapter.slug}: permission consequences missing`);
      if (task.kind === "model") {
        assert.equal(task.examples.some(row => task.tests.some(other => other.id === row.id)), false, "Train/test IDs overlap");
        assert.ok(task.minimumCorrect > 0 && task.minimumCorrect <= task.tests.length);
      }
    }
  }
  for (const kind of ["choice","select","match","order","number","binary","grid","route","model"]) assert.ok(kinds.has(kind), `${kind} missing`);
});

test("Class 8 stories have real local audio and measured six-scene cue timelines", async () => {
  const { class8Chapters } = await loadSource('export { class8Chapters } from "./app/data/class8";');
  for (const chapter of class8Chapters) {
    const audio = join(root, "public/audio/cyber", chapter.slug, "story.mp3");
    const scriptPath = join(root, "app/module/cyber/lessons/new/story/chapters", `${chapter.slug}.json`);
    assert.ok(existsSync(audio), `${chapter.slug}: missing audio`);
    assert.ok(statSync(audio).size > 10000, chapter.slug);
    const script = JSON.parse(readFileSync(scriptPath, "utf8"));
    assert.equal(script.scenes.length, 6);
    assert.ok(script.duration > 60 && script.duration < 150, `${chapter.slug}: ${script.duration}s`);
    for (let index=0;index<6;index++) {
      const scene=script.scenes[index];
      assert.equal(scene.caption, chapter.scenes[index].caption.en);
      assert.ok(scene.duration > 1);
      if (index) assert.ok(scene.start >= script.scenes[index-1].start+script.scenes[index-1].duration);
      assert.ok(script.duration >= scene.start+scene.duration);
    }
  }
});
