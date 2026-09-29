import { headers } from "next/headers";
import { getStudentSessionFromCookieHeader } from "../../lib/student-session";
import type { Metadata } from "next";
import { DoubleCenturyVault } from "./DoubleCenturyVault";

export const metadata: Metadata = {
  title: "Double Century Vault",
  description:
    "An interactive Class 3 place-value and number-sense mission from CyberSuraksha.",
};

export default async function DoubleCenturyVaultPage({
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
    <DoubleCenturyVault
      className={className}
      role={role}
      studentId={studentId}
    />
  );
}
