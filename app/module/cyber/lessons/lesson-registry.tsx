import type { ComponentType } from "react";
import type {
  CyberLessonSlug,
} from "../../../data/cyber-lessons";
import type { CyberLessonComponentProps } from "../lesson-types";
import { CanITellThis } from "./lower/CanITellThis";
import { FreeCoinsTapNow } from "./lower/FreeCoinsTapNow";
import { SmartHelperOrNormalTool } from "./lower/SmartHelperOrNormalTool";
import { SomeoneNewInMyGame } from "./lower/SomeoneNewInMyGame";
import { TeachMotiToSort } from "./lower/TeachMotiToSort";
import { TheGrownUpsPhone } from "./lower/TheGrownUpsPhone";
import { CanTheChatbotBeWrong } from "./middle/CanTheChatbotBeWrong";
import { SaveMyGameAccount } from "./middle/SaveMyGameAccount";
import { TheGamingGiveawayTrap } from "./middle/TheGamingGiveawayTrap";
import { TroubleInTheClassGroup } from "./middle/TroubleInTheClassGroup";
import { UpiPayingOrReceiving } from "./middle/UpiPayingOrReceiving";
import { WhyDoesMyFeedRepeat } from "./middle/WhyDoesMyFeedRepeat";
import { MyFriendSuddenlyNeedsMoney } from "./upper/MyFriendSuddenlyNeedsMoney";
import { RealEditedOrAiMade } from "./upper/RealEditedOrAiMade";
import { TheAlmostRealLoginPage } from "./upper/TheAlmostRealLoginPage";
import { TheInfluencerShopAndGiveaway } from "./upper/TheInfluencerShopAndGiveaway";
import { UseAiWithoutLosingYourThinking } from "./upper/UseAiWithoutLosingYourThinking";
import { WhatDidThisPhotoReveal } from "./upper/WhatDidThisPhotoReveal";
import { PatternDetective, StepByStepMorning, FlowchartArchitect, LoopInspector, ComplexAlgorithmicLogic, AlgorithmOptimization } from "./new/ThinkingMissions";
import { NanisSecretCode, SurprisePopUp, OtpGuardian, QrCodeCaution, DigitalArrestSimulation, DeepfakeVoiceRelativeScam } from "./new/FraudMissions";
import { PasswordVaultBuilder, SharingBackpack, PasswordVault, PermissionControlPanel, OnlineReputationBuilder, EmailHeaderInspector } from "./new/SecurityMissions";
import { RobotOrNot, TeachPetMachine, TrainingDay, GarbageInGarbageOut, DeepfakeDetective, RecommendationRabbitHole } from "./new/AiMissions";

const lessonComponents = {
  "can-i-tell-this": CanITellThis,
  "someone-new-in-my-game": SomeoneNewInMyGame,
  "smart-helper-or-normal-tool": SmartHelperOrNormalTool,
  "teach-moti-to-sort": TeachMotiToSort,
  "free-coins-tap-now": FreeCoinsTapNow,
  "the-grown-ups-phone": TheGrownUpsPhone,
  "save-my-game-account": SaveMyGameAccount,
  "trouble-in-the-class-group": TroubleInTheClassGroup,
  "can-the-chatbot-be-wrong": CanTheChatbotBeWrong,
  "why-does-my-feed-repeat": WhyDoesMyFeedRepeat,
  "upi-paying-or-receiving": UpiPayingOrReceiving,
  "the-gaming-giveaway-trap": TheGamingGiveawayTrap,
  "what-did-this-photo-reveal": WhatDidThisPhotoReveal,
  "the-almost-real-login-page": TheAlmostRealLoginPage,
  "use-ai-without-losing-your-thinking": UseAiWithoutLosingYourThinking,
  "real-edited-or-ai-made": RealEditedOrAiMade,
  "my-friend-suddenly-needs-money": MyFriendSuddenlyNeedsMoney,
  "the-influencer-shop-and-giveaway": TheInfluencerShopAndGiveaway,
  "pattern-detective": PatternDetective,
  "step-by-step-morning": StepByStepMorning,
  "flowchart-architect": FlowchartArchitect,
  "loop-inspector": LoopInspector,
  "complex-algorithmic-logic": ComplexAlgorithmicLogic,
  "algorithm-optimization": AlgorithmOptimization,
  "nanis-secret-code": NanisSecretCode,
  "surprise-pop-up": SurprisePopUp,
  "otp-guardian": OtpGuardian,
  "qr-code-caution": QrCodeCaution,
  "digital-arrest-simulation": DigitalArrestSimulation,
  "deepfake-voice-relative-scam": DeepfakeVoiceRelativeScam,
  "password-vault-builder": PasswordVaultBuilder,
  "sharing-backpack": SharingBackpack,
  "password-vault": PasswordVault,
  "permission-control-panel": PermissionControlPanel,
  "online-reputation-builder": OnlineReputationBuilder,
  "email-header-inspector": EmailHeaderInspector,
  "robot-or-not": RobotOrNot,
  "teach-pet-machine": TeachPetMachine,
  "training-day": TrainingDay,
  "garbage-in-garbage-out": GarbageInGarbageOut,
  "deepfake-detective": DeepfakeDetective,
  "recommendation-rabbit-hole": RecommendationRabbitHole,
} satisfies Record<CyberLessonSlug, ComponentType<CyberLessonComponentProps>>;

export function getCyberLessonComponent(slug: CyberLessonSlug) {
  return lessonComponents[slug];
}
