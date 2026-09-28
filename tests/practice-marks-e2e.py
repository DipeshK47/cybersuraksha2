"""Do practice marks actually get recorded, and recorded HONESTLY?

The one-shot rule and the marks behind it are the graded part of the product, so
this drives the whole path against a running dev server and a real D1:

    login -> POST an answer -> row in question_attempts -> topic/chapter rollups

and the three ways it could be wrong:

    a second attempt at the same question must be refused
    a client claiming `isCorrect: true` on a wrong option must still score 0
    a page reload must not hand back a free second look

Requires the dev server WITHOUT CYBERSURAKSHA_EPHEMERAL_WORKERS=1, since that flag skips
the database entirely.

    PLAYWRIGHT_BROWSERS_PATH=~/.cache/ms-playwright \
    <venv>/bin/python tests/practice-marks-e2e.py

Exits non-zero on failure so it is usable as a CI gate.
"""
import glob
import json
import os
import sqlite3
import sys
import urllib.error
import urllib.request

BASE = os.environ.get("BASE_URL", "http://localhost:4180")
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# A student of its own, so the gate never fights another test for the one-shot
# slots and can reset itself before each run.
STUDENT = {"school": "dps-rkp", "className": "8B", "rollNo": "33", "password": "DPS33SAFE"}

# (question id, option to send, is that option correct)
WRONG, RIGHT = False, True
TOPIC = "proving"
STEPS = [
    ("prove-side", "work on one side until it becomes the other", RIGHT),
    ("prove-first-move", "square both sides", WRONG),
]

failures = []


def check(label, ok, detail=""):
    print(f"{'ok  ' if ok else 'FAIL'} {label}" + ("" if ok else f"  — {detail}"))
    if not ok:
        failures.append(label)


def call(path, body=None, cookie=None):
    req = urllib.request.Request(f"{BASE}{path}", method="POST" if body else "GET")
    if body is not None:
        req.data = json.dumps(body).encode()
        req.add_header("content-type", "application/json")
    if cookie:
        req.add_header("cookie", cookie)
    try:
        with urllib.request.urlopen(req) as r:
            return r.status, json.loads(r.read() or b"{}"), r.headers
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read() or b"{}"), e.headers


def db():
    matches = glob.glob(
        os.path.join(ROOT, ".wrangler/state/v3/d1/miniflare-D1DatabaseObject/*.sqlite")
    )
    if not matches:
        print("FAIL no local D1 file — is the dev server running without "
              "CYBERSURAKSHA_EPHEMERAL_WORKERS=1?")
        sys.exit(1)
    return sqlite3.connect(matches[0], timeout=15)


# ── sign in ────────────────────────────────────────────────────────────────
status, payload, headers = call("/api/auth/student", STUDENT)
if status != 200:
    print(f"FAIL could not sign in ({status}): {payload}")
    sys.exit(1)
student_id = payload["student"]["id"]
cookie = headers["set-cookie"].split(";")[0]
print(f"signed in as {payload['student']['name']} (id {student_id})\n")

# Reset this student's attempts so the gate is repeatable. One shot means a
# second run would otherwise be nothing but 409s.
conn = db()
conn.execute("DELETE FROM question_attempts WHERE student_id = ?", (student_id,))
conn.execute("DELETE FROM topic_progress WHERE student_id = ?", (student_id,))
conn.execute("DELETE FROM chapter_progress WHERE student_id = ?", (student_id,))
conn.commit()

# ── the questions are graded server-side ───────────────────────────────────
expected_marks = 0
for question_id, chosen, should_be_right in STEPS:
    status, payload, _ = call(
        "/api/practice-attempt", {"questionId": question_id, "chosen": chosen}, cookie
    )
    check(f"{question_id}: recorded", status == 200, f"{status} {payload}")
    check(
        f"{question_id}: graded {'correct' if should_be_right else 'wrong'}",
        payload.get("isCorrect") is should_be_right,
        str(payload),
    )
    marks = 1 if should_be_right else 0
    expected_marks += marks
    check(f"{question_id}: scored {marks}", payload.get("marksAwarded") == marks, str(payload))

# ── one shot ───────────────────────────────────────────────────────────────
first = STEPS[0][0]
status, payload, _ = call("/api/practice-attempt", {"questionId": first, "chosen": "anything"}, cookie)
check("a second attempt is refused", status == 409, f"{status} {payload}")

count = conn.execute(
    "SELECT COUNT(*) FROM question_attempts WHERE student_id = ? AND question_id = ?",
    (student_id, first),
).fetchone()[0]
check("the refused attempt left no extra row", count == 1, f"{count} rows")

# ── the client cannot grade itself ─────────────────────────────────────────
status, payload, _ = call(
    "/api/practice-attempt",
    {"questionId": "prove-ex10", "chosen": "1 + sin\u00b2A",
     "isCorrect": True, "marksAwarded": 99, "marksPossible": 99},
    cookie,
)
check(
    "a spoofed `isCorrect` is ignored",
    status == 200 and payload.get("isCorrect") is False and payload.get("marksAwarded") == 0,
    f"{status} {payload}",
)
check("a spoofed mark total is ignored", payload.get("marksPossible") == 1, str(payload))

