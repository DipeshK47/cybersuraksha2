import test from 'node:test';
import assert from 'node:assert/strict';
import {loadSource} from './class-9-helpers.mjs';
const api=await loadSource(`export {class10CtChapters} from './app/data/class10/ct'; export * from './app/module/cyber/lessons/class10/motion-state'; export {simulateRoute,evaluateTask} from './app/module/cyber/lessons/class8/task-evaluation';`);
const chapter=api.class10CtChapters.at(-1),visual=chapter.visual;
const endpoint=id=>{const v=visual.exploration.variants.find(v=>v.id===id);return api.manualFrame(visual,v.scene,v.step);};
test('direct Path A/B exploration resolves a complete coherent endpoint without playback history',()=>{
 for(const [id,cost] of [['alternative-a',12],['alternative-b',14]]) {
  const f=endpoint(id),marker=f.nodes.find(n=>n.id==='marker');
  assert.equal(marker.x,85,'final tally must place marker at goal 11');assert.equal(marker.y,70);
  assert.equal(f.route.entry.cell,11);assert.equal(f.route.entry.cost,cost);assert.equal(f.route.entry.moves,9);
  assert.deepEqual(f.route.entry.stops,[2,8]);assert.equal(f.route.passed,true);
 }
});
test('every authored route frame derives each entered cell and cumulative charge from the production simulator',()=>{
 for(const scene of visual.scenes)for(const step of scene.steps){
  assert.ok(step.route,'all route scenes expose the complete grid and actual route');
  const {task,moves}=step.route,actual=api.simulateRoute(task,moves);
  const f=api.manualFrame(visual,visual.scenes.indexOf(scene),scene.steps.indexOf(step));
  const successful=f.route.entries.filter(row=>!row.failed);
  assert.deepEqual(successful.map(row=>row.cell),actual.path);
  successful.forEach((row,i)=>{const prefix=api.simulateRoute(task,moves.slice(0,i));assert.equal(row.cell,prefix.position);assert.equal(row.cost,prefix.cost);assert.equal(row.charge,i?prefix.cost-successful[i-1].cost:0);});
 }
});
test('repeat entries recharge, returning to start recharges, and changed costs come from actual task data',()=>{
 const b=endpoint('alternative-b').route;assert.deepEqual(b.entries.filter(e=>e.cell===6).map(e=>e.charge),[3,3]);
 const changed=api.manualFrame(visual,5,2).route;assert.equal(changed.task.cellCosts['6'],4);assert.equal(changed.entry.cost,16);assert.equal(changed.passed,false);
 const task=chapter.tasks.find(t=>t.kind==='route');const custom=structuredClone(visual);custom.scenes[0].steps[0].route={id:'return',label:{en:'Return',hi:'वापसी'},task,moves:['right','left'],from:0,to:2};
 const r=api.manualFrame(custom,0,0).route;assert.deepEqual(r.entries.map(e=>e.cost),[0,1,2]);
});
test('illegal move stops at previous cell without a charge or later route entries',()=>{
 const f=endpoint('closure').route;assert.equal(f.entry.failed,true);assert.equal(f.entry.cell,1);assert.equal(f.entry.cost,1);assert.equal(f.entry.charge,0);assert.equal(f.entry.failedAt,2);assert.equal(f.entries.length,3);
});
test('narration/replay samples visit every entry in order; backward seeks are deterministic',()=>{
 for(const [scene,step] of [[1,0],[1,1],[4,0],[4,1],[4,2]]){
  const boundaries=api.stepBoundaries(visual.scenes[scene].steps.length),start=boundaries[step],end=boundaries[step+1]??1;
  const spec=visual.scenes[scene].steps[step].route;assert.ok(spec);
  const seen=[];for(let i=0;i<1000;i++){const f=api.resolveVisualFrame(visual,scene,start+(end-start)*i/1000);if(seen.at(-1)!==f.route.index)seen.push(f.route.index);assert.equal(f.route.entry,f.route.entries[f.route.index]);}
  assert.deepEqual(seen,Array.from({length:spec.to-spec.from+1},(_,i)=>spec.from+i));
 }
 const original=api.resolveVisualFrame(visual,1,.2);api.resolveVisualFrame(visual,5,1);assert.deepEqual(api.resolveVisualFrame(visual,1,.2),original);
});
test('route frame data cannot mutate authored route rules or subsequent frames',()=>{
 const before=structuredClone(visual),f=endpoint('alternative-a');
 f.route.task.cellCosts['6']=100;f.route.moves.push('up');f.route.label.en='Changed';
 assert.deepEqual(visual,before);
});
