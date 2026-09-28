"use client";

import { MoveRight } from "lucide-react";
import { useState } from "react";
import styles from "./simulation-shells.module.css";

export type DragCard = { id: string; label: string; icon: string; destination?: string };
export type DragDestination = { id: string; label: string; icon: string };

export function DragBoard({ cards, destinations, placements, onMove }: { cards: DragCard[]; destinations: DragDestination[]; placements: Record<string, string>; onMove: (cardId: string, destination: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null);

  function moveSelected(destination: string) {
    if (!selected) return;
    onMove(selected, destination);
    setSelected(null);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, cardId: string) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    setSelected((current) => current === cardId ? null : cardId);
  }

  return (
    <section className={styles.dragBoard}>
      <div aria-label="Items to move" className={styles.dragCards}>
        {cards.filter((card) => !placements[card.id]).map((card) => (
          <button aria-pressed={selected === card.id} draggable key={card.id} onClick={() => setSelected(card.id)} onDragStart={(event) => event.dataTransfer.setData("text/plain", card.id)} onKeyDown={(event) => onKeyDown(event, card.id)} type="button">
            <span aria-hidden="true">{card.icon}</span><b>{card.label}</b><MoveRight aria-hidden="true" />
          </button>
        ))}
      </div>
      <div className={styles.dragDestinations}>
        {destinations.map((destination) => (
          <button className={selected ? styles.destinationReady : ""} key={destination.id} onClick={() => moveSelected(destination.id)} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); onMove(event.dataTransfer.getData("text/plain"), destination.id); }} type="button">
            <span aria-hidden="true">{destination.icon}</span><strong>{destination.label}</strong>
            <div>{cards.filter((card) => placements[card.id] === destination.id).map((card) => <i key={card.id}>{card.icon}<small>{card.label}</small></i>)}</div>
          </button>
        ))}
      </div>
    </section>
  );
}
