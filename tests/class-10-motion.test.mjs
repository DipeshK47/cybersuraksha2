import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {loadSource,root} from './class-9-helpers.mjs';
const path='app/module/cyber/lessons/class10/motion-state.ts';
const api=existsSync(root+path)?await loadSource(`export * from './${path}';`):{};
const l=en=>({en,hi:`हिंदी ${en}`});
const steps=[
 {label:l('Inspect'),description:l('One record arrives'),active:['a'],moves:[{id:'a',x:30,y:35}],values:{a:l('1')},hidden:['c'],activeEdges:['ab']},
 {label:l('Compare'),description:l('Two records differ'),active:['b'],warning:['a'],moves:[{id:'a',x:60,y:50},{id:'b',x:70,y:55}],values:{b:l('2')}},
 {label:l('Record'),description:l('Three records reviewed'),active:['c'],complete:['b'],moves:[{id:'c',x:80,y:70}],values:{c:l('3')},activeEdges:['bc']}
];
const visual={layout:'flow',nodes:[{id:'a',label:l('A'),value:l('base'),x:15,y:20},{id:'b',label:l('B'),x:50,y:50},{id:'c',label:l('C'),x:80,y:80}],edges:[{id:'ab',from:'a',to:'b'},{id:'bc',from:'b',to:'c'}],scenes:Array.from({length:6},()=>({steps:structuredClone(steps)})),exploration:{title:l('Try'),prompt:l('Compare'),variants:[{id:'one',label:l('One'),scene:0,step:0},{id:'two',label:l('Two'),scene:1,step:2}]}};
function resolver(){assert.equal(typeof api.resolveVisualFrame,'function');return api.resolveVisualFrame;}
test('three-node scene has distinct start, middle and end positions and semantics',()=>{
 const resolve=resolver(); const frames=[0,.6,1].map(p=>resolve(visual,0,p));
 assert.equal(new Set(frames.map(api.visualSignature)).size,3);
 assert.deepEqual(frames.map(f=>f.step),[0,1,2]);
 assert.equal(frames[0].nodes[0].x,15);assert.ok(frames[1].nodes[0].x>30&&frames[1].nodes[0].x<60);
 assert.equal(frames[2].nodes[2].y,70);assert.equal(frames[2].nodes[2].value.en,'3');
});
test('seeking backward is deterministic and each scene starts independently',()=>{
 const resolve=resolver(), original=resolve(visual,0,.56);resolve(visual,5,1);resolve(visual,0,.99);
 assert.deepEqual(resolve(visual,0,.56),original);assert.deepEqual(resolve(visual,1,0).nodes,resolve(visual,0,0).nodes);
});
test('scene/progress/step clamp safely and reset returns the initial frame',()=>{
 const resolve=resolver();assert.deepEqual(resolve(visual,-99,-1),resolve(visual,0,0));assert.deepEqual(resolve(visual,999,9),resolve(visual,5,1));
 assert.deepEqual(resolve(visual,NaN,NaN),resolve(visual,0,0));assert.deepEqual(api.manualFrame(visual,0,99),api.manualFrame(visual,0,2));
 resolve(visual,0,.8);assert.equal(resolve(visual,0,0).nodes[0].x,15);
});
test('each manual step fully overrides base values, visibility and status without leakage',()=>{
 resolver();const one=api.manualFrame(visual,0,0),two=api.manualFrame(visual,0,1),three=api.manualFrame(visual,0,2);
 assert.equal(one.nodes[2].hidden,true);assert.equal(two.nodes[2].hidden,false);assert.equal(two.nodes[0].value.en,'base');
 assert.equal(two.nodes[0].status,'warning');assert.equal(three.nodes[0].status,'idle');assert.equal(three.nodes[0].x,15);
 assert.equal(two.nodes[1].x,70);assert.equal(three.nodes[1].x,50);assert.equal(three.edges[0].active,false);
});
test('three/four step boundaries follow authored timeline',()=>{
 const resolve=resolver();assert.deepEqual([.449,.45,.849,.85].map(p=>resolve(visual,0,p).step),[0,1,1,2]);
 const four=structuredClone(visual);four.scenes[0].steps.push({...steps[2],label:l('Fourth')});
 assert.deepEqual([.299,.3,.599,.6,.849,.85,1].map(p=>resolve(four,0,p).step),[0,1,1,2,2,3,3]);
});
test('frames and caller mutations do not alter authored data or other frames',()=>{
 const resolve=resolver(),before=structuredClone(visual),a=resolve(visual,0,.6),b=resolve(visual,0,.6);
 a.nodes[0].label.en='mutated';a.nodes[0].value.en='mutated';a.label.en='mutated';a.edges[0].from='changed';
 assert.deepEqual(visual,before);assert.deepEqual(b,resolve(visual,0,.6));
});

