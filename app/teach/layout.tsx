import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSessionFromCookieHeader } from "../lib/session";

export default async function TeacherLayout({ children }: { children: React.ReactNode }) {
  if (!await getSessionFromCookieHeader((await headers()).get("cookie"))) redirect("/teacher-login");
  return children;
}
