import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSource } from './class-8-helpers.mjs';

const api = await loadSource(`export * from './app/module/cyber/lessons/class8/task-evaluation'; export * from './app/module/cyber/lessons/class8/task-evidence';`);
const l = (en, hi = `हिंदी ${en}`) => ({ en, hi });
const base = { prompt:l('Decide'), context:l('Evidence'), success:l('Correct'), correction:l('Review supplied evidence'), hint:l('Compare the source') };
const option = id => ({ id, label:l(`${id} label`), feedback:l(`${id} authored reason`) });
const select = { ...base, kind:'select', items:['good','also','bad','worse'].map(option), expected:['good','also'] };
const diagnose = (task, answer) => { assert.equal(typeof api.diagnoseTask,'function','diagnoseTask must expose concrete bilingual diagnosis'); return api.diagnoseTask(task, answer); };
const bilingual = d => {
 for (const value of [d.submitted,d.summary,d.next,...d.issues.flatMap(x=>[x.label,x.reason]),...d.supported.flatMap(x=>[x.label,x.reason])]) {
  assert.ok(value.en); assert.ok(value.hi); assert.notEqual(value.en,value.hi);
 }
};

test('selection diagnosis names every wrong and missing selection with authored reasons',()=>{
 const d=diagnose(select,['bad','worse']);
 assert.equal(d.complete,true); assert.equal(d.correct,false);
 assert.deepEqual(new Set(d.issues.map(x=>x.id)),new Set(['bad','worse','missing-good','missing-also']));
 assert.match(d.submitted.en,/bad label/); assert.match(d.submitted.hi,/हिंदी bad label/);
 assert.match(d.summary.en,/incorrect/i); assert.match(d.summary.hi,/गलत/);
 assert.equal(d.issues.find(x=>x.id==='bad').reason.en,'bad authored reason'); bilingual(d);
 const partial=diagnose(select,['good','bad']);
 assert.ok(partial.supported.some(x=>x.id==='good')); assert.equal(partial.correct,api.evaluateTask(select,['good','bad']).correct);
});

test('unfilled controls prompt completion while numeric zero is a complete answer',()=>{
 const number={...base,kind:'number',fields:[{id:'total',label:l('Total'),answer:0,explanation:l('Count both groups')}]};
 for (const answer of [{},{total:''},{total:' '}]) { const d=diagnose(number,answer); assert.equal(d.complete,false); assert.equal(d.correct,false); assert.match(d.next.en,/enter|fill|complete/i); }
 assert.equal(diagnose(number,{total:'0'}).correct,true);
 const wrong=diagnose(number,{total:'2'}); assert.equal(wrong.complete,true); assert.match(wrong.submitted.en,/Total: 2/); assert.equal(wrong.issues[0].reason.en,'Count both groups');
 const choice={...base,kind:'choice',options:[option('safe'),option('risk')],correct:'safe'};
 assert.equal(diagnose(choice,'').complete,false);
 const d=diagnose(choice,'risk'); assert.match(d.submitted.en,/risk label/); assert.equal(d.issues[0].reason.en,'risk authored reason'); bilingual(d);
 assert.equal(diagnose(select,[]).complete,false);
});

test('match diagnosis explains all bad rows and names the submitted labels',()=>{
 const task={...base,kind:'match',rows:['reader','editor'].map(id=>({id,label:l(id),answer:id,explanation:l(`${id} permissions reason`)})),options:['reader','editor'].map(option)};
 assert.equal(diagnose(task,{reader:'editor'}).complete,false);
 const d=diagnose(task,{reader:'editor',editor:'reader'});
 assert.equal(d.issues.length,2); assert.match(d.submitted.en,/reader: editor label/); assert.equal(d.issues[1].reason.en,'editor permissions reason'); bilingual(d);
});

test('order diagnosis names the misplaced step, its required predecessor and authored dependency',()=>{
 const task={...base,kind:'order',items:['verify','act'].map(option),expected:['verify','act'],stepReasons:[l('Verify before acting'),l('Act only after verification')]};
 assert.equal(diagnose(task,['verify']).complete,false);
 const d=diagnose(task,['act','verify']);
 assert.equal(d.correct,false); assert.equal(d.issues.length,2); assert.match(d.issues[0].label.en,/act label/); assert.match(d.issues[1].reason.en,/Act only after verification/); assert.match(d.issues[1].reason.en,/verify label/); bilingual(d);
});

