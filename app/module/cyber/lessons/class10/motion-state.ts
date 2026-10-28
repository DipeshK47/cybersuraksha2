import type {ChapterVisual, VisualNode, VisualEdge, L} from '../../../../data/class10/types';
import {resolveRouteExplanation, type RouteExplanationFrame} from './route-explanation';
export type VisualFrame = {
  route?:RouteExplanationFrame;
  scene:number; step:number; progress:number; label:L; description:L;
  nodes:(VisualNode & {hidden:boolean;status:'idle'|'active'|'warning'|'complete'})[];
  edges:(VisualEdge & {active:boolean})[];
};
const bounded=(value:number,max:number)=>Math.min(max,Math.max(0,Number.isNaN(value)?0:value));
export const stepBoundaries=(count:number)=>count===4?[0,.3,.6,.85]:[0,.45,.85];
const copyL=(value:L):L=>({...value});
function frame(visual:ChapterVisual,scene:number,step:number,progress:number,blend:number,routeProgress=blend):VisualFrame {
 const stages=visual.scenes[scene].steps,current=stages[step],previous=stages[step-1];
 return {scene,step,progress,...(current.route?{route:resolveRouteExplanation(current.route,routeProgress)}:{}),label:copyL(current.label),description:copyL(current.description),
  nodes:visual.nodes.map(node=>{
   const target=current.moves?.find(move=>move.id===node.id)??node;
   const from=previous?.moves?.find(move=>move.id===node.id)??node;
   const value=current.values?.[node.id]??node.value;
   return {...node,label:copyL(node.label),value:value?copyL(value):undefined,
    x:from.x+(target.x-from.x)*blend,y:from.y+(target.y-from.y)*blend,
    hidden:current.hidden?.includes(node.id)??false,
    status:current.warning?.includes(node.id)?'warning':current.complete?.includes(node.id)?'complete':current.active.includes(node.id)?'active':'idle'};
  }),edges:visual.edges.map(edge=>({...edge,label:edge.label?copyL(edge.label):undefined,active:current.activeEdges?.includes(edge.id)??false}))};
}
/** Positions interpolate; all semantic state belongs exclusively to the current authored step. */
export function resolveVisualFrame(visual:ChapterVisual,scene:number,progress:number):VisualFrame {
 const index=Math.floor(bounded(scene,visual.scenes.length-1)),p=bounded(progress,1);
 const boundaries=stepBoundaries(visual.scenes[index].steps.length);
 const step=boundaries.reduce((chosen,start,i)=>p>=start?i:chosen,0);
 const fraction=(p-boundaries[step])/((boundaries[step+1]??1)-boundaries[step]);
 const smooth=fraction*fraction*(3-2*fraction);
 return frame(visual,index,step,p,smooth,fraction);
}
/** Manual access presents the complete authored state, including the target position. */
export function manualFrame(visual:ChapterVisual,scene:number,step:number):VisualFrame {
 const index=Math.floor(bounded(scene,visual.scenes.length-1));
 const selected=Math.floor(bounded(step,visual.scenes[index].steps.length-1));
 return frame(visual,index,selected,stepBoundaries(visual.scenes[index].steps.length)[selected],1);
}
export function visualSignature(value:VisualFrame):string {
 return JSON.stringify({scene:value.scene,step:value.step,label:value.label,description:value.description,nodes:value.nodes,edges:value.edges,route:value.route});
}
