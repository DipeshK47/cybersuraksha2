import { KeyRound } from "lucide-react";
import { ALPHABET, ringPosition } from "./lesson-helpers";
import styles from "./secret-message-rescue.module.css";

export function CipherWheel({
  shift,
  compact = false,
  label = "Interactive Caesar Cipher wheel",
}: {
  shift: number;
  compact?: boolean;
  label?: string;
}) {
  const rotation = -(shift * 360) / 26;

  return (
    <div
      aria-label={`${label}. Shift ${shift}. Outer ring shows plain letters and inner ring shows coded letters.`}
      className={`${styles.cipherWheel} ${compact ? styles.cipherWheelCompact : ""}`}
      role="img"
    >
      <div className={styles.outerRing}>
        {ALPHABET.map((letter, index) => (
          <span key={`outer-${letter}`} style={ringPosition(index, 46)}>
            {letter}
          </span>
        ))}
      </div>
      <div
        className={styles.innerRing}
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {ALPHABET.map((letter, index) => (
          <span
            key={`inner-${letter}`}
            style={{
              ...ringPosition(index, 34),
              transform: `translate(-50%, -50%) rotate(${-rotation}deg)`,
            }}
          >
            {letter}
          </span>
        ))}
      </div>
      <div className={styles.wheelCore}>
        <KeyRound aria-hidden="true" />
        <small>Key</small>
        <strong>+{shift}</strong>
      </div>
    </div>
  );
}
