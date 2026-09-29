import { headers } from "next/headers";
import { getStudentSessionFromCookieHeader } from "../../lib/student-session";
import type { Metadata } from "next";
import { NaniMaaVacationChallenge } from "./NaniMaaVacationChallenge";

export const metadata: Metadata = {
  title: "Nani Maa's Vacation Challenge",
  description:
    "An interactive Class 3 fair-sharing and number-tracking mission from CyberSuraksha.",
};

export default async function NaniMaaVacationChallengePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await searchParams;
  const session = await getStudentSessionFromCookieHeader((await headers()).get("cookie"));
  const role = session ? "student" : "teacher";
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
