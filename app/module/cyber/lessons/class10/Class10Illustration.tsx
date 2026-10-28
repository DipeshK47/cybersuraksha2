"use client";
import type {LessonChapter} from '../../../../data/lesson-content';
import s from './class10.module.css';
/** Original Decision Lab table: evidence cards, comparison lens and an unmarked decision tray. */
export function Class10Illustration({theme,caption}:{theme:LessonChapter['sceneTheme'];caption:string;resolved?:boolean}) {
 return <figure className={s.illustration} data-class10-illustration={theme}><svg viewBox="0 0 600 250" role="img" aria-label={caption}>
  <rect x="20" y="18" width="560" height="210" rx="30" fill="#d3e8df"/><path d="M45 196h510" stroke="#567c70" strokeWidth="8"/>
  <g transform="rotate(-9 145 125)"><rect x="70" y="58" width="140" height="125" rx="12" fill="#fffbeb" stroke="#346b61" strokeWidth="3"/><path d="M92 88h85m-85 22h64m-64 22h85m-85 22h46" stroke="#96b7a8" strokeWidth="8"/></g>
  <circle cx="294" cy="104" r="47" fill="#e8f8f1" stroke="#196d68" strokeWidth="10"/><path d="m324 141 39 40" stroke="#196d68" strokeWidth="17" strokeLinecap="round"/><circle cx="284" cy="96" r="11" fill="#e9ad68"/><path d="m300 83 17 25-23 12" fill="none" stroke="#759a89" strokeWidth="5"/>
  <path d="m398 157 20-79h103l25 79v31H398Z" fill="#edc77e" stroke="#795e34" strokeWidth="3"/><rect x="432" y="100" width="62" height="49" rx="7" fill="#fffae7"/><path d="M444 117h38m-38 14h26" stroke="#729486" strokeWidth="5"/>
 </svg><figcaption>{caption}</figcaption></figure>;
}
