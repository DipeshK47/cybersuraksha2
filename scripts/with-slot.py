"""Run a command while holding one of N named slots, so parallel agents queue heavy work (8 GB machine).

  python3 scripts/with-slot.py <name> <slots> -- <command...>
  e.g. python3 scripts/with-slot.py tsc 1 -- npx tsc --noEmit -p .
"""
import fcntl
import pathlib
import subprocess
import sys
import time

name, slots = sys.argv[1], int(sys.argv[2])
command = sys.argv[sys.argv.index('--') + 1:]
lock_dir = pathlib.Path(__file__).resolve().parent.parent / '.story-qa' / 'slots'
lock_dir.mkdir(parents=True, exist_ok=True)
handles = [open(lock_dir / f'{name}-{i}.lock', 'w') for i in range(slots)]
waited = 0
while True:
    for handle in handles:
        try:
            fcntl.flock(handle, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            continue
        if waited:
            print(f'[with-slot] got {name} slot after {waited}s', file=sys.stderr, flush=True)
        sys.exit(subprocess.call(command))
    time.sleep(2)
    waited += 2
