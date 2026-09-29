import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { StudentInbox } from "../../components/lms/LmsPortal";
import { getStudentSessionFromCookieHeader } from "../../lib/student-session";
export default async function Page() {
  const session = await getStudentSessionFromCookieHeader((await headers()).get("cookie"));
  if (!session) redirect("/student-login");
  return <StudentInbox studentId={session.student.id} grade={Number.parseInt(session.student.className, 10)} />;
}
