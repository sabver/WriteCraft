'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import enMessages from '../../messages/en.json';
import {
  DEFAULT_LOCALE,
  DEFAULT_TIME_ZONE,
  LOCALE_STORAGE_KEY,
  LOCALES,
  type Locale,
} from '@/i18n/config';
import { detectLocale } from '@/i18n/detect';
import { loadMessages } from '@/i18n/loadMessages';

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
});

export function useLocale(): LocaleContextValue {
  return useContext(LocaleContext);
}

function isValidLocale(value: string | null): value is Locale {
  return LOCALES.includes(value as Locale);
}

function resolveInitialLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
  return isValidLocale(stored) ? stored : detectLocale();
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  // Keep SSR and first CSR render stable (en), then hydrate to persisted/detected locale.
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [messages, setMessages] = useState<Record<string, unknown>>(enMessages as Record<string, unknown>);

  // After mount: resolve locale from localStorage or browser language.
  useEffect(() => {
    const initialLocale = resolveInitialLocale();
    if (initialLocale !== DEFAULT_LOCALE) {
      queueMicrotask(() => {
        setLocaleState(initialLocale);
      });
    }
  }, []);

  // When locale changes: load the matching message file
  useEffect(() => {
    let cancelled = false;
    loadMessages(locale).then((msgs) => {
      if (!cancelled) setMessages(msgs);
    });
    return () => { cancelled = true; };
  }, [locale]);

  function setLocale(newLocale: Locale) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
    }
    setLocaleState(newLocale);
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <NextIntlClientProvider locale={locale} messages={messages} timeZone={DEFAULT_TIME_ZONE}>
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}
