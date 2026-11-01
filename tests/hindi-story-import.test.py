import csv
import importlib.util
import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('importer', Path(__file__).resolve().parents[1] / 'scripts/build-hindi-story-audio.py')
importer = importlib.util.module_from_spec(spec)
spec.loader.exec_module(importer)


class HindiStoryImport(unittest.TestCase):
    def test_index_maps_scene_identity_and_rejects_duplicates_and_path_escape(self):
        with tempfile.TemporaryDirectory() as tmp:
            folder = Path(tmp)
            slug = 'class10-fraud-exam-update'
            (folder / f'{slug}.json').write_text('{}')
            (folder / 'clip.mp3').write_bytes(b'audio')
            index = folder / 'index.csv'
            row = {'chapter_title': f'Exam update ({slug})', 'class': 'class10', 'scene': 'scene01', 'file': 'clip.mp3'}

            def write(rows):
                with index.open('w', newline='', encoding='utf-8-sig') as stream:
                    writer = csv.DictWriter(stream, fieldnames=row.keys())
                    writer.writeheader()
                    writer.writerows(rows)

            with patch.object(importer, 'CHAPTERS', folder):
                write([row])
                self.assertEqual(importer.indexed_clips(index, folder), {(slug, 1): (folder / 'clip.mp3').resolve()})
                write([row, row])
                with self.assertRaisesRegex(ValueError, 'Duplicate clip'):
                    importer.indexed_clips(index, folder)
                write([{**row, 'file': '../clip.mp3'}])
                with self.assertRaisesRegex(ValueError, 'Invalid clip'):
                    importer.indexed_clips(index, folder)

    def test_partial_lesson_keeps_all_six_cues_and_original_english_for_missing_scenes(self):
        with tempfile.TemporaryDirectory() as tmp:
            folder = Path(tmp)
            slug = 'lesson'
            (folder / slug).mkdir()
            scenes = [{'start': n * 3, 'duration': 2} for n in range(6)]
            (folder / f'{slug}.json').write_text(json.dumps({'scenes': scenes}))
            clip = folder / 'scene01.mp3'
            decode = lambda path, *args: b'\0\0' * importer.RATE * (1 if path == clip else 2)
            with (patch.object(importer, 'CHAPTERS', folder), patch.object(importer, 'AUDIO', folder),
                  patch.object(importer, 'decode', side_effect=decode) as decoder,
                  patch.object(importer.subprocess, 'run'), patch.object(importer, 'duration', return_value=14.9)):
                entry, fallback = importer.build(slug, {(slug, 1): clip}, 'english', allow_partial=True)
                self.assertTrue(fallback)
                self.assertEqual(entry['englishScenes'], [2, 3, 4, 5, 6])
                self.assertEqual(len(entry['scenes']), 6)
                self.assertEqual(entry['scenes'][1], {'start': 1.65, 'duration': 2.0})
                self.assertEqual(entry['duration'], 14.9)
                self.assertEqual(decoder.call_args_list[1].args, (folder / slug / 'story.mp3', 3, 2))
                with self.assertRaisesRegex(SystemExit, 'no clip for scene 2'):
                    importer.build(slug, {(slug, 1): clip}, 'english')


if __name__ == '__main__':
    unittest.main()
