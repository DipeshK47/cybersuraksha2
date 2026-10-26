"use client";
import { useState, type FormEvent } from "react";
import type { AssignmentQuestion, QuestionGrade, Submission } from "../../lib/assignment-assessment";
import { readJson } from "../../lib/read-json";
import s from "./lms.module.css";

export function QuestionEditor({ questions, onChange }: { questions: AssignmentQuestion[]; onChange: (value: AssignmentQuestion[]) => void }) {
  function update(id: string, values: Partial<AssignmentQuestion>) { onChange(questions.map(q => q.id === id ? { ...q, ...values } : q)); }
  return <section className={s.panel}><h2>Custom questions</h2><p className={s.muted}>Multiple-choice answers are marked on the server. Written answers wait for your grading. Tag each question with a section to track learning gaps.</p><div className={s.stack}>{questions.map((q, index) => <fieldset className={s.form} key={q.id}><legend>Question {index + 1}</legend>
    <label className={s.field}>Question<textarea aria-label="Question" className={s.input} required maxLength={2000} value={q.prompt} onChange={e => update(q.id, { prompt: e.target.value })} /></label>
    <div className={s.row}><label className={s.field}>Section / skill<input className={s.input} required maxLength={120} value={q.topic} onChange={e => update(q.id, { topic: e.target.value })} placeholder="e.g. Recognising phishing" /></label><label className={s.field}>Marks<input className={s.input} type="number" required min="0.01" max="1000" step="0.01" value={q.marks} onChange={e => update(q.id, { marks: Number(e.target.value) })} /></label></div>
    <label className={s.field}>Answer type<select className={s.select} value={q.type} onChange={e => update(q.id, { type: e.target.value as AssignmentQuestion["type"], options: e.target.value === "choice" ? ["", "", "", ""] : [], correctAnswer: undefined })}><option value="text">Written response · teacher marked</option><option value="choice">Multiple choice · automatically marked</option></select></label>
    {q.type === "choice" && <><div className={s.row}>{q.options.map((option, i) => <label className={s.field} key={i}>Option {i + 1}<input className={s.input} required maxLength={500} value={option} onChange={e => { const options = q.options.map((old, n) => n === i ? e.target.value : old); update(q.id, { options, correctAnswer: q.correctAnswer === option ? e.target.value : q.correctAnswer }); }} /></label>)}</div><label className={s.field}>Correct answer<select aria-label="Correct answer" className={s.select} required value={q.correctAnswer ?? ""} onChange={e => update(q.id, { correctAnswer: e.target.value })}><option value="">Choose the answer</option>{q.options.filter(Boolean).map((option, i) => <option key={i} value={option}>{option}</option>)}</select></label></>}
    <button type="button" className={s.secondary} onClick={() => onChange(questions.filter(row => row.id !== q.id))}>Remove question {index + 1}</button>
  </fieldset>)}</div><button className={s.secondary} type="button" disabled={questions.length >= 30} onClick={() => onChange([...questions, { id: crypto.randomUUID(), prompt: "", topic: "", type: "text", options: [], marks: 5 }])}>Add custom question</button></section>;
}

export function GradingPanel({ assignmentId, studentName, studentId, questions, submission, canEdit, onSaved }: { assignmentId: number; studentName: string; studentId: number; questions: AssignmentQuestion[]; submission: Submission; canEdit: boolean; onSaved: () => Promise<void> }) {
  const [grades, setGrades] = useState<QuestionGrade[]>(JSON.parse(submission.grades));
  const [feedback, setFeedback] = useState(submission.feedback);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const answers: Record<string, string> = JSON.parse(submission.answers);
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const response = await fetch(`/api/lms/assignments/${assignmentId}/submissions/${studentId}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ grades, feedback }) });
      const payload = await readJson<{ error?: string }>(response);
      if (!response.ok) setError(payload.error ?? "Could not save marks."); else { await onSaved(); setError("Marks and feedback saved."); }
    } catch { setError("Could not connect. Marks have not been saved."); } finally { setBusy(false); }
  }
  return <details className={`${s.panel} ${s.details}`}><summary>{studentName} · {submission.gradedAt ? "View / revise marks" : "Needs grading"}</summary><form method="post" onSubmit={save} className={s.form}><p className={s.muted}>Submitted {new Date(submission.submittedAt).toLocaleString()}</p>{questions.map(q => { const grade = grades.find(g => g.questionId === q.id); return <fieldset className={s.form} key={q.id}><legend>{q.topic} · {q.marks} marks</legend><p>{q.prompt}</p><p className={s.answer}>{answers[q.id]}</p>{q.type === "choice" && <p className={s.muted}>Answer key: {q.correctAnswer}</p>}<label className={s.field}>Marks awarded<input className={s.input} type="number" required min="0" max={q.marks} step="0.01" disabled={!canEdit} value={grade?.marks ?? ""} onChange={e => setGrades(rows => rows.map(g => g.questionId === q.id ? { ...g, marks: e.target.value === "" ? null : Number(e.target.value) } : g))} /></label><label className={s.field}>Question feedback<textarea className={s.input} maxLength={2000} disabled={!canEdit} value={grade?.feedback ?? ""} onChange={e => setGrades(rows => rows.map(g => g.questionId === q.id ? { ...g, feedback: e.target.value } : g))} /></label></fieldset>; })}<label className={s.field}>Overall feedback<textarea className={s.input} disabled={!canEdit} maxLength={4000} value={feedback} onChange={e => setFeedback(e.target.value)} /></label>{error && <p role="status">{error}</p>}{canEdit && <button type="submit" className={s.primary} disabled={busy}>{busy ? "Saving…" : "Save marks and feedback"}</button>}</form></details>;
}
