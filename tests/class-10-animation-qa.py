"""Real, authenticated Class 10 animation QA; run only against disposable localhost.

NODE24=/path/to/node BASE_URL=http://localhost:3218 /path/to/python tests/class-10-animation-qa.py
This does not seed or replace the application, evaluator, narration or media clock.
"""
import json
import os
import re
import subprocess
import time
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

os.environ['COURSE_QA_GRADE'] = '10'
from course_browser_qa import BASE, ROOT, OUT, cases, fillAnswer, checkAnswer, set_language, solve, assert_diagnosis

NODE = os.environ.get('NODE24', 'node')
source = r'''
import {loadSource} from './tests/class-9-helpers.mjs';
const {makeTaskSimulation,diagnoseTask}=await loadSource('export {makeTaskSimulation} from "./app/module/cyber/lessons/class8/task-simulation"; export {diagnoseTask} from "./app/module/cyber/lessons/class8/task-feedback";');
const input=JSON.parse(process.argv[1]);
console.log(JSON.stringify(input.map(({task,answer,diagnosis})=>diagnosis?diagnoseTask(task,answer):(makeTaskSimulation(task,answer)?.result??null))));
'''
def expected_snapshots(entries):
    return json.loads(subprocess.run([NODE,'--input-type=module','-e',source,json.dumps(entries,ensure_ascii=False)],cwd=ROOT,text=True,capture_output=True,check=True).stdout)

route_cache = {}
def route_expected(route):
    key=route['id']
    if key not in route_cache:
        program = r"""import {loadSource} from './tests/class-9-helpers.mjs';
const {simulateRoute,evaluateTask}=await loadSource('export {simulateRoute,evaluateTask} from "./app/module/cyber/lessons/class8/task-evaluation";');
const r=JSON.parse(process.argv[1]);const full=simulateRoute(r.task,r.moves);
const n=full.path.length+(full.failedAt===null?0:1);let previous=0;
const rows=Array.from({length:n},(_,i)=>{const x=simulateRoute(r.task,r.moves.slice(0,i));const row={cell:x.position,cost:x.cost,charge:x.cost-previous,moves:x.path.length-1};previous=x.cost;return row});
console.log(JSON.stringify({rows,passed:evaluateTask(r.task,r.moves).correct}));"""
        route_cache[key]=json.loads(subprocess.run([NODE,'--input-type=module','-e',program,json.dumps(route,ensure_ascii=False)],cwd=ROOT,text=True,capture_output=True,check=True).stdout)
    return route_cache[key]

# Preserve SVG commands and separators while removing sub-micro-unit float noise.
_SVG_NUMBER = re.compile(r"[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?")
def normalize_geometry(value):
    if value is None:
        return None
    def canonical(match):
        number = round(float(match.group()), 6)
        return f'{number:.6f}' if number else '0.000000'
    return _SVG_NUMBER.sub(canonical, value)

def capture(explanation):
    # Capture actual SVG geometry and visible semantics, not progress attributes alone.
    frame = explanation.locator('[data-concept-diagram]').evaluate('''e => {
      const marker=e.querySelector('[data-route-position]');
      if(marker) {const counters=e.querySelector('[data-route-cost]');return {
        route:e.dataset.routeExplanation, index:Number(e.dataset.routeEntry),
        marker:[Number(marker.dataset.routePosition),Number(marker.getAttribute('cx')),Number(marker.getAttribute('cy'))],
        cost:Number(counters.dataset.routeCost),charge:Number(counters.dataset.routeCharge),moves:Number(counters.dataset.routeMoves),
        cells:[...e.querySelectorAll('[data-route-cell]')].map(n=>[Number(n.dataset.routeCell),n.dataset.blocked]),
        rows:[...e.querySelectorAll('[data-route-row]')].map(n=>[Number(n.dataset.cell),Number(n.dataset.cost),Number(n.dataset.charge),n.getAttribute('aria-current')]),
        passed:e.querySelector('[data-route-passed]')?.dataset.routePassed??null,
        caption:e.innerText
      }}
      return {nodes:[...e.querySelectorAll('[data-node-id]')].map(n=>[n.dataset.nodeId,n.getAttribute('transform')]),
        edges:[...e.querySelectorAll('[data-edge-id] path')].map(n=>n.getAttribute('d')),
        legend:[...e.querySelectorAll('[data-legend-node]')].map(n=>[n.dataset.legendNode,n.innerText,n.dataset.status]),
        caption:e.querySelector('figcaption').innerText};
    }''')
    if 'nodes' in frame:
        frame['nodes'] = [[node_id, normalize_geometry(transform)] for node_id, transform in frame['nodes']]
        frame['edges'] = [normalize_geometry(path) for path in frame['edges']]
    return frame

