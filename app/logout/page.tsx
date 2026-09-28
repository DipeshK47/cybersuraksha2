"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    async function signOut() {
      // Destroy the server-side session; the HttpOnly cookie cannot be cleared
      // from client script, so the server clears it in the response.
      try {
        await fetch("/api/auth/logout", { method: "POST" });
      } catch {
        // Even if the network call fails, drop any local hints and move on.
      }
      sessionStorage.removeItem("cybersuraksha-role");
      sessionStorage.removeItem("cybersuraksha-student");
      if (!cancelled) router.replace("/");
    }
    void signOut();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <main className="authPage">
      <p className="logoutStatus">Signing out…</p>
    </main>
  );
}
