import { headers } from "next/headers";
import { getStudentSessionFromCookieHeader } from "../../lib/student-session";
import type { Metadata } from "next";
import { ToyWorkshop } from "./ToyWorkshop";

export const metadata: Metadata = {
  title: "Toy Workshop",
  description:
    "An interactive Class 3 spatial-thinking and pattern mission from CyberSuraksha.",
};

export default async function ToyWorkshopPage({
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
    <ToyWorkshop
      className={className}
      role={role}
      studentId={studentId}
    />
  );
}
