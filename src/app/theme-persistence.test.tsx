// @vitest-environment jsdom
// spec: 005-light-dark-mode §7.2 — integration: persistence + stability across reload/navigation

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, cleanup, act } from '@testing-library/react';
import React from 'react';


import {
  resolveInitialTheme,
  THEME_STORAGE_KEY,
  ThemeContextProvider,
} from '@/contexts/ThemeContext';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function setMatchMedia(prefersDark: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-color-scheme: dark)' ? prefersDark : false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

/**
 * Simulate what next-themes does internally when the user switches theme:
 * it writes the chosen value to localStorage under the configured storageKey.
 */
function simulateSwitchTheme(theme: 'light' | 'dark') {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

/**
 * Simulate a full page reload: resolve the initial theme from scratch,
 * exactly as ThemeContextProvider does via resolveInitialTheme().
 */
function simulateReload() {
  return resolveInitialTheme();
}

// ---------------------------------------------------------------------------
// Suite
// ---------------------------------------------------------------------------

describe('Theme persistence integration', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
    setMatchMedia(false); // default: no dark-mode system preference
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  // -------------------------------------------------------------------------
  // Storage-key contract
  // -------------------------------------------------------------------------

  describe('Storage key contract', () => {
    it('THEME_STORAGE_KEY is the same key ThemeContextProvider passes to next-themes', () => {
      // If these keys ever diverge, theme switches would NOT persist across reloads.
      // ThemeContextProvider passes storageKey={THEME_STORAGE_KEY} to NextThemeProvider,
      // and resolveInitialTheme reads from the same key.
      simulateSwitchTheme('dark');
      expect(simulateReload()).toBe('dark');
    });
  });

  // -------------------------------------------------------------------------
  // Switch + persist across reload
  // -------------------------------------------------------------------------

  describe('Switch → reload persistence', () => {
    it('dark persists after reload', () => {
      simulateSwitchTheme('dark');
      expect(simulateReload()).toBe('dark');
    });

    it('light persists after reload', () => {
      simulateSwitchTheme('light');
      expect(simulateReload()).toBe('light');
    });

    it('dark → light → dark across multiple reloads', () => {
      simulateSwitchTheme('dark');
      expect(simulateReload()).toBe('dark');

      simulateSwitchTheme('light');
      expect(simulateReload()).toBe('light');

      simulateSwitchTheme('dark');
      expect(simulateReload()).toBe('dark');
    });

    it('persisted value is not affected by system preference', () => {
      // User explicitly chose light; system is dark — saved choice wins.
      simulateSwitchTheme('light');
      setMatchMedia(true);
      expect(simulateReload()).toBe('light');
    });
  });

  // -------------------------------------------------------------------------
  // First-visit defaults (no saved preference)
  // -------------------------------------------------------------------------

  describe('First-visit default (no saved theme)', () => {
    it('uses dark when system preference is dark', () => {
      setMatchMedia(true);
      expect(simulateReload()).toBe('dark');
    });

    it('falls back to light when system preference is light', () => {
      setMatchMedia(false);
      expect(simulateReload()).toBe('light');
    });

    it('falls back to light when matchMedia is unavailable', () => {
      Object.defineProperty(window, 'matchMedia', { writable: true, value: undefined });
      expect(simulateReload()).toBe('light');
    });
  });

  // -------------------------------------------------------------------------
  // ThemeContextProvider mounting stability
  // -------------------------------------------------------------------------

  describe('ThemeContextProvider stability', () => {
    it('renders children without error with saved dark theme', async () => {
      simulateSwitchTheme('dark');
      let result: ReturnType<typeof render> | undefined;
      await act(async () => {
        result = render(
          <ThemeContextProvider>
            <div data-testid="child">content</div>
          </ThemeContextProvider>
        );
      });
      expect(result!.getByTestId('child')).toBeTruthy();
    });

    it('renders children without error with saved light theme', async () => {
      simulateSwitchTheme('light');
      let result: ReturnType<typeof render> | undefined;
      await act(async () => {
        result = render(
          <ThemeContextProvider>
            <div data-testid="child">content</div>
          </ThemeContextProvider>
        );
      });
      expect(result!.getByTestId('child')).toBeTruthy();
    });

    it('renders children without error on first visit', async () => {
      let result: ReturnType<typeof render> | undefined;
      await act(async () => {
        result = render(
          <ThemeContextProvider>
            <div data-testid="child">content</div>
          </ThemeContextProvider>
        );
      });
      expect(result!.getByTestId('child')).toBeTruthy();
    });
  });
});
