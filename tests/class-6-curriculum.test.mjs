import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { loadSource, root, solveTask, wrongAnswers } from './class-9-helpers.mjs';

const { chapters, evaluateTask, diagnoseTask, getGradeCurriculum, assignmentChapters, getCyberLesson, getCyberLessonsForGrade } = await loadSource(`
export {class6Chapters as chapters} from './app/data/class6';
export {evaluateTask} from './app/module/cyber/lessons/class8/task-evaluation';
export {diagnoseTask} from './app/module/cyber/lessons/class8/task-feedback';
export {getGradeCurriculum} from './app/data/curriculum';
export {assignmentChapters} from './app/data/module-registry';
export {getCyberLesson,getCyberLessonsForGrade} from './app/data/cyber-lessons';
`);

test('Class 6 exposes four eight-chapter modules with matching assignable routes', () => {
  const course = getGradeCurriculum(6);
  assert.equal(course.title, 'Discovery Club');
  assert.deepEqual(course.subjects.map(subject => subject.modules.length), [8,8,8,8]);
  const assignments = assignmentChapters.filter(row => row.grades.includes(6));
  assert.equal(assignments.length,32);
  assert.equal(getCyberLessonsForGrade(6).length,32);
  for (const chapter of chapters) {
    const assignment = assignments.find(row => row.id === `cyber-${chapter.slug}`);
    assert.ok(assignment, chapter.slug);
    assert.equal(assignment.href, `/module/cyber/${chapter.slug}`);
    assert.deepEqual(assignment.grades,[6]);
    assert.equal(getCyberLesson(chapter.slug).durationMinutes,40);
    assert.ok(course.subjects.find(subject => subject.strand === chapter.strand).modules.some(row => row.title === chapter.title.en));
  }
  // Old identities and metadata remain readable; only the current grade library changes.
  assert.equal(getCyberLesson('pattern-detective').id,'cyber-lower-ct-pattern-detective');
  assert.deepEqual(getCyberLesson('pattern-detective').grades,[3,4,6,7]);
  for(const [grade,count] of [[3,8],[4,8],[5,8],[7,32],[8,32],[9,32],[10,32],[11,32],[12,32]]) {
    assert.equal(assignmentChapters.filter(row=>row.grades.includes(grade)).length,count,`Class ${grade}`);
  }
});

test('all 32 chapters have complete bilingual teaching, solvable tasks and explained wrong answers', () => {
  assert.equal(chapters.length,32);
  assert.equal(new Set(chapters.map(row=>row.slug)).size,32);
  function bilingual(value, location) {
    if (!value || typeof value !== 'object') return;
    if (typeof value.en === 'string') {
      assert.ok(value.en.trim(), location);
      assert.match(value.hi,/[\u0900-\u097f]/,location);
    } else for(const [key,child] of Object.entries(value)) bilingual(child,`${location}.${key}`);
  }
  const kinds = new Set();
  for (const chapter of chapters) {
    bilingual(chapter,chapter.slug);
    assert.equal(chapter.scenes.length,6);
    const words=chapter.scenes.reduce((sum,scene)=>sum+scene.caption.en.split(/\s+/).length,0);
    assert.ok(words>=180&&words<=225,`${chapter.slug}: ${words} words`);
    for(const key of ['topics','outcomes','rubric','tasks'])assert.equal(chapter[key].length,3,`${chapter.slug}: ${key}`);
    for(const task of [chapter.decision,...chapter.tasks]) {
      kinds.add(task.kind);
      const solution=solveTask(task,evaluateTask);
      assert.ok(evaluateTask(task,solution).correct,`${chapter.slug}: unsolvable ${task.prompt.en}`);
      assert.equal(evaluateTask(task,'').correct,false,`${chapter.slug}: blank passed`);
      for(const wrong of wrongAnswers(task,evaluateTask,diagnoseTask)) {
        const diagnosis=diagnoseTask(task,wrong);
        assert.equal(diagnosis.correct,false);
        assert.ok(diagnosis.complete);
        assert.ok(diagnosis.issues.length,`${chapter.slug}: unexplained wrong answer`);
      }
    }
  }
  assert.deepEqual([...kinds].sort(),['choice','match','number','order','route','select']);
});

test('Class 6 story scripts retain measured local narration and the authored captions', () => {
  for(const chapter of chapters) {
    const script=JSON.parse(readFileSync(join(root,'app/module/cyber/lessons/new/story/chapters',chapter.slug+'.json'),'utf8'));
    assert.ok(statSync(join(root,'public/audio/cyber',chapter.slug,'story.mp3')).size>10000,chapter.slug);
    assert.equal(script.scenes.length,6);
    assert.ok(script.duration>60&&script.duration<150,chapter.slug);
    assert.match(script.narrationHash,/^[a-f0-9]{64}$/);
    assert.equal(script.narrationHash,createHash('sha256').update(JSON.stringify({settings:script.narration,speech:script.scenes.map(scene=>scene.speech??scene.caption)})).digest('hex'),chapter.slug);
    for(const [index,scene] of script.scenes.entries()) {
      assert.equal(scene.caption,chapter.scenes[index].caption.en);
      assert.ok(scene.duration>1);
      assert.ok(scene.start>=0&&scene.start+scene.duration<=script.duration);
      if(index)assert.ok(scene.start>=script.scenes[index-1].start+script.scenes[index-1].duration-0.000001);
    }
  }
});

test('generated Hindi covers every authored value', () => {
  const catalogue=JSON.parse(readFileSync(join(root,'public/locales/hi.json'),'utf8'));
  const normalize=value=>value.replace(/\s+/g,' ').trim();
  function check(value) {
    if(!value||typeof value!=='object')return;
    if(typeof value.en==='string')assert.ok(catalogue.messages[normalize(value.en)],value.en);
    else for(const child of Object.values(value))check(child);
  }
  check(chapters);
});
