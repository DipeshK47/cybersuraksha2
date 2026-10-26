import { requireModulePage } from "../../lib/content-page";
import type { Metadata } from "next";
import { SecretMessageRescue } from "./SecretMessageRescue";

export const metadata: Metadata = {
  title: "Secret Message Rescue",
  description:
    "A playable Class 3 Caesar Cipher mission from CyberShiksha.",
};

export default async function SecretMessageRescuePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await searchParams;
  const { student: session, role } = await requireModulePage("grade-3-secret-message-rescue");
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
