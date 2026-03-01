'use client';

import React, { useSyncExternalStore } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

// Returns false on the server and on the initial client render, true after hydration.
// useSyncExternalStore is the React 18+ blessed way to read client-only state
// without triggering hydration mismatches.
function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

type ThemeOption = 'light' | 'dark';

function resolveActiveTheme(theme: string | undefined, resolvedTheme: string | undefined): ThemeOption {
  if (theme === 'dark' || theme === 'light') return theme;
  if (resolvedTheme === 'dark' || resolvedTheme === 'light') return resolvedTheme;
  return 'light';
}

export function ThemeSwitcher() {
  const t = useTranslations('themeSwitcher');
  const { theme, resolvedTheme, setTheme } = useTheme();
  const isClient = useIsClient();
  // Before hydration completes, isClient is false so activeTheme is undefined
  // and both buttons render in their inactive state — matching SSR HTML exactly.
  const activeTheme = isClient ? resolveActiveTheme(theme, resolvedTheme) : undefined;

  return (
    <div aria-label={t('label')} className="flex items-center gap-2 px-3 py-2">
      <Sun className="h-4 w-4 text-amber-500 shrink-0 dark:hidden" aria-hidden="true" />
      <Moon className="hidden h-4 w-4 text-slate-400 shrink-0 dark:block" aria-hidden="true" />
      <div className="flex overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
        <button
          type="button"
          onClick={() => setTheme('light')}
          className={cn(
            'px-2.5 py-1 text-xs font-semibold transition-colors',
            activeTheme === 'light'
              ? 'bg-primary text-white'
              : 'text-slate-500 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
          )}
          aria-pressed={activeTheme === 'light'}
        >
          {t('light')}
        </button>
        <button
          type="button"
          onClick={() => setTheme('dark')}
          className={cn(
            'px-2.5 py-1 text-xs font-semibold transition-colors',
            activeTheme === 'dark'
              ? 'bg-primary text-white'
              : 'text-slate-500 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
          )}
          aria-pressed={activeTheme === 'dark'}
        >
          {t('dark')}
        </button>
      </div>
    </div>
  );
}
