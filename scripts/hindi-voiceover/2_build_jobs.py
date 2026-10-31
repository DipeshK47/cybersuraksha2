"""Pick the voice, text and file name for every scene. Usage: python 2_build_jobs.py scenes.json jobs.json"""
import collections, json, sys
import common


def lesson_voice(lesson):
    text = ' '.join(s['text'] for s in lesson['scenes'] if s['n'] in common.SCENES)
    pos = {n: text.find(n) for n in common.CHARACTERS if n in text}
    if not pos:
        return common.DEFAULT_VOICE, None
    first = min(pos, key=pos.get)
    return common.CHARACTERS[first], first


def main(src, dst):
    jobs, voices = [], collections.Counter()
    for l in json.load(open(src)):
        voice, who = lesson_voice(l)
        mod_no, mod_key = common.MODULES[l['module']]
        for s in l['scenes']:
            if s['n'] not in common.SCENES:
                continue
            jobs.append(dict(
                cls=l['cls'], module=l['module'], module_no=mod_no, module_key=mod_key,
                chapter=l['chapter'], lesson=l['lesson'], slug=l['slug'], scene=s['n'],
                heading=s['heading'], voice=voice, character=who,
                file=f"{l['slug']}-hi-{s['n']:02d}.mp3",
                raw=s['text'], text=common.prepare_text(s['text'])))
            voices[voice] += 1
    assert len({(j['cls'], j['module_no'], j['chapter'], j['scene']) for j in jobs}) == len(jobs)
    assert len({common.out_path(j) for j in jobs}) == len(jobs), 'file names are not unique'
    json.dump(jobs, open(dst, 'w'), ensure_ascii=False, indent=1)
    print(f"{len(jobs)} clips, {sum(len(j['text']) for j in jobs)} characters; voices: {dict(voices)}")


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
