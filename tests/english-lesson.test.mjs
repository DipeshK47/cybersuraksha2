import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const scenesOf = (screens) =>
  Object.fromEntries([...screens.matchAll(/id: "([\w-]+)",\n\s*visual: <div className=\{styles\.practiceStage\}>/g)].map((m) => [m[1], true]));
const source = (path) => readFile(new URL(path, root), "utf8");

test("A Letter to God is registered as a playable English lesson", async () => {
  const curriculum = await source("app/data/curriculum.ts");
  assert.match(curriculum, /slug: "a-letter-to-god"/);
  assert.match(curriculum, /video: "\/videos\/a-letter-to-god\.mp4"/);
  assert.match(curriculum, /poster: "\/videos\/a-letter-to-god-poster\.jpg"/);
  assert.match(curriculum, /duration: "20:49"/);
});

test("the English lesson media is present and non-empty", async () => {
  const video = new URL("public/videos/a-letter-to-god.mp4", root);
  const poster = new URL("public/videos/a-letter-to-god-poster.jpg", root);
  await Promise.all([access(video), access(poster)]);
  assert.ok((await stat(video)).size > 1_000_000, "lesson video is unexpectedly small");
  assert.ok((await stat(poster)).size > 10_000, "lesson poster is unexpectedly small");
});

test("Badal and Moti uses complete, project-owned storybook artwork", async () => {
  const [scene, preview, stylesheet] = await Promise.all([
    source("app/module/badal-and-moti/StoryScene.tsx"),
    source("app/module/badal-and-moti/StoryScene.preview.tsx"),
    source("app/module/badal-and-moti/badal-and-moti.module.css"),
  ]);
  const art = ["courtyard", "badal", "badal-wave", "moti", "moti-sit", "maa", "storm-clouds"];

  assert.match(scene, /fetchPriority="high"/);
  assert.doesNotMatch(scene, /_vinext\/image/);
  assert.match(scene, /data-sky=\{sky\}/);
  assert.match(scene, /data-rain=\{rain\}/);
  assert.doesNotMatch(scene, /<svg/);
  assert.match(stylesheet, /Hallmark · component: story animation/);
  assert.match(stylesheet, /prefers-reduced-motion: reduce/);
  assert.equal((preview.match(/name: "/g) ?? []).length, 8, "preview should cover eight story states");

  await Promise.all(
    art.map(async (name) => {
      const asset = new URL(`public/lessons/badal-and-moti/${name}.webp`, root);
      await access(asset);
      assert.ok((await stat(asset)).size > 30_000, `${name}.webp is unexpectedly small`);
      assert.ok(scene.includes(`${name}.webp`), `${name}.webp is not wired into StoryScene`);
    }),
  );
});

test("Badal and Moti ships fast, mastered narration with a browser fallback", async () => {
  const [manifestText, screens, player] = await Promise.all([
    source("app/module/badal-and-moti/badal-moti-narration.json"),
    source("app/module/badal-and-moti/BadalAndMotiScreens.tsx"),
    source("app/components/learning/TeachingAnimations.tsx"),
  ]);
  const manifest = JSON.parse(manifestText);
  const clips = [
    ...Object.values(manifest.headings),
    ...Object.values(manifest.examples).flat(),
  ];

  assert.equal(clips.length, 20, "four introductions and sixteen walkthrough beats need recordings");
  // Every other "Read to me" in the lesson (prompts, activity sentences, exercise
  // questions, wrong-answer explanations) is recorded too, so the browser voice is
  // only ever a fallback.
  const extra = Object.values(manifest.clips);
  assert.ok(extra.length >= 49, `expected the activity/exercise/mistake clips, found ${extra.length}`);
  assert.match(screens, /narration=\{questionAudio\}/);
  const renderer = await source("scripts/render-badal-moti-narration.py");
  assert.match(renderer, /LOCKED_VOICE = "en-US-AvaMultilingualNeural"/, "the approved narrator is locked");
  assert.doesNotMatch(renderer, /atempo/, "no time-stretch: that is what sounded synthetic");
  assert.equal(Object.keys(scenesOf(screens)).length, 15, "every exercise question carries a story scene");
  assert.equal((screens.match(/audioSrc: clip\("m-/g) ?? []).length, 20, "every mistake dialog carries its recording");
  clips.push(...extra);
  assert.equal(new Set(clips.map((clip) => clip.src)).size, clips.length, "narration URLs must be unique");
  assert.match(screens, /badal-moti-narration\.json/);
  assert.match(screens, /narrationSrcs=/);
  assert.match(player, /new Audio\(audioSrc\)/);
  assert.match(player, /utterance\.rate = 1\.04/);
  assert.match(player, /utterance\.pitch = 1/);

  await Promise.all(
    clips.map(async (clip) => {
      const asset = new URL(`public${clip.src}`, root);
      await access(asset);
      assert.ok((await stat(asset)).size > 8_000, `${clip.id} is missing or unexpectedly small`);
    }),
  );
});
