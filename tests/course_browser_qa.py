"""Shared authenticated Class 8 / Class 9 browser regression on disposable localhost.

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

GRADE = int(os.environ.get("COURSE_QA_GRADE", "8"))
assert GRADE in (6, 7, 8, 9, 10)
ROOT = Path(__file__).resolve().parent.parent
BASE = os.environ.get("BASE_URL", "http://localhost:3218")
if not re.match(r"^http://(localhost|127\.0\.0\.1):\d+$", BASE):
    raise ValueError("Use a disposable localhost server for this data-creating check")
OUT = ROOT / f".lms-qa/class{GRADE}"
OUT.mkdir(parents=True, exist_ok=True)
def load_cases():
    source = r'''
import {loadSource,solveTask,wrongAnswers} from './tests/class-9-helpers.mjs';
const grade=Number(process.env.COURSE_QA_GRADE??8);
const {chapters,evaluateTask,buildTaskEvidence,diagnoseTask}=await loadSource(`export {class${grade}Chapters as chapters} from "./app/data/class${grade}"; export {evaluateTask} from "./app/module/cyber/lessons/class8/task-evaluation"; export {buildTaskEvidence} from "./app/module/cyber/lessons/class8/task-evidence"; export {diagnoseTask} from "./app/module/cyber/lessons/class8/task-feedback";`);
console.log(JSON.stringify(chapters.map(c=>{const solutions=c.tasks.map(t=>solveTask(t,evaluateTask));const wrongs=c.tasks.map(t=>wrongAnswers(t,evaluateTask,diagnoseTask));return {...c,solutions,wrongs,wrongDiagnoses:c.tasks.map((t,i)=>wrongs[i].map(a=>diagnoseTask(t,a))),storyWrongs:wrongAnswers(c.decision,evaluateTask,diagnoseTask).map(answer=>({answer,diagnosis:diagnoseTask(c.decision,answer)})),evidence:c.tasks.map((t,i)=>buildTaskEvidence(t,solutions[i]))}})));
'''
    command = [os.environ["NODE24"], "--input-type=module", "-e", source] if os.environ.get("NODE24") else ["npx", "-y", "node@24", "--input-type=module", "-e", source]
    rows = json.loads(subprocess.run(command, cwd=ROOT, check=True, text=True, capture_output=True, env={**os.environ,"COURSE_QA_GRADE":str(GRADE)}).stdout)
    assert len(rows) == 32 and sum(len(c["tasks"]) for c in rows) == 96
    return sorted(rows, key=lambda row: row["slug"])

cases = load_cases()
expected_kinds = {task["kind"] for chapter in cases for task in chapter["tasks"]} if GRADE == 6 else {"choice", "select", "match", "order", "number", "binary", "grid", "route", "model"}

def label(language, en, hi):
    return en if language == "en" else hi

def set_language(page, language):
    page.get_by_role("button", name=label(language,"English","हिन्दी"), exact=True).click()
    page.wait_for_function("language => document.documentElement.lang === language", arg=language)

def fillAnswer(board, task, answer, language="en"):
    """Replace controls exactly, including previously checked wrong submissions."""
    kind = task["kind"]
    if kind == "choice":
        value = next(option["label"][language] for option in task["options"] if option["id"] == answer)
        board.get_by_role("button", name=value, exact=True).click()
    elif kind in ("select", "model"):
        rows = task["items"] if kind == "select" else task["examples"]
        # Rebuild click order as well as membership: evidence records the actual
        # learner selection order, which must match this submitted answer.
        for index in range(len(rows)):
            board.locator('input[type="checkbox"]').nth(index).set_checked(False)
        for item_id in answer:
            index = next(index for index, item in enumerate(rows) if item["id"] == item_id)
            board.locator('input[type="checkbox"]').nth(index).set_checked(True)
    elif kind == "match":
        for index, row in enumerate(task["rows"]):
            board.locator("select").nth(index).select_option(answer.get(row["id"],""))
    elif kind == "number":
        for index, field in enumerate(task["fields"]):
            board.locator('input[type="number"]').nth(index).fill(str(answer.get(field["id"],"")))
    elif kind in ("order", "route"):
        undo = board.get_by_role("button", name=label(language,"Undo last step","पिछला कदम हटाएँ"), exact=True)
        while undo.is_enabled():
            undo.click()
        for item_id in answer:
            value = next(item["label"][language] for item in task["items"] if item["id"] == item_id) if kind == "order" else label(language,item_id.title(),{"up":"ऊपर","right":"दाएँ","down":"नीचे","left":"बाएँ"}[item_id])
            board.get_by_role("button", name=value, exact=True).click()
    elif kind == "binary":
        for index, bit in enumerate(answer):
            button = board.get_by_role("button", name=str(2 ** (7-index)), exact=True)
            if (button.get_attribute("aria-pressed") == "true") != (bit == "1"):
                button.click()
    elif kind == "grid":
        cells = {}
        for cell in range(task["width"]*task["height"]):
            if cell in task.get("blocked",[]):
                continue
            value = label(language,f'Row {cell//task["width"]+1}, column {cell%task["width"]+1}',f'पंक्ति {cell//task["width"]+1}, कॉलम {cell%task["width"]+1}')
            button = board.get_by_role("button", name=value, exact=True)
            cells[cell] = button
            if button.get_attribute("aria-pressed") == "true":
                button.click()
        for cell in answer:
            cells[cell].click()
    else:
        raise ValueError(kind)

def needs_test(task):
    return task["kind"] in ("route","model") or (task["kind"] == "match" and task.get("presentation") == "permissions")

def checkAnswer(board, task, answer, language="en", require_untested=True):
    check = board.get_by_role("button",name=label(language,"Check my evidence","मेरी जानकारी चेक करें"),exact=True)
    if needs_test(task):
        if require_untested:
            expect(check).to_be_disabled()
        board.get_by_role("button",name=label(language,"Run the test","टेस्ट चलाएँ"),exact=True).click()
        expect(check).to_be_enabled()
        if task["kind"] == "match":
            for effect in task["simulation"]:
                allowed = all(answer.get(row["rowId"]) in row["allowedAnswers"] for row in effect["checks"])
                expect(board.get_by_role("status").get_by_text(effect["allowed" if allowed else "denied"][language],exact=False)).to_be_visible()
    check.click()

def solve(board, task, answer, language="en", require_untested=True):
    fillAnswer(board,task,answer,language)
    checkAnswer(board,task,answer,language,require_untested)

def assert_diagnosis(scope, diagnosis, language="en"):
    panel = scope.locator('[data-task-feedback][data-result="retry"]')
    expect(panel).to_be_visible()
    expect(panel).to_have_attribute("translate","no")
    expect(panel).to_contain_text(diagnosis["summary"][language])
    expect(panel).to_contain_text(diagnosis["submitted"][language])
    assert diagnosis["issues"], diagnosis
    for issue in diagnosis["issues"]:
        expect(panel).to_contain_text(issue["label"][language])
        expect(panel).to_contain_text(issue["reason"][language])
    expect(panel).to_contain_text(diagnosis["next"][language])
    assert scope.page.evaluate("document.documentElement.scrollWidth <= innerWidth"), f"{language} feedback overflow"

def wrong_then_edit(scope, board, task, wrong, diagnosis, replacement, language):
    solve(board,task,wrong,language)
    assert_diagnosis(scope,diagnosis,language)
    fillAnswer(board,task,replacement,language)
    expect(scope.locator('[data-task-feedback]')).to_have_count(0)
    if needs_test(task):
        expect(board.get_by_role("button",name=label(language,"Check my evidence","मेरी जानकारी चेक करें"),exact=True)).to_be_disabled()

def scored_event_ids(page, events):
    queued = page.evaluate("""() => Object.keys(localStorage).filter(key=>key.startsWith('cyber-activity-')&&!key.endsWith('-attempt')).flatMap(key=>{try{return JSON.parse(localStorage.getItem(key))??[]}catch{return []}})""")
    return {event["eventId"] for event in [*events,*queued] if event.get("type") in ("question_answered","story_answered")}

def blank_check(scope, board, task, events):
    # Binary lamps have an intentional eight-bit default; models have authored training.
    if task["kind"] in ("binary","model"):
        return
    before = scored_event_ids(scope.page,events)
    checkAnswer(board,task,{},require_untested=True)
    expect(scope.locator('[data-task-feedback][data-result="incomplete"]')).to_be_visible()
    after = scored_event_ids(scope.page,events)
    assert before == after, "Blank submission emitted a scored answer"

def preview_negatives(teacher, browser, errors):
    """Teacher preview isolates exhaustive wrong practice work from learner marks."""
    preview = teacher.new_page()
    preview.on("pageerror", lambda error: errors.append(str(error)))
    covered = set()
    count = 0
    for chapter in cases:
        targets = [i for i,t in enumerate(chapter["tasks"]) if t["kind"] == "choice" or t["kind"] not in covered]
        if not targets:
            continue
        slug = chapter["slug"]
        preview.goto(BASE+f"/module/cyber/{slug}?role=teacher&grade={GRADE}",timeout=120000)
        preview.get_by_role("button",name="Skip to practice",exact=True).click()
        for i, task in enumerate(chapter["tasks"]):
            practice = preview.locator(f'[data-new-mission="{slug}"]')
            expect(practice).to_have_attribute("data-stage",str(i))
            board = practice.locator('[data-task-kind]')
            if i in targets:
                for language in ("en","hi"):
                    set_language(preview,language)
                    for wrong, diagnosis in zip(chapter["wrongs"][i],chapter["wrongDiagnoses"][i]):
                        wrong_then_edit(practice,board,task,wrong,diagnosis,chapter["solutions"][i],language)
                        count += 1
                covered.add(task["kind"])
            set_language(preview,"en")
            # Prior stages are completed so later single-choice tasks are actually reached.
            solve(board,task,chapter["solutions"][i])
            expect(practice).to_have_attribute("data-ready","true")
            practice.get_by_role("button",name="Review mission" if i==2 else "Next challenge",exact=True).click()
        preview.locator(f'[data-mission-ready="{slug}"]').get_by_role("button",name="Finish chapter",exact=True).click()
    assert covered == expected_kinds, covered
    print(f"PASS authenticated teacher preview: {count} wrong submissions, all single-choice alternatives, all mechanics in EN/HI",flush=True)
    preview.close()

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel="chrome")
        student = browser.new_context(viewport={"width": 1440, "height": 1000}, reduced_motion="reduce")
        teacher = browser.new_context(viewport={"width": 1440, "height": 1000})
        assert teacher.request.post(BASE + "/api/auth/teacher", data={"email": "teacher@dpsrkp.edu.in", "password": "Teacher@123"}).status == 200
        if GRADE != 8:
            classes_response = teacher.request.get(BASE + "/api/admin/classes")
            assert classes_response.status == 200, classes_response.text()
            existing = next((row for row in classes_response.json()["classes"] if row["grade"] == GRADE),None)
            if existing:
                class_name = existing["name"]
            else:
                added = teacher.request.post(BASE + "/api/admin/classes",data={"grade":GRADE,"section":"QA","name":f"{GRADE}QA"})
                assert added.status == 201, added.text()
                class_name = added.json()["class"]["name"]
        else:
            class_name = "8B"
        roll = "QA" + str(time.time_ns())[-12:]
        issued = teacher.request.post(BASE + "/api/students", data={"className": class_name, "students": [{"rollNo": roll, "name": "Future Lab QA Learner"}]})
        assert issued.status == 201, issued.text()
        access_code = issued.json()["students"][0]["accessCode"]
        login = student.request.post(BASE + "/api/auth/student", data={"school": "dps-rkp", "className": class_name, "rollNo": roll, "password": access_code})
        assert login.status == 200, login.text()
        student_id = login.json()["student"]["id"]
        workspace = teacher.request.get(BASE + "/api/lms/assignments").json()
        class_id = next(row["id"] for row in workspace["classes"] if row["name"] == class_name)
        selected_modules = ["cyber-" + next(row["slug"] for row in cases if row["strand"] == subject) for subject in ["Cybersecurity", "Artificial Intelligence", "Computational Thinking", "Cyber Fraud"]]
        created = teacher.request.post(BASE + "/api/lms/assignments", data={"title": f"Class {GRADE} browser verification", "instructions": "Complete the selected Future Lab chapters.", "classId": class_id, "moduleIds": selected_modules, "questions": [], "dueAt": int((time.time()+86400)*1000), "totalMarks": 100, "publish": True})
        assert created.status == 201, created.text()
        assignment_id = created.json()["assignment"]["id"]
        page = student.new_page()
        page.set_default_timeout(25000)
        errors = []
        page.on("pageerror", lambda error: errors.append(str(error)))
        page.goto(BASE + f"/grade/{GRADE}", timeout=120000)
        expect(page.locator(f'a[href^="/grade/{GRADE}/"]')).to_have_count(6 if GRADE == 10 else 4)
        activity_events = []
        def capture_activity(request):
            if request.url.endswith("/api/activity") and request.method == "POST":
                body = request.post_data_json
                activity_events.extend(body.get("events",[body]))
        page.on("request",capture_activity)
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
            page.goto(BASE + "/module/cyber/" + slug + f"?grade={GRADE}", timeout=120000)
            story = page.locator(f'[data-story-player="{slug}"]')
            expect(story).to_be_visible()
            if GRADE == 10:
                portraits = story.locator('[data-class10-characters]')
                expect(portraits).to_be_visible()
                expect(portraits).to_contain_text("Aditi")
                expect(portraits).to_contain_text("Vihaan")
            elif GRADE == 9:
                portraits = story.locator('svg[role="img"]').filter(has_text="Reva")
                expect(portraits).to_have_count(1)
                expect(portraits).to_contain_text("Nikhil")
                assert portraits.locator("path").count() >= 8
            assert page.evaluate("document.documentElement.scrollWidth <= innerWidth"), slug + ": story overflow"
            page.wait_for_function("() => {const a=document.querySelector('audio');return a && a.readyState>=1 && Number.isFinite(a.duration) && a.duration>0}")
            duration = page.locator("audio").evaluate("a=>a.duration")
            assert abs(duration-script["duration"]) < 0.2, (slug, duration, script["duration"])
            page.get_by_role("button", name="हिन्दी", exact=True).click()
            page.wait_for_function("document.documentElement.lang==='hi'")
            expect(story.locator('p[aria-live="polite"]').filter(has_text=re.compile('^'+re.escape(chapter["scenes"][0]["caption"]["hi"])+ '$'))).to_be_visible()
            page.get_by_role("button", name="English", exact=True).click()
            page.wait_for_function("document.documentElement.lang==='en'")
            story.get_by_role("button", name=re.compile(r"^Scene 6:")).click()
            expect(story).to_have_attribute("data-scene", "3")
            story.locator("audio").evaluate("a=>a.pause()")
            decision = story.locator('[data-task-kind="choice"]')
            blank_check(story,decision,chapter["decision"],activity_events)
            if GRADE != 8:
                for language in ("en","hi"):
                    set_language(page,language)
                    for item in chapter["storyWrongs"]:
                        wrong_then_edit(story,decision,chapter["decision"],item["answer"],item["diagnosis"],chapter["decision"]["correct"],language)
                        expect(story).to_have_attribute("data-solved","false")
                set_language(page,"en")
                # Keyboard selection and checking are real button interactions.
                decision.get_by_role("button",name=next(o["label"]["en"] for o in chapter["decision"]["options"] if o["id"] == chapter["decision"]["correct"]),exact=True).focus()
                page.keyboard.press("Enter")
            elif index == 0:
                solve(decision,chapter["decision"],chapter["storyWrongs"][0]["answer"])
                expect(story).to_have_attribute("data-solved","false")
            solve(decision, chapter["decision"], chapter["decision"]["correct"])
            expect(story).to_have_attribute("data-solved", "true")
            if GRADE != 8:
                set_language(page,"hi")
                for scene_index, scene in enumerate(chapter["scenes"]):
                    story.locator("nav button").nth(scene_index).click()
                    expect(story).to_have_attribute("data-scene",str(scene_index))
                    story.locator("audio").evaluate("a=>a.pause()")
                    expect(story.locator('p[aria-live="polite"]').filter(has_text=re.compile('^'+re.escape(scene["caption"]["hi"])+ '$'))).to_be_visible()
                    assert page.evaluate("document.documentElement.scrollWidth <= innerWidth"), slug + ": Hindi story overflow"
                set_language(page,"en")
            story.get_by_role("button", name=re.compile(r"^Scene 6:")).click()
            story.get_by_role("button", name="Open the practice lab", exact=True).click()
            for task_index, task in enumerate(chapter["tasks"]):
                seen_kinds.add(task["kind"])
                practice = page.locator(f'[data-new-mission="{slug}"]')
                expect(practice).to_have_attribute("data-stage", str(task_index))
                board = practice.locator('[data-task-kind]')
                if GRADE != 8:
                    blank_check(practice,board,task,activity_events)
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
                    solve(practice.locator('[data-task-kind]'), task, chapter["solutions"][task_index], require_untested=False)
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
            if index == 0 or GRADE != 8:
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
        if GRADE != 8:
            preview_negatives(teacher,browser,errors)
        assert seen_kinds == expected_kinds, seen_kinds
        assert seen_hindi == seen_kinds, seen_hindi
        deadline = time.monotonic()+45
        while True:
            progress = student.request.get(BASE + "/api/lms/progress").json()
            complete = [row for row in progress["attempts"] if row["moduleId"].startswith(f"cyber-class{GRADE}-") and row["completedAt"] is not None]
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
        teacher_evidence = [{**json.loads(row["payload"]),"_attemptId":row["attemptId"],"_moduleId":next(a["moduleId"] for a in teacher_history["attempts"] if a["id"]==row["attemptId"])} for row in teacher_history["events"] if row["type"] == "story_feedback" and json.loads(row["payload"]).get("evidence")]
        for chapter in cases:
            for task_index, task in enumerate(chapter["tasks"]):
                parts = [row for row in teacher_evidence if row["_moduleId"] == "cyber-"+chapter["slug"] and row["_attemptId"] == next(a["id"] for a in complete if a["moduleId"] == "cyber-"+chapter["slug"]) and row.get("question") == task["prompt"]["en"][:300] and row.get("category") == chapter["topics"][task_index]["en"][:150]]
                assert parts, (chapter["slug"], task_index, "Teacher evidence missing")
                # A reload can repeat an already checked response. Compare one complete snapshot.
                part_count = parts[0]["evidenceParts"]
                snapshot = "".join(next(row["feedback"] for row in parts if row["evidencePart"] == part) for part in range(1, part_count+1))
                for line in chapter["evidence"][task_index]:
                    assert line["value"]["en"] in snapshot and line["value"]["hi"] in snapshot, (chapter["slug"], task_index, line)
        # A new attempt keeps its wrong first answer even after a successful retry.
        chapter = next(row for row in cases if "cyber-"+row["slug"] in selected_modules) if GRADE != 8 else next(row for row in cases if row["slug"] == "class8-account-control")
        slug = chapter["slug"]
        page.goto(BASE + "/module/cyber/" + slug + f"?grade={GRADE}")
        # Wait for stored-state restoration before interacting with the frame controls.
        expect(page.locator(f'[data-mission-complete="{slug}"]')).to_be_visible()
        page.get_by_role("button", name="Start over", exact=True).click()
        story = page.locator(f'[data-story-player="{slug}"]')
        expect(story).to_be_visible()
        story.get_by_role("button", name="Skip to practice", exact=True).click()
        practice = page.locator(f'[data-new-mission="{slug}"]')
        first_task = chapter["tasks"][0]
        wrong_answer = chapter["wrongs"][0][0]
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
        retry_history = teacher.request.get(BASE+f"/api/lms/students/{student_id}").json()
        wrong_parts = [json.loads(row["payload"]) for row in retry_history["events"] if row["attemptId"] == attempts[1]["id"] and row["type"] == "story_feedback" and json.loads(row["payload"]).get("evidence") and json.loads(row["payload"]).get("correct") is False and json.loads(row["payload"]).get("question") == first_task["prompt"]["en"][:300]]
        assert wrong_parts, "Teacher history lost the wrong first submission"
        wrong_snapshot = "".join(next(part["feedback"] for part in wrong_parts if part["evidencePart"] == i) for i in range(1,wrong_parts[0]["evidenceParts"]+1))
        for language in ("en","hi"):
            for issue in chapter["wrongDiagnoses"][0][0]["issues"]:
                assert issue["label"][language] in wrong_snapshot and issue["reason"][language] in wrong_snapshot, issue
        retry_report = teacher.request.get(BASE + f"/api/lms/assignments/{assignment_id}").json()
        retry_learner = next(row for row in retry_report["students"] if row["id"] == student_id)
        assert abs(retry_learner["progress"]["marks"] - 91.67) < 0.01, retry_learner["progress"]
        forbidden_modules = [("flowchart-architect","cyber-middle-ct-flowchart-architect"),("your-digital-risk-map","cyber-class-11-your-digital-risk-map")]
        if GRADE != 8:
            forbidden_modules += [("email-header-inspector","cyber-upper-security-email-header-inspector"),("class8-account-control","cyber-class8-account-control")]
        if GRADE == 10:
            forbidden_modules += [(cases9_slug, "cyber-"+cases9_slug) for cases9_slug in ["class9-ai-measurable-question"]]
        for forbidden, module_id in forbidden_modules:
            assert student.request.get(BASE + f"/module/cyber/{forbidden}?grade={GRADE}").status in (403,404)
            activity = student.request.post(BASE + "/api/activity",data={"moduleId":module_id,"type":"question_answered","payload":{"id":"denied","correct":True}})
            assert activity.status in (403,404), (module_id,activity.status,activity.text())
            completion = student.request.post(BASE + "/api/module-runs",data={"moduleId":module_id})
            assert completion.status in (403,404), (module_id,completion.status,completion.text())
        if GRADE == 10:
            for path in ("/grade/10/mathematics", "/grade/10/english"):
                assert student.request.get(BASE + path).status == 200, path
                page.goto(BASE+path)
                expect(page.locator('section[aria-labelledby="chapter-library-title"] .moduleNameCard')).to_have_count(14 if path.endswith('mathematics') else 9)
        for restricted_grade in ([8,9,11,12] if GRADE == 10 else [8,10,11,12] if GRADE == 9 else [7,8,9,10,11,12] if GRADE == 6 else [6,8,9,10,11,12] if GRADE == 7 else [11]):
            assert student.request.get(BASE + f"/grade/{restricted_grade}").status in (403,404)
        if GRADE != 8:
            assert student.request.get(BASE + "/module/cyber/class8-account-control?grade=8").status in (403,404)
        page.set_viewport_size({"width":390,"height":1000})
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
        print("PASS all 32 chapters / 96 practice tasks / all authored mechanics in English and Hindi; measured audio, bilingual notebook reload, actual teacher evidence, saved reflection, wrong-first retry grading, assignment marks and grade restrictions", flush=True)
        browser.close()
