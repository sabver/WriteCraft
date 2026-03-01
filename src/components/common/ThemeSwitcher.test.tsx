// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, cleanup, fireEvent } from '@testing-library/react';
import React from 'react';

const mockSetTheme = vi.fn();

vi.mock('next-intl', () => ({
  useTranslations: vi.fn(() => (key: string) => {
    if (key === 'label') return 'Theme';
    if (key === 'light') return 'Light';
    if (key === 'dark') return 'Dark';
    return key;
  }),
}));

vi.mock('next-themes', () => ({
  useTheme: vi.fn(),
}));

import { useTheme } from 'next-themes';
import { ThemeSwitcher } from './ThemeSwitcher';

const mockUseTheme = vi.mocked(useTheme);

describe('ThemeSwitcher', () => {
  beforeEach(() => {
    mockSetTheme.mockClear();
    mockUseTheme.mockReturnValue({
      theme: 'light',
      resolvedTheme: 'light',
      setTheme: mockSetTheme,
    } as never);
  });

  afterEach(() => {
    cleanup();
  });

  it('renders an accessible label for the theme control', () => {
    const { getByLabelText } = render(<ThemeSwitcher />);
    expect(getByLabelText(/theme/i)).toBeTruthy();
  });

  it('renders options for Light and Dark', () => {
    const { getByRole } = render(<ThemeSwitcher />);
    expect(getByRole('button', { name: 'Light' })).toBeTruthy();
    expect(getByRole('button', { name: 'Dark' })).toBeTruthy();
  });

  it('reflects the active theme via aria-pressed state', () => {
    mockUseTheme.mockReturnValue({
      theme: 'dark',
      resolvedTheme: 'dark',
      setTheme: mockSetTheme,
    } as never);

    const { getByRole } = render(<ThemeSwitcher />);
    expect(getByRole('button', { name: 'Dark' }).getAttribute('aria-pressed')).toBe('true');
    expect(getByRole('button', { name: 'Light' }).getAttribute('aria-pressed')).toBe('false');
  });

  it('clicking Light or Dark triggers setTheme callback', () => {
    const { getByRole } = render(<ThemeSwitcher />);

    fireEvent.click(getByRole('button', { name: 'Dark' }));
    expect(mockSetTheme).toHaveBeenCalledWith('dark');

    fireEvent.click(getByRole('button', { name: 'Light' }));
    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });
});
