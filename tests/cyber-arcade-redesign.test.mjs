import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function source(path) {
  return readFile(new URL(path, root), "utf8").catch(() => "");
}

const lessons = [
  ["lower/CanITellThis.tsx", "PrivacyBackpackExperience"],
  ["lower/SomeoneNewInMyGame.tsx", "BlockGameExperience"],
  ["lower/SmartHelperOrNormalTool.tsx", "SmartHomeExperience"],
  ["lower/TeachMotiToSort.tsx", "TrainingConveyorExperience"],
  ["lower/FreeCoinsTapNow.tsx", "CoinRunnerExperience"],
  ["lower/TheGrownUpsPhone.tsx", "PhoneHandoffExperience"],
  ["middle/SaveMyGameAccount.tsx", "AccountCentreExperience"],
  ["middle/TroubleInTheClassGroup.tsx", "ClassChatExperience"],
  ["middle/CanTheChatbotBeWrong.tsx", "ChatbotCheckExperience"],
  ["middle/WhyDoesMyFeedRepeat.tsx", "AdaptiveFeedExperience"],
  ["middle/UpiPayingOrReceiving.tsx", "UpiFlowExperience"],
  ["middle/TheGamingGiveawayTrap.tsx", "GiveawayBrowserExperience"],
  ["upper/WhatDidThisPhotoReveal.tsx", "PhotoPrivacyExperience"],
  ["upper/TheAlmostRealLoginPage.tsx", "FakeLoginBrowserExperience"],
  ["upper/UseAiWithoutLosingYourThinking.tsx", "AiWorkbenchExperience"],
  ["upper/RealEditedOrAiMade.tsx", "MediaEvidenceExperience"],
  ["upper/MyFriendSuddenlyNeedsMoney.tsx", "ImpersonationChatExperience"],
  ["upper/TheInfluencerShopAndGiveaway.tsx", "InfluencerShopExperience"],
];

test("the Cyber Squad is drawn once and reused across every experience", async () => {
  const cast = await source("app/module/cyber/world/CyberCast.tsx");

  for (const character of ["Tara", "Kabir", "Meera", "Byte"]) {
    assert.match(cast, new RegExp(character));
  }
  assert.match(cast, /<svg/);
  assert.match(cast, /expression/);
  assert.match(cast, /aria-label/);
});

test("the shared frame supplies progress, help, restart, feedback, and completion", async () => {
  const [frame, runtime] = await Promise.all([
    source("app/module/cyber/experience/CyberExperienceFrame.tsx"),
    source("app/module/cyber/experience/useCyberExperience.ts"),
  ]);

  assert.match(frame, /role="progressbar"/);
  assert.match(frame, /aria-live="polite"/);
  assert.match(frame, /LearningHelpButton/);
  assert.match(frame, /resetLesson/);
  assert.match(frame, /CyberSquad/);
  assert.match(runtime, /completeLesson/);
  assert.match(runtime, /recordMistake/);
  assert.match(runtime, /recordDecision/);
});

test("all 18 lesson routes load a dedicated experience", async () => {
  for (const [file, experience] of lessons) {
    const lesson = await source(`app/module/cyber/lessons/${file}`);
    assert.match(lesson, new RegExp(`import \\{ ${experience} \\}`));
    assert.match(lesson, new RegExp(`<${experience}`));
    assert.match(lesson, /assessmentIds=\{/);
    assert.doesNotMatch(lesson, /CyberArcadeMission/);
  }
});

test("controlled shells cover realistic interfaces and direct manipulation", async () => {
  for (const shell of [
    "BrowserShell",
    "PhoneShell",
    "SocialShell",
    "GameShell",
    "DragBoard",
    "EvidenceTray",
    "SimulationInput",
  ]) {
    const shellSource = await source(`app/module/cyber/experience/shells/${shell}.tsx`);
    assert.match(shellSource, new RegExp(`export function ${shell}`));
  }

  const styles = [
    await source("app/module/cyber/experience/cyber-experience-frame.module.css"),
    await source("app/module/cyber/experience/shells/simulation-shells.module.css"),
  ].join("\n");
  assert.match(styles, /min-height:\s*44px/);
  assert.match(styles, /prefers-reduced-motion:\s*reduce/);
  assert.doesNotMatch(styles, /transition:\s*all/);
});
