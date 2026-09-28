import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const source = (path) => readFile(new URL(path, root), "utf8");
const videoTopics = new URL("../../class10_modules/maths/video/topics/", import.meta.url);
const videoSource = (path) => readFile(new URL(path, videoTopics), "utf8");

const CH8 = "app/grade/[grade]/[subject]/[chapter]/";
const NEW_TOPICS = {
  "topic-panels-8-3.tsx": ["ratios45", "ratios3060", "ratios0090", "table81"],
  "topic-panels-8-4.tsx": ["identity", "proving", "summary"],
};

test("every 8.1 and 8.2 topic keeps the Recap / Solved Examples / Practice shape", async () => {
  const text = [
    await source(`${CH8}topic-panels.tsx`),
    await source(`${CH8}topic-panels-8-2.tsx`),
  ].join("\n");

  // Two §8.1 topics plus nine §8.2 topics.
  for (const heading of ["Recap", "Solved Examples", "Practice Questions"]) {
    const count = [...text.matchAll(new RegExp(`title="${heading}"`, "g"))].length;
    assert.equal(count, 11, `expected one "${heading}" heading for all 11 topics`);
  }

  const solved = [...text.matchAll(/<(?:SolvedExamples|ExampleWalkthrough)/g)].length;
  const practice = [...text.matchAll(/<PracticeSet/g)].length;
  assert.equal(solved, 11, "every topic needs an animated solved-example walkthrough");
  assert.equal(practice, 11, "every topic needs a separate practice set");
});

