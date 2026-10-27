"""Complete every Class 8 chapter against a disposable local development server.

BASE_URL=http://localhost:3218 /path/to/playwright/python tests/class-8-browser-qa.py
The test waits for measured narration files if they are still being generated.
"""
import json
import os
from pathlib import Path
import re
import subprocess
import time
from playwright.sync_api import sync_playwright, expect

expect.set_options(timeout=60000)

ROOT = Path(__file__).resolve().parent.parent
BASE = os.environ.get("BASE_URL", "http://localhost:3218")
if not re.match(r"^http://(localhost|127\.0\.0\.1):\d+$", BASE):
    raise ValueError("Use a disposable localhost server for this data-creating check")
OUT = ROOT / ".lms-qa/class8"
OUT.mkdir(parents=True, exist_ok=True)
source = r'''
import {loadSource,solveTask} from './tests/class-8-helpers.mjs';
const {class8Chapters,evaluateTask,buildTaskEvidence}=await loadSource('export {class8Chapters} from "./app/data/class8"; export {evaluateTask} from "./app/module/cyber/lessons/class8/task-evaluation"; export {buildTaskEvidence} from "./app/module/cyber/lessons/class8/task-evidence";');
console.log(JSON.stringify(class8Chapters.map(c=>{const solutions=c.tasks.map(t=>solveTask(t,evaluateTask));return {...c,solutions,evidence:c.tasks.map((t,i)=>buildTaskEvidence(t,solutions[i]))}})));
'''
cases = json.loads(subprocess.run(["npx", "-y", "node@24", "--input-type=module", "-e", source], cwd=ROOT, check=True, text=True, capture_output=True).stdout)
cases.sort(key=lambda row: row["slug"])

