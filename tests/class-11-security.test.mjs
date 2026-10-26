import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { class11SecurityMissions as class11Missions, CLASS11_SECURITY_SLUGS as CLASS11_LESSON_SLUGS } from "../app/data/class-11-missions.ts";
import { class11Subjects } from "../app/data/class-11-curriculum.ts";
import { firstMismatch, inOrder, selectedExactly, reviewCoverage } from "../app/module/cyber/lessons/senior/security-content.ts";

test("Class 11 Cybersecurity retains its eight chapters in syllabus order", async () => {
  assert.equal(class11Subjects.length, 4);
  assert.ok(class11Subjects.every(subject => subject.modules.length === 8));
  assert.equal(class11Missions.length, 8);
  assert.deepEqual(class11Missions.map(lesson => lesson.title), class11Subjects[0].modules.map(chapter => chapter.title));
  assert.deepEqual(class11Missions.map(lesson => lesson.slug), [...CLASS11_LESSON_SLUGS]);
  assert.equal(new Set(class11Missions.flatMap(lesson => lesson.assessmentIds)).size, 24);
  for (const lesson of class11Missions) {
    assert.deepEqual(lesson.grades, [11]);
    assert.equal(lesson.strand, "Cybersecurity");
    assert.equal(lesson.durationMinutes, 40);
    assert.deepEqual(lesson.assessmentIds, [`${lesson.slug}-check-1`, `${lesson.slug}-check-2`, `${lesson.slug}-transfer`]);
  }
  const registry = await readFile(new URL("../app/module/cyber/lessons/lesson-registry.tsx", import.meta.url), "utf8");
  for (const slug of CLASS11_LESSON_SLUGS) assert.ok(registry.includes(`"${slug}": Class11Security`));
});

test("risk matching and action sequences reject incomplete and incorrect work", () => {
  const rows = [{ label: "Open sharing", answer: "Vulnerability" }, { label: "Registration list", answer: "Asset" }];
  assert.equal(firstMismatch(rows, {}), rows[0]);
  assert.equal(firstMismatch(rows, { "Open sharing": "Vulnerability", "Registration list": "Threat" }), rows[1]);
  assert.equal(firstMismatch(rows, { "Open sharing": "Vulnerability", "Registration list": "Asset" }), undefined);
  assert.equal(inOrder(["verify", "revoke"], ["verify", "revoke", "review"]), false);
  assert.equal(inOrder(["revoke", "verify", "review"], ["verify", "revoke", "review"]), false);
  assert.equal(inOrder(["verify", "revoke", "review"], ["verify", "revoke", "review"]), true);
});

test("checklists reject extra unsafe selections and budget review requires all three safeguards", () => {
  assert.equal(selectedExactly(["mfa", "recovery"], ["recovery", "mfa"]), true);
  assert.equal(selectedExactly(["mfa", "recovery", "public-code"], ["mfa", "recovery"]), false);
  assert.equal(selectedExactly(["mfa", "mfa"], ["mfa", "recovery"]), false);
  assert.deepEqual(reviewCoverage(["access", "backup", "identity"], 6), { cost: 6, valid: true });
  assert.equal(reviewCoverage(["access", "backup", "poster"], 6).valid, false);
  assert.equal(reviewCoverage(["access", "backup", "identity", "poster"], 6).valid, false);
  assert.equal(reviewCoverage(["access", "backup", "identity"], 5).valid, false);
});

test("every chapter uses the house story player with six complete narrated scenes", async () => {
  for (const slug of CLASS11_LESSON_SLUGS) {
    const base = new URL(`../app/module/cyber/lessons/new/story/chapters/${slug}`, import.meta.url);
    const story = JSON.parse(await readFile(`${base.pathname}.json`, "utf8"));
    assert.equal(story.scenes.length, 6);
    assert.equal(story.scenes[0].start, 0);
    for (const [index, scene] of story.scenes.entries()) {
      for (const key of ["caption", "dialogue", "label", "title", "status", "mood"]) assert.ok(scene[key], `${slug}: ${key}`);
      assert.ok(scene.duration > 0);
      if (index) assert.ok(scene.start >= story.scenes[index - 1].start + story.scenes[index - 1].duration);
    }
    assert.ok(story.duration >= story.scenes.at(-1).start + story.scenes.at(-1).duration);
    const entry = await readFile(`${base.pathname}.tsx`, "utf8");
    assert.ok(entry.includes(`makeSecurityStory("${slug}", script)`));
  }
});
