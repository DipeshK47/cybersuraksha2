import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { newMissions } from "../app/data/new-missions.ts";

const expected = {
  lower: {
    Cybersecurity: ["password-vault-builder", "sharing-backpack"],
    "Artificial Intelligence": ["robot-or-not", "teach-pet-machine"],
    "Computational Thinking": ["pattern-detective", "step-by-step-morning"],
    "Cyber Fraud": ["nanis-secret-code", "surprise-pop-up"],
  },
  middle: {
    Cybersecurity: ["password-vault", "permission-control-panel"],
    "Artificial Intelligence": ["training-day", "garbage-in-garbage-out"],
    "Computational Thinking": ["flowchart-architect", "loop-inspector"],
    "Cyber Fraud": ["otp-guardian", "qr-code-caution"],
  },
  upper: {
    Cybersecurity: ["online-reputation-builder", "email-header-inspector"],
    "Artificial Intelligence": ["deepfake-detective", "recommendation-rabbit-hole"],
    "Computational Thinking": ["complex-algorithmic-logic", "algorithm-optimization"],
    "Cyber Fraud": ["digital-arrest-simulation", "deepfake-voice-relative-scam"],
  },
};

const grades = { lower: [3, 4], middle: [5], upper: [6, 7] };

test("the curriculum has the first two W chapters in all four modules per band", () => {
  assert.equal(newMissions.length, 24);
  for (const [band, strands] of Object.entries(expected)) {
    for (const [strand, slugs] of Object.entries(strands)) {
      const actual = newMissions.filter((lesson) => lesson.band === band && lesson.strand === strand);
      assert.deepEqual(actual.map((lesson) => lesson.slug), slugs);
      for (const lesson of actual) assert.deepEqual(lesson.grades, grades[band]);
    }
  }
});

test("each chapter has a distinct progress identity and three assessable practice stages", () => {
  assert.equal(new Set(newMissions.map((lesson) => lesson.id)).size, 24);
  assert.equal(new Set(newMissions.map((lesson) => lesson.slug)).size, 24);
  const allAssessmentIds = newMissions.flatMap((lesson) => lesson.assessmentIds);
  assert.equal(new Set(allAssessmentIds).size, 72);
  for (const lesson of newMissions) {
    assert.deepEqual(lesson.assessmentIds, [
      `${lesson.slug}-check-1`,
      `${lesson.slug}-check-2`,
      `${lesson.slug}-transfer`,
    ]);
  }
});

test("every chapter has a playable story opening and a three-turn narrative arc", async () => {
  const source = await readFile(new URL("../app/module/cyber/lessons/new/StoryPrelude.tsx", import.meta.url), "utf8");
  for (const { slug } of newMissions) {
    assert.ok(source.includes(`"${slug}": { hook:`), `${slug} is missing its opening story`);
    assert.ok(source.includes(`"${slug}": [`), `${slug} is missing its practice story arc`);
  }
});

test("fraud practice preserves the precise QR and reporting rules", async () => {
  const source = await readFile(new URL("../app/module/cyber/lessons/new/FraudMissions.tsx", import.meta.url), "utf8");
  assert.match(source, /share my own QR to receive/);
  assert.match(source, /never scan and enter a PIN to receive/);
  assert.match(source, /call 1930 quickly if money was lost/);
  assert.match(source, /cybercrime\.gov\.in/);
  assert.doesNotMatch(source, /window\.open|getUserMedia|geolocation/);
});
