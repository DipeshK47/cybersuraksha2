import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { getDb } from "../../db";
import { activityEvents, learningAttempts, learningEvents } from "../../db/schema";

/**
 * Real-time activity spine.
 *
 * Modules append fine-grained events as a student works; teacher analytics are
 * *derived from these events server-side* rather than trusting a client score.
 * Every recorded event is bound to a verified studentId from the session.
 */

export const ACTIVITY_EVENT_TYPES = [
  "module_started",
  "screen_viewed",
  "question_answered",
  "hint_used",
  "mistake",
  "privacy_leak",
  "module_completed",
  "story_answered",
  "story_viewed",
  "story_feedback",
] as const;

export type ActivityEventType = (typeof ACTIVITY_EVENT_TYPES)[number];

const MAX_PAYLOAD_BYTES = 2_000;

export function isValidEventType(value: unknown): value is ActivityEventType {
  return (
    typeof value === "string" &&
    (ACTIVITY_EVENT_TYPES as readonly string[]).includes(value)
  );
}

/** Append one activity event. Payload is size-bounded and stored as JSON. */
export async function recordEvent(input: {
  studentId: number;
  moduleId: string;
  type: ActivityEventType;
  payload?: unknown;
  runId?: number | null;
}): Promise<void> {
  let payloadText: string | null = null;
  if (input.payload !== undefined && input.payload !== null) {
    const serialized = JSON.stringify(input.payload);
    payloadText =
      serialized.length > MAX_PAYLOAD_BYTES
        ? serialized.slice(0, MAX_PAYLOAD_BYTES)
        : serialized;
  }
  await getDb().insert(activityEvents).values({
    studentId: input.studentId,
    runId: input.runId ?? null,
    moduleId: input.moduleId,
    type: input.type,
    payload: payloadText,
  });
}

type RawEvent = {
  type: string;
  payload: string | null;
};

function parsePayload(payload: string | null): Record<string, unknown> {
  if (!payload) return {};
  try {
    const parsed = JSON.parse(payload);
    return parsed && typeof parsed === "object"
      ? (parsed as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

export type DerivedMetrics = {
  drill: number; // % correct on "drill" questions
  recall: number; // % correct on "recall" questions
  leaks: number; // privacy_leak events
  hintsUsed: number;
  mistakes: number;
  questionsAnswered: number;
  hasEvents: boolean;
};

/** Fold a set of events into normalized metrics. */
export function deriveMetricsFromEvents(events: RawEvent[]): DerivedMetrics {
  let drillTotal = 0;
  let drillCorrect = 0;
  let recallTotal = 0;
  let recallCorrect = 0;
  let leaks = 0;
  let hintsUsed = 0;
  let mistakes = 0;
  let questionsAnswered = 0;

  for (const event of events) {
    const payload = parsePayload(event.payload);
    switch (event.type) {
      case "question_answered": {
        questionsAnswered += 1;
        const correct = payload.correct === true;
        const kind = payload.kind === "recall" ? "recall" : "drill";
        if (kind === "recall") {
          recallTotal += 1;
          if (correct) recallCorrect += 1;
        } else {
          drillTotal += 1;
          if (correct) drillCorrect += 1;
        }
        break;
      }
      case "hint_used":
        hintsUsed += 1;
        break;
      case "mistake":
        mistakes += 1;
        break;
      case "privacy_leak":
        leaks += 1;
        break;
      default:
        break;
    }
  }

  const pct = (correct: number, total: number) =>
    total > 0 ? Math.round((correct / total) * 100) : 0;

  return {
    drill: pct(drillCorrect, drillTotal),
    recall: pct(recallCorrect, recallTotal),
    leaks,
    hintsUsed,
    mistakes,
    questionsAnswered,
    hasEvents: events.length > 0,
  };
}

/** Derive metrics for a single student's work on one module. */
export async function deriveRunMetrics(
  studentId: number,
  moduleId: string,
): Promise<DerivedMetrics> {
  const [latest] = await getDb().select().from(learningAttempts)
    .where(and(eq(learningAttempts.studentId, studentId), eq(learningAttempts.moduleId, moduleId)))
    .orderBy(desc(learningAttempts.startedAt)).limit(1);
  if (latest && !latest.legacy) {
    const rows = await getDb().select().from(learningEvents).where(eq(learningEvents.attemptId, latest.id)).orderBy(asc(learningEvents.createdAt));
    const seen = new Set<string>();
    return deriveMetricsFromEvents(rows.filter(e => {
      if (e.type !== "question_answered") return true;
      const id = String(parsePayload(e.payload).id ?? e.id);
      if (seen.has(id)) return false;
      seen.add(id); return true;
    }));
  }
  const events = await getDb()
    .select({ type: activityEvents.type, payload: activityEvents.payload })
    .from(activityEvents)
    .where(
      and(
        eq(activityEvents.studentId, studentId),
        eq(activityEvents.moduleId, moduleId),
      ),
    )
    .orderBy(asc(activityEvents.id));
  return deriveMetricsFromEvents(events);
}

export type StudentActivitySummary = {
  studentId: number;
  totalEvents: number;
  metrics: DerivedMetrics;
  lastActiveAt: string | null;
};

/** Aggregate activity per student across a set of students (teacher scope). */
export async function summarizeActivity(
  studentIds: number[],
): Promise<StudentActivitySummary[]> {
  if (studentIds.length === 0) return [];
  const rows = await getDb()
    .select({
      studentId: activityEvents.studentId,
      type: activityEvents.type,
      payload: activityEvents.payload,
      createdAt: activityEvents.createdAt,
    })
    .from(activityEvents)
    .where(inArray(activityEvents.studentId, studentIds))
    .orderBy(asc(activityEvents.id));

  const byStudent = new Map<
    number,
    { events: RawEvent[]; lastActiveAt: string | null }
  >();
  for (const row of rows) {
    const bucket = byStudent.get(row.studentId) ?? {
      events: [],
      lastActiveAt: null,
    };
    bucket.events.push({ type: row.type, payload: row.payload });
    bucket.lastActiveAt = row.createdAt;
    byStudent.set(row.studentId, bucket);
  }

  return studentIds.map((studentId) => {
    const bucket = byStudent.get(studentId);
    return {
      studentId,
      totalEvents: bucket?.events.length ?? 0,
      metrics: deriveMetricsFromEvents(bucket?.events ?? []),
      lastActiveAt: bucket?.lastActiveAt ?? null,
    };
  });
}
