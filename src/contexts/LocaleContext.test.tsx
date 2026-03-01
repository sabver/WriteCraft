// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, act, cleanup, waitFor } from '@testing-library/react';
import React from 'react';

// Mock both async dependencies so no real I/O happens in tests
vi.mock('@/i18n/detect', () => ({ detectLocale: vi.fn(() => 'en') }));
vi.mock('@/i18n/loadMessages', () => ({
  loadMessages: vi.fn().mockResolvedValue({ nav: { dashboard: 'Dashboard' } }),
}));

import { LocaleProvider, useLocale } from './LocaleContext';
import { detectLocale } from '@/i18n/detect';

const mockDetect = vi.mocked(detectLocale);
const STORAGE_KEY = 'writecraft-locale';

function Consumer() {
  const { locale, setLocale } = useLocale();
  return (
    <div>
      <span data-testid="locale">{locale}</span>
      <button onClick={() => setLocale('zh-CN')} data-testid="set-zh">set zh-CN</button>
      <button onClick={() => setLocale('en')} data-testid="set-en">set en</button>
    </div>
  );
}

function renderProvider() {
  return render(
    <LocaleProvider>
      <Consumer />
    </LocaleProvider>
  );
}

describe('LocaleContext', () => {
  beforeEach(() => {
    localStorage.clear();
    mockDetect.mockReturnValue('en');
  });

  afterEach(() => {
    cleanup();
  });

  it('defaults to en when detectLocale returns en and no stored preference', () => {
    mockDetect.mockReturnValue('en');
    const { getByTestId } = renderProvider();
    expect(getByTestId('locale').textContent).toBe('en');
  });

  it('defaults to zh-CN when detectLocale returns zh-CN and no stored preference', async () => {
    mockDetect.mockReturnValue('zh-CN');
    const { getByTestId } = renderProvider();
    await waitFor(() => {
      expect(getByTestId('locale').textContent).toBe('zh-CN');
    });
  });

  it('uses stored localStorage value over detectLocale result', async () => {
    localStorage.setItem(STORAGE_KEY, 'zh-CN');
    mockDetect.mockReturnValue('en'); // navigator says en, localStorage overrides
    const { getByTestId } = renderProvider();
    await waitFor(() => {
      expect(getByTestId('locale').textContent).toBe('zh-CN');
    });
  });

  it('setLocale updates locale state', async () => {
    const { getByTestId } = renderProvider();
    await act(async () => {
      getByTestId('set-zh').click();
    });
    expect(getByTestId('locale').textContent).toBe('zh-CN');
  });

  it('setLocale writes to localStorage', async () => {
    const { getByTestId } = renderProvider();
    await act(async () => {
      getByTestId('set-zh').click();
    });
    expect(localStorage.getItem(STORAGE_KEY)).toBe('zh-CN');
  });

  it('setLocale back to en writes en to localStorage', async () => {
    localStorage.setItem(STORAGE_KEY, 'zh-CN');
    mockDetect.mockReturnValue('zh-CN');
    const { getByTestId } = renderProvider();
    await act(async () => {
      getByTestId('set-en').click();
    });
    expect(localStorage.getItem(STORAGE_KEY)).toBe('en');
  });
});
