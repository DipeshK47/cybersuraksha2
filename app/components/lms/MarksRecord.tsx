"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getJson } from "../../lib/read-json";
import { downloadCsv } from "../../lib/csv";
import type { Progress, StudentRow } from "./types";
import s from "./lms.module.css";

export function MarksRecord({ classId }: { classId: string }) {
  const [data, setData] = useState<{ rows: { student: StudentRow; assignmentId: number; title: string; totalMarks: number; progress: Progress }[]; error?: string } | null>(null);
  useEffect(() => { let live = true; void getJson<NonNullable<typeof data>>("/api/lms/marks").then(p => { if (live) setData(p); }); return () => { live = false; }; }, []);
  const rows = (data?.rows ?? []).filter(row => classId === "all" || row.student.classId === Number(classId));
  return <section className={s.panel}><div className={s.toolbar}><h2>Marks record</h2><Link className={s.secondary} href="/teach/results">Lesson activity</Link><button type="button" className={s.secondary} disabled={!rows.length} onClick={() => downloadCsv("class-marks.csv", [["Student", "Class", "Roll", "Assignment", "Status", "Marks", "Possible", "Completed at"], ...rows.map(row => [row.student.name, row.student.className, row.student.rollNo, row.title, row.progress.status, row.progress.marks ?? "", row.totalMarks, row.progress.completedAt ? new Date(row.progress.completedAt).toISOString() : ""])])}>Download marks CSV</button></div><p className={s.muted}>Blank marks mean work is incomplete or awaits grading. Zero is a recorded mark. Lesson marks are practice estimates; custom multiple-choice questions are server marked and written answers are teacher marked.</p>{data?.error && <p role="alert" className={s.error}>{data.error}</p>}{!data ? <p>Loading marks…</p> : !rows.length ? <p>No published assignment records for this view.</p> : <div className={s.tableWrap}><table className={s.table}><thead><tr><th>Student</th><th>Class / roll</th><th>Assignment</th><th>Status</th><th>Marks</th></tr></thead><tbody>{rows.map(row => <tr key={`${row.assignmentId}:${row.student.id}`}><td><Link href={`/teach/lms/students/${row.student.id}`}>{row.student.name}</Link></td><td>{row.student.className} · {row.student.rollNo}</td><td><Link href={`/teach/lms/${row.assignmentId}`}>{row.title}</Link></td><td>{row.progress.status}</td><td>{row.progress.marks == null ? "—" : `${row.progress.marks} / ${row.totalMarks}`}</td></tr>)}</tbody></table></div>}</section>;
}
