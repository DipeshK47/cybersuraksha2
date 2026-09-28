"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Copy, ShieldCheck } from "lucide-react";
import { TeacherHeader } from "../../components/TeacherHeader";
import { readJson } from "../../lib/read-json";

/**
 * School-admin console: teacher onboarding (invites), account status, class
 * creation, and the class assignments that define what each teacher can see.
 *
 * The page self-gates: every endpoint here is school_admin-only, so a plain
 * teacher simply gets the "not available" state rather than a broken screen.
 */

type Teacher = {
  id: number;
  name: string;
  email: string;
  role: "teacher" | "school_admin";
  status: "pending" | "active" | "suspended";
};

type SchoolClass = { id: number; grade: number; section: string; name: string };

type Invite = {
  id: number;
  email: string;
  role: string;
  acceptedAt: string | null;
  expiresAt: number;
};

/** Resolved when the list is fetched — expiry must not be recomputed on render. */
type InviteRow = Invite & { state: "accepted" | "expired" | "pending" };

function withState(invite: Invite): InviteRow {
  return {
    ...invite,
    state: invite.acceptedAt
      ? "accepted"
      : invite.expiresAt < Date.now()
        ? "expired"
        : "pending",
  };
}

type StatusAction = "approve" | "suspend" | "reactivate";

const actionsFor = (status: Teacher["status"]): StatusAction[] =>
  status === "pending"
    ? ["approve"]
    : status === "active"
      ? ["suspend"]
      : ["reactivate"];

