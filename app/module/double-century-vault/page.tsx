import { requireModulePage } from "../../lib/content-page";
import type { Metadata } from "next";
import { DoubleCenturyVault } from "./DoubleCenturyVault";

export const metadata: Metadata = {
  title: "Double Century Vault",
  description:
    "An interactive Class 3 place-value and number-sense mission from CyberShiksha.",
};

export default async function DoubleCenturyVaultPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await searchParams;
  const { student: session, role } = await requireModulePage("grade-3-double-century-vault");
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
