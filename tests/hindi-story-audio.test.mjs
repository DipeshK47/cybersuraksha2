import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, statSync } from 'node:fs';
import test from 'node:test';
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

test('Hindi story audio covers Classes 6, 7 and 8 lessons that have recordings', () => {
  assert.ok(slugs.length >= 70, `expected at least 70 lessons, found ${slugs.length}`);
  for (const slug of slugs) assert.match(slug, /^class(6|7|8)-/, slug);
  assert.deepEqual(slugs, [...slugs].sort(), 'manifest is sorted so rebuilds give small diffs');
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
