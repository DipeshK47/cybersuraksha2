"use client";
import { useEffect, useState, type FormEvent } from "react";
import { getJson, readJson } from "../../lib/read-json";
import type { ContentAccess } from "../../lib/content-policy";
import s from "./lms.module.css";

export function SchoolCurriculum() {
  const [data, setData] = useState<(ContentAccess & { availableGrades: number[]; availableSubjects: string[] }) | null>(null);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => { let live = true; void getJson<NonNullable<typeof data> & { error?: string }>("/api/admin/school").then(p => { if (live) { if (p.error) setStatus(p.error); else setData(p); } }); return () => { live = false; }; }, []);
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setStatus("");
    try {
      const response = await fetch("/api/admin/school", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(data) });
      const payload = await readJson<{ error?: string }>(response);
      setStatus(response.ok ? "School curriculum saved. Content access updates immediately; historical learning records are retained." : payload.error ?? "Could not save settings.");
    } catch { setStatus("Could not connect. Your changes have not been saved."); } finally { setBusy(false); }
  }
  return <section className="teacherPanel"><h2>School curriculum</h2><p>Choose the grades and subjects this school uses. Students see their own grade; teachers see their assigned grades. Disabling content preserves its learning records.</p>{status && <p role="status">{status}</p>}{!data ? <p>Loading school settings…</p> : <form method="post" onSubmit={save} className={s.form}>
    <label className={s.field}>School name<input className={s.input} value={data.schoolName} onChange={e => setData({ ...data, schoolName: e.target.value })} minLength={2} maxLength={160} required /></label>
    <fieldset className="assignGrid"><legend>Enabled grades</legend>{data.availableGrades.map(grade => <label key={grade}><input type="checkbox" checked={data.grades.includes(grade)} onChange={e => setData({ ...data, grades: e.target.checked ? [...data.grades, grade] : data.grades.filter(g => g !== grade) })} />Class {grade}</label>)}</fieldset>
    <fieldset className="assignGrid"><legend>Enabled subjects</legend>{data.availableSubjects.map(subject => <label key={subject}><input type="checkbox" checked={data.subjects.includes(subject)} onChange={e => setData({ ...data, subjects: e.target.checked ? [...data.subjects, subject] : data.subjects.filter(value => value !== subject) })} />{subject}</label>)}</fieldset>
    <p className={s.muted}>Classes 3–4 share the foundation mission library; Class 5 shares the intermediate library with Class 8. Existing Classes 6–12 keep their current chapters.</p>
    <button type="submit" className="teacherPrimary" disabled={busy || !data.grades.length || !data.subjects.length}>{busy ? "Saving…" : "Save school curriculum"}</button>
  </form>}</section>;
}
