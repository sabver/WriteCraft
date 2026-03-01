// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { resolveInitialTheme, THEME_STORAGE_KEY } from './ThemeContext';

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

describe('ThemeContext bootstrap resolution', () => {
  beforeEach(() => {
    localStorage.clear();
    setMatchMedia(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('restores dark when saved writecraft-theme is dark', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    expect(resolveInitialTheme()).toBe('dark');
  });

  it('restores light when saved writecraft-theme is light', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'light');
    expect(resolveInitialTheme()).toBe('light');
  });

  it('falls back to baseline when saved value is invalid', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'invalid');
    expect(resolveInitialTheme()).toBe('light');
  });

  it('follows system preference on first visit, then falls back to light if unavailable', () => {
    localStorage.removeItem(THEME_STORAGE_KEY);

    setMatchMedia(true);
    expect(resolveInitialTheme()).toBe('dark');

    // Simulate environments where system preference cannot be detected.
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: undefined,
    });
    expect(resolveInitialTheme()).toBe('light');
  });
});
