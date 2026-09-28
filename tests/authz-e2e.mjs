// Authorization + hardening regression tests.
//
// Runs against a live server (default http://localhost:3000). Start the dev or
// production server first, then:
//   BASE_URL=http://localhost:3000 node --test tests/authz-e2e.mjs
//
// These codify the security invariants established in P1–P6: no data without a
// session, per-role gating, tenancy scoping, anti-spoofing, validation, headers,
// and rate limiting.

import test from "node:test";
import assert from "node:assert/strict";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const ADMIN = { email: "teacher@dpsrkp.edu.in", password: "Teacher@123" };
const STUDENT = {
  school: "dps-rkp",
  className: "7A",
  rollNo: "20",
  password: "DPS20SAFE",
};

function cookieFrom(response) {
  const raw = response.headers.get("set-cookie") ?? "";
  return raw.split(/,(?=\s*\w+=)/).map((c) => c.split(";")[0].trim()).join("; ");
}

async function post(path, body, cookie) {
  return fetch(`${BASE}${path}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(cookie ? { cookie } : {}),
    },
    body: JSON.stringify(body),
    redirect: "manual",
  });
}

async function get(path, cookie) {
  return fetch(`${BASE}${path}`, {
    headers: cookie ? { cookie } : {},
    redirect: "manual",
  });
}

test("teacher login rejects wrong password", async () => {
  const res = await post("/api/auth/teacher", { ...ADMIN, password: "nope" });
  assert.equal(res.status, 401);
});

test("teacher login succeeds and issues a session cookie", async () => {
  const res = await post("/api/auth/teacher", ADMIN);
  assert.equal(res.status, 200);
  assert.match(cookieFrom(res), /cybersuraksha_session=/);
});

test("roster requires authentication", async () => {
  assert.equal((await get("/api/academy")).status, 401);
});

test("student create requires authentication", async () => {
  const res = await post("/api/students", { className: "9Z", students: [{ rollNo: "1", name: "X" }] });
  assert.equal(res.status, 401);
});

test("analytics requires authentication", async () => {
  assert.equal((await get("/api/analytics")).status, 401);
});

test("module-runs requires a student session (no anonymous writes)", async () => {
  const res = await post("/api/module-runs", { moduleId: "grade-3-toy-workshop", drill: 100 });
  assert.equal(res.status, 401);
});

test("activity ingestion requires a student session", async () => {
  const res = await post("/api/activity", { moduleId: "grade-3-toy-workshop", type: "module_started" });
  assert.equal(res.status, 401);
});

test("invalid body is rejected with 400 (zod)", async () => {
  const login = await post("/api/auth/teacher", ADMIN);
  const cookie = cookieFrom(login);
  const res = await post("/api/admin/classes", { grade: "not-a-number" }, cookie);
  assert.equal(res.status, 400);
});

test("student login issues a student session", async () => {
  const res = await post("/api/auth/student", STUDENT);
  assert.equal(res.status, 200);
  assert.match(cookieFrom(res), /cybersuraksha_student_session=/);
});

test("unauthenticated /teach redirects to login", async () => {
  const res = await get("/teach");
  assert.equal(res.status, 302);
  assert.match(res.headers.get("location") ?? "", /teacher-login/);
});

test("security headers are present on documents", async () => {
  const res = await get("/");
  assert.equal(res.headers.get("x-content-type-options"), "nosniff");
  assert.equal(res.headers.get("x-frame-options"), "DENY");
  assert.ok((res.headers.get("content-security-policy") ?? "").includes("default-src"));
});

test("student login is scoped to the class, not the roll number alone", async () => {
  // Roll numbers repeat across classes; the roll alone must not authenticate.
  const res = await post("/api/auth/student", { ...STUDENT, className: "8B" });
  assert.equal(res.status, 401);
});

test("the dashboard ignores ?studentId and shows only the session's learner", async () => {
  const login = await post("/api/auth/student", STUDENT);
  const cookie = cookieFrom(login);
  // Aarav Mehta is roll 20; Ananya Iyer is a different learner in 8B.
  const res = await get("/dashboard?role=student&studentId=6&className=8B", cookie);
  const html = await res.text();
  assert.equal(res.status, 200);
  assert.ok(html.includes("Aarav Mehta"), "own profile should render");
  assert.ok(!html.includes("Ananya Iyer"), "another learner must never render");
});

test("the dashboard requires a session", async () => {
  const res = await get("/dashboard?role=student&studentId=1");
  assert.equal(res.status, 307);
  assert.match(res.headers.get("location") ?? "", /\/$/);
});

test("school registration validates its body", async () => {
  const res = await post("/api/register-school", {
    schoolName: "A",
    contactName: "B",
    contactEmail: "not-an-email",
  });
  assert.equal(res.status, 400);
});

test("the invite accept link resolves to a real page", async () => {
  const login = await post("/api/auth/teacher", ADMIN);
  const cookie = cookieFrom(login);
  const invite = await post(
    "/api/admin/invites",
    { email: `invitee-${Date.now()}@dpsrkp.edu.in`, role: "teacher" },
    cookie,
  );
  assert.equal(invite.status, 201);
  const { invite: created } = await invite.json();
  assert.match(created.acceptUrl, /\/accept-invite\?token=/);
  const page = await get(new URL(created.acceptUrl).pathname);
  assert.equal(page.status, 200);
});

test("auth endpoints are rate limited (429 under burst)", async () => {
  // Fire more than the per-window limit; expect at least one 429.
  const attempts = await Promise.all(
    Array.from({ length: 20 }, () =>
      post("/api/auth/teacher", { email: "burst@dpsrkp.edu.in", password: "x" }),
    ),
  );
  assert.ok(attempts.some((r) => r.status === 429), "expected a 429 under burst");
});
