import { requireModulePage } from "../../lib/content-page";
import type { Metadata } from "next";
import { ToyWorkshop } from "./ToyWorkshop";

export const metadata: Metadata = {
  title: "Toy Workshop",
  description:
    "An interactive Class 3 spatial-thinking and pattern mission from CyberShiksha.",
};

export default async function ToyWorkshopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await searchParams;
  const { student: session, role } = await requireModulePage("grade-3-toy-workshop");
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
