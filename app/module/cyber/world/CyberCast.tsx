import type { CyberGuide } from "../experience/experience-types";
import styles from "../experience/cyber-experience-frame.module.css";

export type CyberCharacterName = CyberGuide | "Byte";
export type CyberExpression = "ready" | "thinking" | "happy" | "warning";

const characterColours: Record<CyberCharacterName, { shirt: string; accent: string; skin: string }> = {
  Tara: { shirt: "#ff6b7a", accent: "#ffd84d", skin: "#9a552f" },
  Kabir: { shirt: "#4169e1", accent: "#55d6be", skin: "#b96f45" },
  Meera: { shirt: "#7a55c7", accent: "#ffb84d", skin: "#8b4a2d" },
  Byte: { shirt: "#e9f7ff", accent: "#4fd1c5", skin: "#d8eff8" },
};

export function CyberCharacter({
  name,
  expression = "ready",
  active = false,
  compact = false,
}: {
  name: CyberCharacterName;
  expression?: CyberExpression;
  active?: boolean;
  compact?: boolean;
}) {
  const colours = characterColours[name];
  const isByte = name === "Byte";

  return (
    <figure
      className={`${styles.character} ${active ? styles.characterActive : ""} ${
        compact ? styles.characterCompact : ""
      }`}
      data-character={name.toLowerCase()}
    >
      <svg
        aria-label={`${name}, ${expression}`}
        role="img"
        viewBox="0 0 180 220"
      >
        <ellipse cx="90" cy="207" rx="56" ry="10" fill="rgba(20, 25, 38, .16)" />
        {isByte ? (
          <>
            <path d="M90 30V15" stroke="#293247" strokeWidth="7" strokeLinecap="round" />
            <circle cx="90" cy="12" r="8" fill={colours.accent} stroke="#293247" strokeWidth="5" />
            <rect x="38" y="34" width="104" height="92" rx="30" fill={colours.shirt} stroke="#293247" strokeWidth="7" />
            <circle cx="70" cy="76" r="11" fill="#293247" />
            <circle cx="110" cy="76" r="11" fill="#293247" />
            <circle cx="67" cy="72" r="3" fill="white" />
            <circle cx="107" cy="72" r="3" fill="white" />
            <path
              d={expression === "warning" ? "M72 105Q90 91 108 105" : "M70 99Q90 116 110 99"}
              fill="none"
              stroke="#293247"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <rect x="56" y="126" width="68" height="61" rx="18" fill={colours.accent} stroke="#293247" strokeWidth="7" />
            <circle cx="90" cy="151" r="12" fill="#293247" />
            <path d="M64 188v15M116 188v15M48 139l-22 25M132 139l22 25" stroke="#293247" strokeWidth="10" strokeLinecap="round" />
          </>
        ) : (
          <>
            <path
              d={
                name === "Tara"
                  ? "M42 74Q39 22 90 18Q141 22 138 74Z"
                  : name === "Kabir"
                    ? "M43 68Q45 18 90 18Q136 18 138 68Q126 45 108 46Q80 50 43 68Z"
                    : "M35 82Q32 18 90 16Q148 18 145 82Q134 54 116 44Q84 59 35 82Z"
              }
              fill="#25304a"
              stroke="#293247"
              strokeWidth="6"
            />
            <circle cx="90" cy="74" r="48" fill={colours.skin} stroke="#293247" strokeWidth="7" />
            <circle cx="73" cy="70" r="5" fill="#293247" />
            <circle cx="107" cy="70" r="5" fill="#293247" />
            {expression === "thinking" ? (
              <path d="M73 99Q90 91 107 99" fill="none" stroke="#293247" strokeWidth="6" strokeLinecap="round" />
            ) : expression === "warning" ? (
              <path d="M74 101Q90 86 106 101" fill="none" stroke="#293247" strokeWidth="6" strokeLinecap="round" />
            ) : (
              <path d="M72 94Q90 112 108 94" fill="none" stroke="#293247" strokeWidth="6" strokeLinecap="round" />
            )}
            <path d="M69 58l11-3M100 55l11 3" stroke="#293247" strokeWidth="5" strokeLinecap="round" />
            <path d="M57 128Q90 111 123 128L133 190H47Z" fill={colours.shirt} stroke="#293247" strokeWidth="7" strokeLinejoin="round" />
            <path d="M76 127l14 17 14-17" fill={colours.accent} stroke="#293247" strokeWidth="5" strokeLinejoin="round" />
            <path d="M48 142L23 174M132 142l25 32M66 190v17M114 190v17" stroke="#293247" strokeWidth="11" strokeLinecap="round" />
            {name === "Meera" ? <circle cx="90" cy="159" r="8" fill={colours.accent} /> : null}
          </>
        )}
      </svg>
      <figcaption>{name}</figcaption>
    </figure>
  );
}
export function CyberSquad({ guide }: { guide: CyberGuide }) {
  return (
    <div aria-label="Cyber Squad" className={styles.squad}>
      <CyberCharacter active name={guide} compact />
      <CyberCharacter active name="Byte" compact />
    </div>
  );
}
