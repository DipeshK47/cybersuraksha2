"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getJson } from "../lib/read-json";
import { BrandLogo } from "./BrandLogo";

export function TeacherHeader({
  active,
}: {
  active: "lessons" | "roster" | "results" | "admin" | "lms";
}) {
  // The admin APIs enforce school_admin on the server; this only hides the link from plain teachers.
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    void getJson<{ role?: string; error?: string }>("/api/auth/teacher").then(data => setIsAdmin(data.role === "school_admin"));
  }, []);
  return (
    <header className="teacherHeader">
      <Link className="teacherWordmark" href="/dashboard?role=teacher">
        <BrandLogo />
      </Link>
      <nav aria-label="Teacher navigation">
        <Link className={active === "lessons" ? "active" : ""} href="/dashboard?role=teacher">
          Lessons
        </Link>
        <Link className={active === "roster" ? "active" : ""} href="/teach">
          Roster
        </Link>
        <Link className={active === "lms" ? "active" : ""} href="/teach/lms">
          Classroom
        </Link>
        <Link className={active === "results" ? "active" : ""} href="/teach/lms/marks">
          Results
        </Link>
        {isAdmin ? (
          <Link className={active === "admin" ? "active" : ""} href="/teach/admin">
            Admin
          </Link>
        ) : null}
        <div data-language-slot />
        <Link href="/logout">Log out</Link>
      </nav>
    </header>
  );
}
