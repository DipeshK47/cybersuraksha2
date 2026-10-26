import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { buildSync } from "esbuild";
import { newMissions } from "../app/data/new-missions.ts";
import { class11Subjects } from "../app/data/class-11-curriculum.ts";
import { class12Subjects } from "../app/data/class-12-curriculum.ts";

// Bundle the real catalogue so Node can resolve its extensionless TS imports.
const { outputFiles } = buildSync({
  absWorkingDir: fileURLToPath(new URL("../", import.meta.url)),
  stdin: { contents: 'export * from "./app/data/curriculum"; export * from "./app/data/module-registry"; export * from "./app/data/cyber-lessons";', resolveDir: fileURLToPath(new URL("../", import.meta.url)) },
  bundle: true,
  write: false,
  platform: "node",
  format: "esm",
});
const { curriculum, getGradeCurriculum, getPlayableModule, getCyberLesson, assignmentChapters } =
  await import(`data:text/javascript;base64,${Buffer.from(outputFiles[0].text).toString("base64")}`);

test("delivery exposes only Classes 6–12 and every cyber chapter is playable and assignable", () => {
  assert.deepEqual(curriculum.map(entry => entry.grade), [6, 7, 8, 9, 10, 11, 12]);
  for (const grade of [3, 4, 5]) assert.equal(getGradeCurriculum(grade), undefined);
  const strands = ["Artificial Intelligence", "Computational Thinking", "Cyber Fraud", "Cybersecurity"];
  for (const entry of curriculum) {
    const subjects = entry.subjects.filter(subject => subject.strand && subject.strand !== "English");
    assert.deepEqual(subjects.map(subject => subject.strand).sort(), strands);
    for (const subject of subjects) {
      assert.equal(subject.modules.length, entry.grade >= 11 ? 8 : 2);
      for (const chapter of subject.modules) {
        const playable = getPlayableModule(entry.grade, chapter.title);
        assert.ok(playable, `Class ${entry.grade}: ${chapter.title}`);
        assert.ok(assignmentChapters.some(module => module.id === playable.id && module.grades.includes(entry.grade)));
        const lesson = getCyberLesson(playable.href.split("/").at(-1));
        assert.ok(lesson.grades.includes(entry.grade), "lesson route must accept the delivery class");
        assert.equal(lesson.id, playable.id, "progress uses the same module identity");
      }
    }
  }
});

test("the shifted bands retain shared chapters and stable progress identities", () => {
  for (const [band, grades] of Object.entries({ lower: [6, 7], middle: [8], upper: [9, 10] })) {
    const missions = newMissions.filter(mission => mission.band === band);
    assert.equal(missions.length, 8);
    for (const mission of missions) assert.deepEqual(getCyberLesson(mission.slug).grades, grades);
  }
  assert.equal(getCyberLesson("pattern-detective").id, "cyber-lower-ct-pattern-detective");
  assert.equal(getCyberLesson("algorithm-optimization").id, "cyber-upper-ct-algorithm-optimization");
  assert.deepEqual(getCyberLesson("can-i-tell-this").grades, [6]);
  assert.deepEqual(getCyberLesson("the-almost-real-login-page").grades, [10]);
});

test("Classes 11–12 and the Class 10 textbook libraries are preserved", () => {
  assert.deepEqual(getGradeCurriculum(11).subjects, class11Subjects);
  assert.deepEqual(getGradeCurriculum(12).subjects, class12Subjects);
  const subjects = getGradeCurriculum(10).subjects;
  assert.equal(subjects.find(subject => subject.slug === "mathematics").chapters.length, 14);
  assert.equal(subjects.find(subject => subject.slug === "english").chapters.length, 9);
});
