"use client";

import { Heart, Home, MessageCircle, Search, Send, UserRound } from "lucide-react";
import type { ReactNode } from "react";
import styles from "./simulation-shells.module.css";

export function SocialShell({
  appName = "CircleUp",
  feed,
  message,
  active = "feed",
  children,
  onOpen,
}: {
  appName?: string;
  feed: ReactNode;
  message?: ReactNode;
  active?: "feed" | "search" | "messages" | "profile";
  children?: ReactNode;
  onOpen: (view: "feed" | "search" | "messages" | "profile") => void;
}) {
  return (
    <section aria-label={`${appName} simulated social app`} className={styles.social}>
      <header><strong>{appName}</strong><div><Heart aria-hidden="true" /><button aria-label="Messages" onClick={() => onOpen("messages")} type="button"><Send aria-hidden="true" />{message}</button></div></header>
      <div className={styles.socialFeed}>{active === "feed" ? feed : children}</div>
      <nav aria-label={`${appName} navigation`}>
        <button aria-current={active === "feed" ? "page" : undefined} onClick={() => onOpen("feed")} type="button"><Home aria-hidden="true" /><span>Feed</span></button>
        <button aria-current={active === "search" ? "page" : undefined} onClick={() => onOpen("search")} type="button"><Search aria-hidden="true" /><span>Search</span></button>
        <button aria-current={active === "messages" ? "page" : undefined} onClick={() => onOpen("messages")} type="button"><MessageCircle aria-hidden="true" /><span>Chat</span></button>
        <button aria-current={active === "profile" ? "page" : undefined} onClick={() => onOpen("profile")} type="button"><UserRound aria-hidden="true" /><span>Profile</span></button>
      </nav>
    </section>
  );
}
