"use client";
import { useCallback, useEffect, useRef } from "react";

export type ActivityEventInput = { moduleId: string; type: string; payload?: unknown; attemptKey: string; eventId: string };

/** A durable, idempotent outbox shared by all existing interactive modules. */
export function useActivityEmitter(moduleId: string, enabled: boolean, studentScope = "session") {
  const queue = useRef<ActivityEventInput[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sending = useRef<Promise<void> | null>(null);
  const key = useRef("");
  const loaded = useRef(false);
  const storage = `cyber-activity-${studentScope}-${moduleId}`;
  const initialize = useCallback(() => {
    if (loaded.current) return;
    loaded.current = true;
    try {
      key.current = localStorage.getItem(`${storage}-attempt`) ?? crypto.randomUUID();
      queue.current = JSON.parse(localStorage.getItem(storage) ?? "[]");
      if (!Array.isArray(queue.current)) queue.current = [];
    } catch { key.current = crypto.randomUUID(); queue.current = []; }
  }, [storage]);
  const persist = useCallback(() => {
    try { localStorage.setItem(storage, JSON.stringify(queue.current)); localStorage.setItem(`${storage}-attempt`, key.current); } catch { /* Memory queue still works when storage is unavailable. */ }
  }, [storage]);
  const flush = useCallback(async () => {
    if (!enabled) return;
    initialize();
    if (sending.current) { await sending.current; return; }
    if (timer.current) clearTimeout(timer.current);
    sending.current = (async () => {
      while (queue.current.length) {
        const batch = queue.current.slice(0, 50);
        const response = await fetch("/api/activity", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ events: batch }), keepalive: true });
        if (!response.ok) throw new Error("Learning activity has not synced yet.");
        queue.current.splice(0, batch.length); persist();
      }
    })();
    try { await sending.current; } finally { sending.current = null; }
  }, [enabled, initialize, persist]);
  const emit = useCallback((type: string, payload?: unknown) => {
    if (!enabled) return;
    initialize();
    const p = payload as { restored?: boolean; restarted?: boolean } | undefined;
    if (type === "module_started" && (!p?.restored || p?.restarted)) key.current = crypto.randomUUID();
    queue.current.push({ moduleId, type, payload, attemptKey: key.current, eventId: crypto.randomUUID() }); persist();
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => { void flush().catch(() => { /* Retained for online, next action, or reload. */ }); }, type === "module_completed" ? 0 : 500);
  }, [enabled, flush, initialize, moduleId, persist]);
  useEffect(() => {
    if (!enabled) return;
    const sync = () => { void flush().catch(() => {}); };
    sync();
    const retry = setInterval(sync, 10000);
    window.addEventListener("online", sync); window.addEventListener("pagehide", sync); window.addEventListener("visibilitychange", sync);
    return () => { clearInterval(retry); window.removeEventListener("online", sync); window.removeEventListener("pagehide", sync); window.removeEventListener("visibilitychange", sync); sync(); };
  }, [enabled, flush]);
  return { emit, flush };
}
