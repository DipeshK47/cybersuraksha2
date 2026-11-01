# English and Mathematics: removed from `main`, kept in an archive

English and Mathematics are not part of the launch, so they were taken out of `main`. Nothing was deleted from history: the complete project as it was before the removal (commit `830df9b`) is preserved on the branch **`archive/english-mathematics`**. Do not delete that branch.

## What was removed

| Area | Removed |
|---|---|
| Class 10 | Mathematics (14 NCERT chapters; only *Introduction to Trigonometry* had lesson content) and English (9 chapters; only *A Letter to God* had a lesson) |
| Class 3 | English (*Santoor*), including the *Badal and Moti* interactive lesson |
| Routes | `app/grade/[grade]/[subject]/[chapter]/` (chapter lesson pages, trig lab, topic panels), `app/module/badal-and-moti/`, `app/api/practice-attempt/` |
| Data / code | `app/data/practice-bank.ts` (95 questions), `db/progress.ts`, the practice-answer schema, the *Badal and Moti* playable module, "English" and "Mathematics" in the school subject list |
| Assets | `public/videos` lesson videos (incl. the 57.6 MB `a-letter-to-god.mp4`), `public/audio/chapter8`, `public/audio/badal-and-moti`, `public/lessons/badal-and-moti` |
| Scripts / tests | the Chapter 8 narration and Badal and Moti render scripts; tests for the English lesson, Chapter 8, the trig lab, the practice bank, guided solutions |

Class 10 now has the four CyberShiksha subjects (32 chapters). Removing the 57.6 MB video also clears the Cloudflare Workers 25 MiB per-file limit: the production bundle now starts on `workerd`.

## What was kept on purpose

- The database tables for practice progress (`question_attempts`, `topic_progress`, `chapter_progress`, `report_cards`) and their migrations. They stay empty and dormant, and `db/learning-report.ts` still reads them.
- The Hindi translation catalogue, so restored lessons keep their Hindi text.
- Old subject addresses such as `/grade/10/mathematics` show the standard "Subject not found" page.

## Restoring everything

```bash
git checkout -b restore-english-mathematics
git checkout archive/english-mathematics -- .
```

That brings back the whole project exactly as it was. To restore only part of it, name the paths instead of `.`, for example:

```bash
git checkout archive/english-mathematics -- "app/grade/[grade]/[subject]/[chapter]" public/videos public/audio/chapter8 app/data/curriculum.ts
```

If you restore the Class 10 subjects, also restore `app/data/module-registry.ts`, `app/lib/content-policy.ts` and `app/lib/validation.ts`, and the tests that were updated (`tests/rendered-html.test.mjs`, `grade-delivery.test.mjs`, `class-10-curriculum.test.mjs`, `module-integration.test.mjs`, `school-backend.test.mjs`).

Note that the removed files remain in git history, so removal from `main` does not shrink the `.git` folder.
