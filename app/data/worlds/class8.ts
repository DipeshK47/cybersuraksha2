import type { World } from "./types";
import { class8SecurityWorlds } from "./c8-security";
import { class8AiWorlds } from "./c8-ai";
import { class8CtWorlds } from "./c8-ct";
import { class8FraudWorlds } from "./c8-fraud";

export const class8Worlds: Record<string, World> = Object.fromEntries([...class8SecurityWorlds, ...class8AiWorlds, ...class8CtWorlds, ...class8FraudWorlds].map(world => [world.slug, world]));
