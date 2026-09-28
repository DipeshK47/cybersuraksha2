import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const chapter = new URL("app/grade/[grade]/[subject]/[chapter]/", root);

test("the 0°–90° recap is a real interactive geometry lab", async () => {
  const [component, panel, styles, packageJson] = await Promise.all([
    readFile(new URL("TrigAngleLab.tsx", chapter), "utf8"),
    readFile(new URL("topic-panels-8-3.tsx", chapter), "utf8"),
    readFile(new URL("trig-angle-lab.module.css", chapter), "utf8"),
    readFile(new URL("package.json", root), "utf8"),
  ]);

  assert.equal(JSON.parse(packageJson).dependencies.mafs, "0.21.0");
  assert.match(component, /from "mafs"/);
  assert.match(component, /<MovablePoint/);
  assert.match(component, /type="range"/);
  assert.match(component, /const PRESETS = \[0, 30, 45, 60, 90\]/);
  assert.match(component, /denominator = 0/);
  assert.match(component, /src=\{current\.narrationSrc\}/);
  assert.match(component, /current\.math\.slice\(0, visibleMathCount\)/);
  assert.match(component, /onTimeUpdate=/);
  assert.match(component, /Guided explanation progress/);
  assert.match(component, /<AnimatePresence/);
  assert.match(panel, /<TrigAngleLab steps=\{\[/, "the eight recap beats must stay inline for narration AST order");
  assert.equal((panel.match(/narrationSrc: "\/audio\/chapter8\/8-3-0(?:5[3-9]|60)\.mp3"/g) ?? []).length, 8);
  assert.match(component, /\{current\.caption\}/, "the exact teaching caption must remain visible");
  assert.match(component, /current\.math\.slice\(0, visibleMathCount\)/, "math must reveal progressively");
  assert.match(component, /className=\{styles\.answerReveal\}/, "the final answer needs its own reveal");
  assert.match(component, /Guided explanation progress/, "the narrated beat needs an accessible seek control");
  assert.doesNotMatch(component, /onPause=\{\(\) => setPlaying\(false\)\}/, "source changes must not cancel auto-advance");
  assert.match(styles, /grid-template-columns:/);
  assert.match(styles, /@media \(max-width:/);

  for (let id = 53; id <= 60; id += 1) {
    const audio = await stat(new URL(`public/audio/chapter8/8-3-${String(id).padStart(3, "0")}.mp3`, root));
    assert.ok(audio.size > 1_000, `guided-tour audio 8-3-${id} is missing`);
  }
});

test("the rebuilt film grammar removes the slanted divider and collision-prone meters", async () => {
  const cinematic = await readFile(new URL("../class10_modules/maths/video/topics/_cinematic.py", root), "utf8");
  const scene = await readFile(new URL("../class10_modules/maths/video/topics/ratios0090/scene.py", root), "utf8");

  assert.doesNotMatch(cinematic, /Line\(head\.get_left/);
  // angle_spark was the arc-and-dots mark in every title card and beat corner.
  // Dipesh asked for it gone, so this now asserts its ABSENCE — the old slanted
  // divider must stay gone too, and neither may come back.
  assert.doesNotMatch(cinematic, /angle_spark/);
  assert.doesNotMatch(scene, /def meters/);
  assert.match(scene, /def lab_shell/);
  assert.match(scene, /def live_triangle/);
  assert.match(scene, /CurvedArrow/);
});
