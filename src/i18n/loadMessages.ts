import type { Locale } from './config';

export async function loadMessages(locale: Locale): Promise<Record<string, unknown>> {
  try {
    const mod = await import(`../../messages/${locale}.json`);
    return (mod.default ?? mod) as Record<string, unknown>;
  } catch {
    const mod = await import('../../messages/en.json');
    return (mod.default ?? mod) as Record<string, unknown>;
  }
}
