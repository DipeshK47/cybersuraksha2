/** The language control sets text and narration together, or splits them. */
export type LanguageMode = 'en' | 'hi' | 'en-hi-audio';
export const LANGUAGE_KEY = 'cybersuraksha-language';
/** 'hi' keeps Hindi narration while the text stays English. Absent: narration follows the text language. */
export const AUDIO_LANGUAGE_KEY = 'cybersuraksha-audio-language';

/** Text language shown for a mode (what the page localizer applies). */
export const textLanguageOf = (mode: LanguageMode): 'en' | 'hi' => mode === 'hi' ? 'hi' : 'en';
/** Narration language for a mode. */
export const audioLanguageOf = (mode: LanguageMode): 'en' | 'hi' => mode === 'en' ? 'en' : 'hi';
/** Rebuild the mode from the two saved values. */
export const modeFrom = (language: string | null, audio: string | null): LanguageMode =>
  language === 'hi' ? 'hi' : audio === 'hi' ? 'en-hi-audio' : 'en';
/** Narration language read from <html data-audio-language lang>; the audio attribute wins when present. */
export const narrationLanguage = (audioAttribute: string | undefined, pageLanguage: string): 'en' | 'hi' =>
  (audioAttribute || pageLanguage) === 'hi' ? 'hi' : 'en';
