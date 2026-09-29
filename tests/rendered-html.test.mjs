import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("contains the finished CyberSuraksha landing experience", async () => {
  const [page, layout] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(page, /Ideas become experiments/i);
  assert.match(page, /Teacher login/i);
  assert.match(page, /Student login/i);
  assert.match(layout, /CyberSuraksha/i);
  assert.doesNotMatch(`${page}\n${layout}`, /Your site is taking shape|codex-preview/i);
});

test("ships teacher, student, report, and database capabilities", async () => {
  const required = [
    "../app/teach/page.tsx",
    "../app/teach/results/page.tsx",
    "../app/teach/student/[id]/page.tsx",
    "../app/teach/student/[id]/report/page.tsx",
    "../app/track/[slug]/page.tsx",
    "../app/grade/[grade]/page.tsx",
    "../app/data/curriculum.ts",
    "../app/module/sample/page.tsx",
    "../app/api/academy/route.ts",
    "../drizzle/0000_baseline.sql",
  ];
  await Promise.all(
    required.map((path) => access(new URL(path, import.meta.url))),
  );

  const hosting = JSON.parse(
    await readFile(new URL("../.openai/hosting.json", import.meta.url), "utf8"),
  );
  assert.equal(hosting.d1, "DB");
});

test("includes every Grade 3–8 curriculum card", async () => {
  const curriculum = await readFile(
    new URL("../app/data/curriculum.ts", import.meta.url),
    "utf8",
  );
  assert.match(curriculum, /grade: 3/);
  assert.match(curriculum, /grade: 8/);
  assert.match(curriculum, /Secret Message Rescue/);
  assert.match(curriculum, /Responsible AI Council/);
  assert.match(curriculum, /moduleCount/);
});

test("includes the guarded handbook chatbot on every page", async () => {
  const [layout, chatbot, route, index] = await Promise.all([
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(
      new URL("../app/components/HandbookChatbot.tsx", import.meta.url),
      "utf8",
    ),
    readFile(new URL("../app/api/chat/route.ts", import.meta.url), "utf8"),
    readFile(
      new URL("../app/data/handbook-chat-index.json", import.meta.url),
      "utf8",
    ),
  ]);

  assert.ok(layout.includes("<HandbookChatbot />"));
  assert.match(chatbot, /Handbooks/);
  assert.ok(chatbot.includes("+ Web"));
  assert.match(chatbot, /Don’t share personal details/);
  assert.match(route, /api\.groq\.com\/openai\/v1\/chat\/completions/);
  assert.match(route, /GROQ_API_KEY/);
  assert.match(route, /buildLocalAnswer/);
  assert.match(route, /teacherAnswer/);
  // Teacher answers must use the same tenant/class scope as the dashboards.
  assert.match(route, /getScopedAcademyData/);
  assert.match(route, /scopedStudentIds/);
  assert.doesNotMatch(route, /\bgetAcademyData\b/);
  // Teacher gating now uses a real server-verified session (P1) rather than a
  // forgeable role cookie.
  assert.match(route, /getSession/);
  assert.match(route, /containsPersonalData/);

  const pages = JSON.parse(index);
  assert.ok(pages.length > 300);
  assert.ok(pages.every((page) => page.grade >= 3 && page.grade <= 8));
  assert.ok(pages.every((page) => !page.documentId.includes("TH_")));
});

test("keeps the teacher grid balanced and ships the student learning overview", async () => {
  const [dashboard, styles] = await Promise.all([
    readFile(new URL("../app/dashboard/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/cybersuraksha.css", import.meta.url), "utf8"),
  ]);

  assert.match(dashboard, /studentOverview/);
  assert.match(dashboard, /Mission progress/i);
  assert.match(dashboard, /Upcoming deadlines/i);
  assert.match(dashboard, /Badge cabinet/i);
  assert.match(styles, /\.dashboardWrapTeacher \.gradeCard:nth-child\(6\)/);
  assert.match(styles, /grid-column: span 4 !important/);
});