export default function AdminPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [invites, setInvites] = useState<InviteRow[]>([]);
  const [allowed, setAllowed] = useState(true);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [inviteLink, setInviteLink] = useState("");

  const [assignTeacherId, setAssignTeacherId] = useState("");
  const [assignedIds, setAssignedIds] = useState<number[]>([]);
  const [assignLoading, setAssignLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    // `finally` owns the spinner: a dropped connection or a non-JSON reply must
    // still clear it, or the console sits on "Loading…" forever.
    try {
      const [teacherRes, classRes, inviteRes] = await Promise.all([
        fetch("/api/admin/teachers"),
        fetch("/api/admin/classes"),
        fetch("/api/admin/invites"),
      ]);
      if (teacherRes.status === 403) {
        setAllowed(false);
        return;
      }
      setAllowed(true);
      const teachers = await readJson<{ teachers?: Teacher[]; error?: string }>(
        teacherRes,
      );
      if (teachers.teachers) setTeachers(teachers.teachers);
      const classes = await readJson<{
        classes?: SchoolClass[];
        error?: string;
      }>(classRes);
      if (classes.classes) setClasses(classes.classes);
      const invites = await readJson<{ invites?: Invite[]; error?: string }>(
        inviteRes,
      );
      if (invites.invites) setInvites(invites.invites.map(withState));
    } catch {
      setStatus("Could not reach the server. Is it still running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // The callback owns its own loading state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  async function sendInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    setInviteLink("");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const response = await fetch("/api/admin/invites", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: form.get("email"), role: form.get("role") }),
    });
    const payload = await readJson<{
      invite?: { acceptUrl: string; email: string };
      error?: string;
    }>(response);
    if (!response.ok || !payload.invite) {
      setStatus(payload.error ?? "Unable to create that invite.");
      return;
    }
    setInviteLink(payload.invite.acceptUrl);
    setStatus(`Invite ready for ${payload.invite.email}. Send them this link.`);
    formElement.reset();
    await load();
  }

  async function changeStatus(teacher: Teacher, action: StatusAction) {
    const response = await fetch(`/api/admin/teachers/${teacher.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action }),
    });
    if (!response.ok) {
      const payload = await readJson<{ error?: string }>(response);
      setStatus(payload.error ?? "Unable to update that account.");
      return;
    }
    setStatus(`${teacher.name} — ${action}d.`);
    await load();
  }

  async function createClass(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const response = await fetch("/api/admin/classes", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        grade: form.get("grade"),
        section: form.get("section"),
      }),
    });
    const payload = await readJson<{ error?: string }>(response);
    if (!response.ok) {
      setStatus(payload.error ?? "Unable to create that class.");
      return;
    }
    setStatus("Class created.");
    formElement.reset();
    await load();
  }

  async function selectTeacherForAssignment(teacherId: string) {
    setAssignTeacherId(teacherId);
    setAssignedIds([]);
    if (!teacherId) return;
    setAssignLoading(true);
    const response = await fetch(`/api/admin/teachers/${teacherId}/classes`);
    if (response.ok) {
      const payload = await readJson<{
        classes?: { id: number }[];
        error?: string;
      }>(response);
      setAssignedIds((payload.classes ?? []).map((item) => item.id));
    }
    setAssignLoading(false);
  }

  async function saveAssignments() {
    const response = await fetch(
      `/api/admin/teachers/${assignTeacherId}/classes`,
      {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ classIds: assignedIds }),
      },
    );
    const payload = await readJson<{ error?: string }>(response);
    setStatus(
      response.ok
        ? "Class assignments saved."
        : (payload.error ?? "Unable to save assignments."),
    );
  }

  if (!allowed) {
    return (
      <main className="teacherPage">
        <TeacherHeader active="admin" />
        <div className="teacherShell">
          <section className="teacherIntro">
            <h1>School admin only</h1>
            <p>
              Teacher onboarding, class creation, and class assignments are
              managed by your school admin. Ask them if you need access to
              another class.
            </p>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="teacherPage">
      <TeacherHeader active="admin" />
      <div className="teacherShell">
        <section className="teacherIntro">
          <h1>School admin</h1>
          <p>
            Invite teachers, approve or suspend accounts, create classes, and
            decide which classes each teacher can see. A teacher only ever sees
            students in the classes assigned here.
          </p>
        </section>

        {status ? <p className="teacherStatus">{status}</p> : null}

        <section className="teacherPanel">
          <h2>Invite a teacher</h2>
          <form onSubmit={sendInvite}>
            <label htmlFor="invite-email">Work email</label>
            <input id="invite-email" name="email" required type="email" />
            <label htmlFor="invite-role">Role</label>
            <select defaultValue="teacher" id="invite-role" name="role">
              <option value="teacher">Teacher</option>
              <option value="school_admin">School admin</option>
            </select>
            <button className="teacherPrimary" type="submit">
              Create invite link
            </button>
          </form>
          {inviteLink ? (
            <div className="inviteLink" aria-live="polite">
              <p>
                <ShieldCheck aria-hidden="true" /> This link is shown once and
                cannot be recovered later.
              </p>
              <code>{inviteLink}</code>
              <button
                className="teacherSecondary"
                onClick={() => void navigator.clipboard?.writeText(inviteLink)}
                type="button"
              >
                <Copy aria-hidden="true" /> Copy link
              </button>
            </div>
          ) : null}
        </section>

        <section className="teacherPanel">
          <div className="panelHeading">
            <div>
              <p className="teacherKicker">Accounts</p>
              <h2>Teachers</h2>
            </div>
            <span className="studentCount">{teachers.length} accounts</span>
          </div>
          {loading ? (
            <p className="teacherEmpty">Loading accounts…</p>
          ) : (
            <div className="tableScroller">
              <table className="teacherTable">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th aria-label="Actions" />
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((teacher) => (
                    <tr key={teacher.id}>
                      <td>{teacher.name}</td>
                      <td>{teacher.email}</td>
                      <td>
                        {teacher.role === "school_admin" ? "School admin" : "Teacher"}
                      </td>
                      <td>{teacher.status}</td>
                      <td>
                        <div className="tableActions">
                          {actionsFor(teacher.status).map((action) => (
                            <button
                              className={action === "suspend" ? "danger" : ""}
                              key={action}
                              onClick={() => void changeStatus(teacher, action)}
                              type="button"
                            >
                              {action}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="teacherPanel">
          <h2>Classes</h2>
          <form onSubmit={createClass}>
            <label htmlFor="class-grade">Grade</label>
            <input
              id="class-grade"
              max={12}
              min={1}
              name="grade"
              required
              type="number"
            />
            <label htmlFor="class-section">Section (optional)</label>
            <input id="class-section" maxLength={4} name="section" placeholder="A" />
            <button className="teacherPrimary" type="submit">
              Create class
            </button>
          </form>
          <nav className="classFilters" aria-label="Existing classes">
            {classes.length ? (
              classes.map((item) => <span key={item.id}>{item.name}</span>)
            ) : (
              <p className="teacherEmpty">No classes yet.</p>
            )}
          </nav>
        </section>

        <section className="teacherPanel">
          <h2>Class assignments</h2>
          <label htmlFor="assign-teacher">Teacher</label>
          <select
            id="assign-teacher"
            onChange={(event) =>
              void selectTeacherForAssignment(event.target.value)
            }
            value={assignTeacherId}
          >
            <option value="">Choose a teacher…</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name} — {teacher.email}
              </option>
            ))}
          </select>

          {assignTeacherId && !assignLoading ? (
            <>
              <fieldset className="assignGrid">
                <legend>Classes this teacher can see</legend>
                {classes.map((item) => (
                  <label key={item.id}>
                    <input
                      checked={assignedIds.includes(item.id)}
                      onChange={(event) =>
                        setAssignedIds((current) =>
                          event.target.checked
                            ? [...current, item.id]
                            : current.filter((id) => id !== item.id),
                        )
                      }
                      type="checkbox"
                    />
                    {item.name}
                  </label>
                ))}
              </fieldset>
              <button
                className="teacherPrimary"
                onClick={() => void saveAssignments()}
                type="button"
              >
                Save assignments
              </button>
            </>
          ) : null}
          {assignLoading ? (
            <p className="teacherEmpty">Loading assignments…</p>
          ) : null}
        </section>

        <section className="teacherPanel">
          <div className="panelHeading">
            <div>
              <p className="teacherKicker">Onboarding</p>
              <h2>Invites</h2>
            </div>
          </div>
          {invites.length ? (
            <div className="tableScroller">
              <table className="teacherTable">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Role</th>
                    <th>State</th>
                  </tr>
                </thead>
                <tbody>
                  {invites.map((invite) => (
                    <tr key={invite.id}>
                      <td>{invite.email}</td>
                      <td>{invite.role}</td>
                      <td>{invite.state}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="teacherEmpty">No invites issued yet.</p>
          )}
        </section>
      </div>
    </main>
  );
}
