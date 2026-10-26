"""Run against a disposable local server: CYBERSURAKSHA_EPHEMERAL_WORKERS=1 npm run dev -- --port 3201."""
import os
import re
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

base = os.environ.get('BASE_URL', 'http://localhost:3201')
out = Path('.lms-qa')
out.mkdir(exist_ok=True)
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, channel='chrome')
    teacher = browser.new_context(viewport={'width': 1440, 'height': 1000})
    student = browser.new_context(viewport={'width': 390, 'height': 844})
    assert teacher.request.post(base + '/api/auth/teacher', data={'email':'teacher@dpsrkp.edu.in','password':'Teacher@123'}).status == 200
    assert student.request.post(base + '/api/auth/student', data={'school':'dps-rkp','className':'7A','rollNo':'20','password':'DPS20SAFE'}).status == 200
    page = teacher.new_page()
    page.set_default_timeout(15000)
    errors=[]
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.goto(base + '/teach/lms/new')
    page.wait_for_load_state('networkidle')
    expect(page.get_by_role('heading', name='Create assignment')).to_be_visible()
    page.get_by_label('Assignment title').fill('Browser verified school assessment')
    page.get_by_label('Class section', exact=True).select_option(label='7A')
    page.locator('input[type=datetime-local]').fill((datetime.now(ZoneInfo('America/New_York'))+timedelta(days=1)).strftime('%Y-%m-%dT%H:%M'))
    page.get_by_label('Total marks', exact=False).fill('10')
    page.get_by_role('button', name='Add custom question').click()
    page.get_by_label('Question', exact=True).fill('What should you do with an unknown caller?')
    page.get_by_label('Section / skill').fill('Verifying callers')
    page.get_by_label('Answer type').select_option('choice')
    for i, option in enumerate(['Ask a trusted adult','Share my password','Pay immediately','Read out an OTP']):
        page.get_by_label(f'Option {i+1}',exact=True).fill(option)
    page.get_by_label('Correct answer',exact=False).select_option('Ask a trusted adult')
    page.get_by_role('button', name='Add custom question').click()
    page.screenshot(path=str(out/'composer-questions.png'),full_page=True)
    page.get_by_label('Question',exact=True).nth(1).fill('Explain how to verify a message.')
    page.get_by_label('Section / skill').nth(1).fill('Verifying callers')
    page.get_by_role('button',name='Save draft',exact=True).click()
    expect(page).to_have_url(re.compile(r'/teach/lms/\d+$'))
    assignment_id=page.url.rsplit('/',1)[-1]
    expect(page.get_by_role('heading',name='Browser verified school assessment')).to_be_visible()
    page.get_by_role('link',name='Edit draft',exact=True).click()
    expect(page.get_by_label('Assignment title')).to_have_value('Browser verified school assessment')
    page.get_by_label('Assignment title').fill('Browser verified school assessment final')
    page.get_by_role('button',name='Publish assignment',exact=True).click()
    page.wait_for_url(base + '/teach/lms/' + assignment_id)
    expect(page.get_by_role('heading',name='Student submissions',exact=True)).to_be_visible()
    learner = student.new_page()
    learner.on('pageerror', lambda error: errors.append(str(error)))
    learner.goto(base + '/learn/assignments/' + assignment_id)
    learner.wait_for_load_state('networkidle')
    expect(learner.get_by_role('heading',name='Browser verified school assessment final')).to_be_visible()
    learner.get_by_label('Ask a trusted adult',exact=True).check()
    learner.get_by_label('Your answer',exact=True).fill('Check through a known number and ask a trusted adult.')
    learner.get_by_role('button',name='Submit final answers',exact=True).click()
    expect(learner.get_by_role('heading',name='Submitted · awaiting teacher grading')).to_be_visible()
    learner.screenshot(path=str(out/'submitted-mobile.png'),full_page=True)
    assert learner.evaluate('document.documentElement.scrollWidth <= innerWidth'), 'Student form overflows on mobile'
    page.reload()
    page.locator('summary').filter(has_text='Aarav Mehta').click()
    expect(page.get_by_label('Marks awarded').nth(1)).to_be_visible()
    page.get_by_label('Marks awarded').nth(1).fill('3')
    page.get_by_label('Overall feedback').fill('Good verification. Explain the reason for each step next time.')
    page.get_by_role('button',name='Save marks and feedback').click()
    # Saved grades replace the expanded panel; check through the student page.
    expect(page.locator('summary').filter(has_text='Aarav Mehta')).to_contain_text('View / revise marks')
    learner.reload()
    expect(learner.get_by_text('Custom questions: 8 / 10 marks',exact=True)).to_be_visible()
    expect(learner.get_by_text('Good verification. Explain the reason for each step next time.')).to_be_visible()
    learner.goto(base + '/learn/progress')
    expect(learner.get_by_role('heading',name='Sections to focus on')).to_be_visible()
    expect(learner.get_by_role('cell',name=re.compile('Verifying callers'))).to_be_visible()
    expected_wrong=sum(row['wrong'] for row in student.request.get(base+'/api/lms/progress').json()['insights'])
    expect(learner.get_by_text('Wrong / partial',exact=True).first.locator('..').locator('strong')).to_have_text(str(expected_wrong))
    learner.screenshot(path=str(out/'progress-mobile.png'),full_page=True)
    assert learner.evaluate('document.documentElement.scrollWidth <= innerWidth'), 'Progress page overflows on mobile'
    learner.goto(base + '/dashboard')
    learner.wait_for_load_state('networkidle')
    assert learner.locator('a[href^="/grade/7?"]').count() == 1
    assert learner.locator('a[href^="/grade/8?"]').count() == 0
    denied=student.request.get(base+'/grade/8?role=teacher')
    assert denied.status == 404, denied.status
    denied=student.request.get(base+'/module/cyber/algorithm-optimization?grade=7')
    assert denied.status == 404, denied.status
    page.goto(base + '/teach/lms')
    page.get_by_role('link',name='Results',exact=True).click()
    expect(page.get_by_role('heading',name='Marks record')).to_be_visible()
    with page.expect_download() as downloaded:
        page.get_by_role('button',name='Download marks CSV').click()
    assert downloaded.value.suggested_filename == 'class-marks.csv'
    page.screenshot(path=str(out/'marks-desktop.png'),full_page=True)
    page.set_viewport_size({'width':390,'height':844})
    page.goto(base + '/teach/admin')
    expect(page.get_by_role('heading',name='School curriculum',exact=True)).to_be_visible()
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), 'Admin page overflows on mobile'
    page.screenshot(path=str(out/'admin-mobile.png'),full_page=True)
    assert not errors, errors
    print('PASS: draft creation/edit/publication, custom questions, student submission, teacher grading, feedback, marks CSV, own progress, mobile layout and direct-route restrictions.')
    browser.close()
