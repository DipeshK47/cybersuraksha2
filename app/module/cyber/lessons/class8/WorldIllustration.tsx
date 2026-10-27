import type { Class8Chapter } from "../../../../data/class8/types";
import s from "./class8.module.css";

/** Original code-native classroom illustrations; no external images or network requests. */
export function WorldIllustration({ theme, caption, resolved = false }: { theme: Class8Chapter["sceneTheme"]; caption: string; resolved?: boolean }) {
  const device = theme === "device" || theme === "market" || theme === "evidence";
  const garden = theme === "garden";
  const robot = theme === "robot";
  return <figure className={s.illustration} data-resolved={resolved}>
    <svg viewBox="0 0 700 340" aria-hidden="true" focusable="false">
      <rect width="700" height="340" fill="#deece4" />
      <circle cx="604" cy="64" r="35" fill="#f1cc76" />
      <path d="M0 253 Q160 215 330 254 T700 235 V340 H0Z" fill="#b4d0bb" />
      <rect x="41" y="45" width="210" height="165" rx="8" fill="#f6f1de" stroke="#a8c2b1" strokeWidth="7" />
      <path d="M111 45V210M181 45V210M41 126H251" stroke="#a8c2b1" strokeWidth="5" />
      <path d="M37 302H663" stroke="#9a754e" strokeWidth="14" strokeLinecap="round" />
      {device ? <g>
        <rect x="267" y="43" width="228" height="232" rx="22" fill="#204b5b" />
        <rect x="281" y="58" width="200" height="197" rx="10" fill="#fcfbef" />
        <rect x="302" y="82" width="158" height="23" rx="7" fill={resolved ? "#7bb89c" : "#efc576"} />
        <rect x="302" y="122" width="110" height="10" rx="4" fill="#bed3c7" />
        <rect x="302" y="145" width="151" height="10" rx="4" fill="#bed3c7" />
        <rect x="302" y="171" width="151" height="42" rx="7" fill={resolved ? "#e1eee3" : "#f4dfbf"} />
        {resolved ? <path d="m354 189 13 12 22-27" fill="none" stroke="#3f8467" strokeWidth="7" /> : <path d="M373 180v15m0 8v2" stroke="#a46d39" strokeWidth="5" />}
        <circle cx="381" cy="266" r="5" fill="#c8ddcf" />
        <path d="M521 150h75v99h-75z" fill="#fff8dd" stroke="#ae966d" strokeWidth="3" />
        <path d="m537 181 8 8 21-21m-29 39h42m-42 18h33" fill="none" stroke="#6b9c82" strokeWidth="4" />
      </g> : garden ? <g>
        {[0,1,2].map(i => <g key={i} transform={`translate(${296+i*103},0)`}><path d="M-29 238H35L23 292h-41Z" fill="#c78358" /><path d="M4 238v-89" stroke="#4c805c" strokeWidth="6" /><path d="M4 194q-57-43-40-8 20 23 40 8m0-25q51-51 41-13-9 25-41 13" fill="#699d68" />{resolved && <circle cx="4" cy="144" r="12" fill="#f0c66a" />}</g>)}
        <path d="M271 271h310" stroke="#976b47" strokeWidth="5" />
      </g> : robot ? <g>
        <g stroke="#9ab7a6" strokeWidth="2">{[0,1,2,3].map(i => <path key={i} d={`M265 ${112+i*45}h306M${265+i*76.5} 112v180`} />)}</g>
        <g transform={`translate(${resolved ? 485 : 300},160)`} data-float><rect width="63" height="61" rx="12" fill="#f6ca6b" stroke="#a27d37" strokeWidth="3" /><rect x="9" y="13" width="45" height="22" rx="8" fill="#245367" /><circle cx="21" cy="24" r="4" fill="#fff" /><circle cx="43" cy="24" r="4" fill="#fff" /><path d="M18 48h27M31 0v-13" stroke="#245367" strokeWidth="4" /><circle cx="31" cy="-15" r="5" fill="#d57c5c" /><rect x="-9" y="17" width="8" height="30" rx="4" fill="#38616b" /><rect x="64" y="17" width="8" height="30" rx="4" fill="#38616b" /></g>
      </g> : <g>
        <rect x="275" y="52" width="312" height="222" rx="6" fill="#c59a64" />
        <rect x="286" y="63" width="290" height="200" rx="3" fill="#efdfbd" />
        <g transform="rotate(-6 346 127)" data-float><rect x="307" y="84" width="100" height="92" fill="#fffbed" /><path d="M321 103h72m-72 15h57m-57 15h65m-65 15h44" stroke="#9bbbaa" strokeWidth="6" /></g>
        <g transform="rotate(5 496 182)"><rect x="443" y="124" width="109" height="112" fill="#e6f0df" />{theme === "signals" ? [0,1,2,3].map(i => <circle key={i} cx={460+i*23} cy="173" r="8" fill={(i+(resolved?1:0))%2 ? "#f0c459" : "#6b9580"} />) : <><path d="M458 207v-30h20v30m8 0v-50h20v50m8 0v-70h20v70" fill="#6d9f89" /><path d="M458 219h77" stroke="#507567" strokeWidth="3" /></>}</g>
        <circle cx="350" cy="82" r="5" fill="#c7654e" /><circle cx="496" cy="123" r="5" fill="#c7654e" />
      </g>}
      <g transform="translate(83 264)"><rect x="0" y="-49" width="75" height="65" rx="7" fill="#5b8b79" /><path d="m10-36 55 8m-55 9 55 8" stroke="#b6d1ae" strokeWidth="3" /><path d="M20-50 14-93m25 43 8-55m7 55 17-39" stroke="#d79d53" strokeWidth="8" /></g>
    </svg>
    <figcaption>{caption}</figcaption>
  </figure>;
}
