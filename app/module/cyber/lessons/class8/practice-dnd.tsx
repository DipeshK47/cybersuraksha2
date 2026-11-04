"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import s from "./boards.module.css";

type Ghost = { x: number; y: number; width: number; height: number; offsetX: number; offsetY: number; node: ReactNode };
type Hit = { id: string; index: number | null };

/** The drop zone under a screen point. Zones mark themselves with data-drop-zone (and data-drop-index). */
function zoneAt(x: number, y: number): Hit | null {
  for (const element of document.elementsFromPoint(x, y)) {
    const zone = (element as HTMLElement).closest<HTMLElement>("[data-drop-zone]");
    if (zone?.dataset.dropZone) return { id: zone.dataset.dropZone, index: zone.dataset.dropIndex == null ? null : Number(zone.dataset.dropIndex) };
  }
  return null;
}

/**
 * Pointer-driven drag and drop that works with a mouse, a finger or a pen.
 * A press that barely moves is a plain tap (the card's own onClick handles it), so every board also works
 * with tap-then-tap and with the keyboard. On touch the page keeps scrolling unless the learner grabs the grip.
 */
export function useDragDrop(onDrop: (id: string, from: string, zone: string, index: number | null) => void) {
  const latest = useRef(onDrop);
  useEffect(() => { latest.current = onDrop; });
  const [ghost, setGhost] = useState<Ghost | null>(null);
  const [over, setOver] = useState<string | null>(null);
  const dragged = useRef(false);
  const stop = useRef<(() => void) | null>(null);
  useEffect(() => () => stop.current?.(), []);

  const begin = useCallback((event: ReactPointerEvent<HTMLElement>, id: string, from: string, preview: ReactNode) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    // A finger can only drag from the grip (marked data-grip), so the rest of the card still scrolls the page.
    if (event.pointerType === "touch" && !(event.target as HTMLElement).closest("[data-grip]")) return;
    const box = event.currentTarget.getBoundingClientRect();
    const origin = { x: event.clientX, y: event.clientY };
    let moving = false, pointer = origin, frame = 0;
    // Holding a card near the top or bottom edge scrolls the page, so a lower row is always reachable.
    const EDGE = 72;
    const scrollWhileNearEdge = () => {
      const fromBottom = window.innerHeight - pointer.y, fromTop = pointer.y;
      const direction = fromBottom < EDGE ? 1 : fromTop < EDGE ? -1 : 0;
      if (direction) {
        window.scrollBy(0, direction * Math.ceil(((EDGE - Math.min(fromBottom, fromTop)) / EDGE) * 22));
        setOver(zoneAt(pointer.x, pointer.y)?.id ?? null);
      }
      frame = window.requestAnimationFrame(scrollWhileNearEdge);
    };
    const move = (e: PointerEvent) => {
      if (!moving && Math.hypot(e.clientX - origin.x, e.clientY - origin.y) < 6) return;
      if (!moving) frame = window.requestAnimationFrame(scrollWhileNearEdge);
      moving = true;
      pointer = { x: e.clientX, y: e.clientY };
      e.preventDefault();
      setGhost({ x: e.clientX, y: e.clientY, width: box.width, height: box.height, offsetX: origin.x - box.left, offsetY: origin.y - box.top, node: preview });
      setOver(zoneAt(e.clientX, e.clientY)?.id ?? null);
    };
    const finish = (e: PointerEvent, cancelled: boolean) => {
      window.cancelAnimationFrame(frame);
      stop.current?.();
      setGhost(null);
      setOver(null);
      if (!moving) return;
      // The click that follows a drag must not also count as a tap.
      dragged.current = true;
      window.setTimeout(() => { dragged.current = false; }, 60);
      const hit = cancelled ? null : zoneAt(e.clientX, e.clientY);
      if (hit) latest.current(id, from, hit.id, hit.index);
    };
    const up = (e: PointerEvent) => finish(e, false);
    const cancel = (e: PointerEvent) => finish(e, true);
    window.addEventListener("pointermove", move, { passive: false });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", cancel);
    stop.current = () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", cancel);
      stop.current = null;
    };
  }, []);

  /** True right after a drag ended, so the card's onClick can ignore the click that follows it. */
  const wasDragged = useCallback(() => dragged.current, []);
  return { begin, ghost, over, wasDragged };
}

/** The card that follows the pointer while dragging. */
export function DragLayer({ ghost, band }: { ghost: Ghost | null; band: "junior" | "senior" }) {
  if (!ghost || typeof document === "undefined") return null;
  return createPortal(
    <div className={s.ghost} data-band={band} aria-hidden="true" style={{ left: ghost.x - ghost.offsetX, top: ghost.y - ghost.offsetY, width: ghost.width, minHeight: ghost.height }}>{ghost.node}</div>,
    document.body,
  );
}
