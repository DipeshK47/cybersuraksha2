/**
 * Rive characters available to story chapters. Every asset is self-hosted with its runtime,
 * and each mood maps to a value on the asset's emotion input plus a static fallback frame
 * (used for reduced motion and while the canvas loads).
 */
export type CharacterSpec = {
  src: string;
  artboard?: string;
  stateMachine: string;
  /** Number input that selects the expression. */
  emotionInput?: string;
  /**
   * Per mood: a value for `emotionInput`, a set of number inputs to apply together
   * (list every input in every mood so switching resets the others), or the name of
   * a timeline animation played over the state machine.
   */
  emotions: Record<string, number | Record<string, number> | string>;
  /** Optional boolean input switched on while narration plays. */
  talkInput?: string;
  /** Folder holding `<mood>.png` fallback frames for every key in `emotions`. */
  frames: string;
  /** How the character is described to screen readers, e.g. "a boy". */
  description: string;
  credit: { title: string; author: string; url: string; license: string; licenseUrl: string };
};

export const RIVE_WASM = "/animations/password-story/rive.wasm";

export const characters = {
  // "Emotions" input: 1 thinking, 3 surprise, 5 sad, 8 happy (7 is contempt, not happy).
  "boy-emotions": {
    src: "/animations/password-story/rohan.riv",
    stateMachine: "State Machine 1",
    emotionInput: "Emotions",
    emotions: { happy: 8, sad: 5, thinking: 1, surprise: 3 },
    talkInput: "Wind",
    frames: "/animations/password-story",
    description: "a boy",
    credit: { title: "Boy with emotions", author: "gty", url: "https://rive.app/community/files/5918-11535-boy-with-emotions/", license: "CC BY 4.0", licenseUrl: "https://creativecommons.org/licenses/by/4.0/" },
  },
  // Blend inputs 0-100 (above 100 plays an extra motion). "thinking" mixes Smile 40 + Sad 30.
  "girl-expressions": {
    src: "/animations/characters/girl-expressions/girl-expressions.riv",
    stateMachine: "State Machine 1",
    emotions: {
      happy: { Happy: 100, Smile: 0, Sad: 0, Surprise: 0, Neutral: 0 },
      sad: { Happy: 0, Smile: 0, Sad: 100, Surprise: 0, Neutral: 0 },
      thinking: { Happy: 0, Smile: 40, Sad: 30, Surprise: 0, Neutral: 0 },
      surprise: { Happy: 0, Smile: 0, Sad: 0, Surprise: 100, Neutral: 0 },
    },
    frames: "/animations/characters/girl-expressions",
    description: "a girl",
    credit: { title: "Facial Expression Demo", author: "JcToon", url: "https://rive.app/community/files/669-1300-facial-expression-demo/", license: "CC BY 4.0", licenseUrl: "https://creativecommons.org/licenses/by/4.0/" },
  },
  // Timeline animations over an input-less state machine; "thinking" is the side-eye "suspicious" pose.
  "emotional-avatar": {
    src: "/animations/characters/emotional-avatar/emotional-avatar.riv",
    stateMachine: "State Machine 1",
    emotions: { happy: "happy", sad: "sad", thinking: "suspicious", surprise: "surprised" },
    frames: "/animations/characters/emotional-avatar",
    description: "a boy",
    credit: { title: "Emotional Avatar", author: "malchemist", url: "https://rive.app/community/files/25739-48068-emotional-avatar/", license: "CC BY 4.0", licenseUrl: "https://creativecommons.org/licenses/by/4.0/" },
  },
} satisfies Record<string, CharacterSpec>;

export type CharacterAsset = keyof typeof characters;
