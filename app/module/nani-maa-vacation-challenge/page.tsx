import { requireModulePage } from "../../lib/content-page";
import type { Metadata } from "next";
import { NaniMaaVacationChallenge } from "./NaniMaaVacationChallenge";

export const metadata: Metadata = {
  title: "Nani Maa's Vacation Challenge",
  description:
    "An interactive Class 3 fair-sharing and number-tracking mission from CyberShiksha.",
};

export default async function NaniMaaVacationChallengePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await searchParams;
  const { student: session, role } = await requireModulePage("grade-3-nani-maa-vacation-challenge");
  const studentId = session ? String(session.student.id) : undefined;
  const className = session?.student.className;

  return (
    <NaniMaaVacationChallenge
      className={className}
      role={role}
      studentId={studentId}
    />
  );
}
