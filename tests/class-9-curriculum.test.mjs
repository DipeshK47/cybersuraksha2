import assert from 'node:assert/strict';
import test from 'node:test';
import {loadSource,solveTask,routeSolutions} from './class-9-helpers.mjs';

const {class9Chapters,getGradeCurriculum,getCyberLessonsForGrade,playableModules,assignmentChapters,evaluateTask,cyberLessons} = await loadSource(`
export {class9Chapters} from './app/data/class9';
export {getGradeCurriculum} from './app/data/curriculum';
export {getCyberLessonsForGrade,cyberLessons} from './app/data/cyber-lessons';
export {playableModules,assignmentChapters} from './app/data/module-registry';
export {evaluateTask} from './app/module/cyber/lessons/class8/task-evaluation';
`);
const subjects=['Cybersecurity','Artificial Intelligence','Computational Thinking','Cyber Fraud'];
function bilingual(value,path) {
  if (!value || typeof value !== 'object') return;
  if (typeof value.en === 'string') {
    assert.ok(value.en.trim() && value.hi?.trim(),path);
    // Code, dataset identifiers and URL fragments stay literal in both languages.
    if(!(path.endsWith('.label')&&value.en===value.hi))assert.match(value.hi,/[\u0900-\u097f]/u,path);
    assert.deepEqual((value.en.match(/\d+(?:[.,:]\d+)*/g)??[]).sort(),(value.hi.match(/\d+(?:[.,:]\d+)*/g)??[]).sort(),path);
  } else Object.entries(value).forEach(([key,child])=>bilingual(child,`${path}.${key}`));
}

test('Class 9 delivery and access contain exactly the 32 original registered chapters',()=>{
  assert.equal(class9Chapters.length,32);
  assert.equal(new Set(class9Chapters.map(c=>c.slug)).size,32);
  const grade=getGradeCurriculum(9);
  assert.deepEqual(grade.subjects.map(s=>s.name),subjects);
  assert.ok(grade.subjects.every(s=>s.modules.length===8));
  const lessons=getCyberLessonsForGrade(9),playable=playableModules.filter(m=>m.grades.includes(9)),assigned=assignmentChapters.filter(m=>m.grades.includes(9));
  for(const list of [lessons,playable,assigned]) {
    assert.equal(list.length,32);
    assert.ok(list.every(row=>row.id.startsWith('cyber-class9-')));
    assert.deepEqual(new Set(list.map(row=>row.id)),new Set(class9Chapters.map(c=>'cyber-'+c.slug)));
  }
  assert.equal(new Set(lessons.flatMap(l=>l.assessmentIds)).size,96);
  for(const gradeNumber of [8,11,12]) assert.equal(getGradeCurriculum(gradeNumber).subjects.filter(s=>subjects.includes(s.name)).flatMap(s=>s.modules).length,32);
  for(const gradeNumber of [6,7,10]) assert.equal(getGradeCurriculum(gradeNumber).subjects.filter(s=>subjects.includes(s.name)).flatMap(s=>s.modules).length,8);
  assert.ok(cyberLessons.some(l=>!l.slug.startsWith('class9-')&&l.grades.includes(9)),'Keep historical lesson metadata');
});

test('every chapter has full bilingual teaching material and a new six-scene story',()=>{
  for(const subject of subjects) assert.equal(class9Chapters.filter(c=>c.strand===subject).length,8);
  for(const chapter of class9Chapters) {
    assert.ok(chapter.slug.startsWith('class9-'));
    assert.equal(chapter.scenes.length,6,chapter.slug);
    const words=chapter.scenes.reduce((n,s)=>n+s.caption.en.split(/\s+/).length,0);
    assert.ok(words>=200&&words<=225,`${chapter.slug}: ${words} words`);
    assert.equal(chapter.topics.length,3); assert.equal(chapter.outcomes.length,3); assert.equal(chapter.rubric.length,3);
    assert.equal(chapter.tasks.length,3); assert.equal(chapter.decision.kind,'choice');
    assert.match(chapter.scenes.map(s=>s.caption.en).join(' '),/Reva|Nikhil/,chapter.slug);
    bilingual(chapter,chapter.slug);
  }
});

test('all 96 authored activities can be solved and routes permit genuine alternatives',()=>{
  const kinds=new Set();
  for(const chapter of class9Chapters) for(const task of [chapter.decision,...chapter.tasks]) {
    kinds.add(task.kind);
    const answer=solveTask(task,evaluateTask);
    assert.equal(evaluateTask(task,answer).correct,true,`${chapter.slug}: ${task.prompt.en}`);
    if(task.kind==='number') assert.ok(task.fields.every(f=>f.explanation?.en&&f.explanation?.hi),chapter.slug);
    if(task.kind==='order') assert.equal(task.stepReasons?.length,task.expected.length,chapter.slug);
    if(task.kind==='match'&&task.presentation==='permissions') assert.ok(task.simulation?.length,chapter.slug);
    if(task.kind==='route') {
      assert.ok(Object.values(task.cellCosts??{}).every(cost=>Number.isInteger(cost)&&cost>0));
      const alternatives=routeSolutions(task,2);
      assert.equal(alternatives.length,2,chapter.slug);
      for(const route of alternatives) assert.equal(evaluateTask(task,route).correct,true,chapter.slug);
    }
  }
  assert.deepEqual(kinds,new Set(['choice','select','match','order','number','binary','grid','route','model']));
});
