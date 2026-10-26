import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getStudentSessionFromCookieHeader } from "../../lib/student-session";
import { LearningReport } from "../../components/lms/LmsPortal";

export default async function Page() {
  if (!await getStudentSessionFromCookieHeader((await headers()).get("cookie"))) redirect("/student-login");
  return <LearningReport studentView />;
}
