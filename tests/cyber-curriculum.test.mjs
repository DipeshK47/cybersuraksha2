import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function source(path) {
  return readFile(new URL(path, root), "utf8");
}

test("the curriculum exposes the three CyberSuraksha learning buckets", async () => {
  const curriculum = await source("app/data/curriculum.ts");

  assert.match(curriculum, /\| "Cybersecurity"/);
  assert.match(curriculum, /\| "Cyber Fraud"/);
  assert.match(curriculum, /\| "Artificial Intelligence"/);
});

test("playable modules can be shared by every grade in an age band", async () => {
  const registry = await source("app/data/module-registry.ts");

  assert.match(registry, /grades: readonly number\[\]/);
  assert.match(registry, /module\.grades\.includes\(grade\)/);
});

test("class and dashboard cards describe all CyberSuraksha strands", async () => {
  const [gradePage, dashboard] = await Promise.all([
    source("app/grade/[grade]/page.tsx"),
    source("app/dashboard/page.tsx"),
  ]);

  assert.match(gradePage, /strandCounts/);
  assert.match(gradePage, /Cybersecurity/);
  assert.match(gradePage, /Cyber Fraud/);
  assert.match(dashboard, /Cybersecurity/);
  assert.match(dashboard, /Cyber Fraud/);
});

test("CyberSuraksha lessons live inside their subject banners", async () => {
  const [curriculum, gradePage, subjectPage] = await Promise.all([
    source("app/data/curriculum.ts"),
    source("app/grade/[grade]/page.tsx"),
    source("app/grade/[grade]/[subject]/page.tsx"),
  ]);

  assert.match(curriculum, /modules\?: CurriculumModule\[\]/);
  assert.match(curriculum, /cyberSubjectsForGrade/);
  assert.match(curriculum, /slug: "cybersecurity"/);
  assert.match(curriculum, /slug: "artificial-intelligence"/);
  assert.match(curriculum, /slug: "cyber-fraud"/);
  assert.doesNotMatch(curriculum, /\.\.\.cyber\(/);
  assert.match(gradePage, /subject\.modules\?\.length/);
  assert.match(gradePage, /lessons/);
  assert.match(subjectPage, /subject\.modules/);
  assert.match(subjectPage, /getPlayableModule/);
  assert.match(subjectPage, /grade=\$\{grade\.grade\}/);
});
