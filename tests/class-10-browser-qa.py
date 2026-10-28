"""Authenticated Class 10 browser regression on a disposable localhost server."""
import os
from pathlib import Path
import runpy

os.environ['COURSE_QA_GRADE']='10'
runpy.run_path(str(Path(__file__).with_name('course_browser_qa.py')),run_name='__main__')
