import { redirect } from "next/navigation";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  redirect(`/teach/lms/students/${encodeURIComponent((await params).id)}`);
}
