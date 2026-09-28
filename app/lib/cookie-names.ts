/**
 * Session cookie names, kept in their own dependency-free module.
 *
 * The worker entry gates teacher routes by sniffing the cookie header, and it
 * cannot import `session.ts` — that pulls Drizzle and the D1 binding into the
 * outermost edge shell. So the name has to be shared from somewhere both sides
 * can reach. During the CyberSuraksha rename the worker held its own copy of
 * the literal in a regex, which is precisely how a rename leaves auth silently
 * broken: every login still sets a cookie the gate no longer recognises.
 */
export const SESSION_COOKIE = "cybersuraksha_session";
export const STUDENT_SESSION_COOKIE = "cybersuraksha_student_session";
