"""Class 6 entrypoint for the existing measured Indian English narrator."""
import asyncio
from pathlib import Path
import runpy

if __name__ == '__main__':
    engine = runpy.run_path(str(Path(__file__).with_name('narrate-class9.py')))
    asyncio.run(engine['main'](grade=6))
