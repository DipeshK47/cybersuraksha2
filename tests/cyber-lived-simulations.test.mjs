import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function source(path) {
  return readFile(new URL(path, root), "utf8").catch(() => "");
}

const experiences = [
  ["lower/PrivacyBackpackExperience.tsx", "privacy-backpack", "drag-sort"],
  ["lower/SmartHomeExperience.tsx", "smart-home", "lab"],
  ["lower/CoinRunnerExperience.tsx", "coin-runner", "game"],
  ["lower/BlockGameExperience.tsx", "block-game", "game"],
  ["lower/TrainingConveyorExperience.tsx", "training-conveyor", "drag-sort"],
  ["lower/PhoneHandoffExperience.tsx", "phone-handoff", "phone"],
  ["middle/AccountCentreExperience.tsx", "account-centre", "settings"],
  ["middle/ClassChatExperience.tsx", "class-chat", "social"],
  ["middle/ChatbotCheckExperience.tsx", "chatbot-check", "evidence"],
  ["middle/AdaptiveFeedExperience.tsx", "adaptive-feed", "social"],
  ["middle/UpiFlowExperience.tsx", "upi-flow", "phone"],
  ["middle/GiveawayBrowserExperience.tsx", "giveaway-browser", "browser"],
  ["upper/PhotoPrivacyExperience.tsx", "photo-privacy", "editor"],
  ["upper/AiWorkbenchExperience.tsx", "ai-workbench", "editor"],
  ["upper/ImpersonationChatExperience.tsx", "impersonation-chat", "social"],
  ["upper/FakeLoginBrowserExperience.tsx", "fake-login-browser", "browser"],
  ["upper/MediaEvidenceExperience.tsx", "media-evidence", "evidence"],
  ["upper/InfluencerShopExperience.tsx", "influencer-shop", "social"],
];

const lessonFiles = [
  "lower/CanITellThis.tsx",
  "lower/SmartHelperOrNormalTool.tsx",
  "lower/FreeCoinsTapNow.tsx",
  "lower/SomeoneNewInMyGame.tsx",
  "lower/TeachMotiToSort.tsx",
  "lower/TheGrownUpsPhone.tsx",
  "middle/SaveMyGameAccount.tsx",
  "middle/TroubleInTheClassGroup.tsx",
  "middle/CanTheChatbotBeWrong.tsx",
  "middle/WhyDoesMyFeedRepeat.tsx",
  "middle/UpiPayingOrReceiving.tsx",
  "middle/TheGamingGiveawayTrap.tsx",
  "upper/WhatDidThisPhotoReveal.tsx",
  "upper/UseAiWithoutLosingYourThinking.tsx",
  "upper/MyFriendSuddenlyNeedsMoney.tsx",
  "upper/TheAlmostRealLoginPage.tsx",
  "upper/RealEditedOrAiMade.tsx",
  "upper/TheInfluencerShopAndGiveaway.tsx",
];

test("lessons use dedicated experiences instead of the universal choice arcade", async () => {
  for (const file of lessonFiles) {
    const lesson = await source(`app/module/cyber/lessons/${file}`);
    assert.doesNotMatch(lesson, /CyberArcadeMission/, `${file} still uses the repeated arcade`);
    assert.match(lesson, /Experience/, `${file} must render a dedicated experience`);
    assert.match(lesson, /assessmentIds/, `${file} must preserve assessment ids`);
  }

  const frame = await source("app/module/cyber/experience/CyberExperienceFrame.tsx");
  assert.doesNotMatch(frame, /choices\.map|actionDock/);
  assert.match(frame, /children/);
  assert.match(frame, /LearningHelpButton/);
  assert.match(frame, /aria-live="polite"/);
});

test("the production interaction shells are functional controlled components", async () => {
  const shellChecks = new Map([
    ["BrowserShell.tsx", [/address/, /onNavigate/, /popup/, /tab/]],
    ["PhoneShell.tsx", [/screen/, /onHome/, /status/]],
    ["SocialShell.tsx", [/feed/, /message/, /onOpen/]],
    ["GameShell.tsx", [/player/, /onMove/, /controls/]],
    ["DragBoard.tsx", [/onMove/, /destination/, /onKeyDown/]],
    ["EvidenceTray.tsx", [/evidence/, /onToggle/, /aria-pressed/]],
    ["SimulationInput.tsx", [/fictional/i, /onChange/, /autoComplete="off"/]],
  ]);

  for (const [file, checks] of shellChecks) {
    const shell = await source(`app/module/cyber/experience/shells/${file}`);
    assert.ok(shell, `${file} must exist`);
    for (const check of checks) assert.match(shell, check, `${file} is missing ${check}`);
  }
});

test("all 18 experiences have unique markers, varied mechanics, and short objectives", async () => {
  const markers = [];
  const families = new Set();

  for (const [file, marker, family] of experiences) {
    const experience = await source(`app/module/cyber/experience/${file}`);
    assert.match(experience, new RegExp(`data-experience=["'{]${marker}`), `${file} needs its marker`);
    assert.match(experience, new RegExp(`data-interaction=["'{]${family}`), `${file} needs its interaction family`);
    const objective = experience.match(/objective:\s*["'`]([^"'`]+)["'`]/)?.[1];
    assert.ok(objective, `${file} must define a literal objective`);
    assert.ok(objective.trim().split(/\s+/).length <= 6, `${file} objective is too long: ${objective}`);
    markers.push(marker);
    families.add(family);
  }

  assert.equal(new Set(markers).size, 18);
  for (const family of ["game", "drag-sort", "browser", "phone", "social", "editor"]) {
    assert.ok(families.has(family), `missing ${family} interaction family`);
  }
});

test("simulations use fictional local data and cannot leave the safe environment", async () => {
  const allSources = await Promise.all(
    experiences.map(([file]) => source(`app/module/cyber/experience/${file}`)),
  );
  const combined = allSources.join("\n");

  assert.match(combined, /student\.demo/);
  assert.match(combined, /SurakshaPay/);
  assert.match(combined, /CircleUp/);
  assert.match(combined, /fictional/i);
  assert.doesNotMatch(combined, /href\s*=\s*["'{]https?:\/\//i);
  assert.doesNotMatch(combined, /window\.open|location\.href|getUserMedia|geolocation/i);
  assert.doesNotMatch(combined, /runtime\.updateState\([^)]*(password|pin|email|message)/is);
});
