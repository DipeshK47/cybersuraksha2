"use client";

import { Languages } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createHindiTranslator, type HindiCatalogue } from '../lib/i18n/translate';
import { createPageLocalizer } from '../lib/i18n/localize-dom';
import { readJson } from '../lib/read-json';
import overrides from '../lib/i18n/hi-overrides.json';
import { AUDIO_LANGUAGE_KEY, LANGUAGE_KEY, audioLanguageOf, modeFrom, textLanguageOf, type LanguageMode } from '../lib/i18n/language-mode';
import styles from './language-toggle.module.css';

export { LANGUAGE_KEY };

/** English and हिन्दी change text and narration together; English + हिन्दी ऑडियो splits them. */
function readStoredMode(): LanguageMode {
  try { return modeFrom(localStorage.getItem(LANGUAGE_KEY), localStorage.getItem(AUDIO_LANGUAGE_KEY)); }
  catch { return 'en'; } // Use English when storage is unavailable.
}

export function LanguageToggle() {
  const [mode, setMode] = useState<LanguageMode>('en');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const localizer = useRef<ReturnType<typeof createPageLocalizer> | null>(null);
  const loading = useRef<Promise<void> | null>(null);
  const requestId = useRef(0);

  async function choose(next: LanguageMode) {
    const request = ++requestId.current;
    const text = textLanguageOf(next);
    setError('');
    if (text === 'hi' && !localizer.current) {
      setBusy(true);
      loading.current ??= fetch('/locales/hi.json').then(async response => {
        if (!response.ok) throw new Error('Hindi catalogue unavailable');
        const catalogue = await readJson<HindiCatalogue & { error?: string }>(response);
        if (!catalogue.messages || !Array.isArray(catalogue.templates)) throw new Error('Invalid Hindi catalogue');
        localizer.current = createPageLocalizer(createHindiTranslator(catalogue, overrides));
      });
      try { await loading.current; }
      catch {
        if (request !== requestId.current) return;
        loading.current = null; setBusy(false);
        setError('हिन्दी लोड नहीं हुई। फिर से हिन्दी चुनें।'); return;
      }
    }
    if (request !== requestId.current) return;
    localizer.current?.setLanguage(text);
    // Story narration reads this attribute, so it can differ from the text language (lang).
    document.documentElement.dataset.audioLanguage = audioLanguageOf(next);
    setMode(next); setBusy(false);
    try {
      // Audio first, so another tab that reacts to the language key already sees the full choice.
      if (next === 'en-hi-audio') localStorage.setItem(AUDIO_LANGUAGE_KEY, 'hi'); else localStorage.removeItem(AUDIO_LANGUAGE_KEY);
      localStorage.setItem(LANGUAGE_KEY, text);
    } catch { /* Private browsing still supports the current page. */ }
  }

  useEffect(() => {
    const saved = readStoredMode();
    const restore = saved !== 'en' ? window.setTimeout(() => void choose(saved), 0) : undefined;
    function sync(event: StorageEvent) { if (event.key === LANGUAGE_KEY || event.key === AUDIO_LANGUAGE_KEY) void choose(readStoredMode()); }
    window.addEventListener('storage', sync);
    const controller = localizer;
    const requests = requestId;
    return () => { window.clearTimeout(restore); requests.current++; window.removeEventListener('storage', sync); controller.current?.dispose(); };
  }, []);

  return <div className={styles.bar} translate="no" data-no-translate>
    <div className={styles.control} role="group" aria-label="Website language / वेबसाइट की भाषा" aria-busy={busy}>
      <span className={styles.label}><Languages aria-hidden="true" />Language / भाषा</span>
      <div className={styles.options}>
        <button type="button" lang="en" aria-pressed={mode === 'en'} disabled={busy} onClick={() => void choose('en')}>English</button>
        <button type="button" lang="hi" aria-pressed={mode === 'hi'} disabled={busy} onClick={() => void choose('hi')}>हिन्दी</button>
        <button type="button" className={styles.split} aria-label="English + हिन्दी ऑडियो, English text with Hindi audio" title="English text, Hindi audio / अंग्रेज़ी टेक्स्ट, हिन्दी ऑडियो" aria-pressed={mode === 'en-hi-audio'} disabled={busy} onClick={() => void choose('en-hi-audio')}>English + हिन्दी ऑडियो</button>
      </div>
    </div>
    <span className={styles.status} role="status">{error || (busy ? 'हिन्दी लोड हो रही है…' : '')}</span>
  </div>;
}