test("every Chapter 8 topic that names a panel has one registered", async () => {
  const [curriculum, registry, p82, p83, p84] = await Promise.all([
    source("app/data/curriculum.ts"),
    source(`${CH8}topic-panels.tsx`),
    source(`${CH8}topic-panels-8-2.tsx`),
    source(`${CH8}topic-panels-8-3.tsx`),
    source(`${CH8}topic-panels-8-4.tsx`),
  ]);

  // Panel keys the curriculum promises for Chapter 8.
  const wanted = [...curriculum.matchAll(/panel:\s*"([a-z0-9]+)"/gi)].map((m) => m[1]);
  assert.ok(wanted.length >= 18, `expected the full Chapter 8 topic list, saw ${wanted.length}`);

  // Keys any of the panel maps actually define.
  const defined = new Set(
    [registry, p82, p83, p84]
      .flatMap((file) => [...file.matchAll(/^\s{2}([a-z0-9]+):\s*\{\s*hints:/gim)])
      .map((m) => m[1]),
  );

  const missing = wanted.filter((key) => !defined.has(key));
  assert.deepEqual(missing, [], `curriculum names panels nothing registers: ${missing}`);
});

test("the 8.3 and 8.4 panel maps are spread into TOPIC_PANELS", async () => {
  const registry = await source(`${CH8}topic-panels.tsx`);
  for (const map of ["PANELS_8_3", "PANELS_8_4"]) {
    assert.match(registry, new RegExp(`import \\{ ${map} \\}`), `${map} is not imported`);
    assert.match(registry, new RegExp(`\\.\\.\\.${map},`), `${map} is not spread in`);
  }
});

test("each new panel entry supplies both hints and a Panel", async () => {
  for (const [file, keys] of Object.entries(NEW_TOPICS)) {
    const text = await source(CH8 + file);
    for (const key of keys) {
      assert.match(
        text,
        new RegExp(`${key}:\\s*\\{\\s*hints:\\s*\\w+,\\s*Panel:\\s*\\w+\\s*\\}`),
        `${file}: ${key} must be { hints, Panel } — a bare component silently breaks the hint drawer`,
      );
    }
  }
});

test("every new topic keeps the Recap / Solved Examples / Practice shape", async () => {
  for (const [file, keys] of Object.entries(NEW_TOPICS)) {
    const text = await source(CH8 + file);
    for (const heading of ["Recap", "Solved Examples", "Practice Questions"]) {
      const count = [...text.matchAll(new RegExp(`title="${heading}"`, "g"))].length;
      assert.equal(
        count, keys.length,
        `${file}: expected one "${heading}" heading per topic (${keys.length}), found ${count}`,
      );
    }
    // Solved examples must be tabbed, so a student can tell which one they are on.
    assert.equal(
      [...text.matchAll(/<SolvedExamples/g)].length, keys.length,
      `${file}: every topic needs its examples in a SolvedExamples picker`,
    );
  }
});

test("solved examples use guided recall while recap animations stay uninterrupted", async () => {
  const player = await source(`${CH8}iso3d.tsx`);
  assert.match(player, /className=\{styles\.teachingStage\}/, "guided examples need a visible teaching-stage label");
  assert.match(player, /className=\{styles\.recallCheckpoint\}/, "guided examples need the recall checkpoint");
  assert.match(player, /Continue the calculation/, "a correct recall answer needs an explicit continuation");
  assert.match(player, /Try again/, "a wrong recall answer must retry without advancing");
  for (const pace of ["0.75", "1", "1.25"]) {
    assert.match(player, new RegExp(`GUIDED_PACES[^;]*${pace}`, "s"), `missing ${pace}× teaching pace`);
  }

  for (const [file, keys] of Object.entries(NEW_TOPICS)) {
    const text = await source(CH8 + file);
    const guidedBodies = [...text.matchAll(/body:\s*\(\s*<Explainer3D\s+guided\b/g)].length;
    const allExplainerBodies = [...text.matchAll(/body:\s*\(\s*<Explainer3D\b/g)].length;
    assert.equal(guidedBodies, allExplainerBodies, `${file}: every solved-example player must opt into guided mode`);

    const recaps = [...text.matchAll(
      /<SectionHeading kicker="Section 1 of 3" title="Recap" \/>\s*<(Explainer3D|TrigAngleLab)\b([^>]*)>/g,
    )];
    assert.equal(recaps.length, keys.length, `${file}: could not identify every recap player`);
    for (const recap of recaps) {
      assert.doesNotMatch(recap[2], /\bguided\b/, `${file}: recap players must not stop for solved-example recall`);
    }
  }
});

/** Code only — the prose explains why these props are absent and would
 *  otherwise match the very patterns we are asserting against. */
const stripComments = (text) =>
  text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

test("no lesson figure auto-plays and none is tilted", async () => {
  // Both were explicit rejections: a page of figures all playing at once is
  // unreadable, and a tilted camera skews the right angles §8.3 depends on.
  for (const file of Object.keys(NEW_TOPICS)) {
    const code = stripComments(await source(CH8 + file));
    assert.doesNotMatch(code, /\bautoplay\b/i, `${file} must not auto-play its figures`);
    assert.doesNotMatch(code, /\btilted\b/i, `${file} must stay in front elevation`);
  }
});

test("a topic with only a panel is reachable, not locked", async () => {
  const lesson = await source(`${CH8}ChapterLesson.tsx`);
  assert.match(
    lesson, /const isTaught = \(t: ChapterTopic\) => usesVideo\(t\) \|\| Boolean\(t\.panel\)/,
    "isTaught must count a panel, or every §8.3 topic locks for want of a video file",
  );
  // The old inline predicate must be gone from all its call sites.
  assert.doesNotMatch(
    lesson, /!\w+\.video && \w+\.at === undefined/,
    "an inline video-only lock survived; route it through isTaught",
  );
});

test("sections 8.3 through 8.5 have their own rendered video, poster, and duration", async () => {
  const curriculum = await source("app/data/curriculum.ts");
  for (const lesson of [
    "lesson-8-3-45",
    "lesson-8-3-30-60",
    "lesson-8-3-0-90",
    "lesson-8-3-table",
    "lesson-8-4-identities",
    "lesson-8-4-proving",
    "lesson-8-summary",
  ]) {
    assert.match(curriculum, new RegExp(`video: "/videos/${lesson}\\.mp4"`));
    assert.match(curriculum, new RegExp(`poster: "/videos/${lesson}-poster\\.png"`));
  }
  assert.equal(
    [...curriculum.matchAll(/duration: "(?:3:50|1:52|1:40|1:43|1:51|1:55)"/g)].length,
    7,
    "each new topic video should display its own measured duration",
  );
});

test("every rebuilt Chapter 8 film uses bespoke motion choreography", async () => {
  const scenes = [
    "ratios45/scene.py",
    "ratios3060/scene.py",
    "ratios0090/scene.py",
    "table81/scene.py",
    "identity/scene.py",
    "proving/scene.py",
    "summary/scene.py",
  ];

  for (const scene of scenes) {
    const text = await videoSource(scene);
    assert.doesNotMatch(text, /ConceptDeck|from _deck/, `${scene} fell back to the rejected slide-deck renderer`);
    assert.match(text, /from _cinematic import/, `${scene} must use the motion-first teaching kit`);
    assert.ok(
      [...text.matchAll(/self\.P\(/g)].length >= 8,
      `${scene} needs sustained animated teaching beats rather than static cards`,
    );
    assert.match(
      text,
      /Transform|ValueTracker|Create\(|Rotate\(|GrowFromCenter|LaggedStart/,
      `${scene} needs visible geometric or algebraic transformation`,
    );
  }
});

test("the seven published lesson files are real encoded media, not placeholders", async () => {
  for (const lesson of [
    "lesson-8-3-45",
    "lesson-8-3-30-60",
    "lesson-8-3-0-90",
    "lesson-8-3-table",
    "lesson-8-4-identities",
    "lesson-8-4-proving",
    "lesson-8-summary",
  ]) {
    const video = new URL(`public/videos/${lesson}.mp4`, root);
    const poster = new URL(`public/videos/${lesson}-poster.png`, root);
    const [videoInfo, posterInfo, header] = await Promise.all([
      stat(video),
      stat(poster),
      readFile(video).then((bytes) => bytes.subarray(0, 32).toString("latin1")),
    ]);
    assert.ok(videoInfo.size > 1_000_000, `${lesson}.mp4 is suspiciously small`);
    assert.ok(posterInfo.size > 10_000, `${lesson} poster is suspiciously small`);
    assert.match(header, /ftyp/, `${lesson}.mp4 has no ISO media header`);
  }
});
