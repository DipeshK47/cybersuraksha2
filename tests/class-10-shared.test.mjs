import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { build } from 'esbuild';
import { loadSource, root } from './class-9-helpers.mjs';

const api = await loadSource(`export * from './app/module/cyber/lessons/class8/task-evaluation';`);
const l = en => ({ en, hi: `हिंदी ${en}` });
const base = { prompt:l('Decide'), context:l('Evidence'), success:l('Correct'), correction:l('Review evidence'), hint:l('Compare the source') };
const schedule = { ...base, kind:'order', items:[['A','source'],['B','caption'],['C','preview'],['D','publish']].map(([id,label])=>({id,label:l(label)})), expected:['A','B','C','D'], prerequisites:[{before:'A',after:'C',reason:l('Preview requires the source')},{before:'B',after:'C',reason:l('Preview requires captions')},{before:'C',after:'D',reason:l('Publish only after preview')}] };

test('dependency schedules accept independent permutations while exact orders retain their semantics',()=>{
 assert.equal(api.evaluateTask(schedule,['B','A','C','D']).correct,true);
 for(const answer of [['C','A','B','D'],['A','B','C','C'],['A','B','C'],['A','B','C','unknown']]) assert.equal(api.evaluateTask(schedule,answer).correct,false);
 assert.equal(api.evaluateTask({...schedule,prerequisites:undefined},['B','A','C','D']).correct,false);
});
test('dependency diagnosis names actual violated edges, missing, duplicate and unknown IDs bilingually',()=>{
 const valid=api.diagnoseTask(schedule,['B','A','C','D']); assert.equal(valid.correct,true); assert.equal(valid.issues.length,0);
 const bad=api.diagnoseTask(schedule,['C','A','B','D']); assert.equal(bad.complete,true); assert.equal(bad.issues.filter(x=>x.id.startsWith('edge-')).length,2);
 assert.match(bad.issues[0].label.en,/source.*preview/); assert.match(bad.issues[0].reason.en,/requires the source/);
 const duplicate=api.diagnoseTask(schedule,['A','B','C','C']); assert.ok(duplicate.issues.some(x=>x.id==='duplicate-C')); assert.ok(duplicate.issues.some(x=>x.id==='missing-D'));
 const missing=api.diagnoseTask(schedule,['A','B','C']); assert.equal(missing.complete,false); assert.ok(missing.issues.some(x=>x.id==='missing-D'));
 const unknown=api.diagnoseTask(schedule,['A','B','C','oops']); assert.ok(unknown.issues.some(x=>x.id==='unknown-oops'));
 for(const d of [bad,duplicate,missing,unknown]) for(const issue of d.issues) { assert.ok(issue.reason.en); assert.ok(issue.reason.hi); assert.notEqual(issue.reason.en,issue.reason.hi); }
});

const simulationPath='app/module/cyber/lessons/class8/task-simulation.ts';
const simulation=existsSync(root+simulationPath) ? await loadSource(`export * from './${simulationPath}';`) : {};
const route={...base,kind:'route',width:3,height:2,start:0,goal:2,blocked:[],maxSteps:6,cellCosts:{0:9,1:3,2:2},maxCost:5};
const model={...base,kind:'model',feature:l('Size'),labels:[{id:'a',label:l('A')},{id:'b',label:l('B')}],examples:[{id:'a0',value:0,label:'a'},{id:'b2',value:2,label:'b'}],tests:[{id:'t1',value:1,expected:'a'}],initialTraining:[],minimumCorrect:1};
const permissions={...base,kind:'match',presentation:'permissions',rows:[{id:'reader',label:l('Reader'),answer:'read',explanation:l('Read only')}],options:[{id:'read',label:l('Read')}],simulation:[{label:l('Try editing'),checks:[{rowId:'reader',allowedAnswers:['edit']}],allowed:l('Editing allowed'),denied:l('Editing blocked')}]};
for(const [kind,task,input,run] of [['route',route,['right','left','right','right'],api.simulateRoute],['model',model,['a0','b2'],api.testModel],['permissions',permissions,{reader:'read'},api.testPermissions]]) {
 test(`${kind} snapshot contains the actual evaluator result, immutable answer and consistent fingerprint`,()=>{
  assert.equal(typeof simulation.makeTaskSimulation,'function');
  const supplied=structuredClone(task), answer=structuredClone(input), expected=structuredClone(run(supplied,answer));
  const snapshot=simulation.makeTaskSimulation(supplied,answer);
  assert.equal(snapshot.kind,kind); assert.equal(snapshot.fingerprint,JSON.stringify(answer)); assert.deepEqual(snapshot.answer,answer); assert.deepEqual(snapshot.result,expected);
  if(Array.isArray(answer)) answer.push('changed'); else answer.reader='edit';
  if(kind==='model') supplied.tests[0].value=999;
  if(kind==='permissions') {supplied.simulation[0].label.en='changed'; supplied.simulation[0].denied.hi='changed';}
  if(kind==='route') supplied.cellCosts['1']=999;
  assert.deepEqual(snapshot.answer,input); assert.deepEqual(snapshot.result,expected); assert.equal(snapshot.fingerprint,JSON.stringify(input));
  assert.ok(Object.isFrozen(snapshot)); assert.ok(Object.isFrozen(snapshot.answer)); assert.ok(Object.isFrozen(snapshot.result));
 });
}
test('only simulation task kinds with matching answer shapes produce snapshots',()=>{
 assert.equal(typeof simulation.makeTaskSimulation,'function');
 for(const [task,answer] of [[schedule,['A','B','C','D']],[route,{}],[model,'a0'],[permissions,[]],[{...permissions,presentation:'match'},{reader:'read'}]]) assert.equal(simulation.makeTaskSimulation(task,answer),null);
});

