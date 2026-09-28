import { getScopedAcademyData } from "../../../db/academy";
import { requireTeacher, scopedStudentIds } from "../../lib/auth";
import { summarizeActivity } from "../../lib/activity";

/**
 * Class analytics for the signed-in teacher, derived from real activity events
 * and scoped strictly to the teacher's assigned classes. A teacher can never
 * see analytics for a class they are not assigned to.
 */
export async function GET(request: Request) {
  const auth = await requireTeacher(request);
  if (auth instanceof Response) return auth;

  const studentIds = await scopedStudentIds(auth);
  const [{ students }, summaries] = await Promise.all([
    getScopedAcademyData(studentIds),
    summarizeActivity(studentIds),
  ]);

  const summaryById = new Map(summaries.map((s) => [s.studentId, s]));
  const rows = students.map((student) => {
    const activity = summaryById.get(student.id);
    return {
      studentId: student.id,
      name: student.name,
      className: student.className,
      rollNo: student.rollNo,
      totalEvents: activity?.totalEvents ?? 0,
      lastActiveAt: activity?.lastActiveAt ?? null,
      metrics: activity?.metrics ?? {
        drill: 0,
        recall: 0,
        leaks: 0,
        hintsUsed: 0,
        mistakes: 0,
        questionsAnswered: 0,
        hasEvents: false,
      },
    };
  });

  const active = rows.filter((row) => row.totalEvents > 0);
  const average = (values: number[]) =>
    values.length
      ? Math.round(values.reduce((sum, v) => sum + v, 0) / values.length)
      : 0;

  const summary = {
    totalStudents: rows.length,
    activeStudents: active.length,
    averageDrill: average(active.map((r) => r.metrics.drill)),
    averageRecall: average(active.map((r) => r.metrics.recall)),
    totalLeaks: rows.reduce((sum, r) => sum + r.metrics.leaks, 0),
    totalHintsUsed: rows.reduce((sum, r) => sum + r.metrics.hintsUsed, 0),
    needsAttention: active
      .filter(
        (r) =>
          r.metrics.leaks >= 2 ||
          (r.metrics.questionsAnswered > 0 && r.metrics.drill < 70),
      )
      .map((r) => ({ name: r.name, className: r.className })),
  };

  return Response.json({ summary, students: rows });
}
