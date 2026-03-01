// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, cleanup, fireEvent } from '@testing-library/react';
import React from 'react';

// Mock useLocale so LanguageSwitcher can be tested in isolation
const mockSetLocale = vi.fn();
vi.mock('@/contexts/LocaleContext', () => ({
  useLocale: vi.fn(() => ({ locale: 'en', setLocale: mockSetLocale })),
}));

import { LanguageSwitcher } from './LanguageSwitcher';
import { useLocale } from '@/contexts/LocaleContext';
const mockUseLocale = vi.mocked(useLocale);

describe('LanguageSwitcher', () => {
  afterEach(() => {
    cleanup();
    mockSetLocale.mockClear();
  });

  it('renders with an accessible label containing "Language"', () => {
    const { getByRole, queryByLabelText } = render(<LanguageSwitcher />);
    // Either a combobox with accessible name, or a labelled element
    const hasAriaLabel =
      queryByLabelText(/language/i) !== null ||
      getByRole('combobox', { hidden: true }) !== null ||
      document.querySelector('[aria-label*="Language"], [title*="Language"]') !== null;
    expect(hasAriaLabel).toBe(true);
  });

  it('renders the English option', () => {
    const { getByText } = render(<LanguageSwitcher />);
    expect(getByText('English')).toBeTruthy();
  });

  it('renders the Chinese option', () => {
    const { getByText } = render(<LanguageSwitcher />);
    expect(getByText('中文 (简体)')).toBeTruthy();
  });

  it('reflects the current locale — shows active locale label', () => {
    mockUseLocale.mockReturnValue({ locale: 'zh-CN', setLocale: mockSetLocale });
    const { getByText } = render(<LanguageSwitcher />);
    // When locale is zh-CN, the selected/displayed value should be the Chinese label
    expect(getByText('中文 (简体)')).toBeTruthy();
  });

  it('calls setLocale with zh-CN when Chinese option is selected', () => {
    mockUseLocale.mockReturnValue({ locale: 'en', setLocale: mockSetLocale });
    const { getAllByText } = render(<LanguageSwitcher />);
    const zhOption = getAllByText('中文 (简体)')[0];
    fireEvent.click(zhOption);
    expect(mockSetLocale).toHaveBeenCalledWith('zh-CN');
  });
});
