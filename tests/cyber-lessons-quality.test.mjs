import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const catalog = JSON.parse(await readFile(new URL("app/data/cyber-lessons.json", root), "utf8"));

const lessonFiles = new Map([
  ["can-i-tell-this", ["lower/CanITellThis.tsx", "lower/PrivacyBackpackExperience.tsx"]],
  ["someone-new-in-my-game", ["lower/SomeoneNewInMyGame.tsx", "lower/BlockGameExperience.tsx"]],
  ["smart-helper-or-normal-tool", ["lower/SmartHelperOrNormalTool.tsx", "lower/SmartHomeExperience.tsx"]],
  ["teach-moti-to-sort", ["lower/TeachMotiToSort.tsx", "lower/TrainingConveyorExperience.tsx"]],
  ["free-coins-tap-now", ["lower/FreeCoinsTapNow.tsx", "lower/CoinRunnerExperience.tsx"]],
  ["the-grown-ups-phone", ["lower/TheGrownUpsPhone.tsx", "lower/PhoneHandoffExperience.tsx"]],
  ["save-my-game-account", ["middle/SaveMyGameAccount.tsx", "middle/AccountCentreExperience.tsx"]],
  ["trouble-in-the-class-group", ["middle/TroubleInTheClassGroup.tsx", "middle/ClassChatExperience.tsx"]],
  ["can-the-chatbot-be-wrong", ["middle/CanTheChatbotBeWrong.tsx", "middle/ChatbotCheckExperience.tsx"]],
  ["why-does-my-feed-repeat", ["middle/WhyDoesMyFeedRepeat.tsx", "middle/AdaptiveFeedExperience.tsx"]],
  ["upi-paying-or-receiving", ["middle/UpiPayingOrReceiving.tsx", "middle/UpiFlowExperience.tsx"]],
  ["the-gaming-giveaway-trap", ["middle/TheGamingGiveawayTrap.tsx", "middle/GiveawayBrowserExperience.tsx"]],
  ["what-did-this-photo-reveal", ["upper/WhatDidThisPhotoReveal.tsx", "upper/PhotoPrivacyExperience.tsx"]],
  ["the-almost-real-login-page", ["upper/TheAlmostRealLoginPage.tsx", "upper/FakeLoginBrowserExperience.tsx"]],
  ["use-ai-without-losing-your-thinking", ["upper/UseAiWithoutLosingYourThinking.tsx", "upper/AiWorkbenchExperience.tsx"]],
  ["real-edited-or-ai-made", ["upper/RealEditedOrAiMade.tsx", "upper/MediaEvidenceExperience.tsx"]],
  ["my-friend-suddenly-needs-money", ["upper/MyFriendSuddenlyNeedsMoney.tsx", "upper/ImpersonationChatExperience.tsx"]],
  ["the-influencer-shop-and-giveaway", ["upper/TheInfluencerShopAndGiveaway.tsx", "upper/InfluencerShopExperience.tsx"]],
]);

async function sourcesFor(slug) {
  const paths = lessonFiles.get(slug);
  assert.ok(paths, `Missing quality-test file mapping for ${slug}`);
  return Promise.all([
    readFile(new URL(`app/module/cyber/lessons/${paths[0]}`, root), "utf8"),
    readFile(new URL(`app/module/cyber/experience/${paths[1]}`, root), "utf8"),
  ]);
}

test("all lessons use distinct interaction, opening, and completion patterns", () => {
  assert.equal(catalog.length, 18);
  assert.equal(new Set(catalog.map((lesson) => lesson.primaryMechanic)).size, 18);
  assert.equal(new Set(catalog.map((lesson) => lesson.openingPattern)).size, 18);
  assert.equal(new Set(catalog.map((lesson) => lesson.completionPattern)).size, 18);
});

test("every lesson preserves assessment and functional experience contracts", async () => {
  for (const lesson of catalog) {
    const [wrapper, experience] = await sourcesFor(lesson.slug);
    for (const assessmentId of lesson.assessmentIds) {
      assert.ok(wrapper.includes(assessmentId), `${lesson.slug} must reference ${assessmentId}`);
    }
    assert.match(wrapper, /Experience/);
    assert.match(experience, /CyberExperienceFrame/);
    assert.match(experience, /data-experience=/);
    assert.match(experience, /experience\.act|experience\.finish/);
  }

  const [frame, runtime] = await Promise.all([
    readFile(new URL("app/module/cyber/experience/CyberExperienceFrame.tsx", root), "utf8"),
    readFile(new URL("app/module/cyber/experience/useCyberExperience.ts", root), "utf8"),
  ]);
  assert.match(frame, /aria-live="polite"/);
  assert.match(frame, /<button/);
  assert.match(runtime, /recordMistake/);
  assert.match(runtime, /completeLesson/);
});

test("activities use fictional input and remain inside the safe simulation", async () => {
  const pairs = await Promise.all(catalog.map((lesson) => sourcesFor(lesson.slug)));
  const experienceSources = pairs.map(([, experience]) => experience);
  const simulationInput = await readFile(new URL("app/module/cyber/experience/shells/SimulationInput.tsx", root), "utf8");
  const runtime = await readFile(new URL("app/module/cyber/experience/useCyberExperience.ts", root), "utf8");

  for (const source of experienceSources) {
    assert.doesNotMatch(source, /<video\b|<audio\b/i, "experiences must not require passive media");
    assert.doesNotMatch(source, /href\s*=\s*["'{]https?:\/\//i, "experiences must not navigate externally");
    assert.doesNotMatch(source, /window\.open|location\.href|getUserMedia|geolocation/i, "experiences must stay inside the simulation");
  }
  assert.match(simulationInput, /autoComplete="off"/);
  assert.match(simulationInput, /Fictional practice data only/);
  assert.match(simulationInput, /fictionalValue/);
  assert.doesNotMatch(runtime, /email|password|pin|otp|message/i, "typed practice values must never enter saved progress");
});

test("shared and band styles preserve target size and reduced motion", async () => {
  const css = (
    await Promise.all([
      "app/module/cyber/experience/cyber-experience-frame.module.css",
      "app/module/cyber/experience/shells/simulation-shells.module.css",
      "app/module/cyber/experience/lower/lower-experiences.module.css",
      "app/module/cyber/experience/middle/middle-experiences.module.css",
      "app/module/cyber/experience/upper/upper-experiences.module.css",
    ].map((path) => readFile(new URL(path, root), "utf8")))
  ).join("\n");

  assert.match(css, /min-height:\s*44px/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.doesNotMatch(css, /transition:\s*all/);
});
