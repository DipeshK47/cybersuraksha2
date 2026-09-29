import { z } from "zod";

/**
 * Central request-body validation. Every mutating endpoint parses its body
 * through a zod schema so malformed input is rejected with a consistent 400
 * before touching the database.
 */
export async function parseJson<T>(
  request: Request,
  schema: z.ZodType<T>,
): Promise<{ data: T; error?: undefined } | { data?: undefined; error: Response }> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return { error: Response.json({ error: "Invalid JSON body." }, { status: 400 }) };
  }
  const result = schema.safeParse(body);
  if (!result.success) {
    const issue = result.error.issues[0];
    const where = issue?.path.join(".") || "body";
    return {
      error: Response.json(
        { error: `${where}: ${issue?.message ?? "invalid"}` },
        { status: 400 },
      ),
    };
  }
  return { data: result.data };
}

const email = z.string().trim().toLowerCase().email();
const nonEmpty = z.string().min(1);

export const teacherLoginSchema = z.object({
  email,
  password: z.string().min(1).max(200),
});

export const studentLoginSchema = z.object({
  school: nonEmpty,
  // Roll numbers are unique per class, not globally — both are required to
  // identify a learner.
  className: z.string().trim().min(1).max(12).toUpperCase(),
  rollNo: z.string().trim().min(1).max(20),
  password: z.string().min(1).max(200),
});

export const registerSchoolSchema = z.object({
  schoolName: z.string().trim().min(2).max(160),
  contactName: z.string().trim().min(2).max(120),
  contactEmail: email,
  studentCount: z.coerce.number().int().min(0).max(100_000).nullish(),
});

export const acceptInviteSchema = z.object({
  token: z.string().min(10).max(200),
  name: z.string().trim().min(2).max(120),
  password: z.string().min(8).max(200),
});

export const inviteSchema = z.object({
  email,
  role: z.enum(["teacher", "school_admin"]).optional(),
});

export const createClassSchema = z.object({
  grade: z.coerce.number().int().min(1).max(12),
  section: z.string().trim().max(4).optional(),
  name: z.string().trim().max(12).optional(),
});

export const createStudentsSchema = z.object({
  className: z.string().trim().min(1).max(12),
  students: z
    .array(
      z.object({
        rollNo: z.string().trim().min(1).max(20).optional(),
        name: z.string().trim().min(1).max(120).optional(),
      }),
    )
    .min(1)
    .max(200),
});

export const teacherStatusSchema = z.object({
  action: z.enum(["approve", "suspend", "reactivate"]),
});

export const teacherClassesSchema = z.object({
  classIds: z.array(z.coerce.number().int().positive()).max(100),
});

const activityEventSchema = z.object({
  moduleId: z.string().min(1).max(80),
  type: z.string().min(1).max(40),
  payload: z.unknown().optional(),
  runId: z.number().int().optional(),
  attemptKey: z.string().uuid().optional(),
  eventId: z.string().uuid().optional(),
});

export const activitySchema = z.union([
  z.object({ events: z.array(activityEventSchema).min(1).max(50) }),
  activityEventSchema,
]);

/**
 * A practice answer.
 *
 * Note what is NOT here: `correct`, and any notion of marks. The client reports
 * only which option it clicked; the server looks the question up in the bank
 * and grades it. Accepting a client-supplied verdict would let a student post a
 * perfect score with curl.
 */
export const practiceAttemptSchema = z.object({
  questionId: z.string().min(1).max(80),
  chosen: z.string().min(1).max(200),
  timeTakenMs: z.coerce.number().int().min(0).max(3_600_000).optional(),
  hintsUsed: z.coerce.number().int().min(0).max(50).optional(),
});

export const moduleRunSchema = z.object({
  moduleId: z.string().min(1).max(80),
  rank: z.string().max(20).optional(),
  leaks: z.coerce.number().optional(),
  drill: z.coerce.number().optional(),
  recall: z.coerce.number().optional(),
  path: z.string().max(20).optional(),
  durationSeconds: z.coerce.number().optional(),
});