test("ships reusable mistake teaching, progressive hints, and concept animations", async () => {
  const [support, animations, lesson, hints, supportStyles] = await Promise.all([
    readFile(
      new URL("../app/components/learning/LearningSupport.tsx", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL("../app/components/learning/TeachingAnimations.tsx", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL(
        "../app/module/secret-message-rescue/LessonScreens.tsx",
        import.meta.url,
      ),
      "utf8",
    ),
    readFile(
      new URL(
        "../app/module/secret-message-rescue/lesson-support.ts",
        import.meta.url,
      ),
      "utf8",
    ),
    readFile(
      new URL(
        "../app/components/learning/learning-support.module.css",
        import.meta.url,
      ),
      "utf8",
    ),
  ]);

  assert.match(support, /Let’s try that again/);
  assert.match(support, /Hint \{level \+ 1\} of/);
  assert.match(support, /Show another hint/);
  assert.match(lesson, /onMistake\(\{/);
  assert.ok(
    [...lesson.matchAll(/onMistake\(\{/g)].length >= 9,
    "every lesson activity should explain incorrect answers",
  );
  assert.match(lesson, /CipherPipelineAnimation/);
  assert.match(lesson, /ShiftRuleAnimation/);
  assert.match(lesson, /AnimatedLetterPath/);
  assert.match(hints, /lessonHints: LessonHints\[\]/);
  assert.match(hints, /Evaluate the cipher/);
  assert.match(animations, /Replay animation/);
  assert.match(supportStyles, /prefers-reduced-motion/);
  assert.match(supportStyles, /var\(--sl-surface\)/);
});

test("ships the Class 10 subject and chapter tier", async () => {
  const [curriculum, dashboard, gradePage, subjectPage, cybersuraksha, globals] =
    await Promise.all([
      readFile(new URL("../app/data/curriculum.ts", import.meta.url), "utf8"),
      readFile(new URL("../app/dashboard/page.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/grade/[grade]/page.tsx", import.meta.url), "utf8"),
      readFile(
        new URL("../app/grade/[grade]/[subject]/page.tsx", import.meta.url),
        "utf8",
      ),
      readFile(new URL("../app/cybersuraksha.css", import.meta.url), "utf8"),
      readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    ]);

  // Class 10 is subject-organised: two subjects, 14 + 9 verified NCERT chapters.
  assert.match(curriculum, /grade: 10/);
  assert.match(curriculum, /slug: "mathematics"/);
  assert.match(curriculum, /slug: "english"/);
  for (const chapter of [
    "Real Numbers",
    "Pair of Linear Equations in Two Variables",
    "Some Applications of Trigonometry",
    "Surface Areas and Volumes",
    "Probability",
    "A Letter to God",
    "Nelson Mandela: Long Walk to Freedom",
    "Glimpses of India",
    "The Sermon at Benares",
    "The Proposal",
  ]) {
    assert.ok(curriculum.includes(chapter), `missing chapter: ${chapter}`);
  }

  // A grade whose icon is missing must never render `<undefined />` and take
  // down the dashboard for every user, so the lookup is keyed and defaulted.
  assert.match(dashboard, /gradeIcons\[grade\.grade\] \?\? Sparkles/);
  assert.doesNotMatch(dashboard, /gradeIcons\[index\]/);

  // A class with no missions must not divide by zero and render "NaN%".
  assert.match(dashboard, /totalMissions > 0/);

  // Both navigation levels exist, and the new tone is themed in both files.
  assert.match(gradePage, /grade\.subjects/);
  assert.match(subjectPage, /getGradeSubject/);
  assert.match(subjectPage, /moduleCardGrid/);
  assert.match(cybersuraksha, /\.dashboardWrapTeacher \.gradeTone-lime/);
  assert.match(globals, /\.gradeTone-lime/);
});

// A submission before hydration must never put passwords or personal details in the URL.
test("client forms use POST for native submissions", async () => {
  const { readdir } = await import("node:fs/promises");
  const root = new URL("../app/", import.meta.url);
  for (const file of await readdir(root, { recursive: true })) {
    if (!file.endsWith(".tsx")) continue;
    const source = await readFile(new URL(file, root), "utf8");
    for (const form of source.matchAll(/<form\b[^>]*>/g))
      assert.match(form[0], /method="post"/, `${file}: native form must use POST`);
  }
});
