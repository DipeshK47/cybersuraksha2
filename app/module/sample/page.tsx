import Link from "next/link";
import { MessageCircleWarning, ShieldCheck } from "lucide-react";

export default async function SampleModulePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const track = params.track === "senior" ? "senior" : "junior";
  const role = params.role === "student" ? "student" : "teacher";
  const studentId =
    typeof params.studentId === "string" ? params.studentId : undefined;
  const roleQuery =
    role === "student"
      ? `role=student${studentId ? `&studentId=${studentId}` : ""}`
      : "role=teacher";

  return (
    <main className="modulePreviewPage">
      <header className="modulePreviewNav">
        <Link href={`/track/${track}?${roleQuery}`}>← Exit</Link>
        <span>CyberSuraksha · Sample</span>
      </header>
      <section className="modulePreviewCard">
        <span className="modulePreviewIcon">
          <MessageCircleWarning aria-hidden="true" />
        </span>
        <p className="modulePreviewEyebrow">Sample module UI</p>
        <h1>
          {track === "senior"
            ? "The Deepfake Call"
            : "Who’s Really Behind the Screen?"}
        </h1>
        <p>
          This is the module placeholder requested for the CyberSuraksha clone. The
          lesson story, questions, scoring engine, audio, and scenario content
          are intentionally not copied.
        </p>
        <div className="modulePreviewOutcome">
          <ShieldCheck aria-hidden="true" />
          <span>
            The surrounding student progress, teacher roster, results, and
            reports remain fully connected.
          </span>
        </div>
        <Link className="pillButton pillButtonPrimary" href={`/track/${track}?${roleQuery}`}>
          Return to track
        </Link>
      </section>
    </main>
  );
}
