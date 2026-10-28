"use client";
import {useCallback,useEffect,useLayoutEffect,useMemo,useRef,useState,useSyncExternalStore} from 'react';
import type {LessonChapter} from '../../../../data/lesson-content';
import type {Class10Chapter} from '../../../../data/class10/types';
import type {StoryWorldProps} from '../new/story/types';
import {useEvidenceLanguage} from '../class8/ui';
import {manualFrame,resolveVisualFrame} from './motion-state';
import {resolveRouteExplanation} from './route-explanation';
import {ConceptDiagram} from './ConceptDiagram';
import {diagramReady,DiagramFallback} from './diagram-fallback';
import {class10Ui as ui} from './ui';
import s from './class10.module.css';
type Mode='follow'|'manual'|'replay'|'explore';
type Controls={boundary:string;mode:Mode;step:number;progress:number;running:boolean;variant:string|null;routeIndex:number|null;routeReplay:{scene:number;step:number}|null};
// A small external store owns its mutable cache, outside React render state.
// elapsed is the caption/seek revision that causes a fresh store to be sampled.
function createNarrationStore({read,active}:{read:()=>number;active:boolean;elapsed:number}) {
 let snapshot=read();
 return {
  getSnapshot:()=>snapshot,
  subscribe:(changed:()=>void)=>{
   snapshot=read();
   if(!active)return()=>{};
   let handle=0;
   const tick=()=>{if(document.hidden)return;const next=read();if(next!==snapshot){snapshot=next;changed();}handle=requestAnimationFrame(tick);};
   handle=requestAnimationFrame(tick);
   return()=>cancelAnimationFrame(handle);
  },
 };
}
export function SceneExplanation(props:StoryWorldProps&{chapter:LessonChapter}) {
 return diagramReady((props.chapter as Class10Chapter).visual,props.scene)?<AnimatedSceneExplanation {...props}/>:<DiagramFallback chapter={props.chapter} scene={props.scene}/>;
}
function AnimatedSceneExplanation(props:StoryWorldProps&{chapter:LessonChapter}) {
 const {chapter,scene,playing,reduced,media}=props,visual=(chapter as Class10Chapter).visual;
 const language=useEvidenceLanguage(),boundary=`${chapter.slug}:${scene}`;
 const initial=useCallback(():Controls=>({boundary,mode:reduced||!media?'manual':'follow',step:0,progress:0,running:false,variant:null,routeIndex:null,routeReplay:null}),[boundary,reduced,media]);
 const [stored,setControls]=useState<Controls>(initial),[visible,setVisible]=useState(true);
 const [inputs,setInputs]=useState({boundary,playing,reduced});
 const reset=inputs.boundary!==boundary||playing&&!inputs.playing||reduced&&!inputs.reduced;
 const controls=reset?initial():stored;
 if(inputs.boundary!==boundary||inputs.playing!==playing||inputs.reduced!==reduced){
  setInputs({boundary,playing,reduced});
  if(reset)setControls(initial());
 }
 const replayGeneration=useRef(0),latestProgress=useRef(0);
 const [replayVersion,setReplayVersion]=useState(0);
 useLayoutEffect(()=>{latestProgress.current=controls.progress;},[controls.progress]);
 const read=useCallback(()=>media&&media.duration>0?Math.min(1,Math.max(0,media.readElapsed()/media.duration)):0,[media]);
 // Cache the external snapshot between notifications: actual audio time can
 // advance even between React's repeated getSnapshot calls during one render.
 const mediaClock=useMemo(()=>createNarrationStore({read,elapsed:props.elapsed,active:controls.mode==='follow'&&playing&&visible&&!reduced}),[read,props.elapsed,controls.mode,playing,visible,reduced]);
 const clock=useSyncExternalStore(mediaClock.subscribe,mediaClock.getSnapshot,()=>0);
 useEffect(()=>{
  const visibility=()=>{const shown=!document.hidden;setVisible(shown);if(shown)setControls(initial());};
  document.addEventListener('visibilitychange',visibility);
  return()=>document.removeEventListener('visibilitychange',visibility);
 },[initial]);
 useEffect(()=>{
  if(!visible||reduced||controls.mode!=='replay'||!controls.running)return;
  let handle=0,previous:number|null=null,local=latestProgress.current;
  const generation=replayGeneration.current;
  const tick=(now:number)=>{
   if(document.hidden||generation!==replayGeneration.current)return;
   if(previous!==null)local=Math.min(1,local+(now-previous)/8000);
   setControls(value=>({...value,progress:local,running:local<1}));
   previous=now;if(local<1)handle=requestAnimationFrame(tick);
  };
  handle=requestAnimationFrame(tick);return()=>cancelAnimationFrame(handle);
 },[controls.mode,controls.running,boundary,visible,reduced,replayVersion]);
 const variant=visual.exploration.variants.find(item=>item.id===controls.variant);
 let frame=controls.mode==='explore'&&variant?manualFrame(visual,variant.scene,variant.step):controls.mode==='manual'?manualFrame(visual,scene,controls.step):resolveVisualFrame(visual,scene,controls.mode==='follow'?clock:controls.progress);
 if(controls.routeReplay&&controls.mode==='replay') {
  frame=manualFrame(visual,controls.routeReplay.scene,controls.routeReplay.step);
  if(frame.route)frame={...frame,progress:controls.progress,route:resolveRouteExplanation({...frame.route,from:0,to:frame.route.entries.length-1},controls.progress)};
 }
 if(frame.route&&controls.routeIndex!==null)frame={...frame,route:resolveRouteExplanation(frame.route,0,controls.routeIndex)};
 const local=(next:Partial<Controls>)=>{media?.pause();setControls({...controls,...next});};
 const step=(delta:number)=>local({mode:'manual',step:Math.min(visual.scenes[scene].steps.length-1,Math.max(0,frame.step+delta)),running:false,variant:null,routeReplay:null,routeIndex:null});
 const running=controls.mode==='follow'?playing:controls.mode==='replay'&&controls.running;
 return <section className={s.explanation} translate="no" data-class10-explanation={chapter.slug} data-mode={controls.mode} data-scene={scene} data-visual-scene={frame.scene} data-step={frame.step} data-progress={frame.progress.toFixed(4)} data-running={running}>
  <p className={s.mode} aria-live="polite">{ui[controls.mode][language]} · {ui.scene[language]} {frame.scene+1} · {ui.step[language]} {frame.step+1}/{visual.scenes[frame.scene].steps.length}</p>
  <ConceptDiagram frame={frame}/>
  {frame.route&&<fieldset className={s.exploration}><legend>{ui.routeInspect[language]}</legend><div className={s.controls}>{frame.route.entries.map((entry,index)=><button type="button" key={index} data-control={`route-entry-${index}`} aria-pressed={frame.route!.index===index} onClick={()=>local({mode:'replay',running:false,routeReplay:{scene:frame.scene,step:frame.step},routeIndex:index,progress:index/frame.route!.entries.length})}>{ui.step[language]} {index} · {ui.position[language]} {entry.cell} · +{entry.charge}</button>)}</div></fieldset>}
  <div className={s.controls} aria-label={ui.manual[language]}>
   <button type="button" data-control="pause" disabled={!running} onClick={()=>local({mode:'replay',progress:controls.mode==='follow'?read():controls.progress,running:false,variant:null})}>{ui.pause[language]}</button>
   <button type="button" data-control="replay" disabled={reduced} onClick={()=>{setReplayVersion(++replayGeneration.current);local({mode:'replay',progress:0,running:true,variant:null,routeIndex:null,routeReplay:frame.route?{scene:frame.scene,step:frame.step}:null});}}>{ui.replay[language]}</button>
   <button type="button" data-control="resume" disabled={reduced||controls.mode!=='replay'||controls.running||controls.progress>=1} onClick={()=>local({running:true,routeIndex:null,progress:frame.route&&controls.routeIndex!==null?controls.routeIndex/frame.route.entries.length:controls.progress})}>{ui.resume[language]}</button>
   <button type="button" data-control="previous" disabled={controls.mode==='manual'&&frame.step===0} onClick={()=>step(-1)}>{ui.previous[language]}</button>
   <button type="button" data-control="next" disabled={controls.mode==='manual'&&frame.step===visual.scenes[scene].steps.length-1} onClick={()=>step(1)}>{ui.next[language]}</button>
   <button type="button" data-control="reset" onClick={()=>local({mode:reduced?'manual':'replay',progress:0,step:0,running:false,variant:null,routeIndex:null,routeReplay:null})}>{ui.reset[language]}</button>
   <button type="button" data-control="follow" disabled={!media} onClick={()=>{setControls(initial());media?.resume();}}>{ui.follow[language]}</button>
  </div>
  <p className={s.note}>{ui.manualNote[language]}</p>
  <fieldset className={s.exploration}><legend>{visual.exploration.title[language]}</legend><p>{visual.exploration.prompt[language]}</p><div className={s.controls}>{visual.exploration.variants.map(item=><button key={item.id} type="button" data-variant={item.id} aria-pressed={controls.mode==='explore'&&controls.variant===item.id} onClick={()=>local({mode:'explore',variant:item.id,running:false,routeIndex:null,routeReplay:null})}>{item.label[language]}</button>)}</div><small>{ui.explorationNote[language]}</small></fieldset>
 </section>;
}
