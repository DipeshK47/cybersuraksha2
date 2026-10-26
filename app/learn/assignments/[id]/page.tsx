import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { StudentAssignment } from "../../../components/lms/StudentAssignment";
import { getStudentSessionFromCookieHeader } from "../../../lib/student-session";
export default async function Page() {
  if (!await getStudentSessionFromCookieHeader((await headers()).get("cookie"))) redirect("/student-login");
  return <StudentAssignment />;
}