# ── unauthenticated and unknown ────────────────────────────────────────────
status, _, _ = call("/api/practice-attempt", {"questionId": first, "chosen": "x"})
check("a signed-out request is rejected", status == 401, str(status))
status, _, _ = call("/api/practice-attempt", {"questionId": "no-such-question", "chosen": "x"}, cookie)
check("an unknown question is rejected", status == 404, str(status))

# ── rollups ────────────────────────────────────────────────────────────────
row = conn.execute(
    "SELECT questions_attempted, questions_correct, marks_awarded, marks_possible, "
    "questions_total FROM topic_progress WHERE student_id = ? AND topic_slug = ?",
    (student_id, TOPIC),
).fetchone()
check("the topic rollup exists", row is not None)
if row:
    attempted, correct, awarded, possible, total = row
    check("topic counted every attempt", attempted == 3, f"attempted={attempted}")
    check("topic counted only real correct answers", correct == 1, f"correct={correct}")
    check("topic marks match the grading", awarded == expected_marks, f"{awarded} vs {expected_marks}")
    check("topic marks_possible tracks attempts", possible == 3, f"possible={possible}")
    check("topic knows its denominator", total > 3, f"total={total}")

row = conn.execute(
    "SELECT topics_total, marks_awarded FROM chapter_progress WHERE student_id = ?",
    (student_id,),
).fetchone()
check("the chapter rollup exists", row is not None)
if row:
    check("chapter knows all 18 topics", row[0] == 18, f"topics_total={row[0]}")
    check("chapter marks match the topic", row[1] == expected_marks, f"{row[1]} vs {expected_marks}")

# ── the browser: a reload must not unlock what was already answered ────────
try:
    from playwright.sync_api import sync_playwright
except ImportError:
    print("\nskip browser reload check — playwright not importable here")
else:
    token = cookie.split("=", 1)[1]
    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context(viewport={"width": 1500, "height": 1200})
        context.add_cookies([{"name": "cybersuraksha_student_session", "value": token,
                              "domain": "localhost", "path": "/", "httpOnly": True}])
        page = context.new_page()
        posted = []
        page.on("request", lambda r: posted.append(r.method)
                if "practice-attempt" in r.url and r.method == "POST" else None)
        page.goto(f"{BASE}/grade/10/mathematics/introduction-to-trigonometry"
                  "?role=student&studentId=%d&className=8B" % student_id,
                  wait_until="domcontentloaded", timeout=120_000)
        page.wait_for_timeout(3500)
        page.get_by_role("button", name="Proving an identity", exact=False).first.click()
        page.wait_for_timeout(3000)

        choices = page.locator("[aria-label='Choose one answer']").first
        choices.wait_for(state="visible", timeout=30_000)
        choices.scroll_into_view_if_needed()
        page.wait_for_timeout(600)

        buttons = choices.get_by_role("button")
        locked = [buttons.nth(i).is_disabled() for i in range(buttons.count())]
        check("every option stays locked after a reload", all(locked), str(locked))

        # CSS uppercases the label, so compare case-insensitively.
        card = choices.locator("xpath=..").inner_text().lower()
        check("the reveal is restored too", "the answer was" in card
              or "correct answer" in card, card[:120])

        # Clicking a locked option must not fire a request at all.
        try:
            buttons.first.click(timeout=2000)
        except Exception:
            pass
        page.wait_for_timeout(800)
        check("a locked option posts nothing", not posted, str(posted))

        # ...but a FRESH question must still record. Posting is skipped for
        # signed-out visitors, so without this a broken signed-in check would
        # silently stop recording every mark in the product and every other
        # assertion here would still pass.
        before = conn.execute(
            "SELECT COUNT(*) FROM question_attempts WHERE student_id = ?", (student_id,)
        ).fetchone()[0]
        for _ in range(3):
            page.get_by_role("button", name="Next question", exact=False).first.click()
            page.wait_for_timeout(700)
        fresh = page.locator("[aria-label='Choose one answer']").first
        fresh.scroll_into_view_if_needed()
        fresh.get_by_role("button").first.click()
        page.wait_for_timeout(2000)
        after = conn.execute(
            "SELECT COUNT(*) FROM question_attempts WHERE student_id = ?", (student_id,)
        ).fetchone()[0]
        check("answering in the browser records a mark", after == before + 1,
              f"{before} -> {after}, posts seen: {posted}")

        page.screenshot(path=os.path.join(ROOT, "tmp-practice-marks.png"))
        browser.close()

conn.close()
print()
if failures:
    print(f"{len(failures)} FAILED: " + "; ".join(failures))
    sys.exit(1)
print("practice marks record honestly, one shot only")
