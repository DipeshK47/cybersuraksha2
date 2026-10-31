"""Generate one MP3 per scene. Usage: python 4_generate.py jobs.json OUT [--only N[,N...]]

Existing files are skipped, so a stopped run continues where it left off.
"""
import json, os, sys, time
import requests
import common


def voice_ids():
    r = requests.get(f'{common.API}/v1/voices', headers=common.headers(), timeout=30)
    r.raise_for_status()
    mine = {v['name']: v['voice_id'] for v in r.json()['voices']}
    out = {}
    for key, name in common.VOICE_NAMES.items():
        hit = common.find_voice(mine, name)
        if not hit:
            sys.exit(f'Voice "{name}" is not in My Voices')
        out[key] = hit[1]
    return out


def synth(vid, text):
    body = {'text': text, 'model_id': common.MODEL_ID, 'voice_settings': common.VOICE_SETTINGS}
    for attempt in range(4):
        try:
            r = requests.post(f'{common.API}/v1/text-to-speech/{vid}',
                              params={'output_format': common.OUTPUT_FORMAT},
                              headers={**common.headers(), 'Accept': 'audio/mpeg'}, json=body, timeout=120)
        except requests.RequestException:
            r = None
        if r is not None and r.ok:
            return r
        if r is not None and r.status_code in (401, 402, 403, 422, 429) and attempt >= 0:
            if r.status_code != 429 or attempt >= 2:
                sys.exit(f'STOPPED HTTP {r.status_code}: {r.text[:300]}')
        time.sleep(2 ** (attempt + 1))
    sys.exit('STOPPED: repeated server/network errors')


def main():
    jobs = json.load(open(sys.argv[1])); out = sys.argv[2]
    only = None
    if '--only' in sys.argv:
        only = {int(x) for x in sys.argv[sys.argv.index('--only') + 1].split(',')}
    ids, made, credits = voice_ids(), 0, 0
    for i, j in enumerate(jobs):
        if only is not None and i not in only:
            continue
        path = os.path.join(out, common.out_path(j))
        if os.path.exists(path) and os.path.getsize(path) > 1000:
            continue
        r = synth(ids[j['voice']], j['text'])
        os.makedirs(os.path.dirname(path), exist_ok=True)
        tmp = path + '.part'
        open(tmp, 'wb').write(r.content); os.replace(tmp, path)
        c = int(r.headers.get('x-character-count', len(j['text'])))
        made += 1; credits += c
        print(f"[{i + 1}/{len(jobs)}] saved {common.out_path(j)} ({c} characters)", flush=True)
    print(f'DONE made={made} characters={credits} (about {round(credits*0.4)} credits)')


if __name__ == '__main__':
    main()
