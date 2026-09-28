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
  const query = await searchParams;
  const role = query.role === "teacher" ? "teacher" : "student";
  const studentId =
    typeof query.studentId === "string" ? query.studentId : undefined;
  const className =
    typeof query.className === "string" ? query.className : undefined;

  return (
    <SecretMessageRescue
      className={className}
      role={role}
      studentId={studentId}
    />
  );
}
