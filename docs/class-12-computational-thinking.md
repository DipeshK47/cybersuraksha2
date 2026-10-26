# Class 12 · Module 3: Computational Thinking

Implements W17–W24 of the approved 24 October 2026 syllabus, in order. All eight CT chapters are playable and assignable alongside Cybersecurity and AI, giving Class 12 32 completed chapters across all four modules.

| Chapter | Interactive evidence |
| --- | --- |
| Choose the right data model | Operation-to-structure map; actual stack/queue removal trace; stable-key and policy limits |
| How work grows with input size | Counted operations for 8/16/32; growth categories and explicit preparation assumptions |
| The duplicate registration problem | Key schema, dirty-table reconciliation by ID, unresolved conflicts/repeats/unmatched references |
| Build a reliable alerts pipeline | Ordered stages, input/output contracts, shared executable mixed-validity model |
| Make failure visible | Empty/malformed/repeat/partial-failure plan; checkpointed stop and retry; conflict review |
| Do not confuse a pattern with a cause | Observed denominators, missingness and window audit; corrected rate comparison; causal limits |
| Retest after a change | Eight expected cases; new category; deliberate old-boundary regression, repair and rerun |
| Automation design review | Correctness/efficiency/maintainability/human authority; 128-record count and new ≥80 rule; individual defence |

Each chapter reuses the six-scene narrated story, mid-story decision, three practice stages, first-answer scoring, retries, local resume and existing authenticated student/teacher progress and assignment grading. Illustrations are project-local WebP; readable datasets, contracts and traces are accessible HTML. Each planned 40-minute lesson includes teacher discussion, with no forced screen timer. Coding, SQL execution and external accounts are optional extensions, not requirements.

## Shared model and scope

The alerts labs all call `reliability-content.ts`. Records are synthetic: an ID matching A plus two digits, latency/outage category (capacity in the revised version) and a supplied finite priority score 0–100. The initial exercise rule is score ≥70 → human Review, otherwise Record only. These invented priorities are not real incident-response policy.

The model preserves source batches and prior output ledgers. Malformed records are quarantined with reasons; a repeated valid ID with changed content is held, including a valid/invalid pair sharing an identifiable ID. Identical already committed events are skipped and logged. Conflicting records never overwrite committed history. Validation can still expose conflict/repeat outcomes after output has stopped, while only uncommitted valid IDs are marked pending.

The prepared fault happens before A02 commits, so the model knows which outputs committed. After the fault is resolved, retrying the preserved batch with its checkpoint skips identical A01 and commits A02/A03. No notification is sent. This is an in-page confirmed-commit model, not a distributed exactly-once delivery guarantee; ambiguous real network outcomes would need durable idempotent output and reconciliation beyond this exercise. Rule revisions use a separate new-version ledger on a preserved copy so old-version results are retained.

The eight-case regression pack covers routine, exact threshold, malformed, empty, identical repeat, partial output failure, new capacity category and conflicting same-ID inputs. The deliberately faulty >70 operator fails T2; removing capacity support fails T7. Passing finite tests supports these cases without proving all inputs. Independent test cases also cover invalid scores, duplicate/invalid same-ID conflicts, reordered retries, unchanged source data and old/new-version boundaries.

## Counting and interpreting evidence

Count model: one known-position indexed access; one record probe in an already sorted last-item binary search; one probe per item in last-item linear search; one comparison per unordered pair. For n=8/16/32 the counts are indexed 1/1/1, binary 4/5/6, linear 8/16/32, pairs 28/120/496. For 128 records, one-per-record visits are 128 versus 8,128 unordered-pair comparisons. The bounded classroom counter accepts at most 1,024 records. These are operation counts, not timing benchmarks or a claim that all implementation work is linear. Sorting/index construction, storage, I/O and expected-average hash assumptions must be stated. The stack/queue lab demonstrates abstract removal order; its array-based implementation does not establish a constant-time queue implementation.

Registration reconciliation groups by stable ID and retains original dirty rows. The intended primary-key and reference constraints are not assumed already true. Names are not unique; R02/R03 remain distinct. Missing check-in evidence means unknown attendance. Grouping work and display ordering are different operations; this small exercise is not a database performance benchmark.

Window A has 20 flags / 100 observed readings in 1h and 0 missing; B has 30 / 300 observed in 3h and 15 missing. Observed rates are 20% and 10%. Missing readings are not known normal outcomes. Unequal workloads/windows and missingness leave alternative explanations; this observational comparison does not establish a causal effect.

The final viva uses schema, operation counts, reconciliation, contracts, failure log and regression records. Structured checks do not establish authorship or oral understanding; teachers assess the individual explanation and human-policy boundary separately.

## Primary references checked 25 October 2026

- [Python tutorial: data structures](https://docs.python.org/3/tutorial/datastructures.html): list/stack/queue operations and implementation considerations. The core lesson is language-independent.
- [PostgreSQL: constraints](https://www.postgresql.org/docs/current/ddl-constraints.html): intended primary/foreign key relationships and data integrity.
- [PostgreSQL: joins](https://www.postgresql.org/docs/current/tutorial-join.html): pairing rows through a join condition and the importance of unmatched rows. The app does not connect to a live database for the lesson.

## Checks and assets

`node --test tests/class-12-ct.test.mjs` checks catalogue coverage, counts/removals, reconciliation, schema validation, source preservation, quarantine/retry/conflict semantics, regression failures and observed denominators. `node scripts/class-12-ct-qa.cjs` exercises all eight stories and 24 practice stages on desktop/phone, wrong feedback, correction/rerun flows, resume/completion, narration timing/fallback and authenticated assignment tracking against a disposable demo server.

The two ImageGen assets and exact prompts are in `docs/class-12-ct-artwork.md`. No dependency or backend endpoint was added.
