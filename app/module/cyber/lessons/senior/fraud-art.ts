const offer = {
  src: '/cyber-missions/class-11/fraud-offer-desk.webp',
  alt: 'Asha pauses before handing over an identity envelope while Kabir compares an internship offer with an independent source and a teacher helps nearby.',
  caption: 'Compare the exact offer with an independent source before sharing documents or money.',
};
const payment = {
  src: '/cyber-missions/class-11/fraud-payment-pause.webp',
  alt: 'Asha keeps her thumb away from the phone controls while Kabir and a supportive adult help compare the payment screen with a festival receipt.',
  caption: 'Pause, read who pays whom and check through a known route. The illustration is not a transaction record.',
};
export const fraudArtwork: Record<string, typeof offer> = {
  'how-a-scam-builds-pressure': offer,
  'the-internship-that-pays-too-well': offer,
  'before-you-approve-that-payment': payment,
  'when-the-message-looks-official': offer,
  'a-familiar-voice-asks-for-money': payment,
  'what-to-do-after-a-loss': payment,
  'integrated-case-the-festival-refund': payment,
  'defend-your-decision': offer,
};
