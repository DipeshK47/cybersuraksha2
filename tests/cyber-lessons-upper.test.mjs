import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const upperLessons = [
  ["WhatDidThisPhotoReveal.tsx", "WhatDidThisPhotoReveal", "PhotoPrivacyExperience", "PhotoPrivacyExperience.tsx", "photo-privacy", "what-did-this-photo-reveal"],
  ["TheAlmostRealLoginPage.tsx", "TheAlmostRealLoginPage", "FakeLoginBrowserExperience", "FakeLoginBrowserExperience.tsx", "fake-login-browser", "the-almost-real-login-page"],
  ["UseAiWithoutLosingYourThinking.tsx", "UseAiWithoutLosingYourThinking", "AiWorkbenchExperience", "AiWorkbenchExperience.tsx", "ai-workbench", "use-ai-without-losing-your-thinking"],
  ["RealEditedOrAiMade.tsx", "RealEditedOrAiMade", "MediaEvidenceExperience", "MediaEvidenceExperience.tsx", "media-evidence", "real-edited-or-ai-made"],
  ["MyFriendSuddenlyNeedsMoney.tsx", "MyFriendSuddenlyNeedsMoney", "ImpersonationChatExperience", "ImpersonationChatExperience.tsx", "impersonation-chat", "my-friend-suddenly-needs-money"],
  ["TheInfluencerShopAndGiveaway.tsx", "TheInfluencerShopAndGiveaway", "InfluencerShopExperience", "InfluencerShopExperience.tsx", "influencer-shop", "the-influencer-shop-and-giveaway"],
];

async function read(path) {
  return readFile(new URL(path, root), "utf8").catch(() => "");
}

test("all six upper-band lessons load dedicated investigation experiences", async () => {
  for (const [file, component, experience, experienceFile, marker] of upperLessons) {
    const [lesson, activity] = await Promise.all([
      read(`app/module/cyber/lessons/upper/${file}`),
      read(`app/module/cyber/experience/upper/${experienceFile}`),
    ]);
    assert.match(lesson, new RegExp(`export function ${component}`));
    assert.match(lesson, new RegExp(`<${experience}`));
    assert.match(activity, new RegExp(`data-experience="${marker}"`));
  }
});

test("each upper lesson preserves its three assessment contracts", async () => {
  for (const [file, component, , , , slug] of upperLessons) {
    const lesson = await read(`app/module/cyber/lessons/upper/${file}`);
    for (const suffix of ["check-1", "check-2", "transfer"]) {
      assert.ok(lesson.includes(`${slug}-${suffix}`), `${component} must reference ${slug}-${suffix}`);
    }
  }
});

test("media and impersonation investigations preserve uncertainty and verification", async () => {
  const [media, friend] = await Promise.all([
    read("app/module/cyber/experience/upper/MediaEvidenceExperience.tsx"),
    read("app/module/cyber/experience/upper/ImpersonationChatExperience.tsx"),
  ]);
  assert.match(media, /uncertain/i);
  assert.match(media, /confidence/i);
  assert.match(friend, /transcript/i);
  assert.match(friend, /second channel|known contact|saved number/i);
  assert.doesNotMatch(friend, /<audio/);
});

test("photo privacy uses an icon exported by the installed Lucide version", async () => {
  const photo = await read("app/module/cyber/experience/upper/PhotoPrivacyExperience.tsx");
  assert.doesNotMatch(photo, /import \{[^}]*\bBlur\b[^}]*\} from "lucide-react"/);
  assert.match(photo, /\bBlend\b/);
});

test("upper-band styles support mobile investigations and safe motion", async () => {
  const css = await read("app/module/cyber/experience/upper/upper-experiences.module.css");
  assert.match(css, /min-height:\s*(44|46|48|50)px/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /@media \(max-width:/);
  assert.doesNotMatch(css, /transition:\s*all/);
});
