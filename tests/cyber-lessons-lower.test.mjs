import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const lowerLessons = [
  ["CanITellThis.tsx", "CanITellThis", "PrivacyBackpackExperience", "PrivacyBackpackExperience.tsx", "privacy-backpack", "can-i-tell-this"],
  ["SomeoneNewInMyGame.tsx", "SomeoneNewInMyGame", "BlockGameExperience", "BlockGameExperience.tsx", "block-game", "someone-new-in-my-game"],
  ["SmartHelperOrNormalTool.tsx", "SmartHelperOrNormalTool", "SmartHomeExperience", "SmartHomeExperience.tsx", "smart-home", "smart-helper-or-normal-tool"],
  ["TeachMotiToSort.tsx", "TeachMotiToSort", "TrainingConveyorExperience", "TrainingConveyorExperience.tsx", "training-conveyor", "teach-moti-to-sort"],
  ["FreeCoinsTapNow.tsx", "FreeCoinsTapNow", "CoinRunnerExperience", "CoinRunnerExperience.tsx", "coin-runner", "free-coins-tap-now"],
  ["TheGrownUpsPhone.tsx", "TheGrownUpsPhone", "PhoneHandoffExperience", "PhoneHandoffExperience.tsx", "phone-handoff", "the-grown-ups-phone"],
];

async function read(path) {
  return readFile(new URL(path, root), "utf8").catch(() => "");
}

test("all six lower-band lessons load dedicated playable experiences", async () => {
  for (const [file, component, experience, experienceFile, marker] of lowerLessons) {
    const [lesson, activity] = await Promise.all([
      read(`app/module/cyber/lessons/lower/${file}`),
      read(`app/module/cyber/experience/lower/${experienceFile}`),
    ]);
    assert.match(lesson, new RegExp(`export function ${component}`));
    assert.match(lesson, new RegExp(`<${experience}`));
    assert.match(activity, new RegExp(`data-experience="${marker}"`));
  }
});

test("each lower lesson preserves its three assessment contracts", async () => {
  for (const [file, component, , , , slug] of lowerLessons) {
    const lesson = await read(`app/module/cyber/lessons/lower/${file}`);
    for (const suffix of ["check-1", "check-2", "transfer"]) {
      assert.ok(lesson.includes(`${slug}-${suffix}`), `${component} must reference ${slug}-${suffix}`);
    }
  }
});

test("lower experiences include games, sorting, observation, and phone practice", async () => {
  const activities = await Promise.all(
    lowerLessons.map(([, , , file]) => read(`app/module/cyber/experience/lower/${file}`)),
  );
  const combined = activities.join("\n");

  for (const family of ["drag-sort", "game", "lab", "phone"]) {
    assert.match(combined, new RegExp(`data-interaction="${family}"`));
  }
  assert.match(combined, /GameShell/);
  assert.match(combined, /DragBoard/);
  assert.match(combined, /makeMistake/);
});

test("lower-band styles preserve touch targets and safe motion", async () => {
  const css = await read("app/module/cyber/experience/lower/lower-experiences.module.css");
  assert.match(css, /min-height:\s*44px/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /@media \(max-width:/);
  assert.doesNotMatch(css, /transition:\s*all/);
});
