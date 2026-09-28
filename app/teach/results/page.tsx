"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Printer } from "lucide-react";
import { TeacherHeader } from "../../components/TeacherHeader";
import { getJson } from "../../lib/read-json";
import { playableModules } from "../../data/module-registry";

/**
 * Class results.
 *
 * Two sources, deliberately: `/api/academy` for saved mission runs, and
 * `/api/analytics` for metrics the server derives from real activity events
 * (which a client cannot spoof). `/api/live` streams new events as they
 * happen. Everything is already scoped to the signed-in teacher's classes.
 */

type Student = { id: number; className: string; rollNo: string; name: string };

type Run = {
  id: number;
  studentId: number;
  moduleId: string;
  moduleTitle: string;
  rank: string;
  leaks: number;
  drill: number;
  recall: number;
  path: string;
  durationSeconds: number;
};

type ActivityRow = {
  studentId: number;
  name: string;
  className: string;
  rollNo: string;
  totalEvents: number;
  lastActiveAt: string | null;
  metrics: {
    drill: number;
    recall: number;
    leaks: number;
    hintsUsed: number;
    mistakes: number;
    questionsAnswered: number;
    hasEvents: boolean;
  };
};

type LiveEvent = {
  id: number;
  studentName: string;
  className: string;
  moduleId: string;
  type: string;
  createdAt: string;
};

const ALL_MODULES = "all";
const LIVE_FEED_LIMIT = 40;

const EVENT_LABELS: Record<string, string> = {
  module_started: "started the mission",
  screen_viewed: "opened a new screen",
  question_answered: "answered a question",
  hint_used: "opened a hint",
  mistake: "hit a teaching moment",
  privacy_leak: "shared something risky",
  module_completed: "completed the mission",
};