// Execute the real component handlers/effects with controlled RAF and narration clocks.
const {build}=await import('esbuild');
const hooks=`let slots=[],cursor=0,pending=[],dirty=false;
const scopes=new Map();let active=new Set();
export let language='en';export function setLanguage(value){language=value;}
export function renderRoot(Component,props){active.add(Component);const previous=slots,index=cursor;slots=scopes.get(Component)??[];scopes.set(Component,slots);cursor=0;let tree=Component(props);slots=previous;cursor=index;if(typeof tree?.type==='function')tree=renderRoot(tree.type,tree.props);return tree;}
export function begin(){cursor=0;pending=[];dirty=false;active=new Set();}
export function useState(initial){const state=slots,i=cursor++;if(!(i in state))state[i]=typeof initial==='function'?initial():initial;return [state[i],value=>{const next=typeof value==='function'?value(state[i]):value;if(!Object.is(next,state[i])){state[i]=next;dirty=true;}}];}
export function useRef(initial){const i=cursor++;return slots[i]??(slots[i]={current:initial});}
export function useId(){return 'id-'+cursor++;}
export function useEffect(effect,deps){const state=slots,i=cursor++,old=state[i];if(!old||!deps||deps.some((v,j)=>!Object.is(v,old.deps?.[j])))pending.push(()=>{old?.cleanup?.();state[i]={deps,cleanup:effect()};});}
export const useLayoutEffect=useEffect;
export function useCallback(callback,deps){const i=cursor++,old=slots[i];if(!old||deps.some((v,j)=>!Object.is(v,old.deps[j])))slots[i]={deps,value:callback};return slots[i].value;}
export function useMemo(factory,deps){const i=cursor++,old=slots[i];if(!old||deps.some((v,j)=>!Object.is(v,old.deps[j])))slots[i]={deps,value:factory()};return slots[i].value;}
export function useSyncExternalStore(subscribe,getSnapshot){const [,update]=useState(0);const snapshot=getSnapshot();useEffect(()=>{let previous=snapshot;const check=()=>{const next=getSnapshot();if(!Object.is(previous,next)){previous=next;update(n=>n+1);}};const unsubscribe=subscribe(check);check();return unsubscribe;},[subscribe,getSnapshot]);return snapshot;}
export function flush(){if(dirty)return true;for(const [component,scope] of scopes)if(!active.has(component)){for(const slot of scope)slot?.cleanup?.();scopes.delete(component);}for(const effect of pending)effect();return dirty;}
export function unmount(){for(const slot of slots)slot?.cleanup?.();for(const scope of scopes.values())for(const slot of scope)slot?.cleanup?.();scopes.clear();slots=[];}
export const jsx=(type,props)=>({type,props});export const jsxs=jsx;export const Fragment='fragment';`;
const bundle=await build({stdin:{contents:`export {SceneExplanation} from './app/module/cyber/lessons/class10/SceneExplanation'; export {PracticeTrace,practiceTraceRows} from './app/module/cyber/lessons/class10/PracticeTrace'; export {ConceptDiagram} from './app/module/cyber/lessons/class10/ConceptDiagram'; export {RouteExplanation} from './app/module/cyber/lessons/class10/RouteExplanation'; export {begin,flush,unmount,renderRoot,setLanguage} from 'test-hooks';`,resolveDir:root,loader:'ts'},bundle:true,platform:'node',format:'esm',write:false,jsx:'automatic',loader:{'.module.css':'empty'},logLevel:'silent',plugins:[{name:'hook-host',setup(builder){
 builder.onResolve({filter:/^(react|react\/jsx-runtime|test-hooks)$/},()=>({path:'hooks',namespace:'fixture'}));
 builder.onLoad({filter:/.*/,namespace:'fixture'},()=>({contents:hooks,loader:'js'}));
 builder.onLoad({filter:/class8\/ui.ts$/},()=>({contents:'import {language} from "test-hooks"; export const ui={}; export function useEvidenceLanguage(){return language;}',loader:'ts'}));
}}]});
const components=await loadSource(bundle.outputFiles[0].text);
const simulation=await loadSource(`export * from './app/module/cyber/lessons/class8/task-simulation';`);
function elements(tree){if(!tree||typeof tree!=='object')return [];if(Array.isArray(tree))return tree.flatMap(elements);return [tree,...elements(tree.props?.children)];}
function harness(){let tree,props,Component;const callbacks=new Map(),events=new Map();let next=0;
 globalThis.document={hidden:false,addEventListener:(event,fn)=>{if(!events.has(event))events.set(event,new Set());events.get(event).add(fn);},removeEventListener:(event,fn)=>events.get(event)?.delete(fn)};
 globalThis.window={matchMedia:()=>({matches:false,addEventListener(){},removeEventListener(){}})};
 globalThis.requestAnimationFrame=fn=>{callbacks.set(++next,fn);return next;};globalThis.cancelAnimationFrame=id=>callbacks.delete(id);
 const render=()=>{for(let i=0;i<20;i++){components.begin();tree=components.renderRoot(Component,props);if(!components.flush())return tree;}assert.fail('render loop');};
 return {mount(component,initial){Component=component;props=initial;return render();},update(value){props={...props,...value};return render();},click(id){const button=elements(tree).find(node=>node.props?.['data-control']===id||node.props?.['data-variant']===id);assert.ok(button,`button ${id}`);assert.equal(!!button.props.disabled,false,`enabled ${id}`);button.props.onClick();return render();},frame(){return elements(tree).find(node=>node.type===components.ConceptDiagram)?.props.frame;},tree(){return tree;},tick(time){const queued=[...callbacks.values()];callbacks.clear();for(const callback of queued)callback(time);return render();},visibility(hidden){document.hidden=hidden;for(const callback of events.get('visibilitychange')??[])callback();return render();},pending(){return callbacks.size;},unmount(){components.unmount();assert.equal(callbacks.size,0);}};
}
const chapter={slug:'fixture',visual};
const baseProps={chapter,scene:0,playing:false,elapsed:0,solved:false,markSolved:()=>assert.fail('exploration advanced story gate'),setHint:()=>{},hint:'',reduced:false};
test('follow reads authoritative media between timeupdates; pause, backward seek and reset render actual frames',()=>{
 const host=harness();let time=2,paused=0,resumed=0;
 const media={duration:10,readElapsed:()=>time,pause:()=>paused++,resume:()=>resumed++};
 host.mount(components.SceneExplanation,{...baseProps,playing:true,media});host.tick(0);assert.equal(host.frame().progress,.2);
 time=6;host.tick(100);assert.equal(host.frame().progress,.6);assert.ok(host.frame().nodes[0].x>30);
 host.click('pause');host.update({playing:false});assert.equal(host.pending(),0);const frozen=host.frame();time=8;host.tick(1000);assert.deepEqual(host.frame(),frozen);
 host.click('reset');assert.equal(host.frame().nodes[0].x,15);assert.equal(host.frame().progress,0);
 time=1;host.click('follow');assert.equal(resumed,1);assert.equal(host.frame().progress,.1);assert.ok(paused>=2);host.unmount();
});
test('replay has its own pausable clock; manual steps and variants do not change the story gate',()=>{
 const host=harness();let paused=0;const media={duration:20,readElapsed:()=>12,pause:()=>paused++,resume(){}};
 host.mount(components.SceneExplanation,{...baseProps,media});host.click('replay');host.tick(0);host.tick(4000);assert.equal(host.frame().progress,.5);
 host.click('pause');const atPause=host.frame();host.tick(8000);assert.deepEqual(host.frame(),atPause);host.click('resume');host.tick(9000);host.tick(10000);assert.equal(host.frame().progress,.625);
 host.click('next');assert.deepEqual(host.frame(),api.manualFrame(visual,0,2));assert.equal(host.pending(),0);
 host.click('one');assert.deepEqual(host.frame(),api.manualFrame(visual,0,0));host.click('two');assert.deepEqual(host.frame(),api.manualFrame(visual,1,2));assert.equal(host.tree().props['data-scene'],0);
 host.update({playing:true});assert.equal(host.tree().props['data-mode'],'follow');assert.equal(host.frame().progress,.6);assert.ok(paused>=6);host.unmount();
});
test('hidden pages cancel motion and restoration follows audio; scene changes and reduced/no-audio modes reset controls',()=>{
 const host=harness();let time=2;const media={duration:10,readElapsed:()=>time,pause(){},resume(){}};
 host.mount(components.SceneExplanation,{...baseProps,playing:true,media});assert.ok(host.pending());host.visibility(true);assert.equal(host.pending(),0);
 time=7;host.visibility(false);assert.equal(host.frame().progress,.7);host.click('next');host.update({scene:2});assert.equal(host.tree().props['data-mode'],'follow');
 host.update({reduced:true});assert.equal(host.tree().props['data-mode'],'manual');assert.equal(host.pending(),0);host.click('next');assert.equal(host.frame().step,1);host.unmount();
 host.mount(components.SceneExplanation,baseProps);assert.equal(host.tree().props['data-mode'],'manual');host.click('next');assert.equal(host.frame().step,1);host.unmount();
});
const lbase={prompt:l('Task'),context:l('Context'),success:l('Success'),correction:l('Correction'),hint:l('Hint')};
const route={...lbase,kind:'route',width:3,height:2,start:0,goal:2,blocked:[3],maxSteps:8,cellCosts:{0:9,1:3,2:2}};
const model={...lbase,kind:'model',labels:[{id:'a',label:l('A')},{id:'b',label:l('B')}],examples:[{id:'a0',value:0,label:'a'},{id:'b2',value:2,label:'b'}],tests:[{id:'one',value:1,expected:'a'}],initialTraining:[],minimumCorrect:1};
const permissions={...lbase,kind:'match',presentation:'permissions',rows:[{id:'reader',label:l('Reader'),answer:'read',explanation:l('Only read')}],options:[{id:'read',label:l('Read')},{id:'edit',label:l('Edit')}],simulation:[{label:l('Attempt edit'),checks:[{rowId:'reader',allowedAnswers:['edit']}],allowed:l('Editing allowed'),denied:l('Editing denied')}]};
test('practice route trace uses actual path, repeat entry costs and stopped position, never expected route',()=>{
 const answer=['right','left','right','down','down'],snapshot=simulation.makeTaskSimulation(route,answer),rows=components.practiceTraceRows(route,answer,snapshot);
 assert.deepEqual(rows.map(row=>row.cell),snapshot.result.path);assert.deepEqual(rows.map(row=>row.cost),[0,3,12,15,16]);assert.equal(rows.at(-1).cell,4);assert.equal(snapshot.result.valid,false);
 assert.equal(components.practiceTraceRows(route,['right'],snapshot).some(row=>row.cell!==undefined),false,'outdated snapshot must not render tested mechanics');
});
test('model abstentions and permission outcomes come directly from actual test; drafts display selections',()=>{
 const answer=['a0','b2'];assert.equal(components.practiceTraceRows(model,answer,null).length,2);
 assert.match(components.practiceTraceRows(model,answer,simulation.makeTaskSimulation(model,answer))[0].value.en,/Abstained/);
 const denied={reader:'read'},allowed={reader:'edit'};
 assert.equal(components.practiceTraceRows(permissions,denied,null)[0].value.en,'Read');
 assert.equal(components.practiceTraceRows(permissions,denied,simulation.makeTaskSimulation(permissions,denied))[0].value.en,'Editing denied');
 assert.equal(components.practiceTraceRows(permissions,allowed,simulation.makeTaskSimulation(permissions,allowed))[0].value.en,'Editing allowed');
});
test('practice replay/steps move visible route position and edits invalidate tested state and reset replay',()=>{
 const host=harness(),answer=['right','right'];
 host.mount(components.PracticeTrace,{chapter,task:route,stage:0,answer,ready:false,simulation:simulation.makeTaskSimulation(route,answer)});
 const position=()=>elements(host.tree()).find(node=>node.props?.['data-route-position']!==undefined)?.props['data-route-position'];
 assert.equal(position(),0);host.click('trace-next');assert.equal(position(),1);host.click('trace-replay');host.tick(0);host.tick(950);assert.equal(position(),1);
 host.click('trace-pause');assert.equal(host.pending(),0);host.click('trace-resume');host.tick(1000);host.tick(2000);assert.equal(position(),2);
 host.update({answer:['right'],simulation:null});assert.equal(host.tree().props['data-trace-state'],'outdated');assert.equal(host.tree().props['data-trace-step'],0);assert.equal(position(),undefined);assert.equal(host.pending(),0);
 host.update({stage:1});assert.equal(host.tree().props['data-trace-state'],'draft');host.unmount();
});
test('rendered diagram positions and states match frames, with full readable HTML labels',()=>{
 components.begin();const frame=api.manualFrame(visual,0,1),tree=components.ConceptDiagram({frame});components.flush();
 const nodes=elements(tree).filter(node=>node.props?.['data-node-id']);assert.equal(nodes.length,3);assert.equal(nodes[0].props.transform,'translate(360 180)');assert.equal(nodes[0].props['data-status'],'warning');
 assert.equal(elements(tree).filter(node=>node.props?.['data-legend-node']).length,3);components.unmount();
});
test('paused narration seeks update the diagram without starting a local timer',()=>{
 const host=harness();let time=8;const media={duration:10,readElapsed:()=>time,pause(){},resume(){}};
 host.mount(components.SceneExplanation,{...baseProps,media,elapsed:8});assert.equal(host.frame().progress,.8);
 time=2;host.update({elapsed:2});assert.equal(host.frame().progress,.2);assert.equal(host.pending(),0);host.unmount();
});
test('hidden node keeps the same numbered identity in the SVG and HTML legend',()=>{
 const changed=structuredClone(visual);changed.scenes[0].steps[0].hidden=['a'];components.begin();const tree=components.ConceptDiagram({frame:api.manualFrame(changed,0,0)});components.flush();
 const node=elements(tree).find(node=>node.props?.['data-node-id']==='b');assert.equal(elements(node).find(node=>node.type==='text').props.children,2);components.unmount();
});
const ct=await loadSource(`export {class10CtChapters} from './app/data/class10/ct';`);
const routeChapter=ct.class10CtChapters.at(-1);
test('selected route replay starts its own actual path; pause, resume, inspection and reduced motion preserve every entry',()=>{
 const host=harness();host.mount(components.SceneExplanation,{...baseProps,chapter:routeChapter});
 host.click('alternative-b');assert.equal(host.frame().route.entry.cell,11);
 host.click('replay');assert.equal(host.frame().route.id,'path-b');assert.equal(host.frame().route.entry.cell,0);
 host.tick(0);host.tick(4100);assert.equal(host.frame().route.entry.cell,6);assert.equal(host.frame().route.entry.cost,7);
 host.click('pause');const frozen=host.frame().route;host.tick(6000);assert.deepEqual(host.frame().route,frozen);
 host.click('resume');host.tick(7000);host.tick(8000);assert.equal(host.frame().route.entry.cell,2);
 host.click('route-entry-7');assert.equal(host.frame().route.entry.cell,6);assert.equal(host.frame().route.entry.cost,12);assert.equal(host.pending(),0);
 host.update({reduced:true});assert.equal(host.pending(),0);host.click('alternative-b');host.click('route-entry-5');assert.equal(host.frame().route.entry.cost,7);
 host.unmount();
});

