import Link from "next/link";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { ThemeToggle } from "../../components/ThemeToggle";

const comingSoon = [
  {
    title: "The Pressure",
    copy: "When “send it”, “prove it”, and “now” start doing the talking.",
  },
  {
    title: "Gaming Chats & Random DMs",
    copy: "Squad invites, free skins, and the people hiding behind them.",
  },
  {
    title: "Don’t Open That!",
    copy: "Some downloads do exactly what they promised. To someone else.",
  },
  {
    title: "Spot It, Stop It, Tell Someone",
    copy: "Everything you have learned, in one final real-world test.",
  },
];

export default async function TrackPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const role = query.role === "student" ? "student" : "teacher";
  const studentId =
    typeof query.studentId === "string" ? query.studentId : undefined;
  const roleQuery =
    role === "student"
      ? `role=student${studentId ? `&studentId=${studentId}` : ""}`
      : "role=teacher";
  const isSenior = slug === "senior";

  return (
    <main className="trackPage">
      <header className="trackNav">
        <Link href={`/dashboard?${roleQuery}`}>← CyberSuraksha</Link>
        <div>
          <Link href="/logout">Log out</Link>
          <ThemeToggle />
        </div>
      </header>
      <section className="trackShell">
        <div className={`trackIntro${isSenior ? " trackIntroTeal" : ""}`}>
          <p>{isSenior ? "Grades 9 – 12" : "Grades 6 – 8"}</p>
          <h1>{isSenior ? "Senior Track" : "Junior Track"}</h1>
          <span>
            {isSenior
              ? "Deeper awareness — scams, deepfakes, and protecting your family."
              : "Cyber Suraksha foundations — spotting tricks, staying safe online."}
          </span>
          <div className="trackUnlock">
            <span>
              <i style={{ width: isSenior ? "18%" : "34%" }} />
            </span>
            <b>{isSenior ? "1 / 4" : "2 / 6"} unlocked</b>
          </div>
        </div>

        <section className="missionStack" aria-label="Missions">
          <Link
            className={`missionCard${isSenior ? " missionCardTeal" : ""}`}
            href={`/module/sample?track=${isSenior ? "senior" : "junior"}&${roleQuery}`}
          >
            <span className="missionNumber">01</span>
            {role === "student" && !isSenior ? (
              <span className="missionState">✓ Completed</span>
            ) : (
              <span className="missionState">Sample module</span>
            )}
            <div>
              <h2>
                {isSenior
                  ? "The Deepfake Call"
                  : "Who’s Really Behind the Screen?"}
              </h2>
              <p>
                {isSenior
                  ? "A familiar voice asks for urgent help. Learn what to verify before acting."
                  : "A friendly stranger slides into your DMs. Find out who is really typing."}
              </p>
              <small>Mission 1 · UI sample</small>
              <span className="missionAction">
                {role === "student" && !isSenior ? "Review" : "Preview"}{" "}
                <ArrowRight aria-hidden="true" />
              </span>
            </div>
          </Link>

          {comingSoon.slice(0, isSenior ? 3 : 4).map((mission, index) => (
            <article className="missionCard missionLocked" key={mission.title}>
              <span className="missionNumber">{String(index + 2).padStart(2, "0")}</span>
              <span className="missionState">
                <LockKeyhole aria-hidden="true" /> Coming soon
              </span>
              <div>
                <h2>{mission.title}</h2>
                <p>{mission.copy}</p>
                <small>Mission {index + 2}</small>
              </div>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}