function average(values: number[]) {
  if (!values.length) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function duration(totalSeconds: number) {
  return `${Math.floor(totalSeconds / 60)}m ${totalSeconds % 60}s`;
}

function relativeTime(value: string | null) {
  if (!value) return "not yet";
  const then = new Date(`${value.replace(" ", "T")}Z`).getTime();
  if (Number.isNaN(then)) return value;
  const minutes = Math.round((Date.now() - then) / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 60 * 24) return `${Math.round(minutes / 60)}h ago`;
  return `${Math.round(minutes / (60 * 24))}d ago`;
}

export default function ResultsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [runs, setRuns] = useState<Run[]>([]);
  const [activity, setActivity] = useState<ActivityRow[]>([]);
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);
  const [liveConnected, setLiveConnected] = useState(false);
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedModule, setSelectedModule] = useState(ALL_MODULES);
  const [loading, setLoading] = useState(true);
  const feedRef = useRef<EventSource | null>(null);

  useEffect(() => {
    // Both calls own the shared loading flag; they resolve together.
    void Promise.all([
      getJson<{ students?: Student[]; runs?: Run[]; error?: string }>(
        "/api/academy",
      ),
      getJson<{ students?: ActivityRow[]; error?: string }>("/api/analytics"),
    ])
      .then(
        ([academy, analytics]: [
          { students?: Student[]; runs?: Run[] },
          { students?: ActivityRow[] },
        ]) => {
          setStudents(academy.students ?? []);
          setRuns(academy.runs ?? []);
          setActivity(analytics.students ?? []);
          setLoading(false);
        },
      )
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    // Live class activity. The stream is teacher-scoped server-side.
    const source = new EventSource("/api/live");
    feedRef.current = source;
    source.onopen = () => setLiveConnected(true);
    source.onerror = () => setLiveConnected(false);
    source.addEventListener("activity", (event) => {
      try {
        const parsed = JSON.parse((event as MessageEvent).data) as LiveEvent;
        setLiveEvents((current) =>
          [parsed, ...current].slice(0, LIVE_FEED_LIMIT),
        );
      } catch {
        // A malformed frame must never break the dashboard.
      }
    });
    return () => {
      source.close();
      feedRef.current = null;
    };
  }, []);

  const classes = useMemo(
    () => Array.from(new Set(students.map((student) => student.className))).sort(),
    [students],
  );

  // Every module a teacher could filter by: the registered playable ones plus
  // anything that already has saved runs (e.g. earlier pilot modules).
  const modules = useMemo(() => {
    const byId = new Map<string, string>(
      playableModules.map((module) => [module.id, module.title]),
    );
    for (const run of runs) {
      if (!byId.has(run.moduleId)) byId.set(run.moduleId, run.moduleTitle);
    }
    return Array.from(byId, ([id, title]) => ({ id, title }));
  }, [runs]);

  const classStudents =
    selectedClass === "all"
      ? students
      : students.filter((student) => student.className === selectedClass);
  const studentIds = new Set(classStudents.map((student) => student.id));

  const selectedRuns = runs.filter(
    (run) =>
      studentIds.has(run.studentId) &&
      (selectedModule === ALL_MODULES || run.moduleId === selectedModule),
  );
  const runByStudent = new Map(selectedRuns.map((run) => [run.studentId, run]));
  const activityByStudent = new Map(
    activity.map((row) => [row.studentId, row]),
  );

  const classActivity = activity.filter((row) => studentIds.has(row.studentId));
  const engaged = classActivity.filter((row) => row.totalEvents > 0);
  const avgLeaks = selectedRuns.length
    ? (
        selectedRuns.reduce((sum, run) => sum + run.leaks, 0) /
        selectedRuns.length
      ).toFixed(1)
    : "0";
  const needsAttention = engaged.filter(
    (row) =>
      row.metrics.leaks >= 2 ||
      (row.metrics.questionsAnswered > 0 && row.metrics.drill < 70),
  );
  const rankCounts = ["GHOST", "GUARDED", "EXPLORER"].map((rank) => ({
    rank,
    count: selectedRuns.filter((run) => run.rank === rank).length,
  }));

  return (
    <main className="teacherPage resultsPage">
      <TeacherHeader active="results" />

      <div className="teacherShell resultsShell">
        <section className="teacherIntro">
          <div className="panelHeading">
            <div>
              <h1>Class results</h1>
              <p>
                Mission results plus activity metrics the server derives from
                what students actually did — not from a score the browser
                reported.
              </p>
            </div>
            <button className="teacherSecondary" onClick={() => window.print()} type="button">
              <Printer aria-hidden="true" /> Print / Save PDF
            </button>
          </div>
        </section>

        <div className="resultFilters">
          <label>
            <span>Class</span>
            <select
              aria-label="Class"
              onChange={(event) => setSelectedClass(event.target.value)}
              value={selectedClass}
            >
              <option value="all">All my classes</option>
              {classes.map((className) => (
                <option key={className}>{className}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Module</span>
            <select
              aria-label="Module"
              onChange={(event) => setSelectedModule(event.target.value)}
              value={selectedModule}
            >
              <option value={ALL_MODULES}>All modules</option>
              {modules.map((module) => (
                <option key={module.id} value={module.id}>
                  {module.title}
                </option>
              ))}
            </select>
          </label>
        </div>

        <section className="metricGrid" aria-label="Class summary">
          <article>
            <strong>
              {selectedRuns.length} / {classStudents.length}
            </strong>
            <span>missions completed</span>
          </article>
          <article>
            <strong>{average(engaged.map((row) => row.metrics.drill))}%</strong>
            <span>avg drill (from activity)</span>
          </article>
          <article>
            <strong>{average(engaged.map((row) => row.metrics.recall))}%</strong>
            <span>avg recall (from activity)</span>
          </article>
          <article>
            <strong>{avgLeaks}</strong>
            <span>avg risky moments</span>
          </article>
          <article>
            <strong>{average(selectedRuns.map((run) => run.durationSeconds))
              ? duration(average(selectedRuns.map((run) => run.durationSeconds)))
              : "—"}</strong>
            <span>avg time taken</span>
          </article>
          <article>
            <strong>
              {engaged.length} / {classStudents.length}
            </strong>
            <span>students active</span>
          </article>
        </section>

        <section className="teacherPanel resultSection">
          <div className="panelHeading">
            <div>
              <p className="teacherKicker">Real time</p>
              <h2>Live class activity</h2>
            </div>
            <span className={`liveBadge${liveConnected ? " liveBadgeOn" : ""}`}>
              {liveConnected ? "connected" : "reconnecting…"}
            </span>
          </div>
          {liveEvents.length ? (
            <ul className="liveFeed">
              {liveEvents.map((event) => (
                <li key={event.id}>
                  <b>{event.studentName}</b>
                  <span>
                    {EVENT_LABELS[event.type] ?? event.type}
                    {" · "}
                    {event.className}
                  </span>
                  <i>{relativeTime(event.createdAt)}</i>
                </li>
              ))}
            </ul>
          ) : (
            <p className="teacherEmpty">
              Nothing yet. Events appear here within a couple of seconds of a
              student working on a mission.
            </p>
          )}
        </section>

        <section className="teacherPanel resultSection">
          <h2>Needs a check-in</h2>
          {needsAttention.length ? (
            <div className="classFilters">
              {needsAttention.map((row) => (
                <Link href={`/teach/student/${row.studentId}`} key={row.studentId}>
                  {row.name} · {row.className}
                </Link>
              ))}
            </div>
          ) : (
            <p className="teacherEmpty">
              No student is currently flagged by risky sharing or a low drill
              score.
            </p>
          )}
        </section>

        <section className="teacherPanel resultSection">
          <h2>Rank distribution</h2>
          {selectedRuns.length ? (
            <div className="rankBars">
              {rankCounts.map((item) => (
                <div key={item.rank}>
                  <span>{item.rank}</span>
                  <i>
                    <b
                      style={{
                        width: `${Math.round((item.count / selectedRuns.length) * 100)}%`,
                      }}
                    />
                  </i>
                  <strong>{item.count}</strong>
                </div>
              ))}
            </div>
          ) : (
            <p className="teacherEmpty">No completed missions in this view yet.</p>
          )}
        </section>

        <section className="teacherPanel resultSection">
          <h2>Students</h2>
          {loading ? (
            <p className="teacherEmpty">Loading results…</p>
          ) : (
            <div className="tableScroller">
              <table className="teacherTable resultTable">
                <thead>
                  <tr>
                    <th>Class</th>
                    <th>Roll</th>
                    <th>Name</th>
                    <th>Rank</th>
                    <th>Drill</th>
                    <th>Recall</th>
                    <th>Hints</th>
                    <th>Risky</th>
                    <th>Time</th>
                    <th>Last active</th>
                  </tr>
                </thead>
                <tbody>
                  {classStudents.map((student) => {
                    const run = runByStudent.get(student.id);
                    const row = activityByStudent.get(student.id);
                    const metrics = row?.metrics;
                    return (
                      <tr key={student.id}>
                        <td>{student.className}</td>
                        <td>{student.rollNo}</td>
                        <td>
                          <Link href={`/teach/student/${student.id}`}>
                            {student.name}
                          </Link>
                        </td>
                        <td>
                          {run ? (
                            <span className={`rankBadge rank${run.rank}`}>
                              {run.rank}
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td>{metrics?.hasEvents ? `${metrics.drill}%` : "—"}</td>
                        <td>{metrics?.hasEvents ? `${metrics.recall}%` : "—"}</td>
                        <td>{metrics?.hintsUsed ?? 0}</td>
                        <td>{metrics?.leaks ?? run?.leaks ?? 0}</td>
                        <td>
                          {run
                            ? `${duration(run.durationSeconds)}${run.durationSeconds < 300 ? " ⚠" : ""}`
                            : "—"}
                        </td>
                        <td>{relativeTime(row?.lastActiveAt ?? null)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          <p className="resultsNote">
            Drill, recall, hints, and risky moments are recomputed on the server
            from recorded activity. ⚠ = finished in under five minutes.
          </p>
        </section>
      </div>
    </main>
  );
}
