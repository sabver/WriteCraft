'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { LOCALES, LOCALE_LABELS } from '@/i18n/config';
import { useLocale } from '@/contexts/LocaleContext';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <div aria-label="Language" className="flex items-center gap-2 px-3 py-2">
      <Globe className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
      <div className="flex rounded-lg border border-slate-200 overflow-hidden">
        {LOCALES.map((loc) => (
          <button
            key={loc}
            type="button"
            onClick={() => setLocale(loc)}
            className={cn(
              'px-2.5 py-1 text-xs font-semibold transition-colors',
              locale === loc
                ? 'bg-primary text-white'
                : 'text-slate-500 hover:bg-slate-50'
            )}
            aria-pressed={locale === loc}
          >
            {LOCALE_LABELS[loc]}
          </button>
        ))}
      </div>
    </div>
  );
}
