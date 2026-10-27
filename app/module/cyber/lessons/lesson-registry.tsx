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

import { Class11Security } from "./senior/Class11Security";
import { Class11AI } from "./senior/Class11AI";
import { Class12Fraud } from "./senior/Class12Fraud";
import { Class12CT } from "./senior/Class12CT";
import { Class12AI } from "./senior/Class12AI";
import { Class12Security } from "./senior/Class12Security";
import { Class11Fraud } from "./senior/Class11Fraud";
import { Class11CT } from "./senior/Class11CT";
import { Class8Lesson } from "./class8/Class8Lesson";
import { CLASS8_LESSON_SLUGS } from "../../../data/class-8-missions";

const lessonComponents: Record<CyberLessonSlug, ComponentType<CyberLessonComponentProps>> = {
  ...Object.fromEntries(CLASS8_LESSON_SLUGS.map(slug => [slug, Class8Lesson])),
  "the-easy-money-recruitment-chain": Class12Fraud,
  "check-the-investment-story": Class12Fraud,
  "identity-and-authority-can-be-manufactured": Class12Fraud,
  "help-after-harm": Class12Fraud,
  "trace-a-pattern-without-accusing": Class12Fraud,
  "design-prevention-that-can-be-tested": Class12Fraud,
  "integrated-case-the-college-fest-incident": Class12Fraud,
  "the-evidence-hearing": Class12Fraud,
  "choose-the-right-data-model": Class12CT,
  "how-work-grows-with-input-size": Class12CT,
  "the-duplicate-registration-problem": Class12CT,
  "build-a-reliable-alerts-pipeline": Class12CT,
  "make-failure-visible": Class12CT,
  "do-not-confuse-a-pattern-with-a-cause": Class12CT,
  "retest-after-a-change": Class12CT,
  "automation-design-review": Class12CT,
  "set-a-decision-and-a-baseline": Class12AI,
  "protect-the-evaluation": Class12AI,
  "the-model-that-scores-95-percent": Class12AI,
  "vision-networks-and-changing-inputs": Class12AI,
  "the-source-grounded-research-assistant": Class12AI,
  "when-instructions-arrive-inside-data": Class12AI,
  "who-benefits-who-is-missed": Class12AI,
  "ai-go-revise-stop-review": Class12AI,
  "from-personal-safety-to-system-risk": Class12Security,
  "design-the-college-fest-portal": Class12Security,
  "secure-by-design": Class12Security,
  "protect-the-whole-dependency-chain": Class12Security,
  "when-logs-disagree": Class12Security,
  "the-breach-tabletop": Class12Security,
  "recover-and-learn": Class12Security,
  "security-assurance-review": Class12Security,
  "how-a-scam-builds-pressure": Class11Fraud,
  "the-internship-that-pays-too-well": Class11Fraud,
  "before-you-approve-that-payment": Class11Fraud,
  "when-the-message-looks-official": Class11Fraud,
  "a-familiar-voice-asks-for-money": Class11Fraud,
  "what-to-do-after-a-loss": Class11Fraud,
  "integrated-case-the-festival-refund": Class11Fraud,
  "defend-your-decision": Class11Fraud,
  "decompose-the-scholarship-desk": Class11CT,
  "model-only-what-matters": Class11CT,
  "make-the-rules-explicit": Class11CT,
  "trace-and-debug-a-decision": Class11CT,
  "search-and-sort-with-purpose": Class11CT,
  "reuse-a-reliable-step": Class11CT,
  "test-the-boundaries": Class11CT,
  "algorithm-review-board": Class11CT,

  "is-ai-needed-here": Class11AI,
  "frame-a-useful-ai-problem": Class11AI,
  "repair-the-dataset": Class11AI,
  "how-a-model-learns": Class11AI,
  "measure-mistakes-not-confidence": Class11AI,
  "whose-examples-are-missing": Class11AI,
  "can-this-assistant-be-trusted": Class11AI,
  "ai-evaluation-review": Class11AI,

  "your-digital-risk-map": Class11Security,
  "identity-beyond-a-password": Class11Security,
  "who-should-have-access": Class11Security,
  "what-a-browser-can-tell-you": Class11Security,
  "data-has-a-lifecycle": Class11Security,
  "devices-updates-and-backups": Class11Security,
  "the-suspicious-login": Class11Security,
  "security-design-review": Class11Security,

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
