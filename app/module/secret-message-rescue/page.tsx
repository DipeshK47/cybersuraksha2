import { headers } from "next/headers";
import { getStudentSessionFromCookieHeader } from "../../lib/student-session";
import type { Metadata } from "next";
import { SecretMessageRescue } from "./SecretMessageRescue";

export const metadata: Metadata = {
  title: "Secret Message Rescue",
  description:
    "A playable Class 3 Caesar Cipher mission from CyberSuraksha.",
};

export default async function SecretMessageRescuePage({
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
    <SecretMessageRescue
      className={className}
      role={role}
      studentId={studentId}
    />
  );
}