test('shared visual slots preserve decision and practice controls and report current tested snapshots',()=>{
 const story=readFileSync(root+'app/module/cyber/lessons/class8/Class8Stories.tsx','utf8');
 const lesson=readFileSync(root+'app/module/cyber/lessons/class8/Class8Lesson.tsx','utf8');
 const board=readFileSync(root+'app/module/cyber/lessons/class8/TaskBoard.tsx','utf8');
 assert.match(story,/Explanation\?:/); assert.match(story,/<Explanation[^>]*chapter=\{chapter\}/); assert.match(story,/<TaskBoard/); assert.match(story,/<FeedbackPanel/);
 assert.match(lesson,/export type StructuredPracticeVisualProps/); assert.match(lesson,/<PracticeVisual/); assert.match(lesson,/onSimulationChange=/);
 assert.match(board,/makeTaskSimulation\(task, answer\)/); assert.match(board,/simulationListener.current\?\./); assert.match(board,/useEffect/);
});
test('story player provides a memoized audio clock and captures exact pause time',()=>{
 const player=readFileSync(root+'app/module/cyber/lessons/new/story/StoryPlayer.tsx','utf8');
 const types=readFileSync(root+'app/module/cyber/lessons/new/story/types.ts','utf8');
 assert.match(types,/export type StoryMediaClock/); assert.match(types,/media\?: StoryMediaClock/);
 assert.match(player,/if \(!audio.current \|\| audioUnavailable \|\| audio.current.readyState === 0\) return/);
 assert.match(player,/useMemo/); assert.match(player,/readElapsed/); assert.match(player,/media=\{media\}/); assert.match(player,/onPause=\{[^}]*trackAudio\(\)/);
});

const clockBundle = await build({stdin:{contents:`export { createStoryMediaClock } from './app/module/cyber/lessons/new/story/StoryPlayer';`,resolveDir:root,loader:'ts'},bundle:true,platform:'node',format:'esm',write:false,loader:{'.css':'empty','.module.css':'empty'},logLevel:'silent'});
const clockApi=await loadSource(clockBundle.outputFiles[0].text);
test('scene clock reads actual audio time, clamps scene duration and locked gate, and delegates controls',()=>{
 assert.equal(typeof clockApi.createStoryMediaClock,'function');
 let time=13, limit=Infinity, paused=0, resumed=0;
 const clock=clockApi.createStoryMediaClock({start:10,duration:8,readTime:()=>time,readLimit:()=>limit,pause:()=>paused++,resume:()=>resumed++});
 assert.equal(clock.duration,8); assert.equal(clock.readElapsed(),3);
 time=30; assert.equal(clock.readElapsed(),8); time=5; assert.equal(clock.readElapsed(),0);
 time=30; limit=15.95; assert.ok(Math.abs(clock.readElapsed()-5.95)<1e-9);
 clock.pause(); clock.resume(); assert.equal(paused,1); assert.equal(resumed,1);
});

