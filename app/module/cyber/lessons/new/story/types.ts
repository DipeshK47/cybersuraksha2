import type { LucideIcon } from "lucide-react";
import type { ComponentType, ReactNode } from "react";
import type { CharacterAsset } from "./characters";

/** One narrated scene. `start`/`duration` are written by scripts/story-narration.py from the real audio. */
export type StoryScene = {
  id: string;
  /** Short tab label, e.g. "Meet Rohan". */
  label: string;
  /** Big scene heading under the stage. */
  title: string;
  /** Character expression for this scene; must exist in the character asset's emotion map. */
  mood: string;
  /** Captions shown on screen. The narrator reads this unless `speech` is set. */
  caption: string;
  /** Narration text when the spoken form must differ from the caption (e.g. "O T P" for "OTP"). */
  speech?: string;
  /** Speech bubble line for the character. */
  dialogue: string;
  /** Small status under the character's name, e.g. "Feeling upset". */
  status: string;
  /** Stage tint: "trouble" darkens, "resolved" brightens, anything else keeps the default. */
  tone?: string;
  /** A brief expression shown at the start of the scene while narration plays, e.g. surprise before sadness. */
  flash?: { mood: string; seconds: number };
  start: number;
  duration: number;
};

export type StoryScript = { duration: number; scenes: StoryScene[] };

/** Props handed to a chapter's world panel. The panel stays mounted across scenes, so its own state persists. */
export type StoryWorldProps = {
  scene: number;
  playing: boolean;
  /** Seconds into the current scene's narration (0 when paused at its start). */
  elapsed: number;
  /** True once the learner has finished the chapter's mid-story task. */
  solved: boolean;
  /** Call once when the learner completes the mid-story task; the story resumes from the next scene. */
  markSolved: () => void;
  hint: string;
  setHint: (hint: string) => void;
  reduced: boolean;
};

export type StoryChapter = {
  script: StoryScript;
  /** Header title, e.g. "Rohan’s missing moon base". */
  title: string;
  icon: LucideIcon;
  character: { asset: CharacterAsset; name: string };
  /** Scene index where narration pauses until the learner completes the task. */
  interactionScene: number;
  /** Final-scene button label, e.g. "Practise with Rohan". */
  beginLabel: string;
  /** Footer note while the story waits for the learner. */
  waitingText: string;
  /** Hint shown when the learner tries to skip past the task. */
  lockedHint: string;
  /** Expression while on the task scene after it is solved. Defaults to "happy". */
  solvedMood?: string;
  World: ComponentType<StoryWorldProps>;
  /** Extra attribution beyond the character (illustrations, sounds). */
  credits?: ReactNode;
};
