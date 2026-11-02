# Lesson worlds (Classes 6–10)

Every Class 6–10 lesson plays its story on a stage built for that lesson: the objects on screen come from the
lesson's own narration (same names, same props), they change scene by scene, and the lesson's decision is made
on the stage. The learner picks an option, watches what it does, then locks it in.

Layout of this folder

| File | What it holds |
| --- | --- |
| `types.ts` | The spec format (`World`, the 12 object kinds, `Patch`). |
| `c6-security.ts` … `c10-fraud.ts` | One file per class and module, eight lessons each. |
| `class6.ts` … `class10.ts` | Per-class lookup that the story player uses. |

How a lesson is written

1. Read the lesson's six narrated scenes in `app/module/cyber/lessons/new/story/chapters/<slug>.json`.
   Use the **same character names and props** the narration uses (the Hindi audio reads the same text).
2. `art`: the objects (poster, chat, phone/browser, switches, flow/graph, table, chart, grid, audience rings,
   money ledger, timeline, tile row). Give each an `id`.
3. `sc`: six patches, one per scene. Patches are cumulative: scene 3 starts from scenes 0–2.
   `mark`, `state`, `link`, `cell`, `txt` and `on` merge one level deep; everything else replaces.
4. `out`: one patch per decision option (keyed by the option id in the lesson data). It is applied on top of
   scene 3 while the learner is trying that option.
5. Every visible string is `[English, Hindi]`. The renderer picks one itself, so `app/data/worlds` and
   `app/module/cyber/lessons/worlds` are skipped by `scripts/extract-language-catalogue.cjs`.

`tests/lesson-worlds.test.mjs` checks that every stage matches its lesson: real option ids, real object ids,
real tokens/nodes/rows/cells, six scenes, Hindi present, icons that exist, and no two lessons sharing a layout.
