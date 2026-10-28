"""Authenticated Class 9 browser regression. Use a disposable localhost server.

BASE_URL=http://localhost:3218 /tmp/csr-narration.udxGU1/venv/bin/python tests/class-9-browser-qa.py
"""
import os
from pathlib import Path
import runpy

os.environ["COURSE_QA_GRADE"] = "9"
runpy.run_path(str(Path(__file__).with_name("course_browser_qa.py")),run_name="__main__")
