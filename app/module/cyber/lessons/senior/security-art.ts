const planning = {
  src: "/cyber-missions/class-11/festival-planning.webp",
  alt: "Two students review a registration list and sharing settings at a school festival planning desk, with the festival courtyard behind them.",
  caption: "Asha and Kabir connect the festival's accounts, registration data and gate devices.",
};
const access = {
  src: "/cyber-missions/class-11/account-access.webp",
  alt: "A student reviews people and folder permissions on a laptop beside a sign-in phone, a separate envelope and a locked drawer.",
  caption: "The team reviews who can sign in, what they can open and how access can be recovered privately.",
};
const recovery = {
  src: "/cyber-missions/class-11/gate-recovery.webp",
  alt: "Two students at a school festival gate check a restored registration list using a laptop and a connected external backup drive.",
  caption: "A separate backup helps the gate team restore its registration list and check the result.",
};

export const securityArtwork: Record<string, typeof planning> = {
  "your-digital-risk-map": planning,
  "identity-beyond-a-password": access,
  "who-should-have-access": access,
  "what-a-browser-can-tell-you": access,
  "data-has-a-lifecycle": planning,
  "devices-updates-and-backups": recovery,
  "the-suspicious-login": access,
  "security-design-review": planning,
};
