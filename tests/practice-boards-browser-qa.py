"""Interactive practice boards (Classes 6-10) against disposable localhost only.
BASE_URL=http://localhost:3218 MODE=drag python3 tests/practice-boards-browser-qa.py

MODE=drag moves cards with a real mouse; MODE=tap uses the tap-then-tap fallback (also the keyboard path).
For each class it plays whole chapters until every board kind has been exercised: a wrong answer first
(the board must show which cards are wrong and stay put), then the right answer through all three challenges.
"""
import json
import os
from pathlib import Path
import re
import subprocess
from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parent.parent
BASE = os.environ.get('BASE_URL', 'http://localhost:3218')
MODE = os.environ.get('MODE', 'drag')
assert re.fullmatch(r'http://(localhost|127\.0\.0\.1):\d+', BASE)
assert MODE in ('drag', 'tap')
source = '''
import {loadSource,solveTask,wrongAnswers} from './tests/class-9-helpers.mjs';
const m=await loadSource(`import {class6Chapters} from './app/data/class6';import {class7Chapters} from './app/data/class7';import {class8Chapters} from './app/data/class8';import {class9Chapters} from './app/data/class9';import {class10Chapters} from './app/data/class10';export const grades=[class6Chapters,class7Chapters,class8Chapters,class9Chapters,class10Chapters];export {evaluateTask} from './app/module/cyber/lessons/class8/task-evaluation';export {diagnoseTask} from './app/module/cyber/lessons/class8/task-feedback';`);
const KINDS=['select','match','order','choice','number'];
const out=[];
m.grades.forEach((chapters,i)=>{
  const seen=new Set();
  for(const c of chapters){
    const fresh=c.tasks.some(t=>KINDS.includes(t.kind)&&!seen.has(t.kind));
    if(!fresh) continue;
    c.tasks.forEach(t=>seen.add(t.kind));
    out.push({grade:i+6,slug:c.slug,tasks:c.tasks.map(t=>({task:t,solution:solveTask(t,m.evaluateTask),wrong:wrongAnswers(t,m.evaluateTask,m.diagnoseTask)[0]??null}))});
  }
});
console.log(JSON.stringify(out));
'''
node = [os.environ['NODE24']] if os.environ.get('NODE24') else ['npx', '-y', 'node@24']
cases = json.loads(subprocess.check_output(node + ['--input-type=module', '-e', source], cwd=ROOT, text=True))
expect.set_options(timeout=30000)
L = lambda row: row['label']['en']


def drag(page, source, target):
    """A real mouse drag, in small steps so the pointer handlers see a genuine gesture."""
    source.scroll_into_view_if_needed()
    a = source.bounding_box()
    sx, sy = a['x'] + a['width'] * .5, a['y'] + a['height'] * .5
    source.page.mouse.move(sx, sy)
    page.mouse.down()
    page.mouse.move(sx + 12, sy + 12, steps=3)
    # Like a person: if the target is off screen, hold the card at the screen edge until the page scrolls to it.
    height = page.viewport_size['height']
    for _ in range(80):
        t = target.bounding_box()
        middle = t['y'] + t['height'] * .5
        if 90 < middle < height - 90:
            break
        page.mouse.move(sx, height - 16 if middle >= height - 90 else 16, steps=3)
        page.wait_for_timeout(50)
    # Aim, let any scrolling settle, and re-aim: the target moves while the page is still scrolling.
    for _ in range(3):
        t = target.bounding_box()
        page.mouse.move(t['x'] + t['width'] * .5, t['y'] + t['height'] * .5, steps=10)
        page.wait_for_timeout(90)
    page.mouse.up()


def fill(page, board, task, answer):
    kind = task['kind']
    print(f'    fill {kind}: {json.dumps(answer)[:140]}', flush=True) if os.environ.get('VERBOSE') else None
    bank = board.locator('[data-drop-zone="bank"]')
    if kind == 'choice':
        board.get_by_role('button', name=L(next(o for o in task['options'] if o['id'] == answer)), exact=True).click()
    elif kind == 'select' and task.get('presentation') == 'redact':
        # The one redaction board keeps its checkbox list.
        for i, item in enumerate(task['items']):
            board.locator('input[type=checkbox]').nth(i).set_checked(item['id'] in answer)
    elif kind == 'select':
        for item_id in answer:
            card = bank.get_by_role('button', name=L(next(i for i in task['items'] if i['id'] == item_id)), exact=True)
            if MODE == 'drag':
                drag(page, card, board.locator('[data-drop-zone="tray"]'))
            else:
                card.click()
    elif kind == 'match':
        for row in task['rows']:
            chip = bank.get_by_role('button', name=L(next(o for o in task['options'] if o['id'] == answer[row['id']])), exact=True)
            slot = board.locator(f'[data-drop-zone="row:{row["id"]}"]')
            if MODE == 'drag':
                drag(page, chip, slot)
            else:
                chip.click()
                slot.click()
    elif kind == 'order':
        for index, item_id in enumerate(answer):
            card = bank.get_by_role('button', name=L(next(i for i in task['items'] if i['id'] == item_id)), exact=True)
            if MODE == 'drag':
                drag(page, card, board.locator(f'[data-drop-zone="slot:{index}"]'))
            else:
                card.click()
    elif kind == 'number':
        for i, field in enumerate(task['fields']):
            board.locator('input[type=number]').nth(i).fill(str(answer[field['id']]))
    elif kind in ('model',):
        for i, row in enumerate(task['examples']):
            board.locator('input[type=checkbox]').nth(i).set_checked(row['id'] in answer)
    elif kind == 'binary':
        for i, value in enumerate(answer):
            if value == '1':
                board.get_by_role('button', name=str(2 ** (7 - i)), exact=True).click()
    elif kind == 'grid':
        for cell in answer:
            board.get_by_role('button', name=f'Row {cell // task["width"] + 1}, column {cell % task["width"] + 1}', exact=True).click()
    elif kind == 'route':
        for value in answer:
            board.get_by_role('button', name=value.title(), exact=True).click()
    test = board.get_by_role('button', name='Run the test', exact=True)
    if test.count():
        test.click()


