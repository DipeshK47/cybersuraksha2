import type {LessonChapter} from '../../../../data/lesson-content';
import s from './class9.module.css';

export function Class9Illustration({theme,caption,resolved=false}:{theme:LessonChapter['sceneTheme'];caption:string;resolved?:boolean}) {
  const data=['signals','device','evidence','magazine'].includes(theme);
  const route=theme==='robot';
  return <figure className={s.illustration} data-class9-illustration={theme} data-resolved={resolved}>
    <svg viewBox="0 0 640 260" aria-hidden="true">
      <rect width="640" height="260" fill="#e9e9f4"/>
      <path d="M0 190q160-34 320 0t320 0v70H0Z" fill="#d2e1de"/>
      <path d="M32 229h576" stroke="#82788f" strokeWidth="12" strokeLinecap="round"/>
      <rect x="28" y="25" width="107" height="139" rx="9" fill="#f4edda" stroke="#b3abbf" strokeWidth="5"/>
      <path d="M43 54h76M43 78h54M43 102h70M43 126h38" stroke="#b6c4bd" strokeWidth="5"/>
      <circle cx="577" cy="47" r="23" fill="#eac76e"/>
      {route?<g><rect x="181" y="27" width="228" height="177" rx="10" fill="#fffdf6" stroke="#665a85" strokeWidth="5"/>
        {[0,1,2,3].map(row=>[0,1,2,3,4].map(col=><rect key={`${row}-${col}`} x={190+col*42} y={36+row*39} width="34" height="31" rx="4" fill={row===1&&col===2?'#b7a8c9':'#d7e8de'}/>))}
        <path d={resolved?'M207 50v117h168':'M207 50h84v39'} stroke={resolved?'#357f70':'#c48b4c'} strokeWidth="9" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx={resolved?375:291} cy={resolved?167:89} r="12" fill="#51476e"/>
      </g>:data?<g>
        <rect x="171" y="35" width="261" height="154" rx="13" fill="#51476e"/>
        <rect x="182" y="46" width="239" height="132" rx="6" fill="#fcfaf0"/>
        <path d="M294 189v28m-45 0h90" stroke="#51476e" strokeWidth="9" strokeLinecap="round"/>
        <rect x="197" y="64" width="66" height="8" rx="4" fill="#aac7bc"/>
        <path d="M203 154v-40m31 40v-63m31 63v-30m31 30V83m31 71v-54" stroke="#7ba998" strokeWidth="17"/>
        <path d="m350 95 12 12 25-29" stroke={resolved?'#3e8c77':'#c79e5a'} strokeWidth="7" fill="none"/>
        <path d="M345 133h50m-50 16h38" stroke="#b6aac6" strokeWidth="5"/>
      </g>:<g>
        <rect x="181" y="118" width="237" height="89" rx="9" fill="#cc985d" stroke="#6c5667" strokeWidth="5"/>
        <path d="M242 118V92h110v26m-171 35h237" fill="none" stroke="#6c5667" strokeWidth="6"/>
        <rect x="283" y="143" width="33" height="20" rx="3" fill="#f7e5ad"/>
        <path d="m224 115 20-55m15 55-3-59m82 59 25-51" stroke="#628c85" strokeWidth="13" strokeLinecap="round"/>
        <circle cx="245" cy="47" r="15" fill="none" stroke="#628c85" strokeWidth="9"/>
      </g>}
      <rect x="467" y="103" width="110" height="112" rx="7" fill="#fcf7e8" stroke="#ab94b4" strokeWidth="4" transform="rotate(7 522 159)"/>
      <path d="M484 126h64m-64 20h52m-52 20h58" stroke="#a7beb5" strokeWidth="5"/>
      <path d={resolved?'m490 186 14 12 31-31':'M492 188h40'} stroke={resolved?'#367e70':'#c28b51'} strokeWidth="7" fill="none" strokeLinecap="round"/>
    </svg><figcaption>{caption}</figcaption>
  </figure>;
}
