"use client";
import {useEvidenceLanguage} from '../class8/ui';
import {class9Ui} from './ui';
import s from './class9.module.css';

/** Original vector portraits for this edition; expressions respond to the story. */
export function Class9Characters({mood,playing,reduced=false}:{mood:string;playing:boolean;reduced?:boolean}) {
  const language=useEvidenceLanguage();
  const worried=['surprise','sad','thinking','concerned'].includes(mood);
  return <div translate="no" data-class9-characters><svg className={s.characters} viewBox="0 0 360 300" role="img" aria-label={class9Ui.characters[language]} data-animated={playing&&!reduced} data-mood={mood}>
    <ellipse cx="180" cy="274" rx="151" ry="14" fill="#bec4e2" opacity=".35"/>
    <g className={s.reva}>
      <path d="M52 112C35 64 54 24 97 24c43 0 62 41 46 91l-17 99-55-5Z" fill="#302e40"/>
      <path d="M65 158Q97 139 132 158l18 94H47Z" fill="#dd9854" stroke="#342f45" strokeWidth="3"/>
      <path d="m72 158 26 31 26-31 7 94H66Z" fill="#f4c877"/>
      <path d="M85 128v30q13 13 26 0v-30" fill="#b87353" stroke="#342f45" strokeWidth="3"/>
      <ellipse cx="98" cy="93" rx="39" ry="47" fill="#cb8b68" stroke="#342f45" strokeWidth="3"/>
      <path d="M59 86q-1-55 38-53 41-1 40 54-22-7-31-34-18 28-47 33" fill="#302e40"/>
      <path d="M60 65q38-33 76 0" fill="none" stroke="#e9b847" strokeWidth="8"/>
      <path d={worried?'m76 83 12-4m20 0 12 4':'m76 81 12-1m20 0 12 1'} stroke="#302e40" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="83" cy="94" r="3" fill="#302e40"/><circle cx="113" cy="94" r="3" fill="#302e40"/>
      <path d="m98 95-3 14h6" stroke="#925c48" fill="none" strokeWidth="2"/>
      <path d={worried?'M87 121q11-5 22 0':'M85 117q13 12 26 0'} fill="none" stroke="#663d3c" strokeWidth="3" strokeLinecap="round"/>
      <path d="m68 183-12 51 32 6m40-57 12 51-32 6" fill="none" stroke="#cb8b68" strokeWidth="13" strokeLinecap="round"/>
      <rect x="77" y="195" width="45" height="51" rx="4" fill="#fcf5d8" stroke="#64536e" strokeWidth="3" transform="rotate(-8 99 220)"/>
      <path d="m88 208 22-3m-20 13 18-3m-17 13 19-3" stroke="#7c9a92" strokeWidth="3"/>
      <text x="98" y="290" textAnchor="middle" fill="#342f45" fontSize="16" fontWeight="700">{class9Ui.reva[language]}</text>
    </g>
    <g className={s.nikhil}>
      <path d="M213 161q32-20 65 0l22 91h-107Z" fill="#397e7c" stroke="#342f45" strokeWidth="3"/>
      <path d="m230 155 15 23 16-23 10 97h-49Z" fill="#d9e9d6"/>
      <path d="M233 130v27q13 12 26 0v-27" fill="#b7835f" stroke="#342f45" strokeWidth="3"/>
      <ellipse cx="246" cy="93" rx="40" ry="47" fill="#d0a078" stroke="#342f45" strokeWidth="3"/>
      <path d="M205 91q-9-29 4-42 2-17 17-15 14-20 29-5 23-8 29 10 15 6 9 27l-10 28-4-33-24 3-22-15-20 19Z" fill="#292c3e"/>
      <path d={worried?'m219 81 15-4m23 0 15 4':'m219 79 15-1m23 0 15 1'} stroke="#292c3e" strokeWidth="3" strokeLinecap="round"/>
      <g fill="none" stroke="#342f45" strokeWidth="3"><rect x="214" y="85" width="25" height="21" rx="7"/><rect x="252" y="85" width="25" height="21" rx="7"/><path d="M239 92h13m-45-3 7 3m63 0 7-3"/></g>
      <circle cx="227" cy="95" r="3" fill="#292c3e"/><circle cx="264" cy="95" r="3" fill="#292c3e"/>
      <path d="m245 96-3 14h6" stroke="#996e50" fill="none" strokeWidth="2"/>
      <path d={worried?'M235 121q11-5 22 0':'M233 117q13 12 26 0'} fill="none" stroke="#704540" strokeWidth="3" strokeLinecap="round"/>
      <path d="m214 184-12 49 31 7m47-56 11 49-30 7" fill="none" stroke="#d0a078" strokeWidth="13" strokeLinecap="round"/>
      <rect x="225" y="202" width="49" height="38" rx="5" fill="#d0a154" stroke="#342f45" strokeWidth="3"/>
      <path d="M237 202v-9h25v9m-37 15h49" fill="none" stroke="#342f45" strokeWidth="3"/>
      <text x="246" y="290" textAnchor="middle" fill="#342f45" fontSize="16" fontWeight="700">{class9Ui.nikhil[language]}</text>
    </g>
  </svg></div>;
}
