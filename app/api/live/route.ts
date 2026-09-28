import { and, asc, eq, gt, inArray } from "drizzle-orm";
import { getDb } from "../../../db";
import { activityEvents, students } from "../../../db/schema";
import { requireTeacher, scopedStudentIds } from "../../lib/auth";

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
  studentIds: number[],
  afterId: number,
): Promise<LiveEvent[]> {
  if (studentIds.length === 0) return [];
  const rows = await getDb()
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
        inArray(activityEvents.studentId, studentIds),
        gt(activityEvents.id, afterId),
      ),
    )
    .orderBy(asc(activityEvents.id))
    .limit(BATCH_LIMIT);
  return rows;
}

export async function GET(request: Request) {
  const auth = await requireTeacher(request);
  if (auth instanceof Response) return auth;

  const studentIds = await scopedStudentIds(auth);

  // Start from the current tail so only NEW activity is streamed.
  const initial = await fetchSince(studentIds, 0);
  let lastId = initial.reduce((max, event) => Math.max(max, event.id), 0);

  const encoder = new TextEncoder();
  let closed = false;
  const stop = () => {
    closed = true;
  };
  request.signal.addEventListener("abort", stop);

  const stream = new ReadableStream({
    async start(controller) {
      const send = (line: string) => controller.enqueue(encoder.encode(line));
      send(`retry: 3000\n`);
      send(`: connected ${studentIds.length} students\n\n`);

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
          const events = await fetchSince(studentIds, lastId);
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
