"use client";

import { WandSparkles } from "lucide-react";
import styles from "./simulation-shells.module.css";

export function SimulationInput({ label, value, fictionalValue, type = "text", onChange }: { label: string; value: string; fictionalValue: string; type?: "text" | "password"; onChange: (value: string) => void }) {
  return (
    <label className={styles.simulationInput}>
      <span>{label}<small>Fictional practice data only</small></span>
      <div><input autoComplete="off" inputMode="text" onChange={(event) => onChange(event.target.value)} spellCheck={false} type={type} value={value} /><button onClick={() => onChange(fictionalValue)} type="button"><WandSparkles aria-hidden="true" /> Fill demo</button></div>
    </label>
  );
}
