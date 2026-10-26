# Class 12 · Module 1: Cybersecurity

Implements the eight W1–W8 lessons from the Classes 11–12 syllabus prepared on 24 October 2026. Class 12 now has four syllabus modules of eight chapters each; Cybersecurity, AI and Computational Thinking are playable and assignable, giving 32 available chapters across all four completed modules.

| Chapter | Interactive evidence |
| --- | --- |
| From personal safety to system risk | Entry check, actors/trust-boundary diagram, supplied risk priorities and owners |
| Design the college-fest portal | Component roles, server/data/provider control locations, stated assumptions |
| Secure by design | Faulty versus repaired offline request model, same four-case pack, inclusive amount boundaries |
| Protect the whole dependency chain | Six-unit exercise budget, minimum-access agreement, independent recovery decision |
| When logs disagree | Evidence ledger, known clock correction with raw times retained, alternative explanation |
| The breach tabletop | Four roles, authorised action order, factual stakeholder update |
| Recover and learn | Recovery objectives, clean versus recent unsafe snapshot, exact-data/access/time tests |
| Security assurance review | Security/privacy/usability tradeoffs, misleading-alert revision, teacher-reviewed viva |

Each chapter reuses the six-scene narrated story, decision pause, three checked practice stages, first-answer scoring with visible retries, saved local resume and existing student/teacher assignment tracking. Illustrations are project-local; text, diagrams, logs and model outcomes remain accessible HTML. The planned duration is 40 minutes including teacher discussion, not a forced screen timer. No coding is mandatory.

## Classroom model limits

The portal and recovery benches are offline decision models. No SQL is executed; no real endpoint is requested, scanned or exploited. The supplier budget, risk estimates, 0–5,000 whole-rupee input rule and 30-minute/10-minute recovery objectives are invented exercise constraints, not prices, regulations or universal technical requirements. The model can compare expected and actual outcomes but is not an implementation or proof of production security.

Synthetic logs support facts, hypotheses and explicit unknowns. E2’s clock has a supplied two-minute fast offset; other clocks are aligned. Equal corrected timestamps do not establish causation. Session labels do not establish a human operator, response status does not prove complete receipt, and a denial on another path does not disprove the separate export event. No real person is accused.

Restoration checks compare exact IDs and statuses, intended organiser access, denied guest access and both supplied recovery objectives. Duplicate IDs, missing records, wrong status, unsafe permissions or missed objectives cannot pass. The safe snapshot still has stated model limits; passing finite checks is not a universal recovery guarantee.

The final evidence record supports an individual teacher-reviewed viva. Structured checks do not automatically establish authorship or oral understanding. No external stakeholder message is sent and no real service is administered.

## Technical references checked 25 October 2026

- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html): least privilege, permission on every request and correct enforcement location.
- [OWASP SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html): parameterised data access keeps values distinct from query instructions; input validation alone is not a substitute.
- [NIST SP 800-61 Rev. 3](https://csrc.nist.gov/pubs/sp/800/61/r3/final): incident preparation, detection, response and recovery within cybersecurity risk management. The classroom action order is a simplified exercise, not a verbatim standard or legal-response timeline.

## Checks

`node --test tests/class-12-security.test.mjs` checks syllabus coverage, model control failures, inclusive boundaries, supplier-budget integrity, clock correction and recovery corruption/permission/objective cases. `node scripts/class-12-security-qa.cjs` uses a disposable demo server to exercise all eight stories and 24 practice stages on desktop and phone, reload/resume, wrong feedback, media timing/fallback and authenticated teacher assignment completion. Exact illustration prompts and file locations are in `docs/class-12-security-artwork.md`.