def assert_route(frame, route):
    expected=route_expected(route); rows=expected['rows']; index=frame['index']; current=rows[index]
    assert frame['route']==route['id'] and len(frame['cells'])==12 and [x[0] for x in frame['cells']]==list(range(12))
    assert [x[0] for x in frame['cells'] if x[1]=='true']==route['task']['blocked']
    assert frame['marker']==[current['cell'],current['cell']%4*80+40,current['cell']//4*80+40]
    assert (frame['cost'],frame['charge'],frame['moves'])==(current['cost'],current['charge'],current['moves'])
    assert frame['rows']==[[row['cell'],row['cost'],row['charge'],'step' if i==index else None] for i,row in enumerate(rows)]
    if index==len(rows)-1: assert frame['passed']==str(expected['passed']).lower()

def seek(page, story, explanation, scene, fraction):
    target = scene['start'] + scene['duration'] * fraction
    story.locator('audio').evaluate('(a,t)=>{a.pause();a.currentTime=t;a.dispatchEvent(new Event("timeupdate"))}', target)
    expect(explanation).to_have_attribute('data-mode','follow')
    page.wait_for_function('([s,p])=>{const e=document.querySelector(`[data-class10-explanation="${s}"]`); return e && Math.abs(Number(e.dataset.progress)-p)<.04}',arg=[story.get_attribute('data-story-player'),fraction])
    return capture(explanation)

def check_scene(page, chapter, script, index):
    slug=chapter['slug']; story=page.locator(f'[data-story-player="{slug}"]')
    story.locator('nav button').nth(index).click()
    expect(story).to_have_attribute('data-scene',str(index))
    explanation=story.locator('[data-class10-explanation]')
    a=seek(page,story,explanation,script['scenes'][index],.08)
    b=seek(page,story,explanation,script['scenes'][index],.94)
    first=chapter['visual']['scenes'][index]['steps'][0]
    last=chapter['visual']['scenes'][index]['steps'][-1]
    assert first['label']['en'] in a['caption'] and last['label']['en'] in b['caption'], (slug,index,a,b)
    if slug=='class10-weighted-rerouting':
        assert_route(a,first['route']); assert_route(b,last['route'])
        assert a['marker']!=b['marker'] or a['route']!=b['route'] or a['cost']!=b['cost'], (slug,index,a,b)
    else:
        assert a['nodes'] != b['nodes'] or a['edges'] != b['edges'], (slug,index,'no actual SVG movement',a,b)
        assert a['legend'] != b['legend'] or a['caption'] != b['caption'], (slug,index,'no semantic change')
        for node in chapter['visual']['nodes']:
            assert any(item[0]==node['id'] and node['label']['en'] in item[1] for item in b['legend']), (slug,index,node['id'])
    back=seek(page,story,explanation,script['scenes'][index],.08)
    assert back==a, (slug,index,'backward seek did not reconstruct',a,back)
    page.wait_for_timeout(350)
    assert capture(explanation)==back, (slug,index,'paused frame moved')
    return story,explanation

def controls(page, explanation):
    button=lambda name: explanation.locator(f'[data-control="{name}"]')
    button('replay').click(); expect(explanation).to_have_attribute('data-running','true')
    page.wait_for_timeout(300); button('pause').click()
    paused=capture(explanation); page.wait_for_timeout(300); assert capture(explanation)==paused
    button('resume').click(); expect(explanation).to_have_attribute('data-running','true')
    button('pause').click(); button('reset').click()
    expect(explanation).to_have_attribute('data-progress','0.0000')
    button('next').click(); expect(explanation).to_have_attribute('data-step','1')
    button('previous').click(); expect(explanation).to_have_attribute('data-step','0')

def replay_while_playing(page, explanation):
    """Restart an already running generic diagram and observe real SVG geometry."""
    reset=explanation.locator('[data-control="reset"]')
    replay=explanation.locator('[data-control="replay"]')
    reset.click(); initial=capture(explanation)
    replay.click(); expect(explanation).to_have_attribute('data-running','true')
    page.wait_for_timeout(2200); advanced=capture(explanation)
    assert advanced['nodes']!=initial['nodes'] or advanced['edges']!=initial['edges'], 'Replay did not visibly advance'
    assert float(explanation.get_attribute('data-progress'))>.18
    replay.click()  # Do not pause: this exercises the live RAF restart.
    page.wait_for_function("e=>Number(e.dataset.progress)<.04",arg=explanation.element_handle())
    restarted=capture(explanation)
    # SVG transforms must actually return close to the initial coordinates.
    import re
    def positions(frame):
        return {key:tuple(map(float,re.findall(r'-?\d+(?:\.\d+)?', transform))) for key,transform in frame['nodes']}
    a,b,c=positions(initial),positions(advanced),positions(restarted)
    common=a.keys() & b.keys() & c.keys()
    assert common and sum(sum(abs(x-y) for x,y in zip(a[k],c[k])) for k in common) < sum(sum(abs(x-y) for x,y in zip(a[k],b[k])) for k in common), (initial,advanced,restarted)
    page.wait_for_timeout(400)
    assert float(explanation.get_attribute('data-progress'))<.13, 'Old playback resumed after restart'
    page.wait_for_timeout(900)
    assert .08<float(explanation.get_attribute('data-progress'))<.24, 'Restart spawned a duplicate or stale playback stream'
    explanation.locator('[data-control="pause"]').click()

def trace_replay_while_playing(page, trace):
    replay=trace.locator('[data-control="trace-replay"]')
    trace.locator('[data-control="trace-reset"]').click(); replay.click()
    expect(trace).to_have_attribute('data-running','true')
    page.wait_for_timeout(2300)
    assert int(trace.get_attribute('data-trace-step'))>=2
    replay.click()  # Restart while the existing playback is running.
    expect(trace).to_have_attribute('data-trace-step','0')
    expect(trace.locator('[data-trace-row][aria-current="step"]')).to_have_attribute('data-trace-row','move-0')
    page.wait_for_timeout(300)
    assert trace.get_attribute('data-trace-step')=='0', 'Old trace index returned after restart'
    page.wait_for_timeout(1000)
    assert int(trace.get_attribute('data-trace-step'))==1, 'Trace playback restarted more than once or resumed at its old index'
    trace.locator('[data-control="trace-pause"]').click()
    trace.locator('[data-control="trace-reset"]').click()

def explore(page, story, explanation, chapter, events):
    before=len(events); scene=story.get_attribute('data-scene'); solved=story.get_attribute('data-solved')
    signatures=[]
    for variant in chapter['visual']['exploration']['variants']:
        explanation.locator('[data-variant]').filter(has_text=variant['label']['en']).click()
        expect(explanation).to_have_attribute('data-visual-scene',str(variant['scene']))
        expect(explanation).to_have_attribute('data-step',str(variant['step']))
        signatures.append(capture(explanation))
        assert variant['label']['en'] in explanation.inner_text()
        assert story.get_attribute('data-scene')==scene and story.get_attribute('data-solved')==solved
    assert len({json.dumps(item,sort_keys=True) for item in signatures})>1, chapter['slug']
    assert not [event for event in events[before:] if event in ('question_answered','story_answered')], (chapter['slug'],events[before:])

def route_controls(page, story, chapter, script):
    explanation=story.locator('[data-class10-explanation]')
    b=chapter['visual']['scenes'][1]['steps'][1]['route']
    explanation.locator('[data-variant="alternative-b"]').click()
    selected=capture(explanation); assert_route(selected,b)
    assert selected['marker'][0]==11 and selected['cost']==14 and selected['passed']=='true'
    explanation.locator('[data-control="replay"]').click()
    expect(explanation.locator('[data-route-explanation]')).to_have_attribute('data-route-explanation','path-b')
    expect(explanation.locator('[data-route-explanation]')).to_have_attribute('data-route-entry','0')
    page.wait_for_timeout(2300)
    assert int(explanation.locator('[data-route-explanation]').get_attribute('data-route-entry'))>=2
    explanation.locator('[data-control="replay"]').click()  # Restart selected B while already running.
    figure=explanation.locator('[data-route-explanation]')
    expect(figure).to_have_attribute('data-route-explanation','path-b')
    expect(figure).to_have_attribute('data-route-entry','0')
    frame=capture(explanation); assert_route(frame,b); assert frame['marker'][0]==b['task']['start']
    page.wait_for_timeout(300); expect(figure).to_have_attribute('data-route-entry','0')
    page.wait_for_timeout(1000)
    assert 1<=int(figure.get_attribute('data-route-entry'))<=2, 'Selected B resumed stale or duplicate playback'
    expect(figure).to_have_attribute('data-route-explanation','path-b')
    explanation.locator('[data-control="pause"]').click()
    paused=capture(explanation); assert_route(paused,b); page.wait_for_timeout(350); assert capture(explanation)==paused
    explanation.locator('[data-control="resume"]').click(); expect(explanation).to_have_attribute('data-running','true')
    explanation.locator('[data-control="pause"]').click()
    rows=route_expected(b)['rows']; repeat=[]
    for i,row in enumerate(rows):
        explanation.locator(f'[data-control="route-entry-{i}"]').click()
        frame=capture(explanation); assert_route(frame,b); assert frame['index']==i
        if row['cell']==6: repeat.append(row['charge'])
    assert repeat==[3,3],repeat
    explanation.locator('[data-control="reset"]').click()
    expect(explanation).to_have_attribute('data-progress','0.0000')
    story.locator('nav button').nth(5).click()
    explanation=story.locator('[data-class10-explanation]')
    changed=chapter['visual']['scenes'][5]['steps'][2]['route']
    frame=seek(page,story,explanation,script['scenes'][5],.94)
    assert_route(frame,changed)
    explanation.locator(f'[data-control="route-entry-{len(route_expected(changed)["rows"])-1}"]').click()
    frame=capture(explanation); assert_route(frame,changed)
    assert frame['marker'][0]==11 and frame['cost']==16 and frame['passed']=='false'

with sync_playwright() as p:
    browser=p.chromium.launch(channel='chrome',headless=True)
    context=browser.new_context(viewport={'width':1440,'height':1000})
    assert context.request.post(BASE+'/api/auth/teacher',data={'email':'teacher@dpsrkp.edu.in','password':'Teacher@123'}).status==200
    page=context.new_page(); page.set_default_timeout(30000); events=[]; errors=[]
    page.on('pageerror',lambda error: errors.append(str(error)))
    def activity(request):
        if request.method=='POST' and request.url.endswith('/api/activity'):
            body=request.post_data_json
            events.extend(row.get('type') for row in body.get('events',[body]))
    page.on('request',activity)
    entries=[]; exercised=set()
    for chapter in cases:
        slug=chapter['slug']; path=ROOT/'app/module/cyber/lessons/new/story/chapters'/f'{slug}.json'
        script=json.loads(path.read_text()); assert script['duration']>0 and (ROOT/'public/audio/cyber'/slug/'story.mp3').exists(),slug
        page.goto(BASE+f'/module/cyber/{slug}?role=teacher&grade=10',timeout=120000)
        story=page.locator(f'[data-story-player="{slug}"]'); expect(story).to_be_visible()
        page.wait_for_function('()=>{let a=document.querySelector("audio");return a&&a.readyState>=1&&Number.isFinite(a.duration)&&a.duration>0}')
        assert abs(story.locator('audio').evaluate('a=>a.duration')-script['duration'])<.2,slug
        # The actual gate decision is completed before navigating scenes 5 and 6.
        story.locator('nav button').nth(5).click(); expect(story).to_have_attribute('data-scene','3')
        expect(story).to_have_attribute('data-solved','false')
        explore(page,story,story.locator('[data-class10-explanation]'),chapter,events)
        story.locator('nav button').nth(5).click(); expect(story).to_have_attribute('data-scene','3')
        expect(story).to_have_attribute('data-solved','false')
        solve(story.locator('[data-task-kind="choice"]'),chapter['decision'],chapter['decision']['correct'])
        expect(story).to_have_attribute('data-solved','true')
        for index in range(6):
            story,explanation=check_scene(page,chapter,script,index)
        controls(page,explanation); explore(page,story,explanation,chapter,events)
        if slug=='class10-weighted-rerouting': route_controls(page,story,chapter,script)
        # Play real muted audio through a moving authored interval and observe SVG, then pause.
        motion_scene=1 if slug=='class10-weighted-rerouting' else 0
        story.locator('nav button').nth(motion_scene).click(); explanation=story.locator('[data-class10-explanation]')
        if chapter is cases[0]:
            replay_while_playing(page,explanation)
            explanation.locator('[data-control="follow"]').click()
        stages=chapter['visual']['scenes'][motion_scene]['steps']
        boundaries=[0,.3,.6,.85] if len(stages)==4 else [0,.45,.85]
        base={n['id']:(n['x'],n['y']) for n in chapter['visual']['nodes']}
        moving=None
        for j,stage in enumerate(stages):
            previous={m['id']:(m['x'],m['y']) for m in (stages[j-1].get('moves',[]) if j else [])}
            target={m['id']:(m['x'],m['y']) for m in stage.get('moves',[])}
            if any(previous.get(node,base[node]) != target.get(node,base[node]) for node in base):
                moving=boundaries[j]+((boundaries[j+1] if j+1<len(stages) else 1)-boundaries[j])*.2; break
        assert moving is not None, (slug,'no authored movement')
        if slug=='class10-weighted-rerouting': moving=.50
        seek(page,story,explanation,script['scenes'][motion_scene],moving)
        explanation.locator('[data-control="follow"]').click()
        story.locator('audio').evaluate('a=>{a.muted=true}')
        page.wait_for_timeout(200); start=capture(explanation)
        deadline=time.monotonic()+3
        while True:
            page.wait_for_timeout(200); end=capture(explanation)
            moved=(start['marker']!=end['marker'] if 'marker' in start else start['nodes']!=end['nodes'] or start['edges']!=end['edges'])
            if moved or time.monotonic()>deadline: break
        assert moved,(slug,'no continuous audio movement',start,end)
        explanation.locator('[data-control="pause"]').click(); frozen=capture(explanation); page.wait_for_timeout(400); assert capture(explanation)==frozen
        if chapter is cases[0]: page.screenshot(path=str(OUT/'animation-ordinary.png'),full_page=True)
        set_language(page,'hi'); expect(story.get_by_text(chapter['scenes'][motion_scene]['caption']['hi'],exact=True)).to_be_visible()
        step=int(explanation.get_attribute('data-step'))
        expect(explanation.locator('[data-concept-diagram]')).to_contain_text(chapter['visual']['scenes'][motion_scene]['steps'][step]['label']['hi'])
        set_language(page,'en')
        story.get_by_role('button',name='Skip to practice',exact=True).click()
        for i,task in enumerate(chapter['tasks']):
            practice=page.locator(f'[data-new-mission="{slug}"]'); board=practice.locator('[data-task-kind]')
            if task['kind'] in ('route','model') or task['kind']=='match' and task.get('presentation')=='permissions':
                answer=chapter['solutions'][i]
                wrong=chapter['wrongs'][i][0]
                fillAnswer(board,task,wrong)
                board.get_by_role('button',name='Run the test',exact=True).click()
                trace=practice.locator('[data-class10-trace]'); expect(trace).to_have_attribute('data-trace-state','tested')
                fillAnswer(board,task,answer)
                expect(trace).to_have_attribute('data-trace-state','outdated')
                expect(board.get_by_role('button',name='Check my evidence',exact=True)).to_be_disabled()
                board.get_by_role('button',name='Run the test',exact=True).click()
                trace=practice.locator('[data-class10-trace]'); expect(trace).to_have_attribute('data-trace-state','tested')
                expected=expected_snapshots([{'task':task,'answer':answer}])[0]
                actual=json.loads(trace.get_attribute('data-snapshot')); assert actual==expected,(slug,i,actual,expected)
                if task['kind']=='route':
                    trace_replay_while_playing(page,trace)
                    result=actual; cost=0
                    for n,cell in enumerate(result['path']):
                        if n: cost+=task.get('cellCosts',{}).get(str(cell),1)
                        assert trace.locator('[data-route-position]').get_attribute('data-route-position')==str(cell)
                        assert float(trace.locator('[data-route-cost]').get_attribute('data-route-cost'))==(result['cost'] if n==len(result['path'])-1 else cost)
                        if n<len(result['path'])-1: trace.locator('[data-control="trace-next"]').click()
                exercised.add('permissions' if task['kind']=='match' else task['kind'])
                checkAnswer(board,task,answer,require_untested=False)
            else: solve(board,task,chapter['solutions'][i])
            expect(practice).to_have_attribute('data-ready','true')
            practice.get_by_role('button',name='Review mission' if i==2 else 'Next challenge',exact=True).click()
        print(f'PASS {slug}: six real scenes, seek, controls, exploration and tested practice',flush=True)
    assert exercised=={'route','model','permissions'},exercised
    assert not errors,errors
    # A fresh preview for each schedule prevents a successful answer locking the board.
    schedule=next(c for c in cases if c['slug']=='class10-prerequisite-schedules')
    idx=next(i for i,t in enumerate(schedule['tasks']) if t['kind']=='order' and t.get('prerequisites'))
    for answer in (['s','l','a','r','v'],['s','a','l','r','v'],['s','l','r','a','v']):
        preview_context=browser.new_context(viewport={'width':1440,'height':1000})
        try:
            assert preview_context.request.post(BASE+'/api/auth/teacher',data={'email':'teacher@dpsrkp.edu.in','password':'Teacher@123'}).status==200
            preview=preview_context.new_page(); preview.goto(BASE+f"/module/cyber/{schedule['slug']}?role=teacher&grade=10")
            preview.get_by_role('button',name='Skip to practice',exact=True).click()
            for i in range(idx):
                practice=preview.locator(f"[data-new-mission=\"{schedule['slug']}\"]")
                solve(practice.locator('[data-task-kind]'),schedule['tasks'][i],schedule['solutions'][i])
                practice.get_by_role('button',name='Next challenge',exact=True).click()
            practice=preview.locator(f"[data-new-mission=\"{schedule['slug']}\"]")
            solve(practice.locator('[data-task-kind]'),schedule['tasks'][idx],answer)
            if answer[2]=='r':
                expect(practice).to_have_attribute('data-ready','false')
                diagnosis=expected_snapshots([{'task':schedule['tasks'][idx],'answer':answer,'diagnosis':True}])[0]
                assert_diagnosis(practice,diagnosis)
            else: expect(practice).to_have_attribute('data-ready','true')
        finally:
            preview_context.close()
    context.close()
    recording=browser.new_context(viewport={'width':1000,'height':700},record_video_dir=str(OUT/'video'))
    assert recording.request.post(BASE+'/api/auth/teacher',data={'email':'teacher@dpsrkp.edu.in','password':'Teacher@123'}).status==200
    movie=recording.new_page(); movie.goto(BASE+f"/module/cyber/{cases[0]['slug']}?role=teacher&grade=10")
    movie.locator('[data-control="replay"]').click(); movie.wait_for_timeout(2500)
    recording.close()
    reduced=browser.new_context(viewport={'width':390,'height':844},reduced_motion='reduce')
    assert reduced.request.post(BASE+'/api/auth/teacher',data={'email':'teacher@dpsrkp.edu.in','password':'Teacher@123'}).status==200
    mobile=reduced.new_page(); chapter=cases[0]; slug=chapter['slug']
    mobile.goto(BASE+f'/module/cyber/{slug}?role=teacher&grade=10')
    explanation=mobile.locator('[data-class10-explanation]'); expect(explanation).to_have_attribute('data-mode','manual')
    expect(explanation.locator('[data-control="replay"]')).to_be_disabled()
    first=capture(explanation); explanation.locator('[data-control="next"]').click(); second=capture(explanation)
    assert first!=second and chapter['visual']['scenes'][0]['steps'][1]['label']['en'] in second['caption']
    assert mobile.evaluate('document.documentElement.scrollWidth<=innerWidth')
    mobile.screenshot(path=str(OUT/'animation-reduced-mobile.png'),full_page=True)
    mobile.set_viewport_size({'width':844,'height':390})
    assert mobile.evaluate('document.documentElement.scrollWidth<=innerWidth')
    set_language(mobile,'hi'); expect(explanation.locator('[data-concept-diagram]')).to_contain_text(chapter['visual']['scenes'][0]['steps'][1]['label']['hi'])
    route_chapter=next(c for c in cases if c['slug']=='class10-weighted-rerouting')
    mobile.goto(BASE+f"/module/cyber/{route_chapter['slug']}?role=teacher&grade=10")
    route_story=mobile.locator(f"[data-story-player=\"{route_chapter['slug']}\"]")
    route_explanation=route_story.locator('[data-class10-explanation]')
    expect(route_explanation).to_have_attribute('data-mode','manual')
    route_explanation.locator('[data-variant="alternative-b"]').click()
    b=route_chapter['visual']['scenes'][1]['steps'][1]['route']
    frame=capture(route_explanation); assert_route(frame,b)
    expect(route_explanation.locator('[data-control="replay"]')).to_be_disabled()
    for i in range(len(route_expected(b)['rows'])):
        route_explanation.locator(f'[data-control="route-entry-{i}"]').click()
        frame=capture(route_explanation); assert_route(frame,b); assert frame['index']==i
    assert frame['cost']==14 and frame['passed']=='true'
    mobile.screenshot(path=str(OUT/'animation-route-reduced-mobile.png'),full_page=True)
    reduced.close()
    blocked=browser.new_context(viewport={'width':390,'height':844})
    assert blocked.request.post(BASE+'/api/auth/teacher',data={'email':'teacher@dpsrkp.edu.in','password':'Teacher@123'}).status==200
    blocked.route('**/audio/cyber/**/*.mp3',lambda route: route.abort())
    fallback=blocked.new_page(); fallback.goto(BASE+f'/module/cyber/{slug}?role=teacher&grade=10')
    expect(fallback.get_by_text('Audio couldn’t load. Read the captions and use Next scene.')).to_be_visible()
    explanation=fallback.locator('[data-class10-explanation]'); explanation.locator('[data-control="next"]').click()
    expect(explanation).to_have_attribute('data-step','1')
    assert fallback.evaluate('document.documentElement.scrollWidth<=innerWidth')
    blocked.close(); browser.close()