test('the rendered route grid, marker and every visible counter match actual simulator entries',()=>{
 for(let scene=0;scene<6;scene++)for(let sample=0;sample<=100;sample++){
  const frame=api.resolveVisualFrame(routeChapter.visual,scene,sample/100),route=frame.route;
  components.begin();const tree=components.RouteExplanation({frame});components.flush();const all=elements(tree);
  assert.equal(all.filter(n=>n.props?.['data-route-cell']!==undefined).length,12);
  const marker=all.find(n=>n.props?.['data-route-position']!==undefined),counter=all.find(n=>n.props?.['data-route-cost']!==undefined);
  assert.equal(marker.props['data-route-position'],route.entry.cell);assert.equal(marker.props.cx,route.entry.cell%4*80+40);assert.equal(marker.props.cy,Math.floor(route.entry.cell/4)*80+40);
  assert.equal(counter.props['data-route-cost'],route.entry.cost);assert.equal(counter.props['data-route-charge'],route.entry.charge);assert.equal(counter.props['data-route-moves'],route.entry.moves);
  const rows=all.filter(n=>n.props?.['data-route-row']!==undefined);assert.equal(rows.length,route.entries.length);
  rows.forEach((row,i)=>{assert.equal(row.props['data-cell'],route.entries[i].cell);assert.equal(row.props['data-cost'],route.entries[i].cost);assert.equal(row.props['data-charge'],route.entries[i].charge);assert.equal(row.props['aria-current'],i===route.index?'step':undefined);});
  components.unmount();
 }
});

