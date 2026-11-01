import { and, asc, eq, gt, inArray, max } from "drizzle-orm";
import { getDb } from "../../../db";
import { activityEvents, students } from "../../../db/schema";
import { requireTeacher, scopedStudentIdsQuery } from "../../lib/auth";
import { getSession, type SessionTeacher } from "../../lib/session";

/**
 * Real-time class activity feed for the signed-in teacher, delivered as
 * Server-Sent Events (SSE). The stream pushes each new activity event for the
 * teacher's scoped students within ~2s of it happening.
 *
 * Why SSE here: it needs no extra bindings, works through the standard
 * request/response path (including local Miniflare), and a teacher dashboard
 * is a low-fan-out consumer. For high-scale production (hundreds of concurrent
 * watchers per class, sub-second latency, no DB polling) the recommended
 * upgrade is a Durable Object per class that holds the roster in memory and
 * fans out over WebSockets — the client contract (one JSON event per activity)
 * stays identical, so only this endpoint changes.
 *
 * Every poll re-reads the session and the teacher's class scope, so logout,
 * expiry, suspension or a removed class assignment ends the feed within one
 * poll instead of when the browser happens to reconnect.
 */

const POLL_INTERVAL_MS = 2_000;
const BATCH_LIMIT = 100;

type LiveEvent = {
  id: number;
  studentId: number;
  studentName: string;
  className: string;
  moduleId: string;
  type: string;
  payload: string | null;
  createdAt: string;
};

async function fetchSince(
  teacher: SessionTeacher,
  afterId: number,
): Promise<LiveEvent[]> {
  return getDb()
    .select({
      id: activityEvents.id,
      studentId: activityEvents.studentId,
      studentName: students.name,
      className: students.className,
      moduleId: activityEvents.moduleId,
      type: activityEvents.type,
      payload: activityEvents.payload,
      createdAt: activityEvents.createdAt,
    })
    .from(activityEvents)
    .innerJoin(students, eq(activityEvents.studentId, students.id))
    .where(
      and(
        inArray(activityEvents.studentId, scopedStudentIdsQuery(teacher)),
        gt(activityEvents.id, afterId),
      ),
    )
    .orderBy(asc(activityEvents.id))
    .limit(BATCH_LIMIT);
}

export async function GET(request: Request) {
  const auth = await requireTeacher(request);
  if (auth instanceof Response) return auth;

  // Start from the current tail so only NEW activity is streamed.
  const [tail] = await getDb()
    .select({ id: max(activityEvents.id) })
    .from(activityEvents)
    .where(inArray(activityEvents.studentId, scopedStudentIdsQuery(auth)));
  let lastId = tail?.id ?? 0;

  const encoder = new TextEncoder();
  let closed = false;
  const stop = () => {
    closed = true;
  };
  request.signal.addEventListener("abort", stop);

  const stream = new ReadableStream({
    async start(controller) {
      const send = (line: string) => controller.enqueue(encoder.encode(line));
      send(`retry: 3000\n\n`); // first bytes open the stream for the browser

      const poll = async () => {
        if (closed) {
          try {
            controller.close();
          } catch {
            // already closed
          }
          return;
        }
        try {
          const session = await getSession(request);
          if (!session) {
            // Signed out, expired or suspended: end the feed. The browser's
            // reconnect then receives a 401 and stops.
            stop();
            controller.close();
            return;
          }
          const events = await fetchSince(session.teacher, lastId);
          for (const event of events) {
            lastId = Math.max(lastId, event.id);
            send(`event: activity\ndata: ${JSON.stringify(event)}\n\n`);
          }
          send(`: ping ${Date.now()}\n\n`); // heartbeat keeps intermediaries open
        } catch {
          // Transient DB error — keep the stream alive and retry next tick.
        }
        if (!closed) setTimeout(poll, POLL_INTERVAL_MS);
      };
      setTimeout(poll, 1_000);
    },
    cancel() {
      stop();
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      connection: "keep-alive",
      "x-accel-buffering": "no",
    },
  });
}
