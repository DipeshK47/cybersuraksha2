import type { Artifact, Patch, T, World } from "../../../../data/worlds/types.ts";

const MERGED = new Set(["mark", "state", "link", "cell", "txt", "on"]);

/** Apply one scene's patch. Plain-object fields such as `mark` merge one level deep; everything else replaces. */
export function applyPatch(art: readonly Artifact[], patch: Patch | undefined): Artifact[] {
  if (!patch) return art.map(item => ({ ...item }));
  return art.map(item => {
    const change = patch[item.id];
    if (!change) return { ...item };
    const next: Record<string, unknown> = { ...item };
    for (const [key, value] of Object.entries(change)) {
      const old = next[key];
      next[key] = MERGED.has(key) && value && typeof value === "object" && !Array.isArray(value) && old && typeof old === "object" && !Array.isArray(old) ? { ...(old as object), ...(value as object) } : value;
    }
    return next as unknown as Artifact;
  });
}

/** Notes and emphasis belong to one moment; they never carry over to the next scene or option. */
function withoutNotes(art: readonly Artifact[]): Artifact[] {
  return art.map(item => { const { note: _note, noteTone: _tone, focus: _focus, ...rest } = item as Artifact & { note?: unknown; noteTone?: unknown; focus?: unknown }; void _note; void _tone; void _focus; return rest as Artifact; });
}

/** Reveal the authored changes in order, like the steps in Rohan's recovery scene. */
export function sceneCues(world: World, scene: number): Patch[] {
  return Object.entries(world.sc[scene] ?? {}).flatMap(([id, change]) => {
    const cues: Patch[] = [];
    const details: Record<string, unknown> = {};
    for (const [field, value] of Object.entries(change)) {
      if (MERGED.has(field) && value && typeof value === "object" && !Array.isArray(value) && Object.keys(value).length) {
        for (const [key, item] of Object.entries(value)) cues.push({ [id]: { [field]: { [key]: item } } });
      } else details[field] = value;
    }
    // Show a newly introduced object before changing its parts; its explanation follows the changes.
    const { note, noteTone, ...appearance } = details;
    if (Object.keys(appearance).length) cues.unshift({ [id]: appearance });
    if (note !== undefined) cues.push({ [id]: { note, noteTone } });
    return cues;
  });
}

/** Base art and completed scenes, then the current scene's audio-timed changes. */
export function resolveStage(world: World, scene: number, preview?: string | null, cueCount = Infinity): Artifact[] {
  let art: Artifact[] = world.art.map(item => ({ ...item }));
  const last = Math.min(scene, world.sc.length - 1);
  for (let i = 0; i <= last; i++) {
    if (i === last) art = withoutNotes(art);
    if (i === last && Number.isFinite(cueCount)) {
      for (const cue of sceneCues(world, i).slice(0, Math.max(0, cueCount))) art = applyPatch(art, cue);
    } else art = applyPatch(art, world.sc[i]);
  }
  if (preview && world.out[preview]) art = applyPatch(withoutNotes(art), world.out[preview]);
  return art;
}

export const pick = (text: T | string | undefined, language: "en" | "hi"): string => (text == null ? "" : typeof text === "string" ? text : text[language === "hi" ? 1 : 0]);