def clear(board, kind):
    """Empty a board through its own controls (choice and number just get overwritten)."""
    if kind == 'select':
        tray = board.locator('[data-drop-zone="tray"]')
        while tray.get_by_role('button').count():
            tray.get_by_role('button').first.click()
    elif kind == 'match':
        remove = board.locator('[data-remove]')
        while remove.count():
            remove.first.click()
    elif kind == 'order':
        remove = board.locator('[data-remove]')
        while remove.count():
            remove.first.click()


def no_overflow(page, board):
    wide = page.evaluate('document.documentElement.scrollWidth > innerWidth ? [...document.querySelectorAll("body *")].filter(e => { const r = e.getBoundingClientRect(); return r.width && r.right > innerWidth + 1; }).slice(0, 5).map(e => e.tagName + "." + String(e.className).slice(0, 30) + " [" + e.textContent.trim().slice(0, 40) + "]") : []')
    assert not wide, f'{page.url}: page scrolls sideways: {wide}'
    # Nothing inside the board may hang outside it.
    outside = board.evaluate('(el) => [...el.querySelectorAll("*")].filter(e => { const r = e.getBoundingClientRect(), b = el.getBoundingClientRect(); return r.width && (r.left < b.left - 1 || r.right > b.right + 1); }).slice(0, 4).map(e => e.tagName + "." + String(e.className).slice(0, 30) + " [" + e.textContent.trim().slice(0, 30) + "] right=" + Math.round(e.getBoundingClientRect().right) + " boardRight=" + Math.round(el.getBoundingClientRect().right))')
    assert not outside, f'{page.url}: hangs outside the board: {outside}'


with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, channel='chrome')
    for width in (1280, 390):
        context = browser.new_context(viewport={'width': width, 'height': 1000})
        assert context.request.post(BASE + '/api/auth/teacher', data={'email': 'admin@dpsrkp.edu.in', 'password': 'Admin@123'}).status == 200
        page = context.new_page()
        errors = []
        page.on('pageerror', lambda e: errors.append(str(e)))
        # Phones scroll with a thumb, so the finger path is the tap fallback; wide screens use the selected mode.
        if width == 390 and MODE == 'drag':
            continue
        for case in cases:
            slug = case['slug']
            print(f'  -> {slug}', flush=True) if os.environ.get('VERBOSE') else None
            page.goto(BASE + f'/module/cyber/{slug}?grade={case["grade"]}', timeout=120000)
            page.wait_for_load_state('networkidle')
            page.get_by_role('button', name='Skip to practice', exact=True).click()
            for stage, entry in enumerate(case['tasks']):
                task = entry['task']
                board = page.locator('[data-task-kind]').last
                expect(board).to_have_attribute('data-task-kind', task['kind'])
                band = 'junior' if case['grade'] <= 7 else 'senior'
                if task['kind'] in ('select', 'match', 'order', 'choice', 'number') and not (task.get('presentation') == 'redact'):
                    expect(board.locator(f'[data-band="{band}"]').first).to_be_visible()
                check = board.get_by_role('button', name='Check my answer', exact=True)
                interactive = task['kind'] in ('select', 'match', 'order', 'choice', 'number') and task.get('presentation') != 'redact'
                if entry['wrong'] is not None and interactive:
                    fill(page, board, task, entry['wrong'])
                    check.click()
                    expect(page.locator('[data-task-feedback]')).to_have_attribute('data-result', 'retry')
                    assert board.locator('[data-correct="false"]').count() >= 1, f'{slug} stage {stage}: no card marked as wrong'
                    no_overflow(page, board)
                    clear(board, task['kind'])
                    if task['kind'] in ('select', 'match', 'order'):
                        expect(page.locator('[data-task-feedback]')).to_have_count(0)
                fill(page, board, task, entry['solution'])
                no_overflow(page, board)
                check.click()
                expect(page.locator('[data-task-feedback]')).to_have_attribute('data-result', 'correct')
                if interactive:
                    assert board.locator('[data-correct="true"]').count() >= 1, f'{slug} stage {stage}: no card marked as right'
                page.get_by_role('button', name='Review mission' if stage == 2 else 'Next challenge', exact=True).click()
            expect(page.locator(f'[data-mission-ready="{slug}"]')).to_be_visible()
            print(f'{MODE} {width}px: {slug} ({case["grade"]}) — {[e["task"]["kind"] for e in case["tasks"]]}', flush=True)
        assert not errors, errors
        context.close()
    browser.close()
print('Practice boards work.')
