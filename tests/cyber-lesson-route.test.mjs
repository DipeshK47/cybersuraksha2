import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function source(path) {
  return readFile(new URL(path, root), "utf8").catch(() => "");
}

test("the dynamic route validates lesson, grade, and viewer context", async () => {
  const page = await source("app/module/cyber/[slug]/page.tsx");

  assert.match(page, /getCyberLesson/);
  assert.match(page, /notFound\(\)/);
  assert.match(page, /searchParams/);
  assert.match(page, /studentId/);
  assert.match(page, /className/);
  assert.match(page, /lesson\.grades\.includes/);
  assert.match(page, /CyberLessonPage/);
});

test("the client page joins runtime, platform frame, and lesson component", async () => {
  const page = await source("app/module/cyber/CyberLessonPage.tsx");

  assert.match(page, /useCyberLessonRun/);
  assert.match(page, /CyberLessonFrame/);
  assert.match(page, /getCyberLessonComponent/);
});

test("every catalog slug maps to one dedicated lesson component", async () => {
  const [catalogText, registry] = await Promise.all([
    source("app/data/cyber-lessons.json"),
    source("app/module/cyber/lessons/lesson-registry.tsx"),
  ]);
  const lessons = JSON.parse(catalogText);

  assert.match(registry, /satisfies Record<CyberLessonSlug/);
  assert.doesNotMatch(registry, /Fallback|GenericLesson|ComingSoon/);
  for (const lesson of lessons) {
    assert.ok(
      registry.includes(`"${lesson.slug}"`),
      `${lesson.slug} must have a dedicated component`,
    );
  }
});
