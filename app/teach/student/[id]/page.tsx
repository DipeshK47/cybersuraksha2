"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FileText } from "lucide-react";
import { ThemeToggle } from "../../../components/ThemeToggle";
import { getJson } from "../../../lib/read-json";

type Student = {
  id: number;
  className: string;
  rollNo: string;
  name: string;
};

type Run = {
  id: number;
  moduleId: string;
  moduleTitle: string;
  rank: string;
  leaks: number;
  drill: number;
  recall: number;
  durationSeconds: number;
  completedAt: string;
};

function average(values: number[]) {
  if (!values.length) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function duration(totalSeconds: number) {
  return `${Math.floor(totalSeconds / 60)}m ${totalSeconds % 60}s`;
}

function formatDate(value: string) {
  const date = new Date(`${value.replace(" ", "T")}Z`);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
}

export default function StudentReportPage() {
  const params = useParams<{ id: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void getJson<{ student?: Student; runs?: Run[]; error?: string }>(
      `/api/students/${params.id}`,
    ).then((payload) => {
      setStudent(payload.student ?? null);
      setRuns(payload.runs ?? []);
      setLoading(false);
    });
  }, [params.id]);

  const avgDrill = useMemo(() => average(runs.map((run) => run.drill)), [runs]);
  const avgRecall = useMemo(() => average(runs.map((run) => run.recall)), [runs]);
  const totalLeaks = runs.reduce((sum, run) => sum + run.leaks, 0);

  if (loading) {
    return <main className="teacherPage"><p className="reportLoading">Loading student report…</p></main>;
  }
  if (!student) {
    return <main className="teacherPage"><p className="reportLoading">Student not found.</p></main>;
  }

  return (
    <main className="teacherPage reportPage">
      <header className="studentReportNav">
        <span className="teacherWordmark">
          <b>Cyber</b>Suraksha <small>· Student report</small>
        </span>
        <nav>
          <Link href={`/teach/results?class=${student.className}`}>← Results</Link>
          <Link href={`/teach?class=${student.className}`}>Roster</Link>
          <Link className="parentReportLink" href={`/teach/student/${student.id}/report`}>
            <FileText aria-hidden="true" /> Parent report (PDF)
          </Link>
          <Link href="/logout">Log out</Link>
          <ThemeToggle />
        </nav>
      </header>

      <div className="teacherShell reportShell">
        <section className="teacherIntro">
          <h1>{student.name}</h1>
          <p>
            Delhi Public School, R.K. Puram · Class {student.className} · Roll {student.rollNo}
          </p>
        </section>

        <section className="reportMetricGrid">
          <article><strong>{runs.length}</strong><span>Lessons completed</span></article>
          <article><strong>{new Set(runs.map((run) => run.moduleId)).size}</strong><span>Modules played</span></article>
          <article><strong>{avgDrill}%</strong><span>Avg drill score</span></article>
          <article><strong>{avgRecall}%</strong><span>Avg recall score</span></article>
        </section>

        <section className="teacherPanel reportSection">
          <h2>Score over time</h2>
          <p>Drill and recall scores across each completed lesson, oldest to newest.</p>
          {runs.length ? (
            <div className="scoreChart" aria-label="Score over time">
              {runs.map((run, index) => (
                <div className="scoreChartRow" key={run.id}>
                  <span>Attempt {index + 1}</span>
                  <div><i style={{ width: `${run.drill}%` }} /><b>{run.drill}% drill</b></div>
                  <div className="recallBar"><i style={{ width: `${run.recall}%` }} /><b>{run.recall}% recall</b></div>
                </div>
              ))}
            </div>
          ) : (
            <p className="teacherEmpty">No completed lessons yet.</p>
          )}
        </section>

        <section className="teacherPanel reportSection">
          <h2>Modules</h2>
          <div className="tableScroller">
            <table className="teacherTable">
              <thead>
                <tr><th>Module</th><th>Status</th><th>Attempts</th><th>Best drill</th><th>Best recall</th><th>Latest rank</th></tr>
              </thead>
              <tbody>
                {runs.length ? runs.map((run) => (
                  <tr key={run.id}>
                    <td>{run.moduleTitle}</td><td>completed</td><td>1</td>
                    <td>{run.drill}%</td><td>{run.recall}%</td>
                    <td><span className={`rankBadge rank${run.rank}`}>{run.rank}</span></td>
                  </tr>
                )) : (
                  <tr><td colSpan={6}>No modules played yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="teacherPanel reportSection">
          <h2>Where they slipped</h2>
          <p>Moments where this student gave away something they should not have, across all attempts.</p>
          {totalLeaks ? (
            <div className="riskList">
              <article>
                <div><strong>Shared personal details with someone they had not verified</strong><span>{totalLeaks}×</span></div>
                <p>✓ Safer move — Keep locations and family routines out of public chats.</p>
              </article>
            </div>
          ) : (
            <p className="teacherEmpty">No risky moments recorded. Excellent awareness.</p>
          )}
        </section>

        <section className="teacherPanel reportSection">
          <h2>Attempt history</h2>
          <div className="tableScroller">
            <table className="teacherTable">
              <thead>
                <tr><th>Date</th><th>Module</th><th>Rank</th><th>Drill</th><th>Recall</th><th>Leaks</th><th>Time</th></tr>
              </thead>
              <tbody>
                {runs.length ? runs.map((run) => (
                  <tr key={run.id}>
                    <td>{formatDate(run.completedAt)}</td><td>{run.moduleTitle}</td><td>{run.rank}</td>
                    <td>{run.drill}%</td><td>{run.recall}%</td><td>{run.leaks}</td><td>{duration(run.durationSeconds)}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={7}>No attempts recorded.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
