import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSource, solveTask } from './class-8-helpers.mjs';
const { class8Chapters, buildTaskEvidence, evidenceFeedbackChunks, evaluateTask } = await loadSource(`export {class8Chapters} from './app/data/class8'; export {buildTaskEvidence,evidenceFeedbackChunks} from './app/module/cyber/lessons/class8/task-evidence'; export {evaluateTask} from './app/module/cyber/lessons/class8/task-evaluation';`);
test('all authored task kinds retain bilingual answers and simulation evidence', () => {
 const kinds = new Set();
 for (const chapter of class8Chapters) for (const task of chapter.tasks) {
  kinds.add(task.kind); const answer = solveTask(task,evaluateTask); const lines = buildTaskEvidence(task,answer);
  assert.ok(lines.length); for (const line of lines) for(const lang of ['en','hi']) { assert.ok(line.label[lang]); assert.ok(line.value[lang]); }
  const text = lines.map(x=>x.value.en).join('\n');
  for(const value of typeof answer==='string'?[answer]:Array.isArray(answer)?answer:Object.values(answer)) assert.ok(text.includes(String(value)), `${task.kind}: ${value}`);
  if(task.kind==='route') assert.ok(lines.some(x=>x.label.en==='Final position'));
  if(task.kind==='model') assert.ok(lines.some(x=>x.label.en.includes('prediction')));
  if(task.kind==='match'&&task.presentation==='permissions') assert.ok(lines.length>task.rows.length);
 }
 assert.equal(kinds.size,9);
});
test('chunking preserves every character, even long Unicode and escaped values',()=>{
 const lines = ['अ'.repeat(2000), '"\\\n'.repeat(700), 'last'];
 const chunks=evidenceFeedbackChunks(lines,900);
 assert.equal(chunks.join(''),lines.join('\n')); assert.ok(chunks.every(x=>x.length<=900));
});
test('route failure, model records and permissions expose concrete derived results',()=>{
 const tasks=class8Chapters.flatMap(c=>c.tasks);
 const route=tasks.find(t=>t.kind==='route');
 const fail=buildTaskEvidence(route,['invalid']);
 assert.equal(fail.find(x=>x.label.en==='Failed move number').value.en,'1');
 assert.ok(fail.find(x=>x.label.en==='Final position').value.hi.includes('पंक्ति'));
 const model=tasks.find(t=>t.kind==='model');
 const records=buildTaskEvidence(model,model.examples.map(x=>x.id));
 for(const row of model.examples) assert.ok(records[0].value.en.includes(`${row.id}: ${row.value}`));
 for(const row of model.tests) assert.ok(records.some(x=>x.label.en.includes(`${row.id} (${row.value})`)));
 const permission=tasks.find(t=>t.kind==='match'&&t.presentation==='permissions');
 const ledger=buildTaskEvidence(permission,Object.fromEntries(permission.rows.map(x=>[x.id,x.answer])));
 assert.equal(ledger.length,permission.rows.length+permission.simulation.length);
 for(const line of ledger.slice(permission.rows.length)) assert.ok(line.value.hi.length>5);
});
test('all authored teacher evidence fits activity serialization bound without loss',()=>{
 for(const chapter of class8Chapters) for(const [stage,task] of chapter.tasks.entries()) {
 const lines=buildTaskEvidence(task,solveTask(task,evaluateTask)).map(line=>`${line.label.en}: ${line.value.en} / ${line.label.hi}: ${line.value.hi}`);
 const chunks=evidenceFeedbackChunks(lines);
 assert.equal(chunks.join(''),lines.join('\n'));
 chunks.forEach((feedback,i)=>assert.ok(JSON.stringify({evidence:true,category:chapter.topics[stage].en.slice(0,150),question:task.prompt.en.slice(0,300),feedback,evidencePart:i+1,evidenceParts:chunks.length}).length<2000));
 }
});
