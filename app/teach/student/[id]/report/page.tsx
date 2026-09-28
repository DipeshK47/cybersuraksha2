"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FileDown, ShieldCheck, Target } from "lucide-react";
import { getJson } from "../../../../lib/read-json";

type Student = {
  id: number;
  className: string;
  rollNo: string;
  name: string;
};

type Run = {
  id: number;
  moduleTitle: string;
  rank: string;
  leaks: number;
  drill: number;
  recall: number;
};

function average(values: number[]) {
  if (!values.length) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

export default function ParentReportPage() {
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

  const safetyScore = useMemo(() => {
    if (!runs.length) return 0;
    return Math.round((average(runs.map((run) => run.drill)) + average(runs.map((run) => run.recall))) / 2);
  }, [runs]);
  const latest = runs[runs.length - 1];
  const rank = latest?.rank ?? "READY";
  const totalLeaks = runs.reduce((sum, run) => sum + run.leaks, 0);

  if (loading) return <main className="parentReportPage"><p>Preparing report…</p></main>;
  if (!student) return <main className="parentReportPage"><p>Student not found.</p></main>;

  return (
    <main className="parentReportPage">
      <header className="parentReportActions">
        <Link href={`/teach/student/${student.id}`}>← Back to full report</Link>
        <button onClick={() => window.print()} type="button">
          <FileDown aria-hidden="true" /> Save as PDF
        </button>
      </header>

      <article className="parentReportPaper">
        <section className="parentReportHero">
          <p>Delhi Public School, R.K. Puram · CyberSuraksha</p>
          <h1>{student.name}</h1>
          <span>Personal Cyber-Safety Progress Report</span>
          <div>Class {student.className} · Roll {student.rollNo}</div>
          <div>Lessons completed: {runs.length} · Missions played: {new Set(runs.map((run) => run.moduleTitle)).size}</div>
          <div className="safetyDial">
            <strong>{safetyScore}</strong>
            <span>Safety</span>
          </div>
          <b className="parentRank">Cyber {rank.charAt(0) + rank.slice(1).toLowerCase()}</b>
        </section>

        <section className="parentReportBody">
          <div className="parentSectionTitle">
            <Target aria-hidden="true" />
            <h2>What {student.name.split(" ")[0]} learned</h2>
          </div>
          <p>
            Each mission is a short, interactive story that places the student
            inside a realistic online situation and teaches how to spot danger
            before it is too late.
          </p>
          <article className="parentLessonCard">
            <div>
              <h3>{latest?.moduleTitle ?? "Sample cyber-safety mission"}</h3>
              <span>Cyber {rank.charAt(0) + rank.slice(1).toLowerCase()}</span>
            </div>
            <p>
              How online strangers act friendly to collect personal details,
              and how to verify who is really behind an account.
            </p>
          </article>

          <div className="parentSectionTitle">
            <ShieldCheck aria-hidden="true" />
            <h2>How {student.name.split(" ")[0]} did</h2>
          </div>
          <section className="parentScoreGrid">
            <article><strong>{average(runs.map((run) => run.drill))}%</strong><span>Spotting fakes and tricks</span></article>
            <article><strong>{average(runs.map((run) => run.recall))}%</strong><span>Remembering the safety lesson</span></article>
            <article><strong>{Math.max(0, 5 - totalLeaks)}</strong><span>Smart, safe choices ✓</span></article>
            <article><strong>{totalLeaks}</strong><span>Moments they slipped ⚠</span></article>
          </section>

          <h2>Moments that mattered</h2>
          <p>
            These are useful practice points, not failures. Discussing them at
            home helps the safe response become automatic.
          </p>
          <div className="parentAdvice">
            <b>Keep specific locations and family routines out of public chats.</b>
            <span>Take a screenshot and show a trusted adult whenever a chat feels wrong.</span>
            <span>Slow down before replying. Scammers rely on urgency.</span>
          </div>

          <h3>How you can help at home</h3>
          <p>
            Ask {student.name.split(" ")[0]} to explain one safety mission in
            their own words. Agree on one simple family rule and revisit it
            together.
          </p>
          <footer>
            Staying safe online is a skill, not a test. Students build it
            one mission at a time.
          </footer>
        </section>
      </article>
    </main>
  );
}
