import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const feedbackFiles = [
  "app/module/secret-message-rescue/LessonScreens.tsx",
  "app/module/double-century-vault/DoubleCenturyVaultScreens.tsx",
  "app/module/nani-maa-vacation-challenge/NaniMaaVacationChallengeScreens.tsx",
  "app/module/toy-workshop/ToyScreens.tsx",
];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function extractFeedbackObjects(source) {
  const markers = [...source.matchAll(/onMistake\(\{|mistake:\s*\{/g)];

  return markers.map((match) => {
    const objectStart = source.indexOf("{", match.index);
    let depth = 0;
    let quote = "";
    let escaped = false;

    for (let index = objectStart; index < source.length; index += 1) {
      const character = source[index];

      if (quote) {
        if (escaped) {
          escaped = false;
        } else if (character === "\\") {
          escaped = true;
        } else if (character === quote) {
          quote = "";
        }
        continue;
      }

      if (character === '"' || character === "'" || character === "`") {
        quote = character;
        continue;
      }

      if (character === "{") depth += 1;
      if (character === "}") depth -= 1;
      if (depth === 0) return source.slice(objectStart, index + 1);
    }

    throw new Error("Unclosed feedback object");
  });
}

test("every module wrong-answer popup teaches with a smaller parallel example", () => {
  const expectedCounts = {
    "app/module/secret-message-rescue/LessonScreens.tsx": 10,
    "app/module/double-century-vault/DoubleCenturyVaultScreens.tsx": 18,
    "app/module/nani-maa-vacation-challenge/NaniMaaVacationChallengeScreens.tsx": 15,
    "app/module/toy-workshop/ToyScreens.tsx": 15,
  };

  for (const relativePath of feedbackFiles) {
    const objects = extractFeedbackObjects(read(relativePath));
    assert.equal(
      objects.length,
      expectedCounts[relativePath],
      `${relativePath} feedback count changed; audit every new wrong-answer path`,
    );

    objects.forEach((feedback, index) => {
      assert.match(
        feedback,
        /smaller example/i,
        `${relativePath} feedback ${index + 1} needs a clearly separate example`,
      );
      assert.match(
        feedback,
        /explanation(?:\s*:|,)/,
        `${relativePath} feedback ${index + 1} needs a concept explanation`,
      );
      assert.match(
        feedback,
        /workedSteps:/,
        `${relativePath} feedback ${index + 1} needs a worked miniature example`,
      );
      assert.doesNotMatch(
        feedback,
        /question\.correct|item\.correct|the (?:correct|coded|next|landing) (?:answer|letter|option) is|option [A-D] is correct/i,
        `${relativePath} feedback ${index + 1} appears to reveal the active answer`,
      );
    });
  }
});

test("Toy Workshop remixes route every wrong choice through the safe example generator", () => {
  const source = read("app/module/toy-workshop/ToyPractice.tsx");
  const questionCount = [...source.matchAll(/\bid:\s*"[^"]+"/g)].length;
  const exampleKinds = [
    "camera",
    "grid",
    "count",
    "shape",
    "faces",
    "pattern",
    "view",
    "edges",
    "blocks",
    "sets",
  ];

  assert.equal(questionCount, 20, "audit the policy when remix questions change");
  assert.match(source, /onMistake\(simplerExample\(question\)\)/);
  assert.match(source, /const eyebrow = `\$\{question\.eyebrow\} · smaller example`/);
  for (const kind of exampleKinds) {
    assert.match(source, new RegExp(`case "${kind}"`));
  }
});
