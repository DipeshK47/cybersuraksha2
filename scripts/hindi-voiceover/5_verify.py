"""Check every scene has one unique, readable MP3 and write index.csv. Usage: python 5_verify.py jobs.json OUT"""
import csv, hashlib, json, os, subprocess, sys
import common


def duration(p):
    r = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p],
                       capture_output=True, text=True)
    try:
        return float(r.stdout.strip())
    except ValueError:
        return 0.0


def main():
    jobs = json.load(open(sys.argv[1])); out = sys.argv[2]
    missing, seen, dup, short, rows = [], {}, [], [], []
    for j in jobs:
        rel = common.out_path(j); p = os.path.join(out, rel)
        if not os.path.exists(p) or os.path.getsize(p) < 1000:
            missing.append(rel); continue
        h = hashlib.md5(open(p, 'rb').read()).hexdigest()
        if h in seen:
            dup.append((rel, seen[h]))
        seen[h] = rel
        d = duration(p)
        if d < 1.5:
            short.append(rel)
        rows.append([rel, j['cls'], j['module'], j['chapter'], j['lesson'], j['scene'],
                     j['voice'], round(d, 1), len(j['text'])])
    with open(os.path.join(out, 'index.csv'), 'w', newline='', encoding='utf-8') as f:
        w = csv.writer(f)
        w.writerow(['file', 'class', 'module', 'chapter', 'lesson', 'scene', 'voice', 'seconds', 'characters'])
        w.writerows(rows)
    print(f'{len(jobs)} expected, missing {len(missing)}, duplicate audio {len(dup)}, too short {len(short)}')
    for m in missing[:10]: print('  missing', m)
    sys.exit(1 if missing or dup or short else 0)


if __name__ == '__main__':
    main()
