const registration = {
  src: '/cyber-missions/class-12/ct-registration-workbench.webp',
  alt: 'Asha aligns fictional registration cards by identifier tabs while Kabir preserves conflicting duplicates and a teacher points out an unmatched card.',
  caption: 'Use stable identity and preserve unresolved evidence. A name match is not enough to merge records.',
};
const pipeline = {
  src: '/cyber-missions/class-12/ct-alerts-pipeline.webp',
  alt: 'Students arrange input, validation, processing and output trays, with a separate invalid-record review tray and a preserved original folder.',
  caption: 'A reliable workflow records valid outputs, quarantined inputs and unfinished work without hiding the original evidence.',
};
export const reliabilityArtwork: Record<string, typeof registration> = {
  'choose-the-right-data-model': registration,
  'how-work-grows-with-input-size': registration,
  'the-duplicate-registration-problem': registration,
  'build-a-reliable-alerts-pipeline': pipeline,
  'make-failure-visible': pipeline,
  'do-not-confuse-a-pattern-with-a-cause': pipeline,
  'retest-after-a-change': pipeline,
  'automation-design-review': pipeline,
};