// A minimal hook host lets us exercise the actual TaskBoard handlers/effects without a DOM dependency.
const hooks = `let slots=[],cursor=0,pending=[],dirty=false;
export function begin(){cursor=0;pending=[];dirty=false;}
export function useState(initial){const i=cursor++;if(!(i in slots))slots[i]=typeof initial==='function'?initial():initial;return [slots[i],value=>{const next=typeof value==='function'?value(slots[i]):value;if(!Object.is(next,slots[i])){slots[i]=next;dirty=true;}}];}
export function useRef(initial){const i=cursor++;return slots[i]??(slots[i]={current:initial});}
export function useEffect(effect,deps){const i=cursor++,old=slots[i];if(!old||!deps||deps.some((v,j)=>!Object.is(v,old.deps?.[j])))pending.push(()=>{old?.cleanup?.();slots[i]={deps,cleanup:effect()};});}
export function flush(){for(const effect of pending)effect();return dirty;}
export function unmount(){for(const slot of slots)slot?.cleanup?.();slots=[];}
export const jsx=(type,props)=>({type,props});export const jsxs=jsx;export const Fragment='fragment';`;
const boardBundle=await build({stdin:{contents:`export { TaskBoard } from './app/module/cyber/lessons/class8/TaskBoard'; export {begin,flush,unmount} from 'test-hooks';`,resolveDir:root,loader:'ts'},bundle:true,platform:'node',format:'esm',write:false,jsx:'automatic',loader:{'.module.css':'empty'},logLevel:'silent',plugins:[{name:'hook-host',setup(builder){
 builder.onResolve({filter:/^(react|react\/jsx-runtime|test-hooks)$/},()=>({path:'hooks',namespace:'fixture'}));
 builder.onLoad({filter:/.*/,namespace:'fixture'},()=>({contents:hooks,loader:'js'}));
 builder.onResolve({filter:/^lucide-react$/},()=>({path:'icons',namespace:'icons'}));
 builder.onLoad({filter:/.*/,namespace:'icons'},()=>({contents:'export const ArrowDown="icon",ArrowLeft="icon",ArrowRight="icon",ArrowUp="icon",Check="icon",FlaskConical="icon",RotateCcw="icon";',loader:'js'}));
 builder.onLoad({filter:/class8\/ui.ts$/},args=>({contents:readFileSync(args.path,'utf8').split('export function useEvidenceLanguage')[0]+'export function useEvidenceLanguage(){return "en";}',loader:'ts'}));
}}]});
const boardApi=await loadSource(boardBundle.outputFiles[0].text);
function elements(tree){if(!tree||typeof tree!=='object')return [];if(Array.isArray(tree))return tree.flatMap(elements);return [tree,...elements(tree.props?.children)];}
function containsText(tree,text){if(Array.isArray(tree))return tree.some(x=>containsText(x,text));if(typeof tree==='string')return tree===text;return tree&&typeof tree==='object'&&containsText(tree.props?.children,text);}
test('TaskBoard exports only the current test and invalidates edits, configuration changes and keyed remounts',()=>{
 let answer=['right','right'],task=structuredClone(route),reports=[],checks=0,tree;
 const render=()=>{for(let attempts=0;attempts<10;attempts++){boardApi.begin();tree=boardApi.TaskBoard({task,answer,onChange:value=>{answer=value;},onCheck:()=>checks++,onSimulationChange:value=>reports.push(value)});if(!boardApi.flush())return;}assert.fail('effect caused a render loop');};
 const button=text=>elements(tree).find(node=>node.type==='button'&&containsText(node,text));
 render(); assert.equal(reports.at(-1),null); assert.equal(button('Check my evidence').props.disabled,true);
 button('Run the test').props.onClick();render();assert.equal(reports.at(-1).kind,'route');assert.deepEqual(reports.at(-1).result,api.simulateRoute(task,answer));assert.equal(button('Check my evidence').props.disabled,false);
 const count=reports.length;render();assert.equal(reports.length,count,'changing callback identity must not report repeatedly');
 button('Check my evidence').props.onClick();assert.equal(checks,1);
 button('Undo last step').props.onClick();render();assert.equal(reports.at(-1),null);assert.equal(button('Check my evidence').props.disabled,true);
 answer=['right','right'];render();assert.equal(button('Check my evidence').props.disabled,true,'restoring an old answer requires another test');
 button('Run the test').props.onClick();render();task={...task,maxCost:1};render();assert.equal(reports.at(-1),null);assert.equal(button('Check my evidence').props.disabled,true);
 button('Run the test').props.onClick();render();assert.equal(reports.at(-1).kind,'route');boardApi.unmount();assert.equal(reports.at(-1),null);
 render();assert.equal(button('Check my evidence').props.disabled,true);boardApi.unmount();
});