test('active scene replay restarts its clock and keeps one animation frame',()=>{
 const host=harness();host.mount(components.SceneExplanation,baseProps);host.click('replay');host.tick(0);host.tick(4000);assert.equal(host.frame().progress,.5);
 host.click('replay');assert.equal(host.frame().progress,0);assert.equal(host.pending(),1);
 host.tick(4100);assert.equal(host.frame().progress,0);assert.equal(host.pending(),1);
 host.tick(4200);assert.equal(host.frame().progress,.0125);assert.equal(host.pending(),1);host.unmount();
});
test('active replay retains the selected route and restarts its path',()=>{
 const host=harness();host.mount(components.SceneExplanation,{...baseProps,chapter:routeChapter});host.click('alternative-b');host.click('replay');host.tick(0);host.tick(4000);
 assert.equal(host.frame().route.id,'path-b');assert.notEqual(host.frame().route.entry.cell,0);
 host.click('replay');assert.equal(host.frame().route.id,'path-b');assert.equal(host.frame().route.entry.cell,0);assert.equal(host.pending(),1);
 host.tick(4100);assert.equal(host.frame().progress,0);assert.equal(host.frame().route.entry.cell,0);host.tick(4200);assert.equal(host.frame().progress,.0125);assert.equal(host.frame().route.id,'path-b');assert.equal(host.pending(),1);host.unmount();
});
test('active practice replay restarts its clock and preserves the tested snapshot',()=>{
 const host=harness(),answer=['right','right'],snapshot=simulation.makeTaskSimulation(route,answer);
 host.mount(components.PracticeTrace,{chapter,task:route,stage:0,answer,ready:false,simulation:snapshot});host.click('trace-replay');host.tick(0);host.tick(950);assert.equal(host.tree().props['data-trace-step'],1);
 host.click('trace-replay');assert.equal(host.tree().props['data-trace-step'],0);assert.equal(host.pending(),1);assert.deepEqual(JSON.parse(host.tree().props['data-snapshot']),snapshot.result);
 host.tick(1000);assert.equal(host.tree().props['data-trace-step'],0);host.tick(1900);assert.equal(host.tree().props['data-trace-step'],1);assert.equal(host.pending(),1);host.unmount();
});

