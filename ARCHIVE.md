# Archive branches

Material that is not needed to build or host the site lives on archive branches instead of `main`. Nothing was lost: each branch is a complete snapshot of the project at the moment it was taken. **Do not delete these branches.**

| Branch | Snapshot | What it holds that `main` no longer has |
|---|---|---|
| `archive/english-mathematics` | `830df9b` | Class 10 Mathematics and English, Class 3 English (*Badal and Moti*): lesson pages, the practice bank and API, videos, Chapter 8 narration audio, and their tests and scripts |
| `archive/docs-and-unused-assets` | `bc3f21f` | `docs/` (design plans and specs, delivery notes, the school backend handoff, the English/Mathematics restore guide), `output/` (the narration-script PDFs), `examples/`, unused `public/voice` and `public/samples` audio, `public/videos/hook_clip.mp4`, and the leftover `cyl.py` |

## Restoring

Everything:

```bash
git checkout -b restore-archive
git checkout <archive-branch> -- .
```

Only some paths (example: the school backend handoff and the narration PDFs):

```bash
git checkout archive/docs-and-unused-assets -- docs/SCHOOL_BACKEND_HANDOFF.md output
```

To bring back English and Mathematics, follow `docs/archived-english-mathematics.md` on the `archive/docs-and-unused-assets` branch.

## Notes

- Files removed from `main` are still in git history, so removing them does not shrink the `.git` folder.
- The school backend handoff is at `docs/SCHOOL_BACKEND_HANDOFF.md` on `archive/docs-and-unused-assets`. It predates the removal of English and Mathematics, so parts of it (for example the Class 3 English and Class 10 libraries, and `db/progress.ts`) are out of date.
