"use client";
import {useEvidenceLanguage} from '../class8/ui';
import {class10Ui as ui} from './ui';
import s from './class10.module.css';
/** Original silhouettes: Aditi's braided ponytail and coral lab coat; Vihaan's cobalt vest. */
export function Class10Characters({mood,playing,reduced=false}:{mood:string;playing:boolean;reduced?:boolean}) {
 const language=useEvidenceLanguage(),concerned=/sad|worried|concern|surprise|thinking/.test(mood);
 return <div translate="no"><svg className={s.characters} viewBox="0 0 380 310" role="img" aria-label={ui.characters[language]} data-class10-characters data-mood={mood} data-animated={playing&&!reduced}>
  <ellipse cx="190" cy="278" rx="164" ry="12" fill="#c7ded5"/>
  <path d="M56 85Q38 30 95 26q55-6 55 64l-10 36-15-46-52-7Z" fill="#282c39"/><path d="M62 72Q25 85 46 127l-10 37 19 13 14-23-9-25q19-31 2-57" fill="#282c39"/>
  <path d="M62 160q36-24 72 0l19 105H41Z" fill="#e88c70" stroke="#443835" strokeWidth="3"/><path d="m87 145-8 17 18 29 21-29-8-17" fill="#f1d7a3"/>
  <path d="M85 122v28q13 14 26 0v-28" fill="#a8694d"/>
  <ellipse cx="98" cy="91" rx="36" ry="44" fill="#ba7c58" stroke="#443835" strokeWidth="3"/><path d="M62 82q-6-49 37-49 44-1 36 51l-14-22-13-12q-21 29-46 32" fill="#282c39"/>
  <path d={concerned?'m75 80 13-5m19 0 13 5':'m75 77h13m19 0h13'} stroke="#282c39" strokeWidth="3"/><circle cx="82" cy="90" r="3"/><circle cx="114" cy="90" r="3"/>
  <path d={concerned?'M87 116q11-6 22 0':'M86 112q12 12 24 0'} fill="none" stroke="#60382e" strokeWidth="3"/>
  <path d="m63 178-12 50 29 9" fill="none" stroke="#ba7c58" strokeWidth="13" strokeLinecap="round"/>
  <path d="m130 178 28 9 38-36m-2 0 15-4" fill="none" stroke="#ba7c58" strokeWidth="13" strokeLinecap="round"/>
  <rect x="79" y="203" width="30" height="24" rx="4" fill="#fff9de"/><path d="M87 212h14m-14 7h9" stroke="#267c72" strokeWidth="3"/>
  <path d="M240 157q30-20 60 0l24 108h-106Z" fill="#4b7098" stroke="#263e4c" strokeWidth="3"/><path d="m257 151 13 20 14-20 6 114h-39Z" fill="#d5eae7"/>
  <path d="M256 126v27q14 12 27 0v-27" fill="#a67553"/>
  <ellipse cx="270" cy="89" rx="37" ry="45" fill="#d09c6b" stroke="#263e4c" strokeWidth="3"/>
  <path d="M233 86q-12-43 16-46 1-23 29-14 26-7 32 17 11 13-4 44l-10-28-24 2-20-13-11 39Z" fill="#252d39"/>
  <path d={concerned?'m246 78 13-4m19 0 13 4':'m246 75h13m19 0h13'} stroke="#252d39" strokeWidth="3"/><circle cx="253" cy="89" r="3"/><circle cx="285" cy="89" r="3"/>
  <path d={concerned?'M259 114q11-5 22 0':'M258 111q12 12 24 0'} fill="none" stroke="#694032" strokeWidth="3"/>
  <g className={s.cardArm}><path d="m243 177-21 38-28-12m99-26 10 46-47 8" fill="none" stroke="#d09c6b" strokeWidth="13" strokeLinecap="round"/><rect x="185" y="193" width="65" height="44" rx="6" fill="#f6d98c" stroke="#745b30" strokeWidth="3" transform="rotate(9 217 215)"/><path d="m199 205 32 5m-34 8 24 4" stroke="#5b7566" strokeWidth="4"/></g>
  <text x="98" y="300" textAnchor="middle" fontSize="18" fontWeight="700" fill="#173d3a">{ui.aditi[language]}</text><text x="270" y="300" textAnchor="middle" fontSize="18" fontWeight="700" fill="#173d3a">{ui.vihaan[language]}</text>
 </svg></div>;
}
