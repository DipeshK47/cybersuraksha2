import type {VisualRoute} from '../../../../data/class10/visual-types';
import {simulateRoute,evaluateTask} from '../class8/task-evaluation';
export type RouteEntry={cell:number;cost:number;charge:number;moves:number;stops:number[];failed:boolean;failedAt:number|null};
export type RouteExplanationFrame=VisualRoute & {entries:RouteEntry[];index:number;entry:RouteEntry;passed:boolean};
/** Prefixes use the production simulator, including its stopping and repeated-entry rules. */
export function resolveRouteExplanation(route:VisualRoute,progress:number,indexOverride?:number):RouteExplanationFrame {
 const result=simulateRoute(route.task,route.moves);
 const count=result.path.length+(result.failedAt===null?0:1);
 const entries:RouteEntry[]=[];
 for(let i=0;i<count;i++) {
  const prefix=simulateRoute(route.task,route.moves.slice(0,i));
  entries.push({cell:prefix.position,cost:prefix.cost,charge:i?prefix.cost-entries[i-1].cost:0,moves:prefix.path.length-1,
   stops:(route.task.stops??[]).filter(cell=>prefix.path.includes(cell)),failed:!prefix.valid,failedAt:prefix.failedAt});
 }
 const p=Math.max(0,Math.min(1,progress));
 const index=Math.max(0,Math.min(entries.length-1,indexOverride??route.from+Math.min(route.to-route.from,Math.floor(p*(route.to-route.from+1)))));
 return {...structuredClone(route),entries,index,entry:entries[index],passed:evaluateTask(route.task,route.moves).correct};
}
