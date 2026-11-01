# Hindi audio scripts · Classes 6–10

160 lessons, organised as four modules of eight chapters per class: Cybersecurity, Artificial Intelligence, Computational Thinking and Cyber Fraud. Each lesson has six spoken sections matching the existing story scenes. This pack covers the interactive cyber courses; it does not include the separate Class 10 Mathematics/English textbook libraries.

The language is conversational Hindi/Hinglish: Hindi sentences in Devanagari with familiar English words such as **password, login, backup, model, data, practice lab** and **feedback**. This is spoken narration adapted from the existing Hindi teaching text, rather than formal Hindi or a Roman-Hindi transliteration. Characters, scenarios, stated conditions and answers follow the current lessons.

## Pick a class

| Class | Read all 32 lesson scripts | Individual recording files |
| --- | --- | --- |
| 6 | [Class 6 reading copy](class-6/Class-6-Hindi-Narration.md) | [Cybersecurity](class-6/01-cybersecurity), [AI](class-6/02-artificial-intelligence), [Computational Thinking](class-6/03-computational-thinking), [Cyber Fraud](class-6/04-cyber-fraud) |
| 7 | [Class 7 reading copy](class-7/Class-7-Hindi-Narration.md) | [Cybersecurity](class-7/01-cybersecurity), [AI](class-7/02-artificial-intelligence), [Computational Thinking](class-7/03-computational-thinking), [Cyber Fraud](class-7/04-cyber-fraud) |
| 8 | [Class 8 reading copy](class-8/Class-8-Hindi-Narration.md) | [Cybersecurity](class-8/01-cybersecurity), [AI](class-8/02-artificial-intelligence), [Computational Thinking](class-8/03-computational-thinking), [Cyber Fraud](class-8/04-cyber-fraud) |
| 9 | [Class 9 reading copy](class-9/Class-9-Hindi-Narration.md) | [Cybersecurity](class-9/01-cybersecurity), [AI](class-9/02-artificial-intelligence), [Computational Thinking](class-9/03-computational-thinking), [Cyber Fraud](class-9/04-cyber-fraud) |
| 10 | [Class 10 reading copy](class-10/Class-10-Hindi-Narration.md) | [Cybersecurity](class-10/01-cybersecurity), [AI](class-10/02-artificial-intelligence), [Computational Thinking](class-10/03-computational-thinking), [Cyber Fraud](class-10/04-cyber-fraud) |

For example, [Class 6 · What belongs in a public post?](class-6/01-cybersecurity/01-class6-private-information.txt) is one lesson's ready-to-copy text. The six paragraphs are its six scene clips, in order. The numbers in individual filenames are chapter numbers within a module; the combined reading copies number all 32 lessons within the class.

## Recording instructions

Use a warm Indian Hindi voice that handles English technical words naturally. Speak as a teacher explaining to a child, with clear sentences and a calm pace. Keep familiar English words as written; do not translate password, model or backup into formal Hindi. Read only the narration paragraphs, not lesson titles, filenames, scene headings or recording notes. Check the [pronunciation notes](PRONUNCIATION.md) before a batch recording.

1. Open one lesson's `.txt` file. It contains six paragraphs with one blank line between sections.
2. Generate or record **each paragraph as a separate clip**, keeping the order. A useful filename is `<lesson-slug>-hi-01.mp3` through `<lesson-slug>-hi-06.mp3`.
3. Scene 4 is the decision scene. In the interactive lesson, pause at its end for the learner to answer. Scene 5 explains the result and must remain after that decision. A single continuously played recording would reveal that result before the learner chooses.
4. Check names, English terms, numbers, units and pauses in one finished lesson before generating a class in bulk. Do not read a complete binary string as one large number. Where a digit-by-digit reading is needed, it is already written in the script.
5. For integration, measure the recorded clip lengths and create Hindi cue times from those lengths. Do not reuse the English start times or durations. The current course uses a 0.65-second gap when joining clips; if you use that gap, include it in the measured timeline.

These scripts follow the six-scene story track, including the transition to the practice lab. They are not a 40-minute lecture or a readout of every practical control, answer choice, feedback message and teacher rubric. Those remain in the interactive lesson. The narrator reads the decision context and, for Classes 6–7, the displayed question; students choose from the on-screen options.

## Files for an automated workflow

[manifest.json](manifest.json) contains all 160 lesson identities and 960 sections. Each lesson records its class, module, title, script path and current source hash. Each scene has its existing scene ID, section number, narration text and a non-spoken transition note. Only `scenes[].text` goes to the voice generator. The manifest deliberately contains no invented durations or English timings.

The website's Hindi captions and English audio are unchanged. These scripts use a more conversational spoken form, so they are not word-for-word subtitle replacements. Audio generation, listening checks and integration are separate steps.

## Updating this pack

From the repository root, using the supported Node runtime:

```sh
node scripts/build-hindi-narration-scripts.mjs
node --test tests/hindi-narration-scripts.test.mjs
```

The exporter reads the existing bilingual chapter sources. `scripts/hindi-narration-style.json` holds the spoken vocabulary pass. `scripts/hindi-narration-edits.json` holds reviewed sentence rewrites, guarded by their original Hindi text. A changed source passage stops export until its rewrite is reviewed. Edit those sources and rebuild; direct changes to generated `.txt`, reading copies or the manifest will be replaced.

The checks require exactly 32 lessons and four eight-chapter modules per class, six correctly ordered sections per lesson, existing scene IDs, preserved numerical values and source-matching recording files. They also check ambiguous Hindi word forms, acronym pronunciation, denominator wording and digit-by-digit readings.

The Class 10 reporting example retains India's official financial cyber fraud routes. The [National Cyber Crime Reporting Portal](https://cybercrime.gov.in/Webform/Crime_NodalGrivanceList.aspx) identifies **1930** for financial cyber fraud reporting; the script reads that number digit by digit. The example keeps trusted-adult help and avoids a recovery guarantee. Recheck official contact details before a later recording or re-release.
