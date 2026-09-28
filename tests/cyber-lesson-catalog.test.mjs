import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

const expectedSlugs = [
  "can-i-tell-this",
  "someone-new-in-my-game",
  "smart-helper-or-normal-tool",
  "teach-moti-to-sort",
  "free-coins-tap-now",
  "the-grown-ups-phone",
  "save-my-game-account",
  "trouble-in-the-class-group",
  "can-the-chatbot-be-wrong",
  "why-does-my-feed-repeat",
  "upi-paying-or-receiving",
  "the-gaming-giveaway-trap",
  "what-did-this-photo-reveal",
  "the-almost-real-login-page",
  "use-ai-without-losing-your-thinking",
  "real-edited-or-ai-made",
  "my-friend-suddenly-needs-money",
  "the-influencer-shop-and-giveaway",
];

async function catalog() {
  const text = await readFile(
    new URL("app/data/cyber-lessons.json", root),
    "utf8",
  ).catch(() => "[]");
  return JSON.parse(text);
}

test("the catalog contains the exact 18 approved lessons", async () => {
  const lessons = await catalog();

  assert.equal(lessons.length, 18);
  assert.deepEqual(
    lessons.map((lesson) => lesson.slug),
    expectedSlugs,
  );
  assert.equal(new Set(lessons.map((lesson) => lesson.id)).size, 18);
  assert.equal(new Set(lessons.map((lesson) => lesson.slug)).size, 18);
});

test("every band has two lessons in each CyberSuraksha bucket", async () => {
  const lessons = await catalog();

  for (const band of ["lower", "middle", "upper"]) {
    for (const strand of [
      "Cybersecurity",
      "Artificial Intelligence",
      "Cyber Fraud",
    ]) {
      assert.equal(
        lessons.filter(
          (lesson) => lesson.band === band && lesson.strand === strand,
        ).length,
        2,
        `${band} must contain two ${strand} lessons`,
      );
    }
  }
});

test("lesson mechanics and presentation patterns do not repeat", async () => {
  const lessons = await catalog();

  assert.equal(
    new Set(lessons.map((lesson) => lesson.primaryMechanic)).size,
    18,
  );
  assert.equal(
    new Set(lessons.map((lesson) => lesson.openingPattern)).size,
    18,
  );
  assert.equal(
    new Set(lessons.map((lesson) => lesson.completionPattern)).size,
    18,
  );
});

test("every lesson has the right grades, assessment contract, and family action", async () => {
  const lessons = await catalog();
  const gradesBySlug = {
    "can-i-tell-this": [3],
    "someone-new-in-my-game": [4],
    "smart-helper-or-normal-tool": [3],
    "teach-moti-to-sort": [4],
    "free-coins-tap-now": [3],
    "the-grown-ups-phone": [4],
    "save-my-game-account": [5],
    "trouble-in-the-class-group": [5],
    "can-the-chatbot-be-wrong": [5],
    "why-does-my-feed-repeat": [5],
    "upi-paying-or-receiving": [5],
    "the-gaming-giveaway-trap": [5],
    "what-did-this-photo-reveal": [6],
    "the-almost-real-login-page": [7],
    "use-ai-without-losing-your-thinking": [6],
    "real-edited-or-ai-made": [7],
    "my-friend-suddenly-needs-money": [6],
    "the-influencer-shop-and-giveaway": [7],
  };

  for (const lesson of lessons) {
    assert.deepEqual(lesson.grades, gradesBySlug[lesson.slug]);
    assert.equal(lesson.assessmentIds.length, 3);
    assert.equal(new Set(lesson.assessmentIds).size, 3);
    assert.ok(
      lesson.assessmentIds.every((id) => id.startsWith(`${lesson.slug}-`)),
    );
    assert.ok(lesson.familyAction.length >= 20);
    assert.ok(lesson.summary.length >= 30);
    assert.ok(lesson.durationMinutes >= 5);
  }
});

test("each class sees only its own CyberSuraksha lessons", async () => {
  const lessons = await catalog();
  const lessonTitlesByGrade = Object.fromEntries(
    [3, 4, 5, 6, 7].map((grade) => [
      grade,
      lessons
        .filter((lesson) => lesson.grades.includes(grade))
        .map((lesson) => lesson.title),
    ]),
  );

  assert.deepEqual(lessonTitlesByGrade[3], [
    "Can I Tell This?",
    "Smart Helper or Normal Tool?",
    "Free Coins! Tap Now!",
  ]);
  assert.deepEqual(lessonTitlesByGrade[4], [
    "Someone New in My Game",
    "Teach Moti to Sort",
    "The Grown-Up's Phone",
  ]);
  assert.equal(lessonTitlesByGrade[5].length, 6);
  assert.deepEqual(lessonTitlesByGrade[6], [
    "What Did This Photo Reveal?",
    "Use AI Without Losing Your Thinking",
    "My Friend Suddenly Needs Money",
  ]);
  assert.deepEqual(lessonTitlesByGrade[7], [
    "The Almost-Real Login Page",
    "Real, Edited or AI-Made?",
    "The Influencer Shop and Giveaway",
  ]);
});

test("the typed catalog validates JSON and exports grade lookups", async () => {
  const source = await readFile(
    new URL("app/data/cyber-lessons.ts", root),
    "utf8",
  ).catch(() => "");

  assert.match(source, /CYBER_LESSON_SLUGS/);
  assert.match(source, /z\.object/);
  assert.match(source, /getCyberLesson/);
  assert.match(source, /getCyberLessonsForGrade/);
});
