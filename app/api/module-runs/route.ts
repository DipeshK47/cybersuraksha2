import { getPlayableModuleById } from "../../data/module-registry";
import { saveModuleRun } from "../../../db/academy";
import { deriveRunMetrics } from "../../lib/activity";
import { requireStudent } from "../../lib/student-session";
import { moduleRunSchema, parseJson } from "../../lib/validation";

function percentage(value: unknown) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0;
  return Math.min(100, Math.max(0, Math.round(numeric)));
}

function duration(value: unknown) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0;
  return Math.min(7_200, Math.max(0, Math.round(numeric)));
}

/**
 * Record a completed module run for the SIGNED-IN student.
 *
 * The studentId comes from the verified session, never the request body, so a
 * student cannot post a run for anyone else. When the student emitted activity
 * events for this module, drill/recall/leaks are recomputed from those events
 * server-side and the client-reported figures are ignored — defeating naive
 * score spoofing. Only when no events exist do we accept clamped client values
 * (e.g. modules not yet instrumented).
 */
export async function POST(request: Request) {
  const session = await requireStudent(request);
  if (session instanceof Response) return session;
  const studentId = session.student.id;

  const parsed = await parseJson(request, moduleRunSchema);
  if (parsed.error) return parsed.error;
  const payload = parsed.data;

  const playableModule = getPlayableModuleById(payload.moduleId ?? "");
  if (!playableModule) {
    return Response.json({ error: "Module not found." }, { status: 404 });
  }

  const derived = await deriveRunMetrics(studentId, playableModule.id);
  const useDerived = derived.hasEvents && derived.questionsAnswered > 0;

  const drill = useDerived ? derived.drill : percentage(payload.drill);
  const recall = useDerived ? derived.recall : percentage(payload.recall);
  const leaks = useDerived
    ? derived.leaks
    : Math.max(0, Math.round(Number(payload.leaks) || 0));

  const run = await saveModuleRun({
    studentId,
    moduleId: playableModule.id,
    moduleTitle: playableModule.title,
    rank: ["GHOST", "GUARDED", "EXPLORER"].includes(payload.rank ?? "")
      ? payload.rank!
      : "EXPLORER",
    leaks,
    drill,
    recall,
    path: payload.path === "supported" ? "supported" : "independent",
    durationSeconds: duration(payload.durationSeconds),
  });

  if (!run) {
    return Response.json({ error: "Student not found." }, { status: 404 });
  }

  return Response.json({ run, source: useDerived ? "derived" : "reported" });
}
