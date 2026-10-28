import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { loadSource, root, solveTask, wrongAnswers, routeSolutions, dependencySchedules } from './class-10-helpers.mjs';

const subject=process.argv[process.argv.indexOf('--subject')+1];
const names={security:['class10SecurityChapters','Cybersecurity'],ai:['class10AiChapters','Artificial Intelligence'],ct:['class10CtChapters','Computational Thinking'],fraud:['class10FraudChapters','Cyber Fraud']};
assert.ok(names[subject], 'Use --subject security, ai, ct or fraud');
assert.ok(existsSync(join(root,`app/data/class10/${subject}.ts`)), `Authored ${subject} source is required`);
const {chapters,evaluateTask,diagnoseTask}=await loadSource(`export {${names[subject][0]} as chapters} from './app/data/class10/${subject}'; export {evaluateTask} from './app/module/cyber/lessons/class8/task-evaluation'; export {diagnoseTask} from './app/module/cyber/lessons/class8/task-feedback';`);
assert.equal(chapters.length,8);
assert.equal(new Set(chapters.map(c=>c.slug)).size,8);
let pairs=0, solved=0, wrong=0;
const kinds=new Set(), counts=[];
function bilingual(value,path) {
  if(!value||typeof value!=='object')return;
  if(typeof value.en==='string') {
    pairs++;
    assert.ok(value.en.trim()&&value.hi?.trim(),path);
    const literal=value.en===value.hi && (/^[\d\s.,%+\-=/()[\]<>:|*]+$/.test(value.en)||path.endsWith('.label'));
    if(!literal)assert.match(value.hi,/[\u0900-\u097f]/u,path);
    assert.deepEqual((value.en.match(/\d+(?:[.,:]\d+)*/g)??[]).sort(),(value.hi.match(/\d+(?:[.,:]\d+)*/g)??[]).sort(),path);
  }else for(const [key,child]of Object.entries(value))bilingual(child,`${path}.${key}`);
}
for(const chapter of chapters) {
  assert.equal(chapter.strand,names[subject][1]);assert.ok(chapter.slug.startsWith('class10-'));
  for(const name of ['topics','outcomes','rubric','tasks'])assert.equal(chapter[name].length,3,`${chapter.slug}.${name}`);
  assert.equal(chapter.scenes.length,6);
  const words=chapter.scenes.reduce((n,s)=>n+s.caption.en.trim().split(/\s+/).length,0);
  assert.ok(words>=200&&words<=225,`${chapter.slug}: ${words} words`);counts.push(words);
  assert.match(chapter.scenes.map(s=>s.caption.en).join(' '),/Aditi|Vihaan/);
  bilingual(chapter,chapter.slug);
  for(const task of [chapter.decision,...chapter.tasks]) {
    kinds.add(task.kind); const solution=solveTask(task,evaluateTask);
    assert.equal(evaluateTask(task,solution).correct,true,`${chapter.slug}: ${task.prompt.en}`); solved++;
    assert.equal(diagnoseTask(task,solution).correct,true);
    if(task.kind==='number')assert.ok(task.fields.every(f=>f.explanation?.en&&f.explanation?.hi));
    if(task.kind==='order') {
      assert.equal(task.stepReasons?.length,task.expected.length);
      if(task.prerequisites) {
        const alternatives=dependencySchedules(task,2);assert.equal(alternatives.length,2,`${chapter.slug}: alternative schedules`);
        for(const a of alternatives)assert.equal(evaluateTask(task,a).correct,true);
      }
    }
    if(task.kind==='route') {
      const alternatives=routeSolutions(task,2);assert.equal(alternatives.length,2);
      for(const a of alternatives)assert.equal(evaluateTask(task,a).correct,true);
    }
    if(task.kind==='match'&&task.presentation==='permissions')assert.ok(task.simulation?.length);
    for(const answer of wrongAnswers(task,evaluateTask,diagnoseTask)) {
      const d=diagnoseTask(task,answer); assert.ok(d.complete&&!d.correct&&d.issues.length,task.prompt.en);
      assert.ok(d.submitted.en&&d.submitted.hi&&d.next.en&&d.next.hi);wrong++;
    }
  }
  const v=chapter.visual;
  assert.equal(v.scenes.length,6);assert.ok(v.nodes.length>=3&&v.nodes.length<=9);
  const ids=new Set(v.nodes.map(n=>n.id)), edges=new Set(v.edges.map(e=>e.id));
  assert.equal(ids.size,v.nodes.length);assert.equal(edges.size,v.edges.length);
  for(const n of v.nodes)assert.ok(n.x>=12&&n.x<=88&&n.y>=15&&n.y<=85,`${chapter.slug}: node bounds ${n.id}`);
  for(const e of v.edges)assert.ok(ids.has(e.from)&&ids.has(e.to),`${chapter.slug}: edge ${e.id}`);
  for(const [i,scene]of v.scenes.entries()) {
    assert.ok(scene.steps.length>=3&&scene.steps.length<=4);
    const movements=new Set(), semantic=new Set();
    for(const step of scene.steps) {
      for(const key of ['active','warning','complete','hidden'])for(const id of step[key]??[])assert.ok(ids.has(id),`${chapter.slug}:${i} ${id}`);
      for(const id of step.activeEdges??[])assert.ok(edges.has(id));
      for(const id of Object.keys(step.values??{}))assert.ok(ids.has(id));
      for(const move of step.moves??[])assert.ok(ids.has(move.id)&&move.x>=12&&move.x<=88&&move.y>=15&&move.y<=85);
      movements.add(JSON.stringify(v.nodes.map(n=>{const m=step.moves?.find(m=>m.id===n.id);return[n.id,m?.x??n.x,m?.y??n.y]})));
      semantic.add(JSON.stringify([step.active,step.warning,step.complete,step.hidden,step.values,step.activeEdges]));
    }
    assert.ok(movements.size>=2,`${chapter.slug}: scene${i+1} needs meaningful movement`);
    assert.ok(semantic.size>=2,`${chapter.slug}: scene${i+1} needs semantic change`);
  }
  assert.ok(v.exploration.variants.length>=2&&v.exploration.variants.length<=4);
  assert.equal(new Set(v.exploration.variants.map(x=>x.id)).size,v.exploration.variants.length);
  for(const variant of v.exploration.variants)assert.ok(Number.isInteger(variant.scene)&&Number.isInteger(variant.step)&&v.scenes[variant.scene]?.steps[variant.step]);
}
console.log(JSON.stringify({subject,chapters:chapters.length,pairs,captionWords:counts,solved,wrong,mechanics:[...kinds],scenes:48}));
