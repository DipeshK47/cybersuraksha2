export const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export type SkillCategory =
  | "knowledge"
  | "procedure"
  | "transfer"
  | "security";

export type SkillMetrics = Record<
  SkillCategory,
  { attempts: number; correct: number }
>;

export function encode(text: string, shift: number) {
  return text
    .toUpperCase()
    .split("")
    .map((letter) => {
      const index = ALPHABET.indexOf(letter);
      return index < 0 ? letter : ALPHABET[(index + shift) % 26];
    })
    .join("");
}

export function decode(text: string, shift: number) {
  return text
    .toUpperCase()
    .split("")
    .map((letter) => {
      const index = ALPHABET.indexOf(letter);
      return index < 0 ? letter : ALPHABET[(index - shift + 26) % 26];
    })
    .join("");
}

export function shiftedLetter(letter: string, shift: number) {
  return encode(letter, shift);
}

export function ringPosition(index: number, radius: number) {
  const angle = (index / ALPHABET.length) * Math.PI * 2;
  return {
    left: `${50 + radius * Math.sin(angle)}%`,
    top: `${50 - radius * Math.cos(angle)}%`,
  };
}

export function emptyMetrics(): SkillMetrics {
  return {
    knowledge: { attempts: 0, correct: 0 },
    procedure: { attempts: 0, correct: 0 },
    transfer: { attempts: 0, correct: 0 },
    security: { attempts: 0, correct: 0 },
  };
}
