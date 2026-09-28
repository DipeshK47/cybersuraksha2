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
  const query = await searchParams;
  const role = query.role === "teacher" ? "teacher" : "student";
  const studentId =
    typeof query.studentId === "string" ? query.studentId : undefined;
  const className =
    typeof query.className === "string" ? query.className : undefined;

  return (
    <DoubleCenturyVault
      className={className}
      role={role}
      studentId={studentId}
    />
  );
}
