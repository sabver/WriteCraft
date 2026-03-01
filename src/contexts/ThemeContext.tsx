'use client';

import React, { type ReactNode } from 'react';
import { ThemeProvider as NextThemeProvider } from 'next-themes';

export type AppTheme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'writecraft-theme';

function isAppTheme(value: string | null): value is AppTheme {
  return value === 'light' || value === 'dark';
}

export function resolveInitialTheme(): AppTheme {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (isAppTheme(storedTheme)) {
    return storedTheme;
  }

  if (typeof window.matchMedia === 'function') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  return 'light';
}

export function ThemeContextProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme={resolveInitialTheme()}
      enableSystem
      storageKey={THEME_STORAGE_KEY}
      themes={['light', 'dark']}
      disableTransitionOnChange
    >
      {children}
    </NextThemeProvider>
  );
}
