import { getPlayableModuleById } from "../../data/module-registry";
import { isValidEventType, recordEvent } from "../../lib/activity";
import { requireStudent } from "../../lib/student-session";
import { activitySchema, parseJson } from "../../lib/validation";

type IncomingEvent = {
  moduleId?: string;
  type?: string;
  payload?: unknown;
  runId?: number;
};

/**
 * Ingest one or a small batch of activity events for the signed-in student.
 * The studentId is taken from the verified session — never from the body — so
 * a student can only record their own activity.
 */
export async function POST(request: Request) {
  const session = await requireStudent(request);
  if (session instanceof Response) return session;
  const studentId = session.student.id;

  const parsed = await parseJson(request, activitySchema);
  if (parsed.error) return parsed.error;
  const body = parsed.data;
  const incoming: IncomingEvent[] =
    "events" in body ? body.events : [body];

  let accepted = 0;
  for (const event of incoming) {
    const moduleId = event.moduleId ?? "";
    if (!getPlayableModuleById(moduleId)) continue; // unknown module -> skip
    if (!isValidEventType(event.type)) continue;
    await recordEvent({
      studentId,
      moduleId,
      type: event.type,
      payload: event.payload,
      runId: typeof event.runId === "number" ? event.runId : null,
    });
    accepted += 1;
  }

  return Response.json({ accepted });
}
