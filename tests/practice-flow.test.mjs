import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const source = (path) => readFile(new URL(path, root), "utf8");

test("practice presents one active question and advances only after success", async () => {
  const component = await source("app/components/learning/LearningSupport.tsx");

  assert.match(component, /const currentQuestion = questions\[currentIndex\]/);
  assert.match(component, /if \(!currentAnswer\) return;/);
  assert.match(component, /setCurrentIndex\(\(current\) => current \+ 1\)/);
  assert.match(component, /"Next question"/);
});

test("practice is one shot: a wrong answer locks, scores nothing and teaches inline", async () => {
  const component = await source("app/components/learning/LearningSupport.tsx");

  // Marks are only meaningful if a question cannot be retried until it is right,
  // so `choose` records the answer whichever way it went and the options lock.
  assert.match(component, /setSession\(\(current\) => \(\{ \.\.\.current, \[question\.id\]: value \}\)\)/);

  // A question answered in an EARLIER visit stays locked, or a reload would
  // hand back a free second look at a question already scored.
  assert.match(component, /useContext\(PracticeHistoryContext\)/);
  assert.match(component, /\.\.\.session,?\s*\}\s*\n?\s*: session;/);
  assert.doesNotMatch(component, /if \(!correct\) \{[\s\S]*?return;/,
    "a wrong answer must not bail out before the answer is recorded");
  assert.match(component, /disabled=\{Boolean\(currentAnswer\)\}/);

  // No second-chance dialog: the teaching renders inline under the options.
  assert.doesNotMatch(component, /onMistake\(question\.mistake\)/);
  assert.match(component, /currentAnswer && !wasCorrect/);
  assert.match(component, /currentQuestion\.mistake\?\.explanation/);

  // The real answer is shown, never the student's wrong pick relabelled.
  assert.match(component, /The answer was/);
  assert.match(component, /<strong>\{currentQuestion\.correct\}<\/strong>/);
});

test("worked reasoning is optional and reveals in ordered steps", async () => {
  const [component, css] = await Promise.all([
    source("app/components/learning/LearningSupport.tsx"),
    source("app/components/learning/learning-support.module.css"),
  ]);

  assert.match(component, /solution\?: \{/);
  assert.match(component, /currentQuestion\.solution\.steps\.map/);
  assert.match(component, /Why this works/);
  assert.match(css, /animation: solutionLineIn/);
  assert.match(css, /prefers-reduced-motion: reduce/);
});