test('checked ordinary evidence is labelled submitted without inventing a simulation result',()=>{
 const host=harness(),task={...lbase,kind:'choice',options:[{id:'a',label:l('Evidence A')}],correct:'a'};
 host.mount(components.PracticeTrace,{chapter,task,stage:0,answer:'a',ready:false,simulation:null});
 assert.equal(host.tree().props['data-trace-state'],'draft');
 host.update({ready:true});
 assert.equal(host.tree().props['data-trace-state'],'submitted');
 assert.equal(host.tree().props['data-snapshot'],undefined);
 const row=elements(host.tree()).find(node=>node.props?.['data-trace-row']==='a');
 assert.ok(elements(row).some(node=>node.type==='span'&&node.props.children==='Submitted evidence'));
 host.update({ready:false,answer:''});assert.equal(host.tree().props['data-trace-state'],'draft');host.unmount();
});
test('checked mechanical evidence retains the actual tested snapshot',()=>{
 const host=harness(),answer=['right','right'],snapshot=simulation.makeTaskSimulation(route,answer);
 host.mount(components.PracticeTrace,{chapter,task:route,stage:0,answer,ready:false,simulation:snapshot});host.click('trace-next');
 host.update({ready:true});assert.equal(host.tree().props['data-trace-state'],'tested');assert.equal(host.tree().props['data-trace-step'],1);assert.deepEqual(JSON.parse(host.tree().props['data-snapshot']),snapshot.result);host.unmount();
});
test('returning to a previous task or scene does not revive local replay or tested history',()=>{
 const host=harness(),answer=['right','right'],snapshot=simulation.makeTaskSimulation(route,answer);
 host.mount(components.PracticeTrace,{chapter,task:route,stage:0,answer,ready:false,simulation:snapshot});host.click('trace-replay');host.tick(0);host.tick(950);
 host.update({stage:1,simulation:null});host.update({stage:0});assert.equal(host.tree().props['data-trace-state'],'draft');assert.equal(host.tree().props['data-trace-step'],0);assert.equal(host.pending(),0);host.unmount();
 host.mount(components.SceneExplanation,baseProps);host.click('replay');host.tick(0);host.tick(4000);host.update({scene:1});host.update({scene:0});assert.equal(host.frame().step,0);assert.equal(host.tree().props['data-running'],false);assert.equal(host.pending(),0);host.unmount();
});

