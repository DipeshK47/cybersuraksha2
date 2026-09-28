"use client";

import { ChevronLeft, Home, Signal, Wifi } from "lucide-react";
import type { ReactNode } from "react";
import styles from "./simulation-shells.module.css";

export function PhoneShell({
  title,
  screen,
  status = "Demo phone",
  children,
  onBack,
  onHome,
}: {
  title: string;
  screen: string;
  status?: string;
  children: ReactNode;
  onBack?: () => void;
  onHome: () => void;
}) {
  return (
    <section aria-label={`${title}, ${screen}`} className={styles.phone} data-phone-screen={screen}>
      <div className={styles.phoneStatus}><span>9:41</span><b>{status}</b><Signal aria-hidden="true" /><Wifi aria-hidden="true" /></div>
      <header><button aria-label="Back" disabled={!onBack} onClick={onBack} type="button"><ChevronLeft aria-hidden="true" /></button><strong>{title}</strong><i /></header>
      <div className={styles.phoneScreen}>{children}</div>
      <nav aria-label="Phone controls"><button aria-label="Home" onClick={onHome} type="button"><Home aria-hidden="true" /></button></nav>
    </section>
  );
}
