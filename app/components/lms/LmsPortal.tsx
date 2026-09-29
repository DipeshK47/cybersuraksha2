"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Bell, BookOpen, CalendarDays, Check, ClipboardList, GraduationCap, Plus, Printer, Send, Users } from "lucide-react";
import { TeacherHeader } from "../TeacherHeader";
import { getJson, postJson, readJson } from "../../lib/read-json";
import { attemptSummary, eventDetails, type LearningAttempt } from "../../lib/lms-summary";
import { getPlayableModuleById } from "../../data/module-registry";
import type { AssignmentRow, Report, StudentRow, Workspace } from "./types";
import s from "./lms.module.css";

const date = (value: number | null | undefined) => value ? new Date(value).toLocaleString(undefined, { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";
const moduleTitle = (id: string) => getPlayableModuleById(id)?.title ?? id;
const statusBadge = (status: string) => <span className={s.status} data-state={status}>{status}</span>;
const metrics = (rows: [string | number, string][]) => <div className={s.metrics}>{rows.map(([value, label]) => <div className={s.metric} key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>;
function TeacherPage({ children }: { children: React.ReactNode }) { return <main className={`${s.page} teacherPage`}><TeacherHeader active="lms" /><div className={s.shell}>{children}</div></main>; }
function Empty({ title, children }: { title: string; children: React.ReactNode }) { return <div className={s.empty}><ClipboardList aria-hidden="true" /><h2>{title}</h2><p>{children}</p></div>; }
function ErrorNotice({ message }: { message: string }) { return message ? <p className={s.error} role="alert">{message}</p> : null; }

export function TeacherWorkspace() {
  const [data, setData] = useState<Workspace | null>(null);
  const [error, setError] = useState("");
  const [classId, setClassId] = useState("all");
  const [tab, setTab] = useState("assignments");
  const [search, setSearch] = useState("");
  useEffect(() => { let active = true; void getJson<Workspace>("/api/lms/assignments").then(p => { if (active) { if (p.error) setError(p.error); else setData(p); } }); return () => { active = false; }; }, []);
  const assignments = (data?.assignments ?? []).filter(a => classId === "all" || a.classId === Number(classId));
  const students = (data?.students ?? []).filter(a => (classId === "all" || a.classId === Number(classId)) && `${a.name} ${a.rollNo}`.toLowerCase().includes(search.toLowerCase()));
  return <TeacherPage>
    <div className={s.intro}><div><h1>Classroom</h1><p>Set chapter assignments, follow each learner, and turn their practice into a useful progress record.</p></div><Link className={s.primary} href="/teach/lms/new"><Plus aria-hidden="true" />Create assignment</Link></div>
    <ErrorNotice message={error} />
    {metrics([[assignments.filter(a => a.publishedAt != null).length, "Published assignments"], [assignments.filter(a => a.publishedAt == null).length, "Drafts"], [students.length, "Students in view"], [assignments.reduce((n, a) => n + (a.completed ?? 0), 0), "Completed submissions"]])}
    <div className={s.toolbar}><div className={s.tabs} role="tablist" aria-label="Classroom views"><button role="tab" aria-selected={tab === "assignments"} onClick={() => setTab("assignments")} type="button">Assignments</button><button role="tab" aria-selected={tab === "students"} onClick={() => setTab("students")} type="button">Students</button></div><label><span className={s.eyebrow}>Class </span><select className={s.select} value={classId} onChange={e => setClassId(e.target.value)} aria-label="Filter by class"><option value="all">All my classes</option>{data?.classes.map(c => <option key={c.id} value={c.id}>Class {c.name}</option>)}</select></label>{tab === "students" && <input className={s.input} type="search" placeholder="Search name or roll number" aria-label="Search students" value={search} onChange={e => setSearch(e.target.value)} />}</div>
    {!data && !error ? <p aria-live="polite">Loading your classroom…</p> : tab === "assignments" ? <div className={s.grid}>
      {assignments.length ? assignments.map(a => <article className={s.card} id={`assignment-${a.id}`} data-assignment-id={a.id} key={a.id}><div className={s.cardTop}><span className={s.classLabel}><Users aria-hidden="true" />Class {data?.classes.find(c => c.id === a.classId)?.name}</span>{statusBadge(a.publishedAt == null ? "Draft" : (data?.serverNow ?? 0) > a.dueAt ? "Deadline passed" : "Published")}</div><h2>{a.title}</h2><p>{JSON.parse(a.moduleIds).map(moduleTitle).join(" · ")}</p><div className={s.meta}><span><CalendarDays aria-hidden="true" />{date(a.dueAt)}</span><span><GraduationCap aria-hidden="true" />{a.totalMarks} marks</span></div><span className={s.bar}><i style={{ width: `${a.students ? (a.completed ?? 0) / a.students * 100 : 0}%` }} /></span><div className={s.cardFoot}><span>{a.publishedAt == null ? "Ready when you are" : `${a.completed ?? 0} of ${a.students ?? 0} completed`}</span><Link href={`/teach/lms/${a.id}`}>{a.publishedAt == null ? "Review draft" : "View results"}<ArrowRight aria-hidden="true" /></Link></div></article>) : <Empty title="Start with one assignment">Choose chapters from your existing library. Your class will see the assignment as soon as you publish it.</Empty>}
    </div> : <div className={s.panel}><div className={s.tableWrap}><table className={s.table}><thead><tr><th>Student</th><th>Class</th><th>Roll number</th><th>Learning record</th></tr></thead><tbody>{students.map(student => <tr key={student.id}><td><Link href={`/teach/lms/students/${student.id}`}>{student.name}</Link></td><td>{student.className}</td><td>{student.rollNo}</td><td><Link href={`/teach/lms/students/${student.id}`}>View progress →</Link></td></tr>)}</tbody></table>{!students.length && <Empty title="No students in this view">Add students through the class roster or choose another class.</Empty>}</div></div>}
  </TeacherPage>;
}

export function AssignmentComposer() {
  const router = useRouter();
  const [data, setData] = useState<Workspace | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [classId, setClassId] = useState("");
  const [grade, setGrade] = useState(3);
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [deadline, setDeadline] = useState("");
  const [marks, setMarks] = useState("100");
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  useEffect(() => { let active = true; void getJson<Workspace>("/api/lms/assignments").then(p => { if (active) { if (p.error) setError(p.error); else { setData(p); const first = p.classes.find(c => c.grade >= 3 && c.grade <= 7); setGrade(first?.grade ?? 3); setClassId(String(first?.id ?? "")); } } }); return () => { active = false; }; }, []);
  const classroom = data?.classes.find(c => c.id === Number(classId));
  const sections = data?.classes.filter(c => c.grade === grade) ?? [];
  const modules = data?.modules.filter(m => m.grades.includes(grade) && `${m.title} ${m.strand}`.toLowerCase().includes(query.toLowerCase())) ?? [];
  const recipients = data?.students.filter(student => student.classId === Number(classId)).length ?? 0;
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("");
    if (!classroom) { setError("Choose an assigned class section before saving an assignment."); return; }
    if (!selected.length) { setError("Choose at least one chapter."); return; }
    const dueAt = new Date(deadline).getTime();
    if (!Number.isFinite(dueAt) || dueAt <= Date.now()) { setError("Set a deadline in the future."); return; }
    setBusy(true);
    const publish = (event.nativeEvent as SubmitEvent).submitter?.getAttribute("value") === "publish";
    const { ok, payload } = await postJson<{ assignment?: AssignmentRow; error?: string }>("/api/lms/assignments", { title, instructions, classId: Number(classId), moduleIds: selected, dueAt, totalMarks: Number(marks), publish });
    setBusy(false);
    if (!ok || !payload.assignment) { setError(payload.error ?? "Assignment could not be saved."); return; }
    router.push(`/teach/lms/${payload.assignment.id}`);
  }
  return <TeacherPage><Link className={s.back} href="/teach/lms"><ArrowLeft aria-hidden="true" />Assignments</Link><div className={s.intro}><div><h1>Create assignment</h1><p>Choose Class 3–7, then select its story chapters. Previously completed work counts automatically.</p></div></div><ErrorNotice message={error} />
    {!data ? <p>Loading classes and chapters…</p> : <form method="post" onSubmit={submit} className={s.formGrid}>
      <div className={s.form}>
        <section className={s.panel}><h2>Assignment details</h2><div className={s.form}><label className={s.field}>Assignment title<input className={s.input} value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Building safer password habits" maxLength={160} required /></label><div className={s.row}>
          <label className={s.field}>Class<select className={s.select} value={grade} onChange={e => { const next = Number(e.target.value); setGrade(next); setClassId(String(data.classes.find(c => c.grade === next)?.id ?? "")); setSelected([]); setQuery(""); }} required>{[3, 4, 5, 6, 7].map(value => <option value={value} key={value}>Class {value}</option>)}</select></label>
          <label className={s.field}>Class section<select aria-label="Class section" aria-describedby="class-section-help" className={s.select} value={classId} onChange={e => setClassId(e.target.value)} disabled={!sections.length} required>{!sections.length && <option value="">No assigned section</option>}{sections.map(c => <option value={c.id} key={c.id}>{c.name}</option>)}</select><small id="class-section-help">{sections.length ? "Only your assigned sections can receive this assignment." : "Ask your school administrator to assign a section for this class before saving or publishing."}</small></label>
        </div><label className={s.field}>Instructions <small>Optional</small><textarea className={s.input} value={instructions} onChange={e => setInstructions(e.target.value)} maxLength={4000} placeholder="Tell students what to focus on." /></label><div className={s.row}><label className={s.field}>Deadline<input className={s.input} type="datetime-local" value={deadline} onChange={e => setDeadline(e.target.value)} required /><small>Your local time ({Intl.DateTimeFormat().resolvedOptions().timeZone}).</small></label><label className={s.field}>Total marks<input className={s.input} type="number" min="0.01" max="10000" step="0.01" value={marks} onChange={e => setMarks(e.target.value)} required /><small>Shared equally across selected chapters.</small></label></div></div></section>
        <section className={s.panel}><h2>Choose chapters <span className={s.muted}>· {selected.length} selected</span></h2><p className={s.muted}>The same story chapters students open in Class {grade}. Each topic has two chapters.</p><input className={s.input} type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search chapters or topics" aria-label="Search chapters" style={{ width: "100%", marginBottom: 18 }} /><fieldset className={s.chapterList}><legend className={s.eyebrow}>Chapter library</legend>{modules.map(m => <label className={s.chapter} key={m.id}><input type="checkbox" checked={selected.includes(m.id)} onChange={e => setSelected(previous => e.target.checked ? [...previous, m.id] : previous.filter(id => id !== m.id))} /><span><strong>{m.title}</strong><small>{m.strand} · Classes {m.grades.join(", ")}</small></span></label>)}{!modules.length && <p className={s.muted}>No matching chapters.</p>}</fieldset></section>
      </div><aside className={`${s.panel} ${s.preview}`}><p className={s.eyebrow}>Student preview</p><h2>{title || "Your assignment title"}</h2><span className={s.classLabel}><Users aria-hidden="true" />Class {grade}{classroom ? ` · ${classroom.name}` : ""} · {recipients} students</span><p className={s.muted}>{instructions || "Your instructions will appear here."}</p><ul>{selected.map(id => <li key={id}>{moduleTitle(id)}</li>)}</ul><div className={s.meta}><span><CalendarDays aria-hidden="true" />{deadline ? date(new Date(deadline).getTime()) : "Set a deadline"}</span><span><GraduationCap aria-hidden="true" />{marks || "0"} marks</span></div><p className={s.summaryNote}><strong>Latest attempt counts.</strong> Every earlier attempt and mistake stays in the learning record. Work completed before publication is recognised automatically.</p><div className={s.actions}><button className={s.primary} disabled={busy || !classroom || !recipients || !selected.length} type="submit" value="publish"><Send aria-hidden="true" />{busy ? "Saving…" : "Publish assignment"}</button><button className={s.secondary} disabled={busy || !classroom || !selected.length} type="submit" value="draft">Save draft</button></div>{classroom && !recipients && <p className={s.muted}>Add students to this section before publishing. You can save a draft now.</p>}</aside>
    </form>}
  </TeacherPage>;
}

export function AssignmentDetail() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<{ assignment: AssignmentRow; students: (StudentRow & { progress: NonNullable<AssignmentRow["progress"]>; attempts: number })[]; error?: string } | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const load = useCallback(async () => { const p = await getJson<NonNullable<typeof data>>(`/api/lms/assignments/${id}`); if (p.error) setError(p.error); else setData(p); }, [id]);
  // The callback awaits the API before synchronising state.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load(); }, [load]);
  async function publish() { setBusy(true); setError(""); try { const response = await fetch(`/api/lms/assignments/${id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ publish: true }) }); const p = await readJson<{ error?: string }>(response); if (!response.ok) setError(p.error ?? "Publication failed."); else await load(); } catch { setError("Could not connect. Your draft is saved."); } finally { setBusy(false); } }
  const a = data?.assignment;
  return <TeacherPage><Link className={s.back} href="/teach/lms"><ArrowLeft aria-hidden="true" />Assignments</Link><ErrorNotice message={error} />{!a ? !error && <p>Loading assignment…</p> : <>
    <div className={s.intro}><div><p className={s.eyebrow}>{a.publishedAt == null ? "Assignment draft" : "Assignment results"}</p><h1>{a.title}</h1><p>{a.instructions || "Complete the selected chapters and their practice exercises."}</p></div>{a.publishedAt == null ? <button className={s.primary} onClick={publish} disabled={busy} type="button"><Send aria-hidden="true" />{busy ? "Publishing…" : "Publish to class"}</button> : <button className={s.secondary} onClick={() => window.print()} type="button"><Printer aria-hidden="true" />Print results</button>}</div>
    {metrics([[data?.students.length ?? 0, "Assigned students"], [data?.students.filter(student => student.progress.completedAt != null).length ?? 0, "Completed"], [a.totalMarks, "Total marks"], [JSON.parse(a.moduleIds).length, "Chapters"]])}
    <div className={s.stack}><section className={s.panel}><h2>Assignment brief</h2><div className={s.meta}><span><CalendarDays aria-hidden="true" />Due {date(a.dueAt)}</span><span>{a.publishedAt ? `Published ${date(a.publishedAt)}` : "Visible only to teachers"}</span></div><p className={s.muted}>{JSON.parse(a.moduleIds).map(moduleTitle).join(" · ")}</p><p className={s.summaryNote}>The grade uses the <strong>latest completed attempt for each chapter</strong>, weighted equally. A chapter score uses the first answer to each practice exercise; corrections and hints remain visible in the report. Previously completed chapters count. Incomplete assignments have no final grade.</p></section>
      <section className={s.panel}><h2>Student submissions</h2>{a.publishedAt == null ? <Empty title="Your draft is ready">Publish to notify the students currently enrolled in this class.</Empty> : <div className={s.tableWrap}><table className={s.table}><thead><tr><th>Student</th><th>Status</th><th>Chapters</th><th>Latest grade</th><th>Attempts</th><th>Completed at</th></tr></thead><tbody>{data?.students.map(student => <tr key={student.id}><td><Link href={`/teach/lms/students/${student.id}`}>{student.name}</Link><small>Roll {student.rollNo} · Class {student.className}</small></td><td>{statusBadge(student.progress.status)}</td><td>{student.progress.completed}/{student.progress.total}</td><td className={s.score}>{student.progress.marks == null ? "—" : `${student.progress.marks} / ${a.totalMarks}`}</td><td>{student.attempts}</td><td>{date(student.progress.completedAt)}</td></tr>)}</tbody></table>{!data?.students.length && <p className={s.muted}>No students were enrolled when this assignment was published.</p>}</div>}</section>
    </div>
  </>}</TeacherPage>;
}

export function LearningReport() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<Report | null>(null);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  useEffect(() => { let live = true; void getJson<Report>(`/api/lms/students/${id}`).then(p => { if (live) { if (p.error) setError(p.error); else setData(p); } }); return () => { live = false; }; }, [id]);
  const attempts = useMemo(() => (data?.attempts ?? []).filter(a => filter === "all" || a.moduleId === filter), [data, filter]);
  const events = (data?.events ?? []).filter(e => attempts.some(a => a.id === e.attemptId));
  const totals = attemptSummary(events);
  if (filter === "all") {
    totals.correct += data?.practice.filter(p => p.isCorrect === 1).length ?? 0;
    totals.wrong += data?.practice.filter(p => p.isCorrect === 0).length ?? 0;
  }
  const topics = new Map<string, { right: number; wrong: number; hints: number }>();
  for (const event of events) {
    if (!["question_answered", "story_answered", "hint_used"].includes(event.type)) continue;
    const p = eventDetails(event); const attempt = attempts.find(a => a.id === event.attemptId);
    const topic = `${attempt ? moduleTitle(attempt.moduleId) : "Practice"} · ${String(p.category ?? p.activity ?? "Practice exercises").replace(/[-_]/g, " ")}`;
    const row = topics.get(topic) ?? { right: 0, wrong: 0, hints: 0 };
    if (event.type === "hint_used") row.hints++; else if (p.correct === true) row.right++; else row.wrong++;
    topics.set(topic, row);
  }
  function history(a: LearningAttempt) {
    const entries = events.filter(e => e.attemptId === a.id);
    const result = attemptSummary(entries);
    return <details className={`${s.panel} ${s.details}`} key={a.id}><summary><BookOpen aria-hidden="true" />{moduleTitle(a.moduleId)} · {a.completedAt ? "Completed" : "In progress"} · {date(a.startedAt)}</summary><div className={s.detailBody}><div className={s.meta}><span>Last active {date(a.lastActiveAt)}</span><span>Completed {date(a.completedAt)}</span><span>Score {a.score == null ? "Not graded" : `${Math.round(a.score * 100) / 100}%`}</span></div>{a.legacy ? <p className={s.summaryNote}>Imported from earlier progress. This summary contains the saved score; question-level history was not recorded then.</p> : <><p className={s.muted}>{result.correct} correct responses · {result.wrong} wrong responses · {result.hints} hints · {result.mistakes} other mistakes</p><ul className={s.history}>{entries.filter(e => ["question_answered", "story_answered", "mistake", "hint_used", "story_viewed", "story_feedback"].includes(e.type)).map(event => { const p = eventDetails(event); const label = event.type === "story_feedback" ? "Story feedback" : event.type === "story_viewed" ? "Story scene viewed" : event.type === "hint_used" ? "Hint used" : event.type === "mistake" ? "Mistake" : p.correct === true ? "Correct response" : "Wrong response"; return <li className={s.event} key={event.id}><time dateTime={new Date(event.createdAt).toISOString()}>{date(event.createdAt)}</time><div><strong>{label} · {String(p.category ?? p.activity ?? p.checkpoint ?? "Practice").replace(/[-_]/g, " ")}</strong>{p.question != null && <p><strong>{String(p.question)}</strong></p>}{p.feedback != null && <p>{String(p.feedback)}</p>}{p.id != null && <small className={s.muted}>Exercise: {String(p.id)}{p.retry ? " · Retry" : ""}</small>}</div></li>; })}</ul></>}</div></details>;
  }
  return <TeacherPage><Link className={s.back} href="/teach/lms"><ArrowLeft aria-hidden="true" />Classroom</Link><ErrorNotice message={error} />{!data ? !error && <p>Loading learning record…</p> : <>
    <div className={s.intro}><div><p className={s.eyebrow}>Student learning record</p><h1>{data.student.name}</h1><p>Class {data.student.className} · Roll {data.student.rollNo}. Activity includes independent practice and assigned work.</p></div><button className={s.secondary} onClick={() => window.print()} type="button"><Printer aria-hidden="true" />Print report</button></div>
    {metrics([[attempts.length, "Chapter attempts"], [attempts.filter(a => a.completedAt != null).length, "Completed attempts"], [totals.correct, "Correct responses"], [totals.wrong, "Wrong responses"]])}
    <div className={s.toolbar}><h2 style={{ marginRight: "auto", fontSize: "1.15rem" }}>Progress by topic</h2><select className={s.select} aria-label="Filter report by chapter" value={filter} onChange={e => setFilter(e.target.value)}><option value="all">All chapters</option>{[...new Set(data.attempts.map(a => a.moduleId))].map(moduleId => <option key={moduleId} value={moduleId}>{moduleTitle(moduleId)}</option>)}</select></div>
    <div className={s.stack}><section className={s.panel}><p className={s.muted}>Response counts include retries. Grades use the first answer per practice exercise in the latest completed chapter attempt.</p>{topics.size ? <div className={s.tableWrap}><table className={s.table}><thead><tr><th>Chapter / topic</th><th>Correct</th><th>Wrong</th><th>Hints</th></tr></thead><tbody>{[...topics].map(([topic, row]) => <tr key={topic}><td>{topic}</td><td>{row.right}</td><td>{row.wrong}</td><td>{row.hints}</td></tr>)}</tbody></table></div> : <p className={s.muted}>No detailed exercise responses recorded yet.</p>}</section>
    {data.practice.length > 0 && filter === "all" && <section className={s.panel}><h2>Subject practice record</h2><div className={s.tableWrap}><table className={s.table}><thead><tr><th>Topic / question</th><th>Chosen answer</th><th>Result</th><th>Answered at</th></tr></thead><tbody>{data.practice.map(p => <tr key={p.questionId}><td>{p.chapterSlug} · {p.topicSlug}<small>{p.questionId}</small></td><td>{p.chosen}</td><td>{p.isCorrect ? "Correct" : "Wrong"}</td><td>{date(new Date(p.answeredAt.replace(" ", "T") + "Z").getTime())}</td></tr>)}</tbody></table></div></section>}
    <section className={s.panel}><h2>Assignments</h2>{data.assignments.length ? <div className={s.tableWrap}><table className={s.table}><thead><tr><th>Assignment</th><th>Status</th><th>Latest grade</th></tr></thead><tbody>{data.assignments.map(a => <tr key={a.id}><td><Link href={`/teach/lms/${a.id}`}>{a.title}</Link></td><td>{statusBadge(a.progress?.status ?? "Not started")}</td><td>{a.progress?.marks == null ? "—" : `${a.progress.marks} / ${a.totalMarks}`}</td></tr>)}</tbody></table></div> : <p className={s.muted}>No published assignments yet.</p>}</section>
    <section><h2>Every attempt</h2><p className={s.muted}>Newest first. Open an attempt to see its responses, mistakes, hints, and timestamps.</p><div className={s.stack}>{attempts.length ? [...attempts].reverse().map(history) : <Empty title="Their learning record starts here">Chapter activity will appear as this student works through stories and practice.</Empty>}</div></section></div>
  </>}</TeacherPage>;
}

export function AssignmentNotification() {
  const [unread, setUnread] = useState(0);
  useEffect(() => { let live = true; const load = () => { if (document.hidden) return; void getJson<{ assignments?: AssignmentRow[]; error?: string }>("/api/lms/inbox").then(p => { if (live && p.assignments) setUnread(p.assignments.filter(a => a.readAt == null).length); }); }; load(); const timer = setInterval(load, 30000); window.addEventListener("focus", load); return () => { live = false; clearInterval(timer); window.removeEventListener("focus", load); }; }, []);
  return <Link className={s.bell} href="/learn/assignments" aria-label={`Assignments${unread ? `, ${unread} unread` : ""}`}><Bell aria-hidden="true" />Assignments{unread > 0 && <b>{unread}</b>}</Link>;
}

export function StudentInbox({ studentId, grade }: { studentId: number; grade: number }) {
  const [assignments, setAssignments] = useState<AssignmentRow[]>([]);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [filter, setFilter] = useState("all");
  const load = useCallback(async () => { const p = await getJson<{ assignments?: AssignmentRow[]; error?: string }>("/api/lms/inbox"); if (p.error) setError(p.error); else { setAssignments(p.assignments ?? []); setError(""); } setLoaded(true); }, []);
  // The callback awaits the API before synchronising state.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load(); window.addEventListener("focus", load); return () => window.removeEventListener("focus", load); }, [load]);
  async function read(a: AssignmentRow) { if (a.readAt != null) return; try { const response = await fetch("/api/lms/inbox", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ assignmentId: a.id }) }); if (!response.ok) throw new Error(); setAssignments(rows => rows.map(row => row.id === a.id ? { ...row, readAt: Date.now() } : row)); } catch { setError("Could not mark this notification as read. Try again."); } }
  const visible = assignments.filter(a => filter === "all" || (filter === "done" ? a.progress?.completedAt != null : a.progress?.completedAt == null));
  return <main className={s.page}><div className={s.shell}><Link className={s.back} href="/dashboard"><ArrowLeft aria-hidden="true" />My dashboard</Link><div className={s.intro}><div><h1>Assignments</h1><p>Find your class assignments, keep track of deadlines, and continue learning where you left off.</p></div><AssignmentNotification /></div><ErrorNotice message={error} />{metrics([[assignments.filter(a => a.progress?.completedAt == null).length, "To complete"], [assignments.filter(a => a.progress?.completedAt != null).length, "Completed"], [assignments.filter(a => a.progress?.status === "Overdue").length, "Overdue"], [assignments.filter(a => a.readAt == null).length, "New assignments"]])}
    <div className={s.toolbar}><div className={s.tabs} role="tablist" aria-label="Filter assignments">{[["all", "All"], ["pending", "To do"], ["done", "Completed"]].map(([key, label]) => <button type="button" role="tab" key={key} aria-selected={filter === key} onClick={() => setFilter(key)}>{label}</button>)}</div><button className={s.secondary} onClick={() => void load()} type="button">Refresh</button></div>
    <div className={s.grid}>{!loaded ? <p>Checking your assignments…</p> : error && !assignments.length ? <p>Use Refresh to try loading your assignments again.</p> : visible.length ? visible.map(a => { const moduleIds: string[] = JSON.parse(a.moduleIds); const chapters = moduleIds.map(getPlayableModuleById).filter(m => m != null); const first = chapters.find(m => !a.progress?.latest.some(attempt => attempt?.moduleId === m.id)) ?? chapters[0]; const params = new URLSearchParams({ role: "student", studentId: String(studentId), grade: String(grade) }); return <article className={s.card} id={`assignment-${a.id}`} data-assignment-id={a.id} key={a.id}><div className={s.cardTop}><span className={s.classLabel}><Users aria-hidden="true" />Class {a.className}{a.readAt == null && <span className={s.pillNew}>NEW</span>}</span>{statusBadge(a.progress?.status ?? "Not started")}</div><h2>{a.title}</h2><p>{a.instructions || "Complete these chapters and their practice challenges."}</p><div className={s.meta}><span><CalendarDays aria-hidden="true" />Due {date(a.dueAt)}</span><span><GraduationCap aria-hidden="true" />{a.totalMarks} marks</span></div><span className={s.bar}><i style={{ width: `${(a.progress?.completed ?? 0) / moduleIds.length * 100}%` }} /></span><div className={s.cardFoot}><span>{a.progress?.completed ?? 0}/{moduleIds.length} chapters complete</span><strong>{a.progress?.marks == null ? "Not graded yet" : `${a.progress.marks} / ${a.totalMarks}`}</strong></div>{a.progress?.alreadyCompleted && <p className={s.summaryNote}><Check aria-hidden="true" /> You completed these chapters before they were assigned. Your work already counts.</p>}{first && <Link className={s.primary} href={`${first.href}?${params}`} onClick={() => void read(a)}>{a.progress?.completedAt != null ? "Review assignment" : a.progress?.status === "In progress" ? "Continue assignment" : "Start assignment"}<ArrowRight aria-hidden="true" /></Link>}<div className={s.detailBody}><h3 className={s.chaptersHeading}>Assigned chapters</h3>{chapters.map(m => { const done = a.progress?.latest.some(attempt => attempt?.moduleId === m.id); return <Link className={s.chapterLink} key={m.id} href={`${m.href}?${params}`} onClick={() => void read(a)}><span>{m.title}<small className={s.muted} style={{ display: "block", marginTop: 4 }}>{done ? "Completed · You can practise again" : m.strand}</small></span>{done ? <Check aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}</Link>; })}</div></article>; }) : <Empty title={filter === "all" ? "You’re all caught up" : "Nothing here yet"}>Your teacher’s published assignments will appear here.</Empty>}</div>
  </div></main>;
}
