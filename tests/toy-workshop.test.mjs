import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function source(path) {
  return readFile(new URL(path, root), "utf8");
}

test("Toy Workshop is registered as the second playable Class 3 module", async () => {
  const registry = await source("app/data/module-registry.ts");

  assert.match(registry, /id: "grade-3-toy-workshop"/);
  assert.match(registry, /title: "Toy Workshop"/);
  assert.match(registry, /href: "\/module\/toy-workshop"/);
});

test("Toy Workshop contains ten teaching stations and saves local progress", async () => {
  const workshop = await source(
    "app/module/toy-workshop/ToyWorkshop.tsx",
  );

  assert.match(workshop, /Lesson \{screen \+ 1\} of \{screens\.length\}/);
  assert.match(workshop, /Pattern conveyor/);
  assert.match(workshop, /Tournament transfer/);
  assert.match(workshop, /grade-3-toy-workshop/);
  assert.match(workshop, /window\.localStorage/);
  assert.match(workshop, /fetch\("\/api\/module-runs"/);
});

test("every station uses explanation-first feedback and progressive help", async () => {
  const screens = await source(
    "app/module/toy-workshop/ToyScreens.tsx",
  );
  const support = await source(
    "app/module/toy-workshop/toy-support.ts",
  );

  const screenNames = [
    "ViewpointScreen",
    "TopViewScreen",
    "HiddenGeometryScreen",
    "SortingScreen",
    "BoxInspectorScreen",
    "PatternScreen",
    "ViewMatchScreen",
    "EdgeCircuitScreen",
    "AssemblyScreen",
    "LogicTransferScreen",
  ];

  for (const name of screenNames) {
    assert.match(screens, new RegExp(`function ${name}`));
  }

  assert.ok(
    screens.match(/onMistake\(\{/g)?.length >= 10,
    "expected explanatory mistake feedback across the stations",
  );
  assert.ok(
    support.match(/title:/g)?.length >= 10,
    "expected a progressive hint set for every station",
  );
  assert.match(support, /Gentle nudge/);
  assert.match(support, /Worked example/);
  assert.match(support, /label: "Rule"/);
});

test("the module includes motion and honors reduced-motion preferences", async () => {
  const css = await source(
    "app/module/toy-workshop/toy-workshop.module.css",
  );
  const themeCss = await source("app/cybersuraksha.css");

  assert.match(css, /@keyframes/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /var\(--sl-canvas\)/);
  assert.match(themeCss, /color-scheme: light/);
  assert.match(themeCss, /html\[data-theme="dark"\]/);
  assert.match(themeCss, /color-scheme: dark/);
});

test("handbook geometry uses shared figures and the exact source crop", async () => {
  const screens = await source(
    "app/module/toy-workshop/ToyScreens.tsx",
  );
  const figures = await source(
    "app/module/toy-workshop/ToyFigures.tsx",
  );
  const practice = await source(
    "app/module/toy-workshop/ToyPractice.tsx",
  );

  for (const figure of [
    "ProjectionFigure",
    "CabinFigure",
    "StepSolidFigure",
    "TwoCubeDotsFigure",
    "SortingShapeFigure",
    "TransparentCrateFigure",
    "SideViewSourceFigure",
    "EdgeCircuitFigure",
    "CubeAssemblyFigure",
  ]) {
    assert.match(screens, new RegExp(`<${figure}`));
  }

  assert.match(figures, /circuitEdgePairs/);
  assert.match(figures, /matchingCircuitEdges/);
  assert.match(figures, /assemblyCandidates/);
  assert.match(figures, /front: \[/);
  assert.match(figures, /side: \[/);
  assert.match(figures, /toy-joy-top-view-object\.png/);
  assert.match(screens, /Practice camera · new toy/);
  assert.match(screens, /Complete both camera checks to unlock/);
  assert.doesNotMatch(
    screens,
    /topOptions\.D\.map/,
    "the teaching example must not render the handbook answer before the choices",
  );
  assert.doesNotMatch(screens, /without revealing|answer remains hidden/i);
  assert.match(practice, /Remix arena/);
  assert.match(practice, /function simplerExample/);
  assert.match(practice, /Try a tiny seat map/);
  assert.match(practice, /onMistake\(simplerExample\(question\)\)/);
  assert.equal(
    practice.match(/\n\s+id: "/g)?.length,
    20,
    "expected two fresh practice questions for every station",
  );
});
