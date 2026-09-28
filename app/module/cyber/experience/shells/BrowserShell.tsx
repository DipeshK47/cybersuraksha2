"use client";

import { ArrowLeft, Globe2, LockKeyhole, MoreVertical, Plus, RefreshCw, ShieldAlert, X } from "lucide-react";
import type { ReactNode } from "react";
import styles from "./simulation-shells.module.css";

export type BrowserTab = { id: string; title: string; address: string };

export function BrowserShell({
  tabs,
  activeTab,
  address,
  secure,
  popup,
  children,
  onSelectTab,
  onNavigate,
  onBack,
  onReload,
  onClosePopup,
}: {
  tabs: BrowserTab[];
  activeTab: string;
  address: string;
  secure: boolean;
  popup?: ReactNode;
  children: ReactNode;
  onSelectTab: (tab: BrowserTab) => void;
  onNavigate: (address: string) => void;
  onBack: () => void;
  onReload: () => void;
  onClosePopup?: () => void;
}) {
  return (
    <section aria-label="Simulated web browser" className={styles.browser}>
      <div className={styles.browserTabs}>
        {tabs.map((tab) => (
          <button aria-pressed={tab.id === activeTab} key={tab.id} onClick={() => onSelectTab(tab)} type="button">
            <Globe2 aria-hidden="true" /><span>{tab.title}</span>{tab.id === activeTab ? <X aria-hidden="true" /> : null}
          </button>
        ))}
        <button aria-label="New tab is unavailable in this simulation" disabled type="button"><Plus aria-hidden="true" /></button>
      </div>
      <div className={styles.browserBar}>
        <button aria-label="Back" onClick={onBack} type="button"><ArrowLeft aria-hidden="true" /></button>
        <button aria-label="Reload" onClick={onReload} type="button"><RefreshCw aria-hidden="true" /></button>
        <button aria-label={secure ? "Secure connection details" : "Connection warning"} className={secure ? styles.connectionSafe : styles.connectionRisk} onClick={() => onNavigate(address)} type="button">
          {secure ? <LockKeyhole aria-hidden="true" /> : <ShieldAlert aria-hidden="true" />}
          <span>{address}</span>
        </button>
        <button aria-label="Browser menu" type="button"><MoreVertical aria-hidden="true" /></button>
      </div>
      <div className={styles.browserPage}>{children}</div>
      {popup ? (
        <div className={styles.browserPopup} role="dialog" aria-modal="true">
          {onClosePopup ? <button aria-label="Close pop-up" onClick={onClosePopup} type="button"><X aria-hidden="true" /></button> : null}
          {popup}
        </div>
      ) : null}
    </section>
  );
}
