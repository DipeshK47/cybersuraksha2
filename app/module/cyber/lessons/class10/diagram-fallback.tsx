"use client";
import type {ChapterVisual} from '../../../../data/class10/types';
import type {LessonChapter} from '../../../../data/lesson-content';
import {useEvidenceLanguage} from '../class8/ui';
import {class10Ui as ui} from './ui';
import s from './class10.module.css';

const record=(value:unknown):value is Record<string,unknown>=>typeof value==='object'&&value!==null&&!Array.isArray(value);
const text=(value:unknown):value is string=>typeof value==='string'&&value.trim().length>0;
const bilingual=(value:unknown)=>record(value)&&text(value.en)&&text(value.hi);
const finite=(value:unknown):value is number=>typeof value==='number'&&Number.isFinite(value);
const integer=(value:unknown):value is number=>finite(value)&&Number.isInteger(value);
// Array.from also checks sparse slots, which Array.every alone would skip.
const list=(value:unknown,check:(item:unknown)=>boolean):value is unknown[]=>Array.isArray(value)&&Array.from(value).every(check);
const optional=(value:unknown,check:(item:unknown)=>boolean)=>value===undefined||check(value);
function routeReady(value:unknown):boolean {
 if(!record(value)||!text(value.id)||!bilingual(value.label)||!record(value.task))return false;
 const task=value.task;
 if(task.kind!=='route'||!integer(task.width)||task.width<=0||!integer(task.height)||task.height<=0)return false;
 const count=task.width*task.height;
 const inGrid=(item:unknown)=>integer(item)&&item>=0&&item<count;
 return inGrid(task.start)&&inGrid(task.goal)&&list(task.blocked,inGrid)&&optional(task.stops,items=>list(items,inGrid))&&
  integer(task.maxSteps)&&task.maxSteps>=0&&optional(task.maxCost,finite)&&
  optional(task.cellCosts,costs=>record(costs)&&Object.entries(costs).every(([key,cost])=>inGrid(Number(key))&&finite(cost)))&&
  list(value.moves,move=>['up','right','down','left'].includes(move as string))&&
  integer(value.from)&&integer(value.to)&&value.from>=0&&value.from<=value.to&&value.to<=value.moves.length;
}
/** Only the data consumed by the diagram, clock controls and exploration is checked here. */
export function diagramReady(value:unknown,scene:number):value is ChapterVisual {
 if(!record(value)||!integer(scene)||scene<0||!Array.isArray(value.scenes)||scene>=value.scenes.length)return false;
 if(!list(value.nodes,node=>record(node)&&text(node.id)&&bilingual(node.label)&&optional(node.value,bilingual)&&finite(node.x)&&finite(node.y))||!value.nodes.length)return false;
 const nodes=new Set(value.nodes.map(node=>(node as Record<string,unknown>).id));
 if(nodes.size!==value.nodes.length)return false;
 if(!list(value.edges,edge=>record(edge)&&text(edge.id)&&nodes.has(edge.from)&&nodes.has(edge.to)&&optional(edge.label,bilingual)))return false;
 const edges=new Set(value.edges.map(edge=>(edge as Record<string,unknown>).id));
 if(edges.size!==value.edges.length)return false;
 const refs=(items:unknown,ids:Set<unknown>)=>list(items,id=>ids.has(id));
 if(!list(value.scenes,item=>record(item)&&Array.isArray(item.steps)&&[3,4].includes(item.steps.length)&&list(item.steps,step=>
  record(step)&&bilingual(step.label)&&bilingual(step.description)&&refs(step.active,nodes)&&
  ['warning','complete','hidden'].every(key=>optional(step[key],items=>refs(items,nodes)))&&optional(step.activeEdges,items=>refs(items,edges))&&
  optional(step.moves,items=>list(items,move=>record(move)&&nodes.has(move.id)&&finite(move.x)&&finite(move.y)))&&
  optional(step.values,values=>record(values)&&Object.entries(values).every(([id,label])=>nodes.has(id)&&bilingual(label)))&&optional(step.route,routeReady))))return false;
 const scenes=value.scenes as ChapterVisual['scenes'],exploration=value.exploration;
 return record(exploration)&&bilingual(exploration.title)&&bilingual(exploration.prompt)&&list(exploration.variants,item=>
  record(item)&&text(item.id)&&bilingual(item.label)&&integer(item.scene)&&integer(item.step)&&item.scene>=0&&item.scene<scenes.length&&item.step>=0&&item.step<scenes[item.scene].steps.length);
}
function localText(value:unknown,language:'en'|'hi'):string {
 if(!record(value))return '';
 const preferred=value[language],other=value[language==='en'?'hi':'en'];
 return text(preferred)?preferred:text(other)?other:'';
}
/** Preserve available authored explanation; never run the simulation or assessment from fallback. */
export function DiagramFallback({chapter,scene}:{chapter:LessonChapter;scene:number}) {
 const language=useEvidenceLanguage(),visual=(chapter as LessonChapter&{visual?:unknown}).visual;
 const current=record(visual)&&Array.isArray(visual.scenes)?visual.scenes[scene]:undefined;
 const steps=record(current)&&Array.isArray(current.steps)?Array.from(current.steps):[];
 const available=steps.flatMap((step,index)=>{
  if(!record(step))return [];
  const label=localText(step.label,language),description=localText(step.description,language);
  return label||description?[{index,label,description}]:[];
 });
 const story=Array.isArray(chapter.scenes)?chapter.scenes[scene]:undefined;
 const title=record(story)?localText(story.title,language):'',caption=record(story)?localText(story.caption,language):'';
 return <section className={s.explanation} translate="no" data-class10-explanation={chapter.slug} data-class10-fallback data-scene={scene}>
  <p className={s.mode}>{ui.diagramFallback[language]}</p>
  {available.length?<ol className={s.traceRows} aria-label={ui.manual[language]}>{available.map(item=><li key={item.index} value={item.index+1}><b>{item.label||`${ui.step[language]} ${item.index+1}`}</b>{item.description&&<p>{item.description}</p>}</li>)}</ol>:null}
  {(!available.length||available.length!==steps.length)&&<>{title&&<h3>{title}</h3>}{caption&&<p>{caption}</p>}</>}
 </section>;
}
