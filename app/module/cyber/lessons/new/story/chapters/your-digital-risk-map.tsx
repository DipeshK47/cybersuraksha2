"use client";

import { makeSecurityStory } from "../../../senior/SecurityStories";
import script from "./your-digital-risk-map.json";

const chapter = { ...makeSecurityStory("your-digital-risk-map", script), hindiAudio: script.hindiAudio };
export default chapter;
