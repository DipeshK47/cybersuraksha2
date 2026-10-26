import json
from pathlib import Path
import sys
import unittest

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'scripts'))
from hindi_style import conversational_hindi, preserved


class HindiStyleTests(unittest.TestCase):
    def test_technical_terms_and_devanagari_word_boundaries(self):
        self.assertEqual(conversational_hindi('Asset distribution', 'संपत्ति का वितरण'), 'एसेट का डिस्ट्रिब्यूशन')
        self.assertEqual(conversational_hindi('Assets', 'संपत्तियों'), 'एसेट्स')
        self.assertEqual(conversational_hindi('Classes', 'कक्षाएँ'), 'क्लासेज़')
        self.assertEqual(conversational_hindi('Asset', 'संपत्तिवाला'), 'संपत्तिवाला')

    def test_source_context_keeps_different_concepts_distinct(self):
        self.assertEqual(conversational_hindi('Privacy', 'गोपनीयता'), 'प्राइवेसी')
        self.assertEqual(conversational_hindi('Confidentiality', 'गोपनीयता'), 'कॉन्फिडेंशियलिटी')
        self.assertEqual(conversational_hindi('Property', 'संपत्ति'), 'संपत्ति')
        self.assertEqual(conversational_hindi('Unknown caller', 'अज्ञात कॉलर'), 'अनजान कॉलर')
        self.assertEqual(conversational_hindi('The caller makes threats', 'कॉलर धमकियाँ देता है'), 'कॉलर धमकियाँ देता है')

    def test_entire_shipped_catalogue_is_stable_and_preserves_slots_and_numbers(self):
        catalogue = json.loads((ROOT / 'public/locales/hi.json').read_text())
        overrides = json.loads((ROOT / 'app/lib/i18n/hi-overrides.json').read_text())
        for source, translation in {**catalogue['messages'], **overrides}.items():
            self.assertTrue(preserved(source, translation), source)
            self.assertEqual(conversational_hindi(source, translation), translation, source)
        for template in catalogue['templates']:
            self.assertEqual(template['translation'], catalogue['messages'][template['source']])


if __name__ == '__main__':
    unittest.main()
