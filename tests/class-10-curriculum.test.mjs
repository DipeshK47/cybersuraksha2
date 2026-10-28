import assert from 'node:assert/strict';
import test from 'node:test';
import {existsSync} from 'node:fs';
import {loadSource,solveTask,routeSolutions,dependencySchedules} from './class-10-helpers.mjs';

const subjects=['Cybersecurity','Artificial Intelligence','Computational Thinking','Cyber Fraud'];
let loaded;
async function course() {
  assert.ok(existsSync(new URL('../app/data/class10/index.ts',import.meta.url)),'Class 10 authored library is required');
  return loaded??=await loadSource(`export {class10Chapters} from './app/data/class10'; export {getGradeCurriculum} from './app/data/curriculum'; export {getCyberLessonsForGrade,cyberLessons} from './app/data/cyber-lessons'; export {playableModules,assignmentChapters} from './app/data/module-registry'; export {evaluateTask} from './app/module/cyber/lessons/class8/task-evaluation';`);
}

test('Class 10 registers 32 original chapters and retains Mathematics and English',async()=>{
  const {class10Chapters,getGradeCurriculum,getCyberLessonsForGrade,playableModules,assignmentChapters,cyberLessons}=await course();
  assert.equal(class10Chapters.length,32);
  assert.equal(new Set(class10Chapters.map(c=>c.slug)).size,32);
  const grade=getGradeCurriculum(10);
  assert.deepEqual(grade.subjects.filter(s=>subjects.includes(s.name)).map(s=>s.name),subjects);
  assert.ok(grade.subjects.filter(s=>subjects.includes(s.name)).every(s=>s.modules.length===8));
  assert.equal(grade.subjects.find(s=>s.slug==='mathematics').chapters.length,14);
  assert.equal(grade.subjects.find(s=>s.slug==='english').chapters.length,9);
  const lessons=getCyberLessonsForGrade(10),playable=playableModules.filter(m=>m.grades.includes(10)&&m.strand!=='Mathematics'&&m.strand!=='English'),assigned=assignmentChapters.filter(m=>m.grades.includes(10));
  for(const list of [lessons,playable,assigned]){
    assert.equal(list.length,32);
    assert.deepEqual(new Set(list.map(r=>r.id)),new Set(class10Chapters.map(c=>'cyber-'+c.slug)));
  }
  assert.equal(new Set(lessons.flatMap(l=>l.assessmentIds)).size,96);
  for(const number of [8,9,11,12])assert.equal(getCyberLessonsForGrade(number).length,32);
  for(const number of [6,7])assert.equal(getGradeCurriculum(number).subjects.filter(s=>subjects.includes(s.name)).flatMap(s=>s.modules).length,8);
  assert.ok(cyberLessons.some(l=>!l.slug.startsWith('class10-')&&l.grades.includes(10)),'Historical lesson identities remain');
});

test('all Class 10 decisions and practicals have evaluator-accepted solutions and genuine alternatives',async()=>{
  const {class10Chapters,evaluateTask}=await course();
  const kinds=new Set();
  for(const subject of subjects)assert.equal(class10Chapters.filter(c=>c.strand===subject).length,8);
  for(const chapter of class10Chapters){
    assert.equal(chapter.scenes.length,6);assert.equal(chapter.tasks.length,3);
    const words=chapter.scenes.reduce((n,s)=>n+s.caption.en.trim().split(/\s+/).length,0);
    assert.ok(words>=200&&words<=225,`${chapter.slug}: ${words}`);
    for(const task of [chapter.decision,...chapter.tasks]){
      kinds.add(task.kind);assert.ok(evaluateTask(task,solveTask(task,evaluateTask)).correct,chapter.slug);
      if(task.kind==='number')assert.ok(task.fields.every(f=>f.explanation?.hi));
      if(task.kind==='order'){
        assert.equal(task.stepReasons?.length,task.expected.length);
        if(task.prerequisites){const alternatives=dependencySchedules(task,2);assert.equal(alternatives.length,2);for(const a of alternatives)assert.ok(evaluateTask(task,a).correct);}
      }
      if(task.kind==='route'){const alternatives=routeSolutions(task,2);assert.equal(alternatives.length,2);for(const a of alternatives)assert.ok(evaluateTask(task,a).correct);}
    }
  }
  assert.deepEqual(kinds,new Set(['choice','select','match','order','number','binary','grid','route','model']));
});

test('every authored scene supplies explanatory movement, semantic change and valid exploration references',async()=>{
  const {class10Chapters}=await course();
  for(const chapter of class10Chapters){
    const v=chapter.visual;assert.equal(v.scenes.length,6);
    const ids=new Set(v.nodes.map(n=>n.id));assert.equal(ids.size,v.nodes.length);
    for(const e of v.edges)assert.ok(ids.has(e.from)&&ids.has(e.to));
    for(const [sceneIndex,scene]of v.scenes.entries()){
      const positions=new Set(),meaning=new Set();
      for(const step of scene.steps){
        for(const key of ['active','warning','complete','hidden'])for(const id of step[key]??[])assert.ok(ids.has(id));
        positions.add(JSON.stringify(v.nodes.map(n=>{const m=step.moves?.find(m=>m.id===n.id);return[n.id,m?.x??n.x,m?.y??n.y]})));
        meaning.add(JSON.stringify([step.active,step.warning,step.complete,step.hidden,step.values,step.activeEdges]));
      }
      assert.ok(positions.size>=2&&meaning.size>=2,`${chapter.slug}: scene ${sceneIndex+1}`);
    }
    assert.ok(v.exploration.variants.length>=2);
    for(const variant of v.exploration.variants)assert.ok(v.scenes[variant.scene]?.steps[variant.step]);
  }
});
