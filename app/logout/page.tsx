"use client";

import { useCallback, useEffect, useState } from "react";

export default function LogoutPage() {
  const [failed, setFailed] = useState(false);

  const signOut = useCallback(async () => {
    // Destroy the server-side session; the HttpOnly cookie cannot be cleared
    // from client script, so the server clears it in the response. Only a
    // confirmed revocation counts — on a shared device "signed out" must be true.
    let ok = false;
    try {
      ok = (await fetch("/api/auth/logout", { method: "POST" })).ok;
    } catch {
      ok = false;
    }
    if (!ok) {
      setFailed(true);
      return;
    }
    sessionStorage.removeItem("cybersuraksha-role");
    sessionStorage.removeItem("cybersuraksha-student");
    sessionStorage.removeItem("cybersuraksha-guide-session");
    // A full navigation (not a client route change) remounts the root layout,
    // dropping private client state such as the assistant's conversation.
    window.location.replace("/");
  }, []);

  useEffect(() => {
    // signOut sets state only after the request settles.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void signOut();
  }, [signOut]);

  return (
    <main className="authPage">
      {failed ? (
        <div className="logoutStatus" role="alert">
          <p>You are not signed out yet: the server could not be reached.</p>
          <button className="authSubmit" onClick={() => { setFailed(false); void signOut(); }} type="button">
            Try again
          </button>
        </div>
      ) : (
        <p className="logoutStatus">Signing out…</p>
      )}
    </main>
  );
}
