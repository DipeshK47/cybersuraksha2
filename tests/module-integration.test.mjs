import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("integrates playable modules with academy navigation and progress", async () => {
  const [registry, grade, dashboard, modulePage, lesson, runRoute, database] =
    await Promise.all([
      readFile(
        new URL("../app/data/module-registry.ts", import.meta.url),
        "utf8",
      ),
      readFile(
        new URL("../app/grade/[grade]/page.tsx", import.meta.url),
        "utf8",
      ),
      readFile(new URL("../app/dashboard/page.tsx", import.meta.url), "utf8"),
      readFile(
        new URL(
          "../app/module/secret-message-rescue/page.tsx",
          import.meta.url,
        ),
        "utf8",
      ),
      readFile(
        new URL(
          "../app/module/secret-message-rescue/SecretMessageRescue.tsx",
          import.meta.url,
        ),
        "utf8",
      ),
      readFile(
        new URL("../app/api/module-runs/route.ts", import.meta.url),
        "utf8",
      ),
      readFile(new URL("../db/academy.ts", import.meta.url), "utf8"),
    ]);

  assert.match(registry, /grade-3-secret-message-rescue/);
  assert.match(registry, /getPlayableModule/);
  assert.match(grade, /playable\.href/);
  assert.match(grade, /roleQuery/);
  assert.match(dashboard, /nextPlayableModule/);
  assert.match(modulePage, /searchParams/);
  assert.match(modulePage, /studentId/);
  assert.match(lesson, /studentStorageKey/);
  assert.match(lesson, /fetch\("\/api\/module-runs"/);
  assert.match(lesson, /teacher report are updated/i);
  assert.match(runRoute, /saveModuleRun/);
  assert.match(database, /onConflictDoUpdate/);
});

test("integrates the Double Century Vault module end to end", async () => {
  const [registry, curriculum, modulePage, orchestration, screens, support] =
    await Promise.all([
      readFile(
        new URL("../app/data/module-registry.ts", import.meta.url),
        "utf8",
      ),
      readFile(new URL("../app/data/curriculum.ts", import.meta.url), "utf8"),
      readFile(
        new URL(
          "../app/module/double-century-vault/page.tsx",
          import.meta.url,
        ),
        "utf8",
      ),
      readFile(
        new URL(
          "../app/module/double-century-vault/DoubleCenturyVault.tsx",
          import.meta.url,
        ),
        "utf8",
      ),
      readFile(
        new URL(
          "../app/module/double-century-vault/DoubleCenturyVaultScreens.tsx",
          import.meta.url,
        ),
        "utf8",
      ),
      readFile(
        new URL(
          "../app/module/double-century-vault/double-century-vault-support.ts",
          import.meta.url,
        ),
        "utf8",
      ),
    ]);

  assert.match(registry, /grade-3-double-century-vault/);
  assert.match(curriculum, /Double Century Vault/);
  assert.match(modulePage, /searchParams/);
  assert.match(modulePage, /studentId/);
  assert.match(orchestration, /storageKey/);
  assert.match(orchestration, /fetch\("\/api\/module-runs"/);
  assert.match(orchestration, /grade-3-double-century-vault/);
  assert.match(orchestration, /Teacher preview complete/);
  const directMistakes = [...screens.matchAll(/onMistake\(\{/g)].length;
  const practiceMistakes = [...screens.matchAll(/mistake:\s*\{/g)].length;
  assert.ok(
    directMistakes + practiceMistakes >= 7,
    "every vault activity should explain incorrect answers",
  );
  assert.match(screens, /onComplete\(\)/);
  assert.match(support, /dcvHints: LessonHints\[\]/);
  assert.match(support, /emptyMetrics/);
});

test("integrates the Nani Maa's Vacation Challenge module end to end", async () => {
  const [registry, curriculum, modulePage, orchestration, screens, support] =
    await Promise.all([
      readFile(
        new URL("../app/data/module-registry.ts", import.meta.url),
        "utf8",
      ),
      readFile(new URL("../app/data/curriculum.ts", import.meta.url), "utf8"),
      readFile(
        new URL(
          "../app/module/nani-maa-vacation-challenge/page.tsx",
          import.meta.url,
        ),
        "utf8",
      ),
      readFile(
        new URL(
          "../app/module/nani-maa-vacation-challenge/NaniMaaVacationChallenge.tsx",
          import.meta.url,
        ),
        "utf8",
      ),
      readFile(
        new URL(
          "../app/module/nani-maa-vacation-challenge/NaniMaaVacationChallengeScreens.tsx",
          import.meta.url,
        ),
        "utf8",
      ),
      readFile(
        new URL(
          "../app/module/nani-maa-vacation-challenge/nani-maa-vacation-challenge-support.ts",
          import.meta.url,
        ),
        "utf8",
      ),
    ]);

  assert.match(registry, /grade-3-nani-maa-vacation-challenge/);
  assert.match(curriculum, /Nani Maa.s Vacation Challenge/);
  assert.match(modulePage, /searchParams/);
  assert.match(modulePage, /studentId/);
  assert.match(orchestration, /storageKey/);
  assert.match(orchestration, /fetch\("\/api\/module-runs"/);
  assert.match(orchestration, /grade-3-nani-maa-vacation-challenge/);
  assert.match(orchestration, /Teacher preview complete/);
  const nmvDirectMistakes = [...screens.matchAll(/onMistake\(\{/g)].length;
  const nmvPracticeMistakes = [...screens.matchAll(/mistake:\s*\{/g)].length;
  assert.ok(
    nmvDirectMistakes + nmvPracticeMistakes >= 7,
    "every vacation-challenge activity should explain incorrect answers",
  );
  assert.match(screens, /onComplete\(\)/);
  assert.match(support, /nmvHints: LessonHints\[\]/);
  assert.match(support, /emptyMetrics/);
});

test("integrates the Class 3 English 'Badal and Moti' grammar lesson end to end", async () => {
  const [registry, curriculum, subjectPage, modulePage, orchestration, screens, support] =
    await Promise.all(
      [
        "../app/data/module-registry.ts",
        "../app/data/curriculum.ts",
        "../app/grade/[grade]/[subject]/page.tsx",
        "../app/module/badal-and-moti/page.tsx",
        "../app/module/badal-and-moti/BadalAndMoti.tsx",
        "../app/module/badal-and-moti/BadalAndMotiScreens.tsx",
        "../app/module/badal-and-moti/badal-and-moti-support.ts",
      ].map((path) => readFile(new URL(path, import.meta.url), "utf8")),
    );

  assert.match(registry, /grade-3-english-badal-and-moti/);
  assert.match(registry, /strand: "English"/);
  // Class 3 English lives under the NCERT Santoor subject, chapter 2.
  assert.match(curriculum, /NCERT Santoor/);
  assert.match(curriculum, /title: "Badal and Moti",\s*note: [^\n]*,\s*href: "\/module\/badal-and-moti"/);
  assert.match(subjectPage, /chapter\.href/);
  assert.match(modulePage, /searchParams/);
  assert.match(modulePage, /studentId/);
  assert.match(orchestration, /storageKey/);
  assert.match(orchestration, /fetch\("\/api\/module-runs"/);
  assert.match(orchestration, /grade-3-english-badal-and-moti/);
  assert.match(orchestration, /Teacher preview complete/);
  assert.match(orchestration, /\/grade\/3\/english/);
  // The three grammar ideas the chapter's "Let us learn" / "Let us write" teach.
  for (const needle of ["walk + ed", "Whose shoes are these", "needle and"]) {
    assert.ok(screens.includes(needle), `screens should carry the book's own exercise: ${needle}`);
  }
  const directMistakes = [...screens.matchAll(/onMistake\(/g)].length;
  const practiceMistakes = [...screens.matchAll(/mistake:\s*\{/g)].length;
  assert.ok(
    directMistakes + practiceMistakes >= 10,
    "every grammar activity should explain incorrect answers",
  );
  assert.match(screens, /ExampleWalkthrough/);
  assert.match(screens, /onComplete\(\)/);
  assert.match(support, /bmHints: LessonHints\[\]/);
  assert.match(support, /emptyMetrics/);
});
