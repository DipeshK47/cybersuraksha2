import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function TeacherHeader({
  active,
}: {
  active: "lessons" | "roster" | "results" | "admin";
}) {
  return (
    <header className="teacherHeader">
      <Link className="teacherWordmark" href="/dashboard?role=teacher">
        <b>Cyber</b>Suraksha
        <small>· Teacher</small>
      </Link>
      <nav aria-label="Teacher navigation">
        <Link className={active === "lessons" ? "active" : ""} href="/dashboard?role=teacher">
          Lessons
        </Link>
        <Link className={active === "roster" ? "active" : ""} href="/teach">
          Roster
        </Link>
        <Link className={active === "results" ? "active" : ""} href="/teach/results">
          Results
        </Link>
        <Link className={active === "admin" ? "active" : ""} href="/teach/admin">
          Admin
        </Link>
        <Link href="/logout">Log out</Link>
        <ThemeToggle />
      </nav>
    </header>
  );
}
