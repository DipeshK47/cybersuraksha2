import { asc, eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { teachers } from "../../../../db/schema";
import { requireRole } from "../../../lib/auth";

/** List all teachers in the admin's school (never exposes password hashes). */
export async function GET(request: Request) {
  const auth = await requireRole(request, "school_admin");
  if (auth instanceof Response) return auth;

  const rows = await getDb()
    .select({
      id: teachers.id,
      name: teachers.name,
      email: teachers.email,
      role: teachers.role,
      status: teachers.status,
      createdAt: teachers.createdAt,
    })
    .from(teachers)
    .where(eq(teachers.schoolId, auth.schoolId))
    .orderBy(asc(teachers.name));

  return Response.json({ teachers: rows });
}
