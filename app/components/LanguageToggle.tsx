"use client";

import { Languages } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createHindiTranslator, type HindiCatalogue } from '../lib/i18n/translate';
import { createPageLocalizer } from '../lib/i18n/localize-dom';
import { readJson } from '../lib/read-json';
import overrides from '../lib/i18n/hi-overrides.json';
import styles from './language-toggle.module.css';

export const LANGUAGE_KEY = 'cybersuraksha-language';

export function LanguageToggle() {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const localizer = useRef<ReturnType<typeof createPageLocalizer> | null>(null);
  const loading = useRef<Promise<void> | null>(null);
  const requestId = useRef(0);

  async function choose(next: 'en' | 'hi') {
    const request = ++requestId.current;
    setError('');
    if (next === 'hi' && !localizer.current) {
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
    localizer.current?.setLanguage(next);
    setLanguage(next); setBusy(false);
    try { localStorage.setItem(LANGUAGE_KEY, next); } catch { /* Private browsing still supports the current page. */ }
  }

  useEffect(() => {
    let saved: string | null = null;
    try { saved = localStorage.getItem(LANGUAGE_KEY); } catch { /* Use English when storage is unavailable. */ }
    const restore = saved === 'hi' ? window.setTimeout(() => void choose('hi'), 0) : undefined;
    function sync(event: StorageEvent) { if (event.key === LANGUAGE_KEY) void choose(event.newValue === 'hi' ? 'hi' : 'en'); }
    window.addEventListener('storage', sync);
    const controller = localizer;
    const requests = requestId;
    return () => { window.clearTimeout(restore); requests.current++; window.removeEventListener('storage', sync); controller.current?.dispose(); };
  }, []);

  return <div className={styles.bar} translate="no" data-no-translate>
    <div className={styles.control} role="group" aria-label="Website language / वेबसाइट की भाषा" aria-busy={busy}>
      <span className={styles.label}><Languages aria-hidden="true" />Language / भाषा</span>
      <div className={styles.options}>
        <button type="button" lang="en" aria-pressed={language === 'en'} disabled={busy} onClick={() => void choose('en')}>English</button>
        <button type="button" lang="hi" aria-pressed={language === 'hi'} disabled={busy} onClick={() => void choose('hi')}>हिन्दी</button>
      </div>
    </div>
    <span className={styles.status} role="status">{error || (busy ? 'हिन्दी लोड हो रही है…' : '')}</span>
  </div>;
}
