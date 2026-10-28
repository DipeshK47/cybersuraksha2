"use client";
import {useId} from 'react';
import type {VisualFrame} from './motion-state';
import {useEvidenceLanguage} from '../class8/ui';
import {class10Ui as ui} from './ui';
import {RouteExplanation} from './RouteExplanation';
import s from './class10.module.css';
export function ConceptDiagram({frame}:{frame:VisualFrame}) {
 const language=useEvidenceLanguage(),titleId=useId(),descriptionId=useId();
 if(frame.route)return <RouteExplanation frame={frame}/>;
 const visible=frame.nodes.filter(node=>!node.hidden);
 return <figure className={s.diagram} translate="no" data-concept-diagram data-frame-step={frame.step}>
  <svg viewBox="0 0 600 360" role="img" aria-labelledby={`${titleId} ${descriptionId}`}>
   <title id={titleId}>{frame.label[language]}</title><desc id={descriptionId}>{frame.description[language]}</desc>
   <rect x="1" y="1" width="598" height="358" rx="24" fill="#eff8f6"/>
   {frame.edges.map(edge=>{const from=visible.find(n=>n.id===edge.from),to=visible.find(n=>n.id===edge.to);return from&&to?<g key={edge.id} data-edge-id={edge.id} data-active={edge.active}><path d={`M${from.x*6},${from.y*3.6} L${to.x*6},${to.y*3.6}`} stroke={edge.active?'#0b6b68':'#809994'} strokeWidth={edge.active?5:2} strokeDasharray={edge.active?undefined:'6 5'}/><circle cx={(from.x+to.x)*3} cy={(from.y+to.y)*1.8} r={edge.active?6:3} fill={edge.active?'#0b6b68':'#809994'}/></g>:null;})}
   {visible.map(node=><g key={node.id} transform={`translate(${node.x*6} ${node.y*3.6})`} data-node-id={node.id} data-x={node.x.toFixed(3)} data-y={node.y.toFixed(3)} data-status={node.status} className={s.node}>
    {node.shape==='circle'?<circle r="31"/>:<rect x="-42" y="-28" width="84" height="56" rx={node.shape==='box'?3:12}/>}
    <text textAnchor="middle" y="6" fontSize="20" fontWeight="750" fill="#173d3a">{frame.nodes.findIndex(item=>item.id===node.id)+1}</text>
   </g>)}
  </svg>
  <figcaption><h3>{frame.label[language]}</h3><p>{frame.description[language]}</p></figcaption>
  <ol className={s.legend} aria-label={ui.legend[language]}>{frame.nodes.map(node=><li key={node.id} data-legend-node={node.id} data-status={node.status}>
   <b>{node.label[language]}</b>{node.value&&<span>{node.value[language]}</span>}<small>{node.hidden?ui.hidden[language]:ui[node.status][language]}</small>
  </li>)}</ol>
  {frame.edges.some(edge=>edge.label)&&<ul className={s.connections}>{frame.edges.filter(edge=>edge.label).map(edge=><li key={edge.id} data-active={edge.active}>{frame.nodes.find(n=>n.id===edge.from)?.label[language]} → {frame.nodes.find(n=>n.id===edge.to)?.label[language]}: {edge.label?.[language]}</li>)}</ul>}
 </figure>;
}
