import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, statSync } from 'node:fs';
import test from 'node:test';
import { class11Missions } from '../app/data/class-11-missions.ts';
import {
  AUDIO_LANGUAGE_KEY, LANGUAGE_KEY, audioLanguageOf, modeFrom, narrationLanguage, textLanguageOf,
} from '../app/lib/i18n/language-mode.ts';

const root = new URL('../', import.meta.url);
const read = path => readFileSync(new URL(path, root), 'utf8');
const manifest = JSON.parse(read('app/module/cyber/lessons/new/story/hindi-audio.generated.json'));
const GAP = 0.65;
const slugs = Object.keys(manifest);

function ffprobeSeconds(path) {
  try {
    return Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path], { encoding: 'utf8' }));
  } catch { return null; }
}

test('Hindi story audio covers Classes 6-10 (153 lessons) and Classes 11-12 (63 chapters)', () => {
  const classes = slugs.filter(slug => /^class(6|7|8|9|10)-/.test(slug));
  assert.equal(classes.length, 153, 'Classes 6-10 lessons');
  for (const [grade, count] of [[6, 32], [7, 32], [8, 32], [9, 32], [10, 25]]) {
    assert.equal(classes.filter(slug => slug.startsWith(`class${grade}-`)).length, count, `Class ${grade}`);
  }
  assert.deepEqual(manifest['class10-fraud-exam-update'].englishScenes, [2, 3, 4, 5, 6]);
  assert.ok(!manifest['class10-fraud-help-without-fees'], 'unrecorded chapters retain English audio');
  assert.equal(slugs.length - classes.length, 63, 'Class 11 and 12 chapters in the manifest');
  // Class 11 Chapter 1 keeps the recording that ships inside its own chapter JSON.
  assert.ok(!slugs.includes('your-digital-risk-map'));
  for (const slug of ['ai-evaluation-review', 'a-familiar-voice-asks-for-money', 'the-evidence-hearing']) assert.ok(slugs.includes(slug), slug);
  assert.deepEqual(slugs, [...slugs].sort(), 'manifest is sorted so rebuilds give small diffs');
});

test('complete imported lessons have all six cues without English fallback', () => {
  for (const slug of ['class8-ai-data-left-out', 'class8-ai-design-fair', 'class9-ai-language-context', 'class10-file-access-paths']) {
    assert.equal(manifest[slug].scenes.length, 6, slug);
    assert.equal(manifest[slug].englishScenes, undefined, slug);
  }
});

test('the two new Class 11 recordings have six reviewed Hindi paragraphs each', () => {
  const recording = JSON.parse(read('scripts/hindi-voiceover/class11-recovery-access.json'));
  const overrides = JSON.parse(read('app/lib/i18n/hi-overrides.json'));
  const catalogue = JSON.parse(read('public/locales/hi.json')).messages;
  assert.equal(recording.language_code, 'hi');
  assert.match(recording.voice_name, /^Pari M/);
  assert.equal(recording.jobs.length, 12);
  for (const slug of ['identity-beyond-a-password', 'who-should-have-access']) {
    const chapter = JSON.parse(read(`app/module/cyber/lessons/new/story/chapters/${slug}.json`));
    const jobs = recording.jobs.filter(job => job.slug === slug);
    assert.deepEqual(jobs.map(job => job.scene), [1, 2, 3, 4, 5, 6]);
    for (const [index, job] of jobs.entries()) {
      const source = chapter.scenes[index].caption.replace(/\s+/g, ' ').trim();
      assert.equal(job.source, source, `${slug}: source changed`);
      assert.equal(job.caption, overrides[source] ?? catalogue[source], `${slug}: caption drift`);
      assert.equal(job.text, job.caption.replace('एमएफए', 'एम एफ ए'));
      assert.match(job.text, /[\u0900-\u097f]/u);
    }
  }
  const departure = recording.jobs.find(job => job.slug === 'who-should-have-access' && job.scene === 5);
  assert.match(departure.caption, /टीम छोड़ चुके/);
  assert.doesNotMatch(departure.caption, /दिवंगत/);
});

