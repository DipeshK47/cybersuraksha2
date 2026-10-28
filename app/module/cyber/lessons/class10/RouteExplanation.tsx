"use client";
import {useEvidenceLanguage} from '../class8/ui';
import type {VisualFrame} from './motion-state';
import {class10Ui as ui} from './ui';
import s from './class10.module.css';
/** Discrete positions deliberately stay on actual entries: no interpolation across walls. */
export function RouteExplanation({frame}:{frame:VisualFrame}) {
 const language=useEvidenceLanguage(),route=frame.route!;
 const {task,entry,entries,index}=route,visited=entries.slice(0,index+1).filter(row=>!row.failed);
 const point=(cell:number)=>`${cell%task.width*80+40},${Math.floor(cell/task.width)*80+40}`;
 return <figure className={s.diagram} translate="no" data-concept-diagram data-frame-step={frame.step} data-route-explanation={route.id} data-route-entry={index}>
  <h3>{frame.label[language]}</h3><p>{frame.description[language]}</p>
  <p><b>{route.label[language]}</b> · {ui.routeLimits[language]}: {task.maxSteps} {ui.moves[language]}, {task.maxCost??'—'} {ui.routeTotal[language]}</p>
  <svg viewBox={`0 0 ${task.width*80} ${task.height*80}`} role="img" aria-label={`${route.label[language]} · ${ui.position[language]} ${entry.cell} · ${ui.cost[language]} ${entry.cost}`}>
   {Array.from({length:task.width*task.height},(_,cell)=>{const blocked=task.blocked.includes(cell);return <g key={cell} data-route-cell={cell} data-blocked={blocked}>
    <rect x={cell%task.width*80+3} y={Math.floor(cell/task.width)*80+3} width="74" height="74" rx="8" fill={blocked?'#354c51':task.stops?.includes(cell)?'#dbe4f5':cell===task.goal?'#e0e9af':'#e4f1ec'} stroke="#748d88"/>
    <text x={cell%task.width*80+14} y={Math.floor(cell/task.width)*80+22} fontSize="16" fill={blocked?'white':'#173d3a'}>{cell}</text>
    <text x={cell%task.width*80+40} y={Math.floor(cell/task.width)*80+66} textAnchor="middle" fontSize="13" fill={blocked?'white':'#173d3a'}>{blocked?'×':`+${task.cellCosts?.[String(cell)]??1}`}</text>
   </g>;})}
   <polyline points={visited.map(row=>point(row.cell)).join(' ')} fill="none" stroke="#087d7b" strokeWidth="4" opacity=".7"/>
   <circle data-route-position={entry.cell} cx={entry.cell%task.width*80+40} cy={Math.floor(entry.cell/task.width)*80+40} r="11" fill="#b34b17" stroke="white" strokeWidth="2"/>
  </svg>
  <figcaption aria-live="polite">
   <p data-route-cost={entry.cost} data-route-charge={entry.charge} data-route-moves={entry.moves}><b>{ui.position[language]} {entry.cell}</b> · {ui.routeCharge[language]} +{entry.charge} · {ui.routeTotal[language]} {entry.cost} · {ui.moves[language]} {entry.moves}/{task.maxSteps}</p>
   <p>{ui.routeStart[language]} {task.start} · {ui.routeGoal[language]} {task.goal} · {ui.routeStops[language]}: {(task.stops??[]).map(cell=>`${cell} ${entry.stops.includes(cell)?'✓':'—'}`).join(', ')}</p>
   <p>{ui.routeFreeStart[language]}</p>
   {entry.failed&&<p data-route-failed={entry.failedAt}>{ui.failed[language]} {entry.failedAt} · {ui.routeNoCharge[language]}</p>}
   {index===entries.length-1&&<p data-route-passed={route.passed}>{ui[route.passed?'routePass':'routeFail'][language]} · {ui.routeGoal[language]} {entry.cell===task.goal?'✓':'—'} · {ui.routeTotal[language]} {entry.cost}/{task.maxCost??'—'}</p>}
  </figcaption>
  <ol className={s.traceRows} start={0} aria-label={ui.routeEntries[language]}>{entries.map((row,i)=><li key={i} data-route-row={i} data-cell={row.cell} data-cost={row.cost} data-charge={row.charge} aria-current={i===index?'step':undefined}>
   <b>{ui.step[language]} {i} · {ui.position[language]} {row.cell}</b><span>{row.failed?ui.failed[language]:ui.routeCharge[language]} {row.failed?row.failedAt:`+${row.charge}`} · {ui.routeTotal[language]} {row.cost}</span>
  </li>)}</ol>
 </figure>;
}
