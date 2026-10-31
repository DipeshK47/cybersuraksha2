# English and Hindi text

The shared language control appears above every page, including student login, class/module libraries, lessons, activities, feedback and dashboards. The selection persists in `cybersuraksha-language` local storage, survives navigation/reloads and synchronises between tabs. If the local Hindi catalogue cannot load, English remains usable and the control offers a retry.

## Content and editorial status

`public/locales/hi.json` contains 17,402 offline-prepared Hindi messages and 310 dynamic-message templates. `app/lib/i18n/hi-overrides.json` holds editorial corrections, including all 64 Class 11/12 chapter titles, safety vocabulary, common controls, dates and number-dependent labels. The initial bulk copy was machine-translated from authored source files; it still needs a native Hindi editorial review before publication. Numbers and template placeholders are checked against their English sources. Sixty-one passages received manual corrections after that check identified missing questions, choices or number-format changes. No learner records were used to prepare the translations.

The requested style is conversational Hindi in Devanagari, with familiar English subject terms written as spoken: **एसेट, डिस्ट्रिब्यूशन, सिक्योरिटी, डेटा, ऑथेंटिकेशन, कॉन्फिडेंशियलिटी, इंटेग्रिटी**. Sentences stay in Hindi; this is not Roman-script Hinglish. Common controls now read “मेरा मैप चेक करें”, “अगला चैलेंज” and “सीधे प्रैक्टिस पर जाएँ”. All 64 senior chapter titles and the opening risk-map chapter's captions were edited for this style; five further chapters' captions received sentence-level revisions as well. The terminology/conversational pass revised over 6,900 catalogue entries across the site, including the handbook excerpts. The language toggle continues to be labelled हिन्दी.

`app/lib/i18n/hi-terms.json` defines source-aware terminology and simpler Hindi expressions. `scripts/hindi_style.py` applies these offline to the catalogue, templates, overrides and handbook excerpts. English source context keeps concepts such as privacy/प्राइवेसी and confidentiality/कॉन्फिडेंशियलिटी distinct. Reapplying the pass is stable, and it checks numbers and template slots before writing. The normal catalogue builder applies the same style, so future copy updates retain it. The guide's local answers and model instructions use the same register. No audio assets were changed for this wording revision.

The adapter translates text nodes and accessible labels/placeholders without replacing DOM elements, interpreting HTML or modifying React state. It combines adjacent text nodes for labels such as “Scene 3 of 6”, allowing natural Hindi word order. Original option values are retained, so matching, validation, scoring, storage keys and submitted identifiers continue to use their original values. The recorded exercise question is read from the original text when saving learning events. Tests cover native option values, corrected answers, dynamic text, fragment updates and restoration to English.

Code, formula notation, URLs, reference IDs, entered form values, user chat messages, literal password examples and target English vocabulary in the English grammar lesson retain their original spelling. Instructions around those examples are translated.

## Hindi narration

### Language modes

The language control above every page has three options:

| Option | Text | Narration |
|---|---|---|
| **English** | English | English |
| **हिन्दी** | Hindi | Hindi (where recorded) |
| **English + हिन्दी ऑडियो** | English | Hindi (where recorded) |

The text choice is still saved in `cybersuraksha-language`. The third option also saves `cybersuraksha-audio-language` = `hi`; choosing English or हिन्दी clears it. The control sets `data-audio-language` on `<html>` (`lang` keeps describing the text), and the story player follows that attribute, falling back to `lang`. The mode logic is in `app/lib/i18n/language-mode.ts`. A lesson with no Hindi recording keeps its English audio in every mode. Both settings sync across tabs and survive reloads.

### Classes 6-8 story recordings

`public/audio/cyber/<lesson-slug>/story-hi.mp3` sits next to the English `story.mp3` for 78 lessons: Class 6 and 7 (all 64 lessons) and Class 8 Cybersecurity plus AI lessons 1-6. Their cues live in `app/module/cyber/lessons/new/story/hindi-audio.generated.json` (slug to `src`, `duration`, six `{start, duration}` scene cues). The manifest is separate from the generated chapter JSON, so rebuilding a class's assets cannot erase it. A chapter that carries its own `hindiAudio` (Class 11 Chapter 1) takes precedence over the manifest.

The recordings were made from `CyberShiksha_Hindi_Narration_Classes_6_to_10.pdf` with the pipeline in `scripts/hindi-voiceover/` (ElevenLabs `eleven_v4`; Pari for lessons whose first named character is female, AJ for male or unnamed). Build the tracks from a folder of per-scene clips:

```
python3 scripts/build-hindi-story-audio.py --clips <folder with <slug>-hi-01.mp3 ...> [--scene6 english|silent]
```

It normalises every clip to the English tracks' loudness (-18 LUFS), joins the scenes with the house 0.65-second gap, measures the cues from the decoded clips and merges them into the manifest. Re-running it for more lessons keeps the existing entries.

**Scene 06 (Practice Lab intro) is not recorded yet.** Until `<slug>-hi-06.mp3` exists, the Hindi track uses the English narration of that final scene (`--scene6 english`, the default) or silence (`--scene6 silent`). Generate the scene 06 clips and the remaining lessons (rest of Class 8, Classes 9 and 10) with the same pipeline, then re-run the build script; recorded clips replace the fallback automatically. Run `node --test tests/hindi-story-audio.test.mjs` to check the manifest, gaps, files and real MP3 lengths, and `node scripts/hindi-audio-modes-qa.cjs` against a dev server to check the three modes in a browser (it signs in as the demo teacher).

