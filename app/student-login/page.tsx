"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { AuthCard } from "../components/AuthCard";
import { readJson } from "../lib/read-json";

export default function StudentLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [schools, setSchools] = useState<{ name: string; slug: string }[]>([]);
  useEffect(() => { let active = true; void fetch("/api/schools").then(response => readJson<{ schools?: { name: string; slug: string }[]; error?: string }>(response)).then(payload => { if (active) { setSchools(payload.schools ?? []); if (payload.error) setError(payload.error); } }).catch(() => { if (active) setError("Could not load schools. Reload to try again."); }); return () => { active = false; }; }, []);

  async function startLearning(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    const form = new FormData(event.currentTarget);
    try {
    const response = await fetch("/api/auth/student", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        school: form.get("school"),
        className: form.get("studentClassName"),
        rollNo: form.get("studentRollNumber"),
        password: form.get("studentAccessCode"),
      }),
    });
    const payload = await readJson<{
      error?: string;
      student?: { id: number; name: string; className: string };
    }>(response);
    setSubmitting(false);
    if (!response.ok || !payload.student) {
      setError(payload.error ?? "Unable to sign in.");
      return;
    }
    sessionStorage.setItem("cybersuraksha-role", "student");
    sessionStorage.setItem("cybersuraksha-student", JSON.stringify(payload.student));
    // The dashboard resolves identity from the session cookie, not the URL.
    router.push("/dashboard");
    } catch { setError("Could not connect. Please try again."); } finally { setSubmitting(false); }
  }

  return (
    <AuthCard
      subtitle="Use the slip your teacher gave you."
      tip={
        <>
          Lost your slip? Your teacher can give you a new password.

        </>
      }
      title="Student login"
    >
      <form autoComplete="off" method="post" onSubmit={startLearning}>
        <label htmlFor="student-school">Your school</label>
        <select defaultValue="" id="student-school" name="school" required>
          <option disabled value="">
            Choose your school…
          </option>
          {schools.map(school => <option key={school.slug} value={school.slug}>{school.name}</option>)}
        </select>
        <label htmlFor="student-class">Your class</label>
        <input
          autoComplete="off"
          id="student-class"
          name="studentClassName"
          placeholder="7A"
          required
          type="text"
        />
        <label htmlFor="student-roll">Roll number</label>
        <input
          autoComplete="one-time-code"
          id="student-roll"
          name="studentRollNumber"
          placeholder="17"
          required
          type="text"
        />
        <label htmlFor="student-password">Password</label>
        <input
          autoComplete="new-password"
          id="student-password"
          name="studentAccessCode"
          required
          type="password"
        />
        <button className="authSubmit" disabled={submitting} type="submit">
          {submitting ? "Checking…" : "Start learning"}
        </button>
      </form>
      {error ? (
        <p aria-live="polite" className="authStatus authStatusError">
          {error}
        </p>
      ) : null}
    </AuthCard>
  );
}
