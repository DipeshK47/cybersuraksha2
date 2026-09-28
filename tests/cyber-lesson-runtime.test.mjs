import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function source(path) {
  return readFile(new URL(path, root), "utf8").catch(() => "");
}

test("the shared runtime records learning events and saves completion", async () => {
  const runtime = await source("app/module/cyber/useCyberLessonRun.ts");

  for (const event of [
    "module_started",
    "question_answered",
    "hint_used",
    "mistake",
    "privacy_leak",
    "module_completed",
  ]) {
    assert.ok(runtime.includes(event), `runtime must emit ${event}`);
  }

  assert.match(runtime, /window\.localStorage/);
  assert.match(runtime, /\/api\/module-runs/);
  assert.match(runtime, /role === "teacher"/);
  assert.match(runtime, /saveAttempt/);
  assert.match(runtime, /answered\[decision\.id\]/);
});

test("the runtime contract lets each lesson own its visible composition", async () => {
  const types = await source("app/module/cyber/lesson-types.ts");

  assert.match(types, /CyberLessonComponentProps/);
  assert.match(types, /LessonDecision/);
  assert.match(types, /recordDecision/);
  assert.match(types, /recordMistake/);
  assert.match(types, /recordHint/);
  assert.match(types, /completeLesson/);
  assert.match(types, /updateState/);
});

test("the lesson frame is accessible platform chrome rather than a lesson template", async () => {
  const [frame, css] = await Promise.all([
    source("app/module/cyber/CyberLessonFrame.tsx"),
    source("app/module/cyber/cyber-lesson-frame.module.css"),
  ]);

  assert.match(frame, /Skip to lesson/);
  assert.match(frame, /aria-live="polite"/);
  assert.match(frame, /Exit/);
  assert.match(frame, /Start over/);
  assert.match(frame, /retrySave/);
  assert.doesNotMatch(frame, /const screens|sceneList|Lesson \{.* of/);
  assert.match(css, /min-height:\s*44px/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.doesNotMatch(css, /transition:\s*all/);
});

test("both learning overlays restore focus to the control that opened them", async () => {
  const support = await source("app/components/learning/LearningSupport.tsx");
  const hintDrawer = support.slice(support.indexOf("export function HintDrawer"));

  assert.match(hintDrawer, /const previousFocus = document\.activeElement/);
  assert.match(hintDrawer, /previousFocus\?\.focus\(\)/);
});
