import { recordLearningEvent } from "../../../db/lms";
import { getPlayableModuleById } from "../../data/module-registry";
import { isValidEventType, recordEvent } from "../../lib/activity";
import { requireStudent } from "../../lib/student-session";
import { activitySchema, parseJson } from "../../lib/validation";
import { studentContent } from "../../lib/content-access";
import { permitsModule } from "../../lib/content-policy";

type IncomingEvent = {
  moduleId?: string;
  type?: string;
  payload?: unknown;
  runId?: number;
  attemptKey?: string;
  eventId?: string;
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
  const access = await studentContent(session.student);
  for (const event of incoming) {
    const playable = getPlayableModuleById(event.moduleId ?? "");
    if (playable && !permitsModule(access, playable)) return Response.json({ error: "This content is not assigned to your class." }, { status: 403 });
    if (JSON.stringify(event.payload ?? {}).length > 2000) return Response.json({ error: "Activity details are too long." }, { status: 400 });
  }
  for (const event of incoming) {
    const moduleId = event.moduleId ?? "";
    if (!getPlayableModuleById(moduleId)) continue; // unknown playable -> skip
    if (!isValidEventType(event.type)) continue;
    if (JSON.stringify(event.payload ?? {}).length > 2000) return Response.json({ error: "Activity details are too long." }, { status: 400 });
    let fresh = true;
    if (event.attemptKey && event.eventId) {
      fresh = await recordLearningEvent({ studentId, moduleId, type: event.type, payload: event.payload, attemptKey: event.attemptKey, eventId: event.eventId });
    }
    if (fresh) await recordEvent({
      studentId,
      moduleId,
      type: event.type,
      payload: event.payload,
      runId: null,
    });
    accepted += 1;
  }

  return Response.json({ accepted });
}
