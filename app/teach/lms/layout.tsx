import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getSessionFromCookieHeader } from "../../lib/session";
export default async function LmsLayout({ children }: { children: ReactNode }) {
  if (!await getSessionFromCookieHeader((await headers()).get("cookie"))) redirect("/teacher-login");
  return children;
}
