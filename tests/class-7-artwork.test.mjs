import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { loadSource, root } from './class-8-helpers.mjs';

test('all 32 Class 7 chapters have distinct local artwork and smaller library previews', async () => {
  const { class7Chapters, class7Artwork } = await loadSource('export {class7Chapters} from "./app/data/class7"; export {class7Artwork} from "./app/data/class7/artwork";');
  assert.deepEqual(Object.keys(class7Artwork).sort(),class7Chapters.map(chapter=>chapter.slug).sort());
  const hashes = new Set();
  for (const chapter of class7Chapters) {
    const artwork = class7Artwork[chapter.slug];
    assert.ok(artwork.alt.en.length>30,chapter.slug);
    assert.match(artwork.alt.hi,/[\u0900-\u097f]/,chapter.slug);
    for (const url of [artwork.src,artwork.preview]) {
      assert.ok(url.startsWith('/cyber-missions/class-7/'),url);
      const file=join(root,'public',url);
      const bytes=readFileSync(file);
      assert.equal(bytes.toString('ascii',0,4),'RIFF');
      assert.equal(bytes.toString('ascii',8,12),'WEBP');
      assert.ok(statSync(file).size>5000,url);
    }
    assert.ok(statSync(join(root,'public',artwork.preview)).size<statSync(join(root,'public',artwork.src)).size,chapter.slug);
    hashes.add(createHash('sha256').update(readFileSync(join(root,'public',artwork.src))).digest('hex'));
  }
  assert.equal(hashes.size,32,'A generic image must not stand in for several chapters');
});

test('story and practice use chapter artwork without the generic classroom illustration', () => {
  const story=readFileSync(join(root,'app/module/cyber/lessons/class7/Class7Stories.tsx'),'utf8');
  const practice=readFileSync(join(root,'app/module/cyber/lessons/class7/Class7Lesson.tsx'),'utf8');
  assert.match(story,/Explanation: Class7StoryArtwork/);
  assert.match(practice,/PracticeVisual=\{Class7PracticeArtwork\}/);
  const component=readFileSync(join(root,'app/module/cyber/lessons/class7/Class7Artwork.tsx'),'utf8');
  assert.match(component,/artwork\.alt\[language\]/);
  assert.match(component,/srcSet=/);
});