def solve(board, task, answer, language="en"):
    check_name = "Check my evidence" if language == "en" else "मेरी जानकारी चेक करें"
    test_name = "Run the test" if language == "en" else "टेस्ट चलाएँ"
    kind = task["kind"]
    if kind == "choice":
        label = next(option["label"][language] for option in task["options"] if option["id"] == answer)
        board.get_by_role("button", name=label, exact=True).click()
    elif kind in ("select", "model"):
        rows = task["items"] if kind == "select" else task["examples"]
        for index, item in enumerate(rows):
            board.locator('input[type="checkbox"]').nth(index).set_checked(item["id"] in answer)
    elif kind == "match":
        for index, row in enumerate(task["rows"]):
            board.locator("select").nth(index).select_option(answer[row["id"]])
    elif kind == "number":
        for index, field in enumerate(task["fields"]):
            board.locator('input[type="number"]').nth(index).fill(answer[field["id"]])
    elif kind == "order":
        for item_id in answer:
            label = next(item["label"][language] for item in task["items"] if item["id"] == item_id)
            board.get_by_role("button", name=label, exact=True).click()
    elif kind == "binary":
        for index, bit in enumerate(answer):
            if bit == "1":
                board.get_by_role("button", name=str(2 ** (7-index)), exact=True).click()
    elif kind == "grid":
        for cell in answer:
            label = f'Row {cell // task["width"] + 1}, column {cell % task["width"] + 1}' if language == "en" else f'पंक्ति {cell // task["width"] + 1}, कॉलम {cell % task["width"] + 1}'
            board.get_by_role("button", name=label, exact=True).click()
    elif kind == "route":
        for move in answer:
            label = move.title() if language == "en" else {"up":"ऊपर", "right":"दाएँ", "down":"नीचे", "left":"बाएँ"}[move]
            board.get_by_role("button", name=label, exact=True).click()
    else:
        raise ValueError(kind)
    if kind in ("route", "model") or (kind == "match" and task.get("presentation") == "permissions"):
        expect(board.get_by_role("button", name=check_name, exact=True)).to_be_disabled()
        board.get_by_role("button", name=test_name, exact=True).click()
        if kind == "match":
            for effect in task["simulation"]:
                allowed = all(answer.get(check["rowId"]) in check["allowedAnswers"] for check in effect["checks"])
                expect(board.get_by_role("status").get_by_text(effect["allowed" if allowed else "denied"][language], exact=False)).to_be_visible()
    board.get_by_role("button", name=check_name, exact=True).click()

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, channel="chrome")
    student = browser.new_context(viewport={"width": 1440, "height": 1000}, reduced_motion="reduce")
    teacher = browser.new_context(viewport={"width": 1440, "height": 1000})
    assert teacher.request.post(BASE + "/api/auth/teacher", data={"email": "teacher@dpsrkp.edu.in", "password": "Teacher@123"}).status == 200
    roll = "QA" + str(time.time_ns())[-12:]
    issued = teacher.request.post(BASE + "/api/students", data={"className": "8B", "students": [{"rollNo": roll, "name": "Future Lab QA Learner"}]})
    assert issued.status == 201, issued.text()
    access_code = issued.json()["students"][0]["accessCode"]
    login = student.request.post(BASE + "/api/auth/student", data={"school": "dps-rkp", "className": "8B", "rollNo": roll, "password": access_code})
    assert login.status == 200, login.text()
    student_id = login.json()["student"]["id"]
    workspace = teacher.request.get(BASE + "/api/lms/assignments").json()
    class_id = next(row["id"] for row in workspace["classes"] if row["name"] == "8B")
    selected_modules = ["cyber-" + next(row["slug"] for row in cases if row["strand"] == subject) for subject in ["Cybersecurity", "Artificial Intelligence", "Computational Thinking", "Cyber Fraud"]]
    created = teacher.request.post(BASE + "/api/lms/assignments", data={"title": "Class 8 Future Lab browser verification", "instructions": "Complete the selected Future Lab chapters.", "classId": class_id, "moduleIds": selected_modules, "questions": [], "dueAt": int((time.time()+86400)*1000), "totalMarks": 100, "publish": True})
    assert created.status == 201, created.text()
    assignment_id = created.json()["assignment"]["id"]
    page = student.new_page()
    page.set_default_timeout(25000)
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.goto(BASE + "/grade/8", timeout=120000)
    expect(page.locator('a[href^="/grade/8/"]')).to_have_count(4)
    seen_kinds = set()
    seen_hindi = set()
    for index, chapter in enumerate(cases):
        slug = chapter["slug"]
        script_path = ROOT / "app/module/cyber/lessons/new/story/chapters" / (slug + ".json")
        deadline = time.monotonic() + 1800
        while True:
            script = json.loads(script_path.read_text())
            if script.get("duration", 0) > 0 and (ROOT / "public/audio/cyber" / slug / "story.mp3").exists():
                break
            if time.monotonic() > deadline:
                raise TimeoutError("Measured narration missing: " + slug)
            time.sleep(2)
        page.set_viewport_size({"width": 390 if index % 2 else 1440, "height": 1000})
        page.goto(BASE + "/module/cyber/" + slug + "?grade=8", timeout=120000)
        story = page.locator(f'[data-story-player="{slug}"]')
        expect(story).to_be_visible()
        page.wait_for_function("() => {const a=document.querySelector('audio');return a && a.readyState>=1 && Number.isFinite(a.duration) && a.duration>0}")
        duration = page.locator("audio").evaluate("a=>a.duration")
        assert abs(duration-script["duration"]) < 0.2, (slug, duration, script["duration"])
        page.get_by_role("button", name="हिन्दी", exact=True).click()
        page.wait_for_function("document.documentElement.lang==='hi'")
        expect(story.get_by_text(chapter["scenes"][0]["caption"]["hi"], exact=True)).to_be_visible()
        page.get_by_role("button", name="English", exact=True).click()
        page.wait_for_function("document.documentElement.lang==='en'")
        story.get_by_role("button", name=re.compile(r"^Scene 6:")).click()
        expect(story).to_have_attribute("data-scene", "3")
        story.locator("audio").evaluate("a=>a.pause()")
        decision = story.locator('[data-task-kind="choice"]')
        if index == 0:
            wrong = next(row["id"] for row in chapter["decision"]["options"] if row["id"] != chapter["decision"]["correct"])
            solve(decision, chapter["decision"], wrong)
            expect(story).to_have_attribute("data-solved", "false")
        solve(decision, chapter["decision"], chapter["decision"]["correct"])
        expect(story).to_have_attribute("data-solved", "true")
        story.get_by_role("button", name=re.compile(r"^Scene 6:")).click()
        story.get_by_role("button", name="Open the practice lab", exact=True).click()
        for task_index, task in enumerate(chapter["tasks"]):
            seen_kinds.add(task["kind"])
            practice = page.locator(f'[data-new-mission="{slug}"]')
            expect(practice).to_have_attribute("data-stage", str(task_index))
            board = practice.locator('[data-task-kind]')
            hindi = task["kind"] not in seen_hindi
            if hindi:
                page.get_by_role("button", name="हिन्दी", exact=True).click()
                page.wait_for_function("document.documentElement.lang==='hi'")
            solve(board, task, chapter["solutions"][task_index], "hi" if hindi else "en")
            expect(practice).to_have_attribute("data-ready", "true")
            if hindi:
                expect(practice.locator('[data-result="correct"]')).to_contain_text(task["success"]["hi"])
                seen_hindi.add(task["kind"])
                page.get_by_role("button", name="English", exact=True).click()
                page.wait_for_function("document.documentElement.lang==='en'")
                expect(practice).to_have_attribute("data-ready", "true")
            if index == 0 and task_index == 0:
                page.reload()
                practice = page.locator(f'[data-new-mission="{slug}"]')
                # A correct first response survives reload; retrying cannot replace it.
                expect(practice).to_have_attribute("data-stage", "0")
                solve(practice.locator('[data-task-kind]'), task, chapter["solutions"][task_index])
                expect(practice).to_have_attribute("data-ready", "true")
            assert page.evaluate("document.documentElement.scrollWidth <= innerWidth"), slug + ": practice overflow"
            if index < 4 and task_index == 1:
                page.screenshot(path=str(OUT / f'{slug}-practice.png'), full_page=True)
            practice.get_by_role("button", name="Review mission" if task_index == 2 else "Next challenge", exact=True).click()
        ready = page.locator(f'[data-mission-ready="{slug}"]')
        expect(ready).to_be_visible()
        for task_index, lines in enumerate(chapter["evidence"]):
            notebook = ready.locator(f'[data-class8-evidence="{task_index}"]')
            for line in lines:
                expect(notebook).to_contain_text(line["value"]["en"])
        if index == 0:
            page.get_by_role("button", name="हिन्दी", exact=True).click()
            page.wait_for_function("document.documentElement.lang==='hi'")
            for task_index, lines in enumerate(chapter["evidence"]):
                for line in lines:
                    expect(ready.locator(f'[data-class8-evidence="{task_index}"]')).to_contain_text(line["value"]["hi"])
            page.reload()
            ready = page.locator(f'[data-mission-ready="{slug}"]')
            expect(ready).to_be_visible()
            for task_index, lines in enumerate(chapter["evidence"]):
                for line in lines:
                    expect(ready.locator(f'[data-class8-evidence="{task_index}"]')).to_contain_text(line["value"]["hi"])
            page.get_by_role("button", name="English", exact=True).click()
            page.wait_for_function("document.documentElement.lang==='en'")
            ready.get_by_label("Explain it in your own words", exact=True).fill("I checked the stated purpose, tested the plan and used evidence to explain the result.")
            ready.get_by_role("button", name="Save reflection", exact=True).click()
            expect(ready.get_by_role("button", name="Reflection saved", exact=True)).to_be_disabled()
        ready.get_by_role("button", name="Finish chapter", exact=True).click()
        expect(page.locator(f'[data-mission-complete="{slug}"]')).to_be_visible()
        print(f'PASS {index+1}/32 {slug}: story gate, English audio, Hindi text, three tasks, completion', flush=True)
    assert seen_kinds == {"choice", "select", "match", "order", "number", "binary", "grid", "route", "model"}, seen_kinds
    assert seen_hindi == seen_kinds, seen_hindi
    deadline = time.monotonic()+45
    while True:
        progress = student.request.get(BASE + "/api/lms/progress").json()
        complete = [row for row in progress["attempts"] if row["moduleId"].startswith("cyber-class8-") and row["completedAt"] is not None]
        if len(complete) == 32 or time.monotonic()>deadline:
            break
        time.sleep(1)
    assert len(complete) == 32, len(complete)
    assert all(row["score"] == 100 for row in complete), [(row["moduleId"],row["score"]) for row in complete]
    assert any(json.loads(row["payload"]).get("reflection") for row in progress["events"]), "Reflection not persisted"
    report = teacher.request.get(BASE + f"/api/lms/assignments/{assignment_id}").json()
    learner = next(row for row in report["students"] if row["id"] == student_id)
    assert learner["progress"]["marks"] == 100, learner["progress"]
    teacher_history = teacher.request.get(BASE + f"/api/lms/students/{student_id}").json()
    teacher_evidence = [json.loads(row["payload"]) for row in teacher_history["events"] if row["type"] == "story_feedback" and json.loads(row["payload"]).get("evidence")]
    for chapter in cases:
        for task_index, task in enumerate(chapter["tasks"]):
            parts = [row for row in teacher_evidence if row.get("question") == task["prompt"]["en"][:300] and row.get("category") == chapter["topics"][task_index]["en"][:150]]
            assert parts, (chapter["slug"], task_index, "Teacher evidence missing")
            # A reload can repeat an already checked response. Compare one complete snapshot.
            part_count = parts[0]["evidenceParts"]
            snapshot = "".join(next(row["feedback"] for row in parts if row["evidencePart"] == part) for part in range(1, part_count+1))
            for line in chapter["evidence"][task_index]:
                assert line["value"]["en"] in snapshot and line["value"]["hi"] in snapshot, (chapter["slug"], task_index, line)
    # A new attempt keeps its wrong first answer even after a successful retry.
    chapter = next(row for row in cases if row["slug"] == "class8-account-control")
    slug = chapter["slug"]
    page.goto(BASE + "/module/cyber/" + slug + "?grade=8")
    # Wait for stored-state restoration before interacting with the frame controls.
    expect(page.locator(f'[data-mission-complete="{slug}"]')).to_be_visible()
    page.get_by_role("button", name="Start over", exact=True).click()
    story = page.locator(f'[data-story-player="{slug}"]')
    expect(story).to_be_visible()
    story.get_by_role("button", name="Skip to practice", exact=True).click()
    practice = page.locator(f'[data-new-mission="{slug}"]')
    first_task = chapter["tasks"][0]
    assert first_task["kind"] == "select"
    wrong_answer = [item["id"] for item in first_task["items"] if item["id"] not in chapter["solutions"][0]]
    assert wrong_answer
    solve(practice.locator('[data-task-kind]'), first_task, wrong_answer)
    expect(practice).to_have_attribute("data-ready", "false")
    expect(practice.locator('[data-result="retry"]')).to_be_visible()
    for task_index, task in enumerate(chapter["tasks"]):
        solve(practice.locator('[data-task-kind]'), task, chapter["solutions"][task_index])
        expect(practice).to_have_attribute("data-ready", "true")
        practice.get_by_role("button", name="Review mission" if task_index == 2 else "Next challenge", exact=True).click()
    page.locator(f'[data-mission-ready="{slug}"]').get_by_role("button", name="Finish chapter", exact=True).click()
    deadline = time.monotonic()+45
    while True:
        retried = student.request.get(BASE + "/api/lms/progress").json()
        attempts = sorted([row for row in retried["attempts"] if row["moduleId"] == "cyber-"+slug and row["completedAt"] is not None], key=lambda row: row["startedAt"])
        if len(attempts) == 2 or time.monotonic()>deadline:
            break
        time.sleep(1)
    assert len(attempts) == 2, attempts
    assert attempts[0]["score"] == 100 and abs(attempts[1]["score"] - 200/3) < 0.01, attempts
    responses = [json.loads(row["payload"]) for row in retried["events"] if row["attemptId"] == attempts[1]["id"] and row["type"] == "question_answered" and json.loads(row["payload"]).get("id") == slug+"-challenge-1"]
    assert any(row["correct"] is False for row in responses) and any(row["correct"] is True and row.get("retry") for row in responses), responses
    retry_report = teacher.request.get(BASE + f"/api/lms/assignments/{assignment_id}").json()
    retry_learner = next(row for row in retry_report["students"] if row["id"] == student_id)
    assert abs(retry_learner["progress"]["marks"] - 91.67) < 0.01, retry_learner["progress"]
    assert student.request.get(BASE + "/module/cyber/flowchart-architect?grade=8").status == 404
    assert student.request.get(BASE + "/module/cyber/your-digital-risk-map?grade=8").status == 404
    assert student.request.get(BASE + "/grade/11").status == 404
    page.goto(BASE + "/learn/progress")
    expect(page.get_by_role("heading", name="Sections to focus on", exact=True)).to_be_visible()
    page.get_by_role("button", name="हिन्दी", exact=True).click()
    page.wait_for_function("document.documentElement.lang==='hi'")
    page.reload()
    page.wait_for_function("document.documentElement.lang==='hi'")
    assert page.evaluate("document.documentElement.scrollWidth <= innerWidth"), "Hindi report overflow"
    page.screenshot(path=str(OUT / "progress-hindi-mobile.png"), full_page=True)
    page.screenshot(path=str(OUT / "progress-hindi-mobile-viewport.png"))
    assert not errors, errors
    print("PASS all 32 chapters / 96 practice tasks / 9 mechanics in English and Hindi; measured audio, bilingual notebook reload, actual teacher evidence, saved reflection, wrong-first retry grading, assignment marks and grade restrictions", flush=True)
    browser.close()
