"""Authoring-tool checks; run with the separate narration Python environment."""
from pathlib import Path
import subprocess
import sys
import unittest

ROOT = Path(__file__).resolve().parent.parent


class NarratorGradeBoundaries(unittest.TestCase):
    def test_class9_keeps_default_grade_and_rejects_class10_slug(self):
        result = subprocess.run([sys.executable, str(ROOT / 'scripts/narrate-class9.py'), 'class10-no-synthesis'], capture_output=True, text=True)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('Only Class 9 narration', result.stderr)

    def test_class10_selects_grade_without_using_class9_assets(self):
        script = ROOT / 'scripts/narrate-class10.py'
        self.assertTrue(script.exists(), 'Class 10 authoring entrypoint is required')
        help_result = subprocess.run([sys.executable, str(script), '--help'], capture_output=True, text=True)
        self.assertEqual(help_result.returncode, 0, help_result.stderr)
        self.assertIn('Class 10', help_result.stdout)
        rejected = subprocess.run([sys.executable, str(script), 'class9-no-synthesis'], capture_output=True, text=True)
        self.assertNotEqual(rejected.returncode, 0)
        self.assertIn('Only Class 10 narration', rejected.stderr)


if __name__ == '__main__':
    unittest.main()
