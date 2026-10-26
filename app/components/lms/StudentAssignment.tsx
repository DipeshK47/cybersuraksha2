"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import type { AssignmentQuestion, Submission, QuestionGrade } from "../../lib/assignment-assessment";
import type { Assignment } from "../../lib/lms-summary";
import { getJson, postJson } from "../../lib/read-json";
import s from "./lms.module.css";

export function StudentAssignment() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<{ assignment: Assignment; submission: Submission | null; error?: string } | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => { let live = true; void getJson<NonNullable<typeof data>>(`/api/lms/inbox/${id}`).then(p => { if (live) { if (p.error) setError(p.error); else { setData(p); if (p.submission) setAnswers(JSON.parse(p.submission.answers)); } } }); return () => { live = false; }; }, [id]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    const { ok, payload } = await postJson<{ submission?: Submission; error?: string }>(`/api/lms/inbox/${id}`, { answers });
    setBusy(false);
    if (!ok || !payload.submission) setError(payload.error ?? "Could not submit answers."); else setData(previous => previous ? { ...previous, submission: payload.submission! } : previous);
  }
  const questions: AssignmentQuestion[] = JSON.parse(data?.assignment.questions ?? "[]");
  const grades: QuestionGrade[] = JSON.parse(data?.submission?.grades ?? "[]");
  return <main className={s.page}><div className={s.shell}><Link className={s.back} href="/learn/assignments">← My assignments</Link>{error && <p role="alert" className={s.error}>{error}</p>}{!data ? !error && <p>Loading assignment…</p> : <><div className={s.intro}><div><h1>{data.assignment.title}</h1><p>{data.assignment.instructions}</p><p>Due {new Date(data.assignment.dueAt).toLocaleString()} · {data.assignment.totalMarks} total marks</p></div></div>
    {data.submission && <section className={s.panel}><h2>{data.submission.gradedAt ? "Your marks and feedback" : "Submitted · awaiting teacher grading"}</h2><p>Submitted {new Date(data.submission.submittedAt).toLocaleString()}{data.submission.submittedAt > data.assignment.dueAt ? " · Late submission" : ""}</p>{data.submission.gradedAt && <p>Custom questions: {grades.reduce((sum, g) => sum + (g.marks ?? 0), 0)} / {questions.reduce((sum, q) => sum + q.marks, 0)} marks</p>}{data.submission.feedback && <p className={s.answer}>{data.submission.feedback}</p>}</section>}
    <form method="post" onSubmit={submit} className={s.form}>{questions.map((q, index) => { const grade = grades.find(g => g.questionId === q.id); return <fieldset className={`${s.panel} ${s.form}`} key={q.id}><legend>Question {index + 1} · {q.marks} marks · {q.topic}</legend><p>{q.prompt}</p>{q.type === "choice" ? q.options.map((option, i) => <label className={s.chapter} key={i}><input type="radio" required name={q.id} value={option} checked={answers[q.id] === option} disabled={!!data.submission} onChange={() => setAnswers(old => ({ ...old, [q.id]: option }))} /><span>{option}</span></label>) : <label className={s.field}>Your answer<textarea className={s.input} required maxLength={4000} value={answers[q.id] ?? ""} disabled={!!data.submission} onChange={e => setAnswers(old => ({ ...old, [q.id]: e.target.value }))} /></label>}{grade && <p>{grade.marks == null ? "Awaiting grading" : `${grade.marks} / ${q.marks} marks`}{grade.feedback && <> · {grade.feedback}</>}</p>}</fieldset>; })}
    {!data.submission && questions.length > 0 && <><p className={s.summaryNote}>Review every answer before submitting. You can submit once. Late answers are accepted and marked as late. Written responses are graded by your teacher.</p><button className={s.primary} disabled={busy} type="submit">{busy ? "Submitting…" : "Submit final answers"}</button></>}{!questions.length && <p>This assignment contains lessons only. Open them from your assignment inbox.</p>}</form>
  </>}</div></main>;
}
