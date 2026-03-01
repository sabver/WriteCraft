export const LOCALES = ['en', 'zh-CN'] as const;
export type Locale = typeof LOCALES[number];
export const DEFAULT_LOCALE: Locale = 'en';
export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  'zh-CN': '中文 (简体)',
};
export const LOCALE_STORAGE_KEY = 'writecraft-locale';
export const DEFAULT_TIME_ZONE = 'UTC';
