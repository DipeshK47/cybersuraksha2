"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Printer, RotateCcw, Trash2 } from "lucide-react";
import { TeacherHeader } from "../components/TeacherHeader";
import { getJson, readJson } from "../lib/read-json";

type Student = {
  id: number;
  className: string;
  rollNo: string;
  name: string;
  accessCode: string;
};

type AcademyPayload = {
  students: Student[];
  error?: string;
};

export default function RosterPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [activeClass, setActiveClass] = useState("all");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [issuedAccounts, setIssuedAccounts] = useState<Student[]>([]);

  const loadStudents = useCallback(async () => {
    setLoading(true);
    const payload = await getJson<AcademyPayload>("/api/academy");
    if (payload.students) setStudents(payload.students);
    else setStatus(payload.error ?? "Unable to load students.");
    setLoading(false);
  }, []);

  useEffect(() => {
    // The callback performs the API synchronization and owns its loading state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadStudents();
  }, [loadStudents]);

  const classes = useMemo(
    () => Array.from(new Set(students.map((student) => student.className))).sort(),
    [students],
  );
  const filteredStudents =
    activeClass === "all"
      ? students
      : students.filter((student) => student.className === activeClass);

  async function createAccounts(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const className = String(form.get("className") ?? "").trim();
    const rows = String(form.get("students") ?? "")
      .split("\n")
      .map((line) => {
        const [rollNo, ...nameParts] = line.split(",").map((part) => part.trim());
        return { rollNo, name: nameParts.join(", ").trim() };
      })
      .filter((student) => student.rollNo && student.name);
    const response = await fetch("/api/students", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ className, students: rows }),
    });
    const payload = await readJson<{
      students?: Student[];
      error?: string;
    }>(response);
    if (!response.ok) {
      setStatus(payload.error ?? "Unable to create accounts.");
      return;
    }
    if (!payload.students?.length) {
      setStatus("Those roll numbers already exist in this class.");
      return;
    }
    setIssuedAccounts(payload.students);
    setActiveClass(className.toUpperCase());
    setStatus(`${payload.students.length} student account${payload.students.length === 1 ? "" : "s"} created.`);
    formElement.reset();
    await loadStudents();
  }

  async function resetPassword(student: Student) {
    if (!window.confirm(`Reset the password for ${student.name}?`)) return;
    const response = await fetch(`/api/students/${student.id}/reset`, {
      method: "POST",
    });
    const payload = await readJson<{
      student?: Student;
      error?: string;
    }>(response);
    if (!response.ok || !payload.student) {
      setStatus(payload.error ?? "Unable to reset the password.");
      return;
    }
    setIssuedAccounts([payload.student]);
    setStatus(`A new login slip is ready for ${student.name}.`);
    await loadStudents();
  }

  async function removeStudent(student: Student) {
    if (!window.confirm(`Remove ${student.name} from the roster?`)) return;
    const response = await fetch(`/api/students/${student.id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      setStatus("Unable to remove this student.");
      return;
    }
    setStatus(`${student.name} was removed.`);
    setIssuedAccounts([]);
    await loadStudents();
  }

  return (
    <main className="teacherPage">
      <TeacherHeader active="roster" />
      <div className="teacherShell">
        <section className="teacherIntro">
          <h1>Class roster</h1>
          <p>
            Delhi Public School, R.K. Puram — paste your class once and every
            student gets their own account with a roll number and password.
            Print the login slips, hand them out, done.
          </p>
        </section>

        <section className="teacherPanel addStudentsPanel">
          <h2>Add students</h2>
          <form onSubmit={createAccounts}>
            <label htmlFor="class-name">Class name (e.g. 7B)</label>
            <input id="class-name" name="className" required />
            <label htmlFor="student-lines">One student per line: roll number, name</label>
            <textarea
              id="student-lines"
              name="students"
              placeholder={"17, Aarav Sharma\n18, Diya Patel"}
              required
              rows={5}
            />
            <button className="teacherPrimary" type="submit">
              Create accounts
            </button>
          </form>
        </section>

        {issuedAccounts.length ? (
          <section className="teacherPanel loginSlips" aria-live="polite">
            <div className="panelHeading">
              <div>
                <p className="teacherKicker">Ready to hand out</p>
                <h2>Student login slips</h2>
              </div>
              <button className="teacherSecondary" onClick={() => window.print()} type="button">
                <Printer aria-hidden="true" /> Print slips
              </button>
            </div>
            <div className="slipGrid">
              {issuedAccounts.map((student) => (
                <article className="loginSlip" key={student.id}>
                  <b>CyberSuraksha</b>
                  <span>{student.name}</span>
                  <dl>
                    <div><dt>Class</dt><dd>{student.className}</dd></div>
                    <div><dt>Roll</dt><dd>{student.rollNo}</dd></div>
                    <div><dt>Password</dt><dd>{student.accessCode}</dd></div>
                  </dl>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <section className="teacherPanel studentPanel">
          <div className="panelHeading">
            <div>
              <p className="teacherKicker">Account control</p>
              <h2>
                Students{activeClass !== "all" ? ` — ${activeClass}` : ""}
              </h2>
            </div>
            <span className="studentCount">{filteredStudents.length} accounts</span>
          </div>
          <nav className="classFilters" aria-label="Filter by class">
            <button
              className={activeClass === "all" ? "active" : ""}
              onClick={() => setActiveClass("all")}
              type="button"
            >
              All classes
            </button>
            {classes.map((className) => (
              <button
                className={activeClass === className ? "active" : ""}
                key={className}
                onClick={() => setActiveClass(className)}
                type="button"
              >
                {className}
              </button>
            ))}
          </nav>

          {status ? <p className="teacherStatus">{status}</p> : null}
          {loading ? (
            <p className="teacherEmpty">Loading roster…</p>
          ) : (
            <div className="tableScroller">
              <table className="teacherTable">
                <thead>
                  <tr>
                    <th>Class</th>
                    <th>Roll</th>
                    <th>Name</th>
                    <th aria-label="Actions" />
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id}>
                      <td>{student.className}</td>
                      <td>{student.rollNo}</td>
                      <td>{student.name}</td>
                      <td>
                        <div className="tableActions">
                          <Link href={`/teach/student/${student.id}`}>report</Link>
                          <button onClick={() => resetPassword(student)} type="button">
                            <RotateCcw aria-hidden="true" /> reset password
                          </button>
                          <button className="danger" onClick={() => removeStudent(student)} type="button">
                            <Trash2 aria-hidden="true" /> remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