const route={...base,kind:'route',width:3,height:2,start:0,goal:2,blocked:[],maxSteps:6,cellCosts:{0:9,1:3,2:2},maxCost:5};
test('weighted routes charge every entered cell including revisits and leave the start free',()=>{
 assert.equal(api.simulateRoute(route,[]).cost,0);
 assert.equal(api.simulateRoute(route,['right','left','right','right']).cost,17);
 assert.equal(api.simulateRoute(route,['right','up']).cost,3);
 assert.equal(api.simulateRoute({...route,cellCosts:undefined},['down','right','up','right']).cost,4);
 assert.equal(api.evaluateTask(route,['right','right']).correct,true);
 assert.equal(api.evaluateTask(route,['right','left','right','right']).correct,false);
 assert.equal(api.evaluateTask({...route,maxCost:undefined},['right','left','right','right']).correct,true);
});
test('route evidence and diagnosis retain actual cost and budget',()=>{
 const answer=['right','left','right','right'];
 const d=diagnose(route,answer); assert.equal(d.complete,true); assert.equal(d.correct,false);
 const cost=d.issues.find(x=>x.id==='cost'); assert.ok(cost); assert.match(cost.reason.en,/17/); assert.match(cost.reason.en,/5/); bilingual(d);
 const lines=api.buildTaskEvidence(route,answer); assert.ok(lines.some(x=>x.label.en==='Route cost'&&x.value.en==='17')); assert.ok(lines.some(x=>x.label.en==='Cost budget'&&x.value.en==='5'));
});
test('model diagnosis names abstention and preserves training and test values',()=>{
 const task={...base,kind:'model',feature:l('Size'),labels:['a','b'].map(option),examples:[{id:'a0',value:0,label:'a'},{id:'b2',value:2,label:'b'}],tests:[{id:'test1',value:1,expected:'a'}],initialTraining:[],minimumCorrect:1};
 assert.equal(diagnose(task,[]).complete,false);
 const d=diagnose(task,['a0','b2']); assert.equal(d.complete,true); assert.equal(d.correct,false); assert.match(d.submitted.en,/a0: 0/); assert.match(d.issues[0].label.en,/test1.*1/); assert.match(d.issues[0].reason.en,/abstain|uncertain|conflict/i); bilingual(d);
});
test('binary and grid diagnoses preserve actual work and validator authority',()=>{
 const binary={...base,kind:'binary',bits:8,target:3};
 const d=diagnose(binary,'00000001'); assert.match(d.submitted.en,/00000001/); assert.match(d.issues[0].reason.en,/1.*3/); bilingual(d);
 const grid={...base,kind:'grid',width:2,height:2,expected:[0,3],caption:l('Choose'),blocked:[1]};
 const g=diagnose(grid,[0,1]); assert.ok(g.issues.some(x=>x.id==='1')); assert.ok(g.issues.some(x=>x.id==='missing-3')); assert.ok(g.supported.some(x=>x.id==='0')); assert.equal(g.correct,api.evaluateTask(grid,[0,1]).correct); bilingual(g);
});

test('only complete checks emit bounded, lossless bilingual evidence and diagnosis',()=>{
 assert.equal(typeof api.recordTaskEvidence,'function');
 const events=[]; const track=(type,payload)=>events.push({type,payload});
 const choice={...base,kind:'choice',options:[option('safe'),{...option('risk'),feedback:l('अ'.repeat(2200),'क'.repeat(2200))}],correct:'safe'};
 const incomplete=api.recordTaskEvidence(choice,'',track,'Decision'); assert.equal(incomplete.complete,false); assert.equal(events.length,0);
 const diagnosis=api.recordTaskEvidence(choice,'risk',track,'Decision'); assert.equal(diagnosis.correct,false); assert.ok(events.length>1);
 for(const event of events) { assert.equal(event.type,'story_feedback'); assert.ok(JSON.stringify(event.payload).length<2000); assert.equal(event.payload.evidence,true); assert.equal(event.payload.correct,false); }
 const text=events.map(x=>x.payload.feedback).join(''); assert.match(text,/risk label/); assert.match(text,/हिंदी risk label/); assert.ok(text.includes('अ'.repeat(2200))); assert.match(text,/incorrect/);
});

test('grid diagnosis uses each cell reason for wrong, missing and supported cells',()=>{
 const grid={...base,kind:'grid',width:2,height:2,expected:[1,3],caption:l('Select the bright stripe'),cellReasons:{
  0:l('Brightness 20 is below the required 80 threshold','चमक 20 ज़रूरी 80 सीमा से कम है'),
  1:l('Brightness 90 belongs to the required stripe','चमक 90 ज़रूरी पट्टी का हिस्सा है'),
  3:l('Brightness 100 belongs to the required stripe','चमक 100 ज़रूरी पट्टी का हिस्सा है'),
 }};
 const d=diagnose(grid,[0,3]);
 assert.equal(d.issues.find(x=>x.id==='0').reason.en,grid.cellReasons[0].en);
 assert.equal(d.issues.find(x=>x.id==='missing-1').reason.hi,grid.cellReasons[1].hi);
 assert.equal(d.supported.find(x=>x.id==='3').reason.en,grid.cellReasons[3].en);
 assert.equal(d.correct,false);
});