test('continuously advancing audio is sampled only on clock notifications and explicit seek revisions',()=>{
 const host=harness();let reads=0;
 const media={duration:10,readElapsed:()=>++reads/10,pause(){},resume(){}};
 host.mount(components.SceneExplanation,{...baseProps,playing:true,media});
 const afterMount=reads,progress=host.frame().progress;
 host.update({});assert.equal(reads,afterMount);assert.equal(host.frame().progress,progress);
 host.tick(100);assert.equal(reads,afterMount+1);assert.ok(host.frame().progress>progress);assert.equal(host.pending(),1);host.unmount();
});

function readable(tree){if(typeof tree==='string'||typeof tree==='number')return String(tree);if(Array.isArray(tree))return tree.map(readable).join(' ');return readable(tree?.props?.children??'');}
const fallbackChapter=ct.class10CtChapters[0];
for(const [name,damage] of [
 ['missing nodes',chapter=>{delete chapter.visual.nodes;}],
 ['missing current scene',chapter=>{chapter.visual.scenes[2]=undefined;}],
 ['missing current steps',chapter=>{delete chapter.visual.scenes[2].steps;}],
 ['missing required step',chapter=>{chapter.visual.scenes[2].steps[1]=undefined;}],
 ['nonfinite node geometry',chapter=>{chapter.visual.nodes[0].x=NaN;}],
 ['nonfinite move geometry',chapter=>{chapter.visual.scenes[2].steps[0].moves[0].y=Infinity;}],
 ['unknown node reference',chapter=>{chapter.visual.scenes[2].steps[0].active=['absent'];}],
 ['unknown edge reference',chapter=>{chapter.visual.edges[0].to='absent';}],
 ['invalid exploration index',chapter=>{chapter.visual.exploration.variants[0].step=99;}],
 ['incomplete bilingual data',chapter=>{delete chapter.visual.scenes[2].steps[0].description.hi;}],
])test(`incomplete real chapter uses current authored fallback: ${name}`,()=>{
 const chapter=structuredClone(fallbackChapter);damage(chapter);
 for(const language of ['en','hi']){
  components.setLanguage(language);const host=harness();
  assert.doesNotThrow(()=>host.mount(components.SceneExplanation,{...baseProps,chapter,scene:2,playing:true,setHint:()=>assert.fail('fallback diagnosed an answer'),onActivity:()=>assert.fail('fallback recorded graded activity'),media:{duration:10,readElapsed:()=>6,pause:()=>assert.fail('fallback paused narration'),resume:()=>assert.fail('fallback resumed narration')}}));
  assert.equal(host.tree().props['data-class10-fallback'],true);assert.equal(host.frame(),undefined);assert.equal(host.pending(),0);
  const text=readable(host.tree()),available=chapter.visual.scenes[2]?.steps?.filter(Boolean)??[];
  if(available.length){assert.ok(elements(host.tree()).some(node=>node.type==='ol'));for(const item of available){for(const field of ['label','description'])if(item[field]?.[language])assert.ok(text.includes(item[field][language]),`${language} authored ${field}`);}}
  else {assert.ok(text.includes(chapter.scenes[2].title[language]));assert.ok(text.includes(chapter.scenes[2].caption[language]));}
  assert.equal(text.includes(chapter.scenes[0].caption[language]),false,'do not substitute first-scene caption');host.unmount();
 }
 components.setLanguage('en');
});
test('absent visual and partial fallback metadata remain readable without model results',()=>{
 const chapter=structuredClone(fallbackChapter);delete chapter.visual;chapter.scenes[2]={title:{hi:'उपलब्ध दृश्य'},caption:null};
 components.setLanguage('hi');const host=harness();assert.doesNotThrow(()=>host.mount(components.SceneExplanation,{...baseProps,chapter,scene:2}));
 assert.equal(host.tree().props['data-class10-fallback'],true);assert.ok(readable(host.tree()).includes('उपलब्ध दृश्य'));assert.equal(host.frame(),undefined);host.unmount();components.setLanguage('en');
});
test('valid real chapter keeps animated path and invalidation disposes child clocks',()=>{
 const host=harness(),media={duration:10,readElapsed:()=>6,pause(){},resume(){}};
 host.mount(components.SceneExplanation,{...baseProps,chapter:fallbackChapter,scene:2,playing:true,media});
 assert.equal(host.tree().props['data-class10-fallback'],undefined);assert.deepEqual(host.frame(),api.resolveVisualFrame(fallbackChapter.visual,2,.6));assert.equal(host.pending(),1);
 const broken=structuredClone(fallbackChapter);delete broken.visual.nodes;host.update({chapter:broken});assert.equal(host.tree().props['data-class10-fallback'],true);assert.equal(host.pending(),0);
 host.update({chapter:fallbackChapter});assert.equal(host.frame().progress,.6);assert.equal(host.pending(),1);host.unmount();
});
test('every shipped scene retains its actual animated frame through the guard',async()=>{
 const {class10Chapters}=await loadSource(`export {class10Chapters} from './app/data/class10';`);
 for(const chapter of class10Chapters)for(let scene=0;scene<chapter.scenes.length;scene++){
  const host=harness();host.mount(components.SceneExplanation,{...baseProps,chapter,scene});
  assert.equal(host.tree().props['data-class10-fallback'],undefined,`${chapter.slug} scene ${scene}`);
  assert.deepEqual(host.frame(),api.manualFrame(chapter.visual,scene,0));host.unmount();
 }
});
for(const [name,damage] of [
 ['missing blocked cells',route=>{delete route.task.blocked;}],
 ['invalid grid dimension',route=>{route.task.width=Infinity;}],
 ['invalid route endpoint',route=>{route.to=99;}],
 ['missing moves',route=>{delete route.moves;}],
])test(`incomplete worked route uses authored fallback without simulation: ${name}`,()=>{
 const chapter=structuredClone(routeChapter);damage(chapter.visual.scenes[0].steps[0].route);
 const host=harness();assert.doesNotThrow(()=>host.mount(components.SceneExplanation,{...baseProps,chapter}));
 assert.equal(host.tree().props['data-class10-fallback'],true);assert.equal(host.frame(),undefined);assert.ok(readable(host.tree()).includes(chapter.visual.scenes[0].steps[0].description.en));assert.equal(host.pending(),0);host.unmount();
});
