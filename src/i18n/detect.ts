import { DEFAULT_LOCALE, type Locale } from './config';

export function detectLocale(): Locale {
  const lang = (globalThis.navigator?.language ?? '').toLowerCase();
  if (lang.startsWith('zh')) return 'zh-CN';
  return DEFAULT_LOCALE;
}
