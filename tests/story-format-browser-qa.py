"""Character-led lesson regression against disposable localhost only.
BASE_URL=http://localhost:3218 python3 tests/story-format-browser-qa.py
"""
import json
import os
from pathlib import Path
import re
import subprocess
from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parent.parent
BASE = os.environ.get('BASE_URL', 'http://localhost:3218')
assert re.fullmatch(r'http://(localhost|127\.0\.0\.1):\d+', BASE)
OUT = ROOT / '.lms-qa/story-format'
OUT.mkdir(parents=True, exist_ok=True)
source = '''
import {readFileSync} from 'node:fs';
import {loadSource,solveTask} from './tests/class-9-helpers.mjs';
const m=await loadSource(`import {class6Chapters} from './app/data/class6';import {class7Chapters} from './app/data/class7';import {class8Chapters} from './app/data/class8';import {class9Chapters} from './app/data/class9';import {class10Chapters} from './app/data/class10';export const grades=[class6Chapters,class7Chapters,class8Chapters,class9Chapters,class10Chapters];export {evaluateTask,diagnoseTask} from './app/module/cyber/lessons/class8/task-feedback';`);
console.log(JSON.stringify(m.grades.flatMap((chapters,i)=>chapters.map(c=>({...c,grade:i+6,script:JSON.parse(readFileSync(`app/module/cyber/lessons/new/story/chapters/${c.slug}.json`)),solutions:c.tasks.map(t=>solveTask(t,m.evaluateTask))})))));
'''
# task-feedback imports the evaluator without re-exporting it.
source = source.replace('export {evaluateTask,diagnoseTask} from', "export {evaluateTask} from './app/module/cyber/lessons/class8/task-evaluation';export {diagnoseTask} from")
node = [os.environ['NODE24']] if os.environ.get('NODE24') else ['npx', '-y', 'node@24']
cases = json.loads(subprocess.check_output(node + ['--input-type=module', '-e', source], cwd=ROOT, text=True))
expect.set_options(timeout=30000)


def fill(board, task, answer):
    kind = task['kind']
    if kind == 'choice':
        board.get_by_role('button', name=next(o['label']['en'] for o in task['options'] if o['id'] == answer), exact=True).click()
    elif kind in ('select', 'model'):
        rows = task['items'] if kind == 'select' else task['examples']
        for i, row in enumerate(rows):
            board.locator('input[type=checkbox]').nth(i).set_checked(row['id'] in answer)
    elif kind == 'match':
        for i, row in enumerate(task['rows']):
            board.locator('select').nth(i).select_option(answer[row['id']])
    elif kind == 'number':
        for i, field in enumerate(task['fields']):
            board.locator('input[type=number]').nth(i).fill(str(answer[field['id']]))
    elif kind == 'order':
        for value in answer:
            board.get_by_role('button', name=next(o['label']['en'] for o in task['items'] if o['id'] == value), exact=True).click()
    elif kind == 'route':
        for value in answer:
            board.get_by_role('button', name=value.title(), exact=True).click()
    elif kind == 'binary':
        for i, value in enumerate(answer):
            if value == '1':
                board.get_by_role('button', name=str(2 ** (7 - i)), exact=True).click()
    elif kind == 'grid':
        for cell in answer:
            board.get_by_role('button', name=f'Row {cell // task["width"] + 1}, column {cell % task["width"] + 1}', exact=True).click()
    test = board.get_by_role('button', name='Run the test', exact=True)
    if test.count():
        test.click()


def no_overflow(page):
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), page.url


