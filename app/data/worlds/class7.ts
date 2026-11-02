import type { World } from "./types";
import { class7SecurityWorlds } from "./c7-security";
import { class7AiWorlds } from "./c7-ai";
import { class7CtWorlds } from "./c7-ct";
import { class7FraudWorlds } from "./c7-fraud";

export const class7Worlds: Record<string, World> = Object.fromEntries([...class7SecurityWorlds, ...class7AiWorlds, ...class7CtWorlds, ...class7FraudWorlds].map(world => [world.slug, world]));
