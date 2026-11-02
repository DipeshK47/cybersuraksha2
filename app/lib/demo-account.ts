/**
 * Fixed values for the production demo login (CYBERSURAKSHA_DEMO_TEACHER=1).
 *
 * Both are PBKDF2 hashes computed once and stored in demo-account.json, so seeding the demo on a
 * Workers Free plan request costs no hashing CPU.
 *
 * - DEMO_TEACHER_PASSWORD_HASH is the hash of the PUBLIC demo password "Teacher@123".
 *   Anyone may sign in as the demo teacher; that is the point of a demo.
 * - UNUSABLE_STUDENT_HASH is the hash of a random 512-bit secret that was never
 *   stored or printed, so none of the demo students can ever be signed in as.
 */
import hashes from "./demo-account.json" with { type: "json" };

export const DEMO_TEACHER_PASSWORD_HASH: string = hashes.teacherPasswordHash;
export const UNUSABLE_STUDENT_HASH: string = hashes.unusableStudentHash;
