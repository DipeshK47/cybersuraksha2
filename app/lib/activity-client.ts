"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Client-side activity emitter used by the interactive modules.
 *
 * Events are queued and flushed as a small debounced batch to POST /api/activity
 * (which binds them to the verified student session server-side). Pending
 * events are flushed on unmount and on pagehide via `keepalive` so a student
 * navigating away does not lose their last actions.
 *
 * Emission is a no-op unless `enabled` (i.e. a real student, not teacher
 * preview) — teacher previews have no student session and must not record data.
 */

export type ActivityEventInput = {
  moduleId: string;
  type: string;
  payload?: unknown;
};

const FLUSH_DELAY_MS = 800;

export function useActivityEmitter(moduleId: string, enabled: boolean) {
  const queue = useRef<ActivityEventInput[]>([]);
  const timer = useRef<number | null>(null);

  const flush = useCallback(() => {
    if (timer.current) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
    if (queue.current.length === 0) return;
    const events = queue.current.splice(0, queue.current.length);
    try {
      void fetch("/api/activity", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ events }),
        keepalive: true,
      }).catch(() => {
        // Best-effort: activity loss must never interrupt the lesson.
      });
    } catch {
      // Ignore — some browsers reject keepalive on large bodies, etc.
    }
  }, []);

  const emit = useCallback(
    (type: string, payload?: unknown) => {
      if (!enabled) return;
      queue.current.push({ moduleId, type, payload });
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(flush, FLUSH_DELAY_MS);
    },
    [enabled, flush, moduleId],
  );

  useEffect(() => {
    if (!enabled) return;
    const onHide = () => flush();
    window.addEventListener("pagehide", onHide);
    window.addEventListener("visibilitychange", onHide);
    return () => {
      window.removeEventListener("pagehide", onHide);
      window.removeEventListener("visibilitychange", onHide);
      flush();
    };
  }, [enabled, flush]);

  return emit;
}
