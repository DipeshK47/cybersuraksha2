"use client";

import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Pause, Play } from "lucide-react";
import type { ReactNode } from "react";
import styles from "./simulation-shells.module.css";

export type GameDirection = "left" | "right" | "up" | "down";

export function GameShell({
  title,
  player,
  score,
  paused,
  world,
  overlay,
  onMove,
  onTogglePause,
}: {
  title: string;
  player: { x: number; y: number };
  score: number;
  paused: boolean;
  world: ReactNode;
  overlay?: ReactNode;
  onMove: (direction: GameDirection) => void;
  onTogglePause: () => void;
}) {
  function onKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    const direction = ({ ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down" } as const)[event.key as "ArrowLeft"];
    if (!direction) return;
    event.preventDefault();
    onMove(direction);
  }

  return (
    <section aria-label={`${title} game`} className={styles.game} onKeyDown={onKeyDown} tabIndex={0}>
      <header><strong>{title}</strong><span>⭐ {score}</span><button aria-label={paused ? "Resume game" : "Pause game"} onClick={onTogglePause} type="button">{paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}</button></header>
      <div className={styles.gameWorld} style={{ "--player-x": `${player.x}%`, "--player-y": `${player.y}%` } as React.CSSProperties}>
        {world}<span className={styles.gamePlayer} aria-label="Player">🧒🏽</span>{overlay}
      </div>
      <div aria-label="Game controls" className={styles.gameControls}>
        <button aria-label="Move left" onClick={() => onMove("left")} type="button"><ArrowLeft aria-hidden="true" /></button>
        <button aria-label="Move up or jump" onClick={() => onMove("up")} type="button"><ArrowUp aria-hidden="true" /></button>
        <button aria-label="Move down" onClick={() => onMove("down")} type="button"><ArrowDown aria-hidden="true" /></button>
        <button aria-label="Move right" onClick={() => onMove("right")} type="button"><ArrowRight aria-hidden="true" /></button>
      </div>
    </section>
  );
}
