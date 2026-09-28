import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const lessonPath = "app/grade/[grade]/[subject]/[chapter]/";
const source = (file) => readFile(new URL(lessonPath + file, root), "utf8");

test("guided solved examples type the teaching and rough work progressively", async () => {
  const player = await source("iso3d.tsx");

  assert.match(player, /function typeWords\(/, "captions need word-paced typing");
  assert.match(player, /function typeCharacters\(/, "calculation lines need character-paced typing");
  assert.match(player, /ROUGH WORK · ONE LINE AT A TIME/, "the calculation should read as rough work");
  assert.match(player, /lineProgress < 1 \? "▍"/, "the active calculation needs a typing cursor");
  assert.match(player, /Math\.max\(10_000,/, "silent fallback steps must leave reading time");
});

test("every solved example starts from the question and offers help before playback", async () => {
  const player = await source("iso3d.tsx");

  assert.match(player, />Question first</, "students should see the question before the animation");
  assert.match(player, /Read → translate → plan → calculate → check/, "the full solving route should be visible");
  assert.match(player, /Need a thinking hint before you begin\?/, "a non-spoiling hint must be available");
  assert.match(player, /cloneElement\(bodyElement, \{ guided: true \}\)/, "SolvedExamples should enforce guided mode");
});

test("a formula recall checkpoint blocks the next calculation beat", async () => {
  const player = await source("iso3d.tsx");

  assert.match(player, /const gateCheckpoint = guided/, "the recall step must only gate guided examples");
  assert.match(player, /setRecallOpen\(true\);\s*return;/, "the player must pause instead of auto-advancing");
  assert.match(player, /recallPick !== recall\.correct/, "only the correct recalled idea may continue");
  assert.match(player, /Try again/, "an incorrect answer should support retrying");
  assert.match(player, /Continue the calculation/, "a correct answer should resume the worked solution");
});
