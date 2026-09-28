"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AuthCard } from "../components/AuthCard";
import { readJson } from "../lib/read-json";

export default function TeacherLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/teacher", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
    });
    const payload = await readJson<{ error?: string }>(response);
    setSubmitting(false);
    if (!response.ok) {
      setError(payload.error ?? "Unable to sign in.");
      return;
    }
    sessionStorage.setItem("cybersuraksha-role", "teacher");
    router.push("/dashboard?role=teacher");
  }

  return (
    <AuthCard
      subtitle="Sign in with the credentials provided when your school was approved."
      tip={
        <>
          School not registered yet?{" "}
          <Link href="/register-school">Register your school</Link>
          <span className="demoCredentials">
            Demo: teacher@dpsrkp.edu.in · Teacher@123
          </span>
        </>
      }
      title="Teacher login"
    >
      <form onSubmit={signIn}>
        <label htmlFor="teacher-email">Email</label>
        <input
          autoComplete="username"
          id="teacher-email"
          name="email"
          required
          type="email"
        />
        <label htmlFor="teacher-password">Password</label>
        <input
          autoComplete="current-password"
          id="teacher-password"
          name="password"
          required
          type="password"
        />
        <button className="authSubmit" disabled={submitting} type="submit">
          {submitting ? "Signing in…" : "Sign in"}
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
