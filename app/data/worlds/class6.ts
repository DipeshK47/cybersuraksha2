import type { World } from "./types";
import { class6SecurityWorlds } from "./c6-security";
import { class6AiWorlds } from "./c6-ai";
import { class6CtWorlds } from "./c6-ct";
import { class6FraudWorlds } from "./c6-fraud";

export const class6Worlds: Record<string, World> = Object.fromEntries([...class6SecurityWorlds, ...class6AiWorlds, ...class6CtWorlds, ...class6FraudWorlds].map(world => [world.slug, world]));
