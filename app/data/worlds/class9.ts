import type { World } from "./types";
import { class9SecurityWorlds } from "./c9-security";
import { class9AiWorlds } from "./c9-ai";
import { class9CtWorlds } from "./c9-ct";
import { class9FraudWorlds } from "./c9-fraud";

export const class9Worlds: Record<string, World> = Object.fromEntries([...class9SecurityWorlds, ...class9AiWorlds, ...class9CtWorlds, ...class9FraudWorlds].map(world => [world.slug, world]));
