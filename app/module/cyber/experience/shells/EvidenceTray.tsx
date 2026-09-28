"use client";

import { Check, Pin } from "lucide-react";
import styles from "./simulation-shells.module.css";

export type EvidenceItem = { id: string; label: string; icon: string; detail?: string };

export function EvidenceTray({ evidence, selected, onToggle }: { evidence: EvidenceItem[]; selected: string[]; onToggle: (id: string) => void }) {
  return (
    <section aria-label="Evidence tray" className={styles.evidence}>
      {evidence.map((item) => {
        const active = selected.includes(item.id);
        return (
          <button aria-pressed={active} key={item.id} onClick={() => onToggle(item.id)} type="button">
            <span aria-hidden="true">{item.icon}</span><b>{item.label}</b>{item.detail ? <small>{item.detail}</small> : null}{active ? <Check aria-hidden="true" /> : <Pin aria-hidden="true" />}
          </button>
        );
      })}
    </section>
  );
}
