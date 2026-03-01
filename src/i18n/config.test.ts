import { describe, it, expect } from 'vitest';
import { LOCALES, DEFAULT_LOCALE, LOCALE_LABELS, LOCALE_STORAGE_KEY } from './config';

describe('i18n config', () => {
  it('LOCALES contains en', () => {
    expect(LOCALES).toContain('en');
  });

  it('LOCALES contains zh-CN', () => {
    expect(LOCALES).toContain('zh-CN');
  });

  it('DEFAULT_LOCALE is en', () => {
    expect(DEFAULT_LOCALE).toBe('en');
  });

  it('LOCALE_STORAGE_KEY is a non-empty string', () => {
    expect(typeof LOCALE_STORAGE_KEY).toBe('string');
    expect(LOCALE_STORAGE_KEY.length).toBeGreaterThan(0);
  });

  it('LOCALE_LABELS has an entry for every locale in LOCALES', () => {
    for (const locale of LOCALES) {
      expect(LOCALE_LABELS).toHaveProperty(locale);
      expect(typeof LOCALE_LABELS[locale]).toBe('string');
      expect(LOCALE_LABELS[locale].length).toBeGreaterThan(0);
    }
  });
});
