import { asc } from "drizzle-orm";
import { getDb } from "../../../db";
import { ensureAcademySeeded } from "../../../db/academy";
import { schools } from "../../../db/schema";

export async function GET() {
  await ensureAcademySeeded();
  const rows = await getDb().select({ name: schools.name, slug: schools.slug }).from(schools).orderBy(asc(schools.name));
  return Response.json({ schools: rows });
}