with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, channel='chrome')
    context = browser.new_context(viewport={'width': 1440, 'height': 1000})
    assert context.request.post(BASE + '/api/auth/teacher', data={'email': 'admin@dpsrkp.edu.in', 'password': 'Admin@123'}).status == 200
    page = context.new_page()
    errors = []
    page.on('pageerror', lambda e: errors.append(str(e)))
    covered = {grade: set() for grade in range(6, 11)}
    practice_cases = []
    for index, chapter in enumerate(cases):
        slug, grade = chapter['slug'], chapter['grade']
        page.goto(BASE + f'/module/cyber/{slug}?grade={grade}', timeout=120000)
        page.wait_for_load_state('networkidle')
        player = page.locator('[data-story-player]')
        expect(player).to_be_visible()
        actor = player.locator('[data-story-actor]')
        expect(actor).to_be_visible()
        expect(actor.locator('[data-character-asset]')).to_have_attribute('data-character-asset', 'boy-emotions')
        expect(actor.locator('[data-rive-loaded]')).to_have_attribute('data-rive-loaded', 'true')
        page.wait_for_function('document.querySelector("audio").readyState >= 1')
        assert player.locator('audio').evaluate('(a)=>!a.error && a.duration > 30')
        assert not player.locator('img[src*="cyber-missions"]').count()
        if index % 32 == 0:
            # Seek the real audio within a scene, then prove Pause freezes cue state and effects.
            audio = player.locator('audio')
            audio.evaluate('(a)=>{a.currentTime=0.1;a.dispatchEvent(new Event("timeupdate"));}')
            player.get_by_role('button', name='Play story', exact=True).click()
            expect(player).to_have_attribute('data-playing', 'true')
            page.wait_for_function('Number(document.querySelector("[data-world]").dataset.cue) >= 1')
            audio.evaluate('(a)=>a.pause()')
            expect(player).to_have_attribute('data-playing', 'false')
            frozen = player.locator('[data-world]').get_attribute('data-cue')
            page.wait_for_timeout(150)
            assert player.locator('[data-world]').get_attribute('data-cue') == frozen
            assert player.locator('[data-world]').evaluate('(el)=>el.getAnimations({subtree:true}).every(a=>a.playState==="paused")')
            # A seek within the same scene must update the real content, not just the progress bar.
            audio.evaluate('(a,t)=>{a.currentTime=t;a.dispatchEvent(new Event("timeupdate"));}', chapter['script']['scenes'][0]['duration'] * .9)
            page.wait_for_function('before => Number(document.querySelector("[data-world]").dataset.cue)>before', arg=int(frozen))
        for scene in range(4):
            player.get_by_role('button', name=f'Scene {scene + 1}:', exact=False).click()
            expect(player).to_have_attribute('data-scene', str(scene))
            expect(player.locator('[data-world]')).to_have_attribute('data-step', str(scene))
            player.locator('audio').evaluate('(a)=>a.pause()')
            no_overflow(page)
        # A wrong decision must explain the problem without advancing the story.
        options = chapter['decision']['options']
        wrong = next(o for o in options if o['id'] != chapter['decision']['correct'])
        player.get_by_role('button', name=wrong['label']['en'], exact=True).click()
        player.get_by_role('button', name='Lock in this choice', exact=True).click()
        expect(player.locator('[data-task-feedback]')).to_have_attribute('data-result', 'retry')
        expect(player).to_have_attribute('data-scene', '3')
        correct = next(o for o in options if o['id'] == chapter['decision']['correct'])
        player.get_by_role('button', name=correct['label']['en'], exact=True).click()
        player.get_by_role('button', name='Lock in this choice', exact=True).click()
        expect(player).to_have_attribute('data-solved', 'true')
        expect(player).to_have_attribute('data-scene', '4')
        player.get_by_role('button', name='Scene 6:', exact=False).click()
        expect(player).to_have_attribute('data-scene', '5')
        expect(player.locator('[data-world]')).to_have_attribute('data-step', '5')
        player.locator('audio').evaluate('(a)=>a.pause()')
        expect(player.locator('[class*="sceneContent"]').last).to_have_css('opacity', '1')
        kinds = {task['kind'] for task in chapter['tasks']}
        if kinds - covered[grade]:
            practice_cases.append(chapter)
            covered[grade] |= kinds
        if index % 32 == 0:
            page.screenshot(path=str(OUT / f'class-{grade}-desktop.png'), full_page=True)
            page.set_viewport_size({'width': 390, 'height': 844})
            no_overflow(page)
            expect(actor).to_be_visible()
            page.screenshot(path=str(OUT / f'class-{grade}-mobile.png'), full_page=True)
            page.set_viewport_size({'width': 1440, 'height': 1000})
        print(f'Story {index + 1}/160: {slug}', flush=True)

    for chapter in practice_cases:
        slug, grade = chapter['slug'], chapter['grade']
        page.goto(BASE + f'/module/cyber/{slug}?grade={grade}', timeout=120000)
        page.wait_for_load_state('networkidle')
        # Story progress is deliberately local to this browser; the skip is an actual learner control.
        page.get_by_role('button', name='Skip to practice', exact=True).click()
        for stage, (task, answer) in enumerate(zip(chapter['tasks'], chapter['solutions'])):
            board = page.locator('[data-task-kind]').last
            expect(board).to_have_attribute('data-task-kind', task['kind'])
            fill(board, task, answer)
            if task['kind'] == 'select':
                expect(board.locator('[data-answer-workspace]')).to_be_visible()
            board.get_by_role('button', name='Check my evidence', exact=True).click()
            expect(page.locator('[data-task-feedback]')).to_have_attribute('data-result', 'correct')
            page.get_by_role('button', name='Review mission' if stage == 2 else 'Next challenge', exact=True).click()
        ready = page.locator('[data-mission-ready]')
        expect(ready).to_be_visible()
        assert ready.evaluate('(el)=>getComputedStyle(el).color') != 'rgb(255, 249, 233)'
        page.get_by_role('button', name='Finish chapter', exact=True).click()
        expect(page.locator('[data-mission-complete]')).to_be_visible()
        no_overflow(page)
        print(f'Practice: {slug} — three challenges and completion passed', flush=True)
    assert not errors, errors
    print(json.dumps({'stories': len(cases), 'practiceChapters': len(practice_cases), 'taskKindsByGrade': {g: sorted(k) for g,k in covered.items()}}), flush=True)
    browser.close()
