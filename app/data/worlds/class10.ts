import type { World } from "./types";
import { class10SecurityWorlds } from "./c10-security";
import { class10AiWorlds } from "./c10-ai";
import { class10CtWorlds } from "./c10-ct";
import { class10FraudWorlds } from "./c10-fraud";

export const class10Worlds: Record<string, World> = Object.fromEntries([...class10SecurityWorlds, ...class10AiWorlds, ...class10CtWorlds, ...class10FraudWorlds].map(world => [world.slug, world]));
