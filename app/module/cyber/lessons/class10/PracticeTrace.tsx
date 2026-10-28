"use client";
import {useEffect,useLayoutEffect,useRef,useState} from 'react';
import type {L,LessonTask,TaskAnswer} from '../../../../data/lesson-content';
import type {StructuredPracticeVisualProps} from '../class8/Class8Lesson';
import type {TaskSimulationSnapshot} from '../class8/task-simulation';
import {useEvidenceLanguage} from '../class8/ui';
import {class10Ui as ui} from './ui';
import s from './class10.module.css';
type TraceRow={id:string;label:L;value:L;cell?:number;cost?:number};
const literal=(value:string|number):L=>({en:String(value),hi:String(value)});
/** Only the actual reported test may produce mechanical results. Drafts expose selections only. */
export function practiceTraceRows(task:LessonTask,answer:TaskAnswer,simulation:TaskSimulationSnapshot|null):TraceRow[] {
 const tested=simulation?.fingerprint===JSON.stringify(answer)?simulation:null;
 if(task.kind==='route'&&tested?.kind==='route') {
  let cost=0;
  return tested.result.path.map((cell,index)=>{if(index)cost+=task.cellCosts?.[String(cell)]??1;return {id:`move-${index}`,label:ui.position,value:{en:`Row ${Math.floor(cell/task.width)+1}, column ${cell%task.width+1}`,hi:`पंक्ति ${Math.floor(cell/task.width)+1}, कॉलम ${cell%task.width+1}`},cell,cost:index===tested.result.path.length-1?tested.result.cost:cost};});
 }
 if(task.kind==='model'&&tested?.kind==='model')return tested.result.map(row=>({id:row.id,label:literal(`${row.id} · ${row.value}`),value:row.predicted===null?ui.abstain:task.labels.find(label=>label.id===row.predicted)?.label??literal(row.predicted)}));
 if(task.kind==='match'&&tested?.kind==='permissions')return tested.result.map((row,index)=>({id:`permission-${index}`,label:row.label,value:row.result}));
 const strings=Array.isArray(answer)?answer.map(String):typeof answer==='string'?[answer]:[];
 if(task.kind==='choice')return task.options.filter(item=>item.id===answer).map(item=>({id:item.id,label:item.label,value:ui.draft}));
 if(task.kind==='select'||task.kind==='order')return strings.map(id=>({id,label:task.items.find(item=>item.id===id)?.label??literal(id),value:ui.draft}));
 if(task.kind==='model')return strings.map(id=>{const row=task.examples.find(item=>item.id===id);return {id,label:literal(row?`${row.id} · ${row.value}`:id),value:task.labels.find(label=>label.id===row?.label)?.label??ui.draft};});
 if(task.kind==='match'||task.kind==='number')return (task.kind==='match'?task.rows:task.fields).map(row=>{const value=!Array.isArray(answer)&&typeof answer==='object'?answer[row.id]:'';return {id:row.id,label:row.label,value:task.kind==='match'?task.options.find(option=>option.id===value)?.label??(value?literal(value):ui.noSelection):value?literal(value):ui.noSelection};});
 return strings.filter(Boolean).map((value,index)=>({id:String(index),label:literal(index+1),value:task.kind==='route'&&(value==='up'||value==='down'||value==='left'||value==='right')?({up:{en:'Up',hi:'ऊपर'},down:{en:'Down',hi:'नीचे'},left:{en:'Left',hi:'बाएँ'},right:{en:'Right',hi:'दाएँ'}}[value]):literal(value)}));
}
export function PracticeTrace({chapter,task,stage,answer,ready,simulation}:StructuredPracticeVisualProps) {
 const language=useEvidenceLanguage();
 const valid=simulation?.fingerprint===JSON.stringify(answer)?simulation:null;
 const rows=practiceTraceRows(task,answer,valid),boundary=JSON.stringify([chapter.slug,stage,task,answer,valid]);
 const [play,setPlay]=useState({boundary,index:0,running:false}),[reduced,setReduced]=useState(false);
 const state=play.boundary===boundary?play:{boundary,index:0,running:false};
 const replayGeneration=useRef(0),[replayVersion,setReplayVersion]=useState(0);
 // Status participates in rendering, so remember committed task boundaries in state.
 const [history,setHistory]=useState({task,stage,tested:!!valid});
 if(history.task!==task||history.stage!==stage)setHistory({task,stage,tested:!!valid});
 else if(valid&&!history.tested)setHistory({...history,tested:true});
 const outdated=!valid&&(!!simulation||history.task===task&&history.stage===stage&&history.tested);
 const mechanics=task.kind==='route'||task.kind==='model'||task.kind==='match'&&task.presentation==='permissions';
 const submitted=ready&&!mechanics;
 const status=valid?'tested':submitted?'submitted':outdated?'outdated':'draft';
 if(play.boundary!==boundary)setPlay({boundary,index:0,running:false});
 // A new run starts from the latest committed index without restarting on each tick.
 const latestIndex=useRef(0);
 useLayoutEffect(()=>{latestIndex.current=state.index;},[state.index]);
 useEffect(()=>{const query=window.matchMedia('(prefers-reduced-motion: reduce)');const change=()=>{setReduced(query.matches);if(query.matches)setPlay(value=>({...value,running:false}));};change();query.addEventListener('change',change);return()=>query.removeEventListener('change',change);},[]);
 useEffect(()=>{
  if(!state.running||reduced)return;
  let handle=0,last:number|null=null,index=latestIndex.current;
  const generation=replayGeneration.current;
  const tick=(time:number)=>{if(document.hidden||generation!==replayGeneration.current)return;if(last===null)last=time;if(time-last>=900){index=Math.min(rows.length-1,index+1);setPlay({boundary,index,running:index<rows.length-1});last=time;}if(index<rows.length-1)handle=requestAnimationFrame(tick);};
  const hide=()=>{if(document.hidden){cancelAnimationFrame(handle);setPlay(value=>({...value,running:false}));}};
  document.addEventListener('visibilitychange',hide);handle=requestAnimationFrame(tick);return()=>{cancelAnimationFrame(handle);document.removeEventListener('visibilitychange',hide);};
 },[state.running,boundary,reduced,rows.length,replayVersion]);
 const active=rows[state.index],move=(delta:number)=>setPlay({boundary,index:Math.max(0,Math.min(rows.length-1,state.index+delta)),running:false});
 return <section translate="no" className={s.practice} data-class10-trace data-task-kind={task.kind} data-trace-state={status} data-trace-step={state.index} data-running={state.running} data-snapshot={valid?JSON.stringify(valid.result):undefined}>
  <h3>{ui.trace[language]}</h3><p className={s.mode} aria-live="polite">{ui[status][language]} · {ui.step[language]} {rows.length?state.index+1:0}/{rows.length}</p>
  {task.kind==='route'&&valid?.kind==='route'&&<><svg className={s.route} viewBox={`0 0 ${task.width*56} ${task.height*56}`} role="img" aria-label={`${ui.position[language]} ${active?.value[language]??''}`}>
   {Array.from({length:task.width*task.height},(_,cell)=><g key={cell}><rect x={cell%task.width*56+3} y={Math.floor(cell/task.width)*56+3} width="50" height="50" rx="8" fill={task.blocked.includes(cell)?'#354c51':cell===task.goal?'#e0e9af':'#e4f1ec'} stroke="#748d88"/><text x={cell%task.width*56+28} y={Math.floor(cell/task.width)*56+33} textAnchor="middle" fontSize="15">{cell+1}</text></g>)}
   <polyline points={valid.result.path.slice(0,state.index+1).map(cell=>`${cell%task.width*56+28},${Math.floor(cell/task.width)*56+28}`).join(' ')} fill="none" stroke="#087d7b" strokeWidth="5"/>
   {active?.cell!==undefined&&<circle data-route-position={active.cell} cx={active.cell%task.width*56+28} cy={Math.floor(active.cell/task.width)*56+28} r="10" fill="#ce4b2e"/>}
  </svg><p data-route-cost={active?.cost}>{ui.cost[language]}: {active?.cost??0}</p>{state.index===rows.length-1&&<p>{valid.result.valid?ui.valid[language]:ui.failed[language]}{valid.result.failedAt!==null?` ${valid.result.failedAt}`:''}</p>}</>}
  {mechanics&&!valid&&<p>{ui.noTest[language]}</p>}
  {rows.length?<ol className={s.traceRows}>{rows.map((row,index)=><li key={row.id} data-trace-row={row.id} aria-current={state.index===index?'step':undefined}><b>{row.label[language]}</b><span>{submitted&&row.value===ui.draft?ui.submitted[language]:row.value[language]}</span>{row.cost!==undefined&&<small>{ui.cost[language]}: {row.cost}</small>}</li>)}</ol>:<p>{ui.noSelection[language]}</p>}
  <div className={s.controls}>
   <button type="button" data-control="trace-replay" disabled={reduced||rows.length<2} onClick={()=>{setReplayVersion(++replayGeneration.current);setPlay({boundary,index:0,running:true});}}>{ui.replay[language]}</button>
   <button type="button" data-control="trace-pause" disabled={!state.running} onClick={()=>setPlay({...state,running:false})}>{ui.pause[language]}</button>
   <button type="button" data-control="trace-resume" disabled={reduced||state.running||state.index>=rows.length-1} onClick={()=>setPlay({...state,running:true})}>{ui.resume[language]}</button>
   <button type="button" data-control="trace-previous" disabled={state.index===0} onClick={()=>move(-1)}>{ui.previous[language]}</button>
   <button type="button" data-control="trace-next" disabled={state.index>=rows.length-1} onClick={()=>move(1)}>{ui.next[language]}</button>
   <button type="button" data-control="trace-reset" onClick={()=>setPlay({boundary,index:0,running:false})}>{ui.reset[language]}</button>
  </div>
 </section>;
}
