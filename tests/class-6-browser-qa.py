"""Class 6 delivery regression: artwork at both sizes, then the full learner/LMS flow.

Run against disposable localhost with COURSE_QA_GRADE=6 and NODE24 set.
"""
import os
from pathlib import Path
import runpy

os.environ['COURSE_QA_GRADE'] = '6'
directory = Path(__file__).parent
runpy.run_path(str(directory / 'class-6-artwork-browser-qa.py'), run_name='__main__')
runpy.run_path(str(directory / 'course_browser_qa.py'), run_name='__main__')
