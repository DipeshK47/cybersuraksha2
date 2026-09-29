"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { readJson } from "../lib/read-json";

export default function RegisterSchoolPage() {
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatus("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/register-school", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        schoolName: form.get("schoolName"),
        contactName: form.get("contactName"),
        contactEmail: form.get("contactEmail"),
        studentCount: Number(form.get("studentCount")) || null,
      }),
    });
    const payload = await readJson<{ error?: string }>(response);
    setSubmitting(false);
    if (!response.ok) {
      setStatus(payload.error ?? "Unable to submit the request.");
      return;
    }
    event.currentTarget.reset();
    setStatus(
      "Request received. The CyberSuraksha team will verify the school and contact you.",
    );
  }

  return (
    <main className="authPage registerPage">
      <section className="authCard registerCard">
        <div className="authBrand">
          <b>Cyber</b>Suraksha
        </div>
        <h1>Register your school</h1>
        <p className="authSub">
          Tell us who you are. Every school is reviewed before student access
          is enabled.
        </p>
        <form method="post" onSubmit={submitRequest}>
          <label htmlFor="school-name">School name</label>
          <input id="school-name" name="schoolName" placeholder="DPS Vasant Kunj" required />
          <label htmlFor="contact-name">Contact person</label>
          <input id="contact-name" name="contactName" placeholder="Mrs. Sharma, Computer Science" required />
          <label htmlFor="contact-email">Contact email</label>
          <input id="contact-email" name="contactEmail" placeholder="office@yourschool.edu.in" required type="email" />
          <label htmlFor="student-count">Approx. number of students (optional)</label>
          <input id="student-count" min="1" name="studentCount" placeholder="120" type="number" />
          <button className="authSubmit" disabled={submitting} type="submit">
            {submitting ? "Submitting…" : "Submit request"}
          </button>
        </form>
        {status ? (
          <p aria-live="polite" className="authStatus">
            {status}
          </p>
        ) : null}
        <Link className="authBack" href="/">
          ← Back to CyberSuraksha
        </Link>
      </section>
    </main>
  );
}
