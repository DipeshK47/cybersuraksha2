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
  const query = await searchParams;
  const role = query.role === "teacher" ? "teacher" : "student";
  const studentId =
    typeof query.studentId === "string" ? query.studentId : undefined;
  const className =
    typeof query.className === "string" ? query.className : undefined;

  return (
    <ToyWorkshop
      className={className}
      role={role}
      studentId={studentId}
    />
  );
}
