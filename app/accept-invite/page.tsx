"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { AuthCard } from "../components/AuthCard";
import { readJson } from "../lib/read-json";

/**
 * Landing page for the one-time invite link issued by /api/admin/invites.
 * Accepting sets the teacher's name + password, activates the account, and
 * signs them in — the token itself is never stored in plaintext anywhere.
 */
function AcceptInviteForm() {
  const router = useRouter();
  const token = useSearchParams().get("token") ?? "";
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function accept(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    if (password !== String(form.get("confirmPassword") ?? "")) {
      setError("The two passwords do not match.");
      return;
    }
    setSubmitting(true);
    const response = await fetch("/api/auth/accept-invite", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token, name: form.get("name"), password }),
    });
    const payload = await readJson<{ error?: string }>(response);
    setSubmitting(false);
    if (!response.ok) {
      setError(payload.error ?? "This invite could not be accepted.");
      return;
    }
    sessionStorage.setItem("cybersuraksha-role", "teacher");
    router.push("/dashboard");
  }

  if (!token) {
    return (
      <AuthCard
        subtitle="This link is missing its invite code."
        tip={<>Ask your school admin to send the invite link again.</>}
        title="Invite link incomplete"
      >
        <p className="authStatus authStatusError">
          Open the full link from your invite email, including the part after
          <code> ?token=</code>.
        </p>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      subtitle="Set your name and a password to activate your teacher account."
      tip={<>Invite links expire after seven days and can be used only once.</>}
      title="Accept your invite"
    >
      <form method="post" onSubmit={accept}>
        <label htmlFor="invite-name">Your full name</label>
        <input
          autoComplete="name"
          id="invite-name"
          minLength={2}
          name="name"
          required
          type="text"
        />
        <label htmlFor="invite-password">Choose a password</label>
        <input
          autoComplete="new-password"
          id="invite-password"
          minLength={8}
          name="password"
          required
          type="password"
        />
        <label htmlFor="invite-confirm">Confirm password</label>
        <input
          autoComplete="new-password"
          id="invite-confirm"
          minLength={8}
          name="confirmPassword"
          required
          type="password"
        />
        <button className="authSubmit" disabled={submitting} type="submit">
          {submitting ? "Activating…" : "Activate my account"}
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

export default function AcceptInvitePage() {
  return (
    <Suspense
      fallback={
        <main className="authPage">
          <p className="logoutStatus">Loading your invite…</p>
        </main>
      }
    >
      <AcceptInviteForm />
    </Suspense>
  );
}
