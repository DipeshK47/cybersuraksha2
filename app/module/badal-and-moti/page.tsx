import type { Metadata } from "next";
import { BadalAndMoti } from "./BadalAndMoti";

export const metadata: Metadata = {
  title: "Badal and Moti · Class 3 English",
  description:
    "An interactive Class 3 English grammar lesson from CyberSuraksha: -ed words, question marks and full stops, and word pairs from NCERT Santoor Chapter 2.",
};

export default async function BadalAndMotiPage({
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
    <BadalAndMoti className={className} role={role} studentId={studentId} />
  );
}