test('all 32 Class 11 lessons have six Hindi scenes and a local audio track', () => {
  assert.equal(class11Missions.length, 32);
  for (const lesson of class11Missions) {
    const chapter = JSON.parse(read(`app/module/cyber/lessons/new/story/chapters/${lesson.slug}.json`));
    const hindi = chapter.hindiAudio ?? manifest[lesson.slug];
    assert.ok(hindi, lesson.slug);
    assert.equal(hindi.scenes.length, 6, lesson.slug);
    assert.ok(!hindi.englishScenes?.length, `${lesson.slug}: all scenes are Hindi`);
    assert.ok(statSync(new URL(`public${hindi.src}`, root)).size > 200_000, lesson.slug);
  }
});

test('every Hindi track has one cue per English scene, the house gap and a real file next to the English track', () => {
  for (const [slug, hindi] of Object.entries(manifest)) {
    const chapter = JSON.parse(read(`app/module/cyber/lessons/new/story/chapters/${slug}.json`));
    assert.equal(hindi.scenes.length, chapter.scenes.length, `${slug}: cue count`);
    assert.equal(hindi.src, `/audio/cyber/${slug}/story-hi.mp3`, `${slug}: src`);
    assert.ok(existsSync(new URL(`public/audio/cyber/${slug}/story.mp3`, root)), `${slug}: English track stays`);
    const file = new URL(`public${hindi.src}`, root);
    assert.ok(statSync(file).size > 200_000, `${slug}: Hindi track is not empty`);
    assert.equal(hindi.scenes[0].start, 0, `${slug}: first cue starts at 0`);
    hindi.scenes.forEach((cue, index) => {
      assert.ok(cue.duration > 3, `${slug} scene ${index + 1}: duration`);
      if (index) {
        const previous = hindi.scenes[index - 1];
        assert.ok(Math.abs(cue.start - previous.start - previous.duration - GAP) < 0.002, `${slug} scene ${index + 1}: ${GAP}s gap`);
      }
    });
    const last = hindi.scenes.at(-1);
    assert.ok(Math.abs(hindi.duration - (last.start + last.duration + GAP)) < 0.002, `${slug}: total duration`);
  }
});

test('manifest durations match the decoded MP3 files', t => {
  if (ffprobeSeconds(new URL('public/audio/cyber/class6-private-information/story-hi.mp3', root).pathname) === null) return t.skip('ffprobe not installed');
  for (const [slug, hindi] of Object.entries(manifest)) {
    const actual = ffprobeSeconds(new URL(`public${hindi.src}`, root).pathname);
    assert.ok(Math.abs(actual - hindi.duration) < 0.15, `${slug}: file ${actual}s vs cues ${hindi.duration}s`);
  }
});

test('language control: English and Hindi move text and audio together, the third mode splits them', () => {
  assert.deepEqual(['en', 'hi', 'en-hi-audio'].map(textLanguageOf), ['en', 'hi', 'en']);
  assert.deepEqual(['en', 'hi', 'en-hi-audio'].map(audioLanguageOf), ['en', 'hi', 'hi']);
  assert.equal(modeFrom(null, null), 'en');
  assert.equal(modeFrom('en', null), 'en');
  assert.equal(modeFrom('hi', null), 'hi');
  assert.equal(modeFrom('hi', 'hi'), 'hi', 'Hindi text always has Hindi audio');
  assert.equal(modeFrom('en', 'hi'), 'en-hi-audio');
  assert.equal(modeFrom('en', 'fr'), 'en', 'unknown saved audio values are ignored');
  assert.notEqual(LANGUAGE_KEY, AUDIO_LANGUAGE_KEY);
});

test('narration language follows the audio attribute, then the page language', () => {
  assert.equal(narrationLanguage(undefined, 'en'), 'en');
  assert.equal(narrationLanguage(undefined, 'hi'), 'hi');
  assert.equal(narrationLanguage('', 'hi'), 'hi');
  assert.equal(narrationLanguage('hi', 'en'), 'hi', 'English text with Hindi audio');
  assert.equal(narrationLanguage('en', 'hi'), 'en');
});

test('player and control are wired to the audio language attribute and the manifest', () => {
  const player = read('app/module/cyber/lessons/new/story/StoryPlayer.tsx');
  const toggle = read('app/components/LanguageToggle.tsx');
  assert.match(player, /attributeFilter: \["lang", "data-audio-language"\]/);
  assert.match(player, /hindi-audio\.generated\.json/);
  assert.match(player, /hindiNarration\?\.scenes\.length === chapter\.script\.scenes\.length/, 'mismatched cues keep English audio');
  assert.match(toggle, /dataset\.audioLanguage = audioLanguageOf\(next\)/);
  assert.match(toggle, /English \+ हिन्दी ऑडियो/);
});
