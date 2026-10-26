const design = {
  src: '/cyber-missions/class-12/portal-design-room.webp',
  alt: 'Asha and Kabir arrange client, server and database concept tiles at a school makerspace table while a teacher helps discuss a trust boundary.',
  caption: 'Different actors cross different trust boundaries. Place each safeguard where its rule is enforced.',
};
const incident = {
  src: '/cyber-missions/class-12/incident-recovery-room.webp',
  alt: 'Kabir orders synthetic event cards while Asha and a teacher compare dataset versions and a recovery checklist during a calm incident rehearsal.',
  caption: 'Preserve the evidence, test restored records and permissions, and state what remains uncertain.',
};
export const systemArtwork: Record<string, typeof design> = {
  'from-personal-safety-to-system-risk': design,
  'design-the-college-fest-portal': design,
  'secure-by-design': design,
  'protect-the-whole-dependency-chain': design,
  'when-logs-disagree': incident,
  'the-breach-tabletop': incident,
  'recover-and-learn': incident,
  'security-assurance-review': design,
};
