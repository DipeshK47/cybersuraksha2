import { requireModulePage } from "../../lib/content-page";
import type { Metadata } from "next";
import { BadalAndMoti } from "./BadalAndMoti";

export const metadata: Metadata = {
  title: "Badal and Moti · Class 3 English",
  description:
    "An interactive Class 3 English grammar lesson from CyberShiksha: -ed words, question marks and full stops, and word pairs from NCERT Santoor Chapter 2.",
};

export default async function BadalAndMotiPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await searchParams;
  const { student: session, role } = await requireModulePage("grade-3-english-badal-and-moti");
  const studentId = session ? String(session.student.id) : undefined;
  const className = session?.student.className;

  return (
    <BadalAndMoti className={className} role={role} studentId={studentId} />
  );
}
