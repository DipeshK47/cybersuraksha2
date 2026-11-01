import { requirePlatformAdmin } from "../../../../lib/platform-session";

export async function GET(request: Request) {
  const admin = await requirePlatformAdmin(request);
  if (admin instanceof Response) return admin;
  return Response.json({ admin });
}
