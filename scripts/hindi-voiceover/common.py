"""Shared settings for the CyberShiksha Hindi/Hinglish voiceover maker.

Everything you might want to change (voices, model, settings, naming) lives here.
The API key is read from the ELEVENLABS_API_KEY environment variable and is never printed.
"""
import os, re, sys

API = 'https://api.elevenlabs.io'
MODEL_ID = os.environ.get('ELEVENLABS_MODEL', 'eleven_v4')
OUTPUT_FORMAT = 'mp3_44100_128'
VOICE_SETTINGS = {'stability': 0.5, 'similarity_boost': 0.75, 'speed': 1.0}

# voice key -> name as it appears in ElevenLabs "My Voices"
VOICE_NAMES = {'aj': 'AJ - Hindi', 'pari': 'Pari M - Relatable Hindi Friend'}
DEFAULT_VOICE = 'aj'            # lessons that name no character

# The first character named in a lesson's narration decides that lesson's voice.
CHARACTERS = {'मीरा': 'pari', 'तारा': 'pari', 'रेवा': 'pari', 'अदिति': 'pari',
              'कबीर': 'aj', 'नील': 'aj', 'निखिल': 'aj', 'विहान': 'aj'}

# Scenes to voice. Scene 06 of every lesson is the Practice Lab intro, so it is skipped.
SCENES = (1, 2, 3, 4, 5)

MODULES = {'CYBERSECURITY': (1, 'cybersecurity'), 'ARTIFICIAL INTELLIGENCE': (2, 'ai'),
           'COMPUTATIONAL THINKING': (3, 'ct'), 'CYBER FRAUD': (4, 'fraud')}

# Pronunciation table from the PDF (page 3). Acronyms are matched case-sensitively.
ACRONYMS = {'AI': 'ए, आई', 'OTP': 'ओ, टी, पी', 'QR': 'क्यू, आर', 'UPI': 'यू, पी, आई',
            'HTTPS': 'एच, टी, टी, पी, एस', 'TP': 'टी पी', 'FP': 'एफ़ पी', 'FN': 'एफ़ एन',
            'TN': 'टी एन', 'F1': 'एफ़ वन', 'AND': 'ऐंड', 'OR': 'ओ आर'}
WORDS = {'password': 'पासवर्ड', 'login': 'लॉगिन', 'backup': 'बैकअप', 'restore': 'रिस्टोर',
         'model': 'मॉडल', 'dataset': 'डेटासेट', 'training': 'ट्रेनिंग', 'validation': 'वैलिडेशन',
         'feature': 'फ़ीचर', 'threshold': 'थ्रेशोल्ड', 'precision': 'प्रिसिज़न', 'recall': 'रिकॉल',
         'mean': 'मीन', 'median': 'मीडियन', 'range': 'रेंज', 'denominator': 'डिनॉमिनेटर',
         'queue': 'क्यू', 'dictionary': 'डिक्शनरी', 'key': 'की',
         'permission': 'परमिशन', 'privacy': 'प्राइवेसी'}
DIGITS = {'0': 'शून्य', '1': 'एक', '2': 'दो', '3': 'तीन', '4': 'चार',
          '5': 'पाँच', '6': 'छह', '7': 'सात', '8': 'आठ', '9': 'नौ'}

_B = r'(?<![A-Za-z0-9])%s(?![A-Za-z0-9])'


def prepare_text(t):
    """Text actually sent to ElevenLabs (the PDF text plus the PDF's own pronunciation table)."""
    for k, v in ACRONYMS.items():
        t = re.sub(_B % re.escape(k), v, t)
    for k, v in WORDS.items():
        t = re.sub(_B % re.escape(k), v, t, flags=re.I)
    # binary strings are read digit by digit, keeping leading zeros
    t = re.sub(r'(?<![0-9A-Za-z])[01]{3,}(?![0-9A-Za-z])',
               lambda m: ', '.join(DIGITS[c] for c in m.group()), t)
    return re.sub(r'\s+', ' ', t).strip()


def api_key():
    k = os.environ.get('ELEVENLABS_API_KEY', '').strip()
    if not k:
        sys.exit('ELEVENLABS_API_KEY is not set')
    return k


def headers():
    return {'xi-api-key': api_key()}


def out_path(job):
    """OUT/class6/m1-cybersecurity/ch01/class6-private-information-hi-01.mp3"""
    return os.path.join(f"class{job['cls']}", f"m{job['module_no']}-{job['module_key']}",
                        f"ch{job['chapter']:02d}", job['file'])