### Class 11 Chapter 1


Class 11 → Cybersecurity → Chapter 1, **Your digital risk map**, now uses the supplied Hindi recordings when हिन्दी is selected. The six files `c11_L1_s1.mp3` through `c11_L1_s6.mp3` were assembled in that order into `public/audio/cyber/your-digital-risk-map/story-hi.mp3`, with the house 0.65-second gap between sections. Cue times in the chapter JSON come from the decoded recordings, rather than the shorter English narration. The Hindi timeline is 111.342 seconds long.

The existing scene buttons, captions, decision pause and replay use the selected narration's timing. Switching languages pauses at the start of the current section while retaining the learner's decision and activity state. The original English audio remains available through English. Chapters without a Hindi recording (see Classes 6-8 above for the 78 that have one) retain their existing audio. No runtime speech service is used.

Run `node scripts/hindi-audio-qa.cjs` against the local server to check all six cues, playback, the locked decision/resume, switching during playback, mute, ending/replay, saved language on reload, another chapter's existing audio and recovery from an unavailable Hindi track. These checks passed at 1280px and 390px; the 13 localization/Class 11 security tests, touched-file ESLint and production build also passed after connecting this narration.

The existing handbook assistant accepts the selected language, returns Hindi local excerpts and requests Hindi answers from its configured model. The original 404-page source-handbook index now has a local Hindi counterpart in `app/data/handbook-hi.json`. Search supports Devanagari, and the existing privacy guard also recognises common Hindi disclosures and Devanagari phone digits. The assistant retains its existing handbook-grade range; this change does not remap the source handbooks.

The parallel class-delivery mapping changes in this checkout are preserved. Localization uses the current routes and their original lesson identifiers.

## Fonts and runtime

Noto Sans Devanagari is self-hosted under `public/fonts/hindi/`, with its SIL Open Font License in `OFL.txt`. It is sourced from Google Fonts and adds no external font request. English retains the existing fonts. Hindi headings and controls allow Devanagari line height and text wrapping.

Students fetch the catalogue from this site. There is no runtime call to a translation provider, new translation API key, database migration or new runtime dependency.

## Updating copy

1. Run `node scripts/extract-language-catalogue.cjs` after editing the English source.
2. Run `python3 scripts/build-hindi-catalogue.py` to prepare missing messages offline. The shipped catalogue supplies existing translations, retaining reviewed copy even if the disposable cache is removed. This utility uses a public translation service for new authored source copy; do not run it on student data. The ignored `tmp/i18n/` cache allows interrupted runs to resume. Numeric/placeholder changes fail validation; review failures instead of publishing a partial catalogue.
3. Review the Hindi wording and place corrections in `hi-overrides.json`. The overrides take precedence over generated messages, including dynamic templates.
4. Run `python3 scripts/hindi_style.py` to materialize reviewed edits and terminology consistently, without a provider call. Keep new technical spellings in `hi-terms.json`; use complete sentence overrides where a word substitution would sound unnatural.
5. Run `python3 tests/hindi-style.test.py`, `node --test tests/hindi-localization.test.mjs` and `node scripts/hindi-browser-qa.cjs` against a disposable demo server. `node scripts/hindi-audio-qa.cjs` checks the supplied narration separately.

The browser checks cover the current class libraries, desktop/phone layout, story captions, younger-class activities, wrong/correct feedback, source-value scoring, language changes without resetting progress, reloading, download failure/retry, authenticated assignment marks, teacher history and Hindi privacy checks.

## Conversational wording checks on 26 October 2026

- The source-aware style checks passed for terminology, Devanagari word boundaries, privacy/confidentiality distinctions, repeatability, template slots and every number in the shipped copy.
- The 63 targeted localization/senior-module tests passed, followed by the final 11 localization tests after the homepage edits.
- Desktop and phone browser checks passed for the homepage, class libraries, stories, younger-class exercises, source-value scoring, language switching and authenticated completion recorded as 100 in teacher history and assignment marks. The supplied Hindi narration checks also passed.
- Catalogue rebuilding required zero provider requests. Production build, touched-file ESLint and whitespace checks passed.
- Live model-generated guide replies were not tested; their Hindi style instruction and the local fallback answers were updated. The initial machine-translated content still benefits from a full editorial review.

## Verification on 25 October 2026

- Production build and ESLint on the touched source/test files passed; the build includes the local catalogue, font files and font license.
- 72 targeted tests passed, including source-copy coverage, every story scene, numeric/placeholder preservation, senior modules, delivery mapping and English-example integration.
- Desktop and phone browser checks passed for Classes 6, 8, 11 and 12, including younger-class activities and authenticated completion with a score of 100 in teacher history and assignment marks.
- Rebuilding from the shipped catalogue with the disposable cache removed made no provider request and retained the reviewed translations.
- Five pre-existing Cloudflare/Vite TypeScript errors remain. The separate `rendered-html.test.mjs` dashboard check also still expects the older “Upcoming deadlines” wording. These unrelated checks were left unchanged.

This change has not been deployed. The Hindi text is machine-assisted with manual corrections, rather than native-speaker-certified copy.
