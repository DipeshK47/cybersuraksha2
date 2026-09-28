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
  const query = await searchParams;
  const role = query.role === "teacher" ? "teacher" : "student";
  const studentId =
    typeof query.studentId === "string" ? query.studentId : undefined;
  const className =
    typeof query.className === "string" ? query.className : undefined;

  return (
    <NaniMaaVacationChallenge
      className={className}
      role={role}
      studentId={studentId}
    />
  );
}
