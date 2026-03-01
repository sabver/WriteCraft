import { describe, it, expect, beforeEach, vi } from 'vitest';

// detectLocale reads navigator.language, so we mock it at the module level
// and re-import detectLocale in each test to get the fresh value.

describe('detectLocale', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  async function getDetectLocale(language: string | undefined) {
    Object.defineProperty(globalThis, 'navigator', {
      value: language !== undefined ? { language } : undefined,
      writable: true,
      configurable: true,
    });
    const mod = await import('./detect');
    return mod.detectLocale;
  }

  it('returns zh-CN for navigator.language = "zh-CN"', async () => {
    const detectLocale = await getDetectLocale('zh-CN');
    expect(detectLocale()).toBe('zh-CN');
  });

  it('returns zh-CN for navigator.language = "zh-TW" (closest supported match)', async () => {
    const detectLocale = await getDetectLocale('zh-TW');
    expect(detectLocale()).toBe('zh-CN');
  });

  it('returns zh-CN for navigator.language = "zh"', async () => {
    const detectLocale = await getDetectLocale('zh');
    expect(detectLocale()).toBe('zh-CN');
  });

  it('returns en for navigator.language = "en-US"', async () => {
    const detectLocale = await getDetectLocale('en-US');
    expect(detectLocale()).toBe('en');
  });

  it('returns en for navigator.language = "en"', async () => {
    const detectLocale = await getDetectLocale('en');
    expect(detectLocale()).toBe('en');
  });

  it('returns en for navigator.language = "fr-FR" (unsupported)', async () => {
    const detectLocale = await getDetectLocale('fr-FR');
    expect(detectLocale()).toBe('en');
  });

  it('returns en for navigator.language = "" (empty string)', async () => {
    const detectLocale = await getDetectLocale('');
    expect(detectLocale()).toBe('en');
  });

  it('returns en when navigator is undefined (SSR)', async () => {
    const detectLocale = await getDetectLocale(undefined);
    expect(detectLocale()).toBe('en');
  });
});
