import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const middleLessons = [
  ["SaveMyGameAccount.tsx", "SaveMyGameAccount", "AccountCentreExperience", "AccountCentreExperience.tsx", "account-centre", "save-my-game-account"],
  ["TroubleInTheClassGroup.tsx", "TroubleInTheClassGroup", "ClassChatExperience", "ClassChatExperience.tsx", "class-chat", "trouble-in-the-class-group"],
  ["CanTheChatbotBeWrong.tsx", "CanTheChatbotBeWrong", "ChatbotCheckExperience", "ChatbotCheckExperience.tsx", "chatbot-check", "can-the-chatbot-be-wrong"],
  ["WhyDoesMyFeedRepeat.tsx", "WhyDoesMyFeedRepeat", "AdaptiveFeedExperience", "AdaptiveFeedExperience.tsx", "adaptive-feed", "why-does-my-feed-repeat"],
  ["UpiPayingOrReceiving.tsx", "UpiPayingOrReceiving", "UpiFlowExperience", "UpiFlowExperience.tsx", "upi-flow", "upi-paying-or-receiving"],
  ["TheGamingGiveawayTrap.tsx", "TheGamingGiveawayTrap", "GiveawayBrowserExperience", "GiveawayBrowserExperience.tsx", "giveaway-browser", "the-gaming-giveaway-trap"],
];

async function read(path) {
  return readFile(new URL(path, root), "utf8").catch(() => "");
}

test("all six middle-band lessons load dedicated functional experiences", async () => {
  for (const [file, component, experience, experienceFile, marker] of middleLessons) {
    const [lesson, activity] = await Promise.all([
      read(`app/module/cyber/lessons/middle/${file}`),
      read(`app/module/cyber/experience/middle/${experienceFile}`),
    ]);
    assert.match(lesson, new RegExp(`export function ${component}`));
    assert.match(lesson, new RegExp(`<${experience}`));
    assert.match(activity, new RegExp(`data-experience="${marker}"`));
  }
});

test("each middle lesson preserves its three assessment contracts", async () => {
  for (const [file, component, , , , slug] of middleLessons) {
    const lesson = await read(`app/module/cyber/lessons/middle/${file}`);
    for (const suffix of ["check-1", "check-2", "transfer"]) {
      assert.ok(lesson.includes(`${slug}-${suffix}`), `${component} must reference ${slug}-${suffix}`);
    }
  }
});

test("the UPI simulator teaches direction using fictional practice data", async () => {
  const upi = await read("app/module/cyber/experience/middle/UpiFlowExperience.tsx");
  assert.match(upi, /SurakshaPay/);
  assert.match(upi, /2468/);
  assert.match(upi, /No PIN is needed to receive money/);
  assert.match(upi, /reject-collect/);
  assert.doesNotMatch(upi, /href\s*=|window\.open|location\.href/);
});

test("middle-band styles preserve touch targets and safe motion", async () => {
  const css = await read("app/module/cyber/experience/middle/middle-experiences.module.css");
  assert.match(css, /min-height:\s*44px/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /@media \(max-width:/);
  assert.doesNotMatch(css, /transition:\s*all/);
});
