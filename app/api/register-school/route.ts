import { getDb } from "../../../db";
import { ensureMigrated } from "../../../db/migrate";
import { schoolRequests } from "../../../db/schema";
import { enforceRateLimit } from "../../lib/rate-limit";
import { parseJson, registerSchoolSchema } from "../../lib/validation";

/**
 * Public school-interest form. This is the only unauthenticated write in the
 * app, so it is both schema-validated and rate limited.
 */
export async function POST(request: Request) {
  const limited = enforceRateLimit(request, "register-school", 5, 60_000);
  if (limited) return limited;

  const parsed = await parseJson(request, registerSchoolSchema);
  if (parsed.error) return parsed.error;
  const { schoolName, contactName, contactEmail, studentCount } = parsed.data;

  await ensureMigrated();
  const [registration] = await getDb()
    .insert(schoolRequests)
    .values({
      schoolName,
      contactName,
      contactEmail,
      studentCount: studentCount ?? null,
    })
    .returning();
  return Response.json({ registration }, { status: 201 });
}
