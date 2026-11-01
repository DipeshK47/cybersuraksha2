import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, mkdtemp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { root, grades, spokenHindi, loadChapters, recordingLesson, exportScripts } from '../scripts/build-hindi-narration-scripts.mjs';

const destination = join(root, 'docs/hindi-narration');
const rows = await loadChapters();
const manifest = JSON.parse(await readFile(join(destination, 'manifest.json'), 'utf8'));

test('all five classes have four eight-lesson modules and six matching story sections per lesson', async () => {
  assert.equal(manifest.lessonCount, 160);
  assert.equal(manifest.sceneCount, 960);
  assert.equal(new Set(manifest.lessons.map(lesson=>lesson.slug)).size, 160);
  for (const grade of grades) {
    const lessons = manifest.lessons.filter(lesson=>lesson.grade===grade);
    assert.equal(lessons.length, 32);
    assert.deepEqual(Object.values(Object.groupBy(lessons, lesson=>lesson.strand)).map(module=>module.length), [8,8,8,8]);
    assert.deepEqual(lessons.map(lesson=>lesson.lesson), Array.from({length:32},(_,i)=>i+1));
  }
  for (const [index,row] of rows.entries()) {
    const lesson = manifest.lessons[index];
    assert.deepEqual(lesson, recordingLesson(row));
    assert.match(lesson.sourceHash,/^[a-f0-9]{64}$/);
    assert.equal(lesson.scenes.length, 6);
    const original = JSON.parse(await readFile(join(root, 'app/module/cyber/lessons/new/story/chapters', `${lesson.slug}.json`),'utf8'));
    assert.deepEqual(lesson.scenes.map(scene=>scene.id),original.scenes.map(scene=>scene.id));
    const plain = await readFile(join(destination, lesson.script), 'utf8');
    assert.deepEqual(plain.trim().split('\n\n'), lesson.scenes.map(scene=>scene.text));
    for(const scene of lesson.scenes) {
      assert.match(scene.text,/[\u0900-\u097f]/u);
      assert.doesNotMatch(scene.text,/\{\{|https?:\/\/|00110010|count\s*=/);
      assert.equal(scene.start,undefined);
      assert.equal(scene.duration,undefined);
    }
    assert.match(lesson.scenes[3].after,/learner decision/);
  }
});

test('the vocabulary pass stays conversational without corrupting Hindi verbs or technical meanings', () => {
  assert.equal(spokenHindi('A password and backup', 'पासवर्ड और बैकअप'), 'password और backup');
  assert.equal(spokenHindi('The label matches', 'लेबल मेल खाता है।'), 'label मेल खाता है।');
  assert.equal(spokenHindi('Read a QR code', 'क्यू आर कोड पढ़ें।'), 'क्यू आर code पढ़ें।');
  assert.equal(spokenHindi('The queue is ready', 'क्यू तैयार है।'), 'queue तैयार है।');
  assert.equal(spokenHindi('AI and OTP', 'AI और OTP'), 'ए आई और ओ टी पी');
  assert.match(spokenHindi('confidentiality', 'गोपनीयता'), /कॉन्फिडेंशियलिटी/);
  assert.match(spokenHindi('privacy', 'गोपनीयता'), /privacy/);
  assert.equal(spokenHindi('₹240 and 80%', '₹240 और 80%'), '240 रुपये और 80 परसेंट');
});

test('reviewed passages keep source guards, meaningful denominators and exact spoken binary digits', () => {
  const pick = (slug,scene) => manifest.lessons.find(lesson=>lesson.slug===slug).scenes[scene-1].text;
  assert.match(pick('class10-ai-four-boxes',5), /denominator शून्य/);
  assert.match(pick('class9-ai-queue-statistics',6), /denominator बदल/);
  assert.match(pick('class10-ai-moving-window',2), /शून्य, शून्य, एक, एक, शून्य, शून्य, एक, शून्य/);
  assert.match(pick('class10-fraud-help-without-fees',3), /एक, नौ, तीन, शून्य/);
  const changed = structuredClone(rows.find(row=>row.chapter.slug==='class6-private-information'));
  changed.chapter.scenes[0].caption.hi += ' बदली हुई बात।';
  assert.throws(()=>recordingLesson(changed), /needs source review/);
  const numbered = structuredClone(rows.find(row=>row.chapter.slug==='class10-ai-moving-window'));
  numbered.chapter.scenes[1].caption.hi = numbered.chapter.scenes[1].caption.hi.replace('50','51');
  assert.throws(()=>recordingLesson(numbered), /needs source review/);
});

test('a fresh export reproduces every delivered lesson and class reading copy', async () => {
  const temporary = await mkdtemp(join(tmpdir(), 'hindi-scripts-test-'));
  try {
    await exportScripts(temporary);
    const relative = ['manifest.json', ...manifest.lessons.map(lesson=>lesson.script), ...grades.map(grade=>`class-${grade}/Class-${grade}-Hindi-Narration.md`)];
    for(const file of relative) assert.equal(await readFile(join(temporary,file),'utf8'),await readFile(join(destination,file),'utf8'),file);
    const files = await readdir(temporary,{recursive:true});
    assert.equal(files.filter(file=>file.endsWith('.txt')).length,160);
  } finally { await rm(temporary,{recursive:true,force:true}); }
});
