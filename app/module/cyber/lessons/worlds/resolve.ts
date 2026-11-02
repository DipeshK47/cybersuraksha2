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

/** The stage for a scene: base art plus every patch up to and including `scene`, plus an optional decision preview. */
export function resolveStage(world: World, scene: number, preview?: string | null): Artifact[] {
  let art: Artifact[] = world.art.map(item => ({ ...item }));
  for (let i = 0; i <= Math.min(scene, world.sc.length - 1); i++) art = applyPatch(art, world.sc[i]);
  if (preview && world.out[preview]) art = applyPatch(art, world.out[preview]);
  return art;
}

export const pick = (text: T | string | undefined, language: "en" | "hi"): string => (text == null ? "" : typeof text === "string" ? text : text[language === "hi" ? 1 : 0]);
