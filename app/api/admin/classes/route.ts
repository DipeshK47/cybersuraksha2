import { and, asc, eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { classes } from "../../../../db/schema";
import { requireRole } from "../../../lib/auth";
import { writeAudit } from "../../../lib/audit";
import { createClassSchema, parseJson } from "../../../lib/validation";

/** List classes in the admin's school. */
export async function GET(request: Request) {
  const auth = await requireRole(request, "school_admin");
  if (auth instanceof Response) return auth;

  const rows = await getDb()
    .select({
      id: classes.id,
      grade: classes.grade,
      section: classes.section,
      name: classes.name,
    })
    .from(classes)
    .where(eq(classes.schoolId, auth.schoolId))
    .orderBy(asc(classes.grade), asc(classes.section));

  return Response.json({ classes: rows });
}

/** Create a class in the admin's school. */
export async function POST(request: Request) {
  const auth = await requireRole(request, "school_admin");
  if (auth instanceof Response) return auth;

  const parsed = await parseJson(request, createClassSchema);
  if (parsed.error) return parsed.error;

  const grade = parsed.data.grade;
  const section = (parsed.data.section ?? "").trim().toUpperCase();
  const name = (parsed.data.name ?? `${grade}${section}`).trim().toUpperCase();
  if (!name) {
    return Response.json({ error: "A class name is required." }, { status: 400 });
  }

  const [existing] = await getDb()
    .select({ id: classes.id })
    .from(classes)
    .where(and(eq(classes.schoolId, auth.schoolId), eq(classes.name, name)))
    .limit(1);
  if (existing) {
    return Response.json(
      { error: "That class already exists.", classId: existing.id },
      { status: 409 },
    );
  }

  const [created] = await getDb()
    .insert(classes)
    .values({ schoolId: auth.schoolId, grade, section, name })
    .returning({
      id: classes.id,
      grade: classes.grade,
      section: classes.section,
      name: classes.name,
    });

  await writeAudit({
    actorTeacherId: auth.id,
    action: "class.create",
    targetType: "class",
    targetId: created.id,
    metadata: { name },
  });

  return Response.json({ class: created }, { status: 201 });
}
